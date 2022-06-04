/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DividerHarnessFilters } from './divider-harness-filters';
/** Harness for interacting with a `mat-divider`. */
export declare class MatDividerHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: DividerHarnessFilters): HarnessPredicate<MatDividerHarness>;
    getOrientation(): Promise<'horizontal' | 'vertical'>;
    isInset(): Promise<boolean>;
}
