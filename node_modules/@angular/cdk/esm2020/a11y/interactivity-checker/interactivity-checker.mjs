/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * Configuration for the isFocusable method.
 */
export class IsFocusableConfig {
    constructor() {
        /**
         * Whether to count an element as focusable even if it is not currently visible.
         */
        this.ignoreVisibility = false;
    }
}
// The InteractivityChecker leans heavily on the ally.js accessibility utilities.
// Methods like `isTabbable` are only covering specific edge-cases for the browsers which are
// supported.
/**
 * Utility for checking the interactivity of an element, such as whether is is focusable or
 * tabbable.
 */
export class InteractivityChecker {
    constructor(_platform) {
        this._platform = _platform;
    }
    /**
     * Gets whether an element is disabled.
     *
     * @param element Element to be checked.
     * @returns Whether the element is disabled.
     */
    isDisabled(element) {
        // This does not capture some cases, such as a non-form control with a disabled attribute or
        // a form control inside of a disabled form, but should capture the most common cases.
        return element.hasAttribute('disabled');
    }
    /**
     * Gets whether an element is visible for the purposes of interactivity.
     *
     * This will capture states like `display: none` and `visibility: hidden`, but not things like
     * being clipped by an `overflow: hidden` parent or being outside the viewport.
     *
     * @returns Whether the element is visible.
     */
    isVisible(element) {
        return hasGeometry(element) && getComputedStyle(element).visibility === 'visible';
    }
    /**
     * Gets whether an element can be reached via Tab key.
     * Assumes that the element has already been checked with isFocusable.
     *
     * @param element Element to be checked.
     * @returns Whether the element is tabbable.
     */
    isTabbable(element) {
        // Nothing is tabbable on the server 😎
        if (!this._platform.isBrowser) {
            return false;
        }
        const frameElement = getFrameElement(getWindow(element));
        if (frameElement) {
            // Frame elements inherit their tabindex onto all child elements.
            if (getTabIndexValue(frameElement) === -1) {
                return false;
            }
            // Browsers disable tabbing to an element inside of an invisible frame.
            if (!this.isVisible(frameElement)) {
                return false;
            }
        }
        let nodeName = element.nodeName.toLowerCase();
        let tabIndexValue = getTabIndexValue(element);
        if (element.hasAttribute('contenteditable')) {
            return tabIndexValue !== -1;
        }
        if (nodeName === 'iframe' || nodeName === 'object') {
            // The frame or object's content may be tabbable depending on the content, but it's
            // not possibly to reliably detect the content of the frames. We always consider such
            // elements as non-tabbable.
            return false;
        }
        // In iOS, the browser only considers some specific elements as tabbable.
        if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
            return false;
        }
        if (nodeName === 'audio') {
            // Audio elements without controls enabled are never tabbable, regardless
            // of the tabindex attribute explicitly being set.
            if (!element.hasAttribute('controls')) {
                return false;
            }
            // Audio elements with controls are by default tabbable unless the
            // tabindex attribute is set to `-1` explicitly.
            return tabIndexValue !== -1;
        }
        if (nodeName === 'video') {
            // For all video elements, if the tabindex attribute is set to `-1`, the video
            // is not tabbable. Note: We cannot rely on the default `HTMLElement.tabIndex`
            // property as that one is set to `-1` in Chrome, Edge and Safari v13.1. The
            // tabindex attribute is the source of truth here.
            if (tabIndexValue === -1) {
                return false;
            }
            // If the tabindex is explicitly set, and not `-1` (as per check before), the
            // video element is always tabbable (regardless of whether it has controls or not).
            if (tabIndexValue !== null) {
                return true;
            }
            // Otherwise (when no explicit tabindex is set), a video is only tabbable if it
            // has controls enabled. Firefox is special as videos are always tabbable regardless
            // of whether there are controls or not.
            return this._platform.FIREFOX || element.hasAttribute('controls');
        }
        return element.tabIndex >= 0;
    }
    /**
     * Gets whether an element can be focused by the user.
     *
     * @param element Element to be checked.
     * @param config The config object with options to customize this method's behavior
     * @returns Whether the element is focusable.
     */
    isFocusable(element, config) {
        // Perform checks in order of left to most expensive.
        // Again, naive approach that does not capture many edge cases and browser quirks.
        return (isPotentiallyFocusable(element) &&
            !this.isDisabled(element) &&
            (config?.ignoreVisibility || this.isVisible(element)));
    }
}
InteractivityChecker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InteractivityChecker, deps: [{ token: i1.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
InteractivityChecker.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InteractivityChecker, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InteractivityChecker, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }]; } });
/**
 * Returns the frame element from a window object. Since browsers like MS Edge throw errors if
 * the frameElement property is being accessed from a different host address, this property
 * should be accessed carefully.
 */
