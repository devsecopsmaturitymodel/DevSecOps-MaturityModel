/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A repeater that destroys views when they are removed from a
 * {@link ViewContainerRef}. When new items are inserted into the container,
 * the repeater will always construct a new embedded view for each item.
 *
 * @template T The type for the embedded view's $implicit property.
 * @template R The type for the item in each IterableDiffer change record.
 * @template C The type for the context passed to each embedded view.
 */
export class _DisposeViewRepeaterStrategy {
    applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
        changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
            let view;
            let operation;
            if (record.previousIndex == null) {
                const insertContext = itemContextFactory(record, adjustedPreviousIndex, currentIndex);
                view = viewContainerRef.createEmbeddedView(insertContext.templateRef, insertContext.context, insertContext.index);
                operation = 1 /* INSERTED */;
            }
            else if (currentIndex == null) {
                viewContainerRef.remove(adjustedPreviousIndex);
                operation = 3 /* REMOVED */;
            }
            else {
                view = viewContainerRef.get(adjustedPreviousIndex);
                viewContainerRef.move(view, currentIndex);
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
    detach() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcG9zZS12aWV3LXJlcGVhdGVyLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jb2xsZWN0aW9ucy9kaXNwb3NlLXZpZXctcmVwZWF0ZXItc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBaUJIOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxPQUFPLDRCQUE0QjtJQUd2QyxZQUFZLENBQ1YsT0FBMkIsRUFDM0IsZ0JBQWtDLEVBQ2xDLGtCQUE0RCxFQUM1RCxpQkFBdUQsRUFDdkQsZUFBZ0Q7UUFFaEQsT0FBTyxDQUFDLGdCQUFnQixDQUN0QixDQUNFLE1BQStCLEVBQy9CLHFCQUFvQyxFQUNwQyxZQUEyQixFQUMzQixFQUFFO1lBQ0YsSUFBSSxJQUFvQyxDQUFDO1lBQ3pDLElBQUksU0FBaUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO2dCQUNoQyxNQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3RGLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FDeEMsYUFBYSxDQUFDLFdBQVcsRUFDekIsYUFBYSxDQUFDLE9BQU8sRUFDckIsYUFBYSxDQUFDLEtBQUssQ0FDcEIsQ0FBQztnQkFDRixTQUFTLG1CQUFrQyxDQUFDO2FBQzdDO2lCQUFNLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtnQkFDL0IsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDLENBQUM7Z0JBQ2hELFNBQVMsa0JBQWlDLENBQUM7YUFDNUM7aUJBQU07Z0JBQ0wsSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxxQkFBc0IsQ0FBdUIsQ0FBQztnQkFDMUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDM0MsU0FBUyxnQkFBK0IsQ0FBQzthQUMxQztZQUVELElBQUksZUFBZSxFQUFFO2dCQUNuQixlQUFlLENBQUM7b0JBQ2QsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPO29CQUN0QixTQUFTO29CQUNULE1BQU07aUJBQ1AsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLEtBQUksQ0FBQztDQUNaIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSXRlcmFibGVDaGFuZ2VSZWNvcmQsXG4gIEl0ZXJhYmxlQ2hhbmdlcyxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBfVmlld1JlcGVhdGVyLFxuICBfVmlld1JlcGVhdGVySXRlbUNoYW5nZWQsXG4gIF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dCxcbiAgX1ZpZXdSZXBlYXRlckl0ZW1Db250ZXh0RmFjdG9yeSxcbiAgX1ZpZXdSZXBlYXRlckl0ZW1WYWx1ZVJlc29sdmVyLFxuICBfVmlld1JlcGVhdGVyT3BlcmF0aW9uLFxufSBmcm9tICcuL3ZpZXctcmVwZWF0ZXInO1xuXG4vKipcbiAqIEEgcmVwZWF0ZXIgdGhhdCBkZXN0cm95cyB2aWV3cyB3aGVuIHRoZXkgYXJlIHJlbW92ZWQgZnJvbSBhXG4gKiB7QGxpbmsgVmlld0NvbnRhaW5lclJlZn0uIFdoZW4gbmV3IGl0ZW1zIGFyZSBpbnNlcnRlZCBpbnRvIHRoZSBjb250YWluZXIsXG4gKiB0aGUgcmVwZWF0ZXIgd2lsbCBhbHdheXMgY29uc3RydWN0IGEgbmV3IGVtYmVkZGVkIHZpZXcgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdHlwZSBmb3IgdGhlIGVtYmVkZGVkIHZpZXcncyAkaW1wbGljaXQgcHJvcGVydHkuXG4gKiBAdGVtcGxhdGUgUiBUaGUgdHlwZSBmb3IgdGhlIGl0ZW0gaW4gZWFjaCBJdGVyYWJsZURpZmZlciBjaGFuZ2UgcmVjb3JkLlxuICogQHRlbXBsYXRlIEMgVGhlIHR5cGUgZm9yIHRoZSBjb250ZXh0IHBhc3NlZCB0byBlYWNoIGVtYmVkZGVkIHZpZXcuXG4gKi9cbmV4cG9ydCBjbGFzcyBfRGlzcG9zZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFIsIEMgZXh0ZW5kcyBfVmlld1JlcGVhdGVySXRlbUNvbnRleHQ8VD4+XG4gIGltcGxlbWVudHMgX1ZpZXdSZXBlYXRlcjxULCBSLCBDPlxue1xuICBhcHBseUNoYW5nZXMoXG4gICAgY2hhbmdlczogSXRlcmFibGVDaGFuZ2VzPFI+LFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgaXRlbUNvbnRleHRGYWN0b3J5OiBfVmlld1JlcGVhdGVySXRlbUNvbnRleHRGYWN0b3J5PFQsIFIsIEM+LFxuICAgIGl0ZW1WYWx1ZVJlc29sdmVyOiBfVmlld1JlcGVhdGVySXRlbVZhbHVlUmVzb2x2ZXI8VCwgUj4sXG4gICAgaXRlbVZpZXdDaGFuZ2VkPzogX1ZpZXdSZXBlYXRlckl0ZW1DaGFuZ2VkPFIsIEM+LFxuICApIHtcbiAgICBjaGFuZ2VzLmZvckVhY2hPcGVyYXRpb24oXG4gICAgICAoXG4gICAgICAgIHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8Uj4sXG4gICAgICAgIGFkanVzdGVkUHJldmlvdXNJbmRleDogbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgY3VycmVudEluZGV4OiBudW1iZXIgfCBudWxsLFxuICAgICAgKSA9PiB7XG4gICAgICAgIGxldCB2aWV3OiBFbWJlZGRlZFZpZXdSZWY8Qz4gfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBvcGVyYXRpb246IF9WaWV3UmVwZWF0ZXJPcGVyYXRpb247XG4gICAgICAgIGlmIChyZWNvcmQucHJldmlvdXNJbmRleCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgaW5zZXJ0Q29udGV4dCA9IGl0ZW1Db250ZXh0RmFjdG9yeShyZWNvcmQsIGFkanVzdGVkUHJldmlvdXNJbmRleCwgY3VycmVudEluZGV4KTtcbiAgICAgICAgICB2aWV3ID0gdmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcoXG4gICAgICAgICAgICBpbnNlcnRDb250ZXh0LnRlbXBsYXRlUmVmLFxuICAgICAgICAgICAgaW5zZXJ0Q29udGV4dC5jb250ZXh0LFxuICAgICAgICAgICAgaW5zZXJ0Q29udGV4dC5pbmRleCxcbiAgICAgICAgICApO1xuICAgICAgICAgIG9wZXJhdGlvbiA9IF9WaWV3UmVwZWF0ZXJPcGVyYXRpb24uSU5TRVJURUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmLnJlbW92ZShhZGp1c3RlZFByZXZpb3VzSW5kZXghKTtcbiAgICAgICAgICBvcGVyYXRpb24gPSBfVmlld1JlcGVhdGVyT3BlcmF0aW9uLlJFTU9WRUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldyA9IHZpZXdDb250YWluZXJSZWYuZ2V0KGFkanVzdGVkUHJldmlvdXNJbmRleCEpIGFzIEVtYmVkZGVkVmlld1JlZjxDPjtcbiAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmLm1vdmUodmlldyEsIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgb3BlcmF0aW9uID0gX1ZpZXdSZXBlYXRlck9wZXJhdGlvbi5NT1ZFRDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtVmlld0NoYW5nZWQpIHtcbiAgICAgICAgICBpdGVtVmlld0NoYW5nZWQoe1xuICAgICAgICAgICAgY29udGV4dDogdmlldz8uY29udGV4dCxcbiAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgZGV0YWNoKCkge31cbn1cbiJdfQ==