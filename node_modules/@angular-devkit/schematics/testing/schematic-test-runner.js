"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchematicTestRunner = exports.UnitTestTree = void 0;
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const src_1 = require("../src");
const call_1 = require("../src/rules/call");
const node_1 = require("../tasks/node");
const tools_1 = require("../tools");
class UnitTestTree extends src_1.DelegateTree {
    get files() {
        const result = [];
        this.visit((path) => result.push(path));
        return result;
    }
    readContent(path) {
        const buffer = this.read(path);
        if (buffer === null) {
            return '';
        }
        return buffer.toString();
    }
}
exports.UnitTestTree = UnitTestTree;
class SchematicTestRunner {
    constructor(_collectionName, collectionPath) {
        this._collectionName = _collectionName;
        this._engineHost = new tools_1.NodeModulesTestEngineHost();
        this._engine = new src_1.SchematicEngine(this._engineHost);
        this._engineHost.registerCollection(_collectionName, collectionPath);
        this._logger = new core_1.logging.Logger('test');
        const registry = new core_1.schema.CoreSchemaRegistry(src_1.formats.standardFormats);
        registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        this._engineHost.registerOptionsTransform((0, tools_1.validateOptionsWithSchema)(registry));
        this._engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.NodePackage);
        this._engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.RepositoryInitializer);
        this._engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.RunSchematic);
        this._collection = this._engine.createCollection(this._collectionName);
    }
    get engine() {
        return this._engine;
    }
    get logger() {
        return this._logger;
    }
    get tasks() {
        return [...this._engineHost.tasks];
    }
    registerCollection(collectionName, collectionPath) {
        this._engineHost.registerCollection(collectionName, collectionPath);
    }
    runSchematicAsync(schematicName, opts, tree) {
        const schematic = this._collection.createSchematic(schematicName, true);
        const host = (0, rxjs_1.of)(tree || new src_1.HostTree());
        this._engineHost.clearTasks();
        return schematic
            .call(opts || {}, host, { logger: this._logger })
            .pipe((0, operators_1.map)((tree) => new UnitTestTree(tree)));
    }
    runExternalSchematicAsync(collectionName, schematicName, opts, tree) {
        const externalCollection = this._engine.createCollection(collectionName);
        const schematic = externalCollection.createSchematic(schematicName, true);
        const host = (0, rxjs_1.of)(tree || new src_1.HostTree());
        this._engineHost.clearTasks();
        return schematic
            .call(opts || {}, host, { logger: this._logger })
            .pipe((0, operators_1.map)((tree) => new UnitTestTree(tree)));
    }
    callRule(rule, tree, parentContext) {
        const context = this._engine.createContext({}, parentContext);
        return (0, call_1.callRule)(rule, (0, rxjs_1.of)(tree), context);
    }
}
exports.SchematicTestRunner = SchematicTestRunner;
