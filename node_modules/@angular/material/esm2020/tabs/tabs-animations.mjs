/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material tabs.
 * @docs-private
 */
export const matTabsAnimations = {
    /** Animation translates a tab along the X axis. */
    translateTab: trigger('translateTab', [
        // Note: transitions to `none` instead of 0, because some browsers might blur the content.
        state('center, void, left-origin-center, right-origin-center', style({ transform: 'none' })),
        // If the tab is either on the left or right, we additionally add a `min-height` of 1px
        // in order to ensure that the element has a height before its state changes. This is
        // necessary because Chrome does seem to skip the transition in RTL mode if the element does
        // not have a static height and is not rendered. See related issue: #9465
        state('left', style({ transform: 'translate3d(-100%, 0, 0)', minHeight: '1px' })),
        state('right', style({ transform: 'translate3d(100%, 0, 0)', minHeight: '1px' })),
        transition('* => left, * => right, left => center, right => center', animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')),
        transition('void => left-origin-center', [
            style({ transform: 'translate3d(-100%, 0, 0)' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        ]),
        transition('void => right-origin-center', [
            style({ transform: 'translate3d(100%, 0, 0)' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        ]),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFicy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBRTFCO0lBQ0YsbURBQW1EO0lBQ25ELFlBQVksRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFO1FBQ3BDLDBGQUEwRjtRQUMxRixLQUFLLENBQUMsdURBQXVELEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFMUYsdUZBQXVGO1FBQ3ZGLHFGQUFxRjtRQUNyRiw0RkFBNEY7UUFDNUYseUVBQXlFO1FBQ3pFLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQy9FLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLHlCQUF5QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRS9FLFVBQVUsQ0FDUix3REFBd0QsRUFDeEQsT0FBTyxDQUFDLHNEQUFzRCxDQUFDLENBQ2hFO1FBQ0QsVUFBVSxDQUFDLDRCQUE0QixFQUFFO1lBQ3ZDLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsRUFBQyxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxzREFBc0QsQ0FBQztTQUNoRSxDQUFDO1FBQ0YsVUFBVSxDQUFDLDZCQUE2QixFQUFFO1lBQ3hDLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSx5QkFBeUIsRUFBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxzREFBc0QsQ0FBQztTQUNoRSxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIHRhYnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRUYWJzQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2xhdGVUYWI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdHJhbnNsYXRlcyBhIHRhYiBhbG9uZyB0aGUgWCBheGlzLiAqL1xuICB0cmFuc2xhdGVUYWI6IHRyaWdnZXIoJ3RyYW5zbGF0ZVRhYicsIFtcbiAgICAvLyBOb3RlOiB0cmFuc2l0aW9ucyB0byBgbm9uZWAgaW5zdGVhZCBvZiAwLCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgbWlnaHQgYmx1ciB0aGUgY29udGVudC5cbiAgICBzdGF0ZSgnY2VudGVyLCB2b2lkLCBsZWZ0LW9yaWdpbi1jZW50ZXIsIHJpZ2h0LW9yaWdpbi1jZW50ZXInLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZSd9KSksXG5cbiAgICAvLyBJZiB0aGUgdGFiIGlzIGVpdGhlciBvbiB0aGUgbGVmdCBvciByaWdodCwgd2UgYWRkaXRpb25hbGx5IGFkZCBhIGBtaW4taGVpZ2h0YCBvZiAxcHhcbiAgICAvLyBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgZWxlbWVudCBoYXMgYSBoZWlnaHQgYmVmb3JlIGl0cyBzdGF0ZSBjaGFuZ2VzLiBUaGlzIGlzXG4gICAgLy8gbmVjZXNzYXJ5IGJlY2F1c2UgQ2hyb21lIGRvZXMgc2VlbSB0byBza2lwIHRoZSB0cmFuc2l0aW9uIGluIFJUTCBtb2RlIGlmIHRoZSBlbGVtZW50IGRvZXNcbiAgICAvLyBub3QgaGF2ZSBhIHN0YXRpYyBoZWlnaHQgYW5kIGlzIG5vdCByZW5kZXJlZC4gU2VlIHJlbGF0ZWQgaXNzdWU6ICM5NDY1XG4gICAgc3RhdGUoJ2xlZnQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJywgbWluSGVpZ2h0OiAnMXB4J30pKSxcbiAgICBzdGF0ZSgncmlnaHQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLCBtaW5IZWlnaHQ6ICcxcHgnfSkpLFxuXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICcqID0+IGxlZnQsICogPT4gcmlnaHQsIGxlZnQgPT4gY2VudGVyLCByaWdodCA9PiBjZW50ZXInLFxuICAgICAgYW5pbWF0ZSgne3thbmltYXRpb25EdXJhdGlvbn19IGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpLFxuICAgICksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBsZWZ0LW9yaWdpbi1jZW50ZXInLCBbXG4gICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJ30pLFxuICAgICAgYW5pbWF0ZSgne3thbmltYXRpb25EdXJhdGlvbn19IGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpLFxuICAgIF0pLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gcmlnaHQtb3JpZ2luLWNlbnRlcicsIFtcbiAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKSd9KSxcbiAgICAgIGFuaW1hdGUoJ3t7YW5pbWF0aW9uRHVyYXRpb259fSBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKSxcbiAgICBdKSxcbiAgXSksXG59O1xuIl19