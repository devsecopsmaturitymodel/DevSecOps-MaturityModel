/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertDefined } from '../../util/assert';
import { createNamedArrayType } from '../../util/named_array_type';
import { assertNodeInjector } from '../assert';
import { getInjectorIndex, getParentInjectorLocation } from '../di';
import { CONTAINER_HEADER_OFFSET, HAS_TRANSPLANTED_VIEWS, MOVED_VIEWS, NATIVE } from '../interfaces/container';
import { NO_PARENT_INJECTOR } from '../interfaces/injector';
import { toTNodeTypeAsString } from '../interfaces/node';
import { getTStylingRangeNext, getTStylingRangeNextDuplicate, getTStylingRangePrev, getTStylingRangePrevDuplicate } from '../interfaces/styling';
import { CHILD_HEAD, CHILD_TAIL, CLEANUP, CONTEXT, DECLARATION_VIEW, FLAGS, HEADER_OFFSET, HOST, INJECTOR, NEXT, PARENT, QUERIES, RENDERER, RENDERER_FACTORY, SANITIZER, T_HOST, TVIEW, TViewTypeAsString } from '../interfaces/view';
import { attachDebugObject } from '../util/debug_utils';
import { getParentInjectorIndex, getParentInjectorView } from '../util/injector_utils';
import { unwrapRNode } from '../util/view_utils';
/*
 * This file contains conditionally attached classes which provide human readable (debug) level
 * information for `LView`, `LContainer` and other internal data structures. These data structures
 * are stored internally as array which makes it very difficult during debugging to reason about the
 * current state of the system.
 *
 * Patching the array with extra property does change the array's hidden class' but it does not
 * change the cost of access, therefore this patching should not have significant if any impact in
 * `ngDevMode` mode. (see: https://jsperf.com/array-vs-monkey-patch-array)
 *
 * So instead of seeing:
 * ```
 * Array(30) [Object, 659, null, …]
 * ```
 *
 * You get to see:
 * ```
 * LViewDebug {
 *   views: [...],
 *   flags: {attached: true, ...}
 *   nodes: [
 *     {html: '<div id="123">', ..., nodes: [
 *       {html: '<span>', ..., nodes: null}
 *     ]}
 *   ]
 * }
 * ```
 */
let LVIEW_COMPONENT_CACHE;
let LVIEW_EMBEDDED_CACHE;
let LVIEW_ROOT;
let LVIEW_COMPONENT;
let LVIEW_EMBEDDED;
/**
 * This function clones a blueprint and creates LView.
 *
 * Simple slice will keep the same type, and we need it to be LView
 */
export function cloneToLViewFromTViewBlueprint(tView) {
    const debugTView = tView;
    const lView = getLViewToClone(debugTView.type, tView.template && tView.template.name);
    return lView.concat(tView.blueprint);
}
class LRootView extends Array {
}
class LComponentView extends Array {
}
class LEmbeddedView extends Array {
}
function getLViewToClone(type, name) {
    switch (type) {
        case 0 /* Root */:
            if (LVIEW_ROOT === undefined)
                LVIEW_ROOT = new LRootView();
            return LVIEW_ROOT;
        case 1 /* Component */:
            if (!ngDevMode || !ngDevMode.namedConstructors) {
                if (LVIEW_COMPONENT === undefined)
                    LVIEW_COMPONENT = new LComponentView();
                return LVIEW_COMPONENT;
            }
            if (LVIEW_COMPONENT_CACHE === undefined)
                LVIEW_COMPONENT_CACHE = new Map();
            let componentArray = LVIEW_COMPONENT_CACHE.get(name);
            if (componentArray === undefined) {
                componentArray = new (createNamedArrayType('LComponentView' + nameSuffix(name)))();
                LVIEW_COMPONENT_CACHE.set(name, componentArray);
            }
            return componentArray;
        case 2 /* Embedded */:
            if (!ngDevMode || !ngDevMode.namedConstructors) {
                if (LVIEW_EMBEDDED === undefined)
                    LVIEW_EMBEDDED = new LEmbeddedView();
                return LVIEW_EMBEDDED;
            }
            if (LVIEW_EMBEDDED_CACHE === undefined)
                LVIEW_EMBEDDED_CACHE = new Map();
            let embeddedArray = LVIEW_EMBEDDED_CACHE.get(name);
            if (embeddedArray === undefined) {
                embeddedArray = new (createNamedArrayType('LEmbeddedView' + nameSuffix(name)))();
                LVIEW_EMBEDDED_CACHE.set(name, embeddedArray);
            }
            return embeddedArray;
    }
}
function nameSuffix(text) {
    if (text == null)
        return '';
    const index = text.lastIndexOf('_Template');
    return '_' + (index === -1 ? text : text.substr(0, index));
}
/**
 * This class is a debug version of Object literal so that we can have constructor name show up
 * in
 * debug tools in ngDevMode.
 */
export const TViewConstructor = class TView {
    constructor(type, blueprint, template, queries, viewQuery, declTNode, data, bindingStartIndex, expandoStartIndex, hostBindingOpCodes, firstCreatePass, firstUpdatePass, staticViewQueries, staticContentQueries, preOrderHooks, preOrderCheckHooks, contentHooks, contentCheckHooks, viewHooks, viewCheckHooks, destroyHooks, cleanup, contentQueries, components, directiveRegistry, pipeRegistry, firstChild, schemas, consts, incompleteFirstPass, _decls, _vars) {
        this.type = type;
        this.blueprint = blueprint;
        this.template = template;
        this.queries = queries;
        this.viewQuery = viewQuery;
        this.declTNode = declTNode;
        this.data = data;
        this.bindingStartIndex = bindingStartIndex;
        this.expandoStartIndex = expandoStartIndex;
        this.hostBindingOpCodes = hostBindingOpCodes;
        this.firstCreatePass = firstCreatePass;
        this.firstUpdatePass = firstUpdatePass;
        this.staticViewQueries = staticViewQueries;
        this.staticContentQueries = staticContentQueries;
        this.preOrderHooks = preOrderHooks;
        this.preOrderCheckHooks = preOrderCheckHooks;
        this.contentHooks = contentHooks;
        this.contentCheckHooks = contentCheckHooks;
        this.viewHooks = viewHooks;
        this.viewCheckHooks = viewCheckHooks;
        this.destroyHooks = destroyHooks;
        this.cleanup = cleanup;
        this.contentQueries = contentQueries;
        this.components = components;
        this.directiveRegistry = directiveRegistry;
        this.pipeRegistry = pipeRegistry;
        this.firstChild = firstChild;
        this.schemas = schemas;
        this.consts = consts;
        this.incompleteFirstPass = incompleteFirstPass;
        this._decls = _decls;
        this._vars = _vars;
    }
    get template_() {
        const buf = [];
        processTNodeChildren(this.firstChild, buf);
        return buf.join('');
    }
    get type_() {
        return TViewTypeAsString[this.type] || `TViewType.?${this.type}?`;
    }
};
class TNode {
    constructor(tView_, //
    type, //
    index, //
    insertBeforeIndex, //
    injectorIndex, //
    directiveStart, //
    directiveEnd, //
    directiveStylingLast, //
    propertyBindings, //
    flags, //
    providerIndexes, //
    value, //
    attrs, //
    mergedAttrs, //
    localNames, //
    initialInputs, //
    inputs, //
    outputs, //
    tViews, //
    next, //
    projectionNext, //
    child, //
    parent, //
    projection, //
    styles, //
    stylesWithoutHost, //
    residualStyles, //
    classes, //
    classesWithoutHost, //
    residualClasses, //
    classBindings, //
    styleBindings) {
        this.tView_ = tView_;
        this.type = type;
        this.index = index;
        this.insertBeforeIndex = insertBeforeIndex;
        this.injectorIndex = injectorIndex;
        this.directiveStart = directiveStart;
        this.directiveEnd = directiveEnd;
        this.directiveStylingLast = directiveStylingLast;
        this.propertyBindings = propertyBindings;
        this.flags = flags;
        this.providerIndexes = providerIndexes;
        this.value = value;
        this.attrs = attrs;
        this.mergedAttrs = mergedAttrs;
        this.localNames = localNames;
        this.initialInputs = initialInputs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.tViews = tViews;
        this.next = next;
        this.projectionNext = projectionNext;
        this.child = child;
        this.parent = parent;
        this.projection = projection;
        this.styles = styles;
        this.stylesWithoutHost = stylesWithoutHost;
        this.residualStyles = residualStyles;
        this.classes = classes;
        this.classesWithoutHost = classesWithoutHost;
        this.residualClasses = residualClasses;
        this.classBindings = classBindings;
        this.styleBindings = styleBindings;
    }
    /**
     * Return a human debug version of the set of `NodeInjector`s which will be consulted when
     * resolving tokens from this `TNode`.
     *
     * When debugging applications, it is often difficult to determine which `NodeInjector`s will be
     * consulted. This method shows a list of `DebugNode`s representing the `TNode`s which will be
     * consulted in order when resolving a token starting at this `TNode`.
     *
     * The original data is stored in `LView` and `TView` with a lot of offset indexes, and so it is
     * difficult to reason about.
     *
     * @param lView The `LView` instance for this `TNode`.
     */
    debugNodeInjectorPath(lView) {
        const path = [];
        let injectorIndex = getInjectorIndex(this, lView);
        if (injectorIndex === -1) {
            // Looks like the current `TNode` does not have `NodeInjector` associated with it => look for
            // parent NodeInjector.
            const parentLocation = getParentInjectorLocation(this, lView);
            if (parentLocation !== NO_PARENT_INJECTOR) {
                // We found a parent, so start searching from the parent location.
                injectorIndex = getParentInjectorIndex(parentLocation);
                lView = getParentInjectorView(parentLocation, lView);
            }
            else {
                // No parents have been found, so there are no `NodeInjector`s to consult.
            }
        }
        while (injectorIndex !== -1) {
            ngDevMode && assertNodeInjector(lView, injectorIndex);
            const tNode = lView[TVIEW].data[injectorIndex + 8 /* TNODE */];
            path.push(buildDebugNode(tNode, lView));
            const parentLocation = lView[injectorIndex + 8 /* PARENT */];
            if (parentLocation === NO_PARENT_INJECTOR) {
                injectorIndex = -1;
            }
            else {
                injectorIndex = getParentInjectorIndex(parentLocation);
                lView = getParentInjectorView(parentLocation, lView);
            }
        }
        return path;
    }
    get type_() {
        return toTNodeTypeAsString(this.type) || `TNodeType.?${this.type}?`;
    }
    get flags_() {
        const flags = [];
        if (this.flags & 16 /* hasClassInput */)
            flags.push('TNodeFlags.hasClassInput');
        if (this.flags & 8 /* hasContentQuery */)
            flags.push('TNodeFlags.hasContentQuery');
        if (this.flags & 32 /* hasStyleInput */)
            flags.push('TNodeFlags.hasStyleInput');
        if (this.flags & 128 /* hasHostBindings */)
            flags.push('TNodeFlags.hasHostBindings');
        if (this.flags & 2 /* isComponentHost */)
            flags.push('TNodeFlags.isComponentHost');
        if (this.flags & 1 /* isDirectiveHost */)
            flags.push('TNodeFlags.isDirectiveHost');
        if (this.flags & 64 /* isDetached */)
            flags.push('TNodeFlags.isDetached');
        if (this.flags & 4 /* isProjected */)
            flags.push('TNodeFlags.isProjected');
        return flags.join('|');
    }
    get template_() {
        if (this.type & 1 /* Text */)
            return this.value;
        const buf = [];
        const tagName = typeof this.value === 'string' && this.value || this.type_;
        buf.push('<', tagName);
        if (this.flags) {
            buf.push(' ', this.flags_);
        }
        if (this.attrs) {
            for (let i = 0; i < this.attrs.length;) {
                const attrName = this.attrs[i++];
                if (typeof attrName == 'number') {
                    break;
                }
                const attrValue = this.attrs[i++];
                buf.push(' ', attrName, '="', attrValue, '"');
            }
        }
        buf.push('>');
        processTNodeChildren(this.child, buf);
        buf.push('</', tagName, '>');
        return buf.join('');
    }
    get styleBindings_() {
        return toDebugStyleBinding(this, false);
    }
    get classBindings_() {
        return toDebugStyleBinding(this, true);
    }
    get providerIndexStart_() {
        return this.providerIndexes & 1048575 /* ProvidersStartIndexMask */;
    }
    get providerIndexEnd_() {
        return this.providerIndexStart_ +
            (this.providerIndexes >>> 20 /* CptViewProvidersCountShift */);
    }
}
export const TNodeDebug = TNode;
function toDebugStyleBinding(tNode, isClassBased) {
    const tData = tNode.tView_.data;
    const bindings = [];
    const range = isClassBased ? tNode.classBindings : tNode.styleBindings;
    const prev = getTStylingRangePrev(range);
    const next = getTStylingRangeNext(range);
    let isTemplate = next !== 0;
    let cursor = isTemplate ? next : prev;
    while (cursor !== 0) {
        const itemKey = tData[cursor];
        const itemRange = tData[cursor + 1];
        bindings.unshift({
            key: itemKey,
            index: cursor,
            isTemplate: isTemplate,
            prevDuplicate: getTStylingRangePrevDuplicate(itemRange),
            nextDuplicate: getTStylingRangeNextDuplicate(itemRange),
            nextIndex: getTStylingRangeNext(itemRange),
            prevIndex: getTStylingRangePrev(itemRange),
        });
        if (cursor === prev)
            isTemplate = false;
        cursor = getTStylingRangePrev(itemRange);
    }
    bindings.push((isClassBased ? tNode.residualClasses : tNode.residualStyles) || null);
    return bindings;
}
function processTNodeChildren(tNode, buf) {
    while (tNode) {
        buf.push(tNode.template_);
        tNode = tNode.next;
    }
}
class TViewData extends Array {
}
let TVIEWDATA_EMPTY; // can't initialize here or it will not be tree shaken, because
// `LView` constructor could have side-effects.
/**
 * This function clones a blueprint and creates TData.
 *
 * Simple slice will keep the same type, and we need it to be TData
 */
