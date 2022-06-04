/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { RowHarnessFilters, CellHarnessFilters } from './table-harness-filters';
import { MatCellHarness, MatHeaderCellHarness, MatFooterCellHarness } from './cell-harness';
/** Text extracted from a table row organized by columns. */
export interface MatRowHarnessColumnsText {
    [columnName: string]: string;
}
export declare abstract class _MatRowHarnessBase<CellType extends ComponentHarnessConstructor<Cell> & {
    with: (options?: CellHarnessFilters) => HarnessPredicate<Cell>;
}, Cell extends ComponentHarness & {
    getText(): Promise<string>;
    getColumnName(): Promise<string>;
}> extends ComponentHarness {
    protected abstract _cellHarness: CellType;
    /** Gets a list of `MatCellHarness` for all cells in the row. */
    getCells(filter?: CellHarnessFilters): Promise<Cell[]>;
    /** Gets the text of the cells in the row. */
    getCellTextByIndex(filter?: CellHarnessFilters): Promise<string[]>;
    /** Gets the text inside the row organized by columns. */
    getCellTextByColumnName(): Promise<MatRowHarnessColumnsText>;
}
/** Harness for interacting with a standard Angular Material table row. */
export declare class MatRowHarness extends _MatRowHarnessBase<typeof MatCellHarness, MatCellHarness> {
    /** The selector for the host element of a `MatRowHarness` instance. */
    static hostSelector: string;
    protected _cellHarness: typeof MatCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RowHarnessFilters): HarnessPredicate<MatRowHarness>;
}
/** Harness for interacting with a standard Angular Material table header row. */
export declare class MatHeaderRowHarness extends _MatRowHarnessBase<typeof MatHeaderCellHarness, MatHeaderCellHarness> {
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    static hostSelector: string;
    protected _cellHarness: typeof MatHeaderCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RowHarnessFilters): HarnessPredicate<MatHeaderRowHarness>;
}
/** Harness for interacting with a standard Angular Material table footer row. */
export declare class MatFooterRowHarness extends _MatRowHarnessBase<typeof MatFooterCellHarness, MatFooterCellHarness> {
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    static hostSelector: string;
    protected _cellHarness: typeof MatFooterCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer row cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: RowHarnessFilters): HarnessPredicate<MatFooterRowHarness>;
}
