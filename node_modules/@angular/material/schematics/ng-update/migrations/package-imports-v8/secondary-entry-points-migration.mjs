"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondaryEntryPointsMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
const module_specifiers_1 = require("../../../ng-update/typescript/module-specifiers");
const ONLY_SUBPACKAGE_FAILURE_STR = `Importing from "@angular/material" is deprecated. ` +
    `Instead import from the entry-point the symbol belongs to.`;
const NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR = `Imports from Angular Material should import ` +
    `specific symbols rather than importing the entire library.`;
/**
 * Regex for testing file paths against to determine if the file is from the
 * Angular Material library.
 */
const ANGULAR_MATERIAL_FILEPATH_REGEX = new RegExp(`${module_specifiers_1.materialModuleSpecifier}/(.*?)/`);
/**
 * Mapping of Material symbol names to their module names. Used as a fallback if
 * we didn't manage to resolve the module name of a symbol using the type checker.
 */
const ENTRY_POINT_MAPPINGS = require('./material-symbols.json');
/**
 * Migration that updates imports which refer to the primary Angular Material
 * entry-point to use the appropriate secondary entry points (e.g. @angular/material/button).
 */
class SecondaryEntryPointsMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        this.printer = ts.createPrinter();
        // Only enable this rule if the migration targets version 8. The primary
        // entry-point of Material has been marked as deprecated in version 8.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V8 || this.targetVersion === schematics_1.TargetVersion.V9;
    }
    visitNode(declaration) {
        // Only look at import declarations.
        if (!ts.isImportDeclaration(declaration) ||
            !ts.isStringLiteralLike(declaration.moduleSpecifier)) {
            return;
        }
        const importLocation = declaration.moduleSpecifier.text;
        // If the import module is not @angular/material, skip the check.
        if (importLocation !== module_specifiers_1.materialModuleSpecifier) {
            return;
        }
        // If no import clause is found, or nothing is named as a binding in the
        // import, add failure saying to import symbols in clause.
        if (!declaration.importClause || !declaration.importClause.namedBindings) {
            this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
            return;
        }
        // All named bindings in import clauses must be named symbols, otherwise add
        // failure saying to import symbols in clause.
        if (!ts.isNamedImports(declaration.importClause.namedBindings)) {
            this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
            return;
        }
        // If no symbols are in the named bindings then add failure saying to
        // import symbols in clause.
        if (!declaration.importClause.namedBindings.elements.length) {
            this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
            return;
        }
        // Whether the existing import declaration is using a single quote module specifier.
        const singleQuoteImport = declaration.moduleSpecifier.getText()[0] === `'`;
        // Map which consists of secondary entry-points and import specifiers which are used
        // within the current import declaration.
        const importMap = new Map();
        // Determine the subpackage each symbol in the namedBinding comes from.
        for (const element of declaration.importClause.namedBindings.elements) {
            const elementName = element.propertyName ? element.propertyName : element.name;
            // Try to resolve the module name via the type checker, and if it fails, fall back to
            // resolving it from our list of symbol to entry point mappings. Using the type checker is
            // more accurate and doesn't require us to keep a list of symbols, but it won't work if
            // the symbols don't exist anymore (e.g. after we remove the top-level @angular/material).
            const moduleName = resolveModuleName(elementName, this.typeChecker) ||
                ENTRY_POINT_MAPPINGS[elementName.text] ||
                null;
            if (!moduleName) {
                this.createFailureAtNode(element, `"${element.getText()}" was not found in the Material library.`);
                return;
            }
            // The module name where the symbol is defined e.g. card, dialog. The
            // first capture group is contains the module name.
            if (importMap.has(moduleName)) {
                importMap.get(moduleName).push(element);
            }
            else {
                importMap.set(moduleName, [element]);
            }
        }
        // Transforms the import declaration into multiple import declarations that import
        // the given symbols from the individual secondary entry-points. For example:
        // import {MatCardModule, MatCardTitle} from '@angular/material/card';
        // import {MatRadioModule} from '@angular/material/radio';
        const newImportStatements = Array.from(importMap.entries())
            .sort()
            .map(([name, elements]) => {
            const newImport = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports(elements)), createStringLiteral(`${module_specifiers_1.materialModuleSpecifier}/${name}`, singleQuoteImport));
            return this.printer.printNode(ts.EmitHint.Unspecified, newImport, declaration.getSourceFile());
        })
            .join('\n');
        // Without any import statements that were generated, we can assume that this was an empty
        // import declaration. We still want to add a failure in order to make developers aware that
        // importing from "@angular/material" is deprecated.
        if (!newImportStatements) {
            this.createFailureAtNode(declaration.moduleSpecifier, ONLY_SUBPACKAGE_FAILURE_STR);
            return;
        }
        const filePath = this.fileSystem.resolve(declaration.moduleSpecifier.getSourceFile().fileName);
        const recorder = this.fileSystem.edit(filePath);
        // Perform the replacement that switches the primary entry-point import to
        // the individual secondary entry-point imports.
        recorder.remove(declaration.getStart(), declaration.getWidth());
        recorder.insertRight(declaration.getStart(), newImportStatements);
    }
}
exports.SecondaryEntryPointsMigration = SecondaryEntryPointsMigration;
/**
 * Creates a string literal from the specified text.
 * @param text Text of the string literal.
 * @param singleQuotes Whether single quotes should be used when printing the literal node.
 */
