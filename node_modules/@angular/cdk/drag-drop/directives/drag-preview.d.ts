/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { InjectionToken, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `CdkDragPreview`. It serves as
 * alternative token to the actual `CdkDragPreview` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const CDK_DRAG_PREVIEW: InjectionToken<CdkDragPreview<any>>;
/**
 * Element that will be used as a template for the preview
 * of a CdkDrag when it is being dragged.
 */
export declare class CdkDragPreview<T = any> {
    templateRef: TemplateRef<T>;
    /** Context data to be added to the preview template instance. */
    data: T;
    /** Whether the preview should preserve the same size as the item that is being dragged. */
    get matchSize(): boolean;
    set matchSize(value: BooleanInput);
    private _matchSize;
    constructor(templateRef: TemplateRef<T>);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDragPreview<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkDragPreview<any>, "ng-template[cdkDragPreview]", never, { "data": "data"; "matchSize": "matchSize"; }, {}, never>;
}
