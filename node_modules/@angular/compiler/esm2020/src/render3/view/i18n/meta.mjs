/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { computeDecimalDigest, computeDigest, decimalDigest } from '../../../i18n/digest';
import * as i18n from '../../../i18n/i18n_ast';
import { createI18nMessageFactory } from '../../../i18n/i18n_parser';
import { I18nError } from '../../../i18n/parse_util';
import * as html from '../../../ml_parser/ast';
import { DEFAULT_INTERPOLATION_CONFIG } from '../../../ml_parser/interpolation_config';
import { ParseTreeResult } from '../../../ml_parser/parser';
import * as o from '../../../output/output_ast';
import { isTrustedTypesSink } from '../../../schema/trusted_types_sinks';
import { hasI18nAttrs, I18N_ATTR, I18N_ATTR_PREFIX, icuFromI18nMessage } from './util';
const setI18nRefs = (htmlNode, i18nNode) => {
    if (htmlNode instanceof html.NodeWithI18n) {
        if (i18nNode instanceof i18n.IcuPlaceholder && htmlNode.i18n instanceof i18n.Message) {
            // This html node represents an ICU but this is a second processing pass, and the legacy id
            // was computed in the previous pass and stored in the `i18n` property as a message.
            // We are about to wipe out that property so capture the previous message to be reused when
            // generating the message for this ICU later. See `_generateI18nMessage()`.
            i18nNode.previousMessage = htmlNode.i18n;
        }
        htmlNode.i18n = i18nNode;
    }
    return i18nNode;
};
/**
 * This visitor walks over HTML parse tree and converts information stored in
 * i18n-related attributes ("i18n" and "i18n-*") into i18n meta object that is
 * stored with other element's and attribute's information.
 */
