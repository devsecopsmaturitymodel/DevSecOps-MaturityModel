"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleActionExecutor = void 0;
const piscina_1 = __importDefault(require("piscina"));
const environment_options_1 = require("./environment-options");
const workerFile = require.resolve('./process-bundle');
class BundleActionExecutor {
    constructor(workerOptions) {
        this.workerOptions = workerOptions;
    }
    ensureWorkerPool() {
        if (this.workerPool) {
            return this.workerPool;
        }
        this.workerPool = new piscina_1.default({
            filename: workerFile,
            name: 'inlineLocales',
            workerData: this.workerOptions,
            maxThreads: environment_options_1.maxWorkers,
        });
        return this.workerPool;
    }
    async inline(action) {
        return this.ensureWorkerPool().run(action, { name: 'inlineLocales' });
    }
    inlineAll(actions) {
        return BundleActionExecutor.executeAll(actions, (action) => this.inline(action));
    }
    static async *executeAll(actions, executor) {
        const executions = new Map();
        for (const action of actions) {
            const execution = executor(action);
            executions.set(execution, execution.then((result) => [execution, result]));
        }
        while (executions.size > 0) {
            const [execution, result] = await Promise.race(executions.values());
            executions.delete(execution);
            yield result;
        }
    }
    stop() {
        var _a;
        void ((_a = this.workerPool) === null || _a === void 0 ? void 0 : _a.destroy());
    }
}
exports.BundleActionExecutor = BundleActionExecutor;
