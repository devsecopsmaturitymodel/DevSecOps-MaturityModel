import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class _MatSlideToggleHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('label');
    }
    /** Whether the slide-toggle is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._nativeElement()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Whether the slide-toggle is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            const required = (yield this._nativeElement()).getAttribute('required');
            return coerceBooleanProperty(yield required);
        });
    }
    /** Whether the slide-toggle is valid. */
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const invalid = (yield this.host()).hasClass('ng-invalid');
            return !(yield invalid);
        });
    }
    /** Gets the slide-toggle's name. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).getAttribute('name');
        });
    }
    /** Gets the slide-toggle's aria-label. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).getAttribute('aria-label');
        });
    }
    /** Gets the slide-toggle's aria-labelledby. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).getAttribute('aria-labelledby');
        });
    }
    /** Gets the slide-toggle's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
    /** Focuses the slide-toggle. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).focus();
        });
    }
    /** Blurs the slide-toggle. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).blur();
        });
    }
    /** Whether the slide-toggle is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nativeElement()).isFocused();
        });
    }
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                yield this.toggle();
            }
        });
    }
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    uncheck() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isChecked()) {
                yield this.toggle();
            }
        });
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
            .addOption('name', options.name, (harness, name) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; })));
    }
    /** Toggle the checked state of the slide-toggle. */
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._inputContainer()).click();
        });
    }
    /** Whether the slide-toggle is checked. */
    isChecked() {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._nativeElement()).getProperty('checked');
            return coerceBooleanProperty(yield checked);
        });
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

export { MatSlideToggleHarness, _MatSlideToggleHarnessBase };
//# sourceMappingURL=testing.mjs.map
