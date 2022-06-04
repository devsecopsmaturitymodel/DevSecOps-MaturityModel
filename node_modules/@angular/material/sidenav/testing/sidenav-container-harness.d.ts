/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DrawerContainerHarnessFilters, DrawerHarnessFilters } from './drawer-harness-filters';
import { MatSidenavContentHarness } from './sidenav-content-harness';
import { MatSidenavHarness } from './sidenav-harness';
/** Harness for interacting with a standard mat-sidenav-container in tests. */
export declare class MatSidenavContainerHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatSidenavContainer` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerContainerHarnessFilters): HarnessPredicate<MatSidenavContainerHarness>;
    /**
     * Gets sidenavs that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    getSidenavs(filter?: DrawerHarnessFilters): Promise<MatSidenavHarness[]>;
    /** Gets the element that has the container's content. */
    getContent(): Promise<MatSidenavContentHarness>;
}
