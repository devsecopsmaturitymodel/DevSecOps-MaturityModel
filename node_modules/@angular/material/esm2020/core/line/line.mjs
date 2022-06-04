/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule, Directive } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { MatCommonModule } from '../common-behaviors/common-module';
import * as i0 from "@angular/core";
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
export class MatLine {
}
MatLine.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLine, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatLine.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatLine, selector: "[mat-line], [matLine]", host: { classAttribute: "mat-line" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLine, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-line], [matLine]',
                    host: { 'class': 'mat-line' },
                }]
        }] });
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
export function setLines(lines, element, prefix = 'mat') {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    lines.changes.pipe(startWith(lines)).subscribe(({ length }) => {
        setClass(element, `${prefix}-2-line`, false);
        setClass(element, `${prefix}-3-line`, false);
        setClass(element, `${prefix}-multi-line`, false);
        if (length === 2 || length === 3) {
            setClass(element, `${prefix}-${length}-line`, true);
        }
        else if (length > 3) {
            setClass(element, `${prefix}-multi-line`, true);
        }
    });
}
/** Adds or removes a class from an element. */
function setClass(element, className, isAdd) {
    element.nativeElement.classList.toggle(className, isAdd);
}
export class MatLineModule {
}
MatLineModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLineModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLineModule, declarations: [MatLine], imports: [MatCommonModule], exports: [MatLine, MatCommonModule] });
MatLineModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLineModule, imports: [[MatCommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatLineModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: [MatLine, MatCommonModule],
                    declarations: [MatLine],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xpbmUvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBd0IsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFFbEU7Ozs7R0FJRztBQUtILE1BQU0sT0FBTyxPQUFPOztvR0FBUCxPQUFPO3dGQUFQLE9BQU87MkZBQVAsT0FBTztrQkFKbkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDO2lCQUM1Qjs7QUFHRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUN0QixLQUF5QixFQUN6QixPQUFnQyxFQUNoQyxNQUFNLEdBQUcsS0FBSztJQUVkLHVEQUF1RDtJQUN2RCx3REFBd0Q7SUFDeEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFFO1FBQzFELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpELElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLElBQUksTUFBTSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckQ7YUFBTSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsK0NBQStDO0FBQy9DLFNBQVMsUUFBUSxDQUFDLE9BQWdDLEVBQUUsU0FBaUIsRUFBRSxLQUFjO0lBQ25GLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQU9ELE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBcENiLE9BQU8sYUFnQ1IsZUFBZSxhQWhDZCxPQUFPLEVBaUNDLGVBQWU7MkdBR3ZCLGFBQWEsWUFKZixDQUFDLGVBQWUsQ0FBQyxFQUNQLGVBQWU7MkZBR3ZCLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO29CQUNuQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGUsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLWJlaGF2aW9ycy9jb21tb24tbW9kdWxlJztcblxuLyoqXG4gKiBTaGFyZWQgZGlyZWN0aXZlIHRvIGNvdW50IGxpbmVzIGluc2lkZSBhIHRleHQgYXJlYSwgc3VjaCBhcyBhIGxpc3QgaXRlbS5cbiAqIExpbmUgZWxlbWVudHMgY2FuIGJlIGV4dHJhY3RlZCB3aXRoIGEgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lKSBxdWVyeSwgdGhlblxuICogY291bnRlZCBieSBjaGVja2luZyB0aGUgcXVlcnkgbGlzdCdzIGxlbmd0aC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1saW5lXSwgW21hdExpbmVdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbGluZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaW5lIHt9XG5cbi8qKlxuICogSGVscGVyIHRoYXQgdGFrZXMgYSBxdWVyeSBsaXN0IG9mIGxpbmVzIGFuZCBzZXRzIHRoZSBjb3JyZWN0IGNsYXNzIG9uIHRoZSBob3N0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TGluZXMoXG4gIGxpbmVzOiBRdWVyeUxpc3Q8dW5rbm93bj4sXG4gIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBwcmVmaXggPSAnbWF0Jyxcbikge1xuICAvLyBOb3RlOiBkb2Vzbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUsIGJlY2F1c2UgYGNoYW5nZXNgXG4gIC8vIGdldHMgY29tcGxldGVkIGJ5IEFuZ3VsYXIgd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWQuXG4gIGxpbmVzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobGluZXMpKS5zdWJzY3JpYmUoKHtsZW5ndGh9KSA9PiB7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0yLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0zLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS1tdWx0aS1saW5lYCwgZmFsc2UpO1xuXG4gICAgaWYgKGxlbmd0aCA9PT0gMiB8fCBsZW5ndGggPT09IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tJHtsZW5ndGh9LWxpbmVgLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tbXVsdGktbGluZWAsIHRydWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKiBBZGRzIG9yIHJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuICovXG5mdW5jdGlvbiBzZXRDbGFzcyhlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgY2xhc3NOYW1lOiBzdHJpbmcsIGlzQWRkOiBib29sZWFuKTogdm9pZCB7XG4gIGVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSwgaXNBZGQpO1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdExpbmUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdExpbmVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaW5lTW9kdWxlIHt9XG4iXX0=