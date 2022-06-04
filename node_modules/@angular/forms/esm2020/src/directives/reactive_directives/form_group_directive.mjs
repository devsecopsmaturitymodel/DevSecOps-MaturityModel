/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormGroup, isFormControl } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { missingFormException } from '../reactive_errors';
import { cleanUpControl, cleanUpFormContainer, cleanUpValidators, removeListItem, setUpControl, setUpFormContainer, setUpValidators, syncPendingControls } from '../shared';
import * as i0 from "@angular/core";
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * @usageNotes
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormGroupDirective extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        this.validators = validators;
        this.asyncValidators = asyncValidators;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * Callback that should be invoked when controls in FormGroup or FormArray collection change
         * (added or removed). This callback triggers corresponding DOM updates.
         */
        this._onCollectionChange = () => this._updateDomValue();
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new EventEmitter();
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
            this._oldForm = this.form;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpValidators(this.form, this);
            // Currently the `onCollectionChange` callback is rewritten each time the
            // `_registerOnCollectionChange` function is invoked. The implication is that cleanup should
            // happen *only* when the `onCollectionChange` callback was set by this directive instance.
            // Otherwise it might cause overriding a callback of some other directive instances. We should
            // consider updating this logic later to make it similar to how `onChange` callbacks are
            // handled, see https://github.com/angular/angular/issues/39732 for additional info.
            if (this.form._onCollectionChange === this._onCollectionChange) {
                this.form._registerOnCollectionChange(() => { });
            }
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        cleanUpControl(dir.control || null, dir, /* validateControlPresenceOnChange */ false);
        removeListItem(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const oldCtrl = dir.control;
            const newCtrl = this.form.get(dir.path);
            if (oldCtrl !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(oldCtrl || null, dir);
                // Check whether new control at the same location inside the corresponding `FormGroup` is an
                // instance of `FormControl` and perform control setup only if that's the case.
                // Note: we don't need to clear the list of directives (`this.directives`) here, it would be
                // taken care of in the `removeControl` method invoked when corresponding `formControlName`
                // directive instance is being removed (invoked from `FormControlName.ngOnDestroy`).
                if (isFormControl(newCtrl)) {
                    setUpControl(newCtrl, dir);
                    dir.control = newCtrl;
                }
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _setUpFormContainer(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        // NOTE: this operation looks unnecessary in case no new validators were added in
        // `setUpFormContainer` call. Consider updating this code to match the logic in
        // `_cleanUpFormContainer` function.
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    _cleanUpFormContainer(dir) {
        if (this.form) {
            const ctrl = this.form.get(dir.path);
            if (ctrl) {
                const isControlUpdated = cleanUpFormContainer(ctrl, dir);
                if (isControlUpdated) {
                    // Run validity check only in case a control was updated (i.e. view validators were
                    // removed) as removing view validators might cause validity to change.
                    ctrl.updateValueAndValidity({ emitEvent: false });
                }
            }
        }
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange);
        if (this._oldForm) {
            this._oldForm._registerOnCollectionChange(() => { });
        }
    }
    _updateValidators() {
        setUpValidators(this.form, this);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw missingFormException();
        }
    }
}
FormGroupDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: FormGroupDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
FormGroupDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: FormGroupDirective, selector: "[formGroup]", inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: FormGroupDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroup]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    exportAs: 'ngForm'
                }]
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
                }] }]; }, propDecorators: { form: [{
                type: Input,
                args: ['formGroup']
            }], ngSubmit: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUF3QixRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFOUksT0FBTyxFQUF5QixTQUFTLEVBQUUsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzdFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsY0FBYyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDOztBQU0xSyxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDbEQsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQU9ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFxQ3RELFlBQ3VELFVBQXFDLEVBQy9CLGVBQ2xCO1FBQ3pDLEtBQUssRUFBRSxDQUFDO1FBSDZDLGVBQVUsR0FBVixVQUFV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LElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ2pFLE1BQU0sb0JBQW9CLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7OzBIQWhUVSxrQkFBa0Isa0JBc0NHLGFBQWEseUNBQ2IsbUJBQW1COzhHQXZDeEMsa0JBQWtCLCtMQUpsQixDQUFDLHFCQUFxQixDQUFDO3NHQUl2QixrQkFBa0I7a0JBTjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNsQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQztvQkFDOUQsUUFBUSxFQUFFLFFBQVE7aUJBQ25COzswQkF1Q00sUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxhQUFhOzswQkFDeEMsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxtQkFBbUI7NENBVi9CLElBQUk7c0JBQXZCLEtBQUs7dUJBQUMsV0FBVztnQkFNUixRQUFRO3NCQUFqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBTZWxmLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIGlzRm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHttaXNzaW5nRm9ybUV4Y2VwdGlvbn0gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7Y2xlYW5VcENvbnRyb2wsIGNsZWFuVXBGb3JtQ29udGFpbmVyLCBjbGVhblVwVmFsaWRhdG9ycywgcmVtb3ZlTGlzdEl0ZW0sIHNldFVwQ29udHJvbCwgc2V0VXBGb3JtQ29udGFpbmVyLCBzZXRVcFZhbGlkYXRvcnMsIHN5bmNQZW5kaW5nQ29udHJvbHN9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbE5hbWV9IGZyb20gJy4vZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2Zvcm1fZ3JvdXBfbmFtZSc7XG5cbmV4cG9ydCBjb25zdCBmb3JtRGlyZWN0aXZlUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBCaW5kcyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuIEl0IHdpbGwgdGhlbiB1c2UgdGhpc1xuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gbWF0Y2ggYW55IGNoaWxkIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLFxuICogYW5kIGBGb3JtQXJyYXlgIGluc3RhbmNlcyB0byBjaGlsZCBgRm9ybUNvbnRyb2xOYW1lYCwgYEZvcm1Hcm91cE5hbWVgLFxuICogYW5kIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgYEFic3RyYWN0Q29udHJvbGBcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIFJlZ2lzdGVyIEZvcm0gR3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgYEZvcm1Hcm91cGAgd2l0aCBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUgY29udHJvbHMsXG4gKiBhbmQgbGlzdGVucyBmb3IgdGhlICpuZ1N1Ym1pdCogZXZlbnQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwRGlyZWN0aXZlIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byBhbiBvbGQgZm9ybSBncm91cCBpbnB1dCB2YWx1ZSwgd2hpY2ggaXMgbmVlZGVkIHRvIGNsZWFudXAgb2xkIGluc3RhbmNlIGluIGNhc2UgaXRcbiAgICogd2FzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKi9cbiAgcHJpdmF0ZSBfb2xkRm9ybTogRm9ybUdyb3VwfHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgaW52b2tlZCB3aGVuIGNvbnRyb2xzIGluIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgY29sbGVjdGlvbiBjaGFuZ2VcbiAgICogKGFkZGVkIG9yIHJlbW92ZWQpLiBUaGlzIGNhbGxiYWNrIHRyaWdnZXJzIGNvcnJlc3BvbmRpbmcgRE9NIHVwZGF0ZXMuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBsaXN0IG9mIGFkZGVkIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlc1xuICAgKi9cbiAgZGlyZWN0aXZlczogRm9ybUNvbnRyb2xOYW1lW10gPSBbXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoJ2Zvcm1Hcm91cCcpIGZvcm06IEZvcm1Hcm91cCA9IG51bGwhO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBuZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSBwcml2YXRlIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgcHJpdmF0ZSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgKEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4pW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0Zvcm1QcmVzZW50KCk7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKSkge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsaWRhdG9ycygpO1xuICAgICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKTtcbiAgICAgIHRoaXMuX29sZEZvcm0gPSB0aGlzLmZvcm07XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICBjbGVhblVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMpO1xuXG4gICAgICAvLyBDdXJyZW50bHkgdGhlIGBvbkNvbGxlY3Rpb25DaGFuZ2VgIGNhbGxiYWNrIGlzIHJld3JpdHRlbiBlYWNoIHRpbWUgdGhlXG4gICAgICAvLyBgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlYCBmdW5jdGlvbiBpcyBpbnZva2VkLiBUaGUgaW1wbGljYXRpb24gaXMgdGhhdCBjbGVhbnVwIHNob3VsZFxuICAgICAgLy8gaGFwcGVuICpvbmx5KiB3aGVuIHRoZSBgb25Db2xsZWN0aW9uQ2hhbmdlYCBjYWxsYmFjayB3YXMgc2V0IGJ5IHRoaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAgLy8gT3RoZXJ3aXNlIGl0IG1pZ2h0IGNhdXNlIG92ZXJyaWRpbmcgYSBjYWxsYmFjayBvZiBzb21lIG90aGVyIGRpcmVjdGl2ZSBpbnN0YW5jZXMuIFdlIHNob3VsZFxuICAgICAgLy8gY29uc2lkZXIgdXBkYXRpbmcgdGhpcyBsb2dpYyBsYXRlciB0byBtYWtlIGl0IHNpbWlsYXIgdG8gaG93IGBvbkNoYW5nZWAgY2FsbGJhY2tzIGFyZVxuICAgICAgLy8gaGFuZGxlZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM5NzMyIGZvciBhZGRpdGlvbmFsIGluZm8uXG4gICAgICBpZiAodGhpcy5mb3JtLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPT09IHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSkge1xuICAgICAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgdGhpcyBkaXJlY3RpdmUncyBpbnN0YW5jZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBmb3JtRGlyZWN0aXZlKCk6IEZvcm0ge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIHRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhpcyBncm91cC4gQmVjYXVzZSB0aGlzIGRpcmVjdGl2ZVxuICAgKiBhbHdheXMgbGl2ZXMgYXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZvcm0sIGl0IGFsd2F5cyBhbiBlbXB0eSBhcnJheS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAqIGFuZCB2YWxpZGl0eSwgYW5kIGFkZHMgdGhlIGluc3RhbmNlIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBDb250cm9sKGN0cmwsIGRpcik7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICByZXR1cm4gY3RybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgdGhlIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlc1xuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogdm9pZCB7XG4gICAgY2xlYW5VcENvbnRyb2woZGlyLmNvbnRyb2wgfHwgbnVsbCwgZGlyLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICByZW1vdmVMaXN0SXRlbSh0aGlzLmRpcmVjdGl2ZXMsIGRpcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX3NldFVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAqIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fY2xlYW5VcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUdyb3VwYCBmb3IgYSBwcm92aWRlZCBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgbmVjZXNzYXJ5IHNldHVwIHdoZW4gYSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIGFkZGVkIHRvIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX3NldFVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAqIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fY2xlYW5VcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUFycmF5YCBmb3IgYSBwcm92aWRlZCBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0Rm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIDxGb3JtQXJyYXk+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZGlyZWN0aXZlJ3MgY29udHJvbC5cbiAgICovXG4gIHVwZGF0ZU1vZGVsKGRpcjogRm9ybUNvbnRyb2xOYW1lLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgY3RybMKgID0gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIGN0cmwuc2V0VmFsdWUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgY2FsbGVkIHdpdGggdGhlIFwic3VibWl0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgKiBUcmlnZ2VycyB0aGUgYG5nU3VibWl0YCBlbWl0dGVyIHRvIGVtaXQgdGhlIFwic3VibWl0XCIgZXZlbnQgYXMgaXRzIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSAkZXZlbnQgVGhlIFwic3VibWl0XCIgZXZlbnQgb2JqZWN0XG4gICAqL1xuICBvblN1Ym1pdCgkZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgKHRoaXMgYXMge3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgc3luY1BlbmRpbmdDb250cm9scyh0aGlzLmZvcm0sIHRoaXMuZGlyZWN0aXZlcyk7XG4gICAgdGhpcy5uZ1N1Ym1pdC5lbWl0KCRldmVudCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwicmVzZXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqL1xuICBvblJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMucmVzZXRGb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc2V0cyB0aGUgZm9ybSB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCByZXNldHMgaXRzIHN1Ym1pdHRlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZm9ybS5cbiAgICovXG4gIHJlc2V0Rm9ybSh2YWx1ZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAodGhpcyBhcyB7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gZmFsc2U7XG4gIH1cblxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZURvbVZhbHVlKCkge1xuICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICBjb25zdCBvbGRDdHJsID0gZGlyLmNvbnRyb2w7XG4gICAgICBjb25zdCBuZXdDdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAob2xkQ3RybCAhPT0gbmV3Q3RybCkge1xuICAgICAgICAvLyBOb3RlOiB0aGUgdmFsdWUgb2YgdGhlIGBkaXIuY29udHJvbGAgbWF5IG5vdCBiZSBkZWZpbmVkLCBmb3IgZXhhbXBsZSB3aGVuIGl0J3MgYSBmaXJzdFxuICAgICAgICAvLyBgRm9ybUNvbnRyb2xgIHRoYXQgaXMgYWRkZWQgdG8gYSBgRm9ybUdyb3VwYCBpbnN0YW5jZSAodmlhIGBhZGRDb250cm9sYCBjYWxsKS5cbiAgICAgICAgY2xlYW5VcENvbnRyb2wob2xkQ3RybCB8fCBudWxsLCBkaXIpO1xuXG4gICAgICAgIC8vIENoZWNrIHdoZXRoZXIgbmV3IGNvbnRyb2wgYXQgdGhlIHNhbWUgbG9jYXRpb24gaW5zaWRlIHRoZSBjb3JyZXNwb25kaW5nIGBGb3JtR3JvdXBgIGlzIGFuXG4gICAgICAgIC8vIGluc3RhbmNlIG9mIGBGb3JtQ29udHJvbGAgYW5kIHBlcmZvcm0gY29udHJvbCBzZXR1cCBvbmx5IGlmIHRoYXQncyB0aGUgY2FzZS5cbiAgICAgICAgLy8gTm90ZTogd2UgZG9uJ3QgbmVlZCB0byBjbGVhciB0aGUgbGlzdCBvZiBkaXJlY3RpdmVzIChgdGhpcy5kaXJlY3RpdmVzYCkgaGVyZSwgaXQgd291bGQgYmVcbiAgICAgICAgLy8gdGFrZW4gY2FyZSBvZiBpbiB0aGUgYHJlbW92ZUNvbnRyb2xgIG1ldGhvZCBpbnZva2VkIHdoZW4gY29ycmVzcG9uZGluZyBgZm9ybUNvbnRyb2xOYW1lYFxuICAgICAgICAvLyBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgYmVpbmcgcmVtb3ZlZCAoaW52b2tlZCBmcm9tIGBGb3JtQ29udHJvbE5hbWUubmdPbkRlc3Ryb3lgKS5cbiAgICAgICAgaWYgKGlzRm9ybUNvbnRyb2wobmV3Q3RybCkpIHtcbiAgICAgICAgICBzZXRVcENvbnRyb2wobmV3Q3RybCwgZGlyKTtcbiAgICAgICAgICAoZGlyIGFzIHtjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPSBuZXdDdHJsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmZvcm0uX3VwZGF0ZVRyZWVWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBGb3JtQ29udGFpbmVyKGRpcjogRm9ybUFycmF5TmFtZXxGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgLy8gTk9URTogdGhpcyBvcGVyYXRpb24gbG9va3MgdW5uZWNlc3NhcnkgaW4gY2FzZSBubyBuZXcgdmFsaWRhdG9ycyB3ZXJlIGFkZGVkIGluXG4gICAgLy8gYHNldFVwRm9ybUNvbnRhaW5lcmAgY2FsbC4gQ29uc2lkZXIgdXBkYXRpbmcgdGhpcyBjb2RlIHRvIG1hdGNoIHRoZSBsb2dpYyBpblxuICAgIC8vIGBfY2xlYW5VcEZvcm1Db250YWluZXJgIGZ1bmN0aW9uLlxuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYW5VcEZvcm1Db250YWluZXIoZGlyOiBGb3JtQXJyYXlOYW1lfEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgIGlmIChjdHJsKSB7XG4gICAgICAgIGNvbnN0IGlzQ29udHJvbFVwZGF0ZWQgPSBjbGVhblVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgICAgICBpZiAoaXNDb250cm9sVXBkYXRlZCkge1xuICAgICAgICAgIC8vIFJ1biB2YWxpZGl0eSBjaGVjayBvbmx5IGluIGNhc2UgYSBjb250cm9sIHdhcyB1cGRhdGVkIChpLmUuIHZpZXcgdmFsaWRhdG9ycyB3ZXJlXG4gICAgICAgICAgLy8gcmVtb3ZlZCkgYXMgcmVtb3ZpbmcgdmlldyB2YWxpZGF0b3JzIG1pZ2h0IGNhdXNlIHZhbGlkaXR5IHRvIGNoYW5nZS5cbiAgICAgICAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKSB7XG4gICAgdGhpcy5mb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICAgIGlmICh0aGlzLl9vbGRGb3JtKSB7XG4gICAgICB0aGlzLl9vbGRGb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsaWRhdG9ycygpIHtcbiAgICBzZXRVcFZhbGlkYXRvcnModGhpcy5mb3JtLCB0aGlzKTtcbiAgICBpZiAodGhpcy5fb2xkRm9ybSkge1xuICAgICAgY2xlYW5VcFZhbGlkYXRvcnModGhpcy5fb2xkRm9ybSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tGb3JtUHJlc2VudCgpIHtcbiAgICBpZiAoIXRoaXMuZm9ybSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgbWlzc2luZ0Zvcm1FeGNlcHRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==