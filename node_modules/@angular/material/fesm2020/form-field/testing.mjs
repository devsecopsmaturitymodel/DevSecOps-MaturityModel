export * from '@angular/material/form-field/testing/control';
import { ComponentHarness, parallel, HarnessPredicate } from '@angular/cdk/testing';
import { MatDatepickerInputHarness, MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _MatFormFieldHarnessBase extends ComponentHarness {
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
class MatFormFieldHarness extends _MatFormFieldHarnessBase {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatFormFieldHarness, _MatFormFieldHarnessBase };
//# sourceMappingURL=testing.mjs.map
