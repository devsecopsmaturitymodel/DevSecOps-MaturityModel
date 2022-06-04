"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeElementFromArrayExpression = exports.getParentSyntaxList = void 0;
const ts = require("typescript");
/**
 * Retrieves the parent syntax list of the given node. A syntax list node is usually
 * hidden from the default AST node hierarchy because it only contains information that
 * is need when printing a node. e.g. it contains information about comma positions in
 * an array literal expression.
 */
function getParentSyntaxList(node) {
    if (!node.parent) {
        return null;
    }
    const parent = node.parent;
    const { pos, end } = node;
    for (const child of parent.getChildren()) {
        if (child.pos > end || child === node) {
            return null;
        }
        if (child.kind === ts.SyntaxKind.SyntaxList && child.pos <= pos && child.end >= end) {
            return child;
        }
    }
    return null;
}
exports.getParentSyntaxList = getParentSyntaxList;
/** Looks for the trailing comma of the given element within the syntax list. */
function findTrailingCommaToken(list, element) {
    let foundElement = false;
    for (let child of list.getChildren()) {
        if (!foundElement && child === element) {
            foundElement = true;
        }
        else if (foundElement) {
            if (child.kind === ts.SyntaxKind.CommaToken) {
                return child;
            }
            break;
        }
    }
    return null;
}
/** Removes a given element from its parent array literal expression. */
function removeElementFromArrayExpression(element, recorder) {
    recorder.remove(element.getFullStart(), element.getFullWidth());
    const syntaxList = getParentSyntaxList(element);
    if (!syntaxList) {
        return;
    }
    // if there is a trailing comma token for the element, we need to remove it
    // because otherwise the array literal expression will have syntax failures.
    const trailingComma = findTrailingCommaToken(syntaxList, element);
    if (trailingComma !== null) {
        recorder.remove(trailingComma.getFullStart(), trailingComma.getFullWidth());
    }
}
exports.removeElementFromArrayExpression = removeElementFromArrayExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLWFycmF5LWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvcmVtb3ZlLWFycmF5LWVsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsaUNBQWlDO0FBRWpDOzs7OztHQUtHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsSUFBYTtJQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNoQixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMzQixNQUFNLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztJQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUN4QyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRTtZQUNuRixPQUFPLEtBQXNCLENBQUM7U0FDL0I7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWhCRCxrREFnQkM7QUFFRCxnRkFBZ0Y7QUFDaEYsU0FBUyxzQkFBc0IsQ0FBQyxJQUFtQixFQUFFLE9BQWdCO0lBQ25FLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7WUFDdEMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUNyQjthQUFNLElBQUksWUFBWSxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtnQkFDM0MsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUNELE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsd0VBQXdFO0FBQ3hFLFNBQWdCLGdDQUFnQyxDQUFDLE9BQWdCLEVBQUUsUUFBd0I7SUFDekYsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFaEUsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE9BQU87S0FDUjtJQUVELDJFQUEyRTtJQUMzRSw0RUFBNEU7SUFDNUUsTUFBTSxhQUFhLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLElBQUksYUFBYSxLQUFLLElBQUksRUFBRTtRQUMxQixRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsRUFBRSxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUM3RTtBQUNILENBQUM7QUFkRCw0RUFjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1VwZGF0ZVJlY29yZGVyfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHBhcmVudCBzeW50YXggbGlzdCBvZiB0aGUgZ2l2ZW4gbm9kZS4gQSBzeW50YXggbGlzdCBub2RlIGlzIHVzdWFsbHlcbiAqIGhpZGRlbiBmcm9tIHRoZSBkZWZhdWx0IEFTVCBub2RlIGhpZXJhcmNoeSBiZWNhdXNlIGl0IG9ubHkgY29udGFpbnMgaW5mb3JtYXRpb24gdGhhdFxuICogaXMgbmVlZCB3aGVuIHByaW50aW5nIGEgbm9kZS4gZS5nLiBpdCBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCBjb21tYSBwb3NpdGlvbnMgaW5cbiAqIGFuIGFycmF5IGxpdGVyYWwgZXhwcmVzc2lvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmVudFN5bnRheExpc3Qobm9kZTogdHMuTm9kZSk6IHRzLlN5bnRheExpc3QgfCBudWxsIHtcbiAgaWYgKCFub2RlLnBhcmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICBjb25zdCB7cG9zLCBlbmR9ID0gbm9kZTtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBwYXJlbnQuZ2V0Q2hpbGRyZW4oKSkge1xuICAgIGlmIChjaGlsZC5wb3MgPiBlbmQgfHwgY2hpbGQgPT09IG5vZGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5raW5kID09PSB0cy5TeW50YXhLaW5kLlN5bnRheExpc3QgJiYgY2hpbGQucG9zIDw9IHBvcyAmJiBjaGlsZC5lbmQgPj0gZW5kKSB7XG4gICAgICByZXR1cm4gY2hpbGQgYXMgdHMuU3ludGF4TGlzdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBMb29rcyBmb3IgdGhlIHRyYWlsaW5nIGNvbW1hIG9mIHRoZSBnaXZlbiBlbGVtZW50IHdpdGhpbiB0aGUgc3ludGF4IGxpc3QuICovXG5mdW5jdGlvbiBmaW5kVHJhaWxpbmdDb21tYVRva2VuKGxpc3Q6IHRzLlN5bnRheExpc3QsIGVsZW1lbnQ6IHRzLk5vZGUpOiB0cy5Ob2RlIHwgbnVsbCB7XG4gIGxldCBmb3VuZEVsZW1lbnQgPSBmYWxzZTtcbiAgZm9yIChsZXQgY2hpbGQgb2YgbGlzdC5nZXRDaGlsZHJlbigpKSB7XG4gICAgaWYgKCFmb3VuZEVsZW1lbnQgJiYgY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGZvdW5kRWxlbWVudCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmb3VuZEVsZW1lbnQpIHtcbiAgICAgIGlmIChjaGlsZC5raW5kID09PSB0cy5TeW50YXhLaW5kLkNvbW1hVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogUmVtb3ZlcyBhIGdpdmVuIGVsZW1lbnQgZnJvbSBpdHMgcGFyZW50IGFycmF5IGxpdGVyYWwgZXhwcmVzc2lvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihlbGVtZW50OiB0cy5Ob2RlLCByZWNvcmRlcjogVXBkYXRlUmVjb3JkZXIpIHtcbiAgcmVjb3JkZXIucmVtb3ZlKGVsZW1lbnQuZ2V0RnVsbFN0YXJ0KCksIGVsZW1lbnQuZ2V0RnVsbFdpZHRoKCkpO1xuXG4gIGNvbnN0IHN5bnRheExpc3QgPSBnZXRQYXJlbnRTeW50YXhMaXN0KGVsZW1lbnQpO1xuICBpZiAoIXN5bnRheExpc3QpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBpZiB0aGVyZSBpcyBhIHRyYWlsaW5nIGNvbW1hIHRva2VuIGZvciB0aGUgZWxlbWVudCwgd2UgbmVlZCB0byByZW1vdmUgaXRcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2UgdGhlIGFycmF5IGxpdGVyYWwgZXhwcmVzc2lvbiB3aWxsIGhhdmUgc3ludGF4IGZhaWx1cmVzLlxuICBjb25zdCB0cmFpbGluZ0NvbW1hID0gZmluZFRyYWlsaW5nQ29tbWFUb2tlbihzeW50YXhMaXN0LCBlbGVtZW50KTtcbiAgaWYgKHRyYWlsaW5nQ29tbWEgIT09IG51bGwpIHtcbiAgICByZWNvcmRlci5yZW1vdmUodHJhaWxpbmdDb21tYS5nZXRGdWxsU3RhcnQoKSwgdHJhaWxpbmdDb21tYS5nZXRGdWxsV2lkdGgoKSk7XG4gIH1cbn1cbiJdfQ==