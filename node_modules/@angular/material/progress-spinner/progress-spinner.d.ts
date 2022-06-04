/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NumberInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, InjectionToken, OnInit, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { CanColor } from '@angular/material/core';
import * as i0 from "@angular/core";
/** Possible mode for a progress spinner. */
export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';
/** @docs-private */
declare const _MatProgressSpinnerBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/** Default `mat-progress-spinner` options that can be overridden. */
export interface MatProgressSpinnerDefaultOptions {
    /** Diameter of the spinner. */
    diameter?: number;
    /** Width of the spinner's stroke. */
    strokeWidth?: number;
    /**
     * Whether the animations should be force to be enabled, ignoring if the current environment is
     * using NoopAnimationsModule.
     */
    _forceAnimations?: boolean;
}
/** Injection token to be used to override the default options for `mat-progress-spinner`. */
export declare const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS: InjectionToken<MatProgressSpinnerDefaultOptions>;
/** @docs-private */
export declare function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY(): MatProgressSpinnerDefaultOptions;
/**
 * `<mat-progress-spinner>` component.
 */
export declare class MatProgressSpinner extends _MatProgressSpinnerBase implements OnInit, OnDestroy, CanColor {
    private _document;
    private _diameter;
    private _value;
    private _strokeWidth;
    private _resizeSubscription;
    /**
     * Element to which we should add the generated style tags for the indeterminate animation.
     * For most elements this is the document, but for the ones in the Shadow DOM we need to
     * use the shadow root.
     */
    private _styleRoot;
    /**
     * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
     * We need to keep track of which elements the diameters were attached to, because for
     * elements in the Shadow DOM the style tags are attached to the shadow root, rather
     * than the document head.
     */
    private static _diameters;
    /** Whether the _mat-animation-noopable class should be applied, disabling animations.  */
    _noopAnimations: boolean;
    /** A string that is used for setting the spinner animation-name CSS property */
    _spinnerAnimationLabel: string;
    /** The diameter of the progress spinner (will set width and height of svg). */
    get diameter(): number;
    set diameter(size: NumberInput);
    /** Stroke width of the progress spinner. */
    get strokeWidth(): number;
    set strokeWidth(value: NumberInput);
    /** Mode of the progress circle */
    mode: ProgressSpinnerMode;
    /** Value of the progress circle. */
    get value(): number;
    set value(newValue: NumberInput);
    constructor(elementRef: ElementRef<HTMLElement>, _platform: Platform, _document: any, animationMode: string, defaults?: MatProgressSpinnerDefaultOptions, 
    /**
     * @deprecated `changeDetectorRef`, `viewportRuler` and `ngZone`
     * parameters to become required.
     * @breaking-change 14.0.0
     */
    changeDetectorRef?: ChangeDetectorRef, viewportRuler?: ViewportRuler, ngZone?: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** The radius of the spinner, adjusted for stroke width. */
    _getCircleRadius(): number;
    /** The view box of the spinner's svg element. */
    _getViewBox(): string;
    /** The stroke circumference of the svg circle. */
    _getStrokeCircumference(): number;
    /** The dash offset of the svg circle. */
    _getStrokeDashOffset(): number | null;
    /** Stroke width of the circle in percent. */
    _getCircleStrokeWidth(): number;
    /** Gets the `transform-origin` for the inner circle element. */
    _getCircleTransformOrigin(svg: HTMLElement): string;
    /** Dynamically generates a style tag containing the correct animation for this diameter. */
    private _attachStyleNode;
    /** Generates animation styles adjusted for the spinner's diameter. */
    private _getAnimationText;
    /** Returns the circle diameter formatted for use with the animation-name CSS property. */
    private _getSpinnerAnimationLabel;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressSpinner, [null, null, { optional: true; }, { optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatProgressSpinner, "mat-progress-spinner, mat-spinner", ["matProgressSpinner"], { "color": "color"; "diameter": "diameter"; "strokeWidth": "strokeWidth"; "mode": "mode"; "value": "value"; }, {}, never, never>;
}
export {};
