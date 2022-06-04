"use strict";
/**
 * Copyright (c) 2015-present, Waysact Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunkToManifestMap = exports.buildTopologicallySortedChunkGraph = exports.generateSriHashPlaceholders = exports.notNil = exports.findChunks = exports.makePlaceholder = exports.computeIntegrity = exports.placeholderPrefix = exports.normalizePath = exports.getTagSrc = exports.assert = exports.sriHashVariableReference = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
exports.sriHashVariableReference = "__webpack_require__.sriHashes";
function assert(value, message) {
    if (!value) {
        throw new Error(message);
    }
}
exports.assert = assert;
function getTagSrc(tag) {
    if (!["script", "link"].includes(tag.tagName) || !tag.attributes) {
        return undefined;
    }
    if (typeof tag.attributes.href === "string") {
        return tag.attributes.href;
    }
    if (typeof tag.attributes.src === "string") {
        return tag.attributes.src;
    }
    return undefined;
}
exports.getTagSrc = getTagSrc;
const normalizePath = (p) => p.replace(/\?.*$/, "").split(path_1.sep).join("/");
exports.normalizePath = normalizePath;
exports.placeholderPrefix = "*-*-*-CHUNK-SRI-HASH-";
const computeIntegrity = (hashFuncNames, source) => {
    const result = hashFuncNames
        .map((hashFuncName) => hashFuncName +
        "-" +
        crypto_1.createHash(hashFuncName)
            .update(typeof source === "string" ? Buffer.from(source, "utf-8") : source)
            .digest("base64"))
        .join(" ");
    return result;
};
exports.computeIntegrity = computeIntegrity;
const makePlaceholder = (hashFuncNames, id) => {
    const placeholder = `${exports.placeholderPrefix}${id}`;
    const filler = exports.computeIntegrity(hashFuncNames, placeholder);
    return exports.placeholderPrefix + filler.substring(exports.placeholderPrefix.length);
};
exports.makePlaceholder = makePlaceholder;
function findChunks(chunk) {
    const allChunks = new Set();
    const groupsVisited = new Set();
    function addIfNotExist(set, item) {
        if (set.has(item))
            return true;
        set.add(item);
        return false;
    }
    (function recurseChunk(childChunk) {
        function recurseGroup(group) {
            if (addIfNotExist(groupsVisited, group.id))
                return;
            group.chunks.forEach(recurseChunk);
            group.childrenIterable.forEach(recurseGroup);
        }
        if (addIfNotExist(allChunks, childChunk))
            return;
        Array.from(childChunk.groupsIterable).forEach(recurseGroup);
    })(chunk);
    return allChunks;
}
exports.findChunks = findChunks;
function notNil(value) {
    return value !== null && value !== undefined;
}
exports.notNil = notNil;
function generateSriHashPlaceholders(chunks, hashFuncNames) {
    return Array.from(chunks).reduce((sriHashes, depChunk) => {
        if (depChunk.id) {
            sriHashes[depChunk.id] = exports.makePlaceholder(hashFuncNames, depChunk.id);
        }
        return sriHashes;
    }, {});
}
exports.generateSriHashPlaceholders = generateSriHashPlaceholders;
function* intersect(sets) {
    const { value: initialSet } = sets[Symbol.iterator]().next();
    if (!initialSet) {
        return;
    }
    initialSetLoop: for (const item of initialSet) {
        for (const set of sets) {
            if (!set.has(item)) {
                continue initialSetLoop;
            }
        }
        yield item;
    }
}
function* map(items, fn) {
    for (const item of items) {
        yield fn(item);
    }
}
function* flatMap(collections, fn) {
    for (const item of collections) {
        for (const result of fn(item)) {
            yield result;
        }
    }
}
/**
 * Tarjan's strongly connected components algorithm
 * https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
 */
