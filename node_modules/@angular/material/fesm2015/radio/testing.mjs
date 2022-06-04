import { __awaiter } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class _MatRadioGroupHarnessBase extends ComponentHarness {
    /** Gets the name of the radio-group. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostName = yield this._getGroupNameFromHost();
            // It's not possible to always determine the "name" of a radio-group by reading
            // the attribute. This is because the radio-group does not set the "name" as an
            // element attribute if the "name" value is set through a binding.
            if (hostName !== null) {
                return hostName;
            }
            // In case we couldn't determine the "name" of a radio-group by reading the
            // "name" attribute, we try to determine the "name" of the group by going
            // through all radio buttons.
            const radioNames = yield this._getNamesFromRadioButtons();
            if (!radioNames.length) {
                return null;
            }
            if (!this._checkRadioNamesInGroupEqual(radioNames)) {
                throw Error('Radio buttons in radio-group have mismatching names.');
            }
            return radioNames[0];
        });
    }
    /** Gets the id of the radio-group. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /** Gets the checked radio-button in a radio-group. */
    getCheckedRadioButton() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let radioButton of yield this.getRadioButtons()) {
                if (yield radioButton.isChecked()) {
                    return radioButton;
                }
            }
            return null;
        });
    }
    /** Gets the checked value of the radio-group. */
    getCheckedValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const checkedRadio = yield this.getCheckedRadioButton();
            if (!checkedRadio) {
                return null;
            }
            return checkedRadio.getValue();
        });
    }
    /**
     * Gets a list of radio buttons which are part of the radio-group.
     * @param filter Optionally filters which radio buttons are included.
     */
    getRadioButtons(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(this._buttonClass.with(filter))();
        });
    }
    /**
     * Checks a radio button in this group.
     * @param filter An optional filter to apply to the child radio buttons. The first tab matching
     *     the filter will be selected.
     */
    checkRadioButton(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const radioButtons = yield this.getRadioButtons(filter);
            if (!radioButtons.length) {
                throw Error(`Could not find radio button matching ${JSON.stringify(filter)}`);
            }
            return radioButtons[0].check();
        });
    }
    /** Gets the name attribute of the host element. */
    _getGroupNameFromHost() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('name');
        });
    }
    /** Gets a list of the name attributes of all child radio buttons. */
    _getNamesFromRadioButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNames = [];
            for (let radio of yield this.getRadioButtons()) {
                const radioName = yield radio.getName();
                if (radioName !== null) {
                    groupNames.push(radioName);
                }
            }
            return groupNames;
        });
    }
    /** Checks if the specified radio names are all equal. */
    _checkRadioNamesInGroupEqual(radioNames) {
        let groupName = null;
        for (let radioName of radioNames) {
            if (groupName === null) {
                groupName = radioName;
            }
            else if (groupName !== radioName) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if a radio-group harness has the given name. Throws if a radio-group with
     * matching name could be found but has mismatching radio-button names.
     */
    static _checkRadioGroupName(harness, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if there is a radio-group which has the "name" attribute set
            // to the expected group name. It's not possible to always determine
            // the "name" of a radio-group by reading the attribute. This is because
            // the radio-group does not set the "name" as an element attribute if the
            // "name" value is set through a binding.
            if ((yield harness._getGroupNameFromHost()) === name) {
                return true;
            }
            // Check if there is a group with radio-buttons that all have the same
            // expected name. This implies that the group has the given name. It's
            // not possible to always determine the name of a radio-group through
            // the attribute because there is
            const radioNames = yield harness._getNamesFromRadioButtons();
            if (radioNames.indexOf(name) === -1) {
                return false;
            }
            if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
                throw Error(`The locator found a radio-group with name "${name}", but some ` +
                    `radio-button's within the group have mismatching names, which is invalid.`);
            }
            return true;
        });
    }
}
/** Harness for interacting with a standard mat-radio-group in tests. */
class MatRadioGroupHarness extends _MatRadioGroupHarnessBase {
    constructor() {
        super(...arguments);
        this._buttonClass = MatRadioButtonHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioGroupHarness, options).addOption('name', options.name, this._checkRadioGroupName);
    }
}
/** The selector for the host element of a `MatRadioGroup` instance. */
MatRadioGroupHarness.hostSelector = '.mat-radio-group';
class _MatRadioButtonHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._input = this.locatorFor('input');
    }
    /** Whether the radio-button is checked. */
    isChecked() {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._input()).getProperty('checked');
            return coerceBooleanProperty(yield checked);
        });
    }
    /** Whether the radio-button is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._input()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Whether the radio-button is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            const required = (yield this._input()).getAttribute('required');
            return coerceBooleanProperty(yield required);
        });
    }
    /** Gets the radio-button's name. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('name');
        });
    }
    /** Gets the radio-button's id. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /**
     * Gets the value of the radio-button. The radio-button value will be converted to a string.
     *
     * Note: This means that for radio-button's with an object as a value `[object Object]` is
     * intentionally returned.
     */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getProperty('value');
        });
    }
    /** Gets the radio-button's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._textLabel()).text();
        });
    }
    /** Focuses the radio-button. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).focus();
        });
    }
    /** Blurs the radio-button. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).blur();
        });
    }
    /** Whether the radio-button is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).isFocused();
        });
    }
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked.
     */
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                return (yield this._clickLabel()).click();
            }
        });
    }
}
/** Harness for interacting with a standard mat-radio-button in tests. */
class MatRadioButtonHarness extends _MatRadioButtonHarnessBase {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-radio-label-content');
        this._clickLabel = this.locatorFor('.mat-radio-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioButtonHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioButtonHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            .addOption('name', options.name, (harness, name) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; }));
    }
}
/** The selector for the host element of a `MatRadioButton` instance. */
MatRadioButtonHarness.hostSelector = '.mat-radio-button';

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

export { MatRadioButtonHarness, MatRadioGroupHarness, _MatRadioButtonHarnessBase, _MatRadioGroupHarnessBase };
//# sourceMappingURL=testing.mjs.map
