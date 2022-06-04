/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/template_symbol_builder" />
import { AST, TmplAstElement, TmplAstNode, TmplAstReference, TmplAstTemplate, TmplAstVariable } from '@angular/compiler';
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ComponentScopeReader } from '../../scope';
import { ElementSymbol, ReferenceSymbol, Symbol, TemplateSymbol, VariableSymbol } from '../api';
import { TemplateData } from './context';
/**
 * Generates and caches `Symbol`s for various template structures for a given component.
 *
 * The `SymbolBuilder` internally caches the `Symbol`s it creates, and must be destroyed and
 * replaced if the component's template changes.
 */
export declare class SymbolBuilder {
    private readonly tcbPath;
    private readonly tcbIsShim;
    private readonly typeCheckBlock;
    private readonly templateData;
    private readonly componentScopeReader;
    private readonly getTypeChecker;
    private symbolCache;
    constructor(tcbPath: AbsoluteFsPath, tcbIsShim: boolean, typeCheckBlock: ts.Node, templateData: TemplateData, componentScopeReader: ComponentScopeReader, getTypeChecker: () => ts.TypeChecker);
    getSymbol(node: TmplAstTemplate | TmplAstElement): TemplateSymbol | ElementSymbol | null;
    getSymbol(node: TmplAstReference | TmplAstVariable): ReferenceSymbol | VariableSymbol | null;
    getSymbol(node: AST | TmplAstNode): Symbol | null;
    private getSymbolOfAstTemplate;
    private getSymbolOfElement;
    private getDirectivesOfNode;
    private getDirectiveMeta;
    private getDirectiveModule;
    private getSymbolOfBoundEvent;
    private getSymbolOfInputBinding;
    private getDirectiveSymbolForAccessExpression;
    private getSymbolOfVariable;
    private getSymbolOfReference;
    private getSymbolOfPipe;
    private getSymbolOfTemplateExpression;
    private getSymbolOfTsNode;
    private getTcbPositionForNode;
}
