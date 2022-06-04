/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { IconHarnessFilters, IconType } from './icon-harness-filters';
/** Harness for interacting with a standard mat-icon in tests. */
export declare class MatIconHarness extends ComponentHarness {
    /** The selector for the host element of a `MatIcon` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatIconHarness` that meets
     * certain criteria.
     * @param options Options for filtering which icon instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: IconHarnessFilters): HarnessPredicate<MatIconHarness>;
    /** Gets the type of the icon. */
    getType(): Promise<IconType>;
    /** Gets the name of the icon. */
    getName(): Promise<string | null>;
    /** Gets the namespace of the icon. */
    getNamespace(): Promise<string | null>;
    /** Gets whether the icon is inline. */
    isInline(): Promise<boolean>;
}
