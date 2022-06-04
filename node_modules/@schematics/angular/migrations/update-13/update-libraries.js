"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const json_file_1 = require("../../utility/json-file");
const workspace_1 = require("../../utility/workspace");
function* visit(directory) {
    for (const path of directory.subfiles) {
        if (path === 'package.json') {
            const entry = directory.file(path);
            if ((entry === null || entry === void 0 ? void 0 : entry.content.toString().includes('ngPackage')) !== true) {
                continue;
            }
        }
        else if (path !== 'ng-package.json') {
            continue;
        }
        yield (0, core_1.join)(directory.path, path);
    }
    for (const path of directory.subdirs) {
        if (path === 'node_modules' || path.startsWith('.')) {
            continue;
        }
        yield* visit(directory.dir(path));
    }
}
function default_1() {
    const ENABLE_IVY_JSON_PATH = ['angularCompilerOptions', 'enableIvy'];
    const COMPILATION_MODE_JSON_PATH = ['angularCompilerOptions', 'compilationMode'];
    const NG_PACKAGR_DEPRECATED_OPTIONS_PATHS = [
        ['lib', 'umdModuleIds'],
        ['lib', 'amdId'],
        ['lib', 'umdId'],
        ['ngPackage', 'lib', 'umdModuleIds'],
        ['ngPackage', 'lib', 'amdId'],
        ['ngPackage', 'lib', 'umdId'],
    ];
    return async (tree, context) => {
        const workspace = await (0, workspace_1.getWorkspace)(tree);
        const librariesTsConfig = new Set();
        const ngPackagrConfig = new Set();
        for (const [, project] of workspace.projects) {
            for (const [_, target] of project.targets) {
                if (target.builder !== '@angular-devkit/build-angular:ng-packagr') {
                    continue;
                }
                for (const [, options] of (0, workspace_1.allTargetOptions)(target)) {
                    if (typeof options.tsConfig === 'string') {
                        librariesTsConfig.add(options.tsConfig);
                    }
                    if (typeof options.project === 'string') {
                        if (options.project.endsWith('.json')) {
                            ngPackagrConfig.add(options.project);
                        }
                        else {
                            context.logger
                                .warn(core_1.tags.stripIndent `Expected a JSON configuration file but found "${options.project}".
                  You may need to adjust the configuration file to remove invalid options.
                  For more information, see the breaking changes section within the release notes: https://github.com/ng-packagr/ng-packagr/releases/tag/v13.0.0/.`);
                        }
                    }
                }
            }
        }
        // Gather configurations which are not referecned in angular.json
        // (This happens when users have secondary entry-points)
        for (const p of visit(tree.root)) {
            ngPackagrConfig.add(p);
        }
        // Update ng-packagr configuration
        for (const config of ngPackagrConfig) {
            const json = new json_file_1.JSONFile(tree, config);
            for (const optionPath of NG_PACKAGR_DEPRECATED_OPTIONS_PATHS) {
                json.remove(optionPath);
            }
        }
        // Update tsconfig files
        for (const tsConfig of librariesTsConfig) {
            const json = new json_file_1.JSONFile(tree, tsConfig);
            if (json.get(ENABLE_IVY_JSON_PATH) === false) {
                json.remove(ENABLE_IVY_JSON_PATH);
                json.modify(COMPILATION_MODE_JSON_PATH, 'partial');
            }
        }
    };
}
exports.default = default_1;
