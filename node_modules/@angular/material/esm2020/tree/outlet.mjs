/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
export class MatTreeNodeOutlet {
    constructor(viewContainer, _node) {
        this.viewContainer = viewContainer;
        this._node = _node;
    }
}
MatTreeNodeOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeOutlet, deps: [{ token: i0.ViewContainerRef }, { token: CDK_TREE_NODE_OUTLET_NODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]", providers: [
        {
            provide: CdkTreeNodeOutlet,
            useExisting: MatTreeNodeOutlet,
        },
    ], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeOutlet, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeOutlet]',
                    providers: [
                        {
                            provide: CdkTreeNodeOutlet,
                            useExisting: MatTreeNodeOutlet,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TREE_NODE_OUTLET_NODE]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9FLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFNUU7OztHQUdHO0FBVUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNTLGFBQStCLEVBQ2dCLEtBQVc7UUFEMUQsa0JBQWEsR0FBYixhQUFhLENBQWtCO1FBQ2dCLFVBQUssR0FBTCxLQUFLLENBQU07SUFDaEUsQ0FBQzs7OEdBSk8saUJBQWlCLGtEQUdsQix5QkFBeUI7a0dBSHhCLGlCQUFpQiw4Q0FQakI7UUFDVDtZQUNFLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQjtLQUNGOzJGQUVVLGlCQUFpQjtrQkFUN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxtQkFBbUI7eUJBQy9CO3FCQUNGO2lCQUNGOzswQkFJSSxNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBQUcsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtDREtfVFJFRV9OT0RFX09VVExFVF9OT0RFLCBDZGtUcmVlTm9kZU91dGxldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgT3B0aW9uYWwsIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIE91dGxldCBmb3IgbmVzdGVkIENka05vZGUuIFB1dCBgW21hdFRyZWVOb2RlT3V0bGV0XWAgb24gYSB0YWcgdG8gcGxhY2UgY2hpbGRyZW4gZGF0YU5vZGVzXG4gKiBpbnNpZGUgdGhlIG91dGxldC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlT3V0bGV0XScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IENka1RyZWVOb2RlT3V0bGV0LFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlT3V0bGV0LFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlT3V0bGV0IGltcGxlbWVudHMgQ2RrVHJlZU5vZGVPdXRsZXQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KENES19UUkVFX05PREVfT1VUTEVUX05PREUpIEBPcHRpb25hbCgpIHB1YmxpYyBfbm9kZT86IGFueSxcbiAgKSB7fVxufVxuIl19