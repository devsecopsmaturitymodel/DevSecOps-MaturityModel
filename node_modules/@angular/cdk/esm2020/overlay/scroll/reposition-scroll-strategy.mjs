/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getMatScrollStrategyAlreadyAttachedError } from './scroll-strategy';
import { isElementScrolledOutsideView } from '../position/scroll-clip';
/**
 * Strategy that will update the element position as the user is scrolling.
 */
export class RepositionScrollStrategy {
    constructor(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        this._ngZone = _ngZone;
        this._config = _config;
        this._scrollSubscription = null;
    }
    /** Attaches this scroll strategy to an overlay. */
    attach(overlayRef) {
        if (this._overlayRef && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    }
    /** Enables repositioning of the attached overlay on scroll. */
    enable() {
        if (!this._scrollSubscription) {
            const throttle = this._config ? this._config.scrollThrottle : 0;
            this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(() => {
                this._overlayRef.updatePosition();
                // TODO(crisbeto): make `close` on by default once all components can handle it.
                if (this._config && this._config.autoClose) {
                    const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
                    const { width, height } = this._viewportRuler.getViewportSize();
                    // TODO(crisbeto): include all ancestor scroll containers here once
                    // we have a way of exposing the trigger element to the scroll strategy.
                    const parentRects = [{ width, height, bottom: height, right: width, top: 0, left: 0 }];
                    if (isElementScrolledOutsideView(overlayRect, parentRects)) {
                        this.disable();
                        this._ngZone.run(() => this._overlayRef.detach());
                    }
                }
            });
        }
    }
    /** Disables repositioning of the attached overlay on scroll. */
    disable() {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = null;
        }
    }
    detach() {
        this.disable();
        this._overlayRef = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3NpdGlvbi1zY3JvbGwtc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvc2Nyb2xsL3JlcG9zaXRpb24tc2Nyb2xsLXN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFBaUIsd0NBQXdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUczRixPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQWFyRTs7R0FFRztBQUNILE1BQU0sT0FBTyx3QkFBd0I7SUFJbkMsWUFDVSxpQkFBbUMsRUFDbkMsY0FBNkIsRUFDN0IsT0FBZSxFQUNmLE9BQXdDO1FBSHhDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQWlDO1FBUDFDLHdCQUFtQixHQUF3QixJQUFJLENBQUM7SUFRckQsQ0FBQztJQUVKLG1EQUFtRDtJQUNuRCxNQUFNLENBQUMsVUFBNEI7UUFDakMsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZFLE1BQU0sd0NBQXdDLEVBQUUsQ0FBQztTQUNsRDtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFFRCwrREFBK0Q7SUFDL0QsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNsRixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUVsQyxnRkFBZ0Y7Z0JBQ2hGLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtvQkFDMUMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztvQkFDNUUsTUFBTSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUU5RCxtRUFBbUU7b0JBQ25FLHdFQUF3RTtvQkFDeEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7b0JBRXJGLElBQUksNEJBQTRCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFFO3dCQUMxRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3FCQUNuRDtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFLLENBQUM7SUFDM0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Tmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3ksIGdldE1hdFNjcm9sbFN0cmF0ZWd5QWxyZWFkeUF0dGFjaGVkRXJyb3J9IGZyb20gJy4vc2Nyb2xsLXN0cmF0ZWd5JztcbmltcG9ydCB7T3ZlcmxheVJlZmVyZW5jZX0gZnJvbSAnLi4vb3ZlcmxheS1yZWZlcmVuY2UnO1xuaW1wb3J0IHtTY3JvbGxEaXNwYXRjaGVyLCBWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7aXNFbGVtZW50U2Nyb2xsZWRPdXRzaWRlVmlld30gZnJvbSAnLi4vcG9zaXRpb24vc2Nyb2xsLWNsaXAnO1xuXG4vKipcbiAqIENvbmZpZyBvcHRpb25zIGZvciB0aGUgUmVwb3NpdGlvblNjcm9sbFN0cmF0ZWd5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlcG9zaXRpb25TY3JvbGxTdHJhdGVneUNvbmZpZyB7XG4gIC8qKiBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSB0aGUgc2Nyb2xsIGV2ZW50cy4gKi9cbiAgc2Nyb2xsVGhyb3R0bGU/OiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgdG8gY2xvc2UgdGhlIG92ZXJsYXkgb25jZSB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgYXdheSBjb21wbGV0ZWx5LiAqL1xuICBhdXRvQ2xvc2U/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFN0cmF0ZWd5IHRoYXQgd2lsbCB1cGRhdGUgdGhlIGVsZW1lbnQgcG9zaXRpb24gYXMgdGhlIHVzZXIgaXMgc2Nyb2xsaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUmVwb3NpdGlvblNjcm9sbFN0cmF0ZWd5IGltcGxlbWVudHMgU2Nyb2xsU3RyYXRlZ3kge1xuICBwcml2YXRlIF9zY3JvbGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmZXJlbmNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9jb25maWc/OiBSZXBvc2l0aW9uU2Nyb2xsU3RyYXRlZ3lDb25maWcsXG4gICkge31cblxuICAvKiogQXR0YWNoZXMgdGhpcyBzY3JvbGwgc3RyYXRlZ3kgdG8gYW4gb3ZlcmxheS4gKi9cbiAgYXR0YWNoKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWZlcmVuY2UpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2Nyb2xsU3RyYXRlZ3lBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlSZWYgPSBvdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIEVuYWJsZXMgcmVwb3NpdGlvbmluZyBvZiB0aGUgYXR0YWNoZWQgb3ZlcmxheSBvbiBzY3JvbGwuICovXG4gIGVuYWJsZSgpIHtcbiAgICBpZiAoIXRoaXMuX3Njcm9sbFN1YnNjcmlwdGlvbikge1xuICAgICAgY29uc3QgdGhyb3R0bGUgPSB0aGlzLl9jb25maWcgPyB0aGlzLl9jb25maWcuc2Nyb2xsVGhyb3R0bGUgOiAwO1xuXG4gICAgICB0aGlzLl9zY3JvbGxTdWJzY3JpcHRpb24gPSB0aGlzLl9zY3JvbGxEaXNwYXRjaGVyLnNjcm9sbGVkKHRocm90dGxlKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IG1ha2UgYGNsb3NlYCBvbiBieSBkZWZhdWx0IG9uY2UgYWxsIGNvbXBvbmVudHMgY2FuIGhhbmRsZSBpdC5cbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZyAmJiB0aGlzLl9jb25maWcuYXV0b0Nsb3NlKSB7XG4gICAgICAgICAgY29uc3Qgb3ZlcmxheVJlY3QgPSB0aGlzLl9vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG5cbiAgICAgICAgICAvLyBUT0RPKGNyaXNiZXRvKTogaW5jbHVkZSBhbGwgYW5jZXN0b3Igc2Nyb2xsIGNvbnRhaW5lcnMgaGVyZSBvbmNlXG4gICAgICAgICAgLy8gd2UgaGF2ZSBhIHdheSBvZiBleHBvc2luZyB0aGUgdHJpZ2dlciBlbGVtZW50IHRvIHRoZSBzY3JvbGwgc3RyYXRlZ3kuXG4gICAgICAgICAgY29uc3QgcGFyZW50UmVjdHMgPSBbe3dpZHRoLCBoZWlnaHQsIGJvdHRvbTogaGVpZ2h0LCByaWdodDogd2lkdGgsIHRvcDogMCwgbGVmdDogMH1dO1xuXG4gICAgICAgICAgaWYgKGlzRWxlbWVudFNjcm9sbGVkT3V0c2lkZVZpZXcob3ZlcmxheVJlY3QsIHBhcmVudFJlY3RzKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc2FibGVzIHJlcG9zaXRpb25pbmcgb2YgdGhlIGF0dGFjaGVkIG92ZXJsYXkgb24gc2Nyb2xsLiAqL1xuICBkaXNhYmxlKCkge1xuICAgIGlmICh0aGlzLl9zY3JvbGxTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3Njcm9sbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fc2Nyb2xsU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGwhO1xuICB9XG59XG4iXX0=