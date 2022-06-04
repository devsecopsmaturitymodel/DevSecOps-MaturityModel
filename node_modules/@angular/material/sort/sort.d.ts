/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { EventEmitter, InjectionToken, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CanDisable, HasInitialized } from '@angular/material/core';
import { Subject } from 'rxjs';
import { SortDirection } from './sort-direction';
import * as i0 from "@angular/core";
/** Interface for a directive that holds sorting state consumed by `MatSortHeader`. */
export interface MatSortable {
    /** The id of the column being sorted. */
    id: string;
    /** Starting sort direction. */
    start: SortDirection;
    /** Whether to disable clearing the sorting state. */
    disableClear: boolean;
}
/** The current sort state. */
export interface Sort {
    /** The id of the column being sorted. */
    active: string;
    /** The sort direction. */
    direction: SortDirection;
}
/** Default options for `mat-sort`.  */
export interface MatSortDefaultOptions {
    /** Whether to disable clearing the sorting state. */
    disableClear?: boolean;
}
/** Injection token to be used to override the default options for `mat-sort`. */
export declare const MAT_SORT_DEFAULT_OPTIONS: InjectionToken<MatSortDefaultOptions>;
/** @docs-private */
declare const _MatSortBase: (new (...args: any[]) => HasInitialized) & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export declare class MatSort extends _MatSortBase implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit {
    private _defaultOptions?;
    /** Collection of all registered sortables that this directive manages. */
    sortables: Map<string, MatSortable>;
    /** Used to notify any child components listening to state changes. */
    readonly _stateChanges: Subject<void>;
    /** The id of the most recently sorted MatSortable. */
    active: string;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the MatSortable's sort start.
     */
    start: SortDirection;
    /** The sort direction of the currently active MatSortable. */
    get direction(): SortDirection;
    set direction(direction: SortDirection);
    private _direction;
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     */
    get disableClear(): boolean;
    set disableClear(v: BooleanInput);
    private _disableClear;
    /** Event emitted when the user changes either the active sort or sort direction. */
    readonly sortChange: EventEmitter<Sort>;
    constructor(_defaultOptions?: MatSortDefaultOptions | undefined);
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable: MatSortable): void;
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable: MatSortable): void;
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MatSortable): void;
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MatSortable): SortDirection;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSort, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSort, "[matSort]", ["matSort"], { "disabled": "matSortDisabled"; "active": "matSortActive"; "start": "matSortStart"; "direction": "matSortDirection"; "disableClear": "matSortDisableClear"; }, { "sortChange": "matSortChange"; }, never>;
}
export {};
