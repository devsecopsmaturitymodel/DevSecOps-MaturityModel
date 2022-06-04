import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-divider`. */
class MatDividerHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatDividerHarness, options);
    }
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-orientation');
        });
    }
    isInset() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-divider-inset');
        });
    }
}
MatDividerHarness.hostSelector = '.mat-divider';

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

export { MatDividerHarness };
//# sourceMappingURL=testing.mjs.map
