/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, InjectionToken, Input, Optional, Output, Self } from '@angular/core';
import { FormControl } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { NG_VALUE_ACCESSOR } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { disabledAttrWarning } from '../reactive_errors';
import { _ngModelWarning, cleanUpControl, isPropertyUpdated, selectValueAccessor, setUpControl } from '../shared';
import * as i0 from "@angular/core";
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
export const NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken('NgModelWithFormControlWarning');
export const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlDirective)
};
/**
 * @description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormControlDirective extends NgControl {
    constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        /** @deprecated as of v6 */
        this.update = new EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular `FormControlDirective` instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            console.warn(disabledAttrWarning);
        }
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            const previousForm = changes['form'].previousValue;
            if (previousForm) {
                cleanUpControl(previousForm, this, /* validateControlPresenceOnChange */ false);
            }
            setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
            }
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpControl(this.form, this, /* validateControlPresenceOnChange */ false);
        }
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _isControlChanged(changes) {
        return changes.hasOwnProperty('form');
    }
}
/**
 * @description
 * Static property used to track whether any ngModel warnings have been sent across
 * all instances of FormControlDirective. Used to support warning config of "once".
 *
 * @internal
 */
FormControlDirective._ngModelWarningSentOnce = false;
FormControlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: FormControlDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
FormControlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: FormControlDirective, selector: "[formControl]", inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: FormControlDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALUE_ACCESSOR]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                }] }]; }, propDecorators: { form: [{
                type: Input,
                args: ['formControl']
            }], isDisabled: [{
                type: Input,
                args: ['disabled']
            }], model: [{
                type: Input,
                args: ['ngModel']
            }], update: [{
                type: Output,
                args: ['ngModelChange']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQXdCLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUU5SixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUM7O0FBSWhIOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sa0NBQWtDLEdBQzNDLElBQUksY0FBYyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFeEQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQVE7SUFDckMsT0FBTyxFQUFFLFNBQVM7SUFDbEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztDQUNwRCxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUVILE1BQU0sT0FBTyxvQkFBcUIs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QUFDSSw0Q0FBdUIsR0FBRyxLQUFLLENBQUM7NEhBeEM1QixvQkFBb0Isa0JBb0RDLGFBQWEseUNBQ2IsbUJBQW1CLHlDQUVuQixpQkFBaUIseUNBQ3pCLGtDQUFrQztnSEF4RC9DLG9CQUFvQiw4TEFEaUIsQ0FBQyxrQkFBa0IsQ0FBQztzR0FDekQsb0JBQW9CO2tCQURoQyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7OzBCQXFEcEYsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxhQUFhOzswQkFDeEMsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxtQkFBbUI7OzBCQUU5QyxRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLGlCQUFpQjs7MEJBQzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsa0NBQWtDOzRDQTVDcEMsSUFBSTtzQkFBekIsS0FBSzt1QkFBQyxhQUFhO2dCQU9oQixVQUFVO3NCQURiLEtBQUs7dUJBQUMsVUFBVTtnQkFVQyxLQUFLO3NCQUF0QixLQUFLO3VCQUFDLFNBQVM7Z0JBR1MsTUFBTTtzQkFBOUIsTUFBTTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge2Rpc2FibGVkQXR0cldhcm5pbmd9IGZyb20gJy4uL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge19uZ01vZGVsV2FybmluZywgY2xlYW5VcENvbnRyb2wsIGlzUHJvcGVydHlVcGRhdGVkLCBzZWxlY3RWYWx1ZUFjY2Vzc29yLCBzZXRVcENvbnRyb2x9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuXG4vKipcbiAqIFRva2VuIHRvIHByb3ZpZGUgdG8gdHVybiBvZmYgdGhlIG5nTW9kZWwgd2FybmluZyBvbiBmb3JtQ29udHJvbCBhbmQgZm9ybUNvbnRyb2xOYW1lLlxuICovXG5leHBvcnQgY29uc3QgTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuKCdOZ01vZGVsV2l0aEZvcm1Db250cm9sV2FybmluZycpO1xuXG5leHBvcnQgY29uc3QgZm9ybUNvbnRyb2xCaW5kaW5nOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xEaXJlY3RpdmUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogU3luY2hyb25pemVzIGEgc3RhbmRhbG9uZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIHRvIGEgZm9ybSBjb250cm9sIGVsZW1lbnQuXG4gKlxuICogTm90ZSB0aGF0IHN1cHBvcnQgZm9yIHVzaW5nIHRoZSBgbmdNb2RlbGAgaW5wdXQgcHJvcGVydHkgYW5kIGBuZ01vZGVsQ2hhbmdlYCBldmVudCB3aXRoIHJlYWN0aXZlXG4gKiBmb3JtIGRpcmVjdGl2ZXMgd2FzIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgaXMgc2NoZWR1bGVkIGZvciByZW1vdmFsIGluXG4gKiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIEFuZ3VsYXIuXG4gKiBGb3IgZGV0YWlscywgc2VlIFtEZXByZWNhdGVkIGZlYXR1cmVzXShndWlkZS9kZXByZWNhdGlvbnMjbmdtb2RlbC13aXRoLXJlYWN0aXZlLWZvcm1zKS5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIGBGb3JtQ29udHJvbGBcbiAqIEBzZWUgYEFic3RyYWN0Q29udHJvbGBcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gcmVnaXN0ZXIgYSBzdGFuZGFsb25lIGNvbnRyb2wgYW5kIHNldCBpdHMgdmFsdWUuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Db250cm9sL3NpbXBsZV9mb3JtX2NvbnRyb2xfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xdJywgcHJvdmlkZXJzOiBbZm9ybUNvbnRyb2xCaW5kaW5nXSwgZXhwb3J0QXM6ICduZ0Zvcm0nfSlcbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbERpcmVjdGl2ZSBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgdmlldyBtb2RlbCB2YWx1ZS5cbiAgICogQG5vZG9jXG4gICAqL1xuICB2aWV3TW9kZWw6IGFueTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBib3VuZCB0byB0aGUgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnZm9ybUNvbnRyb2wnKSBmb3JtITogRm9ybUNvbnRyb2w7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmlnZ2VycyBhIHdhcm5pbmcgaW4gZGV2IG1vZGUgdGhhdCB0aGlzIGlucHV0IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm1zLlxuICAgKi9cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIHNldCBpc0Rpc2FibGVkKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBjb25zb2xlLndhcm4oZGlzYWJsZWRBdHRyV2FybmluZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyhrYXJhKTogcmVtb3ZlIG5leHQgNCBwcm9wZXJ0aWVzIG9uY2UgZGVwcmVjYXRpb24gcGVyaW9kIGlzIG92ZXJcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQElucHV0KCduZ01vZGVsJykgbW9kZWw6IGFueTtcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQE91dHB1dCgnbmdNb2RlbENoYW5nZScpIHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xEaXJlY3RpdmUuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEluc3RhbmNlIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbiBuZ01vZGVsIHdhcm5pbmcgaGFzIGJlZW4gc2VudCBvdXQgZm9yIHRoaXNcbiAgICogcGFydGljdWxhciBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbmdNb2RlbFdhcm5pbmdTZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogKFZhbGlkYXRvcnxWYWxpZGF0b3JGbilbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgKEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMVUVfQUNDRVNTT1IpIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HKSBwcml2YXRlIF9uZ01vZGVsV2FybmluZ0NvbmZpZzogc3RyaW5nfFxuICAgICAgbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xDaGFuZ2VkKGNoYW5nZXMpKSB7XG4gICAgICBjb25zdCBwcmV2aW91c0Zvcm0gPSBjaGFuZ2VzWydmb3JtJ10ucHJldmlvdXNWYWx1ZTtcbiAgICAgIGlmIChwcmV2aW91c0Zvcm0pIHtcbiAgICAgICAgY2xlYW5VcENvbnRyb2wocHJldmlvdXNGb3JtLCB0aGlzLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHNldFVwQ29udHJvbCh0aGlzLmZvcm0sIHRoaXMpO1xuICAgICAgaWYgKHRoaXMuY29udHJvbC5kaXNhYmxlZCAmJiB0aGlzLnZhbHVlQWNjZXNzb3IhLnNldERpc2FibGVkU3RhdGUpIHtcbiAgICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlISh0cnVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZm9ybS51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfVxuICAgIGlmIChpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzLCB0aGlzLnZpZXdNb2RlbCkpIHtcbiAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgX25nTW9kZWxXYXJuaW5nKCdmb3JtQ29udHJvbCcsIEZvcm1Db250cm9sRGlyZWN0aXZlLCB0aGlzLCB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvcm0uc2V0VmFsdWUodGhpcy5tb2RlbCk7XG4gICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICBjbGVhblVwQ29udHJvbCh0aGlzLmZvcm0sIHRoaXMsIC8qIHZhbGlkYXRlQ29udHJvbFByZXNlbmNlT25DaGFuZ2UgKi8gZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgY29udHJvbCgpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwuXG4gICAqL1xuICBvdmVycmlkZSB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzQ29udHJvbENoYW5nZWQoY2hhbmdlczoge1trZXk6IHN0cmluZ106IGFueX0pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpO1xuICB9XG59XG4iXX0=