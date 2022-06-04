/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * RegExp that can be used to check whether a value will
 * be allowed inside a CSS `calc()` expression.
 */
const cssCalcAllowedValue = /^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * @docs-private
 */
export class TileStyler {
    constructor() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     *
     * @param gutterSize Size of the grid's gutter.
     * @param tracker Instance of the TileCoordinator.
     * @param cols Amount of columns in the grid.
     * @param direction Layout direction of the grid.
     */
    init(gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    }
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    getBaseTileSize(sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return `(${sizePercent}% - (${this._gutterSize} * ${gutterFraction}))`;
    }
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param offset Number of tiles that have already been rendered in the row/column.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @return Position of the tile as a CSS calc() expression.
     */
    getTilePosition(baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return offset === 0 ? '0' : calc(`(${baseSize} + ${this._gutterSize}) * ${offset}`);
    }
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param span The tile's rowspan or colspan.
     * @return Size of the tile as a CSS calc() expression.
     */
    getTileSize(baseSize, span) {
        return `(${baseSize} * ${span}) + (${span - 1} * ${this._gutterSize})`;
    }
    /**
     * Sets the style properties to be applied to a tile for the given row and column index.
     * @param tile Tile to which to apply the styling.
     * @param rowIndex Index of the tile's row.
     * @param colIndex Index of the tile's column.
     */
    setStyle(tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        let percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        let gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    }
    /** Sets the horizontal placement of the tile in the list. */
    setColStyles(tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        let baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        let side = this._direction === 'rtl' ? 'right' : 'left';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    }
    /**
     * Calculates the total size taken up by gutters across one axis of a list.
     */
    getGutterSpan() {
        return `${this._gutterSize} * (${this._rowspan} - 1)`;
    }
    /**
     * Calculates the total size taken up by tiles across one axis of a list.
     * @param tileHeight Height of the tile.
     */
    getTileSpan(tileHeight) {
        return `${this._rowspan} * ${this.getTileSize(tileHeight, 1)}`;
    }
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method can be implemented by each type of TileStyler.
     * @docs-private
     */
    getComputedHeight() {
        return null;
    }
}
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example `<mat-grid-list cols="3" rowHeight="100px">`
 * @docs-private
 */
export class FixedTileStyler extends TileStyler {
    constructor(fixedRowHeight) {
        super();
        this.fixedRowHeight = fixedRowHeight;
    }
    init(gutterSize, tracker, cols, direction) {
        super.init(gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
        if (!cssCalcAllowedValue.test(this.fixedRowHeight) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`Invalid value "${this.fixedRowHeight}" set as rowHeight.`);
        }
    }
    setRowStyles(tile, rowIndex) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    }
    getComputedHeight() {
        return ['height', calc(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)];
    }
    reset(list) {
        list._setListStyle(['height', null]);
        if (list._tiles) {
            list._tiles.forEach(tile => {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            });
        }
    }
}
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example `<mat-grid-list cols="3" rowHeight="3:1">`
 * @docs-private
 */
