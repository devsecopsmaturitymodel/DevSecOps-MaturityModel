/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, } from '@angular/core';
import { RippleRenderer } from './ripple-renderer';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Injection token that can be used to specify the global ripple options. */
export const MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken('mat-ripple-global-options');
export class MatRipple {
    constructor(_elementRef, ngZone, platform, globalOptions, _animationMode) {
        this._elementRef = _elementRef;
        this._animationMode = _animationMode;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.radius = 0;
        this._disabled = false;
        /** Whether ripple directive is initialized and the input bindings are set. */
        this._isInitialized = false;
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform);
    }
    /**
     * Whether click events will not trigger the ripple. Ripples can be still launched manually
     * by using the `launch()` method.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value) {
            this.fadeOutAllNonPersistent();
        }
        this._disabled = value;
        this._setupTriggerEventsIfEnabled();
    }
    /**
     * The element that triggers the ripple when click events are received.
     * Defaults to the directive's host element.
     */
    get trigger() {
        return this._trigger || this._elementRef.nativeElement;
    }
    set trigger(trigger) {
        this._trigger = trigger;
        this._setupTriggerEventsIfEnabled();
    }
    ngOnInit() {
        this._isInitialized = true;
        this._setupTriggerEventsIfEnabled();
    }
    ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
    }
    /** Fades out all currently showing ripple elements. */
    fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
    }
    /** Fades out all currently showing non-persistent ripple elements. */
    fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
    }
    /**
     * Ripple configuration from the directive's input values.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleConfig() {
        return {
            centered: this.centered,
            radius: this.radius,
            color: this.color,
            animation: {
                ...this._globalOptions.animation,
                ...(this._animationMode === 'NoopAnimations' ? { enterDuration: 0, exitDuration: 0 } : {}),
                ...this.animation,
            },
            terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
    }
    /**
     * Whether ripples on pointer-down are disabled or not.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
    }
    /** Sets up the trigger event listeners if ripples are enabled. */
    _setupTriggerEventsIfEnabled() {
        if (!this.disabled && this._isInitialized) {
            this._rippleRenderer.setupTriggerEvents(this.trigger);
        }
    }
    /** Launches a manual ripple at the specified coordinated or just by the ripple config. */
    launch(configOrX, y = 0, config) {
        if (typeof configOrX === 'number') {
            return this._rippleRenderer.fadeInRipple(configOrX, y, { ...this.rippleConfig, ...config });
        }
        else {
            return this._rippleRenderer.fadeInRipple(0, 0, { ...this.rippleConfig, ...configOrX });
        }
    }
}
MatRipple.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRipple, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatRipple.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-ripple], [matRipple]',
                    exportAs: 'matRipple',
                    host: {
                        'class': 'mat-ripple',
                        '[class.mat-ripple-unbounded]': 'unbounded',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { color: [{
                type: Input,
                args: ['matRippleColor']
            }], unbounded: [{
                type: Input,
                args: ['matRippleUnbounded']
            }], centered: [{
                type: Input,
                args: ['matRippleCentered']
            }], radius: [{
                type: Input,
                args: ['matRippleRadius']
            }], animation: [{
                type: Input,
                args: ['matRippleAnimation']
            }], disabled: [{
                type: Input,
                args: ['matRippleDisabled']
            }], trigger: [{
                type: Input,
                args: ['matRippleTrigger']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvcmlwcGxlL3JpcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFDL0QsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQXdCM0UsNkVBQTZFO0FBQzdFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsQ0FDNUIsQ0FBQztBQVVGLE1BQU0sT0FBTyxTQUFTO0lBbUVwQixZQUNVLFdBQW9DLEVBQzVDLE1BQWMsRUFDZCxRQUFrQixFQUM2QixhQUFtQyxFQUMvQixjQUF1QjtRQUpsRSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFJTyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQTNENUU7Ozs7V0FJRztRQUN1QixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBd0JyQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBc0JuQyw4RUFBOEU7UUFDdEUsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFTdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQWpERDs7O09BR0c7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElB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QkFSckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsV0FBVztvQkFDckIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxZQUFZO3dCQUNyQiw4QkFBOEIsRUFBRSxXQUFXO3FCQUM1QztpQkFDRjs7MEJBd0VJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMseUJBQXlCOzswQkFDNUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBdEVsQixLQUFLO3NCQUE3QixLQUFLO3VCQUFDLGdCQUFnQjtnQkFHTSxTQUFTO3NCQUFyQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFNQyxRQUFRO3NCQUFuQyxLQUFLO3VCQUFDLG1CQUFtQjtnQkFPQSxNQUFNO3NCQUEvQixLQUFLO3VCQUFDLGlCQUFpQjtnQkFPSyxTQUFTO3NCQUFyQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFPdkIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLG1CQUFtQjtnQkFrQnRCLE9BQU87c0JBRFYsS0FBSzt1QkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmlwcGxlQW5pbWF0aW9uQ29uZmlnLCBSaXBwbGVDb25maWcsIFJpcHBsZVJlZn0gZnJvbSAnLi9yaXBwbGUtcmVmJztcbmltcG9ydCB7UmlwcGxlUmVuZGVyZXIsIFJpcHBsZVRhcmdldH0gZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBDb25maWd1cmFibGUgb3B0aW9ucyBmb3IgYG1hdFJpcHBsZWAuICovXG5leHBvcnQgaW50ZXJmYWNlIFJpcHBsZUdsb2JhbE9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZC4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHkgYnkgdXNpbmdcbiAgICogdGhlIGBsYXVuY2goKWAgbWV0aG9kLiBUaGVyZWZvcmUgZm9jdXMgaW5kaWNhdG9ycyB3aWxsIHN0aWxsIHNob3cgdXAuXG4gICAqL1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBvZiB0aGUgcmlwcGxlcy4gVGhlcmUgYXJlIHR3byBwaGFzZXMgd2l0aFxuICAgKiBkaWZmZXJlbnQgZHVyYXRpb25zIGZvciB0aGUgcmlwcGxlczogYGVudGVyYCBhbmQgYGxlYXZlYC4gVGhlIGR1cmF0aW9ucyB3aWxsIGJlIG92ZXJ3cml0dGVuXG4gICAqIGJ5IHRoZSB2YWx1ZSBvZiBgbWF0UmlwcGxlQW5pbWF0aW9uYCBvciBpZiB0aGUgYE5vb3BBbmltYXRpb25zTW9kdWxlYCBpcyBpbmNsdWRlZC5cbiAgICovXG4gIGFuaW1hdGlvbj86IFJpcHBsZUFuaW1hdGlvbkNvbmZpZztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIHNob3VsZCBzdGFydCBmYWRpbmcgb3V0IGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBtb3VzZSBvciB0b3VjaCBpcyByZWxlYXNlZC4gQnlcbiAgICogZGVmYXVsdCwgcmlwcGxlcyB3aWxsIHdhaXQgZm9yIHRoZSBlbnRlciBhbmltYXRpb24gdG8gY29tcGxldGUgYW5kIGZvciBtb3VzZSBvciB0b3VjaCByZWxlYXNlLlxuICAgKi9cbiAgdGVybWluYXRlT25Qb2ludGVyVXA/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48UmlwcGxlR2xvYmFsT3B0aW9ucz4oXG4gICdtYXQtcmlwcGxlLWdsb2JhbC1vcHRpb25zJyxcbik7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtcmlwcGxlXSwgW21hdFJpcHBsZV0nLFxuICBleHBvcnRBczogJ21hdFJpcHBsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXJpcHBsZScsXG4gICAgJ1tjbGFzcy5tYXQtcmlwcGxlLXVuYm91bmRlZF0nOiAndW5ib3VuZGVkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBDdXN0b20gY29sb3IgZm9yIGFsbCByaXBwbGVzLiAqL1xuICBASW5wdXQoJ21hdFJpcHBsZUNvbG9yJykgY29sb3I6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlcyBzaG91bGQgYmUgdmlzaWJsZSBvdXRzaWRlIHRoZSBjb21wb25lbnQncyBib3VuZHMuICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVW5ib3VuZGVkJykgdW5ib3VuZGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByaXBwbGUgYWx3YXlzIG9yaWdpbmF0ZXMgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBob3N0IGVsZW1lbnQncyBib3VuZHMsIHJhdGhlclxuICAgKiB0aGFuIG9yaWdpbmF0aW5nIGZyb20gdGhlIGxvY2F0aW9uIG9mIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQ2VudGVyZWQnKSBjZW50ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgc2V0LCB0aGUgcmFkaXVzIGluIHBpeGVscyBvZiBmb3JlZ3JvdW5kIHJpcHBsZXMgd2hlbiBmdWxseSBleHBhbmRlZC4gSWYgdW5zZXQsIHRoZSByYWRpdXNcbiAgICogd2lsbCBiZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSByaXBwbGUgdG8gdGhlIGZ1cnRoZXN0IGNvcm5lciBvZiB0aGUgaG9zdCBlbGVtZW50J3NcbiAgICogYm91bmRpbmcgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVSYWRpdXMnKSByYWRpdXM6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSByaXBwbGUgYW5pbWF0aW9uLiBBbGxvd3MgbW9kaWZ5aW5nIHRoZSBlbnRlciBhbmQgZXhpdCBhbmltYXRpb25cbiAgICogZHVyYXRpb24gb2YgdGhlIHJpcHBsZXMuIFRoZSBhbmltYXRpb24gZHVyYXRpb25zIHdpbGwgYmUgb3ZlcndyaXR0ZW4gaWYgdGhlXG4gICAqIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlQW5pbWF0aW9uJykgYW5pbWF0aW9uOiBSaXBwbGVBbmltYXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY2xpY2sgZXZlbnRzIHdpbGwgbm90IHRyaWdnZXIgdGhlIHJpcHBsZS4gUmlwcGxlcyBjYW4gYmUgc3RpbGwgbGF1bmNoZWQgbWFudWFsbHlcbiAgICogYnkgdXNpbmcgdGhlIGBsYXVuY2goKWAgbWV0aG9kLlxuICAgKi9cbiAgQElucHV0KCdtYXRSaXBwbGVEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmZhZGVPdXRBbGxOb25QZXJzaXN0ZW50KCk7XG4gICAgfVxuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VycyB0aGUgcmlwcGxlIHdoZW4gY2xpY2sgZXZlbnRzIGFyZSByZWNlaXZlZC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGRpcmVjdGl2ZSdzIGhvc3QgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0UmlwcGxlVHJpZ2dlcicpXG4gIGdldCB0cmlnZ2VyKCkge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyIHx8IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuICBzZXQgdHJpZ2dlcih0cmlnZ2VyOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX3RyaWdnZXIgPSB0cmlnZ2VyO1xuICAgIHRoaXMuX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpO1xuICB9XG4gIHByaXZhdGUgX3RyaWdnZXI6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBSZW5kZXJlciBmb3IgdGhlIHJpcHBsZSBET00gbWFuaXB1bGF0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfcmlwcGxlUmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIC8qKiBPcHRpb25zIHRoYXQgYXJlIHNldCBnbG9iYWxseSBmb3IgYWxsIHJpcHBsZXMuICovXG4gIHByaXZhdGUgX2dsb2JhbE9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlIGRpcmVjdGl2ZSBpcyBpbml0aWFsaXplZCBhbmQgdGhlIGlucHV0IGJpbmRpbmdzIGFyZSBzZXQuICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxPcHRpb25zPzogUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgdGhpcy5fZ2xvYmFsT3B0aW9ucyA9IGdsb2JhbE9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBfZWxlbWVudFJlZiwgcGxhdGZvcm0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fc2V0dXBUcmlnZ2VyRXZlbnRzSWZFbmFibGVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgLyoqIEZhZGVzIG91dCBhbGwgY3VycmVudGx5IHNob3dpbmcgcmlwcGxlIGVsZW1lbnRzLiAqL1xuICBmYWRlT3V0QWxsKCkge1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVPdXRBbGwoKTtcbiAgfVxuXG4gIC8qKiBGYWRlcyBvdXQgYWxsIGN1cnJlbnRseSBzaG93aW5nIG5vbi1wZXJzaXN0ZW50IHJpcHBsZSBlbGVtZW50cy4gKi9cbiAgZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKSB7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuZmFkZU91dEFsbE5vblBlcnNpc3RlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBkaXJlY3RpdmUncyBpbnB1dCB2YWx1ZXMuXG4gICAqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBSaXBwbGVUYXJnZXRcbiAgICovXG4gIGdldCByaXBwbGVDb25maWcoKTogUmlwcGxlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyZWQ6IHRoaXMuY2VudGVyZWQsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgLi4udGhpcy5fZ2xvYmFsT3B0aW9ucy5hbmltYXRpb24sXG4gICAgICAgIC4uLih0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnID8ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH0gOiB7fSksXG4gICAgICAgIC4uLnRoaXMuYW5pbWF0aW9uLFxuICAgICAgfSxcbiAgICAgIHRlcm1pbmF0ZU9uUG9pbnRlclVwOiB0aGlzLl9nbG9iYWxPcHRpb25zLnRlcm1pbmF0ZU9uUG9pbnRlclVwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIG9uIHBvaW50ZXItZG93biBhcmUgZGlzYWJsZWQgb3Igbm90LlxuICAgKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgUmlwcGxlVGFyZ2V0XG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgISF0aGlzLl9nbG9iYWxPcHRpb25zLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIHRyaWdnZXIgZXZlbnQgbGlzdGVuZXJzIGlmIHJpcHBsZXMgYXJlIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX3NldHVwVHJpZ2dlckV2ZW50c0lmRW5hYmxlZCgpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuc2V0dXBUcmlnZ2VyRXZlbnRzKHRoaXMudHJpZ2dlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExhdW5jaGVzIGEgbWFudWFsIHJpcHBsZSB1c2luZyB0aGUgc3BlY2lmaWVkIHJpcHBsZSBjb25maWd1cmF0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYW51YWwgcmlwcGxlLlxuICAgKi9cbiAgbGF1bmNoKGNvbmZpZzogUmlwcGxlQ29uZmlnKTogUmlwcGxlUmVmO1xuXG4gIC8qKlxuICAgKiBMYXVuY2hlcyBhIG1hbnVhbCByaXBwbGUgYXQgdGhlIHNwZWNpZmllZCBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB4IENvb3JkaW5hdGUgYWxvbmcgdGhlIFggYXhpcyBhdCB3aGljaCB0byBmYWRlLWluIHRoZSByaXBwbGUuIENvb3JkaW5hdGVcbiAgICogICBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0geSBDb29yZGluYXRlIGFsb25nIHRoZSBZIGF4aXMgYXQgd2hpY2ggdG8gZmFkZS1pbiB0aGUgcmlwcGxlLiBDb29yZGluYXRlXG4gICAqICAgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIGNvbmZpZyBPcHRpb25hbCByaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIG1hbnVhbCByaXBwbGUuXG4gICAqL1xuICBsYXVuY2goeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbmZpZz86IFJpcHBsZUNvbmZpZyk6IFJpcHBsZVJlZjtcblxuICAvKiogTGF1bmNoZXMgYSBtYW51YWwgcmlwcGxlIGF0IHRoZSBzcGVjaWZpZWQgY29vcmRpbmF0ZWQgb3IganVzdCBieSB0aGUgcmlwcGxlIGNvbmZpZy4gKi9cbiAgbGF1bmNoKGNvbmZpZ09yWDogbnVtYmVyIHwgUmlwcGxlQ29uZmlnLCB5OiBudW1iZXIgPSAwLCBjb25maWc/OiBSaXBwbGVDb25maWcpOiBSaXBwbGVSZWYge1xuICAgIGlmICh0eXBlb2YgY29uZmlnT3JYID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3JpcHBsZVJlbmRlcmVyLmZhZGVJblJpcHBsZShjb25maWdPclgsIHksIHsuLi50aGlzLnJpcHBsZUNvbmZpZywgLi4uY29uZmlnfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9yaXBwbGVSZW5kZXJlci5mYWRlSW5SaXBwbGUoMCwgMCwgey4uLnRoaXMucmlwcGxlQ29uZmlnLCAuLi5jb25maWdPclh9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==