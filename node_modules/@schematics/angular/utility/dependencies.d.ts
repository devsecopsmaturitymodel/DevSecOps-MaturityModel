/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tree } from '@angular-devkit/schematics';
export declare enum NodeDependencyType {
    Default = "dependencies",
    Dev = "devDependencies",
    Peer = "peerDependencies",
    Optional = "optionalDependencies"
}
export interface NodeDependency {
    type: NodeDependencyType;
    name: string;
    version: string;
    overwrite?: boolean;
}
export declare function addPackageJsonDependency(tree: Tree, dependency: NodeDependency, pkgJsonPath?: string): void;
export declare function removePackageJsonDependency(tree: Tree, name: string, pkgJsonPath?: string): void;
export declare function getPackageJsonDependency(tree: Tree, name: string, pkgJsonPath?: string): NodeDependency | null;
