/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Injectable, Input, NgZone, } from '@angular/core';
import { take } from 'rxjs/operators';
import { InteractivityChecker } from '../interactivity-checker/interactivity-checker';
import * as i0 from "@angular/core";
import * as i1 from "../interactivity-checker/interactivity-checker";
/**
 * Class that allows for trapping focus within a DOM element.
 *
 * This class currently uses a relatively simple approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like `tabIndex > 0`, flex `order`, and shadow roots can cause the two to be misaligned.
 *
 * @deprecated Use `ConfigurableFocusTrap` instead.
 * @breaking-change 11.0.0
 */
export class FocusTrap {
    constructor(_element, _checker, _ngZone, _document, deferAnchors = false) {
        this._element = _element;
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._document = _document;
        this._hasAttached = false;
        // Event listeners for the anchors. Need to be regular functions so that we can unbind them later.
        this.startAnchorListener = () => this.focusLastTabbableElement();
        this.endAnchorListener = () => this.focusFirstTabbableElement();
        this._enabled = true;
        if (!deferAnchors) {
            this.attachAnchors();
        }
    }
    /** Whether the focus trap is active. */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        if (this._startAnchor && this._endAnchor) {
            this._toggleAnchorTabIndex(value, this._startAnchor);
            this._toggleAnchorTabIndex(value, this._endAnchor);
        }
    }
    /** Destroys the focus trap by cleaning up the anchors. */
    destroy() {
        const startAnchor = this._startAnchor;
        const endAnchor = this._endAnchor;
        if (startAnchor) {
            startAnchor.removeEventListener('focus', this.startAnchorListener);
            startAnchor.remove();
        }
        if (endAnchor) {
            endAnchor.removeEventListener('focus', this.endAnchorListener);
            endAnchor.remove();
        }
        this._startAnchor = this._endAnchor = null;
        this._hasAttached = false;
    }
    /**
     * Inserts the anchors into the DOM. This is usually done automatically
     * in the constructor, but can be deferred for cases like directives with `*ngIf`.
     * @returns Whether the focus trap managed to attach successfully. This may not be the case
     * if the target element isn't currently in the DOM.
     */
    attachAnchors() {
        // If we're not on the browser, there can be no focus to trap.
        if (this._hasAttached) {
            return true;
        }
        this._ngZone.runOutsideAngular(() => {
            if (!this._startAnchor) {
                this._startAnchor = this._createAnchor();
                this._startAnchor.addEventListener('focus', this.startAnchorListener);
            }
            if (!this._endAnchor) {
                this._endAnchor = this._createAnchor();
                this._endAnchor.addEventListener('focus', this.endAnchorListener);
            }
        });
        if (this._element.parentNode) {
            this._element.parentNode.insertBefore(this._startAnchor, this._element);
            this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
            this._hasAttached = true;
        }
        return this._hasAttached;
    }
    /**
     * Waits for the zone to stabilize, then focuses the first tabbable element.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfully.
     */
    focusInitialElementWhenReady(options) {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusInitialElement(options)));
        });
    }
    /**
     * Waits for the zone to stabilize, then focuses
     * the first tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfully.
     */
    focusFirstTabbableElementWhenReady(options) {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusFirstTabbableElement(options)));
        });
    }
    /**
     * Waits for the zone to stabilize, then focuses
     * the last tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfully.
     */
    focusLastTabbableElementWhenReady(options) {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusLastTabbableElement(options)));
        });
    }
    /**
     * Get the specified boundary element of the trapped region.
     * @param bound The boundary to get (start or end of trapped region).
     * @returns The boundary element.
     */
    _getRegionBoundary(bound) {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        const markers = this._element.querySelectorAll(`[cdk-focus-region-${bound}], ` + `[cdkFocusRegion${bound}], ` + `[cdk-focus-${bound}]`);
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            for (let i = 0; i < markers.length; i++) {
                // @breaking-change 8.0.0
                if (markers[i].hasAttribute(`cdk-focus-${bound}`)) {
                    console.warn(`Found use of deprecated attribute 'cdk-focus-${bound}', ` +
                        `use 'cdkFocusRegion${bound}' instead. The deprecated ` +
                        `attribute will be removed in 8.0.0.`, markers[i]);
                }
                else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) {
                    console.warn(`Found use of deprecated attribute 'cdk-focus-region-${bound}', ` +
                        `use 'cdkFocusRegion${bound}' instead. The deprecated attribute ` +
                        `will be removed in 8.0.0.`, markers[i]);
                }
            }
        }
        if (bound == 'start') {
            return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
        }
        return markers.length
            ? markers[markers.length - 1]
            : this._getLastTabbableElement(this._element);
    }
    /**
     * Focuses the element that should be focused when the focus trap is initialized.
     * @returns Whether focus was moved successfully.
     */
    focusInitialElement(options) {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        const redirectToElement = this._element.querySelector(`[cdk-focus-initial], ` + `[cdkFocusInitial]`);
        if (redirectToElement) {
            // @breaking-change 8.0.0
            if ((typeof ngDevMode === 'undefined' || ngDevMode) &&
                redirectToElement.hasAttribute(`cdk-focus-initial`)) {
                console.warn(`Found use of deprecated attribute 'cdk-focus-initial', ` +
                    `use 'cdkFocusInitial' instead. The deprecated attribute ` +
                    `will be removed in 8.0.0`, redirectToElement);
            }
            // Warn the consumer if the element they've pointed to
            // isn't focusable, when not in production mode.
            if ((typeof ngDevMode === 'undefined' || ngDevMode) &&
                !this._checker.isFocusable(redirectToElement)) {
                console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
            }
            if (!this._checker.isFocusable(redirectToElement)) {
                const focusableChild = this._getFirstTabbableElement(redirectToElement);
                focusableChild?.focus(options);
                return !!focusableChild;
            }
            redirectToElement.focus(options);
            return true;
        }
        return this.focusFirstTabbableElement(options);
    }
    /**
     * Focuses the first tabbable element within the focus trap region.
     * @returns Whether focus was moved successfully.
     */
    focusFirstTabbableElement(options) {
        const redirectToElement = this._getRegionBoundary('start');
        if (redirectToElement) {
            redirectToElement.focus(options);
        }
        return !!redirectToElement;
    }
    /**
     * Focuses the last tabbable element within the focus trap region.
     * @returns Whether focus was moved successfully.
     */
    focusLastTabbableElement(options) {
        const redirectToElement = this._getRegionBoundary('end');
        if (redirectToElement) {
            redirectToElement.focus(options);
        }
        return !!redirectToElement;
    }
    /**
     * Checks whether the focus trap has successfully been attached.
     */
    hasAttached() {
        return this._hasAttached;
    }
    /** Get the first tabbable element from a DOM subtree (inclusive). */
    _getFirstTabbableElement(root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        const children = root.children;
        for (let i = 0; i < children.length; i++) {
            const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE
                ? this._getFirstTabbableElement(children[i])
                : null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    }
    /** Get the last tabbable element from a DOM subtree (inclusive). */
    _getLastTabbableElement(root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in reverse DOM order.
        const children = root.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE
                ? this._getLastTabbableElement(children[i])
                : null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    }
    /** Creates an anchor element. */
    _createAnchor() {
        const anchor = this._document.createElement('div');
        this._toggleAnchorTabIndex(this._enabled, anchor);
        anchor.classList.add('cdk-visually-hidden');
        anchor.classList.add('cdk-focus-trap-anchor');
        anchor.setAttribute('aria-hidden', 'true');
        return anchor;
    }
    /**
     * Toggles the `tabindex` of an anchor, based on the enabled state of the focus trap.
     * @param isEnabled Whether the focus trap is enabled.
     * @param anchor Anchor on which to toggle the tabindex.
     */
    _toggleAnchorTabIndex(isEnabled, anchor) {
        // Remove the tabindex completely, rather than setting it to -1, because if the
        // element has a tabindex, the user might still hit it when navigating with the arrow keys.
        isEnabled ? anchor.setAttribute('tabindex', '0') : anchor.removeAttribute('tabindex');
    }
    /**
     * Toggles the`tabindex` of both anchors to either trap Tab focus or allow it to escape.
     * @param enabled: Whether the anchors should trap Tab.
     */
    toggleAnchors(enabled) {
        if (this._startAnchor && this._endAnchor) {
            this._toggleAnchorTabIndex(enabled, this._startAnchor);
            this._toggleAnchorTabIndex(enabled, this._endAnchor);
        }
    }
    /** Executes a function when the zone is stable. */
    _executeOnStable(fn) {
        if (this._ngZone.isStable) {
            fn();
        }
        else {
            this._ngZone.onStable.pipe(take(1)).subscribe(fn);
        }
    }
}
/**
 * Factory that allows easy instantiation of focus traps.
 * @deprecated Use `ConfigurableFocusTrapFactory` instead.
 * @breaking-change 11.0.0
 */
