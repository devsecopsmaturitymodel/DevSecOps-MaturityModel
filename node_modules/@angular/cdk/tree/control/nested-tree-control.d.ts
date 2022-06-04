/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
import { BaseTreeControl } from './base-tree-control';
/** Optional set of configuration that can be provided to the NestedTreeControl. */
export interface NestedTreeControlOptions<T, K> {
    trackBy?: (dataNode: T) => K;
}
/** Nested tree control. Able to expand/collapse a subtree recursively for NestedNode type. */
export declare class NestedTreeControl<T, K = T> extends BaseTreeControl<T, K> {
    getChildren: (dataNode: T) => Observable<T[]> | T[] | undefined | null;
    options?: NestedTreeControlOptions<T, K> | undefined;
    /** Construct with nested tree function getChildren. */
    constructor(getChildren: (dataNode: T) => Observable<T[]> | T[] | undefined | null, options?: NestedTreeControlOptions<T, K> | undefined);
    /**
     * Expands all dataNodes in the tree.
     *
     * To make this working, the `dataNodes` variable of the TreeControl must be set to all root level
     * data nodes of the tree.
     */
    expandAll(): void;
    /** Gets a list of descendant dataNodes of a subtree rooted at given data node recursively. */
    getDescendants(dataNode: T): T[];
    /** A helper function to get descendants recursively. */
    protected _getDescendants(descendants: T[], dataNode: T): void;
}
