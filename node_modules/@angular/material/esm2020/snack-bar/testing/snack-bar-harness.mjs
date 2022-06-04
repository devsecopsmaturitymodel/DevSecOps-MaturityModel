/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-snack-bar in tests. */
export class MatSnackBarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mat-simple-snackbar > span';
        this._actionButtonSelector = '.mat-simple-snackbar-action > button';
        this._snackBarLiveRegion = this.locatorFor('[aria-live]');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSnackBarHarness, options);
    }
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     * @deprecated Use `getAriaLive` instead.
     * @breaking-change 13.0.0
     */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    async getAriaLive() {
        return (await this._snackBarLiveRegion()).getAttribute('aria-live');
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    async hasAction() {
        await this._assertContentAnnotated();
        return (await this._getActionButton()) !== null;
    }
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    async getActionDescription() {
        await this._assertHasAction();
        return (await this._getActionButton()).text();
    }
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    async dismissWithAction() {
        await this._assertHasAction();
        await (await this._getActionButton()).click();
    }
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    async getMessage() {
        await this._assertContentAnnotated();
        return (await this.locatorFor(this._messageSelector)()).text();
    }
    /** Gets whether the snack-bar has been dismissed. */
    async isDismissed() {
        // We consider the snackbar dismissed if it's not in the DOM. We can assert that the
        // element isn't in the DOM by seeing that its width and height are zero.
        const host = await this.host();
        const [exit, dimensions] = await parallel(() => [
            // The snackbar container is marked with the "exit" attribute after it has been dismissed
            // but before the animation has finished (after which it's removed from the DOM).
            host.getAttribute('mat-exit'),
            host.getDimensions(),
        ]);
        return exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0);
    }
    /**
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    async _assertContentAnnotated() {
        if (!(await this._isSimpleSnackBar())) {
            throw Error('Method cannot be used for snack-bar with custom content.');
        }
    }
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    async _assertHasAction() {
        await this._assertContentAnnotated();
        if (!(await this.hasAction())) {
            throw Error('Method cannot be used for a snack-bar without an action.');
        }
    }
    /** Whether the snack-bar is using the default content template. */
    async _isSimpleSnackBar() {
        return (await this.locatorForOptional('.mat-simple-snackbar')()) !== null;
    }
    /** Gets the simple snack bar action button. */
    async _getActionButton() {
        return this.locatorForOptional(this._actionButtonSelector)();
    }
}
// Developers can provide a custom component or template for the
// snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
/** The selector for the host element of a `MatSnackBar` instance. */
MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR2xHLHNFQUFzRTtBQUN0RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0NBQXdDO0lBQWhGOztRQUtZLHFCQUFnQixHQUFHLDZCQUE2QixDQUFDO1FBQ2pELDBCQUFxQixHQUFHLHNDQUFzQyxDQUFDO1FBQ2pFLHdCQUFtQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFnSC9ELENBQUM7SUE5R0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBdUMsQ0FBQztJQUN4RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FDcEQsV0FBVyxDQUNtQixDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxTQUFTO1FBQ2IsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLG9CQUFvQjtRQUN4QixNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxpQkFBaUI7UUFDckIsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQscURBQXFEO0lBQ3JELEtBQUssQ0FBQyxXQUFXO1FBQ2Ysb0ZBQW9GO1FBQ3BGLHlFQUF5RTtRQUV6RSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzlDLHlGQUF5RjtZQUN6RixpRkFBaUY7WUFDakYsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVEOzs7T0FHRztJQUNPLEtBQUssQ0FBQyx1QkFBdUI7UUFDckMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sS0FBSyxDQUFDLGdCQUFnQjtRQUM5QixNQUFNLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRCxtRUFBbUU7SUFDM0QsS0FBSyxDQUFDLGlCQUFpQjtRQUM3QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQzVFLENBQUM7SUFFRCwrQ0FBK0M7SUFDdkMsS0FBSyxDQUFDLGdCQUFnQjtRQUM1QixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDO0lBQy9ELENBQUM7O0FBckhELGdFQUFnRTtBQUNoRSwwRUFBMEU7QUFDMUUscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsMEJBQTBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhTGl2ZVBvbGl0ZW5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NuYWNrQmFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc25hY2stYmFyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNuYWNrLWJhciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhckhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBzbmFja2Jhci4gVGhlIGNhbm9uaWNhbCBzbmFjay1iYXIgcGFyZW50IGlzIHRoZSBcIk1hdFNuYWNrQmFyQ29udGFpbmVyXCIuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U25hY2tCYXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc25hY2stYmFyLWNvbnRhaW5lcic7XG4gIHByb3RlY3RlZCBfbWVzc2FnZVNlbGVjdG9yID0gJy5tYXQtc2ltcGxlLXNuYWNrYmFyID4gc3Bhbic7XG4gIHByb3RlY3RlZCBfYWN0aW9uQnV0dG9uU2VsZWN0b3IgPSAnLm1hdC1zaW1wbGUtc25hY2tiYXItYWN0aW9uID4gYnV0dG9uJztcbiAgcHJpdmF0ZSBfc25hY2tCYXJMaXZlUmVnaW9uID0gdGhpcy5sb2NhdG9yRm9yKCdbYXJpYS1saXZlXScpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbmFja0Jhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNuYWNrIGJhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNuYWNrQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbmFja0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBcmlhTGl2ZWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLWxpdmUgb2YgdGhlIHNuYWNrLWJhcidzIGxpdmUgcmVnaW9uLiBUaGUgYXJpYS1saXZlIG9mIGEgc25hY2stYmFyIGlzXG4gICAqIGRldGVybWluZWQgYmFzZWQgb24gdGhlIEFSSUEgcG9saXRlbmVzcyBzcGVjaWZpZWQgaW4gdGhlIHNuYWNrLWJhciBjb25maWcuXG4gICAqL1xuICBhc3luYyBnZXRBcmlhTGl2ZSgpOiBQcm9taXNlPEFyaWFMaXZlUG9saXRlbmVzcz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc25hY2tCYXJMaXZlUmVnaW9uKCkpLmdldEF0dHJpYnV0ZShcbiAgICAgICdhcmlhLWxpdmUnLFxuICAgICkgYXMgUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0Q29udGVudEFubm90YXRlZCgpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0QWN0aW9uQnV0dG9uKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3JcbiAgICogd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldEFjdGlvbkRlc2NyaXB0aW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0SGFzQWN0aW9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkhLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIHNuYWNrLWJhciBieSBjbGlja2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXInc1xuICAgKiB3aXRob3V0IGFjdGlvbiBvciB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZGlzbWlzc1dpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0SGFzQWN0aW9uKCk7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuX2dldEFjdGlvbkJ1dHRvbigpKSEuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtZXNzYWdlIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IodGhpcy5fbWVzc2FnZVNlbGVjdG9yKSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzbmFjay1iYXIgaGFzIGJlZW4gZGlzbWlzc2VkLiAqL1xuICBhc3luYyBpc0Rpc21pc3NlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBXZSBjb25zaWRlciB0aGUgc25hY2tiYXIgZGlzbWlzc2VkIGlmIGl0J3Mgbm90IGluIHRoZSBET00uIFdlIGNhbiBhc3NlcnQgdGhhdCB0aGVcbiAgICAvLyBlbGVtZW50IGlzbid0IGluIHRoZSBET00gYnkgc2VlaW5nIHRoYXQgaXRzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8uXG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2V4aXQsIGRpbWVuc2lvbnNdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW1xuICAgICAgLy8gVGhlIHNuYWNrYmFyIGNvbnRhaW5lciBpcyBtYXJrZWQgd2l0aCB0aGUgXCJleGl0XCIgYXR0cmlidXRlIGFmdGVyIGl0IGhhcyBiZWVuIGRpc21pc3NlZFxuICAgICAgLy8gYnV0IGJlZm9yZSB0aGUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCAoYWZ0ZXIgd2hpY2ggaXQncyByZW1vdmVkIGZyb20gdGhlIERPTSkuXG4gICAgICBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LWV4aXQnKSxcbiAgICAgIGhvc3QuZ2V0RGltZW5zaW9ucygpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGV4aXQgIT0gbnVsbCB8fCAoISFkaW1lbnNpb25zICYmIGRpbWVuc2lvbnMuaGVpZ2h0ID09PSAwICYmIGRpbWVuc2lvbnMud2lkdGggPT09IDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgaGFzIGFubm90YXRlZCBjb250ZW50LiBQcm9taXNlIHJlamVjdFxuICAgKiBpZiBjb250ZW50IGlzIG5vdCBhbm5vdGF0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgX2Fzc2VydENvbnRlbnRBbm5vdGF0ZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5faXNTaW1wbGVTbmFja0JhcigpKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyIHdpdGggY3VzdG9tIGNvbnRlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgaGFzIGFuIGFjdGlvbiBkZWZpbmVkLiBPdGhlcndpc2UgdGhlXG4gICAqIHByb21pc2Ugd2lsbCByZWplY3QuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgX2Fzc2VydEhhc0FjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5oYXNBY3Rpb24oKSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIGEgc25hY2stYmFyIHdpdGhvdXQgYW4gYWN0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaXMgdXNpbmcgdGhlIGRlZmF1bHQgY29udGVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaXNTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNpbXBsZS1zbmFja2JhcicpKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNpbXBsZSBzbmFjayBiYXIgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0QWN0aW9uQnV0dG9uKCkge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCh0aGlzLl9hY3Rpb25CdXR0b25TZWxlY3RvcikoKTtcbiAgfVxufVxuIl19