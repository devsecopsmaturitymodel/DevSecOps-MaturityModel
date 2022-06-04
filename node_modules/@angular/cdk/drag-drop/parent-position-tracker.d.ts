/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Object holding the scroll position of something. */
interface ScrollPosition {
    top: number;
    left: number;
}
/** Keeps track of the scroll position and dimensions of the parents of an element. */
export declare class ParentPositionTracker {
    private _document;
    /** Cached positions of the scrollable parent elements. */
    readonly positions: Map<HTMLElement | Document, {
        scrollPosition: ScrollPosition;
        clientRect?: ClientRect | undefined;
    }>;
    constructor(_document: Document);
    /** Clears the cached positions. */
    clear(): void;
    /** Caches the positions. Should be called at the beginning of a drag sequence. */
    cache(elements: readonly HTMLElement[]): void;
    /** Handles scrolling while a drag is taking place. */
    handleScroll(event: Event): ScrollPosition | null;
    /**
     * Gets the scroll position of the viewport. Note that we use the scrollX and scrollY directly,
     * instead of going through the `ViewportRuler`, because the first value the ruler looks at is
     * the top/left offset of the `document.documentElement` which works for most cases, but breaks
     * if the element is offset by something like the `BlockScrollStrategy`.
     */
    getViewportScrollPosition(): {
        top: number;
        left: number;
    };
}
export {};
