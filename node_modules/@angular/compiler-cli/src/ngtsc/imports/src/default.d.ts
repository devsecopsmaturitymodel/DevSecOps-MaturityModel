/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/imports/src/default" />
import { WrappedNodeExpr } from '@angular/compiler';
import ts from 'typescript';
/**
 * Attaches a default import declaration to `expr` to indicate the dependency of `expr` on the
 * default import.
 */
export declare function attachDefaultImportDeclaration(expr: WrappedNodeExpr<unknown>, importDecl: ts.ImportDeclaration): void;
/**
 * Obtains the default import declaration that `expr` depends on, or `null` if there is no such
 * dependency.
 */
export declare function getDefaultImportDeclaration(expr: WrappedNodeExpr<unknown>): ts.ImportDeclaration | null;
/**
 * TypeScript has trouble with generating default imports inside of transformers for some module
 * formats. The issue is that for the statement:
 *
 * import X from 'some/module';
 * console.log(X);
 *
 * TypeScript will not use the "X" name in generated code. For normal user code, this is fine
 * because references to X will also be renamed. However, if both the import and any references are
 * added in a transformer, TypeScript does not associate the two, and will leave the "X" references
 * dangling while renaming the import variable. The generated code looks something like:
 *
 * const module_1 = require('some/module');
 * console.log(X); // now X is a dangling reference.
 *
 * Therefore, we cannot synthetically add default imports, and must reuse the imports that users
 * include. Doing this poses a challenge for imports that are only consumed in the type position in
 * the user's code. If Angular reuses the imported symbol in a value position (for example, we
 * see a constructor parameter of type Foo and try to write "inject(Foo)") we will also end up with
 * a dangling reference, as TS will elide the import because it was only used in the type position
 * originally.
 *
 * To avoid this, the compiler must "touch" the imports with `ts.getMutableClone`, and should
 * only do this for imports which are actually consumed. The `DefaultImportTracker` keeps track of
 * these imports as they're encountered and emitted, and implements a transform which can correctly
 * flag the imports as required.
 *
 * This problem does not exist for non-default imports as the compiler can easily insert
 * "import * as X" style imports for those, and the "X" identifier survives transformation.
 */
export declare class DefaultImportTracker {
    /**
     * A `Map` which tracks the `Set` of `ts.ImportDeclaration`s for default imports that were used in
     * a given `ts.SourceFile` and need to be preserved.
     */
    private sourceFileToUsedImports;
    recordUsedImport(importDecl: ts.ImportDeclaration): void;
    /**
     * Get a `ts.TransformerFactory` which will preserve default imports that were previously marked
     * as used.
     *
     * This transformer must run after any other transformers which call `recordUsedImport`.
     */
    importPreservingTransformer(): ts.TransformerFactory<ts.SourceFile>;
    /**
     * Process a `ts.SourceFile` and replace any `ts.ImportDeclaration`s.
     */
    private transformSourceFile;
}
