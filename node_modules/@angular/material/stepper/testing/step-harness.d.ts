/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, HarnessLoader } from '@angular/cdk/testing';
import { StepHarnessFilters } from './step-harness-filters';
/** Harness for interacting with a standard Angular Material step in tests. */
export declare class MatStepHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepHarnessFilters): HarnessPredicate<MatStepHarness>;
    /** Gets the label of the step. */
    getLabel(): Promise<string>;
    /** Gets the `aria-label` of the step. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the `aria-labelledby` attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Whether the step is selected. */
    isSelected(): Promise<boolean>;
    /** Whether the step has been filled out. */
    isCompleted(): Promise<boolean>;
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    hasErrors(): Promise<boolean>;
    /** Whether the step is optional. */
    isOptional(): Promise<boolean>;
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    select(): Promise<void>;
    protected getRootHarnessLoader(): Promise<HarnessLoader>;
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    private _getIconState;
}
