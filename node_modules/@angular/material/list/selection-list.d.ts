/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanDisableRipple, MatLine, ThemePalette } from '@angular/material/core';
import { MatListAvatarCssMatStyler, MatListIconCssMatStyler } from './list';
import * as i0 from "@angular/core";
declare const _MatSelectionListBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & {
    new (): {};
};
declare const _MatListOptionBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & {
    new (): {};
};
/** @docs-private */
export declare const MAT_SELECTION_LIST_VALUE_ACCESSOR: any;
/** Change event that is being fired whenever the selected state of an option changes. */
export declare class MatSelectionListChange {
    /** Reference to the selection list that emitted the event. */
    source: MatSelectionList;
    /**
     * Reference to the option that has been changed.
     * @deprecated Use `options` instead, because some events may change more than one option.
     * @breaking-change 12.0.0
     */
    option: MatListOption;
    /** Reference to the options that have been changed. */
    options: MatListOption[];
    constructor(
    /** Reference to the selection list that emitted the event. */
    source: MatSelectionList, 
    /**
     * Reference to the option that has been changed.
     * @deprecated Use `options` instead, because some events may change more than one option.
     * @breaking-change 12.0.0
     */
    option: MatListOption, 
    /** Reference to the options that have been changed. */
    options: MatListOption[]);
}
/**
 * Type describing possible positions of a checkbox in a list option
 * with respect to the list item's text.
 */
