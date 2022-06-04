/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
/** Default `mat-checkbox` options that can be overridden. */
export interface MatCheckboxDefaultOptions {
    /** Default theme color palette to be used for checkboxes. */
    color?: ThemePalette;
    /** Default checkbox click action for checkboxes. */
    clickAction?: MatCheckboxClickAction;
}
/** Injection token to be used to override the default options for `mat-checkbox`. */
export declare const MAT_CHECKBOX_DEFAULT_OPTIONS: InjectionToken<MatCheckboxDefaultOptions>;
/** @docs-private */
export declare function MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): MatCheckboxDefaultOptions;
/**
 * Checkbox click action when user click on input element.
 * noop: Do not toggle checked or indeterminate.
 * check: Only toggle checked status, ignore indeterminate.
 * check-indeterminate: Toggle checked status, set indeterminate to false. Default behavior.
 * undefined: Same as `check-indeterminate`.
 */
export declare type MatCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined;
