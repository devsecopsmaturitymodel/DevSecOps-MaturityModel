/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey, } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class _MatMenuHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    // TODO: potentially extend MatButtonHarness
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the menu is open. */
    async isOpen() {
        return !!(await this._getMenuPanel());
    }
    /** Gets the text of the menu's trigger element. */
    async getTriggerText() {
        return (await this.host()).text();
    }
    /** Focuses the menu. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Opens the menu. */
    async open() {
        if (!(await this.isOpen())) {
            return (await this.host()).click();
        }
    }
    /** Closes the menu. */
    async close() {
        const panel = await this._getMenuPanel();
        if (panel) {
            return panel.sendKeys(TestKey.ESCAPE);
        }
    }
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    async getItems(filters) {
        const panelId = await this._getPanelId();
        if (panelId) {
            return this._documentRootLocator.locatorForAll(this._itemClass.with({
                ...(filters || {}),
                ancestor: `#${panelId}`,
            }))();
        }
        return [];
    }
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    async clickItem(itemFilter, ...subItemFilters) {
        await this.open();
        const items = await this.getItems(itemFilter);
        if (!items.length) {
            throw Error(`Could not find item matching ${JSON.stringify(itemFilter)}`);
        }
        if (!subItemFilters.length) {
            return await items[0].click();
        }
        const menu = await items[0].getSubmenu();
        if (!menu) {
            throw Error(`Item matching ${JSON.stringify(itemFilter)} does not have a submenu`);
        }
        return menu.clickItem(...subItemFilters);
    }
    async getRootHarnessLoader() {
        const panelId = await this._getPanelId();
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
    }
    /** Gets the menu panel associated with this menu. */
    async _getMenuPanel() {
        const panelId = await this._getPanelId();
        return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
    }
    /** Gets the id of the menu panel associated with this menu. */
    async _getPanelId() {
        const panelId = await (await this.host()).getAttribute('aria-controls');
        return panelId || null;
    }
}
export class _MatMenuItemHarnessBase extends ContentContainerComponentHarness {
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets the text of the menu item. */
    async getText() {
        return (await this.host()).text();
    }
    /** Focuses the menu item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Clicks the menu item. */
    async click() {
        return (await this.host()).click();
    }
    /** Whether this item has a submenu. */
    async hasSubmenu() {
        return (await this.host()).matchesSelector(this._menuClass.hostSelector);
    }
    /** Gets the submenu associated with this menu item, or null if none. */
    async getSubmenu() {
        if (await this.hasSubmenu()) {
            return new this._menuClass(this.locatorFactory);
        }
        return null;
    }
}
/** Harness for interacting with a standard mat-menu in tests. */
export class MatMenuHarness extends _MatMenuHarnessBase {
    constructor() {
        super(...arguments);
        this._itemClass = MatMenuItemHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuHarness` that meets certain
     * criteria.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuHarness, options).addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
    }
}
/** The selector for the host element of a `MatMenu` instance. */
MatMenuHarness.hostSelector = '.mat-menu-trigger';
/** Harness for interacting with a standard mat-menu-item in tests. */
export class MatMenuItemHarness extends _MatMenuItemHarnessBase {
    constructor() {
        super(...arguments);
        this._menuClass = MatMenuHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatMenuItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatMenuItemHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('hasSubmenu', options.hasSubmenu, async (harness, hasSubmenu) => (await harness.hasSubmenu()) === hasSubmenu);
    }
}
/** The selector for the host element of a `MatMenuItem` instance. */
MatMenuItemHarness.hostSelector = '.mat-menu-item';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvdGVzdGluZy9tZW51LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUlMLGdDQUFnQyxFQUVoQyxnQkFBZ0IsRUFFaEIsT0FBTyxHQUNSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHNUQsTUFBTSxPQUFnQixtQkFTcEIsU0FBUSxnQ0FBd0M7SUFUbEQ7O1FBVVUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFpSG5FLENBQUM7SUE5R0MsNENBQTRDO0lBRTVDLG9DQUFvQztJQUNwQyxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsS0FBSyxDQUFDLE1BQU07UUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHNCQUFz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SSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUNyRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDeEQ7YUFDQSxTQUFTLENBQ1IsWUFBWSxFQUNaLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssVUFBVSxDQUMzRSxDQUFDO0lBQ04sQ0FBQzs7QUFwQkQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzTG9hZGVyLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBUZXN0RWxlbWVudCxcbiAgVGVzdEtleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01lbnVIYXJuZXNzRmlsdGVycywgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9tZW51LWhhcm5lc3MtZmlsdGVycyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0TWVudUhhcm5lc3NCYXNlPFxuICBJdGVtVHlwZSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxJdGVtPiAmIHtcbiAgICB3aXRoOiAob3B0aW9ucz86IEl0ZW1GaWx0ZXJzKSA9PiBIYXJuZXNzUHJlZGljYXRlPEl0ZW0+O1xuICB9LFxuICBJdGVtIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyAmIHtcbiAgICBjbGljaygpOiBQcm9taXNlPHZvaWQ+O1xuICAgIGdldFN1Ym1lbnUoKTogUHJvbWlzZTxfTWF0TWVudUhhcm5lc3NCYXNlPEl0ZW1UeXBlLCBJdGVtLCBJdGVtRmlsdGVycz4gfCBudWxsPjtcbiAgfSxcbiAgSXRlbUZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMsXG4+IGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaXRlbUNsYXNzOiBJdGVtVHlwZTtcblxuICAvLyBUT0RPOiBwb3RlbnRpYWxseSBleHRlbmQgTWF0QnV0dG9uSGFybmVzc1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBtZW51J3MgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRUcmlnZ2VyVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51LiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgbWVudS4gKi9cbiAgYXN5bmMgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzT3BlbigpKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBtZW51LiAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYW5lbCA9IGF3YWl0IHRoaXMuX2dldE1lbnVQYW5lbCgpO1xuICAgIGlmIChwYW5lbCkge1xuICAgICAgcmV0dXJuIHBhbmVsLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgYE1hdE1lbnVJdGVtSGFybmVzc2AgcmVwcmVzZW50aW5nIHRoZSBpdGVtcyBpbiB0aGUgbWVudS5cbiAgICogQHBhcmFtIGZpbHRlcnMgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIG1lbnUgaXRlbXMgYXJlIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0SXRlbXMoZmlsdGVycz86IE9taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+KTogUHJvbWlzZTxJdGVtW10+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWxJZCgpO1xuICAgIGlmIChwYW5lbElkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKFxuICAgICAgICB0aGlzLl9pdGVtQ2xhc3Mud2l0aCh7XG4gICAgICAgICAgLi4uKGZpbHRlcnMgfHwge30pLFxuICAgICAgICAgIGFuY2VzdG9yOiBgIyR7cGFuZWxJZH1gLFxuICAgICAgICB9IGFzIEl0ZW1GaWx0ZXJzKSxcbiAgICAgICkoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyBhbiBpdGVtIGluIHRoZSBtZW51LCBhbmQgb3B0aW9uYWxseSBjb250aW51ZXMgY2xpY2tpbmcgaXRlbXMgaW4gc3Vic2VxdWVudCBzdWItbWVudXMuXG4gICAqIEBwYXJhbSBpdGVtRmlsdGVyIEEgZmlsdGVyIHVzZWQgdG8gcmVwcmVzZW50IHdoaWNoIGl0ZW0gaW4gdGhlIG1lbnUgc2hvdWxkIGJlIGNsaWNrZWQuIFRoZVxuICAgKiAgICAgZmlyc3QgbWF0Y2hpbmcgbWVudSBpdGVtIHdpbGwgYmUgY2xpY2tlZC5cbiAgICogQHBhcmFtIHN1Ykl0ZW1GaWx0ZXJzIEEgbGlzdCBvZiBmaWx0ZXJzIHJlcHJlc2VudGluZyB0aGUgaXRlbXMgdG8gY2xpY2sgaW4gYW55IHN1YnNlcXVlbnRcbiAgICogICAgIHN1Yi1tZW51cy4gVGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHN1Yi1tZW51IG1hdGNoaW5nIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBpblxuICAgKiAgICAgYHN1Ykl0ZW1GaWx0ZXJzYCB3aWxsIGJlIGNsaWNrZWQuXG4gICAqL1xuICBhc3luYyBjbGlja0l0ZW0oXG4gICAgaXRlbUZpbHRlcjogT21pdDxJdGVtRmlsdGVycywgJ2FuY2VzdG9yJz4sXG4gICAgLi4uc3ViSXRlbUZpbHRlcnM6IE9taXQ8SXRlbUZpbHRlcnMsICdhbmNlc3Rvcic+W11cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5vcGVuKCk7XG4gICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEl0ZW1zKGl0ZW1GaWx0ZXIpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgaXRlbSBtYXRjaGluZyAke0pTT04uc3RyaW5naWZ5KGl0ZW1GaWx0ZXIpfWApO1xuICAgIH1cblxuICAgIGlmICghc3ViSXRlbUZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gYXdhaXQgaXRlbXNbMF0uY2xpY2soKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZW51ID0gYXdhaXQgaXRlbXNbMF0uZ2V0U3VibWVudSgpO1xuICAgIGlmICghbWVudSkge1xuICAgICAgdGhyb3cgRXJyb3IoYEl0ZW0gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShpdGVtRmlsdGVyKX0gZG9lcyBub3QgaGF2ZSBhIHN1Ym1lbnVgKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbnUuY2xpY2tJdGVtKC4uLihzdWJJdGVtRmlsdGVycyBhcyBbT21pdDxJdGVtRmlsdGVycywgJ2FuY2VzdG9yJz5dKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgYXN5bmMgZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgY29uc3QgcGFuZWxJZCA9IGF3YWl0IHRoaXMuX2dldFBhbmVsSWQoKTtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmhhcm5lc3NMb2FkZXJGb3IoYCMke3BhbmVsSWR9YCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWVudSBwYW5lbCBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51LiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRNZW51UGFuZWwoKTogUHJvbWlzZTxUZXN0RWxlbWVudCB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWxJZCgpO1xuICAgIHJldHVybiBwYW5lbElkID8gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYCMke3BhbmVsSWR9YCkoKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIG1lbnUgcGFuZWwgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWVudS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWxJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBwYW5lbElkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcbiAgICByZXR1cm4gcGFuZWxJZCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0TWVudUl0ZW1IYXJuZXNzQmFzZTxcbiAgTWVudVR5cGUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8TWVudT4sXG4gIE1lbnUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzLFxuPiBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX21lbnVDbGFzczogTWVudVR5cGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgbWVudSBpdGVtLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogQ2xpY2tzIHRoZSBtZW51IGl0ZW0uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGl0ZW0gaGFzIGEgc3VibWVudS4gKi9cbiAgYXN5bmMgaGFzU3VibWVudSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tYXRjaGVzU2VsZWN0b3IodGhpcy5fbWVudUNsYXNzLmhvc3RTZWxlY3Rvcik7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3VibWVudSBhc3NvY2lhdGVkIHdpdGggdGhpcyBtZW51IGl0ZW0sIG9yIG51bGwgaWYgbm9uZS4gKi9cbiAgYXN5bmMgZ2V0U3VibWVudSgpOiBQcm9taXNlPE1lbnUgfCBudWxsPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaGFzU3VibWVudSgpKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuX21lbnVDbGFzcyh0aGlzLmxvY2F0b3JGYWN0b3J5KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtbWVudSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SGFybmVzcyBleHRlbmRzIF9NYXRNZW51SGFybmVzc0Jhc2U8XG4gIHR5cGVvZiBNYXRNZW51SXRlbUhhcm5lc3MsXG4gIE1hdE1lbnVJdGVtSGFybmVzcyxcbiAgTWVudUl0ZW1IYXJuZXNzRmlsdGVyc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZW51LXRyaWdnZXInO1xuICBwcm90ZWN0ZWQgX2l0ZW1DbGFzcyA9IE1hdE1lbnVJdGVtSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUhhcm5lc3NgIHRoYXQgbWVldHMgY2VydGFpblxuICAgKiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIG1lbnUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdE1lbnVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdE1lbnVIYXJuZXNzLCBvcHRpb25zKS5hZGRPcHRpb24oXG4gICAgICAndHJpZ2dlclRleHQnLFxuICAgICAgb3B0aW9ucy50cmlnZ2VyVGV4dCxcbiAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUcmlnZ2VyVGV4dCgpLCB0ZXh0KSxcbiAgICApO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LW1lbnUtaXRlbSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRNZW51SXRlbUhhcm5lc3MgZXh0ZW5kcyBfTWF0TWVudUl0ZW1IYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdE1lbnVIYXJuZXNzLFxuICBNYXRNZW51SGFybmVzc1xuPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0TWVudUl0ZW1gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWVudS1pdGVtJztcbiAgcHJvdGVjdGVkIF9tZW51Q2xhc3MgPSBNYXRNZW51SGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0TWVudUl0ZW1IYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBtZW51IGl0ZW0gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTWVudUl0ZW1IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRNZW51SXRlbUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0TWVudUl0ZW1IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnaGFzU3VibWVudScsXG4gICAgICAgIG9wdGlvbnMuaGFzU3VibWVudSxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGhhc1N1Ym1lbnUpID0+IChhd2FpdCBoYXJuZXNzLmhhc1N1Ym1lbnUoKSkgPT09IGhhc1N1Ym1lbnUsXG4gICAgICApO1xuICB9XG59XG4iXX0=