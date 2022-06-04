/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ToolbarHarnessFilters } from './toolbar-harness-filters';
/** Selectors for different sections of the mat-toolbar that contain user content. */
export declare const enum MatToolbarSection {
    ROW = ".mat-toolbar-row"
}
/** Harness for interacting with a standard mat-toolbar in tests. */
export declare class MatToolbarHarness extends ContentContainerComponentHarness<MatToolbarSection> {
    static hostSelector: string;
    private _getRows;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatToolbarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ToolbarHarnessFilters): HarnessPredicate<MatToolbarHarness>;
    /** Whether the toolbar has multiple rows. */
    hasMultipleRows(): Promise<boolean>;
    /** Gets all of the toolbar's content as text. */
    private _getText;
    /** Gets the text of each row in the toolbar. */
    getRowsAsText(): Promise<string[]>;
}
