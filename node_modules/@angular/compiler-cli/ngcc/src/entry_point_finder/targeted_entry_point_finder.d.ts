/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder" />
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
import { DependencyResolver, SortedEntryPointsInfo } from '../dependencies/dependency_resolver';
import { NgccConfiguration } from '../packages/configuration';
import { EntryPointJsonProperty } from '../packages/entry_point';
import { PathMappings } from '../path_mappings';
import { TracingEntryPointFinder } from './tracing_entry_point_finder';
/**
 * An EntryPointFinder that starts from a target entry-point and only finds
 * entry-points that are dependencies of the target.
 *
 * This is faster than searching the entire file-system for all the entry-points,
 * and is used primarily by the CLI integration.
 */
export declare class TargetedEntryPointFinder extends TracingEntryPointFinder {
    private targetPath;
    constructor(fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger, resolver: DependencyResolver, basePath: AbsoluteFsPath, pathMappings: PathMappings | undefined, targetPath: AbsoluteFsPath);
    /**
     * Search for Angular entry-points that can be reached from the entry-point specified by the given
     * `targetPath`.
     */
    findEntryPoints(): SortedEntryPointsInfo;
    /**
     * Determine whether the entry-point at the given `targetPath` needs to be processed.
     *
     * @param propertiesToConsider the package.json properties that should be considered for
     *     processing.
     * @param compileAllFormats true if all formats need to be processed, or false if it is enough for
     *     one of the formats covered by the `propertiesToConsider` is processed.
     */
    targetNeedsProcessingOrCleaning(propertiesToConsider: EntryPointJsonProperty[], compileAllFormats: boolean): boolean;
    /**
     * Return an array containing the `targetPath` from which to start the trace.
     */
    protected getInitialEntryPointPaths(): AbsoluteFsPath[];
    /**
     * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
     * paths to other entry-points that this entry-point depends upon.
     *
     * @param entryPointPath the path to the entry-point whose information and dependencies are to be
     *     retrieved or computed.
     *
     * @returns the entry-point and its dependencies or `null` if the entry-point is not compiled by
     *     Angular or cannot be determined.
     */
    protected getEntryPointWithDeps(entryPointPath: AbsoluteFsPath): EntryPointWithDependencies | null;
    /**
     * Compute the path to the package that contains the given entry-point.
     *
     * In this entry-point finder it is not trivial to find the containing package, since it is
     * possible that this entry-point is not directly below the directory containing the package.
     * Moreover, the import path could be affected by path-mapping.
     *
     * @param entryPointPath the path to the entry-point, whose package path we want to compute.
     */
    private computePackagePath;
    /**
     * Compute whether the `test` path is contained within the `base` path.
     *
     * Note that this doesn't use a simple `startsWith()` since that would result in a false positive
     * for `test` paths such as `a/b/c-x` when the `base` path is `a/b/c`.
     *
     * Since `fs.relative()` can be quite expensive we check the fast possibilities first.
     */
    private isPathContainedBy;
    /**
     * Search down to the `entryPointPath` from the `containingPath` for the first `package.json` that
     * we come to. This is the path to the entry-point's containing package. For example if
     * `containingPath` is `/a/b/c` and `entryPointPath` is `/a/b/c/d/e` and there exists
     * `/a/b/c/d/package.json` and `/a/b/c/d/e/package.json`, then we will return `/a/b/c/d`.
     *
     * To account for nested `node_modules` we actually start the search at the last `node_modules` in
     * the `entryPointPath` that is below the `containingPath`. E.g. if `containingPath` is `/a/b/c`
     * and `entryPointPath` is `/a/b/c/d/node_modules/x/y/z`, we start the search at
     * `/a/b/c/d/node_modules`.
     */
    private computePackagePathFromContainingPath;
    /**
     * Search up the directory tree from the `entryPointPath` looking for a `node_modules` directory
     * that we can use as a potential starting point for computing the package path.
     */
    private computePackagePathFromNearestNodeModules;
    /**
     * Split the given `path` into path segments using an FS independent algorithm.
     */
    private splitPath;
}
