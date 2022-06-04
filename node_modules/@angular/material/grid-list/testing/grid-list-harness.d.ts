/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { GridListHarnessFilters, GridTileHarnessFilters } from './grid-list-harness-filters';
import { MatGridTileHarness } from './grid-tile-harness';
/** Harness for interacting with a standard `MatGridList` in tests. */
export declare class MatGridListHarness extends ComponentHarness {
    /** The selector for the host element of a `MatGridList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: GridListHarnessFilters): HarnessPredicate<MatGridListHarness>;
    /**
     * Tile coordinator that is used by the "MatGridList" for computing
     * positions of tiles. We leverage the coordinator to provide an API
     * for retrieving tiles based on visual tile positions.
     */
    private _tileCoordinator;
    /** Gets all tiles of the grid-list. */
    getTiles(filters?: GridTileHarnessFilters): Promise<MatGridTileHarness[]>;
    /** Gets the amount of columns of the grid-list. */
    getColumns(): Promise<number>;
    /**
     * Gets a tile of the grid-list that is located at the given location.
     * @param row Zero-based row index.
     * @param column Zero-based column index.
     */
    getTileAtPosition({ row, column, }: {
        row: number;
        column: number;
    }): Promise<MatGridTileHarness>;
}
