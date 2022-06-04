/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, Directive, ElementRef, InjectionToken, Input } from '@angular/core';
import * as i0 from "@angular/core";
let nextUniqueId = 0;
/**
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_ERROR = new InjectionToken('MatError');
/** Single error message to be shown underneath the form field. */
export class MatError {
    constructor(ariaLive, elementRef) {
        this.id = `mat-error-${nextUniqueId++}`;
        // If no aria-live value is set add 'polite' as a default. This is preferred over setting
        // role='alert' so that screen readers do not interrupt the current task to read this aloud.
        if (!ariaLive) {
            elementRef.nativeElement.setAttribute('aria-live', 'polite');
        }
    }
}
MatError.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatError, deps: [{ token: 'aria-live', attribute: true }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MatError.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatError, selector: "mat-error", inputs: { id: "id" }, host: { attributes: { "aria-atomic": "true" }, properties: { "attr.id": "id" }, classAttribute: "mat-error" }, providers: [{ provide: MAT_ERROR, useExisting: MatError }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatError, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-error',
                    host: {
                        'class': 'mat-error',
                        '[attr.id]': 'id',
                        'aria-atomic': 'true',
                    },
                    providers: [{ provide: MAT_ERROR, useExisting: MatError }],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }, { type: i0.ElementRef }]; }, propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFdEYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxjQUFjLENBQVcsVUFBVSxDQUFDLENBQUM7QUFFbEUsa0VBQWtFO0FBVWxFLE1BQU0sT0FBTyxRQUFRO0lBR25CLFlBQW9DLFFBQWdCLEVBQUUsVUFBc0I7UUFGbkUsT0FBRSxHQUFXLGFBQWEsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQUdsRCx5RkFBeUY7UUFDekYsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDOztxR0FUVSxRQUFRLGtCQUdJLFdBQVc7eUZBSHZCLFFBQVEseUtBRlIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQyxDQUFDOzJGQUU3QyxRQUFRO2tCQVRwQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO29CQUNyQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixhQUFhLEVBQUUsTUFBTTtxQkFDdEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsVUFBVSxFQUFDLENBQUM7aUJBQ3pEOzswQkFJYyxTQUFTOzJCQUFDLFdBQVc7cUVBRnpCLEVBQUU7c0JBQVYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0F0dHJpYnV0ZSwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRFcnJvcmAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0RXJyb3JgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0VSUk9SID0gbmV3IEluamVjdGlvblRva2VuPE1hdEVycm9yPignTWF0RXJyb3InKTtcblxuLyoqIFNpbmdsZSBlcnJvciBtZXNzYWdlIHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZXJyb3InLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1lcnJvcicsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ2FyaWEtYXRvbWljJzogJ3RydWUnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0VSUk9SLCB1c2VFeGlzdGluZzogTWF0RXJyb3J9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXJyb3Ige1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1lcnJvci0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoQEF0dHJpYnV0ZSgnYXJpYS1saXZlJykgYXJpYUxpdmU6IHN0cmluZywgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIC8vIElmIG5vIGFyaWEtbGl2ZSB2YWx1ZSBpcyBzZXQgYWRkICdwb2xpdGUnIGFzIGEgZGVmYXVsdC4gVGhpcyBpcyBwcmVmZXJyZWQgb3ZlciBzZXR0aW5nXG4gICAgLy8gcm9sZT0nYWxlcnQnIHNvIHRoYXQgc2NyZWVuIHJlYWRlcnMgZG8gbm90IGludGVycnVwdCB0aGUgY3VycmVudCB0YXNrIHRvIHJlYWQgdGhpcyBhbG91ZC5cbiAgICBpZiAoIWFyaWFMaXZlKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG4gICAgfVxuICB9XG59XG4iXX0=