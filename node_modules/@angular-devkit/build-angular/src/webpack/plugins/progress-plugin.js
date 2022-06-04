"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressPlugin = void 0;
const webpack_1 = require("webpack");
const spinner_1 = require("../../utils/spinner");
class ProgressPlugin extends webpack_1.ProgressPlugin {
    constructor(platform) {
        const platformCapitalFirst = platform.replace(/^\w/, (s) => s.toUpperCase());
        const spinner = new spinner_1.Spinner();
        spinner.start(`Generating ${platform} application bundles (phase: setup)...`);
        super({
            handler: (percentage, message) => {
                const phase = message ? ` (phase: ${message})` : '';
                spinner.text = `Generating ${platform} application bundles${phase}...`;
                switch (percentage) {
                    case 1:
                        if (spinner.isSpinning) {
                            spinner.succeed(`${platformCapitalFirst} application bundle generation complete.`);
                        }
                        break;
                    case 0:
                        if (!spinner.isSpinning) {
                            spinner.start();
                        }
                        break;
                }
            },
        });
    }
}
exports.ProgressPlugin = ProgressPlugin;
