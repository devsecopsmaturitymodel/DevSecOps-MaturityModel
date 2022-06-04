/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, QueryList, ElementRef, NgZone } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from './drawer';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import * as i0 from "@angular/core";
export declare class MatSidenavContent extends MatDrawerContent {
    constructor(changeDetectorRef: ChangeDetectorRef, container: MatSidenavContainer, elementRef: ElementRef<HTMLElement>, scrollDispatcher: ScrollDispatcher, ngZone: NgZone);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSidenavContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSidenavContent, "mat-sidenav-content", never, {}, {}, never, ["*"]>;
}
export declare class MatSidenav extends MatDrawer {
    /** Whether the sidenav is fixed in the viewport. */
    get fixedInViewport(): boolean;
    set fixedInViewport(value: BooleanInput);
    private _fixedInViewport;
    /**
     * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
     * mode.
     */
    get fixedTopGap(): number;
    set fixedTopGap(value: NumberInput);
    private _fixedTopGap;
    /**
     * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
     * fixed mode.
     */
    get fixedBottomGap(): number;
    set fixedBottomGap(value: NumberInput);
    private _fixedBottomGap;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSidenav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSidenav, "mat-sidenav", ["matSidenav"], { "fixedInViewport": "fixedInViewport"; "fixedTopGap": "fixedTopGap"; "fixedBottomGap": "fixedBottomGap"; }, {}, never, ["*"]>;
}
export declare class MatSidenavContainer extends MatDrawerContainer {
    _allDrawers: QueryList<MatSidenav>;
    _content: MatSidenavContent;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSidenavContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSidenavContainer, "mat-sidenav-container", ["matSidenavContainer"], {}, {}, ["_content", "_allDrawers"], ["mat-sidenav", "mat-sidenav-content", "*"]>;
}
