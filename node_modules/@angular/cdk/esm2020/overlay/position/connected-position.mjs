/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The points of the origin element and the overlay element to connect. */
export class ConnectionPositionPair {
    constructor(origin, overlay, 
    /** Offset along the X axis. */
    offsetX, 
    /** Offset along the Y axis. */
    offsetY, 
    /** Class(es) to be applied to the panel while this position is active. */
    panelClass) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.panelClass = panelClass;
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
}
/**
 * Set of properties regarding the position of the origin and overlay relative to the viewport
 * with respect to the containing Scrollable elements.
 *
 * The overlay and origin are clipped if any part of their bounding client rectangle exceeds the
 * bounds of any one of the strategy's Scrollable's bounding client rectangle.
 *
 * The overlay and origin are outside view if there is no overlap between their bounding client
 * rectangle and any one of the strategy's Scrollable's bounding client rectangle.
 *
 *       -----------                    -----------
 *       | outside |                    | clipped |
 *       |  view   |              --------------------------
 *       |         |              |     |         |        |
 *       ----------               |     -----------        |
 *  --------------------------    |                        |
 *  |                        |    |      Scrollable        |
 *  |                        |    |                        |
 *  |                        |     --------------------------
 *  |      Scrollable        |
 *  |                        |
 *  --------------------------
 *
 *  @docs-private
 */
export class ScrollingVisibility {
}
/** The change event emitted by the strategy when a fallback position is used. */
export class ConnectedOverlayPositionChange {
    constructor(
    /** The position used as a result of this change. */
    connectionPair, 
    /** @docs-private */
    scrollableViewProperties) {
        this.connectionPair = connectionPair;
        this.scrollableViewProperties = scrollableViewProperties;
    }
}
/**
 * Validates whether a vertical position property matches the expected values.
 * @param property Name of the property being validated.
 * @param value Value of the property being validated.
 * @docs-private
 */
export function validateVerticalPosition(property, value) {
    if (value !== 'top' && value !== 'bottom' && value !== 'center') {
        throw Error(`ConnectedPosition: Invalid ${property} "${value}". ` +
            `Expected "top", "bottom" or "center".`);
    }
}
/**
 * Validates whether a horizontal position property matches the expected values.
 * @param property Name of the property being validated.
 * @param value Value of the property being validated.
 * @docs-private
 */
