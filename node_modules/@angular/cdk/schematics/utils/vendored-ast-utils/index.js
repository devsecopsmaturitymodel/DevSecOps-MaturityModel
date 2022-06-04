"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppModulePath = exports.findBootstrapModulePath = exports.findBootstrapModuleCall = exports.addExportToModule = exports.addImportToModule = exports.addDeclarationToModule = exports.addSymbolToNgModuleMetadata = exports.getMetadataField = exports.getDecoratorMetadata = exports.insertAfterLastOccurrence = exports.findNode = exports.getSourceNodes = exports.findNodes = exports.insertImport = void 0;
// tslint:disable
/*
 * Note: This file contains vendored TypeScript AST utils from "@schematics/angular".
 * Since there is no canonical place for common utils, and we don't want to use the AST
 * utils directly from "@schematics/angular" to avoid TypeScript version mismatches, we
 * copy the needed AST utils until there is a general place for such utility functions.
 *
 * Taken from:
 *   (1) https://github.com/angular/angular-cli/blob/30df1470a0f18989db336d50b55a79021ab64c85/packages/schematics/angular/utility/ng-ast-utils.ts
 *   (2) https://github.com/angular/angular-cli/blob/30df1470a0f18989db336d50b55a79021ab64c85/packages/schematics/angular/utility/ast-utils.ts
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const change_1 = require("@schematics/angular/utility/change");
const path_1 = require("path");
const ts = require("typescript");
/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add import to)
 * @param symbolName (item to import)
 * @param fileName (path to the file)
 * @param isDefault (if true, import follows style for importing default exports)
 * @return Change
 */
function insertImport(source, fileToEdit, symbolName, fileName, isDefault = false) {
    const rootNode = source;
    const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
    // get nodes that map to import statements from the file fileName
    const relevantImports = allImports.filter(node => {
        // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
        const importFiles = node
            .getChildren()
            .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
            .map(n => n.text);
        return importFiles.filter(file => file === fileName).length === 1;
    });
    if (relevantImports.length > 0) {
        let importsAsterisk = false;
        // imports from import file
        const imports = [];
        relevantImports.forEach(n => {
            Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
            if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk = true;
            }
        });
        // if imports * from fileName, don't add symbolName
        if (importsAsterisk) {
            return new change_1.NoopChange();
        }
        const importTextNodes = imports.filter(n => n.text === symbolName);
        // insert import if it's not there
        if (importTextNodes.length === 0) {
            const fallbackPos = findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();
            return insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
        }
        return new change_1.NoopChange();
    }
    // no such import declaration exists
    const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral).filter(n => n.text === 'use strict');
    let fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
    const separator = insertAtBeginning ? '' : ';\n';
    const toInsert = `${separator}import ${open}${symbolName}${close}` +
        ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;
    return insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos, ts.SyntaxKind.StringLiteral);
}
exports.insertImport = insertImport;
/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes of kind, or [] if none is found
 */
function findNodes(node, kind, max = Infinity, recursive = false) {
    if (!node || max == 0) {
        return [];
    }
    const arr = [];
    if (node.kind === kind) {
        arr.push(node);
        max--;
    }
    if (max > 0 && (recursive || node.kind !== kind)) {
        for (const child of node.getChildren()) {
            findNodes(child, kind, max).forEach(node => {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });
            if (max <= 0) {
                break;
            }
        }
    }
    return arr;
}
exports.findNodes = findNodes;
/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
function getSourceNodes(sourceFile) {
    const nodes = [sourceFile];
    const result = [];
    while (nodes.length > 0) {
        const node = nodes.shift();
        if (node) {
            result.push(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift(...node.getChildren());
            }
        }
    }
    return result;
}
exports.getSourceNodes = getSourceNodes;
function findNode(node, kind, text) {
    if (node.kind === kind && node.getText() === text) {
        // throw new Error(node.getText());
        return node;
    }
    let foundNode = null;
    ts.forEachChild(node, childNode => {
        foundNode = foundNode || findNode(childNode, kind, text);
    });
    return foundNode;
}
exports.findNode = findNode;
/**
 * Helper for sorting nodes.
 * @return function to sort nodes in increasing order of position in sourceFile
 */
