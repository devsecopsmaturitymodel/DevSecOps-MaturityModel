import { getNoKeysSpecifiedError, TestKey, _getTextWithExcludedElements, handleAutoChangeDetectionStatus, stopHandlingAutoChangeDetectionStatus, HarnessEnvironment } from '@angular/cdk/testing';
import { flush } from '@angular/core/testing';
import { takeWhile } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as keyCodes from '@angular/cdk/keycodes';
import { PERIOD } from '@angular/cdk/keycodes';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Unique symbol that is used to patch a property to a proxy zone. */
const stateObservableSymbol = Symbol('ProxyZone_PATCHED#stateObservable');
/**
 * Interceptor that can be set up in a `ProxyZone` instance. The interceptor
 * will keep track of the task state and emit whenever the state changes.
 *
 * This serves as a workaround for https://github.com/angular/angular/issues/32896.
 */
class TaskStateZoneInterceptor {
    constructor(_lastState) {
        this._lastState = _lastState;
        /** Subject that can be used to emit a new state change. */
        this._stateSubject = new BehaviorSubject(this._lastState ? this._getTaskStateFromInternalZoneState(this._lastState) : { stable: true });
        /** Public observable that emits whenever the task state changes. */
        this.state = this._stateSubject;
    }
    /** This will be called whenever the task state changes in the intercepted zone. */
    onHasTask(delegate, current, target, hasTaskState) {
        if (current === target) {
            this._stateSubject.next(this._getTaskStateFromInternalZoneState(hasTaskState));
        }
    }
    /** Gets the task state from the internal ZoneJS task state. */
    _getTaskStateFromInternalZoneState(state) {
        return { stable: !state.macroTask && !state.microTask };
    }
    /**
     * Sets up the custom task state Zone interceptor in the  `ProxyZone`. Throws if
     * no `ProxyZone` could be found.
     * @returns an observable that emits whenever the task state changes.
     */
    static setup() {
        if (Zone === undefined) {
            throw Error('Could not find ZoneJS. For test harnesses running in TestBed, ' +
                'ZoneJS needs to be installed.');
        }
        // tslint:disable-next-line:variable-name
        const ProxyZoneSpec = Zone['ProxyZoneSpec'];
        // If there is no "ProxyZoneSpec" installed, we throw an error and recommend
        // setting up the proxy zone by pulling in the testing bundle.
        if (!ProxyZoneSpec) {
            throw Error('ProxyZoneSpec is needed for the test harnesses but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/zone-testing.js');
        }
        // Ensure that there is a proxy zone instance set up, and get
        // a reference to the instance if present.
        const zoneSpec = ProxyZoneSpec.assertPresent();
        // If there already is a delegate registered in the proxy zone, and it
        // is type of the custom task state interceptor, we just use that state
        // observable. This allows us to only intercept Zone once per test
        // (similar to how `fakeAsync` or `async` work).
        if (zoneSpec[stateObservableSymbol]) {
            return zoneSpec[stateObservableSymbol];
        }
        // Since we intercept on environment creation and the fixture has been
        // created before, we might have missed tasks scheduled before. Fortunately
        // the proxy zone keeps track of the previous task state, so we can just pass
        // this as initial state to the task zone interceptor.
        const interceptor = new TaskStateZoneInterceptor(zoneSpec.lastTaskState);
        const zoneSpecOnHasTask = zoneSpec.onHasTask.bind(zoneSpec);
        // We setup the task state interceptor in the `ProxyZone`. Note that we cannot register
        // the interceptor as a new proxy zone delegate because it would mean that other zone
        // delegates (e.g. `FakeAsyncTestZone` or `AsyncTestZone`) can accidentally overwrite/disable
        // our interceptor. Since we just intend to monitor the task state of the proxy zone, it is
        // sufficient to just patch the proxy zone. This also avoids that we interfere with the task
        // queue scheduling logic.
        zoneSpec.onHasTask = function (...args) {
            zoneSpecOnHasTask(...args);
            interceptor.onHasTask(...args);
        };
        return (zoneSpec[stateObservableSymbol] = interceptor.state);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Used to generate unique IDs for events. */
let uniqueIds = 0;
/**
 * Creates a browser MouseEvent with the specified options.
 * @docs-private
 */
function createMouseEvent(type, clientX = 0, clientY = 0, button = 0, modifiers = {}) {
    // Note: We cannot determine the position of the mouse event based on the screen
    // because the dimensions and position of the browser window are not available
    // To provide reasonable `screenX` and `screenY` coordinates, we simply use the
    // client coordinates as if the browser is opened in fullscreen.
    const screenX = clientX;
    const screenY = clientY;
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
        detail: 0,
        relatedTarget: null,
        screenX,
        screenY,
        clientX,
        clientY,
        ctrlKey: modifiers.control,
        altKey: modifiers.alt,
        shiftKey: modifiers.shift,
        metaKey: modifiers.meta,
        button: button,
        buttons: 1,
    });
    // The `MouseEvent` constructor doesn't allow us to pass these properties into the constructor.
    // Override them to `1`, because they're used for fake screen reader event detection.
    defineReadonlyEventProperty(event, 'offsetX', 1);
    defineReadonlyEventProperty(event, 'offsetY', 1);
    return event;
}
/**
 * Creates a browser `PointerEvent` with the specified options. Pointer events
 * by default will appear as if they are the primary pointer of their type.
 * https://www.w3.org/TR/pointerevents2/#dom-pointerevent-isprimary.
 *
 * For example, if pointer events for a multi-touch interaction are created, the non-primary
 * pointer touches would need to be represented by non-primary pointer events.
 *
 * @docs-private
 */