export class I18nMetaVisitor {
    constructor(interpolationConfig = DEFAULT_INTERPOLATION_CONFIG, keepI18nAttrs = false, enableI18nLegacyMessageIdFormat = false) {
        this.interpolationConfig = interpolationConfig;
        this.keepI18nAttrs = keepI18nAttrs;
        this.enableI18nLegacyMessageIdFormat = enableI18nLegacyMessageIdFormat;
        // whether visited nodes contain i18n information
        this.hasI18nMeta = false;
        this._errors = [];
        // i18n message generation factory
        this._createI18nMessage = createI18nMessageFactory(this.interpolationConfig);
    }
    _generateI18nMessage(nodes, meta = '', visitNodeFn) {
        const { meaning, description, customId } = this._parseMetadata(meta);
        const message = this._createI18nMessage(nodes, meaning, description, customId, visitNodeFn);
        this._setMessageId(message, meta);
        this._setLegacyIds(message, meta);
        return message;
    }
    visitAllWithErrors(nodes) {
        const result = nodes.map(node => node.visit(this, null));
        return new ParseTreeResult(result, this._errors);
    }
    visitElement(element) {
        let message = undefined;
        if (hasI18nAttrs(element)) {
            this.hasI18nMeta = true;
            const attrs = [];
            const attrsMeta = {};
            for (const attr of element.attrs) {
                if (attr.name === I18N_ATTR) {
                    // root 'i18n' node attribute
                    const i18n = element.i18n || attr.value;
                    message = this._generateI18nMessage(element.children, i18n, setI18nRefs);
                    if (message.nodes.length === 0) {
                        // Ignore the message if it is empty.
                        message = undefined;
                    }
                    // Store the message on the element
                    element.i18n = message;
                }
                else if (attr.name.startsWith(I18N_ATTR_PREFIX)) {
                    // 'i18n-*' attributes
                    const name = attr.name.slice(I18N_ATTR_PREFIX.length);
                    if (isTrustedTypesSink(element.name, name)) {
                        this._reportError(attr, `Translating attribute '${name}' is disallowed for security reasons.`);
                    }
                    else {
                        attrsMeta[name] = attr.value;
                    }
                }
                else {
                    // non-i18n attributes
                    attrs.push(attr);
                }
            }
            // set i18n meta for attributes
            if (Object.keys(attrsMeta).length) {
                for (const attr of attrs) {
                    const meta = attrsMeta[attr.name];
                    // do not create translation for empty attributes
                    if (meta !== undefined && attr.value) {
                        attr.i18n = this._generateI18nMessage([attr], attr.i18n || meta);
                    }
                }
            }
            if (!this.keepI18nAttrs) {
                // update element's attributes,
                // keeping only non-i18n related ones
                element.attrs = attrs;
            }
        }
        html.visitAll(this, element.children, message);
        return element;
    }
    visitExpansion(expansion, currentMessage) {
        let message;
        const meta = expansion.i18n;
        this.hasI18nMeta = true;
        if (meta instanceof i18n.IcuPlaceholder) {
            // set ICU placeholder name (e.g. "ICU_1"),
            // generated while processing root element contents,
            // so we can reference it when we output translation
            const name = meta.name;
            message = this._generateI18nMessage([expansion], meta);
            const icu = icuFromI18nMessage(message);
            icu.name = name;
            if (currentMessage !== null) {
                // Also update the placeholderToMessage map with this new message
                currentMessage.placeholderToMessage[name] = message;
            }
        }
        else {
            // ICU is a top level message, try to use metadata from container element if provided via
            // `context` argument. Note: context may not be available for standalone ICUs (without
            // wrapping element), so fallback to ICU metadata in this case.
            message = this._generateI18nMessage([expansion], currentMessage || meta);
        }
        expansion.i18n = message;
        return expansion;
    }
    visitText(text) {
        return text;
    }
    visitAttribute(attribute) {
        return attribute;
    }
    visitComment(comment) {
        return comment;
    }
    visitExpansionCase(expansionCase) {
        return expansionCase;
    }
    /**
     * Parse the general form `meta` passed into extract the explicit metadata needed to create a
     * `Message`.
     *
     * There are three possibilities for the `meta` variable
     * 1) a string from an `i18n` template attribute: parse it to extract the metadata values.
     * 2) a `Message` from a previous processing pass: reuse the metadata values in the message.
     * 4) other: ignore this and just process the message metadata as normal
     *
     * @param meta the bucket that holds information about the message
     * @returns the parsed metadata.
     */
    _parseMetadata(meta) {
        return typeof meta === 'string' ? parseI18nMeta(meta) :
            meta instanceof i18n.Message ? meta :
                {};
    }
    /**
     * Generate (or restore) message id if not specified already.
     */
    _setMessageId(message, meta) {
        if (!message.id) {
            message.id = meta instanceof i18n.Message && meta.id || decimalDigest(message);
        }
    }
    /**
     * Update the `message` with a `legacyId` if necessary.
     *
     * @param message the message whose legacy id should be set
     * @param meta information about the message being processed
     */
    _setLegacyIds(message, meta) {
        if (this.enableI18nLegacyMessageIdFormat) {
            message.legacyIds = [computeDigest(message), computeDecimalDigest(message)];
        }
        else if (typeof meta !== 'string') {
            // This occurs if we are doing the 2nd pass after whitespace removal (see `parseTemplate()` in
            // `packages/compiler/src/render3/view/template.ts`).
            // In that case we want to reuse the legacy message generated in the 1st pass (see
            // `setI18nRefs()`).
            const previousMessage = meta instanceof i18n.Message ? meta :
                meta instanceof i18n.IcuPlaceholder ? meta.previousMessage :
                    undefined;
            message.legacyIds = previousMessage ? previousMessage.legacyIds : [];
        }
    }
    _reportError(node, msg) {
        this._errors.push(new I18nError(node.sourceSpan, msg));
    }
}
/** I18n separators for metadata **/
const I18N_MEANING_SEPARATOR = '|';
const I18N_ID_SEPARATOR = '@@';
/**
 * Parses i18n metas like:
 *  - "@@id",
 *  - "description[@@id]",
 *  - "meaning|description[@@id]"
 * and returns an object with parsed output.
 *
 * @param meta String that represents i18n meta
 * @returns Object with id, meaning and description fields
 */
