/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseTreeControl } from './base-tree-control';
/** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
export class FlatTreeControl extends BaseTreeControl {
    /** Construct with flat tree data node functions getLevel and isExpandable. */
    constructor(getLevel, isExpandable, options) {
        super();
        this.getLevel = getLevel;
        this.isExpandable = isExpandable;
        this.options = options;
        if (this.options) {
            this.trackBy = this.options.trackBy;
        }
    }
    /**
     * Gets a list of the data node's subtree of descendent data nodes.
     *
     * To make this working, the `dataNodes` of the TreeControl must be flattened tree nodes
     * with correct levels.
     */
    getDescendants(dataNode) {
        const startIndex = this.dataNodes.indexOf(dataNode);
        const results = [];
        // Goes through flattened tree nodes in the `dataNodes` array, and get all descendants.
        // The level of descendants of a tree node must be greater than the level of the given
        // tree node.
        // If we reach a node whose level is equal to the level of the tree node, we hit a sibling.
        // If we reach a node whose level is greater than the level of the tree node, we hit a
        // sibling of an ancestor.
        for (let i = startIndex + 1; i < this.dataNodes.length && this.getLevel(dataNode) < this.getLevel(this.dataNodes[i]); i++) {
            results.push(this.dataNodes[i]);
        }
        return results;
    }
    /**
     * Expands all data nodes in the tree.
     *
     * To make this working, the `dataNodes` variable of the TreeControl must be set to all flattened
     * data nodes of the tree.
     */
    expandAll() {
        this.expansionModel.select(...this.dataNodes.map(node => this._trackByValue(node)));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC10cmVlLWNvbnRyb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3RyZWUvY29udHJvbC9mbGF0LXRyZWUtY29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFPcEQsMkZBQTJGO0FBQzNGLE1BQU0sT0FBTyxlQUEwQixTQUFRLGVBQXFCO0lBQ2xFLDhFQUE4RTtJQUM5RSxZQUNrQixRQUFpQyxFQUNqQyxZQUFzQyxFQUMvQyxPQUFzQztRQUU3QyxLQUFLLEVBQUUsQ0FBQztRQUpRLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ2pDLGlCQUFZLEdBQVosWUFBWSxDQUEwQjtRQUMvQyxZQUFPLEdBQVAsT0FBTyxDQUErQjtRQUk3QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGNBQWMsQ0FBQyxRQUFXO1FBQ3hCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUV4Qix1RkFBdUY7UUFDdkYsc0ZBQXNGO1FBQ3RGLGFBQWE7UUFDYiwyRkFBMkY7UUFDM0Ysc0ZBQXNGO1FBQ3RGLDBCQUEwQjtRQUMxQixLQUNFLElBQUksQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQ3RCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN2RixDQUFDLEVBQUUsRUFDSDtZQUNBLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUztRQUNQLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCYXNlVHJlZUNvbnRyb2x9IGZyb20gJy4vYmFzZS10cmVlLWNvbnRyb2wnO1xuXG4vKiogT3B0aW9uYWwgc2V0IG9mIGNvbmZpZ3VyYXRpb24gdGhhdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhlIEZsYXRUcmVlQ29udHJvbC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmxhdFRyZWVDb250cm9sT3B0aW9uczxULCBLPiB7XG4gIHRyYWNrQnk/OiAoZGF0YU5vZGU6IFQpID0+IEs7XG59XG5cbi8qKiBGbGF0IHRyZWUgY29udHJvbC4gQWJsZSB0byBleHBhbmQvY29sbGFwc2UgYSBzdWJ0cmVlIHJlY3Vyc2l2ZWx5IGZvciBmbGF0dGVuZWQgdHJlZS4gKi9cbmV4cG9ydCBjbGFzcyBGbGF0VHJlZUNvbnRyb2w8VCwgSyA9IFQ+IGV4dGVuZHMgQmFzZVRyZWVDb250cm9sPFQsIEs+IHtcbiAgLyoqIENvbnN0cnVjdCB3aXRoIGZsYXQgdHJlZSBkYXRhIG5vZGUgZnVuY3Rpb25zIGdldExldmVsIGFuZCBpc0V4cGFuZGFibGUuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBvdmVycmlkZSBnZXRMZXZlbDogKGRhdGFOb2RlOiBUKSA9PiBudW1iZXIsXG4gICAgcHVibGljIG92ZXJyaWRlIGlzRXhwYW5kYWJsZTogKGRhdGFOb2RlOiBUKSA9PiBib29sZWFuLFxuICAgIHB1YmxpYyBvcHRpb25zPzogRmxhdFRyZWVDb250cm9sT3B0aW9uczxULCBLPixcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJhY2tCeSA9IHRoaXMub3B0aW9ucy50cmFja0J5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiB0aGUgZGF0YSBub2RlJ3Mgc3VidHJlZSBvZiBkZXNjZW5kZW50IGRhdGEgbm9kZXMuXG4gICAqXG4gICAqIFRvIG1ha2UgdGhpcyB3b3JraW5nLCB0aGUgYGRhdGFOb2Rlc2Agb2YgdGhlIFRyZWVDb250cm9sIG11c3QgYmUgZmxhdHRlbmVkIHRyZWUgbm9kZXNcbiAgICogd2l0aCBjb3JyZWN0IGxldmVscy5cbiAgICovXG4gIGdldERlc2NlbmRhbnRzKGRhdGFOb2RlOiBUKTogVFtdIHtcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5kYXRhTm9kZXMuaW5kZXhPZihkYXRhTm9kZSk7XG4gICAgY29uc3QgcmVzdWx0czogVFtdID0gW107XG5cbiAgICAvLyBHb2VzIHRocm91Z2ggZmxhdHRlbmVkIHRyZWUgbm9kZXMgaW4gdGhlIGBkYXRhTm9kZXNgIGFycmF5LCBhbmQgZ2V0IGFsbCBkZXNjZW5kYW50cy5cbiAgICAvLyBUaGUgbGV2ZWwgb2YgZGVzY2VuZGFudHMgb2YgYSB0cmVlIG5vZGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gdGhlIGxldmVsIG9mIHRoZSBnaXZlblxuICAgIC8vIHRyZWUgbm9kZS5cbiAgICAvLyBJZiB3ZSByZWFjaCBhIG5vZGUgd2hvc2UgbGV2ZWwgaXMgZXF1YWwgdG8gdGhlIGxldmVsIG9mIHRoZSB0cmVlIG5vZGUsIHdlIGhpdCBhIHNpYmxpbmcuXG4gICAgLy8gSWYgd2UgcmVhY2ggYSBub2RlIHdob3NlIGxldmVsIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGV2ZWwgb2YgdGhlIHRyZWUgbm9kZSwgd2UgaGl0IGFcbiAgICAvLyBzaWJsaW5nIG9mIGFuIGFuY2VzdG9yLlxuICAgIGZvciAoXG4gICAgICBsZXQgaSA9IHN0YXJ0SW5kZXggKyAxO1xuICAgICAgaSA8IHRoaXMuZGF0YU5vZGVzLmxlbmd0aCAmJiB0aGlzLmdldExldmVsKGRhdGFOb2RlKSA8IHRoaXMuZ2V0TGV2ZWwodGhpcy5kYXRhTm9kZXNbaV0pO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5kYXRhTm9kZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmRzIGFsbCBkYXRhIG5vZGVzIGluIHRoZSB0cmVlLlxuICAgKlxuICAgKiBUbyBtYWtlIHRoaXMgd29ya2luZywgdGhlIGBkYXRhTm9kZXNgIHZhcmlhYmxlIG9mIHRoZSBUcmVlQ29udHJvbCBtdXN0IGJlIHNldCB0byBhbGwgZmxhdHRlbmVkXG4gICAqIGRhdGEgbm9kZXMgb2YgdGhlIHRyZWUuXG4gICAqL1xuICBleHBhbmRBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbnNpb25Nb2RlbC5zZWxlY3QoLi4udGhpcy5kYXRhTm9kZXMubWFwKG5vZGUgPT4gdGhpcy5fdHJhY2tCeVZhbHVlKG5vZGUpKSk7XG4gIH1cbn1cbiJdfQ==