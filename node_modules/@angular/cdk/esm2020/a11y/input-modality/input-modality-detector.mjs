/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ALT, CONTROL, MAC_META, META, SHIFT } from '@angular/cdk/keycodes';
import { Inject, Injectable, InjectionToken, Optional, NgZone } from '@angular/core';
import { normalizePassiveListenerOptions, Platform, _getEventTarget } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader, } from '../fake-event-detection';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * Injectable options for the InputModalityDetector. These are shallowly merged with the default
 * options.
 */
export const INPUT_MODALITY_DETECTOR_OPTIONS = new InjectionToken('cdk-input-modality-detector-options');
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
export const INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS = {
    ignoreKeys: [ALT, CONTROL, MAC_META, META, SHIFT],
};
/**
 * The amount of time needed to pass after a touchstart event in order for a subsequent mousedown
 * event to be attributed as mouse and not touch.
 *
 * This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
 * that a value of around 650ms seems appropriate.
 */
export const TOUCH_BUFFER_MS = 650;
/**
 * Event listener options that enable capturing and also mark the listener as passive if the browser
 * supports it.
 */
const modalityEventListenerOptions = normalizePassiveListenerOptions({
    passive: true,
    capture: true,
});
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
export class InputModalityDetector {
    constructor(_platform, ngZone, document, options) {
        this._platform = _platform;
        /**
         * The most recently detected input modality event target. Is null if no input modality has been
         * detected or if the associated event target is null for some unknown reason.
         */
        this._mostRecentTarget = null;
        /** The underlying BehaviorSubject that emits whenever an input modality is detected. */
        this._modality = new BehaviorSubject(null);
        /**
         * The timestamp of the last touch input modality. Used to determine whether mousedown events
         * should be attributed to mouse or touch.
         */
        this._lastTouchMs = 0;
        /**
         * Handles keydown events. Must be an arrow function in order to preserve the context when it gets
         * bound.
         */
        this._onKeydown = (event) => {
            // If this is one of the keys we should ignore, then ignore it and don't update the input
            // modality to keyboard.
            if (this._options?.ignoreKeys?.some(keyCode => keyCode === event.keyCode)) {
                return;
            }
            this._modality.next('keyboard');
            this._mostRecentTarget = _getEventTarget(event);
        };
        /**
         * Handles mousedown events. Must be an arrow function in order to preserve the context when it
         * gets bound.
         */
        this._onMousedown = (event) => {
            // Touches trigger both touch and mouse events, so we need to distinguish between mouse events
            // that were triggered via mouse vs touch. To do so, check if the mouse event occurs closely
            // after the previous touch event.
            if (Date.now() - this._lastTouchMs < TOUCH_BUFFER_MS) {
                return;
            }
            // Fake mousedown events are fired by some screen readers when controls are activated by the
            // screen reader. Attribute them to keyboard input modality.
            this._modality.next(isFakeMousedownFromScreenReader(event) ? 'keyboard' : 'mouse');
            this._mostRecentTarget = _getEventTarget(event);
        };
        /**
         * Handles touchstart events. Must be an arrow function in order to preserve the context when it
         * gets bound.
         */
        this._onTouchstart = (event) => {
            // Same scenario as mentioned in _onMousedown, but on touch screen devices, fake touchstart
            // events are fired. Again, attribute to keyboard input modality.
            if (isFakeTouchstartFromScreenReader(event)) {
                this._modality.next('keyboard');
                return;
            }
            // Store the timestamp of this touch event, as it's used to distinguish between mouse events
            // triggered via mouse vs touch.
            this._lastTouchMs = Date.now();
            this._modality.next('touch');
            this._mostRecentTarget = _getEventTarget(event);
        };
        this._options = {
            ...INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS,
            ...options,
        };
        // Skip the first emission as it's null.
        this.modalityDetected = this._modality.pipe(skip(1));
        this.modalityChanged = this.modalityDetected.pipe(distinctUntilChanged());
        // If we're not in a browser, this service should do nothing, as there's no relevant input
        // modality to detect.
        if (_platform.isBrowser) {
            ngZone.runOutsideAngular(() => {
                document.addEventListener('keydown', this._onKeydown, modalityEventListenerOptions);
                document.addEventListener('mousedown', this._onMousedown, modalityEventListenerOptions);
                document.addEventListener('touchstart', this._onTouchstart, modalityEventListenerOptions);
            });
        }
    }
    /** The most recently detected input modality. */
    get mostRecentModality() {
        return this._modality.value;
    }
    ngOnDestroy() {
        this._modality.complete();
        if (this._platform.isBrowser) {
            document.removeEventListener('keydown', this._onKeydown, modalityEventListenerOptions);
            document.removeEventListener('mousedown', this._onMousedown, modalityEventListenerOptions);
            document.removeEventListener('touchstart', this._onTouchstart, modalityEventListenerOptions);
        }
    }
}
InputModalityDetector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InputModalityDetector, deps: [{ token: i1.Platform }, { token: i0.NgZone }, { token: DOCUMENT }, { token: INPUT_MODALITY_DETECTOR_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
InputModalityDetector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InputModalityDetector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: InputModalityDetector, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }, { type: i0.NgZone }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [INPUT_MODALITY_DETECTOR_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kYWxpdHktZGV0ZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvaW5wdXQtbW9kYWxpdHkvaW5wdXQtbW9kYWxpdHktZGV0ZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQWEsUUFBUSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMsK0JBQStCLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2pHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZUFBZSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQ0wsK0JBQStCLEVBQy9CLGdDQUFnQyxHQUNqQyxNQUFNLHlCQUF5QixDQUFDOzs7QUFhakM7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQUcsSUFBSSxjQUFjLENBQy9ELHFDQUFxQyxDQUN0QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUNBQXVDLEdBQWlDO0lBQ25GLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7Q0FDbEQsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFFbkM7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Z2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBTFQsIENPTlRST0wsIE1BQ19NRVRBLCBNRVRBLCBTSElGVH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95LCBPcHRpb25hbCwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucywgUGxhdGZvcm0sIF9nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBza2lwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyLFxuICBpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcixcbn0gZnJvbSAnLi4vZmFrZS1ldmVudC1kZXRlY3Rpb24nO1xuXG4vKipcbiAqIFRoZSBpbnB1dCBtb2RhbGl0aWVzIGRldGVjdGVkIGJ5IHRoaXMgc2VydmljZS4gTnVsbCBpcyB1c2VkIGlmIHRoZSBpbnB1dCBtb2RhbGl0eSBpcyB1bmtub3duLlxuICovXG5leHBvcnQgdHlwZSBJbnB1dE1vZGFsaXR5ID0gJ2tleWJvYXJkJyB8ICdtb3VzZScgfCAndG91Y2gnIHwgbnVsbDtcblxuLyoqIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBiZWhhdmlvciBvZiB0aGUgSW5wdXRNb2RhbGl0eURldGVjdG9yLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnB1dE1vZGFsaXR5RGV0ZWN0b3JPcHRpb25zIHtcbiAgLyoqIEtleXMgdG8gaWdub3JlIHdoZW4gZGV0ZWN0aW5nIGtleWJvYXJkIGlucHV0IG1vZGFsaXR5LiAqL1xuICBpZ25vcmVLZXlzPzogbnVtYmVyW107XG59XG5cbi8qKlxuICogSW5qZWN0YWJsZSBvcHRpb25zIGZvciB0aGUgSW5wdXRNb2RhbGl0eURldGVjdG9yLiBUaGVzZSBhcmUgc2hhbGxvd2x5IG1lcmdlZCB3aXRoIHRoZSBkZWZhdWx0XG4gKiBvcHRpb25zLlxuICovXG5leHBvcnQgY29uc3QgSU5QVVRfTU9EQUxJVFlfREVURUNUT1JfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxJbnB1dE1vZGFsaXR5RGV0ZWN0b3JPcHRpb25zPihcbiAgJ2Nkay1pbnB1dC1tb2RhbGl0eS1kZXRlY3Rvci1vcHRpb25zJyxcbik7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgSW5wdXRNb2RhbGl0eURldGVjdG9yLlxuICpcbiAqIE1vZGlmaWVyIGtleXMgYXJlIGlnbm9yZWQgYnkgZGVmYXVsdCAoaS5lLiB3aGVuIHByZXNzZWQgd29uJ3QgY2F1c2UgdGhlIHNlcnZpY2UgdG8gZGV0ZWN0XG4gKiBrZXlib2FyZCBpbnB1dCBtb2RhbGl0eSkgZm9yIHR3byByZWFzb25zOlxuICpcbiAqIDEuIE1vZGlmaWVyIGtleXMgYXJlIGNvbW1vbmx5IHVzZWQgd2l0aCBtb3VzZSB0byBwZXJmb3JtIGFjdGlvbnMgc3VjaCBhcyAncmlnaHQgY2xpY2snIG9yICdvcGVuXG4gKiAgICBpbiBuZXcgdGFiJywgYW5kIGFyZSB0aHVzIGxlc3MgcmVwcmVzZW50YXRpdmUgb2YgYWN0dWFsIGtleWJvYXJkIGludGVyYWN0aW9uLlxuICogMi4gVm9pY2VPdmVyIHRyaWdnZXJzIHNvbWUga2V5Ym9hcmQgZXZlbnRzIHdoZW4gbGluZWFybHkgbmF2aWdhdGluZyB3aXRoIENvbnRyb2wgKyBPcHRpb24gKGJ1dFxuICogICAgY29uZnVzaW5nbHkgbm90IHdpdGggQ2FwcyBMb2NrKS4gVGh1cywgdG8gaGF2ZSBwYXJpdHkgd2l0aCBvdGhlciBzY3JlZW4gcmVhZGVycywgd2UgaWdub3JlXG4gKiAgICB0aGVzZSBrZXlzIHNvIGFzIHRvIG5vdCB1cGRhdGUgdGhlIGlucHV0IG1vZGFsaXR5LlxuICpcbiAqIE5vdGUgdGhhdCB3ZSBkbyBub3QgYnkgZGVmYXVsdCBpZ25vcmUgdGhlIHJpZ2h0IE1ldGEga2V5IG9uIFNhZmFyaSBiZWNhdXNlIGl0IGhhcyB0aGUgc2FtZSBrZXlcbiAqIGNvZGUgYXMgdGhlIENvbnRleHRNZW51IGtleSBvbiBvdGhlciBicm93c2Vycy4gV2hlbiB3ZSBzd2l0Y2ggdG8gdXNpbmcgZXZlbnQua2V5LCB3ZSBjYW5cbiAqIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHR3by5cbiAqL1xuZXhwb3J0IGNvbnN0IElOUFVUX01PREFMSVRZX0RFVEVDVE9SX0RFRkFVTFRfT1BUSU9OUzogSW5wdXRNb2RhbGl0eURldGVjdG9yT3B0aW9ucyA9IHtcbiAgaWdub3JlS2V5czogW0FMVCwgQ09OVFJPTCwgTUFDX01FVEEsIE1FVEEsIFNISUZUXSxcbn07XG5cbi8qKlxuICogVGhlIGFtb3VudCBvZiB0aW1lIG5lZWRlZCB0byBwYXNzIGFmdGVyIGEgdG91Y2hzdGFydCBldmVudCBpbiBvcmRlciBmb3IgYSBzdWJzZXF1ZW50IG1vdXNlZG93blxuICogZXZlbnQgdG8gYmUgYXR0cmlidXRlZCBhcyBtb3VzZSBhbmQgbm90IHRvdWNoLlxuICpcbiAqIFRoaXMgaXMgdGhlIHZhbHVlIHVzZWQgYnkgQW5ndWxhckpTIE1hdGVyaWFsLiBUaHJvdWdoIHRyaWFsIGFuZCBlcnJvciAob24gaVBob25lIDZTKSB0aGV5IGZvdW5kXG4gKiB0aGF0IGEgdmFsdWUgb2YgYXJvdW5kIDY1MG1zIHNlZW1zIGFwcHJvcHJpYXRlLlxuICovXG5leHBvcnQgY29uc3QgVE9VQ0hfQlVGRkVSX01TID0gNjUwO1xuXG4vKipcbiAqIEV2ZW50IGxpc3RlbmVyIG9wdGlvbnMgdGhhdCBlbmFibGUgY2FwdHVyaW5nIGFuZCBhbHNvIG1hcmsgdGhlIGxpc3RlbmVyIGFzIHBhc3NpdmUgaWYgdGhlIGJyb3dzZXJcbiAqIHN1cHBvcnRzIGl0LlxuICovXG5jb25zdCBtb2RhbGl0eUV2ZW50TGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7XG4gIHBhc3NpdmU6IHRydWUsXG4gIGNhcHR1cmU6IHRydWUsXG59KTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRoYXQgZGV0ZWN0cyB0aGUgdXNlcidzIGlucHV0IG1vZGFsaXR5LlxuICpcbiAqIFRoaXMgc2VydmljZSBkb2VzIG5vdCB1cGRhdGUgdGhlIGlucHV0IG1vZGFsaXR5IHdoZW4gYSB1c2VyIG5hdmlnYXRlcyB3aXRoIGEgc2NyZWVuIHJlYWRlclxuICogKGUuZy4gbGluZWFyIG5hdmlnYXRpb24gd2l0aCBWb2ljZU92ZXIsIG9iamVjdCBuYXZpZ2F0aW9uIC8gYnJvd3NlIG1vZGUgd2l0aCBOVkRBLCB2aXJ0dWFsIFBDXG4gKiBjdXJzb3IgbW9kZSB3aXRoIEpBV1MpLiBUaGlzIGlzIGluIHBhcnQgZHVlIHRvIHRlY2huaWNhbCBsaW1pdGF0aW9ucyAoaS5lLiBrZXlib2FyZCBldmVudHMgZG8gbm90XG4gKiBmaXJlIGFzIGV4cGVjdGVkIGluIHRoZXNlIG1vZGVzKSBidXQgaXMgYWxzbyBhcmd1YWJseSB0aGUgY29ycmVjdCBiZWhhdmlvci4gTmF2aWdhdGluZyB3aXRoIGFcbiAqIHNjcmVlbiByZWFkZXIgaXMgYWtpbiB0byB2aXN1YWxseSBzY2FubmluZyBhIHBhZ2UsIGFuZCBzaG91bGQgbm90IGJlIGludGVycHJldGVkIGFzIGFjdHVhbCB1c2VyXG4gKiBpbnB1dCBpbnRlcmFjdGlvbi5cbiAqXG4gKiBXaGVuIGEgdXNlciBpcyBub3QgbmF2aWdhdGluZyBidXQgKmludGVyYWN0aW5nKiB3aXRoIGEgc2NyZWVuIHJlYWRlciwgdGhpcyBzZXJ2aWNlIGF0dGVtcHRzIHRvXG4gKiB1cGRhdGUgdGhlIGlucHV0IG1vZGFsaXR5IHRvIGtleWJvYXJkLCBidXQgaW4gZ2VuZXJhbCB0aGlzIHNlcnZpY2UncyBiZWhhdmlvciBpcyBsYXJnZWx5XG4gKiB1bmRlZmluZWQuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIElucHV0TW9kYWxpdHlEZXRlY3RvciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBpbnB1dCBtb2RhbGl0eSBpcyBkZXRlY3RlZC4gKi9cbiAgcmVhZG9ubHkgbW9kYWxpdHlEZXRlY3RlZDogT2JzZXJ2YWJsZTxJbnB1dE1vZGFsaXR5PjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW5wdXQgbW9kYWxpdHkgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgbW9kYWxpdHlDaGFuZ2VkOiBPYnNlcnZhYmxlPElucHV0TW9kYWxpdHk+O1xuXG4gIC8qKiBUaGUgbW9zdCByZWNlbnRseSBkZXRlY3RlZCBpbnB1dCBtb2RhbGl0eS4gKi9cbiAgZ2V0IG1vc3RSZWNlbnRNb2RhbGl0eSgpOiBJbnB1dE1vZGFsaXR5IHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxpdHkudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vc3QgcmVjZW50bHkgZGV0ZWN0ZWQgaW5wdXQgbW9kYWxpdHkgZXZlbnQgdGFyZ2V0LiBJcyBudWxsIGlmIG5vIGlucHV0IG1vZGFsaXR5IGhhcyBiZWVuXG4gICAqIGRldGVjdGVkIG9yIGlmIHRoZSBhc3NvY2lhdGVkIGV2ZW50IHRhcmdldCBpcyBudWxsIGZvciBzb21lIHVua25vd24gcmVhc29uLlxuICAgKi9cbiAgX21vc3RSZWNlbnRUYXJnZXQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSB1bmRlcmx5aW5nIEJlaGF2aW9yU3ViamVjdCB0aGF0IGVtaXRzIHdoZW5ldmVyIGFuIGlucHV0IG1vZGFsaXR5IGlzIGRldGVjdGVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9tb2RhbGl0eSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8SW5wdXRNb2RhbGl0eT4obnVsbCk7XG5cbiAgLyoqIE9wdGlvbnMgZm9yIHRoaXMgSW5wdXRNb2RhbGl0eURldGVjdG9yLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zOiBJbnB1dE1vZGFsaXR5RGV0ZWN0b3JPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZXN0YW1wIG9mIHRoZSBsYXN0IHRvdWNoIGlucHV0IG1vZGFsaXR5LiBVc2VkIHRvIGRldGVybWluZSB3aGV0aGVyIG1vdXNlZG93biBldmVudHNcbiAgICogc2hvdWxkIGJlIGF0dHJpYnV0ZWQgdG8gbW91c2Ugb3IgdG91Y2guXG4gICAqL1xuICBwcml2YXRlIF9sYXN0VG91Y2hNcyA9IDA7XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMga2V5ZG93biBldmVudHMuIE11c3QgYmUgYW4gYXJyb3cgZnVuY3Rpb24gaW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIGNvbnRleHQgd2hlbiBpdCBnZXRzXG4gICAqIGJvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfb25LZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgLy8gSWYgdGhpcyBpcyBvbmUgb2YgdGhlIGtleXMgd2Ugc2hvdWxkIGlnbm9yZSwgdGhlbiBpZ25vcmUgaXQgYW5kIGRvbid0IHVwZGF0ZSB0aGUgaW5wdXRcbiAgICAvLyBtb2RhbGl0eSB0byBrZXlib2FyZC5cbiAgICBpZiAodGhpcy5fb3B0aW9ucz8uaWdub3JlS2V5cz8uc29tZShrZXlDb2RlID0+IGtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kYWxpdHkubmV4dCgna2V5Ym9hcmQnKTtcbiAgICB0aGlzLl9tb3N0UmVjZW50VGFyZ2V0ID0gX2dldEV2ZW50VGFyZ2V0KGV2ZW50KTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBtb3VzZWRvd24gZXZlbnRzLiBNdXN0IGJlIGFuIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0IHdoZW4gaXRcbiAgICogZ2V0cyBib3VuZC5cbiAgICovXG4gIHByaXZhdGUgX29uTW91c2Vkb3duID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgLy8gVG91Y2hlcyB0cmlnZ2VyIGJvdGggdG91Y2ggYW5kIG1vdXNlIGV2ZW50cywgc28gd2UgbmVlZCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIG1vdXNlIGV2ZW50c1xuICAgIC8vIHRoYXQgd2VyZSB0cmlnZ2VyZWQgdmlhIG1vdXNlIHZzIHRvdWNoLiBUbyBkbyBzbywgY2hlY2sgaWYgdGhlIG1vdXNlIGV2ZW50IG9jY3VycyBjbG9zZWx5XG4gICAgLy8gYWZ0ZXIgdGhlIHByZXZpb3VzIHRvdWNoIGV2ZW50LlxuICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5fbGFzdFRvdWNoTXMgPCBUT1VDSF9CVUZGRVJfTVMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGYWtlIG1vdXNlZG93biBldmVudHMgYXJlIGZpcmVkIGJ5IHNvbWUgc2NyZWVuIHJlYWRlcnMgd2hlbiBjb250cm9scyBhcmUgYWN0aXZhdGVkIGJ5IHRoZVxuICAgIC8vIHNjcmVlbiByZWFkZXIuIEF0dHJpYnV0ZSB0aGVtIHRvIGtleWJvYXJkIGlucHV0IG1vZGFsaXR5LlxuICAgIHRoaXMuX21vZGFsaXR5Lm5leHQoaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCkgPyAna2V5Ym9hcmQnIDogJ21vdXNlJyk7XG4gICAgdGhpcy5fbW9zdFJlY2VudFRhcmdldCA9IF9nZXRFdmVudFRhcmdldChldmVudCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdG91Y2hzdGFydCBldmVudHMuIE11c3QgYmUgYW4gYXJyb3cgZnVuY3Rpb24gaW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIGNvbnRleHQgd2hlbiBpdFxuICAgKiBnZXRzIGJvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfb25Ub3VjaHN0YXJ0ID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgLy8gU2FtZSBzY2VuYXJpbyBhcyBtZW50aW9uZWQgaW4gX29uTW91c2Vkb3duLCBidXQgb24gdG91Y2ggc2NyZWVuIGRldmljZXMsIGZha2UgdG91Y2hzdGFydFxuICAgIC8vIGV2ZW50cyBhcmUgZmlyZWQuIEFnYWluLCBhdHRyaWJ1dGUgdG8ga2V5Ym9hcmQgaW5wdXQgbW9kYWxpdHkuXG4gICAgaWYgKGlzRmFrZVRvdWNoc3RhcnRGcm9tU2NyZWVuUmVhZGVyKGV2ZW50KSkge1xuICAgICAgdGhpcy5fbW9kYWxpdHkubmV4dCgna2V5Ym9hcmQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSB0aGUgdGltZXN0YW1wIG9mIHRoaXMgdG91Y2ggZXZlbnQsIGFzIGl0J3MgdXNlZCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIG1vdXNlIGV2ZW50c1xuICAgIC8vIHRyaWdnZXJlZCB2aWEgbW91c2UgdnMgdG91Y2guXG4gICAgdGhpcy5fbGFzdFRvdWNoTXMgPSBEYXRlLm5vdygpO1xuXG4gICAgdGhpcy5fbW9kYWxpdHkubmV4dCgndG91Y2gnKTtcbiAgICB0aGlzLl9tb3N0UmVjZW50VGFyZ2V0ID0gX2dldEV2ZW50VGFyZ2V0KGV2ZW50KTtcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChJTlBVVF9NT0RBTElUWV9ERVRFQ1RPUl9PUFRJT05TKVxuICAgIG9wdGlvbnM/OiBJbnB1dE1vZGFsaXR5RGV0ZWN0b3JPcHRpb25zLFxuICApIHtcbiAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgLi4uSU5QVVRfTU9EQUxJVFlfREVURUNUT1JfREVGQVVMVF9PUFRJT05TLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gU2tpcCB0aGUgZmlyc3QgZW1pc3Npb24gYXMgaXQncyBudWxsLlxuICAgIHRoaXMubW9kYWxpdHlEZXRlY3RlZCA9IHRoaXMuX21vZGFsaXR5LnBpcGUoc2tpcCgxKSk7XG4gICAgdGhpcy5tb2RhbGl0eUNoYW5nZWQgPSB0aGlzLm1vZGFsaXR5RGV0ZWN0ZWQucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcblxuICAgIC8vIElmIHdlJ3JlIG5vdCBpbiBhIGJyb3dzZXIsIHRoaXMgc2VydmljZSBzaG91bGQgZG8gbm90aGluZywgYXMgdGhlcmUncyBubyByZWxldmFudCBpbnB1dFxuICAgIC8vIG1vZGFsaXR5IHRvIGRldGVjdC5cbiAgICBpZiAoX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX29uS2V5ZG93biwgbW9kYWxpdHlFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2Vkb3duLCBtb2RhbGl0eUV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uVG91Y2hzdGFydCwgbW9kYWxpdHlFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9tb2RhbGl0eS5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX29uS2V5ZG93biwgbW9kYWxpdHlFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlZG93biwgbW9kYWxpdHlFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25Ub3VjaHN0YXJ0LCBtb2RhbGl0eUV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==