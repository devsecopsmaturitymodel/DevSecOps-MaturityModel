/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TREE_NODE_OUTLET_NODE, CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef, } from '@angular/cdk/tree';
import { Attribute, Directive, ElementRef, Input, IterableDiffers, } from '@angular/core';
import { mixinDisabled, mixinTabIndex } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/tree";
const _MatTreeNodeBase = mixinTabIndex(mixinDisabled(CdkTreeNode));
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
export class MatTreeNode extends _MatTreeNodeBase {
    constructor(elementRef, tree, tabIndex) {
        super(elementRef, tree);
        this.tabIndex = Number(tabIndex) || 0;
    }
    // This is a workaround for https://github.com/angular/angular/issues/23091
    // In aot mode, the lifecycle hooks from parent class are not called.
    ngOnInit() {
        super.ngOnInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
MatTreeNode.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNode, deps: [{ token: i0.ElementRef }, { token: i1.CdkTree }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
MatTreeNode.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTreeNode, selector: "mat-tree-node", inputs: { role: "role", disabled: "disabled", tabIndex: "tabIndex" }, host: { classAttribute: "mat-tree-node" }, providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode }], exportAs: ["matTreeNode"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNode, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-tree-node',
                    exportAs: 'matTreeNode',
                    inputs: ['role', 'disabled', 'tabIndex'],
                    providers: [{ provide: CdkTreeNode, useExisting: MatTreeNode }],
                    host: {
                        'class': 'mat-tree-node',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.CdkTree }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; } });
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 * Captures the node's template and a when predicate that describes when this node should be used.
 */
