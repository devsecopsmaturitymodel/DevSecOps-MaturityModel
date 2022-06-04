/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ProgressBarHarnessFilters } from './progress-bar-harness-filters';
/** Harness for interacting with a standard mat-progress-bar in tests. */
export declare class MatProgressBarHarness extends ComponentHarness {
    /** The selector for the host element of a `MatProgressBar` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ProgressBarHarnessFilters): HarnessPredicate<MatProgressBarHarness>;
    /** Gets the progress bar's value. */
    getValue(): Promise<number | null>;
    /** Gets the progress bar's mode. */
    getMode(): Promise<string | null>;
}
