"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTestTransformLoader = void 0;
const core_1 = require("@angular-devkit/core");
const path_1 = require("path");
exports.SingleTestTransformLoader = __filename;
/**
 * This loader transforms the default test file to only run tests
 * for some specs instead of all specs.
 * It works by replacing the known content of the auto-generated test file:
 *   const context = require.context('./', true, /\.spec\.ts$/);
 *   context.keys().map(context);
 * with:
 *   const context = { keys: () => ({ map: (_a) => { } }) };
 *   context.keys().map(context);
 * So that it does nothing.
 * Then it adds import statements for each file in the files options
 * array to import them directly, and thus run the tests there.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loader(source) {
    const { files = [], logger = console } = this.getOptions();
    // signal the user that expected content is not present.
    if (!source.includes('require.context(')) {
        logger.error(core_1.tags.stripIndent `The 'include' option requires that the 'main' file for tests includes the below line:
      const context = require.context('./', true, /\.spec\.ts$/);
      Arguments passed to require.context are not strict and can be changed.`);
        return source;
    }
    const targettedImports = files
        .map((path) => `require('./${path.replace('.' + (0, path_1.extname)(path), '')}');`)
        .join('\n');
    const mockedRequireContext = 'Object.assign(() => { }, { keys: () => [], resolve: () => undefined });\n';
    source = source.replace(/require\.context\(.*/, mockedRequireContext + targettedImports);
    return source;
}
exports.default = loader;
