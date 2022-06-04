/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, coerceElement, } from '@angular/cdk/coercion';
import { Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
/**
 * Factory that creates a new MutationObserver and allows us to stub it out in unit tests.
 * @docs-private
 */
export class MutationObserverFactory {
    create(callback) {
        return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
    }
}
MutationObserverFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MutationObserverFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MutationObserverFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MutationObserverFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MutationObserverFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** An injectable service that allows watching elements for changes to their content. */
export class ContentObserver {
    constructor(_mutationObserverFactory) {
        this._mutationObserverFactory = _mutationObserverFactory;
        /** Keeps track of the existing MutationObservers so they can be reused. */
        this._observedElements = new Map();
    }
    ngOnDestroy() {
        this._observedElements.forEach((_, element) => this._cleanupObserver(element));
    }
    observe(elementOrRef) {
        const element = coerceElement(elementOrRef);
        return new Observable((observer) => {
            const stream = this._observeElement(element);
            const subscription = stream.subscribe(observer);
            return () => {
                subscription.unsubscribe();
                this._unobserveElement(element);
            };
        });
    }
    /**
     * Observes the given element by using the existing MutationObserver if available, or creating a
     * new one if not.
     */
    _observeElement(element) {
        if (!this._observedElements.has(element)) {
            const stream = new Subject();
            const observer = this._mutationObserverFactory.create(mutations => stream.next(mutations));
            if (observer) {
                observer.observe(element, {
                    characterData: true,
                    childList: true,
                    subtree: true,
                });
            }
            this._observedElements.set(element, { observer, stream, count: 1 });
        }
        else {
            this._observedElements.get(element).count++;
        }
        return this._observedElements.get(element).stream;
    }
    /**
     * Un-observes the given element and cleans up the underlying MutationObserver if nobody else is
     * observing this element.
     */
    _unobserveElement(element) {
        if (this._observedElements.has(element)) {
            this._observedElements.get(element).count--;
            if (!this._observedElements.get(element).count) {
                this._cleanupObserver(element);
            }
        }
    }
    /** Clean up the underlying MutationObserver for the specified element. */
    _cleanupObserver(element) {
        if (this._observedElements.has(element)) {
            const { observer, stream } = this._observedElements.get(element);
            if (observer) {
                observer.disconnect();
            }
            stream.complete();
            this._observedElements.delete(element);
        }
    }
}
ContentObserver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContentObserver, deps: [{ token: MutationObserverFactory }], target: i0.ɵɵFactoryTarget.Injectable });
ContentObserver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContentObserver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContentObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: MutationObserverFactory }]; } });
/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
export class CdkObserveContent {
    constructor(_contentObserver, _elementRef, _ngZone) {
        this._contentObserver = _contentObserver;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /** Event emitted for each change in the element's content. */
        this.event = new EventEmitter();
        this._disabled = false;
        this._currentSubscription = null;
    }
    /**
     * Whether observing content is disabled. This option can be used
     * to disconnect the underlying MutationObserver until it is needed.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this._unsubscribe() : this._subscribe();
    }
    /** Debounce interval for emitting the changes. */
    get debounce() {
        return this._debounce;
    }
    set debounce(value) {
        this._debounce = coerceNumberProperty(value);
        this._subscribe();
    }
    ngAfterContentInit() {
        if (!this._currentSubscription && !this.disabled) {
            this._subscribe();
        }
    }
    ngOnDestroy() {
        this._unsubscribe();
    }
    _subscribe() {
        this._unsubscribe();
        const stream = this._contentObserver.observe(this._elementRef);
        // TODO(mmalerba): We shouldn't be emitting on this @Output() outside the zone.
        // Consider brining it back inside the zone next time we're making breaking changes.
        // Bringing it back inside can cause things like infinite change detection loops and changed
        // after checked errors if people's code isn't handling it properly.
        this._ngZone.runOutsideAngular(() => {
            this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(this.event);
        });
    }
    _unsubscribe() {
        this._currentSubscription?.unsubscribe();
    }
}
CdkObserveContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkObserveContent, deps: [{ token: ContentObserver }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
CdkObserveContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkObserveContent, selector: "[cdkObserveContent]", inputs: { disabled: ["cdkObserveContentDisabled", "disabled"], debounce: "debounce" }, outputs: { event: "cdkObserveContent" }, exportAs: ["cdkObserveContent"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkObserveContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkObserveContent]',
                    exportAs: 'cdkObserveContent',
                }]
        }], ctorParameters: function () { return [{ type: ContentObserver }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { event: [{
                type: Output,
                args: ['cdkObserveContent']
            }], disabled: [{
                type: Input,
                args: ['cdkObserveContentDisabled']
            }], debounce: [{
                type: Input
            }] } });
