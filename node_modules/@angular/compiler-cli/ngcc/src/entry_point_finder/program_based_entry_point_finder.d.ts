/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/program_based_entry_point_finder" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { ParsedConfiguration } from '../../../src/perform_compile';
import { EntryPointWithDependencies } from '../dependencies/dependency_host';
import { DependencyResolver } from '../dependencies/dependency_resolver';
import { NgccConfiguration } from '../packages/configuration';
import { EntryPointManifest } from '../packages/entry_point_manifest';
import { EntryPointCollector } from './entry_point_collector';
import { TracingEntryPointFinder } from './tracing_entry_point_finder';
/**
 * An EntryPointFinder that starts from the files in the program defined by the given tsconfig.json
 * and only returns entry-points that are dependencies of these files.
 *
 * This is faster than searching the entire file-system for all the entry-points,
 * and is used primarily by the CLI integration.
 */
export declare class ProgramBasedEntryPointFinder extends TracingEntryPointFinder {
    private entryPointCollector;
    private entryPointManifest;
    private tsConfig;
    private entryPointsWithDependencies;
    constructor(fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger, resolver: DependencyResolver, entryPointCollector: EntryPointCollector, entryPointManifest: EntryPointManifest, basePath: AbsoluteFsPath, tsConfig: ParsedConfiguration, projectPath: AbsoluteFsPath);
    /**
     * Return an array containing the external import paths that were extracted from the source-files
     * of the program defined by the tsconfig.json.
     */
    protected getInitialEntryPointPaths(): AbsoluteFsPath[];
    /**
     * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
     * paths to other entry-points that this entry-point depends upon.
     *
     * In this entry-point finder, we use the `EntryPointManifest` to avoid computing each
     * entry-point's dependencies in the case that this had been done previously.
     *
     * @param entryPointPath the path to the entry-point whose information and dependencies are to be
     *     retrieved or computed.
     *
     * @returns the entry-point and its dependencies or `null` if the entry-point is not compiled by
     *     Angular or cannot be determined.
     */
    protected getEntryPointWithDeps(entryPointPath: AbsoluteFsPath): EntryPointWithDependencies | null;
    /**
     * Walk the base paths looking for entry-points or load this information from an entry-point
     * manifest, if available.
     */
    private findOrLoadEntryPoints;
    /**
     * Search the `basePath` for possible Angular packages and entry-points.
     *
     * @param basePath The path at which to start the search.
     * @returns an array of `EntryPoint`s that were found within `basePath`.
     */
    walkBasePathForPackages(basePath: AbsoluteFsPath): EntryPointWithDependencies[];
}
