/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkConnectedOverlay, ConnectedPosition, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterContentInit, ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, InjectionToken, NgZone, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanDisable, CanDisableRipple, CanUpdateErrorState, ErrorStateMatcher, HasTabIndex, MatOptgroup, MatOption, MatOptionSelectionChange, _MatOptionBase } from '@angular/material/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */
/** The max height of the select's overlay panel. */
export declare const SELECT_PANEL_MAX_HEIGHT = 256;
/** The panel's padding on the x-axis. */
export declare const SELECT_PANEL_PADDING_X = 16;
/** The panel's x axis padding if it is indented (e.g. there is an option group). */
export declare const SELECT_PANEL_INDENT_PADDING_X: number;
/** The height of the select items in `em` units. */
export declare const SELECT_ITEM_HEIGHT_EM = 3;
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * Calculated as:
 * (SELECT_PANEL_PADDING_X * 1.5) + 16 = 40
 * The padding is multiplied by 1.5 because the checkbox's margin is half the padding.
 * The checkbox width is 16px.
 */
export declare const SELECT_MULTIPLE_PANEL_PADDING_X: number;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
export declare const SELECT_PANEL_VIEWPORT_PADDING = 8;
/** Injection token that determines the scroll handling while a select is open. */
export declare const MAT_SELECT_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** Object that can be used to configure the default options for the select module. */
export interface MatSelectConfig {
    /** Whether option centering should be disabled. */
    disableOptionCentering?: boolean;
    /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
    typeaheadDebounceInterval?: number;
    /** Class or list of classes to be applied to the menu's overlay panel. */
    overlayPanelClass?: string | string[];
}
/** Injection token that can be used to provide the default options the select module. */
export declare const MAT_SELECT_CONFIG: InjectionToken<MatSelectConfig>;
/** @docs-private */
export declare const MAT_SELECT_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY;
};
/** Change event object that is emitted when the select value has changed. */
export declare class MatSelectChange {
    /** Reference to the select that emitted the change event. */
    source: MatSelect;
    /** Current value of the select that emitted the event. */
    value: any;
    constructor(
    /** Reference to the select that emitted the change event. */
    source: MatSelect, 
    /** Current value of the select that emitted the event. */
    value: any);
}
/** @docs-private */
declare const _MatSelectMixinBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & import("@angular/material/core")._Constructor<CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<CanUpdateErrorState> & {
    new (_elementRef: ElementRef, _defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl): {
        _elementRef: ElementRef;
        _defaultErrorStateMatcher: ErrorStateMatcher;
        _parentForm: NgForm;
        _parentFormGroup: FormGroupDirective;
        ngControl: NgControl;
    };
};
/**
 * Injection token that can be used to reference instances of `MatSelectTrigger`. It serves as
 * alternative token to the actual `MatSelectTrigger` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_SELECT_TRIGGER: InjectionToken<MatSelectTrigger>;
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
export declare class MatSelectTrigger {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSelectTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSelectTrigger, "mat-select-trigger", never, {}, {}, never>;
}
/** Base class with all of the `MatSelect` functionality. */
export declare abstract class _MatSelectBase<C> extends _MatSelectMixinBase implements AfterContentInit, OnChanges, OnDestroy, OnInit, DoCheck, ControlValueAccessor, CanDisable, HasTabIndex, MatFormFieldControl<any>, CanUpdateErrorState, CanDisableRipple {
    protected _viewportRuler: ViewportRuler;
    protected _changeDetectorRef: ChangeDetectorRef;
    protected _ngZone: NgZone;
    private _dir;
    protected _parentFormField: MatFormField;
    private _liveAnnouncer;
    private _defaultOptions?;
    /** All of the defined select options. */
    abstract options: QueryList<_MatOptionBase>;
    /** All of the defined groups of options. */
    abstract optionGroups: QueryList<MatOptgroup>;
    /** User-supplied override of the trigger element. */
    abstract customTrigger: {};
    /**
     * This position config ensures that the top "start" corner of the overlay
     * is aligned with with the top "start" of the origin by default (overlapping
     * the trigger completely). If the panel cannot fit below the trigger, it
     * will fall back to a position above the trigger.
     */
    abstract _positions: ConnectedPosition[];
    /** Scrolls a particular option into the view. */
    protected abstract _scrollOptionIntoView(index: number): void;
    /** Called when the panel has been opened and the overlay has settled on its final position. */
    protected abstract _positioningSettled(): void;
    /** Creates a change event object that should be emitted by the select. */
    protected abstract _getChangeEvent(value: any): C;
    /** Factory function used to create a scroll strategy for this select. */
    private _scrollStrategyFactory;
    /** Whether or not the overlay panel is open. */
    private _panelOpen;
    /** Comparison function to specify which option is displayed. Defaults to object equality. */
    private _compareWith;
    /** Unique id for this input. */
    private _uid;
    /** Current `ariar-labelledby` value for the select trigger. */
    private _triggerAriaLabelledBy;
    /**
     * Keeps track of the previous form control assigned to the select.
     * Used to detect if it has changed.
     */
    private _previousControl;
    /** Emits whenever the component is destroyed. */
    protected readonly _destroy: Subject<void>;
    /** The aria-describedby attribute on the select for improved a11y. */
    _ariaDescribedby: string;
    /** Deals with the selection logic. */
    _selectionModel: SelectionModel<MatOption>;
    /** Manages keyboard events for options in the panel. */
    _keyManager: ActiveDescendantKeyManager<MatOption>;
    /** `View -> model callback called when value changes` */
    _onChange: (value: any) => void;
    /** `View -> model callback called when select has been touched` */
    _onTouched: () => void;
    /** ID for the DOM node containing the select's value. */
    _valueId: string;
    /** Emits when the panel element is finished transforming in. */
    readonly _panelDoneAnimatingStream: Subject<string>;
    /** Strategy that will be used to handle scrolling while the select panel is open. */
    _scrollStrategy: ScrollStrategy;
    _overlayPanelClass: string | string[];
    /** Whether the select is focused. */
    get focused(): boolean;
    private _focused;
    /** A name for this control that can be used by `mat-form-field`. */
    controlType: string;
    /** Trigger that opens the select. */
    trigger: ElementRef;
    /** Panel containing the select options. */
    panel: ElementRef;
    /** Overlay pane containing the options. */
    protected _overlayDir: CdkConnectedOverlay;
    /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
    panelClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    /** Placeholder to be shown if no value has been selected. */
    get placeholder(): string;
    set placeholder(value: string);
    private _placeholder;
    /** Whether the component is required. */
    get required(): boolean;
    set required(value: BooleanInput);
    private _required;
    /** Whether the user should be allowed to select multiple options. */
    get multiple(): boolean;
    set multiple(value: BooleanInput);
    private _multiple;
    /** Whether to center the active option over the trigger. */
    get disableOptionCentering(): boolean;
    set disableOptionCentering(value: BooleanInput);
    private _disableOptionCentering;
    /**
     * Function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    get compareWith(): (o1: any, o2: any) => boolean;
    set compareWith(fn: (o1: any, o2: any) => boolean);
    /** Value of the select control. */
    get value(): any;
    set value(newValue: any);
    private _value;
    /** Aria label of the select. */
    ariaLabel: string;
    /** Input that can be used to specify the `aria-labelledby` attribute. */
    ariaLabelledby: string;
    /** Object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
    get typeaheadDebounceInterval(): number;
    set typeaheadDebounceInterval(value: NumberInput);
    private _typeaheadDebounceInterval;
    /**
     * Function used to sort the values in a select in multiple mode.
     * Follows the same logic as `Array.prototype.sort`.
     */
    sortComparator: (a: MatOption, b: MatOption, options: MatOption[]) => number;
    /** Unique id of the element. */
    get id(): string;
    set id(value: string);
    private _id;
    /** Combined stream of all of the child options' change events. */
    readonly optionSelectionChanges: Observable<MatOptionSelectionChange>;
    /** Event emitted when the select panel has been toggled. */
    readonly openedChange: EventEmitter<boolean>;
    /** Event emitted when the select has been opened. */
    readonly _openedStream: Observable<void>;
    /** Event emitted when the select has been closed. */
    readonly _closedStream: Observable<void>;
    /** Event emitted when the selected value has been changed by the user. */
    readonly selectionChange: EventEmitter<C>;
    /**
     * Event that emits whenever the raw value of the select changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    readonly valueChange: EventEmitter<any>;
    constructor(_viewportRuler: ViewportRuler, _changeDetectorRef: ChangeDetectorRef, _ngZone: NgZone, _defaultErrorStateMatcher: ErrorStateMatcher, elementRef: ElementRef, _dir: Directionality, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _parentFormField: MatFormField, ngControl: NgControl, tabIndex: string, scrollStrategyFactory: any, _liveAnnouncer: LiveAnnouncer, _defaultOptions?: MatSelectConfig | undefined);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngDoCheck(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Toggles the overlay panel open or closed. */
    toggle(): void;
    /** Opens the overlay panel. */
    open(): void;
    /** Closes the overlay panel and focuses the host element. */
    close(): void;
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value: any): void;
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn: () => {}): void;
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    /** Whether or not the overlay panel is open. */
    get panelOpen(): boolean;
    /** The currently selected option. */
    get selected(): MatOption | MatOption[];
    /** The value displayed in the trigger. */
    get triggerValue(): string;
    /** Whether the element is in RTL mode. */
    _isRtl(): boolean;
    /** Handles all keydown events on the select. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Handles keyboard events while the select is closed. */
    private _handleClosedKeydown;
    /** Handles keyboard events when the selected is open. */
    private _handleOpenKeydown;
    _onFocus(): void;
    /**
     * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
     * "blur" to the panel when it opens, causing a false positive.
     */
    _onBlur(): void;
    /**
     * Callback that is invoked when the overlay panel has been attached.
     */
    _onAttached(): void;
    /** Returns the theme to be used on the panel. */
    _getPanelTheme(): string;
    /** Whether the select has a value. */
    get empty(): boolean;
    private _initializeSelection;
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     */
    private _setSelectionByValue;
    /**
     * Finds and selects and option based on its value.
     * @returns Option that has the corresponding value.
     */
    private _selectOptionByValue;
    /** Assigns a specific value to the select. Returns whether the value has changed. */
    private _assignValue;
    /** Sets up a key manager to listen to keyboard events on the overlay panel. */
    private _initKeyManager;
    /** Drops current option subscriptions and IDs and resets from scratch. */
    private _resetOptions;
    /** Invoked when an option is clicked. */
    private _onSelect;
    /** Sorts the selected values in the selected based on their order in the panel. */
    private _sortValues;
    /** Emits change event to set the model value. */
    private _propagateChanges;
    /**
     * Highlights the selected item. If no option is selected, it will highlight
     * the first item instead.
     */
    private _highlightCorrectOption;
    /** Whether the panel is allowed to open. */
    protected _canOpen(): boolean;
    /** Focuses the select element. */
    focus(options?: FocusOptions): void;
    /** Gets the aria-labelledby for the select panel. */
    _getPanelAriaLabelledby(): string | null;
    /** Determines the `aria-activedescendant` to be set on the host. */
    _getAriaActiveDescendant(): string | null;
    /** Gets the aria-labelledby of the select component trigger. */
    private _getTriggerAriaLabelledby;
    /** Called when the overlay panel is done animating. */
    protected _panelDoneAnimating(isOpen: boolean): void;
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
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatSelectBase<any>, [null, null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; self: true; }, { attribute: "tabindex"; }, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatSelectBase<any>, never, never, { "panelClass": "panelClass"; "placeholder": "placeholder"; "required": "required"; "multiple": "multiple"; "disableOptionCentering": "disableOptionCentering"; "compareWith": "compareWith"; "value": "value"; "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; "errorStateMatcher": "errorStateMatcher"; "typeaheadDebounceInterval": "typeaheadDebounceInterval"; "sortComparator": "sortComparator"; "id": "id"; }, { "openedChange": "openedChange"; "_openedStream": "opened"; "_closedStream": "closed"; "selectionChange": "selectionChange"; "valueChange": "valueChange"; }, never>;
}
export declare class MatSelect extends _MatSelectBase<MatSelectChange> implements OnInit {
    /** The scroll position of the overlay panel, calculated to center the selected option. */
    private _scrollTop;
    /** The last measured value for the trigger's client bounding rect. */
    _triggerRect: ClientRect;
    /** The cached font-size of the trigger element. */
    _triggerFontSize: number;
    /** The value of the select panel's transform-origin property. */
    _transformOrigin: string;
    /**
     * The y-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text.
     * when the panel opens. Will change based on the y-position of the selected option.
     */
    _offsetY: number;
    options: QueryList<MatOption>;
    optionGroups: QueryList<MatOptgroup>;
    customTrigger: MatSelectTrigger;
    _positions: ConnectedPosition[];
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     */
    _calculateOverlayScroll(selectedIndex: number, scrollBuffer: number, maxScroll: number): number;
    ngOnInit(): void;
    open(): void;
    /** Scrolls the active option into view. */
    protected _scrollOptionIntoView(index: number): void;
    protected _positioningSettled(): void;
    protected _panelDoneAnimating(isOpen: boolean): void;
    protected _getChangeEvent(value: any): MatSelectChange;
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     */
    private _calculateOverlayOffsetX;
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     */
    private _calculateOverlayOffsetY;
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     */
    private _checkOverlayWithinViewport;
    /** Adjusts the overlay panel up to fit in the viewport. */
    private _adjustPanelUp;
    /** Adjusts the overlay panel down to fit in the viewport. */
    private _adjustPanelDown;
    /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
    private _calculateOverlayPosition;
    /** Sets the transform origin point based on the selected option. */
    private _getOriginBasedOnOption;
    /** Calculates the height of the select's options. */
    private _getItemHeight;
    /** Calculates the amount of items in the select. This includes options and group labels. */
    private _getItemCount;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSelect, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSelect, "mat-select", ["matSelect"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; }, {}, ["customTrigger", "options", "optionGroups"], ["mat-select-trigger", "*"]>;
}
export {};
