/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material drawers.
 * @docs-private
 */
export const matDrawerAnimations = {
    /** Animation that slides a drawer in and out. */
    transformDrawer: trigger('transform', [
        // We remove the `transform` here completely, rather than setting it to zero, because:
        // 1. Having a transform can cause elements with ripples or an animated
        //    transform to shift around in Chrome with an RTL layout (see #10023).
        // 2. 3d transforms causes text to appear blurry on IE and Edge.
        state('open, open-instant', style({
            'transform': 'none',
            'visibility': 'visible',
        })),
        state('void', style({
            // Avoids the shadow showing up when closed in SSR.
            'box-shadow': 'none',
            'visibility': 'hidden',
        })),
        transition('void => open-instant', animate('0ms')),
        transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQ0wsT0FBTyxFQUNQLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sR0FFUixNQUFNLHFCQUFxQixDQUFDO0FBRTdCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUU1QjtJQUNGLGlEQUFpRDtJQUNqRCxlQUFlLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRTtRQUNwQyxzRkFBc0Y7UUFDdEYsdUVBQXVFO1FBQ3ZFLDBFQUEwRTtRQUMxRSxnRUFBZ0U7UUFDaEUsS0FBSyxDQUNILG9CQUFvQixFQUNwQixLQUFLLENBQUM7WUFDSixXQUFXLEVBQUUsTUFBTTtZQUNuQixZQUFZLEVBQUUsU0FBUztTQUN4QixDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsTUFBTSxFQUNOLEtBQUssQ0FBQztZQUNKLG1EQUFtRDtZQUNuRCxZQUFZLEVBQUUsTUFBTTtZQUNwQixZQUFZLEVBQUUsUUFBUTtTQUN2QixDQUFDLENBQ0g7UUFDRCxVQUFVLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELFVBQVUsQ0FDUixxQ0FBcUMsRUFDckMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQ2xEO0tBQ0YsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIGRyYXdlcnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXREcmF3ZXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybURyYXdlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHNsaWRlcyBhIGRyYXdlciBpbiBhbmQgb3V0LiAqL1xuICB0cmFuc2Zvcm1EcmF3ZXI6IHRyaWdnZXIoJ3RyYW5zZm9ybScsIFtcbiAgICAvLyBXZSByZW1vdmUgdGhlIGB0cmFuc2Zvcm1gIGhlcmUgY29tcGxldGVseSwgcmF0aGVyIHRoYW4gc2V0dGluZyBpdCB0byB6ZXJvLCBiZWNhdXNlOlxuICAgIC8vIDEuIEhhdmluZyBhIHRyYW5zZm9ybSBjYW4gY2F1c2UgZWxlbWVudHMgd2l0aCByaXBwbGVzIG9yIGFuIGFuaW1hdGVkXG4gICAgLy8gICAgdHJhbnNmb3JtIHRvIHNoaWZ0IGFyb3VuZCBpbiBDaHJvbWUgd2l0aCBhbiBSVEwgbGF5b3V0IChzZWUgIzEwMDIzKS5cbiAgICAvLyAyLiAzZCB0cmFuc2Zvcm1zIGNhdXNlcyB0ZXh0IHRvIGFwcGVhciBibHVycnkgb24gSUUgYW5kIEVkZ2UuXG4gICAgc3RhdGUoXG4gICAgICAnb3Blbiwgb3Blbi1pbnN0YW50JyxcbiAgICAgIHN0eWxlKHtcbiAgICAgICAgJ3RyYW5zZm9ybSc6ICdub25lJyxcbiAgICAgICAgJ3Zpc2liaWxpdHknOiAndmlzaWJsZScsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHN0YXRlKFxuICAgICAgJ3ZvaWQnLFxuICAgICAgc3R5bGUoe1xuICAgICAgICAvLyBBdm9pZHMgdGhlIHNoYWRvdyBzaG93aW5nIHVwIHdoZW4gY2xvc2VkIGluIFNTUi5cbiAgICAgICAgJ2JveC1zaGFkb3cnOiAnbm9uZScsXG4gICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbicsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gb3Blbi1pbnN0YW50JywgYW5pbWF0ZSgnMG1zJykpLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAndm9pZCA8PT4gb3Blbiwgb3Blbi1pbnN0YW50ID0+IHZvaWQnLFxuICAgICAgYW5pbWF0ZSgnNDAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknKSxcbiAgICApLFxuICBdKSxcbn07XG4iXX0=