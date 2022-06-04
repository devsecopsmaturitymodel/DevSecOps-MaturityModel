/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, NgZone, OnDestroy } from '@angular/core';
import { CanColor, CanDisable, CanDisableRipple, HasTabIndex, RippleConfig, RippleGlobalOptions, RippleTarget } from '@angular/material/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Represents an event fired on an individual `mat-chip`. */
export interface MatChipEvent {
    /** The chip the event was fired on. */
    chip: MatChip;
}
/** Event object emitted by MatChip when selected or deselected. */
export declare class MatChipSelectionChange {
    /** Reference to the chip that emitted the event. */
    source: MatChip;
    /** Whether the chip that emitted the event is selected. */
    selected: boolean;
    /** Whether the selection change was a result of a user interaction. */
    isUserInput: boolean;
    constructor(
    /** Reference to the chip that emitted the event. */
    source: MatChip, 
    /** Whether the chip that emitted the event is selected. */
    selected: boolean, 
    /** Whether the selection change was a result of a user interaction. */
    isUserInput?: boolean);
}
/**
 * Injection token that can be used to reference instances of `MatChipRemove`. It serves as
 * alternative token to the actual `MatChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_REMOVE: InjectionToken<MatChipRemove>;
/**
 * Injection token that can be used to reference instances of `MatChipAvatar`. It serves as
 * alternative token to the actual `MatChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_AVATAR: InjectionToken<MatChipAvatar>;
/**
 * Injection token that can be used to reference instances of `MatChipTrailingIcon`. It serves as
 * alternative token to the actual `MatChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_CHIP_TRAILING_ICON: InjectionToken<MatChipTrailingIcon>;
/** @docs-private */
declare abstract class MatChipBase {
    _elementRef: ElementRef;
    abstract disabled: boolean;
    constructor(_elementRef: ElementRef);
}
declare const _MatChipMixinBase: import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & typeof MatChipBase;
/**
 * Dummy directive to add CSS class to chip avatar.
 * @docs-private
 */
export declare class MatChipAvatar {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipAvatar, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipAvatar, "mat-chip-avatar, [matChipAvatar]", never, {}, {}, never>;
}
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export declare class MatChipTrailingIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipTrailingIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipTrailingIcon, "mat-chip-trailing-icon, [matChipTrailingIcon]", never, {}, {}, never>;
}
/** Material Design styled chip directive. Used inside the MatChipList component. */
export declare class MatChip extends _MatChipMixinBase implements FocusableOption, OnDestroy, CanColor, CanDisableRipple, RippleTarget, HasTabIndex, CanDisable {
    private _ngZone;
    private _changeDetectorRef;
    /** Reference to the RippleRenderer for the chip. */
    private _chipRipple;
    /**
     * Reference to the element that acts as the chip's ripple target. This element is
     * dynamically added as a child node of the chip. The chip itself cannot be used as the
     * ripple target because it must be the host of the focus indicator.
     */
    private _chipRippleTarget;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the chip ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction
     * @docs-private
     */
    get rippleDisabled(): boolean;
    /** Whether the chip has focus. */
    _hasFocus: boolean;
    /** Whether animations for the chip are enabled. */
    _animationsDisabled: boolean;
    /** Whether the chip list is selectable */
    chipListSelectable: boolean;
    /** Whether the chip list is in multi-selection mode. */
    _chipListMultiple: boolean;
    /** Whether the chip list as a whole is disabled. */
    _chipListDisabled: boolean;
    /** The chip avatar */
    avatar: MatChipAvatar;
    /** The chip's trailing icon. */
    trailingIcon: MatChipTrailingIcon;
    /** The chip's remove toggler. */
    removeIcon: MatChipRemove;
    /** Whether the chip is selected. */
    get selected(): boolean;
    set selected(value: BooleanInput);
    protected _selected: boolean;
    /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
    get value(): any;
    set value(value: any);
    protected _value: any;
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     */
    get selectable(): boolean;
    set selectable(value: BooleanInput);
    protected _selectable: boolean;
    /** Whether the chip is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    protected _disabled: boolean;
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    get removable(): boolean;
    set removable(value: BooleanInput);
    protected _removable: boolean;
    /** Emits when the chip is focused. */
    readonly _onFocus: Subject<MatChipEvent>;
    /** Emits when the chip is blured. */
    readonly _onBlur: Subject<MatChipEvent>;
    /** Emitted when the chip is selected or deselected. */
    readonly selectionChange: EventEmitter<MatChipSelectionChange>;
    /** Emitted when the chip is destroyed. */
    readonly destroyed: EventEmitter<MatChipEvent>;
    /** Emitted when a chip is to be removed. */
    readonly removed: EventEmitter<MatChipEvent>;
    /** The ARIA selected applied to the chip. */
    get ariaSelected(): string | null;
    constructor(elementRef: ElementRef<HTMLElement>, _ngZone: NgZone, platform: Platform, globalRippleOptions: RippleGlobalOptions | null, _changeDetectorRef: ChangeDetectorRef, _document: any, animationMode?: string, tabIndex?: string);
    _addHostClassName(): void;
    ngOnDestroy(): void;
    /** Selects the chip. */
    select(): void;
    /** Deselects the chip. */
    deselect(): void;
    /** Select this chip and emit selected event */
    selectViaInteraction(): void;
    /** Toggles the current selected state of this chip. */
    toggleSelected(isUserInput?: boolean): boolean;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /**
     * Allows for programmatic removal of the chip. Called by the MatChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     */
    remove(): void;
    /** Handles click events on the chip. */
    _handleClick(event: Event): void;
    /** Handle custom key presses. */
    _handleKeydown(event: KeyboardEvent): void;
    _blur(): void;
    private _dispatchSelectionChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChip, [null, null, null, { optional: true; }, null, null, { optional: true; }, { attribute: "tabindex"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChip, "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", ["matChip"], { "color": "color"; "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; "selected": "selected"; "value": "value"; "selectable": "selectable"; "disabled": "disabled"; "removable": "removable"; }, { "selectionChange": "selectionChange"; "destroyed": "destroyed"; "removed": "removed"; }, ["avatar", "trailingIcon", "removeIcon"]>;
}
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     `<mat-chip>
 *       <mat-icon matChipRemove>cancel</mat-icon>
 *     </mat-chip>`
 *
 * You *may* use a custom icon, but you may need to override the `mat-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
export declare class MatChipRemove {
    protected _parentChip: MatChip;
    constructor(_parentChip: MatChip, elementRef: ElementRef<HTMLElement>);
    /** Calls the parent chip's public `remove()` method if applicable. */
    _handleClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatChipRemove, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatChipRemove, "[matChipRemove]", never, {}, {}, never>;
}
export {};
