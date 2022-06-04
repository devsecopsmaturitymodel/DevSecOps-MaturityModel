import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _MatTooltipHarnessBase extends ComponentHarness {
    /** Shows the tooltip. */
    async show() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because the tooltip binds
        // different events depending on the device. The `changedTouches` is there in case the
        // element has ripples.
        await host.dispatchEvent('touchstart', { changedTouches: [] });
        await host.hover();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._showAnimationName });
    }
    /** Hides the tooltip. */
    async hide() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because
        // the tooltip binds different events depending on the device.
        await host.dispatchEvent('touchend');
        await host.mouseAway();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._hideAnimationName });
    }
    /** Gets whether the tooltip is open. */
    async isOpen() {
        const panel = await this._optionalPanel();
        return !!panel && !(await panel.hasClass(this._hiddenClass));
    }
    /** Gets a promise for the tooltip panel's text. */
    async getTooltipText() {
        const panel = await this._optionalPanel();
        return panel ? panel.text() : '';
    }
}
/** Harness for interacting with a standard mat-tooltip in tests. */
class MatTooltipHarness extends _MatTooltipHarnessBase {
    constructor() {
        super(...arguments);
        this._optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-tooltip');
        this._hiddenClass = 'mat-tooltip-hide';
        this._showAnimationName = 'mat-tooltip-show';
        this._hideAnimationName = 'mat-tooltip-hide';
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTooltipHarness, options);
    }
}
MatTooltipHarness.hostSelector = '.mat-tooltip-trigger';

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

export { MatTooltipHarness, _MatTooltipHarnessBase };
//# sourceMappingURL=testing.mjs.map
