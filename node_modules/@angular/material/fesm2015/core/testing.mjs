import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-option` in tests. */
class MatOptionHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Element containing the option's text. */
        this._text = this.locatorFor('.mat-option-text');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptionsHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatOptionHarness, options)
            .addOption('text', options.text, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getText(), title); }))
            .addOption('isSelected', options.isSelected, (harness, isSelected) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isSelected()) === isSelected; }));
    }
    /** Clicks the option. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Gets the option's label text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._text()).text();
        });
    }
    /** Gets whether the option is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-option-disabled');
        });
    }
    /** Gets whether the option is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-selected');
        });
    }
    /** Gets whether the option is active. */
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-active');
        });
    }
    /** Gets whether the option is in multiple selection mode. */
    isMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-option-multiple');
        });
    }
}
/** Selector used to locate option instances. */
MatOptionHarness.hostSelector = '.mat-option';

/** Harness for interacting with a `mat-optgroup` in tests. */
class MatOptgroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-optgroup-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptgroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatOptgroupHarness, options).addOption('labelText', options.labelText, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getLabelText(), title); }));
    }
    /** Gets the option group's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
    /** Gets whether the option group is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-optgroup-disabled');
        });
    }
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    getOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatOptionHarness.with(filter))();
        });
    }
}
/** Selector used to locate option group instances. */
MatOptgroupHarness.hostSelector = '.mat-optgroup';

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

export { MatOptgroupHarness, MatOptionHarness };
//# sourceMappingURL=testing.mjs.map
