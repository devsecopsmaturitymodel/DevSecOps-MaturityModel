/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge } from 'rxjs';
import { map, take } from 'rxjs/operators';
/**
 * Tree flattener to convert a normal type of node to node with children & level information.
 * Transform nested nodes of type `T` to flattened nodes of type `F`.
 *
 * For example, the input data of type `T` is nested, and contains its children data:
 *   SomeNode: {
 *     key: 'Fruits',
 *     children: [
 *       NodeOne: {
 *         key: 'Apple',
 *       },
 *       NodeTwo: {
 *        key: 'Pear',
 *      }
 *    ]
 *  }
 *  After flattener flatten the tree, the structure will become
 *  SomeNode: {
 *    key: 'Fruits',
 *    expandable: true,
 *    level: 1
 *  },
 *  NodeOne: {
 *    key: 'Apple',
 *    expandable: false,
 *    level: 2
 *  },
 *  NodeTwo: {
 *   key: 'Pear',
 *   expandable: false,
 *   level: 2
 * }
 * and the output flattened type is `F` with additional information.
 */
export class MatTreeFlattener {
    constructor(transformFunction, getLevel, isExpandable, getChildren) {
        this.transformFunction = transformFunction;
        this.getLevel = getLevel;
        this.isExpandable = isExpandable;
        this.getChildren = getChildren;
    }
    _flattenNode(node, level, resultNodes, parentMap) {
        const flatNode = this.transformFunction(node, level);
        resultNodes.push(flatNode);
        if (this.isExpandable(flatNode)) {
            const childrenNodes = this.getChildren(node);
            if (childrenNodes) {
                if (Array.isArray(childrenNodes)) {
                    this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
                }
                else {
                    childrenNodes.pipe(take(1)).subscribe(children => {
                        this._flattenChildren(children, level, resultNodes, parentMap);
                    });
                }
            }
        }
        return resultNodes;
    }
    _flattenChildren(children, level, resultNodes, parentMap) {
        children.forEach((child, index) => {
            let childParentMap = parentMap.slice();
            childParentMap.push(index != children.length - 1);
            this._flattenNode(child, level + 1, resultNodes, childParentMap);
        });
    }
    /**
     * Flatten a list of node type T to flattened version of node F.
     * Please note that type T may be nested, and the length of `structuredData` may be different
     * from that of returned list `F[]`.
     */
    flattenNodes(structuredData) {
        let resultNodes = [];
        structuredData.forEach(node => this._flattenNode(node, 0, resultNodes, []));
        return resultNodes;
    }
    /**
     * Expand flattened node with current expansion status.
     * The returned list may have different length.
     */
    expandFlattenedNodes(nodes, treeControl) {
        let results = [];
        let currentExpand = [];
        currentExpand[0] = true;
        nodes.forEach(node => {
            let expand = true;
            for (let i = 0; i <= this.getLevel(node); i++) {
                expand = expand && currentExpand[i];
            }
            if (expand) {
                results.push(node);
            }
            if (this.isExpandable(node)) {
                currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
            }
        });
        return results;
    }
}
/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `MatTree`.
 * The nested tree nodes of type `T` are flattened through `MatTreeFlattener`, and converted
 * to type `F` for `MatTree` to consume.
 */
