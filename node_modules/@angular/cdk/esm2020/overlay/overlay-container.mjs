/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Platform, _isTestEnvironment } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Container inside which all overlays will render. */
export class OverlayContainer {
    constructor(document, _platform) {
        this._platform = _platform;
        this._document = document;
    }
    ngOnDestroy() {
        this._containerElement?.remove();
    }
    /**
     * This method returns the overlay container element. It will lazily
     * create the element the first time it is called to facilitate using
     * the container in non-browser environments.
     * @returns the container element
     */
    getContainerElement() {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    }
    /**
     * Create the overlay container element, which is simply a div
     * with the 'cdk-overlay-container' class on the document body.
     */
    _createContainer() {
        const containerClass = 'cdk-overlay-container';
        // TODO(crisbeto): remove the testing check once we have an overlay testing
        // module or Angular starts tearing down the testing `NgModule`. See:
        // https://github.com/angular/angular/issues/18831
        if (this._platform.isBrowser || _isTestEnvironment()) {
            const oppositePlatformContainers = this._document.querySelectorAll(`.${containerClass}[platform="server"], ` + `.${containerClass}[platform="test"]`);
            // Remove any old containers from the opposite platform.
            // This can happen when transitioning from the server to the client.
            for (let i = 0; i < oppositePlatformContainers.length; i++) {
                oppositePlatformContainers[i].remove();
            }
        }
        const container = this._document.createElement('div');
        container.classList.add(containerClass);
        // A long time ago we kept adding new overlay containers whenever a new app was instantiated,
        // but at some point we added logic which clears the duplicate ones in order to avoid leaks.
        // The new logic was a little too aggressive since it was breaking some legitimate use cases.
        // To mitigate the problem we made it so that only containers from a different platform are
        // cleared, but the side-effect was that people started depending on the overly-aggressive
        // logic to clean up their tests for them. Until we can introduce an overlay-specific testing
        // module which does the cleanup, we try to detect that we're in a test environment and we
        // always clear the container. See #17006.
        // TODO(crisbeto): remove the test environment check once we have an overlay testing module.
        if (_isTestEnvironment()) {
            container.setAttribute('platform', 'test');
        }
        else if (!this._platform.isBrowser) {
            container.setAttribute('platform', 'server');
        }
        this._document.body.appendChild(container);
        this._containerElement = container;
    }
}
OverlayContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayContainer, deps: [{ token: DOCUMENT }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
OverlayContainer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayContainer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayContainer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.Platform }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvb3ZlcmxheS1jb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRW5FLHVEQUF1RDtBQUV2RCxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCLFlBQThCLFFBQWEsRUFBWSxTQUFtQjtRQUFuQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ3hFLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILG1CQUFtQjtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGdCQUFnQjtRQUN4QixNQUFNLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztRQUUvQywyRUFBMkU7UUFDM0UscUVBQXFFO1FBQ3JFLGtEQUFrRDtRQUNsRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLGtCQUFrQixFQUFFLEVBQUU7WUFDcEQsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUNoRSxJQUFJLGNBQWMsdUJBQXVCLEdBQUcsSUFBSSxjQUFjLG1CQUFtQixDQUNsRixDQUFDO1lBRUYsd0RBQXdEO1lBQ3hELG9FQUFvRTtZQUNwRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxRCwwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN4QztTQUNGO1FBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEMsNkZBQTZGO1FBQzdGLDRGQUE0RjtRQUM1Riw2RkFBNkY7UUFDN0YsMkZBQTJGO1FBQzNGLDBGQUEwRjtRQUMxRiw2RkFBNkY7UUFDN0YsMEZBQTBGO1FBQzFGLDBDQUEwQztRQUMxQyw0RkFBNEY7UUFDNUYsSUFBSSxrQkFBa0IsRUFBRSxFQUFFO1lBQ3hCLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzVDO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ3BDLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7SUFDckMsQ0FBQzs7NkdBcEVVLGdCQUFnQixrQkFJUCxRQUFRO2lIQUpqQixnQkFBZ0IsY0FESixNQUFNOzJGQUNsQixnQkFBZ0I7a0JBRDVCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFLakIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm0sIF9pc1Rlc3RFbnZpcm9ubWVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcblxuLyoqIENvbnRhaW5lciBpbnNpZGUgd2hpY2ggYWxsIG92ZXJsYXlzIHdpbGwgcmVuZGVyLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgT3ZlcmxheUNvbnRhaW5lciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByb3RlY3RlZCBfY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHByb3RlY3RlZCBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksIHByb3RlY3RlZCBfcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2NvbnRhaW5lckVsZW1lbnQ/LnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG92ZXJsYXkgY29udGFpbmVyIGVsZW1lbnQuIEl0IHdpbGwgbGF6aWx5XG4gICAqIGNyZWF0ZSB0aGUgZWxlbWVudCB0aGUgZmlyc3QgdGltZSBpdCBpcyBjYWxsZWQgdG8gZmFjaWxpdGF0ZSB1c2luZ1xuICAgKiB0aGUgY29udGFpbmVyIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50cy5cbiAgICogQHJldHVybnMgdGhlIGNvbnRhaW5lciBlbGVtZW50XG4gICAqL1xuICBnZXRDb250YWluZXJFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX2NvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jb250YWluZXJFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgb3ZlcmxheSBjb250YWluZXIgZWxlbWVudCwgd2hpY2ggaXMgc2ltcGx5IGEgZGl2XG4gICAqIHdpdGggdGhlICdjZGstb3ZlcmxheS1jb250YWluZXInIGNsYXNzIG9uIHRoZSBkb2N1bWVudCBib2R5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9jcmVhdGVDb250YWluZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY29udGFpbmVyQ2xhc3MgPSAnY2RrLW92ZXJsYXktY29udGFpbmVyJztcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiByZW1vdmUgdGhlIHRlc3RpbmcgY2hlY2sgb25jZSB3ZSBoYXZlIGFuIG92ZXJsYXkgdGVzdGluZ1xuICAgIC8vIG1vZHVsZSBvciBBbmd1bGFyIHN0YXJ0cyB0ZWFyaW5nIGRvd24gdGhlIHRlc3RpbmcgYE5nTW9kdWxlYC4gU2VlOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE4ODMxXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3NlciB8fCBfaXNUZXN0RW52aXJvbm1lbnQoKSkge1xuICAgICAgY29uc3Qgb3Bwb3NpdGVQbGF0Zm9ybUNvbnRhaW5lcnMgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBgLiR7Y29udGFpbmVyQ2xhc3N9W3BsYXRmb3JtPVwic2VydmVyXCJdLCBgICsgYC4ke2NvbnRhaW5lckNsYXNzfVtwbGF0Zm9ybT1cInRlc3RcIl1gLFxuICAgICAgKTtcblxuICAgICAgLy8gUmVtb3ZlIGFueSBvbGQgY29udGFpbmVycyBmcm9tIHRoZSBvcHBvc2l0ZSBwbGF0Zm9ybS5cbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHRyYW5zaXRpb25pbmcgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnQuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wcG9zaXRlUGxhdGZvcm1Db250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9wcG9zaXRlUGxhdGZvcm1Db250YWluZXJzW2ldLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNvbnRhaW5lckNsYXNzKTtcblxuICAgIC8vIEEgbG9uZyB0aW1lIGFnbyB3ZSBrZXB0IGFkZGluZyBuZXcgb3ZlcmxheSBjb250YWluZXJzIHdoZW5ldmVyIGEgbmV3IGFwcCB3YXMgaW5zdGFudGlhdGVkLFxuICAgIC8vIGJ1dCBhdCBzb21lIHBvaW50IHdlIGFkZGVkIGxvZ2ljIHdoaWNoIGNsZWFycyB0aGUgZHVwbGljYXRlIG9uZXMgaW4gb3JkZXIgdG8gYXZvaWQgbGVha3MuXG4gICAgLy8gVGhlIG5ldyBsb2dpYyB3YXMgYSBsaXR0bGUgdG9vIGFnZ3Jlc3NpdmUgc2luY2UgaXQgd2FzIGJyZWFraW5nIHNvbWUgbGVnaXRpbWF0ZSB1c2UgY2FzZXMuXG4gICAgLy8gVG8gbWl0aWdhdGUgdGhlIHByb2JsZW0gd2UgbWFkZSBpdCBzbyB0aGF0IG9ubHkgY29udGFpbmVycyBmcm9tIGEgZGlmZmVyZW50IHBsYXRmb3JtIGFyZVxuICAgIC8vIGNsZWFyZWQsIGJ1dCB0aGUgc2lkZS1lZmZlY3Qgd2FzIHRoYXQgcGVvcGxlIHN0YXJ0ZWQgZGVwZW5kaW5nIG9uIHRoZSBvdmVybHktYWdncmVzc2l2ZVxuICAgIC8vIGxvZ2ljIHRvIGNsZWFuIHVwIHRoZWlyIHRlc3RzIGZvciB0aGVtLiBVbnRpbCB3ZSBjYW4gaW50cm9kdWNlIGFuIG92ZXJsYXktc3BlY2lmaWMgdGVzdGluZ1xuICAgIC8vIG1vZHVsZSB3aGljaCBkb2VzIHRoZSBjbGVhbnVwLCB3ZSB0cnkgdG8gZGV0ZWN0IHRoYXQgd2UncmUgaW4gYSB0ZXN0IGVudmlyb25tZW50IGFuZCB3ZVxuICAgIC8vIGFsd2F5cyBjbGVhciB0aGUgY29udGFpbmVyLiBTZWUgIzE3MDA2LlxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiByZW1vdmUgdGhlIHRlc3QgZW52aXJvbm1lbnQgY2hlY2sgb25jZSB3ZSBoYXZlIGFuIG92ZXJsYXkgdGVzdGluZyBtb2R1bGUuXG4gICAgaWYgKF9pc1Rlc3RFbnZpcm9ubWVudCgpKSB7XG4gICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdwbGF0Zm9ybScsICd0ZXN0Jyk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdwbGF0Zm9ybScsICdzZXJ2ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgdGhpcy5fY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lcjtcbiAgfVxufVxuIl19