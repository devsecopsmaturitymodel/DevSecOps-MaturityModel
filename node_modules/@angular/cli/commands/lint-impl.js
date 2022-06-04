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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LintCommand = void 0;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const architect_command_1 = require("../models/architect-command");
const prompt_1 = require("../utilities/prompt");
const MissingBuilder = `
Cannot find "lint" target for the specified project.

You should add a package that implements linting capabilities.

For example:
  ng add @angular-eslint/schematics
`;
class LintCommand extends architect_command_1.ArchitectCommand {
    constructor() {
        super(...arguments);
        this.target = 'lint';
        this.multiTarget = true;
    }
    async initialize(options) {
        if (!options.help) {
            return super.initialize(options);
        }
    }
    async onMissingTarget() {
        this.logger.warn(MissingBuilder);
        const shouldAdd = await (0, prompt_1.askConfirmation)('Would you like to add ESLint now?', true, false);
        if (shouldAdd) {
            // Run `ng add @angular-eslint/schematics`
            const binPath = path.resolve(__dirname, '../bin/ng.js');
            const { status, error } = (0, child_process_1.spawnSync)(process.execPath, [binPath, 'add', '@angular-eslint/schematics'], {
                stdio: 'inherit',
            });
            if (error) {
                throw error;
            }
        }
        // Return an exit code to force the command to exit after adding the package
        return 1;
    }
}
exports.LintCommand = LintCommand;
