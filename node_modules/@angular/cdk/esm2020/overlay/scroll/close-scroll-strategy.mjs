import { getMatScrollStrategyAlreadyAttachedError } from './scroll-strategy';
/**
 * Strategy that will close the overlay as soon as the user starts scrolling.
 */
export class CloseScrollStrategy {
    constructor(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._ngZone = _ngZone;
        this._viewportRuler = _viewportRuler;
        this._config = _config;
        this._scrollSubscription = null;
        /** Detaches the overlay ref and disables the scroll strategy. */
        this._detach = () => {
            this.disable();
            if (this._overlayRef.hasAttached()) {
                this._ngZone.run(() => this._overlayRef.detach());
            }
        };
    }
    /** Attaches this scroll strategy to an overlay. */
    attach(overlayRef) {
        if (this._overlayRef && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    }
    /** Enables the closing of the attached overlay on scroll. */
    enable() {
        if (this._scrollSubscription) {
            return;
        }
        const stream = this._scrollDispatcher.scrolled(0);
        if (this._config && this._config.threshold && this._config.threshold > 1) {
            this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
            this._scrollSubscription = stream.subscribe(() => {
                const scrollPosition = this._viewportRuler.getViewportScrollPosition().top;
                if (Math.abs(scrollPosition - this._initialScrollPosition) > this._config.threshold) {
                    this._detach();
                }
                else {
                    this._overlayRef.updatePosition();
                }
            });
        }
        else {
            this._scrollSubscription = stream.subscribe(this._detach);
        }
    }
    /** Disables the closing the attached overlay on scroll. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvc2Utc2Nyb2xsLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Njcm9sbC9jbG9zZS1zY3JvbGwtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFpQix3Q0FBd0MsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBYTNGOztHQUVHO0FBQ0gsTUFBTSxPQUFPLG1CQUFtQjtJQUs5QixZQUNVLGlCQUFtQyxFQUNuQyxPQUFlLEVBQ2YsY0FBNkIsRUFDN0IsT0FBbUM7UUFIbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFSckMsd0JBQW1CLEdBQXdCLElBQUksQ0FBQztRQTBEeEQsaUVBQWlFO1FBQ3pELFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWYsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDbkQ7UUFDSCxDQUFDLENBQUM7SUF4REMsQ0FBQztJQUVKLG1EQUFtRDtJQUNuRCxNQUFNLENBQUMsVUFBNEI7UUFDakMsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZFLE1BQU0sd0NBQXdDLEVBQUUsQ0FBQztTQUNsRDtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEQsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtZQUN4RSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUVsRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9DLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBRTNFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQVEsQ0FBQyxTQUFVLEVBQUU7b0JBQ3JGLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDaEI7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztpQkFDbkM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRUQsMkRBQTJEO0lBQzNELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFLLENBQUM7SUFDM0IsQ0FBQztDQVVGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge05nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1Njcm9sbFN0cmF0ZWd5LCBnZXRNYXRTY3JvbGxTdHJhdGVneUFscmVhZHlBdHRhY2hlZEVycm9yfSBmcm9tICcuL3Njcm9sbC1zdHJhdGVneSc7XG5pbXBvcnQge092ZXJsYXlSZWZlcmVuY2V9IGZyb20gJy4uL292ZXJsYXktcmVmZXJlbmNlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7U2Nyb2xsRGlzcGF0Y2hlciwgVmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5cbi8qKlxuICogQ29uZmlnIG9wdGlvbnMgZm9yIHRoZSBDbG9zZVNjcm9sbFN0cmF0ZWd5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3NlU2Nyb2xsU3RyYXRlZ3lDb25maWcge1xuICAvKiogQW1vdW50IG9mIHBpeGVscyB0aGUgdXNlciBoYXMgdG8gc2Nyb2xsIGJlZm9yZSB0aGUgb3ZlcmxheSBpcyBjbG9zZWQuICovXG4gIHRocmVzaG9sZD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTdHJhdGVneSB0aGF0IHdpbGwgY2xvc2UgdGhlIG92ZXJsYXkgYXMgc29vbiBhcyB0aGUgdXNlciBzdGFydHMgc2Nyb2xsaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ2xvc2VTY3JvbGxTdHJhdGVneSBpbXBsZW1lbnRzIFNjcm9sbFN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZmVyZW5jZTtcbiAgcHJpdmF0ZSBfaW5pdGlhbFNjcm9sbFBvc2l0aW9uOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIHByaXZhdGUgX2NvbmZpZz86IENsb3NlU2Nyb2xsU3RyYXRlZ3lDb25maWcsXG4gICkge31cblxuICAvKiogQXR0YWNoZXMgdGhpcyBzY3JvbGwgc3RyYXRlZ3kgdG8gYW4gb3ZlcmxheS4gKi9cbiAgYXR0YWNoKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWZlcmVuY2UpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2Nyb2xsU3RyYXRlZ3lBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlSZWYgPSBvdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqIEVuYWJsZXMgdGhlIGNsb3Npbmcgb2YgdGhlIGF0dGFjaGVkIG92ZXJsYXkgb24gc2Nyb2xsLiAqL1xuICBlbmFibGUoKSB7XG4gICAgaWYgKHRoaXMuX3Njcm9sbFN1YnNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX3Njcm9sbERpc3BhdGNoZXIuc2Nyb2xsZWQoMCk7XG5cbiAgICBpZiAodGhpcy5fY29uZmlnICYmIHRoaXMuX2NvbmZpZy50aHJlc2hvbGQgJiYgdGhpcy5fY29uZmlnLnRocmVzaG9sZCA+IDEpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxTY3JvbGxQb3NpdGlvbiA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTY3JvbGxQb3NpdGlvbigpLnRvcDtcblxuICAgICAgdGhpcy5fc2Nyb2xsU3Vic2NyaXB0aW9uID0gc3RyZWFtLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjcm9sbFBvc2l0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCkudG9wO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhzY3JvbGxQb3NpdGlvbiAtIHRoaXMuX2luaXRpYWxTY3JvbGxQb3NpdGlvbikgPiB0aGlzLl9jb25maWchLnRocmVzaG9sZCEpIHtcbiAgICAgICAgICB0aGlzLl9kZXRhY2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zY3JvbGxTdWJzY3JpcHRpb24gPSBzdHJlYW0uc3Vic2NyaWJlKHRoaXMuX2RldGFjaCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc2FibGVzIHRoZSBjbG9zaW5nIHRoZSBhdHRhY2hlZCBvdmVybGF5IG9uIHNjcm9sbC4gKi9cbiAgZGlzYWJsZSgpIHtcbiAgICBpZiAodGhpcy5fc2Nyb2xsU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9zY3JvbGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX3Njcm9sbFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsITtcbiAgfVxuXG4gIC8qKiBEZXRhY2hlcyB0aGUgb3ZlcmxheSByZWYgYW5kIGRpc2FibGVzIHRoZSBzY3JvbGwgc3RyYXRlZ3kuICovXG4gIHByaXZhdGUgX2RldGFjaCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2FibGUoKTtcblxuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKSk7XG4gICAgfVxuICB9O1xufVxuIl19