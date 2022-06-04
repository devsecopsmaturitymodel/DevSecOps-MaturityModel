/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ExtraEntryPoint } from '../builders/browser/schema';
export declare type EntryPointsType = [name: string, isModule: boolean];
export declare function generateEntryPoints(options: {
    styles: ExtraEntryPoint[];
    scripts: ExtraEntryPoint[];
    isHMREnabled?: boolean;
}): EntryPointsType[];
