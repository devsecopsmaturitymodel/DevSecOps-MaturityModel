/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, QueryList, TemplateRef, OnDestroy } from '@angular/core';
import { CanDisableRipple, _MatOptgroupBase, _MatOptionBase, MatOption, MatOptgroup } from '@angular/material/core';
import * as i0 from "@angular/core";
/** Event object that is emitted when an autocomplete option is selected. */
export declare class MatAutocompleteSelectedEvent {
    /** Reference to the autocomplete panel that emitted the event. */
    source: _MatAutocompleteBase;
    /** Option that was selected. */
    option: _MatOptionBase;
    constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    source: _MatAutocompleteBase, 
    /** Option that was selected. */
    option: _MatOptionBase);
}
/** Event object that is emitted when an autocomplete option is activated. */
export interface MatAutocompleteActivatedEvent {
    /** Reference to the autocomplete panel that emitted the event. */
    source: _MatAutocompleteBase;
    /** Option that was selected. */
    option: _MatOptionBase | null;
}
/** @docs-private */
declare const _MatAutocompleteMixinBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & {
    new (): {};
};
/** Default `mat-autocomplete` options that can be overridden. */
export interface MatAutocompleteDefaultOptions {
    /** Whether the first option should be highlighted when an autocomplete panel is opened. */
    autoActiveFirstOption?: boolean;
    /** Class or list of classes to be applied to the autocomplete's overlay panel. */
    overlayPanelClass?: string | string[];
}
/** Injection token to be used to override the default options for `mat-autocomplete`. */
export declare const MAT_AUTOCOMPLETE_DEFAULT_OPTIONS: InjectionToken<MatAutocompleteDefaultOptions>;
/** @docs-private */
export declare function MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): MatAutocompleteDefaultOptions;
/** Base class with all of the `MatAutocomplete` functionality. */
export declare abstract class _MatAutocompleteBase extends _MatAutocompleteMixinBase implements AfterContentInit, CanDisableRipple, OnDestroy {
    private _changeDetectorRef;
    private _elementRef;
    private _activeOptionChanges;
    /** Class to apply to the panel when it's visible. */
    protected abstract _visibleClass: string;
    /** Class to apply to the panel when it's hidden. */
    protected abstract _hiddenClass: string;
    /** Manages active item in option list based on key events. */
    _keyManager: ActiveDescendantKeyManager<_MatOptionBase>;
    /** Whether the autocomplete panel should be visible, depending on option length. */
    showPanel: boolean;
    /** Whether the autocomplete panel is open. */
    get isOpen(): boolean;
    _isOpen: boolean;
    /** @docs-private */
    template: TemplateRef<any>;
    /** Element for the panel containing the autocomplete options. */
    panel: ElementRef;
    /** Reference to all options within the autocomplete. */
    abstract options: QueryList<_MatOptionBase>;
    /** Reference to all option groups within the autocomplete. */
    abstract optionGroups: QueryList<_MatOptgroupBase>;
    /** Aria label of the autocomplete. */
    ariaLabel: string;
    /** Input that can be used to specify the `aria-labelledby` attribute. */
    ariaLabelledby: string;
    /** Function that maps an option's control value to its display value in the trigger. */
    displayWith: ((value: any) => string) | null;
    /**
     * Whether the first option should be highlighted when the autocomplete panel is opened.
     * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
     */
    get autoActiveFirstOption(): boolean;
    set autoActiveFirstOption(value: BooleanInput);
    private _autoActiveFirstOption;
    /**
     * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
     * match the width of its host.
     */
    panelWidth: string | number;
    /** Event that is emitted whenever an option from the list is selected. */
    readonly optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;
    /** Event that is emitted when the autocomplete panel is opened. */
    readonly opened: EventEmitter<void>;
    /** Event that is emitted when the autocomplete panel is closed. */
    readonly closed: EventEmitter<void>;
    /** Emits whenever an option is activated. */
    readonly optionActivated: EventEmitter<MatAutocompleteActivatedEvent>;
    /**
     * Takes classes set on the host mat-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     */
    set classList(value: string | string[]);
    _classList: {
        [key: string]: boolean;
    };
    /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
    id: string;
    /**
     * Tells any descendant `mat-optgroup` to use the inert a11y pattern.
     * @docs-private
     */
    readonly inertGroups: boolean;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, defaults: MatAutocompleteDefaultOptions, platform?: Platform);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     */
    _setScrollTop(scrollTop: number): void;
    /** Returns the panel's scrollTop. */
    _getScrollTop(): number;
    /** Panel should hide itself when the option list is empty. */
    _setVisibility(): void;
    /** Emits the `select` event. */
    _emitSelectEvent(option: _MatOptionBase): void;
    /** Gets the aria-labelledby for the autocomplete panel. */
    _getPanelAriaLabelledby(labelId: string | null): string | null;
    /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
    private _setVisibilityClasses;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatAutocompleteBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatAutocompleteBase, never, never, { "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; "displayWith": "displayWith"; "autoActiveFirstOption": "autoActiveFirstOption"; "panelWidth": "panelWidth"; "classList": "class"; }, { "optionSelected": "optionSelected"; "opened": "opened"; "closed": "closed"; "optionActivated": "optionActivated"; }, never>;
}
export declare class MatAutocomplete extends _MatAutocompleteBase {
    /** Reference to all option groups within the autocomplete. */
    optionGroups: QueryList<MatOptgroup>;
    /** Reference to all options within the autocomplete. */
    options: QueryList<MatOption>;
    protected _visibleClass: string;
    protected _hiddenClass: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAutocomplete, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatAutocomplete, "mat-autocomplete", ["matAutocomplete"], { "disableRipple": "disableRipple"; }, {}, ["optionGroups", "options"], ["*"]>;
}
export {};
