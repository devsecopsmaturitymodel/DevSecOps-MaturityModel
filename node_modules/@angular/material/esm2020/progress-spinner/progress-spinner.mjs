/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform, _getShadowRoot } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, InjectionToken, Input, Optional, ViewEncapsulation, ChangeDetectorRef, NgZone, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/common";
/**
 * Base reference size of the spinner.
 * @docs-private
 */
const BASE_SIZE = 100;
/**
 * Base reference stroke width of the spinner.
 * @docs-private
 */
const BASE_STROKE_WIDTH = 10;
// Boilerplate for applying mixins to MatProgressSpinner.
/** @docs-private */
const _MatProgressSpinnerBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
/** Injection token to be used to override the default options for `mat-progress-spinner`. */
export const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS = new InjectionToken('mat-progress-spinner-default-options', {
    providedIn: 'root',
    factory: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY() {
    return { diameter: BASE_SIZE };
}
// .0001 percentage difference is necessary in order to avoid unwanted animation frames
// for example because the animation duration is 4 seconds, .1% accounts to 4ms
// which are enough to see the flicker described in
// https://github.com/angular/components/issues/8984
const INDETERMINATE_ANIMATION_TEMPLATE = `
 @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {
    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }
    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }
    12.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }
    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }

    25.0001%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }
    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }
    37.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }
    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }

    50.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }
    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }
    62.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }
    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }

    75.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }
    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }
    87.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }
    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }
  }
`;
/**
 * `<mat-progress-spinner>` component.
 */
export class MatProgressSpinner extends _MatProgressSpinnerBase {
    constructor(elementRef, _platform, _document, animationMode, defaults, 
    /**
     * @deprecated `changeDetectorRef`, `viewportRuler` and `ngZone`
     * parameters to become required.
     * @breaking-change 14.0.0
     */
    changeDetectorRef, viewportRuler, ngZone) {
        super(elementRef);
        this._document = _document;
        this._diameter = BASE_SIZE;
        this._value = 0;
        this._resizeSubscription = Subscription.EMPTY;
        /** Mode of the progress circle */
        this.mode = 'determinate';
        const trackedDiameters = MatProgressSpinner._diameters;
        this._spinnerAnimationLabel = this._getSpinnerAnimationLabel();
        // The base size is already inserted via the component's structural styles. We still
        // need to track it so we don't end up adding the same styles again.
        if (!trackedDiameters.has(_document.head)) {
            trackedDiameters.set(_document.head, new Set([BASE_SIZE]));
        }
        this._noopAnimations =
            animationMode === 'NoopAnimations' && !!defaults && !defaults._forceAnimations;
        if (elementRef.nativeElement.nodeName.toLowerCase() === 'mat-spinner') {
            this.mode = 'indeterminate';
        }
        if (defaults) {
            if (defaults.diameter) {
                this.diameter = defaults.diameter;
            }
            if (defaults.strokeWidth) {
                this.strokeWidth = defaults.strokeWidth;
            }
        }
        // Safari has an issue where the circle isn't positioned correctly when the page has a
        // different zoom level from the default. This handler triggers a recalculation of the
        // `transform-origin` when the page zoom level changes.
        // See `_getCircleTransformOrigin` for more info.
        // @breaking-change 14.0.0 Remove null checks for `_changeDetectorRef`,
        // `viewportRuler` and `ngZone`.
        if (_platform.isBrowser && _platform.SAFARI && viewportRuler && changeDetectorRef && ngZone) {
            this._resizeSubscription = viewportRuler.change(150).subscribe(() => {
                // When the window is resize while the spinner is in `indeterminate` mode, we
                // have to mark for check so the transform origin of the circle can be recomputed.
                if (this.mode === 'indeterminate') {
                    ngZone.run(() => changeDetectorRef.markForCheck());
                }
            });
        }
    }
    /** The diameter of the progress spinner (will set width and height of svg). */
    get diameter() {
        return this._diameter;
    }
    set diameter(size) {
        this._diameter = coerceNumberProperty(size);
        this._spinnerAnimationLabel = this._getSpinnerAnimationLabel();
        // If this is set before `ngOnInit`, the style root may not have been resolved yet.
        if (this._styleRoot) {
            this._attachStyleNode();
        }
    }
    /** Stroke width of the progress spinner. */
    get strokeWidth() {
        return this._strokeWidth || this.diameter / 10;
    }
    set strokeWidth(value) {
        this._strokeWidth = coerceNumberProperty(value);
    }
    /** Value of the progress circle. */
    get value() {
        return this.mode === 'determinate' ? this._value : 0;
    }
    set value(newValue) {
        this._value = Math.max(0, Math.min(100, coerceNumberProperty(newValue)));
    }
    ngOnInit() {
        const element = this._elementRef.nativeElement;
        // Note that we need to look up the root node in ngOnInit, rather than the constructor, because
        // Angular seems to create the element outside the shadow root and then moves it inside, if the
        // node is inside an `ngIf` and a ShadowDom-encapsulated component.
        this._styleRoot = _getShadowRoot(element) || this._document.head;
        this._attachStyleNode();
        element.classList.add('mat-progress-spinner-indeterminate-animation');
    }
    ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
    }
    /** The radius of the spinner, adjusted for stroke width. */
    _getCircleRadius() {
        return (this.diameter - BASE_STROKE_WIDTH) / 2;
    }
    /** The view box of the spinner's svg element. */
    _getViewBox() {
        const viewBox = this._getCircleRadius() * 2 + this.strokeWidth;
        return `0 0 ${viewBox} ${viewBox}`;
    }
    /** The stroke circumference of the svg circle. */
    _getStrokeCircumference() {
        return 2 * Math.PI * this._getCircleRadius();
    }
    /** The dash offset of the svg circle. */
    _getStrokeDashOffset() {
        if (this.mode === 'determinate') {
            return (this._getStrokeCircumference() * (100 - this._value)) / 100;
        }
        return null;
    }
    /** Stroke width of the circle in percent. */
    _getCircleStrokeWidth() {
        return (this.strokeWidth / this.diameter) * 100;
    }
    /** Gets the `transform-origin` for the inner circle element. */
    _getCircleTransformOrigin(svg) {
        // Safari has an issue where the `transform-origin` doesn't work as expected when the page
        // has a different zoom level from the default. The problem appears to be that a zoom
        // is applied on the `svg` node itself. We can work around it by calculating the origin
        // based on the zoom level. On all other browsers the `currentScale` appears to always be 1.
        const scale = (svg.currentScale ?? 1) * 50;
        return `${scale}% ${scale}%`;
    }
    /** Dynamically generates a style tag containing the correct animation for this diameter. */
    _attachStyleNode() {
        const styleRoot = this._styleRoot;
        const currentDiameter = this._diameter;
        const diameters = MatProgressSpinner._diameters;
        let diametersForElement = diameters.get(styleRoot);
        if (!diametersForElement || !diametersForElement.has(currentDiameter)) {
            const styleTag = this._document.createElement('style');
            styleTag.setAttribute('mat-spinner-animation', this._spinnerAnimationLabel);
            styleTag.textContent = this._getAnimationText();
            styleRoot.appendChild(styleTag);
            if (!diametersForElement) {
                diametersForElement = new Set();
                diameters.set(styleRoot, diametersForElement);
            }
            diametersForElement.add(currentDiameter);
        }
    }
    /** Generates animation styles adjusted for the spinner's diameter. */
    _getAnimationText() {
        const strokeCircumference = this._getStrokeCircumference();
        return (INDETERMINATE_ANIMATION_TEMPLATE
            // Animation should begin at 5% and end at 80%
            .replace(/START_VALUE/g, `${0.95 * strokeCircumference}`)
            .replace(/END_VALUE/g, `${0.2 * strokeCircumference}`)
            .replace(/DIAMETER/g, `${this._spinnerAnimationLabel}`));
    }
    /** Returns the circle diameter formatted for use with the animation-name CSS property. */
    _getSpinnerAnimationLabel() {
        // The string of a float point number will include a period ‘.’ character,
        // which is not valid for a CSS animation-name.
        return this.diameter.toString().replace('.', '_');
    }
}
/**
 * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
 * We need to keep track of which elements the diameters were attached to, because for
 * elements in the Shadow DOM the style tags are attached to the shadow root, rather
 * than the document head.
 */
MatProgressSpinner._diameters = new WeakMap();
MatProgressSpinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatProgressSpinner, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatProgressSpinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: { color: "color", diameter: "diameter", strokeWidth: "strokeWidth", mode: "mode", value: "value" }, host: { attributes: { "role": "progressbar", "tabindex": "-1" }, properties: { "class._mat-animation-noopable": "_noopAnimations", "style.width.px": "diameter", "style.height.px": "diameter", "attr.aria-valuemin": "mode === \"determinate\" ? 0 : null", "attr.aria-valuemax": "mode === \"determinate\" ? 100 : null", "attr.aria-valuenow": "mode === \"determinate\" ? value : null", "attr.mode": "mode" }, classAttribute: "mat-progress-spinner mat-spinner" }, exportAs: ["matProgressSpinner"], usesInheritance: true, ngImport: i0, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] svg{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}\n"], directives: [{ type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatProgressSpinner, decorators: [{
            type: Component,
            args: [{ selector: 'mat-progress-spinner, mat-spinner', exportAs: 'matProgressSpinner', host: {
                        'role': 'progressbar',
                        // `mat-spinner` is here for backward compatibility.
                        'class': 'mat-progress-spinner mat-spinner',
                        // set tab index to -1 so screen readers will read the aria-label
                        // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
                        'tabindex': '-1',
                        '[class._mat-animation-noopable]': `_noopAnimations`,
                        '[style.width.px]': 'diameter',
                        '[style.height.px]': 'diameter',
                        '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
                        '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
                        '[attr.aria-valuenow]': 'mode === "determinate" ? value : null',
                        '[attr.mode]': 'mode',
                    }, inputs: ['color'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transition:stroke-dashoffset 225ms linear}._mat-animation-noopable.mat-progress-spinner circle{transition:none;animation:none}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] svg{transition:none;animation:none}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}._mat-animation-noopable.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition:none;animation:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS]
                }] }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i0.NgZone }]; }, propDecorators: { diameter: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], mode: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxRQUFRLEVBQ1IsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUVqQixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFXLFVBQVUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBS2xDOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0Qjs7O0dBR0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qix5REFBeUQ7QUFDekQsb0JBQW9CO0FBQ3BCLE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUN4QztJQUNFLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lB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QUF1Qzt3QkFDL0QsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLFVBQ08sQ0FBQyxPQUFPLENBQUMsbUJBR0EsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTs7MEJBdUVsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7OzBCQUMzQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQ3hDLE1BQU07MkJBQUMsb0NBQW9DOzZIQXZDMUMsUUFBUTtzQkFEWCxLQUFLO2dCQWdCRixXQUFXO3NCQURkLEtBQUs7Z0JBU0csSUFBSTtzQkFBWixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm0sIF9nZXRTaGFkb3dSb290fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKiogUG9zc2libGUgbW9kZSBmb3IgYSBwcm9ncmVzcyBzcGlubmVyLiAqL1xuZXhwb3J0IHR5cGUgUHJvZ3Jlc3NTcGlubmVyTW9kZSA9ICdkZXRlcm1pbmF0ZScgfCAnaW5kZXRlcm1pbmF0ZSc7XG5cbi8qKlxuICogQmFzZSByZWZlcmVuY2Ugc2l6ZSBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TSVpFID0gMTAwO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHN0cm9rZSB3aWR0aCBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TVFJPS0VfV0lEVEggPSAxMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRQcm9ncmVzc1NwaW5uZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFByb2dyZXNzU3Bpbm5lckJhc2UgPSBtaXhpbkNvbG9yKFxuICBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICB9LFxuICAncHJpbWFyeScsXG4pO1xuXG4vKiogRGVmYXVsdCBgbWF0LXByb2dyZXNzLXNwaW5uZXJgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMge1xuICAvKiogRGlhbWV0ZXIgb2YgdGhlIHNwaW5uZXIuICovXG4gIGRpYW1ldGVyPzogbnVtYmVyO1xuICAvKiogV2lkdGggb2YgdGhlIHNwaW5uZXIncyBzdHJva2UuICovXG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICAvKipcbiAgICogV2hldGhlciB0aGUgYW5pbWF0aW9ucyBzaG91bGQgYmUgZm9yY2UgdG8gYmUgZW5hYmxlZCwgaWdub3JpbmcgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXNcbiAgICogdXNpbmcgTm9vcEFuaW1hdGlvbnNNb2R1bGUuXG4gICAqL1xuICBfZm9yY2VBbmltYXRpb25zPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcmAuICovXG5leHBvcnQgY29uc3QgTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zPignbWF0LXByb2dyZXNzLXNwaW5uZXItZGVmYXVsdC1vcHRpb25zJywge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge2RpYW1ldGVyOiBCQVNFX1NJWkV9O1xufVxuXG4vLyAuMDAwMSBwZXJjZW50YWdlIGRpZmZlcmVuY2UgaXMgbmVjZXNzYXJ5IGluIG9yZGVyIHRvIGF2b2lkIHVud2FudGVkIGFuaW1hdGlvbiBmcmFtZXNcbi8vIGZvciBleGFtcGxlIGJlY2F1c2UgdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpcyA0IHNlY29uZHMsIC4xJSBhY2NvdW50cyB0byA0bXNcbi8vIHdoaWNoIGFyZSBlbm91Z2ggdG8gc2VlIHRoZSBmbGlja2VyIGRlc2NyaWJlZCBpblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvODk4NFxuY29uc3QgSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEUgPSBgXG4gQGtleWZyYW1lcyBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1zdHJva2Utcm90YXRlLURJQU1FVEVSIHtcbiAgICAwJSAgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoNzIuNWRlZyk7IH1cbiAgICAyNSUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDcyLjVkZWcpOyB9XG5cbiAgICAyNS4wMDAxJSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMjcwZGVnKTsgfVxuICAgIDM3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgyNzBkZWcpOyB9XG4gICAgMzcuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDE2MS41ZGVnKTsgfVxuICAgIDUwJSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMTYxLjVkZWcpOyB9XG5cbiAgICA1MC4wMDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpOyB9XG4gICAgNjIuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7IH1cbiAgICA2Mi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMjUxLjVkZWcpOyB9XG4gICAgNzUlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgyNTEuNWRlZyk7IH1cblxuICAgIDc1LjAwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTsgfVxuICAgIDg3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7IH1cbiAgICA4Ny41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMzQxLjVkZWcpOyB9XG4gICAgMTAwJSAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgzNDEuNWRlZyk7IH1cbiAgfVxuYDtcblxuLyoqXG4gKiBgPG1hdC1wcm9ncmVzcy1zcGlubmVyPmAgY29tcG9uZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciwgbWF0LXNwaW5uZXInLFxuICBleHBvcnRBczogJ21hdFByb2dyZXNzU3Bpbm5lcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgLy8gYG1hdC1zcGlubmVyYCBpcyBoZXJlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgICdjbGFzcyc6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBtYXQtc3Bpbm5lcicsXG4gICAgLy8gc2V0IHRhYiBpbmRleCB0byAtMSBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgdGhlIGFyaWEtbGFiZWxcbiAgICAvLyBOb3RlOiB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdpdGggSkFXUyB0aGF0IGRvZXMgbm90IHJlYWQgcHJvZ3Jlc3NiYXIgYXJpYSBsYWJlbHMgb24gRmlyZUZveFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX25vb3BBbmltYXRpb25zYCxcbiAgICAnW3N0eWxlLndpZHRoLnB4XSc6ICdkaWFtZXRlcicsXG4gICAgJ1tzdHlsZS5oZWlnaHQucHhdJzogJ2RpYW1ldGVyJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gMCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyAxMDAgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gdmFsdWUgOiBudWxsJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzLXNwaW5uZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1zcGlubmVyLmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVyXG4gIGV4dGVuZHMgX01hdFByb2dyZXNzU3Bpbm5lckJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgcHJpdmF0ZSBfZGlhbWV0ZXIgPSBCQVNFX1NJWkU7XG4gIHByaXZhdGUgX3ZhbHVlID0gMDtcbiAgcHJpdmF0ZSBfc3Ryb2tlV2lkdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcmVzaXplU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBFbGVtZW50IHRvIHdoaWNoIHdlIHNob3VsZCBhZGQgdGhlIGdlbmVyYXRlZCBzdHlsZSB0YWdzIGZvciB0aGUgaW5kZXRlcm1pbmF0ZSBhbmltYXRpb24uXG4gICAqIEZvciBtb3N0IGVsZW1lbnRzIHRoaXMgaXMgdGhlIGRvY3VtZW50LCBidXQgZm9yIHRoZSBvbmVzIGluIHRoZSBTaGFkb3cgRE9NIHdlIG5lZWQgdG9cbiAgICogdXNlIHRoZSBzaGFkb3cgcm9vdC5cbiAgICovXG4gIHByaXZhdGUgX3N0eWxlUm9vdDogTm9kZTtcblxuICAvKipcbiAgICogVHJhY2tzIGRpYW1ldGVycyBvZiBleGlzdGluZyBpbnN0YW5jZXMgdG8gZGUtZHVwZSBnZW5lcmF0ZWQgc3R5bGVzIChkZWZhdWx0IGQgPSAxMDApLlxuICAgKiBXZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2Ygd2hpY2ggZWxlbWVudHMgdGhlIGRpYW1ldGVycyB3ZXJlIGF0dGFjaGVkIHRvLCBiZWNhdXNlIGZvclxuICAgKiBlbGVtZW50cyBpbiB0aGUgU2hhZG93IERPTSB0aGUgc3R5bGUgdGFncyBhcmUgYXR0YWNoZWQgdG8gdGhlIHNoYWRvdyByb290LCByYXRoZXJcbiAgICogdGhhbiB0aGUgZG9jdW1lbnQgaGVhZC5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9kaWFtZXRlcnMgPSBuZXcgV2Vha01hcDxOb2RlLCBTZXQ8bnVtYmVyPj4oKTtcblxuICAvKiogV2hldGhlciB0aGUgX21hdC1hbmltYXRpb24tbm9vcGFibGUgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQsIGRpc2FibGluZyBhbmltYXRpb25zLiAgKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKiBBIHN0cmluZyB0aGF0IGlzIHVzZWQgZm9yIHNldHRpbmcgdGhlIHNwaW5uZXIgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5ICovXG4gIF9zcGlubmVyQW5pbWF0aW9uTGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlIGRpYW1ldGVyIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyICh3aWxsIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHN2ZykuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaWFtZXRlcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kaWFtZXRlcjtcbiAgfVxuICBzZXQgZGlhbWV0ZXIoc2l6ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9kaWFtZXRlciA9IGNvZXJjZU51bWJlclByb3BlcnR5KHNpemUpO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBzZXQgYmVmb3JlIGBuZ09uSW5pdGAsIHRoZSBzdHlsZSByb290IG1heSBub3QgaGF2ZSBiZWVuIHJlc29sdmVkIHlldC5cbiAgICBpZiAodGhpcy5fc3R5bGVSb290KSB7XG4gICAgICB0aGlzLl9hdHRhY2hTdHlsZU5vZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3Ryb2tlV2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3Ryb2tlV2lkdGggfHwgdGhpcy5kaWFtZXRlciAvIDEwO1xuICB9XG4gIHNldCBzdHJva2VXaWR0aCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9zdHJva2VXaWR0aCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUgKi9cbiAgQElucHV0KCkgbW9kZTogUHJvZ3Jlc3NTcGlubmVyTW9kZSA9ICdkZXRlcm1pbmF0ZSc7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScgPyB0aGlzLl92YWx1ZSA6IDA7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3ZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBjb2VyY2VOdW1iZXJQcm9wZXJ0eShuZXdWYWx1ZSkpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TKVxuICAgIGRlZmF1bHRzPzogTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGNoYW5nZURldGVjdG9yUmVmYCwgYHZpZXdwb3J0UnVsZXJgIGFuZCBgbmdab25lYFxuICAgICAqIHBhcmFtZXRlcnMgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wXG4gICAgICovXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyPzogVmlld3BvcnRSdWxlcixcbiAgICBuZ1pvbmU/OiBOZ1pvbmUsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgY29uc3QgdHJhY2tlZERpYW1ldGVycyA9IE1hdFByb2dyZXNzU3Bpbm5lci5fZGlhbWV0ZXJzO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gVGhlIGJhc2Ugc2l6ZSBpcyBhbHJlYWR5IGluc2VydGVkIHZpYSB0aGUgY29tcG9uZW50J3Mgc3RydWN0dXJhbCBzdHlsZXMuIFdlIHN0aWxsXG4gICAgLy8gbmVlZCB0byB0cmFjayBpdCBzbyB3ZSBkb24ndCBlbmQgdXAgYWRkaW5nIHRoZSBzYW1lIHN0eWxlcyBhZ2Fpbi5cbiAgICBpZiAoIXRyYWNrZWREaWFtZXRlcnMuaGFzKF9kb2N1bWVudC5oZWFkKSkge1xuICAgICAgdHJhY2tlZERpYW1ldGVycy5zZXQoX2RvY3VtZW50LmhlYWQsIG5ldyBTZXQ8bnVtYmVyPihbQkFTRV9TSVpFXSkpO1xuICAgIH1cblxuICAgIHRoaXMuX25vb3BBbmltYXRpb25zID1cbiAgICAgIGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycgJiYgISFkZWZhdWx0cyAmJiAhZGVmYXVsdHMuX2ZvcmNlQW5pbWF0aW9ucztcblxuICAgIGlmIChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ21hdC1zcGlubmVyJykge1xuICAgICAgdGhpcy5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xuICAgIH1cblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmRpYW1ldGVyKSB7XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBkZWZhdWx0cy5kaWFtZXRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnN0cm9rZVdpZHRoKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSBkZWZhdWx0cy5zdHJva2VXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBjaXJjbGUgaXNuJ3QgcG9zaXRpb25lZCBjb3JyZWN0bHkgd2hlbiB0aGUgcGFnZSBoYXMgYVxuICAgIC8vIGRpZmZlcmVudCB6b29tIGxldmVsIGZyb20gdGhlIGRlZmF1bHQuIFRoaXMgaGFuZGxlciB0cmlnZ2VycyBhIHJlY2FsY3VsYXRpb24gb2YgdGhlXG4gICAgLy8gYHRyYW5zZm9ybS1vcmlnaW5gIHdoZW4gdGhlIHBhZ2Ugem9vbSBsZXZlbCBjaGFuZ2VzLlxuICAgIC8vIFNlZSBgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbmAgZm9yIG1vcmUgaW5mby5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgbnVsbCBjaGVja3MgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLFxuICAgIC8vIGB2aWV3cG9ydFJ1bGVyYCBhbmQgYG5nWm9uZWAuXG4gICAgaWYgKF9wbGF0Zm9ybS5pc0Jyb3dzZXIgJiYgX3BsYXRmb3JtLlNBRkFSSSAmJiB2aWV3cG9ydFJ1bGVyICYmIGNoYW5nZURldGVjdG9yUmVmICYmIG5nWm9uZSkge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gdmlld3BvcnRSdWxlci5jaGFuZ2UoMTUwKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBXaGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplIHdoaWxlIHRoZSBzcGlubmVyIGlzIGluIGBpbmRldGVybWluYXRlYCBtb2RlLCB3ZVxuICAgICAgICAvLyBoYXZlIHRvIG1hcmsgZm9yIGNoZWNrIHNvIHRoZSB0cmFuc2Zvcm0gb3JpZ2luIG9mIHRoZSBjaXJjbGUgY2FuIGJlIHJlY29tcHV0ZWQuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdpbmRldGVybWluYXRlJykge1xuICAgICAgICAgIG5nWm9uZS5ydW4oKCkgPT4gY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gbG9vayB1cCB0aGUgcm9vdCBub2RlIGluIG5nT25Jbml0LCByYXRoZXIgdGhhbiB0aGUgY29uc3RydWN0b3IsIGJlY2F1c2VcbiAgICAvLyBBbmd1bGFyIHNlZW1zIHRvIGNyZWF0ZSB0aGUgZWxlbWVudCBvdXRzaWRlIHRoZSBzaGFkb3cgcm9vdCBhbmQgdGhlbiBtb3ZlcyBpdCBpbnNpZGUsIGlmIHRoZVxuICAgIC8vIG5vZGUgaXMgaW5zaWRlIGFuIGBuZ0lmYCBhbmQgYSBTaGFkb3dEb20tZW5jYXBzdWxhdGVkIGNvbXBvbmVudC5cbiAgICB0aGlzLl9zdHlsZVJvb3QgPSBfZ2V0U2hhZG93Um9vdChlbGVtZW50KSB8fCB0aGlzLl9kb2N1bWVudC5oZWFkO1xuICAgIHRoaXMuX2F0dGFjaFN0eWxlTm9kZSgpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXByb2dyZXNzLXNwaW5uZXItaW5kZXRlcm1pbmF0ZS1hbmltYXRpb24nKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIHNwaW5uZXIsIGFkanVzdGVkIGZvciBzdHJva2Ugd2lkdGguICovXG4gIF9nZXRDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuICh0aGlzLmRpYW1ldGVyIC0gQkFTRV9TVFJPS0VfV0lEVEgpIC8gMjtcbiAgfVxuXG4gIC8qKiBUaGUgdmlldyBib3ggb2YgdGhlIHNwaW5uZXIncyBzdmcgZWxlbWVudC4gKi9cbiAgX2dldFZpZXdCb3goKSB7XG4gICAgY29uc3Qgdmlld0JveCA9IHRoaXMuX2dldENpcmNsZVJhZGl1cygpICogMiArIHRoaXMuc3Ryb2tlV2lkdGg7XG4gICAgcmV0dXJuIGAwIDAgJHt2aWV3Qm94fSAke3ZpZXdCb3h9YDtcbiAgfVxuXG4gIC8qKiBUaGUgc3Ryb2tlIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIF9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDIgKiBNYXRoLlBJICogdGhpcy5fZ2V0Q2lyY2xlUmFkaXVzKCk7XG4gIH1cblxuICAvKiogVGhlIGRhc2ggb2Zmc2V0IG9mIHRoZSBzdmcgY2lyY2xlLiAqL1xuICBfZ2V0U3Ryb2tlRGFzaE9mZnNldCgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICByZXR1cm4gKHRoaXMuX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKSAqICgxMDAgLSB0aGlzLl92YWx1ZSkpIC8gMTAwO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgY2lyY2xlIGluIHBlcmNlbnQuICovXG4gIF9nZXRDaXJjbGVTdHJva2VXaWR0aCgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3Ryb2tlV2lkdGggLyB0aGlzLmRpYW1ldGVyKSAqIDEwMDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZm9yIHRoZSBpbm5lciBjaXJjbGUgZWxlbWVudC4gKi9cbiAgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmc6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkIHdoZW4gdGhlIHBhZ2VcbiAgICAvLyBoYXMgYSBkaWZmZXJlbnQgem9vbSBsZXZlbCBmcm9tIHRoZSBkZWZhdWx0LiBUaGUgcHJvYmxlbSBhcHBlYXJzIHRvIGJlIHRoYXQgYSB6b29tXG4gICAgLy8gaXMgYXBwbGllZCBvbiB0aGUgYHN2Z2Agbm9kZSBpdHNlbGYuIFdlIGNhbiB3b3JrIGFyb3VuZCBpdCBieSBjYWxjdWxhdGluZyB0aGUgb3JpZ2luXG4gICAgLy8gYmFzZWQgb24gdGhlIHpvb20gbGV2ZWwuIE9uIGFsbCBvdGhlciBicm93c2VycyB0aGUgYGN1cnJlbnRTY2FsZWAgYXBwZWFycyB0byBhbHdheXMgYmUgMS5cbiAgICBjb25zdCBzY2FsZSA9ICgoc3ZnIGFzIHVua25vd24gYXMgU1ZHU1ZHRWxlbWVudCkuY3VycmVudFNjYWxlID8/IDEpICogNTA7XG4gICAgcmV0dXJuIGAke3NjYWxlfSUgJHtzY2FsZX0lYDtcbiAgfVxuXG4gIC8qKiBEeW5hbWljYWxseSBnZW5lcmF0ZXMgYSBzdHlsZSB0YWcgY29udGFpbmluZyB0aGUgY29ycmVjdCBhbmltYXRpb24gZm9yIHRoaXMgZGlhbWV0ZXIuICovXG4gIHByaXZhdGUgX2F0dGFjaFN0eWxlTm9kZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzdHlsZVJvb3QgPSB0aGlzLl9zdHlsZVJvb3Q7XG4gICAgY29uc3QgY3VycmVudERpYW1ldGVyID0gdGhpcy5fZGlhbWV0ZXI7XG4gICAgY29uc3QgZGlhbWV0ZXJzID0gTWF0UHJvZ3Jlc3NTcGlubmVyLl9kaWFtZXRlcnM7XG4gICAgbGV0IGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBkaWFtZXRlcnMuZ2V0KHN0eWxlUm9vdCk7XG5cbiAgICBpZiAoIWRpYW1ldGVyc0ZvckVsZW1lbnQgfHwgIWRpYW1ldGVyc0ZvckVsZW1lbnQuaGFzKGN1cnJlbnREaWFtZXRlcikpIHtcbiAgICAgIGNvbnN0IHN0eWxlVGFnOiBIVE1MU3R5bGVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlVGFnLnNldEF0dHJpYnV0ZSgnbWF0LXNwaW5uZXItYW5pbWF0aW9uJywgdGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsKTtcbiAgICAgIHN0eWxlVGFnLnRleHRDb250ZW50ID0gdGhpcy5fZ2V0QW5pbWF0aW9uVGV4dCgpO1xuICAgICAgc3R5bGVSb290LmFwcGVuZENoaWxkKHN0eWxlVGFnKTtcblxuICAgICAgaWYgKCFkaWFtZXRlcnNGb3JFbGVtZW50KSB7XG4gICAgICAgIGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgICAgZGlhbWV0ZXJzLnNldChzdHlsZVJvb3QsIGRpYW1ldGVyc0ZvckVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBkaWFtZXRlcnNGb3JFbGVtZW50LmFkZChjdXJyZW50RGlhbWV0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZW5lcmF0ZXMgYW5pbWF0aW9uIHN0eWxlcyBhZGp1c3RlZCBmb3IgdGhlIHNwaW5uZXIncyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfZ2V0QW5pbWF0aW9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0cm9rZUNpcmN1bWZlcmVuY2UgPSB0aGlzLl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIElOREVURVJNSU5BVEVfQU5JTUFUSU9OX1RFTVBMQVRFXG4gICAgICAgIC8vIEFuaW1hdGlvbiBzaG91bGQgYmVnaW4gYXQgNSUgYW5kIGVuZCBhdCA4MCVcbiAgICAgICAgLnJlcGxhY2UoL1NUQVJUX1ZBTFVFL2csIGAkezAuOTUgKiBzdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9FTkRfVkFMVUUvZywgYCR7MC4yICogc3Ryb2tlQ2lyY3VtZmVyZW5jZX1gKVxuICAgICAgICAucmVwbGFjZSgvRElBTUVURVIvZywgYCR7dGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsfWApXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBjaXJjbGUgZGlhbWV0ZXIgZm9ybWF0dGVkIGZvciB1c2Ugd2l0aCB0aGUgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5LiAqL1xuICBwcml2YXRlIF9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAvLyBUaGUgc3RyaW5nIG9mIGEgZmxvYXQgcG9pbnQgbnVtYmVyIHdpbGwgaW5jbHVkZSBhIHBlcmlvZCDigJgu4oCZIGNoYXJhY3RlcixcbiAgICAvLyB3aGljaCBpcyBub3QgdmFsaWQgZm9yIGEgQ1NTIGFuaW1hdGlvbi1uYW1lLlxuICAgIHJldHVybiB0aGlzLmRpYW1ldGVyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICdfJyk7XG4gIH1cbn1cbiIsIjwhLS1cbiAgcHJlc2VydmVBc3BlY3RSYXRpbyBvZiB4TWlkWU1pZCBtZWV0IGFzIHRoZSBjZW50ZXIgb2YgdGhlIHZpZXdwb3J0IGlzIHRoZSBjaXJjbGUnc1xuICBjZW50ZXIuIFRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSB3aWxsIHJlbWFpbiBhdCB0aGUgY2VudGVyIG9mIHRoZSBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lclxuICBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIFNWRy5cbi0tPlxuPCEtLVxuICBBbGwgY2hpbGRyZW4gbmVlZCB0byBiZSBoaWRkZW4gZm9yIHNjcmVlbiByZWFkZXJzIGluIG9yZGVyIHRvIHN1cHBvcnQgQ2hyb21lVm94LlxuICBNb3JlIGNvbnRleHQgaW4gdGhlIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMjE2NS5cbi0tPlxuPHN2Z1xuICBbc3R5bGUud2lkdGgucHhdPVwiZGlhbWV0ZXJcIlxuICBbc3R5bGUuaGVpZ2h0LnB4XT1cImRpYW1ldGVyXCJcbiAgW2F0dHIudmlld0JveF09XCJfZ2V0Vmlld0JveCgpXCJcbiAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIlxuICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gIFtuZ1N3aXRjaF09XCJtb2RlID09PSAnaW5kZXRlcm1pbmF0ZSdcIlxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAjc3ZnPlxuXG4gIDwhLS1cbiAgICBUZWNobmljYWxseSB3ZSBjYW4gcmV1c2UgdGhlIHNhbWUgYGNpcmNsZWAgZWxlbWVudCwgaG93ZXZlciBTYWZhcmkgaGFzIGFuIGlzc3VlIHRoYXQgYnJlYWtzXG4gICAgdGhlIFNWRyByZW5kZXJpbmcgaW4gZGV0ZXJtaW5hdGUgbW9kZSwgYWZ0ZXIgc3dpdGNoaW5nIGJldHdlZW4gaW5kZXRlcm1pbmF0ZSBhbmQgZGV0ZXJtaW5hdGUuXG4gICAgVXNpbmcgYSBkaWZmZXJlbnQgZWxlbWVudCBhdm9pZHMgdGhlIGlzc3VlLiBBbiBhbHRlcm5hdGl2ZSB0byB0aGlzIGlzIGFkZGluZyBgZGlzcGxheTogbm9uZWBcbiAgICBmb3IgYSBzcGxpdCBzZWNvbmQgYW5kIHRoZW4gcmVtb3ZpbmcgaXQgd2hlbiBzd2l0Y2hpbmcgYmV0d2VlbiBtb2RlcywgYnV0IGl0J3MgaGFyZCB0byBrbm93XG4gICAgZm9yIGhvdyBsb25nIHRvIGhpZGUgdGhlIGVsZW1lbnQgYW5kIGl0IGNhbiBjYXVzZSB0aGUgVUkgdG8gYmxpbmsuXG4gIC0tPlxuICA8Y2lyY2xlXG4gICAgKm5nU3dpdGNoQ2FzZT1cInRydWVcIlxuICAgIGN4PVwiNTAlXCJcbiAgICBjeT1cIjUwJVwiXG4gICAgW2F0dHIucl09XCJfZ2V0Q2lyY2xlUmFkaXVzKClcIlxuICAgIFtzdHlsZS5hbmltYXRpb24tbmFtZV09XCInbWF0LXByb2dyZXNzLXNwaW5uZXItc3Ryb2tlLXJvdGF0ZS0nICsgX3NwaW5uZXJBbmltYXRpb25MYWJlbFwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG5cbiAgPGNpcmNsZVxuICAgICpuZ1N3aXRjaENhc2U9XCJmYWxzZVwiXG4gICAgY3g9XCI1MCVcIlxuICAgIGN5PVwiNTAlXCJcbiAgICBbYXR0ci5yXT1cIl9nZXRDaXJjbGVSYWRpdXMoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG48L3N2Zz5cbiJdfQ==