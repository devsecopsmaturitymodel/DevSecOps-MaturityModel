import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';

/** Harness for interacting with a standard MatBottomSheet in tests. */
class MatBottomSheetHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a bottom sheet with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatBottomSheetHarness, options);
    }
    /** Gets the value of the bottom sheet's "aria-label" attribute. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /**
     * Dismisses the bottom sheet by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true via the config.
     */
    dismiss() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).sendKeys(TestKey.ESCAPE);
        });
    }
}
// Developers can provide a custom component or template for the
// bottom sheet. The canonical parent is the ".mat-bottom-sheet-container".
MatBottomSheetHarness.hostSelector = '.mat-bottom-sheet-container';

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

export { MatBottomSheetHarness };
//# sourceMappingURL=testing.mjs.map
