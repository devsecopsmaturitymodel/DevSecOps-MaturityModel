/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef, } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SimpleSnackBar } from './simple-snack-bar';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig } from './snack-bar-config';
import { MatSnackBarContainer } from './snack-bar-container';
import { MatSnackBarModule } from './snack-bar-module';
import { MatSnackBarRef } from './snack-bar-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/layout";
import * as i4 from "./snack-bar-config";
/** Injection token that can be used to specify default snack bar. */
export const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
export class _MatSnackBarBase {
    constructor(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
        this._overlay = _overlay;
        this._live = _live;
        this._injector = _injector;
        this._breakpointObserver = _breakpointObserver;
        this._parentSnackBar = _parentSnackBar;
        this._defaultConfig = _defaultConfig;
        /**
         * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
         * If there is a parent snack-bar service, all operations should delegate to that parent
         * via `_openedSnackBarRef`.
         */
        this._snackBarRefAtThisLevel = null;
    }
    /** Reference to the currently opened snackbar at *any* level. */
    get _openedSnackBarRef() {
        const parent = this._parentSnackBar;
        return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
    }
    set _openedSnackBarRef(value) {
        if (this._parentSnackBar) {
            this._parentSnackBar._openedSnackBarRef = value;
        }
        else {
            this._snackBarRefAtThisLevel = value;
        }
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @param component Component to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    openFromComponent(component, config) {
        return this._attach(component, config);
    }
    /**
     * Creates and dispatches a snack bar with a custom template for the content, removing any
     * currently opened snack bars.
     *
     * @param template Template to be instantiated.
     * @param config Extra configuration for the snack bar.
     */
    openFromTemplate(template, config) {
        return this._attach(template, config);
    }
    /**
     * Opens a snackbar with a message and an optional action.
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     */
    open(message, action = '', config) {
        const _config = { ...this._defaultConfig, ...config };
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message, action };
        // Since the snack bar has `role="alert"`, we don't
        // want to announce the same message twice.
        if (_config.announcementMessage === message) {
            _config.announcementMessage = undefined;
        }
        return this.openFromComponent(this.simpleSnackBarComponent, _config);
    }
    /**
     * Dismisses the currently-visible snack bar.
     */
    dismiss() {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    }
    ngOnDestroy() {
        // Only dismiss the snack bar at the current level on destroy.
        if (this._snackBarRefAtThisLevel) {
            this._snackBarRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the snack bar container component to the overlay.
     */
    _attachSnackBarContainer(overlayRef, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatSnackBarConfig, useValue: config }],
        });
        const containerPortal = new ComponentPortal(this.snackBarContainerComponent, config.viewContainerRef, injector);
        const containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component or a template as the content of the snack bar container.
     */
    _attach(content, userConfig) {
        const config = { ...new MatSnackBarConfig(), ...this._defaultConfig, ...userConfig };
        const overlayRef = this._createOverlay(config);
        const container = this._attachSnackBarContainer(overlayRef, config);
        const snackBarRef = new MatSnackBarRef(container, overlayRef);
        if (content instanceof TemplateRef) {
            const portal = new TemplatePortal(content, null, {
                $implicit: config.data,
                snackBarRef,
            });
            snackBarRef.instance = container.attachTemplatePortal(portal);
        }
        else {
            const injector = this._createInjector(config, snackBarRef);
            const portal = new ComponentPortal(content, undefined, injector);
            const contentRef = container.attachComponentPortal(portal);
            // We can't pass this via the injector, because the injector is created earlier.
            snackBarRef.instance = contentRef.instance;
        }
        // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
        // appropriate. This class is applied to the overlay element because the overlay must expand to
        // fill the width of the screen for full width snackbars.
        this._breakpointObserver
            .observe(Breakpoints.HandsetPortrait)
            .pipe(takeUntil(overlayRef.detachments()))
            .subscribe(state => {
            overlayRef.overlayElement.classList.toggle(this.handsetCssClass, state.matches);
        });
        if (config.announcementMessage) {
            // Wait until the snack bar contents have been announced then deliver this message.
            container._onAnnounce.subscribe(() => {
                this._live.announce(config.announcementMessage, config.politeness);
            });
        }
        this._animateSnackBar(snackBarRef, config);
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    }
    /** Animates the old snack bar out and the new one in. */
    _animateSnackBar(snackBarRef, config) {
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(() => {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (this._openedSnackBarRef == snackBarRef) {
                this._openedSnackBarRef = null;
            }
            if (config.announcementMessage) {
                this._live.clear();
            }
        });
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe(() => {
                snackBarRef.containerInstance.enter();
            });
            this._openedSnackBarRef.dismiss();
        }
        else {
            // If no snack bar is in view, enter the new snack bar.
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration && config.duration > 0) {
            snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(config.duration));
        }
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified snack bar config.
     */
    _createOverlay(config) {
        const overlayConfig = new OverlayConfig();
        overlayConfig.direction = config.direction;
        let positionStrategy = this._overlay.position().global();
        // Set horizontal position.
        const isRtl = config.direction === 'rtl';
        const isLeft = config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl);
        const isRight = !isLeft && config.horizontalPosition !== 'center';
        if (isLeft) {
            positionStrategy.left('0');
        }
        else if (isRight) {
            positionStrategy.right('0');
        }
        else {
            positionStrategy.centerHorizontally();
        }
        // Set horizontal position.
        if (config.verticalPosition === 'top') {
            positionStrategy.top('0');
        }
        else {
            positionStrategy.bottom('0');
        }
        overlayConfig.positionStrategy = positionStrategy;
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a snack bar component.
     * @param config Config that was used to create the snack bar.
     * @param snackBarRef Reference to the snack bar.
     */
    _createInjector(config, snackBarRef) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        return Injector.create({
            parent: userInjector || this._injector,
            providers: [
                { provide: MatSnackBarRef, useValue: snackBarRef },
                { provide: MAT_SNACK_BAR_DATA, useValue: config.data },
            ],
        });
    }
}
_MatSnackBarBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: _MatSnackBarBase, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
_MatSnackBarBase.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSnackBarBase, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i2.LiveAnnouncer }, { type: i0.Injector }, { type: i3.BreakpointObserver }, { type: _MatSnackBarBase, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i4.MatSnackBarConfig, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DEFAULT_OPTIONS]
                }] }]; } });
