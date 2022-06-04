/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, query, animateChild, group, } from '@angular/animations';
/**
 * Animations used by MatDialog.
 * @docs-private
 */
export const matDialogAnimations = {
    /** Animation that is applied on the dialog container by default. */
    dialogContainer: trigger('dialogContainer', [
        // Note: The `enter` animation transitions to `transform: none`, because for some reason
        // specifying the transform explicitly, causes IE both to blur the dialog content and
        // decimate the animation performance. Leaving it as `none` solves both issues.
        state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
        state('enter', style({ transform: 'none' })),
        transition('* => enter', group([
            animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 })),
            query('@*', animateChild(), { optional: true }),
        ])),
        transition('* => void, * => exit', group([
            animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 })),
            query('@*', animateChild(), { optional: true }),
        ])),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL2RpYWxvZy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUVQLEtBQUssRUFDTCxZQUFZLEVBQ1osS0FBSyxHQUNOLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBRTVCO0lBQ0Ysb0VBQW9FO0lBQ3BFLGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7UUFDMUMsd0ZBQXdGO1FBQ3hGLHFGQUFxRjtRQUNyRiwrRUFBK0U7UUFDL0UsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDMUMsVUFBVSxDQUNSLFlBQVksRUFDWixLQUFLLENBQUM7WUFDSixPQUFPLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNuRixLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO1NBQzlDLENBQUMsQ0FDSDtRQUNELFVBQVUsQ0FDUixzQkFBc0IsRUFDdEIsS0FBSyxDQUFDO1lBQ0osT0FBTyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ25FLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDOUMsQ0FBQyxDQUNIO0tBQ0YsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBxdWVyeSxcbiAgYW5pbWF0ZUNoaWxkLFxuICBncm91cCxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IE1hdERpYWxvZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdERpYWxvZ0FuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgZGlhbG9nQ29udGFpbmVyOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgaXMgYXBwbGllZCBvbiB0aGUgZGlhbG9nIGNvbnRhaW5lciBieSBkZWZhdWx0LiAqL1xuICBkaWFsb2dDb250YWluZXI6IHRyaWdnZXIoJ2RpYWxvZ0NvbnRhaW5lcicsIFtcbiAgICAvLyBOb3RlOiBUaGUgYGVudGVyYCBhbmltYXRpb24gdHJhbnNpdGlvbnMgdG8gYHRyYW5zZm9ybTogbm9uZWAsIGJlY2F1c2UgZm9yIHNvbWUgcmVhc29uXG4gICAgLy8gc3BlY2lmeWluZyB0aGUgdHJhbnNmb3JtIGV4cGxpY2l0bHksIGNhdXNlcyBJRSBib3RoIHRvIGJsdXIgdGhlIGRpYWxvZyBjb250ZW50IGFuZFxuICAgIC8vIGRlY2ltYXRlIHRoZSBhbmltYXRpb24gcGVyZm9ybWFuY2UuIExlYXZpbmcgaXQgYXMgYG5vbmVgIHNvbHZlcyBib3RoIGlzc3Vlcy5cbiAgICBzdGF0ZSgndm9pZCwgZXhpdCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwLjcpJ30pKSxcbiAgICBzdGF0ZSgnZW50ZXInLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZSd9KSksXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICcqID0+IGVudGVyJyxcbiAgICAgIGdyb3VwKFtcbiAgICAgICAgYW5pbWF0ZSgnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZScsIG9wYWNpdHk6IDF9KSksXG4gICAgICAgIHF1ZXJ5KCdAKicsIGFuaW1hdGVDaGlsZCgpLCB7b3B0aW9uYWw6IHRydWV9KSxcbiAgICAgIF0pLFxuICAgICksXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICcqID0+IHZvaWQsICogPT4gZXhpdCcsXG4gICAgICBncm91cChbXG4gICAgICAgIGFuaW1hdGUoJzc1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJywgc3R5bGUoe29wYWNpdHk6IDB9KSksXG4gICAgICAgIHF1ZXJ5KCdAKicsIGFuaW1hdGVDaGlsZCgpLCB7b3B0aW9uYWw6IHRydWV9KSxcbiAgICAgIF0pLFxuICAgICksXG4gIF0pLFxufTtcbiJdfQ==