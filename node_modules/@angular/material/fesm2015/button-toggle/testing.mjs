import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a standard mat-button-toggle in tests. */
class MatButtonToggleHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-button-toggle-label-content');
        this._button = this.locatorFor('.mat-button-toggle-button');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatButtonToggleHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
            .addOption('checked', options.checked, (harness, checked) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isChecked()) === checked; }));
    }
    /** Gets a boolean promise indicating if the button toggle is checked. */
    isChecked() {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._button()).getAttribute('aria-pressed');
            return coerceBooleanProperty(yield checked);
        });
    }
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._button()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets a promise for the button toggle's name. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).getAttribute('name');
        });
    }
    /** Gets a promise for the button toggle's aria-label. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).getAttribute('aria-label');
        });
    }
    /** Gets a promise for the button toggles's aria-labelledby. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).getAttribute('aria-labelledby');
        });
    }
    /** Gets a promise for the button toggle's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
    /** Gets the appearance that the button toggle is using. */
    getAppearance() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const className = 'mat-button-toggle-appearance-standard';
            return (yield host.hasClass(className)) ? 'standard' : 'legacy';
        });
    }
    /** Focuses the toggle. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).focus();
        });
    }
    /** Blurs the toggle. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).blur();
        });
    }
    /** Whether the toggle is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).isFocused();
        });
    }
    /** Toggle the checked state of the buttons toggle. */
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).click();
        });
    }
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                yield this.toggle();
            }
        });
    }
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    uncheck() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isChecked()) {
                yield this.toggle();
            }
        });
    }
}
/** The selector for the host element of a `MatButton` instance. */
MatButtonToggleHarness.hostSelector = '.mat-button-toggle';

/** Harness for interacting with a standard mat-button-toggle in tests. */
class MatButtonToggleGroupHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatButtonToggleGroupHarness, options);
    }
    /**
     * Gets the button toggles that are inside the group.
     * @param filter Optionally filters which toggles are included.
     */
    getToggles(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatButtonToggleHarness.with(filter))();
        });
    }
    /** Gets whether the button toggle group is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.host()).getAttribute('aria-disabled')) === 'true';
        });
    }
    /** Gets whether the button toggle group is laid out vertically. */
    isVertical() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-button-toggle-vertical');
        });
    }
    /** Gets the appearance that the group is using. */
    getAppearance() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const className = 'mat-button-toggle-group-appearance-standard';
            return (yield host.hasClass(className)) ? 'standard' : 'legacy';
        });
    }
}
/** The selector for the host element of a `MatButton` instance. */
MatButtonToggleGroupHarness.hostSelector = '.mat-button-toggle-group';

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

export { MatButtonToggleGroupHarness, MatButtonToggleHarness };
//# sourceMappingURL=testing.mjs.map
