/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/** The injection token used to specify the StickyPositioningListener. */
export declare const STICKY_POSITIONING_LISTENER: InjectionToken<StickyPositioningListener>;
export declare type StickySize = number | null | undefined;
export declare type StickyOffset = number | null | undefined;
export interface StickyUpdate {
    elements?: readonly (HTMLElement[] | undefined)[];
    offsets?: StickyOffset[];
    sizes: StickySize[];
}
/**
 * If provided, CdkTable will call the methods below when it updates the size/
 * postion/etc of its sticky rows and columns.
 */
export interface StickyPositioningListener {
    /** Called when CdkTable updates its sticky start columns. */
    stickyColumnsUpdated(update: StickyUpdate): void;
    /** Called when CdkTable updates its sticky end columns. */
    stickyEndColumnsUpdated(update: StickyUpdate): void;
    /** Called when CdkTable updates its sticky header rows. */
    stickyHeaderRowsUpdated(update: StickyUpdate): void;
    /** Called when CdkTable updates its sticky footer rows. */
    stickyFooterRowsUpdated(update: StickyUpdate): void;
}
