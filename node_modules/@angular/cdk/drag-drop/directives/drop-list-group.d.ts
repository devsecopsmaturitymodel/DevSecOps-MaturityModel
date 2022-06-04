/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, InjectionToken } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `CdkDropListGroup`. It serves as
 * alternative token to the actual `CdkDropListGroup` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const CDK_DROP_LIST_GROUP: InjectionToken<CdkDropListGroup<unknown>>;
/**
 * Declaratively connects sibling `cdkDropList` instances together. All of the `cdkDropList`
 * elements that are placed inside a `cdkDropListGroup` will be connected to each other
 * automatically. Can be used as an alternative to the `cdkDropListConnectedTo` input
 * from `cdkDropList`.
 */
export declare class CdkDropListGroup<T> implements OnDestroy {
    /** Drop lists registered inside the group. */
    readonly _items: Set<T>;
    /** Whether starting a dragging sequence from inside this group is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDropListGroup<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkDropListGroup<any>, "[cdkDropListGroup]", ["cdkDropListGroup"], { "disabled": "cdkDropListGroupDisabled"; }, {}, never>;
}
