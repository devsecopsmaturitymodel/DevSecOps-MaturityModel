"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportManager = void 0;
const path_1 = require("path");
const ts = require("typescript");
/** Checks whether an analyzed import has the given import flag set. */
const hasFlag = (data, flag) => (data.state & flag) !== 0;
/** Parsed version of TypeScript that can be used for comparisons. */
const PARSED_TS_VERSION = parseFloat(ts.versionMajorMinor);
/**
 * Import manager that can be used to add or remove TypeScript imports within source
 * files. The manager ensures that multiple transformations are applied properly
 * without shifted offsets and that existing imports are re-used.
 */
class ImportManager {
    constructor(_fileSystem, _printer) {
        this._fileSystem = _fileSystem;
        this._printer = _printer;
        /** Map of source-files and their previously used identifier names. */
        this._usedIdentifierNames = new Map();
        /** Map of source files and their analyzed imports. */
        this._importCache = new Map();
    }
    /**
     * Analyzes the import of the specified source file if needed. In order to perform
     * modifications to imports of a source file, we store all imports in memory and
     * update the source file once all changes have been made. This is essential to
     * ensure that we can re-use newly added imports and not break file offsets.
     */
    _analyzeImportsIfNeeded(sourceFile) {
        if (this._importCache.has(sourceFile)) {
            return this._importCache.get(sourceFile);
        }
        const result = [];
        for (let node of sourceFile.statements) {
            if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
                continue;
            }
            const moduleName = node.moduleSpecifier.text;
            // Handles side-effect imports which do neither have a name or
            // specifiers. e.g. `import "my-package";`
            if (!node.importClause) {
                result.push({ moduleName, node, state: 0 /* UNMODIFIED */ });
                continue;
            }
            // Handles imports resolving to default exports of a module.
            // e.g. `import moment from "moment";`
            if (!node.importClause.namedBindings) {
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.name,
                    state: 0 /* UNMODIFIED */,
                });
                continue;
            }
            // Handles imports with individual symbol specifiers.
            // e.g. `import {A, B, C} from "my-module";`
            if (ts.isNamedImports(node.importClause.namedBindings)) {
                result.push({
                    moduleName,
                    node,
                    specifiers: node.importClause.namedBindings.elements.map(el => ({
                        name: el.name,
                        propertyName: el.propertyName,
                    })),
                    state: 0 /* UNMODIFIED */,
                });
            }
            else {
                // Handles namespaced imports. e.g. `import * as core from "my-pkg";`
                result.push({
                    moduleName,
                    node,
                    name: node.importClause.namedBindings.name,
                    namespace: true,
                    state: 0 /* UNMODIFIED */,
                });
            }
        }
        this._importCache.set(sourceFile, result);
        return result;
    }
    /**
     * Checks whether the given specifier, which can be relative to the base path,
     * matches the passed module name.
     */
    _isModuleSpecifierMatching(basePath, specifier, moduleName) {
        return specifier.startsWith('.')
            ? (0, path_1.resolve)(basePath, specifier) === (0, path_1.resolve)(basePath, moduleName)
            : specifier === moduleName;
    }
    /** Deletes a given named binding import from the specified source file. */
    deleteNamedBindingImport(sourceFile, symbolName, moduleName) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        for (let importData of fileImports) {
            if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName) ||
                !importData.specifiers) {
                continue;
            }
            const specifierIndex = importData.specifiers.findIndex(d => (d.propertyName || d.name).text === symbolName);
            if (specifierIndex !== -1) {
                importData.specifiers.splice(specifierIndex, 1);
                // if the import does no longer contain any specifiers after the removal of the
                // given symbol, we can just mark the whole import for deletion. Otherwise, we mark
                // it as modified so that it will be re-printed.
                if (importData.specifiers.length === 0) {
                    importData.state |= 8 /* DELETED */;
                }
                else {
                    importData.state |= 2 /* MODIFIED */;
                }
            }
        }
    }
    /** Deletes the import that matches the given import declaration if found. */
    deleteImportByDeclaration(declaration) {
        const fileImports = this._analyzeImportsIfNeeded(declaration.getSourceFile());
        for (let importData of fileImports) {
            if (importData.node === declaration) {
                importData.state |= 8 /* DELETED */;
            }
        }
    }
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
    addImportToSourceFile(sourceFile, symbolName, moduleName, typeImport = false, ignoreIdentifierCollisions = []) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        let existingImport = null;
        for (let importData of fileImports) {
            if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName)) {
                continue;
            }
            // If no symbol name has been specified, the default import is requested. In that
            // case we search for non-namespace and non-specifier imports.
            if (!symbolName && !importData.namespace && !importData.specifiers) {
                return ts.createIdentifier(importData.name.text);
            }
            // In case a "Type" symbol is imported, we can't use namespace imports
            // because these only export symbols available at runtime (no types)
            if (importData.namespace && !typeImport) {
                return ts.createPropertyAccess(ts.createIdentifier(importData.name.text), ts.createIdentifier(symbolName || 'default'));
            }
            else if (importData.specifiers && symbolName) {
                const existingSpecifier = importData.specifiers.find(s => s.propertyName ? s.propertyName.text === symbolName : s.name.text === symbolName);
                if (existingSpecifier) {
                    return ts.createIdentifier(existingSpecifier.name.text);
                }
                // In case the symbol could not be found in an existing import, we
                // keep track of the import declaration as it can be updated to include
                // the specified symbol name without having to create a new import.
                existingImport = importData;
            }
        }
        // If there is an existing import that matches the specified module, we
        // just update the import specifiers to also import the requested symbol.
        if (existingImport) {
            const propertyIdentifier = ts.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            existingImport.specifiers.push({
                name: importName,
                propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
            });
            existingImport.state |= 2 /* MODIFIED */;
            if (hasFlag(existingImport, 8 /* DELETED */)) {
                // unset the deleted flag if the import is pending deletion, but
                // can now be used for the new imported symbol.
                existingImport.state &= ~8 /* DELETED */;
            }
            return importName;
        }
        let identifier = null;
        let newImport = null;
        if (symbolName) {
            const propertyIdentifier = ts.createIdentifier(symbolName);
            const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
            const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
            identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
            const newImportDecl = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports([])), ts.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                specifiers: [
                    {
                        propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
                        name: identifier,
                    },
                ],
                state: 4 /* ADDED */,
            };
        }
        else {
            identifier = this._getUniqueIdentifier(sourceFile, 'defaultExport', ignoreIdentifierCollisions);
            const newImportDecl = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(identifier, undefined), ts.createStringLiteral(moduleName));
            newImport = {
                moduleName,
                node: newImportDecl,
                name: identifier,
                state: 4 /* ADDED */,
            };
        }
        fileImports.push(newImport);
        return identifier;
    }
    /**
     * Applies the recorded changes in the update recorders of the corresponding source files.
     * The changes are applied separately after all changes have been recorded because otherwise
     * file offsets will change and the source files would need to be re-parsed after each change.
     */
    recordChanges() {
        this._importCache.forEach((fileImports, sourceFile) => {
            const recorder = this._fileSystem.edit(this._fileSystem.resolve(sourceFile.fileName));
            const lastUnmodifiedImport = fileImports
                .reverse()
                .find(i => i.state === 0 /* UNMODIFIED */);
            const importStartIndex = lastUnmodifiedImport
                ? this._getEndPositionOfNode(lastUnmodifiedImport.node)
                : 0;
            fileImports.forEach(importData => {
                if (importData.state === 0 /* UNMODIFIED */) {
                    return;
                }
                if (hasFlag(importData, 8 /* DELETED */)) {
                    // Imports which do not exist in source file, can be just skipped as
                    // we do not need any replacement to delete the import.
                    if (!hasFlag(importData, 4 /* ADDED */)) {
                        recorder.remove(importData.node.getFullStart(), importData.node.getFullWidth());
                    }
                    return;
                }
                if (importData.specifiers) {
                    const namedBindings = importData.node.importClause.namedBindings;
                    const importSpecifiers = importData.specifiers.map(s => createImportSpecifier(s.propertyName, s.name));
                    const updatedBindings = ts.updateNamedImports(namedBindings, importSpecifiers);
                    // In case an import has been added newly, we need to print the whole import
                    // declaration and insert it at the import start index. Otherwise, we just
                    // update the named bindings to not re-print the whole import (which could
                    // cause unnecessary formatting changes)
                    if (hasFlag(importData, 4 /* ADDED */)) {
                        const updatedImport = ts.updateImportDeclaration(importData.node, undefined, undefined, ts.createImportClause(undefined, updatedBindings), ts.createStringLiteral(importData.moduleName), undefined);
                        const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, updatedImport, sourceFile);
                        recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
                        return;
                    }
                    else if (hasFlag(importData, 2 /* MODIFIED */)) {
                        const newNamedBindingsText = this._printer.printNode(ts.EmitHint.Unspecified, updatedBindings, sourceFile);
                        recorder.remove(namedBindings.getStart(), namedBindings.getWidth());
                        recorder.insertRight(namedBindings.getStart(), newNamedBindingsText);
                        return;
                    }
                }
                else if (hasFlag(importData, 4 /* ADDED */)) {
                    const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, importData.node, sourceFile);
                    recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
                    return;
                }
                // we should never hit this, but we rather want to print a custom exception
                // instead of just skipping imports silently.
                throw Error('Unexpected import modification.');
            });
        });
    }
    /**
     * Corrects the line and character position of a given node. Since nodes of
     * source files are immutable and we sometimes make changes to the containing
     * source file, the node position might shift (e.g. if we add a new import before).
     *
     * This method can be used to retrieve a corrected position of the given node. This
     * is helpful when printing out error messages which should reflect the new state of
     * source files.
     */
    correctNodePosition(node, offset, position) {
        const sourceFile = node.getSourceFile();
        if (!this._importCache.has(sourceFile)) {
            return position;
        }
        const newPosition = Object.assign({}, position);
        const fileImports = this._importCache.get(sourceFile);
        for (let importData of fileImports) {
            const fullEnd = importData.node.getFullStart() + importData.node.getFullWidth();
            // Subtract or add lines based on whether an import has been deleted or removed
            // before the actual node offset.
            if (offset > fullEnd && hasFlag(importData, 8 /* DELETED */)) {
                newPosition.line--;
            }
            else if (offset > fullEnd && hasFlag(importData, 4 /* ADDED */)) {
                newPosition.line++;
            }
        }
        return newPosition;
    }
    /**
     * Returns an unique identifier name for the specified symbol name.
     * @param sourceFile Source file to check for identifier collisions.
     * @param symbolName Name of the symbol for which we want to generate an unique name.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    _getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions) {
        if (this._isUniqueIdentifierName(sourceFile, symbolName, ignoreIdentifierCollisions)) {
            this._recordUsedIdentifier(sourceFile, symbolName);
            return ts.createIdentifier(symbolName);
        }
        let name = null;
        let counter = 1;
        do {
            name = `${symbolName}_${counter++}`;
        } while (!this._isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions));
        this._recordUsedIdentifier(sourceFile, name);
        return ts.createIdentifier(name);
    }
    /**
     * Checks whether the specified identifier name is used within the given source file.
     * @param sourceFile Source file to check for identifier collisions.
     * @param name Name of the identifier which is checked for its uniqueness.
     * @param ignoreIdentifierCollisions List of identifiers which should be ignored when
     *    checking for identifier collisions in the given source file.
     */
    _isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions) {
        if (this._usedIdentifierNames.has(sourceFile) &&
            this._usedIdentifierNames.get(sourceFile).indexOf(name) !== -1) {
            return false;
        }
        // Walk through the source file and search for an identifier matching
        // the given name. In that case, it's not guaranteed that this name
        // is unique in the given declaration scope and we just return false.
        const nodeQueue = [sourceFile];
        while (nodeQueue.length) {
            const node = nodeQueue.shift();
            if (ts.isIdentifier(node) &&
                node.text === name &&
                !ignoreIdentifierCollisions.includes(node)) {
                return false;
            }
            nodeQueue.push(...node.getChildren());
        }
        return true;
    }
    /**
     * Records that the given identifier is used within the specified source file. This
     * is necessary since we do not apply changes to source files per change, but still
     * want to avoid conflicts with newly imported symbols.
     */
    _recordUsedIdentifier(sourceFile, identifierName) {
        this._usedIdentifierNames.set(sourceFile, (this._usedIdentifierNames.get(sourceFile) || []).concat(identifierName));
    }
    /**
     * Determines the full end of a given node. By default the end position of a node is
     * before all trailing comments. This could mean that generated imports shift comments.
     */
    _getEndPositionOfNode(node) {
        const nodeEndPos = node.getEnd();
        const commentRanges = ts.getTrailingCommentRanges(node.getSourceFile().text, nodeEndPos);
        if (!commentRanges || !commentRanges.length) {
            return nodeEndPos;
        }
        return commentRanges[commentRanges.length - 1].end;
    }
}
exports.ImportManager = ImportManager;
// TODO(crisbeto): backwards-compatibility layer that allows us to support both TS 4.4 and 4.5.
// Should be removed once we don't have to support 4.4 anymore.
function createImportSpecifier(propertyName, name) {
    return PARSED_TS_VERSION > 4.4
        ? ts.createImportSpecifier(false, propertyName, name)
        : ts.createImportSpecifier(propertyName, name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaW1wb3J0LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsK0JBQXNDO0FBQ3RDLGlDQUFpQztBQTRCakMsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBb0IsRUFBRSxJQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXZGLHFFQUFxRTtBQUNyRSxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBQ0gsTUFBYSxhQUFhO0lBT3hCLFlBQW9CLFdBQXVCLEVBQVUsUUFBb0I7UUFBckQsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBTnpFLHNFQUFzRTtRQUM5RCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUVsRSxzREFBc0Q7UUFDOUMsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUMsQ0FBQztJQUVVLENBQUM7SUFFN0U7Ozs7O09BS0c7SUFDSyx1QkFBdUIsQ0FBQyxVQUF5QjtRQUN2RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFLENBQUM7U0FDM0M7UUFFRCxNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO1FBQ3BDLEtBQUssSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN0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LElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUMzQyxPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUNELE9BQU8sYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3RELENBQUM7Q0FDRjtBQS9kRCxzQ0ErZEM7QUFFRCwrRkFBK0Y7QUFDL0YsK0RBQStEO0FBQy9ELFNBQVMscUJBQXFCLENBQzVCLFlBQXVDLEVBQ3ZDLElBQW1CO0lBRW5CLE9BQU8saUJBQWlCLEdBQUcsR0FBRztRQUM1QixDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDO1FBQ3JELENBQUMsQ0FBRSxFQUFFLENBQUMscUJBQTZCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2VcblxuLyoqIEVudW0gZGVzY3JpYmluZyB0aGUgcG9zc2libGUgc3RhdGVzIG9mIGFuIGFuYWx5emVkIGltcG9ydC4gKi9cbmNvbnN0IGVudW0gSW1wb3J0U3RhdGUge1xuICBVTk1PRElGSUVEID0gMGIwLFxuICBNT0RJRklFRCA9IDBiMTAsXG4gIEFEREVEID0gMGIxMDAsXG4gIERFTEVURUQgPSAwYjEwMDAsXG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBpbXBvcnQgc3BlY2lmaWVyLiAqL1xuaW50ZXJmYWNlIEltcG9ydFNwZWNpZmllciB7XG4gIG5hbWU6IHRzLklkZW50aWZpZXI7XG4gIHByb3BlcnR5TmFtZT86IHRzLklkZW50aWZpZXI7XG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhbiBhbmFseXplZCBpbXBvcnQuICovXG5pbnRlcmZhY2UgQW5hbHl6ZWRJbXBvcnQge1xuICBub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgbW9kdWxlTmFtZTogc3RyaW5nO1xuICBuYW1lPzogdHMuSWRlbnRpZmllcjtcbiAgc3BlY2lmaWVycz86IEltcG9ydFNwZWNpZmllcltdO1xuICBuYW1lc3BhY2U/OiBib29sZWFuO1xuICBzdGF0ZTogSW1wb3J0U3RhdGU7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhbiBhbmFseXplZCBpbXBvcnQgaGFzIHRoZSBnaXZlbiBpbXBvcnQgZmxhZyBzZXQuICovXG5jb25zdCBoYXNGbGFnID0gKGRhdGE6IEFuYWx5emVkSW1wb3J0LCBmbGFnOiBJbXBvcnRTdGF0ZSkgPT4gKGRhdGEuc3RhdGUgJiBmbGFnKSAhPT0gMDtcblxuLyoqIFBhcnNlZCB2ZXJzaW9uIG9mIFR5cGVTY3JpcHQgdGhhdCBjYW4gYmUgdXNlZCBmb3IgY29tcGFyaXNvbnMuICovXG5jb25zdCBQQVJTRURfVFNfVkVSU0lPTiA9IHBhcnNlRmxvYXQodHMudmVyc2lvbk1ham9yTWlub3IpO1xuXG4vKipcbiAqIEltcG9ydCBtYW5hZ2VyIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIG9yIHJlbW92ZSBUeXBlU2NyaXB0IGltcG9ydHMgd2l0aGluIHNvdXJjZVxuICogZmlsZXMuIFRoZSBtYW5hZ2VyIGVuc3VyZXMgdGhhdCBtdWx0aXBsZSB0cmFuc2Zvcm1hdGlvbnMgYXJlIGFwcGxpZWQgcHJvcGVybHlcbiAqIHdpdGhvdXQgc2hpZnRlZCBvZmZzZXRzIGFuZCB0aGF0IGV4aXN0aW5nIGltcG9ydHMgYXJlIHJlLXVzZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbXBvcnRNYW5hZ2VyIHtcbiAgLyoqIE1hcCBvZiBzb3VyY2UtZmlsZXMgYW5kIHRoZWlyIHByZXZpb3VzbHkgdXNlZCBpZGVudGlmaWVyIG5hbWVzLiAqL1xuICBwcml2YXRlIF91c2VkSWRlbnRpZmllck5hbWVzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBzdHJpbmdbXT4oKTtcblxuICAvKiogTWFwIG9mIHNvdXJjZSBmaWxlcyBhbmQgdGhlaXIgYW5hbHl6ZWQgaW1wb3J0cy4gKi9cbiAgcHJpdmF0ZSBfaW1wb3J0Q2FjaGUgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIEFuYWx5emVkSW1wb3J0W10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZmlsZVN5c3RlbTogRmlsZVN5c3RlbSwgcHJpdmF0ZSBfcHJpbnRlcjogdHMuUHJpbnRlcikge31cblxuICAvKipcbiAgICogQW5hbHl6ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlIGlmIG5lZWRlZC4gSW4gb3JkZXIgdG8gcGVyZm9ybVxuICAgKiBtb2RpZmljYXRpb25zIHRvIGltcG9ydHMgb2YgYSBzb3VyY2UgZmlsZSwgd2Ugc3RvcmUgYWxsIGltcG9ydHMgaW4gbWVtb3J5IGFuZFxuICAgKiB1cGRhdGUgdGhlIHNvdXJjZSBmaWxlIG9uY2UgYWxsIGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUuIFRoaXMgaXMgZXNzZW50aWFsIHRvXG4gICAqIGVuc3VyZSB0aGF0IHdlIGNhbiByZS11c2UgbmV3bHkgYWRkZWQgaW1wb3J0cyBhbmQgbm90IGJyZWFrIGZpbGUgb2Zmc2V0cy5cbiAgICovXG4gIHByaXZhdGUgX2FuYWx5emVJbXBvcnRzSWZOZWVkZWQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IEFuYWx5emVkSW1wb3J0W10ge1xuICAgIGlmICh0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogQW5hbHl6ZWRJbXBvcnRbXSA9IFtdO1xuICAgIGZvciAobGV0IG5vZGUgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIXRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0O1xuXG4gICAgICAvLyBIYW5kbGVzIHNpZGUtZWZmZWN0IGltcG9ydHMgd2hpY2ggZG8gbmVpdGhlciBoYXZlIGEgbmFtZSBvclxuICAgICAgLy8gc3BlY2lmaWVycy4gZS5nLiBgaW1wb3J0IFwibXktcGFja2FnZVwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe21vZHVsZU5hbWUsIG5vZGUsIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVEfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGVzIGltcG9ydHMgcmVzb2x2aW5nIHRvIGRlZmF1bHQgZXhwb3J0cyBvZiBhIG1vZHVsZS5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO2BcbiAgICAgIGlmICghbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5hbWU6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWUsXG4gICAgICAgICAgc3RhdGU6IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlcyBpbXBvcnRzIHdpdGggaW5kaXZpZHVhbCBzeW1ib2wgc3BlY2lmaWVycy5cbiAgICAgIC8vIGUuZy4gYGltcG9ydCB7QSwgQiwgQ30gZnJvbSBcIm15LW1vZHVsZVwiO2BcbiAgICAgIGlmICh0cy5pc05hbWVkSW1wb3J0cyhub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHNwZWNpZmllcnM6IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubWFwKGVsID0+ICh7XG4gICAgICAgICAgICBuYW1lOiBlbC5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBlbC5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgfSkpLFxuICAgICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5VTk1PRElGSUVELFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZXMgbmFtZXNwYWNlZCBpbXBvcnRzLiBlLmcuIGBpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJteS1wa2dcIjtgXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmFtZTogbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5uYW1lLFxuICAgICAgICAgIG5hbWVzcGFjZTogdHJ1ZSxcbiAgICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuVU5NT0RJRklFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2ltcG9ydENhY2hlLnNldChzb3VyY2VGaWxlLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHNwZWNpZmllciwgd2hpY2ggY2FuIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHBhdGgsXG4gICAqIG1hdGNoZXMgdGhlIHBhc3NlZCBtb2R1bGUgbmFtZS5cbiAgICovXG4gIHByaXZhdGUgX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoXG4gICAgYmFzZVBhdGg6IHN0cmluZyxcbiAgICBzcGVjaWZpZXI6IHN0cmluZyxcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzcGVjaWZpZXIuc3RhcnRzV2l0aCgnLicpXG4gICAgICA/IHJlc29sdmUoYmFzZVBhdGgsIHNwZWNpZmllcikgPT09IHJlc29sdmUoYmFzZVBhdGgsIG1vZHVsZU5hbWUpXG4gICAgICA6IHNwZWNpZmllciA9PT0gbW9kdWxlTmFtZTtcbiAgfVxuXG4gIC8qKiBEZWxldGVzIGEgZ2l2ZW4gbmFtZWQgYmluZGluZyBpbXBvcnQgZnJvbSB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBkZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc3ltYm9sTmFtZTogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gdGhpcy5fYW5hbHl6ZUltcG9ydHNJZk5lZWRlZChzb3VyY2VGaWxlKTtcblxuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2lzTW9kdWxlU3BlY2lmaWVyTWF0Y2hpbmcoc291cmNlRGlyLCBpbXBvcnREYXRhLm1vZHVsZU5hbWUsIG1vZHVsZU5hbWUpIHx8XG4gICAgICAgICFpbXBvcnREYXRhLnNwZWNpZmllcnNcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3BlY2lmaWVySW5kZXggPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZEluZGV4KFxuICAgICAgICBkID0+IChkLnByb3BlcnR5TmFtZSB8fCBkLm5hbWUpLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICApO1xuICAgICAgaWYgKHNwZWNpZmllckluZGV4ICE9PSAtMSkge1xuICAgICAgICBpbXBvcnREYXRhLnNwZWNpZmllcnMuc3BsaWNlKHNwZWNpZmllckluZGV4LCAxKTtcbiAgICAgICAgLy8gaWYgdGhlIGltcG9ydCBkb2VzIG5vIGxvbmdlciBjb250YWluIGFueSBzcGVjaWZpZXJzIGFmdGVyIHRoZSByZW1vdmFsIG9mIHRoZVxuICAgICAgICAvLyBnaXZlbiBzeW1ib2wsIHdlIGNhbiBqdXN0IG1hcmsgdGhlIHdob2xlIGltcG9ydCBmb3IgZGVsZXRpb24uIE90aGVyd2lzZSwgd2UgbWFya1xuICAgICAgICAvLyBpdCBhcyBtb2RpZmllZCBzbyB0aGF0IGl0IHdpbGwgYmUgcmUtcHJpbnRlZC5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpbXBvcnREYXRhLnN0YXRlIHw9IEltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWxldGVzIHRoZSBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBpbXBvcnQgZGVjbGFyYXRpb24gaWYgZm91bmQuICovXG4gIGRlbGV0ZUltcG9ydEJ5RGVjbGFyYXRpb24oZGVjbGFyYXRpb246IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgaWYgKGltcG9ydERhdGEubm9kZSA9PT0gZGVjbGFyYXRpb24pIHtcbiAgICAgICAgaW1wb3J0RGF0YS5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5ERUxFVEVEO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGltcG9ydCB0byB0aGUgZ2l2ZW4gc291cmNlIGZpbGUgYW5kIHJldHVybnMgdGhlIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAqIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgbmV3bHkgaW1wb3J0ZWQgc3ltYm9sLlxuICAgKlxuICAgKiBXaGVuZXZlciBhbiBpbXBvcnQgaXMgYWRkZWQgdG8gYSBzb3VyY2UgZmlsZSwgaXQncyByZWNvbW1lbmRlZCB0aGF0IHRoZSByZXR1cm5lZFxuICAgKiBleHByZXNzaW9uIGlzIHVzZWQgdG8gcmVmZXJlbmNlIHRoIHN5bWJvbC4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB0aGUgc3ltYm9sXG4gICAqIGNvdWxkIGJlIGFsaWFzZWQgaWYgaXQgd291bGQgY29sbGlkZSB3aXRoIGV4aXN0aW5nIGltcG9ydHMgaW4gc291cmNlIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFNvdXJjZSBmaWxlIHRvIHdoaWNoIHRoZSBpbXBvcnQgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgdGhhdCBzaG91bGQgYmUgaW1wb3J0ZWQuIENhbiBiZSBudWxsIGlmXG4gICAqICAgIHRoZSBkZWZhdWx0IGV4cG9ydCBpcyByZXF1ZXN0ZWQuXG4gICAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIG1vZHVsZSBvZiB3aGljaCB0aGUgc3ltYm9sIHNob3VsZCBiZSBpbXBvcnRlZC5cbiAgICogQHBhcmFtIHR5cGVJbXBvcnQgV2hldGhlciB0aGUgc3ltYm9sIGlzIGEgdHlwZS5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICB0aGUgaW1wb3J0IG1hbmFnZXIgY2hlY2tzIGZvciBpbXBvcnQgY29sbGlzaW9ucy5cbiAgICovXG4gIGFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgIHN5bWJvbE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgIHR5cGVJbXBvcnQgPSBmYWxzZSxcbiAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9uczogdHMuSWRlbnRpZmllcltdID0gW10sXG4gICk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHNvdXJjZURpciA9IGRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9hbmFseXplSW1wb3J0c0lmTmVlZGVkKHNvdXJjZUZpbGUpO1xuXG4gICAgbGV0IGV4aXN0aW5nSW1wb3J0OiBBbmFseXplZEltcG9ydCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGltcG9ydERhdGEgb2YgZmlsZUltcG9ydHMpIHtcbiAgICAgIGlmICghdGhpcy5faXNNb2R1bGVTcGVjaWZpZXJNYXRjaGluZyhzb3VyY2VEaXIsIGltcG9ydERhdGEubW9kdWxlTmFtZSwgbW9kdWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG5vIHN5bWJvbCBuYW1lIGhhcyBiZWVuIHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgaW1wb3J0IGlzIHJlcXVlc3RlZC4gSW4gdGhhdFxuICAgICAgLy8gY2FzZSB3ZSBzZWFyY2ggZm9yIG5vbi1uYW1lc3BhY2UgYW5kIG5vbi1zcGVjaWZpZXIgaW1wb3J0cy5cbiAgICAgIGlmICghc3ltYm9sTmFtZSAmJiAhaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIWltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihpbXBvcnREYXRhLm5hbWUhLnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBjYXNlIGEgXCJUeXBlXCIgc3ltYm9sIGlzIGltcG9ydGVkLCB3ZSBjYW4ndCB1c2UgbmFtZXNwYWNlIGltcG9ydHNcbiAgICAgIC8vIGJlY2F1c2UgdGhlc2Ugb25seSBleHBvcnQgc3ltYm9scyBhdmFpbGFibGUgYXQgcnVudGltZSAobm8gdHlwZXMpXG4gICAgICBpZiAoaW1wb3J0RGF0YS5uYW1lc3BhY2UgJiYgIXR5cGVJbXBvcnQpIHtcbiAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKFxuICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoaW1wb3J0RGF0YS5uYW1lIS50ZXh0KSxcbiAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUgfHwgJ2RlZmF1bHQnKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1wb3J0RGF0YS5zcGVjaWZpZXJzICYmIHN5bWJvbE5hbWUpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTcGVjaWZpZXIgPSBpbXBvcnREYXRhLnNwZWNpZmllcnMuZmluZChzID0+XG4gICAgICAgICAgcy5wcm9wZXJ0eU5hbWUgPyBzLnByb3BlcnR5TmFtZS50ZXh0ID09PSBzeW1ib2xOYW1lIDogcy5uYW1lLnRleHQgPT09IHN5bWJvbE5hbWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nU3BlY2lmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoZXhpc3RpbmdTcGVjaWZpZXIubmFtZS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIGNhc2UgdGhlIHN5bWJvbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gYW4gZXhpc3RpbmcgaW1wb3J0LCB3ZVxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYXMgaXQgY2FuIGJlIHVwZGF0ZWQgdG8gaW5jbHVkZVxuICAgICAgICAvLyB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lIHdpdGhvdXQgaGF2aW5nIHRvIGNyZWF0ZSBhIG5ldyBpbXBvcnQuXG4gICAgICAgIGV4aXN0aW5nSW1wb3J0ID0gaW1wb3J0RGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBleGlzdGluZyBpbXBvcnQgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbW9kdWxlLCB3ZVxuICAgIC8vIGp1c3QgdXBkYXRlIHRoZSBpbXBvcnQgc3BlY2lmaWVycyB0byBhbHNvIGltcG9ydCB0aGUgcmVxdWVzdGVkIHN5bWJvbC5cbiAgICBpZiAoZXhpc3RpbmdJbXBvcnQpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5SWRlbnRpZmllciA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSEpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUhLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgZXhpc3RpbmdJbXBvcnQuc3BlY2lmaWVycyEucHVzaCh7XG4gICAgICAgIG5hbWU6IGltcG9ydE5hbWUsXG4gICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBleGlzdGluZ0ltcG9ydC5zdGF0ZSB8PSBJbXBvcnRTdGF0ZS5NT0RJRklFRDtcblxuICAgICAgaWYgKGhhc0ZsYWcoZXhpc3RpbmdJbXBvcnQsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgIC8vIHVuc2V0IHRoZSBkZWxldGVkIGZsYWcgaWYgdGhlIGltcG9ydCBpcyBwZW5kaW5nIGRlbGV0aW9uLCBidXRcbiAgICAgICAgLy8gY2FuIG5vdyBiZSB1c2VkIGZvciB0aGUgbmV3IGltcG9ydGVkIHN5bWJvbC5cbiAgICAgICAgZXhpc3RpbmdJbXBvcnQuc3RhdGUgJj0gfkltcG9ydFN0YXRlLkRFTEVURUQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbXBvcnROYW1lO1xuICAgIH1cblxuICAgIGxldCBpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IG5ld0ltcG9ydDogQW5hbHl6ZWRJbXBvcnQgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChzeW1ib2xOYW1lKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5lZWRzR2VuZXJhdGVkVW5pcXVlTmFtZSA9IGdlbmVyYXRlZFVuaXF1ZUlkZW50aWZpZXIudGV4dCAhPT0gc3ltYm9sTmFtZTtcbiAgICAgIGlkZW50aWZpZXIgPSBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPyBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyIDogcHJvcGVydHlJZGVudGlmaWVyO1xuXG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB0cy5jcmVhdGVOYW1lZEltcG9ydHMoW10pKSxcbiAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG5cbiAgICAgIG5ld0ltcG9ydCA9IHtcbiAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgbm9kZTogbmV3SW1wb3J0RGVjbCxcbiAgICAgICAgc3BlY2lmaWVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmFtZTogaWRlbnRpZmllcixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBzdGF0ZTogSW1wb3J0U3RhdGUuQURERUQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgJ2RlZmF1bHRFeHBvcnQnLFxuICAgICAgICBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdJbXBvcnREZWNsID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UoaWRlbnRpZmllciwgdW5kZWZpbmVkKSxcbiAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lKSxcbiAgICAgICk7XG4gICAgICBuZXdJbXBvcnQgPSB7XG4gICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgIG5vZGU6IG5ld0ltcG9ydERlY2wsXG4gICAgICAgIG5hbWU6IGlkZW50aWZpZXIsXG4gICAgICAgIHN0YXRlOiBJbXBvcnRTdGF0ZS5BRERFRCxcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbGVJbXBvcnRzLnB1c2gobmV3SW1wb3J0KTtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSByZWNvcmRlZCBjaGFuZ2VzIGluIHRoZSB1cGRhdGUgcmVjb3JkZXJzIG9mIHRoZSBjb3JyZXNwb25kaW5nIHNvdXJjZSBmaWxlcy5cbiAgICogVGhlIGNoYW5nZXMgYXJlIGFwcGxpZWQgc2VwYXJhdGVseSBhZnRlciBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gcmVjb3JkZWQgYmVjYXVzZSBvdGhlcndpc2VcbiAgICogZmlsZSBvZmZzZXRzIHdpbGwgY2hhbmdlIGFuZCB0aGUgc291cmNlIGZpbGVzIHdvdWxkIG5lZWQgdG8gYmUgcmUtcGFyc2VkIGFmdGVyIGVhY2ggY2hhbmdlLlxuICAgKi9cbiAgcmVjb3JkQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbXBvcnRDYWNoZS5mb3JFYWNoKChmaWxlSW1wb3J0cywgc291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLl9maWxlU3lzdGVtLmVkaXQodGhpcy5fZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICAgIGNvbnN0IGxhc3RVbm1vZGlmaWVkSW1wb3J0ID0gZmlsZUltcG9ydHNcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuZmluZChpID0+IGkuc3RhdGUgPT09IEltcG9ydFN0YXRlLlVOTU9ESUZJRUQpO1xuICAgICAgY29uc3QgaW1wb3J0U3RhcnRJbmRleCA9IGxhc3RVbm1vZGlmaWVkSW1wb3J0XG4gICAgICAgID8gdGhpcy5fZ2V0RW5kUG9zaXRpb25PZk5vZGUobGFzdFVubW9kaWZpZWRJbXBvcnQubm9kZSlcbiAgICAgICAgOiAwO1xuXG4gICAgICBmaWxlSW1wb3J0cy5mb3JFYWNoKGltcG9ydERhdGEgPT4ge1xuICAgICAgICBpZiAoaW1wb3J0RGF0YS5zdGF0ZSA9PT0gSW1wb3J0U3RhdGUuVU5NT0RJRklFRCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkRFTEVURUQpKSB7XG4gICAgICAgICAgLy8gSW1wb3J0cyB3aGljaCBkbyBub3QgZXhpc3QgaW4gc291cmNlIGZpbGUsIGNhbiBiZSBqdXN0IHNraXBwZWQgYXNcbiAgICAgICAgICAvLyB3ZSBkbyBub3QgbmVlZCBhbnkgcmVwbGFjZW1lbnQgdG8gZGVsZXRlIHRoZSBpbXBvcnQuXG4gICAgICAgICAgaWYgKCFoYXNGbGFnKGltcG9ydERhdGEsIEltcG9ydFN0YXRlLkFEREVEKSkge1xuICAgICAgICAgICAgcmVjb3JkZXIucmVtb3ZlKGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSwgaW1wb3J0RGF0YS5ub2RlLmdldEZ1bGxXaWR0aCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcG9ydERhdGEuc3BlY2lmaWVycykge1xuICAgICAgICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBpbXBvcnREYXRhLm5vZGUuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzIGFzIHRzLk5hbWVkSW1wb3J0cztcbiAgICAgICAgICBjb25zdCBpbXBvcnRTcGVjaWZpZXJzID0gaW1wb3J0RGF0YS5zcGVjaWZpZXJzLm1hcChzID0+XG4gICAgICAgICAgICBjcmVhdGVJbXBvcnRTcGVjaWZpZXIocy5wcm9wZXJ0eU5hbWUsIHMubmFtZSksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkQmluZGluZ3MgPSB0cy51cGRhdGVOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncywgaW1wb3J0U3BlY2lmaWVycyk7XG5cbiAgICAgICAgICAvLyBJbiBjYXNlIGFuIGltcG9ydCBoYXMgYmVlbiBhZGRlZCBuZXdseSwgd2UgbmVlZCB0byBwcmludCB0aGUgd2hvbGUgaW1wb3J0XG4gICAgICAgICAgLy8gZGVjbGFyYXRpb24gYW5kIGluc2VydCBpdCBhdCB0aGUgaW1wb3J0IHN0YXJ0IGluZGV4LiBPdGhlcndpc2UsIHdlIGp1c3RcbiAgICAgICAgICAvLyB1cGRhdGUgdGhlIG5hbWVkIGJpbmRpbmdzIHRvIG5vdCByZS1wcmludCB0aGUgd2hvbGUgaW1wb3J0ICh3aGljaCBjb3VsZFxuICAgICAgICAgIC8vIGNhdXNlIHVubmVjZXNzYXJ5IGZvcm1hdHRpbmcgY2hhbmdlcylcbiAgICAgICAgICBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRJbXBvcnQgPSB0cy51cGRhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgaW1wb3J0RGF0YS5ub2RlLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdXBkYXRlZEJpbmRpbmdzKSxcbiAgICAgICAgICAgICAgdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChpbXBvcnREYXRhLm1vZHVsZU5hbWUpLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgbmV3SW1wb3J0VGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgICAgdXBkYXRlZEltcG9ydCxcbiAgICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LFxuICAgICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZsYWcoaW1wb3J0RGF0YSwgSW1wb3J0U3RhdGUuTU9ESUZJRUQpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdOYW1lZEJpbmRpbmdzVGV4dCA9IHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgICAgdXBkYXRlZEJpbmRpbmdzLFxuICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlY29yZGVyLnJlbW92ZShuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5hbWVkQmluZGluZ3MuZ2V0V2lkdGgoKSk7XG4gICAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChuYW1lZEJpbmRpbmdzLmdldFN0YXJ0KCksIG5ld05hbWVkQmluZGluZ3NUZXh0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID0gdGhpcy5fcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICAgIGltcG9ydERhdGEubm9kZSxcbiAgICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgICAgICAgICAgaW1wb3J0U3RhcnRJbmRleCxcbiAgICAgICAgICAgIGltcG9ydFN0YXJ0SW5kZXggPT09IDAgPyBgJHtuZXdJbXBvcnRUZXh0fVxcbmAgOiBgXFxuJHtuZXdJbXBvcnRUZXh0fWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBzaG91bGQgbmV2ZXIgaGl0IHRoaXMsIGJ1dCB3ZSByYXRoZXIgd2FudCB0byBwcmludCBhIGN1c3RvbSBleGNlcHRpb25cbiAgICAgICAgLy8gaW5zdGVhZCBvZiBqdXN0IHNraXBwaW5nIGltcG9ydHMgc2lsZW50bHkuXG4gICAgICAgIHRocm93IEVycm9yKCdVbmV4cGVjdGVkIGltcG9ydCBtb2RpZmljYXRpb24uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JyZWN0cyB0aGUgbGluZSBhbmQgY2hhcmFjdGVyIHBvc2l0aW9uIG9mIGEgZ2l2ZW4gbm9kZS4gU2luY2Ugbm9kZXMgb2ZcbiAgICogc291cmNlIGZpbGVzIGFyZSBpbW11dGFibGUgYW5kIHdlIHNvbWV0aW1lcyBtYWtlIGNoYW5nZXMgdG8gdGhlIGNvbnRhaW5pbmdcbiAgICogc291cmNlIGZpbGUsIHRoZSBub2RlIHBvc2l0aW9uIG1pZ2h0IHNoaWZ0IChlLmcuIGlmIHdlIGFkZCBhIG5ldyBpbXBvcnQgYmVmb3JlKS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBjb3JyZWN0ZWQgcG9zaXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuIFRoaXNcbiAgICogaXMgaGVscGZ1bCB3aGVuIHByaW50aW5nIG91dCBlcnJvciBtZXNzYWdlcyB3aGljaCBzaG91bGQgcmVmbGVjdCB0aGUgbmV3IHN0YXRlIG9mXG4gICAqIHNvdXJjZSBmaWxlcy5cbiAgICovXG4gIGNvcnJlY3ROb2RlUG9zaXRpb24obm9kZTogdHMuTm9kZSwgb2Zmc2V0OiBudW1iZXIsIHBvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyKSB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuXG4gICAgaWYgKCF0aGlzLl9pbXBvcnRDYWNoZS5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdQb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3RlciA9IHsuLi5wb3NpdGlvbn07XG4gICAgY29uc3QgZmlsZUltcG9ydHMgPSB0aGlzLl9pbXBvcnRDYWNoZS5nZXQoc291cmNlRmlsZSkhO1xuXG4gICAgZm9yIChsZXQgaW1wb3J0RGF0YSBvZiBmaWxlSW1wb3J0cykge1xuICAgICAgY29uc3QgZnVsbEVuZCA9IGltcG9ydERhdGEubm9kZS5nZXRGdWxsU3RhcnQoKSArIGltcG9ydERhdGEubm9kZS5nZXRGdWxsV2lkdGgoKTtcbiAgICAgIC8vIFN1YnRyYWN0IG9yIGFkZCBsaW5lcyBiYXNlZCBvbiB3aGV0aGVyIGFuIGltcG9ydCBoYXMgYmVlbiBkZWxldGVkIG9yIHJlbW92ZWRcbiAgICAgIC8vIGJlZm9yZSB0aGUgYWN0dWFsIG5vZGUgb2Zmc2V0LlxuICAgICAgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5ERUxFVEVEKSkge1xuICAgICAgICBuZXdQb3NpdGlvbi5saW5lLS07XG4gICAgICB9IGVsc2UgaWYgKG9mZnNldCA+IGZ1bGxFbmQgJiYgaGFzRmxhZyhpbXBvcnREYXRhLCBJbXBvcnRTdGF0ZS5BRERFRCkpIHtcbiAgICAgICAgbmV3UG9zaXRpb24ubGluZSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3UG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiB1bmlxdWUgaWRlbnRpZmllciBuYW1lIGZvciB0aGUgc3BlY2lmaWVkIHN5bWJvbCBuYW1lLlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBTb3VyY2UgZmlsZSB0byBjaGVjayBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zLlxuICAgKiBAcGFyYW0gc3ltYm9sTmFtZSBOYW1lIG9mIHRoZSBzeW1ib2wgZm9yIHdoaWNoIHdlIHdhbnQgdG8gZ2VuZXJhdGUgYW4gdW5pcXVlIG5hbWUuXG4gICAqIEBwYXJhbSBpZ25vcmVJZGVudGlmaWVyQ29sbGlzaW9ucyBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHNob3VsZCBiZSBpZ25vcmVkIHdoZW5cbiAgICogICAgY2hlY2tpbmcgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucyBpbiB0aGUgZ2l2ZW4gc291cmNlIGZpbGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXRVbmlxdWVJZGVudGlmaWVyKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nLFxuICAgIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zOiB0cy5JZGVudGlmaWVyW10sXG4gICk6IHRzLklkZW50aWZpZXIge1xuICAgIGlmICh0aGlzLl9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKSkge1xuICAgICAgdGhpcy5fcmVjb3JkVXNlZElkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSk7XG4gICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgIGRvIHtcbiAgICAgIG5hbWUgPSBgJHtzeW1ib2xOYW1lfV8ke2NvdW50ZXIrK31gO1xuICAgIH0gd2hpbGUgKCF0aGlzLl9pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIG5hbWUsIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zKSk7XG5cbiAgICB0aGlzLl9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlLCBuYW1lISk7XG4gICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIobmFtZSEpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllciBuYW1lIGlzIHVzZWQgd2l0aGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgU291cmNlIGZpbGUgdG8gY2hlY2sgZm9yIGlkZW50aWZpZXIgY29sbGlzaW9ucy5cbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgaWRlbnRpZmllciB3aGljaCBpcyBjaGVja2VkIGZvciBpdHMgdW5pcXVlbmVzcy5cbiAgICogQHBhcmFtIGlnbm9yZUlkZW50aWZpZXJDb2xsaXNpb25zIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggc2hvdWxkIGJlIGlnbm9yZWQgd2hlblxuICAgKiAgICBjaGVja2luZyBmb3IgaWRlbnRpZmllciBjb2xsaXNpb25zIGluIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2lzVW5pcXVlSWRlbnRpZmllck5hbWUoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnM6IHRzLklkZW50aWZpZXJbXSxcbiAgKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5oYXMoc291cmNlRmlsZSkgJiZcbiAgICAgIHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIS5pbmRleE9mKG5hbWUpICE9PSAtMVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdhbGsgdGhyb3VnaCB0aGUgc291cmNlIGZpbGUgYW5kIHNlYXJjaCBmb3IgYW4gaWRlbnRpZmllciBtYXRjaGluZ1xuICAgIC8vIHRoZSBnaXZlbiBuYW1lLiBJbiB0aGF0IGNhc2UsIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCB0aGlzIG5hbWVcbiAgICAvLyBpcyB1bmlxdWUgaW4gdGhlIGdpdmVuIGRlY2xhcmF0aW9uIHNjb3BlIGFuZCB3ZSBqdXN0IHJldHVybiBmYWxzZS5cbiAgICBjb25zdCBub2RlUXVldWU6IHRzLk5vZGVbXSA9IFtzb3VyY2VGaWxlXTtcbiAgICB3aGlsZSAobm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVRdWV1ZS5zaGlmdCgpITtcbiAgICAgIGlmIChcbiAgICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUpICYmXG4gICAgICAgIG5vZGUudGV4dCA9PT0gbmFtZSAmJlxuICAgICAgICAhaWdub3JlSWRlbnRpZmllckNvbGxpc2lvbnMuaW5jbHVkZXMobm9kZSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBub2RlUXVldWUucHVzaCguLi5ub2RlLmdldENoaWxkcmVuKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmRzIHRoYXQgdGhlIGdpdmVuIGlkZW50aWZpZXIgaXMgdXNlZCB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gVGhpc1xuICAgKiBpcyBuZWNlc3Nhcnkgc2luY2Ugd2UgZG8gbm90IGFwcGx5IGNoYW5nZXMgdG8gc291cmNlIGZpbGVzIHBlciBjaGFuZ2UsIGJ1dCBzdGlsbFxuICAgKiB3YW50IHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIG5ld2x5IGltcG9ydGVkIHN5bWJvbHMuXG4gICAqL1xuICBwcml2YXRlIF9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBpZGVudGlmaWVyTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXNlZElkZW50aWZpZXJOYW1lcy5zZXQoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgKHRoaXMuX3VzZWRJZGVudGlmaWVyTmFtZXMuZ2V0KHNvdXJjZUZpbGUpIHx8IFtdKS5jb25jYXQoaWRlbnRpZmllck5hbWUpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgb2YgYSBnaXZlbiBub2RlLiBCeSBkZWZhdWx0IHRoZSBlbmQgcG9zaXRpb24gb2YgYSBub2RlIGlzXG4gICAqIGJlZm9yZSBhbGwgdHJhaWxpbmcgY29tbWVudHMuIFRoaXMgY291bGQgbWVhbiB0aGF0IGdlbmVyYXRlZCBpbXBvcnRzIHNoaWZ0IGNvbW1lbnRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0RW5kUG9zaXRpb25PZk5vZGUobm9kZTogdHMuTm9kZSkge1xuICAgIGNvbnN0IG5vZGVFbmRQb3MgPSBub2RlLmdldEVuZCgpO1xuICAgIGNvbnN0IGNvbW1lbnRSYW5nZXMgPSB0cy5nZXRUcmFpbGluZ0NvbW1lbnRSYW5nZXMobm9kZS5nZXRTb3VyY2VGaWxlKCkudGV4dCwgbm9kZUVuZFBvcyk7XG4gICAgaWYgKCFjb21tZW50UmFuZ2VzIHx8ICFjb21tZW50UmFuZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5vZGVFbmRQb3M7XG4gICAgfVxuICAgIHJldHVybiBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV0hLmVuZDtcbiAgfVxufVxuXG4vLyBUT0RPKGNyaXNiZXRvKTogYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgbGF5ZXIgdGhhdCBhbGxvd3MgdXMgdG8gc3VwcG9ydCBib3RoIFRTIDQuNCBhbmQgNC41LlxuLy8gU2hvdWxkIGJlIHJlbW92ZWQgb25jZSB3ZSBkb24ndCBoYXZlIHRvIHN1cHBvcnQgNC40IGFueW1vcmUuXG5mdW5jdGlvbiBjcmVhdGVJbXBvcnRTcGVjaWZpZXIoXG4gIHByb3BlcnR5TmFtZTogdHMuSWRlbnRpZmllciB8IHVuZGVmaW5lZCxcbiAgbmFtZTogdHMuSWRlbnRpZmllcixcbik6IHRzLkltcG9ydFNwZWNpZmllciB7XG4gIHJldHVybiBQQVJTRURfVFNfVkVSU0lPTiA+IDQuNFxuICAgID8gdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKGZhbHNlLCBwcm9wZXJ0eU5hbWUsIG5hbWUpXG4gICAgOiAodHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyIGFzIGFueSkocHJvcGVydHlOYW1lLCBuYW1lKTtcbn1cbiJdfQ==