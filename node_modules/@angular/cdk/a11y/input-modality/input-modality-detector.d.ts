import { InjectionToken, OnDestroy, NgZone } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * The input modalities detected by this service. Null is used if the input modality is unknown.
 */
export declare type InputModality = 'keyboard' | 'mouse' | 'touch' | null;
/** Options to configure the behavior of the InputModalityDetector. */
export interface InputModalityDetectorOptions {
    /** Keys to ignore when detecting keyboard input modality. */
    ignoreKeys?: number[];
}
/**
 * Injectable options for the InputModalityDetector. These are shallowly merged with the default
 * options.
 */
export declare const INPUT_MODALITY_DETECTOR_OPTIONS: InjectionToken<InputModalityDetectorOptions>;
/**
 * Default options for the InputModalityDetector.
 *
 * Modifier keys are ignored by default (i.e. when pressed won't cause the service to detect
 * keyboard input modality) for two reasons:
 *
 * 1. Modifier keys are commonly used with mouse to perform actions such as 'right click' or 'open
 *    in new tab', and are thus less representative of actual keyboard interaction.
 * 2. VoiceOver triggers some keyboard events when linearly navigating with Control + Option (but
 *    confusingly not with Caps Lock). Thus, to have parity with other screen readers, we ignore
 *    these keys so as to not update the input modality.
 *
 * Note that we do not by default ignore the right Meta key on Safari because it has the same key
 * code as the ContextMenu key on other browsers. When we switch to using event.key, we can
 * distinguish between the two.
 */
export declare const INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS: InputModalityDetectorOptions;
/**
 * The amount of time needed to pass after a touchstart event in order for a subsequent mousedown
 * event to be attributed as mouse and not touch.
 *
 * This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
 * that a value of around 650ms seems appropriate.
 */
export declare const TOUCH_BUFFER_MS = 650;
/**
 * Service that detects the user's input modality.
 *
 * This service does not update the input modality when a user navigates with a screen reader
 * (e.g. linear navigation with VoiceOver, object navigation / browse mode with NVDA, virtual PC
 * cursor mode with JAWS). This is in part due to technical limitations (i.e. keyboard events do not
 * fire as expected in these modes) but is also arguably the correct behavior. Navigating with a
 * screen reader is akin to visually scanning a page, and should not be interpreted as actual user
 * input interaction.
 *
 * When a user is not navigating but *interacting* with a screen reader, this service attempts to
 * update the input modality to keyboard, but in general this service's behavior is largely
 * undefined.
 */
export declare class InputModalityDetector implements OnDestroy {
    private readonly _platform;
    /** Emits whenever an input modality is detected. */
    readonly modalityDetected: Observable<InputModality>;
    /** Emits when the input modality changes. */
    readonly modalityChanged: Observable<InputModality>;
    /** The most recently detected input modality. */
    get mostRecentModality(): InputModality;
    /**
     * The most recently detected input modality event target. Is null if no input modality has been
     * detected or if the associated event target is null for some unknown reason.
     */
    _mostRecentTarget: HTMLElement | null;
    /** The underlying BehaviorSubject that emits whenever an input modality is detected. */
    private readonly _modality;
    /** Options for this InputModalityDetector. */
    private readonly _options;
    /**
     * The timestamp of the last touch input modality. Used to determine whether mousedown events
     * should be attributed to mouse or touch.
     */
    private _lastTouchMs;
    /**
     * Handles keydown events. Must be an arrow function in order to preserve the context when it gets
     * bound.
     */
    private _onKeydown;
    /**
     * Handles mousedown events. Must be an arrow function in order to preserve the context when it
     * gets bound.
     */
    private _onMousedown;
    /**
     * Handles touchstart events. Must be an arrow function in order to preserve the context when it
     * gets bound.
     */
    private _onTouchstart;
    constructor(_platform: Platform, ngZone: NgZone, document: Document, options?: InputModalityDetectorOptions);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputModalityDetector, [null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InputModalityDetector>;
}
