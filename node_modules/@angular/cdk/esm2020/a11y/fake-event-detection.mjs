/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Gets whether an event could be a faked `mousedown` event dispatched by a screen reader. */
export function isFakeMousedownFromScreenReader(event) {
    // Some screen readers will dispatch a fake `mousedown` event when pressing enter or space on
    // a clickable element. We can distinguish these events when both `offsetX` and `offsetY` are
    // zero or `event.buttons` is zero, depending on the browser:
    // - `event.buttons` works on Firefox, but fails on Chrome.
    // - `offsetX` and `offsetY` work on Chrome, but fail on Firefox.
    // Note that there's an edge case where the user could click the 0x0 spot of the
    // screen themselves, but that is unlikely to contain interactive elements.
    return event.buttons === 0 || (event.offsetX === 0 && event.offsetY === 0);
}
/** Gets whether an event could be a faked `touchstart` event dispatched by a screen reader. */
export function isFakeTouchstartFromScreenReader(event) {
    const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
    // A fake `touchstart` can be distinguished from a real one by looking at the `identifier`
    // which is typically >= 0 on a real device versus -1 from a screen reader. Just to be safe,
    // we can also look at `radiusX` and `radiusY`. This behavior was observed against a Windows 10
    // device with a touch screen running NVDA v2020.4 and Firefox 85 or Chrome 88.
    return (!!touch &&
        touch.identifier === -1 &&
        (touch.radiusX == null || touch.radiusX === 1) &&
        (touch.radiusY == null || touch.radiusY === 1));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1ldmVudC1kZXRlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvZmFrZS1ldmVudC1kZXRlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsOEZBQThGO0FBQzlGLE1BQU0sVUFBVSwrQkFBK0IsQ0FBQyxLQUFpQjtJQUMvRCw2RkFBNkY7SUFDN0YsNkZBQTZGO0lBQzdGLDZEQUE2RDtJQUM3RCwyREFBMkQ7SUFDM0QsaUVBQWlFO0lBQ2pFLGdGQUFnRjtJQUNoRiwyRUFBMkU7SUFDM0UsT0FBTyxLQUFLLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUVELCtGQUErRjtBQUMvRixNQUFNLFVBQVUsZ0NBQWdDLENBQUMsS0FBaUI7SUFDaEUsTUFBTSxLQUFLLEdBQ1QsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNGLDBGQUEwRjtJQUMxRiw0RkFBNEY7SUFDNUYsK0ZBQStGO0lBQy9GLCtFQUErRTtJQUMvRSxPQUFPLENBQ0wsQ0FBQyxDQUFDLEtBQUs7UUFDUCxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FDL0MsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIEdldHMgd2hldGhlciBhbiBldmVudCBjb3VsZCBiZSBhIGZha2VkIGBtb3VzZWRvd25gIGV2ZW50IGRpc3BhdGNoZWQgYnkgYSBzY3JlZW4gcmVhZGVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQ6IE1vdXNlRXZlbnQpOiBib29sZWFuIHtcbiAgLy8gU29tZSBzY3JlZW4gcmVhZGVycyB3aWxsIGRpc3BhdGNoIGEgZmFrZSBgbW91c2Vkb3duYCBldmVudCB3aGVuIHByZXNzaW5nIGVudGVyIG9yIHNwYWNlIG9uXG4gIC8vIGEgY2xpY2thYmxlIGVsZW1lbnQuIFdlIGNhbiBkaXN0aW5ndWlzaCB0aGVzZSBldmVudHMgd2hlbiBib3RoIGBvZmZzZXRYYCBhbmQgYG9mZnNldFlgIGFyZVxuICAvLyB6ZXJvIG9yIGBldmVudC5idXR0b25zYCBpcyB6ZXJvLCBkZXBlbmRpbmcgb24gdGhlIGJyb3dzZXI6XG4gIC8vIC0gYGV2ZW50LmJ1dHRvbnNgIHdvcmtzIG9uIEZpcmVmb3gsIGJ1dCBmYWlscyBvbiBDaHJvbWUuXG4gIC8vIC0gYG9mZnNldFhgIGFuZCBgb2Zmc2V0WWAgd29yayBvbiBDaHJvbWUsIGJ1dCBmYWlsIG9uIEZpcmVmb3guXG4gIC8vIE5vdGUgdGhhdCB0aGVyZSdzIGFuIGVkZ2UgY2FzZSB3aGVyZSB0aGUgdXNlciBjb3VsZCBjbGljayB0aGUgMHgwIHNwb3Qgb2YgdGhlXG4gIC8vIHNjcmVlbiB0aGVtc2VsdmVzLCBidXQgdGhhdCBpcyB1bmxpa2VseSB0byBjb250YWluIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuICByZXR1cm4gZXZlbnQuYnV0dG9ucyA9PT0gMCB8fCAoZXZlbnQub2Zmc2V0WCA9PT0gMCAmJiBldmVudC5vZmZzZXRZID09PSAwKTtcbn1cblxuLyoqIEdldHMgd2hldGhlciBhbiBldmVudCBjb3VsZCBiZSBhIGZha2VkIGB0b3VjaHN0YXJ0YCBldmVudCBkaXNwYXRjaGVkIGJ5IGEgc2NyZWVuIHJlYWRlci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcihldmVudDogVG91Y2hFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB0b3VjaDogVG91Y2ggfCB1bmRlZmluZWQgPVxuICAgIChldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXNbMF0pIHx8IChldmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSk7XG5cbiAgLy8gQSBmYWtlIGB0b3VjaHN0YXJ0YCBjYW4gYmUgZGlzdGluZ3Vpc2hlZCBmcm9tIGEgcmVhbCBvbmUgYnkgbG9va2luZyBhdCB0aGUgYGlkZW50aWZpZXJgXG4gIC8vIHdoaWNoIGlzIHR5cGljYWxseSA+PSAwIG9uIGEgcmVhbCBkZXZpY2UgdmVyc3VzIC0xIGZyb20gYSBzY3JlZW4gcmVhZGVyLiBKdXN0IHRvIGJlIHNhZmUsXG4gIC8vIHdlIGNhbiBhbHNvIGxvb2sgYXQgYHJhZGl1c1hgIGFuZCBgcmFkaXVzWWAuIFRoaXMgYmVoYXZpb3Igd2FzIG9ic2VydmVkIGFnYWluc3QgYSBXaW5kb3dzIDEwXG4gIC8vIGRldmljZSB3aXRoIGEgdG91Y2ggc2NyZWVuIHJ1bm5pbmcgTlZEQSB2MjAyMC40IGFuZCBGaXJlZm94IDg1IG9yIENocm9tZSA4OC5cbiAgcmV0dXJuIChcbiAgICAhIXRvdWNoICYmXG4gICAgdG91Y2guaWRlbnRpZmllciA9PT0gLTEgJiZcbiAgICAodG91Y2gucmFkaXVzWCA9PSBudWxsIHx8IHRvdWNoLnJhZGl1c1ggPT09IDEpICYmXG4gICAgKHRvdWNoLnJhZGl1c1kgPT0gbnVsbCB8fCB0b3VjaC5yYWRpdXNZID09PSAxKVxuICApO1xufVxuIl19