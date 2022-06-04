/// <amd-module name="@angular/compiler-cli/ngcc/src/path_mappings" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, PathManipulation } from '../../src/ngtsc/file_system';
import { ParsedConfiguration } from '../../src/perform_compile';
export declare type PathMappings = {
    baseUrl: string;
    paths: {
        [key: string]: string[];
    };
};
/**
 * If `pathMappings` is not provided directly, then try getting it from `tsConfig`, if available.
 */
export declare function getPathMappingsFromTsConfig(fs: PathManipulation, tsConfig: ParsedConfiguration | null, projectPath: AbsoluteFsPath): PathMappings | undefined;
