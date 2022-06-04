/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isObservable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { BaseTreeControl } from './base-tree-control';
/** Nested tree control. Able to expand/collapse a subtree recursively for NestedNode type. */
export class NestedTreeControl extends BaseTreeControl {
    /** Construct with nested tree function getChildren. */
    constructor(getChildren, options) {
        super();
        this.getChildren = getChildren;
        this.options = options;
        if (this.options) {
            this.trackBy = this.options.trackBy;
        }
    }
    /**
     * Expands all dataNodes in the tree.
     *
     * To make this working, the `dataNodes` variable of the TreeControl must be set to all root level
     * data nodes of the tree.
     */
    expandAll() {
        this.expansionModel.clear();
        const allNodes = this.dataNodes.reduce((accumulator, dataNode) => [...accumulator, ...this.getDescendants(dataNode), dataNode], []);
        this.expansionModel.select(...allNodes.map(node => this._trackByValue(node)));
    }
    /** Gets a list of descendant dataNodes of a subtree rooted at given data node recursively. */
    getDescendants(dataNode) {
        const descendants = [];
        this._getDescendants(descendants, dataNode);
        // Remove the node itself
        return descendants.splice(1);
    }
    /** A helper function to get descendants recursively. */
    _getDescendants(descendants, dataNode) {
        descendants.push(dataNode);
        const childrenNodes = this.getChildren(dataNode);
        if (Array.isArray(childrenNodes)) {
            childrenNodes.forEach((child) => this._getDescendants(descendants, child));
        }
        else if (isObservable(childrenNodes)) {
            // TypeScript as of version 3.5 doesn't seem to treat `Boolean` like a function that
            // returns a `boolean` specifically in the context of `filter`, so we manually clarify that.
            childrenNodes.pipe(take(1), filter(Boolean)).subscribe(children => {
                for (const child of children) {
                    this._getDescendants(descendants, child);
                }
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXRyZWUtY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdHJlZS9jb250cm9sL25lc3RlZC10cmVlLWNvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFhLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQU9wRCw4RkFBOEY7QUFDOUYsTUFBTSxPQUFPLGlCQUE0QixTQUFRLGVBQXFCO0lBQ3BFLHVEQUF1RDtJQUN2RCxZQUNrQixXQUFzRSxFQUMvRSxPQUF3QztRQUUvQyxLQUFLLEVBQUUsQ0FBQztRQUhRLGdCQUFXLEdBQVgsV0FBVyxDQUEyRDtRQUMvRSxZQUFPLEdBQVAsT0FBTyxDQUFpQztRQUkvQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFNBQVM7UUFDUCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNwQyxDQUFDLFdBQWdCLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsRUFDNUYsRUFBRSxDQUNILENBQUM7UUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsOEZBQThGO0lBQzlGLGNBQWMsQ0FBQyxRQUFXO1FBQ3hCLE1BQU0sV0FBVyxHQUFRLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1Qyx5QkFBeUI7UUFDekIsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx3REFBd0Q7SUFDOUMsZUFBZSxDQUFDLFdBQWdCLEVBQUUsUUFBVztRQUNyRCxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2hDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0U7YUFBTSxJQUFJLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0QyxvRkFBb0Y7WUFDcEYsNEZBQTRGO1lBQzVGLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUF3QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2pGLEtBQUssTUFBTSxLQUFLLElBQUksUUFBUSxFQUFFO29CQUM1QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDMUM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge09ic2VydmFibGUsIGlzT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2UsIGZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCYXNlVHJlZUNvbnRyb2x9IGZyb20gJy4vYmFzZS10cmVlLWNvbnRyb2wnO1xuXG4vKiogT3B0aW9uYWwgc2V0IG9mIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhlIE5lc3RlZFRyZWVDb250cm9sLiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZXN0ZWRUcmVlQ29udHJvbE9wdGlvbnM8VCwgSz4ge1xuICB0cmFja0J5PzogKGRhdGFOb2RlOiBUKSA9PiBLO1xufVxuXG4vKiogTmVzdGVkIHRyZWUgY29udHJvbC4gQWJsZSB0byBleHBhbmQvY29sbGFwc2UgYSBzdWJ0cmVlIHJlY3Vyc2l2ZWx5IGZvciBOZXN0ZWROb2RlIHR5cGUuICovXG5leHBvcnQgY2xhc3MgTmVzdGVkVHJlZUNvbnRyb2w8VCwgSyA9IFQ+IGV4dGVuZHMgQmFzZVRyZWVDb250cm9sPFQsIEs+IHtcbiAgLyoqIENvbnN0cnVjdCB3aXRoIG5lc3RlZCB0cmVlIGZ1bmN0aW9uIGdldENoaWxkcmVuLiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgb3ZlcnJpZGUgZ2V0Q2hpbGRyZW46IChkYXRhTm9kZTogVCkgPT4gT2JzZXJ2YWJsZTxUW10+IHwgVFtdIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICBwdWJsaWMgb3B0aW9ucz86IE5lc3RlZFRyZWVDb250cm9sT3B0aW9uczxULCBLPixcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJhY2tCeSA9IHRoaXMub3B0aW9ucy50cmFja0J5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmRzIGFsbCBkYXRhTm9kZXMgaW4gdGhlIHRyZWUuXG4gICAqXG4gICAqIFRvIG1ha2UgdGhpcyB3b3JraW5nLCB0aGUgYGRhdGFOb2Rlc2AgdmFyaWFibGUgb2YgdGhlIFRyZWVDb250cm9sIG11c3QgYmUgc2V0IHRvIGFsbCByb290IGxldmVsXG4gICAqIGRhdGEgbm9kZXMgb2YgdGhlIHRyZWUuXG4gICAqL1xuICBleHBhbmRBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbnNpb25Nb2RlbC5jbGVhcigpO1xuICAgIGNvbnN0IGFsbE5vZGVzID0gdGhpcy5kYXRhTm9kZXMucmVkdWNlKFxuICAgICAgKGFjY3VtdWxhdG9yOiBUW10sIGRhdGFOb2RlKSA9PiBbLi4uYWNjdW11bGF0b3IsIC4uLnRoaXMuZ2V0RGVzY2VuZGFudHMoZGF0YU5vZGUpLCBkYXRhTm9kZV0sXG4gICAgICBbXSxcbiAgICApO1xuICAgIHRoaXMuZXhwYW5zaW9uTW9kZWwuc2VsZWN0KC4uLmFsbE5vZGVzLm1hcChub2RlID0+IHRoaXMuX3RyYWNrQnlWYWx1ZShub2RlKSkpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBsaXN0IG9mIGRlc2NlbmRhbnQgZGF0YU5vZGVzIG9mIGEgc3VidHJlZSByb290ZWQgYXQgZ2l2ZW4gZGF0YSBub2RlIHJlY3Vyc2l2ZWx5LiAqL1xuICBnZXREZXNjZW5kYW50cyhkYXRhTm9kZTogVCk6IFRbXSB7XG4gICAgY29uc3QgZGVzY2VuZGFudHM6IFRbXSA9IFtdO1xuXG4gICAgdGhpcy5fZ2V0RGVzY2VuZGFudHMoZGVzY2VuZGFudHMsIGRhdGFOb2RlKTtcbiAgICAvLyBSZW1vdmUgdGhlIG5vZGUgaXRzZWxmXG4gICAgcmV0dXJuIGRlc2NlbmRhbnRzLnNwbGljZSgxKTtcbiAgfVxuXG4gIC8qKiBBIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgZGVzY2VuZGFudHMgcmVjdXJzaXZlbHkuICovXG4gIHByb3RlY3RlZCBfZ2V0RGVzY2VuZGFudHMoZGVzY2VuZGFudHM6IFRbXSwgZGF0YU5vZGU6IFQpOiB2b2lkIHtcbiAgICBkZXNjZW5kYW50cy5wdXNoKGRhdGFOb2RlKTtcbiAgICBjb25zdCBjaGlsZHJlbk5vZGVzID0gdGhpcy5nZXRDaGlsZHJlbihkYXRhTm9kZSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5Ob2RlcykpIHtcbiAgICAgIGNoaWxkcmVuTm9kZXMuZm9yRWFjaCgoY2hpbGQ6IFQpID0+IHRoaXMuX2dldERlc2NlbmRhbnRzKGRlc2NlbmRhbnRzLCBjaGlsZCkpO1xuICAgIH0gZWxzZSBpZiAoaXNPYnNlcnZhYmxlKGNoaWxkcmVuTm9kZXMpKSB7XG4gICAgICAvLyBUeXBlU2NyaXB0IGFzIG9mIHZlcnNpb24gMy41IGRvZXNuJ3Qgc2VlbSB0byB0cmVhdCBgQm9vbGVhbmAgbGlrZSBhIGZ1bmN0aW9uIHRoYXRcbiAgICAgIC8vIHJldHVybnMgYSBgYm9vbGVhbmAgc3BlY2lmaWNhbGx5IGluIHRoZSBjb250ZXh0IG9mIGBmaWx0ZXJgLCBzbyB3ZSBtYW51YWxseSBjbGFyaWZ5IHRoYXQuXG4gICAgICBjaGlsZHJlbk5vZGVzLnBpcGUodGFrZSgxKSwgZmlsdGVyKEJvb2xlYW4gYXMgKCkgPT4gYm9vbGVhbikpLnN1YnNjcmliZShjaGlsZHJlbiA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICB0aGlzLl9nZXREZXNjZW5kYW50cyhkZXNjZW5kYW50cywgY2hpbGQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==