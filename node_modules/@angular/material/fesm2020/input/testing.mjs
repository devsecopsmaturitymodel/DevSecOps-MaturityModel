import { HarnessPredicate, parallel, ComponentHarness } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Whether the input is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Whether the input is readonly. */
    async isReadonly() {
        return (await this.host()).getProperty('readOnly');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is never undefined.
        return await (await this.host()).getProperty('value');
    }
    /** Gets the name of the input. */
    async getName() {
        // The "name" property of the native input is never undefined.
        return await (await this.host()).getProperty('name');
    }
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    async getType() {
        // The "type" property of the native input is never undefined.
        return await (await this.host()).getProperty('type');
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        const host = await this.host();
        const [nativePlaceholder, fallback] = await parallel(() => [
            host.getProperty('placeholder'),
            host.getAttribute('data-placeholder'),
        ]);
        return nativePlaceholder || fallback || '';
    }
    /** Gets the id of the input. */
    async getId() {
        // The input directive always assigns a unique id to the input in
        // case no id has been explicitly specified.
        return await (await this.host()).getProperty('id');
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    async focus() {
        return (await this.host()).focus();
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    async setValue(newValue) {
        const inputEl = await this.host();
        await inputEl.clear();
        // We don't want to send keys for the value if the value is an empty
        // string in order to clear the value. Sending keys with an empty string
        // still results in unnecessary focus events.
        if (newValue) {
            await inputEl.sendKeys(newValue);
        }
        // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
        // value is set, we also set the property after the keyboard sequence. Note that we don't
        // want to do it before, because it can cause the value to be entered twice.
        await inputEl.setInputValue(newValue);
    }
}
// TODO: We do not want to handle `select` elements with `matNativeControl` because
// not all methods of this harness work reasonably for native select elements.
// For more details. See: https://github.com/angular/components/pull/18221.
MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';

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
            .addOption('text', options.text, async (harness, title) => HarnessPredicate.stringMatches(await harness.getText(), title))
            .addOption('index', options.index, async (harness, index) => (await harness.getIndex()) === index)
            .addOption('isSelected', options.isSelected, async (harness, isSelected) => (await harness.isSelected()) === isSelected);
    }
    /** Gets the option's label text. */
    async getText() {
        return (await this.host()).getProperty('label');
    }
    /** Index of the option within the native `select` element. */
    async getIndex() {
        return (await this.host()).getProperty('index');
    }
    /** Gets whether the option is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Gets whether the option is selected. */
    async isSelected() {
        return (await this.host()).getProperty('selected');
    }
}
/** Selector used to locate option instances. */
MatNativeOptionHarness.hostSelector = 'select[matNativeControl] option';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Gets a boolean promise indicating if the select is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    async isMultiple() {
        return (await this.host()).getProperty('multiple');
    }
    /** Gets the name of the select. */
    async getName() {
        // The "name" property of the native select is never undefined.
        return await (await this.host()).getProperty('name');
    }
    /** Gets the id of the select. */
    async getId() {
        // We're guaranteed to have an id, because the `matNativeControl` always assigns one.
        return await (await this.host()).getProperty('id');
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the select is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the options inside the select panel. */
    async getOptions(filter = {}) {
        return this.locatorForAll(MatNativeOptionHarness.with(filter))();
    }
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    async selectOptions(filter = {}) {
        const [isMultiple, options] = await parallel(() => {
            return [this.isMultiple(), this.getOptions(filter)];
        });
        if (options.length === 0) {
            throw Error('Select does not have options matching the specified filter');
        }
        const [host, optionIndexes] = await parallel(() => [
            this.host(),
            parallel(() => options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex())),
        ]);
        await host.selectOptions(...optionIndexes);
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatInputHarness, MatNativeOptionHarness, MatNativeSelectHarness };
//# sourceMappingURL=testing.mjs.map