export class MatTreeNodeDef extends CdkTreeNodeDef {
}
MatTreeNodeDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeDef, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTreeNodeDef, selector: "[matTreeNodeDef]", inputs: { when: ["matTreeNodeDefWhen", "when"], data: ["matTreeNode", "data"] }, providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeDef]',
                    inputs: ['when: matTreeNodeDefWhen'],
                    providers: [{ provide: CdkTreeNodeDef, useExisting: MatTreeNodeDef }],
                }]
        }], propDecorators: { data: [{
                type: Input,
                args: ['matTreeNode']
            }] } });
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
export class MatNestedTreeNode extends CdkNestedTreeNode {
    constructor(elementRef, tree, differs, tabIndex) {
        super(elementRef, tree, differs);
        this._disabled = false;
        this.tabIndex = Number(tabIndex) || 0;
    }
    /** Whether the node is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /** Tabindex for the node. */
    get tabIndex() {
        return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value) {
        // If the specified tabIndex value is null or undefined, fall back to the default value.
        this._tabIndex = value != null ? value : 0;
    }
    // This is a workaround for https://github.com/angular/angular/issues/19145
    // In aot mode, the lifecycle hooks from parent class are not called.
    // TODO(tinayuangao): Remove when the angular issue #19145 is fixed
    ngOnInit() {
        super.ngOnInit();
    }
    ngAfterContentInit() {
        super.ngAfterContentInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
MatNestedTreeNode.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatNestedTreeNode, deps: [{ token: i0.ElementRef }, { token: i1.CdkTree }, { token: i0.IterableDiffers }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
MatNestedTreeNode.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatNestedTreeNode, selector: "mat-nested-tree-node", inputs: { role: "role", disabled: "disabled", tabIndex: "tabIndex", node: ["matNestedTreeNode", "node"] }, host: { classAttribute: "mat-nested-tree-node" }, providers: [
        { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode },
        { provide: CdkTreeNode, useExisting: MatNestedTreeNode },
        { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode },
    ], exportAs: ["matNestedTreeNode"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatNestedTreeNode, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-nested-tree-node',
                    exportAs: 'matNestedTreeNode',
                    inputs: ['role', 'disabled', 'tabIndex'],
                    providers: [
                        { provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CdkTreeNode, useExisting: MatNestedTreeNode },
                        { provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: MatNestedTreeNode },
                    ],
                    host: {
                        'class': 'mat-nested-tree-node',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.CdkTree }, { type: i0.IterableDiffers }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; }, propDecorators: { node: [{
                type: Input,
                args: ['matNestedTreeNode']
            }], disabled: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFdBQVcsRUFDWCxjQUFjLEdBQ2YsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBRUwsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGVBQWUsR0FHaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUEwQixhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDN0YsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUUxRSxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUVuRTs7R0FFRztBQVVILE1BQU0sT0FBTyxXQUNYLFNBQVEsZ0JBQXNCO0lBRzlCLFlBQ0UsVUFBbUMsRUFDbkMsSUFBbUIsRUFDSSxRQUFnQjtRQUV2QyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLHFFQUFxRTtJQUM1RCxRQUFRO1FBQ2YsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDOzt3R0FyQlUsV0FBVyxtRUFPVCxVQUFVOzRGQVBaLFdBQVcseUpBTFgsQ0FBQyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDOzJGQUtsRCxXQUFXO2tCQVR2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUM7b0JBQ3hDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLGFBQWEsRUFBQyxDQUFDO29CQUM3RCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGVBQWU7cUJBQ3pCO2lCQUNGOzswQkFRSSxTQUFTOzJCQUFDLFVBQVU7O0FBaUJ6Qjs7O0dBR0c7QUFNSCxNQUFNLE9BQU8sY0FBa0IsU0FBUSxjQUFpQjs7MkdBQTNDLGNBQWM7K0ZBQWQsY0FBYyw0SEFGZCxDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7MkZBRXhELGNBQWM7a0JBTDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsTUFBTSxFQUFFLENBQUMsMEJBQTBCLENBQUM7b0JBQ3BDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQ3BFOzhCQUV1QixJQUFJO3NCQUF6QixLQUFLO3VCQUFDLGFBQWE7O0FBR3RCOztHQUVHO0FBY0gsTUFBTSxPQUFPLGlCQUNYLFNBQVEsaUJBQXVCO0lBMEIvQixZQUNFLFVBQW1DLEVBQ25DLElBQW1CLEVBQ25CLE9BQXdCLEVBQ0QsUUFBZ0I7UUFFdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFuQjNCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFvQnhCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBN0JELG9DQUFvQztJQUNwQyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQW1CO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUdELDZCQUE2QjtJQUM3QixJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFhO1FBQ3hCLHdGQUF3RjtRQUN4RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFhRCwyRUFBMkU7SUFDM0UscUVBQXFFO0lBQ3JFLG1FQUFtRTtJQUMxRCxRQUFRO1FBQ2YsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFUSxrQkFBa0I7UUFDekIsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVRLFdBQVc7UUFDbEIsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7OzhHQWxEVSxpQkFBaUIsa0dBK0JmLFVBQVU7a0dBL0JaLGlCQUFpQiw0TUFUakI7UUFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUM7UUFDNUQsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQztRQUN0RCxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUM7S0FDckU7MkZBS1UsaUJBQWlCO2tCQWI3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDO29CQUN4QyxTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxtQkFBbUIsRUFBQzt3QkFDNUQsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsbUJBQW1CLEVBQUM7d0JBQ3RELEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFdBQVcsbUJBQW1CLEVBQUM7cUJBQ3JFO29CQUNELElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3FCQUNoQztpQkFDRjs7MEJBZ0NJLFNBQVM7MkJBQUMsVUFBVTs0Q0EzQkssSUFBSTtzQkFBL0IsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBSXRCLFFBQVE7c0JBRFgsS0FBSztnQkFXRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1RSRUVfTk9ERV9PVVRMRVRfTk9ERSxcbiAgQ2RrTmVzdGVkVHJlZU5vZGUsXG4gIENka1RyZWUsXG4gIENka1RyZWVOb2RlLFxuICBDZGtUcmVlTm9kZURlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgsIG1peGluRGlzYWJsZWQsIG1peGluVGFiSW5kZXh9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuY29uc3QgX01hdFRyZWVOb2RlQmFzZSA9IG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChDZGtUcmVlTm9kZSkpO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIG5vZGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXRUcmVlTm9kZScsXG4gIGlucHV0czogWydyb2xlJywgJ2Rpc2FibGVkJywgJ3RhYkluZGV4J10sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlfV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRyZWUtbm9kZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlPFQsIEsgPSBUPlxuICBleHRlbmRzIF9NYXRUcmVlTm9kZUJhc2U8VCwgSz5cbiAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBIYXNUYWJJbmRleCwgT25Jbml0LCBPbkRlc3Ryb3lcbntcbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgdHJlZTogQ2RrVHJlZTxULCBLPixcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHRyZWUpO1xuICAgIHRoaXMudGFiSW5kZXggPSBOdW1iZXIodGFiSW5kZXgpIHx8IDA7XG4gIH1cblxuICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjMwOTFcbiAgLy8gSW4gYW90IG1vZGUsIHRoZSBsaWZlY3ljbGUgaG9va3MgZnJvbSBwYXJlbnQgY2xhc3MgYXJlIG5vdCBjYWxsZWQuXG4gIG92ZXJyaWRlIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICB9XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgbm9kZSBkZWZpbml0aW9uIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqIENhcHR1cmVzIHRoZSBub2RlJ3MgdGVtcGxhdGUgYW5kIGEgd2hlbiBwcmVkaWNhdGUgdGhhdCBkZXNjcmliZXMgd2hlbiB0aGlzIG5vZGUgc2hvdWxkIGJlIHVzZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZURlZl0nLFxuICBpbnB1dHM6IFsnd2hlbjogbWF0VHJlZU5vZGVEZWZXaGVuJ10sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZURlZiwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlRGVmfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlRGVmPFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVEZWY8VD4ge1xuICBASW5wdXQoJ21hdFRyZWVOb2RlJykgZGF0YTogVDtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBuZXN0ZWQgbm9kZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1uZXN0ZWQtdHJlZS1ub2RlJyxcbiAgZXhwb3J0QXM6ICdtYXROZXN0ZWRUcmVlTm9kZScsXG4gIGlucHV0czogWydyb2xlJywgJ2Rpc2FibGVkJywgJ3RhYkluZGV4J10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtOZXN0ZWRUcmVlTm9kZSwgdXNlRXhpc3Rpbmc6IE1hdE5lc3RlZFRyZWVOb2RlfSxcbiAgICB7cHJvdmlkZTogQ2RrVHJlZU5vZGUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gICAge3Byb3ZpZGU6IENES19UUkVFX05PREVfT1VUTEVUX05PREUsIHVzZUV4aXN0aW5nOiBNYXROZXN0ZWRUcmVlTm9kZX0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW5lc3RlZC10cmVlLW5vZGUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXROZXN0ZWRUcmVlTm9kZTxULCBLID0gVD5cbiAgZXh0ZW5kcyBDZGtOZXN0ZWRUcmVlTm9kZTxULCBLPlxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgT25Jbml0XG57XG4gIEBJbnB1dCgnbWF0TmVzdGVkVHJlZU5vZGUnKSBub2RlOiBUO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBub2RlIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFRhYmluZGV4IGZvciB0aGUgbm9kZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAtMSA6IHRoaXMuX3RhYkluZGV4O1xuICB9XG4gIHNldCB0YWJJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gSWYgdGhlIHNwZWNpZmllZCB0YWJJbmRleCB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogMDtcbiAgfVxuICBwcml2YXRlIF90YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHRyZWU6IENka1RyZWU8VCwgSz4sXG4gICAgZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgdHJlZSwgZGlmZmVycyk7XG4gICAgdGhpcy50YWJJbmRleCA9IE51bWJlcih0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xOTE0NVxuICAvLyBJbiBhb3QgbW9kZSwgdGhlIGxpZmVjeWNsZSBob29rcyBmcm9tIHBhcmVudCBjbGFzcyBhcmUgbm90IGNhbGxlZC5cbiAgLy8gVE9ETyh0aW5heXVhbmdhbyk6IFJlbW92ZSB3aGVuIHRoZSBhbmd1bGFyIGlzc3VlICMxOTE0NSBpcyBmaXhlZFxuICBvdmVycmlkZSBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxufVxuIl19