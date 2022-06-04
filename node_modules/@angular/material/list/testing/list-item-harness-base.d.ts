/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ComponentHarnessConstructor, HarnessLoader, HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
import { BaseListItemHarnessFilters, SubheaderHarnessFilters } from './list-harness-filters';
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
export declare function getListItemPredicate<H extends MatListItemHarnessBase>(harnessType: ComponentHarnessConstructor<H>, options: BaseListItemHarnessFilters): HarnessPredicate<H>;
/** Harness for interacting with a list subheader. */
export declare class MatSubheaderHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: SubheaderHarnessFilters): HarnessPredicate<MatSubheaderHarness>;
    /** Gets the full text content of the list item (including text from any font icons). */
    getText(): Promise<string>;
}
/** Selectors for the various list item sections that may contain user content. */
export declare const enum MatListItemSection {
    CONTENT = ".mat-list-item-content"
}
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
export declare abstract class MatListItemHarnessBase extends ContentContainerComponentHarness<MatListItemSection> {
    private _lines;
    private _avatar;
    private _icon;
    /** Gets the full text content of the list item. */
    getText(): Promise<string>;
    /** Gets the lines of text (`mat-line` elements) in this nav list item. */
    getLinesText(): Promise<string[]>;
    /** Whether this list item has an avatar. */
    hasAvatar(): Promise<boolean>;
    /** Whether this list item has an icon. */
    hasIcon(): Promise<boolean>;
    /** Whether this list option is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Gets a `HarnessLoader` used to get harnesses within the list item's content.
     * @deprecated Use `getChildLoader(MatListItemSection.CONTENT)` or `getHarness` instead.
     * @breaking-change 12.0.0
     */
    getHarnessLoaderForContent(): Promise<HarnessLoader>;
}
