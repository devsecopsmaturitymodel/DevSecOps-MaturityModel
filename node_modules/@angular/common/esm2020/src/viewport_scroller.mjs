/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { DOCUMENT } from './dom_tokens';
/**
 * Defines a scroll position manager. Implemented by `BrowserViewportScroller`.
 *
 * @publicApi
 */
export class ViewportScroller {
}
// De-sugared tree-shakable injection
// See #23917
/** @nocollapse */
ViewportScroller.ɵprov = ɵɵdefineInjectable({
    token: ViewportScroller,
    providedIn: 'root',
    factory: () => new BrowserViewportScroller(ɵɵinject(DOCUMENT), window)
});
/**
 * Manages the scroll position for a browser window.
 */
export class BrowserViewportScroller {
    constructor(document, window) {
        this.document = document;
        this.window = window;
        this.offset = () => [0, 0];
    }
    /**
     * Configures the top offset used when scrolling to an anchor.
     * @param offset A position in screen coordinates (a tuple with x and y values)
     * or a function that returns the top offset position.
     *
     */
    setOffset(offset) {
        if (Array.isArray(offset)) {
            this.offset = () => offset;
        }
        else {
            this.offset = offset;
        }
    }
    /**
     * Retrieves the current scroll position.
     * @returns The position in screen coordinates.
     */
    getScrollPosition() {
        if (this.supportsScrolling()) {
            return [this.window.pageXOffset, this.window.pageYOffset];
        }
        else {
            return [0, 0];
        }
    }
    /**
     * Sets the scroll position.
     * @param position The new position in screen coordinates.
     */
    scrollToPosition(position) {
        if (this.supportsScrolling()) {
            this.window.scrollTo(position[0], position[1]);
        }
    }
    /**
     * Scrolls to an element and attempts to focus the element.
     *
     * Note that the function name here is misleading in that the target string may be an ID for a
     * non-anchor element.
     *
     * @param target The ID of an element or name of the anchor.
     *
     * @see https://html.spec.whatwg.org/#the-indicated-part-of-the-document
     * @see https://html.spec.whatwg.org/#scroll-to-fragid
     */
    scrollToAnchor(target) {
        if (!this.supportsScrolling()) {
            return;
        }
        const elSelected = findAnchorFromDocument(this.document, target);
        if (elSelected) {
            this.scrollToElement(elSelected);
            // After scrolling to the element, the spec dictates that we follow the focus steps for the
            // target. Rather than following the robust steps, simply attempt focus.
            //
            // @see https://html.spec.whatwg.org/#get-the-focusable-area
            // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
            // @see https://html.spec.whatwg.org/#focusable-area
            elSelected.focus();
        }
    }
    /**
     * Disables automatic scroll restoration provided by the browser.
     */
    setHistoryScrollRestoration(scrollRestoration) {
        if (this.supportScrollRestoration()) {
            const history = this.window.history;
            if (history && history.scrollRestoration) {
                history.scrollRestoration = scrollRestoration;
            }
        }
    }
    /**
     * Scrolls to an element using the native offset and the specified offset set on this scroller.
     *
     * The offset can be used when we know that there is a floating header and scrolling naively to an
     * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
     */
    scrollToElement(el) {
        const rect = el.getBoundingClientRect();
        const left = rect.left + this.window.pageXOffset;
        const top = rect.top + this.window.pageYOffset;
        const offset = this.offset();
        this.window.scrollTo(left - offset[0], top - offset[1]);
    }
    /**
     * We only support scroll restoration when we can get a hold of window.
     * This means that we do not support this behavior when running in a web worker.
     *
     * Lifting this restriction right now would require more changes in the dom adapter.
     * Since webworkers aren't widely used, we will lift it once RouterScroller is
     * battle-tested.
     */
    supportScrollRestoration() {
        try {
            if (!this.supportsScrolling()) {
                return false;
            }
            // The `scrollRestoration` property could be on the `history` instance or its prototype.
            const scrollRestorationDescriptor = getScrollRestorationProperty(this.window.history) ||
                getScrollRestorationProperty(Object.getPrototypeOf(this.window.history));
            // We can write to the `scrollRestoration` property if it is a writable data field or it has a
            // setter function.
            return !!scrollRestorationDescriptor &&
                !!(scrollRestorationDescriptor.writable || scrollRestorationDescriptor.set);
        }
        catch {
            return false;
        }
    }
    supportsScrolling() {
        try {
            return !!this.window && !!this.window.scrollTo && 'pageXOffset' in this.window;
        }
        catch {
            return false;
        }
    }
}
function getScrollRestorationProperty(obj) {
    return Object.getOwnPropertyDescriptor(obj, 'scrollRestoration');
}
function findAnchorFromDocument(document, target) {
    const documentResult = document.getElementById(target) || document.getElementsByName(target)[0];
    if (documentResult) {
        return documentResult;
    }
    // `getElementById` and `getElementsByName` won't pierce through the shadow DOM so we
    // have to traverse the DOM manually and do the lookup through the shadow roots.
    if (typeof document.createTreeWalker === 'function' && document.body &&
        (document.body.createShadowRoot || document.body.attachShadow)) {
        const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        let currentNode = treeWalker.currentNode;
        while (currentNode) {
            const shadowRoot = currentNode.shadowRoot;
            if (shadowRoot) {
                // Note that `ShadowRoot` doesn't support `getElementsByName`
                // so we have to fall back to `querySelector`.
                const result = shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${target}"]`);
                if (result) {
                    return result;
                }
            }
            currentNode = treeWalker.nextNode();
        }
    }
    return null;
}
/**
 * Provides an empty implementation of the viewport scroller.
 */
