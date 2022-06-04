/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, QueryList } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../common-behaviors/common-module";
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
export declare class MatLine {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLine, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLine, "[mat-line], [matLine]", never, {}, {}, never>;
}
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
export declare function setLines(lines: QueryList<unknown>, element: ElementRef<HTMLElement>, prefix?: string): void;
export declare class MatLineModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLineModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLineModule, [typeof MatLine], [typeof i1.MatCommonModule], [typeof MatLine, typeof i1.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLineModule>;
}
