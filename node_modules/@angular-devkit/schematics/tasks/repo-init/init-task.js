"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryInitializerTask = void 0;
const options_1 = require("./options");
class RepositoryInitializerTask {
    constructor(workingDirectory, commitOptions) {
        this.workingDirectory = workingDirectory;
        this.commitOptions = commitOptions;
    }
    toConfiguration() {
        return {
            name: options_1.RepositoryInitializerName,
            options: {
                commit: !!this.commitOptions,
                workingDirectory: this.workingDirectory,
                authorName: this.commitOptions && this.commitOptions.name,
                authorEmail: this.commitOptions && this.commitOptions.email,
                message: this.commitOptions && this.commitOptions.message,
            },
        };
    }
}
exports.RepositoryInitializerTask = RepositoryInitializerTask;
