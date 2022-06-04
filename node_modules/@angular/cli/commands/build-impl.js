"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildCommand = void 0;
const architect_command_1 = require("../models/architect-command");
class BuildCommand extends architect_command_1.ArchitectCommand {
    constructor() {
        super(...arguments);
        this.target = 'build';
    }
    async run(options) {
        return this.runArchitectTarget(options);
    }
}
exports.BuildCommand = BuildCommand;
