/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplatePortal } from '@angular/cdk/portal';
import { OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef, InjectionToken } from '@angular/core';
import { CanDisable } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatTabLabel } from './tab-label';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatTabBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export declare const MAT_TAB_GROUP: InjectionToken<any>;
export declare class MatTab extends _MatTabBase implements OnInit, CanDisable, OnChanges, OnDestroy {
    private _viewContainerRef;
    _closestTabGroup: any;
    /** Content for the tab label given by `<ng-template mat-tab-label>`. */
    get templateLabel(): MatTabLabel;
    set templateLabel(value: MatTabLabel);
    protected _templateLabel: MatTabLabel;
    /**
     * Template provided in the tab content that will be used if present, used to enable lazy-loading
     */
    _explicitContent: TemplateRef<any>;
    /** Template inside the MatTab view that contains an `<ng-content>`. */
    _implicitContent: TemplateRef<any>;
    /** Plain text label for the tab, used when there is no template label. */
    textLabel: string;
    /** Aria label for the tab. */
    ariaLabel: string;
    /**
     * Reference to the element that the tab is labelled by.
     * Will be cleared if `aria-label` is set at the same time.
     */
    ariaLabelledby: string;
    /**
     * Classes to be passed to the tab label inside the mat-tab-header container.
     * Supports string and string array values, same as `ngClass`.
     */
    labelClass: string | string[];
    /**
     * Classes to be passed to the tab mat-tab-body container.
     * Supports string and string array values, same as `ngClass`.
     */
    bodyClass: string | string[];
    /** Portal that will be the hosted content of the tab */
    private _contentPortal;
    /** @docs-private */
    get content(): TemplatePortal | null;
    /** Emits whenever the internal state of the tab changes. */
    readonly _stateChanges: Subject<void>;
    /**
     * The relatively indexed position where 0 represents the center, negative is left, and positive
     * represents the right.
     */
    position: number | null;
    /**
     * The initial relatively index origin of the tab if it was created and selected after there
     * was already a selected tab. Provides context of what position the tab should originate from.
     */
    origin: number | null;
    /**
     * Whether the tab is currently active.
     */
    isActive: boolean;
    constructor(_viewContainerRef: ViewContainerRef, _closestTabGroup: any);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    /**
     * This has been extracted to a util because of TS 4 and VE.
     * View Engine doesn't support property rename inheritance.
     * TS 4.0 doesn't allow properties to override accessors or vice-versa.
     * @docs-private
     */
    protected _setTemplateLabelInput(value: MatTabLabel | undefined): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTab, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTab, "mat-tab", ["matTab"], { "disabled": "disabled"; "textLabel": "label"; "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; "labelClass": "labelClass"; "bodyClass": "bodyClass"; }, {}, ["templateLabel", "_explicitContent"], ["*"]>;
}
export {};
