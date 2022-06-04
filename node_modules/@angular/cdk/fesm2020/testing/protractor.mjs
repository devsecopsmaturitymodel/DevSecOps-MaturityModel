import { TestKey, getNoKeysSpecifiedError, _getTextWithExcludedElements, HarnessEnvironment } from '@angular/cdk/testing';
import { Key, browser, Button, by, element } from 'protractor';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Maps the `TestKey` constants to Protractor's `Key` constants. */
const keyMap = {
    [TestKey.BACKSPACE]: Key.BACK_SPACE,
    [TestKey.TAB]: Key.TAB,
    [TestKey.ENTER]: Key.ENTER,
    [TestKey.SHIFT]: Key.SHIFT,
    [TestKey.CONTROL]: Key.CONTROL,
    [TestKey.ALT]: Key.ALT,
    [TestKey.ESCAPE]: Key.ESCAPE,
    [TestKey.PAGE_UP]: Key.PAGE_UP,
    [TestKey.PAGE_DOWN]: Key.PAGE_DOWN,
    [TestKey.END]: Key.END,
    [TestKey.HOME]: Key.HOME,
    [TestKey.LEFT_ARROW]: Key.ARROW_LEFT,
    [TestKey.UP_ARROW]: Key.ARROW_UP,
    [TestKey.RIGHT_ARROW]: Key.ARROW_RIGHT,
    [TestKey.DOWN_ARROW]: Key.ARROW_DOWN,
    [TestKey.INSERT]: Key.INSERT,
    [TestKey.DELETE]: Key.DELETE,
    [TestKey.F1]: Key.F1,
    [TestKey.F2]: Key.F2,
    [TestKey.F3]: Key.F3,
    [TestKey.F4]: Key.F4,
    [TestKey.F5]: Key.F5,
    [TestKey.F6]: Key.F6,
    [TestKey.F7]: Key.F7,
    [TestKey.F8]: Key.F8,
    [TestKey.F9]: Key.F9,
    [TestKey.F10]: Key.F10,
    [TestKey.F11]: Key.F11,
    [TestKey.F12]: Key.F12,
    [TestKey.META]: Key.META,
};
/** Converts a `ModifierKeys` object to a list of Protractor `Key`s. */
function toProtractorModifierKeys(modifiers) {
    const result = [];
    if (modifiers.control) {
        result.push(Key.CONTROL);
    }
    if (modifiers.alt) {
        result.push(Key.ALT);
    }
    if (modifiers.shift) {
        result.push(Key.SHIFT);
    }
    if (modifiers.meta) {
        result.push(Key.META);
    }
    return result;
}
/**
 * A `TestElement` implementation for Protractor.
 * @deprecated
 * @breaking-change 13.0.0
 */
