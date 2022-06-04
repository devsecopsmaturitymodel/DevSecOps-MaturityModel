/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentObserver } from '@angular/cdk/observers';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Injectable, Input, NgZone, Optional, } from '@angular/core';
import { LIVE_ANNOUNCER_ELEMENT_TOKEN, LIVE_ANNOUNCER_DEFAULT_OPTIONS, } from './live-announcer-tokens';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/observers";
export class LiveAnnouncer {
    constructor(elementToken, _ngZone, _document, _defaultOptions) {
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
        // We inject the live element and document as `any` because the constructor signature cannot
        // reference browser globals (HTMLElement, Document) on non-browser environments, since having
        // a class decorator causes TypeScript to preserve the constructor signature types.
        this._document = _document;
        this._liveElement = elementToken || this._createLiveElement();
    }
    announce(message, ...args) {
        const defaultOptions = this._defaultOptions;
        let politeness;
        let duration;
        if (args.length === 1 && typeof args[0] === 'number') {
            duration = args[0];
        }
        else {
            [politeness, duration] = args;
        }
        this.clear();
        clearTimeout(this._previousTimeout);
        if (!politeness) {
            politeness =
                defaultOptions && defaultOptions.politeness ? defaultOptions.politeness : 'polite';
        }
        if (duration == null && defaultOptions) {
            duration = defaultOptions.duration;
        }
        // TODO: ensure changing the politeness works on all environments we support.
        this._liveElement.setAttribute('aria-live', politeness);
        // This 100ms timeout is necessary for some browser + screen-reader combinations:
        // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
        // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
        //   second time without clearing and then using a non-zero delay.
        // (using JAWS 17 at time of this writing).
        return this._ngZone.runOutsideAngular(() => {
            if (!this._currentPromise) {
                this._currentPromise = new Promise(resolve => (this._currentResolve = resolve));
            }
            clearTimeout(this._previousTimeout);
            this._previousTimeout = setTimeout(() => {
                this._liveElement.textContent = message;
                if (typeof duration === 'number') {
                    this._previousTimeout = setTimeout(() => this.clear(), duration);
                }
                this._currentResolve();
                this._currentPromise = this._currentResolve = undefined;
            }, 100);
            return this._currentPromise;
        });
    }
    /**
     * Clears the current text from the announcer element. Can be used to prevent
     * screen readers from reading the text out again while the user is going
     * through the page landmarks.
     */
    clear() {
        if (this._liveElement) {
            this._liveElement.textContent = '';
        }
    }
    ngOnDestroy() {
        clearTimeout(this._previousTimeout);
        this._liveElement?.remove();
        this._liveElement = null;
        this._currentResolve?.();
        this._currentPromise = this._currentResolve = undefined;
    }
    _createLiveElement() {
        const elementClass = 'cdk-live-announcer-element';
        const previousElements = this._document.getElementsByClassName(elementClass);
        const liveEl = this._document.createElement('div');
        // Remove any old containers. This can happen when coming in from a server-side-rendered page.
        for (let i = 0; i < previousElements.length; i++) {
            previousElements[i].remove();
        }
        liveEl.classList.add(elementClass);
        liveEl.classList.add('cdk-visually-hidden');
        liveEl.setAttribute('aria-atomic', 'true');
        liveEl.setAttribute('aria-live', 'polite');
        this._document.body.appendChild(liveEl);
        return liveEl;
    }
}
LiveAnnouncer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LiveAnnouncer, deps: [{ token: LIVE_ANNOUNCER_ELEMENT_TOKEN, optional: true }, { token: i0.NgZone }, { token: DOCUMENT }, { token: LIVE_ANNOUNCER_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
LiveAnnouncer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LiveAnnouncer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LiveAnnouncer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LIVE_ANNOUNCER_ELEMENT_TOKEN]
                }] }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LIVE_ANNOUNCER_DEFAULT_OPTIONS]
                }] }]; } });
/**
 * A directive that works similarly to aria-live, but uses the LiveAnnouncer to ensure compatibility
 * with a wider range of browsers and screen readers.
 */
