"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkspaceHost = void 0;
const virtual_fs_1 = require("../virtual-fs");
function createWorkspaceHost(host) {
    const workspaceHost = {
        async readFile(path) {
            const data = await host.read((0, virtual_fs_1.normalize)(path)).toPromise();
            return virtual_fs_1.virtualFs.fileBufferToString(data);
        },
        async writeFile(path, data) {
            return host.write((0, virtual_fs_1.normalize)(path), virtual_fs_1.virtualFs.stringToFileBuffer(data)).toPromise();
        },
        async isDirectory(path) {
            try {
                return await host.isDirectory((0, virtual_fs_1.normalize)(path)).toPromise();
            }
            catch {
                // some hosts throw if path does not exist
                return false;
            }
        },
        async isFile(path) {
            try {
                return await host.isFile((0, virtual_fs_1.normalize)(path)).toPromise();
            }
            catch {
                // some hosts throw if path does not exist
                return false;
            }
        },
    };
    return workspaceHost;
}
exports.createWorkspaceHost = createWorkspaceHost;
