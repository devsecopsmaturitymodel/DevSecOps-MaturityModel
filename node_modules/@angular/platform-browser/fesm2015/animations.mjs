/**
 * @license Angular v13.3.10
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { ViewEncapsulation, Injectable, Inject, InjectionToken, RendererFactory2, NgZone, NgModule } from '@angular/core';
import { ɵDomRendererFactory2, BrowserModule } from '@angular/platform-browser';
import { AnimationBuilder, sequence, AnimationFactory } from '@angular/animations';
import * as i1 from '@angular/animations/browser';
import { ɵAnimationEngine, ɵWebAnimationsStyleNormalizer, ɵAnimationStyleNormalizer, AnimationDriver, ɵWebAnimationsDriver, ɵNoopAnimationDriver } from '@angular/animations/browser';
import { DOCUMENT } from '@angular/common';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class BrowserAnimationBuilder extends AnimationBuilder {
    constructor(rootRenderer, doc) {
        super();
        this._nextAnimationId = 0;
        const typeData = { id: '0', encapsulation: ViewEncapsulation.None, styles: [], data: { animation: [] } };
        this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    }
    build(animation) {
        const id = this._nextAnimationId.toString();
        this._nextAnimationId++;
        const entry = Array.isArray(animation) ? sequence(animation) : animation;
        issueAnimationCommand(this._renderer, null, id, 'register', [entry]);
        return new BrowserAnimationFactory(id, this._renderer);
    }
}
BrowserAnimationBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder, deps: [{ token: i0.RendererFactory2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
BrowserAnimationBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.RendererFactory2 }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    } });
class BrowserAnimationFactory extends AnimationFactory {
    constructor(_id, _renderer) {
        super();
        this._id = _id;
        this._renderer = _renderer;
    }
    create(element, options) {
        return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
    }
}
class RendererAnimationPlayer {
    constructor(id, element, options, _renderer) {
        this.id = id;
        this.element = element;
        this._renderer = _renderer;
        this.parentPlayer = null;
        this._started = false;
        this.totalTime = 0;
        this._command('create', options);
    }
    _listen(eventName, callback) {
        return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
    }
    _command(command, ...args) {
        return issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    }
    onDone(fn) {
        this._listen('done', fn);
    }
    onStart(fn) {
        this._listen('start', fn);
    }
    onDestroy(fn) {
        this._listen('destroy', fn);
    }
    init() {
        this._command('init');
    }
    hasStarted() {
        return this._started;
    }
    play() {
        this._command('play');
        this._started = true;
    }
    pause() {
        this._command('pause');
    }
    restart() {
        this._command('restart');
    }
    finish() {
        this._command('finish');
    }
    destroy() {
        this._command('destroy');
    }
    reset() {
        this._command('reset');
        this._started = false;
    }
    setPosition(p) {
        this._command('setPosition', p);
    }
    getPosition() {
        var _a, _b;
        return (_b = (_a = this._renderer.engine.players[+this.id]) === null || _a === void 0 ? void 0 : _a.getPosition()) !== null && _b !== void 0 ? _b : 0;
    }
}
function issueAnimationCommand(renderer, element, id, command, args) {
    return renderer.setProperty(element, `@@${id}:${command}`, args);
}

const ANIMATION_PREFIX = '@';
const DISABLE_ANIMATIONS_FLAG = '@.disabled';
class AnimationRendererFactory {
    constructor(delegate, engine, _zone) {
        this.delegate = delegate;
        this.engine = engine;
        this._zone = _zone;
        this._currentId = 0;
        this._microtaskId = 1;
        this._animationCallbacksBuffer = [];
        this._rendererCache = new Map();
        this._cdRecurDepth = 0;
        this.promise = Promise.resolve(0);
        engine.onRemovalComplete = (element, delegate) => {
            // Note: if a component element has a leave animation, and a host leave animation,
            // the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            const parentNode = delegate === null || delegate === void 0 ? void 0 : delegate.parentNode(element);
            if (parentNode) {
                delegate.removeChild(parentNode, element);
            }
        };
    }
    createRenderer(hostElement, type) {
        const EMPTY_NAMESPACE_ID = '';
        // cache the delegates to find out which cached delegate can
        // be used by which cached renderer
        const delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation']) {
            let renderer = this._rendererCache.get(delegate);
            if (!renderer) {
                renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine);
                // only cache this result when the base renderer is used
                this._rendererCache.set(delegate, renderer);
            }
            return renderer;
        }
        const componentId = type.id;
        const namespaceId = type.id + '-' + this._currentId;
        this._currentId++;
        this.engine.register(namespaceId, hostElement);
        const registerTrigger = (trigger) => {
            if (Array.isArray(trigger)) {
                trigger.forEach(registerTrigger);
            }
            else {
                this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger);
            }
        };
        const animationTriggers = type.data['animation'];
        animationTriggers.forEach(registerTrigger);
        return new AnimationRenderer(this, namespaceId, delegate, this.engine);
    }
    begin() {
        this._cdRecurDepth++;
        if (this.delegate.begin) {
            this.delegate.begin();
        }
    }
    _scheduleCountTask() {
        // always use promise to schedule microtask instead of use Zone
        this.promise.then(() => {
            this._microtaskId++;
        });
    }
    /** @internal */
    scheduleListenerCallback(count, fn, data) {
        if (count >= 0 && count < this._microtaskId) {
            this._zone.run(() => fn(data));
            return;
        }
        if (this._animationCallbacksBuffer.length == 0) {
            Promise.resolve(null).then(() => {
                this._zone.run(() => {
                    this._animationCallbacksBuffer.forEach(tuple => {
                        const [fn, data] = tuple;
                        fn(data);
                    });
                    this._animationCallbacksBuffer = [];
                });
            });
        }
        this._animationCallbacksBuffer.push([fn, data]);
    }
    end() {
        this._cdRecurDepth--;
        // this is to prevent animations from running twice when an inner
        // component does CD when a parent component instead has inserted it
        if (this._cdRecurDepth == 0) {
            this._zone.runOutsideAngular(() => {
                this._scheduleCountTask();
                this.engine.flush(this._microtaskId);
            });
        }
        if (this.delegate.end) {
            this.delegate.end();
        }
    }
    whenRenderingDone() {
        return this.engine.whenRenderingDone();
    }
}
AnimationRendererFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: AnimationRendererFactory, deps: [{ token: i0.RendererFactory2 }, { token: i1.ɵAnimationEngine }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
AnimationRendererFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: AnimationRendererFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: AnimationRendererFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.RendererFactory2 }, { type: i1.ɵAnimationEngine }, { type: i0.NgZone }]; } });
class BaseAnimationRenderer {
    constructor(namespaceId, delegate, engine) {
        this.namespaceId = namespaceId;
        this.delegate = delegate;
        this.engine = engine;
        this.destroyNode = this.delegate.destroyNode ? (n) => delegate.destroyNode(n) : null;
    }
    get data() {
        return this.delegate.data;
    }
    destroy() {
        this.engine.destroy(this.namespaceId, this.delegate);
        this.delegate.destroy();
    }
    createElement(name, namespace) {
        return this.delegate.createElement(name, namespace);
    }
    createComment(value) {
        return this.delegate.createComment(value);
    }
    createText(value) {
        return this.delegate.createText(value);
    }
    appendChild(parent, newChild) {
        this.delegate.appendChild(parent, newChild);
        this.engine.onInsert(this.namespaceId, newChild, parent, false);
    }
    insertBefore(parent, newChild, refChild, isMove = true) {
        this.delegate.insertBefore(parent, newChild, refChild);
        // If `isMove` true than we should animate this insert.
        this.engine.onInsert(this.namespaceId, newChild, parent, isMove);
    }
    removeChild(parent, oldChild, isHostElement) {
        this.engine.onRemove(this.namespaceId, oldChild, this.delegate, isHostElement);
    }
    selectRootElement(selectorOrNode, preserveContent) {
        return this.delegate.selectRootElement(selectorOrNode, preserveContent);
    }
    parentNode(node) {
        return this.delegate.parentNode(node);
    }
    nextSibling(node) {
        return this.delegate.nextSibling(node);
    }
    setAttribute(el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    }
    removeAttribute(el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    }
    addClass(el, name) {
        this.delegate.addClass(el, name);
    }
    removeClass(el, name) {
        this.delegate.removeClass(el, name);
    }
    setStyle(el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    }
    removeStyle(el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    }
    setProperty(el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX && name == DISABLE_ANIMATIONS_FLAG) {
            this.disableAnimations(el, !!value);
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    }
    setValue(node, value) {
        this.delegate.setValue(node, value);
    }
    listen(target, eventName, callback) {
        return this.delegate.listen(target, eventName, callback);
    }
    disableAnimations(element, value) {
        this.engine.disableAnimations(element, value);
    }
}
class AnimationRenderer extends BaseAnimationRenderer {
    constructor(factory, namespaceId, delegate, engine) {
        super(namespaceId, delegate, engine);
        this.factory = factory;
        this.namespaceId = namespaceId;
    }
    setProperty(el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX) {
            if (name.charAt(1) == '.' && name == DISABLE_ANIMATIONS_FLAG) {
                value = value === undefined ? true : !!value;
                this.disableAnimations(el, value);
            }
            else {
                this.engine.process(this.namespaceId, el, name.substr(1), value);
            }
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    }
    listen(target, eventName, callback) {
        if (eventName.charAt(0) == ANIMATION_PREFIX) {
            const element = resolveElementFromTarget(target);
            let name = eventName.substr(1);
            let phase = '';
            // @listener.phase is for trigger animation callbacks
            // @@listener is for animation builder callbacks
            if (name.charAt(0) != ANIMATION_PREFIX) {
                [name, phase] = parseTriggerCallbackName(name);
            }
            return this.engine.listen(this.namespaceId, element, name, phase, event => {
                const countId = event['_data'] || -1;
                this.factory.scheduleListenerCallback(countId, callback, event);
            });
        }
        return this.delegate.listen(target, eventName, callback);
    }
}
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
function parseTriggerCallbackName(triggerName) {
    const dotIndex = triggerName.indexOf('.');
    const trigger = triggerName.substring(0, dotIndex);
    const phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class InjectableAnimationEngine extends ɵAnimationEngine {
    constructor(doc, driver, normalizer) {
        super(doc.body, driver, normalizer);
    }
    ngOnDestroy() {
        this.flush();
    }
}
InjectableAnimationEngine.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: InjectableAnimationEngine, deps: [{ token: DOCUMENT }, { token: i1.AnimationDriver }, { token: i1.ɵAnimationStyleNormalizer }], target: i0.ɵɵFactoryTarget.Injectable });
InjectableAnimationEngine.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: InjectableAnimationEngine });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: InjectableAnimationEngine, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i1.AnimationDriver }, { type: i1.ɵAnimationStyleNormalizer }];
    } });
