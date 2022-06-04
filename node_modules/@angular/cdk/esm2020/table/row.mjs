/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, IterableDiffers, TemplateRef, ViewContainerRef, ViewEncapsulation, Inject, Optional, } from '@angular/core';
import { mixinHasStickyInput } from './can-stick';
import { CDK_TABLE } from './tokens';
import * as i0 from "@angular/core";
/**
 * The row template that can be used by the mat-table. Should not be used outside of the
 * material library.
 */
export const CDK_ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 */
export class BaseRowDef {
    constructor(
    /** @docs-private */ template, _differs) {
        this.template = template;
        this._differs = _differs;
    }
    ngOnChanges(changes) {
        // Create a new columns differ if one does not yet exist. Initialize it based on initial value
        // of the columns property or an empty array if none is provided.
        if (!this._columnsDiffer) {
            const columns = (changes['columns'] && changes['columns'].currentValue) || [];
            this._columnsDiffer = this._differs.find(columns).create();
            this._columnsDiffer.diff(columns);
        }
    }
    /**
     * Returns the difference between the current columns and the columns from the last diff, or null
     * if there is no difference.
     */
    getColumnsDiff() {
        return this._columnsDiffer.diff(this.columns);
    }
    /** Gets this row def's relevant cell template from the provided column def. */
    extractCellTemplate(column) {
        if (this instanceof CdkHeaderRowDef) {
            return column.headerCell.template;
        }
        if (this instanceof CdkFooterRowDef) {
            return column.footerCell.template;
        }
        else {
            return column.cell.template;
        }
    }
}
BaseRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BaseRowDef, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Directive });
BaseRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: BaseRowDef, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BaseRowDef, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }]; } });
// Boilerplate for applying mixins to CdkHeaderRowDef.
/** @docs-private */
class CdkHeaderRowDefBase extends BaseRowDef {
}
const _CdkHeaderRowDefBase = mixinHasStickyInput(CdkHeaderRowDefBase);
/**
 * Header row definition for the CDK table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export class CdkHeaderRowDef extends _CdkHeaderRowDefBase {
    constructor(template, _differs, _table) {
        super(template, _differs);
        this._table = _table;
    }
    // Prerender fails to recognize that ngOnChanges in a part of this class through inheritance.
    // Explicitly define it so that the method is called as part of the Angular lifecycle.
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
}
CdkHeaderRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkHeaderRowDef, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: CDK_TABLE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkHeaderRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkHeaderRowDef, selector: "[cdkHeaderRowDef]", inputs: { columns: ["cdkHeaderRowDef", "columns"], sticky: ["cdkHeaderRowDefSticky", "sticky"] }, usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkHeaderRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkHeaderRowDef]',
                    inputs: ['columns: cdkHeaderRowDef', 'sticky: cdkHeaderRowDefSticky'],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TABLE]
                }, {
                    type: Optional
                }] }]; } });
// Boilerplate for applying mixins to CdkFooterRowDef.
/** @docs-private */
class CdkFooterRowDefBase extends BaseRowDef {
}
const _CdkFooterRowDefBase = mixinHasStickyInput(CdkFooterRowDefBase);
/**
 * Footer row definition for the CDK table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export class CdkFooterRowDef extends _CdkFooterRowDefBase {
    constructor(template, _differs, _table) {
        super(template, _differs);
        this._table = _table;
    }
    // Prerender fails to recognize that ngOnChanges in a part of this class through inheritance.
    // Explicitly define it so that the method is called as part of the Angular lifecycle.
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
}
CdkFooterRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFooterRowDef, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: CDK_TABLE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkFooterRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkFooterRowDef, selector: "[cdkFooterRowDef]", inputs: { columns: ["cdkFooterRowDef", "columns"], sticky: ["cdkFooterRowDefSticky", "sticky"] }, usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFooterRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkFooterRowDef]',
                    inputs: ['columns: cdkFooterRowDef', 'sticky: cdkFooterRowDefSticky'],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TABLE]
                }, {
                    type: Optional
                }] }]; } });
/**
 * Data row definition for the CDK table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export class CdkRowDef extends BaseRowDef {
    // TODO(andrewseguin): Add an input for providing a switch function to determine
    //   if this template should be used.
    constructor(template, _differs, _table) {
        super(template, _differs);
        this._table = _table;
    }
}
CdkRowDef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkRowDef, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: CDK_TABLE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkRowDef.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkRowDef, selector: "[cdkRowDef]", inputs: { columns: ["cdkRowDefColumns", "columns"], when: ["cdkRowDefWhen", "when"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkRowDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkRowDef]',
                    inputs: ['columns: cdkRowDefColumns', 'when: cdkRowDefWhen'],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_TABLE]
                }, {
                    type: Optional
                }] }]; } });
/**
 * Outlet for rendering cells inside of a row or header row.
 * @docs-private
 */
