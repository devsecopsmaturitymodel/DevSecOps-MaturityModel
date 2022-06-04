/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTree } from '@angular/cdk/tree';
import { MatTreeNodeOutlet } from './outlet';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export declare class MatTree<T, K = T> extends CdkTree<T, K> {
    _nodeOutlet: MatTreeNodeOutlet;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTree<any, any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTree<any, any>, "mat-tree", ["matTree"], {}, {}, never, never>;
}
