import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class _MatTooltipHarnessBase extends ComponentHarness {
    /** Shows the tooltip. */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            // We need to dispatch both `touchstart` and a hover event, because the tooltip binds
            // different events depending on the device. The `changedTouches` is there in case the
            // element has ripples.
            yield host.dispatchEvent('touchstart', { changedTouches: [] });
            yield host.hover();
            const panel = yield this._optionalPanel();
            yield (panel === null || panel === void 0 ? void 0 : panel.dispatchEvent('animationend', { animationName: this._showAnimationName }));
        });
    }
    /** Hides the tooltip. */
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            // We need to dispatch both `touchstart` and a hover event, because
            // the tooltip binds different events depending on the device.
            yield host.dispatchEvent('touchend');
            yield host.mouseAway();
            const panel = yield this._optionalPanel();
            yield (panel === null || panel === void 0 ? void 0 : panel.dispatchEvent('animationend', { animationName: this._hideAnimationName }));
        });
    }
    /** Gets whether the tooltip is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return !!panel && !(yield panel.hasClass(this._hiddenClass));
        });
    }
    /** Gets a promise for the tooltip panel's text. */
    getTooltipText() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return panel ? panel.text() : '';
        });
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

export { MatTooltipHarness, _MatTooltipHarnessBase };
//# sourceMappingURL=testing.mjs.map
