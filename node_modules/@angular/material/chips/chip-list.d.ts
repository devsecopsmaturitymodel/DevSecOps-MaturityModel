/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorState, ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { MatChip, MatChipEvent, MatChipSelectionChange } from './chip';
import { MatChipTextControl } from './chip-text-control';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatChipListBase: import("@angular/material/core")._Constructor<CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<CanUpdateErrorState> & {
    new (_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl): {
        _defaultErrorStateMatcher: ErrorStateMatcher;
        _parentForm: NgForm;
        _parentFormGroup: FormGroupDirective;
        /** @docs-private */
        ngControl: NgControl;
    };
};
/** Change event object that is emitted when the chip list value has changed. */
export declare class MatChipListChange {
    /** Chip list that emitted the event. */
    source: MatChipList;
    /** Value of the chip list when the event was emitted. */
    value: any;
    constructor(
    /** Chip list that emitted the event. */
    source: MatChipList, 
    /** Value of the chip list when the event was emitted. */
    value: any);
}
/**
 * A material design chips component (named ChipList for its similarity to the List component).
 */
export declare class MatChipList extends _MatChipListBase implements MatFormFieldControl<any>, ControlValueAccessor, AfterContentInit, DoCheck, OnInit, OnDestroy, CanUpdateErrorState {
    protected _elementRef: ElementRef<HTMLElement>;
    private _changeDetectorRef;
    private _dir;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    readonly controlType: string;
    /**
     * When a chip is destroyed, we store the index of the destroyed chip until the chips
     * query list notifies about the update. This is necessary because we cannot determine an
     * appropriate chip that should receive focus until the array of chips updated completely.
     */
    private _lastDestroyedChipIndex;
    /** Subject that emits when the component has been destroyed. */
    private readonly _destroyed;
    /** Subscription to focus changes in the chips. */
    private _chipFocusSubscription;
    /** Subscription to blur changes in the chips. */
    private _chipBlurSubscription;
    /** Subscription to selection changes in chips. */
    private _chipSelectionSubscription;
    /** Subscription to remove changes in chips. */
    private _chipRemoveSubscription;
    /** The chip input to add more chips */
    protected _chipInput: MatChipTextControl;
    /** Uid of the chip list */
    _uid: string;
    /** The aria-describedby attribute on the chip list for improved a11y. */
    _ariaDescribedby: string;
    /** Tab index for the chip list. */
    _tabIndex: number;
    /**
     * User defined tab index.
     * When it is not null, use user defined tab index. Otherwise use _tabIndex
     */
    _userTabIndex: number | null;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatChip>;
    /** Function when touched */
    _onTouched: () => void;
    /** Function when changed */
    _onChange: (value: any) => void;
    _selectionModel: SelectionModel<MatChip>;
    /** The array of selected chips inside chip list. */
    get selected(): MatChip[] | MatChip;
    /** The ARIA role applied to the chip list. */
    get role(): string | null;
    /** An object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** Whether the user should be allowed to select multiple chips. */
    get multiple(): boolean;
    set multiple(value: BooleanInput);
    private _multiple;
    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    get compareWith(): (o1: any, o2: any) => boolean;
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value(): any;
    set value(value: any);
    protected _value: any;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id(): string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required(): boolean;
    set required(value: BooleanInput);
    protected _required: boolean | undefined;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get placeholder(): string;
    set placeholder(value: string);
    protected _placeholder: string;
    /** Whether any chips or the matChipInput inside of this chip-list has focus. */
    get focused(): boolean;
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
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    protected _disabled: boolean;
    /** Orientation of the chip list. */
    ariaOrientation: 'horizontal' | 'vertical';
    /**
     * Whether or not this chip list is selectable. When a chip list is not selectable,
     * the selected states for all the chips inside the chip list are always ignored.
     */
    get selectable(): boolean;
    set selectable(value: BooleanInput);
    protected _selectable: boolean;
    set tabIndex(value: number);
    /** Combined stream of all of the child chips' selection change events. */
    get chipSelectionChanges(): Observable<MatChipSelectionChange>;
    /** Combined stream of all of the child chips' focus change events. */
    get chipFocusChanges(): Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' blur change events. */
    get chipBlurChanges(): Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' remove change events. */
    get chipRemoveChanges(): Observable<MatChipEvent>;
    /** Event emitted when the selected chip list value has been changed by the user. */
    readonly change: EventEmitter<MatChipListChange>;
    /**
     * Event that emits whenever the raw value of the chip-list changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    readonly valueChange: EventEmitter<any>;
    /** The chips contained within this chip list. */
    chips: QueryList<MatChip>;
    constructor(_elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher, ngControl: NgControl);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /** Associates an HTML input element with this chip list. */
    registerInput(inputElement: MatChipTextControl): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids: string[]): void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick(event: MouseEvent): void;
    /**
     * Focuses the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     */
    focus(options?: FocusOptions): void;
    /** Attempt to focus an input if we have one. */
    _focusInput(options?: FocusOptions): void;
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keydown(event: KeyboardEvent): void;
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     */
    protected _updateTabIndex(): void;
    /**
     * If the amount of chips changed, we need to update the
     * key manager state and focus the next closest chip.
     */
    protected _updateFocusForDestroyedChips(): void;
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    private _isValidIndex;
    _setSelectionByValue(value: any, isUserInput?: boolean): void;
    /**
     * Finds and selects the chip based on its value.
     * @returns Chip that has the corresponding value.
     */
    private _selectValue;
    private _initializeSelection;
    /**
     * Deselects every chip in the list.
     * @param skip Chip that should not be deselected.
     */
    private _clearSelection;
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     */
    private _sortValues;
    /** Emits change event to set the model value. */
    private _propagateChanges;
    /** When blurred, mark the field as touched when focus moved outside the chip list. */
    _blur(): void;
    /** Mark the field as touched */
    _markAsTouched(): void;
    /**
     * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the list from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    _allowFocusEscape(): void;
    private _resetChips;
    private _dropSubscriptions;
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsSelection;
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsFocus;
    private _listenToChipsRemoved;
    /** Checks whether an event comes from inside a chip element. */
    private _originatesFromChip;
    /** Checks whether any of the chips is focused. */
    private _hasFocusedChip;
    /** Syncs the list's state with the individual chips. */
    private _syncChipsState;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipList, [null, null, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; self: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatChipList, "mat-chip-list", ["matChipList"], { "errorStateMatcher": "errorStateMatcher"; "multiple": "multiple"; "compareWith": "compareWith"; "value": "value"; "required": "required"; "placeholder": "placeholder"; "disabled": "disabled"; "ariaOrientation": "aria-orientation"; "selectable": "selectable"; "tabIndex": "tabIndex"; }, { "change": "change"; "valueChange": "valueChange"; }, ["chips"], ["*"]>;
}
export {};
