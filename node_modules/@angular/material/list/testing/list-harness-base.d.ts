/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { DividerHarnessFilters, MatDividerHarness } from '@angular/material/divider/testing';
import { BaseListItemHarnessFilters, SubheaderHarnessFilters } from './list-harness-filters';
import { MatSubheaderHarness } from './list-item-harness-base';
/** Represents a section of a list falling under a specific header. */
export interface ListSection<I> {
    /** The heading for this list section. `undefined` if there is no heading. */
    heading?: string;
    /** The items in this list section. */
    items: I[];
}
/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
export declare abstract class MatListHarnessBase<T extends ComponentHarnessConstructor<C> & {
    with: (options?: F) => HarnessPredicate<C>;
}, C extends ComponentHarness, F extends BaseListItemHarnessFilters> extends ComponentHarness {
    protected _itemHarness: T;
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    getItems(filters?: F): Promise<C[]>;
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    getItemsGroupedBySubheader(filters?: F): Promise<ListSection<C>[]>;
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    getItemsGroupedByDividers(filters?: F): Promise<C[][]>;
    /**
     * Gets a list of harnesses representing all of the items, subheaders, and dividers
     * (in the order they appear in the list). Use `instanceof` to check which type of harness a given
     * item is.
     * @param filters Optional filters used to narrow which list items, subheaders, and dividers are
     *     included. A value of `false` for the `item`, `subheader`, or `divider` properties indicates
     *     that the respective harness type should be omitted completely.
     * @return The list of harnesses representing the items, subheaders, and dividers matching the
     *     given filters.
     */
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader: false;
        divider: false;
    }): Promise<[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader: false;
        divider: false;
    }): Promise<C[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader?: SubheaderHarnessFilters | false;
        divider: false;
    }): Promise<MatSubheaderHarness[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader: false;
        divider?: DividerHarnessFilters | false;
    }): Promise<MatDividerHarness[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader?: SubheaderHarnessFilters | false;
        divider: false;
    }): Promise<(C | MatSubheaderHarness)[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item?: F | false;
        subheader: false;
        divider?: false | DividerHarnessFilters;
    }): Promise<(C | MatDividerHarness)[]>;
    getItemsWithSubheadersAndDividers(filters: {
        item: false;
        subheader?: false | SubheaderHarnessFilters;
        divider?: false | DividerHarnessFilters;
    }): Promise<(MatSubheaderHarness | MatDividerHarness)[]>;
    getItemsWithSubheadersAndDividers(filters?: {
        item?: F | false;
        subheader?: SubheaderHarnessFilters | false;
        divider?: DividerHarnessFilters | false;
    }): Promise<(C | MatSubheaderHarness | MatDividerHarness)[]>;
}
