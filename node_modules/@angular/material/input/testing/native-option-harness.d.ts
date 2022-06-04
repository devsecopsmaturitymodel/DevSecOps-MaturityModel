/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { NativeOptionHarnessFilters } from './native-select-harness-filters';
/** Harness for interacting with a native `option` in tests. */
export declare class MatNativeOptionHarness extends ComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeOptionHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NativeOptionHarnessFilters): HarnessPredicate<MatNativeOptionHarness>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
    /** Index of the option within the native `select` element. */
    getIndex(): Promise<number>;
    /** Gets whether the option is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the option is selected. */
    isSelected(): Promise<boolean>;
}
