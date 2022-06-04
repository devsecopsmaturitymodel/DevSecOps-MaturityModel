/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Configuration for opening a modal dialog with the MatDialog service.
 */
export class MatDialogConfig {
    constructor() {
        /** The ARIA role of the dialog element. */
        this.role = 'dialog';
        /** Custom class for the overlay pane. */
        this.panelClass = '';
        /** Whether the dialog has a backdrop. */
        this.hasBackdrop = true;
        /** Custom class for the backdrop. */
        this.backdropClass = '';
        /** Whether the user can use escape or clicking on the backdrop to close the modal. */
        this.disableClose = false;
        /** Width of the dialog. */
        this.width = '';
        /** Height of the dialog. */
        this.height = '';
        /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
        this.maxWidth = '80vw';
        /** Data being injected into the child component. */
        this.data = null;
        /** ID of the element that describes the dialog. */
        this.ariaDescribedBy = null;
        /** ID of the element that labels the dialog. */
        this.ariaLabelledBy = null;
        /** Aria label to assign to the dialog element. */
        this.ariaLabel = null;
        /**
         * Where the dialog should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        this.autoFocus = 'first-tabbable';
        /**
         * Whether the dialog should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /** Whether to wait for the opening animation to finish before trapping focus. */
        this.delayFocusTrap = true;
        /**
         * Whether the dialog should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUEyQkg7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUE1QjtRQVlFLDJDQUEyQztRQUMzQyxTQUFJLEdBQWdCLFFBQVEsQ0FBQztRQUU3Qix5Q0FBeUM7UUFDekMsZUFBVSxHQUF1QixFQUFFLENBQUM7UUFFcEMseUNBQXlDO1FBQ3pDLGdCQUFXLEdBQWEsSUFBSSxDQUFDO1FBRTdCLHFDQUFxQztRQUNyQyxrQkFBYSxHQUF1QixFQUFFLENBQUM7UUFFdkMsc0ZBQXNGO1FBQ3RGLGlCQUFZLEdBQWEsS0FBSyxDQUFDO1FBRS9CLDJCQUEyQjtRQUMzQixVQUFLLEdBQVksRUFBRSxDQUFDO1FBRXBCLDRCQUE0QjtRQUM1QixXQUFNLEdBQVksRUFBRSxDQUFDO1FBUXJCLCtGQUErRjtRQUMvRixhQUFRLEdBQXFCLE1BQU0sQ0FBQztRQVFwQyxvREFBb0Q7UUFDcEQsU0FBSSxHQUFjLElBQUksQ0FBQztRQUt2QixtREFBbUQ7UUFDbkQsb0JBQWUsR0FBbUIsSUFBSSxDQUFDO1FBRXZDLGdEQUFnRDtRQUNoRCxtQkFBYyxHQUFtQixJQUFJLENBQUM7UUFFdEMsa0RBQWtEO1FBQ2xELGNBQVMsR0FBbUIsSUFBSSxDQUFDO1FBRWpDOzs7O1dBSUc7UUFDSCxjQUFTLEdBQXdDLGdCQUFnQixDQUFDO1FBRWxFOzs7V0FHRztRQUNILGlCQUFZLEdBQWEsSUFBSSxDQUFDO1FBRTlCLGlGQUFpRjtRQUNqRixtQkFBYyxHQUFhLElBQUksQ0FBQztRQUtoQzs7OztXQUlHO1FBQ0gsc0JBQWlCLEdBQWEsSUFBSSxDQUFDO1FBS25DLHlFQUF5RTtJQUMzRSxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcblxuLyoqIE9wdGlvbnMgZm9yIHdoZXJlIHRvIHNldCBmb2N1cyB0byBhdXRvbWF0aWNhbGx5IG9uIGRpYWxvZyBvcGVuICovXG5leHBvcnQgdHlwZSBBdXRvRm9jdXNUYXJnZXQgPSAnZGlhbG9nJyB8ICdmaXJzdC10YWJiYWJsZScgfCAnZmlyc3QtaGVhZGluZyc7XG5cbi8qKiBWYWxpZCBBUklBIHJvbGVzIGZvciBhIGRpYWxvZyBlbGVtZW50LiAqL1xuZXhwb3J0IHR5cGUgRGlhbG9nUm9sZSA9ICdkaWFsb2cnIHwgJ2FsZXJ0ZGlhbG9nJztcblxuLyoqIFBvc3NpYmxlIG92ZXJyaWRlcyBmb3IgYSBkaWFsb2cncyBwb3NpdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nUG9zaXRpb24ge1xuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyB0b3AgcG9zaXRpb24uICovXG4gIHRvcD86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyBib3R0b20gcG9zaXRpb24uICovXG4gIGJvdHRvbT86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyBsZWZ0IHBvc2l0aW9uLiAqL1xuICBsZWZ0Pzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIHJpZ2h0IHBvc2l0aW9uLiAqL1xuICByaWdodD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBvcGVuaW5nIGEgbW9kYWwgZGlhbG9nIHdpdGggdGhlIE1hdERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29uZmlnPEQgPSBhbnk+IHtcbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBhdHRhY2hlZCBjb21wb25lbnQgc2hvdWxkIGxpdmUgaW4gQW5ndWxhcidzICpsb2dpY2FsKiBjb21wb25lbnQgdHJlZS5cbiAgICogVGhpcyBhZmZlY3RzIHdoYXQgaXMgYXZhaWxhYmxlIGZvciBpbmplY3Rpb24gYW5kIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIG9yZGVyIGZvciB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbnRpYXRlZCBpbnNpZGUgb2YgdGhlIGRpYWxvZy4gVGhpcyBkb2VzIG5vdCBhZmZlY3Qgd2hlcmUgdGhlIGRpYWxvZ1xuICAgKiBjb250ZW50IHdpbGwgYmUgcmVuZGVyZWQuXG4gICAqL1xuICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZjtcblxuICAvKiogSUQgZm9yIHRoZSBkaWFsb2cuIElmIG9taXR0ZWQsIGEgdW5pcXVlIG9uZSB3aWxsIGJlIGdlbmVyYXRlZC4gKi9cbiAgaWQ/OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBBUklBIHJvbGUgb2YgdGhlIGRpYWxvZyBlbGVtZW50LiAqL1xuICByb2xlPzogRGlhbG9nUm9sZSA9ICdkaWFsb2cnO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkaWFsb2cgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW10gPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBjYW4gdXNlIGVzY2FwZSBvciBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AgdG8gY2xvc2UgdGhlIG1vZGFsLiAqL1xuICBkaXNhYmxlQ2xvc2U/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBkaWFsb2cuICovXG4gIHdpZHRoPzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgZGlhbG9nLiAqL1xuICBoZWlnaHQ/OiBzdHJpbmcgPSAnJztcblxuICAvKiogTWluLXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWluLWhlaWdodCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluSGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtd2lkdGggb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuIERlZmF1bHRzIHRvIDgwdncuICovXG4gIG1heFdpZHRoPzogbnVtYmVyIHwgc3RyaW5nID0gJzgwdncnO1xuXG4gIC8qKiBNYXgtaGVpZ2h0IG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFBvc2l0aW9uIG92ZXJyaWRlcy4gKi9cbiAgcG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbjtcblxuICAvKiogRGF0YSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBjaGlsZCBjb21wb25lbnQuICovXG4gIGRhdGE/OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gZm9yIHRoZSBkaWFsb2cncyBjb250ZW50LiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgZGVzY3JpYmVzIHRoZSBkaWFsb2cuICovXG4gIGFyaWFEZXNjcmliZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGxhYmVscyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBcmlhIGxhYmVsIHRvIGFzc2lnbiB0byB0aGUgZGlhbG9nIGVsZW1lbnQuICovXG4gIGFyaWFMYWJlbD86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0aGUgZGlhbG9nIHNob3VsZCBmb2N1cyBvbiBvcGVuLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgYm9vbGVhbiBvcHRpb24gZnJvbSBhdXRvRm9jdXMuIFVzZSBzdHJpbmcgb3JcbiAgICogQXV0b0ZvY3VzVGFyZ2V0IGluc3RlYWQuXG4gICAqL1xuICBhdXRvRm9jdXM/OiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuID0gJ2ZpcnN0LXRhYmJhYmxlJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCByZXN0b3JlIGZvY3VzIHRvIHRoZVxuICAgKiBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCwgYWZ0ZXIgaXQncyBjbG9zZWQuXG4gICAqL1xuICByZXN0b3JlRm9jdXM/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0byB3YWl0IGZvciB0aGUgb3BlbmluZyBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSB0cmFwcGluZyBmb2N1cy4gKi9cbiAgZGVsYXlGb2N1c1RyYXA/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogU2Nyb2xsIHN0cmF0ZWd5IHRvIGJlIHVzZWQgZm9yIHRoZSBkaWFsb2cuICovXG4gIHNjcm9sbFN0cmF0ZWd5PzogU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRpYWxvZyBzaG91bGQgY2xvc2Ugd2hlbiB0aGUgdXNlciBnb2VzIGJhY2t3YXJkcy9mb3J3YXJkcyBpbiBoaXN0b3J5LlxuICAgKiBOb3RlIHRoYXQgdGhpcyB1c3VhbGx5IGRvZXNuJ3QgaW5jbHVkZSBjbGlja2luZyBvbiBsaW5rcyAodW5sZXNzIHRoZSB1c2VyIGlzIHVzaW5nXG4gICAqIHRoZSBgSGFzaExvY2F0aW9uU3RyYXRlZ3lgKS5cbiAgICovXG4gIGNsb3NlT25OYXZpZ2F0aW9uPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEFsdGVybmF0ZSBgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyYCB0byB1c2Ugd2hlbiByZXNvbHZpbmcgdGhlIGFzc29jaWF0ZWQgY29tcG9uZW50LiAqL1xuICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI/OiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG5cbiAgLy8gVE9ETyhqZWxib3Vybik6IGFkZCBjb25maWd1cmF0aW9uIGZvciBsaWZlY3ljbGUgaG9va3MsIEFSSUEgbGFiZWxsaW5nLlxufVxuIl19