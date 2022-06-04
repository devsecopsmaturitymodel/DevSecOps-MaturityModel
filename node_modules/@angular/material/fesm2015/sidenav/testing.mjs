import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * Base class for the drawer harness functionality.
 * @docs-private
 */
class MatDrawerHarnessBase extends ContentContainerComponentHarness {
    /** Whether the drawer is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-drawer-opened');
        });
    }
    /** Gets the position of the drawer inside its container. */
    getPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.hasClass('mat-drawer-end')) ? 'end' : 'start';
        });
    }
    /** Gets the mode that the drawer is in. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-drawer-push')) {
                return 'push';
            }
            if (yield host.hasClass('mat-drawer-side')) {
                return 'side';
            }
            return 'over';
        });
    }
}
/** Harness for interacting with a standard mat-drawer in tests. */
class MatDrawerHarness extends MatDrawerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options).addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
}
/** The selector for the host element of a `MatDrawer` instance. */
MatDrawerHarness.hostSelector = '.mat-drawer';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-drawer-content in tests. */
class MatDrawerContentHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerContentHarness` that
     * meets certain criteria.
     * @param options Options for filtering which drawer content instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerContentHarness, options);
    }
}
/** The selector for the host element of a `MatDrawerContent` instance. */
MatDrawerContentHarness.hostSelector = '.mat-drawer-content';

/** Harness for interacting with a standard mat-drawer-container in tests. */
class MatDrawerContainerHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerContainerHarness, options);
    }
    /**
     * Gets drawers that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    getDrawers(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatDrawerHarness.with(filter))();
        });
    }
    /** Gets the element that has the container's content. */
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorFor(MatDrawerContentHarness)();
        });
    }
}
/** The selector for the host element of a `MatDrawerContainer` instance. */
MatDrawerContainerHarness.hostSelector = '.mat-drawer-container';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-sidenav-content in tests. */
class MatSidenavContentHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContentHarness` that
     * meets certain criteria.
     * @param options Options for filtering which sidenav content instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSidenavContentHarness, options);
    }
}
/** The selector for the host element of a `MatSidenavContent` instance. */
MatSidenavContentHarness.hostSelector = '.mat-sidenav-content';

/** Harness for interacting with a standard mat-sidenav in tests. */
class MatSidenavHarness extends MatDrawerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavHarness` that meets
     * certain criteria.
     * @param options Options for filtering which sidenav instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSidenavHarness, options).addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
    /** Whether the sidenav is fixed in the viewport. */
    isFixedInViewport() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-sidenav-fixed');
        });
    }
}
/** The selector for the host element of a `MatSidenav` instance. */
MatSidenavHarness.hostSelector = '.mat-sidenav';

/** Harness for interacting with a standard mat-sidenav-container in tests. */
class MatSidenavContainerHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSidenavContainerHarness, options);
    }
    /**
     * Gets sidenavs that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    getSidenavs(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatSidenavHarness.with(filter))();
        });
    }
    /** Gets the element that has the container's content. */
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorFor(MatSidenavContentHarness)();
        });
    }
}
/** The selector for the host element of a `MatSidenavContainer` instance. */
MatSidenavContainerHarness.hostSelector = '.mat-sidenav-container';

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

export { MatDrawerContainerHarness, MatDrawerContentHarness, MatDrawerHarness, MatSidenavContainerHarness, MatSidenavContentHarness, MatSidenavHarness };
//# sourceMappingURL=testing.mjs.map
