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
        define("@angular/core/schematics/utils/typescript/nodes", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSafeAccess = exports.isNullCheck = exports.closestNode = exports.hasModifier = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    /** Checks whether the given TypeScript node has the specified modifier set. */
    function hasModifier(node, modifierKind) {
        return !!node.modifiers && node.modifiers.some(m => m.kind === modifierKind);
    }
    exports.hasModifier = hasModifier;
    /** Find the closest parent node of a particular kind. */
    function closestNode(node, kind) {
        let current = node;
        while (current && !typescript_1.default.isSourceFile(current)) {
            if (current.kind === kind) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }
    exports.closestNode = closestNode;
    /**
     * Checks whether a particular node is part of a null check. E.g. given:
     * `foo.bar ? foo.bar.value : null` the null check would be `foo.bar`.
     */
    function isNullCheck(node) {
        if (!node.parent) {
            return false;
        }
        // `foo.bar && foo.bar.value` where `node` is `foo.bar`.
        if (typescript_1.default.isBinaryExpression(node.parent) && node.parent.left === node) {
            return true;
        }
        // `foo.bar && foo.bar.parent && foo.bar.parent.value`
        // where `node` is `foo.bar`.
        if (node.parent.parent && typescript_1.default.isBinaryExpression(node.parent.parent) &&
            node.parent.parent.left === node.parent) {
            return true;
        }
        // `if (foo.bar) {...}` where `node` is `foo.bar`.
        if (typescript_1.default.isIfStatement(node.parent) && node.parent.expression === node) {
            return true;
        }
        // `foo.bar ? foo.bar.value : null` where `node` is `foo.bar`.
        if (typescript_1.default.isConditionalExpression(node.parent) && node.parent.condition === node) {
            return true;
        }
        return false;
    }
    exports.isNullCheck = isNullCheck;
    /** Checks whether a property access is safe (e.g. `foo.parent?.value`). */
    function isSafeAccess(node) {
        return node.parent != null && typescript_1.default.isPropertyAccessExpression(node.parent) &&
            node.parent.expression === node && node.parent.questionDotToken != null;
    }
    exports.isSafeAccess = isSafeAccess;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvdHlwZXNjcmlwdC9ub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCw0REFBNEI7SUFFNUIsK0VBQStFO0lBQy9FLFNBQWdCLFdBQVcsQ0FBQyxJQUFhLEVBQUUsWUFBMkI7UUFDcEUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUZELGtDQUVDO0lBRUQseURBQXlEO0lBQ3pELFNBQWdCLFdBQVcsQ0FBb0IsSUFBYSxFQUFFLElBQW1CO1FBQy9FLElBQUksT0FBTyxHQUFZLElBQUksQ0FBQztRQUU1QixPQUFPLE9BQU8sSUFBSSxDQUFDLG9CQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3pCLE9BQU8sT0FBWSxDQUFDO2FBQ3JCO1lBQ0QsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDMUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFYRCxrQ0FXQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLFdBQVcsQ0FBQyxJQUFhO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCx3REFBd0Q7UUFDeEQsSUFBSSxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDbkUsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELHNEQUFzRDtRQUN0RCw2QkFBNkI7UUFDN0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzNDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxrREFBa0Q7UUFDbEQsSUFBSSxvQkFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO1lBQ3BFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCw4REFBOEQ7UUFDOUQsSUFBSSxvQkFBRSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUU7WUFDN0UsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQTVCRCxrQ0E0QkM7SUFFRCwyRUFBMkU7SUFDM0UsU0FBZ0IsWUFBWSxDQUFDLElBQWE7UUFDeEMsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxvQkFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO0lBQzlFLENBQUM7SUFIRCxvQ0FHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gVHlwZVNjcmlwdCBub2RlIGhhcyB0aGUgc3BlY2lmaWVkIG1vZGlmaWVyIHNldC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNNb2RpZmllcihub2RlOiB0cy5Ob2RlLCBtb2RpZmllcktpbmQ6IHRzLlN5bnRheEtpbmQpIHtcbiAgcmV0dXJuICEhbm9kZS5tb2RpZmllcnMgJiYgbm9kZS5tb2RpZmllcnMuc29tZShtID0+IG0ua2luZCA9PT0gbW9kaWZpZXJLaW5kKTtcbn1cblxuLyoqIEZpbmQgdGhlIGNsb3Nlc3QgcGFyZW50IG5vZGUgb2YgYSBwYXJ0aWN1bGFyIGtpbmQuICovXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VzdE5vZGU8VCBleHRlbmRzIHRzLk5vZGU+KG5vZGU6IHRzLk5vZGUsIGtpbmQ6IHRzLlN5bnRheEtpbmQpOiBUfG51bGwge1xuICBsZXQgY3VycmVudDogdHMuTm9kZSA9IG5vZGU7XG5cbiAgd2hpbGUgKGN1cnJlbnQgJiYgIXRzLmlzU291cmNlRmlsZShjdXJyZW50KSkge1xuICAgIGlmIChjdXJyZW50LmtpbmQgPT09IGtpbmQpIHtcbiAgICAgIHJldHVybiBjdXJyZW50IGFzIFQ7XG4gICAgfVxuICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgcGFydGljdWxhciBub2RlIGlzIHBhcnQgb2YgYSBudWxsIGNoZWNrLiBFLmcuIGdpdmVuOlxuICogYGZvby5iYXIgPyBmb28uYmFyLnZhbHVlIDogbnVsbGAgdGhlIG51bGwgY2hlY2sgd291bGQgYmUgYGZvby5iYXJgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOdWxsQ2hlY2sobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICBpZiAoIW5vZGUucGFyZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gYGZvby5iYXIgJiYgZm9vLmJhci52YWx1ZWAgd2hlcmUgYG5vZGVgIGlzIGBmb28uYmFyYC5cbiAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gYGZvby5iYXIgJiYgZm9vLmJhci5wYXJlbnQgJiYgZm9vLmJhci5wYXJlbnQudmFsdWVgXG4gIC8vIHdoZXJlIGBub2RlYCBpcyBgZm9vLmJhcmAuXG4gIGlmIChub2RlLnBhcmVudC5wYXJlbnQgJiYgdHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUucGFyZW50LnBhcmVudCkgJiZcbiAgICAgIG5vZGUucGFyZW50LnBhcmVudC5sZWZ0ID09PSBub2RlLnBhcmVudCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gYGlmIChmb28uYmFyKSB7Li4ufWAgd2hlcmUgYG5vZGVgIGlzIGBmb28uYmFyYC5cbiAgaWYgKHRzLmlzSWZTdGF0ZW1lbnQobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50LmV4cHJlc3Npb24gPT09IG5vZGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGBmb28uYmFyID8gZm9vLmJhci52YWx1ZSA6IG51bGxgIHdoZXJlIGBub2RlYCBpcyBgZm9vLmJhcmAuXG4gIGlmICh0cy5pc0NvbmRpdGlvbmFsRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnQuY29uZGl0aW9uID09PSBub2RlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIHByb3BlcnR5IGFjY2VzcyBpcyBzYWZlIChlLmcuIGBmb28ucGFyZW50Py52YWx1ZWApLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmZUFjY2Vzcyhub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBub2RlLnBhcmVudCAhPSBudWxsICYmIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSAmJlxuICAgICAgbm9kZS5wYXJlbnQuZXhwcmVzc2lvbiA9PT0gbm9kZSAmJiBub2RlLnBhcmVudC5xdWVzdGlvbkRvdFRva2VuICE9IG51bGw7XG59XG4iXX0=