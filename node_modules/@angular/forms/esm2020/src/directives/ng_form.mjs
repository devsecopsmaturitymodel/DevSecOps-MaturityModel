/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Self } from '@angular/core';
import { FormGroup } from '../model';
import { composeAsyncValidators, composeValidators, NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { ControlContainer } from './control_container';
import { setUpControl, setUpFormContainer, syncPendingControls } from './shared';
import * as i0 from "@angular/core";
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgForm)
};
const resolvedPromise = (() => Promise.resolve(null))();
/**
 * @description
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You optionally export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * gives you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, use `NgModel` with a `name`
 * attribute. You may use `NgModelGroup` to create sub-groups within the form.
 *
 * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event emits the original form
 * submission event.
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * To import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
 *
 * @usageNotes
 *
 * ### Listening for form submission
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Setting the update options
 *
 * The following example shows you how to change the "updateOn" option from its default using
 * ngFormOptions.
 *
 * ```html
 * <form [ngFormOptions]="{updateOn: 'blur'}">
 *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
 * </form>
 * ```
 *
 * ### Native DOM validation UI
 *
 * In order to prevent the native DOM form validation UI from interfering with Angular's form
 * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
 * `FormModule` or `ReactiveFormModule` are imported into the application.
 * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
 * `ngNativeValidate` attribute to the `<form>` element:
 *
 * ```html
 * <form ngNativeValidate>
 *   ...
 * </form>
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
export class NgForm extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        /**
         * @description
         * Returns whether the form submission has been triggered.
         */
        this.submitted = false;
        this._directives = new Set();
        /**
         * @description
         * Event emitter for the "ngSubmit" event
         */
        this.ngSubmit = new EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /** @nodoc */
    ngAfterViewInit() {
        this._setUpdateStrategy();
    }
    /**
     * @description
     * The directive instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * The internal `FormGroup` instance.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Returns a map of the controls in this group.
     */
    get controls() {
        return this.form.controls;
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `NgModel` directive instance.
     */
    addControl(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            dir.control =
                container.registerControl(dir.name, dir.control);
            setUpControl(dir.control, dir);
            dir.control.updateValueAndValidity({ emitEvent: false });
            this._directives.add(dir);
        });
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `NgModel` directive.
     *
     * @param dir The `NgModel` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `NgModel` instance from the internal list of directives
     *
     * @param dir The `NgModel` directive instance.
     */
    removeControl(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
            this._directives.delete(dir);
        });
    }
    /**
     * @description
     * Adds a new `NgModelGroup` directive instance to the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    addFormGroup(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            const group = new FormGroup({});
            setUpFormContainer(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        });
    }
    /**
     * @description
     * Removes the `NgModelGroup` directive instance from the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    removeFormGroup(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
        });
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `NgControl` directive.
     *
     * @param dir The `NgControl` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        resolvedPromise.then(() => {
            const ctrl = this.form.get(dir.path);
            ctrl.setValue(value);
        });
    }
    /**
     * @description
     * Sets the value for this `FormGroup`.
     *
     * @param value The new value
     */
    setValue(value) {
        this.control.setValue(value);
    }
    /**
     * @description
     * Method called when the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this._directives);
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
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.form._updateOn = this.options.updateOn;
        }
    }
    _findContainer(path) {
        path.pop();
        return path.length ? this.form.get(path) : this.form;
    }
}
NgForm.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgForm, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgForm.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgForm, decorators: [{
            type: Directive,
            args: [{
                    selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    outputs: ['ngSubmit'],
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
                }] }]; }, propDecorators: { options: [{
                type: Input,
                args: ['ngFormOptions']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFaEgsT0FBTyxFQUErQixTQUFTLEVBQVksTUFBTSxVQUFVLENBQUM7QUFDNUUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU1RyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUtyRCxPQUFPLEVBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUcvRSxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ3RDLENBQUM7QUFFRixNQUFNLGVBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRXhEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErREc7QUFRSCxNQUFNLE9BQU8sTUFBTyxTQUFRLGdCQUFnQjtJQWlDMUMsWUFDK0MsVUFBcUMsRUFDL0IsZUFDVjtRQUN6QyxLQUFLLEVBQUUsQ0FBQztRQXBDVjs7O1dBR0c7UUFDYSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBRW5DLGdC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QixLQUFLO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgT3B0aW9uYWwsIFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgRm9ybUhvb2tzfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2NvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCBOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi9mb3JtX2ludGVyZmFjZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcbmltcG9ydCB7TmdNb2RlbH0gZnJvbSAnLi9uZ19tb2RlbCc7XG5pbXBvcnQge05nTW9kZWxHcm91cH0gZnJvbSAnLi9uZ19tb2RlbF9ncm91cCc7XG5pbXBvcnQge3NldFVwQ29udHJvbCwgc2V0VXBGb3JtQ29udGFpbmVyLCBzeW5jUGVuZGluZ0NvbnRyb2xzfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nRm9ybSlcbn07XG5cbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9ICgoKSA9PiBQcm9taXNlLnJlc29sdmUobnVsbCkpKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgdG9wLWxldmVsIGBGb3JtR3JvdXBgIGluc3RhbmNlIGFuZCBiaW5kcyBpdCB0byBhIGZvcm1cbiAqIHRvIHRyYWNrIGFnZ3JlZ2F0ZSBmb3JtIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cy5cbiAqXG4gKiBBcyBzb29uIGFzIHlvdSBpbXBvcnQgdGhlIGBGb3Jtc01vZHVsZWAsIHRoaXMgZGlyZWN0aXZlIGJlY29tZXMgYWN0aXZlIGJ5IGRlZmF1bHQgb25cbiAqIGFsbCBgPGZvcm0+YCB0YWdzLiAgWW91IGRvbid0IG5lZWQgdG8gYWRkIGEgc3BlY2lhbCBzZWxlY3Rvci5cbiAqXG4gKiBZb3Ugb3B0aW9uYWxseSBleHBvcnQgdGhlIGRpcmVjdGl2ZSBpbnRvIGEgbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nRm9ybWAgYXMgdGhlIGtleVxuICogKGV4OiBgI215Rm9ybT1cIm5nRm9ybVwiYCkuIFRoaXMgaXMgb3B0aW9uYWwsIGJ1dCB1c2VmdWwuICBNYW55IHByb3BlcnRpZXMgZnJvbSB0aGUgdW5kZXJseWluZ1xuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgYXJlIGR1cGxpY2F0ZWQgb24gdGhlIGRpcmVjdGl2ZSBpdHNlbGYsIHNvIGEgcmVmZXJlbmNlIHRvIGl0XG4gKiBnaXZlcyB5b3UgYWNjZXNzIHRvIHRoZSBhZ2dyZWdhdGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXR1cyBvZiB0aGUgZm9ybSwgYXMgd2VsbCBhc1xuICogdXNlciBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGxpa2UgYGRpcnR5YCBhbmQgYHRvdWNoZWRgLlxuICpcbiAqIFRvIHJlZ2lzdGVyIGNoaWxkIGNvbnRyb2xzIHdpdGggdGhlIGZvcm0sIHVzZSBgTmdNb2RlbGAgd2l0aCBhIGBuYW1lYFxuICogYXR0cmlidXRlLiBZb3UgbWF5IHVzZSBgTmdNb2RlbEdyb3VwYCB0byBjcmVhdGUgc3ViLWdyb3VwcyB3aXRoaW4gdGhlIGZvcm0uXG4gKlxuICogSWYgbmVjZXNzYXJ5LCBsaXN0ZW4gdG8gdGhlIGRpcmVjdGl2ZSdzIGBuZ1N1Ym1pdGAgZXZlbnQgdG8gYmUgbm90aWZpZWQgd2hlbiB0aGUgdXNlciBoYXNcbiAqIHRyaWdnZXJlZCBhIGZvcm0gc3VibWlzc2lvbi4gVGhlIGBuZ1N1Ym1pdGAgZXZlbnQgZW1pdHMgdGhlIG9yaWdpbmFsIGZvcm1cbiAqIHN1Ym1pc3Npb24gZXZlbnQuXG4gKlxuICogSW4gdGVtcGxhdGUgZHJpdmVuIGZvcm1zLCBhbGwgYDxmb3JtPmAgdGFncyBhcmUgYXV0b21hdGljYWxseSB0YWdnZWQgYXMgYE5nRm9ybWAuXG4gKiBUbyBpbXBvcnQgdGhlIGBGb3Jtc01vZHVsZWAgYnV0IHNraXAgaXRzIHVzYWdlIGluIHNvbWUgZm9ybXMsXG4gKiBmb3IgZXhhbXBsZSwgdG8gdXNlIG5hdGl2ZSBIVE1MNSB2YWxpZGF0aW9uLCBhZGQgdGhlIGBuZ05vRm9ybWAgYW5kIHRoZSBgPGZvcm0+YFxuICogdGFncyB3b24ndCBjcmVhdGUgYW4gYE5nRm9ybWAgZGlyZWN0aXZlLiBJbiByZWFjdGl2ZSBmb3JtcywgdXNpbmcgYG5nTm9Gb3JtYCBpc1xuICogdW5uZWNlc3NhcnkgYmVjYXVzZSB0aGUgYDxmb3JtPmAgdGFncyBhcmUgaW5lcnQuIEluIHRoYXQgY2FzZSwgeW91IHdvdWxkXG4gKiByZWZyYWluIGZyb20gdXNpbmcgdGhlIGBmb3JtR3JvdXBgIGRpcmVjdGl2ZS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBMaXN0ZW5pbmcgZm9yIGZvcm0gc3VibWlzc2lvblxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gY2FwdHVyZSB0aGUgZm9ybSB2YWx1ZXMgZnJvbSB0aGUgXCJuZ1N1Ym1pdFwiIGV2ZW50LlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtL3NpbXBsZV9mb3JtX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBTZXR0aW5nIHRoZSB1cGRhdGUgb3B0aW9uc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIGNoYW5nZSB0aGUgXCJ1cGRhdGVPblwiIG9wdGlvbiBmcm9tIGl0cyBkZWZhdWx0IHVzaW5nXG4gKiBuZ0Zvcm1PcHRpb25zLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIFtuZ0Zvcm1PcHRpb25zXT1cInt1cGRhdGVPbjogJ2JsdXInfVwiPlxuICogICAgPGlucHV0IG5hbWU9XCJvbmVcIiBuZ01vZGVsPiAgPCEtLSB0aGlzIG5nTW9kZWwgd2lsbCB1cGRhdGUgb24gYmx1ciAtLT5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqICMjIyBOYXRpdmUgRE9NIHZhbGlkYXRpb24gVUlcbiAqXG4gKiBJbiBvcmRlciB0byBwcmV2ZW50IHRoZSBuYXRpdmUgRE9NIGZvcm0gdmFsaWRhdGlvbiBVSSBmcm9tIGludGVyZmVyaW5nIHdpdGggQW5ndWxhcidzIGZvcm1cbiAqIHZhbGlkYXRpb24sIEFuZ3VsYXIgYXV0b21hdGljYWxseSBhZGRzIHRoZSBgbm92YWxpZGF0ZWAgYXR0cmlidXRlIG9uIGFueSBgPGZvcm0+YCB3aGVuZXZlclxuICogYEZvcm1Nb2R1bGVgIG9yIGBSZWFjdGl2ZUZvcm1Nb2R1bGVgIGFyZSBpbXBvcnRlZCBpbnRvIHRoZSBhcHBsaWNhdGlvbi5cbiAqIElmIHlvdSB3YW50IHRvIGV4cGxpY2l0bHkgZW5hYmxlIG5hdGl2ZSBET00gdmFsaWRhdGlvbiBVSSB3aXRoIEFuZ3VsYXIgZm9ybXMsIHlvdSBjYW4gYWRkIHRoZVxuICogYG5nTmF0aXZlVmFsaWRhdGVgIGF0dHJpYnV0ZSB0byB0aGUgYDxmb3JtPmAgZWxlbWVudDpcbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybSBuZ05hdGl2ZVZhbGlkYXRlPlxuICogICAuLi5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW2Zvcm1Hcm91cF0pLG5nLWZvcm0sW25nRm9ybV0nLFxuICBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXJdLFxuICBob3N0OiB7JyhzdWJtaXQpJzogJ29uU3VibWl0KCRldmVudCknLCAnKHJlc2V0KSc6ICdvblJlc2V0KCknfSxcbiAgb3V0cHV0czogWyduZ1N1Ym1pdCddLFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgTmdGb3JtIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sIEFmdGVyVmlld0luaXQge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgd2hldGhlciB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9kaXJlY3RpdmVzID0gbmV3IFNldDxOZ01vZGVsPigpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtR3JvdXBgIGluc3RhbmNlIGNyZWF0ZWQgZm9yIHRoaXMgZm9ybS5cbiAgICovXG4gIGZvcm06IEZvcm1Hcm91cDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEV2ZW50IGVtaXR0ZXIgZm9yIHRoZSBcIm5nU3VibWl0XCIgZXZlbnRcbiAgICovXG4gIG5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIG9wdGlvbnMgZm9yIHRoZSBgTmdGb3JtYCBpbnN0YW5jZS5cbiAgICpcbiAgICogKip1cGRhdGVPbioqOiBTZXRzIHRoZSBkZWZhdWx0IGB1cGRhdGVPbmAgdmFsdWUgZm9yIGFsbCBjaGlsZCBgTmdNb2RlbHNgIGJlbG93IGl0XG4gICAqIHVubGVzcyBleHBsaWNpdGx5IHNldCBieSBhIGNoaWxkIGBOZ01vZGVsYCB1c2luZyBgbmdNb2RlbE9wdGlvbnNgKS4gRGVmYXVsdHMgdG8gJ2NoYW5nZScuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYC5cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ25nRm9ybU9wdGlvbnMnKSBvcHRpb25zIToge3VwZGF0ZU9uPzogRm9ybUhvb2tzfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5mb3JtID1cbiAgICAgICAgbmV3IEZvcm1Hcm91cCh7fSwgY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9ycyksIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBpbnRlcm5hbCBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhpcyBncm91cC4gQmVjYXVzZSB0aGlzIGRpcmVjdGl2ZVxuICAgKiBhbHdheXMgbGl2ZXMgYXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZvcm0sIGl0IGlzIGFsd2F5cyBhbiBlbXB0eSBhcnJheS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYSBtYXAgb2YgdGhlIGNvbnRyb2xzIGluIHRoaXMgZ3JvdXAuXG4gICAqL1xuICBnZXQgY29udHJvbHMoKToge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIHJldHVybiB0aGlzLmZvcm0uY29udHJvbHM7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAqIGFuZCB2YWxpZGl0eSwgYW5kIGFkZHMgdGhlIGluc3RhbmNlIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRDb250cm9sKGRpcjogTmdNb2RlbCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgKGRpciBhcyB7Y29udHJvbDogRm9ybUNvbnRyb2x9KS5jb250cm9sID1cbiAgICAgICAgICA8Rm9ybUNvbnRyb2w+Y29udGFpbmVyLnJlZ2lzdGVyQ29udHJvbChkaXIubmFtZSwgZGlyLmNvbnRyb2wpO1xuICAgICAgc2V0VXBDb250cm9sKGRpci5jb250cm9sLCBkaXIpO1xuICAgICAgZGlyLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgICAgdGhpcy5fZGlyZWN0aXZlcy5hZGQoZGlyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBOZ01vZGVsYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogTmdNb2RlbCk6IEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmVzIHRoZSBgTmdNb2RlbGAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVDb250cm9sKGRpcjogTmdNb2RlbCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ29udHJvbChkaXIubmFtZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9kaXJlY3RpdmVzLmRlbGV0ZShkaXIpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGRzIGEgbmV3IGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZSB0byB0aGUgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUdyb3VwKGRpcjogTmdNb2RlbEdyb3VwKTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICBjb25zdCBncm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICAgICAgc2V0VXBGb3JtQ29udGFpbmVyKGdyb3VwLCBkaXIpO1xuICAgICAgY29udGFpbmVyLnJlZ2lzdGVyQ29udHJvbChkaXIubmFtZSwgZ3JvdXApO1xuICAgICAgZ3JvdXAudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmVzIHRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UgZnJvbSB0aGUgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgcmVtb3ZlRm9ybUdyb3VwKGRpcjogTmdNb2RlbEdyb3VwKTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDb250cm9sKGRpci5uYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUdyb3VwYCBmb3IgYSBwcm92aWRlZCBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0Rm9ybUdyb3VwKGRpcjogTmdNb2RlbEdyb3VwKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgTmdDb250cm9sYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ0NvbnRyb2xgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBOZ0NvbnRyb2wsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjdHJsID0gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGghKTtcbiAgICAgIGN0cmwuc2V0VmFsdWUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhpcyBgRm9ybUdyb3VwYC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWVcbiAgICovXG4gIHNldFZhbHVlKHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgXCJzdWJtaXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqIFRyaWdnZXJzIHRoZSBgbmdTdWJtaXRgIGVtaXR0ZXIgdG8gZW1pdCB0aGUgXCJzdWJtaXRcIiBldmVudCBhcyBpdHMgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtICRldmVudCBUaGUgXCJzdWJtaXRcIiBldmVudCBvYmplY3RcbiAgICovXG4gIG9uU3VibWl0KCRldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICAodGhpcyBhcyB7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5fZGlyZWN0aXZlcyk7XG4gICAgdGhpcy5uZ1N1Ym1pdC5lbWl0KCRldmVudCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwicmVzZXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqL1xuICBvblJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMucmVzZXRGb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc2V0cyB0aGUgZm9ybSB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCByZXNldHMgaXRzIHN1Ym1pdHRlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZm9ybS5cbiAgICovXG4gIHJlc2V0Rm9ybSh2YWx1ZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAodGhpcyBhcyB7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9zZXRVcGRhdGVTdHJhdGVneSgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZvcm0uX3VwZGF0ZU9uID0gdGhpcy5vcHRpb25zLnVwZGF0ZU9uO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZpbmRDb250YWluZXIocGF0aDogc3RyaW5nW10pOiBGb3JtR3JvdXAge1xuICAgIHBhdGgucG9wKCk7XG4gICAgcmV0dXJuIHBhdGgubGVuZ3RoID8gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KHBhdGgpIDogdGhpcy5mb3JtO1xuICB9XG59XG4iXX0=