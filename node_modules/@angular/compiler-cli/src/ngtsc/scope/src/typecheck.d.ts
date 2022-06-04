/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/scope/src/typecheck" />
import { SchemaMetadata, SelectorMatcher } from '@angular/compiler';
import ts from 'typescript';
import { Reference } from '../../imports';
import { DirectiveMeta, MetadataReader } from '../../metadata';
import { ClassDeclaration } from '../../reflection';
import { ComponentScopeReader } from './component_scope';
/**
 * The scope that is used for type-check code generation of a component template.
 */
export interface TypeCheckScope {
    /**
     * A `SelectorMatcher` instance that contains the flattened directive metadata of all directives
     * that are in the compilation scope of the declaring NgModule.
     */
    matcher: SelectorMatcher<DirectiveMeta>;
    /**
     * All of the directives available in the compilation scope of the declaring NgModule.
     */
    directives: DirectiveMeta[];
    /**
     * The pipes that are available in the compilation scope.
     */
    pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>;
    /**
     * The schemas that are used in this scope.
     */
    schemas: SchemaMetadata[];
    /**
     * Whether the original compilation scope which produced this `TypeCheckScope` was itself poisoned
     * (contained semantic errors during its production).
     */
    isPoisoned: boolean;
}
/**
 * Computes scope information to be used in template type checking.
 */
export declare class TypeCheckScopeRegistry {
    private scopeReader;
    private metaReader;
    /**
     * Cache of flattened directive metadata. Because flattened metadata is scope-invariant it's
     * cached individually, such that all scopes refer to the same flattened metadata.
     */
    private flattenedDirectiveMetaCache;
    /**
     * Cache of the computed type check scope per NgModule declaration.
     */
    private scopeCache;
    constructor(scopeReader: ComponentScopeReader, metaReader: MetadataReader);
    /**
     * Computes the type-check scope information for the component declaration. If the NgModule
     * contains an error, then 'error' is returned. If the component is not declared in any NgModule,
     * an empty type-check scope is returned.
     */
    getTypeCheckScope(node: ClassDeclaration): TypeCheckScope;
    getTypeCheckDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta;
}
