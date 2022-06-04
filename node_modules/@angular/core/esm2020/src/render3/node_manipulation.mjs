/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation } from '../metadata/view';
import { RendererStyleFlags2 } from '../render/api_flags';
import { addToArray, removeFromArray } from '../util/array_utils';
import { assertDefined, assertDomNode, assertEqual, assertFunction, assertString } from '../util/assert';
import { escapeCommentText } from '../util/dom';
import { assertLContainer, assertLView, assertParentView, assertProjectionSlots, assertTNodeForLView } from './assert';
import { attachPatchData } from './context_discovery';
import { icuContainerIterate } from './i18n/i18n_tree_shaking';
import { CONTAINER_HEADER_OFFSET, HAS_TRANSPLANTED_VIEWS, MOVED_VIEWS, NATIVE, unusedValueExportToPlacateAjd as unused1 } from './interfaces/container';
import { NodeInjectorFactory } from './interfaces/injector';
import { unusedValueExportToPlacateAjd as unused2 } from './interfaces/node';
import { unusedValueExportToPlacateAjd as unused3 } from './interfaces/projection';
import { isProceduralRenderer, unusedValueExportToPlacateAjd as unused4 } from './interfaces/renderer';
import { isLContainer, isLView } from './interfaces/type_checks';
import { CHILD_HEAD, CLEANUP, DECLARATION_COMPONENT_VIEW, DECLARATION_LCONTAINER, FLAGS, HOST, NEXT, PARENT, QUERIES, RENDERER, T_HOST, TVIEW, unusedValueExportToPlacateAjd as unused5 } from './interfaces/view';
import { getNamespaceUri } from './namespaces';
import { assertTNodeType } from './node_assert';
import { profiler } from './profiler';
import { getLViewParent } from './util/view_traversal_utils';
import { getNativeByTNode, unwrapRNode, updateTransplantedViewCount } from './util/view_utils';
const unusedValueToPlacateAjd = unused1 + unused2 + unused3 + unused4 + unused5;
/**
 * NOTE: for performance reasons, the possible actions are inlined within the function instead of
 * being passed as an argument.
 */
function applyToElementOrContainer(action, renderer, parent, lNodeToHandle, beforeNode) {
    // If this slot was allocated for a text node dynamically created by i18n, the text node itself
    // won't be created until i18nApply() in the update block, so this node should be skipped.
    // For more info, see "ICU expressions should work inside an ngTemplateOutlet inside an ngFor"
    // in `i18n_spec.ts`.
    if (lNodeToHandle != null) {
        let lContainer;
        let isComponent = false;
        // We are expecting an RNode, but in the case of a component or LContainer the `RNode` is
        // wrapped in an array which needs to be unwrapped. We need to know if it is a component and if
        // it has LContainer so that we can process all of those cases appropriately.
        if (isLContainer(lNodeToHandle)) {
            lContainer = lNodeToHandle;
        }
        else if (isLView(lNodeToHandle)) {
            isComponent = true;
            ngDevMode && assertDefined(lNodeToHandle[HOST], 'HOST must be defined for a component LView');
            lNodeToHandle = lNodeToHandle[HOST];
        }
        const rNode = unwrapRNode(lNodeToHandle);
        ngDevMode && !isProceduralRenderer(renderer) && assertDomNode(rNode);
        if (action === 0 /* Create */ && parent !== null) {
            if (beforeNode == null) {
                nativeAppendChild(renderer, parent, rNode);
            }
            else {
                nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
            }
        }
        else if (action === 1 /* Insert */ && parent !== null) {
            nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
        }
        else if (action === 2 /* Detach */) {
            nativeRemoveNode(renderer, rNode, isComponent);
        }
        else if (action === 3 /* Destroy */) {
            ngDevMode && ngDevMode.rendererDestroyNode++;
            renderer.destroyNode(rNode);
        }
        if (lContainer != null) {
            applyContainer(renderer, action, lContainer, parent, beforeNode);
        }
    }
}
export function createTextNode(renderer, value) {
    ngDevMode && ngDevMode.rendererCreateTextNode++;
    ngDevMode && ngDevMode.rendererSetText++;
    return isProceduralRenderer(renderer) ? renderer.createText(value) :
        renderer.createTextNode(value);
}
export function updateTextNode(renderer, rNode, value) {
    ngDevMode && ngDevMode.rendererSetText++;
    isProceduralRenderer(renderer) ? renderer.setValue(rNode, value) : rNode.textContent = value;
}
export function createCommentNode(renderer, value) {
    ngDevMode && ngDevMode.rendererCreateComment++;
    // isProceduralRenderer check is not needed because both `Renderer2` and `Renderer3` have the same
    // method name.
    return renderer.createComment(escapeCommentText(value));
}
/**
 * Creates a native element from a tag name, using a renderer.
 * @param renderer A renderer to use
 * @param name the tag name
 * @param namespace Optional namespace for element.
 * @returns the element created
 */
export function createElementNode(renderer, name, namespace) {
    ngDevMode && ngDevMode.rendererCreateElement++;
    if (isProceduralRenderer(renderer)) {
        return renderer.createElement(name, namespace);
    }
    else {
        const namespaceUri = namespace !== null ? getNamespaceUri(namespace) : null;
        return namespaceUri === null ? renderer.createElement(name) :
            renderer.createElementNS(namespaceUri, name);
    }
}
/**
 * Removes all DOM elements associated with a view.
 *
 * Because some root nodes of the view may be containers, we sometimes need
 * to propagate deeply into the nested containers to remove all elements in the
 * views beneath it.
 *
 * @param tView The `TView' of the `LView` from which elements should be added or removed
 * @param lView The view from which elements should be added or removed
 */
export function removeViewFromContainer(tView, lView) {
    const renderer = lView[RENDERER];
    applyView(tView, lView, renderer, 2 /* Detach */, null, null);
    lView[HOST] = null;
    lView[T_HOST] = null;
}
/**
 * Adds all DOM elements associated with a view.
 *
 * Because some root nodes of the view may be containers, we sometimes need
 * to propagate deeply into the nested containers to add all elements in the
 * views beneath it.
 *
 * @param tView The `TView' of the `LView` from which elements should be added or removed
 * @param parentTNode The `TNode` where the `LView` should be attached to.
 * @param renderer Current renderer to use for DOM manipulations.
 * @param lView The view from which elements should be added or removed
 * @param parentNativeNode The parent `RElement` where it should be inserted into.
 * @param beforeNode The node before which elements should be added, if insert mode
 */
export function addViewToContainer(tView, parentTNode, renderer, lView, parentNativeNode, beforeNode) {
    lView[HOST] = parentNativeNode;
    lView[T_HOST] = parentTNode;
    applyView(tView, lView, renderer, 1 /* Insert */, parentNativeNode, beforeNode);
}
/**
 * Detach a `LView` from the DOM by detaching its nodes.
 *
 * @param tView The `TView' of the `LView` to be detached
 * @param lView the `LView` to be detached.
 */
export function renderDetachView(tView, lView) {
    applyView(tView, lView, lView[RENDERER], 2 /* Detach */, null, null);
}
/**
 * Traverses down and up the tree of views and containers to remove listeners and
 * call onDestroy callbacks.
 *
 * Notes:
 *  - Because it's used for onDestroy calls, it needs to be bottom-up.
 *  - Must process containers instead of their views to avoid splicing
 *  when views are destroyed and re-added.
 *  - Using a while loop because it's faster than recursion
 *  - Destroy only called on movement to sibling or movement to parent (laterally or up)
 *
 *  @param rootView The view to destroy
 */
export function destroyViewTree(rootView) {
    // If the view has no children, we can clean it up and return early.
    let lViewOrLContainer = rootView[CHILD_HEAD];
    if (!lViewOrLContainer) {
        return cleanUpView(rootView[TVIEW], rootView);
    }
    while (lViewOrLContainer) {
        let next = null;
        if (isLView(lViewOrLContainer)) {
            // If LView, traverse down to child.
            next = lViewOrLContainer[CHILD_HEAD];
        }
        else {
            ngDevMode && assertLContainer(lViewOrLContainer);
            // If container, traverse down to its first LView.
            const firstView = lViewOrLContainer[CONTAINER_HEADER_OFFSET];
            if (firstView)
                next = firstView;
        }
        if (!next) {
            // Only clean up view when moving to the side or up, as destroy hooks
            // should be called in order from the bottom up.
            while (lViewOrLContainer && !lViewOrLContainer[NEXT] && lViewOrLContainer !== rootView) {
                if (isLView(lViewOrLContainer)) {
                    cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
                }
                lViewOrLContainer = lViewOrLContainer[PARENT];
            }
            if (lViewOrLContainer === null)
                lViewOrLContainer = rootView;
            if (isLView(lViewOrLContainer)) {
                cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
            }
            next = lViewOrLContainer && lViewOrLContainer[NEXT];
        }
        lViewOrLContainer = next;
    }
}
/**
 * Inserts a view into a container.
 *
 * This adds the view to the container's array of active views in the correct
 * position. It also adds the view's elements to the DOM if the container isn't a
 * root node of another view (in that case, the view's elements will be added when
 * the container's parent view is added later).
 *
 * @param tView The `TView' of the `LView` to insert
 * @param lView The view to insert
 * @param lContainer The container into which the view should be inserted
 * @param index Which index in the container to insert the child view into
 */
export function insertView(tView, lView, lContainer, index) {
    ngDevMode && assertLView(lView);
    ngDevMode && assertLContainer(lContainer);
    const indexInContainer = CONTAINER_HEADER_OFFSET + index;
    const containerLength = lContainer.length;
    if (index > 0) {
        // This is a new view, we need to add it to the children.
        lContainer[indexInContainer - 1][NEXT] = lView;
    }
    if (index < containerLength - CONTAINER_HEADER_OFFSET) {
        lView[NEXT] = lContainer[indexInContainer];
        addToArray(lContainer, CONTAINER_HEADER_OFFSET + index, lView);
    }
    else {
        lContainer.push(lView);
        lView[NEXT] = null;
    }
    lView[PARENT] = lContainer;
    // track views where declaration and insertion points are different
    const declarationLContainer = lView[DECLARATION_LCONTAINER];
    if (declarationLContainer !== null && lContainer !== declarationLContainer) {
        trackMovedView(declarationLContainer, lView);
    }
    // notify query that a new view has been added
    const lQueries = lView[QUERIES];
    if (lQueries !== null) {
        lQueries.insertView(tView);
    }
    // Sets the attached flag
    lView[FLAGS] |= 128 /* Attached */;
}
/**
 * Track views created from the declaration container (TemplateRef) and inserted into a
 * different LContainer.
 */
function trackMovedView(declarationContainer, lView) {
    ngDevMode && assertDefined(lView, 'LView required');
    ngDevMode && assertLContainer(declarationContainer);
    const movedViews = declarationContainer[MOVED_VIEWS];
    const insertedLContainer = lView[PARENT];
    ngDevMode && assertLContainer(insertedLContainer);
    const insertedComponentLView = insertedLContainer[PARENT][DECLARATION_COMPONENT_VIEW];
    ngDevMode && assertDefined(insertedComponentLView, 'Missing insertedComponentLView');
    const declaredComponentLView = lView[DECLARATION_COMPONENT_VIEW];
    ngDevMode && assertDefined(declaredComponentLView, 'Missing declaredComponentLView');
    if (declaredComponentLView !== insertedComponentLView) {
        // At this point the declaration-component is not same as insertion-component; this means that
        // this is a transplanted view. Mark the declared lView as having transplanted views so that
        // those views can participate in CD.
        declarationContainer[HAS_TRANSPLANTED_VIEWS] = true;
    }
    if (movedViews === null) {
        declarationContainer[MOVED_VIEWS] = [lView];
    }
    else {
        movedViews.push(lView);
    }
}
function detachMovedView(declarationContainer, lView) {
    ngDevMode && assertLContainer(declarationContainer);
    ngDevMode &&
        assertDefined(declarationContainer[MOVED_VIEWS], 'A projected view should belong to a non-empty projected views collection');
    const movedViews = declarationContainer[MOVED_VIEWS];
    const declarationViewIndex = movedViews.indexOf(lView);
    const insertionLContainer = lView[PARENT];
    ngDevMode && assertLContainer(insertionLContainer);
    // If the view was marked for refresh but then detached before it was checked (where the flag
    // would be cleared and the counter decremented), we need to decrement the view counter here
    // instead.
    if (lView[FLAGS] & 1024 /* RefreshTransplantedView */) {
        lView[FLAGS] &= ~1024 /* RefreshTransplantedView */;
        updateTransplantedViewCount(insertionLContainer, -1);
    }
    movedViews.splice(declarationViewIndex, 1);
}
/**
 * Detaches a view from a container.
 *
 * This method removes the view from the container's array of active views. It also
 * removes the view's elements from the DOM.
 *
 * @param lContainer The container from which to detach a view
 * @param removeIndex The index of the view to detach
 * @returns Detached LView instance.
 */
export function detachView(lContainer, removeIndex) {
    if (lContainer.length <= CONTAINER_HEADER_OFFSET)
        return;
    const indexInContainer = CONTAINER_HEADER_OFFSET + removeIndex;
    const viewToDetach = lContainer[indexInContainer];
    if (viewToDetach) {
        const declarationLContainer = viewToDetach[DECLARATION_LCONTAINER];
        if (declarationLContainer !== null && declarationLContainer !== lContainer) {
            detachMovedView(declarationLContainer, viewToDetach);
        }
        if (removeIndex > 0) {
            lContainer[indexInContainer - 1][NEXT] = viewToDetach[NEXT];
        }
        const removedLView = removeFromArray(lContainer, CONTAINER_HEADER_OFFSET + removeIndex);
        removeViewFromContainer(viewToDetach[TVIEW], viewToDetach);
        // notify query that a view has been removed
        const lQueries = removedLView[QUERIES];
        if (lQueries !== null) {
            lQueries.detachView(removedLView[TVIEW]);
        }
        viewToDetach[PARENT] = null;
        viewToDetach[NEXT] = null;
        // Unsets the attached flag
        viewToDetach[FLAGS] &= ~128 /* Attached */;
    }
    return viewToDetach;
}
/**
 * A standalone function which destroys an LView,
 * conducting clean up (e.g. removing listeners, calling onDestroys).
 *
 * @param tView The `TView' of the `LView` to be destroyed
 * @param lView The view to be destroyed.
 */
export function destroyLView(tView, lView) {
    if (!(lView[FLAGS] & 256 /* Destroyed */)) {
        const renderer = lView[RENDERER];
        if (isProceduralRenderer(renderer) && renderer.destroyNode) {
            applyView(tView, lView, renderer, 3 /* Destroy */, null, null);
        }
        destroyViewTree(lView);
    }
}
/**
 * Calls onDestroys hooks for all directives and pipes in a given view and then removes all
 * listeners. Listeners are removed as the last step so events delivered in the onDestroys hooks
 * can be propagated to @Output listeners.
 *
 * @param tView `TView` for the `LView` to clean up.
 * @param lView The LView to clean up
 */
function cleanUpView(tView, lView) {
    if (!(lView[FLAGS] & 256 /* Destroyed */)) {
        // Usually the Attached flag is removed when the view is detached from its parent, however
        // if it's a root view, the flag won't be unset hence why we're also removing on destroy.
        lView[FLAGS] &= ~128 /* Attached */;
        // Mark the LView as destroyed *before* executing the onDestroy hooks. An onDestroy hook
        // runs arbitrary user code, which could include its own `viewRef.destroy()` (or similar). If
        // We don't flag the view as destroyed before the hooks, this could lead to an infinite loop.
        // This also aligns with the ViewEngine behavior. It also means that the onDestroy hook is
        // really more of an "afterDestroy" hook if you think about it.
        lView[FLAGS] |= 256 /* Destroyed */;
        executeOnDestroys(tView, lView);
        processCleanups(tView, lView);
        // For component views only, the local renderer is destroyed at clean up time.
        if (lView[TVIEW].type === 1 /* Component */ && isProceduralRenderer(lView[RENDERER])) {
            ngDevMode && ngDevMode.rendererDestroy++;
            lView[RENDERER].destroy();
        }
        const declarationContainer = lView[DECLARATION_LCONTAINER];
        // we are dealing with an embedded view that is still inserted into a container
        if (declarationContainer !== null && isLContainer(lView[PARENT])) {
            // and this is a projected view
            if (declarationContainer !== lView[PARENT]) {
                detachMovedView(declarationContainer, lView);
            }
            // For embedded views still attached to a container: remove query result from this view.
            const lQueries = lView[QUERIES];
            if (lQueries !== null) {
                lQueries.detachView(tView);
            }
        }
    }
}
/** Removes listeners and unsubscribes from output subscriptions */
function processCleanups(tView, lView) {
    const tCleanup = tView.cleanup;
    const lCleanup = lView[CLEANUP];
    // `LCleanup` contains both share information with `TCleanup` as well as instance specific
    // information appended at the end. We need to know where the end of the `TCleanup` information
    // is, and we track this with `lastLCleanupIndex`.
    let lastLCleanupIndex = -1;
    if (tCleanup !== null) {
        for (let i = 0; i < tCleanup.length - 1; i += 2) {
            if (typeof tCleanup[i] === 'string') {
                // This is a native DOM listener
                const idxOrTargetGetter = tCleanup[i + 1];
                const target = typeof idxOrTargetGetter === 'function' ?
                    idxOrTargetGetter(lView) :
                    unwrapRNode(lView[idxOrTargetGetter]);
                const listener = lCleanup[lastLCleanupIndex = tCleanup[i + 2]];
                const useCaptureOrSubIdx = tCleanup[i + 3];
                if (typeof useCaptureOrSubIdx === 'boolean') {
                    // native DOM listener registered with Renderer3
                    target.removeEventListener(tCleanup[i], listener, useCaptureOrSubIdx);
                }
                else {
                    if (useCaptureOrSubIdx >= 0) {
                        // unregister
                        lCleanup[lastLCleanupIndex = useCaptureOrSubIdx]();
                    }
                    else {
                        // Subscription
                        lCleanup[lastLCleanupIndex = -useCaptureOrSubIdx].unsubscribe();
                    }
                }
                i += 2;
            }
            else {
                // This is a cleanup function that is grouped with the index of its context
                const context = lCleanup[lastLCleanupIndex = tCleanup[i + 1]];
                tCleanup[i].call(context);
            }
        }
    }
    if (lCleanup !== null) {
        for (let i = lastLCleanupIndex + 1; i < lCleanup.length; i++) {
            const instanceCleanupFn = lCleanup[i];
            ngDevMode && assertFunction(instanceCleanupFn, 'Expecting instance cleanup function.');
            instanceCleanupFn();
        }
        lView[CLEANUP] = null;
    }
}
/** Calls onDestroy hooks for this view */
function executeOnDestroys(tView, lView) {
    let destroyHooks;
    if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
        for (let i = 0; i < destroyHooks.length; i += 2) {
            const context = lView[destroyHooks[i]];
            // Only call the destroy hook if the context has been requested.
            if (!(context instanceof NodeInjectorFactory)) {
                const toCall = destroyHooks[i + 1];
                if (Array.isArray(toCall)) {
                    for (let j = 0; j < toCall.length; j += 2) {
                        const callContext = context[toCall[j]];
                        const hook = toCall[j + 1];
                        profiler(4 /* LifecycleHookStart */, callContext, hook);
                        try {
                            hook.call(callContext);
                        }
                        finally {
                            profiler(5 /* LifecycleHookEnd */, callContext, hook);
                        }
                    }
                }
                else {
                    profiler(4 /* LifecycleHookStart */, context, toCall);
                    try {
                        toCall.call(context);
                    }
                    finally {
                        profiler(5 /* LifecycleHookEnd */, context, toCall);
                    }
                }
            }
        }
    }
}
/**
 * Returns a native element if a node can be inserted into the given parent.
 *
 * There are two reasons why we may not be able to insert a element immediately.
 * - Projection: When creating a child content element of a component, we have to skip the
 *   insertion because the content of a component will be projected.
 *   `<component><content>delayed due to projection</content></component>`
 * - Parent container is disconnected: This can happen when we are inserting a view into
 *   parent container, which itself is disconnected. For example the parent container is part
 *   of a View which has not be inserted or is made for projection but has not been inserted
 *   into destination.
 *
 * @param tView: Current `TView`.
 * @param tNode: `TNode` for which we wish to retrieve render parent.
 * @param lView: Current `LView`.
 */
