/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc/src/host/delegating_host" />
import ts from 'typescript';
import { ClassDeclaration, ClassMember, CtorParameter, Declaration, DeclarationNode, Decorator, FunctionDefinition, Import, ReflectionHost } from '../../../src/ngtsc/reflection';
import { NgccClassSymbol, NgccReflectionHost } from './ngcc_host';
/**
 * A reflection host implementation that delegates reflector queries depending on whether they
 * reflect on declaration files (for dependent libraries) or source files within the entry-point
 * that is being compiled. The first type of queries are handled by the regular TypeScript
 * reflection host, whereas the other queries are handled by an `NgccReflectionHost` that is
 * specific to the entry-point's format.
 */
export declare class DelegatingReflectionHost implements NgccReflectionHost {
    private tsHost;
    private ngccHost;
    constructor(tsHost: ReflectionHost, ngccHost: NgccReflectionHost);
    getConstructorParameters(clazz: ClassDeclaration): CtorParameter[] | null;
    getDeclarationOfIdentifier(id: ts.Identifier): Declaration | null;
    getDecoratorsOfDeclaration(declaration: DeclarationNode): Decorator[] | null;
    getDefinitionOfFunction(fn: ts.Node): FunctionDefinition | null;
    getDtsDeclaration(declaration: DeclarationNode): ts.Declaration | null;
    getExportsOfModule(module: ts.Node): Map<string, Declaration> | null;
    getGenericArityOfClass(clazz: ClassDeclaration): number | null;
    getImportOfIdentifier(id: ts.Identifier): Import | null;
    getInternalNameOfClass(clazz: ClassDeclaration): ts.Identifier;
    getAdjacentNameOfClass(clazz: ClassDeclaration): ts.Identifier;
    getMembersOfClass(clazz: ClassDeclaration): ClassMember[];
    getVariableValue(declaration: ts.VariableDeclaration): ts.Expression | null;
    hasBaseClass(clazz: ClassDeclaration): boolean;
    getBaseClassExpression(clazz: ClassDeclaration): ts.Expression | null;
    isClass(node: ts.Node): node is ClassDeclaration;
    findClassSymbols(sourceFile: ts.SourceFile): NgccClassSymbol[];
    getClassSymbol(node: ts.Node): NgccClassSymbol | undefined;
    getDecoratorsOfSymbol(symbol: NgccClassSymbol): Decorator[] | null;
    getEndOfClass(classSymbol: NgccClassSymbol): ts.Node;
    detectKnownDeclaration<T extends Declaration>(decl: T): T;
    isStaticallyExported(decl: ts.Node): boolean;
}
