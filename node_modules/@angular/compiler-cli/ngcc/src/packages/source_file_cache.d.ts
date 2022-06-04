/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/source_file_cache" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { AbsoluteFsPath, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
/**
 * A cache that holds on to source files that can be shared for processing all entry-points in a
 * single invocation of ngcc. In particular, the following files are shared across all entry-points
 * through this cache:
 *
 * 1. Default library files such as `lib.dom.d.ts` and `lib.es5.d.ts`. These files don't change
 *    and some are very large, so parsing is expensive. Therefore, the parsed `ts.SourceFile`s for
 *    the default library files are cached.
 * 2. The typings of @angular scoped packages. The typing files for @angular packages are typically
 *    used in the entry-points that ngcc processes, so benefit from a single source file cache.
 *    Especially `@angular/core/core.d.ts` is large and expensive to parse repeatedly. In contrast
 *    to default library files, we have to account for these files to be invalidated during a single
 *    invocation of ngcc, as ngcc will overwrite the .d.ts files during its processing.
 *
 * The lifecycle of this cache corresponds with a single invocation of ngcc. Separate invocations,
 * e.g. the CLI's synchronous module resolution fallback will therefore all have their own cache.
 * This allows for the source file cache to be garbage collected once ngcc processing has completed.
 */
export declare class SharedFileCache {
    private fs;
    private sfCache;
    constructor(fs: ReadonlyFileSystem);
    /**
     * Loads a `ts.SourceFile` if the provided `fileName` is deemed appropriate to be cached. To
     * optimize for memory usage, only files that are generally used in all entry-points are cached.
     * If `fileName` is not considered to benefit from caching or the requested file does not exist,
     * then `undefined` is returned.
     */
    getCachedSourceFile(fileName: string): ts.SourceFile | undefined;
    /**
     * Attempts to load the source file from the cache, or parses the file into a `ts.SourceFile` if
     * it's not yet cached. This method assumes that the file will not be modified for the duration
     * that this cache is valid for. If that assumption does not hold, the `getVolatileCachedFile`
     * method is to be used instead.
     */
    private getStableCachedFile;
    /**
     * In contrast to `getStableCachedFile`, this method always verifies that the cached source file
     * is the same as what's stored on disk. This is done for files that are expected to change during
     * ngcc's processing, such as @angular scoped packages for which the .d.ts files are overwritten
     * by ngcc. If the contents on disk have changed compared to a previously cached source file, the
     * content from disk is re-parsed and the cache entry is replaced.
     */
    private getVolatileCachedFile;
}
/**
 * Determines whether the provided path corresponds with a default library file inside of the
 * typescript package.
 *
 * @param absPath The path for which to determine if it corresponds with a default library file.
 * @param fs The filesystem to use for inspecting the path.
 */
export declare function isDefaultLibrary(absPath: AbsoluteFsPath, fs: ReadonlyFileSystem): boolean;
/**
 * Determines whether the provided path corresponds with a .d.ts file inside of an @angular
 * scoped package. This logic only accounts for the .d.ts files in the root, which is sufficient
 * to find the large, flattened entry-point files that benefit from caching.
 *
 * @param absPath The path for which to determine if it corresponds with an @angular .d.ts file.
 * @param fs The filesystem to use for inspecting the path.
 */
export declare function isAngularDts(absPath: AbsoluteFsPath, fs: ReadonlyFileSystem): boolean;
/**
 * A cache for processing a single entry-point. This exists to share `ts.SourceFile`s between the
 * source and typing programs that are created for a single program.
 */
export declare class EntryPointFileCache {
    private fs;
    private sharedFileCache;
    private processSourceText;
    private readonly sfCache;
    constructor(fs: ReadonlyFileSystem, sharedFileCache: SharedFileCache, processSourceText: (sourceText: string) => string);
    /**
     * Returns and caches a parsed `ts.SourceFile` for the provided `fileName`. If the `fileName` is
     * cached in the shared file cache, that result is used. Otherwise, the source file is cached
     * internally. This method returns `undefined` if the requested file does not exist.
     *
     * @param fileName The path of the file to retrieve a source file for.
     * @param languageVersion The language version to use for parsing the file.
     */
    getCachedSourceFile(fileName: string, languageVersion: ts.ScriptTarget): ts.SourceFile | undefined;
}
/**
 * Creates a `ts.ModuleResolutionCache` that uses the provided filesystem for path operations.
 *
 * @param fs The filesystem to use for path operations.
 */
export declare function createModuleResolutionCache(fs: ReadonlyFileSystem): ts.ModuleResolutionCache;
