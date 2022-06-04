"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const src_1 = require("../src");
exports.default = (0, src_1.createBuilder)((options, context) => {
    const allRuns = [];
    context.reportProgress(0, (options.targets ? options.targets.length : 0) +
        (options.builders ? options.builders.length : 0));
    if (options.targets) {
        allRuns.push(...options.targets.map(({ target: targetStr, overrides }) => {
            const [project, target, configuration] = targetStr.split(/:/g, 3);
            return () => context.scheduleTarget({ project, target, configuration }, overrides || {});
        }));
    }
    if (options.builders) {
        allRuns.push(...options.builders.map(({ builder, options }) => {
            return () => context.scheduleBuilder(builder, options || {});
        }));
    }
    let stop = null;
    let i = 0;
    context.reportProgress(i++, allRuns.length);
    return (0, rxjs_1.from)(allRuns).pipe((0, operators_1.concatMap)((fn) => stop
        ? (0, rxjs_1.of)(null)
        : (0, rxjs_1.from)(fn()).pipe((0, operators_1.switchMap)((run) => (run === null ? (0, rxjs_1.of)(null) : run.output.pipe((0, operators_1.first)()))))), (0, operators_1.map)((output) => {
        context.reportProgress(i++, allRuns.length);
        if (output === null || stop !== null) {
            return stop || { success: false };
        }
        else if (output.success === false) {
            return (stop = output);
        }
        else {
            return output;
        }
    }), (0, operators_1.last)());
});
