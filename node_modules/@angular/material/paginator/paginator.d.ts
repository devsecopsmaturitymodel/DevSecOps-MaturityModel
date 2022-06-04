/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit, InjectionToken } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { HasInitialized, ThemePalette, CanDisable } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as i0 from "@angular/core";
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export declare class PageEvent {
    /** The current page index. */
    pageIndex: number;
    /**
     * Index of the page that was selected previously.
     * @breaking-change 8.0.0 To be made into a required property.
     */
    previousPageIndex?: number;
    /** The current page size */
    pageSize: number;
    /** The current total number of items being paged */
    length: number;
}
/** Object that can be used to configure the default options for the paginator module. */
export interface MatPaginatorDefaultOptions {
    /** Number of items to display on a page. By default set to 50. */
    pageSize?: number;
    /** The set of provided page size options to display to the user. */
    pageSizeOptions?: number[];
    /** Whether to hide the page size selection UI from the user. */
    hidePageSize?: boolean;
    /** Whether to show the first/last buttons UI to the user. */
    showFirstLastButtons?: boolean;
    /** The default form-field appearance to apply to the page size options selector. */
    formFieldAppearance?: MatFormFieldAppearance;
}
/** Injection token that can be used to provide the default options for the paginator module. */
export declare const MAT_PAGINATOR_DEFAULT_OPTIONS: InjectionToken<MatPaginatorDefaultOptions>;
/** @docs-private */
declare const _MatPaginatorMixinBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & (new (...args: any[]) => HasInitialized) & {
    new (): {};
};
/**
 * Base class with all of the `MatPaginator` functionality.
 * @docs-private
 */
export declare abstract class _MatPaginatorBase<O extends {
    pageSize?: number;
    pageSizeOptions?: number[];
    hidePageSize?: boolean;
    showFirstLastButtons?: boolean;
}> extends _MatPaginatorMixinBase implements OnInit, OnDestroy, CanDisable, HasInitialized {
    _intl: MatPaginatorIntl;
    private _changeDetectorRef;
    private _initialized;
    private _intlChanges;
    /** Theme color to be used for the underlying form controls. */
    color: ThemePalette;
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex(): number;
    set pageIndex(value: NumberInput);
    private _pageIndex;
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length(): number;
    set length(value: NumberInput);
    private _length;
    /** Number of items to display on a page. By default set to 50. */
    get pageSize(): number;
    set pageSize(value: NumberInput);
    private _pageSize;
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions(): number[];
    set pageSizeOptions(value: number[] | readonly number[]);
    private _pageSizeOptions;
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize(): boolean;
    set hidePageSize(value: BooleanInput);
    private _hidePageSize;
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons(): boolean;
    set showFirstLastButtons(value: BooleanInput);
    private _showFirstLastButtons;
    /** Event emitted when the paginator changes the page size or page index. */
    readonly page: EventEmitter<PageEvent>;
    /** Displayed set of page size options. Will be sorted and include current page size. */
    _displayedPageSizeOptions: number[];
    constructor(_intl: MatPaginatorIntl, _changeDetectorRef: ChangeDetectorRef, defaults?: O);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Advances to the next page if it exists. */
    nextPage(): void;
    /** Move back to the previous page if it exists. */
    previousPage(): void;
    /** Move to the first page if not already there. */
    firstPage(): void;
    /** Move to the last page if not already there. */
    lastPage(): void;
    /** Whether there is a previous page. */
    hasPreviousPage(): boolean;
    /** Whether there is a next page. */
    hasNextPage(): boolean;
    /** Calculate the number of pages */
    getNumberOfPages(): number;
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize: number): void;
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled(): boolean;
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled(): boolean;
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    private _updateDisplayedPageSizeOptions;
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    private _emitPageEvent;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatPaginatorBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatPaginatorBase<any>, never, never, { "color": "color"; "pageIndex": "pageIndex"; "length": "length"; "pageSize": "pageSize"; "pageSizeOptions": "pageSizeOptions"; "hidePageSize": "hidePageSize"; "showFirstLastButtons": "showFirstLastButtons"; }, { "page": "page"; }, never>;
}
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export declare class MatPaginator extends _MatPaginatorBase<MatPaginatorDefaultOptions> {
    /** If set, styles the "page size" form field with the designated style. */
    _formFieldAppearance?: MatFormFieldAppearance;
    constructor(intl: MatPaginatorIntl, changeDetectorRef: ChangeDetectorRef, defaults?: MatPaginatorDefaultOptions);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPaginator, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatPaginator, "mat-paginator", ["matPaginator"], { "disabled": "disabled"; }, {}, never, never>;
}
export {};
