/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { EntryPointWithDependencies } from '../dependencies/dependency_host';
import { DependencyResolver, SortedEntryPointsInfo } from '../dependencies/dependency_resolver';
import { EntryPointManifest } from '../packages/entry_point_manifest';
import { PathMappings } from '../path_mappings';
import { EntryPointCollector } from './entry_point_collector';
import { EntryPointFinder } from './interface';
/**
 * An EntryPointFinder that searches for all entry-points that can be found given a `basePath` and
 * `pathMappings`.
 */
export declare class DirectoryWalkerEntryPointFinder implements EntryPointFinder {
    private logger;
    private resolver;
    private entryPointCollector;
    private entryPointManifest;
    private sourceDirectory;
    private pathMappings;
    private basePaths;
    constructor(logger: Logger, resolver: DependencyResolver, entryPointCollector: EntryPointCollector, entryPointManifest: EntryPointManifest, sourceDirectory: AbsoluteFsPath, pathMappings: PathMappings | undefined);
    /**
     * Search the `sourceDirectory`, and sub-directories, using `pathMappings` as necessary, to find
     * all package entry-points.
     */
    findEntryPoints(): SortedEntryPointsInfo;
    /**
     * Search the `basePath` for possible Angular packages and entry-points.
     *
     * @param basePath The path at which to start the search.
     * @returns an array of `EntryPoint`s that were found within `basePath`.
     */
    walkBasePathForPackages(basePath: AbsoluteFsPath): EntryPointWithDependencies[];
}
