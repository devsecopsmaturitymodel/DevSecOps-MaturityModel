/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, QueryList } from '@angular/core';
import { CanDisable, CanDisableRipple, HasTabIndex, RippleConfig, RippleGlobalOptions, RippleTarget, ThemePalette } from '@angular/material/core';
import { MatInkBar } from '../ink-bar';
import { MatPaginatedTabHeader, MatPaginatedTabHeaderItem } from '../paginated-tab-header';
import * as i0 from "@angular/core";
/**
 * Base class with all of the `MatTabNav` functionality.
 * @docs-private
 */
export declare abstract class _MatTabNavBase extends MatPaginatedTabHeader implements AfterContentChecked, AfterContentInit, OnDestroy {
    /** Query list of all tab links of the tab navigation. */
    abstract _items: QueryList<MatPaginatedTabHeaderItem & {
        active: boolean;
        id: string;
    }>;
    /** Background color of the tab nav. */
    get backgroundColor(): ThemePalette;
    set backgroundColor(value: ThemePalette);
    private _backgroundColor;
    /** Whether the ripple effect is disabled or not. */
    get disableRipple(): boolean;
    set disableRipple(value: BooleanInput);
    private _disableRipple;
    /** Theme color of the nav bar. */
    color: ThemePalette;
    /**
     * Associated tab panel controlled by the nav bar. If not provided, then the nav bar
     * follows the ARIA link / navigation landmark pattern. If provided, it follows the
     * ARIA tabs design pattern.
     */
    tabPanel?: MatTabNavPanel;
    constructor(elementRef: ElementRef, dir: Directionality, ngZone: NgZone, changeDetectorRef: ChangeDetectorRef, viewportRuler: ViewportRuler, platform: Platform, animationMode?: string);
    protected _itemSelected(): void;
    ngAfterContentInit(): void;
    /** Notifies the component that the active link has been changed. */
    updateActiveLink(): void;
    _getRole(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatTabNavBase, [null, { optional: true; }, null, null, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatTabNavBase, never, never, { "backgroundColor": "backgroundColor"; "disableRipple": "disableRipple"; "color": "color"; "tabPanel": "tabPanel"; }, {}, never>;
}
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class MatTabNav extends _MatTabNavBase {
    _items: QueryList<MatTabLink>;
    _inkBar: MatInkBar;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    _tabListInner: ElementRef;
    _nextPaginator: ElementRef<HTMLElement>;
    _previousPaginator: ElementRef<HTMLElement>;
    constructor(elementRef: ElementRef, dir: Directionality, ngZone: NgZone, changeDetectorRef: ChangeDetectorRef, viewportRuler: ViewportRuler, platform: Platform, animationMode?: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabNav, [null, { optional: true; }, null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabNav, "[mat-tab-nav-bar]", ["matTabNavBar", "matTabNav"], { "color": "color"; }, {}, ["_items"], ["*"]>;
}
declare const _MatTabLinkMixinBase: import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/** Base class with all of the `MatTabLink` functionality. */
export declare class _MatTabLinkBase extends _MatTabLinkMixinBase implements AfterViewInit, OnDestroy, CanDisable, CanDisableRipple, HasTabIndex, RippleTarget, FocusableOption {
    private _tabNavBar;
    /** @docs-private */ elementRef: ElementRef;
    private _focusMonitor;
    /** Whether the tab link is active or not. */
    protected _isActive: boolean;
    /** Whether the link is active. */
    get active(): boolean;
    set active(value: BooleanInput);
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the tab link ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    get rippleDisabled(): boolean;
    /** Unique id for the tab. */
    id: string;
    constructor(_tabNavBar: _MatTabNavBase, 
    /** @docs-private */ elementRef: ElementRef, globalRippleOptions: RippleGlobalOptions | null, tabIndex: string, _focusMonitor: FocusMonitor, animationMode?: string);
    /** Focuses the tab link. */
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _handleFocus(): void;
    _handleKeydown(event: KeyboardEvent): void;
    _getAriaControls(): string | null;
    _getAriaSelected(): string | null;
    _getAriaCurrent(): string | null;
    _getRole(): string | null;
    _getTabIndex(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatTabLinkBase, [null, null, { optional: true; }, { attribute: "tabindex"; }, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatTabLinkBase, never, never, { "active": "active"; "id": "id"; }, {}, never>;
}
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export declare class MatTabLink extends _MatTabLinkBase implements OnDestroy {
    /** Reference to the RippleRenderer for the tab-link. */
    private _tabLinkRipple;
    constructor(tabNavBar: MatTabNav, elementRef: ElementRef, ngZone: NgZone, platform: Platform, globalRippleOptions: RippleGlobalOptions | null, tabIndex: string, focusMonitor: FocusMonitor, animationMode?: string);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabLink, [null, null, null, null, { optional: true; }, { attribute: "tabindex"; }, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabLink, "[mat-tab-link], [matTabLink]", ["matTabLink"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; }, {}, never>;
}
/**
 * Tab panel component associated with MatTabNav.
 */
export declare class MatTabNavPanel {
    /** Unique id for the tab panel. */
    id: string;
    /** Id of the active tab in the nav bar. */
    _activeTabId?: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabNavPanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabNavPanel, "mat-tab-nav-panel", ["matTabNavPanel"], { "id": "id"; }, {}, never, ["*"]>;
}
export {};
