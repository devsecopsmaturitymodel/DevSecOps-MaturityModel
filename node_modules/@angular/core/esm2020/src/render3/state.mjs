/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectFlags } from '../di/interface/injector';
import { assertDefined, assertEqual, assertGreaterThanOrEqual, assertLessThan, assertNotEqual, throwError } from '../util/assert';
import { assertLViewOrUndefined, assertTNodeForLView, assertTNodeForTView } from './assert';
import { CONTEXT, DECLARATION_VIEW, HEADER_OFFSET, T_HOST, TVIEW } from './interfaces/view';
import { MATH_ML_NAMESPACE, SVG_NAMESPACE } from './namespaces';
import { getTNode } from './util/view_utils';
const instructionState = {
    lFrame: createLFrame(null),
    bindingsEnabled: true,
};
/**
 * In this mode, any changes in bindings will throw an ExpressionChangedAfterChecked error.
 *
 * Necessary to support ChangeDetectorRef.checkNoChanges().
 *
 * The `checkNoChanges` function is invoked only in ngDevMode=true and verifies that no unintended
 * changes exist in the change detector or its children.
 */
let _isInCheckNoChangesMode = false;
/**
 * Returns true if the instruction state stack is empty.
 *
 * Intended to be called from tests only (tree shaken otherwise).
 */
export function specOnlyIsInstructionStateEmpty() {
    return instructionState.lFrame.parent === null;
}
export function getElementDepthCount() {
    return instructionState.lFrame.elementDepthCount;
}
export function increaseElementDepthCount() {
    instructionState.lFrame.elementDepthCount++;
}
export function decreaseElementDepthCount() {
    instructionState.lFrame.elementDepthCount--;
}
export function getBindingsEnabled() {
    return instructionState.bindingsEnabled;
}
/**
 * Enables directive matching on elements.
 *
 *  * Example:
 * ```
 * <my-comp my-directive>
 *   Should match component / directive.
 * </my-comp>
 * <div ngNonBindable>
 *   <!-- ɵɵdisableBindings() -->
 *   <my-comp my-directive>
 *     Should not match component / directive because we are in ngNonBindable.
 *   </my-comp>
 *   <!-- ɵɵenableBindings() -->
 * </div>
 * ```
 *
 * @codeGenApi
 */
export function ɵɵenableBindings() {
    instructionState.bindingsEnabled = true;
}
/**
 * Disables directive matching on element.
 *
 *  * Example:
 * ```
 * <my-comp my-directive>
 *   Should match component / directive.
 * </my-comp>
 * <div ngNonBindable>
 *   <!-- ɵɵdisableBindings() -->
 *   <my-comp my-directive>
 *     Should not match component / directive because we are in ngNonBindable.
 *   </my-comp>
 *   <!-- ɵɵenableBindings() -->
 * </div>
 * ```
 *
 * @codeGenApi
 */
export function ɵɵdisableBindings() {
    instructionState.bindingsEnabled = false;
}
/**
 * Return the current `LView`.
 */
export function getLView() {
    return instructionState.lFrame.lView;
}
/**
 * Return the current `TView`.
 */
export function getTView() {
    return instructionState.lFrame.tView;
}
/**
 * Restores `contextViewData` to the given OpaqueViewState instance.
 *
 * Used in conjunction with the getCurrentView() instruction to save a snapshot
 * of the current view and restore it when listeners are invoked. This allows
 * walking the declaration view tree in listeners to get vars from parent views.
 *
 * @param viewToRestore The OpaqueViewState instance to restore.
 * @returns Context of the restored OpaqueViewState instance.
 *
 * @codeGenApi
 */
export function ɵɵrestoreView(viewToRestore) {
    instructionState.lFrame.contextLView = viewToRestore;
    return viewToRestore[CONTEXT];
}
export function getCurrentTNode() {
    let currentTNode = getCurrentTNodePlaceholderOk();
    while (currentTNode !== null && currentTNode.type === 64 /* Placeholder */) {
        currentTNode = currentTNode.parent;
    }
    return currentTNode;
}
export function getCurrentTNodePlaceholderOk() {
    return instructionState.lFrame.currentTNode;
}
export function getCurrentParentTNode() {
    const lFrame = instructionState.lFrame;
    const currentTNode = lFrame.currentTNode;
    return lFrame.isParent ? currentTNode : currentTNode.parent;
}
export function setCurrentTNode(tNode, isParent) {
    ngDevMode && tNode && assertTNodeForTView(tNode, instructionState.lFrame.tView);
    const lFrame = instructionState.lFrame;
    lFrame.currentTNode = tNode;
    lFrame.isParent = isParent;
}
export function isCurrentTNodeParent() {
    return instructionState.lFrame.isParent;
}
export function setCurrentTNodeAsNotParent() {
    instructionState.lFrame.isParent = false;
}
export function setCurrentTNodeAsParent() {
    instructionState.lFrame.isParent = true;
}
export function getContextLView() {
    return instructionState.lFrame.contextLView;
}
export function isInCheckNoChangesMode() {
    !ngDevMode && throwError('Must never be called in production mode');
    return _isInCheckNoChangesMode;
}
export function setIsInCheckNoChangesMode(mode) {
    !ngDevMode && throwError('Must never be called in production mode');
    _isInCheckNoChangesMode = mode;
}
// top level variables should not be exported for performance reasons (PERF_NOTES.md)
export function getBindingRoot() {
    const lFrame = instructionState.lFrame;
    let index = lFrame.bindingRootIndex;
    if (index === -1) {
        index = lFrame.bindingRootIndex = lFrame.tView.bindingStartIndex;
    }
    return index;
}
export function getBindingIndex() {
    return instructionState.lFrame.bindingIndex;
}
export function setBindingIndex(value) {
    return instructionState.lFrame.bindingIndex = value;
}
export function nextBindingIndex() {
    return instructionState.lFrame.bindingIndex++;
}
export function incrementBindingIndex(count) {
    const lFrame = instructionState.lFrame;
    const index = lFrame.bindingIndex;
    lFrame.bindingIndex = lFrame.bindingIndex + count;
    return index;
}
export function isInI18nBlock() {
    return instructionState.lFrame.inI18n;
}
export function setInI18nBlock(isInI18nBlock) {
    instructionState.lFrame.inI18n = isInI18nBlock;
}
/**
 * Set a new binding root index so that host template functions can execute.
 *
 * Bindings inside the host template are 0 index. But because we don't know ahead of time
 * how many host bindings we have we can't pre-compute them. For this reason they are all
 * 0 index and we just shift the root so that they match next available location in the LView.
 *
 * @param bindingRootIndex Root index for `hostBindings`
 * @param currentDirectiveIndex `TData[currentDirectiveIndex]` will point to the current directive
 *        whose `hostBindings` are being processed.
 */
export function setBindingRootForHostBindings(bindingRootIndex, currentDirectiveIndex) {
    const lFrame = instructionState.lFrame;
    lFrame.bindingIndex = lFrame.bindingRootIndex = bindingRootIndex;
    setCurrentDirectiveIndex(currentDirectiveIndex);
}
/**
 * When host binding is executing this points to the directive index.
 * `TView.data[getCurrentDirectiveIndex()]` is `DirectiveDef`
 * `LView[getCurrentDirectiveIndex()]` is directive instance.
 */
export function getCurrentDirectiveIndex() {
    return instructionState.lFrame.currentDirectiveIndex;
}
/**
 * Sets an index of a directive whose `hostBindings` are being processed.
 *
 * @param currentDirectiveIndex `TData` index where current directive instance can be found.
 */
export function setCurrentDirectiveIndex(currentDirectiveIndex) {
    instructionState.lFrame.currentDirectiveIndex = currentDirectiveIndex;
}
/**
 * Retrieve the current `DirectiveDef` which is active when `hostBindings` instruction is being
 * executed.
 *
 * @param tData Current `TData` where the `DirectiveDef` will be looked up at.
 */
export function getCurrentDirectiveDef(tData) {
    const currentDirectiveIndex = instructionState.lFrame.currentDirectiveIndex;
    return currentDirectiveIndex === -1 ? null : tData[currentDirectiveIndex];
}
export function getCurrentQueryIndex() {
    return instructionState.lFrame.currentQueryIndex;
}
export function setCurrentQueryIndex(value) {
    instructionState.lFrame.currentQueryIndex = value;
}
/**
 * Returns a `TNode` of the location where the current `LView` is declared at.
 *
 * @param lView an `LView` that we want to find parent `TNode` for.
 */
function getDeclarationTNode(lView) {
    const tView = lView[TVIEW];
    // Return the declaration parent for embedded views
    if (tView.type === 2 /* Embedded */) {
        ngDevMode && assertDefined(tView.declTNode, 'Embedded TNodes should have declaration parents.');
        return tView.declTNode;
    }
    // Components don't have `TView.declTNode` because each instance of component could be
    // inserted in different location, hence `TView.declTNode` is meaningless.
    // Falling back to `T_HOST` in case we cross component boundary.
    if (tView.type === 1 /* Component */) {
        return lView[T_HOST];
    }
    // Remaining TNode type is `TViewType.Root` which doesn't have a parent TNode.
    return null;
}
/**
 * This is a light weight version of the `enterView` which is needed by the DI system.
 *
 * @param lView `LView` location of the DI context.
 * @param tNode `TNode` for DI context
 * @param flags DI context flags. if `SkipSelf` flag is set than we walk up the declaration
 *     tree from `tNode`  until we find parent declared `TElementNode`.
 * @returns `true` if we have successfully entered DI associated with `tNode` (or with declared
 *     `TNode` if `flags` has  `SkipSelf`). Failing to enter DI implies that no associated
 *     `NodeInjector` can be found and we should instead use `ModuleInjector`.
 *     - If `true` than this call must be fallowed by `leaveDI`
 *     - If `false` than this call failed and we should NOT call `leaveDI`
 */
