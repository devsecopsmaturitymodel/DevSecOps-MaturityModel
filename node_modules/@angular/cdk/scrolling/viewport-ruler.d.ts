/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** Time in ms to throttle the resize events by default. */
export declare const DEFAULT_RESIZE_TIME = 20;
/** Object that holds the scroll position of the viewport in each direction. */
export interface ViewportScrollPosition {
    top: number;
    left: number;
}
/**
 * Simple utility for getting the bounds of the browser viewport.
 * @docs-private
 */
export declare class ViewportRuler implements OnDestroy {
    private _platform;
    /** Cached viewport dimensions. */
    private _viewportSize;
    /** Stream of viewport change events. */
    private readonly _change;
    /** Event listener that will be used to handle the viewport change events. */
    private _changeListener;
    /** Used to reference correct document/window */
    protected _document: Document;
    constructor(_platform: Platform, ngZone: NgZone, document: any);
    ngOnDestroy(): void;
    /** Returns the viewport's width and height. */
    getViewportSize(): Readonly<{
        width: number;
        height: number;
    }>;
    /** Gets a ClientRect for the viewport's bounds. */
    getViewportRect(): {
        top: number;
        left: number;
        bottom: number;
        right: number;
        height: number;
        width: number;
    };
    /** Gets the (top, left) scroll position of the viewport. */
    getViewportScrollPosition(): ViewportScrollPosition;
    /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * This stream emits outside of the Angular zone.
     * @param throttleTime Time in milliseconds to throttle the stream.
     */
    change(throttleTime?: number): Observable<Event>;
    /** Use defaultView of injected document if available or fallback to global window reference */
    private _getWindow;
    /** Updates the cached viewport size. */
    private _updateViewportSize;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewportRuler, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ViewportRuler>;
}
