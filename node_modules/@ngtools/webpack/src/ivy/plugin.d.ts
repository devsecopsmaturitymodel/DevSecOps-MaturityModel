/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import type { CompilerOptions } from '@angular/compiler-cli';
import type { Compiler } from 'webpack';
export interface AngularWebpackPluginOptions {
    tsconfig: string;
    compilerOptions?: CompilerOptions;
    fileReplacements: Record<string, string>;
    substitutions: Record<string, string>;
    directTemplateLoading: boolean;
    emitClassMetadata: boolean;
    emitNgModuleScope: boolean;
    jitMode: boolean;
    inlineStyleFileExtension?: string;
}
export declare class AngularWebpackPlugin {
    private readonly pluginOptions;
    private compilerCliModule?;
    private compilerNgccModule?;
    private watchMode?;
    private ngtscNextProgram?;
    private builder?;
    private sourceFileCache?;
    private webpackCache?;
    private readonly fileDependencies;
    private readonly requiredFilesToEmit;
    private readonly requiredFilesToEmitCache;
    private readonly fileEmitHistory;
    constructor(options?: Partial<AngularWebpackPluginOptions>);
    private get compilerCli();
    get options(): AngularWebpackPluginOptions;
    apply(compiler: Compiler): void;
    private registerWithCompilation;
    private markResourceUsed;
    private rebuildRequiredFiles;
    private loadConfiguration;
    private updateAotProgram;
    private updateJitProgram;
    private createFileEmitter;
    private initializeCompilerCli;
    private addFileEmitHistory;
    private getFileEmitHistory;
}
