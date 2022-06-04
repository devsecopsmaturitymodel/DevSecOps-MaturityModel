"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHammerScriptImportElements = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/**
 * Parses the specified HTML content and looks for "script" elements which
 * potentially import HammerJS. These elements will be returned.
 */
function findHammerScriptImportElements(htmlContent) {
    const document = schematics_1.parse5.parse(htmlContent, { sourceCodeLocationInfo: true });
    const nodeQueue = [...document.childNodes];
    const result = [];
    while (nodeQueue.length) {
        const node = nodeQueue.shift();
        if (node.childNodes) {
            nodeQueue.push(...node.childNodes);
        }
        if (node.nodeName.toLowerCase() === 'script' && node.attrs.length !== 0) {
            const srcAttribute = node.attrs.find(a => a.name === 'src');
            if (srcAttribute && isPotentialHammerScriptReference(srcAttribute.value)) {
                result.push(node);
            }
        }
    }
    return result;
}
exports.findHammerScriptImportElements = findHammerScriptImportElements;
/**
 * Checks whether the specified source path is potentially referring to the
 * HammerJS script output.
 */
function isPotentialHammerScriptReference(srcPath) {
    return /\/hammer(\.min)?\.js($|\?)/.test(srcPath);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQStDO0FBRS9DOzs7R0FHRztBQUNILFNBQWdCLDhCQUE4QixDQUFDLFdBQW1CO0lBQ2hFLE1BQU0sUUFBUSxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFDLHNCQUFzQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDM0UsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQyxNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO0lBRXBDLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUN2QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFvQixDQUFDO1FBRWpELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQzVELElBQUksWUFBWSxJQUFJLGdDQUFnQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBcEJELHdFQW9CQztBQUVEOzs7R0FHRztBQUNILFNBQVMsZ0NBQWdDLENBQUMsT0FBZTtJQUN2RCxPQUFPLDRCQUE0QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2U1fSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogUGFyc2VzIHRoZSBzcGVjaWZpZWQgSFRNTCBjb250ZW50IGFuZCBsb29rcyBmb3IgXCJzY3JpcHRcIiBlbGVtZW50cyB3aGljaFxuICogcG90ZW50aWFsbHkgaW1wb3J0IEhhbW1lckpTLiBUaGVzZSBlbGVtZW50cyB3aWxsIGJlIHJldHVybmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzKGh0bWxDb250ZW50OiBzdHJpbmcpOiBwYXJzZTUuRWxlbWVudFtdIHtcbiAgY29uc3QgZG9jdW1lbnQgPSBwYXJzZTUucGFyc2UoaHRtbENvbnRlbnQsIHtzb3VyY2VDb2RlTG9jYXRpb25JbmZvOiB0cnVlfSk7XG4gIGNvbnN0IG5vZGVRdWV1ZSA9IFsuLi5kb2N1bWVudC5jaGlsZE5vZGVzXTtcbiAgY29uc3QgcmVzdWx0OiBwYXJzZTUuRWxlbWVudFtdID0gW107XG5cbiAgd2hpbGUgKG5vZGVRdWV1ZS5sZW5ndGgpIHtcbiAgICBjb25zdCBub2RlID0gbm9kZVF1ZXVlLnNoaWZ0KCkgYXMgcGFyc2U1LkVsZW1lbnQ7XG5cbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICBub2RlUXVldWUucHVzaCguLi5ub2RlLmNoaWxkTm9kZXMpO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzY3JpcHQnICYmIG5vZGUuYXR0cnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICBjb25zdCBzcmNBdHRyaWJ1dGUgPSBub2RlLmF0dHJzLmZpbmQoYSA9PiBhLm5hbWUgPT09ICdzcmMnKTtcbiAgICAgIGlmIChzcmNBdHRyaWJ1dGUgJiYgaXNQb3RlbnRpYWxIYW1tZXJTY3JpcHRSZWZlcmVuY2Uoc3JjQXR0cmlidXRlLnZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgc3BlY2lmaWVkIHNvdXJjZSBwYXRoIGlzIHBvdGVudGlhbGx5IHJlZmVycmluZyB0byB0aGVcbiAqIEhhbW1lckpTIHNjcmlwdCBvdXRwdXQuXG4gKi9cbmZ1bmN0aW9uIGlzUG90ZW50aWFsSGFtbWVyU2NyaXB0UmVmZXJlbmNlKHNyY1BhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gL1xcL2hhbW1lcihcXC5taW4pP1xcLmpzKCR8XFw/KS8udGVzdChzcmNQYXRoKTtcbn1cbiJdfQ==