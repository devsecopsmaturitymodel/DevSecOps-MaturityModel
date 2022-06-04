/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import { BaseOverlayDispatcher } from './base-overlay-dispatcher';
import * as i0 from "@angular/core";
/**
 * Service for dispatching keyboard events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
export class OverlayKeyboardDispatcher extends BaseOverlayDispatcher {
    constructor(document, 
    /** @breaking-change 14.0.0 _ngZone will be required. */
    _ngZone) {
        super(document);
        this._ngZone = _ngZone;
        /** Keyboard event listener that will be attached to the body. */
        this._keydownListener = (event) => {
            const overlays = this._attachedOverlays;
            for (let i = overlays.length - 1; i > -1; i--) {
                // Dispatch the keydown event to the top overlay which has subscribers to its keydown events.
                // We want to target the most recent overlay, rather than trying to match where the event came
                // from, because some components might open an overlay, but keep focus on a trigger element
                // (e.g. for select and autocomplete). We skip overlays without keydown event subscriptions,
                // because we don't want overlays that don't handle keyboard events to block the ones below
                // them that do.
                if (overlays[i]._keydownEvents.observers.length > 0) {
                    const keydownEvents = overlays[i]._keydownEvents;
                    /** @breaking-change 14.0.0 _ngZone will be required. */
                    if (this._ngZone) {
                        this._ngZone.run(() => keydownEvents.next(event));
                    }
                    else {
                        keydownEvents.next(event);
                    }
                    break;
                }
            }
        };
    }
    /** Add a new overlay to the list of attached overlay refs. */
    add(overlayRef) {
        super.add(overlayRef);
        // Lazily start dispatcher once first overlay is added
        if (!this._isAttached) {
            /** @breaking-change 14.0.0 _ngZone will be required. */
            if (this._ngZone) {
                this._ngZone.runOutsideAngular(() => this._document.body.addEventListener('keydown', this._keydownListener));
            }
            else {
                this._document.body.addEventListener('keydown', this._keydownListener);
            }
            this._isAttached = true;
        }
    }
    /** Detaches the global keyboard event listener. */
    detach() {
        if (this._isAttached) {
            this._document.body.removeEventListener('keydown', this._keydownListener);
            this._isAttached = false;
        }
    }
}
OverlayKeyboardDispatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayKeyboardDispatcher, deps: [{ token: DOCUMENT }, { token: i0.NgZone, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
OverlayKeyboardDispatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayKeyboardDispatcher, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayKeyboardDispatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1rZXlib2FyZC1kaXNwYXRjaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L2Rpc3BhdGNoZXJzL292ZXJsYXkta2V5Ym9hcmQtZGlzcGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVuRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQzs7QUFFaEU7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxxQkFBcUI7SUFDbEUsWUFDb0IsUUFBYTtJQUMvQix3REFBd0Q7SUFDcEMsT0FBZ0I7UUFFcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRkksWUFBTyxHQUFQLE9BQU8sQ0FBUztRQStCdEMsaUVBQWlFO1FBQ3pELHFCQUFnQixHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO1lBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUV4QyxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsNkZBQTZGO2dCQUM3Riw4RkFBOEY7Z0JBQzlGLDJGQUEyRjtnQkFDM0YsNEZBQTRGO2dCQUM1RiwyRkFBMkY7Z0JBQzNGLGdCQUFnQjtnQkFDaEIsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNuRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO29CQUNqRCx3REFBd0Q7b0JBQ3hELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUNuRDt5QkFBTTt3QkFDTCxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMzQjtvQkFDRCxNQUFNO2lCQUNQO2FBQ0Y7UUFDSCxDQUFDLENBQUM7SUFsREYsQ0FBQztJQUVELDhEQUE4RDtJQUNyRCxHQUFHLENBQUMsVUFBNEI7UUFDdkMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV0QixzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsd0RBQXdEO1lBQ3hELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUN2RSxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3hFO1lBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsbURBQW1EO0lBQ3pDLE1BQU07UUFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQzs7c0hBakNVLHlCQUF5QixrQkFFMUIsUUFBUTswSEFGUCx5QkFBeUIsY0FEYixNQUFNOzJGQUNsQix5QkFBeUI7a0JBRHJDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFHM0IsTUFBTTsyQkFBQyxRQUFROzswQkFFZixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge092ZXJsYXlSZWZlcmVuY2V9IGZyb20gJy4uL292ZXJsYXktcmVmZXJlbmNlJztcbmltcG9ydCB7QmFzZU92ZXJsYXlEaXNwYXRjaGVyfSBmcm9tICcuL2Jhc2Utb3ZlcmxheS1kaXNwYXRjaGVyJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBkaXNwYXRjaGluZyBrZXlib2FyZCBldmVudHMgdGhhdCBsYW5kIG9uIHRoZSBib2R5IHRvIGFwcHJvcHJpYXRlIG92ZXJsYXkgcmVmLFxuICogaWYgYW55LiBJdCBtYWludGFpbnMgYSBsaXN0IG9mIGF0dGFjaGVkIG92ZXJsYXlzIHRvIGRldGVybWluZSBiZXN0IHN1aXRlZCBvdmVybGF5IGJhc2VkXG4gKiBvbiBldmVudCB0YXJnZXQgYW5kIG9yZGVyIG9mIG92ZXJsYXkgb3BlbnMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXlLZXlib2FyZERpc3BhdGNoZXIgZXh0ZW5kcyBCYXNlT3ZlcmxheURpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIC8qKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBfbmdab25lIHdpbGwgYmUgcmVxdWlyZWQuICovXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfbmdab25lPzogTmdab25lLFxuICApIHtcbiAgICBzdXBlcihkb2N1bWVudCk7XG4gIH1cblxuICAvKiogQWRkIGEgbmV3IG92ZXJsYXkgdG8gdGhlIGxpc3Qgb2YgYXR0YWNoZWQgb3ZlcmxheSByZWZzLiAqL1xuICBvdmVycmlkZSBhZGQob3ZlcmxheVJlZjogT3ZlcmxheVJlZmVyZW5jZSk6IHZvaWQge1xuICAgIHN1cGVyLmFkZChvdmVybGF5UmVmKTtcblxuICAgIC8vIExhemlseSBzdGFydCBkaXNwYXRjaGVyIG9uY2UgZmlyc3Qgb3ZlcmxheSBpcyBhZGRlZFxuICAgIGlmICghdGhpcy5faXNBdHRhY2hlZCkge1xuICAgICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIF9uZ1pvbmUgd2lsbCBiZSByZXF1aXJlZC4gKi9cbiAgICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5ZG93bkxpc3RlbmVyKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleWRvd25MaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogRGV0YWNoZXMgdGhlIGdsb2JhbCBrZXlib2FyZCBldmVudCBsaXN0ZW5lci4gKi9cbiAgcHJvdGVjdGVkIGRldGFjaCgpIHtcbiAgICBpZiAodGhpcy5faXNBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5ZG93bkxpc3RlbmVyKTtcbiAgICAgIHRoaXMuX2lzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKiogS2V5Ym9hcmQgZXZlbnQgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBib2R5LiAqL1xuICBwcml2YXRlIF9rZXlkb3duTGlzdGVuZXIgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBjb25zdCBvdmVybGF5cyA9IHRoaXMuX2F0dGFjaGVkT3ZlcmxheXM7XG5cbiAgICBmb3IgKGxldCBpID0gb3ZlcmxheXMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgIC8vIERpc3BhdGNoIHRoZSBrZXlkb3duIGV2ZW50IHRvIHRoZSB0b3Agb3ZlcmxheSB3aGljaCBoYXMgc3Vic2NyaWJlcnMgdG8gaXRzIGtleWRvd24gZXZlbnRzLlxuICAgICAgLy8gV2Ugd2FudCB0byB0YXJnZXQgdGhlIG1vc3QgcmVjZW50IG92ZXJsYXksIHJhdGhlciB0aGFuIHRyeWluZyB0byBtYXRjaCB3aGVyZSB0aGUgZXZlbnQgY2FtZVxuICAgICAgLy8gZnJvbSwgYmVjYXVzZSBzb21lIGNvbXBvbmVudHMgbWlnaHQgb3BlbiBhbiBvdmVybGF5LCBidXQga2VlcCBmb2N1cyBvbiBhIHRyaWdnZXIgZWxlbWVudFxuICAgICAgLy8gKGUuZy4gZm9yIHNlbGVjdCBhbmQgYXV0b2NvbXBsZXRlKS4gV2Ugc2tpcCBvdmVybGF5cyB3aXRob3V0IGtleWRvd24gZXZlbnQgc3Vic2NyaXB0aW9ucyxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBvdmVybGF5cyB0aGF0IGRvbid0IGhhbmRsZSBrZXlib2FyZCBldmVudHMgdG8gYmxvY2sgdGhlIG9uZXMgYmVsb3dcbiAgICAgIC8vIHRoZW0gdGhhdCBkby5cbiAgICAgIGlmIChvdmVybGF5c1tpXS5fa2V5ZG93bkV2ZW50cy5vYnNlcnZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBrZXlkb3duRXZlbnRzID0gb3ZlcmxheXNbaV0uX2tleWRvd25FdmVudHM7XG4gICAgICAgIC8qKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBfbmdab25lIHdpbGwgYmUgcmVxdWlyZWQuICovXG4gICAgICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IGtleWRvd25FdmVudHMubmV4dChldmVudCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleWRvd25FdmVudHMubmV4dChldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19