export function getParentRElement(tView, tNode, lView) {
    return getClosestRElement(tView, tNode.parent, lView);
}
/**
 * Get closest `RElement` or `null` if it can't be found.
 *
 * If `TNode` is `TNodeType.Element` => return `RElement` at `LView[tNode.index]` location.
 * If `TNode` is `TNodeType.ElementContainer|IcuContain` => return the parent (recursively).
 * If `TNode` is `null` then return host `RElement`:
 *   - return `null` if projection
 *   - return `null` if parent container is disconnected (we have no parent.)
 *
 * @param tView: Current `TView`.
 * @param tNode: `TNode` for which we wish to retrieve `RElement` (or `null` if host element is
 *     needed).
 * @param lView: Current `LView`.
 * @returns `null` if the `RElement` can't be determined at this time (no parent / projection)
 */
export function getClosestRElement(tView, tNode, lView) {
    let parentTNode = tNode;
    // Skip over element and ICU containers as those are represented by a comment node and
    // can't be used as a render parent.
    while (parentTNode !== null &&
        (parentTNode.type & (8 /* ElementContainer */ | 32 /* Icu */))) {
        tNode = parentTNode;
        parentTNode = tNode.parent;
    }
    // If the parent tNode is null, then we are inserting across views: either into an embedded view
    // or a component view.
    if (parentTNode === null) {
        // We are inserting a root element of the component view into the component host element and
        // it should always be eager.
        return lView[HOST];
    }
    else {
        ngDevMode && assertTNodeType(parentTNode, 3 /* AnyRNode */ | 4 /* Container */);
        if (parentTNode.flags & 2 /* isComponentHost */) {
            ngDevMode && assertTNodeForLView(parentTNode, lView);
            const encapsulation = tView.data[parentTNode.directiveStart].encapsulation;
            // We've got a parent which is an element in the current view. We just need to verify if the
            // parent element is not a component. Component's content nodes are not inserted immediately
            // because they will be projected, and so doing insert at this point would be wasteful.
            // Since the projection would then move it to its final destination. Note that we can't
            // make this assumption when using the Shadow DOM, because the native projection placeholders
            // (<content> or <slot>) have to be in place as elements are being inserted.
            if (encapsulation === ViewEncapsulation.None ||
                encapsulation === ViewEncapsulation.Emulated) {
                return null;
            }
        }
        return getNativeByTNode(parentTNode, lView);
    }
}
/**
 * Inserts a native node before another native node for a given parent using {@link Renderer3}.
 * This is a utility function that can be used when native nodes were determined - it abstracts an
 * actual renderer being used.
 */
export function nativeInsertBefore(renderer, parent, child, beforeNode, isMove) {
    ngDevMode && ngDevMode.rendererInsertBefore++;
    if (isProceduralRenderer(renderer)) {
        renderer.insertBefore(parent, child, beforeNode, isMove);
    }
    else {
        parent.insertBefore(child, beforeNode, isMove);
    }
}
function nativeAppendChild(renderer, parent, child) {
    ngDevMode && ngDevMode.rendererAppendChild++;
    ngDevMode && assertDefined(parent, 'parent node must be defined');
    if (isProceduralRenderer(renderer)) {
        renderer.appendChild(parent, child);
    }
    else {
        parent.appendChild(child);
    }
}
function nativeAppendOrInsertBefore(renderer, parent, child, beforeNode, isMove) {
    if (beforeNode !== null) {
        nativeInsertBefore(renderer, parent, child, beforeNode, isMove);
    }
    else {
        nativeAppendChild(renderer, parent, child);
    }
}
/** Removes a node from the DOM given its native parent. */
function nativeRemoveChild(renderer, parent, child, isHostElement) {
    if (isProceduralRenderer(renderer)) {
        renderer.removeChild(parent, child, isHostElement);
    }
    else {
        parent.removeChild(child);
    }
}
/**
 * Returns a native parent of a given native node.
 */
export function nativeParentNode(renderer, node) {
    return (isProceduralRenderer(renderer) ? renderer.parentNode(node) : node.parentNode);
}
/**
 * Returns a native sibling of a given native node.
 */
export function nativeNextSibling(renderer, node) {
    return isProceduralRenderer(renderer) ? renderer.nextSibling(node) : node.nextSibling;
}
/**
 * Find a node in front of which `currentTNode` should be inserted.
 *
 * This method determines the `RNode` in front of which we should insert the `currentRNode`. This
 * takes `TNode.insertBeforeIndex` into account if i18n code has been invoked.
 *
 * @param parentTNode parent `TNode`
 * @param currentTNode current `TNode` (The node which we would like to insert into the DOM)
 * @param lView current `LView`
 */
function getInsertInFrontOfRNode(parentTNode, currentTNode, lView) {
    return _getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView);
}
/**
 * Find a node in front of which `currentTNode` should be inserted. (Does not take i18n into
 * account)
 *
 * This method determines the `RNode` in front of which we should insert the `currentRNode`. This
 * does not take `TNode.insertBeforeIndex` into account.
 *
 * @param parentTNode parent `TNode`
 * @param currentTNode current `TNode` (The node which we would like to insert into the DOM)
 * @param lView current `LView`
 */
export function getInsertInFrontOfRNodeWithNoI18n(parentTNode, currentTNode, lView) {
    if (parentTNode.type & (8 /* ElementContainer */ | 32 /* Icu */)) {
        return getNativeByTNode(parentTNode, lView);
    }
    return null;
}
/**
 * Tree shakable boundary for `getInsertInFrontOfRNodeWithI18n` function.
 *
 * This function will only be set if i18n code runs.
 */
let _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithNoI18n;
/**
 * Tree shakable boundary for `processI18nInsertBefore` function.
 *
 * This function will only be set if i18n code runs.
 */
let _processI18nInsertBefore;
export function setI18nHandling(getInsertInFrontOfRNodeWithI18n, processI18nInsertBefore) {
    _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithI18n;
    _processI18nInsertBefore = processI18nInsertBefore;
}
/**
 * Appends the `child` native node (or a collection of nodes) to the `parent`.
 *
 * @param tView The `TView' to be appended
 * @param lView The current LView
 * @param childRNode The native child (or children) that should be appended
 * @param childTNode The TNode of the child element
 */
export function appendChild(tView, lView, childRNode, childTNode) {
    const parentRNode = getParentRElement(tView, childTNode, lView);
    const renderer = lView[RENDERER];
    const parentTNode = childTNode.parent || lView[T_HOST];
    const anchorNode = getInsertInFrontOfRNode(parentTNode, childTNode, lView);
    if (parentRNode != null) {
        if (Array.isArray(childRNode)) {
            for (let i = 0; i < childRNode.length; i++) {
                nativeAppendOrInsertBefore(renderer, parentRNode, childRNode[i], anchorNode, false);
            }
        }
        else {
            nativeAppendOrInsertBefore(renderer, parentRNode, childRNode, anchorNode, false);
        }
    }
    _processI18nInsertBefore !== undefined &&
        _processI18nInsertBefore(renderer, childTNode, lView, childRNode, parentRNode);
}
/**
 * Returns the first native node for a given LView, starting from the provided TNode.
 *
 * Native nodes are returned in the order in which those appear in the native tree (DOM).
 */
function getFirstNativeNode(lView, tNode) {
    if (tNode !== null) {
        ngDevMode &&
            assertTNodeType(tNode, 3 /* AnyRNode */ | 12 /* AnyContainer */ | 32 /* Icu */ | 16 /* Projection */);
        const tNodeType = tNode.type;
        if (tNodeType & 3 /* AnyRNode */) {
            return getNativeByTNode(tNode, lView);
        }
        else if (tNodeType & 4 /* Container */) {
            return getBeforeNodeForView(-1, lView[tNode.index]);
        }
        else if (tNodeType & 8 /* ElementContainer */) {
            const elIcuContainerChild = tNode.child;
            if (elIcuContainerChild !== null) {
                return getFirstNativeNode(lView, elIcuContainerChild);
            }
            else {
                const rNodeOrLContainer = lView[tNode.index];
                if (isLContainer(rNodeOrLContainer)) {
                    return getBeforeNodeForView(-1, rNodeOrLContainer);
                }
                else {
                    return unwrapRNode(rNodeOrLContainer);
                }
            }
        }
        else if (tNodeType & 32 /* Icu */) {
            let nextRNode = icuContainerIterate(tNode, lView);
            let rNode = nextRNode();
            // If the ICU container has no nodes, than we use the ICU anchor as the node.
            return rNode || unwrapRNode(lView[tNode.index]);
        }
        else {
            const projectionNodes = getProjectionNodes(lView, tNode);
            if (projectionNodes !== null) {
                if (Array.isArray(projectionNodes)) {
                    return projectionNodes[0];
                }
                const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
                ngDevMode && assertParentView(parentView);
                return getFirstNativeNode(parentView, projectionNodes);
            }
            else {
                return getFirstNativeNode(lView, tNode.next);
            }
        }
    }
    return null;
}
export function getProjectionNodes(lView, tNode) {
    if (tNode !== null) {
        const componentView = lView[DECLARATION_COMPONENT_VIEW];
        const componentHost = componentView[T_HOST];
        const slotIdx = tNode.projection;
        ngDevMode && assertProjectionSlots(lView);
        return componentHost.projection[slotIdx];
    }
    return null;
}
export function getBeforeNodeForView(viewIndexInContainer, lContainer) {
    const nextViewIndex = CONTAINER_HEADER_OFFSET + viewIndexInContainer + 1;
    if (nextViewIndex < lContainer.length) {
        const lView = lContainer[nextViewIndex];
        const firstTNodeOfView = lView[TVIEW].firstChild;
        if (firstTNodeOfView !== null) {
            return getFirstNativeNode(lView, firstTNodeOfView);
        }
    }
    return lContainer[NATIVE];
}
/**
 * Removes a native node itself using a given renderer. To remove the node we are looking up its
 * parent from the native tree as not all platforms / browsers support the equivalent of
 * node.remove().
 *
 * @param renderer A renderer to be used
 * @param rNode The native node that should be removed
 * @param isHostElement A flag indicating if a node to be removed is a host of a component.
 */
export function nativeRemoveNode(renderer, rNode, isHostElement) {
    ngDevMode && ngDevMode.rendererRemoveNode++;
    const nativeParent = nativeParentNode(renderer, rNode);
    if (nativeParent) {
        nativeRemoveChild(renderer, nativeParent, rNode, isHostElement);
    }
}
/**
 * Performs the operation of `action` on the node. Typically this involves inserting or removing
 * nodes on the LView or projection boundary.
 */
function applyNodes(renderer, action, tNode, lView, parentRElement, beforeNode, isProjection) {
    while (tNode != null) {
        ngDevMode && assertTNodeForLView(tNode, lView);
        ngDevMode &&
            assertTNodeType(tNode, 3 /* AnyRNode */ | 12 /* AnyContainer */ | 16 /* Projection */ | 32 /* Icu */);
        const rawSlotValue = lView[tNode.index];
        const tNodeType = tNode.type;
        if (isProjection) {
            if (action === 0 /* Create */) {
                rawSlotValue && attachPatchData(unwrapRNode(rawSlotValue), lView);
                tNode.flags |= 4 /* isProjected */;
            }
        }
        if ((tNode.flags & 64 /* isDetached */) !== 64 /* isDetached */) {
            if (tNodeType & 8 /* ElementContainer */) {
                applyNodes(renderer, action, tNode.child, lView, parentRElement, beforeNode, false);
                applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
            }
            else if (tNodeType & 32 /* Icu */) {
                const nextRNode = icuContainerIterate(tNode, lView);
                let rNode;
                while (rNode = nextRNode()) {
                    applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
                }
                applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
            }
            else if (tNodeType & 16 /* Projection */) {
                applyProjectionRecursive(renderer, action, lView, tNode, parentRElement, beforeNode);
            }
            else {
                ngDevMode && assertTNodeType(tNode, 3 /* AnyRNode */ | 4 /* Container */);
                applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
            }
        }
        tNode = isProjection ? tNode.projectionNext : tNode.next;
    }
}
function applyView(tView, lView, renderer, action, parentRElement, beforeNode) {
    applyNodes(renderer, action, tView.firstChild, lView, parentRElement, beforeNode, false);
}
/**
 * `applyProjection` performs operation on the projection.
 *
 * Inserting a projection requires us to locate the projected nodes from the parent component. The
 * complication is that those nodes themselves could be re-projected from their parent component.
 *
 * @param tView The `TView` of `LView` which needs to be inserted, detached, destroyed
 * @param lView The `LView` which needs to be inserted, detached, destroyed.
 * @param tProjectionNode node to project
 */
export function applyProjection(tView, lView, tProjectionNode) {
    const renderer = lView[RENDERER];
    const parentRNode = getParentRElement(tView, tProjectionNode, lView);
    const parentTNode = tProjectionNode.parent || lView[T_HOST];
    let beforeNode = getInsertInFrontOfRNode(parentTNode, tProjectionNode, lView);
    applyProjectionRecursive(renderer, 0 /* Create */, lView, tProjectionNode, parentRNode, beforeNode);
}
/**
 * `applyProjectionRecursive` performs operation on the projection specified by `action` (insert,
 * detach, destroy)
 *
 * Inserting a projection requires us to locate the projected nodes from the parent component. The
 * complication is that those nodes themselves could be re-projected from their parent component.
 *
 * @param renderer Render to use
 * @param action action to perform (insert, detach, destroy)
 * @param lView The LView which needs to be inserted, detached, destroyed.
 * @param tProjectionNode node to project
 * @param parentRElement parent DOM element for insertion/removal.
 * @param beforeNode Before which node the insertions should happen.
 */
function applyProjectionRecursive(renderer, action, lView, tProjectionNode, parentRElement, beforeNode) {
    const componentLView = lView[DECLARATION_COMPONENT_VIEW];
    const componentNode = componentLView[T_HOST];
    ngDevMode &&
        assertEqual(typeof tProjectionNode.projection, 'number', 'expecting projection index');
    const nodeToProjectOrRNodes = componentNode.projection[tProjectionNode.projection];
    if (Array.isArray(nodeToProjectOrRNodes)) {
        // This should not exist, it is a bit of a hack. When we bootstrap a top level node and we
        // need to support passing projectable nodes, so we cheat and put them in the TNode
        // of the Host TView. (Yes we put instance info at the T Level). We can get away with it
        // because we know that that TView is not shared and therefore it will not be a problem.
        // This should be refactored and cleaned up.
        for (let i = 0; i < nodeToProjectOrRNodes.length; i++) {
            const rNode = nodeToProjectOrRNodes[i];
            applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
        }
    }
    else {
        let nodeToProject = nodeToProjectOrRNodes;
        const projectedComponentLView = componentLView[PARENT];
        applyNodes(renderer, action, nodeToProject, projectedComponentLView, parentRElement, beforeNode, true);
    }
}
/**
 * `applyContainer` performs an operation on the container and its views as specified by
 * `action` (insert, detach, destroy)
 *
 * Inserting a Container is complicated by the fact that the container may have Views which
 * themselves have containers or projections.
 *
 * @param renderer Renderer to use
 * @param action action to perform (insert, detach, destroy)
 * @param lContainer The LContainer which needs to be inserted, detached, destroyed.
 * @param parentRElement parent DOM element for insertion/removal.
 * @param beforeNode Before which node the insertions should happen.
 */
function applyContainer(renderer, action, lContainer, parentRElement, beforeNode) {
    ngDevMode && assertLContainer(lContainer);
    const anchor = lContainer[NATIVE]; // LContainer has its own before node.
    const native = unwrapRNode(lContainer);
    // An LContainer can be created dynamically on any node by injecting ViewContainerRef.
    // Asking for a ViewContainerRef on an element will result in a creation of a separate anchor
    // node (comment in the DOM) that will be different from the LContainer's host node. In this
    // particular case we need to execute action on 2 nodes:
    // - container's host node (this is done in the executeActionOnElementOrContainer)
    // - container's host node (this is done here)
    if (anchor !== native) {
        // This is very strange to me (Misko). I would expect that the native is same as anchor. I
        // don't see a reason why they should be different, but they are.
        //
        // If they are we need to process the second anchor as well.
        applyToElementOrContainer(action, renderer, parentRElement, anchor, beforeNode);
    }
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
        const lView = lContainer[i];
        applyView(lView[TVIEW], lView, renderer, action, parentRElement, anchor);
    }
}
/**
 * Writes class/style to element.
 *
 * @param renderer Renderer to use.
 * @param isClassBased `true` if it should be written to `class` (`false` to write to `style`)
 * @param rNode The Node to write to.
 * @param prop Property to write to. This would be the class/style name.
 * @param value Value to write. If `null`/`undefined`/`false` this is considered a remove (set/add
 *        otherwise).
 */
export function applyStyling(renderer, isClassBased, rNode, prop, value) {
    const isProcedural = isProceduralRenderer(renderer);
    if (isClassBased) {
        // We actually want JS true/false here because any truthy value should add the class
        if (!value) {
            ngDevMode && ngDevMode.rendererRemoveClass++;
            if (isProcedural) {
                renderer.removeClass(rNode, prop);
            }
            else {
                rNode.classList.remove(prop);
            }
        }
        else {
            ngDevMode && ngDevMode.rendererAddClass++;
            if (isProcedural) {
                renderer.addClass(rNode, prop);
            }
            else {
                ngDevMode && assertDefined(rNode.classList, 'HTMLElement expected');
                rNode.classList.add(prop);
            }
        }
    }
    else {
        let flags = prop.indexOf('-') === -1 ? undefined : RendererStyleFlags2.DashCase;
        if (value == null /** || value === undefined */) {
            ngDevMode && ngDevMode.rendererRemoveStyle++;
            if (isProcedural) {
                renderer.removeStyle(rNode, prop, flags);
            }
            else {
                rNode.style.removeProperty(prop);
            }
        }
        else {
            // A value is important if it ends with `!important`. The style
            // parser strips any semicolons at the end of the value.
            const isImportant = typeof value === 'string' ? value.endsWith('!important') : false;
            if (isImportant) {
                // !important has to be stripped from the value for it to be valid.
                value = value.slice(0, -10);
                flags |= RendererStyleFlags2.Important;
            }
            ngDevMode && ngDevMode.rendererSetStyle++;
            if (isProcedural) {
                renderer.setStyle(rNode, prop, value, flags);
            }
            else {
                ngDevMode && assertDefined(rNode.style, 'HTMLElement expected');
                rNode.style.setProperty(prop, value, isImportant ? 'important' : '');
            }
        }
    }
}
/**
 * Write `cssText` to `RElement`.
 *
 * This function does direct write without any reconciliation. Used for writing initial values, so
 * that static styling values do not pull in the style parser.
 *
 * @param renderer Renderer to use
 * @param element The element which needs to be updated.
 * @param newValue The new class list to write.
 */
export function writeDirectStyle(renderer, element, newValue) {
    ngDevMode && assertString(newValue, '\'newValue\' should be a string');
    if (isProceduralRenderer(renderer)) {
        renderer.setAttribute(element, 'style', newValue);
    }
    else {
        element.style.cssText = newValue;
    }
    ngDevMode && ngDevMode.rendererSetStyle++;
}
/**
 * Write `className` to `RElement`.
 *
 * This function does direct write without any reconciliation. Used for writing initial values, so
 * that static styling values do not pull in the style parser.
 *
 * @param renderer Renderer to use
 * @param element The element which needs to be updated.
 * @param newValue The new class list to write.
 */
