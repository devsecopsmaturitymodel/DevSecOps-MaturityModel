/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
let nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/** @docs-private */
const _MatBadgeBase = mixinDisabled(class {
});
const BADGE_CONTENT_CLASS = 'mat-badge-content';
/** Directive to display a text badge. */
export class MatBadge extends _MatBadgeBase {
    constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        this._renderer = _renderer;
        this._animationMode = _animationMode;
        this._color = 'primary';
        this._overlap = true;
        /**
         * Position the badge should reside.
         * Accepts any combination of 'above'|'below' and 'before'|'after'
         */
        this.position = 'above after';
        /** Size of the badge. Can be 'small', 'medium', or 'large'. */
        this.size = 'medium';
        /** Unique id for the badge */
        this._id = nextId++;
        /** Whether the OnInit lifecycle hook has run yet */
        this._isInitialized = false;
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            const nativeElement = _elementRef.nativeElement;
            if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                throw Error('matBadge must be attached to an element node.');
            }
        }
    }
    /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
    get color() {
        return this._color;
    }
    set color(value) {
        this._setColor(value);
        this._color = value;
    }
    /** Whether the badge should overlap its contents or not */
    get overlap() {
        return this._overlap;
    }
    set overlap(val) {
        this._overlap = coerceBooleanProperty(val);
    }
    /** The content for the badge */
    get content() {
        return this._content;
    }
    set content(newContent) {
        this._updateRenderedContent(newContent);
    }
    /** Message used to describe the decorated element via aria-describedby */
    get description() {
        return this._description;
    }
    set description(newDescription) {
        this._updateHostAriaDescription(newDescription);
    }
    /** Whether the badge is hidden. */
    get hidden() {
        return this._hidden;
    }
    set hidden(val) {
        this._hidden = coerceBooleanProperty(val);
    }
    /** Whether the badge is above the host or not */
    isAbove() {
        return this.position.indexOf('below') === -1;
    }
    /** Whether the badge is after the host or not */
    isAfter() {
        return this.position.indexOf('before') === -1;
    }
    /**
     * Gets the element into which the badge's content is being rendered. Undefined if the element
     * hasn't been created (e.g. if the badge doesn't have content).
     */
    getBadgeElement() {
        return this._badgeElement;
    }
    ngOnInit() {
        // We may have server-side rendered badge that we need to clear.
        // We need to do this in ngOnInit because the full content of the component
        // on which the badge is attached won't necessarily be in the DOM until this point.
        this._clearExistingBadges();
        if (this.content && !this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
            this._updateRenderedContent(this.content);
        }
        this._isInitialized = true;
    }
    ngOnDestroy() {
        // ViewEngine only: when creating a badge through the Renderer, Angular remembers its index.
        // We have to destroy it ourselves, otherwise it'll be retained in memory.
        if (this._renderer.destroyNode) {
            this._renderer.destroyNode(this._badgeElement);
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
    }
    /** Creates the badge element */
    _createBadgeElement() {
        const badgeElement = this._renderer.createElement('span');
        const activeClass = 'mat-badge-active';
        badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
        // The badge is aria-hidden because we don't want it to appear in the page's navigation
        // flow. Instead, we use the badge to describe the decorated element with aria-describedby.
        badgeElement.setAttribute('aria-hidden', 'true');
        badgeElement.classList.add(BADGE_CONTENT_CLASS);
        if (this._animationMode === 'NoopAnimations') {
            badgeElement.classList.add('_mat-animation-noopable');
        }
        this._elementRef.nativeElement.appendChild(badgeElement);
        // animate in after insertion
        if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
            this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    badgeElement.classList.add(activeClass);
                });
            });
        }
        else {
            badgeElement.classList.add(activeClass);
        }
        return badgeElement;
    }
    /** Update the text content of the badge element in the DOM, creating the element if necessary. */
    _updateRenderedContent(newContent) {
        const newContentNormalized = `${newContent ?? ''}`.trim();
        // Don't create the badge element if the directive isn't initialized because we want to
        // append the badge element to the *end* of the host element's content for backwards
        // compatibility.
        if (this._isInitialized && newContentNormalized && !this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
        }
        if (this._badgeElement) {
            this._badgeElement.textContent = newContentNormalized;
        }
        this._content = newContentNormalized;
    }
    /** Updates the host element's aria description via AriaDescriber. */
    _updateHostAriaDescription(newDescription) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
        if (newDescription) {
            this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
        }
        this._description = newDescription;
    }
    /** Adds css theme class given the color to the component host */
    _setColor(colorPalette) {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(`mat-badge-${this._color}`);
        if (colorPalette) {
            classList.add(`mat-badge-${colorPalette}`);
        }
    }
    /** Clears any existing badges that might be left over from server-side rendering. */
    _clearExistingBadges() {
        // Only check direct children of this host element in order to avoid deleting
        // any badges that might exist in descendant elements.
        const badges = this._elementRef.nativeElement.querySelectorAll(`:scope > .${BADGE_CONTENT_CLASS}`);
        for (const badgeElement of Array.from(badges)) {
            if (badgeElement !== this._badgeElement) {
                badgeElement.remove();
            }
        }
    }
}
MatBadge.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatBadge, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.AriaDescriber }, { token: i0.Renderer2 }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatBadge.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatBadge, selector: "[matBadge]", inputs: { disabled: ["matBadgeDisabled", "disabled"], color: ["matBadgeColor", "color"], overlap: ["matBadgeOverlap", "overlap"], position: ["matBadgePosition", "position"], content: ["matBadge", "content"], description: ["matBadgeDescription", "description"], size: ["matBadgeSize", "size"], hidden: ["matBadgeHidden", "hidden"] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"medium\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatBadge, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matBadge]',
                    inputs: ['disabled: matBadgeDisabled'],
                    host: {
                        'class': 'mat-badge',
                        '[class.mat-badge-overlap]': 'overlap',
                        '[class.mat-badge-above]': 'isAbove()',
                        '[class.mat-badge-below]': '!isAbove()',
                        '[class.mat-badge-before]': '!isAfter()',
                        '[class.mat-badge-after]': 'isAfter()',
                        '[class.mat-badge-small]': 'size === "small"',
                        '[class.mat-badge-medium]': 'size === "medium"',
                        '[class.mat-badge-large]': 'size === "large"',
                        '[class.mat-badge-hidden]': 'hidden || !content',
                        '[class.mat-badge-disabled]': 'disabled',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i1.AriaDescriber }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { color: [{
                type: Input,
                args: ['matBadgeColor']
            }], overlap: [{
                type: Input,
                args: ['matBadgeOverlap']
            }], position: [{
                type: Input,
                args: ['matBadgePosition']
            }], content: [{
                type: Input,
                args: ['matBadge']
            }], description: [{
                type: Input,
                args: ['matBadgeDescription']
            }], size: [{
                type: Input,
                args: ['matBadgeSize']
            }], hidden: [{
                type: Input,
                args: ['matBadgeHidden']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLGFBQWEsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7QUFFM0UsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRWYsK0NBQStDO0FBQy9DLG9CQUFvQjtBQUNwQixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFnQjlDLE1BQU0sbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7QUFFaEQseUNBQXlDO0FBa0J6QyxNQUFNLE9BQU8sUUFBUyxTQUFRLGFBQWE7SUFzRXpDLFlBQ1UsT0FBZSxFQUNmLFdBQW9DLEVBQ3BDLGNBQTZCLEVBQzdCLFNBQW9CLEVBQ3VCLGNBQXVCO1FBRTFFLEtBQUssRUFBRSxDQUFDO1FBTkEsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3VCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBakVwRSxXQUFNLEdBQWlCLFNBQVMsQ0FBQztRQVVqQyxhQUFRLEdBQVksSUFBSSxDQUFDO1FBRWpDOzs7V0FHRztRQUN3QixhQUFR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S0FBSzt1QkFBQyxlQUFlO2dCQVlsQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsaUJBQWlCO2dCQWFHLFFBQVE7c0JBQWxDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUlyQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsVUFBVTtnQkFXYixXQUFXO3NCQURkLEtBQUs7dUJBQUMscUJBQXFCO2dCQVVMLElBQUk7c0JBQTFCLEtBQUs7dUJBQUMsY0FBYztnQkFJakIsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEJhZGdlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRCYWRnZUJhc2UgPSBtaXhpbkRpc2FibGVkKGNsYXNzIHt9KTtcblxuLyoqIEFsbG93ZWQgcG9zaXRpb24gb3B0aW9ucyBmb3IgbWF0QmFkZ2VQb3NpdGlvbiAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VQb3NpdGlvbiA9XG4gIHwgJ2Fib3ZlIGFmdGVyJ1xuICB8ICdhYm92ZSBiZWZvcmUnXG4gIHwgJ2JlbG93IGJlZm9yZSdcbiAgfCAnYmVsb3cgYWZ0ZXInXG4gIHwgJ2JlZm9yZSdcbiAgfCAnYWZ0ZXInXG4gIHwgJ2Fib3ZlJ1xuICB8ICdiZWxvdyc7XG5cbi8qKiBBbGxvd2VkIHNpemUgb3B0aW9ucyBmb3IgbWF0QmFkZ2VTaXplICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVNpemUgPSAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG5jb25zdCBCQURHRV9DT05URU5UX0NMQVNTID0gJ21hdC1iYWRnZS1jb250ZW50JztcblxuLyoqIERpcmVjdGl2ZSB0byBkaXNwbGF5IGEgdGV4dCBiYWRnZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRCYWRnZV0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdEJhZGdlRGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYmFkZ2UnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW92ZXJsYXBdJzogJ292ZXJsYXAnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFib3ZlXSc6ICdpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlbG93XSc6ICchaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWZvcmVdJzogJyFpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFmdGVyXSc6ICdpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLXNtYWxsXSc6ICdzaXplID09PSBcInNtYWxsXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW1lZGl1bV0nOiAnc2l6ZSA9PT0gXCJtZWRpdW1cIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbGFyZ2VdJzogJ3NpemUgPT09IFwibGFyZ2VcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtaGlkZGVuXSc6ICdoaWRkZW4gfHwgIWNvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJhZGdlIGV4dGVuZHMgX01hdEJhZGdlQmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDYW5EaXNhYmxlIHtcbiAgLyoqIFRoZSBjb2xvciBvZiB0aGUgYmFkZ2UuIENhbiBiZSBgcHJpbWFyeWAsIGBhY2NlbnRgLCBvciBgd2FybmAuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VDb2xvcicpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX3NldENvbG9yKHZhbHVlKTtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIHNob3VsZCBvdmVybGFwIGl0cyBjb250ZW50cyBvciBub3QgKi9cbiAgQElucHV0KCdtYXRCYWRnZU92ZXJsYXAnKVxuICBnZXQgb3ZlcmxhcCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxhcDtcbiAgfVxuICBzZXQgb3ZlcmxhcCh2YWw6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX292ZXJsYXAgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9vdmVybGFwOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogUG9zaXRpb24gdGhlIGJhZGdlIHNob3VsZCByZXNpZGUuXG4gICAqIEFjY2VwdHMgYW55IGNvbWJpbmF0aW9uIG9mICdhYm92ZSd8J2JlbG93JyBhbmQgJ2JlZm9yZSd8J2FmdGVyJ1xuICAgKi9cbiAgQElucHV0KCdtYXRCYWRnZVBvc2l0aW9uJykgcG9zaXRpb246IE1hdEJhZGdlUG9zaXRpb24gPSAnYWJvdmUgYWZ0ZXInO1xuXG4gIC8qKiBUaGUgY29udGVudCBmb3IgdGhlIGJhZGdlICovXG4gIEBJbnB1dCgnbWF0QmFkZ2UnKVxuICBnZXQgY29udGVudCgpOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuICBzZXQgY29udGVudChuZXdDb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRDb250ZW50KG5ld0NvbnRlbnQpO1xuICB9XG4gIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGw7XG5cbiAgLyoqIE1lc3NhZ2UgdXNlZCB0byBkZXNjcmliZSB0aGUgZGVjb3JhdGVkIGVsZW1lbnQgdmlhIGFyaWEtZGVzY3JpYmVkYnkgKi9cbiAgQElucHV0KCdtYXRCYWRnZURlc2NyaXB0aW9uJylcbiAgZ2V0IGRlc2NyaXB0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uO1xuICB9XG4gIHNldCBkZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlSG9zdEFyaWFEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbik7XG4gIH1cbiAgcHJpdmF0ZSBfZGVzY3JpcHRpb246IHN0cmluZztcblxuICAvKiogU2l6ZSBvZiB0aGUgYmFkZ2UuIENhbiBiZSAnc21hbGwnLCAnbWVkaXVtJywgb3IgJ2xhcmdlJy4gKi9cbiAgQElucHV0KCdtYXRCYWRnZVNpemUnKSBzaXplOiBNYXRCYWRnZVNpemUgPSAnbWVkaXVtJztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgaGlkZGVuLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlSGlkZGVuJylcbiAgZ2V0IGhpZGRlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuO1xuICB9XG4gIHNldCBoaWRkZW4odmFsOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGJhZGdlICovXG4gIF9pZDogbnVtYmVyID0gbmV4dElkKys7XG5cbiAgLyoqIFZpc2libGUgYmFkZ2UgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfYmFkZ2VFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgT25Jbml0IGxpZmVjeWNsZSBob29rIGhhcyBydW4geWV0ICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGlmIChuYXRpdmVFbGVtZW50Lm5vZGVUeXBlICE9PSBuYXRpdmVFbGVtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICB0aHJvdyBFcnJvcignbWF0QmFkZ2UgbXVzdCBiZSBhdHRhY2hlZCB0byBhbiBlbGVtZW50IG5vZGUuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFib3ZlIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFmdGVyIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0FmdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlZm9yZScpID09PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IGludG8gd2hpY2ggdGhlIGJhZGdlJ3MgY29udGVudCBpcyBiZWluZyByZW5kZXJlZC4gVW5kZWZpbmVkIGlmIHRoZSBlbGVtZW50XG4gICAqIGhhc24ndCBiZWVuIGNyZWF0ZWQgKGUuZy4gaWYgdGhlIGJhZGdlIGRvZXNuJ3QgaGF2ZSBjb250ZW50KS5cbiAgICovXG4gIGdldEJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG1heSBoYXZlIHNlcnZlci1zaWRlIHJlbmRlcmVkIGJhZGdlIHRoYXQgd2UgbmVlZCB0byBjbGVhci5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIHRoaXMgaW4gbmdPbkluaXQgYmVjYXVzZSB0aGUgZnVsbCBjb250ZW50IG9mIHRoZSBjb21wb25lbnRcbiAgICAvLyBvbiB3aGljaCB0aGUgYmFkZ2UgaXMgYXR0YWNoZWQgd29uJ3QgbmVjZXNzYXJpbHkgYmUgaW4gdGhlIERPTSB1bnRpbCB0aGlzIHBvaW50LlxuICAgIHRoaXMuX2NsZWFyRXhpc3RpbmdCYWRnZXMoKTtcblxuICAgIGlmICh0aGlzLmNvbnRlbnQgJiYgIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgICB0aGlzLl91cGRhdGVSZW5kZXJlZENvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIFZpZXdFbmdpbmUgb25seTogd2hlbiBjcmVhdGluZyBhIGJhZGdlIHRocm91Z2ggdGhlIFJlbmRlcmVyLCBBbmd1bGFyIHJlbWVtYmVycyBpdHMgaW5kZXguXG4gICAgLy8gV2UgaGF2ZSB0byBkZXN0cm95IGl0IG91cnNlbHZlcywgb3RoZXJ3aXNlIGl0J2xsIGJlIHJldGFpbmVkIGluIG1lbW9yeS5cbiAgICBpZiAodGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKHRoaXMuX2JhZGdlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgdGhlIGJhZGdlIGVsZW1lbnQgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgYWN0aXZlQ2xhc3MgPSAnbWF0LWJhZGdlLWFjdGl2ZSc7XG5cbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuXG4gICAgLy8gVGhlIGJhZGdlIGlzIGFyaWEtaGlkZGVuIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBpdCB0byBhcHBlYXIgaW4gdGhlIHBhZ2UncyBuYXZpZ2F0aW9uXG4gICAgLy8gZmxvdy4gSW5zdGVhZCwgd2UgdXNlIHRoZSBiYWRnZSB0byBkZXNjcmliZSB0aGUgZGVjb3JhdGVkIGVsZW1lbnQgd2l0aCBhcmlhLWRlc2NyaWJlZGJ5LlxuICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChCQURHRV9DT05URU5UX0NMQVNTKTtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFkZ2VFbGVtZW50KTtcblxuICAgIC8vIGFuaW1hdGUgaW4gYWZ0ZXIgaW5zZXJ0aW9uXG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIFVwZGF0ZSB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBiYWRnZSBlbGVtZW50IGluIHRoZSBET00sIGNyZWF0aW5nIHRoZSBlbGVtZW50IGlmIG5lY2Vzc2FyeS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlUmVuZGVyZWRDb250ZW50KG5ld0NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdDb250ZW50Tm9ybWFsaXplZDogc3RyaW5nID0gYCR7bmV3Q29udGVudCA/PyAnJ31gLnRyaW0oKTtcblxuICAgIC8vIERvbid0IGNyZWF0ZSB0aGUgYmFkZ2UgZWxlbWVudCBpZiB0aGUgZGlyZWN0aXZlIGlzbid0IGluaXRpYWxpemVkIGJlY2F1c2Ugd2Ugd2FudCB0b1xuICAgIC8vIGFwcGVuZCB0aGUgYmFkZ2UgZWxlbWVudCB0byB0aGUgKmVuZCogb2YgdGhlIGhvc3QgZWxlbWVudCdzIGNvbnRlbnQgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkuXG4gICAgaWYgKHRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgbmV3Q29udGVudE5vcm1hbGl6ZWQgJiYgIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gbmV3Q29udGVudE5vcm1hbGl6ZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGVudCA9IG5ld0NvbnRlbnROb3JtYWxpemVkO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGhvc3QgZWxlbWVudCdzIGFyaWEgZGVzY3JpcHRpb24gdmlhIEFyaWFEZXNjcmliZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZUhvc3RBcmlhRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICBpZiAobmV3RGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBuZXdEZXNjcmlwdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG4gIH1cblxuICAvKiogQWRkcyBjc3MgdGhlbWUgY2xhc3MgZ2l2ZW4gdGhlIGNvbG9yIHRvIHRoZSBjb21wb25lbnQgaG9zdCAqL1xuICBwcml2YXRlIF9zZXRDb2xvcihjb2xvclBhbGV0dGU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhZGdlLSR7dGhpcy5fY29sb3J9YCk7XG4gICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgY2xhc3NMaXN0LmFkZChgbWF0LWJhZGdlLSR7Y29sb3JQYWxldHRlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgYW55IGV4aXN0aW5nIGJhZGdlcyB0aGF0IG1pZ2h0IGJlIGxlZnQgb3ZlciBmcm9tIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcygpIHtcbiAgICAvLyBPbmx5IGNoZWNrIGRpcmVjdCBjaGlsZHJlbiBvZiB0aGlzIGhvc3QgZWxlbWVudCBpbiBvcmRlciB0byBhdm9pZCBkZWxldGluZ1xuICAgIC8vIGFueSBiYWRnZXMgdGhhdCBtaWdodCBleGlzdCBpbiBkZXNjZW5kYW50IGVsZW1lbnRzLlxuICAgIGNvbnN0IGJhZGdlcyA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYDpzY29wZSA+IC4ke0JBREdFX0NPTlRFTlRfQ0xBU1N9YCxcbiAgICApO1xuICAgIGZvciAoY29uc3QgYmFkZ2VFbGVtZW50IG9mIEFycmF5LmZyb20oYmFkZ2VzKSkge1xuICAgICAgaWYgKGJhZGdlRWxlbWVudCAhPT0gdGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICAgIGJhZGdlRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==