export class NullViewportScroller {
    /**
     * Empty implementation
     */
    setOffset(offset) { }
    /**
     * Empty implementation
     */
    getScrollPosition() {
        return [0, 0];
    }
    /**
     * Empty implementation
     */
    scrollToPosition(position) { }
    /**
     * Empty implementation
     */
    scrollToAnchor(anchor) { }
    /**
     * Empty implementation
     */
    setHistoryScrollRestoration(scrollRestoration) { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld3BvcnRfc2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3ZpZXdwb3J0X3Njcm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFM0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUl0Qzs7OztHQUlHO0FBQ0gsTUFBTSxPQUFnQixnQkFBZ0I7O0FBQ3BDLHFDQUFxQztBQUNyQyxhQUFhO0FBQ2Isa0JBQWtCO0FBQ1gsc0JBQUssR0FBNkIsa0JBQWtCLENBQUM7SUFDMUQsS0FBSyxFQUFFLGdCQUFnQjtJQUN2QixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDO0NBQ3ZFLENBQUMsQ0FBQztBQW9DTDs7R0FFRztBQUNILE1BQU0sT0FBTyx1QkFBdUI7SUFHbEMsWUFBb0IsUUFBa0IsRUFBVSxNQUFjO1FBQTFDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRnRELFdBQU0sR0FBMkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFVyxDQUFDO0lBRWxFOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFDLE1BQWlEO1FBQ3pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztTQUM1QjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQ7OztPQUdH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Q0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLE1BQU0sSUFBSSxDQUFDLENBQUM7Z0JBQ3hGLElBQUksTUFBTSxFQUFFO29CQUNWLE9BQU8sTUFBTSxDQUFDO2lCQUNmO2FBQ0Y7WUFFRCxXQUFXLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBd0IsQ0FBQztTQUMzRDtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sb0JBQW9CO0lBQy9COztPQUVHO0lBQ0gsU0FBUyxDQUFDLE1BQWlELElBQVMsQ0FBQztJQUVyRTs7T0FFRztJQUNILGlCQUFpQjtRQUNmLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0JBQWdCLENBQUMsUUFBMEIsSUFBUyxDQUFDO0lBRXJEOztPQUVHO0lBQ0gsY0FBYyxDQUFDLE1BQWMsSUFBUyxDQUFDO0lBRXZDOztPQUVHO0lBQ0gsMkJBQTJCLENBQUMsaUJBQWtDLElBQVMsQ0FBQztDQUN6RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge8m1ybVkZWZpbmVJbmplY3RhYmxlLCDJtcm1aW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnLi9kb21fdG9rZW5zJztcblxuXG5cbi8qKlxuICogRGVmaW5lcyBhIHNjcm9sbCBwb3NpdGlvbiBtYW5hZ2VyLiBJbXBsZW1lbnRlZCBieSBgQnJvd3NlclZpZXdwb3J0U2Nyb2xsZXJgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdwb3J0U2Nyb2xsZXIge1xuICAvLyBEZS1zdWdhcmVkIHRyZWUtc2hha2FibGUgaW5qZWN0aW9uXG4gIC8vIFNlZSAjMjM5MTdcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyDJtXByb3YgPSAvKiogQHB1cmVPckJyZWFrTXlDb2RlICovIMm1ybVkZWZpbmVJbmplY3RhYmxlKHtcbiAgICB0b2tlbjogVmlld3BvcnRTY3JvbGxlcixcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogKCkgPT4gbmV3IEJyb3dzZXJWaWV3cG9ydFNjcm9sbGVyKMm1ybVpbmplY3QoRE9DVU1FTlQpLCB3aW5kb3cpXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSB0b3Agb2Zmc2V0IHVzZWQgd2hlbiBzY3JvbGxpbmcgdG8gYW4gYW5jaG9yLlxuICAgKiBAcGFyYW0gb2Zmc2V0IEEgcG9zaXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzIChhIHR1cGxlIHdpdGggeCBhbmQgeSB2YWx1ZXMpXG4gICAqIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB0b3Agb2Zmc2V0IHBvc2l0aW9uLlxuICAgKlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0T2Zmc2V0KG9mZnNldDogW251bWJlciwgbnVtYmVyXXwoKCkgPT4gW251bWJlciwgbnVtYmVyXSkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyBBIHBvc2l0aW9uIGluIHNjcmVlbiBjb29yZGluYXRlcyAoYSB0dXBsZSB3aXRoIHggYW5kIHkgdmFsdWVzKS5cbiAgICovXG4gIGFic3RyYWN0IGdldFNjcm9sbFBvc2l0aW9uKCk6IFtudW1iZXIsIG51bWJlcl07XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdG8gYSBzcGVjaWZpZWQgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBBIHBvc2l0aW9uIGluIHNjcmVlbiBjb29yZGluYXRlcyAoYSB0dXBsZSB3aXRoIHggYW5kIHkgdmFsdWVzKS5cbiAgICovXG4gIGFic3RyYWN0IHNjcm9sbFRvUG9zaXRpb24ocG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRvIGFuIGFuY2hvciBlbGVtZW50LlxuICAgKiBAcGFyYW0gYW5jaG9yIFRoZSBJRCBvZiB0aGUgYW5jaG9yIGVsZW1lbnQuXG4gICAqL1xuICBhYnN0cmFjdCBzY3JvbGxUb0FuY2hvcihhbmNob3I6IHN0cmluZyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIGF1dG9tYXRpYyBzY3JvbGwgcmVzdG9yYXRpb24gcHJvdmlkZWQgYnkgdGhlIGJyb3dzZXIuXG4gICAqIFNlZSBhbHNvIFt3aW5kb3cuaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvblxuICAgKiBpbmZvXShodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdXBkYXRlcy8yMDE1LzA5L2hpc3RvcnktYXBpLXNjcm9sbC1yZXN0b3JhdGlvbikuXG4gICAqL1xuICBhYnN0cmFjdCBzZXRIaXN0b3J5U2Nyb2xsUmVzdG9yYXRpb24oc2Nyb2xsUmVzdG9yYXRpb246ICdhdXRvJ3wnbWFudWFsJyk6IHZvaWQ7XG59XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGZvciBhIGJyb3dzZXIgd2luZG93LlxuICovXG5leHBvcnQgY2xhc3MgQnJvd3NlclZpZXdwb3J0U2Nyb2xsZXIgaW1wbGVtZW50cyBWaWV3cG9ydFNjcm9sbGVyIHtcbiAgcHJpdmF0ZSBvZmZzZXQ6ICgpID0+IFtudW1iZXIsIG51bWJlcl0gPSAoKSA9PiBbMCwgMF07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIHByaXZhdGUgd2luZG93OiBXaW5kb3cpIHt9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHRvcCBvZmZzZXQgdXNlZCB3aGVuIHNjcm9sbGluZyB0byBhbiBhbmNob3IuXG4gICAqIEBwYXJhbSBvZmZzZXQgQSBwb3NpdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMgKGEgdHVwbGUgd2l0aCB4IGFuZCB5IHZhbHVlcylcbiAgICogb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHRvcCBvZmZzZXQgcG9zaXRpb24uXG4gICAqXG4gICAqL1xuICBzZXRPZmZzZXQob2Zmc2V0OiBbbnVtYmVyLCBudW1iZXJdfCgoKSA9PiBbbnVtYmVyLCBudW1iZXJdKSk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9mZnNldCkpIHtcbiAgICAgIHRoaXMub2Zmc2V0ID0gKCkgPT4gb2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbi5cbiAgICogQHJldHVybnMgVGhlIHBvc2l0aW9uIGluIHNjcmVlbiBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFNjcm9sbFBvc2l0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGlmICh0aGlzLnN1cHBvcnRzU2Nyb2xsaW5nKCkpIHtcbiAgICAgIHJldHVybiBbdGhpcy53aW5kb3cucGFnZVhPZmZzZXQsIHRoaXMud2luZG93LnBhZ2VZT2Zmc2V0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gVGhlIG5ldyBwb3NpdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAqL1xuICBzY3JvbGxUb1Bvc2l0aW9uKHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3VwcG9ydHNTY3JvbGxpbmcoKSkge1xuICAgICAgdGhpcy53aW5kb3cuc2Nyb2xsVG8ocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2Nyb2xscyB0byBhbiBlbGVtZW50IGFuZCBhdHRlbXB0cyB0byBmb2N1cyB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBmdW5jdGlvbiBuYW1lIGhlcmUgaXMgbWlzbGVhZGluZyBpbiB0aGF0IHRoZSB0YXJnZXQgc3RyaW5nIG1heSBiZSBhbiBJRCBmb3IgYVxuICAgKiBub24tYW5jaG9yIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB0YXJnZXQgVGhlIElEIG9mIGFuIGVsZW1lbnQgb3IgbmFtZSBvZiB0aGUgYW5jaG9yLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvI3RoZS1pbmRpY2F0ZWQtcGFydC1vZi10aGUtZG9jdW1lbnRcbiAgICogQHNlZSBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnLyNzY3JvbGwtdG8tZnJhZ2lkXG4gICAqL1xuICBzY3JvbGxUb0FuY2hvcih0YXJnZXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdXBwb3J0c1Njcm9sbGluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWxTZWxlY3RlZCA9IGZpbmRBbmNob3JGcm9tRG9jdW1lbnQodGhpcy5kb2N1bWVudCwgdGFyZ2V0KTtcblxuICAgIGlmIChlbFNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRWxlbWVudChlbFNlbGVjdGVkKTtcbiAgICAgIC8vIEFmdGVyIHNjcm9sbGluZyB0byB0aGUgZWxlbWVudCwgdGhlIHNwZWMgZGljdGF0ZXMgdGhhdCB3ZSBmb2xsb3cgdGhlIGZvY3VzIHN0ZXBzIGZvciB0aGVcbiAgICAgIC8vIHRhcmdldC4gUmF0aGVyIHRoYW4gZm9sbG93aW5nIHRoZSByb2J1c3Qgc3RlcHMsIHNpbXBseSBhdHRlbXB0IGZvY3VzLlxuICAgICAgLy9cbiAgICAgIC8vIEBzZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jZ2V0LXRoZS1mb2N1c2FibGUtYXJlYVxuICAgICAgLy8gQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTE9yRm9yZWlnbkVsZW1lbnQvZm9jdXNcbiAgICAgIC8vIEBzZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jZm9jdXNhYmxlLWFyZWFcbiAgICAgIGVsU2VsZWN0ZWQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgYXV0b21hdGljIHNjcm9sbCByZXN0b3JhdGlvbiBwcm92aWRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICovXG4gIHNldEhpc3RvcnlTY3JvbGxSZXN0b3JhdGlvbihzY3JvbGxSZXN0b3JhdGlvbjogJ2F1dG8nfCdtYW51YWwnKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3VwcG9ydFNjcm9sbFJlc3RvcmF0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLndpbmRvdy5oaXN0b3J5O1xuICAgICAgaWYgKGhpc3RvcnkgJiYgaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbikge1xuICAgICAgICBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gc2Nyb2xsUmVzdG9yYXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdG8gYW4gZWxlbWVudCB1c2luZyB0aGUgbmF0aXZlIG9mZnNldCBhbmQgdGhlIHNwZWNpZmllZCBvZmZzZXQgc2V0IG9uIHRoaXMgc2Nyb2xsZXIuXG4gICAqXG4gICAqIFRoZSBvZmZzZXQgY2FuIGJlIHVzZWQgd2hlbiB3ZSBrbm93IHRoYXQgdGhlcmUgaXMgYSBmbG9hdGluZyBoZWFkZXIgYW5kIHNjcm9sbGluZyBuYWl2ZWx5IHRvIGFuXG4gICAqIGVsZW1lbnQgKGV4OiBgc2Nyb2xsSW50b1ZpZXdgKSBsZWF2ZXMgdGhlIGVsZW1lbnQgaGlkZGVuIGJlaGluZCB0aGUgZmxvYXRpbmcgaGVhZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBzY3JvbGxUb0VsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxlZnQgPSByZWN0LmxlZnQgKyB0aGlzLndpbmRvdy5wYWdlWE9mZnNldDtcbiAgICBjb25zdCB0b3AgPSByZWN0LnRvcCArIHRoaXMud2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMub2Zmc2V0KCk7XG4gICAgdGhpcy53aW5kb3cuc2Nyb2xsVG8obGVmdCAtIG9mZnNldFswXSwgdG9wIC0gb2Zmc2V0WzFdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBvbmx5IHN1cHBvcnQgc2Nyb2xsIHJlc3RvcmF0aW9uIHdoZW4gd2UgY2FuIGdldCBhIGhvbGQgb2Ygd2luZG93LlxuICAgKiBUaGlzIG1lYW5zIHRoYXQgd2UgZG8gbm90IHN1cHBvcnQgdGhpcyBiZWhhdmlvciB3aGVuIHJ1bm5pbmcgaW4gYSB3ZWIgd29ya2VyLlxuICAgKlxuICAgKiBMaWZ0aW5nIHRoaXMgcmVzdHJpY3Rpb24gcmlnaHQgbm93IHdvdWxkIHJlcXVpcmUgbW9yZSBjaGFuZ2VzIGluIHRoZSBkb20gYWRhcHRlci5cbiAgICogU2luY2Ugd2Vid29ya2VycyBhcmVuJ3Qgd2lkZWx5IHVzZWQsIHdlIHdpbGwgbGlmdCBpdCBvbmNlIFJvdXRlclNjcm9sbGVyIGlzXG4gICAqIGJhdHRsZS10ZXN0ZWQuXG4gICAqL1xuICBwcml2YXRlIHN1cHBvcnRTY3JvbGxSZXN0b3JhdGlvbigpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLnN1cHBvcnRzU2Nyb2xsaW5nKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gVGhlIGBzY3JvbGxSZXN0b3JhdGlvbmAgcHJvcGVydHkgY291bGQgYmUgb24gdGhlIGBoaXN0b3J5YCBpbnN0YW5jZSBvciBpdHMgcHJvdG90eXBlLlxuICAgICAgY29uc3Qgc2Nyb2xsUmVzdG9yYXRpb25EZXNjcmlwdG9yID0gZ2V0U2Nyb2xsUmVzdG9yYXRpb25Qcm9wZXJ0eSh0aGlzLndpbmRvdy5oaXN0b3J5KSB8fFxuICAgICAgICAgIGdldFNjcm9sbFJlc3RvcmF0aW9uUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMud2luZG93Lmhpc3RvcnkpKTtcbiAgICAgIC8vIFdlIGNhbiB3cml0ZSB0byB0aGUgYHNjcm9sbFJlc3RvcmF0aW9uYCBwcm9wZXJ0eSBpZiBpdCBpcyBhIHdyaXRhYmxlIGRhdGEgZmllbGQgb3IgaXQgaGFzIGFcbiAgICAgIC8vIHNldHRlciBmdW5jdGlvbi5cbiAgICAgIHJldHVybiAhIXNjcm9sbFJlc3RvcmF0aW9uRGVzY3JpcHRvciAmJlxuICAgICAgICAgICEhKHNjcm9sbFJlc3RvcmF0aW9uRGVzY3JpcHRvci53cml0YWJsZSB8fCBzY3JvbGxSZXN0b3JhdGlvbkRlc2NyaXB0b3Iuc2V0KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN1cHBvcnRzU2Nyb2xsaW5nKCk6IGJvb2xlYW4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gISF0aGlzLndpbmRvdyAmJiAhIXRoaXMud2luZG93LnNjcm9sbFRvICYmICdwYWdlWE9mZnNldCcgaW4gdGhpcy53aW5kb3c7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNjcm9sbFJlc3RvcmF0aW9uUHJvcGVydHkob2JqOiBhbnkpOiBQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCAnc2Nyb2xsUmVzdG9yYXRpb24nKTtcbn1cblxuZnVuY3Rpb24gZmluZEFuY2hvckZyb21Eb2N1bWVudChkb2N1bWVudDogRG9jdW1lbnQsIHRhcmdldDogc3RyaW5nKTogSFRNTEVsZW1lbnR8bnVsbCB7XG4gIGNvbnN0IGRvY3VtZW50UmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSh0YXJnZXQpWzBdO1xuXG4gIGlmIChkb2N1bWVudFJlc3VsdCkge1xuICAgIHJldHVybiBkb2N1bWVudFJlc3VsdDtcbiAgfVxuXG4gIC8vIGBnZXRFbGVtZW50QnlJZGAgYW5kIGBnZXRFbGVtZW50c0J5TmFtZWAgd29uJ3QgcGllcmNlIHRocm91Z2ggdGhlIHNoYWRvdyBET00gc28gd2VcbiAgLy8gaGF2ZSB0byB0cmF2ZXJzZSB0aGUgRE9NIG1hbnVhbGx5IGFuZCBkbyB0aGUgbG9va3VwIHRocm91Z2ggdGhlIHNoYWRvdyByb290cy5cbiAgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyID09PSAnZnVuY3Rpb24nICYmIGRvY3VtZW50LmJvZHkgJiZcbiAgICAgICgoZG9jdW1lbnQuYm9keSBhcyBhbnkpLmNyZWF0ZVNoYWRvd1Jvb3QgfHwgZG9jdW1lbnQuYm9keS5hdHRhY2hTaGFkb3cpKSB7XG4gICAgY29uc3QgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoZG9jdW1lbnQuYm9keSwgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IHRyZWVXYWxrZXIuY3VycmVudE5vZGUgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICBjb25zdCBzaGFkb3dSb290ID0gY3VycmVudE5vZGUuc2hhZG93Um9vdDtcblxuICAgICAgaWYgKHNoYWRvd1Jvb3QpIHtcbiAgICAgICAgLy8gTm90ZSB0aGF0IGBTaGFkb3dSb290YCBkb2Vzbid0IHN1cHBvcnQgYGdldEVsZW1lbnRzQnlOYW1lYFxuICAgICAgICAvLyBzbyB3ZSBoYXZlIHRvIGZhbGwgYmFjayB0byBgcXVlcnlTZWxlY3RvcmAuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgICAgICBzaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKHRhcmdldCkgfHwgc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7dGFyZ2V0fVwiXWApO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdXJyZW50Tm9kZSA9IHRyZWVXYWxrZXIubmV4dE5vZGUoKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gZW1wdHkgaW1wbGVtZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0IHNjcm9sbGVyLlxuICovXG5leHBvcnQgY2xhc3MgTnVsbFZpZXdwb3J0U2Nyb2xsZXIgaW1wbGVtZW50cyBWaWV3cG9ydFNjcm9sbGVyIHtcbiAgLyoqXG4gICAqIEVtcHR5IGltcGxlbWVudGF0aW9uXG4gICAqL1xuICBzZXRPZmZzZXQob2Zmc2V0OiBbbnVtYmVyLCBudW1iZXJdfCgoKSA9PiBbbnVtYmVyLCBudW1iZXJdKSk6IHZvaWQge31cblxuICAvKipcbiAgICogRW1wdHkgaW1wbGVtZW50YXRpb25cbiAgICovXG4gIGdldFNjcm9sbFBvc2l0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiBbMCwgMF07XG4gIH1cblxuICAvKipcbiAgICogRW1wdHkgaW1wbGVtZW50YXRpb25cbiAgICovXG4gIHNjcm9sbFRvUG9zaXRpb24ocG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0pOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIEVtcHR5IGltcGxlbWVudGF0aW9uXG4gICAqL1xuICBzY3JvbGxUb0FuY2hvcihhbmNob3I6IHN0cmluZyk6IHZvaWQge31cblxuICAvKipcbiAgICogRW1wdHkgaW1wbGVtZW50YXRpb25cbiAgICovXG4gIHNldEhpc3RvcnlTY3JvbGxSZXN0b3JhdGlvbihzY3JvbGxSZXN0b3JhdGlvbjogJ2F1dG8nfCdtYW51YWwnKTogdm9pZCB7fVxufVxuIl19