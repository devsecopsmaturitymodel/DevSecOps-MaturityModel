/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { StepperButtonHarnessFilters } from './step-harness-filters';
/** Base class for stepper button harnesses. */
declare abstract class StepperButtonHarness extends ComponentHarness {
    /** Gets the text of the button. */
    getText(): Promise<string>;
    /** Clicks the button. */
    click(): Promise<void>;
}
/** Harness for interacting with a standard Angular Material stepper next button in tests. */
export declare class MatStepperNextHarness extends StepperButtonHarness {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperNextHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperButtonHarnessFilters): HarnessPredicate<MatStepperNextHarness>;
}
/** Harness for interacting with a standard Angular Material stepper previous button in tests. */
export declare class MatStepperPreviousHarness extends StepperButtonHarness {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperPreviousHarness`
     * that meets certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperButtonHarnessFilters): HarnessPredicate<MatStepperPreviousHarness>;
}
export {};
