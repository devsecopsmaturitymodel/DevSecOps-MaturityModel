/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { trigger, state, style, animate, transition, } from '@angular/animations';
/**
 * Animations used by the mat-menu component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 * @docs-private
 */
export const matMenuAnimations = {
    /**
     * This animation controls the menu panel's entry and exit from the page.
     *
     * When the menu panel is added to the DOM, it scales in and fades in its border.
     *
     * When the menu panel is removed from the DOM, it simply fades out after a brief
     * delay to display the ripple.
     */
    transformMenu: trigger('transformMenu', [
        state('void', style({
            opacity: 0,
            transform: 'scale(0.8)',
        })),
        transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
            opacity: 1,
            transform: 'scale(1)',
        }))),
        transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
    ]),
    /**
     * This animation fades in the background color and content of the menu panel
     * after its containing element is scaled in.
     */
    fadeInItems: trigger('fadeInItems', [
        // TODO(crisbeto): this is inside the `transformMenu`
        // now. Remove next time we do breaking changes.
        state('showing', style({ opacity: 1 })),
        transition('void => *', [
            style({ opacity: 0 }),
            animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
        ]),
    ]),
};
/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
export const fadeInItems = matMenuAnimations.fadeInItems;
/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
export const transformMenu = matMenuAnimations.transformMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxPQUFPLEVBQ1AsVUFBVSxHQUVYLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FHMUI7SUFDRjs7Ozs7OztPQU9HO0lBQ0gsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsS0FBSyxDQUNILE1BQU0sRUFDTixLQUFLLENBQUM7WUFDSixPQUFPLEVBQUUsQ0FBQztZQUNWLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FDSDtRQUNELFVBQVUsQ0FDUixlQUFlLEVBQ2YsT0FBTyxDQUNMLGtDQUFrQyxFQUNsQyxLQUFLLENBQUM7WUFDSixPQUFPLEVBQUUsQ0FBQztZQUNWLFNBQVMsRUFBRSxVQUFVO1NBQ3RCLENBQUMsQ0FDSCxDQUNGO1FBQ0QsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxDQUFDO0lBRUY7OztPQUdHO0lBQ0gsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDbEMscURBQXFEO1FBQ3JELGdEQUFnRDtRQUNoRCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3JDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDdEIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQztTQUN4RCxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztBQUV6RDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICB0cmlnZ2VyLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIGFuaW1hdGUsXG4gIHRyYW5zaXRpb24sXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBtYXQtbWVudSBjb21wb25lbnQuXG4gKiBBbmltYXRpb24gZHVyYXRpb24gYW5kIHRpbWluZyB2YWx1ZXMgYXJlIGJhc2VkIG9uOlxuICogaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL2NvbXBvbmVudHMvbWVudXMuaHRtbCNtZW51cy11c2FnZVxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0TWVudUFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgdHJhbnNmb3JtTWVudTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBmYWRlSW5JdGVtczogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIGNvbnRyb2xzIHRoZSBtZW51IHBhbmVsJ3MgZW50cnkgYW5kIGV4aXQgZnJvbSB0aGUgcGFnZS5cbiAgICpcbiAgICogV2hlbiB0aGUgbWVudSBwYW5lbCBpcyBhZGRlZCB0byB0aGUgRE9NLCBpdCBzY2FsZXMgaW4gYW5kIGZhZGVzIGluIGl0cyBib3JkZXIuXG4gICAqXG4gICAqIFdoZW4gdGhlIG1lbnUgcGFuZWwgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00sIGl0IHNpbXBseSBmYWRlcyBvdXQgYWZ0ZXIgYSBicmllZlxuICAgKiBkZWxheSB0byBkaXNwbGF5IHRoZSByaXBwbGUuXG4gICAqL1xuICB0cmFuc2Zvcm1NZW51OiB0cmlnZ2VyKCd0cmFuc2Zvcm1NZW51JywgW1xuICAgIHN0YXRlKFxuICAgICAgJ3ZvaWQnLFxuICAgICAgc3R5bGUoe1xuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjgpJyxcbiAgICAgIH0pLFxuICAgICksXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICd2b2lkID0+IGVudGVyJyxcbiAgICAgIGFuaW1hdGUoXG4gICAgICAgICcxMjBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgICAgIHN0eWxlKHtcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgICksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTAwbXMgMjVtcyBsaW5lYXInLCBzdHlsZSh7b3BhY2l0eTogMH0pKSksXG4gIF0pLFxuXG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBmYWRlcyBpbiB0aGUgYmFja2dyb3VuZCBjb2xvciBhbmQgY29udGVudCBvZiB0aGUgbWVudSBwYW5lbFxuICAgKiBhZnRlciBpdHMgY29udGFpbmluZyBlbGVtZW50IGlzIHNjYWxlZCBpbi5cbiAgICovXG4gIGZhZGVJbkl0ZW1zOiB0cmlnZ2VyKCdmYWRlSW5JdGVtcycsIFtcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBpcyBpbnNpZGUgdGhlIGB0cmFuc2Zvcm1NZW51YFxuICAgIC8vIG5vdy4gUmVtb3ZlIG5leHQgdGltZSB3ZSBkbyBicmVha2luZyBjaGFuZ2VzLlxuICAgIHN0YXRlKCdzaG93aW5nJywgc3R5bGUoe29wYWNpdHk6IDF9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgICAgc3R5bGUoe29wYWNpdHk6IDB9KSxcbiAgICAgIGFuaW1hdGUoJzQwMG1zIDEwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJyksXG4gICAgXSksXG4gIF0pLFxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZmFkZUluSXRlbXMgPSBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtcztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtTWVudSA9IG1hdE1lbnVBbmltYXRpb25zLnRyYW5zZm9ybU1lbnU7XG4iXX0=