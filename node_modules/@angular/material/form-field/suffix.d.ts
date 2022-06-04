/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatSuffix`. It serves as
 * alternative token to the actual `MatSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_SUFFIX: InjectionToken<MatSuffix>;
/** Suffix to be placed at the end of the form field. */
export declare class MatSuffix {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSuffix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSuffix, "[matSuffix]", never, {}, {}, never>;
}