export function enterDI(lView, tNode, flags) {
    ngDevMode && assertLViewOrUndefined(lView);
    if (flags & InjectFlags.SkipSelf) {
        ngDevMode && assertTNodeForTView(tNode, lView[TVIEW]);
        let parentTNode = tNode;
        let parentLView = lView;
        while (true) {
            ngDevMode && assertDefined(parentTNode, 'Parent TNode should be defined');
            parentTNode = parentTNode.parent;
            if (parentTNode === null && !(flags & InjectFlags.Host)) {
                parentTNode = getDeclarationTNode(parentLView);
                if (parentTNode === null)
                    break;
                // In this case, a parent exists and is definitely an element. So it will definitely
                // have an existing lView as the declaration view, which is why we can assume it's defined.
                ngDevMode && assertDefined(parentLView, 'Parent LView should be defined');
                parentLView = parentLView[DECLARATION_VIEW];
                // In Ivy there are Comment nodes that correspond to ngIf and NgFor embedded directives
                // We want to skip those and look only at Elements and ElementContainers to ensure
                // we're looking at true parent nodes, and not content or other types.
                if (parentTNode.type & (2 /* Element */ | 8 /* ElementContainer */)) {
                    break;
                }
            }
            else {
                break;
            }
        }
        if (parentTNode === null) {
            // If we failed to find a parent TNode this means that we should use module injector.
            return false;
        }
        else {
            tNode = parentTNode;
            lView = parentLView;
        }
    }
    ngDevMode && assertTNodeForLView(tNode, lView);
    const lFrame = instructionState.lFrame = allocLFrame();
    lFrame.currentTNode = tNode;
    lFrame.lView = lView;
    return true;
}
/**
 * Swap the current lView with a new lView.
 *
 * For performance reasons we store the lView in the top level of the module.
 * This way we minimize the number of properties to read. Whenever a new view
 * is entered we have to store the lView for later, and when the view is
 * exited the state has to be restored
 *
 * @param newView New lView to become active
 * @returns the previously active lView;
 */
export function enterView(newView) {
    ngDevMode && assertNotEqual(newView[0], newView[1], '????');
    ngDevMode && assertLViewOrUndefined(newView);
    const newLFrame = allocLFrame();
    if (ngDevMode) {
        assertEqual(newLFrame.isParent, true, 'Expected clean LFrame');
        assertEqual(newLFrame.lView, null, 'Expected clean LFrame');
        assertEqual(newLFrame.tView, null, 'Expected clean LFrame');
        assertEqual(newLFrame.selectedIndex, -1, 'Expected clean LFrame');
        assertEqual(newLFrame.elementDepthCount, 0, 'Expected clean LFrame');
        assertEqual(newLFrame.currentDirectiveIndex, -1, 'Expected clean LFrame');
        assertEqual(newLFrame.currentNamespace, null, 'Expected clean LFrame');
        assertEqual(newLFrame.bindingRootIndex, -1, 'Expected clean LFrame');
        assertEqual(newLFrame.currentQueryIndex, 0, 'Expected clean LFrame');
    }
    const tView = newView[TVIEW];
    instructionState.lFrame = newLFrame;
    ngDevMode && tView.firstChild && assertTNodeForTView(tView.firstChild, tView);
    newLFrame.currentTNode = tView.firstChild;
    newLFrame.lView = newView;
    newLFrame.tView = tView;
    newLFrame.contextLView = newView;
    newLFrame.bindingIndex = tView.bindingStartIndex;
    newLFrame.inI18n = false;
}
/**
 * Allocates next free LFrame. This function tries to reuse the `LFrame`s to lower memory pressure.
 */
function allocLFrame() {
    const currentLFrame = instructionState.lFrame;
    const childLFrame = currentLFrame === null ? null : currentLFrame.child;
    const newLFrame = childLFrame === null ? createLFrame(currentLFrame) : childLFrame;
    return newLFrame;
}
function createLFrame(parent) {
    const lFrame = {
        currentTNode: null,
        isParent: true,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: parent,
        child: null,
        inI18n: false,
    };
    parent !== null && (parent.child = lFrame); // link the new LFrame for reuse.
    return lFrame;
}
/**
 * A lightweight version of leave which is used with DI.
 *
 * This function only resets `currentTNode` and `LView` as those are the only properties
 * used with DI (`enterDI()`).
 *
 * NOTE: This function is reexported as `leaveDI`. However `leaveDI` has return type of `void` where
 * as `leaveViewLight` has `LFrame`. This is so that `leaveViewLight` can be used in `leaveView`.
 */
function leaveViewLight() {
    const oldLFrame = instructionState.lFrame;
    instructionState.lFrame = oldLFrame.parent;
    oldLFrame.currentTNode = null;
    oldLFrame.lView = null;
    return oldLFrame;
}
/**
 * This is a lightweight version of the `leaveView` which is needed by the DI system.
 *
 * NOTE: this function is an alias so that we can change the type of the function to have `void`
 * return type.
 */
export const leaveDI = leaveViewLight;
/**
 * Leave the current `LView`
 *
 * This pops the `LFrame` with the associated `LView` from the stack.
 *
 * IMPORTANT: We must zero out the `LFrame` values here otherwise they will be retained. This is
 * because for performance reasons we don't release `LFrame` but rather keep it for next use.
 */
export function leaveView() {
    const oldLFrame = leaveViewLight();
    oldLFrame.isParent = true;
    oldLFrame.tView = null;
    oldLFrame.selectedIndex = -1;
    oldLFrame.contextLView = null;
    oldLFrame.elementDepthCount = 0;
    oldLFrame.currentDirectiveIndex = -1;
    oldLFrame.currentNamespace = null;
    oldLFrame.bindingRootIndex = -1;
    oldLFrame.bindingIndex = -1;
    oldLFrame.currentQueryIndex = 0;
}
export function nextContextImpl(level) {
    const contextLView = instructionState.lFrame.contextLView =
        walkUpViews(level, instructionState.lFrame.contextLView);
    return contextLView[CONTEXT];
}
function walkUpViews(nestingLevel, currentView) {
    while (nestingLevel > 0) {
        ngDevMode &&
            assertDefined(currentView[DECLARATION_VIEW], 'Declaration view should be defined if nesting level is greater than 0.');
        currentView = currentView[DECLARATION_VIEW];
        nestingLevel--;
    }
    return currentView;
}
/**
 * Gets the currently selected element index.
 *
 * Used with {@link property} instruction (and more in the future) to identify the index in the
 * current `LView` to act on.
 */
export function getSelectedIndex() {
    return instructionState.lFrame.selectedIndex;
}
/**
 * Sets the most recent index passed to {@link select}
 *
 * Used with {@link property} instruction (and more in the future) to identify the index in the
 * current `LView` to act on.
 *
 * (Note that if an "exit function" was set earlier (via `setElementExitFn()`) then that will be
 * run if and when the provided `index` value is different from the current selected index value.)
 */
export function setSelectedIndex(index) {
    ngDevMode && index !== -1 &&
        assertGreaterThanOrEqual(index, HEADER_OFFSET, 'Index must be past HEADER_OFFSET (or -1).');
    ngDevMode &&
        assertLessThan(index, instructionState.lFrame.lView.length, 'Can\'t set index passed end of LView');
    instructionState.lFrame.selectedIndex = index;
}
/**
 * Gets the `tNode` that represents currently selected element.
 */
export function getSelectedTNode() {
    const lFrame = instructionState.lFrame;
    return getTNode(lFrame.tView, lFrame.selectedIndex);
}
/**
 * Sets the namespace used to create elements to `'http://www.w3.org/2000/svg'` in global state.
 *
 * @codeGenApi
 */
export function ɵɵnamespaceSVG() {
    instructionState.lFrame.currentNamespace = SVG_NAMESPACE;
}
/**
 * Sets the namespace used to create elements to `'http://www.w3.org/1998/MathML/'` in global state.
 *
 * @codeGenApi
 */
export function ɵɵnamespaceMathML() {
    instructionState.lFrame.currentNamespace = MATH_ML_NAMESPACE;
}
/**
 * Sets the namespace used to create elements to `null`, which forces element creation to use
 * `createElement` rather than `createElementNS`.
 *
 * @codeGenApi
 */
export function ɵɵnamespaceHTML() {
    namespaceHTMLInternal();
}
/**
 * Sets the namespace used to create elements to `null`, which forces element creation to use
 * `createElement` rather than `createElementNS`.
 */
