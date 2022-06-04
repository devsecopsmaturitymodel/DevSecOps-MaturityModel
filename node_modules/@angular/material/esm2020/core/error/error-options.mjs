/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/** Error state matcher that matches when a control is invalid and dirty. */
export class ShowOnDirtyErrorStateMatcher {
    isErrorState(control, form) {
        return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
    }
}
ShowOnDirtyErrorStateMatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ShowOnDirtyErrorStateMatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher, decorators: [{
            type: Injectable
        }] });
/** Provider that defines how form controls behave with regards to displaying error messages. */
export class ErrorStateMatcher {
    isErrorState(control, form) {
        return !!(control && control.invalid && (control.touched || (form && form.submitted)));
    }
}
ErrorStateMatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ErrorStateMatcher, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ErrorStateMatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ErrorStateMatcher, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ErrorStateMatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2Vycm9yL2Vycm9yLW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFHekMsNEVBQTRFO0FBRTVFLE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsWUFBWSxDQUFDLE9BQStCLEVBQUUsSUFBd0M7UUFDcEYsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDOzt5SEFIVSw0QkFBNEI7NkhBQTVCLDRCQUE0QjsyRkFBNUIsNEJBQTRCO2tCQUR4QyxVQUFVOztBQU9YLGdHQUFnRztBQUVoRyxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQVksQ0FBQyxPQUErQixFQUFFLElBQXdDO1FBQ3BGLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQzs7OEdBSFUsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FETCxNQUFNOzJGQUNsQixpQkFBaUI7a0JBRDdCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZSwgTmdGb3JtLCBBYnN0cmFjdENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLyoqIEVycm9yIHN0YXRlIG1hdGNoZXIgdGhhdCBtYXRjaGVzIHdoZW4gYSBjb250cm9sIGlzIGludmFsaWQgYW5kIGRpcnR5LiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNob3dPbkRpcnR5RXJyb3JTdGF0ZU1hdGNoZXIgaW1wbGVtZW50cyBFcnJvclN0YXRlTWF0Y2hlciB7XG4gIGlzRXJyb3JTdGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wgfCBudWxsLCBmb3JtOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBOZ0Zvcm0gfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKGNvbnRyb2wgJiYgY29udHJvbC5pbnZhbGlkICYmIChjb250cm9sLmRpcnR5IHx8IChmb3JtICYmIGZvcm0uc3VibWl0dGVkKSkpO1xuICB9XG59XG5cbi8qKiBQcm92aWRlciB0aGF0IGRlZmluZXMgaG93IGZvcm0gY29udHJvbHMgYmVoYXZlIHdpdGggcmVnYXJkcyB0byBkaXNwbGF5aW5nIGVycm9yIG1lc3NhZ2VzLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgRXJyb3JTdGF0ZU1hdGNoZXIge1xuICBpc0Vycm9yU3RhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiAoY29udHJvbC50b3VjaGVkIHx8IChmb3JtICYmIGZvcm0uc3VibWl0dGVkKSkpO1xuICB9XG59XG4iXX0=