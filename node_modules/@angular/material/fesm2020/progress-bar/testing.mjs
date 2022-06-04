import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-progress-bar in tests. */
class MatProgressBarHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatProgressBarHarness, options);
    }
    /** Gets the progress bar's value. */
    async getValue() {
        const host = await this.host();
        const ariaValue = await host.getAttribute('aria-valuenow');
        return ariaValue ? coerceNumberProperty(ariaValue) : null;
    }
    /** Gets the progress bar's mode. */
    async getMode() {
        return (await this.host()).getAttribute('mode');
    }
}
/** The selector for the host element of a `MatProgressBar` instance. */
MatProgressBarHarness.hostSelector = '.mat-progress-bar';

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

export { MatProgressBarHarness };
//# sourceMappingURL=testing.mjs.map
