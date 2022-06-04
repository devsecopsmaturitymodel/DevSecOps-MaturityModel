/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusOrigin } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { DialogPosition } from './dialog-config';
import { _MatDialogContainerBase } from './dialog-container';
/** Possible states of the lifecycle of a dialog. */
export declare const enum MatDialogState {
    OPEN = 0,
    CLOSING = 1,
    CLOSED = 2
}
/**
 * Reference to a dialog opened via the MatDialog service.
 */
export declare class MatDialogRef<T, R = any> {
    private _overlayRef;
    _containerInstance: _MatDialogContainerBase;
    /** Id of the dialog. */
    readonly id: string;
    /** The instance of component opened into the dialog. */
    componentInstance: T;
    /** Whether the user is allowed to close the dialog. */
    disableClose: boolean | undefined;
    /** Subject for notifying the user that the dialog has finished opening. */
    private readonly _afterOpened;
    /** Subject for notifying the user that the dialog has finished closing. */
    private readonly _afterClosed;
    /** Subject for notifying the user that the dialog has started closing. */
    private readonly _beforeClosed;
    /** Result to be passed to afterClosed. */
    private _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout;
    /** Current state of the dialog. */
    private _state;
    constructor(_overlayRef: OverlayRef, _containerInstance: _MatDialogContainerBase, 
    /** Id of the dialog. */
    id?: string);
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    close(dialogResult?: R): void;
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    afterOpened(): Observable<void>;
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed(): Observable<R | undefined>;
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    beforeClosed(): Observable<R | undefined>;
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick(): Observable<MouseEvent>;
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents(): Observable<KeyboardEvent>;
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position?: DialogPosition): this;
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width?: string, height?: string): this;
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes: string | string[]): this;
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes: string | string[]): this;
    /** Gets the current state of the dialog's lifecycle. */
    getState(): MatDialogState;
    /**
     * Finishes the dialog close by updating the state of the dialog
     * and disposing the overlay.
     */
    private _finishDialogClose;
    /** Fetches the position strategy object from the overlay ref. */
    private _getPositionStrategy;
}
/**
 * Closes the dialog with the specified interaction type. This is currently not part of
 * `MatDialogRef` as that would conflict with custom dialog ref mocks provided in tests.
 * More details. See: https://github.com/angular/components/pull/9257#issuecomment-651342226.
 */
export declare function _closeDialogVia<R>(ref: MatDialogRef<R>, interactionType: FocusOrigin, result?: R): void;
