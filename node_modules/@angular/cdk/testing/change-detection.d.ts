/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Represents the status of auto change detection. */
export interface AutoChangeDetectionStatus {
    /** Whether auto change detection is disabled. */
    isDisabled: boolean;
    /**
     * An optional callback, if present it indicates that change detection should be run immediately,
     * while handling the status change. The callback should then be called as soon as change
     * detection is done.
     */
    onDetectChangesNow?: () => void;
}
/**
 * Allows a test `HarnessEnvironment` to install its own handler for auto change detection status
 * changes.
 * @param handler The handler for the auto change detection status.
 */
export declare function handleAutoChangeDetectionStatus(handler: (status: AutoChangeDetectionStatus) => void): void;
/** Allows a `HarnessEnvironment` to stop handling auto change detection status changes. */
export declare function stopHandlingAutoChangeDetectionStatus(): void;
/**
 * Disables the harness system's auto change detection for the duration of the given function.
 * @param fn The function to disable auto change detection for.
 * @return The result of the given function.
 */
export declare function manualChangeDetection<T>(fn: () => Promise<T>): Promise<T>;
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export declare function parallel<T1, T2, T3, T4, T5>(values: () => [
    T1 | PromiseLike<T1>,
    T2 | PromiseLike<T2>,
    T3 | PromiseLike<T3>,
    T4 | PromiseLike<T4>,
    T5 | PromiseLike<T5>
]): Promise<[T1, T2, T3, T4, T5]>;
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export declare function parallel<T1, T2, T3, T4>(values: () => [
    T1 | PromiseLike<T1>,
    T2 | PromiseLike<T2>,
    T3 | PromiseLike<T3>,
    T4 | PromiseLike<T4>
]): Promise<[T1, T2, T3, T4]>;
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export declare function parallel<T1, T2, T3>(values: () => [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]): Promise<[T1, T2, T3]>;
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export declare function parallel<T1, T2>(values: () => [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export declare function parallel<T>(values: () => (T | PromiseLike<T>)[]): Promise<T[]>;