function createPointerEvent(type, clientX = 0, clientY = 0, options = { isPrimary: true }) {
    return new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
        clientX,
        clientY,
        ...options,
    });
}
/**
 * Creates a browser TouchEvent with the specified pointer coordinates.
 * @docs-private
 */
function createTouchEvent(type, pageX = 0, pageY = 0, clientX = 0, clientY = 0) {
    // We cannot use the `TouchEvent` or `Touch` because Firefox and Safari lack support.
    // TODO: Switch to the constructor API when it is available for Firefox and Safari.
    const event = document.createEvent('UIEvent');
    const touchDetails = { pageX, pageY, clientX, clientY, identifier: uniqueIds++ };
    // TS3.6 removes the initUIEvent method and suggests porting to "new UIEvent()".
    event.initUIEvent(type, true, true, window, 0);
    // Most of the browsers don't have a "initTouchEvent" method that can be used to define
    // the touch details.
    defineReadonlyEventProperty(event, 'touches', [touchDetails]);
    defineReadonlyEventProperty(event, 'targetTouches', [touchDetails]);
    defineReadonlyEventProperty(event, 'changedTouches', [touchDetails]);
    return event;
}
/**
 * Creates a keyboard event with the specified key and modifiers.
 * @docs-private
 */
function createKeyboardEvent(type, keyCode = 0, key = '', modifiers = {}) {
    return new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
        keyCode: keyCode,
        key: key,
        shiftKey: modifiers.shift,
        metaKey: modifiers.meta,
        altKey: modifiers.alt,
        ctrlKey: modifiers.control,
    });
}
/**
 * Creates a fake event object with any desired event type.
 * @docs-private
 */
function createFakeEvent(type, bubbles = false, cancelable = true, composed = true) {
    return new Event(type, { bubbles, cancelable, composed });
}
/**
 * Defines a readonly property on the given event object. Readonly properties on an event object
 * are always set as configurable as that matches default readonly properties for DOM event objects.
 */
