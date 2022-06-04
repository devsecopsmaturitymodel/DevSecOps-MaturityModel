/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
import { CardHarnessFilters } from './card-harness-filters';
/** Selectors for different sections of the mat-card that can container user content. */
export declare const enum MatCardSection {
    HEADER = ".mat-card-header",
    CONTENT = ".mat-card-content",
    ACTIONS = ".mat-card-actions",
    FOOTER = ".mat-card-footer"
}
/** Harness for interacting with a standard mat-card in tests. */
export declare class MatCardHarness extends ContentContainerComponentHarness<MatCardSection> {
    /** The selector for the host element of a `MatCard` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCardHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CardHarnessFilters): HarnessPredicate<MatCardHarness>;
    private _title;
    private _subtitle;
    /** Gets all of the card's content as text. */
    getText(): Promise<string>;
    /** Gets the cards's title text. */
    getTitleText(): Promise<string>;
    /** Gets the cards's subtitle text. */
    getSubtitleText(): Promise<string>;
}
