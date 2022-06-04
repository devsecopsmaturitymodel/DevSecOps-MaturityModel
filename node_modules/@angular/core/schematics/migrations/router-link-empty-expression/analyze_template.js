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
        define("@angular/core/schematics/migrations/router-link-empty-expression/analyze_template", ["require", "exports", "@angular/core/schematics/utils/parse_html", "@angular/core/schematics/migrations/router-link-empty-expression/angular/html_routerlink_empty_expr_visitor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.analyzeResolvedTemplate = void 0;
    const parse_html_1 = require("@angular/core/schematics/utils/parse_html");
    const html_routerlink_empty_expr_visitor_1 = require("@angular/core/schematics/migrations/router-link-empty-expression/angular/html_routerlink_empty_expr_visitor");
    function analyzeResolvedTemplate(template, compilerModule) {
        const templateNodes = (0, parse_html_1.parseHtmlGracefully)(template.content, template.filePath, compilerModule);
        if (!templateNodes) {
            return null;
        }
        const visitor = new html_routerlink_empty_expr_visitor_1.RouterLinkEmptyExprVisitor(compilerModule);
        // Analyze the Angular Render3 HTML AST and collect all template variable assignments.
        visitor.visitAll(templateNodes);
        return visitor.emptyRouterLinkExpressions;
    }
    exports.analyzeResolvedTemplate = analyzeResolvedTemplate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZV90ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3JvdXRlci1saW5rLWVtcHR5LWV4cHJlc3Npb24vYW5hbHl6ZV90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFLSCwwRUFBMkQ7SUFFM0Qsb0tBQXdGO0lBRXhGLFNBQWdCLHVCQUF1QixDQUNuQyxRQUEwQixFQUMxQixjQUFrRDtRQUNwRCxNQUFNLGFBQWEsR0FBRyxJQUFBLGdDQUFtQixFQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUUvRixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLCtEQUEwQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRS9ELHNGQUFzRjtRQUN0RixPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWhDLE9BQU8sT0FBTyxDQUFDLDBCQUEwQixDQUFDO0lBQzVDLENBQUM7SUFmRCwwREFlQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHlwZSB7VG1wbEFzdEJvdW5kQXR0cmlidXRlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7UmVzb2x2ZWRUZW1wbGF0ZX0gZnJvbSAnLi4vLi4vdXRpbHMvbmdfY29tcG9uZW50X3RlbXBsYXRlJztcbmltcG9ydCB7cGFyc2VIdG1sR3JhY2VmdWxseX0gZnJvbSAnLi4vLi4vdXRpbHMvcGFyc2VfaHRtbCc7XG5cbmltcG9ydCB7Um91dGVyTGlua0VtcHR5RXhwclZpc2l0b3J9IGZyb20gJy4vYW5ndWxhci9odG1sX3JvdXRlcmxpbmtfZW1wdHlfZXhwcl92aXNpdG9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVSZXNvbHZlZFRlbXBsYXRlKFxuICAgIHRlbXBsYXRlOiBSZXNvbHZlZFRlbXBsYXRlLFxuICAgIGNvbXBpbGVyTW9kdWxlOiB0eXBlb2YgaW1wb3J0KCdAYW5ndWxhci9jb21waWxlcicpKTogVG1wbEFzdEJvdW5kQXR0cmlidXRlW118bnVsbCB7XG4gIGNvbnN0IHRlbXBsYXRlTm9kZXMgPSBwYXJzZUh0bWxHcmFjZWZ1bGx5KHRlbXBsYXRlLmNvbnRlbnQsIHRlbXBsYXRlLmZpbGVQYXRoLCBjb21waWxlck1vZHVsZSk7XG5cbiAgaWYgKCF0ZW1wbGF0ZU5vZGVzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB2aXNpdG9yID0gbmV3IFJvdXRlckxpbmtFbXB0eUV4cHJWaXNpdG9yKGNvbXBpbGVyTW9kdWxlKTtcblxuICAvLyBBbmFseXplIHRoZSBBbmd1bGFyIFJlbmRlcjMgSFRNTCBBU1QgYW5kIGNvbGxlY3QgYWxsIHRlbXBsYXRlIHZhcmlhYmxlIGFzc2lnbm1lbnRzLlxuICB2aXNpdG9yLnZpc2l0QWxsKHRlbXBsYXRlTm9kZXMpO1xuXG4gIHJldHVybiB2aXNpdG9yLmVtcHR5Um91dGVyTGlua0V4cHJlc3Npb25zO1xufVxuIl19