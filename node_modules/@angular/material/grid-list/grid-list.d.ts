/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentChecked, OnInit, QueryList, ElementRef } from '@angular/core';
import { MatGridTile } from './grid-tile';
import { TileStyleTarget } from './tile-styler';
import { Directionality } from '@angular/cdk/bidi';
import { NumberInput } from '@angular/cdk/coercion';
import { MatGridListBase } from './grid-list-base';
import * as i0 from "@angular/core";
export declare class MatGridList implements MatGridListBase, OnInit, AfterContentChecked, TileStyleTarget {
    private _element;
    private _dir;
    /** Number of columns being rendered. */
    private _cols;
    /** Used for determiningthe position of each tile in the grid. */
    private _tileCoordinator;
    /**
     * Row height value passed in by user. This can be one of three types:
     * - Number value (ex: "100px"):  sets a fixed row height to that value
     * - Ratio value (ex: "4:3"): sets the row height based on width:height ratio
     * - "Fit" mode (ex: "fit"): sets the row height to total height divided by number of rows
     */
    private _rowHeight;
    /** The amount of space between tiles. This will be something like '5px' or '2em'. */
    private _gutter;
    /** Sets position and size styles for a tile */
    private _tileStyler;
    /** Query list of tiles that are being rendered. */
    _tiles: QueryList<MatGridTile>;
    constructor(_element: ElementRef<HTMLElement>, _dir: Directionality);
    /** Amount of columns in the grid list. */
    get cols(): number;
    set cols(value: NumberInput);
    /** Size of the grid list's gutter in pixels. */
    get gutterSize(): string;
    set gutterSize(value: string);
    /** Set internal representation of row height from the user-provided value. */
    get rowHeight(): string | number;
    set rowHeight(value: string | number);
    ngOnInit(): void;
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    ngAfterContentChecked(): void;
    /** Throw a friendly error if cols property is missing */
    private _checkCols;
    /** Default to equal width:height if rowHeight property is missing */
    private _checkRowHeight;
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    private _setTileStyler;
    /** Computes and applies the size and position for all children grid tiles. */
    private _layoutTiles;
    /** Sets style on the main grid-list element, given the style name and value. */
    _setListStyle(style: [string, string | null] | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatGridList, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatGridList, "mat-grid-list", ["matGridList"], { "cols": "cols"; "gutterSize": "gutterSize"; "rowHeight": "rowHeight"; }, {}, ["_tiles"], ["*"]>;
}
