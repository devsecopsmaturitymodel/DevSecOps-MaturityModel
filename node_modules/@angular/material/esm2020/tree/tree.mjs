/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTreeNodeOutlet } from './outlet';
import * as i0 from "@angular/core";
import * as i1 from "./outlet";
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class MatTree extends CdkTree {
}
MatTree.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTree, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatTree.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTree, selector: "mat-tree", host: { attributes: { "role": "tree" }, classAttribute: "mat-tree" }, providers: [{ provide: CdkTree, useExisting: MatTree }], viewQueries: [{ propertyName: "_nodeOutlet", first: true, predicate: MatTreeNodeOutlet, descendants: true, static: true }], exportAs: ["matTree"], usesInheritance: true, ngImport: i0, template: `<ng-container matTreeNodeOutlet></ng-container>`, isInline: true, styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"], directives: [{ type: i1.MatTreeNodeOutlet, selector: "[matTreeNodeOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTree, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tree', exportAs: 'matTree', template: `<ng-container matTreeNodeOutlet></ng-container>`, host: {
                        'class': 'mat-tree',
                        'role': 'tree',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, providers: [{ provide: CdkTree, useExisting: MatTree }], styles: [".mat-tree{display:block}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word}.mat-nested-tree-node{border-bottom-width:0}\n"] }]
        }], propDecorators: { _nodeOutlet: [{
                type: ViewChild,
                args: [MatTreeNodeOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9GLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7O0FBRTNDOztHQUVHO0FBZ0JILE1BQU0sT0FBTyxPQUFrQixTQUFRLE9BQWE7O29HQUF2QyxPQUFPO3dGQUFQLE9BQU8seUdBRlAsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQyxDQUFDLHVFQUkxQyxpQkFBaUIsNEdBZGxCLGlEQUFpRDsyRkFZaEQsT0FBTztrQkFmbkIsU0FBUzsrQkFDRSxVQUFVLFlBQ1YsU0FBUyxZQUNULGlEQUFpRCxRQUNyRDt3QkFDSixPQUFPLEVBQUUsVUFBVTt3QkFDbkIsTUFBTSxFQUFFLE1BQU07cUJBQ2YsaUJBRWMsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyxhQUNyQyxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLFNBQVMsRUFBQyxDQUFDOzhCQUlFLFdBQVc7c0JBQWpFLFNBQVM7dUJBQUMsaUJBQWlCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrVHJlZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0VHJlZU5vZGVPdXRsZXR9IGZyb20gJy4vb3V0bGV0JztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVGFibGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZScsXG4gIGV4cG9ydEFzOiAnbWF0VHJlZScsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciBtYXRUcmVlTm9kZU91dGxldD48L25nLWNvbnRhaW5lcj5gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10cmVlJyxcbiAgICAncm9sZSc6ICd0cmVlJyxcbiAgfSxcbiAgc3R5bGVVcmxzOiBbJ3RyZWUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RyZWUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZTxULCBLID0gVD4gZXh0ZW5kcyBDZGtUcmVlPFQsIEs+IHtcbiAgLy8gT3V0bGV0cyB3aXRoaW4gdGhlIHRyZWUncyB0ZW1wbGF0ZSB3aGVyZSB0aGUgZGF0YU5vZGVzIHdpbGwgYmUgaW5zZXJ0ZWQuXG4gIEBWaWV3Q2hpbGQoTWF0VHJlZU5vZGVPdXRsZXQsIHtzdGF0aWM6IHRydWV9KSBvdmVycmlkZSBfbm9kZU91dGxldDogTWF0VHJlZU5vZGVPdXRsZXQ7XG59XG4iXX0=