export function parseI18nMeta(meta = '') {
    let customId;
    let meaning;
    let description;
    meta = meta.trim();
    if (meta) {
        const idIndex = meta.indexOf(I18N_ID_SEPARATOR);
        const descIndex = meta.indexOf(I18N_MEANING_SEPARATOR);
        let meaningAndDesc;
        [meaningAndDesc, customId] =
            (idIndex > -1) ? [meta.slice(0, idIndex), meta.slice(idIndex + 2)] : [meta, ''];
        [meaning, description] = (descIndex > -1) ?
            [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
            ['', meaningAndDesc];
    }
    return { customId, meaning, description };
}
// Converts i18n meta information for a message (id, description, meaning)
// to a JsDoc statement formatted as expected by the Closure compiler.
export function i18nMetaToJSDoc(meta) {
    const tags = [];
    if (meta.description) {
        tags.push({ tagName: "desc" /* Desc */, text: meta.description });
    }
    else {
        // Suppress the JSCompiler warning that a `@desc` was not given for this message.
        tags.push({ tagName: "suppress" /* Suppress */, text: '{msgDescriptions}' });
    }
    if (meta.meaning) {
        tags.push({ tagName: "meaning" /* Meaning */, text: meta.meaning });
    }
    return o.jsDocComment(tags);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEYsT0FBTyxLQUFLLElBQUksTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsd0JBQXdCLEVBQWMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxLQUFLLElBQUksTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsNEJBQTRCLEVBQXNCLE1BQU0seUNBQXlDLENBQUM7QUFDMUcsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sS0FBSyxDQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFFdkUsT0FBTyxFQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFXckYsTUFBTSxXQUFXLEdBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQ3RELElBQUksUUFBUSxZQUFZLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDekMsSUFBSSxRQUFRLFlBQVksSUFBSSxDQUFDLGNBQWMsSUFBSSxRQUFRLENBQUMsSUFBSSxZQUFZLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEYsMkZBQTJGO1lBQzNGLG9GQUFvRjtZQUNwRiwyRkFBMkY7WUFDM0YsMkVBQTJFO1lBQzNFLFFBQVEsQ0FBQyxlQUFlLEdBQUcs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LEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUMxQjtJQUVELE9BQU8sRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCwwRUFBMEU7QUFDMUUsc0VBQXNFO0FBQ3RFLE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBYztJQUM1QyxNQUFNLElBQUksR0FBaUIsRUFBRSxDQUFDO0lBQzlCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxtQkFBcUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUM7S0FDbkU7U0FBTTtRQUNMLGlGQUFpRjtRQUNqRixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTywyQkFBeUIsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO0tBQzFFO0lBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLHlCQUF3QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUNsRTtJQUNELE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29tcHV0ZURlY2ltYWxEaWdlc3QsIGNvbXB1dGVEaWdlc3QsIGRlY2ltYWxEaWdlc3R9IGZyb20gJy4uLy4uLy4uL2kxOG4vZGlnZXN0JztcbmltcG9ydCAqIGFzIGkxOG4gZnJvbSAnLi4vLi4vLi4vaTE4bi9pMThuX2FzdCc7XG5pbXBvcnQge2NyZWF0ZUkxOG5NZXNzYWdlRmFjdG9yeSwgVmlzaXROb2RlRm59IGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9wYXJzZXInO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gJy4uLy4uLy4uL2kxOG4vcGFyc2VfdXRpbCc7XG5pbXBvcnQgKiBhcyBodG1sIGZyb20gJy4uLy4uLy4uL21sX3BhcnNlci9hc3QnO1xuaW1wb3J0IHtERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHLCBJbnRlcnBvbGF0aW9uQ29uZmlnfSBmcm9tICcuLi8uLi8uLi9tbF9wYXJzZXIvaW50ZXJwb2xhdGlvbl9jb25maWcnO1xuaW1wb3J0IHtQYXJzZVRyZWVSZXN1bHR9IGZyb20gJy4uLy4uLy4uL21sX3BhcnNlci9wYXJzZXInO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi8uLi8uLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge2lzVHJ1c3RlZFR5cGVzU2lua30gZnJvbSAnLi4vLi4vLi4vc2NoZW1hL3RydXN0ZWRfdHlwZXNfc2lua3MnO1xuXG5pbXBvcnQge2hhc0kxOG5BdHRycywgSTE4Tl9BVFRSLCBJMThOX0FUVFJfUFJFRklYLCBpY3VGcm9tSTE4bk1lc3NhZ2V9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCB0eXBlIEkxOG5NZXRhID0ge1xuICBpZD86IHN0cmluZyxcbiAgY3VzdG9tSWQ/OiBzdHJpbmcsXG4gIGxlZ2FjeUlkcz86IHN0cmluZ1tdLFxuICBkZXNjcmlwdGlvbj86IHN0cmluZyxcbiAgbWVhbmluZz86IHN0cmluZ1xufTtcblxuXG5jb25zdCBzZXRJMThuUmVmczogVmlzaXROb2RlRm4gPSAoaHRtbE5vZGUsIGkxOG5Ob2RlKSA9PiB7XG4gIGlmIChodG1sTm9kZSBpbnN0YW5jZW9mIGh0bWwuTm9kZVdpdGhJMThuKSB7XG4gICAgaWYgKGkxOG5Ob2RlIGluc3RhbmNlb2YgaTE4bi5JY3VQbGFjZWhvbGRlciAmJiBodG1sTm9kZS5pMThuIGluc3RhbmNlb2YgaTE4bi5NZXNzYWdlKSB7XG4gICAgICAvLyBUaGlzIGh0bWwgbm9kZSByZXByZXNlbnRzIGFuIElDVSBidXQgdGhpcyBpcyBhIHNlY29uZCBwcm9jZXNzaW5nIHBhc3MsIGFuZCB0aGUgbGVnYWN5IGlkXG4gICAgICAvLyB3YXMgY29tcHV0ZWQgaW4gdGhlIHByZXZpb3VzIHBhc3MgYW5kIHN0b3JlZCBpbiB0aGUgYGkxOG5gIHByb3BlcnR5IGFzIGEgbWVzc2FnZS5cbiAgICAgIC8vIFdlIGFyZSBhYm91dCB0byB3aXBlIG91dCB0aGF0IHByb3BlcnR5IHNvIGNhcHR1cmUgdGhlIHByZXZpb3VzIG1lc3NhZ2UgdG8gYmUgcmV1c2VkIHdoZW5cbiAgICAgIC8vIGdlbmVyYXRpbmcgdGhlIG1lc3NhZ2UgZm9yIHRoaXMgSUNVIGxhdGVyLiBTZWUgYF9nZW5lcmF0ZUkxOG5NZXNzYWdlKClgLlxuICAgICAgaTE4bk5vZGUucHJldmlvdXNNZXNzYWdlID0gaHRtbE5vZGUuaTE4bjtcbiAgICB9XG4gICAgaHRtbE5vZGUuaTE4biA9IGkxOG5Ob2RlO1xuICB9XG4gIHJldHVybiBpMThuTm9kZTtcbn07XG5cbi8qKlxuICogVGhpcyB2aXNpdG9yIHdhbGtzIG92ZXIgSFRNTCBwYXJzZSB0cmVlIGFuZCBjb252ZXJ0cyBpbmZvcm1hdGlvbiBzdG9yZWQgaW5cbiAqIGkxOG4tcmVsYXRlZCBhdHRyaWJ1dGVzIChcImkxOG5cIiBhbmQgXCJpMThuLSpcIikgaW50byBpMThuIG1ldGEgb2JqZWN0IHRoYXQgaXNcbiAqIHN0b3JlZCB3aXRoIG90aGVyIGVsZW1lbnQncyBhbmQgYXR0cmlidXRlJ3MgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBJMThuTWV0YVZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICAvLyB3aGV0aGVyIHZpc2l0ZWQgbm9kZXMgY29udGFpbiBpMThuIGluZm9ybWF0aW9uXG4gIHB1YmxpYyBoYXNJMThuTWV0YTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdID0gW107XG5cbiAgLy8gaTE4biBtZXNzYWdlIGdlbmVyYXRpb24gZmFjdG9yeVxuICBwcml2YXRlIF9jcmVhdGVJMThuTWVzc2FnZSA9IGNyZWF0ZUkxOG5NZXNzYWdlRmFjdG9yeSh0aGlzLmludGVycG9sYXRpb25Db25maWcpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnID0gREVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRyxcbiAgICAgIHByaXZhdGUga2VlcEkxOG5BdHRycyA9IGZhbHNlLCBwcml2YXRlIGVuYWJsZUkxOG5MZWdhY3lNZXNzYWdlSWRGb3JtYXQgPSBmYWxzZSkge31cblxuICBwcml2YXRlIF9nZW5lcmF0ZUkxOG5NZXNzYWdlKFxuICAgICAgbm9kZXM6IGh0bWwuTm9kZVtdLCBtZXRhOiBzdHJpbmd8aTE4bi5JMThuTWV0YSA9ICcnLFxuICAgICAgdmlzaXROb2RlRm4/OiBWaXNpdE5vZGVGbik6IGkxOG4uTWVzc2FnZSB7XG4gICAgY29uc3Qge21lYW5pbmcsIGRlc2NyaXB0aW9uLCBjdXN0b21JZH0gPSB0aGlzLl9wYXJzZU1ldGFkYXRhKG1ldGEpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVJMThuTWVzc2FnZShub2RlcywgbWVhbmluZywgZGVzY3JpcHRpb24sIGN1c3RvbUlkLCB2aXNpdE5vZGVGbik7XG4gICAgdGhpcy5fc2V0TWVzc2FnZUlkKG1lc3NhZ2UsIG1ldGEpO1xuICAgIHRoaXMuX3NldExlZ2FjeUlkcyhtZXNzYWdlLCBtZXRhKTtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIHZpc2l0QWxsV2l0aEVycm9ycyhub2RlczogaHRtbC5Ob2RlW10pOiBQYXJzZVRyZWVSZXN1bHQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5vZGVzLm1hcChub2RlID0+IG5vZGUudmlzaXQodGhpcywgbnVsbCkpO1xuICAgIHJldHVybiBuZXcgUGFyc2VUcmVlUmVzdWx0KHJlc3VsdCwgdGhpcy5fZXJyb3JzKTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBodG1sLkVsZW1lbnQpOiBhbnkge1xuICAgIGxldCBtZXNzYWdlOiBpMThuLk1lc3NhZ2V8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKGhhc0kxOG5BdHRycyhlbGVtZW50KSkge1xuICAgICAgdGhpcy5oYXNJMThuTWV0YSA9IHRydWU7XG4gICAgICBjb25zdCBhdHRyczogaHRtbC5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgICAgY29uc3QgYXR0cnNNZXRhOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuXG4gICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgZWxlbWVudC5hdHRycykge1xuICAgICAgICBpZiAoYXR0ci5uYW1lID09PSBJMThOX0FUVFIpIHtcbiAgICAgICAgICAvLyByb290ICdpMThuJyBub2RlIGF0dHJpYnV0ZVxuICAgICAgICAgIGNvbnN0IGkxOG4gPSBlbGVtZW50LmkxOG4gfHwgYXR0ci52YWx1ZTtcbiAgICAgICAgICBtZXNzYWdlID0gdGhpcy5fZ2VuZXJhdGVJMThuTWVzc2FnZShlbGVtZW50LmNoaWxkcmVuLCBpMThuLCBzZXRJMThuUmVmcyk7XG4gICAgICAgICAgaWYgKG1lc3NhZ2Uubm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgdGhlIG1lc3NhZ2UgaWYgaXQgaXMgZW1wdHkuXG4gICAgICAgICAgICBtZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBTdG9yZSB0aGUgbWVzc2FnZSBvbiB0aGUgZWxlbWVudFxuICAgICAgICAgIGVsZW1lbnQuaTE4biA9IG1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoSTE4Tl9BVFRSX1BSRUZJWCkpIHtcbiAgICAgICAgICAvLyAnaTE4bi0qJyBhdHRyaWJ1dGVzXG4gICAgICAgICAgY29uc3QgbmFtZSA9IGF0dHIubmFtZS5zbGljZShJMThOX0FUVFJfUFJFRklYLmxlbmd0aCk7XG4gICAgICAgICAgaWYgKGlzVHJ1c3RlZFR5cGVzU2luayhlbGVtZW50Lm5hbWUsIG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgICBhdHRyLCBgVHJhbnNsYXRpbmcgYXR0cmlidXRlICcke25hbWV9JyBpcyBkaXNhbGxvd2VkIGZvciBzZWN1cml0eSByZWFzb25zLmApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyc01ldGFbbmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBub24taTE4biBhdHRyaWJ1dGVzXG4gICAgICAgICAgYXR0cnMucHVzaChhdHRyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgaTE4biBtZXRhIGZvciBhdHRyaWJ1dGVzXG4gICAgICBpZiAoT2JqZWN0LmtleXMoYXR0cnNNZXRhKS5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgbWV0YSA9IGF0dHJzTWV0YVthdHRyLm5hbWVdO1xuICAgICAgICAgIC8vIGRvIG5vdCBjcmVhdGUgdHJhbnNsYXRpb24gZm9yIGVtcHR5IGF0dHJpYnV0ZXNcbiAgICAgICAgICBpZiAobWV0YSAhPT0gdW5kZWZpbmVkICYmIGF0dHIudmFsdWUpIHtcbiAgICAgICAgICAgIGF0dHIuaTE4biA9IHRoaXMuX2dlbmVyYXRlSTE4bk1lc3NhZ2UoW2F0dHJdLCBhdHRyLmkxOG4gfHwgbWV0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5rZWVwSTE4bkF0dHJzKSB7XG4gICAgICAgIC8vIHVwZGF0ZSBlbGVtZW50J3MgYXR0cmlidXRlcyxcbiAgICAgICAgLy8ga2VlcGluZyBvbmx5IG5vbi1pMThuIHJlbGF0ZWQgb25lc1xuICAgICAgICBlbGVtZW50LmF0dHJzID0gYXR0cnM7XG4gICAgICB9XG4gICAgfVxuICAgIGh0bWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbWVzc2FnZSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IGh0bWwuRXhwYW5zaW9uLCBjdXJyZW50TWVzc2FnZTogaTE4bi5NZXNzYWdlfG51bGwpOiBhbnkge1xuICAgIGxldCBtZXNzYWdlO1xuICAgIGNvbnN0IG1ldGEgPSBleHBhbnNpb24uaTE4bjtcbiAgICB0aGlzLmhhc0kxOG5NZXRhID0gdHJ1ZTtcbiAgICBpZiAobWV0YSBpbnN0YW5jZW9mIGkxOG4uSWN1UGxhY2Vob2xkZXIpIHtcbiAgICAgIC8vIHNldCBJQ1UgcGxhY2Vob2xkZXIgbmFtZSAoZS5nLiBcIklDVV8xXCIpLFxuICAgICAgLy8gZ2VuZXJhdGVkIHdoaWxlIHByb2Nlc3Npbmcgcm9vdCBlbGVtZW50IGNvbnRlbnRzLFxuICAgICAgLy8gc28gd2UgY2FuIHJlZmVyZW5jZSBpdCB3aGVuIHdlIG91dHB1dCB0cmFuc2xhdGlvblxuICAgICAgY29uc3QgbmFtZSA9IG1ldGEubmFtZTtcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLl9nZW5lcmF0ZUkxOG5NZXNzYWdlKFtleHBhbnNpb25dLCBtZXRhKTtcbiAgICAgIGNvbnN0IGljdSA9IGljdUZyb21JMThuTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgIGljdS5uYW1lID0gbmFtZTtcbiAgICAgIGlmIChjdXJyZW50TWVzc2FnZSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBBbHNvIHVwZGF0ZSB0aGUgcGxhY2Vob2xkZXJUb01lc3NhZ2UgbWFwIHdpdGggdGhpcyBuZXcgbWVzc2FnZVxuICAgICAgICBjdXJyZW50TWVzc2FnZS5wbGFjZWhvbGRlclRvTWVzc2FnZVtuYW1lXSA9IG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElDVSBpcyBhIHRvcCBsZXZlbCBtZXNzYWdlLCB0cnkgdG8gdXNlIG1ldGFkYXRhIGZyb20gY29udGFpbmVyIGVsZW1lbnQgaWYgcHJvdmlkZWQgdmlhXG4gICAgICAvLyBgY29udGV4dGAgYXJndW1lbnQuIE5vdGU6IGNvbnRleHQgbWF5IG5vdCBiZSBhdmFpbGFibGUgZm9yIHN0YW5kYWxvbmUgSUNVcyAod2l0aG91dFxuICAgICAgLy8gd3JhcHBpbmcgZWxlbWVudCksIHNvIGZhbGxiYWNrIHRvIElDVSBtZXRhZGF0YSBpbiB0aGlzIGNhc2UuXG4gICAgICBtZXNzYWdlID0gdGhpcy5fZ2VuZXJhdGVJMThuTWVzc2FnZShbZXhwYW5zaW9uXSwgY3VycmVudE1lc3NhZ2UgfHwgbWV0YSk7XG4gICAgfVxuICAgIGV4cGFuc2lvbi5pMThuID0gbWVzc2FnZTtcbiAgICByZXR1cm4gZXhwYW5zaW9uO1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGh0bWwuVGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSk6IGFueSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgfVxuICB2aXNpdENvbW1lbnQoY29tbWVudDogaHRtbC5Db21tZW50KTogYW55IHtcbiAgICByZXR1cm4gY29tbWVudDtcbiAgfVxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogaHRtbC5FeHBhbnNpb25DYXNlKTogYW55IHtcbiAgICByZXR1cm4gZXhwYW5zaW9uQ2FzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSB0aGUgZ2VuZXJhbCBmb3JtIGBtZXRhYCBwYXNzZWQgaW50byBleHRyYWN0IHRoZSBleHBsaWNpdCBtZXRhZGF0YSBuZWVkZWQgdG8gY3JlYXRlIGFcbiAgICogYE1lc3NhZ2VgLlxuICAgKlxuICAgKiBUaGVyZSBhcmUgdGhyZWUgcG9zc2liaWxpdGllcyBmb3IgdGhlIGBtZXRhYCB2YXJpYWJsZVxuICAgKiAxKSBhIHN0cmluZyBmcm9tIGFuIGBpMThuYCB0ZW1wbGF0ZSBhdHRyaWJ1dGU6IHBhcnNlIGl0IHRvIGV4dHJhY3QgdGhlIG1ldGFkYXRhIHZhbHVlcy5cbiAgICogMikgYSBgTWVzc2FnZWAgZnJvbSBhIHByZXZpb3VzIHByb2Nlc3NpbmcgcGFzczogcmV1c2UgdGhlIG1ldGFkYXRhIHZhbHVlcyBpbiB0aGUgbWVzc2FnZS5cbiAgICogNCkgb3RoZXI6IGlnbm9yZSB0aGlzIGFuZCBqdXN0IHByb2Nlc3MgdGhlIG1lc3NhZ2UgbWV0YWRhdGEgYXMgbm9ybWFsXG4gICAqXG4gICAqIEBwYXJhbSBtZXRhIHRoZSBidWNrZXQgdGhhdCBob2xkcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbWVzc2FnZVxuICAgKiBAcmV0dXJucyB0aGUgcGFyc2VkIG1ldGFkYXRhLlxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyc2VNZXRhZGF0YShtZXRhOiBzdHJpbmd8aTE4bi5JMThuTWV0YSk6IEkxOG5NZXRhIHtcbiAgICByZXR1cm4gdHlwZW9mIG1ldGEgPT09ICdzdHJpbmcnICA/IHBhcnNlSTE4bk1ldGEobWV0YSkgOlxuICAgICAgICBtZXRhIGluc3RhbmNlb2YgaTE4bi5NZXNzYWdlID8gbWV0YSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSAob3IgcmVzdG9yZSkgbWVzc2FnZSBpZCBpZiBub3Qgc3BlY2lmaWVkIGFscmVhZHkuXG4gICAqL1xuICBwcml2YXRlIF9zZXRNZXNzYWdlSWQobWVzc2FnZTogaTE4bi5NZXNzYWdlLCBtZXRhOiBzdHJpbmd8aTE4bi5JMThuTWV0YSk6IHZvaWQge1xuICAgIGlmICghbWVzc2FnZS5pZCkge1xuICAgICAgbWVzc2FnZS5pZCA9IG1ldGEgaW5zdGFuY2VvZiBpMThuLk1lc3NhZ2UgJiYgbWV0YS5pZCB8fCBkZWNpbWFsRGlnZXN0KG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGBtZXNzYWdlYCB3aXRoIGEgYGxlZ2FjeUlkYCBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHdob3NlIGxlZ2FjeSBpZCBzaG91bGQgYmUgc2V0XG4gICAqIEBwYXJhbSBtZXRhIGluZm9ybWF0aW9uIGFib3V0IHRoZSBtZXNzYWdlIGJlaW5nIHByb2Nlc3NlZFxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0TGVnYWN5SWRzKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSwgbWV0YTogc3RyaW5nfGkxOG4uSTE4bk1ldGEpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lbmFibGVJMThuTGVnYWN5TWVzc2FnZUlkRm9ybWF0KSB7XG4gICAgICBtZXNzYWdlLmxlZ2FjeUlkcyA9IFtjb21wdXRlRGlnZXN0KG1lc3NhZ2UpLCBjb21wdXRlRGVjaW1hbERpZ2VzdChtZXNzYWdlKV07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFRoaXMgb2NjdXJzIGlmIHdlIGFyZSBkb2luZyB0aGUgMm5kIHBhc3MgYWZ0ZXIgd2hpdGVzcGFjZSByZW1vdmFsIChzZWUgYHBhcnNlVGVtcGxhdGUoKWAgaW5cbiAgICAgIC8vIGBwYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy92aWV3L3RlbXBsYXRlLnRzYCkuXG4gICAgICAvLyBJbiB0aGF0IGNhc2Ugd2Ugd2FudCB0byByZXVzZSB0aGUgbGVnYWN5IG1lc3NhZ2UgZ2VuZXJhdGVkIGluIHRoZSAxc3QgcGFzcyAoc2VlXG4gICAgICAvLyBgc2V0STE4blJlZnMoKWApLlxuICAgICAgY29uc3QgcHJldmlvdXNNZXNzYWdlID0gbWV0YSBpbnN0YW5jZW9mIGkxOG4uTWVzc2FnZSA/IG1ldGEgOlxuICAgICAgICAgIG1ldGEgaW5zdGFuY2VvZiBpMThuLkljdVBsYWNlaG9sZGVyICAgICAgICAgICAgICA/IG1ldGEucHJldmlvdXNNZXNzYWdlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICBtZXNzYWdlLmxlZ2FjeUlkcyA9IHByZXZpb3VzTWVzc2FnZSA/IHByZXZpb3VzTWVzc2FnZS5sZWdhY3lJZHMgOiBbXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZXBvcnRFcnJvcihub2RlOiBodG1sLk5vZGUsIG1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4sIG1zZykpO1xuICB9XG59XG5cbi8qKiBJMThuIHNlcGFyYXRvcnMgZm9yIG1ldGFkYXRhICoqL1xuY29uc3QgSTE4Tl9NRUFOSU5HX1NFUEFSQVRPUiA9ICd8JztcbmNvbnN0IEkxOE5fSURfU0VQQVJBVE9SID0gJ0BAJztcblxuLyoqXG4gKiBQYXJzZXMgaTE4biBtZXRhcyBsaWtlOlxuICogIC0gXCJAQGlkXCIsXG4gKiAgLSBcImRlc2NyaXB0aW9uW0BAaWRdXCIsXG4gKiAgLSBcIm1lYW5pbmd8ZGVzY3JpcHRpb25bQEBpZF1cIlxuICogYW5kIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcGFyc2VkIG91dHB1dC5cbiAqXG4gKiBAcGFyYW0gbWV0YSBTdHJpbmcgdGhhdCByZXByZXNlbnRzIGkxOG4gbWV0YVxuICogQHJldHVybnMgT2JqZWN0IHdpdGggaWQsIG1lYW5pbmcgYW5kIGRlc2NyaXB0aW9uIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJMThuTWV0YShtZXRhOiBzdHJpbmcgPSAnJyk6IEkxOG5NZXRhIHtcbiAgbGV0IGN1c3RvbUlkOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBsZXQgbWVhbmluZzogc3RyaW5nfHVuZGVmaW5lZDtcbiAgbGV0IGRlc2NyaXB0aW9uOiBzdHJpbmd8dW5kZWZpbmVkO1xuXG4gIG1ldGEgPSBtZXRhLnRyaW0oKTtcbiAgaWYgKG1ldGEpIHtcbiAgICBjb25zdCBpZEluZGV4ID0gbWV0YS5pbmRleE9mKEkxOE5fSURfU0VQQVJBVE9SKTtcbiAgICBjb25zdCBkZXNjSW5kZXggPSBtZXRhLmluZGV4T2YoSTE4Tl9NRUFOSU5HX1NFUEFSQVRPUik7XG4gICAgbGV0IG1lYW5pbmdBbmREZXNjOiBzdHJpbmc7XG4gICAgW21lYW5pbmdBbmREZXNjLCBjdXN0b21JZF0gPVxuICAgICAgICAoaWRJbmRleCA+IC0xKSA/IFttZXRhLnNsaWNlKDAsIGlkSW5kZXgpLCBtZXRhLnNsaWNlKGlkSW5kZXggKyAyKV0gOiBbbWV0YSwgJyddO1xuICAgIFttZWFuaW5nLCBkZXNjcmlwdGlvbl0gPSAoZGVzY0luZGV4ID4gLTEpID9cbiAgICAgICAgW21lYW5pbmdBbmREZXNjLnNsaWNlKDAsIGRlc2NJbmRleCksIG1lYW5pbmdBbmREZXNjLnNsaWNlKGRlc2NJbmRleCArIDEpXSA6XG4gICAgICAgIFsnJywgbWVhbmluZ0FuZERlc2NdO1xuICB9XG5cbiAgcmV0dXJuIHtjdXN0b21JZCwgbWVhbmluZywgZGVzY3JpcHRpb259O1xufVxuXG4vLyBDb252ZXJ0cyBpMThuIG1ldGEgaW5mb3JtYXRpb24gZm9yIGEgbWVzc2FnZSAoaWQsIGRlc2NyaXB0aW9uLCBtZWFuaW5nKVxuLy8gdG8gYSBKc0RvYyBzdGF0ZW1lbnQgZm9ybWF0dGVkIGFzIGV4cGVjdGVkIGJ5IHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuZXhwb3J0IGZ1bmN0aW9uIGkxOG5NZXRhVG9KU0RvYyhtZXRhOiBJMThuTWV0YSk6IG8uSlNEb2NDb21tZW50IHtcbiAgY29uc3QgdGFnczogby5KU0RvY1RhZ1tdID0gW107XG4gIGlmIChtZXRhLmRlc2NyaXB0aW9uKSB7XG4gICAgdGFncy5wdXNoKHt0YWdOYW1lOiBvLkpTRG9jVGFnTmFtZS5EZXNjLCB0ZXh0OiBtZXRhLmRlc2NyaXB0aW9ufSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gU3VwcHJlc3MgdGhlIEpTQ29tcGlsZXIgd2FybmluZyB0aGF0IGEgYEBkZXNjYCB3YXMgbm90IGdpdmVuIGZvciB0aGlzIG1lc3NhZ2UuXG4gICAgdGFncy5wdXNoKHt0YWdOYW1lOiBvLkpTRG9jVGFnTmFtZS5TdXBwcmVzcywgdGV4dDogJ3ttc2dEZXNjcmlwdGlvbnN9J30pO1xuICB9XG4gIGlmIChtZXRhLm1lYW5pbmcpIHtcbiAgICB0YWdzLnB1c2goe3RhZ05hbWU6IG8uSlNEb2NUYWdOYW1lLk1lYW5pbmcsIHRleHQ6IG1ldGEubWVhbmluZ30pO1xuICB9XG4gIHJldHVybiBvLmpzRG9jQ29tbWVudCh0YWdzKTtcbn1cbiJdfQ==