/**
 * Service to dispatch Material Design snack bar messages.
 */
export class MatSnackBar extends _MatSnackBarBase {
    constructor(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig) {
        super(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig);
        this.simpleSnackBarComponent = SimpleSnackBar;
        this.snackBarContainerComponent = MatSnackBarContainer;
        this.handsetCssClass = 'mat-snack-bar-handset';
    }
}
MatSnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, deps: [{ token: i1.Overlay }, { token: i2.LiveAnnouncer }, { token: i0.Injector }, { token: i3.BreakpointObserver }, { token: MatSnackBar, optional: true, skipSelf: true }, { token: MAT_SNACK_BAR_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Injectable });
MatSnackBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, providedIn: MatSnackBarModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSnackBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: MatSnackBarModule }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i2.LiveAnnouncer }, { type: i0.Injector }, { type: i3.BreakpointObserver }, { type: MatSnackBar, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i4.MatSnackBarConfig, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NuYWNrLWJhci9zbmFjay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFHTCxNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFDZCxRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEdBR1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBbUIsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLG9CQUFvQixFQUFxQixNQUFNLHVCQUF1QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRS9DLHFFQUFxRTtBQUNyRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FDN0QsK0JBQStCLEVBQy9CO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHFDQUFxQztDQUMvQyxDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFB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NkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgT25EZXN0cm95LFxuICBUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1RleHRPbmx5U25hY2tCYXIsIFNpbXBsZVNuYWNrQmFyfSBmcm9tICcuL3NpbXBsZS1zbmFjay1iYXInO1xuaW1wb3J0IHtNQVRfU05BQ0tfQkFSX0RBVEEsIE1hdFNuYWNrQmFyQ29uZmlnfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbnRhaW5lciwgX1NuYWNrQmFyQ29udGFpbmVyfSBmcm9tICcuL3NuYWNrLWJhci1jb250YWluZXInO1xuaW1wb3J0IHtNYXRTbmFja0Jhck1vZHVsZX0gZnJvbSAnLi9zbmFjay1iYXItbW9kdWxlJztcbmltcG9ydCB7TWF0U25hY2tCYXJSZWZ9IGZyb20gJy4vc25hY2stYmFyLXJlZic7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgc25hY2sgYmFyLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdFNuYWNrQmFyQ29uZmlnPihcbiAgJ21hdC1zbmFjay1iYXItZGVmYXVsdC1vcHRpb25zJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICB9LFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFNuYWNrQmFyQ29uZmlnIHtcbiAgcmV0dXJuIG5ldyBNYXRTbmFja0JhckNvbmZpZygpO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFNuYWNrQmFyQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgc25hY2sgYmFyIGluIHRoZSB2aWV3ICphdCB0aGlzIGxldmVsKiAoaW4gdGhlIEFuZ3VsYXIgaW5qZWN0b3IgdHJlZSkuXG4gICAqIElmIHRoZXJlIGlzIGEgcGFyZW50IHNuYWNrLWJhciBzZXJ2aWNlLCBhbGwgb3BlcmF0aW9ucyBzaG91bGQgZGVsZWdhdGUgdG8gdGhhdCBwYXJlbnRcbiAgICogdmlhIGBfb3BlbmVkU25hY2tCYXJSZWZgLlxuICAgKi9cbiAgcHJpdmF0ZSBfc25hY2tCYXJSZWZBdFRoaXNMZXZlbDogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkIGFzIHRoZSBzbmFjayBiYXIncyBzaW1wbGUgY29tcG9uZW50LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc2ltcGxlU25hY2tCYXJDb21wb25lbnQ6IFR5cGU8VGV4dE9ubHlTbmFja0Jhcj47XG5cbiAgLyoqIFRoZSBjb250YWluZXIgY29tcG9uZW50IHRoYXQgYXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRlbXBsYXRlIG9yIGNvbXBvbmVudC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50OiBUeXBlPF9TbmFja0JhckNvbnRhaW5lcj47XG5cbiAgLyoqIFRoZSBDU1MgY2xhc3MgdG8gYXBwbHkgZm9yIGhhbmRzZXQgbW9kZS4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGhhbmRzZXRDc3NDbGFzczogc3RyaW5nO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgc25hY2tiYXIgYXQgKmFueSogbGV2ZWwuICovXG4gIGdldCBfb3BlbmVkU25hY2tCYXJSZWYoKTogTWF0U25hY2tCYXJSZWY8YW55PiB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudFNuYWNrQmFyO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX29wZW5lZFNuYWNrQmFyUmVmIDogdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHNldCBfb3BlbmVkU25hY2tCYXJSZWYodmFsdWU6IE1hdFNuYWNrQmFyUmVmPGFueT4gfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudFNuYWNrQmFyKSB7XG4gICAgICB0aGlzLl9wYXJlbnRTbmFja0Jhci5fb3BlbmVkU25hY2tCYXJSZWYgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc25hY2tCYXJSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfbGl2ZTogTGl2ZUFubm91bmNlcixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBfYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50U25hY2tCYXI6IF9NYXRTbmFja0JhckJhc2UsXG4gICAgQEluamVjdChNQVRfU05BQ0tfQkFSX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdENvbmZpZzogTWF0U25hY2tCYXJDb25maWcsXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgZGlzcGF0Y2hlcyBhIHNuYWNrIGJhciB3aXRoIGEgY3VzdG9tIGNvbXBvbmVudCBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxuICAgKiBjdXJyZW50bHkgb3BlbmVkIHNuYWNrIGJhcnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IHRvIGJlIGluc3RhbnRpYXRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIGZvciB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgb3BlbkZyb21Db21wb25lbnQ8VCwgRCA9IGFueT4oXG4gICAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgIGNvbmZpZz86IE1hdFNuYWNrQmFyQ29uZmlnPEQ+LFxuICApOiBNYXRTbmFja0JhclJlZjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaChjb21wb25lbnQsIGNvbmZpZykgYXMgTWF0U25hY2tCYXJSZWY8VD47XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgZGlzcGF0Y2hlcyBhIHNuYWNrIGJhciB3aXRoIGEgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgY29udGVudCwgcmVtb3ZpbmcgYW55XG4gICAqIGN1cnJlbnRseSBvcGVuZWQgc25hY2sgYmFycy5cbiAgICpcbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHRvIGJlIGluc3RhbnRpYXRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIGZvciB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgb3BlbkZyb21UZW1wbGF0ZShcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBjb25maWc/OiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKTogTWF0U25hY2tCYXJSZWY8RW1iZWRkZWRWaWV3UmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoKHRlbXBsYXRlLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc25hY2tiYXIgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2hvdyBpbiB0aGUgc25hY2tiYXIuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGxhYmVsIGZvciB0aGUgc25hY2tiYXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgc25hY2tiYXIuXG4gICAqL1xuICBvcGVuKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBhY3Rpb246IHN0cmluZyA9ICcnLFxuICAgIGNvbmZpZz86IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApOiBNYXRTbmFja0JhclJlZjxUZXh0T25seVNuYWNrQmFyPiB7XG4gICAgY29uc3QgX2NvbmZpZyA9IHsuLi50aGlzLl9kZWZhdWx0Q29uZmlnLCAuLi5jb25maWd9O1xuXG4gICAgLy8gU2luY2UgdGhlIHVzZXIgZG9lc24ndCBoYXZlIGFjY2VzcyB0byB0aGUgY29tcG9uZW50LCB3ZSBjYW5cbiAgICAvLyBvdmVycmlkZSB0aGUgZGF0YSB0byBwYXNzIGluIG91ciBvd24gbWVzc2FnZSBhbmQgYWN0aW9uLlxuICAgIF9jb25maWcuZGF0YSA9IHttZXNzYWdlLCBhY3Rpb259O1xuXG4gICAgLy8gU2luY2UgdGhlIHNuYWNrIGJhciBoYXMgYHJvbGU9XCJhbGVydFwiYCwgd2UgZG9uJ3RcbiAgICAvLyB3YW50IHRvIGFubm91bmNlIHRoZSBzYW1lIG1lc3NhZ2UgdHdpY2UuXG4gICAgaWYgKF9jb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSA9PT0gbWVzc2FnZSkge1xuICAgICAgX2NvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wZW5Gcm9tQ29tcG9uZW50KHRoaXMuc2ltcGxlU25hY2tCYXJDb21wb25lbnQsIF9jb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgY3VycmVudGx5LXZpc2libGUgc25hY2sgYmFyLlxuICAgKi9cbiAgZGlzbWlzcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3BlbmVkU25hY2tCYXJSZWYpIHtcbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBPbmx5IGRpc21pc3MgdGhlIHNuYWNrIGJhciBhdCB0aGUgY3VycmVudCBsZXZlbCBvbiBkZXN0cm95LlxuICAgIGlmICh0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsKSB7XG4gICAgICB0aGlzLl9zbmFja0JhclJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIHNuYWNrIGJhciBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoU25hY2tCYXJDb250YWluZXIoXG4gICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnLFxuICApOiBfU25hY2tCYXJDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRTbmFja0JhckNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIHRoaXMuc25hY2tCYXJDb250YWluZXJDb21wb25lbnQsXG4gICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGluamVjdG9yLFxuICAgICk7XG4gICAgY29uc3QgY29udGFpbmVyUmVmOiBDb21wb25lbnRSZWY8X1NuYWNrQmFyQ29udGFpbmVyPiA9IG92ZXJsYXlSZWYuYXR0YWNoKGNvbnRhaW5lclBvcnRhbCk7XG4gICAgY29udGFpbmVyUmVmLmluc3RhbmNlLnNuYWNrQmFyQ29uZmlnID0gY29uZmlnO1xuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUGxhY2VzIGEgbmV3IGNvbXBvbmVudCBvciBhIHRlbXBsYXRlIGFzIHRoZSBjb250ZW50IG9mIHRoZSBzbmFjayBiYXIgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoPFQ+KFxuICAgIGNvbnRlbnQ6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICB1c2VyQ29uZmlnPzogTWF0U25hY2tCYXJDb25maWcsXG4gICk6IE1hdFNuYWNrQmFyUmVmPFQgfCBFbWJlZGRlZFZpZXdSZWY8YW55Pj4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IHsuLi5uZXcgTWF0U25hY2tCYXJDb25maWcoKSwgLi4udGhpcy5fZGVmYXVsdENvbmZpZywgLi4udXNlckNvbmZpZ307XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoY29uZmlnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hTbmFja0JhckNvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xuICAgIGNvbnN0IHNuYWNrQmFyUmVmID0gbmV3IE1hdFNuYWNrQmFyUmVmPFQgfCBFbWJlZGRlZFZpZXdSZWY8YW55Pj4oY29udGFpbmVyLCBvdmVybGF5UmVmKTtcblxuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbChjb250ZW50LCBudWxsISwge1xuICAgICAgICAkaW1wbGljaXQ6IGNvbmZpZy5kYXRhLFxuICAgICAgICBzbmFja0JhclJlZixcbiAgICAgIH0gYXMgYW55KTtcblxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3Rvcihjb25maWcsIHNuYWNrQmFyUmVmKTtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29udGVudCwgdW5kZWZpbmVkLCBpbmplY3Rvcik7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWwpO1xuXG4gICAgICAvLyBXZSBjYW4ndCBwYXNzIHRoaXMgdmlhIHRoZSBpbmplY3RvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgaXMgY3JlYXRlZCBlYXJsaWVyLlxuICAgICAgc25hY2tCYXJSZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byB0aGUgYnJlYWtwb2ludCBvYnNlcnZlciBhbmQgYXR0YWNoIHRoZSBtYXQtc25hY2stYmFyLWhhbmRzZXQgY2xhc3MgYXNcbiAgICAvLyBhcHByb3ByaWF0ZS4gVGhpcyBjbGFzcyBpcyBhcHBsaWVkIHRvIHRoZSBvdmVybGF5IGVsZW1lbnQgYmVjYXVzZSB0aGUgb3ZlcmxheSBtdXN0IGV4cGFuZCB0b1xuICAgIC8vIGZpbGwgdGhlIHdpZHRoIG9mIHRoZSBzY3JlZW4gZm9yIGZ1bGwgd2lkdGggc25hY2tiYXJzLlxuICAgIHRoaXMuX2JyZWFrcG9pbnRPYnNlcnZlclxuICAgICAgLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldFBvcnRyYWl0KVxuICAgICAgLnBpcGUodGFrZVVudGlsKG92ZXJsYXlSZWYuZGV0YWNobWVudHMoKSkpXG4gICAgICAuc3Vic2NyaWJlKHN0YXRlID0+IHtcbiAgICAgICAgb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuaGFuZHNldENzc0NsYXNzLCBzdGF0ZS5tYXRjaGVzKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICAvLyBXYWl0IHVudGlsIHRoZSBzbmFjayBiYXIgY29udGVudHMgaGF2ZSBiZWVuIGFubm91bmNlZCB0aGVuIGRlbGl2ZXIgdGhpcyBtZXNzYWdlLlxuICAgICAgY29udGFpbmVyLl9vbkFubm91bmNlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2xpdmUuYW5ub3VuY2UoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UhLCBjb25maWcucG9saXRlbmVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9hbmltYXRlU25hY2tCYXIoc25hY2tCYXJSZWYsIGNvbmZpZyk7XG4gICAgdGhpcy5fb3BlbmVkU25hY2tCYXJSZWYgPSBzbmFja0JhclJlZjtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkU25hY2tCYXJSZWY7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIG9sZCBzbmFjayBiYXIgb3V0IGFuZCB0aGUgbmV3IG9uZSBpbi4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0ZVNuYWNrQmFyKHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjxhbnk+LCBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG4gICAgLy8gV2hlbiB0aGUgc25hY2tiYXIgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBzbmFja2JhciByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIHNuYWNrYmFyLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID09IHNuYWNrQmFyUmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuX2xpdmUuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRTbmFja0JhclJlZikge1xuICAgICAgLy8gSWYgYSBzbmFjayBiYXIgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBzbmFjayBiYXIgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRTbmFja0JhclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNuYWNrQmFyUmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29wZW5lZFNuYWNrQmFyUmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gc25hY2sgYmFyIGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgc25hY2sgYmFyLlxuICAgICAgc25hY2tCYXJSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhIGRpc21pc3MgdGltZW91dCBpcyBwcm92aWRlZCwgc2V0IHVwIGRpc21pc3MgYmFzZWQgb24gYWZ0ZXIgdGhlIHNuYWNrYmFyIGlzIG9wZW5lZC5cbiAgICBpZiAoY29uZmlnLmR1cmF0aW9uICYmIGNvbmZpZy5kdXJhdGlvbiA+IDApIHtcbiAgICAgIHNuYWNrQmFyUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHNuYWNrQmFyUmVmLl9kaXNtaXNzQWZ0ZXIoY29uZmlnLmR1cmF0aW9uISkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgc25hY2sgYmFyIGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZygpO1xuICAgIG92ZXJsYXlDb25maWcuZGlyZWN0aW9uID0gY29uZmlnLmRpcmVjdGlvbjtcblxuICAgIGxldCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpO1xuICAgIC8vIFNldCBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgIGNvbnN0IGlzUnRsID0gY29uZmlnLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgY29uc3QgaXNMZWZ0ID1cbiAgICAgIGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gPT09ICdsZWZ0JyB8fFxuICAgICAgKGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gPT09ICdzdGFydCcgJiYgIWlzUnRsKSB8fFxuICAgICAgKGNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gPT09ICdlbmQnICYmIGlzUnRsKTtcbiAgICBjb25zdCBpc1JpZ2h0ID0gIWlzTGVmdCAmJiBjb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uICE9PSAnY2VudGVyJztcbiAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LmxlZnQoJzAnKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHQpIHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kucmlnaHQoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG4gICAgLy8gU2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAgaWYgKGNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS50b3AoJzAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25TdHJhdGVneS5ib3R0b20oJzAnKTtcbiAgICB9XG5cbiAgICBvdmVybGF5Q29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgPSBwb3NpdGlvblN0cmF0ZWd5O1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgc25hY2sgYmFyIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIHNuYWNrIGJhci5cbiAgICogQHBhcmFtIHNuYWNrQmFyUmVmIFJlZmVyZW5jZSB0byB0aGUgc25hY2sgYmFyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnOiBNYXRTbmFja0JhckNvbmZpZywgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFQ+KTogSW5qZWN0b3Ige1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcblxuICAgIHJldHVybiBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IE1hdFNuYWNrQmFyUmVmLCB1c2VWYWx1ZTogc25hY2tCYXJSZWZ9LFxuICAgICAgICB7cHJvdmlkZTogTUFUX1NOQUNLX0JBUl9EQVRBLCB1c2VWYWx1ZTogY29uZmlnLmRhdGF9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFNlcnZpY2UgdG8gZGlzcGF0Y2ggTWF0ZXJpYWwgRGVzaWduIHNuYWNrIGJhciBtZXNzYWdlcy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IE1hdFNuYWNrQmFyTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhciBleHRlbmRzIF9NYXRTbmFja0JhckJhc2Uge1xuICBwcm90ZWN0ZWQgc2ltcGxlU25hY2tCYXJDb21wb25lbnQgPSBTaW1wbGVTbmFja0JhcjtcbiAgcHJvdGVjdGVkIHNuYWNrQmFyQ29udGFpbmVyQ29tcG9uZW50ID0gTWF0U25hY2tCYXJDb250YWluZXI7XG4gIHByb3RlY3RlZCBoYW5kc2V0Q3NzQ2xhc3MgPSAnbWF0LXNuYWNrLWJhci1oYW5kc2V0JztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGxpdmU6IExpdmVBbm5vdW5jZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudFNuYWNrQmFyOiBNYXRTbmFja0JhcixcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyxcbiAgKSB7XG4gICAgc3VwZXIob3ZlcmxheSwgbGl2ZSwgaW5qZWN0b3IsIGJyZWFrcG9pbnRPYnNlcnZlciwgcGFyZW50U25hY2tCYXIsIGRlZmF1bHRDb25maWcpO1xuICB9XG59XG4iXX0=