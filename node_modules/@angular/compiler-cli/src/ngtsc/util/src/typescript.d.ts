/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/util/src/typescript" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { DeclarationNode } from '../../reflection';
/**
 * Type describing a symbol that is guaranteed to have a value declaration.
 */
export declare type SymbolWithValueDeclaration = ts.Symbol & {
    valueDeclaration: ts.Declaration;
    declarations: ts.Declaration[];
};
export declare function isSymbolWithValueDeclaration(symbol: ts.Symbol | null | undefined): symbol is SymbolWithValueDeclaration;
export declare function isDtsPath(filePath: string): boolean;
export declare function isNonDeclarationTsPath(filePath: string): boolean;
export declare function isFromDtsFile(node: ts.Node): boolean;
export declare function nodeNameForError(node: ts.Node & {
    name?: ts.Node;
}): string;
export declare function getSourceFile(node: ts.Node): ts.SourceFile;
export declare function getSourceFileOrNull(program: ts.Program, fileName: AbsoluteFsPath): ts.SourceFile | null;
export declare function getTokenAtPosition(sf: ts.SourceFile, pos: number): ts.Node;
export declare function identifierOfNode(decl: ts.Node & {
    name?: ts.Node;
}): ts.Identifier | null;
export declare function isDeclaration(node: ts.Node): node is ts.Declaration;
export declare function isValueDeclaration(node: ts.Node): node is ts.ClassDeclaration | ts.FunctionDeclaration | ts.VariableDeclaration;
export declare function isTypeDeclaration(node: ts.Node): node is ts.EnumDeclaration | ts.TypeAliasDeclaration | ts.InterfaceDeclaration;
export declare function isNamedDeclaration(node: ts.Node): node is ts.Declaration & {
    name: ts.Identifier;
};
export declare function isExported(node: DeclarationNode): boolean;
export declare function getRootDirs(host: Pick<ts.CompilerHost, 'getCurrentDirectory' | 'getCanonicalFileName'>, options: ts.CompilerOptions): AbsoluteFsPath[];
export declare function nodeDebugInfo(node: ts.Node): string;
/**
 * Resolve the specified `moduleName` using the given `compilerOptions` and `compilerHost`.
 *
 * This helper will attempt to use the `CompilerHost.resolveModuleNames()` method if available.
 * Otherwise it will fallback on the `ts.ResolveModuleName()` function.
 */
export declare function resolveModuleName(moduleName: string, containingFile: string, compilerOptions: ts.CompilerOptions, compilerHost: ts.ModuleResolutionHost & Pick<ts.CompilerHost, 'resolveModuleNames'>, moduleResolutionCache: ts.ModuleResolutionCache | null): ts.ResolvedModule | undefined;
/** Returns true if the node is an assignment expression. */
export declare function isAssignment(node: ts.Node): node is ts.BinaryExpression;
/**
 * Asserts that the keys `K` form a subset of the keys of `T`.
 */
export declare type SubsetOfKeys<T, K extends keyof T> = K;
/**
 * Represents the type `T`, with a transformation applied that turns all methods (even optional
 * ones) into required fields (which may be `undefined`, if the method was optional).
 */
export declare type RequiredDelegations<T> = {
    [M in keyof Required<T>]: T[M];
};
/**
 * Obtains the non-redirected source file for `sf`.
 */
export declare function toUnredirectedSourceFile(sf: ts.SourceFile): ts.SourceFile;
/**
 * Backwards-compatible version of `ts.createExportSpecifier`
 * to handle a breaking change between 4.4 and 4.5.
 */
export declare function createExportSpecifier(propertyName: string | ts.Identifier | undefined, name: string | ts.Identifier, isTypeOnly?: boolean): ts.ExportSpecifier;
