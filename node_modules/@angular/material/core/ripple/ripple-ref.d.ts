/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Possible states for a ripple element. */
export declare const enum RippleState {
    FADING_IN = 0,
    VISIBLE = 1,
    FADING_OUT = 2,
    HIDDEN = 3
}
export declare type RippleConfig = {
    color?: string;
    centered?: boolean;
    radius?: number;
    persistent?: boolean;
    animation?: RippleAnimationConfig;
    terminateOnPointerUp?: boolean;
};
/**
 * Interface that describes the configuration for the animation of a ripple.
 * There are two animation phases with different durations for the ripples.
 */
export interface RippleAnimationConfig {
    /** Duration in milliseconds for the enter animation (expansion from point of contact). */
    enterDuration?: number;
    /** Duration in milliseconds for the exit animation (fade-out). */
    exitDuration?: number;
}
/**
 * Reference to a previously launched ripple element.
 */
export declare class RippleRef {
    private _renderer;
    /** Reference to the ripple HTML element. */
    element: HTMLElement;
    /** Ripple configuration used for the ripple. */
    config: RippleConfig;
    /** Current state of the ripple. */
    state: RippleState;
    constructor(_renderer: {
        fadeOutRipple(ref: RippleRef): void;
    }, 
    /** Reference to the ripple HTML element. */
    element: HTMLElement, 
    /** Ripple configuration used for the ripple. */
    config: RippleConfig);
    /** Fades out the ripple element. */
    fadeOut(): void;
}
