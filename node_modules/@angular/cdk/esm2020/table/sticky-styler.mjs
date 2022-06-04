/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * List of all possible directions that can be used for sticky positioning.
 * @docs-private
 */
export const STICKY_DIRECTIONS = ['top', 'bottom', 'left', 'right'];
/**
 * Applies and removes sticky positioning styles to the `CdkTable` rows and columns cells.
 * @docs-private
 */
export class StickyStyler {
    /**
     * @param _isNativeHtmlTable Whether the sticky logic should be based on a table
     *     that uses the native `<table>` element.
     * @param _stickCellCss The CSS class that will be applied to every row/cell that has
     *     sticky positioning applied.
     * @param direction The directionality context of the table (ltr/rtl); affects column positioning
     *     by reversing left/right positions.
     * @param _isBrowser Whether the table is currently being rendered on the server or the client.
     * @param _needsPositionStickyOnElement Whether we need to specify position: sticky on cells
     *     using inline styles. If false, it is assumed that position: sticky is included in
     *     the component stylesheet for _stickCellCss.
     * @param _positionListener A listener that is notified of changes to sticky rows/columns
     *     and their dimensions.
     */
    constructor(_isNativeHtmlTable, _stickCellCss, direction, _coalescedStyleScheduler, _isBrowser = true, _needsPositionStickyOnElement = true, _positionListener) {
        this._isNativeHtmlTable = _isNativeHtmlTable;
        this._stickCellCss = _stickCellCss;
        this.direction = direction;
        this._coalescedStyleScheduler = _coalescedStyleScheduler;
        this._isBrowser = _isBrowser;
        this._needsPositionStickyOnElement = _needsPositionStickyOnElement;
        this._positionListener = _positionListener;
        this._cachedCellWidths = [];
        this._borderCellCss = {
            'top': `${_stickCellCss}-border-elem-top`,
            'bottom': `${_stickCellCss}-border-elem-bottom`,
            'left': `${_stickCellCss}-border-elem-left`,
            'right': `${_stickCellCss}-border-elem-right`,
        };
    }
    /**
     * Clears the sticky positioning styles from the row and its cells by resetting the `position`
     * style, setting the zIndex to 0, and unsetting each provided sticky direction.
     * @param rows The list of rows that should be cleared from sticking in the provided directions
     * @param stickyDirections The directions that should no longer be set as sticky on the rows.
     */
    clearStickyPositioning(rows, stickyDirections) {
        const elementsToClear = [];
        for (const row of rows) {
            // If the row isn't an element (e.g. if it's an `ng-container`),
            // it won't have inline styles or `children` so we skip it.
            if (row.nodeType !== row.ELEMENT_NODE) {
                continue;
            }
            elementsToClear.push(row);
            for (let i = 0; i < row.children.length; i++) {
                elementsToClear.push(row.children[i]);
            }
        }
        // Coalesce with sticky row/column updates (and potentially other changes like column resize).
        this._coalescedStyleScheduler.schedule(() => {
            for (const element of elementsToClear) {
                this._removeStickyStyle(element, stickyDirections);
            }
        });
    }
    /**
     * Applies sticky left and right positions to the cells of each row according to the sticky
     * states of the rendered column definitions.
     * @param rows The rows that should have its set of cells stuck according to the sticky states.
     * @param stickyStartStates A list of boolean states where each state represents whether the cell
     *     in this index position should be stuck to the start of the row.
     * @param stickyEndStates A list of boolean states where each state represents whether the cell
     *     in this index position should be stuck to the end of the row.
     * @param recalculateCellWidths Whether the sticky styler should recalculate the width of each
     *     column cell. If `false` cached widths will be used instead.
     */
    updateStickyColumns(rows, stickyStartStates, stickyEndStates, recalculateCellWidths = true) {
        if (!rows.length ||
            !this._isBrowser ||
            !(stickyStartStates.some(state => state) || stickyEndStates.some(state => state))) {
            if (this._positionListener) {
                this._positionListener.stickyColumnsUpdated({ sizes: [] });
                this._positionListener.stickyEndColumnsUpdated({ sizes: [] });
            }
            return;
        }
        const firstRow = rows[0];
        const numCells = firstRow.children.length;
        const cellWidths = this._getCellWidths(firstRow, recalculateCellWidths);
        const startPositions = this._getStickyStartColumnPositions(cellWidths, stickyStartStates);
        const endPositions = this._getStickyEndColumnPositions(cellWidths, stickyEndStates);
        const lastStickyStart = stickyStartStates.lastIndexOf(true);
        const firstStickyEnd = stickyEndStates.indexOf(true);
        // Coalesce with sticky row updates (and potentially other changes like column resize).
        this._coalescedStyleScheduler.schedule(() => {
            const isRtl = this.direction === 'rtl';
            const start = isRtl ? 'right' : 'left';
            const end = isRtl ? 'left' : 'right';
            for (const row of rows) {
                for (let i = 0; i < numCells; i++) {
                    const cell = row.children[i];
                    if (stickyStartStates[i]) {
                        this._addStickyStyle(cell, start, startPositions[i], i === lastStickyStart);
                    }
                    if (stickyEndStates[i]) {
                        this._addStickyStyle(cell, end, endPositions[i], i === firstStickyEnd);
                    }
                }
            }
            if (this._positionListener) {
                this._positionListener.stickyColumnsUpdated({
                    sizes: lastStickyStart === -1
                        ? []
                        : cellWidths
                            .slice(0, lastStickyStart + 1)
                            .map((width, index) => (stickyStartStates[index] ? width : null)),
                });
                this._positionListener.stickyEndColumnsUpdated({
                    sizes: firstStickyEnd === -1
                        ? []
                        : cellWidths
                            .slice(firstStickyEnd)
                            .map((width, index) => (stickyEndStates[index + firstStickyEnd] ? width : null))
                            .reverse(),
                });
            }
        });
    }
    /**
     * Applies sticky positioning to the row's cells if using the native table layout, and to the
     * row itself otherwise.
     * @param rowsToStick The list of rows that should be stuck according to their corresponding
     *     sticky state and to the provided top or bottom position.
     * @param stickyStates A list of boolean states where each state represents whether the row
     *     should be stuck in the particular top or bottom position.
     * @param position The position direction in which the row should be stuck if that row should be
     *     sticky.
     *
     */
    stickRows(rowsToStick, stickyStates, position) {
        // Since we can't measure the rows on the server, we can't stick the rows properly.
        if (!this._isBrowser) {
            return;
        }
        // If positioning the rows to the bottom, reverse their order when evaluating the sticky
        // position such that the last row stuck will be "bottom: 0px" and so on. Note that the
        // sticky states need to be reversed as well.
        const rows = position === 'bottom' ? rowsToStick.slice().reverse() : rowsToStick;
        const states = position === 'bottom' ? stickyStates.slice().reverse() : stickyStates;
        // Measure row heights all at once before adding sticky styles to reduce layout thrashing.
        const stickyOffsets = [];
        const stickyCellHeights = [];
        const elementsToStick = [];
        for (let rowIndex = 0, stickyOffset = 0; rowIndex < rows.length; rowIndex++) {
            if (!states[rowIndex]) {
                continue;
            }
            stickyOffsets[rowIndex] = stickyOffset;
            const row = rows[rowIndex];
            elementsToStick[rowIndex] = this._isNativeHtmlTable
                ? Array.from(row.children)
                : [row];
            const height = row.getBoundingClientRect().height;
            stickyOffset += height;
            stickyCellHeights[rowIndex] = height;
        }
        const borderedRowIndex = states.lastIndexOf(true);
        // Coalesce with other sticky row updates (top/bottom), sticky columns updates
        // (and potentially other changes like column resize).
        this._coalescedStyleScheduler.schedule(() => {
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                if (!states[rowIndex]) {
                    continue;
                }
                const offset = stickyOffsets[rowIndex];
                const isBorderedRowIndex = rowIndex === borderedRowIndex;
                for (const element of elementsToStick[rowIndex]) {
                    this._addStickyStyle(element, position, offset, isBorderedRowIndex);
                }
            }
            if (position === 'top') {
                this._positionListener?.stickyHeaderRowsUpdated({
                    sizes: stickyCellHeights,
                    offsets: stickyOffsets,
                    elements: elementsToStick,
                });
            }
            else {
                this._positionListener?.stickyFooterRowsUpdated({
                    sizes: stickyCellHeights,
                    offsets: stickyOffsets,
                    elements: elementsToStick,
                });
            }
        });
    }
    /**
     * When using the native table in Safari, sticky footer cells do not stick. The only way to stick
     * footer rows is to apply sticky styling to the tfoot container. This should only be done if
     * all footer rows are sticky. If not all footer rows are sticky, remove sticky positioning from
     * the tfoot element.
     */
    updateStickyFooterContainer(tableElement, stickyStates) {
        if (!this._isNativeHtmlTable) {
            return;
        }
        const tfoot = tableElement.querySelector('tfoot');
        // Coalesce with other sticky updates (and potentially other changes like column resize).
        this._coalescedStyleScheduler.schedule(() => {
            if (stickyStates.some(state => !state)) {
                this._removeStickyStyle(tfoot, ['bottom']);
            }
            else {
                this._addStickyStyle(tfoot, 'bottom', 0, false);
            }
        });
    }
    /**
     * Removes the sticky style on the element by removing the sticky cell CSS class, re-evaluating
     * the zIndex, removing each of the provided sticky directions, and removing the
     * sticky position if there are no more directions.
     */
    _removeStickyStyle(element, stickyDirections) {
        for (const dir of stickyDirections) {
            element.style[dir] = '';
            element.classList.remove(this._borderCellCss[dir]);
        }
        // If the element no longer has any more sticky directions, remove sticky positioning and
        // the sticky CSS class.
        // Short-circuit checking element.style[dir] for stickyDirections as they
        // were already removed above.
        const hasDirection = STICKY_DIRECTIONS.some(dir => stickyDirections.indexOf(dir) === -1 && element.style[dir]);
        if (hasDirection) {
            element.style.zIndex = this._getCalculatedZIndex(element);
        }
        else {
            // When not hasDirection, _getCalculatedZIndex will always return ''.
            element.style.zIndex = '';
            if (this._needsPositionStickyOnElement) {
                element.style.position = '';
            }
            element.classList.remove(this._stickCellCss);
        }
    }
    /**
     * Adds the sticky styling to the element by adding the sticky style class, changing position
     * to be sticky (and -webkit-sticky), setting the appropriate zIndex, and adding a sticky
     * direction and value.
     */
    _addStickyStyle(element, dir, dirValue, isBorderElement) {
        element.classList.add(this._stickCellCss);
        if (isBorderElement) {
            element.classList.add(this._borderCellCss[dir]);
        }
        element.style[dir] = `${dirValue}px`;
        element.style.zIndex = this._getCalculatedZIndex(element);
        if (this._needsPositionStickyOnElement) {
            element.style.cssText += 'position: -webkit-sticky; position: sticky; ';
        }
    }
    /**
     * Calculate what the z-index should be for the element, depending on what directions (top,
     * bottom, left, right) have been set. It should be true that elements with a top direction
     * should have the highest index since these are elements like a table header. If any of those
     * elements are also sticky in another direction, then they should appear above other elements
     * that are only sticky top (e.g. a sticky column on a sticky header). Bottom-sticky elements
     * (e.g. footer rows) should then be next in the ordering such that they are below the header
     * but above any non-sticky elements. Finally, left/right sticky elements (e.g. sticky columns)
     * should minimally increment so that they are above non-sticky elements but below top and bottom
     * elements.
     */
    _getCalculatedZIndex(element) {
        const zIndexIncrements = {
            top: 100,
            bottom: 10,
            left: 1,
            right: 1,
        };
        let zIndex = 0;
        // Use `Iterable` instead of `Array` because TypeScript, as of 3.6.3,
        // loses the array generic type in the `for of`. But we *also* have to use `Array` because
        // typescript won't iterate over an `Iterable` unless you compile with `--downlevelIteration`
        for (const dir of STICKY_DIRECTIONS) {
            if (element.style[dir]) {
                zIndex += zIndexIncrements[dir];
            }
        }
        return zIndex ? `${zIndex}` : '';
    }
    /** Gets the widths for each cell in the provided row. */
    _getCellWidths(row, recalculateCellWidths = true) {
        if (!recalculateCellWidths && this._cachedCellWidths.length) {
            return this._cachedCellWidths;
        }
        const cellWidths = [];
        const firstRowCells = row.children;
        for (let i = 0; i < firstRowCells.length; i++) {
            let cell = firstRowCells[i];
            cellWidths.push(cell.getBoundingClientRect().width);
        }
        this._cachedCellWidths = cellWidths;
        return cellWidths;
    }
    /**
     * Determines the left and right positions of each sticky column cell, which will be the
     * accumulation of all sticky column cell widths to the left and right, respectively.
     * Non-sticky cells do not need to have a value set since their positions will not be applied.
     */
    _getStickyStartColumnPositions(widths, stickyStates) {
        const positions = [];
        let nextPosition = 0;
        for (let i = 0; i < widths.length; i++) {
            if (stickyStates[i]) {
                positions[i] = nextPosition;
                nextPosition += widths[i];
            }
        }
        return positions;
    }
    /**
     * Determines the left and right positions of each sticky column cell, which will be the
     * accumulation of all sticky column cell widths to the left and right, respectively.
     * Non-sticky cells do not need to have a value set since their positions will not be applied.
     */
    _getStickyEndColumnPositions(widths, stickyStates) {
        const positions = [];
        let nextPosition = 0;
        for (let i = widths.length; i > 0; i--) {
            if (stickyStates[i]) {
                positions[i] = nextPosition;
                nextPosition += widths[i];
            }
        }
        return positions;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RpY2t5LXN0eWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdGFibGUvc3RpY2t5LXN0eWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFZSDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBc0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUV2Rjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUl2Qjs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsWUFDVSxrQkFBMkIsRUFDM0IsYUFBcUIsRUFDdEIsU0FBb0IsRUFDbkIsd0JBQWtELEVBQ2xELGFBQWEsSUFBSSxFQUNSLGdDQUFnQyxJQUFJLEVBQ3BDLGlCQUE2QztRQU50RCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQVM7UUFDM0Isa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDdEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNuQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELGVBQVUsR0FBVixVQUFVLENBQU87UUFDUixrQ0FBNkIsR0FBN0IsNkJBQTZCLENBQU87UUFDcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUE0QjtRQXhCeEQsc0JBQWlCLEdBQWEsRUFBRSxDQUFDO1FBMEJ2QyxJQUFJLENBQUMsY0FBYyxHQUFHO1lBQ3BCLEtBQUssRUFBRSxHQUFHLGFBQWEsa0JBQWtCO1lBQ3pDLFFBQVEsRUFBRSxHQUFHLGFBQWEscUJBQXFCO1lBQy9DLE1BQU0sRUFBRSxHQUFHLGFBQWEsbUJBQW1CO1lBQzNDLE9BQU8sRUFBRSxHQUFHLGFBQWEsb0JBQW9CO1NBQzlDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxzQkFBc0IsQ0FBQyxJQUFtQixFQUFFLGdCQUFtQztRQUM3RSxNQUFNLGVBQWUsR0FBa0IsRUFBRSxDQUFD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SUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckQ7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsOEJBQThCLENBQUMsTUFBZ0IsRUFBRSxZQUF1QjtRQUN0RSxNQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNuQixTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDO2dCQUM1QixZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDRCQUE0QixDQUFDLE1BQWdCLEVBQUUsWUFBdUI7UUFDcEUsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQy9CLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUVyQixLQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbkIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQztnQkFDNUIsWUFBWSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzQjtTQUNGO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogRGlyZWN0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHdoZW4gc2V0dGluZyBzdGlja3kgcG9zaXRpb25pbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge19Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcn0gZnJvbSAnLi9jb2FsZXNjZWQtc3R5bGUtc2NoZWR1bGVyJztcbmltcG9ydCB7U3RpY2t5UG9zaXRpb25pbmdMaXN0ZW5lcn0gZnJvbSAnLi9zdGlja3ktcG9zaXRpb24tbGlzdGVuZXInO1xuXG5leHBvcnQgdHlwZSBTdGlja3lEaXJlY3Rpb24gPSAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcblxuLyoqXG4gKiBMaXN0IG9mIGFsbCBwb3NzaWJsZSBkaXJlY3Rpb25zIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHN0aWNreSBwb3NpdGlvbmluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IFNUSUNLWV9ESVJFQ1RJT05TOiBTdGlja3lEaXJlY3Rpb25bXSA9IFsndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J107XG5cbi8qKlxuICogQXBwbGllcyBhbmQgcmVtb3ZlcyBzdGlja3kgcG9zaXRpb25pbmcgc3R5bGVzIHRvIHRoZSBgQ2RrVGFibGVgIHJvd3MgYW5kIGNvbHVtbnMgY2VsbHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGlja3lTdHlsZXIge1xuICBwcml2YXRlIF9jYWNoZWRDZWxsV2lkdGhzOiBudW1iZXJbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IF9ib3JkZXJDZWxsQ3NzOiBSZWFkb25seTx7W2QgaW4gU3RpY2t5RGlyZWN0aW9uXTogc3RyaW5nfT47XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBfaXNOYXRpdmVIdG1sVGFibGUgV2hldGhlciB0aGUgc3RpY2t5IGxvZ2ljIHNob3VsZCBiZSBiYXNlZCBvbiBhIHRhYmxlXG4gICAqICAgICB0aGF0IHVzZXMgdGhlIG5hdGl2ZSBgPHRhYmxlPmAgZWxlbWVudC5cbiAgICogQHBhcmFtIF9zdGlja0NlbGxDc3MgVGhlIENTUyBjbGFzcyB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byBldmVyeSByb3cvY2VsbCB0aGF0IGhhc1xuICAgKiAgICAgc3RpY2t5IHBvc2l0aW9uaW5nIGFwcGxpZWQuXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gVGhlIGRpcmVjdGlvbmFsaXR5IGNvbnRleHQgb2YgdGhlIHRhYmxlIChsdHIvcnRsKTsgYWZmZWN0cyBjb2x1bW4gcG9zaXRpb25pbmdcbiAgICogICAgIGJ5IHJldmVyc2luZyBsZWZ0L3JpZ2h0IHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIF9pc0Jyb3dzZXIgV2hldGhlciB0aGUgdGFibGUgaXMgY3VycmVudGx5IGJlaW5nIHJlbmRlcmVkIG9uIHRoZSBzZXJ2ZXIgb3IgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIF9uZWVkc1Bvc2l0aW9uU3RpY2t5T25FbGVtZW50IFdoZXRoZXIgd2UgbmVlZCB0byBzcGVjaWZ5IHBvc2l0aW9uOiBzdGlja3kgb24gY2VsbHNcbiAgICogICAgIHVzaW5nIGlubGluZSBzdHlsZXMuIElmIGZhbHNlLCBpdCBpcyBhc3N1bWVkIHRoYXQgcG9zaXRpb246IHN0aWNreSBpcyBpbmNsdWRlZCBpblxuICAgKiAgICAgdGhlIGNvbXBvbmVudCBzdHlsZXNoZWV0IGZvciBfc3RpY2tDZWxsQ3NzLlxuICAgKiBAcGFyYW0gX3Bvc2l0aW9uTGlzdGVuZXIgQSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIG9mIGNoYW5nZXMgdG8gc3RpY2t5IHJvd3MvY29sdW1uc1xuICAgKiAgICAgYW5kIHRoZWlyIGRpbWVuc2lvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9pc05hdGl2ZUh0bWxUYWJsZTogYm9vbGVhbixcbiAgICBwcml2YXRlIF9zdGlja0NlbGxDc3M6IHN0cmluZyxcbiAgICBwdWJsaWMgZGlyZWN0aW9uOiBEaXJlY3Rpb24sXG4gICAgcHJpdmF0ZSBfY29hbGVzY2VkU3R5bGVTY2hlZHVsZXI6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgICBwcml2YXRlIF9pc0Jyb3dzZXIgPSB0cnVlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25lZWRzUG9zaXRpb25TdGlja3lPbkVsZW1lbnQgPSB0cnVlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Bvc2l0aW9uTGlzdGVuZXI/OiBTdGlja3lQb3NpdGlvbmluZ0xpc3RlbmVyLFxuICApIHtcbiAgICB0aGlzLl9ib3JkZXJDZWxsQ3NzID0ge1xuICAgICAgJ3RvcCc6IGAke19zdGlja0NlbGxDc3N9LWJvcmRlci1lbGVtLXRvcGAsXG4gICAgICAnYm90dG9tJzogYCR7X3N0aWNrQ2VsbENzc30tYm9yZGVyLWVsZW0tYm90dG9tYCxcbiAgICAgICdsZWZ0JzogYCR7X3N0aWNrQ2VsbENzc30tYm9yZGVyLWVsZW0tbGVmdGAsXG4gICAgICAncmlnaHQnOiBgJHtfc3RpY2tDZWxsQ3NzfS1ib3JkZXItZWxlbS1yaWdodGAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHN0aWNreSBwb3NpdGlvbmluZyBzdHlsZXMgZnJvbSB0aGUgcm93IGFuZCBpdHMgY2VsbHMgYnkgcmVzZXR0aW5nIHRoZSBgcG9zaXRpb25gXG4gICAqIHN0eWxlLCBzZXR0aW5nIHRoZSB6SW5kZXggdG8gMCwgYW5kIHVuc2V0dGluZyBlYWNoIHByb3ZpZGVkIHN0aWNreSBkaXJlY3Rpb24uXG4gICAqIEBwYXJhbSByb3dzIFRoZSBsaXN0IG9mIHJvd3MgdGhhdCBzaG91bGQgYmUgY2xlYXJlZCBmcm9tIHN0aWNraW5nIGluIHRoZSBwcm92aWRlZCBkaXJlY3Rpb25zXG4gICAqIEBwYXJhbSBzdGlja3lEaXJlY3Rpb25zIFRoZSBkaXJlY3Rpb25zIHRoYXQgc2hvdWxkIG5vIGxvbmdlciBiZSBzZXQgYXMgc3RpY2t5IG9uIHRoZSByb3dzLlxuICAgKi9cbiAgY2xlYXJTdGlja3lQb3NpdGlvbmluZyhyb3dzOiBIVE1MRWxlbWVudFtdLCBzdGlja3lEaXJlY3Rpb25zOiBTdGlja3lEaXJlY3Rpb25bXSkge1xuICAgIGNvbnN0IGVsZW1lbnRzVG9DbGVhcjogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgIC8vIElmIHRoZSByb3cgaXNuJ3QgYW4gZWxlbWVudCAoZS5nLiBpZiBpdCdzIGFuIGBuZy1jb250YWluZXJgKSxcbiAgICAgIC8vIGl0IHdvbid0IGhhdmUgaW5saW5lIHN0eWxlcyBvciBgY2hpbGRyZW5gIHNvIHdlIHNraXAgaXQuXG4gICAgICBpZiAocm93Lm5vZGVUeXBlICE9PSByb3cuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50c1RvQ2xlYXIucHVzaChyb3cpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3cuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudHNUb0NsZWFyLnB1c2gocm93LmNoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb2FsZXNjZSB3aXRoIHN0aWNreSByb3cvY29sdW1uIHVwZGF0ZXMgKGFuZCBwb3RlbnRpYWxseSBvdGhlciBjaGFuZ2VzIGxpa2UgY29sdW1uIHJlc2l6ZSkuXG4gICAgdGhpcy5fY29hbGVzY2VkU3R5bGVTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzVG9DbGVhcikge1xuICAgICAgICB0aGlzLl9yZW1vdmVTdGlja3lTdHlsZShlbGVtZW50LCBzdGlja3lEaXJlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHN0aWNreSBsZWZ0IGFuZCByaWdodCBwb3NpdGlvbnMgdG8gdGhlIGNlbGxzIG9mIGVhY2ggcm93IGFjY29yZGluZyB0byB0aGUgc3RpY2t5XG4gICAqIHN0YXRlcyBvZiB0aGUgcmVuZGVyZWQgY29sdW1uIGRlZmluaXRpb25zLlxuICAgKiBAcGFyYW0gcm93cyBUaGUgcm93cyB0aGF0IHNob3VsZCBoYXZlIGl0cyBzZXQgb2YgY2VsbHMgc3R1Y2sgYWNjb3JkaW5nIHRvIHRoZSBzdGlja3kgc3RhdGVzLlxuICAgKiBAcGFyYW0gc3RpY2t5U3RhcnRTdGF0ZXMgQSBsaXN0IG9mIGJvb2xlYW4gc3RhdGVzIHdoZXJlIGVhY2ggc3RhdGUgcmVwcmVzZW50cyB3aGV0aGVyIHRoZSBjZWxsXG4gICAqICAgICBpbiB0aGlzIGluZGV4IHBvc2l0aW9uIHNob3VsZCBiZSBzdHVjayB0byB0aGUgc3RhcnQgb2YgdGhlIHJvdy5cbiAgICogQHBhcmFtIHN0aWNreUVuZFN0YXRlcyBBIGxpc3Qgb2YgYm9vbGVhbiBzdGF0ZXMgd2hlcmUgZWFjaCBzdGF0ZSByZXByZXNlbnRzIHdoZXRoZXIgdGhlIGNlbGxcbiAgICogICAgIGluIHRoaXMgaW5kZXggcG9zaXRpb24gc2hvdWxkIGJlIHN0dWNrIHRvIHRoZSBlbmQgb2YgdGhlIHJvdy5cbiAgICogQHBhcmFtIHJlY2FsY3VsYXRlQ2VsbFdpZHRocyBXaGV0aGVyIHRoZSBzdGlja3kgc3R5bGVyIHNob3VsZCByZWNhbGN1bGF0ZSB0aGUgd2lkdGggb2YgZWFjaFxuICAgKiAgICAgY29sdW1uIGNlbGwuIElmIGBmYWxzZWAgY2FjaGVkIHdpZHRocyB3aWxsIGJlIHVzZWQgaW5zdGVhZC5cbiAgICovXG4gIHVwZGF0ZVN0aWNreUNvbHVtbnMoXG4gICAgcm93czogSFRNTEVsZW1lbnRbXSxcbiAgICBzdGlja3lTdGFydFN0YXRlczogYm9vbGVhbltdLFxuICAgIHN0aWNreUVuZFN0YXRlczogYm9vbGVhbltdLFxuICAgIHJlY2FsY3VsYXRlQ2VsbFdpZHRocyA9IHRydWUsXG4gICkge1xuICAgIGlmIChcbiAgICAgICFyb3dzLmxlbmd0aCB8fFxuICAgICAgIXRoaXMuX2lzQnJvd3NlciB8fFxuICAgICAgIShzdGlja3lTdGFydFN0YXRlcy5zb21lKHN0YXRlID0+IHN0YXRlKSB8fCBzdGlja3lFbmRTdGF0ZXMuc29tZShzdGF0ZSA9PiBzdGF0ZSkpXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5fcG9zaXRpb25MaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkxpc3RlbmVyLnN0aWNreUNvbHVtbnNVcGRhdGVkKHtzaXplczogW119KTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25MaXN0ZW5lci5zdGlja3lFbmRDb2x1bW5zVXBkYXRlZCh7c2l6ZXM6IFtdfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdFJvdyA9IHJvd3NbMF07XG4gICAgY29uc3QgbnVtQ2VsbHMgPSBmaXJzdFJvdy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgY29uc3QgY2VsbFdpZHRoczogbnVtYmVyW10gPSB0aGlzLl9nZXRDZWxsV2lkdGhzKGZpcnN0Um93LCByZWNhbGN1bGF0ZUNlbGxXaWR0aHMpO1xuXG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbnMgPSB0aGlzLl9nZXRTdGlja3lTdGFydENvbHVtblBvc2l0aW9ucyhjZWxsV2lkdGhzLCBzdGlja3lTdGFydFN0YXRlcyk7XG4gICAgY29uc3QgZW5kUG9zaXRpb25zID0gdGhpcy5fZ2V0U3RpY2t5RW5kQ29sdW1uUG9zaXRpb25zKGNlbGxXaWR0aHMsIHN0aWNreUVuZFN0YXRlcyk7XG5cbiAgICBjb25zdCBsYXN0U3RpY2t5U3RhcnQgPSBzdGlja3lTdGFydFN0YXRlcy5sYXN0SW5kZXhPZih0cnVlKTtcbiAgICBjb25zdCBmaXJzdFN0aWNreUVuZCA9IHN0aWNreUVuZFN0YXRlcy5pbmRleE9mKHRydWUpO1xuXG4gICAgLy8gQ29hbGVzY2Ugd2l0aCBzdGlja3kgcm93IHVwZGF0ZXMgKGFuZCBwb3RlbnRpYWxseSBvdGhlciBjaGFuZ2VzIGxpa2UgY29sdW1uIHJlc2l6ZSkuXG4gICAgdGhpcy5fY29hbGVzY2VkU3R5bGVTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgY29uc3QgaXNSdGwgPSB0aGlzLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgICBjb25zdCBzdGFydCA9IGlzUnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICAgIGNvbnN0IGVuZCA9IGlzUnRsID8gJ2xlZnQnIDogJ3JpZ2h0JztcblxuICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNlbGxzOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjZWxsID0gcm93LmNoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGlmIChzdGlja3lTdGFydFN0YXRlc1tpXSkge1xuICAgICAgICAgICAgdGhpcy5fYWRkU3RpY2t5U3R5bGUoY2VsbCwgc3RhcnQsIHN0YXJ0UG9zaXRpb25zW2ldLCBpID09PSBsYXN0U3RpY2t5U3RhcnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGlja3lFbmRTdGF0ZXNbaV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZFN0aWNreVN0eWxlKGNlbGwsIGVuZCwgZW5kUG9zaXRpb25zW2ldLCBpID09PSBmaXJzdFN0aWNreUVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wb3NpdGlvbkxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uTGlzdGVuZXIuc3RpY2t5Q29sdW1uc1VwZGF0ZWQoe1xuICAgICAgICAgIHNpemVzOlxuICAgICAgICAgICAgbGFzdFN0aWNreVN0YXJ0ID09PSAtMVxuICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgIDogY2VsbFdpZHRoc1xuICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIGxhc3RTdGlja3lTdGFydCArIDEpXG4gICAgICAgICAgICAgICAgICAubWFwKCh3aWR0aCwgaW5kZXgpID0+IChzdGlja3lTdGFydFN0YXRlc1tpbmRleF0gPyB3aWR0aCA6IG51bGwpKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uTGlzdGVuZXIuc3RpY2t5RW5kQ29sdW1uc1VwZGF0ZWQoe1xuICAgICAgICAgIHNpemVzOlxuICAgICAgICAgICAgZmlyc3RTdGlja3lFbmQgPT09IC0xXG4gICAgICAgICAgICAgID8gW11cbiAgICAgICAgICAgICAgOiBjZWxsV2lkdGhzXG4gICAgICAgICAgICAgICAgICAuc2xpY2UoZmlyc3RTdGlja3lFbmQpXG4gICAgICAgICAgICAgICAgICAubWFwKCh3aWR0aCwgaW5kZXgpID0+IChzdGlja3lFbmRTdGF0ZXNbaW5kZXggKyBmaXJzdFN0aWNreUVuZF0gPyB3aWR0aCA6IG51bGwpKVxuICAgICAgICAgICAgICAgICAgLnJldmVyc2UoKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBzdGlja3kgcG9zaXRpb25pbmcgdG8gdGhlIHJvdydzIGNlbGxzIGlmIHVzaW5nIHRoZSBuYXRpdmUgdGFibGUgbGF5b3V0LCBhbmQgdG8gdGhlXG4gICAqIHJvdyBpdHNlbGYgb3RoZXJ3aXNlLlxuICAgKiBAcGFyYW0gcm93c1RvU3RpY2sgVGhlIGxpc3Qgb2Ygcm93cyB0aGF0IHNob3VsZCBiZSBzdHVjayBhY2NvcmRpbmcgdG8gdGhlaXIgY29ycmVzcG9uZGluZ1xuICAgKiAgICAgc3RpY2t5IHN0YXRlIGFuZCB0byB0aGUgcHJvdmlkZWQgdG9wIG9yIGJvdHRvbSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHN0aWNreVN0YXRlcyBBIGxpc3Qgb2YgYm9vbGVhbiBzdGF0ZXMgd2hlcmUgZWFjaCBzdGF0ZSByZXByZXNlbnRzIHdoZXRoZXIgdGhlIHJvd1xuICAgKiAgICAgc2hvdWxkIGJlIHN0dWNrIGluIHRoZSBwYXJ0aWN1bGFyIHRvcCBvciBib3R0b20gcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBUaGUgcG9zaXRpb24gZGlyZWN0aW9uIGluIHdoaWNoIHRoZSByb3cgc2hvdWxkIGJlIHN0dWNrIGlmIHRoYXQgcm93IHNob3VsZCBiZVxuICAgKiAgICAgc3RpY2t5LlxuICAgKlxuICAgKi9cbiAgc3RpY2tSb3dzKHJvd3NUb1N0aWNrOiBIVE1MRWxlbWVudFtdLCBzdGlja3lTdGF0ZXM6IGJvb2xlYW5bXSwgcG9zaXRpb246ICd0b3AnIHwgJ2JvdHRvbScpIHtcbiAgICAvLyBTaW5jZSB3ZSBjYW4ndCBtZWFzdXJlIHRoZSByb3dzIG9uIHRoZSBzZXJ2ZXIsIHdlIGNhbid0IHN0aWNrIHRoZSByb3dzIHByb3Blcmx5LlxuICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgcG9zaXRpb25pbmcgdGhlIHJvd3MgdG8gdGhlIGJvdHRvbSwgcmV2ZXJzZSB0aGVpciBvcmRlciB3aGVuIGV2YWx1YXRpbmcgdGhlIHN0aWNreVxuICAgIC8vIHBvc2l0aW9uIHN1Y2ggdGhhdCB0aGUgbGFzdCByb3cgc3R1Y2sgd2lsbCBiZSBcImJvdHRvbTogMHB4XCIgYW5kIHNvIG9uLiBOb3RlIHRoYXQgdGhlXG4gICAgLy8gc3RpY2t5IHN0YXRlcyBuZWVkIHRvIGJlIHJldmVyc2VkIGFzIHdlbGwuXG4gICAgY29uc3Qgcm93cyA9IHBvc2l0aW9uID09PSAnYm90dG9tJyA/IHJvd3NUb1N0aWNrLnNsaWNlKCkucmV2ZXJzZSgpIDogcm93c1RvU3RpY2s7XG4gICAgY29uc3Qgc3RhdGVzID0gcG9zaXRpb24gPT09ICdib3R0b20nID8gc3RpY2t5U3RhdGVzLnNsaWNlKCkucmV2ZXJzZSgpIDogc3RpY2t5U3RhdGVzO1xuXG4gICAgLy8gTWVhc3VyZSByb3cgaGVpZ2h0cyBhbGwgYXQgb25jZSBiZWZvcmUgYWRkaW5nIHN0aWNreSBzdHlsZXMgdG8gcmVkdWNlIGxheW91dCB0aHJhc2hpbmcuXG4gICAgY29uc3Qgc3RpY2t5T2Zmc2V0czogbnVtYmVyW10gPSBbXTtcbiAgICBjb25zdCBzdGlja3lDZWxsSGVpZ2h0czogKG51bWJlciB8IHVuZGVmaW5lZClbXSA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRzVG9TdGljazogSFRNTEVsZW1lbnRbXVtdID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwLCBzdGlja3lPZmZzZXQgPSAwOyByb3dJbmRleCA8IHJvd3MubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICBpZiAoIXN0YXRlc1tyb3dJbmRleF0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHN0aWNreU9mZnNldHNbcm93SW5kZXhdID0gc3RpY2t5T2Zmc2V0O1xuICAgICAgY29uc3Qgcm93ID0gcm93c1tyb3dJbmRleF07XG4gICAgICBlbGVtZW50c1RvU3RpY2tbcm93SW5kZXhdID0gdGhpcy5faXNOYXRpdmVIdG1sVGFibGVcbiAgICAgICAgPyAoQXJyYXkuZnJvbShyb3cuY2hpbGRyZW4pIGFzIEhUTUxFbGVtZW50W10pXG4gICAgICAgIDogW3Jvd107XG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHJvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICBzdGlja3lPZmZzZXQgKz0gaGVpZ2h0O1xuICAgICAgc3RpY2t5Q2VsbEhlaWdodHNbcm93SW5kZXhdID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IGJvcmRlcmVkUm93SW5kZXggPSBzdGF0ZXMubGFzdEluZGV4T2YodHJ1ZSk7XG5cbiAgICAvLyBDb2FsZXNjZSB3aXRoIG90aGVyIHN0aWNreSByb3cgdXBkYXRlcyAodG9wL2JvdHRvbSksIHN0aWNreSBjb2x1bW5zIHVwZGF0ZXNcbiAgICAvLyAoYW5kIHBvdGVudGlhbGx5IG90aGVyIGNoYW5nZXMgbGlrZSBjb2x1bW4gcmVzaXplKS5cbiAgICB0aGlzLl9jb2FsZXNjZWRTdHlsZVNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgcm93cy5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgaWYgKCFzdGF0ZXNbcm93SW5kZXhdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvZmZzZXQgPSBzdGlja3lPZmZzZXRzW3Jvd0luZGV4XTtcbiAgICAgICAgY29uc3QgaXNCb3JkZXJlZFJvd0luZGV4ID0gcm93SW5kZXggPT09IGJvcmRlcmVkUm93SW5kZXg7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50c1RvU3RpY2tbcm93SW5kZXhdKSB7XG4gICAgICAgICAgdGhpcy5fYWRkU3RpY2t5U3R5bGUoZWxlbWVudCwgcG9zaXRpb24sIG9mZnNldCwgaXNCb3JkZXJlZFJvd0luZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uTGlzdGVuZXI/LnN0aWNreUhlYWRlclJvd3NVcGRhdGVkKHtcbiAgICAgICAgICBzaXplczogc3RpY2t5Q2VsbEhlaWdodHMsXG4gICAgICAgICAgb2Zmc2V0czogc3RpY2t5T2Zmc2V0cyxcbiAgICAgICAgICBlbGVtZW50czogZWxlbWVudHNUb1N0aWNrLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uTGlzdGVuZXI/LnN0aWNreUZvb3RlclJvd3NVcGRhdGVkKHtcbiAgICAgICAgICBzaXplczogc3RpY2t5Q2VsbEhlaWdodHMsXG4gICAgICAgICAgb2Zmc2V0czogc3RpY2t5T2Zmc2V0cyxcbiAgICAgICAgICBlbGVtZW50czogZWxlbWVudHNUb1N0aWNrLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHVzaW5nIHRoZSBuYXRpdmUgdGFibGUgaW4gU2FmYXJpLCBzdGlja3kgZm9vdGVyIGNlbGxzIGRvIG5vdCBzdGljay4gVGhlIG9ubHkgd2F5IHRvIHN0aWNrXG4gICAqIGZvb3RlciByb3dzIGlzIHRvIGFwcGx5IHN0aWNreSBzdHlsaW5nIHRvIHRoZSB0Zm9vdCBjb250YWluZXIuIFRoaXMgc2hvdWxkIG9ubHkgYmUgZG9uZSBpZlxuICAgKiBhbGwgZm9vdGVyIHJvd3MgYXJlIHN0aWNreS4gSWYgbm90IGFsbCBmb290ZXIgcm93cyBhcmUgc3RpY2t5LCByZW1vdmUgc3RpY2t5IHBvc2l0aW9uaW5nIGZyb21cbiAgICogdGhlIHRmb290IGVsZW1lbnQuXG4gICAqL1xuICB1cGRhdGVTdGlja3lGb290ZXJDb250YWluZXIodGFibGVFbGVtZW50OiBFbGVtZW50LCBzdGlja3lTdGF0ZXM6IGJvb2xlYW5bXSkge1xuICAgIGlmICghdGhpcy5faXNOYXRpdmVIdG1sVGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0Zm9vdCA9IHRhYmxlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0Zm9vdCcpITtcblxuICAgIC8vIENvYWxlc2NlIHdpdGggb3RoZXIgc3RpY2t5IHVwZGF0ZXMgKGFuZCBwb3RlbnRpYWxseSBvdGhlciBjaGFuZ2VzIGxpa2UgY29sdW1uIHJlc2l6ZSkuXG4gICAgdGhpcy5fY29hbGVzY2VkU3R5bGVTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgaWYgKHN0aWNreVN0YXRlcy5zb21lKHN0YXRlID0+ICFzdGF0ZSkpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlU3RpY2t5U3R5bGUodGZvb3QsIFsnYm90dG9tJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWRkU3RpY2t5U3R5bGUodGZvb3QsICdib3R0b20nLCAwLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgc3RpY2t5IHN0eWxlIG9uIHRoZSBlbGVtZW50IGJ5IHJlbW92aW5nIHRoZSBzdGlja3kgY2VsbCBDU1MgY2xhc3MsIHJlLWV2YWx1YXRpbmdcbiAgICogdGhlIHpJbmRleCwgcmVtb3ZpbmcgZWFjaCBvZiB0aGUgcHJvdmlkZWQgc3RpY2t5IGRpcmVjdGlvbnMsIGFuZCByZW1vdmluZyB0aGVcbiAgICogc3RpY2t5IHBvc2l0aW9uIGlmIHRoZXJlIGFyZSBubyBtb3JlIGRpcmVjdGlvbnMuXG4gICAqL1xuICBfcmVtb3ZlU3RpY2t5U3R5bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHN0aWNreURpcmVjdGlvbnM6IFN0aWNreURpcmVjdGlvbltdKSB7XG4gICAgZm9yIChjb25zdCBkaXIgb2Ygc3RpY2t5RGlyZWN0aW9ucykge1xuICAgICAgZWxlbWVudC5zdHlsZVtkaXJdID0gJyc7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fYm9yZGVyQ2VsbENzc1tkaXJdKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBubyBsb25nZXIgaGFzIGFueSBtb3JlIHN0aWNreSBkaXJlY3Rpb25zLCByZW1vdmUgc3RpY2t5IHBvc2l0aW9uaW5nIGFuZFxuICAgIC8vIHRoZSBzdGlja3kgQ1NTIGNsYXNzLlxuICAgIC8vIFNob3J0LWNpcmN1aXQgY2hlY2tpbmcgZWxlbWVudC5zdHlsZVtkaXJdIGZvciBzdGlja3lEaXJlY3Rpb25zIGFzIHRoZXlcbiAgICAvLyB3ZXJlIGFscmVhZHkgcmVtb3ZlZCBhYm92ZS5cbiAgICBjb25zdCBoYXNEaXJlY3Rpb24gPSBTVElDS1lfRElSRUNUSU9OUy5zb21lKFxuICAgICAgZGlyID0+IHN0aWNreURpcmVjdGlvbnMuaW5kZXhPZihkaXIpID09PSAtMSAmJiBlbGVtZW50LnN0eWxlW2Rpcl0sXG4gICAgKTtcbiAgICBpZiAoaGFzRGlyZWN0aW9uKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IHRoaXMuX2dldENhbGN1bGF0ZWRaSW5kZXgoZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdoZW4gbm90IGhhc0RpcmVjdGlvbiwgX2dldENhbGN1bGF0ZWRaSW5kZXggd2lsbCBhbHdheXMgcmV0dXJuICcnLlxuICAgICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSAnJztcbiAgICAgIGlmICh0aGlzLl9uZWVkc1Bvc2l0aW9uU3RpY2t5T25FbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9zdGlja0NlbGxDc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBzdGlja3kgc3R5bGluZyB0byB0aGUgZWxlbWVudCBieSBhZGRpbmcgdGhlIHN0aWNreSBzdHlsZSBjbGFzcywgY2hhbmdpbmcgcG9zaXRpb25cbiAgICogdG8gYmUgc3RpY2t5IChhbmQgLXdlYmtpdC1zdGlja3kpLCBzZXR0aW5nIHRoZSBhcHByb3ByaWF0ZSB6SW5kZXgsIGFuZCBhZGRpbmcgYSBzdGlja3lcbiAgICogZGlyZWN0aW9uIGFuZCB2YWx1ZS5cbiAgICovXG4gIF9hZGRTdGlja3lTdHlsZShcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBkaXI6IFN0aWNreURpcmVjdGlvbixcbiAgICBkaXJWYWx1ZTogbnVtYmVyLFxuICAgIGlzQm9yZGVyRWxlbWVudDogYm9vbGVhbixcbiAgKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3N0aWNrQ2VsbENzcyk7XG4gICAgaWYgKGlzQm9yZGVyRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX2JvcmRlckNlbGxDc3NbZGlyXSk7XG4gICAgfVxuICAgIGVsZW1lbnQuc3R5bGVbZGlyXSA9IGAke2RpclZhbHVlfXB4YDtcbiAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IHRoaXMuX2dldENhbGN1bGF0ZWRaSW5kZXgoZWxlbWVudCk7XG4gICAgaWYgKHRoaXMuX25lZWRzUG9zaXRpb25TdGlja3lPbkVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCArPSAncG9zaXRpb246IC13ZWJraXQtc3RpY2t5OyBwb3NpdGlvbjogc3RpY2t5OyAnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgd2hhdCB0aGUgei1pbmRleCBzaG91bGQgYmUgZm9yIHRoZSBlbGVtZW50LCBkZXBlbmRpbmcgb24gd2hhdCBkaXJlY3Rpb25zICh0b3AsXG4gICAqIGJvdHRvbSwgbGVmdCwgcmlnaHQpIGhhdmUgYmVlbiBzZXQuIEl0IHNob3VsZCBiZSB0cnVlIHRoYXQgZWxlbWVudHMgd2l0aCBhIHRvcCBkaXJlY3Rpb25cbiAgICogc2hvdWxkIGhhdmUgdGhlIGhpZ2hlc3QgaW5kZXggc2luY2UgdGhlc2UgYXJlIGVsZW1lbnRzIGxpa2UgYSB0YWJsZSBoZWFkZXIuIElmIGFueSBvZiB0aG9zZVxuICAgKiBlbGVtZW50cyBhcmUgYWxzbyBzdGlja3kgaW4gYW5vdGhlciBkaXJlY3Rpb24sIHRoZW4gdGhleSBzaG91bGQgYXBwZWFyIGFib3ZlIG90aGVyIGVsZW1lbnRzXG4gICAqIHRoYXQgYXJlIG9ubHkgc3RpY2t5IHRvcCAoZS5nLiBhIHN0aWNreSBjb2x1bW4gb24gYSBzdGlja3kgaGVhZGVyKS4gQm90dG9tLXN0aWNreSBlbGVtZW50c1xuICAgKiAoZS5nLiBmb290ZXIgcm93cykgc2hvdWxkIHRoZW4gYmUgbmV4dCBpbiB0aGUgb3JkZXJpbmcgc3VjaCB0aGF0IHRoZXkgYXJlIGJlbG93IHRoZSBoZWFkZXJcbiAgICogYnV0IGFib3ZlIGFueSBub24tc3RpY2t5IGVsZW1lbnRzLiBGaW5hbGx5LCBsZWZ0L3JpZ2h0IHN0aWNreSBlbGVtZW50cyAoZS5nLiBzdGlja3kgY29sdW1ucylcbiAgICogc2hvdWxkIG1pbmltYWxseSBpbmNyZW1lbnQgc28gdGhhdCB0aGV5IGFyZSBhYm92ZSBub24tc3RpY2t5IGVsZW1lbnRzIGJ1dCBiZWxvdyB0b3AgYW5kIGJvdHRvbVxuICAgKiBlbGVtZW50cy5cbiAgICovXG4gIF9nZXRDYWxjdWxhdGVkWkluZGV4KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCB6SW5kZXhJbmNyZW1lbnRzID0ge1xuICAgICAgdG9wOiAxMDAsXG4gICAgICBib3R0b206IDEwLFxuICAgICAgbGVmdDogMSxcbiAgICAgIHJpZ2h0OiAxLFxuICAgIH07XG5cbiAgICBsZXQgekluZGV4ID0gMDtcbiAgICAvLyBVc2UgYEl0ZXJhYmxlYCBpbnN0ZWFkIG9mIGBBcnJheWAgYmVjYXVzZSBUeXBlU2NyaXB0LCBhcyBvZiAzLjYuMyxcbiAgICAvLyBsb3NlcyB0aGUgYXJyYXkgZ2VuZXJpYyB0eXBlIGluIHRoZSBgZm9yIG9mYC4gQnV0IHdlICphbHNvKiBoYXZlIHRvIHVzZSBgQXJyYXlgIGJlY2F1c2VcbiAgICAvLyB0eXBlc2NyaXB0IHdvbid0IGl0ZXJhdGUgb3ZlciBhbiBgSXRlcmFibGVgIHVubGVzcyB5b3UgY29tcGlsZSB3aXRoIGAtLWRvd25sZXZlbEl0ZXJhdGlvbmBcbiAgICBmb3IgKGNvbnN0IGRpciBvZiBTVElDS1lfRElSRUNUSU9OUyBhcyBJdGVyYWJsZTxTdGlja3lEaXJlY3Rpb24+ICYgU3RpY2t5RGlyZWN0aW9uW10pIHtcbiAgICAgIGlmIChlbGVtZW50LnN0eWxlW2Rpcl0pIHtcbiAgICAgICAgekluZGV4ICs9IHpJbmRleEluY3JlbWVudHNbZGlyXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gekluZGV4ID8gYCR7ekluZGV4fWAgOiAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB3aWR0aHMgZm9yIGVhY2ggY2VsbCBpbiB0aGUgcHJvdmlkZWQgcm93LiAqL1xuICBfZ2V0Q2VsbFdpZHRocyhyb3c6IEhUTUxFbGVtZW50LCByZWNhbGN1bGF0ZUNlbGxXaWR0aHMgPSB0cnVlKTogbnVtYmVyW10ge1xuICAgIGlmICghcmVjYWxjdWxhdGVDZWxsV2lkdGhzICYmIHRoaXMuX2NhY2hlZENlbGxXaWR0aHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVkQ2VsbFdpZHRocztcbiAgICB9XG5cbiAgICBjb25zdCBjZWxsV2lkdGhzOiBudW1iZXJbXSA9IFtdO1xuICAgIGNvbnN0IGZpcnN0Um93Q2VsbHMgPSByb3cuY2hpbGRyZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaXJzdFJvd0NlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2VsbDogSFRNTEVsZW1lbnQgPSBmaXJzdFJvd0NlbGxzW2ldIGFzIEhUTUxFbGVtZW50O1xuICAgICAgY2VsbFdpZHRocy5wdXNoKGNlbGwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgpO1xuICAgIH1cblxuICAgIHRoaXMuX2NhY2hlZENlbGxXaWR0aHMgPSBjZWxsV2lkdGhzO1xuICAgIHJldHVybiBjZWxsV2lkdGhzO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGxlZnQgYW5kIHJpZ2h0IHBvc2l0aW9ucyBvZiBlYWNoIHN0aWNreSBjb2x1bW4gY2VsbCwgd2hpY2ggd2lsbCBiZSB0aGVcbiAgICogYWNjdW11bGF0aW9uIG9mIGFsbCBzdGlja3kgY29sdW1uIGNlbGwgd2lkdGhzIHRvIHRoZSBsZWZ0IGFuZCByaWdodCwgcmVzcGVjdGl2ZWx5LlxuICAgKiBOb24tc3RpY2t5IGNlbGxzIGRvIG5vdCBuZWVkIHRvIGhhdmUgYSB2YWx1ZSBzZXQgc2luY2UgdGhlaXIgcG9zaXRpb25zIHdpbGwgbm90IGJlIGFwcGxpZWQuXG4gICAqL1xuICBfZ2V0U3RpY2t5U3RhcnRDb2x1bW5Qb3NpdGlvbnMod2lkdGhzOiBudW1iZXJbXSwgc3RpY2t5U3RhdGVzOiBib29sZWFuW10pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xuICAgIGxldCBuZXh0UG9zaXRpb24gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdGlja3lTdGF0ZXNbaV0pIHtcbiAgICAgICAgcG9zaXRpb25zW2ldID0gbmV4dFBvc2l0aW9uO1xuICAgICAgICBuZXh0UG9zaXRpb24gKz0gd2lkdGhzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgbGVmdCBhbmQgcmlnaHQgcG9zaXRpb25zIG9mIGVhY2ggc3RpY2t5IGNvbHVtbiBjZWxsLCB3aGljaCB3aWxsIGJlIHRoZVxuICAgKiBhY2N1bXVsYXRpb24gb2YgYWxsIHN0aWNreSBjb2x1bW4gY2VsbCB3aWR0aHMgdG8gdGhlIGxlZnQgYW5kIHJpZ2h0LCByZXNwZWN0aXZlbHkuXG4gICAqIE5vbi1zdGlja3kgY2VsbHMgZG8gbm90IG5lZWQgdG8gaGF2ZSBhIHZhbHVlIHNldCBzaW5jZSB0aGVpciBwb3NpdGlvbnMgd2lsbCBub3QgYmUgYXBwbGllZC5cbiAgICovXG4gIF9nZXRTdGlja3lFbmRDb2x1bW5Qb3NpdGlvbnMod2lkdGhzOiBudW1iZXJbXSwgc3RpY2t5U3RhdGVzOiBib29sZWFuW10pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xuICAgIGxldCBuZXh0UG9zaXRpb24gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IHdpZHRocy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGlmIChzdGlja3lTdGF0ZXNbaV0pIHtcbiAgICAgICAgcG9zaXRpb25zW2ldID0gbmV4dFBvc2l0aW9uO1xuICAgICAgICBuZXh0UG9zaXRpb24gKz0gd2lkdGhzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cbn1cbiJdfQ==