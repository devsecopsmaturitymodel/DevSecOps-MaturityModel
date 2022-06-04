/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, } from '@angular/cdk/overlay';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, ViewEncapsulation, ViewChild, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/a11y";
import * as i5 from "@angular/cdk/bidi";
import * as i6 from "@angular/cdk/layout";
import * as i7 from "@angular/common";
/** Time in ms to throttle repositioning after scroll events. */
export const SCROLL_THROTTLE_MS = 20;
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
export const TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
const PANEL_CLASS = 'tooltip-panel';
/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export function getMatTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
export const MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy');
/** @docs-private */
export function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
}
/** @docs-private */
export const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};
/** Injection token to be used to override the default options for `matTooltip`. */
export const MAT_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
    return {
        showDelay: 0,
        hideDelay: 0,
        touchendHideDelay: 1500,
    };
}
export class _MatTooltipBase {
    constructor(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, scrollStrategy, _dir, _defaultOptions, _document) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._ariaDescriber = _ariaDescriber;
        this._focusMonitor = _focusMonitor;
        this._dir = _dir;
        this._defaultOptions = _defaultOptions;
        this._position = 'below';
        this._disabled = false;
        this._viewInitialized = false;
        this._pointerExitEventsInitialized = false;
        this._viewportMargin = 8;
        this._cssClassPrefix = 'mat';
        this._showDelay = this._defaultOptions.showDelay;
        this._hideDelay = this._defaultOptions.hideDelay;
        /**
         * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
         * uses a long press gesture to show and hide, however it can conflict with the native browser
         * gestures. To work around the conflict, Angular Material disables native gestures on the
         * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
         * elements). The different values for this option configure the touch event handling as follows:
         * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
         *   browser gestures on particular elements. In particular, it allows text selection on inputs
         *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
         * - `on` - Enables touch gestures for all elements and disables native
         *   browser gestures with no exceptions.
         * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
         *   showing on touch devices.
         */
        this.touchGestures = 'auto';
        this._message = '';
        /** Manually-bound passive event listeners. */
        this._passiveListeners = [];
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        this._scrollStrategy = scrollStrategy;
        this._document = _document;
        if (_defaultOptions) {
            if (_defaultOptions.position) {
                this.position = _defaultOptions.position;
            }
            if (_defaultOptions.touchGestures) {
                this.touchGestures = _defaultOptions.touchGestures;
            }
        }
        _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
            if (this._overlayRef) {
                this._updatePosition(this._overlayRef);
            }
        });
    }
    /** Allows the user to define the position of the tooltip relative to the parent element */
    get position() {
        return this._position;
    }
    set position(value) {
        if (value !== this._position) {
            this._position = value;
            if (this._overlayRef) {
                this._updatePosition(this._overlayRef);
                this._tooltipInstance?.show(0);
                this._overlayRef.updatePosition();
            }
        }
    }
    /** Disables the display of the tooltip. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // If tooltip is disabled, hide immediately.
        if (this._disabled) {
            this.hide(0);
        }
        else {
            this._setupPointerEnterEventsIfNeeded();
        }
    }
    /** The default delay in ms before showing the tooltip after show is called */
    get showDelay() {
        return this._showDelay;
    }
    set showDelay(value) {
        this._showDelay = coerceNumberProperty(value);
    }
    /** The default delay in ms before hiding the tooltip after hide is called */
    get hideDelay() {
        return this._hideDelay;
    }
    set hideDelay(value) {
        this._hideDelay = coerceNumberProperty(value);
        if (this._tooltipInstance) {
            this._tooltipInstance._mouseLeaveHideDelay = this._hideDelay;
        }
    }
    /** The message to be displayed in the tooltip */
    get message() {
        return this._message;
    }
    set message(value) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message, 'tooltip');
        // If the message is not a string (e.g. number), convert it to a string and trim it.
        // Must convert with `String(value)`, not `${value}`, otherwise Closure Compiler optimises
        // away the string-conversion: https://github.com/angular/components/issues/20684
        this._message = value != null ? String(value).trim() : '';
        if (!this._message && this._isTooltipVisible()) {
            this.hide(0);
        }
        else {
            this._setupPointerEnterEventsIfNeeded();
            this._updateTooltipMessage();
            this._ngZone.runOutsideAngular(() => {
                // The `AriaDescriber` has some functionality that avoids adding a description if it's the
                // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
                // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
                // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
                Promise.resolve().then(() => {
                    this._ariaDescriber.describe(this._elementRef.nativeElement, this.message, 'tooltip');
                });
            });
        }
    }
    /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
    get tooltipClass() {
        return this._tooltipClass;
    }
    set tooltipClass(value) {
        this._tooltipClass = value;
        if (this._tooltipInstance) {
            this._setTooltipClass(this._tooltipClass);
        }
    }
    ngAfterViewInit() {
        // This needs to happen after view init so the initial values for all inputs have been set.
        this._viewInitialized = true;
        this._setupPointerEnterEventsIfNeeded();
        this._focusMonitor
            .monitor(this._elementRef)
            .pipe(takeUntil(this._destroyed))
            .subscribe(origin => {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                this._ngZone.run(() => this.hide(0));
            }
            else if (origin === 'keyboard') {
                this._ngZone.run(() => this.show());
            }
        });
    }
    /**
     * Dispose the tooltip when destroyed.
     */
    ngOnDestroy() {
        const nativeElement = this._elementRef.nativeElement;
        clearTimeout(this._touchstartTimeout);
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._tooltipInstance = null;
        }
        // Clean up the event listeners set in the constructor
        this._passiveListeners.forEach(([event, listener]) => {
            nativeElement.removeEventListener(event, listener, passiveListenerOptions);
        });
        this._passiveListeners.length = 0;
        this._destroyed.next();
        this._destroyed.complete();
        this._ariaDescriber.removeDescription(nativeElement, this.message, 'tooltip');
        this._focusMonitor.stopMonitoring(nativeElement);
    }
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    show(delay = this.showDelay) {
        if (this.disabled ||
            !this.message ||
            (this._isTooltipVisible() &&
                !this._tooltipInstance._showTimeoutId &&
                !this._tooltipInstance._hideTimeoutId)) {
            return;
        }
        const overlayRef = this._createOverlay();
        this._detach();
        this._portal =
            this._portal || new ComponentPortal(this._tooltipComponent, this._viewContainerRef);
        const instance = (this._tooltipInstance = overlayRef.attach(this._portal).instance);
        instance._triggerElement = this._elementRef.nativeElement;
        instance._mouseLeaveHideDelay = this._hideDelay;
        instance
            .afterHidden()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._detach());
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage();
        instance.show(delay);
    }
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    hide(delay = this.hideDelay) {
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    }
    /** Shows/hides the tooltip */
    toggle() {
        this._isTooltipVisible() ? this.hide() : this.show();
    }
    /** Returns true if the tooltip is currently visible to the user */
    _isTooltipVisible() {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    }
    /** Create the overlay config and position strategy */
    _createOverlay() {
        if (this._overlayRef) {
            return this._overlayRef;
        }
        const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
        // Create connected position strategy that listens for scroll events to reposition.
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`)
            .withFlexibleDimensions(false)
            .withViewportMargin(this._viewportMargin)
            .withScrollableContainers(scrollableAncestors);
        strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe(change => {
            this._updateCurrentPositionClass(change.connectionPair);
            if (this._tooltipInstance) {
                if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
                    // After position changes occur and the overlay is clipped by
                    // a parent scrollable then close the tooltip.
                    this._ngZone.run(() => this.hide(0));
                }
            }
        });
        this._overlayRef = this._overlay.create({
            direction: this._dir,
            positionStrategy: strategy,
            panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}`,
            scrollStrategy: this._scrollStrategy(),
        });
        this._updatePosition(this._overlayRef);
        this._overlayRef
            .detachments()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._detach());
        this._overlayRef
            .outsidePointerEvents()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._tooltipInstance?._handleBodyInteraction());
        this._overlayRef
            .keydownEvents()
            .pipe(takeUntil(this._destroyed))
            .subscribe(event => {
            if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                event.preventDefault();
                event.stopPropagation();
                this._ngZone.run(() => this.hide(0));
            }
        });
        if (this._defaultOptions?.disableTooltipInteractivity) {
            this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`);
        }
        return this._overlayRef;
    }
    /** Detaches the currently-attached tooltip. */
    _detach() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
        this._tooltipInstance = null;
    }
    /** Updates the position of the current tooltip. */
    _updatePosition(overlayRef) {
        const position = overlayRef.getConfig().positionStrategy;
        const origin = this._getOrigin();
        const overlay = this._getOverlayPosition();
        position.withPositions([
            this._addOffset({ ...origin.main, ...overlay.main }),
            this._addOffset({ ...origin.fallback, ...overlay.fallback }),
        ]);
    }
    /** Adds the configured offset to a position. Used as a hook for child classes. */
    _addOffset(position) {
        return position;
    }
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     */
    _getOrigin() {
        const isLtr = !this._dir || this._dir.value == 'ltr';
        const position = this.position;
        let originPosition;
        if (position == 'above' || position == 'below') {
            originPosition = { originX: 'center', originY: position == 'above' ? 'top' : 'bottom' };
        }
        else if (position == 'before' ||
            (position == 'left' && isLtr) ||
            (position == 'right' && !isLtr)) {
            originPosition = { originX: 'start', originY: 'center' };
        }
        else if (position == 'after' ||
            (position == 'right' && isLtr) ||
            (position == 'left' && !isLtr)) {
            originPosition = { originX: 'end', originY: 'center' };
        }
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw getMatTooltipInvalidPositionError(position);
        }
        const { x, y } = this._invertPosition(originPosition.originX, originPosition.originY);
        return {
            main: originPosition,
            fallback: { originX: x, originY: y },
        };
    }
    /** Returns the overlay position and a fallback position based on the user's preference */
    _getOverlayPosition() {
        const isLtr = !this._dir || this._dir.value == 'ltr';
        const position = this.position;
        let overlayPosition;
        if (position == 'above') {
            overlayPosition = { overlayX: 'center', overlayY: 'bottom' };
        }
        else if (position == 'below') {
            overlayPosition = { overlayX: 'center', overlayY: 'top' };
        }
        else if (position == 'before' ||
            (position == 'left' && isLtr) ||
            (position == 'right' && !isLtr)) {
            overlayPosition = { overlayX: 'end', overlayY: 'center' };
        }
        else if (position == 'after' ||
            (position == 'right' && isLtr) ||
            (position == 'left' && !isLtr)) {
            overlayPosition = { overlayX: 'start', overlayY: 'center' };
        }
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw getMatTooltipInvalidPositionError(position);
        }
        const { x, y } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
        return {
            main: overlayPosition,
            fallback: { overlayX: x, overlayY: y },
        };
    }
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    _updateTooltipMessage() {
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            this._ngZone.onMicrotaskEmpty.pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
                if (this._tooltipInstance) {
                    this._overlayRef.updatePosition();
                }
            });
        }
    }
    /** Updates the tooltip class */
    _setTooltipClass(tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    }
    /** Inverts an overlay position. */
    _invertPosition(x, y) {
        if (this.position === 'above' || this.position === 'below') {
            if (y === 'top') {
                y = 'bottom';
            }
            else if (y === 'bottom') {
                y = 'top';
            }
        }
        else {
            if (x === 'end') {
                x = 'start';
            }
            else if (x === 'start') {
                x = 'end';
            }
        }
        return { x, y };
    }
    /** Updates the class on the overlay panel based on the current position of the tooltip. */
    _updateCurrentPositionClass(connectionPair) {
        const { overlayY, originX, originY } = connectionPair;
        let newPosition;
        // If the overlay is in the middle along the Y axis,
        // it means that it's either before or after.
        if (overlayY === 'center') {
            // Note that since this information is used for styling, we want to
            // resolve `start` and `end` to their real values, otherwise consumers
            // would have to remember to do it themselves on each consumption.
            if (this._dir && this._dir.value === 'rtl') {
                newPosition = originX === 'end' ? 'left' : 'right';
            }
            else {
                newPosition = originX === 'start' ? 'left' : 'right';
            }
        }
        else {
            newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below';
        }
        if (newPosition !== this._currentPosition) {
            const overlayRef = this._overlayRef;
            if (overlayRef) {
                const classPrefix = `${this._cssClassPrefix}-${PANEL_CLASS}-`;
                overlayRef.removePanelClass(classPrefix + this._currentPosition);
                overlayRef.addPanelClass(classPrefix + newPosition);
            }
            this._currentPosition = newPosition;
        }
    }
    /** Binds the pointer events to the tooltip trigger. */
    _setupPointerEnterEventsIfNeeded() {
        // Optimization: Defer hooking up events if there's no message or the tooltip is disabled.
        if (this._disabled ||
            !this.message ||
            !this._viewInitialized ||
            this._passiveListeners.length) {
            return;
        }
        // The mouse events shouldn't be bound on mobile devices, because they can prevent the
        // first tap from firing its click event or can cause the tooltip to open for clicks.
        if (this._platformSupportsMouseEvents()) {
            this._passiveListeners.push([
                'mouseenter',
                () => {
                    this._setupPointerExitEventsIfNeeded();
                    this.show();
                },
            ]);
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            this._passiveListeners.push([
                'touchstart',
                () => {
                    // Note that it's important that we don't `preventDefault` here,
                    // because it can prevent click events from firing on the element.
                    this._setupPointerExitEventsIfNeeded();
                    clearTimeout(this._touchstartTimeout);
                    this._touchstartTimeout = setTimeout(() => this.show(), LONGPRESS_DELAY);
                },
            ]);
        }
        this._addListeners(this._passiveListeners);
    }
    _setupPointerExitEventsIfNeeded() {
        if (this._pointerExitEventsInitialized) {
            return;
        }
        this._pointerExitEventsInitialized = true;
        const exitListeners = [];
        if (this._platformSupportsMouseEvents()) {
            exitListeners.push([
                'mouseleave',
                event => {
                    const newTarget = event.relatedTarget;
                    if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
                        this.hide();
                    }
                },
            ], ['wheel', event => this._wheelListener(event)]);
        }
        else if (this.touchGestures !== 'off') {
            this._disableNativeGesturesIfNecessary();
            const touchendListener = () => {
                clearTimeout(this._touchstartTimeout);
                this.hide(this._defaultOptions.touchendHideDelay);
            };
            exitListeners.push(['touchend', touchendListener], ['touchcancel', touchendListener]);
        }
        this._addListeners(exitListeners);
        this._passiveListeners.push(...exitListeners);
    }
    _addListeners(listeners) {
        listeners.forEach(([event, listener]) => {
            this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
        });
    }
    _platformSupportsMouseEvents() {
        return !this._platform.IOS && !this._platform.ANDROID;
    }
    /** Listener for the `wheel` event on the element. */
    _wheelListener(event) {
        if (this._isTooltipVisible()) {
            const elementUnderPointer = this._document.elementFromPoint(event.clientX, event.clientY);
            const element = this._elementRef.nativeElement;
            // On non-touch devices we depend on the `mouseleave` event to close the tooltip, but it
            // won't fire if the user scrolls away using the wheel without moving their cursor. We
            // work around it by finding the element under the user's cursor and closing the tooltip
            // if it's not the trigger.
            if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
                this.hide();
            }
        }
    }
    /** Disables the native browser gestures, based on how the tooltip has been configured. */
    _disableNativeGesturesIfNecessary() {
        const gestures = this.touchGestures;
        if (gestures !== 'off') {
            const element = this._elementRef.nativeElement;
            const style = element.style;
            // If gestures are set to `auto`, we don't disable text selection on inputs and
            // textareas, because it prevents the user from typing into them on iOS Safari.
            if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
                style.userSelect =
                    style.msUserSelect =
                        style.webkitUserSelect =
                            style.MozUserSelect =
                                'none';
            }
            // If we have `auto` gestures and the element uses native HTML dragging,
            // we don't set `-webkit-user-drag` because it prevents the native behavior.
            if (gestures === 'on' || !element.draggable) {
                style.webkitUserDrag = 'none';
            }
            style.touchAction = 'none';
            style.webkitTapHighlightColor = 'transparent';
        }
    }
}
_MatTooltipBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTooltipBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatTooltipBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatTooltipBase, inputs: { position: ["matTooltipPosition", "position"], disabled: ["matTooltipDisabled", "disabled"], showDelay: ["matTooltipShowDelay", "showDelay"], hideDelay: ["matTooltipHideDelay", "hideDelay"], touchGestures: ["matTooltipTouchGestures", "touchGestures"], message: ["matTooltip", "message"], tooltipClass: ["matTooltipClass", "tooltipClass"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTooltipBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i2.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i3.Platform }, { type: i4.AriaDescriber }, { type: i4.FocusMonitor }, { type: undefined }, { type: i5.Directionality }, { type: undefined }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { position: [{
                type: Input,
                args: ['matTooltipPosition']
            }], disabled: [{
                type: Input,
                args: ['matTooltipDisabled']
            }], showDelay: [{
                type: Input,
                args: ['matTooltipShowDelay']
            }], hideDelay: [{
                type: Input,
                args: ['matTooltipHideDelay']
            }], touchGestures: [{
                type: Input,
                args: ['matTooltipTouchGestures']
            }], message: [{
                type: Input,
                args: ['matTooltip']
            }], tooltipClass: [{
                type: Input,
                args: ['matTooltipClass']
            }] } });
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
export class MatTooltip extends _MatTooltipBase {
    constructor(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document) {
        super(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document);
        this._tooltipComponent = TooltipComponent;
    }
}
MatTooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTooltip, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i2.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i3.Platform }, { token: i4.AriaDescriber }, { token: i4.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i5.Directionality, optional: true }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
MatTooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTooltip, selector: "[matTooltip]", host: { classAttribute: "mat-tooltip-trigger" }, exportAs: ["matTooltip"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        'class': 'mat-tooltip-trigger',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i2.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i3.Platform }, { type: i4.AriaDescriber }, { type: i4.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TOOLTIP_SCROLL_STRATEGY]
                }] }, { type: i5.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_TOOLTIP_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
export class _TooltipComponentBase {
    constructor(_changeDetectorRef, animationMode) {
        this._changeDetectorRef = _changeDetectorRef;
        /** Property watched by the animation framework to show or hide the tooltip */
        this._visibility = 'initial';
        /** Whether interactions on the page should close the tooltip */
        this._closeOnInteraction = false;
        /** Whether the tooltip is currently visible. */
        this._isVisible = false;
        /** Subject for notifying that the tooltip has been hidden from the view */
        this._onHide = new Subject();
        this._animationsDisabled = animationMode === 'NoopAnimations';
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param delay Amount of milliseconds to the delay showing the tooltip.
     */
    show(delay) {
        // Cancel the delayed hide if it is scheduled
        clearTimeout(this._hideTimeoutId);
        this._showTimeoutId = setTimeout(() => {
            this._toggleVisibility(true);
            this._showTimeoutId = undefined;
        }, delay);
    }
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param delay Amount of milliseconds to delay showing the tooltip.
     */
    hide(delay) {
        // Cancel the delayed show if it is scheduled
        clearTimeout(this._showTimeoutId);
        this._hideTimeoutId = setTimeout(() => {
            this._toggleVisibility(false);
            this._hideTimeoutId = undefined;
        }, delay);
    }
    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    afterHidden() {
        return this._onHide;
    }
    /** Whether the tooltip is being displayed. */
    isVisible() {
        return this._isVisible;
    }
    ngOnDestroy() {
        clearTimeout(this._showTimeoutId);
        clearTimeout(this._hideTimeoutId);
        this._onHide.complete();
        this._triggerElement = null;
    }
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.io/design/components/tooltips.html#behavior
     */
    _handleBodyInteraction() {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    }
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     */
    _markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
    _handleMouseLeave({ relatedTarget }) {
        if (!relatedTarget || !this._triggerElement.contains(relatedTarget)) {
            this.hide(this._mouseLeaveHideDelay);
        }
    }
    /**
     * Callback for when the timeout in this.show() gets completed.
     * This method is only needed by the mdc-tooltip, and so it is only implemented
     * in the mdc-tooltip, not here.
     */
    _onShow() { }
    /** Event listener dispatched when an animation on the tooltip finishes. */
    _handleAnimationEnd({ animationName }) {
        if (animationName === this._showAnimation || animationName === this._hideAnimation) {
            this._finalizeAnimation(animationName === this._showAnimation);
        }
    }
    /** Handles the cleanup after an animation has finished. */
    _finalizeAnimation(toVisible) {
        if (toVisible) {
            this._closeOnInteraction = true;
        }
        else if (!this.isVisible()) {
            this._onHide.next();
        }
    }
    /** Toggles the visibility of the tooltip element. */
    _toggleVisibility(isVisible) {
        // We set the classes directly here ourselves so that toggling the tooltip state
        // isn't bound by change detection. This allows us to hide it even if the
        // view ref has been detached from the CD tree.
        const tooltip = this._tooltip.nativeElement;
        const showClass = this._showAnimation;
        const hideClass = this._hideAnimation;
        tooltip.classList.remove(isVisible ? hideClass : showClass);
        tooltip.classList.add(isVisible ? showClass : hideClass);
        this._isVisible = isVisible;
        // It's common for internal apps to disable animations using `* { animation: none !important }`
        // which can break the opening sequence. Try to detect such cases and work around them.
        if (isVisible && !this._animationsDisabled && typeof getComputedStyle === 'function') {
            const styles = getComputedStyle(tooltip);
            // Use `getPropertyValue` to avoid issues with property renaming.
            if (styles.getPropertyValue('animation-duration') === '0s' ||
                styles.getPropertyValue('animation-name') === 'none') {
                this._animationsDisabled = true;
            }
        }
        if (isVisible) {
            this._onShow();
        }
        if (this._animationsDisabled) {
            tooltip.classList.add('_mat-animation-noopable');
            this._finalizeAnimation(isVisible);
        }
    }
}
_TooltipComponentBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _TooltipComponentBase, deps: [{ token: i0.ChangeDetectorRef }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_TooltipComponentBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _TooltipComponentBase, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _TooltipComponentBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
export class TooltipComponent extends _TooltipComponentBase {
    constructor(changeDetectorRef, _breakpointObserver, animationMode) {
        super(changeDetectorRef, animationMode);
        this._breakpointObserver = _breakpointObserver;
        /** Stream that emits whether the user has a handset-sized display.  */
        this._isHandset = this._breakpointObserver.observe(Breakpoints.Handset);
        this._showAnimation = 'mat-tooltip-show';
        this._hideAnimation = 'mat-tooltip-hide';
    }
}
TooltipComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i6.BreakpointObserver }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
TooltipComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: TooltipComponent, selector: "mat-tooltip-component", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" }, properties: { "style.zoom": "isVisible() ? 1 : null" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div #tooltip\n     class=\"mat-tooltip\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">{{message}}</div>\n", styles: [".mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis;transform:scale(0)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.cdk-high-contrast-active .mat-tooltip{outline:solid 1px}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(0.99)}100%{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}.mat-tooltip-show{animation:mat-tooltip-show 200ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-tooltip-hide{animation:mat-tooltip-hide 100ms cubic-bezier(0, 0, 0.2, 1) forwards}\n"], directives: [{ type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], pipes: { "async": i7.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tooltip-component', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': 'isVisible() ? 1 : null',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, template: "<div #tooltip\n     class=\"mat-tooltip\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">{{message}}</div>\n", styles: [".mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis;transform:scale(0)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.cdk-high-contrast-active .mat-tooltip{outline:solid 1px}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(0.99)}100%{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}.mat-tooltip-show{animation:mat-tooltip-show 200ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-tooltip-hide{animation:mat-tooltip-hide 100ms cubic-bezier(0, 0, 0.2, 1) forwards}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i6.BreakpointObserver }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _tooltip: [{
                type: ViewChild,
                args: ['tooltip', {
                        // Use a static query here since we interact directly with
                        // the DOM which can happen before `ngAfterViewInit`.
                        static: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sdGlwL3Rvb2x0aXAudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbHRpcC90b29sdGlwLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFDckYsT0FBTyxFQUlMLE9BQU8sR0FPUixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUUsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMsZUFBZSxFQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUVqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxN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RCxxREFBcUQ7d0JBQ3JELE1BQU0sRUFBRSxJQUFJO3FCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50cywgQnJlYWtwb2ludFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvcyxcbiAgQ29ubmVjdGlvblBvc2l0aW9uUGFpcixcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1Njcm9sbERpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyVmlld0luaXQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFBvc2l0aW9uID0gJ2xlZnQnIHwgJ3JpZ2h0JyB8ICdhYm92ZScgfCAnYmVsb3cnIHwgJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGhvdyB0aGUgdG9vbHRpcCB0cmlnZ2VyIHNob3VsZCBoYW5kbGUgdG91Y2ggZ2VzdHVyZXMuXG4gKiBTZWUgYE1hdFRvb2x0aXAudG91Y2hHZXN0dXJlc2AgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCB0eXBlIFRvb2x0aXBUb3VjaEdlc3R1cmVzID0gJ2F1dG8nIHwgJ29uJyB8ICdvZmYnO1xuXG4vKiogUG9zc2libGUgdmlzaWJpbGl0eSBzdGF0ZXMgb2YgYSB0b29sdGlwLiAqL1xuZXhwb3J0IHR5cGUgVG9vbHRpcFZpc2liaWxpdHkgPSAnaW5pdGlhbCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJztcblxuLyoqIFRpbWUgaW4gbXMgdG8gdGhyb3R0bGUgcmVwb3NpdGlvbmluZyBhZnRlciBzY3JvbGwgZXZlbnRzLiAqL1xuZXhwb3J0IGNvbnN0IFNDUk9MTF9USFJPVFRMRV9NUyA9IDIwO1xuXG4vKipcbiAqIENTUyBjbGFzcyB0aGF0IHdpbGwgYmUgYXR0YWNoZWQgdG8gdGhlIG92ZXJsYXkgcGFuZWwuXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjAgcmVtb3ZlIHRoaXMgdmFyaWFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IFRPT0xUSVBfUEFORUxfQ0xBU1MgPSAnbWF0LXRvb2x0aXAtcGFuZWwnO1xuXG5jb25zdCBQQU5FTF9DTEFTUyA9ICd0b29sdGlwLXBhbmVsJztcblxuLyoqIE9wdGlvbnMgdXNlZCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xuY29uc3QgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KTtcblxuLyoqXG4gKiBUaW1lIGJldHdlZW4gdGhlIHVzZXIgcHV0dGluZyB0aGUgcG9pbnRlciBvbiBhIHRvb2x0aXBcbiAqIHRyaWdnZXIgYW5kIHRoZSBsb25nIHByZXNzIGV2ZW50IGJlaW5nIGZpcmVkLlxuICovXG5jb25zdCBMT05HUFJFU1NfREVMQVkgPSA1MDA7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gaWYgdGhlIHVzZXIgc3VwcGxpZWQgYW4gaW52YWxpZCB0b29sdGlwIHBvc2l0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0VG9vbHRpcEludmFsaWRQb3NpdGlvbkVycm9yKHBvc2l0aW9uOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEVycm9yKGBUb29sdGlwIHBvc2l0aW9uIFwiJHtwb3NpdGlvbn1cIiBpcyBpbnZhbGlkLmApO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgdG9vbHRpcCBpcyB2aXNpYmxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtdG9vbHRpcC1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oe3Njcm9sbFRocm90dGxlOiBTQ1JPTExfVEhST1RUTEVfTVN9KTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIERlZmF1bHQgYG1hdFRvb2x0aXBgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zIHtcbiAgLyoqIERlZmF1bHQgZGVsYXkgd2hlbiB0aGUgdG9vbHRpcCBpcyBzaG93bi4gKi9cbiAgc2hvd0RlbGF5OiBudW1iZXI7XG5cbiAgLyoqIERlZmF1bHQgZGVsYXkgd2hlbiB0aGUgdG9vbHRpcCBpcyBoaWRkZW4uICovXG4gIGhpZGVEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBEZWZhdWx0IGRlbGF5IHdoZW4gaGlkaW5nIHRoZSB0b29sdGlwIG9uIGEgdG91Y2ggZGV2aWNlLiAqL1xuICB0b3VjaGVuZEhpZGVEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBEZWZhdWx0IHRvdWNoIGdlc3R1cmUgaGFuZGxpbmcgZm9yIHRvb2x0aXBzLiAqL1xuICB0b3VjaEdlc3R1cmVzPzogVG9vbHRpcFRvdWNoR2VzdHVyZXM7XG5cbiAgLyoqIERlZmF1bHQgcG9zaXRpb24gZm9yIHRvb2x0aXBzLiAqL1xuICBwb3NpdGlvbj86IFRvb2x0aXBQb3NpdGlvbjtcblxuICAvKiogRGlzYWJsZXMgdGhlIGFiaWxpdHkgZm9yIHRoZSB1c2VyIHRvIGludGVyYWN0IHdpdGggdGhlIHRvb2x0aXAgZWxlbWVudC4gKi9cbiAgZGlzYWJsZVRvb2x0aXBJbnRlcmFjdGl2aXR5PzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXRUb29sdGlwYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0VG9vbHRpcERlZmF1bHRPcHRpb25zPihcbiAgJ21hdC10b29sdGlwLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9UT09MVElQX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgc2hvd0RlbGF5OiAwLFxuICAgIGhpZGVEZWxheTogMCxcbiAgICB0b3VjaGVuZEhpZGVEZWxheTogMTUwMCxcbiAgfTtcbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRvb2x0aXBCYXNlPFQgZXh0ZW5kcyBfVG9vbHRpcENvbXBvbmVudEJhc2U+XG4gIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0XG57XG4gIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgX3Rvb2x0aXBJbnN0YW5jZTogVCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBfcG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD47XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBUb29sdGlwUG9zaXRpb24gPSAnYmVsb3cnO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF90b29sdGlwQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF92aWV3SW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfcG9pbnRlckV4aXRFdmVudHNJbml0aWFsaXplZCA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgX3Rvb2x0aXBDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD47XG4gIHByb3RlY3RlZCBfdmlld3BvcnRNYXJnaW4gPSA4O1xuICBwcml2YXRlIF9jdXJyZW50UG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9jc3NDbGFzc1ByZWZpeDogc3RyaW5nID0gJ21hdCc7XG5cbiAgLyoqIEFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBUb29sdGlwUG9zaXRpb24ge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuICBzZXQgcG9zaXRpb24odmFsdWU6IFRvb2x0aXBQb3NpdGlvbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fcG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKHRoaXMuX292ZXJsYXlSZWYpO1xuICAgICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2U/LnNob3coMCk7XG4gICAgICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRGlzYWJsZXMgdGhlIGRpc3BsYXkgb2YgdGhlIHRvb2x0aXAuICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcERpc2FibGVkJylcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIElmIHRvb2x0aXAgaXMgZGlzYWJsZWQsIGhpZGUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGRlZmF1bHQgZGVsYXkgaW4gbXMgYmVmb3JlIHNob3dpbmcgdGhlIHRvb2x0aXAgYWZ0ZXIgc2hvdyBpcyBjYWxsZWQgKi9cbiAgQElucHV0KCdtYXRUb29sdGlwU2hvd0RlbGF5JylcbiAgZ2V0IHNob3dEZWxheSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaG93RGVsYXk7XG4gIH1cbiAgc2V0IHNob3dEZWxheSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9zaG93RGVsYXkgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd0RlbGF5ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuc2hvd0RlbGF5O1xuXG4gIC8qKiBUaGUgZGVmYXVsdCBkZWxheSBpbiBtcyBiZWZvcmUgaGlkaW5nIHRoZSB0b29sdGlwIGFmdGVyIGhpZGUgaXMgY2FsbGVkICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcEhpZGVEZWxheScpXG4gIGdldCBoaWRlRGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZURlbGF5O1xuICB9XG4gIHNldCBoaWRlRGVsYXkodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faGlkZURlbGF5ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLl9tb3VzZUxlYXZlSGlkZURlbGF5ID0gdGhpcy5faGlkZURlbGF5O1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9oaWRlRGVsYXkgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5oaWRlRGVsYXk7XG5cbiAgLyoqXG4gICAqIEhvdyB0b3VjaCBnZXN0dXJlcyBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgdG9vbHRpcC4gT24gdG91Y2ggZGV2aWNlcyB0aGUgdG9vbHRpcCBkaXJlY3RpdmVcbiAgICogdXNlcyBhIGxvbmcgcHJlc3MgZ2VzdHVyZSB0byBzaG93IGFuZCBoaWRlLCBob3dldmVyIGl0IGNhbiBjb25mbGljdCB3aXRoIHRoZSBuYXRpdmUgYnJvd3NlclxuICAgKiBnZXN0dXJlcy4gVG8gd29yayBhcm91bmQgdGhlIGNvbmZsaWN0LCBBbmd1bGFyIE1hdGVyaWFsIGRpc2FibGVzIG5hdGl2ZSBnZXN0dXJlcyBvbiB0aGVcbiAgICogdHJpZ2dlciwgYnV0IHRoYXQgbWlnaHQgbm90IGJlIGRlc2lyYWJsZSBvbiBwYXJ0aWN1bGFyIGVsZW1lbnRzIChlLmcuIGlucHV0cyBhbmQgZHJhZ2dhYmxlXG4gICAqIGVsZW1lbnRzKS4gVGhlIGRpZmZlcmVudCB2YWx1ZXMgZm9yIHRoaXMgb3B0aW9uIGNvbmZpZ3VyZSB0aGUgdG91Y2ggZXZlbnQgaGFuZGxpbmcgYXMgZm9sbG93czpcbiAgICogLSBgYXV0b2AgLSBFbmFibGVzIHRvdWNoIGdlc3R1cmVzIGZvciBhbGwgZWxlbWVudHMsIGJ1dCB0cmllcyB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBuYXRpdmVcbiAgICogICBicm93c2VyIGdlc3R1cmVzIG9uIHBhcnRpY3VsYXIgZWxlbWVudHMuIEluIHBhcnRpY3VsYXIsIGl0IGFsbG93cyB0ZXh0IHNlbGVjdGlvbiBvbiBpbnB1dHNcbiAgICogICBhbmQgdGV4dGFyZWFzLCBhbmQgcHJlc2VydmVzIHRoZSBuYXRpdmUgYnJvd3NlciBkcmFnZ2luZyBvbiBlbGVtZW50cyBtYXJrZWQgYXMgYGRyYWdnYWJsZWAuXG4gICAqIC0gYG9uYCAtIEVuYWJsZXMgdG91Y2ggZ2VzdHVyZXMgZm9yIGFsbCBlbGVtZW50cyBhbmQgZGlzYWJsZXMgbmF0aXZlXG4gICAqICAgYnJvd3NlciBnZXN0dXJlcyB3aXRoIG5vIGV4Y2VwdGlvbnMuXG4gICAqIC0gYG9mZmAgLSBEaXNhYmxlcyB0b3VjaCBnZXN0dXJlcy4gTm90ZSB0aGF0IHRoaXMgd2lsbCBwcmV2ZW50IHRoZSB0b29sdGlwIGZyb21cbiAgICogICBzaG93aW5nIG9uIHRvdWNoIGRldmljZXMuXG4gICAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXBUb3VjaEdlc3R1cmVzJykgdG91Y2hHZXN0dXJlczogVG9vbHRpcFRvdWNoR2VzdHVyZXMgPSAnYXV0byc7XG5cbiAgLyoqIFRoZSBtZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9vbHRpcCAqL1xuICBASW5wdXQoJ21hdFRvb2x0aXAnKVxuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX21lc3NhZ2UsICd0b29sdGlwJyk7XG5cbiAgICAvLyBJZiB0aGUgbWVzc2FnZSBpcyBub3QgYSBzdHJpbmcgKGUuZy4gbnVtYmVyKSwgY29udmVydCBpdCB0byBhIHN0cmluZyBhbmQgdHJpbSBpdC5cbiAgICAvLyBNdXN0IGNvbnZlcnQgd2l0aCBgU3RyaW5nKHZhbHVlKWAsIG5vdCBgJHt2YWx1ZX1gLCBvdGhlcndpc2UgQ2xvc3VyZSBDb21waWxlciBvcHRpbWlzZXNcbiAgICAvLyBhd2F5IHRoZSBzdHJpbmctY29udmVyc2lvbjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2ODRcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWUgIT0gbnVsbCA/IFN0cmluZyh2YWx1ZSkudHJpbSgpIDogJyc7XG5cbiAgICBpZiAoIXRoaXMuX21lc3NhZ2UgJiYgdGhpcy5faXNUb29sdGlwVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmhpZGUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldHVwUG9pbnRlckVudGVyRXZlbnRzSWZOZWVkZWQoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVRvb2x0aXBNZXNzYWdlKCk7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAvLyBUaGUgYEFyaWFEZXNjcmliZXJgIGhhcyBzb21lIGZ1bmN0aW9uYWxpdHkgdGhhdCBhdm9pZHMgYWRkaW5nIGEgZGVzY3JpcHRpb24gaWYgaXQncyB0aGVcbiAgICAgICAgLy8gc2FtZSBhcyB0aGUgYGFyaWEtbGFiZWxgIG9mIGFuIGVsZW1lbnQsIGhvd2V2ZXIgd2UgY2FuJ3Qga25vdyB3aGV0aGVyIHRoZSB0b29sdGlwIHRyaWdnZXJcbiAgICAgICAgLy8gaGFzIGEgZGF0YS1ib3VuZCBgYXJpYS1sYWJlbGAgb3Igd2hlbiBpdCdsbCBiZSBzZXQgZm9yIHRoZSBmaXJzdCB0aW1lLiBXZSBjYW4gYXZvaWQgdGhlXG4gICAgICAgIC8vIGlzc3VlIGJ5IGRlZmVycmluZyB0aGUgZGVzY3JpcHRpb24gYnkgYSB0aWNrIHNvIEFuZ3VsYXIgaGFzIHRpbWUgdG8gc2V0IHRoZSBgYXJpYS1sYWJlbGAuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLm1lc3NhZ2UsICd0b29sdGlwJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21lc3NhZ2UgPSAnJztcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHRvb2x0aXAuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgnbWF0VG9vbHRpcENsYXNzJylcbiAgZ2V0IHRvb2x0aXBDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9vbHRpcENsYXNzO1xuICB9XG4gIHNldCB0b29sdGlwQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuX3Rvb2x0aXBDbGFzcyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl90b29sdGlwSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX3NldFRvb2x0aXBDbGFzcyh0aGlzLl90b29sdGlwQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNYW51YWxseS1ib3VuZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfcGFzc2l2ZUxpc3RlbmVyczogKHJlYWRvbmx5IFtzdHJpbmcsIEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3RdKVtdID1cbiAgICBbXTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGRvY3VtZW50LiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFRpbWVyIHN0YXJ0ZWQgYXQgdGhlIGxhc3QgYHRvdWNoc3RhcnRgIGV2ZW50LiAqL1xuICBwcml2YXRlIF90b3VjaHN0YXJ0VGltZW91dDogbnVtYmVyO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgcHJvdGVjdGVkIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG5cbiAgICBpZiAoX2RlZmF1bHRPcHRpb25zKSB7XG4gICAgICBpZiAoX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBfZGVmYXVsdE9wdGlvbnMucG9zaXRpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChfZGVmYXVsdE9wdGlvbnMudG91Y2hHZXN0dXJlcykge1xuICAgICAgICB0aGlzLnRvdWNoR2VzdHVyZXMgPSBfZGVmYXVsdE9wdGlvbnMudG91Y2hHZXN0dXJlcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZGlyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24odGhpcy5fb3ZlcmxheVJlZik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gVGhpcyBuZWVkcyB0byBoYXBwZW4gYWZ0ZXIgdmlldyBpbml0IHNvIHRoZSBpbml0aWFsIHZhbHVlcyBmb3IgYWxsIGlucHV0cyBoYXZlIGJlZW4gc2V0LlxuICAgIHRoaXMuX3ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fc2V0dXBQb2ludGVyRW50ZXJFdmVudHNJZk5lZWRlZCgpO1xuXG4gICAgdGhpcy5fZm9jdXNNb25pdG9yXG4gICAgICAubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgbW9uaXRvciBydW5zIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3JpZ2luID09PSAna2V5Ym9hcmQnKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLnNob3coKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIHRvb2x0aXAgd2hlbiBkZXN0cm95ZWQuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcblxuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gdXAgdGhlIGV2ZW50IGxpc3RlbmVycyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5mb3JFYWNoKChbZXZlbnQsIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgbmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5sZW5ndGggPSAwO1xuXG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24obmF0aXZlRWxlbWVudCwgdGhpcy5tZXNzYWdlLCAndG9vbHRpcCcpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyhuYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktc2hvdyBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyID0gdGhpcy5zaG93RGVsYXkpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICAhdGhpcy5tZXNzYWdlIHx8XG4gICAgICAodGhpcy5faXNUb29sdGlwVmlzaWJsZSgpICYmXG4gICAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9zaG93VGltZW91dElkICYmXG4gICAgICAgICF0aGlzLl90b29sdGlwSW5zdGFuY2UhLl9oaWRlVGltZW91dElkKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KCk7XG4gICAgdGhpcy5fZGV0YWNoKCk7XG4gICAgdGhpcy5fcG9ydGFsID1cbiAgICAgIHRoaXMuX3BvcnRhbCB8fCBuZXcgQ29tcG9uZW50UG9ydGFsKHRoaXMuX3Rvb2x0aXBDb21wb25lbnQsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCkuaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLl90cmlnZ2VyRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBpbnN0YW5jZS5fbW91c2VMZWF2ZUhpZGVEZWxheSA9IHRoaXMuX2hpZGVEZWxheTtcbiAgICBpbnN0YW5jZVxuICAgICAgLmFmdGVySGlkZGVuKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXRhY2goKSk7XG4gICAgdGhpcy5fc2V0VG9vbHRpcENsYXNzKHRoaXMuX3Rvb2x0aXBDbGFzcyk7XG4gICAgdGhpcy5fdXBkYXRlVG9vbHRpcE1lc3NhZ2UoKTtcbiAgICBpbnN0YW5jZS5zaG93KGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgdG9vbHRpcCBhZnRlciB0aGUgZGVsYXkgaW4gbXMsIGRlZmF1bHRzIHRvIHRvb2x0aXAtZGVsYXktaGlkZSBvciAwbXMgaWYgbm8gaW5wdXQgKi9cbiAgaGlkZShkZWxheTogbnVtYmVyID0gdGhpcy5oaWRlRGVsYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuaGlkZShkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNob3dzL2hpZGVzIHRoZSB0b29sdGlwICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9pc1Rvb2x0aXBWaXNpYmxlKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgdmlzaWJsZSB0byB0aGUgdXNlciAqL1xuICBfaXNUb29sdGlwVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl90b29sdGlwSW5zdGFuY2UgJiYgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmlzVmlzaWJsZSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgb3ZlcmxheSBjb25maWcgYW5kIHBvc2l0aW9uIHN0cmF0ZWd5ICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoKTogT3ZlcmxheVJlZiB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbGFibGVBbmNlc3RvcnMgPSB0aGlzLl9zY3JvbGxEaXNwYXRjaGVyLmdldEFuY2VzdG9yU2Nyb2xsQ29udGFpbmVycyhcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYsXG4gICAgKTtcblxuICAgIC8vIENyZWF0ZSBjb25uZWN0ZWQgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCBsaXN0ZW5zIGZvciBzY3JvbGwgZXZlbnRzIHRvIHJlcG9zaXRpb24uXG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWxlbWVudFJlZilcbiAgICAgIC53aXRoVHJhbnNmb3JtT3JpZ2luT24oYC4ke3RoaXMuX2Nzc0NsYXNzUHJlZml4fS10b29sdGlwYClcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhWaWV3cG9ydE1hcmdpbih0aGlzLl92aWV3cG9ydE1hcmdpbilcbiAgICAgIC53aXRoU2Nyb2xsYWJsZUNvbnRhaW5lcnMoc2Nyb2xsYWJsZUFuY2VzdG9ycyk7XG5cbiAgICBzdHJhdGVneS5wb3NpdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGVDdXJyZW50UG9zaXRpb25DbGFzcyhjaGFuZ2UuY29ubmVjdGlvblBhaXIpO1xuXG4gICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgIGlmIChjaGFuZ2Uuc2Nyb2xsYWJsZVZpZXdQcm9wZXJ0aWVzLmlzT3ZlcmxheUNsaXBwZWQgJiYgdGhpcy5fdG9vbHRpcEluc3RhbmNlLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgLy8gQWZ0ZXIgcG9zaXRpb24gY2hhbmdlcyBvY2N1ciBhbmQgdGhlIG92ZXJsYXkgaXMgY2xpcHBlZCBieVxuICAgICAgICAgIC8vIGEgcGFyZW50IHNjcm9sbGFibGUgdGhlbiBjbG9zZSB0aGUgdG9vbHRpcC5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuaGlkZSgwKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZSh7XG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHN0cmF0ZWd5LFxuICAgICAgcGFuZWxDbGFzczogYCR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LSR7UEFORUxfQ0xBU1N9YCxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24odGhpcy5fb3ZlcmxheVJlZik7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAuZGV0YWNobWVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2RldGFjaCgpKTtcblxuICAgIHRoaXMuX292ZXJsYXlSZWZcbiAgICAgIC5vdXRzaWRlUG9pbnRlckV2ZW50cygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fdG9vbHRpcEluc3RhbmNlPy5faGFuZGxlQm9keUludGVyYWN0aW9uKCkpO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgLmtleWRvd25FdmVudHMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVG9vbHRpcFZpc2libGUoKSAmJiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmhpZGUoMCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kZWZhdWx0T3B0aW9ucz8uZGlzYWJsZVRvb2x0aXBJbnRlcmFjdGl2aXR5KSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoYCR7dGhpcy5fY3NzQ2xhc3NQcmVmaXh9LXRvb2x0aXAtcGFuZWwtbm9uLWludGVyYWN0aXZlYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKiogRGV0YWNoZXMgdGhlIGN1cnJlbnRseS1hdHRhY2hlZCB0b29sdGlwLiAqL1xuICBwcml2YXRlIF9kZXRhY2goKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgdG9vbHRpcC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlUG9zaXRpb24ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcbiAgICBjb25zdCBvcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW4oKTtcbiAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCk7XG5cbiAgICBwb3NpdGlvbi53aXRoUG9zaXRpb25zKFtcbiAgICAgIHRoaXMuX2FkZE9mZnNldCh7Li4ub3JpZ2luLm1haW4sIC4uLm92ZXJsYXkubWFpbn0pLFxuICAgICAgdGhpcy5fYWRkT2Zmc2V0KHsuLi5vcmlnaW4uZmFsbGJhY2ssIC4uLm92ZXJsYXkuZmFsbGJhY2t9KSxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBBZGRzIHRoZSBjb25maWd1cmVkIG9mZnNldCB0byBhIHBvc2l0aW9uLiBVc2VkIGFzIGEgaG9vayBmb3IgY2hpbGQgY2xhc3Nlcy4gKi9cbiAgcHJvdGVjdGVkIF9hZGRPZmZzZXQocG9zaXRpb246IENvbm5lY3RlZFBvc2l0aW9uKTogQ29ubmVjdGVkUG9zaXRpb24ge1xuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcmlnaW4gcG9zaXRpb24gYW5kIGEgZmFsbGJhY2sgcG9zaXRpb24gYmFzZWQgb24gdGhlIHVzZXIncyBwb3NpdGlvbiBwcmVmZXJlbmNlLlxuICAgKiBUaGUgZmFsbGJhY2sgcG9zaXRpb24gaXMgdGhlIGludmVyc2Ugb2YgdGhlIG9yaWdpbiAoZS5nLiBgJ2JlbG93JyAtPiAnYWJvdmUnYCkuXG4gICAqL1xuICBfZ2V0T3JpZ2luKCk6IHttYWluOiBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb247IGZhbGxiYWNrOiBPcmlnaW5Db25uZWN0aW9uUG9zaXRpb259IHtcbiAgICBjb25zdCBpc0x0ciA9ICF0aGlzLl9kaXIgfHwgdGhpcy5fZGlyLnZhbHVlID09ICdsdHInO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICBsZXQgb3JpZ2luUG9zaXRpb246IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbjtcblxuICAgIGlmIChwb3NpdGlvbiA9PSAnYWJvdmUnIHx8IHBvc2l0aW9uID09ICdiZWxvdycpIHtcbiAgICAgIG9yaWdpblBvc2l0aW9uID0ge29yaWdpblg6ICdjZW50ZXInLCBvcmlnaW5ZOiBwb3NpdGlvbiA9PSAnYWJvdmUnID8gJ3RvcCcgOiAnYm90dG9tJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdiZWZvcmUnIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ2xlZnQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdyaWdodCcgJiYgIWlzTHRyKVxuICAgICkge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ2NlbnRlcid9O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBwb3NpdGlvbiA9PSAnYWZ0ZXInIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ3JpZ2h0JyAmJiBpc0x0cikgfHxcbiAgICAgIChwb3NpdGlvbiA9PSAnbGVmdCcgJiYgIWlzTHRyKVxuICAgICkge1xuICAgICAgb3JpZ2luUG9zaXRpb24gPSB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICdjZW50ZXInfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgdGhyb3cgZ2V0TWF0VG9vbHRpcEludmFsaWRQb3NpdGlvbkVycm9yKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB7eCwgeX0gPSB0aGlzLl9pbnZlcnRQb3NpdGlvbihvcmlnaW5Qb3NpdGlvbiEub3JpZ2luWCwgb3JpZ2luUG9zaXRpb24hLm9yaWdpblkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1haW46IG9yaWdpblBvc2l0aW9uISxcbiAgICAgIGZhbGxiYWNrOiB7b3JpZ2luWDogeCwgb3JpZ2luWTogeX0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBvdmVybGF5IHBvc2l0aW9uIGFuZCBhIGZhbGxiYWNrIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSB1c2VyJ3MgcHJlZmVyZW5jZSAqL1xuICBfZ2V0T3ZlcmxheVBvc2l0aW9uKCk6IHttYWluOiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uOyBmYWxsYmFjazogT3ZlcmxheUNvbm5lY3Rpb25Qb3NpdGlvbn0ge1xuICAgIGNvbnN0IGlzTHRyID0gIXRoaXMuX2RpciB8fCB0aGlzLl9kaXIudmFsdWUgPT0gJ2x0cic7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIGxldCBvdmVybGF5UG9zaXRpb246IE92ZXJsYXlDb25uZWN0aW9uUG9zaXRpb247XG5cbiAgICBpZiAocG9zaXRpb24gPT0gJ2Fib3ZlJykge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnY2VudGVyJywgb3ZlcmxheVk6ICdib3R0b20nfTtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID09ICdiZWxvdycpIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ2NlbnRlcicsIG92ZXJsYXlZOiAndG9wJ307XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBvc2l0aW9uID09ICdiZWZvcmUnIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ2xlZnQnICYmIGlzTHRyKSB8fFxuICAgICAgKHBvc2l0aW9uID09ICdyaWdodCcgJiYgIWlzTHRyKVxuICAgICkge1xuICAgICAgb3ZlcmxheVBvc2l0aW9uID0ge292ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICdjZW50ZXInfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcG9zaXRpb24gPT0gJ2FmdGVyJyB8fFxuICAgICAgKHBvc2l0aW9uID09ICdyaWdodCcgJiYgaXNMdHIpIHx8XG4gICAgICAocG9zaXRpb24gPT0gJ2xlZnQnICYmICFpc0x0cilcbiAgICApIHtcbiAgICAgIG92ZXJsYXlQb3NpdGlvbiA9IHtvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICdjZW50ZXInfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgdGhyb3cgZ2V0TWF0VG9vbHRpcEludmFsaWRQb3NpdGlvbkVycm9yKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB7eCwgeX0gPSB0aGlzLl9pbnZlcnRQb3NpdGlvbihvdmVybGF5UG9zaXRpb24hLm92ZXJsYXlYLCBvdmVybGF5UG9zaXRpb24hLm92ZXJsYXlZKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtYWluOiBvdmVybGF5UG9zaXRpb24hLFxuICAgICAgZmFsbGJhY2s6IHtvdmVybGF5WDogeCwgb3ZlcmxheVk6IHl9LFxuICAgIH07XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgdG9vbHRpcCBtZXNzYWdlIGFuZCByZXBvc2l0aW9ucyB0aGUgb3ZlcmxheSBhY2NvcmRpbmcgdG8gdGhlIG5ldyBtZXNzYWdlIGxlbmd0aCAqL1xuICBwcml2YXRlIF91cGRhdGVUb29sdGlwTWVzc2FnZSgpIHtcbiAgICAvLyBNdXN0IHdhaXQgZm9yIHRoZSBtZXNzYWdlIHRvIGJlIHBhaW50ZWQgdG8gdGhlIHRvb2x0aXAgc28gdGhhdCB0aGUgb3ZlcmxheSBjYW4gcHJvcGVybHlcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGNvcnJlY3QgcG9zaXRpb25pbmcgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHRleHQuXG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG4gICAgICB0aGlzLl90b29sdGlwSW5zdGFuY2UuX21hcmtGb3JDaGVjaygpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5waXBlKHRha2UoMSksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdG9vbHRpcEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHRvb2x0aXAgY2xhc3MgKi9cbiAgcHJpdmF0ZSBfc2V0VG9vbHRpcENsYXNzKHRvb2x0aXBDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXBJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fdG9vbHRpcEluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcztcbiAgICAgIHRoaXMuX3Rvb2x0aXBJbnN0YW5jZS5fbWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEludmVydHMgYW4gb3ZlcmxheSBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaW52ZXJ0UG9zaXRpb24oeDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsIHk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcykge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnIHx8IHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIGlmICh5ID09PSAndG9wJykge1xuICAgICAgICB5ID0gJ2JvdHRvbSc7XG4gICAgICB9IGVsc2UgaWYgKHkgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSAndG9wJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHggPT09ICdlbmQnKSB7XG4gICAgICAgIHggPSAnc3RhcnQnO1xuICAgICAgfSBlbHNlIGlmICh4ID09PSAnc3RhcnQnKSB7XG4gICAgICAgIHggPSAnZW5kJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGNsYXNzIG9uIHRoZSBvdmVybGF5IHBhbmVsIGJhc2VkIG9uIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwLiAqL1xuICBwcml2YXRlIF91cGRhdGVDdXJyZW50UG9zaXRpb25DbGFzcyhjb25uZWN0aW9uUGFpcjogQ29ubmVjdGlvblBvc2l0aW9uUGFpcik6IHZvaWQge1xuICAgIGNvbnN0IHtvdmVybGF5WSwgb3JpZ2luWCwgb3JpZ2luWX0gPSBjb25uZWN0aW9uUGFpcjtcbiAgICBsZXQgbmV3UG9zaXRpb246IFRvb2x0aXBQb3NpdGlvbjtcblxuICAgIC8vIElmIHRoZSBvdmVybGF5IGlzIGluIHRoZSBtaWRkbGUgYWxvbmcgdGhlIFkgYXhpcyxcbiAgICAvLyBpdCBtZWFucyB0aGF0IGl0J3MgZWl0aGVyIGJlZm9yZSBvciBhZnRlci5cbiAgICBpZiAob3ZlcmxheVkgPT09ICdjZW50ZXInKSB7XG4gICAgICAvLyBOb3RlIHRoYXQgc2luY2UgdGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIGZvciBzdHlsaW5nLCB3ZSB3YW50IHRvXG4gICAgICAvLyByZXNvbHZlIGBzdGFydGAgYW5kIGBlbmRgIHRvIHRoZWlyIHJlYWwgdmFsdWVzLCBvdGhlcndpc2UgY29uc3VtZXJzXG4gICAgICAvLyB3b3VsZCBoYXZlIHRvIHJlbWVtYmVyIHRvIGRvIGl0IHRoZW1zZWx2ZXMgb24gZWFjaCBjb25zdW1wdGlvbi5cbiAgICAgIGlmICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykge1xuICAgICAgICBuZXdQb3NpdGlvbiA9IG9yaWdpblggPT09ICdlbmQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uID0gb3JpZ2luWCA9PT0gJ3N0YXJ0JyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1Bvc2l0aW9uID0gb3ZlcmxheVkgPT09ICdib3R0b20nICYmIG9yaWdpblkgPT09ICd0b3AnID8gJ2Fib3ZlJyA6ICdiZWxvdyc7XG4gICAgfVxuXG4gICAgaWYgKG5ld1Bvc2l0aW9uICE9PSB0aGlzLl9jdXJyZW50UG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuXG4gICAgICBpZiAob3ZlcmxheVJlZikge1xuICAgICAgICBjb25zdCBjbGFzc1ByZWZpeCA9IGAke3RoaXMuX2Nzc0NsYXNzUHJlZml4fS0ke1BBTkVMX0NMQVNTfS1gO1xuICAgICAgICBvdmVybGF5UmVmLnJlbW92ZVBhbmVsQ2xhc3MoY2xhc3NQcmVmaXggKyB0aGlzLl9jdXJyZW50UG9zaXRpb24pO1xuICAgICAgICBvdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoY2xhc3NQcmVmaXggKyBuZXdQb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRQb3NpdGlvbiA9IG5ld1Bvc2l0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBCaW5kcyB0aGUgcG9pbnRlciBldmVudHMgdG8gdGhlIHRvb2x0aXAgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBQb2ludGVyRW50ZXJFdmVudHNJZk5lZWRlZCgpIHtcbiAgICAvLyBPcHRpbWl6YXRpb246IERlZmVyIGhvb2tpbmcgdXAgZXZlbnRzIGlmIHRoZXJlJ3Mgbm8gbWVzc2FnZSBvciB0aGUgdG9vbHRpcCBpcyBkaXNhYmxlZC5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9kaXNhYmxlZCB8fFxuICAgICAgIXRoaXMubWVzc2FnZSB8fFxuICAgICAgIXRoaXMuX3ZpZXdJbml0aWFsaXplZCB8fFxuICAgICAgdGhpcy5fcGFzc2l2ZUxpc3RlbmVycy5sZW5ndGhcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgbW91c2UgZXZlbnRzIHNob3VsZG4ndCBiZSBib3VuZCBvbiBtb2JpbGUgZGV2aWNlcywgYmVjYXVzZSB0aGV5IGNhbiBwcmV2ZW50IHRoZVxuICAgIC8vIGZpcnN0IHRhcCBmcm9tIGZpcmluZyBpdHMgY2xpY2sgZXZlbnQgb3IgY2FuIGNhdXNlIHRoZSB0b29sdGlwIHRvIG9wZW4gZm9yIGNsaWNrcy5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm1TdXBwb3J0c01vdXNlRXZlbnRzKCkpIHtcbiAgICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMucHVzaChbXG4gICAgICAgICdtb3VzZWVudGVyJyxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NldHVwUG9pbnRlckV4aXRFdmVudHNJZk5lZWRlZCgpO1xuICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRvdWNoR2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpO1xuXG4gICAgICB0aGlzLl9wYXNzaXZlTGlzdGVuZXJzLnB1c2goW1xuICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgaXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBkb24ndCBgcHJldmVudERlZmF1bHRgIGhlcmUsXG4gICAgICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gcHJldmVudCBjbGljayBldmVudHMgZnJvbSBmaXJpbmcgb24gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgdGhpcy5fc2V0dXBQb2ludGVyRXhpdEV2ZW50c0lmTmVlZGVkKCk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcbiAgICAgICAgICB0aGlzLl90b3VjaHN0YXJ0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zaG93KCksIExPTkdQUkVTU19ERUxBWSk7XG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRMaXN0ZW5lcnModGhpcy5fcGFzc2l2ZUxpc3RlbmVycyk7XG4gIH1cblxuICBwcml2YXRlIF9zZXR1cFBvaW50ZXJFeGl0RXZlbnRzSWZOZWVkZWQoKSB7XG4gICAgaWYgKHRoaXMuX3BvaW50ZXJFeGl0RXZlbnRzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fcG9pbnRlckV4aXRFdmVudHNJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBjb25zdCBleGl0TGlzdGVuZXJzOiAocmVhZG9ubHkgW3N0cmluZywgRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdF0pW10gPSBbXTtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm1TdXBwb3J0c01vdXNlRXZlbnRzKCkpIHtcbiAgICAgIGV4aXRMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgW1xuICAgICAgICAgICdtb3VzZWxlYXZlJyxcbiAgICAgICAgICBldmVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSAoZXZlbnQgYXMgTW91c2VFdmVudCkucmVsYXRlZFRhcmdldCBhcyBOb2RlIHwgbnVsbDtcbiAgICAgICAgICAgIGlmICghbmV3VGFyZ2V0IHx8ICF0aGlzLl9vdmVybGF5UmVmPy5vdmVybGF5RWxlbWVudC5jb250YWlucyhuZXdUYXJnZXQpKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFsnd2hlZWwnLCBldmVudCA9PiB0aGlzLl93aGVlbExpc3RlbmVyKGV2ZW50IGFzIFdoZWVsRXZlbnQpXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRvdWNoR2VzdHVyZXMgIT09ICdvZmYnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpO1xuICAgICAgY29uc3QgdG91Y2hlbmRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RvdWNoc3RhcnRUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMuX2RlZmF1bHRPcHRpb25zLnRvdWNoZW5kSGlkZURlbGF5KTtcbiAgICAgIH07XG5cbiAgICAgIGV4aXRMaXN0ZW5lcnMucHVzaChbJ3RvdWNoZW5kJywgdG91Y2hlbmRMaXN0ZW5lcl0sIFsndG91Y2hjYW5jZWwnLCB0b3VjaGVuZExpc3RlbmVyXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkTGlzdGVuZXJzKGV4aXRMaXN0ZW5lcnMpO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcnMucHVzaCguLi5leGl0TGlzdGVuZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZExpc3RlbmVycyhsaXN0ZW5lcnM6IChyZWFkb25seSBbc3RyaW5nLCBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0XSlbXSkge1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKChbZXZlbnQsIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBwYXNzaXZlTGlzdGVuZXJPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3BsYXRmb3JtU3VwcG9ydHNNb3VzZUV2ZW50cygpIHtcbiAgICByZXR1cm4gIXRoaXMuX3BsYXRmb3JtLklPUyAmJiAhdGhpcy5fcGxhdGZvcm0uQU5EUk9JRDtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5lciBmb3IgdGhlIGB3aGVlbGAgZXZlbnQgb24gdGhlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3doZWVsTGlzdGVuZXIoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcbiAgICBpZiAodGhpcy5faXNUb29sdGlwVmlzaWJsZSgpKSB7XG4gICAgICBjb25zdCBlbGVtZW50VW5kZXJQb2ludGVyID0gdGhpcy5fZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIE9uIG5vbi10b3VjaCBkZXZpY2VzIHdlIGRlcGVuZCBvbiB0aGUgYG1vdXNlbGVhdmVgIGV2ZW50IHRvIGNsb3NlIHRoZSB0b29sdGlwLCBidXQgaXRcbiAgICAgIC8vIHdvbid0IGZpcmUgaWYgdGhlIHVzZXIgc2Nyb2xscyBhd2F5IHVzaW5nIHRoZSB3aGVlbCB3aXRob3V0IG1vdmluZyB0aGVpciBjdXJzb3IuIFdlXG4gICAgICAvLyB3b3JrIGFyb3VuZCBpdCBieSBmaW5kaW5nIHRoZSBlbGVtZW50IHVuZGVyIHRoZSB1c2VyJ3MgY3Vyc29yIGFuZCBjbG9zaW5nIHRoZSB0b29sdGlwXG4gICAgICAvLyBpZiBpdCdzIG5vdCB0aGUgdHJpZ2dlci5cbiAgICAgIGlmIChlbGVtZW50VW5kZXJQb2ludGVyICE9PSBlbGVtZW50ICYmICFlbGVtZW50LmNvbnRhaW5zKGVsZW1lbnRVbmRlclBvaW50ZXIpKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyB0aGUgbmF0aXZlIGJyb3dzZXIgZ2VzdHVyZXMsIGJhc2VkIG9uIGhvdyB0aGUgdG9vbHRpcCBoYXMgYmVlbiBjb25maWd1cmVkLiAqL1xuICBwcml2YXRlIF9kaXNhYmxlTmF0aXZlR2VzdHVyZXNJZk5lY2Vzc2FyeSgpIHtcbiAgICBjb25zdCBnZXN0dXJlcyA9IHRoaXMudG91Y2hHZXN0dXJlcztcblxuICAgIGlmIChnZXN0dXJlcyAhPT0gJ29mZicpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG5cbiAgICAgIC8vIElmIGdlc3R1cmVzIGFyZSBzZXQgdG8gYGF1dG9gLCB3ZSBkb24ndCBkaXNhYmxlIHRleHQgc2VsZWN0aW9uIG9uIGlucHV0cyBhbmRcbiAgICAgIC8vIHRleHRhcmVhcywgYmVjYXVzZSBpdCBwcmV2ZW50cyB0aGUgdXNlciBmcm9tIHR5cGluZyBpbnRvIHRoZW0gb24gaU9TIFNhZmFyaS5cbiAgICAgIGlmIChnZXN0dXJlcyA9PT0gJ29uJyB8fCAoZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJyAmJiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSkge1xuICAgICAgICBzdHlsZS51c2VyU2VsZWN0ID1cbiAgICAgICAgICAoc3R5bGUgYXMgYW55KS5tc1VzZXJTZWxlY3QgPVxuICAgICAgICAgIHN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgIChzdHlsZSBhcyBhbnkpLk1velVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBoYXZlIGBhdXRvYCBnZXN0dXJlcyBhbmQgdGhlIGVsZW1lbnQgdXNlcyBuYXRpdmUgSFRNTCBkcmFnZ2luZyxcbiAgICAgIC8vIHdlIGRvbid0IHNldCBgLXdlYmtpdC11c2VyLWRyYWdgIGJlY2F1c2UgaXQgcHJldmVudHMgdGhlIG5hdGl2ZSBiZWhhdmlvci5cbiAgICAgIGlmIChnZXN0dXJlcyA9PT0gJ29uJyB8fCAhZWxlbWVudC5kcmFnZ2FibGUpIHtcbiAgICAgICAgKHN0eWxlIGFzIGFueSkud2Via2l0VXNlckRyYWcgPSAnbm9uZSc7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgICAgKHN0eWxlIGFzIGFueSkud2Via2l0VGFwSGlnaGxpZ2h0Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIGEgbWF0ZXJpYWwgZGVzaWduIHRvb2x0aXAgdG8gdGhlIGhvc3QgZWxlbWVudC4gQW5pbWF0ZXMgdGhlIHNob3dpbmcgYW5kXG4gKiBoaWRpbmcgb2YgYSB0b29sdGlwIHByb3ZpZGVkIHBvc2l0aW9uIChkZWZhdWx0cyB0byBiZWxvdyB0aGUgZWxlbWVudCkuXG4gKlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUb29sdGlwXScsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbHRpcCcsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRvb2x0aXAtdHJpZ2dlcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXAgZXh0ZW5kcyBfTWF0VG9vbHRpcEJhc2U8VG9vbHRpcENvbXBvbmVudD4ge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3Rvb2x0aXBDb21wb25lbnQgPSBUb29sdGlwQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBhcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgb3ZlcmxheSxcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHBsYXRmb3JtLFxuICAgICAgYXJpYURlc2NyaWJlcixcbiAgICAgIGZvY3VzTW9uaXRvcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyLFxuICAgICAgZGVmYXVsdE9wdGlvbnMsXG4gICAgICBfZG9jdW1lbnQsXG4gICAgKTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfVG9vbHRpcENvbXBvbmVudEJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogTWVzc2FnZSB0byBkaXNwbGF5IGluIHRoZSB0b29sdGlwICovXG4gIG1lc3NhZ2U6IHN0cmluZztcblxuICAvKiogQ2xhc3NlcyB0byBiZSBhZGRlZCB0byB0aGUgdG9vbHRpcC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgdG9vbHRpcENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBzaG93IHRoZSB0b29sdGlwICovXG4gIF9zaG93VGltZW91dElkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFRoZSB0aW1lb3V0IElEIG9mIGFueSBjdXJyZW50IHRpbWVyIHNldCB0byBoaWRlIHRoZSB0b29sdGlwICovXG4gIF9oaWRlVGltZW91dElkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFByb3BlcnR5IHdhdGNoZWQgYnkgdGhlIGFuaW1hdGlvbiBmcmFtZXdvcmsgdG8gc2hvdyBvciBoaWRlIHRoZSB0b29sdGlwICovXG4gIF92aXNpYmlsaXR5OiBUb29sdGlwVmlzaWJpbGl0eSA9ICdpbml0aWFsJztcblxuICAvKiogRWxlbWVudCB0aGF0IGNhdXNlZCB0aGUgdG9vbHRpcCB0byBvcGVuLiAqL1xuICBfdHJpZ2dlckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHRoZSBjbG9zaW5nIHNlcXVlbmNlLiAqL1xuICBfbW91c2VMZWF2ZUhpZGVEZWxheTogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZC4gKi9cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uc0Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIHRvb2x0aXAgZWxlbWVudC4gKi9cbiAgYWJzdHJhY3QgX3Rvb2x0aXA6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBXaGV0aGVyIGludGVyYWN0aW9ucyBvbiB0aGUgcGFnZSBzaG91bGQgY2xvc2UgdGhlIHRvb2x0aXAgKi9cbiAgcHJpdmF0ZSBfY2xvc2VPbkludGVyYWN0aW9uID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvb2x0aXAgaXMgY3VycmVudGx5IHZpc2libGUuICovXG4gIHByaXZhdGUgX2lzVmlzaWJsZSA9IGZhbHNlO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgdG9vbHRpcCBoYXMgYmVlbiBoaWRkZW4gZnJvbSB0aGUgdmlldyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkhpZGU6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSBzaG93IGFuaW1hdGlvbiBhbmQgdGhlIGNsYXNzIHRoYXQgdG9nZ2xlcyBpdC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IF9zaG93QW5pbWF0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIGhpZGUgYW5pbWF0aW9uIGFuZCB0aGUgY2xhc3MgdGhhdCB0b2dnbGVzIGl0LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgX2hpZGVBbmltYXRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gIH1cblxuICAvKipcbiAgICogU2hvd3MgdGhlIHRvb2x0aXAgd2l0aCBhbiBhbmltYXRpb24gb3JpZ2luYXRpbmcgZnJvbSB0aGUgcHJvdmlkZWQgb3JpZ2luXG4gICAqIEBwYXJhbSBkZWxheSBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgc2hvdyhkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIGhpZGUgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2hpZGVUaW1lb3V0SWQpO1xuXG4gICAgdGhpcy5fc2hvd1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdG9nZ2xlVmlzaWJpbGl0eSh0cnVlKTtcbiAgICAgIHRoaXMuX3Nob3dUaW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZ2lucyB0aGUgYW5pbWF0aW9uIHRvIGhpZGUgdGhlIHRvb2x0aXAgYWZ0ZXIgdGhlIHByb3ZpZGVkIGRlbGF5IGluIG1zLlxuICAgKiBAcGFyYW0gZGVsYXkgQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBzaG93aW5nIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgaGlkZShkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2FuY2VsIHRoZSBkZWxheWVkIHNob3cgaWYgaXQgaXMgc2NoZWR1bGVkXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Nob3dUaW1lb3V0SWQpO1xuXG4gICAgdGhpcy5faGlkZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fdG9nZ2xlVmlzaWJpbGl0eShmYWxzZSk7XG4gICAgICB0aGlzLl9oaWRlVGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBub3RpZmllcyB3aGVuIHRoZSB0b29sdGlwIGhhcyBiZWVuIGhpZGRlbiBmcm9tIHZpZXcuICovXG4gIGFmdGVySGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkhpZGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBiZWluZyBkaXNwbGF5ZWQuICovXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNWaXNpYmxlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Nob3dUaW1lb3V0SWQpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dElkKTtcbiAgICB0aGlzLl9vbkhpZGUuY29tcGxldGUoKTtcbiAgICB0aGlzLl90cmlnZ2VyRWxlbWVudCA9IG51bGwhO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyYWN0aW9ucyBvbiB0aGUgSFRNTCBib2R5IHNob3VsZCBjbG9zZSB0aGUgdG9vbHRpcCBpbW1lZGlhdGVseSBhcyBkZWZpbmVkIGluIHRoZVxuICAgKiBtYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90b29sdGlwcy5odG1sI2JlaGF2aW9yXG4gICAqL1xuICBfaGFuZGxlQm9keUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jbG9zZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgIHRoaXMuaGlkZSgwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhhdCB0aGUgdG9vbHRpcCBuZWVkcyB0byBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLlxuICAgKiBNYWlubHkgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBpbml0aWFsIHRleHQgYmVmb3JlIHBvc2l0aW9uaW5nIGEgdG9vbHRpcCwgd2hpY2hcbiAgICogY2FuIGJlIHByb2JsZW1hdGljIGluIGNvbXBvbmVudHMgd2l0aCBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFuZGxlTW91c2VMZWF2ZSh7cmVsYXRlZFRhcmdldH06IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXJlbGF0ZWRUYXJnZXQgfHwgIXRoaXMuX3RyaWdnZXJFbGVtZW50LmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb3VzZUxlYXZlSGlkZURlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHdoZW4gdGhlIHRpbWVvdXQgaW4gdGhpcy5zaG93KCkgZ2V0cyBjb21wbGV0ZWQuXG4gICAqIFRoaXMgbWV0aG9kIGlzIG9ubHkgbmVlZGVkIGJ5IHRoZSBtZGMtdG9vbHRpcCwgYW5kIHNvIGl0IGlzIG9ubHkgaW1wbGVtZW50ZWRcbiAgICogaW4gdGhlIG1kYy10b29sdGlwLCBub3QgaGVyZS5cbiAgICovXG4gIHByb3RlY3RlZCBfb25TaG93KCk6IHZvaWQge31cblxuICAvKiogRXZlbnQgbGlzdGVuZXIgZGlzcGF0Y2hlZCB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgdG9vbHRpcCBmaW5pc2hlcy4gKi9cbiAgX2hhbmRsZUFuaW1hdGlvbkVuZCh7YW5pbWF0aW9uTmFtZX06IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGFuaW1hdGlvbk5hbWUgPT09IHRoaXMuX3Nob3dBbmltYXRpb24gfHwgYW5pbWF0aW9uTmFtZSA9PT0gdGhpcy5faGlkZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oYW5pbWF0aW9uTmFtZSA9PT0gdGhpcy5fc2hvd0FuaW1hdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIGNsZWFudXAgYWZ0ZXIgYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgcHJpdmF0ZSBfZmluYWxpemVBbmltYXRpb24odG9WaXNpYmxlOiBib29sZWFuKSB7XG4gICAgaWYgKHRvVmlzaWJsZSkge1xuICAgICAgdGhpcy5fY2xvc2VPbkludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLl9vbkhpZGUubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB0b29sdGlwIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3RvZ2dsZVZpc2liaWxpdHkoaXNWaXNpYmxlOiBib29sZWFuKSB7XG4gICAgLy8gV2Ugc2V0IHRoZSBjbGFzc2VzIGRpcmVjdGx5IGhlcmUgb3Vyc2VsdmVzIHNvIHRoYXQgdG9nZ2xpbmcgdGhlIHRvb2x0aXAgc3RhdGVcbiAgICAvLyBpc24ndCBib3VuZCBieSBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGlzIGFsbG93cyB1cyB0byBoaWRlIGl0IGV2ZW4gaWYgdGhlXG4gICAgLy8gdmlldyByZWYgaGFzIGJlZW4gZGV0YWNoZWQgZnJvbSB0aGUgQ0QgdHJlZS5cbiAgICBjb25zdCB0b29sdGlwID0gdGhpcy5fdG9vbHRpcC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHNob3dDbGFzcyA9IHRoaXMuX3Nob3dBbmltYXRpb247XG4gICAgY29uc3QgaGlkZUNsYXNzID0gdGhpcy5faGlkZUFuaW1hdGlvbjtcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoaXNWaXNpYmxlID8gaGlkZUNsYXNzIDogc2hvd0NsYXNzKTtcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoaXNWaXNpYmxlID8gc2hvd0NsYXNzIDogaGlkZUNsYXNzKTtcbiAgICB0aGlzLl9pc1Zpc2libGUgPSBpc1Zpc2libGU7XG5cbiAgICAvLyBJdCdzIGNvbW1vbiBmb3IgaW50ZXJuYWwgYXBwcyB0byBkaXNhYmxlIGFuaW1hdGlvbnMgdXNpbmcgYCogeyBhbmltYXRpb246IG5vbmUgIWltcG9ydGFudCB9YFxuICAgIC8vIHdoaWNoIGNhbiBicmVhayB0aGUgb3BlbmluZyBzZXF1ZW5jZS4gVHJ5IHRvIGRldGVjdCBzdWNoIGNhc2VzIGFuZCB3b3JrIGFyb3VuZCB0aGVtLlxuICAgIGlmIChpc1Zpc2libGUgJiYgIXRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCAmJiB0eXBlb2YgZ2V0Q29tcHV0ZWRTdHlsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3Qgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZSh0b29sdGlwKTtcblxuICAgICAgLy8gVXNlIGBnZXRQcm9wZXJ0eVZhbHVlYCB0byBhdm9pZCBpc3N1ZXMgd2l0aCBwcm9wZXJ0eSByZW5hbWluZy5cbiAgICAgIGlmIChcbiAgICAgICAgc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1kdXJhdGlvbicpID09PSAnMHMnIHx8XG4gICAgICAgIHN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCdhbmltYXRpb24tbmFtZScpID09PSAnbm9uZSdcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgIHRoaXMuX29uU2hvdygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25zRGlzYWJsZWQpIHtcbiAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICAgIHRoaXMuX2ZpbmFsaXplQW5pbWF0aW9uKGlzVmlzaWJsZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdGhlIHRvb2x0aXAncyBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdG9vbHRpcC1jb21wb25lbnQnLFxuICB0ZW1wbGF0ZVVybDogJ3Rvb2x0aXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0b29sdGlwLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgIC8vIEZvcmNlcyB0aGUgZWxlbWVudCB0byBoYXZlIGEgbGF5b3V0IGluIElFIGFuZCBFZGdlLiBUaGlzIGZpeGVzIGlzc3VlcyB3aGVyZSB0aGUgZWxlbWVudFxuICAgIC8vIHdvbid0IGJlIHJlbmRlcmVkIGlmIHRoZSBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCBvciB0aGVyZSBpcyBubyB3ZWIgYW5pbWF0aW9ucyBwb2x5ZmlsbC5cbiAgICAnW3N0eWxlLnpvb21dJzogJ2lzVmlzaWJsZSgpID8gMSA6IG51bGwnLFxuICAgICcobW91c2VsZWF2ZSknOiAnX2hhbmRsZU1vdXNlTGVhdmUoJGV2ZW50KScsXG4gICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IGV4dGVuZHMgX1Rvb2x0aXBDb21wb25lbnRCYXNlIHtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIGEgaGFuZHNldC1zaXplZCBkaXNwbGF5LiAgKi9cbiAgX2lzSGFuZHNldDogT2JzZXJ2YWJsZTxCcmVha3BvaW50U3RhdGU+ID0gdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldCk7XG4gIF9zaG93QW5pbWF0aW9uID0gJ21hdC10b29sdGlwLXNob3cnO1xuICBfaGlkZUFuaW1hdGlvbiA9ICdtYXQtdG9vbHRpcC1oaWRlJztcblxuICBAVmlld0NoaWxkKCd0b29sdGlwJywge1xuICAgIC8vIFVzZSBhIHN0YXRpYyBxdWVyeSBoZXJlIHNpbmNlIHdlIGludGVyYWN0IGRpcmVjdGx5IHdpdGhcbiAgICAvLyB0aGUgRE9NIHdoaWNoIGNhbiBoYXBwZW4gYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLlxuICAgIHN0YXRpYzogdHJ1ZSxcbiAgfSlcbiAgX3Rvb2x0aXA6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoY2hhbmdlRGV0ZWN0b3JSZWYsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG59XG4iLCI8ZGl2ICN0b29sdGlwXG4gICAgIGNsYXNzPVwibWF0LXRvb2x0aXBcIlxuICAgICAoYW5pbWF0aW9uZW5kKT1cIl9oYW5kbGVBbmltYXRpb25FbmQoJGV2ZW50KVwiXG4gICAgIFtuZ0NsYXNzXT1cInRvb2x0aXBDbGFzc1wiXG4gICAgIFtjbGFzcy5tYXQtdG9vbHRpcC1oYW5kc2V0XT1cIihfaXNIYW5kc2V0IHwgYXN5bmMpPy5tYXRjaGVzXCI+e3ttZXNzYWdlfX08L2Rpdj5cbiJdfQ==