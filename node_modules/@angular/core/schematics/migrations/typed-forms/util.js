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
        define("@angular/core/schematics/migrations/typed-forms/util", ["require", "exports", "typescript", "@angular/core/schematics/utils/typescript/imports", "@angular/core/schematics/utils/typescript/symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findFormBuilderCalls = exports.findControlClassUsages = exports.getAnyImport = exports.getFormBuilderImport = exports.getControlClassImports = exports.anySymbolName = exports.builderMethodNames = exports.controlClassNames = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    const imports_1 = require("@angular/core/schematics/utils/typescript/imports");
    const symbol_1 = require("@angular/core/schematics/utils/typescript/symbol");
    exports.controlClassNames = ['AbstractControl', 'FormArray', 'FormControl', 'FormGroup'];
    exports.builderMethodNames = ['control', 'group', 'array'];
    exports.anySymbolName = 'AnyForUntypedForms';
    function getControlClassImports(sourceFile) {
        return exports.controlClassNames.map(cclass => (0, imports_1.getImportSpecifier)(sourceFile, '@angular/forms', cclass))
            .filter(v => v != null);
    }
    exports.getControlClassImports = getControlClassImports;
    function getFormBuilderImport(sourceFile) {
        return (0, imports_1.getImportSpecifier)(sourceFile, '@angular/forms', 'FormBuilder');
    }
    exports.getFormBuilderImport = getFormBuilderImport;
    function getAnyImport(sourceFile) {
        return (0, imports_1.getImportSpecifier)(sourceFile, '@angular/forms', exports.anySymbolName);
    }
    exports.getAnyImport = getAnyImport;
    function findControlClassUsages(sourceFile, typeChecker, importSpecifier) {
        var _a;
        if (importSpecifier === null)
            return [];
        let generic = `<${exports.anySymbolName}>`;
        if (importSpecifier.name.getText() === 'FormArray' ||
            ((_a = importSpecifier.propertyName) === null || _a === void 0 ? void 0 : _a.getText()) === 'FormArray') {
            generic = `<${exports.anySymbolName}[]>`;
        }
        const usages = [];
        const visitNode = (node) => {
            // Look for a `new` expression with no type arguments which references an import we care about:
            // `new FormControl()`
            if (typescript_1.default.isNewExpression(node) && !node.typeArguments &&
                (0, symbol_1.isReferenceToImport)(typeChecker, node.expression, importSpecifier)) {
                usages.push({ node: node.expression, generic });
            }
            typescript_1.default.forEachChild(node, visitNode);
        };
        typescript_1.default.forEachChild(sourceFile, visitNode);
        return usages;
    }
    exports.findControlClassUsages = findControlClassUsages;
    function findFormBuilderCalls(sourceFile, typeChecker, importSpecifier) {
        if (!importSpecifier)
            return [];
        const usages = new Array();
        typescript_1.default.forEachChild(sourceFile, function visitNode(node) {
            // Look for calls that look like `foo.<method to migrate>`.
            if (typescript_1.default.isCallExpression(node) && !node.typeArguments &&
                typescript_1.default.isPropertyAccessExpression(node.expression) && typescript_1.default.isIdentifier(node.expression.name) &&
                exports.builderMethodNames.includes(node.expression.name.text)) {
                const generic = node.expression.name.text === 'array' ? `<${exports.anySymbolName}[]>` : `<${exports.anySymbolName}>`;
                // Check whether the type of the object on which the function is called refers to the
                // provided import.
                if ((0, symbol_1.isReferenceToImport)(typeChecker, node.expression.expression, importSpecifier)) {
                    usages.push({ node: node.expression, generic });
                }
            }
            typescript_1.default.forEachChild(node, visitNode);
        });
        return usages;
    }
    exports.findFormBuilderCalls = findFormBuilderCalls;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3R5cGVkLWZvcm1zL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNERBQTRCO0lBRTVCLCtFQUFrRTtJQUNsRSw2RUFBa0U7SUFFckQsUUFBQSxpQkFBaUIsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakYsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsUUFBQSxhQUFhLEdBQUcsb0JBQW9CLENBQUM7SUFPbEQsU0FBZ0Isc0JBQXNCLENBQUMsVUFBeUI7UUFDOUQsT0FBTyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUMzRixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUhELHdEQUdDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQUMsVUFBeUI7UUFDNUQsT0FBTyxJQUFBLDRCQUFrQixFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRkQsb0RBRUM7SUFFRCxTQUFnQixZQUFZLENBQUMsVUFBeUI7UUFDcEQsT0FBTyxJQUFBLDRCQUFrQixFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBYSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUZELG9DQUVDO0lBRUQsU0FBZ0Isc0JBQXNCLENBQ2xDLFVBQXlCLEVBQUUsV0FBMkIsRUFDdEQsZUFBd0M7O1FBQzFDLElBQUksZUFBZSxLQUFLLElBQUk7WUFBRSxPQUFPLEVBQUUsQ0FBQztRQUN4QyxJQUFJLE9BQU8sR0FBRyxJQUFJLHFCQUFhLEdBQUcsQ0FBQztRQUNuQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssV0FBVztZQUM5QyxDQUFBLE1BQUEsZUFBZSxDQUFDLFlBQVksMENBQUUsT0FBTyxFQUFFLE1BQUssV0FBVyxFQUFFO1lBQzNELE9BQU8sR0FBRyxJQUFJLHFCQUFhLEtBQUssQ0FBQztTQUNsQztRQUNELE1BQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDcEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTtZQUNsQywrRkFBK0Y7WUFDL0Ysc0JBQXNCO1lBQ3RCLElBQUksb0JBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFDL0MsSUFBQSw0QkFBbUIsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsRUFBRTtnQkFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7YUFDL0M7WUFDRCxvQkFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0Ysb0JBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFyQkQsd0RBcUJDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQ2hDLFVBQXlCLEVBQUUsV0FBMkIsRUFDdEQsZUFBd0M7UUFDMUMsSUFBSSxDQUFDLGVBQWU7WUFBRSxPQUFPLEVBQUUsQ0FBQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBa0IsQ0FBQztRQUMzQyxvQkFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBUyxTQUFTLENBQUMsSUFBYTtZQUMxRCwyREFBMkQ7WUFDM0QsSUFBSSxvQkFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7Z0JBQ2hELG9CQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLG9CQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUN2RiwwQkFBa0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFELE1BQU0sT0FBTyxHQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQWEsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLHFCQUFhLEdBQUcsQ0FBQztnQkFDMUYscUZBQXFGO2dCQUNyRixtQkFBbUI7Z0JBQ25CLElBQUksSUFBQSw0QkFBbUIsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLEVBQUU7b0JBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO2lCQUMvQzthQUNGO1lBQ0Qsb0JBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQXJCRCxvREFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldEltcG9ydFNwZWNpZmllcn0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXNjcmlwdC9pbXBvcnRzJztcbmltcG9ydCB7aXNSZWZlcmVuY2VUb0ltcG9ydH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXNjcmlwdC9zeW1ib2wnO1xuXG5leHBvcnQgY29uc3QgY29udHJvbENsYXNzTmFtZXMgPSBbJ0Fic3RyYWN0Q29udHJvbCcsICdGb3JtQXJyYXknLCAnRm9ybUNvbnRyb2wnLCAnRm9ybUdyb3VwJ107XG5leHBvcnQgY29uc3QgYnVpbGRlck1ldGhvZE5hbWVzID0gWydjb250cm9sJywgJ2dyb3VwJywgJ2FycmF5J107XG5leHBvcnQgY29uc3QgYW55U3ltYm9sTmFtZSA9ICdBbnlGb3JVbnR5cGVkRm9ybXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1pZ3JhdGFibGVOb2RlIHtcbiAgbm9kZTogdHMuRXhwcmVzc2lvbjtcbiAgZ2VuZXJpYzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbENsYXNzSW1wb3J0cyhzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gIHJldHVybiBjb250cm9sQ2xhc3NOYW1lcy5tYXAoY2NsYXNzID0+IGdldEltcG9ydFNwZWNpZmllcihzb3VyY2VGaWxlLCAnQGFuZ3VsYXIvZm9ybXMnLCBjY2xhc3MpKVxuICAgICAgLmZpbHRlcih2ID0+IHYgIT0gbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGb3JtQnVpbGRlckltcG9ydChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gIHJldHVybiBnZXRJbXBvcnRTcGVjaWZpZXIoc291cmNlRmlsZSwgJ0Bhbmd1bGFyL2Zvcm1zJywgJ0Zvcm1CdWlsZGVyJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbnlJbXBvcnQoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICByZXR1cm4gZ2V0SW1wb3J0U3BlY2lmaWVyKHNvdXJjZUZpbGUsICdAYW5ndWxhci9mb3JtcycsIGFueVN5bWJvbE5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbnRyb2xDbGFzc1VzYWdlcyhcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgaW1wb3J0U3BlY2lmaWVyOiB0cy5JbXBvcnRTcGVjaWZpZXJ8bnVsbCk6IE1pZ3JhdGFibGVOb2RlW10ge1xuICBpZiAoaW1wb3J0U3BlY2lmaWVyID09PSBudWxsKSByZXR1cm4gW107XG4gIGxldCBnZW5lcmljID0gYDwke2FueVN5bWJvbE5hbWV9PmA7XG4gIGlmIChpbXBvcnRTcGVjaWZpZXIubmFtZS5nZXRUZXh0KCkgPT09ICdGb3JtQXJyYXknIHx8XG4gICAgICBpbXBvcnRTcGVjaWZpZXIucHJvcGVydHlOYW1lPy5nZXRUZXh0KCkgPT09ICdGb3JtQXJyYXknKSB7XG4gICAgZ2VuZXJpYyA9IGA8JHthbnlTeW1ib2xOYW1lfVtdPmA7XG4gIH1cbiAgY29uc3QgdXNhZ2VzOiBNaWdyYXRhYmxlTm9kZVtdID0gW107XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgLy8gTG9vayBmb3IgYSBgbmV3YCBleHByZXNzaW9uIHdpdGggbm8gdHlwZSBhcmd1bWVudHMgd2hpY2ggcmVmZXJlbmNlcyBhbiBpbXBvcnQgd2UgY2FyZSBhYm91dDpcbiAgICAvLyBgbmV3IEZvcm1Db250cm9sKClgXG4gICAgaWYgKHRzLmlzTmV3RXhwcmVzc2lvbihub2RlKSAmJiAhbm9kZS50eXBlQXJndW1lbnRzICYmXG4gICAgICAgIGlzUmVmZXJlbmNlVG9JbXBvcnQodHlwZUNoZWNrZXIsIG5vZGUuZXhwcmVzc2lvbiwgaW1wb3J0U3BlY2lmaWVyKSkge1xuICAgICAgdXNhZ2VzLnB1c2goe25vZGU6IG5vZGUuZXhwcmVzc2lvbiwgZ2VuZXJpY30pO1xuICAgIH1cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgdmlzaXROb2RlKTtcbiAgfTtcbiAgdHMuZm9yRWFjaENoaWxkKHNvdXJjZUZpbGUsIHZpc2l0Tm9kZSk7XG4gIHJldHVybiB1c2FnZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRm9ybUJ1aWxkZXJDYWxscyhcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgaW1wb3J0U3BlY2lmaWVyOiB0cy5JbXBvcnRTcGVjaWZpZXJ8bnVsbCk6IE1pZ3JhdGFibGVOb2RlW10ge1xuICBpZiAoIWltcG9ydFNwZWNpZmllcikgcmV0dXJuIFtdO1xuICBjb25zdCB1c2FnZXMgPSBuZXcgQXJyYXk8TWlncmF0YWJsZU5vZGU+KCk7XG4gIHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBmdW5jdGlvbiB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSkge1xuICAgIC8vIExvb2sgZm9yIGNhbGxzIHRoYXQgbG9vayBsaWtlIGBmb28uPG1ldGhvZCB0byBtaWdyYXRlPmAuXG4gICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgJiYgIW5vZGUudHlwZUFyZ3VtZW50cyAmJlxuICAgICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pICYmIHRzLmlzSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24ubmFtZSkgJiZcbiAgICAgICAgYnVpbGRlck1ldGhvZE5hbWVzLmluY2x1ZGVzKG5vZGUuZXhwcmVzc2lvbi5uYW1lLnRleHQpKSB7XG4gICAgICBjb25zdCBnZW5lcmljID1cbiAgICAgICAgICBub2RlLmV4cHJlc3Npb24ubmFtZS50ZXh0ID09PSAnYXJyYXknID8gYDwke2FueVN5bWJvbE5hbWV9W10+YCA6IGA8JHthbnlTeW1ib2xOYW1lfT5gO1xuICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IG9uIHdoaWNoIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgcmVmZXJzIHRvIHRoZVxuICAgICAgLy8gcHJvdmlkZWQgaW1wb3J0LlxuICAgICAgaWYgKGlzUmVmZXJlbmNlVG9JbXBvcnQodHlwZUNoZWNrZXIsIG5vZGUuZXhwcmVzc2lvbi5leHByZXNzaW9uLCBpbXBvcnRTcGVjaWZpZXIpKSB7XG4gICAgICAgIHVzYWdlcy5wdXNoKHtub2RlOiBub2RlLmV4cHJlc3Npb24sIGdlbmVyaWN9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSk7XG4gIH0pO1xuICByZXR1cm4gdXNhZ2VzO1xufVxuIl19