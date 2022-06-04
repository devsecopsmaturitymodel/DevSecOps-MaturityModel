/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HostTree } from './host-tree';
import { FilePredicate, MergeStrategy, Tree } from './interface';
export declare function empty(): HostTree;
export declare function branch(tree: Tree): Tree;
export declare function merge(tree: Tree, other: Tree, strategy?: MergeStrategy): Tree;
export declare function partition(tree: Tree, predicate: FilePredicate<boolean>): [Tree, Tree];
