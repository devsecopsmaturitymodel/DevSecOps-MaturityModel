import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

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
            .addOption('expanded', options.expanded, (harness, expanded) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isExpanded()) === expanded; }))
            .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isDisabled()) === disabled; }));
    }
    /** Whether the panel is expanded. */
    isExpanded() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-expanded');
        });
    }
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    getTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            const titleEl = yield this._title();
            return titleEl ? titleEl.text() : null;
        });
    }
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    getDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptionEl = yield this._description();
            return descriptionEl ? descriptionEl.text() : null;
        });
    }
    /** Whether the panel is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this._header()).getAttribute('aria-disabled')) === 'true';
        });
    }
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this._header()).click();
        });
    }
    /** Expands the expansion panel if collapsed. */
    expand() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isExpanded())) {
                yield this.toggle();
            }
        });
    }
    /** Collapses the expansion panel if expanded. */
    collapse() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isExpanded()) {
                yield this.toggle();
            }
        });
    }
    /** Gets the text content of the panel. */
    getTextContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._content()).text();
        });
    }
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     * @deprecated Use either `getChildLoader(MatExpansionPanelSection.CONTENT)`, `getHarness` or
     *    `getAllHarnesses` instead.
     * @breaking-change 12.0.0
     */
    getHarnessLoaderForContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getChildLoader(".mat-expansion-panel-content" /* CONTENT */);
        });
    }
    /** Focuses the panel. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._header()).focus();
        });
    }
    /** Blurs the panel. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._header()).blur();
        });
    }
    /** Whether the panel is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._header()).isFocused();
        });
    }
    /** Whether the panel has a toggle indicator displayed. */
    hasToggleIndicator() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._expansionIndicator()) !== null;
        });
    }
    /** Gets the position of the toggle indicator. */
    getToggleIndicatorPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            // By default the expansion indicator will show "after" the panel header content.
            if (yield (yield this._header()).hasClass('mat-expansion-toggle-indicator-before')) {
                return 'before';
            }
            return 'after';
        });
    }
}
MatExpansionPanelHarness.hostSelector = '.mat-expansion-panel';

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
    getExpansionPanels(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatExpansionPanelHarness.with(filter))();
        });
    }
    /** Whether the accordion allows multiple expanded panels simultaneously. */
    isMulti() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-accordion-multi');
        });
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

export { MatAccordionHarness, MatExpansionPanelHarness };
//# sourceMappingURL=testing.mjs.map
