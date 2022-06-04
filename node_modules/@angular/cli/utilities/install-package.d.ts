/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PackageManager } from '../lib/config/workspace-schema';
import { NgAddSaveDepedency } from '../utilities/package-metadata';
export declare function installAllPackages(packageManager?: PackageManager, extraArgs?: string[], cwd?: string): Promise<1 | 0>;
export declare function installPackage(packageName: string, packageManager?: PackageManager, save?: Exclude<NgAddSaveDepedency, false>, extraArgs?: string[], cwd?: string): Promise<1 | 0>;
export declare function installTempPackage(packageName: string, packageManager?: PackageManager, extraArgs?: string[]): Promise<{
    status: 1 | 0;
    tempNodeModules: string;
}>;
export declare function runTempPackageBin(packageName: string, packageManager?: PackageManager, args?: string[]): Promise<number>;
