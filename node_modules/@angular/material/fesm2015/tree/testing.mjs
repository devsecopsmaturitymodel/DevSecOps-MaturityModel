import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a standard Angular Material tree node. */
class MatTreeNodeHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._toggle = this.locatorForOptional('[matTreeNodeToggle]');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree node with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getNodePredicate(MatTreeNodeHarness, options);
    }
    /** Whether the tree node is expanded. */
    isExpanded() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceBooleanProperty(yield (yield this.host()).getAttribute('aria-expanded'));
        });
    }
    /** Whether the tree node is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceBooleanProperty(yield (yield this.host()).getProperty('aria-disabled'));
        });
    }
    /** Gets the level of the tree node. Note that this gets the aria-level and is 1 indexed. */
    getLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-level'));
        });
    }
    /** Gets the tree node's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text({ exclude: '.mat-tree-node, .mat-nested-tree-node, button' });
        });
    }
    /** Toggles node between expanded/collapsed. Only works when node is not disabled. */
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            const toggle = yield this._toggle();
            if (toggle) {
                return toggle.click();
            }
        });
    }
    /** Expands the node if it is collapsed. Only works when node is not disabled. */
    expand() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isExpanded())) {
                yield this.toggle();
            }
        });
    }
    /** Collapses the node if it is expanded. Only works when node is not disabled. */
    collapse() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isExpanded()) {
                yield this.toggle();
            }
        });
    }
}
/** The selector of the host element of a `MatTreeNode` instance. */
MatTreeNodeHarness.hostSelector = '.mat-tree-node, .mat-nested-tree-node';
function getNodePredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isDisabled()) === disabled; }))
        .addOption('expanded', options.expanded, (harness, expanded) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isExpanded()) === expanded; }))
        .addOption('level', options.level, (harness, level) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getLevel()) === level; }));
}

/** Harness for interacting with a standard mat-tree in tests. */
class MatTreeHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTreeHarness, options);
    }
    /** Gets all of the nodes in the tree. */
    getNodes(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatTreeNodeHarness.with(filter))();
        });
    }
    /**
     * Gets an object representation for the visible tree structure
     * If a node is under an unexpanded node it will not be included.
     * Eg.
     * Tree (all nodes expanded):
     * `
     * <mat-tree>
     *   <mat-tree-node>Node 1<mat-tree-node>
     *   <mat-nested-tree-node>
     *     Node 2
     *     <mat-nested-tree-node>
     *       Node 2.1
     *       <mat-tree-node>
     *         Node 2.1.1
     *       <mat-tree-node>
     *     <mat-nested-tree-node>
     *     <mat-tree-node>
     *       Node 2.2
     *     <mat-tree-node>
     *   <mat-nested-tree-node>
     * </mat-tree>`
     *
     * Tree structure:
     * {
     *  children: [
     *    {
     *      text: 'Node 1',
     *      children: [
     *        {
     *          text: 'Node 2',
     *          children: [
     *            {
     *              text: 'Node 2.1',
     *              children: [{text: 'Node 2.1.1'}]
     *            },
     *            {text: 'Node 2.2'}
     *          ]
     *        }
     *      ]
     *    }
     *  ]
     * };
     */
    getTreeStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = yield this.getNodes();
            const nodeInformation = yield parallel(() => nodes.map(node => {
                return parallel(() => [node.getLevel(), node.getText(), node.isExpanded()]);
            }));
            return this._getTreeStructure(nodeInformation, 1, true);
        });
    }
    /**
     * Recursively collect the structured text of the tree nodes.
     * @param nodes A list of tree nodes
     * @param level The level of nodes that are being accounted for during this iteration
     * @param parentExpanded Whether the parent of the first node in param nodes is expanded
     */
    _getTreeStructure(nodes, level, parentExpanded) {
        var _a, _b, _c;
        const result = {};
        for (let i = 0; i < nodes.length; i++) {
            const [nodeLevel, text, expanded] = nodes[i];
            const nextNodeLevel = (_b = (_a = nodes[i + 1]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : -1;
            // Return the accumulated value for the current level once we reach a shallower level node
            if (nodeLevel < level) {
                return result;
            }
            // Skip deeper level nodes during this iteration, they will be picked up in a later iteration
            if (nodeLevel > level) {
                continue;
            }
            // Only add to representation if it is visible (parent is expanded)
            if (parentExpanded) {
                // Collect the data under this node according to the following rules:
                // 1. If the next node in the list is a sibling of the current node add it to the child list
                // 2. If the next node is a child of the current node, get the sub-tree structure for the
                //    child and add it under this node
                // 3. If the next node has a shallower level, we've reached the end of the child nodes for
                //    the current parent.
                if (nextNodeLevel === level) {
                    this._addChildToNode(result, { text });
                }
                else if (nextNodeLevel > level) {
                    let children = (_c = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)) === null || _c === void 0 ? void 0 : _c.children;
                    let child = children ? { text, children } : { text };
                    this._addChildToNode(result, child);
                }
                else {
                    this._addChildToNode(result, { text });
                    return result;
                }
            }
        }
        return result;
    }
    _addChildToNode(result, child) {
        result.children ? result.children.push(child) : (result.children = [child]);
    }
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatTreeHarness.hostSelector = '.mat-tree';

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

export { MatTreeHarness, MatTreeNodeHarness };
//# sourceMappingURL=testing.mjs.map
