/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatDatepickerInputHarness, MatDateRangeInputHarness, } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
export class _MatFormFieldHarnessBase extends ComponentHarness {
    /** Gets the label of the form-field. */
    async getLabel() {
        const labelEl = await this._label();
        return labelEl ? labelEl.text() : null;
    }
    /** Whether the form-field has errors. */
    async hasErrors() {
        return (await this.getTextErrors()).length > 0;
    }
    /** Whether the form-field is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-form-field-disabled');
    }
    /** Whether the form-field is currently autofilled. */
    async isAutofilled() {
        return (await this.host()).hasClass('mat-form-field-autofilled');
    }
    // Implementation of the "getControl" method overload signatures.
    async getControl(type) {
        if (type) {
            return this.locatorForOptional(type)();
        }
        const [select, input, datepickerInput, dateRangeInput] = await parallel(() => [
            this._selectControl(),
            this._inputControl(),
            this._datepickerInputControl(),
            this._dateRangeInputControl(),
        ]);
        // Match the datepicker inputs first since they can also have a `MatInput`.
        return datepickerInput || dateRangeInput || select || input;
    }
    /** Gets the theme color of the form-field. */
    async getThemeColor() {
        const hostEl = await this.host();
        const [isAccent, isWarn] = await parallel(() => {
            return [hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')];
        });
        if (isAccent) {
            return 'accent';
        }
        else if (isWarn) {
            return 'warn';
        }
        return 'primary';
    }
    /** Gets error messages which are currently displayed in the form-field. */
    async getTextErrors() {
        const errors = await this._errors();
        return parallel(() => errors.map(e => e.text()));
    }
    /** Gets hint messages which are currently displayed in the form-field. */
    async getTextHints() {
        const hints = await this._hints();
        return parallel(() => hints.map(e => e.text()));
    }
    /** Gets the text inside the prefix element. */
    async getPrefixText() {
        const prefix = await this._prefixContainer();
        return prefix ? prefix.text() : '';
    }
    /** Gets the text inside the suffix element. */
    async getSuffixText() {
        const suffix = await this._suffixContainer();
        return suffix ? suffix.text() : '';
    }
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    async isControlTouched() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-touched');
    }
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    async isControlDirty() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-dirty');
    }
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    async isControlValid() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-valid');
    }
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    async isControlPending() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-pending');
    }
    /** Checks whether the form-field control has set up a form control. */
    async _hasFormControl() {
        const hostEl = await this.host();
        // If no form "NgControl" is bound to the form-field control, the form-field
        // is not able to forward any control status classes. Therefore if either the
        // "ng-touched" or "ng-untouched" class is set, we know that it has a form control
        const [isTouched, isUntouched] = await parallel(() => [
            hostEl.hasClass('ng-touched'),
            hostEl.hasClass('ng-untouched'),
        ]);
        return isTouched || isUntouched;
    }
}
/** Harness for interacting with a standard Material form-field's in tests. */
export class MatFormFieldHarness extends _MatFormFieldHarnessBase {
    constructor() {
        super(...arguments);
        this._prefixContainer = this.locatorForOptional('.mat-form-field-prefix');
        this._suffixContainer = this.locatorForOptional('.mat-form-field-suffix');
        this._label = this.locatorForOptional('.mat-form-field-label');
        this._errors = this.locatorForAll('.mat-error');
        this._hints = this.locatorForAll('mat-hint, .mat-hint');
        this._inputControl = this.locatorForOptional(MatInputHarness);
        this._selectControl = this.locatorForOptional(MatSelectHarness);
        this._datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
        this._dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text))
            .addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors);
    }
    /** Gets the appearance of the form-field. */
    async getAppearance() {
        const hostClasses = await (await this.host()).getAttribute('class');
        if (hostClasses !== null) {
            const appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
            if (appearanceMatch) {
                return appearanceMatch[1];
            }
        }
        throw Error('Could not determine appearance of form-field.');
    }
    /** Whether the form-field has a label. */
    async hasLabel() {
        return (await this.host()).hasClass('mat-form-field-has-label');
    }
    /** Whether the label is currently floating. */
    async isLabelFloating() {
        const host = await this.host();
        const [hasLabel, shouldFloat] = await parallel(() => [
            this.hasLabel(),
            host.hasClass('mat-form-field-should-float'),
        ]);
        // If there is no label, the label conceptually can never float. The `should-float` class
        // is just always set regardless of whether the label is displayed or not.
        return hasLabel && shouldFloat;
    }
}
MatFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixnQkFBZ0IsRUFFaEIsUUFBUSxHQUVULE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUNMLHlCQUF5QixFQUN6Qix3QkFBd0IsR0FDekIsTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDaEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFXbEUsTUFBTSxPQUFnQix3QkFFcEIsU0FBUSxnQkFBZ0I7SUFvQnhCLHdDQUF3QztJQUN4QyxLQUFLLENBQUMsUUFBUTtRQUNaLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxLQUFLLENBQUMsWUFBWTtRQUNoQixPQUFPLENBQUMsTUFBTSxJ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RyxpQkFBaUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBIYXJuZXNzUXVlcnksXG4gIHBhcmFsbGVsLFxuICBUZXN0RWxlbWVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzcyxcbiAgTWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sSGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nL2NvbnRyb2wnO1xuaW1wb3J0IHtNYXRJbnB1dEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0L3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRTZWxlY3RIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QvdGVzdGluZyc7XG5pbXBvcnQge0Zvcm1GaWVsZEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2Zvcm0tZmllbGQtaGFybmVzcy1maWx0ZXJzJztcblxuLy8gVE9ETyhkZXZ2ZXJzaW9uKTogc3VwcG9ydCBzdXBwb3J0IGNoaXAgbGlzdCBoYXJuZXNzXG4vKiogUG9zc2libGUgaGFybmVzc2VzIG9mIGNvbnRyb2xzIHdoaWNoIGNhbiBiZSBib3VuZCB0byBhIGZvcm0tZmllbGQuICovXG5leHBvcnQgdHlwZSBGb3JtRmllbGRDb250cm9sSGFybmVzcyA9XG4gIHwgTWF0SW5wdXRIYXJuZXNzXG4gIHwgTWF0U2VsZWN0SGFybmVzc1xuICB8IE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NcbiAgfCBNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3M7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0Rm9ybUZpZWxkSGFybmVzc0Jhc2U8XG4gIENvbnRyb2xIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3MsXG4+IGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcHJlZml4Q29udGFpbmVyOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudCB8IG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3N1ZmZpeENvbnRhaW5lcjogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQgfCBudWxsPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9sYWJlbDogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQgfCBudWxsPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9lcnJvcnM6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50W10+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2hpbnRzOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudFtdPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9pbnB1dENvbnRyb2w6IEFzeW5jRmFjdG9yeUZuPENvbnRyb2xIYXJuZXNzIHwgbnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2VsZWN0Q29udHJvbDogQXN5bmNGYWN0b3J5Rm48Q29udHJvbEhhcm5lc3MgfCBudWxsPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9kYXRlcGlja2VySW5wdXRDb250cm9sOiBBc3luY0ZhY3RvcnlGbjxDb250cm9sSGFybmVzcyB8IG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2RhdGVSYW5nZUlucHV0Q29udHJvbDogQXN5bmNGYWN0b3J5Rm48Q29udHJvbEhhcm5lc3MgfCBudWxsPjtcblxuICAvKiogR2V0cyB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYWJzdHJhY3QgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPHN0cmluZz47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYWJzdHJhY3QgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaGFzIGEgbGFiZWwuICovXG4gIGFic3RyYWN0IGhhc0xhYmVsKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRMYWJlbCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBsYWJlbEVsID0gYXdhaXQgdGhpcy5fbGFiZWwoKTtcbiAgICByZXR1cm4gbGFiZWxFbCA/IGxhYmVsRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGhhcyBlcnJvcnMuICovXG4gIGFzeW5jIGhhc0Vycm9ycygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0VGV4dEVycm9ycygpKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWRpc2FibGVkJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBpcyBjdXJyZW50bHkgYXV0b2ZpbGxlZC4gKi9cbiAgYXN5bmMgaXNBdXRvZmlsbGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBPbmx5XG4gICAqIGRlZmF1bHQgY29udHJvbHMgc3VjaCBhcyBcIk1hdElucHV0SGFybmVzc1wiIGFuZCBcIk1hdFNlbGVjdEhhcm5lc3NcIiBhcmVcbiAgICogc3VwcG9ydGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbCgpOiBQcm9taXNlPENvbnRyb2xIYXJuZXNzIHwgbnVsbD47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gU2VhcmNoZXNcbiAgICogZm9yIGEgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBoYXJuZXNzIHR5cGUuXG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4oXG4gICAgdHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFg+LFxuICApOiBQcm9taXNlPFggfCBudWxsPjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBTZWFyY2hlc1xuICAgKiBmb3IgYSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGhhcm5lc3MgcHJlZGljYXRlLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KFxuICAgIHR5cGU6IEhhcm5lc3NQcmVkaWNhdGU8WD4sXG4gICk6IFByb21pc2U8WCB8IG51bGw+O1xuXG4gIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBcImdldENvbnRyb2xcIiBtZXRob2Qgb3ZlcmxvYWQgc2lnbmF0dXJlcy5cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KHR5cGU/OiBIYXJuZXNzUXVlcnk8WD4pIHtcbiAgICBpZiAodHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKHR5cGUpKCk7XG4gICAgfVxuICAgIGNvbnN0IFtzZWxlY3QsIGlucHV0LCBkYXRlcGlja2VySW5wdXQsIGRhdGVSYW5nZUlucHV0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuX3NlbGVjdENvbnRyb2woKSxcbiAgICAgIHRoaXMuX2lucHV0Q29udHJvbCgpLFxuICAgICAgdGhpcy5fZGF0ZXBpY2tlcklucHV0Q29udHJvbCgpLFxuICAgICAgdGhpcy5fZGF0ZVJhbmdlSW5wdXRDb250cm9sKCksXG4gICAgXSk7XG5cbiAgICAvLyBNYXRjaCB0aGUgZGF0ZXBpY2tlciBpbnB1dHMgZmlyc3Qgc2luY2UgdGhleSBjYW4gYWxzbyBoYXZlIGEgYE1hdElucHV0YC5cbiAgICByZXR1cm4gZGF0ZXBpY2tlcklucHV0IHx8IGRhdGVSYW5nZUlucHV0IHx8IHNlbGVjdCB8fCBpbnB1dDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0aGVtZSBjb2xvciBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0VGhlbWVDb2xvcigpOiBQcm9taXNlPCdwcmltYXJ5JyB8ICdhY2NlbnQnIHwgJ3dhcm4nPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzQWNjZW50LCBpc1dhcm5dID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIFtob3N0RWwuaGFzQ2xhc3MoJ21hdC1hY2NlbnQnKSwgaG9zdEVsLmhhc0NsYXNzKCdtYXQtd2FybicpXTtcbiAgICB9KTtcbiAgICBpZiAoaXNBY2NlbnQpIHtcbiAgICAgIHJldHVybiAnYWNjZW50JztcbiAgICB9IGVsc2UgaWYgKGlzV2Fybikge1xuICAgICAgcmV0dXJuICd3YXJuJztcbiAgICB9XG4gICAgcmV0dXJuICdwcmltYXJ5JztcbiAgfVxuXG4gIC8qKiBHZXRzIGVycm9yIG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0RXJyb3JzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBlcnJvcnMgPSBhd2FpdCB0aGlzLl9lcnJvcnMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gZXJyb3JzLm1hcChlID0+IGUudGV4dCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBoaW50IG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0SGludHMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGhpbnRzID0gYXdhaXQgdGhpcy5faGludHMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gaGludHMubWFwKGUgPT4gZS50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgcHJlZml4IGVsZW1lbnQuICovXG4gIGFzeW5jIGdldFByZWZpeFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcmVmaXggPSBhd2FpdCB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4LnRleHQoKSA6ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBzdWZmaXggZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0U3VmZml4VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHN1ZmZpeCA9IGF3YWl0IHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICAgIHJldHVybiBzdWZmaXggPyBzdWZmaXgudGV4dCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGhhcyBiZWVuIHRvdWNoZWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFRvdWNoZWQoKTogUHJvbWlzZTxib29sZWFuIHwgbnVsbD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXRvdWNoZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgZGlydHkuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbERpcnR5KCk6IFByb21pc2U8Ym9vbGVhbiB8IG51bGw+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1kaXJ0eScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyB2YWxpZC4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sVmFsaWQoKTogUHJvbWlzZTxib29sZWFuIHwgbnVsbD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXZhbGlkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIHBlbmRpbmcgdmFsaWRhdGlvbi4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sUGVuZGluZygpOiBQcm9taXNlPGJvb2xlYW4gfCBudWxsPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctcGVuZGluZycpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBmb3JtLWZpZWxkIGNvbnRyb2wgaGFzIHNldCB1cCBhIGZvcm0gY29udHJvbC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaGFzRm9ybUNvbnRyb2woKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgLy8gSWYgbm8gZm9ybSBcIk5nQ29udHJvbFwiIGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkIGNvbnRyb2wsIHRoZSBmb3JtLWZpZWxkXG4gICAgLy8gaXMgbm90IGFibGUgdG8gZm9yd2FyZCBhbnkgY29udHJvbCBzdGF0dXMgY2xhc3Nlcy4gVGhlcmVmb3JlIGlmIGVpdGhlciB0aGVcbiAgICAvLyBcIm5nLXRvdWNoZWRcIiBvciBcIm5nLXVudG91Y2hlZFwiIGNsYXNzIGlzIHNldCwgd2Uga25vdyB0aGF0IGl0IGhhcyBhIGZvcm0gY29udHJvbFxuICAgIGNvbnN0IFtpc1RvdWNoZWQsIGlzVW50b3VjaGVkXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIGhvc3RFbC5oYXNDbGFzcygnbmctdG91Y2hlZCcpLFxuICAgICAgaG9zdEVsLmhhc0NsYXNzKCduZy11bnRvdWNoZWQnKSxcbiAgICBdKTtcbiAgICByZXR1cm4gaXNUb3VjaGVkIHx8IGlzVW50b3VjaGVkO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZm9ybS1maWVsZCdzIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZEhhcm5lc3MgZXh0ZW5kcyBfTWF0Rm9ybUZpZWxkSGFybmVzc0Jhc2U8Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+IHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWZvcm0tZmllbGQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRGb3JtRmllbGRIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBmb3JtIGZpZWxkIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEZvcm1GaWVsZEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEZvcm1GaWVsZEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Rm9ybUZpZWxkSGFybmVzcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ2Zsb2F0aW5nTGFiZWxUZXh0Jywgb3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCwgYXN5bmMgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldExhYmVsKCksIHRleHQpLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2hhc0Vycm9ycycsXG4gICAgICAgIG9wdGlvbnMuaGFzRXJyb3JzLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgaGFzRXJyb3JzKSA9PiAoYXdhaXQgaGFybmVzcy5oYXNFcnJvcnMoKSkgPT09IGhhc0Vycm9ycyxcbiAgICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ByZWZpeENvbnRhaW5lciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtcHJlZml4Jyk7XG4gIHByb3RlY3RlZCBfc3VmZml4Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1zdWZmaXgnKTtcbiAgcHJvdGVjdGVkIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtbGFiZWwnKTtcbiAgcHJvdGVjdGVkIF9lcnJvcnMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJy5tYXQtZXJyb3InKTtcbiAgcHJvdGVjdGVkIF9oaW50cyA9IHRoaXMubG9jYXRvckZvckFsbCgnbWF0LWhpbnQsIC5tYXQtaGludCcpO1xuICBwcm90ZWN0ZWQgX2lucHV0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdElucHV0SGFybmVzcyk7XG4gIHByb3RlY3RlZCBfc2VsZWN0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdFNlbGVjdEhhcm5lc3MpO1xuICBwcm90ZWN0ZWQgX2RhdGVwaWNrZXJJbnB1dENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzKTtcbiAgcHJvdGVjdGVkIF9kYXRlUmFuZ2VJbnB1dENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3MpO1xuXG4gIC8qKiBHZXRzIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRBcHBlYXJhbmNlKCk6IFByb21pc2U8J2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnPiB7XG4gICAgY29uc3QgaG9zdENsYXNzZXMgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICBpZiAoaG9zdENsYXNzZXMgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGFwcGVhcmFuY2VNYXRjaCA9IGhvc3RDbGFzc2VzLm1hdGNoKFxuICAgICAgICAvbWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS0obGVnYWN5fHN0YW5kYXJkfGZpbGx8b3V0bGluZSkoPzokfCApLyxcbiAgICAgICk7XG4gICAgICBpZiAoYXBwZWFyYW5jZU1hdGNoKSB7XG4gICAgICAgIHJldHVybiBhcHBlYXJhbmNlTWF0Y2hbMV0gYXMgJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGRldGVybWluZSBhcHBlYXJhbmNlIG9mIGZvcm0tZmllbGQuJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgYSBsYWJlbC4gKi9cbiAgYXN5bmMgaGFzTGFiZWwoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYXN5bmMgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaGFzTGFiZWwsIHNob3VsZEZsb2F0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuaGFzTGFiZWwoKSxcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdCcpLFxuICAgIF0pO1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGxhYmVsLCB0aGUgbGFiZWwgY29uY2VwdHVhbGx5IGNhbiBuZXZlciBmbG9hdC4gVGhlIGBzaG91bGQtZmxvYXRgIGNsYXNzXG4gICAgLy8gaXMganVzdCBhbHdheXMgc2V0IHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgbGFiZWwgaXMgZGlzcGxheWVkIG9yIG5vdC5cbiAgICByZXR1cm4gaGFzTGFiZWwgJiYgc2hvdWxkRmxvYXQ7XG4gIH1cbn1cbiJdfQ==