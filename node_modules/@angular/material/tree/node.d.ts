/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkNestedTreeNode, CdkTree, CdkTreeNode, CdkTreeNodeDef } from '@angular/cdk/tree';
import { AfterContentInit, ElementRef, IterableDiffers, OnDestroy, OnInit } from '@angular/core';
import { CanDisable, HasTabIndex } from '@angular/material/core';
import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
declare const _MatTreeNodeBase: import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & typeof CdkTreeNode;
/**
 * Wrapper for the CdkTree node with Material design styles.
 */
export declare class MatTreeNode<T, K = T> extends _MatTreeNodeBase<T, K> implements CanDisable, HasTabIndex, OnInit, OnDestroy {
    constructor(elementRef: ElementRef<HTMLElement>, tree: CdkTree<T, K>, tabIndex: string);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTreeNode<any, any>, [null, null, { attribute: "tabindex"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTreeNode<any, any>, "mat-tree-node", ["matTreeNode"], { "role": "role"; "disabled": "disabled"; "tabIndex": "tabIndex"; }, {}, never>;
}
/**
 * Wrapper for the CdkTree node definition with Material design styles.
 * Captures the node's template and a when predicate that describes when this node should be used.
 */
export declare class MatTreeNodeDef<T> extends CdkTreeNodeDef<T> {
    data: T;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTreeNodeDef<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTreeNodeDef<any>, "[matTreeNodeDef]", never, { "when": "matTreeNodeDefWhen"; "data": "matTreeNode"; }, {}, never>;
}
/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
export declare class MatNestedTreeNode<T, K = T> extends CdkNestedTreeNode<T, K> implements AfterContentInit, OnDestroy, OnInit {
    node: T;
    /** Whether the node is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Tabindex for the node. */
    get tabIndex(): number;
    set tabIndex(value: number);
    private _tabIndex;
    constructor(elementRef: ElementRef<HTMLElement>, tree: CdkTree<T, K>, differs: IterableDiffers, tabIndex: string);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNestedTreeNode<any, any>, [null, null, null, { attribute: "tabindex"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatNestedTreeNode<any, any>, "mat-nested-tree-node", ["matNestedTreeNode"], { "role": "role"; "disabled": "disabled"; "tabIndex": "tabIndex"; "node": "matNestedTreeNode"; }, {}, never>;
}
export {};
