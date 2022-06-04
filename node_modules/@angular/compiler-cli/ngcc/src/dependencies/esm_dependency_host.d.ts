/// <amd-module name="@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { AbsoluteFsPath, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { DependencyHostBase } from './dependency_host';
import { ModuleResolver } from './module_resolver';
/**
 * Helper functions for computing dependencies.
 */
export declare class EsmDependencyHost extends DependencyHostBase {
    private scanImportExpressions;
    constructor(fs: ReadonlyFileSystem, moduleResolver: ModuleResolver, scanImportExpressions?: boolean);
    private scanner;
    protected canSkipFile(fileContents: string): boolean;
    /**
     * Extract any import paths from imports found in the contents of this file.
     *
     * This implementation uses the TypeScript scanner, which tokenizes source code,
     * to process the string. This is halfway between working with the string directly,
     * which is too difficult due to corner cases, and parsing the string into a full
     * TypeScript Abstract Syntax Tree (AST), which ends up doing more processing than
     * is needed.
     *
     * The scanning is not trivial because we must hold state between each token since
     * the context of the token affects how it should be scanned, and the scanner does
     * not manage this for us.
     *
     * Specifically, backticked strings are particularly challenging since it is possible
     * to recursively nest backticks and TypeScript expressions within each other.
     */
    protected extractImports(file: AbsoluteFsPath, fileContents: string): Set<string>;
    /**
     * We have found an `import` token so now try to identify the import path.
     *
     * This method will use the current state of `this.scanner` to extract a string literal module
     * specifier. It expects that the current state of the scanner is that an `import` token has just
     * been scanned.
     *
     * The following forms of import are matched:
     *
     * * `import "module-specifier";`
     * * `import("module-specifier")`
     * * `import defaultBinding from "module-specifier";`
     * * `import defaultBinding, * as identifier from "module-specifier";`
     * * `import defaultBinding, {...} from "module-specifier";`
     * * `import * as identifier from "module-specifier";`
     * * `import {...} from "module-specifier";`
     *
     * @returns the import path or null if there is no import or it is not a string literal.
     */
    protected extractImportPath(): string | null;
    /**
     * We have found an `export` token so now try to identify a re-export path.
     *
     * This method will use the current state of `this.scanner` to extract a string literal module
     * specifier. It expects that the current state of the scanner is that an `export` token has
     * just been scanned.
     *
     * There are three forms of re-export that are matched:
     *
     * * `export * from '...';
     * * `export * as alias from '...';
     * * `export {...} from '...';
     */
    protected extractReexportPath(): string | null;
    protected skipNamespacedClause(): ts.SyntaxKind | null;
    protected skipNamedClause(): ts.SyntaxKind;
    protected tryStringLiteral(): string | null;
}
/**
 * Check whether a source file needs to be parsed for imports.
 * This is a performance short-circuit, which saves us from creating
 * a TypeScript AST unnecessarily.
 *
 * @param source The content of the source file to check.
 *
 * @returns false if there are definitely no import or re-export statements
 * in this file, true otherwise.
 */
export declare function hasImportOrReexportStatements(source: string): boolean;
/**
 * Check whether the given statement is an import with a string literal module specifier.
 * @param stmt the statement node to check.
 * @returns true if the statement is an import with a string literal module specifier.
 */
export declare function isStringImportOrReexport(stmt: ts.Statement): stmt is ts.ImportDeclaration & {
    moduleSpecifier: ts.StringLiteral;
};