export declare type MatListOptionCheckboxPosition = 'before' | 'after';
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
export declare class MatListOption extends _MatListOptionBase implements AfterContentInit, OnDestroy, OnInit, FocusableOption, CanDisableRipple {
    private _element;
    private _changeDetector;
    /** @docs-private */
    selectionList: MatSelectionList;
    private _selected;
    private _disabled;
    private _hasFocus;
    _avatar: MatListAvatarCssMatStyler;
    _icon: MatListIconCssMatStyler;
    _lines: QueryList<MatLine>;
    /**
     * Emits when the selected state of the option has changed.
     * Use to facilitate two-data binding to the `selected` property.
     * @docs-private
     */
    readonly selectedChange: EventEmitter<boolean>;
    /** DOM element containing the item's text. */
    _text: ElementRef;
    /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
    checkboxPosition: MatListOptionCheckboxPosition;
    /** Theme color of the list option. This sets the color of the checkbox. */
    get color(): ThemePalette;
    set color(newValue: ThemePalette);
    private _color;
    /**
     * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
     * in the first cycle.
     */
    private _inputsInitialized;
    /** Value of the option */
    get value(): any;
    set value(newValue: any);
    private _value;
    /** Whether the option is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    /** Whether the option is selected. */
    get selected(): boolean;
    set selected(value: BooleanInput);
    constructor(_element: ElementRef<HTMLElement>, _changeDetector: ChangeDetectorRef, 
    /** @docs-private */
    selectionList: MatSelectionList);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Toggles the selection state of the option. */
    toggle(): void;
    /** Allows for programmatic focusing of the option. */
    focus(): void;
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * @docs-private
     */
    getLabel(): any;
    /** Whether this list item should show a ripple effect when clicked. */
    _isRippleDisabled(): boolean;
    _handleClick(): void;
    _handleFocus(): void;
    _handleBlur(): void;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
    /** Sets the selected state of the option. Returns whether the value has changed. */
    _setSelected(selected: boolean): boolean;
    /**
     * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
     * used to trigger an update of the list option if the disabled state of the selection list
     * changed.
     */
    _markForCheck(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListOption, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatListOption, "mat-list-option", ["matListOption"], { "disableRipple": "disableRipple"; "checkboxPosition": "checkboxPosition"; "color": "color"; "value": "value"; "disabled": "disabled"; "selected": "selected"; }, { "selectedChange": "selectedChange"; }, ["_avatar", "_icon", "_lines"], ["*", "[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]"]>;
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export declare class MatSelectionList extends _MatSelectionListBase implements CanDisableRipple, AfterContentInit, ControlValueAccessor, OnDestroy, OnChanges {
    private _element;
    private _changeDetector;
    private _focusMonitor?;
    private _multiple;
    private _contentInitialized;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatListOption>;
    /** The option components contained within this selection-list. */
    options: QueryList<MatListOption>;
    /** Emits a change event whenever the selected state of an option changes. */
    readonly selectionChange: EventEmitter<MatSelectionListChange>;
    /**
     * Tabindex of the selection list.
     * @breaking-change 11.0.0 Remove `tabIndex` input.
     */
    tabIndex: number;
    /** Theme color of the selection list. This sets the checkbox color for all list options. */
    color: ThemePalette;
    /**
     * Function used for comparing an option against the selected value when determining which
     * options should appear as selected. The first argument is the value of an options. The second
     * one is a value from the selected value. A boolean must be returned.
     */
    compareWith: (o1: any, o2: any) => boolean;
    /** Whether the selection list is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether selection is limited to one or multiple items (default multiple). */
    get multiple(): boolean;
    set multiple(value: BooleanInput);
    /** The currently selected options. */
    selectedOptions: SelectionModel<MatListOption>;
    /** The tabindex of the selection list. */
    _tabIndex: number;
    /** View to model callback that should be called whenever the selected options change. */
    private _onChange;
    /** Keeps track of the currently-selected value. */
    _value: string[] | null;
    /** Emits when the list has been destroyed. */
    private readonly _destroyed;
    /** View to model callback that should be called if the list or its options lost focus. */
    _onTouched: () => void;
    /** Whether the list has been destroyed. */
    private _isDestroyed;
    constructor(_element: ElementRef<HTMLElement>, tabIndex: string, _changeDetector: ChangeDetectorRef, _focusMonitor?: FocusMonitor | undefined);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Focuses the selection list. */
    focus(options?: FocusOptions): void;
    /** Selects all of the options. Returns the options that changed as a result. */
    selectAll(): MatListOption[];
    /** Deselects all of the options. Returns the options that changed as a result. */
    deselectAll(): MatListOption[];
    /** Sets the focused option of the selection-list. */
    _setFocusedOption(option: MatListOption): void;
    /**
     * Removes an option from the selection list and updates the active item.
     * @returns Currently-active item.
     */
    _removeOptionFromList(option: MatListOption): MatListOption | null;
    /** Passes relevant key presses to our key manager. */
    _keydown(event: KeyboardEvent): void;
    /** Reports a value change to the ControlValueAccessor */
    _reportValueChange(): void;
    /** Emits a change event if the selected state of an option changed. */
    _emitChangeEvent(options: MatListOption[]): void;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(values: string[]): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: (value: any) => void): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: () => void): void;
    /** Sets the selected options based on the specified values. */
    private _setOptionsFromValues;
    /** Returns the values of the selected options. */
    private _getSelectedOptionValues;
    /** Toggles the state of the currently focused option if enabled. */
    private _toggleFocusedOption;
    /**
     * Sets the selected state on all of the options
     * and emits an event if anything changed.
     */
    private _setAllOptionsSelected;
    /**
     * Utility to ensure all indexes are valid.
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of options.
     */
    private _isValidIndex;
    /** Returns the index of the specified list option. */
    private _getOptionIndex;
    /** Marks all the options to be checked in the next change detection run. */
    private _markOptionsForCheck;
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     */
    private _allowFocusEscape;
    /** Updates the tabindex based upon if the selection list is empty. */
    private _updateTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSelectionList, [null, { attribute: "tabindex"; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSelectionList, "mat-selection-list", ["matSelectionList"], { "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; "color": "color"; "compareWith": "compareWith"; "disabled": "disabled"; "multiple": "multiple"; }, { "selectionChange": "selectionChange"; }, ["options"], ["*"]>;
}
export {};
