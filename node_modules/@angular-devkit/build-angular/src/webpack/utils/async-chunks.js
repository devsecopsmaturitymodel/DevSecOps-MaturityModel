"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsyncChunksNonInitial = void 0;
/**
 * Webpack stats may incorrectly mark extra entry points `initial` chunks, when
 * they are actually loaded asynchronously and thus not in the main bundle. This
 * function finds extra entry points in Webpack stats and corrects this value
 * whereever necessary. Does not modify {@param webpackStats}.
 */
function markAsyncChunksNonInitial(webpackStats, extraEntryPoints) {
    const { chunks = [], entrypoints: entryPoints = {} } = webpackStats;
    // Find all Webpack chunk IDs not injected into the main bundle. We don't have
    // to worry about transitive dependencies because extra entry points cannot be
    // depended upon in Webpack, thus any extra entry point with `inject: false`,
    // **cannot** be loaded in main bundle.
    const asyncChunkIds = extraEntryPoints
        .filter((entryPoint) => !entryPoint.inject && entryPoints[entryPoint.bundleName])
        .flatMap((entryPoint) => { var _a; return (_a = entryPoints[entryPoint.bundleName].chunks) === null || _a === void 0 ? void 0 : _a.filter((n) => n !== 'runtime'); });
    // Find chunks for each ID.
    const asyncChunks = asyncChunkIds.map((chunkId) => {
        const chunk = chunks.find((chunk) => chunk.id === chunkId);
        if (!chunk) {
            throw new Error(`Failed to find chunk (${chunkId}) in set:\n${JSON.stringify(chunks)}`);
        }
        return chunk;
    });
    // A chunk is considered `initial` only if Webpack already belives it to be initial
    // and the application developer did not mark it async via an extra entry point.
    return chunks.map((chunk) => {
        return asyncChunks.find((asyncChunk) => asyncChunk === chunk)
            ? {
                ...chunk,
                initial: false,
            }
            : chunk;
    });
}
exports.markAsyncChunksNonInitial = markAsyncChunksNonInitial;
