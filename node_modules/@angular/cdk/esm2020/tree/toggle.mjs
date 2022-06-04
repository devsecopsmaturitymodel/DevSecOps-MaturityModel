/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Input } from '@angular/core';
import { CdkTree, CdkTreeNode } from './tree';
import * as i0 from "@angular/core";
import * as i1 from "./tree";
/**
 * Node toggle to expand/collapse the node.
 */
export class CdkTreeNodeToggle {
    constructor(_tree, _treeNode) {
        this._tree = _tree;
        this._treeNode = _treeNode;
        this._recursive = false;
    }
    /** Whether expand/collapse the node recursively. */
    get recursive() {
        return this._recursive;
    }
    set recursive(value) {
        this._recursive = coerceBooleanProperty(value);
    }
    _toggle(event) {
        this.recursive
            ? this._tree.treeControl.toggleDescendants(this._treeNode.data)
            : this._tree.treeControl.toggle(this._treeNode.data);
        event.stopPropagation();
    }
}
CdkTreeNodeToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTreeNodeToggle, deps: [{ token: i1.CdkTree }, { token: i1.CdkTreeNode }], target: i0.ɵɵFactoryTarget.Directive });
CdkTreeNodeToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkTreeNodeToggle, selector: "[cdkTreeNodeToggle]", inputs: { recursive: ["cdkTreeNodeToggleRecursive", "recursive"] }, host: { listeners: { "click": "_toggle($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTreeNodeToggle]',
                    host: {
                        '(click)': '_toggle($event)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkTree }, { type: i1.CdkTreeNode }]; }, propDecorators: { recursive: [{
                type: Input,
                args: ['cdkTreeNodeToggleRecursive']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90cmVlL3RvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUvQyxPQUFPLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBQyxNQUFNLFFBQVEsQ0FBQzs7O0FBRTVDOztHQUVHO0FBT0gsTUFBTSxPQUFPLGlCQUFpQjtJQVc1QixZQUFzQixLQUFvQixFQUFZLFNBQTRCO1FBQTVELFVBQUssR0FBTCxLQUFLLENBQWU7UUFBWSxjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQUZ4RSxlQUFVLEdBQUcsS0FBSyxDQUFDO0lBRXdELENBQUM7SUFWdEYsb0RBQW9EO0lBQ3BELElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBbUI7UUFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBS0QsT0FBTyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxDQUFDLFNBQVM7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDL0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs4R0FuQlUsaUJBQWlCO2tHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFON0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLGlCQUFpQjtxQkFDN0I7aUJBQ0Y7d0hBSUssU0FBUztzQkFEWixLQUFLO3VCQUFDLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDZGtUcmVlLCBDZGtUcmVlTm9kZX0gZnJvbSAnLi90cmVlJztcblxuLyoqXG4gKiBOb2RlIHRvZ2dsZSB0byBleHBhbmQvY29sbGFwc2UgdGhlIG5vZGUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtUcmVlTm9kZVRvZ2dsZV0nLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnX3RvZ2dsZSgkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrVHJlZU5vZGVUb2dnbGU8VCwgSyA9IFQ+IHtcbiAgLyoqIFdoZXRoZXIgZXhwYW5kL2NvbGxhcHNlIHRoZSBub2RlIHJlY3Vyc2l2ZWx5LiAqL1xuICBASW5wdXQoJ2Nka1RyZWVOb2RlVG9nZ2xlUmVjdXJzaXZlJylcbiAgZ2V0IHJlY3Vyc2l2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVjdXJzaXZlO1xuICB9XG4gIHNldCByZWN1cnNpdmUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlY3Vyc2l2ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJvdGVjdGVkIF9yZWN1cnNpdmUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3RyZWU6IENka1RyZWU8VCwgSz4sIHByb3RlY3RlZCBfdHJlZU5vZGU6IENka1RyZWVOb2RlPFQsIEs+KSB7fVxuXG4gIF90b2dnbGUoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5yZWN1cnNpdmVcbiAgICAgID8gdGhpcy5fdHJlZS50cmVlQ29udHJvbC50b2dnbGVEZXNjZW5kYW50cyh0aGlzLl90cmVlTm9kZS5kYXRhKVxuICAgICAgOiB0aGlzLl90cmVlLnRyZWVDb250cm9sLnRvZ2dsZSh0aGlzLl90cmVlTm9kZS5kYXRhKTtcblxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG4iXX0=