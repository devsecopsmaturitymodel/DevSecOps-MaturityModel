/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { OverlayContainer } from '../overlay-container';
import { FlexibleConnectedPositionStrategy, FlexibleConnectedPositionStrategyOrigin } from './flexible-connected-position-strategy';
import { GlobalPositionStrategy } from './global-position-strategy';
import * as i0 from "@angular/core";
/** Builder for overlay position strategy. */
export declare class OverlayPositionBuilder {
    private _viewportRuler;
    private _document;
    private _platform;
    private _overlayContainer;
    constructor(_viewportRuler: ViewportRuler, _document: any, _platform: Platform, _overlayContainer: OverlayContainer);
    /**
     * Creates a global position strategy.
     */
    global(): GlobalPositionStrategy;
    /**
     * Creates a flexible position strategy.
     * @param origin Origin relative to which to position the overlay.
     */
    flexibleConnectedTo(origin: FlexibleConnectedPositionStrategyOrigin): FlexibleConnectedPositionStrategy;
    static ɵfac: i0.ɵɵFactoryDeclaration<OverlayPositionBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OverlayPositionBuilder>;
}
