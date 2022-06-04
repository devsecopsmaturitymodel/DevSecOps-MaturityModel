/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '../event_emitter';
import { arrayEquals, flatten } from '../util/array_utils';
import { getSymbolIterator } from '../util/symbol';
function symbolIterator() {
    return this._results[getSymbolIterator()]();
}
/**
 * An unmodifiable list of items that Angular keeps up to date when the state
 * of the application changes.
 *
 * The type of object that {@link ViewChildren}, {@link ContentChildren}, and {@link QueryList}
 * provide.
 *
 * Implements an iterable interface, therefore it can be used in both ES6
 * javascript `for (var i of items)` loops as well as in Angular templates with
 * `*ngFor="let i of myList"`.
 *
 * Changes can be observed by subscribing to the changes `Observable`.
 *
 * NOTE: In the future this class will implement an `Observable` interface.
 *
 * @usageNotes
 * ### Example
 * ```typescript
 * @Component({...})
 * class Container {
 *   @ViewChildren(Item) items:QueryList<Item>;
 * }
 * ```
 *
 * @publicApi
 */
export class QueryList {
    /**
     * @param emitDistinctChangesOnly Whether `QueryList.changes` should fire only when actual change
     *     has occurred. Or if it should fire when query is recomputed. (recomputing could resolve in
     *     the same result)
     */
    constructor(_emitDistinctChangesOnly = false) {
        this._emitDistinctChangesOnly = _emitDistinctChangesOnly;
        this.dirty = true;
        this._results = [];
        this._changesDetected = false;
        this._changes = null;
        this.length = 0;
        this.first = undefined;
        this.last = undefined;
        // This function should be declared on the prototype, but doing so there will cause the class
        // declaration to have side-effects and become not tree-shakable. For this reason we do it in
        // the constructor.
        // [getSymbolIterator()](): Iterator<T> { ... }
        const symbol = getSymbolIterator();
        const proto = QueryList.prototype;
        if (!proto[symbol])
            proto[symbol] = symbolIterator;
    }
    /**
     * Returns `Observable` of `QueryList` notifying the subscriber of changes.
     */
    get changes() {
        return this._changes || (this._changes = new EventEmitter());
    }
    /**
     * Returns the QueryList entry at `index`.
     */
    get(index) {
        return this._results[index];
    }
    /**
     * See
     * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     */
    map(fn) {
        return this._results.map(fn);
    }
    /**
     * See
     * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
     */
    filter(fn) {
        return this._results.filter(fn);
    }
    /**
     * See
     * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     */
    find(fn) {
        return this._results.find(fn);
    }
    /**
     * See
     * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
     */
    reduce(fn, init) {
        return this._results.reduce(fn, init);
    }
    /**
     * See
     * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
     */
    forEach(fn) {
        this._results.forEach(fn);
    }
    /**
     * See
     * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
     */
    some(fn) {
        return this._results.some(fn);
    }
    /**
     * Returns a copy of the internal results list as an Array.
     */
    toArray() {
        return this._results.slice();
    }
    toString() {
        return this._results.toString();
    }
    /**
     * Updates the stored data of the query list, and resets the `dirty` flag to `false`, so that
     * on change detection, it will not notify of changes to the queries, unless a new change
     * occurs.
     *
     * @param resultsTree The query results to store
     * @param identityAccessor Optional function for extracting stable object identity from a value
     *    in the array. This function is executed for each element of the query result list while
     *    comparing current query list with the new one (provided as a first argument of the `reset`
     *    function) to detect if the lists are different. If the function is not provided, elements
     *    are compared as is (without any pre-processing).
     */
    reset(resultsTree, identityAccessor) {
        // Cast to `QueryListInternal` so that we can mutate fields which are readonly for the usage of
        // QueryList (but not for QueryList itself.)
        const self = this;
        self.dirty = false;
        const newResultFlat = flatten(resultsTree);
        if (this._changesDetected = !arrayEquals(self._results, newResultFlat, identityAccessor)) {
            self._results = newResultFlat;
            self.length = newResultFlat.length;
            self.last = newResultFlat[this.length - 1];
            self.first = newResultFlat[0];
        }
    }
    /**
     * Triggers a change event by emitting on the `changes` {@link EventEmitter}.
     */
    notifyOnChanges() {
        if (this._changes && (this._changesDetected || !this._emitDistinctChangesOnly))
            this._changes.emit(this);
    }
    /** internal */
    setDirty() {
        this.dirty = true;
    }
    /** internal */
    destroy() {
        this.changes.complete();
        this.changes.unsubscribe();
    }
}
Symbol.iterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2xpbmtlci9xdWVyeV9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWpELFNBQVMsY0FBYztJQUNyQixPQUFTLElBQW9DLENBQUMsUUFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUN4RixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQWlCcEI7Ozs7T0FJRztJQUNILFlBQW9CLDJCQUFvQyxLQUFLO1FBQXpDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBaUI7UUFyQjdDLFVBQUssR0FBRyxJQUFJLENBQUM7UUFDckIsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4QixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsYUFBUSxHQUFvQyxJQUFJLENBQUM7UUFFaEQsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQU0sU0FBVSxDQUFDO1FBQ3RCLFNBQUksR0FBTSxTQUFVLENBQUM7UUFlNUIsNkZBQTZGO1FBQzdGLDZGQUE2RjtRQUM3RixtQkFBbUI7UUFDbkIsK0NBQStDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDbkMsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLFNBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcs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Q0FBQyxPQUE2QixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BELENBQUM7Q0FRRjtBQURFLE1BQU0sQ0FBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICcuLi9ldmVudF9lbWl0dGVyJztcbmltcG9ydCB7YXJyYXlFcXVhbHMsIGZsYXR0ZW59IGZyb20gJy4uL3V0aWwvYXJyYXlfdXRpbHMnO1xuaW1wb3J0IHtnZXRTeW1ib2xJdGVyYXRvcn0gZnJvbSAnLi4vdXRpbC9zeW1ib2wnO1xuXG5mdW5jdGlvbiBzeW1ib2xJdGVyYXRvcjxUPih0aGlzOiBRdWVyeUxpc3Q8VD4pOiBJdGVyYXRvcjxUPiB7XG4gIHJldHVybiAoKHRoaXMgYXMgYW55IGFzIHtfcmVzdWx0czogQXJyYXk8VD59KS5fcmVzdWx0cyBhcyBhbnkpW2dldFN5bWJvbEl0ZXJhdG9yKCldKCk7XG59XG5cbi8qKlxuICogQW4gdW5tb2RpZmlhYmxlIGxpc3Qgb2YgaXRlbXMgdGhhdCBBbmd1bGFyIGtlZXBzIHVwIHRvIGRhdGUgd2hlbiB0aGUgc3RhdGVcbiAqIG9mIHRoZSBhcHBsaWNhdGlvbiBjaGFuZ2VzLlxuICpcbiAqIFRoZSB0eXBlIG9mIG9iamVjdCB0aGF0IHtAbGluayBWaWV3Q2hpbGRyZW59LCB7QGxpbmsgQ29udGVudENoaWxkcmVufSwgYW5kIHtAbGluayBRdWVyeUxpc3R9XG4gKiBwcm92aWRlLlxuICpcbiAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgaW50ZXJmYWNlLCB0aGVyZWZvcmUgaXQgY2FuIGJlIHVzZWQgaW4gYm90aCBFUzZcbiAqIGphdmFzY3JpcHQgYGZvciAodmFyIGkgb2YgaXRlbXMpYCBsb29wcyBhcyB3ZWxsIGFzIGluIEFuZ3VsYXIgdGVtcGxhdGVzIHdpdGhcbiAqIGAqbmdGb3I9XCJsZXQgaSBvZiBteUxpc3RcImAuXG4gKlxuICogQ2hhbmdlcyBjYW4gYmUgb2JzZXJ2ZWQgYnkgc3Vic2NyaWJpbmcgdG8gdGhlIGNoYW5nZXMgYE9ic2VydmFibGVgLlxuICpcbiAqIE5PVEU6IEluIHRoZSBmdXR1cmUgdGhpcyBjbGFzcyB3aWxsIGltcGxlbWVudCBhbiBgT2JzZXJ2YWJsZWAgaW50ZXJmYWNlLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7Li4ufSlcbiAqIGNsYXNzIENvbnRhaW5lciB7XG4gKiAgIEBWaWV3Q2hpbGRyZW4oSXRlbSkgaXRlbXM6UXVlcnlMaXN0PEl0ZW0+O1xuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgUXVlcnlMaXN0PFQ+IGltcGxlbWVudHMgSXRlcmFibGU8VD4ge1xuICBwdWJsaWMgcmVhZG9ubHkgZGlydHkgPSB0cnVlO1xuICBwcml2YXRlIF9yZXN1bHRzOiBBcnJheTxUPiA9IFtdO1xuICBwcml2YXRlIF9jaGFuZ2VzRGV0ZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2hhbmdlczogRXZlbnRFbWl0dGVyPFF1ZXJ5TGlzdDxUPj58bnVsbCA9IG51bGw7XG5cbiAgcmVhZG9ubHkgbGVuZ3RoOiBudW1iZXIgPSAwO1xuICByZWFkb25seSBmaXJzdDogVCA9IHVuZGVmaW5lZCE7XG4gIHJlYWRvbmx5IGxhc3Q6IFQgPSB1bmRlZmluZWQhO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBPYnNlcnZhYmxlYCBvZiBgUXVlcnlMaXN0YCBub3RpZnlpbmcgdGhlIHN1YnNjcmliZXIgb2YgY2hhbmdlcy5cbiAgICovXG4gIGdldCBjaGFuZ2VzKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYW5nZXMgfHwgKHRoaXMuX2NoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBlbWl0RGlzdGluY3RDaGFuZ2VzT25seSBXaGV0aGVyIGBRdWVyeUxpc3QuY2hhbmdlc2Agc2hvdWxkIGZpcmUgb25seSB3aGVuIGFjdHVhbCBjaGFuZ2VcbiAgICogICAgIGhhcyBvY2N1cnJlZC4gT3IgaWYgaXQgc2hvdWxkIGZpcmUgd2hlbiBxdWVyeSBpcyByZWNvbXB1dGVkLiAocmVjb21wdXRpbmcgY291bGQgcmVzb2x2ZSBpblxuICAgKiAgICAgdGhlIHNhbWUgcmVzdWx0KVxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZW1pdERpc3RpbmN0Q2hhbmdlc09ubHk6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGRlY2xhcmVkIG9uIHRoZSBwcm90b3R5cGUsIGJ1dCBkb2luZyBzbyB0aGVyZSB3aWxsIGNhdXNlIHRoZSBjbGFzc1xuICAgIC8vIGRlY2xhcmF0aW9uIHRvIGhhdmUgc2lkZS1lZmZlY3RzIGFuZCBiZWNvbWUgbm90IHRyZWUtc2hha2FibGUuIEZvciB0aGlzIHJlYXNvbiB3ZSBkbyBpdCBpblxuICAgIC8vIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAvLyBbZ2V0U3ltYm9sSXRlcmF0b3IoKV0oKTogSXRlcmF0b3I8VD4geyAuLi4gfVxuICAgIGNvbnN0IHN5bWJvbCA9IGdldFN5bWJvbEl0ZXJhdG9yKCk7XG4gICAgY29uc3QgcHJvdG8gPSBRdWVyeUxpc3QucHJvdG90eXBlIGFzIGFueTtcbiAgICBpZiAoIXByb3RvW3N5bWJvbF0pIHByb3RvW3N5bWJvbF0gPSBzeW1ib2xJdGVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBRdWVyeUxpc3QgZW50cnkgYXQgYGluZGV4YC5cbiAgICovXG4gIGdldChpbmRleDogbnVtYmVyKTogVHx1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9yZXN1bHRzW2luZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogW0FycmF5Lm1hcF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwKVxuICAgKi9cbiAgbWFwPFU+KGZuOiAoaXRlbTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gVSk6IFVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3VsdHMubWFwKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogW0FycmF5LmZpbHRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZmlsdGVyKVxuICAgKi9cbiAgZmlsdGVyKGZuOiAoaXRlbTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gYm9vbGVhbik6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3VsdHMuZmlsdGVyKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogW0FycmF5LmZpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbmQpXG4gICAqL1xuICBmaW5kKGZuOiAoaXRlbTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gYm9vbGVhbik6IFR8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzdWx0cy5maW5kKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogW0FycmF5LnJlZHVjZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlKVxuICAgKi9cbiAgcmVkdWNlPFU+KGZuOiAocHJldlZhbHVlOiBVLCBjdXJWYWx1ZTogVCwgY3VySW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gVSwgaW5pdDogVSk6IFUge1xuICAgIHJldHVybiB0aGlzLl9yZXN1bHRzLnJlZHVjZShmbiwgaW5pdCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIFtBcnJheS5mb3JFYWNoXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoKVxuICAgKi9cbiAgZm9yRWFjaChmbjogKGl0ZW06IFQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXN1bHRzLmZvckVhY2goZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBbQXJyYXkuc29tZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvc29tZSlcbiAgICovXG4gIHNvbWUoZm46ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXN1bHRzLnNvbWUoZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCByZXN1bHRzIGxpc3QgYXMgYW4gQXJyYXkuXG4gICAqL1xuICB0b0FycmF5KCk6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3VsdHMuc2xpY2UoKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3VsdHMudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzdG9yZWQgZGF0YSBvZiB0aGUgcXVlcnkgbGlzdCwgYW5kIHJlc2V0cyB0aGUgYGRpcnR5YCBmbGFnIHRvIGBmYWxzZWAsIHNvIHRoYXRcbiAgICogb24gY2hhbmdlIGRldGVjdGlvbiwgaXQgd2lsbCBub3Qgbm90aWZ5IG9mIGNoYW5nZXMgdG8gdGhlIHF1ZXJpZXMsIHVubGVzcyBhIG5ldyBjaGFuZ2VcbiAgICogb2NjdXJzLlxuICAgKlxuICAgKiBAcGFyYW0gcmVzdWx0c1RyZWUgVGhlIHF1ZXJ5IHJlc3VsdHMgdG8gc3RvcmVcbiAgICogQHBhcmFtIGlkZW50aXR5QWNjZXNzb3IgT3B0aW9uYWwgZnVuY3Rpb24gZm9yIGV4dHJhY3Rpbmcgc3RhYmxlIG9iamVjdCBpZGVudGl0eSBmcm9tIGEgdmFsdWVcbiAgICogICAgaW4gdGhlIGFycmF5LiBUaGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGZvciBlYWNoIGVsZW1lbnQgb2YgdGhlIHF1ZXJ5IHJlc3VsdCBsaXN0IHdoaWxlXG4gICAqICAgIGNvbXBhcmluZyBjdXJyZW50IHF1ZXJ5IGxpc3Qgd2l0aCB0aGUgbmV3IG9uZSAocHJvdmlkZWQgYXMgYSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgYHJlc2V0YFxuICAgKiAgICBmdW5jdGlvbikgdG8gZGV0ZWN0IGlmIHRoZSBsaXN0cyBhcmUgZGlmZmVyZW50LiBJZiB0aGUgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLCBlbGVtZW50c1xuICAgKiAgICBhcmUgY29tcGFyZWQgYXMgaXMgKHdpdGhvdXQgYW55IHByZS1wcm9jZXNzaW5nKS5cbiAgICovXG4gIHJlc2V0KHJlc3VsdHNUcmVlOiBBcnJheTxUfGFueVtdPiwgaWRlbnRpdHlBY2Nlc3Nvcj86ICh2YWx1ZTogVCkgPT4gdW5rbm93bik6IHZvaWQge1xuICAgIC8vIENhc3QgdG8gYFF1ZXJ5TGlzdEludGVybmFsYCBzbyB0aGF0IHdlIGNhbiBtdXRhdGUgZmllbGRzIHdoaWNoIGFyZSByZWFkb25seSBmb3IgdGhlIHVzYWdlIG9mXG4gICAgLy8gUXVlcnlMaXN0IChidXQgbm90IGZvciBRdWVyeUxpc3QgaXRzZWxmLilcbiAgICBjb25zdCBzZWxmID0gdGhpcyBhcyBRdWVyeUxpc3RJbnRlcm5hbDxUPjtcbiAgICAoc2VsZiBhcyB7ZGlydHk6IGJvb2xlYW59KS5kaXJ0eSA9IGZhbHNlO1xuICAgIGNvbnN0IG5ld1Jlc3VsdEZsYXQgPSBmbGF0dGVuKHJlc3VsdHNUcmVlKTtcbiAgICBpZiAodGhpcy5fY2hhbmdlc0RldGVjdGVkID0gIWFycmF5RXF1YWxzKHNlbGYuX3Jlc3VsdHMsIG5ld1Jlc3VsdEZsYXQsIGlkZW50aXR5QWNjZXNzb3IpKSB7XG4gICAgICBzZWxmLl9yZXN1bHRzID0gbmV3UmVzdWx0RmxhdDtcbiAgICAgIHNlbGYubGVuZ3RoID0gbmV3UmVzdWx0RmxhdC5sZW5ndGg7XG4gICAgICBzZWxmLmxhc3QgPSBuZXdSZXN1bHRGbGF0W3RoaXMubGVuZ3RoIC0gMV07XG4gICAgICBzZWxmLmZpcnN0ID0gbmV3UmVzdWx0RmxhdFswXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgYSBjaGFuZ2UgZXZlbnQgYnkgZW1pdHRpbmcgb24gdGhlIGBjaGFuZ2VzYCB7QGxpbmsgRXZlbnRFbWl0dGVyfS5cbiAgICovXG4gIG5vdGlmeU9uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2hhbmdlcyAmJiAodGhpcy5fY2hhbmdlc0RldGVjdGVkIHx8ICF0aGlzLl9lbWl0RGlzdGluY3RDaGFuZ2VzT25seSkpXG4gICAgICB0aGlzLl9jaGFuZ2VzLmVtaXQodGhpcyk7XG4gIH1cblxuICAvKiogaW50ZXJuYWwgKi9cbiAgc2V0RGlydHkoKSB7XG4gICAgKHRoaXMgYXMge2RpcnR5OiBib29sZWFufSkuZGlydHkgPSB0cnVlO1xuICB9XG5cbiAgLyoqIGludGVybmFsICovXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgKHRoaXMuY2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8YW55PikuY29tcGxldGUoKTtcbiAgICAodGhpcy5jaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLy8gVGhlIGltcGxlbWVudGF0aW9uIG9mIGBTeW1ib2wuaXRlcmF0b3JgIHNob3VsZCBiZSBkZWNsYXJlZCBoZXJlLCBidXQgdGhpcyB3b3VsZCBjYXVzZVxuICAvLyB0cmVlLXNoYWtpbmcgaXNzdWVzIHdpdGggYFF1ZXJ5TGlzdC4gU28gaW5zdGVhZCwgaXQncyBhZGRlZCBpbiB0aGUgY29uc3RydWN0b3IgKHNlZSBjb21tZW50c1xuICAvLyB0aGVyZSkgYW5kIHRoaXMgZGVjbGFyYXRpb24gaXMgbGVmdCBoZXJlIHRvIGVuc3VyZSB0aGF0IFR5cGVTY3JpcHQgY29uc2lkZXJzIFF1ZXJ5TGlzdCB0b1xuICAvLyBpbXBsZW1lbnQgdGhlIEl0ZXJhYmxlIGludGVyZmFjZS4gVGhpcyBpcyByZXF1aXJlZCBmb3IgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBvZiBOZ0ZvciBsb29wc1xuICAvLyBvdmVyIFF1ZXJ5TGlzdHMgdG8gd29yayBjb3JyZWN0bHksIHNpbmNlIFF1ZXJ5TGlzdCBtdXN0IGJlIGFzc2lnbmFibGUgdG8gTmdJdGVyYWJsZS5cbiAgW1N5bWJvbC5pdGVyYXRvcl0hOiAoKSA9PiBJdGVyYXRvcjxUPjtcbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBzZXQgb2YgQVBJcyB1c2VkIGJ5IHRoZSBmcmFtZXdvcmsuIChub3QgdG8gYmUgbWFkZSBwdWJsaWMpXG4gKi9cbmludGVyZmFjZSBRdWVyeUxpc3RJbnRlcm5hbDxUPiBleHRlbmRzIFF1ZXJ5TGlzdDxUPiB7XG4gIHJlc2V0KGE6IGFueVtdKTogdm9pZDtcbiAgbm90aWZ5T25DaGFuZ2VzKCk6IHZvaWQ7XG4gIGxlbmd0aDogbnVtYmVyO1xuICBsYXN0OiBUO1xuICBmaXJzdDogVDtcbn1cbiJdfQ==