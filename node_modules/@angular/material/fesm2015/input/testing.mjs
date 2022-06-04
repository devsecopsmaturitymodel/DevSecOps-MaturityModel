import { __awaiter } from 'tslib';
import { HarnessPredicate, parallel, ComponentHarness } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';

/** Harness for interacting with a standard Material inputs in tests. */
class MatInputHarness extends MatFormFieldControlHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, (harness, value) => {
            return HarnessPredicate.stringMatches(harness.getValue(), value);
        })
            .addOption('placeholder', options.placeholder, (harness, placeholder) => {
            return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
        });
    }
    /** Whether the input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Whether the input is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('required');
        });
    }
    /** Whether the input is readonly. */
    isReadonly() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('readOnly');
        });
    }
    /** Gets the value of the input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "value" property of the native input is never undefined.
            return yield (yield this.host()).getProperty('value');
        });
    }
    /** Gets the name of the input. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "name" property of the native input is never undefined.
            return yield (yield this.host()).getProperty('name');
        });
    }
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    getType() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "type" property of the native input is never undefined.
            return yield (yield this.host()).getProperty('type');
        });
    }
    /** Gets the placeholder of the input. */
    getPlaceholder() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const [nativePlaceholder, fallback] = yield parallel(() => [
                host.getProperty('placeholder'),
                host.getAttribute('data-placeholder'),
            ]);
            return nativePlaceholder || fallback || '';
        });
    }
    /** Gets the id of the input. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            // The input directive always assigns a unique id to the input in
            // case no id has been explicitly specified.
            return yield (yield this.host()).getProperty('id');
        });
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the input is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEl = yield this.host();
            yield inputEl.clear();
            // We don't want to send keys for the value if the value is an empty
            // string in order to clear the value. Sending keys with an empty string
            // still results in unnecessary focus events.
            if (newValue) {
                yield inputEl.sendKeys(newValue);
            }
            // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
            // value is set, we also set the property after the keyboard sequence. Note that we don't
            // want to do it before, because it can cause the value to be entered twice.
            yield inputEl.setInputValue(newValue);
        });
    }
}
// TODO: We do not want to handle `select` elements with `matNativeControl` because
// not all methods of this harness work reasonably for native select elements.
// For more details. See: https://github.com/angular/components/pull/18221.
MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';

/** Harness for interacting with a native `option` in tests. */
class MatNativeOptionHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeOptionHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNativeOptionHarness, options)
            .addOption('text', options.text, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getText(), title); }))
            .addOption('index', options.index, (harness, index) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getIndex()) === index; }))
            .addOption('isSelected', options.isSelected, (harness, isSelected) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isSelected()) === isSelected; }));
    }
    /** Gets the option's label text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('label');
        });
    }
    /** Index of the option within the native `select` element. */
    getIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('index');
        });
    }
    /** Gets whether the option is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Gets whether the option is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('selected');
        });
    }
}
/** Selector used to locate option instances. */
MatNativeOptionHarness.hostSelector = 'select[matNativeControl] option';

/** Harness for interacting with a native `select` in tests. */
class MatNativeSelectHarness extends MatFormFieldControlHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNativeSelectHarness, options);
    }
    /** Gets a boolean promise indicating if the select is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Gets a boolean promise indicating if the select is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('required');
        });
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    isMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('multiple');
        });
    }
    /** Gets the name of the select. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "name" property of the native select is never undefined.
            return yield (yield this.host()).getProperty('name');
        });
    }
    /** Gets the id of the select. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            // We're guaranteed to have an id, because the `matNativeControl` always assigns one.
            return yield (yield this.host()).getProperty('id');
        });
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the select is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Gets the options inside the select panel. */
    getOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatNativeOptionHarness.with(filter))();
        });
    }
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    selectOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const [isMultiple, options] = yield parallel(() => {
                return [this.isMultiple(), this.getOptions(filter)];
            });
            if (options.length === 0) {
                throw Error('Select does not have options matching the specified filter');
            }
            const [host, optionIndexes] = yield parallel(() => [
                this.host(),
                parallel(() => options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex())),
            ]);
            yield host.selectOptions(...optionIndexes);
        });
    }
}
MatNativeSelectHarness.hostSelector = 'select[matNativeControl]';

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

export { MatInputHarness, MatNativeOptionHarness, MatNativeSelectHarness };
//# sourceMappingURL=testing.mjs.map
