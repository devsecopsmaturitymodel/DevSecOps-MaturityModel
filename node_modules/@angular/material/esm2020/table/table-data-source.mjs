/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, combineLatest, merge, of as observableOf, Subject, } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
const MAX_SAFE_INTEGER = 9007199254740991;
/** Shared base class with MDC-based implementation. */
export class _MatTableDataSource extends DataSource {
    constructor(initialData = []) {
        super();
        /** Stream emitting render data to the table (depends on ordered data changes). */
        this._renderData = new BehaviorSubject([]);
        /** Stream that emits when a new filter string is set on the data source. */
        this._filter = new BehaviorSubject('');
        /** Used to react to internal changes of the paginator that are made by the data source itself. */
        this._internalPageChanges = new Subject();
        /**
         * Subscription to the changes that should trigger an update to the table's rendered rows, such
         * as filtering, sorting, pagination, or base data changes.
         */
        this._renderChangesSubscription = null;
        /**
         * Data accessor function that is used for accessing data properties for sorting through
         * the default sortData function.
         * This default function assumes that the sort header IDs (which defaults to the column name)
         * matches the data's properties (e.g. column Xyz represents data['Xyz']).
         * May be set to a custom function for different behavior.
         * @param data Data object that is being accessed.
         * @param sortHeaderId The name of the column that represents the data.
         */
        this.sortingDataAccessor = (data, sortHeaderId) => {
            const value = data[sortHeaderId];
            if (_isNumberValue(value)) {
                const numberValue = Number(value);
                // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
                // leave them as strings. For more info: https://goo.gl/y5vbSg
                return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
            }
            return value;
        };
        /**
         * Gets a sorted copy of the data array based on the state of the MatSort. Called
         * after changes are made to the filtered data or when sort changes are emitted from MatSort.
         * By default, the function retrieves the active sort and its direction and compares data
         * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
         * of data ordering.
         * @param data The array of data that should be sorted.
         * @param sort The connected MatSort that holds the current sort state.
         */
        this.sortData = (data, sort) => {
            const active = sort.active;
            const direction = sort.direction;
            if (!active || direction == '') {
                return data;
            }
            return data.sort((a, b) => {
                let valueA = this.sortingDataAccessor(a, active);
                let valueB = this.sortingDataAccessor(b, active);
                // If there are data in the column that can be converted to a number,
                // it must be ensured that the rest of the data
                // is of the same type so as not to order incorrectly.
                const valueAType = typeof valueA;
                const valueBType = typeof valueB;
                if (valueAType !== valueBType) {
                    if (valueAType === 'number') {
                        valueA += '';
                    }
                    if (valueBType === 'number') {
                        valueB += '';
                    }
                }
                // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
                // one value exists while the other doesn't. In this case, existing value should come last.
                // This avoids inconsistent results when comparing values to undefined/null.
                // If neither value exists, return 0 (equal).
                let comparatorResult = 0;
                if (valueA != null && valueB != null) {
                    // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                    if (valueA > valueB) {
                        comparatorResult = 1;
                    }
                    else if (valueA < valueB) {
                        comparatorResult = -1;
                    }
                }
                else if (valueA != null) {
                    comparatorResult = 1;
                }
                else if (valueB != null) {
                    comparatorResult = -1;
                }
                return comparatorResult * (direction == 'asc' ? 1 : -1);
            });
        };
        /**
         * Checks if a data object matches the data source's filter string. By default, each data object
         * is converted to a string of its properties and returns true if the filter has
         * at least one occurrence in that string. By default, the filter string has its whitespace
         * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
         * filter matching.
         * @param data Data object used to check against the filter.
         * @param filter Filter string that has been set on the data source.
         * @returns Whether the filter matches against the data
         */
        this.filterPredicate = (data, filter) => {
            // Transform the data into a lowercase string of all property values.
            const dataStr = Object.keys(data)
                .reduce((currentTerm, key) => {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                return currentTerm + data[key] + '◬';
            }, '')
                .toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };
        this._data = new BehaviorSubject(initialData);
        this._updateChangeSubscription();
    }
    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data() {
        return this._data.value;
    }
    set data(data) {
        data = Array.isArray(data) ? data : [];
        this._data.next(data);
        // Normally the `filteredData` is updated by the re-render
        // subscription, but that won't happen if it's inactive.
        if (!this._renderChangesSubscription) {
            this._filterData(data);
        }
    }
    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     */
    get filter() {
        return this._filter.value;
    }
    set filter(filter) {
        this._filter.next(filter);
        // Normally the `filteredData` is updated by the re-render
        // subscription, but that won't happen if it's inactive.
        if (!this._renderChangesSubscription) {
            this._filterData(this.data);
        }
    }
    /**
     * Instance of the MatSort directive used by the table to control its sorting. Sort changes
     * emitted by the MatSort will trigger an update to the table's rendered data.
     */
    get sort() {
        return this._sort;
    }
    set sort(sort) {
        this._sort = sort;
        this._updateChangeSubscription();
    }
    /**
     * Instance of the MatPaginator component used by the table to control what page of the data is
     * displayed. Page changes emitted by the MatPaginator will trigger an update to the
     * table's rendered data.
     *
     * Note that the data source uses the paginator's properties to calculate which page of data
     * should be displayed. If the paginator receives its properties as template inputs,
     * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
     * initialized before assigning it to this data source.
     */
    get paginator() {
        return this._paginator;
    }
    set paginator(paginator) {
        this._paginator = paginator;
        this._updateChangeSubscription();
    }
    /**
     * Subscribe to changes that should trigger an update to the table's rendered rows. When the
     * changes occur, process the current state of the filter, sort, and pagination along with
     * the provided base data and send it to the table for rendering.
     */
    _updateChangeSubscription() {
        // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
        // The events should emit whenever the component emits a change or initializes, or if no
        // component is provided, a stream with just a null event should be provided.
        // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
        // pipeline can progress to the next step. Note that the value from these streams are not used,
        // they purely act as a signal to progress in the pipeline.
        const sortChange = this._sort
            ? merge(this._sort.sortChange, this._sort.initialized)
            : observableOf(null);
        const pageChange = this._paginator
            ? merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized)
            : observableOf(null);
        const dataStream = this._data;
        // Watch for base data or filter changes to provide a filtered set of data.
        const filteredData = combineLatest([dataStream, this._filter]).pipe(map(([data]) => this._filterData(data)));
        // Watch for filtered data or sort changes to provide an ordered set of data.
        const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
        // Watch for ordered data or page changes to provide a paged set of data.
        const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));
        // Watched for paged data changes and send the result to the table to render.
        this._renderChangesSubscription?.unsubscribe();
        this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
    }
    /**
     * Returns a filtered data array where each filter object contains the filter string within
     * the result of the filterTermAccessor function. If no filter is set, returns the data array
     * as provided.
     */
    _filterData(data) {
        // If there is a filter string, filter out data that does not contain it.
        // Each data object is converted to a string using the function defined by filterTermAccessor.
        // May be overridden for customization.
        this.filteredData =
            this.filter == null || this.filter === ''
                ? data
                : data.filter(obj => this.filterPredicate(obj, this.filter));
        if (this.paginator) {
            this._updatePaginator(this.filteredData.length);
        }
        return this.filteredData;
    }
    /**
     * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
     * data array as provided. Uses the default data accessor for data lookup, unless a
     * sortDataAccessor function is defined.
     */
    _orderData(data) {
        // If there is no active sort or direction, return the data without trying to sort.
        if (!this.sort) {
            return data;
        }
        return this.sortData(data.slice(), this.sort);
    }
    /**
     * Returns a paged slice of the provided data array according to the provided MatPaginator's page
     * index and length. If there is no paginator provided, returns the data array as provided.
     */
    _pageData(data) {
        if (!this.paginator) {
            return data;
        }
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.slice(startIndex, startIndex + this.paginator.pageSize);
    }
    /**
     * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
     * index does not exceed the paginator's last page. Values are changed in a resolved promise to
     * guard against making property changes within a round of change detection.
     */
    _updatePaginator(filteredDataLength) {
        Promise.resolve().then(() => {
            const paginator = this.paginator;
            if (!paginator) {
                return;
            }
            paginator.length = filteredDataLength;
            // If the page index is set beyond the page, reduce it to the last page.
            if (paginator.pageIndex > 0) {
                const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
                const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
                if (newPageIndex !== paginator.pageIndex) {
                    paginator.pageIndex = newPageIndex;
                    // Since the paginator only emits after user-generated changes,
                    // we need our own stream so we know to should re-render the data.
                    this._internalPageChanges.next();
                }
            }
        });
    }
    /**
     * Used by the MatTable. Called when it connects to the data source.
     * @docs-private
     */
    connect() {
        if (!this._renderChangesSubscription) {
            this._updateChangeSubscription();
        }
        return this._renderData;
    }
    /**
     * Used by the MatTable. Called when it disconnects from the data source.
     * @docs-private
     */
    disconnect() {
        this._renderChangesSubscription?.unsubscribe();
        this._renderChangesSubscription = null;
    }
}
/**
 * Data source that accepts a client-side data array and includes native support of filtering,
 * sorting (using MatSort), and pagination (using MatPaginator).
 *
 * Allows for sort customization by overriding sortingDataAccessor, which defines how data
 * properties are accessed. Also allows for filter customization by overriding filterTermAccessor,
 * which defines how row data is converted to a string for filter matching.
 *
 * **Note:** This class is meant to be a simple data source to help you get started. As such
 * it isn't equipped to handle some more advanced cases like robust i18n support or server-side
 * interactions. If your app needs to support more advanced use cases, consider implementing your
 * own `DataSource`.
 */
