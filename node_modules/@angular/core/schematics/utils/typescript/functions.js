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
        define("@angular/core/schematics/utils/typescript/functions", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unwrapExpression = exports.isFunctionLikeDeclaration = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    /** Checks whether a given node is a function like declaration. */
    function isFunctionLikeDeclaration(node) {
        return typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isMethodDeclaration(node) ||
            typescript_1.default.isArrowFunction(node) || typescript_1.default.isFunctionExpression(node) ||
            typescript_1.default.isGetAccessorDeclaration(node) || typescript_1.default.isSetAccessorDeclaration(node);
    }
    exports.isFunctionLikeDeclaration = isFunctionLikeDeclaration;
    /**
     * Unwraps a given expression TypeScript node. Expressions can be wrapped within multiple
     * parentheses or as expression. e.g. "(((({exp}))))()". The function should return the
     * TypeScript node referring to the inner expression. e.g "exp".
     */
    function unwrapExpression(node) {
        if (typescript_1.default.isParenthesizedExpression(node) || typescript_1.default.isAsExpression(node)) {
            return unwrapExpression(node.expression);
        }
        else {
            return node;
        }
    }
    exports.unwrapExpression = unwrapExpression;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zY2hlbWF0aWNzL3V0aWxzL3R5cGVzY3JpcHQvZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7OztJQUVILDREQUE0QjtJQUU1QixrRUFBa0U7SUFDbEUsU0FBZ0IseUJBQXlCLENBQUMsSUFBYTtRQUNyRCxPQUFPLG9CQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7WUFDakUsb0JBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7WUFDekQsb0JBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFKRCw4REFJQztJQUVEOzs7O09BSUc7SUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxJQUE4QztRQUM3RSxJQUFJLG9CQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakUsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBTkQsNENBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBub2RlIGlzIGEgZnVuY3Rpb24gbGlrZSBkZWNsYXJhdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uTGlrZURlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uIHtcbiAgcmV0dXJuIHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSB8fCB0cy5pc01ldGhvZERlY2xhcmF0aW9uKG5vZGUpIHx8XG4gICAgICB0cy5pc0Fycm93RnVuY3Rpb24obm9kZSkgfHwgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24obm9kZSkgfHxcbiAgICAgIHRzLmlzR2V0QWNjZXNzb3JEZWNsYXJhdGlvbihub2RlKSB8fCB0cy5pc1NldEFjY2Vzc29yRGVjbGFyYXRpb24obm9kZSk7XG59XG5cbi8qKlxuICogVW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gVHlwZVNjcmlwdCBub2RlLiBFeHByZXNzaW9ucyBjYW4gYmUgd3JhcHBlZCB3aXRoaW4gbXVsdGlwbGVcbiAqIHBhcmVudGhlc2VzIG9yIGFzIGV4cHJlc3Npb24uIGUuZy4gXCIoKCgoe2V4cH0pKSkpKClcIi4gVGhlIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdGhlXG4gKiBUeXBlU2NyaXB0IG5vZGUgcmVmZXJyaW5nIHRvIHRoZSBpbm5lciBleHByZXNzaW9uLiBlLmcgXCJleHBcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcEV4cHJlc3Npb24obm9kZTogdHMuRXhwcmVzc2lvbnx0cy5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbik6IHRzLkV4cHJlc3Npb24ge1xuICBpZiAodHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKSB8fCB0cy5pc0FzRXhwcmVzc2lvbihub2RlKSkge1xuICAgIHJldHVybiB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbn1cbiJdfQ==