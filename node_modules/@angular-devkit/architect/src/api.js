"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTargetAndForget = exports.targetFromTargetString = exports.targetStringFromTarget = exports.fromAsyncIterable = exports.isBuilderOutput = exports.BuilderProgressState = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const progress_schema_1 = require("./progress-schema");
Object.defineProperty(exports, "BuilderProgressState", { enumerable: true, get: function () { return progress_schema_1.State; } });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBuilderOutput(obj) {
    if (!obj || typeof obj.then === 'function' || typeof obj.subscribe === 'function') {
        return false;
    }
    if (typeof obj[Symbol.asyncIterator] === 'function') {
        return false;
    }
    return typeof obj.success === 'boolean';
}
exports.isBuilderOutput = isBuilderOutput;
function fromAsyncIterable(iterable) {
    return new rxjs_1.Observable((subscriber) => {
        handleAsyncIterator(subscriber, iterable[Symbol.asyncIterator]()).then(() => subscriber.complete(), (error) => subscriber.error(error));
    });
}
exports.fromAsyncIterable = fromAsyncIterable;
async function handleAsyncIterator(subscriber, iterator) {
    var _a;
    const teardown = new Promise((resolve) => subscriber.add(() => resolve()));
    try {
        while (!subscriber.closed) {
            const result = await Promise.race([teardown, iterator.next()]);
            if (!result || result.done) {
                break;
            }
            subscriber.next(result.value);
        }
    }
    finally {
        await ((_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator));
    }
}
/**
 * Returns a string of "project:target[:configuration]" for the target object.
 */
function targetStringFromTarget({ project, target, configuration }) {
    return `${project}:${target}${configuration !== undefined ? ':' + configuration : ''}`;
}
exports.targetStringFromTarget = targetStringFromTarget;
/**
 * Return a Target tuple from a string.
 */
function targetFromTargetString(str) {
    const tuple = str.split(/:/, 3);
    if (tuple.length < 2) {
        throw new Error('Invalid target string: ' + JSON.stringify(str));
    }
    return {
        project: tuple[0],
        target: tuple[1],
        ...(tuple[2] !== undefined && { configuration: tuple[2] }),
    };
}
exports.targetFromTargetString = targetFromTargetString;
/**
 * Schedule a target, and forget about its run. This will return an observable of outputs, that
 * as a a teardown will stop the target from running. This means that the Run object this returns
 * should not be shared.
 *
 * The reason this is not part of the Context interface is to keep the Context as normal form as
 * possible. This is really an utility that people would implement in their project.
 *
 * @param context The context of your current execution.
 * @param target The target to schedule.
 * @param overrides Overrides that are used in the target.
 * @param scheduleOptions Additional scheduling options.
 */
function scheduleTargetAndForget(context, target, overrides, scheduleOptions) {
    let resolve = null;
    const promise = new Promise((r) => (resolve = r));
    context.addTeardown(() => promise);
    return (0, rxjs_1.from)(context.scheduleTarget(target, overrides, scheduleOptions)).pipe((0, operators_1.switchMap)((run) => new rxjs_1.Observable((observer) => {
        const subscription = run.output.subscribe(observer);
        return () => {
            subscription.unsubscribe();
            // We can properly ignore the floating promise as it's a "reverse" promise; the teardown
            // is waiting for the resolve.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            run.stop().then(resolve);
        };
    })));
}
exports.scheduleTargetAndForget = scheduleTargetAndForget;
