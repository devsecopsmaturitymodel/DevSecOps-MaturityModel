/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard `MatGridTitle` in tests. */
export class MatGridTileHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._header = this.locatorForOptional(".mat-grid-tile-header" /* HEADER */);
        this._footer = this.locatorForOptional(".mat-grid-tile-footer" /* FOOTER */);
        this._avatar = this.locatorForOptional('.mat-grid-avatar');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridTileHarness, options)
            .addOption('headerText', options.headerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getHeaderText(), pattern))
            .addOption('footerText', options.footerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getFooterText(), pattern));
    }
    /** Gets the amount of rows that the grid-tile takes up. */
    async getRowspan() {
        return Number(await (await this.host()).getAttribute('rowspan'));
    }
    /** Gets the amount of columns that the grid-tile takes up. */
    async getColspan() {
        return Number(await (await this.host()).getAttribute('colspan'));
    }
    /** Whether the grid-tile has a header. */
    async hasHeader() {
        return (await this._header()) !== null;
    }
    /** Whether the grid-tile has a footer. */
    async hasFooter() {
        return (await this._footer()) !== null;
    }
    /** Whether the grid-tile has an avatar. */
    async hasAvatar() {
        return (await this._avatar()) !== null;
    }
    /** Gets the text of the header if present. */
    async getHeaderText() {
        // For performance reasons, we do not use "hasHeader" as
        // we would then need to query twice for the header.
        const headerEl = await this._header();
        return headerEl ? headerEl.text() : null;
    }
    /** Gets the text of the footer if present. */
    async getFooterText() {
        // For performance reasons, we do not use "hasFooter" as
        // we would then need to query twice for the footer.
        const headerEl = await this._footer();
        return headerEl ? headerEl.text() : null;
    }
}
/** The selector for the host element of a `MatGridTile` instance. */
MatGridTileHarness.hostSelector = '.mat-grid-tile';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3Rlc3RpbmcvZ3JpZC10aWxlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFTeEYsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQ0FBb0Q7SUFBNUY7O1FBb0JVLFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLHNDQUEyQixDQUFDO1FBQzdELFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLHNDQUEyQixDQUFDO1FBQzdELFlBQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQTBDaEUsQ0FBQztJQTVEQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDO2FBQ3JELFNBQVMsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUNoRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUNqRTthQUNBLFNBQVMsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUNoRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUNqRSxDQUFDO0lBQ04sQ0FBQztJQU1ELDJEQUEyRDtJQUMzRCxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCw4REFBOEQ7SUFDOUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQ3pDLENBQUM7SUFFRCwwQ0FBMEM7SUFDMUMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDekMsQ0FBQztJQUVELDJDQUEyQztJQUMzQyxLQUFLLENBQUMsU0FBUztRQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBRUQsOENBQThDO0lBQzlDLEtBQUssQ0FBQyxhQUFhO1FBQ2pCLHdEQUF3RDtRQUN4RCxvREFBb0Q7UUFDcEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzNDLENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLGFBQWE7UUFDakIsd0RBQXdEO1FBQ3hELG9EQUFvRDtRQUNwRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QyxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDM0MsQ0FBQzs7QUE5REQscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtHcmlkVGlsZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2dyaWQtbGlzdC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogU2VsZWN0b3JzIGZvciB0aGUgdmFyaW91cyBgbWF0LWdyaWQtdGlsZWAgc2VjdGlvbnMgdGhhdCBtYXkgY29udGFpbiB1c2VyIGNvbnRlbnQuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRHcmlkVGlsZVNlY3Rpb24ge1xuICBIRUFERVIgPSAnLm1hdC1ncmlkLXRpbGUtaGVhZGVyJyxcbiAgRk9PVEVSID0gJy5tYXQtZ3JpZC10aWxlLWZvb3RlcicsXG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYE1hdEdyaWRUaXRsZWAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0R3JpZFRpbGVIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8TWF0R3JpZFRpbGVTZWN0aW9uPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0R3JpZFRpbGVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZ3JpZC10aWxlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0R3JpZFRpbGVIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBkaWFsb2cgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogR3JpZFRpbGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRHcmlkVGlsZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0R3JpZFRpbGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbignaGVhZGVyVGV4dCcsIG9wdGlvbnMuaGVhZGVyVGV4dCwgKGhhcm5lc3MsIHBhdHRlcm4pID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldEhlYWRlclRleHQoKSwgcGF0dGVybiksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCdmb290ZXJUZXh0Jywgb3B0aW9ucy5mb290ZXJUZXh0LCAoaGFybmVzcywgcGF0dGVybikgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0Rm9vdGVyVGV4dCgpLCBwYXR0ZXJuKSxcbiAgICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9oZWFkZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRHcmlkVGlsZVNlY3Rpb24uSEVBREVSKTtcbiAgcHJpdmF0ZSBfZm9vdGVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0R3JpZFRpbGVTZWN0aW9uLkZPT1RFUik7XG4gIHByaXZhdGUgX2F2YXRhciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWdyaWQtYXZhdGFyJyk7XG5cbiAgLyoqIEdldHMgdGhlIGFtb3VudCBvZiByb3dzIHRoYXQgdGhlIGdyaWQtdGlsZSB0YWtlcyB1cC4gKi9cbiAgYXN5bmMgZ2V0Um93c3BhbigpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBOdW1iZXIoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ3Jvd3NwYW4nKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW1vdW50IG9mIGNvbHVtbnMgdGhhdCB0aGUgZ3JpZC10aWxlIHRha2VzIHVwLiAqL1xuICBhc3luYyBnZXRDb2xzcGFuKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIE51bWJlcihhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnY29sc3BhbicpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBncmlkLXRpbGUgaGFzIGEgaGVhZGVyLiAqL1xuICBhc3luYyBoYXNIZWFkZXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9oZWFkZXIoKSkgIT09IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ3JpZC10aWxlIGhhcyBhIGZvb3Rlci4gKi9cbiAgYXN5bmMgaGFzRm9vdGVyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZm9vdGVyKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdyaWQtdGlsZSBoYXMgYW4gYXZhdGFyLiAqL1xuICBhc3luYyBoYXNBdmF0YXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9hdmF0YXIoKSkgIT09IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgaGVhZGVyIGlmIHByZXNlbnQuICovXG4gIGFzeW5jIGdldEhlYWRlclRleHQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgLy8gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGRvIG5vdCB1c2UgXCJoYXNIZWFkZXJcIiBhc1xuICAgIC8vIHdlIHdvdWxkIHRoZW4gbmVlZCB0byBxdWVyeSB0d2ljZSBmb3IgdGhlIGhlYWRlci5cbiAgICBjb25zdCBoZWFkZXJFbCA9IGF3YWl0IHRoaXMuX2hlYWRlcigpO1xuICAgIHJldHVybiBoZWFkZXJFbCA/IGhlYWRlckVsLnRleHQoKSA6IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgZm9vdGVyIGlmIHByZXNlbnQuICovXG4gIGFzeW5jIGdldEZvb3RlclRleHQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgLy8gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGRvIG5vdCB1c2UgXCJoYXNGb290ZXJcIiBhc1xuICAgIC8vIHdlIHdvdWxkIHRoZW4gbmVlZCB0byBxdWVyeSB0d2ljZSBmb3IgdGhlIGZvb3Rlci5cbiAgICBjb25zdCBoZWFkZXJFbCA9IGF3YWl0IHRoaXMuX2Zvb3RlcigpO1xuICAgIHJldHVybiBoZWFkZXJFbCA/IGhlYWRlckVsLnRleHQoKSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==