export class RatioTileStyler extends TileStyler {
    constructor(value) {
        super();
        this._parseRatio(value);
    }
    setRowStyles(tile, rowIndex, percentWidth, gutterWidth) {
        let percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use padding-top and margin-top to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    }
    getComputedHeight() {
        return [
            'paddingBottom',
            calc(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`),
        ];
    }
    reset(list) {
        list._setListStyle(['paddingBottom', null]);
        list._tiles.forEach(tile => {
            tile._setStyle('marginTop', null);
            tile._setStyle('paddingTop', null);
        });
    }
    _parseRatio(value) {
        const ratioParts = value.split(':');
        if (ratioParts.length !== 2 && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`mat-grid-list: invalid ratio given for row-height: "${value}"`);
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    }
}
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example `<mat-grid-list cols="3" rowHeight="fit">`
 *
 * @docs-private
 */
export class FitTileStyler extends TileStyler {
    setRowStyles(tile, rowIndex) {
        // Percent of the available vertical space that one row takes up.
        let percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        let gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        let baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    }
    reset(list) {
        if (list._tiles) {
            list._tiles.forEach(tile => {
                tile._setStyle('top', null);
                tile._setStyle('height', null);
            });
        }
    }
}
/** Wraps a CSS string in a calc function */
function calc(exp) {
    return `calc(${exp})`;
}
/** Appends pixels to a CSS string if no units are given. */
function normalizeUnits(value) {
    return value.match(/([A-Za-z%]+)$/) ? value : `${value}px`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1zdHlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L3RpbGUtc3R5bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQU1IOzs7R0FHRztBQUNILE1BQU0sbUJBQW1CLEdBQUcsK0JBQStCLENBQUM7QUFRNUQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBZ0IsVUFBVTtJQUFoQztRQUVFLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsYUFBUSxHQUFXLENBQUMsQ0FBQztJQW1JdkIsQ0FBQztJQS9IQzs7Ozs7Ozs7T0FRRztJQUNILElBQUksQ0FBQyxVQUFrQixFQUFFLE9BQXdCLEVBQUUsSUFBWSxFQUFFLFNBQWlCO1FBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGVBQWUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO1FBQ3pELHNGQUFzRjtRQUN0RiwwRkFBMEY7UUFDMUYsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRixnQ0FBZ0M7UUFDaEMsT0FBTyxJQUFJLFdBQVcsUUFBUSxJQUFJLENBQUMsV0FBVyxNQUFNLGNBQWMsSUFBSSxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBQyxRQUFnQixFQUFFLE1BQWM7UUFDOUMsc0ZBQXNGO1FBQ3RGLHVCQUF1QjtRQUN2QixPQUFPLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxD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TSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGO0FBRUQsNENBQTRDO0FBQzVDLFNBQVMsSUFBSSxDQUFDLEdBQVc7SUFDdkIsT0FBTyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsU0FBUyxjQUFjLENBQUMsS0FBYTtJQUNuQyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQztBQUM3RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuXG4vKipcbiAqIFJlZ0V4cCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNoZWNrIHdoZXRoZXIgYSB2YWx1ZSB3aWxsXG4gKiBiZSBhbGxvd2VkIGluc2lkZSBhIENTUyBgY2FsYygpYCBleHByZXNzaW9uLlxuICovXG5jb25zdCBjc3NDYWxjQWxsb3dlZFZhbHVlID0gL14tP1xcZCsoKFxcLlxcZCspP1tBLVphLXolJF0/KSskLztcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSBzdHlsZWQgYnkgdGhlIGBUaWxlU3R5bGVyYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGlsZVN0eWxlVGFyZ2V0IHtcbiAgX3NldExpc3RTdHlsZShzdHlsZTogW3N0cmluZywgc3RyaW5nIHwgbnVsbF0gfCBudWxsKTogdm9pZDtcbiAgX3RpbGVzOiBRdWVyeUxpc3Q8TWF0R3JpZFRpbGU+O1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0eWxlIHByb3BlcnRpZXMgZm9yIGFuIGluZGl2aWR1YWwgdGlsZSwgZ2l2ZW4gdGhlIHBvc2l0aW9uIGNhbGN1bGF0ZWQgYnkgdGhlXG4gKiBUaWxlIENvb3JkaW5hdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGlsZVN0eWxlciB7XG4gIF9ndXR0ZXJTaXplOiBzdHJpbmc7XG4gIF9yb3dzOiBudW1iZXIgPSAwO1xuICBfcm93c3BhbjogbnVtYmVyID0gMDtcbiAgX2NvbHM6IG51bWJlcjtcbiAgX2RpcmVjdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIGdyaWQtbGlzdCBsYXlvdXQgaW5mbyBvbmNlIGl0IGlzIGF2YWlsYWJsZS4gQ2Fubm90IGJlIHByb2Nlc3NlZCBpbiB0aGUgY29uc3RydWN0b3JcbiAgICogYmVjYXVzZSB0aGVzZSBwcm9wZXJ0aWVzIGhhdmVuJ3QgYmVlbiBjYWxjdWxhdGVkIGJ5IHRoYXQgcG9pbnQuXG4gICAqXG4gICAqIEBwYXJhbSBndXR0ZXJTaXplIFNpemUgb2YgdGhlIGdyaWQncyBndXR0ZXIuXG4gICAqIEBwYXJhbSB0cmFja2VyIEluc3RhbmNlIG9mIHRoZSBUaWxlQ29vcmRpbmF0b3IuXG4gICAqIEBwYXJhbSBjb2xzIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIGdyaWQuXG4gICAqL1xuICBpbml0KGd1dHRlclNpemU6IHN0cmluZywgdHJhY2tlcjogVGlsZUNvb3JkaW5hdG9yLCBjb2xzOiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZ3V0dGVyU2l6ZSA9IG5vcm1hbGl6ZVVuaXRzKGd1dHRlclNpemUpO1xuICAgIHRoaXMuX3Jvd3MgPSB0cmFja2VyLnJvd0NvdW50O1xuICAgIHRoaXMuX3Jvd3NwYW4gPSB0cmFja2VyLnJvd3NwYW47XG4gICAgdGhpcy5fY29scyA9IGNvbHM7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgYSBzaW5nbGUgMXgxIHRpbGUgd291bGQgdGFrZSB1cCAod2lkdGggb3IgaGVpZ2h0KS5cbiAgICogVXNlZCBhcyBhIGJhc2lzIGZvciBvdGhlciBjYWxjdWxhdGlvbnMuXG4gICAqIEBwYXJhbSBzaXplUGVyY2VudCBQZXJjZW50IG9mIHRoZSB0b3RhbCBncmlkLWxpc3Qgc3BhY2UgdGhhdCBvbmUgMXgxIHRpbGUgd291bGQgdGFrZSB1cC5cbiAgICogQHBhcmFtIGd1dHRlckZyYWN0aW9uIEZyYWN0aW9uIG9mIHRoZSBndXR0ZXIgc2l6ZSB0YWtlbiB1cCBieSBvbmUgMXgxIHRpbGUuXG4gICAqIEByZXR1cm4gVGhlIHNpemUgb2YgYSAxeDEgdGlsZSBhcyBhbiBleHByZXNzaW9uIHRoYXQgY2FuIGJlIGV2YWx1YXRlZCB2aWEgQ1NTIGNhbGMoKS5cbiAgICovXG4gIGdldEJhc2VUaWxlU2l6ZShzaXplUGVyY2VudDogbnVtYmVyLCBndXR0ZXJGcmFjdGlvbjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBUYWtlIHRoZSBiYXNlIHNpemUgcGVyY2VudCAoYXMgd291bGQgYmUgaWYgZXZlbmx5IGRpdmlkaW5nIHRoZSBzaXplIGJldHdlZW4gY2VsbHMpLFxuICAgIC8vIGFuZCB0aGVuIHN1YnRyYWN0aW5nIHRoZSBzaXplIG9mIG9uZSBndXR0ZXIuIEhvd2V2ZXIsIHNpbmNlIHRoZXJlIGFyZSBubyBndXR0ZXJzIG9uIHRoZVxuICAgIC8vIGVkZ2VzLCBlYWNoIHRpbGUgb25seSB1c2VzIGEgZnJhY3Rpb24gKGd1dHRlclNoYXJlID0gbnVtR3V0dGVycyAvIG51bUNlbGxzKSBvZiB0aGUgZ3V0dGVyXG4gICAgLy8gc2l6ZS4gKEltYWdpbmUgaGF2aW5nIG9uZSBndXR0ZXIgcGVyIHRpbGUsIGFuZCB0aGVuIGJyZWFraW5nIHVwIHRoZSBleHRyYSBndXR0ZXIgb24gdGhlXG4gICAgLy8gZWRnZSBldmVubHkgYW1vbmcgdGhlIGNlbGxzKS5cbiAgICByZXR1cm4gYCgke3NpemVQZXJjZW50fSUgLSAoJHt0aGlzLl9ndXR0ZXJTaXplfSAqICR7Z3V0dGVyRnJhY3Rpb259KSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgVGhlIGhvcml6b250YWwgb3IgdmVydGljYWwgcG9zaXRpb24gb2YgYSB0aWxlLCBlLmcuLCB0aGUgJ3RvcCcgb3IgJ2xlZnQnIHByb3BlcnR5IHZhbHVlLlxuICAgKiBAcGFyYW0gb2Zmc2V0IE51bWJlciBvZiB0aWxlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHJlbmRlcmVkIGluIHRoZSByb3cvY29sdW1uLlxuICAgKiBAcGFyYW0gYmFzZVNpemUgQmFzZSBzaXplIG9mIGEgMXgxIHRpbGUgKGFzIGNvbXB1dGVkIGluIGdldEJhc2VUaWxlU2l6ZSkuXG4gICAqIEByZXR1cm4gUG9zaXRpb24gb2YgdGhlIHRpbGUgYXMgYSBDU1MgY2FsYygpIGV4cHJlc3Npb24uXG4gICAqL1xuICBnZXRUaWxlUG9zaXRpb24oYmFzZVNpemU6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIC8vIFRoZSBwb3NpdGlvbiBjb21lcyB0aGUgc2l6ZSBvZiBhIDF4MSB0aWxlIHBsdXMgZ3V0dGVyIGZvciBlYWNoIHByZXZpb3VzIHRpbGUgaW4gdGhlXG4gICAgLy8gcm93L2NvbHVtbiAob2Zmc2V0KS5cbiAgICByZXR1cm4gb2Zmc2V0ID09PSAwID8gJzAnIDogY2FsYyhgKCR7YmFzZVNpemV9ICsgJHt0aGlzLl9ndXR0ZXJTaXplfSkgKiAke29mZnNldH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhY3R1YWwgc2l6ZSBvZiBhIHRpbGUsIGUuZy4sIHdpZHRoIG9yIGhlaWdodCwgdGFraW5nIHJvd3NwYW4gb3IgY29sc3BhbiBpbnRvIGFjY291bnQuXG4gICAqIEBwYXJhbSBiYXNlU2l6ZSBCYXNlIHNpemUgb2YgYSAxeDEgdGlsZSAoYXMgY29tcHV0ZWQgaW4gZ2V0QmFzZVRpbGVTaXplKS5cbiAgICogQHBhcmFtIHNwYW4gVGhlIHRpbGUncyByb3dzcGFuIG9yIGNvbHNwYW4uXG4gICAqIEByZXR1cm4gU2l6ZSBvZiB0aGUgdGlsZSBhcyBhIENTUyBjYWxjKCkgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldFRpbGVTaXplKGJhc2VTaXplOiBzdHJpbmcsIHNwYW46IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAoJHtiYXNlU2l6ZX0gKiAke3NwYW59KSArICgke3NwYW4gLSAxfSAqICR7dGhpcy5fZ3V0dGVyU2l6ZX0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIHRvIGJlIGFwcGxpZWQgdG8gYSB0aWxlIGZvciB0aGUgZ2l2ZW4gcm93IGFuZCBjb2x1bW4gaW5kZXguXG4gICAqIEBwYXJhbSB0aWxlIFRpbGUgdG8gd2hpY2ggdG8gYXBwbHkgdGhlIHN0eWxpbmcuXG4gICAqIEBwYXJhbSByb3dJbmRleCBJbmRleCBvZiB0aGUgdGlsZSdzIHJvdy5cbiAgICogQHBhcmFtIGNvbEluZGV4IEluZGV4IG9mIHRoZSB0aWxlJ3MgY29sdW1uLlxuICAgKi9cbiAgc2V0U3R5bGUodGlsZTogTWF0R3JpZFRpbGUsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBQZXJjZW50IG9mIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZSB0aGF0IG9uZSBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRXaWR0aFBlclRpbGUgPSAxMDAgLyB0aGlzLl9jb2xzO1xuXG4gICAgLy8gRnJhY3Rpb24gb2YgdGhlIHZlcnRpY2FsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgLy8gRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGFyZSA1IGNvbHVtbnMsIGVhY2ggY29sdW1uIHVzZXMgNC81ID0gMC44IHRpbWVzIHRoZSBndXR0ZXIgd2lkdGguXG4gICAgbGV0IGd1dHRlcldpZHRoRnJhY3Rpb25QZXJUaWxlID0gKHRoaXMuX2NvbHMgLSAxKSAvIHRoaXMuX2NvbHM7XG5cbiAgICB0aGlzLnNldENvbFN0eWxlcyh0aWxlLCBjb2xJbmRleCwgcGVyY2VudFdpZHRoUGVyVGlsZSwgZ3V0dGVyV2lkdGhGcmFjdGlvblBlclRpbGUpO1xuICAgIHRoaXMuc2V0Um93U3R5bGVzKHRpbGUsIHJvd0luZGV4LCBwZXJjZW50V2lkdGhQZXJUaWxlLCBndXR0ZXJXaWR0aEZyYWN0aW9uUGVyVGlsZSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgaG9yaXpvbnRhbCBwbGFjZW1lbnQgb2YgdGhlIHRpbGUgaW4gdGhlIGxpc3QuICovXG4gIHNldENvbFN0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgY29sSW5kZXg6IG51bWJlciwgcGVyY2VudFdpZHRoOiBudW1iZXIsIGd1dHRlcldpZHRoOiBudW1iZXIpIHtcbiAgICAvLyBCYXNlIGhvcml6b250YWwgc2l6ZSBvZiBhIGNvbHVtbi5cbiAgICBsZXQgYmFzZVRpbGVXaWR0aCA9IHRoaXMuZ2V0QmFzZVRpbGVTaXplKHBlcmNlbnRXaWR0aCwgZ3V0dGVyV2lkdGgpO1xuXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSBpcyBhbHdheXMgY2FsY3VsYXRlZCB0aGUgc2FtZSB3YXksIGJ1dCB0aGVcbiAgICAvLyBoZWlnaHQgYW5kIHZlcnRpY2FsIHBvc2l0aW9uIGRlcGVuZHMgb24gdGhlIHJvd01vZGUuXG4gICAgbGV0IHNpZGUgPSB0aGlzLl9kaXJlY3Rpb24gPT09ICdydGwnID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICB0aWxlLl9zZXRTdHlsZShzaWRlLCB0aGlzLmdldFRpbGVQb3NpdGlvbihiYXNlVGlsZVdpZHRoLCBjb2xJbmRleCkpO1xuICAgIHRpbGUuX3NldFN0eWxlKCd3aWR0aCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZShiYXNlVGlsZVdpZHRoLCB0aWxlLmNvbHNwYW4pKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgc2l6ZSB0YWtlbiB1cCBieSBndXR0ZXJzIGFjcm9zcyBvbmUgYXhpcyBvZiBhIGxpc3QuXG4gICAqL1xuICBnZXRHdXR0ZXJTcGFuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2d1dHRlclNpemV9ICogKCR7dGhpcy5fcm93c3Bhbn0gLSAxKWA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgc2l6ZSB0YWtlbiB1cCBieSB0aWxlcyBhY3Jvc3Mgb25lIGF4aXMgb2YgYSBsaXN0LlxuICAgKiBAcGFyYW0gdGlsZUhlaWdodCBIZWlnaHQgb2YgdGhlIHRpbGUuXG4gICAqL1xuICBnZXRUaWxlU3Bhbih0aWxlSGVpZ2h0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLl9yb3dzcGFufSAqICR7dGhpcy5nZXRUaWxlU2l6ZSh0aWxlSGVpZ2h0LCAxKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZlcnRpY2FsIHBsYWNlbWVudCBvZiB0aGUgdGlsZSBpbiB0aGUgbGlzdC5cbiAgICogVGhpcyBtZXRob2Qgd2lsbCBiZSBpbXBsZW1lbnRlZCBieSBlYWNoIHR5cGUgb2YgVGlsZVN0eWxlci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0Um93U3R5bGVzKFxuICAgIHRpbGU6IE1hdEdyaWRUaWxlLFxuICAgIHJvd0luZGV4OiBudW1iZXIsXG4gICAgcGVyY2VudFdpZHRoOiBudW1iZXIsXG4gICAgZ3V0dGVyV2lkdGg6IG51bWJlcixcbiAgKTogdm9pZDtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgY29tcHV0ZWQgaGVpZ2h0IGFuZCByZXR1cm5zIHRoZSBjb3JyZWN0IHN0eWxlIHByb3BlcnR5IHRvIHNldC5cbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGltcGxlbWVudGVkIGJ5IGVhY2ggdHlwZSBvZiBUaWxlU3R5bGVyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHwgbnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbGUgc3R5bGVyIGlzIHN3YXBwZWQgb3V0IHdpdGggYSBkaWZmZXJlbnQgb25lLiBUbyBiZSB1c2VkIGZvciBjbGVhbnVwLlxuICAgKiBAcGFyYW0gbGlzdCBHcmlkIGxpc3QgdGhhdCB0aGUgc3R5bGVyIHdhcyBhdHRhY2hlZCB0by5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYWJzdHJhY3QgcmVzZXQobGlzdDogVGlsZVN0eWxlVGFyZ2V0KTogdm9pZDtcbn1cblxuLyoqXG4gKiBUaGlzIHR5cGUgb2Ygc3R5bGVyIGlzIGluc3RhbnRpYXRlZCB3aGVuIHRoZSB1c2VyIHBhc3NlcyBpbiBhIGZpeGVkIHJvdyBoZWlnaHQuXG4gKiBFeGFtcGxlIGA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiIHJvd0hlaWdodD1cIjEwMHB4XCI+YFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgRml4ZWRUaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaXhlZFJvd0hlaWdodDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGluaXQoZ3V0dGVyU2l6ZTogc3RyaW5nLCB0cmFja2VyOiBUaWxlQ29vcmRpbmF0b3IsIGNvbHM6IG51bWJlciwgZGlyZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBzdXBlci5pbml0KGd1dHRlclNpemUsIHRyYWNrZXIsIGNvbHMsIGRpcmVjdGlvbik7XG4gICAgdGhpcy5maXhlZFJvd0hlaWdodCA9IG5vcm1hbGl6ZVVuaXRzKHRoaXMuZml4ZWRSb3dIZWlnaHQpO1xuXG4gICAgaWYgKFxuICAgICAgIWNzc0NhbGNBbGxvd2VkVmFsdWUudGVzdCh0aGlzLmZpeGVkUm93SGVpZ2h0KSAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICApIHtcbiAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt0aGlzLmZpeGVkUm93SGVpZ2h0fVwiIHNldCBhcyByb3dIZWlnaHQuYCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgc2V0Um93U3R5bGVzKHRpbGU6IE1hdEdyaWRUaWxlLCByb3dJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ3RvcCcsIHRoaXMuZ2V0VGlsZVBvc2l0aW9uKHRoaXMuZml4ZWRSb3dIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZSh0aGlzLmZpeGVkUm93SGVpZ2h0LCB0aWxlLnJvd3NwYW4pKSk7XG4gIH1cblxuICBvdmVycmlkZSBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICByZXR1cm4gWydoZWlnaHQnLCBjYWxjKGAke3RoaXMuZ2V0VGlsZVNwYW4odGhpcy5maXhlZFJvd0hlaWdodCl9ICsgJHt0aGlzLmdldEd1dHRlclNwYW4oKX1gKV07XG4gIH1cblxuICBvdmVycmlkZSByZXNldChsaXN0OiBUaWxlU3R5bGVUYXJnZXQpIHtcbiAgICBsaXN0Ll9zZXRMaXN0U3R5bGUoWydoZWlnaHQnLCBudWxsXSk7XG5cbiAgICBpZiAobGlzdC5fdGlsZXMpIHtcbiAgICAgIGxpc3QuX3RpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCd0b3AnLCBudWxsKTtcbiAgICAgICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhpcyB0eXBlIG9mIHN0eWxlciBpcyBpbnN0YW50aWF0ZWQgd2hlbiB0aGUgdXNlciBwYXNzZXMgaW4gYSB3aWR0aDpoZWlnaHQgcmF0aW9cbiAqIGZvciB0aGUgcm93IGhlaWdodC4gIEV4YW1wbGUgYDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCIgcm93SGVpZ2h0PVwiMzoxXCI+YFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmF0aW9UaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG4gIC8qKiBSYXRpbyB3aWR0aDpoZWlnaHQgZ2l2ZW4gYnkgdXNlciB0byBkZXRlcm1pbmUgcm93IGhlaWdodC4gKi9cbiAgcm93SGVpZ2h0UmF0aW86IG51bWJlcjtcbiAgYmFzZVRpbGVIZWlnaHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJzZVJhdGlvKHZhbHVlKTtcbiAgfVxuXG4gIHNldFJvd1N0eWxlcyhcbiAgICB0aWxlOiBNYXRHcmlkVGlsZSxcbiAgICByb3dJbmRleDogbnVtYmVyLFxuICAgIHBlcmNlbnRXaWR0aDogbnVtYmVyLFxuICAgIGd1dHRlcldpZHRoOiBudW1iZXIsXG4gICk6IHZvaWQge1xuICAgIGxldCBwZXJjZW50SGVpZ2h0UGVyVGlsZSA9IHBlcmNlbnRXaWR0aCAvIHRoaXMucm93SGVpZ2h0UmF0aW87XG4gICAgdGhpcy5iYXNlVGlsZUhlaWdodCA9IHRoaXMuZ2V0QmFzZVRpbGVTaXplKHBlcmNlbnRIZWlnaHRQZXJUaWxlLCBndXR0ZXJXaWR0aCk7XG5cbiAgICAvLyBVc2UgcGFkZGluZy10b3AgYW5kIG1hcmdpbi10b3AgdG8gbWFpbnRhaW4gdGhlIGdpdmVuIGFzcGVjdCByYXRpbywgYXNcbiAgICAvLyBhIHBlcmNlbnRhZ2UtYmFzZWQgdmFsdWUgZm9yIHRoZXNlIHByb3BlcnRpZXMgaXMgYXBwbGllZCB2ZXJzdXMgdGhlICp3aWR0aCogb2YgdGhlXG4gICAgLy8gY29udGFpbmluZyBibG9jay4gU2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIvYm94Lmh0bWwjbWFyZ2luLXByb3BlcnRpZXNcbiAgICB0aWxlLl9zZXRTdHlsZSgnbWFyZ2luVG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24odGhpcy5iYXNlVGlsZUhlaWdodCwgcm93SW5kZXgpKTtcbiAgICB0aWxlLl9zZXRTdHlsZSgncGFkZGluZ1RvcCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZSh0aGlzLmJhc2VUaWxlSGVpZ2h0LCB0aWxlLnJvd3NwYW4pKSk7XG4gIH1cblxuICBvdmVycmlkZSBnZXRDb21wdXRlZEhlaWdodCgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3BhZGRpbmdCb3R0b20nLFxuICAgICAgY2FsYyhgJHt0aGlzLmdldFRpbGVTcGFuKHRoaXMuYmFzZVRpbGVIZWlnaHQpfSArICR7dGhpcy5nZXRHdXR0ZXJTcGFuKCl9YCksXG4gICAgXTtcbiAgfVxuXG4gIHJlc2V0KGxpc3Q6IFRpbGVTdHlsZVRhcmdldCkge1xuICAgIGxpc3QuX3NldExpc3RTdHlsZShbJ3BhZGRpbmdCb3R0b20nLCBudWxsXSk7XG5cbiAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ21hcmdpblRvcCcsIG51bGwpO1xuICAgICAgdGlsZS5fc2V0U3R5bGUoJ3BhZGRpbmdUb3AnLCBudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUmF0aW8odmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJhdGlvUGFydHMgPSB2YWx1ZS5zcGxpdCgnOicpO1xuXG4gICAgaWYgKHJhdGlvUGFydHMubGVuZ3RoICE9PSAyICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogaW52YWxpZCByYXRpbyBnaXZlbiBmb3Igcm93LWhlaWdodDogXCIke3ZhbHVlfVwiYCk7XG4gICAgfVxuXG4gICAgdGhpcy5yb3dIZWlnaHRSYXRpbyA9IHBhcnNlRmxvYXQocmF0aW9QYXJ0c1swXSkgLyBwYXJzZUZsb2F0KHJhdGlvUGFydHNbMV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyB0eXBlIG9mIHN0eWxlciBpcyBpbnN0YW50aWF0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgXCJmaXRcIiByb3cgaGVpZ2h0IG1vZGUuXG4gKiBJbiBvdGhlciB3b3JkcywgdGhlIHJvdyBoZWlnaHQgd2lsbCByZWZsZWN0IHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lciBkaXZpZGVkXG4gKiBieSB0aGUgbnVtYmVyIG9mIHJvd3MuICBFeGFtcGxlIGA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiIHJvd0hlaWdodD1cImZpdFwiPmBcbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXRUaWxlU3R5bGVyIGV4dGVuZHMgVGlsZVN0eWxlciB7XG4gIHNldFJvd1N0eWxlcyh0aWxlOiBNYXRHcmlkVGlsZSwgcm93SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFBlcmNlbnQgb2YgdGhlIGF2YWlsYWJsZSB2ZXJ0aWNhbCBzcGFjZSB0aGF0IG9uZSByb3cgdGFrZXMgdXAuXG4gICAgbGV0IHBlcmNlbnRIZWlnaHRQZXJUaWxlID0gMTAwIC8gdGhpcy5fcm93c3BhbjtcblxuICAgIC8vIEZyYWN0aW9uIG9mIHRoZSBob3Jpem9udGFsIGd1dHRlciBzaXplIHRoYXQgZWFjaCBjb2x1bW4gdGFrZXMgdXAuXG4gICAgbGV0IGd1dHRlckhlaWdodFBlclRpbGUgPSAodGhpcy5fcm93cyAtIDEpIC8gdGhpcy5fcm93cztcblxuICAgIC8vIEJhc2UgdmVydGljYWwgc2l6ZSBvZiBhIGNvbHVtbi5cbiAgICBsZXQgYmFzZVRpbGVIZWlnaHQgPSB0aGlzLmdldEJhc2VUaWxlU2l6ZShwZXJjZW50SGVpZ2h0UGVyVGlsZSwgZ3V0dGVySGVpZ2h0UGVyVGlsZSk7XG5cbiAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgdGhpcy5nZXRUaWxlUG9zaXRpb24oYmFzZVRpbGVIZWlnaHQsIHJvd0luZGV4KSk7XG4gICAgdGlsZS5fc2V0U3R5bGUoJ2hlaWdodCcsIGNhbGModGhpcy5nZXRUaWxlU2l6ZShiYXNlVGlsZUhlaWdodCwgdGlsZS5yb3dzcGFuKSkpO1xuICB9XG5cbiAgcmVzZXQobGlzdDogVGlsZVN0eWxlVGFyZ2V0KSB7XG4gICAgaWYgKGxpc3QuX3RpbGVzKSB7XG4gICAgICBsaXN0Ll90aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICB0aWxlLl9zZXRTdHlsZSgndG9wJywgbnVsbCk7XG4gICAgICAgIHRpbGUuX3NldFN0eWxlKCdoZWlnaHQnLCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKiogV3JhcHMgYSBDU1Mgc3RyaW5nIGluIGEgY2FsYyBmdW5jdGlvbiAqL1xuZnVuY3Rpb24gY2FsYyhleHA6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgY2FsYygke2V4cH0pYDtcbn1cblxuLyoqIEFwcGVuZHMgcGl4ZWxzIHRvIGEgQ1NTIHN0cmluZyBpZiBubyB1bml0cyBhcmUgZ2l2ZW4uICovXG5mdW5jdGlvbiBub3JtYWxpemVVbml0cyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLm1hdGNoKC8oW0EtWmEteiVdKykkLykgPyB2YWx1ZSA6IGAke3ZhbHVlfXB4YDtcbn1cbiJdfQ==