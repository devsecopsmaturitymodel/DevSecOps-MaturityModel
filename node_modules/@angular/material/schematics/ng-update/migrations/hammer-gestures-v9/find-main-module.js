"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMainModuleExpression = void 0;
const ts = require("typescript");
/**
 * Finds the main Angular module within the specified source file. The first module
 * that is part of the "bootstrapModule" expression is returned.
 */
function findMainModuleExpression(mainSourceFile) {
    let foundModule = null;
    const visitNode = (node) => {
        if (ts.isCallExpression(node) &&
            node.arguments.length &&
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.name) &&
            node.expression.name.text === 'bootstrapModule') {
            foundModule = node.arguments[0];
        }
        else {
            ts.forEachChild(node, visitNode);
        }
    };
    ts.forEachChild(mainSourceFile, visitNode);
    return foundModule;
}
exports.findMainModuleExpression = findMainModuleExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1tYWluLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9maW5kLW1haW4tbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQUVqQzs7O0dBR0c7QUFDSCxTQUFnQix3QkFBd0IsQ0FBQyxjQUE2QjtJQUNwRSxJQUFJLFdBQVcsR0FBeUIsSUFBSSxDQUFDO0lBQzdDLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7UUFDbEMsSUFDRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtZQUNyQixFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFDL0M7WUFDQSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsQ0FBQztTQUNsQzthQUFNO1lBQ0wsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDLENBQUM7SUFFRixFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUUzQyxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBbkJELDREQW1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWFpbiBBbmd1bGFyIG1vZHVsZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gVGhlIGZpcnN0IG1vZHVsZVxuICogdGhhdCBpcyBwYXJ0IG9mIHRoZSBcImJvb3RzdHJhcE1vZHVsZVwiIGV4cHJlc3Npb24gaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb24obWFpblNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5FeHByZXNzaW9uIHwgbnVsbCB7XG4gIGxldCBmb3VuZE1vZHVsZTogdHMuRXhwcmVzc2lvbiB8IG51bGwgPSBudWxsO1xuICBjb25zdCB2aXNpdE5vZGUgPSAobm9kZTogdHMuTm9kZSkgPT4ge1xuICAgIGlmIChcbiAgICAgIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgJiZcbiAgICAgIG5vZGUuYXJndW1lbnRzLmxlbmd0aCAmJlxuICAgICAgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSAmJlxuICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUuZXhwcmVzc2lvbi5uYW1lKSAmJlxuICAgICAgbm9kZS5leHByZXNzaW9uLm5hbWUudGV4dCA9PT0gJ2Jvb3RzdHJhcE1vZHVsZSdcbiAgICApIHtcbiAgICAgIGZvdW5kTW9kdWxlID0gbm9kZS5hcmd1bWVudHNbMF0hO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgdmlzaXROb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgdHMuZm9yRWFjaENoaWxkKG1haW5Tb3VyY2VGaWxlLCB2aXNpdE5vZGUpO1xuXG4gIHJldHVybiBmb3VuZE1vZHVsZTtcbn1cbiJdfQ==