function createStringLiteral(text, singleQuotes) {
    const literal = ts.createStringLiteral(text);
    // See: https://github.com/microsoft/TypeScript/blob/master/src/compiler/utilities.ts#L584-L590
    literal.singleQuote = singleQuotes;
    return literal;
}
/** Gets the symbol that contains the value declaration of the given node. */
function getDeclarationSymbolOfNode(node, checker) {
    const symbol = checker.getSymbolAtLocation(node);
    // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
    // We need to resolve the aliased symbol back to the declaration symbol.
    // tslint:disable-next-line:no-bitwise
    if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
        return checker.getAliasedSymbol(symbol);
    }
    return symbol;
}
/** Tries to resolve the name of the Material module that a node is imported from. */
function resolveModuleName(node, typeChecker) {
    var _a;
    // Get the symbol for the named binding element. Note that we cannot determine the
    // value declaration based on the type of the element as types are not necessarily
    // specific to a given secondary entry-point (e.g. exports with the type of "string")
    // would resolve to the module types provided by TypeScript itself.
    const symbol = getDeclarationSymbolOfNode(node, typeChecker);
    // If the symbol can't be found, or no declaration could be found within
    // the symbol, add failure to report that the given symbol can't be found.
    if (!symbol ||
        !(symbol.valueDeclaration || (symbol.declarations && symbol.declarations.length !== 0))) {
        return null;
    }
    // The filename for the source file of the node that contains the
    // first declaration of the symbol. All symbol declarations must be
    // part of a defining node, so parent can be asserted to be defined.
    const resolvedNode = symbol.valueDeclaration || ((_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0]);
    if (resolvedNode === undefined) {
        return null;
    }
    const sourceFile = resolvedNode.getSourceFile().fileName;
    // File the module the symbol belongs to from a regex match of the
    // filename. This will always match since only "@angular/material"
    // elements are analyzed.
    const matches = sourceFile.match(ANGULAR_MATERIAL_FILEPATH_REGEX);
    return matches ? matches[1] : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUNqQyx1RkFBd0Y7QUFFeEYsTUFBTSwyQkFBMkIsR0FDL0Isb0RBQW9EO0lBQ3BELDREQUE0RCxDQUFDO0FBRS9ELE1BQU0sbUNBQW1DLEdBQ3ZDLDhDQUE4QztJQUM5Qyw0REFBNEQsQ0FBQztBQUUvRDs7O0dBR0c7QUFDSCxNQUFNLCtCQUErQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsMkNBQXVCLFNBQVMsQ0FBQyxDQUFDO0FBRXhGOzs7R0FHRztBQUNILE1BQU0sb0JBQW9CLEdBQTZCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRTFGOzs7R0FHRztBQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7SUFBbEU7O1FBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUU3Qix3RUFBd0U7UUFDeEUsc0VBQXNFO1FBQ3RFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFnSC9GLENBQUM7SUE5R1UsU0FBUyxDQUFDLFdBQW9CO1FBQ3JDLG9DQUFvQztRQUNwQyxJQUNFLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztZQUNwQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQ3BEO1lB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RCxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDO0lBRXpELGtFQUFrRTtJQUNsRSxrRUFBa0U7SUFDbEUseUJBQXlCO0lBQ3pCLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztJQUNsRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfSBmcm9tICcuLi8uLi8uLi9uZy11cGRhdGUvdHlwZXNjcmlwdC9tb2R1bGUtc3BlY2lmaWVycyc7XG5cbmNvbnN0IE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUiA9XG4gIGBJbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC4gYCArXG4gIGBJbnN0ZWFkIGltcG9ydCBmcm9tIHRoZSBlbnRyeS1wb2ludCB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8uYDtcblxuY29uc3QgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIgPVxuICBgSW1wb3J0cyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgc2hvdWxkIGltcG9ydCBgICtcbiAgYHNwZWNpZmljIHN5bWJvbHMgcmF0aGVyIHRoYW4gaW1wb3J0aW5nIHRoZSBlbnRpcmUgbGlicmFyeS5gO1xuXG4vKipcbiAqIFJlZ2V4IGZvciB0ZXN0aW5nIGZpbGUgcGF0aHMgYWdhaW5zdCB0byBkZXRlcm1pbmUgaWYgdGhlIGZpbGUgaXMgZnJvbSB0aGVcbiAqIEFuZ3VsYXIgTWF0ZXJpYWwgbGlicmFyeS5cbiAqL1xuY29uc3QgQU5HVUxBUl9NQVRFUklBTF9GSUxFUEFUSF9SRUdFWCA9IG5ldyBSZWdFeHAoYCR7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9LyguKj8pL2ApO1xuXG4vKipcbiAqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgc3ltYm9sIG5hbWVzIHRvIHRoZWlyIG1vZHVsZSBuYW1lcy4gVXNlZCBhcyBhIGZhbGxiYWNrIGlmXG4gKiB3ZSBkaWRuJ3QgbWFuYWdlIHRvIHJlc29sdmUgdGhlIG1vZHVsZSBuYW1lIG9mIGEgc3ltYm9sIHVzaW5nIHRoZSB0eXBlIGNoZWNrZXIuXG4gKi9cbmNvbnN0IEVOVFJZX1BPSU5UX01BUFBJTkdTOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gPSByZXF1aXJlKCcuL21hdGVyaWFsLXN5bWJvbHMuanNvbicpO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IHVwZGF0ZXMgaW1wb3J0cyB3aGljaCByZWZlciB0byB0aGUgcHJpbWFyeSBBbmd1bGFyIE1hdGVyaWFsXG4gKiBlbnRyeS1wb2ludCB0byB1c2UgdGhlIGFwcHJvcHJpYXRlIHNlY29uZGFyeSBlbnRyeSBwb2ludHMgKGUuZy4gQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlY29uZGFyeUVudHJ5UG9pbnRzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gOC4gVGhlIHByaW1hcnlcbiAgLy8gZW50cnktcG9pbnQgb2YgTWF0ZXJpYWwgaGFzIGJlZW4gbWFya2VkIGFzIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiA4LlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY4IHx8IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOTtcblxuICBvdmVycmlkZSB2aXNpdE5vZGUoZGVjbGFyYXRpb246IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAvLyBPbmx5IGxvb2sgYXQgaW1wb3J0IGRlY2xhcmF0aW9ucy5cbiAgICBpZiAoXG4gICAgICAhdHMuaXNJbXBvcnREZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHxcbiAgICAgICF0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllcilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRMb2NhdGlvbiA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci50ZXh0O1xuICAgIC8vIElmIHRoZSBpbXBvcnQgbW9kdWxlIGlzIG5vdCBAYW5ndWxhci9tYXRlcmlhbCwgc2tpcCB0aGUgY2hlY2suXG4gICAgaWYgKGltcG9ydExvY2F0aW9uICE9PSBtYXRlcmlhbE1vZHVsZVNwZWNpZmllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIG5vIGltcG9ydCBjbGF1c2UgaXMgZm91bmQsIG9yIG5vdGhpbmcgaXMgbmFtZWQgYXMgYSBiaW5kaW5nIGluIHRoZVxuICAgIC8vIGltcG9ydCwgYWRkIGZhaWx1cmUgc2F5aW5nIHRvIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZSB8fCAhZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFsbCBuYW1lZCBiaW5kaW5ncyBpbiBpbXBvcnQgY2xhdXNlcyBtdXN0IGJlIG5hbWVkIHN5bWJvbHMsIG90aGVyd2lzZSBhZGRcbiAgICAvLyBmYWlsdXJlIHNheWluZyB0byBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCF0cy5pc05hbWVkSW1wb3J0cyhkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIG5vIHN5bWJvbHMgYXJlIGluIHRoZSBuYW1lZCBiaW5kaW5ncyB0aGVuIGFkZCBmYWlsdXJlIHNheWluZyB0b1xuICAgIC8vIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2hldGhlciB0aGUgZXhpc3RpbmcgaW1wb3J0IGRlY2xhcmF0aW9uIGlzIHVzaW5nIGEgc2luZ2xlIHF1b3RlIG1vZHVsZSBzcGVjaWZpZXIuXG4gICAgY29uc3Qgc2luZ2xlUXVvdGVJbXBvcnQgPSBkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0VGV4dCgpWzBdID09PSBgJ2A7XG5cbiAgICAvLyBNYXAgd2hpY2ggY29uc2lzdHMgb2Ygc2Vjb25kYXJ5IGVudHJ5LXBvaW50cyBhbmQgaW1wb3J0IHNwZWNpZmllcnMgd2hpY2ggYXJlIHVzZWRcbiAgICAvLyB3aXRoaW4gdGhlIGN1cnJlbnQgaW1wb3J0IGRlY2xhcmF0aW9uLlxuICAgIGNvbnN0IGltcG9ydE1hcCA9IG5ldyBNYXA8c3RyaW5nLCB0cy5JbXBvcnRTcGVjaWZpZXJbXT4oKTtcblxuICAgIC8vIERldGVybWluZSB0aGUgc3VicGFja2FnZSBlYWNoIHN5bWJvbCBpbiB0aGUgbmFtZWRCaW5kaW5nIGNvbWVzIGZyb20uXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQucHJvcGVydHlOYW1lID8gZWxlbWVudC5wcm9wZXJ0eU5hbWUgOiBlbGVtZW50Lm5hbWU7XG5cbiAgICAgIC8vIFRyeSB0byByZXNvbHZlIHRoZSBtb2R1bGUgbmFtZSB2aWEgdGhlIHR5cGUgY2hlY2tlciwgYW5kIGlmIGl0IGZhaWxzLCBmYWxsIGJhY2sgdG9cbiAgICAgIC8vIHJlc29sdmluZyBpdCBmcm9tIG91ciBsaXN0IG9mIHN5bWJvbCB0byBlbnRyeSBwb2ludCBtYXBwaW5ncy4gVXNpbmcgdGhlIHR5cGUgY2hlY2tlciBpc1xuICAgICAgLy8gbW9yZSBhY2N1cmF0ZSBhbmQgZG9lc24ndCByZXF1aXJlIHVzIHRvIGtlZXAgYSBsaXN0IG9mIHN5bWJvbHMsIGJ1dCBpdCB3b24ndCB3b3JrIGlmXG4gICAgICAvLyB0aGUgc3ltYm9scyBkb24ndCBleGlzdCBhbnltb3JlIChlLmcuIGFmdGVyIHdlIHJlbW92ZSB0aGUgdG9wLWxldmVsIEBhbmd1bGFyL21hdGVyaWFsKS5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPVxuICAgICAgICByZXNvbHZlTW9kdWxlTmFtZShlbGVtZW50TmFtZSwgdGhpcy50eXBlQ2hlY2tlcikgfHxcbiAgICAgICAgRU5UUllfUE9JTlRfTUFQUElOR1NbZWxlbWVudE5hbWUudGV4dF0gfHxcbiAgICAgICAgbnVsbDtcblxuICAgICAgaWYgKCFtb2R1bGVOYW1lKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIGBcIiR7ZWxlbWVudC5nZXRUZXh0KCl9XCIgd2FzIG5vdCBmb3VuZCBpbiB0aGUgTWF0ZXJpYWwgbGlicmFyeS5gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBtb2R1bGUgbmFtZSB3aGVyZSB0aGUgc3ltYm9sIGlzIGRlZmluZWQgZS5nLiBjYXJkLCBkaWFsb2cuIFRoZVxuICAgICAgLy8gZmlyc3QgY2FwdHVyZSBncm91cCBpcyBjb250YWlucyB0aGUgbW9kdWxlIG5hbWUuXG4gICAgICBpZiAoaW1wb3J0TWFwLmhhcyhtb2R1bGVOYW1lKSkge1xuICAgICAgICBpbXBvcnRNYXAuZ2V0KG1vZHVsZU5hbWUpIS5wdXNoKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1wb3J0TWFwLnNldChtb2R1bGVOYW1lLCBbZWxlbWVudF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybXMgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBpbnRvIG11bHRpcGxlIGltcG9ydCBkZWNsYXJhdGlvbnMgdGhhdCBpbXBvcnRcbiAgICAvLyB0aGUgZ2l2ZW4gc3ltYm9scyBmcm9tIHRoZSBpbmRpdmlkdWFsIHNlY29uZGFyeSBlbnRyeS1wb2ludHMuIEZvciBleGFtcGxlOlxuICAgIC8vIGltcG9ydCB7TWF0Q2FyZE1vZHVsZSwgTWF0Q2FyZFRpdGxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jYXJkJztcbiAgICAvLyBpbXBvcnQge01hdFJhZGlvTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9yYWRpbyc7XG4gICAgY29uc3QgbmV3SW1wb3J0U3RhdGVtZW50cyA9IEFycmF5LmZyb20oaW1wb3J0TWFwLmVudHJpZXMoKSlcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoKFtuYW1lLCBlbGVtZW50c10pID0+IHtcbiAgICAgICAgY29uc3QgbmV3SW1wb3J0ID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB0cy5jcmVhdGVOYW1lZEltcG9ydHMoZWxlbWVudHMpKSxcbiAgICAgICAgICBjcmVhdGVTdHJpbmdMaXRlcmFsKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8ke25hbWV9YCwgc2luZ2xlUXVvdGVJbXBvcnQpLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCxcbiAgICAgICAgICBuZXdJbXBvcnQsXG4gICAgICAgICAgZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLFxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgIC8vIFdpdGhvdXQgYW55IGltcG9ydCBzdGF0ZW1lbnRzIHRoYXQgd2VyZSBnZW5lcmF0ZWQsIHdlIGNhbiBhc3N1bWUgdGhhdCB0aGlzIHdhcyBhbiBlbXB0eVxuICAgIC8vIGltcG9ydCBkZWNsYXJhdGlvbi4gV2Ugc3RpbGwgd2FudCB0byBhZGQgYSBmYWlsdXJlIGluIG9yZGVyIHRvIG1ha2UgZGV2ZWxvcGVycyBhd2FyZSB0aGF0XG4gICAgLy8gaW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuXG4gICAgaWYgKCFuZXdJbXBvcnRTdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG5cbiAgICAvLyBQZXJmb3JtIHRoZSByZXBsYWNlbWVudCB0aGF0IHN3aXRjaGVzIHRoZSBwcmltYXJ5IGVudHJ5LXBvaW50IGltcG9ydCB0b1xuICAgIC8vIHRoZSBpbmRpdmlkdWFsIHNlY29uZGFyeSBlbnRyeS1wb2ludCBpbXBvcnRzLlxuICAgIHJlY29yZGVyLnJlbW92ZShkZWNsYXJhdGlvbi5nZXRTdGFydCgpLCBkZWNsYXJhdGlvbi5nZXRXaWR0aCgpKTtcbiAgICByZWNvcmRlci5pbnNlcnRSaWdodChkZWNsYXJhdGlvbi5nZXRTdGFydCgpLCBuZXdJbXBvcnRTdGF0ZW1lbnRzKTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzdHJpbmcgbGl0ZXJhbCBmcm9tIHRoZSBzcGVjaWZpZWQgdGV4dC5cbiAqIEBwYXJhbSB0ZXh0IFRleHQgb2YgdGhlIHN0cmluZyBsaXRlcmFsLlxuICogQHBhcmFtIHNpbmdsZVF1b3RlcyBXaGV0aGVyIHNpbmdsZSBxdW90ZXMgc2hvdWxkIGJlIHVzZWQgd2hlbiBwcmludGluZyB0aGUgbGl0ZXJhbCBub2RlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdHJpbmdMaXRlcmFsKHRleHQ6IHN0cmluZywgc2luZ2xlUXVvdGVzOiBib29sZWFuKTogdHMuU3RyaW5nTGl0ZXJhbCB7XG4gIGNvbnN0IGxpdGVyYWwgPSB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKHRleHQpO1xuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9zcmMvY29tcGlsZXIvdXRpbGl0aWVzLnRzI0w1ODQtTDU5MFxuICAobGl0ZXJhbCBhcyBhbnkpLnNpbmdsZVF1b3RlID0gc2luZ2xlUXVvdGVzO1xuICByZXR1cm4gbGl0ZXJhbDtcbn1cblxuLyoqIEdldHMgdGhlIHN5bWJvbCB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSBkZWNsYXJhdGlvbiBvZiB0aGUgZ2l2ZW4gbm9kZS4gKi9cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGU6IHRzLk5vZGUsIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKTogdHMuU3ltYm9sIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgIHJldHVybiBjaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuICByZXR1cm4gc3ltYm9sO1xufVxuXG4vKiogVHJpZXMgdG8gcmVzb2x2ZSB0aGUgbmFtZSBvZiB0aGUgTWF0ZXJpYWwgbW9kdWxlIHRoYXQgYSBub2RlIGlzIGltcG9ydGVkIGZyb20uICovXG5mdW5jdGlvbiByZXNvbHZlTW9kdWxlTmFtZShub2RlOiB0cy5JZGVudGlmaWVyLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gR2V0IHRoZSBzeW1ib2wgZm9yIHRoZSBuYW1lZCBiaW5kaW5nIGVsZW1lbnQuIE5vdGUgdGhhdCB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZVxuICAvLyB2YWx1ZSBkZWNsYXJhdGlvbiBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgZWxlbWVudCBhcyB0eXBlcyBhcmUgbm90IG5lY2Vzc2FyaWx5XG4gIC8vIHNwZWNpZmljIHRvIGEgZ2l2ZW4gc2Vjb25kYXJ5IGVudHJ5LXBvaW50IChlLmcuIGV4cG9ydHMgd2l0aCB0aGUgdHlwZSBvZiBcInN0cmluZ1wiKVxuICAvLyB3b3VsZCByZXNvbHZlIHRvIHRoZSBtb2R1bGUgdHlwZXMgcHJvdmlkZWQgYnkgVHlwZVNjcmlwdCBpdHNlbGYuXG4gIGNvbnN0IHN5bWJvbCA9IGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGUsIHR5cGVDaGVja2VyKTtcblxuICAvLyBJZiB0aGUgc3ltYm9sIGNhbid0IGJlIGZvdW5kLCBvciBubyBkZWNsYXJhdGlvbiBjb3VsZCBiZSBmb3VuZCB3aXRoaW5cbiAgLy8gdGhlIHN5bWJvbCwgYWRkIGZhaWx1cmUgdG8gcmVwb3J0IHRoYXQgdGhlIGdpdmVuIHN5bWJvbCBjYW4ndCBiZSBmb3VuZC5cbiAgaWYgKFxuICAgICFzeW1ib2wgfHxcbiAgICAhKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IChzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAwKSlcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBUaGUgZmlsZW5hbWUgZm9yIHRoZSBzb3VyY2UgZmlsZSBvZiB0aGUgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAvLyBmaXJzdCBkZWNsYXJhdGlvbiBvZiB0aGUgc3ltYm9sLiBBbGwgc3ltYm9sIGRlY2xhcmF0aW9ucyBtdXN0IGJlXG4gIC8vIHBhcnQgb2YgYSBkZWZpbmluZyBub2RlLCBzbyBwYXJlbnQgY2FuIGJlIGFzc2VydGVkIHRvIGJlIGRlZmluZWQuXG4gIGNvbnN0IHJlc29sdmVkTm9kZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnM/LlswXTtcblxuICBpZiAocmVzb2x2ZWROb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlZE5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuXG4gIC8vIEZpbGUgdGhlIG1vZHVsZSB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8gZnJvbSBhIHJlZ2V4IG1hdGNoIG9mIHRoZVxuICAvLyBmaWxlbmFtZS4gVGhpcyB3aWxsIGFsd2F5cyBtYXRjaCBzaW5jZSBvbmx5IFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIlxuICAvLyBlbGVtZW50cyBhcmUgYW5hbHl6ZWQuXG4gIGNvbnN0IG1hdGNoZXMgPSBzb3VyY2VGaWxlLm1hdGNoKEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVgpO1xuICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xufVxuIl19