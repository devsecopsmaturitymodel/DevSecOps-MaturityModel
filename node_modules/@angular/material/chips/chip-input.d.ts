/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ElementRef, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { MatChipsDefaultOptions } from './chip-default-options';
import { MatChipList } from './chip-list';
import { MatChipTextControl } from './chip-text-control';
import * as i0 from "@angular/core";
/** Represents an input event on a `matChipInput`. */
export interface MatChipInputEvent {
    /**
     * The native `<input>` element that the event is being fired for.
     * @deprecated Use `MatChipInputEvent#chipInput.inputElement` instead.
     * @breaking-change 13.0.0 This property will be removed.
     */
    input: HTMLInputElement;
    /** The value of the input. */
    value: string;
    /**
     * Reference to the chip input that emitted the event.
     * @breaking-change 13.0.0 This property will be made required.
     */
    chipInput?: MatChipInput;
}
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of an `<mat-chip-list>`.
 */
export declare class MatChipInput implements MatChipTextControl, OnChanges, OnDestroy, AfterContentInit {
    protected _elementRef: ElementRef<HTMLInputElement>;
    private _defaultOptions;
    /** Used to prevent focus moving to chips while user is holding backspace */
    private _focusLastChipOnBackspace;
    /** Whether the control is focused. */
    focused: boolean;
    _chipList: MatChipList;
    /** Register input for chip list */
    set chipList(value: MatChipList);
    /**
     * Whether or not the chipEnd event will be emitted when the input is blurred.
     */
    get addOnBlur(): boolean;
    set addOnBlur(value: BooleanInput);
    _addOnBlur: boolean;
    /**
     * The list of key codes that will trigger a chipEnd event.
     *
     * Defaults to `[ENTER]`.
     */
    separatorKeyCodes: readonly number[] | ReadonlySet<number>;
    /** Emitted when a chip is to be added. */
    readonly chipEnd: EventEmitter<MatChipInputEvent>;
    /** The input's placeholder text. */
    placeholder: string;
    /** Unique id for the input. */
    id: string;
    /** Whether the input is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether the input is empty. */
    get empty(): boolean;
    /** The native input element to which this directive is attached. */
    readonly inputElement: HTMLInputElement;
    constructor(_elementRef: ElementRef<HTMLInputElement>, _defaultOptions: MatChipsDefaultOptions);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    /** Utility method to make host definition/tests more clear. */
    _keydown(event?: KeyboardEvent): void;
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keyup(event: KeyboardEvent): void;
    /** Checks to see if the blur should emit the (chipEnd) event. */
    _blur(): void;
    _focus(): void;
    /** Checks to see if the (chipEnd) event needs to be emitted. */
    _emitChipEnd(event?: KeyboardEvent): void;
    _onInput(): void;
    /** Focuses the input. */
    focus(options?: FocusOptions): void;
    /** Clears the input */
    clear(): void;
    /** Checks whether a keycode is one of the configured separators. */
    private _isSeparatorKey;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipInput, "input[matChipInputFor]", ["matChipInput", "matChipInputFor"], { "chipList": "matChipInputFor"; "addOnBlur": "matChipInputAddOnBlur"; "separatorKeyCodes": "matChipInputSeparatorKeyCodes"; "placeholder": "placeholder"; "id": "id"; "disabled": "disabled"; }, { "chipEnd": "matChipInputTokenEnd"; }, never>;
}
