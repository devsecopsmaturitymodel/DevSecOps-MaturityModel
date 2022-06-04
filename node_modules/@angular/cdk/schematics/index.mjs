"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse5 = void 0;
__exportStar(require("./utils"), exports);
__exportStar(require("./ng-update/public-api"), exports);
__exportStar(require("./update-tool/public-api"), exports);
// Re-exported so that Angular Material schematic code can consume the
// vendored "@schematics/angular" AST utils.
__exportStar(require("./utils/vendored-ast-utils"), exports);
// Re-export parse5 from the CDK. Material schematics code cannot simply import
// "parse5" because it could result in a different version. As long as we import
// it from within the CDK, it will always be the correct version that is specified
// in the CDK "package.json" as optional dependency.
const parse5 = require("parse5");
exports.parse5 = parse5;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBd0I7QUFDeEIseURBQXVDO0FBQ3ZDLDJEQUF5QztBQUV6QyxzRUFBc0U7QUFDdEUsNENBQTRDO0FBQzVDLDZEQUEyQztBQUUzQywrRUFBK0U7QUFDL0UsZ0ZBQWdGO0FBQ2hGLGtGQUFrRjtBQUNsRixvREFBb0Q7QUFDcEQsaUNBQWlDO0FBQ3pCLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnO1xuZXhwb3J0ICogZnJvbSAnLi9uZy11cGRhdGUvcHVibGljLWFwaSc7XG5leHBvcnQgKiBmcm9tICcuL3VwZGF0ZS10b29sL3B1YmxpYy1hcGknO1xuXG4vLyBSZS1leHBvcnRlZCBzbyB0aGF0IEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljIGNvZGUgY2FuIGNvbnN1bWUgdGhlXG4vLyB2ZW5kb3JlZCBcIkBzY2hlbWF0aWNzL2FuZ3VsYXJcIiBBU1QgdXRpbHMuXG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL3ZlbmRvcmVkLWFzdC11dGlscyc7XG5cbi8vIFJlLWV4cG9ydCBwYXJzZTUgZnJvbSB0aGUgQ0RLLiBNYXRlcmlhbCBzY2hlbWF0aWNzIGNvZGUgY2Fubm90IHNpbXBseSBpbXBvcnRcbi8vIFwicGFyc2U1XCIgYmVjYXVzZSBpdCBjb3VsZCByZXN1bHQgaW4gYSBkaWZmZXJlbnQgdmVyc2lvbi4gQXMgbG9uZyBhcyB3ZSBpbXBvcnRcbi8vIGl0IGZyb20gd2l0aGluIHRoZSBDREssIGl0IHdpbGwgYWx3YXlzIGJlIHRoZSBjb3JyZWN0IHZlcnNpb24gdGhhdCBpcyBzcGVjaWZpZWRcbi8vIGluIHRoZSBDREsgXCJwYWNrYWdlLmpzb25cIiBhcyBvcHRpb25hbCBkZXBlbmRlbmN5LlxuaW1wb3J0ICogYXMgcGFyc2U1IGZyb20gJ3BhcnNlNSc7XG5leHBvcnQge3BhcnNlNX07XG4iXX0=