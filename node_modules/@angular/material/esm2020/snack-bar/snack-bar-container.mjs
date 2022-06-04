import { Platform } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { matSnackBarAnimations } from './snack-bar-animations';
import { MatSnackBarConfig } from './snack-bar-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "./snack-bar-config";
import * as i3 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export class MatSnackBarContainer extends BasePortalOutlet {
    constructor(_ngZone, _elementRef, _changeDetectorRef, _platform, 
    /** The snack bar configuration. */
    snackBarConfig) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._platform = _platform;
        this.snackBarConfig = snackBarConfig;
        /** The number of milliseconds to wait before announcing the snack bar's content. */
        this._announceDelay = 150;
        /** Whether the component has been destroyed. */
        this._destroyed = false;
        /** Subject for notifying that the snack bar has announced to screen readers. */
        this._onAnnounce = new Subject();
        /** Subject for notifying that the snack bar has exited from view. */
        this._onExit = new Subject();
        /** Subject for notifying that the snack bar has finished entering the view. */
        this._onEnter = new Subject();
        /** The state of the snack bar animations. */
        this._animationState = 'void';
        /**
         * Attaches a DOM portal to the snack bar container.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            this._assertNotAttached();
            this._applySnackBarClasses();
            return this._portalOutlet.attachDomPortal(portal);
        };
        // Use aria-live rather than a live role like 'alert' or 'status'
        // because NVDA and JAWS have show inconsistent behavior with live roles.
        if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
            this._live = 'assertive';
        }
        else if (snackBarConfig.politeness === 'off') {
            this._live = 'off';
        }
        else {
            this._live = 'polite';
        }
        // Only set role for Firefox. Set role based on aria-live because setting role="alert" implies
        // aria-live="assertive" which may cause issues if aria-live is set to "polite" above.
        if (this._platform.FIREFOX) {
            if (this._live === 'polite') {
                this._role = 'status';
            }
            if (this._live === 'assertive') {
                this._role = 'alert';
            }
        }
    }
    /** Attach a component portal as content to this snack bar container. */
    attachComponentPortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /** Attach a template portal as content to this snack bar container. */
    attachTemplatePortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /** Handle end of animations, updating the state of the snackbar. */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
            this._completeExit();
        }
        if (toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            const onEnter = this._onEnter;
            this._ngZone.run(() => {
                onEnter.next();
                onEnter.complete();
            });
        }
    }
    /** Begin animation of snack bar entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
            this._screenReaderAnnounce();
        }
    }
    /** Begin animation of the snack bar exiting from view. */
    exit() {
        // It's common for snack bars to be opened by random outside calls like HTTP requests or
        // errors. Run inside the NgZone to ensure that it functions correctly.
        this._ngZone.run(() => {
            // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
            // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
            // `MatSnackBar.open`).
            this._animationState = 'hidden';
            // Mark this element with an 'exit' attribute to indicate that the snackbar has
            // been dismissed and will soon be removed from the DOM. This is used by the snackbar
            // test harness.
            this._elementRef.nativeElement.setAttribute('mat-exit', '');
            // If the snack bar hasn't been announced by the time it exits it wouldn't have been open
            // long enough to visually read it either, so clear the timeout for announcing.
            clearTimeout(this._announceTimeoutId);
        });
        return this._onExit;
    }
    /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
    ngOnDestroy() {
        this._destroyed = true;
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    _completeExit() {
        this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
            this._ngZone.run(() => {
                this._onExit.next();
                this._onExit.complete();
            });
        });
    }
    /** Applies the various positioning and user-configured CSS classes to the snack bar. */
    _applySnackBarClasses() {
        const element = this._elementRef.nativeElement;
        const panelClasses = this.snackBarConfig.panelClass;
        if (panelClasses) {
            if (Array.isArray(panelClasses)) {
                // Note that we can't use a spread here, because IE doesn't support multiple arguments.
                panelClasses.forEach(cssClass => element.classList.add(cssClass));
            }
            else {
                element.classList.add(panelClasses);
            }
        }
        if (this.snackBarConfig.horizontalPosition === 'center') {
            element.classList.add('mat-snack-bar-center');
        }
        if (this.snackBarConfig.verticalPosition === 'top') {
            element.classList.add('mat-snack-bar-top');
        }
    }
    /** Asserts that no content is already attached to the container. */
    _assertNotAttached() {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
    }
    /**
     * Starts a timeout to move the snack bar content to the live region so screen readers will
     * announce it.
     */
    _screenReaderAnnounce() {
        if (!this._announceTimeoutId) {
            this._ngZone.runOutsideAngular(() => {
                this._announceTimeoutId = setTimeout(() => {
                    const inertElement = this._elementRef.nativeElement.querySelector('[aria-hidden]');
                    const liveElement = this._elementRef.nativeElement.querySelector('[aria-live]');
                    if (inertElement && liveElement) {
                        // If an element in the snack bar content is focused before being moved
                        // track it and restore focus after moving to the live region.
                        let focusedElement = null;
                        if (this._platform.isBrowser &&
                            document.activeElement instanceof HTMLElement &&
                            inertElement.contains(document.activeElement)) {
                            focusedElement = document.activeElement;
                        }
                        inertElement.removeAttribute('aria-hidden');
                        liveElement.appendChild(inertElement);
                        focusedElement?.focus();
                        this._onAnnounce.next();
                        this._onAnnounce.complete();
                    }
                }, this._announceDelay);
            });
        }
    }
}
MatSnackBarContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBarContainer, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Platform }, { token: i2.MatSnackBarConfig }], target: i0.ɵɵFactoryTarget.Component });
MatSnackBarContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatSnackBarContainer, selector: "snack-bar-container", host: { listeners: { "@state.done": "onAnimationEnd($event)" }, properties: { "@state": "_animationState" }, classAttribute: "mat-snack-bar-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden=\"true\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]=\"_live\" [attr.role]=\"_role\"></div>\n", styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}\n"], directives: [{ type: i3.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matSnackBarAnimations.snackBarState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBarContainer, decorators: [{
            type: Component,
            args: [{ selector: 'snack-bar-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matSnackBarAnimations.snackBarState], host: {
                        'class': 'mat-snack-bar-container',
                        '[@state]': '_animationState',
                        '(@state.done)': 'onAnimationEnd($event)',
                    }, template: "<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden=\"true\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]=\"_live\" [attr.role]=\"_role\"></div>\n", styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Platform }, { type: i2.MatSnackBarConfig }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FJaEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsVUFBVSxFQUVWLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzdELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7OztBQWlCckQ7OztHQUdHO0FBa0JILE1BQU0sT0FBTyxvQkFDWCxTQUFRLGdCQUFnQjtJQW9DeEIsWUFDVSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsa0JBQXFDLEVBQ3JDLFNBQW1CO0lBQzNCLG1DQUFtQztJQUM1QixjQUFpQztRQUV4QyxLQUFLLEVBQUUsQ0FBQztRQVBBLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNyQyxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBRXBCLG1CQUFjLEdBQWQsY0FBYyxDQUFt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QkFqQmhDLFNBQVM7K0JBQ0UscUJBQXFCLG1CQU9kLHVCQUF1QixDQUFDLE9BQU8saUJBQ2pDLGlCQUFpQixDQUFDLElBQUksY0FDekIsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsUUFDM0M7d0JBQ0osT0FBTyxFQUFFLHlCQUF5Qjt3QkFDbEMsVUFBVSxFQUFFLGlCQUFpQjt3QkFDN0IsZUFBZSxFQUFFLHdCQUF3QjtxQkFDMUM7Nk1BZ0IyQyxhQUFhO3NCQUF4RCxTQUFTO3VCQUFDLGVBQWUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FyaWFMaXZlUG9saXRlbmVzc30gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEJhc2VQb3J0YWxPdXRsZXQsXG4gIENka1BvcnRhbE91dGxldCxcbiAgQ29tcG9uZW50UG9ydGFsLFxuICBUZW1wbGF0ZVBvcnRhbCxcbiAgRG9tUG9ydGFsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRTbmFja0JhckFuaW1hdGlvbnN9IGZyb20gJy4vc25hY2stYmFyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbmZpZ30gZnJvbSAnLi9zbmFjay1iYXItY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcm5hbCBpbnRlcmZhY2UgZm9yIGEgc25hY2sgYmFyIGNvbnRhaW5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBfU25hY2tCYXJDb250YWluZXIge1xuICBzbmFja0JhckNvbmZpZzogTWF0U25hY2tCYXJDb25maWc7XG4gIHJlYWRvbmx5IF9vbkFubm91bmNlOiBTdWJqZWN0PGFueT47XG4gIHJlYWRvbmx5IF9vbkV4aXQ6IFN1YmplY3Q8YW55PjtcbiAgcmVhZG9ubHkgX29uRW50ZXI6IFN1YmplY3Q8YW55PjtcbiAgZW50ZXI6ICgpID0+IHZvaWQ7XG4gIGV4aXQ6ICgpID0+IE9ic2VydmFibGU8dm9pZD47XG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsOiA8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPikgPT4gRW1iZWRkZWRWaWV3UmVmPEM+O1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw6IDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPikgPT4gQ29tcG9uZW50UmVmPFQ+O1xufVxuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgc25hY2sgYmFyIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NuYWNrLWJhci1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NuYWNrLWJhci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbmFjay1iYXItY29udGFpbmVyLmNzcyddLFxuICAvLyBJbiBJdnkgZW1iZWRkZWQgdmlld3Mgd2lsbCBiZSBjaGFuZ2UgZGV0ZWN0ZWQgZnJvbSB0aGVpciBkZWNsYXJhdGlvbiBwbGFjZSwgcmF0aGVyIHRoYW5cbiAgLy8gd2hlcmUgdGhleSB3ZXJlIHN0YW1wZWQgb3V0LiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuJ3QgaGF2ZSB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBiZSBPblB1c2gsXG4gIC8vIGJlY2F1c2UgaXQgbWlnaHQgY2F1c2Ugc25hY2sgYmFycyB0aGF0IHdlcmUgb3BlbmVkIGZyb20gYSB0ZW1wbGF0ZSBub3QgdG8gYmUgb3V0IG9mIGRhdGUuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW21hdFNuYWNrQmFyQW5pbWF0aW9ucy5zbmFja0JhclN0YXRlXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc25hY2stYmFyLWNvbnRhaW5lcicsXG4gICAgJ1tAc3RhdGVdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAc3RhdGUuZG9uZSknOiAnb25BbmltYXRpb25FbmQoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyQ29udGFpbmVyXG4gIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldFxuICBpbXBsZW1lbnRzIE9uRGVzdHJveSwgX1NuYWNrQmFyQ29udGFpbmVyXG57XG4gIC8qKiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhbm5vdW5jaW5nIHRoZSBzbmFjayBiYXIncyBjb250ZW50LiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hbm5vdW5jZURlbGF5OiBudW1iZXIgPSAxNTA7XG5cbiAgLyoqIFRoZSB0aW1lb3V0IGZvciBhbm5vdW5jaW5nIHRoZSBzbmFjayBiYXIncyBjb250ZW50LiAqL1xuICBwcml2YXRlIF9hbm5vdW5jZVRpbWVvdXRJZDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIHNuYWNrIGJhciBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwge3N0YXRpYzogdHJ1ZX0pIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgYW5ub3VuY2VkIHRvIHNjcmVlbiByZWFkZXJzLiAqL1xuICByZWFkb25seSBfb25Bbm5vdW5jZTogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGV4aXRlZCBmcm9tIHZpZXcuICovXG4gIHJlYWRvbmx5IF9vbkV4aXQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBmaW5pc2hlZCBlbnRlcmluZyB0aGUgdmlldy4gKi9cbiAgcmVhZG9ubHkgX29uRW50ZXI6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBUaGUgc3RhdGUgb2YgdGhlIHNuYWNrIGJhciBhbmltYXRpb25zLiAqL1xuICBfYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG5cbiAgLyoqIGFyaWEtbGl2ZSB2YWx1ZSBmb3IgdGhlIGxpdmUgcmVnaW9uLiAqL1xuICBfbGl2ZTogQXJpYUxpdmVQb2xpdGVuZXNzO1xuXG4gIC8qKlxuICAgKiBSb2xlIG9mIHRoZSBsaXZlIHJlZ2lvbi4gVGhpcyBpcyBvbmx5IGZvciBGaXJlZm94IGFzIHRoZXJlIGlzIGEga25vd24gaXNzdWUgd2hlcmUgRmlyZWZveCArXG4gICAqIEpBV1MgZG9lcyBub3QgcmVhZCBvdXQgYXJpYS1saXZlIG1lc3NhZ2UuXG4gICAqL1xuICBfcm9sZT86ICdzdGF0dXMnIHwgJ2FsZXJ0JztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIC8qKiBUaGUgc25hY2sgYmFyIGNvbmZpZ3VyYXRpb24uICovXG4gICAgcHVibGljIHNuYWNrQmFyQ29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFVzZSBhcmlhLWxpdmUgcmF0aGVyIHRoYW4gYSBsaXZlIHJvbGUgbGlrZSAnYWxlcnQnIG9yICdzdGF0dXMnXG4gICAgLy8gYmVjYXVzZSBOVkRBIGFuZCBKQVdTIGhhdmUgc2hvdyBpbmNvbnNpc3RlbnQgYmVoYXZpb3Igd2l0aCBsaXZlIHJvbGVzLlxuICAgIGlmIChzbmFja0JhckNvbmZpZy5wb2xpdGVuZXNzID09PSAnYXNzZXJ0aXZlJyAmJiAhc25hY2tCYXJDb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5fbGl2ZSA9ICdhc3NlcnRpdmUnO1xuICAgIH0gZWxzZSBpZiAoc25hY2tCYXJDb25maWcucG9saXRlbmVzcyA9PT0gJ29mZicpIHtcbiAgICAgIHRoaXMuX2xpdmUgPSAnb2ZmJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGl2ZSA9ICdwb2xpdGUnO1xuICAgIH1cblxuICAgIC8vIE9ubHkgc2V0IHJvbGUgZm9yIEZpcmVmb3guIFNldCByb2xlIGJhc2VkIG9uIGFyaWEtbGl2ZSBiZWNhdXNlIHNldHRpbmcgcm9sZT1cImFsZXJ0XCIgaW1wbGllc1xuICAgIC8vIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIHdoaWNoIG1heSBjYXVzZSBpc3N1ZXMgaWYgYXJpYS1saXZlIGlzIHNldCB0byBcInBvbGl0ZVwiIGFib3ZlLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5GSVJFRk9YKSB7XG4gICAgICBpZiAodGhpcy5fbGl2ZSA9PT0gJ3BvbGl0ZScpIHtcbiAgICAgICAgdGhpcy5fcm9sZSA9ICdzdGF0dXMnO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2xpdmUgPT09ICdhc3NlcnRpdmUnKSB7XG4gICAgICAgIHRoaXMuX3JvbGUgPSAnYWxlcnQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSBjb21wb25lbnQgcG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBzbmFjayBiYXIgY29udGFpbmVyLiAqL1xuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIHRoaXMuX2Fzc2VydE5vdEF0dGFjaGVkKCk7XG4gICAgdGhpcy5fYXBwbHlTbmFja0JhckNsYXNzZXMoKTtcbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsT3V0bGV0LmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICB9XG5cbiAgLyoqIEF0dGFjaCBhIHRlbXBsYXRlIHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgc25hY2sgYmFyIGNvbnRhaW5lci4gKi9cbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICB0aGlzLl9hcHBseVNuYWNrQmFyQ2xhc3NlcygpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIERPTSBwb3J0YWwgdG8gdGhlIHNuYWNrIGJhciBjb250YWluZXIuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90QXR0YWNoZWQoKTtcbiAgICB0aGlzLl9hcHBseVNuYWNrQmFyQ2xhc3NlcygpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gIH07XG5cbiAgLyoqIEhhbmRsZSBlbmQgb2YgYW5pbWF0aW9ucywgdXBkYXRpbmcgdGhlIHN0YXRlIG9mIHRoZSBzbmFja2Jhci4gKi9cbiAgb25BbmltYXRpb25FbmQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgIGlmICgodG9TdGF0ZSA9PT0gJ3ZvaWQnICYmIGZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB8fCB0b1N0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgdGhpcy5fY29tcGxldGVFeGl0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgLy8gTm90ZTogd2Ugc2hvdWxkbid0IHVzZSBgdGhpc2AgaW5zaWRlIHRoZSB6b25lIGNhbGxiYWNrLFxuICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gY2F1c2UgYSBtZW1vcnkgbGVhay5cbiAgICAgIGNvbnN0IG9uRW50ZXIgPSB0aGlzLl9vbkVudGVyO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgb25FbnRlci5uZXh0KCk7XG4gICAgICAgIG9uRW50ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBCZWdpbiBhbmltYXRpb24gb2Ygc25hY2sgYmFyIGVudHJhbmNlIGludG8gdmlldy4gKi9cbiAgZW50ZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3Zpc2libGUnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5fc2NyZWVuUmVhZGVyQW5ub3VuY2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBzbmFjayBiYXIgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgLy8gSXQncyBjb21tb24gZm9yIHNuYWNrIGJhcnMgdG8gYmUgb3BlbmVkIGJ5IHJhbmRvbSBvdXRzaWRlIGNhbGxzIGxpa2UgSFRUUCByZXF1ZXN0cyBvclxuICAgIC8vIGVycm9ycy4gUnVuIGluc2lkZSB0aGUgTmdab25lIHRvIGVuc3VyZSB0aGF0IGl0IGZ1bmN0aW9ucyBjb3JyZWN0bHkuXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAvLyBOb3RlOiB0aGlzIG9uZSB0cmFuc2l0aW9ucyB0byBgaGlkZGVuYCwgcmF0aGVyIHRoYW4gYHZvaWRgLCBpbiBvcmRlciB0byBoYW5kbGUgdGhlIGNhc2VcbiAgICAgIC8vIHdoZXJlIG11bHRpcGxlIHNuYWNrIGJhcnMgYXJlIG9wZW5lZCBpbiBxdWljayBzdWNjZXNzaW9uIChlLmcuIHR3byBjb25zZWN1dGl2ZSBjYWxscyB0b1xuICAgICAgLy8gYE1hdFNuYWNrQmFyLm9wZW5gKS5cbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ2hpZGRlbic7XG5cbiAgICAgIC8vIE1hcmsgdGhpcyBlbGVtZW50IHdpdGggYW4gJ2V4aXQnIGF0dHJpYnV0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBzbmFja2JhciBoYXNcbiAgICAgIC8vIGJlZW4gZGlzbWlzc2VkIGFuZCB3aWxsIHNvb24gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoaXMgaXMgdXNlZCBieSB0aGUgc25hY2tiYXJcbiAgICAgIC8vIHRlc3QgaGFybmVzcy5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21hdC1leGl0JywgJycpO1xuXG4gICAgICAvLyBJZiB0aGUgc25hY2sgYmFyIGhhc24ndCBiZWVuIGFubm91bmNlZCBieSB0aGUgdGltZSBpdCBleGl0cyBpdCB3b3VsZG4ndCBoYXZlIGJlZW4gb3BlblxuICAgICAgLy8gbG9uZyBlbm91Z2ggdG8gdmlzdWFsbHkgcmVhZCBpdCBlaXRoZXIsIHNvIGNsZWFyIHRoZSB0aW1lb3V0IGZvciBhbm5vdW5jaW5nLlxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Fubm91bmNlVGltZW91dElkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9vbkV4aXQ7XG4gIH1cblxuICAvKiogTWFrZXMgc3VyZSB0aGUgZXhpdCBjYWxsYmFja3MgaGF2ZSBiZWVuIGludm9rZWQgd2hlbiB0aGUgZWxlbWVudCBpcyBkZXN0cm95ZWQuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5fY29tcGxldGVFeGl0KCk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSB6b25lIHRvIHNldHRsZSBiZWZvcmUgcmVtb3ZpbmcgdGhlIGVsZW1lbnQuIEhlbHBzIHByZXZlbnRcbiAgICogZXJyb3JzIHdoZXJlIHdlIGVuZCB1cCByZW1vdmluZyBhbiBlbGVtZW50IHdoaWNoIGlzIGluIHRoZSBtaWRkbGUgb2YgYW4gYW5pbWF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcGxldGVFeGl0KCkge1xuICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9vbkV4aXQubmV4dCgpO1xuICAgICAgICB0aGlzLl9vbkV4aXQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEFwcGxpZXMgdGhlIHZhcmlvdXMgcG9zaXRpb25pbmcgYW5kIHVzZXItY29uZmlndXJlZCBDU1MgY2xhc3NlcyB0byB0aGUgc25hY2sgYmFyLiAqL1xuICBwcml2YXRlIF9hcHBseVNuYWNrQmFyQ2xhc3NlcygpIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBwYW5lbENsYXNzZXMgPSB0aGlzLnNuYWNrQmFyQ29uZmlnLnBhbmVsQ2xhc3M7XG5cbiAgICBpZiAocGFuZWxDbGFzc2VzKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYW5lbENsYXNzZXMpKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4ndCB1c2UgYSBzcHJlYWQgaGVyZSwgYmVjYXVzZSBJRSBkb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgYXJndW1lbnRzLlxuICAgICAgICBwYW5lbENsYXNzZXMuZm9yRWFjaChjc3NDbGFzcyA9PiBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY3NzQ2xhc3MpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYW5lbENsYXNzZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNuYWNrQmFyQ29uZmlnLmhvcml6b250YWxQb3NpdGlvbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXNuYWNrLWJhci1jZW50ZXInKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbmFja0JhckNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc25hY2stYmFyLXRvcCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgbm8gY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2Fzc2VydE5vdEF0dGFjaGVkKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIHNuYWNrIGJhciBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgYSB0aW1lb3V0IHRvIG1vdmUgdGhlIHNuYWNrIGJhciBjb250ZW50IHRvIHRoZSBsaXZlIHJlZ2lvbiBzbyBzY3JlZW4gcmVhZGVycyB3aWxsXG4gICAqIGFubm91bmNlIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2NyZWVuUmVhZGVyQW5ub3VuY2UoKSB7XG4gICAgaWYgKCF0aGlzLl9hbm5vdW5jZVRpbWVvdXRJZCkge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5fYW5ub3VuY2VUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmVydEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtaGlkZGVuXScpO1xuICAgICAgICAgIGNvbnN0IGxpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWxpdmVdJyk7XG5cbiAgICAgICAgICBpZiAoaW5lcnRFbGVtZW50ICYmIGxpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IGluIHRoZSBzbmFjayBiYXIgY29udGVudCBpcyBmb2N1c2VkIGJlZm9yZSBiZWluZyBtb3ZlZFxuICAgICAgICAgICAgLy8gdHJhY2sgaXQgYW5kIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgbW92aW5nIHRvIHRoZSBsaXZlIHJlZ2lvbi5cbiAgICAgICAgICAgIGxldCBmb2N1c2VkRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyICYmXG4gICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgICBpbmVydEVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZXJ0RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgICAgICBsaXZlRWxlbWVudC5hcHBlbmRDaGlsZChpbmVydEVsZW1lbnQpO1xuICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQ/LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uQW5ub3VuY2UubmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5fb25Bbm5vdW5jZS5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5fYW5ub3VuY2VEZWxheSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIjwhLS0gSW5pdGlhbGx5IGhvbGRzIHRoZSBzbmFjayBiYXIgY29udGVudCwgd2lsbCBiZSBlbXB0eSBhZnRlciBhbm5vdW5jaW5nIHRvIHNjcmVlbiByZWFkZXJzLiAtLT5cbjxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gIDxuZy10ZW1wbGF0ZSBjZGtQb3J0YWxPdXRsZXQ+PC9uZy10ZW1wbGF0ZT5cbjwvZGl2PlxuXG48IS0tIFdpbGwgcmVjZWl2ZSB0aGUgc25hY2sgYmFyIGNvbnRlbnQgZnJvbSB0aGUgbm9uLWxpdmUgZGl2LCBtb3ZlIHdpbGwgaGFwcGVuIGEgc2hvcnQgZGVsYXkgYWZ0ZXIgb3BlbmluZyAtLT5cbjxkaXYgW2F0dHIuYXJpYS1saXZlXT1cIl9saXZlXCIgW2F0dHIucm9sZV09XCJfcm9sZVwiPjwvZGl2PlxuIl19