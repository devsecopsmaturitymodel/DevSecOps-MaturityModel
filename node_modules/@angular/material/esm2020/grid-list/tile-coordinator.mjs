/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 *
 * @docs-private
 */
export class TileCoordinator {
    constructor() {
        /** Index at which the search for the next gap will start. */
        this.columnIndex = 0;
        /** The current row index. */
        this.rowIndex = 0;
    }
    /** Gets the total number of rows occupied by tiles */
    get rowCount() {
        return this.rowIndex + 1;
    }
    /**
     * Gets the total span of rows occupied by tiles.
     * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2.
     */
    get rowspan() {
        const lastRowMax = Math.max(...this.tracker);
        // if any of the tiles has a rowspan that pushes it beyond the total row count,
        // add the difference to the rowcount
        return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
    }
    /**
     * Updates the tile positions.
     * @param numColumns Amount of columns in the grid.
     * @param tiles Tiles to be positioned.
     */
    update(numColumns, tiles) {
        this.columnIndex = 0;
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(tile => this._trackTile(tile));
    }
    /** Calculates the row and col position of a tile. */
    _trackTile(tile) {
        // Find a gap large enough for this tile.
        const gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    }
    /** Finds the next available space large enough to fit the tile. */
    _findMatchingGap(tileCols) {
        if (tileCols > this.tracker.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`mat-grid-list: tile with colspan ${tileCols} is wider than ` +
                `grid with cols="${this.tracker.length}".`);
        }
        // Start index is inclusive, end index is exclusive.
        let gapStartIndex = -1;
        let gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
                gapEndIndex = this._findGapEndIndex(gapStartIndex);
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
                gapEndIndex = this._findGapEndIndex(gapStartIndex);
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
            // Continue iterating until we find a gap wide enough for this tile. Since gapEndIndex is
            // exclusive, gapEndIndex is 0 means we didn't find a gap and should continue.
        } while (gapEndIndex - gapStartIndex < tileCols || gapEndIndex == 0);
        // If we still didn't manage to find a gap, ensure that the index is
        // at least zero so the tile doesn't get pulled out of the grid.
        return Math.max(gapStartIndex, 0);
    }
    /** Move "down" to the next row. */
    _nextRow() {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (let i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    }
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     */
    _findGapEndIndex(gapStartIndex) {
        for (let i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    }
    /** Update the tile tracker to account for the given tile in the given space. */
    _markTilePosition(start, tile) {
        for (let i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    }
}
/**
 * Simple data structure for tile position (row, col).
 * @docs-private
 */
export class TilePosition {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS1jb29yZGluYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvdGlsZS1jb29yZGluYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFhSDs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQTVCO1FBSUUsNkRBQTZEO1FBQzdELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLDZCQUE2QjtRQUM3QixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBa0l2QixDQUFDO0lBaElDLHNEQUFzRDtJQUN0RCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87UUFDVCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLCtFQUErRTtRQUMvRSxxQ0FBcUM7UUFDckMsT0FBTyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekUsQ0FBQztJQUtEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsVUFBa0IsRUFBRSxLQUFhO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQscURBQXFEO0lBQzdDLFVBQVUsQ0FBQyxJQUFVO1FBQzNCLHlDQUF5QztRQUN6QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFELG1DQUFtQztRQUNuQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTVDLHlGQUF5RjtRQUN6Rix3REFBd0Q7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVoRCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELG1FQUFtRTtJQUMzRCxnQkFBZ0IsQ0FBQyxRQUFnQjtRQUN2QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUNyRixNQUFNLEtBQUssQ0FDVCxvQ0FBb0MsUUFBUSxpQkFBaUI7Z0JBQzNELG1CQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUM3QyxDQUFDO1NBQ0g7UUFFRCxvREFBb0Q7UUFDcEQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFckIsMEZBQTBGO1FBQzFGLEdBQUc7WUFDRCwyREFBMkQ7WUFDM0QsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDckQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNoQixhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUQsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDbkQsU0FBUzthQUNWO1lBRUQsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUQsaUZBQWlGO1lBQ2pGLElBQUksYUFBYSxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2hCLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUMxRCxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNuRCxTQUFTO2FBQ1Y7WUFFRCxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRW5ELDRGQUE0RjtZQUM1Riw2QkFBNkI7WUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1lBRXJDLHlGQUF5RjtZQUN6Riw4RUFBOEU7U0FDL0UsUUFBUSxXQUFXLEdBQUcsYUFBYSxHQUFHLFFBQVEsSUFBSSxXQUFXLElBQUksQ0FBQyxFQUFFO1FBRXJFLG9FQUFvRTtRQUNwRSxnRUFBZ0U7UUFDaEUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsbUNBQW1DO0lBQzNCLFFBQVE7UUFDZCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsOERBQThEO1FBQzlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDcEQ7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssZ0JBQWdCLENBQUMsYUFBcUI7UUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixPQUFPLENBQUMsQ0FBQzthQUNWO1NBQ0Y7UUFFRCx3Q0FBd0M7UUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0ZBQWdGO0lBQ3hFLGlCQUFpQixDQUFDLEtBQWEsRUFBRSxJQUFVO1FBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDeEM7SUFDSCxDQUFDO0NBQ0Y7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUN2QixZQUFtQixHQUFXLEVBQVMsR0FBVztRQUEvQixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7Q0FDdkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhIHRpbGUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGlsZSB7XG4gIC8qKiBBbW91bnQgb2Ygcm93cyB0aGF0IHRoZSB0aWxlIHRha2VzIHVwLiAqL1xuICByb3dzcGFuOiBudW1iZXI7XG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyB0aGF0IHRoZSB0aWxlIHRha2VzIHVwLiAqL1xuICBjb2xzcGFuOiBudW1iZXI7XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGRldGVybWluaW5nLCBmcm9tIGEgbGlzdCBvZiB0aWxlcywgdGhlIChyb3csIGNvbCkgcG9zaXRpb24gb2YgZWFjaCBvZiB0aG9zZSB0aWxlc1xuICogaW4gdGhlIGdyaWQuIFRoaXMgaXMgbmVjZXNzYXJ5IChyYXRoZXIgdGhhbiBqdXN0IHJlbmRlcmluZyB0aGUgdGlsZXMgaW4gbm9ybWFsIGRvY3VtZW50IGZsb3cpXG4gKiBiZWNhdXNlIHRoZSB0aWxlcyBjYW4gaGF2ZSBhIHJvd3NwYW4uXG4gKlxuICogVGhlIHBvc2l0aW9uaW5nIGFsZ29yaXRobSBncmVlZGlseSBwbGFjZXMgZWFjaCB0aWxlIGFzIHNvb24gYXMgaXQgZW5jb3VudGVycyBhIGdhcCBpbiB0aGUgZ3JpZFxuICogbGFyZ2UgZW5vdWdoIHRvIGFjY29tbW9kYXRlIGl0IHNvIHRoYXQgdGhlIHRpbGVzIHN0aWxsIHJlbmRlciBpbiB0aGUgc2FtZSBvcmRlciBpbiB3aGljaCB0aGV5XG4gKiBhcmUgZ2l2ZW4uXG4gKlxuICogVGhlIGJhc2lzIG9mIHRoZSBhbGdvcml0aG0gaXMgdGhlIHVzZSBvZiBhbiBhcnJheSB0byB0cmFjayB0aGUgYWxyZWFkeSBwbGFjZWQgdGlsZXMuIEVhY2hcbiAqIGVsZW1lbnQgb2YgdGhlIGFycmF5IGNvcnJlc3BvbmRzIHRvIGEgY29sdW1uLCBhbmQgdGhlIHZhbHVlIGluZGljYXRlcyBob3cgbWFueSBjZWxscyBpbiB0aGF0XG4gKiBjb2x1bW4gYXJlIGFscmVhZHkgb2NjdXBpZWQ7IHplcm8gaW5kaWNhdGVzIGFuIGVtcHR5IGNlbGwuIE1vdmluZyBcImRvd25cIiB0byB0aGUgbmV4dCByb3dcbiAqIGRlY3JlbWVudHMgZWFjaCB2YWx1ZSBpbiB0aGUgdHJhY2tpbmcgYXJyYXkgKGluZGljYXRpbmcgdGhhdCB0aGUgY29sdW1uIGlzIG9uZSBjZWxsIGNsb3NlciB0b1xuICogYmVpbmcgZnJlZSkuXG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgVGlsZUNvb3JkaW5hdG9yIHtcbiAgLyoqIFRyYWNraW5nIGFycmF5IChzZWUgY2xhc3MgZGVzY3JpcHRpb24pLiAqL1xuICB0cmFja2VyOiBudW1iZXJbXTtcblxuICAvKiogSW5kZXggYXQgd2hpY2ggdGhlIHNlYXJjaCBmb3IgdGhlIG5leHQgZ2FwIHdpbGwgc3RhcnQuICovXG4gIGNvbHVtbkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBUaGUgY3VycmVudCByb3cgaW5kZXguICovXG4gIHJvd0luZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBHZXRzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cyBvY2N1cGllZCBieSB0aWxlcyAqL1xuICBnZXQgcm93Q291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5yb3dJbmRleCArIDE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdG90YWwgc3BhbiBvZiByb3dzIG9jY3VwaWVkIGJ5IHRpbGVzLlxuICAgKiBFeDogQSBsaXN0IHdpdGggMSByb3cgdGhhdCBjb250YWlucyBhIHRpbGUgd2l0aCByb3dzcGFuIDIgd2lsbCBoYXZlIGEgdG90YWwgcm93c3BhbiBvZiAyLlxuICAgKi9cbiAgZ2V0IHJvd3NwYW4oKSB7XG4gICAgY29uc3QgbGFzdFJvd01heCA9IE1hdGgubWF4KC4uLnRoaXMudHJhY2tlcik7XG4gICAgLy8gaWYgYW55IG9mIHRoZSB0aWxlcyBoYXMgYSByb3dzcGFuIHRoYXQgcHVzaGVzIGl0IGJleW9uZCB0aGUgdG90YWwgcm93IGNvdW50LFxuICAgIC8vIGFkZCB0aGUgZGlmZmVyZW5jZSB0byB0aGUgcm93Y291bnRcbiAgICByZXR1cm4gbGFzdFJvd01heCA+IDEgPyB0aGlzLnJvd0NvdW50ICsgbGFzdFJvd01heCAtIDEgOiB0aGlzLnJvd0NvdW50O1xuICB9XG5cbiAgLyoqIFRoZSBjb21wdXRlZCAocm93LCBjb2wpIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSAodGhlIG91dHB1dCkuICovXG4gIHBvc2l0aW9uczogVGlsZVBvc2l0aW9uW107XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHRpbGUgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0gbnVtQ29sdW1ucyBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZC5cbiAgICogQHBhcmFtIHRpbGVzIFRpbGVzIHRvIGJlIHBvc2l0aW9uZWQuXG4gICAqL1xuICB1cGRhdGUobnVtQ29sdW1uczogbnVtYmVyLCB0aWxlczogVGlsZVtdKSB7XG4gICAgdGhpcy5jb2x1bW5JbmRleCA9IDA7XG4gICAgdGhpcy5yb3dJbmRleCA9IDA7XG5cbiAgICB0aGlzLnRyYWNrZXIgPSBuZXcgQXJyYXkobnVtQ29sdW1ucyk7XG4gICAgdGhpcy50cmFja2VyLmZpbGwoMCwgMCwgdGhpcy50cmFja2VyLmxlbmd0aCk7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSB0aWxlcy5tYXAodGlsZSA9PiB0aGlzLl90cmFja1RpbGUodGlsZSkpO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIHJvdyBhbmQgY29sIHBvc2l0aW9uIG9mIGEgdGlsZS4gKi9cbiAgcHJpdmF0ZSBfdHJhY2tUaWxlKHRpbGU6IFRpbGUpOiBUaWxlUG9zaXRpb24ge1xuICAgIC8vIEZpbmQgYSBnYXAgbGFyZ2UgZW5vdWdoIGZvciB0aGlzIHRpbGUuXG4gICAgY29uc3QgZ2FwU3RhcnRJbmRleCA9IHRoaXMuX2ZpbmRNYXRjaGluZ0dhcCh0aWxlLmNvbHNwYW4pO1xuXG4gICAgLy8gUGxhY2UgdGlsZSBpbiB0aGUgcmVzdWx0aW5nIGdhcC5cbiAgICB0aGlzLl9tYXJrVGlsZVBvc2l0aW9uKGdhcFN0YXJ0SW5kZXgsIHRpbGUpO1xuXG4gICAgLy8gVGhlIG5leHQgdGltZSB3ZSBsb29rIGZvciBhIGdhcCwgdGhlIHNlYXJjaCB3aWxsIHN0YXJ0IGF0IGNvbHVtbkluZGV4LCB3aGljaCBzaG91bGQgYmVcbiAgICAvLyBpbW1lZGlhdGVseSBhZnRlciB0aGUgdGlsZSB0aGF0IGhhcyBqdXN0IGJlZW4gcGxhY2VkLlxuICAgIHRoaXMuY29sdW1uSW5kZXggPSBnYXBTdGFydEluZGV4ICsgdGlsZS5jb2xzcGFuO1xuXG4gICAgcmV0dXJuIG5ldyBUaWxlUG9zaXRpb24odGhpcy5yb3dJbmRleCwgZ2FwU3RhcnRJbmRleCk7XG4gIH1cblxuICAvKiogRmluZHMgdGhlIG5leHQgYXZhaWxhYmxlIHNwYWNlIGxhcmdlIGVub3VnaCB0byBmaXQgdGhlIHRpbGUuICovXG4gIHByaXZhdGUgX2ZpbmRNYXRjaGluZ0dhcCh0aWxlQ29sczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodGlsZUNvbHMgPiB0aGlzLnRyYWNrZXIubGVuZ3RoICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYG1hdC1ncmlkLWxpc3Q6IHRpbGUgd2l0aCBjb2xzcGFuICR7dGlsZUNvbHN9IGlzIHdpZGVyIHRoYW4gYCArXG4gICAgICAgICAgYGdyaWQgd2l0aCBjb2xzPVwiJHt0aGlzLnRyYWNrZXIubGVuZ3RofVwiLmAsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IGluZGV4IGlzIGluY2x1c2l2ZSwgZW5kIGluZGV4IGlzIGV4Y2x1c2l2ZS5cbiAgICBsZXQgZ2FwU3RhcnRJbmRleCA9IC0xO1xuICAgIGxldCBnYXBFbmRJbmRleCA9IC0xO1xuXG4gICAgLy8gTG9vayBmb3IgYSBnYXAgbGFyZ2UgZW5vdWdoIHRvIGZpdCB0aGUgZ2l2ZW4gdGlsZS4gRW1wdHkgc3BhY2VzIGFyZSBtYXJrZWQgd2l0aCBhIHplcm8uXG4gICAgZG8ge1xuICAgICAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSByb3csIGdvIHRvIHRoZSBuZXh0IHJvdy5cbiAgICAgIGlmICh0aGlzLmNvbHVtbkluZGV4ICsgdGlsZUNvbHMgPiB0aGlzLnRyYWNrZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX25leHRSb3coKTtcbiAgICAgICAgZ2FwU3RhcnRJbmRleCA9IHRoaXMudHJhY2tlci5pbmRleE9mKDAsIHRoaXMuY29sdW1uSW5kZXgpO1xuICAgICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZW1wdHkgc3BhY2VzIGluIHRoaXMgcm93IGF0IGFsbCwgbW92ZSBvbiB0byB0aGUgbmV4dCByb3cuXG4gICAgICBpZiAoZ2FwU3RhcnRJbmRleCA9PSAtMSkge1xuICAgICAgICB0aGlzLl9uZXh0Um93KCk7XG4gICAgICAgIGdhcFN0YXJ0SW5kZXggPSB0aGlzLnRyYWNrZXIuaW5kZXhPZigwLCB0aGlzLmNvbHVtbkluZGV4KTtcbiAgICAgICAgZ2FwRW5kSW5kZXggPSB0aGlzLl9maW5kR2FwRW5kSW5kZXgoZ2FwU3RhcnRJbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnYXBFbmRJbmRleCA9IHRoaXMuX2ZpbmRHYXBFbmRJbmRleChnYXBTdGFydEluZGV4KTtcblxuICAgICAgLy8gSWYgYSBnYXAgbGFyZ2UgZW5vdWdoIGlzbid0IGZvdW5kLCB3ZSB3YW50IHRvIHN0YXJ0IGxvb2tpbmcgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGN1cnJlbnRcbiAgICAgIC8vIGdhcCBvbiB0aGUgbmV4dCBpdGVyYXRpb24uXG4gICAgICB0aGlzLmNvbHVtbkluZGV4ID0gZ2FwU3RhcnRJbmRleCArIDE7XG5cbiAgICAgIC8vIENvbnRpbnVlIGl0ZXJhdGluZyB1bnRpbCB3ZSBmaW5kIGEgZ2FwIHdpZGUgZW5vdWdoIGZvciB0aGlzIHRpbGUuIFNpbmNlIGdhcEVuZEluZGV4IGlzXG4gICAgICAvLyBleGNsdXNpdmUsIGdhcEVuZEluZGV4IGlzIDAgbWVhbnMgd2UgZGlkbid0IGZpbmQgYSBnYXAgYW5kIHNob3VsZCBjb250aW51ZS5cbiAgICB9IHdoaWxlIChnYXBFbmRJbmRleCAtIGdhcFN0YXJ0SW5kZXggPCB0aWxlQ29scyB8fCBnYXBFbmRJbmRleCA9PSAwKTtcblxuICAgIC8vIElmIHdlIHN0aWxsIGRpZG4ndCBtYW5hZ2UgdG8gZmluZCBhIGdhcCwgZW5zdXJlIHRoYXQgdGhlIGluZGV4IGlzXG4gICAgLy8gYXQgbGVhc3QgemVybyBzbyB0aGUgdGlsZSBkb2Vzbid0IGdldCBwdWxsZWQgb3V0IG9mIHRoZSBncmlkLlxuICAgIHJldHVybiBNYXRoLm1heChnYXBTdGFydEluZGV4LCAwKTtcbiAgfVxuXG4gIC8qKiBNb3ZlIFwiZG93blwiIHRvIHRoZSBuZXh0IHJvdy4gKi9cbiAgcHJpdmF0ZSBfbmV4dFJvdygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbHVtbkluZGV4ID0gMDtcbiAgICB0aGlzLnJvd0luZGV4Kys7XG5cbiAgICAvLyBEZWNyZW1lbnQgYWxsIHNwYWNlcyBieSBvbmUgdG8gcmVmbGVjdCBtb3ZpbmcgZG93biBvbmUgcm93LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50cmFja2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnRyYWNrZXJbaV0gPSBNYXRoLm1heCgwLCB0aGlzLnRyYWNrZXJbaV0gLSAxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIGVuZCBpbmRleCAoZXhjbHVzaXZlKSBvZiBhIGdhcCBnaXZlbiB0aGUgaW5kZXggZnJvbSB3aGljaCB0byBzdGFydCBsb29raW5nLlxuICAgKiBUaGUgZ2FwIGVuZHMgd2hlbiBhIG5vbi16ZXJvIHZhbHVlIGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZmluZEdhcEVuZEluZGV4KGdhcFN0YXJ0SW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaSA9IGdhcFN0YXJ0SW5kZXggKyAxOyBpIDwgdGhpcy50cmFja2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy50cmFja2VyW2ldICE9IDApIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGdhcCBlbmRzIHdpdGggdGhlIGVuZCBvZiB0aGUgcm93LlxuICAgIHJldHVybiB0aGlzLnRyYWNrZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqIFVwZGF0ZSB0aGUgdGlsZSB0cmFja2VyIHRvIGFjY291bnQgZm9yIHRoZSBnaXZlbiB0aWxlIGluIHRoZSBnaXZlbiBzcGFjZS4gKi9cbiAgcHJpdmF0ZSBfbWFya1RpbGVQb3NpdGlvbihzdGFydDogbnVtYmVyLCB0aWxlOiBUaWxlKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlLmNvbHNwYW47IGkrKykge1xuICAgICAgdGhpcy50cmFja2VyW3N0YXJ0ICsgaV0gPSB0aWxlLnJvd3NwYW47XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIGRhdGEgc3RydWN0dXJlIGZvciB0aWxlIHBvc2l0aW9uIChyb3csIGNvbCkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm93OiBudW1iZXIsIHB1YmxpYyBjb2w6IG51bWJlcikge31cbn1cbiJdfQ==