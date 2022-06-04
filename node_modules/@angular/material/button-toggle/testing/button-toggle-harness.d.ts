/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonToggleAppearance } from '@angular/material/button-toggle';
import { ButtonToggleHarnessFilters } from './button-toggle-harness-filters';
/** Harness for interacting with a standard mat-button-toggle in tests. */
export declare class MatButtonToggleHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector: string;
    private _label;
    private _button;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ButtonToggleHarnessFilters): HarnessPredicate<MatButtonToggleHarness>;
    /** Gets a boolean promise indicating if the button toggle is checked. */
    isChecked(): Promise<boolean>;
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a promise for the button toggle's name. */
    getName(): Promise<string | null>;
    /** Gets a promise for the button toggle's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets a promise for the button toggles's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets a promise for the button toggle's text. */
    getText(): Promise<string>;
    /** Gets the appearance that the button toggle is using. */
    getAppearance(): Promise<MatButtonToggleAppearance>;
    /** Focuses the toggle. */
    focus(): Promise<void>;
    /** Blurs the toggle. */
    blur(): Promise<void>;
    /** Whether the toggle is focused. */
    isFocused(): Promise<boolean>;
    /** Toggle the checked state of the buttons toggle. */
    toggle(): Promise<void>;
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    check(): Promise<void>;
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    uncheck(): Promise<void>;
}
