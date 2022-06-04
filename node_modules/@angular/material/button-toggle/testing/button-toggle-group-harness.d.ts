/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonToggleAppearance } from '@angular/material/button-toggle';
import { ButtonToggleGroupHarnessFilters } from './button-toggle-group-harness-filters';
import { ButtonToggleHarnessFilters } from './button-toggle-harness-filters';
import { MatButtonToggleHarness } from './button-toggle-harness';
/** Harness for interacting with a standard mat-button-toggle in tests. */
export declare class MatButtonToggleGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ButtonToggleGroupHarnessFilters): HarnessPredicate<MatButtonToggleGroupHarness>;
    /**
     * Gets the button toggles that are inside the group.
     * @param filter Optionally filters which toggles are included.
     */
    getToggles(filter?: ButtonToggleHarnessFilters): Promise<MatButtonToggleHarness[]>;
    /** Gets whether the button toggle group is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the button toggle group is laid out vertically. */
    isVertical(): Promise<boolean>;
    /** Gets the appearance that the group is using. */
    getAppearance(): Promise<MatButtonToggleAppearance>;
}
