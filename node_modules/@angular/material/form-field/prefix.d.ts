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
 * Injection token that can be used to reference instances of `MatPrefix`. It serves as
 * alternative token to the actual `MatPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_PREFIX: InjectionToken<MatPrefix>;
/** Prefix to be placed in front of the form field. */
export declare class MatPrefix {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPrefix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatPrefix, "[matPrefix]", never, {}, {}, never>;
}
