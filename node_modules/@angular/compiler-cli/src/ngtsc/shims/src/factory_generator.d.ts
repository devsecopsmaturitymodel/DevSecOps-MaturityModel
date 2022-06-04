/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/factory_generator" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ImportRewriter } from '../../imports';
import { FactoryInfo, FactoryTracker, ModuleInfo, PerFileShimGenerator } from '../api';
/**
 * Generates ts.SourceFiles which contain variable declarations for NgFactories for every exported
 * class of an input ts.SourceFile.
 */
export declare class FactoryGenerator implements PerFileShimGenerator, FactoryTracker {
    readonly sourceInfo: Map<string, FactoryInfo>;
    private sourceToFactorySymbols;
    readonly shouldEmit = true;
    readonly extensionPrefix = "ngfactory";
    generateShimForFile(sf: ts.SourceFile, genFilePath: AbsoluteFsPath): ts.SourceFile;
    track(sf: ts.SourceFile, moduleInfo: ModuleInfo): void;
}
export declare function generatedFactoryTransform(factoryMap: Map<string, FactoryInfo>, importRewriter: ImportRewriter): ts.TransformerFactory<ts.SourceFile>;