export function validateHorizontalPosition(property, value) {
    if (value !== 'start' && value !== 'end' && value !== 'center') {
        throw Error(`ConnectedPosition: Invalid ${property} "${value}". ` +
            `Expected "start", "end" or "center".`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGVkLXBvc2l0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Bvc2l0aW9uL2Nvbm5lY3RlZC1wb3NpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFvQkgsMkVBQTJFO0FBQzNFLE1BQU0sT0FBTyxzQkFBc0I7SUFVakMsWUFDRSxNQUFnQyxFQUNoQyxPQUFrQztJQUNsQywrQkFBK0I7SUFDeEIsT0FBZ0I7SUFDdkIsK0JBQStCO0lBQ3hCLE9BQWdCO0lBQ3ZCLDBFQUEwRTtJQUNuRSxVQUE4QjtRQUo5QixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFFaEIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFFckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0NBSy9CO0FBRUQsaUZBQWlGO0FBQ2pGLE1BQU0sT0FBTyw4QkFBOEI7SUFDekM7SUFDRSxvREFBb0Q7SUFDN0MsY0FBc0M7SUFDN0Msb0JBQW9CO0lBQ2Isd0JBQTZDO1FBRjdDLG1CQUFjLEdBQWQsY0FBYyxDQUF3QjtRQUV0Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQXFCO0lBQ25ELENBQUM7Q0FDTDtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLHdCQUF3QixDQUFDLFFBQWdCLEVBQUUsS0FBNEI7SUFDckYsSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUMvRCxNQUFNLEtBQUssQ0FDVCw4QkFBOEIsUUFBUSxLQUFLLEtBQUssS0FBSztZQUNuRCx1Q0FBdUMsQ0FDMUMsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLDBCQUEwQixDQUFDLFFBQWdCLEVBQUUsS0FBOEI7SUFDekYsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM5RCxNQUFNLEtBQUssQ0FDVCw4QkFBOEIsUUFBUSxLQUFLLEtBQUssS0FBSztZQUNuRCxzQ0FBc0MsQ0FDekMsQ0FBQztLQUNIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogSG9yaXpvbnRhbCBkaW1lbnNpb24gb2YgYSBjb25uZWN0aW9uIHBvaW50IG9uIHRoZSBwZXJpbWV0ZXIgb2YgdGhlIG9yaWdpbiBvciBvdmVybGF5IGVsZW1lbnQuICovXG5leHBvcnQgdHlwZSBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyA9ICdzdGFydCcgfCAnY2VudGVyJyB8ICdlbmQnO1xuXG4vKiogVmVydGljYWwgZGltZW5zaW9uIG9mIGEgY29ubmVjdGlvbiBwb2ludCBvbiB0aGUgcGVyaW1ldGVyIG9mIHRoZSBvcmlnaW4gb3Igb3ZlcmxheSBlbGVtZW50LiAqL1xuZXhwb3J0IHR5cGUgVmVydGljYWxDb25uZWN0aW9uUG9zID0gJ3RvcCcgfCAnY2VudGVyJyB8ICdib3R0b20nO1xuXG4vKiogQSBjb25uZWN0aW9uIHBvaW50IG9uIHRoZSBvcmlnaW4gZWxlbWVudC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3JpZ2luQ29ubmVjdGlvblBvc2l0aW9uIHtcbiAgb3JpZ2luWDogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3M7XG4gIG9yaWdpblk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcztcbn1cblxuLyoqIEEgY29ubmVjdGlvbiBwb2ludCBvbiB0aGUgb3ZlcmxheSBlbGVtZW50LiAqL1xuZXhwb3J0IGludGVyZmFjZSBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uIHtcbiAgb3ZlcmxheVg6IEhvcml6b250YWxDb25uZWN0aW9uUG9zO1xuICBvdmVybGF5WTogVmVydGljYWxDb25uZWN0aW9uUG9zO1xufVxuXG4vKiogVGhlIHBvaW50cyBvZiB0aGUgb3JpZ2luIGVsZW1lbnQgYW5kIHRoZSBvdmVybGF5IGVsZW1lbnQgdG8gY29ubmVjdC4gKi9cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uUG9zaXRpb25QYWlyIHtcbiAgLyoqIFgtYXhpcyBhdHRhY2htZW50IHBvaW50IGZvciBjb25uZWN0ZWQgb3ZlcmxheSBvcmlnaW4uIENhbiBiZSAnc3RhcnQnLCAnZW5kJywgb3IgJ2NlbnRlcicuICovXG4gIG9yaWdpblg6IEhvcml6b250YWxDb25uZWN0aW9uUG9zO1xuICAvKiogWS1heGlzIGF0dGFjaG1lbnQgcG9pbnQgZm9yIGNvbm5lY3RlZCBvdmVybGF5IG9yaWdpbi4gQ2FuIGJlICd0b3AnLCAnYm90dG9tJywgb3IgJ2NlbnRlcicuICovXG4gIG9yaWdpblk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcztcbiAgLyoqIFgtYXhpcyBhdHRhY2htZW50IHBvaW50IGZvciBjb25uZWN0ZWQgb3ZlcmxheS4gQ2FuIGJlICdzdGFydCcsICdlbmQnLCBvciAnY2VudGVyJy4gKi9cbiAgb3ZlcmxheVg6IEhvcml6b250YWxDb25uZWN0aW9uUG9zO1xuICAvKiogWS1heGlzIGF0dGFjaG1lbnQgcG9pbnQgZm9yIGNvbm5lY3RlZCBvdmVybGF5LiBDYW4gYmUgJ3RvcCcsICdib3R0b20nLCBvciAnY2VudGVyJy4gKi9cbiAgb3ZlcmxheVk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvcmlnaW46IE9yaWdpbkNvbm5lY3Rpb25Qb3NpdGlvbixcbiAgICBvdmVybGF5OiBPdmVybGF5Q29ubmVjdGlvblBvc2l0aW9uLFxuICAgIC8qKiBPZmZzZXQgYWxvbmcgdGhlIFggYXhpcy4gKi9cbiAgICBwdWJsaWMgb2Zmc2V0WD86IG51bWJlcixcbiAgICAvKiogT2Zmc2V0IGFsb25nIHRoZSBZIGF4aXMuICovXG4gICAgcHVibGljIG9mZnNldFk/OiBudW1iZXIsXG4gICAgLyoqIENsYXNzKGVzKSB0byBiZSBhcHBsaWVkIHRvIHRoZSBwYW5lbCB3aGlsZSB0aGlzIHBvc2l0aW9uIGlzIGFjdGl2ZS4gKi9cbiAgICBwdWJsaWMgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdLFxuICApIHtcbiAgICB0aGlzLm9yaWdpblggPSBvcmlnaW4ub3JpZ2luWDtcbiAgICB0aGlzLm9yaWdpblkgPSBvcmlnaW4ub3JpZ2luWTtcbiAgICB0aGlzLm92ZXJsYXlYID0gb3ZlcmxheS5vdmVybGF5WDtcbiAgICB0aGlzLm92ZXJsYXlZID0gb3ZlcmxheS5vdmVybGF5WTtcbiAgfVxufVxuXG4vKipcbiAqIFNldCBvZiBwcm9wZXJ0aWVzIHJlZ2FyZGluZyB0aGUgcG9zaXRpb24gb2YgdGhlIG9yaWdpbiBhbmQgb3ZlcmxheSByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAqIHdpdGggcmVzcGVjdCB0byB0aGUgY29udGFpbmluZyBTY3JvbGxhYmxlIGVsZW1lbnRzLlxuICpcbiAqIFRoZSBvdmVybGF5IGFuZCBvcmlnaW4gYXJlIGNsaXBwZWQgaWYgYW55IHBhcnQgb2YgdGhlaXIgYm91bmRpbmcgY2xpZW50IHJlY3RhbmdsZSBleGNlZWRzIHRoZVxuICogYm91bmRzIG9mIGFueSBvbmUgb2YgdGhlIHN0cmF0ZWd5J3MgU2Nyb2xsYWJsZSdzIGJvdW5kaW5nIGNsaWVudCByZWN0YW5nbGUuXG4gKlxuICogVGhlIG92ZXJsYXkgYW5kIG9yaWdpbiBhcmUgb3V0c2lkZSB2aWV3IGlmIHRoZXJlIGlzIG5vIG92ZXJsYXAgYmV0d2VlbiB0aGVpciBib3VuZGluZyBjbGllbnRcbiAqIHJlY3RhbmdsZSBhbmQgYW55IG9uZSBvZiB0aGUgc3RyYXRlZ3kncyBTY3JvbGxhYmxlJ3MgYm91bmRpbmcgY2xpZW50IHJlY3RhbmdsZS5cbiAqXG4gKiAgICAgICAtLS0tLS0tLS0tLSAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS1cbiAqICAgICAgIHwgb3V0c2lkZSB8ICAgICAgICAgICAgICAgICAgICB8IGNsaXBwZWQgfFxuICogICAgICAgfCAgdmlldyAgIHwgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAgICAgICB8ICAgICAgICAgfCAgICAgICAgICAgICAgfCAgICAgfCAgICAgICAgIHwgICAgICAgIHxcbiAqICAgICAgIC0tLS0tLS0tLS0gICAgICAgICAgICAgICB8ICAgICAtLS0tLS0tLS0tLSAgICAgICAgfFxuICogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgIHwgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgfCAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgfCAgICAgIFNjcm9sbGFibGUgICAgICAgIHxcbiAqICB8ICAgICAgICAgICAgICAgICAgICAgICAgfCAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogIHwgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIHwgICAgICBTY3JvbGxhYmxlICAgICAgICB8XG4gKiAgfCAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTY3JvbGxpbmdWaXNpYmlsaXR5IHtcbiAgaXNPcmlnaW5DbGlwcGVkOiBib29sZWFuO1xuICBpc09yaWdpbk91dHNpZGVWaWV3OiBib29sZWFuO1xuICBpc092ZXJsYXlDbGlwcGVkOiBib29sZWFuO1xuICBpc092ZXJsYXlPdXRzaWRlVmlldzogYm9vbGVhbjtcbn1cblxuLyoqIFRoZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCBieSB0aGUgc3RyYXRlZ3kgd2hlbiBhIGZhbGxiYWNrIHBvc2l0aW9uIGlzIHVzZWQuICovXG5leHBvcnQgY2xhc3MgQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBwb3NpdGlvbiB1c2VkIGFzIGEgcmVzdWx0IG9mIHRoaXMgY2hhbmdlLiAqL1xuICAgIHB1YmxpYyBjb25uZWN0aW9uUGFpcjogQ29ubmVjdGlvblBvc2l0aW9uUGFpcixcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgIHB1YmxpYyBzY3JvbGxhYmxlVmlld1Byb3BlcnRpZXM6IFNjcm9sbGluZ1Zpc2liaWxpdHksXG4gICkge31cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgd2hldGhlciBhIHZlcnRpY2FsIHBvc2l0aW9uIHByb3BlcnR5IG1hdGNoZXMgdGhlIGV4cGVjdGVkIHZhbHVlcy5cbiAqIEBwYXJhbSBwcm9wZXJ0eSBOYW1lIG9mIHRoZSBwcm9wZXJ0eSBiZWluZyB2YWxpZGF0ZWQuXG4gKiBAcGFyYW0gdmFsdWUgVmFsdWUgb2YgdGhlIHByb3BlcnR5IGJlaW5nIHZhbGlkYXRlZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVmVydGljYWxQb3NpdGlvbihwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogVmVydGljYWxDb25uZWN0aW9uUG9zKSB7XG4gIGlmICh2YWx1ZSAhPT0gJ3RvcCcgJiYgdmFsdWUgIT09ICdib3R0b20nICYmIHZhbHVlICE9PSAnY2VudGVyJykge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgYENvbm5lY3RlZFBvc2l0aW9uOiBJbnZhbGlkICR7cHJvcGVydHl9IFwiJHt2YWx1ZX1cIi4gYCArXG4gICAgICAgIGBFeHBlY3RlZCBcInRvcFwiLCBcImJvdHRvbVwiIG9yIFwiY2VudGVyXCIuYCxcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHdoZXRoZXIgYSBob3Jpem9udGFsIHBvc2l0aW9uIHByb3BlcnR5IG1hdGNoZXMgdGhlIGV4cGVjdGVkIHZhbHVlcy5cbiAqIEBwYXJhbSBwcm9wZXJ0eSBOYW1lIG9mIHRoZSBwcm9wZXJ0eSBiZWluZyB2YWxpZGF0ZWQuXG4gKiBAcGFyYW0gdmFsdWUgVmFsdWUgb2YgdGhlIHByb3BlcnR5IGJlaW5nIHZhbGlkYXRlZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSG9yaXpvbnRhbFBvc2l0aW9uKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvcykge1xuICBpZiAodmFsdWUgIT09ICdzdGFydCcgJiYgdmFsdWUgIT09ICdlbmQnICYmIHZhbHVlICE9PSAnY2VudGVyJykge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgYENvbm5lY3RlZFBvc2l0aW9uOiBJbnZhbGlkICR7cHJvcGVydHl9IFwiJHt2YWx1ZX1cIi4gYCArXG4gICAgICAgIGBFeHBlY3RlZCBcInN0YXJ0XCIsIFwiZW5kXCIgb3IgXCJjZW50ZXJcIi5gLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==