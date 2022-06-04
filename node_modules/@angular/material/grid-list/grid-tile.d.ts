/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, QueryList, AfterContentInit } from '@angular/core';
import { MatLine } from '@angular/material/core';
import { NumberInput } from '@angular/cdk/coercion';
import { MatGridListBase } from './grid-list-base';
import * as i0 from "@angular/core";
export declare class MatGridTile {
    private _element;
    _gridList?: MatGridListBase | undefined;
    _rowspan: number;
    _colspan: number;
    constructor(_element: ElementRef<HTMLElement>, _gridList?: MatGridListBase | undefined);
    /** Amount of rows that the grid tile takes up. */
    get rowspan(): number;
    set rowspan(value: NumberInput);
    /** Amount of columns that the grid tile takes up. */
    get colspan(): number;
    set colspan(value: NumberInput);
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    _setStyle(property: string, value: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridTile, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatGridTile, "mat-grid-tile", ["matGridTile"], { "rowspan": "rowspan"; "colspan": "colspan"; }, {}, never, ["*"]>;
}
export declare class MatGridTileText implements AfterContentInit {
    private _element;
    _lines: QueryList<MatLine>;
    constructor(_element: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridTileText, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatGridTileText, "mat-grid-tile-header, mat-grid-tile-footer", never, {}, {}, ["_lines"], ["[mat-grid-avatar], [matGridAvatar]", "[mat-line], [matLine]", "*"]>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridAvatarCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridAvatarCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatGridAvatarCssMatStyler, "[mat-grid-avatar], [matGridAvatar]", never, {}, {}, never>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridTileHeaderCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridTileHeaderCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatGridTileHeaderCssMatStyler, "mat-grid-tile-header", never, {}, {}, never>;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridTileFooterCssMatStyler {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridTileFooterCssMatStyler, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatGridTileFooterCssMatStyler, "mat-grid-tile-footer", never, {}, {}, never>;
}
