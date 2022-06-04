/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { IterableChanges, IterableDiffer, IterableDiffers, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { CanStick, CanStickCtor } from './can-stick';
import { CdkCellDef, CdkColumnDef } from './cell';
import * as i0 from "@angular/core";
/**
 * The row template that can be used by the mat-table. Should not be used outside of the
 * material library.
 */
export declare const CDK_ROW_TEMPLATE = "<ng-container cdkCellOutlet></ng-container>";
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 */
export declare abstract class BaseRowDef implements OnChanges {
    /** @docs-private */ template: TemplateRef<any>;
    protected _differs: IterableDiffers;
    /** The columns to be displayed on this row. */
    columns: Iterable<string>;
    /** Differ used to check if any changes were made to the columns. */
    protected _columnsDiffer: IterableDiffer<any>;
    constructor(
    /** @docs-private */ template: TemplateRef<any>, _differs: IterableDiffers);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Returns the difference between the current columns and the columns from the last diff, or null
     * if there is no difference.
     */
    getColumnsDiff(): IterableChanges<any> | null;
    /** Gets this row def's relevant cell template from the provided column def. */
    extractCellTemplate(column: CdkColumnDef): TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseRowDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseRowDef, never, never, {}, {}, never>;
}
/** @docs-private */
declare class CdkHeaderRowDefBase extends BaseRowDef {
}
declare const _CdkHeaderRowDefBase: CanStickCtor & typeof CdkHeaderRowDefBase;
/**
 * Header row definition for the CDK table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class CdkHeaderRowDef extends _CdkHeaderRowDefBase implements CanStick, OnChanges {
    _table?: any;
    constructor(template: TemplateRef<any>, _differs: IterableDiffers, _table?: any);
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkHeaderRowDef, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkHeaderRowDef, "[cdkHeaderRowDef]", never, { "columns": "cdkHeaderRowDef"; "sticky": "cdkHeaderRowDefSticky"; }, {}, never>;
}
/** @docs-private */
declare class CdkFooterRowDefBase extends BaseRowDef {
}
declare const _CdkFooterRowDefBase: CanStickCtor & typeof CdkFooterRowDefBase;
/**
 * Footer row definition for the CDK table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export declare class CdkFooterRowDef extends _CdkFooterRowDefBase implements CanStick, OnChanges {
    _table?: any;
    constructor(template: TemplateRef<any>, _differs: IterableDiffers, _table?: any);
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkFooterRowDef, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkFooterRowDef, "[cdkFooterRowDef]", never, { "columns": "cdkFooterRowDef"; "sticky": "cdkFooterRowDefSticky"; }, {}, never>;
}
/**
 * Data row definition for the CDK table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export declare class CdkRowDef<T> extends BaseRowDef {
    _table?: any;
    /**
     * Function that should return true if this row template should be used for the provided index
     * and row data. If left undefined, this row will be considered the default row template to use
     * when no other when functions return true for the data.
     * For every row, there must be at least one when function that passes or an undefined to default.
     */
    when: (index: number, rowData: T) => boolean;
    constructor(template: TemplateRef<any>, _differs: IterableDiffers, _table?: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkRowDef<any>, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkRowDef<any>, "[cdkRowDef]", never, { "columns": "cdkRowDefColumns"; "when": "cdkRowDefWhen"; }, {}, never>;
}
/** Context provided to the row cells when `multiTemplateDataRows` is false */
export interface CdkCellOutletRowContext<T> {
    /** Data for the row that this cell is located within. */
    $implicit?: T;
    /** Index of the data object in the provided data array. */
    index?: number;
    /** Length of the number of total rows. */
    count?: number;
    /** True if this cell is contained in the first row. */
    first?: boolean;
    /** True if this cell is contained in the last row. */
    last?: boolean;
    /** True if this cell is contained in a row with an even-numbered index. */
    even?: boolean;
    /** True if this cell is contained in a row with an odd-numbered index. */
    odd?: boolean;
}
/**
 * Context provided to the row cells when `multiTemplateDataRows` is true. This context is the same
 * as CdkCellOutletRowContext except that the single `index` value is replaced by `dataIndex` and
 * `renderIndex`.
 */
export interface CdkCellOutletMultiRowContext<T> {
    /** Data for the row that this cell is located within. */
    $implicit?: T;
    /** Index of the data object in the provided data array. */
    dataIndex?: number;
    /** Index location of the rendered row that this cell is located within. */
    renderIndex?: number;
    /** Length of the number of total rows. */
    count?: number;
    /** True if this cell is contained in the first row. */
    first?: boolean;
    /** True if this cell is contained in the last row. */
    last?: boolean;
    /** True if this cell is contained in a row with an even-numbered index. */
    even?: boolean;
    /** True if this cell is contained in a row with an odd-numbered index. */
    odd?: boolean;
}
/**
 * Outlet for rendering cells inside of a row or header row.
 * @docs-private
 */
export declare class CdkCellOutlet implements OnDestroy {
    _viewContainer: ViewContainerRef;
    /** The ordered list of cells to render within this outlet's view container */
    cells: CdkCellDef[];
    /** The data context to be provided to each cell */
    context: any;
    /**
     * Static property containing the latest constructed instance of this class.
     * Used by the CDK table when each CdkHeaderRow and CdkRow component is created using
     * createEmbeddedView. After one of these components are created, this property will provide
     * a handle to provide that component's cells and context. After init, the CdkCellOutlet will
     * construct the cells with the provided context.
     */
    static mostRecentCellOutlet: CdkCellOutlet | null;
    constructor(_viewContainer: ViewContainerRef);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkCellOutlet, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkCellOutlet, "[cdkCellOutlet]", never, {}, {}, never>;
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkHeaderRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkHeaderRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CdkHeaderRow, "cdk-header-row, tr[cdk-header-row]", never, {}, {}, never, never>;
}
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkFooterRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkFooterRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CdkFooterRow, "cdk-footer-row, tr[cdk-footer-row]", never, {}, {}, never, never>;
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CdkRow, "cdk-row, tr[cdk-row]", never, {}, {}, never, never>;
}
/** Row that can be used to display a message when no data is shown in the table. */
export declare class CdkNoDataRow {
    templateRef: TemplateRef<any>;
    _contentClassName: string;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkNoDataRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkNoDataRow, "ng-template[cdkNoDataRow]", never, {}, {}, never>;
}
export {};
