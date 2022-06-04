/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, InjectionToken, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 */
export const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS');
/**
 * Injection token that can be used to reference instances of `MatButtonToggleGroup`.
 * It serves as alternative token to the actual `MatButtonToggleGroup` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const MAT_BUTTON_TOGGLE_GROUP = new InjectionToken('MatButtonToggleGroup');
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatButtonToggleGroup),
    multi: true,
};
// Counter used to generate unique IDs.
let uniqueIdCounter = 0;
/** Change event object emitted by MatButtonToggle. */
export class MatButtonToggleChange {
    constructor(
    /** The MatButtonToggle that emits the event. */
    source, 
    /** The value assigned to the MatButtonToggle. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/** Exclusive selection button toggle group that behaves like a radio-button group. */
export class MatButtonToggleGroup {
    constructor(_changeDetector, defaultOptions) {
        this._changeDetector = _changeDetector;
        this._vertical = false;
        this._multiple = false;
        this._disabled = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = () => { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this._onTouched = () => { };
        this._name = `mat-button-toggle-group-${uniqueIdCounter++}`;
        /**
         * Event that emits whenever the value of the group changes.
         * Used to facilitate two-way data binding.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        /** Event emitted when the group's value changes. */
        this.change = new EventEmitter();
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    }
    /** `name` attribute for the underlying `input` element. */
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(toggle => {
                toggle.name = this._name;
                toggle._markForCheck();
            });
        }
    }
    /** Whether the toggle group is vertical. */
    get vertical() {
        return this._vertical;
    }
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /** Value of the toggle group. */
    get value() {
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        if (this.multiple) {
            return selected.map(toggle => toggle.value);
        }
        return selected[0] ? selected[0].value : undefined;
    }
    set value(newValue) {
        this._setSelectionByValue(newValue);
        this.valueChange.emit(this.value);
    }
    /** Selected button toggles in the group. */
    get selected() {
        const selected = this._selectionModel ? this._selectionModel.selected : [];
        return this.multiple ? selected : selected[0] || null;
    }
    /** Whether multiple button toggles can be selected. */
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
    }
    /** Whether multiple button toggle group is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        if (this._buttonToggles) {
            this._buttonToggles.forEach(toggle => toggle._markForCheck());
        }
    }
    ngOnInit() {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    }
    ngAfterContentInit() {
        this._selectionModel.select(...this._buttonToggles.filter(toggle => toggle.checked));
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent() {
        const selected = this.selected;
        const source = Array.isArray(selected) ? selected[selected.length - 1] : selected;
        const event = new MatButtonToggleChange(source, this.value);
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    }
    /**
     * Syncs a button toggle's selected state with the model value.
     * @param toggle Toggle to be synced.
     * @param select Whether the toggle should be selected.
     * @param isUserInput Whether the change was a result of a user interaction.
     * @param deferEvents Whether to defer emitting the change events.
     */
    _syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
        // Deselect the currently-selected toggle, if we're in single-selection
        // mode and the button being toggled isn't selected at the moment.
        if (!this.multiple && this.selected && !toggle.checked) {
            this.selected.checked = false;
        }
        if (this._selectionModel) {
            if (select) {
                this._selectionModel.select(toggle);
            }
            else {
                this._selectionModel.deselect(toggle);
            }
        }
        else {
            deferEvents = true;
        }
        // We need to defer in some cases in order to avoid "changed after checked errors", however
        // the side-effect is that we may end up updating the model value out of sequence in others
        // The `deferEvents` flag allows us to decide whether to do it on a case-by-case basis.
        if (deferEvents) {
            Promise.resolve().then(() => this._updateModelValue(isUserInput));
        }
        else {
            this._updateModelValue(isUserInput);
        }
    }
    /** Checks whether a button toggle is selected. */
    _isSelected(toggle) {
        return this._selectionModel && this._selectionModel.isSelected(toggle);
    }
    /** Determines whether a button toggle should be checked on init. */
    _isPrechecked(toggle) {
        if (typeof this._rawValue === 'undefined') {
            return false;
        }
        if (this.multiple && Array.isArray(this._rawValue)) {
            return this._rawValue.some(value => toggle.value != null && value === toggle.value);
        }
        return toggle.value === this._rawValue;
    }
    /** Updates the selection state of the toggles in the group based on a value. */
    _setSelectionByValue(value) {
        this._rawValue = value;
        if (!this._buttonToggles) {
            return;
        }
        if (this.multiple && value) {
            if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Value must be an array in multiple-selection mode.');
            }
            this._clearSelection();
            value.forEach((currentValue) => this._selectValue(currentValue));
        }
        else {
            this._clearSelection();
            this._selectValue(value);
        }
    }
    /** Clears the selected toggles. */
    _clearSelection() {
        this._selectionModel.clear();
        this._buttonToggles.forEach(toggle => (toggle.checked = false));
    }
    /** Selects a value if there's a toggle that corresponds to it. */
    _selectValue(value) {
        const correspondingOption = this._buttonToggles.find(toggle => {
            return toggle.value != null && toggle.value === value;
        });
        if (correspondingOption) {
            correspondingOption.checked = true;
            this._selectionModel.select(correspondingOption);
        }
    }
    /** Syncs up the group's value with the model and emits the change event. */
    _updateModelValue(isUserInput) {
        // Only emit the change event for user input.
        if (isUserInput) {
            this._emitChangeEvent();
        }
        // Note: we emit this one no matter whether it was a user interaction, because
        // it is used by Angular to sync up the two-way data binding.
        this.valueChange.emit(this.value);
    }
}
MatButtonToggleGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatButtonToggleGroup, deps: [{ token: i0.ChangeDetectorRef }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatButtonToggleGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatButtonToggleGroup, selector: "mat-button-toggle-group", inputs: { appearance: "appearance", name: "name", vertical: "vertical", value: "value", multiple: "multiple", disabled: "disabled" }, outputs: { valueChange: "valueChange", change: "change" }, host: { attributes: { "role": "group" }, properties: { "attr.aria-disabled": "disabled", "class.mat-button-toggle-vertical": "vertical", "class.mat-button-toggle-group-appearance-standard": "appearance === \"standard\"" }, classAttribute: "mat-button-toggle-group" }, providers: [
        MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
        { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
    ], queries: [{ propertyName: "_buttonToggles", predicate: i0.forwardRef(function () { return MatButtonToggle; }), descendants: true }], exportAs: ["matButtonToggleGroup"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatButtonToggleGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-button-toggle-group',
                    providers: [
                        MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
                        { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
                    ],
                    host: {
                        'role': 'group',
                        'class': 'mat-button-toggle-group',
                        '[attr.aria-disabled]': 'disabled',
                        '[class.mat-button-toggle-vertical]': 'vertical',
                        '[class.mat-button-toggle-group-appearance-standard]': 'appearance === "standard"',
                    },
                    exportAs: 'matButtonToggleGroup',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { _buttonToggles: [{
                type: ContentChildren,
                args: [forwardRef(() => MatButtonToggle), {
                        // Note that this would technically pick up toggles
                        // from nested groups, but that's not a case that we support.
                        descendants: true,
                    }]
            }], appearance: [{
                type: Input
            }], name: [{
                type: Input
            }], vertical: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], multiple: [{
                type: Input
            }], disabled: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
// Boilerplate for applying mixins to the MatButtonToggle class.
/** @docs-private */
const _MatButtonToggleBase = mixinDisableRipple(class {
});
/** Single button inside of a toggle group. */
export class MatButtonToggle extends _MatButtonToggleBase {
    constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, defaultTabIndex, defaultOptions) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._isSingleSelector = false;
        this._checked = false;
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        this._disabled = false;
        /** Event emitted when the group value changes. */
        this.change = new EventEmitter();
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
        this.buttonToggleGroup = toggleGroup;
        this.appearance =
            defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    }
    /** Unique ID for the underlying `button` element. */
    get buttonId() {
        return `${this.id}-button`;
    }
    /** The appearance style of the button. */
    get appearance() {
        return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
    }
    set appearance(value) {
        this._appearance = value;
    }
    /** Whether the button is checked. */
    get checked() {
        return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
    }
    set checked(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._checked) {
            this._checked = newValue;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked);
            }
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Whether the button is disabled. */
    get disabled() {
        return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    ngOnInit() {
        const group = this.buttonToggleGroup;
        this._isSingleSelector = group && !group.multiple;
        this.id = this.id || `mat-button-toggle-${uniqueIdCounter++}`;
        if (this._isSingleSelector) {
            this.name = group.name;
        }
        if (group) {
            if (group._isPrechecked(this)) {
                this.checked = true;
            }
            else if (group._isSelected(this) !== this._checked) {
                // As as side effect of the circular dependency between the toggle group and the button,
                // we may end up in a state where the button is supposed to be checked on init, but it
                // isn't, because the checked value was assigned too early. This can happen when Ivy
                // assigns the static input value before the `ngOnInit` has run.
                group._syncButtonToggle(this, this._checked);
            }
        }
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        const group = this.buttonToggleGroup;
        this._focusMonitor.stopMonitoring(this._elementRef);
        // Remove the toggle from the selection once it's destroyed. Needs to happen
        // on the next tick in order to avoid "changed after checked" errors.
        if (group && group._isSelected(this)) {
            group._syncButtonToggle(this, false, false, true);
        }
    }
    /** Focuses the button. */
    focus(options) {
        this._buttonElement.nativeElement.focus(options);
    }
    /** Checks the button toggle due to an interaction with the underlying native button. */
    _onButtonClick() {
        const newChecked = this._isSingleSelector ? true : !this._checked;
        if (newChecked !== this._checked) {
            this._checked = newChecked;
            if (this.buttonToggleGroup) {
                this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
                this.buttonToggleGroup._onTouched();
            }
        }
        // Emit a change event when it's the single selector
        this.change.emit(new MatButtonToggleChange(this, this.value));
    }
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     */
    _markForCheck() {
        // When the group value changes, the button will not be notified.
        // Use `markForCheck` to explicit update button toggle's status.
        this._changeDetectorRef.markForCheck();
    }
}
MatButtonToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatButtonToggle, deps: [{ token: MAT_BUTTON_TOGGLE_GROUP, optional: true }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: 'tabindex', attribute: true }, { token: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatButtonToggle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatButtonToggle, selector: "mat-button-toggle", inputs: { disableRipple: "disableRipple", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], id: "id", name: "name", value: "value", tabIndex: "tabIndex", appearance: "appearance", checked: "checked", disabled: "disabled" }, outputs: { change: "change" }, host: { attributes: { "role": "presentation" }, listeners: { "focus": "focus()" }, properties: { "class.mat-button-toggle-standalone": "!buttonToggleGroup", "class.mat-button-toggle-checked": "checked", "class.mat-button-toggle-disabled": "disabled", "class.mat-button-toggle-appearance-standard": "appearance === \"standard\"", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.id": "id", "attr.name": "null" }, classAttribute: "mat-button-toggle" }, viewQueries: [{ propertyName: "_buttonElement", first: true, predicate: ["button"], descendants: true }], exportAs: ["matButtonToggle"], usesInheritance: true, ngImport: i0, template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"name || null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;border-radius:2px;-webkit-tap-highlight-color:transparent;transform:translateZ(0)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:4px}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.cdk-high-contrast-active .mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:.5}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:.04}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.12}.cdk-high-contrast-active .mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.5}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}.mat-button-toggle-checked .cdk-high-contrast-active .mat-button-toggle-focus-overlay{border-bottom:solid 36px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}\n"], directives: [{ type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatButtonToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mat-button-toggle', encapsulation: ViewEncapsulation.None, exportAs: 'matButtonToggle', changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disableRipple'], host: {
                        '[class.mat-button-toggle-standalone]': '!buttonToggleGroup',
                        '[class.mat-button-toggle-checked]': 'checked',
                        '[class.mat-button-toggle-disabled]': 'disabled',
                        '[class.mat-button-toggle-appearance-standard]': 'appearance === "standard"',
                        'class': 'mat-button-toggle',
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.id]': 'id',
                        '[attr.name]': 'null',
                        '(focus)': 'focus()',
                        'role': 'presentation',
                    }, template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"name || null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <span class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</span>\n", styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;border-radius:2px;-webkit-tap-highlight-color:transparent;transform:translateZ(0)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:4px}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.cdk-high-contrast-active .mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:.5}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:.04}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.12}.cdk-high-contrast-active .mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.5}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}.mat-button-toggle-checked .cdk-high-contrast-active .mat-button-toggle-focus-overlay{border-bottom:solid 36px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}\n"] }]
        }], ctorParameters: function () { return [{ type: MatButtonToggleGroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_GROUP]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], _buttonElement: [{
                type: ViewChild,
                args: ['button']
            }], id: [{
                type: Input
            }], name: [{
                type: Input
            }], value: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], appearance: [{
                type: Input
            }], checked: [{
                type: Input
            }], disabled: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24tdG9nZ2xlL2J1dHRvbi10b2dnbGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZS9idXR0b24tdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsY0FBYyxFQUNkLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUFtQixrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7O0FBdUI1RTs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FBRyxJQUFJLGNBQWMsQ0FDakUsbUNBQW1DLENBQ3BDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQ3ZELHNCQUFzQixDQUN2QixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNDQUFzQyxHQUFRO0lBQ3pELE9BQU8sRUFBRSxpQkFBaUI7SUFD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R0gsY0FBYztzQkFBbEMsU0FBUzt1QkFBQyxRQUFRO2dCQVdWLEVBQUU7c0JBQVYsS0FBSztnQkFHRyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csS0FBSztzQkFBYixLQUFLO2dCQUdHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBSUYsVUFBVTtzQkFEYixLQUFLO2dCQVdGLE9BQU87c0JBRFYsS0FBSztnQkFvQkYsUUFBUTtzQkFEWCxLQUFLO2dCQVVhLE1BQU07c0JBQXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1NlbGVjdGlvbk1vZGVsfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2FuRGlzYWJsZVJpcHBsZSwgbWl4aW5EaXNhYmxlUmlwcGxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIFRvZ2dsZVR5cGUgPSAnY2hlY2tib3gnIHwgJ3JhZGlvJztcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgYnV0dG9uIHRvZ2dsZS4gKi9cbmV4cG9ydCB0eXBlIE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqXG4gICAqIERlZmF1bHQgYXBwZWFyYW5jZSB0byBiZSB1c2VkIGJ5IGJ1dHRvbiB0b2dnbGVzLiBDYW4gYmUgb3ZlcnJpZGRlbiBieSBleHBsaWNpdGx5XG4gICAqIHNldHRpbmcgYW4gYXBwZWFyYW5jZSBvbiBhIGJ1dHRvbiB0b2dnbGUgb3IgZ3JvdXAuXG4gICAqL1xuICBhcHBlYXJhbmNlPzogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZTtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlXG4gKiBkZWZhdWx0IG9wdGlvbnMgZm9yIGFsbCBidXR0b24gdG9nZ2xlcyB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zPihcbiAgJ01BVF9CVVRUT05fVE9HR0xFX0RFRkFVTFRfT1BUSU9OUycsXG4pO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdEJ1dHRvblRvZ2dsZUdyb3VwYC5cbiAqIEl0IHNlcnZlcyBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRCdXR0b25Ub2dnbGVHcm91cGAgY2xhc3Mgd2hpY2hcbiAqIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5IHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Ub2dnbGVHcm91cD4oXG4gICdNYXRCdXR0b25Ub2dnbGVHcm91cCcsXG4pO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QnV0dG9uVG9nZ2xlR3JvdXApLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8vIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLlxubGV0IHVuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0QnV0dG9uVG9nZ2xlLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgTWF0QnV0dG9uVG9nZ2xlIHRoYXQgZW1pdHMgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdEJ1dHRvblRvZ2dsZSxcblxuICAgIC8qKiBUaGUgdmFsdWUgYXNzaWduZWQgdG8gdGhlIE1hdEJ1dHRvblRvZ2dsZS4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSxcbiAgKSB7fVxufVxuXG4vKiogRXhjbHVzaXZlIHNlbGVjdGlvbiBidXR0b24gdG9nZ2xlIGdyb3VwIHRoYXQgYmVoYXZlcyBsaWtlIGEgcmFkaW8tYnV0dG9uIGdyb3VwLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAnLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUF9WQUxVRV9BQ0NFU1NPUixcbiAgICB7cHJvdmlkZTogTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVAsIHVzZUV4aXN0aW5nOiBNYXRCdXR0b25Ub2dnbGVHcm91cH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdncm91cCcsXG4gICAgJ2NsYXNzJzogJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLWdyb3VwLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT09IFwic3RhbmRhcmRcIicsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uVG9nZ2xlR3JvdXAnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVHcm91cCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQge1xuICBwcml2YXRlIF92ZXJ0aWNhbCA9IGZhbHNlO1xuICBwcml2YXRlIF9tdWx0aXBsZSA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0QnV0dG9uVG9nZ2xlPjtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSByYXcgdmFsdWUgdGhhdCB0aGUgY29uc3VtZXIgdHJpZWQgdG8gYXNzaWduLiBUaGUgcmVhbFxuICAgKiB2YWx1ZSB3aWxsIGV4Y2x1ZGUgYW55IHZhbHVlcyBmcm9tIHRoaXMgb25lIHRoYXQgZG9uJ3QgY29ycmVzcG9uZCB0byBhXG4gICAqIHRvZ2dsZS4gVXNlZnVsIGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlIHZhbHVlIGlzIGFzc2lnbmVkIGJlZm9yZSB0aGUgdG9nZ2xlc1xuICAgKiBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQgb3IgYXQgdGhlIHNhbWUgdGhhdCB0aGV5J3JlIGJlaW5nIHN3YXBwZWQgb3V0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsdWU6IGFueTtcblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB0byBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIG5nTW9kZWwuXG4gICAqIE5vdyBgbmdNb2RlbGAgYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLlxuICAgKi9cbiAgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIG9uVG91Y2ggZnVuY3Rpb24gcmVnaXN0ZXJlZCB2aWEgcmVnaXN0ZXJPblRvdWNoIChDb250cm9sVmFsdWVBY2Nlc3NvcikuICovXG4gIF9vblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBDaGlsZCBidXR0b24gdG9nZ2xlIGJ1dHRvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRCdXR0b25Ub2dnbGUpLCB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgd291bGQgdGVjaG5pY2FsbHkgcGljayB1cCB0b2dnbGVzXG4gICAgLy8gZnJvbSBuZXN0ZWQgZ3JvdXBzLCBidXQgdGhhdCdzIG5vdCBhIGNhc2UgdGhhdCB3ZSBzdXBwb3J0LlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlLFxuICB9KVxuICBfYnV0dG9uVG9nZ2xlczogUXVlcnlMaXN0PE1hdEJ1dHRvblRvZ2dsZT47XG5cbiAgLyoqIFRoZSBhcHBlYXJhbmNlIGZvciBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhlIGdyb3VwLiAqL1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlO1xuXG4gIC8qKiBgbmFtZWAgYXR0cmlidXRlIGZvciB0aGUgdW5kZXJseWluZyBgaW5wdXRgIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcblxuICAgIGlmICh0aGlzLl9idXR0b25Ub2dnbGVzKSB7XG4gICAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHtcbiAgICAgICAgdG9nZ2xlLm5hbWUgPSB0aGlzLl9uYW1lO1xuICAgICAgICB0b2dnbGUuX21hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX25hbWUgPSBgbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAtJHt1bmlxdWVJZENvdW50ZXIrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgZ3JvdXAgaXMgdmVydGljYWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljYWw7XG4gIH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogVmFsdWUgb2YgdGhlIHRvZ2dsZSBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogW107XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkLm1hcCh0b2dnbGUgPT4gdG9nZ2xlLnZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRbMF0gPyBzZWxlY3RlZFswXS52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAgY2hhbmdlcy5cbiAgICogVXNlZCB0byBmYWNpbGl0YXRlIHR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogU2VsZWN0ZWQgYnV0dG9uIHRvZ2dsZXMgaW4gdGhlIGdyb3VwLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0QnV0dG9uVG9nZ2xlIHwgTWF0QnV0dG9uVG9nZ2xlW10ge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IFtdO1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gc2VsZWN0ZWQgOiBzZWxlY3RlZFswXSB8fCBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgbXVsdGlwbGUgYnV0dG9uIHRvZ2dsZXMgY2FuIGJlIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgbXVsdGlwbGUgYnV0dG9uIHRvZ2dsZSBncm91cCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmICh0aGlzLl9idXR0b25Ub2dnbGVzKSB7XG4gICAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHRvZ2dsZS5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGdyb3VwJ3MgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdEJ1dHRvblRvZ2dsZUNoYW5nZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TKVxuICAgIGRlZmF1bHRPcHRpb25zPzogTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHRoaXMuYXBwZWFyYW5jZSA9XG4gICAgICBkZWZhdWx0T3B0aW9ucyAmJiBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlID8gZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA6ICdzdGFuZGFyZCc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRCdXR0b25Ub2dnbGU+KHRoaXMubXVsdGlwbGUsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCguLi50aGlzLl9idXR0b25Ub2dnbGVzLmZpbHRlcih0b2dnbGUgPT4gdG9nZ2xlLmNoZWNrZWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGJlIHNldCB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIERpc3BhdGNoIGNoYW5nZSBldmVudCB3aXRoIGN1cnJlbnQgc2VsZWN0aW9uIGFuZCBncm91cCB2YWx1ZS4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgY29uc3Qgc291cmNlID0gQXJyYXkuaXNBcnJheShzZWxlY3RlZCkgPyBzZWxlY3RlZFtzZWxlY3RlZC5sZW5ndGggLSAxXSA6IHNlbGVjdGVkO1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZShzb3VyY2UhLCB0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyBhIGJ1dHRvbiB0b2dnbGUncyBzZWxlY3RlZCBzdGF0ZSB3aXRoIHRoZSBtb2RlbCB2YWx1ZS5cbiAgICogQHBhcmFtIHRvZ2dsZSBUb2dnbGUgdG8gYmUgc3luY2VkLlxuICAgKiBAcGFyYW0gc2VsZWN0IFdoZXRoZXIgdGhlIHRvZ2dsZSBzaG91bGQgYmUgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSBpc1VzZXJJbnB1dCBXaGV0aGVyIHRoZSBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi5cbiAgICogQHBhcmFtIGRlZmVyRXZlbnRzIFdoZXRoZXIgdG8gZGVmZXIgZW1pdHRpbmcgdGhlIGNoYW5nZSBldmVudHMuXG4gICAqL1xuICBfc3luY0J1dHRvblRvZ2dsZShcbiAgICB0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSxcbiAgICBzZWxlY3Q6IGJvb2xlYW4sXG4gICAgaXNVc2VySW5wdXQgPSBmYWxzZSxcbiAgICBkZWZlckV2ZW50cyA9IGZhbHNlLFxuICApIHtcbiAgICAvLyBEZXNlbGVjdCB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRvZ2dsZSwgaWYgd2UncmUgaW4gc2luZ2xlLXNlbGVjdGlvblxuICAgIC8vIG1vZGUgYW5kIHRoZSBidXR0b24gYmVpbmcgdG9nZ2xlZCBpc24ndCBzZWxlY3RlZCBhdCB0aGUgbW9tZW50LlxuICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnNlbGVjdGVkICYmICF0b2dnbGUuY2hlY2tlZCkge1xuICAgICAgKHRoaXMuc2VsZWN0ZWQgYXMgTWF0QnV0dG9uVG9nZ2xlKS5jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICBpZiAoc2VsZWN0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCh0b2dnbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3QodG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJFdmVudHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgaW4gc29tZSBjYXNlcyBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvcnNcIiwgaG93ZXZlclxuICAgIC8vIHRoZSBzaWRlLWVmZmVjdCBpcyB0aGF0IHdlIG1heSBlbmQgdXAgdXBkYXRpbmcgdGhlIG1vZGVsIHZhbHVlIG91dCBvZiBzZXF1ZW5jZSBpbiBvdGhlcnNcbiAgICAvLyBUaGUgYGRlZmVyRXZlbnRzYCBmbGFnIGFsbG93cyB1cyB0byBkZWNpZGUgd2hldGhlciB0byBkbyBpdCBvbiBhIGNhc2UtYnktY2FzZSBiYXNpcy5cbiAgICBpZiAoZGVmZXJFdmVudHMpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fdXBkYXRlTW9kZWxWYWx1ZShpc1VzZXJJbnB1dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVNb2RlbFZhbHVlKGlzVXNlcklucHV0KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgYSBidXR0b24gdG9nZ2xlIGlzIHNlbGVjdGVkLiAqL1xuICBfaXNTZWxlY3RlZCh0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKHRvZ2dsZSk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgYnV0dG9uIHRvZ2dsZSBzaG91bGQgYmUgY2hlY2tlZCBvbiBpbml0LiAqL1xuICBfaXNQcmVjaGVja2VkKHRvZ2dsZTogTWF0QnV0dG9uVG9nZ2xlKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9yYXdWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMuX3Jhd1ZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Jhd1ZhbHVlLnNvbWUodmFsdWUgPT4gdG9nZ2xlLnZhbHVlICE9IG51bGwgJiYgdmFsdWUgPT09IHRvZ2dsZS52YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvZ2dsZS52YWx1ZSA9PT0gdGhpcy5fcmF3VmFsdWU7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgc2VsZWN0aW9uIHN0YXRlIG9mIHRoZSB0b2dnbGVzIGluIHRoZSBncm91cCBiYXNlZCBvbiBhIHZhbHVlLiAqL1xuICBwcml2YXRlIF9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlOiBhbnkgfCBhbnlbXSkge1xuICAgIHRoaXMuX3Jhd1ZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoIXRoaXMuX2J1dHRvblRvZ2dsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignVmFsdWUgbXVzdCBiZSBhbiBhcnJheSBpbiBtdWx0aXBsZS1zZWxlY3Rpb24gbW9kZS4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRWYWx1ZTogYW55KSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuX3NlbGVjdFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSBzZWxlY3RlZCB0b2dnbGVzLiAqL1xuICBwcml2YXRlIF9jbGVhclNlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuICAgIHRoaXMuX2J1dHRvblRvZ2dsZXMuZm9yRWFjaCh0b2dnbGUgPT4gKHRvZ2dsZS5jaGVja2VkID0gZmFsc2UpKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGEgdmFsdWUgaWYgdGhlcmUncyBhIHRvZ2dsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGl0LiAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMuX2J1dHRvblRvZ2dsZXMuZmluZCh0b2dnbGUgPT4ge1xuICAgICAgcmV0dXJuIHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHRvZ2dsZS52YWx1ZSA9PT0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3luY3MgdXAgdGhlIGdyb3VwJ3MgdmFsdWUgd2l0aCB0aGUgbW9kZWwgYW5kIGVtaXRzIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gIHByaXZhdGUgX3VwZGF0ZU1vZGVsVmFsdWUoaXNVc2VySW5wdXQ6IGJvb2xlYW4pIHtcbiAgICAvLyBPbmx5IGVtaXQgdGhlIGNoYW5nZSBldmVudCBmb3IgdXNlciBpbnB1dC5cbiAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIGVtaXQgdGhpcyBvbmUgbm8gbWF0dGVyIHdoZXRoZXIgaXQgd2FzIGEgdXNlciBpbnRlcmFjdGlvbiwgYmVjYXVzZVxuICAgIC8vIGl0IGlzIHVzZWQgYnkgQW5ndWxhciB0byBzeW5jIHVwIHRoZSB0d28td2F5IGRhdGEgYmluZGluZy5cbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gIH1cbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byB0aGUgTWF0QnV0dG9uVG9nZ2xlIGNsYXNzLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRCdXR0b25Ub2dnbGVCYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcblxuLyoqIFNpbmdsZSBidXR0b24gaW5zaWRlIG9mIGEgdG9nZ2xlIGdyb3VwLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydidXR0b24tdG9nZ2xlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFsb25lXSc6ICchYnV0dG9uVG9nZ2xlR3JvdXAnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi10b2dnbGUtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnY2xhc3MnOiAnbWF0LWJ1dHRvbi10b2dnbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIubmFtZV0nOiAnbnVsbCcsXG4gICAgJyhmb2N1cyknOiAnZm9jdXMoKScsXG4gICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlXG4gIGV4dGVuZHMgX01hdEJ1dHRvblRvZ2dsZUJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9pc1NpbmdsZVNlbGVjdG9yID0gZmFsc2U7XG4gIHByaXZhdGUgX2NoZWNrZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQXR0YWNoZWQgdG8gdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuIEluIG1vc3QgY2FzZXMsIGFyaWEtbGFiZWxsZWRieSB3aWxsXG4gICAqIHRha2UgcHJlY2VkZW5jZSBzbyB0aGlzIG1heSBiZSBvbWl0dGVkLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmRlcmx5aW5nIG5hdGl2ZSBgYnV0dG9uYCBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdidXR0b24nKSBfYnV0dG9uRWxlbWVudDogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG5cbiAgLyoqIFRoZSBwYXJlbnQgYnV0dG9uIHRvZ2dsZSBncm91cCAoZXhjbHVzaXZlIHNlbGVjdGlvbikuIE9wdGlvbmFsLiAqL1xuICBidXR0b25Ub2dnbGVHcm91cDogTWF0QnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIHVuZGVybHlpbmcgYGJ1dHRvbmAgZWxlbWVudC4gKi9cbiAgZ2V0IGJ1dHRvbklkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LWJ1dHRvbmA7XG4gIH1cblxuICAvKiogVGhlIHVuaXF1ZSBJRCBmb3IgdGhpcyBidXR0b24gdG9nZ2xlLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nO1xuXG4gIC8qKiBIVE1MJ3MgJ25hbWUnIGF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIHJhZGlvcyBmb3IgdW5pcXVlIHNlbGVjdGlvbi4gKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKiBNYXRCdXR0b25Ub2dnbGVHcm91cCByZWFkcyB0aGlzIHRvIGFzc2lnbiBpdHMgb3duIHZhbHVlLiAqL1xuICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFRoZSBhcHBlYXJhbmNlIHN0eWxlIG9mIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2Uge1xuICAgIHJldHVybiB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwID8gdGhpcy5idXR0b25Ub2dnbGVHcm91cC5hcHBlYXJhbmNlIDogdGhpcy5fYXBwZWFyYW5jZTtcbiAgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZSkge1xuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9hcHBlYXJhbmNlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgY2hlY2tlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgPyB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9pc1NlbGVjdGVkKHRoaXMpIDogdGhpcy5fY2hlY2tlZDtcbiAgfVxuICBzZXQgY2hlY2tlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9jaGVja2VkKSB7XG4gICAgICB0aGlzLl9jaGVja2VkID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuX3N5bmNCdXR0b25Ub2dnbGUodGhpcywgdGhpcy5fY2hlY2tlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBncm91cCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9HUk9VUCkgdG9nZ2xlR3JvdXA6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIGRlZmF1bHRUYWJJbmRleDogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHBhcnNlZFRhYkluZGV4ID0gTnVtYmVyKGRlZmF1bHRUYWJJbmRleCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlZFRhYkluZGV4IHx8IHBhcnNlZFRhYkluZGV4ID09PSAwID8gcGFyc2VkVGFiSW5kZXggOiBudWxsO1xuICAgIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgPSB0b2dnbGVHcm91cDtcbiAgICB0aGlzLmFwcGVhcmFuY2UgPVxuICAgICAgZGVmYXVsdE9wdGlvbnMgJiYgZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA/IGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgOiAnc3RhbmRhcmQnO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwO1xuICAgIHRoaXMuX2lzU2luZ2xlU2VsZWN0b3IgPSBncm91cCAmJiAhZ3JvdXAubXVsdGlwbGU7XG4gICAgdGhpcy5pZCA9IHRoaXMuaWQgfHwgYG1hdC1idXR0b24tdG9nZ2xlLSR7dW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAgIGlmICh0aGlzLl9pc1NpbmdsZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLm5hbWUgPSBncm91cC5uYW1lO1xuICAgIH1cblxuICAgIGlmIChncm91cCkge1xuICAgICAgaWYgKGdyb3VwLl9pc1ByZWNoZWNrZWQodGhpcykpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgICAgLy8gQXMgYXMgc2lkZSBlZmZlY3Qgb2YgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgdG9nZ2xlIGdyb3VwIGFuZCB0aGUgYnV0dG9uLFxuICAgICAgICAvLyB3ZSBtYXkgZW5kIHVwIGluIGEgc3RhdGUgd2hlcmUgdGhlIGJ1dHRvbiBpcyBzdXBwb3NlZCB0byBiZSBjaGVja2VkIG9uIGluaXQsIGJ1dCBpdFxuICAgICAgICAvLyBpc24ndCwgYmVjYXVzZSB0aGUgY2hlY2tlZCB2YWx1ZSB3YXMgYXNzaWduZWQgdG9vIGVhcmx5LiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBJdnlcbiAgICAgICAgLy8gYXNzaWducyB0aGUgc3RhdGljIGlucHV0IHZhbHVlIGJlZm9yZSB0aGUgYG5nT25Jbml0YCBoYXMgcnVuLlxuICAgICAgICBncm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBSZW1vdmUgdGhlIHRvZ2dsZSBmcm9tIHRoZSBzZWxlY3Rpb24gb25jZSBpdCdzIGRlc3Ryb3llZC4gTmVlZHMgdG8gaGFwcGVuXG4gICAgLy8gb24gdGhlIG5leHQgdGljayBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICBpZiAoZ3JvdXAgJiYgZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykpIHtcbiAgICAgIGdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdGhlIGJ1dHRvbiB0b2dnbGUgZHVlIHRvIGFuIGludGVyYWN0aW9uIHdpdGggdGhlIHVuZGVybHlpbmcgbmF0aXZlIGJ1dHRvbi4gKi9cbiAgX29uQnV0dG9uQ2xpY2soKSB7XG4gICAgY29uc3QgbmV3Q2hlY2tlZCA9IHRoaXMuX2lzU2luZ2xlU2VsZWN0b3IgPyB0cnVlIDogIXRoaXMuX2NoZWNrZWQ7XG5cbiAgICBpZiAobmV3Q2hlY2tlZCAhPT0gdGhpcy5fY2hlY2tlZCkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld0NoZWNrZWQ7XG4gICAgICBpZiAodGhpcy5idXR0b25Ub2dnbGVHcm91cCkge1xuICAgICAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIHRoaXMuX2NoZWNrZWQsIHRydWUpO1xuICAgICAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9vblRvdWNoZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCB3aGVuIGl0J3MgdGhlIHNpbmdsZSBzZWxlY3RvclxuICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSh0aGlzLCB0aGlzLnZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGJ1dHRvbiB0b2dnbGUgYXMgbmVlZGluZyBjaGVja2luZyBmb3IgY2hhbmdlIGRldGVjdGlvbi5cbiAgICogVGhpcyBtZXRob2QgaXMgZXhwb3NlZCBiZWNhdXNlIHRoZSBwYXJlbnQgYnV0dG9uIHRvZ2dsZSBncm91cCB3aWxsIGRpcmVjdGx5XG4gICAqIHVwZGF0ZSBib3VuZCBwcm9wZXJ0aWVzIG9mIHRoZSByYWRpbyBidXR0b24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCkge1xuICAgIC8vIFdoZW4gdGhlIGdyb3VwIHZhbHVlIGNoYW5nZXMsIHRoZSBidXR0b24gd2lsbCBub3QgYmUgbm90aWZpZWQuXG4gICAgLy8gVXNlIGBtYXJrRm9yQ2hlY2tgIHRvIGV4cGxpY2l0IHVwZGF0ZSBidXR0b24gdG9nZ2xlJ3Mgc3RhdHVzLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iLCI8YnV0dG9uICNidXR0b24gY2xhc3M9XCJtYXQtYnV0dG9uLXRvZ2dsZS1idXR0b24gbWF0LWZvY3VzLWluZGljYXRvclwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBbaWRdPVwiYnV0dG9uSWRcIlxuICAgICAgICBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IC0xIDogdGFiSW5kZXhcIlxuICAgICAgICBbYXR0ci5hcmlhLXByZXNzZWRdPVwiY2hlY2tlZFwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBudWxsXCJcbiAgICAgICAgW2F0dHIubmFtZV09XCJuYW1lIHx8IG51bGxcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieVwiXG4gICAgICAgIChjbGljayk9XCJfb25CdXR0b25DbGljaygpXCI+XG4gIDxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtbGFiZWwtY29udGVudFwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9zcGFuPlxuPC9idXR0b24+XG5cbjxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtZm9jdXMtb3ZlcmxheVwiPjwvc3Bhbj5cbjxzcGFuIGNsYXNzPVwibWF0LWJ1dHRvbi10b2dnbGUtcmlwcGxlXCIgbWF0UmlwcGxlXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cImJ1dHRvblwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJ0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZFwiPlxuPC9zcGFuPlxuIl19