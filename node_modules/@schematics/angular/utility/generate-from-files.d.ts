/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '@angular-devkit/schematics';
export interface GenerateFromFilesOptions {
    flat?: boolean;
    name: string;
    path?: string;
    prefix?: string;
    project?: string;
    skipTests?: boolean;
}
export declare function generateFromFiles(options: GenerateFromFilesOptions, extraTemplateValues?: Record<string, string | ((v: string) => string)>): Rule;
