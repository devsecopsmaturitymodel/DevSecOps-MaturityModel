/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectorRef, Input, Inject, Output, EventEmitter, ElementRef, Directive, Optional, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, forwardRef, ViewChild, } from '@angular/core';
import { TemplatePortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { matTabsAnimations } from './tabs-animations';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
export class MatTabBodyPortal extends CdkPortalOutlet {
    constructor(componentFactoryResolver, viewContainerRef, _host, _document) {
        super(componentFactoryResolver, viewContainerRef, _document);
        this._host = _host;
        /** Subscription to events for when the tab body begins centering. */
        this._centeringSub = Subscription.EMPTY;
        /** Subscription to events for when the tab body finishes leaving from center position. */
        this._leavingSub = Subscription.EMPTY;
    }
    /** Set initial visibility or set up subscription for changing visibility. */
    ngOnInit() {
        super.ngOnInit();
        this._centeringSub = this._host._beforeCentering
            .pipe(startWith(this._host._isCenterPosition(this._host._position)))
            .subscribe((isCentering) => {
            if (isCentering && !this.hasAttached()) {
                this.attach(this._host._content);
            }
        });
        this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
            this.detach();
        });
    }
    /** Clean up centering subscription. */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._centeringSub.unsubscribe();
        this._leavingSub.unsubscribe();
    }
}
MatTabBodyPortal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabBodyPortal, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }, { token: forwardRef(() => MatTabBody) }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
MatTabBodyPortal.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTabBodyPortal, selector: "[matTabBodyHost]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabBodyPortal, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTabBodyHost]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }, { type: MatTabBody, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatTabBody)]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/**
 * Base class with all of the `MatTabBody` functionality.
 * @docs-private
 */
