/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, InjectionToken, ɵɵinject } from '@angular/core';
import { getDOM } from '../dom_adapter';
import { DOCUMENT } from '../dom_tokens';
import * as i0 from "@angular/core";
/**
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 *
 * `PlatformLocation` encapsulates all calls to DOM APIs, which allows the Router to be
 * platform-agnostic.
 * This means that we can have different implementation of `PlatformLocation` for the different
 * platforms that Angular supports. For example, `@angular/platform-browser` provides an
 * implementation specific to the browser environment, while `@angular/platform-server` provides
 * one suitable for use with server-side rendering.
 *
 * The `PlatformLocation` class is used directly by all implementations of {@link LocationStrategy}
 * when they need to interact with the DOM APIs like pushState, popState, etc.
 *
 * {@link LocationStrategy} in turn is used by the {@link Location} service which is used directly
 * by the {@link Router} in order to navigate between routes. Since all interactions between {@link
 * Router} /
 * {@link Location} / {@link LocationStrategy} and DOM APIs flow through the `PlatformLocation`
 * class, they are all platform-agnostic.
 *
 * @publicApi
 */
export class PlatformLocation {
    historyGo(relativePosition) {
        throw new Error('Not implemented');
    }
}
PlatformLocation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PlatformLocation, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PlatformLocation.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PlatformLocation, providedIn: 'platform', useFactory: useBrowserPlatformLocation });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PlatformLocation, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'platform',
                    // See #23917
                    useFactory: useBrowserPlatformLocation
                }]
        }] });
export function useBrowserPlatformLocation() {
    return ɵɵinject(BrowserPlatformLocation);
}
/**
 * @description
 * Indicates when a location is initialized.
 *
 * @publicApi
 */
