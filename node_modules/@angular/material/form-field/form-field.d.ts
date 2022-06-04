/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, InjectionToken, NgZone, QueryList, OnDestroy } from '@angular/core';
import { CanColor } from '@angular/material/core';
import { MatError } from './error';
import { MatFormFieldControl } from './form-field-control';
import { MatHint } from './hint';
import { MatLabel } from './label';
import { MatPlaceholder } from './placeholder';
import { MatPrefix } from './prefix';
import { MatSuffix } from './suffix';
import { Platform } from '@angular/cdk/platform';
import { NgControl } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Boilerplate for applying mixins to MatFormField.
 * @docs-private
 */
declare const _MatFormFieldBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/** Possible appearance styles for the form field. */
export declare type MatFormFieldAppearance = 'legacy' | 'standard' | 'fill' | 'outline';
/** Possible values for the "floatLabel" form-field input. */
export declare type FloatLabelType = 'always' | 'never' | 'auto';
/**
 * Represents the default options for the form field that can be configured
 * using the `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
export interface MatFormFieldDefaultOptions {
    appearance?: MatFormFieldAppearance;
    hideRequiredMarker?: boolean;
    /**
     * Whether the label for form-fields should by default float `always`,
     * `never`, or `auto` (only when necessary).
     */
    floatLabel?: FloatLabelType;
}
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export declare const MAT_FORM_FIELD_DEFAULT_OPTIONS: InjectionToken<MatFormFieldDefaultOptions>;
/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
export declare const MAT_FORM_FIELD: InjectionToken<MatFormField>;
/** Container for form controls that applies Material Design styling and behavior. */
export declare class MatFormField extends _MatFormFieldBase implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, CanColor {
    private _changeDetectorRef;
    private _dir;
    private _defaults;
    private _platform;
    private _ngZone;
    /**
     * Whether the outline gap needs to be calculated
     * immediately on the next change detection run.
     */
    private _outlineGapCalculationNeededImmediately;
    /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
    private _outlineGapCalculationNeededOnStable;
    private readonly _destroyed;
    /** The form-field appearance style. */
    get appearance(): MatFormFieldAppearance;
    set appearance(value: MatFormFieldAppearance);
    _appearance: MatFormFieldAppearance;
    /** Whether the required marker should be hidden. */
    get hideRequiredMarker(): boolean;
    set hideRequiredMarker(value: BooleanInput);
    private _hideRequiredMarker;
    /** Override for the logic that disables the label animation in certain cases. */
    private _showAlwaysAnimate;
    /** Whether the floating label should always float or not. */
    _shouldAlwaysFloat(): boolean;
    /** Whether the label can float or not. */
    _canLabelFloat(): boolean;
    /** State of the mat-hint and mat-error animations. */
    _subscriptAnimationState: string;
    /** Text for the form field hint. */
    get hintLabel(): string;
    set hintLabel(value: string);
    private _hintLabel;
    readonly _hintLabelId: string;
    readonly _labelId: string;
    /**
     * Whether the label should always float, never float or float as the user types.
     *
     * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
     * way to make the floating label emulate the behavior of a standard input placeholder. However
     * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
     * appearances the `never` option has been disabled in favor of just using the placeholder.
     */
    get floatLabel(): FloatLabelType;
    set floatLabel(value: FloatLabelType);
    private _floatLabel;
    /** Whether the Angular animations are enabled. */
    _animationsEnabled: boolean;
    _connectionContainerRef: ElementRef;
    _inputContainerRef: ElementRef;
    private _label;
    _controlNonStatic: MatFormFieldControl<any>;
    _controlStatic: MatFormFieldControl<any>;
    get _control(): MatFormFieldControl<any>;
    set _control(value: MatFormFieldControl<any>);
    private _explicitFormFieldControl;
    _labelChildNonStatic: MatLabel;
    _labelChildStatic: MatLabel;
    _placeholderChild: MatPlaceholder;
    _errorChildren: QueryList<MatError>;
    _hintChildren: QueryList<MatHint>;
    _prefixChildren: QueryList<MatPrefix>;
    _suffixChildren: QueryList<MatSuffix>;
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, _defaults: MatFormFieldDefaultOptions, _platform: Platform, _ngZone: NgZone, _animationMode: string);
    /**
     * Gets the id of the label element. If no label is present, returns `null`.
     */
    getLabelId(): string | null;
    /**
     * Gets an ElementRef for the element that a overlay attached to the form-field should be
     * positioned relative to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    _shouldForward(prop: keyof NgControl): boolean;
    _hasPlaceholder(): boolean;
    _hasLabel(): boolean;
    _shouldLabelFloat(): boolean;
    _hideControlPlaceholder(): boolean;
    _hasFloatingLabel(): boolean;
    /** Determines whether to display hints or errors. */
    _getDisplayedMessages(): 'error' | 'hint';
    /** Animates the placeholder up and locks it in position. */
    _animateAndLockLabel(): void;
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     */
    private _validatePlaceholders;
    /** Does any extra processing that is required when handling the hints. */
    private _processHints;
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    private _validateHints;
    /** Gets the default float label state. */
    private _getDefaultFloatLabelState;
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    private _syncDescribedByIds;
    /** Throws an error if the form field's control is missing. */
    protected _validateControlChild(): void;
    /**
     * Updates the width and position of the gap in the outline. Only relevant for the outline
     * appearance.
     */
    updateOutlineGap(): void;
    /** Gets the start end of the rect considering the current directionality. */
    private _getStartEnd;
    /** Checks whether the form field is attached to the DOM. */
    private _isAttachedToDOM;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormField, [null, null, { optional: true; }, { optional: true; }, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFormField, "mat-form-field", ["matFormField"], { "color": "color"; "appearance": "appearance"; "hideRequiredMarker": "hideRequiredMarker"; "hintLabel": "hintLabel"; "floatLabel": "floatLabel"; }, {}, ["_controlNonStatic", "_controlStatic", "_labelChildNonStatic", "_labelChildStatic", "_placeholderChild", "_errorChildren", "_hintChildren", "_prefixChildren", "_suffixChildren"], ["[matPrefix]", "*", "mat-placeholder", "mat-label", "[matSuffix]", "mat-error", "mat-hint:not([align='end'])", "mat-hint[align='end']"]>;
}
export {};