function nodesByPosition(first, second) {
    return first.getStart() - second.getStart();
}
/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
function insertAfterLastOccurrence(nodes, toInsert, file, fallbackPos, syntaxKind) {
    let lastItem;
    for (const node of nodes) {
        if (!lastItem || lastItem.getStart() < node.getStart()) {
            lastItem = node;
        }
    }
    if (syntaxKind && lastItem) {
        lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
    }
    if (!lastItem && fallbackPos == undefined) {
        throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`);
    }
    const lastItemPosition = lastItem ? lastItem.getEnd() : fallbackPos;
    return new change_1.InsertChange(file, lastItemPosition, toInsert);
}
exports.insertAfterLastOccurrence = insertAfterLastOccurrence;
function _angularImportsFromNode(node, _sourceFile) {
    const ms = node.moduleSpecifier;
    let modulePath;
    switch (ms.kind) {
        case ts.SyntaxKind.StringLiteral:
            modulePath = ms.text;
            break;
        default:
            return {};
    }
    if (!modulePath.startsWith('@angular/')) {
        return {};
    }
    if (node.importClause) {
        if (node.importClause.name) {
            // This is of the form `import Name from 'path'`. Ignore.
            return {};
        }
        else if (node.importClause.namedBindings) {
            const nb = node.importClause.namedBindings;
            if (nb.kind == ts.SyntaxKind.NamespaceImport) {
                // This is of the form `import * as name from 'path'`. Return `name.`.
                return {
                    [nb.name.text + '.']: modulePath,
                };
            }
            else {
                // This is of the form `import {a,b,c} from 'path'`
                const namedImports = nb;
                return namedImports.elements
                    .map((is) => (is.propertyName ? is.propertyName.text : is.name.text))
                    .reduce((acc, curr) => {
                    acc[curr] = modulePath;
                    return acc;
                }, {});
            }
        }
        return {};
    }
    else {
        // This is of the form `import 'path';`. Nothing to do.
        return {};
    }
}
function getDecoratorMetadata(source, identifier, module) {
    const angularImports = findNodes(source, ts.SyntaxKind.ImportDeclaration)
        .map(node => _angularImportsFromNode(node, source))
        .reduce((acc, current) => {
        for (const key of Object.keys(current)) {
            acc[key] = current[key];
        }
        return acc;
    }, {});
    return getSourceNodes(source)
        .filter(node => {
        return (node.kind == ts.SyntaxKind.Decorator &&
            node.expression.kind == ts.SyntaxKind.CallExpression);
    })
        .map(node => node.expression)
        .filter(expr => {
        if (expr.expression.kind == ts.SyntaxKind.Identifier) {
            const id = expr.expression;
            return id.text == identifier && angularImports[id.text] === module;
        }
        else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
            // This covers foo.NgModule when importing * as foo.
            const paExpr = expr.expression;
            // If the left expression is not an identifier, just give up at that point.
            if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            const id = paExpr.name.text;
            const moduleId = paExpr.expression.text;
            return id === identifier && angularImports[moduleId + '.'] === module;
        }
        return false;
    })
        .filter(expr => expr.arguments[0] && expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression)
        .map(expr => expr.arguments[0]);
}
exports.getDecoratorMetadata = getDecoratorMetadata;
function getMetadataField(node, metadataField) {
    return (node.properties
        .filter(prop => ts.isPropertyAssignment(prop))
        // Filter out every fields that's not "metadataField". Also handles string literals
        // (but not expressions).
        .filter(node => {
        const name = node.name;
        return ((ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.getText() === metadataField);
    }));
}
exports.getMetadataField = getMetadataField;
function addSymbolToNgModuleMetadata(source, ngModulePath, metadataField, symbolName, importPath = null) {
    const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    let node = nodes[0]; // tslint:disable-line:no-any
    // Find the decorator declaration.
    if (!node) {
        return [];
    }
    // Get all the children property assignment of object literals.
    const matchingProperties = getMetadataField(node, metadataField);
    // Get the last node of the array literal.
    if (!matchingProperties) {
        return [];
    }
    if (matchingProperties.length == 0) {
        // We haven't found the field in the metadata declaration. Insert a new field.
        const expr = node;
        let position;
        let toInsert;
        if (expr.properties.length == 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${metadataField}: [${symbolName}]\n`;
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd();
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n\s*/);
            if (matches && matches.length > 0) {
                toInsert = `,${matches[0]}${metadataField}: [${symbolName}]`;
            }
            else {
                toInsert = `, ${metadataField}: [${symbolName}]`;
            }
        }
        if (importPath !== null) {
            return [
                new change_1.InsertChange(ngModulePath, position, toInsert),
                insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
            ];
        }
        else {
            return [new change_1.InsertChange(ngModulePath, position, toInsert)];
        }
    }
    const assignment = matchingProperties[0];
    // If it's not an array, nothing we can do really.
    if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return [];
    }
    const arrLiteral = assignment.initializer;
    if (arrLiteral.elements.length == 0) {
        // Forward the property.
        node = arrLiteral;
    }
    else {
        node = arrLiteral.elements;
    }
    if (!node) {
        // tslint:disable-next-line: no-console
        console.error('No app module found. Please add your new class to your component.');
        return [];
    }
    if (Array.isArray(node)) {
        const nodeArray = node;
        const symbolsArray = nodeArray.map(node => node.getText());
        if (symbolsArray.includes(symbolName)) {
            return [];
        }
        node = node[node.length - 1];
    }
    let toInsert;
    let position = node.getEnd();
    if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
        // We haven't found the field in the metadata declaration. Insert a new
        // field.
        const expr = node;
        if (expr.properties.length == 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${symbolName}\n`;
        }
        else {
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            if (text.match(/^\r?\r?\n/)) {
                toInsert = `,${text.match(/^\r?\n\s*/)[0]}${symbolName}`;
            }
            else {
                toInsert = `, ${symbolName}`;
            }
        }
    }
    else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
        // We found the field but it's empty. Insert it just before the `]`.
        position--;
        toInsert = `${symbolName}`;
    }
    else {
        // Get the indentation of the last element, if any.
        const text = node.getFullText(source);
        if (text.match(/^\r?\n/)) {
            toInsert = `,${text.match(/^\r?\n(\r?)\s*/)[0]}${symbolName}`;
        }
        else {
            toInsert = `, ${symbolName}`;
        }
    }
    if (importPath !== null) {
        return [
            new change_1.InsertChange(ngModulePath, position, toInsert),
            insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
        ];
    }
    return [new change_1.InsertChange(ngModulePath, position, toInsert)];
}
exports.addSymbolToNgModuleMetadata = addSymbolToNgModuleMetadata;
/**
 * Custom function to insert a declaration (component, pipe, directive)
 * into NgModule declarations. It also imports the component.
 */
function addDeclarationToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'declarations', classifiedName, importPath);
}
exports.addDeclarationToModule = addDeclarationToModule;
/**
 * Custom function to insert an NgModule into NgModule imports. It also imports the module.
 */
function addImportToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'imports', classifiedName, importPath);
}
exports.addImportToModule = addImportToModule;
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
function addExportToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'exports', classifiedName, importPath);
}
exports.addExportToModule = addExportToModule;
function findBootstrapModuleCall(host, mainPath) {
    const mainBuffer = host.read(mainPath);
    if (!mainBuffer) {
        throw new schematics_1.SchematicsException(`Main file (${mainPath}) not found`);
    }
    const mainText = mainBuffer.toString('utf-8');
    const source = ts.createSourceFile(mainPath, mainText, ts.ScriptTarget.Latest, true);
    const allNodes = getSourceNodes(source);
    let bootstrapCall = null;
    for (const node of allNodes) {
        let bootstrapCallNode = null;
        bootstrapCallNode = findNode(node, ts.SyntaxKind.Identifier, 'bootstrapModule');
        // Walk up the parent until CallExpression is found.
        while (bootstrapCallNode &&
            bootstrapCallNode.parent &&
            bootstrapCallNode.parent.kind !== ts.SyntaxKind.CallExpression) {
            bootstrapCallNode = bootstrapCallNode.parent;
        }
        if (bootstrapCallNode !== null &&
            bootstrapCallNode.parent !== undefined &&
            bootstrapCallNode.parent.kind === ts.SyntaxKind.CallExpression) {
            bootstrapCall = bootstrapCallNode.parent;
            break;
        }
    }
    return bootstrapCall;
}
exports.findBootstrapModuleCall = findBootstrapModuleCall;
function findBootstrapModulePath(host, mainPath) {
    const bootstrapCall = findBootstrapModuleCall(host, mainPath);
    if (!bootstrapCall) {
        throw new schematics_1.SchematicsException('Bootstrap call not found');
    }
    const bootstrapModule = bootstrapCall.arguments[0];
    const mainBuffer = host.read(mainPath);
    if (!mainBuffer) {
        throw new schematics_1.SchematicsException(`Client app main file (${mainPath}) not found`);
    }
    const mainText = mainBuffer.toString('utf-8');
    const source = ts.createSourceFile(mainPath, mainText, ts.ScriptTarget.Latest, true);
    const allNodes = getSourceNodes(source);
    const bootstrapModuleRelativePath = allNodes
        .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
        .filter(imp => {
        return findNode(imp, ts.SyntaxKind.Identifier, bootstrapModule.getText());
    })
        .map(node => {
        const modulePath = node.moduleSpecifier;
        return modulePath.text;
    })[0];
    return bootstrapModuleRelativePath;
}
exports.findBootstrapModulePath = findBootstrapModulePath;
function getAppModulePath(host, mainPath) {
    const moduleRelativePath = findBootstrapModulePath(host, mainPath);
    const mainDir = (0, path_1.dirname)(mainPath);
    const modulePath = (0, core_1.normalize)(`/${mainDir}/${moduleRelativePath}.ts`);
    return modulePath;
}
exports.getAppModulePath = getAppModulePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvdmVuZG9yZWQtYXN0LXV0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlCQUFpQjtBQUVqQjs7Ozs7Ozs7O0dBU0c7QUFFSCwrQ0FBK0M7QUFDL0MsMkRBQXFFO0FBQ3JFLCtEQUFvRjtBQUNwRiwrQkFBNkI7QUFFN0IsaUNBQWlDO0FBRWpDOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsWUFBWSxDQUMxQixNQUFxQixFQUNyQixVQUFrQixFQUNsQixVQUFrQixFQUNsQixRQUFnQixFQUNoQixTQUFTLEdBQUcsS0FBSztJQUVqQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDeEIsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFeEUsaUVBQWlFO0lBQ2pFLE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDL0MscUZBQXFGO1FBQ3JGLE1BQU0sV0FBVyxHQUFHLElBQUk7YUFDckIsV0FBVyxFQUFFO2FBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQzthQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxlQUFlLENBQUMsTUFBTSxH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QyxRQUFRLENBQUMsQ0FBQztJQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFTLEVBQUMsSUFBSSxPQUFPLElBQUksa0JBQWtCLEtBQUssQ0FBQyxDQUFDO0lBRXJFLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFORCw0Q0FNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZVxuXG4vKlxuICogTm90ZTogVGhpcyBmaWxlIGNvbnRhaW5zIHZlbmRvcmVkIFR5cGVTY3JpcHQgQVNUIHV0aWxzIGZyb20gXCJAc2NoZW1hdGljcy9hbmd1bGFyXCIuXG4gKiBTaW5jZSB0aGVyZSBpcyBubyBjYW5vbmljYWwgcGxhY2UgZm9yIGNvbW1vbiB1dGlscywgYW5kIHdlIGRvbid0IHdhbnQgdG8gdXNlIHRoZSBBU1RcbiAqIHV0aWxzIGRpcmVjdGx5IGZyb20gXCJAc2NoZW1hdGljcy9hbmd1bGFyXCIgdG8gYXZvaWQgVHlwZVNjcmlwdCB2ZXJzaW9uIG1pc21hdGNoZXMsIHdlXG4gKiBjb3B5IHRoZSBuZWVkZWQgQVNUIHV0aWxzIHVudGlsIHRoZXJlIGlzIGEgZ2VuZXJhbCBwbGFjZSBmb3Igc3VjaCB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqXG4gKiBUYWtlbiBmcm9tOlxuICogICAoMSkgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci1jbGkvYmxvYi8zMGRmMTQ3MGEwZjE4OTg5ZGIzMzZkNTBiNTVhNzkwMjFhYjY0Yzg1L3BhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L25nLWFzdC11dGlscy50c1xuICogICAoMikgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci1jbGkvYmxvYi8zMGRmMTQ3MGEwZjE4OTg5ZGIzMzZkNTBiNTVhNzkwMjFhYjY0Yzg1L3BhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2FzdC11dGlscy50c1xuICovXG5cbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1NjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Q2hhbmdlLCBJbnNlcnRDaGFuZ2UsIE5vb3BDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtkaXJuYW1lfSBmcm9tICdwYXRoJztcblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogQWRkIEltcG9ydCBgaW1wb3J0IHsgc3ltYm9sTmFtZSB9IGZyb20gZmlsZU5hbWVgIGlmIHRoZSBpbXBvcnQgZG9lc24ndCBleGl0XG4gKiBhbHJlYWR5LiBBc3N1bWVzIGZpbGVUb0VkaXQgY2FuIGJlIHJlc29sdmVkIGFuZCBhY2Nlc3NlZC5cbiAqIEBwYXJhbSBmaWxlVG9FZGl0IChmaWxlIHdlIHdhbnQgdG8gYWRkIGltcG9ydCB0bylcbiAqIEBwYXJhbSBzeW1ib2xOYW1lIChpdGVtIHRvIGltcG9ydClcbiAqIEBwYXJhbSBmaWxlTmFtZSAocGF0aCB0byB0aGUgZmlsZSlcbiAqIEBwYXJhbSBpc0RlZmF1bHQgKGlmIHRydWUsIGltcG9ydCBmb2xsb3dzIHN0eWxlIGZvciBpbXBvcnRpbmcgZGVmYXVsdCBleHBvcnRzKVxuICogQHJldHVybiBDaGFuZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEltcG9ydChcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBmaWxlVG9FZGl0OiBzdHJpbmcsXG4gIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgZmlsZU5hbWU6IHN0cmluZyxcbiAgaXNEZWZhdWx0ID0gZmFsc2UsXG4pOiBDaGFuZ2Uge1xuICBjb25zdCByb290Tm9kZSA9IHNvdXJjZTtcbiAgY29uc3QgYWxsSW1wb3J0cyA9IGZpbmROb2Rlcyhyb290Tm9kZSwgdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbik7XG5cbiAgLy8gZ2V0IG5vZGVzIHRoYXQgbWFwIHRvIGltcG9ydCBzdGF0ZW1lbnRzIGZyb20gdGhlIGZpbGUgZmlsZU5hbWVcbiAgY29uc3QgcmVsZXZhbnRJbXBvcnRzID0gYWxsSW1wb3J0cy5maWx0ZXIobm9kZSA9PiB7XG4gICAgLy8gU3RyaW5nTGl0ZXJhbCBvZiB0aGUgSW1wb3J0RGVjbGFyYXRpb24gaXMgdGhlIGltcG9ydCBmaWxlIChmaWxlTmFtZSBpbiB0aGlzIGNhc2UpLlxuICAgIGNvbnN0IGltcG9ydEZpbGVzID0gbm9kZVxuICAgICAgLmdldENoaWxkcmVuKClcbiAgICAgIC5maWx0ZXIoY2hpbGQgPT4gY2hpbGQua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKVxuICAgICAgLm1hcChuID0+IChuIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQpO1xuXG4gICAgcmV0dXJuIGltcG9ydEZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUgPT09IGZpbGVOYW1lKS5sZW5ndGggPT09IDE7XG4gIH0pO1xuXG4gIGlmIChyZWxldmFudEltcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIGxldCBpbXBvcnRzQXN0ZXJpc2sgPSBmYWxzZTtcbiAgICAvLyBpbXBvcnRzIGZyb20gaW1wb3J0IGZpbGVcbiAgICBjb25zdCBpbXBvcnRzOiB0cy5Ob2RlW10gPSBbXTtcbiAgICByZWxldmFudEltcG9ydHMuZm9yRWFjaChuID0+IHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGltcG9ydHMsIGZpbmROb2RlcyhuLCB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpKTtcbiAgICAgIGlmIChmaW5kTm9kZXMobiwgdHMuU3ludGF4S2luZC5Bc3Rlcmlza1Rva2VuKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGltcG9ydHNBc3RlcmlzayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBpZiBpbXBvcnRzICogZnJvbSBmaWxlTmFtZSwgZG9uJ3QgYWRkIHN5bWJvbE5hbWVcbiAgICBpZiAoaW1wb3J0c0FzdGVyaXNrKSB7XG4gICAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRUZXh0Tm9kZXMgPSBpbXBvcnRzLmZpbHRlcihuID0+IChuIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IHN5bWJvbE5hbWUpO1xuXG4gICAgLy8gaW5zZXJ0IGltcG9ydCBpZiBpdCdzIG5vdCB0aGVyZVxuICAgIGlmIChpbXBvcnRUZXh0Tm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBmYWxsYmFja1BvcyA9XG4gICAgICAgIGZpbmROb2RlcyhyZWxldmFudEltcG9ydHNbMF0sIHRzLlN5bnRheEtpbmQuQ2xvc2VCcmFjZVRva2VuKVswXS5nZXRTdGFydCgpIHx8XG4gICAgICAgIGZpbmROb2RlcyhyZWxldmFudEltcG9ydHNbMF0sIHRzLlN5bnRheEtpbmQuRnJvbUtleXdvcmQpWzBdLmdldFN0YXJ0KCk7XG5cbiAgICAgIHJldHVybiBpbnNlcnRBZnRlckxhc3RPY2N1cnJlbmNlKGltcG9ydHMsIGAsICR7c3ltYm9sTmFtZX1gLCBmaWxlVG9FZGl0LCBmYWxsYmFja1Bvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBOb29wQ2hhbmdlKCk7XG4gIH1cblxuICAvLyBubyBzdWNoIGltcG9ydCBkZWNsYXJhdGlvbiBleGlzdHNcbiAgY29uc3QgdXNlU3RyaWN0ID0gZmluZE5vZGVzKHJvb3ROb2RlLCB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpLmZpbHRlcihcbiAgICBuID0+IChuIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQgPT09ICd1c2Ugc3RyaWN0JyxcbiAgKTtcbiAgbGV0IGZhbGxiYWNrUG9zID0gMDtcbiAgaWYgKHVzZVN0cmljdC5sZW5ndGggPiAwKSB7XG4gICAgZmFsbGJhY2tQb3MgPSB1c2VTdHJpY3RbMF0uZW5kO1xuICB9XG4gIGNvbnN0IG9wZW4gPSBpc0RlZmF1bHQgPyAnJyA6ICd7ICc7XG4gIGNvbnN0IGNsb3NlID0gaXNEZWZhdWx0ID8gJycgOiAnIH0nO1xuICAvLyBpZiB0aGVyZSBhcmUgbm8gaW1wb3J0cyBvciAndXNlIHN0cmljdCcgc3RhdGVtZW50LCBpbnNlcnQgaW1wb3J0IGF0IGJlZ2lubmluZyBvZiBmaWxlXG4gIGNvbnN0IGluc2VydEF0QmVnaW5uaW5nID0gYWxsSW1wb3J0cy5sZW5ndGggPT09IDAgJiYgdXNlU3RyaWN0Lmxlbmd0aCA9PT0gMDtcbiAgY29uc3Qgc2VwYXJhdG9yID0gaW5zZXJ0QXRCZWdpbm5pbmcgPyAnJyA6ICc7XFxuJztcbiAgY29uc3QgdG9JbnNlcnQgPVxuICAgIGAke3NlcGFyYXRvcn1pbXBvcnQgJHtvcGVufSR7c3ltYm9sTmFtZX0ke2Nsb3NlfWAgK1xuICAgIGAgZnJvbSAnJHtmaWxlTmFtZX0nJHtpbnNlcnRBdEJlZ2lubmluZyA/ICc7XFxuJyA6ICcnfWA7XG5cbiAgcmV0dXJuIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoXG4gICAgYWxsSW1wb3J0cyxcbiAgICB0b0luc2VydCxcbiAgICBmaWxlVG9FZGl0LFxuICAgIGZhbGxiYWNrUG9zLFxuICAgIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCxcbiAgKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBub2RlcyBmcm9tIHRoZSBBU1QgaW4gdGhlIHN1YnRyZWUgb2Ygbm9kZSBvZiBTeW50YXhLaW5kIGtpbmQuXG4gKiBAcGFyYW0gbm9kZVxuICogQHBhcmFtIGtpbmRcbiAqIEBwYXJhbSBtYXggVGhlIG1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIHRvIHJldHVybi5cbiAqIEBwYXJhbSByZWN1cnNpdmUgQ29udGludWUgbG9va2luZyBmb3Igbm9kZXMgb2Yga2luZCByZWN1cnNpdmUgdW50aWwgZW5kXG4gKiB0aGUgbGFzdCBjaGlsZCBldmVuIHdoZW4gbm9kZSBvZiBraW5kIGhhcyBiZWVuIGZvdW5kLlxuICogQHJldHVybiBhbGwgbm9kZXMgb2Yga2luZCwgb3IgW10gaWYgbm9uZSBpcyBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE5vZGVzKFxuICBub2RlOiB0cy5Ob2RlLFxuICBraW5kOiB0cy5TeW50YXhLaW5kLFxuICBtYXggPSBJbmZpbml0eSxcbiAgcmVjdXJzaXZlID0gZmFsc2UsXG4pOiB0cy5Ob2RlW10ge1xuICBpZiAoIW5vZGUgfHwgbWF4ID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBhcnI6IHRzLk5vZGVbXSA9IFtdO1xuICBpZiAobm9kZS5raW5kID09PSBraW5kKSB7XG4gICAgYXJyLnB1c2gobm9kZSk7XG4gICAgbWF4LS07XG4gIH1cbiAgaWYgKG1heCA+IDAgJiYgKHJlY3Vyc2l2ZSB8fCBub2RlLmtpbmQgIT09IGtpbmQpKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmdldENoaWxkcmVuKCkpIHtcbiAgICAgIGZpbmROb2RlcyhjaGlsZCwga2luZCwgbWF4KS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZiAobWF4ID4gMCkge1xuICAgICAgICAgIGFyci5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIG1heC0tO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChtYXggPD0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJyO1xufVxuXG4vKipcbiAqIEdldCBhbGwgdGhlIG5vZGVzIGZyb20gYSBzb3VyY2UuXG4gKiBAcGFyYW0gc291cmNlRmlsZSBUaGUgc291cmNlIGZpbGUgb2JqZWN0LlxuICogQHJldHVybnMge09ic2VydmFibGU8dHMuTm9kZT59IEFuIG9ic2VydmFibGUgb2YgYWxsIHRoZSBub2RlcyBpbiB0aGUgc291cmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlTm9kZXMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLk5vZGVbXSB7XG4gIGNvbnN0IG5vZGVzOiB0cy5Ob2RlW10gPSBbc291cmNlRmlsZV07XG4gIGNvbnN0IHJlc3VsdDogdHMuTm9kZVtdID0gW107XG5cbiAgd2hpbGUgKG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBub2RlID0gbm9kZXMuc2hpZnQoKTtcblxuICAgIGlmIChub2RlKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICAgIGlmIChub2RlLmdldENoaWxkQ291bnQoc291cmNlRmlsZSkgPj0gMCkge1xuICAgICAgICBub2Rlcy51bnNoaWZ0KC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmROb2RlKG5vZGU6IHRzLk5vZGUsIGtpbmQ6IHRzLlN5bnRheEtpbmQsIHRleHQ6IHN0cmluZyk6IHRzLk5vZGUgfCBudWxsIHtcbiAgaWYgKG5vZGUua2luZCA9PT0ga2luZCAmJiBub2RlLmdldFRleHQoKSA9PT0gdGV4dCkge1xuICAgIC8vIHRocm93IG5ldyBFcnJvcihub2RlLmdldFRleHQoKSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBsZXQgZm91bmROb2RlOiB0cy5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGlsZE5vZGUgPT4ge1xuICAgIGZvdW5kTm9kZSA9IGZvdW5kTm9kZSB8fCBmaW5kTm9kZShjaGlsZE5vZGUsIGtpbmQsIHRleHQpO1xuICB9KTtcblxuICByZXR1cm4gZm91bmROb2RlO1xufVxuXG4vKipcbiAqIEhlbHBlciBmb3Igc29ydGluZyBub2Rlcy5cbiAqIEByZXR1cm4gZnVuY3Rpb24gdG8gc29ydCBub2RlcyBpbiBpbmNyZWFzaW5nIG9yZGVyIG9mIHBvc2l0aW9uIGluIHNvdXJjZUZpbGVcbiAqL1xuZnVuY3Rpb24gbm9kZXNCeVBvc2l0aW9uKGZpcnN0OiB0cy5Ob2RlLCBzZWNvbmQ6IHRzLk5vZGUpOiBudW1iZXIge1xuICByZXR1cm4gZmlyc3QuZ2V0U3RhcnQoKSAtIHNlY29uZC5nZXRTdGFydCgpO1xufVxuXG4vKipcbiAqIEluc2VydCBgdG9JbnNlcnRgIGFmdGVyIHRoZSBsYXN0IG9jY3VyZW5jZSBvZiBgdHMuU3ludGF4S2luZFtub2Rlc1tpXS5raW5kXWBcbiAqIG9yIGFmdGVyIHRoZSBsYXN0IG9mIG9jY3VyZW5jZSBvZiBgc3ludGF4S2luZGAgaWYgdGhlIGxhc3Qgb2NjdXJlbmNlIGlzIGEgc3ViIGNoaWxkXG4gKiBvZiB0cy5TeW50YXhLaW5kW25vZGVzW2ldLmtpbmRdIGFuZCBzYXZlIHRoZSBjaGFuZ2VzIGluIGZpbGUuXG4gKlxuICogQHBhcmFtIG5vZGVzIGluc2VydCBhZnRlciB0aGUgbGFzdCBvY2N1cmVuY2Ugb2Ygbm9kZXNcbiAqIEBwYXJhbSB0b0luc2VydCBzdHJpbmcgdG8gaW5zZXJ0XG4gKiBAcGFyYW0gZmlsZSBmaWxlIHRvIGluc2VydCBjaGFuZ2VzIGludG9cbiAqIEBwYXJhbSBmYWxsYmFja1BvcyBwb3NpdGlvbiB0byBpbnNlcnQgaWYgdG9JbnNlcnQgaGFwcGVucyB0byBiZSB0aGUgZmlyc3Qgb2NjdXJlbmNlXG4gKiBAcGFyYW0gc3ludGF4S2luZCB0aGUgdHMuU3ludGF4S2luZCBvZiB0aGUgc3ViY2hpbGRyZW4gdG8gaW5zZXJ0IGFmdGVyXG4gKiBAcmV0dXJuIENoYW5nZSBpbnN0YW5jZVxuICogQHRocm93IEVycm9yIGlmIHRvSW5zZXJ0IGlzIGZpcnN0IG9jY3VyZW5jZSBidXQgZmFsbCBiYWNrIGlzIG5vdCBzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoXG4gIG5vZGVzOiB0cy5Ob2RlW10sXG4gIHRvSW5zZXJ0OiBzdHJpbmcsXG4gIGZpbGU6IHN0cmluZyxcbiAgZmFsbGJhY2tQb3M6IG51bWJlcixcbiAgc3ludGF4S2luZD86IHRzLlN5bnRheEtpbmQsXG4pOiBDaGFuZ2Uge1xuICBsZXQgbGFzdEl0ZW06IHRzLk5vZGUgfCB1bmRlZmluZWQ7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgIGlmICghbGFzdEl0ZW0gfHwgbGFzdEl0ZW0uZ2V0U3RhcnQoKSA8IG5vZGUuZ2V0U3RhcnQoKSkge1xuICAgICAgbGFzdEl0ZW0gPSBub2RlO1xuICAgIH1cbiAgfVxuICBpZiAoc3ludGF4S2luZCAmJiBsYXN0SXRlbSkge1xuICAgIGxhc3RJdGVtID0gZmluZE5vZGVzKGxhc3RJdGVtLCBzeW50YXhLaW5kKS5zb3J0KG5vZGVzQnlQb3NpdGlvbikucG9wKCk7XG4gIH1cbiAgaWYgKCFsYXN0SXRlbSAmJiBmYWxsYmFja1BvcyA9PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHRyaWVkIHRvIGluc2VydCAke3RvSW5zZXJ0fSBhcyBmaXJzdCBvY2N1cmVuY2Ugd2l0aCBubyBmYWxsYmFjayBwb3NpdGlvbmApO1xuICB9XG4gIGNvbnN0IGxhc3RJdGVtUG9zaXRpb246IG51bWJlciA9IGxhc3RJdGVtID8gbGFzdEl0ZW0uZ2V0RW5kKCkgOiBmYWxsYmFja1BvcztcblxuICByZXR1cm4gbmV3IEluc2VydENoYW5nZShmaWxlLCBsYXN0SXRlbVBvc2l0aW9uLCB0b0luc2VydCk7XG59XG5cbmZ1bmN0aW9uIF9hbmd1bGFySW1wb3J0c0Zyb21Ob2RlKFxuICBub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbixcbiAgX3NvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4pOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30ge1xuICBjb25zdCBtcyA9IG5vZGUubW9kdWxlU3BlY2lmaWVyO1xuICBsZXQgbW9kdWxlUGF0aDogc3RyaW5nO1xuICBzd2l0Y2ggKG1zLmtpbmQpIHtcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbDpcbiAgICAgIG1vZHVsZVBhdGggPSAobXMgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge307XG4gIH1cblxuICBpZiAoIW1vZHVsZVBhdGguc3RhcnRzV2l0aCgnQGFuZ3VsYXIvJykpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBpZiAobm9kZS5pbXBvcnRDbGF1c2UpIHtcbiAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UubmFtZSkge1xuICAgICAgLy8gVGhpcyBpcyBvZiB0aGUgZm9ybSBgaW1wb3J0IE5hbWUgZnJvbSAncGF0aCdgLiBJZ25vcmUuXG4gICAgICByZXR1cm4ge307XG4gICAgfSBlbHNlIGlmIChub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICBjb25zdCBuYiA9IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3M7XG4gICAgICBpZiAobmIua2luZCA9PSB0cy5TeW50YXhLaW5kLk5hbWVzcGFjZUltcG9ydCkge1xuICAgICAgICAvLyBUaGlzIGlzIG9mIHRoZSBmb3JtIGBpbXBvcnQgKiBhcyBuYW1lIGZyb20gJ3BhdGgnYC4gUmV0dXJuIGBuYW1lLmAuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgWyhuYiBhcyB0cy5OYW1lc3BhY2VJbXBvcnQpLm5hbWUudGV4dCArICcuJ106IG1vZHVsZVBhdGgsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIG9mIHRoZSBmb3JtIGBpbXBvcnQge2EsYixjfSBmcm9tICdwYXRoJ2BcbiAgICAgICAgY29uc3QgbmFtZWRJbXBvcnRzID0gbmIgYXMgdHMuTmFtZWRJbXBvcnRzO1xuXG4gICAgICAgIHJldHVybiBuYW1lZEltcG9ydHMuZWxlbWVudHNcbiAgICAgICAgICAubWFwKChpczogdHMuSW1wb3J0U3BlY2lmaWVyKSA9PiAoaXMucHJvcGVydHlOYW1lID8gaXMucHJvcGVydHlOYW1lLnRleHQgOiBpcy5uYW1lLnRleHQpKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9LCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGFjY1tjdXJyXSA9IG1vZHVsZVBhdGg7XG5cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSwge30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7fTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIG9mIHRoZSBmb3JtIGBpbXBvcnQgJ3BhdGgnO2AuIE5vdGhpbmcgdG8gZG8uXG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWNvcmF0b3JNZXRhZGF0YShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gIG1vZHVsZTogc3RyaW5nLFxuKTogdHMuTm9kZVtdIHtcbiAgY29uc3QgYW5ndWxhckltcG9ydHM6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IGZpbmROb2RlcyhcbiAgICBzb3VyY2UsXG4gICAgdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbixcbiAgKVxuICAgIC5tYXAobm9kZSA9PiBfYW5ndWxhckltcG9ydHNGcm9tTm9kZShub2RlIGFzIHRzLkltcG9ydERlY2xhcmF0aW9uLCBzb3VyY2UpKVxuICAgIC5yZWR1Y2UoKGFjYzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9LCBjdXJyZW50OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30pID0+IHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGN1cnJlbnQpKSB7XG4gICAgICAgIGFjY1trZXldID0gY3VycmVudFtrZXldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICByZXR1cm4gZ2V0U291cmNlTm9kZXMoc291cmNlKVxuICAgIC5maWx0ZXIobm9kZSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5EZWNvcmF0b3IgJiZcbiAgICAgICAgKG5vZGUgYXMgdHMuRGVjb3JhdG9yKS5leHByZXNzaW9uLmtpbmQgPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvblxuICAgICAgKTtcbiAgICB9KVxuICAgIC5tYXAobm9kZSA9PiAobm9kZSBhcyB0cy5EZWNvcmF0b3IpLmV4cHJlc3Npb24gYXMgdHMuQ2FsbEV4cHJlc3Npb24pXG4gICAgLmZpbHRlcihleHByID0+IHtcbiAgICAgIGlmIChleHByLmV4cHJlc3Npb24ua2luZCA9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3QgaWQgPSBleHByLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcjtcblxuICAgICAgICByZXR1cm4gaWQudGV4dCA9PSBpZGVudGlmaWVyICYmIGFuZ3VsYXJJbXBvcnRzW2lkLnRleHRdID09PSBtb2R1bGU7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIuZXhwcmVzc2lvbi5raW5kID09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICAgIC8vIFRoaXMgY292ZXJzIGZvby5OZ01vZHVsZSB3aGVuIGltcG9ydGluZyAqIGFzIGZvby5cbiAgICAgICAgY29uc3QgcGFFeHByID0gZXhwci5leHByZXNzaW9uIGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICAgICAgLy8gSWYgdGhlIGxlZnQgZXhwcmVzc2lvbiBpcyBub3QgYW4gaWRlbnRpZmllciwganVzdCBnaXZlIHVwIGF0IHRoYXQgcG9pbnQuXG4gICAgICAgIGlmIChwYUV4cHIuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpZCA9IHBhRXhwci5uYW1lLnRleHQ7XG4gICAgICAgIGNvbnN0IG1vZHVsZUlkID0gKHBhRXhwci5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLnRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGlkID09PSBpZGVudGlmaWVyICYmIGFuZ3VsYXJJbXBvcnRzW21vZHVsZUlkICsgJy4nXSA9PT0gbW9kdWxlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSlcbiAgICAuZmlsdGVyKFxuICAgICAgZXhwciA9PiBleHByLmFyZ3VtZW50c1swXSAmJiBleHByLmFyZ3VtZW50c1swXS5raW5kID09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sXG4gICAgKVxuICAgIC5tYXAoZXhwciA9PiBleHByLmFyZ3VtZW50c1swXSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YUZpZWxkKFxuICBub2RlOiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbixcbiAgbWV0YWRhdGFGaWVsZDogc3RyaW5nLFxuKTogdHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRbXSB7XG4gIHJldHVybiAoXG4gICAgbm9kZS5wcm9wZXJ0aWVzXG4gICAgICAuZmlsdGVyKHByb3AgPT4gdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcCkpXG4gICAgICAvLyBGaWx0ZXIgb3V0IGV2ZXJ5IGZpZWxkcyB0aGF0J3Mgbm90IFwibWV0YWRhdGFGaWVsZFwiLiBBbHNvIGhhbmRsZXMgc3RyaW5nIGxpdGVyYWxzXG4gICAgICAvLyAoYnV0IG5vdCBleHByZXNzaW9ucykuXG4gICAgICAuZmlsdGVyKG5vZGUgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKG5vZGUgYXMgdHMuUHJvcGVydHlBc3NpZ25tZW50KS5uYW1lO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICh0cy5pc0lkZW50aWZpZXIobmFtZSkgfHwgdHMuaXNTdHJpbmdMaXRlcmFsKG5hbWUpKSAmJiBuYW1lLmdldFRleHQoKSA9PT0gbWV0YWRhdGFGaWVsZFxuICAgICAgICApO1xuICAgICAgfSlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBuZ01vZHVsZVBhdGg6IHN0cmluZyxcbiAgbWV0YWRhdGFGaWVsZDogc3RyaW5nLFxuICBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsLFxuKTogQ2hhbmdlW10ge1xuICBjb25zdCBub2RlcyA9IGdldERlY29yYXRvck1ldGFkYXRhKHNvdXJjZSwgJ05nTW9kdWxlJywgJ0Bhbmd1bGFyL2NvcmUnKTtcbiAgbGV0IG5vZGU6IGFueSA9IG5vZGVzWzBdOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuXG4gIC8vIEZpbmQgdGhlIGRlY29yYXRvciBkZWNsYXJhdGlvbi5cbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gR2V0IGFsbCB0aGUgY2hpbGRyZW4gcHJvcGVydHkgYXNzaWdubWVudCBvZiBvYmplY3QgbGl0ZXJhbHMuXG4gIGNvbnN0IG1hdGNoaW5nUHJvcGVydGllcyA9IGdldE1ldGFkYXRhRmllbGQobm9kZSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbiwgbWV0YWRhdGFGaWVsZCk7XG5cbiAgLy8gR2V0IHRoZSBsYXN0IG5vZGUgb2YgdGhlIGFycmF5IGxpdGVyYWwuXG4gIGlmICghbWF0Y2hpbmdQcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChtYXRjaGluZ1Byb3BlcnRpZXMubGVuZ3RoID09IDApIHtcbiAgICAvLyBXZSBoYXZlbid0IGZvdW5kIHRoZSBmaWVsZCBpbiB0aGUgbWV0YWRhdGEgZGVjbGFyYXRpb24uIEluc2VydCBhIG5ldyBmaWVsZC5cbiAgICBjb25zdCBleHByID0gbm9kZSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbjtcbiAgICBsZXQgcG9zaXRpb246IG51bWJlcjtcbiAgICBsZXQgdG9JbnNlcnQ6IHN0cmluZztcbiAgICBpZiAoZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBwb3NpdGlvbiA9IGV4cHIuZ2V0RW5kKCkgLSAxO1xuICAgICAgdG9JbnNlcnQgPSBgICAke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1cXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gZXhwci5wcm9wZXJ0aWVzW2V4cHIucHJvcGVydGllcy5sZW5ndGggLSAxXTtcbiAgICAgIHBvc2l0aW9uID0gbm9kZS5nZXRFbmQoKTtcbiAgICAgIC8vIEdldCB0aGUgaW5kZW50YXRpb24gb2YgdGhlIGxhc3QgZWxlbWVudCwgaWYgYW55LlxuICAgICAgY29uc3QgdGV4dCA9IG5vZGUuZ2V0RnVsbFRleHQoc291cmNlKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9eXFxyP1xcblxccyovKTtcbiAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0b0luc2VydCA9IGAsJHttYXRjaGVzWzBdfSR7bWV0YWRhdGFGaWVsZH06IFske3N5bWJvbE5hbWV9XWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b0luc2VydCA9IGAsICR7bWV0YWRhdGFGaWVsZH06IFske3N5bWJvbE5hbWV9XWA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbXBvcnRQYXRoICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSW5zZXJ0Q2hhbmdlKG5nTW9kdWxlUGF0aCwgcG9zaXRpb24sIHRvSW5zZXJ0KSxcbiAgICAgICAgaW5zZXJ0SW1wb3J0KHNvdXJjZSwgbmdNb2R1bGVQYXRoLCBzeW1ib2xOYW1lLnJlcGxhY2UoL1xcLi4qJC8sICcnKSwgaW1wb3J0UGF0aCksXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW25ldyBJbnNlcnRDaGFuZ2UobmdNb2R1bGVQYXRoLCBwb3NpdGlvbiwgdG9JbnNlcnQpXTtcbiAgICB9XG4gIH1cbiAgY29uc3QgYXNzaWdubWVudCA9IG1hdGNoaW5nUHJvcGVydGllc1swXSBhcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQ7XG5cbiAgLy8gSWYgaXQncyBub3QgYW4gYXJyYXksIG5vdGhpbmcgd2UgY2FuIGRvIHJlYWxseS5cbiAgaWYgKGFzc2lnbm1lbnQuaW5pdGlhbGl6ZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYXJyTGl0ZXJhbCA9IGFzc2lnbm1lbnQuaW5pdGlhbGl6ZXIgYXMgdHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbjtcbiAgaWYgKGFyckxpdGVyYWwuZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAvLyBGb3J3YXJkIHRoZSBwcm9wZXJ0eS5cbiAgICBub2RlID0gYXJyTGl0ZXJhbDtcbiAgfSBlbHNlIHtcbiAgICBub2RlID0gYXJyTGl0ZXJhbC5lbGVtZW50cztcbiAgfVxuXG4gIGlmICghbm9kZSkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoJ05vIGFwcCBtb2R1bGUgZm91bmQuIFBsZWFzZSBhZGQgeW91ciBuZXcgY2xhc3MgdG8geW91ciBjb21wb25lbnQuJyk7XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGNvbnN0IG5vZGVBcnJheSA9IG5vZGUgYXMge30gYXMgQXJyYXk8dHMuTm9kZT47XG4gICAgY29uc3Qgc3ltYm9sc0FycmF5ID0gbm9kZUFycmF5Lm1hcChub2RlID0+IG5vZGUuZ2V0VGV4dCgpKTtcbiAgICBpZiAoc3ltYm9sc0FycmF5LmluY2x1ZGVzKHN5bWJvbE5hbWUpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbm9kZSA9IG5vZGVbbm9kZS5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIGxldCB0b0luc2VydDogc3RyaW5nO1xuICBsZXQgcG9zaXRpb24gPSBub2RlLmdldEVuZCgpO1xuICBpZiAobm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAvLyBXZSBoYXZlbid0IGZvdW5kIHRoZSBmaWVsZCBpbiB0aGUgbWV0YWRhdGEgZGVjbGFyYXRpb24uIEluc2VydCBhIG5ld1xuICAgIC8vIGZpZWxkLlxuICAgIGNvbnN0IGV4cHIgPSBub2RlIGFzIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uO1xuICAgIGlmIChleHByLnByb3BlcnRpZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHBvc2l0aW9uID0gZXhwci5nZXRFbmQoKSAtIDE7XG4gICAgICB0b0luc2VydCA9IGAgICR7c3ltYm9sTmFtZX1cXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHZXQgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBsYXN0IGVsZW1lbnQsIGlmIGFueS5cbiAgICAgIGNvbnN0IHRleHQgPSBub2RlLmdldEZ1bGxUZXh0KHNvdXJjZSk7XG4gICAgICBpZiAodGV4dC5tYXRjaCgvXlxccj9cXHI/XFxuLykpIHtcbiAgICAgICAgdG9JbnNlcnQgPSBgLCR7dGV4dC5tYXRjaCgvXlxccj9cXG5cXHMqLylbMF19JHtzeW1ib2xOYW1lfWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b0luc2VydCA9IGAsICR7c3ltYm9sTmFtZX1gO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgLy8gV2UgZm91bmQgdGhlIGZpZWxkIGJ1dCBpdCdzIGVtcHR5LiBJbnNlcnQgaXQganVzdCBiZWZvcmUgdGhlIGBdYC5cbiAgICBwb3NpdGlvbi0tO1xuICAgIHRvSW5zZXJ0ID0gYCR7c3ltYm9sTmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgaW5kZW50YXRpb24gb2YgdGhlIGxhc3QgZWxlbWVudCwgaWYgYW55LlxuICAgIGNvbnN0IHRleHQgPSBub2RlLmdldEZ1bGxUZXh0KHNvdXJjZSk7XG4gICAgaWYgKHRleHQubWF0Y2goL15cXHI/XFxuLykpIHtcbiAgICAgIHRvSW5zZXJ0ID0gYCwke3RleHQubWF0Y2goL15cXHI/XFxuKFxccj8pXFxzKi8pWzBdfSR7c3ltYm9sTmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0luc2VydCA9IGAsICR7c3ltYm9sTmFtZX1gO1xuICAgIH1cbiAgfVxuICBpZiAoaW1wb3J0UGF0aCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgSW5zZXJ0Q2hhbmdlKG5nTW9kdWxlUGF0aCwgcG9zaXRpb24sIHRvSW5zZXJ0KSxcbiAgICAgIGluc2VydEltcG9ydChzb3VyY2UsIG5nTW9kdWxlUGF0aCwgc3ltYm9sTmFtZS5yZXBsYWNlKC9cXC4uKiQvLCAnJyksIGltcG9ydFBhdGgpLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gW25ldyBJbnNlcnRDaGFuZ2UobmdNb2R1bGVQYXRoLCBwb3NpdGlvbiwgdG9JbnNlcnQpXTtcbn1cblxuLyoqXG4gKiBDdXN0b20gZnVuY3Rpb24gdG8gaW5zZXJ0IGEgZGVjbGFyYXRpb24gKGNvbXBvbmVudCwgcGlwZSwgZGlyZWN0aXZlKVxuICogaW50byBOZ01vZHVsZSBkZWNsYXJhdGlvbnMuIEl0IGFsc28gaW1wb3J0cyB0aGUgY29tcG9uZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVjbGFyYXRpb25Ub01vZHVsZShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBtb2R1bGVQYXRoOiBzdHJpbmcsXG4gIGNsYXNzaWZpZWROYW1lOiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZyxcbik6IENoYW5nZVtdIHtcbiAgcmV0dXJuIGFkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICBzb3VyY2UsXG4gICAgbW9kdWxlUGF0aCxcbiAgICAnZGVjbGFyYXRpb25zJyxcbiAgICBjbGFzc2lmaWVkTmFtZSxcbiAgICBpbXBvcnRQYXRoLFxuICApO1xufVxuXG4vKipcbiAqIEN1c3RvbSBmdW5jdGlvbiB0byBpbnNlcnQgYW4gTmdNb2R1bGUgaW50byBOZ01vZHVsZSBpbXBvcnRzLiBJdCBhbHNvIGltcG9ydHMgdGhlIG1vZHVsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEltcG9ydFRvTW9kdWxlKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIG1vZHVsZVBhdGg6IHN0cmluZyxcbiAgY2xhc3NpZmllZE5hbWU6IHN0cmluZyxcbiAgaW1wb3J0UGF0aDogc3RyaW5nLFxuKTogQ2hhbmdlW10ge1xuICByZXR1cm4gYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKHNvdXJjZSwgbW9kdWxlUGF0aCwgJ2ltcG9ydHMnLCBjbGFzc2lmaWVkTmFtZSwgaW1wb3J0UGF0aCk7XG59XG5cbi8qKlxuICogQ3VzdG9tIGZ1bmN0aW9uIHRvIGluc2VydCBhbiBleHBvcnQgaW50byBOZ01vZHVsZS4gSXQgYWxzbyBpbXBvcnRzIGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRXhwb3J0VG9Nb2R1bGUoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgbW9kdWxlUGF0aDogc3RyaW5nLFxuICBjbGFzc2lmaWVkTmFtZTogc3RyaW5nLFxuICBpbXBvcnRQYXRoOiBzdHJpbmcsXG4pOiBDaGFuZ2VbXSB7XG4gIHJldHVybiBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoc291cmNlLCBtb2R1bGVQYXRoLCAnZXhwb3J0cycsIGNsYXNzaWZpZWROYW1lLCBpbXBvcnRQYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCb290c3RyYXBNb2R1bGVDYWxsKGhvc3Q6IFRyZWUsIG1haW5QYXRoOiBzdHJpbmcpOiB0cy5DYWxsRXhwcmVzc2lvbiB8IG51bGwge1xuICBjb25zdCBtYWluQnVmZmVyID0gaG9zdC5yZWFkKG1haW5QYXRoKTtcbiAgaWYgKCFtYWluQnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYE1haW4gZmlsZSAoJHttYWluUGF0aH0pIG5vdCBmb3VuZGApO1xuICB9XG4gIGNvbnN0IG1haW5UZXh0ID0gbWFpbkJ1ZmZlci50b1N0cmluZygndXRmLTgnKTtcbiAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShtYWluUGF0aCwgbWFpblRleHQsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xuXG4gIGNvbnN0IGFsbE5vZGVzID0gZ2V0U291cmNlTm9kZXMoc291cmNlKTtcblxuICBsZXQgYm9vdHN0cmFwQ2FsbDogdHMuQ2FsbEV4cHJlc3Npb24gfCBudWxsID0gbnVsbDtcblxuICBmb3IgKGNvbnN0IG5vZGUgb2YgYWxsTm9kZXMpIHtcbiAgICBsZXQgYm9vdHN0cmFwQ2FsbE5vZGU6IHRzLk5vZGUgfCBudWxsID0gbnVsbDtcbiAgICBib290c3RyYXBDYWxsTm9kZSA9IGZpbmROb2RlKG5vZGUsIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllciwgJ2Jvb3RzdHJhcE1vZHVsZScpO1xuXG4gICAgLy8gV2FsayB1cCB0aGUgcGFyZW50IHVudGlsIENhbGxFeHByZXNzaW9uIGlzIGZvdW5kLlxuICAgIHdoaWxlIChcbiAgICAgIGJvb3RzdHJhcENhbGxOb2RlICYmXG4gICAgICBib290c3RyYXBDYWxsTm9kZS5wYXJlbnQgJiZcbiAgICAgIGJvb3RzdHJhcENhbGxOb2RlLnBhcmVudC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uXG4gICAgKSB7XG4gICAgICBib290c3RyYXBDYWxsTm9kZSA9IGJvb3RzdHJhcENhbGxOb2RlLnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBib290c3RyYXBDYWxsTm9kZSAhPT0gbnVsbCAmJlxuICAgICAgYm9vdHN0cmFwQ2FsbE5vZGUucGFyZW50ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGJvb3RzdHJhcENhbGxOb2RlLnBhcmVudC5raW5kID09PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uXG4gICAgKSB7XG4gICAgICBib290c3RyYXBDYWxsID0gYm9vdHN0cmFwQ2FsbE5vZGUucGFyZW50IGFzIHRzLkNhbGxFeHByZXNzaW9uO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJvb3RzdHJhcENhbGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQm9vdHN0cmFwTW9kdWxlUGF0aChob3N0OiBUcmVlLCBtYWluUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYm9vdHN0cmFwQ2FsbCA9IGZpbmRCb290c3RyYXBNb2R1bGVDYWxsKGhvc3QsIG1haW5QYXRoKTtcbiAgaWYgKCFib290c3RyYXBDYWxsKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0Jvb3RzdHJhcCBjYWxsIG5vdCBmb3VuZCcpO1xuICB9XG5cbiAgY29uc3QgYm9vdHN0cmFwTW9kdWxlID0gYm9vdHN0cmFwQ2FsbC5hcmd1bWVudHNbMF07XG5cbiAgY29uc3QgbWFpbkJ1ZmZlciA9IGhvc3QucmVhZChtYWluUGF0aCk7XG4gIGlmICghbWFpbkJ1ZmZlcikge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDbGllbnQgYXBwIG1haW4gZmlsZSAoJHttYWluUGF0aH0pIG5vdCBmb3VuZGApO1xuICB9XG4gIGNvbnN0IG1haW5UZXh0ID0gbWFpbkJ1ZmZlci50b1N0cmluZygndXRmLTgnKTtcbiAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShtYWluUGF0aCwgbWFpblRleHQsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xuICBjb25zdCBhbGxOb2RlcyA9IGdldFNvdXJjZU5vZGVzKHNvdXJjZSk7XG4gIGNvbnN0IGJvb3RzdHJhcE1vZHVsZVJlbGF0aXZlUGF0aCA9IGFsbE5vZGVzXG4gICAgLmZpbHRlcihub2RlID0+IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbilcbiAgICAuZmlsdGVyKGltcCA9PiB7XG4gICAgICByZXR1cm4gZmluZE5vZGUoaW1wLCB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIsIGJvb3RzdHJhcE1vZHVsZS5nZXRUZXh0KCkpO1xuICAgIH0pXG4gICAgLm1hcChub2RlID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZVBhdGggPSAobm9kZSBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbikubW9kdWxlU3BlY2lmaWVyIGFzIHRzLlN0cmluZ0xpdGVyYWw7XG4gICAgICByZXR1cm4gbW9kdWxlUGF0aC50ZXh0O1xuICAgIH0pWzBdO1xuXG4gIHJldHVybiBib290c3RyYXBNb2R1bGVSZWxhdGl2ZVBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBNb2R1bGVQYXRoKGhvc3Q6IFRyZWUsIG1haW5QYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBtb2R1bGVSZWxhdGl2ZVBhdGggPSBmaW5kQm9vdHN0cmFwTW9kdWxlUGF0aChob3N0LCBtYWluUGF0aCk7XG4gIGNvbnN0IG1haW5EaXIgPSBkaXJuYW1lKG1haW5QYXRoKTtcbiAgY29uc3QgbW9kdWxlUGF0aCA9IG5vcm1hbGl6ZShgLyR7bWFpbkRpcn0vJHttb2R1bGVSZWxhdGl2ZVBhdGh9LnRzYCk7XG5cbiAgcmV0dXJuIG1vZHVsZVBhdGg7XG59XG4iXX0=