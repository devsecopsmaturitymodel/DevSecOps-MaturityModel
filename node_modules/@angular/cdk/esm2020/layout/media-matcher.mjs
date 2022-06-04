/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Global registry for all dynamically-created, injected media queries. */
const mediaQueriesForWebkitCompatibility = new Set();
/** Style tag that holds all of the dynamically-created media queries. */
let mediaQueryStyleNode;
/** A utility for calling matchMedia queries. */
export class MediaMatcher {
    constructor(_platform) {
        this._platform = _platform;
        this._matchMedia =
            this._platform.isBrowser && window.matchMedia
                ? // matchMedia is bound to the window scope intentionally as it is an illegal invocation to
                    // call it from a different scope.
                    window.matchMedia.bind(window)
                : noopMatchMedia;
    }
    /**
     * Evaluates the given media query and returns the native MediaQueryList from which results
     * can be retrieved.
     * Confirms the layout engine will trigger for the selector query provided and returns the
     * MediaQueryList for the query provided.
     */
    matchMedia(query) {
        if (this._platform.WEBKIT || this._platform.BLINK) {
            createEmptyStyleRule(query);
        }
        return this._matchMedia(query);
    }
}
MediaMatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MediaMatcher, deps: [{ token: i1.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
MediaMatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MediaMatcher, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MediaMatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }]; } });
/**
 * Creates an empty stylesheet that is used to work around browser inconsistencies related to
 * `matchMedia`. At the time of writing, it handles the following cases:
 * 1. On WebKit browsers, a media query has to have at least one rule in order for `matchMedia`
 * to fire. We work around it by declaring a dummy stylesheet with a `@media` declaration.
 * 2. In some cases Blink browsers will stop firing the `matchMedia` listener if none of the rules
 * inside the `@media` match existing elements on the page. We work around it by having one rule
 * targeting the `body`. See https://github.com/angular/components/issues/23546.
 */
