import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-snack-bar in tests. */
class MatSnackBarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mat-simple-snackbar > span';
        this._actionButtonSelector = '.mat-simple-snackbar-action > button';
        this._snackBarLiveRegion = this.locatorFor('[aria-live]');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSnackBarHarness, options);
    }
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     * @deprecated Use `getAriaLive` instead.
     * @breaking-change 13.0.0
     */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    async getAriaLive() {
        return (await this._snackBarLiveRegion()).getAttribute('aria-live');
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    async hasAction() {
        await this._assertContentAnnotated();
        return (await this._getActionButton()) !== null;
    }
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    async getActionDescription() {
        await this._assertHasAction();
        return (await this._getActionButton()).text();
    }
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    async dismissWithAction() {
        await this._assertHasAction();
        await (await this._getActionButton()).click();
    }
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    async getMessage() {
        await this._assertContentAnnotated();
        return (await this.locatorFor(this._messageSelector)()).text();
    }
    /** Gets whether the snack-bar has been dismissed. */
    async isDismissed() {
        // We consider the snackbar dismissed if it's not in the DOM. We can assert that the
        // element isn't in the DOM by seeing that its width and height are zero.
        const host = await this.host();
        const [exit, dimensions] = await parallel(() => [
            // The snackbar container is marked with the "exit" attribute after it has been dismissed
            // but before the animation has finished (after which it's removed from the DOM).
            host.getAttribute('mat-exit'),
            host.getDimensions(),
        ]);
        return exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0);
    }
    /**
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    async _assertContentAnnotated() {
        if (!(await this._isSimpleSnackBar())) {
            throw Error('Method cannot be used for snack-bar with custom content.');
        }
    }
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    async _assertHasAction() {
        await this._assertContentAnnotated();
        if (!(await this.hasAction())) {
            throw Error('Method cannot be used for a snack-bar without an action.');
        }
    }
    /** Whether the snack-bar is using the default content template. */
    async _isSimpleSnackBar() {
        return (await this.locatorForOptional('.mat-simple-snackbar')()) !== null;
    }
    /** Gets the simple snack bar action button. */
    async _getActionButton() {
        return this.locatorForOptional(this._actionButtonSelector)();
    }
}
// Developers can provide a custom component or template for the
// snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
/** The selector for the host element of a `MatSnackBar` instance. */
MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';

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

export { MatSnackBarHarness };
//# sourceMappingURL=testing.mjs.map
