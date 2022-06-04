/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PackageManager } from '../lib/config/workspace-schema';
export declare function supportsYarn(): boolean;
export declare function supportsNpm(): boolean;
export declare function getPackageManager(root: string): Promise<PackageManager>;
/**
 * Checks if the npm version is a supported 7.x version.  If not, display a warning.
 */
export declare function ensureCompatibleNpm(root: string): Promise<void>;
