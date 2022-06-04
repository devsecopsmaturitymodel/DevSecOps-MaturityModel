/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
/**
 * Class to be used to power selecting one or more options from a list.
 */
export class SelectionModel {
    constructor(_multiple = false, initiallySelectedValues, _emitChanges = true) {
        this._multiple = _multiple;
        this._emitChanges = _emitChanges;
        /** Currently-selected values. */
        this._selection = new Set();
        /** Keeps track of the deselected options that haven't been emitted by the change event. */
        this._deselectedToEmit = [];
        /** Keeps track of the selected options that haven't been emitted by the change event. */
        this._selectedToEmit = [];
        /** Event emitted when the value has changed. */
        this.changed = new Subject();
        if (initiallySelectedValues && initiallySelectedValues.length) {
            if (_multiple) {
                initiallySelectedValues.forEach(value => this._markSelected(value));
            }
            else {
                this._markSelected(initiallySelectedValues[0]);
            }
            // Clear the array in order to avoid firing the change event for preselected values.
            this._selectedToEmit.length = 0;
        }
    }
    /** Selected values. */
    get selected() {
        if (!this._selected) {
            this._selected = Array.from(this._selection.values());
        }
        return this._selected;
    }
    /**
     * Selects a value or an array of values.
     */
    select(...values) {
        this._verifyValueAssignment(values);
        values.forEach(value => this._markSelected(value));
        this._emitChangeEvent();
    }
    /**
     * Deselects a value or an array of values.
     */
    deselect(...values) {
        this._verifyValueAssignment(values);
        values.forEach(value => this._unmarkSelected(value));
        this._emitChangeEvent();
    }
    /**
     * Toggles a value between selected and deselected.
     */
    toggle(value) {
        this.isSelected(value) ? this.deselect(value) : this.select(value);
    }
    /**
     * Clears all of the selected values.
     */
    clear() {
        this._unmarkAll();
        this._emitChangeEvent();
    }
    /**
     * Determines whether a value is selected.
     */
    isSelected(value) {
        return this._selection.has(value);
    }
    /**
     * Determines whether the model does not have a value.
     */
    isEmpty() {
        return this._selection.size === 0;
    }
    /**
     * Determines whether the model has a value.
     */
    hasValue() {
        return !this.isEmpty();
    }
    /**
     * Sorts the selected values based on a predicate function.
     */
    sort(predicate) {
        if (this._multiple && this.selected) {
            this._selected.sort(predicate);
        }
    }
    /**
     * Gets whether multiple values can be selected.
     */
    isMultipleSelection() {
        return this._multiple;
    }
    /** Emits a change event and clears the records of selected and deselected values. */
    _emitChangeEvent() {
        // Clear the selected values so they can be re-cached.
        this._selected = null;
        if (this._selectedToEmit.length || this._deselectedToEmit.length) {
            this.changed.next({
                source: this,
                added: this._selectedToEmit,
                removed: this._deselectedToEmit,
            });
            this._deselectedToEmit = [];
            this._selectedToEmit = [];
        }
    }
    /** Selects a value. */
    _markSelected(value) {
        if (!this.isSelected(value)) {
            if (!this._multiple) {
                this._unmarkAll();
            }
            this._selection.add(value);
            if (this._emitChanges) {
                this._selectedToEmit.push(value);
            }
        }
    }
    /** Deselects a value. */
    _unmarkSelected(value) {
        if (this.isSelected(value)) {
            this._selection.delete(value);
            if (this._emitChanges) {
                this._deselectedToEmit.push(value);
            }
        }
    }
    /** Clears out the selected values. */
    _unmarkAll() {
        if (!this.isEmpty()) {
            this._selection.forEach(value => this._unmarkSelected(value));
        }
    }
    /**
     * Verifies the value assignment and throws an error if the specified value array is
     * including multiple values while the selection model is not supporting multiple values.
     */
    _verifyValueAssignment(values) {
        if (values.length > 1 && !this._multiple && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMultipleValuesInSingleSelectionError();
        }
    }
}
/**
 * Returns an error that reports that multiple values are passed into a selection model
 * with a single value.
 * @docs-private
 */
