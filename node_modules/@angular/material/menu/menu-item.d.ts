/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CanDisable, CanDisableRipple } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatMenuPanel } from './menu-panel';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatMenuItemBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export declare class MatMenuItem extends _MatMenuItemBase implements FocusableOption, CanDisable, CanDisableRipple, AfterViewInit, OnDestroy {
    private _elementRef;
    private _document?;
    private _focusMonitor?;
    _parentMenu?: MatMenuPanel<MatMenuItem> | undefined;
    private _changeDetectorRef?;
    /** ARIA role for the menu item. */
    role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
    /** Stream that emits when the menu item is hovered. */
    readonly _hovered: Subject<MatMenuItem>;
    /** Stream that emits when the menu item is focused. */
    readonly _focused: Subject<MatMenuItem>;
    /** Whether the menu item is highlighted. */
    _highlighted: boolean;
    /** Whether the menu item acts as a trigger for a sub-menu. */
    _triggersSubmenu: boolean;
    constructor(elementRef: ElementRef<HTMLElement>, document: any, focusMonitor: FocusMonitor, parentMenu: MatMenuPanel<MatMenuItem> | undefined, changeDetectorRef: ChangeDetectorRef);
    /**
     * @deprecated `document`, `changeDetectorRef` and `focusMonitor` to become required.
     * @breaking-change 12.0.0
     */
    constructor(elementRef: ElementRef<HTMLElement>, document?: any, focusMonitor?: FocusMonitor, parentMenu?: MatMenuPanel<MatMenuItem>, changeDetectorRef?: ChangeDetectorRef);
    /** Focuses the menu item. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Used to set the `tabindex`. */
    _getTabIndex(): string;
    /** Returns the host DOM element. */
    _getHostElement(): HTMLElement;
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event: Event): void;
    /** Emits to the hover stream. */
    _handleMouseEnter(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
    _setHighlighted(isHighlighted: boolean): void;
    _hasFocus(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuItem, [null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMenuItem, "[mat-menu-item]", ["matMenuItem"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "role": "role"; }, {}, never, ["*"]>;
}
export {};
