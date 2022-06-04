/**
 * @license Angular v13.3.10
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */

import { AnimationBuilder } from '@angular/animations';
import { AnimationDriver } from '@angular/animations/browser';
import { AnimationFactory } from '@angular/animations';
import { AnimationMetadata } from '@angular/animations';
import { AnimationOptions } from '@angular/animations';
import { AnimationPlayer } from '@angular/animations';
import * as i0 from '@angular/core';
import * as i1 from '@angular/platform-browser';
import { InjectionToken } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { RendererFactory2 } from '@angular/core';
import { RendererStyleFlags2 } from '@angular/core';
import { RendererType2 } from '@angular/core';
import { ɵAnimationEngine } from '@angular/animations/browser';
import { ɵAnimationStyleNormalizer } from '@angular/animations/browser';

/**
 * @publicApi
 */
export declare const ANIMATION_MODULE_TYPE: InjectionToken<"NoopAnimations" | "BrowserAnimations">;

declare class BaseAnimationRenderer implements Renderer2 {
    protected namespaceId: string;
    delegate: Renderer2;
    engine: ɵAnimationEngine;
    constructor(namespaceId: string, delegate: Renderer2, engine: ɵAnimationEngine);
    get data(): {
        [key: string]: any;
    };
    destroyNode: ((n: any) => void) | null;
    destroy(): void;
    createElement(name: string, namespace?: string | null | undefined): any;
    createComment(value: string): any;
    createText(value: string): any;
    appendChild(parent: any, newChild: any): void;
    insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean): void;
    removeChild(parent: any, oldChild: any, isHostElement: boolean): void;
    selectRootElement(selectorOrNode: any, preserveContent?: boolean): any;
    parentNode(node: any): any;
    nextSibling(node: any): any;
    setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void;
    removeAttribute(el: any, name: string, namespace?: string | null | undefined): void;
    addClass(el: any, name: string): void;
    removeClass(el: any, name: string): void;
    setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2 | undefined): void;
    removeStyle(el: any, style: string, flags?: RendererStyleFlags2 | undefined): void;
    setProperty(el: any, name: string, value: any): void;
    setValue(node: any, value: string): void;
    listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void;
    protected disableAnimations(element: any, value: boolean): void;
}

/**
 * Exports `BrowserModule` with additional [dependency-injection providers](guide/glossary#provider)
 * for use with animations. See [Animations](guide/animations).
 * @publicApi
 */
export declare class BrowserAnimationsModule {
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
    static withConfig(config: BrowserAnimationsModuleConfig): ModuleWithProviders<BrowserAnimationsModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BrowserAnimationsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<BrowserAnimationsModule, never, never, [typeof i1.BrowserModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<BrowserAnimationsModule>;
}

/**
 * Object used to configure the behavior of {@link BrowserAnimationsModule}
 * @publicApi
 */
export declare interface BrowserAnimationsModuleConfig {
    /**
     *  Whether animations should be disabled. Passing this is identical to providing the
     * `NoopAnimationsModule`, but it can be controlled based on a runtime value.
     */
    disableAnimations?: boolean;
}

/**
 * A null player that must be imported to allow disabling of animations.
 * @publicApi
 */
export declare class NoopAnimationsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<NoopAnimationsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NoopAnimationsModule, never, never, [typeof i1.BrowserModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NoopAnimationsModule>;
}

export declare class ɵAnimationRenderer extends BaseAnimationRenderer implements Renderer2 {
    factory: ɵAnimationRendererFactory;
    constructor(factory: ɵAnimationRendererFactory, namespaceId: string, delegate: Renderer2, engine: ɵAnimationEngine);
    setProperty(el: any, name: string, value: any): void;
    listen(target: 'window' | 'document' | 'body' | any, eventName: string, callback: (event: any) => any): () => void;
}

export declare class ɵAnimationRendererFactory implements RendererFactory2 {
    private delegate;
    private engine;
    private _zone;
    private _currentId;
    private _microtaskId;
    private _animationCallbacksBuffer;
    private _rendererCache;
    private _cdRecurDepth;
    private promise;
    constructor(delegate: RendererFactory2, engine: ɵAnimationEngine, _zone: NgZone);
    createRenderer(hostElement: any, type: RendererType2): Renderer2;
    begin(): void;
    private _scheduleCountTask;
    end(): void;
    whenRenderingDone(): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵAnimationRendererFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ɵAnimationRendererFactory>;
}

export declare class ɵBrowserAnimationBuilder extends AnimationBuilder {
    private _nextAnimationId;
    private _renderer;
    constructor(rootRenderer: RendererFactory2, doc: any);
    build(animation: AnimationMetadata | AnimationMetadata[]): AnimationFactory;
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵBrowserAnimationBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ɵBrowserAnimationBuilder>;
}

export declare class ɵBrowserAnimationFactory extends AnimationFactory {
    private _id;
    private _renderer;
    constructor(_id: string, _renderer: ɵAnimationRenderer);
    create(element: any, options?: AnimationOptions): AnimationPlayer;
}

export declare class ɵInjectableAnimationEngine extends ɵAnimationEngine implements OnDestroy {
    constructor(doc: any, driver: AnimationDriver, normalizer: ɵAnimationStyleNormalizer);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵInjectableAnimationEngine, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ɵInjectableAnimationEngine>;
}

export { }
