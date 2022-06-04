/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Shallow-extends a stylesheet object with another stylesheet-like object.
 * Note that the keys in `source` have to be dash-cased.
 * @docs-private
 */
export function extendStyles(dest, source, importantProperties) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            const value = source[key];
            if (value) {
                dest.setProperty(key, value, importantProperties?.has(key) ? 'important' : '');
            }
            else {
                dest.removeProperty(key);
            }
        }
    }
    return dest;
}
/**
 * Toggles whether the native drag interactions should be enabled for an element.
 * @param element Element on which to toggle the drag interactions.
 * @param enable Whether the drag interactions should be enabled.
 * @docs-private
 */
export function toggleNativeDragInteractions(element, enable) {
    const userSelect = enable ? '' : 'none';
    extendStyles(element.style, {
        'touch-action': enable ? '' : 'none',
        '-webkit-user-drag': enable ? '' : 'none',
        '-webkit-tap-highlight-color': enable ? '' : 'transparent',
        'user-select': userSelect,
        '-ms-user-select': userSelect,
        '-webkit-user-select': userSelect,
        '-moz-user-select': userSelect,
    });
}
/**
 * Toggles whether an element is visible while preserving its dimensions.
 * @param element Element whose visibility to toggle
 * @param enable Whether the element should be visible.
 * @param importantProperties Properties to be set as `!important`.
 * @docs-private
 */
export function toggleVisibility(element, enable, importantProperties) {
    extendStyles(element.style, {
        position: enable ? '' : 'fixed',
        top: enable ? '' : '0',
        opacity: enable ? '' : '0',
        left: enable ? '' : '-999em',
    }, importantProperties);
}
/**
 * Combines a transform string with an optional other transform
 * that exited before the base transform was applied.
 */
