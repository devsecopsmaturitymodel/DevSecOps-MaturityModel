/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Inject, Input, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from './cell';
import { CdkTable } from './table';
import { getTableTextColumnMissingParentTableError, getTableTextColumnMissingNameError, } from './table-errors';
import { TEXT_COLUMN_OPTIONS } from './tokens';
import * as i0 from "@angular/core";
import * as i1 from "./table";
import * as i2 from "./cell";
/**
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
export class CdkTextColumn {
    constructor(
    // `CdkTextColumn` is always requiring a table, but we just assert it manually
    // for better error reporting.
    // tslint:disable-next-line: lightweight-tokens
    _table, _options) {
        this._table = _table;
        this._options = _options;
        /** Alignment of the cell values. */
        this.justify = 'start';
        this._options = _options || {};
    }
    /** Column name that should be used to reference this column. */
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
        // With Ivy, inputs can be initialized before static query results are
        // available. In that case, we defer the synchronization until "ngOnInit" fires.
        this._syncColumnDefName();
    }
    ngOnInit() {
        this._syncColumnDefName();
        if (this.headerText === undefined) {
            this.headerText = this._createDefaultHeaderText();
        }
        if (!this.dataAccessor) {
            this.dataAccessor =
                this._options.defaultDataAccessor || ((data, name) => data[name]);
        }
        if (this._table) {
            // Provide the cell and headerCell directly to the table with the static `ViewChild` query,
            // since the columnDef will not pick up its content by the time the table finishes checking
            // its content and initializing the rows.
            this.columnDef.cell = this.cell;
            this.columnDef.headerCell = this.headerCell;
            this._table.addColumnDef(this.columnDef);
        }
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw getTableTextColumnMissingParentTableError();
        }
    }
    ngOnDestroy() {
        if (this._table) {
            this._table.removeColumnDef(this.columnDef);
        }
    }
    /**
     * Creates a default header text. Use the options' header text transformation function if one
     * has been provided. Otherwise simply capitalize the column name.
     */
    _createDefaultHeaderText() {
        const name = this.name;
        if (!name && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getTableTextColumnMissingNameError();
        }
        if (this._options && this._options.defaultHeaderTextTransform) {
            return this._options.defaultHeaderTextTransform(name);
        }
        return name[0].toUpperCase() + name.slice(1);
    }
    /** Synchronizes the column definition name with the text column name. */
    _syncColumnDefName() {
        if (this.columnDef) {
            this.columnDef.name = this.name;
        }
    }
}
CdkTextColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTextColumn, deps: [{ token: i1.CdkTable, optional: true }, { token: TEXT_COLUMN_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
CdkTextColumn.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: CdkTextColumn, selector: "cdk-text-column", inputs: { name: "name", headerText: "headerText", dataAccessor: "dataAccessor", justify: "justify" }, viewQueries: [{ propertyName: "columnDef", first: true, predicate: CdkColumnDef, descendants: true, static: true }, { propertyName: "cell", first: true, predicate: CdkCellDef, descendants: true, static: true }, { propertyName: "headerCell", first: true, predicate: CdkHeaderCellDef, descendants: true, static: true }], ngImport: i0, template: `
    <ng-container cdkColumnDef>
      <th cdk-header-cell *cdkHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cdk-cell *cdkCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `, isInline: true, directives: [{ type: i2.CdkColumnDef, selector: "[cdkColumnDef]", inputs: ["sticky", "cdkColumnDef", "stickyEnd"] }, { type: i2.CdkHeaderCellDef, selector: "[cdkHeaderCellDef]" }, { type: i2.CdkHeaderCell, selector: "cdk-header-cell, th[cdk-header-cell]" }, { type: i2.CdkCellDef, selector: "[cdkCellDef]" }, { type: i2.CdkCell, selector: "cdk-cell, td[cdk-cell]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTextColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'cdk-text-column',
                    template: `
    <ng-container cdkColumnDef>
      <th cdk-header-cell *cdkHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cdk-cell *cdkCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
                    encapsulation: ViewEncapsulation.None,
                    // Change detection is intentionally not set to OnPush. This component's template will be provided
                    // to the table to be inserted into its view. This is problematic when change detection runs since
                    // the bindings in this template will be evaluated _after_ the table's view is evaluated, which
                    // mean's the template in the table's view will not have the updated value (and in fact will cause
                    // an ExpressionChangedAfterItHasBeenCheckedError).
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkTable, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [TEXT_COLUMN_OPTIONS]
                }] }]; }, propDecorators: { name: [{
                type: Input
            }], headerText: [{
                type: Input
            }], dataAccessor: [{
                type: Input
            }], justify: [{
                type: Input
            }], columnDef: [{
                type: ViewChild,
                args: [CdkColumnDef, { static: true }]
            }], cell: [{
                type: ViewChild,
                args: [CdkCellDef, { static: true }]
            }], headerCell: [{
                type: ViewChild,
                args: [CdkHeaderCellDef, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1jb2x1bW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3RhYmxlL3RleHQtY29sdW1uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDbEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNqQyxPQUFPLEVBQ0wseUNBQXlDLEVBQ3pDLGtDQUFrQyxHQUNuQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxtQkFBbUIsRUFBb0IsTUFBTSxVQUFVLENBQUM7Ozs7QUFFaEU7Ozs7Ozs7O0dBUUc7QUFzQkgsTUFBTSxPQUFPLGFBQWE7SUFxRHhCO0lBQ0UsOEVBQThFO0lBQzlFLDhCQUE4QjtJQUM5QiwrQ0FBK0M7SUFDM0IsTUFBbUIsRUFDVSxRQUE4QjtRQUQzRCxXQUFNLEdBQU4sTUFBTSxDQUFhO1FBQ1UsYUFBUSxHQUFSLFFBQVEsQ0FBc0I7UUE3QmpGLG9DQUFvQztRQUMzQixZQUFPLEdBQW9CLE9BQU8sQ0FBQztRQThCMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUE1REQsZ0VBQWdFO0lBQ2hFLElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBWTtRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUVsQixzRUFBc0U7UUFDdEUsZ0ZBQWdGO1FBQ2hGLElBQUksQ0FBQyxr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U0FBUztzQkFBakQsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQVNBLElBQUk7c0JBQTFDLFNBQVM7dUJBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFTUSxVQUFVO3NCQUF0RCxTQUFTO3VCQUFDLGdCQUFnQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtDZWxsRGVmLCBDZGtDb2x1bW5EZWYsIENka0hlYWRlckNlbGxEZWZ9IGZyb20gJy4vY2VsbCc7XG5pbXBvcnQge0Nka1RhYmxlfSBmcm9tICcuL3RhYmxlJztcbmltcG9ydCB7XG4gIGdldFRhYmxlVGV4dENvbHVtbk1pc3NpbmdQYXJlbnRUYWJsZUVycm9yLFxuICBnZXRUYWJsZVRleHRDb2x1bW5NaXNzaW5nTmFtZUVycm9yLFxufSBmcm9tICcuL3RhYmxlLWVycm9ycyc7XG5pbXBvcnQge1RFWFRfQ09MVU1OX09QVElPTlMsIFRleHRDb2x1bW5PcHRpb25zfSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKlxuICogQ29sdW1uIHRoYXQgc2ltcGx5IHNob3dzIHRleHQgY29udGVudCBmb3IgdGhlIGhlYWRlciBhbmQgcm93IGNlbGxzLiBBc3N1bWVzIHRoYXQgdGhlIHRhYmxlXG4gKiBpcyB1c2luZyB0aGUgbmF0aXZlIHRhYmxlIGltcGxlbWVudGF0aW9uIChgPHRhYmxlPmApLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBuYW1lIG9mIHRoaXMgY29sdW1uIHdpbGwgYmUgdGhlIGhlYWRlciB0ZXh0IGFuZCBkYXRhIHByb3BlcnR5IGFjY2Vzc29yLlxuICogVGhlIGhlYWRlciB0ZXh0IGNhbiBiZSBvdmVycmlkZGVuIHdpdGggdGhlIGBoZWFkZXJUZXh0YCBpbnB1dC4gQ2VsbCB2YWx1ZXMgY2FuIGJlIG92ZXJyaWRkZW4gd2l0aFxuICogdGhlIGBkYXRhQWNjZXNzb3JgIGlucHV0LiBDaGFuZ2UgdGhlIHRleHQganVzdGlmaWNhdGlvbiB0byB0aGUgc3RhcnQgb3IgZW5kIHVzaW5nIHRoZSBganVzdGlmeWBcbiAqIGlucHV0LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjZGstdGV4dC1jb2x1bW4nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgY2RrQ29sdW1uRGVmPlxuICAgICAgPHRoIGNkay1oZWFkZXItY2VsbCAqY2RrSGVhZGVyQ2VsbERlZiBbc3R5bGUudGV4dC1hbGlnbl09XCJqdXN0aWZ5XCI+XG4gICAgICAgIHt7aGVhZGVyVGV4dH19XG4gICAgICA8L3RoPlxuICAgICAgPHRkIGNkay1jZWxsICpjZGtDZWxsRGVmPVwibGV0IGRhdGFcIiBbc3R5bGUudGV4dC1hbGlnbl09XCJqdXN0aWZ5XCI+XG4gICAgICAgIHt7ZGF0YUFjY2Vzc29yKGRhdGEsIG5hbWUpfX1cbiAgICAgIDwvdGQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIENoYW5nZSBkZXRlY3Rpb24gaXMgaW50ZW50aW9uYWxseSBub3Qgc2V0IHRvIE9uUHVzaC4gVGhpcyBjb21wb25lbnQncyB0ZW1wbGF0ZSB3aWxsIGJlIHByb3ZpZGVkXG4gIC8vIHRvIHRoZSB0YWJsZSB0byBiZSBpbnNlcnRlZCBpbnRvIGl0cyB2aWV3LiBUaGlzIGlzIHByb2JsZW1hdGljIHdoZW4gY2hhbmdlIGRldGVjdGlvbiBydW5zIHNpbmNlXG4gIC8vIHRoZSBiaW5kaW5ncyBpbiB0aGlzIHRlbXBsYXRlIHdpbGwgYmUgZXZhbHVhdGVkIF9hZnRlcl8gdGhlIHRhYmxlJ3MgdmlldyBpcyBldmFsdWF0ZWQsIHdoaWNoXG4gIC8vIG1lYW4ncyB0aGUgdGVtcGxhdGUgaW4gdGhlIHRhYmxlJ3MgdmlldyB3aWxsIG5vdCBoYXZlIHRoZSB1cGRhdGVkIHZhbHVlIChhbmQgaW4gZmFjdCB3aWxsIGNhdXNlXG4gIC8vIGFuIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXJyb3IpLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIENka1RleHRDb2x1bW48VD4gaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBDb2x1bW4gbmFtZSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIHJlZmVyZW5jZSB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuICBzZXQgbmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcblxuICAgIC8vIFdpdGggSXZ5LCBpbnB1dHMgY2FuIGJlIGluaXRpYWxpemVkIGJlZm9yZSBzdGF0aWMgcXVlcnkgcmVzdWx0cyBhcmVcbiAgICAvLyBhdmFpbGFibGUuIEluIHRoYXQgY2FzZSwgd2UgZGVmZXIgdGhlIHN5bmNocm9uaXphdGlvbiB1bnRpbCBcIm5nT25Jbml0XCIgZmlyZXMuXG4gICAgdGhpcy5fc3luY0NvbHVtbkRlZk5hbWUoKTtcbiAgfVxuICBfbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUZXh0IGxhYmVsIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBjb2x1bW4gaGVhZGVyLiBJZiB0aGlzIHByb3BlcnR5IGlzIG5vdFxuICAgKiBzZXQsIHRoZSBoZWFkZXIgdGV4dCB3aWxsIGRlZmF1bHQgdG8gdGhlIGNvbHVtbiBuYW1lIHdpdGggaXRzIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZC5cbiAgICovXG4gIEBJbnB1dCgpIGhlYWRlclRleHQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWNjZXNzb3IgZnVuY3Rpb24gdG8gcmV0cmlldmUgdGhlIGRhdGEgcmVuZGVyZWQgZm9yIGVhY2ggY2VsbC4gSWYgdGhpc1xuICAgKiBwcm9wZXJ0eSBpcyBub3Qgc2V0LCB0aGUgZGF0YSBjZWxscyB3aWxsIHJlbmRlciB0aGUgdmFsdWUgZm91bmQgaW4gdGhlIGRhdGEncyBwcm9wZXJ0eSBtYXRjaGluZ1xuICAgKiB0aGUgY29sdW1uJ3MgbmFtZS4gRm9yIGV4YW1wbGUsIGlmIHRoZSBjb2x1bW4gaXMgbmFtZWQgYGlkYCwgdGhlbiB0aGUgcmVuZGVyZWQgdmFsdWUgd2lsbCBiZVxuICAgKiB2YWx1ZSBkZWZpbmVkIGJ5IHRoZSBkYXRhJ3MgYGlkYCBwcm9wZXJ0eS5cbiAgICovXG4gIEBJbnB1dCgpIGRhdGFBY2Nlc3NvcjogKGRhdGE6IFQsIG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuXG4gIC8qKiBBbGlnbm1lbnQgb2YgdGhlIGNlbGwgdmFsdWVzLiAqL1xuICBASW5wdXQoKSBqdXN0aWZ5OiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ29sdW1uRGVmLCB7c3RhdGljOiB0cnVlfSkgY29sdW1uRGVmOiBDZGtDb2x1bW5EZWY7XG5cbiAgLyoqXG4gICAqIFRoZSBjb2x1bW4gY2VsbCBpcyBwcm92aWRlZCB0byB0aGUgY29sdW1uIGR1cmluZyBgbmdPbkluaXRgIHdpdGggYSBzdGF0aWMgcXVlcnkuXG4gICAqIE5vcm1hbGx5LCB0aGlzIHdpbGwgYmUgcmV0cmlldmVkIGJ5IHRoZSBjb2x1bW4gdXNpbmcgYENvbnRlbnRDaGlsZGAsIGJ1dCB0aGF0IGFzc3VtZXMgdGhlXG4gICAqIGNvbHVtbiBkZWZpbml0aW9uIHdhcyBwcm92aWRlZCBpbiB0aGUgc2FtZSB2aWV3IGFzIHRoZSB0YWJsZSwgd2hpY2ggaXMgbm90IHRoZSBjYXNlIHdpdGggdGhpc1xuICAgKiBjb21wb25lbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ2VsbERlZiwge3N0YXRpYzogdHJ1ZX0pIGNlbGw6IENka0NlbGxEZWY7XG5cbiAgLyoqXG4gICAqIFRoZSBjb2x1bW4gaGVhZGVyQ2VsbCBpcyBwcm92aWRlZCB0byB0aGUgY29sdW1uIGR1cmluZyBgbmdPbkluaXRgIHdpdGggYSBzdGF0aWMgcXVlcnkuXG4gICAqIE5vcm1hbGx5LCB0aGlzIHdpbGwgYmUgcmV0cmlldmVkIGJ5IHRoZSBjb2x1bW4gdXNpbmcgYENvbnRlbnRDaGlsZGAsIGJ1dCB0aGF0IGFzc3VtZXMgdGhlXG4gICAqIGNvbHVtbiBkZWZpbml0aW9uIHdhcyBwcm92aWRlZCBpbiB0aGUgc2FtZSB2aWV3IGFzIHRoZSB0YWJsZSwgd2hpY2ggaXMgbm90IHRoZSBjYXNlIHdpdGggdGhpc1xuICAgKiBjb21wb25lbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBWaWV3Q2hpbGQoQ2RrSGVhZGVyQ2VsbERlZiwge3N0YXRpYzogdHJ1ZX0pIGhlYWRlckNlbGw6IENka0hlYWRlckNlbGxEZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLy8gYENka1RleHRDb2x1bW5gIGlzIGFsd2F5cyByZXF1aXJpbmcgYSB0YWJsZSwgYnV0IHdlIGp1c3QgYXNzZXJ0IGl0IG1hbnVhbGx5XG4gICAgLy8gZm9yIGJldHRlciBlcnJvciByZXBvcnRpbmcuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF90YWJsZTogQ2RrVGFibGU8VD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChURVhUX0NPTFVNTl9PUFRJT05TKSBwcml2YXRlIF9vcHRpb25zOiBUZXh0Q29sdW1uT3B0aW9uczxUPixcbiAgKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc3luY0NvbHVtbkRlZk5hbWUoKTtcblxuICAgIGlmICh0aGlzLmhlYWRlclRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5fY3JlYXRlRGVmYXVsdEhlYWRlclRleHQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGF0YUFjY2Vzc29yKSB7XG4gICAgICB0aGlzLmRhdGFBY2Nlc3NvciA9XG4gICAgICAgIHRoaXMuX29wdGlvbnMuZGVmYXVsdERhdGFBY2Nlc3NvciB8fCAoKGRhdGE6IFQsIG5hbWU6IHN0cmluZykgPT4gKGRhdGEgYXMgYW55KVtuYW1lXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3RhYmxlKSB7XG4gICAgICAvLyBQcm92aWRlIHRoZSBjZWxsIGFuZCBoZWFkZXJDZWxsIGRpcmVjdGx5IHRvIHRoZSB0YWJsZSB3aXRoIHRoZSBzdGF0aWMgYFZpZXdDaGlsZGAgcXVlcnksXG4gICAgICAvLyBzaW5jZSB0aGUgY29sdW1uRGVmIHdpbGwgbm90IHBpY2sgdXAgaXRzIGNvbnRlbnQgYnkgdGhlIHRpbWUgdGhlIHRhYmxlIGZpbmlzaGVzIGNoZWNraW5nXG4gICAgICAvLyBpdHMgY29udGVudCBhbmQgaW5pdGlhbGl6aW5nIHRoZSByb3dzLlxuICAgICAgdGhpcy5jb2x1bW5EZWYuY2VsbCA9IHRoaXMuY2VsbDtcbiAgICAgIHRoaXMuY29sdW1uRGVmLmhlYWRlckNlbGwgPSB0aGlzLmhlYWRlckNlbGw7XG4gICAgICB0aGlzLl90YWJsZS5hZGRDb2x1bW5EZWYodGhpcy5jb2x1bW5EZWYpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICB0aHJvdyBnZXRUYWJsZVRleHRDb2x1bW5NaXNzaW5nUGFyZW50VGFibGVFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl90YWJsZSkge1xuICAgICAgdGhpcy5fdGFibGUucmVtb3ZlQ29sdW1uRGVmKHRoaXMuY29sdW1uRGVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGRlZmF1bHQgaGVhZGVyIHRleHQuIFVzZSB0aGUgb3B0aW9ucycgaGVhZGVyIHRleHQgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gaWYgb25lXG4gICAqIGhhcyBiZWVuIHByb3ZpZGVkLiBPdGhlcndpc2Ugc2ltcGx5IGNhcGl0YWxpemUgdGhlIGNvbHVtbiBuYW1lLlxuICAgKi9cbiAgX2NyZWF0ZURlZmF1bHRIZWFkZXJUZXh0KCkge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLm5hbWU7XG5cbiAgICBpZiAoIW5hbWUgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldFRhYmxlVGV4dENvbHVtbk1pc3NpbmdOYW1lRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucyAmJiB0aGlzLl9vcHRpb25zLmRlZmF1bHRIZWFkZXJUZXh0VHJhbnNmb3JtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy5kZWZhdWx0SGVhZGVyVGV4dFRyYW5zZm9ybShuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZVswXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbiAgfVxuXG4gIC8qKiBTeW5jaHJvbml6ZXMgdGhlIGNvbHVtbiBkZWZpbml0aW9uIG5hbWUgd2l0aCB0aGUgdGV4dCBjb2x1bW4gbmFtZS4gKi9cbiAgcHJpdmF0ZSBfc3luY0NvbHVtbkRlZk5hbWUoKSB7XG4gICAgaWYgKHRoaXMuY29sdW1uRGVmKSB7XG4gICAgICB0aGlzLmNvbHVtbkRlZi5uYW1lID0gdGhpcy5uYW1lO1xuICAgIH1cbiAgfVxufVxuIl19