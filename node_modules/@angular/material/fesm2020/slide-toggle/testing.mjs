import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _MatSlideToggleHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('label');
    }
    /** Whether the slide-toggle is disabled. */
    async isDisabled() {
        const disabled = (await this._nativeElement()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the slide-toggle is required. */
    async isRequired() {
        const required = (await this._nativeElement()).getAttribute('required');
        return coerceBooleanProperty(await required);
    }
    /** Whether the slide-toggle is valid. */
    async isValid() {
        const invalid = (await this.host()).hasClass('ng-invalid');
        return !(await invalid);
    }
    /** Gets the slide-toggle's name. */
    async getName() {
        return (await this._nativeElement()).getAttribute('name');
    }
    /** Gets the slide-toggle's aria-label. */
    async getAriaLabel() {
        return (await this._nativeElement()).getAttribute('aria-label');
    }
    /** Gets the slide-toggle's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._nativeElement()).getAttribute('aria-labelledby');
    }
    /** Gets the slide-toggle's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Focuses the slide-toggle. */
    async focus() {
        return (await this._nativeElement()).focus();
    }
    /** Blurs the slide-toggle. */
    async blur() {
        return (await this._nativeElement()).blur();
    }
    /** Whether the slide-toggle is focused. */
    async isFocused() {
        return (await this._nativeElement()).isFocused();
    }
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}
/** Harness for interacting with a standard mat-slide-toggle in tests. */
class MatSlideToggleHarness extends _MatSlideToggleHarnessBase {
    constructor() {
        super(...arguments);
        this._inputContainer = this.locatorFor('.mat-slide-toggle-bar');
        this._nativeElement = this.locatorFor('input');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSlideToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which slide toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(MatSlideToggleHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the slide-toggle is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name));
    }
    /** Toggle the checked state of the slide-toggle. */
    async toggle() {
        return (await this._inputContainer()).click();
    }
    /** Whether the slide-toggle is checked. */
    async isChecked() {
        const checked = (await this._nativeElement()).getProperty('checked');
        return coerceBooleanProperty(await checked);
    }
}
/** The selector for the host element of a `MatSlideToggle` instance. */
MatSlideToggleHarness.hostSelector = '.mat-slide-toggle';

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

export { MatSlideToggleHarness, _MatSlideToggleHarnessBase };
//# sourceMappingURL=testing.mjs.map
