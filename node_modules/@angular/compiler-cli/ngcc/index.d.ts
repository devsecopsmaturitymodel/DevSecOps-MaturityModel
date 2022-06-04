/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc" />
import { AsyncNgccOptions, SyncNgccOptions } from './src/ngcc_options';
export { ConsoleLogger, Logger, LogLevel } from '../src/ngtsc/logging';
export { AsyncNgccOptions, clearTsConfigCache, NgccOptions, SyncNgccOptions } from './src/ngcc_options';
export { PathMappings } from './src/path_mappings';
export declare function process<T extends AsyncNgccOptions | SyncNgccOptions>(options: T): T extends AsyncNgccOptions ? Promise<void> : void;
export declare const containingDirPath: string;
/**
 * Absolute file path that points to the `ngcc` command line entry-point.
 *
 * This can be used by the Angular CLI to spawn a process running ngcc using
 * command line options.
 */
export declare const ngccMainFilePath: string;
