/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Cached result of the way the browser handles the horizontal scroll axis in RTL mode. */
let rtlScrollAxisType;
/** Cached result of the check that indicates whether the browser supports scroll behaviors. */
let scrollBehaviorSupported;
/** Check whether the browser supports scroll behaviors. */
export function supportsScrollBehavior() {
    if (scrollBehaviorSupported == null) {
        // If we're not in the browser, it can't be supported. Also check for `Element`, because
        // some projects stub out the global `document` during SSR which can throw us off.
        if (typeof document !== 'object' || !document || typeof Element !== 'function' || !Element) {
            scrollBehaviorSupported = false;
            return scrollBehaviorSupported;
        }
        // If the element can have a `scrollBehavior` style, we can be sure that it's supported.
        if ('scrollBehavior' in document.documentElement.style) {
            scrollBehaviorSupported = true;
        }
        else {
            // At this point we have 3 possibilities: `scrollTo` isn't supported at all, it's
            // supported but it doesn't handle scroll behavior, or it has been polyfilled.
            const scrollToFunction = Element.prototype.scrollTo;
            if (scrollToFunction) {
                // We can detect if the function has been polyfilled by calling `toString` on it. Native
                // functions are obfuscated using `[native code]`, whereas if it was overwritten we'd get
                // the actual function source. Via https://davidwalsh.name/detect-native-function. Consider
                // polyfilled functions as supporting scroll behavior.
                scrollBehaviorSupported = !/\{\s*\[native code\]\s*\}/.test(scrollToFunction.toString());
            }
            else {
                scrollBehaviorSupported = false;
            }
        }
    }
    return scrollBehaviorSupported;
}
/**
 * Checks the type of RTL scroll axis used by this browser. As of time of writing, Chrome is NORMAL,
 * Firefox & Safari are NEGATED, and IE & Edge are INVERTED.
 */
