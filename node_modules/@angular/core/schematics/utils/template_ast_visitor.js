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
        define("@angular/core/schematics/utils/template_ast_visitor", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateAstVisitor = void 0;
    /**
     * A base class that can be used to implement a Render3 Template AST visitor.
     * This class is used instead of the `NullVisitor` found within the `@angular/compiler` because
     * the `NullVisitor` requires a deep import which is no longer supported with the ESM bundled
     * packages as of v13.
     * Schematics are also currently required to be CommonJS to support execution within the Angular
     * CLI. As a result, the ESM `@angular/compiler` package must be loaded via a native dynamic import.
     * Using a dynamic import makes classes extending from classes present in `@angular/compiler`
     * complicated due to the class not being present at module evaluation time. The classes using a
     * base class found within `@angular/compiler` must be wrapped in a factory to allow the class value
     * to be accessible at runtime after the dynamic import has completed. This class implements the
     * interface of the `TmplAstRecursiveVisitor` class (but does not extend) as the
     * `TmplAstRecursiveVisitor` as an interface provides the required set of visit methods. The base
     * interface `Visitor<T>` is not exported.
     */
    class TemplateAstVisitor {
        /**
         * Creates a new Render3 Template AST visitor using an instance of the `@angular/compiler`
         * package. Passing in the compiler is required due to the need to dynamically import the
         * ESM `@angular/compiler` into a CommonJS schematic.
         *
         * @param compilerModule The compiler instance that should be used within the visitor.
         */
        constructor(compilerModule) {
            this.compilerModule = compilerModule;
        }
        visitElement(element) { }
        visitTemplate(template) { }
        visitContent(content) { }
        visitVariable(variable) { }
        visitReference(reference) { }
        visitTextAttribute(attribute) { }
        visitBoundAttribute(attribute) { }
        visitBoundEvent(attribute) { }
        visitText(text) { }
        visitBoundText(text) { }
        visitIcu(icu) { }
        /**
         * Visits all the provided nodes in order using this Visitor's visit methods.
         * This is a simplified variant of the `visitAll` function found inside of (but not
         * exported from) the `@angular/compiler` that does not support returning a value
         * since the migrations do not directly transform the nodes.
         *
         * @param nodes An iterable of nodes to visit using this visitor.
         */
        visitAll(nodes) {
            for (const node of nodes) {
                node.visit(this);
            }
        }
    }
    exports.TemplateAstVisitor = TemplateAstVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfYXN0X3Zpc2l0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvdGVtcGxhdGVfYXN0X3Zpc2l0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBSUg7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxNQUFhLGtCQUFrQjtRQUM3Qjs7Ozs7O1dBTUc7UUFDSCxZQUErQixjQUFrRDtZQUFsRCxtQkFBYyxHQUFkLGNBQWMsQ0FBb0M7UUFBRyxDQUFDO1FBRXJGLFlBQVksQ0FBQyxPQUF1QixJQUFTLENBQUM7UUFDOUMsYUFBYSxDQUFDLFFBQXlCLElBQVMsQ0FBQztRQUNqRCxZQUFZLENBQUMsT0FBdUIsSUFBUyxDQUFDO1FBQzlDLGFBQWEsQ0FBQyxRQUF5QixJQUFTLENBQUM7UUFDakQsY0FBYyxDQUFDLFNBQTJCLElBQVMsQ0FBQztRQUNwRCxrQkFBa0IsQ0FBQyxTQUErQixJQUFTLENBQUM7UUFDNUQsbUJBQW1CLENBQUMsU0FBZ0MsSUFBUyxDQUFDO1FBQzlELGVBQWUsQ0FBQyxTQUE0QixJQUFTLENBQUM7UUFDdEQsU0FBUyxDQUFDLElBQWlCLElBQVMsQ0FBQztRQUNyQyxjQUFjLENBQUMsSUFBc0IsSUFBUyxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxHQUFlLElBQVMsQ0FBQztRQUVsQzs7Ozs7OztXQU9HO1FBQ0gsUUFBUSxDQUFDLEtBQTRCO1lBQ25DLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1FBQ0gsQ0FBQztLQUNGO0lBbkNELGdEQW1DQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHlwZSB7VG1wbEFzdEJvdW5kQXR0cmlidXRlLCBUbXBsQXN0Qm91bmRFdmVudCwgVG1wbEFzdEJvdW5kVGV4dCwgVG1wbEFzdENvbnRlbnQsIFRtcGxBc3RFbGVtZW50LCBUbXBsQXN0SWN1LCBUbXBsQXN0Tm9kZSwgVG1wbEFzdFJlY3Vyc2l2ZVZpc2l0b3IsIFRtcGxBc3RSZWZlcmVuY2UsIFRtcGxBc3RUZW1wbGF0ZSwgVG1wbEFzdFRleHQsIFRtcGxBc3RUZXh0QXR0cmlidXRlLCBUbXBsQXN0VmFyaWFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgdGhhdCBjYW4gYmUgdXNlZCB0byBpbXBsZW1lbnQgYSBSZW5kZXIzIFRlbXBsYXRlIEFTVCB2aXNpdG9yLlxuICogVGhpcyBjbGFzcyBpcyB1c2VkIGluc3RlYWQgb2YgdGhlIGBOdWxsVmlzaXRvcmAgZm91bmQgd2l0aGluIHRoZSBgQGFuZ3VsYXIvY29tcGlsZXJgIGJlY2F1c2VcbiAqIHRoZSBgTnVsbFZpc2l0b3JgIHJlcXVpcmVzIGEgZGVlcCBpbXBvcnQgd2hpY2ggaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCB3aXRoIHRoZSBFU00gYnVuZGxlZFxuICogcGFja2FnZXMgYXMgb2YgdjEzLlxuICogU2NoZW1hdGljcyBhcmUgYWxzbyBjdXJyZW50bHkgcmVxdWlyZWQgdG8gYmUgQ29tbW9uSlMgdG8gc3VwcG9ydCBleGVjdXRpb24gd2l0aGluIHRoZSBBbmd1bGFyXG4gKiBDTEkuIEFzIGEgcmVzdWx0LCB0aGUgRVNNIGBAYW5ndWxhci9jb21waWxlcmAgcGFja2FnZSBtdXN0IGJlIGxvYWRlZCB2aWEgYSBuYXRpdmUgZHluYW1pYyBpbXBvcnQuXG4gKiBVc2luZyBhIGR5bmFtaWMgaW1wb3J0IG1ha2VzIGNsYXNzZXMgZXh0ZW5kaW5nIGZyb20gY2xhc3NlcyBwcmVzZW50IGluIGBAYW5ndWxhci9jb21waWxlcmBcbiAqIGNvbXBsaWNhdGVkIGR1ZSB0byB0aGUgY2xhc3Mgbm90IGJlaW5nIHByZXNlbnQgYXQgbW9kdWxlIGV2YWx1YXRpb24gdGltZS4gVGhlIGNsYXNzZXMgdXNpbmcgYVxuICogYmFzZSBjbGFzcyBmb3VuZCB3aXRoaW4gYEBhbmd1bGFyL2NvbXBpbGVyYCBtdXN0IGJlIHdyYXBwZWQgaW4gYSBmYWN0b3J5IHRvIGFsbG93IHRoZSBjbGFzcyB2YWx1ZVxuICogdG8gYmUgYWNjZXNzaWJsZSBhdCBydW50aW1lIGFmdGVyIHRoZSBkeW5hbWljIGltcG9ydCBoYXMgY29tcGxldGVkLiBUaGlzIGNsYXNzIGltcGxlbWVudHMgdGhlXG4gKiBpbnRlcmZhY2Ugb2YgdGhlIGBUbXBsQXN0UmVjdXJzaXZlVmlzaXRvcmAgY2xhc3MgKGJ1dCBkb2VzIG5vdCBleHRlbmQpIGFzIHRoZVxuICogYFRtcGxBc3RSZWN1cnNpdmVWaXNpdG9yYCBhcyBhbiBpbnRlcmZhY2UgcHJvdmlkZXMgdGhlIHJlcXVpcmVkIHNldCBvZiB2aXNpdCBtZXRob2RzLiBUaGUgYmFzZVxuICogaW50ZXJmYWNlIGBWaXNpdG9yPFQ+YCBpcyBub3QgZXhwb3J0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUFzdFZpc2l0b3IgaW1wbGVtZW50cyBUbXBsQXN0UmVjdXJzaXZlVmlzaXRvciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFJlbmRlcjMgVGVtcGxhdGUgQVNUIHZpc2l0b3IgdXNpbmcgYW4gaW5zdGFuY2Ugb2YgdGhlIGBAYW5ndWxhci9jb21waWxlcmBcbiAgICogcGFja2FnZS4gUGFzc2luZyBpbiB0aGUgY29tcGlsZXIgaXMgcmVxdWlyZWQgZHVlIHRvIHRoZSBuZWVkIHRvIGR5bmFtaWNhbGx5IGltcG9ydCB0aGVcbiAgICogRVNNIGBAYW5ndWxhci9jb21waWxlcmAgaW50byBhIENvbW1vbkpTIHNjaGVtYXRpYy5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBpbGVyTW9kdWxlIFRoZSBjb21waWxlciBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSB1c2VkIHdpdGhpbiB0aGUgdmlzaXRvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBjb21waWxlck1vZHVsZTogdHlwZW9mIGltcG9ydCgnQGFuZ3VsYXIvY29tcGlsZXInKSkge31cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogVG1wbEFzdEVsZW1lbnQpOiB2b2lkIHt9XG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFRtcGxBc3RUZW1wbGF0ZSk6IHZvaWQge31cbiAgdmlzaXRDb250ZW50KGNvbnRlbnQ6IFRtcGxBc3RDb250ZW50KTogdm9pZCB7fVxuICB2aXNpdFZhcmlhYmxlKHZhcmlhYmxlOiBUbXBsQXN0VmFyaWFibGUpOiB2b2lkIHt9XG4gIHZpc2l0UmVmZXJlbmNlKHJlZmVyZW5jZTogVG1wbEFzdFJlZmVyZW5jZSk6IHZvaWQge31cbiAgdmlzaXRUZXh0QXR0cmlidXRlKGF0dHJpYnV0ZTogVG1wbEFzdFRleHRBdHRyaWJ1dGUpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGUoYXR0cmlidXRlOiBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRFdmVudChhdHRyaWJ1dGU6IFRtcGxBc3RCb3VuZEV2ZW50KTogdm9pZCB7fVxuICB2aXNpdFRleHQodGV4dDogVG1wbEFzdFRleHQpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRUZXh0KHRleHQ6IFRtcGxBc3RCb3VuZFRleHQpOiB2b2lkIHt9XG4gIHZpc2l0SWN1KGljdTogVG1wbEFzdEljdSk6IHZvaWQge31cblxuICAvKipcbiAgICogVmlzaXRzIGFsbCB0aGUgcHJvdmlkZWQgbm9kZXMgaW4gb3JkZXIgdXNpbmcgdGhpcyBWaXNpdG9yJ3MgdmlzaXQgbWV0aG9kcy5cbiAgICogVGhpcyBpcyBhIHNpbXBsaWZpZWQgdmFyaWFudCBvZiB0aGUgYHZpc2l0QWxsYCBmdW5jdGlvbiBmb3VuZCBpbnNpZGUgb2YgKGJ1dCBub3RcbiAgICogZXhwb3J0ZWQgZnJvbSkgdGhlIGBAYW5ndWxhci9jb21waWxlcmAgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHJldHVybmluZyBhIHZhbHVlXG4gICAqIHNpbmNlIHRoZSBtaWdyYXRpb25zIGRvIG5vdCBkaXJlY3RseSB0cmFuc2Zvcm0gdGhlIG5vZGVzLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZXMgQW4gaXRlcmFibGUgb2Ygbm9kZXMgdG8gdmlzaXQgdXNpbmcgdGhpcyB2aXNpdG9yLlxuICAgKi9cbiAgdmlzaXRBbGwobm9kZXM6IEl0ZXJhYmxlPFRtcGxBc3ROb2RlPik6IHZvaWQge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgbm9kZS52aXNpdCh0aGlzKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==