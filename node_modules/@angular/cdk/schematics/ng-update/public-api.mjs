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
__exportStar(require("./data/index"), exports);
__exportStar(require("./devkit-migration"), exports);
__exportStar(require("./devkit-migration-rule"), exports);
__exportStar(require("./html-parsing/angular"), exports);
__exportStar(require("./html-parsing/elements"), exports);
__exportStar(require("./typescript/base-types"), exports);
__exportStar(require("./typescript/imports"), exports);
__exportStar(require("./typescript/literal"), exports);
__exportStar(require("./typescript/module-specifiers"), exports);
__exportStar(require("./upgrade-data"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy9uZy11cGRhdGUvcHVibGljLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsK0NBQTZCO0FBQzdCLHFEQUFtQztBQUNuQywwREFBd0M7QUFDeEMseURBQXVDO0FBQ3ZDLDBEQUF3QztBQUN4QywwREFBd0M7QUFDeEMsdURBQXFDO0FBQ3JDLHVEQUFxQztBQUNyQyxpRUFBK0M7QUFDL0MsaURBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vZGF0YS9pbmRleCc7XG5leHBvcnQgKiBmcm9tICcuL2RldmtpdC1taWdyYXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9kZXZraXQtbWlncmF0aW9uLXJ1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9odG1sLXBhcnNpbmcvYW5ndWxhcic7XG5leHBvcnQgKiBmcm9tICcuL2h0bWwtcGFyc2luZy9lbGVtZW50cyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzY3JpcHQvYmFzZS10eXBlcyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzY3JpcHQvaW1wb3J0cyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzY3JpcHQvbGl0ZXJhbCc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzY3JpcHQvbW9kdWxlLXNwZWNpZmllcnMnO1xuZXhwb3J0ICogZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuIl19