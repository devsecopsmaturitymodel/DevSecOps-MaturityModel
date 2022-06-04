/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkFooterRow, CdkFooterRowDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkNoDataRow } from '@angular/cdk/table';
import * as i0 from "@angular/core";
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class MatHeaderRowDef extends CdkHeaderRowDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderRowDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHeaderRowDef, "[matHeaderRowDef]", never, { "columns": "matHeaderRowDef"; "sticky": "matHeaderRowDefSticky"; }, {}, never>;
}
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export declare class MatFooterRowDef extends CdkFooterRowDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterRowDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFooterRowDef, "[matFooterRowDef]", never, { "columns": "matFooterRowDef"; "sticky": "matFooterRowDefSticky"; }, {}, never>;
}
/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export declare class MatRowDef<T> extends CdkRowDef<T> {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRowDef<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatRowDef<any>, "[matRowDef]", never, { "columns": "matRowDefColumns"; "when": "matRowDefWhen"; }, {}, never>;
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class MatHeaderRow extends CdkHeaderRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatHeaderRow, "mat-header-row, tr[mat-header-row]", ["matHeaderRow"], {}, {}, never, never>;
}
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export declare class MatFooterRow extends CdkFooterRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFooterRow, "mat-footer-row, tr[mat-footer-row]", ["matFooterRow"], {}, {}, never, never>;
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class MatRow extends CdkRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatRow, "mat-row, tr[mat-row]", ["matRow"], {}, {}, never, never>;
}
/** Row that can be used to display a message when no data is shown in the table. */
export declare class MatNoDataRow extends CdkNoDataRow {
    _contentClassName: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNoDataRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatNoDataRow, "ng-template[matNoDataRow]", never, {}, {}, never>;
}
