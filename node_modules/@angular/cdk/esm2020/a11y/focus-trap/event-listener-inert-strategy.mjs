/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Lightweight FocusTrapInertStrategy that adds a document focus event
 * listener to redirect focus back inside the FocusTrap.
 */
export class EventListenerFocusTrapInertStrategy {
    constructor() {
        /** Focus event handler. */
        this._listener = null;
    }
    /** Adds a document event listener that keeps focus inside the FocusTrap. */
    preventFocus(focusTrap) {
        // Ensure there's only one listener per document
        if (this._listener) {
            focusTrap._document.removeEventListener('focus', this._listener, true);
        }
        this._listener = (e) => this._trapFocus(focusTrap, e);
        focusTrap._ngZone.runOutsideAngular(() => {
            focusTrap._document.addEventListener('focus', this._listener, true);
        });
    }
    /** Removes the event listener added in preventFocus. */
    allowFocus(focusTrap) {
        if (!this._listener) {
            return;
        }
        focusTrap._document.removeEventListener('focus', this._listener, true);
        this._listener = null;
    }
    /**
     * Refocuses the first element in the FocusTrap if the focus event target was outside
     * the FocusTrap.
     *
     * This is an event listener callback. The event listener is added in runOutsideAngular,
     * so all this code runs outside Angular as well.
     */
    _trapFocus(focusTrap, event) {
        const target = event.target;
        const focusTrapRoot = focusTrap._element;
        // Don't refocus if target was in an overlay, because the overlay might be associated
        // with an element inside the FocusTrap, ex. mat-select.
        if (target && !focusTrapRoot.contains(target) && !target.closest?.('div.cdk-overlay-pane')) {
            // Some legacy FocusTrap usages have logic that focuses some element on the page
            // just before FocusTrap is destroyed. For backwards compatibility, wait
            // to be sure FocusTrap is still enabled before refocusing.
            setTimeout(() => {
                // Check whether focus wasn't put back into the focus trap while the timeout was pending.
                if (focusTrap.enabled && !focusTrapRoot.contains(focusTrap._document.activeElement)) {
                    focusTrap.focusFirstTabbableElement();
                }
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbGlzdGVuZXItaW5lcnQtc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvZm9jdXMtdHJhcC9ldmVudC1saXN0ZW5lci1pbmVydC1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFLSDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUNBQW1DO0lBQWhEO1FBQ0UsMkJBQTJCO1FBQ25CLGNBQVMsR0FBcUMsSUFBSSxDQUFDO0lBaUQ3RCxDQUFDO0lBL0NDLDRFQUE0RTtJQUM1RSxZQUFZLENBQUMsU0FBZ0M7UUFDM0MsZ0RBQWdEO1FBQ2hELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDdkMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsVUFBVSxDQUFDLFNBQWdDO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUNELFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLFVBQVUsQ0FBQyxTQUFnQyxFQUFFLEtBQWlCO1FBQ3BFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFxQixDQUFDO1FBQzNDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFFekMscUZBQXFGO1FBQ3JGLHdEQUF3RDtRQUN4RCxJQUFJLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRTtZQUMxRixnRkFBZ0Y7WUFDaEYsd0VBQXdFO1lBQ3hFLDJEQUEyRDtZQUMzRCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLHlGQUF5RjtnQkFDekYsSUFBSSxTQUFTLENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUNuRixTQUFTLENBQUMseUJBQXlCLEVBQUUsQ0FBQztpQkFDdkM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNUcmFwSW5lcnRTdHJhdGVneX0gZnJvbSAnLi9mb2N1cy10cmFwLWluZXJ0LXN0cmF0ZWd5JztcbmltcG9ydCB7Q29uZmlndXJhYmxlRm9jdXNUcmFwfSBmcm9tICcuL2NvbmZpZ3VyYWJsZS1mb2N1cy10cmFwJztcblxuLyoqXG4gKiBMaWdodHdlaWdodCBGb2N1c1RyYXBJbmVydFN0cmF0ZWd5IHRoYXQgYWRkcyBhIGRvY3VtZW50IGZvY3VzIGV2ZW50XG4gKiBsaXN0ZW5lciB0byByZWRpcmVjdCBmb2N1cyBiYWNrIGluc2lkZSB0aGUgRm9jdXNUcmFwLlxuICovXG5leHBvcnQgY2xhc3MgRXZlbnRMaXN0ZW5lckZvY3VzVHJhcEluZXJ0U3RyYXRlZ3kgaW1wbGVtZW50cyBGb2N1c1RyYXBJbmVydFN0cmF0ZWd5IHtcbiAgLyoqIEZvY3VzIGV2ZW50IGhhbmRsZXIuICovXG4gIHByaXZhdGUgX2xpc3RlbmVyOiAoKGU6IEZvY3VzRXZlbnQpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEFkZHMgYSBkb2N1bWVudCBldmVudCBsaXN0ZW5lciB0aGF0IGtlZXBzIGZvY3VzIGluc2lkZSB0aGUgRm9jdXNUcmFwLiAqL1xuICBwcmV2ZW50Rm9jdXMoZm9jdXNUcmFwOiBDb25maWd1cmFibGVGb2N1c1RyYXApOiB2b2lkIHtcbiAgICAvLyBFbnN1cmUgdGhlcmUncyBvbmx5IG9uZSBsaXN0ZW5lciBwZXIgZG9jdW1lbnRcbiAgICBpZiAodGhpcy5fbGlzdGVuZXIpIHtcbiAgICAgIGZvY3VzVHJhcC5fZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9saXN0ZW5lciEsIHRydWUpO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyID0gKGU6IEZvY3VzRXZlbnQpID0+IHRoaXMuX3RyYXBGb2N1cyhmb2N1c1RyYXAsIGUpO1xuICAgIGZvY3VzVHJhcC5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZvY3VzVHJhcC5fZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9saXN0ZW5lciEsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGV2ZW50IGxpc3RlbmVyIGFkZGVkIGluIHByZXZlbnRGb2N1cy4gKi9cbiAgYWxsb3dGb2N1cyhmb2N1c1RyYXA6IENvbmZpZ3VyYWJsZUZvY3VzVHJhcCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9jdXNUcmFwLl9kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX2xpc3RlbmVyISwgdHJ1ZSk7XG4gICAgdGhpcy5fbGlzdGVuZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZm9jdXNlcyB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgRm9jdXNUcmFwIGlmIHRoZSBmb2N1cyBldmVudCB0YXJnZXQgd2FzIG91dHNpZGVcbiAgICogdGhlIEZvY3VzVHJhcC5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBldmVudCBsaXN0ZW5lciBjYWxsYmFjay4gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIGFkZGVkIGluIHJ1bk91dHNpZGVBbmd1bGFyLFxuICAgKiBzbyBhbGwgdGhpcyBjb2RlIHJ1bnMgb3V0c2lkZSBBbmd1bGFyIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF90cmFwRm9jdXMoZm9jdXNUcmFwOiBDb25maWd1cmFibGVGb2N1c1RyYXAsIGV2ZW50OiBGb2N1c0V2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGZvY3VzVHJhcFJvb3QgPSBmb2N1c1RyYXAuX2VsZW1lbnQ7XG5cbiAgICAvLyBEb24ndCByZWZvY3VzIGlmIHRhcmdldCB3YXMgaW4gYW4gb3ZlcmxheSwgYmVjYXVzZSB0aGUgb3ZlcmxheSBtaWdodCBiZSBhc3NvY2lhdGVkXG4gICAgLy8gd2l0aCBhbiBlbGVtZW50IGluc2lkZSB0aGUgRm9jdXNUcmFwLCBleC4gbWF0LXNlbGVjdC5cbiAgICBpZiAodGFyZ2V0ICYmICFmb2N1c1RyYXBSb290LmNvbnRhaW5zKHRhcmdldCkgJiYgIXRhcmdldC5jbG9zZXN0Py4oJ2Rpdi5jZGstb3ZlcmxheS1wYW5lJykpIHtcbiAgICAgIC8vIFNvbWUgbGVnYWN5IEZvY3VzVHJhcCB1c2FnZXMgaGF2ZSBsb2dpYyB0aGF0IGZvY3VzZXMgc29tZSBlbGVtZW50IG9uIHRoZSBwYWdlXG4gICAgICAvLyBqdXN0IGJlZm9yZSBGb2N1c1RyYXAgaXMgZGVzdHJveWVkLiBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHdhaXRcbiAgICAgIC8vIHRvIGJlIHN1cmUgRm9jdXNUcmFwIGlzIHN0aWxsIGVuYWJsZWQgYmVmb3JlIHJlZm9jdXNpbmcuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBmb2N1cyB3YXNuJ3QgcHV0IGJhY2sgaW50byB0aGUgZm9jdXMgdHJhcCB3aGlsZSB0aGUgdGltZW91dCB3YXMgcGVuZGluZy5cbiAgICAgICAgaWYgKGZvY3VzVHJhcC5lbmFibGVkICYmICFmb2N1c1RyYXBSb290LmNvbnRhaW5zKGZvY3VzVHJhcC5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICBmb2N1c1RyYXAuZm9jdXNGaXJzdFRhYmJhYmxlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==