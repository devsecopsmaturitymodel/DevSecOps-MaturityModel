/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Constructor, AbstractConstructor } from './constructor';
import { CanDisable } from './disabled';
/** @docs-private */
export interface HasTabIndex {
    /** Tabindex of the component. */
    tabIndex: number;
    /** Tabindex to which to fall back to if no value is set. */
    defaultTabIndex: number;
}
declare type HasTabIndexCtor = Constructor<HasTabIndex> & AbstractConstructor<HasTabIndex>;
/** Mixin to augment a directive with a `tabIndex` property. */
export declare function mixinTabIndex<T extends AbstractConstructor<CanDisable>>(base: T, defaultTabIndex?: number): HasTabIndexCtor & T;
export {};
