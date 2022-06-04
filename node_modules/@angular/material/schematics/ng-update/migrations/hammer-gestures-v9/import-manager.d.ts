/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FileSystem } from '@angular/cdk/schematics';
import * as ts from 'typescript';
/**
 * Import manager that can be used to add or remove TypeScript imports within source
 * files. The manager ensures that multiple transformations are applied properly
 * without shifted offsets and that existing imports are re-used.
 */
export declare class ImportManager {
    private _fileSystem;
    private _printer;
    /** Map of source-files and their previously used identifier names. */
    private _usedIdentifierNames;
    /** Map of source files and their analyzed imports. */
    private _importCache;
    constructor(_fileSystem: FileSystem, _printer: ts.Printer);
    /**
     * Analyzes the import of the specified source file if needed. In order to perform
     * modifications to imports of a source file, we store all imports in memory and
     * update the source file once all changes have been made. This is essential to
     * ensure that we can re-use newly added imports and not break file offsets.
     */
    private _analyzeImportsIfNeeded;
    /**
     * Checks whether the given specifier, which can be relative to the base path,
     * matches the passed module name.
     */
    private _isModuleSpecifierMatching;
    /** Deletes a given named binding import from the specified source file. */
    deleteNamedBindingImport(sourceFile: ts.SourceFile, symbolName: string, moduleName: string): void;
    /** Deletes the import that matches the given import declaration if found. */
    deleteImportByDeclaration(declaration: ts.ImportDeclaration): void;
    /**
     * Adds an import to the given source file and returns the TypeScript expression that
     * can be used to access the newly imported symbol.
     *
     * Whenever an import is added to a source file, it's recommended that the returned
     * expression is used to reference th symbol. This is necessary because the symbol
     * could be aliased if it would collide with existing imports in source file.
     *
     * @param sourceFile Source file to which the import should be added.
     * @param symbolName Name of the symbol that should be imported. Can be null if
     *    the default export is requested.
     * @param moduleName Name of the module of which the symbol should be imported.
     * @param typeImport Whether the symbol is a type.
     * @param ignoreIdentifierCollisions List of identifiers which can be ignored when
     *    the import manager checks for import collisions.
     */
    addImportToSourceFile(sourceFile: ts.SourceFile, symbolName: string | null, moduleName: string, typeImport?: boolean, ignoreIdentifierCollisions?: ts.Identifier[]): ts.Expression;
    /**
     * Applies the recorded changes in the update recorders of the corresponding source files.
     * The changes are applied separately after all changes have been recorded because otherwise
     * file offsets will change and the source files would need to be re-parsed after each change.
     */
    recordChanges(): void;
    /**
     * Corrects the line and character position of a given node. Since nodes of
     * source files are immutable and we sometimes make changes to the containing
     * source file, the node position might shift (e.g. if we add a new import before).
     *
     * This method can be used to retrieve a corrected position of the given node. This
     * is helpful when printing out error messages which should reflect the new state of
     * source files.
     */
    correctNodePosition(node: ts.Node, offset: number, position: ts.LineAndCharacter): ts.LineAndCharacter;
    /**
     * Returns an unique identifier name for the specified symbol name.
     * @param sourceFile Source file to check for identifier collisions.
     * @param symbolName Name of the symbol for which we want to generate an unique name.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    private _getUniqueIdentifier;
    /**
     * Checks whether the specified identifier name is used within the given source file.
     * @param sourceFile Source file to check for identifier collisions.
     * @param name Name of the identifier which is checked for its uniqueness.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    private _isUniqueIdentifierName;
    /**
     * Records that the given identifier is used within the specified source file. This
     * is necessary since we do not apply changes to source files per change, but still
     * want to avoid conflicts with newly imported symbols.
     */
    private _recordUsedIdentifier;
    /**
     * Determines the full end of a given node. By default the end position of a node is
     * before all trailing comments. This could mean that generated imports shift comments.
     */
    private _getEndPositionOfNode;
}
