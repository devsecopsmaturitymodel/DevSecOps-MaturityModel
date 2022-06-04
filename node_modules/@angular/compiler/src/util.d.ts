/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function dashCaseToCamelCase(input: string): string;
export declare function splitAtColon(input: string, defaultValues: string[]): string[];
export declare function splitAtPeriod(input: string, defaultValues: string[]): string[];
export declare function noUndefined<T>(val: T | undefined): T;
export declare function error(msg: string): never;
export declare function escapeRegExp(s: string): string;
export declare type Byte = number;
export declare function utf8Encode(str: string): Byte[];
export declare function stringify(token: any): string;
export declare class Version {
    full: string;
    readonly major: string;
    readonly minor: string;
    readonly patch: string;
    constructor(full: string);
}
export interface Console {
    log(message: string): void;
    warn(message: string): void;
}
declare const _global: {
    [name: string]: any;
};
export { _global as global };
export declare function newArray<T = any>(size: number): T[];
export declare function newArray<T>(size: number, value: T): T[];
/**
 * Partitions a given array into 2 arrays, based on a boolean value returned by the condition
 * function.
 *
 * @param arr Input array that should be partitioned
 * @param conditionFn Condition function that is called for each item in a given array and returns a
 * boolean value.
 */
export declare function partitionArray<T, F = T>(arr: (T | F)[], conditionFn: (value: T | F) => boolean): [T[], F[]];
