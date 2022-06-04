/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/metadata/src/resource_registry" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ClassDeclaration } from '../../reflection';
/**
 * Represents an resource for a component and contains the `AbsoluteFsPath`
 * to the file which was resolved by evaluating the `ts.Expression` (generally, a relative or
 * absolute string path to the resource).
 *
 * If the resource is inline, the `path` will be `null`.
 */
export interface Resource {
    path: AbsoluteFsPath | null;
    expression: ts.Expression;
}
export interface ExternalResource extends Resource {
    path: AbsoluteFsPath;
}
export declare function isExternalResource(resource: Resource): resource is ExternalResource;
/**
 * Represents the either inline or external resources of a component.
 *
 * A resource with a `path` of `null` is considered inline.
 */
export interface ComponentResources {
    template: Resource;
    styles: ReadonlySet<Resource>;
}
/**
 * Tracks the mapping between external template/style files and the component(s) which use them.
 *
 * This information is produced during analysis of the program and is used mainly to support
 * external tooling, for which such a mapping is challenging to determine without compiler
 * assistance.
 */
export declare class ResourceRegistry {
    private externalTemplateToComponentsMap;
    private componentToTemplateMap;
    private componentToStylesMap;
    private externalStyleToComponentsMap;
    getComponentsWithTemplate(template: AbsoluteFsPath): ReadonlySet<ClassDeclaration>;
    registerResources(resources: ComponentResources, component: ClassDeclaration): void;
    registerTemplate(templateResource: Resource, component: ClassDeclaration): void;
    getTemplate(component: ClassDeclaration): Resource | null;
    registerStyle(styleResource: Resource, component: ClassDeclaration): void;
    getStyles(component: ClassDeclaration): Set<Resource>;
    getComponentsWithStyle(styleUrl: AbsoluteFsPath): ReadonlySet<ClassDeclaration>;
}
