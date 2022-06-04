/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Outlet for nested CdkNode. Put `[matTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
export declare class MatTreeNodeOutlet implements CdkTreeNodeOutlet {
    viewContainer: ViewContainerRef;
    _node?: any;
    constructor(viewContainer: ViewContainerRef, _node?: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTreeNodeOutlet, [null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTreeNodeOutlet, "[matTreeNodeOutlet]", never, {}, {}, never>;
}
