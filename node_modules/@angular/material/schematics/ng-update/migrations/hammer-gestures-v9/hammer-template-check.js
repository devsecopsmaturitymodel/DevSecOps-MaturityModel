"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHammerJsUsedInTemplate = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/** List of known events which are supported by the "HammerGesturesPlugin". */
const STANDARD_HAMMERJS_EVENTS = [
    // Events supported by the "HammerGesturesPlugin". See:
    // angular/angular/blob/0119f46d/packages/platform-browser/src/dom/events/hammer_gestures.ts#L19
    'pan',
    'panstart',
    'panmove',
    'panend',
    'pancancel',
    'panleft',
    'panright',
    'panup',
    'pandown',
    'pinch',
    'pinchstart',
    'pinchmove',
    'pinchend',
    'pinchcancel',
    'pinchin',
    'pinchout',
    'press',
    'pressup',
    'rotate',
    'rotatestart',
    'rotatemove',
    'rotateend',
    'rotatecancel',
    'swipe',
    'swipeleft',
    'swiperight',
    'swipeup',
    'swipedown',
    'tap',
];
/** List of events which are provided by the deprecated Angular Material "GestureConfig". */
const CUSTOM_MATERIAL_HAMMERJS_EVENS = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft',
];
/**
 * Parses the specified HTML and searches for elements with Angular outputs listening to
 * one of the known HammerJS events. This check naively assumes that the bindings never
 * match on a component output, but only on the Hammer plugin.
 */
