/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import { Platform, _getEventTarget } from '@angular/cdk/platform';
import { BaseOverlayDispatcher } from './base-overlay-dispatcher';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * Service for dispatching mouse click events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
export class OverlayOutsideClickDispatcher extends BaseOverlayDispatcher {
    constructor(document, _platform, 
    /** @breaking-change 14.0.0 _ngZone will be required. */
    _ngZone) {
        super(document);
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._cursorStyleIsSet = false;
        /** Store pointerdown event target to track origin of click. */
        this._pointerDownListener = (event) => {
            this._pointerDownEventTarget = _getEventTarget(event);
        };
        /** Click event listener that will be attached to the body propagate phase. */
        this._clickListener = (event) => {
            const target = _getEventTarget(event);
            // In case of a click event, we want to check the origin of the click
            // (e.g. in case where a user starts a click inside the overlay and
            // releases the click outside of it).
            // This is done by using the event target of the preceding pointerdown event.
            // Every click event caused by a pointer device has a preceding pointerdown
            // event, unless the click was programmatically triggered (e.g. in a unit test).
            const origin = event.type === 'click' && this._pointerDownEventTarget
                ? this._pointerDownEventTarget
                : target;
            // Reset the stored pointerdown event target, to avoid having it interfere
            // in subsequent events.
            this._pointerDownEventTarget = null;
            // We copy the array because the original may be modified asynchronously if the
            // outsidePointerEvents listener decides to detach overlays resulting in index errors inside
            // the for loop.
            const overlays = this._attachedOverlays.slice();
            // Dispatch the mouse event to the top overlay which has subscribers to its mouse events.
            // We want to target all overlays for which the click could be considered as outside click.
            // As soon as we reach an overlay for which the click is not outside click we break off
            // the loop.
            for (let i = overlays.length - 1; i > -1; i--) {
                const overlayRef = overlays[i];
                if (overlayRef._outsidePointerEvents.observers.length < 1 || !overlayRef.hasAttached()) {
                    continue;
                }
                // If it's a click inside the overlay, just break - we should do nothing
                // If it's an outside click (both origin and target of the click) dispatch the mouse event,
                // and proceed with the next overlay
                if (overlayRef.overlayElement.contains(target) ||
                    overlayRef.overlayElement.contains(origin)) {
                    break;
                }
                const outsidePointerEvents = overlayRef._outsidePointerEvents;
                /** @breaking-change 14.0.0 _ngZone will be required. */
                if (this._ngZone) {
                    this._ngZone.run(() => outsidePointerEvents.next(event));
                }
                else {
                    outsidePointerEvents.next(event);
                }
            }
        };
    }
    /** Add a new overlay to the list of attached overlay refs. */
    add(overlayRef) {
        super.add(overlayRef);
        // Safari on iOS does not generate click events for non-interactive
        // elements. However, we want to receive a click for any element outside
        // the overlay. We can force a "clickable" state by setting
        // `cursor: pointer` on the document body. See:
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event#Safari_Mobile
        // https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
        if (!this._isAttached) {
            const body = this._document.body;
            /** @breaking-change 14.0.0 _ngZone will be required. */
            if (this._ngZone) {
                this._ngZone.runOutsideAngular(() => this._addEventListeners(body));
            }
            else {
                this._addEventListeners(body);
            }
            // click event is not fired on iOS. To make element "clickable" we are
            // setting the cursor to pointer
            if (this._platform.IOS && !this._cursorStyleIsSet) {
                this._cursorOriginalValue = body.style.cursor;
                body.style.cursor = 'pointer';
                this._cursorStyleIsSet = true;
            }
            this._isAttached = true;
        }
    }
    /** Detaches the global keyboard event listener. */
    detach() {
        if (this._isAttached) {
            const body = this._document.body;
            body.removeEventListener('pointerdown', this._pointerDownListener, true);
            body.removeEventListener('click', this._clickListener, true);
            body.removeEventListener('auxclick', this._clickListener, true);
            body.removeEventListener('contextmenu', this._clickListener, true);
            if (this._platform.IOS && this._cursorStyleIsSet) {
                body.style.cursor = this._cursorOriginalValue;
                this._cursorStyleIsSet = false;
            }
            this._isAttached = false;
        }
    }
    _addEventListeners(body) {
        body.addEventListener('pointerdown', this._pointerDownListener, true);
        body.addEventListener('click', this._clickListener, true);
        body.addEventListener('auxclick', this._clickListener, true);
        body.addEventListener('contextmenu', this._clickListener, true);
    }
}
OverlayOutsideClickDispatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayOutsideClickDispatcher, deps: [{ token: DOCUMENT }, { token: i1.Platform }, { token: i0.NgZone, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
OverlayOutsideClickDispatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayOutsideClickDispatcher, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayOutsideClickDispatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.Platform }, { type: i0.NgZone, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1vdXRzaWRlLWNsaWNrLWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvZGlzcGF0Y2hlcnMvb3ZlcmxheS1vdXRzaWRlLWNsaWNrLWRpc3BhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFbkUsT0FBTyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRWhFOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sNkJBQThCLFNBQVEscUJBQXFCO0lBS3RFLFlBQ29CLFFBQWEsRUFDdkIsU0FBbUI7SUFDM0Isd0RBQXdEO0lBQ3BDLE9BQWdCO1FBRXBDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUpSLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFFUCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBUDlCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQW1FbEMsK0RBQStEO1FBQ3ZELHlCQUFvQixHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFO1lBQ3JELElBQUksQ0FBQyx1QkFBdUIsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDO1FBRUYsOEVBQThFO1FBQ3RFLG1CQUFjLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDN0MsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLHFFQUFxRTtZQUNyRSxtRUFBbUU7WUFDbkUscUNBQXFDO1lBQ3JDLDZF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SUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRSxDQUFDOzswSEFuRVUsNkJBQTZCLGtCQU05QixRQUFROzhIQU5QLDZCQUE2QixjQURqQixNQUFNOzJGQUNsQiw2QkFBNkI7a0JBRHpDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFPM0IsTUFBTTsyQkFBQyxRQUFROzswQkFHZixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge092ZXJsYXlSZWZlcmVuY2V9IGZyb20gJy4uL292ZXJsYXktcmVmZXJlbmNlJztcbmltcG9ydCB7UGxhdGZvcm0sIF9nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QmFzZU92ZXJsYXlEaXNwYXRjaGVyfSBmcm9tICcuL2Jhc2Utb3ZlcmxheS1kaXNwYXRjaGVyJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBkaXNwYXRjaGluZyBtb3VzZSBjbGljayBldmVudHMgdGhhdCBsYW5kIG9uIHRoZSBib2R5IHRvIGFwcHJvcHJpYXRlIG92ZXJsYXkgcmVmLFxuICogaWYgYW55LiBJdCBtYWludGFpbnMgYSBsaXN0IG9mIGF0dGFjaGVkIG92ZXJsYXlzIHRvIGRldGVybWluZSBiZXN0IHN1aXRlZCBvdmVybGF5IGJhc2VkXG4gKiBvbiBldmVudCB0YXJnZXQgYW5kIG9yZGVyIG9mIG92ZXJsYXkgb3BlbnMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXlPdXRzaWRlQ2xpY2tEaXNwYXRjaGVyIGV4dGVuZHMgQmFzZU92ZXJsYXlEaXNwYXRjaGVyIHtcbiAgcHJpdmF0ZSBfY3Vyc29yT3JpZ2luYWxWYWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIF9jdXJzb3JTdHlsZUlzU2V0ID0gZmFsc2U7XG4gIHByaXZhdGUgX3BvaW50ZXJEb3duRXZlbnRUYXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjAgX25nWm9uZSB3aWxsIGJlIHJlcXVpcmVkLiAqL1xuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX25nWm9uZT86IE5nWm9uZSxcbiAgKSB7XG4gICAgc3VwZXIoZG9jdW1lbnQpO1xuICB9XG5cbiAgLyoqIEFkZCBhIG5ldyBvdmVybGF5IHRvIHRoZSBsaXN0IG9mIGF0dGFjaGVkIG92ZXJsYXkgcmVmcy4gKi9cbiAgb3ZlcnJpZGUgYWRkKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWZlcmVuY2UpOiB2b2lkIHtcbiAgICBzdXBlci5hZGQob3ZlcmxheVJlZik7XG5cbiAgICAvLyBTYWZhcmkgb24gaU9TIGRvZXMgbm90IGdlbmVyYXRlIGNsaWNrIGV2ZW50cyBmb3Igbm9uLWludGVyYWN0aXZlXG4gICAgLy8gZWxlbWVudHMuIEhvd2V2ZXIsIHdlIHdhbnQgdG8gcmVjZWl2ZSBhIGNsaWNrIGZvciBhbnkgZWxlbWVudCBvdXRzaWRlXG4gICAgLy8gdGhlIG92ZXJsYXkuIFdlIGNhbiBmb3JjZSBhIFwiY2xpY2thYmxlXCIgc3RhdGUgYnkgc2V0dGluZ1xuICAgIC8vIGBjdXJzb3I6IHBvaW50ZXJgIG9uIHRoZSBkb2N1bWVudCBib2R5LiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvY2xpY2tfZXZlbnQjU2FmYXJpX01vYmlsZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLmFwcGxlLmNvbS9saWJyYXJ5L2FyY2hpdmUvZG9jdW1lbnRhdGlvbi9BcHBsZUFwcGxpY2F0aW9ucy9SZWZlcmVuY2UvU2FmYXJpV2ViQ29udGVudC9IYW5kbGluZ0V2ZW50cy9IYW5kbGluZ0V2ZW50cy5odG1sXG4gICAgaWYgKCF0aGlzLl9pc0F0dGFjaGVkKSB7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcblxuICAgICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIF9uZ1pvbmUgd2lsbCBiZSByZXF1aXJlZC4gKi9cbiAgICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKGJvZHkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKGJvZHkpO1xuICAgICAgfVxuXG4gICAgICAvLyBjbGljayBldmVudCBpcyBub3QgZmlyZWQgb24gaU9TLiBUbyBtYWtlIGVsZW1lbnQgXCJjbGlja2FibGVcIiB3ZSBhcmVcbiAgICAgIC8vIHNldHRpbmcgdGhlIGN1cnNvciB0byBwb2ludGVyXG4gICAgICBpZiAodGhpcy5fcGxhdGZvcm0uSU9TICYmICF0aGlzLl9jdXJzb3JTdHlsZUlzU2V0KSB7XG4gICAgICAgIHRoaXMuX2N1cnNvck9yaWdpbmFsVmFsdWUgPSBib2R5LnN0eWxlLmN1cnNvcjtcbiAgICAgICAgYm9keS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIHRoaXMuX2N1cnNvclN0eWxlSXNTZXQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogRGV0YWNoZXMgdGhlIGdsb2JhbCBrZXlib2FyZCBldmVudCBsaXN0ZW5lci4gKi9cbiAgcHJvdGVjdGVkIGRldGFjaCgpIHtcbiAgICBpZiAodGhpcy5faXNBdHRhY2hlZCkge1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fcG9pbnRlckRvd25MaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2F1eGNsaWNrJywgdGhpcy5fY2xpY2tMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcy5fY2xpY2tMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICBpZiAodGhpcy5fcGxhdGZvcm0uSU9TICYmIHRoaXMuX2N1cnNvclN0eWxlSXNTZXQpIHtcbiAgICAgICAgYm9keS5zdHlsZS5jdXJzb3IgPSB0aGlzLl9jdXJzb3JPcmlnaW5hbFZhbHVlO1xuICAgICAgICB0aGlzLl9jdXJzb3JTdHlsZUlzU2V0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLl9pc0F0dGFjaGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWRkRXZlbnRMaXN0ZW5lcnMoYm9keTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fcG9pbnRlckRvd25MaXN0ZW5lciwgdHJ1ZSk7XG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NsaWNrTGlzdGVuZXIsIHRydWUpO1xuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignYXV4Y2xpY2snLCB0aGlzLl9jbGlja0xpc3RlbmVyLCB0cnVlKTtcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcy5fY2xpY2tMaXN0ZW5lciwgdHJ1ZSk7XG4gIH1cblxuICAvKiogU3RvcmUgcG9pbnRlcmRvd24gZXZlbnQgdGFyZ2V0IHRvIHRyYWNrIG9yaWdpbiBvZiBjbGljay4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlckRvd25MaXN0ZW5lciA9IChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgdGhpcy5fcG9pbnRlckRvd25FdmVudFRhcmdldCA9IF9nZXRFdmVudFRhcmdldChldmVudCk7XG4gIH07XG5cbiAgLyoqIENsaWNrIGV2ZW50IGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBhdHRhY2hlZCB0byB0aGUgYm9keSBwcm9wYWdhdGUgcGhhc2UuICovXG4gIHByaXZhdGUgX2NsaWNrTGlzdGVuZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBfZ2V0RXZlbnRUYXJnZXQoZXZlbnQpO1xuICAgIC8vIEluIGNhc2Ugb2YgYSBjbGljayBldmVudCwgd2Ugd2FudCB0byBjaGVjayB0aGUgb3JpZ2luIG9mIHRoZSBjbGlja1xuICAgIC8vIChlLmcuIGluIGNhc2Ugd2hlcmUgYSB1c2VyIHN0YXJ0cyBhIGNsaWNrIGluc2lkZSB0aGUgb3ZlcmxheSBhbmRcbiAgICAvLyByZWxlYXNlcyB0aGUgY2xpY2sgb3V0c2lkZSBvZiBpdCkuXG4gICAgLy8gVGhpcyBpcyBkb25lIGJ5IHVzaW5nIHRoZSBldmVudCB0YXJnZXQgb2YgdGhlIHByZWNlZGluZyBwb2ludGVyZG93biBldmVudC5cbiAgICAvLyBFdmVyeSBjbGljayBldmVudCBjYXVzZWQgYnkgYSBwb2ludGVyIGRldmljZSBoYXMgYSBwcmVjZWRpbmcgcG9pbnRlcmRvd25cbiAgICAvLyBldmVudCwgdW5sZXNzIHRoZSBjbGljayB3YXMgcHJvZ3JhbW1hdGljYWxseSB0cmlnZ2VyZWQgKGUuZy4gaW4gYSB1bml0IHRlc3QpLlxuICAgIGNvbnN0IG9yaWdpbiA9XG4gICAgICBldmVudC50eXBlID09PSAnY2xpY2snICYmIHRoaXMuX3BvaW50ZXJEb3duRXZlbnRUYXJnZXRcbiAgICAgICAgPyB0aGlzLl9wb2ludGVyRG93bkV2ZW50VGFyZ2V0XG4gICAgICAgIDogdGFyZ2V0O1xuICAgIC8vIFJlc2V0IHRoZSBzdG9yZWQgcG9pbnRlcmRvd24gZXZlbnQgdGFyZ2V0LCB0byBhdm9pZCBoYXZpbmcgaXQgaW50ZXJmZXJlXG4gICAgLy8gaW4gc3Vic2VxdWVudCBldmVudHMuXG4gICAgdGhpcy5fcG9pbnRlckRvd25FdmVudFRhcmdldCA9IG51bGw7XG5cbiAgICAvLyBXZSBjb3B5IHRoZSBhcnJheSBiZWNhdXNlIHRoZSBvcmlnaW5hbCBtYXkgYmUgbW9kaWZpZWQgYXN5bmNocm9ub3VzbHkgaWYgdGhlXG4gICAgLy8gb3V0c2lkZVBvaW50ZXJFdmVudHMgbGlzdGVuZXIgZGVjaWRlcyB0byBkZXRhY2ggb3ZlcmxheXMgcmVzdWx0aW5nIGluIGluZGV4IGVycm9ycyBpbnNpZGVcbiAgICAvLyB0aGUgZm9yIGxvb3AuXG4gICAgY29uc3Qgb3ZlcmxheXMgPSB0aGlzLl9hdHRhY2hlZE92ZXJsYXlzLnNsaWNlKCk7XG5cbiAgICAvLyBEaXNwYXRjaCB0aGUgbW91c2UgZXZlbnQgdG8gdGhlIHRvcCBvdmVybGF5IHdoaWNoIGhhcyBzdWJzY3JpYmVycyB0byBpdHMgbW91c2UgZXZlbnRzLlxuICAgIC8vIFdlIHdhbnQgdG8gdGFyZ2V0IGFsbCBvdmVybGF5cyBmb3Igd2hpY2ggdGhlIGNsaWNrIGNvdWxkIGJlIGNvbnNpZGVyZWQgYXMgb3V0c2lkZSBjbGljay5cbiAgICAvLyBBcyBzb29uIGFzIHdlIHJlYWNoIGFuIG92ZXJsYXkgZm9yIHdoaWNoIHRoZSBjbGljayBpcyBub3Qgb3V0c2lkZSBjbGljayB3ZSBicmVhayBvZmZcbiAgICAvLyB0aGUgbG9vcC5cbiAgICBmb3IgKGxldCBpID0gb3ZlcmxheXMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlSZWYgPSBvdmVybGF5c1tpXTtcbiAgICAgIGlmIChvdmVybGF5UmVmLl9vdXRzaWRlUG9pbnRlckV2ZW50cy5vYnNlcnZlcnMubGVuZ3RoIDwgMSB8fCAhb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCdzIGEgY2xpY2sgaW5zaWRlIHRoZSBvdmVybGF5LCBqdXN0IGJyZWFrIC0gd2Ugc2hvdWxkIGRvIG5vdGhpbmdcbiAgICAgIC8vIElmIGl0J3MgYW4gb3V0c2lkZSBjbGljayAoYm90aCBvcmlnaW4gYW5kIHRhcmdldCBvZiB0aGUgY2xpY2spIGRpc3BhdGNoIHRoZSBtb3VzZSBldmVudCxcbiAgICAgIC8vIGFuZCBwcm9jZWVkIHdpdGggdGhlIG5leHQgb3ZlcmxheVxuICAgICAgaWYgKFxuICAgICAgICBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmNvbnRhaW5zKHRhcmdldCBhcyBOb2RlKSB8fFxuICAgICAgICBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmNvbnRhaW5zKG9yaWdpbiBhcyBOb2RlKVxuICAgICAgKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXRzaWRlUG9pbnRlckV2ZW50cyA9IG92ZXJsYXlSZWYuX291dHNpZGVQb2ludGVyRXZlbnRzO1xuICAgICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIF9uZ1pvbmUgd2lsbCBiZSByZXF1aXJlZC4gKi9cbiAgICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiBvdXRzaWRlUG9pbnRlckV2ZW50cy5uZXh0KGV2ZW50KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlUG9pbnRlckV2ZW50cy5uZXh0KGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=