import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/** Harness for interacting with a standard Angular Material step in tests. */
class MatStepHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('selected', options.selected, (harness, selected) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isSelected()) === selected; }))
            .addOption('completed', options.completed, (harness, completed) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isCompleted()) === completed; }))
            .addOption('invalid', options.invalid, (harness, invalid) => __awaiter(this, void 0, void 0, function* () { return (yield harness.hasErrors()) === invalid; }));
    }
    /** Gets the label of the step. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-step-text-label')()).text();
        });
    }
    /** Gets the `aria-label` of the step. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the `aria-labelledby` attribute. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Whether the step is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.getAttribute('aria-selected')) === 'true';
        });
    }
    /** Whether the step has been filled out. */
    isCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this._getIconState();
            return state === 'done' || (state === 'edit' && !(yield this.isSelected()));
        });
    }
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    hasErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getIconState()) === 'error';
        });
    }
    /** Whether the step is optional. */
    isOptional() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the node with the optional text is present, it means that the step is optional.
            const optionalNode = yield this.locatorForOptional('.mat-step-optional')();
            return !!optionalNode;
        });
    }
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).click();
        });
    }
    getRootHarnessLoader() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = yield (yield this.host()).getAttribute('aria-controls');
            return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
        });
    }
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    _getIconState() {
        return __awaiter(this, void 0, void 0, function* () {
            // The state is exposed on the icon with a class that looks like `mat-step-icon-state-{{state}}`
            const icon = yield this.locatorFor('.mat-step-icon')();
            const classes = (yield icon.getAttribute('class'));
            const match = classes.match(/mat-step-icon-state-([a-z]+)/);
            if (!match) {
                throw Error(`Could not determine step state from "${classes}".`);
            }
            return match[1];
        });
    }
}
/** The selector for the host element of a `MatStep` instance. */
MatStepHarness.hostSelector = '.mat-step-header';

/** Harness for interacting with a standard Material stepper in tests. */
class MatStepperHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperHarness, options).addOption('orientation', options.orientation, (harness, orientation) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getOrientation()) === orientation; }));
    }
    /**
     * Gets the list of steps in the stepper.
     * @param filter Optionally filters which steps are included.
     */
    getSteps(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatStepHarness.with(filter))();
        });
    }
    /** Gets the orientation of the stepper. */
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.hasClass('mat-stepper-horizontal'))
                ? 0 /* HORIZONTAL */
                : 1 /* VERTICAL */;
        });
    }
    /**
     * Selects a step in this stepper.
     * @param filter An optional filter to apply to the child steps. The first step matching the
     *    filter will be selected.
     */
    selectStep(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getSteps(filter);
            if (!steps.length) {
                throw Error(`Cannot find mat-step matching filter ${JSON.stringify(filter)}`);
            }
            yield steps[0].select();
        });
    }
}
/** The selector for the host element of a `MatStepper` instance. */
MatStepperHarness.hostSelector = '.mat-stepper-horizontal, .mat-stepper-vertical';

/** Base class for stepper button harnesses. */
class StepperButtonHarness extends ComponentHarness {
    /** Gets the text of the button. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Clicks the button. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
}
/** Harness for interacting with a standard Angular Material stepper next button in tests. */
class MatStepperNextHarness extends StepperButtonHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperNextHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperNextHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
}
/** The selector for the host element of a `MatStep` instance. */
MatStepperNextHarness.hostSelector = '.mat-stepper-next';
/** Harness for interacting with a standard Angular Material stepper previous button in tests. */
class MatStepperPreviousHarness extends StepperButtonHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperPreviousHarness`
     * that meets certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperPreviousHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
}
/** The selector for the host element of a `MatStep` instance. */
MatStepperPreviousHarness.hostSelector = '.mat-stepper-previous';

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

export { MatStepHarness, MatStepperHarness, MatStepperNextHarness, MatStepperPreviousHarness };
//# sourceMappingURL=testing.mjs.map
