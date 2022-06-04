/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
/** A class representing a range of dates. */
export class DateRange {
    constructor(
    /** The start date of the range. */
    start, 
    /** The end date of the range. */
    end) {
        this.start = start;
        this.end = end;
    }
}
/**
 * A selection model containing a date selection.
 * @docs-private
 */
export class MatDateSelectionModel {
    constructor(
    /** The current selection. */
    selection, _adapter) {
        this.selection = selection;
        this._adapter = _adapter;
        this._selectionChanged = new Subject();
        /** Emits when the selection has changed. */
        this.selectionChanged = this._selectionChanged;
        this.selection = selection;
    }
    /**
     * Updates the current selection in the model.
     * @param value New selection that should be assigned.
     * @param source Object that triggered the selection change.
     */
    updateSelection(value, source) {
        const oldValue = this.selection;
        this.selection = value;
        this._selectionChanged.next({ selection: value, source, oldValue });
    }
    ngOnDestroy() {
        this._selectionChanged.complete();
    }
    _isValidDateInstance(date) {
        return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
    }
}
MatDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDateSelectionModel, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
MatDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined }, { type: i1.DateAdapter }]; } });
/**
 * A selection model that contains a single date.
 * @docs-private
 */
export class MatSingleDateSelectionModel extends MatDateSelectionModel {
    constructor(adapter) {
        super(null, adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     */
    add(date) {
        super.updateSelection(date, this);
    }
    /** Checks whether the current selection is valid. */
    isValid() {
        return this.selection != null && this._isValidDateInstance(this.selection);
    }
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     */
    isComplete() {
        return this.selection != null;
    }
    /** Clones the selection model. */
    clone() {
        const clone = new MatSingleDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
MatSingleDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSingleDateSelectionModel, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
MatSingleDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSingleDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSingleDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }]; } });
/**
 * A selection model that contains a date range.
 * @docs-private
 */
export class MatRangeDateSelectionModel extends MatDateSelectionModel {
    constructor(adapter) {
        super(new DateRange(null, null), adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     */
    add(date) {
        let { start, end } = this.selection;
        if (start == null) {
            start = date;
        }
        else if (end == null) {
            end = date;
        }
        else {
            start = date;
            end = null;
        }
        super.updateSelection(new DateRange(start, end), this);
    }
    /** Checks whether the current selection is valid. */
    isValid() {
        const { start, end } = this.selection;
        // Empty ranges are valid.
        if (start == null && end == null) {
            return true;
        }
        // Complete ranges are only valid if both dates are valid and the start is before the end.
        if (start != null && end != null) {
            return (this._isValidDateInstance(start) &&
                this._isValidDateInstance(end) &&
                this._adapter.compareDate(start, end) <= 0);
        }
        // Partial ranges are valid if the start/end is valid.
        return ((start == null || this._isValidDateInstance(start)) &&
            (end == null || this._isValidDateInstance(end)));
    }
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     */
    isComplete() {
        return this.selection.start != null && this.selection.end != null;
    }
    /** Clones the selection model. */
    clone() {
        const clone = new MatRangeDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
MatRangeDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRangeDateSelectionModel, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
MatRangeDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRangeDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRangeDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }]; } });
/** @docs-private */
export function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatSingleDateSelectionModel(adapter);
}
/**
 * Used to provide a single selection model to a component.
 * @docs-private
 */
export const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/** @docs-private */
export function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new MatRangeDateSelectionModel(adapter);
}
/**
 * Used to provide a range selection model to a component.
 * @docs-private
 */
