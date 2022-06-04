/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Checks whether the user's browser support Shadow DOM. */
export declare function _supportsShadowDom(): boolean;
/** Gets the shadow root of an element, if supported and the element is inside the Shadow DOM. */
export declare function _getShadowRoot(element: HTMLElement): ShadowRoot | null;
/**
 * Gets the currently-focused element on the page while
 * also piercing through Shadow DOM boundaries.
 */
export declare function _getFocusedElementPierceShadowDom(): HTMLElement | null;
/** Gets the target of an event while accounting for Shadow DOM. */
export declare function _getEventTarget<T extends EventTarget>(event: Event): T | null;
