/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for ng-new project that builds with Bazel.
 */
/// <amd-module name="@angular/localize/schematics/ng-add" />
import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
export declare const localizePolyfill = "import '@angular/localize/init';";
export default function (options: Schema): Rule;
