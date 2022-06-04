/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { SPACE } from '@angular/cdk/keycodes';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinDisabled, mixinDisableRipple, mixinTabIndex, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatInkBar } from '../ink-bar';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/material/core";
import * as i5 from "@angular/cdk/observers";
import * as i6 from "../ink-bar";
import * as i7 from "@angular/cdk/a11y";
// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;
/**
 * Base class with all of the `MatTabNav` functionality.
 * @docs-private
 */
export class _MatTabNavBase extends MatPaginatedTabHeader {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
        this._disableRipple = false;
        /** Theme color of the nav bar. */
        this.color = 'primary';
    }
    /** Background color of the tab nav. */
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(value) {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(`mat-background-${this.backgroundColor}`);
        if (value) {
            classList.add(`mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    _itemSelected() {
        // noop
    }
    ngAfterContentInit() {
        // We need this to run before the `changes` subscription in parent to ensure that the
        // selectedIndex is up-to-date by the time the super class starts looking for it.
        this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            this.updateActiveLink();
        });
        super.ngAfterContentInit();
    }
    /** Notifies the component that the active link has been changed. */
    updateActiveLink() {
        if (!this._items) {
            return;
        }
        const items = this._items.toArray();
        for (let i = 0; i < items.length; i++) {
            if (items[i].active) {
                this.selectedIndex = i;
                this._changeDetectorRef.markForCheck();
                if (this.tabPanel) {
                    this.tabPanel._activeTabId = items[i].id;
                }
                return;
            }
        }
        // The ink bar should hide itself if no items are active.
        this.selectedIndex = -1;
        this._inkBar.hide();
    }
    _getRole() {
        return this.tabPanel ? 'tablist' : this._elementRef.nativeElement.getAttribute('role');
    }
}
_MatTabNavBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabNavBase, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabNavBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatTabNavBase, inputs: { backgroundColor: "backgroundColor", disableRipple: "disableRipple", color: "color", tabPanel: "tabPanel" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabNavBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { backgroundColor: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }], tabPanel: [{
                type: Input
            }] } });
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export class MatTabNav extends _MatTabNavBase {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
        super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
    }
}
MatTabNav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabNav, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTabNav.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTabNav, selector: "[mat-tab-nav-bar]", inputs: { color: "color" }, host: { properties: { "attr.role": "_getRole()", "class.mat-tab-header-pagination-controls-enabled": "_showPaginationControls", "class.mat-tab-header-rtl": "_getLayoutDirection() == 'rtl'", "class.mat-primary": "color !== \"warn\" && color !== \"accent\"", "class.mat-accent": "color === \"accent\"", "class.mat-warn": "color === \"warn\"" }, classAttribute: "mat-tab-nav-bar mat-tab-header" }, queries: [{ propertyName: "_items", predicate: i0.forwardRef(function () { return MatTabLink; }), descendants: true }], viewQueries: [{ propertyName: "_inkBar", first: true, predicate: MatInkBar, descendants: true, static: true }, { propertyName: "_tabListContainer", first: true, predicate: ["tabListContainer"], descendants: true, static: true }, { propertyName: "_tabList", first: true, predicate: ["tabList"], descendants: true, static: true }, { propertyName: "_tabListInner", first: true, predicate: ["tabListInner"], descendants: true, static: true }, { propertyName: "_nextPaginator", first: true, predicate: ["nextPaginator"], descendants: true }, { propertyName: "_previousPaginator", first: true, predicate: ["previousPaginator"], descendants: true }], exportAs: ["matTabNavBar", "matTabNav"], usesInheritance: true, ngImport: i0, template: "<button class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     tabindex=\"-1\"\n     [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     [disabled]=\"_disableScrollBefore || null\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</button>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    #tabList\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<button class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     [disabled]=\"_disableScrollAfter || null\"\n     tabindex=\"-1\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</button>\n", styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-tab-header-pagination::-moz-focus-inner{border:0}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center]>.mat-tab-link-container .mat-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-tab-link-container .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"], directives: [{ type: i4.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i5.CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }, { type: i6.MatInkBar, selector: "mat-ink-bar" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabNav, decorators: [{
            type: Component,
            args: [{ selector: '[mat-tab-nav-bar]', exportAs: 'matTabNavBar, matTabNav', inputs: ['color'], host: {
                        '[attr.role]': '_getRole()',
                        'class': 'mat-tab-nav-bar mat-tab-header',
                        '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                        '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                        '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
                        '[class.mat-accent]': 'color === "accent"',
                        '[class.mat-warn]': 'color === "warn"',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, template: "<button class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     tabindex=\"-1\"\n     [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     [disabled]=\"_disableScrollBefore || null\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</button>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    #tabList\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<button class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     [disabled]=\"_disableScrollAfter || null\"\n     tabindex=\"-1\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</button>\n", styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-tab-header-pagination::-moz-focus-inner{border:0}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center]>.mat-tab-link-container .mat-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-tab-link-container .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _items: [{
                type: ContentChildren,
                args: [forwardRef(() => MatTabLink), { descendants: true }]
            }], _inkBar: [{
                type: ViewChild,
                args: [MatInkBar, { static: true }]
            }], _tabListContainer: [{
                type: ViewChild,
                args: ['tabListContainer', { static: true }]
            }], _tabList: [{
                type: ViewChild,
                args: ['tabList', { static: true }]
            }], _tabListInner: [{
                type: ViewChild,
                args: ['tabListInner', { static: true }]
            }], _nextPaginator: [{
                type: ViewChild,
                args: ['nextPaginator']
            }], _previousPaginator: [{
                type: ViewChild,
                args: ['previousPaginator']
            }] } });
// Boilerplate for applying mixins to MatTabLink.
const _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(class {
})));
/** Base class with all of the `MatTabLink` functionality. */
export class _MatTabLinkBase extends _MatTabLinkMixinBase {
    constructor(_tabNavBar, 
    /** @docs-private */ elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
        super();
        this._tabNavBar = _tabNavBar;
        this.elementRef = elementRef;
        this._focusMonitor = _focusMonitor;
        /** Whether the tab link is active or not. */
        this._isActive = false;
        /** Unique id for the tab. */
        this.id = `mat-tab-link-${nextUniqueId++}`;
        this.rippleConfig = globalRippleOptions || {};
        this.tabIndex = parseInt(tabIndex) || 0;
        if (animationMode === 'NoopAnimations') {
            this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
    }
    /** Whether the link is active. */
    get active() {
        return this._isActive;
    }
    set active(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._isActive) {
            this._isActive = newValue;
            this._tabNavBar.updateActiveLink();
        }
    }
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    get rippleDisabled() {
        return (this.disabled ||
            this.disableRipple ||
            this._tabNavBar.disableRipple ||
            !!this.rippleConfig.disabled);
    }
    /** Focuses the tab link. */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this.elementRef);
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this.elementRef);
    }
    _handleFocus() {
        // Since we allow navigation through tabbing in the nav bar, we
        // have to update the focused index whenever the link receives focus.
        this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
    }
    _handleKeydown(event) {
        if (this._tabNavBar.tabPanel && event.keyCode === SPACE) {
            this.elementRef.nativeElement.click();
        }
    }
    _getAriaControls() {
        return this._tabNavBar.tabPanel
            ? this._tabNavBar.tabPanel?.id
            : this.elementRef.nativeElement.getAttribute('aria-controls');
    }
    _getAriaSelected() {
        if (this._tabNavBar.tabPanel) {
            return this.active ? 'true' : 'false';
        }
        else {
            return this.elementRef.nativeElement.getAttribute('aria-selected');
        }
    }
    _getAriaCurrent() {
        return this.active && !this._tabNavBar.tabPanel ? 'page' : null;
    }
    _getRole() {
        return this._tabNavBar.tabPanel ? 'tab' : this.elementRef.nativeElement.getAttribute('role');
    }
    _getTabIndex() {
        if (this._tabNavBar.tabPanel) {
            return this._isActive ? 0 : -1;
        }
        else {
            return this.tabIndex;
        }
    }
}
_MatTabLinkBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabLinkBase, deps: [{ token: _MatTabNavBase }, { token: i0.ElementRef }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i7.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabLinkBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatTabLinkBase, inputs: { active: "active", id: "id" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatTabLinkBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: _MatTabNavBase }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i7.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { active: [{
                type: Input
            }], id: [{
                type: Input
            }] } });
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export class MatTabLink extends _MatTabLinkBase {
    constructor(tabNavBar, elementRef, ngZone, platform, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
        super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
        this._tabLinkRipple = new RippleRenderer(this, ngZone, elementRef, platform);
        this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._tabLinkRipple._removeTriggerEvents();
    }
}
MatTabLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabLink, deps: [{ token: MatTabNav }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i3.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i7.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatTabLink.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTabLink, selector: "[mat-tab-link], [matTabLink]", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { listeners: { "focus": "_handleFocus()", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-controls": "_getAriaControls()", "attr.aria-current": "_getAriaCurrent()", "attr.aria-disabled": "disabled", "attr.aria-selected": "_getAriaSelected()", "attr.id": "id", "attr.tabIndex": "_getTabIndex()", "attr.role": "_getRole()", "class.mat-tab-disabled": "disabled", "class.mat-tab-label-active": "active" }, classAttribute: "mat-tab-link mat-focus-indicator" }, exportAs: ["matTabLink"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-tab-link], [matTabLink]',
                    exportAs: 'matTabLink',
                    inputs: ['disabled', 'disableRipple', 'tabIndex'],
                    host: {
                        'class': 'mat-tab-link mat-focus-indicator',
                        '[attr.aria-controls]': '_getAriaControls()',
                        '[attr.aria-current]': '_getAriaCurrent()',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.aria-selected]': '_getAriaSelected()',
                        '[attr.id]': 'id',
                        '[attr.tabIndex]': '_getTabIndex()',
                        '[attr.role]': '_getRole()',
                        '[class.mat-tab-disabled]': 'disabled',
                        '[class.mat-tab-label-active]': 'active',
                        '(focus)': '_handleFocus()',
                        '(keydown)': '_handleKeydown($event)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: MatTabNav }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i7.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Tab panel component associated with MatTabNav.
 */
export class MatTabNavPanel {
    constructor() {
        /** Unique id for the tab panel. */
        this.id = `mat-tab-nav-panel-${nextUniqueId++}`;
    }
}
MatTabNavPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabNavPanel, deps: [], target: i0.ɵɵFactoryTarget.Component });
MatTabNavPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTabNavPanel, selector: "mat-tab-nav-panel", inputs: { id: "id" }, host: { attributes: { "role": "tabpanel" }, properties: { "attr.aria-labelledby": "_activeTabId", "attr.id": "id" }, classAttribute: "mat-tab-nav-panel" }, exportAs: ["matTabNavPanel"], ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabNavPanel, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-tab-nav-panel',
                    exportAs: 'matTabNavPanel',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[attr.aria-labelledby]': '_activeTabId',
                        '[attr.id]': 'id',
                        'class': 'mat-tab-nav-panel',
                        'role': 'tabpanel',
                    },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1uYXYtYmFyL3RhYi1uYXYtYmFyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFrQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUlMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFJTCx5QkFBeUIsRUFDekIsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEVBR2IsY0FBYyxHQUdmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxF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bUM7UUFDMUIsT0FBRSxHQUFHLHFCQUFxQixZQUFZLEVBQUUsRUFBRSxDQUFDO0tBSXJEOzsyR0FOWSxjQUFjOytGQUFkLGNBQWMseVFBVmYsMkJBQTJCOzJGQVUxQixjQUFjO2tCQWIxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRTt3QkFDSix3QkFBd0IsRUFBRSxjQUFjO3dCQUN4QyxXQUFXLEVBQUUsSUFBSTt3QkFDakIsT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsTUFBTSxFQUFFLFVBQVU7cUJBQ25CO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7OEJBR1UsRUFBRTtzQkFBVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIEhhc1RhYkluZGV4LFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRJbmtCYXJ9IGZyb20gJy4uL2luay1iYXInO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXIsIE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW19IGZyb20gJy4uL3BhZ2luYXRlZC10YWItaGVhZGVyJztcblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMgZm9yIHRhYiBuYXYgY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJOYXZgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJOYXZCYXNlXG4gIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95XG57XG4gIC8qKiBRdWVyeSBsaXN0IG9mIGFsbCB0YWIgbGlua3Mgb2YgdGhlIHRhYiBuYXZpZ2F0aW9uLiAqL1xuICBhYnN0cmFjdCBvdmVycmlkZSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtICYge2FjdGl2ZTogYm9vbGVhbjsgaWQ6IHN0cmluZ30+O1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgbmF2LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjtcbiAgfVxuICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWNrZ3JvdW5kLSR7dGhpcy5iYWNrZ3JvdW5kQ29sb3J9YCk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoYG1hdC1iYWNrZ3JvdW5kLSR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYmFja2dyb3VuZENvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTtcbiAgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgbmF2IGJhci4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKipcbiAgICogQXNzb2NpYXRlZCB0YWIgcGFuZWwgY29udHJvbGxlZCBieSB0aGUgbmF2IGJhci4gSWYgbm90IHByb3ZpZGVkLCB0aGVuIHRoZSBuYXYgYmFyXG4gICAqIGZvbGxvd3MgdGhlIEFSSUEgbGluayAvIG5hdmlnYXRpb24gbGFuZG1hcmsgcGF0dGVybi4gSWYgcHJvdmlkZWQsIGl0IGZvbGxvd3MgdGhlXG4gICAqIEFSSUEgdGFicyBkZXNpZ24gcGF0dGVybi5cbiAgICovXG4gIEBJbnB1dCgpIHRhYlBhbmVsPzogTWF0VGFiTmF2UGFuZWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZCgpIHtcbiAgICAvLyBub29wXG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGlzIHRvIHJ1biBiZWZvcmUgdGhlIGBjaGFuZ2VzYCBzdWJzY3JpcHRpb24gaW4gcGFyZW50IHRvIGVuc3VyZSB0aGF0IHRoZVxuICAgIC8vIHNlbGVjdGVkSW5kZXggaXMgdXAtdG8tZGF0ZSBieSB0aGUgdGltZSB0aGUgc3VwZXIgY2xhc3Mgc3RhcnRzIGxvb2tpbmcgZm9yIGl0LlxuICAgIHRoaXMuX2l0ZW1zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVBY3RpdmVMaW5rKCk7XG4gICAgfSk7XG5cbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIC8qKiBOb3RpZmllcyB0aGUgY29tcG9uZW50IHRoYXQgdGhlIGFjdGl2ZSBsaW5rIGhhcyBiZWVuIGNoYW5nZWQuICovXG4gIHVwZGF0ZUFjdGl2ZUxpbmsoKSB7XG4gICAgaWYgKCF0aGlzLl9pdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5faXRlbXMudG9BcnJheSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZW1zW2ldLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICBpZiAodGhpcy50YWJQYW5lbCkge1xuICAgICAgICAgIHRoaXMudGFiUGFuZWwuX2FjdGl2ZVRhYklkID0gaXRlbXNbaV0uaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGluayBiYXIgc2hvdWxkIGhpZGUgaXRzZWxmIGlmIG5vIGl0ZW1zIGFyZSBhY3RpdmUuXG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgdGhpcy5faW5rQmFyLmhpZGUoKTtcbiAgfVxuXG4gIF9nZXRSb2xlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnRhYlBhbmVsID8gJ3RhYmxpc3QnIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpO1xuICB9XG59XG5cbi8qKlxuICogTmF2aWdhdGlvbiBjb21wb25lbnQgbWF0Y2hpbmcgdGhlIHN0eWxlcyBvZiB0aGUgdGFiIGdyb3VwIGhlYWRlci5cbiAqIFByb3ZpZGVzIGFuY2hvcmVkIG5hdmlnYXRpb24gd2l0aCBhbmltYXRlZCBpbmsgYmFyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1uYXYtYmFyXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTmF2QmFyLCBtYXRUYWJOYXYnLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICd0YWItbmF2LWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1uYXYtYmFyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnJvbGVdJzogJ19nZXRSb2xlKCknLFxuICAgICdjbGFzcyc6ICdtYXQtdGFiLW5hdi1iYXIgbWF0LXRhYi1oZWFkZXInLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jb250cm9scy1lbmFibGVkXSc6ICdfc2hvd1BhZ2luYXRpb25Db250cm9scycsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1ydGxdJzogXCJfZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ3J0bCdcIixcbiAgICAnW2NsYXNzLm1hdC1wcmltYXJ5XSc6ICdjb2xvciAhPT0gXCJ3YXJuXCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2IGV4dGVuZHMgX01hdFRhYk5hdkJhc2Uge1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0VGFiTGluayksIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9pdGVtczogUXVlcnlMaXN0PE1hdFRhYkxpbms+O1xuICBAVmlld0NoaWxkKE1hdElua0Jhciwge3N0YXRpYzogdHJ1ZX0pIF9pbmtCYXI6IE1hdElua0JhcjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdCcsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdElubmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0SW5uZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InKSBfbmV4dFBhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpb3VzUGFnaW5hdG9yJykgX3ByZXZpb3VzUGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIG5nWm9uZSwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxpbmsuXG5jb25zdCBfTWF0VGFiTGlua01peGluQmFzZSA9IG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoY2xhc3Mge30pKSk7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTGlua2AgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRUYWJMaW5rQmFzZVxuICBleHRlbmRzIF9NYXRUYWJMaW5rTWl4aW5CYXNlXG4gIGltcGxlbWVudHNcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBDYW5EaXNhYmxlLFxuICAgIENhbkRpc2FibGVSaXBwbGUsXG4gICAgSGFzVGFiSW5kZXgsXG4gICAgUmlwcGxlVGFyZ2V0LFxuICAgIEZvY3VzYWJsZU9wdGlvblxue1xuICAvKiogV2hldGhlciB0aGUgdGFiIGxpbmsgaXMgYWN0aXZlIG9yIG5vdC4gKi9cbiAgcHJvdGVjdGVkIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaW5rIGlzIGFjdGl2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNBY3RpdmU7XG4gIH1cbiAgc2V0IGFjdGl2ZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX3RhYk5hdkJhci51cGRhdGVBY3RpdmVMaW5rKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSB0YWIgbGluayByaXBwbGVzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZyAmIFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgb24gaW50ZXJhY3Rpb24uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5kaXNhYmxlZCB8fFxuICAgICAgdGhpcy5kaXNhYmxlUmlwcGxlIHx8XG4gICAgICB0aGlzLl90YWJOYXZCYXIuZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZFxuICAgICk7XG4gIH1cblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgdGFiLiAqL1xuICBASW5wdXQoKSBpZCA9IGBtYXQtdGFiLWxpbmstJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RhYk5hdkJhcjogX01hdFRhYk5hdkJhc2UsXG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi8gcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgaWYgKGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMucmlwcGxlQ29uZmlnLmFuaW1hdGlvbiA9IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSB0YWIgbGluay4gKi9cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuZWxlbWVudFJlZik7XG4gIH1cblxuICBfaGFuZGxlRm9jdXMoKSB7XG4gICAgLy8gU2luY2Ugd2UgYWxsb3cgbmF2aWdhdGlvbiB0aHJvdWdoIHRhYmJpbmcgaW4gdGhlIG5hdiBiYXIsIHdlXG4gICAgLy8gaGF2ZSB0byB1cGRhdGUgdGhlIGZvY3VzZWQgaW5kZXggd2hlbmV2ZXIgdGhlIGxpbmsgcmVjZWl2ZXMgZm9jdXMuXG4gICAgdGhpcy5fdGFiTmF2QmFyLmZvY3VzSW5kZXggPSB0aGlzLl90YWJOYXZCYXIuX2l0ZW1zLnRvQXJyYXkoKS5pbmRleE9mKHRoaXMpO1xuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsICYmIGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRBcmlhQ29udHJvbHMoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbFxuICAgICAgPyB0aGlzLl90YWJOYXZCYXIudGFiUGFuZWw/LmlkXG4gICAgICA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICB9XG5cbiAgX2dldEFyaWFTZWxlY3RlZCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmUgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldEFyaWFDdXJyZW50KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZSAmJiAhdGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsID8gJ3BhZ2UnIDogbnVsbDtcbiAgfVxuXG4gIF9nZXRSb2xlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwgPyAndGFiJyA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpO1xuICB9XG5cbiAgX2dldFRhYkluZGV4KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlID8gMCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50YWJJbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMaW5rIGluc2lkZSBvZiBhIGBtYXQtdGFiLW5hdi1iYXJgLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1saW5rXSwgW21hdFRhYkxpbmtdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJMaW5rJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWxpbmsgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ19nZXRBcmlhQ29udHJvbHMoKScsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnX2dldEFyaWFDdXJyZW50KCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ19nZXRBcmlhU2VsZWN0ZWQoKScsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYkluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19nZXRSb2xlKCknLFxuICAgICdbY2xhc3MubWF0LXRhYi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXRhYi1sYWJlbC1hY3RpdmVdJzogJ2FjdGl2ZScsXG4gICAgJyhmb2N1cyknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkxpbmsgZXh0ZW5kcyBfTWF0VGFiTGlua0Jhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIHRhYi1saW5rLiAqL1xuICBwcml2YXRlIF90YWJMaW5rUmlwcGxlOiBSaXBwbGVSZW5kZXJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YWJOYXZCYXI6IE1hdFRhYk5hdixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnMgfCBudWxsLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIodGFiTmF2QmFyLCBlbGVtZW50UmVmLCBnbG9iYWxSaXBwbGVPcHRpb25zLCB0YWJJbmRleCwgZm9jdXNNb25pdG9yLCBhbmltYXRpb25Nb2RlKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRoaXMsIG5nWm9uZSwgZWxlbWVudFJlZiwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxufVxuXG4vKipcbiAqIFRhYiBwYW5lbCBjb21wb25lbnQgYXNzb2NpYXRlZCB3aXRoIE1hdFRhYk5hdi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1uYXYtcGFuZWwnLFxuICBleHBvcnRBczogJ21hdFRhYk5hdlBhbmVsJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19hY3RpdmVUYWJJZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ2NsYXNzJzogJ21hdC10YWItbmF2LXBhbmVsJyxcbiAgICAncm9sZSc6ICd0YWJwYW5lbCcsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJOYXZQYW5lbCB7XG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSB0YWIgcGFuZWwuICovXG4gIEBJbnB1dCgpIGlkID0gYG1hdC10YWItbmF2LXBhbmVsLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogSWQgb2YgdGhlIGFjdGl2ZSB0YWIgaW4gdGhlIG5hdiBiYXIuICovXG4gIF9hY3RpdmVUYWJJZD86IHN0cmluZztcbn1cbiIsIjxidXR0b24gY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tYmVmb3JlIG1hdC1lbGV2YXRpb24tejRcIlxuICAgICAjcHJldmlvdXNQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgIG1hdC1yaXBwbGVcbiAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEJlZm9yZSB8fCBkaXNhYmxlUmlwcGxlXCJcbiAgICAgW2NsYXNzLm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmVcIlxuICAgICBbZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmUgfHwgbnVsbFwiXG4gICAgIChjbGljayk9XCJfaGFuZGxlUGFnaW5hdG9yQ2xpY2soJ2JlZm9yZScpXCJcbiAgICAgKG1vdXNlZG93bik9XCJfaGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2JlZm9yZScsICRldmVudClcIlxuICAgICAodG91Y2hlbmQpPVwiX3N0b3BJbnRlcnZhbCgpXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNoZXZyb25cIj48L2Rpdj5cbjwvYnV0dG9uPlxuXG48ZGl2IGNsYXNzPVwibWF0LXRhYi1saW5rLWNvbnRhaW5lclwiICN0YWJMaXN0Q29udGFpbmVyIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIj5cbiAgPGRpdlxuICAgIGNsYXNzPVwibWF0LXRhYi1saXN0XCJcbiAgICBbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdPVwiX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydcIlxuICAgICN0YWJMaXN0XG4gICAgKGNka09ic2VydmVDb250ZW50KT1cIl9vbkNvbnRlbnRDaGFuZ2VzKClcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXRhYi1saW5rc1wiICN0YWJMaXN0SW5uZXI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gICAgPG1hdC1pbmstYmFyPjwvbWF0LWluay1iYXI+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxidXR0b24gY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tYWZ0ZXIgbWF0LWVsZXZhdGlvbi16NFwiXG4gICAgICNuZXh0UGFnaW5hdG9yXG4gICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgIHR5cGU9XCJidXR0b25cIlxuICAgICBtYXQtcmlwcGxlXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyIHx8IGRpc2FibGVSaXBwbGVcIlxuICAgICBbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1kaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyXCJcbiAgICAgW2Rpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgfHwgbnVsbFwiXG4gICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAobW91c2Vkb3duKT1cIl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYWZ0ZXInLCAkZXZlbnQpXCJcbiAgICAgKGNsaWNrKT1cIl9oYW5kbGVQYWdpbmF0b3JDbGljaygnYWZ0ZXInKVwiXG4gICAgICh0b3VjaGVuZCk9XCJfc3RvcEludGVydmFsKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tY2hldnJvblwiPjwvZGl2PlxuPC9idXR0b24+XG4iXX0=