export class _MatTabBodyBase {
    constructor(_elementRef, _dir, changeDetectorRef) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /** Subscription to the directionality change observable. */
        this._dirChangeSubscription = Subscription.EMPTY;
        /** Emits when an animation on the tab is complete. */
        this._translateTabComplete = new Subject();
        /** Event emitted when the tab begins to animate towards the center as the active tab. */
        this._onCentering = new EventEmitter();
        /** Event emitted before the centering of the tab begins. */
        this._beforeCentering = new EventEmitter();
        /** Event emitted before the centering of the tab begins. */
        this._afterLeavingCenter = new EventEmitter();
        /** Event emitted when the tab completes its animation towards the center. */
        this._onCentered = new EventEmitter(true);
        // Note that the default value will always be overwritten by `MatTabBody`, but we need one
        // anyway to prevent the animations module from throwing an error if the body is used on its own.
        /** Duration for the tab's animation. */
        this.animationDuration = '500ms';
        if (_dir) {
            this._dirChangeSubscription = _dir.change.subscribe((dir) => {
                this._computePositionAnimationState(dir);
                changeDetectorRef.markForCheck();
            });
        }
        // Ensure that we get unique animation events, because the `.done` callback can get
        // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
        this._translateTabComplete
            .pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))
            .subscribe(event => {
            // If the transition to the center is complete, emit an event.
            if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
                this._onCentered.emit();
            }
            if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
                this._afterLeavingCenter.emit();
            }
        });
    }
    /** The shifted index position of the tab body, where zero represents the active center tab. */
    set position(position) {
        this._positionIndex = position;
        this._computePositionAnimationState();
    }
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     */
    ngOnInit() {
        if (this._position == 'center' && this.origin != null) {
            this._position = this._computePositionFromOrigin(this.origin);
        }
    }
    ngOnDestroy() {
        this._dirChangeSubscription.unsubscribe();
        this._translateTabComplete.complete();
    }
    _onTranslateTabStarted(event) {
        const isCentering = this._isCenterPosition(event.toState);
        this._beforeCentering.emit(isCentering);
        if (isCentering) {
            this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    }
    /** The text direction of the containing app. */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Whether the provided position state is considered center, regardless of origin. */
    _isCenterPosition(position) {
        return (position == 'center' || position == 'left-origin-center' || position == 'right-origin-center');
    }
    /** Computes the position state that will be used for the tab-body animation trigger. */
    _computePositionAnimationState(dir = this._getLayoutDirection()) {
        if (this._positionIndex < 0) {
            this._position = dir == 'ltr' ? 'left' : 'right';
        }
        else if (this._positionIndex > 0) {
            this._position = dir == 'ltr' ? 'right' : 'left';
        }
        else {
            this._position = 'center';
        }
    }
    /**
     * Computes the position state based on the specified origin position. This is used if the
     * tab is becoming visible immediately after creation.
     */
    _computePositionFromOrigin(origin) {
        const dir = this._getLayoutDirection();
        if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
            return 'left-origin-center';
        }
        return 'right-origin-center';
    }
}
_MatTabBodyBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabBodyBase, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabBodyBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatTabBodyBase, inputs: { _content: ["content", "_content"], origin: "origin", animationDuration: "animationDuration", position: "position" }, outputs: { _onCentering: "_onCentering", _beforeCentering: "_beforeCentering", _afterLeavingCenter: "_afterLeavingCenter", _onCentered: "_onCentered" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabBodyBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { _onCentering: [{
                type: Output
            }], _beforeCentering: [{
                type: Output
            }], _afterLeavingCenter: [{
                type: Output
            }], _onCentered: [{
                type: Output
            }], _content: [{
                type: Input,
                args: ['content']
            }], origin: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], position: [{
                type: Input
            }] } });
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
export class MatTabBody extends _MatTabBodyBase {
    constructor(elementRef, dir, changeDetectorRef) {
        super(elementRef, dir, changeDetectorRef);
    }
}
MatTabBody.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabBody, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MatTabBody.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTabBody, selector: "mat-tab-body", host: { classAttribute: "mat-tab-body" }, viewQueries: [{ propertyName: "_portalHost", first: true, predicate: CdkPortalOutlet, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-tab-body-content\" #content\n     [@translateTab]=\"{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }\"\n     (@translateTab.start)=\"_onTranslateTabStarted($event)\"\n     (@translateTab.done)=\"_translateTabComplete.next($event)\"\n     cdkScrollable>\n  <ng-template matTabBodyHost></ng-template>\n</div>\n", styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}.mat-tab-body-content[style*=\"visibility: hidden\"]{display:none}\n"], directives: [{ type: MatTabBodyPortal, selector: "[matTabBodyHost]" }], animations: [matTabsAnimations.translateTab], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabBody, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab-body', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, animations: [matTabsAnimations.translateTab], host: {
                        'class': 'mat-tab-body',
                    }, template: "<div class=\"mat-tab-body-content\" #content\n     [@translateTab]=\"{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }\"\n     (@translateTab.start)=\"_onTranslateTabStarted($event)\"\n     (@translateTab.done)=\"_translateTabComplete.next($event)\"\n     cdkScrollable>\n  <ng-template matTabBodyHost></ng-template>\n</div>\n", styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}.mat-tab-body-content[style*=\"visibility: hidden\"]{display:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { _portalHost: [{
                type: ViewChild,
                args: [CdkPortalOutlet]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWJvZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItYm9keS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1ib2R5Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sWUFBWSxFQUdaLFVBQVUsRUFDVixTQUFTLEVBQ1QsUUFBUSxFQUNSLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxjQUFjLEVBQUUsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGNBQWMsRUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQTJCL0Q7OztHQUdHO0FBSUgsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGVBQWU7SUFNbkQsWUFDRSx3QkFBa0QsRUFDbEQsZ0JBQWtDLEVBQ1ksS0FBaUIsRUFDN0MsU0FBYztRQUVoQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFIZixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBUmpFLHFFQUFxRTtRQUM3RCxrQkFBYSxHQUFHLFlB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WSxDQUFDLFFBQ3RDO3dCQUNKLE9BQU8sRUFBRSxjQUFjO3FCQUN4Qjs7MEJBT0UsUUFBUTs0RUFKaUIsV0FBVztzQkFBdEMsU0FBUzt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGZvcndhcmRSZWYsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWwsIENka1BvcnRhbE91dGxldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5LCBEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbiwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hdFRhYnNBbmltYXRpb25zfSBmcm9tICcuL3RhYnMtYW5pbWF0aW9ucyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBUaGVzZSBwb3NpdGlvbiBzdGF0ZXMgYXJlIHVzZWQgaW50ZXJuYWxseSBhcyBhbmltYXRpb24gc3RhdGVzIGZvciB0aGUgdGFiIGJvZHkuIFNldHRpbmcgdGhlXG4gKiBwb3NpdGlvbiBzdGF0ZSB0byBsZWZ0LCByaWdodCwgb3IgY2VudGVyIHdpbGwgdHJhbnNpdGlvbiB0aGUgdGFiIGJvZHkgZnJvbSBpdHMgY3VycmVudFxuICogcG9zaXRpb24gdG8gaXRzIHJlc3BlY3RpdmUgc3RhdGUuIElmIHRoZXJlIGlzIG5vdCBjdXJyZW50IHBvc2l0aW9uICh2b2lkLCBpbiB0aGUgY2FzZSBvZiBhIG5ld1xuICogdGFiIGJvZHkpLCB0aGVuIHRoZXJlIHdpbGwgYmUgbm8gdHJhbnNpdGlvbiBhbmltYXRpb24gdG8gaXRzIHN0YXRlLlxuICpcbiAqIEluIHRoZSBjYXNlIG9mIGEgbmV3IHRhYiBib2R5IHRoYXQgc2hvdWxkIGltbWVkaWF0ZWx5IGJlIGNlbnRlcmVkIHdpdGggYW4gYW5pbWF0aW5nIHRyYW5zaXRpb24sXG4gKiB0aGVuIGxlZnQtb3JpZ2luLWNlbnRlciBvciByaWdodC1vcmlnaW4tY2VudGVyIGNhbiBiZSB1c2VkLCB3aGljaCB3aWxsIHVzZSBsZWZ0IG9yIHJpZ2h0IGFzIGl0c1xuICogcHN1ZWRvLXByaW9yIHN0YXRlLlxuICovXG5leHBvcnQgdHlwZSBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZSA9XG4gIHwgJ2xlZnQnXG4gIHwgJ2NlbnRlcidcbiAgfCAncmlnaHQnXG4gIHwgJ2xlZnQtb3JpZ2luLWNlbnRlcidcbiAgfCAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG5cbi8qKlxuICogVGhlIG9yaWdpbiBzdGF0ZSBpcyBhbiBpbnRlcm5hbGx5IHVzZWQgc3RhdGUgdGhhdCBpcyBzZXQgb24gYSBuZXcgdGFiIGJvZHkgaW5kaWNhdGluZyBpZiBpdFxuICogYmVnYW4gdG8gdGhlIGxlZnQgb3IgcmlnaHQgb2YgdGhlIHByaW9yIHNlbGVjdGVkIGluZGV4LiBGb3IgZXhhbXBsZSwgaWYgdGhlIHNlbGVjdGVkIGluZGV4IHdhc1xuICogc2V0IHRvIDEsIGFuZCBhIG5ldyB0YWIgaXMgY3JlYXRlZCBhbmQgc2VsZWN0ZWQgYXQgaW5kZXggMiwgdGhlbiB0aGUgdGFiIGJvZHkgd291bGQgaGF2ZSBhblxuICogb3JpZ2luIG9mIHJpZ2h0IGJlY2F1c2UgaXRzIGluZGV4IHdhcyBncmVhdGVyIHRoYW4gdGhlIHByaW9yIHNlbGVjdGVkIGluZGV4LlxuICovXG5leHBvcnQgdHlwZSBNYXRUYWJCb2R5T3JpZ2luU3RhdGUgPSAnbGVmdCcgfCAncmlnaHQnO1xuXG4vKipcbiAqIFRoZSBwb3J0YWwgaG9zdCBkaXJlY3RpdmUgZm9yIHRoZSBjb250ZW50cyBvZiB0aGUgdGFiLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VGFiQm9keUhvc3RdJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiQm9keVBvcnRhbCBleHRlbmRzIENka1BvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGJlZ2lucyBjZW50ZXJpbmcuICovXG4gIHByaXZhdGUgX2NlbnRlcmluZ1N1YiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGZpbmlzaGVzIGxlYXZpbmcgZnJvbSBjZW50ZXIgcG9zaXRpb24uICovXG4gIHByaXZhdGUgX2xlYXZpbmdTdWIgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0VGFiQm9keSkpIHByaXZhdGUgX2hvc3Q6IE1hdFRhYkJvZHksXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICkge1xuICAgIHN1cGVyKGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgdmlld0NvbnRhaW5lclJlZiwgX2RvY3VtZW50KTtcbiAgfVxuXG4gIC8qKiBTZXQgaW5pdGlhbCB2aXNpYmlsaXR5IG9yIHNldCB1cCBzdWJzY3JpcHRpb24gZm9yIGNoYW5naW5nIHZpc2liaWxpdHkuICovXG4gIG92ZXJyaWRlIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLl9jZW50ZXJpbmdTdWIgPSB0aGlzLl9ob3N0Ll9iZWZvcmVDZW50ZXJpbmdcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9ob3N0Ll9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX2hvc3QuX3Bvc2l0aW9uKSkpXG4gICAgICAuc3Vic2NyaWJlKChpc0NlbnRlcmluZzogYm9vbGVhbikgPT4ge1xuICAgICAgICBpZiAoaXNDZW50ZXJpbmcgJiYgIXRoaXMuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgICAgIHRoaXMuYXR0YWNoKHRoaXMuX2hvc3QuX2NvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2xlYXZpbmdTdWIgPSB0aGlzLl9ob3N0Ll9hZnRlckxlYXZpbmdDZW50ZXIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xlYW4gdXAgY2VudGVyaW5nIHN1YnNjcmlwdGlvbi4gKi9cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9jZW50ZXJpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9sZWF2aW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiQm9keWAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkJvZHlCYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKiogQ3VycmVudCBwb3NpdGlvbiBvZiB0aGUgdGFiLWJvZHkgaW4gdGhlIHRhYi1ncm91cC4gWmVybyBtZWFucyB0aGF0IHRoZSB0YWIgaXMgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25JbmRleDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIGRpcmVjdGlvbmFsaXR5IGNoYW5nZSBvYnNlcnZhYmxlLiAqL1xuICBwcml2YXRlIF9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFRhYiBib2R5IHBvc2l0aW9uIHN0YXRlLiBVc2VkIGJ5IHRoZSBhbmltYXRpb24gdHJpZ2dlciBmb3IgdGhlIGN1cnJlbnQgc3RhdGUuICovXG4gIF9wb3NpdGlvbjogTWF0VGFiQm9keVBvc2l0aW9uU3RhdGU7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSB0YWIgaXMgY29tcGxldGUuICovXG4gIHJlYWRvbmx5IF90cmFuc2xhdGVUYWJDb21wbGV0ZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRhYiBiZWdpbnMgdG8gYW5pbWF0ZSB0b3dhcmRzIHRoZSBjZW50ZXIgYXMgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfb25DZW50ZXJpbmc6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgYmVmb3JlIHRoZSBjZW50ZXJpbmcgb2YgdGhlIHRhYiBiZWdpbnMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfYmVmb3JlQ2VudGVyaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgYmVmb3JlIHRoZSBjZW50ZXJpbmcgb2YgdGhlIHRhYiBiZWdpbnMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfYWZ0ZXJMZWF2aW5nQ2VudGVyOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIGNvbXBsZXRlcyBpdHMgYW5pbWF0aW9uIHRvd2FyZHMgdGhlIGNlbnRlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF9vbkNlbnRlcmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KHRydWUpO1xuXG4gIC8qKiBUaGUgcG9ydGFsIGhvc3QgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIHRhYiBib2R5IGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIGFic3RyYWN0IF9wb3J0YWxIb3N0OiBDZGtQb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIFRoZSB0YWIgYm9keSBjb250ZW50IHRvIGRpc3BsYXkuICovXG4gIEBJbnB1dCgnY29udGVudCcpIF9jb250ZW50OiBUZW1wbGF0ZVBvcnRhbDtcblxuICAvKiogUG9zaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgd2hlbiB0aGUgdGFiIGlzIGltbWVkaWF0ZWx5IGJlY29taW5nIHZpc2libGUgYWZ0ZXIgY3JlYXRpb24uICovXG4gIEBJbnB1dCgpIG9yaWdpbjogbnVtYmVyIHwgbnVsbDtcblxuICAvLyBOb3RlIHRoYXQgdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBhbHdheXMgYmUgb3ZlcndyaXR0ZW4gYnkgYE1hdFRhYkJvZHlgLCBidXQgd2UgbmVlZCBvbmVcbiAgLy8gYW55d2F5IHRvIHByZXZlbnQgdGhlIGFuaW1hdGlvbnMgbW9kdWxlIGZyb20gdGhyb3dpbmcgYW4gZXJyb3IgaWYgdGhlIGJvZHkgaXMgdXNlZCBvbiBpdHMgb3duLlxuICAvKiogRHVyYXRpb24gZm9yIHRoZSB0YWIncyBhbmltYXRpb24uICovXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uOiBzdHJpbmcgPSAnNTAwbXMnO1xuXG4gIC8qKiBUaGUgc2hpZnRlZCBpbmRleCBwb3NpdGlvbiBvZiB0aGUgdGFiIGJvZHksIHdoZXJlIHplcm8gcmVwcmVzZW50cyB0aGUgYWN0aXZlIGNlbnRlciB0YWIuICovXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleCA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgaWYgKF9kaXIpIHtcbiAgICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IF9kaXIuY2hhbmdlLnN1YnNjcmliZSgoZGlyOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoZGlyKTtcbiAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBnZXQgdW5pcXVlIGFuaW1hdGlvbiBldmVudHMsIGJlY2F1c2UgdGhlIGAuZG9uZWAgY2FsbGJhY2sgY2FuIGdldFxuICAgIC8vIGludm9rZWQgdHdpY2UgaW4gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0LlxuICAgIHRoaXMuX3RyYW5zbGF0ZVRhYkNvbXBsZXRlXG4gICAgICAucGlwZShcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHtcbiAgICAgICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgdHJhbnNpdGlvbiB0byB0aGUgY2VudGVyIGlzIGNvbXBsZXRlLCBlbWl0IGFuIGV2ZW50LlxuICAgICAgICBpZiAodGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC50b1N0YXRlKSAmJiB0aGlzLl9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uKSkge1xuICAgICAgICAgIHRoaXMuX29uQ2VudGVyZWQuZW1pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzQ2VudGVyUG9zaXRpb24oZXZlbnQuZnJvbVN0YXRlKSAmJiAhdGhpcy5faXNDZW50ZXJQb3NpdGlvbih0aGlzLl9wb3NpdGlvbikpIHtcbiAgICAgICAgICB0aGlzLl9hZnRlckxlYXZpbmdDZW50ZXIuZW1pdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZnRlciBpbml0aWFsaXplZCwgY2hlY2sgaWYgdGhlIGNvbnRlbnQgaXMgY2VudGVyZWQgYW5kIGhhcyBhbiBvcmlnaW4uIElmIHNvLCBzZXQgdGhlXG4gICAqIHNwZWNpYWwgcG9zaXRpb24gc3RhdGVzIHRoYXQgdHJhbnNpdGlvbiB0aGUgdGFiIGZyb20gdGhlIGxlZnQgb3IgcmlnaHQgYmVmb3JlIGNlbnRlcmluZy5cbiAgICovXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9wb3NpdGlvbiA9PSAnY2VudGVyJyAmJiB0aGlzLm9yaWdpbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMuX2NvbXB1dGVQb3NpdGlvbkZyb21PcmlnaW4odGhpcy5vcmlnaW4pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3RyYW5zbGF0ZVRhYkNvbXBsZXRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfb25UcmFuc2xhdGVUYWJTdGFydGVkKGV2ZW50OiBBbmltYXRpb25FdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlzQ2VudGVyaW5nID0gdGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC50b1N0YXRlKTtcbiAgICB0aGlzLl9iZWZvcmVDZW50ZXJpbmcuZW1pdChpc0NlbnRlcmluZyk7XG4gICAgaWYgKGlzQ2VudGVyaW5nKSB7XG4gICAgICB0aGlzLl9vbkNlbnRlcmluZy5lbWl0KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdGV4dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBfZ2V0TGF5b3V0RGlyZWN0aW9uKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwcm92aWRlZCBwb3NpdGlvbiBzdGF0ZSBpcyBjb25zaWRlcmVkIGNlbnRlciwgcmVnYXJkbGVzcyBvZiBvcmlnaW4uICovXG4gIF9pc0NlbnRlclBvc2l0aW9uKHBvc2l0aW9uOiBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBwb3NpdGlvbiA9PSAnY2VudGVyJyB8fCBwb3NpdGlvbiA9PSAnbGVmdC1vcmlnaW4tY2VudGVyJyB8fCBwb3NpdGlvbiA9PSAncmlnaHQtb3JpZ2luLWNlbnRlcidcbiAgICApO1xuICB9XG5cbiAgLyoqIENvbXB1dGVzIHRoZSBwb3NpdGlvbiBzdGF0ZSB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHRhYi1ib2R5IGFuaW1hdGlvbiB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9jb21wdXRlUG9zaXRpb25BbmltYXRpb25TdGF0ZShkaXI6IERpcmVjdGlvbiA9IHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKSB7XG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uSW5kZXggPCAwKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IGRpciA9PSAnbHRyJyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wb3NpdGlvbkluZGV4ID4gMCkge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSBkaXIgPT0gJ2x0cicgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9ICdjZW50ZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgcG9zaXRpb24gc3RhdGUgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBvcmlnaW4gcG9zaXRpb24uIFRoaXMgaXMgdXNlZCBpZiB0aGVcbiAgICogdGFiIGlzIGJlY29taW5nIHZpc2libGUgaW1tZWRpYXRlbHkgYWZ0ZXIgY3JlYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9jb21wdXRlUG9zaXRpb25Gcm9tT3JpZ2luKG9yaWdpbjogbnVtYmVyKTogTWF0VGFiQm9keVBvc2l0aW9uU3RhdGUge1xuICAgIGNvbnN0IGRpciA9IHRoaXMuX2dldExheW91dERpcmVjdGlvbigpO1xuXG4gICAgaWYgKChkaXIgPT0gJ2x0cicgJiYgb3JpZ2luIDw9IDApIHx8IChkaXIgPT0gJ3J0bCcgJiYgb3JpZ2luID4gMCkpIHtcbiAgICAgIHJldHVybiAnbGVmdC1vcmlnaW4tY2VudGVyJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ3JpZ2h0LW9yaWdpbi1jZW50ZXInO1xuICB9XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIGNvbnRlbnRzIG9mIGEgdGFiLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFiLWJvZHknLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1ib2R5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLWJvZHkuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgYW5pbWF0aW9uczogW21hdFRhYnNBbmltYXRpb25zLnRyYW5zbGF0ZVRhYl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1ib2R5JyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiQm9keSBleHRlbmRzIF9NYXRUYWJCb2R5QmFzZSB7XG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0KSBfcG9ydGFsSG9zdDogQ2RrUG9ydGFsT3V0bGV0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIGNoYW5nZURldGVjdG9yUmVmKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC10YWItYm9keS1jb250ZW50XCIgI2NvbnRlbnRcbiAgICAgW0B0cmFuc2xhdGVUYWJdPVwie1xuICAgICAgICB2YWx1ZTogX3Bvc2l0aW9uLFxuICAgICAgICBwYXJhbXM6IHthbmltYXRpb25EdXJhdGlvbjogYW5pbWF0aW9uRHVyYXRpb259XG4gICAgIH1cIlxuICAgICAoQHRyYW5zbGF0ZVRhYi5zdGFydCk9XCJfb25UcmFuc2xhdGVUYWJTdGFydGVkKCRldmVudClcIlxuICAgICAoQHRyYW5zbGF0ZVRhYi5kb25lKT1cIl90cmFuc2xhdGVUYWJDb21wbGV0ZS5uZXh0KCRldmVudClcIlxuICAgICBjZGtTY3JvbGxhYmxlPlxuICA8bmctdGVtcGxhdGUgbWF0VGFiQm9keUhvc3Q+PC9uZy10ZW1wbGF0ZT5cbjwvZGl2PlxuIl19