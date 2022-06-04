"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWorkflow = void 0;
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const node_2 = require("../../tasks/node");
const node_module_engine_host_1 = require("../node-module-engine-host");
const schema_option_transform_1 = require("../schema-option-transform");
/**
 * A workflow specifically for Node tools.
 */
class NodeWorkflow extends schematics_1.workflow.BaseWorkflow {
    constructor(hostOrRoot, options) {
        var _a;
        let host;
        let root;
        if (typeof hostOrRoot === 'string') {
            root = (0, core_1.normalize)(hostOrRoot);
            host = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), root);
        }
        else {
            host = hostOrRoot;
            root = options.root;
        }
        const engineHost = ((_a = options.engineHostCreator) === null || _a === void 0 ? void 0 : _a.call(options, options)) || new node_module_engine_host_1.NodeModulesEngineHost(options.resolvePaths);
        super({
            host,
            engineHost,
            force: options.force,
            dryRun: options.dryRun,
            registry: options.registry,
        });
        engineHost.registerTaskExecutor(node_2.BuiltinTaskExecutor.NodePackage, {
            allowPackageManagerOverride: true,
            packageManager: options.packageManager,
            force: options.packageManagerForce,
            rootDirectory: root && (0, core_1.getSystemPath)(root),
            registry: options.packageRegistry,
        });
        engineHost.registerTaskExecutor(node_2.BuiltinTaskExecutor.RepositoryInitializer, {
            rootDirectory: root && (0, core_1.getSystemPath)(root),
        });
        engineHost.registerTaskExecutor(node_2.BuiltinTaskExecutor.RunSchematic);
        if (options.optionTransforms) {
            for (const transform of options.optionTransforms) {
                engineHost.registerOptionsTransform(transform);
            }
        }
        if (options.schemaValidation) {
            engineHost.registerOptionsTransform((0, schema_option_transform_1.validateOptionsWithSchema)(this.registry));
        }
        this._context = [];
    }
    get engine() {
        return this._engine;
    }
    get engineHost() {
        return this._engineHost;
    }
}
exports.NodeWorkflow = NodeWorkflow;
