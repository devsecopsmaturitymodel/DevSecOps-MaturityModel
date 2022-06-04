import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

/** Harness for interacting with a standard Angular Material tab-label in tests. */
class MatTabHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabHarness, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label));
    }
    /** Gets the label of the tab. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the aria-label of the tab. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the "aria-labelledby" attribute. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Whether the tab is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostEl = yield this.host();
            return (yield hostEl.getAttribute('aria-selected')) === 'true';
        });
    }
    /** Whether the tab is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostEl = yield this.host();
            return (yield hostEl.getAttribute('aria-disabled')) === 'true';
        });
    }
    /** Selects the given tab by clicking on the label. Tab cannot be selected if disabled. */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).click();
        });
    }
    /** Gets the text content of the tab. */
    getTextContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = yield this._getContentId();
            const contentEl = yield this.documentRootLocatorFactory().locatorFor(`#${contentId}`)();
            return contentEl.text();
        });
    }
    getRootHarnessLoader() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = yield this._getContentId();
            return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
        });
    }
    /** Gets the element id for the content of the current tab. */
    _getContentId() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostEl = yield this.host();
            // Tabs never have an empty "aria-controls" attribute.
            return (yield hostEl.getAttribute('aria-controls'));
        });
    }
}
/** The selector for the host element of a `MatTab` instance. */
MatTabHarness.hostSelector = '.mat-tab-label';

/** Harness for interacting with a standard mat-tab-group in tests. */
class MatTabGroupHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabGroupHarness, options).addOption('selectedTabLabel', options.selectedTabLabel, (harness, label) => __awaiter(this, void 0, void 0, function* () {
            const selectedTab = yield harness.getSelectedTab();
            return HarnessPredicate.stringMatches(yield selectedTab.getLabel(), label);
        }));
    }
    /**
     * Gets the list of tabs in the tab group.
     * @param filter Optionally filters which tabs are included.
     */
    getTabs(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatTabHarness.with(filter))();
        });
    }
    /** Gets the selected tab of the tab group. */
    getSelectedTab() {
        return __awaiter(this, void 0, void 0, function* () {
            const tabs = yield this.getTabs();
            const isSelected = yield parallel(() => tabs.map(t => t.isSelected()));
            for (let i = 0; i < tabs.length; i++) {
                if (isSelected[i]) {
                    return tabs[i];
                }
            }
            throw new Error('No selected tab could be found.');
        });
    }
    /**
     * Selects a tab in this tab group.
     * @param filter An optional filter to apply to the child tabs. The first tab matching the filter
     *     will be selected.
     */
    selectTab(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tabs = yield this.getTabs(filter);
            if (!tabs.length) {
                throw Error(`Cannot find mat-tab matching filter ${JSON.stringify(filter)}`);
            }
            yield tabs[0].select();
        });
    }
}
/** The selector for the host element of a `MatTabGroup` instance. */
MatTabGroupHarness.hostSelector = '.mat-tab-group';

/** Harness for interacting with a standard Angular Material tab link in tests. */
class MatTabLinkHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabLinkHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab link instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabLinkHarness, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label));
    }
    /** Gets the label of the link. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Whether the link is active. */
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return host.hasClass('mat-tab-label-active');
        });
    }
    /** Whether the link is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return host.hasClass('mat-tab-disabled');
        });
    }
    /** Clicks on the link. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).click();
        });
    }
}
/** The selector for the host element of a `MatTabLink` instance. */
MatTabLinkHarness.hostSelector = '.mat-tab-link';

/** Harness for interacting with a standard mat-tab-nav-panel in tests. */
class MatTabNavPanelHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabNavPanel` that meets
     * certain criteria.
     * @param options Options for filtering which tab nav panel instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabNavPanelHarness, options);
    }
    /** Gets the tab panel text content. */
    getTextContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
}
/** The selector for the host element of a `MatTabNavPanel` instance. */
MatTabNavPanelHarness.hostSelector = '.mat-tab-nav-panel';

/** Harness for interacting with a standard mat-tab-nav-bar in tests. */
class MatTabNavBarHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabNavBar` that meets
     * certain criteria.
     * @param options Options for filtering which tab nav bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTabNavBarHarness, options);
    }
    /**
     * Gets the list of links in the nav bar.
     * @param filter Optionally filters which links are included.
     */
    getLinks(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatTabLinkHarness.with(filter))();
        });
    }
    /** Gets the active link in the nav bar. */
    getActiveLink() {
        return __awaiter(this, void 0, void 0, function* () {
            const links = yield this.getLinks();
            const isActive = yield parallel(() => links.map(t => t.isActive()));
            for (let i = 0; i < links.length; i++) {
                if (isActive[i]) {
                    return links[i];
                }
            }
            throw new Error('No active link could be found.');
        });
    }
    /**
     * Clicks a link inside the nav bar.
     * @param filter An optional filter to apply to the child link. The first link matching the filter
     *     will be clicked.
     */
    clickLink(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tabs = yield this.getLinks(filter);
            if (!tabs.length) {
                throw Error(`Cannot find mat-tab-link matching filter ${JSON.stringify(filter)}`);
            }
            yield tabs[0].click();
        });
    }
    /** Gets the panel associated with the nav bar. */
    getPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.getActiveLink();
            const host = yield link.host();
            const panelId = yield host.getAttribute('aria-controls');
            if (!panelId) {
                throw Error('No panel is controlled by the nav bar.');
            }
            const filter = { selector: `#${panelId}` };
            return yield this.documentRootLocatorFactory().locatorFor(MatTabNavPanelHarness.with(filter))();
        });
    }
}
/** The selector for the host element of a `MatTabNavBar` instance. */
MatTabNavBarHarness.hostSelector = '.mat-tab-nav-bar';

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

export { MatTabGroupHarness, MatTabHarness, MatTabLinkHarness, MatTabNavBarHarness };
//# sourceMappingURL=testing.mjs.map
