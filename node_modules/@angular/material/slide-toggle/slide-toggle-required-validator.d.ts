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
export declare const MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR: Provider;
/**
 * Validator for Material slide-toggle components with the required attribute in a
 * template-driven form. The default validator for required form controls asserts
 * that the control value is not undefined but that is not appropriate for a slide-toggle
 * where the value is always defined.
 *
 * Required slide-toggle form controls are valid when checked.
 */
export declare class MatSlideToggleRequiredValidator extends CheckboxRequiredValidator {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlideToggleRequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSlideToggleRequiredValidator, "mat-slide-toggle[required][formControlName],             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]", never, {}, {}, never>;
}
