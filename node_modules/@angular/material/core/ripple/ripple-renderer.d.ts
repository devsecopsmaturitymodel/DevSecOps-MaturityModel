/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, NgZone } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { RippleRef, RippleConfig } from './ripple-ref';
/**
 * Interface that describes the target for launching ripples.
 * It defines the ripple configuration and disabled state for interaction ripples.
 * @docs-private
 */
export interface RippleTarget {
    /** Configuration for ripples that are launched on pointer down. */
    rippleConfig: RippleConfig;
    /** Whether ripples on pointer down should be disabled. */
    rippleDisabled: boolean;
}
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
export declare const defaultRippleAnimationConfig: {
    enterDuration: number;
    exitDuration: number;
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
export declare class RippleRenderer implements EventListenerObject {
    private _target;
    private _ngZone;
    /** Element where the ripples are being added to. */
    private _containerElement;
    /** Element which triggers the ripple elements on mouse events. */
    private _triggerElement;
    /** Whether the pointer is currently down or not. */
    private _isPointerDown;
    /** Set of currently active ripple references. */
    private _activeRipples;
    /** Latest non-persistent ripple that was triggered. */
    private _mostRecentTransientRipple;
    /** Time in milliseconds when the last touchstart event happened. */
    private _lastTouchStartEvent;
    /** Whether pointer-up event listeners have been registered. */
    private _pointerUpEventsRegistered;
    /**
     * Cached dimensions of the ripple container. Set when the first
     * ripple is shown and cleared once no more ripples are visible.
     */
    private _containerRect;
    constructor(_target: RippleTarget, _ngZone: NgZone, elementOrElementRef: HTMLElement | ElementRef<HTMLElement>, platform: Platform);
    /**
     * Fades in a ripple at the given coordinates.
     * @param x Coordinate within the element, along the X axis at which to start the ripple.
     * @param y Coordinate within the element, along the Y axis at which to start the ripple.
     * @param config Extra ripple options.
     */
    fadeInRipple(x: number, y: number, config?: RippleConfig): RippleRef;
    /** Fades out a ripple reference. */
    fadeOutRipple(rippleRef: RippleRef): void;
    /** Fades out all currently active ripples. */
    fadeOutAll(): void;
    /** Fades out all currently active non-persistent ripples. */
    fadeOutAllNonPersistent(): void;
    /** Sets up the trigger event listeners */
    setupTriggerEvents(elementOrElementRef: HTMLElement | ElementRef<HTMLElement>): void;
    /**
     * Handles all registered events.
     * @docs-private
     */
    handleEvent(event: Event): void;
    /** Function being called whenever the trigger is being pressed using mouse. */
    private _onMousedown;
    /** Function being called whenever the trigger is being pressed using touch. */
    private _onTouchStart;
    /** Function being called whenever the trigger is being released. */
    private _onPointerUp;
    /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
    private _runTimeoutOutsideZone;
    /** Registers event listeners for a given list of events. */
    private _registerEvents;
    /** Removes previously registered event listeners from the trigger element. */
    _removeTriggerEvents(): void;
}
