"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateFileContent = void 0;
const config_1 = require("./config");
/** Possible pairs of comment characters in a Sass file. */
const commentPairs = new Map([
    ['/*', '*/'],
    ['//', '\n'],
]);
/** Prefix for the placeholder that will be used to escape comments. */
const commentPlaceholderStart = '__<<ngThemingMigrationEscapedComment';
/** Suffix for the comment escape placeholder. */
const commentPlaceholderEnd = '>>__';
/**
 * Migrates the content of a file to the new theming API. Note that this migration is using plain
 * string manipulation, rather than the AST from PostCSS and the schematics string manipulation
 * APIs, because it allows us to run it inside g3 and to avoid introducing new dependencies.
 * @param fileContent Content of the file.
 * @param oldMaterialPrefix Prefix with which the old Material imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/material/theming'` should be
 *   matched, the prefix would be `@angular/material/`.
 * @param oldCdkPrefix Prefix with which the old CDK imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/cdk/overlay'` should be
 *   matched, the prefix would be `@angular/cdk/`.
 * @param newMaterialImportPath New import to the Material theming API (e.g. `@angular/material`).
 * @param newCdkImportPath New import to the CDK Sass APIs (e.g. `@angular/cdk`).
 * @param excludedImports Pattern that can be used to exclude imports from being processed.
 */
function migrateFileContent(fileContent, oldMaterialPrefix, oldCdkPrefix, newMaterialImportPath, newCdkImportPath, extraMaterialSymbols = {}, excludedImports) {
    let { content, placeholders } = escapeComments(fileContent);
    const materialResults = detectImports(content, oldMaterialPrefix, excludedImports);
    const cdkResults = detectImports(content, oldCdkPrefix, excludedImports);
    // Try to migrate the symbols even if there are no imports. This is used
    // to cover the case where the Components symbols were used transitively.
    content = migrateCdkSymbols(content, newCdkImportPath, placeholders, cdkResults);
    content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults, placeholders, extraMaterialSymbols);
    content = replaceRemovedVariables(content, config_1.removedMaterialVariables);
    // We can assume that the migration has taken care of any Components symbols that were
    // imported transitively so we can always drop the old imports. We also assume that imports
    // to the new entry points have been added already.
    if (materialResults.imports.length) {
        content = replaceRemovedVariables(content, config_1.unprefixedRemovedVariables);
        content = removeStrings(content, materialResults.imports);
    }
    if (cdkResults.imports.length) {
        content = removeStrings(content, cdkResults.imports);
    }
    return restoreComments(content, placeholders);
}
exports.migrateFileContent = migrateFileContent;
/**
 * Counts the number of imports with a specific prefix and extracts their namespaces.
 * @param content File content in which to look for imports.
 * @param prefix Prefix that the imports should start with.
 * @param excludedImports Pattern that can be used to exclude imports from being processed.
 */
