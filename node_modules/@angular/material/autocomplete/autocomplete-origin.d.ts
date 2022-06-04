/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
/** Base class containing all of the functionality for `MatAutocompleteOrigin`. */
export declare abstract class _MatAutocompleteOriginBase {
    /** Reference to the element on which the directive is applied. */
    elementRef: ElementRef<HTMLElement>;
    constructor(
    /** Reference to the element on which the directive is applied. */
    elementRef: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatAutocompleteOriginBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatAutocompleteOriginBase, never, never, {}, {}, never>;
}
/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
export declare class MatAutocompleteOrigin extends _MatAutocompleteOriginBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAutocompleteOrigin, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatAutocompleteOrigin, "[matAutocompleteOrigin]", ["matAutocompleteOrigin"], {}, {}, never>;
}