export function getMultipleValuesInSingleSelectionError() {
    return Error('Cannot pass multiple values into SelectionModel with single-value mode.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jb2xsZWN0aW9ucy9zZWxlY3Rpb24tbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU3Qjs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBeUJ6QixZQUNVLFlBQVksS0FBSyxFQUN6Qix1QkFBNkIsRUFDckIsZUFBZSxJQUFJO1FBRm5CLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFFakIsaUJBQVksR0FBWixZQUFZLENBQU87UUEzQjdCLGlDQUFpQztRQUN6QixlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUssQ0FBQztRQUVsQywyRkFBMkY7UUFDbkYsc0JBQWlCLEdBQVEsRUFBRSxDQUFDO1FBRXBDLHlGQUF5RjtRQUNqRixvQkFBZSxHQUFRLEVBQUUsQ0FBQztRQWNsQyxnREFBZ0Q7UUFDdkMsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFzQixDQUFDO1FBT25ELElBQUksdUJBQXVCLElBQUksdUJBQXVCLENBQUMsTUFBTSxFQUFFO1lBQzdELElBQUksU0FBUyxFQUFFO2dCQUNiLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNyRTtpQkFBTTtnQkFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEQ7WUFFRCxvRkFBb0Y7WUFDcEYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQTNCRCx1QkFBdUI7SUFDdkIsSUFBSSxRQUFRO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN2RDtRQUVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBc0JEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLEdBQUcsTUFBVztRQUNuQixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRLENBQUMsR0FBRyxNQUFXO1FBQ3JCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxLQUFRO1FBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNILFVBQVUsQ0FBQyxLQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksQ0FBQyxTQUFrQztRQUNyQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsU0FBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILG1CQUFtQjtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELHFGQUFxRjtJQUM3RSxnQkFBZ0I7UUFDdEIsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDaEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUMzQixPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjthQUNoQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELHVCQUF1QjtJQUNmLGFBQWEsQ0FBQyxLQUFRO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDbkI7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQseUJBQXlCO0lBQ2pCLGVBQWUsQ0FBQyxLQUFRO1FBQzlCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU5QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEM7U0FDRjtJQUNILENBQUM7SUFFRCxzQ0FBc0M7SUFDOUIsVUFBVTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9EO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHNCQUFzQixDQUFDLE1BQVc7UUFDeEMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7WUFDM0YsTUFBTSx1Q0FBdUMsRUFBRSxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztDQUNGO0FBZUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSx1Q0FBdUM7SUFDckQsT0FBTyxLQUFLLENBQUMseUVBQXlFLENBQUMsQ0FBQztBQUMxRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogQ2xhc3MgdG8gYmUgdXNlZCB0byBwb3dlciBzZWxlY3Rpbmcgb25lIG9yIG1vcmUgb3B0aW9ucyBmcm9tIGEgbGlzdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbk1vZGVsPFQ+IHtcbiAgLyoqIEN1cnJlbnRseS1zZWxlY3RlZCB2YWx1ZXMuICovXG4gIHByaXZhdGUgX3NlbGVjdGlvbiA9IG5ldyBTZXQ8VD4oKTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGRlc2VsZWN0ZWQgb3B0aW9ucyB0aGF0IGhhdmVuJ3QgYmVlbiBlbWl0dGVkIGJ5IHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gIHByaXZhdGUgX2Rlc2VsZWN0ZWRUb0VtaXQ6IFRbXSA9IFtdO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucyB0aGF0IGhhdmVuJ3QgYmVlbiBlbWl0dGVkIGJ5IHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkVG9FbWl0OiBUW10gPSBbXTtcblxuICAvKiogQ2FjaGUgZm9yIHRoZSBhcnJheSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgaXRlbXMuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkOiBUW10gfCBudWxsO1xuXG4gIC8qKiBTZWxlY3RlZCB2YWx1ZXMuICovXG4gIGdldCBzZWxlY3RlZCgpOiBUW10ge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gQXJyYXkuZnJvbSh0aGlzLl9zZWxlY3Rpb24udmFsdWVzKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICByZWFkb25seSBjaGFuZ2VkID0gbmV3IFN1YmplY3Q8U2VsZWN0aW9uQ2hhbmdlPFQ+PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX211bHRpcGxlID0gZmFsc2UsXG4gICAgaW5pdGlhbGx5U2VsZWN0ZWRWYWx1ZXM/OiBUW10sXG4gICAgcHJpdmF0ZSBfZW1pdENoYW5nZXMgPSB0cnVlLFxuICApIHtcbiAgICBpZiAoaW5pdGlhbGx5U2VsZWN0ZWRWYWx1ZXMgJiYgaW5pdGlhbGx5U2VsZWN0ZWRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICBpZiAoX211bHRpcGxlKSB7XG4gICAgICAgIGluaXRpYWxseVNlbGVjdGVkVmFsdWVzLmZvckVhY2godmFsdWUgPT4gdGhpcy5fbWFya1NlbGVjdGVkKHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tYXJrU2VsZWN0ZWQoaW5pdGlhbGx5U2VsZWN0ZWRWYWx1ZXNbMF0pO1xuICAgICAgfVxuXG4gICAgICAvLyBDbGVhciB0aGUgYXJyYXkgaW4gb3JkZXIgdG8gYXZvaWQgZmlyaW5nIHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHByZXNlbGVjdGVkIHZhbHVlcy5cbiAgICAgIHRoaXMuX3NlbGVjdGVkVG9FbWl0Lmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYSB2YWx1ZSBvciBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gICAqL1xuICBzZWxlY3QoLi4udmFsdWVzOiBUW10pOiB2b2lkIHtcbiAgICB0aGlzLl92ZXJpZnlWYWx1ZUFzc2lnbm1lbnQodmFsdWVzKTtcbiAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB0aGlzLl9tYXJrU2VsZWN0ZWQodmFsdWUpKTtcbiAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgYSB2YWx1ZSBvciBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gICAqL1xuICBkZXNlbGVjdCguLi52YWx1ZXM6IFRbXSk6IHZvaWQge1xuICAgIHRoaXMuX3ZlcmlmeVZhbHVlQXNzaWdubWVudCh2YWx1ZXMpO1xuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHRoaXMuX3VubWFya1NlbGVjdGVkKHZhbHVlKSk7XG4gICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyBhIHZhbHVlIGJldHdlZW4gc2VsZWN0ZWQgYW5kIGRlc2VsZWN0ZWQuXG4gICAqL1xuICB0b2dnbGUodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmlzU2VsZWN0ZWQodmFsdWUpID8gdGhpcy5kZXNlbGVjdCh2YWx1ZSkgOiB0aGlzLnNlbGVjdCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBvZiB0aGUgc2VsZWN0ZWQgdmFsdWVzLlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy5fdW5tYXJrQWxsKCk7XG4gICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgdmFsdWUgaXMgc2VsZWN0ZWQuXG4gICAqL1xuICBpc1NlbGVjdGVkKHZhbHVlOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5oYXModmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciB0aGUgbW9kZWwgZG9lcyBub3QgaGF2ZSBhIHZhbHVlLlxuICAgKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLnNpemUgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBtb2RlbCBoYXMgYSB2YWx1ZS5cbiAgICovXG4gIGhhc1ZhbHVlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIHNlbGVjdGVkIHZhbHVlcyBiYXNlZCBvbiBhIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICovXG4gIHNvcnQocHJlZGljYXRlPzogKGE6IFQsIGI6IFQpID0+IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tdWx0aXBsZSAmJiB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCEuc29ydChwcmVkaWNhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHdoZXRoZXIgbXVsdGlwbGUgdmFsdWVzIGNhbiBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGlzTXVsdGlwbGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGFuZCBjbGVhcnMgdGhlIHJlY29yZHMgb2Ygc2VsZWN0ZWQgYW5kIGRlc2VsZWN0ZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgLy8gQ2xlYXIgdGhlIHNlbGVjdGVkIHZhbHVlcyBzbyB0aGV5IGNhbiBiZSByZS1jYWNoZWQuXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkVG9FbWl0Lmxlbmd0aCB8fCB0aGlzLl9kZXNlbGVjdGVkVG9FbWl0Lmxlbmd0aCkge1xuICAgICAgdGhpcy5jaGFuZ2VkLm5leHQoe1xuICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgIGFkZGVkOiB0aGlzLl9zZWxlY3RlZFRvRW1pdCxcbiAgICAgICAgcmVtb3ZlZDogdGhpcy5fZGVzZWxlY3RlZFRvRW1pdCxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9kZXNlbGVjdGVkVG9FbWl0ID0gW107XG4gICAgICB0aGlzLl9zZWxlY3RlZFRvRW1pdCA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGEgdmFsdWUuICovXG4gIHByaXZhdGUgX21hcmtTZWxlY3RlZCh2YWx1ZTogVCkge1xuICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKHZhbHVlKSkge1xuICAgICAgaWYgKCF0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl91bm1hcmtBbGwoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2VsZWN0aW9uLmFkZCh2YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl9lbWl0Q2hhbmdlcykge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZFRvRW1pdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRGVzZWxlY3RzIGEgdmFsdWUuICovXG4gIHByaXZhdGUgX3VubWFya1NlbGVjdGVkKHZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbi5kZWxldGUodmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5fZW1pdENoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5fZGVzZWxlY3RlZFRvRW1pdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIG91dCB0aGUgc2VsZWN0ZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF91bm1hcmtBbGwoKSB7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fc2VsZWN0aW9uLmZvckVhY2godmFsdWUgPT4gdGhpcy5fdW5tYXJrU2VsZWN0ZWQodmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZpZXMgdGhlIHZhbHVlIGFzc2lnbm1lbnQgYW5kIHRocm93cyBhbiBlcnJvciBpZiB0aGUgc3BlY2lmaWVkIHZhbHVlIGFycmF5IGlzXG4gICAqIGluY2x1ZGluZyBtdWx0aXBsZSB2YWx1ZXMgd2hpbGUgdGhlIHNlbGVjdGlvbiBtb2RlbCBpcyBub3Qgc3VwcG9ydGluZyBtdWx0aXBsZSB2YWx1ZXMuXG4gICAqL1xuICBwcml2YXRlIF92ZXJpZnlWYWx1ZUFzc2lnbm1lbnQodmFsdWVzOiBUW10pIHtcbiAgICBpZiAodmFsdWVzLmxlbmd0aCA+IDEgJiYgIXRoaXMuX211bHRpcGxlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNdWx0aXBsZVZhbHVlc0luU2luZ2xlU2VsZWN0aW9uRXJyb3IoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHZhbHVlIG9mIGEgTWF0U2VsZWN0aW9uTW9kZWwgaGFzIGNoYW5nZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uQ2hhbmdlPFQ+IHtcbiAgLyoqIE1vZGVsIHRoYXQgZGlzcGF0Y2hlZCB0aGUgZXZlbnQuICovXG4gIHNvdXJjZTogU2VsZWN0aW9uTW9kZWw8VD47XG4gIC8qKiBPcHRpb25zIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgbW9kZWwuICovXG4gIGFkZGVkOiBUW107XG4gIC8qKiBPcHRpb25zIHRoYXQgd2VyZSByZW1vdmVkIGZyb20gdGhlIG1vZGVsLiAqL1xuICByZW1vdmVkOiBUW107XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBlcnJvciB0aGF0IHJlcG9ydHMgdGhhdCBtdWx0aXBsZSB2YWx1ZXMgYXJlIHBhc3NlZCBpbnRvIGEgc2VsZWN0aW9uIG1vZGVsXG4gKiB3aXRoIGEgc2luZ2xlIHZhbHVlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlwbGVWYWx1ZXNJblNpbmdsZVNlbGVjdGlvbkVycm9yKCkge1xuICByZXR1cm4gRXJyb3IoJ0Nhbm5vdCBwYXNzIG11bHRpcGxlIHZhbHVlcyBpbnRvIFNlbGVjdGlvbk1vZGVsIHdpdGggc2luZ2xlLXZhbHVlIG1vZGUuJyk7XG59XG4iXX0=