/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, InjectionToken, Input } from '@angular/core';
import * as i0 from "@angular/core";
let nextUniqueId = 0;
/**
 * Injection token that can be used to reference instances of `MatHint`. It serves as
 * alternative token to the actual `MatHint` class which could cause unnecessary
 * retention of the class and its directive metadata.
 *
 * *Note*: This is not part of the public API as the MDC-based form-field will not
 * need a lightweight token for `MatHint` and we want to reduce breaking changes.
 */
export const _MAT_HINT = new InjectionToken('MatHint');
/** Hint text to be shown underneath the form field control. */
export class MatHint {
    constructor() {
        /** Whether to align the hint label at the start or end of the line. */
        this.align = 'start';
        /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
        this.id = `mat-hint-${nextUniqueId++}`;
    }
}
MatHint.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatHint, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatHint.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatHint, selector: "mat-hint", inputs: { align: "align", id: "id" }, host: { properties: { "class.mat-form-field-hint-end": "align === \"end\"", "attr.id": "id", "attr.align": "null" }, classAttribute: "mat-hint" }, providers: [{ provide: _MAT_HINT, useExisting: MatHint }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatHint, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-hint',
                    host: {
                        'class': 'mat-hint',
                        '[class.mat-form-field-hint-end]': 'align === "end"',
                        '[attr.id]': 'id',
                        // Remove align attribute to prevent it from interfering with layout.
                        '[attr.align]': 'null',
                    },
                    providers: [{ provide: _MAT_HINT, useExisting: MatHint }],
                }]
        }], propDecorators: { align: [{
                type: Input
            }], id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2hpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUUvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7Ozs7Ozs7R0FPRztBQUNILE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FBVSxTQUFTLENBQUMsQ0FBQztBQUVoRSwrREFBK0Q7QUFZL0QsTUFBTSxPQUFPLE9BQU87SUFYcEI7UUFZRSx1RUFBdUU7UUFDOUQsVUFBSyxHQUFvQixPQUFPLENBQUM7UUFFMUMsdUZBQXVGO1FBQzlFLE9BQUUsR0FBVyxZQUFZLFlBQVksRUFBRSxFQUFFLENBQUM7S0FDcEQ7O29HQU5ZLE9BQU87d0ZBQVAsT0FBTyw0TkFGUCxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDLENBQUM7MkZBRTVDLE9BQU87a0JBWG5CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsVUFBVTt3QkFDbkIsaUNBQWlDLEVBQUUsaUJBQWlCO3dCQUNwRCxXQUFXLEVBQUUsSUFBSTt3QkFDakIscUVBQXFFO3dCQUNyRSxjQUFjLEVBQUUsTUFBTTtxQkFDdkI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsU0FBUyxFQUFDLENBQUM7aUJBQ3hEOzhCQUdVLEtBQUs7c0JBQWIsS0FBSztnQkFHRyxFQUFFO3NCQUFWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdGlvblRva2VuLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdEhpbnRgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdEhpbnRgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICpcbiAqICpOb3RlKjogVGhpcyBpcyBub3QgcGFydCBvZiB0aGUgcHVibGljIEFQSSBhcyB0aGUgTURDLWJhc2VkIGZvcm0tZmllbGQgd2lsbCBub3RcbiAqIG5lZWQgYSBsaWdodHdlaWdodCB0b2tlbiBmb3IgYE1hdEhpbnRgIGFuZCB3ZSB3YW50IHRvIHJlZHVjZSBicmVha2luZyBjaGFuZ2VzLlxuICovXG5leHBvcnQgY29uc3QgX01BVF9ISU5UID0gbmV3IEluamVjdGlvblRva2VuPE1hdEhpbnQ+KCdNYXRIaW50Jyk7XG5cbi8qKiBIaW50IHRleHQgdG8gYmUgc2hvd24gdW5kZXJuZWF0aCB0aGUgZm9ybSBmaWVsZCBjb250cm9sLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWhpbnQnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oaW50JyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpbnQtZW5kXSc6ICdhbGlnbiA9PT0gXCJlbmRcIicsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgLy8gUmVtb3ZlIGFsaWduIGF0dHJpYnV0ZSB0byBwcmV2ZW50IGl0IGZyb20gaW50ZXJmZXJpbmcgd2l0aCBsYXlvdXQuXG4gICAgJ1thdHRyLmFsaWduXSc6ICdudWxsJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IF9NQVRfSElOVCwgdXNlRXhpc3Rpbmc6IE1hdEhpbnR9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SGludCB7XG4gIC8qKiBXaGV0aGVyIHRvIGFsaWduIHRoZSBoaW50IGxhYmVsIGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIGxpbmUuICovXG4gIEBJbnB1dCgpIGFsaWduOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBoaW50LiBVc2VkIGZvciB0aGUgYXJpYS1kZXNjcmliZWRieSBvbiB0aGUgZm9ybSBmaWVsZCBjb250cm9sLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbn1cbiJdfQ==