/// <amd-module name="@angular/compiler-cli/ngcc/src/dependencies/dependency_host" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, PathSegment, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { EntryPoint } from '../packages/entry_point';
import { ModuleResolver } from './module_resolver';
export interface DependencyHost {
    collectDependencies(entryPointPath: AbsoluteFsPath, { dependencies, missing, deepImports }: DependencyInfo): void;
}
export interface DependencyInfo {
    dependencies: Set<AbsoluteFsPath>;
    missing: Set<AbsoluteFsPath | PathSegment>;
    deepImports: Set<AbsoluteFsPath>;
}
export interface EntryPointWithDependencies {
    entryPoint: EntryPoint;
    depInfo: DependencyInfo;
}
export declare function createDependencyInfo(): DependencyInfo;
export declare abstract class DependencyHostBase implements DependencyHost {
    protected fs: ReadonlyFileSystem;
    protected moduleResolver: ModuleResolver;
    constructor(fs: ReadonlyFileSystem, moduleResolver: ModuleResolver);
    /**
     * Find all the dependencies for the entry-point at the given path.
     *
     * @param entryPointPath The absolute path to the JavaScript file that represents an entry-point.
     * @param dependencyInfo An object containing information about the dependencies of the
     * entry-point, including those that were missing or deep imports into other entry-points. The
     * sets in this object will be updated with new information about the entry-point's dependencies.
     */
    collectDependencies(entryPointPath: AbsoluteFsPath, { dependencies, missing, deepImports }: DependencyInfo): void;
    /**
     * Find all the dependencies for the provided paths.
     *
     * @param files The list of absolute paths of JavaScript files to scan for dependencies.
     * @param dependencyInfo An object containing information about the dependencies of the
     * entry-point, including those that were missing or deep imports into other entry-points. The
     * sets in this object will be updated with new information about the entry-point's dependencies.
     */
    collectDependenciesInFiles(files: AbsoluteFsPath[], { dependencies, missing, deepImports }: DependencyInfo): void;
    /**
     * Compute the dependencies of the given file.
     *
     * @param file An absolute path to the file whose dependencies we want to get.
     * @param dependencies A set that will have the absolute paths of resolved entry points added to
     * it.
     * @param missing A set that will have the dependencies that could not be found added to it.
     * @param deepImports A set that will have the import paths that exist but cannot be mapped to
     * entry-points, i.e. deep-imports.
     * @param alreadySeen A set that is used to track internal dependencies to prevent getting stuck
     * in a circular dependency loop.
     */
    protected recursivelyCollectDependencies(file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>, missing: Set<string>, deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): void;
    protected abstract canSkipFile(fileContents: string): boolean;
    protected abstract extractImports(file: AbsoluteFsPath, fileContents: string): Set<string>;
    /**
     * Resolve the given `importPath` from `file` and add it to the appropriate set.
     *
     * If the import is local to this package then follow it by calling
     * `recursivelyCollectDependencies()`.
     *
     * @returns `true` if the import was resolved (to an entry-point, a local import, or a
     * deep-import), `false` otherwise.
     */
    protected processImport(importPath: string, file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>, missing: Set<string>, deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): boolean;
    /**
     * Processes the file if it has not already been seen. This will also recursively process
     * all files that are imported from the file, while taking the set of already seen files
     * into account.
     */
    protected processFile(file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>, missing: Set<string>, deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): void;
}
