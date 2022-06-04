/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
/** Harness for interacting with a standard Material calendar cell in tests. */
export class MatCalendarCellHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Reference to the inner content element inside the cell. */
        this._content = this.locatorFor('.mat-calendar-body-cell-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarCellHarness`
     * that meets certain criteria.
     * @param options Options for filtering which cell instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCalendarCellHarness, options)
            .addOption('text', options.text, (harness, text) => {
            return HarnessPredicate.stringMatches(harness.getText(), text);
        })
            .addOption('selected', options.selected, async (harness, selected) => {
            return (await harness.isSelected()) === selected;
        })
            .addOption('active', options.active, async (harness, active) => {
            return (await harness.isActive()) === active;
        })
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        })
            .addOption('today', options.today, async (harness, today) => {
            return (await harness.isToday()) === today;
        })
            .addOption('inRange', options.inRange, async (harness, inRange) => {
            return (await harness.isInRange()) === inRange;
        })
            .addOption('inComparisonRange', options.inComparisonRange, async (harness, inComparisonRange) => {
            return (await harness.isInComparisonRange()) === inComparisonRange;
        })
            .addOption('inPreviewRange', options.inPreviewRange, async (harness, inPreviewRange) => {
            return (await harness.isInPreviewRange()) === inPreviewRange;
        });
    }
    /** Gets the text of the calendar cell. */
    async getText() {
        return (await this._content()).text();
    }
    /** Gets the aria-label of the calendar cell. */
    async getAriaLabel() {
        // We're guaranteed for the `aria-label` to be defined
        // since this is a private element that we control.
        return (await this.host()).getAttribute('aria-label');
    }
    /** Whether the cell is selected. */
    async isSelected() {
        const host = await this.host();
        return (await host.getAttribute('aria-pressed')) === 'true';
    }
    /** Whether the cell is disabled. */
    async isDisabled() {
        return this._hasState('disabled');
    }
    /** Whether the cell is currently activated using keyboard navigation. */
    async isActive() {
        return this._hasState('active');
    }
    /** Whether the cell represents today's date. */
    async isToday() {
        return (await this._content()).hasClass('mat-calendar-body-today');
    }
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    async select() {
        return (await this.host()).click();
    }
    /** Hovers over the calendar cell. */
    async hover() {
        return (await this.host()).hover();
    }
    /** Moves the mouse away from the calendar cell. */
    async mouseAway() {
        return (await this.host()).mouseAway();
    }
    /** Focuses the calendar cell. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Removes focus from the calendar cell. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the cell is the start of the main range. */
    async isRangeStart() {
        return this._hasState('range-start');
    }
    /** Whether the cell is the end of the main range. */
    async isRangeEnd() {
        return this._hasState('range-end');
    }
    /** Whether the cell is part of the main range. */
    async isInRange() {
        return this._hasState('in-range');
    }
    /** Whether the cell is the start of the comparison range. */
    async isComparisonRangeStart() {
        return this._hasState('comparison-start');
    }
    /** Whether the cell is the end of the comparison range. */
    async isComparisonRangeEnd() {
        return this._hasState('comparison-end');
    }
    /** Whether the cell is inside of the comparison range. */
    async isInComparisonRange() {
        return this._hasState('in-comparison-range');
    }
    /** Whether the cell is the start of the preview range. */
    async isPreviewRangeStart() {
        return this._hasState('preview-start');
    }
    /** Whether the cell is the end of the preview range. */
    async isPreviewRangeEnd() {
        return this._hasState('preview-end');
    }
    /** Whether the cell is inside of the preview range. */
    async isInPreviewRange() {
        return this._hasState('in-preview');
    }
    /** Returns whether the cell has a particular CSS class-based state. */
    async _hasState(name) {
        return (await this.host()).hasClass(`mat-calendar-body-${name}`);
    }
}
MatCalendarCellHarness.hostSelector = '.mat-calendar-body-cell';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItY2VsbC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9jYWxlbmRhci1jZWxsLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHeEUsK0VBQStFO0FBQy9FLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFBNUQ7O1FBR0UsOERBQThEO1FBQ3RELGFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFtSnhFLENBQUM7SUFqSkM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXNDLEVBQUU7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN6RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakQsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUM7YUFDRCxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3RCxPQUFPLENBQUMs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QTBEO0lBQzFELEtBQUssQ0FBQyxtQkFBbUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsS0FBSyxDQUFDLGlCQUFpQjtRQUNyQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsdUVBQXVFO0lBQy9ELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBWTtRQUNsQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUFySk0sbUNBQVksR0FBRyx5QkFBeUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIENvbXBvbmVudEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Q2FsZW5kYXJDZWxsSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGNhbGVuZGFyIGNlbGwgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2FsZW5kYXJDZWxsSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2FsZW5kYXItYm9keS1jZWxsJztcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbm5lciBjb250ZW50IGVsZW1lbnQgaW5zaWRlIHRoZSBjZWxsLiAqL1xuICBwcml2YXRlIF9jb250ZW50ID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNhbGVuZGFyLWJvZHktY2VsbC1jb250ZW50Jyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdENhbGVuZGFyQ2VsbEhhcm5lc3NgXG4gICAqIHRoYXQgbWVldHMgY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNlbGwgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2FsZW5kYXJDZWxsSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2FsZW5kYXJDZWxsSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRDYWxlbmRhckNlbGxIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCk7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignc2VsZWN0ZWQnLCBvcHRpb25zLnNlbGVjdGVkLCBhc3luYyAoaGFybmVzcywgc2VsZWN0ZWQpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzU2VsZWN0ZWQoKSkgPT09IHNlbGVjdGVkO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ2FjdGl2ZScsIG9wdGlvbnMuYWN0aXZlLCBhc3luYyAoaGFybmVzcywgYWN0aXZlKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0FjdGl2ZSgpKSA9PT0gYWN0aXZlO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ2Rpc2FibGVkJywgb3B0aW9ucy5kaXNhYmxlZCwgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZDtcbiAgICAgIH0pXG4gICAgICAuYWRkT3B0aW9uKCd0b2RheScsIG9wdGlvbnMudG9kYXksIGFzeW5jIChoYXJuZXNzLCB0b2RheSkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNUb2RheSgpKSA9PT0gdG9kYXk7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignaW5SYW5nZScsIG9wdGlvbnMuaW5SYW5nZSwgYXN5bmMgKGhhcm5lc3MsIGluUmFuZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzSW5SYW5nZSgpKSA9PT0gaW5SYW5nZTtcbiAgICAgIH0pXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnaW5Db21wYXJpc29uUmFuZ2UnLFxuICAgICAgICBvcHRpb25zLmluQ29tcGFyaXNvblJhbmdlLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgaW5Db21wYXJpc29uUmFuZ2UpID0+IHtcbiAgICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNJbkNvbXBhcmlzb25SYW5nZSgpKSA9PT0gaW5Db21wYXJpc29uUmFuZ2U7XG4gICAgICAgIH0sXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCdpblByZXZpZXdSYW5nZScsIG9wdGlvbnMuaW5QcmV2aWV3UmFuZ2UsIGFzeW5jIChoYXJuZXNzLCBpblByZXZpZXdSYW5nZSkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNJblByZXZpZXdSYW5nZSgpKSA9PT0gaW5QcmV2aWV3UmFuZ2U7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBjYWxlbmRhciBjZWxsLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jb250ZW50KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsIG9mIHRoZSBjYWxlbmRhciBjZWxsLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBXZSdyZSBndWFyYW50ZWVkIGZvciB0aGUgYGFyaWEtbGFiZWxgIHRvIGJlIGRlZmluZWRcbiAgICAvLyBzaW5jZSB0aGlzIGlzIGEgcHJpdmF0ZSBlbGVtZW50IHRoYXQgd2UgY29udHJvbC5cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSBhcyBQcm9taXNlPHN0cmluZz47XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBzZWxlY3RlZC4gKi9cbiAgYXN5bmMgaXNTZWxlY3RlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5faGFzU3RhdGUoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBjdXJyZW50bHkgYWN0aXZhdGVkIHVzaW5nIGtleWJvYXJkIG5hdmlnYXRpb24uICovXG4gIGFzeW5jIGlzQWN0aXZlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgnYWN0aXZlJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCByZXByZXNlbnRzIHRvZGF5J3MgZGF0ZS4gKi9cbiAgYXN5bmMgaXNUb2RheSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRlbnQoKSkuaGFzQ2xhc3MoJ21hdC1jYWxlbmRhci1ib2R5LXRvZGF5Jyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgY2FsZW5kYXIgY2VsbC4gV29uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIGNlbGwgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIHNlbGVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEhvdmVycyBvdmVyIHRoZSBjYWxlbmRhciBjZWxsLiAqL1xuICBhc3luYyBob3ZlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ob3ZlcigpO1xuICB9XG5cbiAgLyoqIE1vdmVzIHRoZSBtb3VzZSBhd2F5IGZyb20gdGhlIGNhbGVuZGFyIGNlbGwuICovXG4gIGFzeW5jIG1vdXNlQXdheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5tb3VzZUF3YXkoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBjYWxlbmRhciBjZWxsLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgZm9jdXMgZnJvbSB0aGUgY2FsZW5kYXIgY2VsbC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgc3RhcnQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIGFzeW5jIGlzUmFuZ2VTdGFydCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5faGFzU3RhdGUoJ3JhbmdlLXN0YXJ0Jyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgZW5kIG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBhc3luYyBpc1JhbmdlRW5kKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgncmFuZ2UtZW5kJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBwYXJ0IG9mIHRoZSBtYWluIHJhbmdlLiAqL1xuICBhc3luYyBpc0luUmFuZ2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdpbi1yYW5nZScpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgdGhlIHN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBhc3luYyBpc0NvbXBhcmlzb25SYW5nZVN0YXJ0KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgnY29tcGFyaXNvbi1zdGFydCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgdGhlIGVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgYXN5bmMgaXNDb21wYXJpc29uUmFuZ2VFbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdjb21wYXJpc29uLWVuZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgaW5zaWRlIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBhc3luYyBpc0luQ29tcGFyaXNvblJhbmdlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgnaW4tY29tcGFyaXNvbi1yYW5nZScpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgdGhlIHN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBhc3luYyBpc1ByZXZpZXdSYW5nZVN0YXJ0KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgncHJldmlldy1zdGFydCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgdGhlIGVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgYXN5bmMgaXNQcmV2aWV3UmFuZ2VFbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdwcmV2aWV3LWVuZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgaW5zaWRlIG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBhc3luYyBpc0luUHJldmlld1JhbmdlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgnaW4tcHJldmlldycpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgd2hldGhlciB0aGUgY2VsbCBoYXMgYSBwYXJ0aWN1bGFyIENTUyBjbGFzcy1iYXNlZCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaGFzU3RhdGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoYG1hdC1jYWxlbmRhci1ib2R5LSR7bmFtZX1gKTtcbiAgfVxufVxuIl19