/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { merge } from 'rxjs';
import { MatSort } from './sort';
import { matSortAnimations } from './sort-animations';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { MatSortHeaderIntl } from './sort-header-intl';
import * as i0 from "@angular/core";
import * as i1 from "./sort-header-intl";
import * as i2 from "./sort";
import * as i3 from "@angular/cdk/a11y";
import * as i4 from "@angular/common";
// Boilerplate for applying mixins to the sort header.
/** @docs-private */
const _MatSortHeaderBase = mixinDisabled(class {
});
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export class MatSortHeader extends _MatSortHeaderBase {
    constructor(
    /**
     * @deprecated `_intl` parameter isn't being used anymore and it'll be removed.
     * @breaking-change 13.0.0
     */
    _intl, _changeDetectorRef, 
    // `MatSort` is not optionally injected, but just asserted manually w/ better error.
    // tslint:disable-next-line: lightweight-tokens
    _sort, _columnDef, _focusMonitor, _elementRef, 
    /** @breaking-change 14.0.0 _ariaDescriber will be required. */
    _ariaDescriber) {
        // Note that we use a string token for the `_columnDef`, because the value is provided both by
        // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
        // and we want to avoid having the sort header depending on the CDK table because
        // of this single reference.
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._sort = _sort;
        this._columnDef = _columnDef;
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        /**
         * Flag set to true when the indicator should be displayed while the sort is not active. Used to
         * provide an affordance that the header is sortable by showing on focus and hover.
         */
        this._showIndicatorHint = false;
        /**
         * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
         * position through the animation. If animations are currently disabled, the fromState is removed
         * so that there is no animation displayed.
         */
        this._viewState = {};
        /** The direction the arrow should be facing according to the current state. */
        this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        this._disableViewStateAnimation = false;
        /** Sets the position of the arrow that displays when sorted. */
        this.arrowPosition = 'after';
        // Default the action description to "Sort" because it's better than nothing.
        // Without a description, the button's label comes from the sort header text content,
        // which doesn't give any indication that it performs a sorting operation.
        this._sortActionDescription = 'Sort';
        if (!_sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._handleStateChanges();
    }
    /**
     * Description applied to MatSortHeader's button element with aria-describedby. This text should
     * describe the action that will occur when the user clicks the sort header.
     */
    get sortActionDescription() {
        return this._sortActionDescription;
    }
    set sortActionDescription(value) {
        this._updateSortActionDescription(value);
    }
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    get disableClear() {
        return this._disableClear;
    }
    set disableClear(v) {
        this._disableClear = coerceBooleanProperty(v);
    }
    ngOnInit() {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({
            toState: this._isSorted() ? 'active' : this._arrowDirection,
        });
        this._sort.register(this);
        this._sortButton = this._elementRef.nativeElement.querySelector('.mat-sort-header-container');
        this._updateSortActionDescription(this._sortActionDescription);
    }
    ngAfterViewInit() {
        // We use the focus monitor because we also want to style
        // things differently based on the focus origin.
        this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
            const newState = !!origin;
            if (newState !== this._showIndicatorHint) {
                this._setIndicatorHintVisible(newState);
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
     * user showing what the active sort will become. If set to false, the arrow will fade away.
     */
    _setIndicatorHintVisible(visible) {
        // No-op if the sort header is disabled - should not make the hint visible.
        if (this._isDisabled() && visible) {
            return;
        }
        this._showIndicatorHint = visible;
        if (!this._isSorted()) {
            this._updateArrowDirection();
            if (this._showIndicatorHint) {
                this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'hint' });
            }
            else {
                this._setAnimationTransitionState({ fromState: 'hint', toState: this._arrowDirection });
            }
        }
    }
    /**
     * Sets the animation transition view state for the arrow's position and opacity. If the
     * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
     * no animation appears.
     */
    _setAnimationTransitionState(viewState) {
        this._viewState = viewState || {};
        // If the animation for arrow position state (opacity/translation) should be disabled,
        // remove the fromState so that it jumps right to the toState.
        if (this._disableViewStateAnimation) {
            this._viewState = { toState: viewState.toState };
        }
    }
    /** Triggers the sort on this sort header and removes the indicator hint. */
    _toggleOnInteraction() {
        this._sort.sort(this);
        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
    }
    _handleClick() {
        if (!this._isDisabled()) {
            this._sort.sort(this);
        }
    }
    _handleKeydown(event) {
        if (!this._isDisabled() && (event.keyCode === SPACE || event.keyCode === ENTER)) {
            event.preventDefault();
            this._toggleOnInteraction();
        }
    }
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted() {
        return (this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc'));
    }
    /** Returns the animation state for the arrow direction (indicator and pointers). */
    _getArrowDirectionState() {
        return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
    }
    /** Returns the arrow position state (opacity, translation). */
    _getArrowViewState() {
        const fromState = this._viewState.fromState;
        return (fromState ? `${fromState}-to-` : '') + this._viewState.toState;
    }
    /**
     * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
     * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
     * active sorted direction. The reason this is updated through a function is because the direction
     * should only be changed at specific times - when deactivated but the hint is displayed and when
     * the sort is active and the direction changes. Otherwise the arrow's direction should linger
     * in cases such as the sort becoming deactivated but we want to animate the arrow away while
     * preserving its direction, even though the next sort direction is actually different and should
     * only be changed once the arrow displays again (hint or activation).
     */
    _updateArrowDirection() {
        this._arrowDirection = this._isSorted() ? this._sort.direction : this.start || this._sort.start;
    }
    _isDisabled() {
        return this._sort.disabled || this.disabled;
    }
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    _getAriaSortAttribute() {
        if (!this._isSorted()) {
            return 'none';
        }
        return this._sort.direction == 'asc' ? 'ascending' : 'descending';
    }
    /** Whether the arrow inside the sort header should be rendered. */
    _renderArrow() {
        return !this._isDisabled() || this._isSorted();
    }
    _updateSortActionDescription(newDescription) {
        // We use AriaDescriber for the sort button instead of setting an `aria-label` because some
        // screen readers (notably VoiceOver) will read both the column header *and* the button's label
        // for every *cell* in the table, creating a lot of unnecessary noise.
        // If _sortButton is undefined, the component hasn't been initialized yet so there's
        // nothing to update in the DOM.
        if (this._sortButton) {
            // removeDescription will no-op if there is no existing message.
            // TODO(jelbourn): remove optional chaining when AriaDescriber is required.
            this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
            this._ariaDescriber?.describe(this._sortButton, newDescription);
        }
        this._sortActionDescription = newDescription;
    }
    /** Handles changes in the sorting state. */
    _handleStateChanges() {
        this._rerenderSubscription = merge(this._sort.sortChange, this._sort._stateChanges, this._intl.changes).subscribe(() => {
            if (this._isSorted()) {
                this._updateArrowDirection();
                // Do not show the animation if the header was already shown in the right position.
                if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
                    this._disableViewStateAnimation = true;
                }
                this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'active' });
                this._showIndicatorHint = false;
            }
            // If this header was recently active and now no longer sorted, animate away the arrow.
            if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
                this._disableViewStateAnimation = false;
                this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
            }
            this._changeDetectorRef.markForCheck();
        });
    }
}
MatSortHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortHeader, deps: [{ token: i1.MatSortHeaderIntl }, { token: i0.ChangeDetectorRef }, { token: i2.MatSort, optional: true }, { token: 'MAT_SORT_HEADER_COLUMN_DEF', optional: true }, { token: i3.FocusMonitor }, { token: i0.ElementRef }, { token: i3.AriaDescriber, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSortHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatSortHeader, selector: "[mat-sort-header]", inputs: { disabled: "disabled", id: ["mat-sort-header", "id"], arrowPosition: "arrowPosition", start: "start", sortActionDescription: "sortActionDescription", disableClear: "disableClear" }, host: { listeners: { "click": "_handleClick()", "keydown": "_handleKeydown($event)", "mouseenter": "_setIndicatorHintVisible(true)", "mouseleave": "_setIndicatorHintVisible(false)" }, properties: { "attr.aria-sort": "_getAriaSortAttribute()", "class.mat-sort-header-disabled": "_isDisabled()" }, classAttribute: "mat-sort-header" }, exportAs: ["matSortHeader"], usesInheritance: true, ngImport: i0, template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n", styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], animations: [
        matSortAnimations.indicator,
        matSortAnimations.leftPointer,
        matSortAnimations.rightPointer,
        matSortAnimations.arrowOpacity,
        matSortAnimations.arrowPosition,
        matSortAnimations.allowChildren,
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortHeader, decorators: [{
            type: Component,
            args: [{ selector: '[mat-sort-header]', exportAs: 'matSortHeader', host: {
                        'class': 'mat-sort-header',
                        '(click)': '_handleClick()',
                        '(keydown)': '_handleKeydown($event)',
                        '(mouseenter)': '_setIndicatorHintVisible(true)',
                        '(mouseleave)': '_setIndicatorHintVisible(false)',
                        '[attr.aria-sort]': '_getAriaSortAttribute()',
                        '[class.mat-sort-header-disabled]': '_isDisabled()',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], animations: [
                        matSortAnimations.indicator,
                        matSortAnimations.leftPointer,
                        matSortAnimations.rightPointer,
                        matSortAnimations.arrowOpacity,
                        matSortAnimations.arrowPosition,
                        matSortAnimations.allowChildren,
                    ], template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       *ngIf=\"_renderArrow()\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>\n", styles: [".mat-sort-header-container{display:flex;cursor:pointer;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-content{text-align:center;display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;position:relative;display:flex;opacity:0}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.cdk-high-contrast-active .mat-sort-header-stem{width:0;border-left:solid 2px}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.cdk-high-contrast-active .mat-sort-header-pointer-middle{width:0;height:0;border-top:solid 2px;border-left:solid 2px}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.cdk-high-contrast-active .mat-sort-header-pointer-left,.cdk-high-contrast-active .mat-sort-header-pointer-right{width:0;height:0;border-left:solid 6px;border-top:solid 2px}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatSortHeaderIntl }, { type: i0.ChangeDetectorRef }, { type: i2.MatSort, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: ['MAT_SORT_HEADER_COLUMN_DEF']
                }, {
                    type: Optional
                }] }, { type: i3.FocusMonitor }, { type: i0.ElementRef }, { type: i3.AriaDescriber, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { id: [{
                type: Input,
                args: ['mat-sort-header']
            }], arrowPosition: [{
                type: Input
            }], start: [{
                type: Input
            }], sortActionDescription: [{
                type: Input
            }], disableClear: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zb3J0L3NvcnQtaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsS0FBSyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsT0FBTyxFQUFDLHdDQUF3QyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7QUFFckQsc0RBQXNEO0FBQ3RELG9CQUFvQjtBQUNwQixNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQTJCbkQ7Ozs7Ozs7O0dBUUc7QUEyQkgsTUFBTSxPQUFPLGFBQ1gsU0FBUSxrQkFBa0I7SUFzRTFCO0lBQ0U7OztPQUdHO0lBQ0ksS0FBd0IsRUFDdkIsa0JB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LFlBQVk7d0JBQzlCLGlCQUFpQixDQUFDLGFBQWE7d0JBQy9CLGlCQUFpQixDQUFDLGFBQWE7cUJBQ2hDOzswQkFrRkUsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyw0QkFBNEI7OzBCQUNuQyxRQUFROzswQkFLUixRQUFROzRDQWxEZSxFQUFFO3NCQUEzQixLQUFLO3VCQUFDLGlCQUFpQjtnQkFHZixhQUFhO3NCQUFyQixLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFPRixxQkFBcUI7c0JBRHhCLEtBQUs7Z0JBY0YsWUFBWTtzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXJpYURlc2NyaWJlciwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIG1peGluRGlzYWJsZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0U29ydCwgTWF0U29ydGFibGV9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge21hdFNvcnRBbmltYXRpb25zfSBmcm9tICcuL3NvcnQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1NvcnREaXJlY3Rpb259IGZyb20gJy4vc29ydC1kaXJlY3Rpb24nO1xuaW1wb3J0IHtnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yfSBmcm9tICcuL3NvcnQtZXJyb3JzJztcbmltcG9ydCB7TWF0U29ydEhlYWRlckludGx9IGZyb20gJy4vc29ydC1oZWFkZXItaW50bCc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gdGhlIHNvcnQgaGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRTb3J0SGVhZGVyQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vKipcbiAqIFZhbGlkIHBvc2l0aW9ucyBmb3IgdGhlIGFycm93IHRvIGJlIGluIGZvciBpdHMgb3BhY2l0eSBhbmQgdHJhbnNsYXRpb24uIElmIHRoZSBzdGF0ZSBpcyBhXG4gKiBzb3J0IGRpcmVjdGlvbiwgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB3aWxsIGJlIGFib3ZlL2JlbG93IGFuZCBvcGFjaXR5IDAuIElmIHRoZSBzdGF0ZSBpc1xuICogaGludCwgdGhlIGFycm93IHdpbGwgYmUgaW4gdGhlIGNlbnRlciB3aXRoIGEgc2xpZ2h0IG9wYWNpdHkuIEFjdGl2ZSBzdGF0ZSBtZWFucyB0aGUgYXJyb3cgd2lsbFxuICogYmUgZnVsbHkgb3BhcXVlIGluIHRoZSBjZW50ZXIuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBBcnJvd1ZpZXdTdGF0ZSA9IFNvcnREaXJlY3Rpb24gfCAnaGludCcgfCAnYWN0aXZlJztcblxuLyoqXG4gKiBTdGF0ZXMgZGVzY3JpYmluZyB0aGUgYXJyb3cncyBhbmltYXRlZCBwb3NpdGlvbiAoYW5pbWF0aW5nIGZyb21TdGF0ZSB0byB0b1N0YXRlKS5cbiAqIElmIHRoZSBmcm9tU3RhdGUgaXMgbm90IGRlZmluZWQsIHRoZXJlIHdpbGwgYmUgbm8gYW5pbWF0ZWQgdHJhbnNpdGlvbiB0byB0aGUgdG9TdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24ge1xuICBmcm9tU3RhdGU/OiBBcnJvd1ZpZXdTdGF0ZTtcbiAgdG9TdGF0ZT86IEFycm93Vmlld1N0YXRlO1xufVxuXG4vKiogQ29sdW1uIGRlZmluaXRpb24gYXNzb2NpYXRlZCB3aXRoIGEgYE1hdFNvcnRIZWFkZXJgLiAqL1xuaW50ZXJmYWNlIE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQXBwbGllcyBzb3J0aW5nIGJlaGF2aW9yIChjbGljayB0byBjaGFuZ2Ugc29ydCkgYW5kIHN0eWxlcyB0byBhbiBlbGVtZW50LCBpbmNsdWRpbmcgYW5cbiAqIGFycm93IHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgc29ydCBkaXJlY3Rpb24uXG4gKlxuICogTXVzdCBiZSBwcm92aWRlZCB3aXRoIGFuIGlkIGFuZCBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IE1hdFNvcnQgZGlyZWN0aXZlLlxuICpcbiAqIElmIHVzZWQgb24gaGVhZGVyIGNlbGxzIGluIGEgQ2RrVGFibGUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkZWZhdWx0IGl0cyBpZCBmcm9tIGl0cyBjb250YWluaW5nXG4gKiBjb2x1bW4gZGVmaW5pdGlvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC1zb3J0LWhlYWRlcl0nLFxuICBleHBvcnRBczogJ21hdFNvcnRIZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NvcnQtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc29ydC1oZWFkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNvcnQtaGVhZGVyJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUoZmFsc2UpJyxcbiAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc29ydC1oZWFkZXItZGlzYWJsZWRdJzogJ19pc0Rpc2FibGVkKCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5pbmRpY2F0b3IsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMubGVmdFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMucmlnaHRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93T3BhY2l0eSxcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd1Bvc2l0aW9uLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFsbG93Q2hpbGRyZW4sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNvcnRIZWFkZXJcbiAgZXh0ZW5kcyBfTWF0U29ydEhlYWRlckJhc2VcbiAgaW1wbGVtZW50cyBDYW5EaXNhYmxlLCBNYXRTb3J0YWJsZSwgT25EZXN0cm95LCBPbkluaXQsIEFmdGVyVmlld0luaXRcbntcbiAgcHJpdmF0ZSBfcmVyZW5kZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgd2l0aCByb2xlPVwiYnV0dG9uXCIgaW5zaWRlIHRoaXMgY29tcG9uZW50J3Mgdmlldy4gV2UgbmVlZCB0aGlzXG4gICAqIGluIG9yZGVyIHRvIGFwcGx5IGEgZGVzY3JpcHRpb24gd2l0aCBBcmlhRGVzY3JpYmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfc29ydEJ1dHRvbjogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEZsYWcgc2V0IHRvIHRydWUgd2hlbiB0aGUgaW5kaWNhdG9yIHNob3VsZCBiZSBkaXNwbGF5ZWQgd2hpbGUgdGhlIHNvcnQgaXMgbm90IGFjdGl2ZS4gVXNlZCB0b1xuICAgKiBwcm92aWRlIGFuIGFmZm9yZGFuY2UgdGhhdCB0aGUgaGVhZGVyIGlzIHNvcnRhYmxlIGJ5IHNob3dpbmcgb24gZm9jdXMgYW5kIGhvdmVyLlxuICAgKi9cbiAgX3Nob3dJbmRpY2F0b3JIaW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3IHRyYW5zaXRpb24gc3RhdGUgb2YgdGhlIGFycm93ICh0cmFuc2xhdGlvbi8gb3BhY2l0eSkgLSBpbmRpY2F0ZXMgaXRzIGBmcm9tYCBhbmQgYHRvYFxuICAgKiBwb3NpdGlvbiB0aHJvdWdoIHRoZSBhbmltYXRpb24uIElmIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBkaXNhYmxlZCwgdGhlIGZyb21TdGF0ZSBpcyByZW1vdmVkXG4gICAqIHNvIHRoYXQgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIGRpc3BsYXllZC5cbiAgICovXG4gIF92aWV3U3RhdGU6IEFycm93Vmlld1N0YXRlVHJhbnNpdGlvbiA9IHt9O1xuXG4gIC8qKiBUaGUgZGlyZWN0aW9uIHRoZSBhcnJvdyBzaG91bGQgYmUgZmFjaW5nIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS4gKi9cbiAgX2Fycm93RGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHZpZXcgc3RhdGUgYW5pbWF0aW9uIHNob3VsZCBzaG93IHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gdGhlIGBmcm9tYCBhbmQgYHRvYCBzdGF0ZXMuXG4gICAqL1xuICBfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGlzIHNvcnQgaGVhZGVyLiBJZiB1c2VkIHdpdGhpbiB0aGUgY29udGV4dCBvZiBhIENka0NvbHVtbkRlZiwgdGhpcyB3aWxsIGRlZmF1bHQgdG9cbiAgICogdGhlIGNvbHVtbidzIG5hbWUuXG4gICAqL1xuICBASW5wdXQoJ21hdC1zb3J0LWhlYWRlcicpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aGF0IGRpc3BsYXlzIHdoZW4gc29ydGVkLiAqL1xuICBASW5wdXQoKSBhcnJvd1Bvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIHNvcnQgc3RhcnQgdmFsdWUgb2YgdGhlIGNvbnRhaW5pbmcgTWF0U29ydCBmb3IgdGhpcyBNYXRTb3J0YWJsZS4gKi9cbiAgQElucHV0KCkgc3RhcnQ6IFNvcnREaXJlY3Rpb247XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIGFwcGxpZWQgdG8gTWF0U29ydEhlYWRlcidzIGJ1dHRvbiBlbGVtZW50IHdpdGggYXJpYS1kZXNjcmliZWRieS4gVGhpcyB0ZXh0IHNob3VsZFxuICAgKiBkZXNjcmliZSB0aGUgYWN0aW9uIHRoYXQgd2lsbCBvY2N1ciB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgc29ydCBoZWFkZXIuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgc29ydEFjdGlvbkRlc2NyaXB0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRBY3Rpb25EZXNjcmlwdGlvbjtcbiAgfVxuICBzZXQgc29ydEFjdGlvbkRlc2NyaXB0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cGRhdGVTb3J0QWN0aW9uRGVzY3JpcHRpb24odmFsdWUpO1xuICB9XG4gIC8vIERlZmF1bHQgdGhlIGFjdGlvbiBkZXNjcmlwdGlvbiB0byBcIlNvcnRcIiBiZWNhdXNlIGl0J3MgYmV0dGVyIHRoYW4gbm90aGluZy5cbiAgLy8gV2l0aG91dCBhIGRlc2NyaXB0aW9uLCB0aGUgYnV0dG9uJ3MgbGFiZWwgY29tZXMgZnJvbSB0aGUgc29ydCBoZWFkZXIgdGV4dCBjb250ZW50LFxuICAvLyB3aGljaCBkb2Vzbid0IGdpdmUgYW55IGluZGljYXRpb24gdGhhdCBpdCBwZXJmb3JtcyBhIHNvcnRpbmcgb3BlcmF0aW9uLlxuICBwcml2YXRlIF9zb3J0QWN0aW9uRGVzY3JpcHRpb246IHN0cmluZyA9ICdTb3J0JztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBkaXNhYmxlIGNsZWFyIHZhbHVlIG9mIHRoZSBjb250YWluaW5nIE1hdFNvcnQgZm9yIHRoaXMgTWF0U29ydGFibGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQ2xlYXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbGVhcjtcbiAgfVxuICBzZXQgZGlzYWJsZUNsZWFyKHY6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVDbGVhciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xlYXI6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9pbnRsYCBwYXJhbWV0ZXIgaXNuJ3QgYmVpbmcgdXNlZCBhbnltb3JlIGFuZCBpdCdsbCBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wXG4gICAgICovXG4gICAgcHVibGljIF9pbnRsOiBNYXRTb3J0SGVhZGVySW50bCxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLy8gYE1hdFNvcnRgIGlzIG5vdCBvcHRpb25hbGx5IGluamVjdGVkLCBidXQganVzdCBhc3NlcnRlZCBtYW51YWxseSB3LyBiZXR0ZXIgZXJyb3IuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3NvcnQ6IE1hdFNvcnQsXG4gICAgQEluamVjdCgnTUFUX1NPUlRfSEVBREVSX0NPTFVNTl9ERUYnKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHVibGljIF9jb2x1bW5EZWY6IE1hdFNvcnRIZWFkZXJDb2x1bW5EZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIF9hcmlhRGVzY3JpYmVyIHdpbGwgYmUgcmVxdWlyZWQuICovXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcj86IEFyaWFEZXNjcmliZXIgfCBudWxsLFxuICApIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgdXNlIGEgc3RyaW5nIHRva2VuIGZvciB0aGUgYF9jb2x1bW5EZWZgLCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyBwcm92aWRlZCBib3RoIGJ5XG4gICAgLy8gYG1hdGVyaWFsL3RhYmxlYCBhbmQgYGNkay90YWJsZWAgYW5kIHdlIGNhbid0IGhhdmUgdGhlIENESyBkZXBlbmRpbmcgb24gTWF0ZXJpYWwsXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nIHRoZSBzb3J0IGhlYWRlciBkZXBlbmRpbmcgb24gdGhlIENESyB0YWJsZSBiZWNhdXNlXG4gICAgLy8gb2YgdGhpcyBzaW5nbGUgcmVmZXJlbmNlLlxuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIV9zb3J0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRTb3J0SGVhZGVyTm90Q29udGFpbmVkV2l0aGluU29ydEVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlU3RhdGVDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaWQgJiYgdGhpcy5fY29sdW1uRGVmKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5fY29sdW1uRGVmLm5hbWU7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBhcnJvdyBhbmQgc2V0IHRoZSB2aWV3IHN0YXRlIHRvIGJlIGltbWVkaWF0ZWx5IHRoYXQgc3RhdGUuXG4gICAgdGhpcy5fdXBkYXRlQXJyb3dEaXJlY3Rpb24oKTtcbiAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe1xuICAgICAgdG9TdGF0ZTogdGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUnIDogdGhpcy5fYXJyb3dEaXJlY3Rpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zb3J0LnJlZ2lzdGVyKHRoaXMpO1xuXG4gICAgdGhpcy5fc29ydEJ1dHRvbiA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWF0LXNvcnQtaGVhZGVyLWNvbnRhaW5lcicpITtcbiAgICB0aGlzLl91cGRhdGVTb3J0QWN0aW9uRGVzY3JpcHRpb24odGhpcy5fc29ydEFjdGlvbkRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBXZSB1c2UgdGhlIGZvY3VzIG1vbml0b3IgYmVjYXVzZSB3ZSBhbHNvIHdhbnQgdG8gc3R5bGVcbiAgICAvLyB0aGluZ3MgZGlmZmVyZW50bHkgYmFzZWQgb24gdGhlIGZvY3VzIG9yaWdpbi5cbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gISFvcmlnaW47XG4gICAgICBpZiAobmV3U3RhdGUgIT09IHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50KSB7XG4gICAgICAgIHRoaXMuX3NldEluZGljYXRvckhpbnRWaXNpYmxlKG5ld1N0YXRlKTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fc29ydC5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX3JlcmVuZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJoaW50XCIgc3RhdGUgc3VjaCB0aGF0IHRoZSBhcnJvdyB3aWxsIGJlIHNlbWktdHJhbnNwYXJlbnRseSBkaXNwbGF5ZWQgYXMgYSBoaW50IHRvIHRoZVxuICAgKiB1c2VyIHNob3dpbmcgd2hhdCB0aGUgYWN0aXZlIHNvcnQgd2lsbCBiZWNvbWUuIElmIHNldCB0byBmYWxzZSwgdGhlIGFycm93IHdpbGwgZmFkZSBhd2F5LlxuICAgKi9cbiAgX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAvLyBOby1vcCBpZiB0aGUgc29ydCBoZWFkZXIgaXMgZGlzYWJsZWQgLSBzaG91bGQgbm90IG1ha2UgdGhlIGhpbnQgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpICYmIHZpc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IHZpc2libGU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFycm93RGlyZWN0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fc2hvd0luZGljYXRvckhpbnQpIHtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnaGludCd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh7ZnJvbVN0YXRlOiAnaGludCcsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9ufSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFuaW1hdGlvbiB0cmFuc2l0aW9uIHZpZXcgc3RhdGUgZm9yIHRoZSBhcnJvdydzIHBvc2l0aW9uIGFuZCBvcGFjaXR5LiBJZiB0aGVcbiAgICogYGRpc2FibGVWaWV3U3RhdGVBbmltYXRpb25gIGZsYWcgaXMgc2V0IHRvIHRydWUsIHRoZSBgZnJvbVN0YXRlYCB3aWxsIGJlIGlnbm9yZWQgc28gdGhhdFxuICAgKiBubyBhbmltYXRpb24gYXBwZWFycy5cbiAgICovXG4gIF9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUodmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24pIHtcbiAgICB0aGlzLl92aWV3U3RhdGUgPSB2aWV3U3RhdGUgfHwge307XG5cbiAgICAvLyBJZiB0aGUgYW5pbWF0aW9uIGZvciBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eS90cmFuc2xhdGlvbikgc2hvdWxkIGJlIGRpc2FibGVkLFxuICAgIC8vIHJlbW92ZSB0aGUgZnJvbVN0YXRlIHNvIHRoYXQgaXQganVtcHMgcmlnaHQgdG8gdGhlIHRvU3RhdGUuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZpZXdTdGF0ZSA9IHt0b1N0YXRlOiB2aWV3U3RhdGUudG9TdGF0ZX07XG4gICAgfVxuICB9XG5cbiAgLyoqIFRyaWdnZXJzIHRoZSBzb3J0IG9uIHRoaXMgc29ydCBoZWFkZXIgYW5kIHJlbW92ZXMgdGhlIGluZGljYXRvciBoaW50LiAqL1xuICBfdG9nZ2xlT25JbnRlcmFjdGlvbigpIHtcbiAgICB0aGlzLl9zb3J0LnNvcnQodGhpcyk7XG5cbiAgICAvLyBEbyBub3Qgc2hvdyB0aGUgYW5pbWF0aW9uIGlmIHRoZSBoZWFkZXIgd2FzIGFscmVhZHkgc2hvd24gaW4gdGhlIHJpZ2h0IHBvc2l0aW9uLlxuICAgIGlmICh0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2hpbnQnIHx8IHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgdGhpcy5fZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCkge1xuICAgIGlmICghdGhpcy5faXNEaXNhYmxlZCgpKSB7XG4gICAgICB0aGlzLl9zb3J0LnNvcnQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2lzRGlzYWJsZWQoKSAmJiAoZXZlbnQua2V5Q29kZSA9PT0gU1BBQ0UgfHwgZXZlbnQua2V5Q29kZSA9PT0gRU5URVIpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5fdG9nZ2xlT25JbnRlcmFjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgTWF0U29ydEhlYWRlciBpcyBjdXJyZW50bHkgc29ydGVkIGluIGVpdGhlciBhc2NlbmRpbmcgb3IgZGVzY2VuZGluZyBvcmRlci4gKi9cbiAgX2lzU29ydGVkKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9zb3J0LmFjdGl2ZSA9PSB0aGlzLmlkICYmXG4gICAgICAodGhpcy5fc29ydC5kaXJlY3Rpb24gPT09ICdhc2MnIHx8IHRoaXMuX3NvcnQuZGlyZWN0aW9uID09PSAnZGVzYycpXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbmltYXRpb24gc3RhdGUgZm9yIHRoZSBhcnJvdyBkaXJlY3Rpb24gKGluZGljYXRvciBhbmQgcG9pbnRlcnMpLiAqL1xuICBfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5faXNTb3J0ZWQoKSA/ICdhY3RpdmUtJyA6ICcnfSR7dGhpcy5fYXJyb3dEaXJlY3Rpb259YDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhcnJvdyBwb3NpdGlvbiBzdGF0ZSAob3BhY2l0eSwgdHJhbnNsYXRpb24pLiAqL1xuICBfZ2V0QXJyb3dWaWV3U3RhdGUoKSB7XG4gICAgY29uc3QgZnJvbVN0YXRlID0gdGhpcy5fdmlld1N0YXRlLmZyb21TdGF0ZTtcbiAgICByZXR1cm4gKGZyb21TdGF0ZSA/IGAke2Zyb21TdGF0ZX0tdG8tYCA6ICcnKSArIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpcmVjdGlvbiB0aGUgYXJyb3cgc2hvdWxkIGJlIHBvaW50aW5nLiBJZiBpdCBpcyBub3Qgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIGJlXG4gICAqIGZhY2luZyB0aGUgc3RhcnQgZGlyZWN0aW9uLiBPdGhlcndpc2UgaWYgaXQgaXMgc29ydGVkLCB0aGUgYXJyb3cgc2hvdWxkIHBvaW50IGluIHRoZSBjdXJyZW50bHlcbiAgICogYWN0aXZlIHNvcnRlZCBkaXJlY3Rpb24uIFRoZSByZWFzb24gdGhpcyBpcyB1cGRhdGVkIHRocm91Z2ggYSBmdW5jdGlvbiBpcyBiZWNhdXNlIHRoZSBkaXJlY3Rpb25cbiAgICogc2hvdWxkIG9ubHkgYmUgY2hhbmdlZCBhdCBzcGVjaWZpYyB0aW1lcyAtIHdoZW4gZGVhY3RpdmF0ZWQgYnV0IHRoZSBoaW50IGlzIGRpc3BsYXllZCBhbmQgd2hlblxuICAgKiB0aGUgc29ydCBpcyBhY3RpdmUgYW5kIHRoZSBkaXJlY3Rpb24gY2hhbmdlcy4gT3RoZXJ3aXNlIHRoZSBhcnJvdydzIGRpcmVjdGlvbiBzaG91bGQgbGluZ2VyXG4gICAqIGluIGNhc2VzIHN1Y2ggYXMgdGhlIHNvcnQgYmVjb21pbmcgZGVhY3RpdmF0ZWQgYnV0IHdlIHdhbnQgdG8gYW5pbWF0ZSB0aGUgYXJyb3cgYXdheSB3aGlsZVxuICAgKiBwcmVzZXJ2aW5nIGl0cyBkaXJlY3Rpb24sIGV2ZW4gdGhvdWdoIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uIGlzIGFjdHVhbGx5IGRpZmZlcmVudCBhbmQgc2hvdWxkXG4gICAqIG9ubHkgYmUgY2hhbmdlZCBvbmNlIHRoZSBhcnJvdyBkaXNwbGF5cyBhZ2FpbiAoaGludCBvciBhY3RpdmF0aW9uKS5cbiAgICovXG4gIF91cGRhdGVBcnJvd0RpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9hcnJvd0RpcmVjdGlvbiA9IHRoaXMuX2lzU29ydGVkKCkgPyB0aGlzLl9zb3J0LmRpcmVjdGlvbiA6IHRoaXMuc3RhcnQgfHwgdGhpcy5fc29ydC5zdGFydDtcbiAgfVxuXG4gIF9pc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1zb3J0IGF0dHJpYnV0ZSB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoaXMgc29ydCBoZWFkZXIuIElmIHRoaXMgaGVhZGVyXG4gICAqIGlzIG5vdCBzb3J0ZWQsIHJldHVybnMgbnVsbCBzbyB0aGF0IHRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBob3N0IGVsZW1lbnQuIEFyaWEgc3BlY1xuICAgKiBzYXlzIHRoYXQgdGhlIGFyaWEtc29ydCBwcm9wZXJ0eSBzaG91bGQgb25seSBiZSBwcmVzZW50IG9uIG9uZSBoZWFkZXIgYXQgYSB0aW1lLCBzbyByZW1vdmluZ1xuICAgKiBlbnN1cmVzIHRoaXMgaXMgdHJ1ZS5cbiAgICovXG4gIF9nZXRBcmlhU29ydEF0dHJpYnV0ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU29ydGVkKCkpIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZGlyZWN0aW9uID09ICdhc2MnID8gJ2FzY2VuZGluZycgOiAnZGVzY2VuZGluZyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXJyb3cgaW5zaWRlIHRoZSBzb3J0IGhlYWRlciBzaG91bGQgYmUgcmVuZGVyZWQuICovXG4gIF9yZW5kZXJBcnJvdygpIHtcbiAgICByZXR1cm4gIXRoaXMuX2lzRGlzYWJsZWQoKSB8fCB0aGlzLl9pc1NvcnRlZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU29ydEFjdGlvbkRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICAvLyBXZSB1c2UgQXJpYURlc2NyaWJlciBmb3IgdGhlIHNvcnQgYnV0dG9uIGluc3RlYWQgb2Ygc2V0dGluZyBhbiBgYXJpYS1sYWJlbGAgYmVjYXVzZSBzb21lXG4gICAgLy8gc2NyZWVuIHJlYWRlcnMgKG5vdGFibHkgVm9pY2VPdmVyKSB3aWxsIHJlYWQgYm90aCB0aGUgY29sdW1uIGhlYWRlciAqYW5kKiB0aGUgYnV0dG9uJ3MgbGFiZWxcbiAgICAvLyBmb3IgZXZlcnkgKmNlbGwqIGluIHRoZSB0YWJsZSwgY3JlYXRpbmcgYSBsb3Qgb2YgdW5uZWNlc3Nhcnkgbm9pc2UuXG5cbiAgICAvLyBJZiBfc29ydEJ1dHRvbiBpcyB1bmRlZmluZWQsIHRoZSBjb21wb25lbnQgaGFzbid0IGJlZW4gaW5pdGlhbGl6ZWQgeWV0IHNvIHRoZXJlJ3NcbiAgICAvLyBub3RoaW5nIHRvIHVwZGF0ZSBpbiB0aGUgRE9NLlxuICAgIGlmICh0aGlzLl9zb3J0QnV0dG9uKSB7XG4gICAgICAvLyByZW1vdmVEZXNjcmlwdGlvbiB3aWxsIG5vLW9wIGlmIHRoZXJlIGlzIG5vIGV4aXN0aW5nIG1lc3NhZ2UuXG4gICAgICAvLyBUT0RPKGplbGJvdXJuKTogcmVtb3ZlIG9wdGlvbmFsIGNoYWluaW5nIHdoZW4gQXJpYURlc2NyaWJlciBpcyByZXF1aXJlZC5cbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXI/LnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX3NvcnRCdXR0b24sIHRoaXMuX3NvcnRBY3Rpb25EZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyPy5kZXNjcmliZSh0aGlzLl9zb3J0QnV0dG9uLCBuZXdEZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydEFjdGlvbkRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG4gIH1cblxuICAvKiogSGFuZGxlcyBjaGFuZ2VzIGluIHRoZSBzb3J0aW5nIHN0YXRlLiAqL1xuICBwcml2YXRlIF9oYW5kbGVTdGF0ZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSBtZXJnZShcbiAgICAgIHRoaXMuX3NvcnQuc29ydENoYW5nZSxcbiAgICAgIHRoaXMuX3NvcnQuX3N0YXRlQ2hhbmdlcyxcbiAgICAgIHRoaXMuX2ludGwuY2hhbmdlcyxcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5faXNTb3J0ZWQoKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVBcnJvd0RpcmVjdGlvbigpO1xuXG4gICAgICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgICAgIGlmICh0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2hpbnQnIHx8IHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uLCB0b1N0YXRlOiAnYWN0aXZlJ30pO1xuICAgICAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGhlYWRlciB3YXMgcmVjZW50bHkgYWN0aXZlIGFuZCBub3cgbm8gbG9uZ2VyIHNvcnRlZCwgYW5pbWF0ZSBhd2F5IHRoZSBhcnJvdy5cbiAgICAgIGlmICghdGhpcy5faXNTb3J0ZWQoKSAmJiB0aGlzLl92aWV3U3RhdGUgJiYgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbn0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiPCEtLVxuICBXZSBzZXQgdGhlIGB0YWJpbmRleGAgb24gYW4gZWxlbWVudCBpbnNpZGUgdGhlIHRhYmxlIGhlYWRlciwgcmF0aGVyIHRoYW4gdGhlIGhlYWRlciBpdHNlbGYsXG4gIGJlY2F1c2Ugb2YgYSBidWcgaW4gTlZEQSB3aGVyZSBoYXZpbmcgYSBgdGFiaW5kZXhgIG9uIGEgYHRoYCBicmVha3Mga2V5Ym9hcmQgbmF2aWdhdGlvbiBpbiB0aGVcbiAgdGFibGUgKHNlZSBodHRwczovL2dpdGh1Yi5jb20vbnZhY2Nlc3MvbnZkYS9pc3N1ZXMvNzcxOCkuIFRoaXMgYWxsb3dzIGZvciB0aGUgaGVhZGVyIHRvIGJvdGhcbiAgYmUgZm9jdXNhYmxlLCBhbmQgaGF2ZSBzY3JlZW4gcmVhZGVycyByZWFkIG91dCBpdHMgYGFyaWEtc29ydGAgc3RhdGUuIFdlIHByZWZlciB0aGlzIGFwcHJvYWNoXG4gIG92ZXIgaGF2aW5nIGEgYnV0dG9uIHdpdGggYW4gYGFyaWEtbGFiZWxgIGluc2lkZSB0aGUgaGVhZGVyLCBiZWNhdXNlIHRoZSBidXR0b24ncyBgYXJpYS1sYWJlbGBcbiAgd2lsbCBiZSByZWFkIG91dCBhcyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nIHRoZSB0YWJsZSdzIGNlbGwgKHNlZSAjMTMwMTIpLlxuXG4gIFRoZSBhcHByb2FjaCBpcyBiYXNlZCBvZmYgb2Y6IGh0dHBzOi8vZGVxdWV1bml2ZXJzaXR5LmNvbS9saWJyYXJ5L2FyaWEvdGFibGVzL3NmLXNvcnRhYmxlLWdyaWRcbi0tPlxuPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1jb250YWluZXIgbWF0LWZvY3VzLWluZGljYXRvclwiXG4gICAgIFtjbGFzcy5tYXQtc29ydC1oZWFkZXItc29ydGVkXT1cIl9pc1NvcnRlZCgpXCJcbiAgICAgW2NsYXNzLm1hdC1zb3J0LWhlYWRlci1wb3NpdGlvbi1iZWZvcmVdPVwiYXJyb3dQb3NpdGlvbiA9PSAnYmVmb3JlJ1wiXG4gICAgIFthdHRyLnRhYmluZGV4XT1cIl9pc0Rpc2FibGVkKCkgPyBudWxsIDogMFwiXG4gICAgIFthdHRyLnJvbGVdPVwiX2lzRGlzYWJsZWQoKSA/IG51bGwgOiAnYnV0dG9uJ1wiPlxuXG4gIDwhLS1cbiAgICBUT0RPKGNyaXNiZXRvKTogdGhpcyBkaXYgaXNuJ3Qgc3RyaWN0bHkgbmVjZXNzYXJ5LCBidXQgd2UgaGF2ZSB0byBrZWVwIGl0IGR1ZSB0byBhIGxhcmdlXG4gICAgbnVtYmVyIG9mIHNjcmVlbnNob3QgZGlmZiBmYWlsdXJlcy4gSXQgc2hvdWxkIGJlIHJlbW92ZWQgZXZlbnR1YWxseS4gTm90ZSB0aGF0IHRoZSBkaWZmZXJlbmNlXG4gICAgaXNuJ3QgdmlzaWJsZSB3aXRoIGEgc2hvcnRlciBoZWFkZXIsIGJ1dCBvbmNlIGl0IGJyZWFrcyB1cCBpbnRvIG11bHRpcGxlIGxpbmVzLCB0aGlzIGVsZW1lbnRcbiAgICBjYXVzZXMgaXQgdG8gYmUgY2VudGVyLWFsaWduZWQsIHdoZXJlYXMgcmVtb3ZpbmcgaXQgd2lsbCBrZWVwIHRoZSB0ZXh0IHRvIHRoZSBsZWZ0LlxuICAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1jb250ZW50XCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cblxuICA8IS0tIERpc2FibGUgYW5pbWF0aW9ucyB3aGlsZSBhIGN1cnJlbnQgYW5pbWF0aW9uIGlzIHJ1bm5pbmcgLS0+XG4gIDxkaXYgY2xhc3M9XCJtYXQtc29ydC1oZWFkZXItYXJyb3dcIlxuICAgICAgICpuZ0lmPVwiX3JlbmRlckFycm93KClcIlxuICAgICAgIFtAYXJyb3dPcGFjaXR5XT1cIl9nZXRBcnJvd1ZpZXdTdGF0ZSgpXCJcbiAgICAgICBbQGFycm93UG9zaXRpb25dPVwiX2dldEFycm93Vmlld1N0YXRlKClcIlxuICAgICAgIFtAYWxsb3dDaGlsZHJlbl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCJcbiAgICAgICAoQGFycm93UG9zaXRpb24uc3RhcnQpPVwiX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlXCJcbiAgICAgICAoQGFycm93UG9zaXRpb24uZG9uZSk9XCJfZGlzYWJsZVZpZXdTdGF0ZUFuaW1hdGlvbiA9IGZhbHNlXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1zdGVtXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1pbmRpY2F0b3JcIiBbQGluZGljYXRvcl09XCJfZ2V0QXJyb3dEaXJlY3Rpb25TdGF0ZSgpXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXNvcnQtaGVhZGVyLXBvaW50ZXItbGVmdFwiIFtAbGVmdFBvaW50ZXJdPVwiX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1wb2ludGVyLXJpZ2h0XCIgW0ByaWdodFBvaW50ZXJdPVwiX2dldEFycm93RGlyZWN0aW9uU3RhdGUoKVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zb3J0LWhlYWRlci1wb2ludGVyLW1pZGRsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19