export class CdkAriaLive {
    constructor(_elementRef, _liveAnnouncer, _contentObserver, _ngZone) {
        this._elementRef = _elementRef;
        this._liveAnnouncer = _liveAnnouncer;
        this._contentObserver = _contentObserver;
        this._ngZone = _ngZone;
        this._politeness = 'polite';
    }
    /** The aria-live politeness level to use when announcing messages. */
    get politeness() {
        return this._politeness;
    }
    set politeness(value) {
        this._politeness = value === 'off' || value === 'assertive' ? value : 'polite';
        if (this._politeness === 'off') {
            if (this._subscription) {
                this._subscription.unsubscribe();
                this._subscription = null;
            }
        }
        else if (!this._subscription) {
            this._subscription = this._ngZone.runOutsideAngular(() => {
                return this._contentObserver.observe(this._elementRef).subscribe(() => {
                    // Note that we use textContent here, rather than innerText, in order to avoid a reflow.
                    const elementText = this._elementRef.nativeElement.textContent;
                    // The `MutationObserver` fires also for attribute
                    // changes which we don't want to announce.
                    if (elementText !== this._previousAnnouncedText) {
                        this._liveAnnouncer.announce(elementText, this._politeness);
                        this._previousAnnouncedText = elementText;
                    }
                });
            });
        }
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
CdkAriaLive.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAriaLive, deps: [{ token: i0.ElementRef }, { token: LiveAnnouncer }, { token: i1.ContentObserver }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
CdkAriaLive.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkAriaLive, selector: "[cdkAriaLive]", inputs: { politeness: ["cdkAriaLive", "politeness"] }, exportAs: ["cdkAriaLive"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAriaLive, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkAriaLive]',
                    exportAs: 'cdkAriaLive',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: LiveAnnouncer }, { type: i1.ContentObserver }, { type: i0.NgZone }]; }, propDecorators: { politeness: [{
                type: Input,
                args: ['cdkAriaLive']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZS1hbm5vdW5jZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvbGl2ZS1hbm5vdW5jZXIvbGl2ZS1hbm5vdW5jZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFHTCw0QkFBNEIsRUFDNUIsOEJBQThCLEdBQy9CLE1BQU0seUJBQXlCLENBQUM7OztBQUdqQyxNQUFNLE9BQU8sYUFBYTtJQU94QixZQUNvRCxZQUFpQixFQUMzRCxPQUFlLEVBQ0wsU0FBYyxFQUd4QixlQUE2QztRQUo3QyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBSWYsb0JBQWUsR0FBZixlQUFlLENBQThCO1FBRXJELDRGQUE0RjtRQUM1Riw4RkFBOEY7UUFDOUYsbUZBQW1GO1FBQ25GLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ2hFLENBQUM7SUFzQ0QsUUFBUSxDQUFDLE9BQWUsRUFBRSxHQUFHLElBQVc7UUFDdEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM1QyxJQUFJLFVBQTBDLENBQUM7UUFDL0MsSUFBSSxRQUE0QixDQUFDO1FBRWpDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO1lB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Q1UsV0FBVyw0Q0FvQ0ksYUFBYTs0RkFwQzVCLFdBQVc7MkZBQVgsV0FBVztrQkFKdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGFBQWE7aUJBQ3hCO21GQXFDMkIsYUFBYSw2RUFqQ25DLFVBQVU7c0JBRGIsS0FBSzt1QkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudE9ic2VydmVyfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBBcmlhTGl2ZVBvbGl0ZW5lc3MsXG4gIExpdmVBbm5vdW5jZXJEZWZhdWx0T3B0aW9ucyxcbiAgTElWRV9BTk5PVU5DRVJfRUxFTUVOVF9UT0tFTixcbiAgTElWRV9BTk5PVU5DRVJfREVGQVVMVF9PUFRJT05TLFxufSBmcm9tICcuL2xpdmUtYW5ub3VuY2VyLXRva2Vucyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIExpdmVBbm5vdW5jZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9saXZlRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSBfcHJldmlvdXNUaW1lb3V0OiBudW1iZXI7XG4gIHByaXZhdGUgX2N1cnJlbnRQcm9taXNlOiBQcm9taXNlPHZvaWQ+IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIF9jdXJyZW50UmVzb2x2ZTogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTElWRV9BTk5PVU5DRVJfRUxFTUVOVF9UT0tFTikgZWxlbWVudFRva2VuOiBhbnksXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KExJVkVfQU5OT1VOQ0VSX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9ucz86IExpdmVBbm5vdW5jZXJEZWZhdWx0T3B0aW9ucyxcbiAgKSB7XG4gICAgLy8gV2UgaW5qZWN0IHRoZSBsaXZlIGVsZW1lbnQgYW5kIGRvY3VtZW50IGFzIGBhbnlgIGJlY2F1c2UgdGhlIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSBjYW5ub3RcbiAgICAvLyByZWZlcmVuY2UgYnJvd3NlciBnbG9iYWxzIChIVE1MRWxlbWVudCwgRG9jdW1lbnQpIG9uIG5vbi1icm93c2VyIGVudmlyb25tZW50cywgc2luY2UgaGF2aW5nXG4gICAgLy8gYSBjbGFzcyBkZWNvcmF0b3IgY2F1c2VzIFR5cGVTY3JpcHQgdG8gcHJlc2VydmUgdGhlIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSB0eXBlcy5cbiAgICB0aGlzLl9kb2N1bWVudCA9IF9kb2N1bWVudDtcbiAgICB0aGlzLl9saXZlRWxlbWVudCA9IGVsZW1lbnRUb2tlbiB8fCB0aGlzLl9jcmVhdGVMaXZlRWxlbWVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFubm91bmNlcyBhIG1lc3NhZ2UgdG8gc2NyZWVucmVhZGVycy5cbiAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgdG8gdGhlIHNjcmVlbnJlYWRlci5cbiAgICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byB0aGUgRE9NLlxuICAgKi9cbiAgYW5ub3VuY2UobWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogQW5ub3VuY2VzIGEgbWVzc2FnZSB0byBzY3JlZW5yZWFkZXJzLlxuICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIGFubm91bmNlZCB0byB0aGUgc2NyZWVucmVhZGVyLlxuICAgKiBAcGFyYW0gcG9saXRlbmVzcyBUaGUgcG9saXRlbmVzcyBvZiB0aGUgYW5ub3VuY2VyIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIFByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdoZW4gdGhlIG1lc3NhZ2UgaXMgYWRkZWQgdG8gdGhlIERPTS5cbiAgICovXG4gIGFubm91bmNlKG1lc3NhZ2U6IHN0cmluZywgcG9saXRlbmVzcz86IEFyaWFMaXZlUG9saXRlbmVzcyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIEFubm91bmNlcyBhIG1lc3NhZ2UgdG8gc2NyZWVucmVhZGVycy5cbiAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgdG8gdGhlIHNjcmVlbnJlYWRlci5cbiAgICogQHBhcmFtIGR1cmF0aW9uIFRpbWUgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRvIGNsZWFyIG91dCB0aGUgYW5ub3VuY2VyIGVsZW1lbnQuIE5vdGVcbiAgICogICB0aGF0IHRoaXMgdGFrZXMgZWZmZWN0IGFmdGVyIHRoZSBtZXNzYWdlIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00sIHdoaWNoIGNhbiBiZSB1cCB0b1xuICAgKiAgIDEwMG1zIGFmdGVyIGBhbm5vdW5jZWAgaGFzIGJlZW4gY2FsbGVkLlxuICAgKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCB3aGVuIHRoZSBtZXNzYWdlIGlzIGFkZGVkIHRvIHRoZSBET00uXG4gICAqL1xuICBhbm5vdW5jZShtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uPzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogQW5ub3VuY2VzIGEgbWVzc2FnZSB0byBzY3JlZW5yZWFkZXJzLlxuICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIGFubm91bmNlZCB0byB0aGUgc2NyZWVucmVhZGVyLlxuICAgKiBAcGFyYW0gcG9saXRlbmVzcyBUaGUgcG9saXRlbmVzcyBvZiB0aGUgYW5ub3VuY2VyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBkdXJhdGlvbiBUaW1lIGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0byBjbGVhciBvdXQgdGhlIGFubm91bmNlciBlbGVtZW50LiBOb3RlXG4gICAqICAgdGhhdCB0aGlzIHRha2VzIGVmZmVjdCBhZnRlciB0aGUgbWVzc2FnZSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NLCB3aGljaCBjYW4gYmUgdXAgdG9cbiAgICogICAxMDBtcyBhZnRlciBgYW5ub3VuY2VgIGhhcyBiZWVuIGNhbGxlZC5cbiAgICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byB0aGUgRE9NLlxuICAgKi9cbiAgYW5ub3VuY2UobWVzc2FnZTogc3RyaW5nLCBwb2xpdGVuZXNzPzogQXJpYUxpdmVQb2xpdGVuZXNzLCBkdXJhdGlvbj86IG51bWJlcik6IFByb21pc2U8dm9pZD47XG5cbiAgYW5ub3VuY2UobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM7XG4gICAgbGV0IHBvbGl0ZW5lc3M6IEFyaWFMaXZlUG9saXRlbmVzcyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgZHVyYXRpb246IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJnc1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGR1cmF0aW9uID0gYXJnc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgW3BvbGl0ZW5lc3MsIGR1cmF0aW9uXSA9IGFyZ3M7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9wcmV2aW91c1RpbWVvdXQpO1xuXG4gICAgaWYgKCFwb2xpdGVuZXNzKSB7XG4gICAgICBwb2xpdGVuZXNzID1cbiAgICAgICAgZGVmYXVsdE9wdGlvbnMgJiYgZGVmYXVsdE9wdGlvbnMucG9saXRlbmVzcyA/IGRlZmF1bHRPcHRpb25zLnBvbGl0ZW5lc3MgOiAncG9saXRlJztcbiAgICB9XG5cbiAgICBpZiAoZHVyYXRpb24gPT0gbnVsbCAmJiBkZWZhdWx0T3B0aW9ucykge1xuICAgICAgZHVyYXRpb24gPSBkZWZhdWx0T3B0aW9ucy5kdXJhdGlvbjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBlbnN1cmUgY2hhbmdpbmcgdGhlIHBvbGl0ZW5lc3Mgd29ya3Mgb24gYWxsIGVudmlyb25tZW50cyB3ZSBzdXBwb3J0LlxuICAgIHRoaXMuX2xpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgcG9saXRlbmVzcyk7XG5cbiAgICAvLyBUaGlzIDEwMG1zIHRpbWVvdXQgaXMgbmVjZXNzYXJ5IGZvciBzb21lIGJyb3dzZXIgKyBzY3JlZW4tcmVhZGVyIGNvbWJpbmF0aW9uczpcbiAgICAvLyAtIEJvdGggSkFXUyBhbmQgTlZEQSBvdmVyIElFMTEgd2lsbCBub3QgYW5ub3VuY2UgYW55dGhpbmcgd2l0aG91dCBhIG5vbi16ZXJvIHRpbWVvdXQuXG4gICAgLy8gLSBXaXRoIENocm9tZSBhbmQgSUUxMSB3aXRoIE5WREEgb3IgSkFXUywgYSByZXBlYXRlZCAoaWRlbnRpY2FsKSBtZXNzYWdlIHdvbid0IGJlIHJlYWQgYVxuICAgIC8vICAgc2Vjb25kIHRpbWUgd2l0aG91dCBjbGVhcmluZyBhbmQgdGhlbiB1c2luZyBhIG5vbi16ZXJvIGRlbGF5LlxuICAgIC8vICh1c2luZyBKQVdTIDE3IGF0IHRpbWUgb2YgdGhpcyB3cml0aW5nKS5cbiAgICByZXR1cm4gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY3VycmVudFByb21pc2UpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+ICh0aGlzLl9jdXJyZW50UmVzb2x2ZSA9IHJlc29sdmUpKTtcbiAgICAgIH1cblxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3ByZXZpb3VzVGltZW91dCk7XG4gICAgICB0aGlzLl9wcmV2aW91c1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fbGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmNsZWFyKCksIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRSZXNvbHZlISgpO1xuICAgICAgICB0aGlzLl9jdXJyZW50UHJvbWlzZSA9IHRoaXMuX2N1cnJlbnRSZXNvbHZlID0gdW5kZWZpbmVkO1xuICAgICAgfSwgMTAwKTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQcm9taXNlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgY3VycmVudCB0ZXh0IGZyb20gdGhlIGFubm91bmNlciBlbGVtZW50LiBDYW4gYmUgdXNlZCB0byBwcmV2ZW50XG4gICAqIHNjcmVlbiByZWFkZXJzIGZyb20gcmVhZGluZyB0aGUgdGV4dCBvdXQgYWdhaW4gd2hpbGUgdGhlIHVzZXIgaXMgZ29pbmdcbiAgICogdGhyb3VnaCB0aGUgcGFnZSBsYW5kbWFya3MuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5fbGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2xpdmVFbGVtZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3ByZXZpb3VzVGltZW91dCk7XG4gICAgdGhpcy5fbGl2ZUVsZW1lbnQ/LnJlbW92ZSgpO1xuICAgIHRoaXMuX2xpdmVFbGVtZW50ID0gbnVsbCE7XG4gICAgdGhpcy5fY3VycmVudFJlc29sdmU/LigpO1xuICAgIHRoaXMuX2N1cnJlbnRQcm9taXNlID0gdGhpcy5fY3VycmVudFJlc29sdmUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVMaXZlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudENsYXNzID0gJ2Nkay1saXZlLWFubm91bmNlci1lbGVtZW50JztcbiAgICBjb25zdCBwcmV2aW91c0VsZW1lbnRzID0gdGhpcy5fZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlbGVtZW50Q2xhc3MpO1xuICAgIGNvbnN0IGxpdmVFbCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLy8gUmVtb3ZlIGFueSBvbGQgY29udGFpbmVycy4gVGhpcyBjYW4gaGFwcGVuIHdoZW4gY29taW5nIGluIGZyb20gYSBzZXJ2ZXItc2lkZS1yZW5kZXJlZCBwYWdlLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJldmlvdXNFbGVtZW50c1tpXS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBsaXZlRWwuY2xhc3NMaXN0LmFkZChlbGVtZW50Q2xhc3MpO1xuICAgIGxpdmVFbC5jbGFzc0xpc3QuYWRkKCdjZGstdmlzdWFsbHktaGlkZGVuJyk7XG5cbiAgICBsaXZlRWwuc2V0QXR0cmlidXRlKCdhcmlhLWF0b21pYycsICd0cnVlJyk7XG4gICAgbGl2ZUVsLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuXG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaXZlRWwpO1xuXG4gICAgcmV0dXJuIGxpdmVFbDtcbiAgfVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd29ya3Mgc2ltaWxhcmx5IHRvIGFyaWEtbGl2ZSwgYnV0IHVzZXMgdGhlIExpdmVBbm5vdW5jZXIgdG8gZW5zdXJlIGNvbXBhdGliaWxpdHlcbiAqIHdpdGggYSB3aWRlciByYW5nZSBvZiBicm93c2VycyBhbmQgc2NyZWVuIHJlYWRlcnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtBcmlhTGl2ZV0nLFxuICBleHBvcnRBczogJ2Nka0FyaWFMaXZlJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrQXJpYUxpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogVGhlIGFyaWEtbGl2ZSBwb2xpdGVuZXNzIGxldmVsIHRvIHVzZSB3aGVuIGFubm91bmNpbmcgbWVzc2FnZXMuICovXG4gIEBJbnB1dCgnY2RrQXJpYUxpdmUnKVxuICBnZXQgcG9saXRlbmVzcygpOiBBcmlhTGl2ZVBvbGl0ZW5lc3Mge1xuICAgIHJldHVybiB0aGlzLl9wb2xpdGVuZXNzO1xuICB9XG4gIHNldCBwb2xpdGVuZXNzKHZhbHVlOiBBcmlhTGl2ZVBvbGl0ZW5lc3MpIHtcbiAgICB0aGlzLl9wb2xpdGVuZXNzID0gdmFsdWUgPT09ICdvZmYnIHx8IHZhbHVlID09PSAnYXNzZXJ0aXZlJyA/IHZhbHVlIDogJ3BvbGl0ZSc7XG4gICAgaWYgKHRoaXMuX3BvbGl0ZW5lc3MgPT09ICdvZmYnKSB7XG4gICAgICBpZiAodGhpcy5fc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuX2VsZW1lbnRSZWYpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHdlIHVzZSB0ZXh0Q29udGVudCBoZXJlLCByYXRoZXIgdGhhbiBpbm5lclRleHQsIGluIG9yZGVyIHRvIGF2b2lkIGEgcmVmbG93LlxuICAgICAgICAgIGNvbnN0IGVsZW1lbnRUZXh0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgICAgICAgLy8gVGhlIGBNdXRhdGlvbk9ic2VydmVyYCBmaXJlcyBhbHNvIGZvciBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyBjaGFuZ2VzIHdoaWNoIHdlIGRvbid0IHdhbnQgdG8gYW5ub3VuY2UuXG4gICAgICAgICAgaWYgKGVsZW1lbnRUZXh0ICE9PSB0aGlzLl9wcmV2aW91c0Fubm91bmNlZFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpdmVBbm5vdW5jZXIuYW5ub3VuY2UoZWxlbWVudFRleHQsIHRoaXMuX3BvbGl0ZW5lc3MpO1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNBbm5vdW5jZWRUZXh0ID0gZWxlbWVudFRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wb2xpdGVuZXNzOiBBcmlhTGl2ZVBvbGl0ZW5lc3MgPSAncG9saXRlJztcblxuICBwcml2YXRlIF9wcmV2aW91c0Fubm91bmNlZFRleHQ/OiBzdHJpbmc7XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2xpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgcHJpdmF0ZSBfY29udGVudE9ic2VydmVyOiBDb250ZW50T2JzZXJ2ZXIsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==