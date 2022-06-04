/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ElementRef, Input, Optional, ContentChildren, QueryList, Directive, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatLine, setLines } from '@angular/material/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
import * as i0 from "@angular/core";
export class MatGridTile {
    constructor(_element, _gridList) {
        this._element = _element;
        this._gridList = _gridList;
        this._rowspan = 1;
        this._colspan = 1;
    }
    /** Amount of rows that the grid tile takes up. */
    get rowspan() {
        return this._rowspan;
    }
    set rowspan(value) {
        this._rowspan = Math.round(coerceNumberProperty(value));
    }
    /** Amount of columns that the grid tile takes up. */
    get colspan() {
        return this._colspan;
    }
    set colspan(value) {
        this._colspan = Math.round(coerceNumberProperty(value));
    }
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    _setStyle(property, value) {
        this._element.nativeElement.style[property] = value;
    }
}
MatGridTile.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTile, deps: [{ token: i0.ElementRef }, { token: MAT_GRID_LIST, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatGridTile.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatGridTile, selector: "mat-grid-tile", inputs: { rowspan: "rowspan", colspan: "colspan" }, host: { properties: { "attr.rowspan": "rowspan", "attr.colspan": "colspan" }, classAttribute: "mat-grid-tile" }, exportAs: ["matGridTile"], ngImport: i0, template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTile, decorators: [{
            type: Component,
            args: [{ selector: 'mat-grid-tile', exportAs: 'matGridTile', host: {
                        'class': 'mat-grid-tile',
                        // Ensures that the "rowspan" and "colspan" input value is reflected in
                        // the DOM. This is needed for the grid-tile harness.
                        '[attr.rowspan]': 'rowspan',
                        '[attr.colspan]': 'colspan',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_GRID_LIST]
                }] }]; }, propDecorators: { rowspan: [{
                type: Input
            }], colspan: [{
                type: Input
            }] } });