function defineReadonlyEventProperty(event, propertyName, value) {
    Object.defineProperty(event, propertyName, { get: () => value, configurable: true });
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Utility to dispatch any event on a Node.
 * @docs-private
 */
function dispatchEvent(node, event) {
    node.dispatchEvent(event);
    return event;
}
/**
 * Shorthand to dispatch a fake event on a specified node.
 * @docs-private
 */
function dispatchFakeEvent(node, type, bubbles) {
    return dispatchEvent(node, createFakeEvent(type, bubbles));
}
/**
 * Shorthand to dispatch a keyboard event with a specified key code and
 * optional modifiers.
 * @docs-private
 */
function dispatchKeyboardEvent(node, type, keyCode, key, modifiers) {
    return dispatchEvent(node, createKeyboardEvent(type, keyCode, key, modifiers));
}
/**
 * Shorthand to dispatch a mouse event on the specified coordinates.
 * @docs-private
 */
function dispatchMouseEvent(node, type, clientX = 0, clientY = 0, button, modifiers) {
    return dispatchEvent(node, createMouseEvent(type, clientX, clientY, button, modifiers));
}
/**
 * Shorthand to dispatch a pointer event on the specified coordinates.
 * @docs-private
 */
function dispatchPointerEvent(node, type, clientX = 0, clientY = 0, options) {
    return dispatchEvent(node, createPointerEvent(type, clientX, clientY, options));
}
/**
 * Shorthand to dispatch a touch event on the specified coordinates.
 * @docs-private
 */
function dispatchTouchEvent(node, type, pageX = 0, pageY = 0, clientX = 0, clientY = 0) {
    return dispatchEvent(node, createTouchEvent(type, pageX, pageY, clientX, clientY));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function triggerFocusChange(element, event) {
    let eventFired = false;
    const handler = () => (eventFired = true);
    element.addEventListener(event, handler);
    element[event]();
    element.removeEventListener(event, handler);
    if (!eventFired) {
        dispatchFakeEvent(element, event);
    }
}
/**
 * Patches an elements focus and blur methods to emit events consistently and predictably.
 * This is necessary, because some browsers can call the focus handlers asynchronously,
 * while others won't fire them at all if the browser window is not focused.
 * @docs-private
 */
// TODO: Check if this element focus patching is still needed for local testing,
// where browser is not necessarily focused.
function patchElementFocus(element) {
    element.focus = () => dispatchFakeEvent(element, 'focus');
    element.blur = () => dispatchFakeEvent(element, 'blur');
}
/** @docs-private */
function triggerFocus(element) {
    triggerFocusChange(element, 'focus');
}
/** @docs-private */
function triggerBlur(element) {
    triggerFocusChange(element, 'blur');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Input types for which the value can be entered incrementally. */
const incrementalInputTypes = new Set([
    'text',
    'email',
    'hidden',
    'password',
    'search',
    'tel',
    'url',
]);
/**
 * Checks whether the given Element is a text input element.
 * @docs-private
 */
function isTextInput(element) {
    const nodeName = element.nodeName.toLowerCase();
    return nodeName === 'input' || nodeName === 'textarea';
}
function typeInElement(element, ...modifiersAndKeys) {
    const first = modifiersAndKeys[0];
    let modifiers;
    let rest;
    if (first !== undefined &&
        typeof first !== 'string' &&
        first.keyCode === undefined &&
        first.key === undefined) {
        modifiers = first;
        rest = modifiersAndKeys.slice(1);
    }
    else {
        modifiers = {};
        rest = modifiersAndKeys;
    }
    const isInput = isTextInput(element);
    const inputType = element.getAttribute('type') || 'text';
    const keys = rest
        .map(k => typeof k === 'string'
        ? k.split('').map(c => ({ keyCode: c.toUpperCase().charCodeAt(0), key: c }))
        : [k])
        .reduce((arr, k) => arr.concat(k), []);
    // Throw an error if no keys have been specified. Calling this function with no
    // keys should not result in a focus event being dispatched unexpectedly.
    if (keys.length === 0) {
        throw getNoKeysSpecifiedError();
    }
    // We simulate the user typing in a value by incrementally assigning the value below. The problem
    // is that for some input types, the browser won't allow for an invalid value to be set via the
    // `value` property which will always be the case when going character-by-character. If we detect
    // such an input, we have to set the value all at once or listeners to the `input` event (e.g.
    // the `ReactiveFormsModule` uses such an approach) won't receive the correct value.
    const enterValueIncrementally = inputType === 'number'
        ? // The value can be set character by character in number inputs if it doesn't have any decimals.
            keys.every(key => key.key !== '.' && key.key !== '-' && key.keyCode !== PERIOD)
        : incrementalInputTypes.has(inputType);
    triggerFocus(element);
    // When we aren't entering the value incrementally, assign it all at once ahead
    // of time so that any listeners to the key events below will have access to it.
    if (!enterValueIncrementally) {
        element.value = keys.reduce((value, key) => value + (key.key || ''), '');
    }
    for (const key of keys) {
        dispatchKeyboardEvent(element, 'keydown', key.keyCode, key.key, modifiers);
        dispatchKeyboardEvent(element, 'keypress', key.keyCode, key.key, modifiers);
        if (isInput && key.key && key.key.length === 1) {
            if (enterValueIncrementally) {
                element.value += key.key;
                dispatchFakeEvent(element, 'input');
            }
        }
        dispatchKeyboardEvent(element, 'keyup', key.keyCode, key.key, modifiers);
    }
    // Since we weren't dispatching `input` events while sending the keys, we have to do it now.
    if (!enterValueIncrementally) {
        dispatchFakeEvent(element, 'input');
    }
}
/**
 * Clears the text in an input or textarea element.
 * @docs-private
 */
function clearElement(element) {
    triggerFocus(element);
    element.value = '';
    dispatchFakeEvent(element, 'input');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Maps `TestKey` constants to the `keyCode` and `key` values used by native browser events. */
const keyMap = {
    [TestKey.BACKSPACE]: { keyCode: keyCodes.BACKSPACE, key: 'Backspace' },
    [TestKey.TAB]: { keyCode: keyCodes.TAB, key: 'Tab' },
    [TestKey.ENTER]: { keyCode: keyCodes.ENTER, key: 'Enter' },
    [TestKey.SHIFT]: { keyCode: keyCodes.SHIFT, key: 'Shift' },
    [TestKey.CONTROL]: { keyCode: keyCodes.CONTROL, key: 'Control' },
    [TestKey.ALT]: { keyCode: keyCodes.ALT, key: 'Alt' },
    [TestKey.ESCAPE]: { keyCode: keyCodes.ESCAPE, key: 'Escape' },
    [TestKey.PAGE_UP]: { keyCode: keyCodes.PAGE_UP, key: 'PageUp' },
    [TestKey.PAGE_DOWN]: { keyCode: keyCodes.PAGE_DOWN, key: 'PageDown' },
    [TestKey.END]: { keyCode: keyCodes.END, key: 'End' },
    [TestKey.HOME]: { keyCode: keyCodes.HOME, key: 'Home' },
    [TestKey.LEFT_ARROW]: { keyCode: keyCodes.LEFT_ARROW, key: 'ArrowLeft' },
    [TestKey.UP_ARROW]: { keyCode: keyCodes.UP_ARROW, key: 'ArrowUp' },
    [TestKey.RIGHT_ARROW]: { keyCode: keyCodes.RIGHT_ARROW, key: 'ArrowRight' },
    [TestKey.DOWN_ARROW]: { keyCode: keyCodes.DOWN_ARROW, key: 'ArrowDown' },
    [TestKey.INSERT]: { keyCode: keyCodes.INSERT, key: 'Insert' },
    [TestKey.DELETE]: { keyCode: keyCodes.DELETE, key: 'Delete' },
    [TestKey.F1]: { keyCode: keyCodes.F1, key: 'F1' },
    [TestKey.F2]: { keyCode: keyCodes.F2, key: 'F2' },
    [TestKey.F3]: { keyCode: keyCodes.F3, key: 'F3' },
    [TestKey.F4]: { keyCode: keyCodes.F4, key: 'F4' },
    [TestKey.F5]: { keyCode: keyCodes.F5, key: 'F5' },
    [TestKey.F6]: { keyCode: keyCodes.F6, key: 'F6' },
    [TestKey.F7]: { keyCode: keyCodes.F7, key: 'F7' },
    [TestKey.F8]: { keyCode: keyCodes.F8, key: 'F8' },
    [TestKey.F9]: { keyCode: keyCodes.F9, key: 'F9' },
    [TestKey.F10]: { keyCode: keyCodes.F10, key: 'F10' },
    [TestKey.F11]: { keyCode: keyCodes.F11, key: 'F11' },
    [TestKey.F12]: { keyCode: keyCodes.F12, key: 'F12' },
    [TestKey.META]: { keyCode: keyCodes.META, key: 'Meta' },
};
/** A `TestElement` implementation for unit tests. */
class UnitTestElement {
    constructor(element, _stabilize) {
        this.element = element;
        this._stabilize = _stabilize;
    }
    /** Blur the element. */
    async blur() {
        triggerBlur(this.element);
        await this._stabilize();
    }
    /** Clear the element's input (for input and textarea elements only). */
    async clear() {
        if (!isTextInput(this.element)) {
            throw Error('Attempting to clear an invalid element');
        }
        clearElement(this.element);
        await this._stabilize();
    }
    async click(...args) {
        const isDisabled = this.element.disabled === true;
        // If the element is `disabled` and has a `disabled` property, we emit the mouse event
        // sequence but not dispatch the `click` event. This is necessary to keep the behavior
        // consistent with an actual user interaction. The click event is not necessarily
        // automatically prevented by the browser. There is mismatch between Firefox and Chromium:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=329509.
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1115661.
        await this._dispatchMouseEventSequence(isDisabled ? null : 'click', args, 0);
        await this._stabilize();
    }
    async rightClick(...args) {
        await this._dispatchMouseEventSequence('contextmenu', args, 2);
        await this._stabilize();
    }
    /** Focus the element. */
    async focus() {
        triggerFocus(this.element);
        await this._stabilize();
    }
    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property) {
        await this._stabilize();
        // TODO(mmalerba): Consider adding value normalization if we run into common cases where its
        //  needed.
        return getComputedStyle(this.element).getPropertyValue(property);
    }
    /** Hovers the mouse over the element. */
    async hover() {
        this._dispatchPointerEventIfSupported('pointerenter');
        dispatchMouseEvent(this.element, 'mouseover');
        dispatchMouseEvent(this.element, 'mouseenter');
        await this._stabilize();
    }
    /** Moves the mouse away from the element. */
    async mouseAway() {
        this._dispatchPointerEventIfSupported('pointerleave');
        dispatchMouseEvent(this.element, 'mouseout');
        dispatchMouseEvent(this.element, 'mouseleave');
        await this._stabilize();
    }
    async sendKeys(...modifiersAndKeys) {
        const args = modifiersAndKeys.map(k => (typeof k === 'number' ? keyMap[k] : k));
        typeInElement(this.element, ...args);
        await this._stabilize();
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    async text(options) {
        await this._stabilize();
        if (options?.exclude) {
            return _getTextWithExcludedElements(this.element, options.exclude);
        }
        return (this.element.textContent || '').trim();
    }
    /** Gets the value for the given attribute from the element. */
    async getAttribute(name) {
        await this._stabilize();
        return this.element.getAttribute(name);
    }
    /** Checks whether the element has the given class. */
    async hasClass(name) {
        await this._stabilize();
        return this.element.classList.contains(name);
    }
    /** Gets the dimensions of the element. */
    async getDimensions() {
        await this._stabilize();
        return this.element.getBoundingClientRect();
    }
    /** Gets the value of a property of an element. */
    async getProperty(name) {
        await this._stabilize();
        return this.element[name];
    }
    /** Sets the value of a property of an input. */
    async setInputValue(value) {
        this.element.value = value;
        await this._stabilize();
    }
    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes) {
        let hasChanged = false;
        const options = this.element.querySelectorAll('option');
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const wasSelected = option.selected;
            // We have to go through `option.selected`, because `HTMLSelectElement.value` doesn't
            // allow for multiple options to be selected, even in `multiple` mode.
            option.selected = indexes.has(i);
            if (option.selected !== wasSelected) {
                hasChanged = true;
                dispatchFakeEvent(this.element, 'change');
            }
        }
        if (hasChanged) {
            await this._stabilize();
        }
    }
    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector) {
        await this._stabilize();
        const elementPrototype = Element.prototype;
        return (elementPrototype['matches'] || elementPrototype['msMatchesSelector']).call(this.element, selector);
    }
    /** Checks whether the element is focused. */
    async isFocused() {
        await this._stabilize();
        return document.activeElement === this.element;
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    async dispatchEvent(name, data) {
        const event = createFakeEvent(name);
        if (data) {
            // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the original object.
            Object.assign(event, data);
        }
        dispatchEvent(this.element, event);
        await this._stabilize();
    }
    /**
     * Dispatches a pointer event on the current element if the browser supports it.
     * @param name Name of the pointer event to be dispatched.
     * @param clientX Coordinate of the user's pointer along the X axis.
     * @param clientY Coordinate of the user's pointer along the Y axis.
     * @param button Mouse button that should be pressed when dispatching the event.
     */
    _dispatchPointerEventIfSupported(name, clientX, clientY, button) {
        // The latest versions of all browsers we support have the new `PointerEvent` API.
        // Though since we capture the two most recent versions of these browsers, we also
        // need to support Safari 12 at time of writing. Safari 12 does not have support for this,
        // so we need to conditionally create and dispatch these events based on feature detection.
        if (typeof PointerEvent !== 'undefined' && PointerEvent) {
            dispatchPointerEvent(this.element, name, clientX, clientY, { isPrimary: true, button });
        }
    }
    /**
     * Dispatches all the events that are part of a mouse event sequence
     * and then emits a given primary event at the end, if speciifed.
     */
    async _dispatchMouseEventSequence(primaryEventName, args, button) {
        let clientX = undefined;
        let clientY = undefined;
        let modifiers = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop();
        }
        if (args.length) {
            const { left, top, width, height } = await this.getDimensions();
            const relativeX = args[0] === 'center' ? width / 2 : args[0];
            const relativeY = args[0] === 'center' ? height / 2 : args[1];
            // Round the computed click position as decimal pixels are not
            // supported by mouse events and could lead to unexpected results.
            clientX = Math.round(left + relativeX);
            clientY = Math.round(top + relativeY);
        }
        this._dispatchPointerEventIfSupported('pointerdown', clientX, clientY, button);
        dispatchMouseEvent(this.element, 'mousedown', clientX, clientY, button, modifiers);
        this._dispatchPointerEventIfSupported('pointerup', clientX, clientY, button);
        dispatchMouseEvent(this.element, 'mouseup', clientX, clientY, button, modifiers);
        // If a primary event name is specified, emit it after the mouse event sequence.
        if (primaryEventName !== null) {
            dispatchMouseEvent(this.element, primaryEventName, clientX, clientY, button, modifiers);
        }
        // This call to _stabilize should not be needed since the callers will already do that them-
        // selves. Nevertheless it breaks some tests in g3 without it. It needs to be investigated
        // why removing breaks those tests.
        // See: https://github.com/angular/components/pull/20758/files#r520886256.
        await this._stabilize();
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: (selector, root) => root.querySelectorAll(selector),
};
/** Whether auto change detection is currently disabled. */
let disableAutoChangeDetection = false;
/**
 * The set of non-destroyed fixtures currently being used by `TestbedHarnessEnvironment` instances.
 */
const activeFixtures = new Set();
/**
 * Installs a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to handle change detection batching for.
 */
function installAutoChangeDetectionStatusHandler(fixture) {
    if (!activeFixtures.size) {
        handleAutoChangeDetectionStatus(({ isDisabled, onDetectChangesNow }) => {
            disableAutoChangeDetection = isDisabled;
            if (onDetectChangesNow) {
                Promise.all(Array.from(activeFixtures).map(detectChanges)).then(onDetectChangesNow);
            }
        });
    }
    activeFixtures.add(fixture);
}
/**
 * Uninstalls a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to stop handling change detection batching for.
 */
function uninstallAutoChangeDetectionStatusHandler(fixture) {
    activeFixtures.delete(fixture);
    if (!activeFixtures.size) {
        stopHandlingAutoChangeDetectionStatus();
    }
}
/** Whether we are currently in the fake async zone. */
function isInFakeAsyncZone() {
    return Zone.current.get('FakeAsyncTestZoneSpec') != null;
}
/**
 * Triggers change detection for a specific fixture.
 * @param fixture The fixture to trigger change detection for.
 */
async function detectChanges(fixture) {
    fixture.detectChanges();
    if (isInFakeAsyncZone()) {
        flush();
    }
    else {
        await fixture.whenStable();
    }
}
/** A `HarnessEnvironment` implementation for Angular's Testbed. */
class TestbedHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, _fixture, options) {
        super(rawRootElement);
        this._fixture = _fixture;
        /** Whether the environment has been destroyed. */
        this._destroyed = false;
        this._options = { ...defaultEnvironmentOptions, ...options };
        this._taskState = TaskStateZoneInterceptor.setup();
        this._stabilizeCallback = () => this.forceStabilize();
        installAutoChangeDetectionStatusHandler(_fixture);
        _fixture.componentRef.onDestroy(() => {
            uninstallAutoChangeDetectionStatusHandler(_fixture);
            this._destroyed = true;
        });
    }
    /** Creates a `HarnessLoader` rooted at the given fixture's root element. */
    static loader(fixture, options) {
        return new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
    }
    /**
     * Creates a `HarnessLoader` at the document root. This can be used if harnesses are
     * located outside of a fixture (e.g. overlays appended to the document body).
     */
    static documentRootLoader(fixture, options) {
        return new TestbedHarnessEnvironment(document.body, fixture, options);
    }
    /** Gets the native DOM element corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof UnitTestElement) {
            return el.element;
        }
        throw Error('This TestElement was not created by the TestbedHarnessEnvironment');
    }
    /**
     * Creates an instance of the given harness type, using the fixture's root element as the
     * harness's host element. This method should be used when creating a harness for the root element
     * of a fixture, as components do not have the correct selector when they are created as the root
     * of the fixture.
     */
    static async harnessForFixture(fixture, harnessType, options) {
        const environment = new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
        await environment.forceStabilize();
        return environment.createComponentHarness(harnessType, fixture.nativeElement);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        if (!disableAutoChangeDetection) {
            if (this._destroyed) {
                throw Error('Harness is attempting to use a fixture that has already been destroyed.');
            }
            await detectChanges(this._fixture);
        }
    }
    /**
     * Waits for all scheduled or running async tasks to complete. This allows harness
     * authors to wait for async tasks outside of the Angular zone.
     */
    async waitForTasksOutsideAngular() {
        // If we run in the fake async zone, we run "flush" to run any scheduled tasks. This
        // ensures that the harnesses behave inside of the FakeAsyncTestZone similar to the
        // "AsyncTestZone" and the root zone (i.e. neither fakeAsync or async). Note that we
        // cannot just rely on the task state observable to become stable because the state will
        // never change. This is because the task queue will be only drained if the fake async
        // zone is being flushed.
        if (isInFakeAsyncZone()) {
            flush();
        }
        // Wait until the task queue has been drained and the zone is stable. Note that
        // we cannot rely on "fixture.whenStable" since it does not catch tasks scheduled
        // outside of the Angular zone. For test harnesses, we want to ensure that the
        // app is fully stabilized and therefore need to use our own zone interceptor.
        await this._taskState.pipe(takeWhile(state => !state.stable)).toPromise();
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return document.body;
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new UnitTestElement(element, this._stabilizeCallback);
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new TestbedHarnessEnvironment(element, this._fixture, this._options);
    }
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        await this.forceStabilize();
        return Array.from(this._options.queryFn(selector, this.rawRootElement));
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { TestbedHarnessEnvironment, UnitTestElement };
//# sourceMappingURL=testbed.mjs.map
