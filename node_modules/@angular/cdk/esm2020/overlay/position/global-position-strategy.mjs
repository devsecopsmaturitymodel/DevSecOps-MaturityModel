/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Class to be added to the overlay pane wrapper. */
const wrapperClass = 'cdk-global-overlay-wrapper';
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport. We use flexbox, instead of
 * transforms, in order to avoid issues with subpixel rendering which can cause the
 * element to become blurry.
 */
export class GlobalPositionStrategy {
    constructor() {
        this._cssPosition = 'static';
        this._topOffset = '';
        this._bottomOffset = '';
        this._leftOffset = '';
        this._rightOffset = '';
        this._alignItems = '';
        this._justifyContent = '';
        this._width = '';
        this._height = '';
    }
    attach(overlayRef) {
        const config = overlayRef.getConfig();
        this._overlayRef = overlayRef;
        if (this._width && !config.width) {
            overlayRef.updateSize({ width: this._width });
        }
        if (this._height && !config.height) {
            overlayRef.updateSize({ height: this._height });
        }
        overlayRef.hostElement.classList.add(wrapperClass);
        this._isDisposed = false;
    }
    /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param value New top offset.
     */
    top(value = '') {
        this._bottomOffset = '';
        this._topOffset = value;
        this._alignItems = 'flex-start';
        return this;
    }
    /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param value New left offset.
     */
    left(value = '') {
        this._rightOffset = '';
        this._leftOffset = value;
        this._justifyContent = 'flex-start';
        return this;
    }
    /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param value New bottom offset.
     */
    bottom(value = '') {
        this._topOffset = '';
        this._bottomOffset = value;
        this._alignItems = 'flex-end';
        return this;
    }
    /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param value New right offset.
     */
    right(value = '') {
        this._leftOffset = '';
        this._rightOffset = value;
        this._justifyContent = 'flex-end';
        return this;
    }
    /**
     * Sets the overlay width and clears any previously set width.
     * @param value New width for the overlay
     * @deprecated Pass the `width` through the `OverlayConfig`.
     * @breaking-change 8.0.0
     */
    width(value = '') {
        if (this._overlayRef) {
            this._overlayRef.updateSize({ width: value });
        }
        else {
            this._width = value;
        }
        return this;
    }
    /**
     * Sets the overlay height and clears any previously set height.
     * @param value New height for the overlay
     * @deprecated Pass the `height` through the `OverlayConfig`.
     * @breaking-change 8.0.0
     */
    height(value = '') {
        if (this._overlayRef) {
            this._overlayRef.updateSize({ height: value });
        }
        else {
            this._height = value;
        }
        return this;
    }
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param offset Overlay offset from the horizontal center.
     */
    centerHorizontally(offset = '') {
        this.left(offset);
        this._justifyContent = 'center';
        return this;
    }
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param offset Overlay offset from the vertical center.
     */
    centerVertically(offset = '') {
        this.top(offset);
        this._alignItems = 'center';
        return this;
    }
    /**
     * Apply the position to the element.
     * @docs-private
     */
    apply() {
        // Since the overlay ref applies the strategy asynchronously, it could
        // have been disposed before it ends up being applied. If that is the
        // case, we shouldn't do anything.
        if (!this._overlayRef || !this._overlayRef.hasAttached()) {
            return;
        }
        const styles = this._overlayRef.overlayElement.style;
        const parentStyles = this._overlayRef.hostElement.style;
        const config = this._overlayRef.getConfig();
        const { width, height, maxWidth, maxHeight } = config;
        const shouldBeFlushHorizontally = (width === '100%' || width === '100vw') &&
            (!maxWidth || maxWidth === '100%' || maxWidth === '100vw');
        const shouldBeFlushVertically = (height === '100%' || height === '100vh') &&
            (!maxHeight || maxHeight === '100%' || maxHeight === '100vh');
        styles.position = this._cssPosition;
        styles.marginLeft = shouldBeFlushHorizontally ? '0' : this._leftOffset;
        styles.marginTop = shouldBeFlushVertically ? '0' : this._topOffset;
        styles.marginBottom = this._bottomOffset;
        styles.marginRight = this._rightOffset;
        if (shouldBeFlushHorizontally) {
            parentStyles.justifyContent = 'flex-start';
        }
        else if (this._justifyContent === 'center') {
            parentStyles.justifyContent = 'center';
        }
        else if (this._overlayRef.getConfig().direction === 'rtl') {
            // In RTL the browser will invert `flex-start` and `flex-end` automatically, but we
            // don't want that because our positioning is explicitly `left` and `right`, hence
            // why we do another inversion to ensure that the overlay stays in the same position.
            // TODO: reconsider this if we add `start` and `end` methods.
            if (this._justifyContent === 'flex-start') {
                parentStyles.justifyContent = 'flex-end';
            }
            else if (this._justifyContent === 'flex-end') {
                parentStyles.justifyContent = 'flex-start';
            }
        }
        else {
            parentStyles.justifyContent = this._justifyContent;
        }
        parentStyles.alignItems = shouldBeFlushVertically ? 'flex-start' : this._alignItems;
    }
    /**
     * Cleans up the DOM changes from the position strategy.
     * @docs-private
     */
    dispose() {
        if (this._isDisposed || !this._overlayRef) {
            return;
        }
        const styles = this._overlayRef.overlayElement.style;
        const parent = this._overlayRef.hostElement;
        const parentStyles = parent.style;
        parent.classList.remove(wrapperClass);
        parentStyles.justifyContent =
            parentStyles.alignItems =
                styles.marginTop =
                    styles.marginBottom =
                        styles.marginLeft =
                            styles.marginRight =
                                styles.position =
                                    '';
        this._overlayRef = null;
        this._isDisposed = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLXBvc2l0aW9uLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Bvc2l0aW9uL2dsb2JhbC1wb3NpdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFLSCxxREFBcUQ7QUFDckQsTUFBTSxZQUFZLEdBQUcsNEJBQTRCLENBQUM7QUFFbEQ7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sc0JBQXNCO0lBQW5DO1FBR1UsaUJBQVksR0FBVyxRQUFRLENBQUM7UUFDaEMsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixvQkFBZSxHQUFXLEVBQUUsQ0FBQztRQUM3QixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLFlBQU8sR0FBVyxFQUFFLENBQUM7SUFvTS9CLENBQUM7SUFqTUMsTUFBTSxDQUFDLFVBQTRCO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUV0QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7U0FDN0M7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2xDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7U0FDL0M7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YixFQUFFLENBQUM7UUFFUCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQb3NpdGlvblN0cmF0ZWd5fSBmcm9tICcuL3Bvc2l0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7T3ZlcmxheVJlZmVyZW5jZX0gZnJvbSAnLi4vb3ZlcmxheS1yZWZlcmVuY2UnO1xuXG4vKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgcGFuZSB3cmFwcGVyLiAqL1xuY29uc3Qgd3JhcHBlckNsYXNzID0gJ2Nkay1nbG9iYWwtb3ZlcmxheS13cmFwcGVyJztcblxuLyoqXG4gKiBBIHN0cmF0ZWd5IGZvciBwb3NpdGlvbmluZyBvdmVybGF5cy4gVXNpbmcgdGhpcyBzdHJhdGVneSwgYW4gb3ZlcmxheSBpcyBnaXZlbiBhblxuICogZXhwbGljaXQgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGJyb3dzZXIncyB2aWV3cG9ydC4gV2UgdXNlIGZsZXhib3gsIGluc3RlYWQgb2ZcbiAqIHRyYW5zZm9ybXMsIGluIG9yZGVyIHRvIGF2b2lkIGlzc3VlcyB3aXRoIHN1YnBpeGVsIHJlbmRlcmluZyB3aGljaCBjYW4gY2F1c2UgdGhlXG4gKiBlbGVtZW50IHRvIGJlY29tZSBibHVycnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5IGltcGxlbWVudHMgUG9zaXRpb25TdHJhdGVneSB7XG4gIC8qKiBUaGUgb3ZlcmxheSB0byB3aGljaCB0aGlzIHN0cmF0ZWd5IGlzIGF0dGFjaGVkLiAqL1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmZXJlbmNlO1xuICBwcml2YXRlIF9jc3NQb3NpdGlvbjogc3RyaW5nID0gJ3N0YXRpYyc7XG4gIHByaXZhdGUgX3RvcE9mZnNldDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgX2JvdHRvbU9mZnNldDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgX2xlZnRPZmZzZXQ6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIF9yaWdodE9mZnNldDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgX2FsaWduSXRlbXM6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIF9qdXN0aWZ5Q29udGVudDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgX3dpZHRoOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBfaGVpZ2h0OiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBfaXNEaXNwb3NlZDogYm9vbGVhbjtcblxuICBhdHRhY2gob3ZlcmxheVJlZjogT3ZlcmxheVJlZmVyZW5jZSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbmZpZyA9IG92ZXJsYXlSZWYuZ2V0Q29uZmlnKCk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcblxuICAgIGlmICh0aGlzLl93aWR0aCAmJiAhY29uZmlnLndpZHRoKSB7XG4gICAgICBvdmVybGF5UmVmLnVwZGF0ZVNpemUoe3dpZHRoOiB0aGlzLl93aWR0aH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9oZWlnaHQgJiYgIWNvbmZpZy5oZWlnaHQpIHtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7aGVpZ2h0OiB0aGlzLl9oZWlnaHR9KTtcbiAgICB9XG5cbiAgICBvdmVybGF5UmVmLmhvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQod3JhcHBlckNsYXNzKTtcbiAgICB0aGlzLl9pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5LiBDbGVhcnMgYW55IHByZXZpb3VzbHkgc2V0IHZlcnRpY2FsIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHRvcCBvZmZzZXQuXG4gICAqL1xuICB0b3AodmFsdWU6IHN0cmluZyA9ICcnKTogdGhpcyB7XG4gICAgdGhpcy5fYm90dG9tT2Zmc2V0ID0gJyc7XG4gICAgdGhpcy5fdG9wT2Zmc2V0ID0gdmFsdWU7XG4gICAgdGhpcy5fYWxpZ25JdGVtcyA9ICdmbGV4LXN0YXJ0JztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBsZWZ0IHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5LiBDbGVhcnMgYW55IHByZXZpb3VzbHkgc2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgbGVmdCBvZmZzZXQuXG4gICAqL1xuICBsZWZ0KHZhbHVlOiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMuX3JpZ2h0T2Zmc2V0ID0gJyc7XG4gICAgdGhpcy5fbGVmdE9mZnNldCA9IHZhbHVlO1xuICAgIHRoaXMuX2p1c3RpZnlDb250ZW50ID0gJ2ZsZXgtc3RhcnQnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGJvdHRvbSBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheS4gQ2xlYXJzIGFueSBwcmV2aW91c2x5IHNldCB2ZXJ0aWNhbCBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHZhbHVlIE5ldyBib3R0b20gb2Zmc2V0LlxuICAgKi9cbiAgYm90dG9tKHZhbHVlOiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMuX3RvcE9mZnNldCA9ICcnO1xuICAgIHRoaXMuX2JvdHRvbU9mZnNldCA9IHZhbHVlO1xuICAgIHRoaXMuX2FsaWduSXRlbXMgPSAnZmxleC1lbmQnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJpZ2h0IHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5LiBDbGVhcnMgYW55IHByZXZpb3VzbHkgc2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgcmlnaHQgb2Zmc2V0LlxuICAgKi9cbiAgcmlnaHQodmFsdWU6IHN0cmluZyA9ICcnKTogdGhpcyB7XG4gICAgdGhpcy5fbGVmdE9mZnNldCA9ICcnO1xuICAgIHRoaXMuX3JpZ2h0T2Zmc2V0ID0gdmFsdWU7XG4gICAgdGhpcy5fanVzdGlmeUNvbnRlbnQgPSAnZmxleC1lbmQnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG92ZXJsYXkgd2lkdGggYW5kIGNsZWFycyBhbnkgcHJldmlvdXNseSBzZXQgd2lkdGguXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgd2lkdGggZm9yIHRoZSBvdmVybGF5XG4gICAqIEBkZXByZWNhdGVkIFBhc3MgdGhlIGB3aWR0aGAgdGhyb3VnaCB0aGUgYE92ZXJsYXlDb25maWdgLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICB3aWR0aCh2YWx1ZTogc3RyaW5nID0gJycpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVTaXplKHt3aWR0aDogdmFsdWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvdmVybGF5IGhlaWdodCBhbmQgY2xlYXJzIGFueSBwcmV2aW91c2x5IHNldCBoZWlnaHQuXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgaGVpZ2h0IGZvciB0aGUgb3ZlcmxheVxuICAgKiBAZGVwcmVjYXRlZCBQYXNzIHRoZSBgaGVpZ2h0YCB0aHJvdWdoIHRoZSBgT3ZlcmxheUNvbmZpZ2AuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGhlaWdodCh2YWx1ZTogc3RyaW5nID0gJycpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVTaXplKHtoZWlnaHQ6IHZhbHVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENlbnRlcnMgdGhlIG92ZXJsYXkgaG9yaXpvbnRhbGx5IHdpdGggYW4gb3B0aW9uYWwgb2Zmc2V0LlxuICAgKiBDbGVhcnMgYW55IHByZXZpb3VzbHkgc2V0IGhvcml6b250YWwgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBvZmZzZXQgT3ZlcmxheSBvZmZzZXQgZnJvbSB0aGUgaG9yaXpvbnRhbCBjZW50ZXIuXG4gICAqL1xuICBjZW50ZXJIb3Jpem9udGFsbHkob2Zmc2V0OiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMubGVmdChvZmZzZXQpO1xuICAgIHRoaXMuX2p1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2VudGVycyB0aGUgb3ZlcmxheSB2ZXJ0aWNhbGx5IHdpdGggYW4gb3B0aW9uYWwgb2Zmc2V0LlxuICAgKiBDbGVhcnMgYW55IHByZXZpb3VzbHkgc2V0IHZlcnRpY2FsIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0IE92ZXJsYXkgb2Zmc2V0IGZyb20gdGhlIHZlcnRpY2FsIGNlbnRlci5cbiAgICovXG4gIGNlbnRlclZlcnRpY2FsbHkob2Zmc2V0OiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMudG9wKG9mZnNldCk7XG4gICAgdGhpcy5fYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBwb3NpdGlvbiB0byB0aGUgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXBwbHkoKTogdm9pZCB7XG4gICAgLy8gU2luY2UgdGhlIG92ZXJsYXkgcmVmIGFwcGxpZXMgdGhlIHN0cmF0ZWd5IGFzeW5jaHJvbm91c2x5LCBpdCBjb3VsZFxuICAgIC8vIGhhdmUgYmVlbiBkaXNwb3NlZCBiZWZvcmUgaXQgZW5kcyB1cCBiZWluZyBhcHBsaWVkLiBJZiB0aGF0IGlzIHRoZVxuICAgIC8vIGNhc2UsIHdlIHNob3VsZG4ndCBkbyBhbnl0aGluZy5cbiAgICBpZiAoIXRoaXMuX292ZXJsYXlSZWYgfHwgIXRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuc3R5bGU7XG4gICAgY29uc3QgcGFyZW50U3R5bGVzID0gdGhpcy5fb3ZlcmxheVJlZi5ob3N0RWxlbWVudC5zdHlsZTtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBtYXhXaWR0aCwgbWF4SGVpZ2h0fSA9IGNvbmZpZztcbiAgICBjb25zdCBzaG91bGRCZUZsdXNoSG9yaXpvbnRhbGx5ID1cbiAgICAgICh3aWR0aCA9PT0gJzEwMCUnIHx8IHdpZHRoID09PSAnMTAwdncnKSAmJlxuICAgICAgKCFtYXhXaWR0aCB8fCBtYXhXaWR0aCA9PT0gJzEwMCUnIHx8IG1heFdpZHRoID09PSAnMTAwdncnKTtcbiAgICBjb25zdCBzaG91bGRCZUZsdXNoVmVydGljYWxseSA9XG4gICAgICAoaGVpZ2h0ID09PSAnMTAwJScgfHwgaGVpZ2h0ID09PSAnMTAwdmgnKSAmJlxuICAgICAgKCFtYXhIZWlnaHQgfHwgbWF4SGVpZ2h0ID09PSAnMTAwJScgfHwgbWF4SGVpZ2h0ID09PSAnMTAwdmgnKTtcblxuICAgIHN0eWxlcy5wb3NpdGlvbiA9IHRoaXMuX2Nzc1Bvc2l0aW9uO1xuICAgIHN0eWxlcy5tYXJnaW5MZWZ0ID0gc2hvdWxkQmVGbHVzaEhvcml6b250YWxseSA/ICcwJyA6IHRoaXMuX2xlZnRPZmZzZXQ7XG4gICAgc3R5bGVzLm1hcmdpblRvcCA9IHNob3VsZEJlRmx1c2hWZXJ0aWNhbGx5ID8gJzAnIDogdGhpcy5fdG9wT2Zmc2V0O1xuICAgIHN0eWxlcy5tYXJnaW5Cb3R0b20gPSB0aGlzLl9ib3R0b21PZmZzZXQ7XG4gICAgc3R5bGVzLm1hcmdpblJpZ2h0ID0gdGhpcy5fcmlnaHRPZmZzZXQ7XG5cbiAgICBpZiAoc2hvdWxkQmVGbHVzaEhvcml6b250YWxseSkge1xuICAgICAgcGFyZW50U3R5bGVzLmp1c3RpZnlDb250ZW50ID0gJ2ZsZXgtc3RhcnQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fanVzdGlmeUNvbnRlbnQgPT09ICdjZW50ZXInKSB7XG4gICAgICBwYXJlbnRTdHlsZXMuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgLy8gSW4gUlRMIHRoZSBicm93c2VyIHdpbGwgaW52ZXJ0IGBmbGV4LXN0YXJ0YCBhbmQgYGZsZXgtZW5kYCBhdXRvbWF0aWNhbGx5LCBidXQgd2VcbiAgICAgIC8vIGRvbid0IHdhbnQgdGhhdCBiZWNhdXNlIG91ciBwb3NpdGlvbmluZyBpcyBleHBsaWNpdGx5IGBsZWZ0YCBhbmQgYHJpZ2h0YCwgaGVuY2VcbiAgICAgIC8vIHdoeSB3ZSBkbyBhbm90aGVyIGludmVyc2lvbiB0byBlbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBzdGF5cyBpbiB0aGUgc2FtZSBwb3NpdGlvbi5cbiAgICAgIC8vIFRPRE86IHJlY29uc2lkZXIgdGhpcyBpZiB3ZSBhZGQgYHN0YXJ0YCBhbmQgYGVuZGAgbWV0aG9kcy5cbiAgICAgIGlmICh0aGlzLl9qdXN0aWZ5Q29udGVudCA9PT0gJ2ZsZXgtc3RhcnQnKSB7XG4gICAgICAgIHBhcmVudFN0eWxlcy5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LWVuZCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2p1c3RpZnlDb250ZW50ID09PSAnZmxleC1lbmQnKSB7XG4gICAgICAgIHBhcmVudFN0eWxlcy5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LXN0YXJ0JztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGVzLmp1c3RpZnlDb250ZW50ID0gdGhpcy5fanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcGFyZW50U3R5bGVzLmFsaWduSXRlbXMgPSBzaG91bGRCZUZsdXNoVmVydGljYWxseSA/ICdmbGV4LXN0YXJ0JyA6IHRoaXMuX2FsaWduSXRlbXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIHRoZSBET00gY2hhbmdlcyBmcm9tIHRoZSBwb3NpdGlvbiBzdHJhdGVneS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNEaXNwb3NlZCB8fCAhdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuc3R5bGU7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fb3ZlcmxheVJlZi5ob3N0RWxlbWVudDtcbiAgICBjb25zdCBwYXJlbnRTdHlsZXMgPSBwYXJlbnQuc3R5bGU7XG5cbiAgICBwYXJlbnQuY2xhc3NMaXN0LnJlbW92ZSh3cmFwcGVyQ2xhc3MpO1xuICAgIHBhcmVudFN0eWxlcy5qdXN0aWZ5Q29udGVudCA9XG4gICAgICBwYXJlbnRTdHlsZXMuYWxpZ25JdGVtcyA9XG4gICAgICBzdHlsZXMubWFyZ2luVG9wID1cbiAgICAgIHN0eWxlcy5tYXJnaW5Cb3R0b20gPVxuICAgICAgc3R5bGVzLm1hcmdpbkxlZnQgPVxuICAgICAgc3R5bGVzLm1hcmdpblJpZ2h0ID1cbiAgICAgIHN0eWxlcy5wb3NpdGlvbiA9XG4gICAgICAgICcnO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGwhO1xuICAgIHRoaXMuX2lzRGlzcG9zZWQgPSB0cnVlO1xuICB9XG59XG4iXX0=