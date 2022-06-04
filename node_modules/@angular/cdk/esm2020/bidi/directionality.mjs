/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, Inject, Injectable, Optional } from '@angular/core';
import { DIR_DOCUMENT } from './dir-document-token';
import * as i0 from "@angular/core";
/** Regex that matches locales with an RTL script. Taken from `goog.i18n.bidi.isRtlLanguage`. */
const RTL_LOCALE_PATTERN = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
/** Resolves a string value to a specific direction. */
export function _resolveDirectionality(rawValue) {
    const value = rawValue?.toLowerCase() || '';
    if (value === 'auto' && typeof navigator !== 'undefined' && navigator?.language) {
        return RTL_LOCALE_PATTERN.test(navigator.language) ? 'rtl' : 'ltr';
    }
    return value === 'rtl' ? 'rtl' : 'ltr';
}
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
export class Directionality {
    constructor(_document) {
        /** The current 'ltr' or 'rtl' value. */
        this.value = 'ltr';
        /** Stream that emits whenever the 'ltr' / 'rtl' state changes. */
        this.change = new EventEmitter();
        if (_document) {
            const bodyDir = _document.body ? _document.body.dir : null;
            const htmlDir = _document.documentElement ? _document.documentElement.dir : null;
            this.value = _resolveDirectionality(bodyDir || htmlDir || 'ltr');
        }
    }
    ngOnDestroy() {
        this.change.complete();
    }
}
Directionality.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Directionality, deps: [{ token: DIR_DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
Directionality.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Directionality, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Directionality, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DIR_DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aW9uYWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2JpZGkvZGlyZWN0aW9uYWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7O0FBSWxELGdHQUFnRztBQUNoRyxNQUFNLGtCQUFrQixHQUN0QixvSEFBb0gsQ0FBQztBQUV2SCx1REFBdUQ7QUFDdkQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLFFBQWdCO0lBQ3JELE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFFNUMsSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsUUFBUSxFQUFFO1FBQy9FLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDcEU7SUFFRCxPQUFPLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3pDLENBQUM7QUFFRDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sY0FBYztJQU96QixZQUE4QyxTQUFlO1FBTjdELHdDQUF3QztRQUMvQixVQUFLLEdBQWMsS0FBSyxDQUFDO1FBRWxDLGtFQUFrRTtRQUN6RCxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQUc5QyxJQUFJLFNBQVMsRUFBRTtZQUNiLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDM0QsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqRixJQUFJLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFDLE9BQU8sSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQzs7MkdBakJVLGNBQWMsa0JBT08sWUFBWTsrR0FQakMsY0FBYyxjQURGLE1BQU07MkZBQ2xCLGNBQWM7a0JBRDFCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFRakIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyLCBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtESVJfRE9DVU1FTlR9IGZyb20gJy4vZGlyLWRvY3VtZW50LXRva2VuJztcblxuZXhwb3J0IHR5cGUgRGlyZWN0aW9uID0gJ2x0cicgfCAncnRsJztcblxuLyoqIFJlZ2V4IHRoYXQgbWF0Y2hlcyBsb2NhbGVzIHdpdGggYW4gUlRMIHNjcmlwdC4gVGFrZW4gZnJvbSBgZ29vZy5pMThuLmJpZGkuaXNSdGxMYW5ndWFnZWAuICovXG5jb25zdCBSVExfTE9DQUxFX1BBVFRFUk4gPVxuICAvXihhcnxja2J8ZHZ8aGV8aXd8ZmF8bnFvfHBzfHNkfHVnfHVyfHlpfC4qWy1fXShBZGxtfEFyYWJ8SGVicnxOa29vfFJvaGd8VGhhYSkpKD8hLipbLV9dKExhdG58Q3lybCkoJHwtfF8pKSgkfC18XykvaTtcblxuLyoqIFJlc29sdmVzIGEgc3RyaW5nIHZhbHVlIHRvIGEgc3BlY2lmaWMgZGlyZWN0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9yZXNvbHZlRGlyZWN0aW9uYWxpdHkocmF3VmFsdWU6IHN0cmluZyk6IERpcmVjdGlvbiB7XG4gIGNvbnN0IHZhbHVlID0gcmF3VmFsdWU/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgaWYgKHZhbHVlID09PSAnYXV0bycgJiYgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yPy5sYW5ndWFnZSkge1xuICAgIHJldHVybiBSVExfTE9DQUxFX1BBVFRFUk4udGVzdChuYXZpZ2F0b3IubGFuZ3VhZ2UpID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xufVxuXG4vKipcbiAqIFRoZSBkaXJlY3Rpb25hbGl0eSAoTFRSIC8gUlRMKSBjb250ZXh0IGZvciB0aGUgYXBwbGljYXRpb24gKG9yIGEgc3VidHJlZSBvZiBpdCkuXG4gKiBFeHBvc2VzIHRoZSBjdXJyZW50IGRpcmVjdGlvbiBhbmQgYSBzdHJlYW0gb2YgZGlyZWN0aW9uIGNoYW5nZXMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbmFsaXR5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIFRoZSBjdXJyZW50ICdsdHInIG9yICdydGwnIHZhbHVlLiAqL1xuICByZWFkb25seSB2YWx1ZTogRGlyZWN0aW9uID0gJ2x0cic7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSAnbHRyJyAvICdydGwnIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RGlyZWN0aW9uPigpO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoRElSX0RPQ1VNRU5UKSBfZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICBpZiAoX2RvY3VtZW50KSB7XG4gICAgICBjb25zdCBib2R5RGlyID0gX2RvY3VtZW50LmJvZHkgPyBfZG9jdW1lbnQuYm9keS5kaXIgOiBudWxsO1xuICAgICAgY29uc3QgaHRtbERpciA9IF9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgPyBfZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRpciA6IG51bGw7XG4gICAgICB0aGlzLnZhbHVlID0gX3Jlc29sdmVEaXJlY3Rpb25hbGl0eShib2R5RGlyIHx8IGh0bWxEaXIgfHwgJ2x0cicpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==