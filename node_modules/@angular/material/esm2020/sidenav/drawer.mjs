import { FocusMonitor, FocusTrapFactory, InteractivityChecker, } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, startWith, take, takeUntil, distinctUntilChanged, mapTo, } from 'rxjs/operators';
import { matDrawerAnimations } from './drawer-animations';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/bidi";
import * as i5 from "@angular/common";
/**
 * Throws an exception when two MatDrawer are matching the same position.
 * @docs-private
 */
export function throwMatDuplicatedDrawerError(position) {
    throw Error(`A drawer was already declared for 'position="${position}"'`);
}
/** Configures whether drawers should use auto sizing by default. */
export const MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken('MAT_DRAWER_DEFAULT_AUTOSIZE', {
    providedIn: 'root',
    factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY,
});
/**
 * Used to provide a drawer container to a drawer while avoiding circular references.
 * @docs-private
 */
export const MAT_DRAWER_CONTAINER = new InjectionToken('MAT_DRAWER_CONTAINER');
/** @docs-private */
export function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
    return false;
}
export class MatDrawerContent extends CdkScrollable {
    constructor(_changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone) {
        super(elementRef, scrollDispatcher, ngZone);
        this._changeDetectorRef = _changeDetectorRef;
        this._container = _container;
    }
    ngAfterContentInit() {
        this._container._contentMarginChanges.subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
    }
}
MatDrawerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawerContent, deps: [{ token: i0.ChangeDetectorRef }, { token: forwardRef(() => MatDrawerContainer) }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatDrawerContent, selector: "mat-drawer-content", host: { properties: { "style.margin-left.px": "_container._contentMargins.left", "style.margin-right.px": "_container._contentMargins.right" }, classAttribute: "mat-drawer-content" }, providers: [
        {
            provide: CdkScrollable,
            useExisting: MatDrawerContent,
        },
    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawerContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-drawer-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content',
                        '[style.margin-left.px]': '_container._contentMargins.left',
                        '[style.margin-right.px]': '_container._contentMargins.right',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        {
                            provide: CdkScrollable,
                            useExisting: MatDrawerContent,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: MatDrawerContainer, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatDrawerContainer)]
                }] }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.NgZone }]; } });
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
export class MatDrawer {
    constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _interactivityChecker, _doc, _container) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._interactivityChecker = _interactivityChecker;
        this._doc = _doc;
        this._container = _container;
        this._elementFocusedBeforeDrawerWasOpened = null;
        /** Whether the drawer is initialized. Used for disabling the initial animation. */
        this._enableAnimations = false;
        this._position = 'start';
        this._mode = 'over';
        this._disableClose = false;
        this._opened = false;
        /** Emits whenever the drawer has started animating. */
        this._animationStarted = new Subject();
        /** Emits whenever the drawer is done animating. */
        this._animationEnd = new Subject();
        /** Current state of the sidenav animation. */
        this._animationState = 'void';
        /** Event emitted when the drawer open state is changed. */
        this.openedChange = 
        // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
        new EventEmitter(/* isAsync */ true);
        /** Event emitted when the drawer has been opened. */
        this._openedStream = this.openedChange.pipe(filter(o => o), map(() => { }));
        /** Event emitted when the drawer has started opening. */
        this.openedStart = this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0), mapTo(undefined));
        /** Event emitted when the drawer has been closed. */
        this._closedStream = this.openedChange.pipe(filter(o => !o), map(() => { }));
        /** Event emitted when the drawer has started closing. */
        this.closedStart = this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState === 'void'), mapTo(undefined));
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Event emitted when the drawer's position changes. */
        // tslint:disable-next-line:no-output-on-prefix
        this.onPositionChanged = new EventEmitter();
        /**
         * An observable that emits when the drawer mode changes. This is used by the drawer container to
         * to know when to when the mode changes so it can adapt the margins on the content.
         */
        this._modeChanged = new Subject();
        this.openedChange.subscribe((opened) => {
            if (opened) {
                if (this._doc) {
                    this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement;
                }
                this._takeFocus();
            }
            else if (this._isFocusWithinDrawer()) {
                this._restoreFocus(this._openedVia || 'program');
            }
        });
        /**
         * Listen to `keydown` events outside the zone so that change detection is not run every
         * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
         * and we don't have close disabled.
         */
        this._ngZone.runOutsideAngular(() => {
            fromEvent(this._elementRef.nativeElement, 'keydown')
                .pipe(filter(event => {
                return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
            }), takeUntil(this._destroyed))
                .subscribe(event => this._ngZone.run(() => {
                this.close();
                event.stopPropagation();
                event.preventDefault();
            }));
        });
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._animationEnd
            .pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))
            .subscribe((event) => {
            const { fromState, toState } = event;
            if ((toState.indexOf('open') === 0 && fromState === 'void') ||
                (toState === 'void' && fromState.indexOf('open') === 0)) {
                this.openedChange.emit(this._opened);
            }
        });
    }
    /** The side that the drawer is attached to. */
    get position() {
        return this._position;
    }
    set position(value) {
        // Make sure we have a valid value.
        value = value === 'end' ? 'end' : 'start';
        if (value !== this._position) {
            // Static inputs in Ivy are set before the element is in the DOM.
            if (this._isAttached) {
                this._updatePositionInParent(value);
            }
            this._position = value;
            this.onPositionChanged.emit();
        }
    }
    /** Mode of the drawer; one of 'over', 'push' or 'side'. */
    get mode() {
        return this._mode;
    }
    set mode(value) {
        this._mode = value;
        this._updateFocusTrapState();
        this._modeChanged.next();
    }
    /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
    get disableClose() {
        return this._disableClose;
    }
    set disableClose(value) {
        this._disableClose = coerceBooleanProperty(value);
    }
    /**
     * Whether the drawer should focus the first focusable element automatically when opened.
     * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
     * enabled, focus will be moved into the sidenav in `side` mode as well.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or AutoFocusTarget
     * instead.
     */
    get autoFocus() {
        const value = this._autoFocus;
        // Note that usually we don't allow autoFocus to be set to `first-tabbable` in `side` mode,
        // because we don't know how the sidenav is being used, but in some cases it still makes
        // sense to do it. The consumer can explicitly set `autoFocus`.
        if (value == null) {
            if (this.mode === 'side') {
                return 'dialog';
            }
            else {
                return 'first-tabbable';
            }
        }
        return value;
    }
    set autoFocus(value) {
        if (value === 'true' || value === 'false' || value == null) {
            value = coerceBooleanProperty(value);
        }
        this._autoFocus = value;
    }
    /**
     * Whether the drawer is opened. We overload this because we trigger an event when it
     * starts or end.
     */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        this.toggle(coerceBooleanProperty(value));
    }
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
            element.tabIndex = -1;
            // The tabindex attribute should be removed to avoid navigating to that element again
            this._ngZone.runOutsideAngular(() => {
                const callback = () => {
                    element.removeEventListener('blur', callback);
                    element.removeEventListener('mousedown', callback);
                    element.removeAttribute('tabindex');
                };
                element.addEventListener('blur', callback);
                element.addEventListener('mousedown', callback);
            });
        }
        element.focus(options);
    }
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    _focusByCssSelector(selector, options) {
        let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
            this._forceFocus(elementToFocus, options);
        }
    }
    /**
     * Moves focus into the drawer. Note that this works even if
     * the focus trap is disabled in `side` mode.
     */
    _takeFocus() {
        if (!this._focusTrap) {
            return;
        }
        const element = this._elementRef.nativeElement;
        // When autoFocus is not on the sidenav, if the element cannot be focused or does
        // not exist, focus the sidenav itself so the keyboard navigation still works.
        // We need to check that `focus` is a function due to Universal.
        switch (this.autoFocus) {
            case false:
            case 'dialog':
                return;
            case true:
            case 'first-tabbable':
                this._focusTrap.focusInitialElementWhenReady().then(hasMovedFocus => {
                    if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
                        element.focus();
                    }
                });
                break;
            case 'first-heading':
                this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
                break;
            default:
                this._focusByCssSelector(this.autoFocus);
                break;
        }
    }
    /**
     * Restores focus to the element that was originally focused when the drawer opened.
     * If no element was focused at that time, the focus will be restored to the drawer.
     */
    _restoreFocus(focusOrigin) {
        if (this.autoFocus === 'dialog') {
            return;
        }
        if (this._elementFocusedBeforeDrawerWasOpened) {
            this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
        }
        else {
            this._elementRef.nativeElement.blur();
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
    }
    /** Whether focus is currently within the drawer. */
    _isFocusWithinDrawer() {
        const activeEl = this._doc.activeElement;
        return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
    }
    ngAfterViewInit() {
        this._isAttached = true;
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._updateFocusTrapState();
        // Only update the DOM position when the sidenav is positioned at
        // the end since we project the sidenav before the content by default.
        if (this._position === 'end') {
            this._updatePositionInParent('end');
        }
    }
    ngAfterContentChecked() {
        // Enable the animations after the lifecycle hooks have run, in order to avoid animating
        // drawers that are open by default. When we're on the server, we shouldn't enable the
        // animations, because we don't want the drawer to animate the first time the user sees
        // the page.
        if (this._platform.isBrowser) {
            this._enableAnimations = true;
        }
    }
    ngOnDestroy() {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
        this._anchor?.remove();
        this._anchor = null;
        this._animationStarted.complete();
        this._animationEnd.complete();
        this._modeChanged.complete();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Open the drawer.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    open(openedVia) {
        return this.toggle(true, openedVia);
    }
    /** Close the drawer. */
    close() {
        return this.toggle(false);
    }
    /** Closes the drawer with context that the backdrop was clicked. */
    _closeViaBackdropClick() {
        // If the drawer is closed upon a backdrop click, we always want to restore focus. We
        // don't need to check whether focus is currently in the drawer, as clicking on the
        // backdrop causes blurs the active element.
        return this._setOpen(/* isOpen */ false, /* restoreFocus */ true, 'mouse');
    }
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    toggle(isOpen = !this.opened, openedVia) {
        // If the focus is currently inside the drawer content and we are closing the drawer,
        // restore the focus to the initially focused element (when the drawer opened).
        if (isOpen && openedVia) {
            this._openedVia = openedVia;
        }
        const result = this._setOpen(isOpen, 
        /* restoreFocus */ !isOpen && this._isFocusWithinDrawer(), this._openedVia || 'program');
        if (!isOpen) {
            this._openedVia = null;
        }
        return result;
    }
    /**
     * Toggles the opened state of the drawer.
     * @param isOpen Whether the drawer should open or close.
     * @param restoreFocus Whether focus should be restored on close.
     * @param focusOrigin Origin to use when restoring focus.
     */
    _setOpen(isOpen, restoreFocus, focusOrigin) {
        this._opened = isOpen;
        if (isOpen) {
            this._animationState = this._enableAnimations ? 'open' : 'open-instant';
        }
        else {
            this._animationState = 'void';
            if (restoreFocus) {
                this._restoreFocus(focusOrigin);
            }
        }
        this._updateFocusTrapState();
        return new Promise(resolve => {
            this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
        });
    }
    _getWidth() {
        return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
    }
    /** Updates the enabled state of the focus trap. */
    _updateFocusTrapState() {
        if (this._focusTrap) {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            this._focusTrap.enabled = this.opened && this.mode !== 'side';
        }
    }
    /**
     * Updates the position of the drawer in the DOM. We need to move the element around ourselves
     * when it's in the `end` position so that it comes after the content and the visual order
     * matches the tab order. We also need to be able to move it back to `start` if the sidenav
     * started off as `end` and was changed to `start`.
     */
    _updatePositionInParent(newPosition) {
        const element = this._elementRef.nativeElement;
        const parent = element.parentNode;
        if (newPosition === 'end') {
            if (!this._anchor) {
                this._anchor = this._doc.createComment('mat-drawer-anchor');
                parent.insertBefore(this._anchor, element);
            }
            parent.appendChild(element);
        }
        else if (this._anchor) {
            this._anchor.parentNode.insertBefore(element, this._anchor);
        }
    }
}
MatDrawer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawer, deps: [{ token: i0.ElementRef }, { token: i2.FocusTrapFactory }, { token: i2.FocusMonitor }, { token: i3.Platform }, { token: i0.NgZone }, { token: i2.InteractivityChecker }, { token: DOCUMENT, optional: true }, { token: MAT_DRAWER_CONTAINER, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatDrawer, selector: "mat-drawer", inputs: { position: "position", mode: "mode", disableClose: "disableClose", autoFocus: "autoFocus", opened: "opened" }, outputs: { openedChange: "openedChange", _openedStream: "opened", openedStart: "openedStart", _closedStream: "closed", closedStart: "closedStart", onPositionChanged: "positionChanged" }, host: { attributes: { "tabIndex": "-1" }, listeners: { "@transform.start": "_animationStarted.next($event)", "@transform.done": "_animationEnd.next($event)" }, properties: { "attr.align": "null", "class.mat-drawer-end": "position === \"end\"", "class.mat-drawer-over": "mode === \"over\"", "class.mat-drawer-push": "mode === \"push\"", "class.mat-drawer-side": "mode === \"side\"", "class.mat-drawer-opened": "opened", "@transform": "_animationState" }, classAttribute: "mat-drawer" }, viewQueries: [{ propertyName: "_content", first: true, predicate: ["content"], descendants: true }], exportAs: ["matDrawer"], ngImport: i0, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n", directives: [{ type: i1.CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], animations: [matDrawerAnimations.transformDrawer], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer', exportAs: 'matDrawer', animations: [matDrawerAnimations.transformDrawer], host: {
                        'class': 'mat-drawer',
                        // must prevent the browser from aligning text based on value
                        '[attr.align]': 'null',
                        '[class.mat-drawer-end]': 'position === "end"',
                        '[class.mat-drawer-over]': 'mode === "over"',
                        '[class.mat-drawer-push]': 'mode === "push"',
                        '[class.mat-drawer-side]': 'mode === "side"',
                        '[class.mat-drawer-opened]': 'opened',
                        'tabIndex': '-1',
                        '[@transform]': '_animationState',
                        '(@transform.start)': '_animationStarted.next($event)',
                        '(@transform.done)': '_animationEnd.next($event)',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i2.FocusTrapFactory }, { type: i2.FocusMonitor }, { type: i3.Platform }, { type: i0.NgZone }, { type: i2.InteractivityChecker }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: MatDrawerContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DRAWER_CONTAINER]
                }] }]; }, propDecorators: { position: [{
                type: Input
            }], mode: [{
                type: Input
            }], disableClose: [{
                type: Input
            }], autoFocus: [{
                type: Input
            }], opened: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], _openedStream: [{
                type: Output,
                args: ['opened']
            }], openedStart: [{
                type: Output
            }], _closedStream: [{
                type: Output,
                args: ['closed']
            }], closedStart: [{
                type: Output
            }], onPositionChanged: [{
                type: Output,
                args: ['positionChanged']
            }], _content: [{
                type: ViewChild,
                args: ['content']
            }] } });
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export class MatDrawerContainer {
    constructor(_dir, _element, _ngZone, _changeDetectorRef, viewportRuler, defaultAutosize = false, _animationMode) {
        this._dir = _dir;
        this._element = _element;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /** Drawers that belong to this container. */
        this._drawers = new QueryList();
        /** Event emitted when the drawer backdrop is clicked. */
        this.backdropClick = new EventEmitter();
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Emits on every ngDoCheck. Used for debouncing reflows. */
        this._doCheckSubject = new Subject();
        /**
         * Margins to be applied to the content. These are used to push / shrink the drawer content when a
         * drawer is open. We use margin rather than transform even for push mode because transform breaks
         * fixed position elements inside of the transformed element.
         */
        this._contentMargins = { left: null, right: null };
        this._contentMarginChanges = new Subject();
        // If a `Dir` directive exists up the tree, listen direction changes
        // and update the left/right properties to point to the proper start/end.
        if (_dir) {
            _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
                this._validateDrawers();
                this.updateContentMargins();
            });
        }
        // Since the minimum width of the sidenav depends on the viewport width,
        // we need to recompute the margins if the viewport changes.
        viewportRuler
            .change()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this.updateContentMargins());
        this._autosize = defaultAutosize;
    }
    /** The drawer child with the `start` position. */
    get start() {
        return this._start;
    }
    /** The drawer child with the `end` position. */
    get end() {
        return this._end;
    }
    /**
     * Whether to automatically resize the container whenever
     * the size of any of its drawers changes.
     *
     * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
     * the drawers on every change detection cycle. Can be configured globally via the
     * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
     */
    get autosize() {
        return this._autosize;
    }
    set autosize(value) {
        this._autosize = coerceBooleanProperty(value);
    }
    /**
     * Whether the drawer container should have a backdrop while one of the sidenavs is open.
     * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
     * mode as well.
     */
    get hasBackdrop() {
        if (this._backdropOverride == null) {
            return !this._start || this._start.mode !== 'side' || !this._end || this._end.mode !== 'side';
        }
        return this._backdropOverride;
    }
    set hasBackdrop(value) {
        this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
    }
    /** Reference to the CdkScrollable instance that wraps the scrollable content. */
    get scrollable() {
        return this._userContent || this._content;
    }
    ngAfterContentInit() {
        this._allDrawers.changes
            .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
            .subscribe((drawer) => {
            this._drawers.reset(drawer.filter(item => !item._container || item._container === this));
            this._drawers.notifyOnChanges();
        });
        this._drawers.changes.pipe(startWith(null)).subscribe(() => {
            this._validateDrawers();
            this._drawers.forEach((drawer) => {
                this._watchDrawerToggle(drawer);
                this._watchDrawerPosition(drawer);
                this._watchDrawerMode(drawer);
            });
            if (!this._drawers.length ||
                this._isDrawerOpen(this._start) ||
                this._isDrawerOpen(this._end)) {
                this.updateContentMargins();
            }
            this._changeDetectorRef.markForCheck();
        });
        // Avoid hitting the NgZone through the debounce timeout.
        this._ngZone.runOutsideAngular(() => {
            this._doCheckSubject
                .pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
            takeUntil(this._destroyed))
                .subscribe(() => this.updateContentMargins());
        });
    }
    ngOnDestroy() {
        this._contentMarginChanges.complete();
        this._doCheckSubject.complete();
        this._drawers.destroy();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** Calls `open` of both start and end drawers */
    open() {
        this._drawers.forEach(drawer => drawer.open());
    }
    /** Calls `close` of both start and end drawers */
    close() {
        this._drawers.forEach(drawer => drawer.close());
    }
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     */
    updateContentMargins() {
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        let left = 0;
        let right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._getWidth();
            }
            else if (this._left.mode == 'push') {
                const width = this._left._getWidth();
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._getWidth();
            }
            else if (this._right.mode == 'push') {
                const width = this._right._getWidth();
                right += width;
                left -= width;
            }
        }
        // If either `right` or `left` is zero, don't set a style to the element. This
        // allows users to specify a custom size via CSS class in SSR scenarios where the
        // measured widths will always be zero. Note that we reset to `null` here, rather
        // than below, in order to ensure that the types in the `if` below are consistent.
        left = left || null;
        right = right || null;
        if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
            this._contentMargins = { left, right };
            // Pull back into the NgZone since in some cases we could be outside. We need to be careful
            // to do it only when something changed, otherwise we can end up hitting the zone too often.
            this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
        }
    }
    ngDoCheck() {
        // If users opted into autosizing, do a check every change detection cycle.
        if (this._autosize && this._isPushed()) {
            // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
            this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
        }
    }
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     */
    _watchDrawerToggle(drawer) {
        drawer._animationStarted
            .pipe(filter((event) => event.fromState !== event.toState), takeUntil(this._drawers.changes))
            .subscribe((event) => {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
                this._element.nativeElement.classList.add('mat-drawer-transition');
            }
            this.updateContentMargins();
            this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            drawer.openedChange
                .pipe(takeUntil(this._drawers.changes))
                .subscribe(() => this._setContainerClass(drawer.opened));
        }
    }
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     */
    _watchDrawerPosition(drawer) {
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
            this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
                this._validateDrawers();
            });
        });
    }
    /** Subscribes to changes in drawer mode so we can run change detection. */
    _watchDrawerMode(drawer) {
        if (drawer) {
            drawer._modeChanged
                .pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
                .subscribe(() => {
                this.updateContentMargins();
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
    _setContainerClass(isAdd) {
        const classList = this._element.nativeElement.classList;
        const className = 'mat-drawer-container-has-open';
        if (isAdd) {
            classList.add(className);
        }
        else {
            classList.remove(className);
        }
    }
    /** Validate the state of the drawer children components. */
    _validateDrawers() {
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach(drawer => {
            if (drawer.position == 'end') {
                if (this._end != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throwMatDuplicatedDrawerError('end');
                }
                this._end = drawer;
            }
            else {
                if (this._start != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throwMatDuplicatedDrawerError('start');
                }
                this._start = drawer;
            }
        });
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir && this._dir.value === 'rtl') {
            this._left = this._end;
            this._right = this._start;
        }
        else {
            this._left = this._start;
            this._right = this._end;
        }
    }
    /** Whether the container is being pushed to the side by one of the drawers. */
    _isPushed() {
        return ((this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
            (this._isDrawerOpen(this._end) && this._end.mode != 'over'));
    }
    _onBackdropClicked() {
        this.backdropClick.emit();
        this._closeModalDrawersViaBackdrop();
    }
    _closeModalDrawersViaBackdrop() {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(drawer => drawer && !drawer.disableClose && this._canHaveBackdrop(drawer))
            .forEach(drawer => drawer._closeViaBackdropClick());
    }
    _isShowingBackdrop() {
        return ((this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
            (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end)));
    }
    _canHaveBackdrop(drawer) {
        return drawer.mode !== 'side' || !!this._backdropOverride;
    }
    _isDrawerOpen(drawer) {
        return drawer != null && drawer.opened;
    }
}
MatDrawerContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawerContainer, deps: [{ token: i4.Directionality, optional: true }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: MAT_DRAWER_DEFAULT_AUTOSIZE }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatDrawerContainer, selector: "mat-drawer-container", inputs: { autosize: "autosize", hasBackdrop: "hasBackdrop" }, outputs: { backdropClick: "backdropClick" }, host: { properties: { "class.mat-drawer-container-explicit-backdrop": "_backdropOverride" }, classAttribute: "mat-drawer-container" }, providers: [
        {
            provide: MAT_DRAWER_CONTAINER,
            useExisting: MatDrawerContainer,
        },
    ], queries: [{ propertyName: "_content", first: true, predicate: MatDrawerContent, descendants: true }, { propertyName: "_allDrawers", predicate: MatDrawer, descendants: true }], viewQueries: [{ propertyName: "_userContent", first: true, predicate: MatDrawerContent, descendants: true }], exportAs: ["matDrawerContainer"], ngImport: i0, template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*=\"visibility: hidden\"]{display:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"], components: [{ type: MatDrawerContent, selector: "mat-drawer-content" }], directives: [{ type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDrawerContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer-container', exportAs: 'matDrawerContainer', host: {
                        'class': 'mat-drawer-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatDrawerContainer,
                        },
                    ], template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*=\"visibility: hidden\"]{display:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"] }]
        }], ctorParameters: function () { return [{ type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DRAWER_DEFAULT_AUTOSIZE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _allDrawers: [{
                type: ContentChildren,
                args: [MatDrawer, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }], _content: [{
                type: ContentChild,
                args: [MatDrawerContent]
            }], _userContent: [{
                type: ViewChild,
                args: [MatDrawerContent]
            }], autosize: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }], backdropClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUNMLFlBQVksRUFHWixnQkFBZ0IsRUFDaEIsb0JBQW9CLEdBQ3JCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FB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QWdCOzJGQXNoQmhCLGtCQUFrQjtrQkFsQjlCLFNBQVM7K0JBQ0Usc0JBQXNCLFlBQ3RCLG9CQUFvQixRQUd4Qjt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixnREFBZ0QsRUFBRSxtQkFBbUI7cUJBQ3RFLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLGFBQzFCO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxvQkFBb0I7NEJBQzdCLFdBQVcsb0JBQW9CO3lCQUNoQztxQkFDRjs7MEJBbUdFLFFBQVE7OzBCQUtSLE1BQU07MkJBQUMsMkJBQTJCOzswQkFDbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBaEczQyxXQUFXO3NCQUxWLGVBQWU7dUJBQUMsU0FBUyxFQUFFO3dCQUMxQix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO2dCQU0rQixRQUFRO3NCQUF2QyxZQUFZO3VCQUFDLGdCQUFnQjtnQkFDRCxZQUFZO3NCQUF4QyxTQUFTO3VCQUFDLGdCQUFnQjtnQkFxQnZCLFFBQVE7c0JBRFgsS0FBSztnQkFlRixXQUFXO3NCQURkLEtBQUs7Z0JBY2EsYUFBYTtzQkFBL0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBGb2N1c01vbml0b3IsXG4gIEZvY3VzT3JpZ2luLFxuICBGb2N1c1RyYXAsXG4gIEZvY3VzVHJhcEZhY3RvcnksXG4gIEludGVyYWN0aXZpdHlDaGVja2VyLFxufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZSwgU2Nyb2xsRGlzcGF0Y2hlciwgVmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIHRha2UsXG4gIHRha2VVbnRpbCxcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIG1hcFRvLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIHR3byBNYXREcmF3ZXIgYXJlIG1hdGNoaW5nIHRoZSBzYW1lIHBvc2l0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICB0aHJvdyBFcnJvcihgQSBkcmF3ZXIgd2FzIGFscmVhZHkgZGVjbGFyZWQgZm9yICdwb3NpdGlvbj1cIiR7cG9zaXRpb259XCInYCk7XG59XG5cbi8qKiBPcHRpb25zIGZvciB3aGVyZSB0byBzZXQgZm9jdXMgdG8gYXV0b21hdGljYWxseSBvbiBkaWFsb2cgb3BlbiAqL1xuZXhwb3J0IHR5cGUgQXV0b0ZvY3VzVGFyZ2V0ID0gJ2RpYWxvZycgfCAnZmlyc3QtdGFiYmFibGUnIHwgJ2ZpcnN0LWhlYWRpbmcnO1xuXG4vKiogUmVzdWx0IG9mIHRoZSB0b2dnbGUgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlci4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlclRvZ2dsZVJlc3VsdCA9ICdvcGVuJyB8ICdjbG9zZSc7XG5cbi8qKiBEcmF3ZXIgYW5kIFNpZGVOYXYgZGlzcGxheSBtb2Rlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlck1vZGUgPSAnb3ZlcicgfCAncHVzaCcgfCAnc2lkZSc7XG5cbi8qKiBDb25maWd1cmVzIHdoZXRoZXIgZHJhd2VycyBzaG91bGQgdXNlIGF1dG8gc2l6aW5nIGJ5IGRlZmF1bHQuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KFxuICAnTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgZHJhd2VyIGNvbnRhaW5lciB0byBhIGRyYXdlciB3aGlsZSBhdm9pZGluZyBjaXJjdWxhciByZWZlcmVuY2VzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9DT05UQUlORVIgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ01BVF9EUkFXRVJfQ09OVEFJTkVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlkoKTogYm9vbGVhbiB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRlbnQnLFxuICAgICdbc3R5bGUubWFyZ2luLWxlZnQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLmxlZnQnLFxuICAgICdbc3R5bGUubWFyZ2luLXJpZ2h0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5yaWdodCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBDZGtTY3JvbGxhYmxlLFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdERyYXdlckNvbnRlbnQsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyQ29udGVudCBleHRlbmRzIENka1Njcm9sbGFibGUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXREcmF3ZXJDb250YWluZXIpKSBwdWJsaWMgX2NvbnRhaW5lcjogTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHNjcm9sbERpc3BhdGNoZXIsIG5nWm9uZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY29udGFpbmVyLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBjb3JyZXNwb25kcyB0byBhIGRyYXdlciB0aGF0IGNhbiBiZSBvcGVuZWQgb24gdGhlIGRyYXdlciBjb250YWluZXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXInLFxuICBleHBvcnRBczogJ21hdERyYXdlcicsXG4gIHRlbXBsYXRlVXJsOiAnZHJhd2VyLmh0bWwnLFxuICBhbmltYXRpb25zOiBbbWF0RHJhd2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1EcmF3ZXJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXInLFxuICAgIC8vIG11c3QgcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGFsaWduaW5nIHRleHQgYmFzZWQgb24gdmFsdWVcbiAgICAnW2F0dHIuYWxpZ25dJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1lbmRdJzogJ3Bvc2l0aW9uID09PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3Zlcl0nOiAnbW9kZSA9PT0gXCJvdmVyXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1wdXNoXSc6ICdtb2RlID09PSBcInB1c2hcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXNpZGVdJzogJ21vZGUgPT09IFwic2lkZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3BlbmVkXSc6ICdvcGVuZWQnLFxuICAgICd0YWJJbmRleCc6ICctMScsXG4gICAgJ1tAdHJhbnNmb3JtXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHRyYW5zZm9ybS5zdGFydCknOiAnX2FuaW1hdGlvblN0YXJ0ZWQubmV4dCgkZXZlbnQpJyxcbiAgICAnKEB0cmFuc2Zvcm0uZG9uZSknOiAnX2FuaW1hdGlvbkVuZC5uZXh0KCRldmVudCknLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgaW5pdGlhbGl6ZWQuIFVzZWQgZm9yIGRpc2FibGluZyB0aGUgaW5pdGlhbCBhbmltYXRpb24uICovXG4gIHByaXZhdGUgX2VuYWJsZUFuaW1hdGlvbnMgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgdmlldyBvZiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGF0dGFjaGVkLiAqL1xuICBwcml2YXRlIF9pc0F0dGFjaGVkOiBib29sZWFuO1xuXG4gIC8qKiBBbmNob3Igbm9kZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGRyYXdlciB0byBpdHMgaW5pdGlhbCBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfYW5jaG9yOiBDb21tZW50IHwgbnVsbDtcblxuICAvKiogVGhlIHNpZGUgdGhhdCB0aGUgZHJhd2VyIGlzIGF0dGFjaGVkIHRvLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcG9zaXRpb24oKTogJ3N0YXJ0JyB8ICdlbmQnIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiAnc3RhcnQnIHwgJ2VuZCcpIHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHZhbGlkIHZhbHVlLlxuICAgIHZhbHVlID0gdmFsdWUgPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fcG9zaXRpb24pIHtcbiAgICAgIC8vIFN0YXRpYyBpbnB1dHMgaW4gSXZ5IGFyZSBzZXQgYmVmb3JlIHRoZSBlbGVtZW50IGlzIGluIHRoZSBET00uXG4gICAgICBpZiAodGhpcy5faXNBdHRhY2hlZCkge1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbkluUGFyZW50KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcbiAgICAgIHRoaXMub25Qb3NpdGlvbkNoYW5nZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ3N0YXJ0JztcblxuICAvKiogTW9kZSBvZiB0aGUgZHJhd2VyOyBvbmUgb2YgJ292ZXInLCAncHVzaCcgb3IgJ3NpZGUnLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbW9kZSgpOiBNYXREcmF3ZXJNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgfVxuICBzZXQgbW9kZSh2YWx1ZTogTWF0RHJhd2VyTW9kZSkge1xuICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9tb2RlOiBNYXREcmF3ZXJNb2RlID0gJ292ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgY2FuIGJlIGNsb3NlZCB3aXRoIHRoZSBlc2NhcGUga2V5IG9yIGJ5IGNsaWNraW5nIG9uIHRoZSBiYWNrZHJvcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVDbG9zZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZUNsb3NlO1xuICB9XG4gIHNldCBkaXNhYmxlQ2xvc2UodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVDbG9zZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGF1dG9tYXRpY2FsbHkgd2hlbiBvcGVuZWQuXG4gICAqIERlZmF1bHRzIHRvIGZhbHNlIGluIHdoZW4gYG1vZGVgIGlzIHNldCB0byBgc2lkZWAsIG90aGVyd2lzZSBkZWZhdWx0cyB0byBgdHJ1ZWAuIElmIGV4cGxpY2l0bHlcbiAgICogZW5hYmxlZCwgZm9jdXMgd2lsbCBiZSBtb3ZlZCBpbnRvIHRoZSBzaWRlbmF2IGluIGBzaWRlYCBtb2RlIGFzIHdlbGwuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvciBBdXRvRm9jdXNUYXJnZXRcbiAgICogaW5zdGVhZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvRm9jdXMoKTogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hdXRvRm9jdXM7XG5cbiAgICAvLyBOb3RlIHRoYXQgdXN1YWxseSB3ZSBkb24ndCBhbGxvdyBhdXRvRm9jdXMgdG8gYmUgc2V0IHRvIGBmaXJzdC10YWJiYWJsZWAgaW4gYHNpZGVgIG1vZGUsXG4gICAgLy8gYmVjYXVzZSB3ZSBkb24ndCBrbm93IGhvdyB0aGUgc2lkZW5hdiBpcyBiZWluZyB1c2VkLCBidXQgaW4gc29tZSBjYXNlcyBpdCBzdGlsbCBtYWtlc1xuICAgIC8vIHNlbnNlIHRvIGRvIGl0LiBUaGUgY29uc3VtZXIgY2FuIGV4cGxpY2l0bHkgc2V0IGBhdXRvRm9jdXNgLlxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSAnc2lkZScpIHtcbiAgICAgICAgcmV0dXJuICdkaWFsb2cnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdmaXJzdC10YWJiYWJsZSc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzZXQgYXV0b0ZvY3VzKHZhbHVlOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBCb29sZWFuSW5wdXQpIHtcbiAgICBpZiAodmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX2F1dG9Gb2N1cyA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2F1dG9Gb2N1czogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGlzIG9wZW5lZC4gV2Ugb3ZlcmxvYWQgdGhpcyBiZWNhdXNlIHdlIHRyaWdnZXIgYW4gZXZlbnQgd2hlbiBpdFxuICAgKiBzdGFydHMgb3IgZW5kLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG4gIHNldCBvcGVuZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMudG9nZ2xlKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBIb3cgdGhlIHNpZGVuYXYgd2FzIG9wZW5lZCAoa2V5cHJlc3MsIG1vdXNlIGNsaWNrIGV0Yy4pICovXG4gIHByaXZhdGUgX29wZW5lZFZpYTogRm9jdXNPcmlnaW4gfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvblN0YXJ0ZWQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkVuZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBzaWRlbmF2IGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAnb3Blbi1pbnN0YW50JyB8ICdvcGVuJyB8ICd2b2lkJyA9ICd2b2lkJztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbiBzdGF0ZSBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxuICAgIC8vIE5vdGUgdGhpcyBoYXMgdG8gYmUgYXN5bmMgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBpc3N1ZXMgd2l0aCB0d28tYmluZGluZ3MgKHNlZSAjODg3MikuXG4gICAgbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigvKiBpc0FzeW5jICovIHRydWUpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpXG4gIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW0gPSB0aGlzLm9wZW5lZENoYW5nZS5waXBlKFxuICAgIGZpbHRlcihvID0+IG8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIG9wZW5pbmcuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBvcGVuZWRTdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApLFxuICAgIG1hcFRvKHVuZGVmaW5lZCksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJylcbiAgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbSA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gIW8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGNsb3NpbmcuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBjbG9zZWRTdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICBtYXBUbyh1bmRlZmluZWQpLFxuICApO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlcidzIHBvc2l0aW9uIGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoJ3Bvc2l0aW9uQ2hhbmdlZCcpIHJlYWRvbmx5IG9uUG9zaXRpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIGVsZW1lbnQgdGhhdCBjb250YWlucyBhbGwgdGhlIGNvbnRlbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBfY29udGVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBkcmF3ZXIgbW9kZSBjaGFuZ2VzLiBUaGlzIGlzIHVzZWQgYnkgdGhlIGRyYXdlciBjb250YWluZXIgdG9cbiAgICogdG8ga25vdyB3aGVuIHRvIHdoZW4gdGhlIG1vZGUgY2hhbmdlcyBzbyBpdCBjYW4gYWRhcHQgdGhlIG1hcmdpbnMgb24gdGhlIGNvbnRlbnQuXG4gICAqL1xuICByZWFkb25seSBfbW9kZUNoYW5nZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ludGVyYWN0aXZpdHlDaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2M6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EUkFXRVJfQ09OVEFJTkVSKSBwdWJsaWMgX2NvbnRhaW5lcj86IE1hdERyYXdlckNvbnRhaW5lcixcbiAgKSB7XG4gICAgdGhpcy5vcGVuZWRDaGFuZ2Uuc3Vic2NyaWJlKChvcGVuZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmIChvcGVuZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RvYykge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkID0gdGhpcy5fZG9jLmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90YWtlRm9jdXMoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5faXNGb2N1c1dpdGhpbkRyYXdlcigpKSB7XG4gICAgICAgIHRoaXMuX3Jlc3RvcmVGb2N1cyh0aGlzLl9vcGVuZWRWaWEgfHwgJ3Byb2dyYW0nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byBga2V5ZG93bmAgZXZlbnRzIG91dHNpZGUgdGhlIHpvbmUgc28gdGhhdCBjaGFuZ2UgZGV0ZWN0aW9uIGlzIG5vdCBydW4gZXZlcnlcbiAgICAgKiB0aW1lIGEga2V5IGlzIHByZXNzZWQuIEluc3RlYWQgd2UgcmUtZW50ZXIgdGhlIHpvbmUgb25seSBpZiB0aGUgYEVTQ2Aga2V5IGlzIHByZXNzZWRcbiAgICAgKiBhbmQgd2UgZG9uJ3QgaGF2ZSBjbG9zZSBkaXNhYmxlZC5cbiAgICAgKi9cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgKGZyb21FdmVudCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdrZXlkb3duJykgYXMgT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PilcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIXRoaXMuZGlzYWJsZUNsb3NlICYmICFoYXNNb2RpZmllcktleShldmVudCk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCksXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZShldmVudCA9PlxuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kXG4gICAgICAucGlwZShcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHtcbiAgICAgICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7ZnJvbVN0YXRlLCB0b1N0YXRlfSA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAodG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDAgJiYgZnJvbVN0YXRlID09PSAndm9pZCcpIHx8XG4gICAgICAgICAgKHRvU3RhdGUgPT09ICd2b2lkJyAmJiBmcm9tU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KHRoaXMuX29wZW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHByb3ZpZGVkIGVsZW1lbnQuIElmIHRoZSBlbGVtZW50IGlzIG5vdCBmb2N1c2FibGUsIGl0IHdpbGwgYWRkIGEgdGFiSW5kZXhcbiAgICogYXR0cmlidXRlIHRvIGZvcmNlZnVsbHkgZm9jdXMgaXQuIFRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBhZnRlciBmb2N1cyBpcyBtb3ZlZC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZm9jdXMuXG4gICAqL1xuICBwcml2YXRlIF9mb3JjZUZvY3VzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9pbnRlcmFjdGl2aXR5Q2hlY2tlci5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xuICAgICAgZWxlbWVudC50YWJJbmRleCA9IC0xO1xuICAgICAgLy8gVGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBzaG91bGQgYmUgcmVtb3ZlZCB0byBhdm9pZCBuYXZpZ2F0aW5nIHRvIHRoYXQgZWxlbWVudCBhZ2FpblxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgY2FsbGJhY2spO1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2FsbGJhY2spO1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGNhbGxiYWNrKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3Igd2l0aGluIHRoZSBmb2N1cyB0cmFwLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciBmb3IgdGhlIGVsZW1lbnQgdG8gc2V0IGZvY3VzIHRvLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNCeUNzc1NlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBsZXQgZWxlbWVudFRvRm9jdXMgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIHNlbGVjdG9yLFxuICAgICkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChlbGVtZW50VG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9yY2VGb2N1cyhlbGVtZW50VG9Gb2N1cywgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIGZvY3VzIGludG8gdGhlIGRyYXdlci4gTm90ZSB0aGF0IHRoaXMgd29ya3MgZXZlbiBpZlxuICAgKiB0aGUgZm9jdXMgdHJhcCBpcyBkaXNhYmxlZCBpbiBgc2lkZWAgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgX3Rha2VGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgb24gdGhlIHNpZGVuYXYsIGlmIHRoZSBlbGVtZW50IGNhbm5vdCBiZSBmb2N1c2VkIG9yIGRvZXNcbiAgICAvLyBub3QgZXhpc3QsIGZvY3VzIHRoZSBzaWRlbmF2IGl0c2VsZiBzbyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvbiBzdGlsbCB3b3Jrcy5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHRoYXQgYGZvY3VzYCBpcyBhIGZ1bmN0aW9uIGR1ZSB0byBVbml2ZXJzYWwuXG4gICAgc3dpdGNoICh0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgY2FzZSBmYWxzZTpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgIGNhc2UgJ2ZpcnN0LXRhYmJhYmxlJzpcbiAgICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKS50aGVuKGhhc01vdmVkRm9jdXMgPT4ge1xuICAgICAgICAgIGlmICghaGFzTW92ZWRGb2N1cyAmJiB0eXBlb2YgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaXJzdC1oZWFkaW5nJzpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBbcm9sZT1cImhlYWRpbmdcIl0nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IodGhpcy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIG9yaWdpbmFsbHkgZm9jdXNlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbmVkLlxuICAgKiBJZiBubyBlbGVtZW50IHdhcyBmb2N1c2VkIGF0IHRoYXQgdGltZSwgdGhlIGZvY3VzIHdpbGwgYmUgcmVzdG9yZWQgdG8gdGhlIGRyYXdlci5cbiAgICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cyhmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4pIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMgPT09ICdkaWFsb2cnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQsIGZvY3VzT3JpZ2luKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCA9IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgd2l0aGluIHRoZSBkcmF3ZXIuICovXG4gIHByaXZhdGUgX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWN0aXZlRWwgPSB0aGlzLl9kb2MuYWN0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gISFhY3RpdmVFbCAmJiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWwpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2lzQXR0YWNoZWQgPSB0cnVlO1xuICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcblxuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBET00gcG9zaXRpb24gd2hlbiB0aGUgc2lkZW5hdiBpcyBwb3NpdGlvbmVkIGF0XG4gICAgLy8gdGhlIGVuZCBzaW5jZSB3ZSBwcm9qZWN0IHRoZSBzaWRlbmF2IGJlZm9yZSB0aGUgY29udGVudCBieSBkZWZhdWx0LlxuICAgIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uSW5QYXJlbnQoJ2VuZCcpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBFbmFibGUgdGhlIGFuaW1hdGlvbnMgYWZ0ZXIgdGhlIGxpZmVjeWNsZSBob29rcyBoYXZlIHJ1biwgaW4gb3JkZXIgdG8gYXZvaWQgYW5pbWF0aW5nXG4gICAgLy8gZHJhd2VycyB0aGF0IGFyZSBvcGVuIGJ5IGRlZmF1bHQuIFdoZW4gd2UncmUgb24gdGhlIHNlcnZlciwgd2Ugc2hvdWxkbid0IGVuYWJsZSB0aGVcbiAgICAvLyBhbmltYXRpb25zLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIGRyYXdlciB0byBhbmltYXRlIHRoZSBmaXJzdCB0aW1lIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgcGFnZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9lbmFibGVBbmltYXRpb25zID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuY2hvcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5fYW5jaG9yID0gbnVsbDtcbiAgICB0aGlzLl9hbmltYXRpb25TdGFydGVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIG9wZW5lZFZpYSBXaGV0aGVyIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZCBieSBhIGtleSBwcmVzcywgbW91c2UgY2xpY2sgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogVXNlZCBmb3IgZm9jdXMgbWFuYWdlbWVudCBhZnRlciB0aGUgc2lkZW5hdiBpcyBjbG9zZWQuXG4gICAqL1xuICBvcGVuKG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGUodHJ1ZSwgb3BlbmVkVmlhKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgZHJhd2VyLiAqL1xuICBjbG9zZSgpOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZShmYWxzZSk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBkcmF3ZXIgd2l0aCBjb250ZXh0IHRoYXQgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkLiAqL1xuICBfY2xvc2VWaWFCYWNrZHJvcENsaWNrKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgLy8gSWYgdGhlIGRyYXdlciBpcyBjbG9zZWQgdXBvbiBhIGJhY2tkcm9wIGNsaWNrLCB3ZSBhbHdheXMgd2FudCB0byByZXN0b3JlIGZvY3VzLiBXZVxuICAgIC8vIGRvbid0IG5lZWQgdG8gY2hlY2sgd2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgaW4gdGhlIGRyYXdlciwgYXMgY2xpY2tpbmcgb24gdGhlXG4gICAgLy8gYmFja2Ryb3AgY2F1c2VzIGJsdXJzIHRoZSBhY3RpdmUgZWxlbWVudC5cbiAgICByZXR1cm4gdGhpcy5fc2V0T3BlbigvKiBpc09wZW4gKi8gZmFsc2UsIC8qIHJlc3RvcmVGb2N1cyAqLyB0cnVlLCAnbW91c2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhpcyBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBiZSBvcGVuLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIHRvZ2dsZShpc09wZW46IGJvb2xlYW4gPSAhdGhpcy5vcGVuZWQsIG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICAvLyBJZiB0aGUgZm9jdXMgaXMgY3VycmVudGx5IGluc2lkZSB0aGUgZHJhd2VyIGNvbnRlbnQgYW5kIHdlIGFyZSBjbG9zaW5nIHRoZSBkcmF3ZXIsXG4gICAgLy8gcmVzdG9yZSB0aGUgZm9jdXMgdG8gdGhlIGluaXRpYWxseSBmb2N1c2VkIGVsZW1lbnQgKHdoZW4gdGhlIGRyYXdlciBvcGVuZWQpLlxuICAgIGlmIChpc09wZW4gJiYgb3BlbmVkVmlhKSB7XG4gICAgICB0aGlzLl9vcGVuZWRWaWEgPSBvcGVuZWRWaWE7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fc2V0T3BlbihcbiAgICAgIGlzT3BlbixcbiAgICAgIC8qIHJlc3RvcmVGb2N1cyAqLyAhaXNPcGVuICYmIHRoaXMuX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKSxcbiAgICAgIHRoaXMuX29wZW5lZFZpYSB8fCAncHJvZ3JhbScsXG4gICAgKTtcblxuICAgIGlmICghaXNPcGVuKSB7XG4gICAgICB0aGlzLl9vcGVuZWRWaWEgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgb3BlbmVkIHN0YXRlIG9mIHRoZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBvcGVuIG9yIGNsb3NlLlxuICAgKiBAcGFyYW0gcmVzdG9yZUZvY3VzIFdoZXRoZXIgZm9jdXMgc2hvdWxkIGJlIHJlc3RvcmVkIG9uIGNsb3NlLlxuICAgKiBAcGFyYW0gZm9jdXNPcmlnaW4gT3JpZ2luIHRvIHVzZSB3aGVuIHJlc3RvcmluZyBmb2N1cy5cbiAgICovXG4gIHByaXZhdGUgX3NldE9wZW4oXG4gICAgaXNPcGVuOiBib29sZWFuLFxuICAgIHJlc3RvcmVGb2N1czogYm9vbGVhbixcbiAgICBmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4sXG4gICk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgdGhpcy5fb3BlbmVkID0gaXNPcGVuO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLl9lbmFibGVBbmltYXRpb25zID8gJ29wZW4nIDogJ29wZW4taW5zdGFudCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgICAgaWYgKHJlc3RvcmVGb2N1cykge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoZm9jdXNPcmlnaW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wZW4gPT4gcmVzb2x2ZShvcGVuID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA/IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwIDogMDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBmb2N1cyB0cmFwLiAqL1xuICBwcml2YXRlIF91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICAvLyBUaGUgZm9jdXMgdHJhcCBpcyBvbmx5IGVuYWJsZWQgd2hlbiB0aGUgZHJhd2VyIGlzIG9wZW4gaW4gYW55IG1vZGUgb3RoZXIgdGhhbiBzaWRlLlxuICAgICAgdGhpcy5fZm9jdXNUcmFwLmVuYWJsZWQgPSB0aGlzLm9wZW5lZCAmJiB0aGlzLm1vZGUgIT09ICdzaWRlJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGRyYXdlciBpbiB0aGUgRE9NLiBXZSBuZWVkIHRvIG1vdmUgdGhlIGVsZW1lbnQgYXJvdW5kIG91cnNlbHZlc1xuICAgKiB3aGVuIGl0J3MgaW4gdGhlIGBlbmRgIHBvc2l0aW9uIHNvIHRoYXQgaXQgY29tZXMgYWZ0ZXIgdGhlIGNvbnRlbnQgYW5kIHRoZSB2aXN1YWwgb3JkZXJcbiAgICogbWF0Y2hlcyB0aGUgdGFiIG9yZGVyLiBXZSBhbHNvIG5lZWQgdG8gYmUgYWJsZSB0byBtb3ZlIGl0IGJhY2sgdG8gYHN0YXJ0YCBpZiB0aGUgc2lkZW5hdlxuICAgKiBzdGFydGVkIG9mZiBhcyBgZW5kYCBhbmQgd2FzIGNoYW5nZWQgdG8gYHN0YXJ0YC5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uSW5QYXJlbnQobmV3UG9zaXRpb246ICdzdGFydCcgfCAnZW5kJykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlITtcblxuICAgIGlmIChuZXdQb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgIGlmICghdGhpcy5fYW5jaG9yKSB7XG4gICAgICAgIHRoaXMuX2FuY2hvciA9IHRoaXMuX2RvYy5jcmVhdGVDb21tZW50KCdtYXQtZHJhd2VyLWFuY2hvcicpITtcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLl9hbmNob3IhLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fYW5jaG9yKSB7XG4gICAgICB0aGlzLl9hbmNob3IucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMuX2FuY2hvcik7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogYDxtYXQtZHJhd2VyLWNvbnRhaW5lcj5gIGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIG9uZSBvciB0d28gYDxtYXQtZHJhd2VyPmBzIHRoYXQgdmFsaWRhdGVzIHRoZSBzdGF0ZSBpbnRlcm5hbGx5XG4gKiBhbmQgY29vcmRpbmF0ZXMgdGhlIGJhY2tkcm9wIGFuZCBjb250ZW50IHN0eWxpbmcuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXJDb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkcmF3ZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1BVF9EUkFXRVJfQ09OVEFJTkVSLFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdERyYXdlckNvbnRhaW5lcixcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250YWluZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICAvKiogQWxsIGRyYXdlcnMgaW4gdGhlIGNvbnRhaW5lci4gSW5jbHVkZXMgZHJhd2VycyBmcm9tIGluc2lkZSBuZXN0ZWQgY29udGFpbmVycy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXREcmF3ZXIsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZSxcbiAgfSlcbiAgX2FsbERyYXdlcnM6IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+O1xuXG4gIC8qKiBEcmF3ZXJzIHRoYXQgYmVsb25nIHRvIHRoaXMgY29udGFpbmVyLiAqL1xuICBfZHJhd2VycyA9IG5ldyBRdWVyeUxpc3Q8TWF0RHJhd2VyPigpO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0RHJhd2VyQ29udGVudCkgX2NvbnRlbnQ6IE1hdERyYXdlckNvbnRlbnQ7XG4gIEBWaWV3Q2hpbGQoTWF0RHJhd2VyQ29udGVudCkgX3VzZXJDb250ZW50OiBNYXREcmF3ZXJDb250ZW50O1xuXG4gIC8qKiBUaGUgZHJhd2VyIGNoaWxkIHdpdGggdGhlIGBzdGFydGAgcG9zaXRpb24uICovXG4gIGdldCBzdGFydCgpOiBNYXREcmF3ZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gIH1cblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgZW5kYCBwb3NpdGlvbi4gKi9cbiAgZ2V0IGVuZCgpOiBNYXREcmF3ZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSByZXNpemUgdGhlIGNvbnRhaW5lciB3aGVuZXZlclxuICAgKiB0aGUgc2l6ZSBvZiBhbnkgb2YgaXRzIGRyYXdlcnMgY2hhbmdlcy5cbiAgICpcbiAgICogKipVc2UgYXQgeW91ciBvd24gcmlzayEqKiBFbmFibGluZyB0aGlzIG9wdGlvbiBjYW4gY2F1c2UgbGF5b3V0IHRocmFzaGluZyBieSBtZWFzdXJpbmdcbiAgICogdGhlIGRyYXdlcnMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS4gQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdmlhIHRoZVxuICAgKiBgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvc2l6ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0b3NpemU7XG4gIH1cbiAgc2V0IGF1dG9zaXplKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9hdXRvc2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b3NpemU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBjb250YWluZXIgc2hvdWxkIGhhdmUgYSBiYWNrZHJvcCB3aGlsZSBvbmUgb2YgdGhlIHNpZGVuYXZzIGlzIG9wZW4uXG4gICAqIElmIGV4cGxpY2l0bHkgc2V0IHRvIGB0cnVlYCwgdGhlIGJhY2tkcm9wIHdpbGwgYmUgZW5hYmxlZCBmb3IgZHJhd2VycyBpbiB0aGUgYHNpZGVgXG4gICAqIG1vZGUgYXMgd2VsbC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fYmFja2Ryb3BPdmVycmlkZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gIXRoaXMuX3N0YXJ0IHx8IHRoaXMuX3N0YXJ0Lm1vZGUgIT09ICdzaWRlJyB8fCAhdGhpcy5fZW5kIHx8IHRoaXMuX2VuZC5tb2RlICE9PSAnc2lkZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGU7XG4gIH1cbiAgc2V0IGhhc0JhY2tkcm9wKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIF9iYWNrZHJvcE92ZXJyaWRlOiBib29sZWFuIHwgbnVsbDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgYmFja2Ryb3AgaXMgY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGJhY2tkcm9wQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogVGhlIGRyYXdlciBhdCB0aGUgc3RhcnQvZW5kIHBvc2l0aW9uLCBpbmRlcGVuZGVudCBvZiBkaXJlY3Rpb24uICovXG4gIHByaXZhdGUgX3N0YXJ0OiBNYXREcmF3ZXIgfCBudWxsO1xuICBwcml2YXRlIF9lbmQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBkcmF3ZXIgYXQgdGhlIGxlZnQvcmlnaHQuIFdoZW4gZGlyZWN0aW9uIGNoYW5nZXMsIHRoZXNlIHdpbGwgY2hhbmdlIGFzIHdlbGwuXG4gICAqIFRoZXkncmUgdXNlZCBhcyBhbGlhc2VzIGZvciB0aGUgYWJvdmUgdG8gc2V0IHRoZSBsZWZ0L3JpZ2h0IHN0eWxlIHByb3Blcmx5LlxuICAgKiBJbiBMVFIsIF9sZWZ0ID09IF9zdGFydCBhbmQgX3JpZ2h0ID09IF9lbmQuXG4gICAqIEluIFJUTCwgX2xlZnQgPT0gX2VuZCBhbmQgX3JpZ2h0ID09IF9zdGFydC5cbiAgICovXG4gIHByaXZhdGUgX2xlZnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX3JpZ2h0OiBNYXREcmF3ZXIgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyBvbiBldmVyeSBuZ0RvQ2hlY2suIFVzZWQgZm9yIGRlYm91bmNpbmcgcmVmbG93cy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZG9DaGVja1N1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBNYXJnaW5zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGNvbnRlbnQuIFRoZXNlIGFyZSB1c2VkIHRvIHB1c2ggLyBzaHJpbmsgdGhlIGRyYXdlciBjb250ZW50IHdoZW4gYVxuICAgKiBkcmF3ZXIgaXMgb3Blbi4gV2UgdXNlIG1hcmdpbiByYXRoZXIgdGhhbiB0cmFuc2Zvcm0gZXZlbiBmb3IgcHVzaCBtb2RlIGJlY2F1c2UgdHJhbnNmb3JtIGJyZWFrc1xuICAgKiBmaXhlZCBwb3NpdGlvbiBlbGVtZW50cyBpbnNpZGUgb2YgdGhlIHRyYW5zZm9ybWVkIGVsZW1lbnQuXG4gICAqL1xuICBfY29udGVudE1hcmdpbnM6IHtsZWZ0OiBudW1iZXIgfCBudWxsOyByaWdodDogbnVtYmVyIHwgbnVsbH0gPSB7bGVmdDogbnVsbCwgcmlnaHQ6IG51bGx9O1xuXG4gIHJlYWRvbmx5IF9jb250ZW50TWFyZ2luQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHtsZWZ0OiBudW1iZXIgfCBudWxsOyByaWdodDogbnVtYmVyIHwgbnVsbH0+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgQ2RrU2Nyb2xsYWJsZSBpbnN0YW5jZSB0aGF0IHdyYXBzIHRoZSBzY3JvbGxhYmxlIGNvbnRlbnQuICovXG4gIGdldCBzY3JvbGxhYmxlKCk6IENka1Njcm9sbGFibGUge1xuICAgIHJldHVybiB0aGlzLl91c2VyQ29udGVudCB8fCB0aGlzLl9jb250ZW50O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBASW5qZWN0KE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSkgZGVmYXVsdEF1dG9zaXplID0gZmFsc2UsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIC8vIElmIGEgYERpcmAgZGlyZWN0aXZlIGV4aXN0cyB1cCB0aGUgdHJlZSwgbGlzdGVuIGRpcmVjdGlvbiBjaGFuZ2VzXG4gICAgLy8gYW5kIHVwZGF0ZSB0aGUgbGVmdC9yaWdodCBwcm9wZXJ0aWVzIHRvIHBvaW50IHRvIHRoZSBwcm9wZXIgc3RhcnQvZW5kLlxuICAgIGlmIChfZGlyKSB7XG4gICAgICBfZGlyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZURyYXdlcnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIG1pbmltdW0gd2lkdGggb2YgdGhlIHNpZGVuYXYgZGVwZW5kcyBvbiB0aGUgdmlld3BvcnQgd2lkdGgsXG4gICAgLy8gd2UgbmVlZCB0byByZWNvbXB1dGUgdGhlIG1hcmdpbnMgaWYgdGhlIHZpZXdwb3J0IGNoYW5nZXMuXG4gICAgdmlld3BvcnRSdWxlclxuICAgICAgLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcblxuICAgIHRoaXMuX2F1dG9zaXplID0gZGVmYXVsdEF1dG9zaXplO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FsbERyYXdlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbERyYXdlcnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRyYXdlcjogUXVlcnlMaXN0PE1hdERyYXdlcj4pID0+IHtcbiAgICAgICAgdGhpcy5fZHJhd2Vycy5yZXNldChkcmF3ZXIuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uX2NvbnRhaW5lciB8fCBpdGVtLl9jb250YWluZXIgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZHJhd2Vycy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fZHJhd2Vycy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG5cbiAgICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaCgoZHJhd2VyOiBNYXREcmF3ZXIpID0+IHtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJQb3NpdGlvbihkcmF3ZXIpO1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlck1vZGUoZHJhd2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9kcmF3ZXJzLmxlbmd0aCB8fFxuICAgICAgICB0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpIHx8XG4gICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIEF2b2lkIGhpdHRpbmcgdGhlIE5nWm9uZSB0aHJvdWdoIHRoZSBkZWJvdW5jZSB0aW1lb3V0LlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9kb0NoZWNrU3ViamVjdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBkZWJvdW5jZVRpbWUoMTApLCAvLyBBcmJpdHJhcnkgZGVib3VuY2UgdGltZSwgbGVzcyB0aGFuIGEgZnJhbWUgYXQgNjBmcHNcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZHJhd2Vycy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgb3BlbmAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5vcGVuKCkpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBjbG9zZWAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIuY2xvc2UoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIGFuZCB1cGRhdGVzIHRoZSBpbmxpbmUgc3R5bGVzIGZvciB0aGUgY29udGVudC4gTm90ZSB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWRcbiAgICogc3BhcmluZ2x5LCBiZWNhdXNlIGl0IGNhdXNlcyBhIHJlZmxvdy5cbiAgICovXG4gIHVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkge1xuICAgIC8vIDEuIEZvciBkcmF3ZXJzIGluIGBvdmVyYCBtb2RlLCB0aGV5IGRvbid0IGFmZmVjdCB0aGUgY29udGVudC5cbiAgICAvLyAyLiBGb3IgZHJhd2VycyBpbiBgc2lkZWAgbW9kZSB0aGV5IHNob3VsZCBzaHJpbmsgdGhlIGNvbnRlbnQuIFdlIGRvIHRoaXMgYnkgYWRkaW5nIHRvIHRoZVxuICAgIC8vICAgIGxlZnQgbWFyZ2luIChmb3IgbGVmdCBkcmF3ZXIpIG9yIHJpZ2h0IG1hcmdpbiAoZm9yIHJpZ2h0IHRoZSBkcmF3ZXIpLlxuICAgIC8vIDMuIEZvciBkcmF3ZXJzIGluIGBwdXNoYCBtb2RlIHRoZSBzaG91bGQgc2hpZnQgdGhlIGNvbnRlbnQgd2l0aG91dCByZXNpemluZyBpdC4gV2UgZG8gdGhpcyBieVxuICAgIC8vICAgIGFkZGluZyB0byB0aGUgbGVmdCBvciByaWdodCBtYXJnaW4gYW5kIHNpbXVsdGFuZW91c2x5IHN1YnRyYWN0aW5nIHRoZSBzYW1lIGFtb3VudCBvZlxuICAgIC8vICAgIG1hcmdpbiBmcm9tIHRoZSBvdGhlciBzaWRlLlxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBsZXQgcmlnaHQgPSAwO1xuXG4gICAgaWYgKHRoaXMuX2xlZnQgJiYgdGhpcy5fbGVmdC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIGxlZnQgKz0gdGhpcy5fbGVmdC5fZ2V0V2lkdGgoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGVmdC5tb2RlID09ICdwdXNoJykge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2xlZnQuX2dldFdpZHRoKCk7XG4gICAgICAgIGxlZnQgKz0gd2lkdGg7XG4gICAgICAgIHJpZ2h0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9yaWdodCAmJiB0aGlzLl9yaWdodC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICByaWdodCArPSB0aGlzLl9yaWdodC5fZ2V0V2lkdGgoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmlnaHQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9yaWdodC5fZ2V0V2lkdGgoKTtcbiAgICAgICAgcmlnaHQgKz0gd2lkdGg7XG4gICAgICAgIGxlZnQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgZWl0aGVyIGByaWdodGAgb3IgYGxlZnRgIGlzIHplcm8sIGRvbid0IHNldCBhIHN0eWxlIHRvIHRoZSBlbGVtZW50LiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzZXJzIHRvIHNwZWNpZnkgYSBjdXN0b20gc2l6ZSB2aWEgQ1NTIGNsYXNzIGluIFNTUiBzY2VuYXJpb3Mgd2hlcmUgdGhlXG4gICAgLy8gbWVhc3VyZWQgd2lkdGhzIHdpbGwgYWx3YXlzIGJlIHplcm8uIE5vdGUgdGhhdCB3ZSByZXNldCB0byBgbnVsbGAgaGVyZSwgcmF0aGVyXG4gICAgLy8gdGhhbiBiZWxvdywgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHR5cGVzIGluIHRoZSBgaWZgIGJlbG93IGFyZSBjb25zaXN0ZW50LlxuICAgIGxlZnQgPSBsZWZ0IHx8IG51bGwhO1xuICAgIHJpZ2h0ID0gcmlnaHQgfHwgbnVsbCE7XG5cbiAgICBpZiAobGVmdCAhPT0gdGhpcy5fY29udGVudE1hcmdpbnMubGVmdCB8fCByaWdodCAhPT0gdGhpcy5fY29udGVudE1hcmdpbnMucmlnaHQpIHtcbiAgICAgIHRoaXMuX2NvbnRlbnRNYXJnaW5zID0ge2xlZnQsIHJpZ2h0fTtcblxuICAgICAgLy8gUHVsbCBiYWNrIGludG8gdGhlIE5nWm9uZSBzaW5jZSBpbiBzb21lIGNhc2VzIHdlIGNvdWxkIGJlIG91dHNpZGUuIFdlIG5lZWQgdG8gYmUgY2FyZWZ1bFxuICAgICAgLy8gdG8gZG8gaXQgb25seSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VkLCBvdGhlcndpc2Ugd2UgY2FuIGVuZCB1cCBoaXR0aW5nIHRoZSB6b25lIHRvbyBvZnRlbi5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5fY29udGVudE1hcmdpbkNoYW5nZXMubmV4dCh0aGlzLl9jb250ZW50TWFyZ2lucykpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICAvLyBJZiB1c2VycyBvcHRlZCBpbnRvIGF1dG9zaXppbmcsIGRvIGEgY2hlY2sgZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fYXV0b3NpemUgJiYgdGhpcy5faXNQdXNoZWQoKSkge1xuICAgICAgLy8gUnVuIG91dHNpZGUgdGhlIE5nWm9uZSwgb3RoZXJ3aXNlIHRoZSBkZWJvdW5jZXIgd2lsbCB0aHJvdyB1cyBpbnRvIGFuIGluZmluaXRlIGxvb3AuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5fZG9DaGVja1N1YmplY3QubmV4dCgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBkcmF3ZXIgZXZlbnRzIGluIG9yZGVyIHRvIHNldCBhIGNsYXNzIG9uIHRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50IHdoZW4gdGhlXG4gICAqIGRyYXdlciBpcyBvcGVuIGFuZCB0aGUgYmFja2Ryb3AgaXMgdmlzaWJsZS4gVGhpcyBlbnN1cmVzIGFueSBvdmVyZmxvdyBvbiB0aGUgY29udGFpbmVyIGVsZW1lbnRcbiAgICogaXMgcHJvcGVybHkgaGlkZGVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBkcmF3ZXIuX2FuaW1hdGlvblN0YXJ0ZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4gZXZlbnQuZnJvbVN0YXRlICE9PSBldmVudC50b1N0YXRlKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcyksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgLy8gU2V0IHRoZSB0cmFuc2l0aW9uIGNsYXNzIG9uIHRoZSBjb250YWluZXIgc28gdGhhdCB0aGUgYW5pbWF0aW9ucyBvY2N1ci4gVGhpcyBzaG91bGQgbm90XG4gICAgICAgIC8vIGJlIHNldCBpbml0aWFsbHkgYmVjYXVzZSBhbmltYXRpb25zIHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZCB2aWEgYSBjaGFuZ2UgaW4gc3RhdGUuXG4gICAgICAgIGlmIChldmVudC50b1N0YXRlICE9PSAnb3Blbi1pbnN0YW50JyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1kcmF3ZXItdHJhbnNpdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGRyYXdlci5tb2RlICE9PSAnc2lkZScpIHtcbiAgICAgIGRyYXdlci5vcGVuZWRDaGFuZ2VcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fc2V0Q29udGFpbmVyQ2xhc3MoZHJhd2VyLm9wZW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBvblBvc2l0aW9uQ2hhbmdlZCBldmVudCBpbiBvcmRlciB0b1xuICAgKiByZS12YWxpZGF0ZSBkcmF3ZXJzIHdoZW4gdGhlIHBvc2l0aW9uIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTk9URTogV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IGJlZm9yZSB2YWxpZGF0aW5nLFxuICAgIC8vIHNpbmNlIGJvdGggZHJhd2VycyBtYXkgYmUgc3dhcHBpbmcgcG9zaXRpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgZHJhd2VyLm9uUG9zaXRpb25DaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIGRyYXdlciBtb2RlIHNvIHdlIGNhbiBydW4gY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKGRyYXdlcikge1xuICAgICAgZHJhd2VyLl9tb2RlQ2hhbmdlZFxuICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UodGhpcy5fZHJhd2Vycy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95ZWQpKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgJ21hdC1kcmF3ZXItb3BlbmVkJyBjbGFzcyBvbiB0aGUgbWFpbiAnbWF0LWRyYXdlci1jb250YWluZXInIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3NldENvbnRhaW5lckNsYXNzKGlzQWRkOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBjb25zdCBjbGFzc05hbWUgPSAnbWF0LWRyYXdlci1jb250YWluZXItaGFzLW9wZW4nO1xuXG4gICAgaWYgKGlzQWRkKSB7XG4gICAgICBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIHN0YXRlIG9mIHRoZSBkcmF3ZXIgY2hpbGRyZW4gY29tcG9uZW50cy4gKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVEcmF3ZXJzKCkge1xuICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5fZW5kID0gbnVsbDtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgYXQgbW9zdCBvbmUgc3RhcnQgYW5kIG9uZSBlbmQgZHJhd2VyLlxuICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaChkcmF3ZXIgPT4ge1xuICAgICAgaWYgKGRyYXdlci5wb3NpdGlvbiA9PSAnZW5kJykge1xuICAgICAgICBpZiAodGhpcy5fZW5kICE9IG51bGwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICB0aHJvd01hdER1cGxpY2F0ZWREcmF3ZXJFcnJvcignZW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZW5kID0gZHJhd2VyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ICE9IG51bGwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgICB0aHJvd01hdER1cGxpY2F0ZWREcmF3ZXJFcnJvcignc3RhcnQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGFydCA9IGRyYXdlcjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fbGVmdCA9IG51bGw7XG5cbiAgICAvLyBEZXRlY3QgaWYgd2UncmUgTFRSIG9yIFJUTC5cbiAgICBpZiAodGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcpIHtcbiAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9lbmQ7XG4gICAgICB0aGlzLl9yaWdodCA9IHRoaXMuX3N0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5fc3RhcnQ7XG4gICAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2VuZDtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY29udGFpbmVyIGlzIGJlaW5nIHB1c2hlZCB0byB0aGUgc2lkZSBieSBvbmUgb2YgdGhlIGRyYXdlcnMuICovXG4gIHByaXZhdGUgX2lzUHVzaGVkKCkge1xuICAgIHJldHVybiAoXG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9zdGFydC5tb2RlICE9ICdvdmVyJykgfHxcbiAgICAgICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSAmJiB0aGlzLl9lbmQubW9kZSAhPSAnb3ZlcicpXG4gICAgKTtcbiAgfVxuXG4gIF9vbkJhY2tkcm9wQ2xpY2tlZCgpIHtcbiAgICB0aGlzLmJhY2tkcm9wQ2xpY2suZW1pdCgpO1xuICAgIHRoaXMuX2Nsb3NlTW9kYWxEcmF3ZXJzVmlhQmFja2Ryb3AoKTtcbiAgfVxuXG4gIF9jbG9zZU1vZGFsRHJhd2Vyc1ZpYUJhY2tkcm9wKCkge1xuICAgIC8vIENsb3NlIGFsbCBvcGVuIGRyYXdlcnMgd2hlcmUgY2xvc2luZyBpcyBub3QgZGlzYWJsZWQgYW5kIHRoZSBtb2RlIGlzIG5vdCBgc2lkZWAuXG4gICAgW3RoaXMuX3N0YXJ0LCB0aGlzLl9lbmRdXG4gICAgICAuZmlsdGVyKGRyYXdlciA9PiBkcmF3ZXIgJiYgIWRyYXdlci5kaXNhYmxlQ2xvc2UgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcikpXG4gICAgICAuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyIS5fY2xvc2VWaWFCYWNrZHJvcENsaWNrKCkpO1xuICB9XG5cbiAgX2lzU2hvd2luZ0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AodGhpcy5fc3RhcnQpKSB8fFxuICAgICAgKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpICYmIHRoaXMuX2NhbkhhdmVCYWNrZHJvcCh0aGlzLl9lbmQpKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9jYW5IYXZlQmFja2Ryb3AoZHJhd2VyOiBNYXREcmF3ZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZHJhd2VyLm1vZGUgIT09ICdzaWRlJyB8fCAhIXRoaXMuX2JhY2tkcm9wT3ZlcnJpZGU7XG4gIH1cblxuICBwcml2YXRlIF9pc0RyYXdlck9wZW4oZHJhd2VyOiBNYXREcmF3ZXIgfCBudWxsKTogZHJhd2VyIGlzIE1hdERyYXdlciB7XG4gICAgcmV0dXJuIGRyYXdlciAhPSBudWxsICYmIGRyYXdlci5vcGVuZWQ7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtZHJhd2VyLWlubmVyLWNvbnRhaW5lclwiIGNka1Njcm9sbGFibGUgI2NvbnRlbnQ+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuIiwiPGRpdiBjbGFzcz1cIm1hdC1kcmF3ZXItYmFja2Ryb3BcIiAoY2xpY2spPVwiX29uQmFja2Ryb3BDbGlja2VkKClcIiAqbmdJZj1cImhhc0JhY2tkcm9wXCJcbiAgICAgW2NsYXNzLm1hdC1kcmF3ZXItc2hvd25dPVwiX2lzU2hvd2luZ0JhY2tkcm9wKClcIj48L2Rpdj5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWRyYXdlclwiPjwvbmctY29udGVudD5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWRyYXdlci1jb250ZW50XCI+XG48L25nLWNvbnRlbnQ+XG48bWF0LWRyYXdlci1jb250ZW50ICpuZ0lmPVwiIV9jb250ZW50XCI+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvbWF0LWRyYXdlci1jb250ZW50PlxuIl19