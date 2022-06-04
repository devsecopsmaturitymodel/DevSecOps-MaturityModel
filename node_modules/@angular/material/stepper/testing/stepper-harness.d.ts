/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatStepHarness } from './step-harness';
import { StepperHarnessFilters, StepHarnessFilters, StepperOrientation } from './step-harness-filters';
/** Harness for interacting with a standard Material stepper in tests. */
export declare class MatStepperHarness extends ComponentHarness {
    /** The selector for the host element of a `MatStepper` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperHarnessFilters): HarnessPredicate<MatStepperHarness>;
    /**
     * Gets the list of steps in the stepper.
     * @param filter Optionally filters which steps are included.
     */
    getSteps(filter?: StepHarnessFilters): Promise<MatStepHarness[]>;
    /** Gets the orientation of the stepper. */
    getOrientation(): Promise<StepperOrientation>;
    /**
     * Selects a step in this stepper.
     * @param filter An optional filter to apply to the child steps. The first step matching the
     *    filter will be selected.
     */
    selectStep(filter?: StepHarnessFilters): Promise<void>;
}
