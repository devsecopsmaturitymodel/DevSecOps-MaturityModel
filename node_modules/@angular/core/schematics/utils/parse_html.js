/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/parse_html", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseHtmlGracefully = void 0;
    /**
     * Parses the given HTML content using the Angular compiler. In case the parsing
     * fails, null is being returned.
     */
    function parseHtmlGracefully(htmlContent, filePath, compilerModule) {
        try {
            return compilerModule.parseTemplate(htmlContent, filePath).nodes;
        }
        catch (_a) {
            // Do nothing if the template couldn't be parsed. We don't want to throw any
            // exception if a template is syntactically not valid. e.g. template could be
            // using preprocessor syntax.
            return null;
        }
    }
    exports.parseHtmlGracefully = parseHtmlGracefully;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy9wYXJzZV9odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUlIOzs7T0FHRztJQUNILFNBQWdCLG1CQUFtQixDQUMvQixXQUFtQixFQUFFLFFBQWdCLEVBQ3JDLGNBQWtEO1FBQ3BELElBQUk7WUFDRixPQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNsRTtRQUFDLFdBQU07WUFDTiw0RUFBNEU7WUFDNUUsNkVBQTZFO1lBQzdFLDZCQUE2QjtZQUM3QixPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQVhELGtEQVdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB0eXBlIHtUbXBsQXN0Tm9kZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgZ2l2ZW4gSFRNTCBjb250ZW50IHVzaW5nIHRoZSBBbmd1bGFyIGNvbXBpbGVyLiBJbiBjYXNlIHRoZSBwYXJzaW5nXG4gKiBmYWlscywgbnVsbCBpcyBiZWluZyByZXR1cm5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSHRtbEdyYWNlZnVsbHkoXG4gICAgaHRtbENvbnRlbnQ6IHN0cmluZywgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBjb21waWxlck1vZHVsZTogdHlwZW9mIGltcG9ydCgnQGFuZ3VsYXIvY29tcGlsZXInKSk6IFRtcGxBc3ROb2RlW118bnVsbCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNvbXBpbGVyTW9kdWxlLnBhcnNlVGVtcGxhdGUoaHRtbENvbnRlbnQsIGZpbGVQYXRoKS5ub2RlcztcbiAgfSBjYXRjaCB7XG4gICAgLy8gRG8gbm90aGluZyBpZiB0aGUgdGVtcGxhdGUgY291bGRuJ3QgYmUgcGFyc2VkLiBXZSBkb24ndCB3YW50IHRvIHRocm93IGFueVxuICAgIC8vIGV4Y2VwdGlvbiBpZiBhIHRlbXBsYXRlIGlzIHN5bnRhY3RpY2FsbHkgbm90IHZhbGlkLiBlLmcuIHRlbXBsYXRlIGNvdWxkIGJlXG4gICAgLy8gdXNpbmcgcHJlcHJvY2Vzc29yIHN5bnRheC5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19