/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AsyncFactoryFn, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { PaginatorHarnessFilters } from './paginator-harness-filters';
export declare abstract class _MatPaginatorHarnessBase extends ComponentHarness {
    protected abstract _nextButton: AsyncFactoryFn<TestElement>;
    protected abstract _previousButton: AsyncFactoryFn<TestElement>;
    protected abstract _firstPageButton: AsyncFactoryFn<TestElement | null>;
    protected abstract _lastPageButton: AsyncFactoryFn<TestElement | null>;
    protected abstract _select: AsyncFactoryFn<(ComponentHarness & {
        getValueText(): Promise<string>;
        clickOptions(...filters: unknown[]): Promise<void>;
    }) | null>;
    protected abstract _pageSizeFallback: AsyncFactoryFn<TestElement>;
    protected abstract _rangeLabel: AsyncFactoryFn<TestElement>;
    /** Goes to the next page in the paginator. */
    goToNextPage(): Promise<void>;
    /** Goes to the previous page in the paginator. */
    goToPreviousPage(): Promise<void>;
    /** Goes to the first page in the paginator. */
    goToFirstPage(): Promise<void>;
    /** Goes to the last page in the paginator. */
    goToLastPage(): Promise<void>;
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    setPageSize(size: number): Promise<void>;
    /** Gets the page size of the paginator. */
    getPageSize(): Promise<number>;
    /** Gets the text of the range labe of the paginator. */
    getRangeLabel(): Promise<string>;
}
/** Harness for interacting with a standard mat-paginator in tests. */
export declare class MatPaginatorHarness extends _MatPaginatorHarnessBase {
    /** Selector used to find paginator instances. */
    static hostSelector: string;
    protected _nextButton: AsyncFactoryFn<TestElement>;
    protected _previousButton: AsyncFactoryFn<TestElement>;
    protected _firstPageButton: AsyncFactoryFn<TestElement | null>;
    protected _lastPageButton: AsyncFactoryFn<TestElement | null>;
    protected _select: AsyncFactoryFn<MatSelectHarness | null>;
    protected _pageSizeFallback: AsyncFactoryFn<TestElement>;
    protected _rangeLabel: AsyncFactoryFn<TestElement>;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatPaginatorHarness` that meets
     * certain criteria.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: PaginatorHarnessFilters): HarnessPredicate<MatPaginatorHarness>;
}
