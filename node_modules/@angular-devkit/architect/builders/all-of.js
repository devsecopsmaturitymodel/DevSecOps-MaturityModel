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
        allRuns.push(...options.targets.map(({ target: targetStr, overrides }, i) => {
            const [project, target, configuration] = targetStr.split(/:/g, 3);
            return context
                .scheduleTarget({ project, target, configuration }, overrides || {})
                .then((run) => [i, run]);
        }));
    }
    if (options.builders) {
        allRuns.push(...options.builders.map(({ builder, options }, i) => {
            return context
                .scheduleBuilder(builder, options || {})
                .then((run) => [i, run]);
        }));
    }
    const allResults = allRuns.map(() => null);
    let n = 0;
    context.reportProgress(n++, allRuns.length);
    return (0, rxjs_1.from)(allRuns).pipe((0, operators_1.mergeMap)((runPromise) => (0, rxjs_1.from)(runPromise)), (0, operators_1.mergeMap)(([i, run]) => run.output.pipe((0, operators_1.map)((output) => [i, output]))), (0, operators_1.mergeMap)(([i, output]) => {
        allResults[i] = output;
        context.reportProgress(n++, allRuns.length);
        if (allResults.some((x) => x === null)) {
            // Some builders aren't done running yet.
            return rxjs_1.EMPTY;
        }
        else {
            return (0, rxjs_1.of)({
                success: allResults.every((x) => (x ? x.success : false)),
            });
        }
    }));
});
