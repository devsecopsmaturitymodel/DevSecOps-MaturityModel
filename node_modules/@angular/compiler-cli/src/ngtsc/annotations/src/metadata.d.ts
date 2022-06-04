/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/metadata" />
import { R3ClassMetadata } from '@angular/compiler';
import { DeclarationNode, Decorator, ReflectionHost } from '../../reflection';
/**
 * Given a class declaration, generate a call to `setClassMetadata` with the Angular metadata
 * present on the class or its member fields. An ngDevMode guard is used to allow the call to be
 * tree-shaken away, as the `setClassMetadata` invocation is only needed for testing purposes.
 *
 * If no such metadata is present, this function returns `null`. Otherwise, the call is returned
 * as a `Statement` for inclusion along with the class.
 */
export declare function extractClassMetadata(clazz: DeclarationNode, reflection: ReflectionHost, isCore: boolean, annotateForClosureCompiler?: boolean, angularDecoratorTransform?: (dec: Decorator) => Decorator): R3ClassMetadata | null;