export class CdkCellOutlet {
    constructor(_viewContainer) {
        this._viewContainer = _viewContainer;
        CdkCellOutlet.mostRecentCellOutlet = this;
    }
    ngOnDestroy() {
        // If this was the last outlet being rendered in the view, remove the reference
        // from the static property after it has been destroyed to avoid leaking memory.
        if (CdkCellOutlet.mostRecentCellOutlet === this) {
            CdkCellOutlet.mostRecentCellOutlet = null;
        }
    }
}
/**
 * Static property containing the latest constructed instance of this class.
 * Used by the CDK table when each CdkHeaderRow and CdkRow component is created using
 * createEmbeddedView. After one of these components are created, this property will provide
 * a handle to provide that component's cells and context. After init, the CdkCellOutlet will
 * construct the cells with the provided context.
 */
CdkCellOutlet.mostRecentCellOutlet = null;
CdkCellOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkCellOutlet, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkCellOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkCellOutlet, selector: "[cdkCellOutlet]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkCellOutlet, decorators: [{
            type: Directive,
            args: [{ selector: '[cdkCellOutlet]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; } });
/** Header template container that contains the cell outlet. Adds the right class and role. */
export class CdkHeaderRow {
}
CdkHeaderRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkHeaderRow, deps: [], target: i0.ɵɵFactoryTarget.Component });
CdkHeaderRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: CdkHeaderRow, selector: "cdk-header-row, tr[cdk-header-row]", host: { attributes: { "role": "row" }, classAttribute: "cdk-header-row" }, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, directives: [{ type: CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkHeaderRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'cdk-header-row, tr[cdk-header-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'cdk-header-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                }]
        }] });
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export class CdkFooterRow {
}
CdkFooterRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFooterRow, deps: [], target: i0.ɵɵFactoryTarget.Component });
CdkFooterRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: CdkFooterRow, selector: "cdk-footer-row, tr[cdk-footer-row]", host: { attributes: { "role": "row" }, classAttribute: "cdk-footer-row" }, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, directives: [{ type: CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFooterRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'cdk-footer-row, tr[cdk-footer-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'cdk-footer-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                }]
        }] });
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export class CdkRow {
}
CdkRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkRow, deps: [], target: i0.ɵɵFactoryTarget.Component });
CdkRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: CdkRow, selector: "cdk-row, tr[cdk-row]", host: { attributes: { "role": "row" }, classAttribute: "cdk-row" }, ngImport: i0, template: "<ng-container cdkCellOutlet></ng-container>", isInline: true, directives: [{ type: CdkCellOutlet, selector: "[cdkCellOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'cdk-row, tr[cdk-row]',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'cdk-row',
                        'role': 'row',
                    },
                    // See note on CdkTable for explanation on why this uses the default change detection strategy.
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                }]
        }] });
