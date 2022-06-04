/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatTreeNodeHarness } from './node-harness';
/** Harness for interacting with a standard mat-tree in tests. */
export class MatTreeHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTreeHarness, options);
    }
    /** Gets all of the nodes in the tree. */
    async getNodes(filter = {}) {
        return this.locatorForAll(MatTreeNodeHarness.with(filter))();
    }
    /**
     * Gets an object representation for the visible tree structure
     * If a node is under an unexpanded node it will not be included.
     * Eg.
     * Tree (all nodes expanded):
     * `
     * <mat-tree>
     *   <mat-tree-node>Node 1<mat-tree-node>
     *   <mat-nested-tree-node>
     *     Node 2
     *     <mat-nested-tree-node>
     *       Node 2.1
     *       <mat-tree-node>
     *         Node 2.1.1
     *       <mat-tree-node>
     *     <mat-nested-tree-node>
     *     <mat-tree-node>
     *       Node 2.2
     *     <mat-tree-node>
     *   <mat-nested-tree-node>
     * </mat-tree>`
     *
     * Tree structure:
     * {
     *  children: [
     *    {
     *      text: 'Node 1',
     *      children: [
     *        {
     *          text: 'Node 2',
     *          children: [
     *            {
     *              text: 'Node 2.1',
     *              children: [{text: 'Node 2.1.1'}]
     *            },
     *            {text: 'Node 2.2'}
     *          ]
     *        }
     *      ]
     *    }
     *  ]
     * };
     */
    async getTreeStructure() {
        const nodes = await this.getNodes();
        const nodeInformation = await parallel(() => nodes.map(node => {
            return parallel(() => [node.getLevel(), node.getText(), node.isExpanded()]);
        }));
        return this._getTreeStructure(nodeInformation, 1, true);
    }
    /**
     * Recursively collect the structured text of the tree nodes.
     * @param nodes A list of tree nodes
     * @param level The level of nodes that are being accounted for during this iteration
     * @param parentExpanded Whether the parent of the first node in param nodes is expanded
     */
    _getTreeStructure(nodes, level, parentExpanded) {
        const result = {};
        for (let i = 0; i < nodes.length; i++) {
            const [nodeLevel, text, expanded] = nodes[i];
            const nextNodeLevel = nodes[i + 1]?.[0] ?? -1;
            // Return the accumulated value for the current level once we reach a shallower level node
            if (nodeLevel < level) {
                return result;
            }
            // Skip deeper level nodes during this iteration, they will be picked up in a later iteration
            if (nodeLevel > level) {
                continue;
            }
            // Only add to representation if it is visible (parent is expanded)
            if (parentExpanded) {
                // Collect the data under this node according to the following rules:
                // 1. If the next node in the list is a sibling of the current node add it to the child list
                // 2. If the next node is a child of the current node, get the sub-tree structure for the
                //    child and add it under this node
                // 3. If the next node has a shallower level, we've reached the end of the child nodes for
                //    the current parent.
                if (nextNodeLevel === level) {
                    this._addChildToNode(result, { text });
                }
                else if (nextNodeLevel > level) {
                    let children = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)?.children;
                    let child = children ? { text, children } : { text };
                    this._addChildToNode(result, child);
                }
                else {
                    this._addChildToNode(result, { text });
                    return result;
                }
            }
        }
        return result;
    }
    _addChildToNode(result, child) {
        result.children ? result.children.push(child) : (result.children = [child]);
    }
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatTreeHarness.hostSelector = '.mat-tree';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy90cmVlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBUWxELGlFQUFpRTtBQUNqRSxNQUFNLE9BQU8sY0FBZSxTQUFRLGdCQUFnQjtJQUlsRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWlDLEVBQUU7UUFDaEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EwQ0c7SUFDSCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUMxQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssaUJBQWlCLENBQ3ZCLEtBQWtDLEVBQ2xDLEtBQWEsRUFDYixjQUF1QjtRQUV2QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUU5QywwRkFBMEY7WUFDMUYsSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFFO2dCQUNyQixPQUFPLE1BQU0sQ0FBQzthQUNmO1lBQ0QsNkZBQTZGO1lBQzdGLElBQUksU0FBUyxHQUFHLEtBQUssRUFBRTtnQkFDckIsU0FBUzthQUNWO1lBQ0QsbUVBQW1FO1lBQ25FLElBQUksY0FBYyxFQUFFO2dCQUNsQixxRUFBcUU7Z0JBQ3JFLDRGQUE0RjtnQkFDNUYseUZBQXlGO2dCQUN6RixzQ0FBc0M7Z0JBQ3RDLDBGQUEwRjtnQkFDMUYseUJBQXlCO2dCQUN6QixJQUFJLGFBQWEsS0FBSyxLQUFLLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztpQkFDdEM7cUJBQU0sSUFBSSxhQUFhLEdBQUcsS0FBSyxFQUFFO29CQUNoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQ25DLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUNsQixhQUFhLEVBQ2IsUUFBUSxDQUNULEVBQUUsUUFBUSxDQUFDO29CQUNaLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNyQztxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7b0JBQ3JDLE9BQU8sTUFBTSxDQUFDO2lCQUNmO2FBQ0Y7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBZ0IsRUFBRSxLQUFlO1FBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7O0FBM0hELHlFQUF5RTtBQUNsRSwyQkFBWSxHQUFHLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdFRyZWVOb2RlSGFybmVzc30gZnJvbSAnLi9ub2RlLWhhcm5lc3MnO1xuaW1wb3J0IHtUcmVlSGFybmVzc0ZpbHRlcnMsIFRyZWVOb2RlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdHJlZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgdHlwZSBUZXh0VHJlZSA9IHtcbiAgdGV4dD86IHN0cmluZztcbiAgY2hpbGRyZW4/OiBUZXh0VHJlZVtdO1xufTtcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtdHJlZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUcmVlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFRhYmxlSGFybmVzc2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10cmVlJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSB0cmVlIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUcmVlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0VHJlZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VHJlZUhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSBub2RlcyBpbiB0aGUgdHJlZS4gKi9cbiAgYXN5bmMgZ2V0Tm9kZXMoZmlsdGVyOiBUcmVlTm9kZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdFRyZWVOb2RlSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRUcmVlTm9kZUhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JqZWN0IHJlcHJlc2VudGF0aW9uIGZvciB0aGUgdmlzaWJsZSB0cmVlIHN0cnVjdHVyZVxuICAgKiBJZiBhIG5vZGUgaXMgdW5kZXIgYW4gdW5leHBhbmRlZCBub2RlIGl0IHdpbGwgbm90IGJlIGluY2x1ZGVkLlxuICAgKiBFZy5cbiAgICogVHJlZSAoYWxsIG5vZGVzIGV4cGFuZGVkKTpcbiAgICogYFxuICAgKiA8bWF0LXRyZWU+XG4gICAqICAgPG1hdC10cmVlLW5vZGU+Tm9kZSAxPG1hdC10cmVlLW5vZGU+XG4gICAqICAgPG1hdC1uZXN0ZWQtdHJlZS1ub2RlPlxuICAgKiAgICAgTm9kZSAyXG4gICAqICAgICA8bWF0LW5lc3RlZC10cmVlLW5vZGU+XG4gICAqICAgICAgIE5vZGUgMi4xXG4gICAqICAgICAgIDxtYXQtdHJlZS1ub2RlPlxuICAgKiAgICAgICAgIE5vZGUgMi4xLjFcbiAgICogICAgICAgPG1hdC10cmVlLW5vZGU+XG4gICAqICAgICA8bWF0LW5lc3RlZC10cmVlLW5vZGU+XG4gICAqICAgICA8bWF0LXRyZWUtbm9kZT5cbiAgICogICAgICAgTm9kZSAyLjJcbiAgICogICAgIDxtYXQtdHJlZS1ub2RlPlxuICAgKiAgIDxtYXQtbmVzdGVkLXRyZWUtbm9kZT5cbiAgICogPC9tYXQtdHJlZT5gXG4gICAqXG4gICAqIFRyZWUgc3RydWN0dXJlOlxuICAgKiB7XG4gICAqICBjaGlsZHJlbjogW1xuICAgKiAgICB7XG4gICAqICAgICAgdGV4dDogJ05vZGUgMScsXG4gICAqICAgICAgY2hpbGRyZW46IFtcbiAgICogICAgICAgIHtcbiAgICogICAgICAgICAgdGV4dDogJ05vZGUgMicsXG4gICAqICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAqICAgICAgICAgICAge1xuICAgKiAgICAgICAgICAgICAgdGV4dDogJ05vZGUgMi4xJyxcbiAgICogICAgICAgICAgICAgIGNoaWxkcmVuOiBbe3RleHQ6ICdOb2RlIDIuMS4xJ31dXG4gICAqICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICB7dGV4dDogJ05vZGUgMi4yJ31cbiAgICogICAgICAgICAgXVxuICAgKiAgICAgICAgfVxuICAgKiAgICAgIF1cbiAgICogICAgfVxuICAgKiAgXVxuICAgKiB9O1xuICAgKi9cbiAgYXN5bmMgZ2V0VHJlZVN0cnVjdHVyZSgpOiBQcm9taXNlPFRleHRUcmVlPiB7XG4gICAgY29uc3Qgbm9kZXMgPSBhd2FpdCB0aGlzLmdldE5vZGVzKCk7XG4gICAgY29uc3Qgbm9kZUluZm9ybWF0aW9uID0gYXdhaXQgcGFyYWxsZWwoKCkgPT5cbiAgICAgIG5vZGVzLm1hcChub2RlID0+IHtcbiAgICAgICAgcmV0dXJuIHBhcmFsbGVsKCgpID0+IFtub2RlLmdldExldmVsKCksIG5vZGUuZ2V0VGV4dCgpLCBub2RlLmlzRXhwYW5kZWQoKV0pO1xuICAgICAgfSksXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VHJlZVN0cnVjdHVyZShub2RlSW5mb3JtYXRpb24sIDEsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGNvbGxlY3QgdGhlIHN0cnVjdHVyZWQgdGV4dCBvZiB0aGUgdHJlZSBub2Rlcy5cbiAgICogQHBhcmFtIG5vZGVzIEEgbGlzdCBvZiB0cmVlIG5vZGVzXG4gICAqIEBwYXJhbSBsZXZlbCBUaGUgbGV2ZWwgb2Ygbm9kZXMgdGhhdCBhcmUgYmVpbmcgYWNjb3VudGVkIGZvciBkdXJpbmcgdGhpcyBpdGVyYXRpb25cbiAgICogQHBhcmFtIHBhcmVudEV4cGFuZGVkIFdoZXRoZXIgdGhlIHBhcmVudCBvZiB0aGUgZmlyc3Qgbm9kZSBpbiBwYXJhbSBub2RlcyBpcyBleHBhbmRlZFxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VHJlZVN0cnVjdHVyZShcbiAgICBub2RlczogW251bWJlciwgc3RyaW5nLCBib29sZWFuXVtdLFxuICAgIGxldmVsOiBudW1iZXIsXG4gICAgcGFyZW50RXhwYW5kZWQ6IGJvb2xlYW4sXG4gICk6IFRleHRUcmVlIHtcbiAgICBjb25zdCByZXN1bHQ6IFRleHRUcmVlID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW25vZGVMZXZlbCwgdGV4dCwgZXhwYW5kZWRdID0gbm9kZXNbaV07XG4gICAgICBjb25zdCBuZXh0Tm9kZUxldmVsID0gbm9kZXNbaSArIDFdPy5bMF0gPz8gLTE7XG5cbiAgICAgIC8vIFJldHVybiB0aGUgYWNjdW11bGF0ZWQgdmFsdWUgZm9yIHRoZSBjdXJyZW50IGxldmVsIG9uY2Ugd2UgcmVhY2ggYSBzaGFsbG93ZXIgbGV2ZWwgbm9kZVxuICAgICAgaWYgKG5vZGVMZXZlbCA8IGxldmVsKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICAvLyBTa2lwIGRlZXBlciBsZXZlbCBub2RlcyBkdXJpbmcgdGhpcyBpdGVyYXRpb24sIHRoZXkgd2lsbCBiZSBwaWNrZWQgdXAgaW4gYSBsYXRlciBpdGVyYXRpb25cbiAgICAgIGlmIChub2RlTGV2ZWwgPiBsZXZlbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIE9ubHkgYWRkIHRvIHJlcHJlc2VudGF0aW9uIGlmIGl0IGlzIHZpc2libGUgKHBhcmVudCBpcyBleHBhbmRlZClcbiAgICAgIGlmIChwYXJlbnRFeHBhbmRlZCkge1xuICAgICAgICAvLyBDb2xsZWN0IHRoZSBkYXRhIHVuZGVyIHRoaXMgbm9kZSBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBydWxlczpcbiAgICAgICAgLy8gMS4gSWYgdGhlIG5leHQgbm9kZSBpbiB0aGUgbGlzdCBpcyBhIHNpYmxpbmcgb2YgdGhlIGN1cnJlbnQgbm9kZSBhZGQgaXQgdG8gdGhlIGNoaWxkIGxpc3RcbiAgICAgICAgLy8gMi4gSWYgdGhlIG5leHQgbm9kZSBpcyBhIGNoaWxkIG9mIHRoZSBjdXJyZW50IG5vZGUsIGdldCB0aGUgc3ViLXRyZWUgc3RydWN0dXJlIGZvciB0aGVcbiAgICAgICAgLy8gICAgY2hpbGQgYW5kIGFkZCBpdCB1bmRlciB0aGlzIG5vZGVcbiAgICAgICAgLy8gMy4gSWYgdGhlIG5leHQgbm9kZSBoYXMgYSBzaGFsbG93ZXIgbGV2ZWwsIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgY2hpbGQgbm9kZXMgZm9yXG4gICAgICAgIC8vICAgIHRoZSBjdXJyZW50IHBhcmVudC5cbiAgICAgICAgaWYgKG5leHROb2RlTGV2ZWwgPT09IGxldmVsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkQ2hpbGRUb05vZGUocmVzdWx0LCB7dGV4dH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHROb2RlTGV2ZWwgPiBsZXZlbCkge1xuICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX2dldFRyZWVTdHJ1Y3R1cmUoXG4gICAgICAgICAgICBub2Rlcy5zbGljZShpICsgMSksXG4gICAgICAgICAgICBuZXh0Tm9kZUxldmVsLFxuICAgICAgICAgICAgZXhwYW5kZWQsXG4gICAgICAgICAgKT8uY2hpbGRyZW47XG4gICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW4gPyB7dGV4dCwgY2hpbGRyZW59IDoge3RleHR9O1xuICAgICAgICAgIHRoaXMuX2FkZENoaWxkVG9Ob2RlKHJlc3VsdCwgY2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2FkZENoaWxkVG9Ob2RlKHJlc3VsdCwge3RleHR9KTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9hZGRDaGlsZFRvTm9kZShyZXN1bHQ6IFRleHRUcmVlLCBjaGlsZDogVGV4dFRyZWUpIHtcbiAgICByZXN1bHQuY2hpbGRyZW4gPyByZXN1bHQuY2hpbGRyZW4ucHVzaChjaGlsZCkgOiAocmVzdWx0LmNoaWxkcmVuID0gW2NoaWxkXSk7XG4gIH1cbn1cbiJdfQ==