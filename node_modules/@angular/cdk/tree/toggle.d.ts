/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { CdkTree, CdkTreeNode } from './tree';
import * as i0 from "@angular/core";
/**
 * Node toggle to expand/collapse the node.
 */
export declare class CdkTreeNodeToggle<T, K = T> {
    protected _tree: CdkTree<T, K>;
    protected _treeNode: CdkTreeNode<T, K>;
    /** Whether expand/collapse the node recursively. */
    get recursive(): boolean;
    set recursive(value: BooleanInput);
    protected _recursive: boolean;
    constructor(_tree: CdkTree<T, K>, _treeNode: CdkTreeNode<T, K>);
    _toggle(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkTreeNodeToggle<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkTreeNodeToggle<any, any>, "[cdkTreeNodeToggle]", never, { "recursive": "cdkTreeNodeToggleRecursive"; }, {}, never>;
}
