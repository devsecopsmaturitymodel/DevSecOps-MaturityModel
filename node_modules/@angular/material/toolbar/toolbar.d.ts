/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { CanColor } from '@angular/material/core';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatToolbarBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
export declare class MatToolbarRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbarRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatToolbarRow, "mat-toolbar-row", ["matToolbarRow"], {}, {}, never>;
}
export declare class MatToolbar extends _MatToolbarBase implements CanColor, AfterViewInit {
    private _platform;
    private _document;
    /** Reference to all toolbar row elements that have been projected. */
    _toolbarRows: QueryList<MatToolbarRow>;
    constructor(elementRef: ElementRef, _platform: Platform, document?: any);
    ngAfterViewInit(): void;
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    private _checkToolbarMixedModes;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatToolbar, "mat-toolbar", ["matToolbar"], { "color": "color"; }, {}, ["_toolbarRows"], ["*", "mat-toolbar-row"]>;
}
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export declare function throwToolbarMixedModesError(): void;
export {};
