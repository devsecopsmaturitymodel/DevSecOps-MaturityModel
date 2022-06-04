/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Extended CSSStyleDeclaration that includes a couple of drag-related
 * properties that aren't in the built-in TS typings.
 */
export interface DragCSSStyleDeclaration extends CSSStyleDeclaration {
    msScrollSnapType: string;
    scrollSnapType: string;
    webkitTapHighlightColor: string;
}
/**
 * Shallow-extends a stylesheet object with another stylesheet-like object.
 * Note that the keys in `source` have to be dash-cased.
 * @docs-private
 */
export declare function extendStyles(dest: CSSStyleDeclaration, source: Record<string, string>, importantProperties?: Set<string>): CSSStyleDeclaration;
/**
 * Toggles whether the native drag interactions should be enabled for an element.
 * @param element Element on which to toggle the drag interactions.
 * @param enable Whether the drag interactions should be enabled.
 * @docs-private
 */
export declare function toggleNativeDragInteractions(element: HTMLElement, enable: boolean): void;
/**
 * Toggles whether an element is visible while preserving its dimensions.
 * @param element Element whose visibility to toggle
 * @param enable Whether the element should be visible.
 * @param importantProperties Properties to be set as `!important`.
 * @docs-private
 */
export declare function toggleVisibility(element: HTMLElement, enable: boolean, importantProperties?: Set<string>): void;
/**
 * Combines a transform string with an optional other transform
 * that exited before the base transform was applied.
 */
export declare function combineTransforms(transform: string, initialTransform?: string): string;
