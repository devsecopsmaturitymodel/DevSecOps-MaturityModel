/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Tag a template literal string for localization.
 *
 * For example:
 *
 * ```ts
 * $localize `some string to localize`
 * ```
 *
 * **Providing meaning, description and id**
 *
 * You can optionally specify one or more of `meaning`, `description` and `id` for a localized
 * string by pre-pending it with a colon delimited block of the form:
 *
 * ```ts
 * $localize`:meaning|description@@id:source message text`;
 *
 * $localize`:meaning|:source message text`;
 * $localize`:description:source message text`;
 * $localize`:@@id:source message text`;
 * ```
 *
 * This format is the same as that used for `i18n` markers in Angular templates. See the
 * [Angular i18n guide](guide/i18n-common-prepare#mark-text-in-component-template).
 *
 * **Naming placeholders**
 *
 * If the template literal string contains expressions, then the expressions will be automatically
 * associated with placeholder names for you.
 *
 * For example:
 *
 * ```ts
 * $localize `Hi ${name}! There are ${items.length} items.`;
 * ```
 *
 * will generate a message-source of `Hi {$PH}! There are {$PH_1} items`.
 *
 * The recommended practice is to name the placeholder associated with each expression though.
 *
 * Do this by providing the placeholder name wrapped in `:` characters directly after the
 * expression. These placeholder names are stripped out of the rendered localized string.
 *
 * For example, to name the `items.length` expression placeholder `itemCount` you write:
 *
 * ```ts
 * $localize `There are ${items.length}:itemCount: items`;
 * ```
 *
 * **Escaping colon markers**
 *
 * If you need to use a `:` character directly at the start of a tagged string that has no
 * metadata block, or directly after a substitution expression that has no name you must escape
 * the `:` by preceding it with a backslash:
 *
 * For example:
 *
 * ```ts
 * // message has a metadata block so no need to escape colon
 * $localize `:some description::this message starts with a colon (:)`;
 * // no metadata block so the colon must be escaped
 * $localize `\:this message starts with a colon (:)`;
 * ```
 *
 * ```ts
 * // named substitution so no need to escape colon
 * $localize `${label}:label:: ${}`
 * // anonymous substitution so colon must be escaped
 * $localize `${label}\: ${}`
 * ```
 *
 * **Processing localized strings:**
 *
 * There are three scenarios:
 *
 * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a
 * transpiler, removing the tag and replacing the template literal string with a translated
 * literal string from a collection of translations provided to the transpilation tool.
 *
 * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and
 * reorders the parts (static strings and expressions) of the template literal string with strings
 * from a collection of translations loaded at run-time.
 *
 * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
 * the original template literal string without applying any translations to the parts. This
 * version is used during development or where there is no need to translate the localized
 * template literals.
 *
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 *
 * @globalApi
 * @publicApi
 */
export const $localize = function (messageParts, ...expressions) {
    if ($localize.translate) {
        // Don't use array expansion here to avoid the compiler adding `__read()` helper unnecessarily.
        const translation = $localize.translate(messageParts, expressions);
        messageParts = translation[0];
        expressions = translation[1];
    }
    let message = stripBlock(messageParts[0], messageParts.raw[0]);
    for (let i = 1; i < messageParts.length; i++) {
        message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
    }
    return message;
};
const BLOCK_MARKER = ':';
/**
 * Strip a delimited "block" from the start of the `messagePart`, if it is found.
 *
 * If a marker character (:) actually appears in the content at the start of a tagged string or
 * after a substitution expression, where a block has not been provided the character must be
 * escaped with a backslash, `\:`. This function checks for this by looking at the `raw`
 * messagePart, which should still contain the backslash.
 *
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 * @throws an error if the block is unterminated
 */
function stripBlock(messagePart, rawMessagePart) {
    return rawMessagePart.charAt(0) === BLOCK_MARKER ?
        messagePart.substring(findEndOfBlock(messagePart, rawMessagePart) + 1) :
        messagePart;
}
/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
function findEndOfBlock(cooked, raw) {
    /***********************************************************************************************
     * This function is repeated in `src/utils/messages.ts` and the two should be kept in sync.
     * The reason is that this file is marked as having side-effects, and if we import `messages.ts`
     * into it, the whole of `src/utils` will be included in this bundle and none of the functions
     * will be tree shaken.
     ***********************************************************************************************/
    for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXlDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThGRztBQUNILE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBZSxVQUNqQyxZQUFrQyxFQUFFLEdBQUcsV0FBMkI7SUFDcEUsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1FBQ3ZCLCtGQUErRjtRQUMvRixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUV6Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO0lBQzdELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQztRQUM5QyxXQUFXLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxXQUFXLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxjQUFjLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQ7Ozs7O3FHQUtpRztJQUNqRyxLQUFLLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQzlGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQy9DLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIEBub2RvYyAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSk6IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGlucHV0IFwibWVzc2FnZSB3aXRoIGV4cHJlc3Npb25zXCIgaW50byBhIHRyYW5zbGF0ZWQgXCJtZXNzYWdlIHdpdGhcbiAgICogZXhwcmVzc2lvbnNcIi5cbiAgICpcbiAgICogVGhlIGNvbnZlcnNpb24gbWF5IGJlIGRvbmUgaW4gcGxhY2UsIG1vZGlmeWluZyB0aGUgYXJyYXkgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiwgc29cbiAgICogZG9uJ3QgYXNzdW1lIHRoYXQgdGhpcyBoYXMgbm8gc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBUaGUgZXhwcmVzc2lvbnMgbXVzdCBiZSBwYXNzZWQgaW4gc2luY2UgaXQgbWlnaHQgYmUgdGhleSBuZWVkIHRvIGJlIHJlb3JkZXJlZCBmb3JcbiAgICogZGlmZmVyZW50IHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZuO1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgbG9jYWxlIG9mIHRoZSB0cmFuc2xhdGVkIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBUaGUgY29tcGlsZS10aW1lIHRyYW5zbGF0aW9uIGlubGluZXIgaXMgYWJsZSB0byByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY29kZTpcbiAgICpcbiAgICogYGBgXG4gICAqIHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZVxuICAgKiBgYGBcbiAgICpcbiAgICogd2l0aCBhIHN0cmluZyBsaXRlcmFsIG9mIHRoZSBjdXJyZW50IGxvY2FsZS4gRS5nLlxuICAgKlxuICAgKiBgYGBcbiAgICogXCJmclwiXG4gICAqIGBgYFxuICAgKi9cbiAgbG9jYWxlPzogc3RyaW5nO1xufVxuXG4vKiogQG5vZG9jICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gICBleHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXTtcbn1cblxuLyoqXG4gKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYHNvbWUgc3RyaW5nIHRvIGxvY2FsaXplYFxuICogYGBgXG4gKlxuICogKipQcm92aWRpbmcgbWVhbmluZywgZGVzY3JpcHRpb24gYW5kIGlkKipcbiAqXG4gKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBvbmUgb3IgbW9yZSBvZiBgbWVhbmluZ2AsIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgZm9yIGEgbG9jYWxpemVkXG4gKiBzdHJpbmcgYnkgcHJlLXBlbmRpbmcgaXQgd2l0aCBhIGNvbG9uIGRlbGltaXRlZCBibG9jayBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqXG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8OnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogJGxvY2FsaXplYDpkZXNjcmlwdGlvbjpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICpcbiAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAqIFtBbmd1bGFyIGkxOG4gZ3VpZGVdKGd1aWRlL2kxOG4tY29tbW9uLXByZXBhcmUjbWFyay10ZXh0LWluLWNvbXBvbmVudC10ZW1wbGF0ZSkuXG4gKlxuICogKipOYW1pbmcgcGxhY2Vob2xkZXJzKipcbiAqXG4gKiBJZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgY29udGFpbnMgZXhwcmVzc2lvbnMsIHRoZW4gdGhlIGV4cHJlc3Npb25zIHdpbGwgYmUgYXV0b21hdGljYWxseVxuICogYXNzb2NpYXRlZCB3aXRoIHBsYWNlaG9sZGVyIG5hbWVzIGZvciB5b3UuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgSGkgJHtuYW1lfSEgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofSBpdGVtcy5gO1xuICogYGBgXG4gKlxuICogd2lsbCBnZW5lcmF0ZSBhIG1lc3NhZ2Utc291cmNlIG9mIGBIaSB7JFBIfSEgVGhlcmUgYXJlIHskUEhfMX0gaXRlbXNgLlxuICpcbiAqIFRoZSByZWNvbW1lbmRlZCBwcmFjdGljZSBpcyB0byBuYW1lIHRoZSBwbGFjZWhvbGRlciBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uIHRob3VnaC5cbiAqXG4gKiBEbyB0aGlzIGJ5IHByb3ZpZGluZyB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3cmFwcGVkIGluIGA6YCBjaGFyYWN0ZXJzIGRpcmVjdGx5IGFmdGVyIHRoZVxuICogZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGUgcmVuZGVyZWQgbG9jYWxpemVkIHN0cmluZy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdG8gbmFtZSB0aGUgYGl0ZW1zLmxlbmd0aGAgZXhwcmVzc2lvbiBwbGFjZWhvbGRlciBgaXRlbUNvdW50YCB5b3Ugd3JpdGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofTppdGVtQ291bnQ6IGl0ZW1zYDtcbiAqIGBgYFxuICpcbiAqICoqRXNjYXBpbmcgY29sb24gbWFya2VycyoqXG4gKlxuICogSWYgeW91IG5lZWQgdG8gdXNlIGEgYDpgIGNoYXJhY3RlciBkaXJlY3RseSBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIHRoYXQgaGFzIG5vXG4gKiBtZXRhZGF0YSBibG9jaywgb3IgZGlyZWN0bHkgYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiB0aGF0IGhhcyBubyBuYW1lIHlvdSBtdXN0IGVzY2FwZVxuICogdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogLy8gbWVzc2FnZSBoYXMgYSBtZXRhZGF0YSBibG9jayBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICogJGxvY2FsaXplIGA6c29tZSBkZXNjcmlwdGlvbjo6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIC8vIG5vIG1ldGFkYXRhIGJsb2NrIHNvIHRoZSBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAqICRsb2NhbGl6ZSBgXFw6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiAvLyBuYW1lZCBzdWJzdGl0dXRpb24gc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAqICRsb2NhbGl6ZSBgJHtsYWJlbH06bGFiZWw6OiAke31gXG4gKiAvLyBhbm9ueW1vdXMgc3Vic3RpdHV0aW9uIHNvIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICogJGxvY2FsaXplIGAke2xhYmVsfVxcOiAke31gXG4gKiBgYGBcbiAqXG4gKiAqKlByb2Nlc3NpbmcgbG9jYWxpemVkIHN0cmluZ3M6KipcbiAqXG4gKiBUaGVyZSBhcmUgdGhyZWUgc2NlbmFyaW9zOlxuICpcbiAqICogKipjb21waWxlLXRpbWUgaW5saW5pbmcqKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyB0cmFuc2Zvcm1lZCBhdCBjb21waWxlIHRpbWUgYnkgYVxuICogdHJhbnNwaWxlciwgcmVtb3ZpbmcgdGhlIHRhZyBhbmQgcmVwbGFjaW5nIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRoIGEgdHJhbnNsYXRlZFxuICogbGl0ZXJhbCBzdHJpbmcgZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHByb3ZpZGVkIHRvIHRoZSB0cmFuc3BpbGF0aW9uIHRvb2wuXG4gKlxuICogKiAqKnJ1bi10aW1lIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgcmVwbGFjZXMgYW5kXG4gKiByZW9yZGVycyB0aGUgcGFydHMgKHN0YXRpYyBzdHJpbmdzIGFuZCBleHByZXNzaW9ucykgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggc3RyaW5nc1xuICogZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIGxvYWRlZCBhdCBydW4tdGltZS5cbiAqXG4gKiAqICoqcGFzcy10aHJvdWdoIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgc2ltcGx5IGV2YWx1YXRlc1xuICogdGhlIG9yaWdpbmFsIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGhvdXQgYXBwbHlpbmcgYW55IHRyYW5zbGF0aW9ucyB0byB0aGUgcGFydHMuIFRoaXNcbiAqIHZlcnNpb24gaXMgdXNlZCBkdXJpbmcgZGV2ZWxvcG1lbnQgb3Igd2hlcmUgdGhlcmUgaXMgbm8gbmVlZCB0byB0cmFuc2xhdGUgdGhlIGxvY2FsaXplZFxuICogdGVtcGxhdGUgbGl0ZXJhbHMuXG4gKlxuICogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBhIGNvbGxlY3Rpb24gb2YgdGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHBhcmFtIGV4cHJlc3Npb25zIGEgY29sbGVjdGlvbiBvZiB0aGUgdmFsdWVzIG9mIGVhY2ggcGxhY2Vob2xkZXIgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAqIEByZXR1cm5zIHRoZSB0cmFuc2xhdGVkIHN0cmluZywgd2l0aCB0aGUgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBleHByZXNzaW9uc2AgaW50ZXJsZWF2ZWQgdG9nZXRoZXIuXG4gKlxuICogQGdsb2JhbEFwaVxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuID0gZnVuY3Rpb24oXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKSB7XG4gIGlmICgkbG9jYWxpemUudHJhbnNsYXRlKSB7XG4gICAgLy8gRG9uJ3QgdXNlIGFycmF5IGV4cGFuc2lvbiBoZXJlIHRvIGF2b2lkIHRoZSBjb21waWxlciBhZGRpbmcgYF9fcmVhZCgpYCBoZWxwZXIgdW5uZWNlc3NhcmlseS5cbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9ICRsb2NhbGl6ZS50cmFuc2xhdGUobWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucyk7XG4gICAgbWVzc2FnZVBhcnRzID0gdHJhbnNsYXRpb25bMF07XG4gICAgZXhwcmVzc2lvbnMgPSB0cmFuc2xhdGlvblsxXTtcbiAgfVxuICBsZXQgbWVzc2FnZSA9IHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXNzYWdlICs9IGV4cHJlc3Npb25zW2kgLSAxXSArIHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgfVxuICByZXR1cm4gbWVzc2FnZTtcbn07XG5cbmNvbnN0IEJMT0NLX01BUktFUiA9ICc6JztcblxuLyoqXG4gKiBTdHJpcCBhIGRlbGltaXRlZCBcImJsb2NrXCIgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGBtZXNzYWdlUGFydGAsIGlmIGl0IGlzIGZvdW5kLlxuICpcbiAqIElmIGEgbWFya2VyIGNoYXJhY3RlciAoOikgYWN0dWFsbHkgYXBwZWFycyBpbiB0aGUgY29udGVudCBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIG9yXG4gKiBhZnRlciBhIHN1YnN0aXR1dGlvbiBleHByZXNzaW9uLCB3aGVyZSBhIGJsb2NrIGhhcyBub3QgYmVlbiBwcm92aWRlZCB0aGUgY2hhcmFjdGVyIG11c3QgYmVcbiAqIGVzY2FwZWQgd2l0aCBhIGJhY2tzbGFzaCwgYFxcOmAuIFRoaXMgZnVuY3Rpb24gY2hlY2tzIGZvciB0aGlzIGJ5IGxvb2tpbmcgYXQgdGhlIGByYXdgXG4gKiBtZXNzYWdlUGFydCwgd2hpY2ggc2hvdWxkIHN0aWxsIGNvbnRhaW4gdGhlIGJhY2tzbGFzaC5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnQgVGhlIGNvb2tlZCBtZXNzYWdlIHBhcnQgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSByYXdNZXNzYWdlUGFydCBUaGUgcmF3IG1lc3NhZ2UgcGFydCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHRoZSBtZXNzYWdlIHBhcnQgd2l0aCB0aGUgcGxhY2Vob2xkZXIgbmFtZSBzdHJpcHBlZCwgaWYgZm91bmQuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZnVuY3Rpb24gc3RyaXBCbG9jayhtZXNzYWdlUGFydDogc3RyaW5nLCByYXdNZXNzYWdlUGFydDogc3RyaW5nKSB7XG4gIHJldHVybiByYXdNZXNzYWdlUGFydC5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/XG4gICAgICBtZXNzYWdlUGFydC5zdWJzdHJpbmcoZmluZEVuZE9mQmxvY2sobWVzc2FnZVBhcnQsIHJhd01lc3NhZ2VQYXJ0KSArIDEpIDpcbiAgICAgIG1lc3NhZ2VQYXJ0O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGVuZCBvZiBhIFwibWFya2VkIGJsb2NrXCIgaW5kaWNhdGVkIGJ5IHRoZSBmaXJzdCBub24tZXNjYXBlZCBjb2xvbi5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgc3RyaW5nICh3aGVyZSBlc2NhcGVkIGNoYXJzIGhhdmUgYmVlbiBwcm9jZXNzZWQpXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgc3RyaW5nICh3aGVyZSBlc2NhcGUgc2VxdWVuY2VzIGFyZSBzdGlsbCBpbiBwbGFjZSlcbiAqXG4gKiBAcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVuZCBvZiBibG9jayBtYXJrZXJcbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJsb2NrIGlzIHVudGVybWluYXRlZFxuICovXG5mdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyByZXBlYXRlZCBpbiBgc3JjL3V0aWxzL21lc3NhZ2VzLnRzYCBhbmQgdGhlIHR3byBzaG91bGQgYmUga2VwdCBpbiBzeW5jLlxuICAgKiBUaGUgcmVhc29uIGlzIHRoYXQgdGhpcyBmaWxlIGlzIG1hcmtlZCBhcyBoYXZpbmcgc2lkZS1lZmZlY3RzLCBhbmQgaWYgd2UgaW1wb3J0IGBtZXNzYWdlcy50c2BcbiAgICogaW50byBpdCwgdGhlIHdob2xlIG9mIGBzcmMvdXRpbHNgIHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhpcyBidW5kbGUgYW5kIG5vbmUgb2YgdGhlIGZ1bmN0aW9uc1xuICAgKiB3aWxsIGJlIHRyZWUgc2hha2VuLlxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufVxuIl19