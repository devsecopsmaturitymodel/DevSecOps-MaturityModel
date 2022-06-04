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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.workflow = exports.formats = exports.SchematicsException = void 0;
const formats = __importStar(require("./formats/index"));
exports.formats = formats;
const interface_1 = require("./tree/interface");
const static_1 = require("./tree/static");
const workflow = __importStar(require("./workflow/index"));
exports.workflow = workflow;
var exception_1 = require("./exception/exception");
Object.defineProperty(exports, "SchematicsException", { enumerable: true, get: function () { return exception_1.SchematicsException; } });
__exportStar(require("./tree/action"), exports);
__exportStar(require("./engine/index"), exports);
__exportStar(require("./exception/exception"), exports);
__exportStar(require("./tree/interface"), exports);
__exportStar(require("./rules/base"), exports);
__exportStar(require("./rules/call"), exports);
__exportStar(require("./rules/move"), exports);
__exportStar(require("./rules/random"), exports);
__exportStar(require("./rules/schematic"), exports);
__exportStar(require("./rules/template"), exports);
__exportStar(require("./rules/url"), exports);
__exportStar(require("./tree/delegate"), exports);
__exportStar(require("./tree/empty"), exports);
__exportStar(require("./tree/host-tree"), exports);
__exportStar(require("./engine/schematic"), exports);
__exportStar(require("./sink/dryrun"), exports);
__exportStar(require("./sink/host"), exports);
__exportStar(require("./sink/sink"), exports);
exports.Tree = {
    empty() {
        return (0, static_1.empty)();
    },
    branch(tree) {
        return (0, static_1.branch)(tree);
    },
    merge(tree, other, strategy = interface_1.MergeStrategy.Default) {
        return (0, static_1.merge)(tree, other, strategy);
    },
    partition(tree, predicate) {
        return (0, static_1.partition)(tree, predicate);
    },
    optimize(tree) {
        return tree;
    },
};
