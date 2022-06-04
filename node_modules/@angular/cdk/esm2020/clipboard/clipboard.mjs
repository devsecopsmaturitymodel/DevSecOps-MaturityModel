/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { PendingCopy } from './pending-copy';
import * as i0 from "@angular/core";
/**
 * A service for copying text to the clipboard.
 */
export class Clipboard {
    constructor(document) {
        this._document = document;
    }
    /**
     * Copies the provided text into the user's clipboard.
     *
     * @param text The string to copy.
     * @returns Whether the operation was successful.
     */
    copy(text) {
        const pendingCopy = this.beginCopy(text);
        const successful = pendingCopy.copy();
        pendingCopy.destroy();
        return successful;
    }
    /**
     * Prepares a string to be copied later. This is useful for large strings
     * which take too long to successfully render and be copied in the same tick.
     *
     * The caller must call `destroy` on the returned `PendingCopy`.
     *
     * @param text The string to copy.
     * @returns the pending copy operation.
     */
    beginCopy(text) {
        return new PendingCopy(text, this._document);
    }
}
Clipboard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Clipboard, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
Clipboard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Clipboard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Clipboard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcGJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jbGlwYm9hcmQvY2xpcGJvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTNDOztHQUVHO0FBRUgsTUFBTSxPQUFPLFNBQVM7SUFHcEIsWUFBOEIsUUFBYTtRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxJQUFJLENBQUMsSUFBWTtRQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV0QixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxTQUFTLENBQUMsSUFBWTtRQUNwQixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7c0dBaENVLFNBQVMsa0JBR0EsUUFBUTswR0FIakIsU0FBUyxjQURHLE1BQU07MkZBQ2xCLFNBQVM7a0JBRHJCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFJakIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BlbmRpbmdDb3B5fSBmcm9tICcuL3BlbmRpbmctY29weSc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIGZvciBjb3B5aW5nIHRleHQgdG8gdGhlIGNsaXBib2FyZC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQ2xpcGJvYXJkIHtcbiAgcHJpdmF0ZSByZWFkb25seSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyB0aGUgcHJvdmlkZWQgdGV4dCBpbnRvIHRoZSB1c2VyJ3MgY2xpcGJvYXJkLlxuICAgKlxuICAgKiBAcGFyYW0gdGV4dCBUaGUgc3RyaW5nIHRvIGNvcHkuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bC5cbiAgICovXG4gIGNvcHkodGV4dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVuZGluZ0NvcHkgPSB0aGlzLmJlZ2luQ29weSh0ZXh0KTtcbiAgICBjb25zdCBzdWNjZXNzZnVsID0gcGVuZGluZ0NvcHkuY29weSgpO1xuICAgIHBlbmRpbmdDb3B5LmRlc3Ryb3koKTtcblxuICAgIHJldHVybiBzdWNjZXNzZnVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmVzIGEgc3RyaW5nIHRvIGJlIGNvcGllZCBsYXRlci4gVGhpcyBpcyB1c2VmdWwgZm9yIGxhcmdlIHN0cmluZ3NcbiAgICogd2hpY2ggdGFrZSB0b28gbG9uZyB0byBzdWNjZXNzZnVsbHkgcmVuZGVyIGFuZCBiZSBjb3BpZWQgaW4gdGhlIHNhbWUgdGljay5cbiAgICpcbiAgICogVGhlIGNhbGxlciBtdXN0IGNhbGwgYGRlc3Ryb3lgIG9uIHRoZSByZXR1cm5lZCBgUGVuZGluZ0NvcHlgLlxuICAgKlxuICAgKiBAcGFyYW0gdGV4dCBUaGUgc3RyaW5nIHRvIGNvcHkuXG4gICAqIEByZXR1cm5zIHRoZSBwZW5kaW5nIGNvcHkgb3BlcmF0aW9uLlxuICAgKi9cbiAgYmVnaW5Db3B5KHRleHQ6IHN0cmluZyk6IFBlbmRpbmdDb3B5IHtcbiAgICByZXR1cm4gbmV3IFBlbmRpbmdDb3B5KHRleHQsIHRoaXMuX2RvY3VtZW50KTtcbiAgfVxufVxuIl19