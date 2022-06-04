"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2eCommand = void 0;
const architect_command_1 = require("../models/architect-command");
class E2eCommand extends architect_command_1.ArchitectCommand {
    constructor() {
        super(...arguments);
        this.target = 'e2e';
        this.multiTarget = true;
        this.missingTargetError = `
Cannot find "e2e" target for the specified project.

You should add a package that implements end-to-end testing capabilities.

For example:
  Cypress: ng add @cypress/schematic
  Nightwatch: ng add @nightwatch/schematics
  WebdriverIO: ng add @wdio/schematics

More options will be added to the list as they become available.
`;
    }
    async initialize(options) {
        if (!options.help) {
            return super.initialize(options);
        }
    }
}
exports.E2eCommand = E2eCommand;
