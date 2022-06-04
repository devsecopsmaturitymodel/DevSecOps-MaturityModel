/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
export class _MatPaginatorHarnessBase extends ComponentHarness {
    /** Goes to the next page in the paginator. */
    async goToNextPage() {
        return (await this._nextButton()).click();
    }
    /** Goes to the previous page in the paginator. */
    async goToPreviousPage() {
        return (await this._previousButton()).click();
    }
    /** Goes to the first page in the paginator. */
    async goToFirstPage() {
        const button = await this._firstPageButton();
        // The first page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find first page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /** Goes to the last page in the paginator. */
    async goToLastPage() {
        const button = await this._lastPageButton();
        // The last page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find last page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    async setPageSize(size) {
        const select = await this._select();
        // The select is only available if the `pageSizeOptions` are
        // set to an array with more than one item.
        if (!select) {
            throw Error('Cannot find page size selector in paginator. ' +
                'Make sure that the `pageSizeOptions` have been configured.');
        }
        return select.clickOptions({ text: `${size}` });
    }
    /** Gets the page size of the paginator. */
    async getPageSize() {
        const select = await this._select();
        const value = select ? select.getValueText() : (await this._pageSizeFallback()).text();
        return coerceNumberProperty(await value);
    }
    /** Gets the text of the range labe of the paginator. */
    async getRangeLabel() {
        return (await this._rangeLabel()).text();
    }
}
/** Harness for interacting with a standard mat-paginator in tests. */
export class MatPaginatorHarness extends _MatPaginatorHarnessBase {
    constructor() {
        super(...arguments);
        this._nextButton = this.locatorFor('.mat-paginator-navigation-next');
        this._previousButton = this.locatorFor('.mat-paginator-navigation-previous');
        this._firstPageButton = this.locatorForOptional('.mat-paginator-navigation-first');
        this._lastPageButton = this.locatorForOptional('.mat-paginator-navigation-last');
        this._select = this.locatorForOptional(MatSelectHarness.with({
            ancestor: '.mat-paginator-page-size',
        }));
        this._pageSizeFallback = this.locatorFor('.mat-paginator-page-size-value');
        this._rangeLabel = this.locatorFor('.mat-paginator-range-label');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatPaginatorHarness, options);
    }
}
/** Selector used to find paginator instances. */
MatPaginatorHarness.hostSelector = '.mat-paginator';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3Rlc3RpbmcvcGFnaW5hdG9yLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUczRCxNQUFNLE9BQWdCLHdCQUF5QixTQUFRLGdCQUFnQjtJQWVyRSw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsS0FBSyxDQUFDLGFBQWE7UUFDakIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUU3Qyw2RUFBNkU7UUFDN0UsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sS0FBSyxDQUNULHFEQUFxRDtnQkFDbkQsbURBQW1ELENBQ3RELENBQUM7U0FDSDtRQUVELE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUMsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEtBQUssQ0FDVCxvREFBb0Q7Z0JBQ2xELG1EQUFtRCxDQUN0RCxDQUFDO1NBQ0g7UUFFRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXBDLDREQUE0RDtRQUM1RCwyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sS0FBSyxDQUNULCtDQUErQztnQkFDN0MsNERBQTRELENBQy9ELENBQUM7U0FDSDtRQUVELE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxFQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxXQUFXO1FBQ2YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZGLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNDLENBQUM7Q0FDRjtBQUVELHNFQUFzRTtBQUN0RSxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsd0JBQXdCO0lBQWpFOztRQUdZLGdCQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2hFLG9CQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3hFLHFCQUFnQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQzlFLG9CQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDNUUsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FDekMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQ3BCLFFBQVEsRUFBRSwwQkFBMEI7U0FDckMsQ0FBQyxDQUNILENBQUM7UUFDUSxzQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdEUsZ0JBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFXeEUsQ0FBQztJQVRDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RCxDQUFDOztBQXRCRCxpREFBaUQ7QUFDMUMsZ0NBQVksR0FBRyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGFnaW5hdG9ySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcGFnaW5hdG9yLWhhcm5lc3MtZmlsdGVycyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0UGFnaW5hdG9ySGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9uZXh0QnV0dG9uOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcHJldmlvdXNCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50PjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9maXJzdFBhZ2VCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50IHwgbnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfbGFzdFBhZ2VCdXR0b246IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50IHwgbnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2VsZWN0OiBBc3luY0ZhY3RvcnlGbjxcbiAgICB8IChDb21wb25lbnRIYXJuZXNzICYge1xuICAgICAgICBnZXRWYWx1ZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+O1xuICAgICAgICBjbGlja09wdGlvbnMoLi4uZmlsdGVyczogdW5rbm93bltdKTogUHJvbWlzZTx2b2lkPjtcbiAgICAgIH0pXG4gICAgfCBudWxsXG4gID47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcGFnZVNpemVGYWxsYmFjazogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3JhbmdlTGFiZWw6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50PjtcblxuICAvKiogR29lcyB0byB0aGUgbmV4dCBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9OZXh0UGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX25leHRCdXR0b24oKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBHb2VzIHRvIHRoZSBwcmV2aW91cyBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9QcmV2aW91c1BhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9wcmV2aW91c0J1dHRvbigpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdvZXMgdG8gdGhlIGZpcnN0IHBhZ2UgaW4gdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ29Ub0ZpcnN0UGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCB0aGlzLl9maXJzdFBhZ2VCdXR0b24oKTtcblxuICAgIC8vIFRoZSBmaXJzdCBwYWdlIGJ1dHRvbiBpc24ndCBlbmFibGVkIGJ5IGRlZmF1bHQgc28gd2UgbmVlZCB0byBjaGVjayBmb3IgaXQuXG4gICAgaWYgKCFidXR0b24pIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgZmlyc3QgcGFnZSBidXR0b24gaW5zaWRlIHBhZ2luYXRvci4gJyArXG4gICAgICAgICAgJ01ha2Ugc3VyZSB0aGF0IGBzaG93Rmlyc3RMYXN0QnV0dG9uc2AgaXMgZW5hYmxlZC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR29lcyB0byB0aGUgbGFzdCBwYWdlIGluIHRoZSBwYWdpbmF0b3IuICovXG4gIGFzeW5jIGdvVG9MYXN0UGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCB0aGlzLl9sYXN0UGFnZUJ1dHRvbigpO1xuXG4gICAgLy8gVGhlIGxhc3QgcGFnZSBidXR0b24gaXNuJ3QgZW5hYmxlZCBieSBkZWZhdWx0IHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGl0LlxuICAgIGlmICghYnV0dG9uKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIGxhc3QgcGFnZSBidXR0b24gaW5zaWRlIHBhZ2luYXRvci4gJyArXG4gICAgICAgICAgJ01ha2Ugc3VyZSB0aGF0IGBzaG93Rmlyc3RMYXN0QnV0dG9uc2AgaXMgZW5hYmxlZC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcGFnZSBzaXplIG9mIHRoZSBwYWdpbmF0b3IuXG4gICAqIEBwYXJhbSBzaXplIFBhZ2Ugc2l6ZSB0aGF0IHNob3VsZCBiZSBzZWxlY3QuXG4gICAqL1xuICBhc3luYyBzZXRQYWdlU2l6ZShzaXplOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzZWxlY3QgPSBhd2FpdCB0aGlzLl9zZWxlY3QoKTtcblxuICAgIC8vIFRoZSBzZWxlY3QgaXMgb25seSBhdmFpbGFibGUgaWYgdGhlIGBwYWdlU2l6ZU9wdGlvbnNgIGFyZVxuICAgIC8vIHNldCB0byBhbiBhcnJheSB3aXRoIG1vcmUgdGhhbiBvbmUgaXRlbS5cbiAgICBpZiAoIXNlbGVjdCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgZmluZCBwYWdlIHNpemUgc2VsZWN0b3IgaW4gcGFnaW5hdG9yLiAnICtcbiAgICAgICAgICAnTWFrZSBzdXJlIHRoYXQgdGhlIGBwYWdlU2l6ZU9wdGlvbnNgIGhhdmUgYmVlbiBjb25maWd1cmVkLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3QuY2xpY2tPcHRpb25zKHt0ZXh0OiBgJHtzaXplfWB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwYWdlIHNpemUgb2YgdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ2V0UGFnZVNpemUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBjb25zdCBzZWxlY3QgPSBhd2FpdCB0aGlzLl9zZWxlY3QoKTtcbiAgICBjb25zdCB2YWx1ZSA9IHNlbGVjdCA/IHNlbGVjdC5nZXRWYWx1ZVRleHQoKSA6IChhd2FpdCB0aGlzLl9wYWdlU2l6ZUZhbGxiYWNrKCkpLnRleHQoKTtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgdmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgb2YgdGhlIHJhbmdlIGxhYmUgb2YgdGhlIHBhZ2luYXRvci4gKi9cbiAgYXN5bmMgZ2V0UmFuZ2VMYWJlbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fcmFuZ2VMYWJlbCgpKS50ZXh0KCk7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcGFnaW5hdG9yIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvckhhcm5lc3MgZXh0ZW5kcyBfTWF0UGFnaW5hdG9ySGFybmVzc0Jhc2Uge1xuICAvKiogU2VsZWN0b3IgdXNlZCB0byBmaW5kIHBhZ2luYXRvciBpbnN0YW5jZXMuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1wYWdpbmF0b3InO1xuICBwcm90ZWN0ZWQgX25leHRCdXR0b24gPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbmV4dCcpO1xuICBwcm90ZWN0ZWQgX3ByZXZpb3VzQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLXByZXZpb3VzJyk7XG4gIHByb3RlY3RlZCBfZmlyc3RQYWdlQnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tZmlyc3QnKTtcbiAgcHJvdGVjdGVkIF9sYXN0UGFnZUJ1dHRvbiA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWxhc3QnKTtcbiAgcHJvdGVjdGVkIF9zZWxlY3QgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChcbiAgICBNYXRTZWxlY3RIYXJuZXNzLndpdGgoe1xuICAgICAgYW5jZXN0b3I6ICcubWF0LXBhZ2luYXRvci1wYWdlLXNpemUnLFxuICAgIH0pLFxuICApO1xuICBwcm90ZWN0ZWQgX3BhZ2VTaXplRmFsbGJhY2sgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS12YWx1ZScpO1xuICBwcm90ZWN0ZWQgX3JhbmdlTGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcGFnaW5hdG9yLXJhbmdlLWxhYmVsJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFBhZ2luYXRvckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHBhZ2luYXRvciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBQYWdpbmF0b3JIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRQYWdpbmF0b3JIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFBhZ2luYXRvckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=