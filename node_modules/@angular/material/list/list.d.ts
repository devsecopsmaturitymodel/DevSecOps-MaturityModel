/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ElementRef, QueryList, OnChanges, OnDestroy, ChangeDetectorRef, InjectionToken } from '@angular/core';
import { CanDisable, CanDisableRipple, MatLine } from '@angular/material/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatListBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & {
    new (): {};
};
/** @docs-private */
declare const _MatListItemMixinBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & {
    new (): {};
};
/**
 * Injection token that can be used to inject instances of `MatList`. It serves as
 * alternative token to the actual `MatList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const MAT_LIST: InjectionToken<MatList>;
/**
 * Injection token that can be used to inject instances of `MatNavList`. It serves as
 * alternative token to the actual `MatNavList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const MAT_NAV_LIST: InjectionToken<MatNavList>;
export declare class MatNavList extends _MatListBase implements CanDisable, CanDisableRipple, OnChanges, OnDestroy {
    /** Emits when the state of the list changes. */
    readonly _stateChanges: Subject<void>;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNavList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatNavList, "mat-nav-list", ["matNavList"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, never, ["*"]>;
}
export declare class MatList extends _MatListBase implements CanDisable, CanDisableRipple, OnChanges, OnDestroy {
    private _elementRef;
    /** Emits when the state of the list changes. */
    readonly _stateChanges: Subject<void>;
    constructor(_elementRef: ElementRef<HTMLElement>);
    _getListType(): 'list' | 'action-list' | null;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatList, "mat-list, mat-action-list", ["matList"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, never, ["*"]>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListAvatarCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListAvatarCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListAvatarCssMatStyler, "[mat-list-avatar], [matListAvatar]", never, {}, {}, never>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListIconCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListIconCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListIconCssMatStyler, "[mat-list-icon], [matListIcon]", never, {}, {}, never>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListSubheaderCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListSubheaderCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatListSubheaderCssMatStyler, "[mat-subheader], [matSubheader]", never, {}, {}, never>;
}
/** An item within a Material Design list. */
export declare class MatListItem extends _MatListItemMixinBase implements AfterContentInit, CanDisableRipple, OnDestroy {
    private _element;
    private _isInteractiveList;
    private _list?;
    private readonly _destroyed;
    _lines: QueryList<MatLine>;
    _avatar: MatListAvatarCssMatStyler;
    _icon: MatListIconCssMatStyler;
    constructor(_element: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, navList?: MatNavList, list?: MatList);
    /** Whether the option is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Whether this list item should show a ripple effect when clicked. */
    _isRippleDisabled(): boolean;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatListItem, [null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatListItem, "mat-list-item, a[mat-list-item], button[mat-list-item]", ["matListItem"], { "disableRipple": "disableRipple"; "disabled": "disabled"; }, {}, ["_avatar", "_icon", "_lines"], ["[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]", "[mat-line], [matLine]", "*"]>;
}
export {};
