/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { InjectionToken, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `CdkAccordion`. It serves
 * as alternative token to the actual `CdkAccordion` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const CDK_ACCORDION: InjectionToken<CdkAccordion>;
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
export declare class CdkAccordion implements OnDestroy, OnChanges {
    /** Emits when the state of the accordion changes */
    readonly _stateChanges: Subject<SimpleChanges>;
    /** Stream that emits true/false when openAll/closeAll is triggered. */
    readonly _openCloseAllActions: Subject<boolean>;
    /** A readonly id value to use for unique selection coordination. */
    readonly id: string;
    /** Whether the accordion should allow multiple expanded accordion items simultaneously. */
    get multi(): boolean;
    set multi(multi: BooleanInput);
    private _multi;
    /** Opens all enabled accordion items in an accordion where multi is enabled. */
    openAll(): void;
    /** Closes all enabled accordion items in an accordion where multi is enabled. */
    closeAll(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkAccordion, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkAccordion, "cdk-accordion, [cdkAccordion]", ["cdkAccordion"], { "multi": "multi"; }, {}, never>;
}
