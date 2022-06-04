/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Equivalent of `ClientRect` without some of the properties we don't care about. */
declare type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;
/**
 * Gets whether an element is scrolled outside of view by any of its parent scrolling containers.
 * @param element Dimensions of the element (from getBoundingClientRect)
 * @param scrollContainers Dimensions of element's scrolling containers (from getBoundingClientRect)
 * @returns Whether the element is scrolled out of view
 * @docs-private
 */
export declare function isElementScrolledOutsideView(element: Dimensions, scrollContainers: Dimensions[]): boolean;
/**
 * Gets whether an element is clipped by any of its scrolling containers.
 * @param element Dimensions of the element (from getBoundingClientRect)
 * @param scrollContainers Dimensions of element's scrolling containers (from getBoundingClientRect)
 * @returns Whether the element is clipped
 * @docs-private
 */
export declare function isElementClippedByScrolling(element: Dimensions, scrollContainers: Dimensions[]): boolean;
export {};