export class ObserversModule {
}
ObserversModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ObserversModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ObserversModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ObserversModule, declarations: [CdkObserveContent], exports: [CdkObserveContent] });
ObserversModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ObserversModule, providers: [MutationObserverFactory] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ObserversModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [CdkObserveContent],
                    declarations: [CdkObserveContent],
                    providers: [MutationObserverFactory],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2ZS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vYnNlcnZlcnMvb2JzZXJ2ZS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsb0JBQW9CLEVBQ3BCLGFBQWEsR0FHZCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUF5QixNQUFNLE1BQU0sQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTVDOzs7R0FHRztBQUVILE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsTUFBTSxDQUFDLFFBQTBCO1FBQy9CLE9BQU8sT0FBTyxnQkFBZ0IsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6RixDQUFDOztvSEFIVSx1QkFBdUI7d0hBQXZCLHVCQUF1QixjQURYLE1BQU07MkZBQ2xCLHVCQUF1QjtrQkFEbkMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBT2hDLHdGQUF3RjtBQUV4RixNQUFNLE9BQU8sZUFBZTtJQVcxQixZQUFvQix3QkFBaUQ7UUFBakQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUF5QjtRQVZyRSwyRUFBMkU7UUFDbkUsc0JBQWlCLEdBQUcsSUFBSSxHQUFHLEVBT2hDLENBQUM7SUFFb0UsQ0FBQztJQUV6RSxXQUFXO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxD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QUF1QixDQUFDOzJGQUV6QixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUM1QixZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDakMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7aUJBQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIGNvZXJjZUVsZW1lbnQsXG4gIEJvb2xlYW5JbnB1dCxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0YWJsZSxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBPYnNlcnZlcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEZhY3RvcnkgdGhhdCBjcmVhdGVzIGEgbmV3IE11dGF0aW9uT2JzZXJ2ZXIgYW5kIGFsbG93cyB1cyB0byBzdHViIGl0IG91dCBpbiB1bml0IHRlc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNdXRhdGlvbk9ic2VydmVyRmFjdG9yeSB7XG4gIGNyZWF0ZShjYWxsYmFjazogTXV0YXRpb25DYWxsYmFjayk6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgfVxufVxuXG4vKiogQW4gaW5qZWN0YWJsZSBzZXJ2aWNlIHRoYXQgYWxsb3dzIHdhdGNoaW5nIGVsZW1lbnRzIGZvciBjaGFuZ2VzIHRvIHRoZWlyIGNvbnRlbnQuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBDb250ZW50T2JzZXJ2ZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGV4aXN0aW5nIE11dGF0aW9uT2JzZXJ2ZXJzIHNvIHRoZXkgY2FuIGJlIHJldXNlZC4gKi9cbiAgcHJpdmF0ZSBfb2JzZXJ2ZWRFbGVtZW50cyA9IG5ldyBNYXA8XG4gICAgRWxlbWVudCxcbiAgICB7XG4gICAgICBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IG51bGw7XG4gICAgICByZWFkb25seSBzdHJlYW06IFN1YmplY3Q8TXV0YXRpb25SZWNvcmRbXT47XG4gICAgICBjb3VudDogbnVtYmVyO1xuICAgIH1cbiAgPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX211dGF0aW9uT2JzZXJ2ZXJGYWN0b3J5OiBNdXRhdGlvbk9ic2VydmVyRmFjdG9yeSkge31cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmZvckVhY2goKF8sIGVsZW1lbnQpID0+IHRoaXMuX2NsZWFudXBPYnNlcnZlcihlbGVtZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogT2JzZXJ2ZSBjb250ZW50IGNoYW5nZXMgb24gYW4gZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gb2JzZXJ2ZSBmb3IgY29udGVudCBjaGFuZ2VzLlxuICAgKi9cbiAgb2JzZXJ2ZShlbGVtZW50OiBFbGVtZW50KTogT2JzZXJ2YWJsZTxNdXRhdGlvblJlY29yZFtdPjtcblxuICAvKipcbiAgICogT2JzZXJ2ZSBjb250ZW50IGNoYW5nZXMgb24gYW4gZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gb2JzZXJ2ZSBmb3IgY29udGVudCBjaGFuZ2VzLlxuICAgKi9cbiAgb2JzZXJ2ZShlbGVtZW50OiBFbGVtZW50UmVmPEVsZW1lbnQ+KTogT2JzZXJ2YWJsZTxNdXRhdGlvblJlY29yZFtdPjtcblxuICBvYnNlcnZlKGVsZW1lbnRPclJlZjogRWxlbWVudCB8IEVsZW1lbnRSZWY8RWxlbWVudD4pOiBPYnNlcnZhYmxlPE11dGF0aW9uUmVjb3JkW10+IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29lcmNlRWxlbWVudChlbGVtZW50T3JSZWYpO1xuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8TXV0YXRpb25SZWNvcmRbXT4pID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX29ic2VydmVFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc3RyZWFtLnN1YnNjcmliZShvYnNlcnZlcik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLl91bm9ic2VydmVFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYnNlcnZlcyB0aGUgZ2l2ZW4gZWxlbWVudCBieSB1c2luZyB0aGUgZXhpc3RpbmcgTXV0YXRpb25PYnNlcnZlciBpZiBhdmFpbGFibGUsIG9yIGNyZWF0aW5nIGFcbiAgICogbmV3IG9uZSBpZiBub3QuXG4gICAqL1xuICBwcml2YXRlIF9vYnNlcnZlRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogU3ViamVjdDxNdXRhdGlvblJlY29yZFtdPiB7XG4gICAgaWYgKCF0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmhhcyhlbGVtZW50KSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFN1YmplY3Q8TXV0YXRpb25SZWNvcmRbXT4oKTtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gdGhpcy5fbXV0YXRpb25PYnNlcnZlckZhY3RvcnkuY3JlYXRlKG11dGF0aW9ucyA9PiBzdHJlYW0ubmV4dChtdXRhdGlvbnMpKTtcbiAgICAgIGlmIChvYnNlcnZlcikge1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHtcbiAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX29ic2VydmVkRWxlbWVudHMuc2V0KGVsZW1lbnQsIHtvYnNlcnZlciwgc3RyZWFtLCBjb3VudDogMX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmdldChlbGVtZW50KSEuY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX29ic2VydmVkRWxlbWVudHMuZ2V0KGVsZW1lbnQpIS5zdHJlYW07XG4gIH1cblxuICAvKipcbiAgICogVW4tb2JzZXJ2ZXMgdGhlIGdpdmVuIGVsZW1lbnQgYW5kIGNsZWFucyB1cCB0aGUgdW5kZXJseWluZyBNdXRhdGlvbk9ic2VydmVyIGlmIG5vYm9keSBlbHNlIGlzXG4gICAqIG9ic2VydmluZyB0aGlzIGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIF91bm9ic2VydmVFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5fb2JzZXJ2ZWRFbGVtZW50cy5oYXMoZWxlbWVudCkpIHtcbiAgICAgIHRoaXMuX29ic2VydmVkRWxlbWVudHMuZ2V0KGVsZW1lbnQpIS5jb3VudC0tO1xuICAgICAgaWYgKCF0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmdldChlbGVtZW50KSEuY291bnQpIHtcbiAgICAgICAgdGhpcy5fY2xlYW51cE9ic2VydmVyKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhbiB1cCB0aGUgdW5kZXJseWluZyBNdXRhdGlvbk9ic2VydmVyIGZvciB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2NsZWFudXBPYnNlcnZlcihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuX29ic2VydmVkRWxlbWVudHMuaGFzKGVsZW1lbnQpKSB7XG4gICAgICBjb25zdCB7b2JzZXJ2ZXIsIHN0cmVhbX0gPSB0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmdldChlbGVtZW50KSE7XG4gICAgICBpZiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgfVxuICAgICAgc3RyZWFtLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLl9vYnNlcnZlZEVsZW1lbnRzLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCB0cmlnZ2VycyBhIGNhbGxiYWNrIHdoZW5ldmVyIHRoZSBjb250ZW50IG9mXG4gKiBpdHMgYXNzb2NpYXRlZCBlbGVtZW50IGhhcyBjaGFuZ2VkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2RrT2JzZXJ2ZUNvbnRlbnRdJyxcbiAgZXhwb3J0QXM6ICdjZGtPYnNlcnZlQ29udGVudCcsXG59KVxuZXhwb3J0IGNsYXNzIENka09ic2VydmVDb250ZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEV2ZW50IGVtaXR0ZWQgZm9yIGVhY2ggY2hhbmdlIGluIHRoZSBlbGVtZW50J3MgY29udGVudC4gKi9cbiAgQE91dHB1dCgnY2RrT2JzZXJ2ZUNvbnRlbnQnKSByZWFkb25seSBldmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8TXV0YXRpb25SZWNvcmRbXT4oKTtcblxuICAvKipcbiAgICogV2hldGhlciBvYnNlcnZpbmcgY29udGVudCBpcyBkaXNhYmxlZC4gVGhpcyBvcHRpb24gY2FuIGJlIHVzZWRcbiAgICogdG8gZGlzY29ubmVjdCB0aGUgdW5kZXJseWluZyBNdXRhdGlvbk9ic2VydmVyIHVudGlsIGl0IGlzIG5lZWRlZC5cbiAgICovXG4gIEBJbnB1dCgnY2RrT2JzZXJ2ZUNvbnRlbnREaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fZGlzYWJsZWQgPyB0aGlzLl91bnN1YnNjcmliZSgpIDogdGhpcy5fc3Vic2NyaWJlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogRGVib3VuY2UgaW50ZXJ2YWwgZm9yIGVtaXR0aW5nIHRoZSBjaGFuZ2VzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGVib3VuY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGVib3VuY2U7XG4gIH1cbiAgc2V0IGRlYm91bmNlKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2RlYm91bmNlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N1YnNjcmliZSgpO1xuICB9XG4gIHByaXZhdGUgX2RlYm91bmNlOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBfY3VycmVudFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY29udGVudE9ic2VydmVyOiBDb250ZW50T2JzZXJ2ZXIsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50U3Vic2NyaXB0aW9uICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fY29udGVudE9ic2VydmVyLm9ic2VydmUodGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBUT0RPKG1tYWxlcmJhKTogV2Ugc2hvdWxkbid0IGJlIGVtaXR0aW5nIG9uIHRoaXMgQE91dHB1dCgpIG91dHNpZGUgdGhlIHpvbmUuXG4gICAgLy8gQ29uc2lkZXIgYnJpbmluZyBpdCBiYWNrIGluc2lkZSB0aGUgem9uZSBuZXh0IHRpbWUgd2UncmUgbWFraW5nIGJyZWFraW5nIGNoYW5nZXMuXG4gICAgLy8gQnJpbmdpbmcgaXQgYmFjayBpbnNpZGUgY2FuIGNhdXNlIHRoaW5ncyBsaWtlIGluZmluaXRlIGNoYW5nZSBkZXRlY3Rpb24gbG9vcHMgYW5kIGNoYW5nZWRcbiAgICAvLyBhZnRlciBjaGVja2VkIGVycm9ycyBpZiBwZW9wbGUncyBjb2RlIGlzbid0IGhhbmRsaW5nIGl0IHByb3Blcmx5LlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9jdXJyZW50U3Vic2NyaXB0aW9uID0gKFxuICAgICAgICB0aGlzLmRlYm91bmNlID8gc3RyZWFtLnBpcGUoZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2UpKSA6IHN0cmVhbVxuICAgICAgKS5zdWJzY3JpYmUodGhpcy5ldmVudCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLl9jdXJyZW50U3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtDZGtPYnNlcnZlQ29udGVudF0sXG4gIGRlY2xhcmF0aW9uczogW0Nka09ic2VydmVDb250ZW50XSxcbiAgcHJvdmlkZXJzOiBbTXV0YXRpb25PYnNlcnZlckZhY3RvcnldLFxufSlcbmV4cG9ydCBjbGFzcyBPYnNlcnZlcnNNb2R1bGUge31cbiJdfQ==