export const LOCATION_INITIALIZED = new InjectionToken('Location Initialized');
/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 */
export class BrowserPlatformLocation extends PlatformLocation {
    constructor(_doc) {
        super();
        this._doc = _doc;
        this._init();
    }
    // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
    /** @internal */
    _init() {
        this.location = window.location;
        this._history = window.history;
    }
    getBaseHrefFromDOM() {
        return getDOM().getBaseHref(this._doc);
    }
    onPopState(fn) {
        const window = getDOM().getGlobalEventTarget(this._doc, 'window');
        window.addEventListener('popstate', fn, false);
        return () => window.removeEventListener('popstate', fn);
    }
    onHashChange(fn) {
        const window = getDOM().getGlobalEventTarget(this._doc, 'window');
        window.addEventListener('hashchange', fn, false);
        return () => window.removeEventListener('hashchange', fn);
    }
    get href() {
        return this.location.href;
    }
    get protocol() {
        return this.location.protocol;
    }
    get hostname() {
        return this.location.hostname;
    }
    get port() {
        return this.location.port;
    }
    get pathname() {
        return this.location.pathname;
    }
    get search() {
        return this.location.search;
    }
    get hash() {
        return this.location.hash;
    }
    set pathname(newPath) {
        this.location.pathname = newPath;
    }
    pushState(state, title, url) {
        if (supportsState()) {
            this._history.pushState(state, title, url);
        }
        else {
            this.location.hash = url;
        }
    }
    replaceState(state, title, url) {
        if (supportsState()) {
            this._history.replaceState(state, title, url);
        }
        else {
            this.location.hash = url;
        }
    }
    forward() {
        this._history.forward();
    }
    back() {
        this._history.back();
    }
    historyGo(relativePosition = 0) {
        this._history.go(relativePosition);
    }
    getState() {
        return this._history.state;
    }
}
BrowserPlatformLocation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserPlatformLocation, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
BrowserPlatformLocation.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserPlatformLocation, providedIn: 'platform', useFactory: createBrowserPlatformLocation });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserPlatformLocation, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'platform',
                    // See #23917
                    useFactory: createBrowserPlatformLocation,
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
export function supportsState() {
    return !!window.history.pushState;
}
export function createBrowserPlatformLocation() {
    return new BrowserPlatformLocation(ɵɵinject(DOCUMENT));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2xvY2F0aW9uL3BsYXRmb3JtX2xvY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3RDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXZDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFNSCxNQUFNLE9BQWdCLGdCQUFnQjtJQTRCcEMsU0FBUyxDQUFFLGdCQUF3QjtRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQzs7d0hBOUJtQixnQkFBZ0I7NEhBQWhCLGdCQUFnQixjQUp4QixVQUFVLGNBRVYsMEJBQTBCO3NHQUVsQixnQkFBZ0I7a0JBTHJDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLGFBQWE7b0JBQ2IsVUFBVSxFQUFFLDBCQUEwQjtpQkFDdkM7O0FBa0NELE1BQU0sVUFBVSwwQkFBMEI7SUFDeEMsT0FBTyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGNBQWMsQ0FBZSxzQkFBc0IsQ0FBQyxDQUFDO0FBc0I3Rjs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLHVCQUF3QixTQUFRLGdCQUFnQjtJQUkzRCxZQUFzQyxJQUFTO1FBQzdDLEtBQUssRUFBRSxDQUFDO1FBRDRCLFNBQUksR0FBSixJQUFJLENBQUs7UUFFN0MsSUFBSSxDQUFDLEtB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UUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFUSxTQUFTLENBQUMsbUJBQTJCLENBQUM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRVEsUUFBUTtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDN0IsQ0FBQzs7K0hBdkZVLHVCQUF1QixrQkFJZCxRQUFRO21JQUpqQix1QkFBdUIsY0FKdEIsVUFBVSxjQUVWLDZCQUE2QjtzR0FFOUIsdUJBQXVCO2tCQUxuQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxVQUFVO29CQUN0QixhQUFhO29CQUNiLFVBQVUsRUFBRSw2QkFBNkI7aUJBQzFDOzswQkFLYyxNQUFNOzJCQUFDLFFBQVE7O0FBc0Y5QixNQUFNLFVBQVUsYUFBYTtJQUMzQixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNwQyxDQUFDO0FBQ0QsTUFBTSxVQUFVLDZCQUE2QjtJQUMzQyxPQUFPLElBQUksdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIMm1ybVpbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRET019IGZyb20gJy4uL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJy4uL2RvbV90b2tlbnMnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5IGJ5IGFuIGFwcGxpY2F0aW9uIGRldmVsb3Blci4gSW5zdGVhZCwgdXNlXG4gKiB7QGxpbmsgTG9jYXRpb259LlxuICpcbiAqIGBQbGF0Zm9ybUxvY2F0aW9uYCBlbmNhcHN1bGF0ZXMgYWxsIGNhbGxzIHRvIERPTSBBUElzLCB3aGljaCBhbGxvd3MgdGhlIFJvdXRlciB0byBiZVxuICogcGxhdGZvcm0tYWdub3N0aWMuXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuIGhhdmUgZGlmZmVyZW50IGltcGxlbWVudGF0aW9uIG9mIGBQbGF0Zm9ybUxvY2F0aW9uYCBmb3IgdGhlIGRpZmZlcmVudFxuICogcGxhdGZvcm1zIHRoYXQgQW5ndWxhciBzdXBwb3J0cy4gRm9yIGV4YW1wbGUsIGBAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyYCBwcm92aWRlcyBhblxuICogaW1wbGVtZW50YXRpb24gc3BlY2lmaWMgdG8gdGhlIGJyb3dzZXIgZW52aXJvbm1lbnQsIHdoaWxlIGBAYW5ndWxhci9wbGF0Zm9ybS1zZXJ2ZXJgIHByb3ZpZGVzXG4gKiBvbmUgc3VpdGFibGUgZm9yIHVzZSB3aXRoIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAqXG4gKiBUaGUgYFBsYXRmb3JtTG9jYXRpb25gIGNsYXNzIGlzIHVzZWQgZGlyZWN0bHkgYnkgYWxsIGltcGxlbWVudGF0aW9ucyBvZiB7QGxpbmsgTG9jYXRpb25TdHJhdGVneX1cbiAqIHdoZW4gdGhleSBuZWVkIHRvIGludGVyYWN0IHdpdGggdGhlIERPTSBBUElzIGxpa2UgcHVzaFN0YXRlLCBwb3BTdGF0ZSwgZXRjLlxuICpcbiAqIHtAbGluayBMb2NhdGlvblN0cmF0ZWd5fSBpbiB0dXJuIGlzIHVzZWQgYnkgdGhlIHtAbGluayBMb2NhdGlvbn0gc2VydmljZSB3aGljaCBpcyB1c2VkIGRpcmVjdGx5XG4gKiBieSB0aGUge0BsaW5rIFJvdXRlcn0gaW4gb3JkZXIgdG8gbmF2aWdhdGUgYmV0d2VlbiByb3V0ZXMuIFNpbmNlIGFsbCBpbnRlcmFjdGlvbnMgYmV0d2VlbiB7QGxpbmtcbiAqIFJvdXRlcn0gL1xuICoge0BsaW5rIExvY2F0aW9ufSAvIHtAbGluayBMb2NhdGlvblN0cmF0ZWd5fSBhbmQgRE9NIEFQSXMgZmxvdyB0aHJvdWdoIHRoZSBgUGxhdGZvcm1Mb2NhdGlvbmBcbiAqIGNsYXNzLCB0aGV5IGFyZSBhbGwgcGxhdGZvcm0tYWdub3N0aWMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdwbGF0Zm9ybScsXG4gIC8vIFNlZSAjMjM5MTdcbiAgdXNlRmFjdG9yeTogdXNlQnJvd3NlclBsYXRmb3JtTG9jYXRpb25cbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGxhdGZvcm1Mb2NhdGlvbiB7XG4gIGFic3RyYWN0IGdldEJhc2VIcmVmRnJvbURPTSgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldFN0YXRlKCk6IHVua25vd247XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBleGVjdXRlZCwgcmVtb3ZlcyB0aGUgYHBvcHN0YXRlYCBldmVudCBoYW5kbGVyLlxuICAgKi9cbiAgYWJzdHJhY3Qgb25Qb3BTdGF0ZShmbjogTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcik6IFZvaWRGdW5jdGlvbjtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGV4ZWN1dGVkLCByZW1vdmVzIHRoZSBgaGFzaGNoYW5nZWAgZXZlbnQgaGFuZGxlci5cbiAgICovXG4gIGFic3RyYWN0IG9uSGFzaENoYW5nZShmbjogTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcik6IFZvaWRGdW5jdGlvbjtcblxuICBhYnN0cmFjdCBnZXQgaHJlZigpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBwcm90b2NvbCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBob3N0bmFtZSgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBwb3J0KCk6IHN0cmluZztcbiAgYWJzdHJhY3QgZ2V0IHBhdGhuYW1lKCk6IHN0cmluZztcbiAgYWJzdHJhY3QgZ2V0IHNlYXJjaCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBoYXNoKCk6IHN0cmluZztcblxuICBhYnN0cmFjdCByZXBsYWNlU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgdXJsOiBzdHJpbmcpOiB2b2lkO1xuXG4gIGFic3RyYWN0IHB1c2hTdGF0ZShzdGF0ZTogYW55LCB0aXRsZTogc3RyaW5nLCB1cmw6IHN0cmluZyk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgZm9yd2FyZCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcblxuICBoaXN0b3J5R28/KHJlbGF0aXZlUG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uKCkge1xuICByZXR1cm4gybXJtWluamVjdChCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbik7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBJbmRpY2F0ZXMgd2hlbiBhIGxvY2F0aW9uIGlzIGluaXRpYWxpemVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IExPQ0FUSU9OX0lOSVRJQUxJWkVEID0gbmV3IEluamVjdGlvblRva2VuPFByb21pc2U8YW55Pj4oJ0xvY2F0aW9uIEluaXRpYWxpemVkJyk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIHNlcmlhbGl6YWJsZSB2ZXJzaW9uIG9mIHRoZSBldmVudCBmcm9tIGBvblBvcFN0YXRlYCBvciBgb25IYXNoQ2hhbmdlYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhdGlvbkNoYW5nZUV2ZW50IHtcbiAgdHlwZTogc3RyaW5nO1xuICBzdGF0ZTogYW55O1xufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhdGlvbkNoYW5nZUxpc3RlbmVyIHtcbiAgKGV2ZW50OiBMb2NhdGlvbkNoYW5nZUV2ZW50KTogYW55O1xufVxuXG5cblxuLyoqXG4gKiBgUGxhdGZvcm1Mb2NhdGlvbmAgZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgZGlyZWN0IGNhbGxzIHRvIHBsYXRmb3JtIEFQSXMuXG4gKiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgdXNlZCBkaXJlY3RseSBieSBhbiBhcHBsaWNhdGlvbiBkZXZlbG9wZXIuIEluc3RlYWQsIHVzZVxuICoge0BsaW5rIExvY2F0aW9ufS5cbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncGxhdGZvcm0nLFxuICAvLyBTZWUgIzIzOTE3XG4gIHVzZUZhY3Rvcnk6IGNyZWF0ZUJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uLFxufSlcbmV4cG9ydCBjbGFzcyBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbiBleHRlbmRzIFBsYXRmb3JtTG9jYXRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgbG9jYXRpb24hOiBMb2NhdGlvbjtcbiAgcHJpdmF0ZSBfaGlzdG9yeSE6IEhpc3Rvcnk7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jOiBhbnkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgbW92ZWQgdG8gaXRzIG93biBtZXRob2Qgc28gdGhhdCBgTW9ja1BsYXRmb3JtTG9jYXRpb25TdHJhdGVneWAgY2FuIG92ZXJ3cml0ZSBpdFxuICAvKiogQGludGVybmFsICovXG4gIF9pbml0KCkge1xuICAgICh0aGlzIGFzIHtsb2NhdGlvbjogTG9jYXRpb259KS5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB0aGlzLl9oaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG4gIH1cblxuICBvdmVycmlkZSBnZXRCYXNlSHJlZkZyb21ET00oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0RE9NKCkuZ2V0QmFzZUhyZWYodGhpcy5fZG9jKSE7XG4gIH1cblxuICBvdmVycmlkZSBvblBvcFN0YXRlKGZuOiBMb2NhdGlvbkNoYW5nZUxpc3RlbmVyKTogVm9pZEZ1bmN0aW9uIHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRET00oKS5nZXRHbG9iYWxFdmVudFRhcmdldCh0aGlzLl9kb2MsICd3aW5kb3cnKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmbiwgZmFsc2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmbik7XG4gIH1cblxuICBvdmVycmlkZSBvbkhhc2hDaGFuZ2UoZm46IExvY2F0aW9uQ2hhbmdlTGlzdGVuZXIpOiBWb2lkRnVuY3Rpb24ge1xuICAgIGNvbnN0IHdpbmRvdyA9IGdldERPTSgpLmdldEdsb2JhbEV2ZW50VGFyZ2V0KHRoaXMuX2RvYywgJ3dpbmRvdycpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgZm4sIGZhbHNlKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBmbik7XG4gIH1cblxuICBvdmVycmlkZSBnZXQgaHJlZigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxvY2F0aW9uLmhyZWY7XG4gIH1cbiAgb3ZlcnJpZGUgZ2V0IHByb3RvY29sKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRpb24ucHJvdG9jb2w7XG4gIH1cbiAgb3ZlcnJpZGUgZ2V0IGhvc3RuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cbiAgb3ZlcnJpZGUgZ2V0IHBvcnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdGlvbi5wb3J0O1xuICB9XG4gIG92ZXJyaWRlIGdldCBwYXRobmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxvY2F0aW9uLnBhdGhuYW1lO1xuICB9XG4gIG92ZXJyaWRlIGdldCBzZWFyY2goKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdGlvbi5zZWFyY2g7XG4gIH1cbiAgb3ZlcnJpZGUgZ2V0IGhhc2goKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdGlvbi5oYXNoO1xuICB9XG4gIG92ZXJyaWRlIHNldCBwYXRobmFtZShuZXdQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxvY2F0aW9uLnBhdGhuYW1lID0gbmV3UGF0aDtcbiAgfVxuXG4gIG92ZXJyaWRlIHB1c2hTdGF0ZShzdGF0ZTogYW55LCB0aXRsZTogc3RyaW5nLCB1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChzdXBwb3J0c1N0YXRlKCkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2NhdGlvbi5oYXNoID0gdXJsO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIHJlcGxhY2VTdGF0ZShzdGF0ZTogYW55LCB0aXRsZTogc3RyaW5nLCB1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChzdXBwb3J0c1N0YXRlKCkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2NhdGlvbi5oYXNoID0gdXJsO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIGZvcndhcmQoKTogdm9pZCB7XG4gICAgdGhpcy5faGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBvdmVycmlkZSBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX2hpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaGlzdG9yeUdvKHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiB2b2lkIHtcbiAgICB0aGlzLl9oaXN0b3J5LmdvKHJlbGF0aXZlUG9zaXRpb24pO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0U3RhdGUoKTogdW5rbm93biB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3Rvcnkuc3RhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRzU3RhdGUoKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbijJtcm1aW5qZWN0KERPQ1VNRU5UKSk7XG59XG4iXX0=