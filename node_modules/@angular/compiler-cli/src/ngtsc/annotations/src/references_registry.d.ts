/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/references_registry" />
import { Reference } from '../../imports';
import { DeclarationNode } from '../../reflection';
/**
 * Implement this interface if you want DecoratorHandlers to register
 * references that they find in their analysis of the code.
 */
export interface ReferencesRegistry {
    /**
     * Register one or more references in the registry.
     * @param references A collection of references to register.
     */
    add(source: DeclarationNode, ...references: Reference<DeclarationNode>[]): void;
}
/**
 * This registry does nothing, since ngtsc does not currently need
 * this functionality.
 * The ngcc tool implements a working version for its purposes.
 */
export declare class NoopReferencesRegistry implements ReferencesRegistry {
    add(source: DeclarationNode, ...references: Reference<DeclarationNode>[]): void;
}
