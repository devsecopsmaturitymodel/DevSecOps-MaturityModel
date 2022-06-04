import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a standard Angular Material sort header in tests. */
class MatSortHeaderHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._container = this.locatorFor('.mat-sort-header-container');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('sortDirection', options.sortDirection, (harness, sortDirection) => {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    }
    /** Gets the label of the sort header. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._container()).text();
        });
    }
    /** Gets the sorting direction of the header. */
    getSortDirection() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const ariaSort = yield host.getAttribute('aria-sort');
            if (ariaSort === 'ascending') {
                return 'asc';
            }
            else if (ariaSort === 'descending') {
                return 'desc';
            }
            return '';
        });
    }
    /** Gets whether the sort header is currently being sorted by. */
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.getSortDirection());
        });
    }
    /** Whether the sort header is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-sort-header-disabled');
        });
    }
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
}
MatSortHeaderHarness.hostSelector = '.mat-sort-header';

/** Harness for interacting with a standard `mat-sort` in tests. */
class MatSortHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHarness, options);
    }
    /** Gets all of the sort headers in the `mat-sort`. */
    getSortHeaders(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatSortHeaderHarness.with(filter))();
        });
    }
    /** Gets the selected header in the `mat-sort`. */
    getActiveHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.getSortHeaders();
            for (let i = 0; i < headers.length; i++) {
                if (yield headers[i].isActive()) {
                    return headers[i];
                }
            }
            return null;
        });
    }
}
MatSortHarness.hostSelector = '.mat-sort';

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

export { MatSortHarness, MatSortHeaderHarness };
//# sourceMappingURL=testing.mjs.map
