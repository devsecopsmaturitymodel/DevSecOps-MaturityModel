/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
export declare const NG_COMPONENT_RESOURCE_QUERY = "ngResource";
export declare function replaceResources(shouldTransform: (fileName: string) => boolean, getTypeChecker: () => ts.TypeChecker, inlineStyleFileExtension?: string): ts.TransformerFactory<ts.SourceFile>;
export declare function getResourceUrl(node: ts.Node): string | null;
