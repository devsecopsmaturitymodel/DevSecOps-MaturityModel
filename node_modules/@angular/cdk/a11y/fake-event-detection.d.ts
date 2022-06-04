/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Gets whether an event could be a faked `mousedown` event dispatched by a screen reader. */
export declare function isFakeMousedownFromScreenReader(event: MouseEvent): boolean;
/** Gets whether an event could be a faked `touchstart` event dispatched by a screen reader. */
export declare function isFakeTouchstartFromScreenReader(event: TouchEvent): boolean;
