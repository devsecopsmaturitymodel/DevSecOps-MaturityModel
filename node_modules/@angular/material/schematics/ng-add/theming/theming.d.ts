/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/** Add pre-built styles to the main project style file. */
export declare function addThemeToAppStyles(options: Schema): Rule;
/** Adds the global typography class to the body element. */
export declare function addTypographyClass(options: Schema): Rule;