function isHammerJsUsedInTemplate(html) {
    const document = schematics_1.parse5.parseFragment(html, { sourceCodeLocationInfo: true });
    let customEvents = false;
    let standardEvents = false;
    const visitNodes = (nodes) => {
        nodes.forEach(node => {
            if (!isElement(node)) {
                return;
            }
            for (let attr of node.attrs) {
                if (!customEvents && CUSTOM_MATERIAL_HAMMERJS_EVENS.some(e => `(${e})` === attr.name)) {
                    customEvents = true;
                }
                if (!standardEvents && STANDARD_HAMMERJS_EVENTS.some(e => `(${e})` === attr.name)) {
                    standardEvents = true;
                }
            }
            // Do not continue traversing the AST if both type of HammerJS
            // usages have been detected already.
            if (!customEvents || !standardEvents) {
                visitNodes(node.childNodes);
            }
        });
    };
    visitNodes(document.childNodes);
    return { customEvents, standardEvents };
}
exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
function isElement(node) {
    return !!node.attrs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLXRlbXBsYXRlLWNoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci10ZW1wbGF0ZS1jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBK0M7QUFFL0MsOEVBQThFO0FBQzlFLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsdURBQXVEO0lBQ3ZELGdHQUFnRztJQUNoRyxLQUFLO0lBQ0wsVUFBVTtJQUNWLFNBQVM7SUFDVCxRQUFRO0lBQ1IsV0FBVztJQUNYLFNBQVM7SUFDVCxVQUFVO0lBQ1YsT0FBTztJQUNQLFNBQVM7SUFDVCxPQUFPO0lBQ1AsWUFBWTtJQUNaLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFNBQVM7SUFDVCxVQUFVO0lBQ1YsT0FBTztJQUNQLFNBQVM7SUFDVCxRQUFRO0lBQ1IsYUFBYTtJQUNiLFlBQVk7SUFDWixXQUFXO0lBQ1gsY0FBYztJQUNkLE9BQU87SUFDUCxXQUFXO0lBQ1gsWUFBWTtJQUNaLFNBQVM7SUFDVCxXQUFXO0lBQ1gsS0FBSztDQUNOLENBQUM7QUFFRiw0RkFBNEY7QUFDNUYsTUFBTSw4QkFBOEIsR0FBRztJQUNyQyxXQUFXO0lBQ1gsT0FBTztJQUNQLFlBQVk7SUFDWixVQUFVO0lBQ1YsWUFBWTtJQUNaLFdBQVc7Q0FDWixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLElBQVk7SUFJbkQsTUFBTSxRQUFRLEdBQUcsbUJBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM1RSxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzNCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBeUIsRUFBRSxFQUFFO1FBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMzQixJQUFJLENBQUMsWUFBWSxJQUFJLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNyRixZQUFZLEdBQUcsSUFBSSxDQUFDO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsY0FBYyxJQUFJLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNqRixjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN2QjthQUNGO1lBRUQsOERBQThEO1lBQzlELHFDQUFxQztZQUNyQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNwQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFDRixVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUUsY0FBYyxFQUFDLENBQUM7QUFDeEMsQ0FBQztBQS9CRCw0REErQkM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFTO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlNX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG4vKiogTGlzdCBvZiBrbm93biBldmVudHMgd2hpY2ggYXJlIHN1cHBvcnRlZCBieSB0aGUgXCJIYW1tZXJHZXN0dXJlc1BsdWdpblwiLiAqL1xuY29uc3QgU1RBTkRBUkRfSEFNTUVSSlNfRVZFTlRTID0gW1xuICAvLyBFdmVudHMgc3VwcG9ydGVkIGJ5IHRoZSBcIkhhbW1lckdlc3R1cmVzUGx1Z2luXCIuIFNlZTpcbiAgLy8gYW5ndWxhci9hbmd1bGFyL2Jsb2IvMDExOWY0NmQvcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMudHMjTDE5XG4gICdwYW4nLFxuICAncGFuc3RhcnQnLFxuICAncGFubW92ZScsXG4gICdwYW5lbmQnLFxuICAncGFuY2FuY2VsJyxcbiAgJ3BhbmxlZnQnLFxuICAncGFucmlnaHQnLFxuICAncGFudXAnLFxuICAncGFuZG93bicsXG4gICdwaW5jaCcsXG4gICdwaW5jaHN0YXJ0JyxcbiAgJ3BpbmNobW92ZScsXG4gICdwaW5jaGVuZCcsXG4gICdwaW5jaGNhbmNlbCcsXG4gICdwaW5jaGluJyxcbiAgJ3BpbmNob3V0JyxcbiAgJ3ByZXNzJyxcbiAgJ3ByZXNzdXAnLFxuICAncm90YXRlJyxcbiAgJ3JvdGF0ZXN0YXJ0JyxcbiAgJ3JvdGF0ZW1vdmUnLFxuICAncm90YXRlZW5kJyxcbiAgJ3JvdGF0ZWNhbmNlbCcsXG4gICdzd2lwZScsXG4gICdzd2lwZWxlZnQnLFxuICAnc3dpcGVyaWdodCcsXG4gICdzd2lwZXVwJyxcbiAgJ3N3aXBlZG93bicsXG4gICd0YXAnLFxuXTtcblxuLyoqIExpc3Qgb2YgZXZlbnRzIHdoaWNoIGFyZSBwcm92aWRlZCBieSB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIFwiR2VzdHVyZUNvbmZpZ1wiLiAqL1xuY29uc3QgQ1VTVE9NX01BVEVSSUFMX0hBTU1FUkpTX0VWRU5TID0gW1xuICAnbG9uZ3ByZXNzJyxcbiAgJ3NsaWRlJyxcbiAgJ3NsaWRlc3RhcnQnLFxuICAnc2xpZGVlbmQnLFxuICAnc2xpZGVyaWdodCcsXG4gICdzbGlkZWxlZnQnLFxuXTtcblxuLyoqXG4gKiBQYXJzZXMgdGhlIHNwZWNpZmllZCBIVE1MIGFuZCBzZWFyY2hlcyBmb3IgZWxlbWVudHMgd2l0aCBBbmd1bGFyIG91dHB1dHMgbGlzdGVuaW5nIHRvXG4gKiBvbmUgb2YgdGhlIGtub3duIEhhbW1lckpTIGV2ZW50cy4gVGhpcyBjaGVjayBuYWl2ZWx5IGFzc3VtZXMgdGhhdCB0aGUgYmluZGluZ3MgbmV2ZXJcbiAqIG1hdGNoIG9uIGEgY29tcG9uZW50IG91dHB1dCwgYnV0IG9ubHkgb24gdGhlIEhhbW1lciBwbHVnaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUoaHRtbDogc3RyaW5nKToge1xuICBzdGFuZGFyZEV2ZW50czogYm9vbGVhbjtcbiAgY3VzdG9tRXZlbnRzOiBib29sZWFuO1xufSB7XG4gIGNvbnN0IGRvY3VtZW50ID0gcGFyc2U1LnBhcnNlRnJhZ21lbnQoaHRtbCwge3NvdXJjZUNvZGVMb2NhdGlvbkluZm86IHRydWV9KTtcbiAgbGV0IGN1c3RvbUV2ZW50cyA9IGZhbHNlO1xuICBsZXQgc3RhbmRhcmRFdmVudHMgPSBmYWxzZTtcbiAgY29uc3QgdmlzaXROb2RlcyA9IChub2RlczogcGFyc2U1LkNoaWxkTm9kZVtdKSA9PiB7XG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGlmICghaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgYXR0ciBvZiBub2RlLmF0dHJzKSB7XG4gICAgICAgIGlmICghY3VzdG9tRXZlbnRzICYmIENVU1RPTV9NQVRFUklBTF9IQU1NRVJKU19FVkVOUy5zb21lKGUgPT4gYCgke2V9KWAgPT09IGF0dHIubmFtZSkpIHtcbiAgICAgICAgICBjdXN0b21FdmVudHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RhbmRhcmRFdmVudHMgJiYgU1RBTkRBUkRfSEFNTUVSSlNfRVZFTlRTLnNvbWUoZSA9PiBgKCR7ZX0pYCA9PT0gYXR0ci5uYW1lKSkge1xuICAgICAgICAgIHN0YW5kYXJkRXZlbnRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3QgY29udGludWUgdHJhdmVyc2luZyB0aGUgQVNUIGlmIGJvdGggdHlwZSBvZiBIYW1tZXJKU1xuICAgICAgLy8gdXNhZ2VzIGhhdmUgYmVlbiBkZXRlY3RlZCBhbHJlYWR5LlxuICAgICAgaWYgKCFjdXN0b21FdmVudHMgfHwgIXN0YW5kYXJkRXZlbnRzKSB7XG4gICAgICAgIHZpc2l0Tm9kZXMobm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgdmlzaXROb2Rlcyhkb2N1bWVudC5jaGlsZE5vZGVzKTtcbiAgcmV0dXJuIHtjdXN0b21FdmVudHMsIHN0YW5kYXJkRXZlbnRzfTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGU6IGFueSk6IG5vZGUgaXMgcGFyc2U1LkVsZW1lbnQge1xuICByZXR1cm4gISFub2RlLmF0dHJzO1xufVxuIl19