export function namespaceHTMLInternal() {
    instructionState.lFrame.currentNamespace = null;
}
export function getNamespace() {
    return instructionState.lFrame.currentNamespace;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWhJLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUcxRixPQUFPLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBMEIsTUFBTSxFQUFTLEtBQUssRUFBbUIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzSSxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzlELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQWdLM0MsTUFBTSxnQkFBZ0IsR0FBcUI7SUFDekMsTUFBTSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDMUIsZUFBZSxFQUFFLElBQUk7Q0FDdEIsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxJQUFJLHVCQUF1QixHQUFHLEtBQUssQ0FBQztBQUVwQzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLCtCQUErQjtJQUM3QyxPQUFPLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQ2pELENBQUM7QUFHRCxNQUFNLFVBQVUsb0JBQW9CO0lBQ2xDLE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBQ25ELENBQUM7QUFFRCxNQUFNLFVBQVUseUJBQXlCO0lBQ3ZDLGdCQUFnQixDQUFD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NUIsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztBQUMzRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxpQkFBaUI7SUFDL0IsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDO0FBQy9ELENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxlQUFlO0lBQzdCLHFCQUFxQixFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxxQkFBcUI7SUFDbkMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUNsRCxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVk7SUFDMUIsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdEZsYWdzfSBmcm9tICcuLi9kaS9pbnRlcmZhY2UvaW5qZWN0b3InO1xuaW1wb3J0IHthc3NlcnREZWZpbmVkLCBhc3NlcnRFcXVhbCwgYXNzZXJ0R3JlYXRlclRoYW5PckVxdWFsLCBhc3NlcnRMZXNzVGhhbiwgYXNzZXJ0Tm90RXF1YWwsIHRocm93RXJyb3J9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuaW1wb3J0IHthc3NlcnRMVmlld09yVW5kZWZpbmVkLCBhc3NlcnRUTm9kZUZvckxWaWV3LCBhc3NlcnRUTm9kZUZvclRWaWV3fSBmcm9tICcuL2Fzc2VydCc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZn0gZnJvbSAnLi9pbnRlcmZhY2VzL2RlZmluaXRpb24nO1xuaW1wb3J0IHtUTm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge0NPTlRFWFQsIERFQ0xBUkFUSU9OX1ZJRVcsIEhFQURFUl9PRkZTRVQsIExWaWV3LCBPcGFxdWVWaWV3U3RhdGUsIFRfSE9TVCwgVERhdGEsIFRWSUVXLCBUVmlldywgVFZpZXdUeXBlfSBmcm9tICcuL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge01BVEhfTUxfTkFNRVNQQUNFLCBTVkdfTkFNRVNQQUNFfSBmcm9tICcuL25hbWVzcGFjZXMnO1xuaW1wb3J0IHtnZXRUTm9kZX0gZnJvbSAnLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5cbi8qKlxuICpcbiAqL1xuaW50ZXJmYWNlIExGcmFtZSB7XG4gIC8qKlxuICAgKiBQYXJlbnQgTEZyYW1lLlxuICAgKlxuICAgKiBUaGlzIGlzIG5lZWRlZCB3aGVuIGBsZWF2ZVZpZXdgIGlzIGNhbGxlZCB0byByZXN0b3JlIHRoZSBwcmV2aW91cyBzdGF0ZS5cbiAgICovXG4gIHBhcmVudDogTEZyYW1lO1xuXG4gIC8qKlxuICAgKiBDaGlsZCBMRnJhbWUuXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZCB0byBjYWNoZSBleGlzdGluZyBMRnJhbWVzIHRvIHJlbGlldmUgdGhlIG1lbW9yeSBwcmVzc3VyZS5cbiAgICovXG4gIGNoaWxkOiBMRnJhbWV8bnVsbDtcblxuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIGN1cnJlbnQgdmlldyBiZWluZyBwcm9jZXNzZWQuXG4gICAqXG4gICAqIEFuIGFycmF5IG9mIG5vZGVzICh0ZXh0LCBlbGVtZW50LCBjb250YWluZXIsIGV0YyksIHBpcGVzLCB0aGVpciBiaW5kaW5ncywgYW5kXG4gICAqIGFueSBsb2NhbCB2YXJpYWJsZXMgdGhhdCBuZWVkIHRvIGJlIHN0b3JlZCBiZXR3ZWVuIGludm9jYXRpb25zLlxuICAgKi9cbiAgbFZpZXc6IExWaWV3O1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IGBUVmlld2AgYXNzb2NpYXRlZCB3aXRoIHRoZSBgTEZyYW1lLmxWaWV3YC5cbiAgICpcbiAgICogT25lIGNhbiBnZXQgYFRWaWV3YCBmcm9tIGBsRnJhbWVbVFZJRVddYCBob3dldmVyIGJlY2F1c2UgaXQgaXMgc28gY29tbW9uIGl0IG1ha2VzIHNlbnNlIHRvXG4gICAqIHN0b3JlIGl0IGluIGBMRnJhbWVgIGZvciBwZXJmIHJlYXNvbnMuXG4gICAqL1xuICB0VmlldzogVFZpZXc7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc2V0IHRoZSBwYXJlbnQgcHJvcGVydHkgd2hlbiBub2RlcyBhcmUgY3JlYXRlZCBhbmQgdHJhY2sgcXVlcnkgcmVzdWx0cy5cbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYGlzUGFyZW50YC5cbiAgICovXG4gIGN1cnJlbnRUTm9kZTogVE5vZGV8bnVsbDtcblxuICAvKipcbiAgICogSWYgYGlzUGFyZW50YCBpczpcbiAgICogIC0gYHRydWVgOiB0aGVuIGBjdXJyZW50VE5vZGVgIHBvaW50cyB0byBhIHBhcmVudCBub2RlLlxuICAgKiAgLSBgZmFsc2VgOiB0aGVuIGBjdXJyZW50VE5vZGVgIHBvaW50cyB0byBwcmV2aW91cyBub2RlIChzaWJsaW5nKS5cbiAgICovXG4gIGlzUGFyZW50OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmRleCBvZiBjdXJyZW50bHkgc2VsZWN0ZWQgZWxlbWVudCBpbiBMVmlldy5cbiAgICpcbiAgICogVXNlZCBieSBiaW5kaW5nIGluc3RydWN0aW9ucy4gVXBkYXRlZCBhcyBwYXJ0IG9mIGFkdmFuY2UgaW5zdHJ1Y3Rpb24uXG4gICAqL1xuICBzZWxlY3RlZEluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgcG9pbnRlciB0byB0aGUgYmluZGluZyBpbmRleC5cbiAgICovXG4gIGJpbmRpbmdJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCB2aWV3RGF0YSByZXRyaWV2ZWQgYnkgbmV4dENvbnRleHQoKS5cbiAgICogQWxsb3dzIGJ1aWxkaW5nIG5leHRDb250ZXh0KCkgYW5kIHJlZmVyZW5jZSgpIGNhbGxzLlxuICAgKlxuICAgKiBlLmcuIGNvbnN0IGlubmVyID0geCgpLiRpbXBsaWNpdDsgY29uc3Qgb3V0ZXIgPSB4KCkuJGltcGxpY2l0O1xuICAgKi9cbiAgY29udGV4dExWaWV3OiBMVmlldztcblxuICAvKipcbiAgICogU3RvcmUgdGhlIGVsZW1lbnQgZGVwdGggY291bnQuIFRoaXMgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgcm9vdCBlbGVtZW50cyBvZiB0aGUgdGVtcGxhdGVcbiAgICogc28gdGhhdCB3ZSBjYW4gdGhlbiBhdHRhY2ggcGF0Y2ggZGF0YSBgTFZpZXdgIHRvIG9ubHkgdGhvc2UgZWxlbWVudHMuIFdlIGtub3cgdGhhdCB0aG9zZVxuICAgKiBhcmUgdGhlIG9ubHkgcGxhY2VzIHdoZXJlIHRoZSBwYXRjaCBkYXRhIGNvdWxkIGNoYW5nZSwgdGhpcyB3YXkgd2Ugd2lsbCBzYXZlIG9uIG51bWJlclxuICAgKiBvZiBwbGFjZXMgd2hlcmUgdGhhIHBhdGNoaW5nIG9jY3Vycy5cbiAgICovXG4gIGVsZW1lbnREZXB0aENvdW50OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgbmFtZXNwYWNlIHRvIGJlIHVzZWQgd2hlbiBjcmVhdGluZyBlbGVtZW50c1xuICAgKi9cbiAgY3VycmVudE5hbWVzcGFjZTogc3RyaW5nfG51bGw7XG5cblxuICAvKipcbiAgICogVGhlIHJvb3QgaW5kZXggZnJvbSB3aGljaCBwdXJlIGZ1bmN0aW9uIGluc3RydWN0aW9ucyBzaG91bGQgY2FsY3VsYXRlIHRoZWlyIGJpbmRpbmdcbiAgICogaW5kaWNlcy4gSW4gY29tcG9uZW50IHZpZXdzLCB0aGlzIGlzIFRWaWV3LmJpbmRpbmdTdGFydEluZGV4LiBJbiBhIGhvc3QgYmluZGluZ1xuICAgKiBjb250ZXh0LCB0aGlzIGlzIHRoZSBUVmlldy5leHBhbmRvU3RhcnRJbmRleCArIGFueSBkaXJzL2hvc3RWYXJzIGJlZm9yZSB0aGUgZ2l2ZW4gZGlyLlxuICAgKi9cbiAgYmluZGluZ1Jvb3RJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IGluZGV4IG9mIGEgVmlldyBvciBDb250ZW50IFF1ZXJ5IHdoaWNoIG5lZWRzIHRvIGJlIHByb2Nlc3NlZCBuZXh0LlxuICAgKiBXZSBpdGVyYXRlIG92ZXIgdGhlIGxpc3Qgb2YgUXVlcmllcyBhbmQgaW5jcmVtZW50IGN1cnJlbnQgcXVlcnkgaW5kZXggYXQgZXZlcnkgc3RlcC5cbiAgICovXG4gIGN1cnJlbnRRdWVyeUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZW4gaG9zdCBiaW5kaW5nIGlzIGV4ZWN1dGluZyB0aGlzIHBvaW50cyB0byB0aGUgZGlyZWN0aXZlIGluZGV4LlxuICAgKiBgVFZpZXcuZGF0YVtjdXJyZW50RGlyZWN0aXZlSW5kZXhdYCBpcyBgRGlyZWN0aXZlRGVmYFxuICAgKiBgTFZpZXdbY3VycmVudERpcmVjdGl2ZUluZGV4XWAgaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgY3VycmVudERpcmVjdGl2ZUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFyZSB3ZSBjdXJyZW50bHkgaW4gaTE4biBibG9jayBhcyBkZW5vdGVkIGJ5IGDJtcm1ZWxlbWVudFN0YXJ0YCBhbmQgYMm1ybVlbGVtZW50RW5kYC5cbiAgICpcbiAgICogVGhpcyBpbmZvcm1hdGlvbiBpcyBuZWVkZWQgYmVjYXVzZSB3aGlsZSB3ZSBhcmUgaW4gaTE4biBibG9jayBhbGwgZWxlbWVudHMgbXVzdCBiZSBwcmUtZGVjbGFyZWRcbiAgICogaW4gdGhlIHRyYW5zbGF0aW9uLiAoaS5lLiBgSGVsbG8g77+9IzLvv71Xb3JsZO+/vS8jMu+/vSFgIHByZS1kZWNsYXJlcyBlbGVtZW50IGF0IGDvv70jMu+/vWAgbG9jYXRpb24uKVxuICAgKiBUaGlzIGFsbG9jYXRlcyBgVE5vZGVUeXBlLlBsYWNlaG9sZGVyYCBlbGVtZW50IGF0IGxvY2F0aW9uIGAyYC4gSWYgdHJhbnNsYXRvciByZW1vdmVzIGDvv70jMu+/vWBcbiAgICogZnJvbSB0cmFuc2xhdGlvbiB0aGFuIHRoZSBydW50aW1lIG11c3QgYWxzbyBlbnN1cmUgdGhhIGVsZW1lbnQgYXQgYDJgIGRvZXMgbm90IGdldCBpbnNlcnRlZFxuICAgKiBpbnRvIHRoZSBET00uIFRoZSB0cmFuc2xhdGlvbiBkb2VzIG5vdCBjYXJyeSBpbmZvcm1hdGlvbiBhYm91dCBkZWxldGVkIGVsZW1lbnRzLiBUaGVyZWZvciB0aGVcbiAgICogb25seSB3YXkgdG8ga25vdyB0aGF0IGFuIGVsZW1lbnQgaXMgZGVsZXRlZCBpcyB0aGF0IGl0IHdhcyBub3QgcHJlLWRlY2xhcmVkIGluIHRoZSB0cmFuc2xhdGlvbi5cbiAgICpcbiAgICogVGhpcyBmbGFnIHdvcmtzIGJ5IGVuc3VyaW5nIHRoYXQgZWxlbWVudHMgd2hpY2ggYXJlIGNyZWF0ZWQgd2l0aG91dCBwcmUtZGVjbGFyYXRpb25cbiAgICogKGBUTm9kZVR5cGUuUGxhY2Vob2xkZXJgKSBhcmUgbm90IGluc2VydGVkIGludG8gdGhlIERPTSByZW5kZXIgdHJlZS4gKEl0IGRvZXMgbWVhbiB0aGF0IHRoZVxuICAgKiBlbGVtZW50IHN0aWxsIGdldHMgaW5zdGFudGlhdGVkIGFsb25nIHdpdGggYWxsIG9mIGl0cyBiZWhhdmlvciBbZGlyZWN0aXZlc10pXG4gICAqL1xuICBpbkkxOG46IGJvb2xlYW47XG59XG5cbi8qKlxuICogQWxsIGltcGxpY2l0IGluc3RydWN0aW9uIHN0YXRlIGlzIHN0b3JlZCBoZXJlLlxuICpcbiAqIEl0IGlzIHVzZWZ1bCB0byBoYXZlIGEgc2luZ2xlIG9iamVjdCB3aGVyZSBhbGwgb2YgdGhlIHN0YXRlIGlzIHN0b3JlZCBhcyBhIG1lbnRhbCBtb2RlbFxuICogKHJhdGhlciBpdCBiZWluZyBzcHJlYWQgYWNyb3NzIG1hbnkgZGlmZmVyZW50IHZhcmlhYmxlcy4pXG4gKlxuICogUEVSRiBOT1RFOiBUdXJucyBvdXQgdGhhdCB3cml0aW5nIHRvIGEgdHJ1ZSBnbG9iYWwgdmFyaWFibGUgaXMgc2xvd2VyIHRoYW5cbiAqIGhhdmluZyBhbiBpbnRlcm1lZGlhdGUgb2JqZWN0IHdpdGggcHJvcGVydGllcy5cbiAqL1xuaW50ZXJmYWNlIEluc3RydWN0aW9uU3RhdGUge1xuICAvKipcbiAgICogQ3VycmVudCBgTEZyYW1lYFxuICAgKlxuICAgKiBgbnVsbGAgaWYgd2UgaGF2ZSBub3QgY2FsbGVkIGBlbnRlclZpZXdgXG4gICAqL1xuICBsRnJhbWU6IExGcmFtZTtcblxuICAvKipcbiAgICogU3RvcmVzIHdoZXRoZXIgZGlyZWN0aXZlcyBzaG91bGQgYmUgbWF0Y2hlZCB0byBlbGVtZW50cy5cbiAgICpcbiAgICogV2hlbiB0ZW1wbGF0ZSBjb250YWlucyBgbmdOb25CaW5kYWJsZWAgdGhlbiB3ZSBuZWVkIHRvIHByZXZlbnQgdGhlIHJ1bnRpbWUgZnJvbSBtYXRjaGluZ1xuICAgKiBkaXJlY3RpdmVzIG9uIGNoaWxkcmVuIG9mIHRoYXQgZWxlbWVudC5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogYGBgXG4gICAqIDxteS1jb21wIG15LWRpcmVjdGl2ZT5cbiAgICogICBTaG91bGQgbWF0Y2ggY29tcG9uZW50IC8gZGlyZWN0aXZlLlxuICAgKiA8L215LWNvbXA+XG4gICAqIDxkaXYgbmdOb25CaW5kYWJsZT5cbiAgICogICA8bXktY29tcCBteS1kaXJlY3RpdmU+XG4gICAqICAgICBTaG91bGQgbm90IG1hdGNoIGNvbXBvbmVudCAvIGRpcmVjdGl2ZSBiZWNhdXNlIHdlIGFyZSBpbiBuZ05vbkJpbmRhYmxlLlxuICAgKiAgIDwvbXktY29tcD5cbiAgICogPC9kaXY+XG4gICAqIGBgYFxuICAgKi9cbiAgYmluZGluZ3NFbmFibGVkOiBib29sZWFuO1xufVxuXG5jb25zdCBpbnN0cnVjdGlvblN0YXRlOiBJbnN0cnVjdGlvblN0YXRlID0ge1xuICBsRnJhbWU6IGNyZWF0ZUxGcmFtZShudWxsKSxcbiAgYmluZGluZ3NFbmFibGVkOiB0cnVlLFxufTtcblxuLyoqXG4gKiBJbiB0aGlzIG1vZGUsIGFueSBjaGFuZ2VzIGluIGJpbmRpbmdzIHdpbGwgdGhyb3cgYW4gRXhwcmVzc2lvbkNoYW5nZWRBZnRlckNoZWNrZWQgZXJyb3IuXG4gKlxuICogTmVjZXNzYXJ5IHRvIHN1cHBvcnQgQ2hhbmdlRGV0ZWN0b3JSZWYuY2hlY2tOb0NoYW5nZXMoKS5cbiAqXG4gKiBUaGUgYGNoZWNrTm9DaGFuZ2VzYCBmdW5jdGlvbiBpcyBpbnZva2VkIG9ubHkgaW4gbmdEZXZNb2RlPXRydWUgYW5kIHZlcmlmaWVzIHRoYXQgbm8gdW5pbnRlbmRlZFxuICogY2hhbmdlcyBleGlzdCBpbiB0aGUgY2hhbmdlIGRldGVjdG9yIG9yIGl0cyBjaGlsZHJlbi5cbiAqL1xubGV0IF9pc0luQ2hlY2tOb0NoYW5nZXNNb2RlID0gZmFsc2U7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBpbnN0cnVjdGlvbiBzdGF0ZSBzdGFjayBpcyBlbXB0eS5cbiAqXG4gKiBJbnRlbmRlZCB0byBiZSBjYWxsZWQgZnJvbSB0ZXN0cyBvbmx5ICh0cmVlIHNoYWtlbiBvdGhlcndpc2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BlY09ubHlJc0luc3RydWN0aW9uU3RhdGVFbXB0eSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLnBhcmVudCA9PT0gbnVsbDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudERlcHRoQ291bnQoKSB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5lbGVtZW50RGVwdGhDb3VudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlYXNlRWxlbWVudERlcHRoQ291bnQoKSB7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmVsZW1lbnREZXB0aENvdW50Kys7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyZWFzZUVsZW1lbnREZXB0aENvdW50KCkge1xuICBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5lbGVtZW50RGVwdGhDb3VudC0tO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmluZGluZ3NFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaW5zdHJ1Y3Rpb25TdGF0ZS5iaW5kaW5nc0VuYWJsZWQ7XG59XG5cblxuLyoqXG4gKiBFbmFibGVzIGRpcmVjdGl2ZSBtYXRjaGluZyBvbiBlbGVtZW50cy5cbiAqXG4gKiAgKiBFeGFtcGxlOlxuICogYGBgXG4gKiA8bXktY29tcCBteS1kaXJlY3RpdmU+XG4gKiAgIFNob3VsZCBtYXRjaCBjb21wb25lbnQgLyBkaXJlY3RpdmUuXG4gKiA8L215LWNvbXA+XG4gKiA8ZGl2IG5nTm9uQmluZGFibGU+XG4gKiAgIDwhLS0gybXJtWRpc2FibGVCaW5kaW5ncygpIC0tPlxuICogICA8bXktY29tcCBteS1kaXJlY3RpdmU+XG4gKiAgICAgU2hvdWxkIG5vdCBtYXRjaCBjb21wb25lbnQgLyBkaXJlY3RpdmUgYmVjYXVzZSB3ZSBhcmUgaW4gbmdOb25CaW5kYWJsZS5cbiAqICAgPC9teS1jb21wPlxuICogICA8IS0tIMm1ybVlbmFibGVCaW5kaW5ncygpIC0tPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVuYWJsZUJpbmRpbmdzKCk6IHZvaWQge1xuICBpbnN0cnVjdGlvblN0YXRlLmJpbmRpbmdzRW5hYmxlZCA9IHRydWU7XG59XG5cbi8qKlxuICogRGlzYWJsZXMgZGlyZWN0aXZlIG1hdGNoaW5nIG9uIGVsZW1lbnQuXG4gKlxuICogICogRXhhbXBsZTpcbiAqIGBgYFxuICogPG15LWNvbXAgbXktZGlyZWN0aXZlPlxuICogICBTaG91bGQgbWF0Y2ggY29tcG9uZW50IC8gZGlyZWN0aXZlLlxuICogPC9teS1jb21wPlxuICogPGRpdiBuZ05vbkJpbmRhYmxlPlxuICogICA8IS0tIMm1ybVkaXNhYmxlQmluZGluZ3MoKSAtLT5cbiAqICAgPG15LWNvbXAgbXktZGlyZWN0aXZlPlxuICogICAgIFNob3VsZCBub3QgbWF0Y2ggY29tcG9uZW50IC8gZGlyZWN0aXZlIGJlY2F1c2Ugd2UgYXJlIGluIG5nTm9uQmluZGFibGUuXG4gKiAgIDwvbXktY29tcD5cbiAqICAgPCEtLSDJtcm1ZW5hYmxlQmluZGluZ3MoKSAtLT5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVkaXNhYmxlQmluZGluZ3MoKTogdm9pZCB7XG4gIGluc3RydWN0aW9uU3RhdGUuYmluZGluZ3NFbmFibGVkID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjdXJyZW50IGBMVmlld2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMVmlldygpOiBMVmlldyB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5sVmlldztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgYFRWaWV3YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRWaWV3KCk6IFRWaWV3IHtcbiAgcmV0dXJuIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLnRWaWV3O1xufVxuXG4vKipcbiAqIFJlc3RvcmVzIGBjb250ZXh0Vmlld0RhdGFgIHRvIHRoZSBnaXZlbiBPcGFxdWVWaWV3U3RhdGUgaW5zdGFuY2UuXG4gKlxuICogVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBnZXRDdXJyZW50VmlldygpIGluc3RydWN0aW9uIHRvIHNhdmUgYSBzbmFwc2hvdFxuICogb2YgdGhlIGN1cnJlbnQgdmlldyBhbmQgcmVzdG9yZSBpdCB3aGVuIGxpc3RlbmVycyBhcmUgaW52b2tlZC4gVGhpcyBhbGxvd3NcbiAqIHdhbGtpbmcgdGhlIGRlY2xhcmF0aW9uIHZpZXcgdHJlZSBpbiBsaXN0ZW5lcnMgdG8gZ2V0IHZhcnMgZnJvbSBwYXJlbnQgdmlld3MuXG4gKlxuICogQHBhcmFtIHZpZXdUb1Jlc3RvcmUgVGhlIE9wYXF1ZVZpZXdTdGF0ZSBpbnN0YW5jZSB0byByZXN0b3JlLlxuICogQHJldHVybnMgQ29udGV4dCBvZiB0aGUgcmVzdG9yZWQgT3BhcXVlVmlld1N0YXRlIGluc3RhbmNlLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1cmVzdG9yZVZpZXc8VCA9IGFueT4odmlld1RvUmVzdG9yZTogT3BhcXVlVmlld1N0YXRlKTogVCB7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmNvbnRleHRMVmlldyA9IHZpZXdUb1Jlc3RvcmUgYXMgYW55IGFzIExWaWV3O1xuICByZXR1cm4gKHZpZXdUb1Jlc3RvcmUgYXMgYW55IGFzIExWaWV3KVtDT05URVhUXSBhcyBUO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VE5vZGUoKTogVE5vZGV8bnVsbCB7XG4gIGxldCBjdXJyZW50VE5vZGUgPSBnZXRDdXJyZW50VE5vZGVQbGFjZWhvbGRlck9rKCk7XG4gIHdoaWxlIChjdXJyZW50VE5vZGUgIT09IG51bGwgJiYgY3VycmVudFROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5QbGFjZWhvbGRlcikge1xuICAgIGN1cnJlbnRUTm9kZSA9IGN1cnJlbnRUTm9kZS5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRUTm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUTm9kZVBsYWNlaG9sZGVyT2soKTogVE5vZGV8bnVsbCB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5jdXJyZW50VE5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50UGFyZW50VE5vZGUoKTogVE5vZGV8bnVsbCB7XG4gIGNvbnN0IGxGcmFtZSA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lO1xuICBjb25zdCBjdXJyZW50VE5vZGUgPSBsRnJhbWUuY3VycmVudFROb2RlO1xuICByZXR1cm4gbEZyYW1lLmlzUGFyZW50ID8gY3VycmVudFROb2RlIDogY3VycmVudFROb2RlIS5wYXJlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50VE5vZGUodE5vZGU6IFROb2RlfG51bGwsIGlzUGFyZW50OiBib29sZWFuKSB7XG4gIG5nRGV2TW9kZSAmJiB0Tm9kZSAmJiBhc3NlcnRUTm9kZUZvclRWaWV3KHROb2RlLCBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS50Vmlldyk7XG4gIGNvbnN0IGxGcmFtZSA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lO1xuICBsRnJhbWUuY3VycmVudFROb2RlID0gdE5vZGU7XG4gIGxGcmFtZS5pc1BhcmVudCA9IGlzUGFyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDdXJyZW50VE5vZGVQYXJlbnQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5pc1BhcmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRUTm9kZUFzTm90UGFyZW50KCk6IHZvaWQge1xuICBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5pc1BhcmVudCA9IGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRUTm9kZUFzUGFyZW50KCk6IHZvaWQge1xuICBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5pc1BhcmVudCA9IHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0TFZpZXcoKTogTFZpZXcge1xuICByZXR1cm4gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuY29udGV4dExWaWV3O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbkNoZWNrTm9DaGFuZ2VzTW9kZSgpOiBib29sZWFuIHtcbiAgIW5nRGV2TW9kZSAmJiB0aHJvd0Vycm9yKCdNdXN0IG5ldmVyIGJlIGNhbGxlZCBpbiBwcm9kdWN0aW9uIG1vZGUnKTtcbiAgcmV0dXJuIF9pc0luQ2hlY2tOb0NoYW5nZXNNb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SXNJbkNoZWNrTm9DaGFuZ2VzTW9kZShtb2RlOiBib29sZWFuKTogdm9pZCB7XG4gICFuZ0Rldk1vZGUgJiYgdGhyb3dFcnJvcignTXVzdCBuZXZlciBiZSBjYWxsZWQgaW4gcHJvZHVjdGlvbiBtb2RlJyk7XG4gIF9pc0luQ2hlY2tOb0NoYW5nZXNNb2RlID0gbW9kZTtcbn1cblxuLy8gdG9wIGxldmVsIHZhcmlhYmxlcyBzaG91bGQgbm90IGJlIGV4cG9ydGVkIGZvciBwZXJmb3JtYW5jZSByZWFzb25zIChQRVJGX05PVEVTLm1kKVxuZXhwb3J0IGZ1bmN0aW9uIGdldEJpbmRpbmdSb290KCkge1xuICBjb25zdCBsRnJhbWUgPSBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZTtcbiAgbGV0IGluZGV4ID0gbEZyYW1lLmJpbmRpbmdSb290SW5kZXg7XG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICBpbmRleCA9IGxGcmFtZS5iaW5kaW5nUm9vdEluZGV4ID0gbEZyYW1lLnRWaWV3LmJpbmRpbmdTdGFydEluZGV4O1xuICB9XG4gIHJldHVybiBpbmRleDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJpbmRpbmdJbmRleCgpOiBudW1iZXIge1xuICByZXR1cm4gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuYmluZGluZ0luZGV4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QmluZGluZ0luZGV4KHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuYmluZGluZ0luZGV4ID0gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0QmluZGluZ0luZGV4KCk6IG51bWJlciB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5iaW5kaW5nSW5kZXgrKztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudEJpbmRpbmdJbmRleChjb3VudDogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgbEZyYW1lID0gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWU7XG4gIGNvbnN0IGluZGV4ID0gbEZyYW1lLmJpbmRpbmdJbmRleDtcbiAgbEZyYW1lLmJpbmRpbmdJbmRleCA9IGxGcmFtZS5iaW5kaW5nSW5kZXggKyBjb3VudDtcbiAgcmV0dXJuIGluZGV4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbkkxOG5CbG9jaygpIHtcbiAgcmV0dXJuIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmluSTE4bjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEluSTE4bkJsb2NrKGlzSW5JMThuQmxvY2s6IGJvb2xlYW4pOiB2b2lkIHtcbiAgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuaW5JMThuID0gaXNJbkkxOG5CbG9jaztcbn1cblxuLyoqXG4gKiBTZXQgYSBuZXcgYmluZGluZyByb290IGluZGV4IHNvIHRoYXQgaG9zdCB0ZW1wbGF0ZSBmdW5jdGlvbnMgY2FuIGV4ZWN1dGUuXG4gKlxuICogQmluZGluZ3MgaW5zaWRlIHRoZSBob3N0IHRlbXBsYXRlIGFyZSAwIGluZGV4LiBCdXQgYmVjYXVzZSB3ZSBkb24ndCBrbm93IGFoZWFkIG9mIHRpbWVcbiAqIGhvdyBtYW55IGhvc3QgYmluZGluZ3Mgd2UgaGF2ZSB3ZSBjYW4ndCBwcmUtY29tcHV0ZSB0aGVtLiBGb3IgdGhpcyByZWFzb24gdGhleSBhcmUgYWxsXG4gKiAwIGluZGV4IGFuZCB3ZSBqdXN0IHNoaWZ0IHRoZSByb290IHNvIHRoYXQgdGhleSBtYXRjaCBuZXh0IGF2YWlsYWJsZSBsb2NhdGlvbiBpbiB0aGUgTFZpZXcuXG4gKlxuICogQHBhcmFtIGJpbmRpbmdSb290SW5kZXggUm9vdCBpbmRleCBmb3IgYGhvc3RCaW5kaW5nc2BcbiAqIEBwYXJhbSBjdXJyZW50RGlyZWN0aXZlSW5kZXggYFREYXRhW2N1cnJlbnREaXJlY3RpdmVJbmRleF1gIHdpbGwgcG9pbnQgdG8gdGhlIGN1cnJlbnQgZGlyZWN0aXZlXG4gKiAgICAgICAgd2hvc2UgYGhvc3RCaW5kaW5nc2AgYXJlIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEJpbmRpbmdSb290Rm9ySG9zdEJpbmRpbmdzKFxuICAgIGJpbmRpbmdSb290SW5kZXg6IG51bWJlciwgY3VycmVudERpcmVjdGl2ZUluZGV4OiBudW1iZXIpIHtcbiAgY29uc3QgbEZyYW1lID0gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWU7XG4gIGxGcmFtZS5iaW5kaW5nSW5kZXggPSBsRnJhbWUuYmluZGluZ1Jvb3RJbmRleCA9IGJpbmRpbmdSb290SW5kZXg7XG4gIHNldEN1cnJlbnREaXJlY3RpdmVJbmRleChjdXJyZW50RGlyZWN0aXZlSW5kZXgpO1xufVxuXG4vKipcbiAqIFdoZW4gaG9zdCBiaW5kaW5nIGlzIGV4ZWN1dGluZyB0aGlzIHBvaW50cyB0byB0aGUgZGlyZWN0aXZlIGluZGV4LlxuICogYFRWaWV3LmRhdGFbZ2V0Q3VycmVudERpcmVjdGl2ZUluZGV4KCldYCBpcyBgRGlyZWN0aXZlRGVmYFxuICogYExWaWV3W2dldEN1cnJlbnREaXJlY3RpdmVJbmRleCgpXWAgaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudERpcmVjdGl2ZUluZGV4KCk6IG51bWJlciB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5jdXJyZW50RGlyZWN0aXZlSW5kZXg7XG59XG5cbi8qKlxuICogU2V0cyBhbiBpbmRleCBvZiBhIGRpcmVjdGl2ZSB3aG9zZSBgaG9zdEJpbmRpbmdzYCBhcmUgYmVpbmcgcHJvY2Vzc2VkLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50RGlyZWN0aXZlSW5kZXggYFREYXRhYCBpbmRleCB3aGVyZSBjdXJyZW50IGRpcmVjdGl2ZSBpbnN0YW5jZSBjYW4gYmUgZm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50RGlyZWN0aXZlSW5kZXgoY3VycmVudERpcmVjdGl2ZUluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuY3VycmVudERpcmVjdGl2ZUluZGV4ID0gY3VycmVudERpcmVjdGl2ZUluZGV4O1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBjdXJyZW50IGBEaXJlY3RpdmVEZWZgIHdoaWNoIGlzIGFjdGl2ZSB3aGVuIGBob3N0QmluZGluZ3NgIGluc3RydWN0aW9uIGlzIGJlaW5nXG4gKiBleGVjdXRlZC5cbiAqXG4gKiBAcGFyYW0gdERhdGEgQ3VycmVudCBgVERhdGFgIHdoZXJlIHRoZSBgRGlyZWN0aXZlRGVmYCB3aWxsIGJlIGxvb2tlZCB1cCBhdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnREaXJlY3RpdmVEZWYodERhdGE6IFREYXRhKTogRGlyZWN0aXZlRGVmPGFueT58bnVsbCB7XG4gIGNvbnN0IGN1cnJlbnREaXJlY3RpdmVJbmRleCA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmN1cnJlbnREaXJlY3RpdmVJbmRleDtcbiAgcmV0dXJuIGN1cnJlbnREaXJlY3RpdmVJbmRleCA9PT0gLTEgPyBudWxsIDogdERhdGFbY3VycmVudERpcmVjdGl2ZUluZGV4XSBhcyBEaXJlY3RpdmVEZWY8YW55Pjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRRdWVyeUluZGV4KCk6IG51bWJlciB7XG4gIHJldHVybiBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5jdXJyZW50UXVlcnlJbmRleDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRRdWVyeUluZGV4KHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuY3VycmVudFF1ZXJ5SW5kZXggPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgYFROb2RlYCBvZiB0aGUgbG9jYXRpb24gd2hlcmUgdGhlIGN1cnJlbnQgYExWaWV3YCBpcyBkZWNsYXJlZCBhdC5cbiAqXG4gKiBAcGFyYW0gbFZpZXcgYW4gYExWaWV3YCB0aGF0IHdlIHdhbnQgdG8gZmluZCBwYXJlbnQgYFROb2RlYCBmb3IuXG4gKi9cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uVE5vZGUobFZpZXc6IExWaWV3KTogVE5vZGV8bnVsbCB7XG4gIGNvbnN0IHRWaWV3ID0gbFZpZXdbVFZJRVddO1xuXG4gIC8vIFJldHVybiB0aGUgZGVjbGFyYXRpb24gcGFyZW50IGZvciBlbWJlZGRlZCB2aWV3c1xuICBpZiAodFZpZXcudHlwZSA9PT0gVFZpZXdUeXBlLkVtYmVkZGVkKSB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQodFZpZXcuZGVjbFROb2RlLCAnRW1iZWRkZWQgVE5vZGVzIHNob3VsZCBoYXZlIGRlY2xhcmF0aW9uIHBhcmVudHMuJyk7XG4gICAgcmV0dXJuIHRWaWV3LmRlY2xUTm9kZTtcbiAgfVxuXG4gIC8vIENvbXBvbmVudHMgZG9uJ3QgaGF2ZSBgVFZpZXcuZGVjbFROb2RlYCBiZWNhdXNlIGVhY2ggaW5zdGFuY2Ugb2YgY29tcG9uZW50IGNvdWxkIGJlXG4gIC8vIGluc2VydGVkIGluIGRpZmZlcmVudCBsb2NhdGlvbiwgaGVuY2UgYFRWaWV3LmRlY2xUTm9kZWAgaXMgbWVhbmluZ2xlc3MuXG4gIC8vIEZhbGxpbmcgYmFjayB0byBgVF9IT1NUYCBpbiBjYXNlIHdlIGNyb3NzIGNvbXBvbmVudCBib3VuZGFyeS5cbiAgaWYgKHRWaWV3LnR5cGUgPT09IFRWaWV3VHlwZS5Db21wb25lbnQpIHtcbiAgICByZXR1cm4gbFZpZXdbVF9IT1NUXTtcbiAgfVxuXG4gIC8vIFJlbWFpbmluZyBUTm9kZSB0eXBlIGlzIGBUVmlld1R5cGUuUm9vdGAgd2hpY2ggZG9lc24ndCBoYXZlIGEgcGFyZW50IFROb2RlLlxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgbGlnaHQgd2VpZ2h0IHZlcnNpb24gb2YgdGhlIGBlbnRlclZpZXdgIHdoaWNoIGlzIG5lZWRlZCBieSB0aGUgREkgc3lzdGVtLlxuICpcbiAqIEBwYXJhbSBsVmlldyBgTFZpZXdgIGxvY2F0aW9uIG9mIHRoZSBESSBjb250ZXh0LlxuICogQHBhcmFtIHROb2RlIGBUTm9kZWAgZm9yIERJIGNvbnRleHRcbiAqIEBwYXJhbSBmbGFncyBESSBjb250ZXh0IGZsYWdzLiBpZiBgU2tpcFNlbGZgIGZsYWcgaXMgc2V0IHRoYW4gd2Ugd2FsayB1cCB0aGUgZGVjbGFyYXRpb25cbiAqICAgICB0cmVlIGZyb20gYHROb2RlYCAgdW50aWwgd2UgZmluZCBwYXJlbnQgZGVjbGFyZWQgYFRFbGVtZW50Tm9kZWAuXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgd2UgaGF2ZSBzdWNjZXNzZnVsbHkgZW50ZXJlZCBESSBhc3NvY2lhdGVkIHdpdGggYHROb2RlYCAob3Igd2l0aCBkZWNsYXJlZFxuICogICAgIGBUTm9kZWAgaWYgYGZsYWdzYCBoYXMgIGBTa2lwU2VsZmApLiBGYWlsaW5nIHRvIGVudGVyIERJIGltcGxpZXMgdGhhdCBubyBhc3NvY2lhdGVkXG4gKiAgICAgYE5vZGVJbmplY3RvcmAgY2FuIGJlIGZvdW5kIGFuZCB3ZSBzaG91bGQgaW5zdGVhZCB1c2UgYE1vZHVsZUluamVjdG9yYC5cbiAqICAgICAtIElmIGB0cnVlYCB0aGFuIHRoaXMgY2FsbCBtdXN0IGJlIGZhbGxvd2VkIGJ5IGBsZWF2ZURJYFxuICogICAgIC0gSWYgYGZhbHNlYCB0aGFuIHRoaXMgY2FsbCBmYWlsZWQgYW5kIHdlIHNob3VsZCBOT1QgY2FsbCBgbGVhdmVESWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVudGVyREkobFZpZXc6IExWaWV3LCB0Tm9kZTogVE5vZGUsIGZsYWdzOiBJbmplY3RGbGFncykge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0TFZpZXdPclVuZGVmaW5lZChsVmlldyk7XG5cbiAgaWYgKGZsYWdzICYgSW5qZWN0RmxhZ3MuU2tpcFNlbGYpIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0VE5vZGVGb3JUVmlldyh0Tm9kZSwgbFZpZXdbVFZJRVddKTtcblxuICAgIGxldCBwYXJlbnRUTm9kZSA9IHROb2RlIGFzIFROb2RlIHwgbnVsbDtcbiAgICBsZXQgcGFyZW50TFZpZXcgPSBsVmlldztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChwYXJlbnRUTm9kZSwgJ1BhcmVudCBUTm9kZSBzaG91bGQgYmUgZGVmaW5lZCcpO1xuICAgICAgcGFyZW50VE5vZGUgPSBwYXJlbnRUTm9kZSEucGFyZW50IGFzIFROb2RlIHwgbnVsbDtcbiAgICAgIGlmIChwYXJlbnRUTm9kZSA9PT0gbnVsbCAmJiAhKGZsYWdzICYgSW5qZWN0RmxhZ3MuSG9zdCkpIHtcbiAgICAgICAgcGFyZW50VE5vZGUgPSBnZXREZWNsYXJhdGlvblROb2RlKHBhcmVudExWaWV3KTtcbiAgICAgICAgaWYgKHBhcmVudFROb2RlID09PSBudWxsKSBicmVhaztcblxuICAgICAgICAvLyBJbiB0aGlzIGNhc2UsIGEgcGFyZW50IGV4aXN0cyBhbmQgaXMgZGVmaW5pdGVseSBhbiBlbGVtZW50LiBTbyBpdCB3aWxsIGRlZmluaXRlbHlcbiAgICAgICAgLy8gaGF2ZSBhbiBleGlzdGluZyBsVmlldyBhcyB0aGUgZGVjbGFyYXRpb24gdmlldywgd2hpY2ggaXMgd2h5IHdlIGNhbiBhc3N1bWUgaXQncyBkZWZpbmVkLlxuICAgICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChwYXJlbnRMVmlldywgJ1BhcmVudCBMVmlldyBzaG91bGQgYmUgZGVmaW5lZCcpO1xuICAgICAgICBwYXJlbnRMVmlldyA9IHBhcmVudExWaWV3W0RFQ0xBUkFUSU9OX1ZJRVddITtcblxuICAgICAgICAvLyBJbiBJdnkgdGhlcmUgYXJlIENvbW1lbnQgbm9kZXMgdGhhdCBjb3JyZXNwb25kIHRvIG5nSWYgYW5kIE5nRm9yIGVtYmVkZGVkIGRpcmVjdGl2ZXNcbiAgICAgICAgLy8gV2Ugd2FudCB0byBza2lwIHRob3NlIGFuZCBsb29rIG9ubHkgYXQgRWxlbWVudHMgYW5kIEVsZW1lbnRDb250YWluZXJzIHRvIGVuc3VyZVxuICAgICAgICAvLyB3ZSdyZSBsb29raW5nIGF0IHRydWUgcGFyZW50IG5vZGVzLCBhbmQgbm90IGNvbnRlbnQgb3Igb3RoZXIgdHlwZXMuXG4gICAgICAgIGlmIChwYXJlbnRUTm9kZS50eXBlICYgKFROb2RlVHlwZS5FbGVtZW50IHwgVE5vZGVUeXBlLkVsZW1lbnRDb250YWluZXIpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyZW50VE5vZGUgPT09IG51bGwpIHtcbiAgICAgIC8vIElmIHdlIGZhaWxlZCB0byBmaW5kIGEgcGFyZW50IFROb2RlIHRoaXMgbWVhbnMgdGhhdCB3ZSBzaG91bGQgdXNlIG1vZHVsZSBpbmplY3Rvci5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdE5vZGUgPSBwYXJlbnRUTm9kZTtcbiAgICAgIGxWaWV3ID0gcGFyZW50TFZpZXc7XG4gICAgfVxuICB9XG5cbiAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlRm9yTFZpZXcodE5vZGUsIGxWaWV3KTtcbiAgY29uc3QgbEZyYW1lID0gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUgPSBhbGxvY0xGcmFtZSgpO1xuICBsRnJhbWUuY3VycmVudFROb2RlID0gdE5vZGU7XG4gIGxGcmFtZS5sVmlldyA9IGxWaWV3O1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIFN3YXAgdGhlIGN1cnJlbnQgbFZpZXcgd2l0aCBhIG5ldyBsVmlldy5cbiAqXG4gKiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB3ZSBzdG9yZSB0aGUgbFZpZXcgaW4gdGhlIHRvcCBsZXZlbCBvZiB0aGUgbW9kdWxlLlxuICogVGhpcyB3YXkgd2UgbWluaW1pemUgdGhlIG51bWJlciBvZiBwcm9wZXJ0aWVzIHRvIHJlYWQuIFdoZW5ldmVyIGEgbmV3IHZpZXdcbiAqIGlzIGVudGVyZWQgd2UgaGF2ZSB0byBzdG9yZSB0aGUgbFZpZXcgZm9yIGxhdGVyLCBhbmQgd2hlbiB0aGUgdmlldyBpc1xuICogZXhpdGVkIHRoZSBzdGF0ZSBoYXMgdG8gYmUgcmVzdG9yZWRcbiAqXG4gKiBAcGFyYW0gbmV3VmlldyBOZXcgbFZpZXcgdG8gYmVjb21lIGFjdGl2ZVxuICogQHJldHVybnMgdGhlIHByZXZpb3VzbHkgYWN0aXZlIGxWaWV3O1xuICovXG5leHBvcnQgZnVuY3Rpb24gZW50ZXJWaWV3KG5ld1ZpZXc6IExWaWV3KTogdm9pZCB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnROb3RFcXVhbChuZXdWaWV3WzBdLCBuZXdWaWV3WzFdIGFzIGFueSwgJz8/Pz8nKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExWaWV3T3JVbmRlZmluZWQobmV3Vmlldyk7XG4gIGNvbnN0IG5ld0xGcmFtZSA9IGFsbG9jTEZyYW1lKCk7XG4gIGlmIChuZ0Rldk1vZGUpIHtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUuaXNQYXJlbnQsIHRydWUsICdFeHBlY3RlZCBjbGVhbiBMRnJhbWUnKTtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUubFZpZXcsIG51bGwsICdFeHBlY3RlZCBjbGVhbiBMRnJhbWUnKTtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUudFZpZXcsIG51bGwsICdFeHBlY3RlZCBjbGVhbiBMRnJhbWUnKTtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUuc2VsZWN0ZWRJbmRleCwgLTEsICdFeHBlY3RlZCBjbGVhbiBMRnJhbWUnKTtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUuZWxlbWVudERlcHRoQ291bnQsIDAsICdFeHBlY3RlZCBjbGVhbiBMRnJhbWUnKTtcbiAgICBhc3NlcnRFcXVhbChuZXdMRnJhbWUuY3VycmVudERpcmVjdGl2ZUluZGV4LCAtMSwgJ0V4cGVjdGVkIGNsZWFuIExGcmFtZScpO1xuICAgIGFzc2VydEVxdWFsKG5ld0xGcmFtZS5jdXJyZW50TmFtZXNwYWNlLCBudWxsLCAnRXhwZWN0ZWQgY2xlYW4gTEZyYW1lJyk7XG4gICAgYXNzZXJ0RXF1YWwobmV3TEZyYW1lLmJpbmRpbmdSb290SW5kZXgsIC0xLCAnRXhwZWN0ZWQgY2xlYW4gTEZyYW1lJyk7XG4gICAgYXNzZXJ0RXF1YWwobmV3TEZyYW1lLmN1cnJlbnRRdWVyeUluZGV4LCAwLCAnRXhwZWN0ZWQgY2xlYW4gTEZyYW1lJyk7XG4gIH1cbiAgY29uc3QgdFZpZXcgPSBuZXdWaWV3W1RWSUVXXTtcbiAgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUgPSBuZXdMRnJhbWU7XG4gIG5nRGV2TW9kZSAmJiB0Vmlldy5maXJzdENoaWxkICYmIGFzc2VydFROb2RlRm9yVFZpZXcodFZpZXcuZmlyc3RDaGlsZCwgdFZpZXcpO1xuICBuZXdMRnJhbWUuY3VycmVudFROb2RlID0gdFZpZXcuZmlyc3RDaGlsZCE7XG4gIG5ld0xGcmFtZS5sVmlldyA9IG5ld1ZpZXc7XG4gIG5ld0xGcmFtZS50VmlldyA9IHRWaWV3O1xuICBuZXdMRnJhbWUuY29udGV4dExWaWV3ID0gbmV3VmlldyE7XG4gIG5ld0xGcmFtZS5iaW5kaW5nSW5kZXggPSB0Vmlldy5iaW5kaW5nU3RhcnRJbmRleDtcbiAgbmV3TEZyYW1lLmluSTE4biA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEFsbG9jYXRlcyBuZXh0IGZyZWUgTEZyYW1lLiBUaGlzIGZ1bmN0aW9uIHRyaWVzIHRvIHJldXNlIHRoZSBgTEZyYW1lYHMgdG8gbG93ZXIgbWVtb3J5IHByZXNzdXJlLlxuICovXG5mdW5jdGlvbiBhbGxvY0xGcmFtZSgpIHtcbiAgY29uc3QgY3VycmVudExGcmFtZSA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lO1xuICBjb25zdCBjaGlsZExGcmFtZSA9IGN1cnJlbnRMRnJhbWUgPT09IG51bGwgPyBudWxsIDogY3VycmVudExGcmFtZS5jaGlsZDtcbiAgY29uc3QgbmV3TEZyYW1lID0gY2hpbGRMRnJhbWUgPT09IG51bGwgPyBjcmVhdGVMRnJhbWUoY3VycmVudExGcmFtZSkgOiBjaGlsZExGcmFtZTtcbiAgcmV0dXJuIG5ld0xGcmFtZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTEZyYW1lKHBhcmVudDogTEZyYW1lfG51bGwpOiBMRnJhbWUge1xuICBjb25zdCBsRnJhbWU6IExGcmFtZSA9IHtcbiAgICBjdXJyZW50VE5vZGU6IG51bGwsXG4gICAgaXNQYXJlbnQ6IHRydWUsXG4gICAgbFZpZXc6IG51bGwhLFxuICAgIHRWaWV3OiBudWxsISxcbiAgICBzZWxlY3RlZEluZGV4OiAtMSxcbiAgICBjb250ZXh0TFZpZXc6IG51bGwhLFxuICAgIGVsZW1lbnREZXB0aENvdW50OiAwLFxuICAgIGN1cnJlbnROYW1lc3BhY2U6IG51bGwsXG4gICAgY3VycmVudERpcmVjdGl2ZUluZGV4OiAtMSxcbiAgICBiaW5kaW5nUm9vdEluZGV4OiAtMSxcbiAgICBiaW5kaW5nSW5kZXg6IC0xLFxuICAgIGN1cnJlbnRRdWVyeUluZGV4OiAwLFxuICAgIHBhcmVudDogcGFyZW50ISxcbiAgICBjaGlsZDogbnVsbCxcbiAgICBpbkkxOG46IGZhbHNlLFxuICB9O1xuICBwYXJlbnQgIT09IG51bGwgJiYgKHBhcmVudC5jaGlsZCA9IGxGcmFtZSk7ICAvLyBsaW5rIHRoZSBuZXcgTEZyYW1lIGZvciByZXVzZS5cbiAgcmV0dXJuIGxGcmFtZTtcbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0IHZlcnNpb24gb2YgbGVhdmUgd2hpY2ggaXMgdXNlZCB3aXRoIERJLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gb25seSByZXNldHMgYGN1cnJlbnRUTm9kZWAgYW5kIGBMVmlld2AgYXMgdGhvc2UgYXJlIHRoZSBvbmx5IHByb3BlcnRpZXNcbiAqIHVzZWQgd2l0aCBESSAoYGVudGVyREkoKWApLlxuICpcbiAqIE5PVEU6IFRoaXMgZnVuY3Rpb24gaXMgcmVleHBvcnRlZCBhcyBgbGVhdmVESWAuIEhvd2V2ZXIgYGxlYXZlRElgIGhhcyByZXR1cm4gdHlwZSBvZiBgdm9pZGAgd2hlcmVcbiAqIGFzIGBsZWF2ZVZpZXdMaWdodGAgaGFzIGBMRnJhbWVgLiBUaGlzIGlzIHNvIHRoYXQgYGxlYXZlVmlld0xpZ2h0YCBjYW4gYmUgdXNlZCBpbiBgbGVhdmVWaWV3YC5cbiAqL1xuZnVuY3Rpb24gbGVhdmVWaWV3TGlnaHQoKTogTEZyYW1lIHtcbiAgY29uc3Qgb2xkTEZyYW1lID0gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWU7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lID0gb2xkTEZyYW1lLnBhcmVudDtcbiAgb2xkTEZyYW1lLmN1cnJlbnRUTm9kZSA9IG51bGwhO1xuICBvbGRMRnJhbWUubFZpZXcgPSBudWxsITtcbiAgcmV0dXJuIG9sZExGcmFtZTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgbGlnaHR3ZWlnaHQgdmVyc2lvbiBvZiB0aGUgYGxlYXZlVmlld2Agd2hpY2ggaXMgbmVlZGVkIGJ5IHRoZSBESSBzeXN0ZW0uXG4gKlxuICogTk9URTogdGhpcyBmdW5jdGlvbiBpcyBhbiBhbGlhcyBzbyB0aGF0IHdlIGNhbiBjaGFuZ2UgdGhlIHR5cGUgb2YgdGhlIGZ1bmN0aW9uIHRvIGhhdmUgYHZvaWRgXG4gKiByZXR1cm4gdHlwZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGxlYXZlREk6ICgpID0+IHZvaWQgPSBsZWF2ZVZpZXdMaWdodDtcblxuLyoqXG4gKiBMZWF2ZSB0aGUgY3VycmVudCBgTFZpZXdgXG4gKlxuICogVGhpcyBwb3BzIHRoZSBgTEZyYW1lYCB3aXRoIHRoZSBhc3NvY2lhdGVkIGBMVmlld2AgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogSU1QT1JUQU5UOiBXZSBtdXN0IHplcm8gb3V0IHRoZSBgTEZyYW1lYCB2YWx1ZXMgaGVyZSBvdGhlcndpc2UgdGhleSB3aWxsIGJlIHJldGFpbmVkLiBUaGlzIGlzXG4gKiBiZWNhdXNlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zIHdlIGRvbid0IHJlbGVhc2UgYExGcmFtZWAgYnV0IHJhdGhlciBrZWVwIGl0IGZvciBuZXh0IHVzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlYXZlVmlldygpIHtcbiAgY29uc3Qgb2xkTEZyYW1lID0gbGVhdmVWaWV3TGlnaHQoKTtcbiAgb2xkTEZyYW1lLmlzUGFyZW50ID0gdHJ1ZTtcbiAgb2xkTEZyYW1lLnRWaWV3ID0gbnVsbCE7XG4gIG9sZExGcmFtZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gIG9sZExGcmFtZS5jb250ZXh0TFZpZXcgPSBudWxsITtcbiAgb2xkTEZyYW1lLmVsZW1lbnREZXB0aENvdW50ID0gMDtcbiAgb2xkTEZyYW1lLmN1cnJlbnREaXJlY3RpdmVJbmRleCA9IC0xO1xuICBvbGRMRnJhbWUuY3VycmVudE5hbWVzcGFjZSA9IG51bGw7XG4gIG9sZExGcmFtZS5iaW5kaW5nUm9vdEluZGV4ID0gLTE7XG4gIG9sZExGcmFtZS5iaW5kaW5nSW5kZXggPSAtMTtcbiAgb2xkTEZyYW1lLmN1cnJlbnRRdWVyeUluZGV4ID0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRDb250ZXh0SW1wbDxUID0gYW55PihsZXZlbDogbnVtYmVyKTogVCB7XG4gIGNvbnN0IGNvbnRleHRMVmlldyA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmNvbnRleHRMVmlldyA9XG4gICAgICB3YWxrVXBWaWV3cyhsZXZlbCwgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuY29udGV4dExWaWV3ISk7XG4gIHJldHVybiBjb250ZXh0TFZpZXdbQ09OVEVYVF0gYXMgVDtcbn1cblxuZnVuY3Rpb24gd2Fsa1VwVmlld3MobmVzdGluZ0xldmVsOiBudW1iZXIsIGN1cnJlbnRWaWV3OiBMVmlldyk6IExWaWV3IHtcbiAgd2hpbGUgKG5lc3RpbmdMZXZlbCA+IDApIHtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0RGVmaW5lZChcbiAgICAgICAgICAgIGN1cnJlbnRWaWV3W0RFQ0xBUkFUSU9OX1ZJRVddLFxuICAgICAgICAgICAgJ0RlY2xhcmF0aW9uIHZpZXcgc2hvdWxkIGJlIGRlZmluZWQgaWYgbmVzdGluZyBsZXZlbCBpcyBncmVhdGVyIHRoYW4gMC4nKTtcbiAgICBjdXJyZW50VmlldyA9IGN1cnJlbnRWaWV3W0RFQ0xBUkFUSU9OX1ZJRVddITtcbiAgICBuZXN0aW5nTGV2ZWwtLTtcbiAgfVxuICByZXR1cm4gY3VycmVudFZpZXc7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVsZW1lbnQgaW5kZXguXG4gKlxuICogVXNlZCB3aXRoIHtAbGluayBwcm9wZXJ0eX0gaW5zdHJ1Y3Rpb24gKGFuZCBtb3JlIGluIHRoZSBmdXR1cmUpIHRvIGlkZW50aWZ5IHRoZSBpbmRleCBpbiB0aGVcbiAqIGN1cnJlbnQgYExWaWV3YCB0byBhY3Qgb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RlZEluZGV4KCkge1xuICByZXR1cm4gaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuc2VsZWN0ZWRJbmRleDtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtb3N0IHJlY2VudCBpbmRleCBwYXNzZWQgdG8ge0BsaW5rIHNlbGVjdH1cbiAqXG4gKiBVc2VkIHdpdGgge0BsaW5rIHByb3BlcnR5fSBpbnN0cnVjdGlvbiAoYW5kIG1vcmUgaW4gdGhlIGZ1dHVyZSkgdG8gaWRlbnRpZnkgdGhlIGluZGV4IGluIHRoZVxuICogY3VycmVudCBgTFZpZXdgIHRvIGFjdCBvbi5cbiAqXG4gKiAoTm90ZSB0aGF0IGlmIGFuIFwiZXhpdCBmdW5jdGlvblwiIHdhcyBzZXQgZWFybGllciAodmlhIGBzZXRFbGVtZW50RXhpdEZuKClgKSB0aGVuIHRoYXQgd2lsbCBiZVxuICogcnVuIGlmIGFuZCB3aGVuIHRoZSBwcm92aWRlZCBgaW5kZXhgIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IHNlbGVjdGVkIGluZGV4IHZhbHVlLilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFNlbGVjdGVkSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICBuZ0Rldk1vZGUgJiYgaW5kZXggIT09IC0xICYmXG4gICAgICBhc3NlcnRHcmVhdGVyVGhhbk9yRXF1YWwoaW5kZXgsIEhFQURFUl9PRkZTRVQsICdJbmRleCBtdXN0IGJlIHBhc3QgSEVBREVSX09GRlNFVCAob3IgLTEpLicpO1xuICBuZ0Rldk1vZGUgJiZcbiAgICAgIGFzc2VydExlc3NUaGFuKFxuICAgICAgICAgIGluZGV4LCBpbnN0cnVjdGlvblN0YXRlLmxGcmFtZS5sVmlldy5sZW5ndGgsICdDYW5cXCd0IHNldCBpbmRleCBwYXNzZWQgZW5kIG9mIExWaWV3Jyk7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBgdE5vZGVgIHRoYXQgcmVwcmVzZW50cyBjdXJyZW50bHkgc2VsZWN0ZWQgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdGVkVE5vZGUoKSB7XG4gIGNvbnN0IGxGcmFtZSA9IGluc3RydWN0aW9uU3RhdGUubEZyYW1lO1xuICByZXR1cm4gZ2V0VE5vZGUobEZyYW1lLnRWaWV3LCBsRnJhbWUuc2VsZWN0ZWRJbmRleCk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbmFtZXNwYWNlIHVzZWQgdG8gY3JlYXRlIGVsZW1lbnRzIHRvIGAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnYCBpbiBnbG9iYWwgc3RhdGUuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVuYW1lc3BhY2VTVkcoKSB7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmN1cnJlbnROYW1lc3BhY2UgPSBTVkdfTkFNRVNQQUNFO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG5hbWVzcGFjZSB1c2VkIHRvIGNyZWF0ZSBlbGVtZW50cyB0byBgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aE1MLydgIGluIGdsb2JhbCBzdGF0ZS5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtW5hbWVzcGFjZU1hdGhNTCgpIHtcbiAgaW5zdHJ1Y3Rpb25TdGF0ZS5sRnJhbWUuY3VycmVudE5hbWVzcGFjZSA9IE1BVEhfTUxfTkFNRVNQQUNFO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG5hbWVzcGFjZSB1c2VkIHRvIGNyZWF0ZSBlbGVtZW50cyB0byBgbnVsbGAsIHdoaWNoIGZvcmNlcyBlbGVtZW50IGNyZWF0aW9uIHRvIHVzZVxuICogYGNyZWF0ZUVsZW1lbnRgIHJhdGhlciB0aGFuIGBjcmVhdGVFbGVtZW50TlNgLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1bmFtZXNwYWNlSFRNTCgpIHtcbiAgbmFtZXNwYWNlSFRNTEludGVybmFsKCk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbmFtZXNwYWNlIHVzZWQgdG8gY3JlYXRlIGVsZW1lbnRzIHRvIGBudWxsYCwgd2hpY2ggZm9yY2VzIGVsZW1lbnQgY3JlYXRpb24gdG8gdXNlXG4gKiBgY3JlYXRlRWxlbWVudGAgcmF0aGVyIHRoYW4gYGNyZWF0ZUVsZW1lbnROU2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYW1lc3BhY2VIVE1MSW50ZXJuYWwoKSB7XG4gIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmN1cnJlbnROYW1lc3BhY2UgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZXNwYWNlKCk6IHN0cmluZ3xudWxsIHtcbiAgcmV0dXJuIGluc3RydWN0aW9uU3RhdGUubEZyYW1lLmN1cnJlbnROYW1lc3BhY2U7XG59XG4iXX0=