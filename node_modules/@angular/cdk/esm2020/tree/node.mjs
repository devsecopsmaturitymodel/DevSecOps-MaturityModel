/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/** Context provided to the tree node component. */
export class CdkTreeNodeOutletContext {
    constructor(data) {
        this.$implicit = data;
    }
}
/**
 * Data node definition for the CdkTree.
 * Captures the node's template and a when predicate that describes when this node should be used.
 */
export class CdkTreeNodeDef {
    /** @docs-private */
    constructor(template) {
        this.template = template;
    }
}
CdkTreeNodeDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTreeNodeDef, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkTreeNodeDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkTreeNodeDef, selector: "[cdkTreeNodeDef]", inputs: { when: ["cdkTreeNodeDefWhen", "when"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTreeNodeDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTreeNodeDef]',
                    inputs: ['when: cdkTreeNodeDefWhen'],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdHJlZS9ub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUVyRCxtREFBbUQ7QUFDbkQsTUFBTSxPQUFPLHdCQUF3QjtJQWFuQyxZQUFZLElBQU87UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBRUQ7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGNBQWM7SUFVekIsb0JBQW9CO0lBQ3BCLFlBQW1CLFFBQTBCO1FBQTFCLGFBQVEsR0FBUixRQUFRLENBQWtCO0lBQUcsQ0FBQzs7MkdBWHRDLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQUoxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLE1BQU0sRUFBRSxDQUFDLDBCQUEwQixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQ29udGV4dCBwcm92aWRlZCB0byB0aGUgdHJlZSBub2RlIGNvbXBvbmVudC4gKi9cbmV4cG9ydCBjbGFzcyBDZGtUcmVlTm9kZU91dGxldENvbnRleHQ8VD4ge1xuICAvKiogRGF0YSBmb3IgdGhlIG5vZGUuICovXG4gICRpbXBsaWNpdDogVDtcblxuICAvKiogRGVwdGggb2YgdGhlIG5vZGUuICovXG4gIGxldmVsOiBudW1iZXI7XG5cbiAgLyoqIEluZGV4IGxvY2F0aW9uIG9mIHRoZSBub2RlLiAqL1xuICBpbmRleD86IG51bWJlcjtcblxuICAvKiogTGVuZ3RoIG9mIHRoZSBudW1iZXIgb2YgdG90YWwgZGF0YU5vZGVzLiAqL1xuICBjb3VudD86IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBUKSB7XG4gICAgdGhpcy4kaW1wbGljaXQgPSBkYXRhO1xuICB9XG59XG5cbi8qKlxuICogRGF0YSBub2RlIGRlZmluaXRpb24gZm9yIHRoZSBDZGtUcmVlLlxuICogQ2FwdHVyZXMgdGhlIG5vZGUncyB0ZW1wbGF0ZSBhbmQgYSB3aGVuIHByZWRpY2F0ZSB0aGF0IGRlc2NyaWJlcyB3aGVuIHRoaXMgbm9kZSBzaG91bGQgYmUgdXNlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nka1RyZWVOb2RlRGVmXScsXG4gIGlucHV0czogWyd3aGVuOiBjZGtUcmVlTm9kZURlZldoZW4nXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrVHJlZU5vZGVEZWY8VD4ge1xuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhpcyBub2RlIHRlbXBsYXRlIHNob3VsZCBiZSB1c2VkIGZvciB0aGUgcHJvdmlkZWQgbm9kZVxuICAgKiBkYXRhIGFuZCBpbmRleC4gSWYgbGVmdCB1bmRlZmluZWQsIHRoaXMgbm9kZSB3aWxsIGJlIGNvbnNpZGVyZWQgdGhlIGRlZmF1bHQgbm9kZSB0ZW1wbGF0ZSB0b1xuICAgKiB1c2Ugd2hlbiBubyBvdGhlciB3aGVuIGZ1bmN0aW9ucyByZXR1cm4gdHJ1ZSBmb3IgdGhlIGRhdGEuXG4gICAqIEZvciBldmVyeSBub2RlLCB0aGVyZSBtdXN0IGJlIGF0IGxlYXN0IG9uZSB3aGVuIGZ1bmN0aW9uIHRoYXQgcGFzc2VzIG9yIGFuIHVuZGVmaW5lZCB0b1xuICAgKiBkZWZhdWx0LlxuICAgKi9cbiAgd2hlbjogKGluZGV4OiBudW1iZXIsIG5vZGVEYXRhOiBUKSA9PiBib29sZWFuO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cbiJdfQ==