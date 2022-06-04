/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Provider } from '@angular/core';
import { CheckboxRequiredValidator } from '@angular/forms';
import * as i0 from "@angular/core";
export declare const MAT_CHECKBOX_REQUIRED_VALIDATOR: Provider;
/**
 * Validator for Material checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `mat-checkbox`.
 */
export declare class MatCheckboxRequiredValidator extends CheckboxRequiredValidator {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCheckboxRequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCheckboxRequiredValidator, "mat-checkbox[required][formControlName],             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]", never, {}, {}, never>;
}
