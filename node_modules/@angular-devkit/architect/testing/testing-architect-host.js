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
exports.TestingArchitectHost = void 0;
const src_1 = require("../src");
class TestingArchitectHost {
    /**
     * Can provide a backend host, in case of integration tests.
     * @param workspaceRoot The workspace root to use.
     * @param currentDirectory The current directory to use.
     * @param _backendHost A host to defer calls that aren't resolved here.
     */
    constructor(workspaceRoot = '', currentDirectory = workspaceRoot, _backendHost = null) {
        this.workspaceRoot = workspaceRoot;
        this.currentDirectory = currentDirectory;
        this._backendHost = _backendHost;
        this._builderImportMap = new Map();
        this._builderMap = new Map();
        this._targetMap = new Map();
    }
    addBuilder(builderName, builder, description = 'Testing only builder.', optionSchema = { type: 'object' }) {
        this._builderImportMap.set(builderName, builder);
        this._builderMap.set(builderName, { builderName, description, optionSchema });
    }
    async addBuilderFromPackage(packageName) {
        const packageJson = await Promise.resolve().then(() => __importStar(require(packageName + '/package.json')));
        if (!('builders' in packageJson)) {
            throw new Error('Invalid package.json, builders key not found.');
        }
        if (!packageJson.name) {
            throw new Error('Invalid package name');
        }
        const builderJsonPath = packageName + '/' + packageJson['builders'];
        const builderJson = await Promise.resolve().then(() => __importStar(require(builderJsonPath)));
        const builders = builderJson['builders'];
        if (!builders) {
            throw new Error('Invalid builders.json, builders key not found.');
        }
        for (const builderName of Object.keys(builders)) {
            const b = builders[builderName];
            // TODO: remove this check as v1 is not supported anymore.
            if (!b.implementation) {
                continue;
            }
            const handler = (await Promise.resolve().then(() => __importStar(require(builderJsonPath + '/../' + b.implementation)))).default;
            const optionsSchema = await Promise.resolve().then(() => __importStar(require(builderJsonPath + '/../' + b.schema)));
            this.addBuilder(`${packageJson.name}:${builderName}`, handler, b.description, optionsSchema);
        }
    }
    addTarget(target, builderName, options = {}) {
        this._targetMap.set((0, src_1.targetStringFromTarget)(target), { builderName, options });
    }
    async getBuilderNameForTarget(target) {
        const name = (0, src_1.targetStringFromTarget)(target);
        const maybeTarget = this._targetMap.get(name);
        if (!maybeTarget) {
            return this._backendHost && this._backendHost.getBuilderNameForTarget(target);
        }
        return maybeTarget.builderName;
    }
    /**
     * Resolve a builder. This needs to return a string which will be used in a dynamic `import()`
     * clause. This should throw if no builder can be found. The dynamic import will throw if
     * it is unsupported.
     * @param builderName The name of the builder to be used.
     * @returns All the info needed for the builder itself.
     */
    async resolveBuilder(builderName) {
        return (this._builderMap.get(builderName) ||
            (this._backendHost && this._backendHost.resolveBuilder(builderName)));
    }
    async getCurrentDirectory() {
        return this.currentDirectory;
    }
    async getWorkspaceRoot() {
        return this.workspaceRoot;
    }
    async getOptionsForTarget(target) {
        const name = (0, src_1.targetStringFromTarget)(target);
        const maybeTarget = this._targetMap.get(name);
        if (!maybeTarget) {
            return this._backendHost && this._backendHost.getOptionsForTarget(target);
        }
        return maybeTarget.options;
    }
    async getProjectMetadata(target) {
        return this._backendHost && this._backendHost.getProjectMetadata(target);
    }
    async loadBuilder(info) {
        return (this._builderImportMap.get(info.builderName) ||
            (this._backendHost && this._backendHost.loadBuilder(info)));
    }
}
exports.TestingArchitectHost = TestingArchitectHost;
