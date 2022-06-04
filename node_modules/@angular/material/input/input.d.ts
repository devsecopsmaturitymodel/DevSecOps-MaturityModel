/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { AfterViewInit, DoCheck, ElementRef, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorState, ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatInputBase: import("@angular/material/core")._Constructor<CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<CanUpdateErrorState> & {
    new (_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl): {
        _defaultErrorStateMatcher: ErrorStateMatcher;
        _parentForm: NgForm;
        _parentFormGroup: FormGroupDirective;
        /** @docs-private */
        ngControl: NgControl;
    };
};
/** Directive that allows a native input to work inside a `MatFormField`. */
export declare class MatInput extends _MatInputBase implements MatFormFieldControl<any>, OnChanges, OnDestroy, AfterViewInit, DoCheck, CanUpdateErrorState {
    protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    protected _platform: Platform;
    private _autofillMonitor;
    private _formField?;
    protected _uid: string;
    protected _previousNativeValue: any;
    private _inputValueAccessor;
    private _previousPlaceholder;
    /** Whether the component is being rendered on the server. */
    readonly _isServer: boolean;
    /** Whether the component is a native html select. */
    readonly _isNativeSelect: boolean;
    /** Whether the component is a textarea. */
    readonly _isTextarea: boolean;
    /** Whether the input is inside of a form field. */
    readonly _isInFormField: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    focused: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    readonly stateChanges: Subject<void>;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    controlType: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    autofilled: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    protected _disabled: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id(): string;
    set id(value: string);
    protected _id: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    placeholder: string;
    /**
     * Name of the input.
     * @docs-private
     */
    name: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required(): boolean;
    set required(value: BooleanInput);
    protected _required: boolean | undefined;
    /** Input type of the element. */
    get type(): string;
    set type(value: string);
    protected _type: string;
    /** An object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    userAriaDescribedBy: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value(): string;
    set value(value: any);
    /** Whether the element is readonly. */
    get readonly(): boolean;
    set readonly(value: BooleanInput);
    private _readonly;
    protected _neverEmptyInputTypes: string[];
    constructor(_elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, _platform: Platform, ngControl: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher, inputValueAccessor: any, _autofillMonitor: AutofillMonitor, ngZone: NgZone, _formField?: MatFormField | undefined);
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    /** Focuses the input. */
    focus(options?: FocusOptions): void;
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused: boolean): void;
    _onInput(): void;
    /** Does some manual dirty checking on the native input `placeholder` attribute. */
    private _dirtyCheckPlaceholder;
    /** Does some manual dirty checking on the native input `value` property. */
    protected _dirtyCheckNativeValue(): void;
    /** Make sure the input is a supported type. */
    protected _validateType(): void;
    /** Checks whether the input type is one of the types that are never empty. */
    protected _isNeverEmpty(): boolean;
    /** Checks whether the input is invalid based on the native validation. */
    protected _isBadInput(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids: string[]): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick(): void;
    /** Whether the form control is a native select that is displayed inline. */
    _isInlineSelect(): boolean;
    private _iOSKeyupListener;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatInput, [null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, null, { optional: true; self: true; }, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatInput, "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", ["matInput"], { "disabled": "disabled"; "id": "id"; "placeholder": "placeholder"; "name": "name"; "required": "required"; "type": "type"; "errorStateMatcher": "errorStateMatcher"; "userAriaDescribedBy": "aria-describedby"; "value": "value"; "readonly": "readonly"; }, {}, never>;
}
export {};
