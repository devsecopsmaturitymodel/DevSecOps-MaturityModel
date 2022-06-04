/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/import_manager", ["require", "exports", "path", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportManager = void 0;
    const path_1 = require("path");
    const typescript_1 = __importDefault(require("typescript"));
    const PARSED_TS_VERSION = parseFloat(typescript_1.default.versionMajorMinor);
    /**
     * Import manager that can be used to add TypeScript imports to given source
     * files. The manager ensures that multiple transformations are applied properly
     * without shifted offsets and that similar existing import declarations are re-used.
     */
    class ImportManager {
        constructor(getUpdateRecorder, printer) {
            this.getUpdateRecorder = getUpdateRecorder;
            this.printer = printer;
            /** Map of import declarations that need to be updated to include the given symbols. */
            this.updatedImports = new Map();
            /** Map of source-files and their previously used identifier names. */
            this.usedIdentifierNames = new Map();
            /**
             * Array of previously resolved symbol imports. Cache can be re-used to return
             * the same identifier without checking the source-file again.
             */
            this.importCache = [];
        }
        /**
         * Adds an import to the given source-file and returns the TypeScript
         * identifier that can be used to access the newly imported symbol.
         */
        addImportToSourceFile(sourceFile, symbolName, moduleName, typeImport = false) {
            const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
            let importStartIndex = 0;
            let existingImport = null;
            // In case the given import has been already generated previously, we just return
            // the previous generated identifier in order to avoid duplicate generated imports.
            const cachedImport = this.importCache.find(c => c.sourceFile === sourceFile && c.symbolName === symbolName &&
                c.moduleName === moduleName);
            if (cachedImport) {
                return cachedImport.identifier;
            }
            // Walk through all source-file top-level statements and search for import declarations
            // that already match the specified "moduleName" and can be updated to import the
            // given symbol. If no matching import can be found, the last import in the source-file
            // will be used as starting point for a new import that will be generated.
            for (let i = sourceFile.statements.length - 1; i >= 0; i--) {
                const statement = sourceFile.statements[i];
                if (!typescript_1.default.isImportDeclaration(statement) || !typescript_1.default.isStringLiteral(statement.moduleSpecifier) ||
                    !statement.importClause) {
                    continue;
                }
                if (importStartIndex === 0) {
                    importStartIndex = this._getEndPositionOfNode(statement);
                }
                const moduleSpecifier = statement.moduleSpecifier.text;
                if (moduleSpecifier.startsWith('.') &&
                    (0, path_1.resolve)(sourceDir, moduleSpecifier) !== (0, path_1.resolve)(sourceDir, moduleName) ||
                    moduleSpecifier !== moduleName) {
                    continue;
                }
                if (statement.importClause.namedBindings) {
                    const namedBindings = statement.importClause.namedBindings;
                    // In case a "Type" symbol is imported, we can't use namespace imports
                    // because these only export symbols available at runtime (no types)
                    if (typescript_1.default.isNamespaceImport(namedBindings) && !typeImport) {
                        return typescript_1.default.createPropertyAccess(typescript_1.default.createIdentifier(namedBindings.name.text), typescript_1.default.createIdentifier(symbolName || 'default'));
                    }
                    else if (typescript_1.default.isNamedImports(namedBindings) && symbolName) {
                        const existingElement = namedBindings.elements.find(e => e.propertyName ? e.propertyName.text === symbolName : e.name.text === symbolName);
                        if (existingElement) {
                            return typescript_1.default.createIdentifier(existingElement.name.text);
                        }
                        // In case the symbol could not be found in an existing import, we
                        // keep track of the import declaration as it can be updated to include
                        // the specified symbol name without having to create a new import.
                        existingImport = statement;
                    }
                }
                else if (statement.importClause.name && !symbolName) {
                    return typescript_1.default.createIdentifier(statement.importClause.name.text);
                }
            }
            if (existingImport) {
                const propertyIdentifier = typescript_1.default.createIdentifier(symbolName);
                const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName);
                const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
                const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
                // Since it can happen that multiple classes need to be imported within the
                // specified source file and we want to add the identifiers to the existing
                // import declaration, we need to keep track of the updated import declarations.
                // We can't directly update the import declaration for each identifier as this
                // would throw off the recorder offsets. We need to keep track of the new identifiers
                // for the import and perform the import transformation as batches per source-file.
                this.updatedImports.set(existingImport, (this.updatedImports.get(existingImport) || []).concat({
                    propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
                    importName: importName,
                }));
                // Keep track of all updated imports so that we don't generate duplicate
                // similar imports as these can't be statically analyzed in the source-file yet.
                this.importCache.push({ sourceFile, moduleName, symbolName, identifier: importName });
                return importName;
            }
            let identifier = null;
            let newImport = null;
            if (symbolName) {
                const propertyIdentifier = typescript_1.default.createIdentifier(symbolName);
                const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName);
                const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
                identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
                newImport = typescript_1.default.createImportDeclaration(undefined, undefined, typescript_1.default.createImportClause(undefined, typescript_1.default.createNamedImports([createImportSpecifier(needsGeneratedUniqueName ? propertyIdentifier : undefined, identifier)])), typescript_1.default.createStringLiteral(moduleName));
            }
            else {
                identifier = this._getUniqueIdentifier(sourceFile, 'defaultExport');
                newImport = typescript_1.default.createImportDeclaration(undefined, undefined, typescript_1.default.createImportClause(identifier, undefined), typescript_1.default.createStringLiteral(moduleName));
            }
            const newImportText = this.printer.printNode(typescript_1.default.EmitHint.Unspecified, newImport, sourceFile);
            // If the import is generated at the start of the source file, we want to add
            // a new-line after the import. Otherwise if the import is generated after an
            // existing import, we need to prepend a new-line so that the import is not on
            // the same line as the existing import anchor.
            this.getUpdateRecorder(sourceFile)
                .addNewImport(importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);
            // Keep track of all generated imports so that we don't generate duplicate
            // similar imports as these can't be statically analyzed in the source-file yet.
            this.importCache.push({ sourceFile, symbolName, moduleName, identifier });
            return identifier;
        }
        /**
         * Stores the collected import changes within the appropriate update recorders. The
         * updated imports can only be updated *once* per source-file because previous updates
         * could otherwise shift the source-file offsets.
         */
        recordChanges() {
            this.updatedImports.forEach((expressions, importDecl) => {
                const sourceFile = importDecl.getSourceFile();
                const recorder = this.getUpdateRecorder(sourceFile);
                const namedBindings = importDecl.importClause.namedBindings;
                const newNamedBindings = typescript_1.default.updateNamedImports(namedBindings, namedBindings.elements.concat(expressions.map(({ propertyName, importName }) => createImportSpecifier(propertyName, importName))));
                const newNamedBindingsText = this.printer.printNode(typescript_1.default.EmitHint.Unspecified, newNamedBindings, sourceFile);
                recorder.updateExistingImport(namedBindings, newNamedBindingsText);
            });
        }
        /** Gets an unique identifier with a base name for the given source file. */
        _getUniqueIdentifier(sourceFile, baseName) {
            if (this.isUniqueIdentifierName(sourceFile, baseName)) {
                this._recordUsedIdentifier(sourceFile, baseName);
                return typescript_1.default.createIdentifier(baseName);
            }
            let name = null;
            let counter = 1;
            do {
                name = `${baseName}_${counter++}`;
            } while (!this.isUniqueIdentifierName(sourceFile, name));
            this._recordUsedIdentifier(sourceFile, name);
            return typescript_1.default.createIdentifier(name);
        }
        /**
         * Checks whether the specified identifier name is used within the given
         * source file.
         */
        isUniqueIdentifierName(sourceFile, name) {
            if (this.usedIdentifierNames.has(sourceFile) &&
                this.usedIdentifierNames.get(sourceFile).indexOf(name) !== -1) {
                return false;
            }
            // Walk through the source file and search for an identifier matching
            // the given name. In that case, it's not guaranteed that this name
            // is unique in the given declaration scope and we just return false.
            const nodeQueue = [sourceFile];
            while (nodeQueue.length) {
                const node = nodeQueue.shift();
                if (typescript_1.default.isIdentifier(node) && node.text === name) {
                    return false;
                }
                nodeQueue.push(...node.getChildren());
            }
            return true;
        }
        _recordUsedIdentifier(sourceFile, identifierName) {
            this.usedIdentifierNames.set(sourceFile, (this.usedIdentifierNames.get(sourceFile) || []).concat(identifierName));
        }
        /**
         * Determines the full end of a given node. By default the end position of a node is
         * before all trailing comments. This could mean that generated imports shift comments.
         */
        _getEndPositionOfNode(node) {
            const nodeEndPos = node.getEnd();
            const commentRanges = typescript_1.default.getTrailingCommentRanges(node.getSourceFile().text, nodeEndPos);
            if (!commentRanges || !commentRanges.length) {
                return nodeEndPos;
            }
            return commentRanges[commentRanges.length - 1].end;
        }
    }
    exports.ImportManager = ImportManager;
    /**
     * Backwards-compatible version of `ts.createImportSpecifier`
     * to handle a breaking change between 4.4 and 4.5.
     */
    function createImportSpecifier(propertyName, name, isTypeOnly = false) {
        return PARSED_TS_VERSION > 4.4 ? typescript_1.default.createImportSpecifier(isTypeOnly, propertyName, name) :
            // TODO(crisbeto): backwards-compatibility layer for TS 4.4.
            // Should be cleaned up when we drop support for it.
            typescript_1.default.createImportSpecifier(propertyName, name);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0X21hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvaW1wb3J0X21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQXNDO0lBQ3RDLDREQUE0QjtJQUU1QixNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxvQkFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFRM0Q7Ozs7T0FJRztJQUNILE1BQWEsYUFBYTtRQWlCeEIsWUFDWSxpQkFBcUUsRUFDckUsT0FBbUI7WUFEbkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFvRDtZQUNyRSxZQUFPLEdBQVAsT0FBTyxDQUFZO1lBbEIvQix1RkFBdUY7WUFDL0UsbUJBQWMsR0FDbEIsSUFBSSxHQUFHLEVBQXFGLENBQUM7WUFDakcsc0VBQXNFO1lBQzlELHdCQUFtQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1lBQ2pFOzs7ZUFHRztZQUNLLGdCQUFXLEdBS2IsRUFBRSxDQUFDO1FBSXlCLENBQUM7UUFFbkM7OztXQUdHO1FBQ0gscUJBQXFCLENBQ2pCLFVBQXlCLEVBQUUsVUFBdUIsRUFBRSxVQUFrQixFQUN0RSxVQUFVLEdBQUcsS0FBSztZQUNwQixNQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU8sRUFBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7WUFDekIsSUFBSSxjQUFjLEdBQThCLElBQUksQ0FBQztZQUVyRCxpRkFBaUY7WUFDakYsbUZBQW1GO1lBQ25GLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUN0QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFV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LEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5jb25zdCBQQVJTRURfVFNfVkVSU0lPTiA9IHBhcnNlRmxvYXQodHMudmVyc2lvbk1ham9yTWlub3IpO1xuXG4vKiogVXBkYXRlIHJlY29yZGVyIGZvciBtYW5hZ2luZyBpbXBvcnRzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbXBvcnRNYW5hZ2VyVXBkYXRlUmVjb3JkZXIge1xuICBhZGROZXdJbXBvcnQoc3RhcnQ6IG51bWJlciwgaW1wb3J0VGV4dDogc3RyaW5nKTogdm9pZDtcbiAgdXBkYXRlRXhpc3RpbmdJbXBvcnQobmFtZWRCaW5kaW5nczogdHMuTmFtZWRJbXBvcnRzLCBuZXdOYW1lZEJpbmRpbmdzOiBzdHJpbmcpOiB2b2lkO1xufVxuXG4vKipcbiAqIEltcG9ydCBtYW5hZ2VyIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBnaXZlbiBzb3VyY2VcbiAqIGZpbGVzLiBUaGUgbWFuYWdlciBlbnN1cmVzIHRoYXQgbXVsdGlwbGUgdHJhbnNmb3JtYXRpb25zIGFyZSBhcHBsaWVkIHByb3Blcmx5XG4gKiB3aXRob3V0IHNoaWZ0ZWQgb2Zmc2V0cyBhbmQgdGhhdCBzaW1pbGFyIGV4aXN0aW5nIGltcG9ydCBkZWNsYXJhdGlvbnMgYXJlIHJlLXVzZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbXBvcnRNYW5hZ2VyIHtcbiAgLyoqIE1hcCBvZiBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgbmVlZCB0byBiZSB1cGRhdGVkIHRvIGluY2x1ZGUgdGhlIGdpdmVuIHN5bWJvbHMuICovXG4gIHByaXZhdGUgdXBkYXRlZEltcG9ydHMgPVxuICAgICAgbmV3IE1hcDx0cy5JbXBvcnREZWNsYXJhdGlvbiwge3Byb3BlcnR5TmFtZT86IHRzLklkZW50aWZpZXIsIGltcG9ydE5hbWU6IHRzLklkZW50aWZpZXJ9W10+KCk7XG4gIC8qKiBNYXAgb2Ygc291cmNlLWZpbGVzIGFuZCB0aGVpciBwcmV2aW91c2x5IHVzZWQgaWRlbnRpZmllciBuYW1lcy4gKi9cbiAgcHJpdmF0ZSB1c2VkSWRlbnRpZmllck5hbWVzID0gbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBzdHJpbmdbXT4oKTtcbiAgLyoqXG4gICAqIEFycmF5IG9mIHByZXZpb3VzbHkgcmVzb2x2ZWQgc3ltYm9sIGltcG9ydHMuIENhY2hlIGNhbiBiZSByZS11c2VkIHRvIHJldHVyblxuICAgKiB0aGUgc2FtZSBpZGVudGlmaWVyIHdpdGhvdXQgY2hlY2tpbmcgdGhlIHNvdXJjZS1maWxlIGFnYWluLlxuICAgKi9cbiAgcHJpdmF0ZSBpbXBvcnRDYWNoZToge1xuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgc3ltYm9sTmFtZTogc3RyaW5nfG51bGwsXG4gICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgIGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXJcbiAgfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGdldFVwZGF0ZVJlY29yZGVyOiAoc2Y6IHRzLlNvdXJjZUZpbGUpID0+IEltcG9ydE1hbmFnZXJVcGRhdGVSZWNvcmRlcixcbiAgICAgIHByaXZhdGUgcHJpbnRlcjogdHMuUHJpbnRlcikge31cblxuICAvKipcbiAgICogQWRkcyBhbiBpbXBvcnQgdG8gdGhlIGdpdmVuIHNvdXJjZS1maWxlIGFuZCByZXR1cm5zIHRoZSBUeXBlU2NyaXB0XG4gICAqIGlkZW50aWZpZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIG5ld2x5IGltcG9ydGVkIHN5bWJvbC5cbiAgICovXG4gIGFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIHN5bWJvbE5hbWU6IHN0cmluZ3xudWxsLCBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgICB0eXBlSW1wb3J0ID0gZmFsc2UpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBkaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGxldCBpbXBvcnRTdGFydEluZGV4ID0gMDtcbiAgICBsZXQgZXhpc3RpbmdJbXBvcnQ6IHRzLkltcG9ydERlY2xhcmF0aW9ufG51bGwgPSBudWxsO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgZ2l2ZW4gaW1wb3J0IGhhcyBiZWVuIGFscmVhZHkgZ2VuZXJhdGVkIHByZXZpb3VzbHksIHdlIGp1c3QgcmV0dXJuXG4gICAgLy8gdGhlIHByZXZpb3VzIGdlbmVyYXRlZCBpZGVudGlmaWVyIGluIG9yZGVyIHRvIGF2b2lkIGR1cGxpY2F0ZSBnZW5lcmF0ZWQgaW1wb3J0cy5cbiAgICBjb25zdCBjYWNoZWRJbXBvcnQgPSB0aGlzLmltcG9ydENhY2hlLmZpbmQoXG4gICAgICAgIGMgPT4gYy5zb3VyY2VGaWxlID09PSBzb3VyY2VGaWxlICYmIGMuc3ltYm9sTmFtZSA9PT0gc3ltYm9sTmFtZSAmJlxuICAgICAgICAgICAgYy5tb2R1bGVOYW1lID09PSBtb2R1bGVOYW1lKTtcbiAgICBpZiAoY2FjaGVkSW1wb3J0KSB7XG4gICAgICByZXR1cm4gY2FjaGVkSW1wb3J0LmlkZW50aWZpZXI7XG4gICAgfVxuXG4gICAgLy8gV2FsayB0aHJvdWdoIGFsbCBzb3VyY2UtZmlsZSB0b3AtbGV2ZWwgc3RhdGVtZW50cyBhbmQgc2VhcmNoIGZvciBpbXBvcnQgZGVjbGFyYXRpb25zXG4gICAgLy8gdGhhdCBhbHJlYWR5IG1hdGNoIHRoZSBzcGVjaWZpZWQgXCJtb2R1bGVOYW1lXCIgYW5kIGNhbiBiZSB1cGRhdGVkIHRvIGltcG9ydCB0aGVcbiAgICAvLyBnaXZlbiBzeW1ib2wuIElmIG5vIG1hdGNoaW5nIGltcG9ydCBjYW4gYmUgZm91bmQsIHRoZSBsYXN0IGltcG9ydCBpbiB0aGUgc291cmNlLWZpbGVcbiAgICAvLyB3aWxsIGJlIHVzZWQgYXMgc3RhcnRpbmcgcG9pbnQgZm9yIGEgbmV3IGltcG9ydCB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkLlxuICAgIGZvciAobGV0IGkgPSBzb3VyY2VGaWxlLnN0YXRlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHNvdXJjZUZpbGUuc3RhdGVtZW50c1tpXTtcblxuICAgICAgaWYgKCF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKHN0YXRlbWVudCkgfHwgIXRzLmlzU3RyaW5nTGl0ZXJhbChzdGF0ZW1lbnQubW9kdWxlU3BlY2lmaWVyKSB8fFxuICAgICAgICAgICFzdGF0ZW1lbnQuaW1wb3J0Q2xhdXNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1wb3J0U3RhcnRJbmRleCA9PT0gMCkge1xuICAgICAgICBpbXBvcnRTdGFydEluZGV4ID0gdGhpcy5fZ2V0RW5kUG9zaXRpb25PZk5vZGUoc3RhdGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kdWxlU3BlY2lmaWVyID0gc3RhdGVtZW50Lm1vZHVsZVNwZWNpZmllci50ZXh0O1xuXG4gICAgICBpZiAobW9kdWxlU3BlY2lmaWVyLnN0YXJ0c1dpdGgoJy4nKSAmJlxuICAgICAgICAgICAgICByZXNvbHZlKHNvdXJjZURpciwgbW9kdWxlU3BlY2lmaWVyKSAhPT0gcmVzb2x2ZShzb3VyY2VEaXIsIG1vZHVsZU5hbWUpIHx8XG4gICAgICAgICAgbW9kdWxlU3BlY2lmaWVyICE9PSBtb2R1bGVOYW1lKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGVtZW50LmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBzdGF0ZW1lbnQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3M7XG5cbiAgICAgICAgLy8gSW4gY2FzZSBhIFwiVHlwZVwiIHN5bWJvbCBpcyBpbXBvcnRlZCwgd2UgY2FuJ3QgdXNlIG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlc2Ugb25seSBleHBvcnQgc3ltYm9scyBhdmFpbGFibGUgYXQgcnVudGltZSAobm8gdHlwZXMpXG4gICAgICAgIGlmICh0cy5pc05hbWVzcGFjZUltcG9ydChuYW1lZEJpbmRpbmdzKSAmJiAhdHlwZUltcG9ydCkge1xuICAgICAgICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhcbiAgICAgICAgICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lZEJpbmRpbmdzLm5hbWUudGV4dCksXG4gICAgICAgICAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3ltYm9sTmFtZSB8fCAnZGVmYXVsdCcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc05hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzKSAmJiBzeW1ib2xOYW1lKSB7XG4gICAgICAgICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gbmFtZWRCaW5kaW5ncy5lbGVtZW50cy5maW5kKFxuICAgICAgICAgICAgICBlID0+XG4gICAgICAgICAgICAgICAgICBlLnByb3BlcnR5TmFtZSA/IGUucHJvcGVydHlOYW1lLnRleHQgPT09IHN5bWJvbE5hbWUgOiBlLm5hbWUudGV4dCA9PT0gc3ltYm9sTmFtZSk7XG5cbiAgICAgICAgICBpZiAoZXhpc3RpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihleGlzdGluZ0VsZW1lbnQubmFtZS50ZXh0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBzeW1ib2wgY291bGQgbm90IGJlIGZvdW5kIGluIGFuIGV4aXN0aW5nIGltcG9ydCwgd2VcbiAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gYXMgaXQgY2FuIGJlIHVwZGF0ZWQgdG8gaW5jbHVkZVxuICAgICAgICAgIC8vIHRoZSBzcGVjaWZpZWQgc3ltYm9sIG5hbWUgd2l0aG91dCBoYXZpbmcgdG8gY3JlYXRlIGEgbmV3IGltcG9ydC5cbiAgICAgICAgICBleGlzdGluZ0ltcG9ydCA9IHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZW1lbnQuaW1wb3J0Q2xhdXNlLm5hbWUgJiYgIXN5bWJvbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoc3RhdGVtZW50LmltcG9ydENsYXVzZS5uYW1lLnRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleGlzdGluZ0ltcG9ydCkge1xuICAgICAgY29uc3QgcHJvcGVydHlJZGVudGlmaWVyID0gdHMuY3JlYXRlSWRlbnRpZmllcihzeW1ib2xOYW1lISk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyID0gdGhpcy5fZ2V0VW5pcXVlSWRlbnRpZmllcihzb3VyY2VGaWxlLCBzeW1ib2xOYW1lISk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgLy8gU2luY2UgaXQgY2FuIGhhcHBlbiB0aGF0IG11bHRpcGxlIGNsYXNzZXMgbmVlZCB0byBiZSBpbXBvcnRlZCB3aXRoaW4gdGhlXG4gICAgICAvLyBzcGVjaWZpZWQgc291cmNlIGZpbGUgYW5kIHdlIHdhbnQgdG8gYWRkIHRoZSBpZGVudGlmaWVycyB0byB0aGUgZXhpc3RpbmdcbiAgICAgIC8vIGltcG9ydCBkZWNsYXJhdGlvbiwgd2UgbmVlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSB1cGRhdGVkIGltcG9ydCBkZWNsYXJhdGlvbnMuXG4gICAgICAvLyBXZSBjYW4ndCBkaXJlY3RseSB1cGRhdGUgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBmb3IgZWFjaCBpZGVudGlmaWVyIGFzIHRoaXNcbiAgICAgIC8vIHdvdWxkIHRocm93IG9mZiB0aGUgcmVjb3JkZXIgb2Zmc2V0cy4gV2UgbmVlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBuZXcgaWRlbnRpZmllcnNcbiAgICAgIC8vIGZvciB0aGUgaW1wb3J0IGFuZCBwZXJmb3JtIHRoZSBpbXBvcnQgdHJhbnNmb3JtYXRpb24gYXMgYmF0Y2hlcyBwZXIgc291cmNlLWZpbGUuXG4gICAgICB0aGlzLnVwZGF0ZWRJbXBvcnRzLnNldChcbiAgICAgICAgICBleGlzdGluZ0ltcG9ydCwgKHRoaXMudXBkYXRlZEltcG9ydHMuZ2V0KGV4aXN0aW5nSW1wb3J0KSB8fCBbXSkuY29uY2F0KHtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaW1wb3J0TmFtZTogaW1wb3J0TmFtZSxcbiAgICAgICAgICB9KSk7XG5cbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgYWxsIHVwZGF0ZWQgaW1wb3J0cyBzbyB0aGF0IHdlIGRvbid0IGdlbmVyYXRlIGR1cGxpY2F0ZVxuICAgICAgLy8gc2ltaWxhciBpbXBvcnRzIGFzIHRoZXNlIGNhbid0IGJlIHN0YXRpY2FsbHkgYW5hbHl6ZWQgaW4gdGhlIHNvdXJjZS1maWxlIHlldC5cbiAgICAgIHRoaXMuaW1wb3J0Q2FjaGUucHVzaCh7c291cmNlRmlsZSwgbW9kdWxlTmFtZSwgc3ltYm9sTmFtZSwgaWRlbnRpZmllcjogaW1wb3J0TmFtZX0pO1xuXG4gICAgICByZXR1cm4gaW1wb3J0TmFtZTtcbiAgICB9XG5cbiAgICBsZXQgaWRlbnRpZmllcjogdHMuSWRlbnRpZmllcnxudWxsID0gbnVsbDtcbiAgICBsZXQgbmV3SW1wb3J0OiB0cy5JbXBvcnREZWNsYXJhdGlvbnxudWxsID0gbnVsbDtcblxuICAgIGlmIChzeW1ib2xOYW1lKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eUlkZW50aWZpZXIgPSB0cy5jcmVhdGVJZGVudGlmaWVyKHN5bWJvbE5hbWUpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoc291cmNlRmlsZSwgc3ltYm9sTmFtZSk7XG4gICAgICBjb25zdCBuZWVkc0dlbmVyYXRlZFVuaXF1ZU5hbWUgPSBnZW5lcmF0ZWRVbmlxdWVJZGVudGlmaWVyLnRleHQgIT09IHN5bWJvbE5hbWU7XG4gICAgICBpZGVudGlmaWVyID0gbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gZ2VuZXJhdGVkVW5pcXVlSWRlbnRpZmllciA6IHByb3BlcnR5SWRlbnRpZmllcjtcblxuICAgICAgbmV3SW1wb3J0ID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsXG4gICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbY3JlYXRlSW1wb3J0U3BlY2lmaWVyKFxuICAgICAgICAgICAgICAgICAgbmVlZHNHZW5lcmF0ZWRVbmlxdWVOYW1lID8gcHJvcGVydHlJZGVudGlmaWVyIDogdW5kZWZpbmVkLCBpZGVudGlmaWVyKV0pKSxcbiAgICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRlbnRpZmllciA9IHRoaXMuX2dldFVuaXF1ZUlkZW50aWZpZXIoc291cmNlRmlsZSwgJ2RlZmF1bHRFeHBvcnQnKTtcbiAgICAgIG5ld0ltcG9ydCA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJbXBvcnRDbGF1c2UoaWRlbnRpZmllciwgdW5kZWZpbmVkKSxcbiAgICAgICAgICB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdJbXBvcnRUZXh0ID0gdGhpcy5wcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbmV3SW1wb3J0LCBzb3VyY2VGaWxlKTtcbiAgICAvLyBJZiB0aGUgaW1wb3J0IGlzIGdlbmVyYXRlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIHNvdXJjZSBmaWxlLCB3ZSB3YW50IHRvIGFkZFxuICAgIC8vIGEgbmV3LWxpbmUgYWZ0ZXIgdGhlIGltcG9ydC4gT3RoZXJ3aXNlIGlmIHRoZSBpbXBvcnQgaXMgZ2VuZXJhdGVkIGFmdGVyIGFuXG4gICAgLy8gZXhpc3RpbmcgaW1wb3J0LCB3ZSBuZWVkIHRvIHByZXBlbmQgYSBuZXctbGluZSBzbyB0aGF0IHRoZSBpbXBvcnQgaXMgbm90IG9uXG4gICAgLy8gdGhlIHNhbWUgbGluZSBhcyB0aGUgZXhpc3RpbmcgaW1wb3J0IGFuY2hvci5cbiAgICB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUpXG4gICAgICAgIC5hZGROZXdJbXBvcnQoXG4gICAgICAgICAgICBpbXBvcnRTdGFydEluZGV4LCBpbXBvcnRTdGFydEluZGV4ID09PSAwID8gYCR7bmV3SW1wb3J0VGV4dH1cXG5gIDogYFxcbiR7bmV3SW1wb3J0VGV4dH1gKTtcblxuICAgIC8vIEtlZXAgdHJhY2sgb2YgYWxsIGdlbmVyYXRlZCBpbXBvcnRzIHNvIHRoYXQgd2UgZG9uJ3QgZ2VuZXJhdGUgZHVwbGljYXRlXG4gICAgLy8gc2ltaWxhciBpbXBvcnRzIGFzIHRoZXNlIGNhbid0IGJlIHN0YXRpY2FsbHkgYW5hbHl6ZWQgaW4gdGhlIHNvdXJjZS1maWxlIHlldC5cbiAgICB0aGlzLmltcG9ydENhY2hlLnB1c2goe3NvdXJjZUZpbGUsIHN5bWJvbE5hbWUsIG1vZHVsZU5hbWUsIGlkZW50aWZpZXJ9KTtcblxuICAgIHJldHVybiBpZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlcyB0aGUgY29sbGVjdGVkIGltcG9ydCBjaGFuZ2VzIHdpdGhpbiB0aGUgYXBwcm9wcmlhdGUgdXBkYXRlIHJlY29yZGVycy4gVGhlXG4gICAqIHVwZGF0ZWQgaW1wb3J0cyBjYW4gb25seSBiZSB1cGRhdGVkICpvbmNlKiBwZXIgc291cmNlLWZpbGUgYmVjYXVzZSBwcmV2aW91cyB1cGRhdGVzXG4gICAqIGNvdWxkIG90aGVyd2lzZSBzaGlmdCB0aGUgc291cmNlLWZpbGUgb2Zmc2V0cy5cbiAgICovXG4gIHJlY29yZENoYW5nZXMoKSB7XG4gICAgdGhpcy51cGRhdGVkSW1wb3J0cy5mb3JFYWNoKChleHByZXNzaW9ucywgaW1wb3J0RGVjbCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IGltcG9ydERlY2wuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKHNvdXJjZUZpbGUpO1xuICAgICAgY29uc3QgbmFtZWRCaW5kaW5ncyA9IGltcG9ydERlY2wuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzIGFzIHRzLk5hbWVkSW1wb3J0cztcbiAgICAgIGNvbnN0IG5ld05hbWVkQmluZGluZ3MgPSB0cy51cGRhdGVOYW1lZEltcG9ydHMoXG4gICAgICAgICAgbmFtZWRCaW5kaW5ncyxcbiAgICAgICAgICBuYW1lZEJpbmRpbmdzLmVsZW1lbnRzLmNvbmNhdChleHByZXNzaW9ucy5tYXAoXG4gICAgICAgICAgICAgICh7cHJvcGVydHlOYW1lLCBpbXBvcnROYW1lfSkgPT4gY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHByb3BlcnR5TmFtZSwgaW1wb3J0TmFtZSkpKSk7XG5cbiAgICAgIGNvbnN0IG5ld05hbWVkQmluZGluZ3NUZXh0ID1cbiAgICAgICAgICB0aGlzLnByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBuZXdOYW1lZEJpbmRpbmdzLCBzb3VyY2VGaWxlKTtcbiAgICAgIHJlY29yZGVyLnVwZGF0ZUV4aXN0aW5nSW1wb3J0KG5hbWVkQmluZGluZ3MsIG5ld05hbWVkQmluZGluZ3NUZXh0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIHVuaXF1ZSBpZGVudGlmaWVyIHdpdGggYSBiYXNlIG5hbWUgZm9yIHRoZSBnaXZlbiBzb3VyY2UgZmlsZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0VW5pcXVlSWRlbnRpZmllcihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBiYXNlTmFtZTogc3RyaW5nKTogdHMuSWRlbnRpZmllciB7XG4gICAgaWYgKHRoaXMuaXNVbmlxdWVJZGVudGlmaWVyTmFtZShzb3VyY2VGaWxlLCBiYXNlTmFtZSkpIHtcbiAgICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIGJhc2VOYW1lKTtcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKGJhc2VOYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgbmFtZSA9IG51bGw7XG4gICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgIGRvIHtcbiAgICAgIG5hbWUgPSBgJHtiYXNlTmFtZX1fJHtjb3VudGVyKyt9YDtcbiAgICB9IHdoaWxlICghdGhpcy5pc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGUsIG5hbWUpKTtcblxuICAgIHRoaXMuX3JlY29yZFVzZWRJZGVudGlmaWVyKHNvdXJjZUZpbGUsIG5hbWUhKTtcbiAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lISk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyIG5hbWUgaXMgdXNlZCB3aXRoaW4gdGhlIGdpdmVuXG4gICAqIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBpc1VuaXF1ZUlkZW50aWZpZXJOYW1lKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnVzZWRJZGVudGlmaWVyTmFtZXMuaGFzKHNvdXJjZUZpbGUpICYmXG4gICAgICAgIHRoaXMudXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkhLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gV2FsayB0aHJvdWdoIHRoZSBzb3VyY2UgZmlsZSBhbmQgc2VhcmNoIGZvciBhbiBpZGVudGlmaWVyIG1hdGNoaW5nXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUuIEluIHRoYXQgY2FzZSwgaXQncyBub3QgZ3VhcmFudGVlZCB0aGF0IHRoaXMgbmFtZVxuICAgIC8vIGlzIHVuaXF1ZSBpbiB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24gc2NvcGUgYW5kIHdlIGp1c3QgcmV0dXJuIGZhbHNlLlxuICAgIGNvbnN0IG5vZGVRdWV1ZTogdHMuTm9kZVtdID0gW3NvdXJjZUZpbGVdO1xuICAgIHdoaWxlIChub2RlUXVldWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZVF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbm9kZVF1ZXVlLnB1c2goLi4ubm9kZS5nZXRDaGlsZHJlbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIF9yZWNvcmRVc2VkSWRlbnRpZmllcihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBpZGVudGlmaWVyTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy51c2VkSWRlbnRpZmllck5hbWVzLnNldChcbiAgICAgICAgc291cmNlRmlsZSwgKHRoaXMudXNlZElkZW50aWZpZXJOYW1lcy5nZXQoc291cmNlRmlsZSkgfHwgW10pLmNvbmNhdChpZGVudGlmaWVyTmFtZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGZ1bGwgZW5kIG9mIGEgZ2l2ZW4gbm9kZS4gQnkgZGVmYXVsdCB0aGUgZW5kIHBvc2l0aW9uIG9mIGEgbm9kZSBpc1xuICAgKiBiZWZvcmUgYWxsIHRyYWlsaW5nIGNvbW1lbnRzLiBUaGlzIGNvdWxkIG1lYW4gdGhhdCBnZW5lcmF0ZWQgaW1wb3J0cyBzaGlmdCBjb21tZW50cy5cbiAgICovXG4gIHByaXZhdGUgX2dldEVuZFBvc2l0aW9uT2ZOb2RlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBjb25zdCBub2RlRW5kUG9zID0gbm9kZS5nZXRFbmQoKTtcbiAgICBjb25zdCBjb21tZW50UmFuZ2VzID0gdHMuZ2V0VHJhaWxpbmdDb21tZW50UmFuZ2VzKG5vZGUuZ2V0U291cmNlRmlsZSgpLnRleHQsIG5vZGVFbmRQb3MpO1xuICAgIGlmICghY29tbWVudFJhbmdlcyB8fCAhY29tbWVudFJhbmdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBub2RlRW5kUG9zO1xuICAgIH1cbiAgICByZXR1cm4gY29tbWVudFJhbmdlc1tjb21tZW50UmFuZ2VzLmxlbmd0aCAtIDFdIS5lbmQ7XG4gIH1cbn1cblxuXG4vKipcbiAqIEJhY2t3YXJkcy1jb21wYXRpYmxlIHZlcnNpb24gb2YgYHRzLmNyZWF0ZUltcG9ydFNwZWNpZmllcmBcbiAqIHRvIGhhbmRsZSBhIGJyZWFraW5nIGNoYW5nZSBiZXR3ZWVuIDQuNCBhbmQgNC41LlxuICovXG5mdW5jdGlvbiBjcmVhdGVJbXBvcnRTcGVjaWZpZXIoXG4gICAgcHJvcGVydHlOYW1lOiB0cy5JZGVudGlmaWVyfHVuZGVmaW5lZCwgbmFtZTogdHMuSWRlbnRpZmllcixcbiAgICBpc1R5cGVPbmx5ID0gZmFsc2UpOiB0cy5JbXBvcnRTcGVjaWZpZXIge1xuICByZXR1cm4gUEFSU0VEX1RTX1ZFUlNJT04gPiA0LjQgPyB0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIoaXNUeXBlT25seSwgcHJvcGVydHlOYW1lLCBuYW1lKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBsYXllciBmb3IgVFMgNC40LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgYmUgY2xlYW5lZCB1cCB3aGVuIHdlIGRyb3Agc3VwcG9ydCBmb3IgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIgYXMgYW55KShwcm9wZXJ0eU5hbWUsIG5hbWUpO1xufVxuIl19