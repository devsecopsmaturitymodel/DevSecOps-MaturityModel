import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';

class _MatPaginatorHarnessBase extends ComponentHarness {
    /** Goes to the next page in the paginator. */
    goToNextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._nextButton()).click();
        });
    }
    /** Goes to the previous page in the paginator. */
    goToPreviousPage() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._previousButton()).click();
        });
    }
    /** Goes to the first page in the paginator. */
    goToFirstPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield this._firstPageButton();
            // The first page button isn't enabled by default so we need to check for it.
            if (!button) {
                throw Error('Could not find first page button inside paginator. ' +
                    'Make sure that `showFirstLastButtons` is enabled.');
            }
            return button.click();
        });
    }
    /** Goes to the last page in the paginator. */
    goToLastPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield this._lastPageButton();
            // The last page button isn't enabled by default so we need to check for it.
            if (!button) {
                throw Error('Could not find last page button inside paginator. ' +
                    'Make sure that `showFirstLastButtons` is enabled.');
            }
            return button.click();
        });
    }
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    setPageSize(size) {
        return __awaiter(this, void 0, void 0, function* () {
            const select = yield this._select();
            // The select is only available if the `pageSizeOptions` are
            // set to an array with more than one item.
            if (!select) {
                throw Error('Cannot find page size selector in paginator. ' +
                    'Make sure that the `pageSizeOptions` have been configured.');
            }
            return select.clickOptions({ text: `${size}` });
        });
    }
    /** Gets the page size of the paginator. */
    getPageSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const select = yield this._select();
            const value = select ? select.getValueText() : (yield this._pageSizeFallback()).text();
            return coerceNumberProperty(yield value);
        });
    }
    /** Gets the text of the range labe of the paginator. */
    getRangeLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._rangeLabel()).text();
        });
    }
}
/** Harness for interacting with a standard mat-paginator in tests. */
class MatPaginatorHarness extends _MatPaginatorHarnessBase {
    constructor() {
        super(...arguments);
        this._nextButton = this.locatorFor('.mat-paginator-navigation-next');
        this._previousButton = this.locatorFor('.mat-paginator-navigation-previous');
        this._firstPageButton = this.locatorForOptional('.mat-paginator-navigation-first');
        this._lastPageButton = this.locatorForOptional('.mat-paginator-navigation-last');
        this._select = this.locatorForOptional(MatSelectHarness.with({
            ancestor: '.mat-paginator-page-size',
        }));
        this._pageSizeFallback = this.locatorFor('.mat-paginator-page-size-value');
        this._rangeLabel = this.locatorFor('.mat-paginator-range-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatPaginatorHarness, options);
    }
}
/** Selector used to find paginator instances. */
MatPaginatorHarness.hostSelector = '.mat-paginator';

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

export { MatPaginatorHarness, _MatPaginatorHarnessBase };
//# sourceMappingURL=testing.mjs.map
