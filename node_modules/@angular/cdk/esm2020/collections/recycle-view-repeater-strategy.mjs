/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A repeater that caches views when they are removed from a
 * {@link ViewContainerRef}. When new items are inserted into the container,
 * the repeater will reuse one of the cached views instead of creating a new
 * embedded view. Recycling cached views reduces the quantity of expensive DOM
 * inserts.
 *
 * @template T The type for the embedded view's $implicit property.
 * @template R The type for the item in each IterableDiffer change record.
 * @template C The type for the context passed to each embedded view.
 */
export class _RecycleViewRepeaterStrategy {
    constructor() {
        /**
         * The size of the cache used to store unused views.
         * Setting the cache size to `0` will disable caching. Defaults to 20 views.
         */
        this.viewCacheSize = 20;
        /**
         * View cache that stores embedded view instances that have been previously stamped out,
         * but don't are not currently rendered. The view repeater will reuse these views rather than
         * creating brand new ones.
         *
         * TODO(michaeljamesparsons) Investigate whether using a linked list would improve performance.
         */
        this._viewCache = [];
    }
    /** Apply changes to the DOM. */
    applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
        // Rearrange the views to put them in the right location.
        changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
            let view;
            let operation;
            if (record.previousIndex == null) {
                // Item added.
                const viewArgsFactory = () => itemContextFactory(record, adjustedPreviousIndex, currentIndex);
                view = this._insertView(viewArgsFactory, currentIndex, viewContainerRef, itemValueResolver(record));
                operation = view ? 1 /* INSERTED */ : 0 /* REPLACED */;
            }
            else if (currentIndex == null) {
                // Item removed.
                this._detachAndCacheView(adjustedPreviousIndex, viewContainerRef);
                operation = 3 /* REMOVED */;
            }
            else {
                // Item moved.
                view = this._moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, itemValueResolver(record));
                operation = 2 /* MOVED */;
            }
            if (itemViewChanged) {
                itemViewChanged({
                    context: view?.context,
                    operation,
                    record,
                });
            }
        });
    }
    detach() {
        for (const view of this._viewCache) {
            view.destroy();
        }
        this._viewCache = [];
    }
    /**
     * Inserts a view for a new item, either from the cache or by creating a new
     * one. Returns `undefined` if the item was inserted into a cached view.
     */
    _insertView(viewArgsFactory, currentIndex, viewContainerRef, value) {
        const cachedView = this._insertViewFromCache(currentIndex, viewContainerRef);
        if (cachedView) {
            cachedView.context.$implicit = value;
            return undefined;
        }
        const viewArgs = viewArgsFactory();
        return viewContainerRef.createEmbeddedView(viewArgs.templateRef, viewArgs.context, viewArgs.index);
    }
    /** Detaches the view at the given index and inserts into the view cache. */
    _detachAndCacheView(index, viewContainerRef) {
        const detachedView = viewContainerRef.detach(index);
        this._maybeCacheView(detachedView, viewContainerRef);
    }
    /** Moves view at the previous index to the current index. */
    _moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, value) {
        const view = viewContainerRef.get(adjustedPreviousIndex);
        viewContainerRef.move(view, currentIndex);
        view.context.$implicit = value;
        return view;
    }
    /**
     * Cache the given detached view. If the cache is full, the view will be
     * destroyed.
     */
    _maybeCacheView(view, viewContainerRef) {
        if (this._viewCache.length < this.viewCacheSize) {
            this._viewCache.push(view);
        }
        else {
            const index = viewContainerRef.indexOf(view);
            // The host component could remove views from the container outside of
            // the view repeater. It's unlikely this will occur, but just in case,
            // destroy the view on its own, otherwise destroy it through the
            // container to ensure that all the references are removed.
            if (index === -1) {
                view.destroy();
            }
            else {
                viewContainerRef.remove(index);
            }
        }
    }
    /** Inserts a recycled view from the cache at the given index. */
    _insertViewFromCache(index, viewContainerRef) {
        const cachedView = this._viewCache.pop();
        if (cachedView) {
            viewContainerRef.insert(cachedView, index);
        }
        return cachedView || null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjeWNsZS12aWV3LXJlcGVhdGVyLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jb2xsZWN0aW9ucy9yZWN5Y2xlLXZpZXctcmVwZWF0ZXItc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBa0JIOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLE9BQU8sNEJBQTRCO0lBQXpDO1FBR0U7OztXQUdHO1FBQ0gsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFFM0I7Ozs7OztXQU1HO1FBQ0ssZUFBVSxHQUF5QixFQUFFLENBQUM7SUEySWhELENBQUM7SUF6SUMsZ0NBQWdDO0lBQ2hDLFlBQVksQ0FDVixPQUEyQixFQUMzQixnQkFBa0MsRUFDbEMsa0JBQTRELEVBQzVELGlCQUF1RCxFQUN2RCxlQUFnRDtRQUVoRCx5REFBeUQ7UUFDekQsT0FBTyxDQUFDLGdCQUFnQixDQUN0QixDQUNFLE1BQStCLEVBQy9CLHFCQUFvQyxFQUNwQyxZQUEyQixFQUMzQixFQUFFO1lBQ0YsSUFBSSxJQUFvQyxDQUFDO1lBQ3pDLElBQUksU0FBaUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO2dCQUNoQyxjQUFjO2dCQUNkLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUMzQixrQkFBa0IsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ2xFLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUNyQixlQUFlLEVBQ2YsWUFBYSxFQUNiLGdCQUFnQixFQUNoQixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FDMUIsQ0FBQztnQkFDRixTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsa0JBQWlDLENBQUMsaUJBQWdDLENBQUM7YUFDdEY7aUJBQU0sSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO2dCQUMvQixnQkFB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a0M7UUFFbEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN6QyxJQUFJLFVBQVUsRUFBRTtZQUNkLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLFVBQVUsSUFBSSxJQUFJLENBQUM7SUFDNUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSXRlcmFibGVDaGFuZ2VSZWNvcmQsXG4gIEl0ZXJhYmxlQ2hhbmdlcyxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBfVmlld1JlcGVhdGVyLFxuICBfVmlld1JlcGVhdGVySXRlbUNoYW5nZWQsXG4gIF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dCxcbiAgX1ZpZXdSZXBlYXRlckl0ZW1Db250ZXh0RmFjdG9yeSxcbiAgX1ZpZXdSZXBlYXRlckl0ZW1JbnNlcnRBcmdzLFxuICBfVmlld1JlcGVhdGVySXRlbVZhbHVlUmVzb2x2ZXIsXG4gIF9WaWV3UmVwZWF0ZXJPcGVyYXRpb24sXG59IGZyb20gJy4vdmlldy1yZXBlYXRlcic7XG5cbi8qKlxuICogQSByZXBlYXRlciB0aGF0IGNhY2hlcyB2aWV3cyB3aGVuIHRoZXkgYXJlIHJlbW92ZWQgZnJvbSBhXG4gKiB7QGxpbmsgVmlld0NvbnRhaW5lclJlZn0uIFdoZW4gbmV3IGl0ZW1zIGFyZSBpbnNlcnRlZCBpbnRvIHRoZSBjb250YWluZXIsXG4gKiB0aGUgcmVwZWF0ZXIgd2lsbCByZXVzZSBvbmUgb2YgdGhlIGNhY2hlZCB2aWV3cyBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3XG4gKiBlbWJlZGRlZCB2aWV3LiBSZWN5Y2xpbmcgY2FjaGVkIHZpZXdzIHJlZHVjZXMgdGhlIHF1YW50aXR5IG9mIGV4cGVuc2l2ZSBET01cbiAqIGluc2VydHMuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHR5cGUgZm9yIHRoZSBlbWJlZGRlZCB2aWV3J3MgJGltcGxpY2l0IHByb3BlcnR5LlxuICogQHRlbXBsYXRlIFIgVGhlIHR5cGUgZm9yIHRoZSBpdGVtIGluIGVhY2ggSXRlcmFibGVEaWZmZXIgY2hhbmdlIHJlY29yZC5cbiAqIEB0ZW1wbGF0ZSBDIFRoZSB0eXBlIGZvciB0aGUgY29udGV4dCBwYXNzZWQgdG8gZWFjaCBlbWJlZGRlZCB2aWV3LlxuICovXG5leHBvcnQgY2xhc3MgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBSLCBDIGV4dGVuZHMgX1ZpZXdSZXBlYXRlckl0ZW1Db250ZXh0PFQ+PlxuICBpbXBsZW1lbnRzIF9WaWV3UmVwZWF0ZXI8VCwgUiwgQz5cbntcbiAgLyoqXG4gICAqIFRoZSBzaXplIG9mIHRoZSBjYWNoZSB1c2VkIHRvIHN0b3JlIHVudXNlZCB2aWV3cy5cbiAgICogU2V0dGluZyB0aGUgY2FjaGUgc2l6ZSB0byBgMGAgd2lsbCBkaXNhYmxlIGNhY2hpbmcuIERlZmF1bHRzIHRvIDIwIHZpZXdzLlxuICAgKi9cbiAgdmlld0NhY2hlU2l6ZTogbnVtYmVyID0gMjA7XG5cbiAgLyoqXG4gICAqIFZpZXcgY2FjaGUgdGhhdCBzdG9yZXMgZW1iZWRkZWQgdmlldyBpbnN0YW5jZXMgdGhhdCBoYXZlIGJlZW4gcHJldmlvdXNseSBzdGFtcGVkIG91dCxcbiAgICogYnV0IGRvbid0IGFyZSBub3QgY3VycmVudGx5IHJlbmRlcmVkLiBUaGUgdmlldyByZXBlYXRlciB3aWxsIHJldXNlIHRoZXNlIHZpZXdzIHJhdGhlciB0aGFuXG4gICAqIGNyZWF0aW5nIGJyYW5kIG5ldyBvbmVzLlxuICAgKlxuICAgKiBUT0RPKG1pY2hhZWxqYW1lc3BhcnNvbnMpIEludmVzdGlnYXRlIHdoZXRoZXIgdXNpbmcgYSBsaW5rZWQgbGlzdCB3b3VsZCBpbXByb3ZlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmlld0NhY2hlOiBFbWJlZGRlZFZpZXdSZWY8Qz5bXSA9IFtdO1xuXG4gIC8qKiBBcHBseSBjaGFuZ2VzIHRvIHRoZSBET00uICovXG4gIGFwcGx5Q2hhbmdlcyhcbiAgICBjaGFuZ2VzOiBJdGVyYWJsZUNoYW5nZXM8Uj4sXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpdGVtQ29udGV4dEZhY3Rvcnk6IF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dEZhY3Rvcnk8VCwgUiwgQz4sXG4gICAgaXRlbVZhbHVlUmVzb2x2ZXI6IF9WaWV3UmVwZWF0ZXJJdGVtVmFsdWVSZXNvbHZlcjxULCBSPixcbiAgICBpdGVtVmlld0NoYW5nZWQ/OiBfVmlld1JlcGVhdGVySXRlbUNoYW5nZWQ8UiwgQz4sXG4gICkge1xuICAgIC8vIFJlYXJyYW5nZSB0aGUgdmlld3MgdG8gcHV0IHRoZW0gaW4gdGhlIHJpZ2h0IGxvY2F0aW9uLlxuICAgIGNoYW5nZXMuZm9yRWFjaE9wZXJhdGlvbihcbiAgICAgIChcbiAgICAgICAgcmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxSPixcbiAgICAgICAgYWRqdXN0ZWRQcmV2aW91c0luZGV4OiBudW1iZXIgfCBudWxsLFxuICAgICAgICBjdXJyZW50SW5kZXg6IG51bWJlciB8IG51bGwsXG4gICAgICApID0+IHtcbiAgICAgICAgbGV0IHZpZXc6IEVtYmVkZGVkVmlld1JlZjxDPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IG9wZXJhdGlvbjogX1ZpZXdSZXBlYXRlck9wZXJhdGlvbjtcbiAgICAgICAgaWYgKHJlY29yZC5wcmV2aW91c0luZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAvLyBJdGVtIGFkZGVkLlxuICAgICAgICAgIGNvbnN0IHZpZXdBcmdzRmFjdG9yeSA9ICgpID0+XG4gICAgICAgICAgICBpdGVtQ29udGV4dEZhY3RvcnkocmVjb3JkLCBhZGp1c3RlZFByZXZpb3VzSW5kZXgsIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgdmlldyA9IHRoaXMuX2luc2VydFZpZXcoXG4gICAgICAgICAgICB2aWV3QXJnc0ZhY3RvcnksXG4gICAgICAgICAgICBjdXJyZW50SW5kZXghLFxuICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgIGl0ZW1WYWx1ZVJlc29sdmVyKHJlY29yZCksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBvcGVyYXRpb24gPSB2aWV3ID8gX1ZpZXdSZXBlYXRlck9wZXJhdGlvbi5JTlNFUlRFRCA6IF9WaWV3UmVwZWF0ZXJPcGVyYXRpb24uUkVQTEFDRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAvLyBJdGVtIHJlbW92ZWQuXG4gICAgICAgICAgdGhpcy5fZGV0YWNoQW5kQ2FjaGVWaWV3KGFkanVzdGVkUHJldmlvdXNJbmRleCEsIHZpZXdDb250YWluZXJSZWYpO1xuICAgICAgICAgIG9wZXJhdGlvbiA9IF9WaWV3UmVwZWF0ZXJPcGVyYXRpb24uUkVNT1ZFRDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJdGVtIG1vdmVkLlxuICAgICAgICAgIHZpZXcgPSB0aGlzLl9tb3ZlVmlldyhcbiAgICAgICAgICAgIGFkanVzdGVkUHJldmlvdXNJbmRleCEsXG4gICAgICAgICAgICBjdXJyZW50SW5kZXghLFxuICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgIGl0ZW1WYWx1ZVJlc29sdmVyKHJlY29yZCksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBvcGVyYXRpb24gPSBfVmlld1JlcGVhdGVyT3BlcmF0aW9uLk1PVkVEO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW1WaWV3Q2hhbmdlZCkge1xuICAgICAgICAgIGl0ZW1WaWV3Q2hhbmdlZCh7XG4gICAgICAgICAgICBjb250ZXh0OiB2aWV3Py5jb250ZXh0LFxuICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgZm9yIChjb25zdCB2aWV3IG9mIHRoaXMuX3ZpZXdDYWNoZSkge1xuICAgICAgdmlldy5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuX3ZpZXdDYWNoZSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSB2aWV3IGZvciBhIG5ldyBpdGVtLCBlaXRoZXIgZnJvbSB0aGUgY2FjaGUgb3IgYnkgY3JlYXRpbmcgYSBuZXdcbiAgICogb25lLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZSBpdGVtIHdhcyBpbnNlcnRlZCBpbnRvIGEgY2FjaGVkIHZpZXcuXG4gICAqL1xuICBwcml2YXRlIF9pbnNlcnRWaWV3KFxuICAgIHZpZXdBcmdzRmFjdG9yeTogKCkgPT4gX1ZpZXdSZXBlYXRlckl0ZW1JbnNlcnRBcmdzPEM+LFxuICAgIGN1cnJlbnRJbmRleDogbnVtYmVyLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgdmFsdWU6IFQsXG4gICk6IEVtYmVkZGVkVmlld1JlZjxDPiB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY2FjaGVkVmlldyA9IHRoaXMuX2luc2VydFZpZXdGcm9tQ2FjaGUoY3VycmVudEluZGV4ISwgdmlld0NvbnRhaW5lclJlZik7XG4gICAgaWYgKGNhY2hlZFZpZXcpIHtcbiAgICAgIGNhY2hlZFZpZXcuY29udGV4dC4kaW1wbGljaXQgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgdmlld0FyZ3MgPSB2aWV3QXJnc0ZhY3RvcnkoKTtcbiAgICByZXR1cm4gdmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcoXG4gICAgICB2aWV3QXJncy50ZW1wbGF0ZVJlZixcbiAgICAgIHZpZXdBcmdzLmNvbnRleHQsXG4gICAgICB2aWV3QXJncy5pbmRleCxcbiAgICApO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoZSB2aWV3IGF0IHRoZSBnaXZlbiBpbmRleCBhbmQgaW5zZXJ0cyBpbnRvIHRoZSB2aWV3IGNhY2hlLiAqL1xuICBwcml2YXRlIF9kZXRhY2hBbmRDYWNoZVZpZXcoaW5kZXg6IG51bWJlciwgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xuICAgIGNvbnN0IGRldGFjaGVkVmlldyA9IHZpZXdDb250YWluZXJSZWYuZGV0YWNoKGluZGV4KSBhcyBFbWJlZGRlZFZpZXdSZWY8Qz47XG4gICAgdGhpcy5fbWF5YmVDYWNoZVZpZXcoZGV0YWNoZWRWaWV3LCB2aWV3Q29udGFpbmVyUmVmKTtcbiAgfVxuXG4gIC8qKiBNb3ZlcyB2aWV3IGF0IHRoZSBwcmV2aW91cyBpbmRleCB0byB0aGUgY3VycmVudCBpbmRleC4gKi9cbiAgcHJpdmF0ZSBfbW92ZVZpZXcoXG4gICAgYWRqdXN0ZWRQcmV2aW91c0luZGV4OiBudW1iZXIsXG4gICAgY3VycmVudEluZGV4OiBudW1iZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICB2YWx1ZTogVCxcbiAgKTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICBjb25zdCB2aWV3ID0gdmlld0NvbnRhaW5lclJlZi5nZXQoYWRqdXN0ZWRQcmV2aW91c0luZGV4ISkgYXMgRW1iZWRkZWRWaWV3UmVmPEM+O1xuICAgIHZpZXdDb250YWluZXJSZWYubW92ZSh2aWV3LCBjdXJyZW50SW5kZXgpO1xuICAgIHZpZXcuY29udGV4dC4kaW1wbGljaXQgPSB2YWx1ZTtcbiAgICByZXR1cm4gdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB0aGUgZ2l2ZW4gZGV0YWNoZWQgdmlldy4gSWYgdGhlIGNhY2hlIGlzIGZ1bGwsIHRoZSB2aWV3IHdpbGwgYmVcbiAgICogZGVzdHJveWVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfbWF5YmVDYWNoZVZpZXcodmlldzogRW1iZWRkZWRWaWV3UmVmPEM+LCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XG4gICAgaWYgKHRoaXMuX3ZpZXdDYWNoZS5sZW5ndGggPCB0aGlzLnZpZXdDYWNoZVNpemUpIHtcbiAgICAgIHRoaXMuX3ZpZXdDYWNoZS5wdXNoKHZpZXcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmRleCA9IHZpZXdDb250YWluZXJSZWYuaW5kZXhPZih2aWV3KTtcblxuICAgICAgLy8gVGhlIGhvc3QgY29tcG9uZW50IGNvdWxkIHJlbW92ZSB2aWV3cyBmcm9tIHRoZSBjb250YWluZXIgb3V0c2lkZSBvZlxuICAgICAgLy8gdGhlIHZpZXcgcmVwZWF0ZXIuIEl0J3MgdW5saWtlbHkgdGhpcyB3aWxsIG9jY3VyLCBidXQganVzdCBpbiBjYXNlLFxuICAgICAgLy8gZGVzdHJveSB0aGUgdmlldyBvbiBpdHMgb3duLCBvdGhlcndpc2UgZGVzdHJveSBpdCB0aHJvdWdoIHRoZVxuICAgICAgLy8gY29udGFpbmVyIHRvIGVuc3VyZSB0aGF0IGFsbCB0aGUgcmVmZXJlbmNlcyBhcmUgcmVtb3ZlZC5cbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgdmlldy5kZXN0cm95KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3Q29udGFpbmVyUmVmLnJlbW92ZShpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEluc2VydHMgYSByZWN5Y2xlZCB2aWV3IGZyb20gdGhlIGNhY2hlIGF0IHRoZSBnaXZlbiBpbmRleC4gKi9cbiAgcHJpdmF0ZSBfaW5zZXJ0Vmlld0Zyb21DYWNoZShcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICk6IEVtYmVkZGVkVmlld1JlZjxDPiB8IG51bGwge1xuICAgIGNvbnN0IGNhY2hlZFZpZXcgPSB0aGlzLl92aWV3Q2FjaGUucG9wKCk7XG4gICAgaWYgKGNhY2hlZFZpZXcpIHtcbiAgICAgIHZpZXdDb250YWluZXJSZWYuaW5zZXJ0KGNhY2hlZFZpZXcsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZFZpZXcgfHwgbnVsbDtcbiAgfVxufVxuIl19