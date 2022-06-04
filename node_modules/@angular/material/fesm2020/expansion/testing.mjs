import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-expansion-panel in tests. */
class MatExpansionPanelHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._header = this.locatorFor(".mat-expansion-panel-header" /* HEADER */);
        this._title = this.locatorForOptional(".mat-expansion-panel-header-title" /* TITLE */);
        this._description = this.locatorForOptional(".mat-expansion-panel-header-description" /* DESCRIPTION */);
        this._expansionIndicator = this.locatorForOptional('.mat-expansion-indicator');
        this._content = this.locatorFor(".mat-expansion-panel-content" /* CONTENT */);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
     * with specific attributes.
     * @param options Options for narrowing the search:
     *   - `title` finds an expansion-panel with a specific title text.
     *   - `description` finds an expansion-panel with a specific description text.
     *   - `expanded` finds an expansion-panel that is currently expanded.
     *   - `disabled` finds an expansion-panel that is disabled.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatExpansionPanelHarness, options)
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title))
            .addOption('description', options.description, (harness, description) => HarnessPredicate.stringMatches(harness.getDescription(), description))
            .addOption('content', options.content, (harness, content) => HarnessPredicate.stringMatches(harness.getTextContent(), content))
            .addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }
    /** Whether the panel is expanded. */
    async isExpanded() {
        return (await this.host()).hasClass('mat-expanded');
    }
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    async getTitle() {
        const titleEl = await this._title();
        return titleEl ? titleEl.text() : null;
    }
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    async getDescription() {
        const descriptionEl = await this._description();
        return descriptionEl ? descriptionEl.text() : null;
    }
    /** Whether the panel is disabled. */
    async isDisabled() {
        return (await (await this._header()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    async toggle() {
        await (await this._header()).click();
    }
    /** Expands the expansion panel if collapsed. */
    async expand() {
        if (!(await this.isExpanded())) {
            await this.toggle();
        }
    }
    /** Collapses the expansion panel if expanded. */
    async collapse() {
        if (await this.isExpanded()) {
            await this.toggle();
        }
    }
    /** Gets the text content of the panel. */
    async getTextContent() {
        return (await this._content()).text();
    }
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     * @deprecated Use either `getChildLoader(MatExpansionPanelSection.CONTENT)`, `getHarness` or
     *    `getAllHarnesses` instead.
     * @breaking-change 12.0.0
     */
    async getHarnessLoaderForContent() {
        return this.getChildLoader(".mat-expansion-panel-content" /* CONTENT */);
    }
    /** Focuses the panel. */
    async focus() {
        return (await this._header()).focus();
    }
    /** Blurs the panel. */
    async blur() {
        return (await this._header()).blur();
    }
    /** Whether the panel is focused. */
    async isFocused() {
        return (await this._header()).isFocused();
    }
    /** Whether the panel has a toggle indicator displayed. */
    async hasToggleIndicator() {
        return (await this._expansionIndicator()) !== null;
    }
    /** Gets the position of the toggle indicator. */
    async getToggleIndicatorPosition() {
        // By default the expansion indicator will show "after" the panel header content.
        if (await (await this._header()).hasClass('mat-expansion-toggle-indicator-before')) {
            return 'before';
        }
        return 'after';
    }
}
MatExpansionPanelHarness.hostSelector = '.mat-expansion-panel';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-accordion in tests. */
class MatAccordionHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for an accordion
     * with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAccordionHarness, options);
    }
    /** Gets all expansion panels which are part of the accordion. */
    async getExpansionPanels(filter = {}) {
        return this.locatorForAll(MatExpansionPanelHarness.with(filter))();
    }
    /** Whether the accordion allows multiple expanded panels simultaneously. */
    async isMulti() {
        return (await this.host()).hasClass('mat-accordion-multi');
    }
}
MatAccordionHarness.hostSelector = '.mat-accordion';

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

export { MatAccordionHarness, MatExpansionPanelHarness };
//# sourceMappingURL=testing.mjs.map
