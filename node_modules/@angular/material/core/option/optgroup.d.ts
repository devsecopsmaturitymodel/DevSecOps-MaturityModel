/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { CanDisable } from '../common-behaviors/disabled';
import { MatOptionParentComponent } from './option-parent';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatOptgroupMixinBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
export declare class _MatOptgroupBase extends _MatOptgroupMixinBase implements CanDisable {
    /** Label for the option group. */
    label: string;
    /** Unique id for the underlying label. */
    _labelId: string;
    /** Whether the group is in inert a11y mode. */
    _inert: boolean;
    constructor(parent?: MatOptionParentComponent);
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatOptgroupBase, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatOptgroupBase, never, never, { "label": "label"; }, {}, never>;
}
/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export declare const MAT_OPTGROUP: InjectionToken<MatOptgroup>;
/**
 * Component that is used to group instances of `mat-option`.
 */
export declare class MatOptgroup extends _MatOptgroupBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatOptgroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatOptgroup, "mat-optgroup", ["matOptgroup"], { "disabled": "disabled"; }, {}, never, ["*", "mat-option, ng-container"]>;
}
export {};
