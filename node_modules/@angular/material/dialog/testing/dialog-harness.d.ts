/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { DialogRole } from '@angular/material/dialog';
import { DialogHarnessFilters } from './dialog-harness-filters';
/** Selectors for different sections of the mat-dialog that can contain user content. */
export declare const enum MatDialogSection {
    TITLE = ".mat-dialog-title",
    CONTENT = ".mat-dialog-content",
    ACTIONS = ".mat-dialog-actions"
}
/** Base class for the `MatDialogHarness` implementation. */
export declare class _MatDialogHarnessBase extends ContentContainerComponentHarness<MatDialogSection | string> {
    protected _title: import("@angular/cdk/testing").AsyncFactoryFn<import("@angular/cdk/testing").TestElement | null>;
    protected _content: import("@angular/cdk/testing").AsyncFactoryFn<import("@angular/cdk/testing").TestElement | null>;
    protected _actions: import("@angular/cdk/testing").AsyncFactoryFn<import("@angular/cdk/testing").TestElement | null>;
    /** Gets the id of the dialog. */
    getId(): Promise<string | null>;
    /** Gets the role of the dialog. */
    getRole(): Promise<DialogRole | null>;
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby(): Promise<string | null>;
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    close(): Promise<void>;
    /** Gets te dialog's text. */
    getText(): Promise<string>;
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    getTitleText(): Promise<string>;
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    getContentText(): Promise<string>;
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    getActionsText(): Promise<string>;
}
/** Harness for interacting with a standard `MatDialog` in tests. */
export declare class MatDialogHarness extends _MatDialogHarnessBase {
    /** The selector for the host element of a `MatDialog` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DialogHarnessFilters): HarnessPredicate<MatDialogHarness>;
}