export function cloneToTViewData(list) {
    if (TVIEWDATA_EMPTY === undefined)
        TVIEWDATA_EMPTY = new TViewData();
    return TVIEWDATA_EMPTY.concat(list);
}
export class LViewBlueprint extends Array {
}
export class MatchesArray extends Array {
}
export class TViewComponents extends Array {
}
export class TNodeLocalNames extends Array {
}
export class TNodeInitialInputs extends Array {
}
export class LCleanup extends Array {
}
export class TCleanup extends Array {
}
export function attachLViewDebug(lView) {
    attachDebugObject(lView, new LViewDebug(lView));
}
export function attachLContainerDebug(lContainer) {
    attachDebugObject(lContainer, new LContainerDebug(lContainer));
}
export function toDebug(obj) {
    if (obj) {
        const debug = obj.debug;
        assertDefined(debug, 'Object does not have a debug representation.');
        return debug;
    }
    else {
        return obj;
    }
}
/**
 * Use this method to unwrap a native element in `LView` and convert it into HTML for easier
 * reading.
 *
 * @param value possibly wrapped native DOM node.
 * @param includeChildren If `true` then the serialized HTML form will include child elements
 * (same
 * as `outerHTML`). If `false` then the serialized HTML form will only contain the element
 * itself
 * (will not serialize child elements).
 */
function toHtml(value, includeChildren = false) {
    const node = unwrapRNode(value);
    if (node) {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                return node.textContent;
            case Node.COMMENT_NODE:
                return `<!--${node.textContent}-->`;
            case Node.ELEMENT_NODE:
                const outerHTML = node.outerHTML;
                if (includeChildren) {
                    return outerHTML;
                }
                else {
                    const innerHTML = '>' + node.innerHTML + '<';
                    return (outerHTML.split(innerHTML)[0]) + '>';
                }
        }
    }
    return null;
}
export class LViewDebug {
    constructor(_raw_lView) {
        this._raw_lView = _raw_lView;
    }
    /**
     * Flags associated with the `LView` unpacked into a more readable state.
     */
    get flags() {
        const flags = this._raw_lView[FLAGS];
        return {
            __raw__flags__: flags,
            initPhaseState: flags & 3 /* InitPhaseStateMask */,
            creationMode: !!(flags & 4 /* CreationMode */),
            firstViewPass: !!(flags & 8 /* FirstLViewPass */),
            checkAlways: !!(flags & 16 /* CheckAlways */),
            dirty: !!(flags & 64 /* Dirty */),
            attached: !!(flags & 128 /* Attached */),
            destroyed: !!(flags & 256 /* Destroyed */),
            isRoot: !!(flags & 512 /* IsRoot */),
            indexWithinInitPhase: flags >> 11 /* IndexWithinInitPhaseShift */,
        };
    }
    get parent() {
        return toDebug(this._raw_lView[PARENT]);
    }
    get hostHTML() {
        return toHtml(this._raw_lView[HOST], true);
    }
    get html() {
        return (this.nodes || []).map(mapToHTML).join('');
    }
    get context() {
        return this._raw_lView[CONTEXT];
    }
    /**
     * The tree of nodes associated with the current `LView`. The nodes have been normalized into
     * a tree structure with relevant details pulled out for readability.
     */
    get nodes() {
        const lView = this._raw_lView;
        const tNode = lView[TVIEW].firstChild;
        return toDebugNodes(tNode, lView);
    }
    get template() {
        return this.tView.template_;
    }
    get tView() {
        return this._raw_lView[TVIEW];
    }
    get cleanup() {
        return this._raw_lView[CLEANUP];
    }
    get injector() {
        return this._raw_lView[INJECTOR];
    }
    get rendererFactory() {
        return this._raw_lView[RENDERER_FACTORY];
    }
    get renderer() {
        return this._raw_lView[RENDERER];
    }
    get sanitizer() {
        return this._raw_lView[SANITIZER];
    }
    get childHead() {
        return toDebug(this._raw_lView[CHILD_HEAD]);
    }
    get next() {
        return toDebug(this._raw_lView[NEXT]);
    }
    get childTail() {
        return toDebug(this._raw_lView[CHILD_TAIL]);
    }
    get declarationView() {
        return toDebug(this._raw_lView[DECLARATION_VIEW]);
    }
    get queries() {
        return this._raw_lView[QUERIES];
    }
    get tHost() {
        return this._raw_lView[T_HOST];
    }
    get decls() {
        return toLViewRange(this.tView, this._raw_lView, HEADER_OFFSET, this.tView.bindingStartIndex);
    }
    get vars() {
        return toLViewRange(this.tView, this._raw_lView, this.tView.bindingStartIndex, this.tView.expandoStartIndex);
    }
    get expando() {
        return toLViewRange(this.tView, this._raw_lView, this.tView.expandoStartIndex, this._raw_lView.length);
    }
    /**
     * Normalized view of child views (and containers) attached at this location.
     */
    get childViews() {
        const childViews = [];
        let child = this.childHead;
        while (child) {
            childViews.push(child);
            child = child.next;
        }
        return childViews;
    }
}
function mapToHTML(node) {
    if (node.type === 'ElementContainer') {
        return (node.children || []).map(mapToHTML).join('');
    }
    else if (node.type === 'IcuContainer') {
        throw new Error('Not implemented');
    }
    else {
        return toHtml(node.native, true) || '';
    }
}
function toLViewRange(tView, lView, start, end) {
    let content = [];
    for (let index = start; index < end; index++) {
        content.push({ index: index, t: tView.data[index], l: lView[index] });
    }
    return { start: start, end: end, length: end - start, content: content };
}
/**
 * Turns a flat list of nodes into a tree by walking the associated `TNode` tree.
 *
 * @param tNode
 * @param lView
 */
export function toDebugNodes(tNode, lView) {
    if (tNode) {
        const debugNodes = [];
        let tNodeCursor = tNode;
        while (tNodeCursor) {
            debugNodes.push(buildDebugNode(tNodeCursor, lView));
            tNodeCursor = tNodeCursor.next;
        }
        return debugNodes;
    }
    else {
        return [];
    }
}
export function buildDebugNode(tNode, lView) {
    const rawValue = lView[tNode.index];
    const native = unwrapRNode(rawValue);
    const factories = [];
    const instances = [];
    const tView = lView[TVIEW];
    for (let i = tNode.directiveStart; i < tNode.directiveEnd; i++) {
        const def = tView.data[i];
        factories.push(def.type);
        instances.push(lView[i]);
    }
    return {
        html: toHtml(native),
        type: toTNodeTypeAsString(tNode.type),
        tNode,
        native: native,
        children: toDebugNodes(tNode.child, lView),
        factories,
        instances,
        injector: buildNodeInjectorDebug(tNode, tView, lView),
        get injectorResolutionPath() {
            return tNode.debugNodeInjectorPath(lView);
        },
    };
}
function buildNodeInjectorDebug(tNode, tView, lView) {
    const viewProviders = [];
    for (let i = tNode.providerIndexStart_; i < tNode.providerIndexEnd_; i++) {
        viewProviders.push(tView.data[i]);
    }
    const providers = [];
    for (let i = tNode.providerIndexEnd_; i < tNode.directiveEnd; i++) {
        providers.push(tView.data[i]);
    }
    const nodeInjectorDebug = {
        bloom: toBloom(lView, tNode.injectorIndex),
        cumulativeBloom: toBloom(tView.data, tNode.injectorIndex),
        providers,
        viewProviders,
        parentInjectorIndex: lView[tNode.providerIndexStart_ - 1],
    };
    return nodeInjectorDebug;
}
/**
 * Convert a number at `idx` location in `array` into binary representation.
 *
 * @param array
 * @param idx
 */
function binary(array, idx) {
    const value = array[idx];
    // If not a number we print 8 `?` to retain alignment but let user know that it was called on
    // wrong type.
    if (typeof value !== 'number')
        return '????????';
    // We prefix 0s so that we have constant length number
    const text = '00000000' + value.toString(2);
    return text.substring(text.length - 8);
}
/**
 * Convert a bloom filter at location `idx` in `array` into binary representation.
 *
 * @param array
 * @param idx
 */
