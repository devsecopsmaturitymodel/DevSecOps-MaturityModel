/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentType } from '@angular/cdk/overlay';
import { OnDestroy } from '@angular/core';
import { _MatDialogBase, _MatDialogContainerBase, MatDialog, MatDialogConfig, MatDialogContainer, MatDialogRef } from '@angular/material/dialog';
/** Base class for a component that immediately opens a dialog when created. */
export declare class _MatTestDialogOpenerBase<C extends _MatDialogContainerBase, T, R> implements OnDestroy {
    dialog: _MatDialogBase<C>;
    /** Component that should be opened with the MatDialog `open` method. */
    protected static component: ComponentType<unknown> | undefined;
    /** Config that should be provided to the MatDialog `open` method. */
    protected static config: MatDialogConfig | undefined;
    /** MatDialogRef returned from the MatDialog `open` method. */
    dialogRef: MatDialogRef<T, R>;
    /** Data passed to the `MatDialog` close method. */
    closedResult: R | undefined;
    private readonly _afterClosedSubscription;
    constructor(dialog: _MatDialogBase<C>);
    ngOnDestroy(): void;
}
/** Test component that immediately opens a dialog when created. */
export declare class MatTestDialogOpener<T = unknown, R = unknown> extends _MatTestDialogOpenerBase<MatDialogContainer, T, R> {
    constructor(dialog: MatDialog);
    /** Static method that prepares this class to open the provided component. */
    static withComponent<T = unknown, R = unknown>(component: ComponentType<T>, config?: MatDialogConfig): ComponentType<MatTestDialogOpener<T, R>>;
}
export declare class MatTestDialogOpenerModule {
}
