/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseTreeControl } from './base-tree-control';
/** Optional set of configuration that can be provided to the FlatTreeControl. */
export interface FlatTreeControlOptions<T, K> {
    trackBy?: (dataNode: T) => K;
}
/** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
export declare class FlatTreeControl<T, K = T> extends BaseTreeControl<T, K> {
    getLevel: (dataNode: T) => number;
    isExpandable: (dataNode: T) => boolean;
    options?: FlatTreeControlOptions<T, K> | undefined;
    /** Construct with flat tree data node functions getLevel and isExpandable. */
    constructor(getLevel: (dataNode: T) => number, isExpandable: (dataNode: T) => boolean, options?: FlatTreeControlOptions<T, K> | undefined);
    /**
     * Gets a list of the data node's subtree of descendent data nodes.
     *
     * To make this working, the `dataNodes` of the TreeControl must be flattened tree nodes
     * with correct levels.
     */
    getDescendants(dataNode: T): T[];
    /**
     * Expands all data nodes in the tree.
     *
     * To make this working, the `dataNodes` variable of the TreeControl must be set to all flattened
     * data nodes of the tree.
     */
    expandAll(): void;
}
