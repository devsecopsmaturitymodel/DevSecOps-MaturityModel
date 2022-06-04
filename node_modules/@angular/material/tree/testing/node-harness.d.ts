/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TreeNodeHarnessFilters } from './tree-harness-filters';
/** Harness for interacting with a standard Angular Material tree node. */
export declare class MatTreeNodeHarness extends ContentContainerComponentHarness<string> {
    /** The selector of the host element of a `MatTreeNode` instance. */
    static hostSelector: string;
    _toggle: import("@angular/cdk/testing").AsyncFactoryFn<import("@angular/cdk/testing").TestElement | null>;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree node with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TreeNodeHarnessFilters): HarnessPredicate<MatTreeNodeHarness>;
    /** Whether the tree node is expanded. */
    isExpanded(): Promise<boolean>;
    /** Whether the tree node is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets the level of the tree node. Note that this gets the aria-level and is 1 indexed. */
    getLevel(): Promise<number>;
    /** Gets the tree node's text. */
    getText(): Promise<string>;
    /** Toggles node between expanded/collapsed. Only works when node is not disabled. */
    toggle(): Promise<void>;
    /** Expands the node if it is collapsed. Only works when node is not disabled. */
    expand(): Promise<void>;
    /** Collapses the node if it is expanded. Only works when node is not disabled. */
    collapse(): Promise<void>;
}
