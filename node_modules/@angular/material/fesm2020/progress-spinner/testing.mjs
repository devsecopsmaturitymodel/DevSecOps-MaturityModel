import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-progress-spinner in tests. */
class MatProgressSpinnerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressSpinnerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatProgressSpinnerHarness, options);
    }
    /** Gets the progress spinner's value. */
    async getValue() {
        const host = await this.host();
        const ariaValue = await host.getAttribute('aria-valuenow');
        return ariaValue ? coerceNumberProperty(ariaValue) : null;
    }
    /** Gets the progress spinner's mode. */
    async getMode() {
        const modeAttr = (await this.host()).getAttribute('mode');
        return (await modeAttr);
    }
}
/** The selector for the host element of a `MatProgressSpinner` instance. */
MatProgressSpinnerHarness.hostSelector = '.mat-progress-spinner';

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

export { MatProgressSpinnerHarness };
//# sourceMappingURL=testing.mjs.map
