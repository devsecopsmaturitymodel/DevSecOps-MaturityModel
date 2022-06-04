/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ComponentHarnessConstructor, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TableHarnessFilters, RowHarnessFilters } from './table-harness-filters';
import { MatRowHarness, MatHeaderRowHarness, MatFooterRowHarness, MatRowHarnessColumnsText } from './row-harness';
/** Text extracted from a table organized by columns. */
export interface MatTableHarnessColumnsText {
    [columnName: string]: {
        text: string[];
        headerText: string[];
        footerText: string[];
    };
}
interface RowBase extends ComponentHarness {
    getCellTextByColumnName(): Promise<MatRowHarnessColumnsText>;
    getCellTextByIndex(): Promise<string[]>;
}
export declare abstract class _MatTableHarnessBase<HeaderRowType extends ComponentHarnessConstructor<HeaderRow> & {
    with: (options?: RowHarnessFilters) => HarnessPredicate<HeaderRow>;
}, HeaderRow extends RowBase, RowType extends ComponentHarnessConstructor<Row> & {
    with: (options?: RowHarnessFilters) => HarnessPredicate<Row>;
}, Row extends RowBase, FooterRowType extends ComponentHarnessConstructor<FooterRow> & {
    with: (options?: RowHarnessFilters) => HarnessPredicate<FooterRow>;
}, FooterRow extends RowBase> extends ContentContainerComponentHarness<string> {
    protected abstract _headerRowHarness: HeaderRowType;
    protected abstract _rowHarness: RowType;
    protected abstract _footerRowHarness: FooterRowType;
    /** Gets all of the header rows in a table. */
    getHeaderRows(filter?: RowHarnessFilters): Promise<HeaderRow[]>;
    /** Gets all of the regular data rows in a table. */
    getRows(filter?: RowHarnessFilters): Promise<Row[]>;
    /** Gets all of the footer rows in a table. */
    getFooterRows(filter?: RowHarnessFilters): Promise<FooterRow[]>;
    /** Gets the text inside the entire table organized by rows. */
    getCellTextByIndex(): Promise<string[][]>;
    /** Gets the text inside the entire table organized by columns. */
    getCellTextByColumnName(): Promise<MatTableHarnessColumnsText>;
}
/** Harness for interacting with a standard mat-table in tests. */
export declare class MatTableHarness extends _MatTableHarnessBase<typeof MatHeaderRowHarness, MatHeaderRowHarness, typeof MatRowHarness, MatRowHarness, typeof MatFooterRowHarness, MatFooterRowHarness> {
    /** The selector for the host element of a `MatTableHarness` instance. */
    static hostSelector: string;
    protected _headerRowHarness: typeof MatHeaderRowHarness;
    protected _rowHarness: typeof MatRowHarness;
    protected _footerRowHarness: typeof MatFooterRowHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TableHarnessFilters): HarnessPredicate<MatTableHarness>;
}
export {};
