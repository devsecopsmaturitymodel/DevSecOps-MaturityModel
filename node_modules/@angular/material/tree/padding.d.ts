/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NumberInput } from '@angular/cdk/coercion';
import { CdkTreeNodePadding } from '@angular/cdk/tree';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
export declare class MatTreeNodePadding<T, K = T> extends CdkTreeNodePadding<T, K> {
    /** The level of depth of the tree node. The padding will be `level * indent` pixels. */
    get level(): number;
    set level(value: NumberInput);
    /** The indent for each level. Default number 40px from material design menu sub-menu spec. */
    get indent(): number | string;
    set indent(indent: number | string);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTreeNodePadding<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTreeNodePadding<any, any>, "[matTreeNodePadding]", never, { "level": "matTreeNodePadding"; "indent": "matTreeNodePaddingIndent"; }, {}, never>;
}
