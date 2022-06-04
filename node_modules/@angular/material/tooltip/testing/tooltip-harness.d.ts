/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AsyncFactoryFn, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { TooltipHarnessFilters } from './tooltip-harness-filters';
export declare abstract class _MatTooltipHarnessBase extends ComponentHarness {
    protected abstract _optionalPanel: AsyncFactoryFn<TestElement | null>;
    protected abstract _hiddenClass: string;
    protected abstract _showAnimationName: string;
    protected abstract _hideAnimationName: string;
    /** Shows the tooltip. */
    show(): Promise<void>;
    /** Hides the tooltip. */
    hide(): Promise<void>;
    /** Gets whether the tooltip is open. */
    isOpen(): Promise<boolean>;
    /** Gets a promise for the tooltip panel's text. */
    getTooltipText(): Promise<string>;
}
/** Harness for interacting with a standard mat-tooltip in tests. */
export declare class MatTooltipHarness extends _MatTooltipHarnessBase {
    protected _optionalPanel: AsyncFactoryFn<TestElement | null>;
    protected _hiddenClass: string;
    protected _showAnimationName: string;
    protected _hideAnimationName: string;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TooltipHarnessFilters): HarnessPredicate<MatTooltipHarness>;
}
