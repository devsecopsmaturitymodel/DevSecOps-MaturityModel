/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/core/src/host" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ShimAdapter, ShimReferenceTagger } from '../../shims';
import { FactoryTracker } from '../../shims/api';
import { RequiredDelegations } from '../../util/src/typescript';
import { ExtendedTsCompilerHost, NgCompilerAdapter, NgCompilerOptions, UnifiedModulesHost } from '../api';
/**
 * Delegates all methods of `ExtendedTsCompilerHost` to a delegate, with the exception of
 * `getSourceFile` and `fileExists` which are implemented in `NgCompilerHost`.
 *
 * If a new method is added to `ts.CompilerHost` which is not delegated, a type error will be
 * generated for this class.
 */
export declare class DelegatingCompilerHost implements Omit<RequiredDelegations<ExtendedTsCompilerHost>, 'getSourceFile' | 'fileExists'> {
    protected delegate: ExtendedTsCompilerHost;
    constructor(delegate: ExtendedTsCompilerHost);
    private delegateMethod;
    createHash: ((data: string) => string) | undefined;
    directoryExists: ((directoryName: string) => boolean) | undefined;
    fileNameToModuleName: ((importedFilePath: string, containingFilePath: string) => string) | undefined;
    getCancellationToken: (() => ts.CancellationToken) | undefined;
    getCanonicalFileName: (fileName: string) => string;
    getCurrentDirectory: () => string;
    getDefaultLibFileName: (options: ts.CompilerOptions) => string;
    getDefaultLibLocation: (() => string) | undefined;
    getDirectories: ((path: string) => string[]) | undefined;
    getEnvironmentVariable: ((name: string) => string | undefined) | undefined;
    getModifiedResourceFiles: (() => Set<string> | undefined) | undefined;
    getNewLine: () => string;
    getParsedCommandLine: ((fileName: string) => ts.ParsedCommandLine | undefined) | undefined;
    getSourceFileByPath: ((fileName: string, path: ts.Path, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined) => ts.SourceFile | undefined) | undefined;
    readDirectory: ((rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number | undefined) => string[]) | undefined;
    readFile: (fileName: string) => string | undefined;
    readResource: ((fileName: string) => string | Promise<string>) | undefined;
    transformResource: ((data: string, context: import("@angular/compiler-cli/src/ngtsc/core/api/index").ResourceHostContext) => Promise<import("@angular/compiler-cli/src/ngtsc/core/api/index").TransformResourceResult | null>) | undefined;
    realpath: ((path: string) => string) | undefined;
    resolveModuleNames: ((moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ts.ResolvedProjectReference | undefined, options: ts.CompilerOptions, containingSourceFile?: ts.SourceFile | undefined) => (ts.ResolvedModule | undefined)[]) | undefined;
    resolveTypeReferenceDirectives: ((typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ts.ResolvedProjectReference | undefined, options: ts.CompilerOptions) => (ts.ResolvedTypeReferenceDirective | undefined)[]) | undefined;
    resourceNameToFileName: ((resourceName: string, containingFilePath: string, fallbackResolve?: ((url: string, fromFile: string) => string | null) | undefined) => string | null) | undefined;
    trace: ((s: string) => void) | undefined;
    useCaseSensitiveFileNames: () => boolean;
    writeFile: ts.WriteFileCallback;
    getModuleResolutionCache: (() => ts.ModuleResolutionCache | undefined) | undefined;
}
/**
 * A wrapper around `ts.CompilerHost` (plus any extension methods from `ExtendedTsCompilerHost`).
 *
 * In order for a consumer to include Angular compilation in their TypeScript compiler, the
 * `ts.Program` must be created with a host that adds Angular-specific files (e.g. factories,
 * summaries, the template type-checking file, etc) to the compilation. `NgCompilerHost` is the
 * host implementation which supports this.
 *
 * The interface implementations here ensure that `NgCompilerHost` fully delegates to
 * `ExtendedTsCompilerHost` methods whenever present.
 */
export declare class NgCompilerHost extends DelegatingCompilerHost implements RequiredDelegations<ExtendedTsCompilerHost>, ExtendedTsCompilerHost, NgCompilerAdapter {
    private shimAdapter;
    private shimTagger;
    readonly factoryTracker: FactoryTracker | null;
    readonly entryPoint: AbsoluteFsPath | null;
    readonly constructionDiagnostics: ts.Diagnostic[];
    readonly inputFiles: ReadonlyArray<string>;
    readonly rootDirs: ReadonlyArray<AbsoluteFsPath>;
    constructor(delegate: ExtendedTsCompilerHost, inputFiles: ReadonlyArray<string>, rootDirs: ReadonlyArray<AbsoluteFsPath>, shimAdapter: ShimAdapter, shimTagger: ShimReferenceTagger, entryPoint: AbsoluteFsPath | null, factoryTracker: FactoryTracker | null, diagnostics: ts.Diagnostic[]);
    /**
     * Retrieves a set of `ts.SourceFile`s which should not be emitted as JS files.
     *
     * Available after this host is used to create a `ts.Program` (which causes all the files in the
     * program to be enumerated).
     */
    get ignoreForEmit(): Set<ts.SourceFile>;
    /**
     * Retrieve the array of shim extension prefixes for which shims were created for each original
     * file.
     */
    get shimExtensionPrefixes(): string[];
    /**
     * Performs cleanup that needs to happen after a `ts.Program` has been created using this host.
     */
    postProgramCreationCleanup(): void;
    /**
     * Create an `NgCompilerHost` from a delegate host, an array of input filenames, and the full set
     * of TypeScript and Angular compiler options.
     */
    static wrap(delegate: ts.CompilerHost, inputFiles: ReadonlyArray<string>, options: NgCompilerOptions, oldProgram: ts.Program | null): NgCompilerHost;
    /**
     * Check whether the given `ts.SourceFile` is a shim file.
     *
     * If this returns false, the file is user-provided.
     */
    isShim(sf: ts.SourceFile): boolean;
    /**
     * Check whether the given `ts.SourceFile` is a resource file.
     *
     * This simply returns `false` for the compiler-cli since resource files are not added as root
     * files to the project.
     */
    isResource(sf: ts.SourceFile): boolean;
    getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined): ts.SourceFile | undefined;
    fileExists(fileName: string): boolean;
    get unifiedModulesHost(): UnifiedModulesHost | null;
    private createCachedResolveModuleNamesFunction;
}
