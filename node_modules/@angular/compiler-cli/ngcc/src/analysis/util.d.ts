/// <amd-module name="@angular/compiler-cli/ngcc/src/analysis/util" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { DependencyTracker } from '../../../src/ngtsc/incremental/api';
export declare function isWithinPackage(packagePath: AbsoluteFsPath, filePath: AbsoluteFsPath): boolean;
export declare const NOOP_DEPENDENCY_TRACKER: DependencyTracker;
