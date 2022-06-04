/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SnackBarHarnessFilters } from './snack-bar-harness-filters';
/** Harness for interacting with a standard mat-snack-bar in tests. */
export declare class MatSnackBarHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatSnackBar` instance. */
    static hostSelector: string;
    protected _messageSelector: string;
    protected _actionButtonSelector: string;
    private _snackBarLiveRegion;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SnackBarHarnessFilters): HarnessPredicate<MatSnackBarHarness>;
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     * @deprecated Use `getAriaLive` instead.
     * @breaking-change 13.0.0
     */
    getRole(): Promise<'alert' | 'status' | null>;
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    getAriaLive(): Promise<AriaLivePoliteness>;
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    hasAction(): Promise<boolean>;
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    getActionDescription(): Promise<string>;
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    dismissWithAction(): Promise<void>;
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    getMessage(): Promise<string>;
    /** Gets whether the snack-bar has been dismissed. */
    isDismissed(): Promise<boolean>;
    /**
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    protected _assertContentAnnotated(): Promise<void>;
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    protected _assertHasAction(): Promise<void>;
    /** Whether the snack-bar is using the default content template. */
    private _isSimpleSnackBar;
    /** Gets the simple snack bar action button. */
    private _getActionButton;
}
