/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ProgressSpinnerHarnessFilters } from './progress-spinner-harness-filters';
/** Harness for interacting with a standard mat-progress-spinner in tests. */
export declare class MatProgressSpinnerHarness extends ComponentHarness {
    /** The selector for the host element of a `MatProgressSpinner` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressSpinnerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ProgressSpinnerHarnessFilters): HarnessPredicate<MatProgressSpinnerHarness>;
    /** Gets the progress spinner's value. */
    getValue(): Promise<number | null>;
    /** Gets the progress spinner's mode. */
    getMode(): Promise<ProgressSpinnerMode>;
}