/** Row that can be used to display a message when no data is shown in the table. */
export class CdkNoDataRow {
    constructor(templateRef) {
        this.templateRef = templateRef;
        this._contentClassName = 'cdk-no-data-row';
    }
}
CdkNoDataRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkNoDataRow, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkNoDataRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkNoDataRow, selector: "ng-template[cdkNoDataRow]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkNoDataRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[cdkNoDataRow]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90YWJsZS9yb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsU0FBUyxFQUdULGVBQWUsRUFJZixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUIsbUJBQW1CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbkM7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsNkNBQTZDLENBQUM7QUFFOUU7OztHQUdHO0FBRUgsTUFBTSxPQUFnQixVQUFVO0lBTzlCO0lBQ0Usb0JBQW9CLENBQVEsUUFBMEIsRUFDNUMsUUFBeUI7UUFEUCxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUM1QyxhQUFRLEdBQVIsUUFBUSxDQUFpQjtJQUNsQyxDQUFDO0lBRUosV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLDhGQUE4RjtRQUM5RixpRUFBaUU7UUFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsK0VBQStFO0lBQy9FLG1CQUFtQixDQUFDLE1BQW9CO1FBQ3RDLElBQUksSUFBSSxZQUFZLGVBQWUsRUFBRTtZQUNuQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxJQUFJLFlBQVksZUFBZSxFQUFFO1lBQ25DLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDbkM7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDN0I7SUFDSCxDQUFDOzt1R0F4Q21CLFVBQVU7MkZBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUQvQixTQUFTOztBQTRDVixzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCLE1BQU0sbUJBQW9CLFNBQVEsVUFBVTtDQUFHO0FBQy9DLE1BQU0sb0JBQW9CLEdBQ3hCLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFM0M7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsb0JBQW9CO0lBQ3ZELFlBQ0UsUUFBMEIsRUFDMUIsUUFBeUIsRUFDYSxNQUFZO1FBRWxELEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFGWSxXQUFNLEdBQU4sTUFBTSxDQUFNO0lBR3BELENBQUM7SUFFRCw2RkFBNkY7SUFDN0Ysc0ZBQXNGO0lBQzdFLFdBQVcsQ0FBQyxPQUFzQjtRQUN6QyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7OzRHQWJVLGVBQWUsNEVBSWhCLFNBQVM7Z0dBSlIsZUFBZTsyRkFBZixlQUFlO2tCQUozQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLE1BQU0sRUFBRSxDQUFDLDBCQUEwQixFQUFFLCtCQUErQixDQUFDO2lCQUN0RTs7MEJBS0ksTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFROztBQVloQyxzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCLE1BQU0sbUJBQW9CLFNBQVEsVUFBVTtDQUFHO0FBQy9DLE1BQU0sb0JBQW9CLEdBQ3hCLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFM0M7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsb0JBQW9CO0lBQ3ZELFlBQ0UsUUFBMEIsRUFDMUIsUUFBeUIsRUFDYSxNQUFZO1FBRWxELEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFGWSxXQUFNLEdBQU4sTUFBTSxDQUFNO0lBR3BELENBQUM7SUFFRCw2RkFBNkY7SUFDN0Ysc0ZBQXNGO0lBQzdFLFdBQVcsQ0FBQyxPQUFzQjtRQUN6QyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7OzRHQWJVLGVBQWUsNEVBSWhCLFNBQVM7Z0dBSlIsZUFBZTsyRkFBZixlQUFlO2tCQUozQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLE1BQU0sRUFBRSxDQUFDLDBCQUEwQixFQUFFLCtCQUErQixDQUFDO2lCQUN0RTs7MEJBS0ksTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFROztBQVloQzs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLFNBQWEsU0FBUSxVQUFVO0lBUzFDLGdGQUFnRjtJQUNoRixxQ0FBcUM7SUFDckMsWUFDRSxRQUEwQixFQUMxQixRQUF5QixFQUNhLE1BQVk7UUFFbEQsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUZZLFdBQU0sR0FBTixNQUFNLENBQU07SUFHcEQsQ0FBQzs7c0dBakJVLFNBQVMsNEVBY1YsU0FBUzswRkFkUixTQUFTOzJGQUFULFNBQVM7a0JBSnJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLE1BQU0sRUFBRSxDQUFDLDJCQUEyQixFQUFFLHFCQUFxQixDQUFDO2lCQUM3RDs7MEJBZUksTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFROztBQTZEaEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFnQnhCLFlBQW1CLGNBQWdDO1FBQWhDLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNqRCxhQUFhLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFRCxXQUFXO1FBQ1QsK0VBQStFO1FBQy9FLGdGQUFnRjtRQUNoRixJQUFJLGFBQWEsQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLEVBQUU7WUFDL0MsYUFBYSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztTQUMzQztJQUNILENBQUM7O0FBbkJEOzs7Ozs7R0FNRztBQUNJLGtDQUFvQixHQUF5QixJQUFLLENBQUE7MEdBZDlDLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDOztBQThCeEMsOEZBQThGO0FBYTlGLE1BQU0sT0FBTyxZQUFZOzt5R0FBWixZQUFZOzZGQUFaLFlBQVkseU9BMUNaLGFBQWE7MkZBMENiLFlBQVk7a0JBWnhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9DQUFvQztvQkFDOUMsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxnQkFBZ0I7d0JBQ3pCLE1BQU0sRUFBRSxLQUFLO3FCQUNkO29CQUNELCtGQUErRjtvQkFDL0YsK0NBQStDO29CQUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztvQkFDaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOztBQUdELDhGQUE4RjtBQWE5RixNQUFNLE9BQU8sWUFBWTs7eUdBQVosWUFBWTs2RkFBWixZQUFZLHlPQXpEWixhQUFhOzJGQXlEYixZQUFZO2tCQVp4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsZ0JBQWdCO3dCQUN6QixNQUFNLEVBQUUsS0FBSztxQkFDZDtvQkFDRCwrRkFBK0Y7b0JBQy9GLCtDQUErQztvQkFDL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87b0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs7QUFHRCxnR0FBZ0c7QUFhaEcsTUFBTSxPQUFPLE1BQU07O21HQUFOLE1BQU07dUZBQU4sTUFBTSxvTkF4RU4sYUFBYTsyRkF3RWIsTUFBTTtrQkFabEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFNBQVM7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLO3FCQUNkO29CQUNELCtGQUErRjtvQkFDL0YsK0NBQStDO29CQUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztvQkFDaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOztBQUdELG9GQUFvRjtBQUlwRixNQUFNLE9BQU8sWUFBWTtJQUV2QixZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFEaEQsc0JBQWlCLEdBQUcsaUJBQWlCLENBQUM7SUFDYSxDQUFDOzt5R0FGekMsWUFBWTs2RkFBWixZQUFZOzJGQUFaLFlBQVk7a0JBSHhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtpQkFDdEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJdGVyYWJsZUNoYW5nZXMsXG4gIEl0ZXJhYmxlRGlmZmVyLFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5TdGljaywgQ2FuU3RpY2tDdG9yLCBtaXhpbkhhc1N0aWNreUlucHV0fSBmcm9tICcuL2Nhbi1zdGljayc7XG5pbXBvcnQge0Nka0NlbGxEZWYsIENka0NvbHVtbkRlZn0gZnJvbSAnLi9jZWxsJztcbmltcG9ydCB7Q0RLX1RBQkxFfSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKlxuICogVGhlIHJvdyB0ZW1wbGF0ZSB0aGF0IGNhbiBiZSB1c2VkIGJ5IHRoZSBtYXQtdGFibGUuIFNob3VsZCBub3QgYmUgdXNlZCBvdXRzaWRlIG9mIHRoZVxuICogbWF0ZXJpYWwgbGlicmFyeS5cbiAqL1xuZXhwb3J0IGNvbnN0IENES19ST1dfVEVNUExBVEUgPSBgPG5nLWNvbnRhaW5lciBjZGtDZWxsT3V0bGV0PjwvbmctY29udGFpbmVyPmA7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIENka0hlYWRlclJvd0RlZiBhbmQgQ2RrUm93RGVmIHRoYXQgaGFuZGxlcyBjaGVja2luZyB0aGVpciBjb2x1bW5zIGlucHV0c1xuICogZm9yIGNoYW5nZXMgYW5kIG5vdGlmeWluZyB0aGUgdGFibGUuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VSb3dEZWYgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAvKiogVGhlIGNvbHVtbnMgdG8gYmUgZGlzcGxheWVkIG9uIHRoaXMgcm93LiAqL1xuICBjb2x1bW5zOiBJdGVyYWJsZTxzdHJpbmc+O1xuXG4gIC8qKiBEaWZmZXIgdXNlZCB0byBjaGVjayBpZiBhbnkgY2hhbmdlcyB3ZXJlIG1hZGUgdG8gdGhlIGNvbHVtbnMuICovXG4gIHByb3RlY3RlZCBfY29sdW1uc0RpZmZlcjogSXRlcmFibGVEaWZmZXI8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqLyBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJvdGVjdGVkIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IGNvbHVtbnMgZGlmZmVyIGlmIG9uZSBkb2VzIG5vdCB5ZXQgZXhpc3QuIEluaXRpYWxpemUgaXQgYmFzZWQgb24gaW5pdGlhbCB2YWx1ZVxuICAgIC8vIG9mIHRoZSBjb2x1bW5zIHByb3BlcnR5IG9yIGFuIGVtcHR5IGFycmF5IGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgaWYgKCF0aGlzLl9jb2x1bW5zRGlmZmVyKSB7XG4gICAgICBjb25zdCBjb2x1bW5zID0gKGNoYW5nZXNbJ2NvbHVtbnMnXSAmJiBjaGFuZ2VzWydjb2x1bW5zJ10uY3VycmVudFZhbHVlKSB8fCBbXTtcbiAgICAgIHRoaXMuX2NvbHVtbnNEaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQoY29sdW1ucykuY3JlYXRlKCk7XG4gICAgICB0aGlzLl9jb2x1bW5zRGlmZmVyLmRpZmYoY29sdW1ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY3VycmVudCBjb2x1bW5zIGFuZCB0aGUgY29sdW1ucyBmcm9tIHRoZSBsYXN0IGRpZmYsIG9yIG51bGxcbiAgICogaWYgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZS5cbiAgICovXG4gIGdldENvbHVtbnNEaWZmKCk6IEl0ZXJhYmxlQ2hhbmdlczxhbnk+IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbnNEaWZmZXIuZGlmZih0aGlzLmNvbHVtbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhpcyByb3cgZGVmJ3MgcmVsZXZhbnQgY2VsbCB0ZW1wbGF0ZSBmcm9tIHRoZSBwcm92aWRlZCBjb2x1bW4gZGVmLiAqL1xuICBleHRyYWN0Q2VsbFRlbXBsYXRlKGNvbHVtbjogQ2RrQ29sdW1uRGVmKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBDZGtIZWFkZXJSb3dEZWYpIHtcbiAgICAgIHJldHVybiBjb2x1bW4uaGVhZGVyQ2VsbC50ZW1wbGF0ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBDZGtGb290ZXJSb3dEZWYpIHtcbiAgICAgIHJldHVybiBjb2x1bW4uZm9vdGVyQ2VsbC50ZW1wbGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbHVtbi5jZWxsLnRlbXBsYXRlO1xuICAgIH1cbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIENka0hlYWRlclJvd0RlZi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBDZGtIZWFkZXJSb3dEZWZCYXNlIGV4dGVuZHMgQmFzZVJvd0RlZiB7fVxuY29uc3QgX0Nka0hlYWRlclJvd0RlZkJhc2U6IENhblN0aWNrQ3RvciAmIHR5cGVvZiBDZGtIZWFkZXJSb3dEZWZCYXNlID1cbiAgbWl4aW5IYXNTdGlja3lJbnB1dChDZGtIZWFkZXJSb3dEZWZCYXNlKTtcblxuLyoqXG4gKiBIZWFkZXIgcm93IGRlZmluaXRpb24gZm9yIHRoZSBDREsgdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgaGVhZGVyIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBoZWFkZXIgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtIZWFkZXJSb3dEZWZdJyxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IGNka0hlYWRlclJvd0RlZicsICdzdGlja3k6IGNka0hlYWRlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtIZWFkZXJSb3dEZWYgZXh0ZW5kcyBfQ2RrSGVhZGVyUm93RGVmQmFzZSBpbXBsZW1lbnRzIENhblN0aWNrLCBPbkNoYW5nZXMge1xuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBfZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIEBJbmplY3QoQ0RLX1RBQkxFKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3RhYmxlPzogYW55LFxuICApIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgX2RpZmZlcnMpO1xuICB9XG5cbiAgLy8gUHJlcmVuZGVyIGZhaWxzIHRvIHJlY29nbml6ZSB0aGF0IG5nT25DaGFuZ2VzIGluIGEgcGFydCBvZiB0aGlzIGNsYXNzIHRocm91Z2ggaW5oZXJpdGFuY2UuXG4gIC8vIEV4cGxpY2l0bHkgZGVmaW5lIGl0IHNvIHRoYXQgdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXMgcGFydCBvZiB0aGUgQW5ndWxhciBsaWZlY3ljbGUuXG4gIG92ZXJyaWRlIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIENka0Zvb3RlclJvd0RlZi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBDZGtGb290ZXJSb3dEZWZCYXNlIGV4dGVuZHMgQmFzZVJvd0RlZiB7fVxuY29uc3QgX0Nka0Zvb3RlclJvd0RlZkJhc2U6IENhblN0aWNrQ3RvciAmIHR5cGVvZiBDZGtGb290ZXJSb3dEZWZCYXNlID1cbiAgbWl4aW5IYXNTdGlja3lJbnB1dChDZGtGb290ZXJSb3dEZWZCYXNlKTtcblxuLyoqXG4gKiBGb290ZXIgcm93IGRlZmluaXRpb24gZm9yIHRoZSBDREsgdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgZm9vdGVyIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciBmb290ZXIgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtGb290ZXJSb3dEZWZdJyxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IGNka0Zvb3RlclJvd0RlZicsICdzdGlja3k6IGNka0Zvb3RlclJvd0RlZlN0aWNreSddLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtGb290ZXJSb3dEZWYgZXh0ZW5kcyBfQ2RrRm9vdGVyUm93RGVmQmFzZSBpbXBsZW1lbnRzIENhblN0aWNrLCBPbkNoYW5nZXMge1xuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBfZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIEBJbmplY3QoQ0RLX1RBQkxFKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3RhYmxlPzogYW55LFxuICApIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgX2RpZmZlcnMpO1xuICB9XG5cbiAgLy8gUHJlcmVuZGVyIGZhaWxzIHRvIHJlY29nbml6ZSB0aGF0IG5nT25DaGFuZ2VzIGluIGEgcGFydCBvZiB0aGlzIGNsYXNzIHRocm91Z2ggaW5oZXJpdGFuY2UuXG4gIC8vIEV4cGxpY2l0bHkgZGVmaW5lIGl0IHNvIHRoYXQgdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXMgcGFydCBvZiB0aGUgQW5ndWxhciBsaWZlY3ljbGUuXG4gIG92ZXJyaWRlIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxufVxuXG4vKipcbiAqIERhdGEgcm93IGRlZmluaXRpb24gZm9yIHRoZSBDREsgdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgaGVhZGVyIHJvdydzIHRlbXBsYXRlIGFuZCBvdGhlciByb3cgcHJvcGVydGllcyBzdWNoIGFzIHRoZSBjb2x1bW5zIHRvIGRpc3BsYXkgYW5kXG4gKiBhIHdoZW4gcHJlZGljYXRlIHRoYXQgZGVzY3JpYmVzIHdoZW4gdGhpcyByb3cgc2hvdWxkIGJlIHVzZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtSb3dEZWZdJyxcbiAgaW5wdXRzOiBbJ2NvbHVtbnM6IGNka1Jvd0RlZkNvbHVtbnMnLCAnd2hlbjogY2RrUm93RGVmV2hlbiddLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtSb3dEZWY8VD4gZXh0ZW5kcyBCYXNlUm93RGVmIHtcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiB0cnVlIGlmIHRoaXMgcm93IHRlbXBsYXRlIHNob3VsZCBiZSB1c2VkIGZvciB0aGUgcHJvdmlkZWQgaW5kZXhcbiAgICogYW5kIHJvdyBkYXRhLiBJZiBsZWZ0IHVuZGVmaW5lZCwgdGhpcyByb3cgd2lsbCBiZSBjb25zaWRlcmVkIHRoZSBkZWZhdWx0IHJvdyB0ZW1wbGF0ZSB0byB1c2VcbiAgICogd2hlbiBubyBvdGhlciB3aGVuIGZ1bmN0aW9ucyByZXR1cm4gdHJ1ZSBmb3IgdGhlIGRhdGEuXG4gICAqIEZvciBldmVyeSByb3csIHRoZXJlIG11c3QgYmUgYXQgbGVhc3Qgb25lIHdoZW4gZnVuY3Rpb24gdGhhdCBwYXNzZXMgb3IgYW4gdW5kZWZpbmVkIHRvIGRlZmF1bHQuXG4gICAqL1xuICB3aGVuOiAoaW5kZXg6IG51bWJlciwgcm93RGF0YTogVCkgPT4gYm9vbGVhbjtcblxuICAvLyBUT0RPKGFuZHJld3NlZ3Vpbik6IEFkZCBhbiBpbnB1dCBmb3IgcHJvdmlkaW5nIGEgc3dpdGNoIGZ1bmN0aW9uIHRvIGRldGVybWluZVxuICAvLyAgIGlmIHRoaXMgdGVtcGxhdGUgc2hvdWxkIGJlIHVzZWQuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgQEluamVjdChDREtfVEFCTEUpIEBPcHRpb25hbCgpIHB1YmxpYyBfdGFibGU/OiBhbnksXG4gICkge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBfZGlmZmVycyk7XG4gIH1cbn1cblxuLyoqIENvbnRleHQgcHJvdmlkZWQgdG8gdGhlIHJvdyBjZWxscyB3aGVuIGBtdWx0aVRlbXBsYXRlRGF0YVJvd3NgIGlzIGZhbHNlICovXG5leHBvcnQgaW50ZXJmYWNlIENka0NlbGxPdXRsZXRSb3dDb250ZXh0PFQ+IHtcbiAgLyoqIERhdGEgZm9yIHRoZSByb3cgdGhhdCB0aGlzIGNlbGwgaXMgbG9jYXRlZCB3aXRoaW4uICovXG4gICRpbXBsaWNpdD86IFQ7XG5cbiAgLyoqIEluZGV4IG9mIHRoZSBkYXRhIG9iamVjdCBpbiB0aGUgcHJvdmlkZWQgZGF0YSBhcnJheS4gKi9cbiAgaW5kZXg/OiBudW1iZXI7XG5cbiAgLyoqIExlbmd0aCBvZiB0aGUgbnVtYmVyIG9mIHRvdGFsIHJvd3MuICovXG4gIGNvdW50PzogbnVtYmVyO1xuXG4gIC8qKiBUcnVlIGlmIHRoaXMgY2VsbCBpcyBjb250YWluZWQgaW4gdGhlIGZpcnN0IHJvdy4gKi9cbiAgZmlyc3Q/OiBib29sZWFuO1xuXG4gIC8qKiBUcnVlIGlmIHRoaXMgY2VsbCBpcyBjb250YWluZWQgaW4gdGhlIGxhc3Qgcm93LiAqL1xuICBsYXN0PzogYm9vbGVhbjtcblxuICAvKiogVHJ1ZSBpZiB0aGlzIGNlbGwgaXMgY29udGFpbmVkIGluIGEgcm93IHdpdGggYW4gZXZlbi1udW1iZXJlZCBpbmRleC4gKi9cbiAgZXZlbj86IGJvb2xlYW47XG5cbiAgLyoqIFRydWUgaWYgdGhpcyBjZWxsIGlzIGNvbnRhaW5lZCBpbiBhIHJvdyB3aXRoIGFuIG9kZC1udW1iZXJlZCBpbmRleC4gKi9cbiAgb2RkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb250ZXh0IHByb3ZpZGVkIHRvIHRoZSByb3cgY2VsbHMgd2hlbiBgbXVsdGlUZW1wbGF0ZURhdGFSb3dzYCBpcyB0cnVlLiBUaGlzIGNvbnRleHQgaXMgdGhlIHNhbWVcbiAqIGFzIENka0NlbGxPdXRsZXRSb3dDb250ZXh0IGV4Y2VwdCB0aGF0IHRoZSBzaW5nbGUgYGluZGV4YCB2YWx1ZSBpcyByZXBsYWNlZCBieSBgZGF0YUluZGV4YCBhbmRcbiAqIGByZW5kZXJJbmRleGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2RrQ2VsbE91dGxldE11bHRpUm93Q29udGV4dDxUPiB7XG4gIC8qKiBEYXRhIGZvciB0aGUgcm93IHRoYXQgdGhpcyBjZWxsIGlzIGxvY2F0ZWQgd2l0aGluLiAqL1xuICAkaW1wbGljaXQ/OiBUO1xuXG4gIC8qKiBJbmRleCBvZiB0aGUgZGF0YSBvYmplY3QgaW4gdGhlIHByb3ZpZGVkIGRhdGEgYXJyYXkuICovXG4gIGRhdGFJbmRleD86IG51bWJlcjtcblxuICAvKiogSW5kZXggbG9jYXRpb24gb2YgdGhlIHJlbmRlcmVkIHJvdyB0aGF0IHRoaXMgY2VsbCBpcyBsb2NhdGVkIHdpdGhpbi4gKi9cbiAgcmVuZGVySW5kZXg/OiBudW1iZXI7XG5cbiAgLyoqIExlbmd0aCBvZiB0aGUgbnVtYmVyIG9mIHRvdGFsIHJvd3MuICovXG4gIGNvdW50PzogbnVtYmVyO1xuXG4gIC8qKiBUcnVlIGlmIHRoaXMgY2VsbCBpcyBjb250YWluZWQgaW4gdGhlIGZpcnN0IHJvdy4gKi9cbiAgZmlyc3Q/OiBib29sZWFuO1xuXG4gIC8qKiBUcnVlIGlmIHRoaXMgY2VsbCBpcyBjb250YWluZWQgaW4gdGhlIGxhc3Qgcm93LiAqL1xuICBsYXN0PzogYm9vbGVhbjtcblxuICAvKiogVHJ1ZSBpZiB0aGlzIGNlbGwgaXMgY29udGFpbmVkIGluIGEgcm93IHdpdGggYW4gZXZlbi1udW1iZXJlZCBpbmRleC4gKi9cbiAgZXZlbj86IGJvb2xlYW47XG5cbiAgLyoqIFRydWUgaWYgdGhpcyBjZWxsIGlzIGNvbnRhaW5lZCBpbiBhIHJvdyB3aXRoIGFuIG9kZC1udW1iZXJlZCBpbmRleC4gKi9cbiAgb2RkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPdXRsZXQgZm9yIHJlbmRlcmluZyBjZWxscyBpbnNpZGUgb2YgYSByb3cgb3IgaGVhZGVyIHJvdy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbY2RrQ2VsbE91dGxldF0nfSlcbmV4cG9ydCBjbGFzcyBDZGtDZWxsT3V0bGV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIFRoZSBvcmRlcmVkIGxpc3Qgb2YgY2VsbHMgdG8gcmVuZGVyIHdpdGhpbiB0aGlzIG91dGxldCdzIHZpZXcgY29udGFpbmVyICovXG4gIGNlbGxzOiBDZGtDZWxsRGVmW107XG5cbiAgLyoqIFRoZSBkYXRhIGNvbnRleHQgdG8gYmUgcHJvdmlkZWQgdG8gZWFjaCBjZWxsICovXG4gIGNvbnRleHQ6IGFueTtcblxuICAvKipcbiAgICogU3RhdGljIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlIGxhdGVzdCBjb25zdHJ1Y3RlZCBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuICAgKiBVc2VkIGJ5IHRoZSBDREsgdGFibGUgd2hlbiBlYWNoIENka0hlYWRlclJvdyBhbmQgQ2RrUm93IGNvbXBvbmVudCBpcyBjcmVhdGVkIHVzaW5nXG4gICAqIGNyZWF0ZUVtYmVkZGVkVmlldy4gQWZ0ZXIgb25lIG9mIHRoZXNlIGNvbXBvbmVudHMgYXJlIGNyZWF0ZWQsIHRoaXMgcHJvcGVydHkgd2lsbCBwcm92aWRlXG4gICAqIGEgaGFuZGxlIHRvIHByb3ZpZGUgdGhhdCBjb21wb25lbnQncyBjZWxscyBhbmQgY29udGV4dC4gQWZ0ZXIgaW5pdCwgdGhlIENka0NlbGxPdXRsZXQgd2lsbFxuICAgKiBjb25zdHJ1Y3QgdGhlIGNlbGxzIHdpdGggdGhlIHByb3ZpZGVkIGNvbnRleHQuXG4gICAqL1xuICBzdGF0aWMgbW9zdFJlY2VudENlbGxPdXRsZXQ6IENka0NlbGxPdXRsZXQgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX3ZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICBDZGtDZWxsT3V0bGV0Lm1vc3RSZWNlbnRDZWxsT3V0bGV0ID0gdGhpcztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIElmIHRoaXMgd2FzIHRoZSBsYXN0IG91dGxldCBiZWluZyByZW5kZXJlZCBpbiB0aGUgdmlldywgcmVtb3ZlIHRoZSByZWZlcmVuY2VcbiAgICAvLyBmcm9tIHRoZSBzdGF0aWMgcHJvcGVydHkgYWZ0ZXIgaXQgaGFzIGJlZW4gZGVzdHJveWVkIHRvIGF2b2lkIGxlYWtpbmcgbWVtb3J5LlxuICAgIGlmIChDZGtDZWxsT3V0bGV0Lm1vc3RSZWNlbnRDZWxsT3V0bGV0ID09PSB0aGlzKSB7XG4gICAgICBDZGtDZWxsT3V0bGV0Lm1vc3RSZWNlbnRDZWxsT3V0bGV0ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEhlYWRlciB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2RrLWhlYWRlci1yb3csIHRyW2Nkay1oZWFkZXItcm93XScsXG4gIHRlbXBsYXRlOiBDREtfUk9XX1RFTVBMQVRFLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ2Nkay1oZWFkZXItcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIENka0hlYWRlclJvdyB7fVxuXG4vKiogRm9vdGVyIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBjZWxsIG91dGxldC4gQWRkcyB0aGUgcmlnaHQgY2xhc3MgYW5kIHJvbGUuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjZGstZm9vdGVyLXJvdywgdHJbY2RrLWZvb3Rlci1yb3ddJyxcbiAgdGVtcGxhdGU6IENES19ST1dfVEVNUExBVEUsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnY2RrLWZvb3Rlci1yb3cnLFxuICAgICdyb2xlJzogJ3JvdycsXG4gIH0sXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrRm9vdGVyUm93IHt9XG5cbi8qKiBEYXRhIHJvdyB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgY2VsbCBvdXRsZXQuIEFkZHMgdGhlIHJpZ2h0IGNsYXNzIGFuZCByb2xlLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2RrLXJvdywgdHJbY2RrLXJvd10nLFxuICB0ZW1wbGF0ZTogQ0RLX1JPV19URU1QTEFURSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdjZGstcm93JyxcbiAgICAncm9sZSc6ICdyb3cnLFxuICB9LFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIENka1JvdyB7fVxuXG4vKiogUm93IHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBhIG1lc3NhZ2Ugd2hlbiBubyBkYXRhIGlzIHNob3duIGluIHRoZSB0YWJsZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW2Nka05vRGF0YVJvd10nLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtOb0RhdGFSb3cge1xuICBfY29udGVudENsYXNzTmFtZSA9ICdjZGstbm8tZGF0YS1yb3cnO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG4iXX0=