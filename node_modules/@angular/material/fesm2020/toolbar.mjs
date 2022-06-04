import * as i0 from '@angular/core';
import { Directive, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, ContentChildren, NgModule } from '@angular/core';
import { mixinColor, MatCommonModule } from '@angular/material/core';
import * as i1 from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Boilerplate for applying mixins to MatToolbar.
/** @docs-private */
const _MatToolbarBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
class MatToolbarRow {
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
class MatToolbar extends _MatToolbarBase {
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
function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class MatToolbarModule {
}
MatToolbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatToolbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarModule, declarations: [MatToolbar, MatToolbarRow], imports: [MatCommonModule], exports: [MatToolbar, MatToolbarRow, MatCommonModule] });
MatToolbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarModule, imports: [[MatCommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatToolbarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: [MatToolbar, MatToolbarRow, MatCommonModule],
                    declarations: [MatToolbar, MatToolbarRow],
                }]
        }] });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MatToolbar, MatToolbarModule, MatToolbarRow, throwToolbarMixedModesError };
//# sourceMappingURL=toolbar.mjs.map
