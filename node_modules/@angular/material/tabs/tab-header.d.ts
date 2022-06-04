/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, QueryList, AfterViewInit } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatInkBar } from './ink-bar';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { Platform } from '@angular/cdk/platform';
import { MatPaginatedTabHeader } from './paginated-tab-header';
import * as i0 from "@angular/core";
/**
 * Base class with all of the `MatTabHeader` functionality.
 * @docs-private
 */
export declare abstract class _MatTabHeaderBase extends MatPaginatedTabHeader implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {
    /** Whether the ripple effect is disabled or not. */
    get disableRipple(): boolean;
    set disableRipple(value: BooleanInput);
    private _disableRipple;
    constructor(elementRef: ElementRef, changeDetectorRef: ChangeDetectorRef, viewportRuler: ViewportRuler, dir: Directionality, ngZone: NgZone, platform: Platform, animationMode?: string);
    protected _itemSelected(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatTabHeaderBase, [null, null, null, { optional: true; }, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatTabHeaderBase, never, never, { "disableRipple": "disableRipple"; }, {}, never>;
}
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
export declare class MatTabHeader extends _MatTabHeaderBase {
    _items: QueryList<MatTabLabelWrapper>;
    _inkBar: MatInkBar;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    _tabListInner: ElementRef;
    _nextPaginator: ElementRef<HTMLElement>;
    _previousPaginator: ElementRef<HTMLElement>;
    constructor(elementRef: ElementRef, changeDetectorRef: ChangeDetectorRef, viewportRuler: ViewportRuler, dir: Directionality, ngZone: NgZone, platform: Platform, animationMode?: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabHeader, [null, null, null, { optional: true; }, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabHeader, "mat-tab-header", never, { "selectedIndex": "selectedIndex"; }, { "selectFocusedIndex": "selectFocusedIndex"; "indexFocused": "indexFocused"; }, ["_items"], ["*"]>;
}