export function writeDirectClass(renderer, element, newValue) {
    ngDevMode && assertString(newValue, '\'newValue\' should be a string');
    if (isProceduralRenderer(renderer)) {
        if (newValue === '') {
            // There are tests in `google3` which expect `element.getAttribute('class')` to be `null`.
            renderer.removeAttribute(element, 'class');
        }
        else {
            renderer.setAttribute(element, 'class', newValue);
        }
    }
    else {
        element.className = newValue;
    }
    ngDevMode && ngDevMode.rendererSetClassName++;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9tYW5pcHVsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL25vZGVfbWFuaXB1bGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxVQUFVLEVBQUUsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFOUMsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDN0QsT0FBTyxFQUFDLHVCQUF1QixFQUFFLHNCQUFzQixFQUFjLFdBQVcsRUFBRSxNQUFNLEVBQUUsNkJBQTZCLElBQUksT0FBTyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFbEssT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFpRiw2QkFBNkIsSUFBSSxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzSixPQUFPLEVBQUMsNkJBQTZCLElBQUksT0FBTyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDakYsT0FBTyxFQUFDLG9CQUFv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QUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNuRDtLQUNGO1NBQU07UUFDTCxPQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztLQUM5QjtJQUNELFNBQVMsSUFBSSxTQUFTLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUNoRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJy4uL21ldGFkYXRhL3ZpZXcnO1xuaW1wb3J0IHtSZW5kZXJlcjJ9IGZyb20gJy4uL3JlbmRlci9hcGknO1xuaW1wb3J0IHtSZW5kZXJlclN0eWxlRmxhZ3MyfSBmcm9tICcuLi9yZW5kZXIvYXBpX2ZsYWdzJztcbmltcG9ydCB7YWRkVG9BcnJheSwgcmVtb3ZlRnJvbUFycmF5fSBmcm9tICcuLi91dGlsL2FycmF5X3V0aWxzJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZCwgYXNzZXJ0RG9tTm9kZSwgYXNzZXJ0RXF1YWwsIGFzc2VydEZ1bmN0aW9uLCBhc3NlcnRTdHJpbmd9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7ZXNjYXBlQ29tbWVudFRleHR9IGZyb20gJy4uL3V0aWwvZG9tJztcblxuaW1wb3J0IHthc3NlcnRMQ29udGFpbmVyLCBhc3NlcnRMVmlldywgYXNzZXJ0UGFyZW50VmlldywgYXNzZXJ0UHJvamVjdGlvblNsb3RzLCBhc3NlcnRUTm9kZUZvckxWaWV3fSBmcm9tICcuL2Fzc2VydCc7XG5pbXBvcnQge2F0dGFjaFBhdGNoRGF0YX0gZnJvbSAnLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge2ljdUNvbnRhaW5lckl0ZXJhdGV9IGZyb20gJy4vaTE4bi9pMThuX3RyZWVfc2hha2luZyc7XG5pbXBvcnQge0NPTlRBSU5FUl9IRUFERVJfT0ZGU0VULCBIQVNfVFJBTlNQTEFOVEVEX1ZJRVdTLCBMQ29udGFpbmVyLCBNT1ZFRF9WSUVXUywgTkFUSVZFLCB1bnVzZWRWYWx1ZUV4cG9ydFRvUGxhY2F0ZUFqZCBhcyB1bnVzZWQxfSBmcm9tICcuL2ludGVyZmFjZXMvY29udGFpbmVyJztcbmltcG9ydCB7Q29tcG9uZW50RGVmfSBmcm9tICcuL2ludGVyZmFjZXMvZGVmaW5pdGlvbic7XG5pbXBvcnQge05vZGVJbmplY3RvckZhY3Rvcnl9IGZyb20gJy4vaW50ZXJmYWNlcy9pbmplY3Rvcic7XG5pbXBvcnQge1RFbGVtZW50Tm9kZSwgVEljdUNvbnRhaW5lck5vZGUsIFROb2RlLCBUTm9kZUZsYWdzLCBUTm9kZVR5cGUsIFRQcm9qZWN0aW9uTm9kZSwgdW51c2VkVmFsdWVFeHBvcnRUb1BsYWNhdGVBamQgYXMgdW51c2VkMn0gZnJvbSAnLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHt1bnVzZWRWYWx1ZUV4cG9ydFRvUGxhY2F0ZUFqZCBhcyB1bnVzZWQzfSBmcm9tICcuL2ludGVyZmFjZXMvcHJvamVjdGlvbic7XG5pbXBvcnQge2lzUHJvY2VkdXJhbFJlbmRlcmVyLCBQcm9jZWR1cmFsUmVuZGVyZXIzLCBSZW5kZXJlcjMsIHVudXNlZFZhbHVlRXhwb3J0VG9QbGFjYXRlQWpkIGFzIHVudXNlZDR9IGZyb20gJy4vaW50ZXJmYWNlcy9yZW5kZXJlcic7XG5pbXBvcnQge1JDb21tZW50LCBSRWxlbWVudCwgUk5vZGUsIFJUZXh0fSBmcm9tICcuL2ludGVyZmFjZXMvcmVuZGVyZXJfZG9tJztcbmltcG9ydCB7aXNMQ29udGFpbmVyLCBpc0xWaWV3fSBmcm9tICcuL2ludGVyZmFjZXMvdHlwZV9jaGVja3MnO1xuaW1wb3J0IHtDSElMRF9IRUFELCBDTEVBTlVQLCBERUNMQVJBVElPTl9DT01QT05FTlRfVklFVywgREVDTEFSQVRJT05fTENPTlRBSU5FUiwgRGVzdHJveUhvb2tEYXRhLCBGTEFHUywgSG9va0RhdGEsIEhvb2tGbiwgSE9TVCwgTFZpZXcsIExWaWV3RmxhZ3MsIE5FWFQsIFBBUkVOVCwgUVVFUklFUywgUkVOREVSRVIsIFRfSE9TVCwgVFZJRVcsIFRWaWV3LCBUVmlld1R5cGUsIHVudXNlZFZhbHVlRXhwb3J0VG9QbGFjYXRlQWpkIGFzIHVudXNlZDV9IGZyb20gJy4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0TmFtZXNwYWNlVXJpfSBmcm9tICcuL25hbWVzcGFjZXMnO1xuaW1wb3J0IHthc3NlcnRUTm9kZVR5cGV9IGZyb20gJy4vbm9kZV9hc3NlcnQnO1xuaW1wb3J0IHtwcm9maWxlciwgUHJvZmlsZXJFdmVudH0gZnJvbSAnLi9wcm9maWxlcic7XG5pbXBvcnQge2dldExWaWV3UGFyZW50fSBmcm9tICcuL3V0aWwvdmlld190cmF2ZXJzYWxfdXRpbHMnO1xuaW1wb3J0IHtnZXROYXRpdmVCeVROb2RlLCB1bndyYXBSTm9kZSwgdXBkYXRlVHJhbnNwbGFudGVkVmlld0NvdW50fSBmcm9tICcuL3V0aWwvdmlld191dGlscyc7XG5cblxuXG5jb25zdCB1bnVzZWRWYWx1ZVRvUGxhY2F0ZUFqZCA9IHVudXNlZDEgKyB1bnVzZWQyICsgdW51c2VkMyArIHVudXNlZDQgKyB1bnVzZWQ1O1xuXG5jb25zdCBlbnVtIFdhbGtUTm9kZVRyZWVBY3Rpb24ge1xuICAvKiogbm9kZSBjcmVhdGUgaW4gdGhlIG5hdGl2ZSBlbnZpcm9ubWVudC4gUnVuIG9uIGluaXRpYWwgY3JlYXRpb24uICovXG4gIENyZWF0ZSA9IDAsXG5cbiAgLyoqXG4gICAqIG5vZGUgaW5zZXJ0IGluIHRoZSBuYXRpdmUgZW52aXJvbm1lbnQuXG4gICAqIFJ1biB3aGVuIGV4aXN0aW5nIG5vZGUgaGFzIGJlZW4gZGV0YWNoZWQgYW5kIG5lZWRzIHRvIGJlIHJlLWF0dGFjaGVkLlxuICAgKi9cbiAgSW5zZXJ0ID0gMSxcblxuICAvKiogbm9kZSBkZXRhY2ggZnJvbSB0aGUgbmF0aXZlIGVudmlyb25tZW50ICovXG4gIERldGFjaCA9IDIsXG5cbiAgLyoqIG5vZGUgZGVzdHJ1Y3Rpb24gdXNpbmcgdGhlIHJlbmRlcmVyJ3MgQVBJICovXG4gIERlc3Ryb3kgPSAzLFxufVxuXG5cblxuLyoqXG4gKiBOT1RFOiBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgdGhlIHBvc3NpYmxlIGFjdGlvbnMgYXJlIGlubGluZWQgd2l0aGluIHRoZSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiBiZWluZyBwYXNzZWQgYXMgYW4gYXJndW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5VG9FbGVtZW50T3JDb250YWluZXIoXG4gICAgYWN0aW9uOiBXYWxrVE5vZGVUcmVlQWN0aW9uLCByZW5kZXJlcjogUmVuZGVyZXIzLCBwYXJlbnQ6IFJFbGVtZW50fG51bGwsXG4gICAgbE5vZGVUb0hhbmRsZTogUk5vZGV8TENvbnRhaW5lcnxMVmlldywgYmVmb3JlTm9kZT86IFJOb2RlfG51bGwpIHtcbiAgLy8gSWYgdGhpcyBzbG90IHdhcyBhbGxvY2F0ZWQgZm9yIGEgdGV4dCBub2RlIGR5bmFtaWNhbGx5IGNyZWF0ZWQgYnkgaTE4biwgdGhlIHRleHQgbm9kZSBpdHNlbGZcbiAgLy8gd29uJ3QgYmUgY3JlYXRlZCB1bnRpbCBpMThuQXBwbHkoKSBpbiB0aGUgdXBkYXRlIGJsb2NrLCBzbyB0aGlzIG5vZGUgc2hvdWxkIGJlIHNraXBwZWQuXG4gIC8vIEZvciBtb3JlIGluZm8sIHNlZSBcIklDVSBleHByZXNzaW9ucyBzaG91bGQgd29yayBpbnNpZGUgYW4gbmdUZW1wbGF0ZU91dGxldCBpbnNpZGUgYW4gbmdGb3JcIlxuICAvLyBpbiBgaTE4bl9zcGVjLnRzYC5cbiAgaWYgKGxOb2RlVG9IYW5kbGUgIT0gbnVsbCkge1xuICAgIGxldCBsQ29udGFpbmVyOiBMQ29udGFpbmVyfHVuZGVmaW5lZDtcbiAgICBsZXQgaXNDb21wb25lbnQgPSBmYWxzZTtcbiAgICAvLyBXZSBhcmUgZXhwZWN0aW5nIGFuIFJOb2RlLCBidXQgaW4gdGhlIGNhc2Ugb2YgYSBjb21wb25lbnQgb3IgTENvbnRhaW5lciB0aGUgYFJOb2RlYCBpc1xuICAgIC8vIHdyYXBwZWQgaW4gYW4gYXJyYXkgd2hpY2ggbmVlZHMgdG8gYmUgdW53cmFwcGVkLiBXZSBuZWVkIHRvIGtub3cgaWYgaXQgaXMgYSBjb21wb25lbnQgYW5kIGlmXG4gICAgLy8gaXQgaGFzIExDb250YWluZXIgc28gdGhhdCB3ZSBjYW4gcHJvY2VzcyBhbGwgb2YgdGhvc2UgY2FzZXMgYXBwcm9wcmlhdGVseS5cbiAgICBpZiAoaXNMQ29udGFpbmVyKGxOb2RlVG9IYW5kbGUpKSB7XG4gICAgICBsQ29udGFpbmVyID0gbE5vZGVUb0hhbmRsZTtcbiAgICB9IGVsc2UgaWYgKGlzTFZpZXcobE5vZGVUb0hhbmRsZSkpIHtcbiAgICAgIGlzQ29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGxOb2RlVG9IYW5kbGVbSE9TVF0sICdIT1NUIG11c3QgYmUgZGVmaW5lZCBmb3IgYSBjb21wb25lbnQgTFZpZXcnKTtcbiAgICAgIGxOb2RlVG9IYW5kbGUgPSBsTm9kZVRvSGFuZGxlW0hPU1RdITtcbiAgICB9XG4gICAgY29uc3Qgck5vZGU6IFJOb2RlID0gdW53cmFwUk5vZGUobE5vZGVUb0hhbmRsZSk7XG4gICAgbmdEZXZNb2RlICYmICFpc1Byb2NlZHVyYWxSZW5kZXJlcihyZW5kZXJlcikgJiYgYXNzZXJ0RG9tTm9kZShyTm9kZSk7XG5cbiAgICBpZiAoYWN0aW9uID09PSBXYWxrVE5vZGVUcmVlQWN0aW9uLkNyZWF0ZSAmJiBwYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIGlmIChiZWZvcmVOb2RlID09IG51bGwpIHtcbiAgICAgICAgbmF0aXZlQXBwZW5kQ2hpbGQocmVuZGVyZXIsIHBhcmVudCwgck5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmF0aXZlSW5zZXJ0QmVmb3JlKHJlbmRlcmVyLCBwYXJlbnQsIHJOb2RlLCBiZWZvcmVOb2RlIHx8IG51bGwsIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBXYWxrVE5vZGVUcmVlQWN0aW9uLkluc2VydCAmJiBwYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIG5hdGl2ZUluc2VydEJlZm9yZShyZW5kZXJlciwgcGFyZW50LCByTm9kZSwgYmVmb3JlTm9kZSB8fCBudWxsLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gV2Fsa1ROb2RlVHJlZUFjdGlvbi5EZXRhY2gpIHtcbiAgICAgIG5hdGl2ZVJlbW92ZU5vZGUocmVuZGVyZXIsIHJOb2RlLCBpc0NvbXBvbmVudCk7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT09IFdhbGtUTm9kZVRyZWVBY3Rpb24uRGVzdHJveSkge1xuICAgICAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckRlc3Ryb3lOb2RlKys7XG4gICAgICAocmVuZGVyZXIgYXMgUHJvY2VkdXJhbFJlbmRlcmVyMykuZGVzdHJveU5vZGUhKHJOb2RlKTtcbiAgICB9XG4gICAgaWYgKGxDb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgYXBwbHlDb250YWluZXIocmVuZGVyZXIsIGFjdGlvbiwgbENvbnRhaW5lciwgcGFyZW50LCBiZWZvcmVOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRleHROb2RlKHJlbmRlcmVyOiBSZW5kZXJlcjMsIHZhbHVlOiBzdHJpbmcpOiBSVGV4dCB7XG4gIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJDcmVhdGVUZXh0Tm9kZSsrO1xuICBuZ0Rldk1vZGUgJiYgbmdEZXZNb2RlLnJlbmRlcmVyU2V0VGV4dCsrO1xuICByZXR1cm4gaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXIpID8gcmVuZGVyZXIuY3JlYXRlVGV4dCh2YWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuY3JlYXRlVGV4dE5vZGUodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVGV4dE5vZGUocmVuZGVyZXI6IFJlbmRlcmVyMywgck5vZGU6IFJUZXh0LCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJTZXRUZXh0Kys7XG4gIGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSA/IHJlbmRlcmVyLnNldFZhbHVlKHJOb2RlLCB2YWx1ZSkgOiByTm9kZS50ZXh0Q29udGVudCA9IHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tbWVudE5vZGUocmVuZGVyZXI6IFJlbmRlcmVyMywgdmFsdWU6IHN0cmluZyk6IFJDb21tZW50IHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckNyZWF0ZUNvbW1lbnQrKztcbiAgLy8gaXNQcm9jZWR1cmFsUmVuZGVyZXIgY2hlY2sgaXMgbm90IG5lZWRlZCBiZWNhdXNlIGJvdGggYFJlbmRlcmVyMmAgYW5kIGBSZW5kZXJlcjNgIGhhdmUgdGhlIHNhbWVcbiAgLy8gbWV0aG9kIG5hbWUuXG4gIHJldHVybiByZW5kZXJlci5jcmVhdGVDb21tZW50KGVzY2FwZUNvbW1lbnRUZXh0KHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5hdGl2ZSBlbGVtZW50IGZyb20gYSB0YWcgbmFtZSwgdXNpbmcgYSByZW5kZXJlci5cbiAqIEBwYXJhbSByZW5kZXJlciBBIHJlbmRlcmVyIHRvIHVzZVxuICogQHBhcmFtIG5hbWUgdGhlIHRhZyBuYW1lXG4gKiBAcGFyYW0gbmFtZXNwYWNlIE9wdGlvbmFsIG5hbWVzcGFjZSBmb3IgZWxlbWVudC5cbiAqIEByZXR1cm5zIHRoZSBlbGVtZW50IGNyZWF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnROb2RlKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIG5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmd8bnVsbCk6IFJFbGVtZW50IHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckNyZWF0ZUVsZW1lbnQrKztcbiAgaWYgKGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSkge1xuICAgIHJldHVybiByZW5kZXJlci5jcmVhdGVFbGVtZW50KG5hbWUsIG5hbWVzcGFjZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbmFtZXNwYWNlVXJpID0gbmFtZXNwYWNlICE9PSBudWxsID8gZ2V0TmFtZXNwYWNlVXJpKG5hbWVzcGFjZSkgOiBudWxsO1xuICAgIHJldHVybiBuYW1lc3BhY2VVcmkgPT09IG51bGwgPyByZW5kZXJlci5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVyaSwgbmFtZSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIERPTSBlbGVtZW50cyBhc3NvY2lhdGVkIHdpdGggYSB2aWV3LlxuICpcbiAqIEJlY2F1c2Ugc29tZSByb290IG5vZGVzIG9mIHRoZSB2aWV3IG1heSBiZSBjb250YWluZXJzLCB3ZSBzb21ldGltZXMgbmVlZFxuICogdG8gcHJvcGFnYXRlIGRlZXBseSBpbnRvIHRoZSBuZXN0ZWQgY29udGFpbmVycyB0byByZW1vdmUgYWxsIGVsZW1lbnRzIGluIHRoZVxuICogdmlld3MgYmVuZWF0aCBpdC5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgVGhlIGBUVmlldycgb2YgdGhlIGBMVmlld2AgZnJvbSB3aGljaCBlbGVtZW50cyBzaG91bGQgYmUgYWRkZWQgb3IgcmVtb3ZlZFxuICogQHBhcmFtIGxWaWV3IFRoZSB2aWV3IGZyb20gd2hpY2ggZWxlbWVudHMgc2hvdWxkIGJlIGFkZGVkIG9yIHJlbW92ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVZpZXdGcm9tQ29udGFpbmVyKHRWaWV3OiBUVmlldywgbFZpZXc6IExWaWV3KTogdm9pZCB7XG4gIGNvbnN0IHJlbmRlcmVyID0gbFZpZXdbUkVOREVSRVJdO1xuICBhcHBseVZpZXcodFZpZXcsIGxWaWV3LCByZW5kZXJlciwgV2Fsa1ROb2RlVHJlZUFjdGlvbi5EZXRhY2gsIG51bGwsIG51bGwpO1xuICBsVmlld1tIT1NUXSA9IG51bGw7XG4gIGxWaWV3W1RfSE9TVF0gPSBudWxsO1xufVxuXG4vKipcbiAqIEFkZHMgYWxsIERPTSBlbGVtZW50cyBhc3NvY2lhdGVkIHdpdGggYSB2aWV3LlxuICpcbiAqIEJlY2F1c2Ugc29tZSByb290IG5vZGVzIG9mIHRoZSB2aWV3IG1heSBiZSBjb250YWluZXJzLCB3ZSBzb21ldGltZXMgbmVlZFxuICogdG8gcHJvcGFnYXRlIGRlZXBseSBpbnRvIHRoZSBuZXN0ZWQgY29udGFpbmVycyB0byBhZGQgYWxsIGVsZW1lbnRzIGluIHRoZVxuICogdmlld3MgYmVuZWF0aCBpdC5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgVGhlIGBUVmlldycgb2YgdGhlIGBMVmlld2AgZnJvbSB3aGljaCBlbGVtZW50cyBzaG91bGQgYmUgYWRkZWQgb3IgcmVtb3ZlZFxuICogQHBhcmFtIHBhcmVudFROb2RlIFRoZSBgVE5vZGVgIHdoZXJlIHRoZSBgTFZpZXdgIHNob3VsZCBiZSBhdHRhY2hlZCB0by5cbiAqIEBwYXJhbSByZW5kZXJlciBDdXJyZW50IHJlbmRlcmVyIHRvIHVzZSBmb3IgRE9NIG1hbmlwdWxhdGlvbnMuXG4gKiBAcGFyYW0gbFZpZXcgVGhlIHZpZXcgZnJvbSB3aGljaCBlbGVtZW50cyBzaG91bGQgYmUgYWRkZWQgb3IgcmVtb3ZlZFxuICogQHBhcmFtIHBhcmVudE5hdGl2ZU5vZGUgVGhlIHBhcmVudCBgUkVsZW1lbnRgIHdoZXJlIGl0IHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvLlxuICogQHBhcmFtIGJlZm9yZU5vZGUgVGhlIG5vZGUgYmVmb3JlIHdoaWNoIGVsZW1lbnRzIHNob3VsZCBiZSBhZGRlZCwgaWYgaW5zZXJ0IG1vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFZpZXdUb0NvbnRhaW5lcihcbiAgICB0VmlldzogVFZpZXcsIHBhcmVudFROb2RlOiBUTm9kZSwgcmVuZGVyZXI6IFJlbmRlcmVyMywgbFZpZXc6IExWaWV3LCBwYXJlbnROYXRpdmVOb2RlOiBSRWxlbWVudCxcbiAgICBiZWZvcmVOb2RlOiBSTm9kZXxudWxsKTogdm9pZCB7XG4gIGxWaWV3W0hPU1RdID0gcGFyZW50TmF0aXZlTm9kZTtcbiAgbFZpZXdbVF9IT1NUXSA9IHBhcmVudFROb2RlO1xuICBhcHBseVZpZXcodFZpZXcsIGxWaWV3LCByZW5kZXJlciwgV2Fsa1ROb2RlVHJlZUFjdGlvbi5JbnNlcnQsIHBhcmVudE5hdGl2ZU5vZGUsIGJlZm9yZU5vZGUpO1xufVxuXG5cbi8qKlxuICogRGV0YWNoIGEgYExWaWV3YCBmcm9tIHRoZSBET00gYnkgZGV0YWNoaW5nIGl0cyBub2Rlcy5cbiAqXG4gKiBAcGFyYW0gdFZpZXcgVGhlIGBUVmlldycgb2YgdGhlIGBMVmlld2AgdG8gYmUgZGV0YWNoZWRcbiAqIEBwYXJhbSBsVmlldyB0aGUgYExWaWV3YCB0byBiZSBkZXRhY2hlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckRldGFjaFZpZXcodFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcpIHtcbiAgYXBwbHlWaWV3KHRWaWV3LCBsVmlldywgbFZpZXdbUkVOREVSRVJdLCBXYWxrVE5vZGVUcmVlQWN0aW9uLkRldGFjaCwgbnVsbCwgbnVsbCk7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIGRvd24gYW5kIHVwIHRoZSB0cmVlIG9mIHZpZXdzIGFuZCBjb250YWluZXJzIHRvIHJlbW92ZSBsaXN0ZW5lcnMgYW5kXG4gKiBjYWxsIG9uRGVzdHJveSBjYWxsYmFja3MuXG4gKlxuICogTm90ZXM6XG4gKiAgLSBCZWNhdXNlIGl0J3MgdXNlZCBmb3Igb25EZXN0cm95IGNhbGxzLCBpdCBuZWVkcyB0byBiZSBib3R0b20tdXAuXG4gKiAgLSBNdXN0IHByb2Nlc3MgY29udGFpbmVycyBpbnN0ZWFkIG9mIHRoZWlyIHZpZXdzIHRvIGF2b2lkIHNwbGljaW5nXG4gKiAgd2hlbiB2aWV3cyBhcmUgZGVzdHJveWVkIGFuZCByZS1hZGRlZC5cbiAqICAtIFVzaW5nIGEgd2hpbGUgbG9vcCBiZWNhdXNlIGl0J3MgZmFzdGVyIHRoYW4gcmVjdXJzaW9uXG4gKiAgLSBEZXN0cm95IG9ubHkgY2FsbGVkIG9uIG1vdmVtZW50IHRvIHNpYmxpbmcgb3IgbW92ZW1lbnQgdG8gcGFyZW50IChsYXRlcmFsbHkgb3IgdXApXG4gKlxuICogIEBwYXJhbSByb290VmlldyBUaGUgdmlldyB0byBkZXN0cm95XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95Vmlld1RyZWUocm9vdFZpZXc6IExWaWV3KTogdm9pZCB7XG4gIC8vIElmIHRoZSB2aWV3IGhhcyBubyBjaGlsZHJlbiwgd2UgY2FuIGNsZWFuIGl0IHVwIGFuZCByZXR1cm4gZWFybHkuXG4gIGxldCBsVmlld09yTENvbnRhaW5lciA9IHJvb3RWaWV3W0NISUxEX0hFQURdO1xuICBpZiAoIWxWaWV3T3JMQ29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGNsZWFuVXBWaWV3KHJvb3RWaWV3W1RWSUVXXSwgcm9vdFZpZXcpO1xuICB9XG5cbiAgd2hpbGUgKGxWaWV3T3JMQ29udGFpbmVyKSB7XG4gICAgbGV0IG5leHQ6IExWaWV3fExDb250YWluZXJ8bnVsbCA9IG51bGw7XG5cbiAgICBpZiAoaXNMVmlldyhsVmlld09yTENvbnRhaW5lcikpIHtcbiAgICAgIC8vIElmIExWaWV3LCB0cmF2ZXJzZSBkb3duIHRvIGNoaWxkLlxuICAgICAgbmV4dCA9IGxWaWV3T3JMQ29udGFpbmVyW0NISUxEX0hFQURdO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0TENvbnRhaW5lcihsVmlld09yTENvbnRhaW5lcik7XG4gICAgICAvLyBJZiBjb250YWluZXIsIHRyYXZlcnNlIGRvd24gdG8gaXRzIGZpcnN0IExWaWV3LlxuICAgICAgY29uc3QgZmlyc3RWaWV3OiBMVmlld3x1bmRlZmluZWQgPSBsVmlld09yTENvbnRhaW5lcltDT05UQUlORVJfSEVBREVSX09GRlNFVF07XG4gICAgICBpZiAoZmlyc3RWaWV3KSBuZXh0ID0gZmlyc3RWaWV3O1xuICAgIH1cblxuICAgIGlmICghbmV4dCkge1xuICAgICAgLy8gT25seSBjbGVhbiB1cCB2aWV3IHdoZW4gbW92aW5nIHRvIHRoZSBzaWRlIG9yIHVwLCBhcyBkZXN0cm95IGhvb2tzXG4gICAgICAvLyBzaG91bGQgYmUgY2FsbGVkIGluIG9yZGVyIGZyb20gdGhlIGJvdHRvbSB1cC5cbiAgICAgIHdoaWxlIChsVmlld09yTENvbnRhaW5lciAmJiAhbFZpZXdPckxDb250YWluZXIhW05FWFRdICYmIGxWaWV3T3JMQ29udGFpbmVyICE9PSByb290Vmlldykge1xuICAgICAgICBpZiAoaXNMVmlldyhsVmlld09yTENvbnRhaW5lcikpIHtcbiAgICAgICAgICBjbGVhblVwVmlldyhsVmlld09yTENvbnRhaW5lcltUVklFV10sIGxWaWV3T3JMQ29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBsVmlld09yTENvbnRhaW5lciA9IGxWaWV3T3JMQ29udGFpbmVyW1BBUkVOVF07XG4gICAgICB9XG4gICAgICBpZiAobFZpZXdPckxDb250YWluZXIgPT09IG51bGwpIGxWaWV3T3JMQ29udGFpbmVyID0gcm9vdFZpZXc7XG4gICAgICBpZiAoaXNMVmlldyhsVmlld09yTENvbnRhaW5lcikpIHtcbiAgICAgICAgY2xlYW5VcFZpZXcobFZpZXdPckxDb250YWluZXJbVFZJRVddLCBsVmlld09yTENvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICBuZXh0ID0gbFZpZXdPckxDb250YWluZXIgJiYgbFZpZXdPckxDb250YWluZXIhW05FWFRdO1xuICAgIH1cbiAgICBsVmlld09yTENvbnRhaW5lciA9IG5leHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnRzIGEgdmlldyBpbnRvIGEgY29udGFpbmVyLlxuICpcbiAqIFRoaXMgYWRkcyB0aGUgdmlldyB0byB0aGUgY29udGFpbmVyJ3MgYXJyYXkgb2YgYWN0aXZlIHZpZXdzIGluIHRoZSBjb3JyZWN0XG4gKiBwb3NpdGlvbi4gSXQgYWxzbyBhZGRzIHRoZSB2aWV3J3MgZWxlbWVudHMgdG8gdGhlIERPTSBpZiB0aGUgY29udGFpbmVyIGlzbid0IGFcbiAqIHJvb3Qgbm9kZSBvZiBhbm90aGVyIHZpZXcgKGluIHRoYXQgY2FzZSwgdGhlIHZpZXcncyBlbGVtZW50cyB3aWxsIGJlIGFkZGVkIHdoZW5cbiAqIHRoZSBjb250YWluZXIncyBwYXJlbnQgdmlldyBpcyBhZGRlZCBsYXRlcikuXG4gKlxuICogQHBhcmFtIHRWaWV3IFRoZSBgVFZpZXcnIG9mIHRoZSBgTFZpZXdgIHRvIGluc2VydFxuICogQHBhcmFtIGxWaWV3IFRoZSB2aWV3IHRvIGluc2VydFxuICogQHBhcmFtIGxDb250YWluZXIgVGhlIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSB2aWV3IHNob3VsZCBiZSBpbnNlcnRlZFxuICogQHBhcmFtIGluZGV4IFdoaWNoIGluZGV4IGluIHRoZSBjb250YWluZXIgdG8gaW5zZXJ0IHRoZSBjaGlsZCB2aWV3IGludG9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydFZpZXcodFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIGxDb250YWluZXI6IExDb250YWluZXIsIGluZGV4OiBudW1iZXIpIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExWaWV3KGxWaWV3KTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExDb250YWluZXIobENvbnRhaW5lcik7XG4gIGNvbnN0IGluZGV4SW5Db250YWluZXIgPSBDT05UQUlORVJfSEVBREVSX09GRlNFVCArIGluZGV4O1xuICBjb25zdCBjb250YWluZXJMZW5ndGggPSBsQ29udGFpbmVyLmxlbmd0aDtcblxuICBpZiAoaW5kZXggPiAwKSB7XG4gICAgLy8gVGhpcyBpcyBhIG5ldyB2aWV3LCB3ZSBuZWVkIHRvIGFkZCBpdCB0byB0aGUgY2hpbGRyZW4uXG4gICAgbENvbnRhaW5lcltpbmRleEluQ29udGFpbmVyIC0gMV1bTkVYVF0gPSBsVmlldztcbiAgfVxuICBpZiAoaW5kZXggPCBjb250YWluZXJMZW5ndGggLSBDT05UQUlORVJfSEVBREVSX09GRlNFVCkge1xuICAgIGxWaWV3W05FWFRdID0gbENvbnRhaW5lcltpbmRleEluQ29udGFpbmVyXTtcbiAgICBhZGRUb0FycmF5KGxDb250YWluZXIsIENPTlRBSU5FUl9IRUFERVJfT0ZGU0VUICsgaW5kZXgsIGxWaWV3KTtcbiAgfSBlbHNlIHtcbiAgICBsQ29udGFpbmVyLnB1c2gobFZpZXcpO1xuICAgIGxWaWV3W05FWFRdID0gbnVsbDtcbiAgfVxuXG4gIGxWaWV3W1BBUkVOVF0gPSBsQ29udGFpbmVyO1xuXG4gIC8vIHRyYWNrIHZpZXdzIHdoZXJlIGRlY2xhcmF0aW9uIGFuZCBpbnNlcnRpb24gcG9pbnRzIGFyZSBkaWZmZXJlbnRcbiAgY29uc3QgZGVjbGFyYXRpb25MQ29udGFpbmVyID0gbFZpZXdbREVDTEFSQVRJT05fTENPTlRBSU5FUl07XG4gIGlmIChkZWNsYXJhdGlvbkxDb250YWluZXIgIT09IG51bGwgJiYgbENvbnRhaW5lciAhPT0gZGVjbGFyYXRpb25MQ29udGFpbmVyKSB7XG4gICAgdHJhY2tNb3ZlZFZpZXcoZGVjbGFyYXRpb25MQ29udGFpbmVyLCBsVmlldyk7XG4gIH1cblxuICAvLyBub3RpZnkgcXVlcnkgdGhhdCBhIG5ldyB2aWV3IGhhcyBiZWVuIGFkZGVkXG4gIGNvbnN0IGxRdWVyaWVzID0gbFZpZXdbUVVFUklFU107XG4gIGlmIChsUXVlcmllcyAhPT0gbnVsbCkge1xuICAgIGxRdWVyaWVzLmluc2VydFZpZXcodFZpZXcpO1xuICB9XG5cbiAgLy8gU2V0cyB0aGUgYXR0YWNoZWQgZmxhZ1xuICBsVmlld1tGTEFHU10gfD0gTFZpZXdGbGFncy5BdHRhY2hlZDtcbn1cblxuLyoqXG4gKiBUcmFjayB2aWV3cyBjcmVhdGVkIGZyb20gdGhlIGRlY2xhcmF0aW9uIGNvbnRhaW5lciAoVGVtcGxhdGVSZWYpIGFuZCBpbnNlcnRlZCBpbnRvIGFcbiAqIGRpZmZlcmVudCBMQ29udGFpbmVyLlxuICovXG5mdW5jdGlvbiB0cmFja01vdmVkVmlldyhkZWNsYXJhdGlvbkNvbnRhaW5lcjogTENvbnRhaW5lciwgbFZpZXc6IExWaWV3KSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGxWaWV3LCAnTFZpZXcgcmVxdWlyZWQnKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExDb250YWluZXIoZGVjbGFyYXRpb25Db250YWluZXIpO1xuICBjb25zdCBtb3ZlZFZpZXdzID0gZGVjbGFyYXRpb25Db250YWluZXJbTU9WRURfVklFV1NdO1xuICBjb25zdCBpbnNlcnRlZExDb250YWluZXIgPSBsVmlld1tQQVJFTlRdIGFzIExDb250YWluZXI7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRMQ29udGFpbmVyKGluc2VydGVkTENvbnRhaW5lcik7XG4gIGNvbnN0IGluc2VydGVkQ29tcG9uZW50TFZpZXcgPSBpbnNlcnRlZExDb250YWluZXJbUEFSRU5UXSFbREVDTEFSQVRJT05fQ09NUE9ORU5UX1ZJRVddO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChpbnNlcnRlZENvbXBvbmVudExWaWV3LCAnTWlzc2luZyBpbnNlcnRlZENvbXBvbmVudExWaWV3Jyk7XG4gIGNvbnN0IGRlY2xhcmVkQ29tcG9uZW50TFZpZXcgPSBsVmlld1tERUNMQVJBVElPTl9DT01QT05FTlRfVklFV107XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGRlY2xhcmVkQ29tcG9uZW50TFZpZXcsICdNaXNzaW5nIGRlY2xhcmVkQ29tcG9uZW50TFZpZXcnKTtcbiAgaWYgKGRlY2xhcmVkQ29tcG9uZW50TFZpZXcgIT09IGluc2VydGVkQ29tcG9uZW50TFZpZXcpIHtcbiAgICAvLyBBdCB0aGlzIHBvaW50IHRoZSBkZWNsYXJhdGlvbi1jb21wb25lbnQgaXMgbm90IHNhbWUgYXMgaW5zZXJ0aW9uLWNvbXBvbmVudDsgdGhpcyBtZWFucyB0aGF0XG4gICAgLy8gdGhpcyBpcyBhIHRyYW5zcGxhbnRlZCB2aWV3LiBNYXJrIHRoZSBkZWNsYXJlZCBsVmlldyBhcyBoYXZpbmcgdHJhbnNwbGFudGVkIHZpZXdzIHNvIHRoYXRcbiAgICAvLyB0aG9zZSB2aWV3cyBjYW4gcGFydGljaXBhdGUgaW4gQ0QuXG4gICAgZGVjbGFyYXRpb25Db250YWluZXJbSEFTX1RSQU5TUExBTlRFRF9WSUVXU10gPSB0cnVlO1xuICB9XG4gIGlmIChtb3ZlZFZpZXdzID09PSBudWxsKSB7XG4gICAgZGVjbGFyYXRpb25Db250YWluZXJbTU9WRURfVklFV1NdID0gW2xWaWV3XTtcbiAgfSBlbHNlIHtcbiAgICBtb3ZlZFZpZXdzLnB1c2gobFZpZXcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRldGFjaE1vdmVkVmlldyhkZWNsYXJhdGlvbkNvbnRhaW5lcjogTENvbnRhaW5lciwgbFZpZXc6IExWaWV3KSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRMQ29udGFpbmVyKGRlY2xhcmF0aW9uQ29udGFpbmVyKTtcbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnREZWZpbmVkKFxuICAgICAgICAgIGRlY2xhcmF0aW9uQ29udGFpbmVyW01PVkVEX1ZJRVdTXSxcbiAgICAgICAgICAnQSBwcm9qZWN0ZWQgdmlldyBzaG91bGQgYmVsb25nIHRvIGEgbm9uLWVtcHR5IHByb2plY3RlZCB2aWV3cyBjb2xsZWN0aW9uJyk7XG4gIGNvbnN0IG1vdmVkVmlld3MgPSBkZWNsYXJhdGlvbkNvbnRhaW5lcltNT1ZFRF9WSUVXU10hO1xuICBjb25zdCBkZWNsYXJhdGlvblZpZXdJbmRleCA9IG1vdmVkVmlld3MuaW5kZXhPZihsVmlldyk7XG4gIGNvbnN0IGluc2VydGlvbkxDb250YWluZXIgPSBsVmlld1tQQVJFTlRdIGFzIExDb250YWluZXI7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRMQ29udGFpbmVyKGluc2VydGlvbkxDb250YWluZXIpO1xuXG4gIC8vIElmIHRoZSB2aWV3IHdhcyBtYXJrZWQgZm9yIHJlZnJlc2ggYnV0IHRoZW4gZGV0YWNoZWQgYmVmb3JlIGl0IHdhcyBjaGVja2VkICh3aGVyZSB0aGUgZmxhZ1xuICAvLyB3b3VsZCBiZSBjbGVhcmVkIGFuZCB0aGUgY291bnRlciBkZWNyZW1lbnRlZCksIHdlIG5lZWQgdG8gZGVjcmVtZW50IHRoZSB2aWV3IGNvdW50ZXIgaGVyZVxuICAvLyBpbnN0ZWFkLlxuICBpZiAobFZpZXdbRkxBR1NdICYgTFZpZXdGbGFncy5SZWZyZXNoVHJhbnNwbGFudGVkVmlldykge1xuICAgIGxWaWV3W0ZMQUdTXSAmPSB+TFZpZXdGbGFncy5SZWZyZXNoVHJhbnNwbGFudGVkVmlldztcbiAgICB1cGRhdGVUcmFuc3BsYW50ZWRWaWV3Q291bnQoaW5zZXJ0aW9uTENvbnRhaW5lciwgLTEpO1xuICB9XG5cbiAgbW92ZWRWaWV3cy5zcGxpY2UoZGVjbGFyYXRpb25WaWV3SW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIERldGFjaGVzIGEgdmlldyBmcm9tIGEgY29udGFpbmVyLlxuICpcbiAqIFRoaXMgbWV0aG9kIHJlbW92ZXMgdGhlIHZpZXcgZnJvbSB0aGUgY29udGFpbmVyJ3MgYXJyYXkgb2YgYWN0aXZlIHZpZXdzLiBJdCBhbHNvXG4gKiByZW1vdmVzIHRoZSB2aWV3J3MgZWxlbWVudHMgZnJvbSB0aGUgRE9NLlxuICpcbiAqIEBwYXJhbSBsQ29udGFpbmVyIFRoZSBjb250YWluZXIgZnJvbSB3aGljaCB0byBkZXRhY2ggYSB2aWV3XG4gKiBAcGFyYW0gcmVtb3ZlSW5kZXggVGhlIGluZGV4IG9mIHRoZSB2aWV3IHRvIGRldGFjaFxuICogQHJldHVybnMgRGV0YWNoZWQgTFZpZXcgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRhY2hWaWV3KGxDb250YWluZXI6IExDb250YWluZXIsIHJlbW92ZUluZGV4OiBudW1iZXIpOiBMVmlld3x1bmRlZmluZWQge1xuICBpZiAobENvbnRhaW5lci5sZW5ndGggPD0gQ09OVEFJTkVSX0hFQURFUl9PRkZTRVQpIHJldHVybjtcblxuICBjb25zdCBpbmRleEluQ29udGFpbmVyID0gQ09OVEFJTkVSX0hFQURFUl9PRkZTRVQgKyByZW1vdmVJbmRleDtcbiAgY29uc3Qgdmlld1RvRGV0YWNoID0gbENvbnRhaW5lcltpbmRleEluQ29udGFpbmVyXTtcblxuICBpZiAodmlld1RvRGV0YWNoKSB7XG4gICAgY29uc3QgZGVjbGFyYXRpb25MQ29udGFpbmVyID0gdmlld1RvRGV0YWNoW0RFQ0xBUkFUSU9OX0xDT05UQUlORVJdO1xuICAgIGlmIChkZWNsYXJhdGlvbkxDb250YWluZXIgIT09IG51bGwgJiYgZGVjbGFyYXRpb25MQ29udGFpbmVyICE9PSBsQ29udGFpbmVyKSB7XG4gICAgICBkZXRhY2hNb3ZlZFZpZXcoZGVjbGFyYXRpb25MQ29udGFpbmVyLCB2aWV3VG9EZXRhY2gpO1xuICAgIH1cblxuXG4gICAgaWYgKHJlbW92ZUluZGV4ID4gMCkge1xuICAgICAgbENvbnRhaW5lcltpbmRleEluQ29udGFpbmVyIC0gMV1bTkVYVF0gPSB2aWV3VG9EZXRhY2hbTkVYVF0gYXMgTFZpZXc7XG4gICAgfVxuICAgIGNvbnN0IHJlbW92ZWRMVmlldyA9IHJlbW92ZUZyb21BcnJheShsQ29udGFpbmVyLCBDT05UQUlORVJfSEVBREVSX09GRlNFVCArIHJlbW92ZUluZGV4KTtcbiAgICByZW1vdmVWaWV3RnJvbUNvbnRhaW5lcih2aWV3VG9EZXRhY2hbVFZJRVddLCB2aWV3VG9EZXRhY2gpO1xuXG4gICAgLy8gbm90aWZ5IHF1ZXJ5IHRoYXQgYSB2aWV3IGhhcyBiZWVuIHJlbW92ZWRcbiAgICBjb25zdCBsUXVlcmllcyA9IHJlbW92ZWRMVmlld1tRVUVSSUVTXTtcbiAgICBpZiAobFF1ZXJpZXMgIT09IG51bGwpIHtcbiAgICAgIGxRdWVyaWVzLmRldGFjaFZpZXcocmVtb3ZlZExWaWV3W1RWSUVXXSk7XG4gICAgfVxuXG4gICAgdmlld1RvRGV0YWNoW1BBUkVOVF0gPSBudWxsO1xuICAgIHZpZXdUb0RldGFjaFtORVhUXSA9IG51bGw7XG4gICAgLy8gVW5zZXRzIHRoZSBhdHRhY2hlZCBmbGFnXG4gICAgdmlld1RvRGV0YWNoW0ZMQUdTXSAmPSB+TFZpZXdGbGFncy5BdHRhY2hlZDtcbiAgfVxuICByZXR1cm4gdmlld1RvRGV0YWNoO1xufVxuXG4vKipcbiAqIEEgc3RhbmRhbG9uZSBmdW5jdGlvbiB3aGljaCBkZXN0cm95cyBhbiBMVmlldyxcbiAqIGNvbmR1Y3RpbmcgY2xlYW4gdXAgKGUuZy4gcmVtb3ZpbmcgbGlzdGVuZXJzLCBjYWxsaW5nIG9uRGVzdHJveXMpLlxuICpcbiAqIEBwYXJhbSB0VmlldyBUaGUgYFRWaWV3JyBvZiB0aGUgYExWaWV3YCB0byBiZSBkZXN0cm95ZWRcbiAqIEBwYXJhbSBsVmlldyBUaGUgdmlldyB0byBiZSBkZXN0cm95ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95TFZpZXcodFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcpIHtcbiAgaWYgKCEobFZpZXdbRkxBR1NdICYgTFZpZXdGbGFncy5EZXN0cm95ZWQpKSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBsVmlld1tSRU5ERVJFUl07XG4gICAgaWYgKGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSAmJiByZW5kZXJlci5kZXN0cm95Tm9kZSkge1xuICAgICAgYXBwbHlWaWV3KHRWaWV3LCBsVmlldywgcmVuZGVyZXIsIFdhbGtUTm9kZVRyZWVBY3Rpb24uRGVzdHJveSwgbnVsbCwgbnVsbCk7XG4gICAgfVxuXG4gICAgZGVzdHJveVZpZXdUcmVlKGxWaWV3KTtcbiAgfVxufVxuXG4vKipcbiAqIENhbGxzIG9uRGVzdHJveXMgaG9va3MgZm9yIGFsbCBkaXJlY3RpdmVzIGFuZCBwaXBlcyBpbiBhIGdpdmVuIHZpZXcgYW5kIHRoZW4gcmVtb3ZlcyBhbGxcbiAqIGxpc3RlbmVycy4gTGlzdGVuZXJzIGFyZSByZW1vdmVkIGFzIHRoZSBsYXN0IHN0ZXAgc28gZXZlbnRzIGRlbGl2ZXJlZCBpbiB0aGUgb25EZXN0cm95cyBob29rc1xuICogY2FuIGJlIHByb3BhZ2F0ZWQgdG8gQE91dHB1dCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHRWaWV3IGBUVmlld2AgZm9yIHRoZSBgTFZpZXdgIHRvIGNsZWFuIHVwLlxuICogQHBhcmFtIGxWaWV3IFRoZSBMVmlldyB0byBjbGVhbiB1cFxuICovXG5mdW5jdGlvbiBjbGVhblVwVmlldyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldyk6IHZvaWQge1xuICBpZiAoIShsVmlld1tGTEFHU10gJiBMVmlld0ZsYWdzLkRlc3Ryb3llZCkpIHtcbiAgICAvLyBVc3VhbGx5IHRoZSBBdHRhY2hlZCBmbGFnIGlzIHJlbW92ZWQgd2hlbiB0aGUgdmlldyBpcyBkZXRhY2hlZCBmcm9tIGl0cyBwYXJlbnQsIGhvd2V2ZXJcbiAgICAvLyBpZiBpdCdzIGEgcm9vdCB2aWV3LCB0aGUgZmxhZyB3b24ndCBiZSB1bnNldCBoZW5jZSB3aHkgd2UncmUgYWxzbyByZW1vdmluZyBvbiBkZXN0cm95LlxuICAgIGxWaWV3W0ZMQUdTXSAmPSB+TFZpZXdGbGFncy5BdHRhY2hlZDtcblxuICAgIC8vIE1hcmsgdGhlIExWaWV3IGFzIGRlc3Ryb3llZCAqYmVmb3JlKiBleGVjdXRpbmcgdGhlIG9uRGVzdHJveSBob29rcy4gQW4gb25EZXN0cm95IGhvb2tcbiAgICAvLyBydW5zIGFyYml0cmFyeSB1c2VyIGNvZGUsIHdoaWNoIGNvdWxkIGluY2x1ZGUgaXRzIG93biBgdmlld1JlZi5kZXN0cm95KClgIChvciBzaW1pbGFyKS4gSWZcbiAgICAvLyBXZSBkb24ndCBmbGFnIHRoZSB2aWV3IGFzIGRlc3Ryb3llZCBiZWZvcmUgdGhlIGhvb2tzLCB0aGlzIGNvdWxkIGxlYWQgdG8gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAvLyBUaGlzIGFsc28gYWxpZ25zIHdpdGggdGhlIFZpZXdFbmdpbmUgYmVoYXZpb3IuIEl0IGFsc28gbWVhbnMgdGhhdCB0aGUgb25EZXN0cm95IGhvb2sgaXNcbiAgICAvLyByZWFsbHkgbW9yZSBvZiBhbiBcImFmdGVyRGVzdHJveVwiIGhvb2sgaWYgeW91IHRoaW5rIGFib3V0IGl0LlxuICAgIGxWaWV3W0ZMQUdTXSB8PSBMVmlld0ZsYWdzLkRlc3Ryb3llZDtcblxuICAgIGV4ZWN1dGVPbkRlc3Ryb3lzKHRWaWV3LCBsVmlldyk7XG4gICAgcHJvY2Vzc0NsZWFudXBzKHRWaWV3LCBsVmlldyk7XG4gICAgLy8gRm9yIGNvbXBvbmVudCB2aWV3cyBvbmx5LCB0aGUgbG9jYWwgcmVuZGVyZXIgaXMgZGVzdHJveWVkIGF0IGNsZWFuIHVwIHRpbWUuXG4gICAgaWYgKGxWaWV3W1RWSUVXXS50eXBlID09PSBUVmlld1R5cGUuQ29tcG9uZW50ICYmIGlzUHJvY2VkdXJhbFJlbmRlcmVyKGxWaWV3W1JFTkRFUkVSXSkpIHtcbiAgICAgIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJEZXN0cm95Kys7XG4gICAgICAobFZpZXdbUkVOREVSRVJdIGFzIFByb2NlZHVyYWxSZW5kZXJlcjMpLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbkNvbnRhaW5lciA9IGxWaWV3W0RFQ0xBUkFUSU9OX0xDT05UQUlORVJdO1xuICAgIC8vIHdlIGFyZSBkZWFsaW5nIHdpdGggYW4gZW1iZWRkZWQgdmlldyB0aGF0IGlzIHN0aWxsIGluc2VydGVkIGludG8gYSBjb250YWluZXJcbiAgICBpZiAoZGVjbGFyYXRpb25Db250YWluZXIgIT09IG51bGwgJiYgaXNMQ29udGFpbmVyKGxWaWV3W1BBUkVOVF0pKSB7XG4gICAgICAvLyBhbmQgdGhpcyBpcyBhIHByb2plY3RlZCB2aWV3XG4gICAgICBpZiAoZGVjbGFyYXRpb25Db250YWluZXIgIT09IGxWaWV3W1BBUkVOVF0pIHtcbiAgICAgICAgZGV0YWNoTW92ZWRWaWV3KGRlY2xhcmF0aW9uQ29udGFpbmVyLCBsVmlldyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBlbWJlZGRlZCB2aWV3cyBzdGlsbCBhdHRhY2hlZCB0byBhIGNvbnRhaW5lcjogcmVtb3ZlIHF1ZXJ5IHJlc3VsdCBmcm9tIHRoaXMgdmlldy5cbiAgICAgIGNvbnN0IGxRdWVyaWVzID0gbFZpZXdbUVVFUklFU107XG4gICAgICBpZiAobFF1ZXJpZXMgIT09IG51bGwpIHtcbiAgICAgICAgbFF1ZXJpZXMuZGV0YWNoVmlldyh0Vmlldyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBSZW1vdmVzIGxpc3RlbmVycyBhbmQgdW5zdWJzY3JpYmVzIGZyb20gb3V0cHV0IHN1YnNjcmlwdGlvbnMgKi9cbmZ1bmN0aW9uIHByb2Nlc3NDbGVhbnVwcyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldyk6IHZvaWQge1xuICBjb25zdCB0Q2xlYW51cCA9IHRWaWV3LmNsZWFudXA7XG4gIGNvbnN0IGxDbGVhbnVwID0gbFZpZXdbQ0xFQU5VUF0hO1xuICAvLyBgTENsZWFudXBgIGNvbnRhaW5zIGJvdGggc2hhcmUgaW5mb3JtYXRpb24gd2l0aCBgVENsZWFudXBgIGFzIHdlbGwgYXMgaW5zdGFuY2Ugc3BlY2lmaWNcbiAgLy8gaW5mb3JtYXRpb24gYXBwZW5kZWQgYXQgdGhlIGVuZC4gV2UgbmVlZCB0byBrbm93IHdoZXJlIHRoZSBlbmQgb2YgdGhlIGBUQ2xlYW51cGAgaW5mb3JtYXRpb25cbiAgLy8gaXMsIGFuZCB3ZSB0cmFjayB0aGlzIHdpdGggYGxhc3RMQ2xlYW51cEluZGV4YC5cbiAgbGV0IGxhc3RMQ2xlYW51cEluZGV4ID0gLTE7XG4gIGlmICh0Q2xlYW51cCAhPT0gbnVsbCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdENsZWFudXAubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICBpZiAodHlwZW9mIHRDbGVhbnVwW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbmF0aXZlIERPTSBsaXN0ZW5lclxuICAgICAgICBjb25zdCBpZHhPclRhcmdldEdldHRlciA9IHRDbGVhbnVwW2kgKyAxXTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdHlwZW9mIGlkeE9yVGFyZ2V0R2V0dGVyID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgIGlkeE9yVGFyZ2V0R2V0dGVyKGxWaWV3KSA6XG4gICAgICAgICAgICB1bndyYXBSTm9kZShsVmlld1tpZHhPclRhcmdldEdldHRlcl0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxDbGVhbnVwW2xhc3RMQ2xlYW51cEluZGV4ID0gdENsZWFudXBbaSArIDJdXTtcbiAgICAgICAgY29uc3QgdXNlQ2FwdHVyZU9yU3ViSWR4ID0gdENsZWFudXBbaSArIDNdO1xuICAgICAgICBpZiAodHlwZW9mIHVzZUNhcHR1cmVPclN1YklkeCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgLy8gbmF0aXZlIERPTSBsaXN0ZW5lciByZWdpc3RlcmVkIHdpdGggUmVuZGVyZXIzXG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodENsZWFudXBbaV0sIGxpc3RlbmVyLCB1c2VDYXB0dXJlT3JTdWJJZHgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh1c2VDYXB0dXJlT3JTdWJJZHggPj0gMCkge1xuICAgICAgICAgICAgLy8gdW5yZWdpc3RlclxuICAgICAgICAgICAgbENsZWFudXBbbGFzdExDbGVhbnVwSW5kZXggPSB1c2VDYXB0dXJlT3JTdWJJZHhdKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFN1YnNjcmlwdGlvblxuICAgICAgICAgICAgbENsZWFudXBbbGFzdExDbGVhbnVwSW5kZXggPSAtdXNlQ2FwdHVyZU9yU3ViSWR4XS51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIGEgY2xlYW51cCBmdW5jdGlvbiB0aGF0IGlzIGdyb3VwZWQgd2l0aCB0aGUgaW5kZXggb2YgaXRzIGNvbnRleHRcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGxDbGVhbnVwW2xhc3RMQ2xlYW51cEluZGV4ID0gdENsZWFudXBbaSArIDFdXTtcbiAgICAgICAgdENsZWFudXBbaV0uY2FsbChjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGxDbGVhbnVwICE9PSBudWxsKSB7XG4gICAgZm9yIChsZXQgaSA9IGxhc3RMQ2xlYW51cEluZGV4ICsgMTsgaSA8IGxDbGVhbnVwLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZUNsZWFudXBGbiA9IGxDbGVhbnVwW2ldO1xuICAgICAgbmdEZXZNb2RlICYmIGFzc2VydEZ1bmN0aW9uKGluc3RhbmNlQ2xlYW51cEZuLCAnRXhwZWN0aW5nIGluc3RhbmNlIGNsZWFudXAgZnVuY3Rpb24uJyk7XG4gICAgICBpbnN0YW5jZUNsZWFudXBGbigpO1xuICAgIH1cbiAgICBsVmlld1tDTEVBTlVQXSA9IG51bGw7XG4gIH1cbn1cblxuLyoqIENhbGxzIG9uRGVzdHJveSBob29rcyBmb3IgdGhpcyB2aWV3ICovXG5mdW5jdGlvbiBleGVjdXRlT25EZXN0cm95cyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldyk6IHZvaWQge1xuICBsZXQgZGVzdHJveUhvb2tzOiBEZXN0cm95SG9va0RhdGF8bnVsbDtcblxuICBpZiAodFZpZXcgIT0gbnVsbCAmJiAoZGVzdHJveUhvb2tzID0gdFZpZXcuZGVzdHJveUhvb2tzKSAhPSBudWxsKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXN0cm95SG9va3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBsVmlld1tkZXN0cm95SG9va3NbaV0gYXMgbnVtYmVyXTtcblxuICAgICAgLy8gT25seSBjYWxsIHRoZSBkZXN0cm95IGhvb2sgaWYgdGhlIGNvbnRleHQgaGFzIGJlZW4gcmVxdWVzdGVkLlxuICAgICAgaWYgKCEoY29udGV4dCBpbnN0YW5jZW9mIE5vZGVJbmplY3RvckZhY3RvcnkpKSB7XG4gICAgICAgIGNvbnN0IHRvQ2FsbCA9IGRlc3Ryb3lIb29rc1tpICsgMV0gYXMgSG9va0ZuIHwgSG9va0RhdGE7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodG9DYWxsKSkge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9DYWxsLmxlbmd0aDsgaiArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsQ29udGV4dCA9IGNvbnRleHRbdG9DYWxsW2pdIGFzIG51bWJlcl07XG4gICAgICAgICAgICBjb25zdCBob29rID0gdG9DYWxsW2ogKyAxXSBhcyBIb29rRm47XG4gICAgICAgICAgICBwcm9maWxlcihQcm9maWxlckV2ZW50LkxpZmVjeWNsZUhvb2tTdGFydCwgY2FsbENvbnRleHQsIGhvb2spO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaG9vay5jYWxsKGNhbGxDb250ZXh0KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHByb2ZpbGVyKFByb2ZpbGVyRXZlbnQuTGlmZWN5Y2xlSG9va0VuZCwgY2FsbENvbnRleHQsIGhvb2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9maWxlcihQcm9maWxlckV2ZW50LkxpZmVjeWNsZUhvb2tTdGFydCwgY29udGV4dCwgdG9DYWxsKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdG9DYWxsLmNhbGwoY29udGV4dCk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHByb2ZpbGVyKFByb2ZpbGVyRXZlbnQuTGlmZWN5Y2xlSG9va0VuZCwgY29udGV4dCwgdG9DYWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmF0aXZlIGVsZW1lbnQgaWYgYSBub2RlIGNhbiBiZSBpbnNlcnRlZCBpbnRvIHRoZSBnaXZlbiBwYXJlbnQuXG4gKlxuICogVGhlcmUgYXJlIHR3byByZWFzb25zIHdoeSB3ZSBtYXkgbm90IGJlIGFibGUgdG8gaW5zZXJ0IGEgZWxlbWVudCBpbW1lZGlhdGVseS5cbiAqIC0gUHJvamVjdGlvbjogV2hlbiBjcmVhdGluZyBhIGNoaWxkIGNvbnRlbnQgZWxlbWVudCBvZiBhIGNvbXBvbmVudCwgd2UgaGF2ZSB0byBza2lwIHRoZVxuICogICBpbnNlcnRpb24gYmVjYXVzZSB0aGUgY29udGVudCBvZiBhIGNvbXBvbmVudCB3aWxsIGJlIHByb2plY3RlZC5cbiAqICAgYDxjb21wb25lbnQ+PGNvbnRlbnQ+ZGVsYXllZCBkdWUgdG8gcHJvamVjdGlvbjwvY29udGVudD48L2NvbXBvbmVudD5gXG4gKiAtIFBhcmVudCBjb250YWluZXIgaXMgZGlzY29ubmVjdGVkOiBUaGlzIGNhbiBoYXBwZW4gd2hlbiB3ZSBhcmUgaW5zZXJ0aW5nIGEgdmlldyBpbnRvXG4gKiAgIHBhcmVudCBjb250YWluZXIsIHdoaWNoIGl0c2VsZiBpcyBkaXNjb25uZWN0ZWQuIEZvciBleGFtcGxlIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIHBhcnRcbiAqICAgb2YgYSBWaWV3IHdoaWNoIGhhcyBub3QgYmUgaW5zZXJ0ZWQgb3IgaXMgbWFkZSBmb3IgcHJvamVjdGlvbiBidXQgaGFzIG5vdCBiZWVuIGluc2VydGVkXG4gKiAgIGludG8gZGVzdGluYXRpb24uXG4gKlxuICogQHBhcmFtIHRWaWV3OiBDdXJyZW50IGBUVmlld2AuXG4gKiBAcGFyYW0gdE5vZGU6IGBUTm9kZWAgZm9yIHdoaWNoIHdlIHdpc2ggdG8gcmV0cmlldmUgcmVuZGVyIHBhcmVudC5cbiAqIEBwYXJhbSBsVmlldzogQ3VycmVudCBgTFZpZXdgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50UkVsZW1lbnQodFZpZXc6IFRWaWV3LCB0Tm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldyk6IFJFbGVtZW50fG51bGwge1xuICByZXR1cm4gZ2V0Q2xvc2VzdFJFbGVtZW50KHRWaWV3LCB0Tm9kZS5wYXJlbnQsIGxWaWV3KTtcbn1cblxuLyoqXG4gKiBHZXQgY2xvc2VzdCBgUkVsZW1lbnRgIG9yIGBudWxsYCBpZiBpdCBjYW4ndCBiZSBmb3VuZC5cbiAqXG4gKiBJZiBgVE5vZGVgIGlzIGBUTm9kZVR5cGUuRWxlbWVudGAgPT4gcmV0dXJuIGBSRWxlbWVudGAgYXQgYExWaWV3W3ROb2RlLmluZGV4XWAgbG9jYXRpb24uXG4gKiBJZiBgVE5vZGVgIGlzIGBUTm9kZVR5cGUuRWxlbWVudENvbnRhaW5lcnxJY3VDb250YWluYCA9PiByZXR1cm4gdGhlIHBhcmVudCAocmVjdXJzaXZlbHkpLlxuICogSWYgYFROb2RlYCBpcyBgbnVsbGAgdGhlbiByZXR1cm4gaG9zdCBgUkVsZW1lbnRgOlxuICogICAtIHJldHVybiBgbnVsbGAgaWYgcHJvamVjdGlvblxuICogICAtIHJldHVybiBgbnVsbGAgaWYgcGFyZW50IGNvbnRhaW5lciBpcyBkaXNjb25uZWN0ZWQgKHdlIGhhdmUgbm8gcGFyZW50LilcbiAqXG4gKiBAcGFyYW0gdFZpZXc6IEN1cnJlbnQgYFRWaWV3YC5cbiAqIEBwYXJhbSB0Tm9kZTogYFROb2RlYCBmb3Igd2hpY2ggd2Ugd2lzaCB0byByZXRyaWV2ZSBgUkVsZW1lbnRgIChvciBgbnVsbGAgaWYgaG9zdCBlbGVtZW50IGlzXG4gKiAgICAgbmVlZGVkKS5cbiAqIEBwYXJhbSBsVmlldzogQ3VycmVudCBgTFZpZXdgLlxuICogQHJldHVybnMgYG51bGxgIGlmIHRoZSBgUkVsZW1lbnRgIGNhbid0IGJlIGRldGVybWluZWQgYXQgdGhpcyB0aW1lIChubyBwYXJlbnQgLyBwcm9qZWN0aW9uKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xvc2VzdFJFbGVtZW50KHRWaWV3OiBUVmlldywgdE5vZGU6IFROb2RlfG51bGwsIGxWaWV3OiBMVmlldyk6IFJFbGVtZW50fG51bGwge1xuICBsZXQgcGFyZW50VE5vZGU6IFROb2RlfG51bGwgPSB0Tm9kZTtcbiAgLy8gU2tpcCBvdmVyIGVsZW1lbnQgYW5kIElDVSBjb250YWluZXJzIGFzIHRob3NlIGFyZSByZXByZXNlbnRlZCBieSBhIGNvbW1lbnQgbm9kZSBhbmRcbiAgLy8gY2FuJ3QgYmUgdXNlZCBhcyBhIHJlbmRlciBwYXJlbnQuXG4gIHdoaWxlIChwYXJlbnRUTm9kZSAhPT0gbnVsbCAmJlxuICAgICAgICAgKHBhcmVudFROb2RlLnR5cGUgJiAoVE5vZGVUeXBlLkVsZW1lbnRDb250YWluZXIgfCBUTm9kZVR5cGUuSWN1KSkpIHtcbiAgICB0Tm9kZSA9IHBhcmVudFROb2RlO1xuICAgIHBhcmVudFROb2RlID0gdE5vZGUucGFyZW50O1xuICB9XG5cbiAgLy8gSWYgdGhlIHBhcmVudCB0Tm9kZSBpcyBudWxsLCB0aGVuIHdlIGFyZSBpbnNlcnRpbmcgYWNyb3NzIHZpZXdzOiBlaXRoZXIgaW50byBhbiBlbWJlZGRlZCB2aWV3XG4gIC8vIG9yIGEgY29tcG9uZW50IHZpZXcuXG4gIGlmIChwYXJlbnRUTm9kZSA9PT0gbnVsbCkge1xuICAgIC8vIFdlIGFyZSBpbnNlcnRpbmcgYSByb290IGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudCB2aWV3IGludG8gdGhlIGNvbXBvbmVudCBob3N0IGVsZW1lbnQgYW5kXG4gICAgLy8gaXQgc2hvdWxkIGFsd2F5cyBiZSBlYWdlci5cbiAgICByZXR1cm4gbFZpZXdbSE9TVF07XG4gIH0gZWxzZSB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlVHlwZShwYXJlbnRUTm9kZSwgVE5vZGVUeXBlLkFueVJOb2RlIHwgVE5vZGVUeXBlLkNvbnRhaW5lcik7XG4gICAgaWYgKHBhcmVudFROb2RlLmZsYWdzICYgVE5vZGVGbGFncy5pc0NvbXBvbmVudEhvc3QpIHtcbiAgICAgIG5nRGV2TW9kZSAmJiBhc3NlcnRUTm9kZUZvckxWaWV3KHBhcmVudFROb2RlLCBsVmlldyk7XG4gICAgICBjb25zdCBlbmNhcHN1bGF0aW9uID1cbiAgICAgICAgICAodFZpZXcuZGF0YVtwYXJlbnRUTm9kZS5kaXJlY3RpdmVTdGFydF0gYXMgQ29tcG9uZW50RGVmPHVua25vd24+KS5lbmNhcHN1bGF0aW9uO1xuICAgICAgLy8gV2UndmUgZ290IGEgcGFyZW50IHdoaWNoIGlzIGFuIGVsZW1lbnQgaW4gdGhlIGN1cnJlbnQgdmlldy4gV2UganVzdCBuZWVkIHRvIHZlcmlmeSBpZiB0aGVcbiAgICAgIC8vIHBhcmVudCBlbGVtZW50IGlzIG5vdCBhIGNvbXBvbmVudC4gQ29tcG9uZW50J3MgY29udGVudCBub2RlcyBhcmUgbm90IGluc2VydGVkIGltbWVkaWF0ZWx5XG4gICAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCBiZSBwcm9qZWN0ZWQsIGFuZCBzbyBkb2luZyBpbnNlcnQgYXQgdGhpcyBwb2ludCB3b3VsZCBiZSB3YXN0ZWZ1bC5cbiAgICAgIC8vIFNpbmNlIHRoZSBwcm9qZWN0aW9uIHdvdWxkIHRoZW4gbW92ZSBpdCB0byBpdHMgZmluYWwgZGVzdGluYXRpb24uIE5vdGUgdGhhdCB3ZSBjYW4ndFxuICAgICAgLy8gbWFrZSB0aGlzIGFzc3VtcHRpb24gd2hlbiB1c2luZyB0aGUgU2hhZG93IERPTSwgYmVjYXVzZSB0aGUgbmF0aXZlIHByb2plY3Rpb24gcGxhY2Vob2xkZXJzXG4gICAgICAvLyAoPGNvbnRlbnQ+IG9yIDxzbG90PikgaGF2ZSB0byBiZSBpbiBwbGFjZSBhcyBlbGVtZW50cyBhcmUgYmVpbmcgaW5zZXJ0ZWQuXG4gICAgICBpZiAoZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uTm9uZSB8fFxuICAgICAgICAgIGVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBnZXROYXRpdmVCeVROb2RlKHBhcmVudFROb2RlLCBsVmlldykgYXMgUkVsZW1lbnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnRzIGEgbmF0aXZlIG5vZGUgYmVmb3JlIGFub3RoZXIgbmF0aXZlIG5vZGUgZm9yIGEgZ2l2ZW4gcGFyZW50IHVzaW5nIHtAbGluayBSZW5kZXJlcjN9LlxuICogVGhpcyBpcyBhIHV0aWxpdHkgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB3aGVuIG5hdGl2ZSBub2RlcyB3ZXJlIGRldGVybWluZWQgLSBpdCBhYnN0cmFjdHMgYW5cbiAqIGFjdHVhbCByZW5kZXJlciBiZWluZyB1c2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmF0aXZlSW5zZXJ0QmVmb3JlKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIHBhcmVudDogUkVsZW1lbnQsIGNoaWxkOiBSTm9kZSwgYmVmb3JlTm9kZTogUk5vZGV8bnVsbCxcbiAgICBpc01vdmU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckluc2VydEJlZm9yZSsrO1xuICBpZiAoaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXIpKSB7XG4gICAgcmVuZGVyZXIuaW5zZXJ0QmVmb3JlKHBhcmVudCwgY2hpbGQsIGJlZm9yZU5vZGUsIGlzTW92ZSk7XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgYmVmb3JlTm9kZSwgaXNNb3ZlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBuYXRpdmVBcHBlbmRDaGlsZChyZW5kZXJlcjogUmVuZGVyZXIzLCBwYXJlbnQ6IFJFbGVtZW50LCBjaGlsZDogUk5vZGUpOiB2b2lkIHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckFwcGVuZENoaWxkKys7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKHBhcmVudCwgJ3BhcmVudCBub2RlIG11c3QgYmUgZGVmaW5lZCcpO1xuICBpZiAoaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXIpKSB7XG4gICAgcmVuZGVyZXIuYXBwZW5kQ2hpbGQocGFyZW50LCBjaGlsZCk7XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBuYXRpdmVBcHBlbmRPckluc2VydEJlZm9yZShcbiAgICByZW5kZXJlcjogUmVuZGVyZXIzLCBwYXJlbnQ6IFJFbGVtZW50LCBjaGlsZDogUk5vZGUsIGJlZm9yZU5vZGU6IFJOb2RlfG51bGwsIGlzTW92ZTogYm9vbGVhbikge1xuICBpZiAoYmVmb3JlTm9kZSAhPT0gbnVsbCkge1xuICAgIG5hdGl2ZUluc2VydEJlZm9yZShyZW5kZXJlciwgcGFyZW50LCBjaGlsZCwgYmVmb3JlTm9kZSwgaXNNb3ZlKTtcbiAgfSBlbHNlIHtcbiAgICBuYXRpdmVBcHBlbmRDaGlsZChyZW5kZXJlciwgcGFyZW50LCBjaGlsZCk7XG4gIH1cbn1cblxuLyoqIFJlbW92ZXMgYSBub2RlIGZyb20gdGhlIERPTSBnaXZlbiBpdHMgbmF0aXZlIHBhcmVudC4gKi9cbmZ1bmN0aW9uIG5hdGl2ZVJlbW92ZUNoaWxkKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIHBhcmVudDogUkVsZW1lbnQsIGNoaWxkOiBSTm9kZSwgaXNIb3N0RWxlbWVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgaWYgKGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSkge1xuICAgIHJlbmRlcmVyLnJlbW92ZUNoaWxkKHBhcmVudCwgY2hpbGQsIGlzSG9zdEVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmF0aXZlIHBhcmVudCBvZiBhIGdpdmVuIG5hdGl2ZSBub2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmF0aXZlUGFyZW50Tm9kZShyZW5kZXJlcjogUmVuZGVyZXIzLCBub2RlOiBSTm9kZSk6IFJFbGVtZW50fG51bGwge1xuICByZXR1cm4gKGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSA/IHJlbmRlcmVyLnBhcmVudE5vZGUobm9kZSkgOiBub2RlLnBhcmVudE5vZGUpIGFzIFJFbGVtZW50O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBuYXRpdmUgc2libGluZyBvZiBhIGdpdmVuIG5hdGl2ZSBub2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmF0aXZlTmV4dFNpYmxpbmcocmVuZGVyZXI6IFJlbmRlcmVyMywgbm9kZTogUk5vZGUpOiBSTm9kZXxudWxsIHtcbiAgcmV0dXJuIGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSA/IHJlbmRlcmVyLm5leHRTaWJsaW5nKG5vZGUpIDogbm9kZS5uZXh0U2libGluZztcbn1cblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBpbiBmcm9udCBvZiB3aGljaCBgY3VycmVudFROb2RlYCBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gKlxuICogVGhpcyBtZXRob2QgZGV0ZXJtaW5lcyB0aGUgYFJOb2RlYCBpbiBmcm9udCBvZiB3aGljaCB3ZSBzaG91bGQgaW5zZXJ0IHRoZSBgY3VycmVudFJOb2RlYC4gVGhpc1xuICogdGFrZXMgYFROb2RlLmluc2VydEJlZm9yZUluZGV4YCBpbnRvIGFjY291bnQgaWYgaTE4biBjb2RlIGhhcyBiZWVuIGludm9rZWQuXG4gKlxuICogQHBhcmFtIHBhcmVudFROb2RlIHBhcmVudCBgVE5vZGVgXG4gKiBAcGFyYW0gY3VycmVudFROb2RlIGN1cnJlbnQgYFROb2RlYCAoVGhlIG5vZGUgd2hpY2ggd2Ugd291bGQgbGlrZSB0byBpbnNlcnQgaW50byB0aGUgRE9NKVxuICogQHBhcmFtIGxWaWV3IGN1cnJlbnQgYExWaWV3YFxuICovXG5mdW5jdGlvbiBnZXRJbnNlcnRJbkZyb250T2ZSTm9kZShwYXJlbnRUTm9kZTogVE5vZGUsIGN1cnJlbnRUTm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldyk6IFJOb2RlfFxuICAgIG51bGwge1xuICByZXR1cm4gX2dldEluc2VydEluRnJvbnRPZlJOb2RlV2l0aEkxOG4ocGFyZW50VE5vZGUsIGN1cnJlbnRUTm9kZSwgbFZpZXcpO1xufVxuXG5cbi8qKlxuICogRmluZCBhIG5vZGUgaW4gZnJvbnQgb2Ygd2hpY2ggYGN1cnJlbnRUTm9kZWAgc2hvdWxkIGJlIGluc2VydGVkLiAoRG9lcyBub3QgdGFrZSBpMThuIGludG9cbiAqIGFjY291bnQpXG4gKlxuICogVGhpcyBtZXRob2QgZGV0ZXJtaW5lcyB0aGUgYFJOb2RlYCBpbiBmcm9udCBvZiB3aGljaCB3ZSBzaG91bGQgaW5zZXJ0IHRoZSBgY3VycmVudFJOb2RlYC4gVGhpc1xuICogZG9lcyBub3QgdGFrZSBgVE5vZGUuaW5zZXJ0QmVmb3JlSW5kZXhgIGludG8gYWNjb3VudC5cbiAqXG4gKiBAcGFyYW0gcGFyZW50VE5vZGUgcGFyZW50IGBUTm9kZWBcbiAqIEBwYXJhbSBjdXJyZW50VE5vZGUgY3VycmVudCBgVE5vZGVgIChUaGUgbm9kZSB3aGljaCB3ZSB3b3VsZCBsaWtlIHRvIGluc2VydCBpbnRvIHRoZSBET00pXG4gKiBAcGFyYW0gbFZpZXcgY3VycmVudCBgTFZpZXdgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnNlcnRJbkZyb250T2ZSTm9kZVdpdGhOb0kxOG4oXG4gICAgcGFyZW50VE5vZGU6IFROb2RlLCBjdXJyZW50VE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpOiBSTm9kZXxudWxsIHtcbiAgaWYgKHBhcmVudFROb2RlLnR5cGUgJiAoVE5vZGVUeXBlLkVsZW1lbnRDb250YWluZXIgfCBUTm9kZVR5cGUuSWN1KSkge1xuICAgIHJldHVybiBnZXROYXRpdmVCeVROb2RlKHBhcmVudFROb2RlLCBsVmlldyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVHJlZSBzaGFrYWJsZSBib3VuZGFyeSBmb3IgYGdldEluc2VydEluRnJvbnRPZlJOb2RlV2l0aEkxOG5gIGZ1bmN0aW9uLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIHNldCBpZiBpMThuIGNvZGUgcnVucy5cbiAqL1xubGV0IF9nZXRJbnNlcnRJbkZyb250T2ZSTm9kZVdpdGhJMThuOiAocGFyZW50VE5vZGU6IFROb2RlLCBjdXJyZW50VE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpID0+XG4gICAgUk5vZGUgfCBudWxsID0gZ2V0SW5zZXJ0SW5Gcm9udE9mUk5vZGVXaXRoTm9JMThuO1xuXG4vKipcbiAqIFRyZWUgc2hha2FibGUgYm91bmRhcnkgZm9yIGBwcm9jZXNzSTE4bkluc2VydEJlZm9yZWAgZnVuY3Rpb24uXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgc2V0IGlmIGkxOG4gY29kZSBydW5zLlxuICovXG5sZXQgX3Byb2Nlc3NJMThuSW5zZXJ0QmVmb3JlOiAoXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMywgY2hpbGRUTm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldywgY2hpbGRSTm9kZTogUk5vZGV8Uk5vZGVbXSxcbiAgICBwYXJlbnRSRWxlbWVudDogUkVsZW1lbnR8bnVsbCkgPT4gdm9pZDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEkxOG5IYW5kbGluZyhcbiAgICBnZXRJbnNlcnRJbkZyb250T2ZSTm9kZVdpdGhJMThuOiAocGFyZW50VE5vZGU6IFROb2RlLCBjdXJyZW50VE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpID0+XG4gICAgICAgIFJOb2RlIHwgbnVsbCxcbiAgICBwcm9jZXNzSTE4bkluc2VydEJlZm9yZTogKFxuICAgICAgICByZW5kZXJlcjogUmVuZGVyZXIzLCBjaGlsZFROb2RlOiBUTm9kZSwgbFZpZXc6IExWaWV3LCBjaGlsZFJOb2RlOiBSTm9kZXxSTm9kZVtdLFxuICAgICAgICBwYXJlbnRSRWxlbWVudDogUkVsZW1lbnR8bnVsbCkgPT4gdm9pZCkge1xuICBfZ2V0SW5zZXJ0SW5Gcm9udE9mUk5vZGVXaXRoSTE4biA9IGdldEluc2VydEluRnJvbnRPZlJOb2RlV2l0aEkxOG47XG4gIF9wcm9jZXNzSTE4bkluc2VydEJlZm9yZSA9IHByb2Nlc3NJMThuSW5zZXJ0QmVmb3JlO1xufVxuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGBjaGlsZGAgbmF0aXZlIG5vZGUgKG9yIGEgY29sbGVjdGlvbiBvZiBub2RlcykgdG8gdGhlIGBwYXJlbnRgLlxuICpcbiAqIEBwYXJhbSB0VmlldyBUaGUgYFRWaWV3JyB0byBiZSBhcHBlbmRlZFxuICogQHBhcmFtIGxWaWV3IFRoZSBjdXJyZW50IExWaWV3XG4gKiBAcGFyYW0gY2hpbGRSTm9kZSBUaGUgbmF0aXZlIGNoaWxkIChvciBjaGlsZHJlbikgdGhhdCBzaG91bGQgYmUgYXBwZW5kZWRcbiAqIEBwYXJhbSBjaGlsZFROb2RlIFRoZSBUTm9kZSBvZiB0aGUgY2hpbGQgZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ2hpbGQoXG4gICAgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIGNoaWxkUk5vZGU6IFJOb2RlfFJOb2RlW10sIGNoaWxkVE5vZGU6IFROb2RlKTogdm9pZCB7XG4gIGNvbnN0IHBhcmVudFJOb2RlID0gZ2V0UGFyZW50UkVsZW1lbnQodFZpZXcsIGNoaWxkVE5vZGUsIGxWaWV3KTtcbiAgY29uc3QgcmVuZGVyZXIgPSBsVmlld1tSRU5ERVJFUl07XG4gIGNvbnN0IHBhcmVudFROb2RlOiBUTm9kZSA9IGNoaWxkVE5vZGUucGFyZW50IHx8IGxWaWV3W1RfSE9TVF0hO1xuICBjb25zdCBhbmNob3JOb2RlID0gZ2V0SW5zZXJ0SW5Gcm9udE9mUk5vZGUocGFyZW50VE5vZGUsIGNoaWxkVE5vZGUsIGxWaWV3KTtcbiAgaWYgKHBhcmVudFJOb2RlICE9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZFJOb2RlKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZFJOb2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5hdGl2ZUFwcGVuZE9ySW5zZXJ0QmVmb3JlKHJlbmRlcmVyLCBwYXJlbnRSTm9kZSwgY2hpbGRSTm9kZVtpXSwgYW5jaG9yTm9kZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuYXRpdmVBcHBlbmRPckluc2VydEJlZm9yZShyZW5kZXJlciwgcGFyZW50Uk5vZGUsIGNoaWxkUk5vZGUsIGFuY2hvck5vZGUsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2Vzc0kxOG5JbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgX3Byb2Nlc3NJMThuSW5zZXJ0QmVmb3JlKHJlbmRlcmVyLCBjaGlsZFROb2RlLCBsVmlldywgY2hpbGRSTm9kZSwgcGFyZW50Uk5vZGUpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IG5hdGl2ZSBub2RlIGZvciBhIGdpdmVuIExWaWV3LCBzdGFydGluZyBmcm9tIHRoZSBwcm92aWRlZCBUTm9kZS5cbiAqXG4gKiBOYXRpdmUgbm9kZXMgYXJlIHJldHVybmVkIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aG9zZSBhcHBlYXIgaW4gdGhlIG5hdGl2ZSB0cmVlIChET00pLlxuICovXG5mdW5jdGlvbiBnZXRGaXJzdE5hdGl2ZU5vZGUobFZpZXc6IExWaWV3LCB0Tm9kZTogVE5vZGV8bnVsbCk6IFJOb2RlfG51bGwge1xuICBpZiAodE5vZGUgIT09IG51bGwpIHtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0VE5vZGVUeXBlKFxuICAgICAgICAgICAgdE5vZGUsXG4gICAgICAgICAgICBUTm9kZVR5cGUuQW55Uk5vZGUgfCBUTm9kZVR5cGUuQW55Q29udGFpbmVyIHwgVE5vZGVUeXBlLkljdSB8IFROb2RlVHlwZS5Qcm9qZWN0aW9uKTtcblxuICAgIGNvbnN0IHROb2RlVHlwZSA9IHROb2RlLnR5cGU7XG4gICAgaWYgKHROb2RlVHlwZSAmIFROb2RlVHlwZS5BbnlSTm9kZSkge1xuICAgICAgcmV0dXJuIGdldE5hdGl2ZUJ5VE5vZGUodE5vZGUsIGxWaWV3KTtcbiAgICB9IGVsc2UgaWYgKHROb2RlVHlwZSAmIFROb2RlVHlwZS5Db250YWluZXIpIHtcbiAgICAgIHJldHVybiBnZXRCZWZvcmVOb2RlRm9yVmlldygtMSwgbFZpZXdbdE5vZGUuaW5kZXhdKTtcbiAgICB9IGVsc2UgaWYgKHROb2RlVHlwZSAmIFROb2RlVHlwZS5FbGVtZW50Q29udGFpbmVyKSB7XG4gICAgICBjb25zdCBlbEljdUNvbnRhaW5lckNoaWxkID0gdE5vZGUuY2hpbGQ7XG4gICAgICBpZiAoZWxJY3VDb250YWluZXJDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZ2V0Rmlyc3ROYXRpdmVOb2RlKGxWaWV3LCBlbEljdUNvbnRhaW5lckNoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJOb2RlT3JMQ29udGFpbmVyID0gbFZpZXdbdE5vZGUuaW5kZXhdO1xuICAgICAgICBpZiAoaXNMQ29udGFpbmVyKHJOb2RlT3JMQ29udGFpbmVyKSkge1xuICAgICAgICAgIHJldHVybiBnZXRCZWZvcmVOb2RlRm9yVmlldygtMSwgck5vZGVPckxDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB1bndyYXBSTm9kZShyTm9kZU9yTENvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHROb2RlVHlwZSAmIFROb2RlVHlwZS5JY3UpIHtcbiAgICAgIGxldCBuZXh0Uk5vZGUgPSBpY3VDb250YWluZXJJdGVyYXRlKHROb2RlIGFzIFRJY3VDb250YWluZXJOb2RlLCBsVmlldyk7XG4gICAgICBsZXQgck5vZGU6IFJOb2RlfG51bGwgPSBuZXh0Uk5vZGUoKTtcbiAgICAgIC8vIElmIHRoZSBJQ1UgY29udGFpbmVyIGhhcyBubyBub2RlcywgdGhhbiB3ZSB1c2UgdGhlIElDVSBhbmNob3IgYXMgdGhlIG5vZGUuXG4gICAgICByZXR1cm4gck5vZGUgfHwgdW53cmFwUk5vZGUobFZpZXdbdE5vZGUuaW5kZXhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJvamVjdGlvbk5vZGVzID0gZ2V0UHJvamVjdGlvbk5vZGVzKGxWaWV3LCB0Tm9kZSk7XG4gICAgICBpZiAocHJvamVjdGlvbk5vZGVzICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb2plY3Rpb25Ob2RlcykpIHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbk5vZGVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcmVudFZpZXcgPSBnZXRMVmlld1BhcmVudChsVmlld1tERUNMQVJBVElPTl9DT01QT05FTlRfVklFV10pO1xuICAgICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0UGFyZW50VmlldyhwYXJlbnRWaWV3KTtcbiAgICAgICAgcmV0dXJuIGdldEZpcnN0TmF0aXZlTm9kZShwYXJlbnRWaWV3ISwgcHJvamVjdGlvbk5vZGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXRGaXJzdE5hdGl2ZU5vZGUobFZpZXcsIHROb2RlLm5leHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdGlvbk5vZGVzKGxWaWV3OiBMVmlldywgdE5vZGU6IFROb2RlfG51bGwpOiBUTm9kZXxSTm9kZVtdfG51bGwge1xuICBpZiAodE5vZGUgIT09IG51bGwpIHtcbiAgICBjb25zdCBjb21wb25lbnRWaWV3ID0gbFZpZXdbREVDTEFSQVRJT05fQ09NUE9ORU5UX1ZJRVddO1xuICAgIGNvbnN0IGNvbXBvbmVudEhvc3QgPSBjb21wb25lbnRWaWV3W1RfSE9TVF0gYXMgVEVsZW1lbnROb2RlO1xuICAgIGNvbnN0IHNsb3RJZHggPSB0Tm9kZS5wcm9qZWN0aW9uIGFzIG51bWJlcjtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0UHJvamVjdGlvblNsb3RzKGxWaWV3KTtcbiAgICByZXR1cm4gY29tcG9uZW50SG9zdC5wcm9qZWN0aW9uIVtzbG90SWR4XTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJlZm9yZU5vZGVGb3JWaWV3KHZpZXdJbmRleEluQ29udGFpbmVyOiBudW1iZXIsIGxDb250YWluZXI6IExDb250YWluZXIpOiBSTm9kZXxcbiAgICBudWxsIHtcbiAgY29uc3QgbmV4dFZpZXdJbmRleCA9IENPTlRBSU5FUl9IRUFERVJfT0ZGU0VUICsgdmlld0luZGV4SW5Db250YWluZXIgKyAxO1xuICBpZiAobmV4dFZpZXdJbmRleCA8IGxDb250YWluZXIubGVuZ3RoKSB7XG4gICAgY29uc3QgbFZpZXcgPSBsQ29udGFpbmVyW25leHRWaWV3SW5kZXhdIGFzIExWaWV3O1xuICAgIGNvbnN0IGZpcnN0VE5vZGVPZlZpZXcgPSBsVmlld1tUVklFV10uZmlyc3RDaGlsZDtcbiAgICBpZiAoZmlyc3RUTm9kZU9mVmlldyAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGdldEZpcnN0TmF0aXZlTm9kZShsVmlldywgZmlyc3RUTm9kZU9mVmlldyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxDb250YWluZXJbTkFUSVZFXTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGEgbmF0aXZlIG5vZGUgaXRzZWxmIHVzaW5nIGEgZ2l2ZW4gcmVuZGVyZXIuIFRvIHJlbW92ZSB0aGUgbm9kZSB3ZSBhcmUgbG9va2luZyB1cCBpdHNcbiAqIHBhcmVudCBmcm9tIHRoZSBuYXRpdmUgdHJlZSBhcyBub3QgYWxsIHBsYXRmb3JtcyAvIGJyb3dzZXJzIHN1cHBvcnQgdGhlIGVxdWl2YWxlbnQgb2ZcbiAqIG5vZGUucmVtb3ZlKCkuXG4gKlxuICogQHBhcmFtIHJlbmRlcmVyIEEgcmVuZGVyZXIgdG8gYmUgdXNlZFxuICogQHBhcmFtIHJOb2RlIFRoZSBuYXRpdmUgbm9kZSB0aGF0IHNob3VsZCBiZSByZW1vdmVkXG4gKiBAcGFyYW0gaXNIb3N0RWxlbWVudCBBIGZsYWcgaW5kaWNhdGluZyBpZiBhIG5vZGUgdG8gYmUgcmVtb3ZlZCBpcyBhIGhvc3Qgb2YgYSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYXRpdmVSZW1vdmVOb2RlKHJlbmRlcmVyOiBSZW5kZXJlcjMsIHJOb2RlOiBSTm9kZSwgaXNIb3N0RWxlbWVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclJlbW92ZU5vZGUrKztcbiAgY29uc3QgbmF0aXZlUGFyZW50ID0gbmF0aXZlUGFyZW50Tm9kZShyZW5kZXJlciwgck5vZGUpO1xuICBpZiAobmF0aXZlUGFyZW50KSB7XG4gICAgbmF0aXZlUmVtb3ZlQ2hpbGQocmVuZGVyZXIsIG5hdGl2ZVBhcmVudCwgck5vZGUsIGlzSG9zdEVsZW1lbnQpO1xuICB9XG59XG5cblxuLyoqXG4gKiBQZXJmb3JtcyB0aGUgb3BlcmF0aW9uIG9mIGBhY3Rpb25gIG9uIHRoZSBub2RlLiBUeXBpY2FsbHkgdGhpcyBpbnZvbHZlcyBpbnNlcnRpbmcgb3IgcmVtb3ZpbmdcbiAqIG5vZGVzIG9uIHRoZSBMVmlldyBvciBwcm9qZWN0aW9uIGJvdW5kYXJ5LlxuICovXG5mdW5jdGlvbiBhcHBseU5vZGVzKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIGFjdGlvbjogV2Fsa1ROb2RlVHJlZUFjdGlvbiwgdE5vZGU6IFROb2RlfG51bGwsIGxWaWV3OiBMVmlldyxcbiAgICBwYXJlbnRSRWxlbWVudDogUkVsZW1lbnR8bnVsbCwgYmVmb3JlTm9kZTogUk5vZGV8bnVsbCwgaXNQcm9qZWN0aW9uOiBib29sZWFuKSB7XG4gIHdoaWxlICh0Tm9kZSAhPSBudWxsKSB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlRm9yTFZpZXcodE5vZGUsIGxWaWV3KTtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0VE5vZGVUeXBlKFxuICAgICAgICAgICAgdE5vZGUsXG4gICAgICAgICAgICBUTm9kZVR5cGUuQW55Uk5vZGUgfCBUTm9kZVR5cGUuQW55Q29udGFpbmVyIHwgVE5vZGVUeXBlLlByb2plY3Rpb24gfCBUTm9kZVR5cGUuSWN1KTtcbiAgICBjb25zdCByYXdTbG90VmFsdWUgPSBsVmlld1t0Tm9kZS5pbmRleF07XG4gICAgY29uc3QgdE5vZGVUeXBlID0gdE5vZGUudHlwZTtcbiAgICBpZiAoaXNQcm9qZWN0aW9uKSB7XG4gICAgICBpZiAoYWN0aW9uID09PSBXYWxrVE5vZGVUcmVlQWN0aW9uLkNyZWF0ZSkge1xuICAgICAgICByYXdTbG90VmFsdWUgJiYgYXR0YWNoUGF0Y2hEYXRhKHVud3JhcFJOb2RlKHJhd1Nsb3RWYWx1ZSksIGxWaWV3KTtcbiAgICAgICAgdE5vZGUuZmxhZ3MgfD0gVE5vZGVGbGFncy5pc1Byb2plY3RlZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCh0Tm9kZS5mbGFncyAmIFROb2RlRmxhZ3MuaXNEZXRhY2hlZCkgIT09IFROb2RlRmxhZ3MuaXNEZXRhY2hlZCkge1xuICAgICAgaWYgKHROb2RlVHlwZSAmIFROb2RlVHlwZS5FbGVtZW50Q29udGFpbmVyKSB7XG4gICAgICAgIGFwcGx5Tm9kZXMocmVuZGVyZXIsIGFjdGlvbiwgdE5vZGUuY2hpbGQsIGxWaWV3LCBwYXJlbnRSRWxlbWVudCwgYmVmb3JlTm9kZSwgZmFsc2UpO1xuICAgICAgICBhcHBseVRvRWxlbWVudE9yQ29udGFpbmVyKGFjdGlvbiwgcmVuZGVyZXIsIHBhcmVudFJFbGVtZW50LCByYXdTbG90VmFsdWUsIGJlZm9yZU5vZGUpO1xuICAgICAgfSBlbHNlIGlmICh0Tm9kZVR5cGUgJiBUTm9kZVR5cGUuSWN1KSB7XG4gICAgICAgIGNvbnN0IG5leHRSTm9kZSA9IGljdUNvbnRhaW5lckl0ZXJhdGUodE5vZGUgYXMgVEljdUNvbnRhaW5lck5vZGUsIGxWaWV3KTtcbiAgICAgICAgbGV0IHJOb2RlOiBSTm9kZXxudWxsO1xuICAgICAgICB3aGlsZSAock5vZGUgPSBuZXh0Uk5vZGUoKSkge1xuICAgICAgICAgIGFwcGx5VG9FbGVtZW50T3JDb250YWluZXIoYWN0aW9uLCByZW5kZXJlciwgcGFyZW50UkVsZW1lbnQsIHJOb2RlLCBiZWZvcmVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBhcHBseVRvRWxlbWVudE9yQ29udGFpbmVyKGFjdGlvbiwgcmVuZGVyZXIsIHBhcmVudFJFbGVtZW50LCByYXdTbG90VmFsdWUsIGJlZm9yZU5vZGUpO1xuICAgICAgfSBlbHNlIGlmICh0Tm9kZVR5cGUgJiBUTm9kZVR5cGUuUHJvamVjdGlvbikge1xuICAgICAgICBhcHBseVByb2plY3Rpb25SZWN1cnNpdmUoXG4gICAgICAgICAgICByZW5kZXJlciwgYWN0aW9uLCBsVmlldywgdE5vZGUgYXMgVFByb2plY3Rpb25Ob2RlLCBwYXJlbnRSRWxlbWVudCwgYmVmb3JlTm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0VE5vZGVUeXBlKHROb2RlLCBUTm9kZVR5cGUuQW55Uk5vZGUgfCBUTm9kZVR5cGUuQ29udGFpbmVyKTtcbiAgICAgICAgYXBwbHlUb0VsZW1lbnRPckNvbnRhaW5lcihhY3Rpb24sIHJlbmRlcmVyLCBwYXJlbnRSRWxlbWVudCwgcmF3U2xvdFZhbHVlLCBiZWZvcmVOb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdE5vZGUgPSBpc1Byb2plY3Rpb24gPyB0Tm9kZS5wcm9qZWN0aW9uTmV4dCA6IHROb2RlLm5leHQ7XG4gIH1cbn1cblxuXG4vKipcbiAqIGBhcHBseVZpZXdgIHBlcmZvcm1zIG9wZXJhdGlvbiBvbiB0aGUgdmlldyBhcyBzcGVjaWZpZWQgaW4gYGFjdGlvbmAgKGluc2VydCwgZGV0YWNoLCBkZXN0cm95KVxuICpcbiAqIEluc2VydGluZyBhIHZpZXcgd2l0aG91dCBwcm9qZWN0aW9uIG9yIGNvbnRhaW5lcnMgYXQgdG9wIGxldmVsIGlzIHNpbXBsZS4gSnVzdCBpdGVyYXRlIG92ZXIgdGhlXG4gKiByb290IG5vZGVzIG9mIHRoZSBWaWV3LCBhbmQgZm9yIGVhY2ggbm9kZSBwZXJmb3JtIHRoZSBgYWN0aW9uYC5cbiAqXG4gKiBUaGluZ3MgZ2V0IG1vcmUgY29tcGxpY2F0ZWQgd2l0aCBjb250YWluZXJzIGFuZCBwcm9qZWN0aW9ucy4gVGhhdCBpcyBiZWNhdXNlIGNvbWluZyBhY3Jvc3M6XG4gKiAtIENvbnRhaW5lcjogaW1wbGllcyB0aGF0IHdlIGhhdmUgdG8gaW5zZXJ0L3JlbW92ZS9kZXN0cm95IHRoZSB2aWV3cyBvZiB0aGF0IGNvbnRhaW5lciBhcyB3ZWxsXG4gKiAgICAgICAgICAgICAgd2hpY2ggaW4gdHVybiBjYW4gaGF2ZSB0aGVpciBvd24gQ29udGFpbmVycyBhdCB0aGUgVmlldyByb290cy5cbiAqIC0gUHJvamVjdGlvbjogaW1wbGllcyB0aGF0IHdlIGhhdmUgdG8gaW5zZXJ0L3JlbW92ZS9kZXN0cm95IHRoZSBub2RlcyBvZiB0aGUgcHJvamVjdGlvbi4gVGhlXG4gKiAgICAgICAgICAgICAgIGNvbXBsaWNhdGlvbiBpcyB0aGF0IHRoZSBub2RlcyB3ZSBhcmUgcHJvamVjdGluZyBjYW4gdGhlbXNlbHZlcyBoYXZlIENvbnRhaW5lcnNcbiAqICAgICAgICAgICAgICAgb3Igb3RoZXIgUHJvamVjdGlvbnMuXG4gKlxuICogQXMgeW91IGNhbiBzZWUgdGhpcyBpcyBhIHZlcnkgcmVjdXJzaXZlIHByb2JsZW0uIFllcyByZWN1cnNpb24gaXMgbm90IG1vc3QgZWZmaWNpZW50IGJ1dCB0aGVcbiAqIGNvZGUgaXMgY29tcGxpY2F0ZWQgZW5vdWdoIHRoYXQgdHJ5aW5nIHRvIGltcGxlbWVudGVkIHdpdGggcmVjdXJzaW9uIGJlY29tZXMgdW5tYWludGFpbmFibGUuXG4gKlxuICogQHBhcmFtIHRWaWV3IFRoZSBgVFZpZXcnIHdoaWNoIG5lZWRzIHRvIGJlIGluc2VydGVkLCBkZXRhY2hlZCwgZGVzdHJveWVkXG4gKiBAcGFyYW0gbFZpZXcgVGhlIExWaWV3IHdoaWNoIG5lZWRzIHRvIGJlIGluc2VydGVkLCBkZXRhY2hlZCwgZGVzdHJveWVkLlxuICogQHBhcmFtIHJlbmRlcmVyIFJlbmRlcmVyIHRvIHVzZVxuICogQHBhcmFtIGFjdGlvbiBhY3Rpb24gdG8gcGVyZm9ybSAoaW5zZXJ0LCBkZXRhY2gsIGRlc3Ryb3kpXG4gKiBAcGFyYW0gcGFyZW50UkVsZW1lbnQgcGFyZW50IERPTSBlbGVtZW50IGZvciBpbnNlcnRpb24gKFJlbW92YWwgZG9lcyBub3QgbmVlZCBpdCkuXG4gKiBAcGFyYW0gYmVmb3JlTm9kZSBCZWZvcmUgd2hpY2ggbm9kZSB0aGUgaW5zZXJ0aW9ucyBzaG91bGQgaGFwcGVuLlxuICovXG5mdW5jdGlvbiBhcHBseVZpZXcoXG4gICAgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIHJlbmRlcmVyOiBSZW5kZXJlcjMsIGFjdGlvbjogV2Fsa1ROb2RlVHJlZUFjdGlvbi5EZXN0cm95LFxuICAgIHBhcmVudFJFbGVtZW50OiBudWxsLCBiZWZvcmVOb2RlOiBudWxsKTogdm9pZDtcbmZ1bmN0aW9uIGFwcGx5VmlldyhcbiAgICB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgcmVuZGVyZXI6IFJlbmRlcmVyMywgYWN0aW9uOiBXYWxrVE5vZGVUcmVlQWN0aW9uLFxuICAgIHBhcmVudFJFbGVtZW50OiBSRWxlbWVudHxudWxsLCBiZWZvcmVOb2RlOiBSTm9kZXxudWxsKTogdm9pZDtcbmZ1bmN0aW9uIGFwcGx5VmlldyhcbiAgICB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgcmVuZGVyZXI6IFJlbmRlcmVyMywgYWN0aW9uOiBXYWxrVE5vZGVUcmVlQWN0aW9uLFxuICAgIHBhcmVudFJFbGVtZW50OiBSRWxlbWVudHxudWxsLCBiZWZvcmVOb2RlOiBSTm9kZXxudWxsKTogdm9pZCB7XG4gIGFwcGx5Tm9kZXMocmVuZGVyZXIsIGFjdGlvbiwgdFZpZXcuZmlyc3RDaGlsZCwgbFZpZXcsIHBhcmVudFJFbGVtZW50LCBiZWZvcmVOb2RlLCBmYWxzZSk7XG59XG5cbi8qKlxuICogYGFwcGx5UHJvamVjdGlvbmAgcGVyZm9ybXMgb3BlcmF0aW9uIG9uIHRoZSBwcm9qZWN0aW9uLlxuICpcbiAqIEluc2VydGluZyBhIHByb2plY3Rpb24gcmVxdWlyZXMgdXMgdG8gbG9jYXRlIHRoZSBwcm9qZWN0ZWQgbm9kZXMgZnJvbSB0aGUgcGFyZW50IGNvbXBvbmVudC4gVGhlXG4gKiBjb21wbGljYXRpb24gaXMgdGhhdCB0aG9zZSBub2RlcyB0aGVtc2VsdmVzIGNvdWxkIGJlIHJlLXByb2plY3RlZCBmcm9tIHRoZWlyIHBhcmVudCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHRWaWV3IFRoZSBgVFZpZXdgIG9mIGBMVmlld2Agd2hpY2ggbmVlZHMgdG8gYmUgaW5zZXJ0ZWQsIGRldGFjaGVkLCBkZXN0cm95ZWRcbiAqIEBwYXJhbSBsVmlldyBUaGUgYExWaWV3YCB3aGljaCBuZWVkcyB0byBiZSBpbnNlcnRlZCwgZGV0YWNoZWQsIGRlc3Ryb3llZC5cbiAqIEBwYXJhbSB0UHJvamVjdGlvbk5vZGUgbm9kZSB0byBwcm9qZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVByb2plY3Rpb24odFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIHRQcm9qZWN0aW9uTm9kZTogVFByb2plY3Rpb25Ob2RlKSB7XG4gIGNvbnN0IHJlbmRlcmVyID0gbFZpZXdbUkVOREVSRVJdO1xuICBjb25zdCBwYXJlbnRSTm9kZSA9IGdldFBhcmVudFJFbGVtZW50KHRWaWV3LCB0UHJvamVjdGlvbk5vZGUsIGxWaWV3KTtcbiAgY29uc3QgcGFyZW50VE5vZGUgPSB0UHJvamVjdGlvbk5vZGUucGFyZW50IHx8IGxWaWV3W1RfSE9TVF0hO1xuICBsZXQgYmVmb3JlTm9kZSA9IGdldEluc2VydEluRnJvbnRPZlJOb2RlKHBhcmVudFROb2RlLCB0UHJvamVjdGlvbk5vZGUsIGxWaWV3KTtcbiAgYXBwbHlQcm9qZWN0aW9uUmVjdXJzaXZlKFxuICAgICAgcmVuZGVyZXIsIFdhbGtUTm9kZVRyZWVBY3Rpb24uQ3JlYXRlLCBsVmlldywgdFByb2plY3Rpb25Ob2RlLCBwYXJlbnRSTm9kZSwgYmVmb3JlTm9kZSk7XG59XG5cbi8qKlxuICogYGFwcGx5UHJvamVjdGlvblJlY3Vyc2l2ZWAgcGVyZm9ybXMgb3BlcmF0aW9uIG9uIHRoZSBwcm9qZWN0aW9uIHNwZWNpZmllZCBieSBgYWN0aW9uYCAoaW5zZXJ0LFxuICogZGV0YWNoLCBkZXN0cm95KVxuICpcbiAqIEluc2VydGluZyBhIHByb2plY3Rpb24gcmVxdWlyZXMgdXMgdG8gbG9jYXRlIHRoZSBwcm9qZWN0ZWQgbm9kZXMgZnJvbSB0aGUgcGFyZW50IGNvbXBvbmVudC4gVGhlXG4gKiBjb21wbGljYXRpb24gaXMgdGhhdCB0aG9zZSBub2RlcyB0aGVtc2VsdmVzIGNvdWxkIGJlIHJlLXByb2plY3RlZCBmcm9tIHRoZWlyIHBhcmVudCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHJlbmRlcmVyIFJlbmRlciB0byB1c2VcbiAqIEBwYXJhbSBhY3Rpb24gYWN0aW9uIHRvIHBlcmZvcm0gKGluc2VydCwgZGV0YWNoLCBkZXN0cm95KVxuICogQHBhcmFtIGxWaWV3IFRoZSBMVmlldyB3aGljaCBuZWVkcyB0byBiZSBpbnNlcnRlZCwgZGV0YWNoZWQsIGRlc3Ryb3llZC5cbiAqIEBwYXJhbSB0UHJvamVjdGlvbk5vZGUgbm9kZSB0byBwcm9qZWN0XG4gKiBAcGFyYW0gcGFyZW50UkVsZW1lbnQgcGFyZW50IERPTSBlbGVtZW50IGZvciBpbnNlcnRpb24vcmVtb3ZhbC5cbiAqIEBwYXJhbSBiZWZvcmVOb2RlIEJlZm9yZSB3aGljaCBub2RlIHRoZSBpbnNlcnRpb25zIHNob3VsZCBoYXBwZW4uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5UHJvamVjdGlvblJlY3Vyc2l2ZShcbiAgICByZW5kZXJlcjogUmVuZGVyZXIzLCBhY3Rpb246IFdhbGtUTm9kZVRyZWVBY3Rpb24sIGxWaWV3OiBMVmlldyxcbiAgICB0UHJvamVjdGlvbk5vZGU6IFRQcm9qZWN0aW9uTm9kZSwgcGFyZW50UkVsZW1lbnQ6IFJFbGVtZW50fG51bGwsIGJlZm9yZU5vZGU6IFJOb2RlfG51bGwpIHtcbiAgY29uc3QgY29tcG9uZW50TFZpZXcgPSBsVmlld1tERUNMQVJBVElPTl9DT01QT05FTlRfVklFV107XG4gIGNvbnN0IGNvbXBvbmVudE5vZGUgPSBjb21wb25lbnRMVmlld1tUX0hPU1RdIGFzIFRFbGVtZW50Tm9kZTtcbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRFcXVhbCh0eXBlb2YgdFByb2plY3Rpb25Ob2RlLnByb2plY3Rpb24sICdudW1iZXInLCAnZXhwZWN0aW5nIHByb2plY3Rpb24gaW5kZXgnKTtcbiAgY29uc3Qgbm9kZVRvUHJvamVjdE9yUk5vZGVzID0gY29tcG9uZW50Tm9kZS5wcm9qZWN0aW9uIVt0UHJvamVjdGlvbk5vZGUucHJvamVjdGlvbl0hO1xuICBpZiAoQXJyYXkuaXNBcnJheShub2RlVG9Qcm9qZWN0T3JSTm9kZXMpKSB7XG4gICAgLy8gVGhpcyBzaG91bGQgbm90IGV4aXN0LCBpdCBpcyBhIGJpdCBvZiBhIGhhY2suIFdoZW4gd2UgYm9vdHN0cmFwIGEgdG9wIGxldmVsIG5vZGUgYW5kIHdlXG4gICAgLy8gbmVlZCB0byBzdXBwb3J0IHBhc3NpbmcgcHJvamVjdGFibGUgbm9kZXMsIHNvIHdlIGNoZWF0IGFuZCBwdXQgdGhlbSBpbiB0aGUgVE5vZGVcbiAgICAvLyBvZiB0aGUgSG9zdCBUVmlldy4gKFllcyB3ZSBwdXQgaW5zdGFuY2UgaW5mbyBhdCB0aGUgVCBMZXZlbCkuIFdlIGNhbiBnZXQgYXdheSB3aXRoIGl0XG4gICAgLy8gYmVjYXVzZSB3ZSBrbm93IHRoYXQgdGhhdCBUVmlldyBpcyBub3Qgc2hhcmVkIGFuZCB0aGVyZWZvcmUgaXQgd2lsbCBub3QgYmUgYSBwcm9ibGVtLlxuICAgIC8vIFRoaXMgc2hvdWxkIGJlIHJlZmFjdG9yZWQgYW5kIGNsZWFuZWQgdXAuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlVG9Qcm9qZWN0T3JSTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHJOb2RlID0gbm9kZVRvUHJvamVjdE9yUk5vZGVzW2ldO1xuICAgICAgYXBwbHlUb0VsZW1lbnRPckNvbnRhaW5lcihhY3Rpb24sIHJlbmRlcmVyLCBwYXJlbnRSRWxlbWVudCwgck5vZGUsIGJlZm9yZU5vZGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgbm9kZVRvUHJvamVjdDogVE5vZGV8bnVsbCA9IG5vZGVUb1Byb2plY3RPclJOb2RlcztcbiAgICBjb25zdCBwcm9qZWN0ZWRDb21wb25lbnRMVmlldyA9IGNvbXBvbmVudExWaWV3W1BBUkVOVF0gYXMgTFZpZXc7XG4gICAgYXBwbHlOb2RlcyhcbiAgICAgICAgcmVuZGVyZXIsIGFjdGlvbiwgbm9kZVRvUHJvamVjdCwgcHJvamVjdGVkQ29tcG9uZW50TFZpZXcsIHBhcmVudFJFbGVtZW50LCBiZWZvcmVOb2RlLCB0cnVlKTtcbiAgfVxufVxuXG5cbi8qKlxuICogYGFwcGx5Q29udGFpbmVyYCBwZXJmb3JtcyBhbiBvcGVyYXRpb24gb24gdGhlIGNvbnRhaW5lciBhbmQgaXRzIHZpZXdzIGFzIHNwZWNpZmllZCBieVxuICogYGFjdGlvbmAgKGluc2VydCwgZGV0YWNoLCBkZXN0cm95KVxuICpcbiAqIEluc2VydGluZyBhIENvbnRhaW5lciBpcyBjb21wbGljYXRlZCBieSB0aGUgZmFjdCB0aGF0IHRoZSBjb250YWluZXIgbWF5IGhhdmUgVmlld3Mgd2hpY2hcbiAqIHRoZW1zZWx2ZXMgaGF2ZSBjb250YWluZXJzIG9yIHByb2plY3Rpb25zLlxuICpcbiAqIEBwYXJhbSByZW5kZXJlciBSZW5kZXJlciB0byB1c2VcbiAqIEBwYXJhbSBhY3Rpb24gYWN0aW9uIHRvIHBlcmZvcm0gKGluc2VydCwgZGV0YWNoLCBkZXN0cm95KVxuICogQHBhcmFtIGxDb250YWluZXIgVGhlIExDb250YWluZXIgd2hpY2ggbmVlZHMgdG8gYmUgaW5zZXJ0ZWQsIGRldGFjaGVkLCBkZXN0cm95ZWQuXG4gKiBAcGFyYW0gcGFyZW50UkVsZW1lbnQgcGFyZW50IERPTSBlbGVtZW50IGZvciBpbnNlcnRpb24vcmVtb3ZhbC5cbiAqIEBwYXJhbSBiZWZvcmVOb2RlIEJlZm9yZSB3aGljaCBub2RlIHRoZSBpbnNlcnRpb25zIHNob3VsZCBoYXBwZW4uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5Q29udGFpbmVyKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIGFjdGlvbjogV2Fsa1ROb2RlVHJlZUFjdGlvbiwgbENvbnRhaW5lcjogTENvbnRhaW5lcixcbiAgICBwYXJlbnRSRWxlbWVudDogUkVsZW1lbnR8bnVsbCwgYmVmb3JlTm9kZTogUk5vZGV8bnVsbHx1bmRlZmluZWQpIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExDb250YWluZXIobENvbnRhaW5lcik7XG4gIGNvbnN0IGFuY2hvciA9IGxDb250YWluZXJbTkFUSVZFXTsgIC8vIExDb250YWluZXIgaGFzIGl0cyBvd24gYmVmb3JlIG5vZGUuXG4gIGNvbnN0IG5hdGl2ZSA9IHVud3JhcFJOb2RlKGxDb250YWluZXIpO1xuICAvLyBBbiBMQ29udGFpbmVyIGNhbiBiZSBjcmVhdGVkIGR5bmFtaWNhbGx5IG9uIGFueSBub2RlIGJ5IGluamVjdGluZyBWaWV3Q29udGFpbmVyUmVmLlxuICAvLyBBc2tpbmcgZm9yIGEgVmlld0NvbnRhaW5lclJlZiBvbiBhbiBlbGVtZW50IHdpbGwgcmVzdWx0IGluIGEgY3JlYXRpb24gb2YgYSBzZXBhcmF0ZSBhbmNob3JcbiAgLy8gbm9kZSAoY29tbWVudCBpbiB0aGUgRE9NKSB0aGF0IHdpbGwgYmUgZGlmZmVyZW50IGZyb20gdGhlIExDb250YWluZXIncyBob3N0IG5vZGUuIEluIHRoaXNcbiAgLy8gcGFydGljdWxhciBjYXNlIHdlIG5lZWQgdG8gZXhlY3V0ZSBhY3Rpb24gb24gMiBub2RlczpcbiAgLy8gLSBjb250YWluZXIncyBob3N0IG5vZGUgKHRoaXMgaXMgZG9uZSBpbiB0aGUgZXhlY3V0ZUFjdGlvbk9uRWxlbWVudE9yQ29udGFpbmVyKVxuICAvLyAtIGNvbnRhaW5lcidzIGhvc3Qgbm9kZSAodGhpcyBpcyBkb25lIGhlcmUpXG4gIGlmIChhbmNob3IgIT09IG5hdGl2ZSkge1xuICAgIC8vIFRoaXMgaXMgdmVyeSBzdHJhbmdlIHRvIG1lIChNaXNrbykuIEkgd291bGQgZXhwZWN0IHRoYXQgdGhlIG5hdGl2ZSBpcyBzYW1lIGFzIGFuY2hvci4gSVxuICAgIC8vIGRvbid0IHNlZSBhIHJlYXNvbiB3aHkgdGhleSBzaG91bGQgYmUgZGlmZmVyZW50LCBidXQgdGhleSBhcmUuXG4gICAgLy9cbiAgICAvLyBJZiB0aGV5IGFyZSB3ZSBuZWVkIHRvIHByb2Nlc3MgdGhlIHNlY29uZCBhbmNob3IgYXMgd2VsbC5cbiAgICBhcHBseVRvRWxlbWVudE9yQ29udGFpbmVyKGFjdGlvbiwgcmVuZGVyZXIsIHBhcmVudFJFbGVtZW50LCBhbmNob3IsIGJlZm9yZU5vZGUpO1xuICB9XG4gIGZvciAobGV0IGkgPSBDT05UQUlORVJfSEVBREVSX09GRlNFVDsgaSA8IGxDb250YWluZXIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsVmlldyA9IGxDb250YWluZXJbaV0gYXMgTFZpZXc7XG4gICAgYXBwbHlWaWV3KGxWaWV3W1RWSUVXXSwgbFZpZXcsIHJlbmRlcmVyLCBhY3Rpb24sIHBhcmVudFJFbGVtZW50LCBhbmNob3IpO1xuICB9XG59XG5cbi8qKlxuICogV3JpdGVzIGNsYXNzL3N0eWxlIHRvIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHJlbmRlcmVyIFJlbmRlcmVyIHRvIHVzZS5cbiAqIEBwYXJhbSBpc0NsYXNzQmFzZWQgYHRydWVgIGlmIGl0IHNob3VsZCBiZSB3cml0dGVuIHRvIGBjbGFzc2AgKGBmYWxzZWAgdG8gd3JpdGUgdG8gYHN0eWxlYClcbiAqIEBwYXJhbSByTm9kZSBUaGUgTm9kZSB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSBwcm9wIFByb3BlcnR5IHRvIHdyaXRlIHRvLiBUaGlzIHdvdWxkIGJlIHRoZSBjbGFzcy9zdHlsZSBuYW1lLlxuICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHdyaXRlLiBJZiBgbnVsbGAvYHVuZGVmaW5lZGAvYGZhbHNlYCB0aGlzIGlzIGNvbnNpZGVyZWQgYSByZW1vdmUgKHNldC9hZGRcbiAqICAgICAgICBvdGhlcndpc2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTdHlsaW5nKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjMsIGlzQ2xhc3NCYXNlZDogYm9vbGVhbiwgck5vZGU6IFJFbGVtZW50LCBwcm9wOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgY29uc3QgaXNQcm9jZWR1cmFsID0gaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXIpO1xuICBpZiAoaXNDbGFzc0Jhc2VkKSB7XG4gICAgLy8gV2UgYWN0dWFsbHkgd2FudCBKUyB0cnVlL2ZhbHNlIGhlcmUgYmVjYXVzZSBhbnkgdHJ1dGh5IHZhbHVlIHNob3VsZCBhZGQgdGhlIGNsYXNzXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclJlbW92ZUNsYXNzKys7XG4gICAgICBpZiAoaXNQcm9jZWR1cmFsKSB7XG4gICAgICAgIChyZW5kZXJlciBhcyBSZW5kZXJlcjIpLnJlbW92ZUNsYXNzKHJOb2RlLCBwcm9wKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChyTm9kZSBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LnJlbW92ZShwcm9wKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlckFkZENsYXNzKys7XG4gICAgICBpZiAoaXNQcm9jZWR1cmFsKSB7XG4gICAgICAgIChyZW5kZXJlciBhcyBSZW5kZXJlcjIpLmFkZENsYXNzKHJOb2RlLCBwcm9wKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKChyTm9kZSBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LCAnSFRNTEVsZW1lbnQgZXhwZWN0ZWQnKTtcbiAgICAgICAgKHJOb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuYWRkKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgZmxhZ3MgPSBwcm9wLmluZGV4T2YoJy0nKSA9PT0gLTEgPyB1bmRlZmluZWQgOiBSZW5kZXJlclN0eWxlRmxhZ3MyLkRhc2hDYXNlIGFzIG51bWJlcjtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCAvKiogfHwgdmFsdWUgPT09IHVuZGVmaW5lZCAqLykge1xuICAgICAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclJlbW92ZVN0eWxlKys7XG4gICAgICBpZiAoaXNQcm9jZWR1cmFsKSB7XG4gICAgICAgIChyZW5kZXJlciBhcyBSZW5kZXJlcjIpLnJlbW92ZVN0eWxlKHJOb2RlLCBwcm9wLCBmbGFncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAock5vZGUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3ApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBIHZhbHVlIGlzIGltcG9ydGFudCBpZiBpdCBlbmRzIHdpdGggYCFpbXBvcnRhbnRgLiBUaGUgc3R5bGVcbiAgICAgIC8vIHBhcnNlciBzdHJpcHMgYW55IHNlbWljb2xvbnMgYXQgdGhlIGVuZCBvZiB0aGUgdmFsdWUuXG4gICAgICBjb25zdCBpc0ltcG9ydGFudCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZS5lbmRzV2l0aCgnIWltcG9ydGFudCcpIDogZmFsc2U7XG5cbiAgICAgIGlmIChpc0ltcG9ydGFudCkge1xuICAgICAgICAvLyAhaW1wb3J0YW50IGhhcyB0byBiZSBzdHJpcHBlZCBmcm9tIHRoZSB2YWx1ZSBmb3IgaXQgdG8gYmUgdmFsaWQuXG4gICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgLTEwKTtcbiAgICAgICAgZmxhZ3MhIHw9IFJlbmRlcmVyU3R5bGVGbGFnczIuSW1wb3J0YW50O1xuICAgICAgfVxuXG4gICAgICBuZ0Rldk1vZGUgJiYgbmdEZXZNb2RlLnJlbmRlcmVyU2V0U3R5bGUrKztcbiAgICAgIGlmIChpc1Byb2NlZHVyYWwpIHtcbiAgICAgICAgKHJlbmRlcmVyIGFzIFJlbmRlcmVyMikuc2V0U3R5bGUock5vZGUsIHByb3AsIHZhbHVlLCBmbGFncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCgock5vZGUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLCAnSFRNTEVsZW1lbnQgZXhwZWN0ZWQnKTtcbiAgICAgICAgKHJOb2RlIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIFdyaXRlIGBjc3NUZXh0YCB0byBgUkVsZW1lbnRgLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gZG9lcyBkaXJlY3Qgd3JpdGUgd2l0aG91dCBhbnkgcmVjb25jaWxpYXRpb24uIFVzZWQgZm9yIHdyaXRpbmcgaW5pdGlhbCB2YWx1ZXMsIHNvXG4gKiB0aGF0IHN0YXRpYyBzdHlsaW5nIHZhbHVlcyBkbyBub3QgcHVsbCBpbiB0aGUgc3R5bGUgcGFyc2VyLlxuICpcbiAqIEBwYXJhbSByZW5kZXJlciBSZW5kZXJlciB0byB1c2VcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHdoaWNoIG5lZWRzIHRvIGJlIHVwZGF0ZWQuXG4gKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyBjbGFzcyBsaXN0IHRvIHdyaXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVEaXJlY3RTdHlsZShyZW5kZXJlcjogUmVuZGVyZXIzLCBlbGVtZW50OiBSRWxlbWVudCwgbmV3VmFsdWU6IHN0cmluZykge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0U3RyaW5nKG5ld1ZhbHVlLCAnXFwnbmV3VmFsdWVcXCcgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gIGlmIChpc1Byb2NlZHVyYWxSZW5kZXJlcihyZW5kZXJlcikpIHtcbiAgICByZW5kZXJlci5zZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ3N0eWxlJywgbmV3VmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zdHlsZS5jc3NUZXh0ID0gbmV3VmFsdWU7XG4gIH1cbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclNldFN0eWxlKys7XG59XG5cbi8qKlxuICogV3JpdGUgYGNsYXNzTmFtZWAgdG8gYFJFbGVtZW50YC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgZGlyZWN0IHdyaXRlIHdpdGhvdXQgYW55IHJlY29uY2lsaWF0aW9uLiBVc2VkIGZvciB3cml0aW5nIGluaXRpYWwgdmFsdWVzLCBzb1xuICogdGhhdCBzdGF0aWMgc3R5bGluZyB2YWx1ZXMgZG8gbm90IHB1bGwgaW4gdGhlIHN0eWxlIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0gcmVuZGVyZXIgUmVuZGVyZXIgdG8gdXNlXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aGljaCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgY2xhc3MgbGlzdCB0byB3cml0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlRGlyZWN0Q2xhc3MocmVuZGVyZXI6IFJlbmRlcmVyMywgZWxlbWVudDogUkVsZW1lbnQsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydFN0cmluZyhuZXdWYWx1ZSwgJ1xcJ25ld1ZhbHVlXFwnIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICBpZiAoaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXIpKSB7XG4gICAgaWYgKG5ld1ZhbHVlID09PSAnJykge1xuICAgICAgLy8gVGhlcmUgYXJlIHRlc3RzIGluIGBnb29nbGUzYCB3aGljaCBleHBlY3QgYGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpYCB0byBiZSBgbnVsbGAuXG4gICAgICByZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUoZWxlbWVudCwgJ2NsYXNzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbmRlcmVyLnNldEF0dHJpYnV0ZShlbGVtZW50LCAnY2xhc3MnLCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gbmV3VmFsdWU7XG4gIH1cbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5yZW5kZXJlclNldENsYXNzTmFtZSsrO1xufVxuIl19