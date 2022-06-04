/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
/** Base class for the `MatDialogHarness` implementation. */
export class _MatDialogHarnessBase
// @breaking-change 14.0.0 change generic type to MatDialogSection.
 extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-dialog-title" /* TITLE */);
        this._content = this.locatorForOptional(".mat-dialog-content" /* CONTENT */);
        this._actions = this.locatorForOptional(".mat-dialog-actions" /* ACTIONS */);
    }
    /** Gets the id of the dialog. */
    async getId() {
        const id = await (await this.host()).getAttribute('id');
        // In case no id has been specified, the "id" property always returns
        // an empty string. To make this method more explicit, we return null.
        return id !== '' ? id : null;
    }
    /** Gets the role of the dialog. */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    async getAriaLabelledby() {
        return (await this.host()).getAttribute('aria-labelledby');
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    async getAriaDescribedby() {
        return (await this.host()).getAttribute('aria-describedby');
    }
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    async close() {
        await (await this.host()).sendKeys(TestKey.ESCAPE);
    }
    /** Gets te dialog's text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    async getTitleText() {
        return (await this._title())?.text() ?? '';
    }
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    async getContentText() {
        return (await this._content())?.text() ?? '';
    }
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    async getActionsText() {
        return (await this._actions())?.text() ?? '';
    }
}
/** Harness for interacting with a standard `MatDialog` in tests. */
export class MatDialogHarness extends _MatDialogHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDialogHarness, options);
    }
}
// Developers can provide a custom component or template for the
// dialog. The canonical dialog parent is the "MatDialogContainer".
/** The selector for the host element of a `MatDialog` instance. */
MatDialogHarness.hostSelector = '.mat-dialog-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBV2pHLDREQUE0RDtBQUM1RCxNQUFNLE9BQU8scUJBQXFCO0FBQ2hDLG1FQUFtRTtBQUNuRSxTQUFRLGdDQUEyRDtJQUZyRTs7UUFJWSxXQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixpQ0FBd0IsQ0FBQztRQUN6RCxhQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixxQ0FBMEIsQ0FBQztRQUM3RCxhQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixxQ0FBMEIsQ0FBQztJQTBEekUsQ0FBQztJQXhEQyxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLEtBQUs7UUFDVCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQscUVBQXFFO1FBQ3JFLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUErQixDQUFDO0lBQ2hGLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsS0FBSyxDQUFDLGlCQUFpQjtRQUNyQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLEtBQUssQ0FBQyxrQkFBa0I7UUFDdEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsS0FBSztRQUNULE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELDZCQUE2QjtJQUM3QixLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCw2RkFBNkY7SUFDN0YsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxpR0FBaUc7SUFDakcsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxpR0FBaUc7SUFDakcsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7Q0FDRjtBQUVELG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEscUJBQXFCO0lBTXpEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFnQyxFQUFFO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDOztBQWJELGdFQUFnRTtBQUNoRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQzVELDZCQUFZLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEaWFsb2dSb2xlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHtEaWFsb2dIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kaWFsb2ctaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIFNlbGVjdG9ycyBmb3IgZGlmZmVyZW50IHNlY3Rpb25zIG9mIHRoZSBtYXQtZGlhbG9nIHRoYXQgY2FuIGNvbnRhaW4gdXNlciBjb250ZW50LiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gTWF0RGlhbG9nU2VjdGlvbiB7XG4gIFRJVExFID0gJy5tYXQtZGlhbG9nLXRpdGxlJyxcbiAgQ09OVEVOVCA9ICcubWF0LWRpYWxvZy1jb250ZW50JyxcbiAgQUNUSU9OUyA9ICcubWF0LWRpYWxvZy1hY3Rpb25zJyxcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIHRoZSBgTWF0RGlhbG9nSGFybmVzc2AgaW1wbGVtZW50YXRpb24uICovXG5leHBvcnQgY2xhc3MgX01hdERpYWxvZ0hhcm5lc3NCYXNlXG4gIC8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIGNoYW5nZSBnZW5lcmljIHR5cGUgdG8gTWF0RGlhbG9nU2VjdGlvbi5cbiAgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxNYXREaWFsb2dTZWN0aW9uIHwgc3RyaW5nPlxue1xuICBwcm90ZWN0ZWQgX3RpdGxlID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGlhbG9nU2VjdGlvbi5USVRMRSk7XG4gIHByb3RlY3RlZCBfY29udGVudCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdERpYWxvZ1NlY3Rpb24uQ09OVEVOVCk7XG4gIHByb3RlY3RlZCBfYWN0aW9ucyA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdERpYWxvZ1NlY3Rpb24uQUNUSU9OUyk7XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgLy8gSW4gY2FzZSBubyBpZCBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBcImlkXCIgcHJvcGVydHkgYWx3YXlzIHJldHVybnNcbiAgICAvLyBhbiBlbXB0eSBzdHJpbmcuIFRvIG1ha2UgdGhpcyBtZXRob2QgbW9yZSBleHBsaWNpdCwgd2UgcmV0dXJuIG51bGwuXG4gICAgcmV0dXJuIGlkICE9PSAnJyA/IGlkIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByb2xlIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTxEaWFsb2dSb2xlIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgncm9sZScpIGFzIFByb21pc2U8RGlhbG9nUm9sZSB8IG51bGw+O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtbGFiZWxcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWxhYmVsbGVkYnlcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1kZXNjcmliZWRieVwiIGF0dHJpYnV0ZS4gKi9cbiAgYXN5bmMgZ2V0QXJpYURlc2NyaWJlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGlhbG9nIGJ5IHByZXNzaW5nIGVzY2FwZS5cbiAgICpcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3RoaW5nIGlmIGBkaXNhYmxlQ2xvc2VgIGhhcyBiZWVuIHNldCB0byBgdHJ1ZWAgZm9yIHRoZSBkaWFsb2cuXG4gICAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKFRlc3RLZXkuRVNDQVBFKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRlIGRpYWxvZydzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRpYWxvZydzIHRpdGxlIHRleHQuIFRoaXMgb25seSB3b3JrcyBpZiB0aGUgZGlhbG9nIGlzIHVzaW5nIG1hdC1kaWFsb2ctdGl0bGUuICovXG4gIGFzeW5jIGdldFRpdGxlVGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RpdGxlKCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgY29udGVudCB0ZXh0LiBUaGlzIG9ubHkgd29ya3MgaWYgdGhlIGRpYWxvZyBpcyB1c2luZyBtYXQtZGlhbG9nLWNvbnRlbnQuICovXG4gIGFzeW5jIGdldENvbnRlbnRUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY29udGVudCgpKT8udGV4dCgpID8/ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRpYWxvZydzIGFjdGlvbnMgdGV4dC4gVGhpcyBvbmx5IHdvcmtzIGlmIHRoZSBkaWFsb2cgaXMgdXNpbmcgbWF0LWRpYWxvZy1hY3Rpb25zLiAqL1xuICBhc3luYyBnZXRBY3Rpb25zVGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2FjdGlvbnMoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIGBNYXREaWFsb2dgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0hhcm5lc3MgZXh0ZW5kcyBfTWF0RGlhbG9nSGFybmVzc0Jhc2Uge1xuICAvLyBEZXZlbG9wZXJzIGNhbiBwcm92aWRlIGEgY3VzdG9tIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSBmb3IgdGhlXG4gIC8vIGRpYWxvZy4gVGhlIGNhbm9uaWNhbCBkaWFsb2cgcGFyZW50IGlzIHRoZSBcIk1hdERpYWxvZ0NvbnRhaW5lclwiLlxuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdERpYWxvZ2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kaWFsb2ctY29udGFpbmVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RGlhbG9nSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZGlhbG9nIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERpYWxvZ0hhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdERpYWxvZ0hhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RGlhbG9nSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==