/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/entry_point_bundle" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { AbsoluteFsPath, FileSystem } from '../../../src/ngtsc/file_system';
import { DtsProcessing } from '../execution/tasks/api';
import { PathMappings } from '../path_mappings';
import { BundleProgram } from './bundle_program';
import { EntryPoint, EntryPointFormat } from './entry_point';
import { SharedFileCache } from './source_file_cache';
/**
 * A bundle of files and paths (and TS programs) that correspond to a particular
 * format of a package entry-point.
 */
export interface EntryPointBundle {
    entryPoint: EntryPoint;
    format: EntryPointFormat;
    isCore: boolean;
    isFlatCore: boolean;
    rootDirs: AbsoluteFsPath[];
    src: BundleProgram;
    dts: BundleProgram | null;
    dtsProcessing: DtsProcessing;
    enableI18nLegacyMessageIdFormat: boolean;
}
/**
 * Get an object that describes a formatted bundle for an entry-point.
 * @param fs The current file-system being used.
 * @param entryPoint The entry-point that contains the bundle.
 * @param sharedFileCache The cache to use for source files that are shared across all entry-points.
 * @param moduleResolutionCache The module resolution cache to use.
 * @param formatPath The path to the source files for this bundle.
 * @param isCore This entry point is the Angular core package.
 * @param format The underlying format of the bundle.
 * @param dtsProcessing Whether to transform the typings along with this bundle.
 * @param pathMappings An optional set of mappings to use when compiling files.
 * @param mirrorDtsFromSrc If true then the `dts` program will contain additional files that
 * were guessed by mapping the `src` files to `dts` files.
 * @param enableI18nLegacyMessageIdFormat Whether to render legacy message ids for i18n messages in
 * component templates.
 */
export declare function makeEntryPointBundle(fs: FileSystem, entryPoint: EntryPoint, sharedFileCache: SharedFileCache, moduleResolutionCache: ts.ModuleResolutionCache, formatPath: string, isCore: boolean, format: EntryPointFormat, dtsProcessing: DtsProcessing, pathMappings?: PathMappings, mirrorDtsFromSrc?: boolean, enableI18nLegacyMessageIdFormat?: boolean): EntryPointBundle;
