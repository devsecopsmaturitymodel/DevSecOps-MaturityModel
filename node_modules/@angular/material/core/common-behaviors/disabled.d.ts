/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbstractConstructor, Constructor } from './constructor';
/** @docs-private */
export interface CanDisable {
    /** Whether the component is disabled. */
    disabled: boolean;
}
declare type CanDisableCtor = Constructor<CanDisable> & AbstractConstructor<CanDisable>;
/** Mixin to augment a directive with a `disabled` property. */
export declare function mixinDisabled<T extends AbstractConstructor<{}>>(base: T): CanDisableCtor & T;
export {};