class ProtractorElement {
    constructor(element) {
        this.element = element;
    }
    /** Blur the element. */
    async blur() {
        return browser.executeScript('arguments[0].blur()', this.element);
    }
    /** Clear the element's input (for input and textarea elements only). */
    async clear() {
        return this.element.clear();
    }
    async click(...args) {
        await this._dispatchClickEventSequence(args, Button.LEFT);
    }
    async rightClick(...args) {
        await this._dispatchClickEventSequence(args, Button.RIGHT);
    }
    /** Focus the element. */
    async focus() {
        return browser.executeScript('arguments[0].focus()', this.element);
    }
    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property) {
        return this.element.getCssValue(property);
    }
    /** Hovers the mouse over the element. */
    async hover() {
        return browser
            .actions()
            .mouseMove(await this.element.getWebElement())
            .perform();
    }
    /** Moves the mouse away from the element. */
    async mouseAway() {
        return browser
            .actions()
            .mouseMove(await this.element.getWebElement(), { x: -1, y: -1 })
            .perform();
    }
    async sendKeys(...modifiersAndKeys) {
        const first = modifiersAndKeys[0];
        let modifiers;
        let rest;
        if (first !== undefined && typeof first !== 'string' && typeof first !== 'number') {
            modifiers = first;
            rest = modifiersAndKeys.slice(1);
        }
        else {
            modifiers = {};
            rest = modifiersAndKeys;
        }
        const modifierKeys = toProtractorModifierKeys(modifiers);
        const keys = rest
            .map(k => (typeof k === 'string' ? k.split('') : [keyMap[k]]))
            .reduce((arr, k) => arr.concat(k), [])
            // Key.chord doesn't work well with geckodriver (mozilla/geckodriver#1502),
            // so avoid it if no modifier keys are required.
            .map(k => (modifierKeys.length > 0 ? Key.chord(...modifierKeys, k) : k));
        // Throw an error if no keys have been specified. Calling this function with no
        // keys should not result in a focus event being dispatched unexpectedly.
        if (keys.length === 0) {
            throw getNoKeysSpecifiedError();
        }
        return this.element.sendKeys(...keys);
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    async text(options) {
        if (options?.exclude) {
            return browser.executeScript(_getTextWithExcludedElements, this.element, options.exclude);
        }
        // We don't go through Protractor's `getText`, because it excludes text from hidden elements.
        return browser.executeScript(`return (arguments[0].textContent || '').trim()`, this.element);
    }
    /** Gets the value for the given attribute from the element. */
    async getAttribute(name) {
        return browser.executeScript(`return arguments[0].getAttribute(arguments[1])`, this.element, name);
    }
    /** Checks whether the element has the given class. */
    async hasClass(name) {
        const classes = (await this.getAttribute('class')) || '';
        return new Set(classes.split(/\s+/).filter(c => c)).has(name);
    }
    /** Gets the dimensions of the element. */
    async getDimensions() {
        const { width, height } = await this.element.getSize();
        const { x: left, y: top } = await this.element.getLocation();
        return { width, height, left, top };
    }
    /** Gets the value of a property of an element. */
    async getProperty(name) {
        return browser.executeScript(`return arguments[0][arguments[1]]`, this.element, name);
    }
    /** Sets the value of a property of an input. */
    async setInputValue(value) {
        return browser.executeScript(`arguments[0].value = arguments[1]`, this.element, value);
    }
    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes) {
        const options = await this.element.all(by.css('option'));
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.
        if (options.length && indexes.size) {
            // Reset the value so all the selected states are cleared. We can
            // reuse the input-specific method since the logic is the same.
            await this.setInputValue('');
            for (let i = 0; i < options.length; i++) {
                if (indexes.has(i)) {
                    // We have to hold the control key while clicking on options so that multiple can be
                    // selected in multi-selection mode. The key doesn't do anything for single selection.
                    await browser.actions().keyDown(Key.CONTROL).perform();
                    await options[i].click();
                    await browser.actions().keyUp(Key.CONTROL).perform();
                }
            }
        }
    }
    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector) {
        return browser.executeScript(`
          return (Element.prototype.matches ||
                  Element.prototype.msMatchesSelector).call(arguments[0], arguments[1])
          `, this.element, selector);
    }
    /** Checks whether the element is focused. */
    async isFocused() {
        return this.element.equals(browser.driver.switchTo().activeElement());
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    async dispatchEvent(name, data) {
        return browser.executeScript(_dispatchEvent, name, this.element, data);
    }
    /** Dispatches all the events that are part of a click event sequence. */
    async _dispatchClickEventSequence(args, button) {
        let modifiers = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop();
        }
        const modifierKeys = toProtractorModifierKeys(modifiers);
        // Omitting the offset argument to mouseMove results in clicking the center.
        // This is the default behavior we want, so we use an empty array of offsetArgs if
        // no args remain after popping the modifiers from the args passed to this function.
        const offsetArgs = (args.length === 2 ? [{ x: args[0], y: args[1] }] : []);
        let actions = browser.actions().mouseMove(await this.element.getWebElement(), ...offsetArgs);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyDown(modifierKey);
        }
        actions = actions.click(button);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyUp(modifierKey);
        }
        await actions.perform();
    }
}
/**
 * Dispatches an event with a particular name and data to an element.
 * Note that this needs to be a pure function, because it gets stringified by
 * Protractor and is executed inside the browser.
 */
function _dispatchEvent(name, element, data) {
    const event = document.createEvent('Event');
    event.initEvent(name);
    if (data) {
        // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the original object.
        Object.assign(event, data);
    }
    // This type has a string index signature, so we cannot access it using a dotted property access.
    element['dispatchEvent'](event);
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
    queryFn: (selector, root) => root.all(by.css(selector)),
};
/**
 * A `HarnessEnvironment` implementation for Protractor.
 * @deprecated As of v13.0.0, this environment no longer works, as it is not
 * compatible with the new [Angular Package Format](https://angular.io/guide/angular-package-format).
 * @breaking-change 13.0.0
 */
class ProtractorHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, options) {
        super(rawRootElement);
        this._options = { ...defaultEnvironmentOptions, ...options };
    }
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(options) {
        return new ProtractorHarnessEnvironment(element(by.css('body')), options);
    }
    /** Gets the ElementFinder corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof ProtractorElement) {
            return el.element;
        }
        throw Error('This TestElement was not created by the ProtractorHarnessEnvironment');
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() { }
    /** @docs-private */
    async waitForTasksOutsideAngular() {
        // TODO: figure out how we can do this for the protractor environment.
        // https://github.com/angular/components/issues/17412
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return element(by.css('body'));
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new ProtractorElement(element);
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new ProtractorHarnessEnvironment(element, this._options);
    }
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        const elementArrayFinder = this._options.queryFn(selector, this.rawRootElement);
        const length = await elementArrayFinder.count();
        const elements = [];
        for (let i = 0; i < length; i++) {
            elements.push(elementArrayFinder.get(i));
        }
        return elements;
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

export { ProtractorElement, ProtractorHarnessEnvironment };
//# sourceMappingURL=protractor.mjs.map
