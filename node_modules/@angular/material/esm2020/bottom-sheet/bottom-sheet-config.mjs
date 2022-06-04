/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/** Injection token that can be used to access the data that was passed in to a bottom sheet. */
export const MAT_BOTTOM_SHEET_DATA = new InjectionToken('MatBottomSheetData');
/**
 * Configuration used when opening a bottom sheet.
 */
export class MatBottomSheetConfig {
    constructor() {
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the bottom sheet has a backdrop. */
        this.hasBackdrop = true;
        /** Whether the user can use escape or clicking outside to close the bottom sheet. */
        this.disableClose = false;
        /** Aria label to assign to the bottom sheet element. */
        this.ariaLabel = null;
        /**
         * Whether the bottom sheet should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // Note that this is set to 'dialog' by default, because while the a11y recommendations
        // are to focus the first focusable element, doing so prevents screen readers from reading out the
        // rest of the bottom sheet content.
        /**
         * Where the bottom sheet should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        this.autoFocus = 'dialog';
        /**
         * Whether the bottom sheet should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsY0FBYyxFQUFtQixNQUFNLGVBQWUsQ0FBQztBQUsvRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQU0sb0JBQW9CLENBQUMsQ0FBQztBQUVuRjs7R0FFRztBQUNILE1BQU0sT0FBTyxvQkFBb0I7SUFBakM7UUFVRSxvREFBb0Q7UUFDcEQsU0FBSSxHQUFjLElBQUksQ0FBQztRQUV2QiwrQ0FBK0M7UUFDL0MsZ0JBQVcsR0FBYSxJQUFJLENBQUM7UUFLN0IscUZBQXFGO1FBQ3JGLGlCQUFZLEdBQWEsS0FBSyxDQUFDO1FBRS9CLHdEQUF3RDtRQUN4RCxjQUFTLEdBQW1CLElBQUksQ0FBQztRQUVqQzs7OztXQUlHO1FBQ0gsc0JBQWlCLEdBQWEsSUFBSSxDQUFDO1FBRW5DLHVGQUF1RjtRQUN2RixrR0FBa0c7UUFDbEcsb0NBQW9DO1FBQ3BDOzs7O1dBSUc7UUFDSCxjQUFTLEdBQXdDLFFBQVEsQ0FBQztRQUUxRDs7O1dBR0c7UUFDSCxpQkFBWSxHQUFhLElBQUksQ0FBQztJQUloQyxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7SW5qZWN0aW9uVG9rZW4sIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogT3B0aW9ucyBmb3Igd2hlcmUgdG8gc2V0IGZvY3VzIHRvIGF1dG9tYXRpY2FsbHkgb24gZGlhbG9nIG9wZW4gKi9cbmV4cG9ydCB0eXBlIEF1dG9Gb2N1c1RhcmdldCA9ICdkaWFsb2cnIHwgJ2ZpcnN0LXRhYmJhYmxlJyB8ICdmaXJzdC1oZWFkaW5nJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBib3R0b20gc2hlZXQuICovXG5leHBvcnQgY29uc3QgTUFUX0JPVFRPTV9TSEVFVF9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdEJvdHRvbVNoZWV0RGF0YScpO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gdXNlZCB3aGVuIG9wZW5pbmcgYSBib3R0b20gc2hlZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldENvbmZpZzxEID0gYW55PiB7XG4gIC8qKiBUaGUgdmlldyBjb250YWluZXIgdG8gcGxhY2UgdGhlIG92ZXJsYXkgZm9yIHRoZSBib3R0b20gc2hlZXQgaW50by4gKi9cbiAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWY7XG5cbiAgLyoqIEV4dHJhIENTUyBjbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyLiAqL1xuICBwYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFRleHQgbGF5b3V0IGRpcmVjdGlvbiBmb3IgdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBEYXRhIGJlaW5nIGluamVjdGVkIGludG8gdGhlIGNoaWxkIGNvbXBvbmVudC4gKi9cbiAgZGF0YT86IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBjYW4gdXNlIGVzY2FwZSBvciBjbGlja2luZyBvdXRzaWRlIHRvIGNsb3NlIHRoZSBib3R0b20gc2hlZXQuICovXG4gIGRpc2FibGVDbG9zZT86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQXJpYSBsYWJlbCB0byBhc3NpZ24gdG8gdGhlIGJvdHRvbSBzaGVldCBlbGVtZW50LiAqL1xuICBhcmlhTGFiZWw/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIGdvZXMgYmFja3dhcmRzL2ZvcndhcmRzIGluIGhpc3RvcnkuXG4gICAqIE5vdGUgdGhhdCB0aGlzIHVzdWFsbHkgZG9lc24ndCBpbmNsdWRlIGNsaWNraW5nIG9uIGxpbmtzICh1bmxlc3MgdGhlIHVzZXIgaXMgdXNpbmdcbiAgICogdGhlIGBIYXNoTG9jYXRpb25TdHJhdGVneWApLlxuICAgKi9cbiAgY2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvLyBOb3RlIHRoYXQgdGhpcyBpcyBzZXQgdG8gJ2RpYWxvZycgYnkgZGVmYXVsdCwgYmVjYXVzZSB3aGlsZSB0aGUgYTExeSByZWNvbW1lbmRhdGlvbnNcbiAgLy8gYXJlIHRvIGZvY3VzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgZG9pbmcgc28gcHJldmVudHMgc2NyZWVuIHJlYWRlcnMgZnJvbSByZWFkaW5nIG91dCB0aGVcbiAgLy8gcmVzdCBvZiB0aGUgYm90dG9tIHNoZWV0IGNvbnRlbnQuXG4gIC8qKlxuICAgKiBXaGVyZSB0aGUgYm90dG9tIHNoZWV0IHNob3VsZCBmb2N1cyBvbiBvcGVuLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgYm9vbGVhbiBvcHRpb24gZnJvbSBhdXRvRm9jdXMuIFVzZSBzdHJpbmcgb3JcbiAgICogQXV0b0ZvY3VzVGFyZ2V0IGluc3RlYWQuXG4gICAqL1xuICBhdXRvRm9jdXM/OiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuID0gJ2RpYWxvZyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGJvdHRvbSBzaGVldCBzaG91bGQgcmVzdG9yZSBmb2N1cyB0byB0aGVcbiAgICogcHJldmlvdXNseS1mb2N1c2VkIGVsZW1lbnQsIGFmdGVyIGl0J3MgY2xvc2VkLlxuICAgKi9cbiAgcmVzdG9yZUZvY3VzPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFNjcm9sbCBzdHJhdGVneSB0byBiZSB1c2VkIGZvciB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBzY3JvbGxTdHJhdGVneT86IFNjcm9sbFN0cmF0ZWd5O1xufVxuIl19