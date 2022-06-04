/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../../util/ng_dev_mode';
import '../../util/ng_i18n_closure_mode';
import { getTemplateContent, SRCSET_ATTRS, URI_ATTRS, VALID_ATTRS, VALID_ELEMENTS } from '../../sanitization/html_sanitizer';
import { getInertBodyHelper } from '../../sanitization/inert_body';
import { _sanitizeUrl, sanitizeSrcset } from '../../sanitization/url_sanitizer';
import { assertDefined, assertEqual, assertGreaterThanOrEqual, assertOneOf, assertString } from '../../util/assert';
import { loadIcuContainerVisitor } from '../instructions/i18n_icu_container_visitor';
import { allocExpando, createTNodeAtIndex } from '../instructions/shared';
import { getDocument } from '../interfaces/document';
import { ELEMENT_MARKER, I18nCreateOpCode, ICU_MARKER } from '../interfaces/i18n';
import { HEADER_OFFSET } from '../interfaces/view';
import { getCurrentParentTNode, getCurrentTNode, setCurrentTNode } from '../state';
import { attachDebugGetter } from '../util/debug_utils';
import { i18nCreateOpCodesToString, i18nRemoveOpCodesToString, i18nUpdateOpCodesToString, icuCreateOpCodesToString } from './i18n_debug';
import { addTNodeAndUpdateInsertBeforeIndex } from './i18n_insert_before_index';
import { ensureIcuContainerVisitorLoaded } from './i18n_tree_shaking';
import { createTNodePlaceholder, icuCreateOpCode, setTIcu, setTNodeInsertBeforeIndex } from './i18n_util';
const BINDING_REGEXP = /�(\d+):?\d*�/gi;
const ICU_REGEXP = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi;
const NESTED_ICU = /�(\d+)�/;
const ICU_BLOCK_REGEXP = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/;
const MARKER = `�`;
const SUBTEMPLATE_REGEXP = /�\/?\*(\d+:\d+)�/gi;
const PH_REGEXP = /�(\/?[#*]\d+):?\d*�/gi;
/**
 * Angular Dart introduced &ngsp; as a placeholder for non-removable space, see:
 * https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart#L25-L32
 * In Angular Dart &ngsp; is converted to the 0xE500 PUA (Private Use Areas) unicode character
 * and later on replaced by a space. We are re-implementing the same idea here, since translations
 * might contain this special character.
 */
const NGSP_UNICODE_REGEXP = /\uE500/g;
function replaceNgsp(value) {
    return value.replace(NGSP_UNICODE_REGEXP, ' ');
}
/**
 * Create dynamic nodes from i18n translation block.
 *
 * - Text nodes are created synchronously
 * - TNodes are linked into tree lazily
 *
 * @param tView Current `TView`
 * @parentTNodeIndex index to the parent TNode of this i18n block
 * @param lView Current `LView`
 * @param index Index of `ɵɵi18nStart` instruction.
 * @param message Message to translate.
 * @param subTemplateIndex Index into the sub template of message translation. (ie in case of
 *     `ngIf`) (-1 otherwise)
 */
export function i18nStartFirstCreatePass(tView, parentTNodeIndex, lView, index, message, subTemplateIndex) {
    const rootTNode = getCurrentParentTNode();
    const createOpCodes = [];
    const updateOpCodes = [];
    const existingTNodeStack = [[]];
    if (ngDevMode) {
        attachDebugGetter(createOpCodes, i18nCreateOpCodesToString);
        attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
    }
    message = getTranslationForTemplate(message, subTemplateIndex);
    const msgParts = replaceNgsp(message).split(PH_REGEXP);
    for (let i = 0; i < msgParts.length; i++) {
        let value = msgParts[i];
        if ((i & 1) === 0) {
            // Even indexes are text (including bindings & ICU expressions)
            const parts = i18nParseTextIntoPartsAndICU(value);
            for (let j = 0; j < parts.length; j++) {
                let part = parts[j];
                if ((j & 1) === 0) {
                    // `j` is odd therefore `part` is string
                    const text = part;
                    ngDevMode && assertString(text, 'Parsed ICU part should be string');
                    if (text !== '') {
                        i18nStartFirstCreatePassProcessTextNode(tView, rootTNode, existingTNodeStack[0], createOpCodes, updateOpCodes, lView, text);
                    }
                }
                else {
                    // `j` is Even therefor `part` is an `ICUExpression`
                    const icuExpression = part;
                    // Verify that ICU expression has the right shape. Translations might contain invalid
                    // constructions (while original messages were correct), so ICU parsing at runtime may
                    // not succeed (thus `icuExpression` remains a string).
                    // Note: we intentionally retain the error here by not using `ngDevMode`, because
                    // the value can change based on the locale and users aren't guaranteed to hit
                    // an invalid string while they're developing.
                    if (typeof icuExpression !== 'object') {
                        throw new Error(`Unable to parse ICU expression in "${message}" message.`);
                    }
                    const icuContainerTNode = createTNodeAndAddOpCode(tView, rootTNode, existingTNodeStack[0], lView, createOpCodes, ngDevMode ? `ICU ${index}:${icuExpression.mainBinding}` : '', true);
                    const icuNodeIndex = icuContainerTNode.index;
                    ngDevMode &&
                        assertGreaterThanOrEqual(icuNodeIndex, HEADER_OFFSET, 'Index must be in absolute LView offset');
                    icuStart(tView, lView, updateOpCodes, parentTNodeIndex, icuExpression, icuNodeIndex);
                }
            }
        }
        else {
            // Odd indexes are placeholders (elements and sub-templates)
            // At this point value is something like: '/#1:2' (originally coming from '�/#1:2�')
            const isClosing = value.charCodeAt(0) === 47 /* SLASH */;
            const type = value.charCodeAt(isClosing ? 1 : 0);
            ngDevMode && assertOneOf(type, 42 /* STAR */, 35 /* HASH */);
            const index = HEADER_OFFSET + Number.parseInt(value.substring((isClosing ? 2 : 1)));
            if (isClosing) {
                existingTNodeStack.shift();
                setCurrentTNode(getCurrentParentTNode(), false);
            }
            else {
                const tNode = createTNodePlaceholder(tView, existingTNodeStack[0], index);
                existingTNodeStack.unshift([]);
                setCurrentTNode(tNode, true);
            }
        }
    }
    tView.data[index] = {
        create: createOpCodes,
        update: updateOpCodes,
    };
}
/**
 * Allocate space in i18n Range add create OpCode instruction to create a text or comment node.
 *
 * @param tView Current `TView` needed to allocate space in i18n range.
 * @param rootTNode Root `TNode` of the i18n block. This node determines if the new TNode will be
 *     added as part of the `i18nStart` instruction or as part of the `TNode.insertBeforeIndex`.
 * @param existingTNodes internal state for `addTNodeAndUpdateInsertBeforeIndex`.
 * @param lView Current `LView` needed to allocate space in i18n range.
 * @param createOpCodes Array storing `I18nCreateOpCodes` where new opCodes will be added.
 * @param text Text to be added when the `Text` or `Comment` node will be created.
 * @param isICU true if a `Comment` node for ICU (instead of `Text`) node should be created.
 */
function createTNodeAndAddOpCode(tView, rootTNode, existingTNodes, lView, createOpCodes, text, isICU) {
    const i18nNodeIdx = allocExpando(tView, lView, 1, null);
    let opCode = i18nNodeIdx << I18nCreateOpCode.SHIFT;
    let parentTNode = getCurrentParentTNode();
    if (rootTNode === parentTNode) {
        // FIXME(misko): A null `parentTNode` should represent when we fall of the `LView` boundary.
        // (there is no parent), but in some circumstances (because we are inconsistent about how we set
        // `previousOrParentTNode`) it could point to `rootTNode` So this is a work around.
        parentTNode = null;
    }
    if (parentTNode === null) {
        // If we don't have a parent that means that we can eagerly add nodes.
        // If we have a parent than these nodes can't be added now (as the parent has not been created
        // yet) and instead the `parentTNode` is responsible for adding it. See
        // `TNode.insertBeforeIndex`
        opCode |= I18nCreateOpCode.APPEND_EAGERLY;
    }
    if (isICU) {
        opCode |= I18nCreateOpCode.COMMENT;
        ensureIcuContainerVisitorLoaded(loadIcuContainerVisitor);
    }
    createOpCodes.push(opCode, text === null ? '' : text);
    // We store `{{?}}` so that when looking at debug `TNodeType.template` we can see where the
    // bindings are.
    const tNode = createTNodeAtIndex(tView, i18nNodeIdx, isICU ? 32 /* Icu */ : 1 /* Text */, text === null ? (ngDevMode ? '{{?}}' : '') : text, null);
    addTNodeAndUpdateInsertBeforeIndex(existingTNodes, tNode);
    const tNodeIdx = tNode.index;
    setCurrentTNode(tNode, false /* Text nodes are self closing */);
    if (parentTNode !== null && rootTNode !== parentTNode) {
        // We are a child of deeper node (rather than a direct child of `i18nStart` instruction.)
        // We have to make sure to add ourselves to the parent.
        setTNodeInsertBeforeIndex(parentTNode, tNodeIdx);
    }
    return tNode;
}
/**
 * Processes text node in i18n block.
 *
 * Text nodes can have:
 * - Create instruction in `createOpCodes` for creating the text node.
 * - Allocate spec for text node in i18n range of `LView`
 * - If contains binding:
 *    - bindings => allocate space in i18n range of `LView` to store the binding value.
 *    - populate `updateOpCodes` with update instructions.
 *
 * @param tView Current `TView`
 * @param rootTNode Root `TNode` of the i18n block. This node determines if the new TNode will
 *     be added as part of the `i18nStart` instruction or as part of the
 *     `TNode.insertBeforeIndex`.
 * @param existingTNodes internal state for `addTNodeAndUpdateInsertBeforeIndex`.
 * @param createOpCodes Location where the creation OpCodes will be stored.
 * @param lView Current `LView`
 * @param text The translated text (which may contain binding)
 */
function i18nStartFirstCreatePassProcessTextNode(tView, rootTNode, existingTNodes, createOpCodes, updateOpCodes, lView, text) {
    const hasBinding = text.match(BINDING_REGEXP);
    const tNode = createTNodeAndAddOpCode(tView, rootTNode, existingTNodes, lView, createOpCodes, hasBinding ? null : text, false);
    if (hasBinding) {
        generateBindingUpdateOpCodes(updateOpCodes, text, tNode.index, null, 0, null);
    }
}
/**
 * See `i18nAttributes` above.
 */
export function i18nAttributesFirstPass(tView, index, values) {
    const previousElement = getCurrentTNode();
    const previousElementIndex = previousElement.index;
    const updateOpCodes = [];
    if (ngDevMode) {
        attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
    }
    if (tView.firstCreatePass && tView.data[index] === null) {
        for (let i = 0; i < values.length; i += 2) {
            const attrName = values[i];
            const message = values[i + 1];
            if (message !== '') {
                // Check if attribute value contains an ICU and throw an error if that's the case.
                // ICUs in element attributes are not supported.
                // Note: we intentionally retain the error here by not using `ngDevMode`, because
                // the `value` can change based on the locale and users aren't guaranteed to hit
                // an invalid string while they're developing.
                if (ICU_REGEXP.test(message)) {
                    throw new Error(`ICU expressions are not supported in attributes. Message: "${message}".`);
                }
                // i18n attributes that hit this code path are guaranteed to have bindings, because
                // the compiler treats static i18n attributes as regular attribute bindings.
                // Since this may not be the first i18n attribute on this element we need to pass in how
                // many previous bindings there have already been.
                generateBindingUpdateOpCodes(updateOpCodes, message, previousElementIndex, attrName, countBindings(updateOpCodes), null);
            }
        }
        tView.data[index] = updateOpCodes;
    }
}
/**
 * Generate the OpCodes to update the bindings of a string.
 *
 * @param updateOpCodes Place where the update opcodes will be stored.
 * @param str The string containing the bindings.
 * @param destinationNode Index of the destination node which will receive the binding.
 * @param attrName Name of the attribute, if the string belongs to an attribute.
 * @param sanitizeFn Sanitization function used to sanitize the string after update, if necessary.
 * @param bindingStart The lView index of the next expression that can be bound via an opCode.
 * @returns The mask value for these bindings
 */
function generateBindingUpdateOpCodes(updateOpCodes, str, destinationNode, attrName, bindingStart, sanitizeFn) {
    ngDevMode &&
        assertGreaterThanOrEqual(destinationNode, HEADER_OFFSET, 'Index must be in absolute LView offset');
    const maskIndex = updateOpCodes.length; // Location of mask
    const sizeIndex = maskIndex + 1; // location of size for skipping
    updateOpCodes.push(null, null); // Alloc space for mask and size
    const startIndex = maskIndex + 2; // location of first allocation.
    if (ngDevMode) {
        attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
    }
    const textParts = str.split(BINDING_REGEXP);
    let mask = 0;
    for (let j = 0; j < textParts.length; j++) {
        const textValue = textParts[j];
        if (j & 1) {
            // Odd indexes are bindings
            const bindingIndex = bindingStart + parseInt(textValue, 10);
            updateOpCodes.push(-1 - bindingIndex);
            mask = mask | toMaskBit(bindingIndex);
        }
        else if (textValue !== '') {
            // Even indexes are text
            updateOpCodes.push(textValue);
        }
    }
    updateOpCodes.push(destinationNode << 2 /* SHIFT_REF */ |
        (attrName ? 1 /* Attr */ : 0 /* Text */));
    if (attrName) {
        updateOpCodes.push(attrName, sanitizeFn);
    }
    updateOpCodes[maskIndex] = mask;
    updateOpCodes[sizeIndex] = updateOpCodes.length - startIndex;
    return mask;
}
/**
 * Count the number of bindings in the given `opCodes`.
 *
 * It could be possible to speed this up, by passing the number of bindings found back from
 * `generateBindingUpdateOpCodes()` to `i18nAttributesFirstPass()` but this would then require more
 * complexity in the code and/or transient objects to be created.
 *
 * Since this function is only called once when the template is instantiated, is trivial in the
 * first instance (since `opCodes` will be an empty array), and it is not common for elements to
 * contain multiple i18n bound attributes, it seems like this is a reasonable compromise.
 */
function countBindings(opCodes) {
    let count = 0;
    for (let i = 0; i < opCodes.length; i++) {
        const opCode = opCodes[i];
        // Bindings are negative numbers.
        if (typeof opCode === 'number' && opCode < 0) {
            count++;
        }
    }
    return count;
}
/**
 * Convert binding index to mask bit.
 *
 * Each index represents a single bit on the bit-mask. Because bit-mask only has 32 bits, we make
 * the 32nd bit share all masks for all bindings higher than 32. Since it is extremely rare to
 * have more than 32 bindings this will be hit very rarely. The downside of hitting this corner
 * case is that we will execute binding code more often than necessary. (penalty of performance)
 */
function toMaskBit(bindingIndex) {
    return 1 << Math.min(bindingIndex, 31);
}
export function isRootTemplateMessage(subTemplateIndex) {
    return subTemplateIndex === -1;
}
/**
 * Removes everything inside the sub-templates of a message.
 */
function removeInnerTemplateTranslation(message) {
    let match;
    let res = '';
    let index = 0;
    let inTemplate = false;
    let tagMatched;
    while ((match = SUBTEMPLATE_REGEXP.exec(message)) !== null) {
        if (!inTemplate) {
            res += message.substring(index, match.index + match[0].length);
            tagMatched = match[1];
            inTemplate = true;
        }
        else {
            if (match[0] === `${MARKER}/*${tagMatched}${MARKER}`) {
                index = match.index;
                inTemplate = false;
            }
        }
    }
    ngDevMode &&
        assertEqual(inTemplate, false, `Tag mismatch: unable to find the end of the sub-template in the translation "${message}"`);
    res += message.substr(index);
    return res;
}
/**
 * Extracts a part of a message and removes the rest.
 *
 * This method is used for extracting a part of the message associated with a template. A
 * translated message can span multiple templates.
 *
 * Example:
 * ```
 * <div i18n>Translate <span *ngIf>me</span>!</div>
 * ```
 *
 * @param message The message to crop
 * @param subTemplateIndex Index of the sub-template to extract. If undefined it returns the
 * external template and removes all sub-templates.
 */
export function getTranslationForTemplate(message, subTemplateIndex) {
    if (isRootTemplateMessage(subTemplateIndex)) {
        // We want the root template message, ignore all sub-templates
        return removeInnerTemplateTranslation(message);
    }
    else {
        // We want a specific sub-template
        const start = message.indexOf(`:${subTemplateIndex}${MARKER}`) + 2 + subTemplateIndex.toString().length;
        const end = message.search(new RegExp(`${MARKER}\\/\\*\\d+:${subTemplateIndex}${MARKER}`));
        return removeInnerTemplateTranslation(message.substring(start, end));
    }
}
/**
 * Generate the OpCodes for ICU expressions.
 *
 * @param icuExpression
 * @param index Index where the anchor is stored and an optional `TIcuContainerNode`
 *   - `lView[anchorIdx]` points to a `Comment` node representing the anchor for the ICU.
 *   - `tView.data[anchorIdx]` points to the `TIcuContainerNode` if ICU is root (`null` otherwise)
 */
export function icuStart(tView, lView, updateOpCodes, parentIdx, icuExpression, anchorIdx) {
    ngDevMode && assertDefined(icuExpression, 'ICU expression must be defined');
    let bindingMask = 0;
    const tIcu = {
        type: icuExpression.type,
        currentCaseLViewIndex: allocExpando(tView, lView, 1, null),
        anchorIdx,
        cases: [],
        create: [],
        remove: [],
        update: []
    };
    addUpdateIcuSwitch(updateOpCodes, icuExpression, anchorIdx);
    setTIcu(tView, anchorIdx, tIcu);
    const values = icuExpression.values;
    for (let i = 0; i < values.length; i++) {
        // Each value is an array of strings & other ICU expressions
        const valueArr = values[i];
        const nestedIcus = [];
        for (let j = 0; j < valueArr.length; j++) {
            const value = valueArr[j];
            if (typeof value !== 'string') {
                // It is an nested ICU expression
                const icuIndex = nestedIcus.push(value) - 1;
                // Replace nested ICU expression by a comment node
                valueArr[j] = `<!--�${icuIndex}�-->`;
            }
        }
        bindingMask = parseIcuCase(tView, tIcu, lView, updateOpCodes, parentIdx, icuExpression.cases[i], valueArr.join(''), nestedIcus) |
            bindingMask;
    }
    if (bindingMask) {
        addUpdateIcuUpdate(updateOpCodes, bindingMask, anchorIdx);
    }
}
/**
 * Parses text containing an ICU expression and produces a JSON object for it.
 * Original code from closure library, modified for Angular.
 *
 * @param pattern Text containing an ICU expression that needs to be parsed.
 *
 */
export function parseICUBlock(pattern) {
    const cases = [];
    const values = [];
    let icuType = 1 /* plural */;
    let mainBinding = 0;
    pattern = pattern.replace(ICU_BLOCK_REGEXP, function (str, binding, type) {
        if (type === 'select') {
            icuType = 0 /* select */;
        }
        else {
            icuType = 1 /* plural */;
        }
        mainBinding = parseInt(binding.substr(1), 10);
        return '';
    });
    const parts = i18nParseTextIntoPartsAndICU(pattern);
    // Looking for (key block)+ sequence. One of the keys has to be "other".
    for (let pos = 0; pos < parts.length;) {
        let key = parts[pos++].trim();
        if (icuType === 1 /* plural */) {
            // Key can be "=x", we just want "x"
            key = key.replace(/\s*(?:=)?(\w+)\s*/, '$1');
        }
        if (key.length) {
            cases.push(key);
        }
        const blocks = i18nParseTextIntoPartsAndICU(parts[pos++]);
        if (cases.length > values.length) {
            values.push(blocks);
        }
    }
    // TODO(ocombe): support ICU expressions in attributes, see #21615
    return { type: icuType, mainBinding: mainBinding, cases, values };
}
/**
 * Breaks pattern into strings and top level {...} blocks.
 * Can be used to break a message into text and ICU expressions, or to break an ICU expression
 * into keys and cases. Original code from closure library, modified for Angular.
 *
 * @param pattern (sub)Pattern to be broken.
 * @returns An `Array<string|IcuExpression>` where:
 *   - odd positions: `string` => text between ICU expressions
 *   - even positions: `ICUExpression` => ICU expression parsed into `ICUExpression` record.
 */
export function i18nParseTextIntoPartsAndICU(pattern) {
    if (!pattern) {
        return [];
    }
    let prevPos = 0;
    const braceStack = [];
    const results = [];
    const braces = /[{}]/g;
    // lastIndex doesn't get set to 0 so we have to.
    braces.lastIndex = 0;
    let match;
    while (match = braces.exec(pattern)) {
        const pos = match.index;
        if (match[0] == '}') {
            braceStack.pop();
            if (braceStack.length == 0) {
                // End of the block.
                const block = pattern.substring(prevPos, pos);
                if (ICU_BLOCK_REGEXP.test(block)) {
                    results.push(parseICUBlock(block));
                }
                else {
                    results.push(block);
                }
                prevPos = pos + 1;
            }
        }
        else {
            if (braceStack.length == 0) {
                const substring = pattern.substring(prevPos, pos);
                results.push(substring);
                prevPos = pos + 1;
            }
            braceStack.push('{');
        }
    }
    const substring = pattern.substring(prevPos);
    results.push(substring);
    return results;
}
/**
 * Parses a node, its children and its siblings, and generates the mutate & update OpCodes.
 *
 */
export function parseIcuCase(tView, tIcu, lView, updateOpCodes, parentIdx, caseName, unsafeCaseHtml, nestedIcus) {
    const create = [];
    const remove = [];
    const update = [];
    if (ngDevMode) {
        attachDebugGetter(create, icuCreateOpCodesToString);
        attachDebugGetter(remove, i18nRemoveOpCodesToString);
        attachDebugGetter(update, i18nUpdateOpCodesToString);
    }
    tIcu.cases.push(caseName);
    tIcu.create.push(create);
    tIcu.remove.push(remove);
    tIcu.update.push(update);
    const inertBodyHelper = getInertBodyHelper(getDocument());
    const inertBodyElement = inertBodyHelper.getInertBodyElement(unsafeCaseHtml);
    ngDevMode && assertDefined(inertBodyElement, 'Unable to generate inert body element');
    const inertRootNode = getTemplateContent(inertBodyElement) || inertBodyElement;
    if (inertRootNode) {
        return walkIcuTree(tView, tIcu, lView, updateOpCodes, create, remove, update, inertRootNode, parentIdx, nestedIcus, 0);
    }
    else {
        return 0;
    }
}
function walkIcuTree(tView, tIcu, lView, sharedUpdateOpCodes, create, remove, update, parentNode, parentIdx, nestedIcus, depth) {
    let bindingMask = 0;
    let currentNode = parentNode.firstChild;
    while (currentNode) {
        const newIndex = allocExpando(tView, lView, 1, null);
        switch (currentNode.nodeType) {
            case Node.ELEMENT_NODE:
                const element = currentNode;
                const tagName = element.tagName.toLowerCase();
                if (VALID_ELEMENTS.hasOwnProperty(tagName)) {
                    addCreateNodeAndAppend(create, ELEMENT_MARKER, tagName, parentIdx, newIndex);
                    tView.data[newIndex] = tagName;
                    const elAttrs = element.attributes;
                    for (let i = 0; i < elAttrs.length; i++) {
                        const attr = elAttrs.item(i);
                        const lowerAttrName = attr.name.toLowerCase();
                        const hasBinding = !!attr.value.match(BINDING_REGEXP);
                        // we assume the input string is safe, unless it's using a binding
                        if (hasBinding) {
                            if (VALID_ATTRS.hasOwnProperty(lowerAttrName)) {
                                if (URI_ATTRS[lowerAttrName]) {
                                    generateBindingUpdateOpCodes(update, attr.value, newIndex, attr.name, 0, _sanitizeUrl);
                                }
                                else if (SRCSET_ATTRS[lowerAttrName]) {
                                    generateBindingUpdateOpCodes(update, attr.value, newIndex, attr.name, 0, sanitizeSrcset);
                                }
                                else {
                                    generateBindingUpdateOpCodes(update, attr.value, newIndex, attr.name, 0, null);
                                }
                            }
                            else {
                                ngDevMode &&
                                    console.warn(`WARNING: ignoring unsafe attribute value ` +
                                        `${lowerAttrName} on element ${tagName} ` +
                                        `(see https://g.co/ng/security#xss)`);
                            }
                        }
                        else {
                            addCreateAttribute(create, newIndex, attr);
                        }
                    }
                    // Parse the children of this node (if any)
                    bindingMask = walkIcuTree(tView, tIcu, lView, sharedUpdateOpCodes, create, remove, update, currentNode, newIndex, nestedIcus, depth + 1) |
                        bindingMask;
                    addRemoveNode(remove, newIndex, depth);
                }
                break;
            case Node.TEXT_NODE:
                const value = currentNode.textContent || '';
                const hasBinding = value.match(BINDING_REGEXP);
                addCreateNodeAndAppend(create, null, hasBinding ? '' : value, parentIdx, newIndex);
                addRemoveNode(remove, newIndex, depth);
                if (hasBinding) {
                    bindingMask =
                        generateBindingUpdateOpCodes(update, value, newIndex, null, 0, null) | bindingMask;
                }
                break;
            case Node.COMMENT_NODE:
                // Check if the comment node is a placeholder for a nested ICU
                const isNestedIcu = NESTED_ICU.exec(currentNode.textContent || '');
                if (isNestedIcu) {
                    const nestedIcuIndex = parseInt(isNestedIcu[1], 10);
                    const icuExpression = nestedIcus[nestedIcuIndex];
                    // Create the comment node that will anchor the ICU expression
                    addCreateNodeAndAppend(create, ICU_MARKER, ngDevMode ? `nested ICU ${nestedIcuIndex}` : '', parentIdx, newIndex);
                    icuStart(tView, lView, sharedUpdateOpCodes, parentIdx, icuExpression, newIndex);
                    addRemoveNestedIcu(remove, newIndex, depth);
                }
                break;
        }
        currentNode = currentNode.nextSibling;
    }
    return bindingMask;
}
function addRemoveNode(remove, index, depth) {
    if (depth === 0) {
        remove.push(index);
    }
}
function addRemoveNestedIcu(remove, index, depth) {
    if (depth === 0) {
        remove.push(~index); // remove ICU at `index`
        remove.push(index); // remove ICU comment at `index`
    }
}
function addUpdateIcuSwitch(update, icuExpression, index) {
    update.push(toMaskBit(icuExpression.mainBinding), 2, -1 - icuExpression.mainBinding, index << 2 /* SHIFT_REF */ | 2 /* IcuSwitch */);
}
function addUpdateIcuUpdate(update, bindingMask, index) {
    update.push(bindingMask, 1, index << 2 /* SHIFT_REF */ | 3 /* IcuUpdate */);
}
function addCreateNodeAndAppend(create, marker, text, appendToParentIdx, createAtIdx) {
    if (marker !== null) {
        create.push(marker);
    }
    create.push(text, createAtIdx, icuCreateOpCode(0 /* AppendChild */, appendToParentIdx, createAtIdx));
}
function addCreateAttribute(create, newIndex, attr) {
    create.push(newIndex << 1 /* SHIFT_REF */ | 1 /* Attr */, attr.name, attr.value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wYXJzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaTE4bi9pMThuX3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDM0gsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFbEgsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFDLFlBQVksRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUE2RSxVQUFVLEVBQXlFLE1BQU0sb0JBQW9CLENBQUM7QUFHbk8sT0FBTyxFQUFDLGFBQWEsRUFBZSxNQUFNLG9CQUFvQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2pGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXRELE9BQU8sRUFBQyx5QkFBeUIsRUFBRSx5QkFBeUIsRUFBRSx5QkFBeUIsRUFBRSx3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LEtBQUsscUJBQThCLG9CQUE2QixDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQzNCLE1BQXdCLEVBQUUsTUFBc0MsRUFBRSxJQUFZLEVBQzlFLGlCQUF5QixFQUFFLFdBQW1CO0lBQ2hELElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FDUCxJQUFJLEVBQUUsV0FBVyxFQUNqQixlQUFlLHNCQUE4QixpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLE1BQXdCLEVBQUUsUUFBZ0IsRUFBRSxJQUFVO0lBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxxQkFBNkIsZUFBdUIsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgJy4uLy4uL3V0aWwvbmdfZGV2X21vZGUnO1xuaW1wb3J0ICcuLi8uLi91dGlsL25nX2kxOG5fY2xvc3VyZV9tb2RlJztcblxuaW1wb3J0IHtnZXRUZW1wbGF0ZUNvbnRlbnQsIFNSQ1NFVF9BVFRSUywgVVJJX0FUVFJTLCBWQUxJRF9BVFRSUywgVkFMSURfRUxFTUVOVFN9IGZyb20gJy4uLy4uL3Nhbml0aXphdGlvbi9odG1sX3Nhbml0aXplcic7XG5pbXBvcnQge2dldEluZXJ0Qm9keUhlbHBlcn0gZnJvbSAnLi4vLi4vc2FuaXRpemF0aW9uL2luZXJ0X2JvZHknO1xuaW1wb3J0IHtfc2FuaXRpemVVcmwsIHNhbml0aXplU3Jjc2V0fSBmcm9tICcuLi8uLi9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplcic7XG5pbXBvcnQge2Fzc2VydERlZmluZWQsIGFzc2VydEVxdWFsLCBhc3NlcnRHcmVhdGVyVGhhbk9yRXF1YWwsIGFzc2VydE9uZU9mLCBhc3NlcnRTdHJpbmd9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7Q2hhckNvZGV9IGZyb20gJy4uLy4uL3V0aWwvY2hhcl9jb2RlJztcbmltcG9ydCB7bG9hZEljdUNvbnRhaW5lclZpc2l0b3J9IGZyb20gJy4uL2luc3RydWN0aW9ucy9pMThuX2ljdV9jb250YWluZXJfdmlzaXRvcic7XG5pbXBvcnQge2FsbG9jRXhwYW5kbywgY3JlYXRlVE5vZGVBdEluZGV4fSBmcm9tICcuLi9pbnN0cnVjdGlvbnMvc2hhcmVkJztcbmltcG9ydCB7Z2V0RG9jdW1lbnR9IGZyb20gJy4uL2ludGVyZmFjZXMvZG9jdW1lbnQnO1xuaW1wb3J0IHtFTEVNRU5UX01BUktFUiwgSTE4bkNyZWF0ZU9wQ29kZSwgSTE4bkNyZWF0ZU9wQ29kZXMsIEkxOG5SZW1vdmVPcENvZGVzLCBJMThuVXBkYXRlT3BDb2RlLCBJMThuVXBkYXRlT3BDb2RlcywgSUNVX01BUktFUiwgSWN1Q3JlYXRlT3BDb2RlLCBJY3VDcmVhdGVPcENvZGVzLCBJY3VFeHByZXNzaW9uLCBJY3VUeXBlLCBUSTE4biwgVEljdX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pMThuJztcbmltcG9ydCB7VE5vZGUsIFROb2RlVHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7U2FuaXRpemVyRm59IGZyb20gJy4uL2ludGVyZmFjZXMvc2FuaXRpemF0aW9uJztcbmltcG9ydCB7SEVBREVSX09GRlNFVCwgTFZpZXcsIFRWaWV3fSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHtnZXRDdXJyZW50UGFyZW50VE5vZGUsIGdldEN1cnJlbnRUTm9kZSwgc2V0Q3VycmVudFROb2RlfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge2F0dGFjaERlYnVnR2V0dGVyfSBmcm9tICcuLi91dGlsL2RlYnVnX3V0aWxzJztcblxuaW1wb3J0IHtpMThuQ3JlYXRlT3BDb2Rlc1RvU3RyaW5nLCBpMThuUmVtb3ZlT3BDb2Rlc1RvU3RyaW5nLCBpMThuVXBkYXRlT3BDb2Rlc1RvU3RyaW5nLCBpY3VDcmVhdGVPcENvZGVzVG9TdHJpbmd9IGZyb20gJy4vaTE4bl9kZWJ1Zyc7XG5pbXBvcnQge2FkZFROb2RlQW5kVXBkYXRlSW5zZXJ0QmVmb3JlSW5kZXh9IGZyb20gJy4vaTE4bl9pbnNlcnRfYmVmb3JlX2luZGV4JztcbmltcG9ydCB7ZW5zdXJlSWN1Q29udGFpbmVyVmlzaXRvckxvYWRlZH0gZnJvbSAnLi9pMThuX3RyZWVfc2hha2luZyc7XG5pbXBvcnQge2NyZWF0ZVROb2RlUGxhY2Vob2xkZXIsIGljdUNyZWF0ZU9wQ29kZSwgc2V0VEljdSwgc2V0VE5vZGVJbnNlcnRCZWZvcmVJbmRleH0gZnJvbSAnLi9pMThuX3V0aWwnO1xuXG5cblxuY29uc3QgQklORElOR19SRUdFWFAgPSAv77+9KFxcZCspOj9cXGQq77+9L2dpO1xuY29uc3QgSUNVX1JFR0VYUCA9IC8oe1xccyrvv71cXGQrOj9cXGQq77+9XFxzKixcXHMqXFxTezZ9XFxzKixbXFxzXFxTXSp9KS9naTtcbmNvbnN0IE5FU1RFRF9JQ1UgPSAv77+9KFxcZCsp77+9LztcbmNvbnN0IElDVV9CTE9DS19SRUdFWFAgPSAvXlxccyoo77+9XFxkKzo/XFxkKu+/vSlcXHMqLFxccyooc2VsZWN0fHBsdXJhbClcXHMqLC87XG5cbmNvbnN0IE1BUktFUiA9IGDvv71gO1xuY29uc3QgU1VCVEVNUExBVEVfUkVHRVhQID0gL++/vVxcLz9cXCooXFxkKzpcXGQrKe+/vS9naTtcbmNvbnN0IFBIX1JFR0VYUCA9IC/vv70oXFwvP1sjKl1cXGQrKTo/XFxkKu+/vS9naTtcblxuLyoqXG4gKiBBbmd1bGFyIERhcnQgaW50cm9kdWNlZCAmbmdzcDsgYXMgYSBwbGFjZWhvbGRlciBmb3Igbm9uLXJlbW92YWJsZSBzcGFjZSwgc2VlOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RhcnQtbGFuZy9hbmd1bGFyL2Jsb2IvMGJiNjExMzg3ZDI5ZDY1YjVhZjdmOWQyNTE1YWI1NzFmZDNmYmVlNC9fdGVzdHMvdGVzdC9jb21waWxlci9wcmVzZXJ2ZV93aGl0ZXNwYWNlX3Rlc3QuZGFydCNMMjUtTDMyXG4gKiBJbiBBbmd1bGFyIERhcnQgJm5nc3A7IGlzIGNvbnZlcnRlZCB0byB0aGUgMHhFNTAwIFBVQSAoUHJpdmF0ZSBVc2UgQXJlYXMpIHVuaWNvZGUgY2hhcmFjdGVyXG4gKiBhbmQgbGF0ZXIgb24gcmVwbGFjZWQgYnkgYSBzcGFjZS4gV2UgYXJlIHJlLWltcGxlbWVudGluZyB0aGUgc2FtZSBpZGVhIGhlcmUsIHNpbmNlIHRyYW5zbGF0aW9uc1xuICogbWlnaHQgY29udGFpbiB0aGlzIHNwZWNpYWwgY2hhcmFjdGVyLlxuICovXG5jb25zdCBOR1NQX1VOSUNPREVfUkVHRVhQID0gL1xcdUU1MDAvZztcbmZ1bmN0aW9uIHJlcGxhY2VOZ3NwKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShOR1NQX1VOSUNPREVfUkVHRVhQLCAnICcpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBkeW5hbWljIG5vZGVzIGZyb20gaTE4biB0cmFuc2xhdGlvbiBibG9jay5cbiAqXG4gKiAtIFRleHQgbm9kZXMgYXJlIGNyZWF0ZWQgc3luY2hyb25vdXNseVxuICogLSBUTm9kZXMgYXJlIGxpbmtlZCBpbnRvIHRyZWUgbGF6aWx5XG4gKlxuICogQHBhcmFtIHRWaWV3IEN1cnJlbnQgYFRWaWV3YFxuICogQHBhcmVudFROb2RlSW5kZXggaW5kZXggdG8gdGhlIHBhcmVudCBUTm9kZSBvZiB0aGlzIGkxOG4gYmxvY2tcbiAqIEBwYXJhbSBsVmlldyBDdXJyZW50IGBMVmlld2BcbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiBgybXJtWkxOG5TdGFydGAgaW5zdHJ1Y3Rpb24uXG4gKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIHRyYW5zbGF0ZS5cbiAqIEBwYXJhbSBzdWJUZW1wbGF0ZUluZGV4IEluZGV4IGludG8gdGhlIHN1YiB0ZW1wbGF0ZSBvZiBtZXNzYWdlIHRyYW5zbGF0aW9uLiAoaWUgaW4gY2FzZSBvZlxuICogICAgIGBuZ0lmYCkgKC0xIG90aGVyd2lzZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGkxOG5TdGFydEZpcnN0Q3JlYXRlUGFzcyhcbiAgICB0VmlldzogVFZpZXcsIHBhcmVudFROb2RlSW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3LCBpbmRleDogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcsXG4gICAgc3ViVGVtcGxhdGVJbmRleDogbnVtYmVyKSB7XG4gIGNvbnN0IHJvb3RUTm9kZSA9IGdldEN1cnJlbnRQYXJlbnRUTm9kZSgpO1xuICBjb25zdCBjcmVhdGVPcENvZGVzOiBJMThuQ3JlYXRlT3BDb2RlcyA9IFtdIGFzIGFueTtcbiAgY29uc3QgdXBkYXRlT3BDb2RlczogSTE4blVwZGF0ZU9wQ29kZXMgPSBbXSBhcyBhbnk7XG4gIGNvbnN0IGV4aXN0aW5nVE5vZGVTdGFjazogVE5vZGVbXVtdID0gW1tdXTtcbiAgaWYgKG5nRGV2TW9kZSkge1xuICAgIGF0dGFjaERlYnVnR2V0dGVyKGNyZWF0ZU9wQ29kZXMsIGkxOG5DcmVhdGVPcENvZGVzVG9TdHJpbmcpO1xuICAgIGF0dGFjaERlYnVnR2V0dGVyKHVwZGF0ZU9wQ29kZXMsIGkxOG5VcGRhdGVPcENvZGVzVG9TdHJpbmcpO1xuICB9XG5cbiAgbWVzc2FnZSA9IGdldFRyYW5zbGF0aW9uRm9yVGVtcGxhdGUobWVzc2FnZSwgc3ViVGVtcGxhdGVJbmRleCk7XG4gIGNvbnN0IG1zZ1BhcnRzID0gcmVwbGFjZU5nc3AobWVzc2FnZSkuc3BsaXQoUEhfUkVHRVhQKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc2dQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCB2YWx1ZSA9IG1zZ1BhcnRzW2ldO1xuICAgIGlmICgoaSAmIDEpID09PSAwKSB7XG4gICAgICAvLyBFdmVuIGluZGV4ZXMgYXJlIHRleHQgKGluY2x1ZGluZyBiaW5kaW5ncyAmIElDVSBleHByZXNzaW9ucylcbiAgICAgIGNvbnN0IHBhcnRzID0gaTE4blBhcnNlVGV4dEludG9QYXJ0c0FuZElDVSh2YWx1ZSk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBwYXJ0ID0gcGFydHNbal07XG4gICAgICAgIGlmICgoaiAmIDEpID09PSAwKSB7XG4gICAgICAgICAgLy8gYGpgIGlzIG9kZCB0aGVyZWZvcmUgYHBhcnRgIGlzIHN0cmluZ1xuICAgICAgICAgIGNvbnN0IHRleHQgPSBwYXJ0IGFzIHN0cmluZztcbiAgICAgICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0U3RyaW5nKHRleHQsICdQYXJzZWQgSUNVIHBhcnQgc2hvdWxkIGJlIHN0cmluZycpO1xuICAgICAgICAgIGlmICh0ZXh0ICE9PSAnJykge1xuICAgICAgICAgICAgaTE4blN0YXJ0Rmlyc3RDcmVhdGVQYXNzUHJvY2Vzc1RleHROb2RlKFxuICAgICAgICAgICAgICAgIHRWaWV3LCByb290VE5vZGUsIGV4aXN0aW5nVE5vZGVTdGFja1swXSwgY3JlYXRlT3BDb2RlcywgdXBkYXRlT3BDb2RlcywgbFZpZXcsIHRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBgamAgaXMgRXZlbiB0aGVyZWZvciBgcGFydGAgaXMgYW4gYElDVUV4cHJlc3Npb25gXG4gICAgICAgICAgY29uc3QgaWN1RXhwcmVzc2lvbjogSWN1RXhwcmVzc2lvbiA9IHBhcnQgYXMgSWN1RXhwcmVzc2lvbjtcbiAgICAgICAgICAvLyBWZXJpZnkgdGhhdCBJQ1UgZXhwcmVzc2lvbiBoYXMgdGhlIHJpZ2h0IHNoYXBlLiBUcmFuc2xhdGlvbnMgbWlnaHQgY29udGFpbiBpbnZhbGlkXG4gICAgICAgICAgLy8gY29uc3RydWN0aW9ucyAod2hpbGUgb3JpZ2luYWwgbWVzc2FnZXMgd2VyZSBjb3JyZWN0KSwgc28gSUNVIHBhcnNpbmcgYXQgcnVudGltZSBtYXlcbiAgICAgICAgICAvLyBub3Qgc3VjY2VlZCAodGh1cyBgaWN1RXhwcmVzc2lvbmAgcmVtYWlucyBhIHN0cmluZykuXG4gICAgICAgICAgLy8gTm90ZTogd2UgaW50ZW50aW9uYWxseSByZXRhaW4gdGhlIGVycm9yIGhlcmUgYnkgbm90IHVzaW5nIGBuZ0Rldk1vZGVgLCBiZWNhdXNlXG4gICAgICAgICAgLy8gdGhlIHZhbHVlIGNhbiBjaGFuZ2UgYmFzZWQgb24gdGhlIGxvY2FsZSBhbmQgdXNlcnMgYXJlbid0IGd1YXJhbnRlZWQgdG8gaGl0XG4gICAgICAgICAgLy8gYW4gaW52YWxpZCBzdHJpbmcgd2hpbGUgdGhleSdyZSBkZXZlbG9waW5nLlxuICAgICAgICAgIGlmICh0eXBlb2YgaWN1RXhwcmVzc2lvbiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHBhcnNlIElDVSBleHByZXNzaW9uIGluIFwiJHttZXNzYWdlfVwiIG1lc3NhZ2UuYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGljdUNvbnRhaW5lclROb2RlID0gY3JlYXRlVE5vZGVBbmRBZGRPcENvZGUoXG4gICAgICAgICAgICAgIHRWaWV3LCByb290VE5vZGUsIGV4aXN0aW5nVE5vZGVTdGFja1swXSwgbFZpZXcsIGNyZWF0ZU9wQ29kZXMsXG4gICAgICAgICAgICAgIG5nRGV2TW9kZSA/IGBJQ1UgJHtpbmRleH06JHtpY3VFeHByZXNzaW9uLm1haW5CaW5kaW5nfWAgOiAnJywgdHJ1ZSk7XG4gICAgICAgICAgY29uc3QgaWN1Tm9kZUluZGV4ID0gaWN1Q29udGFpbmVyVE5vZGUuaW5kZXg7XG4gICAgICAgICAgbmdEZXZNb2RlICYmXG4gICAgICAgICAgICAgIGFzc2VydEdyZWF0ZXJUaGFuT3JFcXVhbChcbiAgICAgICAgICAgICAgICAgIGljdU5vZGVJbmRleCwgSEVBREVSX09GRlNFVCwgJ0luZGV4IG11c3QgYmUgaW4gYWJzb2x1dGUgTFZpZXcgb2Zmc2V0Jyk7XG4gICAgICAgICAgaWN1U3RhcnQodFZpZXcsIGxWaWV3LCB1cGRhdGVPcENvZGVzLCBwYXJlbnRUTm9kZUluZGV4LCBpY3VFeHByZXNzaW9uLCBpY3VOb2RlSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE9kZCBpbmRleGVzIGFyZSBwbGFjZWhvbGRlcnMgKGVsZW1lbnRzIGFuZCBzdWItdGVtcGxhdGVzKVxuICAgICAgLy8gQXQgdGhpcyBwb2ludCB2YWx1ZSBpcyBzb21ldGhpbmcgbGlrZTogJy8jMToyJyAob3JpZ2luYWxseSBjb21pbmcgZnJvbSAn77+9LyMxOjLvv70nKVxuICAgICAgY29uc3QgaXNDbG9zaW5nID0gdmFsdWUuY2hhckNvZGVBdCgwKSA9PT0gQ2hhckNvZGUuU0xBU0g7XG4gICAgICBjb25zdCB0eXBlID0gdmFsdWUuY2hhckNvZGVBdChpc0Nsb3NpbmcgPyAxIDogMCk7XG4gICAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0T25lT2YodHlwZSwgQ2hhckNvZGUuU1RBUiwgQ2hhckNvZGUuSEFTSCk7XG4gICAgICBjb25zdCBpbmRleCA9IEhFQURFUl9PRkZTRVQgKyBOdW1iZXIucGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKChpc0Nsb3NpbmcgPyAyIDogMSkpKTtcbiAgICAgIGlmIChpc0Nsb3NpbmcpIHtcbiAgICAgICAgZXhpc3RpbmdUTm9kZVN0YWNrLnNoaWZ0KCk7XG4gICAgICAgIHNldEN1cnJlbnRUTm9kZShnZXRDdXJyZW50UGFyZW50VE5vZGUoKSEsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHROb2RlID0gY3JlYXRlVE5vZGVQbGFjZWhvbGRlcih0VmlldywgZXhpc3RpbmdUTm9kZVN0YWNrWzBdLCBpbmRleCk7XG4gICAgICAgIGV4aXN0aW5nVE5vZGVTdGFjay51bnNoaWZ0KFtdKTtcbiAgICAgICAgc2V0Q3VycmVudFROb2RlKHROb2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0Vmlldy5kYXRhW2luZGV4XSA9IDxUSTE4bj57XG4gICAgY3JlYXRlOiBjcmVhdGVPcENvZGVzLFxuICAgIHVwZGF0ZTogdXBkYXRlT3BDb2RlcyxcbiAgfTtcbn1cblxuLyoqXG4gKiBBbGxvY2F0ZSBzcGFjZSBpbiBpMThuIFJhbmdlIGFkZCBjcmVhdGUgT3BDb2RlIGluc3RydWN0aW9uIHRvIGNyZWF0ZSBhIHRleHQgb3IgY29tbWVudCBub2RlLlxuICpcbiAqIEBwYXJhbSB0VmlldyBDdXJyZW50IGBUVmlld2AgbmVlZGVkIHRvIGFsbG9jYXRlIHNwYWNlIGluIGkxOG4gcmFuZ2UuXG4gKiBAcGFyYW0gcm9vdFROb2RlIFJvb3QgYFROb2RlYCBvZiB0aGUgaTE4biBibG9jay4gVGhpcyBub2RlIGRldGVybWluZXMgaWYgdGhlIG5ldyBUTm9kZSB3aWxsIGJlXG4gKiAgICAgYWRkZWQgYXMgcGFydCBvZiB0aGUgYGkxOG5TdGFydGAgaW5zdHJ1Y3Rpb24gb3IgYXMgcGFydCBvZiB0aGUgYFROb2RlLmluc2VydEJlZm9yZUluZGV4YC5cbiAqIEBwYXJhbSBleGlzdGluZ1ROb2RlcyBpbnRlcm5hbCBzdGF0ZSBmb3IgYGFkZFROb2RlQW5kVXBkYXRlSW5zZXJ0QmVmb3JlSW5kZXhgLlxuICogQHBhcmFtIGxWaWV3IEN1cnJlbnQgYExWaWV3YCBuZWVkZWQgdG8gYWxsb2NhdGUgc3BhY2UgaW4gaTE4biByYW5nZS5cbiAqIEBwYXJhbSBjcmVhdGVPcENvZGVzIEFycmF5IHN0b3JpbmcgYEkxOG5DcmVhdGVPcENvZGVzYCB3aGVyZSBuZXcgb3BDb2RlcyB3aWxsIGJlIGFkZGVkLlxuICogQHBhcmFtIHRleHQgVGV4dCB0byBiZSBhZGRlZCB3aGVuIHRoZSBgVGV4dGAgb3IgYENvbW1lbnRgIG5vZGUgd2lsbCBiZSBjcmVhdGVkLlxuICogQHBhcmFtIGlzSUNVIHRydWUgaWYgYSBgQ29tbWVudGAgbm9kZSBmb3IgSUNVIChpbnN0ZWFkIG9mIGBUZXh0YCkgbm9kZSBzaG91bGQgYmUgY3JlYXRlZC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVE5vZGVBbmRBZGRPcENvZGUoXG4gICAgdFZpZXc6IFRWaWV3LCByb290VE5vZGU6IFROb2RlfG51bGwsIGV4aXN0aW5nVE5vZGVzOiBUTm9kZVtdLCBsVmlldzogTFZpZXcsXG4gICAgY3JlYXRlT3BDb2RlczogSTE4bkNyZWF0ZU9wQ29kZXMsIHRleHQ6IHN0cmluZ3xudWxsLCBpc0lDVTogYm9vbGVhbik6IFROb2RlIHtcbiAgY29uc3QgaTE4bk5vZGVJZHggPSBhbGxvY0V4cGFuZG8odFZpZXcsIGxWaWV3LCAxLCBudWxsKTtcbiAgbGV0IG9wQ29kZSA9IGkxOG5Ob2RlSWR4IDw8IEkxOG5DcmVhdGVPcENvZGUuU0hJRlQ7XG4gIGxldCBwYXJlbnRUTm9kZSA9IGdldEN1cnJlbnRQYXJlbnRUTm9kZSgpO1xuXG4gIGlmIChyb290VE5vZGUgPT09IHBhcmVudFROb2RlKSB7XG4gICAgLy8gRklYTUUobWlza28pOiBBIG51bGwgYHBhcmVudFROb2RlYCBzaG91bGQgcmVwcmVzZW50IHdoZW4gd2UgZmFsbCBvZiB0aGUgYExWaWV3YCBib3VuZGFyeS5cbiAgICAvLyAodGhlcmUgaXMgbm8gcGFyZW50KSwgYnV0IGluIHNvbWUgY2lyY3Vtc3RhbmNlcyAoYmVjYXVzZSB3ZSBhcmUgaW5jb25zaXN0ZW50IGFib3V0IGhvdyB3ZSBzZXRcbiAgICAvLyBgcHJldmlvdXNPclBhcmVudFROb2RlYCkgaXQgY291bGQgcG9pbnQgdG8gYHJvb3RUTm9kZWAgU28gdGhpcyBpcyBhIHdvcmsgYXJvdW5kLlxuICAgIHBhcmVudFROb2RlID0gbnVsbDtcbiAgfVxuICBpZiAocGFyZW50VE5vZGUgPT09IG51bGwpIHtcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFyZW50IHRoYXQgbWVhbnMgdGhhdCB3ZSBjYW4gZWFnZXJseSBhZGQgbm9kZXMuXG4gICAgLy8gSWYgd2UgaGF2ZSBhIHBhcmVudCB0aGFuIHRoZXNlIG5vZGVzIGNhbid0IGJlIGFkZGVkIG5vdyAoYXMgdGhlIHBhcmVudCBoYXMgbm90IGJlZW4gY3JlYXRlZFxuICAgIC8vIHlldCkgYW5kIGluc3RlYWQgdGhlIGBwYXJlbnRUTm9kZWAgaXMgcmVzcG9uc2libGUgZm9yIGFkZGluZyBpdC4gU2VlXG4gICAgLy8gYFROb2RlLmluc2VydEJlZm9yZUluZGV4YFxuICAgIG9wQ29kZSB8PSBJMThuQ3JlYXRlT3BDb2RlLkFQUEVORF9FQUdFUkxZO1xuICB9XG4gIGlmIChpc0lDVSkge1xuICAgIG9wQ29kZSB8PSBJMThuQ3JlYXRlT3BDb2RlLkNPTU1FTlQ7XG4gICAgZW5zdXJlSWN1Q29udGFpbmVyVmlzaXRvckxvYWRlZChsb2FkSWN1Q29udGFpbmVyVmlzaXRvcik7XG4gIH1cbiAgY3JlYXRlT3BDb2Rlcy5wdXNoKG9wQ29kZSwgdGV4dCA9PT0gbnVsbCA/ICcnIDogdGV4dCk7XG4gIC8vIFdlIHN0b3JlIGB7ez99fWAgc28gdGhhdCB3aGVuIGxvb2tpbmcgYXQgZGVidWcgYFROb2RlVHlwZS50ZW1wbGF0ZWAgd2UgY2FuIHNlZSB3aGVyZSB0aGVcbiAgLy8gYmluZGluZ3MgYXJlLlxuICBjb25zdCB0Tm9kZSA9IGNyZWF0ZVROb2RlQXRJbmRleChcbiAgICAgIHRWaWV3LCBpMThuTm9kZUlkeCwgaXNJQ1UgPyBUTm9kZVR5cGUuSWN1IDogVE5vZGVUeXBlLlRleHQsXG4gICAgICB0ZXh0ID09PSBudWxsID8gKG5nRGV2TW9kZSA/ICd7ez99fScgOiAnJykgOiB0ZXh0LCBudWxsKTtcbiAgYWRkVE5vZGVBbmRVcGRhdGVJbnNlcnRCZWZvcmVJbmRleChleGlzdGluZ1ROb2RlcywgdE5vZGUpO1xuICBjb25zdCB0Tm9kZUlkeCA9IHROb2RlLmluZGV4O1xuICBzZXRDdXJyZW50VE5vZGUodE5vZGUsIGZhbHNlIC8qIFRleHQgbm9kZXMgYXJlIHNlbGYgY2xvc2luZyAqLyk7XG4gIGlmIChwYXJlbnRUTm9kZSAhPT0gbnVsbCAmJiByb290VE5vZGUgIT09IHBhcmVudFROb2RlKSB7XG4gICAgLy8gV2UgYXJlIGEgY2hpbGQgb2YgZGVlcGVyIG5vZGUgKHJhdGhlciB0aGFuIGEgZGlyZWN0IGNoaWxkIG9mIGBpMThuU3RhcnRgIGluc3RydWN0aW9uLilcbiAgICAvLyBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0byBhZGQgb3Vyc2VsdmVzIHRvIHRoZSBwYXJlbnQuXG4gICAgc2V0VE5vZGVJbnNlcnRCZWZvcmVJbmRleChwYXJlbnRUTm9kZSwgdE5vZGVJZHgpO1xuICB9XG4gIHJldHVybiB0Tm9kZTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzZXMgdGV4dCBub2RlIGluIGkxOG4gYmxvY2suXG4gKlxuICogVGV4dCBub2RlcyBjYW4gaGF2ZTpcbiAqIC0gQ3JlYXRlIGluc3RydWN0aW9uIGluIGBjcmVhdGVPcENvZGVzYCBmb3IgY3JlYXRpbmcgdGhlIHRleHQgbm9kZS5cbiAqIC0gQWxsb2NhdGUgc3BlYyBmb3IgdGV4dCBub2RlIGluIGkxOG4gcmFuZ2Ugb2YgYExWaWV3YFxuICogLSBJZiBjb250YWlucyBiaW5kaW5nOlxuICogICAgLSBiaW5kaW5ncyA9PiBhbGxvY2F0ZSBzcGFjZSBpbiBpMThuIHJhbmdlIG9mIGBMVmlld2AgdG8gc3RvcmUgdGhlIGJpbmRpbmcgdmFsdWUuXG4gKiAgICAtIHBvcHVsYXRlIGB1cGRhdGVPcENvZGVzYCB3aXRoIHVwZGF0ZSBpbnN0cnVjdGlvbnMuXG4gKlxuICogQHBhcmFtIHRWaWV3IEN1cnJlbnQgYFRWaWV3YFxuICogQHBhcmFtIHJvb3RUTm9kZSBSb290IGBUTm9kZWAgb2YgdGhlIGkxOG4gYmxvY2suIFRoaXMgbm9kZSBkZXRlcm1pbmVzIGlmIHRoZSBuZXcgVE5vZGUgd2lsbFxuICogICAgIGJlIGFkZGVkIGFzIHBhcnQgb2YgdGhlIGBpMThuU3RhcnRgIGluc3RydWN0aW9uIG9yIGFzIHBhcnQgb2YgdGhlXG4gKiAgICAgYFROb2RlLmluc2VydEJlZm9yZUluZGV4YC5cbiAqIEBwYXJhbSBleGlzdGluZ1ROb2RlcyBpbnRlcm5hbCBzdGF0ZSBmb3IgYGFkZFROb2RlQW5kVXBkYXRlSW5zZXJ0QmVmb3JlSW5kZXhgLlxuICogQHBhcmFtIGNyZWF0ZU9wQ29kZXMgTG9jYXRpb24gd2hlcmUgdGhlIGNyZWF0aW9uIE9wQ29kZXMgd2lsbCBiZSBzdG9yZWQuXG4gKiBAcGFyYW0gbFZpZXcgQ3VycmVudCBgTFZpZXdgXG4gKiBAcGFyYW0gdGV4dCBUaGUgdHJhbnNsYXRlZCB0ZXh0ICh3aGljaCBtYXkgY29udGFpbiBiaW5kaW5nKVxuICovXG5mdW5jdGlvbiBpMThuU3RhcnRGaXJzdENyZWF0ZVBhc3NQcm9jZXNzVGV4dE5vZGUoXG4gICAgdFZpZXc6IFRWaWV3LCByb290VE5vZGU6IFROb2RlfG51bGwsIGV4aXN0aW5nVE5vZGVzOiBUTm9kZVtdLCBjcmVhdGVPcENvZGVzOiBJMThuQ3JlYXRlT3BDb2RlcyxcbiAgICB1cGRhdGVPcENvZGVzOiBJMThuVXBkYXRlT3BDb2RlcywgbFZpZXc6IExWaWV3LCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgaGFzQmluZGluZyA9IHRleHQubWF0Y2goQklORElOR19SRUdFWFApO1xuICBjb25zdCB0Tm9kZSA9IGNyZWF0ZVROb2RlQW5kQWRkT3BDb2RlKFxuICAgICAgdFZpZXcsIHJvb3RUTm9kZSwgZXhpc3RpbmdUTm9kZXMsIGxWaWV3LCBjcmVhdGVPcENvZGVzLCBoYXNCaW5kaW5nID8gbnVsbCA6IHRleHQsIGZhbHNlKTtcbiAgaWYgKGhhc0JpbmRpbmcpIHtcbiAgICBnZW5lcmF0ZUJpbmRpbmdVcGRhdGVPcENvZGVzKHVwZGF0ZU9wQ29kZXMsIHRleHQsIHROb2RlLmluZGV4LCBudWxsLCAwLCBudWxsKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlZSBgaTE4bkF0dHJpYnV0ZXNgIGFib3ZlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaTE4bkF0dHJpYnV0ZXNGaXJzdFBhc3ModFZpZXc6IFRWaWV3LCBpbmRleDogbnVtYmVyLCB2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHByZXZpb3VzRWxlbWVudCA9IGdldEN1cnJlbnRUTm9kZSgpITtcbiAgY29uc3QgcHJldmlvdXNFbGVtZW50SW5kZXggPSBwcmV2aW91c0VsZW1lbnQuaW5kZXg7XG4gIGNvbnN0IHVwZGF0ZU9wQ29kZXM6IEkxOG5VcGRhdGVPcENvZGVzID0gW10gYXMgYW55O1xuICBpZiAobmdEZXZNb2RlKSB7XG4gICAgYXR0YWNoRGVidWdHZXR0ZXIodXBkYXRlT3BDb2RlcywgaTE4blVwZGF0ZU9wQ29kZXNUb1N0cmluZyk7XG4gIH1cbiAgaWYgKHRWaWV3LmZpcnN0Q3JlYXRlUGFzcyAmJiB0Vmlldy5kYXRhW2luZGV4XSA9PT0gbnVsbCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IHZhbHVlc1tpXTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB2YWx1ZXNbaSArIDFdO1xuXG4gICAgICBpZiAobWVzc2FnZSAhPT0gJycpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgYXR0cmlidXRlIHZhbHVlIGNvbnRhaW5zIGFuIElDVSBhbmQgdGhyb3cgYW4gZXJyb3IgaWYgdGhhdCdzIHRoZSBjYXNlLlxuICAgICAgICAvLyBJQ1VzIGluIGVsZW1lbnQgYXR0cmlidXRlcyBhcmUgbm90IHN1cHBvcnRlZC5cbiAgICAgICAgLy8gTm90ZTogd2UgaW50ZW50aW9uYWxseSByZXRhaW4gdGhlIGVycm9yIGhlcmUgYnkgbm90IHVzaW5nIGBuZ0Rldk1vZGVgLCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBgdmFsdWVgIGNhbiBjaGFuZ2UgYmFzZWQgb24gdGhlIGxvY2FsZSBhbmQgdXNlcnMgYXJlbid0IGd1YXJhbnRlZWQgdG8gaGl0XG4gICAgICAgIC8vIGFuIGludmFsaWQgc3RyaW5nIHdoaWxlIHRoZXkncmUgZGV2ZWxvcGluZy5cbiAgICAgICAgaWYgKElDVV9SRUdFWFAudGVzdChtZXNzYWdlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYElDVSBleHByZXNzaW9ucyBhcmUgbm90IHN1cHBvcnRlZCBpbiBhdHRyaWJ1dGVzLiBNZXNzYWdlOiBcIiR7bWVzc2FnZX1cIi5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGkxOG4gYXR0cmlidXRlcyB0aGF0IGhpdCB0aGlzIGNvZGUgcGF0aCBhcmUgZ3VhcmFudGVlZCB0byBoYXZlIGJpbmRpbmdzLCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBjb21waWxlciB0cmVhdHMgc3RhdGljIGkxOG4gYXR0cmlidXRlcyBhcyByZWd1bGFyIGF0dHJpYnV0ZSBiaW5kaW5ncy5cbiAgICAgICAgLy8gU2luY2UgdGhpcyBtYXkgbm90IGJlIHRoZSBmaXJzdCBpMThuIGF0dHJpYnV0ZSBvbiB0aGlzIGVsZW1lbnQgd2UgbmVlZCB0byBwYXNzIGluIGhvd1xuICAgICAgICAvLyBtYW55IHByZXZpb3VzIGJpbmRpbmdzIHRoZXJlIGhhdmUgYWxyZWFkeSBiZWVuLlxuICAgICAgICBnZW5lcmF0ZUJpbmRpbmdVcGRhdGVPcENvZGVzKFxuICAgICAgICAgICAgdXBkYXRlT3BDb2RlcywgbWVzc2FnZSwgcHJldmlvdXNFbGVtZW50SW5kZXgsIGF0dHJOYW1lLCBjb3VudEJpbmRpbmdzKHVwZGF0ZU9wQ29kZXMpLFxuICAgICAgICAgICAgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRWaWV3LmRhdGFbaW5kZXhdID0gdXBkYXRlT3BDb2RlcztcbiAgfVxufVxuXG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIE9wQ29kZXMgdG8gdXBkYXRlIHRoZSBiaW5kaW5ncyBvZiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gdXBkYXRlT3BDb2RlcyBQbGFjZSB3aGVyZSB0aGUgdXBkYXRlIG9wY29kZXMgd2lsbCBiZSBzdG9yZWQuXG4gKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgY29udGFpbmluZyB0aGUgYmluZGluZ3MuXG4gKiBAcGFyYW0gZGVzdGluYXRpb25Ob2RlIEluZGV4IG9mIHRoZSBkZXN0aW5hdGlvbiBub2RlIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgYmluZGluZy5cbiAqIEBwYXJhbSBhdHRyTmFtZSBOYW1lIG9mIHRoZSBhdHRyaWJ1dGUsIGlmIHRoZSBzdHJpbmcgYmVsb25ncyB0byBhbiBhdHRyaWJ1dGUuXG4gKiBAcGFyYW0gc2FuaXRpemVGbiBTYW5pdGl6YXRpb24gZnVuY3Rpb24gdXNlZCB0byBzYW5pdGl6ZSB0aGUgc3RyaW5nIGFmdGVyIHVwZGF0ZSwgaWYgbmVjZXNzYXJ5LlxuICogQHBhcmFtIGJpbmRpbmdTdGFydCBUaGUgbFZpZXcgaW5kZXggb2YgdGhlIG5leHQgZXhwcmVzc2lvbiB0aGF0IGNhbiBiZSBib3VuZCB2aWEgYW4gb3BDb2RlLlxuICogQHJldHVybnMgVGhlIG1hc2sgdmFsdWUgZm9yIHRoZXNlIGJpbmRpbmdzXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlQmluZGluZ1VwZGF0ZU9wQ29kZXMoXG4gICAgdXBkYXRlT3BDb2RlczogSTE4blVwZGF0ZU9wQ29kZXMsIHN0cjogc3RyaW5nLCBkZXN0aW5hdGlvbk5vZGU6IG51bWJlciwgYXR0ck5hbWU6IHN0cmluZ3xudWxsLFxuICAgIGJpbmRpbmdTdGFydDogbnVtYmVyLCBzYW5pdGl6ZUZuOiBTYW5pdGl6ZXJGbnxudWxsKTogbnVtYmVyIHtcbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRHcmVhdGVyVGhhbk9yRXF1YWwoXG4gICAgICAgICAgZGVzdGluYXRpb25Ob2RlLCBIRUFERVJfT0ZGU0VULCAnSW5kZXggbXVzdCBiZSBpbiBhYnNvbHV0ZSBMVmlldyBvZmZzZXQnKTtcbiAgY29uc3QgbWFza0luZGV4ID0gdXBkYXRlT3BDb2Rlcy5sZW5ndGg7ICAvLyBMb2NhdGlvbiBvZiBtYXNrXG4gIGNvbnN0IHNpemVJbmRleCA9IG1hc2tJbmRleCArIDE7ICAgICAgICAgLy8gbG9jYXRpb24gb2Ygc2l6ZSBmb3Igc2tpcHBpbmdcbiAgdXBkYXRlT3BDb2Rlcy5wdXNoKG51bGwsIG51bGwpOyAgICAgICAgICAvLyBBbGxvYyBzcGFjZSBmb3IgbWFzayBhbmQgc2l6ZVxuICBjb25zdCBzdGFydEluZGV4ID0gbWFza0luZGV4ICsgMjsgICAgICAgIC8vIGxvY2F0aW9uIG9mIGZpcnN0IGFsbG9jYXRpb24uXG4gIGlmIChuZ0Rldk1vZGUpIHtcbiAgICBhdHRhY2hEZWJ1Z0dldHRlcih1cGRhdGVPcENvZGVzLCBpMThuVXBkYXRlT3BDb2Rlc1RvU3RyaW5nKTtcbiAgfVxuICBjb25zdCB0ZXh0UGFydHMgPSBzdHIuc3BsaXQoQklORElOR19SRUdFWFApO1xuICBsZXQgbWFzayA9IDA7XG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZXh0UGFydHMubGVuZ3RoOyBqKyspIHtcbiAgICBjb25zdCB0ZXh0VmFsdWUgPSB0ZXh0UGFydHNbal07XG5cbiAgICBpZiAoaiAmIDEpIHtcbiAgICAgIC8vIE9kZCBpbmRleGVzIGFyZSBiaW5kaW5nc1xuICAgICAgY29uc3QgYmluZGluZ0luZGV4ID0gYmluZGluZ1N0YXJ0ICsgcGFyc2VJbnQodGV4dFZhbHVlLCAxMCk7XG4gICAgICB1cGRhdGVPcENvZGVzLnB1c2goLTEgLSBiaW5kaW5nSW5kZXgpO1xuICAgICAgbWFzayA9IG1hc2sgfCB0b01hc2tCaXQoYmluZGluZ0luZGV4KTtcbiAgICB9IGVsc2UgaWYgKHRleHRWYWx1ZSAhPT0gJycpIHtcbiAgICAgIC8vIEV2ZW4gaW5kZXhlcyBhcmUgdGV4dFxuICAgICAgdXBkYXRlT3BDb2Rlcy5wdXNoKHRleHRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT3BDb2Rlcy5wdXNoKFxuICAgICAgZGVzdGluYXRpb25Ob2RlIDw8IEkxOG5VcGRhdGVPcENvZGUuU0hJRlRfUkVGIHxcbiAgICAgIChhdHRyTmFtZSA/IEkxOG5VcGRhdGVPcENvZGUuQXR0ciA6IEkxOG5VcGRhdGVPcENvZGUuVGV4dCkpO1xuICBpZiAoYXR0ck5hbWUpIHtcbiAgICB1cGRhdGVPcENvZGVzLnB1c2goYXR0ck5hbWUsIHNhbml0aXplRm4pO1xuICB9XG4gIHVwZGF0ZU9wQ29kZXNbbWFza0luZGV4XSA9IG1hc2s7XG4gIHVwZGF0ZU9wQ29kZXNbc2l6ZUluZGV4XSA9IHVwZGF0ZU9wQ29kZXMubGVuZ3RoIC0gc3RhcnRJbmRleDtcbiAgcmV0dXJuIG1hc2s7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBiaW5kaW5ncyBpbiB0aGUgZ2l2ZW4gYG9wQ29kZXNgLlxuICpcbiAqIEl0IGNvdWxkIGJlIHBvc3NpYmxlIHRvIHNwZWVkIHRoaXMgdXAsIGJ5IHBhc3NpbmcgdGhlIG51bWJlciBvZiBiaW5kaW5ncyBmb3VuZCBiYWNrIGZyb21cbiAqIGBnZW5lcmF0ZUJpbmRpbmdVcGRhdGVPcENvZGVzKClgIHRvIGBpMThuQXR0cmlidXRlc0ZpcnN0UGFzcygpYCBidXQgdGhpcyB3b3VsZCB0aGVuIHJlcXVpcmUgbW9yZVxuICogY29tcGxleGl0eSBpbiB0aGUgY29kZSBhbmQvb3IgdHJhbnNpZW50IG9iamVjdHMgdG8gYmUgY3JlYXRlZC5cbiAqXG4gKiBTaW5jZSB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIG9uY2Ugd2hlbiB0aGUgdGVtcGxhdGUgaXMgaW5zdGFudGlhdGVkLCBpcyB0cml2aWFsIGluIHRoZVxuICogZmlyc3QgaW5zdGFuY2UgKHNpbmNlIGBvcENvZGVzYCB3aWxsIGJlIGFuIGVtcHR5IGFycmF5KSwgYW5kIGl0IGlzIG5vdCBjb21tb24gZm9yIGVsZW1lbnRzIHRvXG4gKiBjb250YWluIG11bHRpcGxlIGkxOG4gYm91bmQgYXR0cmlidXRlcywgaXQgc2VlbXMgbGlrZSB0aGlzIGlzIGEgcmVhc29uYWJsZSBjb21wcm9taXNlLlxuICovXG5mdW5jdGlvbiBjb3VudEJpbmRpbmdzKG9wQ29kZXM6IEkxOG5VcGRhdGVPcENvZGVzKTogbnVtYmVyIHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcENvZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgb3BDb2RlID0gb3BDb2Rlc1tpXTtcbiAgICAvLyBCaW5kaW5ncyBhcmUgbmVnYXRpdmUgbnVtYmVycy5cbiAgICBpZiAodHlwZW9mIG9wQ29kZSA9PT0gJ251bWJlcicgJiYgb3BDb2RlIDwgMCkge1xuICAgICAgY291bnQrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufVxuXG4vKipcbiAqIENvbnZlcnQgYmluZGluZyBpbmRleCB0byBtYXNrIGJpdC5cbiAqXG4gKiBFYWNoIGluZGV4IHJlcHJlc2VudHMgYSBzaW5nbGUgYml0IG9uIHRoZSBiaXQtbWFzay4gQmVjYXVzZSBiaXQtbWFzayBvbmx5IGhhcyAzMiBiaXRzLCB3ZSBtYWtlXG4gKiB0aGUgMzJuZCBiaXQgc2hhcmUgYWxsIG1hc2tzIGZvciBhbGwgYmluZGluZ3MgaGlnaGVyIHRoYW4gMzIuIFNpbmNlIGl0IGlzIGV4dHJlbWVseSByYXJlIHRvXG4gKiBoYXZlIG1vcmUgdGhhbiAzMiBiaW5kaW5ncyB0aGlzIHdpbGwgYmUgaGl0IHZlcnkgcmFyZWx5LiBUaGUgZG93bnNpZGUgb2YgaGl0dGluZyB0aGlzIGNvcm5lclxuICogY2FzZSBpcyB0aGF0IHdlIHdpbGwgZXhlY3V0ZSBiaW5kaW5nIGNvZGUgbW9yZSBvZnRlbiB0aGFuIG5lY2Vzc2FyeS4gKHBlbmFsdHkgb2YgcGVyZm9ybWFuY2UpXG4gKi9cbmZ1bmN0aW9uIHRvTWFza0JpdChiaW5kaW5nSW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiAxIDw8IE1hdGgubWluKGJpbmRpbmdJbmRleCwgMzEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSb290VGVtcGxhdGVNZXNzYWdlKHN1YlRlbXBsYXRlSW5kZXg6IG51bWJlcik6IHN1YlRlbXBsYXRlSW5kZXggaXMgLSAxIHtcbiAgcmV0dXJuIHN1YlRlbXBsYXRlSW5kZXggPT09IC0xO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlcyBldmVyeXRoaW5nIGluc2lkZSB0aGUgc3ViLXRlbXBsYXRlcyBvZiBhIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUlubmVyVGVtcGxhdGVUcmFuc2xhdGlvbihtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgbWF0Y2g7XG4gIGxldCByZXMgPSAnJztcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGluVGVtcGxhdGUgPSBmYWxzZTtcbiAgbGV0IHRhZ01hdGNoZWQ7XG5cbiAgd2hpbGUgKChtYXRjaCA9IFNVQlRFTVBMQVRFX1JFR0VYUC5leGVjKG1lc3NhZ2UpKSAhPT0gbnVsbCkge1xuICAgIGlmICghaW5UZW1wbGF0ZSkge1xuICAgICAgcmVzICs9IG1lc3NhZ2Uuc3Vic3RyaW5nKGluZGV4LCBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICB0YWdNYXRjaGVkID0gbWF0Y2hbMV07XG4gICAgICBpblRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1hdGNoWzBdID09PSBgJHtNQVJLRVJ9Lyoke3RhZ01hdGNoZWR9JHtNQVJLRVJ9YCkge1xuICAgICAgICBpbmRleCA9IG1hdGNoLmluZGV4O1xuICAgICAgICBpblRlbXBsYXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRFcXVhbChcbiAgICAgICAgICBpblRlbXBsYXRlLCBmYWxzZSxcbiAgICAgICAgICBgVGFnIG1pc21hdGNoOiB1bmFibGUgdG8gZmluZCB0aGUgZW5kIG9mIHRoZSBzdWItdGVtcGxhdGUgaW4gdGhlIHRyYW5zbGF0aW9uIFwiJHtcbiAgICAgICAgICAgICAgbWVzc2FnZX1cImApO1xuXG4gIHJlcyArPSBtZXNzYWdlLnN1YnN0cihpbmRleCk7XG4gIHJldHVybiByZXM7XG59XG5cblxuLyoqXG4gKiBFeHRyYWN0cyBhIHBhcnQgb2YgYSBtZXNzYWdlIGFuZCByZW1vdmVzIHRoZSByZXN0LlxuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgZm9yIGV4dHJhY3RpbmcgYSBwYXJ0IG9mIHRoZSBtZXNzYWdlIGFzc29jaWF0ZWQgd2l0aCBhIHRlbXBsYXRlLiBBXG4gKiB0cmFuc2xhdGVkIG1lc3NhZ2UgY2FuIHNwYW4gbXVsdGlwbGUgdGVtcGxhdGVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqIDxkaXYgaTE4bj5UcmFuc2xhdGUgPHNwYW4gKm5nSWY+bWU8L3NwYW4+ITwvZGl2PlxuICogYGBgXG4gKlxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gY3JvcFxuICogQHBhcmFtIHN1YlRlbXBsYXRlSW5kZXggSW5kZXggb2YgdGhlIHN1Yi10ZW1wbGF0ZSB0byBleHRyYWN0LiBJZiB1bmRlZmluZWQgaXQgcmV0dXJucyB0aGVcbiAqIGV4dGVybmFsIHRlbXBsYXRlIGFuZCByZW1vdmVzIGFsbCBzdWItdGVtcGxhdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb25Gb3JUZW1wbGF0ZShtZXNzYWdlOiBzdHJpbmcsIHN1YlRlbXBsYXRlSW5kZXg6IG51bWJlcikge1xuICBpZiAoaXNSb290VGVtcGxhdGVNZXNzYWdlKHN1YlRlbXBsYXRlSW5kZXgpKSB7XG4gICAgLy8gV2Ugd2FudCB0aGUgcm9vdCB0ZW1wbGF0ZSBtZXNzYWdlLCBpZ25vcmUgYWxsIHN1Yi10ZW1wbGF0ZXNcbiAgICByZXR1cm4gcmVtb3ZlSW5uZXJUZW1wbGF0ZVRyYW5zbGF0aW9uKG1lc3NhZ2UpO1xuICB9IGVsc2Uge1xuICAgIC8vIFdlIHdhbnQgYSBzcGVjaWZpYyBzdWItdGVtcGxhdGVcbiAgICBjb25zdCBzdGFydCA9XG4gICAgICAgIG1lc3NhZ2UuaW5kZXhPZihgOiR7c3ViVGVtcGxhdGVJbmRleH0ke01BUktFUn1gKSArIDIgKyBzdWJUZW1wbGF0ZUluZGV4LnRvU3RyaW5nKCkubGVuZ3RoO1xuICAgIGNvbnN0IGVuZCA9IG1lc3NhZ2Uuc2VhcmNoKG5ldyBSZWdFeHAoYCR7TUFSS0VSfVxcXFwvXFxcXCpcXFxcZCs6JHtzdWJUZW1wbGF0ZUluZGV4fSR7TUFSS0VSfWApKTtcbiAgICByZXR1cm4gcmVtb3ZlSW5uZXJUZW1wbGF0ZVRyYW5zbGF0aW9uKG1lc3NhZ2Uuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpKTtcbiAgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBPcENvZGVzIGZvciBJQ1UgZXhwcmVzc2lvbnMuXG4gKlxuICogQHBhcmFtIGljdUV4cHJlc3Npb25cbiAqIEBwYXJhbSBpbmRleCBJbmRleCB3aGVyZSB0aGUgYW5jaG9yIGlzIHN0b3JlZCBhbmQgYW4gb3B0aW9uYWwgYFRJY3VDb250YWluZXJOb2RlYFxuICogICAtIGBsVmlld1thbmNob3JJZHhdYCBwb2ludHMgdG8gYSBgQ29tbWVudGAgbm9kZSByZXByZXNlbnRpbmcgdGhlIGFuY2hvciBmb3IgdGhlIElDVS5cbiAqICAgLSBgdFZpZXcuZGF0YVthbmNob3JJZHhdYCBwb2ludHMgdG8gdGhlIGBUSWN1Q29udGFpbmVyTm9kZWAgaWYgSUNVIGlzIHJvb3QgKGBudWxsYCBvdGhlcndpc2UpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpY3VTdGFydChcbiAgICB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgdXBkYXRlT3BDb2RlczogSTE4blVwZGF0ZU9wQ29kZXMsIHBhcmVudElkeDogbnVtYmVyLFxuICAgIGljdUV4cHJlc3Npb246IEljdUV4cHJlc3Npb24sIGFuY2hvcklkeDogbnVtYmVyKSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGljdUV4cHJlc3Npb24sICdJQ1UgZXhwcmVzc2lvbiBtdXN0IGJlIGRlZmluZWQnKTtcbiAgbGV0IGJpbmRpbmdNYXNrID0gMDtcbiAgY29uc3QgdEljdTogVEljdSA9IHtcbiAgICB0eXBlOiBpY3VFeHByZXNzaW9uLnR5cGUsXG4gICAgY3VycmVudENhc2VMVmlld0luZGV4OiBhbGxvY0V4cGFuZG8odFZpZXcsIGxWaWV3LCAxLCBudWxsKSxcbiAgICBhbmNob3JJZHgsXG4gICAgY2FzZXM6IFtdLFxuICAgIGNyZWF0ZTogW10sXG4gICAgcmVtb3ZlOiBbXSxcbiAgICB1cGRhdGU6IFtdXG4gIH07XG4gIGFkZFVwZGF0ZUljdVN3aXRjaCh1cGRhdGVPcENvZGVzLCBpY3VFeHByZXNzaW9uLCBhbmNob3JJZHgpO1xuICBzZXRUSWN1KHRWaWV3LCBhbmNob3JJZHgsIHRJY3UpO1xuICBjb25zdCB2YWx1ZXMgPSBpY3VFeHByZXNzaW9uLnZhbHVlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBFYWNoIHZhbHVlIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MgJiBvdGhlciBJQ1UgZXhwcmVzc2lvbnNcbiAgICBjb25zdCB2YWx1ZUFyciA9IHZhbHVlc1tpXTtcbiAgICBjb25zdCBuZXN0ZWRJY3VzOiBJY3VFeHByZXNzaW9uW10gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHZhbHVlQXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlQXJyW2pdO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gSXQgaXMgYW4gbmVzdGVkIElDVSBleHByZXNzaW9uXG4gICAgICAgIGNvbnN0IGljdUluZGV4ID0gbmVzdGVkSWN1cy5wdXNoKHZhbHVlIGFzIEljdUV4cHJlc3Npb24pIC0gMTtcbiAgICAgICAgLy8gUmVwbGFjZSBuZXN0ZWQgSUNVIGV4cHJlc3Npb24gYnkgYSBjb21tZW50IG5vZGVcbiAgICAgICAgdmFsdWVBcnJbal0gPSBgPCEtLe+/vSR7aWN1SW5kZXh977+9LS0+YDtcbiAgICAgIH1cbiAgICB9XG4gICAgYmluZGluZ01hc2sgPSBwYXJzZUljdUNhc2UoXG4gICAgICAgICAgICAgICAgICAgICAgdFZpZXcsIHRJY3UsIGxWaWV3LCB1cGRhdGVPcENvZGVzLCBwYXJlbnRJZHgsIGljdUV4cHJlc3Npb24uY2FzZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVBcnIuam9pbignJyksIG5lc3RlZEljdXMpIHxcbiAgICAgICAgYmluZGluZ01hc2s7XG4gIH1cbiAgaWYgKGJpbmRpbmdNYXNrKSB7XG4gICAgYWRkVXBkYXRlSWN1VXBkYXRlKHVwZGF0ZU9wQ29kZXMsIGJpbmRpbmdNYXNrLCBhbmNob3JJZHgpO1xuICB9XG59XG5cbi8qKlxuICogUGFyc2VzIHRleHQgY29udGFpbmluZyBhbiBJQ1UgZXhwcmVzc2lvbiBhbmQgcHJvZHVjZXMgYSBKU09OIG9iamVjdCBmb3IgaXQuXG4gKiBPcmlnaW5hbCBjb2RlIGZyb20gY2xvc3VyZSBsaWJyYXJ5LCBtb2RpZmllZCBmb3IgQW5ndWxhci5cbiAqXG4gKiBAcGFyYW0gcGF0dGVybiBUZXh0IGNvbnRhaW5pbmcgYW4gSUNVIGV4cHJlc3Npb24gdGhhdCBuZWVkcyB0byBiZSBwYXJzZWQuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJQ1VCbG9jayhwYXR0ZXJuOiBzdHJpbmcpOiBJY3VFeHByZXNzaW9uIHtcbiAgY29uc3QgY2FzZXMgPSBbXTtcbiAgY29uc3QgdmFsdWVzOiAoc3RyaW5nfEljdUV4cHJlc3Npb24pW11bXSA9IFtdO1xuICBsZXQgaWN1VHlwZSA9IEljdVR5cGUucGx1cmFsO1xuICBsZXQgbWFpbkJpbmRpbmcgPSAwO1xuICBwYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKElDVV9CTE9DS19SRUdFWFAsIGZ1bmN0aW9uKHN0cjogc3RyaW5nLCBiaW5kaW5nOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xuICAgIGlmICh0eXBlID09PSAnc2VsZWN0Jykge1xuICAgICAgaWN1VHlwZSA9IEljdVR5cGUuc2VsZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpY3VUeXBlID0gSWN1VHlwZS5wbHVyYWw7XG4gICAgfVxuICAgIG1haW5CaW5kaW5nID0gcGFyc2VJbnQoYmluZGluZy5zdWJzdHIoMSksIDEwKTtcbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIGNvbnN0IHBhcnRzID0gaTE4blBhcnNlVGV4dEludG9QYXJ0c0FuZElDVShwYXR0ZXJuKSBhcyBzdHJpbmdbXTtcbiAgLy8gTG9va2luZyBmb3IgKGtleSBibG9jaykrIHNlcXVlbmNlLiBPbmUgb2YgdGhlIGtleXMgaGFzIHRvIGJlIFwib3RoZXJcIi5cbiAgZm9yIChsZXQgcG9zID0gMDsgcG9zIDwgcGFydHMubGVuZ3RoOykge1xuICAgIGxldCBrZXkgPSBwYXJ0c1twb3MrK10udHJpbSgpO1xuICAgIGlmIChpY3VUeXBlID09PSBJY3VUeXBlLnBsdXJhbCkge1xuICAgICAgLy8gS2V5IGNhbiBiZSBcIj14XCIsIHdlIGp1c3Qgd2FudCBcInhcIlxuICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xccyooPzo9KT8oXFx3KylcXHMqLywgJyQxJyk7XG4gICAgfVxuICAgIGlmIChrZXkubGVuZ3RoKSB7XG4gICAgICBjYXNlcy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmxvY2tzID0gaTE4blBhcnNlVGV4dEludG9QYXJ0c0FuZElDVShwYXJ0c1twb3MrK10pIGFzIHN0cmluZ1tdO1xuICAgIGlmIChjYXNlcy5sZW5ndGggPiB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICB2YWx1ZXMucHVzaChibG9ja3MpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8ob2NvbWJlKTogc3VwcG9ydCBJQ1UgZXhwcmVzc2lvbnMgaW4gYXR0cmlidXRlcywgc2VlICMyMTYxNVxuICByZXR1cm4ge3R5cGU6IGljdVR5cGUsIG1haW5CaW5kaW5nOiBtYWluQmluZGluZywgY2FzZXMsIHZhbHVlc307XG59XG5cblxuLyoqXG4gKiBCcmVha3MgcGF0dGVybiBpbnRvIHN0cmluZ3MgYW5kIHRvcCBsZXZlbCB7Li4ufSBibG9ja3MuXG4gKiBDYW4gYmUgdXNlZCB0byBicmVhayBhIG1lc3NhZ2UgaW50byB0ZXh0IGFuZCBJQ1UgZXhwcmVzc2lvbnMsIG9yIHRvIGJyZWFrIGFuIElDVSBleHByZXNzaW9uXG4gKiBpbnRvIGtleXMgYW5kIGNhc2VzLiBPcmlnaW5hbCBjb2RlIGZyb20gY2xvc3VyZSBsaWJyYXJ5LCBtb2RpZmllZCBmb3IgQW5ndWxhci5cbiAqXG4gKiBAcGFyYW0gcGF0dGVybiAoc3ViKVBhdHRlcm4gdG8gYmUgYnJva2VuLlxuICogQHJldHVybnMgQW4gYEFycmF5PHN0cmluZ3xJY3VFeHByZXNzaW9uPmAgd2hlcmU6XG4gKiAgIC0gb2RkIHBvc2l0aW9uczogYHN0cmluZ2AgPT4gdGV4dCBiZXR3ZWVuIElDVSBleHByZXNzaW9uc1xuICogICAtIGV2ZW4gcG9zaXRpb25zOiBgSUNVRXhwcmVzc2lvbmAgPT4gSUNVIGV4cHJlc3Npb24gcGFyc2VkIGludG8gYElDVUV4cHJlc3Npb25gIHJlY29yZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGkxOG5QYXJzZVRleHRJbnRvUGFydHNBbmRJQ1UocGF0dGVybjogc3RyaW5nKTogKHN0cmluZ3xJY3VFeHByZXNzaW9uKVtdIHtcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgbGV0IHByZXZQb3MgPSAwO1xuICBjb25zdCBicmFjZVN0YWNrID0gW107XG4gIGNvbnN0IHJlc3VsdHM6IChzdHJpbmd8SWN1RXhwcmVzc2lvbilbXSA9IFtdO1xuICBjb25zdCBicmFjZXMgPSAvW3t9XS9nO1xuICAvLyBsYXN0SW5kZXggZG9lc24ndCBnZXQgc2V0IHRvIDAgc28gd2UgaGF2ZSB0by5cbiAgYnJhY2VzLmxhc3RJbmRleCA9IDA7XG5cbiAgbGV0IG1hdGNoO1xuICB3aGlsZSAobWF0Y2ggPSBicmFjZXMuZXhlYyhwYXR0ZXJuKSkge1xuICAgIGNvbnN0IHBvcyA9IG1hdGNoLmluZGV4O1xuICAgIGlmIChtYXRjaFswXSA9PSAnfScpIHtcbiAgICAgIGJyYWNlU3RhY2sucG9wKCk7XG5cbiAgICAgIGlmIChicmFjZVN0YWNrLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIEVuZCBvZiB0aGUgYmxvY2suXG4gICAgICAgIGNvbnN0IGJsb2NrID0gcGF0dGVybi5zdWJzdHJpbmcocHJldlBvcywgcG9zKTtcbiAgICAgICAgaWYgKElDVV9CTE9DS19SRUdFWFAudGVzdChibG9jaykpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gocGFyc2VJQ1VCbG9jayhibG9jaykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChibG9jayk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2UG9zID0gcG9zICsgMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGJyYWNlU3RhY2subGVuZ3RoID09IDApIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gcGF0dGVybi5zdWJzdHJpbmcocHJldlBvcywgcG9zKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHN1YnN0cmluZyk7XG4gICAgICAgIHByZXZQb3MgPSBwb3MgKyAxO1xuICAgICAgfVxuICAgICAgYnJhY2VTdGFjay5wdXNoKCd7Jyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3Vic3RyaW5nID0gcGF0dGVybi5zdWJzdHJpbmcocHJldlBvcyk7XG4gIHJlc3VsdHMucHVzaChzdWJzdHJpbmcpO1xuICByZXR1cm4gcmVzdWx0cztcbn1cblxuXG4vKipcbiAqIFBhcnNlcyBhIG5vZGUsIGl0cyBjaGlsZHJlbiBhbmQgaXRzIHNpYmxpbmdzLCBhbmQgZ2VuZXJhdGVzIHRoZSBtdXRhdGUgJiB1cGRhdGUgT3BDb2Rlcy5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUljdUNhc2UoXG4gICAgdFZpZXc6IFRWaWV3LCB0SWN1OiBUSWN1LCBsVmlldzogTFZpZXcsIHVwZGF0ZU9wQ29kZXM6IEkxOG5VcGRhdGVPcENvZGVzLCBwYXJlbnRJZHg6IG51bWJlcixcbiAgICBjYXNlTmFtZTogc3RyaW5nLCB1bnNhZmVDYXNlSHRtbDogc3RyaW5nLCBuZXN0ZWRJY3VzOiBJY3VFeHByZXNzaW9uW10pOiBudW1iZXIge1xuICBjb25zdCBjcmVhdGU6IEljdUNyZWF0ZU9wQ29kZXMgPSBbXSBhcyBhbnk7XG4gIGNvbnN0IHJlbW92ZTogSTE4blJlbW92ZU9wQ29kZXMgPSBbXSBhcyBhbnk7XG4gIGNvbnN0IHVwZGF0ZTogSTE4blVwZGF0ZU9wQ29kZXMgPSBbXSBhcyBhbnk7XG4gIGlmIChuZ0Rldk1vZGUpIHtcbiAgICBhdHRhY2hEZWJ1Z0dldHRlcihjcmVhdGUsIGljdUNyZWF0ZU9wQ29kZXNUb1N0cmluZyk7XG4gICAgYXR0YWNoRGVidWdHZXR0ZXIocmVtb3ZlLCBpMThuUmVtb3ZlT3BDb2Rlc1RvU3RyaW5nKTtcbiAgICBhdHRhY2hEZWJ1Z0dldHRlcih1cGRhdGUsIGkxOG5VcGRhdGVPcENvZGVzVG9TdHJpbmcpO1xuICB9XG4gIHRJY3UuY2FzZXMucHVzaChjYXNlTmFtZSk7XG4gIHRJY3UuY3JlYXRlLnB1c2goY3JlYXRlKTtcbiAgdEljdS5yZW1vdmUucHVzaChyZW1vdmUpO1xuICB0SWN1LnVwZGF0ZS5wdXNoKHVwZGF0ZSk7XG5cbiAgY29uc3QgaW5lcnRCb2R5SGVscGVyID0gZ2V0SW5lcnRCb2R5SGVscGVyKGdldERvY3VtZW50KCkpO1xuICBjb25zdCBpbmVydEJvZHlFbGVtZW50ID0gaW5lcnRCb2R5SGVscGVyLmdldEluZXJ0Qm9keUVsZW1lbnQodW5zYWZlQ2FzZUh0bWwpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChpbmVydEJvZHlFbGVtZW50LCAnVW5hYmxlIHRvIGdlbmVyYXRlIGluZXJ0IGJvZHkgZWxlbWVudCcpO1xuICBjb25zdCBpbmVydFJvb3ROb2RlID0gZ2V0VGVtcGxhdGVDb250ZW50KGluZXJ0Qm9keUVsZW1lbnQhKSBhcyBFbGVtZW50IHx8IGluZXJ0Qm9keUVsZW1lbnQ7XG4gIGlmIChpbmVydFJvb3ROb2RlKSB7XG4gICAgcmV0dXJuIHdhbGtJY3VUcmVlKFxuICAgICAgICB0VmlldywgdEljdSwgbFZpZXcsIHVwZGF0ZU9wQ29kZXMsIGNyZWF0ZSwgcmVtb3ZlLCB1cGRhdGUsIGluZXJ0Um9vdE5vZGUsIHBhcmVudElkeCxcbiAgICAgICAgbmVzdGVkSWN1cywgMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2Fsa0ljdVRyZWUoXG4gICAgdFZpZXc6IFRWaWV3LCB0SWN1OiBUSWN1LCBsVmlldzogTFZpZXcsIHNoYXJlZFVwZGF0ZU9wQ29kZXM6IEkxOG5VcGRhdGVPcENvZGVzLFxuICAgIGNyZWF0ZTogSWN1Q3JlYXRlT3BDb2RlcywgcmVtb3ZlOiBJMThuUmVtb3ZlT3BDb2RlcywgdXBkYXRlOiBJMThuVXBkYXRlT3BDb2RlcyxcbiAgICBwYXJlbnROb2RlOiBFbGVtZW50LCBwYXJlbnRJZHg6IG51bWJlciwgbmVzdGVkSWN1czogSWN1RXhwcmVzc2lvbltdLCBkZXB0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IGJpbmRpbmdNYXNrID0gMDtcbiAgbGV0IGN1cnJlbnROb2RlID0gcGFyZW50Tm9kZS5maXJzdENoaWxkO1xuICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICBjb25zdCBuZXdJbmRleCA9IGFsbG9jRXhwYW5kbyh0VmlldywgbFZpZXcsIDEsIG51bGwpO1xuICAgIHN3aXRjaCAoY3VycmVudE5vZGUubm9kZVR5cGUpIHtcbiAgICAgIGNhc2UgTm9kZS5FTEVNRU5UX05PREU6XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBjdXJyZW50Tm9kZSBhcyBFbGVtZW50O1xuICAgICAgICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChWQUxJRF9FTEVNRU5UUy5oYXNPd25Qcm9wZXJ0eSh0YWdOYW1lKSkge1xuICAgICAgICAgIGFkZENyZWF0ZU5vZGVBbmRBcHBlbmQoY3JlYXRlLCBFTEVNRU5UX01BUktFUiwgdGFnTmFtZSwgcGFyZW50SWR4LCBuZXdJbmRleCk7XG4gICAgICAgICAgdFZpZXcuZGF0YVtuZXdJbmRleF0gPSB0YWdOYW1lO1xuICAgICAgICAgIGNvbnN0IGVsQXR0cnMgPSBlbGVtZW50LmF0dHJpYnV0ZXM7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbEF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gZWxBdHRycy5pdGVtKGkpITtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyQXR0ck5hbWUgPSBhdHRyLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc0JpbmRpbmcgPSAhIWF0dHIudmFsdWUubWF0Y2goQklORElOR19SRUdFWFApO1xuICAgICAgICAgICAgLy8gd2UgYXNzdW1lIHRoZSBpbnB1dCBzdHJpbmcgaXMgc2FmZSwgdW5sZXNzIGl0J3MgdXNpbmcgYSBiaW5kaW5nXG4gICAgICAgICAgICBpZiAoaGFzQmluZGluZykge1xuICAgICAgICAgICAgICBpZiAoVkFMSURfQVRUUlMuaGFzT3duUHJvcGVydHkobG93ZXJBdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoVVJJX0FUVFJTW2xvd2VyQXR0ck5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICBnZW5lcmF0ZUJpbmRpbmdVcGRhdGVPcENvZGVzKFxuICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSwgYXR0ci52YWx1ZSwgbmV3SW5kZXgsIGF0dHIubmFtZSwgMCwgX3Nhbml0aXplVXJsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFNSQ1NFVF9BVFRSU1tsb3dlckF0dHJOYW1lXSkge1xuICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVCaW5kaW5nVXBkYXRlT3BDb2RlcyhcbiAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUsIGF0dHIudmFsdWUsIG5ld0luZGV4LCBhdHRyLm5hbWUsIDAsIHNhbml0aXplU3Jjc2V0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVCaW5kaW5nVXBkYXRlT3BDb2Rlcyh1cGRhdGUsIGF0dHIudmFsdWUsIG5ld0luZGV4LCBhdHRyLm5hbWUsIDAsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgYFdBUk5JTkc6IGlnbm9yaW5nIHVuc2FmZSBhdHRyaWJ1dGUgdmFsdWUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtsb3dlckF0dHJOYW1lfSBvbiBlbGVtZW50ICR7dGFnTmFtZX0gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgKHNlZSBodHRwczovL2cuY28vbmcvc2VjdXJpdHkjeHNzKWApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhZGRDcmVhdGVBdHRyaWJ1dGUoY3JlYXRlLCBuZXdJbmRleCwgYXR0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFBhcnNlIHRoZSBjaGlsZHJlbiBvZiB0aGlzIG5vZGUgKGlmIGFueSlcbiAgICAgICAgICBiaW5kaW5nTWFzayA9IHdhbGtJY3VUcmVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRWaWV3LCB0SWN1LCBsVmlldywgc2hhcmVkVXBkYXRlT3BDb2RlcywgY3JlYXRlLCByZW1vdmUsIHVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSBhcyBFbGVtZW50LCBuZXdJbmRleCwgbmVzdGVkSWN1cywgZGVwdGggKyAxKSB8XG4gICAgICAgICAgICAgIGJpbmRpbmdNYXNrO1xuICAgICAgICAgIGFkZFJlbW92ZU5vZGUocmVtb3ZlLCBuZXdJbmRleCwgZGVwdGgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOb2RlLlRFWFRfTk9ERTpcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50Tm9kZS50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgY29uc3QgaGFzQmluZGluZyA9IHZhbHVlLm1hdGNoKEJJTkRJTkdfUkVHRVhQKTtcbiAgICAgICAgYWRkQ3JlYXRlTm9kZUFuZEFwcGVuZChjcmVhdGUsIG51bGwsIGhhc0JpbmRpbmcgPyAnJyA6IHZhbHVlLCBwYXJlbnRJZHgsIG5ld0luZGV4KTtcbiAgICAgICAgYWRkUmVtb3ZlTm9kZShyZW1vdmUsIG5ld0luZGV4LCBkZXB0aCk7XG4gICAgICAgIGlmIChoYXNCaW5kaW5nKSB7XG4gICAgICAgICAgYmluZGluZ01hc2sgPVxuICAgICAgICAgICAgICBnZW5lcmF0ZUJpbmRpbmdVcGRhdGVPcENvZGVzKHVwZGF0ZSwgdmFsdWUsIG5ld0luZGV4LCBudWxsLCAwLCBudWxsKSB8IGJpbmRpbmdNYXNrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOb2RlLkNPTU1FTlRfTk9ERTpcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbW1lbnQgbm9kZSBpcyBhIHBsYWNlaG9sZGVyIGZvciBhIG5lc3RlZCBJQ1VcbiAgICAgICAgY29uc3QgaXNOZXN0ZWRJY3UgPSBORVNURURfSUNVLmV4ZWMoY3VycmVudE5vZGUudGV4dENvbnRlbnQgfHwgJycpO1xuICAgICAgICBpZiAoaXNOZXN0ZWRJY3UpIHtcbiAgICAgICAgICBjb25zdCBuZXN0ZWRJY3VJbmRleCA9IHBhcnNlSW50KGlzTmVzdGVkSWN1WzFdLCAxMCk7XG4gICAgICAgICAgY29uc3QgaWN1RXhwcmVzc2lvbjogSWN1RXhwcmVzc2lvbiA9IG5lc3RlZEljdXNbbmVzdGVkSWN1SW5kZXhdO1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29tbWVudCBub2RlIHRoYXQgd2lsbCBhbmNob3IgdGhlIElDVSBleHByZXNzaW9uXG4gICAgICAgICAgYWRkQ3JlYXRlTm9kZUFuZEFwcGVuZChcbiAgICAgICAgICAgICAgY3JlYXRlLCBJQ1VfTUFSS0VSLCBuZ0Rldk1vZGUgPyBgbmVzdGVkIElDVSAke25lc3RlZEljdUluZGV4fWAgOiAnJywgcGFyZW50SWR4LFxuICAgICAgICAgICAgICBuZXdJbmRleCk7XG4gICAgICAgICAgaWN1U3RhcnQodFZpZXcsIGxWaWV3LCBzaGFyZWRVcGRhdGVPcENvZGVzLCBwYXJlbnRJZHgsIGljdUV4cHJlc3Npb24sIG5ld0luZGV4KTtcbiAgICAgICAgICBhZGRSZW1vdmVOZXN0ZWRJY3UocmVtb3ZlLCBuZXdJbmRleCwgZGVwdGgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nO1xuICB9XG4gIHJldHVybiBiaW5kaW5nTWFzaztcbn1cblxuZnVuY3Rpb24gYWRkUmVtb3ZlTm9kZShyZW1vdmU6IEkxOG5SZW1vdmVPcENvZGVzLCBpbmRleDogbnVtYmVyLCBkZXB0aDogbnVtYmVyKSB7XG4gIGlmIChkZXB0aCA9PT0gMCkge1xuICAgIHJlbW92ZS5wdXNoKGluZGV4KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSZW1vdmVOZXN0ZWRJY3UocmVtb3ZlOiBJMThuUmVtb3ZlT3BDb2RlcywgaW5kZXg6IG51bWJlciwgZGVwdGg6IG51bWJlcikge1xuICBpZiAoZGVwdGggPT09IDApIHtcbiAgICByZW1vdmUucHVzaCh+aW5kZXgpOyAgLy8gcmVtb3ZlIElDVSBhdCBgaW5kZXhgXG4gICAgcmVtb3ZlLnB1c2goaW5kZXgpOyAgIC8vIHJlbW92ZSBJQ1UgY29tbWVudCBhdCBgaW5kZXhgXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlSWN1U3dpdGNoKFxuICAgIHVwZGF0ZTogSTE4blVwZGF0ZU9wQ29kZXMsIGljdUV4cHJlc3Npb246IEljdUV4cHJlc3Npb24sIGluZGV4OiBudW1iZXIpIHtcbiAgdXBkYXRlLnB1c2goXG4gICAgICB0b01hc2tCaXQoaWN1RXhwcmVzc2lvbi5tYWluQmluZGluZyksIDIsIC0xIC0gaWN1RXhwcmVzc2lvbi5tYWluQmluZGluZyxcbiAgICAgIGluZGV4IDw8IEkxOG5VcGRhdGVPcENvZGUuU0hJRlRfUkVGIHwgSTE4blVwZGF0ZU9wQ29kZS5JY3VTd2l0Y2gpO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVJY3VVcGRhdGUodXBkYXRlOiBJMThuVXBkYXRlT3BDb2RlcywgYmluZGluZ01hc2s6IG51bWJlciwgaW5kZXg6IG51bWJlcikge1xuICB1cGRhdGUucHVzaChiaW5kaW5nTWFzaywgMSwgaW5kZXggPDwgSTE4blVwZGF0ZU9wQ29kZS5TSElGVF9SRUYgfCBJMThuVXBkYXRlT3BDb2RlLkljdVVwZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGFkZENyZWF0ZU5vZGVBbmRBcHBlbmQoXG4gICAgY3JlYXRlOiBJY3VDcmVhdGVPcENvZGVzLCBtYXJrZXI6IG51bGx8SUNVX01BUktFUnxFTEVNRU5UX01BUktFUiwgdGV4dDogc3RyaW5nLFxuICAgIGFwcGVuZFRvUGFyZW50SWR4OiBudW1iZXIsIGNyZWF0ZUF0SWR4OiBudW1iZXIpIHtcbiAgaWYgKG1hcmtlciAhPT0gbnVsbCkge1xuICAgIGNyZWF0ZS5wdXNoKG1hcmtlcik7XG4gIH1cbiAgY3JlYXRlLnB1c2goXG4gICAgICB0ZXh0LCBjcmVhdGVBdElkeCxcbiAgICAgIGljdUNyZWF0ZU9wQ29kZShJY3VDcmVhdGVPcENvZGUuQXBwZW5kQ2hpbGQsIGFwcGVuZFRvUGFyZW50SWR4LCBjcmVhdGVBdElkeCkpO1xufVxuXG5mdW5jdGlvbiBhZGRDcmVhdGVBdHRyaWJ1dGUoY3JlYXRlOiBJY3VDcmVhdGVPcENvZGVzLCBuZXdJbmRleDogbnVtYmVyLCBhdHRyOiBBdHRyKSB7XG4gIGNyZWF0ZS5wdXNoKG5ld0luZGV4IDw8IEljdUNyZWF0ZU9wQ29kZS5TSElGVF9SRUYgfCBJY3VDcmVhdGVPcENvZGUuQXR0ciwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbn1cbiJdfQ==