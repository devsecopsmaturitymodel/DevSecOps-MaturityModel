"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunSchematicTask = exports.RepositoryInitializerTask = exports.NodePackageLinkTask = exports.NodePackageInstallTask = void 0;
var install_task_1 = require("./package-manager/install-task");
Object.defineProperty(exports, "NodePackageInstallTask", { enumerable: true, get: function () { return install_task_1.NodePackageInstallTask; } });
var link_task_1 = require("./package-manager/link-task");
Object.defineProperty(exports, "NodePackageLinkTask", { enumerable: true, get: function () { return link_task_1.NodePackageLinkTask; } });
var init_task_1 = require("./repo-init/init-task");
Object.defineProperty(exports, "RepositoryInitializerTask", { enumerable: true, get: function () { return init_task_1.RepositoryInitializerTask; } });
var task_1 = require("./run-schematic/task");
Object.defineProperty(exports, "RunSchematicTask", { enumerable: true, get: function () { return task_1.RunSchematicTask; } });