export class MatGridTileText {
    constructor(_element) {
        this._element = _element;
    }
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
}
MatGridTileText.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileText, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
MatGridTileText.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatGridTileText, selector: "mat-grid-tile-header, mat-grid-tile-footer", queries: [{ propertyName: "_lines", predicate: MatLine, descendants: true }], ngImport: i0, template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileText, decorators: [{
            type: Component,
            args: [{ selector: 'mat-grid-tile-header, mat-grid-tile-footer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { _lines: [{
                type: ContentChildren,
                args: [MatLine, { descendants: true }]
            }] } });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridAvatarCssMatStyler {
}
MatGridAvatarCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridAvatarCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridAvatarCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatGridAvatarCssMatStyler, selector: "[mat-grid-avatar], [matGridAvatar]", host: { classAttribute: "mat-grid-avatar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridAvatarCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-grid-avatar], [matGridAvatar]',
                    host: { 'class': 'mat-grid-avatar' },
                }]
        }] });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridTileHeaderCssMatStyler {
}
MatGridTileHeaderCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileHeaderCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridTileHeaderCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatGridTileHeaderCssMatStyler, selector: "mat-grid-tile-header", host: { classAttribute: "mat-grid-tile-header" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileHeaderCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-grid-tile-header',
                    host: { 'class': 'mat-grid-tile-header' },
                }]
        }] });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridTileFooterCssMatStyler {
}
MatGridTileFooterCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileFooterCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridTileFooterCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatGridTileFooterCssMatStyler, selector: "mat-grid-tile-footer", host: { classAttribute: "mat-grid-tile-footer" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridTileFooterCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-grid-tile-footer',
                    host: { 'class': 'mat-grid-tile-footer' },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L2dyaWQtdGlsZS5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUtdGV4dC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixLQUFLLEVBQ0wsUUFBUSxFQUNSLGVBQWUsRUFDZixTQUFTLEVBRVQsU0FBUyxFQUNULHVCQUF1QixFQUN2QixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDOztBQWlCaEUsTUFBTSxPQUFPLFdBQVc7SUFJdEIsWUFDVSxRQUFpQyxFQUNDLFNBQTJCO1FBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBS2xCLENBQUM7SUFFSixrREFBa0Q7SUFDbEQsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFrQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQscURBQXFEO0lBQ3JELElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBa0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxRQUFnQixFQUFFLEtBQVU7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUMvRCxDQUFDOzt3R0FqQ1UsV0FBVyw0Q0FNQSxhQUFhOzRGQU54QixXQUFXLHFQQ3hDeEIsOEVBR0E7MkZEcUNhLFdBQVc7a0JBZnZCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGFBQWEsUUFDakI7d0JBQ0osT0FBTyxFQUFFLGVBQWU7d0JBQ3hCLHVFQUF1RTt3QkFDdkUscURBQXFEO3dCQUNyRCxnQkFBZ0IsRUFBRSxTQUFTO3dCQUMzQixnQkFBZ0IsRUFBRSxTQUFTO3FCQUM1QixpQkFHYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzswQkFRNUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxhQUFhOzRDQUsvQixPQUFPO3NCQURWLEtBQUs7Z0JBVUYsT0FBTztzQkFEVixLQUFLOztBQXVCUixNQUFNLE9BQU8sZUFBZTtJQUcxQixZQUFvQixRQUFpQztRQUFqQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtJQUFHLENBQUM7SUFFekQsa0JBQWtCO1FBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs0R0FQVSxlQUFlO2dHQUFmLGVBQWUseUdBQ1QsT0FBTyxnREVuRjFCLDBNQUdBOzJGRitFYSxlQUFlO2tCQU4zQixTQUFTOytCQUNFLDRDQUE0QyxtQkFFckMsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTtpR0FHVSxNQUFNO3NCQUFwRCxlQUFlO3VCQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7O0FBUy9DOzs7R0FHRztBQUtILE1BQU0sT0FBTyx5QkFBeUI7O3NIQUF6Qix5QkFBeUI7MEdBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQUpyQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQztpQkFDbkM7O0FBR0Q7OztHQUdHO0FBS0gsTUFBTSxPQUFPLDZCQUE2Qjs7MEhBQTdCLDZCQUE2Qjs4R0FBN0IsNkJBQTZCOzJGQUE3Qiw2QkFBNkI7a0JBSnpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2lCQUN4Qzs7QUFHRDs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sNkJBQTZCOzswSEFBN0IsNkJBQTZCOzhHQUE3Qiw2QkFBNkI7MkZBQTdCLDZCQUE2QjtrQkFKekMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUM7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIERpcmVjdGl2ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdExpbmUsIHNldExpbmVzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC10aWxlJyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkVGlsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtdGlsZScsXG4gICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBcInJvd3NwYW5cIiBhbmQgXCJjb2xzcGFuXCIgaW5wdXQgdmFsdWUgaXMgcmVmbGVjdGVkIGluXG4gICAgLy8gdGhlIERPTS4gVGhpcyBpcyBuZWVkZWQgZm9yIHRoZSBncmlkLXRpbGUgaGFybmVzcy5cbiAgICAnW2F0dHIucm93c3Bhbl0nOiAncm93c3BhbicsXG4gICAgJ1thdHRyLmNvbHNwYW5dJzogJ2NvbHNwYW4nLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtdGlsZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2dyaWQtbGlzdC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlIHtcbiAgX3Jvd3NwYW46IG51bWJlciA9IDE7XG4gIF9jb2xzcGFuOiBudW1iZXIgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0dSSURfTElTVCkgcHVibGljIF9ncmlkTGlzdD86IE1hdEdyaWRMaXN0QmFzZSxcbiAgKSB7fVxuXG4gIC8qKiBBbW91bnQgb2Ygcm93cyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dzcGFuKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd3NwYW47XG4gIH1cbiAgc2V0IHJvd3NwYW4odmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fcm93c3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTtcbiAgfVxuXG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSBncmlkIHRpbGUgdGFrZXMgdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzcGFuKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHNwYW47XG4gIH1cbiAgc2V0IGNvbHNwYW4odmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fY29sc3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBvZiB0aGUgZ3JpZC10aWxlIGVsZW1lbnQuICBOZWVkcyB0byBiZSBzZXQgbWFudWFsbHkgdG8gYXZvaWRcbiAgICogXCJDaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMgdGhhdCB3b3VsZCBvY2N1ciB3aXRoIEhvc3RCaW5kaW5nLlxuICAgKi9cbiAgX3NldFN0eWxlKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXIsIG1hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLXRpbGUtdGV4dC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlVGV4dCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpbmUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzZXRMaW5lcyh0aGlzLl9saW5lcywgdGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1ncmlkLWF2YXRhcl0sIFttYXRHcmlkQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWdyaWQtYXZhdGFyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWZvb3Rlcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlciB7fVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1ncmlkLXRpbGUtY29udGVudFwiPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cIlttYXQtZ3JpZC1hdmF0YXJdLCBbbWF0R3JpZEF2YXRhcl1cIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwibWF0LWdyaWQtbGlzdC10ZXh0XCI+PG5nLWNvbnRlbnQgc2VsZWN0PVwiW21hdC1saW5lXSwgW21hdExpbmVdXCI+PC9uZy1jb250ZW50PjwvZGl2PlxuPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19