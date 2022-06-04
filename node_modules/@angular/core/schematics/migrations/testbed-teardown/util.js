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
        define("@angular/core/schematics/migrations/testbed-teardown/util", ["require", "exports", "typescript", "@angular/core/schematics/utils/typescript/imports", "@angular/core/schematics/utils/typescript/symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateTestModuleMetadataLiteral = exports.getInitTestEnvironmentLiteralReplacement = exports.findTestModuleMetadataNodes = exports.findInitTestEnvironmentCalls = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    const imports_1 = require("@angular/core/schematics/utils/typescript/imports");
    const symbol_1 = require("@angular/core/schematics/utils/typescript/symbol");
    /** Finds the `initTestEnvironment` calls that need to be migrated. */
    function findInitTestEnvironmentCalls(typeChecker, allSourceFiles) {
        const callsToMigrate = new Set();
        let totalCalls = 0;
        allSourceFiles.forEach(sourceFile => {
            sourceFile.forEachChild(function walk(node) {
                if (typescript_1.default.isCallExpression(node) && typescript_1.default.isPropertyAccessExpression(node.expression) &&
                    typescript_1.default.isIdentifier(node.expression.name) &&
                    node.expression.name.text === 'initTestEnvironment' &&
                    isTestBedAccess(typeChecker, node.expression)) {
                    totalCalls++;
                    if (shouldMigrateInitTestEnvironment(node)) {
                        callsToMigrate.add(node);
                    }
                }
                node.forEachChild(walk);
            });
        });
        return {
            // Sort the nodes so that they will be migrated in reverse source order (nodes at the end of
            // the file are migrated first). This avoids issues where a migrated node will offset the
            // bounds of all nodes that come after it. Note that the nodes here are from all of the
            // passed in source files, but that doesn't matter since the later nodes will still appear
            // after the earlier ones.
            callsToMigrate: sortInReverseSourceOrder(Array.from(callsToMigrate)),
            totalCalls
        };
    }
    exports.findInitTestEnvironmentCalls = findInitTestEnvironmentCalls;
    /** Finds the `configureTestingModule` and `withModule` calls that need to be migrated. */
    function findTestModuleMetadataNodes(typeChecker, sourceFile) {
        const testModuleMetadataLiterals = new Set();
        const withModuleImport = (0, imports_1.getImportSpecifier)(sourceFile, '@angular/core/testing', 'withModule');
        sourceFile.forEachChild(function walk(node) {
            if (typescript_1.default.isCallExpression(node)) {
                const isConfigureTestingModuleCall = typescript_1.default.isPropertyAccessExpression(node.expression) &&
                    typescript_1.default.isIdentifier(node.expression.name) &&
                    node.expression.name.text === 'configureTestingModule' &&
                    isTestBedAccess(typeChecker, node.expression) && shouldMigrateModuleConfigCall(node);
                const isWithModuleCall = withModuleImport && typescript_1.default.isIdentifier(node.expression) &&
                    (0, symbol_1.isReferenceToImport)(typeChecker, node.expression, withModuleImport) &&
                    shouldMigrateModuleConfigCall(node);
                if (isConfigureTestingModuleCall || isWithModuleCall) {
                    testModuleMetadataLiterals.add(node.arguments[0]);
                }
            }
            node.forEachChild(walk);
        });
        // Sort the nodes so that they will be migrated in reverse source order (nodes at the end of
        // the file are migrated first). This avoids issues where a migrated node will offset the
        // bounds of all nodes that come after it.
        return sortInReverseSourceOrder(Array.from(testModuleMetadataLiterals));
    }
    exports.findTestModuleMetadataNodes = findTestModuleMetadataNodes;
    /**
     * Gets data that can be used to migrate a call to `TestBed.initTestEnvironment`.
     * The returned `span` is used to mark the text that should be replaced while the `text`
     * is the code that should be inserted instead.
     */
    function getInitTestEnvironmentLiteralReplacement(node, printer) {
        const literalProperties = [];
        const lastArg = node.arguments[node.arguments.length - 1];
        let span;
        let prefix;
        if (node.arguments.length > 2) {
            if (isFunction(lastArg)) {
                // If the last argument is a function, add the function as the `aotSummaries` property.
                literalProperties.push(typescript_1.default.createPropertyAssignment('aotSummaries', lastArg));
            }
            else if (typescript_1.default.isObjectLiteralExpression(lastArg)) {
                // If the property is an object literal, copy over all the properties.
                literalProperties.push(...lastArg.properties);
            }
            prefix = '';
            span = { start: lastArg.getStart(), end: lastArg.getEnd(), length: lastArg.getWidth() };
        }
        else {
            const start = lastArg.getEnd();
            prefix = ', ';
            span = { start, end: start, length: 0 };
        }
        // Finally push the teardown object so that it appears last.
        literalProperties.push(createTeardownAssignment());
        return {
            span,
            text: prefix +
                printer.printNode(typescript_1.default.EmitHint.Unspecified, typescript_1.default.createObjectLiteral(literalProperties, true), node.getSourceFile())
        };
    }
    exports.getInitTestEnvironmentLiteralReplacement = getInitTestEnvironmentLiteralReplacement;
    /** Migrates an object literal that is passed into `configureTestingModule` or `withModule`. */
    function migrateTestModuleMetadataLiteral(node) {
        return typescript_1.default.createObjectLiteral([...node.properties, createTeardownAssignment()], node.properties.length > 0);
    }
    exports.migrateTestModuleMetadataLiteral = migrateTestModuleMetadataLiteral;
    /** Returns whether a property access points to `TestBed`. */
    function isTestBedAccess(typeChecker, node) {
        var _a, _b;
        const symbolName = (_b = (_a = typeChecker.getTypeAtLocation(node.expression)) === null || _a === void 0 ? void 0 : _a.getSymbol()) === null || _b === void 0 ? void 0 : _b.getName();
        return symbolName === 'TestBed' || symbolName === 'TestBedStatic';
    }
    /** Whether a call to `initTestEnvironment` should be migrated. */
    function shouldMigrateInitTestEnvironment(node) {
        // If there is no third argument, we definitely have to migrate it.
        if (node.arguments.length === 2) {
            return true;
        }
        // This is technically a type error so we shouldn't mess with it.
        if (node.arguments.length < 2) {
            return false;
        }
        // Otherwise we need to figure out if the `teardown` flag is set on the last argument.
        const lastArg = node.arguments[2];
        // Note: the checks below will identify something like `initTestEnvironment(..., ..., {})`,
        // but they'll ignore a variable being passed in as the last argument like `const config = {};
        // initTestEnvironment(..., ..., config)`. While we can resolve the variable to its declaration
        // using `typeChecker.getTypeAtLocation(lastArg).getSymbol()?.valueDeclaration`, we deliberately
        // don't, because it introduces some complexity and we may end up breaking user code. E.g.
        // the `config` from the example above may be passed in to other functions or the `teardown`
        // flag could be added later on by a function call.
        // If the argument is an object literal and there are no
        // properties called `teardown`, we have to migrate it.
        if (isObjectLiteralWithoutTeardown(lastArg)) {
            return true;
        }
        // If the last argument is an `aotSummaries` function, we also have to migrate.
        if (isFunction(lastArg)) {
            return true;
        }
        // Otherwise don't migrate if we couldn't identify the last argument.
        return false;
    }
    /**
     * Whether a call to a module configuration function should be migrated. This covers
     * `TestBed.configureTestingModule` and `withModule` since they both accept `TestModuleMetadata`
     * as their first argument.
     */
    function shouldMigrateModuleConfigCall(node) {
        return node.arguments.length > 0 && isObjectLiteralWithoutTeardown(node.arguments[0]);
    }
    /** Returns whether a node is a function literal. */
    function isFunction(node) {
        return typescript_1.default.isArrowFunction(node) || typescript_1.default.isFunctionExpression(node) ||
            typescript_1.default.isFunctionDeclaration(node);
    }
    /** Checks whether a node is an object literal that doesn't contain a property called `teardown`. */
    function isObjectLiteralWithoutTeardown(node) {
        return typescript_1.default.isObjectLiteralExpression(node) && !node.properties.find(prop => {
            var _a;
            return ((_a = prop.name) === null || _a === void 0 ? void 0 : _a.getText()) === 'teardown';
        });
    }
    /** Creates a teardown configuration property assignment. */
    function createTeardownAssignment() {
        // `teardown: {destroyAfterEach: false}`
        return typescript_1.default.createPropertyAssignment('teardown', typescript_1.default.createObjectLiteral([typescript_1.default.createPropertyAssignment('destroyAfterEach', typescript_1.default.createFalse())]));
    }
    /** Sorts an array of AST nodes in reverse source order. */
    function sortInReverseSourceOrder(nodes) {
        return nodes.sort((a, b) => b.getEnd() - a.getEnd());
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3Rlc3RiZWQtdGVhcmRvd24vdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCw0REFBNEI7SUFFNUIsK0VBQWtFO0lBQ2xFLDZFQUFrRTtJQVVsRSxzRUFBc0U7SUFDdEUsU0FBZ0IsNEJBQTRCLENBQ3hDLFdBQTJCLEVBQUUsY0FBK0I7UUFDOUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFDcEQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFhO2dCQUNqRCxJQUFJLG9CQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUMzRSxvQkFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQjtvQkFDbkQsZUFBZSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ2pELFVBQVUsRUFBRSxDQUFDO29CQUNiLElBQUksZ0NBQWdDLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzFCO2lCQUNGO2dCQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMs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NUQsb0JBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsb0dBQW9HO0lBQ3BHLFNBQVMsOEJBQThCLENBQUMsSUFBYTtRQUNuRCxPQUFPLG9CQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTs7WUFDeEUsT0FBTyxDQUFBLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsT0FBTyxFQUFFLE1BQUssVUFBVSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxTQUFTLHdCQUF3QjtRQUMvQix3Q0FBd0M7UUFDeEMsT0FBTyxvQkFBRSxDQUFDLHdCQUF3QixDQUM5QixVQUFVLEVBQ1Ysb0JBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFFLENBQUMsd0JBQXdCLENBQUMsa0JBQWtCLEVBQUUsb0JBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsU0FBUyx3QkFBd0IsQ0FBb0IsS0FBVTtRQUM3RCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Z2V0SW1wb3J0U3BlY2lmaWVyfSBmcm9tICcuLi8uLi91dGlscy90eXBlc2NyaXB0L2ltcG9ydHMnO1xuaW1wb3J0IHtpc1JlZmVyZW5jZVRvSW1wb3J0fSBmcm9tICcuLi8uLi91dGlscy90eXBlc2NyaXB0L3N5bWJvbCc7XG5cbi8qKiBSZXN1bHQgb2YgYSBmdWxsLXByb2dyYW0gYW5hbHlzaXMgbG9va2luZyBmb3IgYGluaXRUZXN0RW52aXJvbm1lbnRgIGNhbGxzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0VGVzdEVudmlyb25tZW50QW5hbHlzaXMge1xuICAvKiogVG90YWwgbnVtYmVyIG9mIGNhbGxzIHRoYXQgd2VyZSBmb3VuZC4gKi9cbiAgdG90YWxDYWxsczogbnVtYmVyO1xuICAvKiogQ2FsbHMgdGhhdCBuZWVkIHRvIGJlIG1pZ3JhdGVkLiAqL1xuICBjYWxsc1RvTWlncmF0ZTogdHMuQ2FsbEV4cHJlc3Npb25bXTtcbn1cblxuLyoqIEZpbmRzIHRoZSBgaW5pdFRlc3RFbnZpcm9ubWVudGAgY2FsbHMgdGhhdCBuZWVkIHRvIGJlIG1pZ3JhdGVkLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRJbml0VGVzdEVudmlyb25tZW50Q2FsbHMoXG4gICAgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBhbGxTb3VyY2VGaWxlczogdHMuU291cmNlRmlsZVtdKTogSW5pdFRlc3RFbnZpcm9ubWVudEFuYWx5c2lzIHtcbiAgY29uc3QgY2FsbHNUb01pZ3JhdGUgPSBuZXcgU2V0PHRzLkNhbGxFeHByZXNzaW9uPigpO1xuICBsZXQgdG90YWxDYWxscyA9IDA7XG5cbiAgYWxsU291cmNlRmlsZXMuZm9yRWFjaChzb3VyY2VGaWxlID0+IHtcbiAgICBzb3VyY2VGaWxlLmZvckVhY2hDaGlsZChmdW5jdGlvbiB3YWxrKG5vZGU6IHRzLk5vZGUpIHtcbiAgICAgIGlmICh0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikgJiZcbiAgICAgICAgICB0cy5pc0lkZW50aWZpZXIobm9kZS5leHByZXNzaW9uLm5hbWUpICYmXG4gICAgICAgICAgbm9kZS5leHByZXNzaW9uLm5hbWUudGV4dCA9PT0gJ2luaXRUZXN0RW52aXJvbm1lbnQnICYmXG4gICAgICAgICAgaXNUZXN0QmVkQWNjZXNzKHR5cGVDaGVja2VyLCBub2RlLmV4cHJlc3Npb24pKSB7XG4gICAgICAgIHRvdGFsQ2FsbHMrKztcbiAgICAgICAgaWYgKHNob3VsZE1pZ3JhdGVJbml0VGVzdEVudmlyb25tZW50KG5vZGUpKSB7XG4gICAgICAgICAgY2FsbHNUb01pZ3JhdGUuYWRkKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZm9yRWFjaENoaWxkKHdhbGspO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC8vIFNvcnQgdGhlIG5vZGVzIHNvIHRoYXQgdGhleSB3aWxsIGJlIG1pZ3JhdGVkIGluIHJldmVyc2Ugc291cmNlIG9yZGVyIChub2RlcyBhdCB0aGUgZW5kIG9mXG4gICAgLy8gdGhlIGZpbGUgYXJlIG1pZ3JhdGVkIGZpcnN0KS4gVGhpcyBhdm9pZHMgaXNzdWVzIHdoZXJlIGEgbWlncmF0ZWQgbm9kZSB3aWxsIG9mZnNldCB0aGVcbiAgICAvLyBib3VuZHMgb2YgYWxsIG5vZGVzIHRoYXQgY29tZSBhZnRlciBpdC4gTm90ZSB0aGF0IHRoZSBub2RlcyBoZXJlIGFyZSBmcm9tIGFsbCBvZiB0aGVcbiAgICAvLyBwYXNzZWQgaW4gc291cmNlIGZpbGVzLCBidXQgdGhhdCBkb2Vzbid0IG1hdHRlciBzaW5jZSB0aGUgbGF0ZXIgbm9kZXMgd2lsbCBzdGlsbCBhcHBlYXJcbiAgICAvLyBhZnRlciB0aGUgZWFybGllciBvbmVzLlxuICAgIGNhbGxzVG9NaWdyYXRlOiBzb3J0SW5SZXZlcnNlU291cmNlT3JkZXIoQXJyYXkuZnJvbShjYWxsc1RvTWlncmF0ZSkpLFxuICAgIHRvdGFsQ2FsbHNcbiAgfTtcbn1cblxuLyoqIEZpbmRzIHRoZSBgY29uZmlndXJlVGVzdGluZ01vZHVsZWAgYW5kIGB3aXRoTW9kdWxlYCBjYWxscyB0aGF0IG5lZWQgdG8gYmUgbWlncmF0ZWQuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFRlc3RNb2R1bGVNZXRhZGF0YU5vZGVzKFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICBjb25zdCB0ZXN0TW9kdWxlTWV0YWRhdGFMaXRlcmFscyA9IG5ldyBTZXQ8dHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24+KCk7XG4gIGNvbnN0IHdpdGhNb2R1bGVJbXBvcnQgPSBnZXRJbXBvcnRTcGVjaWZpZXIoc291cmNlRmlsZSwgJ0Bhbmd1bGFyL2NvcmUvdGVzdGluZycsICd3aXRoTW9kdWxlJyk7XG5cbiAgc291cmNlRmlsZS5mb3JFYWNoQ2hpbGQoZnVuY3Rpb24gd2Fsayhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIGNvbnN0IGlzQ29uZmlndXJlVGVzdGluZ01vZHVsZUNhbGwgPSB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pICYmXG4gICAgICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUuZXhwcmVzc2lvbi5uYW1lKSAmJlxuICAgICAgICAgIG5vZGUuZXhwcmVzc2lvbi5uYW1lLnRleHQgPT09ICdjb25maWd1cmVUZXN0aW5nTW9kdWxlJyAmJlxuICAgICAgICAgIGlzVGVzdEJlZEFjY2Vzcyh0eXBlQ2hlY2tlciwgbm9kZS5leHByZXNzaW9uKSAmJiBzaG91bGRNaWdyYXRlTW9kdWxlQ29uZmlnQ2FsbChub2RlKTtcbiAgICAgIGNvbnN0IGlzV2l0aE1vZHVsZUNhbGwgPSB3aXRoTW9kdWxlSW1wb3J0ICYmIHRzLmlzSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24pICYmXG4gICAgICAgICAgaXNSZWZlcmVuY2VUb0ltcG9ydCh0eXBlQ2hlY2tlciwgbm9kZS5leHByZXNzaW9uLCB3aXRoTW9kdWxlSW1wb3J0KSAmJlxuICAgICAgICAgIHNob3VsZE1pZ3JhdGVNb2R1bGVDb25maWdDYWxsKG5vZGUpO1xuXG4gICAgICBpZiAoaXNDb25maWd1cmVUZXN0aW5nTW9kdWxlQ2FsbCB8fCBpc1dpdGhNb2R1bGVDYWxsKSB7XG4gICAgICAgIHRlc3RNb2R1bGVNZXRhZGF0YUxpdGVyYWxzLmFkZChub2RlLmFyZ3VtZW50c1swXSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5mb3JFYWNoQ2hpbGQod2Fsayk7XG4gIH0pO1xuXG4gIC8vIFNvcnQgdGhlIG5vZGVzIHNvIHRoYXQgdGhleSB3aWxsIGJlIG1pZ3JhdGVkIGluIHJldmVyc2Ugc291cmNlIG9yZGVyIChub2RlcyBhdCB0aGUgZW5kIG9mXG4gIC8vIHRoZSBmaWxlIGFyZSBtaWdyYXRlZCBmaXJzdCkuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aGVyZSBhIG1pZ3JhdGVkIG5vZGUgd2lsbCBvZmZzZXQgdGhlXG4gIC8vIGJvdW5kcyBvZiBhbGwgbm9kZXMgdGhhdCBjb21lIGFmdGVyIGl0LlxuICByZXR1cm4gc29ydEluUmV2ZXJzZVNvdXJjZU9yZGVyKEFycmF5LmZyb20odGVzdE1vZHVsZU1ldGFkYXRhTGl0ZXJhbHMpKTtcbn1cblxuLyoqXG4gKiBHZXRzIGRhdGEgdGhhdCBjYW4gYmUgdXNlZCB0byBtaWdyYXRlIGEgY2FsbCB0byBgVGVzdEJlZC5pbml0VGVzdEVudmlyb25tZW50YC5cbiAqIFRoZSByZXR1cm5lZCBgc3BhbmAgaXMgdXNlZCB0byBtYXJrIHRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIHJlcGxhY2VkIHdoaWxlIHRoZSBgdGV4dGBcbiAqIGlzIHRoZSBjb2RlIHRoYXQgc2hvdWxkIGJlIGluc2VydGVkIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0VGVzdEVudmlyb25tZW50TGl0ZXJhbFJlcGxhY2VtZW50KFxuICAgIG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uLCBwcmludGVyOiB0cy5QcmludGVyKSB7XG4gIGNvbnN0IGxpdGVyYWxQcm9wZXJ0aWVzOiB0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2VbXSA9IFtdO1xuICBjb25zdCBsYXN0QXJnID0gbm9kZS5hcmd1bWVudHNbbm9kZS5hcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gIGxldCBzcGFuOiB7c3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyfTtcbiAgbGV0IHByZWZpeDogc3RyaW5nO1xuXG4gIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24obGFzdEFyZykpIHtcbiAgICAgIC8vIElmIHRoZSBsYXN0IGFyZ3VtZW50IGlzIGEgZnVuY3Rpb24sIGFkZCB0aGUgZnVuY3Rpb24gYXMgdGhlIGBhb3RTdW1tYXJpZXNgIHByb3BlcnR5LlxuICAgICAgbGl0ZXJhbFByb3BlcnRpZXMucHVzaCh0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ2FvdFN1bW1hcmllcycsIGxhc3RBcmcpKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obGFzdEFyZykpIHtcbiAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBhbiBvYmplY3QgbGl0ZXJhbCwgY29weSBvdmVyIGFsbCB0aGUgcHJvcGVydGllcy5cbiAgICAgIGxpdGVyYWxQcm9wZXJ0aWVzLnB1c2goLi4ubGFzdEFyZy5wcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcmVmaXggPSAnJztcbiAgICBzcGFuID0ge3N0YXJ0OiBsYXN0QXJnLmdldFN0YXJ0KCksIGVuZDogbGFzdEFyZy5nZXRFbmQoKSwgbGVuZ3RoOiBsYXN0QXJnLmdldFdpZHRoKCl9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHN0YXJ0ID0gbGFzdEFyZy5nZXRFbmQoKTtcbiAgICBwcmVmaXggPSAnLCAnO1xuICAgIHNwYW4gPSB7c3RhcnQsIGVuZDogc3RhcnQsIGxlbmd0aDogMH07XG4gIH1cblxuICAvLyBGaW5hbGx5IHB1c2ggdGhlIHRlYXJkb3duIG9iamVjdCBzbyB0aGF0IGl0IGFwcGVhcnMgbGFzdC5cbiAgbGl0ZXJhbFByb3BlcnRpZXMucHVzaChjcmVhdGVUZWFyZG93bkFzc2lnbm1lbnQoKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzcGFuLFxuICAgIHRleHQ6IHByZWZpeCArXG4gICAgICAgIHByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHRzLmNyZWF0ZU9iamVjdExpdGVyYWwobGl0ZXJhbFByb3BlcnRpZXMsIHRydWUpLFxuICAgICAgICAgICAgbm9kZS5nZXRTb3VyY2VGaWxlKCkpXG4gIH07XG59XG5cbi8qKiBNaWdyYXRlcyBhbiBvYmplY3QgbGl0ZXJhbCB0aGF0IGlzIHBhc3NlZCBpbnRvIGBjb25maWd1cmVUZXN0aW5nTW9kdWxlYCBvciBgd2l0aE1vZHVsZWAuICovXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZVRlc3RNb2R1bGVNZXRhZGF0YUxpdGVyYWwobm9kZTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pOlxuICAgIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uIHtcbiAgcmV0dXJuIHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoXG4gICAgICBbLi4ubm9kZS5wcm9wZXJ0aWVzLCBjcmVhdGVUZWFyZG93bkFzc2lnbm1lbnQoKV0sIG5vZGUucHJvcGVydGllcy5sZW5ndGggPiAwKTtcbn1cblxuLyoqIFJldHVybnMgd2hldGhlciBhIHByb3BlcnR5IGFjY2VzcyBwb2ludHMgdG8gYFRlc3RCZWRgLiAqL1xuZnVuY3Rpb24gaXNUZXN0QmVkQWNjZXNzKHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgbm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gIGNvbnN0IHN5bWJvbE5hbWUgPSB0eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihub2RlLmV4cHJlc3Npb24pPy5nZXRTeW1ib2woKT8uZ2V0TmFtZSgpO1xuICByZXR1cm4gc3ltYm9sTmFtZSA9PT0gJ1Rlc3RCZWQnIHx8IHN5bWJvbE5hbWUgPT09ICdUZXN0QmVkU3RhdGljJztcbn1cblxuLyoqIFdoZXRoZXIgYSBjYWxsIHRvIGBpbml0VGVzdEVudmlyb25tZW50YCBzaG91bGQgYmUgbWlncmF0ZWQuICovXG5mdW5jdGlvbiBzaG91bGRNaWdyYXRlSW5pdFRlc3RFbnZpcm9ubWVudChub2RlOiB0cy5DYWxsRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAvLyBJZiB0aGVyZSBpcyBubyB0aGlyZCBhcmd1bWVudCwgd2UgZGVmaW5pdGVseSBoYXZlIHRvIG1pZ3JhdGUgaXQuXG4gIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgdGVjaG5pY2FsbHkgYSB0eXBlIGVycm9yIHNvIHdlIHNob3VsZG4ndCBtZXNzIHdpdGggaXQuXG4gIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlIHdlIG5lZWQgdG8gZmlndXJlIG91dCBpZiB0aGUgYHRlYXJkb3duYCBmbGFnIGlzIHNldCBvbiB0aGUgbGFzdCBhcmd1bWVudC5cbiAgY29uc3QgbGFzdEFyZyA9IG5vZGUuYXJndW1lbnRzWzJdO1xuXG4gIC8vIE5vdGU6IHRoZSBjaGVja3MgYmVsb3cgd2lsbCBpZGVudGlmeSBzb21ldGhpbmcgbGlrZSBgaW5pdFRlc3RFbnZpcm9ubWVudCguLi4sIC4uLiwge30pYCxcbiAgLy8gYnV0IHRoZXknbGwgaWdub3JlIGEgdmFyaWFibGUgYmVpbmcgcGFzc2VkIGluIGFzIHRoZSBsYXN0IGFyZ3VtZW50IGxpa2UgYGNvbnN0IGNvbmZpZyA9IHt9O1xuICAvLyBpbml0VGVzdEVudmlyb25tZW50KC4uLiwgLi4uLCBjb25maWcpYC4gV2hpbGUgd2UgY2FuIHJlc29sdmUgdGhlIHZhcmlhYmxlIHRvIGl0cyBkZWNsYXJhdGlvblxuICAvLyB1c2luZyBgdHlwZUNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24obGFzdEFyZykuZ2V0U3ltYm9sKCk/LnZhbHVlRGVjbGFyYXRpb25gLCB3ZSBkZWxpYmVyYXRlbHlcbiAgLy8gZG9uJ3QsIGJlY2F1c2UgaXQgaW50cm9kdWNlcyBzb21lIGNvbXBsZXhpdHkgYW5kIHdlIG1heSBlbmQgdXAgYnJlYWtpbmcgdXNlciBjb2RlLiBFLmcuXG4gIC8vIHRoZSBgY29uZmlnYCBmcm9tIHRoZSBleGFtcGxlIGFib3ZlIG1heSBiZSBwYXNzZWQgaW4gdG8gb3RoZXIgZnVuY3Rpb25zIG9yIHRoZSBgdGVhcmRvd25gXG4gIC8vIGZsYWcgY291bGQgYmUgYWRkZWQgbGF0ZXIgb24gYnkgYSBmdW5jdGlvbiBjYWxsLlxuXG4gIC8vIElmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3QgbGl0ZXJhbCBhbmQgdGhlcmUgYXJlIG5vXG4gIC8vIHByb3BlcnRpZXMgY2FsbGVkIGB0ZWFyZG93bmAsIHdlIGhhdmUgdG8gbWlncmF0ZSBpdC5cbiAgaWYgKGlzT2JqZWN0TGl0ZXJhbFdpdGhvdXRUZWFyZG93bihsYXN0QXJnKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSWYgdGhlIGxhc3QgYXJndW1lbnQgaXMgYW4gYGFvdFN1bW1hcmllc2AgZnVuY3Rpb24sIHdlIGFsc28gaGF2ZSB0byBtaWdyYXRlLlxuICBpZiAoaXNGdW5jdGlvbihsYXN0QXJnKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlIGRvbid0IG1pZ3JhdGUgaWYgd2UgY291bGRuJ3QgaWRlbnRpZnkgdGhlIGxhc3QgYXJndW1lbnQuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIGEgY2FsbCB0byBhIG1vZHVsZSBjb25maWd1cmF0aW9uIGZ1bmN0aW9uIHNob3VsZCBiZSBtaWdyYXRlZC4gVGhpcyBjb3ZlcnNcbiAqIGBUZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGVgIGFuZCBgd2l0aE1vZHVsZWAgc2luY2UgdGhleSBib3RoIGFjY2VwdCBgVGVzdE1vZHVsZU1ldGFkYXRhYFxuICogYXMgdGhlaXIgZmlyc3QgYXJndW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHNob3VsZE1pZ3JhdGVNb2R1bGVDb25maWdDYWxsKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogbm9kZSBpcyB0cy5DYWxsRXhwcmVzc2lvbiZcbiAgICB7YXJndW1lbnRzOiBbdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sIC4uLnRzLkV4cHJlc3Npb25bXV19IHtcbiAgcmV0dXJuIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgaXNPYmplY3RMaXRlcmFsV2l0aG91dFRlYXJkb3duKG5vZGUuYXJndW1lbnRzWzBdKTtcbn1cblxuLyoqIFJldHVybnMgd2hldGhlciBhIG5vZGUgaXMgYSBmdW5jdGlvbiBsaXRlcmFsLiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihub2RlOiB0cy5Ob2RlKTogbm9kZSBpcyB0cy5BcnJvd0Z1bmN0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbnxcbiAgICB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uIHtcbiAgcmV0dXJuIHRzLmlzQXJyb3dGdW5jdGlvbihub2RlKSB8fCB0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihub2RlKSB8fFxuICAgICAgdHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSBub2RlIGlzIGFuIG9iamVjdCBsaXRlcmFsIHRoYXQgZG9lc24ndCBjb250YWluIGEgcHJvcGVydHkgY2FsbGVkIGB0ZWFyZG93bmAuICovXG5mdW5jdGlvbiBpc09iamVjdExpdGVyYWxXaXRob3V0VGVhcmRvd24obm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24ge1xuICByZXR1cm4gdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKSAmJiAhbm9kZS5wcm9wZXJ0aWVzLmZpbmQocHJvcCA9PiB7XG4gICAgcmV0dXJuIHByb3AubmFtZT8uZ2V0VGV4dCgpID09PSAndGVhcmRvd24nO1xuICB9KTtcbn1cblxuLyoqIENyZWF0ZXMgYSB0ZWFyZG93biBjb25maWd1cmF0aW9uIHByb3BlcnR5IGFzc2lnbm1lbnQuICovXG5mdW5jdGlvbiBjcmVhdGVUZWFyZG93bkFzc2lnbm1lbnQoKTogdHMuUHJvcGVydHlBc3NpZ25tZW50IHtcbiAgLy8gYHRlYXJkb3duOiB7ZGVzdHJveUFmdGVyRWFjaDogZmFsc2V9YFxuICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KFxuICAgICAgJ3RlYXJkb3duJyxcbiAgICAgIHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoW3RzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgnZGVzdHJveUFmdGVyRWFjaCcsIHRzLmNyZWF0ZUZhbHNlKCkpXSkpO1xufVxuXG4vKiogU29ydHMgYW4gYXJyYXkgb2YgQVNUIG5vZGVzIGluIHJldmVyc2Ugc291cmNlIG9yZGVyLiAqL1xuZnVuY3Rpb24gc29ydEluUmV2ZXJzZVNvdXJjZU9yZGVyPFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlczogVFtdKTogVFtdIHtcbiAgcmV0dXJuIG5vZGVzLnNvcnQoKGEsIGIpID0+IGIuZ2V0RW5kKCkgLSBhLmdldEVuZCgpKTtcbn1cbiJdfQ==