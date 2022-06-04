import { HarnessPredicate, ComponentHarness, ContentContainerComponentHarness, parallel } from '@angular/cdk/testing';
import { MatDividerHarness } from '@angular/material/divider/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const iconSelector = '.mat-list-icon';
const avatarSelector = '.mat-list-avatar';
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
function getListItemPredicate(harnessType, options) {
    return new HarnessPredicate(harnessType, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}
/** Harness for interacting with a list subheader. */
class MatSubheaderHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatSubheaderHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    async getText() {
        return (await this.host()).text();
    }
}
MatSubheaderHarness.hostSelector = '.mat-subheader';
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
class MatListItemHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._lines = this.locatorForAll('.mat-line');
        this._avatar = this.locatorForOptional(avatarSelector);
        this._icon = this.locatorForOptional(iconSelector);
    }
    /** Gets the full text content of the list item. */
    async getText() {
        return (await this.host()).text({ exclude: `${iconSelector}, ${avatarSelector}` });
    }
    /** Gets the lines of text (`mat-line` elements) in this nav list item. */
    async getLinesText() {
        const lines = await this._lines();
        return parallel(() => lines.map(l => l.text()));
    }
    /** Whether this list item has an avatar. */
    async hasAvatar() {
        return !!(await this._avatar());
    }
    /** Whether this list item has an icon. */
    async hasIcon() {
        return !!(await this._icon());
    }
    /** Whether this list option is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-list-item-disabled');
    }
    /**
     * Gets a `HarnessLoader` used to get harnesses within the list item's content.
     * @deprecated Use `getChildLoader(MatListItemSection.CONTENT)` or `getHarness` instead.
     * @breaking-change 12.0.0
     */
    async getHarnessLoaderForContent() {
        return this.getChildLoader(".mat-list-item-content" /* CONTENT */);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
class MatListHarnessBase extends ComponentHarness {
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    async getItems(filters) {
        return this.locatorForAll(this._itemHarness.with(filters))();
    }
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    async getItemsGroupedBySubheader(filters) {
        const listSections = [];
        let currentSection = { items: [] };
        const itemsAndSubheaders = await this.getItemsWithSubheadersAndDividers({
            item: filters,
            divider: false,
        });
        for (const itemOrSubheader of itemsAndSubheaders) {
            if (itemOrSubheader instanceof MatSubheaderHarness) {
                if (currentSection.heading !== undefined || currentSection.items.length) {
                    listSections.push(currentSection);
                }
                currentSection = { heading: itemOrSubheader.getText(), items: [] };
            }
            else {
                currentSection.items.push(itemOrSubheader);
            }
        }
        if (currentSection.heading !== undefined ||
            currentSection.items.length ||
            !listSections.length) {
            listSections.push(currentSection);
        }
        // Concurrently wait for all sections to resolve their heading if present.
        return parallel(() => listSections.map(async (s) => ({ items: s.items, heading: await s.heading })));
    }
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    async getItemsGroupedByDividers(filters) {
        const listSections = [[]];
        const itemsAndDividers = await this.getItemsWithSubheadersAndDividers({
            item: filters,
            subheader: false,
        });
        for (const itemOrDivider of itemsAndDividers) {
            if (itemOrDivider instanceof MatDividerHarness) {
                listSections.push([]);
            }
            else {
                listSections[listSections.length - 1].push(itemOrDivider);
            }
        }
        return listSections;
    }
    async getItemsWithSubheadersAndDividers(filters = {}) {
        const query = [];
        if (filters.item !== false) {
            query.push(this._itemHarness.with(filters.item || {}));
        }
        if (filters.subheader !== false) {
            query.push(MatSubheaderHarness.with(filters.subheader));
        }
        if (filters.divider !== false) {
            query.push(MatDividerHarness.with(filters.divider));
        }
        return this.locatorForAll(...query)();
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-action-list in tests. */
class MatActionListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatActionListItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which action list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatActionListHarness, options);
    }
}
/** The selector for the host element of a `MatActionList` instance. */
MatActionListHarness.hostSelector = 'mat-action-list.mat-list';
/** Harness for interacting with an action list item. */
class MatActionListItemHarness extends MatListItemHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatActionListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which action list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatActionListItemHarness, options);
    }
    /** Clicks on the action list item. */
    async click() {
        return (await this.host()).click();
    }
    /** Focuses the action list item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the action list item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the action list item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
}
/** The selector for the host element of a `MatListItem` instance. */
MatActionListItemHarness.hostSelector = `${MatActionListHarness.hostSelector} .mat-list-item`;

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-list in tests. */
class MatListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatListItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListHarness` that meets certain
     * criteria.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatListHarness, options);
    }
}
/** The selector for the host element of a `MatList` instance. */
MatListHarness.hostSelector = '.mat-list:not(mat-action-list)';
/** Harness for interacting with a list item. */
class MatListItemHarness extends MatListItemHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatListItemHarness, options);
    }
}
/** The selector for the host element of a `MatListItem` instance. */
MatListItemHarness.hostSelector = `${MatListHarness.hostSelector} .mat-list-item`;

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
/** Harness for interacting with a standard mat-nav-list in tests. */
class MatNavListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatNavListItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNavListHarness, options);
    }
}
/** The selector for the host element of a `MatNavList` instance. */
MatNavListHarness.hostSelector = '.mat-nav-list';
/** Harness for interacting with a nav list item. */
class MatNavListItemHarness extends MatListItemHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatNavListItemHarness, options).addOption('href', options.href, async (harness, href) => HarnessPredicate.stringMatches(harness.getHref(), href));
    }
    /** Gets the href for this nav list item. */
    async getHref() {
        return (await this.host()).getAttribute('href');
    }
    /** Clicks on the nav list item. */
    async click() {
        return (await this.host()).click();
    }
    /** Focuses the nav list item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the nav list item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the nav list item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
}
/** The selector for the host element of a `MatListItem` instance. */
MatNavListItemHarness.hostSelector = `${MatNavListHarness.hostSelector} .mat-list-item`;

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-selection-list in tests. */
class MatSelectionListHarness extends MatListHarnessBase {
    constructor() {
        super(...arguments);
        this._itemHarness = MatListOptionHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSelectionListHarness, options);
    }
    /** Whether the selection list is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    async selectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.select()));
    }
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    async deselectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.deselect()));
    }
    /** Gets all items matching the given list of filters. */
    async _getItems(filters) {
        if (!filters.length) {
            return this.getItems();
        }
        const matches = await parallel(() => {
            return filters.map(filter => this.locatorForAll(MatListOptionHarness.with(filter))());
        });
        return matches.reduce((result, current) => [...result, ...current], []);
    }
}
/** The selector for the host element of a `MatSelectionList` instance. */
MatSelectionListHarness.hostSelector = '.mat-selection-list';
/** Harness for interacting with a list option. */
class MatListOptionHarness extends MatListItemHarnessBase {
    constructor() {
        super(...arguments);
        this._itemContent = this.locatorFor('.mat-list-item-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(MatListOptionHarness, options).addOption('is selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }
    /** Gets the position of the checkbox relative to the list option content. */
    async getCheckboxPosition() {
        return (await (await this._itemContent()).hasClass('mat-list-item-content-reverse'))
            ? 'after'
            : 'before';
    }
    /** Whether the list option is selected. */
    async isSelected() {
        return (await (await this.host()).getAttribute('aria-selected')) === 'true';
    }
    /** Focuses the list option. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the list option. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the list option is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Toggles the checked state of the checkbox. */
    async toggle() {
        return (await this.host()).click();
    }
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    async select() {
        if (!(await this.isSelected())) {
            return this.toggle();
        }
    }
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    async deselect() {
        if (await this.isSelected()) {
            return this.toggle();
        }
    }
}
/** The selector for the host element of a `MatListOption` instance. */
MatListOptionHarness.hostSelector = '.mat-list-option';

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

export { MatActionListHarness, MatActionListItemHarness, MatListHarness, MatListItemHarness, MatListOptionHarness, MatNavListHarness, MatNavListItemHarness, MatSelectionListHarness };
//# sourceMappingURL=testing.mjs.map