function instantiateDefaultStyleNormalizer() {
    return new ɵWebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}
/**
 * @publicApi
 */
const ANIMATION_MODULE_TYPE = new InjectionToken('AnimationModuleType');
const SHARED_ANIMATION_PROVIDERS = [
    { provide: AnimationBuilder, useClass: BrowserAnimationBuilder },
    { provide: ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: ɵAnimationEngine, useClass: InjectableAnimationEngine }, {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [ɵDomRendererFactory2, ɵAnimationEngine, NgZone]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
const BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: AnimationDriver, useFactory: () => new ɵWebAnimationsDriver() },
    { provide: ANIMATION_MODULE_TYPE, useValue: 'BrowserAnimations' }, ...SHARED_ANIMATION_PROVIDERS
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
const BROWSER_NOOP_ANIMATIONS_PROVIDERS = [
    { provide: AnimationDriver, useClass: ɵNoopAnimationDriver },
    { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' }, ...SHARED_ANIMATION_PROVIDERS
];

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Exports `BrowserModule` with additional [dependency-injection providers](guide/glossary#provider)
 * for use with animations. See [Animations](guide/animations).
 * @publicApi
 */
class BrowserAnimationsModule {
    /**
     * Configures the module based on the specified object.
     *
     * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
     * @see `BrowserAnimationsModuleConfig`
     *
     * @usageNotes
     * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
     * function as follows:
     * ```
     * @NgModule({
     *   imports: [BrowserAnimationsModule.withConfig(config)]
     * })
     * class MyNgModule {}
     * ```
     */
    static withConfig(config) {
        return {
            ngModule: BrowserAnimationsModule,
            providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS :
                BROWSER_ANIMATIONS_PROVIDERS
        };
    }
}
BrowserAnimationsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
BrowserAnimationsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationsModule, exports: [BrowserModule] });
BrowserAnimationsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationsModule, providers: BROWSER_ANIMATIONS_PROVIDERS, imports: [BrowserModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationsModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [BrowserModule],
                    providers: BROWSER_ANIMATIONS_PROVIDERS,
                }]
        }] });
/**
 * A null player that must be imported to allow disabling of animations.
 * @publicApi
 */
class NoopAnimationsModule {
}
NoopAnimationsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NoopAnimationsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NoopAnimationsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NoopAnimationsModule, exports: [BrowserModule] });
NoopAnimationsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NoopAnimationsModule, providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS, imports: [BrowserModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NoopAnimationsModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [BrowserModule],
                    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
                }]
        }] });

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

/**
 * Generated bundle index. Do not edit.
 */

export { ANIMATION_MODULE_TYPE, BrowserAnimationsModule, NoopAnimationsModule, AnimationRenderer as ɵAnimationRenderer, AnimationRendererFactory as ɵAnimationRendererFactory, BrowserAnimationBuilder as ɵBrowserAnimationBuilder, BrowserAnimationFactory as ɵBrowserAnimationFactory, InjectableAnimationEngine as ɵInjectableAnimationEngine };
//# sourceMappingURL=animations.mjs.map