function detectImports(content, prefix, excludedImports) {
    if (prefix[prefix.length - 1] !== '/') {
        // Some of the logic further down makes assumptions about the import depth.
        throw Error(`Prefix "${prefix}" has to end in a slash.`);
    }
    // List of `@use` namespaces from which Angular CDK/Material APIs may be referenced.
    // Since we know that the library doesn't have any name collisions, we can treat all of these
    // namespaces as equivalent.
    const namespaces = [];
    const imports = [];
    const pattern = new RegExp(`@(import|use) +['"]~?${escapeRegExp(prefix)}.*['"].*;?\n`, 'g');
    let match = null;
    while ((match = pattern.exec(content))) {
        const [fullImport, type] = match;
        if (excludedImports === null || excludedImports === void 0 ? void 0 : excludedImports.test(fullImport)) {
            continue;
        }
        if (type === 'use') {
            const namespace = extractNamespaceFromUseStatement(fullImport);
            if (namespaces.indexOf(namespace) === -1) {
                namespaces.push(namespace);
            }
        }
        imports.push(fullImport);
    }
    return { imports, namespaces };
}
/** Migrates the Material symbols in a file. */
function migrateMaterialSymbols(content, importPath, detectedImports, commentPlaceholders, extraMaterialSymbols = {}) {
    const initialContent = content;
    const namespace = 'mat';
    // Migrate the mixins.
    const mixinsToUpdate = Object.assign(Object.assign({}, config_1.materialMixins), extraMaterialSymbols.mixins);
    content = renameSymbols(content, mixinsToUpdate, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the functions.
    const functionsToUpdate = Object.assign(Object.assign({}, config_1.materialFunctions), extraMaterialSymbols.functions);
    content = renameSymbols(content, functionsToUpdate, detectedImports.namespaces, functionKeyFormatter, getFunctionValueFormatter(namespace));
    // Migrate the variables.
    const variablesToUpdate = Object.assign(Object.assign({}, config_1.materialVariables), extraMaterialSymbols.variables);
    content = renameSymbols(content, variablesToUpdate, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    if (content !== initialContent) {
        // Add an import to the new API only if any of the APIs were being used.
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
    }
    return content;
}
/** Migrates the CDK symbols in a file. */
function migrateCdkSymbols(content, importPath, commentPlaceholders, detectedImports) {
    const initialContent = content;
    const namespace = 'cdk';
    // Migrate the mixins.
    content = renameSymbols(content, config_1.cdkMixins, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
    // Migrate the variables.
    content = renameSymbols(content, config_1.cdkVariables, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
    // Previously the CDK symbols were exposed through `material/theming`, but now we have a
    // dedicated entrypoint for the CDK. Only add an import for it if any of the symbols are used.
    if (content !== initialContent) {
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
    }
    return content;
}
/**
 * Renames all Sass symbols in a file based on a pre-defined mapping.
 * @param content Content of a file to be migrated.
 * @param mapping Mapping between symbol names and their replacements.
 * @param namespaces Names to iterate over and pass to getKeyPattern.
 * @param getKeyPattern Function used to turn each of the keys into a regex.
 * @param formatValue Formats the value that will replace any matches of the pattern returned by
 *  `getKeyPattern`.
 */
function renameSymbols(content, mapping, namespaces, getKeyPattern, formatValue) {
    // The null at the end is so that we make one last pass to cover non-namespaced symbols.
    [...namespaces.slice(), null].forEach(namespace => {
        Object.keys(mapping).forEach(key => {
            const pattern = getKeyPattern(namespace, key);
            // Sanity check since non-global regexes will only replace the first match.
            if (pattern.flags.indexOf('g') === -1) {
                throw Error('Replacement pattern must be global.');
            }
            content = content.replace(pattern, formatValue(mapping[key]));
        });
    });
    return content;
}
/** Inserts an `@use` statement in a string. */
function insertUseStatement(content, importPath, namespace, commentPlaceholders) {
    // If the content already has the `@use` import, we don't need to add anything.
    if (new RegExp(`@use +['"]${importPath}['"]`, 'g').test(content)) {
        return content;
    }
    // Sass will throw an error if an `@use` statement comes after another statement. The safest way
    // to ensure that we conform to that requirement is by always inserting our imports at the top
    // of the file. Detecting where the user's content starts is tricky, because there are many
    // different kinds of syntax we'd have to account for. One approach is to find the first `@import`
    // and insert before it, but the problem is that Sass allows `@import` to be placed anywhere.
    let newImportIndex = 0;
    // One special case is if the file starts with a license header which we want to preserve on top.
    if (content.trim().startsWith(commentPlaceholderStart)) {
        const commentStartIndex = content.indexOf(commentPlaceholderStart);
        newImportIndex =
            content.indexOf(commentPlaceholderEnd, commentStartIndex + 1) + commentPlaceholderEnd.length;
        // If the leading comment doesn't end with a newline,
        // we need to insert the import at the next line.
        if (!commentPlaceholders[content.slice(commentStartIndex, newImportIndex)].endsWith('\n')) {
            newImportIndex = Math.max(newImportIndex, content.indexOf('\n', newImportIndex) + 1);
        }
    }
    return (content.slice(0, newImportIndex) +
        `@use '${importPath}' as ${namespace};\n` +
        content.slice(newImportIndex));
}
/** Formats a migration key as a Sass mixin invocation. */
function mixinKeyFormatter(namespace, name) {
    // Note that adding a `(` at the end of the pattern would be more accurate, but mixin
    // invocations don't necessarily have to include the parentheses. We could add `[(;]`,
    // but then we won't know which character to include in the replacement string.
    return new RegExp(`@include +${escapeRegExp((namespace ? namespace + '.' : '') + name)}`, 'g');
}
/** Returns a function that can be used to format a Sass mixin replacement. */
function getMixinValueFormatter(namespace) {
    // Note that adding a `(` at the end of the pattern would be more accurate,
    // but mixin invocations don't necessarily have to include the parentheses.
    return name => `@include ${namespace}.${name}`;
}
/** Formats a migration key as a Sass function invocation. */
function functionKeyFormatter(namespace, name) {
    const functionName = escapeRegExp(`${namespace ? namespace + '.' : ''}${name}(`);
    return new RegExp(`(?<![-_a-zA-Z0-9])${functionName}`, 'g');
}
/** Returns a function that can be used to format a Sass function replacement. */
function getFunctionValueFormatter(namespace) {
    return name => `${namespace}.${name}(`;
}
/** Formats a migration key as a Sass variable. */
function variableKeyFormatter(namespace, name) {
    const variableName = escapeRegExp(`${namespace ? namespace + '.' : ''}$${name}`);
    return new RegExp(`${variableName}(?![-_a-zA-Z0-9])`, 'g');
}
/** Returns a function that can be used to format a Sass variable replacement. */
function getVariableValueFormatter(namespace) {
    return name => `${namespace}.$${name}`;
}
/** Escapes special regex characters in a string. */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
/** Removes all strings from another string. */
function removeStrings(content, toRemove) {
    return toRemove
        .reduce((accumulator, current) => accumulator.replace(current, ''), content)
        .replace(/^\s+/, '');
}
/** Parses out the namespace from a Sass `@use` statement. */
function extractNamespaceFromUseStatement(fullImport) {
    const closeQuoteIndex = Math.max(fullImport.lastIndexOf(`"`), fullImport.lastIndexOf(`'`));
    if (closeQuoteIndex > -1) {
        const asExpression = 'as ';
        const asIndex = fullImport.indexOf(asExpression, closeQuoteIndex);
        // If we found an ` as ` expression, we consider the rest of the text as the namespace.
        if (asIndex > -1) {
            return fullImport
                .slice(asIndex + asExpression.length)
                .split(';')[0]
                .trim();
        }
        // Otherwise the namespace is the name of the file that is being imported.
        const lastSlashIndex = fullImport.lastIndexOf('/', closeQuoteIndex);
        if (lastSlashIndex > -1) {
            const fileName = fullImport
                .slice(lastSlashIndex + 1, closeQuoteIndex)
                // Sass allows for leading underscores to be omitted and it technically supports .scss.
                .replace(/^_|(\.import)?\.scss$|\.import$/g, '');
            // Sass ignores `/index` and infers the namespace as the next segment in the path.
            if (fileName === 'index') {
                const nextSlashIndex = fullImport.lastIndexOf('/', lastSlashIndex - 1);
                if (nextSlashIndex > -1) {
                    return fullImport.slice(nextSlashIndex + 1, lastSlashIndex);
                }
            }
            else {
                return fileName;
            }
        }
    }
    throw Error(`Could not extract namespace from import "${fullImport}".`);
}
/**
 * Replaces variables that have been removed with their values.
 * @param content Content of the file to be migrated.
 * @param variables Mapping between variable names and their values.
 */
function replaceRemovedVariables(content, variables) {
    Object.keys(variables).forEach(variableName => {
        // Note that the pattern uses a negative lookahead to exclude
        // variable assignments, because they can't be migrated.
        const regex = new RegExp(`\\$${escapeRegExp(variableName)}(?!\\s+:|[-_a-zA-Z0-9:])`, 'g');
        content = content.replace(regex, variables[variableName]);
    });
    return content;
}
/**
 * Replaces all of the comments in a Sass file with placeholders and
 * returns the list of placeholders so they can be restored later.
 */
function escapeComments(content) {
    const placeholders = {};
    let commentCounter = 0;
    let [openIndex, closeIndex] = findComment(content);
    while (openIndex > -1 && closeIndex > -1) {
        const placeholder = commentPlaceholderStart + commentCounter++ + commentPlaceholderEnd;
        placeholders[placeholder] = content.slice(openIndex, closeIndex);
        content = content.slice(0, openIndex) + placeholder + content.slice(closeIndex);
        [openIndex, closeIndex] = findComment(content);
    }
    return { content, placeholders };
}
/** Finds the start and end index of a comment in a file. */
function findComment(content) {
    // Add an extra new line at the end so that we can correctly capture single-line comments
    // at the end of the file. It doesn't really matter that the end index will be out of bounds,
    // because `String.prototype.slice` will clamp it to the string length.
    content += '\n';
    for (const [open, close] of commentPairs.entries()) {
        const openIndex = content.indexOf(open);
        if (openIndex > -1) {
            const closeIndex = content.indexOf(close, openIndex + 1);
            return closeIndex > -1 ? [openIndex, closeIndex + close.length] : [-1, -1];
        }
    }
    return [-1, -1];
}
/** Restores the comments that have been escaped by `escapeComments`. */
function restoreComments(content, placeholders) {
    Object.keys(placeholders).forEach(key => (content = content.replace(key, placeholders[key])));
    return content;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxQ0FRa0I7QUFlbEIsMkRBQTJEO0FBQzNELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFpQjtJQUMzQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7SUFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Q0FDYixDQUFDLENBQUM7QUFFSCx1RUFBdUU7QUFDdkUsTUFBTSx1QkFBdUIsR0FBRyxzQ0FBc0MsQ0FBQztBQUV2RSxpREFBaUQ7QUFDakQsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsV0FBbUIsRUFDbkIsaUJBQXlCLEVBQ3pCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixnQkFBd0IsRUFDeEIsdUJBQXFDLEVBQUUsRUFDdkMsZUFBd0I7SUFFeEIsSUFBSSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUQsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUV6RSx3RUFBd0U7SUFDeEUseUVBQXlFO0lBQ3pFLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pGLE9BQU8sR0FBRyxzQkFBc0IsQ0FD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LFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxPQUFPLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVFO0tBQ0Y7SUFFRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBRUQsd0VBQXdFO0FBQ3hFLFNBQVMsZUFBZSxDQUFDLE9BQWUsRUFBRSxZQUFvQztJQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIG1hdGVyaWFsTWl4aW5zLFxuICBtYXRlcmlhbEZ1bmN0aW9ucyxcbiAgbWF0ZXJpYWxWYXJpYWJsZXMsXG4gIGNka01peGlucyxcbiAgY2RrVmFyaWFibGVzLFxuICByZW1vdmVkTWF0ZXJpYWxWYXJpYWJsZXMsXG4gIHVucHJlZml4ZWRSZW1vdmVkVmFyaWFibGVzLFxufSBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKiBUaGUgcmVzdWx0IG9mIGEgc2VhcmNoIGZvciBpbXBvcnRzIGFuZCBuYW1lc3BhY2VzIGluIGEgZmlsZS4gKi9cbmludGVyZmFjZSBEZXRlY3RJbXBvcnRSZXN1bHQge1xuICBpbXBvcnRzOiBzdHJpbmdbXTtcbiAgbmFtZXNwYWNlczogc3RyaW5nW107XG59XG5cbi8qKiBBZGRpdGlvbiBtaXhpbiBhbmQgZnVuY3Rpb24gbmFtZXMgdGhhdCBjYW4gYmUgdXBkYXRlZCB3aGVuIGludm9raW5nIG1pZ3JhdGlvbiBkaXJlY3RseS4gKi9cbmludGVyZmFjZSBFeHRyYVN5bWJvbHMge1xuICBtaXhpbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBmdW5jdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB2YXJpYWJsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKiogUG9zc2libGUgcGFpcnMgb2YgY29tbWVudCBjaGFyYWN0ZXJzIGluIGEgU2FzcyBmaWxlLiAqL1xuY29uc3QgY29tbWVudFBhaXJzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oW1xuICBbJy8qJywgJyovJ10sXG4gIFsnLy8nLCAnXFxuJ10sXG5dKTtcblxuLyoqIFByZWZpeCBmb3IgdGhlIHBsYWNlaG9sZGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGVzY2FwZSBjb21tZW50cy4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0ID0gJ19fPDxuZ1RoZW1pbmdNaWdyYXRpb25Fc2NhcGVkQ29tbWVudCc7XG5cbi8qKiBTdWZmaXggZm9yIHRoZSBjb21tZW50IGVzY2FwZSBwbGFjZWhvbGRlci4gKi9cbmNvbnN0IGNvbW1lbnRQbGFjZWhvbGRlckVuZCA9ICc+Pl9fJztcblxuLyoqXG4gKiBNaWdyYXRlcyB0aGUgY29udGVudCBvZiBhIGZpbGUgdG8gdGhlIG5ldyB0aGVtaW5nIEFQSS4gTm90ZSB0aGF0IHRoaXMgbWlncmF0aW9uIGlzIHVzaW5nIHBsYWluXG4gKiBzdHJpbmcgbWFuaXB1bGF0aW9uLCByYXRoZXIgdGhhbiB0aGUgQVNUIGZyb20gUG9zdENTUyBhbmQgdGhlIHNjaGVtYXRpY3Mgc3RyaW5nIG1hbmlwdWxhdGlvblxuICogQVBJcywgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gcnVuIGl0IGluc2lkZSBnMyBhbmQgdG8gYXZvaWQgaW50cm9kdWNpbmcgbmV3IGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSBmaWxlQ29udGVudCBDb250ZW50IG9mIHRoZSBmaWxlLlxuICogQHBhcmFtIG9sZE1hdGVyaWFsUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgTWF0ZXJpYWwgaW1wb3J0cyBzaG91bGQgc3RhcnQuXG4gKiAgIEhhcyB0byBlbmQgd2l0aCBhIHNsYXNoLiBFLmcuIGlmIGBAaW1wb3J0ICdAYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJ2Agc2hvdWxkIGJlXG4gKiAgIG1hdGNoZWQsIHRoZSBwcmVmaXggd291bGQgYmUgYEBhbmd1bGFyL21hdGVyaWFsL2AuXG4gKiBAcGFyYW0gb2xkQ2RrUHJlZml4IFByZWZpeCB3aXRoIHdoaWNoIHRoZSBvbGQgQ0RLIGltcG9ydHMgc2hvdWxkIHN0YXJ0LlxuICogICBIYXMgdG8gZW5kIHdpdGggYSBzbGFzaC4gRS5nLiBpZiBgQGltcG9ydCAnQGFuZ3VsYXIvY2RrL292ZXJsYXknYCBzaG91bGQgYmVcbiAqICAgbWF0Y2hlZCwgdGhlIHByZWZpeCB3b3VsZCBiZSBgQGFuZ3VsYXIvY2RrL2AuXG4gKiBAcGFyYW0gbmV3TWF0ZXJpYWxJbXBvcnRQYXRoIE5ldyBpbXBvcnQgdG8gdGhlIE1hdGVyaWFsIHRoZW1pbmcgQVBJIChlLmcuIGBAYW5ndWxhci9tYXRlcmlhbGApLlxuICogQHBhcmFtIG5ld0Nka0ltcG9ydFBhdGggTmV3IGltcG9ydCB0byB0aGUgQ0RLIFNhc3MgQVBJcyAoZS5nLiBgQGFuZ3VsYXIvY2RrYCkuXG4gKiBAcGFyYW0gZXhjbHVkZWRJbXBvcnRzIFBhdHRlcm4gdGhhdCBjYW4gYmUgdXNlZCB0byBleGNsdWRlIGltcG9ydHMgZnJvbSBiZWluZyBwcm9jZXNzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRmlsZUNvbnRlbnQoXG4gIGZpbGVDb250ZW50OiBzdHJpbmcsXG4gIG9sZE1hdGVyaWFsUHJlZml4OiBzdHJpbmcsXG4gIG9sZENka1ByZWZpeDogc3RyaW5nLFxuICBuZXdNYXRlcmlhbEltcG9ydFBhdGg6IHN0cmluZyxcbiAgbmV3Q2RrSW1wb3J0UGF0aDogc3RyaW5nLFxuICBleHRyYU1hdGVyaWFsU3ltYm9sczogRXh0cmFTeW1ib2xzID0ge30sXG4gIGV4Y2x1ZGVkSW1wb3J0cz86IFJlZ0V4cCxcbik6IHN0cmluZyB7XG4gIGxldCB7Y29udGVudCwgcGxhY2Vob2xkZXJzfSA9IGVzY2FwZUNvbW1lbnRzKGZpbGVDb250ZW50KTtcbiAgY29uc3QgbWF0ZXJpYWxSZXN1bHRzID0gZGV0ZWN0SW1wb3J0cyhjb250ZW50LCBvbGRNYXRlcmlhbFByZWZpeCwgZXhjbHVkZWRJbXBvcnRzKTtcbiAgY29uc3QgY2RrUmVzdWx0cyA9IGRldGVjdEltcG9ydHMoY29udGVudCwgb2xkQ2RrUHJlZml4LCBleGNsdWRlZEltcG9ydHMpO1xuXG4gIC8vIFRyeSB0byBtaWdyYXRlIHRoZSBzeW1ib2xzIGV2ZW4gaWYgdGhlcmUgYXJlIG5vIGltcG9ydHMuIFRoaXMgaXMgdXNlZFxuICAvLyB0byBjb3ZlciB0aGUgY2FzZSB3aGVyZSB0aGUgQ29tcG9uZW50cyBzeW1ib2xzIHdlcmUgdXNlZCB0cmFuc2l0aXZlbHkuXG4gIGNvbnRlbnQgPSBtaWdyYXRlQ2RrU3ltYm9scyhjb250ZW50LCBuZXdDZGtJbXBvcnRQYXRoLCBwbGFjZWhvbGRlcnMsIGNka1Jlc3VsdHMpO1xuICBjb250ZW50ID0gbWlncmF0ZU1hdGVyaWFsU3ltYm9scyhcbiAgICBjb250ZW50LFxuICAgIG5ld01hdGVyaWFsSW1wb3J0UGF0aCxcbiAgICBtYXRlcmlhbFJlc3VsdHMsXG4gICAgcGxhY2Vob2xkZXJzLFxuICAgIGV4dHJhTWF0ZXJpYWxTeW1ib2xzLFxuICApO1xuICBjb250ZW50ID0gcmVwbGFjZVJlbW92ZWRWYXJpYWJsZXMoY29udGVudCwgcmVtb3ZlZE1hdGVyaWFsVmFyaWFibGVzKTtcblxuICAvLyBXZSBjYW4gYXNzdW1lIHRoYXQgdGhlIG1pZ3JhdGlvbiBoYXMgdGFrZW4gY2FyZSBvZiBhbnkgQ29tcG9uZW50cyBzeW1ib2xzIHRoYXQgd2VyZVxuICAvLyBpbXBvcnRlZCB0cmFuc2l0aXZlbHkgc28gd2UgY2FuIGFsd2F5cyBkcm9wIHRoZSBvbGQgaW1wb3J0cy4gV2UgYWxzbyBhc3N1bWUgdGhhdCBpbXBvcnRzXG4gIC8vIHRvIHRoZSBuZXcgZW50cnkgcG9pbnRzIGhhdmUgYmVlbiBhZGRlZCBhbHJlYWR5LlxuICBpZiAobWF0ZXJpYWxSZXN1bHRzLmltcG9ydHMubGVuZ3RoKSB7XG4gICAgY29udGVudCA9IHJlcGxhY2VSZW1vdmVkVmFyaWFibGVzKGNvbnRlbnQsIHVucHJlZml4ZWRSZW1vdmVkVmFyaWFibGVzKTtcbiAgICBjb250ZW50ID0gcmVtb3ZlU3RyaW5ncyhjb250ZW50LCBtYXRlcmlhbFJlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICBpZiAoY2RrUmVzdWx0cy5pbXBvcnRzLmxlbmd0aCkge1xuICAgIGNvbnRlbnQgPSByZW1vdmVTdHJpbmdzKGNvbnRlbnQsIGNka1Jlc3VsdHMuaW1wb3J0cyk7XG4gIH1cblxuICByZXR1cm4gcmVzdG9yZUNvbW1lbnRzKGNvbnRlbnQsIHBsYWNlaG9sZGVycyk7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgaW1wb3J0cyB3aXRoIGEgc3BlY2lmaWMgcHJlZml4IGFuZCBleHRyYWN0cyB0aGVpciBuYW1lc3BhY2VzLlxuICogQHBhcmFtIGNvbnRlbnQgRmlsZSBjb250ZW50IGluIHdoaWNoIHRvIGxvb2sgZm9yIGltcG9ydHMuXG4gKiBAcGFyYW0gcHJlZml4IFByZWZpeCB0aGF0IHRoZSBpbXBvcnRzIHNob3VsZCBzdGFydCB3aXRoLlxuICogQHBhcmFtIGV4Y2x1ZGVkSW1wb3J0cyBQYXR0ZXJuIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXhjbHVkZSBpbXBvcnRzIGZyb20gYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5mdW5jdGlvbiBkZXRlY3RJbXBvcnRzKFxuICBjb250ZW50OiBzdHJpbmcsXG4gIHByZWZpeDogc3RyaW5nLFxuICBleGNsdWRlZEltcG9ydHM/OiBSZWdFeHAsXG4pOiBEZXRlY3RJbXBvcnRSZXN1bHQge1xuICBpZiAocHJlZml4W3ByZWZpeC5sZW5ndGggLSAxXSAhPT0gJy8nKSB7XG4gICAgLy8gU29tZSBvZiB0aGUgbG9naWMgZnVydGhlciBkb3duIG1ha2VzIGFzc3VtcHRpb25zIGFib3V0IHRoZSBpbXBvcnQgZGVwdGguXG4gICAgdGhyb3cgRXJyb3IoYFByZWZpeCBcIiR7cHJlZml4fVwiIGhhcyB0byBlbmQgaW4gYSBzbGFzaC5gKTtcbiAgfVxuXG4gIC8vIExpc3Qgb2YgYEB1c2VgIG5hbWVzcGFjZXMgZnJvbSB3aGljaCBBbmd1bGFyIENESy9NYXRlcmlhbCBBUElzIG1heSBiZSByZWZlcmVuY2VkLlxuICAvLyBTaW5jZSB3ZSBrbm93IHRoYXQgdGhlIGxpYnJhcnkgZG9lc24ndCBoYXZlIGFueSBuYW1lIGNvbGxpc2lvbnMsIHdlIGNhbiB0cmVhdCBhbGwgb2YgdGhlc2VcbiAgLy8gbmFtZXNwYWNlcyBhcyBlcXVpdmFsZW50LlxuICBjb25zdCBuYW1lc3BhY2VzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBpbXBvcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgQChpbXBvcnR8dXNlKSArWydcIl1+PyR7ZXNjYXBlUmVnRXhwKHByZWZpeCl9LipbJ1wiXS4qOz9cXG5gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBudWxsO1xuXG4gIHdoaWxlICgobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoY29udGVudCkpKSB7XG4gICAgY29uc3QgW2Z1bGxJbXBvcnQsIHR5cGVdID0gbWF0Y2g7XG5cbiAgICBpZiAoZXhjbHVkZWRJbXBvcnRzPy50ZXN0KGZ1bGxJbXBvcnQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ3VzZScpIHtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4dHJhY3ROYW1lc3BhY2VGcm9tVXNlU3RhdGVtZW50KGZ1bGxJbXBvcnQpO1xuXG4gICAgICBpZiAobmFtZXNwYWNlcy5pbmRleE9mKG5hbWVzcGFjZSkgPT09IC0xKSB7XG4gICAgICAgIG5hbWVzcGFjZXMucHVzaChuYW1lc3BhY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGltcG9ydHMucHVzaChmdWxsSW1wb3J0KTtcbiAgfVxuXG4gIHJldHVybiB7aW1wb3J0cywgbmFtZXNwYWNlc307XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgTWF0ZXJpYWwgc3ltYm9scyBpbiBhIGZpbGUuICovXG5mdW5jdGlvbiBtaWdyYXRlTWF0ZXJpYWxTeW1ib2xzKFxuICBjb250ZW50OiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgZGV0ZWN0ZWRJbXBvcnRzOiBEZXRlY3RJbXBvcnRSZXN1bHQsXG4gIGNvbW1lbnRQbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gIGV4dHJhTWF0ZXJpYWxTeW1ib2xzOiBFeHRyYVN5bWJvbHMgPSB7fSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ21hdCc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb25zdCBtaXhpbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbE1peGlucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMubWl4aW5zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICBtaXhpbnNUb1VwZGF0ZSxcbiAgICBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSksXG4gICk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgZnVuY3Rpb25zLlxuICBjb25zdCBmdW5jdGlvbnNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbEZ1bmN0aW9ucywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMuZnVuY3Rpb25zfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICBmdW5jdGlvbnNUb1VwZGF0ZSxcbiAgICBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBmdW5jdGlvbktleUZvcm1hdHRlcixcbiAgICBnZXRGdW5jdGlvblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSksXG4gICk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb25zdCB2YXJpYWJsZXNUb1VwZGF0ZSA9IHsuLi5tYXRlcmlhbFZhcmlhYmxlcywgLi4uZXh0cmFNYXRlcmlhbFN5bWJvbHMudmFyaWFibGVzfTtcbiAgY29udGVudCA9IHJlbmFtZVN5bWJvbHMoXG4gICAgY29udGVudCxcbiAgICB2YXJpYWJsZXNUb1VwZGF0ZSxcbiAgICBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICB2YXJpYWJsZUtleUZvcm1hdHRlcixcbiAgICBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSksXG4gICk7XG5cbiAgaWYgKGNvbnRlbnQgIT09IGluaXRpYWxDb250ZW50KSB7XG4gICAgLy8gQWRkIGFuIGltcG9ydCB0byB0aGUgbmV3IEFQSSBvbmx5IGlmIGFueSBvZiB0aGUgQVBJcyB3ZXJlIGJlaW5nIHVzZWQuXG4gICAgY29udGVudCA9IGluc2VydFVzZVN0YXRlbWVudChjb250ZW50LCBpbXBvcnRQYXRoLCBuYW1lc3BhY2UsIGNvbW1lbnRQbGFjZWhvbGRlcnMpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKiBNaWdyYXRlcyB0aGUgQ0RLIHN5bWJvbHMgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gbWlncmF0ZUNka1N5bWJvbHMoXG4gIGNvbnRlbnQ6IHN0cmluZyxcbiAgaW1wb3J0UGF0aDogc3RyaW5nLFxuICBjb21tZW50UGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICBkZXRlY3RlZEltcG9ydHM6IERldGVjdEltcG9ydFJlc3VsdCxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGluaXRpYWxDb250ZW50ID0gY29udGVudDtcbiAgY29uc3QgbmFtZXNwYWNlID0gJ2Nkayc7XG5cbiAgLy8gTWlncmF0ZSB0aGUgbWl4aW5zLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhcbiAgICBjb250ZW50LFxuICAgIGNka01peGlucyxcbiAgICBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICBtaXhpbktleUZvcm1hdHRlcixcbiAgICBnZXRNaXhpblZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSksXG4gICk7XG5cbiAgLy8gTWlncmF0ZSB0aGUgdmFyaWFibGVzLlxuICBjb250ZW50ID0gcmVuYW1lU3ltYm9scyhcbiAgICBjb250ZW50LFxuICAgIGNka1ZhcmlhYmxlcyxcbiAgICBkZXRlY3RlZEltcG9ydHMubmFtZXNwYWNlcyxcbiAgICB2YXJpYWJsZUtleUZvcm1hdHRlcixcbiAgICBnZXRWYXJpYWJsZVZhbHVlRm9ybWF0dGVyKG5hbWVzcGFjZSksXG4gICk7XG5cbiAgLy8gUHJldmlvdXNseSB0aGUgQ0RLIHN5bWJvbHMgd2VyZSBleHBvc2VkIHRocm91Z2ggYG1hdGVyaWFsL3RoZW1pbmdgLCBidXQgbm93IHdlIGhhdmUgYVxuICAvLyBkZWRpY2F0ZWQgZW50cnlwb2ludCBmb3IgdGhlIENESy4gT25seSBhZGQgYW4gaW1wb3J0IGZvciBpdCBpZiBhbnkgb2YgdGhlIHN5bWJvbHMgYXJlIHVzZWQuXG4gIGlmIChjb250ZW50ICE9PSBpbml0aWFsQ29udGVudCkge1xuICAgIGNvbnRlbnQgPSBpbnNlcnRVc2VTdGF0ZW1lbnQoY29udGVudCwgaW1wb3J0UGF0aCwgbmFtZXNwYWNlLCBjb21tZW50UGxhY2Vob2xkZXJzKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlbmFtZXMgYWxsIFNhc3Mgc3ltYm9scyBpbiBhIGZpbGUgYmFzZWQgb24gYSBwcmUtZGVmaW5lZCBtYXBwaW5nLlxuICogQHBhcmFtIGNvbnRlbnQgQ29udGVudCBvZiBhIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gbWFwcGluZyBNYXBwaW5nIGJldHdlZW4gc3ltYm9sIG5hbWVzIGFuZCB0aGVpciByZXBsYWNlbWVudHMuXG4gKiBAcGFyYW0gbmFtZXNwYWNlcyBOYW1lcyB0byBpdGVyYXRlIG92ZXIgYW5kIHBhc3MgdG8gZ2V0S2V5UGF0dGVybi5cbiAqIEBwYXJhbSBnZXRLZXlQYXR0ZXJuIEZ1bmN0aW9uIHVzZWQgdG8gdHVybiBlYWNoIG9mIHRoZSBrZXlzIGludG8gYSByZWdleC5cbiAqIEBwYXJhbSBmb3JtYXRWYWx1ZSBGb3JtYXRzIHRoZSB2YWx1ZSB0aGF0IHdpbGwgcmVwbGFjZSBhbnkgbWF0Y2hlcyBvZiB0aGUgcGF0dGVybiByZXR1cm5lZCBieVxuICogIGBnZXRLZXlQYXR0ZXJuYC5cbiAqL1xuZnVuY3Rpb24gcmVuYW1lU3ltYm9scyhcbiAgY29udGVudDogc3RyaW5nLFxuICBtYXBwaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICBuYW1lc3BhY2VzOiBzdHJpbmdbXSxcbiAgZ2V0S2V5UGF0dGVybjogKG5hbWVzcGFjZTogc3RyaW5nIHwgbnVsbCwga2V5OiBzdHJpbmcpID0+IFJlZ0V4cCxcbiAgZm9ybWF0VmFsdWU6IChrZXk6IHN0cmluZykgPT4gc3RyaW5nLFxuKTogc3RyaW5nIHtcbiAgLy8gVGhlIG51bGwgYXQgdGhlIGVuZCBpcyBzbyB0aGF0IHdlIG1ha2Ugb25lIGxhc3QgcGFzcyB0byBjb3ZlciBub24tbmFtZXNwYWNlZCBzeW1ib2xzLlxuICBbLi4ubmFtZXNwYWNlcy5zbGljZSgpLCBudWxsXS5mb3JFYWNoKG5hbWVzcGFjZSA9PiB7XG4gICAgT2JqZWN0LmtleXMobWFwcGluZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IGdldEtleVBhdHRlcm4obmFtZXNwYWNlLCBrZXkpO1xuXG4gICAgICAvLyBTYW5pdHkgY2hlY2sgc2luY2Ugbm9uLWdsb2JhbCByZWdleGVzIHdpbGwgb25seSByZXBsYWNlIHRoZSBmaXJzdCBtYXRjaC5cbiAgICAgIGlmIChwYXR0ZXJuLmZsYWdzLmluZGV4T2YoJ2cnKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1JlcGxhY2VtZW50IHBhdHRlcm4gbXVzdCBiZSBnbG9iYWwuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocGF0dGVybiwgZm9ybWF0VmFsdWUobWFwcGluZ1trZXldKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKiogSW5zZXJ0cyBhbiBgQHVzZWAgc3RhdGVtZW50IGluIGEgc3RyaW5nLiAqL1xuZnVuY3Rpb24gaW5zZXJ0VXNlU3RhdGVtZW50KFxuICBjb250ZW50OiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZyxcbiAgbmFtZXNwYWNlOiBzdHJpbmcsXG4gIGNvbW1lbnRQbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcge1xuICAvLyBJZiB0aGUgY29udGVudCBhbHJlYWR5IGhhcyB0aGUgYEB1c2VgIGltcG9ydCwgd2UgZG9uJ3QgbmVlZCB0byBhZGQgYW55dGhpbmcuXG4gIGlmIChuZXcgUmVnRXhwKGBAdXNlICtbJ1wiXSR7aW1wb3J0UGF0aH1bJ1wiXWAsICdnJykudGVzdChjb250ZW50KSkge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgLy8gU2FzcyB3aWxsIHRocm93IGFuIGVycm9yIGlmIGFuIGBAdXNlYCBzdGF0ZW1lbnQgY29tZXMgYWZ0ZXIgYW5vdGhlciBzdGF0ZW1lbnQuIFRoZSBzYWZlc3Qgd2F5XG4gIC8vIHRvIGVuc3VyZSB0aGF0IHdlIGNvbmZvcm0gdG8gdGhhdCByZXF1aXJlbWVudCBpcyBieSBhbHdheXMgaW5zZXJ0aW5nIG91ciBpbXBvcnRzIGF0IHRoZSB0b3BcbiAgLy8gb2YgdGhlIGZpbGUuIERldGVjdGluZyB3aGVyZSB0aGUgdXNlcidzIGNvbnRlbnQgc3RhcnRzIGlzIHRyaWNreSwgYmVjYXVzZSB0aGVyZSBhcmUgbWFueVxuICAvLyBkaWZmZXJlbnQga2luZHMgb2Ygc3ludGF4IHdlJ2QgaGF2ZSB0byBhY2NvdW50IGZvci4gT25lIGFwcHJvYWNoIGlzIHRvIGZpbmQgdGhlIGZpcnN0IGBAaW1wb3J0YFxuICAvLyBhbmQgaW5zZXJ0IGJlZm9yZSBpdCwgYnV0IHRoZSBwcm9ibGVtIGlzIHRoYXQgU2FzcyBhbGxvd3MgYEBpbXBvcnRgIHRvIGJlIHBsYWNlZCBhbnl3aGVyZS5cbiAgbGV0IG5ld0ltcG9ydEluZGV4ID0gMDtcblxuICAvLyBPbmUgc3BlY2lhbCBjYXNlIGlzIGlmIHRoZSBmaWxlIHN0YXJ0cyB3aXRoIGEgbGljZW5zZSBoZWFkZXIgd2hpY2ggd2Ugd2FudCB0byBwcmVzZXJ2ZSBvbiB0b3AuXG4gIGlmIChjb250ZW50LnRyaW0oKS5zdGFydHNXaXRoKGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0KSkge1xuICAgIGNvbnN0IGNvbW1lbnRTdGFydEluZGV4ID0gY29udGVudC5pbmRleE9mKGNvbW1lbnRQbGFjZWhvbGRlclN0YXJ0KTtcbiAgICBuZXdJbXBvcnRJbmRleCA9XG4gICAgICBjb250ZW50LmluZGV4T2YoY29tbWVudFBsYWNlaG9sZGVyRW5kLCBjb21tZW50U3RhcnRJbmRleCArIDEpICsgY29tbWVudFBsYWNlaG9sZGVyRW5kLmxlbmd0aDtcbiAgICAvLyBJZiB0aGUgbGVhZGluZyBjb21tZW50IGRvZXNuJ3QgZW5kIHdpdGggYSBuZXdsaW5lLFxuICAgIC8vIHdlIG5lZWQgdG8gaW5zZXJ0IHRoZSBpbXBvcnQgYXQgdGhlIG5leHQgbGluZS5cbiAgICBpZiAoIWNvbW1lbnRQbGFjZWhvbGRlcnNbY29udGVudC5zbGljZShjb21tZW50U3RhcnRJbmRleCwgbmV3SW1wb3J0SW5kZXgpXS5lbmRzV2l0aCgnXFxuJykpIHtcbiAgICAgIG5ld0ltcG9ydEluZGV4ID0gTWF0aC5tYXgobmV3SW1wb3J0SW5kZXgsIGNvbnRlbnQuaW5kZXhPZignXFxuJywgbmV3SW1wb3J0SW5kZXgpICsgMSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICBjb250ZW50LnNsaWNlKDAsIG5ld0ltcG9ydEluZGV4KSArXG4gICAgYEB1c2UgJyR7aW1wb3J0UGF0aH0nIGFzICR7bmFtZXNwYWNlfTtcXG5gICtcbiAgICBjb250ZW50LnNsaWNlKG5ld0ltcG9ydEluZGV4KVxuICApO1xufVxuXG4vKiogRm9ybWF0cyBhIG1pZ3JhdGlvbiBrZXkgYXMgYSBTYXNzIG1peGluIGludm9jYXRpb24uICovXG5mdW5jdGlvbiBtaXhpbktleUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyB8IG51bGwsIG5hbWU6IHN0cmluZyk6IFJlZ0V4cCB7XG4gIC8vIE5vdGUgdGhhdCBhZGRpbmcgYSBgKGAgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiB3b3VsZCBiZSBtb3JlIGFjY3VyYXRlLCBidXQgbWl4aW5cbiAgLy8gaW52b2NhdGlvbnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbmNsdWRlIHRoZSBwYXJlbnRoZXNlcy4gV2UgY291bGQgYWRkIGBbKDtdYCxcbiAgLy8gYnV0IHRoZW4gd2Ugd29uJ3Qga25vdyB3aGljaCBjaGFyYWN0ZXIgdG8gaW5jbHVkZSBpbiB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLlxuICByZXR1cm4gbmV3IFJlZ0V4cChgQGluY2x1ZGUgKyR7ZXNjYXBlUmVnRXhwKChuYW1lc3BhY2UgPyBuYW1lc3BhY2UgKyAnLicgOiAnJykgKyBuYW1lKX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBtaXhpbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldE1peGluVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICAvLyBOb3RlIHRoYXQgYWRkaW5nIGEgYChgIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gd291bGQgYmUgbW9yZSBhY2N1cmF0ZSxcbiAgLy8gYnV0IG1peGluIGludm9jYXRpb25zIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gaW5jbHVkZSB0aGUgcGFyZW50aGVzZXMuXG4gIHJldHVybiBuYW1lID0+IGBAaW5jbHVkZSAke25hbWVzcGFjZX0uJHtuYW1lfWA7XG59XG5cbi8qKiBGb3JtYXRzIGEgbWlncmF0aW9uIGtleSBhcyBhIFNhc3MgZnVuY3Rpb24gaW52b2NhdGlvbi4gKi9cbmZ1bmN0aW9uIGZ1bmN0aW9uS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nIHwgbnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgY29uc3QgZnVuY3Rpb25OYW1lID0gZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSR7bmFtZX0oYCk7XG4gIHJldHVybiBuZXcgUmVnRXhwKGAoPzwhWy1fYS16QS1aMC05XSkke2Z1bmN0aW9uTmFtZX1gLCAnZycpO1xufVxuXG4vKiogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZm9ybWF0IGEgU2FzcyBmdW5jdGlvbiByZXBsYWNlbWVudC4gKi9cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uVmFsdWVGb3JtYXR0ZXIobmFtZXNwYWNlOiBzdHJpbmcpOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSA9PiBgJHtuYW1lc3BhY2V9LiR7bmFtZX0oYDtcbn1cblxuLyoqIEZvcm1hdHMgYSBtaWdyYXRpb24ga2V5IGFzIGEgU2FzcyB2YXJpYWJsZS4gKi9cbmZ1bmN0aW9uIHZhcmlhYmxlS2V5Rm9ybWF0dGVyKG5hbWVzcGFjZTogc3RyaW5nIHwgbnVsbCwgbmFtZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgY29uc3QgdmFyaWFibGVOYW1lID0gZXNjYXBlUmVnRXhwKGAke25hbWVzcGFjZSA/IG5hbWVzcGFjZSArICcuJyA6ICcnfSQke25hbWV9YCk7XG4gIHJldHVybiBuZXcgUmVnRXhwKGAke3ZhcmlhYmxlTmFtZX0oPyFbLV9hLXpBLVowLTldKWAsICdnJyk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgYSBTYXNzIHZhcmlhYmxlIHJlcGxhY2VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVWYWx1ZUZvcm1hdHRlcihuYW1lc3BhY2U6IHN0cmluZyk6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB7XG4gIHJldHVybiBuYW1lID0+IGAke25hbWVzcGFjZX0uJCR7bmFtZX1gO1xufVxuXG4vKiogRXNjYXBlcyBzcGVjaWFsIHJlZ2V4IGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqIFJlbW92ZXMgYWxsIHN0cmluZ3MgZnJvbSBhbm90aGVyIHN0cmluZy4gKi9cbmZ1bmN0aW9uIHJlbW92ZVN0cmluZ3MoY29udGVudDogc3RyaW5nLCB0b1JlbW92ZTogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gdG9SZW1vdmVcbiAgICAucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudCkgPT4gYWNjdW11bGF0b3IucmVwbGFjZShjdXJyZW50LCAnJyksIGNvbnRlbnQpXG4gICAgLnJlcGxhY2UoL15cXHMrLywgJycpO1xufVxuXG4vKiogUGFyc2VzIG91dCB0aGUgbmFtZXNwYWNlIGZyb20gYSBTYXNzIGBAdXNlYCBzdGF0ZW1lbnQuICovXG5mdW5jdGlvbiBleHRyYWN0TmFtZXNwYWNlRnJvbVVzZVN0YXRlbWVudChmdWxsSW1wb3J0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjbG9zZVF1b3RlSW5kZXggPSBNYXRoLm1heChmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGBcImApLCBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKGAnYCkpO1xuXG4gIGlmIChjbG9zZVF1b3RlSW5kZXggPiAtMSkge1xuICAgIGNvbnN0IGFzRXhwcmVzc2lvbiA9ICdhcyAnO1xuICAgIGNvbnN0IGFzSW5kZXggPSBmdWxsSW1wb3J0LmluZGV4T2YoYXNFeHByZXNzaW9uLCBjbG9zZVF1b3RlSW5kZXgpO1xuXG4gICAgLy8gSWYgd2UgZm91bmQgYW4gYCBhcyBgIGV4cHJlc3Npb24sIHdlIGNvbnNpZGVyIHRoZSByZXN0IG9mIHRoZSB0ZXh0IGFzIHRoZSBuYW1lc3BhY2UuXG4gICAgaWYgKGFzSW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGZ1bGxJbXBvcnRcbiAgICAgICAgLnNsaWNlKGFzSW5kZXggKyBhc0V4cHJlc3Npb24ubGVuZ3RoKVxuICAgICAgICAuc3BsaXQoJzsnKVswXVxuICAgICAgICAudHJpbSgpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB0aGUgbmFtZXNwYWNlIGlzIHRoZSBuYW1lIG9mIHRoZSBmaWxlIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWQuXG4gICAgY29uc3QgbGFzdFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgY2xvc2VRdW90ZUluZGV4KTtcblxuICAgIGlmIChsYXN0U2xhc2hJbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGZ1bGxJbXBvcnRcbiAgICAgICAgLnNsaWNlKGxhc3RTbGFzaEluZGV4ICsgMSwgY2xvc2VRdW90ZUluZGV4KVxuICAgICAgICAvLyBTYXNzIGFsbG93cyBmb3IgbGVhZGluZyB1bmRlcnNjb3JlcyB0byBiZSBvbWl0dGVkIGFuZCBpdCB0ZWNobmljYWxseSBzdXBwb3J0cyAuc2Nzcy5cbiAgICAgICAgLnJlcGxhY2UoL15ffChcXC5pbXBvcnQpP1xcLnNjc3MkfFxcLmltcG9ydCQvZywgJycpO1xuXG4gICAgICAvLyBTYXNzIGlnbm9yZXMgYC9pbmRleGAgYW5kIGluZmVycyB0aGUgbmFtZXNwYWNlIGFzIHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHBhdGguXG4gICAgICBpZiAoZmlsZU5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgICAgY29uc3QgbmV4dFNsYXNoSW5kZXggPSBmdWxsSW1wb3J0Lmxhc3RJbmRleE9mKCcvJywgbGFzdFNsYXNoSW5kZXggLSAxKTtcblxuICAgICAgICBpZiAobmV4dFNsYXNoSW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmdWxsSW1wb3J0LnNsaWNlKG5leHRTbGFzaEluZGV4ICsgMSwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBleHRyYWN0IG5hbWVzcGFjZSBmcm9tIGltcG9ydCBcIiR7ZnVsbEltcG9ydH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlcyB2YXJpYWJsZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCB3aXRoIHRoZWlyIHZhbHVlcy5cbiAqIEBwYXJhbSBjb250ZW50IENvbnRlbnQgb2YgdGhlIGZpbGUgdG8gYmUgbWlncmF0ZWQuXG4gKiBAcGFyYW0gdmFyaWFibGVzIE1hcHBpbmcgYmV0d2VlbiB2YXJpYWJsZSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVtb3ZlZFZhcmlhYmxlcyhjb250ZW50OiBzdHJpbmcsIHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHZhcmlhYmxlcykuZm9yRWFjaCh2YXJpYWJsZU5hbWUgPT4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgcGF0dGVybiB1c2VzIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIGV4Y2x1ZGVcbiAgICAvLyB2YXJpYWJsZSBhc3NpZ25tZW50cywgYmVjYXVzZSB0aGV5IGNhbid0IGJlIG1pZ3JhdGVkLlxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXCQke2VzY2FwZVJlZ0V4cCh2YXJpYWJsZU5hbWUpfSg/IVxcXFxzKzp8Wy1fYS16QS1aMC05Ol0pYCwgJ2cnKTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHJlZ2V4LCB2YXJpYWJsZXNbdmFyaWFibGVOYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgY29tbWVudHMgaW4gYSBTYXNzIGZpbGUgd2l0aCBwbGFjZWhvbGRlcnMgYW5kXG4gKiByZXR1cm5zIHRoZSBsaXN0IG9mIHBsYWNlaG9sZGVycyBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlQ29tbWVudHMoY29udGVudDogc3RyaW5nKToge2NvbnRlbnQ6IHN0cmluZzsgcGxhY2Vob2xkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSB7XG4gIGNvbnN0IHBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgY29tbWVudENvdW50ZXIgPSAwO1xuICBsZXQgW29wZW5JbmRleCwgY2xvc2VJbmRleF0gPSBmaW5kQ29tbWVudChjb250ZW50KTtcblxuICB3aGlsZSAob3BlbkluZGV4ID4gLTEgJiYgY2xvc2VJbmRleCA+IC0xKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBjb21tZW50UGxhY2Vob2xkZXJTdGFydCArIGNvbW1lbnRDb3VudGVyKysgKyBjb21tZW50UGxhY2Vob2xkZXJFbmQ7XG4gICAgcGxhY2Vob2xkZXJzW3BsYWNlaG9sZGVyXSA9IGNvbnRlbnQuc2xpY2Uob3BlbkluZGV4LCBjbG9zZUluZGV4KTtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgwLCBvcGVuSW5kZXgpICsgcGxhY2Vob2xkZXIgKyBjb250ZW50LnNsaWNlKGNsb3NlSW5kZXgpO1xuICAgIFtvcGVuSW5kZXgsIGNsb3NlSW5kZXhdID0gZmluZENvbW1lbnQoY29udGVudCk7XG4gIH1cblxuICByZXR1cm4ge2NvbnRlbnQsIHBsYWNlaG9sZGVyc307XG59XG5cbi8qKiBGaW5kcyB0aGUgc3RhcnQgYW5kIGVuZCBpbmRleCBvZiBhIGNvbW1lbnQgaW4gYSBmaWxlLiAqL1xuZnVuY3Rpb24gZmluZENvbW1lbnQoY29udGVudDogc3RyaW5nKTogW29wZW5JbmRleDogbnVtYmVyLCBjbG9zZUluZGV4OiBudW1iZXJdIHtcbiAgLy8gQWRkIGFuIGV4dHJhIG5ldyBsaW5lIGF0IHRoZSBlbmQgc28gdGhhdCB3ZSBjYW4gY29ycmVjdGx5IGNhcHR1cmUgc2luZ2xlLWxpbmUgY29tbWVudHNcbiAgLy8gYXQgdGhlIGVuZCBvZiB0aGUgZmlsZS4gSXQgZG9lc24ndCByZWFsbHkgbWF0dGVyIHRoYXQgdGhlIGVuZCBpbmRleCB3aWxsIGJlIG91dCBvZiBib3VuZHMsXG4gIC8vIGJlY2F1c2UgYFN0cmluZy5wcm90b3R5cGUuc2xpY2VgIHdpbGwgY2xhbXAgaXQgdG8gdGhlIHN0cmluZyBsZW5ndGguXG4gIGNvbnRlbnQgKz0gJ1xcbic7XG5cbiAgZm9yIChjb25zdCBbb3BlbiwgY2xvc2VdIG9mIGNvbW1lbnRQYWlycy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBvcGVuSW5kZXggPSBjb250ZW50LmluZGV4T2Yob3Blbik7XG5cbiAgICBpZiAob3BlbkluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGNsb3NlSW5kZXggPSBjb250ZW50LmluZGV4T2YoY2xvc2UsIG9wZW5JbmRleCArIDEpO1xuICAgICAgcmV0dXJuIGNsb3NlSW5kZXggPiAtMSA/IFtvcGVuSW5kZXgsIGNsb3NlSW5kZXggKyBjbG9zZS5sZW5ndGhdIDogWy0xLCAtMV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFstMSwgLTFdO1xufVxuXG4vKiogUmVzdG9yZXMgdGhlIGNvbW1lbnRzIHRoYXQgaGF2ZSBiZWVuIGVzY2FwZWQgYnkgYGVzY2FwZUNvbW1lbnRzYC4gKi9cbmZ1bmN0aW9uIHJlc3RvcmVDb21tZW50cyhjb250ZW50OiBzdHJpbmcsIHBsYWNlaG9sZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIE9iamVjdC5rZXlzKHBsYWNlaG9sZGVycykuZm9yRWFjaChrZXkgPT4gKGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uoa2V5LCBwbGFjZWhvbGRlcnNba2V5XSkpKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4iXX0=