function getFrameElement(window) {
    try {
        return window.frameElement;
    }
    catch {
        return null;
    }
}
/** Checks whether the specified element has any geometry / rectangles. */
function hasGeometry(element) {
    // Use logic from jQuery to check for an invisible element.
    // See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js#L12
    return !!(element.offsetWidth ||
        element.offsetHeight ||
        (typeof element.getClientRects === 'function' && element.getClientRects().length));
}
/** Gets whether an element's  */
function isNativeFormElement(element) {
    let nodeName = element.nodeName.toLowerCase();
    return (nodeName === 'input' ||
        nodeName === 'select' ||
        nodeName === 'button' ||
        nodeName === 'textarea');
}
/** Gets whether an element is an `<input type="hidden">`. */
function isHiddenInput(element) {
    return isInputElement(element) && element.type == 'hidden';
}
/** Gets whether an element is an anchor that has an href attribute. */
function isAnchorWithHref(element) {
    return isAnchorElement(element) && element.hasAttribute('href');
}
/** Gets whether an element is an input element. */
function isInputElement(element) {
    return element.nodeName.toLowerCase() == 'input';
}
/** Gets whether an element is an anchor element. */
function isAnchorElement(element) {
    return element.nodeName.toLowerCase() == 'a';
}
/** Gets whether an element has a valid tabindex. */
function hasValidTabIndex(element) {
    if (!element.hasAttribute('tabindex') || element.tabIndex === undefined) {
        return false;
    }
    let tabIndex = element.getAttribute('tabindex');
    return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
/**
 * Returns the parsed tabindex from the element attributes instead of returning the
 * evaluated tabindex from the browsers defaults.
 */
function getTabIndexValue(element) {
    if (!hasValidTabIndex(element)) {
        return null;
    }
    // See browser issue in Gecko https://bugzilla.mozilla.org/show_bug.cgi?id=1128054
    const tabIndex = parseInt(element.getAttribute('tabindex') || '', 10);
    return isNaN(tabIndex) ? -1 : tabIndex;
}
/** Checks whether the specified element is potentially tabbable on iOS */
function isPotentiallyTabbableIOS(element) {
    let nodeName = element.nodeName.toLowerCase();
    let inputType = nodeName === 'input' && element.type;
    return (inputType === 'text' ||
        inputType === 'password' ||
        nodeName === 'select' ||
        nodeName === 'textarea');
}
/**
 * Gets whether an element is potentially focusable without taking current visible/disabled state
 * into account.
 */
function isPotentiallyFocusable(element) {
    // Inputs are potentially focusable *unless* they're type="hidden".
    if (isHiddenInput(element)) {
        return false;
    }
    return (isNativeFormElement(element) ||
        isAnchorWithHref(element) ||
        element.hasAttribute('contenteditable') ||
        hasValidTabIndex(element));
}
/** Gets the parent window of a DOM node with regards of being inside of an iframe. */
function getWindow(node) {
    // ownerDocument is null if `node` itself *is* a document.
    return (node.ownerDocument && node.ownerDocument.defaultView) || window;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJhY3Rpdml0eS1jaGVja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9hMTF5L2ludGVyYWN0aXZpdHktY2hlY2tlci9pbnRlcmFjdGl2aXR5LWNoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7OztBQUV6Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxpQkFBaUI7SUFBOUI7UUFDRTs7V0FFRztRQUNILHFCQUFnQixHQUFZLEtBQUssQ0FBQztJQUNwQyxDQUFDO0NBQUE7QUFFRCxpRkFBaUY7QUFDakYsNkZBQTZGO0FBQzdGLGFBQWE7QUFFYjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQW9CLFNBQW1CO1FBQW5CLGNBQVMsR0FBVCxTQUFTLENBQVU7SUFBRyxDQUFDO0lBRTNDOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUFDLE9BQW9CO1FBQzdCLDRGQUE0RjtRQUM1RixzRkFBc0Y7UUFDdEYsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxDQUFDLE9BQW9CO1FBQzVCLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFVBQVUsQ0FBQyxPQUFvQjtRQUM3Qix1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMs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SSxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELE9BQU8sQ0FDTCxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7UUFDNUIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUM7UUFDdkMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQzFCLENBQUM7QUFDSixDQUFDO0FBRUQsc0ZBQXNGO0FBQ3RGLFNBQVMsU0FBUyxDQUFDLElBQWlCO0lBQ2xDLDBEQUEwRDtJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQztBQUMxRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBpc0ZvY3VzYWJsZSBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBJc0ZvY3VzYWJsZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNvdW50IGFuIGVsZW1lbnQgYXMgZm9jdXNhYmxlIGV2ZW4gaWYgaXQgaXMgbm90IGN1cnJlbnRseSB2aXNpYmxlLlxuICAgKi9cbiAgaWdub3JlVmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xufVxuXG4vLyBUaGUgSW50ZXJhY3Rpdml0eUNoZWNrZXIgbGVhbnMgaGVhdmlseSBvbiB0aGUgYWxseS5qcyBhY2Nlc3NpYmlsaXR5IHV0aWxpdGllcy5cbi8vIE1ldGhvZHMgbGlrZSBgaXNUYWJiYWJsZWAgYXJlIG9ubHkgY292ZXJpbmcgc3BlY2lmaWMgZWRnZS1jYXNlcyBmb3IgdGhlIGJyb3dzZXJzIHdoaWNoIGFyZVxuLy8gc3VwcG9ydGVkLlxuXG4vKipcbiAqIFV0aWxpdHkgZm9yIGNoZWNraW5nIHRoZSBpbnRlcmFjdGl2aXR5IG9mIGFuIGVsZW1lbnQsIHN1Y2ggYXMgd2hldGhlciBpcyBpcyBmb2N1c2FibGUgb3JcbiAqIHRhYmJhYmxlLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBJbnRlcmFjdGl2aXR5Q2hlY2tlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSkge31cblxuICAvKipcbiAgICogR2V0cyB3aGV0aGVyIGFuIGVsZW1lbnQgaXMgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZWxlbWVudCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIGlzRGlzYWJsZWQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICAvLyBUaGlzIGRvZXMgbm90IGNhcHR1cmUgc29tZSBjYXNlcywgc3VjaCBhcyBhIG5vbi1mb3JtIGNvbnRyb2wgd2l0aCBhIGRpc2FibGVkIGF0dHJpYnV0ZSBvclxuICAgIC8vIGEgZm9ybSBjb250cm9sIGluc2lkZSBvZiBhIGRpc2FibGVkIGZvcm0sIGJ1dCBzaG91bGQgY2FwdHVyZSB0aGUgbW9zdCBjb21tb24gY2FzZXMuXG4gICAgcmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGlzIHZpc2libGUgZm9yIHRoZSBwdXJwb3NlcyBvZiBpbnRlcmFjdGl2aXR5LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgY2FwdHVyZSBzdGF0ZXMgbGlrZSBgZGlzcGxheTogbm9uZWAgYW5kIGB2aXNpYmlsaXR5OiBoaWRkZW5gLCBidXQgbm90IHRoaW5ncyBsaWtlXG4gICAqIGJlaW5nIGNsaXBwZWQgYnkgYW4gYG92ZXJmbG93OiBoaWRkZW5gIHBhcmVudCBvciBiZWluZyBvdXRzaWRlIHRoZSB2aWV3cG9ydC5cbiAgICpcbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLlxuICAgKi9cbiAgaXNWaXNpYmxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc0dlb21ldHJ5KGVsZW1lbnQpICYmIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkudmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGNhbiBiZSByZWFjaGVkIHZpYSBUYWIga2V5LlxuICAgKiBBc3N1bWVzIHRoYXQgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiBjaGVja2VkIHdpdGggaXNGb2N1c2FibGUuXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZWxlbWVudCBpcyB0YWJiYWJsZS5cbiAgICovXG4gIGlzVGFiYmFibGUoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICAvLyBOb3RoaW5nIGlzIHRhYmJhYmxlIG9uIHRoZSBzZXJ2ZXIg8J+YjlxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhbWVFbGVtZW50ID0gZ2V0RnJhbWVFbGVtZW50KGdldFdpbmRvdyhlbGVtZW50KSk7XG5cbiAgICBpZiAoZnJhbWVFbGVtZW50KSB7XG4gICAgICAvLyBGcmFtZSBlbGVtZW50cyBpbmhlcml0IHRoZWlyIHRhYmluZGV4IG9udG8gYWxsIGNoaWxkIGVsZW1lbnRzLlxuICAgICAgaWYgKGdldFRhYkluZGV4VmFsdWUoZnJhbWVFbGVtZW50KSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBCcm93c2VycyBkaXNhYmxlIHRhYmJpbmcgdG8gYW4gZWxlbWVudCBpbnNpZGUgb2YgYW4gaW52aXNpYmxlIGZyYW1lLlxuICAgICAgaWYgKCF0aGlzLmlzVmlzaWJsZShmcmFtZUVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IHRhYkluZGV4VmFsdWUgPSBnZXRUYWJJbmRleFZhbHVlKGVsZW1lbnQpO1xuXG4gICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgcmV0dXJuIHRhYkluZGV4VmFsdWUgIT09IC0xO1xuICAgIH1cblxuICAgIGlmIChub2RlTmFtZSA9PT0gJ2lmcmFtZScgfHwgbm9kZU5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBUaGUgZnJhbWUgb3Igb2JqZWN0J3MgY29udGVudCBtYXkgYmUgdGFiYmFibGUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZW50LCBidXQgaXQnc1xuICAgICAgLy8gbm90IHBvc3NpYmx5IHRvIHJlbGlhYmx5IGRldGVjdCB0aGUgY29udGVudCBvZiB0aGUgZnJhbWVzLiBXZSBhbHdheXMgY29uc2lkZXIgc3VjaFxuICAgICAgLy8gZWxlbWVudHMgYXMgbm9uLXRhYmJhYmxlLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEluIGlPUywgdGhlIGJyb3dzZXIgb25seSBjb25zaWRlcnMgc29tZSBzcGVjaWZpYyBlbGVtZW50cyBhcyB0YWJiYWJsZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uV0VCS0lUICYmIHRoaXMuX3BsYXRmb3JtLklPUyAmJiAhaXNQb3RlbnRpYWxseVRhYmJhYmxlSU9TKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG5vZGVOYW1lID09PSAnYXVkaW8nKSB7XG4gICAgICAvLyBBdWRpbyBlbGVtZW50cyB3aXRob3V0IGNvbnRyb2xzIGVuYWJsZWQgYXJlIG5ldmVyIHRhYmJhYmxlLCByZWdhcmRsZXNzXG4gICAgICAvLyBvZiB0aGUgdGFiaW5kZXggYXR0cmlidXRlIGV4cGxpY2l0bHkgYmVpbmcgc2V0LlxuICAgICAgaWYgKCFlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnY29udHJvbHMnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBdWRpbyBlbGVtZW50cyB3aXRoIGNvbnRyb2xzIGFyZSBieSBkZWZhdWx0IHRhYmJhYmxlIHVubGVzcyB0aGVcbiAgICAgIC8vIHRhYmluZGV4IGF0dHJpYnV0ZSBpcyBzZXQgdG8gYC0xYCBleHBsaWNpdGx5LlxuICAgICAgcmV0dXJuIHRhYkluZGV4VmFsdWUgIT09IC0xO1xuICAgIH1cblxuICAgIGlmIChub2RlTmFtZSA9PT0gJ3ZpZGVvJykge1xuICAgICAgLy8gRm9yIGFsbCB2aWRlbyBlbGVtZW50cywgaWYgdGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBpcyBzZXQgdG8gYC0xYCwgdGhlIHZpZGVvXG4gICAgICAvLyBpcyBub3QgdGFiYmFibGUuIE5vdGU6IFdlIGNhbm5vdCByZWx5IG9uIHRoZSBkZWZhdWx0IGBIVE1MRWxlbWVudC50YWJJbmRleGBcbiAgICAgIC8vIHByb3BlcnR5IGFzIHRoYXQgb25lIGlzIHNldCB0byBgLTFgIGluIENocm9tZSwgRWRnZSBhbmQgU2FmYXJpIHYxMy4xLiBUaGVcbiAgICAgIC8vIHRhYmluZGV4IGF0dHJpYnV0ZSBpcyB0aGUgc291cmNlIG9mIHRydXRoIGhlcmUuXG4gICAgICBpZiAodGFiSW5kZXhWYWx1ZSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlIHRhYmluZGV4IGlzIGV4cGxpY2l0bHkgc2V0LCBhbmQgbm90IGAtMWAgKGFzIHBlciBjaGVjayBiZWZvcmUpLCB0aGVcbiAgICAgIC8vIHZpZGVvIGVsZW1lbnQgaXMgYWx3YXlzIHRhYmJhYmxlIChyZWdhcmRsZXNzIG9mIHdoZXRoZXIgaXQgaGFzIGNvbnRyb2xzIG9yIG5vdCkuXG4gICAgICBpZiAodGFiSW5kZXhWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSAod2hlbiBubyBleHBsaWNpdCB0YWJpbmRleCBpcyBzZXQpLCBhIHZpZGVvIGlzIG9ubHkgdGFiYmFibGUgaWYgaXRcbiAgICAgIC8vIGhhcyBjb250cm9scyBlbmFibGVkLiBGaXJlZm94IGlzIHNwZWNpYWwgYXMgdmlkZW9zIGFyZSBhbHdheXMgdGFiYmFibGUgcmVnYXJkbGVzc1xuICAgICAgLy8gb2Ygd2hldGhlciB0aGVyZSBhcmUgY29udHJvbHMgb3Igbm90LlxuICAgICAgcmV0dXJuIHRoaXMuX3BsYXRmb3JtLkZJUkVGT1ggfHwgZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2NvbnRyb2xzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQudGFiSW5kZXggPj0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHdoZXRoZXIgYW4gZWxlbWVudCBjYW4gYmUgZm9jdXNlZCBieSB0aGUgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCB0byBiZSBjaGVja2VkLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWcgb2JqZWN0IHdpdGggb3B0aW9ucyB0byBjdXN0b21pemUgdGhpcyBtZXRob2QncyBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIGZvY3VzYWJsZS5cbiAgICovXG4gIGlzRm9jdXNhYmxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjb25maWc/OiBJc0ZvY3VzYWJsZUNvbmZpZyk6IGJvb2xlYW4ge1xuICAgIC8vIFBlcmZvcm0gY2hlY2tzIGluIG9yZGVyIG9mIGxlZnQgdG8gbW9zdCBleHBlbnNpdmUuXG4gICAgLy8gQWdhaW4sIG5haXZlIGFwcHJvYWNoIHRoYXQgZG9lcyBub3QgY2FwdHVyZSBtYW55IGVkZ2UgY2FzZXMgYW5kIGJyb3dzZXIgcXVpcmtzLlxuICAgIHJldHVybiAoXG4gICAgICBpc1BvdGVudGlhbGx5Rm9jdXNhYmxlKGVsZW1lbnQpICYmXG4gICAgICAhdGhpcy5pc0Rpc2FibGVkKGVsZW1lbnQpICYmXG4gICAgICAoY29uZmlnPy5pZ25vcmVWaXNpYmlsaXR5IHx8IHRoaXMuaXNWaXNpYmxlKGVsZW1lbnQpKVxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmcmFtZSBlbGVtZW50IGZyb20gYSB3aW5kb3cgb2JqZWN0LiBTaW5jZSBicm93c2VycyBsaWtlIE1TIEVkZ2UgdGhyb3cgZXJyb3JzIGlmXG4gKiB0aGUgZnJhbWVFbGVtZW50IHByb3BlcnR5IGlzIGJlaW5nIGFjY2Vzc2VkIGZyb20gYSBkaWZmZXJlbnQgaG9zdCBhZGRyZXNzLCB0aGlzIHByb3BlcnR5XG4gKiBzaG91bGQgYmUgYWNjZXNzZWQgY2FyZWZ1bGx5LlxuICovXG5mdW5jdGlvbiBnZXRGcmFtZUVsZW1lbnQod2luZG93OiBXaW5kb3cpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gd2luZG93LmZyYW1lRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBoYXMgYW55IGdlb21ldHJ5IC8gcmVjdGFuZ2xlcy4gKi9cbmZ1bmN0aW9uIGhhc0dlb21ldHJ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIC8vIFVzZSBsb2dpYyBmcm9tIGpRdWVyeSB0byBjaGVjayBmb3IgYW4gaW52aXNpYmxlIGVsZW1lbnQuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iL21hc3Rlci9zcmMvY3NzL2hpZGRlblZpc2libGVTZWxlY3RvcnMuanMjTDEyXG4gIHJldHVybiAhIShcbiAgICBlbGVtZW50Lm9mZnNldFdpZHRoIHx8XG4gICAgZWxlbWVudC5vZmZzZXRIZWlnaHQgfHxcbiAgICAodHlwZW9mIGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMgPT09ICdmdW5jdGlvbicgJiYgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aClcbiAgKTtcbn1cblxuLyoqIEdldHMgd2hldGhlciBhbiBlbGVtZW50J3MgICovXG5mdW5jdGlvbiBpc05hdGl2ZUZvcm1FbGVtZW50KGVsZW1lbnQ6IE5vZGUpIHtcbiAgbGV0IG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKFxuICAgIG5vZGVOYW1lID09PSAnaW5wdXQnIHx8XG4gICAgbm9kZU5hbWUgPT09ICdzZWxlY3QnIHx8XG4gICAgbm9kZU5hbWUgPT09ICdidXR0b24nIHx8XG4gICAgbm9kZU5hbWUgPT09ICd0ZXh0YXJlYSdcbiAgKTtcbn1cblxuLyoqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGlzIGFuIGA8aW5wdXQgdHlwZT1cImhpZGRlblwiPmAuICovXG5mdW5jdGlvbiBpc0hpZGRlbklucHV0KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0lucHV0RWxlbWVudChlbGVtZW50KSAmJiBlbGVtZW50LnR5cGUgPT0gJ2hpZGRlbic7XG59XG5cbi8qKiBHZXRzIHdoZXRoZXIgYW4gZWxlbWVudCBpcyBhbiBhbmNob3IgdGhhdCBoYXMgYW4gaHJlZiBhdHRyaWJ1dGUuICovXG5mdW5jdGlvbiBpc0FuY2hvcldpdGhIcmVmKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0FuY2hvckVsZW1lbnQoZWxlbWVudCkgJiYgZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKTtcbn1cblxuLyoqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGlzIGFuIGlucHV0IGVsZW1lbnQuICovXG5mdW5jdGlvbiBpc0lucHV0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IGVsZW1lbnQgaXMgSFRNTElucHV0RWxlbWVudCB7XG4gIHJldHVybiBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2lucHV0Jztcbn1cblxuLyoqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGlzIGFuIGFuY2hvciBlbGVtZW50LiAqL1xuZnVuY3Rpb24gaXNBbmNob3JFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogZWxlbWVudCBpcyBIVE1MQW5jaG9yRWxlbWVudCB7XG4gIHJldHVybiBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2EnO1xufVxuXG4vKiogR2V0cyB3aGV0aGVyIGFuIGVsZW1lbnQgaGFzIGEgdmFsaWQgdGFiaW5kZXguICovXG5mdW5jdGlvbiBoYXNWYWxpZFRhYkluZGV4KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIGlmICghZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykgfHwgZWxlbWVudC50YWJJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHRhYkluZGV4ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gIHJldHVybiAhISh0YWJJbmRleCAmJiAhaXNOYU4ocGFyc2VJbnQodGFiSW5kZXgsIDEwKSkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHBhcnNlZCB0YWJpbmRleCBmcm9tIHRoZSBlbGVtZW50IGF0dHJpYnV0ZXMgaW5zdGVhZCBvZiByZXR1cm5pbmcgdGhlXG4gKiBldmFsdWF0ZWQgdGFiaW5kZXggZnJvbSB0aGUgYnJvd3NlcnMgZGVmYXVsdHMuXG4gKi9cbmZ1bmN0aW9uIGdldFRhYkluZGV4VmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKCFoYXNWYWxpZFRhYkluZGV4KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTZWUgYnJvd3NlciBpc3N1ZSBpbiBHZWNrbyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMTI4MDU0XG4gIGNvbnN0IHRhYkluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgfHwgJycsIDEwKTtcblxuICByZXR1cm4gaXNOYU4odGFiSW5kZXgpID8gLTEgOiB0YWJJbmRleDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpcyBwb3RlbnRpYWxseSB0YWJiYWJsZSBvbiBpT1MgKi9cbmZ1bmN0aW9uIGlzUG90ZW50aWFsbHlUYWJiYWJsZUlPUyhlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICBsZXQgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGxldCBpbnB1dFR5cGUgPSBub2RlTmFtZSA9PT0gJ2lucHV0JyAmJiAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS50eXBlO1xuXG4gIHJldHVybiAoXG4gICAgaW5wdXRUeXBlID09PSAndGV4dCcgfHxcbiAgICBpbnB1dFR5cGUgPT09ICdwYXNzd29yZCcgfHxcbiAgICBub2RlTmFtZSA9PT0gJ3NlbGVjdCcgfHxcbiAgICBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJ1xuICApO1xufVxuXG4vKipcbiAqIEdldHMgd2hldGhlciBhbiBlbGVtZW50IGlzIHBvdGVudGlhbGx5IGZvY3VzYWJsZSB3aXRob3V0IHRha2luZyBjdXJyZW50IHZpc2libGUvZGlzYWJsZWQgc3RhdGVcbiAqIGludG8gYWNjb3VudC5cbiAqL1xuZnVuY3Rpb24gaXNQb3RlbnRpYWxseUZvY3VzYWJsZShlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAvLyBJbnB1dHMgYXJlIHBvdGVudGlhbGx5IGZvY3VzYWJsZSAqdW5sZXNzKiB0aGV5J3JlIHR5cGU9XCJoaWRkZW5cIi5cbiAgaWYgKGlzSGlkZGVuSW5wdXQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIGlzTmF0aXZlRm9ybUVsZW1lbnQoZWxlbWVudCkgfHxcbiAgICBpc0FuY2hvcldpdGhIcmVmKGVsZW1lbnQpIHx8XG4gICAgZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIHx8XG4gICAgaGFzVmFsaWRUYWJJbmRleChlbGVtZW50KVxuICApO1xufVxuXG4vKiogR2V0cyB0aGUgcGFyZW50IHdpbmRvdyBvZiBhIERPTSBub2RlIHdpdGggcmVnYXJkcyBvZiBiZWluZyBpbnNpZGUgb2YgYW4gaWZyYW1lLiAqL1xuZnVuY3Rpb24gZ2V0V2luZG93KG5vZGU6IEhUTUxFbGVtZW50KTogV2luZG93IHtcbiAgLy8gb3duZXJEb2N1bWVudCBpcyBudWxsIGlmIGBub2RlYCBpdHNlbGYgKmlzKiBhIGRvY3VtZW50LlxuICByZXR1cm4gKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIHx8IHdpbmRvdztcbn1cbiJdfQ==