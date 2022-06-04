/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { NgccProcessor } from '../ngcc_processor';
import { WebpackResourceLoader } from '../resource_loader';
export declare function augmentHostWithResources(host: ts.CompilerHost, resourceLoader: WebpackResourceLoader, options?: {
    directTemplateLoading?: boolean;
    inlineStyleFileExtension?: string;
}): void;
/**
 * Augments a TypeScript Compiler Host's resolveModuleNames function to collect dependencies
 * of the containing file passed to the resolveModuleNames function. This process assumes
 * that consumers of the Compiler Host will only call resolveModuleNames with modules that are
 * actually present in a containing file.
 * This process is a workaround for gathering a TypeScript SourceFile's dependencies as there
 * is no currently exposed public method to do so. A BuilderProgram does have a `getAllDependencies`
 * function. However, that function returns all transitive dependencies as well which can cause
 * excessive Webpack rebuilds.
 *
 * @param host The CompilerHost to augment.
 * @param dependencies A Map which will be used to store file dependencies.
 * @param moduleResolutionCache An optional resolution cache to use when the host resolves a module.
 */
export declare function augmentHostWithDependencyCollection(host: ts.CompilerHost, dependencies: Map<string, Set<string>>, moduleResolutionCache?: ts.ModuleResolutionCache): void;
export declare function augmentHostWithNgcc(host: ts.CompilerHost, ngcc: NgccProcessor, moduleResolutionCache?: ts.ModuleResolutionCache): void;
export declare function augmentHostWithReplacements(host: ts.CompilerHost, replacements: Record<string, string>, moduleResolutionCache?: ts.ModuleResolutionCache): void;
export declare function augmentHostWithSubstitutions(host: ts.CompilerHost, substitutions: Record<string, string>): void;
export declare function augmentHostWithVersioning(host: ts.CompilerHost): void;
export declare function augmentProgramWithVersioning(program: ts.Program): void;
export declare function augmentHostWithCaching(host: ts.CompilerHost, cache: Map<string, ts.SourceFile>): void;
