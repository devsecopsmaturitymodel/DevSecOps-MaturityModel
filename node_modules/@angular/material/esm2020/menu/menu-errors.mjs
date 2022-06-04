/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Throws an exception for the case when menu trigger doesn't have a valid mat-menu instance
 * @docs-private
 */
export function throwMatMenuMissingError() {
    throw Error(`matMenuTriggerFor: must pass in an mat-menu instance.

    Example:
      <mat-menu #menu="matMenu"></mat-menu>
      <button [matMenuTriggerFor]="menu"></button>`);
}
/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
export function throwMatMenuInvalidPositionX() {
    throw Error(`xPosition value must be either 'before' or after'.
      Example: <mat-menu xPosition="before" #menu="matMenu"></mat-menu>`);
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
export function throwMatMenuInvalidPositionY() {
    throw Error(`yPosition value must be either 'above' or below'.
      Example: <mat-menu yPosition="above" #menu="matMenu"></mat-menu>`);
}
/**
 * Throws an exception for the case when a menu is assigned
 * to a trigger that is placed inside the same menu.
 * @docs-private
 */
export function throwMatMenuRecursiveError() {
    throw Error(`matMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is ` +
        `not a parent of the trigger or move the trigger outside of the menu.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51LWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsd0JBQXdCO0lBQ3RDLE1BQU0sS0FBSyxDQUFDOzs7O21EQUlxQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE1BQU0sS0FBSyxDQUFDO3dFQUMwRCxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE1BQU0sS0FBSyxDQUFDO3VFQUN5RCxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsMEJBQTBCO0lBQ3hDLE1BQU0sS0FBSyxDQUNULGdGQUFnRjtRQUM5RSxzRUFBc0UsQ0FDekUsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGZvciB0aGUgY2FzZSB3aGVuIG1lbnUgdHJpZ2dlciBkb2Vzbid0IGhhdmUgYSB2YWxpZCBtYXQtbWVudSBpbnN0YW5jZVxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXRNZW51TWlzc2luZ0Vycm9yKCkge1xuICB0aHJvdyBFcnJvcihgbWF0TWVudVRyaWdnZXJGb3I6IG11c3QgcGFzcyBpbiBhbiBtYXQtbWVudSBpbnN0YW5jZS5cblxuICAgIEV4YW1wbGU6XG4gICAgICA8bWF0LW1lbnUgI21lbnU9XCJtYXRNZW51XCI+PC9tYXQtbWVudT5cbiAgICAgIDxidXR0b24gW21hdE1lbnVUcmlnZ2VyRm9yXT1cIm1lbnVcIj48L2J1dHRvbj5gKTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGZvciB0aGUgY2FzZSB3aGVuIG1lbnUncyB4LXBvc2l0aW9uIHZhbHVlIGlzbid0IHZhbGlkLlxuICogSW4gb3RoZXIgd29yZHMsIGl0IGRvZXNuJ3QgbWF0Y2ggJ2JlZm9yZScgb3IgJ2FmdGVyJy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgoKSB7XG4gIHRocm93IEVycm9yKGB4UG9zaXRpb24gdmFsdWUgbXVzdCBiZSBlaXRoZXIgJ2JlZm9yZScgb3IgYWZ0ZXInLlxuICAgICAgRXhhbXBsZTogPG1hdC1tZW51IHhQb3NpdGlvbj1cImJlZm9yZVwiICNtZW51PVwibWF0TWVudVwiPjwvbWF0LW1lbnU+YCk7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBtZW51J3MgeS1wb3NpdGlvbiB2YWx1ZSBpc24ndCB2YWxpZC5cbiAqIEluIG90aGVyIHdvcmRzLCBpdCBkb2Vzbid0IG1hdGNoICdhYm92ZScgb3IgJ2JlbG93Jy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblkoKSB7XG4gIHRocm93IEVycm9yKGB5UG9zaXRpb24gdmFsdWUgbXVzdCBiZSBlaXRoZXIgJ2Fib3ZlJyBvciBiZWxvdycuXG4gICAgICBFeGFtcGxlOiA8bWF0LW1lbnUgeVBvc2l0aW9uPVwiYWJvdmVcIiAjbWVudT1cIm1hdE1lbnVcIj48L21hdC1tZW51PmApO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gYSBtZW51IGlzIGFzc2lnbmVkXG4gKiB0byBhIHRyaWdnZXIgdGhhdCBpcyBwbGFjZWQgaW5zaWRlIHRoZSBzYW1lIG1lbnUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdE1lbnVSZWN1cnNpdmVFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoXG4gICAgYG1hdE1lbnVUcmlnZ2VyRm9yOiBtZW51IGNhbm5vdCBjb250YWluIGl0cyBvd24gdHJpZ2dlci4gQXNzaWduIGEgbWVudSB0aGF0IGlzIGAgK1xuICAgICAgYG5vdCBhIHBhcmVudCBvZiB0aGUgdHJpZ2dlciBvciBtb3ZlIHRoZSB0cmlnZ2VyIG91dHNpZGUgb2YgdGhlIG1lbnUuYCxcbiAgKTtcbn1cbiJdfQ==