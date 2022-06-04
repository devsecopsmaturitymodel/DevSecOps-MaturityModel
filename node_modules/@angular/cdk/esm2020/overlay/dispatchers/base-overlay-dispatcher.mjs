/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Service for dispatching events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
export class BaseOverlayDispatcher {
    constructor(document) {
        /** Currently attached overlays in the order they were attached. */
        this._attachedOverlays = [];
        this._document = document;
    }
    ngOnDestroy() {
        this.detach();
    }
    /** Add a new overlay to the list of attached overlay refs. */
    add(overlayRef) {
        // Ensure that we don't get the same overlay multiple times.
        this.remove(overlayRef);
        this._attachedOverlays.push(overlayRef);
    }
    /** Remove an overlay from the list of attached overlay refs. */
    remove(overlayRef) {
        const index = this._attachedOverlays.indexOf(overlayRef);
        if (index > -1) {
            this._attachedOverlays.splice(index, 1);
        }
        // Remove the global listener once there are no more overlays.
        if (this._attachedOverlays.length === 0) {
            this.detach();
        }
    }
}
BaseOverlayDispatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BaseOverlayDispatcher, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
BaseOverlayDispatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BaseOverlayDispatcher, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BaseOverlayDispatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1vdmVybGF5LWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvZGlzcGF0Y2hlcnMvYmFzZS1vdmVybGF5LWRpc3BhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDOztBQUc1RDs7OztHQUlHO0FBRUgsTUFBTSxPQUFnQixxQkFBcUI7SUFPekMsWUFBOEIsUUFBYTtRQU4zQyxtRUFBbUU7UUFDbkUsc0JBQWlCLEdBQXVCLEVBQUUsQ0FBQztRQU16QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsOERBQThEO0lBQzlELEdBQUcsQ0FBQyxVQUE0QjtRQUM5Qiw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxnRUFBZ0U7SUFDaEUsTUFBTSxDQUFDLFVBQTRCO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFekQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN6QztRQUVELDhEQUE4RDtRQUM5RCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQzs7a0hBbENtQixxQkFBcUIsa0JBT3JCLFFBQVE7c0hBUFIscUJBQXFCLGNBRGxCLE1BQU07MkZBQ1QscUJBQXFCO2tCQUQxQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBUWpCLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge092ZXJsYXlSZWZlcmVuY2V9IGZyb20gJy4uL292ZXJsYXktcmVmZXJlbmNlJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBkaXNwYXRjaGluZyBldmVudHMgdGhhdCBsYW5kIG9uIHRoZSBib2R5IHRvIGFwcHJvcHJpYXRlIG92ZXJsYXkgcmVmLFxuICogaWYgYW55LiBJdCBtYWludGFpbnMgYSBsaXN0IG9mIGF0dGFjaGVkIG92ZXJsYXlzIHRvIGRldGVybWluZSBiZXN0IHN1aXRlZCBvdmVybGF5IGJhc2VkXG4gKiBvbiBldmVudCB0YXJnZXQgYW5kIG9yZGVyIG9mIG92ZXJsYXkgb3BlbnMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VPdmVybGF5RGlzcGF0Y2hlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBDdXJyZW50bHkgYXR0YWNoZWQgb3ZlcmxheXMgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBhdHRhY2hlZC4gKi9cbiAgX2F0dGFjaGVkT3ZlcmxheXM6IE92ZXJsYXlSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIHByb3RlY3RlZCBfZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcm90ZWN0ZWQgX2lzQXR0YWNoZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRldGFjaCgpO1xuICB9XG5cbiAgLyoqIEFkZCBhIG5ldyBvdmVybGF5IHRvIHRoZSBsaXN0IG9mIGF0dGFjaGVkIG92ZXJsYXkgcmVmcy4gKi9cbiAgYWRkKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWZlcmVuY2UpOiB2b2lkIHtcbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBkb24ndCBnZXQgdGhlIHNhbWUgb3ZlcmxheSBtdWx0aXBsZSB0aW1lcy5cbiAgICB0aGlzLnJlbW92ZShvdmVybGF5UmVmKTtcbiAgICB0aGlzLl9hdHRhY2hlZE92ZXJsYXlzLnB1c2gob3ZlcmxheVJlZik7XG4gIH1cblxuICAvKiogUmVtb3ZlIGFuIG92ZXJsYXkgZnJvbSB0aGUgbGlzdCBvZiBhdHRhY2hlZCBvdmVybGF5IHJlZnMuICovXG4gIHJlbW92ZShvdmVybGF5UmVmOiBPdmVybGF5UmVmZXJlbmNlKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9hdHRhY2hlZE92ZXJsYXlzLmluZGV4T2Yob3ZlcmxheVJlZik7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5fYXR0YWNoZWRPdmVybGF5cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgZ2xvYmFsIGxpc3RlbmVyIG9uY2UgdGhlcmUgYXJlIG5vIG1vcmUgb3ZlcmxheXMuXG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkT3ZlcmxheXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmRldGFjaCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRhY2hlcyB0aGUgZ2xvYmFsIGV2ZW50IGxpc3RlbmVyLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZGV0YWNoKCk6IHZvaWQ7XG59XG4iXX0=