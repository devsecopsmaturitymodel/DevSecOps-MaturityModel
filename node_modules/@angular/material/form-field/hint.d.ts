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
 * Injection token that can be used to reference instances of `MatHint`. It serves as
 * alternative token to the actual `MatHint` class which could cause unnecessary
 * retention of the class and its directive metadata.
 *
 * *Note*: This is not part of the public API as the MDC-based form-field will not
 * need a lightweight token for `MatHint` and we want to reduce breaking changes.
 */
export declare const _MAT_HINT: InjectionToken<MatHint>;
/** Hint text to be shown underneath the form field control. */
export declare class MatHint {
    /** Whether to align the hint label at the start or end of the line. */
    align: 'start' | 'end';
    /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
    id: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHint, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHint, "mat-hint", never, { "align": "align"; "id": "id"; }, {}, never>;
}
