/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { CanDisable } from '@angular/material/core';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatTabLabelWrapperBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/**
 * Used in the `mat-tab-group` view to display tab labels.
 * @docs-private
 */
export declare class MatTabLabelWrapper extends _MatTabLabelWrapperBase implements CanDisable {
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    /** Sets focus on the wrapper element */
    focus(): void;
    getOffsetLeft(): number;
    getOffsetWidth(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabLabelWrapper, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabLabelWrapper, "[matTabLabelWrapper]", never, { "disabled": "disabled"; }, {}, never>;
}
export {};
