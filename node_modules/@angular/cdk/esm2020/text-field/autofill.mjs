/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Directive, ElementRef, EventEmitter, Injectable, NgZone, Output, } from '@angular/core';
import { coerceElement } from '@angular/cdk/coercion';
import { EMPTY, Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Options to pass to the animationstart listener. */
const listenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * An injectable service that can be used to monitor the autofill state of an input.
 * Based on the following blog post:
 * https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7
 */
export class AutofillMonitor {
    constructor(_platform, _ngZone) {
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._monitoredElements = new Map();
    }
    monitor(elementOrRef) {
        if (!this._platform.isBrowser) {
            return EMPTY;
        }
        const element = coerceElement(elementOrRef);
        const info = this._monitoredElements.get(element);
        if (info) {
            return info.subject;
        }
        const result = new Subject();
        const cssClass = 'cdk-text-field-autofilled';
        const listener = ((event) => {
            // Animation events fire on initial element render, we check for the presence of the autofill
            // CSS class to make sure this is a real change in state, not just the initial render before
            // we fire off events.
            if (event.animationName === 'cdk-text-field-autofill-start' &&
                !element.classList.contains(cssClass)) {
                element.classList.add(cssClass);
                this._ngZone.run(() => result.next({ target: event.target, isAutofilled: true }));
            }
            else if (event.animationName === 'cdk-text-field-autofill-end' &&
                element.classList.contains(cssClass)) {
                element.classList.remove(cssClass);
                this._ngZone.run(() => result.next({ target: event.target, isAutofilled: false }));
            }
        });
        this._ngZone.runOutsideAngular(() => {
            element.addEventListener('animationstart', listener, listenerOptions);
            element.classList.add('cdk-text-field-autofill-monitored');
        });
        this._monitoredElements.set(element, {
            subject: result,
            unlisten: () => {
                element.removeEventListener('animationstart', listener, listenerOptions);
            },
        });
        return result;
    }
    stopMonitoring(elementOrRef) {
        const element = coerceElement(elementOrRef);
        const info = this._monitoredElements.get(element);
        if (info) {
            info.unlisten();
            info.subject.complete();
            element.classList.remove('cdk-text-field-autofill-monitored');
            element.classList.remove('cdk-text-field-autofilled');
            this._monitoredElements.delete(element);
        }
    }
    ngOnDestroy() {
        this._monitoredElements.forEach((_info, element) => this.stopMonitoring(element));
    }
}
AutofillMonitor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AutofillMonitor, deps: [{ token: i1.Platform }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
AutofillMonitor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AutofillMonitor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AutofillMonitor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }, { type: i0.NgZone }]; } });
/** A directive that can be used to monitor the autofill state of an input. */
export class CdkAutofill {
    constructor(_elementRef, _autofillMonitor) {
        this._elementRef = _elementRef;
        this._autofillMonitor = _autofillMonitor;
        /** Emits when the autofill state of the element changes. */
        this.cdkAutofill = new EventEmitter();
    }
    ngOnInit() {
        this._autofillMonitor
            .monitor(this._elementRef)
            .subscribe(event => this.cdkAutofill.emit(event));
    }
    ngOnDestroy() {
        this._autofillMonitor.stopMonitoring(this._elementRef);
    }
}
CdkAutofill.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAutofill, deps: [{ token: i0.ElementRef }, { token: AutofillMonitor }], target: i0.ɵɵFactoryTarget.Directive });
CdkAutofill.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkAutofill, selector: "[cdkAutofill]", outputs: { cdkAutofill: "cdkAutofill" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAutofill, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkAutofill]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: AutofillMonitor }]; }, propDecorators: { cdkAutofill: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2ZpbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3RleHQtZmllbGQvYXV0b2ZpbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUdOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7OztBQWdCaEQsc0RBQXNEO0FBQ3RELE1BQU0sZUFBZSxHQUFHLCtCQUErQixDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFekU7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBRzFCLFlBQW9CLFNBQW1CLEVBQVUsT0FBZTtRQUE1QyxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUZ4RCx1QkFBa0IsR0FBRyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztJQUVILENBQUM7SUFnQnBFLE9BQU8sQ0FBQyxZQUEyQztRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxELElBQUksSUFBSSxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JC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aEMsOEVBQThFO0FBSTlFLE1BQU0sT0FBTyxXQUFXO0lBSXRCLFlBQ1UsV0FBb0MsRUFDcEMsZ0JBQWlDO1FBRGpDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO1FBTDNDLDREQUE0RDtRQUN6QyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFpQixDQUFDO0lBS2hFLENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLGdCQUFnQjthQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN6QixTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7d0dBakJVLFdBQVcsNENBTU0sZUFBZTs0RkFOaEMsV0FBVzsyRkFBWCxXQUFXO2tCQUh2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO2lCQUMxQjttRkFPNkIsZUFBZSwwQkFKeEIsV0FBVztzQkFBN0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvZXJjZUVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VNUFRZLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIEFuIGV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvZmlsbCBzdGF0ZSBvZiBhbiBpbnB1dCBjaGFuZ2VzLiAqL1xuZXhwb3J0IHR5cGUgQXV0b2ZpbGxFdmVudCA9IHtcbiAgLyoqIFRoZSBlbGVtZW50IHdob3NlIGF1dG9maWxsIHN0YXRlIGNoYW5nZXMuICovXG4gIHRhcmdldDogRWxlbWVudDtcbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgY3VycmVudGx5IGF1dG9maWxsZWQuICovXG4gIGlzQXV0b2ZpbGxlZDogYm9vbGVhbjtcbn07XG5cbi8qKiBVc2VkIHRvIHRyYWNrIGluZm8gYWJvdXQgY3VycmVudGx5IG1vbml0b3JlZCBlbGVtZW50cy4gKi9cbnR5cGUgTW9uaXRvcmVkRWxlbWVudEluZm8gPSB7XG4gIHJlYWRvbmx5IHN1YmplY3Q6IFN1YmplY3Q8QXV0b2ZpbGxFdmVudD47XG4gIHVubGlzdGVuOiAoKSA9PiB2b2lkO1xufTtcblxuLyoqIE9wdGlvbnMgdG8gcGFzcyB0byB0aGUgYW5pbWF0aW9uc3RhcnQgbGlzdGVuZXIuICovXG5jb25zdCBsaXN0ZW5lck9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8qKlxuICogQW4gaW5qZWN0YWJsZSBzZXJ2aWNlIHRoYXQgY2FuIGJlIHVzZWQgdG8gbW9uaXRvciB0aGUgYXV0b2ZpbGwgc3RhdGUgb2YgYW4gaW5wdXQuXG4gKiBCYXNlZCBvbiB0aGUgZm9sbG93aW5nIGJsb2cgcG9zdDpcbiAqIGh0dHBzOi8vbWVkaXVtLmNvbS9AYnJ1bm4vZGV0ZWN0aW5nLWF1dG9maWxsZWQtZmllbGRzLWluLWphdmFzY3JpcHQtYWVkNTk4ZDI1ZGE3XG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEF1dG9maWxsTW9uaXRvciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX21vbml0b3JlZEVsZW1lbnRzID0gbmV3IE1hcDxFbGVtZW50LCBNb25pdG9yZWRFbGVtZW50SW5mbz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKlxuICAgKiBNb25pdG9yIGZvciBjaGFuZ2VzIGluIHRoZSBhdXRvZmlsbCBzdGF0ZSBvZiB0aGUgZ2l2ZW4gaW5wdXQgZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gbW9uaXRvci5cbiAgICogQHJldHVybiBBIHN0cmVhbSBvZiBhdXRvZmlsbCBzdGF0ZSBjaGFuZ2VzLlxuICAgKi9cbiAgbW9uaXRvcihlbGVtZW50OiBFbGVtZW50KTogT2JzZXJ2YWJsZTxBdXRvZmlsbEV2ZW50PjtcblxuICAvKipcbiAgICogTW9uaXRvciBmb3IgY2hhbmdlcyBpbiB0aGUgYXV0b2ZpbGwgc3RhdGUgb2YgdGhlIGdpdmVuIGlucHV0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIG1vbml0b3IuXG4gICAqIEByZXR1cm4gQSBzdHJlYW0gb2YgYXV0b2ZpbGwgc3RhdGUgY2hhbmdlcy5cbiAgICovXG4gIG1vbml0b3IoZWxlbWVudDogRWxlbWVudFJlZjxFbGVtZW50Pik6IE9ic2VydmFibGU8QXV0b2ZpbGxFdmVudD47XG5cbiAgbW9uaXRvcihlbGVtZW50T3JSZWY6IEVsZW1lbnQgfCBFbGVtZW50UmVmPEVsZW1lbnQ+KTogT2JzZXJ2YWJsZTxBdXRvZmlsbEV2ZW50PiB7XG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybiBFTVBUWTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JSZWYpO1xuICAgIGNvbnN0IGluZm8gPSB0aGlzLl9tb25pdG9yZWRFbGVtZW50cy5nZXQoZWxlbWVudCk7XG5cbiAgICBpZiAoaW5mbykge1xuICAgICAgcmV0dXJuIGluZm8uc3ViamVjdDtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgU3ViamVjdDxBdXRvZmlsbEV2ZW50PigpO1xuICAgIGNvbnN0IGNzc0NsYXNzID0gJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsZWQnO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgIC8vIEFuaW1hdGlvbiBldmVudHMgZmlyZSBvbiBpbml0aWFsIGVsZW1lbnQgcmVuZGVyLCB3ZSBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSBhdXRvZmlsbFxuICAgICAgLy8gQ1NTIGNsYXNzIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIGEgcmVhbCBjaGFuZ2UgaW4gc3RhdGUsIG5vdCBqdXN0IHRoZSBpbml0aWFsIHJlbmRlciBiZWZvcmVcbiAgICAgIC8vIHdlIGZpcmUgb2ZmIGV2ZW50cy5cbiAgICAgIGlmIChcbiAgICAgICAgZXZlbnQuYW5pbWF0aW9uTmFtZSA9PT0gJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsLXN0YXJ0JyAmJlxuICAgICAgICAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3MpXG4gICAgICApIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzKTtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiByZXN1bHQubmV4dCh7dGFyZ2V0OiBldmVudC50YXJnZXQgYXMgRWxlbWVudCwgaXNBdXRvZmlsbGVkOiB0cnVlfSkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgZXZlbnQuYW5pbWF0aW9uTmFtZSA9PT0gJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsLWVuZCcgJiZcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3MpXG4gICAgICApIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNzc0NsYXNzKTtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiByZXN1bHQubmV4dCh7dGFyZ2V0OiBldmVudC50YXJnZXQgYXMgRWxlbWVudCwgaXNBdXRvZmlsbGVkOiBmYWxzZX0pKTtcbiAgICAgIH1cbiAgICB9KSBhcyBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uc3RhcnQnLCBsaXN0ZW5lciwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2RrLXRleHQtZmllbGQtYXV0b2ZpbGwtbW9uaXRvcmVkJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9tb25pdG9yZWRFbGVtZW50cy5zZXQoZWxlbWVudCwge1xuICAgICAgc3ViamVjdDogcmVzdWx0LFxuICAgICAgdW5saXN0ZW46ICgpID0+IHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25zdGFydCcsIGxpc3RlbmVyLCBsaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBtb25pdG9yaW5nIHRoZSBhdXRvZmlsbCBzdGF0ZSBvZiB0aGUgZ2l2ZW4gaW5wdXQgZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gc3RvcCBtb25pdG9yaW5nLlxuICAgKi9cbiAgc3RvcE1vbml0b3JpbmcoZWxlbWVudDogRWxlbWVudCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFN0b3AgbW9uaXRvcmluZyB0aGUgYXV0b2ZpbGwgc3RhdGUgb2YgdGhlIGdpdmVuIGlucHV0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHN0b3AgbW9uaXRvcmluZy5cbiAgICovXG4gIHN0b3BNb25pdG9yaW5nKGVsZW1lbnQ6IEVsZW1lbnRSZWY8RWxlbWVudD4pOiB2b2lkO1xuXG4gIHN0b3BNb25pdG9yaW5nKGVsZW1lbnRPclJlZjogRWxlbWVudCB8IEVsZW1lbnRSZWY8RWxlbWVudD4pOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JSZWYpO1xuICAgIGNvbnN0IGluZm8gPSB0aGlzLl9tb25pdG9yZWRFbGVtZW50cy5nZXQoZWxlbWVudCk7XG5cbiAgICBpZiAoaW5mbykge1xuICAgICAgaW5mby51bmxpc3RlbigpO1xuICAgICAgaW5mby5zdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Nkay10ZXh0LWZpZWxkLWF1dG9maWxsLW1vbml0b3JlZCcpO1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjZGstdGV4dC1maWVsZC1hdXRvZmlsbGVkJyk7XG4gICAgICB0aGlzLl9tb25pdG9yZWRFbGVtZW50cy5kZWxldGUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fbW9uaXRvcmVkRWxlbWVudHMuZm9yRWFjaCgoX2luZm8sIGVsZW1lbnQpID0+IHRoaXMuc3RvcE1vbml0b3JpbmcoZWxlbWVudCkpO1xuICB9XG59XG5cbi8qKiBBIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vbml0b3IgdGhlIGF1dG9maWxsIHN0YXRlIG9mIGFuIGlucHV0LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nka0F1dG9maWxsXScsXG59KVxuZXhwb3J0IGNsYXNzIENka0F1dG9maWxsIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuICAvKiogRW1pdHMgd2hlbiB0aGUgYXV0b2ZpbGwgc3RhdGUgb2YgdGhlIGVsZW1lbnQgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNka0F1dG9maWxsID0gbmV3IEV2ZW50RW1pdHRlcjxBdXRvZmlsbEV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2F1dG9maWxsTW9uaXRvcjogQXV0b2ZpbGxNb25pdG9yLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYXV0b2ZpbGxNb25pdG9yXG4gICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmKVxuICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLmNka0F1dG9maWxsLmVtaXQoZXZlbnQpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2F1dG9maWxsTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxufVxuIl19