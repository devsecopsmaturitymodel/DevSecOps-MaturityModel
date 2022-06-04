/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_ERROR: InjectionToken<MatError>;
/** Single error message to be shown underneath the form field. */
export declare class MatError {
    id: string;
    constructor(ariaLive: string, elementRef: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatError, [{ attribute: "aria-live"; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatError, "mat-error", never, { "id": "id"; }, {}, never>;
}
