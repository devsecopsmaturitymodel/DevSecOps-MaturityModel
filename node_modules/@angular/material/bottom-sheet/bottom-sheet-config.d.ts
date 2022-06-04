/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Direction } from '@angular/cdk/bidi';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { InjectionToken, ViewContainerRef } from '@angular/core';
/** Options for where to set focus to automatically on dialog open */
export declare type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';
/** Injection token that can be used to access the data that was passed in to a bottom sheet. */
export declare const MAT_BOTTOM_SHEET_DATA: InjectionToken<any>;
/**
 * Configuration used when opening a bottom sheet.
 */
export declare class MatBottomSheetConfig<D = any> {
    /** The view container to place the overlay for the bottom sheet into. */
    viewContainerRef?: ViewContainerRef;
    /** Extra CSS classes to be added to the bottom sheet container. */
    panelClass?: string | string[];
    /** Text layout direction for the bottom sheet. */
    direction?: Direction;
    /** Data being injected into the child component. */
    data?: D | null;
    /** Whether the bottom sheet has a backdrop. */
    hasBackdrop?: boolean;
    /** Custom class for the backdrop. */
    backdropClass?: string;
    /** Whether the user can use escape or clicking outside to close the bottom sheet. */
    disableClose?: boolean;
    /** Aria label to assign to the bottom sheet element. */
    ariaLabel?: string | null;
    /**
     * Whether the bottom sheet should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     */
    closeOnNavigation?: boolean;
    /**
     * Where the bottom sheet should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    autoFocus?: AutoFocusTarget | string | boolean;
    /**
     * Whether the bottom sheet should restore focus to the
     * previously-focused element, after it's closed.
     */
    restoreFocus?: boolean;
    /** Scroll strategy to be used for the bottom sheet. */
    scrollStrategy?: ScrollStrategy;
}
