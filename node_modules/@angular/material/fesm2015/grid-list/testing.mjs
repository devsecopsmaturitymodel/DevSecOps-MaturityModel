import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';
import { ɵTileCoordinator } from '@angular/material/grid-list';

/** Harness for interacting with a standard `MatGridTitle` in tests. */
class MatGridTileHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._header = this.locatorForOptional(".mat-grid-tile-header" /* HEADER */);
        this._footer = this.locatorForOptional(".mat-grid-tile-footer" /* FOOTER */);
        this._avatar = this.locatorForOptional('.mat-grid-avatar');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridTileHarness, options)
            .addOption('headerText', options.headerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getHeaderText(), pattern))
            .addOption('footerText', options.footerText, (harness, pattern) => HarnessPredicate.stringMatches(harness.getFooterText(), pattern));
    }
    /** Gets the amount of rows that the grid-tile takes up. */
    getRowspan() {
        return __awaiter(this, void 0, void 0, function* () {
            return Number(yield (yield this.host()).getAttribute('rowspan'));
        });
    }
    /** Gets the amount of columns that the grid-tile takes up. */
    getColspan() {
        return __awaiter(this, void 0, void 0, function* () {
            return Number(yield (yield this.host()).getAttribute('colspan'));
        });
    }
    /** Whether the grid-tile has a header. */
    hasHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._header()) !== null;
        });
    }
    /** Whether the grid-tile has a footer. */
    hasFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._footer()) !== null;
        });
    }
    /** Whether the grid-tile has an avatar. */
    hasAvatar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._avatar()) !== null;
        });
    }
    /** Gets the text of the header if present. */
    getHeaderText() {
        return __awaiter(this, void 0, void 0, function* () {
            // For performance reasons, we do not use "hasHeader" as
            // we would then need to query twice for the header.
            const headerEl = yield this._header();
            return headerEl ? headerEl.text() : null;
        });
    }
    /** Gets the text of the footer if present. */
    getFooterText() {
        return __awaiter(this, void 0, void 0, function* () {
            // For performance reasons, we do not use "hasFooter" as
            // we would then need to query twice for the footer.
            const headerEl = yield this._footer();
            return headerEl ? headerEl.text() : null;
        });
    }
}
/** The selector for the host element of a `MatGridTile` instance. */
MatGridTileHarness.hostSelector = '.mat-grid-tile';

/** Harness for interacting with a standard `MatGridList` in tests. */
class MatGridListHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /**
         * Tile coordinator that is used by the "MatGridList" for computing
         * positions of tiles. We leverage the coordinator to provide an API
         * for retrieving tiles based on visual tile positions.
         */
        this._tileCoordinator = new ɵTileCoordinator();
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatGridListHarness, options);
    }
    /** Gets all tiles of the grid-list. */
    getTiles(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.locatorForAll(MatGridTileHarness.with(filters))();
        });
    }
    /** Gets the amount of columns of the grid-list. */
    getColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            return Number(yield (yield this.host()).getAttribute('cols'));
        });
    }
    /**
     * Gets a tile of the grid-list that is located at the given location.
     * @param row Zero-based row index.
     * @param column Zero-based column index.
     */
    getTileAtPosition({ row, column, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [tileHarnesses, columns] = yield parallel(() => [this.getTiles(), this.getColumns()]);
            const tileSpans = tileHarnesses.map(t => parallel(() => [t.getColspan(), t.getRowspan()]));
            const tiles = (yield parallel(() => tileSpans)).map(([colspan, rowspan]) => ({
                colspan,
                rowspan,
            }));
            // Update the tile coordinator to reflect the current column amount and
            // rendered tiles. We update upon every call of this method since we do not
            // know if tiles have been added, removed or updated (in terms of rowspan/colspan).
            this._tileCoordinator.update(columns, tiles);
            // The tile coordinator respects the colspan and rowspan for calculating the positions
            // of tiles, but it does not create multiple position entries if a tile spans over multiple
            // columns or rows. We want to provide an API where developers can retrieve a tile based on
            // any position that lies within the visual tile boundaries. For example: If a tile spans
            // over two columns, then the same tile should be returned for either column indices.
            for (let i = 0; i < this._tileCoordinator.positions.length; i++) {
                const position = this._tileCoordinator.positions[i];
                const { rowspan, colspan } = tiles[i];
                // Return the tile harness if the given position visually resolves to the tile.
                if (column >= position.col &&
                    column <= position.col + colspan - 1 &&
                    row >= position.row &&
                    row <= position.row + rowspan - 1) {
                    return tileHarnesses[i];
                }
            }
            throw Error('Could not find tile at given position.');
        });
    }
}
/** The selector for the host element of a `MatGridList` instance. */
MatGridListHarness.hostSelector = '.mat-grid-list';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatGridListHarness, MatGridTileHarness };
//# sourceMappingURL=testing.mjs.map
