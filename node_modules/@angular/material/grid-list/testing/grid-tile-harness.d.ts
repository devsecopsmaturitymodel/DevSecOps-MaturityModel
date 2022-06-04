/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { GridTileHarnessFilters } from './grid-list-harness-filters';
/** Selectors for the various `mat-grid-tile` sections that may contain user content. */
export declare const enum MatGridTileSection {
    HEADER = ".mat-grid-tile-header",
    FOOTER = ".mat-grid-tile-footer"
}
/** Harness for interacting with a standard `MatGridTitle` in tests. */
export declare class MatGridTileHarness extends ContentContainerComponentHarness<MatGridTileSection> {
    /** The selector for the host element of a `MatGridTile` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: GridTileHarnessFilters): HarnessPredicate<MatGridTileHarness>;
    private _header;
    private _footer;
    private _avatar;
    /** Gets the amount of rows that the grid-tile takes up. */
    getRowspan(): Promise<number>;
    /** Gets the amount of columns that the grid-tile takes up. */
    getColspan(): Promise<number>;
    /** Whether the grid-tile has a header. */
    hasHeader(): Promise<boolean>;
    /** Whether the grid-tile has a footer. */
    hasFooter(): Promise<boolean>;
    /** Whether the grid-tile has an avatar. */
    hasAvatar(): Promise<boolean>;
    /** Gets the text of the header if present. */
    getHeaderText(): Promise<string | null>;
    /** Gets the text of the footer if present. */
    getFooterText(): Promise<string | null>;
}
