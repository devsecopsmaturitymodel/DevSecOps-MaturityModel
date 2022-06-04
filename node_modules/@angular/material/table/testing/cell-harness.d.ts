/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarnessConstructor, ContentContainerComponentHarness } from '@angular/cdk/testing';
import { CellHarnessFilters } from './table-harness-filters';
/** Harness for interacting with a standard Angular Material table cell. */
export declare class MatCellHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatCellHarness` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CellHarnessFilters): HarnessPredicate<MatCellHarness>;
    /** Gets the cell's text. */
    getText(): Promise<string>;
    /** Gets the name of the column that the cell belongs to. */
    getColumnName(): Promise<string>;
    protected static _getCellPredicate<T extends MatCellHarness>(type: ComponentHarnessConstructor<T>, options: CellHarnessFilters): HarnessPredicate<T>;
}
/** Harness for interacting with a standard Angular Material table header cell. */
export declare class MatHeaderCellHarness extends MatCellHarness {
    /** The selector for the host element of a `MatHeaderCellHarness` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CellHarnessFilters): HarnessPredicate<MatHeaderCellHarness>;
}
/** Harness for interacting with a standard Angular Material table footer cell. */
export declare class MatFooterCellHarness extends MatCellHarness {
    /** The selector for the host element of a `MatFooterCellHarness` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CellHarnessFilters): HarnessPredicate<MatFooterCellHarness>;
}