export class MatTableDataSource extends _MatTableDataSource {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUc5QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixLQUFLLEVBRUwsRUFBRSxJQUFJLFlBQVksRUFDbEIsT0FBTyxHQUVSLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUF3QjFDLHVEQUF1RDtBQUN2RCxNQUFNLE9BQU8sbUJBR1gsU0FBUSxVQUFhO0lBME1yQixZQUFZLGNBQW1CLEVBQUU7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUF2TVYsa0ZBQWtGO1FBQ2pFLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQU0sRUFBRSxDQUFDLENBQUM7UUFFNUQsNEVBQTRFO1FBQzNELFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzRCxrR0FBa0c7UUFDakYseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCwrQkFBMEIsR0FBd0IsSUFBSSxDQUFDO1FBd0V2RDs7Ozs7Ozs7V0FRRztRQUNILHdCQUFtQixHQUF1RCxDQUN4RSxJQUFPLEVBQ1AsWUFBb0IsRUFDSCxFQUFFO1lBQ25CLE1BQU0sS0FBSyxHQUFJLElBQTZCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFM0QsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3pCLE1BQU0s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QUFNLEdBQUcsa0JBQWtCLENBQUM7WUFFdEMsd0VBQXdFO1lBQ3hFLElBQUksU0FBUyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUVsRSxJQUFJLFlBQVksS0FBSyxTQUFTLENBQUMsU0FBUyxFQUFFO29CQUN4QyxTQUFTLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztvQkFFbkMsK0RBQStEO29CQUMvRCxrRUFBa0U7b0JBQ2xFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEM7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ3BDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVO1FBQ1IsSUFBSSxDQUFDLDBCQUEwQixFQUFFLFdBQVcsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxPQUFPLGtCQUFzQixTQUFRLG1CQUFvQztDQUFHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7X2lzTnVtYmVyVmFsdWV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RhdGFTb3VyY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge01hdFBhZ2luYXRvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJztcbmltcG9ydCB7TWF0U29ydCwgU29ydH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCc7XG5pbXBvcnQge1xuICBCZWhhdmlvclN1YmplY3QsXG4gIGNvbWJpbmVMYXRlc3QsXG4gIG1lcmdlLFxuICBPYnNlcnZhYmxlLFxuICBvZiBhcyBvYnNlcnZhYmxlT2YsXG4gIFN1YmplY3QsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIENvcnJlc3BvbmRzIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuIE1vdmVkIG91dCBpbnRvIGEgdmFyaWFibGUgaGVyZSBkdWUgdG9cbiAqIGZsYWt5IGJyb3dzZXIgc3VwcG9ydCBhbmQgdGhlIHZhbHVlIG5vdCBiZWluZyBkZWZpbmVkIGluIENsb3N1cmUncyB0eXBpbmdzLlxuICovXG5jb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBtYXRjaGVzIHRoZSByZXF1aXJlZCBBUEkgcGFydHMgZm9yIHRoZSBNYXRQYWdpbmF0b3IncyBQYWdlRXZlbnQuXG4gKiBEZWNvdXBsZWQgc28gdGhhdCB1c2VycyBjYW4gZGVwZW5kIG9uIGVpdGhlciB0aGUgbGVnYWN5IG9yIE1EQy1iYXNlZCBwYWdpbmF0b3IuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VGFibGVEYXRhU291cmNlUGFnZUV2ZW50IHtcbiAgcGFnZUluZGV4OiBudW1iZXI7XG4gIHBhZ2VTaXplOiBudW1iZXI7XG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSB0aGF0IG1hdGNoZXMgdGhlIHJlcXVpcmVkIEFQSSBwYXJ0cyBvZiB0aGUgTWF0UGFnaW5hdG9yLlxuICogRGVjb3VwbGVkIHNvIHRoYXQgdXNlcnMgY2FuIGRlcGVuZCBvbiBlaXRoZXIgdGhlIGxlZ2FjeSBvciBNREMtYmFzZWQgcGFnaW5hdG9yLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2luYXRvciB7XG4gIHBhZ2U6IFN1YmplY3Q8TWF0VGFibGVEYXRhU291cmNlUGFnZUV2ZW50PjtcbiAgcGFnZUluZGV4OiBudW1iZXI7XG4gIGluaXRpYWxpemVkOiBPYnNlcnZhYmxlPHZvaWQ+O1xuICBwYWdlU2l6ZTogbnVtYmVyO1xuICBsZW5ndGg6IG51bWJlcjtcbn1cblxuLyoqIFNoYXJlZCBiYXNlIGNsYXNzIHdpdGggTURDLWJhc2VkIGltcGxlbWVudGF0aW9uLiAqL1xuZXhwb3J0IGNsYXNzIF9NYXRUYWJsZURhdGFTb3VyY2U8XG4gIFQsXG4gIFAgZXh0ZW5kcyBNYXRUYWJsZURhdGFTb3VyY2VQYWdpbmF0b3IgPSBNYXRUYWJsZURhdGFTb3VyY2VQYWdpbmF0b3IsXG4+IGV4dGVuZHMgRGF0YVNvdXJjZTxUPiB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgbmV3IGRhdGEgYXJyYXkgaXMgc2V0IG9uIHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGF0YTogQmVoYXZpb3JTdWJqZWN0PFRbXT47XG5cbiAgLyoqIFN0cmVhbSBlbWl0dGluZyByZW5kZXIgZGF0YSB0byB0aGUgdGFibGUgKGRlcGVuZHMgb24gb3JkZXJlZCBkYXRhIGNoYW5nZXMpLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZW5kZXJEYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUW10+KFtdKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBhIG5ldyBmaWx0ZXIgc3RyaW5nIGlzIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2ZpbHRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPignJyk7XG5cbiAgLyoqIFVzZWQgdG8gcmVhY3QgdG8gaW50ZXJuYWwgY2hhbmdlcyBvZiB0aGUgcGFnaW5hdG9yIHRoYXQgYXJlIG1hZGUgYnkgdGhlIGRhdGEgc291cmNlIGl0c2VsZi4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfaW50ZXJuYWxQYWdlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbiB0byB0aGUgY2hhbmdlcyB0aGF0IHNob3VsZCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCByb3dzLCBzdWNoXG4gICAqIGFzIGZpbHRlcmluZywgc29ydGluZywgcGFnaW5hdGlvbiwgb3IgYmFzZSBkYXRhIGNoYW5nZXMuXG4gICAqL1xuICBfcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBmaWx0ZXJlZCBzZXQgb2YgZGF0YSB0aGF0IGhhcyBiZWVuIG1hdGNoZWQgYnkgdGhlIGZpbHRlciBzdHJpbmcsIG9yIGFsbCB0aGUgZGF0YSBpZiB0aGVyZVxuICAgKiBpcyBubyBmaWx0ZXIuIFVzZWZ1bCBmb3Iga25vd2luZyB0aGUgc2V0IG9mIGRhdGEgdGhlIHRhYmxlIHJlcHJlc2VudHMuXG4gICAqIEZvciBleGFtcGxlLCBhICdzZWxlY3RBbGwoKScgZnVuY3Rpb24gd291bGQgbGlrZWx5IHdhbnQgdG8gc2VsZWN0IHRoZSBzZXQgb2YgZmlsdGVyZWQgZGF0YVxuICAgKiBzaG93biB0byB0aGUgdXNlciByYXRoZXIgdGhhbiBhbGwgdGhlIGRhdGEuXG4gICAqL1xuICBmaWx0ZXJlZERhdGE6IFRbXTtcblxuICAvKiogQXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBieSB0aGUgdGFibGUsIHdoZXJlIGVhY2ggb2JqZWN0IHJlcHJlc2VudHMgb25lIHJvdy4gKi9cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWU7XG4gIH1cbiAgc2V0IGRhdGEoZGF0YTogVFtdKSB7XG4gICAgZGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW107XG4gICAgdGhpcy5fZGF0YS5uZXh0KGRhdGEpO1xuICAgIC8vIE5vcm1hbGx5IHRoZSBgZmlsdGVyZWREYXRhYCBpcyB1cGRhdGVkIGJ5IHRoZSByZS1yZW5kZXJcbiAgICAvLyBzdWJzY3JpcHRpb24sIGJ1dCB0aGF0IHdvbid0IGhhcHBlbiBpZiBpdCdzIGluYWN0aXZlLlxuICAgIGlmICghdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fZmlsdGVyRGF0YShkYXRhKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIHRlcm0gdGhhdCBzaG91bGQgYmUgdXNlZCB0byBmaWx0ZXIgb3V0IG9iamVjdHMgZnJvbSB0aGUgZGF0YSBhcnJheS4gVG8gb3ZlcnJpZGUgaG93XG4gICAqIGRhdGEgb2JqZWN0cyBtYXRjaCB0byB0aGlzIGZpbHRlciBzdHJpbmcsIHByb3ZpZGUgYSBjdXN0b20gZnVuY3Rpb24gZm9yIGZpbHRlclByZWRpY2F0ZS5cbiAgICovXG4gIGdldCBmaWx0ZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyLnZhbHVlO1xuICB9XG4gIHNldCBmaWx0ZXIoZmlsdGVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9maWx0ZXIubmV4dChmaWx0ZXIpO1xuICAgIC8vIE5vcm1hbGx5IHRoZSBgZmlsdGVyZWREYXRhYCBpcyB1cGRhdGVkIGJ5IHRoZSByZS1yZW5kZXJcbiAgICAvLyBzdWJzY3JpcHRpb24sIGJ1dCB0aGF0IHdvbid0IGhhcHBlbiBpZiBpdCdzIGluYWN0aXZlLlxuICAgIGlmICghdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fZmlsdGVyRGF0YSh0aGlzLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiB0aGUgTWF0U29ydCBkaXJlY3RpdmUgdXNlZCBieSB0aGUgdGFibGUgdG8gY29udHJvbCBpdHMgc29ydGluZy4gU29ydCBjaGFuZ2VzXG4gICAqIGVtaXR0ZWQgYnkgdGhlIE1hdFNvcnQgd2lsbCB0cmlnZ2VyIGFuIHVwZGF0ZSB0byB0aGUgdGFibGUncyByZW5kZXJlZCBkYXRhLlxuICAgKi9cbiAgZ2V0IHNvcnQoKTogTWF0U29ydCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zb3J0O1xuICB9XG4gIHNldCBzb3J0KHNvcnQ6IE1hdFNvcnQgfCBudWxsKSB7XG4gICAgdGhpcy5fc29ydCA9IHNvcnQ7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc29ydDogTWF0U29ydCB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBNYXRQYWdpbmF0b3IgY29tcG9uZW50IHVzZWQgYnkgdGhlIHRhYmxlIHRvIGNvbnRyb2wgd2hhdCBwYWdlIG9mIHRoZSBkYXRhIGlzXG4gICAqIGRpc3BsYXllZC4gUGFnZSBjaGFuZ2VzIGVtaXR0ZWQgYnkgdGhlIE1hdFBhZ2luYXRvciB3aWxsIHRyaWdnZXIgYW4gdXBkYXRlIHRvIHRoZVxuICAgKiB0YWJsZSdzIHJlbmRlcmVkIGRhdGEuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgZGF0YSBzb3VyY2UgdXNlcyB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyB0byBjYWxjdWxhdGUgd2hpY2ggcGFnZSBvZiBkYXRhXG4gICAqIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIHRoZSBwYWdpbmF0b3IgcmVjZWl2ZXMgaXRzIHByb3BlcnRpZXMgYXMgdGVtcGxhdGUgaW5wdXRzLFxuICAgKiBlLmcuIGBbcGFnZUxlbmd0aF09MTAwYCBvciBgW3BhZ2VJbmRleF09MWAsIHRoZW4gYmUgc3VyZSB0aGF0IHRoZSBwYWdpbmF0b3IncyB2aWV3IGhhcyBiZWVuXG4gICAqIGluaXRpYWxpemVkIGJlZm9yZSBhc3NpZ25pbmcgaXQgdG8gdGhpcyBkYXRhIHNvdXJjZS5cbiAgICovXG4gIGdldCBwYWdpbmF0b3IoKTogUCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYWdpbmF0b3I7XG4gIH1cbiAgc2V0IHBhZ2luYXRvcihwYWdpbmF0b3I6IFAgfCBudWxsKSB7XG4gICAgdGhpcy5fcGFnaW5hdG9yID0gcGFnaW5hdG9yO1xuICAgIHRoaXMuX3VwZGF0ZUNoYW5nZVN1YnNjcmlwdGlvbigpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2luYXRvcjogUCB8IG51bGw7XG5cbiAgLyoqXG4gICAqIERhdGEgYWNjZXNzb3IgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGZvciBhY2Nlc3NpbmcgZGF0YSBwcm9wZXJ0aWVzIGZvciBzb3J0aW5nIHRocm91Z2hcbiAgICogdGhlIGRlZmF1bHQgc29ydERhdGEgZnVuY3Rpb24uXG4gICAqIFRoaXMgZGVmYXVsdCBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIHNvcnQgaGVhZGVyIElEcyAod2hpY2ggZGVmYXVsdHMgdG8gdGhlIGNvbHVtbiBuYW1lKVxuICAgKiBtYXRjaGVzIHRoZSBkYXRhJ3MgcHJvcGVydGllcyAoZS5nLiBjb2x1bW4gWHl6IHJlcHJlc2VudHMgZGF0YVsnWHl6J10pLlxuICAgKiBNYXkgYmUgc2V0IHRvIGEgY3VzdG9tIGZ1bmN0aW9uIGZvciBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgb2JqZWN0IHRoYXQgaXMgYmVpbmcgYWNjZXNzZWQuXG4gICAqIEBwYXJhbSBzb3J0SGVhZGVySWQgVGhlIG5hbWUgb2YgdGhlIGNvbHVtbiB0aGF0IHJlcHJlc2VudHMgdGhlIGRhdGEuXG4gICAqL1xuICBzb3J0aW5nRGF0YUFjY2Vzc29yOiAoZGF0YTogVCwgc29ydEhlYWRlcklkOiBzdHJpbmcpID0+IHN0cmluZyB8IG51bWJlciA9IChcbiAgICBkYXRhOiBULFxuICAgIHNvcnRIZWFkZXJJZDogc3RyaW5nLFxuICApOiBzdHJpbmcgfCBudW1iZXIgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gKGRhdGEgYXMge1trZXk6IHN0cmluZ106IGFueX0pW3NvcnRIZWFkZXJJZF07XG5cbiAgICBpZiAoX2lzTnVtYmVyVmFsdWUodmFsdWUpKSB7XG4gICAgICBjb25zdCBudW1iZXJWYWx1ZSA9IE51bWJlcih2YWx1ZSk7XG5cbiAgICAgIC8vIE51bWJlcnMgYmV5b25kIGBNQVhfU0FGRV9JTlRFR0VSYCBjYW4ndCBiZSBjb21wYXJlZCByZWxpYWJseSBzbyB3ZVxuICAgICAgLy8gbGVhdmUgdGhlbSBhcyBzdHJpbmdzLiBGb3IgbW9yZSBpbmZvOiBodHRwczovL2dvby5nbC95NXZiU2dcbiAgICAgIHJldHVybiBudW1iZXJWYWx1ZSA8IE1BWF9TQUZFX0lOVEVHRVIgPyBudW1iZXJWYWx1ZSA6IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhIGFycmF5IGJhc2VkIG9uIHRoZSBzdGF0ZSBvZiB0aGUgTWF0U29ydC4gQ2FsbGVkXG4gICAqIGFmdGVyIGNoYW5nZXMgYXJlIG1hZGUgdG8gdGhlIGZpbHRlcmVkIGRhdGEgb3Igd2hlbiBzb3J0IGNoYW5nZXMgYXJlIGVtaXR0ZWQgZnJvbSBNYXRTb3J0LlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgZnVuY3Rpb24gcmV0cmlldmVzIHRoZSBhY3RpdmUgc29ydCBhbmQgaXRzIGRpcmVjdGlvbiBhbmQgY29tcGFyZXMgZGF0YVxuICAgKiBieSByZXRyaWV2aW5nIGRhdGEgdXNpbmcgdGhlIHNvcnRpbmdEYXRhQWNjZXNzb3IuIE1heSBiZSBvdmVycmlkZGVuIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgKiBvZiBkYXRhIG9yZGVyaW5nLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgYXJyYXkgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSBzb3J0ZWQuXG4gICAqIEBwYXJhbSBzb3J0IFRoZSBjb25uZWN0ZWQgTWF0U29ydCB0aGF0IGhvbGRzIHRoZSBjdXJyZW50IHNvcnQgc3RhdGUuXG4gICAqL1xuICBzb3J0RGF0YTogKGRhdGE6IFRbXSwgc29ydDogTWF0U29ydCkgPT4gVFtdID0gKGRhdGE6IFRbXSwgc29ydDogTWF0U29ydCk6IFRbXSA9PiB7XG4gICAgY29uc3QgYWN0aXZlID0gc29ydC5hY3RpdmU7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gc29ydC5kaXJlY3Rpb247XG4gICAgaWYgKCFhY3RpdmUgfHwgZGlyZWN0aW9uID09ICcnKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBsZXQgdmFsdWVBID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGEsIGFjdGl2ZSk7XG4gICAgICBsZXQgdmFsdWVCID0gdGhpcy5zb3J0aW5nRGF0YUFjY2Vzc29yKGIsIGFjdGl2ZSk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBkYXRhIGluIHRoZSBjb2x1bW4gdGhhdCBjYW4gYmUgY29udmVydGVkIHRvIGEgbnVtYmVyLFxuICAgICAgLy8gaXQgbXVzdCBiZSBlbnN1cmVkIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGFcbiAgICAgIC8vIGlzIG9mIHRoZSBzYW1lIHR5cGUgc28gYXMgbm90IHRvIG9yZGVyIGluY29ycmVjdGx5LlxuICAgICAgY29uc3QgdmFsdWVBVHlwZSA9IHR5cGVvZiB2YWx1ZUE7XG4gICAgICBjb25zdCB2YWx1ZUJUeXBlID0gdHlwZW9mIHZhbHVlQjtcblxuICAgICAgaWYgKHZhbHVlQVR5cGUgIT09IHZhbHVlQlR5cGUpIHtcbiAgICAgICAgaWYgKHZhbHVlQVR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdmFsdWVBICs9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZUJUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHZhbHVlQiArPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBib3RoIHZhbHVlQSBhbmQgdmFsdWVCIGV4aXN0ICh0cnV0aHkpLCB0aGVuIGNvbXBhcmUgdGhlIHR3by4gT3RoZXJ3aXNlLCBjaGVjayBpZlxuICAgICAgLy8gb25lIHZhbHVlIGV4aXN0cyB3aGlsZSB0aGUgb3RoZXIgZG9lc24ndC4gSW4gdGhpcyBjYXNlLCBleGlzdGluZyB2YWx1ZSBzaG91bGQgY29tZSBsYXN0LlxuICAgICAgLy8gVGhpcyBhdm9pZHMgaW5jb25zaXN0ZW50IHJlc3VsdHMgd2hlbiBjb21wYXJpbmcgdmFsdWVzIHRvIHVuZGVmaW5lZC9udWxsLlxuICAgICAgLy8gSWYgbmVpdGhlciB2YWx1ZSBleGlzdHMsIHJldHVybiAwIChlcXVhbCkuXG4gICAgICBsZXQgY29tcGFyYXRvclJlc3VsdCA9IDA7XG4gICAgICBpZiAodmFsdWVBICE9IG51bGwgJiYgdmFsdWVCICE9IG51bGwpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgb25lIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgb3RoZXI7IGlmIGVxdWFsLCBjb21wYXJhdG9yUmVzdWx0IHNob3VsZCByZW1haW4gMC5cbiAgICAgICAgaWYgKHZhbHVlQSA+IHZhbHVlQikge1xuICAgICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlQSA8IHZhbHVlQikge1xuICAgICAgICAgIGNvbXBhcmF0b3JSZXN1bHQgPSAtMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZUEgIT0gbnVsbCkge1xuICAgICAgICBjb21wYXJhdG9yUmVzdWx0ID0gMTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWVCICE9IG51bGwpIHtcbiAgICAgICAgY29tcGFyYXRvclJlc3VsdCA9IC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tcGFyYXRvclJlc3VsdCAqIChkaXJlY3Rpb24gPT0gJ2FzYycgPyAxIDogLTEpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBkYXRhIG9iamVjdCBtYXRjaGVzIHRoZSBkYXRhIHNvdXJjZSdzIGZpbHRlciBzdHJpbmcuIEJ5IGRlZmF1bHQsIGVhY2ggZGF0YSBvYmplY3RcbiAgICogaXMgY29udmVydGVkIHRvIGEgc3RyaW5nIG9mIGl0cyBwcm9wZXJ0aWVzIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGZpbHRlciBoYXNcbiAgICogYXQgbGVhc3Qgb25lIG9jY3VycmVuY2UgaW4gdGhhdCBzdHJpbmcuIEJ5IGRlZmF1bHQsIHRoZSBmaWx0ZXIgc3RyaW5nIGhhcyBpdHMgd2hpdGVzcGFjZVxuICAgKiB0cmltbWVkIGFuZCB0aGUgbWF0Y2ggaXMgY2FzZS1pbnNlbnNpdGl2ZS4gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uIG9mXG4gICAqIGZpbHRlciBtYXRjaGluZy5cbiAgICogQHBhcmFtIGRhdGEgRGF0YSBvYmplY3QgdXNlZCB0byBjaGVjayBhZ2FpbnN0IHRoZSBmaWx0ZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgRmlsdGVyIHN0cmluZyB0aGF0IGhhcyBiZWVuIHNldCBvbiB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGZpbHRlciBtYXRjaGVzIGFnYWluc3QgdGhlIGRhdGFcbiAgICovXG4gIGZpbHRlclByZWRpY2F0ZTogKGRhdGE6IFQsIGZpbHRlcjogc3RyaW5nKSA9PiBib29sZWFuID0gKGRhdGE6IFQsIGZpbHRlcjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgLy8gVHJhbnNmb3JtIHRoZSBkYXRhIGludG8gYSBsb3dlcmNhc2Ugc3RyaW5nIG9mIGFsbCBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgY29uc3QgZGF0YVN0ciA9IE9iamVjdC5rZXlzKGRhdGEpXG4gICAgICAucmVkdWNlKChjdXJyZW50VGVybTogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAvLyBVc2UgYW4gb2JzY3VyZSBVbmljb2RlIGNoYXJhY3RlciB0byBkZWxpbWl0IHRoZSB3b3JkcyBpbiB0aGUgY29uY2F0ZW5hdGVkIHN0cmluZy5cbiAgICAgICAgLy8gVGhpcyBhdm9pZHMgbWF0Y2hlcyB3aGVyZSB0aGUgdmFsdWVzIG9mIHR3byBjb2x1bW5zIGNvbWJpbmVkIHdpbGwgbWF0Y2ggdGhlIHVzZXIncyBxdWVyeVxuICAgICAgICAvLyAoZS5nLiBgRmx1dGVgIGFuZCBgU3RvcGAgd2lsbCBtYXRjaCBgVGVzdGApLiBUaGUgY2hhcmFjdGVyIGlzIGludGVuZGVkIHRvIGJlIHNvbWV0aGluZ1xuICAgICAgICAvLyB0aGF0IGhhcyBhIHZlcnkgbG93IGNoYW5jZSBvZiBiZWluZyB0eXBlZCBpbiBieSBzb21lYm9keSBpbiBhIHRleHQgZmllbGQuIFRoaXMgb25lIGluXG4gICAgICAgIC8vIHBhcnRpY3VsYXIgaXMgXCJXaGl0ZSB1cC1wb2ludGluZyB0cmlhbmdsZSB3aXRoIGRvdFwiIGZyb21cbiAgICAgICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9Vbmljb2RlX2NoYXJhY3RlcnNcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRUZXJtICsgKGRhdGEgYXMge1trZXk6IHN0cmluZ106IGFueX0pW2tleV0gKyAn4pesJztcbiAgICAgIH0sICcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGZpbHRlciBieSBjb252ZXJ0aW5nIGl0IHRvIGxvd2VyY2FzZSBhbmQgcmVtb3Zpbmcgd2hpdGVzcGFjZS5cbiAgICBjb25zdCB0cmFuc2Zvcm1lZEZpbHRlciA9IGZpbHRlci50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiBkYXRhU3RyLmluZGV4T2YodHJhbnNmb3JtZWRGaWx0ZXIpICE9IC0xO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxEYXRhOiBUW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihpbml0aWFsRGF0YSk7XG4gICAgdGhpcy5fdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIGNoYW5nZXMgdGhhdCBzaG91bGQgdHJpZ2dlciBhbiB1cGRhdGUgdG8gdGhlIHRhYmxlJ3MgcmVuZGVyZWQgcm93cy4gV2hlbiB0aGVcbiAgICogY2hhbmdlcyBvY2N1ciwgcHJvY2VzcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZmlsdGVyLCBzb3J0LCBhbmQgcGFnaW5hdGlvbiBhbG9uZyB3aXRoXG4gICAqIHRoZSBwcm92aWRlZCBiYXNlIGRhdGEgYW5kIHNlbmQgaXQgdG8gdGhlIHRhYmxlIGZvciByZW5kZXJpbmcuXG4gICAqL1xuICBfdXBkYXRlQ2hhbmdlU3Vic2NyaXB0aW9uKCkge1xuICAgIC8vIFNvcnRpbmcgYW5kL29yIHBhZ2luYXRpb24gc2hvdWxkIGJlIHdhdGNoZWQgaWYgTWF0U29ydCBhbmQvb3IgTWF0UGFnaW5hdG9yIGFyZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgZXZlbnRzIHNob3VsZCBlbWl0IHdoZW5ldmVyIHRoZSBjb21wb25lbnQgZW1pdHMgYSBjaGFuZ2Ugb3IgaW5pdGlhbGl6ZXMsIG9yIGlmIG5vXG4gICAgLy8gY29tcG9uZW50IGlzIHByb3ZpZGVkLCBhIHN0cmVhbSB3aXRoIGp1c3QgYSBudWxsIGV2ZW50IHNob3VsZCBiZSBwcm92aWRlZC5cbiAgICAvLyBUaGUgYHNvcnRDaGFuZ2VgIGFuZCBgcGFnZUNoYW5nZWAgYWN0cyBhcyBhIHNpZ25hbCB0byB0aGUgY29tYmluZUxhdGVzdHMgYmVsb3cgc28gdGhhdCB0aGVcbiAgICAvLyBwaXBlbGluZSBjYW4gcHJvZ3Jlc3MgdG8gdGhlIG5leHQgc3RlcC4gTm90ZSB0aGF0IHRoZSB2YWx1ZSBmcm9tIHRoZXNlIHN0cmVhbXMgYXJlIG5vdCB1c2VkLFxuICAgIC8vIHRoZXkgcHVyZWx5IGFjdCBhcyBhIHNpZ25hbCB0byBwcm9ncmVzcyBpbiB0aGUgcGlwZWxpbmUuXG4gICAgY29uc3Qgc29ydENoYW5nZTogT2JzZXJ2YWJsZTxTb3J0IHwgbnVsbCB8IHZvaWQ+ID0gdGhpcy5fc29ydFxuICAgICAgPyAobWVyZ2UodGhpcy5fc29ydC5zb3J0Q2hhbmdlLCB0aGlzLl9zb3J0LmluaXRpYWxpemVkKSBhcyBPYnNlcnZhYmxlPFNvcnQgfCB2b2lkPilcbiAgICAgIDogb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgIGNvbnN0IHBhZ2VDaGFuZ2U6IE9ic2VydmFibGU8TWF0VGFibGVEYXRhU291cmNlUGFnZUV2ZW50IHwgbnVsbCB8IHZvaWQ+ID0gdGhpcy5fcGFnaW5hdG9yXG4gICAgICA/IChtZXJnZShcbiAgICAgICAgICB0aGlzLl9wYWdpbmF0b3IucGFnZSxcbiAgICAgICAgICB0aGlzLl9pbnRlcm5hbFBhZ2VDaGFuZ2VzLFxuICAgICAgICAgIHRoaXMuX3BhZ2luYXRvci5pbml0aWFsaXplZCxcbiAgICAgICAgKSBhcyBPYnNlcnZhYmxlPE1hdFRhYmxlRGF0YVNvdXJjZVBhZ2VFdmVudCB8IHZvaWQ+KVxuICAgICAgOiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgY29uc3QgZGF0YVN0cmVhbSA9IHRoaXMuX2RhdGE7XG4gICAgLy8gV2F0Y2ggZm9yIGJhc2UgZGF0YSBvciBmaWx0ZXIgY2hhbmdlcyB0byBwcm92aWRlIGEgZmlsdGVyZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gY29tYmluZUxhdGVzdChbZGF0YVN0cmVhbSwgdGhpcy5fZmlsdGVyXSkucGlwZShcbiAgICAgIG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9maWx0ZXJEYXRhKGRhdGEpKSxcbiAgICApO1xuICAgIC8vIFdhdGNoIGZvciBmaWx0ZXJlZCBkYXRhIG9yIHNvcnQgY2hhbmdlcyB0byBwcm92aWRlIGFuIG9yZGVyZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3Qgb3JkZXJlZERhdGEgPSBjb21iaW5lTGF0ZXN0KFtmaWx0ZXJlZERhdGEsIHNvcnRDaGFuZ2VdKS5waXBlKFxuICAgICAgbWFwKChbZGF0YV0pID0+IHRoaXMuX29yZGVyRGF0YShkYXRhKSksXG4gICAgKTtcbiAgICAvLyBXYXRjaCBmb3Igb3JkZXJlZCBkYXRhIG9yIHBhZ2UgY2hhbmdlcyB0byBwcm92aWRlIGEgcGFnZWQgc2V0IG9mIGRhdGEuXG4gICAgY29uc3QgcGFnaW5hdGVkRGF0YSA9IGNvbWJpbmVMYXRlc3QoW29yZGVyZWREYXRhLCBwYWdlQ2hhbmdlXSkucGlwZShcbiAgICAgIG1hcCgoW2RhdGFdKSA9PiB0aGlzLl9wYWdlRGF0YShkYXRhKSksXG4gICAgKTtcbiAgICAvLyBXYXRjaGVkIGZvciBwYWdlZCBkYXRhIGNoYW5nZXMgYW5kIHNlbmQgdGhlIHJlc3VsdCB0byB0aGUgdGFibGUgdG8gcmVuZGVyLlxuICAgIHRoaXMuX3JlbmRlckNoYW5nZXNTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IHBhZ2luYXRlZERhdGEuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5fcmVuZGVyRGF0YS5uZXh0KGRhdGEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZmlsdGVyZWQgZGF0YSBhcnJheSB3aGVyZSBlYWNoIGZpbHRlciBvYmplY3QgY29udGFpbnMgdGhlIGZpbHRlciBzdHJpbmcgd2l0aGluXG4gICAqIHRoZSByZXN1bHQgb2YgdGhlIGZpbHRlclRlcm1BY2Nlc3NvciBmdW5jdGlvbi4gSWYgbm8gZmlsdGVyIGlzIHNldCwgcmV0dXJucyB0aGUgZGF0YSBhcnJheVxuICAgKiBhcyBwcm92aWRlZC5cbiAgICovXG4gIF9maWx0ZXJEYXRhKGRhdGE6IFRbXSkge1xuICAgIC8vIElmIHRoZXJlIGlzIGEgZmlsdGVyIHN0cmluZywgZmlsdGVyIG91dCBkYXRhIHRoYXQgZG9lcyBub3QgY29udGFpbiBpdC5cbiAgICAvLyBFYWNoIGRhdGEgb2JqZWN0IGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyB1c2luZyB0aGUgZnVuY3Rpb24gZGVmaW5lZCBieSBmaWx0ZXJUZXJtQWNjZXNzb3IuXG4gICAgLy8gTWF5IGJlIG92ZXJyaWRkZW4gZm9yIGN1c3RvbWl6YXRpb24uXG4gICAgdGhpcy5maWx0ZXJlZERhdGEgPVxuICAgICAgdGhpcy5maWx0ZXIgPT0gbnVsbCB8fCB0aGlzLmZpbHRlciA9PT0gJydcbiAgICAgICAgPyBkYXRhXG4gICAgICAgIDogZGF0YS5maWx0ZXIob2JqID0+IHRoaXMuZmlsdGVyUHJlZGljYXRlKG9iaiwgdGhpcy5maWx0ZXIpKTtcblxuICAgIGlmICh0aGlzLnBhZ2luYXRvcikge1xuICAgICAgdGhpcy5fdXBkYXRlUGFnaW5hdG9yKHRoaXMuZmlsdGVyZWREYXRhLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyZWREYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzb3J0ZWQgY29weSBvZiB0aGUgZGF0YSBpZiBNYXRTb3J0IGhhcyBhIHNvcnQgYXBwbGllZCwgb3RoZXJ3aXNlIGp1c3QgcmV0dXJucyB0aGVcbiAgICogZGF0YSBhcnJheSBhcyBwcm92aWRlZC4gVXNlcyB0aGUgZGVmYXVsdCBkYXRhIGFjY2Vzc29yIGZvciBkYXRhIGxvb2t1cCwgdW5sZXNzIGFcbiAgICogc29ydERhdGFBY2Nlc3NvciBmdW5jdGlvbiBpcyBkZWZpbmVkLlxuICAgKi9cbiAgX29yZGVyRGF0YShkYXRhOiBUW10pOiBUW10ge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGFjdGl2ZSBzb3J0IG9yIGRpcmVjdGlvbiwgcmV0dXJuIHRoZSBkYXRhIHdpdGhvdXQgdHJ5aW5nIHRvIHNvcnQuXG4gICAgaWYgKCF0aGlzLnNvcnQpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNvcnREYXRhKGRhdGEuc2xpY2UoKSwgdGhpcy5zb3J0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcGFnZWQgc2xpY2Ugb2YgdGhlIHByb3ZpZGVkIGRhdGEgYXJyYXkgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlZCBNYXRQYWdpbmF0b3IncyBwYWdlXG4gICAqIGluZGV4IGFuZCBsZW5ndGguIElmIHRoZXJlIGlzIG5vIHBhZ2luYXRvciBwcm92aWRlZCwgcmV0dXJucyB0aGUgZGF0YSBhcnJheSBhcyBwcm92aWRlZC5cbiAgICovXG4gIF9wYWdlRGF0YShkYXRhOiBUW10pOiBUW10ge1xuICAgIGlmICghdGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggKiB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZTtcbiAgICByZXR1cm4gZGF0YS5zbGljZShzdGFydEluZGV4LCBzdGFydEluZGV4ICsgdGhpcy5wYWdpbmF0b3IucGFnZVNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBhZ2luYXRvciB0byByZWZsZWN0IHRoZSBsZW5ndGggb2YgdGhlIGZpbHRlcmVkIGRhdGEsIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlIHBhZ2VcbiAgICogaW5kZXggZG9lcyBub3QgZXhjZWVkIHRoZSBwYWdpbmF0b3IncyBsYXN0IHBhZ2UuIFZhbHVlcyBhcmUgY2hhbmdlZCBpbiBhIHJlc29sdmVkIHByb21pc2UgdG9cbiAgICogZ3VhcmQgYWdhaW5zdCBtYWtpbmcgcHJvcGVydHkgY2hhbmdlcyB3aXRoaW4gYSByb3VuZCBvZiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKi9cbiAgX3VwZGF0ZVBhZ2luYXRvcihmaWx0ZXJlZERhdGFMZW5ndGg6IG51bWJlcikge1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgcGFnaW5hdG9yID0gdGhpcy5wYWdpbmF0b3I7XG5cbiAgICAgIGlmICghcGFnaW5hdG9yKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcGFnaW5hdG9yLmxlbmd0aCA9IGZpbHRlcmVkRGF0YUxlbmd0aDtcblxuICAgICAgLy8gSWYgdGhlIHBhZ2UgaW5kZXggaXMgc2V0IGJleW9uZCB0aGUgcGFnZSwgcmVkdWNlIGl0IHRvIHRoZSBsYXN0IHBhZ2UuXG4gICAgICBpZiAocGFnaW5hdG9yLnBhZ2VJbmRleCA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdFBhZ2VJbmRleCA9IE1hdGguY2VpbChwYWdpbmF0b3IubGVuZ3RoIC8gcGFnaW5hdG9yLnBhZ2VTaXplKSAtIDEgfHwgMDtcbiAgICAgICAgY29uc3QgbmV3UGFnZUluZGV4ID0gTWF0aC5taW4ocGFnaW5hdG9yLnBhZ2VJbmRleCwgbGFzdFBhZ2VJbmRleCk7XG5cbiAgICAgICAgaWYgKG5ld1BhZ2VJbmRleCAhPT0gcGFnaW5hdG9yLnBhZ2VJbmRleCkge1xuICAgICAgICAgIHBhZ2luYXRvci5wYWdlSW5kZXggPSBuZXdQYWdlSW5kZXg7XG5cbiAgICAgICAgICAvLyBTaW5jZSB0aGUgcGFnaW5hdG9yIG9ubHkgZW1pdHMgYWZ0ZXIgdXNlci1nZW5lcmF0ZWQgY2hhbmdlcyxcbiAgICAgICAgICAvLyB3ZSBuZWVkIG91ciBvd24gc3RyZWFtIHNvIHdlIGtub3cgdG8gc2hvdWxkIHJlLXJlbmRlciB0aGUgZGF0YS5cbiAgICAgICAgICB0aGlzLl9pbnRlcm5hbFBhZ2VDaGFuZ2VzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIE1hdFRhYmxlLiBDYWxsZWQgd2hlbiBpdCBjb25uZWN0cyB0byB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl91cGRhdGVDaGFuZ2VTdWJzY3JpcHRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IHRoZSBNYXRUYWJsZS4gQ2FsbGVkIHdoZW4gaXQgZGlzY29ubmVjdHMgZnJvbSB0aGUgZGF0YSBzb3VyY2UuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5fcmVuZGVyQ2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9yZW5kZXJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIERhdGEgc291cmNlIHRoYXQgYWNjZXB0cyBhIGNsaWVudC1zaWRlIGRhdGEgYXJyYXkgYW5kIGluY2x1ZGVzIG5hdGl2ZSBzdXBwb3J0IG9mIGZpbHRlcmluZyxcbiAqIHNvcnRpbmcgKHVzaW5nIE1hdFNvcnQpLCBhbmQgcGFnaW5hdGlvbiAodXNpbmcgTWF0UGFnaW5hdG9yKS5cbiAqXG4gKiBBbGxvd3MgZm9yIHNvcnQgY3VzdG9taXphdGlvbiBieSBvdmVycmlkaW5nIHNvcnRpbmdEYXRhQWNjZXNzb3IsIHdoaWNoIGRlZmluZXMgaG93IGRhdGFcbiAqIHByb3BlcnRpZXMgYXJlIGFjY2Vzc2VkLiBBbHNvIGFsbG93cyBmb3IgZmlsdGVyIGN1c3RvbWl6YXRpb24gYnkgb3ZlcnJpZGluZyBmaWx0ZXJUZXJtQWNjZXNzb3IsXG4gKiB3aGljaCBkZWZpbmVzIGhvdyByb3cgZGF0YSBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgZm9yIGZpbHRlciBtYXRjaGluZy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBjbGFzcyBpcyBtZWFudCB0byBiZSBhIHNpbXBsZSBkYXRhIHNvdXJjZSB0byBoZWxwIHlvdSBnZXQgc3RhcnRlZC4gQXMgc3VjaFxuICogaXQgaXNuJ3QgZXF1aXBwZWQgdG8gaGFuZGxlIHNvbWUgbW9yZSBhZHZhbmNlZCBjYXNlcyBsaWtlIHJvYnVzdCBpMThuIHN1cHBvcnQgb3Igc2VydmVyLXNpZGVcbiAqIGludGVyYWN0aW9ucy4gSWYgeW91ciBhcHAgbmVlZHMgdG8gc3VwcG9ydCBtb3JlIGFkdmFuY2VkIHVzZSBjYXNlcywgY29uc2lkZXIgaW1wbGVtZW50aW5nIHlvdXJcbiAqIG93biBgRGF0YVNvdXJjZWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJsZURhdGFTb3VyY2U8VD4gZXh0ZW5kcyBfTWF0VGFibGVEYXRhU291cmNlPFQsIE1hdFBhZ2luYXRvcj4ge31cbiJdfQ==