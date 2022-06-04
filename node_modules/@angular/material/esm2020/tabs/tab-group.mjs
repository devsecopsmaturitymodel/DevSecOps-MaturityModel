/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Inject, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MAT_TAB_GROUP, MatTab } from './tab';
import { MAT_TABS_CONFIG } from './tab-config';
import * as i0 from "@angular/core";
import * as i1 from "./tab-header";
import * as i2 from "./tab-body";
import * as i3 from "@angular/common";
import * as i4 from "./tab-label-wrapper";
import * as i5 from "@angular/material/core";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/cdk/portal";
/** Used to generate unique ID's for each tab component */
let nextId = 0;
/** A simple change event emitted on focus or selection changes. */
export class MatTabChangeEvent {
}
// Boilerplate for applying mixins to MatTabGroup.
/** @docs-private */
const _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}), 'primary');
/**
 * Base class with all of the `MatTabGroupBase` functionality.
 * @docs-private
 */
export class _MatTabGroupBase extends _MatTabGroupMixinBase {
    constructor(elementRef, _changeDetectorRef, defaultConfig, _animationMode) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /** All of the tabs that belong to the group. */
        this._tabs = new QueryList();
        /** The tab index that should be selected after the content has been checked. */
        this._indexToSelect = 0;
        /** Index of the tab that was focused last. */
        this._lastFocusedTabIndex = null;
        /** Snapshot of the height of the tab body wrapper before another tab is activated. */
        this._tabBodyWrapperHeight = 0;
        /** Subscription to tabs being added/removed. */
        this._tabsSubscription = Subscription.EMPTY;
        /** Subscription to changes in the tab labels. */
        this._tabLabelSubscription = Subscription.EMPTY;
        this._selectedIndex = null;
        /** Position of the tab header. */
        this.headerPosition = 'above';
        /** Output to enable support for two-way binding on `[(selectedIndex)]` */
        this.selectedIndexChange = new EventEmitter();
        /** Event emitted when focus has changed within a tab group. */
        this.focusChange = new EventEmitter();
        /** Event emitted when the body animation has completed */
        this.animationDone = new EventEmitter();
        /** Event emitted when the tab selection has changed. */
        this.selectedTabChange = new EventEmitter(true);
        this._groupId = nextId++;
        this.animationDuration =
            defaultConfig && defaultConfig.animationDuration ? defaultConfig.animationDuration : '500ms';
        this.disablePagination =
            defaultConfig && defaultConfig.disablePagination != null
                ? defaultConfig.disablePagination
                : false;
        this.dynamicHeight =
            defaultConfig && defaultConfig.dynamicHeight != null ? defaultConfig.dynamicHeight : false;
        this.contentTabIndex = defaultConfig?.contentTabIndex ?? null;
    }
    /** Whether the tab group should grow to the size of the active tab. */
    get dynamicHeight() {
        return this._dynamicHeight;
    }
    set dynamicHeight(value) {
        this._dynamicHeight = coerceBooleanProperty(value);
    }
    /** The index of the active tab. */
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        this._indexToSelect = coerceNumberProperty(value, null);
    }
    /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
    get animationDuration() {
        return this._animationDuration;
    }
    set animationDuration(value) {
        this._animationDuration = /^\d+$/.test(value + '') ? value + 'ms' : value;
    }
    /**
     * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
     * accessibility when the tab does not have focusable elements or if it has scrollable content.
     * The `tabindex` will be removed automatically for inactive tabs.
     * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
     */
    get contentTabIndex() {
        return this._contentTabIndex;
    }
    set contentTabIndex(value) {
        this._contentTabIndex = coerceNumberProperty(value, null);
    }
    /** Background color of the tab group. */
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(value) {
        const nativeElement = this._elementRef.nativeElement;
        nativeElement.classList.remove(`mat-background-${this.backgroundColor}`);
        if (value) {
            nativeElement.classList.add(`mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    ngAfterContentChecked() {
        // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
        // the amount of tabs changes before the actual change detection runs.
        const indexToSelect = (this._indexToSelect = this._clampTabIndex(this._indexToSelect));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect) {
            const isFirstRun = this._selectedIndex == null;
            if (!isFirstRun) {
                this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
                // Preserve the height so page doesn't scroll up during tab change.
                // Fixes https://stackblitz.com/edit/mat-tabs-scroll-page-top-on-tab-change
                const wrapper = this._tabBodyWrapper.nativeElement;
                wrapper.style.minHeight = wrapper.clientHeight + 'px';
            }
            // Changing these values after change detection has run
            // since the checked content may contain references to them.
            Promise.resolve().then(() => {
                this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));
                if (!isFirstRun) {
                    this.selectedIndexChange.emit(indexToSelect);
                    // Clear the min-height, this was needed during tab change to avoid
                    // unnecessary scrolling.
                    this._tabBodyWrapper.nativeElement.style.minHeight = '';
                }
            });
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach((tab, index) => {
            tab.position = index - indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - this._selectedIndex;
            }
        });
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._lastFocusedTabIndex = null;
            this._changeDetectorRef.markForCheck();
        }
    }
    ngAfterContentInit() {
        this._subscribeToAllTabChanges();
        this._subscribeToTabLabels();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe(() => {
            const indexToSelect = this._clampTabIndex(this._indexToSelect);
            // Maintain the previously-selected tab if a new tab is added or removed and there is no
            // explicit change that selects a different tab.
            if (indexToSelect === this._selectedIndex) {
                const tabs = this._tabs.toArray();
                let selectedTab;
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].isActive) {
                        // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
                        // event, otherwise the consumer may end up in an infinite loop in some edge cases like
                        // adding a tab within the `selectedIndexChange` event.
                        this._indexToSelect = this._selectedIndex = i;
                        this._lastFocusedTabIndex = null;
                        selectedTab = tabs[i];
                        break;
                    }
                }
                // If we haven't found an active tab and a tab exists at the selected index, it means
                // that the active tab was swapped out. Since this won't be picked up by the rendering
                // loop in `ngAfterContentChecked`, we need to sync it up manually.
                if (!selectedTab && tabs[indexToSelect]) {
                    Promise.resolve().then(() => {
                        tabs[indexToSelect].isActive = true;
                        this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
                    });
                }
            }
            this._changeDetectorRef.markForCheck();
        });
    }
    /** Listens to changes in all of the tabs. */
    _subscribeToAllTabChanges() {
        // Since we use a query with `descendants: true` to pick up the tabs, we may end up catching
        // some that are inside of nested tab groups. We filter them out manually by checking that
        // the closest group to the tab is the current one.
        this._allTabs.changes.pipe(startWith(this._allTabs)).subscribe((tabs) => {
            this._tabs.reset(tabs.filter(tab => {
                return tab._closestTabGroup === this || !tab._closestTabGroup;
            }));
            this._tabs.notifyOnChanges();
        });
    }
    ngOnDestroy() {
        this._tabs.destroy();
        this._tabsSubscription.unsubscribe();
        this._tabLabelSubscription.unsubscribe();
    }
    /** Re-aligns the ink bar to the selected tab element. */
    realignInkBar() {
        if (this._tabHeader) {
            this._tabHeader._alignInkBarToSelectedTab();
        }
    }
    /**
     * Recalculates the tab group's pagination dimensions.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    updatePagination() {
        if (this._tabHeader) {
            this._tabHeader.updatePagination();
        }
    }
    /**
     * Sets focus to a particular tab.
     * @param index Index of the tab to be focused.
     */
    focusTab(index) {
        const header = this._tabHeader;
        if (header) {
            header.focusIndex = index;
        }
    }
    _focusChanged(index) {
        this._lastFocusedTabIndex = index;
        this.focusChange.emit(this._createChangeEvent(index));
    }
    _createChangeEvent(index) {
        const event = new MatTabChangeEvent();
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    }
    /**
     * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     */
    _subscribeToTabLabels() {
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges)).subscribe(() => this._changeDetectorRef.markForCheck());
    }
    /** Clamps the given index to the bounds of 0 and the tabs length. */
    _clampTabIndex(index) {
        // Note the `|| 0`, which ensures that values like NaN can't get through
        // and which would otherwise throw the component into an infinite loop
        // (since Math.max(NaN, 0) === NaN).
        return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
    }
    /** Returns a unique id for each tab label element */
    _getTabLabelId(i) {
        return `mat-tab-label-${this._groupId}-${i}`;
    }
    /** Returns a unique id for each tab content element */
    _getTabContentId(i) {
        return `mat-tab-content-${this._groupId}-${i}`;
    }
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    _setTabBodyWrapperHeight(tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        const wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.height = this._tabBodyWrapperHeight + 'px';
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            wrapper.style.height = tabHeight + 'px';
        }
    }
    /** Removes the height of the tab body wrapper. */
    _removeTabBodyWrapperHeight() {
        const wrapper = this._tabBodyWrapper.nativeElement;
        this._tabBodyWrapperHeight = wrapper.clientHeight;
        wrapper.style.height = '';
        this.animationDone.emit();
    }
    /** Handle click events, setting new selected index if appropriate. */
    _handleClick(tab, tabHeader, index) {
        if (!tab.disabled) {
            this.selectedIndex = tabHeader.focusIndex = index;
        }
    }
    /** Retrieves the tabindex for the tab. */
    _getTabIndex(tab, index) {
        if (tab.disabled) {
            return null;
        }
        const targetIndex = this._lastFocusedTabIndex ?? this.selectedIndex;
        return index === targetIndex ? 0 : -1;
    }
    /** Callback for when the focused state of a tab has changed. */
    _tabFocusChanged(focusOrigin, index) {
        // Mouse/touch focus happens during the `mousedown`/`touchstart` phase which
        // can cause the tab to be moved out from under the pointer, interrupting the
        // click sequence (see #21898). We don't need to scroll the tab into view for
        // such cases anyway, because it will be done when the tab becomes selected.
        if (focusOrigin && focusOrigin !== 'mouse' && focusOrigin !== 'touch') {
            this._tabHeader.focusIndex = index;
        }
    }
}
_MatTabGroupBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabGroupBase, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_TABS_CONFIG, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabGroupBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatTabGroupBase, inputs: { dynamicHeight: "dynamicHeight", selectedIndex: "selectedIndex", headerPosition: "headerPosition", animationDuration: "animationDuration", contentTabIndex: "contentTabIndex", disablePagination: "disablePagination", backgroundColor: "backgroundColor" }, outputs: { selectedIndexChange: "selectedIndexChange", focusChange: "focusChange", animationDone: "animationDone", selectedTabChange: "selectedTabChange" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabGroupBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TABS_CONFIG]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { dynamicHeight: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], headerPosition: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], contentTabIndex: [{
                type: Input
            }], disablePagination: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], selectedIndexChange: [{
                type: Output
            }], focusChange: [{
                type: Output
            }], animationDone: [{
                type: Output
            }], selectedTabChange: [{
                type: Output
            }] } });
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
export class MatTabGroup extends _MatTabGroupBase {
    constructor(elementRef, changeDetectorRef, defaultConfig, animationMode) {
        super(elementRef, changeDetectorRef, defaultConfig, animationMode);
    }
}
MatTabGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabGroup, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_TABS_CONFIG, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTabGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTabGroup, selector: "mat-tab-group", inputs: { color: "color", disableRipple: "disableRipple" }, host: { properties: { "class.mat-tab-group-dynamic-height": "dynamicHeight", "class.mat-tab-group-inverted-header": "headerPosition === \"below\"" }, classAttribute: "mat-tab-group" }, providers: [
        {
            provide: MAT_TAB_GROUP,
            useExisting: MatTabGroup,
        },
    ], queries: [{ propertyName: "_allTabs", predicate: MatTab, descendants: true }], viewQueries: [{ propertyName: "_tabBodyWrapper", first: true, predicate: ["tabBodyWrapper"], descendants: true }, { propertyName: "_tabHeader", first: true, predicate: ["tabHeader"], descendants: true }], exportAs: ["matTabGroup"], usesInheritance: true, ngImport: i0, template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple\n       cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex === i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex === i\"\n       [ngClass]=\"tab.labelClass\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\"\n       (cdkFocusChange)=\"_tabFocusChanged($event, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\" [ngIfElse]=\"tabTextLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template #tabTextLabel>{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.tabindex]=\"(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex === i\"\n               [ngClass]=\"tab.bodyClass\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n", styles: [".mat-tab-group{display:flex;flex-direction:column;max-width:100%}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"], components: [{ type: i1.MatTabHeader, selector: "mat-tab-header", inputs: ["selectedIndex"], outputs: ["selectFocusedIndex", "indexFocused"] }, { type: i2.MatTabBody, selector: "mat-tab-body" }], directives: [{ type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i4.MatTabLabelWrapper, selector: "[matTabLabelWrapper]", inputs: ["disabled"] }, { type: i5.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i6.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i7.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab-group', exportAs: 'matTabGroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, inputs: ['color', 'disableRipple'], providers: [
                        {
                            provide: MAT_TAB_GROUP,
                            useExisting: MatTabGroup,
                        },
                    ], host: {
                        'class': 'mat-tab-group',
                        '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                        '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                    }, template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple\n       cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex === i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex === i\"\n       [ngClass]=\"tab.labelClass\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\"\n       (cdkFocusChange)=\"_tabFocusChanged($event, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\" [ngIfElse]=\"tabTextLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template #tabTextLabel>{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.tabindex]=\"(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex === i\"\n               [ngClass]=\"tab.bodyClass\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n", styles: [".mat-tab-group{display:flex;flex-direction:column;max-width:100%}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TABS_CONFIG]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _allTabs: [{
                type: ContentChildren,
                args: [MatTab, { descendants: true }]
            }], _tabBodyWrapper: [{
                type: ViewChild,
                args: ['tabBodyWrapper']
            }], _tabHeader: [{
                type: ViewChild,
                args: ['tabHeader']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBR0wsVUFBVSxFQUNWLGtCQUFrQixHQUVuQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsYUFBYSxFQUFFLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM1QyxPQUFPLEVBQUMsZUFBZSxFQUFnQixNQUFNLGNBQWMsQ0FBQzs7Ozs7Ozs7O0FBRTVELDBEQUEwRDtBQUMxRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLGlCQUFpQjtDQUs3QjtBQUtELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQ3RDLGtCQUFrQixDQUNoQjtJQUNF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REE7MkZEOGJhLFdBQVc7a0JBckJ2QixTQUFTOytCQUNFLGVBQWUsWUFDZixhQUFhLGlCQUdSLGlCQUFpQixDQUFDLElBQUksbUJBRXBCLHVCQUF1QixDQUFDLE9BQU8sVUFDeEMsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLGFBQ3ZCO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixXQUFXLGFBQWE7eUJBQ3pCO3FCQUNGLFFBQ0s7d0JBQ0osT0FBTyxFQUFFLGVBQWU7d0JBQ3hCLHNDQUFzQyxFQUFFLGVBQWU7d0JBQ3ZELHVDQUF1QyxFQUFFLDRCQUE0QjtxQkFDdEU7OzBCQVVFLE1BQU07MkJBQUMsZUFBZTs7MEJBQUcsUUFBUTs7MEJBQ2pDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQVJHLFFBQVE7c0JBQXJELGVBQWU7dUJBQUMsTUFBTSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFDZixlQUFlO3NCQUEzQyxTQUFTO3VCQUFDLGdCQUFnQjtnQkFDSCxVQUFVO3NCQUFqQyxTQUFTO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0ZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge21lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TUFUX1RBQl9HUk9VUCwgTWF0VGFifSBmcm9tICcuL3RhYic7XG5pbXBvcnQge01BVF9UQUJTX0NPTkZJRywgTWF0VGFic0NvbmZpZ30gZnJvbSAnLi90YWItY29uZmlnJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEJ3MgZm9yIGVhY2ggdGFiIGNvbXBvbmVudCAqL1xubGV0IG5leHRJZCA9IDA7XG5cbi8qKiBBIHNpbXBsZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCBvbiBmb2N1cyBvciBzZWxlY3Rpb24gY2hhbmdlcy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRUYWJDaGFuZ2VFdmVudCB7XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRhYi4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5LXNlbGVjdGVkIHRhYi4gKi9cbiAgdGFiOiBNYXRUYWI7XG59XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSB0YWIgaGVhZGVyLiAqL1xuZXhwb3J0IHR5cGUgTWF0VGFiSGVhZGVyUG9zaXRpb24gPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRUYWJHcm91cC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0VGFiR3JvdXBNaXhpbkJhc2UgPSBtaXhpbkNvbG9yKFxuICBtaXhpbkRpc2FibGVSaXBwbGUoXG4gICAgY2xhc3Mge1xuICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICAgIH0sXG4gICksXG4gICdwcmltYXJ5Jyxcbik7XG5cbmludGVyZmFjZSBNYXRUYWJHcm91cEJhc2VIZWFkZXIge1xuICBfYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk6IHZvaWQ7XG4gIHVwZGF0ZVBhZ2luYXRpb24oKTogdm9pZDtcbiAgZm9jdXNJbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJHcm91cEJhc2VgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJHcm91cEJhc2VcbiAgZXh0ZW5kcyBfTWF0VGFiR3JvdXBNaXhpbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3ksIENhbkNvbG9yLCBDYW5EaXNhYmxlUmlwcGxlXG57XG4gIC8qKlxuICAgKiBBbGwgdGFicyBpbnNpZGUgdGhlIHRhYiBncm91cC4gVGhpcyBpbmNsdWRlcyB0YWJzIHRoYXQgYmVsb25nIHRvIGdyb3VwcyB0aGF0IGFyZSBuZXN0ZWRcbiAgICogaW5zaWRlIHRoZSBjdXJyZW50IG9uZS4gV2UgZmlsdGVyIG91dCBvbmx5IHRoZSB0YWJzIHRoYXQgYmVsb25nIHRvIHRoaXMgZ3JvdXAgaW4gYF90YWJzYC5cbiAgICovXG4gIGFic3RyYWN0IF9hbGxUYWJzOiBRdWVyeUxpc3Q8TWF0VGFiPjtcbiAgYWJzdHJhY3QgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBhYnN0cmFjdCBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgLyoqIEFsbCBvZiB0aGUgdGFicyB0aGF0IGJlbG9uZyB0byB0aGUgZ3JvdXAuICovXG4gIF90YWJzOiBRdWVyeUxpc3Q8TWF0VGFiPiA9IG5ldyBRdWVyeUxpc3Q8TWF0VGFiPigpO1xuXG4gIC8qKiBUaGUgdGFiIGluZGV4IHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGFmdGVyIHRoZSBjb250ZW50IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX2luZGV4VG9TZWxlY3Q6IG51bWJlciB8IG51bGwgPSAwO1xuXG4gIC8qKiBJbmRleCBvZiB0aGUgdGFiIHRoYXQgd2FzIGZvY3VzZWQgbGFzdC4gKi9cbiAgcHJpdmF0ZSBfbGFzdEZvY3VzZWRUYWJJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFNuYXBzaG90IG9mIHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBib2R5IHdyYXBwZXIgYmVmb3JlIGFub3RoZXIgdGFiIGlzIGFjdGl2YXRlZC4gKi9cbiAgcHJpdmF0ZSBfdGFiQm9keVdyYXBwZXJIZWlnaHQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0YWJzIGJlaW5nIGFkZGVkL3JlbW92ZWQuICovXG4gIHByaXZhdGUgX3RhYnNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiAqL1xuICBwcml2YXRlIF90YWJMYWJlbFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGdyb3VwIHNob3VsZCBncm93IHRvIHRoZSBzaXplIG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZHluYW1pY0hlaWdodCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZHluYW1pY0hlaWdodDtcbiAgfVxuICBzZXQgZHluYW1pY0hlaWdodCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZHluYW1pY0hlaWdodCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZHluYW1pY0hlaWdodDogYm9vbGVhbjtcblxuICAvKiogVGhlIGluZGV4IG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWRJbmRleCgpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgfVxuICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9pbmRleFRvU2VsZWN0ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIG51bGwpO1xuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgdGFiIGhlYWRlci4gKi9cbiAgQElucHV0KCkgaGVhZGVyUG9zaXRpb246IE1hdFRhYkhlYWRlclBvc2l0aW9uID0gJ2Fib3ZlJztcblxuICAvKiogRHVyYXRpb24gZm9yIHRoZSB0YWIgYW5pbWF0aW9uLiBXaWxsIGJlIG5vcm1hbGl6ZWQgdG8gbWlsbGlzZWNvbmRzIGlmIG5vIHVuaXRzIGFyZSBzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhbmltYXRpb25EdXJhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25EdXJhdGlvbjtcbiAgfVxuICBzZXQgYW5pbWF0aW9uRHVyYXRpb24odmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gPSAvXlxcZCskLy50ZXN0KHZhbHVlICsgJycpID8gdmFsdWUgKyAnbXMnIDogKHZhbHVlIGFzIHN0cmluZyk7XG4gIH1cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZztcblxuICAvKipcbiAgICogYHRhYmluZGV4YCB0byBiZSBzZXQgb24gdGhlIGlubmVyIGVsZW1lbnQgdGhhdCB3cmFwcyB0aGUgdGFiIGNvbnRlbnQuIENhbiBiZSB1c2VkIGZvciBpbXByb3ZlZFxuICAgKiBhY2Nlc3NpYmlsaXR5IHdoZW4gdGhlIHRhYiBkb2VzIG5vdCBoYXZlIGZvY3VzYWJsZSBlbGVtZW50cyBvciBpZiBpdCBoYXMgc2Nyb2xsYWJsZSBjb250ZW50LlxuICAgKiBUaGUgYHRhYmluZGV4YCB3aWxsIGJlIHJlbW92ZWQgYXV0b21hdGljYWxseSBmb3IgaW5hY3RpdmUgdGFicy5cbiAgICogUmVhZCBtb3JlIGF0IGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS1wcmFjdGljZXMvZXhhbXBsZXMvdGFicy90YWJzLTIvdGFicy5odG1sXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY29udGVudFRhYkluZGV4KCk6IG51bWJlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50VGFiSW5kZXg7XG4gIH1cbiAgc2V0IGNvbnRlbnRUYWJJbmRleCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9jb250ZW50VGFiSW5kZXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgbnVsbCk7XG4gIH1cbiAgcHJpdmF0ZSBfY29udGVudFRhYkluZGV4OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVQYWdpbmF0aW9uOiBib29sZWFuO1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgZ3JvdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yO1xuICB9XG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGBtYXQtYmFja2dyb3VuZC0ke3RoaXMuYmFja2dyb3VuZENvbG9yfWApO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1iYWNrZ3JvdW5kLSR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYmFja2dyb3VuZENvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIE91dHB1dCB0byBlbmFibGUgc3VwcG9ydCBmb3IgdHdvLXdheSBiaW5kaW5nIG9uIGBbKHNlbGVjdGVkSW5kZXgpXWAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkSW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBmb2N1cyBoYXMgY2hhbmdlZCB3aXRoaW4gYSB0YWIgZ3JvdXAuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBmb2N1c0NoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBib2R5IGFuaW1hdGlvbiBoYXMgY29tcGxldGVkICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIHNlbGVjdGlvbiBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50Pih0cnVlKTtcblxuICBwcml2YXRlIF9ncm91cElkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9UQUJTX0NPTkZJRykgQE9wdGlvbmFsKCkgZGVmYXVsdENvbmZpZz86IE1hdFRhYnNDb25maWcsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZ3JvdXBJZCA9IG5leHRJZCsrO1xuICAgIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gPVxuICAgICAgZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uID8gZGVmYXVsdENvbmZpZy5hbmltYXRpb25EdXJhdGlvbiA6ICc1MDBtcyc7XG4gICAgdGhpcy5kaXNhYmxlUGFnaW5hdGlvbiA9XG4gICAgICBkZWZhdWx0Q29uZmlnICYmIGRlZmF1bHRDb25maWcuZGlzYWJsZVBhZ2luYXRpb24gIT0gbnVsbFxuICAgICAgICA/IGRlZmF1bHRDb25maWcuZGlzYWJsZVBhZ2luYXRpb25cbiAgICAgICAgOiBmYWxzZTtcbiAgICB0aGlzLmR5bmFtaWNIZWlnaHQgPVxuICAgICAgZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmR5bmFtaWNIZWlnaHQgIT0gbnVsbCA/IGRlZmF1bHRDb25maWcuZHluYW1pY0hlaWdodCA6IGZhbHNlO1xuICAgIHRoaXMuY29udGVudFRhYkluZGV4ID0gZGVmYXVsdENvbmZpZz8uY29udGVudFRhYkluZGV4ID8/IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgdGhlIGNvbnRlbnQgaXMgY2hlY2tlZCwgdGhpcyBjb21wb25lbnQga25vd3Mgd2hhdCB0YWJzIGhhdmUgYmVlbiBkZWZpbmVkXG4gICAqIGFuZCB3aGF0IHRoZSBzZWxlY3RlZCBpbmRleCBzaG91bGQgYmUuIFRoaXMgaXMgd2hlcmUgd2UgY2FuIGtub3cgZXhhY3RseSB3aGF0IHBvc2l0aW9uXG4gICAqIGVhY2ggdGFiIHNob3VsZCBiZSBpbiBhY2NvcmRpbmcgdG8gdGhlIG5ldyBzZWxlY3RlZCBpbmRleCwgYW5kIGFkZGl0aW9uYWxseSB3ZSBrbm93IGhvd1xuICAgKiBhIG5ldyBzZWxlY3RlZCB0YWIgc2hvdWxkIHRyYW5zaXRpb24gaW4gKGZyb20gdGhlIGxlZnQgb3IgcmlnaHQpLlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIERvbid0IGNsYW1wIHRoZSBgaW5kZXhUb1NlbGVjdGAgaW1tZWRpYXRlbHkgaW4gdGhlIHNldHRlciBiZWNhdXNlIGl0IGNhbiBoYXBwZW4gdGhhdFxuICAgIC8vIHRoZSBhbW91bnQgb2YgdGFicyBjaGFuZ2VzIGJlZm9yZSB0aGUgYWN0dWFsIGNoYW5nZSBkZXRlY3Rpb24gcnVucy5cbiAgICBjb25zdCBpbmRleFRvU2VsZWN0ID0gKHRoaXMuX2luZGV4VG9TZWxlY3QgPSB0aGlzLl9jbGFtcFRhYkluZGV4KHRoaXMuX2luZGV4VG9TZWxlY3QpKTtcblxuICAgIC8vIElmIHRoZXJlIGlzIGEgY2hhbmdlIGluIHNlbGVjdGVkIGluZGV4LCBlbWl0IGEgY2hhbmdlIGV2ZW50LiBTaG91bGQgbm90IHRyaWdnZXIgaWZcbiAgICAvLyB0aGUgc2VsZWN0ZWQgaW5kZXggaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPSBpbmRleFRvU2VsZWN0KSB7XG4gICAgICBjb25zdCBpc0ZpcnN0UnVuID0gdGhpcy5fc2VsZWN0ZWRJbmRleCA9PSBudWxsO1xuXG4gICAgICBpZiAoIWlzRmlyc3RSdW4pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhYkNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4VG9TZWxlY3QpKTtcbiAgICAgICAgLy8gUHJlc2VydmUgdGhlIGhlaWdodCBzbyBwYWdlIGRvZXNuJ3Qgc2Nyb2xsIHVwIGR1cmluZyB0YWIgY2hhbmdlLlxuICAgICAgICAvLyBGaXhlcyBodHRwczovL3N0YWNrYmxpdHouY29tL2VkaXQvbWF0LXRhYnMtc2Nyb2xsLXBhZ2UtdG9wLW9uLXRhYi1jaGFuZ2VcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUubWluSGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQgKyAncHgnO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGFuZ2luZyB0aGVzZSB2YWx1ZXMgYWZ0ZXIgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuXG4gICAgICAvLyBzaW5jZSB0aGUgY2hlY2tlZCBjb250ZW50IG1heSBjb250YWluIHJlZmVyZW5jZXMgdG8gdGhlbS5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+ICh0YWIuaXNBY3RpdmUgPSBpbmRleCA9PT0gaW5kZXhUb1NlbGVjdCkpO1xuXG4gICAgICAgIGlmICghaXNGaXJzdFJ1bikge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleENoYW5nZS5lbWl0KGluZGV4VG9TZWxlY3QpO1xuICAgICAgICAgIC8vIENsZWFyIHRoZSBtaW4taGVpZ2h0LCB0aGlzIHdhcyBuZWVkZWQgZHVyaW5nIHRhYiBjaGFuZ2UgdG8gYXZvaWRcbiAgICAgICAgICAvLyB1bm5lY2Vzc2FyeSBzY3JvbGxpbmcuXG4gICAgICAgICAgdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0dXAgdGhlIHBvc2l0aW9uIGZvciBlYWNoIHRhYiBhbmQgb3B0aW9uYWxseSBzZXR1cCBhbiBvcmlnaW4gb24gdGhlIG5leHQgc2VsZWN0ZWQgdGFiLlxuICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiOiBNYXRUYWIsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHRhYi5wb3NpdGlvbiA9IGluZGV4IC0gaW5kZXhUb1NlbGVjdDtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYiwgdGhlbiBzZXQgdXAgYW4gb3JpZ2luIGZvciB0aGUgbmV4dCBzZWxlY3RlZCB0YWJcbiAgICAgIC8vIGlmIGl0IGRvZXNuJ3QgaGF2ZSBvbmUgYWxyZWFkeS5cbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IG51bGwgJiYgdGFiLnBvc2l0aW9uID09IDAgJiYgIXRhYi5vcmlnaW4pIHtcbiAgICAgICAgdGFiLm9yaWdpbiA9IGluZGV4VG9TZWxlY3QgLSB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT09IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSBpbmRleFRvU2VsZWN0O1xuICAgICAgdGhpcy5fbGFzdEZvY3VzZWRUYWJJbmRleCA9IG51bGw7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9BbGxUYWJDaGFuZ2VzKCk7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9UYWJMYWJlbHMoKTtcblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBhbW91bnQgb2YgdGFicywgaW4gb3JkZXIgdG8gYmVcbiAgICAvLyBhYmxlIHRvIHJlLXJlbmRlciB0aGUgY29udGVudCBhcyBuZXcgdGFicyBhcmUgYWRkZWQgb3IgcmVtb3ZlZC5cbiAgICB0aGlzLl90YWJzU3Vic2NyaXB0aW9uID0gdGhpcy5fdGFicy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvU2VsZWN0ID0gdGhpcy5fY2xhbXBUYWJJbmRleCh0aGlzLl9pbmRleFRvU2VsZWN0KTtcblxuICAgICAgLy8gTWFpbnRhaW4gdGhlIHByZXZpb3VzbHktc2VsZWN0ZWQgdGFiIGlmIGEgbmV3IHRhYiBpcyBhZGRlZCBvciByZW1vdmVkIGFuZCB0aGVyZSBpcyBub1xuICAgICAgLy8gZXhwbGljaXQgY2hhbmdlIHRoYXQgc2VsZWN0cyBhIGRpZmZlcmVudCB0YWIuXG4gICAgICBpZiAoaW5kZXhUb1NlbGVjdCA9PT0gdGhpcy5fc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICBjb25zdCB0YWJzID0gdGhpcy5fdGFicy50b0FycmF5KCk7XG4gICAgICAgIGxldCBzZWxlY3RlZFRhYjogTWF0VGFiIHwgdW5kZWZpbmVkO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0YWJzW2ldLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAvLyBBc3NpZ24gYm90aCB0byB0aGUgYF9pbmRleFRvU2VsZWN0YCBhbmQgYF9zZWxlY3RlZEluZGV4YCBzbyB3ZSBkb24ndCBmaXJlIGEgY2hhbmdlZFxuICAgICAgICAgICAgLy8gZXZlbnQsIG90aGVyd2lzZSB0aGUgY29uc3VtZXIgbWF5IGVuZCB1cCBpbiBhbiBpbmZpbml0ZSBsb29wIGluIHNvbWUgZWRnZSBjYXNlcyBsaWtlXG4gICAgICAgICAgICAvLyBhZGRpbmcgYSB0YWIgd2l0aGluIHRoZSBgc2VsZWN0ZWRJbmRleENoYW5nZWAgZXZlbnQuXG4gICAgICAgICAgICB0aGlzLl9pbmRleFRvU2VsZWN0ID0gdGhpcy5fc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICB0aGlzLl9sYXN0Rm9jdXNlZFRhYkluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGVjdGVkVGFiID0gdGFic1tpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmVuJ3QgZm91bmQgYW4gYWN0aXZlIHRhYiBhbmQgYSB0YWIgZXhpc3RzIGF0IHRoZSBzZWxlY3RlZCBpbmRleCwgaXQgbWVhbnNcbiAgICAgICAgLy8gdGhhdCB0aGUgYWN0aXZlIHRhYiB3YXMgc3dhcHBlZCBvdXQuIFNpbmNlIHRoaXMgd29uJ3QgYmUgcGlja2VkIHVwIGJ5IHRoZSByZW5kZXJpbmdcbiAgICAgICAgLy8gbG9vcCBpbiBgbmdBZnRlckNvbnRlbnRDaGVja2VkYCwgd2UgbmVlZCB0byBzeW5jIGl0IHVwIG1hbnVhbGx5LlxuICAgICAgICBpZiAoIXNlbGVjdGVkVGFiICYmIHRhYnNbaW5kZXhUb1NlbGVjdF0pIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRhYnNbaW5kZXhUb1NlbGVjdF0uaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRhYkNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4VG9TZWxlY3QpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gYWxsIG9mIHRoZSB0YWJzLiAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0FsbFRhYkNoYW5nZXMoKSB7XG4gICAgLy8gU2luY2Ugd2UgdXNlIGEgcXVlcnkgd2l0aCBgZGVzY2VuZGFudHM6IHRydWVgIHRvIHBpY2sgdXAgdGhlIHRhYnMsIHdlIG1heSBlbmQgdXAgY2F0Y2hpbmdcbiAgICAvLyBzb21lIHRoYXQgYXJlIGluc2lkZSBvZiBuZXN0ZWQgdGFiIGdyb3Vwcy4gV2UgZmlsdGVyIHRoZW0gb3V0IG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoYXRcbiAgICAvLyB0aGUgY2xvc2VzdCBncm91cCB0byB0aGUgdGFiIGlzIHRoZSBjdXJyZW50IG9uZS5cbiAgICB0aGlzLl9hbGxUYWJzLmNoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5fYWxsVGFicykpLnN1YnNjcmliZSgodGFiczogUXVlcnlMaXN0PE1hdFRhYj4pID0+IHtcbiAgICAgIHRoaXMuX3RhYnMucmVzZXQoXG4gICAgICAgIHRhYnMuZmlsdGVyKHRhYiA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRhYi5fY2xvc2VzdFRhYkdyb3VwID09PSB0aGlzIHx8ICF0YWIuX2Nsb3Nlc3RUYWJHcm91cDtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgdGhpcy5fdGFicy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3RhYnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFJlLWFsaWducyB0aGUgaW5rIGJhciB0byB0aGUgc2VsZWN0ZWQgdGFiIGVsZW1lbnQuICovXG4gIHJlYWxpZ25JbmtCYXIoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkhlYWRlcikge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSB0YWIgZ3JvdXAncyBwYWdpbmF0aW9uIGRpbWVuc2lvbnMuXG4gICAqXG4gICAqIFdBUk5JTkc6IENhbGxpbmcgdGhpcyBtZXRob2QgY2FuIGJlIHZlcnkgY29zdGx5IGluIHRlcm1zIG9mIHBlcmZvcm1hbmNlLiBJdCBzaG91bGQgYmUgY2FsbGVkXG4gICAqIGFzIGluZnJlcXVlbnRseSBhcyBwb3NzaWJsZSBmcm9tIG91dHNpZGUgb2YgdGhlIFRhYnMgY29tcG9uZW50IGFzIGl0IGNhdXNlcyBhIHJlZmxvdyBvZiB0aGVcbiAgICogcGFnZS5cbiAgICovXG4gIHVwZGF0ZVBhZ2luYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuX3RhYkhlYWRlcikge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb2N1cyB0byBhIHBhcnRpY3VsYXIgdGFiLlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIHRhYiB0byBiZSBmb2N1c2VkLlxuICAgKi9cbiAgZm9jdXNUYWIoaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuX3RhYkhlYWRlcjtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGhlYWRlci5mb2N1c0luZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgX2ZvY3VzQ2hhbmdlZChpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fbGFzdEZvY3VzZWRUYWJJbmRleCA9IGluZGV4O1xuICAgIHRoaXMuZm9jdXNDaGFuZ2UuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudChpbmRleCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXg6IG51bWJlcik6IE1hdFRhYkNoYW5nZUV2ZW50IHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRUYWJDaGFuZ2VFdmVudCgpO1xuICAgIGV2ZW50LmluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHRoaXMuX3RhYnMgJiYgdGhpcy5fdGFicy5sZW5ndGgpIHtcbiAgICAgIGV2ZW50LnRhYiA9IHRoaXMuX3RhYnMudG9BcnJheSgpW2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gY2hhbmdlcyBpbiB0aGUgdGFiIGxhYmVscy4gVGhpcyBpcyBuZWVkZWQsIGJlY2F1c2UgdGhlIEBJbnB1dCBmb3IgdGhlIGxhYmVsIGlzXG4gICAqIG9uIHRoZSBNYXRUYWIgY29tcG9uZW50LCB3aGVyZWFzIHRoZSBkYXRhIGJpbmRpbmcgaXMgaW5zaWRlIHRoZSBNYXRUYWJHcm91cC4gSW4gb3JkZXIgZm9yIHRoZVxuICAgKiBiaW5kaW5nIHRvIGJlIHVwZGF0ZWQsIHdlIG5lZWQgdG8gc3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gaXQgYW5kIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvblxuICAgKiBtYW51YWxseS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvVGFiTGFiZWxzKCkge1xuICAgIGlmICh0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fdGFiTGFiZWxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLnRoaXMuX3RhYnMubWFwKHRhYiA9PiB0YWIuX3N0YXRlQ2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBDbGFtcHMgdGhlIGdpdmVuIGluZGV4IHRvIHRoZSBib3VuZHMgb2YgMCBhbmQgdGhlIHRhYnMgbGVuZ3RoLiAqL1xuICBwcml2YXRlIF9jbGFtcFRhYkluZGV4KGluZGV4OiBudW1iZXIgfCBudWxsKTogbnVtYmVyIHtcbiAgICAvLyBOb3RlIHRoZSBgfHwgMGAsIHdoaWNoIGVuc3VyZXMgdGhhdCB2YWx1ZXMgbGlrZSBOYU4gY2FuJ3QgZ2V0IHRocm91Z2hcbiAgICAvLyBhbmQgd2hpY2ggd291bGQgb3RoZXJ3aXNlIHRocm93IHRoZSBjb21wb25lbnQgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gKHNpbmNlIE1hdGgubWF4KE5hTiwgMCkgPT09IE5hTikuXG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuX3RhYnMubGVuZ3RoIC0gMSwgTWF0aC5tYXgoaW5kZXggfHwgMCwgMCkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggdGFiIGxhYmVsIGVsZW1lbnQgKi9cbiAgX2dldFRhYkxhYmVsSWQoaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYG1hdC10YWItbGFiZWwtJHt0aGlzLl9ncm91cElkfS0ke2l9YDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgdW5pcXVlIGlkIGZvciBlYWNoIHRhYiBjb250ZW50IGVsZW1lbnQgKi9cbiAgX2dldFRhYkNvbnRlbnRJZChpOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbWF0LXRhYi1jb250ZW50LSR7dGhpcy5fZ3JvdXBJZH0tJHtpfWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSBib2R5IHdyYXBwZXIgdG8gdGhlIGhlaWdodCBvZiB0aGUgYWN0aXZhdGluZyB0YWIgaWYgZHluYW1pY1xuICAgKiBoZWlnaHQgcHJvcGVydHkgaXMgdHJ1ZS5cbiAgICovXG4gIF9zZXRUYWJCb2R5V3JhcHBlckhlaWdodCh0YWJIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZHluYW1pY0hlaWdodCB8fCAhdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVyOiBIVE1MRWxlbWVudCA9IHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IHRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0ICsgJ3B4JztcblxuICAgIC8vIFRoaXMgY29uZGl0aW9uYWwgZm9yY2VzIHRoZSBicm93c2VyIHRvIHBhaW50IHRoZSBoZWlnaHQgc28gdGhhdFxuICAgIC8vIHRoZSBhbmltYXRpb24gdG8gdGhlIG5ldyBoZWlnaHQgY2FuIGhhdmUgYW4gb3JpZ2luLlxuICAgIGlmICh0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSB0YWJIZWlnaHQgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBib2R5IHdyYXBwZXIuICovXG4gIF9yZW1vdmVUYWJCb2R5V3JhcHBlckhlaWdodCgpOiB2b2lkIHtcbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCA9IHdyYXBwZXIuY2xpZW50SGVpZ2h0O1xuICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgdGhpcy5hbmltYXRpb25Eb25lLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgY2xpY2sgZXZlbnRzLCBzZXR0aW5nIG5ldyBzZWxlY3RlZCBpbmRleCBpZiBhcHByb3ByaWF0ZS4gKi9cbiAgX2hhbmRsZUNsaWNrKHRhYjogTWF0VGFiLCB0YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlciwgaW5kZXg6IG51bWJlcikge1xuICAgIGlmICghdGFiLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0YWJIZWFkZXIuZm9jdXNJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXRyaWV2ZXMgdGhlIHRhYmluZGV4IGZvciB0aGUgdGFiLiAqL1xuICBfZ2V0VGFiSW5kZXgodGFiOiBNYXRUYWIsIGluZGV4OiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAodGFiLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSB0aGlzLl9sYXN0Rm9jdXNlZFRhYkluZGV4ID8/IHRoaXMuc2VsZWN0ZWRJbmRleDtcbiAgICByZXR1cm4gaW5kZXggPT09IHRhcmdldEluZGV4ID8gMCA6IC0xO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIGZvciB3aGVuIHRoZSBmb2N1c2VkIHN0YXRlIG9mIGEgdGFiIGhhcyBjaGFuZ2VkLiAqL1xuICBfdGFiRm9jdXNDaGFuZ2VkKGZvY3VzT3JpZ2luOiBGb2N1c09yaWdpbiwgaW5kZXg6IG51bWJlcikge1xuICAgIC8vIE1vdXNlL3RvdWNoIGZvY3VzIGhhcHBlbnMgZHVyaW5nIHRoZSBgbW91c2Vkb3duYC9gdG91Y2hzdGFydGAgcGhhc2Ugd2hpY2hcbiAgICAvLyBjYW4gY2F1c2UgdGhlIHRhYiB0byBiZSBtb3ZlZCBvdXQgZnJvbSB1bmRlciB0aGUgcG9pbnRlciwgaW50ZXJydXB0aW5nIHRoZVxuICAgIC8vIGNsaWNrIHNlcXVlbmNlIChzZWUgIzIxODk4KS4gV2UgZG9uJ3QgbmVlZCB0byBzY3JvbGwgdGhlIHRhYiBpbnRvIHZpZXcgZm9yXG4gICAgLy8gc3VjaCBjYXNlcyBhbnl3YXksIGJlY2F1c2UgaXQgd2lsbCBiZSBkb25lIHdoZW4gdGhlIHRhYiBiZWNvbWVzIHNlbGVjdGVkLlxuICAgIGlmIChmb2N1c09yaWdpbiAmJiBmb2N1c09yaWdpbiAhPT0gJ21vdXNlJyAmJiBmb2N1c09yaWdpbiAhPT0gJ3RvdWNoJykge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLmZvY3VzSW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gdGFiLWdyb3VwIGNvbXBvbmVudC4gU3VwcG9ydHMgYmFzaWMgdGFiIHBhaXJzIChsYWJlbCArIGNvbnRlbnQpIGFuZCBpbmNsdWRlc1xuICogYW5pbWF0ZWQgaW5rLWJhciwga2V5Ym9hcmQgbmF2aWdhdGlvbiwgYW5kIHNjcmVlbiByZWFkZXIuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdGFicy5odG1sXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFRhYkdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItZ3JvdXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTUFUX1RBQl9HUk9VUCxcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXRUYWJHcm91cCxcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItZ3JvdXAnLFxuICAgICdbY2xhc3MubWF0LXRhYi1ncm91cC1keW5hbWljLWhlaWdodF0nOiAnZHluYW1pY0hlaWdodCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWludmVydGVkLWhlYWRlcl0nOiAnaGVhZGVyUG9zaXRpb24gPT09IFwiYmVsb3dcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwIGV4dGVuZHMgX01hdFRhYkdyb3VwQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsVGFiczogUXVlcnlMaXN0PE1hdFRhYj47XG4gIEBWaWV3Q2hpbGQoJ3RhYkJvZHlXcmFwcGVyJykgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJIZWFkZXInKSBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfVEFCU19DT05GSUcpIEBPcHRpb25hbCgpIGRlZmF1bHRDb25maWc/OiBNYXRUYWJzQ29uZmlnLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvclJlZiwgZGVmYXVsdENvbmZpZywgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiIsIjxtYXQtdGFiLWhlYWRlciAjdGFiSGVhZGVyXG4gICAgICAgICAgICAgICBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4IHx8IDBcIlxuICAgICAgICAgICAgICAgW2Rpc2FibGVSaXBwbGVdPVwiZGlzYWJsZVJpcHBsZVwiXG4gICAgICAgICAgICAgICBbZGlzYWJsZVBhZ2luYXRpb25dPVwiZGlzYWJsZVBhZ2luYXRpb25cIlxuICAgICAgICAgICAgICAgKGluZGV4Rm9jdXNlZCk9XCJfZm9jdXNDaGFuZ2VkKCRldmVudClcIlxuICAgICAgICAgICAgICAgKHNlbGVjdEZvY3VzZWRJbmRleCk9XCJzZWxlY3RlZEluZGV4ID0gJGV2ZW50XCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWxhYmVsIG1hdC1mb2N1cy1pbmRpY2F0b3JcIiByb2xlPVwidGFiXCIgbWF0VGFiTGFiZWxXcmFwcGVyIG1hdC1yaXBwbGVcbiAgICAgICBjZGtNb25pdG9yRWxlbWVudEZvY3VzXG4gICAgICAgKm5nRm9yPVwibGV0IHRhYiBvZiBfdGFiczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgW2lkXT1cIl9nZXRUYWJMYWJlbElkKGkpXCJcbiAgICAgICBbYXR0ci50YWJJbmRleF09XCJfZ2V0VGFiSW5kZXgodGFiLCBpKVwiXG4gICAgICAgW2F0dHIuYXJpYS1wb3NpbnNldF09XCJpICsgMVwiXG4gICAgICAgW2F0dHIuYXJpYS1zZXRzaXplXT1cIl90YWJzLmxlbmd0aFwiXG4gICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJfZ2V0VGFiQ29udGVudElkKGkpXCJcbiAgICAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cInNlbGVjdGVkSW5kZXggPT09IGlcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwidGFiLmFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiKCF0YWIuYXJpYUxhYmVsICYmIHRhYi5hcmlhTGFiZWxsZWRieSkgPyB0YWIuYXJpYUxhYmVsbGVkYnkgOiBudWxsXCJcbiAgICAgICBbY2xhc3MubWF0LXRhYi1sYWJlbC1hY3RpdmVdPVwic2VsZWN0ZWRJbmRleCA9PT0gaVwiXG4gICAgICAgW25nQ2xhc3NdPVwidGFiLmxhYmVsQ2xhc3NcIlxuICAgICAgIFtkaXNhYmxlZF09XCJ0YWIuZGlzYWJsZWRcIlxuICAgICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJ0YWIuZGlzYWJsZWQgfHwgZGlzYWJsZVJpcHBsZVwiXG4gICAgICAgKGNsaWNrKT1cIl9oYW5kbGVDbGljayh0YWIsIHRhYkhlYWRlciwgaSlcIlxuICAgICAgIChjZGtGb2N1c0NoYW5nZSk9XCJfdGFiRm9jdXNDaGFuZ2VkKCRldmVudCwgaSlcIj5cblxuXG4gICAgPGRpdiBjbGFzcz1cIm1hdC10YWItbGFiZWwtY29udGVudFwiPlxuICAgICAgPCEtLSBJZiB0aGVyZSBpcyBhIGxhYmVsIHRlbXBsYXRlLCB1c2UgaXQuIC0tPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cInRhYi50ZW1wbGF0ZUxhYmVsXCIgW25nSWZFbHNlXT1cInRhYlRleHRMYWJlbFwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF09XCJ0YWIudGVtcGxhdGVMYWJlbFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICA8IS0tIElmIHRoZXJlIGlzIG5vdCBhIGxhYmVsIHRlbXBsYXRlLCBmYWxsIGJhY2sgdG8gdGhlIHRleHQgbGFiZWwuIC0tPlxuICAgICAgPG5nLXRlbXBsYXRlICN0YWJUZXh0TGFiZWw+e3t0YWIudGV4dExhYmVsfX08L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbWF0LXRhYi1oZWFkZXI+XG5cbjxkaXZcbiAgY2xhc3M9XCJtYXQtdGFiLWJvZHktd3JhcHBlclwiXG4gIFtjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV09XCJfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJ1wiXG4gICN0YWJCb2R5V3JhcHBlcj5cbiAgPG1hdC10YWItYm9keSByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHRhYiBvZiBfdGFiczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgICAgICAgICBbaWRdPVwiX2dldFRhYkNvbnRlbnRJZChpKVwiXG4gICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCIoY29udGVudFRhYkluZGV4ICE9IG51bGwgJiYgc2VsZWN0ZWRJbmRleCA9PT0gaSkgPyBjb250ZW50VGFiSW5kZXggOiBudWxsXCJcbiAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0VGFiTGFiZWxJZChpKVwiXG4gICAgICAgICAgICAgICBbY2xhc3MubWF0LXRhYi1ib2R5LWFjdGl2ZV09XCJzZWxlY3RlZEluZGV4ID09PSBpXCJcbiAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInRhYi5ib2R5Q2xhc3NcIlxuICAgICAgICAgICAgICAgW2NvbnRlbnRdPVwidGFiLmNvbnRlbnQhXCJcbiAgICAgICAgICAgICAgIFtwb3NpdGlvbl09XCJ0YWIucG9zaXRpb24hXCJcbiAgICAgICAgICAgICAgIFtvcmlnaW5dPVwidGFiLm9yaWdpblwiXG4gICAgICAgICAgICAgICBbYW5pbWF0aW9uRHVyYXRpb25dPVwiYW5pbWF0aW9uRHVyYXRpb25cIlxuICAgICAgICAgICAgICAgKF9vbkNlbnRlcmVkKT1cIl9yZW1vdmVUYWJCb2R5V3JhcHBlckhlaWdodCgpXCJcbiAgICAgICAgICAgICAgIChfb25DZW50ZXJpbmcpPVwiX3NldFRhYkJvZHlXcmFwcGVySGVpZ2h0KCRldmVudClcIj5cbiAgPC9tYXQtdGFiLWJvZHk+XG48L2Rpdj5cbiJdfQ==