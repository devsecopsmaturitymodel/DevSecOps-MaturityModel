"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_1 = require("../../utility/workspace");
function default_1() {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        for (const [, project] of workspace.projects) {
            for (const [name, target] of project.targets) {
                // Delete removed tslint builder
                if (target.builder === '@angular-devkit/build-angular:tslint') {
                    project.targets.delete(name);
                }
                else if (target.builder === '@angular-devkit/build-angular:dev-server') {
                    for (const [, options] of (0, workspace_1.allTargetOptions)(target)) {
                        delete options.optimization;
                        delete options.aot;
                        delete options.progress;
                        delete options.deployUrl;
                        delete options.sourceMap;
                        delete options.vendorChunk;
                        delete options.commonChunk;
                        delete options.baseHref;
                        delete options.servePathDefaultWarning;
                        delete options.hmrWarning;
                    }
                }
                else if (target.builder.startsWith('@angular-devkit/build-angular')) {
                    // Only interested in Angular Devkit builders
                    for (const [, options] of (0, workspace_1.allTargetOptions)(target)) {
                        delete options.extractCss;
                    }
                }
            }
        }
    });
}
exports.default = default_1;
