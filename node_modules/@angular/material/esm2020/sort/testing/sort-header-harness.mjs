/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material sort header in tests. */
export class MatSortHeaderHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._container = this.locatorFor('.mat-sort-header-container');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('sortDirection', options.sortDirection, (harness, sortDirection) => {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    }
    /** Gets the label of the sort header. */
    async getLabel() {
        return (await this._container()).text();
    }
    /** Gets the sorting direction of the header. */
    async getSortDirection() {
        const host = await this.host();
        const ariaSort = await host.getAttribute('aria-sort');
        if (ariaSort === 'ascending') {
            return 'asc';
        }
        else if (ariaSort === 'descending') {
            return 'desc';
        }
        return '';
    }
    /** Gets whether the sort header is currently being sorted by. */
    async isActive() {
        return !!(await this.getSortDirection());
    }
    /** Whether the sort header is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-sort-header-disabled');
    }
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    async click() {
        return (await this.host()).click();
    }
}
MatSortHeaderHarness.hostSelector = '.mat-sort-header';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3Rlc3Rpbmcvc29ydC1oZWFkZXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUl4RSxxRkFBcUY7QUFDckYsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjtJQUExRDs7UUFFVSxlQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBaURyRSxDQUFDO0lBL0NDOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBb0MsRUFBRTtRQUNoRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUNwRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUMxRDthQUNBLFNBQVMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRTtZQUM1RSxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx5Q0FBeUM7SUFDekMsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsZ0RBQWdEO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRELElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtZQUM1QixPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU0sSUFBSSxRQUFRLEtBQUssWUFBWSxFQUFFO1lBQ3BDLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxpRUFBaUU7SUFDakUsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7O0FBakRNLGlDQUFZLEdBQUcsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnO1xuaW1wb3J0IHtTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc29ydC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgc29ydCBoZWFkZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U29ydEhlYWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNvcnQtaGVhZGVyJztcbiAgcHJpdmF0ZSBfY29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNvcnQtaGVhZGVyLWNvbnRhaW5lcicpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAgICogc2VhcmNoIGZvciBhIHNvcnQgaGVhZGVyIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNvcnRIZWFkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTb3J0SGVhZGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTb3J0SGVhZGVySGFybmVzcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCwgKGhhcm5lc3MsIGxhYmVsKSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbCgpLCBsYWJlbCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCdzb3J0RGlyZWN0aW9uJywgb3B0aW9ucy5zb3J0RGlyZWN0aW9uLCAoaGFybmVzcywgc29ydERpcmVjdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0U29ydERpcmVjdGlvbigpLCBzb3J0RGlyZWN0aW9uKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSBzb3J0IGhlYWRlci4gKi9cbiAgYXN5bmMgZ2V0TGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRhaW5lcigpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc29ydGluZyBkaXJlY3Rpb24gb2YgdGhlIGhlYWRlci4gKi9cbiAgYXN5bmMgZ2V0U29ydERpcmVjdGlvbigpOiBQcm9taXNlPFNvcnREaXJlY3Rpb24+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgYXJpYVNvcnQgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1zb3J0Jyk7XG5cbiAgICBpZiAoYXJpYVNvcnQgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICByZXR1cm4gJ2FzYyc7XG4gICAgfSBlbHNlIGlmIChhcmlhU29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgICByZXR1cm4gJ2Rlc2MnO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNvcnQgaGVhZGVyIGlzIGN1cnJlbnRseSBiZWluZyBzb3J0ZWQgYnkuICovXG4gIGFzeW5jIGlzQWN0aXZlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLmdldFNvcnREaXJlY3Rpb24oKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zb3J0LWhlYWRlci1kaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIENsaWNrcyB0aGUgaGVhZGVyIHRvIGNoYW5nZSBpdHMgc29ydGluZyBkaXJlY3Rpb24uIE9ubHkgd29ya3MgaWYgdGhlIGhlYWRlciBpcyBlbmFibGVkLiAqL1xuICBhc3luYyBjbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG59XG4iXX0=