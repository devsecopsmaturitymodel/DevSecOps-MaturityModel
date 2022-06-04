/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { supportsScrollBehavior } from '@angular/cdk/platform';
const scrollBehaviorSupported = supportsScrollBehavior();
/**
 * Strategy that will prevent the user from scrolling while the overlay is visible.
 */
export class BlockScrollStrategy {
    constructor(_viewportRuler, document) {
        this._viewportRuler = _viewportRuler;
        this._previousHTMLStyles = { top: '', left: '' };
        this._isEnabled = false;
        this._document = document;
    }
    /** Attaches this scroll strategy to an overlay. */
    attach() { }
    /** Blocks page-level scroll while the attached overlay is open. */
    enable() {
        if (this._canBeEnabled()) {
            const root = this._document.documentElement;
            this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
            // Cache the previous inline styles in case the user had set them.
            this._previousHTMLStyles.left = root.style.left || '';
            this._previousHTMLStyles.top = root.style.top || '';
            // Note: we're using the `html` node, instead of the `body`, because the `body` may
            // have the user agent margin, whereas the `html` is guaranteed not to have one.
            root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
            root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
            root.classList.add('cdk-global-scrollblock');
            this._isEnabled = true;
        }
    }
    /** Unblocks page-level scroll while the attached overlay is open. */
    disable() {
        if (this._isEnabled) {
            const html = this._document.documentElement;
            const body = this._document.body;
            const htmlStyle = html.style;
            const bodyStyle = body.style;
            const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || '';
            const previousBodyScrollBehavior = bodyStyle.scrollBehavior || '';
            this._isEnabled = false;
            htmlStyle.left = this._previousHTMLStyles.left;
            htmlStyle.top = this._previousHTMLStyles.top;
            html.classList.remove('cdk-global-scrollblock');
            // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
            // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
            // Note that we don't mutate the property if the browser doesn't support `scroll-behavior`,
            // because it can throw off feature detections in `supportsScrollBehavior` which
            // checks for `'scrollBehavior' in documentElement.style`.
            if (scrollBehaviorSupported) {
                htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = 'auto';
            }
            window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
            if (scrollBehaviorSupported) {
                htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
                bodyStyle.scrollBehavior = previousBodyScrollBehavior;
            }
        }
    }
    _canBeEnabled() {
        // Since the scroll strategies can't be singletons, we have to use a global CSS class
        // (`cdk-global-scrollblock`) to make sure that we don't try to disable global
        // scrolling multiple times.
        const html = this._document.documentElement;
        if (html.classList.contains('cdk-global-scrollblock') || this._isEnabled) {
            return false;
        }
        const body = this._document.body;
        const viewport = this._viewportRuler.getViewportSize();
        return body.scrollHeight > viewport.height || body.scrollWidth > viewport.width;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stc2Nyb2xsLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Njcm9sbC9ibG9jay1zY3JvbGwtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBSUgsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFN0QsTUFBTSx1QkFBdUIsR0FBRyxzQkFBc0IsRUFBRSxDQUFDO0FBRXpEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLG1CQUFtQjtJQU05QixZQUFvQixjQUE2QixFQUFFLFFBQWE7UUFBNUMsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFMekMsd0JBQW1CLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUUxQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBSXpCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsTUFBTSxLQUFJLENBQUM7SUFFWCxtRUFBbUU7SUFDbkUsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZ0IsQ0FBQztZQUU3QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBRS9FLGtFQUFrRTtZQUNsRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN0RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUVwRCxtRkFBbUY7WUFDbkYsZ0ZBQWdGO1lBQ2hGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFnQixDQUFDO1lBQzdDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSyxDQUFDO1lBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDN0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixNQUFNLDBCQUEwQixHQUFHLFNBQVMsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO1lBQ2xFLE1BQU0sMEJBQTBCLEdBQUcsU0FBUyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7WUFFbEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFFeEIsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDO1lBQy9DLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRWhELDBGQUEwRjtZQUMxRix1RUFBdUU7WUFDdkUsMkZBQTJGO1lBQzNGLGdGQUFnRjtZQUNoRiwwREFBMEQ7WUFDMUQsSUFBSSx1QkFBdUIsRUFBRTtnQkFDM0IsU0FBUyxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQzthQUM5RDtZQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFbkYsSUFBSSx1QkFBdUIsRUFBRTtnQkFDM0IsU0FBUyxDQUFDLGNBQWMsR0FBRywwQkFBMEIsQ0FBQztnQkFDdEQsU0FBUyxDQUFDLGNBQWMsR0FBRywwQkFBMEIsQ0FBQzthQUN2RDtTQUNGO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIscUZBQXFGO1FBQ3JGLDhFQUE4RTtRQUM5RSw0QkFBNEI7UUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFnQixDQUFDO1FBRTdDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3hFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNsRixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTY3JvbGxTdHJhdGVneX0gZnJvbSAnLi9zY3JvbGwtc3RyYXRlZ3knO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7Y29lcmNlQ3NzUGl4ZWxWYWx1ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7c3VwcG9ydHNTY3JvbGxCZWhhdmlvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcblxuY29uc3Qgc2Nyb2xsQmVoYXZpb3JTdXBwb3J0ZWQgPSBzdXBwb3J0c1Njcm9sbEJlaGF2aW9yKCk7XG5cbi8qKlxuICogU3RyYXRlZ3kgdGhhdCB3aWxsIHByZXZlbnQgdGhlIHVzZXIgZnJvbSBzY3JvbGxpbmcgd2hpbGUgdGhlIG92ZXJsYXkgaXMgdmlzaWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJsb2NrU2Nyb2xsU3RyYXRlZ3kgaW1wbGVtZW50cyBTY3JvbGxTdHJhdGVneSB7XG4gIHByaXZhdGUgX3ByZXZpb3VzSFRNTFN0eWxlcyA9IHt0b3A6ICcnLCBsZWZ0OiAnJ307XG4gIHByaXZhdGUgX3ByZXZpb3VzU2Nyb2xsUG9zaXRpb246IHt0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyfTtcbiAgcHJpdmF0ZSBfaXNFbmFibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLCBkb2N1bWVudDogYW55KSB7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIC8qKiBBdHRhY2hlcyB0aGlzIHNjcm9sbCBzdHJhdGVneSB0byBhbiBvdmVybGF5LiAqL1xuICBhdHRhY2goKSB7fVxuXG4gIC8qKiBCbG9ja3MgcGFnZS1sZXZlbCBzY3JvbGwgd2hpbGUgdGhlIGF0dGFjaGVkIG92ZXJsYXkgaXMgb3Blbi4gKi9cbiAgZW5hYmxlKCkge1xuICAgIGlmICh0aGlzLl9jYW5CZUVuYWJsZWQoKSkge1xuICAgICAgY29uc3Qgcm9vdCA9IHRoaXMuX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCE7XG5cbiAgICAgIHRoaXMuX3ByZXZpb3VzU2Nyb2xsUG9zaXRpb24gPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgICAgLy8gQ2FjaGUgdGhlIHByZXZpb3VzIGlubGluZSBzdHlsZXMgaW4gY2FzZSB0aGUgdXNlciBoYWQgc2V0IHRoZW0uXG4gICAgICB0aGlzLl9wcmV2aW91c0hUTUxTdHlsZXMubGVmdCA9IHJvb3Quc3R5bGUubGVmdCB8fCAnJztcbiAgICAgIHRoaXMuX3ByZXZpb3VzSFRNTFN0eWxlcy50b3AgPSByb290LnN0eWxlLnRvcCB8fCAnJztcblxuICAgICAgLy8gTm90ZTogd2UncmUgdXNpbmcgdGhlIGBodG1sYCBub2RlLCBpbnN0ZWFkIG9mIHRoZSBgYm9keWAsIGJlY2F1c2UgdGhlIGBib2R5YCBtYXlcbiAgICAgIC8vIGhhdmUgdGhlIHVzZXIgYWdlbnQgbWFyZ2luLCB3aGVyZWFzIHRoZSBgaHRtbGAgaXMgZ3VhcmFudGVlZCBub3QgdG8gaGF2ZSBvbmUuXG4gICAgICByb290LnN0eWxlLmxlZnQgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKC10aGlzLl9wcmV2aW91c1Njcm9sbFBvc2l0aW9uLmxlZnQpO1xuICAgICAgcm9vdC5zdHlsZS50b3AgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKC10aGlzLl9wcmV2aW91c1Njcm9sbFBvc2l0aW9uLnRvcCk7XG4gICAgICByb290LmNsYXNzTGlzdC5hZGQoJ2Nkay1nbG9iYWwtc2Nyb2xsYmxvY2snKTtcbiAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVuYmxvY2tzIHBhZ2UtbGV2ZWwgc2Nyb2xsIHdoaWxlIHRoZSBhdHRhY2hlZCBvdmVybGF5IGlzIG9wZW4uICovXG4gIGRpc2FibGUoKSB7XG4gICAgaWYgKHRoaXMuX2lzRW5hYmxlZCkge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMuX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCE7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keSE7XG4gICAgICBjb25zdCBodG1sU3R5bGUgPSBodG1sLnN0eWxlO1xuICAgICAgY29uc3QgYm9keVN0eWxlID0gYm9keS5zdHlsZTtcbiAgICAgIGNvbnN0IHByZXZpb3VzSHRtbFNjcm9sbEJlaGF2aW9yID0gaHRtbFN0eWxlLnNjcm9sbEJlaGF2aW9yIHx8ICcnO1xuICAgICAgY29uc3QgcHJldmlvdXNCb2R5U2Nyb2xsQmVoYXZpb3IgPSBib2R5U3R5bGUuc2Nyb2xsQmVoYXZpb3IgfHwgJyc7XG5cbiAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICBodG1sU3R5bGUubGVmdCA9IHRoaXMuX3ByZXZpb3VzSFRNTFN0eWxlcy5sZWZ0O1xuICAgICAgaHRtbFN0eWxlLnRvcCA9IHRoaXMuX3ByZXZpb3VzSFRNTFN0eWxlcy50b3A7XG4gICAgICBodG1sLmNsYXNzTGlzdC5yZW1vdmUoJ2Nkay1nbG9iYWwtc2Nyb2xsYmxvY2snKTtcblxuICAgICAgLy8gRGlzYWJsZSB1c2VyLWRlZmluZWQgc21vb3RoIHNjcm9sbGluZyB0ZW1wb3JhcmlseSB3aGlsZSB3ZSByZXN0b3JlIHRoZSBzY3JvbGwgcG9zaXRpb24uXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3Njcm9sbC1iZWhhdmlvclxuICAgICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IG11dGF0ZSB0aGUgcHJvcGVydHkgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGBzY3JvbGwtYmVoYXZpb3JgLFxuICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gdGhyb3cgb2ZmIGZlYXR1cmUgZGV0ZWN0aW9ucyBpbiBgc3VwcG9ydHNTY3JvbGxCZWhhdmlvcmAgd2hpY2hcbiAgICAgIC8vIGNoZWNrcyBmb3IgYCdzY3JvbGxCZWhhdmlvcicgaW4gZG9jdW1lbnRFbGVtZW50LnN0eWxlYC5cbiAgICAgIGlmIChzY3JvbGxCZWhhdmlvclN1cHBvcnRlZCkge1xuICAgICAgICBodG1sU3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBib2R5U3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5zY3JvbGwodGhpcy5fcHJldmlvdXNTY3JvbGxQb3NpdGlvbi5sZWZ0LCB0aGlzLl9wcmV2aW91c1Njcm9sbFBvc2l0aW9uLnRvcCk7XG5cbiAgICAgIGlmIChzY3JvbGxCZWhhdmlvclN1cHBvcnRlZCkge1xuICAgICAgICBodG1sU3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBwcmV2aW91c0h0bWxTY3JvbGxCZWhhdmlvcjtcbiAgICAgICAgYm9keVN0eWxlLnNjcm9sbEJlaGF2aW9yID0gcHJldmlvdXNCb2R5U2Nyb2xsQmVoYXZpb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FuQmVFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIC8vIFNpbmNlIHRoZSBzY3JvbGwgc3RyYXRlZ2llcyBjYW4ndCBiZSBzaW5nbGV0b25zLCB3ZSBoYXZlIHRvIHVzZSBhIGdsb2JhbCBDU1MgY2xhc3NcbiAgICAvLyAoYGNkay1nbG9iYWwtc2Nyb2xsYmxvY2tgKSB0byBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gZGlzYWJsZSBnbG9iYWxcbiAgICAvLyBzY3JvbGxpbmcgbXVsdGlwbGUgdGltZXMuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMuX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCE7XG5cbiAgICBpZiAoaHRtbC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nkay1nbG9iYWwtc2Nyb2xsYmxvY2snKSB8fCB0aGlzLl9pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG4gICAgcmV0dXJuIGJvZHkuc2Nyb2xsSGVpZ2h0ID4gdmlld3BvcnQuaGVpZ2h0IHx8IGJvZHkuc2Nyb2xsV2lkdGggPiB2aWV3cG9ydC53aWR0aDtcbiAgfVxufVxuIl19