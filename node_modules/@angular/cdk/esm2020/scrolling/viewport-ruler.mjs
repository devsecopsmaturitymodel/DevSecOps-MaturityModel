/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Injectable, NgZone, Optional, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Time in ms to throttle the resize events by default. */
export const DEFAULT_RESIZE_TIME = 20;
/**
 * Simple utility for getting the bounds of the browser viewport.
 * @docs-private
 */
export class ViewportRuler {
    constructor(_platform, ngZone, document) {
        this._platform = _platform;
        /** Stream of viewport change events. */
        this._change = new Subject();
        /** Event listener that will be used to handle the viewport change events. */
        this._changeListener = (event) => {
            this._change.next(event);
        };
        this._document = document;
        ngZone.runOutsideAngular(() => {
            if (_platform.isBrowser) {
                const window = this._getWindow();
                // Note that bind the events ourselves, rather than going through something like RxJS's
                // `fromEvent` so that we can ensure that they're bound outside of the NgZone.
                window.addEventListener('resize', this._changeListener);
                window.addEventListener('orientationchange', this._changeListener);
            }
            // Clear the cached position so that the viewport is re-measured next time it is required.
            // We don't need to keep track of the subscription, because it is completed on destroy.
            this.change().subscribe(() => (this._viewportSize = null));
        });
    }
    ngOnDestroy() {
        if (this._platform.isBrowser) {
            const window = this._getWindow();
            window.removeEventListener('resize', this._changeListener);
            window.removeEventListener('orientationchange', this._changeListener);
        }
        this._change.complete();
    }
    /** Returns the viewport's width and height. */
    getViewportSize() {
        if (!this._viewportSize) {
            this._updateViewportSize();
        }
        const output = { width: this._viewportSize.width, height: this._viewportSize.height };
        // If we're not on a browser, don't cache the size since it'll be mocked out anyway.
        if (!this._platform.isBrowser) {
            this._viewportSize = null;
        }
        return output;
    }
    /** Gets a ClientRect for the viewport's bounds. */
    getViewportRect() {
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        const scrollPosition = this.getViewportScrollPosition();
        const { width, height } = this.getViewportSize();
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height,
            width,
        };
    }
    /** Gets the (top, left) scroll position of the viewport. */
    getViewportScrollPosition() {
        // While we can get a reference to the fake document
        // during SSR, it doesn't have getBoundingClientRect.
        if (!this._platform.isBrowser) {
            return { top: 0, left: 0 };
        }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        const document = this._document;
        const window = this._getWindow();
        const documentElement = document.documentElement;
        const documentRect = documentElement.getBoundingClientRect();
        const top = -documentRect.top ||
            document.body.scrollTop ||
            window.scrollY ||
            documentElement.scrollTop ||
            0;
        const left = -documentRect.left ||
            document.body.scrollLeft ||
            window.scrollX ||
            documentElement.scrollLeft ||
            0;
        return { top, left };
    }
    /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * This stream emits outside of the Angular zone.
     * @param throttleTime Time in milliseconds to throttle the stream.
     */
    change(throttleTime = DEFAULT_RESIZE_TIME) {
        return throttleTime > 0 ? this._change.pipe(auditTime(throttleTime)) : this._change;
    }
    /** Use defaultView of injected document if available or fallback to global window reference */
    _getWindow() {
        return this._document.defaultView || window;
    }
    /** Updates the cached viewport size. */
    _updateViewportSize() {
        const window = this._getWindow();
        this._viewportSize = this._platform.isBrowser
            ? { width: window.innerWidth, height: window.innerHeight }
            : { width: 0, height: 0 };
    }
}
ViewportRuler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewportRuler, deps: [{ token: i1.Platform }, { token: i0.NgZone }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ViewportRuler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewportRuler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewportRuler, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld3BvcnQtcnVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3Njcm9sbGluZy92aWV3cG9ydC1ydWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQWEsUUFBUSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7OztBQUV6QywyREFBMkQ7QUFDM0QsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBUXRDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBZXhCLFlBQ1UsU0FBbUIsRUFDM0IsTUFBYyxFQUNnQixRQUFhO1FBRm5DLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFaN0Isd0NBQXdDO1FBQ3ZCLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBUyxDQUFDO1FBRWhELDZFQUE2RTtRQUNyRSxvQkFBZSxHQUFHLENBQUMsS0FBWSxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBVUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFFMUIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUM1QixJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFFakMsdUZBQXVGO2dCQUN2Riw4RUFB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QUR6QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBbUIzQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBJbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7YXVkaXRUaW1lfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vKiogVGltZSBpbiBtcyB0byB0aHJvdHRsZSB0aGUgcmVzaXplIGV2ZW50cyBieSBkZWZhdWx0LiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVTSVpFX1RJTUUgPSAyMDtcblxuLyoqIE9iamVjdCB0aGF0IGhvbGRzIHRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIHZpZXdwb3J0IGluIGVhY2ggZGlyZWN0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBWaWV3cG9ydFNjcm9sbFBvc2l0aW9uIHtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTaW1wbGUgdXRpbGl0eSBmb3IgZ2V0dGluZyB0aGUgYm91bmRzIG9mIHRoZSBicm93c2VyIHZpZXdwb3J0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBWaWV3cG9ydFJ1bGVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIENhY2hlZCB2aWV3cG9ydCBkaW1lbnNpb25zLiAqL1xuICBwcml2YXRlIF92aWV3cG9ydFNpemU6IHt3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcn0gfCBudWxsO1xuXG4gIC8qKiBTdHJlYW0gb2Ygdmlld3BvcnQgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8RXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IGxpc3RlbmVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGhhbmRsZSB0aGUgdmlld3BvcnQgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXIgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgdGhpcy5fY2hhbmdlLm5leHQoZXZlbnQpO1xuICB9O1xuXG4gIC8qKiBVc2VkIHRvIHJlZmVyZW5jZSBjb3JyZWN0IGRvY3VtZW50L3dpbmRvdyAqL1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgKSB7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcblxuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAoX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgICAgICAvLyBOb3RlIHRoYXQgYmluZCB0aGUgZXZlbnRzIG91cnNlbHZlcywgcmF0aGVyIHRoYW4gZ29pbmcgdGhyb3VnaCBzb21ldGhpbmcgbGlrZSBSeEpTJ3NcbiAgICAgICAgLy8gYGZyb21FdmVudGAgc28gdGhhdCB3ZSBjYW4gZW5zdXJlIHRoYXQgdGhleSdyZSBib3VuZCBvdXRzaWRlIG9mIHRoZSBOZ1pvbmUuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9jaGFuZ2VMaXN0ZW5lcik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMuX2NoYW5nZUxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2xlYXIgdGhlIGNhY2hlZCBwb3NpdGlvbiBzbyB0aGF0IHRoZSB2aWV3cG9ydCBpcyByZS1tZWFzdXJlZCBuZXh0IHRpbWUgaXQgaXMgcmVxdWlyZWQuXG4gICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIHN1YnNjcmlwdGlvbiwgYmVjYXVzZSBpdCBpcyBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICAgIHRoaXMuY2hhbmdlKCkuc3Vic2NyaWJlKCgpID0+ICh0aGlzLl92aWV3cG9ydFNpemUgPSBudWxsKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9jaGFuZ2VMaXN0ZW5lcik7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCB0aGlzLl9jaGFuZ2VMaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdmlld3BvcnQncyB3aWR0aCBhbmQgaGVpZ2h0LiAqL1xuICBnZXRWaWV3cG9ydFNpemUoKTogUmVhZG9ubHk8e3dpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyfT4ge1xuICAgIGlmICghdGhpcy5fdmlld3BvcnRTaXplKSB7XG4gICAgICB0aGlzLl91cGRhdGVWaWV3cG9ydFNpemUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSB7d2lkdGg6IHRoaXMuX3ZpZXdwb3J0U2l6ZSEud2lkdGgsIGhlaWdodDogdGhpcy5fdmlld3BvcnRTaXplIS5oZWlnaHR9O1xuXG4gICAgLy8gSWYgd2UncmUgbm90IG9uIGEgYnJvd3NlciwgZG9uJ3QgY2FjaGUgdGhlIHNpemUgc2luY2UgaXQnbGwgYmUgbW9ja2VkIG91dCBhbnl3YXkuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0U2l6ZSA9IG51bGwhO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKiogR2V0cyBhIENsaWVudFJlY3QgZm9yIHRoZSB2aWV3cG9ydCdzIGJvdW5kcy4gKi9cbiAgZ2V0Vmlld3BvcnRSZWN0KCkge1xuICAgIC8vIFVzZSB0aGUgZG9jdW1lbnQgZWxlbWVudCdzIGJvdW5kaW5nIHJlY3QgcmF0aGVyIHRoYW4gdGhlIHdpbmRvdyBzY3JvbGwgcHJvcGVydGllc1xuICAgIC8vIChlLmcuIHBhZ2VZT2Zmc2V0LCBzY3JvbGxZKSBkdWUgdG8gaW4gaXNzdWUgaW4gQ2hyb21lIGFuZCBJRSB3aGVyZSB3aW5kb3cgc2Nyb2xsXG4gICAgLy8gcHJvcGVydGllcyBhbmQgY2xpZW50IGNvb3JkaW5hdGVzIChib3VuZGluZ0NsaWVudFJlY3QsIGNsaWVudFgvWSwgZXRjLikgYXJlIGluIGRpZmZlcmVudFxuICAgIC8vIGNvbmNlcHR1YWwgdmlld3BvcnRzLiBVbmRlciBtb3N0IGNpcmN1bXN0YW5jZXMgdGhlc2Ugdmlld3BvcnRzIGFyZSBlcXVpdmFsZW50LCBidXQgdGhleVxuICAgIC8vIGNhbiBkaXNhZ3JlZSB3aGVuIHRoZSBwYWdlIGlzIHBpbmNoLXpvb21lZCAob24gZGV2aWNlcyB0aGF0IHN1cHBvcnQgdG91Y2gpLlxuICAgIC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00ODkyMDYjYzRcbiAgICAvLyBXZSB1c2UgdGhlIGRvY3VtZW50RWxlbWVudCBpbnN0ZWFkIG9mIHRoZSBib2R5IGJlY2F1c2UsIGJ5IGRlZmF1bHQgKHdpdGhvdXQgYSBjc3MgcmVzZXQpXG4gICAgLy8gYnJvd3NlcnMgdHlwaWNhbGx5IGdpdmUgdGhlIGRvY3VtZW50IGJvZHkgYW4gOHB4IG1hcmdpbiwgd2hpY2ggaXMgbm90IGluY2x1ZGVkIGluXG4gICAgLy8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLmdldFZpZXdwb3J0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLmdldFZpZXdwb3J0U2l6ZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogc2Nyb2xsUG9zaXRpb24udG9wLFxuICAgICAgbGVmdDogc2Nyb2xsUG9zaXRpb24ubGVmdCxcbiAgICAgIGJvdHRvbTogc2Nyb2xsUG9zaXRpb24udG9wICsgaGVpZ2h0LFxuICAgICAgcmlnaHQ6IHNjcm9sbFBvc2l0aW9uLmxlZnQgKyB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHdpZHRoLFxuICAgIH07XG4gIH1cblxuICAvKiogR2V0cyB0aGUgKHRvcCwgbGVmdCkgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSB2aWV3cG9ydC4gKi9cbiAgZ2V0Vmlld3BvcnRTY3JvbGxQb3NpdGlvbigpOiBWaWV3cG9ydFNjcm9sbFBvc2l0aW9uIHtcbiAgICAvLyBXaGlsZSB3ZSBjYW4gZ2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBmYWtlIGRvY3VtZW50XG4gICAgLy8gZHVyaW5nIFNTUiwgaXQgZG9lc24ndCBoYXZlIGdldEJvdW5kaW5nQ2xpZW50UmVjdC5cbiAgICBpZiAoIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuIHt0b3A6IDAsIGxlZnQ6IDB9O1xuICAgIH1cblxuICAgIC8vIFRoZSB0b3AtbGVmdC1jb3JuZXIgb2YgdGhlIHZpZXdwb3J0IGlzIGRldGVybWluZWQgYnkgdGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgZG9jdW1lbnRcbiAgICAvLyBib2R5LCBub3JtYWxseSBqdXN0IChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApLiBIb3dldmVyLCBDaHJvbWUgYW5kIEZpcmVmb3ggZGlzYWdyZWUgYWJvdXRcbiAgICAvLyB3aGV0aGVyIGBkb2N1bWVudC5ib2R5YCBvciBgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50YCBpcyB0aGUgc2Nyb2xsZWQgZWxlbWVudCwgc28gcmVhZGluZ1xuICAgIC8vIGBzY3JvbGxUb3BgIGFuZCBgc2Nyb2xsTGVmdGAgaXMgaW5jb25zaXN0ZW50LiBIb3dldmVyLCB1c2luZyB0aGUgYm91bmRpbmcgcmVjdCBvZlxuICAgIC8vIGBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRgIHdvcmtzIGNvbnNpc3RlbnRseSwgd2hlcmUgdGhlIGB0b3BgIGFuZCBgbGVmdGAgdmFsdWVzIHdpbGxcbiAgICAvLyBlcXVhbCBuZWdhdGl2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnQ7XG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG4gICAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ITtcbiAgICBjb25zdCBkb2N1bWVudFJlY3QgPSBkb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBjb25zdCB0b3AgPVxuICAgICAgLWRvY3VtZW50UmVjdC50b3AgfHxcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8XG4gICAgICB3aW5kb3cuc2Nyb2xsWSB8fFxuICAgICAgZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fFxuICAgICAgMDtcblxuICAgIGNvbnN0IGxlZnQgPVxuICAgICAgLWRvY3VtZW50UmVjdC5sZWZ0IHx8XG4gICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgfHxcbiAgICAgIHdpbmRvdy5zY3JvbGxYIHx8XG4gICAgICBkb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCB8fFxuICAgICAgMDtcblxuICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHNpemUgb2YgdGhlIHZpZXdwb3J0IGNoYW5nZXMuXG4gICAqIFRoaXMgc3RyZWFtIGVtaXRzIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICogQHBhcmFtIHRocm90dGxlVGltZSBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSB0aGUgc3RyZWFtLlxuICAgKi9cbiAgY2hhbmdlKHRocm90dGxlVGltZTogbnVtYmVyID0gREVGQVVMVF9SRVNJWkVfVElNRSk6IE9ic2VydmFibGU8RXZlbnQ+IHtcbiAgICByZXR1cm4gdGhyb3R0bGVUaW1lID4gMCA/IHRoaXMuX2NoYW5nZS5waXBlKGF1ZGl0VGltZSh0aHJvdHRsZVRpbWUpKSA6IHRoaXMuX2NoYW5nZTtcbiAgfVxuXG4gIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgY2FjaGVkIHZpZXdwb3J0IHNpemUuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZpZXdwb3J0U2l6ZSgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcbiAgICB0aGlzLl92aWV3cG9ydFNpemUgPSB0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXJcbiAgICAgID8ge3dpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCwgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHR9XG4gICAgICA6IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcbiAgfVxufVxuIl19