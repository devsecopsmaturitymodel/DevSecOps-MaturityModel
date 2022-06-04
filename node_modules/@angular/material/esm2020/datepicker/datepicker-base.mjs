/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, FlexibleConnectedPositionStrategy, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef, Directive, } from '@angular/core';
import { DateAdapter, mixinColor } from '@angular/material/core';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { MatCalendar } from './calendar';
import { matDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateSelectionModel, DateRange, } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import { MatDatepickerIntl } from './datepicker-intl';
import * as i0 from "@angular/core";
import * as i1 from "./date-selection-model";
import * as i2 from "@angular/material/core";
import * as i3 from "./datepicker-intl";
import * as i4 from "./calendar";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/common";
import * as i8 from "@angular/cdk/portal";
import * as i9 from "@angular/cdk/overlay";
import * as i10 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy');
/** @docs-private */
export function MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MatDatepickerContent.
/** @docs-private */
const _MatDatepickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export class MatDatepickerContent extends _MatDatepickerContentBase {
    constructor(elementRef, _changeDetectorRef, _globalModel, _dateAdapter, _rangeSelectionStrategy, intl) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._globalModel = _globalModel;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        this._subscriptions = new Subscription();
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Portal with projected action buttons. */
        this._actionsPortal = null;
        this._closeButtonText = intl.closeCalendarLabel;
    }
    ngOnInit() {
        // If we have actions, clone the model so that we have the ability to cancel the selection,
        // otherwise update the global model directly. Note that we want to assign this as soon as
        // possible, but `_actionsPortal` isn't available in the constructor so we do it in `ngOnInit`.
        this._model = this._actionsPortal ? this._globalModel.clone() : this._globalModel;
        this._animationState = this.datepicker.touchUi ? 'enter-dialog' : 'enter-dropdown';
    }
    ngAfterViewInit() {
        this._subscriptions.add(this.datepicker.stateChanges.subscribe(() => {
            this._changeDetectorRef.markForCheck();
        }));
        this._calendar.focusActiveCell();
    }
    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        this._animationDone.complete();
    }
    _handleUserSelection(event) {
        const selection = this._model.selection;
        const value = event.value;
        const isRange = selection instanceof DateRange;
        // If we're selecting a range and we have a selection strategy, always pass the value through
        // there. Otherwise don't assign null values to the model, unless we're selecting a range.
        // A null value when picking a range means that the user cancelled the selection (e.g. by
        // pressing escape), whereas when selecting a single value it means that the value didn't
        // change. This isn't very intuitive, but it's here for backwards-compatibility.
        if (isRange && this._rangeSelectionStrategy) {
            const newSelection = this._rangeSelectionStrategy.selectionFinished(value, selection, event.event);
            this._model.updateSelection(newSelection, this);
        }
        else if (value &&
            (isRange || !this._dateAdapter.sameDate(value, selection))) {
            this._model.add(value);
        }
        // Delegate closing the overlay to the actions.
        if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
            this.datepicker.close();
        }
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    _getSelected() {
        return this._model.selection;
    }
    /** Applies the current pending selection to the global model. */
    _applyPendingSelection() {
        if (this._model !== this._globalModel) {
            this._globalModel.updateSelection(this._model.selection, this);
        }
    }
}
MatDatepickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.MatDateSelectionModel }, { token: i2.DateAdapter }, { token: MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }, { token: i3.MatDatepickerIntl }], target: i0.ɵɵFactoryTarget.Component });
MatDatepickerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatDatepickerContent, selector: "mat-datepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.done": "_animationDone.next()" }, properties: { "@transformPanel": "_animationState", "class.mat-datepicker-content-touch": "datepicker.touchUi" }, classAttribute: "mat-datepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: MatCalendar, descendants: true }], exportAs: ["matDatepickerContent"], usesInheritance: true, ngImport: i0, template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"], components: [{ type: i4.MatCalendar, selector: "mat-calendar", inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd"], outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection"], exportAs: ["matCalendar"] }, { type: i5.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i6.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i8.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-datepicker-content', host: {
                        'class': 'mat-datepicker-content',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.done)': '_animationDone.next()',
                        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    }, animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], exportAs: 'matDatepickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.MatDateSelectionModel }, { type: i2.DateAdapter }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_RANGE_SELECTION_STRATEGY]
                }] }, { type: i3.MatDatepickerIntl }]; }, propDecorators: { _calendar: [{
                type: ViewChild,
                args: [MatCalendar]
            }] } });
/** Base class for a datepicker. */
export class MatDatepickerBase {
    constructor(_overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _model) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._model = _model;
        this._inputStateChanges = Subscription.EMPTY;
        /** The view that the calendar should start in. */
        this.startView = 'month';
        this._touchUi = false;
        /** Preferred position of the datepicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the datepicker in the Y axis. */
        this.yPosition = 'below';
        this._restoreFocus = true;
        /**
         * Emits selected year in multiyear view.
         * This doesn't imply a change on the selected date.
         */
        this.yearSelected = new EventEmitter();
        /**
         * Emits selected month in year view.
         * This doesn't imply a change on the selected date.
         */
        this.monthSelected = new EventEmitter();
        /**
         * Emits when the current view changes.
         */
        this.viewChanged = new EventEmitter(true);
        /** Emits when the datepicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the datepicker has been closed. */
        this.closedStream = new EventEmitter();
        this._opened = false;
        /** The id for the datepicker calendar. */
        this.id = `mat-datepicker-${datepickerUid++}`;
        /** The element that was focused before the datepicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        /** Emits when the datepicker's state changes. */
        this.stateChanges = new Subject();
        if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._scrollStrategy = scrollStrategy;
    }
    /** The date to open the calendar to initially. */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this.datepickerInput ? this.datepickerInput.getStartValue() : null);
    }
    set startAt(value) {
        this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** Color palette to use on the datepicker's calendar. */
    get color() {
        return (this._color || (this.datepickerInput ? this.datepickerInput.getThemePalette() : undefined));
    }
    set color(value) {
        this._color = value;
    }
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a dropdown and elements have more padding to allow for bigger touch targets.
     */
    get touchUi() {
        return this._touchUi;
    }
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    /** Whether the datepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datepickerInput
            ? this.datepickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this.stateChanges.next(undefined);
        }
    }
    /**
     * Whether to restore focus to the previously-focused element when the calendar is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus() {
        return this._restoreFocus;
    }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
    }
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass() {
        return this._panelClass;
    }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** The minimum selectable date. */
    _getMinDate() {
        return this.datepickerInput && this.datepickerInput.min;
    }
    /** The maximum selectable date. */
    _getMaxDate() {
        return this.datepickerInput && this.datepickerInput.max;
    }
    _getDateFilter() {
        return this.datepickerInput && this.datepickerInput.dateFilter;
    }
    ngOnChanges(changes) {
        const positionChange = changes['xPosition'] || changes['yPosition'];
        if (positionChange && !positionChange.firstChange && this._overlayRef) {
            const positionStrategy = this._overlayRef.getConfig().positionStrategy;
            if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
                this._setConnectedPositions(positionStrategy);
                if (this.opened) {
                    this._overlayRef.updatePosition();
                }
            }
        }
        this.stateChanges.next(undefined);
    }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this.stateChanges.complete();
    }
    /** Selects the given date */
    select(date) {
        this._model.add(date);
    }
    /** Emits the selected year in multiyear view */
    _selectYear(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /** Emits selected month in year view */
    _selectMonth(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /** Emits changed view */
    _viewChanged(view) {
        this.viewChanged.emit(view);
    }
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     * @returns Selection model that the input should hook itself up to.
     */
    registerInput(input) {
        if (this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._inputStateChanges.unsubscribe();
        this.datepickerInput = input;
        this._inputStateChanges = input.stateChanges.subscribe(() => this.stateChanges.next(undefined));
        return this._model;
    }
    /**
     * Registers a portal containing action buttons with the datepicker.
     * @param portal Portal to be registered.
     */
    registerActions(portal) {
        if (this._actionsPortal && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('A MatDatepicker can only be associated with a single actions row.');
        }
        this._actionsPortal = portal;
    }
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal) {
        if (portal === this._actionsPortal) {
            this._actionsPortal = null;
        }
    }
    /** Open the calendar. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the calendar. */
    close() {
        if (!this._opened) {
            return;
        }
        if (this._componentRef) {
            const instance = this._componentRef.instance;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => this._destroyOverlay());
        }
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
                this._focusedElementBeforeOpen = null;
            }
        };
        if (this._restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /** Applies the current pending selection on the overlay to the model. */
    _applyPendingSelection() {
        this._componentRef?.instance?._applyPendingSelection();
    }
    /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
    _forwardContentValues(instance) {
        instance.datepicker = this;
        instance.color = this.color;
        instance._actionsPortal = this._actionsPortal;
        instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
    }
    /** Opens the overlay with the calendar. */
    _openOverlay() {
        this._destroyOverlay();
        const isDialog = this.touchUi;
        const portal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: [
                isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
                this._backdropHarnessClass,
            ],
            direction: this._dir,
            scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
            panelClass: `mat-datepicker-${isDialog ? 'dialog' : 'popup'}`,
        })));
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the calendar has rendered. Only relevant in dropdown mode.
        if (!isDialog) {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
        }
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDialogStrategy() {
        return this._overlay.position().global().centerHorizontally().centerVertically();
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mat-datepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
    _setConnectedPositions(strategy) {
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.datepickerInput && hasModifierKey(event, 'altKey') && event.keyCode === UP_ARROW));
        })));
    }
}
MatDatepickerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerBase, deps: [{ token: i9.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MAT_DATEPICKER_SCROLL_STRATEGY }, { token: i2.DateAdapter, optional: true }, { token: i10.Directionality, optional: true }, { token: i1.MatDateSelectionModel }], target: i0.ɵɵFactoryTarget.Directive });
MatDatepickerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatDatepickerBase, inputs: { calendarHeaderComponent: "calendarHeaderComponent", startAt: "startAt", startView: "startView", color: "color", touchUi: "touchUi", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus", dateClass: "dateClass", panelClass: "panelClass", opened: "opened" }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", viewChanged: "viewChanged", openedStream: "opened", closedStream: "closed" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i9.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DATEPICKER_SCROLL_STRATEGY]
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i10.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i1.MatDateSelectionModel }]; }, propDecorators: { calendarHeaderComponent: [{
                type: Input
            }], startAt: [{
                type: Input
            }], startView: [{
                type: Input
            }], color: [{
                type: Input
            }], touchUi: [{
                type: Input
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], dateClass: [{
                type: Input
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], panelClass: [{
                type: Input
            }], opened: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdGLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxFQUdiLGlDQUFpQyxHQUNsQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWdDLE1BQU0scUJBQXFCLENBQUM7QUFDbkYsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsU0FBUyxHQUlWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBVyxXQUFXLEVBQUUsVUFBVSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDdkYsT0FBTyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQWMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1B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RUFBRSxDQUFDLElBQUksQ0FDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2IsMEZBQTBGO1lBQzFGLE9BQU8sQ0FDTCxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRCxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUN4RixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7OEdBNWNtQixpQkFBaUIsK0ZBd0wzQiw4QkFBOEI7a0dBeExwQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEdEMsU0FBUzs7MEJBeUxMLE1BQU07MkJBQUMsOEJBQThCOzswQkFDckMsUUFBUTs7MEJBQ1IsUUFBUTtnRkFoTEYsdUJBQXVCO3NCQUEvQixLQUFLO2dCQUlGLE9BQU87c0JBRFYsS0FBSztnQkFZRyxTQUFTO3NCQUFqQixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSztnQkFnQkYsT0FBTztzQkFEVixLQUFLO2dCQVdGLFFBQVE7c0JBRFgsS0FBSztnQkFrQk4sU0FBUztzQkFEUixLQUFLO2dCQUtOLFNBQVM7c0JBRFIsS0FBSztnQkFTRixZQUFZO3NCQURmLEtBQUs7Z0JBYWEsWUFBWTtzQkFBOUIsTUFBTTtnQkFNWSxhQUFhO3NCQUEvQixNQUFNO2dCQUtZLFdBQVc7c0JBQTdCLE1BQU07Z0JBS0UsU0FBUztzQkFBakIsS0FBSztnQkFHcUIsWUFBWTtzQkFBdEMsTUFBTTt1QkFBQyxRQUFRO2dCQUdXLFlBQVk7c0JBQXRDLE1BQU07dUJBQUMsUUFBUTtnQkFPWixVQUFVO3NCQURiLEtBQUs7Z0JBV0YsTUFBTTtzQkFEVCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZVN0cmluZ0FycmF5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5LCBVUF9BUlJPV30gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBEYXRlQWRhcHRlciwgbWl4aW5Db2xvciwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIFN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb219IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdENhbGVuZGFyLCBNYXRDYWxlbmRhclZpZXd9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHttYXREYXRlcGlja2VyQW5pbWF0aW9uc30gZnJvbSAnLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge01hdENhbGVuZGFyVXNlckV2ZW50LCBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9ufSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7XG4gIEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sXG4gIE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgRGF0ZVJhbmdlLFxufSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSxcbiAgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRlcGlja2VyIGluc3RhbmNlLiAqL1xubGV0IGRhdGVwaWNrZXJVaWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtZGF0ZXBpY2tlci1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFggYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCcgfCAnZW5kJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFkgYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdERhdGVwaWNrZXJDb250ZW50LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXREYXRlcGlja2VyQ29udGVudEJhc2UgPSBtaXhpbkNvbG9yKFxuICBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICB9LFxuKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdXNlZCBhcyB0aGUgY29udGVudCBmb3IgdGhlIGRhdGVwaWNrZXIgb3ZlcmxheS4gV2UgdXNlIHRoaXMgaW5zdGVhZCBvZiB1c2luZ1xuICogTWF0Q2FsZW5kYXIgZGlyZWN0bHkgYXMgdGhlIGNvbnRlbnQgc28gd2UgY2FuIGNvbnRyb2wgdGhlIGluaXRpYWwgZm9jdXMuIFRoaXMgYWxzbyBnaXZlcyB1cyBhXG4gKiBwbGFjZSB0byBwdXQgYWRkaXRpb25hbCBmZWF0dXJlcyBvZiB0aGUgb3ZlcmxheSB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgY2FsZW5kYXIgaXRzZWxmIGluIHRoZVxuICogZnV0dXJlLiAoZS5nLiBjb25maXJtYXRpb24gYnV0dG9ucykuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGVwaWNrZXItY29udGVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGVwaWNrZXItY29udGVudC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZXBpY2tlci1jb250ZW50JyxcbiAgICAnW0B0cmFuc2Zvcm1QYW5lbF0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEB0cmFuc2Zvcm1QYW5lbC5kb25lKSc6ICdfYW5pbWF0aW9uRG9uZS5uZXh0KCknLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItY29udGVudC10b3VjaF0nOiAnZGF0ZXBpY2tlci50b3VjaFVpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdERhdGVwaWNrZXJBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsLCBtYXREYXRlcGlja2VyQW5pbWF0aW9ucy5mYWRlSW5DYWxlbmRhcl0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlckNvbnRlbnQnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBleHRlbmRzIF9NYXREYXRlcGlja2VyQ29udGVudEJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPjtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgY2FsZW5kYXIgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdENhbGVuZGFyKSBfY2FsZW5kYXI6IE1hdENhbGVuZGFyPEQ+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGRhdGVwaWNrZXIgdGhhdCBjcmVhdGVkIHRoZSBvdmVybGF5LiAqL1xuICBkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyQmFzZTxhbnksIFMsIEQ+O1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBjb21wYXJpc29uRW5kOiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpcyBhYm92ZSBvciBiZWxvdyB0aGUgaW5wdXQuICovXG4gIF9pc0Fib3ZlOiBib29sZWFuO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBhbmltYXRpb24uICovXG4gIF9hbmltYXRpb25TdGF0ZTogJ2VudGVyLWRyb3Bkb3duJyB8ICdlbnRlci1kaWFsb2cnIHwgJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuICovXG4gIHJlYWRvbmx5IF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGV4dCBmb3IgdGhlIGNsb3NlIGJ1dHRvbi4gKi9cbiAgX2Nsb3NlQnV0dG9uVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9zZSBidXR0b24gY3VycmVudGx5IGhhcyBmb2N1cy4gKi9cbiAgX2Nsb3NlQnV0dG9uRm9jdXNlZDogYm9vbGVhbjtcblxuICAvKiogUG9ydGFsIHdpdGggcHJvamVjdGVkIGFjdGlvbiBidXR0b25zLiAqL1xuICBfYWN0aW9uc1BvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsID0gbnVsbDtcblxuICAvKiogSWQgb2YgdGhlIGxhYmVsIGZvciB0aGUgYHJvbGU9XCJkaWFsb2dcImAgZWxlbWVudC4gKi9cbiAgX2RpYWxvZ0xhYmVsSWQ6IHN0cmluZyB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZ2xvYmFsTW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPixcbiAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSlcbiAgICBwcml2YXRlIF9yYW5nZVNlbGVjdGlvblN0cmF0ZWd5OiBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxEPixcbiAgICBpbnRsOiBNYXREYXRlcGlja2VySW50bCxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fY2xvc2VCdXR0b25UZXh0ID0gaW50bC5jbG9zZUNhbGVuZGFyTGFiZWw7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGFjdGlvbnMsIGNsb25lIHRoZSBtb2RlbCBzbyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gY2FuY2VsIHRoZSBzZWxlY3Rpb24sXG4gICAgLy8gb3RoZXJ3aXNlIHVwZGF0ZSB0aGUgZ2xvYmFsIG1vZGVsIGRpcmVjdGx5LiBOb3RlIHRoYXQgd2Ugd2FudCB0byBhc3NpZ24gdGhpcyBhcyBzb29uIGFzXG4gICAgLy8gcG9zc2libGUsIGJ1dCBgX2FjdGlvbnNQb3J0YWxgIGlzbid0IGF2YWlsYWJsZSBpbiB0aGUgY29uc3RydWN0b3Igc28gd2UgZG8gaXQgaW4gYG5nT25Jbml0YC5cbiAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2FjdGlvbnNQb3J0YWwgPyB0aGlzLl9nbG9iYWxNb2RlbC5jbG9uZSgpIDogdGhpcy5fZ2xvYmFsTW9kZWw7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmRhdGVwaWNrZXIudG91Y2hVaSA/ICdlbnRlci1kaWFsb2cnIDogJ2VudGVyLWRyb3Bkb3duJztcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuX2NhbGVuZGFyLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9oYW5kbGVVc2VyU2VsZWN0aW9uKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4pIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLl9tb2RlbC5zZWxlY3Rpb247XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICBjb25zdCBpc1JhbmdlID0gc2VsZWN0aW9uIGluc3RhbmNlb2YgRGF0ZVJhbmdlO1xuXG4gICAgLy8gSWYgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UgYW5kIHdlIGhhdmUgYSBzZWxlY3Rpb24gc3RyYXRlZ3ksIGFsd2F5cyBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAgLy8gdGhlcmUuIE90aGVyd2lzZSBkb24ndCBhc3NpZ24gbnVsbCB2YWx1ZXMgdG8gdGhlIG1vZGVsLCB1bmxlc3Mgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgLy8gQSBudWxsIHZhbHVlIHdoZW4gcGlja2luZyBhIHJhbmdlIG1lYW5zIHRoYXQgdGhlIHVzZXIgY2FuY2VsbGVkIHRoZSBzZWxlY3Rpb24gKGUuZy4gYnlcbiAgICAvLyBwcmVzc2luZyBlc2NhcGUpLCB3aGVyZWFzIHdoZW4gc2VsZWN0aW5nIGEgc2luZ2xlIHZhbHVlIGl0IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGRpZG4ndFxuICAgIC8vIGNoYW5nZS4gVGhpcyBpc24ndCB2ZXJ5IGludHVpdGl2ZSwgYnV0IGl0J3MgaGVyZSBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkuXG4gICAgaWYgKGlzUmFuZ2UgJiYgdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneSkge1xuICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneS5zZWxlY3Rpb25GaW5pc2hlZChcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHNlbGVjdGlvbiBhcyB1bmtub3duIGFzIERhdGVSYW5nZTxEPixcbiAgICAgICAgZXZlbnQuZXZlbnQsXG4gICAgICApO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKG5ld1NlbGVjdGlvbiBhcyB1bmtub3duIGFzIFMsIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB2YWx1ZSAmJlxuICAgICAgKGlzUmFuZ2UgfHwgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbHVlLCBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZWdhdGUgY2xvc2luZyB0aGUgb3ZlcmxheSB0byB0aGUgYWN0aW9ucy5cbiAgICBpZiAoKCF0aGlzLl9tb2RlbCB8fCB0aGlzLl9tb2RlbC5pc0NvbXBsZXRlKCkpICYmICF0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX2dldFNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbC5zZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEIHwgRGF0ZVJhbmdlPEQ+IHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHRoZSBjdXJyZW50IHBlbmRpbmcgc2VsZWN0aW9uIHRvIHRoZSBnbG9iYWwgbW9kZWwuICovXG4gIF9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsICE9PSB0aGlzLl9nbG9iYWxNb2RlbCkge1xuICAgICAgdGhpcy5fZ2xvYmFsTW9kZWwudXBkYXRlU2VsZWN0aW9uKHRoaXMuX21vZGVsLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIGdldE92ZXJsYXlMYWJlbElkKCk6IHN0cmluZyB8IG51bGw7XG4gIHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcbn1cblxuLyoqIEEgZGF0ZXBpY2tlciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBhIHtAbGluayBNYXREYXRlcGlja2VyQ29udHJvbH0uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVwaWNrZXJQYW5lbDxcbiAgQyBleHRlbmRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LFxuICBTLFxuICBEID0gRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPixcbj4ge1xuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGRhdGUgcGlja2VyIGlzIGNsb3NlZC4gKi9cbiAgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIC8qKiBDb2xvciBwYWxldHRlIHRvIHVzZSBvbiB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBjb2xvcjogVGhlbWVQYWxldHRlO1xuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRlcGlja2VySW5wdXQ6IEM7XG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVkOiBib29sZWFuO1xuICAvKiogVGhlIGlkIGZvciB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nO1xuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpcyBvcGVuLiAqL1xuICBvcGVuZWQ6IGJvb2xlYW47XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0ZSBwaWNrZXIgaXMgb3BlbmVkLiAqL1xuICBvcGVuZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD47XG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgb3BlbigpOiB2b2lkO1xuICAvKiogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGEgZGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdERhdGVwaWNrZXJCYXNlPFxuICBDIGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sXG4gIFMsXG4gIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+LFxuPiBpbXBsZW1lbnRzIE1hdERhdGVwaWNrZXJQYW5lbDxDLCBTLCBEPiwgT25EZXN0cm95LCBPbkNoYW5nZXNcbntcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF9pbnB1dFN0YXRlQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogQW4gaW5wdXQgaW5kaWNhdGluZyB0aGUgdHlwZSBvZiB0aGUgY3VzdG9tIGhlYWRlciBjb21wb25lbnQgZm9yIHRoZSBjYWxlbmRhciwgaWYgc2V0LiAqL1xuICBASW5wdXQoKSBjYWxlbmRhckhlYWRlckNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxhbnk+O1xuXG4gIC8qKiBUaGUgZGF0ZSB0byBvcGVuIHRoZSBjYWxlbmRhciB0byBpbml0aWFsbHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGFydEF0KCk6IEQgfCBudWxsIHtcbiAgICAvLyBJZiBhbiBleHBsaWNpdCBzdGFydEF0IGlzIHNldCB3ZSBzdGFydCB0aGVyZSwgb3RoZXJ3aXNlIHdlIHN0YXJ0IGF0IHdoYXRldmVyIHRoZSBjdXJyZW50bHlcbiAgICAvLyBzZWxlY3RlZCB2YWx1ZSBpcy5cbiAgICByZXR1cm4gdGhpcy5fc3RhcnRBdCB8fCAodGhpcy5kYXRlcGlja2VySW5wdXQgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRTdGFydFZhbHVlKCkgOiBudWxsKTtcbiAgfVxuICBzZXQgc3RhcnRBdCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RhcnRBdDogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSB2aWV3IHRoYXQgdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydCBpbi4gKi9cbiAgQElucHV0KCkgc3RhcnRWaWV3OiAnbW9udGgnIHwgJ3llYXInIHwgJ211bHRpLXllYXInID0gJ21vbnRoJztcblxuICAvKiogQ29sb3IgcGFsZXR0ZSB0byB1c2Ugb24gdGhlIGRhdGVwaWNrZXIncyBjYWxlbmRhci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2NvbG9yIHx8ICh0aGlzLmRhdGVwaWNrZXJJbnB1dCA/IHRoaXMuZGF0ZXBpY2tlcklucHV0LmdldFRoZW1lUGFsZXR0ZSgpIDogdW5kZWZpbmVkKVxuICAgICk7XG4gIH1cbiAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBVSSBpcyBpbiB0b3VjaCBtb2RlLiBJbiB0b3VjaCBtb2RlIHRoZSBjYWxlbmRhciBvcGVucyBpbiBhIGRpYWxvZyByYXRoZXJcbiAgICogdGhhbiBhIGRyb3Bkb3duIGFuZCBlbGVtZW50cyBoYXZlIG1vcmUgcGFkZGluZyB0byBhbGxvdyBmb3IgYmlnZ2VyIHRvdWNoIHRhcmdldHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdG91Y2hVaSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdG91Y2hVaTtcbiAgfVxuICBzZXQgdG91Y2hVaSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fdG91Y2hVaSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdG91Y2hVaSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dFxuICAgICAgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5kaXNhYmxlZFxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0ZXBpY2tlciBpbiB0aGUgWCBheGlzLiAqL1xuICBASW5wdXQoKVxuICB4UG9zaXRpb246IERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCc7XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0ZXBpY2tlciBpbiB0aGUgWSBheGlzLiAqL1xuICBASW5wdXQoKVxuICB5UG9zaXRpb246IERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdiZWxvdyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVzdG9yZSBmb2N1cyB0byB0aGUgcHJldmlvdXNseS1mb2N1c2VkIGVsZW1lbnQgd2hlbiB0aGUgY2FsZW5kYXIgaXMgY2xvc2VkLlxuICAgKiBOb3RlIHRoYXQgYXV0b21hdGljIGZvY3VzIHJlc3RvcmF0aW9uIGlzIGFuIGFjY2Vzc2liaWxpdHkgZmVhdHVyZSBhbmQgaXQgaXMgcmVjb21tZW5kZWQgdGhhdFxuICAgKiB5b3UgcHJvdmlkZSB5b3VyIG93biBlcXVpdmFsZW50LCBpZiB5b3UgZGVjaWRlIHRvIHR1cm4gaXQgb2ZmLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlc3RvcmVGb2N1cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzdG9yZUZvY3VzO1xuICB9XG4gIHNldCByZXN0b3JlRm9jdXModmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3Jlc3RvcmVGb2N1cyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzID0gdHJ1ZTtcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHllYXJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtb250aFNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnQgdmlldyBjaGFuZ2VzLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZpZXdDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PiA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PihcbiAgICB0cnVlLFxuICApO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIHJlYWRvbmx5IG9wZW5lZFN0cmVhbSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBjbG9zZWQuICovXG4gIEBPdXRwdXQoJ2Nsb3NlZCcpIHJlYWRvbmx5IGNsb3NlZFN0cmVhbSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIGRhdGUgcGlja2VyIHBhbmVsLlxuICAgKiBTdXBwb3J0cyBzdHJpbmcgYW5kIHN0cmluZyBhcnJheSB2YWx1ZXMsIHNpbWlsYXIgdG8gYG5nQ2xhc3NgLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhbmVsQ2xhc3MoKTogc3RyaW5nIHwgc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbENsYXNzO1xuICB9XG4gIHNldCBwYW5lbENsYXNzKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3BhbmVsQ2xhc3MgPSBjb2VyY2VTdHJpbmdBcnJheSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFuZWxDbGFzczogc3RyaW5nW107XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBvcGVuZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW5lZDtcbiAgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpID8gdGhpcy5vcGVuKCkgOiB0aGlzLmNsb3NlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3BlbmVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpZCBmb3IgdGhlIGRhdGVwaWNrZXIgY2FsZW5kYXIuICovXG4gIGlkOiBzdHJpbmcgPSBgbWF0LWRhdGVwaWNrZXItJHtkYXRlcGlja2VyVWlkKyt9YDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIF9nZXRNYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXQubWF4O1xuICB9XG5cbiAgX2dldERhdGVGaWx0ZXIoKTogRGF0ZUZpbHRlckZuPEQ+IHtcbiAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXQuZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIC8qKiBBIHJlZmVyZW5jZSB0byB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHdlJ3ZlIHJlbmRlcmVkIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlIHJlbmRlcmVkIGluIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9jb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPj4gfCBudWxsO1xuXG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXBpY2tlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBjbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIHNvIHRoYXQgdGhlIHRlc3QgaGFybmVzc2VzIGNhbiBsb29rIGl0IHVwLiAqL1xuICBwcml2YXRlIF9iYWNrZHJvcEhhcm5lc3NDbGFzcyA9IGAke3RoaXMuaWR9LWJhY2tkcm9wYDtcblxuICAvKiogQ3VycmVudGx5LXJlZ2lzdGVyZWQgYWN0aW9ucyBwb3J0YWwuICovXG4gIHByaXZhdGUgX2FjdGlvbnNQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbDtcblxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhpcyBkYXRlcGlja2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgZGF0ZXBpY2tlcklucHV0OiBDO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyJ3Mgc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPixcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwb3NpdGlvbkNoYW5nZSA9IGNoYW5nZXNbJ3hQb3NpdGlvbiddIHx8IGNoYW5nZXNbJ3lQb3NpdGlvbiddO1xuXG4gICAgaWYgKHBvc2l0aW9uQ2hhbmdlICYmICFwb3NpdGlvbkNoYW5nZS5maXJzdENoYW5nZSAmJiB0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheVJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5O1xuXG4gICAgICBpZiAocG9zaXRpb25TdHJhdGVneSBpbnN0YW5jZW9mIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgICAgICB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMocG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGdpdmVuIGRhdGUgKi9cbiAgc2VsZWN0KGRhdGU6IEQpOiB2b2lkIHtcbiAgICB0aGlzLl9tb2RlbC5hZGQoZGF0ZSk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIHNlbGVjdGVkIHllYXIgaW4gbXVsdGl5ZWFyIHZpZXcgKi9cbiAgX3NlbGVjdFllYXIobm9ybWFsaXplZFllYXI6IEQpOiB2b2lkIHtcbiAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRZZWFyKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXcgKi9cbiAgX3NlbGVjdE1vbnRoKG5vcm1hbGl6ZWRNb250aDogRCk6IHZvaWQge1xuICAgIHRoaXMubW9udGhTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRNb250aCk7XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlZCB2aWV3ICovXG4gIF92aWV3Q2hhbmdlZCh2aWV3OiBNYXRDYWxlbmRhclZpZXcpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdDaGFuZ2VkLmVtaXQodmlldyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGlzIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgZGF0ZXBpY2tlciBpbnB1dCB0byByZWdpc3RlciB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHJldHVybnMgU2VsZWN0aW9uIG1vZGVsIHRoYXQgdGhlIGlucHV0IHNob3VsZCBob29rIGl0c2VsZiB1cCB0by5cbiAgICovXG4gIHJlZ2lzdGVySW5wdXQoaW5wdXQ6IEMpOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4ge1xuICAgIGlmICh0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0EgTWF0RGF0ZXBpY2tlciBjYW4gb25seSBiZSBhc3NvY2lhdGVkIHdpdGggYSBzaW5nbGUgaW5wdXQuJyk7XG4gICAgfVxuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kYXRlcGlja2VySW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcyA9IGlucHV0LnN0YXRlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpKTtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcG9ydGFsIGNvbnRhaW5pbmcgYWN0aW9uIGJ1dHRvbnMgd2l0aCB0aGUgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyQWN0aW9ucyhwb3J0YWw6IFRlbXBsYXRlUG9ydGFsKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FjdGlvbnNQb3J0YWwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBIE1hdERhdGVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGFjdGlvbnMgcm93LicpO1xuICAgIH1cbiAgICB0aGlzLl9hY3Rpb25zUG9ydGFsID0gcG9ydGFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3J0YWwgY29udGFpbmluZyBhY3Rpb24gYnV0dG9ucyBmcm9tIHRoZSBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSByZW1vdmVkLlxuICAgKi9cbiAgcmVtb3ZlQWN0aW9ucyhwb3J0YWw6IFRlbXBsYXRlUG9ydGFsKTogdm9pZCB7XG4gICAgaWYgKHBvcnRhbCA9PT0gdGhpcy5fYWN0aW9uc1BvcnRhbCkge1xuICAgICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0ZWQgdG8gb3BlbiBhbiBNYXREYXRlcGlja2VyIHdpdGggbm8gYXNzb2NpYXRlZCBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICB0aGlzLl9vcGVuT3ZlcmxheSgpO1xuICAgIHRoaXMuX29wZW5lZCA9IHRydWU7XG4gICAgdGhpcy5vcGVuZWRTdHJlYW0uZW1pdCgpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBjYWxlbmRhci4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9vcGVuZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuX2NvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgIGluc3RhbmNlLl9zdGFydEV4aXRBbmltYXRpb24oKTtcbiAgICAgIGluc3RhbmNlLl9hbmltYXRpb25Eb25lLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkU3RyZWFtLmVtaXQoKTtcbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzICYmXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gJiZcbiAgICAgIHR5cGVvZiB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMgPT09ICdmdW5jdGlvbidcbiAgICApIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuLmZvY3VzKCk7XG4gICAgICBzZXRUaW1lb3V0KGNvbXBsZXRlQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZUNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFwcGxpZXMgdGhlIGN1cnJlbnQgcGVuZGluZyBzZWxlY3Rpb24gb24gdGhlIG92ZXJsYXkgdG8gdGhlIG1vZGVsLiAqL1xuICBfYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudFJlZj8uaW5zdGFuY2U/Ll9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKiBGb3J3YXJkcyByZWxldmFudCB2YWx1ZXMgZnJvbSB0aGUgZGF0ZXBpY2tlciB0byB0aGUgZGF0ZXBpY2tlciBjb250ZW50IGluc2lkZSB0aGUgb3ZlcmxheS4gKi9cbiAgcHJvdGVjdGVkIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4pIHtcbiAgICBpbnN0YW5jZS5kYXRlcGlja2VyID0gdGhpcztcbiAgICBpbnN0YW5jZS5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgaW5zdGFuY2UuX2FjdGlvbnNQb3J0YWwgPSB0aGlzLl9hY3Rpb25zUG9ydGFsO1xuICAgIGluc3RhbmNlLl9kaWFsb2dMYWJlbElkID0gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0T3ZlcmxheUxhYmVsSWQoKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgb3ZlcmxheSB3aXRoIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3Blbk92ZXJsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIGNvbnN0IGlzRGlhbG9nID0gdGhpcy50b3VjaFVpO1xuICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWw8TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+KFxuICAgICAgTWF0RGF0ZXBpY2tlckNvbnRlbnQsXG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICk7XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9ICh0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoXG4gICAgICBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IGlzRGlhbG9nID8gdGhpcy5fZ2V0RGlhbG9nU3RyYXRlZ3koKSA6IHRoaXMuX2dldERyb3Bkb3duU3RyYXRlZ3koKSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICAgIGJhY2tkcm9wQ2xhc3M6IFtcbiAgICAgICAgICBpc0RpYWxvZyA/ICdjZGstb3ZlcmxheS1kYXJrLWJhY2tkcm9wJyA6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICAgICAgdGhpcy5fYmFja2Ryb3BIYXJuZXNzQ2xhc3MsXG4gICAgICAgIF0sXG4gICAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogaXNEaWFsb2cgPyB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSA6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICAgIHBhbmVsQ2xhc3M6IGBtYXQtZGF0ZXBpY2tlci0ke2lzRGlhbG9nID8gJ2RpYWxvZycgOiAncG9wdXAnfWAsXG4gICAgICB9KSxcbiAgICApKTtcblxuICAgIHRoaXMuX2dldENsb3NlU3RyZWFtKG92ZXJsYXlSZWYpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IG92ZXJsYXlSZWYuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fY29tcG9uZW50UmVmLmluc3RhbmNlKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gb25jZSB0aGUgY2FsZW5kYXIgaGFzIHJlbmRlcmVkLiBPbmx5IHJlbGV2YW50IGluIGRyb3Bkb3duIG1vZGUuXG4gICAgaWYgKCFpc0RpYWxvZykge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IG92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBjdXJyZW50IG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lPdmVybGF5KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9jb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERpYWxvZ1N0cmF0ZWd5KCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwb3NpdGlvbiBzdHJhdGVneSB0aGF0IHdpbGwgb3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBkcm9wZG93bi4gKi9cbiAgcHJpdmF0ZSBfZ2V0RHJvcGRvd25TdHJhdGVneSgpIHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkpXG4gICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGVwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvZiB0aGUgZGF0ZXBpY2tlciBpbiBkcm9wZG93biBtb2RlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24uICovXG4gIHByaXZhdGUgX3NldENvbm5lY3RlZFBvc2l0aW9ucyhzdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgY29uc3QgcHJpbWFyeVggPSB0aGlzLnhQb3NpdGlvbiA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgY29uc3Qgc2Vjb25kYXJ5WCA9IHByaW1hcnlYID09PSAnc3RhcnQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHByaW1hcnlZID0gdGhpcy55UG9zaXRpb24gPT09ICdhYm92ZScgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIGNvbnN0IHNlY29uZGFyeVkgPSBwcmltYXJ5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuXG4gICAgcmV0dXJuIHN0cmF0ZWd5LndpdGhQb3NpdGlvbnMoW1xuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHByaW1hcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBzZWNvbmRhcnlYLFxuICAgICAgICBvcmlnaW5ZOiBzZWNvbmRhcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogc2Vjb25kYXJ5WSxcbiAgICAgIH0sXG4gICAgXSk7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgd2lsbCBlbWl0IHdoZW4gdGhlIG92ZXJsYXkgaXMgc3VwcG9zZWQgdG8gYmUgY2xvc2VkLiAqL1xuICBwcml2YXRlIF9nZXRDbG9zZVN0cmVhbShvdmVybGF5UmVmOiBPdmVybGF5UmVmKSB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICBvdmVybGF5UmVmLmRldGFjaG1lbnRzKCksXG4gICAgICBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAgIC8vIENsb3Npbmcgb24gYWx0ICsgdXAgaXMgb25seSB2YWxpZCB3aGVuIHRoZXJlJ3MgYW4gaW5wdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlcGlja2VyLlxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHx8XG4gICAgICAgICAgICAodGhpcy5kYXRlcGlja2VySW5wdXQgJiYgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdhbHRLZXknKSAmJiBldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVylcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdlxuICBjZGtUcmFwRm9jdXNcbiAgcm9sZT1cImRpYWxvZ1wiXG4gIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiXG4gIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZGlhbG9nTGFiZWxJZCA/PyB1bmRlZmluZWRcIlxuICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyXCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtY3VzdG9tLWhlYWRlcl09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtYWN0aW9uc109XCJfYWN0aW9uc1BvcnRhbFwiPlxuICA8bWF0LWNhbGVuZGFyXG4gICAgW2lkXT1cImRhdGVwaWNrZXIuaWRcIlxuICAgIFtuZ0NsYXNzXT1cImRhdGVwaWNrZXIucGFuZWxDbGFzc1wiXG4gICAgW3N0YXJ0QXRdPVwiZGF0ZXBpY2tlci5zdGFydEF0XCJcbiAgICBbc3RhcnRWaWV3XT1cImRhdGVwaWNrZXIuc3RhcnRWaWV3XCJcbiAgICBbbWluRGF0ZV09XCJkYXRlcGlja2VyLl9nZXRNaW5EYXRlKClcIlxuICAgIFttYXhEYXRlXT1cImRhdGVwaWNrZXIuX2dldE1heERhdGUoKVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZXBpY2tlci5fZ2V0RGF0ZUZpbHRlcigpXCJcbiAgICBbaGVhZGVyQ29tcG9uZW50XT1cImRhdGVwaWNrZXIuY2FsZW5kYXJIZWFkZXJDb21wb25lbnRcIlxuICAgIFtzZWxlY3RlZF09XCJfZ2V0U2VsZWN0ZWQoKVwiXG4gICAgW2RhdGVDbGFzc109XCJkYXRlcGlja2VyLmRhdGVDbGFzc1wiXG4gICAgW2NvbXBhcmlzb25TdGFydF09XCJjb21wYXJpc29uU3RhcnRcIlxuICAgIFtjb21wYXJpc29uRW5kXT1cImNvbXBhcmlzb25FbmRcIlxuICAgIFtAZmFkZUluQ2FsZW5kYXJdPVwiJ2VudGVyJ1wiXG4gICAgKHllYXJTZWxlY3RlZCk9XCJkYXRlcGlja2VyLl9zZWxlY3RZZWFyKCRldmVudClcIlxuICAgIChtb250aFNlbGVjdGVkKT1cImRhdGVwaWNrZXIuX3NlbGVjdE1vbnRoKCRldmVudClcIlxuICAgICh2aWV3Q2hhbmdlZCk9XCJkYXRlcGlja2VyLl92aWV3Q2hhbmdlZCgkZXZlbnQpXCJcbiAgICAoX3VzZXJTZWxlY3Rpb24pPVwiX2hhbmRsZVVzZXJTZWxlY3Rpb24oJGV2ZW50KVwiPjwvbWF0LWNhbGVuZGFyPlxuXG4gIDxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cIl9hY3Rpb25zUG9ydGFsXCI+PC9uZy10ZW1wbGF0ZT5cblxuICA8IS0tIEludmlzaWJsZSBjbG9zZSBidXR0b24gZm9yIHNjcmVlbiByZWFkZXIgdXNlcnMuIC0tPlxuICA8YnV0dG9uXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgbWF0LXJhaXNlZC1idXR0b25cbiAgICBbY29sb3JdPVwiY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNsb3NlLWJ1dHRvblwiXG4gICAgW2NsYXNzLmNkay12aXN1YWxseS1oaWRkZW5dPVwiIV9jbG9zZUJ1dHRvbkZvY3VzZWRcIlxuICAgIChmb2N1cyk9XCJfY2xvc2VCdXR0b25Gb2N1c2VkID0gdHJ1ZVwiXG4gICAgKGJsdXIpPVwiX2Nsb3NlQnV0dG9uRm9jdXNlZCA9IGZhbHNlXCJcbiAgICAoY2xpY2spPVwiZGF0ZXBpY2tlci5jbG9zZSgpXCI+e3sgX2Nsb3NlQnV0dG9uVGV4dCB9fTwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=