export function combineTransforms(transform, initialTransform) {
    return initialTransform && initialTransform != 'none'
        ? transform + ' ' + initialTransform
        : transform;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1zdHlsaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9kcmFnLWRyb3AvZHJhZy1zdHlsaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQVlIOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixJQUF5QixFQUN6QixNQUE4QixFQUM5QixtQkFBaUM7SUFFakMsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7UUFDdEIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUxQixJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUI7U0FDRjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsNEJBQTRCLENBQUMsT0FBb0IsRUFBRSxNQUFlO0lBQ2hGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFeEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7UUFDMUIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQ3BDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQ3pDLDZCQUE2QixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQzFELGFBQWEsRUFBRSxVQUFVO1FBQ3pCLGlCQUFpQixFQUFFLFVBQVU7UUFDN0IscUJBQXFCLEVBQUUsVUFBVTtRQUNqQyxrQkFBa0IsRUFBRSxVQUFVO0tBQy9CLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLE9BQW9CLEVBQ3BCLE1BQWUsRUFDZixtQkFBaUM7SUFFakMsWUFBWSxDQUNWLE9BQU8sQ0FBQyxLQUFLLEVBQ2I7UUFDRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU87UUFDL0IsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHO1FBQ3RCLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRztRQUMxQixJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7S0FDN0IsRUFDRCxtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsU0FBaUIsRUFBRSxnQkFBeUI7SUFDNUUsT0FBTyxnQkFBZ0IsSUFBSSxnQkFBZ0IsSUFBSSxNQUFNO1FBQ25ELENBQUMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLGdCQUFnQjtRQUNwQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBFeHRlbmRlZCBDU1NTdHlsZURlY2xhcmF0aW9uIHRoYXQgaW5jbHVkZXMgYSBjb3VwbGUgb2YgZHJhZy1yZWxhdGVkXG4gKiBwcm9wZXJ0aWVzIHRoYXQgYXJlbid0IGluIHRoZSBidWlsdC1pbiBUUyB0eXBpbmdzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERyYWdDU1NTdHlsZURlY2xhcmF0aW9uIGV4dGVuZHMgQ1NTU3R5bGVEZWNsYXJhdGlvbiB7XG4gIG1zU2Nyb2xsU25hcFR5cGU6IHN0cmluZztcbiAgc2Nyb2xsU25hcFR5cGU6IHN0cmluZztcbiAgd2Via2l0VGFwSGlnaGxpZ2h0Q29sb3I6IHN0cmluZztcbn1cblxuLyoqXG4gKiBTaGFsbG93LWV4dGVuZHMgYSBzdHlsZXNoZWV0IG9iamVjdCB3aXRoIGFub3RoZXIgc3R5bGVzaGVldC1saWtlIG9iamVjdC5cbiAqIE5vdGUgdGhhdCB0aGUga2V5cyBpbiBgc291cmNlYCBoYXZlIHRvIGJlIGRhc2gtY2FzZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmRTdHlsZXMoXG4gIGRlc3Q6IENTU1N0eWxlRGVjbGFyYXRpb24sXG4gIHNvdXJjZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgaW1wb3J0YW50UHJvcGVydGllcz86IFNldDxzdHJpbmc+LFxuKSB7XG4gIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gc291cmNlW2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBkZXN0LnNldFByb3BlcnR5KGtleSwgdmFsdWUsIGltcG9ydGFudFByb3BlcnRpZXM/LmhhcyhrZXkpID8gJ2ltcG9ydGFudCcgOiAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXN0LnJlbW92ZVByb3BlcnR5KGtleSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbi8qKlxuICogVG9nZ2xlcyB3aGV0aGVyIHRoZSBuYXRpdmUgZHJhZyBpbnRlcmFjdGlvbnMgc2hvdWxkIGJlIGVuYWJsZWQgZm9yIGFuIGVsZW1lbnQuXG4gKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IG9uIHdoaWNoIHRvIHRvZ2dsZSB0aGUgZHJhZyBpbnRlcmFjdGlvbnMuXG4gKiBAcGFyYW0gZW5hYmxlIFdoZXRoZXIgdGhlIGRyYWcgaW50ZXJhY3Rpb25zIHNob3VsZCBiZSBlbmFibGVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlTmF0aXZlRHJhZ0ludGVyYWN0aW9ucyhlbGVtZW50OiBIVE1MRWxlbWVudCwgZW5hYmxlOiBib29sZWFuKSB7XG4gIGNvbnN0IHVzZXJTZWxlY3QgPSBlbmFibGUgPyAnJyA6ICdub25lJztcblxuICBleHRlbmRTdHlsZXMoZWxlbWVudC5zdHlsZSwge1xuICAgICd0b3VjaC1hY3Rpb24nOiBlbmFibGUgPyAnJyA6ICdub25lJyxcbiAgICAnLXdlYmtpdC11c2VyLWRyYWcnOiBlbmFibGUgPyAnJyA6ICdub25lJyxcbiAgICAnLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yJzogZW5hYmxlID8gJycgOiAndHJhbnNwYXJlbnQnLFxuICAgICd1c2VyLXNlbGVjdCc6IHVzZXJTZWxlY3QsXG4gICAgJy1tcy11c2VyLXNlbGVjdCc6IHVzZXJTZWxlY3QsXG4gICAgJy13ZWJraXQtdXNlci1zZWxlY3QnOiB1c2VyU2VsZWN0LFxuICAgICctbW96LXVzZXItc2VsZWN0JzogdXNlclNlbGVjdCxcbiAgfSk7XG59XG5cbi8qKlxuICogVG9nZ2xlcyB3aGV0aGVyIGFuIGVsZW1lbnQgaXMgdmlzaWJsZSB3aGlsZSBwcmVzZXJ2aW5nIGl0cyBkaW1lbnNpb25zLlxuICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCB3aG9zZSB2aXNpYmlsaXR5IHRvIHRvZ2dsZVxuICogQHBhcmFtIGVuYWJsZSBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBiZSB2aXNpYmxlLlxuICogQHBhcmFtIGltcG9ydGFudFByb3BlcnRpZXMgUHJvcGVydGllcyB0byBiZSBzZXQgYXMgYCFpbXBvcnRhbnRgLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlVmlzaWJpbGl0eShcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gIGVuYWJsZTogYm9vbGVhbixcbiAgaW1wb3J0YW50UHJvcGVydGllcz86IFNldDxzdHJpbmc+LFxuKSB7XG4gIGV4dGVuZFN0eWxlcyhcbiAgICBlbGVtZW50LnN0eWxlLFxuICAgIHtcbiAgICAgIHBvc2l0aW9uOiBlbmFibGUgPyAnJyA6ICdmaXhlZCcsXG4gICAgICB0b3A6IGVuYWJsZSA/ICcnIDogJzAnLFxuICAgICAgb3BhY2l0eTogZW5hYmxlID8gJycgOiAnMCcsXG4gICAgICBsZWZ0OiBlbmFibGUgPyAnJyA6ICctOTk5ZW0nLFxuICAgIH0sXG4gICAgaW1wb3J0YW50UHJvcGVydGllcyxcbiAgKTtcbn1cblxuLyoqXG4gKiBDb21iaW5lcyBhIHRyYW5zZm9ybSBzdHJpbmcgd2l0aCBhbiBvcHRpb25hbCBvdGhlciB0cmFuc2Zvcm1cbiAqIHRoYXQgZXhpdGVkIGJlZm9yZSB0aGUgYmFzZSB0cmFuc2Zvcm0gd2FzIGFwcGxpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lVHJhbnNmb3Jtcyh0cmFuc2Zvcm06IHN0cmluZywgaW5pdGlhbFRyYW5zZm9ybT86IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBpbml0aWFsVHJhbnNmb3JtICYmIGluaXRpYWxUcmFuc2Zvcm0gIT0gJ25vbmUnXG4gICAgPyB0cmFuc2Zvcm0gKyAnICcgKyBpbml0aWFsVHJhbnNmb3JtXG4gICAgOiB0cmFuc2Zvcm07XG59XG4iXX0=