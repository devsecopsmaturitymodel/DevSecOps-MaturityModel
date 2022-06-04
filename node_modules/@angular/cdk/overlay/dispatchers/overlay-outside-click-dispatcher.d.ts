import { NgZone } from '@angular/core';
import { OverlayReference } from '../overlay-reference';
import { Platform } from '@angular/cdk/platform';
import { BaseOverlayDispatcher } from './base-overlay-dispatcher';
import * as i0 from "@angular/core";
/**
 * Service for dispatching mouse click events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
export declare class OverlayOutsideClickDispatcher extends BaseOverlayDispatcher {
    private _platform;
    /** @breaking-change 14.0.0 _ngZone will be required. */
    private _ngZone?;
    private _cursorOriginalValue;
    private _cursorStyleIsSet;
    private _pointerDownEventTarget;
    constructor(document: any, _platform: Platform, 
    /** @breaking-change 14.0.0 _ngZone will be required. */
    _ngZone?: NgZone | undefined);
    /** Add a new overlay to the list of attached overlay refs. */
    add(overlayRef: OverlayReference): void;
    /** Detaches the global keyboard event listener. */
    protected detach(): void;
    private _addEventListeners;
    /** Store pointerdown event target to track origin of click. */
    private _pointerDownListener;
    /** Click event listener that will be attached to the body propagate phase. */
    private _clickListener;
    static ɵfac: i0.ɵɵFactoryDeclaration<OverlayOutsideClickDispatcher, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OverlayOutsideClickDispatcher>;
}
