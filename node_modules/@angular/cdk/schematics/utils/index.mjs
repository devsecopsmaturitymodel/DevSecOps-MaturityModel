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
__exportStar(require("./ast"), exports);
__exportStar(require("./ast/ng-module-imports"), exports);
__exportStar(require("./build-component"), exports);
__exportStar(require("./get-project"), exports);
__exportStar(require("./html-manipulation"), exports);
__exportStar(require("./parse5-element"), exports);
__exportStar(require("./project-index-file"), exports);
__exportStar(require("./project-main-file"), exports);
__exportStar(require("./project-style-file"), exports);
__exportStar(require("./project-targets"), exports);
__exportStar(require("./schematic-options"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHdDQUFzQjtBQUN0QiwwREFBd0M7QUFDeEMsb0RBQWtDO0FBQ2xDLGdEQUE4QjtBQUM5QixzREFBb0M7QUFDcEMsbURBQWlDO0FBQ2pDLHVEQUFxQztBQUNyQyxzREFBb0M7QUFDcEMsdURBQXFDO0FBQ3JDLG9EQUFrQztBQUNsQyxzREFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9hc3QnO1xuZXhwb3J0ICogZnJvbSAnLi9hc3QvbmctbW9kdWxlLWltcG9ydHMnO1xuZXhwb3J0ICogZnJvbSAnLi9idWlsZC1jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXQtcHJvamVjdCc7XG5leHBvcnQgKiBmcm9tICcuL2h0bWwtbWFuaXB1bGF0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vcGFyc2U1LWVsZW1lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9wcm9qZWN0LWluZGV4LWZpbGUnO1xuZXhwb3J0ICogZnJvbSAnLi9wcm9qZWN0LW1haW4tZmlsZSc7XG5leHBvcnQgKiBmcm9tICcuL3Byb2plY3Qtc3R5bGUtZmlsZSc7XG5leHBvcnQgKiBmcm9tICcuL3Byb2plY3QtdGFyZ2V0cyc7XG5leHBvcnQgKiBmcm9tICcuL3NjaGVtYXRpYy1vcHRpb25zJztcbiJdfQ==