/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Self, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { MatFormFieldControl, MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { getMatInputUnsupportedTypeError } from './input-errors';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/core";
import * as i4 from "@angular/cdk/text-field";
import * as i5 from "@angular/material/form-field";
// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
const MAT_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
];
let nextUniqueId = 0;
// Boilerplate for applying mixins to MatInput.
/** @docs-private */
const _MatInputBase = mixinErrorState(class {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /** @docs-private */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
});
/** Directive that allows a native input to work inside a `MatFormField`. */
export class MatInput extends _MatInputBase {
    constructor(_elementRef, _platform, ngControl, _parentForm, _parentFormGroup, _defaultErrorStateMatcher, inputValueAccessor, _autofillMonitor, ngZone, 
    // TODO: Remove this once the legacy appearance has been removed. We only need
    // to inject the form-field for determining whether the placeholder has been promoted.
    _formField) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._autofillMonitor = _autofillMonitor;
        this._formField = _formField;
        this._uid = `mat-input-${nextUniqueId++}`;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.focused = false;
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.stateChanges = new Subject();
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.controlType = 'mat-input';
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        this.autofilled = false;
        this._disabled = false;
        this._type = 'text';
        this._readonly = false;
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week',
        ].filter(t => getSupportedInputTypes().has(t));
        this._iOSKeyupListener = (event) => {
            const el = event.target;
            // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
            // indicate different things. If the value is 0, it means that the caret is at the start
            // of the input, whereas a value of `null` means that the input doesn't support
            // manipulating the selection range. Inputs that don't support setting the selection range
            // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
            // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
            if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
                // Note: Just setting `0, 0` doesn't fix the issue. Setting
                // `1, 1` fixes it for the first time that you type text and
                // then hold delete. Toggling to `1, 1` and then back to
                // `0, 0` seems to completely fix it.
                el.setSelectionRange(1, 1);
                el.setSelectionRange(0, 0);
            }
        };
        const element = this._elementRef.nativeElement;
        const nodeName = element.nodeName.toLowerCase();
        // If no input value accessor was explicitly specified, use the element as the input value
        // accessor.
        this._inputValueAccessor = inputValueAccessor || element;
        this._previousNativeValue = this.value;
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            ngZone.runOutsideAngular(() => {
                _elementRef.nativeElement.addEventListener('keyup', this._iOSKeyupListener);
            });
        }
        this._isServer = !this._platform.isBrowser;
        this._isNativeSelect = nodeName === 'select';
        this._isTextarea = nodeName === 'textarea';
        this._isInFormField = !!_formField;
        if (this._isNativeSelect) {
            this.controlType = element.multiple
                ? 'mat-native-select-multiple'
                : 'mat-native-select';
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled() {
        if (this.ngControl && this.ngControl.disabled !== null) {
            return this.ngControl.disabled;
        }
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // Browsers may not fire the blur event if the input is disabled too quickly.
        // Reset from here to ensure that the element doesn't become stuck.
        if (this.focused) {
            this.focused = false;
            this.stateChanges.next();
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    /** Input type of the element. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'text';
        this._validateType();
        // When using Angular inputs, developers are no longer able to set the properties on the native
        // input element. To ensure that bindings for `type` work, we need to sync the setter
        // with the native property. Textarea elements don't support the type property or attribute.
        if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
            this._elementRef.nativeElement.type = this._type;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value() {
        return this._inputValueAccessor.value;
    }
    set value(value) {
        if (value !== this.value) {
            this._inputValueAccessor.value = value;
            this.stateChanges.next();
        }
    }
    /** Whether the element is readonly. */
    get readonly() {
        return this._readonly;
    }
    set readonly(value) {
        this._readonly = coerceBooleanProperty(value);
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
                this.autofilled = event.isAutofilled;
                this.stateChanges.next();
            });
        }
    }
    ngOnChanges() {
        this.stateChanges.next();
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
        if (this._platform.IOS) {
            this._elementRef.nativeElement.removeEventListener('keyup', this._iOSKeyupListener);
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }
        // We need to dirty-check the native element's value, because there are some cases where
        // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
        // updating the value using `emitEvent: false`).
        this._dirtyCheckNativeValue();
        // We need to dirty-check and set the placeholder attribute ourselves, because whether it's
        // present or not depends on a query which is prone to "changed after checked" errors.
        this._dirtyCheckPlaceholder();
    }
    /** Focuses the input. */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused) {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }
    _onInput() {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    }
    /** Does some manual dirty checking on the native input `placeholder` attribute. */
    _dirtyCheckPlaceholder() {
        // If we're hiding the native placeholder, it should also be cleared from the DOM, otherwise
        // screen readers will read it out twice: once from the label and once from the attribute.
        // TODO: can be removed once we get rid of the `legacy` style for the form field, because it's
        // the only one that supports promoting the placeholder to a label.
        const placeholder = this._formField?._hideControlPlaceholder?.() ? null : this.placeholder;
        if (placeholder !== this._previousPlaceholder) {
            const element = this._elementRef.nativeElement;
            this._previousPlaceholder = placeholder;
            placeholder
                ? element.setAttribute('placeholder', placeholder)
                : element.removeAttribute('placeholder');
        }
    }
    /** Does some manual dirty checking on the native input `value` property. */
    _dirtyCheckNativeValue() {
        const newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }
    /** Make sure the input is a supported type. */
    _validateType() {
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatInputUnsupportedTypeError(this._type);
        }
    }
    /** Checks whether the input type is one of the types that are never empty. */
    _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    }
    /** Checks whether the input is invalid based on the native validation. */
    _isBadInput() {
        // The `validity` property won't be present on platform-server.
        let validity = this._elementRef.nativeElement.validity;
        return validity && validity.badInput;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty() {
        return (!this._isNeverEmpty() &&
            !this._elementRef.nativeElement.value &&
            !this._isBadInput() &&
            !this.autofilled);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        if (this._isNativeSelect) {
            // For a single-selection `<select>`, the label should float when the selected option has
            // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
            // overlapping the label with the options.
            const selectElement = this._elementRef.nativeElement;
            const firstOption = selectElement.options[0];
            // On most browsers the `selectedIndex` will always be 0, however on IE and Edge it'll be
            // -1 if the `value` is set to something, that isn't in the list of options, at a later point.
            return (this.focused ||
                selectElement.multiple ||
                !this.empty ||
                !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label));
        }
        else {
            return this.focused || !this.empty;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids) {
        if (ids.length) {
            this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
        }
        else {
            this._elementRef.nativeElement.removeAttribute('aria-describedby');
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick() {
        // Do not re-focus the input element if the element is already focused. Otherwise it can happen
        // that someone clicks on a time input and the cursor resets to the "hours" field while the
        // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
        if (!this.focused) {
            this.focus();
        }
    }
    /** Whether the form control is a native select that is displayed inline. */
    _isInlineSelect() {
        const element = this._elementRef.nativeElement;
        return this._isNativeSelect && (element.multiple || element.size > 1);
    }
}
MatInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatInput, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i2.NgControl, optional: true, self: true }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.ErrorStateMatcher }, { token: MAT_INPUT_VALUE_ACCESSOR, optional: true, self: true }, { token: i4.AutofillMonitor }, { token: i0.NgZone }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", inputs: { disabled: "disabled", id: "id", placeholder: "placeholder", name: "name", required: "required", type: "type", errorStateMatcher: "errorStateMatcher", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], value: "value", readonly: "readonly" }, host: { listeners: { "focus": "_focusChanged(true)", "blur": "_focusChanged(false)", "input": "_onInput()" }, properties: { "class.mat-input-server": "_isServer", "attr.id": "id", "attr.data-placeholder": "placeholder", "disabled": "disabled", "required": "required", "attr.name": "name || null", "attr.readonly": "readonly && !_isNativeSelect || null", "class.mat-native-select-inline": "_isInlineSelect()", "attr.aria-invalid": "(empty && required) ? null : errorState", "attr.aria-required": "required" }, classAttribute: "mat-input-element mat-form-field-autofill-control" }, providers: [{ provide: MatFormFieldControl, useExisting: MatInput }], exportAs: ["matInput"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatInput, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
                    exportAs: 'matInput',
                    host: {
                        /**
                         * @breaking-change 8.0.0 remove .mat-form-field-autofill-control in favor of AutofillMonitor.
                         */
                        'class': 'mat-input-element mat-form-field-autofill-control',
                        '[class.mat-input-server]': '_isServer',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[attr.id]': 'id',
                        // At the time of writing, we have a lot of customer tests that look up the input based on its
                        // placeholder. Since we sometimes omit the placeholder attribute from the DOM to prevent screen
                        // readers from reading it twice, we have to keep it somewhere in the DOM for the lookup.
                        '[attr.data-placeholder]': 'placeholder',
                        '[disabled]': 'disabled',
                        '[required]': 'required',
                        '[attr.name]': 'name || null',
                        '[attr.readonly]': 'readonly && !_isNativeSelect || null',
                        '[class.mat-native-select-inline]': '_isInlineSelect()',
                        // Only mark the input as invalid for assistive technology if it has a value since the
                        // state usually overlaps with `aria-required` when the input is empty and can be redundant.
                        '[attr.aria-invalid]': '(empty && required) ? null : errorState',
                        '[attr.aria-required]': 'required',
                        '(focus)': '_focusChanged(true)',
                        '(blur)': '_focusChanged(false)',
                        '(input)': '_onInput()',
                    },
                    providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i2.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.ErrorStateMatcher }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [MAT_INPUT_VALUE_ACCESSOR]
                }] }, { type: i4.AutofillMonitor }, { type: i0.NgZone }, { type: i5.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }]; }, propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], type: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }], value: [{
                type: Input
            }], readonly: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvaW5wdXQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsSUFBSSxHQUNMLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pGLE9BQU8sRUFBc0IsaUJBQWlCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDL0YsT0FBTyxFQUFDLG1CQUFtQixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7Ozs7O0FBRWhFLHFGQUFxRjtBQUNyRixNQUFNLHVCQUF1QixHQUFHO0lBQzlCLFFBQVE7SUFDUixVQUFVO0lBQ1YsTUFBTTtJQUNOLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtDQUNULENBQUM7QUFFRixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsK0NBQStD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QUUsY0FBYzt3QkFDN0IsaUJBQWlCLEVBQUUsc0NBQXNDO3dCQUN6RCxrQ0FBa0MsRUFBRSxtQkFBbUI7d0JBQ3ZELHNGQUFzRjt3QkFDdEYsNEZBQTRGO3dCQUM1RixxQkFBcUIsRUFBRSx5Q0FBeUM7d0JBQ2hFLHNCQUFzQixFQUFFLFVBQVU7d0JBQ2xDLFNBQVMsRUFBRSxxQkFBcUI7d0JBQ2hDLFFBQVEsRUFBRSxzQkFBc0I7d0JBQ2hDLFNBQVMsRUFBRSxZQUFZO3FCQUN4QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLFVBQVUsRUFBQyxDQUFDO2lCQUNuRTs7MEJBaUxJLFFBQVE7OzBCQUFJLElBQUk7OzBCQUNoQixRQUFROzswQkFDUixRQUFROzswQkFFUixRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLHdCQUF3Qjs7MEJBS25ELFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsY0FBYzs0Q0FqSWhDLFFBQVE7c0JBRFgsS0FBSztnQkF3QkYsRUFBRTtzQkFETCxLQUFLO2dCQWFHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBTUcsSUFBSTtzQkFBWixLQUFLO2dCQU9GLFFBQVE7c0JBRFgsS0FBSztnQkFXRixJQUFJO3NCQURQLEtBQUs7Z0JBa0JZLGlCQUFpQjtzQkFBbEMsS0FBSztnQkFNcUIsbUJBQW1CO3NCQUE3QyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFPckIsS0FBSztzQkFEUixLQUFLO2dCQWFGLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzLCBQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QXV0b2ZpbGxNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvdGV4dC1maWVsZCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybSwgVmFsaWRhdG9yc30gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDYW5VcGRhdGVFcnJvclN0YXRlLCBFcnJvclN0YXRlTWF0Y2hlciwgbWl4aW5FcnJvclN0YXRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbCwgTWF0Rm9ybUZpZWxkLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yfSBmcm9tICcuL2lucHV0LWVycm9ycyc7XG5pbXBvcnQge01BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9pbnB1dC12YWx1ZS1hY2Nlc3Nvcic7XG5cbi8vIEludmFsaWQgaW5wdXQgdHlwZS4gVXNpbmcgb25lIG9mIHRoZXNlIHdpbGwgdGhyb3cgYW4gTWF0SW5wdXRVbnN1cHBvcnRlZFR5cGVFcnJvci5cbmNvbnN0IE1BVF9JTlBVVF9JTlZBTElEX1RZUEVTID0gW1xuICAnYnV0dG9uJyxcbiAgJ2NoZWNrYm94JyxcbiAgJ2ZpbGUnLFxuICAnaGlkZGVuJyxcbiAgJ2ltYWdlJyxcbiAgJ3JhZGlvJyxcbiAgJ3JhbmdlJyxcbiAgJ3Jlc2V0JyxcbiAgJ3N1Ym1pdCcsXG5dO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRJbnB1dC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0SW5wdXRCYXNlID0gbWl4aW5FcnJvclN0YXRlKFxuICBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgICkge31cbiAgfSxcbik7XG5cbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdElucHV0XSwgdGV4dGFyZWFbbWF0SW5wdXRdLCBzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0sXG4gICAgICBpbnB1dFttYXROYXRpdmVDb250cm9sXSwgdGV4dGFyZWFbbWF0TmF0aXZlQ29udHJvbF1gLFxuICBleHBvcnRBczogJ21hdElucHV0JyxcbiAgaG9zdDoge1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIC5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbC1jb250cm9sIGluIGZhdm9yIG9mIEF1dG9maWxsTW9uaXRvci5cbiAgICAgKi9cbiAgICAnY2xhc3MnOiAnbWF0LWlucHV0LWVsZW1lbnQgbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGwtY29udHJvbCcsXG4gICAgJ1tjbGFzcy5tYXQtaW5wdXQtc2VydmVyXSc6ICdfaXNTZXJ2ZXInLFxuICAgIC8vIE5hdGl2ZSBpbnB1dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG92ZXJ3cml0dGVuIGJ5IEFuZ3VsYXIgaW5wdXRzIG5lZWQgdG8gYmUgc3luY2VkIHdpdGhcbiAgICAvLyB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQuIE90aGVyd2lzZSBwcm9wZXJ0eSBiaW5kaW5ncyBmb3IgdGhvc2UgZG9uJ3Qgd29yay5cbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAvLyBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB3ZSBoYXZlIGEgbG90IG9mIGN1c3RvbWVyIHRlc3RzIHRoYXQgbG9vayB1cCB0aGUgaW5wdXQgYmFzZWQgb24gaXRzXG4gICAgLy8gcGxhY2Vob2xkZXIuIFNpbmNlIHdlIHNvbWV0aW1lcyBvbWl0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZnJvbSB0aGUgRE9NIHRvIHByZXZlbnQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyBmcm9tIHJlYWRpbmcgaXQgdHdpY2UsIHdlIGhhdmUgdG8ga2VlcCBpdCBzb21ld2hlcmUgaW4gdGhlIERPTSBmb3IgdGhlIGxvb2t1cC5cbiAgICAnW2F0dHIuZGF0YS1wbGFjZWhvbGRlcl0nOiAncGxhY2Vob2xkZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW3JlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1thdHRyLm5hbWVdJzogJ25hbWUgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnJlYWRvbmx5XSc6ICdyZWFkb25seSAmJiAhX2lzTmF0aXZlU2VsZWN0IHx8IG51bGwnLFxuICAgICdbY2xhc3MubWF0LW5hdGl2ZS1zZWxlY3QtaW5saW5lXSc6ICdfaXNJbmxpbmVTZWxlY3QoKScsXG4gICAgLy8gT25seSBtYXJrIHRoZSBpbnB1dCBhcyBpbnZhbGlkIGZvciBhc3Npc3RpdmUgdGVjaG5vbG9neSBpZiBpdCBoYXMgYSB2YWx1ZSBzaW5jZSB0aGVcbiAgICAvLyBzdGF0ZSB1c3VhbGx5IG92ZXJsYXBzIHdpdGggYGFyaWEtcmVxdWlyZWRgIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5IGFuZCBjYW4gYmUgcmVkdW5kYW50LlxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJyhlbXB0eSAmJiByZXF1aXJlZCkgPyBudWxsIDogZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnKGZvY3VzKSc6ICdfZm9jdXNDaGFuZ2VkKHRydWUpJyxcbiAgICAnKGJsdXIpJzogJ19mb2N1c0NoYW5nZWQoZmFsc2UpJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXRJbnB1dH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJbnB1dFxuICBleHRlbmRzIF9NYXRJbnB1dEJhc2VcbiAgaW1wbGVtZW50c1xuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PixcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgRG9DaGVjayxcbiAgICBDYW5VcGRhdGVFcnJvclN0YXRlXG57XG4gIHByb3RlY3RlZCBfdWlkID0gYG1hdC1pbnB1dC0ke25leHRVbmlxdWVJZCsrfWA7XG4gIHByb3RlY3RlZCBfcHJldmlvdXNOYXRpdmVWYWx1ZTogYW55O1xuICBwcml2YXRlIF9pbnB1dFZhbHVlQWNjZXNzb3I6IHt2YWx1ZTogYW55fTtcbiAgcHJpdmF0ZSBfcHJldmlvdXNQbGFjZWhvbGRlcjogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGJlaW5nIHJlbmRlcmVkIG9uIHRoZSBzZXJ2ZXIuICovXG4gIHJlYWRvbmx5IF9pc1NlcnZlcjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGEgbmF0aXZlIGh0bWwgc2VsZWN0LiAqL1xuICByZWFkb25seSBfaXNOYXRpdmVTZWxlY3Q6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIHRleHRhcmVhLiAqL1xuICByZWFkb25seSBfaXNUZXh0YXJlYTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgaW5wdXQgaXMgaW5zaWRlIG9mIGEgZm9ybSBmaWVsZC4gKi9cbiAgcmVhZG9ubHkgX2lzSW5Gb3JtRmllbGQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udHJvbFR5cGU6IHN0cmluZyA9ICdtYXQtaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGF1dG9maWxsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sICYmIHRoaXMubmdDb250cm9sLmRpc2FibGVkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZ0NvbnRyb2wuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIEJyb3dzZXJzIG1heSBub3QgZmlyZSB0aGUgYmx1ciBldmVudCBpZiB0aGUgaW5wdXQgaXMgZGlzYWJsZWQgdG9vIHF1aWNrbHkuXG4gICAgLy8gUmVzZXQgZnJvbSBoZXJlIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGRvZXNuJ3QgYmVjb21lIHN0dWNrLlxuICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7XG4gIH1cbiAgcHJvdGVjdGVkIF9pZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCA/PyB0aGlzLm5nQ29udHJvbD8uY29udHJvbD8uaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMucmVxdWlyZWQpID8/IGZhbHNlO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIElucHV0IHR5cGUgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAndGV4dCc7XG4gICAgdGhpcy5fdmFsaWRhdGVUeXBlKCk7XG5cbiAgICAvLyBXaGVuIHVzaW5nIEFuZ3VsYXIgaW5wdXRzLCBkZXZlbG9wZXJzIGFyZSBubyBsb25nZXIgYWJsZSB0byBzZXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIG5hdGl2ZVxuICAgIC8vIGlucHV0IGVsZW1lbnQuIFRvIGVuc3VyZSB0aGF0IGJpbmRpbmdzIGZvciBgdHlwZWAgd29yaywgd2UgbmVlZCB0byBzeW5jIHRoZSBzZXR0ZXJcbiAgICAvLyB3aXRoIHRoZSBuYXRpdmUgcHJvcGVydHkuIFRleHRhcmVhIGVsZW1lbnRzIGRvbid0IHN1cHBvcnQgdGhlIHR5cGUgcHJvcGVydHkgb3IgYXR0cmlidXRlLlxuICAgIGlmICghdGhpcy5faXNUZXh0YXJlYSAmJiBnZXRTdXBwb3J0ZWRJbnB1dFR5cGVzKCkuaGFzKHRoaXMuX3R5cGUpKSB7XG4gICAgICAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUgPSB0aGlzLl90eXBlO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX3R5cGUgPSAndGV4dCc7XG5cbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIG92ZXJyaWRlIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lucHV0VmFsdWVBY2Nlc3Nvci52YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgcmVhZG9ubHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gIH1cbiAgc2V0IHJlYWRvbmx5KHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9yZWFkb25seSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVhZG9ubHkgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX25ldmVyRW1wdHlJbnB1dFR5cGVzID0gW1xuICAgICdkYXRlJyxcbiAgICAnZGF0ZXRpbWUnLFxuICAgICdkYXRldGltZS1sb2NhbCcsXG4gICAgJ21vbnRoJyxcbiAgICAndGltZScsXG4gICAgJ3dlZWsnLFxuICBdLmZpbHRlcih0ID0+IGdldFN1cHBvcnRlZElucHV0VHlwZXMoKS5oYXModCkpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IpIGlucHV0VmFsdWVBY2Nlc3NvcjogYW55LFxuICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIG9uY2UgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIGhhcyBiZWVuIHJlbW92ZWQuIFdlIG9ubHkgbmVlZFxuICAgIC8vIHRvIGluamVjdCB0aGUgZm9ybS1maWVsZCBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgcGxhY2Vob2xkZXIgaGFzIGJlZW4gcHJvbW90ZWQuXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfZm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkLFxuICApIHtcbiAgICBzdXBlcihfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBJZiBubyBpbnB1dCB2YWx1ZSBhY2Nlc3NvciB3YXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIHVzZSB0aGUgZWxlbWVudCBhcyB0aGUgaW5wdXQgdmFsdWVcbiAgICAvLyBhY2Nlc3Nvci5cbiAgICB0aGlzLl9pbnB1dFZhbHVlQWNjZXNzb3IgPSBpbnB1dFZhbHVlQWNjZXNzb3IgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuXG4gICAgLy8gT24gc29tZSB2ZXJzaW9ucyBvZiBpT1MgdGhlIGNhcmV0IGdldHMgc3R1Y2sgaW4gdGhlIHdyb25nIHBsYWNlIHdoZW4gaG9sZGluZyBkb3duIHRoZSBkZWxldGVcbiAgICAvLyBrZXkuIEluIG9yZGVyIHRvIGdldCBhcm91bmQgdGhpcyB3ZSBuZWVkIHRvIFwiamlnZ2xlXCIgdGhlIGNhcmV0IGxvb3NlLiBTaW5jZSB0aGlzIGJ1ZyBvbmx5XG4gICAgLy8gZXhpc3RzIG9uIGlPUywgd2Ugb25seSBib3RoZXIgdG8gaW5zdGFsbCB0aGUgbGlzdGVuZXIgb24gaU9TLlxuICAgIGlmIChfcGxhdGZvcm0uSU9TKSB7XG4gICAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5faU9TS2V5dXBMaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1NlcnZlciA9ICF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXI7XG4gICAgdGhpcy5faXNOYXRpdmVTZWxlY3QgPSBub2RlTmFtZSA9PT0gJ3NlbGVjdCc7XG4gICAgdGhpcy5faXNUZXh0YXJlYSA9IG5vZGVOYW1lID09PSAndGV4dGFyZWEnO1xuICAgIHRoaXMuX2lzSW5Gb3JtRmllbGQgPSAhIV9mb3JtRmllbGQ7XG5cbiAgICBpZiAodGhpcy5faXNOYXRpdmVTZWxlY3QpIHtcbiAgICAgIHRoaXMuY29udHJvbFR5cGUgPSAoZWxlbWVudCBhcyBIVE1MU2VsZWN0RWxlbWVudCkubXVsdGlwbGVcbiAgICAgICAgPyAnbWF0LW5hdGl2ZS1zZWxlY3QtbXVsdGlwbGUnXG4gICAgICAgIDogJ21hdC1uYXRpdmUtc2VsZWN0JztcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmF1dG9maWxsZWQgPSBldmVudC5pc0F1dG9maWxsZWQ7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9hdXRvZmlsbE1vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uSU9TKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9pT1NLZXl1cExpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoaXMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZVxuICAgICAgLy8gZXJyb3IgdHJpZ2dlcnMgdGhhdCB3ZSBjYW4ndCBzdWJzY3JpYmUgdG8gKGUuZy4gcGFyZW50IGZvcm0gc3VibWlzc2lvbnMpLiBUaGlzIG1lYW5zXG4gICAgICAvLyB0aGF0IHdoYXRldmVyIGxvZ2ljIGlzIGluIGhlcmUgaGFzIHRvIGJlIHN1cGVyIGxlYW4gb3Igd2UgcmlzayBkZXN0cm95aW5nIHRoZSBwZXJmb3JtYW5jZS5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgdGhlIG5hdGl2ZSBlbGVtZW50J3MgdmFsdWUsIGJlY2F1c2UgdGhlcmUgYXJlIHNvbWUgY2FzZXMgd2hlcmVcbiAgICAvLyB3ZSB3b24ndCBiZSBub3RpZmllZCB3aGVuIGl0IGNoYW5nZXMgKGUuZy4gdGhlIGNvbnN1bWVyIGlzbid0IHVzaW5nIGZvcm1zIG9yIHRoZXkncmVcbiAgICAvLyB1cGRhdGluZyB0aGUgdmFsdWUgdXNpbmcgYGVtaXRFdmVudDogZmFsc2VgKS5cbiAgICB0aGlzLl9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlydHktY2hlY2sgYW5kIHNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG91cnNlbHZlcywgYmVjYXVzZSB3aGV0aGVyIGl0J3NcbiAgICAvLyBwcmVzZW50IG9yIG5vdCBkZXBlbmRzIG9uIGEgcXVlcnkgd2hpY2ggaXMgcHJvbmUgdG8gXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgdGhpcy5fZGlydHlDaGVja1BsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgaW5wdXQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgZm9yIHRoZSBjYXNlcyB3aGVyZSB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgaW5wdXQgY2hhbmdlcy4gKi9cbiAgX2ZvY3VzQ2hhbmdlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNGb2N1c2VkICE9PSB0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCgpIHtcbiAgICAvLyBUaGlzIGlzIGEgbm9vcCBmdW5jdGlvbiBhbmQgaXMgdXNlZCB0byBsZXQgQW5ndWxhciBrbm93IHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIC8vIEFuZ3VsYXIgd2lsbCBydW4gYSBuZXcgY2hhbmdlIGRldGVjdGlvbiBlYWNoIHRpbWUgdGhlIGBpbnB1dGAgZXZlbnQgaGFzIGJlZW4gZGlzcGF0Y2hlZC5cbiAgICAvLyBJdCdzIG5lY2Vzc2FyeSB0aGF0IEFuZ3VsYXIgcmVjb2duaXplcyB0aGUgdmFsdWUgY2hhbmdlLCBiZWNhdXNlIHdoZW4gZmxvYXRpbmdMYWJlbFxuICAgIC8vIGlzIHNldCB0byBmYWxzZSBhbmQgQW5ndWxhciBmb3JtcyBhcmVuJ3QgdXNlZCwgdGhlIHBsYWNlaG9sZGVyIHdvbid0IHJlY29nbml6ZSB0aGVcbiAgICAvLyB2YWx1ZSBjaGFuZ2VzIGFuZCB3aWxsIG5vdCBkaXNhcHBlYXIuXG4gICAgLy8gTGlzdGVuaW5nIHRvIHRoZSBpbnB1dCBldmVudCB3b3VsZG4ndCBiZSBuZWNlc3Nhcnkgd2hlbiB0aGUgaW5wdXQgaXMgdXNpbmcgdGhlXG4gICAgLy8gRm9ybXNNb2R1bGUgb3IgUmVhY3RpdmVGb3Jtc01vZHVsZSwgYmVjYXVzZSBBbmd1bGFyIGZvcm1zIGFsc28gbGlzdGVucyB0byBpbnB1dCBldmVudHMuXG4gIH1cblxuICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlLiAqL1xuICBwcml2YXRlIF9kaXJ0eUNoZWNrUGxhY2Vob2xkZXIoKSB7XG4gICAgLy8gSWYgd2UncmUgaGlkaW5nIHRoZSBuYXRpdmUgcGxhY2Vob2xkZXIsIGl0IHNob3VsZCBhbHNvIGJlIGNsZWFyZWQgZnJvbSB0aGUgRE9NLCBvdGhlcndpc2VcbiAgICAvLyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgaXQgb3V0IHR3aWNlOiBvbmNlIGZyb20gdGhlIGxhYmVsIGFuZCBvbmNlIGZyb20gdGhlIGF0dHJpYnV0ZS5cbiAgICAvLyBUT0RPOiBjYW4gYmUgcmVtb3ZlZCBvbmNlIHdlIGdldCByaWQgb2YgdGhlIGBsZWdhY3lgIHN0eWxlIGZvciB0aGUgZm9ybSBmaWVsZCwgYmVjYXVzZSBpdCdzXG4gICAgLy8gdGhlIG9ubHkgb25lIHRoYXQgc3VwcG9ydHMgcHJvbW90aW5nIHRoZSBwbGFjZWhvbGRlciB0byBhIGxhYmVsLlxuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fZm9ybUZpZWxkPy5faGlkZUNvbnRyb2xQbGFjZWhvbGRlcj8uKCkgPyBudWxsIDogdGhpcy5wbGFjZWhvbGRlcjtcbiAgICBpZiAocGxhY2Vob2xkZXIgIT09IHRoaXMuX3ByZXZpb3VzUGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLl9wcmV2aW91c1BsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgICBwbGFjZWhvbGRlclxuICAgICAgICA/IGVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyKVxuICAgICAgICA6IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIHNvbWUgbWFudWFsIGRpcnR5IGNoZWNraW5nIG9uIHRoZSBuYXRpdmUgaW5wdXQgYHZhbHVlYCBwcm9wZXJ0eS4gKi9cbiAgcHJvdGVjdGVkIF9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAodGhpcy5fcHJldmlvdXNOYXRpdmVWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzTmF0aXZlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN1cHBvcnRlZCB0eXBlLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlVHlwZSgpIHtcbiAgICBpZiAoXG4gICAgICBNQVRfSU5QVVRfSU5WQUxJRF9UWVBFUy5pbmRleE9mKHRoaXMuX3R5cGUpID4gLTEgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJbnB1dFVuc3VwcG9ydGVkVHlwZUVycm9yKHRoaXMuX3R5cGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgaW5wdXQgdHlwZSBpcyBvbmUgb2YgdGhlIHR5cGVzIHRoYXQgYXJlIG5ldmVyIGVtcHR5LiAqL1xuICBwcm90ZWN0ZWQgX2lzTmV2ZXJFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV2ZXJFbXB0eUlucHV0VHlwZXMuaW5kZXhPZih0aGlzLl90eXBlKSA+IC0xO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBpbnZhbGlkIGJhc2VkIG9uIHRoZSBuYXRpdmUgdmFsaWRhdGlvbi4gKi9cbiAgcHJvdGVjdGVkIF9pc0JhZElucHV0KCkge1xuICAgIC8vIFRoZSBgdmFsaWRpdHlgIHByb3BlcnR5IHdvbid0IGJlIHByZXNlbnQgb24gcGxhdGZvcm0tc2VydmVyLlxuICAgIGxldCB2YWxpZGl0eSA9ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsaWRpdHk7XG4gICAgcmV0dXJuIHZhbGlkaXR5ICYmIHZhbGlkaXR5LmJhZElucHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5faXNOZXZlckVtcHR5KCkgJiZcbiAgICAgICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiZcbiAgICAgICF0aGlzLl9pc0JhZElucHV0KCkgJiZcbiAgICAgICF0aGlzLmF1dG9maWxsZWRcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2lzTmF0aXZlU2VsZWN0KSB7XG4gICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0aW9uIGA8c2VsZWN0PmAsIHRoZSBsYWJlbCBzaG91bGQgZmxvYXQgd2hlbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIGhhc1xuICAgICAgLy8gYSBub24tZW1wdHkgZGlzcGxheSB2YWx1ZS4gRm9yIGEgYDxzZWxlY3QgbXVsdGlwbGU+YCwgdGhlIGxhYmVsICphbHdheXMqIGZsb2F0cyB0byBhdm9pZFxuICAgICAgLy8gb3ZlcmxhcHBpbmcgdGhlIGxhYmVsIHdpdGggdGhlIG9wdGlvbnMuXG4gICAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgICAgY29uc3QgZmlyc3RPcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgdW5kZWZpbmVkID0gc2VsZWN0RWxlbWVudC5vcHRpb25zWzBdO1xuXG4gICAgICAvLyBPbiBtb3N0IGJyb3dzZXJzIHRoZSBgc2VsZWN0ZWRJbmRleGAgd2lsbCBhbHdheXMgYmUgMCwgaG93ZXZlciBvbiBJRSBhbmQgRWRnZSBpdCdsbCBiZVxuICAgICAgLy8gLTEgaWYgdGhlIGB2YWx1ZWAgaXMgc2V0IHRvIHNvbWV0aGluZywgdGhhdCBpc24ndCBpbiB0aGUgbGlzdCBvZiBvcHRpb25zLCBhdCBhIGxhdGVyIHBvaW50LlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5mb2N1c2VkIHx8XG4gICAgICAgIHNlbGVjdEVsZW1lbnQubXVsdGlwbGUgfHxcbiAgICAgICAgIXRoaXMuZW1wdHkgfHxcbiAgICAgICAgISEoc2VsZWN0RWxlbWVudC5zZWxlY3RlZEluZGV4ID4gLTEgJiYgZmlyc3RPcHRpb24gJiYgZmlyc3RPcHRpb24ubGFiZWwpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICBpZiAoaWRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGlkcy5qb2luKCcgJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAvLyBEbyBub3QgcmUtZm9jdXMgdGhlIGlucHV0IGVsZW1lbnQgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLiBPdGhlcndpc2UgaXQgY2FuIGhhcHBlblxuICAgIC8vIHRoYXQgc29tZW9uZSBjbGlja3Mgb24gYSB0aW1lIGlucHV0IGFuZCB0aGUgY3Vyc29yIHJlc2V0cyB0byB0aGUgXCJob3Vyc1wiIGZpZWxkIHdoaWxlIHRoZVxuICAgIC8vIFwibWludXRlc1wiIGZpZWxkIHdhcyBhY3R1YWxseSBjbGlja2VkLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEyODQ5XG4gICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIGEgbmF0aXZlIHNlbGVjdCB0aGF0IGlzIGRpc3BsYXllZCBpbmxpbmUuICovXG4gIF9pc0lubGluZVNlbGVjdCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgIHJldHVybiB0aGlzLl9pc05hdGl2ZVNlbGVjdCAmJiAoZWxlbWVudC5tdWx0aXBsZSB8fCBlbGVtZW50LnNpemUgPiAxKTtcbiAgfVxuXG4gIHByaXZhdGUgX2lPU0tleXVwTGlzdGVuZXIgPSAoZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgIC8vIE5vdGU6IFdlIHNwZWNpZmljYWxseSBjaGVjayBmb3IgMCwgcmF0aGVyIHRoYW4gYCFlbC5zZWxlY3Rpb25TdGFydGAsIGJlY2F1c2UgdGhlIHR3b1xuICAgIC8vIGluZGljYXRlIGRpZmZlcmVudCB0aGluZ3MuIElmIHRoZSB2YWx1ZSBpcyAwLCBpdCBtZWFucyB0aGF0IHRoZSBjYXJldCBpcyBhdCB0aGUgc3RhcnRcbiAgICAvLyBvZiB0aGUgaW5wdXQsIHdoZXJlYXMgYSB2YWx1ZSBvZiBgbnVsbGAgbWVhbnMgdGhhdCB0aGUgaW5wdXQgZG9lc24ndCBzdXBwb3J0XG4gICAgLy8gbWFuaXB1bGF0aW5nIHRoZSBzZWxlY3Rpb24gcmFuZ2UuIElucHV0cyB0aGF0IGRvbid0IHN1cHBvcnQgc2V0dGluZyB0aGUgc2VsZWN0aW9uIHJhbmdlXG4gICAgLy8gd2lsbCB0aHJvdyBhbiBlcnJvciBzbyB3ZSB3YW50IHRvIGF2b2lkIGNhbGxpbmcgYHNldFNlbGVjdGlvblJhbmdlYCBvbiB0aGVtLiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5wdXQuaHRtbCNkby1ub3QtYXBwbHlcbiAgICBpZiAoIWVsLnZhbHVlICYmIGVsLnNlbGVjdGlvblN0YXJ0ID09PSAwICYmIGVsLnNlbGVjdGlvbkVuZCA9PT0gMCkge1xuICAgICAgLy8gTm90ZTogSnVzdCBzZXR0aW5nIGAwLCAwYCBkb2Vzbid0IGZpeCB0aGUgaXNzdWUuIFNldHRpbmdcbiAgICAgIC8vIGAxLCAxYCBmaXhlcyBpdCBmb3IgdGhlIGZpcnN0IHRpbWUgdGhhdCB5b3UgdHlwZSB0ZXh0IGFuZFxuICAgICAgLy8gdGhlbiBob2xkIGRlbGV0ZS4gVG9nZ2xpbmcgdG8gYDEsIDFgIGFuZCB0aGVuIGJhY2sgdG9cbiAgICAgIC8vIGAwLCAwYCBzZWVtcyB0byBjb21wbGV0ZWx5IGZpeCBpdC5cbiAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKDEsIDEpO1xuICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgMCk7XG4gICAgfVxuICB9O1xufVxuIl19