export function getRtlScrollAxisType() {
    // We can't check unless we're on the browser. Just assume 'normal' if we're not.
    if (typeof document !== 'object' || !document) {
        return 0 /* NORMAL */;
    }
    if (rtlScrollAxisType == null) {
        // Create a 1px wide scrolling container and a 2px wide content element.
        const scrollContainer = document.createElement('div');
        const containerStyle = scrollContainer.style;
        scrollContainer.dir = 'rtl';
        containerStyle.width = '1px';
        containerStyle.overflow = 'auto';
        containerStyle.visibility = 'hidden';
        containerStyle.pointerEvents = 'none';
        containerStyle.position = 'absolute';
        const content = document.createElement('div');
        const contentStyle = content.style;
        contentStyle.width = '2px';
        contentStyle.height = '1px';
        scrollContainer.appendChild(content);
        document.body.appendChild(scrollContainer);
        rtlScrollAxisType = 0 /* NORMAL */;
        // The viewport starts scrolled all the way to the right in RTL mode. If we are in a NORMAL
        // browser this would mean that the scrollLeft should be 1. If it's zero instead we know we're
        // dealing with one of the other two types of browsers.
        if (scrollContainer.scrollLeft === 0) {
            // In a NEGATED browser the scrollLeft is always somewhere in [-maxScrollAmount, 0]. For an
            // INVERTED browser it is always somewhere in [0, maxScrollAmount]. We can determine which by
            // setting to the scrollLeft to 1. This is past the max for a NEGATED browser, so it will
            // return 0 when we read it again.
            scrollContainer.scrollLeft = 1;
            rtlScrollAxisType =
                scrollContainer.scrollLeft === 0 ? 1 /* NEGATED */ : 2 /* INVERTED */;
        }
        scrollContainer.remove();
    }
    return rtlScrollAxisType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9wbGF0Zm9ybS9mZWF0dXJlcy9zY3JvbGxpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBcUJILDJGQUEyRjtBQUMzRixJQUFJLGlCQUFnRCxDQUFDO0FBRXJELCtGQUErRjtBQUMvRixJQUFJLHVCQUE0QyxDQUFDO0FBRWpELDJEQUEyRDtBQUMzRCxNQUFNLFVBQVUsc0JBQXNCO0lBQ3BDLElBQUksdUJBQXVCLElBQUksSUFBSSxFQUFFO1FBQ25DLHdGQUF3RjtRQUN4RixrRkFBa0Y7UUFDbEYsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzFGLHVCQUF1QixHQUFHLEtBQUssQ0FBQztZQUNoQyxPQUFPLHVCQUF1QixDQUFDO1NBQ2hDO1FBRUQsd0ZBQXdGO1FBQ3hGLElBQUksZ0JBQWdCLElBQUksUUFBUSxDQUFDLGVBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ3ZELHVCQUF1QixHQUFHLElBQUksQ0FBQztTQUNoQzthQUFNO1lBQ0wsaUZBQWlGO1lBQ2pGLDhFQUE4RTtZQUM5RSxNQUFNLGdCQUFnQixHQUF5QixPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUUxRSxJQUFJLGdCQUFnQixFQUFFO2dCQUNwQix3RkFBd0Y7Z0JBQ3hGLHlGQUF5RjtnQkFDekYsMkZBQTJGO2dCQUMzRixzREFBc0Q7Z0JBQ3RELHVCQUF1QixHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDMUY7aUJBQU07Z0JBQ0wsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2FBQ2pDO1NBQ0Y7S0FDRjtJQUVELE9BQU8sdUJBQXVCLENBQUM7QUFDakMsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxvQkFBb0I7SUFDbEMsaUZBQWlGO0lBQ2pGLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzdDLHNCQUFnQztLQUNqQztJQUVELElBQUksaUJBQWlCLElBQUksSUFBSSxFQUFFO1FBQzdCLHdFQUF3RTtRQUN4RSxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELE1BQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDN0MsZUFBZSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDNUIsY0FBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDN0IsY0FBYyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDakMsY0FBYyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDckMsY0FBYyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDdEMsY0FBYyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ25DLFlBQVksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzNCLFlBQVksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRTVCLGVBQWUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFM0MsaUJBQWlCLGlCQUEyQixDQUFDO1FBRTdDLDJGQUEyRjtRQUMzRiw4RkFBOEY7UUFDOUYsdURBQXVEO1FBQ3ZELElBQUksZUFBZSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDcEMsMkZBQTJGO1lBQzNGLDZGQUE2RjtZQUM3Rix5RkFBeUY7WUFDekYsa0NBQWtDO1lBQ2xDLGVBQWUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLGlCQUFpQjtnQkFDZixlQUFlLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUEyQixDQUFDLGlCQUEyQixDQUFDO1NBQzdGO1FBRUQsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzFCO0lBQ0QsT0FBTyxpQkFBaUIsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBUaGUgcG9zc2libGUgd2F5cyB0aGUgYnJvd3NlciBtYXkgaGFuZGxlIHRoZSBob3Jpem9udGFsIHNjcm9sbCBheGlzIGluIFJUTCBsYW5ndWFnZXMuICovXG5leHBvcnQgY29uc3QgZW51bSBSdGxTY3JvbGxBeGlzVHlwZSB7XG4gIC8qKlxuICAgKiBzY3JvbGxMZWZ0IGlzIDAgd2hlbiBzY3JvbGxlZCBhbGwgdGhlIHdheSBsZWZ0IGFuZCAoc2Nyb2xsV2lkdGggLSBjbGllbnRXaWR0aCkgd2hlbiBzY3JvbGxlZFxuICAgKiBhbGwgdGhlIHdheSByaWdodC5cbiAgICovXG4gIE5PUk1BTCxcbiAgLyoqXG4gICAqIHNjcm9sbExlZnQgaXMgLShzY3JvbGxXaWR0aCAtIGNsaWVudFdpZHRoKSB3aGVuIHNjcm9sbGVkIGFsbCB0aGUgd2F5IGxlZnQgYW5kIDAgd2hlbiBzY3JvbGxlZFxuICAgKiBhbGwgdGhlIHdheSByaWdodC5cbiAgICovXG4gIE5FR0FURUQsXG4gIC8qKlxuICAgKiBzY3JvbGxMZWZ0IGlzIChzY3JvbGxXaWR0aCAtIGNsaWVudFdpZHRoKSB3aGVuIHNjcm9sbGVkIGFsbCB0aGUgd2F5IGxlZnQgYW5kIDAgd2hlbiBzY3JvbGxlZFxuICAgKiBhbGwgdGhlIHdheSByaWdodC5cbiAgICovXG4gIElOVkVSVEVELFxufVxuXG4vKiogQ2FjaGVkIHJlc3VsdCBvZiB0aGUgd2F5IHRoZSBicm93c2VyIGhhbmRsZXMgdGhlIGhvcml6b250YWwgc2Nyb2xsIGF4aXMgaW4gUlRMIG1vZGUuICovXG5sZXQgcnRsU2Nyb2xsQXhpc1R5cGU6IFJ0bFNjcm9sbEF4aXNUeXBlIHwgdW5kZWZpbmVkO1xuXG4vKiogQ2FjaGVkIHJlc3VsdCBvZiB0aGUgY2hlY2sgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyBzY3JvbGwgYmVoYXZpb3JzLiAqL1xubGV0IHNjcm9sbEJlaGF2aW9yU3VwcG9ydGVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4vKiogQ2hlY2sgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyBzY3JvbGwgYmVoYXZpb3JzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRzU2Nyb2xsQmVoYXZpb3IoKTogYm9vbGVhbiB7XG4gIGlmIChzY3JvbGxCZWhhdmlvclN1cHBvcnRlZCA9PSBudWxsKSB7XG4gICAgLy8gSWYgd2UncmUgbm90IGluIHRoZSBicm93c2VyLCBpdCBjYW4ndCBiZSBzdXBwb3J0ZWQuIEFsc28gY2hlY2sgZm9yIGBFbGVtZW50YCwgYmVjYXVzZVxuICAgIC8vIHNvbWUgcHJvamVjdHMgc3R1YiBvdXQgdGhlIGdsb2JhbCBgZG9jdW1lbnRgIGR1cmluZyBTU1Igd2hpY2ggY2FuIHRocm93IHVzIG9mZi5cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAnb2JqZWN0JyB8fCAhZG9jdW1lbnQgfHwgdHlwZW9mIEVsZW1lbnQgIT09ICdmdW5jdGlvbicgfHwgIUVsZW1lbnQpIHtcbiAgICAgIHNjcm9sbEJlaGF2aW9yU3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gc2Nyb2xsQmVoYXZpb3JTdXBwb3J0ZWQ7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgY2FuIGhhdmUgYSBgc2Nyb2xsQmVoYXZpb3JgIHN0eWxlLCB3ZSBjYW4gYmUgc3VyZSB0aGF0IGl0J3Mgc3VwcG9ydGVkLlxuICAgIGlmICgnc2Nyb2xsQmVoYXZpb3InIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuc3R5bGUpIHtcbiAgICAgIHNjcm9sbEJlaGF2aW9yU3VwcG9ydGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBoYXZlIDMgcG9zc2liaWxpdGllczogYHNjcm9sbFRvYCBpc24ndCBzdXBwb3J0ZWQgYXQgYWxsLCBpdCdzXG4gICAgICAvLyBzdXBwb3J0ZWQgYnV0IGl0IGRvZXNuJ3QgaGFuZGxlIHNjcm9sbCBiZWhhdmlvciwgb3IgaXQgaGFzIGJlZW4gcG9seWZpbGxlZC5cbiAgICAgIGNvbnN0IHNjcm9sbFRvRnVuY3Rpb246IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsVG87XG5cbiAgICAgIGlmIChzY3JvbGxUb0Z1bmN0aW9uKSB7XG4gICAgICAgIC8vIFdlIGNhbiBkZXRlY3QgaWYgdGhlIGZ1bmN0aW9uIGhhcyBiZWVuIHBvbHlmaWxsZWQgYnkgY2FsbGluZyBgdG9TdHJpbmdgIG9uIGl0LiBOYXRpdmVcbiAgICAgICAgLy8gZnVuY3Rpb25zIGFyZSBvYmZ1c2NhdGVkIHVzaW5nIGBbbmF0aXZlIGNvZGVdYCwgd2hlcmVhcyBpZiBpdCB3YXMgb3ZlcndyaXR0ZW4gd2UnZCBnZXRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBmdW5jdGlvbiBzb3VyY2UuIFZpYSBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3QtbmF0aXZlLWZ1bmN0aW9uLiBDb25zaWRlclxuICAgICAgICAvLyBwb2x5ZmlsbGVkIGZ1bmN0aW9ucyBhcyBzdXBwb3J0aW5nIHNjcm9sbCBiZWhhdmlvci5cbiAgICAgICAgc2Nyb2xsQmVoYXZpb3JTdXBwb3J0ZWQgPSAhL1xce1xccypcXFtuYXRpdmUgY29kZVxcXVxccypcXH0vLnRlc3Qoc2Nyb2xsVG9GdW5jdGlvbi50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbEJlaGF2aW9yU3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNjcm9sbEJlaGF2aW9yU3VwcG9ydGVkO1xufVxuXG4vKipcbiAqIENoZWNrcyB0aGUgdHlwZSBvZiBSVEwgc2Nyb2xsIGF4aXMgdXNlZCBieSB0aGlzIGJyb3dzZXIuIEFzIG9mIHRpbWUgb2Ygd3JpdGluZywgQ2hyb21lIGlzIE5PUk1BTCxcbiAqIEZpcmVmb3ggJiBTYWZhcmkgYXJlIE5FR0FURUQsIGFuZCBJRSAmIEVkZ2UgYXJlIElOVkVSVEVELlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UnRsU2Nyb2xsQXhpc1R5cGUoKTogUnRsU2Nyb2xsQXhpc1R5cGUge1xuICAvLyBXZSBjYW4ndCBjaGVjayB1bmxlc3Mgd2UncmUgb24gdGhlIGJyb3dzZXIuIEp1c3QgYXNzdW1lICdub3JtYWwnIGlmIHdlJ3JlIG5vdC5cbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ29iamVjdCcgfHwgIWRvY3VtZW50KSB7XG4gICAgcmV0dXJuIFJ0bFNjcm9sbEF4aXNUeXBlLk5PUk1BTDtcbiAgfVxuXG4gIGlmIChydGxTY3JvbGxBeGlzVHlwZSA9PSBudWxsKSB7XG4gICAgLy8gQ3JlYXRlIGEgMXB4IHdpZGUgc2Nyb2xsaW5nIGNvbnRhaW5lciBhbmQgYSAycHggd2lkZSBjb250ZW50IGVsZW1lbnQuXG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgY29udGFpbmVyU3R5bGUgPSBzY3JvbGxDb250YWluZXIuc3R5bGU7XG4gICAgc2Nyb2xsQ29udGFpbmVyLmRpciA9ICdydGwnO1xuICAgIGNvbnRhaW5lclN0eWxlLndpZHRoID0gJzFweCc7XG4gICAgY29udGFpbmVyU3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XG4gICAgY29udGFpbmVyU3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGNvbnRhaW5lclN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgY29udGFpbmVyU3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNvbnRlbnRTdHlsZSA9IGNvbnRlbnQuc3R5bGU7XG4gICAgY29udGVudFN0eWxlLndpZHRoID0gJzJweCc7XG4gICAgY29udGVudFN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXG4gICAgc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsQ29udGFpbmVyKTtcblxuICAgIHJ0bFNjcm9sbEF4aXNUeXBlID0gUnRsU2Nyb2xsQXhpc1R5cGUuTk9STUFMO1xuXG4gICAgLy8gVGhlIHZpZXdwb3J0IHN0YXJ0cyBzY3JvbGxlZCBhbGwgdGhlIHdheSB0byB0aGUgcmlnaHQgaW4gUlRMIG1vZGUuIElmIHdlIGFyZSBpbiBhIE5PUk1BTFxuICAgIC8vIGJyb3dzZXIgdGhpcyB3b3VsZCBtZWFuIHRoYXQgdGhlIHNjcm9sbExlZnQgc2hvdWxkIGJlIDEuIElmIGl0J3MgemVybyBpbnN0ZWFkIHdlIGtub3cgd2UncmVcbiAgICAvLyBkZWFsaW5nIHdpdGggb25lIG9mIHRoZSBvdGhlciB0d28gdHlwZXMgb2YgYnJvd3NlcnMuXG4gICAgaWYgKHNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ID09PSAwKSB7XG4gICAgICAvLyBJbiBhIE5FR0FURUQgYnJvd3NlciB0aGUgc2Nyb2xsTGVmdCBpcyBhbHdheXMgc29tZXdoZXJlIGluIFstbWF4U2Nyb2xsQW1vdW50LCAwXS4gRm9yIGFuXG4gICAgICAvLyBJTlZFUlRFRCBicm93c2VyIGl0IGlzIGFsd2F5cyBzb21ld2hlcmUgaW4gWzAsIG1heFNjcm9sbEFtb3VudF0uIFdlIGNhbiBkZXRlcm1pbmUgd2hpY2ggYnlcbiAgICAgIC8vIHNldHRpbmcgdG8gdGhlIHNjcm9sbExlZnQgdG8gMS4gVGhpcyBpcyBwYXN0IHRoZSBtYXggZm9yIGEgTkVHQVRFRCBicm93c2VyLCBzbyBpdCB3aWxsXG4gICAgICAvLyByZXR1cm4gMCB3aGVuIHdlIHJlYWQgaXQgYWdhaW4uXG4gICAgICBzY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCA9IDE7XG4gICAgICBydGxTY3JvbGxBeGlzVHlwZSA9XG4gICAgICAgIHNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ID09PSAwID8gUnRsU2Nyb2xsQXhpc1R5cGUuTkVHQVRFRCA6IFJ0bFNjcm9sbEF4aXNUeXBlLklOVkVSVEVEO1xuICAgIH1cblxuICAgIHNjcm9sbENvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxuICByZXR1cm4gcnRsU2Nyb2xsQXhpc1R5cGU7XG59XG4iXX0=