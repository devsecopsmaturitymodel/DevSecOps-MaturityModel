/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/entry_point_collector" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { EntryPointWithDependencies } from '../dependencies/dependency_host';
import { DependencyResolver } from '../dependencies/dependency_resolver';
import { NgccConfiguration } from '../packages/configuration';
/**
 * A class that traverses a file-tree, starting at a given path, looking for all entry-points,
 * also capturing the dependencies of each entry-point that is found.
 */
export declare class EntryPointCollector {
    private fs;
    private config;
    private logger;
    private resolver;
    constructor(fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger, resolver: DependencyResolver);
    /**
     * Look for Angular packages that need to be compiled, starting at the source directory.
     * The function will recurse into directories that start with `@...`, e.g. `@angular/...`.
     *
     * @param sourceDirectory An absolute path to the root directory where searching begins.
     * @returns an array of `EntryPoint`s that were found within `sourceDirectory`.
     */
    walkDirectoryForPackages(sourceDirectory: AbsoluteFsPath): EntryPointWithDependencies[];
    /**
     * Search the `directory` looking for any secondary entry-points for a package, adding any that
     * are found to the `entryPoints` array.
     *
     * @param entryPoints An array where we will add any entry-points found in this directory.
     * @param packagePath The absolute path to the package that may contain entry-points.
     * @param directory The current directory being searched.
     * @param paths The paths contained in the current `directory`.
     */
    private collectSecondaryEntryPoints;
}