function toBloom(array, idx) {
    if (idx < 0) {
        return 'NO_NODE_INJECTOR';
    }
    return `${binary(array, idx + 7)}_${binary(array, idx + 6)}_${binary(array, idx + 5)}_${binary(array, idx + 4)}_${binary(array, idx + 3)}_${binary(array, idx + 2)}_${binary(array, idx + 1)}_${binary(array, idx + 0)}`;
}
export class LContainerDebug {
    constructor(_raw_lContainer) {
        this._raw_lContainer = _raw_lContainer;
    }
    get hasTransplantedViews() {
        return this._raw_lContainer[HAS_TRANSPLANTED_VIEWS];
    }
    get views() {
        return this._raw_lContainer.slice(CONTAINER_HEADER_OFFSET)
            .map(toDebug);
    }
    get parent() {
        return toDebug(this._raw_lContainer[PARENT]);
    }
    get movedViews() {
        return this._raw_lContainer[MOVED_VIEWS];
    }
    get host() {
        return this._raw_lContainer[HOST];
    }
    get native() {
        return this._raw_lContainer[NATIVE];
    }
    get next() {
        return toDebug(this._raw_lContainer[NEXT]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHZpZXdfZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2luc3RydWN0aW9ucy9sdmlld19kZWJ1Zy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFPSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzdDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUNsRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsc0JBQXNCLEVBQWMsV0FBVyxFQUFFLE1BQU0sRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXpILE9BQU8sRUFBQyxrQkFBa0IsRUFBcUIsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RSxPQUFPLEVBQThKLG1CQUFtQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFLcE4sT0FBTyxFQUFDLG9CQUFvQixFQUFFLDZCQUE2QixFQUFFLG9CQUFvQixFQUFFLDZCQUE2QixFQUE2QixNQUFNLHVCQUF1QixDQUFDO0FBQzNLLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQWEsZ0JBQWdCLEVBQW1CLEtBQUssRUFBRSxhQUFhLEVBQVksSUFBSSxFQUFzQixRQUFRLEVBQThILElBQUksRUFBcUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBMEIsS0FBSyxFQUFvQixpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZkLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8s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bnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnLi4vLi4vZGkvaW5qZWN0b3InO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge1NjaGVtYU1ldGFkYXRhfSBmcm9tICcuLi8uLi9tZXRhZGF0YS9zY2hlbWEnO1xuaW1wb3J0IHtTYW5pdGl6ZXJ9IGZyb20gJy4uLy4uL3Nhbml0aXphdGlvbi9zYW5pdGl6ZXInO1xuaW1wb3J0IHtLZXlWYWx1ZUFycmF5fSBmcm9tICcuLi8uLi91dGlsL2FycmF5X3V0aWxzJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtjcmVhdGVOYW1lZEFycmF5VHlwZX0gZnJvbSAnLi4vLi4vdXRpbC9uYW1lZF9hcnJheV90eXBlJztcbmltcG9ydCB7YXNzZXJ0Tm9kZUluamVjdG9yfSBmcm9tICcuLi9hc3NlcnQnO1xuaW1wb3J0IHtnZXRJbmplY3RvckluZGV4LCBnZXRQYXJlbnRJbmplY3RvckxvY2F0aW9ufSBmcm9tICcuLi9kaSc7XG5pbXBvcnQge0NPTlRBSU5FUl9IRUFERVJfT0ZGU0VULCBIQVNfVFJBTlNQTEFOVEVEX1ZJRVdTLCBMQ29udGFpbmVyLCBNT1ZFRF9WSUVXUywgTkFUSVZFfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbXBvbmVudFRlbXBsYXRlLCBEaXJlY3RpdmVEZWYsIERpcmVjdGl2ZURlZkxpc3QsIFBpcGVEZWZMaXN0LCBWaWV3UXVlcmllc0Z1bmN0aW9ufSBmcm9tICcuLi9pbnRlcmZhY2VzL2RlZmluaXRpb24nO1xuaW1wb3J0IHtOT19QQVJFTlRfSU5KRUNUT1IsIE5vZGVJbmplY3Rvck9mZnNldH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pbmplY3Rvcic7XG5pbXBvcnQge0F0dHJpYnV0ZU1hcmtlciwgSW5zZXJ0QmVmb3JlSW5kZXgsIFByb3BlcnR5QWxpYXNlcywgVENvbnN0YW50cywgVENvbnRhaW5lck5vZGUsIFRFbGVtZW50Tm9kZSwgVE5vZGUgYXMgSVROb2RlLCBUTm9kZUZsYWdzLCBUTm9kZVByb3ZpZGVySW5kZXhlcywgVE5vZGVUeXBlLCB0b1ROb2RlVHlwZUFzU3RyaW5nfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtTZWxlY3RvckZsYWdzfSBmcm9tICcuLi9pbnRlcmZhY2VzL3Byb2plY3Rpb24nO1xuaW1wb3J0IHtMUXVlcmllcywgVFF1ZXJpZXN9IGZyb20gJy4uL2ludGVyZmFjZXMvcXVlcnknO1xuaW1wb3J0IHtSZW5kZXJlcjMsIFJlbmRlcmVyRmFjdG9yeTN9IGZyb20gJy4uL2ludGVyZmFjZXMvcmVuZGVyZXInO1xuaW1wb3J0IHtSQ29tbWVudCwgUkVsZW1lbnQsIFJOb2RlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3JlbmRlcmVyX2RvbSc7XG5pbXBvcnQge2dldFRTdHlsaW5nUmFuZ2VOZXh0LCBnZXRUU3R5bGluZ1JhbmdlTmV4dER1cGxpY2F0ZSwgZ2V0VFN0eWxpbmdSYW5nZVByZXYsIGdldFRTdHlsaW5nUmFuZ2VQcmV2RHVwbGljYXRlLCBUU3R5bGluZ0tleSwgVFN0eWxpbmdSYW5nZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdHlsaW5nJztcbmltcG9ydCB7Q0hJTERfSEVBRCwgQ0hJTERfVEFJTCwgQ0xFQU5VUCwgQ09OVEVYVCwgRGVidWdOb2RlLCBERUNMQVJBVElPTl9WSUVXLCBEZXN0cm95SG9va0RhdGEsIEZMQUdTLCBIRUFERVJfT0ZGU0VULCBIb29rRGF0YSwgSE9TVCwgSG9zdEJpbmRpbmdPcENvZGVzLCBJTkpFQ1RPUiwgTENvbnRhaW5lckRlYnVnIGFzIElMQ29udGFpbmVyRGVidWcsIExWaWV3LCBMVmlld0RlYnVnIGFzIElMVmlld0RlYnVnLCBMVmlld0RlYnVnUmFuZ2UsIExWaWV3RGVidWdSYW5nZUNvbnRlbnQsIExWaWV3RmxhZ3MsIE5FWFQsIE5vZGVJbmplY3RvckRlYnVnLCBQQVJFTlQsIFFVRVJJRVMsIFJFTkRFUkVSLCBSRU5ERVJFUl9GQUNUT1JZLCBTQU5JVElaRVIsIFRfSE9TVCwgVERhdGEsIFRWaWV3IGFzIElUVmlldywgVFZJRVcsIFRWaWV3LCBUVmlld1R5cGUsIFRWaWV3VHlwZUFzU3RyaW5nfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHthdHRhY2hEZWJ1Z09iamVjdH0gZnJvbSAnLi4vdXRpbC9kZWJ1Z191dGlscyc7XG5pbXBvcnQge2dldFBhcmVudEluamVjdG9ySW5kZXgsIGdldFBhcmVudEluamVjdG9yVmlld30gZnJvbSAnLi4vdXRpbC9pbmplY3Rvcl91dGlscyc7XG5pbXBvcnQge3Vud3JhcFJOb2RlfSBmcm9tICcuLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG4vKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIGNvbmRpdGlvbmFsbHkgYXR0YWNoZWQgY2xhc3NlcyB3aGljaCBwcm92aWRlIGh1bWFuIHJlYWRhYmxlIChkZWJ1ZykgbGV2ZWxcbiAqIGluZm9ybWF0aW9uIGZvciBgTFZpZXdgLCBgTENvbnRhaW5lcmAgYW5kIG90aGVyIGludGVybmFsIGRhdGEgc3RydWN0dXJlcy4gVGhlc2UgZGF0YSBzdHJ1Y3R1cmVzXG4gKiBhcmUgc3RvcmVkIGludGVybmFsbHkgYXMgYXJyYXkgd2hpY2ggbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHQgZHVyaW5nIGRlYnVnZ2luZyB0byByZWFzb24gYWJvdXQgdGhlXG4gKiBjdXJyZW50IHN0YXRlIG9mIHRoZSBzeXN0ZW0uXG4gKlxuICogUGF0Y2hpbmcgdGhlIGFycmF5IHdpdGggZXh0cmEgcHJvcGVydHkgZG9lcyBjaGFuZ2UgdGhlIGFycmF5J3MgaGlkZGVuIGNsYXNzJyBidXQgaXQgZG9lcyBub3RcbiAqIGNoYW5nZSB0aGUgY29zdCBvZiBhY2Nlc3MsIHRoZXJlZm9yZSB0aGlzIHBhdGNoaW5nIHNob3VsZCBub3QgaGF2ZSBzaWduaWZpY2FudCBpZiBhbnkgaW1wYWN0IGluXG4gKiBgbmdEZXZNb2RlYCBtb2RlLiAoc2VlOiBodHRwczovL2pzcGVyZi5jb20vYXJyYXktdnMtbW9ua2V5LXBhdGNoLWFycmF5KVxuICpcbiAqIFNvIGluc3RlYWQgb2Ygc2VlaW5nOlxuICogYGBgXG4gKiBBcnJheSgzMCkgW09iamVjdCwgNjU5LCBudWxsLCDigKZdXG4gKiBgYGBcbiAqXG4gKiBZb3UgZ2V0IHRvIHNlZTpcbiAqIGBgYFxuICogTFZpZXdEZWJ1ZyB7XG4gKiAgIHZpZXdzOiBbLi4uXSxcbiAqICAgZmxhZ3M6IHthdHRhY2hlZDogdHJ1ZSwgLi4ufVxuICogICBub2RlczogW1xuICogICAgIHtodG1sOiAnPGRpdiBpZD1cIjEyM1wiPicsIC4uLiwgbm9kZXM6IFtcbiAqICAgICAgIHtodG1sOiAnPHNwYW4+JywgLi4uLCBub2RlczogbnVsbH1cbiAqICAgICBdfVxuICogICBdXG4gKiB9XG4gKiBgYGBcbiAqL1xuXG5sZXQgTFZJRVdfQ09NUE9ORU5UX0NBQ0hFOiBNYXA8c3RyaW5nfG51bGwsIEFycmF5PGFueT4+fHVuZGVmaW5lZDtcbmxldCBMVklFV19FTUJFRERFRF9DQUNIRTogTWFwPHN0cmluZ3xudWxsLCBBcnJheTxhbnk+Pnx1bmRlZmluZWQ7XG5sZXQgTFZJRVdfUk9PVDogQXJyYXk8YW55Pnx1bmRlZmluZWQ7XG5sZXQgTFZJRVdfQ09NUE9ORU5UOiBBcnJheTxhbnk+fHVuZGVmaW5lZDtcbmxldCBMVklFV19FTUJFRERFRDogQXJyYXk8YW55Pnx1bmRlZmluZWQ7XG5cbmludGVyZmFjZSBUVmlld0RlYnVnIGV4dGVuZHMgSVRWaWV3IHtcbiAgdHlwZTogVFZpZXdUeXBlO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gY2xvbmVzIGEgYmx1ZXByaW50IGFuZCBjcmVhdGVzIExWaWV3LlxuICpcbiAqIFNpbXBsZSBzbGljZSB3aWxsIGtlZXAgdGhlIHNhbWUgdHlwZSwgYW5kIHdlIG5lZWQgaXQgdG8gYmUgTFZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lVG9MVmlld0Zyb21UVmlld0JsdWVwcmludCh0VmlldzogVFZpZXcpOiBMVmlldyB7XG4gIGNvbnN0IGRlYnVnVFZpZXcgPSB0VmlldyBhcyBUVmlld0RlYnVnO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3VG9DbG9uZShkZWJ1Z1RWaWV3LnR5cGUsIHRWaWV3LnRlbXBsYXRlICYmIHRWaWV3LnRlbXBsYXRlLm5hbWUpO1xuICByZXR1cm4gbFZpZXcuY29uY2F0KHRWaWV3LmJsdWVwcmludCkgYXMgYW55O1xufVxuXG5jbGFzcyBMUm9vdFZpZXcgZXh0ZW5kcyBBcnJheSB7fVxuY2xhc3MgTENvbXBvbmVudFZpZXcgZXh0ZW5kcyBBcnJheSB7fVxuY2xhc3MgTEVtYmVkZGVkVmlldyBleHRlbmRzIEFycmF5IHt9XG5cbmZ1bmN0aW9uIGdldExWaWV3VG9DbG9uZSh0eXBlOiBUVmlld1R5cGUsIG5hbWU6IHN0cmluZ3xudWxsKTogQXJyYXk8YW55PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgVFZpZXdUeXBlLlJvb3Q6XG4gICAgICBpZiAoTFZJRVdfUk9PVCA9PT0gdW5kZWZpbmVkKSBMVklFV19ST09UID0gbmV3IExSb290VmlldygpO1xuICAgICAgcmV0dXJuIExWSUVXX1JPT1Q7XG4gICAgY2FzZSBUVmlld1R5cGUuQ29tcG9uZW50OlxuICAgICAgaWYgKCFuZ0Rldk1vZGUgfHwgIW5nRGV2TW9kZS5uYW1lZENvbnN0cnVjdG9ycykge1xuICAgICAgICBpZiAoTFZJRVdfQ09NUE9ORU5UID09PSB1bmRlZmluZWQpIExWSUVXX0NPTVBPTkVOVCA9IG5ldyBMQ29tcG9uZW50VmlldygpO1xuICAgICAgICByZXR1cm4gTFZJRVdfQ09NUE9ORU5UO1xuICAgICAgfVxuICAgICAgaWYgKExWSUVXX0NPTVBPTkVOVF9DQUNIRSA9PT0gdW5kZWZpbmVkKSBMVklFV19DT01QT05FTlRfQ0FDSEUgPSBuZXcgTWFwKCk7XG4gICAgICBsZXQgY29tcG9uZW50QXJyYXkgPSBMVklFV19DT01QT05FTlRfQ0FDSEUuZ2V0KG5hbWUpO1xuICAgICAgaWYgKGNvbXBvbmVudEFycmF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50QXJyYXkgPSBuZXcgKGNyZWF0ZU5hbWVkQXJyYXlUeXBlKCdMQ29tcG9uZW50VmlldycgKyBuYW1lU3VmZml4KG5hbWUpKSkoKTtcbiAgICAgICAgTFZJRVdfQ09NUE9ORU5UX0NBQ0hFLnNldChuYW1lLCBjb21wb25lbnRBcnJheSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcG9uZW50QXJyYXk7XG4gICAgY2FzZSBUVmlld1R5cGUuRW1iZWRkZWQ6XG4gICAgICBpZiAoIW5nRGV2TW9kZSB8fCAhbmdEZXZNb2RlLm5hbWVkQ29uc3RydWN0b3JzKSB7XG4gICAgICAgIGlmIChMVklFV19FTUJFRERFRCA9PT0gdW5kZWZpbmVkKSBMVklFV19FTUJFRERFRCA9IG5ldyBMRW1iZWRkZWRWaWV3KCk7XG4gICAgICAgIHJldHVybiBMVklFV19FTUJFRERFRDtcbiAgICAgIH1cbiAgICAgIGlmIChMVklFV19FTUJFRERFRF9DQUNIRSA9PT0gdW5kZWZpbmVkKSBMVklFV19FTUJFRERFRF9DQUNIRSA9IG5ldyBNYXAoKTtcbiAgICAgIGxldCBlbWJlZGRlZEFycmF5ID0gTFZJRVdfRU1CRURERURfQ0FDSEUuZ2V0KG5hbWUpO1xuICAgICAgaWYgKGVtYmVkZGVkQXJyYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbWJlZGRlZEFycmF5ID0gbmV3IChjcmVhdGVOYW1lZEFycmF5VHlwZSgnTEVtYmVkZGVkVmlldycgKyBuYW1lU3VmZml4KG5hbWUpKSkoKTtcbiAgICAgICAgTFZJRVdfRU1CRURERURfQ0FDSEUuc2V0KG5hbWUsIGVtYmVkZGVkQXJyYXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtYmVkZGVkQXJyYXk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbmFtZVN1ZmZpeCh0ZXh0OiBzdHJpbmd8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAodGV4dCA9PSBudWxsKSByZXR1cm4gJyc7XG4gIGNvbnN0IGluZGV4ID0gdGV4dC5sYXN0SW5kZXhPZignX1RlbXBsYXRlJyk7XG4gIHJldHVybiAnXycgKyAoaW5kZXggPT09IC0xID8gdGV4dCA6IHRleHQuc3Vic3RyKDAsIGluZGV4KSk7XG59XG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyBhIGRlYnVnIHZlcnNpb24gb2YgT2JqZWN0IGxpdGVyYWwgc28gdGhhdCB3ZSBjYW4gaGF2ZSBjb25zdHJ1Y3RvciBuYW1lIHNob3cgdXBcbiAqIGluXG4gKiBkZWJ1ZyB0b29scyBpbiBuZ0Rldk1vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBUVmlld0NvbnN0cnVjdG9yID0gY2xhc3MgVFZpZXcgaW1wbGVtZW50cyBJVFZpZXcge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB0eXBlOiBUVmlld1R5cGUsXG4gICAgICBwdWJsaWMgYmx1ZXByaW50OiBMVmlldyxcbiAgICAgIHB1YmxpYyB0ZW1wbGF0ZTogQ29tcG9uZW50VGVtcGxhdGU8e30+fG51bGwsXG4gICAgICBwdWJsaWMgcXVlcmllczogVFF1ZXJpZXN8bnVsbCxcbiAgICAgIHB1YmxpYyB2aWV3UXVlcnk6IFZpZXdRdWVyaWVzRnVuY3Rpb248e30+fG51bGwsXG4gICAgICBwdWJsaWMgZGVjbFROb2RlOiBJVE5vZGV8bnVsbCxcbiAgICAgIHB1YmxpYyBkYXRhOiBURGF0YSxcbiAgICAgIHB1YmxpYyBiaW5kaW5nU3RhcnRJbmRleDogbnVtYmVyLFxuICAgICAgcHVibGljIGV4cGFuZG9TdGFydEluZGV4OiBudW1iZXIsXG4gICAgICBwdWJsaWMgaG9zdEJpbmRpbmdPcENvZGVzOiBIb3N0QmluZGluZ09wQ29kZXN8bnVsbCxcbiAgICAgIHB1YmxpYyBmaXJzdENyZWF0ZVBhc3M6IGJvb2xlYW4sXG4gICAgICBwdWJsaWMgZmlyc3RVcGRhdGVQYXNzOiBib29sZWFuLFxuICAgICAgcHVibGljIHN0YXRpY1ZpZXdRdWVyaWVzOiBib29sZWFuLFxuICAgICAgcHVibGljIHN0YXRpY0NvbnRlbnRRdWVyaWVzOiBib29sZWFuLFxuICAgICAgcHVibGljIHByZU9yZGVySG9va3M6IEhvb2tEYXRhfG51bGwsXG4gICAgICBwdWJsaWMgcHJlT3JkZXJDaGVja0hvb2tzOiBIb29rRGF0YXxudWxsLFxuICAgICAgcHVibGljIGNvbnRlbnRIb29rczogSG9va0RhdGF8bnVsbCxcbiAgICAgIHB1YmxpYyBjb250ZW50Q2hlY2tIb29rczogSG9va0RhdGF8bnVsbCxcbiAgICAgIHB1YmxpYyB2aWV3SG9va3M6IEhvb2tEYXRhfG51bGwsXG4gICAgICBwdWJsaWMgdmlld0NoZWNrSG9va3M6IEhvb2tEYXRhfG51bGwsXG4gICAgICBwdWJsaWMgZGVzdHJveUhvb2tzOiBEZXN0cm95SG9va0RhdGF8bnVsbCxcbiAgICAgIHB1YmxpYyBjbGVhbnVwOiBhbnlbXXxudWxsLFxuICAgICAgcHVibGljIGNvbnRlbnRRdWVyaWVzOiBudW1iZXJbXXxudWxsLFxuICAgICAgcHVibGljIGNvbXBvbmVudHM6IG51bWJlcltdfG51bGwsXG4gICAgICBwdWJsaWMgZGlyZWN0aXZlUmVnaXN0cnk6IERpcmVjdGl2ZURlZkxpc3R8bnVsbCxcbiAgICAgIHB1YmxpYyBwaXBlUmVnaXN0cnk6IFBpcGVEZWZMaXN0fG51bGwsXG4gICAgICBwdWJsaWMgZmlyc3RDaGlsZDogSVROb2RlfG51bGwsXG4gICAgICBwdWJsaWMgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXXxudWxsLFxuICAgICAgcHVibGljIGNvbnN0czogVENvbnN0YW50c3xudWxsLFxuICAgICAgcHVibGljIGluY29tcGxldGVGaXJzdFBhc3M6IGJvb2xlYW4sXG4gICAgICBwdWJsaWMgX2RlY2xzOiBudW1iZXIsXG4gICAgICBwdWJsaWMgX3ZhcnM6IG51bWJlcixcblxuICApIHt9XG5cbiAgZ2V0IHRlbXBsYXRlXygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGJ1Zjogc3RyaW5nW10gPSBbXTtcbiAgICBwcm9jZXNzVE5vZGVDaGlsZHJlbih0aGlzLmZpcnN0Q2hpbGQsIGJ1Zik7XG4gICAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbiAgfVxuXG4gIGdldCB0eXBlXygpOiBzdHJpbmcge1xuICAgIHJldHVybiBUVmlld1R5cGVBc1N0cmluZ1t0aGlzLnR5cGVdIHx8IGBUVmlld1R5cGUuPyR7dGhpcy50eXBlfT9gO1xuICB9XG59O1xuXG5jbGFzcyBUTm9kZSBpbXBsZW1lbnRzIElUTm9kZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHRWaWV3XzogVFZpZXcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgdHlwZTogVE5vZGVUeXBlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBpbmRleDogbnVtYmVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGluc2VydEJlZm9yZUluZGV4OiBJbnNlcnRCZWZvcmVJbmRleCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgaW5qZWN0b3JJbmRleDogbnVtYmVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBkaXJlY3RpdmVTdGFydDogbnVtYmVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGRpcmVjdGl2ZUVuZDogbnVtYmVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgZGlyZWN0aXZlU3R5bGluZ0xhc3Q6IG51bWJlciwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBwcm9wZXJ0eUJpbmRpbmdzOiBudW1iZXJbXXxudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGZsYWdzOiBUTm9kZUZsYWdzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgcHJvdmlkZXJJbmRleGVzOiBUTm9kZVByb3ZpZGVySW5kZXhlcywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGF0dHJzOiAoc3RyaW5nfEF0dHJpYnV0ZU1hcmtlcnwoc3RyaW5nfFNlbGVjdG9yRmxhZ3MpW10pW118bnVsbCwgICAgICAgIC8vXG4gICAgICBwdWJsaWMgbWVyZ2VkQXR0cnM6IChzdHJpbmd8QXR0cmlidXRlTWFya2VyfChzdHJpbmd8U2VsZWN0b3JGbGFncylbXSlbXXxudWxsLCAgLy9cbiAgICAgIHB1YmxpYyBsb2NhbE5hbWVzOiAoc3RyaW5nfG51bWJlcilbXXxudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGluaXRpYWxJbnB1dHM6IChzdHJpbmdbXXxudWxsKVtdfG51bGx8dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgaW5wdXRzOiBQcm9wZXJ0eUFsaWFzZXN8bnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBvdXRwdXRzOiBQcm9wZXJ0eUFsaWFzZXN8bnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIHRWaWV3czogSVRWaWV3fElUVmlld1tdfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgbmV4dDogSVROb2RlfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBwcm9qZWN0aW9uTmV4dDogSVROb2RlfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGNoaWxkOiBJVE5vZGV8bnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgcGFyZW50OiBURWxlbWVudE5vZGV8VENvbnRhaW5lck5vZGV8bnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyBwcm9qZWN0aW9uOiBudW1iZXJ8KElUTm9kZXxSTm9kZVtdKVtdfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIHN0eWxlczogc3RyaW5nfG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgc3R5bGVzV2l0aG91dEhvc3Q6IHN0cmluZ3xudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyByZXNpZHVhbFN0eWxlczogS2V5VmFsdWVBcnJheTxhbnk+fHVuZGVmaW5lZHxudWxsLCAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGNsYXNzZXM6IHN0cmluZ3xudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgY2xhc3Nlc1dpdGhvdXRIb3N0OiBzdHJpbmd8bnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgIHB1YmxpYyByZXNpZHVhbENsYXNzZXM6IEtleVZhbHVlQXJyYXk8YW55Pnx1bmRlZmluZWR8bnVsbCwgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgcHVibGljIGNsYXNzQmluZGluZ3M6IFRTdHlsaW5nUmFuZ2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICBwdWJsaWMgc3R5bGVCaW5kaW5nczogVFN0eWxpbmdSYW5nZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBodW1hbiBkZWJ1ZyB2ZXJzaW9uIG9mIHRoZSBzZXQgb2YgYE5vZGVJbmplY3RvcmBzIHdoaWNoIHdpbGwgYmUgY29uc3VsdGVkIHdoZW5cbiAgICogcmVzb2x2aW5nIHRva2VucyBmcm9tIHRoaXMgYFROb2RlYC5cbiAgICpcbiAgICogV2hlbiBkZWJ1Z2dpbmcgYXBwbGljYXRpb25zLCBpdCBpcyBvZnRlbiBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHdoaWNoIGBOb2RlSW5qZWN0b3JgcyB3aWxsIGJlXG4gICAqIGNvbnN1bHRlZC4gVGhpcyBtZXRob2Qgc2hvd3MgYSBsaXN0IG9mIGBEZWJ1Z05vZGVgcyByZXByZXNlbnRpbmcgdGhlIGBUTm9kZWBzIHdoaWNoIHdpbGwgYmVcbiAgICogY29uc3VsdGVkIGluIG9yZGVyIHdoZW4gcmVzb2x2aW5nIGEgdG9rZW4gc3RhcnRpbmcgYXQgdGhpcyBgVE5vZGVgLlxuICAgKlxuICAgKiBUaGUgb3JpZ2luYWwgZGF0YSBpcyBzdG9yZWQgaW4gYExWaWV3YCBhbmQgYFRWaWV3YCB3aXRoIGEgbG90IG9mIG9mZnNldCBpbmRleGVzLCBhbmQgc28gaXQgaXNcbiAgICogZGlmZmljdWx0IHRvIHJlYXNvbiBhYm91dC5cbiAgICpcbiAgICogQHBhcmFtIGxWaWV3IFRoZSBgTFZpZXdgIGluc3RhbmNlIGZvciB0aGlzIGBUTm9kZWAuXG4gICAqL1xuICBkZWJ1Z05vZGVJbmplY3RvclBhdGgobFZpZXc6IExWaWV3KTogRGVidWdOb2RlW10ge1xuICAgIGNvbnN0IHBhdGg6IERlYnVnTm9kZVtdID0gW107XG4gICAgbGV0IGluamVjdG9ySW5kZXggPSBnZXRJbmplY3RvckluZGV4KHRoaXMsIGxWaWV3KTtcbiAgICBpZiAoaW5qZWN0b3JJbmRleCA9PT0gLTEpIHtcbiAgICAgIC8vIExvb2tzIGxpa2UgdGhlIGN1cnJlbnQgYFROb2RlYCBkb2VzIG5vdCBoYXZlIGBOb2RlSW5qZWN0b3JgIGFzc29jaWF0ZWQgd2l0aCBpdCA9PiBsb29rIGZvclxuICAgICAgLy8gcGFyZW50IE5vZGVJbmplY3Rvci5cbiAgICAgIGNvbnN0IHBhcmVudExvY2F0aW9uID0gZ2V0UGFyZW50SW5qZWN0b3JMb2NhdGlvbih0aGlzLCBsVmlldyk7XG4gICAgICBpZiAocGFyZW50TG9jYXRpb24gIT09IE5PX1BBUkVOVF9JTkpFQ1RPUikge1xuICAgICAgICAvLyBXZSBmb3VuZCBhIHBhcmVudCwgc28gc3RhcnQgc2VhcmNoaW5nIGZyb20gdGhlIHBhcmVudCBsb2NhdGlvbi5cbiAgICAgICAgaW5qZWN0b3JJbmRleCA9IGdldFBhcmVudEluamVjdG9ySW5kZXgocGFyZW50TG9jYXRpb24pO1xuICAgICAgICBsVmlldyA9IGdldFBhcmVudEluamVjdG9yVmlldyhwYXJlbnRMb2NhdGlvbiwgbFZpZXcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gcGFyZW50cyBoYXZlIGJlZW4gZm91bmQsIHNvIHRoZXJlIGFyZSBubyBgTm9kZUluamVjdG9yYHMgdG8gY29uc3VsdC5cbiAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUgKGluamVjdG9ySW5kZXggIT09IC0xKSB7XG4gICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0Tm9kZUluamVjdG9yKGxWaWV3LCBpbmplY3RvckluZGV4KTtcbiAgICAgIGNvbnN0IHROb2RlID0gbFZpZXdbVFZJRVddLmRhdGFbaW5qZWN0b3JJbmRleCArIE5vZGVJbmplY3Rvck9mZnNldC5UTk9ERV0gYXMgVE5vZGU7XG4gICAgICBwYXRoLnB1c2goYnVpbGREZWJ1Z05vZGUodE5vZGUsIGxWaWV3KSk7XG4gICAgICBjb25zdCBwYXJlbnRMb2NhdGlvbiA9IGxWaWV3W2luamVjdG9ySW5kZXggKyBOb2RlSW5qZWN0b3JPZmZzZXQuUEFSRU5UXTtcbiAgICAgIGlmIChwYXJlbnRMb2NhdGlvbiA9PT0gTk9fUEFSRU5UX0lOSkVDVE9SKSB7XG4gICAgICAgIGluamVjdG9ySW5kZXggPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluamVjdG9ySW5kZXggPSBnZXRQYXJlbnRJbmplY3RvckluZGV4KHBhcmVudExvY2F0aW9uKTtcbiAgICAgICAgbFZpZXcgPSBnZXRQYXJlbnRJbmplY3RvclZpZXcocGFyZW50TG9jYXRpb24sIGxWaWV3KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBnZXQgdHlwZV8oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdG9UTm9kZVR5cGVBc1N0cmluZyh0aGlzLnR5cGUpIHx8IGBUTm9kZVR5cGUuPyR7dGhpcy50eXBlfT9gO1xuICB9XG5cbiAgZ2V0IGZsYWdzXygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZsYWdzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLmZsYWdzICYgVE5vZGVGbGFncy5oYXNDbGFzc0lucHV0KSBmbGFncy5wdXNoKCdUTm9kZUZsYWdzLmhhc0NsYXNzSW5wdXQnKTtcbiAgICBpZiAodGhpcy5mbGFncyAmIFROb2RlRmxhZ3MuaGFzQ29udGVudFF1ZXJ5KSBmbGFncy5wdXNoKCdUTm9kZUZsYWdzLmhhc0NvbnRlbnRRdWVyeScpO1xuICAgIGlmICh0aGlzLmZsYWdzICYgVE5vZGVGbGFncy5oYXNTdHlsZUlucHV0KSBmbGFncy5wdXNoKCdUTm9kZUZsYWdzLmhhc1N0eWxlSW5wdXQnKTtcbiAgICBpZiAodGhpcy5mbGFncyAmIFROb2RlRmxhZ3MuaGFzSG9zdEJpbmRpbmdzKSBmbGFncy5wdXNoKCdUTm9kZUZsYWdzLmhhc0hvc3RCaW5kaW5ncycpO1xuICAgIGlmICh0aGlzLmZsYWdzICYgVE5vZGVGbGFncy5pc0NvbXBvbmVudEhvc3QpIGZsYWdzLnB1c2goJ1ROb2RlRmxhZ3MuaXNDb21wb25lbnRIb3N0Jyk7XG4gICAgaWYgKHRoaXMuZmxhZ3MgJiBUTm9kZUZsYWdzLmlzRGlyZWN0aXZlSG9zdCkgZmxhZ3MucHVzaCgnVE5vZGVGbGFncy5pc0RpcmVjdGl2ZUhvc3QnKTtcbiAgICBpZiAodGhpcy5mbGFncyAmIFROb2RlRmxhZ3MuaXNEZXRhY2hlZCkgZmxhZ3MucHVzaCgnVE5vZGVGbGFncy5pc0RldGFjaGVkJyk7XG4gICAgaWYgKHRoaXMuZmxhZ3MgJiBUTm9kZUZsYWdzLmlzUHJvamVjdGVkKSBmbGFncy5wdXNoKCdUTm9kZUZsYWdzLmlzUHJvamVjdGVkJyk7XG4gICAgcmV0dXJuIGZsYWdzLmpvaW4oJ3wnKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZV8oKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy50eXBlICYgVE5vZGVUeXBlLlRleHQpIHJldHVybiB0aGlzLnZhbHVlITtcbiAgICBjb25zdCBidWY6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgdGFnTmFtZSA9IHR5cGVvZiB0aGlzLnZhbHVlID09PSAnc3RyaW5nJyAmJiB0aGlzLnZhbHVlIHx8IHRoaXMudHlwZV87XG4gICAgYnVmLnB1c2goJzwnLCB0YWdOYW1lKTtcbiAgICBpZiAodGhpcy5mbGFncykge1xuICAgICAgYnVmLnB1c2goJyAnLCB0aGlzLmZsYWdzXyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmF0dHJzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXR0cnMubGVuZ3RoOykge1xuICAgICAgICBjb25zdCBhdHRyTmFtZSA9IHRoaXMuYXR0cnNbaSsrXTtcbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyTmFtZSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IHRoaXMuYXR0cnNbaSsrXTtcbiAgICAgICAgYnVmLnB1c2goJyAnLCBhdHRyTmFtZSBhcyBzdHJpbmcsICc9XCInLCBhdHRyVmFsdWUgYXMgc3RyaW5nLCAnXCInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYnVmLnB1c2goJz4nKTtcbiAgICBwcm9jZXNzVE5vZGVDaGlsZHJlbih0aGlzLmNoaWxkLCBidWYpO1xuICAgIGJ1Zi5wdXNoKCc8LycsIHRhZ05hbWUsICc+Jyk7XG4gICAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbiAgfVxuXG4gIGdldCBzdHlsZUJpbmRpbmdzXygpOiBEZWJ1Z1N0eWxlQmluZGluZ3Mge1xuICAgIHJldHVybiB0b0RlYnVnU3R5bGVCaW5kaW5nKHRoaXMsIGZhbHNlKTtcbiAgfVxuICBnZXQgY2xhc3NCaW5kaW5nc18oKTogRGVidWdTdHlsZUJpbmRpbmdzIHtcbiAgICByZXR1cm4gdG9EZWJ1Z1N0eWxlQmluZGluZyh0aGlzLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBwcm92aWRlckluZGV4U3RhcnRfKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJJbmRleGVzICYgVE5vZGVQcm92aWRlckluZGV4ZXMuUHJvdmlkZXJzU3RhcnRJbmRleE1hc2s7XG4gIH1cbiAgZ2V0IHByb3ZpZGVySW5kZXhFbmRfKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJJbmRleFN0YXJ0XyArXG4gICAgICAgICh0aGlzLnByb3ZpZGVySW5kZXhlcyA+Pj4gVE5vZGVQcm92aWRlckluZGV4ZXMuQ3B0Vmlld1Byb3ZpZGVyc0NvdW50U2hpZnQpO1xuICB9XG59XG5leHBvcnQgY29uc3QgVE5vZGVEZWJ1ZyA9IFROb2RlO1xuZXhwb3J0IHR5cGUgVE5vZGVEZWJ1ZyA9IFROb2RlO1xuXG5leHBvcnQgaW50ZXJmYWNlIERlYnVnU3R5bGVCaW5kaW5ncyBleHRlbmRzXG4gICAgQXJyYXk8S2V5VmFsdWVBcnJheTxhbnk+fERlYnVnU3R5bGVCaW5kaW5nfHN0cmluZ3xudWxsPiB7fVxuZXhwb3J0IGludGVyZmFjZSBEZWJ1Z1N0eWxlQmluZGluZyB7XG4gIGtleTogVFN0eWxpbmdLZXk7XG4gIGluZGV4OiBudW1iZXI7XG4gIGlzVGVtcGxhdGU6IGJvb2xlYW47XG4gIHByZXZEdXBsaWNhdGU6IGJvb2xlYW47XG4gIG5leHREdXBsaWNhdGU6IGJvb2xlYW47XG4gIHByZXZJbmRleDogbnVtYmVyO1xuICBuZXh0SW5kZXg6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gdG9EZWJ1Z1N0eWxlQmluZGluZyh0Tm9kZTogVE5vZGUsIGlzQ2xhc3NCYXNlZDogYm9vbGVhbik6IERlYnVnU3R5bGVCaW5kaW5ncyB7XG4gIGNvbnN0IHREYXRhID0gdE5vZGUudFZpZXdfLmRhdGE7XG4gIGNvbnN0IGJpbmRpbmdzOiBEZWJ1Z1N0eWxlQmluZGluZ3MgPSBbXSBhcyBhbnk7XG4gIGNvbnN0IHJhbmdlID0gaXNDbGFzc0Jhc2VkID8gdE5vZGUuY2xhc3NCaW5kaW5ncyA6IHROb2RlLnN0eWxlQmluZGluZ3M7XG4gIGNvbnN0IHByZXYgPSBnZXRUU3R5bGluZ1JhbmdlUHJldihyYW5nZSk7XG4gIGNvbnN0IG5leHQgPSBnZXRUU3R5bGluZ1JhbmdlTmV4dChyYW5nZSk7XG4gIGxldCBpc1RlbXBsYXRlID0gbmV4dCAhPT0gMDtcbiAgbGV0IGN1cnNvciA9IGlzVGVtcGxhdGUgPyBuZXh0IDogcHJldjtcbiAgd2hpbGUgKGN1cnNvciAhPT0gMCkge1xuICAgIGNvbnN0IGl0ZW1LZXkgPSB0RGF0YVtjdXJzb3JdIGFzIFRTdHlsaW5nS2V5O1xuICAgIGNvbnN0IGl0ZW1SYW5nZSA9IHREYXRhW2N1cnNvciArIDFdIGFzIFRTdHlsaW5nUmFuZ2U7XG4gICAgYmluZGluZ3MudW5zaGlmdCh7XG4gICAgICBrZXk6IGl0ZW1LZXksXG4gICAgICBpbmRleDogY3Vyc29yLFxuICAgICAgaXNUZW1wbGF0ZTogaXNUZW1wbGF0ZSxcbiAgICAgIHByZXZEdXBsaWNhdGU6IGdldFRTdHlsaW5nUmFuZ2VQcmV2RHVwbGljYXRlKGl0ZW1SYW5nZSksXG4gICAgICBuZXh0RHVwbGljYXRlOiBnZXRUU3R5bGluZ1JhbmdlTmV4dER1cGxpY2F0ZShpdGVtUmFuZ2UpLFxuICAgICAgbmV4dEluZGV4OiBnZXRUU3R5bGluZ1JhbmdlTmV4dChpdGVtUmFuZ2UpLFxuICAgICAgcHJldkluZGV4OiBnZXRUU3R5bGluZ1JhbmdlUHJldihpdGVtUmFuZ2UpLFxuICAgIH0pO1xuICAgIGlmIChjdXJzb3IgPT09IHByZXYpIGlzVGVtcGxhdGUgPSBmYWxzZTtcbiAgICBjdXJzb3IgPSBnZXRUU3R5bGluZ1JhbmdlUHJldihpdGVtUmFuZ2UpO1xuICB9XG4gIGJpbmRpbmdzLnB1c2goKGlzQ2xhc3NCYXNlZCA/IHROb2RlLnJlc2lkdWFsQ2xhc3NlcyA6IHROb2RlLnJlc2lkdWFsU3R5bGVzKSB8fCBudWxsKTtcbiAgcmV0dXJuIGJpbmRpbmdzO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzVE5vZGVDaGlsZHJlbih0Tm9kZTogSVROb2RlfG51bGwsIGJ1Zjogc3RyaW5nW10pIHtcbiAgd2hpbGUgKHROb2RlKSB7XG4gICAgYnVmLnB1c2goKHROb2RlIGFzIGFueSBhcyB7dGVtcGxhdGVfOiBzdHJpbmd9KS50ZW1wbGF0ZV8pO1xuICAgIHROb2RlID0gdE5vZGUubmV4dDtcbiAgfVxufVxuXG5jbGFzcyBUVmlld0RhdGEgZXh0ZW5kcyBBcnJheSB7fVxubGV0IFRWSUVXREFUQV9FTVBUWTogdW5rbm93bltdOyAgLy8gY2FuJ3QgaW5pdGlhbGl6ZSBoZXJlIG9yIGl0IHdpbGwgbm90IGJlIHRyZWUgc2hha2VuLCBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBgTFZpZXdgIGNvbnN0cnVjdG9yIGNvdWxkIGhhdmUgc2lkZS1lZmZlY3RzLlxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGNsb25lcyBhIGJsdWVwcmludCBhbmQgY3JlYXRlcyBURGF0YS5cbiAqXG4gKiBTaW1wbGUgc2xpY2Ugd2lsbCBrZWVwIHRoZSBzYW1lIHR5cGUsIGFuZCB3ZSBuZWVkIGl0IHRvIGJlIFREYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZVRvVFZpZXdEYXRhKGxpc3Q6IGFueVtdKTogVERhdGEge1xuICBpZiAoVFZJRVdEQVRBX0VNUFRZID09PSB1bmRlZmluZWQpIFRWSUVXREFUQV9FTVBUWSA9IG5ldyBUVmlld0RhdGEoKTtcbiAgcmV0dXJuIFRWSUVXREFUQV9FTVBUWS5jb25jYXQobGlzdCkgYXMgYW55O1xufVxuXG5leHBvcnQgY2xhc3MgTFZpZXdCbHVlcHJpbnQgZXh0ZW5kcyBBcnJheSB7fVxuZXhwb3J0IGNsYXNzIE1hdGNoZXNBcnJheSBleHRlbmRzIEFycmF5IHt9XG5leHBvcnQgY2xhc3MgVFZpZXdDb21wb25lbnRzIGV4dGVuZHMgQXJyYXkge31cbmV4cG9ydCBjbGFzcyBUTm9kZUxvY2FsTmFtZXMgZXh0ZW5kcyBBcnJheSB7fVxuZXhwb3J0IGNsYXNzIFROb2RlSW5pdGlhbElucHV0cyBleHRlbmRzIEFycmF5IHt9XG5leHBvcnQgY2xhc3MgTENsZWFudXAgZXh0ZW5kcyBBcnJheSB7fVxuZXhwb3J0IGNsYXNzIFRDbGVhbnVwIGV4dGVuZHMgQXJyYXkge31cblxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaExWaWV3RGVidWcobFZpZXc6IExWaWV3KSB7XG4gIGF0dGFjaERlYnVnT2JqZWN0KGxWaWV3LCBuZXcgTFZpZXdEZWJ1ZyhsVmlldykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoTENvbnRhaW5lckRlYnVnKGxDb250YWluZXI6IExDb250YWluZXIpIHtcbiAgYXR0YWNoRGVidWdPYmplY3QobENvbnRhaW5lciwgbmV3IExDb250YWluZXJEZWJ1ZyhsQ29udGFpbmVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlYnVnKG9iajogTFZpZXcpOiBJTFZpZXdEZWJ1ZztcbmV4cG9ydCBmdW5jdGlvbiB0b0RlYnVnKG9iajogTFZpZXd8bnVsbCk6IElMVmlld0RlYnVnfG51bGw7XG5leHBvcnQgZnVuY3Rpb24gdG9EZWJ1ZyhvYmo6IExWaWV3fExDb250YWluZXJ8bnVsbCk6IElMVmlld0RlYnVnfElMQ29udGFpbmVyRGVidWd8bnVsbDtcbmV4cG9ydCBmdW5jdGlvbiB0b0RlYnVnKG9iajogYW55KTogYW55IHtcbiAgaWYgKG9iaikge1xuICAgIGNvbnN0IGRlYnVnID0gKG9iaiBhcyBhbnkpLmRlYnVnO1xuICAgIGFzc2VydERlZmluZWQoZGVidWcsICdPYmplY3QgZG9lcyBub3QgaGF2ZSBhIGRlYnVnIHJlcHJlc2VudGF0aW9uLicpO1xuICAgIHJldHVybiBkZWJ1ZztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbi8qKlxuICogVXNlIHRoaXMgbWV0aG9kIHRvIHVud3JhcCBhIG5hdGl2ZSBlbGVtZW50IGluIGBMVmlld2AgYW5kIGNvbnZlcnQgaXQgaW50byBIVE1MIGZvciBlYXNpZXJcbiAqIHJlYWRpbmcuXG4gKlxuICogQHBhcmFtIHZhbHVlIHBvc3NpYmx5IHdyYXBwZWQgbmF0aXZlIERPTSBub2RlLlxuICogQHBhcmFtIGluY2x1ZGVDaGlsZHJlbiBJZiBgdHJ1ZWAgdGhlbiB0aGUgc2VyaWFsaXplZCBIVE1MIGZvcm0gd2lsbCBpbmNsdWRlIGNoaWxkIGVsZW1lbnRzXG4gKiAoc2FtZVxuICogYXMgYG91dGVySFRNTGApLiBJZiBgZmFsc2VgIHRoZW4gdGhlIHNlcmlhbGl6ZWQgSFRNTCBmb3JtIHdpbGwgb25seSBjb250YWluIHRoZSBlbGVtZW50XG4gKiBpdHNlbGZcbiAqICh3aWxsIG5vdCBzZXJpYWxpemUgY2hpbGQgZWxlbWVudHMpLlxuICovXG5mdW5jdGlvbiB0b0h0bWwodmFsdWU6IGFueSwgaW5jbHVkZUNoaWxkcmVuOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmd8bnVsbCB7XG4gIGNvbnN0IG5vZGU6IE5vZGV8bnVsbCA9IHVud3JhcFJOb2RlKHZhbHVlKSBhcyBhbnk7XG4gIGlmIChub2RlKSB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIE5vZGUuVEVYVF9OT0RFOlxuICAgICAgICByZXR1cm4gbm9kZS50ZXh0Q29udGVudDtcbiAgICAgIGNhc2UgTm9kZS5DT01NRU5UX05PREU6XG4gICAgICAgIHJldHVybiBgPCEtLSR7KG5vZGUgYXMgQ29tbWVudCkudGV4dENvbnRlbnR9LS0+YDtcbiAgICAgIGNhc2UgTm9kZS5FTEVNRU5UX05PREU6XG4gICAgICAgIGNvbnN0IG91dGVySFRNTCA9IChub2RlIGFzIEVsZW1lbnQpLm91dGVySFRNTDtcbiAgICAgICAgaWYgKGluY2x1ZGVDaGlsZHJlbikge1xuICAgICAgICAgIHJldHVybiBvdXRlckhUTUw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaW5uZXJIVE1MID0gJz4nICsgKG5vZGUgYXMgRWxlbWVudCkuaW5uZXJIVE1MICsgJzwnO1xuICAgICAgICAgIHJldHVybiAob3V0ZXJIVE1MLnNwbGl0KGlubmVySFRNTClbMF0pICsgJz4nO1xuICAgICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgTFZpZXdEZWJ1ZyBpbXBsZW1lbnRzIElMVmlld0RlYnVnIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfcmF3X2xWaWV3OiBMVmlldykge31cblxuICAvKipcbiAgICogRmxhZ3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBgTFZpZXdgIHVucGFja2VkIGludG8gYSBtb3JlIHJlYWRhYmxlIHN0YXRlLlxuICAgKi9cbiAgZ2V0IGZsYWdzKCkge1xuICAgIGNvbnN0IGZsYWdzID0gdGhpcy5fcmF3X2xWaWV3W0ZMQUdTXTtcbiAgICByZXR1cm4ge1xuICAgICAgX19yYXdfX2ZsYWdzX186IGZsYWdzLFxuICAgICAgaW5pdFBoYXNlU3RhdGU6IGZsYWdzICYgTFZpZXdGbGFncy5Jbml0UGhhc2VTdGF0ZU1hc2ssXG4gICAgICBjcmVhdGlvbk1vZGU6ICEhKGZsYWdzICYgTFZpZXdGbGFncy5DcmVhdGlvbk1vZGUpLFxuICAgICAgZmlyc3RWaWV3UGFzczogISEoZmxhZ3MgJiBMVmlld0ZsYWdzLkZpcnN0TFZpZXdQYXNzKSxcbiAgICAgIGNoZWNrQWx3YXlzOiAhIShmbGFncyAmIExWaWV3RmxhZ3MuQ2hlY2tBbHdheXMpLFxuICAgICAgZGlydHk6ICEhKGZsYWdzICYgTFZpZXdGbGFncy5EaXJ0eSksXG4gICAgICBhdHRhY2hlZDogISEoZmxhZ3MgJiBMVmlld0ZsYWdzLkF0dGFjaGVkKSxcbiAgICAgIGRlc3Ryb3llZDogISEoZmxhZ3MgJiBMVmlld0ZsYWdzLkRlc3Ryb3llZCksXG4gICAgICBpc1Jvb3Q6ICEhKGZsYWdzICYgTFZpZXdGbGFncy5Jc1Jvb3QpLFxuICAgICAgaW5kZXhXaXRoaW5Jbml0UGhhc2U6IGZsYWdzID4+IExWaWV3RmxhZ3MuSW5kZXhXaXRoaW5Jbml0UGhhc2VTaGlmdCxcbiAgICB9O1xuICB9XG4gIGdldCBwYXJlbnQoKTogSUxWaWV3RGVidWd8SUxDb250YWluZXJEZWJ1Z3xudWxsIHtcbiAgICByZXR1cm4gdG9EZWJ1Zyh0aGlzLl9yYXdfbFZpZXdbUEFSRU5UXSk7XG4gIH1cbiAgZ2V0IGhvc3RIVE1MKCk6IHN0cmluZ3xudWxsIHtcbiAgICByZXR1cm4gdG9IdG1sKHRoaXMuX3Jhd19sVmlld1tIT1NUXSwgdHJ1ZSk7XG4gIH1cbiAgZ2V0IGh0bWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHRoaXMubm9kZXMgfHwgW10pLm1hcChtYXBUb0hUTUwpLmpvaW4oJycpO1xuICB9XG4gIGdldCBjb250ZXh0KCk6IHt9fG51bGwge1xuICAgIHJldHVybiB0aGlzLl9yYXdfbFZpZXdbQ09OVEVYVF07XG4gIH1cbiAgLyoqXG4gICAqIFRoZSB0cmVlIG9mIG5vZGVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBgTFZpZXdgLiBUaGUgbm9kZXMgaGF2ZSBiZWVuIG5vcm1hbGl6ZWQgaW50b1xuICAgKiBhIHRyZWUgc3RydWN0dXJlIHdpdGggcmVsZXZhbnQgZGV0YWlscyBwdWxsZWQgb3V0IGZvciByZWFkYWJpbGl0eS5cbiAgICovXG4gIGdldCBub2RlcygpOiBEZWJ1Z05vZGVbXSB7XG4gICAgY29uc3QgbFZpZXcgPSB0aGlzLl9yYXdfbFZpZXc7XG4gICAgY29uc3QgdE5vZGUgPSBsVmlld1tUVklFV10uZmlyc3RDaGlsZDtcbiAgICByZXR1cm4gdG9EZWJ1Z05vZGVzKHROb2RlLCBsVmlldyk7XG4gIH1cbiAgZ2V0IHRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0aGlzLnRWaWV3IGFzIGFueSBhcyB7dGVtcGxhdGVfOiBzdHJpbmd9KS50ZW1wbGF0ZV87XG4gIH1cbiAgZ2V0IHRWaWV3KCk6IElUVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jhd19sVmlld1tUVklFV107XG4gIH1cbiAgZ2V0IGNsZWFudXAoKTogYW55W118bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3Jhd19sVmlld1tDTEVBTlVQXTtcbiAgfVxuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3J8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3Jhd19sVmlld1tJTkpFQ1RPUl07XG4gIH1cbiAgZ2V0IHJlbmRlcmVyRmFjdG9yeSgpOiBSZW5kZXJlckZhY3RvcnkzIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3X2xWaWV3W1JFTkRFUkVSX0ZBQ1RPUlldO1xuICB9XG4gIGdldCByZW5kZXJlcigpOiBSZW5kZXJlcjMge1xuICAgIHJldHVybiB0aGlzLl9yYXdfbFZpZXdbUkVOREVSRVJdO1xuICB9XG4gIGdldCBzYW5pdGl6ZXIoKTogU2FuaXRpemVyfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9yYXdfbFZpZXdbU0FOSVRJWkVSXTtcbiAgfVxuICBnZXQgY2hpbGRIZWFkKCk6IElMVmlld0RlYnVnfElMQ29udGFpbmVyRGVidWd8bnVsbCB7XG4gICAgcmV0dXJuIHRvRGVidWcodGhpcy5fcmF3X2xWaWV3W0NISUxEX0hFQURdKTtcbiAgfVxuICBnZXQgbmV4dCgpOiBJTFZpZXdEZWJ1Z3xJTENvbnRhaW5lckRlYnVnfG51bGwge1xuICAgIHJldHVybiB0b0RlYnVnKHRoaXMuX3Jhd19sVmlld1tORVhUXSk7XG4gIH1cbiAgZ2V0IGNoaWxkVGFpbCgpOiBJTFZpZXdEZWJ1Z3xJTENvbnRhaW5lckRlYnVnfG51bGwge1xuICAgIHJldHVybiB0b0RlYnVnKHRoaXMuX3Jhd19sVmlld1tDSElMRF9UQUlMXSk7XG4gIH1cbiAgZ2V0IGRlY2xhcmF0aW9uVmlldygpOiBJTFZpZXdEZWJ1Z3xudWxsIHtcbiAgICByZXR1cm4gdG9EZWJ1Zyh0aGlzLl9yYXdfbFZpZXdbREVDTEFSQVRJT05fVklFV10pO1xuICB9XG4gIGdldCBxdWVyaWVzKCk6IExRdWVyaWVzfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9yYXdfbFZpZXdbUVVFUklFU107XG4gIH1cbiAgZ2V0IHRIb3N0KCk6IElUTm9kZXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3X2xWaWV3W1RfSE9TVF07XG4gIH1cblxuICBnZXQgZGVjbHMoKTogTFZpZXdEZWJ1Z1JhbmdlIHtcbiAgICByZXR1cm4gdG9MVmlld1JhbmdlKHRoaXMudFZpZXcsIHRoaXMuX3Jhd19sVmlldywgSEVBREVSX09GRlNFVCwgdGhpcy50Vmlldy5iaW5kaW5nU3RhcnRJbmRleCk7XG4gIH1cblxuICBnZXQgdmFycygpOiBMVmlld0RlYnVnUmFuZ2Uge1xuICAgIHJldHVybiB0b0xWaWV3UmFuZ2UoXG4gICAgICAgIHRoaXMudFZpZXcsIHRoaXMuX3Jhd19sVmlldywgdGhpcy50Vmlldy5iaW5kaW5nU3RhcnRJbmRleCwgdGhpcy50Vmlldy5leHBhbmRvU3RhcnRJbmRleCk7XG4gIH1cblxuICBnZXQgZXhwYW5kbygpOiBMVmlld0RlYnVnUmFuZ2Uge1xuICAgIHJldHVybiB0b0xWaWV3UmFuZ2UoXG4gICAgICAgIHRoaXMudFZpZXcsIHRoaXMuX3Jhd19sVmlldywgdGhpcy50Vmlldy5leHBhbmRvU3RhcnRJbmRleCwgdGhpcy5fcmF3X2xWaWV3Lmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplZCB2aWV3IG9mIGNoaWxkIHZpZXdzIChhbmQgY29udGFpbmVycykgYXR0YWNoZWQgYXQgdGhpcyBsb2NhdGlvbi5cbiAgICovXG4gIGdldCBjaGlsZFZpZXdzKCk6IEFycmF5PElMVmlld0RlYnVnfElMQ29udGFpbmVyRGVidWc+IHtcbiAgICBjb25zdCBjaGlsZFZpZXdzOiBBcnJheTxJTFZpZXdEZWJ1Z3xJTENvbnRhaW5lckRlYnVnPiA9IFtdO1xuICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRIZWFkO1xuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgY2hpbGRWaWV3cy5wdXNoKGNoaWxkKTtcbiAgICAgIGNoaWxkID0gY2hpbGQubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkVmlld3M7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwVG9IVE1MKG5vZGU6IERlYnVnTm9kZSk6IHN0cmluZyB7XG4gIGlmIChub2RlLnR5cGUgPT09ICdFbGVtZW50Q29udGFpbmVyJykge1xuICAgIHJldHVybiAobm9kZS5jaGlsZHJlbiB8fCBbXSkubWFwKG1hcFRvSFRNTCkuam9pbignJyk7XG4gIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAnSWN1Q29udGFpbmVyJykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRvSHRtbChub2RlLm5hdGl2ZSwgdHJ1ZSkgfHwgJyc7XG4gIH1cbn1cblxuZnVuY3Rpb24gdG9MVmlld1JhbmdlKHRWaWV3OiBUVmlldywgbFZpZXc6IExWaWV3LCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IExWaWV3RGVidWdSYW5nZSB7XG4gIGxldCBjb250ZW50OiBMVmlld0RlYnVnUmFuZ2VDb250ZW50W10gPSBbXTtcbiAgZm9yIChsZXQgaW5kZXggPSBzdGFydDsgaW5kZXggPCBlbmQ7IGluZGV4KyspIHtcbiAgICBjb250ZW50LnB1c2goe2luZGV4OiBpbmRleCwgdDogdFZpZXcuZGF0YVtpbmRleF0sIGw6IGxWaWV3W2luZGV4XX0pO1xuICB9XG4gIHJldHVybiB7c3RhcnQ6IHN0YXJ0LCBlbmQ6IGVuZCwgbGVuZ3RoOiBlbmQgLSBzdGFydCwgY29udGVudDogY29udGVudH07XG59XG5cbi8qKlxuICogVHVybnMgYSBmbGF0IGxpc3Qgb2Ygbm9kZXMgaW50byBhIHRyZWUgYnkgd2Fsa2luZyB0aGUgYXNzb2NpYXRlZCBgVE5vZGVgIHRyZWUuXG4gKlxuICogQHBhcmFtIHROb2RlXG4gKiBAcGFyYW0gbFZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvRGVidWdOb2Rlcyh0Tm9kZTogSVROb2RlfG51bGwsIGxWaWV3OiBMVmlldyk6IERlYnVnTm9kZVtdIHtcbiAgaWYgKHROb2RlKSB7XG4gICAgY29uc3QgZGVidWdOb2RlczogRGVidWdOb2RlW10gPSBbXTtcbiAgICBsZXQgdE5vZGVDdXJzb3I6IElUTm9kZXxudWxsID0gdE5vZGU7XG4gICAgd2hpbGUgKHROb2RlQ3Vyc29yKSB7XG4gICAgICBkZWJ1Z05vZGVzLnB1c2goYnVpbGREZWJ1Z05vZGUodE5vZGVDdXJzb3IsIGxWaWV3KSk7XG4gICAgICB0Tm9kZUN1cnNvciA9IHROb2RlQ3Vyc29yLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiBkZWJ1Z05vZGVzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGREZWJ1Z05vZGUodE5vZGU6IElUTm9kZSwgbFZpZXc6IExWaWV3KTogRGVidWdOb2RlIHtcbiAgY29uc3QgcmF3VmFsdWUgPSBsVmlld1t0Tm9kZS5pbmRleF07XG4gIGNvbnN0IG5hdGl2ZSA9IHVud3JhcFJOb2RlKHJhd1ZhbHVlKTtcbiAgY29uc3QgZmFjdG9yaWVzOiBUeXBlPGFueT5bXSA9IFtdO1xuICBjb25zdCBpbnN0YW5jZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHRWaWV3ID0gbFZpZXdbVFZJRVddO1xuICBmb3IgKGxldCBpID0gdE5vZGUuZGlyZWN0aXZlU3RhcnQ7IGkgPCB0Tm9kZS5kaXJlY3RpdmVFbmQ7IGkrKykge1xuICAgIGNvbnN0IGRlZiA9IHRWaWV3LmRhdGFbaV0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgZmFjdG9yaWVzLnB1c2goZGVmLnR5cGUpO1xuICAgIGluc3RhbmNlcy5wdXNoKGxWaWV3W2ldKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGh0bWw6IHRvSHRtbChuYXRpdmUpLFxuICAgIHR5cGU6IHRvVE5vZGVUeXBlQXNTdHJpbmcodE5vZGUudHlwZSksXG4gICAgdE5vZGUsXG4gICAgbmF0aXZlOiBuYXRpdmUgYXMgYW55LFxuICAgIGNoaWxkcmVuOiB0b0RlYnVnTm9kZXModE5vZGUuY2hpbGQsIGxWaWV3KSxcbiAgICBmYWN0b3JpZXMsXG4gICAgaW5zdGFuY2VzLFxuICAgIGluamVjdG9yOiBidWlsZE5vZGVJbmplY3RvckRlYnVnKHROb2RlLCB0VmlldywgbFZpZXcpLFxuICAgIGdldCBpbmplY3RvclJlc29sdXRpb25QYXRoKCkge1xuICAgICAgcmV0dXJuICh0Tm9kZSBhcyBUTm9kZSkuZGVidWdOb2RlSW5qZWN0b3JQYXRoKGxWaWV3KTtcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZE5vZGVJbmplY3RvckRlYnVnKHROb2RlOiBJVE5vZGUsIHRWaWV3OiBJVFZpZXcsIGxWaWV3OiBMVmlldyk6IE5vZGVJbmplY3RvckRlYnVnIHtcbiAgY29uc3Qgdmlld1Byb3ZpZGVyczogVHlwZTxhbnk+W10gPSBbXTtcbiAgZm9yIChsZXQgaSA9ICh0Tm9kZSBhcyBUTm9kZSkucHJvdmlkZXJJbmRleFN0YXJ0XzsgaSA8ICh0Tm9kZSBhcyBUTm9kZSkucHJvdmlkZXJJbmRleEVuZF87IGkrKykge1xuICAgIHZpZXdQcm92aWRlcnMucHVzaCh0Vmlldy5kYXRhW2ldIGFzIFR5cGU8YW55Pik7XG4gIH1cbiAgY29uc3QgcHJvdmlkZXJzOiBUeXBlPGFueT5bXSA9IFtdO1xuICBmb3IgKGxldCBpID0gKHROb2RlIGFzIFROb2RlKS5wcm92aWRlckluZGV4RW5kXzsgaSA8ICh0Tm9kZSBhcyBUTm9kZSkuZGlyZWN0aXZlRW5kOyBpKyspIHtcbiAgICBwcm92aWRlcnMucHVzaCh0Vmlldy5kYXRhW2ldIGFzIFR5cGU8YW55Pik7XG4gIH1cbiAgY29uc3Qgbm9kZUluamVjdG9yRGVidWcgPSB7XG4gICAgYmxvb206IHRvQmxvb20obFZpZXcsIHROb2RlLmluamVjdG9ySW5kZXgpLFxuICAgIGN1bXVsYXRpdmVCbG9vbTogdG9CbG9vbSh0Vmlldy5kYXRhLCB0Tm9kZS5pbmplY3RvckluZGV4KSxcbiAgICBwcm92aWRlcnMsXG4gICAgdmlld1Byb3ZpZGVycyxcbiAgICBwYXJlbnRJbmplY3RvckluZGV4OiBsVmlld1sodE5vZGUgYXMgVE5vZGUpLnByb3ZpZGVySW5kZXhTdGFydF8gLSAxXSxcbiAgfTtcbiAgcmV0dXJuIG5vZGVJbmplY3RvckRlYnVnO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSBudW1iZXIgYXQgYGlkeGAgbG9jYXRpb24gaW4gYGFycmF5YCBpbnRvIGJpbmFyeSByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0gYXJyYXlcbiAqIEBwYXJhbSBpZHhcbiAqL1xuZnVuY3Rpb24gYmluYXJ5KGFycmF5OiBhbnlbXSwgaWR4OiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCB2YWx1ZSA9IGFycmF5W2lkeF07XG4gIC8vIElmIG5vdCBhIG51bWJlciB3ZSBwcmludCA4IGA/YCB0byByZXRhaW4gYWxpZ25tZW50IGJ1dCBsZXQgdXNlciBrbm93IHRoYXQgaXQgd2FzIGNhbGxlZCBvblxuICAvLyB3cm9uZyB0eXBlLlxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykgcmV0dXJuICc/Pz8/Pz8/Pyc7XG4gIC8vIFdlIHByZWZpeCAwcyBzbyB0aGF0IHdlIGhhdmUgY29uc3RhbnQgbGVuZ3RoIG51bWJlclxuICBjb25zdCB0ZXh0ID0gJzAwMDAwMDAwJyArIHZhbHVlLnRvU3RyaW5nKDIpO1xuICByZXR1cm4gdGV4dC5zdWJzdHJpbmcodGV4dC5sZW5ndGggLSA4KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgYmxvb20gZmlsdGVyIGF0IGxvY2F0aW9uIGBpZHhgIGluIGBhcnJheWAgaW50byBiaW5hcnkgcmVwcmVzZW50YXRpb24uXG4gKlxuICogQHBhcmFtIGFycmF5XG4gKiBAcGFyYW0gaWR4XG4gKi9cbmZ1bmN0aW9uIHRvQmxvb20oYXJyYXk6IGFueVtdLCBpZHg6IG51bWJlcik6IHN0cmluZyB7XG4gIGlmIChpZHggPCAwKSB7XG4gICAgcmV0dXJuICdOT19OT0RFX0lOSkVDVE9SJztcbiAgfVxuICByZXR1cm4gYCR7YmluYXJ5KGFycmF5LCBpZHggKyA3KX1fJHtiaW5hcnkoYXJyYXksIGlkeCArIDYpfV8ke2JpbmFyeShhcnJheSwgaWR4ICsgNSl9XyR7XG4gICAgICBiaW5hcnkoYXJyYXksIGlkeCArIDQpfV8ke2JpbmFyeShhcnJheSwgaWR4ICsgMyl9XyR7YmluYXJ5KGFycmF5LCBpZHggKyAyKX1fJHtcbiAgICAgIGJpbmFyeShhcnJheSwgaWR4ICsgMSl9XyR7YmluYXJ5KGFycmF5LCBpZHggKyAwKX1gO1xufVxuXG5leHBvcnQgY2xhc3MgTENvbnRhaW5lckRlYnVnIGltcGxlbWVudHMgSUxDb250YWluZXJEZWJ1ZyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3Jhd19sQ29udGFpbmVyOiBMQ29udGFpbmVyKSB7fVxuXG4gIGdldCBoYXNUcmFuc3BsYW50ZWRWaWV3cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3X2xDb250YWluZXJbSEFTX1RSQU5TUExBTlRFRF9WSUVXU107XG4gIH1cbiAgZ2V0IHZpZXdzKCk6IElMVmlld0RlYnVnW10ge1xuICAgIHJldHVybiB0aGlzLl9yYXdfbENvbnRhaW5lci5zbGljZShDT05UQUlORVJfSEVBREVSX09GRlNFVClcbiAgICAgICAgLm1hcCh0b0RlYnVnIGFzIChsOiBMVmlldykgPT4gSUxWaWV3RGVidWcpO1xuICB9XG4gIGdldCBwYXJlbnQoKTogSUxWaWV3RGVidWd8bnVsbCB7XG4gICAgcmV0dXJuIHRvRGVidWcodGhpcy5fcmF3X2xDb250YWluZXJbUEFSRU5UXSk7XG4gIH1cbiAgZ2V0IG1vdmVkVmlld3MoKTogTFZpZXdbXXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3X2xDb250YWluZXJbTU9WRURfVklFV1NdO1xuICB9XG4gIGdldCBob3N0KCk6IFJFbGVtZW50fFJDb21tZW50fExWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fcmF3X2xDb250YWluZXJbSE9TVF07XG4gIH1cbiAgZ2V0IG5hdGl2ZSgpOiBSQ29tbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3Jhd19sQ29udGFpbmVyW05BVElWRV07XG4gIH1cbiAgZ2V0IG5leHQoKSB7XG4gICAgcmV0dXJuIHRvRGVidWcodGhpcy5fcmF3X2xDb250YWluZXJbTkVYVF0pO1xuICB9XG59XG4iXX0=