function createDAGfromGraph({ vertices, edges, }) {
    var _a;
    let index = 0;
    const stack = [];
    const vertexMetadata = new Map(map(vertices, (vertex) => [vertex, {}]));
    const stronglyConnectedComponents = new Set();
    function strongConnect(vertex) {
        var _a, _b;
        // Set the depth index for v to the smallest unused index
        const vertexData = vertexMetadata.get(vertex);
        assert(vertexData, "Vertex metadata missing");
        vertexData.index = index;
        vertexData.lowlink = index;
        index++;
        stack.push(vertex);
        vertexData.onstack = true;
        for (const child of (_a = edges.get(vertex)) !== null && _a !== void 0 ? _a : []) {
            const childData = vertexMetadata.get(child);
            assert(childData, "Child vertex metadata missing");
            if (childData.index === undefined) {
                // Child has not yet been visited; recurse on it
                strongConnect(child);
                vertexData.lowlink = Math.min(vertexData.lowlink, (_b = childData.lowlink) !== null && _b !== void 0 ? _b : Infinity);
            }
            else if (childData.onstack) {
                // Child is in stack and hence in the current SCC
                // If child is not on stack, then (vertex, child) is an edge pointing to an SCC already found and must be ignored
                // Note: The next line may look odd - but is correct.
                // It says childData.index not childData.lowlink; that is deliberate and from the original paper
                vertexData.lowlink = Math.min(vertexData.lowlink, childData.index);
            }
        }
        // If vertex is a root node, pop the stack and generate an SCC
        if (vertexData.index === vertexData.lowlink) {
            const newStronglyConnectedComponent = { nodes: new Set() };
            let currentNode;
            do {
                currentNode = stack.pop();
                assert(currentNode, "Working stack was empty");
                const metadata = vertexMetadata.get(currentNode);
                assert(metadata, "All nodes on stack should have metadata");
                metadata.onstack = false;
                newStronglyConnectedComponent.nodes.add(currentNode);
            } while (currentNode !== vertex);
            stronglyConnectedComponents.add(newStronglyConnectedComponent);
        }
    }
    for (const vertex of vertices) {
        const data = vertexMetadata.get(vertex);
        assert(data, "Vertex metadata not found");
        if (data.index === undefined) {
            strongConnect(vertex);
        }
    }
    // Now that all SCCs have been identified, rebuild the graph
    const vertexToSCCMap = new Map();
    const sccEdges = new Map();
    for (const scc of stronglyConnectedComponents) {
        for (const vertex of scc.nodes) {
            vertexToSCCMap.set(vertex, scc);
        }
    }
    for (const scc of stronglyConnectedComponents) {
        const childSCCNodes = new Set();
        for (const vertex of scc.nodes) {
            for (const childVertex of (_a = edges.get(vertex)) !== null && _a !== void 0 ? _a : []) {
                const childScc = vertexToSCCMap.get(childVertex);
                if (childScc && childScc !== scc) {
                    childSCCNodes.add(childScc);
                }
            }
        }
        sccEdges.set(scc, childSCCNodes);
    }
    return { vertices: stronglyConnectedComponents, edges: sccEdges };
}
// This implementation assumes a directed acyclic graph (such as one produced by createDAGfromGraph),
// and does not attempt to detect cycles
function topologicalSort({ vertices, edges }) {
    const sortedItems = [];
    const seenNodes = new Set();
    function visit(node) {
        var _a;
        if (seenNodes.has(node)) {
            return;
        }
        seenNodes.add(node);
        for (const child of (_a = edges.get(node)) !== null && _a !== void 0 ? _a : []) {
            visit(child);
        }
        sortedItems.push(node);
    }
    for (const vertex of vertices) {
        visit(vertex);
    }
    return sortedItems;
}
function buildTopologicallySortedChunkGraph(chunks) {
    var _a;
    const vertices = new Set();
    const edges = new Map();
    // Chunks should have *all* chunks, not simply entry chunks
    for (const vertex of chunks) {
        if (vertices.has(vertex)) {
            continue;
        }
        vertices.add(vertex);
        edges.set(vertex, new Set());
        for (const vertexGroup of vertex.groupsIterable) {
            for (const childGroup of vertexGroup.childrenIterable) {
                for (const childChunk of childGroup.chunks) {
                    (_a = edges.get(vertex)) === null || _a === void 0 ? void 0 : _a.add(childChunk);
                }
            }
        }
    }
    const dag = createDAGfromGraph({ vertices, edges });
    const sortedVertices = topologicalSort(dag);
    const chunkToSccMap = new Map(flatMap(dag.vertices, (scc) => map(scc.nodes, (chunk) => [chunk, scc])));
    return [sortedVertices, dag, chunkToSccMap];
}
exports.buildTopologicallySortedChunkGraph = buildTopologicallySortedChunkGraph;
function getChunkToManifestMap(chunks) {
    var _a;
    const [sortedVertices, , chunkToSccMap] = buildTopologicallySortedChunkGraph(chunks);
    // This map tracks which hashes a chunk group has in its manifest and the intersection
    // of all its parents (and intersection of all their parents, etc.)
    // This is meant as a guarantee that the hash for a given chunk is handled by a chunk group
    // or its parents regardless of the tree traversal used from the roots
    const hashesByChunkGroupAndParents = new Map();
    // A map of what child chunks a given chunk should contain hashes for
    const chunkManifest = new Map();
    function intersectSets(setsToIntersect) {
        return new Set(intersect(setsToIntersect));
    }
    function findIntersectionOfParentSets(chunk) {
        var _a;
        const setsToIntersect = [];
        for (const group of chunk.groupsIterable) {
            for (const parent of group.parentsIterable) {
                setsToIntersect.push((_a = hashesByChunkGroupAndParents.get(parent)) !== null && _a !== void 0 ? _a : new Set());
            }
        }
        return intersectSets(setsToIntersect);
    }
    function getChildChunksToAddToChunkManifest(chunk) {
        var _a;
        const childChunks = new Set();
        const chunkSCC = chunkToSccMap.get(chunk);
        for (const chunkGroup of chunk.groupsIterable) {
            if (chunkGroup.chunks[chunkGroup.chunks.length - 1] !== chunk) {
                // Only add sri hashes for one chunk per chunk group,
                // where the last chunk in the group is the primary chunk
                continue;
            }
            for (const childGroup of chunkGroup.childrenIterable) {
                for (const childChunk of childGroup.chunks) {
                    const childChunkSCC = chunkToSccMap.get(childChunk);
                    if (childChunkSCC === chunkSCC) {
                        // Don't include your own SCC.
                        // Your parent will have the hashes for your SCC siblings
                        continue;
                    }
                    for (const childChunkSccNode of (_a = childChunkSCC === null || childChunkSCC === void 0 ? void 0 : childChunkSCC.nodes) !== null && _a !== void 0 ? _a : []) {
                        childChunks.add(childChunkSccNode);
                    }
                }
            }
        }
        const parentManifest = findIntersectionOfParentSets(chunk);
        for (const manifestEntry of parentManifest) {
            childChunks.delete(manifestEntry);
        }
        return childChunks;
    }
    // We want to walk from the root nodes down to the leaves
    for (let i = sortedVertices.length - 1; i >= 0; i--) {
        const scc = sortedVertices[i];
        for (const chunk of scc.nodes) {
            const manifest = getChildChunksToAddToChunkManifest(chunk);
            const combinedParentManifest = findIntersectionOfParentSets(chunk);
            for (const chunk of manifest) {
                if (combinedParentManifest.has(chunk)) {
                    manifest.delete(chunk);
                }
                else {
                    combinedParentManifest.add(chunk);
                }
            }
            chunkManifest.set(chunk, manifest);
            for (const group of chunk.groupsIterable) {
                // Get intersection of all parent manifests
                const groupCombinedManifest = intersectSets(map(group.parentsIterable, (parent) => { var _a; return (_a = hashesByChunkGroupAndParents.get(parent)) !== null && _a !== void 0 ? _a : new Set(); }));
                // Add this chunk's manifest
                for (const chunk of manifest) {
                    groupCombinedManifest.add(chunk);
                }
                // Add any existing manifests part of the group
                for (const chunk of (_a = hashesByChunkGroupAndParents.get(group)) !== null && _a !== void 0 ? _a : new Set()) {
                    groupCombinedManifest.add(chunk);
                }
                hashesByChunkGroupAndParents.set(group, groupCombinedManifest);
            }
        }
    }
    return [sortedVertices, chunkManifest];
}
exports.getChunkToManifestMap = getChunkToManifestMap;
//# sourceMappingURL=util.js.map