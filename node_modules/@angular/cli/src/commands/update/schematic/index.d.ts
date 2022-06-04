/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '@angular-devkit/schematics';
import { Schema as UpdateSchema } from './schema';
export declare function angularMajorCompatGuarantee(range: string): string;
export default function (options: UpdateSchema): Rule;
