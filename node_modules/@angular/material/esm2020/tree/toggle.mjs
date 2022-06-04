/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
export class MatTreeNodeToggle extends CdkTreeNodeToggle {
}
MatTreeNodeToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTreeNodeToggle, selector: "[matTreeNodeToggle]", inputs: { recursive: ["matTreeNodeToggleRecursive", "recursive"] }, providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }],
                    inputs: ['recursive: matTreeNodeToggleRecursive'],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXhDOztHQUVHO0FBTUgsTUFBTSxPQUFPLGlCQUE0QixTQUFRLGlCQUF1Qjs7OEdBQTNELGlCQUFpQjtrR0FBakIsaUJBQWlCLGtIQUhqQixDQUFDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDOzJGQUc5RCxpQkFBaUI7a0JBTDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxtQkFBbUIsRUFBQyxDQUFDO29CQUN6RSxNQUFNLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQztpQkFDbEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtUcmVlTm9kZVRvZ2dsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlJ3MgdG9nZ2xlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlVG9nZ2xlXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZVRvZ2dsZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlVG9nZ2xlfV0sXG4gIGlucHV0czogWydyZWN1cnNpdmU6IG1hdFRyZWVOb2RlVG9nZ2xlUmVjdXJzaXZlJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlVG9nZ2xlPFQsIEsgPSBUPiBleHRlbmRzIENka1RyZWVOb2RlVG9nZ2xlPFQsIEs+IHt9XG4iXX0=