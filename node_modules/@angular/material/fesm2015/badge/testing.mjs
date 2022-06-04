import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a standard Material badge in tests. */
class MatBadgeHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._badgeElement = this.locatorFor('.mat-badge-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatBadgeHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets a promise for the badge text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._badgeElement()).text();
        });
    }
    /** Gets whether the badge is overlapping the content. */
    isOverlapping() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-overlap');
        });
    }
    /** Gets the position of the badge. */
    getPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            let result = '';
            if (yield host.hasClass('mat-badge-above')) {
                result += 'above';
            }
            else if (yield host.hasClass('mat-badge-below')) {
                result += 'below';
            }
            if (yield host.hasClass('mat-badge-before')) {
                result += ' before';
            }
            else if (yield host.hasClass('mat-badge-after')) {
                result += ' after';
            }
            return result.trim();
        });
    }
    /** Gets the size of the badge. */
    getSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-badge-small')) {
                return 'small';
            }
            else if (yield host.hasClass('mat-badge-large')) {
                return 'large';
            }
            return 'medium';
        });
    }
    /** Gets whether the badge is hidden. */
    isHidden() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-hidden');
        });
    }
    /** Gets whether the badge is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-disabled');
        });
    }
}
MatBadgeHarness.hostSelector = '.mat-badge';

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

export { MatBadgeHarness };
//# sourceMappingURL=testing.mjs.map