function createEmptyStyleRule(query) {
    if (mediaQueriesForWebkitCompatibility.has(query)) {
        return;
    }
    try {
        if (!mediaQueryStyleNode) {
            mediaQueryStyleNode = document.createElement('style');
            mediaQueryStyleNode.setAttribute('type', 'text/css');
            document.head.appendChild(mediaQueryStyleNode);
        }
        if (mediaQueryStyleNode.sheet) {
            mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
            mediaQueriesForWebkitCompatibility.add(query);
        }
    }
    catch (e) {
        console.error(e);
    }
}
/** No-op matchMedia replacement for non-browser platforms. */
function noopMatchMedia(query) {
    // Use `as any` here to avoid adding additional necessary properties for
    // the noop matcher.
    return {
        matches: query === 'all' || query === '',
        media: query,
        addListener: () => { },
        removeListener: () => { },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvbGF5b3V0L21lZGlhLW1hdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUUvQywyRUFBMkU7QUFDM0UsTUFBTSxrQ0FBa0MsR0FBZ0IsSUFBSSxHQUFHLEVBQVUsQ0FBQztBQUUxRSx5RUFBeUU7QUFDekUsSUFBSSxtQkFBaUQsQ0FBQztBQUV0RCxnREFBZ0Q7QUFFaEQsTUFBTSxPQUFPLFlBQVk7SUFJdkIsWUFBb0IsU0FBbUI7UUFBbkIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNyQyxJQUFJLENBQUMsV0FBVztZQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxVQUFVO2dCQUMzQyxDQUFDLENBQUMsMEZBQTBGO29CQUMxRixrQ0FBa0M7b0JBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxVQUFVLENBQUMsS0FBYTtRQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ2pELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7O3lHQXhCVSxZQUFZOzZHQUFaLFlBQVksY0FEQSxNQUFNOzJGQUNsQixZQUFZO2tCQUR4QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUE0QmhDOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxvQkFBb0IsQ0FBQyxLQUFhO0lBQ3pDLElBQUksa0NBQWtDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2pELE9BQU87S0FDUjtJQUVELElBQUk7UUFDRixJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDeEIsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RCxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELFFBQVEsQ0FBQyxJQUFLLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDakQ7UUFFRCxJQUFJLG1CQUFtQixDQUFDLEtBQUssRUFBRTtZQUM3QixtQkFBbUIsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsS0FBSyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckUsa0NBQWtDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQsOERBQThEO0FBQzlELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDbkMsd0VBQXdFO0lBQ3hFLG9CQUFvQjtJQUNwQixPQUFPO1FBQ0wsT0FBTyxFQUFFLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDeEMsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztRQUNyQixjQUFjLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztLQUNsQixDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5cbi8qKiBHbG9iYWwgcmVnaXN0cnkgZm9yIGFsbCBkeW5hbWljYWxseS1jcmVhdGVkLCBpbmplY3RlZCBtZWRpYSBxdWVyaWVzLiAqL1xuY29uc3QgbWVkaWFRdWVyaWVzRm9yV2Via2l0Q29tcGF0aWJpbGl0eTogU2V0PHN0cmluZz4gPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuLyoqIFN0eWxlIHRhZyB0aGF0IGhvbGRzIGFsbCBvZiB0aGUgZHluYW1pY2FsbHktY3JlYXRlZCBtZWRpYSBxdWVyaWVzLiAqL1xubGV0IG1lZGlhUXVlcnlTdHlsZU5vZGU6IEhUTUxTdHlsZUVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbi8qKiBBIHV0aWxpdHkgZm9yIGNhbGxpbmcgbWF0Y2hNZWRpYSBxdWVyaWVzLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWVkaWFNYXRjaGVyIHtcbiAgLyoqIFRoZSBpbnRlcm5hbCBtYXRjaE1lZGlhIG1ldGhvZCB0byByZXR1cm4gYmFjayBhIE1lZGlhUXVlcnlMaXN0IGxpa2Ugb2JqZWN0LiAqL1xuICBwcml2YXRlIF9tYXRjaE1lZGlhOiAocXVlcnk6IHN0cmluZykgPT4gTWVkaWFRdWVyeUxpc3Q7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gICAgdGhpcy5fbWF0Y2hNZWRpYSA9XG4gICAgICB0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIgJiYgd2luZG93Lm1hdGNoTWVkaWFcbiAgICAgICAgPyAvLyBtYXRjaE1lZGlhIGlzIGJvdW5kIHRvIHRoZSB3aW5kb3cgc2NvcGUgaW50ZW50aW9uYWxseSBhcyBpdCBpcyBhbiBpbGxlZ2FsIGludm9jYXRpb24gdG9cbiAgICAgICAgICAvLyBjYWxsIGl0IGZyb20gYSBkaWZmZXJlbnQgc2NvcGUuXG4gICAgICAgICAgd2luZG93Lm1hdGNoTWVkaWEuYmluZCh3aW5kb3cpXG4gICAgICAgIDogbm9vcE1hdGNoTWVkaWE7XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGVzIHRoZSBnaXZlbiBtZWRpYSBxdWVyeSBhbmQgcmV0dXJucyB0aGUgbmF0aXZlIE1lZGlhUXVlcnlMaXN0IGZyb20gd2hpY2ggcmVzdWx0c1xuICAgKiBjYW4gYmUgcmV0cmlldmVkLlxuICAgKiBDb25maXJtcyB0aGUgbGF5b3V0IGVuZ2luZSB3aWxsIHRyaWdnZXIgZm9yIHRoZSBzZWxlY3RvciBxdWVyeSBwcm92aWRlZCBhbmQgcmV0dXJucyB0aGVcbiAgICogTWVkaWFRdWVyeUxpc3QgZm9yIHRoZSBxdWVyeSBwcm92aWRlZC5cbiAgICovXG4gIG1hdGNoTWVkaWEocXVlcnk6IHN0cmluZyk6IE1lZGlhUXVlcnlMaXN0IHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uV0VCS0lUIHx8IHRoaXMuX3BsYXRmb3JtLkJMSU5LKSB7XG4gICAgICBjcmVhdGVFbXB0eVN0eWxlUnVsZShxdWVyeSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tYXRjaE1lZGlhKHF1ZXJ5KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gZW1wdHkgc3R5bGVzaGVldCB0aGF0IGlzIHVzZWQgdG8gd29yayBhcm91bmQgYnJvd3NlciBpbmNvbnNpc3RlbmNpZXMgcmVsYXRlZCB0b1xuICogYG1hdGNoTWVkaWFgLiBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCBpdCBoYW5kbGVzIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG4gKiAxLiBPbiBXZWJLaXQgYnJvd3NlcnMsIGEgbWVkaWEgcXVlcnkgaGFzIHRvIGhhdmUgYXQgbGVhc3Qgb25lIHJ1bGUgaW4gb3JkZXIgZm9yIGBtYXRjaE1lZGlhYFxuICogdG8gZmlyZS4gV2Ugd29yayBhcm91bmQgaXQgYnkgZGVjbGFyaW5nIGEgZHVtbXkgc3R5bGVzaGVldCB3aXRoIGEgYEBtZWRpYWAgZGVjbGFyYXRpb24uXG4gKiAyLiBJbiBzb21lIGNhc2VzIEJsaW5rIGJyb3dzZXJzIHdpbGwgc3RvcCBmaXJpbmcgdGhlIGBtYXRjaE1lZGlhYCBsaXN0ZW5lciBpZiBub25lIG9mIHRoZSBydWxlc1xuICogaW5zaWRlIHRoZSBgQG1lZGlhYCBtYXRjaCBleGlzdGluZyBlbGVtZW50cyBvbiB0aGUgcGFnZS4gV2Ugd29yayBhcm91bmQgaXQgYnkgaGF2aW5nIG9uZSBydWxlXG4gKiB0YXJnZXRpbmcgdGhlIGBib2R5YC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIzNTQ2LlxuICovXG5mdW5jdGlvbiBjcmVhdGVFbXB0eVN0eWxlUnVsZShxdWVyeTogc3RyaW5nKSB7XG4gIGlmIChtZWRpYVF1ZXJpZXNGb3JXZWJraXRDb21wYXRpYmlsaXR5LmhhcyhxdWVyeSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGlmICghbWVkaWFRdWVyeVN0eWxlTm9kZSkge1xuICAgICAgbWVkaWFRdWVyeVN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBtZWRpYVF1ZXJ5U3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgZG9jdW1lbnQuaGVhZCEuYXBwZW5kQ2hpbGQobWVkaWFRdWVyeVN0eWxlTm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKG1lZGlhUXVlcnlTdHlsZU5vZGUuc2hlZXQpIHtcbiAgICAgIG1lZGlhUXVlcnlTdHlsZU5vZGUuc2hlZXQuaW5zZXJ0UnVsZShgQG1lZGlhICR7cXVlcnl9IHtib2R5eyB9fWAsIDApO1xuICAgICAgbWVkaWFRdWVyaWVzRm9yV2Via2l0Q29tcGF0aWJpbGl0eS5hZGQocXVlcnkpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gIH1cbn1cblxuLyoqIE5vLW9wIG1hdGNoTWVkaWEgcmVwbGFjZW1lbnQgZm9yIG5vbi1icm93c2VyIHBsYXRmb3Jtcy4gKi9cbmZ1bmN0aW9uIG5vb3BNYXRjaE1lZGlhKHF1ZXJ5OiBzdHJpbmcpOiBNZWRpYVF1ZXJ5TGlzdCB7XG4gIC8vIFVzZSBgYXMgYW55YCBoZXJlIHRvIGF2b2lkIGFkZGluZyBhZGRpdGlvbmFsIG5lY2Vzc2FyeSBwcm9wZXJ0aWVzIGZvclxuICAvLyB0aGUgbm9vcCBtYXRjaGVyLlxuICByZXR1cm4ge1xuICAgIG1hdGNoZXM6IHF1ZXJ5ID09PSAnYWxsJyB8fCBxdWVyeSA9PT0gJycsXG4gICAgbWVkaWE6IHF1ZXJ5LFxuICAgIGFkZExpc3RlbmVyOiAoKSA9PiB7fSxcbiAgICByZW1vdmVMaXN0ZW5lcjogKCkgPT4ge30sXG4gIH0gYXMgYW55O1xufVxuIl19