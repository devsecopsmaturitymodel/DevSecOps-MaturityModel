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
        define("@angular/core/schematics/utils/typescript/class_declaration", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasExplicitConstructor = exports.findParentClassDeclaration = exports.getBaseTypeIdentifiers = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    /** Determines the base type identifiers of a specified class declaration. */
    function getBaseTypeIdentifiers(node) {
        if (!node.heritageClauses) {
            return null;
        }
        return node.heritageClauses.filter(clause => clause.token === typescript_1.default.SyntaxKind.ExtendsKeyword)
            .reduce((types, clause) => types.concat(clause.types), [])
            .map(typeExpression => typeExpression.expression)
            .filter(typescript_1.default.isIdentifier);
    }
    exports.getBaseTypeIdentifiers = getBaseTypeIdentifiers;
    /** Gets the first found parent class declaration of a given node. */
    function findParentClassDeclaration(node) {
        while (!typescript_1.default.isClassDeclaration(node)) {
            if (typescript_1.default.isSourceFile(node)) {
                return null;
            }
            node = node.parent;
        }
        return node;
    }
    exports.findParentClassDeclaration = findParentClassDeclaration;
    /** Checks whether the given class declaration has an explicit constructor or not. */
    function hasExplicitConstructor(node) {
        return node.members.some(typescript_1.default.isConstructorDeclaration);
    }
    exports.hasExplicitConstructor = hasExplicitConstructor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NfZGVjbGFyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvdHlwZXNjcmlwdC9jbGFzc19kZWNsYXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCw0REFBNEI7SUFFNUIsNkVBQTZFO0lBQzdFLFNBQWdCLHNCQUFzQixDQUFDLElBQXlCO1FBQzlELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7YUFDdEYsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBc0MsQ0FBQzthQUM3RixHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO2FBQ2hELE1BQU0sQ0FBQyxvQkFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFURCx3REFTQztJQUVELHFFQUFxRTtJQUNyRSxTQUFnQiwwQkFBMEIsQ0FBQyxJQUFhO1FBQ3RELE9BQU8sQ0FBQyxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLElBQUksb0JBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVJELGdFQVFDO0lBRUQscUZBQXFGO0lBQ3JGLFNBQWdCLHNCQUFzQixDQUFDLElBQXlCO1FBQzlELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFGRCx3REFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKiBEZXRlcm1pbmVzIHRoZSBiYXNlIHR5cGUgaWRlbnRpZmllcnMgb2YgYSBzcGVjaWZpZWQgY2xhc3MgZGVjbGFyYXRpb24uICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzZVR5cGVJZGVudGlmaWVycyhub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogdHMuSWRlbnRpZmllcltdfG51bGwge1xuICBpZiAoIW5vZGUuaGVyaXRhZ2VDbGF1c2VzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gbm9kZS5oZXJpdGFnZUNsYXVzZXMuZmlsdGVyKGNsYXVzZSA9PiBjbGF1c2UudG9rZW4gPT09IHRzLlN5bnRheEtpbmQuRXh0ZW5kc0tleXdvcmQpXG4gICAgICAucmVkdWNlKCh0eXBlcywgY2xhdXNlKSA9PiB0eXBlcy5jb25jYXQoY2xhdXNlLnR5cGVzKSwgW10gYXMgdHMuRXhwcmVzc2lvbldpdGhUeXBlQXJndW1lbnRzW10pXG4gICAgICAubWFwKHR5cGVFeHByZXNzaW9uID0+IHR5cGVFeHByZXNzaW9uLmV4cHJlc3Npb24pXG4gICAgICAuZmlsdGVyKHRzLmlzSWRlbnRpZmllcik7XG59XG5cbi8qKiBHZXRzIHRoZSBmaXJzdCBmb3VuZCBwYXJlbnQgY2xhc3MgZGVjbGFyYXRpb24gb2YgYSBnaXZlbiBub2RlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnRDbGFzc0RlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5DbGFzc0RlY2xhcmF0aW9ufG51bGwge1xuICB3aGlsZSAoIXRzLmlzQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgIGlmICh0cy5pc1NvdXJjZUZpbGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gY2xhc3MgZGVjbGFyYXRpb24gaGFzIGFuIGV4cGxpY2l0IGNvbnN0cnVjdG9yIG9yIG5vdC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNFeHBsaWNpdENvbnN0cnVjdG9yKG5vZGU6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUubWVtYmVycy5zb21lKHRzLmlzQ29uc3RydWN0b3JEZWNsYXJhdGlvbik7XG59XG4iXX0=