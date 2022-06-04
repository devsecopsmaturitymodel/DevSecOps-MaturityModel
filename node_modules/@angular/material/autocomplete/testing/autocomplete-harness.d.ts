/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptgroupHarness, MatOptionHarness, OptgroupHarnessFilters, OptionHarnessFilters } from '@angular/material/core/testing';
import { AutocompleteHarnessFilters } from './autocomplete-harness-filters';
export declare abstract class _MatAutocompleteHarnessBase<OptionType extends ComponentHarnessConstructor<Option> & {
    with: (options?: OptionFilters) => HarnessPredicate<Option>;
}, Option extends ComponentHarness & {
    click(): Promise<void>;
}, OptionFilters extends BaseHarnessFilters, OptionGroupType extends ComponentHarnessConstructor<OptionGroup> & {
    with: (options?: OptionGroupFilters) => HarnessPredicate<OptionGroup>;
}, OptionGroup extends ComponentHarness, OptionGroupFilters extends BaseHarnessFilters> extends ComponentHarness {
    private _documentRootLocator;
    protected abstract _prefix: string;
    protected abstract _optionClass: OptionType;
    protected abstract _optionGroupClass: OptionGroupType;
    /** Gets the value of the autocomplete input. */
    getValue(): Promise<string>;
    /** Whether the autocomplete input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Focuses the autocomplete input. */
    focus(): Promise<void>;
    /** Blurs the autocomplete input. */
    blur(): Promise<void>;
    /** Whether the autocomplete input is focused. */
    isFocused(): Promise<boolean>;
    /** Enters text into the autocomplete. */
    enterText(value: string): Promise<void>;
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters?: Omit<OptionFilters, 'ancestor'>): Promise<Option[]>;
    /** Gets the option groups inside the autocomplete panel. */
    getOptionGroups(filters?: Omit<OptionGroupFilters, 'ancestor'>): Promise<OptionGroup[]>;
    /** Selects the first option matching the given filters. */
    selectOption(filters: OptionFilters): Promise<void>;
    /** Whether the autocomplete is open. */
    isOpen(): Promise<boolean>;
    /** Gets the panel associated with this autocomplete trigger. */
    private _getPanel;
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    private _getPanelSelector;
}
/** Harness for interacting with a standard mat-autocomplete in tests. */
export declare class MatAutocompleteHarness extends _MatAutocompleteHarnessBase<typeof MatOptionHarness, MatOptionHarness, OptionHarnessFilters, typeof MatOptgroupHarness, MatOptgroupHarness, OptgroupHarnessFilters> {
    protected _prefix: string;
    protected _optionClass: typeof MatOptionHarness;
    protected _optionGroupClass: typeof MatOptgroupHarness;
    /** The selector for the host element of a `MatAutocomplete` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: AutocompleteHarnessFilters): HarnessPredicate<MatAutocompleteHarness>;
}
