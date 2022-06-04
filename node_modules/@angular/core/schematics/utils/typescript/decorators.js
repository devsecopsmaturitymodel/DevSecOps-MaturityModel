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
        define("@angular/core/schematics/utils/typescript/decorators", ["require", "exports", "typescript", "@angular/core/schematics/utils/typescript/imports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCallDecoratorImport = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    const imports_1 = require("@angular/core/schematics/utils/typescript/imports");
    function getCallDecoratorImport(typeChecker, decorator) {
        // Note that this does not cover the edge case where decorators are called from
        // a namespace import: e.g. "@core.Component()". This is not handled by Ngtsc either.
        if (!typescript_1.default.isCallExpression(decorator.expression) ||
            !typescript_1.default.isIdentifier(decorator.expression.expression)) {
            return null;
        }
        const identifier = decorator.expression.expression;
        return (0, imports_1.getImportOfIdentifier)(typeChecker, identifier);
    }
    exports.getCallDecoratorImport = getCallDecoratorImport;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy90eXBlc2NyaXB0L2RlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNERBQTRCO0lBRTVCLCtFQUF3RDtJQUV4RCxTQUFnQixzQkFBc0IsQ0FDbEMsV0FBMkIsRUFBRSxTQUF1QjtRQUN0RCwrRUFBK0U7UUFDL0UscUZBQXFGO1FBQ3JGLElBQUksQ0FBQyxvQkFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDMUMsQ0FBQyxvQkFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUNuRCxPQUFPLElBQUEsK0JBQXFCLEVBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFYRCx3REFXQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Z2V0SW1wb3J0T2ZJZGVudGlmaWVyLCBJbXBvcnR9IGZyb20gJy4vaW1wb3J0cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWxsRGVjb3JhdG9ySW1wb3J0KFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgZGVjb3JhdG9yOiB0cy5EZWNvcmF0b3IpOiBJbXBvcnR8bnVsbCB7XG4gIC8vIE5vdGUgdGhhdCB0aGlzIGRvZXMgbm90IGNvdmVyIHRoZSBlZGdlIGNhc2Ugd2hlcmUgZGVjb3JhdG9ycyBhcmUgY2FsbGVkIGZyb21cbiAgLy8gYSBuYW1lc3BhY2UgaW1wb3J0OiBlLmcuIFwiQGNvcmUuQ29tcG9uZW50KClcIi4gVGhpcyBpcyBub3QgaGFuZGxlZCBieSBOZ3RzYyBlaXRoZXIuXG4gIGlmICghdHMuaXNDYWxsRXhwcmVzc2lvbihkZWNvcmF0b3IuZXhwcmVzc2lvbikgfHxcbiAgICAgICF0cy5pc0lkZW50aWZpZXIoZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGlkZW50aWZpZXIgPSBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uO1xuICByZXR1cm4gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKHR5cGVDaGVja2VyLCBpZGVudGlmaWVyKTtcbn1cbiJdfQ==