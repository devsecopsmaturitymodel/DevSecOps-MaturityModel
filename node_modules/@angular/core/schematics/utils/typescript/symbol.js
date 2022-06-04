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
        define("@angular/core/schematics/utils/typescript/symbol", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasOneOfTypes = exports.isNullableType = exports.isReferenceToImport = exports.getValueSymbolOfDeclaration = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    function getValueSymbolOfDeclaration(node, typeChecker) {
        let symbol = typeChecker.getSymbolAtLocation(node);
        while (symbol && symbol.flags & typescript_1.default.SymbolFlags.Alias) {
            symbol = typeChecker.getAliasedSymbol(symbol);
        }
        return symbol;
    }
    exports.getValueSymbolOfDeclaration = getValueSymbolOfDeclaration;
    /** Checks whether a node is referring to a specific import specifier. */
    function isReferenceToImport(typeChecker, node, importSpecifier) {
        var _a, _b;
        const nodeSymbol = typeChecker.getTypeAtLocation(node).getSymbol();
        const importSymbol = typeChecker.getTypeAtLocation(importSpecifier).getSymbol();
        return !!(((_a = nodeSymbol === null || nodeSymbol === void 0 ? void 0 : nodeSymbol.declarations) === null || _a === void 0 ? void 0 : _a[0]) && ((_b = importSymbol === null || importSymbol === void 0 ? void 0 : importSymbol.declarations) === null || _b === void 0 ? void 0 : _b[0])) &&
            nodeSymbol.declarations[0] === importSymbol.declarations[0];
    }
    exports.isReferenceToImport = isReferenceToImport;
    /** Checks whether a node's type is nullable (`null`, `undefined` or `void`). */
    function isNullableType(typeChecker, node) {
        // Skip expressions in the form of `foo.bar!.baz` since the `TypeChecker` seems
        // to identify them as null, even though the user indicated that it won't be.
        if (node.parent && typescript_1.default.isNonNullExpression(node.parent)) {
            return false;
        }
        const type = typeChecker.getTypeAtLocation(node);
        const typeNode = typeChecker.typeToTypeNode(type, undefined, typescript_1.default.NodeBuilderFlags.None);
        let hasSeenNullableType = false;
        // Trace the type of the node back to a type node, walk
        // through all of its sub-nodes and look for nullable tyes.
        if (typeNode) {
            (function walk(current) {
                if (current.kind === typescript_1.default.SyntaxKind.NullKeyword ||
                    current.kind === typescript_1.default.SyntaxKind.UndefinedKeyword ||
                    current.kind === typescript_1.default.SyntaxKind.VoidKeyword) {
                    hasSeenNullableType = true;
                    // Note that we don't descend into type literals, because it may cause
                    // us to mis-identify the root type as nullable, because it has a nullable
                    // property (e.g. `{ foo: string | null }`).
                }
                else if (!hasSeenNullableType && !typescript_1.default.isTypeLiteralNode(current)) {
                    current.forEachChild(walk);
                }
            })(typeNode);
        }
        return hasSeenNullableType;
    }
    exports.isNullableType = isNullableType;
    /**
     * Walks through the types and sub-types of a node, looking for a
     * type that has the same name as one of the passed-in ones.
     */
    function hasOneOfTypes(typeChecker, node, types) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeNode = type ? typeChecker.typeToTypeNode(type, undefined, typescript_1.default.NodeBuilderFlags.None) : undefined;
        let hasMatch = false;
        if (typeNode) {
            (function walk(current) {
                if (typescript_1.default.isIdentifier(current) && types.includes(current.text)) {
                    hasMatch = true;
                }
                else if (!hasMatch && !typescript_1.default.isTypeLiteralNode(current)) {
                    current.forEachChild(walk);
                }
            })(typeNode);
        }
        return hasMatch;
    }
    exports.hasOneOfTypes = hasOneOfTypes;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zY2hlbWF0aWNzL3V0aWxzL3R5cGVzY3JpcHQvc3ltYm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7OztJQUVILDREQUE0QjtJQUU1QixTQUFnQiwyQkFBMkIsQ0FBQyxJQUFhLEVBQUUsV0FBMkI7UUFFcEYsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELE9BQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsb0JBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO1lBQ3BELE1BQU0sR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0M7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBVEQsa0VBU0M7SUFFRCx5RUFBeUU7SUFDekUsU0FBZ0IsbUJBQW1CLENBQy9CLFdBQTJCLEVBQUUsSUFBYSxFQUFFLGVBQW1DOztRQUNqRixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkUsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hGLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFBLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxZQUFZLDBDQUFHLENBQUMsQ0FBQyxNQUFJLE1BQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLFlBQVksMENBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUN2RSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQU5ELGtEQU1DO0lBRUQsZ0ZBQWdGO0lBQ2hGLFNBQWdCLGNBQWMsQ0FBQyxXQUEyQixFQUFFLElBQWE7UUFDdkUsK0VBQStFO1FBQy9FLDZFQUE2RTtRQUM3RSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksb0JBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEQsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsb0JBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RixJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUVoQyx1REFBdUQ7UUFDdkQsMkRBQTJEO1FBQzNELElBQUksUUFBUSxFQUFFO1lBQ1osQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFnQjtnQkFDN0IsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLG9CQUFFLENBQUMsVUFBVSxDQUFDLFdBQVc7b0JBQzFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssb0JBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO29CQUMvQyxPQUFPLENBQUMsSUFBSSxLQUFLLG9CQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRTtvQkFDOUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO29CQUMzQixzRUFBc0U7b0JBQ3RFLDBFQUEwRTtvQkFDMUUsNENBQTRDO2lCQUM3QztxQkFBTSxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxvQkFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNqRSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM1QjtZQUNILENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUE3QkQsd0NBNkJDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBZ0IsYUFBYSxDQUN6QixXQUEyQixFQUFFLElBQWEsRUFBRSxLQUFlO1FBQzdELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxNQUFNLFFBQVEsR0FDVixJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxvQkFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDN0YsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksUUFBUSxFQUFFO1lBQ1osQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFnQjtnQkFDN0IsSUFBSSxvQkFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDNUQsUUFBUSxHQUFHLElBQUksQ0FBQztpQkFDakI7cUJBQU0sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLG9CQUFFLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3RELE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzVCO1lBQ0gsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDZDtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFoQkQsc0NBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlU3ltYm9sT2ZEZWNsYXJhdGlvbihub2RlOiB0cy5Ob2RlLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiB0cy5TeW1ib2x8XG4gICAgdW5kZWZpbmVkIHtcbiAgbGV0IHN5bWJvbCA9IHR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgd2hpbGUgKHN5bWJvbCAmJiBzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgIHN5bWJvbCA9IHR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuXG4gIHJldHVybiBzeW1ib2w7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIG5vZGUgaXMgcmVmZXJyaW5nIHRvIGEgc3BlY2lmaWMgaW1wb3J0IHNwZWNpZmllci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZmVyZW5jZVRvSW1wb3J0KFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgbm9kZTogdHMuTm9kZSwgaW1wb3J0U3BlY2lmaWVyOiB0cy5JbXBvcnRTcGVjaWZpZXIpOiBib29sZWFuIHtcbiAgY29uc3Qgbm9kZVN5bWJvbCA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKG5vZGUpLmdldFN5bWJvbCgpO1xuICBjb25zdCBpbXBvcnRTeW1ib2wgPSB0eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihpbXBvcnRTcGVjaWZpZXIpLmdldFN5bWJvbCgpO1xuICByZXR1cm4gISEobm9kZVN5bWJvbD8uZGVjbGFyYXRpb25zPy5bMF0gJiYgaW1wb3J0U3ltYm9sPy5kZWNsYXJhdGlvbnM/LlswXSkgJiZcbiAgICAgIG5vZGVTeW1ib2wuZGVjbGFyYXRpb25zWzBdID09PSBpbXBvcnRTeW1ib2wuZGVjbGFyYXRpb25zWzBdO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSBub2RlJ3MgdHlwZSBpcyBudWxsYWJsZSAoYG51bGxgLCBgdW5kZWZpbmVkYCBvciBgdm9pZGApLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbGFibGVUeXBlKHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgbm9kZTogdHMuTm9kZSkge1xuICAvLyBTa2lwIGV4cHJlc3Npb25zIGluIHRoZSBmb3JtIG9mIGBmb28uYmFyIS5iYXpgIHNpbmNlIHRoZSBgVHlwZUNoZWNrZXJgIHNlZW1zXG4gIC8vIHRvIGlkZW50aWZ5IHRoZW0gYXMgbnVsbCwgZXZlbiB0aG91Z2ggdGhlIHVzZXIgaW5kaWNhdGVkIHRoYXQgaXQgd29uJ3QgYmUuXG4gIGlmIChub2RlLnBhcmVudCAmJiB0cy5pc05vbk51bGxFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSB0eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihub2RlKTtcbiAgY29uc3QgdHlwZU5vZGUgPSB0eXBlQ2hlY2tlci50eXBlVG9UeXBlTm9kZSh0eXBlLCB1bmRlZmluZWQsIHRzLk5vZGVCdWlsZGVyRmxhZ3MuTm9uZSk7XG4gIGxldCBoYXNTZWVuTnVsbGFibGVUeXBlID0gZmFsc2U7XG5cbiAgLy8gVHJhY2UgdGhlIHR5cGUgb2YgdGhlIG5vZGUgYmFjayB0byBhIHR5cGUgbm9kZSwgd2Fsa1xuICAvLyB0aHJvdWdoIGFsbCBvZiBpdHMgc3ViLW5vZGVzIGFuZCBsb29rIGZvciBudWxsYWJsZSB0eWVzLlxuICBpZiAodHlwZU5vZGUpIHtcbiAgICAoZnVuY3Rpb24gd2FsayhjdXJyZW50OiB0cy5Ob2RlKSB7XG4gICAgICBpZiAoY3VycmVudC5raW5kID09PSB0cy5TeW50YXhLaW5kLk51bGxLZXl3b3JkIHx8XG4gICAgICAgICAgY3VycmVudC5raW5kID09PSB0cy5TeW50YXhLaW5kLlVuZGVmaW5lZEtleXdvcmQgfHxcbiAgICAgICAgICBjdXJyZW50LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVm9pZEtleXdvcmQpIHtcbiAgICAgICAgaGFzU2Vlbk51bGxhYmxlVHlwZSA9IHRydWU7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBkZXNjZW5kIGludG8gdHlwZSBsaXRlcmFscywgYmVjYXVzZSBpdCBtYXkgY2F1c2VcbiAgICAgICAgLy8gdXMgdG8gbWlzLWlkZW50aWZ5IHRoZSByb290IHR5cGUgYXMgbnVsbGFibGUsIGJlY2F1c2UgaXQgaGFzIGEgbnVsbGFibGVcbiAgICAgICAgLy8gcHJvcGVydHkgKGUuZy4gYHsgZm9vOiBzdHJpbmcgfCBudWxsIH1gKS5cbiAgICAgIH0gZWxzZSBpZiAoIWhhc1NlZW5OdWxsYWJsZVR5cGUgJiYgIXRzLmlzVHlwZUxpdGVyYWxOb2RlKGN1cnJlbnQpKSB7XG4gICAgICAgIGN1cnJlbnQuZm9yRWFjaENoaWxkKHdhbGspO1xuICAgICAgfVxuICAgIH0pKHR5cGVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBoYXNTZWVuTnVsbGFibGVUeXBlO1xufVxuXG4vKipcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHR5cGVzIGFuZCBzdWItdHlwZXMgb2YgYSBub2RlLCBsb29raW5nIGZvciBhXG4gKiB0eXBlIHRoYXQgaGFzIHRoZSBzYW1lIG5hbWUgYXMgb25lIG9mIHRoZSBwYXNzZWQtaW4gb25lcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc09uZU9mVHlwZXMoXG4gICAgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBub2RlOiB0cy5Ob2RlLCB0eXBlczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKG5vZGUpO1xuICBjb25zdCB0eXBlTm9kZSA9XG4gICAgICB0eXBlID8gdHlwZUNoZWNrZXIudHlwZVRvVHlwZU5vZGUodHlwZSwgdW5kZWZpbmVkLCB0cy5Ob2RlQnVpbGRlckZsYWdzLk5vbmUpIDogdW5kZWZpbmVkO1xuICBsZXQgaGFzTWF0Y2ggPSBmYWxzZTtcbiAgaWYgKHR5cGVOb2RlKSB7XG4gICAgKGZ1bmN0aW9uIHdhbGsoY3VycmVudDogdHMuTm9kZSkge1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihjdXJyZW50KSAmJiB0eXBlcy5pbmNsdWRlcyhjdXJyZW50LnRleHQpKSB7XG4gICAgICAgIGhhc01hdGNoID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoIWhhc01hdGNoICYmICF0cy5pc1R5cGVMaXRlcmFsTm9kZShjdXJyZW50KSkge1xuICAgICAgICBjdXJyZW50LmZvckVhY2hDaGlsZCh3YWxrKTtcbiAgICAgIH1cbiAgICB9KSh0eXBlTm9kZSk7XG4gIH1cbiAgcmV0dXJuIGhhc01hdGNoO1xufVxuIl19