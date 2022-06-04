/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DrawerHarnessFilters } from './drawer-harness-filters';
/**
 * Base class for the drawer harness functionality.
 * @docs-private
 */
export declare class MatDrawerHarnessBase extends ContentContainerComponentHarness<string> {
    /** Whether the drawer is open. */
    isOpen(): Promise<boolean>;
    /** Gets the position of the drawer inside its container. */
    getPosition(): Promise<'start' | 'end'>;
    /** Gets the mode that the drawer is in. */
    getMode(): Promise<'over' | 'push' | 'side'>;
}
/** Harness for interacting with a standard mat-drawer in tests. */
export declare class MatDrawerHarness extends MatDrawerHarnessBase {
    /** The selector for the host element of a `MatDrawer` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerHarnessFilters): HarnessPredicate<MatDrawerHarness>;
}
