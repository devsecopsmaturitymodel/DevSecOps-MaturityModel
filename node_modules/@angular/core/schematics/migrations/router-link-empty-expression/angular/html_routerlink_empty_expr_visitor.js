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
        define("@angular/core/schematics/migrations/router-link-empty-expression/angular/html_routerlink_empty_expr_visitor", ["require", "exports", "@angular/core/schematics/utils/template_ast_visitor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouterLinkEmptyExprVisitor = void 0;
    const template_ast_visitor_1 = require("@angular/core/schematics/utils/template_ast_visitor");
    /**
     * HTML AST visitor that traverses the Render3 HTML AST in order to find all
     * undefined routerLink asssignment ([routerLink]="").
     */
    class RouterLinkEmptyExprVisitor extends template_ast_visitor_1.TemplateAstVisitor {
        constructor() {
            super(...arguments);
            this.emptyRouterLinkExpressions = [];
        }
        visitElement(element) {
            this.visitAll(element.inputs);
            this.visitAll(element.children);
        }
        visitTemplate(t) {
            this.visitAll(t.inputs);
            this.visitAll(t.children);
        }
        visitBoundAttribute(node) {
            if (node.name === 'routerLink' && node.value instanceof this.compilerModule.ASTWithSource &&
                node.value.ast instanceof this.compilerModule.EmptyExpr) {
                this.emptyRouterLinkExpressions.push(node);
            }
        }
    }
    exports.RouterLinkEmptyExprVisitor = RouterLinkEmptyExprVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9yb3V0ZXJsaW5rX2VtcHR5X2V4cHJfdmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3JvdXRlci1saW5rLWVtcHR5LWV4cHJlc3Npb24vYW5ndWxhci9odG1sX3JvdXRlcmxpbmtfZW1wdHlfZXhwcl92aXNpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUdILDhGQUF1RTtJQUV2RTs7O09BR0c7SUFDSCxNQUFhLDBCQUEyQixTQUFRLHlDQUFrQjtRQUFsRTs7WUFDVywrQkFBMEIsR0FBNEIsRUFBRSxDQUFDO1FBa0JwRSxDQUFDO1FBaEJVLFlBQVksQ0FBQyxPQUF1QjtZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRVEsYUFBYSxDQUFDLENBQWtCO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFUSxtQkFBbUIsQ0FBQyxJQUEyQjtZQUN0RCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhO2dCQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRTtnQkFDM0QsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUM7S0FDRjtJQW5CRCxnRUFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHR5cGUge1RtcGxBc3RCb3VuZEF0dHJpYnV0ZSwgVG1wbEFzdEVsZW1lbnQsIFRtcGxBc3RUZW1wbGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtUZW1wbGF0ZUFzdFZpc2l0b3J9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3RlbXBsYXRlX2FzdF92aXNpdG9yJztcblxuLyoqXG4gKiBIVE1MIEFTVCB2aXNpdG9yIHRoYXQgdHJhdmVyc2VzIHRoZSBSZW5kZXIzIEhUTUwgQVNUIGluIG9yZGVyIHRvIGZpbmQgYWxsXG4gKiB1bmRlZmluZWQgcm91dGVyTGluayBhc3NzaWdubWVudCAoW3JvdXRlckxpbmtdPVwiXCIpLlxuICovXG5leHBvcnQgY2xhc3MgUm91dGVyTGlua0VtcHR5RXhwclZpc2l0b3IgZXh0ZW5kcyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICByZWFkb25seSBlbXB0eVJvdXRlckxpbmtFeHByZXNzaW9uczogVG1wbEFzdEJvdW5kQXR0cmlidXRlW10gPSBbXTtcblxuICBvdmVycmlkZSB2aXNpdEVsZW1lbnQoZWxlbWVudDogVG1wbEFzdEVsZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0QWxsKGVsZW1lbnQuaW5wdXRzKTtcbiAgICB0aGlzLnZpc2l0QWxsKGVsZW1lbnQuY2hpbGRyZW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRUZW1wbGF0ZSh0OiBUbXBsQXN0VGVtcGxhdGUpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0QWxsKHQuaW5wdXRzKTtcbiAgICB0aGlzLnZpc2l0QWxsKHQuY2hpbGRyZW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRCb3VuZEF0dHJpYnV0ZShub2RlOiBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUpIHtcbiAgICBpZiAobm9kZS5uYW1lID09PSAncm91dGVyTGluaycgJiYgbm9kZS52YWx1ZSBpbnN0YW5jZW9mIHRoaXMuY29tcGlsZXJNb2R1bGUuQVNUV2l0aFNvdXJjZSAmJlxuICAgICAgICBub2RlLnZhbHVlLmFzdCBpbnN0YW5jZW9mIHRoaXMuY29tcGlsZXJNb2R1bGUuRW1wdHlFeHByKSB7XG4gICAgICB0aGlzLmVtcHR5Um91dGVyTGlua0V4cHJlc3Npb25zLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG59XG4iXX0=