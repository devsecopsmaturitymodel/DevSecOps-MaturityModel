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
        define("@angular/core/schematics/utils/typescript/imports", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findImportSpecifier = exports.replaceImport = exports.getImportSpecifier = exports.getImportOfIdentifier = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    const PARSED_TS_VERSION = parseFloat(typescript_1.default.versionMajorMinor);
    /** Gets import information about the specified identifier by using the Type checker. */
    function getImportOfIdentifier(typeChecker, node) {
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!symbol || symbol.declarations === undefined || !symbol.declarations.length) {
            return null;
        }
        const decl = symbol.declarations[0];
        if (!typescript_1.default.isImportSpecifier(decl)) {
            return null;
        }
        const importDecl = decl.parent.parent.parent;
        if (!typescript_1.default.isStringLiteral(importDecl.moduleSpecifier)) {
            return null;
        }
        return {
            // Handles aliased imports: e.g. "import {Component as myComp} from ...";
            name: decl.propertyName ? decl.propertyName.text : decl.name.text,
            importModule: importDecl.moduleSpecifier.text,
            node: importDecl
        };
    }
    exports.getImportOfIdentifier = getImportOfIdentifier;
    /**
     * Gets a top-level import specifier with a specific name that is imported from a particular module.
     * E.g. given a file that looks like:
     *
     * ```
     * import { Component, Directive } from '@angular/core';
     * import { Foo } from './foo';
     * ```
     *
     * Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
     * referring to `Directive` in the top import.
     *
     * @param sourceFile File in which to look for imports.
     * @param moduleName Name of the import's module.
     * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
     *    their original name.
     */
    function getImportSpecifier(sourceFile, moduleName, specifierName) {
        for (const node of sourceFile.statements) {
            if (typescript_1.default.isImportDeclaration(node) && typescript_1.default.isStringLiteral(node.moduleSpecifier) &&
                node.moduleSpecifier.text === moduleName) {
                const namedBindings = node.importClause && node.importClause.namedBindings;
                if (namedBindings && typescript_1.default.isNamedImports(namedBindings)) {
                    const match = findImportSpecifier(namedBindings.elements, specifierName);
                    if (match) {
                        return match;
                    }
                }
            }
        }
        return null;
    }
    exports.getImportSpecifier = getImportSpecifier;
    /**
     * Replaces an import inside a named imports node with a different one.
     * @param node Node that contains the imports.
     * @param existingImport Import that should be replaced.
     * @param newImportName Import that should be inserted.
     */
    function replaceImport(node, existingImport, newImportName) {
        const isAlreadyImported = findImportSpecifier(node.elements, newImportName);
        if (isAlreadyImported) {
            return node;
        }
        const existingImportNode = findImportSpecifier(node.elements, existingImport);
        if (!existingImportNode) {
            return node;
        }
        const importPropertyName = existingImportNode.propertyName ? typescript_1.default.createIdentifier(newImportName) : undefined;
        const importName = existingImportNode.propertyName ? existingImportNode.name :
            typescript_1.default.createIdentifier(newImportName);
        return typescript_1.default.updateNamedImports(node, [
            ...node.elements.filter(current => current !== existingImportNode),
            // Create a new import while trying to preserve the alias of the old one.
            PARSED_TS_VERSION > 4.4 ? typescript_1.default.createImportSpecifier(false, importPropertyName, importName) :
                // TODO(crisbeto): backwards-compatibility layer for TS 4.4.
                // Should be cleaned up when we drop support for it.
                typescript_1.default.createImportSpecifier(importPropertyName, importName)
        ]);
    }
    exports.replaceImport = replaceImport;
    /** Finds an import specifier with a particular name. */
    function findImportSpecifier(nodes, specifierName) {
        return nodes.find(element => {
            const { name, propertyName } = element;
            return propertyName ? propertyName.text === specifierName : name.text === specifierName;
        });
    }
    exports.findImportSpecifier = findImportSpecifier;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy90eXBlc2NyaXB0L2ltcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNERBQTRCO0lBUTVCLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLG9CQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUUzRCx3RkFBd0Y7SUFDeEYsU0FBZ0IscUJBQXFCLENBQUMsV0FBMkIsRUFBRSxJQUFtQjtRQUVwRixNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxLQUFLLFNBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQy9FLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxvQkFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFN0MsSUFBSSxDQUFDLG9CQUFFLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUNuRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTztZQUNMLHlFQUF5RTtZQUN6RSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJ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QyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFORCxrREFNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmV4cG9ydCB0eXBlIEltcG9ydCA9IHtcbiAgbmFtZTogc3RyaW5nLFxuICBpbXBvcnRNb2R1bGU6IHN0cmluZyxcbiAgbm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb25cbn07XG5cbmNvbnN0IFBBUlNFRF9UU19WRVJTSU9OID0gcGFyc2VGbG9hdCh0cy52ZXJzaW9uTWFqb3JNaW5vcik7XG5cbi8qKiBHZXRzIGltcG9ydCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIgYnkgdXNpbmcgdGhlIFR5cGUgY2hlY2tlci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRPZklkZW50aWZpZXIodHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBub2RlOiB0cy5JZGVudGlmaWVyKTogSW1wb3J0fFxuICAgIG51bGwge1xuICBjb25zdCBzeW1ib2wgPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIGlmICghc3ltYm9sIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRlY2wgPSBzeW1ib2wuZGVjbGFyYXRpb25zWzBdO1xuXG4gIGlmICghdHMuaXNJbXBvcnRTcGVjaWZpZXIoZGVjbCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGltcG9ydERlY2wgPSBkZWNsLnBhcmVudC5wYXJlbnQucGFyZW50O1xuXG4gIGlmICghdHMuaXNTdHJpbmdMaXRlcmFsKGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBIYW5kbGVzIGFsaWFzZWQgaW1wb3J0czogZS5nLiBcImltcG9ydCB7Q29tcG9uZW50IGFzIG15Q29tcH0gZnJvbSAuLi5cIjtcbiAgICBuYW1lOiBkZWNsLnByb3BlcnR5TmFtZSA/IGRlY2wucHJvcGVydHlOYW1lLnRleHQgOiBkZWNsLm5hbWUudGV4dCxcbiAgICBpbXBvcnRNb2R1bGU6IGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyLnRleHQsXG4gICAgbm9kZTogaW1wb3J0RGVjbFxuICB9O1xufVxuXG5cbi8qKlxuICogR2V0cyBhIHRvcC1sZXZlbCBpbXBvcnQgc3BlY2lmaWVyIHdpdGggYSBzcGVjaWZpYyBuYW1lIHRoYXQgaXMgaW1wb3J0ZWQgZnJvbSBhIHBhcnRpY3VsYXIgbW9kdWxlLlxuICogRS5nLiBnaXZlbiBhIGZpbGUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqIGBgYFxuICogaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAqIGltcG9ydCB7IEZvbyB9IGZyb20gJy4vZm9vJztcbiAqIGBgYFxuICpcbiAqIENhbGxpbmcgYGdldEltcG9ydFNwZWNpZmllcihzb3VyY2VGaWxlLCAnQGFuZ3VsYXIvY29yZScsICdEaXJlY3RpdmUnKWAgd2lsbCB5aWVsZCB0aGUgbm9kZVxuICogcmVmZXJyaW5nIHRvIGBEaXJlY3RpdmVgIGluIHRoZSB0b3AgaW1wb3J0LlxuICpcbiAqIEBwYXJhbSBzb3VyY2VGaWxlIEZpbGUgaW4gd2hpY2ggdG8gbG9vayBmb3IgaW1wb3J0cy5cbiAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIGltcG9ydCdzIG1vZHVsZS5cbiAqIEBwYXJhbSBzcGVjaWZpZXJOYW1lIE9yaWdpbmFsIG5hbWUgb2YgdGhlIHNwZWNpZmllciB0byBsb29rIGZvci4gQWxpYXNlcyB3aWxsIGJlIHJlc29sdmVkIHRvXG4gKiAgICB0aGVpciBvcmlnaW5hbCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0U3BlY2lmaWVyKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG1vZHVsZU5hbWU6IHN0cmluZywgc3BlY2lmaWVyTmFtZTogc3RyaW5nKTogdHMuSW1wb3J0U3BlY2lmaWVyfG51bGwge1xuICBmb3IgKGNvbnN0IG5vZGUgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBtb2R1bGVOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gbm9kZS5pbXBvcnRDbGF1c2UgJiYgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcbiAgICAgIGlmIChuYW1lZEJpbmRpbmdzICYmIHRzLmlzTmFtZWRJbXBvcnRzKG5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gZmluZEltcG9ydFNwZWNpZmllcihuYW1lZEJpbmRpbmdzLmVsZW1lbnRzLCBzcGVjaWZpZXJOYW1lKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cblxuLyoqXG4gKiBSZXBsYWNlcyBhbiBpbXBvcnQgaW5zaWRlIGEgbmFtZWQgaW1wb3J0cyBub2RlIHdpdGggYSBkaWZmZXJlbnQgb25lLlxuICogQHBhcmFtIG5vZGUgTm9kZSB0aGF0IGNvbnRhaW5zIHRoZSBpbXBvcnRzLlxuICogQHBhcmFtIGV4aXN0aW5nSW1wb3J0IEltcG9ydCB0aGF0IHNob3VsZCBiZSByZXBsYWNlZC5cbiAqIEBwYXJhbSBuZXdJbXBvcnROYW1lIEltcG9ydCB0aGF0IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VJbXBvcnQoXG4gICAgbm9kZTogdHMuTmFtZWRJbXBvcnRzLCBleGlzdGluZ0ltcG9ydDogc3RyaW5nLCBuZXdJbXBvcnROYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgaXNBbHJlYWR5SW1wb3J0ZWQgPSBmaW5kSW1wb3J0U3BlY2lmaWVyKG5vZGUuZWxlbWVudHMsIG5ld0ltcG9ydE5hbWUpO1xuICBpZiAoaXNBbHJlYWR5SW1wb3J0ZWQpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNvbnN0IGV4aXN0aW5nSW1wb3J0Tm9kZSA9IGZpbmRJbXBvcnRTcGVjaWZpZXIobm9kZS5lbGVtZW50cywgZXhpc3RpbmdJbXBvcnQpO1xuICBpZiAoIWV4aXN0aW5nSW1wb3J0Tm9kZSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgY29uc3QgaW1wb3J0UHJvcGVydHlOYW1lID1cbiAgICAgIGV4aXN0aW5nSW1wb3J0Tm9kZS5wcm9wZXJ0eU5hbWUgPyB0cy5jcmVhdGVJZGVudGlmaWVyKG5ld0ltcG9ydE5hbWUpIDogdW5kZWZpbmVkO1xuICBjb25zdCBpbXBvcnROYW1lID0gZXhpc3RpbmdJbXBvcnROb2RlLnByb3BlcnR5TmFtZSA/IGV4aXN0aW5nSW1wb3J0Tm9kZS5uYW1lIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKG5ld0ltcG9ydE5hbWUpO1xuXG4gIHJldHVybiB0cy51cGRhdGVOYW1lZEltcG9ydHMobm9kZSwgW1xuICAgIC4uLm5vZGUuZWxlbWVudHMuZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudCAhPT0gZXhpc3RpbmdJbXBvcnROb2RlKSxcbiAgICAvLyBDcmVhdGUgYSBuZXcgaW1wb3J0IHdoaWxlIHRyeWluZyB0byBwcmVzZXJ2ZSB0aGUgYWxpYXMgb2YgdGhlIG9sZCBvbmUuXG4gICAgUEFSU0VEX1RTX1ZFUlNJT04gPiA0LjQgPyB0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIoZmFsc2UsIGltcG9ydFByb3BlcnR5TmFtZSwgaW1wb3J0TmFtZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGxheWVyIGZvciBUUyA0LjQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgYmUgY2xlYW5lZCB1cCB3aGVuIHdlIGRyb3Agc3VwcG9ydCBmb3IgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyIGFzIGFueSkoaW1wb3J0UHJvcGVydHlOYW1lLCBpbXBvcnROYW1lKVxuICBdKTtcbn1cblxuXG4vKiogRmluZHMgYW4gaW1wb3J0IHNwZWNpZmllciB3aXRoIGEgcGFydGljdWxhciBuYW1lLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRJbXBvcnRTcGVjaWZpZXIoXG4gICAgbm9kZXM6IHRzLk5vZGVBcnJheTx0cy5JbXBvcnRTcGVjaWZpZXI+LCBzcGVjaWZpZXJOYW1lOiBzdHJpbmcpOiB0cy5JbXBvcnRTcGVjaWZpZXJ8dW5kZWZpbmVkIHtcbiAgcmV0dXJuIG5vZGVzLmZpbmQoZWxlbWVudCA9PiB7XG4gICAgY29uc3Qge25hbWUsIHByb3BlcnR5TmFtZX0gPSBlbGVtZW50O1xuICAgIHJldHVybiBwcm9wZXJ0eU5hbWUgPyBwcm9wZXJ0eU5hbWUudGV4dCA9PT0gc3BlY2lmaWVyTmFtZSA6IG5hbWUudGV4dCA9PT0gc3BlY2lmaWVyTmFtZTtcbiAgfSk7XG59XG4iXX0=