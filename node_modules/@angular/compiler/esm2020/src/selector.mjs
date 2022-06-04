/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getHtmlTagDefinition } from './ml_parser/html_tags';
const _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' + // 1: ":not("
    '(([\\.\\#]?)[-\\w]+)|' + // 2: "tag"; 3: "."/"#";
    // "-" should appear first in the regexp below as FF31 parses "[.-\w]" as a range
    // 4: attribute; 5: attribute_string; 6: attribute_value
    '(?:\\[([-.\\w*\\\\$]+)(?:=([\"\']?)([^\\]\"\']*)\\5)?\\])|' + // "[name]", "[name=value]",
    // "[name="value"]",
    // "[name='value']"
    '(\\))|' + // 7: ")"
    '(\\s*,\\s*)', // 8: ","
'g');
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
export class CssSelector {
    constructor() {
        this.element = null;
        this.classNames = [];
        /**
         * The selectors are encoded in pairs where:
         * - even locations are attribute names
         * - odd locations are attribute values.
         *
         * Example:
         * Selector: `[key1=value1][key2]` would parse to:
         * ```
         * ['key1', 'value1', 'key2', '']
         * ```
         */
        this.attrs = [];
        this.notSelectors = [];
    }
    static parse(selector) {
        const results = [];
        const _addResult = (res, cssSel) => {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        let cssSelector = new CssSelector();
        let match;
        let current = cssSelector;
        let inNot = false;
        _SELECTOR_REGEXP.lastIndex = 0;
        while (match = _SELECTOR_REGEXP.exec(selector)) {
            if (match[1 /* NOT */]) {
                if (inNot) {
                    throw new Error('Nesting :not in a selector is not allowed');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            const tag = match[2 /* TAG */];
            if (tag) {
                const prefix = match[3 /* PREFIX */];
                if (prefix === '#') {
                    // #hash
                    current.addAttribute('id', tag.substr(1));
                }
                else if (prefix === '.') {
                    // Class
                    current.addClassName(tag.substr(1));
                }
                else {
                    // Element
                    current.setElement(tag);
                }
            }
            const attribute = match[4 /* ATTRIBUTE */];
            if (attribute) {
                current.addAttribute(current.unescapeAttribute(attribute), match[6 /* ATTRIBUTE_VALUE */]);
            }
            if (match[7 /* NOT_END */]) {
                inNot = false;
                current = cssSelector;
            }
            if (match[8 /* SEPARATOR */]) {
                if (inNot) {
                    throw new Error('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    }
    /**
     * Unescape `\$` sequences from the CSS attribute selector.
     *
     * This is needed because `$` can have a special meaning in CSS selectors,
     * but we might want to match an attribute that contains `$`.
     * [MDN web link for more
     * info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
     * @param attr the attribute to unescape.
     * @returns the unescaped string.
     */
    unescapeAttribute(attr) {
        let result = '';
        let escaping = false;
        for (let i = 0; i < attr.length; i++) {
            const char = attr.charAt(i);
            if (char === '\\') {
                escaping = true;
                continue;
            }
            if (char === '$' && !escaping) {
                throw new Error(`Error in attribute selector "${attr}". ` +
                    `Unescaped "$" is not supported. Please escape with "\\$".`);
            }
            escaping = false;
            result += char;
        }
        return result;
    }
    /**
     * Escape `$` sequences from the CSS attribute selector.
     *
     * This is needed because `$` can have a special meaning in CSS selectors,
     * with this method we are escaping `$` with `\$'.
     * [MDN web link for more
     * info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
     * @param attr the attribute to escape.
     * @returns the escaped string.
     */
    escapeAttribute(attr) {
        return attr.replace(/\\/g, '\\\\').replace(/\$/g, '\\$');
    }
    isElementSelector() {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    }
    hasElementSelector() {
        return !!this.element;
    }
    setElement(element = null) {
        this.element = element;
    }
    /** Gets a template string for an element that matches the selector. */
    getMatchingElementTemplate() {
        const tagName = this.element || 'div';
        const classAttr = this.classNames.length > 0 ? ` class="${this.classNames.join(' ')}"` : '';
        let attrs = '';
        for (let i = 0; i < this.attrs.length; i += 2) {
            const attrName = this.attrs[i];
            const attrValue = this.attrs[i + 1] !== '' ? `="${this.attrs[i + 1]}"` : '';
            attrs += ` ${attrName}${attrValue}`;
        }
        return getHtmlTagDefinition(tagName).isVoid ? `<${tagName}${classAttr}${attrs}/>` :
            `<${tagName}${classAttr}${attrs}></${tagName}>`;
    }
    getAttrs() {
        const result = [];
        if (this.classNames.length > 0) {
            result.push('class', this.classNames.join(' '));
        }
        return result.concat(this.attrs);
    }
    addAttribute(name, value = '') {
        this.attrs.push(name, value && value.toLowerCase() || '');
    }
    addClassName(name) {
        this.classNames.push(name.toLowerCase());
    }
    toString() {
        let res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(klass => res += `.${klass}`);
        }
        if (this.attrs) {
            for (let i = 0; i < this.attrs.length; i += 2) {
                const name = this.escapeAttribute(this.attrs[i]);
                const value = this.attrs[i + 1];
                res += `[${name}${value ? '=' + value : ''}]`;
            }
        }
        this.notSelectors.forEach(notSelector => res += `:not(${notSelector})`);
        return res;
    }
}
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
export class SelectorMatcher {
    constructor() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    static createNotMatcher(notSelectors) {
        const notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    }
    addSelectables(cssSelectors, callbackCtxt) {
        let listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (let i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    }
    /**
     * Add an object that can be found later on by calling `match`.
     * @param cssSelector A css selector
     * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
     */
    _addSelectable(cssSelector, callbackCtxt, listContext) {
        let matcher = this;
        const element = cssSelector.element;
        const classNames = cssSelector.classNames;
        const attrs = cssSelector.attrs;
        const selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            const isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (let i = 0; i < classNames.length; i++) {
                const isTerminal = attrs.length === 0 && i === classNames.length - 1;
                const className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (let i = 0; i < attrs.length; i += 2) {
                const isTerminal = i === attrs.length - 2;
                const name = attrs[i];
                const value = attrs[i + 1];
                if (isTerminal) {
                    const terminalMap = matcher._attrValueMap;
                    let terminalValuesMap = terminalMap.get(name);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    const partialMap = matcher._attrValuePartialMap;
                    let partialValuesMap = partialMap.get(name);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    }
    _addTerminal(map, name, selectable) {
        let terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    }
    _addPartial(map, name) {
        let matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    }
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param cssSelector A css selector
     * @param matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return boolean true if a match was found
     */
    match(cssSelector, matchedCallback) {
        let result = false;
        const element = cssSelector.element;
        const classNames = cssSelector.classNames;
        const attrs = cssSelector.attrs;
        for (let i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (let i = 0; i < classNames.length; i++) {
                const className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (let i = 0; i < attrs.length; i += 2) {
                const name = attrs[i];
                const value = attrs[i + 1];
                const terminalValuesMap = this._attrValueMap.get(name);
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                const partialValuesMap = this._attrValuePartialMap.get(name);
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    }
    /** @internal */
    _matchTerminal(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        let selectables = map.get(name) || [];
        const starSelectables = map.get('*');
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        let selectable;
        let result = false;
        for (let i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    }
    /** @internal */
    _matchPartial(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        const nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    }
}
export class SelectorListContext {
    constructor(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
}
// Store context to pass back selector and context when a selector is matched
export class SelectorContext {
    constructor(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    finalize(cssSelector, callback) {
        let result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            const notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FDL0IsY0FBYyxHQUFpQixhQUFhO0lBQ3hDLHVCQUF1QixHQUFJLHdCQUF3QjtJQUNuRCxpRkFBaUY7SUFDakYsd0RBQXdEO0lBQ3hELDREQUE0RCxHQUFJLDRCQUE0QjtJQUM1QixvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25GLFFBQVEsR0FBd0QsU0FBUztJQUN6RSxhQUFhLEVBQW1ELFNBQVM7QUFDN0UsR0FBRyxDQUFDLENBQUM7QUFnQlQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ0UsWUFBTyxHQUFnQixJQUFJLENBQUM7UUFDNUIsZUFBVSxHQUFhLEVBQUUsQ0FBQztRQUMxQjs7Ozs7Ozs7OztXQVVHO1FBQ0gsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUNyQixpQkFBWSxHQUFrQixFQUFFLENBQUM7SUFxS25DLENBQUM7SUFuS0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFnQjtRQUMzQixNQUFNLE9BQU8sR0FBa0IsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxNQUFtQixFQUFFLEVBQUU7WUFDN0QsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQ2xGLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxH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QUNoRixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzNGLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkUsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFDRCxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ2pGLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2FBQ3hDO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2V0SHRtbFRhZ0RlZmluaXRpb259IGZyb20gJy4vbWxfcGFyc2VyL2h0bWxfdGFncyc7XG5cbmNvbnN0IF9TRUxFQ1RPUl9SRUdFWFAgPSBuZXcgUmVnRXhwKFxuICAgICcoXFxcXDpub3RcXFxcKCl8JyArICAgICAgICAgICAgICAgLy8gMTogXCI6bm90KFwiXG4gICAgICAgICcoKFtcXFxcLlxcXFwjXT8pWy1cXFxcd10rKXwnICsgIC8vIDI6IFwidGFnXCI7IDM6IFwiLlwiL1wiI1wiO1xuICAgICAgICAvLyBcIi1cIiBzaG91bGQgYXBwZWFyIGZpcnN0IGluIHRoZSByZWdleHAgYmVsb3cgYXMgRkYzMSBwYXJzZXMgXCJbLi1cXHddXCIgYXMgYSByYW5nZVxuICAgICAgICAvLyA0OiBhdHRyaWJ1dGU7IDU6IGF0dHJpYnV0ZV9zdHJpbmc7IDY6IGF0dHJpYnV0ZV92YWx1ZVxuICAgICAgICAnKD86XFxcXFsoWy0uXFxcXHcqXFxcXFxcXFwkXSspKD86PShbXFxcIlxcJ10/KShbXlxcXFxdXFxcIlxcJ10qKVxcXFw1KT9cXFxcXSl8JyArICAvLyBcIltuYW1lXVwiLCBcIltuYW1lPXZhbHVlXVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJbbmFtZT1cInZhbHVlXCJdXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcIltuYW1lPSd2YWx1ZSddXCJcbiAgICAgICAgJyhcXFxcKSl8JyArICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNzogXCIpXCJcbiAgICAgICAgJyhcXFxccyosXFxcXHMqKScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA4OiBcIixcIlxuICAgICdnJyk7XG5cbi8qKlxuICogVGhlc2Ugb2Zmc2V0cyBzaG91bGQgbWF0Y2ggdGhlIG1hdGNoLWdyb3VwcyBpbiBgX1NFTEVDVE9SX1JFR0VYUGAgb2Zmc2V0cy5cbiAqL1xuY29uc3QgZW51bSBTZWxlY3RvclJlZ2V4cCB7XG4gIEFMTCA9IDAsICAvLyBUaGUgd2hvbGUgbWF0Y2hcbiAgTk9UID0gMSxcbiAgVEFHID0gMixcbiAgUFJFRklYID0gMyxcbiAgQVRUUklCVVRFID0gNCxcbiAgQVRUUklCVVRFX1NUUklORyA9IDUsXG4gIEFUVFJJQlVURV9WQUxVRSA9IDYsXG4gIE5PVF9FTkQgPSA3LFxuICBTRVBBUkFUT1IgPSA4LFxufVxuLyoqXG4gKiBBIGNzcyBzZWxlY3RvciBjb250YWlucyBhbiBlbGVtZW50IG5hbWUsXG4gKiBjc3MgY2xhc3NlcyBhbmQgYXR0cmlidXRlL3ZhbHVlIHBhaXJzIHdpdGggdGhlIHB1cnBvc2VcbiAqIG9mIHNlbGVjdGluZyBzdWJzZXRzIG91dCBvZiB0aGVtLlxuICovXG5leHBvcnQgY2xhc3MgQ3NzU2VsZWN0b3Ige1xuICBlbGVtZW50OiBzdHJpbmd8bnVsbCA9IG51bGw7XG4gIGNsYXNzTmFtZXM6IHN0cmluZ1tdID0gW107XG4gIC8qKlxuICAgKiBUaGUgc2VsZWN0b3JzIGFyZSBlbmNvZGVkIGluIHBhaXJzIHdoZXJlOlxuICAgKiAtIGV2ZW4gbG9jYXRpb25zIGFyZSBhdHRyaWJ1dGUgbmFtZXNcbiAgICogLSBvZGQgbG9jYXRpb25zIGFyZSBhdHRyaWJ1dGUgdmFsdWVzLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBTZWxlY3RvcjogYFtrZXkxPXZhbHVlMV1ba2V5Ml1gIHdvdWxkIHBhcnNlIHRvOlxuICAgKiBgYGBcbiAgICogWydrZXkxJywgJ3ZhbHVlMScsICdrZXkyJywgJyddXG4gICAqIGBgYFxuICAgKi9cbiAgYXR0cnM6IHN0cmluZ1tdID0gW107XG4gIG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSA9IFtdO1xuXG4gIHN0YXRpYyBwYXJzZShzZWxlY3Rvcjogc3RyaW5nKTogQ3NzU2VsZWN0b3JbXSB7XG4gICAgY29uc3QgcmVzdWx0czogQ3NzU2VsZWN0b3JbXSA9IFtdO1xuICAgIGNvbnN0IF9hZGRSZXN1bHQgPSAocmVzOiBDc3NTZWxlY3RvcltdLCBjc3NTZWw6IENzc1NlbGVjdG9yKSA9PiB7XG4gICAgICBpZiAoY3NzU2VsLm5vdFNlbGVjdG9ycy5sZW5ndGggPiAwICYmICFjc3NTZWwuZWxlbWVudCAmJiBjc3NTZWwuY2xhc3NOYW1lcy5sZW5ndGggPT0gMCAmJlxuICAgICAgICAgIGNzc1NlbC5hdHRycy5sZW5ndGggPT0gMCkge1xuICAgICAgICBjc3NTZWwuZWxlbWVudCA9ICcqJztcbiAgICAgIH1cbiAgICAgIHJlcy5wdXNoKGNzc1NlbCk7XG4gICAgfTtcbiAgICBsZXQgY3NzU2VsZWN0b3IgPSBuZXcgQ3NzU2VsZWN0b3IoKTtcbiAgICBsZXQgbWF0Y2g6IHN0cmluZ1tdfG51bGw7XG4gICAgbGV0IGN1cnJlbnQgPSBjc3NTZWxlY3RvcjtcbiAgICBsZXQgaW5Ob3QgPSBmYWxzZTtcbiAgICBfU0VMRUNUT1JfUkVHRVhQLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKG1hdGNoID0gX1NFTEVDVE9SX1JFR0VYUC5leGVjKHNlbGVjdG9yKSkge1xuICAgICAgaWYgKG1hdGNoW1NlbGVjdG9yUmVnZXhwLk5PVF0pIHtcbiAgICAgICAgaWYgKGluTm90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0aW5nIDpub3QgaW4gYSBzZWxlY3RvciBpcyBub3QgYWxsb3dlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGluTm90ID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudCA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgICAgICBjc3NTZWxlY3Rvci5ub3RTZWxlY3RvcnMucHVzaChjdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRhZyA9IG1hdGNoW1NlbGVjdG9yUmVnZXhwLlRBR107XG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IG1hdGNoW1NlbGVjdG9yUmVnZXhwLlBSRUZJWF07XG4gICAgICAgIGlmIChwcmVmaXggPT09ICcjJykge1xuICAgICAgICAgIC8vICNoYXNoXG4gICAgICAgICAgY3VycmVudC5hZGRBdHRyaWJ1dGUoJ2lkJywgdGFnLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJlZml4ID09PSAnLicpIHtcbiAgICAgICAgICAvLyBDbGFzc1xuICAgICAgICAgIGN1cnJlbnQuYWRkQ2xhc3NOYW1lKHRhZy5zdWJzdHIoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVsZW1lbnRcbiAgICAgICAgICBjdXJyZW50LnNldEVsZW1lbnQodGFnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgYXR0cmlidXRlID0gbWF0Y2hbU2VsZWN0b3JSZWdleHAuQVRUUklCVVRFXTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZSkge1xuICAgICAgICBjdXJyZW50LmFkZEF0dHJpYnV0ZShcbiAgICAgICAgICAgIGN1cnJlbnQudW5lc2NhcGVBdHRyaWJ1dGUoYXR0cmlidXRlKSwgbWF0Y2hbU2VsZWN0b3JSZWdleHAuQVRUUklCVVRFX1ZBTFVFXSk7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hbU2VsZWN0b3JSZWdleHAuTk9UX0VORF0pIHtcbiAgICAgICAgaW5Ob3QgPSBmYWxzZTtcbiAgICAgICAgY3VycmVudCA9IGNzc1NlbGVjdG9yO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoW1NlbGVjdG9yUmVnZXhwLlNFUEFSQVRPUl0pIHtcbiAgICAgICAgaWYgKGluTm90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aXBsZSBzZWxlY3RvcnMgaW4gOm5vdCBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIF9hZGRSZXN1bHQocmVzdWx0cywgY3NzU2VsZWN0b3IpO1xuICAgICAgICBjc3NTZWxlY3RvciA9IGN1cnJlbnQgPSBuZXcgQ3NzU2VsZWN0b3IoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX2FkZFJlc3VsdChyZXN1bHRzLCBjc3NTZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvKipcbiAgICogVW5lc2NhcGUgYFxcJGAgc2VxdWVuY2VzIGZyb20gdGhlIENTUyBhdHRyaWJ1dGUgc2VsZWN0b3IuXG4gICAqXG4gICAqIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgYCRgIGNhbiBoYXZlIGEgc3BlY2lhbCBtZWFuaW5nIGluIENTUyBzZWxlY3RvcnMsXG4gICAqIGJ1dCB3ZSBtaWdodCB3YW50IHRvIG1hdGNoIGFuIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIGAkYC5cbiAgICogW01ETiB3ZWIgbGluayBmb3IgbW9yZVxuICAgKiBpbmZvXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQXR0cmlidXRlX3NlbGVjdG9ycykuXG4gICAqIEBwYXJhbSBhdHRyIHRoZSBhdHRyaWJ1dGUgdG8gdW5lc2NhcGUuXG4gICAqIEByZXR1cm5zIHRoZSB1bmVzY2FwZWQgc3RyaW5nLlxuICAgKi9cbiAgdW5lc2NhcGVBdHRyaWJ1dGUoYXR0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgbGV0IGVzY2FwaW5nID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gYXR0ci5jaGFyQXQoaSk7XG4gICAgICBpZiAoY2hhciA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGVzY2FwaW5nID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoY2hhciA9PT0gJyQnICYmICFlc2NhcGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRXJyb3IgaW4gYXR0cmlidXRlIHNlbGVjdG9yIFwiJHthdHRyfVwiLiBgICtcbiAgICAgICAgICAgIGBVbmVzY2FwZWQgXCIkXCIgaXMgbm90IHN1cHBvcnRlZC4gUGxlYXNlIGVzY2FwZSB3aXRoIFwiXFxcXCRcIi5gKTtcbiAgICAgIH1cbiAgICAgIGVzY2FwaW5nID0gZmFsc2U7XG4gICAgICByZXN1bHQgKz0gY2hhcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFc2NhcGUgYCRgIHNlcXVlbmNlcyBmcm9tIHRoZSBDU1MgYXR0cmlidXRlIHNlbGVjdG9yLlxuICAgKlxuICAgKiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIGAkYCBjYW4gaGF2ZSBhIHNwZWNpYWwgbWVhbmluZyBpbiBDU1Mgc2VsZWN0b3JzLFxuICAgKiB3aXRoIHRoaXMgbWV0aG9kIHdlIGFyZSBlc2NhcGluZyBgJGAgd2l0aCBgXFwkJy5cbiAgICogW01ETiB3ZWIgbGluayBmb3IgbW9yZVxuICAgKiBpbmZvXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQXR0cmlidXRlX3NlbGVjdG9ycykuXG4gICAqIEBwYXJhbSBhdHRyIHRoZSBhdHRyaWJ1dGUgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuwqBcbiAgICovXG4gIGVzY2FwZUF0dHJpYnV0ZShhdHRyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBhdHRyLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXFwkL2csICdcXFxcJCcpO1xuICB9XG5cbiAgaXNFbGVtZW50U2VsZWN0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaGFzRWxlbWVudFNlbGVjdG9yKCkgJiYgdGhpcy5jbGFzc05hbWVzLmxlbmd0aCA9PSAwICYmIHRoaXMuYXR0cnMubGVuZ3RoID09IDAgJiZcbiAgICAgICAgdGhpcy5ub3RTZWxlY3RvcnMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgaGFzRWxlbWVudFNlbGVjdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIHNldEVsZW1lbnQoZWxlbWVudDogc3RyaW5nfG51bGwgPSBudWxsKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgdGVtcGxhdGUgc3RyaW5nIGZvciBhbiBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IuICovXG4gIGdldE1hdGNoaW5nRWxlbWVudFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgdGFnTmFtZSA9IHRoaXMuZWxlbWVudCB8fCAnZGl2JztcbiAgICBjb25zdCBjbGFzc0F0dHIgPSB0aGlzLmNsYXNzTmFtZXMubGVuZ3RoID4gMCA/IGAgY2xhc3M9XCIke3RoaXMuY2xhc3NOYW1lcy5qb2luKCcgJyl9XCJgIDogJyc7XG5cbiAgICBsZXQgYXR0cnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gdGhpcy5hdHRyc1tpXTtcbiAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IHRoaXMuYXR0cnNbaSArIDFdICE9PSAnJyA/IGA9XCIke3RoaXMuYXR0cnNbaSArIDFdfVwiYCA6ICcnO1xuICAgICAgYXR0cnMgKz0gYCAke2F0dHJOYW1lfSR7YXR0clZhbHVlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldEh0bWxUYWdEZWZpbml0aW9uKHRhZ05hbWUpLmlzVm9pZCA/IGA8JHt0YWdOYW1lfSR7Y2xhc3NBdHRyfSR7YXR0cnN9Lz5gIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDwke3RhZ05hbWV9JHtjbGFzc0F0dHJ9JHthdHRyc30+PC8ke3RhZ05hbWV9PmA7XG4gIH1cblxuICBnZXRBdHRycygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNsYXNzTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2goJ2NsYXNzJywgdGhpcy5jbGFzc05hbWVzLmpvaW4oJyAnKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQuY29uY2F0KHRoaXMuYXR0cnMpO1xuICB9XG5cbiAgYWRkQXR0cmlidXRlKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5hdHRycy5wdXNoKG5hbWUsIHZhbHVlICYmIHZhbHVlLnRvTG93ZXJDYXNlKCkgfHwgJycpO1xuICB9XG5cbiAgYWRkQ2xhc3NOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuY2xhc3NOYW1lcy5wdXNoKG5hbWUudG9Mb3dlckNhc2UoKSk7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGxldCByZXM6IHN0cmluZyA9IHRoaXMuZWxlbWVudCB8fCAnJztcbiAgICBpZiAodGhpcy5jbGFzc05hbWVzKSB7XG4gICAgICB0aGlzLmNsYXNzTmFtZXMuZm9yRWFjaChrbGFzcyA9PiByZXMgKz0gYC4ke2tsYXNzfWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5hdHRycykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmF0dHJzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmVzY2FwZUF0dHJpYnV0ZSh0aGlzLmF0dHJzW2ldKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmF0dHJzW2kgKyAxXTtcbiAgICAgICAgcmVzICs9IGBbJHtuYW1lfSR7dmFsdWUgPyAnPScgKyB2YWx1ZSA6ICcnfV1gO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm5vdFNlbGVjdG9ycy5mb3JFYWNoKG5vdFNlbGVjdG9yID0+IHJlcyArPSBgOm5vdCgke25vdFNlbGVjdG9yfSlgKTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbi8qKlxuICogUmVhZHMgYSBsaXN0IG9mIENzc1NlbGVjdG9ycyBhbmQgYWxsb3dzIHRvIGNhbGN1bGF0ZSB3aGljaCBvbmVzXG4gKiBhcmUgY29udGFpbmVkIGluIGEgZ2l2ZW4gQ3NzU2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvck1hdGNoZXI8VCA9IGFueT4ge1xuICBzdGF0aWMgY3JlYXRlTm90TWF0Y2hlcihub3RTZWxlY3RvcnM6IENzc1NlbGVjdG9yW10pOiBTZWxlY3Rvck1hdGNoZXI8bnVsbD4ge1xuICAgIGNvbnN0IG5vdE1hdGNoZXIgPSBuZXcgU2VsZWN0b3JNYXRjaGVyPG51bGw+KCk7XG4gICAgbm90TWF0Y2hlci5hZGRTZWxlY3RhYmxlcyhub3RTZWxlY3RvcnMsIG51bGwpO1xuICAgIHJldHVybiBub3RNYXRjaGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfZWxlbWVudE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHQ8VD5bXT4oKTtcbiAgcHJpdmF0ZSBfZWxlbWVudFBhcnRpYWxNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPFQ+PigpO1xuICBwcml2YXRlIF9jbGFzc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHQ8VD5bXT4oKTtcbiAgcHJpdmF0ZSBfY2xhc3NQYXJ0aWFsTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcjxUPj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlTWFwID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dDxUPltdPj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlUGFydGlhbE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI8VD4+PigpO1xuICBwcml2YXRlIF9saXN0Q29udGV4dHM6IFNlbGVjdG9yTGlzdENvbnRleHRbXSA9IFtdO1xuXG4gIGFkZFNlbGVjdGFibGVzKGNzc1NlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSwgY2FsbGJhY2tDdHh0PzogVCkge1xuICAgIGxldCBsaXN0Q29udGV4dDogU2VsZWN0b3JMaXN0Q29udGV4dCA9IG51bGwhO1xuICAgIGlmIChjc3NTZWxlY3RvcnMubGVuZ3RoID4gMSkge1xuICAgICAgbGlzdENvbnRleHQgPSBuZXcgU2VsZWN0b3JMaXN0Q29udGV4dChjc3NTZWxlY3RvcnMpO1xuICAgICAgdGhpcy5fbGlzdENvbnRleHRzLnB1c2gobGlzdENvbnRleHQpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNzc1NlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fYWRkU2VsZWN0YWJsZShjc3NTZWxlY3RvcnNbaV0sIGNhbGxiYWNrQ3R4dCBhcyBULCBsaXN0Q29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBvYmplY3QgdGhhdCBjYW4gYmUgZm91bmQgbGF0ZXIgb24gYnkgY2FsbGluZyBgbWF0Y2hgLlxuICAgKiBAcGFyYW0gY3NzU2VsZWN0b3IgQSBjc3Mgc2VsZWN0b3JcbiAgICogQHBhcmFtIGNhbGxiYWNrQ3R4dCBBbiBvcGFxdWUgb2JqZWN0IHRoYXQgd2lsbCBiZSBnaXZlbiB0byB0aGUgY2FsbGJhY2sgb2YgdGhlIGBtYXRjaGAgZnVuY3Rpb25cbiAgICovXG4gIHByaXZhdGUgX2FkZFNlbGVjdGFibGUoXG4gICAgICBjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsIGNhbGxiYWNrQ3R4dDogVCwgbGlzdENvbnRleHQ6IFNlbGVjdG9yTGlzdENvbnRleHQpIHtcbiAgICBsZXQgbWF0Y2hlcjogU2VsZWN0b3JNYXRjaGVyPFQ+ID0gdGhpcztcbiAgICBjb25zdCBlbGVtZW50ID0gY3NzU2VsZWN0b3IuZWxlbWVudDtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3NzU2VsZWN0b3IuY2xhc3NOYW1lcztcbiAgICBjb25zdCBhdHRycyA9IGNzc1NlbGVjdG9yLmF0dHJzO1xuICAgIGNvbnN0IHNlbGVjdGFibGUgPSBuZXcgU2VsZWN0b3JDb250ZXh0KGNzc1NlbGVjdG9yLCBjYWxsYmFja0N0eHQsIGxpc3RDb250ZXh0KTtcblxuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICBjb25zdCBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGNsYXNzTmFtZXMubGVuZ3RoID09PSAwO1xuICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgdGhpcy5fYWRkVGVybWluYWwobWF0Y2hlci5fZWxlbWVudE1hcCwgZWxlbWVudCwgc2VsZWN0YWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9lbGVtZW50UGFydGlhbE1hcCwgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsYXNzTmFtZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGkgPT09IGNsYXNzTmFtZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tpXTtcbiAgICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRUZXJtaW5hbChtYXRjaGVyLl9jbGFzc01hcCwgY2xhc3NOYW1lLCBzZWxlY3RhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY29uc3QgaXNUZXJtaW5hbCA9IGkgPT09IGF0dHJzLmxlbmd0aCAtIDI7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyc1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1tpICsgMV07XG4gICAgICAgIGlmIChpc1Rlcm1pbmFsKSB7XG4gICAgICAgICAgY29uc3QgdGVybWluYWxNYXAgPSBtYXRjaGVyLl9hdHRyVmFsdWVNYXA7XG4gICAgICAgICAgbGV0IHRlcm1pbmFsVmFsdWVzTWFwID0gdGVybWluYWxNYXAuZ2V0KG5hbWUpO1xuICAgICAgICAgIGlmICghdGVybWluYWxWYWx1ZXNNYXApIHtcbiAgICAgICAgICAgIHRlcm1pbmFsVmFsdWVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dDxUPltdPigpO1xuICAgICAgICAgICAgdGVybWluYWxNYXAuc2V0KG5hbWUsIHRlcm1pbmFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fYWRkVGVybWluYWwodGVybWluYWxWYWx1ZXNNYXAsIHZhbHVlLCBzZWxlY3RhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwYXJ0aWFsTWFwID0gbWF0Y2hlci5fYXR0clZhbHVlUGFydGlhbE1hcDtcbiAgICAgICAgICBsZXQgcGFydGlhbFZhbHVlc01hcCA9IHBhcnRpYWxNYXAuZ2V0KG5hbWUpO1xuICAgICAgICAgIGlmICghcGFydGlhbFZhbHVlc01hcCkge1xuICAgICAgICAgICAgcGFydGlhbFZhbHVlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI8VD4+KCk7XG4gICAgICAgICAgICBwYXJ0aWFsTWFwLnNldChuYW1lLCBwYXJ0aWFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlciA9IHRoaXMuX2FkZFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWRkVGVybWluYWwoXG4gICAgICBtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dDxUPltdPiwgbmFtZTogc3RyaW5nLCBzZWxlY3RhYmxlOiBTZWxlY3RvckNvbnRleHQ8VD4pIHtcbiAgICBsZXQgdGVybWluYWxMaXN0ID0gbWFwLmdldChuYW1lKTtcbiAgICBpZiAoIXRlcm1pbmFsTGlzdCkge1xuICAgICAgdGVybWluYWxMaXN0ID0gW107XG4gICAgICBtYXAuc2V0KG5hbWUsIHRlcm1pbmFsTGlzdCk7XG4gICAgfVxuICAgIHRlcm1pbmFsTGlzdC5wdXNoKHNlbGVjdGFibGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkUGFydGlhbChtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcjxUPj4sIG5hbWU6IHN0cmluZyk6IFNlbGVjdG9yTWF0Y2hlcjxUPiB7XG4gICAgbGV0IG1hdGNoZXIgPSBtYXAuZ2V0KG5hbWUpO1xuICAgIGlmICghbWF0Y2hlcikge1xuICAgICAgbWF0Y2hlciA9IG5ldyBTZWxlY3Rvck1hdGNoZXI8VD4oKTtcbiAgICAgIG1hcC5zZXQobmFtZSwgbWF0Y2hlcik7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG9iamVjdHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdmlhIGBhZGRTZWxlY3RhYmxlYFxuICAgKiB3aG9zZSBjc3Mgc2VsZWN0b3IgaXMgY29udGFpbmVkIGluIHRoZSBnaXZlbiBjc3Mgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBjc3NTZWxlY3RvciBBIGNzcyBzZWxlY3RvclxuICAgKiBAcGFyYW0gbWF0Y2hlZENhbGxiYWNrIFRoaXMgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgb2JqZWN0IGhhbmRlZCBpbnRvIGBhZGRTZWxlY3RhYmxlYFxuICAgKiBAcmV0dXJuIGJvb2xlYW4gdHJ1ZSBpZiBhIG1hdGNoIHdhcyBmb3VuZFxuICAgKi9cbiAgbWF0Y2goY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2s6ICgoYzogQ3NzU2VsZWN0b3IsIGE6IFQpID0+IHZvaWQpfG51bGwpOiBib29sZWFuIHtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgY29uc3QgZWxlbWVudCA9IGNzc1NlbGVjdG9yLmVsZW1lbnQhO1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjc3NTZWxlY3Rvci5jbGFzc05hbWVzO1xuICAgIGNvbnN0IGF0dHJzID0gY3NzU2VsZWN0b3IuYXR0cnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xpc3RDb250ZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbGlzdENvbnRleHRzW2ldLmFscmVhZHlNYXRjaGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hUZXJtaW5hbCh0aGlzLl9lbGVtZW50TWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hQYXJ0aWFsKHRoaXMuX2VsZW1lbnRQYXJ0aWFsTWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoY2xhc3NOYW1lcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbaV07XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFRlcm1pbmFsKHRoaXMuX2NsYXNzTWFwLCBjbGFzc05hbWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoUGFydGlhbCh0aGlzLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHxcbiAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGF0dHJzW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJzW2kgKyAxXTtcblxuICAgICAgICBjb25zdCB0ZXJtaW5hbFZhbHVlc01hcCA9IHRoaXMuX2F0dHJWYWx1ZU1hcC5nZXQobmFtZSkhO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXN1bHQgPVxuICAgICAgICAgICAgICB0aGlzLl9tYXRjaFRlcm1pbmFsKHRlcm1pbmFsVmFsdWVzTWFwLCAnJywgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFRlcm1pbmFsKHRlcm1pbmFsVmFsdWVzTWFwLCB2YWx1ZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuXG4gICAgICAgIGNvbnN0IHBhcnRpYWxWYWx1ZXNNYXAgPSB0aGlzLl9hdHRyVmFsdWVQYXJ0aWFsTWFwLmdldChuYW1lKSE7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hdGNoUGFydGlhbChwYXJ0aWFsVmFsdWVzTWFwLCAnJywgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgdmFsdWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX21hdGNoVGVybWluYWwoXG4gICAgICBtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dDxUPltdPiwgbmFtZTogc3RyaW5nLCBjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsXG4gICAgICBtYXRjaGVkQ2FsbGJhY2s6ICgoYzogQ3NzU2VsZWN0b3IsIGE6IGFueSkgPT4gdm9pZCl8bnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghbWFwIHx8IHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RhYmxlczogU2VsZWN0b3JDb250ZXh0PFQ+W10gPSBtYXAuZ2V0KG5hbWUpIHx8IFtdO1xuICAgIGNvbnN0IHN0YXJTZWxlY3RhYmxlczogU2VsZWN0b3JDb250ZXh0PFQ+W10gPSBtYXAuZ2V0KCcqJykhO1xuICAgIGlmIChzdGFyU2VsZWN0YWJsZXMpIHtcbiAgICAgIHNlbGVjdGFibGVzID0gc2VsZWN0YWJsZXMuY29uY2F0KHN0YXJTZWxlY3RhYmxlcyk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RhYmxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHNlbGVjdGFibGU6IFNlbGVjdG9yQ29udGV4dDxUPjtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgc2VsZWN0YWJsZSA9IHNlbGVjdGFibGVzW2ldO1xuICAgICAgcmVzdWx0ID0gc2VsZWN0YWJsZS5maW5hbGl6ZShjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9tYXRjaFBhcnRpYWwoXG4gICAgICBtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcjxUPj4sIG5hbWU6IHN0cmluZywgY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLFxuICAgICAgbWF0Y2hlZENhbGxiYWNrOiAoKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQpfG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIW1hcCB8fCB0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXN0ZWRTZWxlY3RvciA9IG1hcC5nZXQobmFtZSk7XG4gICAgaWYgKCFuZXN0ZWRTZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBUT0RPKHBlcmYpOiBnZXQgcmlkIG9mIHJlY3Vyc2lvbiBhbmQgbWVhc3VyZSBhZ2FpblxuICAgIC8vIFRPRE8ocGVyZik6IGRvbid0IHBhc3MgdGhlIHdob2xlIHNlbGVjdG9yIGludG8gdGhlIHJlY3Vyc2lvbixcbiAgICAvLyBidXQgb25seSB0aGUgbm90IHByb2Nlc3NlZCBwYXJ0c1xuICAgIHJldHVybiBuZXN0ZWRTZWxlY3Rvci5tYXRjaChjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvckxpc3RDb250ZXh0IHtcbiAgYWxyZWFkeU1hdGNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdKSB7fVxufVxuXG4vLyBTdG9yZSBjb250ZXh0IHRvIHBhc3MgYmFjayBzZWxlY3RvciBhbmQgY29udGV4dCB3aGVuIGEgc2VsZWN0b3IgaXMgbWF0Y2hlZFxuZXhwb3J0IGNsYXNzIFNlbGVjdG9yQ29udGV4dDxUID0gYW55PiB7XG4gIG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzZWxlY3RvcjogQ3NzU2VsZWN0b3IsIHB1YmxpYyBjYkNvbnRleHQ6IFQsIHB1YmxpYyBsaXN0Q29udGV4dDogU2VsZWN0b3JMaXN0Q29udGV4dCkge1xuICAgIHRoaXMubm90U2VsZWN0b3JzID0gc2VsZWN0b3Iubm90U2VsZWN0b3JzO1xuICB9XG5cbiAgZmluYWxpemUoY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBjYWxsYmFjazogKChjOiBDc3NTZWxlY3RvciwgYTogVCkgPT4gdm9pZCl8bnVsbCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGlmICh0aGlzLm5vdFNlbGVjdG9ycy5sZW5ndGggPiAwICYmICghdGhpcy5saXN0Q29udGV4dCB8fCAhdGhpcy5saXN0Q29udGV4dC5hbHJlYWR5TWF0Y2hlZCkpIHtcbiAgICAgIGNvbnN0IG5vdE1hdGNoZXIgPSBTZWxlY3Rvck1hdGNoZXIuY3JlYXRlTm90TWF0Y2hlcih0aGlzLm5vdFNlbGVjdG9ycyk7XG4gICAgICByZXN1bHQgPSAhbm90TWF0Y2hlci5tYXRjaChjc3NTZWxlY3RvciwgbnVsbCk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgY2FsbGJhY2sgJiYgKCF0aGlzLmxpc3RDb250ZXh0IHx8ICF0aGlzLmxpc3RDb250ZXh0LmFscmVhZHlNYXRjaGVkKSkge1xuICAgICAgaWYgKHRoaXMubGlzdENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5saXN0Q29udGV4dC5hbHJlYWR5TWF0Y2hlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjYWxsYmFjayh0aGlzLnNlbGVjdG9yLCB0aGlzLmNiQ29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==