export class MatTreeFlatDataSource extends DataSource {
    constructor(_treeControl, _treeFlattener, initialData) {
        super();
        this._treeControl = _treeControl;
        this._treeFlattener = _treeFlattener;
        this._flattenedData = new BehaviorSubject([]);
        this._expandedData = new BehaviorSubject([]);
        this._data = new BehaviorSubject([]);
        if (initialData) {
            // Assign the data through the constructor to ensure that all of the logic is executed.
            this.data = initialData;
        }
    }
    get data() {
        return this._data.value;
    }
    set data(value) {
        this._data.next(value);
        this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
        this._treeControl.dataNodes = this._flattenedData.value;
    }
    connect(collectionViewer) {
        return merge(collectionViewer.viewChange, this._treeControl.expansionModel.changed, this._flattenedData).pipe(map(() => {
            this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl));
            return this._expandedData.value;
        }));
    }
    disconnect() {
        // no op
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL2RhdGEtc291cmNlL2ZsYXQtZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFtQixVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQ1MsaUJBQWdELEVBQ2hELFFBQTZCLEVBQzdCLFlBQWtDLEVBQ2xDLFdBQWtFO1FBSGxFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBK0I7UUFDaEQsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDN0IsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ2xDLGdCQUFXLEdBQVgsV0FBVyxDQUF1RDtJQUN4RSxDQUFDO0lBRUosWUFBWSxDQUFDLElBQU8sRUFBRSxLQUFhLEVBQUUsV0FBZ0IsRUFBRSxTQUFvQjtRQUN6RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JELFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMs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ZSxDQUFNLEVBQUUsQ0FBQyxDQUFDO1FBU3BELElBQUksV0FBVyxFQUFFO1lBQ2YsdUZBQXVGO1lBQ3ZGLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQXJCRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO0lBQzFELENBQUM7SUFnQkQsT0FBTyxDQUFDLGdCQUFrQztRQUN4QyxPQUFPLEtBQUssQ0FDVixnQkFBZ0IsQ0FBQyxVQUFVLEVBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFDeEMsSUFBSSxDQUFDLGNBQWMsQ0FDcEIsQ0FBQyxJQUFJLENBQ0osR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FDdkYsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsUUFBUTtJQUNWLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbGxlY3Rpb25WaWV3ZXIsIERhdGFTb3VyY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge0ZsYXRUcmVlQ29udHJvbCwgVHJlZUNvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIFRyZWUgZmxhdHRlbmVyIHRvIGNvbnZlcnQgYSBub3JtYWwgdHlwZSBvZiBub2RlIHRvIG5vZGUgd2l0aCBjaGlsZHJlbiAmIGxldmVsIGluZm9ybWF0aW9uLlxuICogVHJhbnNmb3JtIG5lc3RlZCBub2RlcyBvZiB0eXBlIGBUYCB0byBmbGF0dGVuZWQgbm9kZXMgb2YgdHlwZSBgRmAuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBpbnB1dCBkYXRhIG9mIHR5cGUgYFRgIGlzIG5lc3RlZCwgYW5kIGNvbnRhaW5zIGl0cyBjaGlsZHJlbiBkYXRhOlxuICogICBTb21lTm9kZToge1xuICogICAgIGtleTogJ0ZydWl0cycsXG4gKiAgICAgY2hpbGRyZW46IFtcbiAqICAgICAgIE5vZGVPbmU6IHtcbiAqICAgICAgICAga2V5OiAnQXBwbGUnLFxuICogICAgICAgfSxcbiAqICAgICAgIE5vZGVUd286IHtcbiAqICAgICAgICBrZXk6ICdQZWFyJyxcbiAqICAgICAgfVxuICogICAgXVxuICogIH1cbiAqICBBZnRlciBmbGF0dGVuZXIgZmxhdHRlbiB0aGUgdHJlZSwgdGhlIHN0cnVjdHVyZSB3aWxsIGJlY29tZVxuICogIFNvbWVOb2RlOiB7XG4gKiAgICBrZXk6ICdGcnVpdHMnLFxuICogICAgZXhwYW5kYWJsZTogdHJ1ZSxcbiAqICAgIGxldmVsOiAxXG4gKiAgfSxcbiAqICBOb2RlT25lOiB7XG4gKiAgICBrZXk6ICdBcHBsZScsXG4gKiAgICBleHBhbmRhYmxlOiBmYWxzZSxcbiAqICAgIGxldmVsOiAyXG4gKiAgfSxcbiAqICBOb2RlVHdvOiB7XG4gKiAgIGtleTogJ1BlYXInLFxuICogICBleHBhbmRhYmxlOiBmYWxzZSxcbiAqICAgbGV2ZWw6IDJcbiAqIH1cbiAqIGFuZCB0aGUgb3V0cHV0IGZsYXR0ZW5lZCB0eXBlIGlzIGBGYCB3aXRoIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUcmVlRmxhdHRlbmVyPFQsIEYsIEsgPSBGPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB0cmFuc2Zvcm1GdW5jdGlvbjogKG5vZGU6IFQsIGxldmVsOiBudW1iZXIpID0+IEYsXG4gICAgcHVibGljIGdldExldmVsOiAobm9kZTogRikgPT4gbnVtYmVyLFxuICAgIHB1YmxpYyBpc0V4cGFuZGFibGU6IChub2RlOiBGKSA9PiBib29sZWFuLFxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbjogKG5vZGU6IFQpID0+IE9ic2VydmFibGU8VFtdPiB8IFRbXSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICkge31cblxuICBfZmxhdHRlbk5vZGUobm9kZTogVCwgbGV2ZWw6IG51bWJlciwgcmVzdWx0Tm9kZXM6IEZbXSwgcGFyZW50TWFwOiBib29sZWFuW10pOiBGW10ge1xuICAgIGNvbnN0IGZsYXROb2RlID0gdGhpcy50cmFuc2Zvcm1GdW5jdGlvbihub2RlLCBsZXZlbCk7XG4gICAgcmVzdWx0Tm9kZXMucHVzaChmbGF0Tm9kZSk7XG5cbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoZmxhdE5vZGUpKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbk5vZGVzID0gdGhpcy5nZXRDaGlsZHJlbihub2RlKTtcbiAgICAgIGlmIChjaGlsZHJlbk5vZGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuTm9kZXMpKSB7XG4gICAgICAgICAgdGhpcy5fZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuTm9kZXMsIGxldmVsLCByZXN1bHROb2RlcywgcGFyZW50TWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZHJlbk5vZGVzLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKGNoaWxkcmVuID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2ZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbiwgbGV2ZWwsIHJlc3VsdE5vZGVzLCBwYXJlbnRNYXApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgfVxuXG4gIF9mbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW46IFRbXSwgbGV2ZWw6IG51bWJlciwgcmVzdWx0Tm9kZXM6IEZbXSwgcGFyZW50TWFwOiBib29sZWFuW10pOiB2b2lkIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBjaGlsZFBhcmVudE1hcDogYm9vbGVhbltdID0gcGFyZW50TWFwLnNsaWNlKCk7XG4gICAgICBjaGlsZFBhcmVudE1hcC5wdXNoKGluZGV4ICE9IGNoaWxkcmVuLmxlbmd0aCAtIDEpO1xuICAgICAgdGhpcy5fZmxhdHRlbk5vZGUoY2hpbGQsIGxldmVsICsgMSwgcmVzdWx0Tm9kZXMsIGNoaWxkUGFyZW50TWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVuIGEgbGlzdCBvZiBub2RlIHR5cGUgVCB0byBmbGF0dGVuZWQgdmVyc2lvbiBvZiBub2RlIEYuXG4gICAqIFBsZWFzZSBub3RlIHRoYXQgdHlwZSBUIG1heSBiZSBuZXN0ZWQsIGFuZCB0aGUgbGVuZ3RoIG9mIGBzdHJ1Y3R1cmVkRGF0YWAgbWF5IGJlIGRpZmZlcmVudFxuICAgKiBmcm9tIHRoYXQgb2YgcmV0dXJuZWQgbGlzdCBgRltdYC5cbiAgICovXG4gIGZsYXR0ZW5Ob2RlcyhzdHJ1Y3R1cmVkRGF0YTogVFtdKTogRltdIHtcbiAgICBsZXQgcmVzdWx0Tm9kZXM6IEZbXSA9IFtdO1xuICAgIHN0cnVjdHVyZWREYXRhLmZvckVhY2gobm9kZSA9PiB0aGlzLl9mbGF0dGVuTm9kZShub2RlLCAwLCByZXN1bHROb2RlcywgW10pKTtcbiAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogRXhwYW5kIGZsYXR0ZW5lZCBub2RlIHdpdGggY3VycmVudCBleHBhbnNpb24gc3RhdHVzLlxuICAgKiBUaGUgcmV0dXJuZWQgbGlzdCBtYXkgaGF2ZSBkaWZmZXJlbnQgbGVuZ3RoLlxuICAgKi9cbiAgZXhwYW5kRmxhdHRlbmVkTm9kZXMobm9kZXM6IEZbXSwgdHJlZUNvbnRyb2w6IFRyZWVDb250cm9sPEYsIEs+KTogRltdIHtcbiAgICBsZXQgcmVzdWx0czogRltdID0gW107XG4gICAgbGV0IGN1cnJlbnRFeHBhbmQ6IGJvb2xlYW5bXSA9IFtdO1xuICAgIGN1cnJlbnRFeHBhbmRbMF0gPSB0cnVlO1xuXG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGxldCBleHBhbmQgPSB0cnVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5nZXRMZXZlbChub2RlKTsgaSsrKSB7XG4gICAgICAgIGV4cGFuZCA9IGV4cGFuZCAmJiBjdXJyZW50RXhwYW5kW2ldO1xuICAgICAgfVxuICAgICAgaWYgKGV4cGFuZCkge1xuICAgICAgICByZXN1bHRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUobm9kZSkpIHtcbiAgICAgICAgY3VycmVudEV4cGFuZFt0aGlzLmdldExldmVsKG5vZGUpICsgMV0gPSB0cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59XG5cbi8qKlxuICogRGF0YSBzb3VyY2UgZm9yIGZsYXQgdHJlZS5cbiAqIFRoZSBkYXRhIHNvdXJjZSBuZWVkIHRvIGhhbmRsZSBleHBhbnNpb24vY29sbGFwc2lvbiBvZiB0aGUgdHJlZSBub2RlIGFuZCBjaGFuZ2UgdGhlIGRhdGEgZmVlZFxuICogdG8gYE1hdFRyZWVgLlxuICogVGhlIG5lc3RlZCB0cmVlIG5vZGVzIG9mIHR5cGUgYFRgIGFyZSBmbGF0dGVuZWQgdGhyb3VnaCBgTWF0VHJlZUZsYXR0ZW5lcmAsIGFuZCBjb252ZXJ0ZWRcbiAqIHRvIHR5cGUgYEZgIGZvciBgTWF0VHJlZWAgdG8gY29uc3VtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVGbGF0RGF0YVNvdXJjZTxULCBGLCBLID0gRj4gZXh0ZW5kcyBEYXRhU291cmNlPEY+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfZmxhdHRlbmVkRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RltdPihbXSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2V4cGFuZGVkRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RltdPihbXSk7XG5cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWU7XG4gIH1cbiAgc2V0IGRhdGEodmFsdWU6IFRbXSkge1xuICAgIHRoaXMuX2RhdGEubmV4dCh2YWx1ZSk7XG4gICAgdGhpcy5fZmxhdHRlbmVkRGF0YS5uZXh0KHRoaXMuX3RyZWVGbGF0dGVuZXIuZmxhdHRlbk5vZGVzKHRoaXMuZGF0YSkpO1xuICAgIHRoaXMuX3RyZWVDb250cm9sLmRhdGFOb2RlcyA9IHRoaXMuX2ZsYXR0ZW5lZERhdGEudmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSByZWFkb25seSBfZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihbXSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdHJlZUNvbnRyb2w6IEZsYXRUcmVlQ29udHJvbDxGLCBLPixcbiAgICBwcml2YXRlIF90cmVlRmxhdHRlbmVyOiBNYXRUcmVlRmxhdHRlbmVyPFQsIEYsIEs+LFxuICAgIGluaXRpYWxEYXRhPzogVFtdLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGluaXRpYWxEYXRhKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIGRhdGEgdGhyb3VnaCB0aGUgY29uc3RydWN0b3IgdG8gZW5zdXJlIHRoYXQgYWxsIG9mIHRoZSBsb2dpYyBpcyBleGVjdXRlZC5cbiAgICAgIHRoaXMuZGF0YSA9IGluaXRpYWxEYXRhO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3QoY29sbGVjdGlvblZpZXdlcjogQ29sbGVjdGlvblZpZXdlcik6IE9ic2VydmFibGU8RltdPiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgY29sbGVjdGlvblZpZXdlci52aWV3Q2hhbmdlLFxuICAgICAgdGhpcy5fdHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuY2hhbmdlZCxcbiAgICAgIHRoaXMuX2ZsYXR0ZW5lZERhdGEsXG4gICAgKS5waXBlKFxuICAgICAgbWFwKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZXhwYW5kZWREYXRhLm5leHQoXG4gICAgICAgICAgdGhpcy5fdHJlZUZsYXR0ZW5lci5leHBhbmRGbGF0dGVuZWROb2Rlcyh0aGlzLl9mbGF0dGVuZWREYXRhLnZhbHVlLCB0aGlzLl90cmVlQ29udHJvbCksXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRlZERhdGEudmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICAvLyBubyBvcFxuICB9XG59XG4iXX0=