export class FocusTrapFactory {
    constructor(_checker, _ngZone, _document) {
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._document = _document;
    }
    /**
     * Creates a focus-trapped region around the given element.
     * @param element The element around which focus will be trapped.
     * @param deferCaptureElements Defers the creation of focus-capturing elements to be done
     *     manually by the user.
     * @returns The created focus trap instance.
     */
    create(element, deferCaptureElements = false) {
        return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements);
    }
}
FocusTrapFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: FocusTrapFactory, deps: [{ token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
FocusTrapFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: FocusTrapFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: FocusTrapFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/** Directive for trapping focus within a region. */
export class CdkTrapFocus {
    constructor(_elementRef, _focusTrapFactory, 
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 13.0.0
     */
    _document) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        /** Previously focused element to restore focus to upon destroy when using autoCapture. */
        this._previouslyFocusedElement = null;
        this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
    /** Whether the focus trap is active. */
    get enabled() {
        return this.focusTrap.enabled;
    }
    set enabled(value) {
        this.focusTrap.enabled = coerceBooleanProperty(value);
    }
    /**
     * Whether the directive should automatically move focus into the trapped region upon
     * initialization and return focus to the previous activeElement upon destruction.
     */
    get autoCapture() {
        return this._autoCapture;
    }
    set autoCapture(value) {
        this._autoCapture = coerceBooleanProperty(value);
    }
    ngOnDestroy() {
        this.focusTrap.destroy();
        // If we stored a previously focused element when using autoCapture, return focus to that
        // element now that the trapped region is being destroyed.
        if (this._previouslyFocusedElement) {
            this._previouslyFocusedElement.focus();
            this._previouslyFocusedElement = null;
        }
    }
    ngAfterContentInit() {
        this.focusTrap.attachAnchors();
        if (this.autoCapture) {
            this._captureFocus();
        }
    }
    ngDoCheck() {
        if (!this.focusTrap.hasAttached()) {
            this.focusTrap.attachAnchors();
        }
    }
    ngOnChanges(changes) {
        const autoCaptureChange = changes['autoCapture'];
        if (autoCaptureChange &&
            !autoCaptureChange.firstChange &&
            this.autoCapture &&
            this.focusTrap.hasAttached()) {
            this._captureFocus();
        }
    }
    _captureFocus() {
        this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
        this.focusTrap.focusInitialElementWhenReady();
    }
}
CdkTrapFocus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTrapFocus, deps: [{ token: i0.ElementRef }, { token: FocusTrapFactory }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
CdkTrapFocus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: { enabled: ["cdkTrapFocus", "enabled"], autoCapture: ["cdkTrapFocusAutoCapture", "autoCapture"] }, exportAs: ["cdkTrapFocus"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTrapFocus]',
                    exportAs: 'cdkTrapFocus',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { enabled: [{
                type: Input,
                args: ['cdkTrapFocus']
            }], autoCapture: [{
                type: Input,
                args: ['cdkTrapFocusAutoCapture']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtdHJhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9mb2N1cy10cmFwL2ZvY3VzLXRyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sR0FLUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7OztBQUVwRjs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLE9BQU8sU0FBUztJQXVCcEIsWUFDVyxRQUFxQixFQUN0QixRQUE4QixFQUM3QixPQUFlLEVBQ2YsU0FBbUIsRUFDNUIsWUFBWSxHQUFHLEtBQUs7UUFKWCxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQXNCO1FBQzdCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBeEJ0QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUU3QixrR0FBa0c7UUFDeEYsd0JBQW1CLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDNUQsc0JBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFjM0QsYUFBUSxHQUFZLElBQUksQ0FBQztRQVNqQyxJQUFJLENBQUMsWUFBWSxF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RUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFL0IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsSUFDRSxpQkFBaUI7WUFDakIsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXO1lBQzlCLElBQUksQ0FBQyxXQUFXO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQzVCO1lBQ0EsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLGlDQUFpQyxFQUFFLENBQUM7UUFDckUsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ2hELENBQUM7O3lHQWxGVSxZQUFZLDRDQStCTSxnQkFBZ0IsYUFLbkMsUUFBUTs2RkFwQ1AsWUFBWTsyRkFBWixZQUFZO2tCQUp4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxjQUFjO2lCQUN6QjttRkFnQzhCLGdCQUFnQjswQkFLMUMsTUFBTTsyQkFBQyxRQUFROzRDQTNCZCxPQUFPO3NCQURWLEtBQUs7dUJBQUMsY0FBYztnQkFhakIsV0FBVztzQkFEZCxLQUFLO3VCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb219IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgRG9DaGVjayxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25DaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtJbnRlcmFjdGl2aXR5Q2hlY2tlcn0gZnJvbSAnLi4vaW50ZXJhY3Rpdml0eS1jaGVja2VyL2ludGVyYWN0aXZpdHktY2hlY2tlcic7XG5cbi8qKlxuICogQ2xhc3MgdGhhdCBhbGxvd3MgZm9yIHRyYXBwaW5nIGZvY3VzIHdpdGhpbiBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgY2xhc3MgY3VycmVudGx5IHVzZXMgYSByZWxhdGl2ZWx5IHNpbXBsZSBhcHByb2FjaCB0byBmb2N1cyB0cmFwcGluZy5cbiAqIEl0IGFzc3VtZXMgdGhhdCB0aGUgdGFiIG9yZGVyIGlzIHRoZSBzYW1lIGFzIERPTSBvcmRlciwgd2hpY2ggaXMgbm90IG5lY2Vzc2FyaWx5IHRydWUuXG4gKiBUaGluZ3MgbGlrZSBgdGFiSW5kZXggPiAwYCwgZmxleCBgb3JkZXJgLCBhbmQgc2hhZG93IHJvb3RzIGNhbiBjYXVzZSB0aGUgdHdvIHRvIGJlIG1pc2FsaWduZWQuXG4gKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBDb25maWd1cmFibGVGb2N1c1RyYXBgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICovXG5leHBvcnQgY2xhc3MgRm9jdXNUcmFwIHtcbiAgcHJpdmF0ZSBfc3RhcnRBbmNob3I6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgcHJpdmF0ZSBfZW5kQW5jaG9yOiBIVE1MRWxlbWVudCB8IG51bGw7XG4gIHByaXZhdGUgX2hhc0F0dGFjaGVkID0gZmFsc2U7XG5cbiAgLy8gRXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgYW5jaG9ycy4gTmVlZCB0byBiZSByZWd1bGFyIGZ1bmN0aW9ucyBzbyB0aGF0IHdlIGNhbiB1bmJpbmQgdGhlbSBsYXRlci5cbiAgcHJvdGVjdGVkIHN0YXJ0QW5jaG9yTGlzdGVuZXIgPSAoKSA9PiB0aGlzLmZvY3VzTGFzdFRhYmJhYmxlRWxlbWVudCgpO1xuICBwcm90ZWN0ZWQgZW5kQW5jaG9yTGlzdGVuZXIgPSAoKSA9PiB0aGlzLmZvY3VzRmlyc3RUYWJiYWJsZUVsZW1lbnQoKTtcblxuICAvKiogV2hldGhlciB0aGUgZm9jdXMgdHJhcCBpcyBhY3RpdmUuICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICB9XG4gIHNldCBlbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMuX3N0YXJ0QW5jaG9yICYmIHRoaXMuX2VuZEFuY2hvcikge1xuICAgICAgdGhpcy5fdG9nZ2xlQW5jaG9yVGFiSW5kZXgodmFsdWUsIHRoaXMuX3N0YXJ0QW5jaG9yKTtcbiAgICAgIHRoaXMuX3RvZ2dsZUFuY2hvclRhYkluZGV4KHZhbHVlLCB0aGlzLl9lbmRBbmNob3IpO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IF9lbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBwcml2YXRlIF9jaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcmVhZG9ubHkgX2RvY3VtZW50OiBEb2N1bWVudCxcbiAgICBkZWZlckFuY2hvcnMgPSBmYWxzZSxcbiAgKSB7XG4gICAgaWYgKCFkZWZlckFuY2hvcnMpIHtcbiAgICAgIHRoaXMuYXR0YWNoQW5jaG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgZm9jdXMgdHJhcCBieSBjbGVhbmluZyB1cCB0aGUgYW5jaG9ycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzdGFydEFuY2hvciA9IHRoaXMuX3N0YXJ0QW5jaG9yO1xuICAgIGNvbnN0IGVuZEFuY2hvciA9IHRoaXMuX2VuZEFuY2hvcjtcblxuICAgIGlmIChzdGFydEFuY2hvcikge1xuICAgICAgc3RhcnRBbmNob3IucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLnN0YXJ0QW5jaG9yTGlzdGVuZXIpO1xuICAgICAgc3RhcnRBbmNob3IucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGVuZEFuY2hvcikge1xuICAgICAgZW5kQW5jaG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5lbmRBbmNob3JMaXN0ZW5lcik7XG4gICAgICBlbmRBbmNob3IucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhcnRBbmNob3IgPSB0aGlzLl9lbmRBbmNob3IgPSBudWxsO1xuICAgIHRoaXMuX2hhc0F0dGFjaGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyB0aGUgYW5jaG9ycyBpbnRvIHRoZSBET00uIFRoaXMgaXMgdXN1YWxseSBkb25lIGF1dG9tYXRpY2FsbHlcbiAgICogaW4gdGhlIGNvbnN0cnVjdG9yLCBidXQgY2FuIGJlIGRlZmVycmVkIGZvciBjYXNlcyBsaWtlIGRpcmVjdGl2ZXMgd2l0aCBgKm5nSWZgLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBmb2N1cyB0cmFwIG1hbmFnZWQgdG8gYXR0YWNoIHN1Y2Nlc3NmdWxseS4gVGhpcyBtYXkgbm90IGJlIHRoZSBjYXNlXG4gICAqIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBpc24ndCBjdXJyZW50bHkgaW4gdGhlIERPTS5cbiAgICovXG4gIGF0dGFjaEFuY2hvcnMoKTogYm9vbGVhbiB7XG4gICAgLy8gSWYgd2UncmUgbm90IG9uIHRoZSBicm93c2VyLCB0aGVyZSBjYW4gYmUgbm8gZm9jdXMgdG8gdHJhcC5cbiAgICBpZiAodGhpcy5faGFzQXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3N0YXJ0QW5jaG9yKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0QW5jaG9yID0gdGhpcy5fY3JlYXRlQW5jaG9yKCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0QW5jaG9yIS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuc3RhcnRBbmNob3JMaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fZW5kQW5jaG9yKSB7XG4gICAgICAgIHRoaXMuX2VuZEFuY2hvciA9IHRoaXMuX2NyZWF0ZUFuY2hvcigpO1xuICAgICAgICB0aGlzLl9lbmRBbmNob3IhLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5lbmRBbmNob3JMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuX3N0YXJ0QW5jaG9yISwgdGhpcy5fZWxlbWVudCk7XG4gICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuX2VuZEFuY2hvciEsIHRoaXMuX2VsZW1lbnQubmV4dFNpYmxpbmcpO1xuICAgICAgdGhpcy5faGFzQXR0YWNoZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9oYXNBdHRhY2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIHpvbmUgdG8gc3RhYmlsaXplLCB0aGVuIGZvY3VzZXMgdGhlIGZpcnN0IHRhYmJhYmxlIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIGJvb2xlYW4sIGRlcGVuZGluZ1xuICAgKiBvbiB3aGV0aGVyIGZvY3VzIHdhcyBtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gICAqL1xuICBmb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLl9leGVjdXRlT25TdGFibGUoKCkgPT4gcmVzb2x2ZSh0aGlzLmZvY3VzSW5pdGlhbEVsZW1lbnQob3B0aW9ucykpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIHpvbmUgdG8gc3RhYmlsaXplLCB0aGVuIGZvY3VzZXNcbiAgICogdGhlIGZpcnN0IHRhYmJhYmxlIGVsZW1lbnQgd2l0aGluIHRoZSBmb2N1cyB0cmFwIHJlZ2lvbi5cbiAgICogQHJldHVybnMgUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIGEgYm9vbGVhbiwgZGVwZW5kaW5nXG4gICAqIG9uIHdoZXRoZXIgZm9jdXMgd2FzIG1vdmVkIHN1Y2Nlc3NmdWxseS5cbiAgICovXG4gIGZvY3VzRmlyc3RUYWJiYWJsZUVsZW1lbnRXaGVuUmVhZHkob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVPblN0YWJsZSgoKSA9PiByZXNvbHZlKHRoaXMuZm9jdXNGaXJzdFRhYmJhYmxlRWxlbWVudChvcHRpb25zKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgem9uZSB0byBzdGFiaWxpemUsIHRoZW4gZm9jdXNlc1xuICAgKiB0aGUgbGFzdCB0YWJiYWJsZSBlbGVtZW50IHdpdGhpbiB0aGUgZm9jdXMgdHJhcCByZWdpb24uXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIGJvb2xlYW4sIGRlcGVuZGluZ1xuICAgKiBvbiB3aGV0aGVyIGZvY3VzIHdhcyBtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gICAqL1xuICBmb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnRXaGVuUmVhZHkob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVPblN0YWJsZSgoKSA9PiByZXNvbHZlKHRoaXMuZm9jdXNMYXN0VGFiYmFibGVFbGVtZW50KG9wdGlvbnMpKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzcGVjaWZpZWQgYm91bmRhcnkgZWxlbWVudCBvZiB0aGUgdHJhcHBlZCByZWdpb24uXG4gICAqIEBwYXJhbSBib3VuZCBUaGUgYm91bmRhcnkgdG8gZ2V0IChzdGFydCBvciBlbmQgb2YgdHJhcHBlZCByZWdpb24pLlxuICAgKiBAcmV0dXJucyBUaGUgYm91bmRhcnkgZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgX2dldFJlZ2lvbkJvdW5kYXJ5KGJvdW5kOiAnc3RhcnQnIHwgJ2VuZCcpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIC8vIENvbnRhaW5zIHRoZSBkZXByZWNhdGVkIHZlcnNpb24gb2Ygc2VsZWN0b3IsIGZvciB0ZW1wb3JhcnkgYmFja3dhcmRzIGNvbXBhcmFiaWxpdHkuXG4gICAgY29uc3QgbWFya2VycyA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGBbY2RrLWZvY3VzLXJlZ2lvbi0ke2JvdW5kfV0sIGAgKyBgW2Nka0ZvY3VzUmVnaW9uJHtib3VuZH1dLCBgICsgYFtjZGstZm9jdXMtJHtib3VuZH1dYCxcbiAgICApIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuXG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICAgICAgaWYgKG1hcmtlcnNbaV0uaGFzQXR0cmlidXRlKGBjZGstZm9jdXMtJHtib3VuZH1gKSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBGb3VuZCB1c2Ugb2YgZGVwcmVjYXRlZCBhdHRyaWJ1dGUgJ2Nkay1mb2N1cy0ke2JvdW5kfScsIGAgK1xuICAgICAgICAgICAgICBgdXNlICdjZGtGb2N1c1JlZ2lvbiR7Ym91bmR9JyBpbnN0ZWFkLiBUaGUgZGVwcmVjYXRlZCBgICtcbiAgICAgICAgICAgICAgYGF0dHJpYnV0ZSB3aWxsIGJlIHJlbW92ZWQgaW4gOC4wLjAuYCxcbiAgICAgICAgICAgIG1hcmtlcnNbaV0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXJrZXJzW2ldLmhhc0F0dHJpYnV0ZShgY2RrLWZvY3VzLXJlZ2lvbi0ke2JvdW5kfWApKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYEZvdW5kIHVzZSBvZiBkZXByZWNhdGVkIGF0dHJpYnV0ZSAnY2RrLWZvY3VzLXJlZ2lvbi0ke2JvdW5kfScsIGAgK1xuICAgICAgICAgICAgICBgdXNlICdjZGtGb2N1c1JlZ2lvbiR7Ym91bmR9JyBpbnN0ZWFkLiBUaGUgZGVwcmVjYXRlZCBhdHRyaWJ1dGUgYCArXG4gICAgICAgICAgICAgIGB3aWxsIGJlIHJlbW92ZWQgaW4gOC4wLjAuYCxcbiAgICAgICAgICAgIG1hcmtlcnNbaV0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChib3VuZCA9PSAnc3RhcnQnKSB7XG4gICAgICByZXR1cm4gbWFya2Vycy5sZW5ndGggPyBtYXJrZXJzWzBdIDogdGhpcy5fZ2V0Rmlyc3RUYWJiYWJsZUVsZW1lbnQodGhpcy5fZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBtYXJrZXJzLmxlbmd0aFxuICAgICAgPyBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV1cbiAgICAgIDogdGhpcy5fZ2V0TGFzdFRhYmJhYmxlRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGZvY3VzZWQgd2hlbiB0aGUgZm9jdXMgdHJhcCBpcyBpbml0aWFsaXplZC5cbiAgICogQHJldHVybnMgV2hldGhlciBmb2N1cyB3YXMgbW92ZWQgc3VjY2Vzc2Z1bGx5LlxuICAgKi9cbiAgZm9jdXNJbml0aWFsRWxlbWVudChvcHRpb25zPzogRm9jdXNPcHRpb25zKTogYm9vbGVhbiB7XG4gICAgLy8gQ29udGFpbnMgdGhlIGRlcHJlY2F0ZWQgdmVyc2lvbiBvZiBzZWxlY3RvciwgZm9yIHRlbXBvcmFyeSBiYWNrd2FyZHMgY29tcGFyYWJpbGl0eS5cbiAgICBjb25zdCByZWRpcmVjdFRvRWxlbWVudCA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGBbY2RrLWZvY3VzLWluaXRpYWxdLCBgICsgYFtjZGtGb2N1c0luaXRpYWxdYCxcbiAgICApIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgaWYgKHJlZGlyZWN0VG9FbGVtZW50KSB7XG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmXG4gICAgICAgIHJlZGlyZWN0VG9FbGVtZW50Lmhhc0F0dHJpYnV0ZShgY2RrLWZvY3VzLWluaXRpYWxgKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgRm91bmQgdXNlIG9mIGRlcHJlY2F0ZWQgYXR0cmlidXRlICdjZGstZm9jdXMtaW5pdGlhbCcsIGAgK1xuICAgICAgICAgICAgYHVzZSAnY2RrRm9jdXNJbml0aWFsJyBpbnN0ZWFkLiBUaGUgZGVwcmVjYXRlZCBhdHRyaWJ1dGUgYCArXG4gICAgICAgICAgICBgd2lsbCBiZSByZW1vdmVkIGluIDguMC4wYCxcbiAgICAgICAgICByZWRpcmVjdFRvRWxlbWVudCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2FybiB0aGUgY29uc3VtZXIgaWYgdGhlIGVsZW1lbnQgdGhleSd2ZSBwb2ludGVkIHRvXG4gICAgICAvLyBpc24ndCBmb2N1c2FibGUsIHdoZW4gbm90IGluIHByb2R1Y3Rpb24gbW9kZS5cbiAgICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgJiZcbiAgICAgICAgIXRoaXMuX2NoZWNrZXIuaXNGb2N1c2FibGUocmVkaXJlY3RUb0VsZW1lbnQpXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbGVtZW50IG1hdGNoaW5nICdbY2RrRm9jdXNJbml0aWFsXScgaXMgbm90IGZvY3VzYWJsZS5gLCByZWRpcmVjdFRvRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fY2hlY2tlci5pc0ZvY3VzYWJsZShyZWRpcmVjdFRvRWxlbWVudCkpIHtcbiAgICAgICAgY29uc3QgZm9jdXNhYmxlQ2hpbGQgPSB0aGlzLl9nZXRGaXJzdFRhYmJhYmxlRWxlbWVudChyZWRpcmVjdFRvRWxlbWVudCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGZvY3VzYWJsZUNoaWxkPy5mb2N1cyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuICEhZm9jdXNhYmxlQ2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIHJlZGlyZWN0VG9FbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZm9jdXNGaXJzdFRhYmJhYmxlRWxlbWVudChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCB0YWJiYWJsZSBlbGVtZW50IHdpdGhpbiB0aGUgZm9jdXMgdHJhcCByZWdpb24uXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgZm9jdXMgd2FzIG1vdmVkIHN1Y2Nlc3NmdWxseS5cbiAgICovXG4gIGZvY3VzRmlyc3RUYWJiYWJsZUVsZW1lbnQob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlZGlyZWN0VG9FbGVtZW50ID0gdGhpcy5fZ2V0UmVnaW9uQm91bmRhcnkoJ3N0YXJ0Jyk7XG5cbiAgICBpZiAocmVkaXJlY3RUb0VsZW1lbnQpIHtcbiAgICAgIHJlZGlyZWN0VG9FbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiAhIXJlZGlyZWN0VG9FbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGxhc3QgdGFiYmFibGUgZWxlbWVudCB3aXRoaW4gdGhlIGZvY3VzIHRyYXAgcmVnaW9uLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIGZvY3VzIHdhcyBtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gICAqL1xuICBmb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnQob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlZGlyZWN0VG9FbGVtZW50ID0gdGhpcy5fZ2V0UmVnaW9uQm91bmRhcnkoJ2VuZCcpO1xuXG4gICAgaWYgKHJlZGlyZWN0VG9FbGVtZW50KSB7XG4gICAgICByZWRpcmVjdFRvRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gISFyZWRpcmVjdFRvRWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZm9jdXMgdHJhcCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gYXR0YWNoZWQuXG4gICAqL1xuICBoYXNBdHRhY2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGFzQXR0YWNoZWQ7XG4gIH1cblxuICAvKiogR2V0IHRoZSBmaXJzdCB0YWJiYWJsZSBlbGVtZW50IGZyb20gYSBET00gc3VidHJlZSAoaW5jbHVzaXZlKS4gKi9cbiAgcHJpdmF0ZSBfZ2V0Rmlyc3RUYWJiYWJsZUVsZW1lbnQocm9vdDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIGlmICh0aGlzLl9jaGVja2VyLmlzRm9jdXNhYmxlKHJvb3QpICYmIHRoaXMuX2NoZWNrZXIuaXNUYWJiYWJsZShyb290KSkge1xuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSByb290LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGFiYmFibGVDaGlsZCA9XG4gICAgICAgIGNoaWxkcmVuW2ldLm5vZGVUeXBlID09PSB0aGlzLl9kb2N1bWVudC5FTEVNRU5UX05PREVcbiAgICAgICAgICA/IHRoaXMuX2dldEZpcnN0VGFiYmFibGVFbGVtZW50KGNoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50KVxuICAgICAgICAgIDogbnVsbDtcblxuICAgICAgaWYgKHRhYmJhYmxlQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRhYmJhYmxlQ2hpbGQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0IHRoZSBsYXN0IHRhYmJhYmxlIGVsZW1lbnQgZnJvbSBhIERPTSBzdWJ0cmVlIChpbmNsdXNpdmUpLiAqL1xuICBwcml2YXRlIF9nZXRMYXN0VGFiYmFibGVFbGVtZW50KHJvb3Q6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAodGhpcy5fY2hlY2tlci5pc0ZvY3VzYWJsZShyb290KSAmJiB0aGlzLl9jaGVja2VyLmlzVGFiYmFibGUocm9vdCkpIHtcbiAgICAgIHJldHVybiByb290O1xuICAgIH1cblxuICAgIC8vIEl0ZXJhdGUgaW4gcmV2ZXJzZSBET00gb3JkZXIuXG4gICAgY29uc3QgY2hpbGRyZW4gPSByb290LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCB0YWJiYWJsZUNoaWxkID1cbiAgICAgICAgY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IHRoaXMuX2RvY3VtZW50LkVMRU1FTlRfTk9ERVxuICAgICAgICAgID8gdGhpcy5fZ2V0TGFzdFRhYmJhYmxlRWxlbWVudChjaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgIGlmICh0YWJiYWJsZUNoaWxkKSB7XG4gICAgICAgIHJldHVybiB0YWJiYWJsZUNoaWxkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYW4gYW5jaG9yIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2NyZWF0ZUFuY2hvcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYW5jaG9yID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fdG9nZ2xlQW5jaG9yVGFiSW5kZXgodGhpcy5fZW5hYmxlZCwgYW5jaG9yKTtcbiAgICBhbmNob3IuY2xhc3NMaXN0LmFkZCgnY2RrLXZpc3VhbGx5LWhpZGRlbicpO1xuICAgIGFuY2hvci5jbGFzc0xpc3QuYWRkKCdjZGstZm9jdXMtdHJhcC1hbmNob3InKTtcbiAgICBhbmNob3Iuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgcmV0dXJuIGFuY2hvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBgdGFiaW5kZXhgIG9mIGFuIGFuY2hvciwgYmFzZWQgb24gdGhlIGVuYWJsZWQgc3RhdGUgb2YgdGhlIGZvY3VzIHRyYXAuXG4gICAqIEBwYXJhbSBpc0VuYWJsZWQgV2hldGhlciB0aGUgZm9jdXMgdHJhcCBpcyBlbmFibGVkLlxuICAgKiBAcGFyYW0gYW5jaG9yIEFuY2hvciBvbiB3aGljaCB0byB0b2dnbGUgdGhlIHRhYmluZGV4LlxuICAgKi9cbiAgcHJpdmF0ZSBfdG9nZ2xlQW5jaG9yVGFiSW5kZXgoaXNFbmFibGVkOiBib29sZWFuLCBhbmNob3I6IEhUTUxFbGVtZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSB0YWJpbmRleCBjb21wbGV0ZWx5LCByYXRoZXIgdGhhbiBzZXR0aW5nIGl0IHRvIC0xLCBiZWNhdXNlIGlmIHRoZVxuICAgIC8vIGVsZW1lbnQgaGFzIGEgdGFiaW5kZXgsIHRoZSB1c2VyIG1pZ2h0IHN0aWxsIGhpdCBpdCB3aGVuIG5hdmlnYXRpbmcgd2l0aCB0aGUgYXJyb3cga2V5cy5cbiAgICBpc0VuYWJsZWQgPyBhbmNob3Iuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJykgOiBhbmNob3IucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlYHRhYmluZGV4YCBvZiBib3RoIGFuY2hvcnMgdG8gZWl0aGVyIHRyYXAgVGFiIGZvY3VzIG9yIGFsbG93IGl0IHRvIGVzY2FwZS5cbiAgICogQHBhcmFtIGVuYWJsZWQ6IFdoZXRoZXIgdGhlIGFuY2hvcnMgc2hvdWxkIHRyYXAgVGFiLlxuICAgKi9cbiAgcHJvdGVjdGVkIHRvZ2dsZUFuY2hvcnMoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9zdGFydEFuY2hvciAmJiB0aGlzLl9lbmRBbmNob3IpIHtcbiAgICAgIHRoaXMuX3RvZ2dsZUFuY2hvclRhYkluZGV4KGVuYWJsZWQsIHRoaXMuX3N0YXJ0QW5jaG9yKTtcbiAgICAgIHRoaXMuX3RvZ2dsZUFuY2hvclRhYkluZGV4KGVuYWJsZWQsIHRoaXMuX2VuZEFuY2hvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV4ZWN1dGVzIGEgZnVuY3Rpb24gd2hlbiB0aGUgem9uZSBpcyBzdGFibGUuICovXG4gIHByaXZhdGUgX2V4ZWN1dGVPblN0YWJsZShmbjogKCkgPT4gYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX25nWm9uZS5pc1N0YWJsZSkge1xuICAgICAgZm4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKGZuKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGYWN0b3J5IHRoYXQgYWxsb3dzIGVhc3kgaW5zdGFudGlhdGlvbiBvZiBmb2N1cyB0cmFwcy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgQ29uZmlndXJhYmxlRm9jdXNUcmFwRmFjdG9yeWAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEZvY3VzVHJhcEZhY3Rvcnkge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmb2N1cy10cmFwcGVkIHJlZ2lvbiBhcm91bmQgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IGFyb3VuZCB3aGljaCBmb2N1cyB3aWxsIGJlIHRyYXBwZWQuXG4gICAqIEBwYXJhbSBkZWZlckNhcHR1cmVFbGVtZW50cyBEZWZlcnMgdGhlIGNyZWF0aW9uIG9mIGZvY3VzLWNhcHR1cmluZyBlbGVtZW50cyB0byBiZSBkb25lXG4gICAqICAgICBtYW51YWxseSBieSB0aGUgdXNlci5cbiAgICogQHJldHVybnMgVGhlIGNyZWF0ZWQgZm9jdXMgdHJhcCBpbnN0YW5jZS5cbiAgICovXG4gIGNyZWF0ZShlbGVtZW50OiBIVE1MRWxlbWVudCwgZGVmZXJDYXB0dXJlRWxlbWVudHM6IGJvb2xlYW4gPSBmYWxzZSk6IEZvY3VzVHJhcCB7XG4gICAgcmV0dXJuIG5ldyBGb2N1c1RyYXAoXG4gICAgICBlbGVtZW50LFxuICAgICAgdGhpcy5fY2hlY2tlcixcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX2RvY3VtZW50LFxuICAgICAgZGVmZXJDYXB0dXJlRWxlbWVudHMsXG4gICAgKTtcbiAgfVxufVxuXG4vKiogRGlyZWN0aXZlIGZvciB0cmFwcGluZyBmb2N1cyB3aXRoaW4gYSByZWdpb24uICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2RrVHJhcEZvY3VzXScsXG4gIGV4cG9ydEFzOiAnY2RrVHJhcEZvY3VzJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrVHJhcEZvY3VzIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIERvQ2hlY2sge1xuICAvKiogVW5kZXJseWluZyBGb2N1c1RyYXAgaW5zdGFuY2UuICovXG4gIGZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBQcmV2aW91c2x5IGZvY3VzZWQgZWxlbWVudCB0byByZXN0b3JlIGZvY3VzIHRvIHVwb24gZGVzdHJveSB3aGVuIHVzaW5nIGF1dG9DYXB0dXJlLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvY3VzIHRyYXAgaXMgYWN0aXZlLiAqL1xuICBASW5wdXQoJ2Nka1RyYXBGb2N1cycpXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvY3VzVHJhcC5lbmFibGVkO1xuICB9XG4gIHNldCBlbmFibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLmZvY3VzVHJhcC5lbmFibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaXJlY3RpdmUgc2hvdWxkIGF1dG9tYXRpY2FsbHkgbW92ZSBmb2N1cyBpbnRvIHRoZSB0cmFwcGVkIHJlZ2lvbiB1cG9uXG4gICAqIGluaXRpYWxpemF0aW9uIGFuZCByZXR1cm4gZm9jdXMgdG8gdGhlIHByZXZpb3VzIGFjdGl2ZUVsZW1lbnQgdXBvbiBkZXN0cnVjdGlvbi5cbiAgICovXG4gIEBJbnB1dCgnY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmUnKVxuICBnZXQgYXV0b0NhcHR1cmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9DYXB0dXJlO1xuICB9XG4gIHNldCBhdXRvQ2FwdHVyZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYXV0b0NhcHR1cmUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9DYXB0dXJlOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICAgKi9cbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgKSB7XG4gICAgdGhpcy5mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5mb2N1c1RyYXAuZGVzdHJveSgpO1xuXG4gICAgLy8gSWYgd2Ugc3RvcmVkIGEgcHJldmlvdXNseSBmb2N1c2VkIGVsZW1lbnQgd2hlbiB1c2luZyBhdXRvQ2FwdHVyZSwgcmV0dXJuIGZvY3VzIHRvIHRoYXRcbiAgICAvLyBlbGVtZW50IG5vdyB0aGF0IHRoZSB0cmFwcGVkIHJlZ2lvbiBpcyBiZWluZyBkZXN0cm95ZWQuXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5fcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLl9wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmZvY3VzVHJhcC5hdHRhY2hBbmNob3JzKCk7XG5cbiAgICBpZiAodGhpcy5hdXRvQ2FwdHVyZSkge1xuICAgICAgdGhpcy5fY2FwdHVyZUZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICghdGhpcy5mb2N1c1RyYXAuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5mb2N1c1RyYXAuYXR0YWNoQW5jaG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBhdXRvQ2FwdHVyZUNoYW5nZSA9IGNoYW5nZXNbJ2F1dG9DYXB0dXJlJ107XG5cbiAgICBpZiAoXG4gICAgICBhdXRvQ2FwdHVyZUNoYW5nZSAmJlxuICAgICAgIWF1dG9DYXB0dXJlQ2hhbmdlLmZpcnN0Q2hhbmdlICYmXG4gICAgICB0aGlzLmF1dG9DYXB0dXJlICYmXG4gICAgICB0aGlzLmZvY3VzVHJhcC5oYXNBdHRhY2hlZCgpXG4gICAgKSB7XG4gICAgICB0aGlzLl9jYXB0dXJlRm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jYXB0dXJlRm9jdXMoKSB7XG4gICAgdGhpcy5fcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgdGhpcy5mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICB9XG59XG4iXX0=