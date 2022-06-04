/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { AfterContentInit, ElementRef, EventEmitter, InjectionToken, NgZone, OnDestroy, ViewContainerRef } from '@angular/core';
import { MatMenuItem } from './menu-item';
import { MatMenuPanel } from './menu-panel';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the menu is open. */
export declare const MAT_MENU_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare const MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_MENU_SCROLL_STRATEGY_FACTORY;
};
/** Default top padding of the menu panel. */
export declare const MENU_PANEL_TOP_PADDING = 8;
export declare abstract class _MatMenuTriggerBase implements AfterContentInit, OnDestroy {
    private _overlay;
    private _element;
    private _viewContainerRef;
    private _menuItemInstance;
    private _dir;
    private _focusMonitor;
    private _ngZone?;
    private _portal;
    private _overlayRef;
    private _menuOpen;
    private _closingActionsSubscription;
    private _hoverSubscription;
    private _menuCloseSubscription;
    private _scrollStrategy;
    /**
     * We're specifically looking for a `MatMenu` here since the generic `MatMenuPanel`
     * interface lacks some functionality around nested menus and animations.
     */
    private _parentMaterialMenu;
    /**
     * Handles touch start events on the trigger.
     * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
     */
    private _handleTouchStart;
    _openedBy: Exclude<FocusOrigin, 'program' | null> | undefined;
    /**
     * @deprecated
     * @breaking-change 8.0.0
     */
    get _deprecatedMatMenuTriggerFor(): MatMenuPanel;
    set _deprecatedMatMenuTriggerFor(v: MatMenuPanel);
    /** References the menu instance that the trigger is associated with. */
    get menu(): MatMenuPanel;
    set menu(menu: MatMenuPanel);
    private _menu;
    /** Data to be passed along to any lazily-rendered content. */
    menuData: any;
    /**
     * Whether focus should be restored when the menu is closed.
     * Note that disabling this option can have accessibility implications
     * and it's up to you to manage focus, if you decide to turn it off.
     */
    restoreFocus: boolean;
    /** Event emitted when the associated menu is opened. */
    readonly menuOpened: EventEmitter<void>;
    /**
     * Event emitted when the associated menu is opened.
     * @deprecated Switch to `menuOpened` instead
     * @breaking-change 8.0.0
     */
    readonly onMenuOpen: EventEmitter<void>;
    /** Event emitted when the associated menu is closed. */
    readonly menuClosed: EventEmitter<void>;
    /**
     * Event emitted when the associated menu is closed.
     * @deprecated Switch to `menuClosed` instead
     * @breaking-change 8.0.0
     */
    readonly onMenuClose: EventEmitter<void>;
    constructor(overlay: Overlay, element: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef, scrollStrategy: any, parentMenu: MatMenuPanel, menuItemInstance: MatMenuItem, dir: Directionality, focusMonitor: FocusMonitor, ngZone: NgZone);
    /**
     * @deprecated `focusMonitor` will become a required parameter.
     * @breaking-change 8.0.0
     */
    constructor(overlay: Overlay, element: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef, scrollStrategy: any, parentMenu: MatMenuPanel, menuItemInstance: MatMenuItem, dir: Directionality, focusMonitor?: FocusMonitor | null);
    /**
     * @deprecated `ngZone` will become a required parameter.
     * @breaking-change 15.0.0
     */
    constructor(overlay: Overlay, element: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef, scrollStrategy: any, parentMenu: MatMenuPanel, menuItemInstance: MatMenuItem, dir: Directionality, focusMonitor: FocusMonitor);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Whether the menu is open. */
    get menuOpen(): boolean;
    /** The text direction of the containing app. */
    get dir(): Direction;
    /** Whether the menu triggers a sub-menu or a top-level one. */
    triggersSubmenu(): boolean;
    /** Toggles the menu between the open and closed states. */
    toggleMenu(): void;
    /** Opens the menu. */
    openMenu(): void;
    /** Closes the menu. */
    closeMenu(): void;
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    /**
     * Updates the position of the menu to ensure that it fits all options within the viewport.
     */
    updatePosition(): void;
    /** Closes the menu and does the necessary cleanup. */
    private _destroyMenu;
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    private _initMenu;
    /** Updates the menu elevation based on the amount of parent menus that it has. */
    private _setMenuElevation;
    private _setIsMenuOpen;
    /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     */
    private _checkMenu;
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    private _createOverlay;
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    private _getOverlayConfig;
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions;
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    private _setPosition;
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    private _menuClosingActions;
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event: MouseEvent): void;
    /** Handles key presses on the trigger. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Handles click events on the trigger. */
    _handleClick(event: MouseEvent): void;
    /** Handles the cases where the user hovers over the trigger. */
    private _handleHover;
    /** Gets the portal that should be attached to the overlay. */
    private _getPortal;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatMenuTriggerBase, [null, null, null, null, { optional: true; }, { optional: true; self: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatMenuTriggerBase, never, never, { "_deprecatedMatMenuTriggerFor": "mat-menu-trigger-for"; "menu": "matMenuTriggerFor"; "menuData": "matMenuTriggerData"; "restoreFocus": "matMenuTriggerRestoreFocus"; }, { "menuOpened": "menuOpened"; "onMenuOpen": "onMenuOpen"; "menuClosed": "menuClosed"; "onMenuClose": "onMenuClose"; }, never>;
}
/** Directive applied to an element that should trigger a `mat-menu`. */
export declare class MatMenuTrigger extends _MatMenuTriggerBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatMenuTrigger, "[mat-menu-trigger-for], [matMenuTriggerFor]", ["matMenuTrigger"], {}, {}, never>;
}
