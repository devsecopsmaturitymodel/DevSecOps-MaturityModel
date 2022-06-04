/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject, QueryList, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
// Boilerplate for applying mixins to MatToolbar.
/** @docs-private */
const _MatToolbarBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
export class MatToolbarRow {
}
MatToolbarRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarRow, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatToolbarRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatToolbarRow, selector: "mat-toolbar-row", host: { classAttribute: "mat-toolbar-row" }, exportAs: ["matToolbarRow"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-toolbar-row',
                    exportAs: 'matToolbarRow',
                    host: { 'class': 'mat-toolbar-row' },
                }]
        }] });
export class MatToolbar extends _MatToolbarBase {
    constructor(elementRef, _platform, document) {
        super(elementRef);
        this._platform = _platform;
        // TODO: make the document a required param when doing breaking changes.
        this._document = document;
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._checkToolbarMixedModes();
            this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
        }
    }
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    _checkToolbarMixedModes() {
        if (this._toolbarRows.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            // Check if there are any other DOM nodes that can display content but aren't inside of
            // a <mat-toolbar-row> element.
            const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes)
                .filter(node => !(node.classList && node.classList.contains('mat-toolbar-row')))
                .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
                .some(node => !!(node.textContent && node.textContent.trim()));
            if (isCombinedUsage) {
                throwToolbarMixedModesError();
            }
        }
    }
}
MatToolbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbar, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
MatToolbar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatToolbar, selector: "mat-toolbar", inputs: { color: "color" }, host: { properties: { "class.mat-toolbar-multiple-rows": "_toolbarRows.length > 0", "class.mat-toolbar-single-row": "_toolbarRows.length === 0" }, classAttribute: "mat-toolbar" }, queries: [{ propertyName: "_toolbarRows", predicate: MatToolbarRow, descendants: true }], exportAs: ["matToolbar"], usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n", styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbar, decorators: [{
            type: Component,
            args: [{ selector: 'mat-toolbar', exportAs: 'matToolbar', inputs: ['color'], host: {
                        'class': 'mat-toolbar',
                        '[class.mat-toolbar-multiple-rows]': '_toolbarRows.length > 0',
                        '[class.mat-toolbar-single-row]': '_toolbarRows.length === 0',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n", styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { _toolbarRows: [{
                type: ContentChildren,
                args: [MatToolbarRow, { descendants: true }]
            }] } });
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sYmFyL3Rvb2xiYXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbGJhci90b29sYmFyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVcsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7OztBQUU1RCxpREFBaUQ7QUFDakQsb0JBQW9CO0FBQ3BCLE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FDaEM7SUFDRSxZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0MsQ0FDRixDQUFDO0FBT0YsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUx6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxlQUFlO29CQUN6QixJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7aUJBQ25DOztBQWlCRCxNQUFNLE9BQU8sVUFBVyxTQUFRLGVBQWU7SUFNN0MsWUFDRSxVQUFzQixFQUNkLFNBQW1CLEVBQ1QsUUFBYztRQUVoQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFIVixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBSzNCLHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUM7U0FDM0U7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSyx1QkFBdUI7UUFDN0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUMvRSx1RkFBdUY7WUFDdkYsK0JBQStCO1lBQy9CLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQWMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO2lCQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFakUsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLDJCQUEyQixFQUFFLENBQUM7YUFDL0I7U0FDRjtJQUNILENBQUM7O3VHQXhDVSxVQUFVLG9FQVNYLFFBQVE7MkZBVFAsVUFBVSxnU0FJSixhQUFhLGlHQ3hEaEMsbUZBRUE7MkZEa0RhLFVBQVU7a0JBZHRCLFNBQVM7K0JBQ0UsYUFBYSxZQUNiLFlBQVksVUFHZCxDQUFDLE9BQU8sQ0FBQyxRQUNYO3dCQUNKLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixtQ0FBbUMsRUFBRSx5QkFBeUI7d0JBQzlELGdDQUFnQyxFQUFFLDJCQUEyQjtxQkFDOUQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUk7OzBCQVdsQyxNQUFNOzJCQUFDLFFBQVE7NENBTG1DLFlBQVk7c0JBQWhFLGVBQWU7dUJBQUMsYUFBYSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs7QUF1Q3JEOzs7R0FHRztBQUNILE1BQU0sVUFBVSwyQkFBMkI7SUFDekMsTUFBTSxLQUFLLENBQ1QsNkRBQTZEO1FBQzNELHdGQUF3RjtRQUN4RiwrQ0FBK0MsQ0FDbEQsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRvb2xiYXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFRvb2xiYXJCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbik7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10b29sYmFyLXJvdycsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbGJhclJvdycsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LXRvb2xiYXItcm93J30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXJSb3cge31cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2xiYXInLFxuICBleHBvcnRBczogJ21hdFRvb2xiYXInLFxuICB0ZW1wbGF0ZVVybDogJ3Rvb2xiYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0b29sYmFyLmNzcyddLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdG9vbGJhcicsXG4gICAgJ1tjbGFzcy5tYXQtdG9vbGJhci1tdWx0aXBsZS1yb3dzXSc6ICdfdG9vbGJhclJvd3MubGVuZ3RoID4gMCcsXG4gICAgJ1tjbGFzcy5tYXQtdG9vbGJhci1zaW5nbGUtcm93XSc6ICdfdG9vbGJhclJvd3MubGVuZ3RoID09PSAwJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXIgZXh0ZW5kcyBfTWF0VG9vbGJhckJhc2UgaW1wbGVtZW50cyBDYW5Db2xvciwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCB0b29sYmFyIHJvdyBlbGVtZW50cyB0aGF0IGhhdmUgYmVlbiBwcm9qZWN0ZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VG9vbGJhclJvdywge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3Rvb2xiYXJSb3dzOiBRdWVyeUxpc3Q8TWF0VG9vbGJhclJvdz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ/OiBhbnksXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gVE9ETzogbWFrZSB0aGUgZG9jdW1lbnQgYSByZXF1aXJlZCBwYXJhbSB3aGVuIGRvaW5nIGJyZWFraW5nIGNoYW5nZXMuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCk7XG4gICAgICB0aGlzLl90b29sYmFyUm93cy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gZGV2ZWxvcGVycyBhcmUgYXR0ZW1wdGluZyB0byBjb21iaW5lIHRoZSBkaWZmZXJlbnQgdG9vbGJhciByb3cgbW9kZXMuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkge1xuICAgIGlmICh0aGlzLl90b29sYmFyUm93cy5sZW5ndGggJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgb3RoZXIgRE9NIG5vZGVzIHRoYXQgY2FuIGRpc3BsYXkgY29udGVudCBidXQgYXJlbid0IGluc2lkZSBvZlxuICAgICAgLy8gYSA8bWF0LXRvb2xiYXItcm93PiBlbGVtZW50LlxuICAgICAgY29uc3QgaXNDb21iaW5lZFVzYWdlID0gQXJyYXkuZnJvbTxIVE1MRWxlbWVudD4odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpXG4gICAgICAgIC5maWx0ZXIobm9kZSA9PiAhKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtdG9vbGJhci1yb3cnKSkpXG4gICAgICAgIC5maWx0ZXIobm9kZSA9PiBub2RlLm5vZGVUeXBlICE9PSAodGhpcy5fZG9jdW1lbnQgPyB0aGlzLl9kb2N1bWVudC5DT01NRU5UX05PREUgOiA4KSlcbiAgICAgICAgLnNvbWUobm9kZSA9PiAhIShub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSk7XG5cbiAgICAgIGlmIChpc0NvbWJpbmVkVXNhZ2UpIHtcbiAgICAgICAgdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIGF0dGVtcHRpbmcgdG8gY29tYmluZSB0aGUgZGlmZmVyZW50IHRvb2xiYXIgcm93IG1vZGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCkge1xuICB0aHJvdyBFcnJvcihcbiAgICAnTWF0VG9vbGJhcjogQXR0ZW1wdGluZyB0byBjb21iaW5lIGRpZmZlcmVudCB0b29sYmFyIG1vZGVzLiAnICtcbiAgICAgICdFaXRoZXIgc3BlY2lmeSBtdWx0aXBsZSBgPG1hdC10b29sYmFyLXJvdz5gIGVsZW1lbnRzIGV4cGxpY2l0bHkgb3IganVzdCBwbGFjZSBjb250ZW50ICcgK1xuICAgICAgJ2luc2lkZSBvZiBhIGA8bWF0LXRvb2xiYXI+YCBmb3IgYSBzaW5nbGUgcm93LicsXG4gICk7XG59XG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtdG9vbGJhci1yb3dcIj48L25nLWNvbnRlbnQ+XG4iXX0=