export const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: MatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), MatDateSelectionModel], DateAdapter],
    useFactory: MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7QUFFekMsNkNBQTZDO0FBQzdDLE1BQU0sT0FBTyxTQUFTO0lBUXBCO0lBQ0UsbUNBQW1DO0lBQzFCLEtBQWU7SUFDeEIsaUNBQWlDO0lBQ3hCLEdBQWE7UUFGYixVQUFLLEdBQUwsS0FBSyxDQUFVO1FBRWYsUUFBRyxHQUFILEdBQUcsQ0FBVTtJQUNyQixDQUFDO0NBQ0w7QUF1QkQ7OztHQUdHO0FBRUgsTUFBTSxPQUFnQixxQkFBcUI7SUFRekM7SUFDRSw2QkFBNkI7SUFDcEIsU0FBWSxFQUNYLFFBQXdCO1FBRHpCLGNBQVMsR0FBVCxTQUFTLENBQUc7UUFDWCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQVJuQixzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBK0IsQ0FBQztRQUVoRiw0Q0FBNEM7UUFDNUMscUJBQWdCLEdBQTRDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQU9qRixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGVBQWUsQ0FBQyxLQUFRLEVBQUUsTUFBZTtRQUN2QyxNQUFNLFFBQVEsR0FBSSxJQUF1QixDQUFDLFNBQVMsQ0FBQztRQUNuRCxJQUF1QixDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElB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Q0FBQztJQUM1RSxVQUFVLEVBQUUsdUNBQXVDO0NBQ3BELENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLHNDQUFzQyxDQUNwRCxNQUE0QyxFQUM1QyxPQUE2QjtJQUU3QixPQUFPLE1BQU0sSUFBSSxJQUFJLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSx1Q0FBdUMsR0FBb0I7SUFDdEUsT0FBTyxFQUFFLHFCQUFxQjtJQUM5QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLFdBQVcsQ0FBQztJQUM1RSxVQUFVLEVBQUUsc0NBQXNDO0NBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGYWN0b3J5UHJvdmlkZXIsIEluamVjdGFibGUsIE9wdGlvbmFsLCBTa2lwU2VsZiwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgcmFuZ2Ugb2YgZGF0ZXMuICovXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlPEQ+IHtcbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhhdCBvYmplY3RzIHdpdGggYSBgc3RhcnRgIGFuZCBgZW5kYCBwcm9wZXJ0eSBjYW4ndCBiZSBhc3NpZ25lZCB0byBhIHZhcmlhYmxlIHRoYXRcbiAgICogZXhwZWN0cyBhIGBEYXRlUmFuZ2VgXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW51c2VkLXZhcmlhYmxlXG4gIHByaXZhdGUgX2Rpc2FibGVTdHJ1Y3R1cmFsRXF1aXZhbGVuY3k6IG5ldmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgc3RhcnQgZGF0ZSBvZiB0aGUgcmFuZ2UuICovXG4gICAgcmVhZG9ubHkgc3RhcnQ6IEQgfCBudWxsLFxuICAgIC8qKiBUaGUgZW5kIGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IGVuZDogRCB8IG51bGwsXG4gICkge31cbn1cblxuLyoqXG4gKiBDb25kaXRpb25hbGx5IHBpY2tzIHRoZSBkYXRlIHR5cGUsIGlmIGEgRGF0ZVJhbmdlIGlzIHBhc3NlZCBpbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxUPiA9IFQgZXh0ZW5kcyBEYXRlUmFuZ2U8aW5mZXIgRD4gPyBEIDogTm9uTnVsbGFibGU8VD47XG5cbi8qKlxuICogRXZlbnQgZW1pdHRlZCBieSB0aGUgZGF0ZSBzZWxlY3Rpb24gbW9kZWwgd2hlbiBpdHMgc2VsZWN0aW9uIGNoYW5nZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+IHtcbiAgLyoqIE5ldyB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvbi4gKi9cbiAgc2VsZWN0aW9uOiBTO1xuXG4gIC8qKiBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIGNoYW5nZS4gKi9cbiAgc291cmNlOiB1bmtub3duO1xuXG4gIC8qKiBQcmV2aW91cyB2YWx1ZSAqL1xuICBvbGRWYWx1ZT86IFM7XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgY29udGFpbmluZyBhIGRhdGUgc2VsZWN0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBpbXBsZW1lbnRzIE9uRGVzdHJveVxue1xuICBwcml2YXRlIHJlYWRvbmx5IF9zZWxlY3Rpb25DaGFuZ2VkID0gbmV3IFN1YmplY3Q8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQuICovXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PiA9IHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQ7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uOiBTLFxuICAgIHByb3RlY3RlZCBfYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICkge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gc2VsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGluIHRoZSBtb2RlbC5cbiAgICogQHBhcmFtIHZhbHVlIE5ldyBzZWxlY3Rpb24gdGhhdCBzaG91bGQgYmUgYXNzaWduZWQuXG4gICAqIEBwYXJhbSBzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSBzZWxlY3Rpb24gY2hhbmdlLlxuICAgKi9cbiAgdXBkYXRlU2VsZWN0aW9uKHZhbHVlOiBTLCBzb3VyY2U6IHVua25vd24pIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9ICh0aGlzIGFzIHtzZWxlY3Rpb246IFN9KS5zZWxlY3Rpb247XG4gICAgKHRoaXMgYXMge3NlbGVjdGlvbjogU30pLnNlbGVjdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQubmV4dCh7c2VsZWN0aW9uOiB2YWx1ZSwgc291cmNlLCBvbGRWYWx1ZX0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkRGF0ZUluc3RhbmNlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShkYXRlKSAmJiB0aGlzLl9hZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gIH1cblxuICAvKiogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICBhYnN0cmFjdCBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGFic3RyYWN0IGlzVmFsaWQoKTogYm9vbGVhbjtcblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBpc0NvbXBsZXRlKCk6IGJvb2xlYW47XG5cbiAgLyoqIENsb25lcyB0aGUgc2VsZWN0aW9uIG1vZGVsLiAqL1xuICBhYnN0cmFjdCBjbG9uZSgpOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD47XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgdGhhdCBjb250YWlucyBhIHNpbmdsZSBkYXRlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPEQgfCBudWxsLCBEPiB7XG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgc3VwZXIobnVsbCwgYWRhcHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogc2ltcGx5IG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mIGEgc2luZ2xlIGRhdGUgc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBudWxsLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBDbG9uZXMgdGhlIHNlbGVjdGlvbiBtb2RlbC4gKi9cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY2xvbmUgPSBuZXcgTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+KHRoaXMuX2FkYXB0ZXIpO1xuICAgIGNsb25lLnVwZGF0ZVNlbGVjdGlvbih0aGlzLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgdGhhdCBjb250YWlucyBhIGRhdGUgcmFuZ2UuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbDxEPiBleHRlbmRzIE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxEYXRlUmFuZ2U8RD4sIEQ+IHtcbiAgY29uc3RydWN0b3IoYWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICBzdXBlcihuZXcgRGF0ZVJhbmdlPEQ+KG51bGwsIG51bGwpLCBhZGFwdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEluIHRoZSBjYXNlIG9mIGEgZGF0ZSByYW5nZSBzZWxlY3Rpb24sIHRoZSBhZGRlZCBkYXRlXG4gICAqIGZpbGxzIGluIHRoZSBuZXh0IGBudWxsYCB2YWx1ZSBpbiB0aGUgcmFuZ2UuIElmIGJvdGggdGhlIHN0YXJ0IGFuZCB0aGUgZW5kIGFscmVhZHkgaGF2ZSBhIGRhdGUsXG4gICAqIHRoZSBzZWxlY3Rpb24gaXMgcmVzZXQgc28gdGhhdCB0aGUgZ2l2ZW4gZGF0ZSBpcyB0aGUgbmV3IGBzdGFydGAgYW5kIHRoZSBgZW5kYCBpcyBudWxsLlxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgbGV0IHtzdGFydCwgZW5kfSA9IHRoaXMuc2VsZWN0aW9uO1xuXG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBlbmQgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IGRhdGU7XG4gICAgICBlbmQgPSBudWxsO1xuICAgIH1cblxuICAgIHN1cGVyLnVwZGF0ZVNlbGVjdGlvbihuZXcgRGF0ZVJhbmdlPEQ+KHN0YXJ0LCBlbmQpLCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICAvLyBFbXB0eSByYW5nZXMgYXJlIHZhbGlkLlxuICAgIGlmIChzdGFydCA9PSBudWxsICYmIGVuZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDb21wbGV0ZSByYW5nZXMgYXJlIG9ubHkgdmFsaWQgaWYgYm90aCBkYXRlcyBhcmUgdmFsaWQgYW5kIHRoZSBzdGFydCBpcyBiZWZvcmUgdGhlIGVuZC5cbiAgICBpZiAoc3RhcnQgIT0gbnVsbCAmJiBlbmQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkgJiZcbiAgICAgICAgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpICYmXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGUoc3RhcnQsIGVuZCkgPD0gMFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQYXJ0aWFsIHJhbmdlcyBhcmUgdmFsaWQgaWYgdGhlIHN0YXJ0L2VuZCBpcyB2YWxpZC5cbiAgICByZXR1cm4gKFxuICAgICAgKHN0YXJ0ID09IG51bGwgfHwgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShzdGFydCkpICYmXG4gICAgICAoZW5kID09IG51bGwgfHwgdGhpcy5faXNWYWxpZERhdGVJbnN0YW5jZShlbmQpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiBJbiB0aGUgY2FzZSBvZiBhIGRhdGUgcmFuZ2Ugc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhhcyBhIG5vbi1udWxsIGBzdGFydGAgYW5kIGBlbmRgLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvbi5lbmQgIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBDbG9uZXMgdGhlIHNlbGVjdGlvbiBtb2RlbC4gKi9cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY2xvbmUgPSBuZXcgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWw8RD4odGhpcy5fYWRhcHRlcik7XG4gICAgY2xvbmUudXBkYXRlU2VsZWN0aW9uKHRoaXMuc2VsZWN0aW9uLCB0aGlzKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkoXG4gIHBhcmVudDogTWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPHVua25vd24+LFxuICBhZGFwdGVyOiBEYXRlQWRhcHRlcjx1bmtub3duPixcbikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWwoYWRhcHRlcik7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgc2luZ2xlIHNlbGVjdGlvbiBtb2RlbCB0byBhIGNvbXBvbmVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsXSwgRGF0ZUFkYXB0ZXJdLFxuICB1c2VGYWN0b3J5OiBNQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlksXG59O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZKFxuICBwYXJlbnQ6IE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbDx1bmtub3duPixcbiAgYWRhcHRlcjogRGF0ZUFkYXB0ZXI8dW5rbm93bj4sXG4pIHtcbiAgcmV0dXJuIHBhcmVudCB8fCBuZXcgTWF0UmFuZ2VEYXRlU2VsZWN0aW9uTW9kZWwoYWRhcHRlcik7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgcmFuZ2Ugc2VsZWN0aW9uIG1vZGVsIHRvIGEgY29tcG9uZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlksXG59O1xuIl19