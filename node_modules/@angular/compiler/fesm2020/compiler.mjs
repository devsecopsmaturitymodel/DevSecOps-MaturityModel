/**
 * @license Angular v13.3.10
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TagContentType;
(function (TagContentType) {
    TagContentType[TagContentType["RAW_TEXT"] = 0] = "RAW_TEXT";
    TagContentType[TagContentType["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
    TagContentType[TagContentType["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
})(TagContentType || (TagContentType = {}));
function splitNsName(elementName) {
    if (elementName[0] != ':') {
        return [null, elementName];
    }
    const colonIndex = elementName.indexOf(':', 1);
    if (colonIndex === -1) {
        throw new Error(`Unsupported format "${elementName}" expecting ":namespace:name"`);
    }
    return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
}
// `<ng-container>` tags work the same regardless the namespace
function isNgContainer(tagName) {
    return splitNsName(tagName)[1] === 'ng-container';
}
// `<ng-content>` tags work the same regardless the namespace
function isNgContent(tagName) {
    return splitNsName(tagName)[1] === 'ng-content';
}
// `<ng-template>` tags work the same regardless the namespace
function isNgTemplate(tagName) {
    return splitNsName(tagName)[1] === 'ng-template';
}
function getNsPrefix(fullName) {
    return fullName === null ? null : splitNsName(fullName)[0];
}
function mergeNsAndName(prefix, localName) {
    return prefix ? `:${prefix}:${localName}` : localName;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class HtmlTagDefinition {
    constructor({ closedByChildren, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false, preventNamespaceInheritance = false } = {}) {
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(tagName => this.closedByChildren[tagName] = true);
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
        this.preventNamespaceInheritance = preventNamespaceInheritance;
    }
    isClosedByChild(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    }
    getContentType(prefix) {
        if (typeof this.contentType === 'object') {
            const overrideType = prefix === undefined ? undefined : this.contentType[prefix];
            return overrideType ?? this.contentType.default;
        }
        return this.contentType;
    }
}
let _DEFAULT_TAG_DEFINITION;
// see https://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
let TAG_DEFINITIONS;
function getHtmlTagDefinition(tagName) {
    if (!TAG_DEFINITIONS) {
        _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
        TAG_DEFINITIONS = {
            'base': new HtmlTagDefinition({ isVoid: true }),
            'meta': new HtmlTagDefinition({ isVoid: true }),
            'area': new HtmlTagDefinition({ isVoid: true }),
            'embed': new HtmlTagDefinition({ isVoid: true }),
            'link': new HtmlTagDefinition({ isVoid: true }),
            'img': new HtmlTagDefinition({ isVoid: true }),
            'input': new HtmlTagDefinition({ isVoid: true }),
            'param': new HtmlTagDefinition({ isVoid: true }),
            'hr': new HtmlTagDefinition({ isVoid: true }),
            'br': new HtmlTagDefinition({ isVoid: true }),
            'source': new HtmlTagDefinition({ isVoid: true }),
            'track': new HtmlTagDefinition({ isVoid: true }),
            'wbr': new HtmlTagDefinition({ isVoid: true }),
            'p': new HtmlTagDefinition({
                closedByChildren: [
                    'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
                    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
                    'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol',
                    'p', 'pre', 'section', 'table', 'ul'
                ],
                closedByParent: true
            }),
            'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
            'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
            'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
            'tr': new HtmlTagDefinition({ closedByChildren: ['tr'], closedByParent: true }),
            'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'col': new HtmlTagDefinition({ isVoid: true }),
            'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
            'foreignObject': new HtmlTagDefinition({
                // Usually the implicit namespace here would be redundant since it will be inherited from
                // the parent `svg`, but we have to do it for `foreignObject`, because the way the parser
                // works is that the parent node of an end tag is its own start tag which means that
                // the `preventNamespaceInheritance` on `foreignObject` would have it default to the
                // implicit namespace which is `html`, unless specified otherwise.
                implicitNamespacePrefix: 'svg',
                // We want to prevent children of foreignObject from inheriting its namespace, because
                // the point of the element is to allow nodes from other namespaces to be inserted.
                preventNamespaceInheritance: true,
            }),
            'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
            'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
            'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
            'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
            'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
            'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
            'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
            'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'title': new HtmlTagDefinition({
                // The browser supports two separate `title` tags which have to use
                // a different content type: `HTMLTitleElement` and `SVGTitleElement`
                contentType: { default: TagContentType.ESCAPABLE_RAW_TEXT, svg: TagContentType.PARSABLE_DATA }
            }),
            'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
        };
    }
    // We have to make both a case-sensitive and a case-insensitive lookup, because
    // HTML tag names are case insensitive, whereas some SVG tags are case sensitive.
    return TAG_DEFINITIONS[tagName] ?? TAG_DEFINITIONS[tagName.toLowerCase()] ??
        _DEFAULT_TAG_DEFINITION;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
class CssSelector {
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
class SelectorMatcher {
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
class SelectorListContext {
    constructor(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
}
// Store context to pass back selector and context when a selector is matched
class SelectorContext {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Stores the default value of `emitDistinctChangesOnly` when the `emitDistinctChangesOnly` is not
// explicitly set.
const emitDistinctChangesOnlyDefaultValue = true;
var ViewEncapsulation;
(function (ViewEncapsulation) {
    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
    // Historically the 1 value was for `Native` encapsulation which has been removed as of v11.
    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
})(ViewEncapsulation || (ViewEncapsulation = {}));
var ChangeDetectionStrategy;
(function (ChangeDetectionStrategy) {
    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
const CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
const NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
const Type$1 = Function;
var SecurityContext;
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext || (SecurityContext = {}));
var MissingTranslationStrategy;
(function (MissingTranslationStrategy) {
    MissingTranslationStrategy[MissingTranslationStrategy["Error"] = 0] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy["Warning"] = 1] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy || (MissingTranslationStrategy = {}));
function parserSelectorToSimpleSelector(selector) {
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    const elementName = selector.element && selector.element !== '*' ? selector.element : '';
    return [elementName, ...selector.attrs, ...classes];
}
function parserSelectorToNegativeSelector(selector) {
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    if (selector.element) {
        return [
            1 /* NOT */ | 4 /* ELEMENT */, selector.element, ...selector.attrs, ...classes
        ];
    }
    else if (selector.attrs.length) {
        return [1 /* NOT */ | 2 /* ATTRIBUTE */, ...selector.attrs, ...classes];
    }
    else {
        return selector.classNames && selector.classNames.length ?
            [1 /* NOT */ | 8 /* CLASS */, ...selector.classNames] :
            [];
    }
}
function parserSelectorToR3Selector(selector) {
    const positive = parserSelectorToSimpleSelector(selector);
    const negative = selector.notSelectors && selector.notSelectors.length ?
        selector.notSelectors.map(notSelector => parserSelectorToNegativeSelector(notSelector)) :
        [];
    return positive.concat(...negative);
}
function parseSelectorToR3Selector(selector) {
    return selector ? CssSelector.parse(selector).map(parserSelectorToR3Selector) : [];
}

var core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    emitDistinctChangesOnlyDefaultValue: emitDistinctChangesOnlyDefaultValue,
    get ViewEncapsulation () { return ViewEncapsulation; },
    get ChangeDetectionStrategy () { return ChangeDetectionStrategy; },
    CUSTOM_ELEMENTS_SCHEMA: CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA: NO_ERRORS_SCHEMA,
    Type: Type$1,
    get SecurityContext () { return SecurityContext; },
    get MissingTranslationStrategy () { return MissingTranslationStrategy; },
    parseSelectorToR3Selector: parseSelectorToR3Selector
});

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
function splitAtColon(input, defaultValues) {
    return _splitAt(input, ':', defaultValues);
}
function splitAtPeriod(input, defaultValues) {
    return _splitAt(input, '.', defaultValues);
}
function _splitAt(input, character, defaultValues) {
    const characterIndex = input.indexOf(character);
    if (characterIndex == -1)
        return defaultValues;
    return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
function noUndefined(val) {
    return val === undefined ? null : val;
}
function error(msg) {
    throw new Error(`Internal Error: ${msg}`);
}
// Escape characters that have a special meaning in Regular Expressions
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
function utf8Encode(str) {
    let encoded = [];
    for (let index = 0; index < str.length; index++) {
        let codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            const low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded.push(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded.push(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded.push((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded.push(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (Array.isArray(token)) {
        return '[' + token.map(stringify).join(', ') + ']';
    }
    if (token == null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return `${token.overriddenName}`;
    }
    if (token.name) {
        return `${token.name}`;
    }
    if (!token.toString) {
        return 'object';
    }
    // WARNING: do not try to `JSON.stringify(token)` here
    // see https://github.com/angular/angular/issues/23440
    const res = token.toString();
    if (res == null) {
        return '' + res;
    }
    const newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
class Version {
    constructor(full) {
        this.full = full;
        const splits = full.split('.');
        this.major = splits[0];
        this.minor = splits[1];
        this.patch = splits.slice(2).join('.');
    }
}
const __window = typeof window !== 'undefined' && window;
const __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
const __global = typeof global !== 'undefined' && global;
// Check __global first, because in Node tests both __global and __window may be defined and _global
// should be __global in that case.
const _global = __global || __window || __self;
function newArray(size, value) {
    const list = [];
    for (let i = 0; i < size; i++) {
        list.push(value);
    }
    return list;
}
/**
 * Partitions a given array into 2 arrays, based on a boolean value returned by the condition
 * function.
 *
 * @param arr Input array that should be partitioned
 * @param conditionFn Condition function that is called for each item in a given array and returns a
 * boolean value.
 */
function partitionArray(arr, conditionFn) {
    const truthy = [];
    const falsy = [];
    for (const item of arr) {
        (conditionFn(item) ? truthy : falsy).push(item);
    }
    return [truthy, falsy];
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Represents a big integer using a buffer of its individual digits, with the least significant
 * digit stored at the beginning of the array (little endian).
 *
 * For performance reasons, each instance is mutable. The addition operation can be done in-place
 * to reduce memory pressure of allocation for the digits array.
 */
class BigInteger {
    /**
     * Creates a big integer using its individual digits in little endian storage.
     */
    constructor(digits) {
        this.digits = digits;
    }
    static zero() {
        return new BigInteger([0]);
    }
    static one() {
        return new BigInteger([1]);
    }
    /**
     * Creates a clone of this instance.
     */
    clone() {
        return new BigInteger(this.digits.slice());
    }
    /**
     * Returns a new big integer with the sum of `this` and `other` as its value. This does not mutate
     * `this` but instead returns a new instance, unlike `addToSelf`.
     */
    add(other) {
        const result = this.clone();
        result.addToSelf(other);
        return result;
    }
    /**
     * Adds `other` to the instance itself, thereby mutating its value.
     */
    addToSelf(other) {
        const maxNrOfDigits = Math.max(this.digits.length, other.digits.length);
        let carry = 0;
        for (let i = 0; i < maxNrOfDigits; i++) {
            let digitSum = carry;
            if (i < this.digits.length) {
                digitSum += this.digits[i];
            }
            if (i < other.digits.length) {
                digitSum += other.digits[i];
            }
            if (digitSum >= 10) {
                this.digits[i] = digitSum - 10;
                carry = 1;
            }
            else {
                this.digits[i] = digitSum;
                carry = 0;
            }
        }
        // Apply a remaining carry if needed.
        if (carry > 0) {
            this.digits[maxNrOfDigits] = 1;
        }
    }
    /**
     * Builds the decimal string representation of the big integer. As this is stored in
     * little endian, the digits are concatenated in reverse order.
     */
    toString() {
        let res = '';
        for (let i = this.digits.length - 1; i >= 0; i--) {
            res += this.digits[i];
        }
        return res;
    }
}
/**
 * Represents a big integer which is optimized for multiplication operations, as its power-of-twos
 * are memoized. See `multiplyBy()` for details on the multiplication algorithm.
 */
class BigIntForMultiplication {
    constructor(value) {
        this.powerOfTwos = [value];
    }
    /**
     * Returns the big integer itself.
     */
    getValue() {
        return this.powerOfTwos[0];
    }
    /**
     * Computes the value for `num * b`, where `num` is a JS number and `b` is a big integer. The
     * value for `b` is represented by a storage model that is optimized for this computation.
     *
     * This operation is implemented in N(log2(num)) by continuous halving of the number, where the
     * least-significant bit (LSB) is tested in each iteration. If the bit is set, the bit's index is
     * used as exponent into the power-of-two multiplication of `b`.
     *
     * As an example, consider the multiplication num=42, b=1337. In binary 42 is 0b00101010 and the
     * algorithm unrolls into the following iterations:
     *
     *  Iteration | num        | LSB  | b * 2^iter | Add? | product
     * -----------|------------|------|------------|------|--------
     *  0         | 0b00101010 | 0    | 1337       | No   | 0
     *  1         | 0b00010101 | 1    | 2674       | Yes  | 2674
     *  2         | 0b00001010 | 0    | 5348       | No   | 2674
     *  3         | 0b00000101 | 1    | 10696      | Yes  | 13370
     *  4         | 0b00000010 | 0    | 21392      | No   | 13370
     *  5         | 0b00000001 | 1    | 42784      | Yes  | 56154
     *  6         | 0b00000000 | 0    | 85568      | No   | 56154
     *
     * The computed product of 56154 is indeed the correct result.
     *
     * The `BigIntForMultiplication` representation for a big integer provides memoized access to the
     * power-of-two values to reduce the workload in computing those values.
     */
    multiplyBy(num) {
        const product = BigInteger.zero();
        this.multiplyByAndAddTo(num, product);
        return product;
    }
    /**
     * See `multiplyBy()` for details. This function allows for the computed product to be added
     * directly to the provided result big integer.
     */
    multiplyByAndAddTo(num, result) {
        for (let exponent = 0; num !== 0; num = num >>> 1, exponent++) {
            if (num & 1) {
                const value = this.getMultipliedByPowerOfTwo(exponent);
                result.addToSelf(value);
            }
        }
    }
    /**
     * Computes and memoizes the big integer value for `this.number * 2^exponent`.
     */
    getMultipliedByPowerOfTwo(exponent) {
        // Compute the powers up until the requested exponent, where each value is computed from its
        // predecessor. This is simple as `this.number * 2^(exponent - 1)` only has to be doubled (i.e.
        // added to itself) to reach `this.number * 2^exponent`.
        for (let i = this.powerOfTwos.length; i <= exponent; i++) {
            const previousPower = this.powerOfTwos[i - 1];
            this.powerOfTwos[i] = previousPower.add(previousPower);
        }
        return this.powerOfTwos[exponent];
    }
}
/**
 * Represents an exponentiation operation for the provided base, of which exponents are computed and
 * memoized. The results are represented by a `BigIntForMultiplication` which is tailored for
 * multiplication operations by memoizing the power-of-twos. This effectively results in a matrix
 * representation that is lazily computed upon request.
 */
class BigIntExponentiation {
    constructor(base) {
        this.base = base;
        this.exponents = [new BigIntForMultiplication(BigInteger.one())];
    }
    /**
     * Compute the value for `this.base^exponent`, resulting in a big integer that is optimized for
     * further multiplication operations.
     */
    toThePowerOf(exponent) {
        // Compute the results up until the requested exponent, where every value is computed from its
        // predecessor. This is because `this.base^(exponent - 1)` only has to be multiplied by `base`
        // to reach `this.base^exponent`.
        for (let i = this.exponents.length; i <= exponent; i++) {
            const value = this.exponents[i - 1].multiplyBy(this.base);
            this.exponents[i] = new BigIntForMultiplication(value);
        }
        return this.exponents[exponent];
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Return the message id or compute it using the XLIFF1 digest.
 */
function digest$1(message) {
    return message.id || computeDigest(message);
}
/**
 * Compute the message id using the XLIFF1 digest.
 */
function computeDigest(message) {
    return sha1(serializeNodes(message.nodes).join('') + `[${message.meaning}]`);
}
/**
 * Return the message id or compute it using the XLIFF2/XMB/$localize digest.
 */
function decimalDigest(message) {
    return message.id || computeDecimalDigest(message);
}
/**
 * Compute the message id using the XLIFF2/XMB/$localize digest.
 */
function computeDecimalDigest(message) {
    const visitor = new _SerializerIgnoreIcuExpVisitor();
    const parts = message.nodes.map(a => a.visit(visitor, null));
    return computeMsgId(parts.join(''), message.meaning);
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * @internal
 */
class _SerializerVisitor {
    visitText(text, context) {
        return text.value;
    }
    visitContainer(container, context) {
        return `[${container.children.map(child => child.visit(this)).join(', ')}]`;
    }
    visitIcu(icu, context) {
        const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        return `{${icu.expression}, ${icu.type}, ${strCases.join(', ')}}`;
    }
    visitTagPlaceholder(ph, context) {
        return ph.isVoid ?
            `<ph tag name="${ph.startName}"/>` :
            `<ph tag name="${ph.startName}">${ph.children.map(child => child.visit(this)).join(', ')}</ph name="${ph.closeName}">`;
    }
    visitPlaceholder(ph, context) {
        return ph.value ? `<ph name="${ph.name}">${ph.value}</ph>` : `<ph name="${ph.name}"/>`;
    }
    visitIcuPlaceholder(ph, context) {
        return `<ph icu name="${ph.name}">${ph.value.visit(this)}</ph>`;
    }
}
const serializerVisitor$1 = new _SerializerVisitor();
function serializeNodes(nodes) {
    return nodes.map(a => a.visit(serializerVisitor$1, null));
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * @internal
 */
class _SerializerIgnoreIcuExpVisitor extends _SerializerVisitor {
    visitIcu(icu, context) {
        let strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        // Do not take the expression into account
        return `{${icu.type}, ${strCases.join(', ')}}`;
    }
}
/**
 * Compute the SHA1 of the given string
 *
 * see https://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 */
function sha1(str) {
    const utf8 = utf8Encode(str);
    const words32 = bytesToWords32(utf8, Endian.Big);
    const len = utf8.length * 8;
    const w = newArray(80);
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476, e = 0xc3d2e1f0;
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (let i = 0; i < words32.length; i += 16) {
        const h0 = a, h1 = b, h2 = c, h3 = d, h4 = e;
        for (let j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            const fkVal = fk(j, b, c, d);
            const f = fkVal[0];
            const k = fkVal[1];
            const temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            e = d;
            d = c;
            c = rol32(b, 30);
            b = a;
            a = temp;
        }
        a = add32(a, h0);
        b = add32(b, h1);
        c = add32(c, h2);
        d = add32(d, h3);
        e = add32(e, h4);
    }
    return bytesToHexString(words32ToByteString([a, b, c, d, e]));
}
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 * Compute the fingerprint of the given string
 *
 * The output is 64 bit number encoded as a decimal string
 *
 * based on:
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
 */
function fingerprint(str) {
    const utf8 = utf8Encode(str);
    let hi = hash32(utf8, 0);
    let lo = hash32(utf8, 102072);
    if (hi == 0 && (lo == 0 || lo == 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
    }
    return [hi, lo];
}
function computeMsgId(msg, meaning = '') {
    let msgFingerprint = fingerprint(msg);
    if (meaning) {
        const meaningFingerprint = fingerprint(meaning);
        msgFingerprint = add64(rol64(msgFingerprint, 1), meaningFingerprint);
    }
    const hi = msgFingerprint[0];
    const lo = msgFingerprint[1];
    return wordsToDecimalString(hi & 0x7fffffff, lo);
}
function hash32(bytes, c) {
    let a = 0x9e3779b9, b = 0x9e3779b9;
    let i;
    const len = bytes.length;
    for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(bytes, i, Endian.Little));
        b = add32(b, wordAt(bytes, i + 4, Endian.Little));
        c = add32(c, wordAt(bytes, i + 8, Endian.Little));
        const res = mix(a, b, c);
        a = res[0], b = res[1], c = res[2];
    }
    a = add32(a, wordAt(bytes, i, Endian.Little));
    b = add32(b, wordAt(bytes, i + 4, Endian.Little));
    // the first byte of c is reserved for the length
    c = add32(c, len);
    c = add32(c, wordAt(bytes, i + 8, Endian.Little) << 8);
    return mix(a, b, c)[2];
}
// clang-format off
function mix(a, b, c) {
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 13;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 8;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 13;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 12;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 16;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 5;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 3;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 10;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 15;
    return [a, b, c];
}
// clang-format on
// Utils
var Endian;
(function (Endian) {
    Endian[Endian["Little"] = 0] = "Little";
    Endian[Endian["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function add32(a, b) {
    return add32to64(a, b)[1];
}
function add32to64(a, b) {
    const low = (a & 0xffff) + (b & 0xffff);
    const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
function add64(a, b) {
    const ah = a[0], al = a[1];
    const bh = b[0], bl = b[1];
    const result = add32to64(al, bl);
    const carry = result[0];
    const l = result[1];
    const h = add32(add32(ah, bh), carry);
    return [h, l];
}
function sub32(a, b) {
    const low = (a & 0xffff) - (b & 0xffff);
    const high = (a >> 16) - (b >> 16) + (low >> 16);
    return (high << 16) | (low & 0xffff);
}
// Rotate a 32b number left `count` position
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
// Rotate a 64b number left `count` position
function rol64(num, count) {
    const hi = num[0], lo = num[1];
    const h = (hi << count) | (lo >>> (32 - count));
    const l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
function bytesToWords32(bytes, endian) {
    const size = (bytes.length + 3) >>> 2;
    const words32 = [];
    for (let i = 0; i < size; i++) {
        words32[i] = wordAt(bytes, i * 4, endian);
    }
    return words32;
}
function byteAt(bytes, index) {
    return index >= bytes.length ? 0 : bytes[index];
}
function wordAt(bytes, index, endian) {
    let word = 0;
    if (endian === Endian.Big) {
        for (let i = 0; i < 4; i++) {
            word += byteAt(bytes, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (let i = 0; i < 4; i++) {
            word += byteAt(bytes, index + i) << 8 * i;
        }
    }
    return word;
}
function words32ToByteString(words32) {
    return words32.reduce((bytes, word) => bytes.concat(word32ToByteString(word)), []);
}
function word32ToByteString(word) {
    let bytes = [];
    for (let i = 0; i < 4; i++) {
        bytes.push((word >>> 8 * (3 - i)) & 0xff);
    }
    return bytes;
}
function bytesToHexString(bytes) {
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        const b = byteAt(bytes, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * Create a shared exponentiation pool for base-256 computations. This shared pool provides memoized
 * power-of-256 results with memoized power-of-two computations for efficient multiplication.
 *
 * For our purposes, this can be safely stored as a global without memory concerns. The reason is
 * that we encode two words, so only need the 0th (for the low word) and 4th (for the high word)
 * exponent.
 */
const base256 = new BigIntExponentiation(256);
/**
 * Represents two 32-bit words as a single decimal number. This requires a big integer storage
 * model as JS numbers are not accurate enough to represent the 64-bit number.
 *
 * Based on https://www.danvk.org/hex2dec.html
 */
function wordsToDecimalString(hi, lo) {
    // Encode the four bytes in lo in the lower digits of the decimal number.
    // Note: the multiplication results in lo itself but represented by a big integer using its
    // decimal digits.
    const decimal = base256.toThePowerOf(0).multiplyBy(lo);
    // Encode the four bytes in hi above the four lo bytes. lo is a maximum of (2^8)^4, which is why
    // this multiplication factor is applied.
    base256.toThePowerOf(4).multiplyByAndAddTo(hi, decimal);
    return decimal.toString();
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//// Types
var TypeModifier;
(function (TypeModifier) {
    TypeModifier[TypeModifier["None"] = 0] = "None";
    TypeModifier[TypeModifier["Const"] = 1] = "Const";
})(TypeModifier || (TypeModifier = {}));
class Type {
    constructor(modifiers = TypeModifier.None) {
        this.modifiers = modifiers;
    }
    hasModifier(modifier) {
        return (this.modifiers & modifier) !== 0;
    }
}
var BuiltinTypeName;
(function (BuiltinTypeName) {
    BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
    BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
    BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
    BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
    BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
    BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
    BuiltinTypeName[BuiltinTypeName["Inferred"] = 6] = "Inferred";
    BuiltinTypeName[BuiltinTypeName["None"] = 7] = "None";
})(BuiltinTypeName || (BuiltinTypeName = {}));
class BuiltinType extends Type {
    constructor(name, modifiers) {
        super(modifiers);
        this.name = name;
    }
    visitType(visitor, context) {
        return visitor.visitBuiltinType(this, context);
    }
}
class ExpressionType extends Type {
    constructor(value, modifiers, typeParams = null) {
        super(modifiers);
        this.value = value;
        this.typeParams = typeParams;
    }
    visitType(visitor, context) {
        return visitor.visitExpressionType(this, context);
    }
}
class ArrayType extends Type {
    constructor(of, modifiers) {
        super(modifiers);
        this.of = of;
    }
    visitType(visitor, context) {
        return visitor.visitArrayType(this, context);
    }
}
class MapType extends Type {
    constructor(valueType, modifiers) {
        super(modifiers);
        this.valueType = valueType || null;
    }
    visitType(visitor, context) {
        return visitor.visitMapType(this, context);
    }
}
const DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
const INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
const BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
const INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
const NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
const STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
const FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
const NONE_TYPE = new BuiltinType(BuiltinTypeName.None);
///// Expressions
var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator[UnaryOperator["Minus"] = 0] = "Minus";
    UnaryOperator[UnaryOperator["Plus"] = 1] = "Plus";
})(UnaryOperator || (UnaryOperator = {}));
var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
    BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
    BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
    BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
    BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
    BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
    BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
    BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
    BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
    BinaryOperator[BinaryOperator["And"] = 9] = "And";
    BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
    BinaryOperator[BinaryOperator["BitwiseAnd"] = 11] = "BitwiseAnd";
    BinaryOperator[BinaryOperator["Lower"] = 12] = "Lower";
    BinaryOperator[BinaryOperator["LowerEquals"] = 13] = "LowerEquals";
    BinaryOperator[BinaryOperator["Bigger"] = 14] = "Bigger";
    BinaryOperator[BinaryOperator["BiggerEquals"] = 15] = "BiggerEquals";
    BinaryOperator[BinaryOperator["NullishCoalesce"] = 16] = "NullishCoalesce";
})(BinaryOperator || (BinaryOperator = {}));
function nullSafeIsEquivalent(base, other) {
    if (base == null || other == null) {
        return base == other;
    }
    return base.isEquivalent(other);
}
function areAllEquivalentPredicate(base, other, equivalentPredicate) {
    const len = base.length;
    if (len !== other.length) {
        return false;
    }
    for (let i = 0; i < len; i++) {
        if (!equivalentPredicate(base[i], other[i])) {
            return false;
        }
    }
    return true;
}
function areAllEquivalent(base, other) {
    return areAllEquivalentPredicate(base, other, (baseElement, otherElement) => baseElement.isEquivalent(otherElement));
}
class Expression {
    constructor(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    prop(name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    }
    key(index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    }
    callFn(params, sourceSpan, pure) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan, pure);
    }
    instantiate(params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    }
    conditional(trueCase, falseCase = null, sourceSpan) {
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    }
    equals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    }
    notEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    }
    identical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    }
    notIdentical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    }
    minus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    }
    plus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    }
    divide(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    }
    multiply(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    }
    modulo(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    }
    and(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    }
    bitwiseAnd(rhs, sourceSpan, parens = true) {
        return new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, this, rhs, null, sourceSpan, parens);
    }
    or(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    }
    lower(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    }
    lowerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    }
    bigger(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    }
    biggerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    }
    isBlank(sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
    }
    nullishCoalesce(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NullishCoalesce, this, rhs, null, sourceSpan);
    }
    toStmt() {
        return new ExpressionStatement(this, null);
    }
}
class ReadVarExpr extends Expression {
    constructor(name, type, sourceSpan) {
        super(type, sourceSpan);
        this.name = name;
    }
    isEquivalent(e) {
        return e instanceof ReadVarExpr && this.name === e.name;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    }
    set(value) {
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    }
}
class TypeofExpr extends Expression {
    constructor(expr, type, sourceSpan) {
        super(type, sourceSpan);
        this.expr = expr;
    }
    visitExpression(visitor, context) {
        return visitor.visitTypeofExpr(this, context);
    }
    isEquivalent(e) {
        return e instanceof TypeofExpr && e.expr.isEquivalent(this.expr);
    }
    isConstant() {
        return this.expr.isConstant();
    }
}
class WrappedNodeExpr extends Expression {
    constructor(node, type, sourceSpan) {
        super(type, sourceSpan);
        this.node = node;
    }
    isEquivalent(e) {
        return e instanceof WrappedNodeExpr && this.node === e.node;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitWrappedNodeExpr(this, context);
    }
}
class WriteVarExpr extends Expression {
    constructor(name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.name = name;
        this.value = value;
    }
    isEquivalent(e) {
        return e instanceof WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    }
    toDeclStmt(type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    }
    toConstDecl() {
        return this.toDeclStmt(INFERRED_TYPE, StmtModifier.Final);
    }
}
class WriteKeyExpr extends Expression {
    constructor(receiver, index, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
        this.value = value;
    }
    isEquivalent(e) {
        return e instanceof WriteKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    }
}
class WritePropExpr extends Expression {
    constructor(receiver, name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    isEquivalent(e) {
        return e instanceof WritePropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name && this.value.isEquivalent(e.value);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    }
}
class InvokeFunctionExpr extends Expression {
    constructor(fn, args, type, sourceSpan, pure = false) {
        super(type, sourceSpan);
        this.fn = fn;
        this.args = args;
        this.pure = pure;
    }
    isEquivalent(e) {
        return e instanceof InvokeFunctionExpr && this.fn.isEquivalent(e.fn) &&
            areAllEquivalent(this.args, e.args) && this.pure === e.pure;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    }
}
class TaggedTemplateExpr extends Expression {
    constructor(tag, template, type, sourceSpan) {
        super(type, sourceSpan);
        this.tag = tag;
        this.template = template;
    }
    isEquivalent(e) {
        return e instanceof TaggedTemplateExpr && this.tag.isEquivalent(e.tag) &&
            areAllEquivalentPredicate(this.template.elements, e.template.elements, (a, b) => a.text === b.text) &&
            areAllEquivalent(this.template.expressions, e.template.expressions);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitTaggedTemplateExpr(this, context);
    }
}
class InstantiateExpr extends Expression {
    constructor(classExpr, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.classExpr = classExpr;
        this.args = args;
    }
    isEquivalent(e) {
        return e instanceof InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) &&
            areAllEquivalent(this.args, e.args);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    }
}
class LiteralExpr extends Expression {
    constructor(value, type, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
    }
    isEquivalent(e) {
        return e instanceof LiteralExpr && this.value === e.value;
    }
    isConstant() {
        return true;
    }
    visitExpression(visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    }
}
class TemplateLiteral {
    constructor(elements, expressions) {
        this.elements = elements;
        this.expressions = expressions;
    }
}
class TemplateLiteralElement {
    constructor(text, sourceSpan, rawText) {
        this.text = text;
        this.sourceSpan = sourceSpan;
        // If `rawText` is not provided, try to extract the raw string from its
        // associated `sourceSpan`. If that is also not available, "fake" the raw
        // string instead by escaping the following control sequences:
        // - "\" would otherwise indicate that the next character is a control character.
        // - "`" and "${" are template string control sequences that would otherwise prematurely
        // indicate the end of the template literal element.
        this.rawText =
            rawText ?? sourceSpan?.toString() ?? escapeForTemplateLiteral(escapeSlashes(text));
    }
}
class LiteralPiece {
    constructor(text, sourceSpan) {
        this.text = text;
        this.sourceSpan = sourceSpan;
    }
}
class PlaceholderPiece {
    /**
     * Create a new instance of a `PlaceholderPiece`.
     *
     * @param text the name of this placeholder (e.g. `PH_1`).
     * @param sourceSpan the location of this placeholder in its localized message the source code.
     * @param associatedMessage reference to another message that this placeholder is associated with.
     * The `associatedMessage` is mainly used to provide a relationship to an ICU message that has
     * been extracted out from the message containing the placeholder.
     */
    constructor(text, sourceSpan, associatedMessage) {
        this.text = text;
        this.sourceSpan = sourceSpan;
        this.associatedMessage = associatedMessage;
    }
}
const MEANING_SEPARATOR$1 = '|';
const ID_SEPARATOR$1 = '@@';
const LEGACY_ID_INDICATOR = '␟';
class LocalizedString extends Expression {
    constructor(metaBlock, messageParts, placeHolderNames, expressions, sourceSpan) {
        super(STRING_TYPE, sourceSpan);
        this.metaBlock = metaBlock;
        this.messageParts = messageParts;
        this.placeHolderNames = placeHolderNames;
        this.expressions = expressions;
    }
    isEquivalent(e) {
        // return e instanceof LocalizedString && this.message === e.message;
        return false;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitLocalizedString(this, context);
    }
    /**
     * Serialize the given `meta` and `messagePart` into "cooked" and "raw" strings that can be used
     * in a `$localize` tagged string. The format of the metadata is the same as that parsed by
     * `parseI18nMeta()`.
     *
     * @param meta The metadata to serialize
     * @param messagePart The first part of the tagged string
     */
    serializeI18nHead() {
        let metaBlock = this.metaBlock.description || '';
        if (this.metaBlock.meaning) {
            metaBlock = `${this.metaBlock.meaning}${MEANING_SEPARATOR$1}${metaBlock}`;
        }
        if (this.metaBlock.customId) {
            metaBlock = `${metaBlock}${ID_SEPARATOR$1}${this.metaBlock.customId}`;
        }
        if (this.metaBlock.legacyIds) {
            this.metaBlock.legacyIds.forEach(legacyId => {
                metaBlock = `${metaBlock}${LEGACY_ID_INDICATOR}${legacyId}`;
            });
        }
        return createCookedRawString(metaBlock, this.messageParts[0].text, this.getMessagePartSourceSpan(0));
    }
    getMessagePartSourceSpan(i) {
        return this.messageParts[i]?.sourceSpan ?? this.sourceSpan;
    }
    getPlaceholderSourceSpan(i) {
        return this.placeHolderNames[i]?.sourceSpan ?? this.expressions[i]?.sourceSpan ??
            this.sourceSpan;
    }
    /**
     * Serialize the given `placeholderName` and `messagePart` into "cooked" and "raw" strings that
     * can be used in a `$localize` tagged string.
     *
     * The format is `:<placeholder-name>[@@<associated-id>]:`.
     *
     * The `associated-id` is the message id of the (usually an ICU) message to which this placeholder
     * refers.
     *
     * @param partIndex The index of the message part to serialize.
     */
    serializeI18nTemplatePart(partIndex) {
        const placeholder = this.placeHolderNames[partIndex - 1];
        const messagePart = this.messageParts[partIndex];
        let metaBlock = placeholder.text;
        if (placeholder.associatedMessage?.legacyIds.length === 0) {
            metaBlock += `${ID_SEPARATOR$1}${computeMsgId(placeholder.associatedMessage.messageString, placeholder.associatedMessage.meaning)}`;
        }
        return createCookedRawString(metaBlock, messagePart.text, this.getMessagePartSourceSpan(partIndex));
    }
}
const escapeSlashes = (str) => str.replace(/\\/g, '\\\\');
const escapeStartingColon = (str) => str.replace(/^:/, '\\:');
const escapeColons = (str) => str.replace(/:/g, '\\:');
const escapeForTemplateLiteral = (str) => str.replace(/`/g, '\\`').replace(/\${/g, '$\\{');
/**
 * Creates a `{cooked, raw}` object from the `metaBlock` and `messagePart`.
 *
 * The `raw` text must have various character sequences escaped:
 * * "\" would otherwise indicate that the next character is a control character.
 * * "`" and "${" are template string control sequences that would otherwise prematurely indicate
 *   the end of a message part.
 * * ":" inside a metablock would prematurely indicate the end of the metablock.
 * * ":" at the start of a messagePart with no metablock would erroneously indicate the start of a
 *   metablock.
 *
 * @param metaBlock Any metadata that should be prepended to the string
 * @param messagePart The message part of the string
 */
function createCookedRawString(metaBlock, messagePart, range) {
    if (metaBlock === '') {
        return {
            cooked: messagePart,
            raw: escapeForTemplateLiteral(escapeStartingColon(escapeSlashes(messagePart))),
            range,
        };
    }
    else {
        return {
            cooked: `:${metaBlock}:${messagePart}`,
            raw: escapeForTemplateLiteral(`:${escapeColons(escapeSlashes(metaBlock))}:${escapeSlashes(messagePart)}`),
            range,
        };
    }
}
class ExternalExpr extends Expression {
    constructor(value, type, typeParams = null, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
        this.typeParams = typeParams;
    }
    isEquivalent(e) {
        return e instanceof ExternalExpr && this.value.name === e.value.name &&
            this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitExternalExpr(this, context);
    }
}
class ExternalReference {
    constructor(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
    }
}
class ConditionalExpr extends Expression {
    constructor(condition, trueCase, falseCase = null, type, sourceSpan) {
        super(type || trueCase.type, sourceSpan);
        this.condition = condition;
        this.falseCase = falseCase;
        this.trueCase = trueCase;
    }
    isEquivalent(e) {
        return e instanceof ConditionalExpr && this.condition.isEquivalent(e.condition) &&
            this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    }
}
class NotExpr extends Expression {
    constructor(condition, sourceSpan) {
        super(BOOL_TYPE, sourceSpan);
        this.condition = condition;
    }
    isEquivalent(e) {
        return e instanceof NotExpr && this.condition.isEquivalent(e.condition);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitNotExpr(this, context);
    }
}
class FnParam {
    constructor(name, type = null) {
        this.name = name;
        this.type = type;
    }
    isEquivalent(param) {
        return this.name === param.name;
    }
}
class FunctionExpr extends Expression {
    constructor(params, statements, type, sourceSpan, name) {
        super(type, sourceSpan);
        this.params = params;
        this.statements = statements;
        this.name = name;
    }
    isEquivalent(e) {
        return e instanceof FunctionExpr && areAllEquivalent(this.params, e.params) &&
            areAllEquivalent(this.statements, e.statements);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    }
    toDeclStmt(name, modifiers) {
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    }
}
class UnaryOperatorExpr extends Expression {
    constructor(operator, expr, type, sourceSpan, parens = true) {
        super(type || NUMBER_TYPE, sourceSpan);
        this.operator = operator;
        this.expr = expr;
        this.parens = parens;
    }
    isEquivalent(e) {
        return e instanceof UnaryOperatorExpr && this.operator === e.operator &&
            this.expr.isEquivalent(e.expr);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitUnaryOperatorExpr(this, context);
    }
}
class BinaryOperatorExpr extends Expression {
    constructor(operator, lhs, rhs, type, sourceSpan, parens = true) {
        super(type || lhs.type, sourceSpan);
        this.operator = operator;
        this.rhs = rhs;
        this.parens = parens;
        this.lhs = lhs;
    }
    isEquivalent(e) {
        return e instanceof BinaryOperatorExpr && this.operator === e.operator &&
            this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    }
}
class ReadPropExpr extends Expression {
    constructor(receiver, name, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
    }
    isEquivalent(e) {
        return e instanceof ReadPropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name;
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    }
    set(value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    }
}
class ReadKeyExpr extends Expression {
    constructor(receiver, index, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
    }
    isEquivalent(e) {
        return e instanceof ReadKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    }
    set(value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    }
}
class LiteralArrayExpr extends Expression {
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
    }
    isConstant() {
        return this.entries.every(e => e.isConstant());
    }
    isEquivalent(e) {
        return e instanceof LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
    }
    visitExpression(visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    }
}
class LiteralMapEntry {
    constructor(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    isEquivalent(e) {
        return this.key === e.key && this.value.isEquivalent(e.value);
    }
}
class LiteralMapExpr extends Expression {
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
        this.valueType = null;
        if (type) {
            this.valueType = type.valueType;
        }
    }
    isEquivalent(e) {
        return e instanceof LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
    }
    isConstant() {
        return this.entries.every(e => e.value.isConstant());
    }
    visitExpression(visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    }
}
class CommaExpr extends Expression {
    constructor(parts, sourceSpan) {
        super(parts[parts.length - 1].type, sourceSpan);
        this.parts = parts;
    }
    isEquivalent(e) {
        return e instanceof CommaExpr && areAllEquivalent(this.parts, e.parts);
    }
    isConstant() {
        return false;
    }
    visitExpression(visitor, context) {
        return visitor.visitCommaExpr(this, context);
    }
}
const NULL_EXPR = new LiteralExpr(null, null, null);
const TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
//// Statements
var StmtModifier;
(function (StmtModifier) {
    StmtModifier[StmtModifier["None"] = 0] = "None";
    StmtModifier[StmtModifier["Final"] = 1] = "Final";
    StmtModifier[StmtModifier["Private"] = 2] = "Private";
    StmtModifier[StmtModifier["Exported"] = 4] = "Exported";
    StmtModifier[StmtModifier["Static"] = 8] = "Static";
})(StmtModifier || (StmtModifier = {}));
class LeadingComment {
    constructor(text, multiline, trailingNewline) {
        this.text = text;
        this.multiline = multiline;
        this.trailingNewline = trailingNewline;
    }
    toString() {
        return this.multiline ? ` ${this.text} ` : this.text;
    }
}
class JSDocComment extends LeadingComment {
    constructor(tags) {
        super('', /* multiline */ true, /* trailingNewline */ true);
        this.tags = tags;
    }
    toString() {
        return serializeTags(this.tags);
    }
}
class Statement {
    constructor(modifiers = StmtModifier.None, sourceSpan = null, leadingComments) {
        this.modifiers = modifiers;
        this.sourceSpan = sourceSpan;
        this.leadingComments = leadingComments;
    }
    hasModifier(modifier) {
        return (this.modifiers & modifier) !== 0;
    }
    addLeadingComment(leadingComment) {
        this.leadingComments = this.leadingComments ?? [];
        this.leadingComments.push(leadingComment);
    }
}
class DeclareVarStmt extends Statement {
    constructor(name, value, type, modifiers, sourceSpan, leadingComments) {
        super(modifiers, sourceSpan, leadingComments);
        this.name = name;
        this.value = value;
        this.type = type || (value && value.type) || null;
    }
    isEquivalent(stmt) {
        return stmt instanceof DeclareVarStmt && this.name === stmt.name &&
            (this.value ? !!stmt.value && this.value.isEquivalent(stmt.value) : !stmt.value);
    }
    visitStatement(visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    }
}
class DeclareFunctionStmt extends Statement {
    constructor(name, params, statements, type, modifiers, sourceSpan, leadingComments) {
        super(modifiers, sourceSpan, leadingComments);
        this.name = name;
        this.params = params;
        this.statements = statements;
        this.type = type || null;
    }
    isEquivalent(stmt) {
        return stmt instanceof DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) &&
            areAllEquivalent(this.statements, stmt.statements);
    }
    visitStatement(visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    }
}
class ExpressionStatement extends Statement {
    constructor(expr, sourceSpan, leadingComments) {
        super(StmtModifier.None, sourceSpan, leadingComments);
        this.expr = expr;
    }
    isEquivalent(stmt) {
        return stmt instanceof ExpressionStatement && this.expr.isEquivalent(stmt.expr);
    }
    visitStatement(visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    }
}
class ReturnStatement extends Statement {
    constructor(value, sourceSpan = null, leadingComments) {
        super(StmtModifier.None, sourceSpan, leadingComments);
        this.value = value;
    }
    isEquivalent(stmt) {
        return stmt instanceof ReturnStatement && this.value.isEquivalent(stmt.value);
    }
    visitStatement(visitor, context) {
        return visitor.visitReturnStmt(this, context);
    }
}
class IfStmt extends Statement {
    constructor(condition, trueCase, falseCase = [], sourceSpan, leadingComments) {
        super(StmtModifier.None, sourceSpan, leadingComments);
        this.condition = condition;
        this.trueCase = trueCase;
        this.falseCase = falseCase;
    }
    isEquivalent(stmt) {
        return stmt instanceof IfStmt && this.condition.isEquivalent(stmt.condition) &&
            areAllEquivalent(this.trueCase, stmt.trueCase) &&
            areAllEquivalent(this.falseCase, stmt.falseCase);
    }
    visitStatement(visitor, context) {
        return visitor.visitIfStmt(this, context);
    }
}
class RecursiveAstVisitor$1 {
    visitType(ast, context) {
        return ast;
    }
    visitExpression(ast, context) {
        if (ast.type) {
            ast.type.visitType(this, context);
        }
        return ast;
    }
    visitBuiltinType(type, context) {
        return this.visitType(type, context);
    }
    visitExpressionType(type, context) {
        type.value.visitExpression(this, context);
        if (type.typeParams !== null) {
            type.typeParams.forEach(param => this.visitType(param, context));
        }
        return this.visitType(type, context);
    }
    visitArrayType(type, context) {
        return this.visitType(type, context);
    }
    visitMapType(type, context) {
        return this.visitType(type, context);
    }
    visitWrappedNodeExpr(ast, context) {
        return ast;
    }
    visitTypeofExpr(ast, context) {
        return this.visitExpression(ast, context);
    }
    visitReadVarExpr(ast, context) {
        return this.visitExpression(ast, context);
    }
    visitWriteVarExpr(ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitWriteKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitWritePropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitInvokeFunctionExpr(ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    }
    visitTaggedTemplateExpr(ast, context) {
        ast.tag.visitExpression(this, context);
        this.visitAllExpressions(ast.template.expressions, context);
        return this.visitExpression(ast, context);
    }
    visitInstantiateExpr(ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    }
    visitLiteralExpr(ast, context) {
        return this.visitExpression(ast, context);
    }
    visitLocalizedString(ast, context) {
        return this.visitExpression(ast, context);
    }
    visitExternalExpr(ast, context) {
        if (ast.typeParams) {
            ast.typeParams.forEach(type => type.visitType(this, context));
        }
        return this.visitExpression(ast, context);
    }
    visitConditionalExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context);
        ast.falseCase.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitNotExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitFunctionExpr(ast, context) {
        this.visitAllStatements(ast.statements, context);
        return this.visitExpression(ast, context);
    }
    visitUnaryOperatorExpr(ast, context) {
        ast.expr.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitBinaryOperatorExpr(ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitReadPropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitReadKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    visitLiteralArrayExpr(ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return this.visitExpression(ast, context);
    }
    visitLiteralMapExpr(ast, context) {
        ast.entries.forEach((entry) => entry.value.visitExpression(this, context));
        return this.visitExpression(ast, context);
    }
    visitCommaExpr(ast, context) {
        this.visitAllExpressions(ast.parts, context);
        return this.visitExpression(ast, context);
    }
    visitAllExpressions(exprs, context) {
        exprs.forEach(expr => expr.visitExpression(this, context));
    }
    visitDeclareVarStmt(stmt, context) {
        if (stmt.value) {
            stmt.value.visitExpression(this, context);
        }
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    }
    visitDeclareFunctionStmt(stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    }
    visitExpressionStmt(stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    }
    visitReturnStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    visitIfStmt(stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    }
    visitAllStatements(stmts, context) {
        stmts.forEach(stmt => stmt.visitStatement(this, context));
    }
}
function leadingComment(text, multiline = false, trailingNewline = true) {
    return new LeadingComment(text, multiline, trailingNewline);
}
function jsDocComment(tags = []) {
    return new JSDocComment(tags);
}
function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
function importExpr(id, typeParams = null, sourceSpan) {
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
function importType(id, typeParams, typeModifiers) {
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
function expressionType(expr, typeModifiers, typeParams) {
    return new ExpressionType(expr, typeModifiers, typeParams);
}
function typeofExpr(expr) {
    return new TypeofExpr(expr);
}
function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
function literalMap(values, type = null) {
    return new LiteralMapExpr(values.map(e => new LiteralMapEntry(e.key, e.value, e.quoted)), type, null);
}
function unary(operator, expr, type, sourceSpan) {
    return new UnaryOperatorExpr(operator, expr, type, sourceSpan);
}
function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
function fn(params, body, type, sourceSpan, name) {
    return new FunctionExpr(params, body, type, sourceSpan, name);
}
function ifStmt(condition, thenClause, elseClause, sourceSpan, leadingComments) {
    return new IfStmt(condition, thenClause, elseClause, sourceSpan, leadingComments);
}
function taggedTemplate(tag, template, type, sourceSpan) {
    return new TaggedTemplateExpr(tag, template, type, sourceSpan);
}
function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
function localizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan) {
    return new LocalizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan);
}
function isNull(exp) {
    return exp instanceof LiteralExpr && exp.value === null;
}
/*
 * Serializes a `Tag` into a string.
 * Returns a string like " @foo {bar} baz" (note the leading whitespace before `@foo`).
 */
function tagToString(tag) {
    let out = '';
    if (tag.tagName) {
        out += ` @${tag.tagName}`;
    }
    if (tag.text) {
        if (tag.text.match(/\/\*|\*\//)) {
            throw new Error('JSDoc text cannot contain "/*" and "*/"');
        }
        out += ' ' + tag.text.replace(/@/g, '\\@');
    }
    return out;
}
function serializeTags(tags) {
    if (tags.length === 0)
        return '';
    if (tags.length === 1 && tags[0].tagName && !tags[0].text) {
        // The JSDOC comment is a single simple tag: e.g `/** @tagname */`.
        return `*${tagToString(tags[0])} `;
    }
    let out = '*\n';
    for (const tag of tags) {
        out += ' *';
        // If the tagToString is multi-line, insert " * " prefixes on lines.
        out += tagToString(tag).replace(/\n/g, '\n * ');
        out += '\n';
    }
    out += ' ';
    return out;
}

var output_ast = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get TypeModifier () { return TypeModifier; },
    Type: Type,
    get BuiltinTypeName () { return BuiltinTypeName; },
    BuiltinType: BuiltinType,
    ExpressionType: ExpressionType,
    ArrayType: ArrayType,
    MapType: MapType,
    DYNAMIC_TYPE: DYNAMIC_TYPE,
    INFERRED_TYPE: INFERRED_TYPE,
    BOOL_TYPE: BOOL_TYPE,
    INT_TYPE: INT_TYPE,
    NUMBER_TYPE: NUMBER_TYPE,
    STRING_TYPE: STRING_TYPE,
    FUNCTION_TYPE: FUNCTION_TYPE,
    NONE_TYPE: NONE_TYPE,
    get UnaryOperator () { return UnaryOperator; },
    get BinaryOperator () { return BinaryOperator; },
    nullSafeIsEquivalent: nullSafeIsEquivalent,
    areAllEquivalent: areAllEquivalent,
    Expression: Expression,
    ReadVarExpr: ReadVarExpr,
    TypeofExpr: TypeofExpr,
    WrappedNodeExpr: WrappedNodeExpr,
    WriteVarExpr: WriteVarExpr,
    WriteKeyExpr: WriteKeyExpr,
    WritePropExpr: WritePropExpr,
    InvokeFunctionExpr: InvokeFunctionExpr,
    TaggedTemplateExpr: TaggedTemplateExpr,
    InstantiateExpr: InstantiateExpr,
    LiteralExpr: LiteralExpr,
    TemplateLiteral: TemplateLiteral,
    TemplateLiteralElement: TemplateLiteralElement,
    LiteralPiece: LiteralPiece,
    PlaceholderPiece: PlaceholderPiece,
    LocalizedString: LocalizedString,
    ExternalExpr: ExternalExpr,
    ExternalReference: ExternalReference,
    ConditionalExpr: ConditionalExpr,
    NotExpr: NotExpr,
    FnParam: FnParam,
    FunctionExpr: FunctionExpr,
    UnaryOperatorExpr: UnaryOperatorExpr,
    BinaryOperatorExpr: BinaryOperatorExpr,
    ReadPropExpr: ReadPropExpr,
    ReadKeyExpr: ReadKeyExpr,
    LiteralArrayExpr: LiteralArrayExpr,
    LiteralMapEntry: LiteralMapEntry,
    LiteralMapExpr: LiteralMapExpr,
    CommaExpr: CommaExpr,
    NULL_EXPR: NULL_EXPR,
    TYPED_NULL_EXPR: TYPED_NULL_EXPR,
    get StmtModifier () { return StmtModifier; },
    LeadingComment: LeadingComment,
    JSDocComment: JSDocComment,
    Statement: Statement,
    DeclareVarStmt: DeclareVarStmt,
    DeclareFunctionStmt: DeclareFunctionStmt,
    ExpressionStatement: ExpressionStatement,
    ReturnStatement: ReturnStatement,
    IfStmt: IfStmt,
    RecursiveAstVisitor: RecursiveAstVisitor$1,
    leadingComment: leadingComment,
    jsDocComment: jsDocComment,
    variable: variable,
    importExpr: importExpr,
    importType: importType,
    expressionType: expressionType,
    typeofExpr: typeofExpr,
    literalArr: literalArr,
    literalMap: literalMap,
    unary: unary,
    not: not,
    fn: fn,
    ifStmt: ifStmt,
    taggedTemplate: taggedTemplate,
    literal: literal,
    localizedString: localizedString,
    isNull: isNull
});

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CONSTANT_PREFIX = '_c';
/**
 * `ConstantPool` tries to reuse literal factories when two or more literals are identical.
 * We determine whether literals are identical by creating a key out of their AST using the
 * `KeyVisitor`. This constant is used to replace dynamic expressions which can't be safely
 * converted into a key. E.g. given an expression `{foo: bar()}`, since we don't know what
 * the result of `bar` will be, we create a key that looks like `{foo: <unknown>}`. Note
 * that we use a variable, rather than something like `null` in order to avoid collisions.
 */
const UNKNOWN_VALUE_KEY = variable('<unknown>');
/**
 * Context to use when producing a key.
 *
 * This ensures we see the constant not the reference variable when producing
 * a key.
 */
const KEY_CONTEXT = {};
/**
 * Generally all primitive values are excluded from the `ConstantPool`, but there is an exclusion
 * for strings that reach a certain length threshold. This constant defines the length threshold for
 * strings.
 */
const POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS = 50;
/**
 * A node that is a place-holder that allows the node to be replaced when the actual
 * node is known.
 *
 * This allows the constant pool to change an expression from a direct reference to
 * a constant to a shared constant. It returns a fix-up node that is later allowed to
 * change the referenced expression.
 */
class FixupExpression extends Expression {
    constructor(resolved) {
        super(resolved.type);
        this.resolved = resolved;
        this.original = resolved;
    }
    visitExpression(visitor, context) {
        if (context === KEY_CONTEXT) {
            // When producing a key we want to traverse the constant not the
            // variable used to refer to it.
            return this.original.visitExpression(visitor, context);
        }
        else {
            return this.resolved.visitExpression(visitor, context);
        }
    }
    isEquivalent(e) {
        return e instanceof FixupExpression && this.resolved.isEquivalent(e.resolved);
    }
    isConstant() {
        return true;
    }
    fixup(expression) {
        this.resolved = expression;
        this.shared = true;
    }
}
/**
 * A constant pool allows a code emitter to share constant in an output context.
 *
 * The constant pool also supports sharing access to ivy definitions references.
 */
class ConstantPool {
    constructor(isClosureCompilerEnabled = false) {
        this.isClosureCompilerEnabled = isClosureCompilerEnabled;
        this.statements = [];
        this.literals = new Map();
        this.literalFactories = new Map();
        this.nextNameIndex = 0;
    }
    getConstLiteral(literal, forceShared) {
        if ((literal instanceof LiteralExpr && !isLongStringLiteral(literal)) ||
            literal instanceof FixupExpression) {
            // Do no put simple literals into the constant pool or try to produce a constant for a
            // reference to a constant.
            return literal;
        }
        const key = this.keyOf(literal);
        let fixup = this.literals.get(key);
        let newValue = false;
        if (!fixup) {
            fixup = new FixupExpression(literal);
            this.literals.set(key, fixup);
            newValue = true;
        }
        if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
            // Replace the expression with a variable
            const name = this.freshName();
            let definition;
            let usage;
            if (this.isClosureCompilerEnabled && isLongStringLiteral(literal)) {
                // For string literals, Closure will **always** inline the string at
                // **all** usages, duplicating it each time. For large strings, this
                // unnecessarily bloats bundle size. To work around this restriction, we
                // wrap the string in a function, and call that function for each usage.
                // This tricks Closure into using inline logic for functions instead of
                // string literals. Function calls are only inlined if the body is small
                // enough to be worth it. By doing this, very large strings will be
                // shared across multiple usages, rather than duplicating the string at
                // each usage site.
                //
                // const myStr = function() { return "very very very long string"; };
                // const usage1 = myStr();
                // const usage2 = myStr();
                definition = variable(name).set(new FunctionExpr([], // Params.
                [
                    // Statements.
                    new ReturnStatement(literal),
                ]));
                usage = variable(name).callFn([]);
            }
            else {
                // Just declare and use the variable directly, without a function call
                // indirection. This saves a few bytes and avoids an unncessary call.
                definition = variable(name).set(literal);
                usage = variable(name);
            }
            this.statements.push(definition.toDeclStmt(INFERRED_TYPE, StmtModifier.Final));
            fixup.fixup(usage);
        }
        return fixup;
    }
    getLiteralFactory(literal) {
        // Create a pure function that builds an array of a mix of constant and variable expressions
        if (literal instanceof LiteralArrayExpr) {
            const argumentsForKey = literal.entries.map(e => e.isConstant() ? e : UNKNOWN_VALUE_KEY);
            const key = this.keyOf(literalArr(argumentsForKey));
            return this._getLiteralFactory(key, literal.entries, entries => literalArr(entries));
        }
        else {
            const expressionForKey = literalMap(literal.entries.map(e => ({
                key: e.key,
                value: e.value.isConstant() ? e.value : UNKNOWN_VALUE_KEY,
                quoted: e.quoted
            })));
            const key = this.keyOf(expressionForKey);
            return this._getLiteralFactory(key, literal.entries.map(e => e.value), entries => literalMap(entries.map((value, index) => ({
                key: literal.entries[index].key,
                value,
                quoted: literal.entries[index].quoted
            }))));
        }
    }
    _getLiteralFactory(key, values, resultMap) {
        let literalFactory = this.literalFactories.get(key);
        const literalFactoryArguments = values.filter((e => !e.isConstant()));
        if (!literalFactory) {
            const resultExpressions = values.map((e, index) => e.isConstant() ? this.getConstLiteral(e, true) : variable(`a${index}`));
            const parameters = resultExpressions.filter(isVariable).map(e => new FnParam(e.name, DYNAMIC_TYPE));
            const pureFunctionDeclaration = fn(parameters, [new ReturnStatement(resultMap(resultExpressions))], INFERRED_TYPE);
            const name = this.freshName();
            this.statements.push(variable(name)
                .set(pureFunctionDeclaration)
                .toDeclStmt(INFERRED_TYPE, StmtModifier.Final));
            literalFactory = variable(name);
            this.literalFactories.set(key, literalFactory);
        }
        return { literalFactory, literalFactoryArguments };
    }
    /**
     * Produce a unique name.
     *
     * The name might be unique among different prefixes if any of the prefixes end in
     * a digit so the prefix should be a constant string (not based on user input) and
     * must not end in a digit.
     */
    uniqueName(prefix) {
        return `${prefix}${this.nextNameIndex++}`;
    }
    freshName() {
        return this.uniqueName(CONSTANT_PREFIX);
    }
    keyOf(expression) {
        return expression.visitExpression(new KeyVisitor(), KEY_CONTEXT);
    }
}
/**
 * Visitor used to determine if 2 expressions are equivalent and can be shared in the
 * `ConstantPool`.
 *
 * When the id (string) generated by the visitor is equal, expressions are considered equivalent.
 */
class KeyVisitor {
    constructor() {
        this.visitWrappedNodeExpr = invalid$1;
        this.visitWriteVarExpr = invalid$1;
        this.visitWriteKeyExpr = invalid$1;
        this.visitWritePropExpr = invalid$1;
        this.visitInvokeFunctionExpr = invalid$1;
        this.visitTaggedTemplateExpr = invalid$1;
        this.visitInstantiateExpr = invalid$1;
        this.visitConditionalExpr = invalid$1;
        this.visitNotExpr = invalid$1;
        this.visitAssertNotNullExpr = invalid$1;
        this.visitCastExpr = invalid$1;
        this.visitFunctionExpr = invalid$1;
        this.visitUnaryOperatorExpr = invalid$1;
        this.visitBinaryOperatorExpr = invalid$1;
        this.visitReadPropExpr = invalid$1;
        this.visitReadKeyExpr = invalid$1;
        this.visitCommaExpr = invalid$1;
        this.visitLocalizedString = invalid$1;
    }
    visitLiteralExpr(ast) {
        return `${typeof ast.value === 'string' ? '"' + ast.value + '"' : ast.value}`;
    }
    visitLiteralArrayExpr(ast, context) {
        return `[${ast.entries.map(entry => entry.visitExpression(this, context)).join(',')}]`;
    }
    visitLiteralMapExpr(ast, context) {
        const mapKey = (entry) => {
            const quote = entry.quoted ? '"' : '';
            return `${quote}${entry.key}${quote}`;
        };
        const mapEntry = (entry) => `${mapKey(entry)}:${entry.value.visitExpression(this, context)}`;
        return `{${ast.entries.map(mapEntry).join(',')}`;
    }
    visitExternalExpr(ast) {
        return ast.value.moduleName ? `EX:${ast.value.moduleName}:${ast.value.name}` :
            `EX:${ast.value.runtime.name}`;
    }
    visitReadVarExpr(node) {
        return `VAR:${node.name}`;
    }
    visitTypeofExpr(node, context) {
        return `TYPEOF:${node.expr.visitExpression(this, context)}`;
    }
}
function invalid$1(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}
function isVariable(e) {
    return e instanceof ReadVarExpr;
}
function isLongStringLiteral(expr) {
    return expr instanceof LiteralExpr && typeof expr.value === 'string' &&
        expr.value.length >= POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CORE = '@angular/core';
class Identifiers {
}
/* Methods */
Identifiers.NEW_METHOD = 'factory';
Identifiers.TRANSFORM_METHOD = 'transform';
Identifiers.PATCH_DEPS = 'patchedDeps';
Identifiers.core = { name: null, moduleName: CORE };
/* Instructions */
Identifiers.namespaceHTML = { name: 'ɵɵnamespaceHTML', moduleName: CORE };
Identifiers.namespaceMathML = { name: 'ɵɵnamespaceMathML', moduleName: CORE };
Identifiers.namespaceSVG = { name: 'ɵɵnamespaceSVG', moduleName: CORE };
Identifiers.element = { name: 'ɵɵelement', moduleName: CORE };
Identifiers.elementStart = { name: 'ɵɵelementStart', moduleName: CORE };
Identifiers.elementEnd = { name: 'ɵɵelementEnd', moduleName: CORE };
Identifiers.advance = { name: 'ɵɵadvance', moduleName: CORE };
Identifiers.syntheticHostProperty = { name: 'ɵɵsyntheticHostProperty', moduleName: CORE };
Identifiers.syntheticHostListener = { name: 'ɵɵsyntheticHostListener', moduleName: CORE };
Identifiers.attribute = { name: 'ɵɵattribute', moduleName: CORE };
Identifiers.attributeInterpolate1 = { name: 'ɵɵattributeInterpolate1', moduleName: CORE };
Identifiers.attributeInterpolate2 = { name: 'ɵɵattributeInterpolate2', moduleName: CORE };
Identifiers.attributeInterpolate3 = { name: 'ɵɵattributeInterpolate3', moduleName: CORE };
Identifiers.attributeInterpolate4 = { name: 'ɵɵattributeInterpolate4', moduleName: CORE };
Identifiers.attributeInterpolate5 = { name: 'ɵɵattributeInterpolate5', moduleName: CORE };
Identifiers.attributeInterpolate6 = { name: 'ɵɵattributeInterpolate6', moduleName: CORE };
Identifiers.attributeInterpolate7 = { name: 'ɵɵattributeInterpolate7', moduleName: CORE };
Identifiers.attributeInterpolate8 = { name: 'ɵɵattributeInterpolate8', moduleName: CORE };
Identifiers.attributeInterpolateV = { name: 'ɵɵattributeInterpolateV', moduleName: CORE };
Identifiers.classProp = { name: 'ɵɵclassProp', moduleName: CORE };
Identifiers.elementContainerStart = { name: 'ɵɵelementContainerStart', moduleName: CORE };
Identifiers.elementContainerEnd = { name: 'ɵɵelementContainerEnd', moduleName: CORE };
Identifiers.elementContainer = { name: 'ɵɵelementContainer', moduleName: CORE };
Identifiers.styleMap = { name: 'ɵɵstyleMap', moduleName: CORE };
Identifiers.styleMapInterpolate1 = { name: 'ɵɵstyleMapInterpolate1', moduleName: CORE };
Identifiers.styleMapInterpolate2 = { name: 'ɵɵstyleMapInterpolate2', moduleName: CORE };
Identifiers.styleMapInterpolate3 = { name: 'ɵɵstyleMapInterpolate3', moduleName: CORE };
Identifiers.styleMapInterpolate4 = { name: 'ɵɵstyleMapInterpolate4', moduleName: CORE };
Identifiers.styleMapInterpolate5 = { name: 'ɵɵstyleMapInterpolate5', moduleName: CORE };
Identifiers.styleMapInterpolate6 = { name: 'ɵɵstyleMapInterpolate6', moduleName: CORE };
Identifiers.styleMapInterpolate7 = { name: 'ɵɵstyleMapInterpolate7', moduleName: CORE };
Identifiers.styleMapInterpolate8 = { name: 'ɵɵstyleMapInterpolate8', moduleName: CORE };
Identifiers.styleMapInterpolateV = { name: 'ɵɵstyleMapInterpolateV', moduleName: CORE };
Identifiers.classMap = { name: 'ɵɵclassMap', moduleName: CORE };
Identifiers.classMapInterpolate1 = { name: 'ɵɵclassMapInterpolate1', moduleName: CORE };
Identifiers.classMapInterpolate2 = { name: 'ɵɵclassMapInterpolate2', moduleName: CORE };
Identifiers.classMapInterpolate3 = { name: 'ɵɵclassMapInterpolate3', moduleName: CORE };
Identifiers.classMapInterpolate4 = { name: 'ɵɵclassMapInterpolate4', moduleName: CORE };
Identifiers.classMapInterpolate5 = { name: 'ɵɵclassMapInterpolate5', moduleName: CORE };
Identifiers.classMapInterpolate6 = { name: 'ɵɵclassMapInterpolate6', moduleName: CORE };
Identifiers.classMapInterpolate7 = { name: 'ɵɵclassMapInterpolate7', moduleName: CORE };
Identifiers.classMapInterpolate8 = { name: 'ɵɵclassMapInterpolate8', moduleName: CORE };
Identifiers.classMapInterpolateV = { name: 'ɵɵclassMapInterpolateV', moduleName: CORE };
Identifiers.styleProp = { name: 'ɵɵstyleProp', moduleName: CORE };
Identifiers.stylePropInterpolate1 = { name: 'ɵɵstylePropInterpolate1', moduleName: CORE };
Identifiers.stylePropInterpolate2 = { name: 'ɵɵstylePropInterpolate2', moduleName: CORE };
Identifiers.stylePropInterpolate3 = { name: 'ɵɵstylePropInterpolate3', moduleName: CORE };
Identifiers.stylePropInterpolate4 = { name: 'ɵɵstylePropInterpolate4', moduleName: CORE };
Identifiers.stylePropInterpolate5 = { name: 'ɵɵstylePropInterpolate5', moduleName: CORE };
Identifiers.stylePropInterpolate6 = { name: 'ɵɵstylePropInterpolate6', moduleName: CORE };
Identifiers.stylePropInterpolate7 = { name: 'ɵɵstylePropInterpolate7', moduleName: CORE };
Identifiers.stylePropInterpolate8 = { name: 'ɵɵstylePropInterpolate8', moduleName: CORE };
Identifiers.stylePropInterpolateV = { name: 'ɵɵstylePropInterpolateV', moduleName: CORE };
Identifiers.nextContext = { name: 'ɵɵnextContext', moduleName: CORE };
Identifiers.templateCreate = { name: 'ɵɵtemplate', moduleName: CORE };
Identifiers.text = { name: 'ɵɵtext', moduleName: CORE };
Identifiers.enableBindings = { name: 'ɵɵenableBindings', moduleName: CORE };
Identifiers.disableBindings = { name: 'ɵɵdisableBindings', moduleName: CORE };
Identifiers.getCurrentView = { name: 'ɵɵgetCurrentView', moduleName: CORE };
Identifiers.textInterpolate = { name: 'ɵɵtextInterpolate', moduleName: CORE };
Identifiers.textInterpolate1 = { name: 'ɵɵtextInterpolate1', moduleName: CORE };
Identifiers.textInterpolate2 = { name: 'ɵɵtextInterpolate2', moduleName: CORE };
Identifiers.textInterpolate3 = { name: 'ɵɵtextInterpolate3', moduleName: CORE };
Identifiers.textInterpolate4 = { name: 'ɵɵtextInterpolate4', moduleName: CORE };
Identifiers.textInterpolate5 = { name: 'ɵɵtextInterpolate5', moduleName: CORE };
Identifiers.textInterpolate6 = { name: 'ɵɵtextInterpolate6', moduleName: CORE };
Identifiers.textInterpolate7 = { name: 'ɵɵtextInterpolate7', moduleName: CORE };
Identifiers.textInterpolate8 = { name: 'ɵɵtextInterpolate8', moduleName: CORE };
Identifiers.textInterpolateV = { name: 'ɵɵtextInterpolateV', moduleName: CORE };
Identifiers.restoreView = { name: 'ɵɵrestoreView', moduleName: CORE };
Identifiers.pureFunction0 = { name: 'ɵɵpureFunction0', moduleName: CORE };
Identifiers.pureFunction1 = { name: 'ɵɵpureFunction1', moduleName: CORE };
Identifiers.pureFunction2 = { name: 'ɵɵpureFunction2', moduleName: CORE };
Identifiers.pureFunction3 = { name: 'ɵɵpureFunction3', moduleName: CORE };
Identifiers.pureFunction4 = { name: 'ɵɵpureFunction4', moduleName: CORE };
Identifiers.pureFunction5 = { name: 'ɵɵpureFunction5', moduleName: CORE };
Identifiers.pureFunction6 = { name: 'ɵɵpureFunction6', moduleName: CORE };
Identifiers.pureFunction7 = { name: 'ɵɵpureFunction7', moduleName: CORE };
Identifiers.pureFunction8 = { name: 'ɵɵpureFunction8', moduleName: CORE };
Identifiers.pureFunctionV = { name: 'ɵɵpureFunctionV', moduleName: CORE };
Identifiers.pipeBind1 = { name: 'ɵɵpipeBind1', moduleName: CORE };
Identifiers.pipeBind2 = { name: 'ɵɵpipeBind2', moduleName: CORE };
Identifiers.pipeBind3 = { name: 'ɵɵpipeBind3', moduleName: CORE };
Identifiers.pipeBind4 = { name: 'ɵɵpipeBind4', moduleName: CORE };
Identifiers.pipeBindV = { name: 'ɵɵpipeBindV', moduleName: CORE };
Identifiers.hostProperty = { name: 'ɵɵhostProperty', moduleName: CORE };
Identifiers.property = { name: 'ɵɵproperty', moduleName: CORE };
Identifiers.propertyInterpolate = { name: 'ɵɵpropertyInterpolate', moduleName: CORE };
Identifiers.propertyInterpolate1 = { name: 'ɵɵpropertyInterpolate1', moduleName: CORE };
Identifiers.propertyInterpolate2 = { name: 'ɵɵpropertyInterpolate2', moduleName: CORE };
Identifiers.propertyInterpolate3 = { name: 'ɵɵpropertyInterpolate3', moduleName: CORE };
Identifiers.propertyInterpolate4 = { name: 'ɵɵpropertyInterpolate4', moduleName: CORE };
Identifiers.propertyInterpolate5 = { name: 'ɵɵpropertyInterpolate5', moduleName: CORE };
Identifiers.propertyInterpolate6 = { name: 'ɵɵpropertyInterpolate6', moduleName: CORE };
Identifiers.propertyInterpolate7 = { name: 'ɵɵpropertyInterpolate7', moduleName: CORE };
Identifiers.propertyInterpolate8 = { name: 'ɵɵpropertyInterpolate8', moduleName: CORE };
Identifiers.propertyInterpolateV = { name: 'ɵɵpropertyInterpolateV', moduleName: CORE };
Identifiers.i18n = { name: 'ɵɵi18n', moduleName: CORE };
Identifiers.i18nAttributes = { name: 'ɵɵi18nAttributes', moduleName: CORE };
Identifiers.i18nExp = { name: 'ɵɵi18nExp', moduleName: CORE };
Identifiers.i18nStart = { name: 'ɵɵi18nStart', moduleName: CORE };
Identifiers.i18nEnd = { name: 'ɵɵi18nEnd', moduleName: CORE };
Identifiers.i18nApply = { name: 'ɵɵi18nApply', moduleName: CORE };
Identifiers.i18nPostprocess = { name: 'ɵɵi18nPostprocess', moduleName: CORE };
Identifiers.pipe = { name: 'ɵɵpipe', moduleName: CORE };
Identifiers.projection = { name: 'ɵɵprojection', moduleName: CORE };
Identifiers.projectionDef = { name: 'ɵɵprojectionDef', moduleName: CORE };
Identifiers.reference = { name: 'ɵɵreference', moduleName: CORE };
Identifiers.inject = { name: 'ɵɵinject', moduleName: CORE };
Identifiers.injectAttribute = { name: 'ɵɵinjectAttribute', moduleName: CORE };
Identifiers.directiveInject = { name: 'ɵɵdirectiveInject', moduleName: CORE };
Identifiers.invalidFactory = { name: 'ɵɵinvalidFactory', moduleName: CORE };
Identifiers.invalidFactoryDep = { name: 'ɵɵinvalidFactoryDep', moduleName: CORE };
Identifiers.templateRefExtractor = { name: 'ɵɵtemplateRefExtractor', moduleName: CORE };
Identifiers.forwardRef = { name: 'forwardRef', moduleName: CORE };
Identifiers.resolveForwardRef = { name: 'resolveForwardRef', moduleName: CORE };
Identifiers.ɵɵdefineInjectable = { name: 'ɵɵdefineInjectable', moduleName: CORE };
Identifiers.declareInjectable = { name: 'ɵɵngDeclareInjectable', moduleName: CORE };
Identifiers.InjectableDeclaration = { name: 'ɵɵInjectableDeclaration', moduleName: CORE };
Identifiers.resolveWindow = { name: 'ɵɵresolveWindow', moduleName: CORE };
Identifiers.resolveDocument = { name: 'ɵɵresolveDocument', moduleName: CORE };
Identifiers.resolveBody = { name: 'ɵɵresolveBody', moduleName: CORE };
Identifiers.defineComponent = { name: 'ɵɵdefineComponent', moduleName: CORE };
Identifiers.declareComponent = { name: 'ɵɵngDeclareComponent', moduleName: CORE };
Identifiers.setComponentScope = { name: 'ɵɵsetComponentScope', moduleName: CORE };
Identifiers.ChangeDetectionStrategy = {
    name: 'ChangeDetectionStrategy',
    moduleName: CORE,
};
Identifiers.ViewEncapsulation = {
    name: 'ViewEncapsulation',
    moduleName: CORE,
};
Identifiers.ComponentDeclaration = {
    name: 'ɵɵComponentDeclaration',
    moduleName: CORE,
};
Identifiers.FactoryDeclaration = {
    name: 'ɵɵFactoryDeclaration',
    moduleName: CORE,
};
Identifiers.declareFactory = { name: 'ɵɵngDeclareFactory', moduleName: CORE };
Identifiers.FactoryTarget = { name: 'ɵɵFactoryTarget', moduleName: CORE };
Identifiers.defineDirective = { name: 'ɵɵdefineDirective', moduleName: CORE };
Identifiers.declareDirective = { name: 'ɵɵngDeclareDirective', moduleName: CORE };
Identifiers.DirectiveDeclaration = {
    name: 'ɵɵDirectiveDeclaration',
    moduleName: CORE,
};
Identifiers.InjectorDef = { name: 'ɵɵInjectorDef', moduleName: CORE };
Identifiers.InjectorDeclaration = { name: 'ɵɵInjectorDeclaration', moduleName: CORE };
Identifiers.defineInjector = { name: 'ɵɵdefineInjector', moduleName: CORE };
Identifiers.declareInjector = { name: 'ɵɵngDeclareInjector', moduleName: CORE };
Identifiers.NgModuleDeclaration = {
    name: 'ɵɵNgModuleDeclaration',
    moduleName: CORE,
};
Identifiers.ModuleWithProviders = {
    name: 'ModuleWithProviders',
    moduleName: CORE,
};
Identifiers.defineNgModule = { name: 'ɵɵdefineNgModule', moduleName: CORE };
Identifiers.declareNgModule = { name: 'ɵɵngDeclareNgModule', moduleName: CORE };
Identifiers.setNgModuleScope = { name: 'ɵɵsetNgModuleScope', moduleName: CORE };
Identifiers.PipeDeclaration = { name: 'ɵɵPipeDeclaration', moduleName: CORE };
Identifiers.definePipe = { name: 'ɵɵdefinePipe', moduleName: CORE };
Identifiers.declarePipe = { name: 'ɵɵngDeclarePipe', moduleName: CORE };
Identifiers.declareClassMetadata = { name: 'ɵɵngDeclareClassMetadata', moduleName: CORE };
Identifiers.setClassMetadata = { name: 'ɵsetClassMetadata', moduleName: CORE };
Identifiers.queryRefresh = { name: 'ɵɵqueryRefresh', moduleName: CORE };
Identifiers.viewQuery = { name: 'ɵɵviewQuery', moduleName: CORE };
Identifiers.loadQuery = { name: 'ɵɵloadQuery', moduleName: CORE };
Identifiers.contentQuery = { name: 'ɵɵcontentQuery', moduleName: CORE };
Identifiers.NgOnChangesFeature = { name: 'ɵɵNgOnChangesFeature', moduleName: CORE };
Identifiers.InheritDefinitionFeature = { name: 'ɵɵInheritDefinitionFeature', moduleName: CORE };
Identifiers.CopyDefinitionFeature = { name: 'ɵɵCopyDefinitionFeature', moduleName: CORE };
Identifiers.ProvidersFeature = { name: 'ɵɵProvidersFeature', moduleName: CORE };
Identifiers.listener = { name: 'ɵɵlistener', moduleName: CORE };
Identifiers.getInheritedFactory = {
    name: 'ɵɵgetInheritedFactory',
    moduleName: CORE,
};
// sanitization-related functions
Identifiers.sanitizeHtml = { name: 'ɵɵsanitizeHtml', moduleName: CORE };
Identifiers.sanitizeStyle = { name: 'ɵɵsanitizeStyle', moduleName: CORE };
Identifiers.sanitizeResourceUrl = { name: 'ɵɵsanitizeResourceUrl', moduleName: CORE };
Identifiers.sanitizeScript = { name: 'ɵɵsanitizeScript', moduleName: CORE };
Identifiers.sanitizeUrl = { name: 'ɵɵsanitizeUrl', moduleName: CORE };
Identifiers.sanitizeUrlOrResourceUrl = { name: 'ɵɵsanitizeUrlOrResourceUrl', moduleName: CORE };
Identifiers.trustConstantHtml = { name: 'ɵɵtrustConstantHtml', moduleName: CORE };
Identifiers.trustConstantResourceUrl = { name: 'ɵɵtrustConstantResourceUrl', moduleName: CORE };

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
const VERSION$1 = 3;
const JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
class SourceMapGenerator {
    constructor(file = null) {
        this.file = file;
        this.sourcesContent = new Map();
        this.lines = [];
        this.lastCol0 = 0;
        this.hasMappings = false;
    }
    // The content is `null` when the content is expected to be loaded using the URL
    addSource(url, content = null) {
        if (!this.sourcesContent.has(url)) {
            this.sourcesContent.set(url, content);
        }
        return this;
    }
    addLine() {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
    }
    addMapping(col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
            throw new Error(`A line must be added before mappings can be added`);
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
            throw new Error(`Unknown source file "${sourceUrl}"`);
        }
        if (col0 == null) {
            throw new Error(`The column in the generated code must be provided`);
        }
        if (col0 < this.lastCol0) {
            throw new Error(`Mapping should be added in output order`);
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
            throw new Error(`The source location must be provided when a source url is provided`);
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({ col0, sourceUrl, sourceLine0, sourceCol0 });
        return this;
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get currentLine() {
        return this.lines.slice(-1)[0];
    }
    toJSON() {
        if (!this.hasMappings) {
            return null;
        }
        const sourcesIndex = new Map();
        const sources = [];
        const sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach((url, i) => {
            sourcesIndex.set(url, i);
            sources.push(url);
            sourcesContent.push(this.sourcesContent.get(url) || null);
        });
        let mappings = '';
        let lastCol0 = 0;
        let lastSourceIndex = 0;
        let lastSourceLine0 = 0;
        let lastSourceCol0 = 0;
        this.lines.forEach(segments => {
            lastCol0 = 0;
            mappings += segments
                .map(segment => {
                // zero-based starting column of the line in the generated code
                let segAsStr = toBase64VLQ(segment.col0 - lastCol0);
                lastCol0 = segment.col0;
                if (segment.sourceUrl != null) {
                    // zero-based index into the “sources” list
                    segAsStr +=
                        toBase64VLQ(sourcesIndex.get(segment.sourceUrl) - lastSourceIndex);
                    lastSourceIndex = sourcesIndex.get(segment.sourceUrl);
                    // the zero-based starting line in the original source
                    segAsStr += toBase64VLQ(segment.sourceLine0 - lastSourceLine0);
                    lastSourceLine0 = segment.sourceLine0;
                    // the zero-based starting column in the original source
                    segAsStr += toBase64VLQ(segment.sourceCol0 - lastSourceCol0);
                    lastSourceCol0 = segment.sourceCol0;
                }
                return segAsStr;
            })
                .join(',');
            mappings += ';';
        });
        mappings = mappings.slice(0, -1);
        return {
            'file': this.file || '',
            'version': VERSION$1,
            'sourceRoot': '',
            'sources': sources,
            'sourcesContent': sourcesContent,
            'mappings': mappings,
        };
    }
    toJsComment() {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
            '';
    }
}
function toBase64String(value) {
    let b64 = '';
    const encoded = utf8Encode(value);
    for (let i = 0; i < encoded.length;) {
        const i1 = encoded[i++];
        const i2 = i < encoded.length ? encoded[i++] : null;
        const i3 = i < encoded.length ? encoded[i++] : null;
        b64 += toBase64Digit(i1 >> 2);
        b64 += toBase64Digit(((i1 & 3) << 4) | (i2 === null ? 0 : i2 >> 4));
        b64 += i2 === null ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 === null ? 0 : i3 >> 6));
        b64 += i2 === null || i3 === null ? '=' : toBase64Digit(i3 & 63);
    }
    return b64;
}
function toBase64VLQ(value) {
    value = value < 0 ? ((-value) << 1) + 1 : value << 1;
    let out = '';
    do {
        let digit = value & 31;
        value = value >> 5;
        if (value > 0) {
            digit = digit | 32;
        }
        out += toBase64Digit(digit);
    } while (value > 0);
    return out;
}
const B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function toBase64Digit(value) {
    if (value < 0 || value >= 64) {
        throw new Error(`Can only encode value in the range [0, 63]`);
    }
    return B64_DIGITS[value];
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
const _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
const _INDENT_WITH = '  ';
class _EmittedLine {
    constructor(indent) {
        this.indent = indent;
        this.partsLength = 0;
        this.parts = [];
        this.srcSpans = [];
    }
}
class EmitterVisitorContext {
    constructor(_indent) {
        this._indent = _indent;
        this._lines = [new _EmittedLine(_indent)];
    }
    static createRoot() {
        return new EmitterVisitorContext(0);
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get _currentLine() {
        return this._lines[this._lines.length - 1];
    }
    println(from, lastPart = '') {
        this.print(from || null, lastPart, true);
    }
    lineIsEmpty() {
        return this._currentLine.parts.length === 0;
    }
    lineLength() {
        return this._currentLine.indent * _INDENT_WITH.length + this._currentLine.partsLength;
    }
    print(from, part, newLine = false) {
        if (part.length > 0) {
            this._currentLine.parts.push(part);
            this._currentLine.partsLength += part.length;
            this._currentLine.srcSpans.push(from && from.sourceSpan || null);
        }
        if (newLine) {
            this._lines.push(new _EmittedLine(this._indent));
        }
    }
    removeEmptyLastLine() {
        if (this.lineIsEmpty()) {
            this._lines.pop();
        }
    }
    incIndent() {
        this._indent++;
        if (this.lineIsEmpty()) {
            this._currentLine.indent = this._indent;
        }
    }
    decIndent() {
        this._indent--;
        if (this.lineIsEmpty()) {
            this._currentLine.indent = this._indent;
        }
    }
    toSource() {
        return this.sourceLines
            .map(l => l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : '')
            .join('\n');
    }
    toSourceMapGenerator(genFilePath, startsAtLine = 0) {
        const map = new SourceMapGenerator(genFilePath);
        let firstOffsetMapped = false;
        const mapFirstOffsetIfNeeded = () => {
            if (!firstOffsetMapped) {
                // Add a single space so that tools won't try to load the file from disk.
                // Note: We are using virtual urls like `ng:///`, so we have to
                // provide a content here.
                map.addSource(genFilePath, ' ').addMapping(0, genFilePath, 0, 0);
                firstOffsetMapped = true;
            }
        };
        for (let i = 0; i < startsAtLine; i++) {
            map.addLine();
            mapFirstOffsetIfNeeded();
        }
        this.sourceLines.forEach((line, lineIdx) => {
            map.addLine();
            const spans = line.srcSpans;
            const parts = line.parts;
            let col0 = line.indent * _INDENT_WITH.length;
            let spanIdx = 0;
            // skip leading parts without source spans
            while (spanIdx < spans.length && !spans[spanIdx]) {
                col0 += parts[spanIdx].length;
                spanIdx++;
            }
            if (spanIdx < spans.length && lineIdx === 0 && col0 === 0) {
                firstOffsetMapped = true;
            }
            else {
                mapFirstOffsetIfNeeded();
            }
            while (spanIdx < spans.length) {
                const span = spans[spanIdx];
                const source = span.start.file;
                const sourceLine = span.start.line;
                const sourceCol = span.start.col;
                map.addSource(source.url, source.content)
                    .addMapping(col0, source.url, sourceLine, sourceCol);
                col0 += parts[spanIdx].length;
                spanIdx++;
                // assign parts without span or the same span to the previous segment
                while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
                    col0 += parts[spanIdx].length;
                    spanIdx++;
                }
            }
        });
        return map;
    }
    spanOf(line, column) {
        const emittedLine = this._lines[line];
        if (emittedLine) {
            let columnsLeft = column - _createIndent(emittedLine.indent).length;
            for (let partIndex = 0; partIndex < emittedLine.parts.length; partIndex++) {
                const part = emittedLine.parts[partIndex];
                if (part.length > columnsLeft) {
                    return emittedLine.srcSpans[partIndex];
                }
                columnsLeft -= part.length;
            }
        }
        return null;
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get sourceLines() {
        if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
            return this._lines.slice(0, -1);
        }
        return this._lines;
    }
}
class AbstractEmitterVisitor {
    constructor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
    }
    printLeadingComments(stmt, ctx) {
        if (stmt.leadingComments === undefined) {
            return;
        }
        for (const comment of stmt.leadingComments) {
            if (comment instanceof JSDocComment) {
                ctx.print(stmt, `/*${comment.toString()}*/`, comment.trailingNewline);
            }
            else {
                if (comment.multiline) {
                    ctx.print(stmt, `/* ${comment.text} */`, comment.trailingNewline);
                }
                else {
                    comment.text.split('\n').forEach((line) => {
                        ctx.println(stmt, `// ${line}`);
                    });
                }
            }
        }
    }
    visitExpressionStmt(stmt, ctx) {
        this.printLeadingComments(stmt, ctx);
        stmt.expr.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    }
    visitReturnStmt(stmt, ctx) {
        this.printLeadingComments(stmt, ctx);
        ctx.print(stmt, `return `);
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    }
    visitIfStmt(stmt, ctx) {
        this.printLeadingComments(stmt, ctx);
        ctx.print(stmt, `if (`);
        stmt.condition.visitExpression(this, ctx);
        ctx.print(stmt, `) {`);
        const hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
            ctx.print(stmt, ` `);
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.removeEmptyLastLine();
            ctx.print(stmt, ` `);
        }
        else {
            ctx.println();
            ctx.incIndent();
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.decIndent();
            if (hasElseCase) {
                ctx.println(stmt, `} else {`);
                ctx.incIndent();
                this.visitAllStatements(stmt.falseCase, ctx);
                ctx.decIndent();
            }
        }
        ctx.println(stmt, `}`);
        return null;
    }
    visitWriteVarExpr(expr, ctx) {
        const lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        ctx.print(expr, `${expr.name} = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    visitWriteKeyExpr(expr, ctx) {
        const lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, `[`);
        expr.index.visitExpression(this, ctx);
        ctx.print(expr, `] = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    visitWritePropExpr(expr, ctx) {
        const lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, `.${expr.name} = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    visitInvokeFunctionExpr(expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print(expr, `(`);
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(expr, `)`);
        return null;
    }
    visitTaggedTemplateExpr(expr, ctx) {
        expr.tag.visitExpression(this, ctx);
        ctx.print(expr, '`' + expr.template.elements[0].rawText);
        for (let i = 1; i < expr.template.elements.length; i++) {
            ctx.print(expr, '${');
            expr.template.expressions[i - 1].visitExpression(this, ctx);
            ctx.print(expr, `}${expr.template.elements[i].rawText}`);
        }
        ctx.print(expr, '`');
        return null;
    }
    visitWrappedNodeExpr(ast, ctx) {
        throw new Error('Abstract emitter cannot visit WrappedNodeExpr.');
    }
    visitTypeofExpr(expr, ctx) {
        ctx.print(expr, 'typeof ');
        expr.expr.visitExpression(this, ctx);
    }
    visitReadVarExpr(ast, ctx) {
        ctx.print(ast, ast.name);
        return null;
    }
    visitInstantiateExpr(ast, ctx) {
        ctx.print(ast, `new `);
        ast.classExpr.visitExpression(this, ctx);
        ctx.print(ast, `(`);
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, `)`);
        return null;
    }
    visitLiteralExpr(ast, ctx) {
        const value = ast.value;
        if (typeof value === 'string') {
            ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
        }
        else {
            ctx.print(ast, `${value}`);
        }
        return null;
    }
    visitLocalizedString(ast, ctx) {
        const head = ast.serializeI18nHead();
        ctx.print(ast, '$localize `' + head.raw);
        for (let i = 1; i < ast.messageParts.length; i++) {
            ctx.print(ast, '${');
            ast.expressions[i - 1].visitExpression(this, ctx);
            ctx.print(ast, `}${ast.serializeI18nTemplatePart(i).raw}`);
        }
        ctx.print(ast, '`');
        return null;
    }
    visitConditionalExpr(ast, ctx) {
        ctx.print(ast, `(`);
        ast.condition.visitExpression(this, ctx);
        ctx.print(ast, '? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(ast, ': ');
        ast.falseCase.visitExpression(this, ctx);
        ctx.print(ast, `)`);
        return null;
    }
    visitNotExpr(ast, ctx) {
        ctx.print(ast, '!');
        ast.condition.visitExpression(this, ctx);
        return null;
    }
    visitUnaryOperatorExpr(ast, ctx) {
        let opStr;
        switch (ast.operator) {
            case UnaryOperator.Plus:
                opStr = '+';
                break;
            case UnaryOperator.Minus:
                opStr = '-';
                break;
            default:
                throw new Error(`Unknown operator ${ast.operator}`);
        }
        if (ast.parens)
            ctx.print(ast, `(`);
        ctx.print(ast, opStr);
        ast.expr.visitExpression(this, ctx);
        if (ast.parens)
            ctx.print(ast, `)`);
        return null;
    }
    visitBinaryOperatorExpr(ast, ctx) {
        let opStr;
        switch (ast.operator) {
            case BinaryOperator.Equals:
                opStr = '==';
                break;
            case BinaryOperator.Identical:
                opStr = '===';
                break;
            case BinaryOperator.NotEquals:
                opStr = '!=';
                break;
            case BinaryOperator.NotIdentical:
                opStr = '!==';
                break;
            case BinaryOperator.And:
                opStr = '&&';
                break;
            case BinaryOperator.BitwiseAnd:
                opStr = '&';
                break;
            case BinaryOperator.Or:
                opStr = '||';
                break;
            case BinaryOperator.Plus:
                opStr = '+';
                break;
            case BinaryOperator.Minus:
                opStr = '-';
                break;
            case BinaryOperator.Divide:
                opStr = '/';
                break;
            case BinaryOperator.Multiply:
                opStr = '*';
                break;
            case BinaryOperator.Modulo:
                opStr = '%';
                break;
            case BinaryOperator.Lower:
                opStr = '<';
                break;
            case BinaryOperator.LowerEquals:
                opStr = '<=';
                break;
            case BinaryOperator.Bigger:
                opStr = '>';
                break;
            case BinaryOperator.BiggerEquals:
                opStr = '>=';
                break;
            case BinaryOperator.NullishCoalesce:
                opStr = '??';
                break;
            default:
                throw new Error(`Unknown operator ${ast.operator}`);
        }
        if (ast.parens)
            ctx.print(ast, `(`);
        ast.lhs.visitExpression(this, ctx);
        ctx.print(ast, ` ${opStr} `);
        ast.rhs.visitExpression(this, ctx);
        if (ast.parens)
            ctx.print(ast, `)`);
        return null;
    }
    visitReadPropExpr(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, `.`);
        ctx.print(ast, ast.name);
        return null;
    }
    visitReadKeyExpr(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, `[`);
        ast.index.visitExpression(this, ctx);
        ctx.print(ast, `]`);
        return null;
    }
    visitLiteralArrayExpr(ast, ctx) {
        ctx.print(ast, `[`);
        this.visitAllExpressions(ast.entries, ctx, ',');
        ctx.print(ast, `]`);
        return null;
    }
    visitLiteralMapExpr(ast, ctx) {
        ctx.print(ast, `{`);
        this.visitAllObjects(entry => {
            ctx.print(ast, `${escapeIdentifier(entry.key, this._escapeDollarInStrings, entry.quoted)}:`);
            entry.value.visitExpression(this, ctx);
        }, ast.entries, ctx, ',');
        ctx.print(ast, `}`);
        return null;
    }
    visitCommaExpr(ast, ctx) {
        ctx.print(ast, '(');
        this.visitAllExpressions(ast.parts, ctx, ',');
        ctx.print(ast, ')');
        return null;
    }
    visitAllExpressions(expressions, ctx, separator) {
        this.visitAllObjects(expr => expr.visitExpression(this, ctx), expressions, ctx, separator);
    }
    visitAllObjects(handler, expressions, ctx, separator) {
        let incrementedIndent = false;
        for (let i = 0; i < expressions.length; i++) {
            if (i > 0) {
                if (ctx.lineLength() > 80) {
                    ctx.print(null, separator, true);
                    if (!incrementedIndent) {
                        // continuation are marked with double indent.
                        ctx.incIndent();
                        ctx.incIndent();
                        incrementedIndent = true;
                    }
                }
                else {
                    ctx.print(null, separator, false);
                }
            }
            handler(expressions[i]);
        }
        if (incrementedIndent) {
            // continuation are marked with double indent.
            ctx.decIndent();
            ctx.decIndent();
        }
    }
    visitAllStatements(statements, ctx) {
        statements.forEach((stmt) => stmt.visitStatement(this, ctx));
    }
}
function escapeIdentifier(input, escapeDollar, alwaysQuote = true) {
    if (input == null) {
        return null;
    }
    const body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, (...match) => {
        if (match[0] == '$') {
            return escapeDollar ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return `\\${match[0]}`;
        }
    });
    const requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
    return requiresQuotes ? `'${body}'` : body;
}
function _createIndent(count) {
    let res = '';
    for (let i = 0; i < count; i++) {
        res += _INDENT_WITH;
    }
    return res;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function typeWithParameters(type, numParams) {
    if (numParams === 0) {
        return expressionType(type);
    }
    const params = [];
    for (let i = 0; i < numParams; i++) {
        params.push(DYNAMIC_TYPE);
    }
    return expressionType(type, undefined, params);
}
const ANIMATE_SYMBOL_PREFIX = '@';
function prepareSyntheticPropertyName(name) {
    return `${ANIMATE_SYMBOL_PREFIX}${name}`;
}
function prepareSyntheticListenerName(name, phase) {
    return `${ANIMATE_SYMBOL_PREFIX}${name}.${phase}`;
}
function getSafePropertyAccessString(accessor, name) {
    const escapedName = escapeIdentifier(name, false, false);
    return escapedName !== name ? `${accessor}[${escapedName}]` : `${accessor}.${name}`;
}
function prepareSyntheticListenerFunctionName(name, phase) {
    return `animation_${name}_${phase}`;
}
function jitOnlyGuardedExpression(expr) {
    return guardedExpression('ngJitMode', expr);
}
function devOnlyGuardedExpression(expr) {
    return guardedExpression('ngDevMode', expr);
}
function guardedExpression(guard, expr) {
    const guardExpr = new ExternalExpr({ name: guard, moduleName: null });
    const guardNotDefined = new BinaryOperatorExpr(BinaryOperator.Identical, new TypeofExpr(guardExpr), literal('undefined'));
    const guardUndefinedOrTrue = new BinaryOperatorExpr(BinaryOperator.Or, guardNotDefined, guardExpr, /* type */ undefined, 
    /* sourceSpan */ undefined, true);
    return new BinaryOperatorExpr(BinaryOperator.And, guardUndefinedOrTrue, expr);
}
function wrapReference(value) {
    const wrapped = new WrappedNodeExpr(value);
    return { value: wrapped, type: wrapped };
}
function refsToArray(refs, shouldForwardDeclare) {
    const values = literalArr(refs.map(ref => ref.value));
    return shouldForwardDeclare ? fn([], [new ReturnStatement(values)]) : values;
}
function createMayBeForwardRefExpression(expression, forwardRef) {
    return { expression, forwardRef };
}
/**
 * Convert a `MaybeForwardRefExpression` to an `Expression`, possibly wrapping its expression in a
 * `forwardRef()` call.
 *
 * If `MaybeForwardRefExpression.forwardRef` is `ForwardRefHandling.Unwrapped` then the expression
 * was originally wrapped in a `forwardRef()` call to prevent the value from being eagerly evaluated
 * in the code.
 *
 * See `packages/compiler-cli/src/ngtsc/annotations/src/injectable.ts` and
 * `packages/compiler/src/jit_compiler_facade.ts` for more information.
 */
function convertFromMaybeForwardRefExpression({ expression, forwardRef }) {
    switch (forwardRef) {
        case 0 /* None */:
        case 1 /* Wrapped */:
            return expression;
        case 2 /* Unwrapped */:
            return generateForwardRef(expression);
    }
}
/**
 * Generate an expression that has the given `expr` wrapped in the following form:
 *
 * ```
 * forwardRef(() => expr)
 * ```
 */
function generateForwardRef(expr) {
    return importExpr(Identifiers.forwardRef).callFn([fn([], [new ReturnStatement(expr)])]);
}

var R3FactoryDelegateType;
(function (R3FactoryDelegateType) {
    R3FactoryDelegateType[R3FactoryDelegateType["Class"] = 0] = "Class";
    R3FactoryDelegateType[R3FactoryDelegateType["Function"] = 1] = "Function";
})(R3FactoryDelegateType || (R3FactoryDelegateType = {}));
var FactoryTarget$1;
(function (FactoryTarget) {
    FactoryTarget[FactoryTarget["Directive"] = 0] = "Directive";
    FactoryTarget[FactoryTarget["Component"] = 1] = "Component";
    FactoryTarget[FactoryTarget["Injectable"] = 2] = "Injectable";
    FactoryTarget[FactoryTarget["Pipe"] = 3] = "Pipe";
    FactoryTarget[FactoryTarget["NgModule"] = 4] = "NgModule";
})(FactoryTarget$1 || (FactoryTarget$1 = {}));
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 */
function compileFactoryFunction(meta) {
    const t = variable('t');
    let baseFactoryVar = null;
    // The type to instantiate via constructor invocation. If there is no delegated factory, meaning
    // this type is always created by constructor invocation, then this is the type-to-create
    // parameter provided by the user (t) if specified, or the current type if not. If there is a
    // delegated factory (which is used to create the current type) then this is only the type-to-
    // create parameter (t).
    const typeForCtor = !isDelegatedFactoryMetadata(meta) ?
        new BinaryOperatorExpr(BinaryOperator.Or, t, meta.internalType) :
        t;
    let ctorExpr = null;
    if (meta.deps !== null) {
        // There is a constructor (either explicitly or implicitly defined).
        if (meta.deps !== 'invalid') {
            ctorExpr = new InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.target));
        }
    }
    else {
        // There is no constructor, use the base class' factory to construct typeForCtor.
        baseFactoryVar = variable(`ɵ${meta.name}_BaseFactory`);
        ctorExpr = baseFactoryVar.callFn([typeForCtor]);
    }
    const body = [];
    let retExpr = null;
    function makeConditionalFactory(nonCtorExpr) {
        const r = variable('r');
        body.push(r.set(NULL_EXPR).toDeclStmt());
        const ctorStmt = ctorExpr !== null ? r.set(ctorExpr).toStmt() :
            importExpr(Identifiers.invalidFactory).callFn([]).toStmt();
        body.push(ifStmt(t, [ctorStmt], [r.set(nonCtorExpr).toStmt()]));
        return r;
    }
    if (isDelegatedFactoryMetadata(meta)) {
        // This type is created with a delegated factory. If a type parameter is not specified, call
        // the factory instead.
        const delegateArgs = injectDependencies(meta.delegateDeps, meta.target);
        // Either call `new delegate(...)` or `delegate(...)` depending on meta.delegateType.
        const factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ?
            InstantiateExpr :
            InvokeFunctionExpr)(meta.delegate, delegateArgs);
        retExpr = makeConditionalFactory(factoryExpr);
    }
    else if (isExpressionFactoryMetadata(meta)) {
        // TODO(alxhub): decide whether to lower the value here or in the caller
        retExpr = makeConditionalFactory(meta.expression);
    }
    else {
        retExpr = ctorExpr;
    }
    if (retExpr === null) {
        // The expression cannot be formed so render an `ɵɵinvalidFactory()` call.
        body.push(importExpr(Identifiers.invalidFactory).callFn([]).toStmt());
    }
    else if (baseFactoryVar !== null) {
        // This factory uses a base factory, so call `ɵɵgetInheritedFactory()` to compute it.
        const getInheritedFactoryCall = importExpr(Identifiers.getInheritedFactory).callFn([meta.internalType]);
        // Memoize the base factoryFn: `baseFactory || (baseFactory = ɵɵgetInheritedFactory(...))`
        const baseFactory = new BinaryOperatorExpr(BinaryOperator.Or, baseFactoryVar, baseFactoryVar.set(getInheritedFactoryCall));
        body.push(new ReturnStatement(baseFactory.callFn([typeForCtor])));
    }
    else {
        // This is straightforward factory, just return it.
        body.push(new ReturnStatement(retExpr));
    }
    let factoryFn = fn([new FnParam('t', DYNAMIC_TYPE)], body, INFERRED_TYPE, undefined, `${meta.name}_Factory`);
    if (baseFactoryVar !== null) {
        // There is a base factory variable so wrap its declaration along with the factory function into
        // an IIFE.
        factoryFn = fn([], [
            new DeclareVarStmt(baseFactoryVar.name), new ReturnStatement(factoryFn)
        ]).callFn([], /* sourceSpan */ undefined, /* pure */ true);
    }
    return {
        expression: factoryFn,
        statements: [],
        type: createFactoryType(meta),
    };
}
function createFactoryType(meta) {
    const ctorDepsType = meta.deps !== null && meta.deps !== 'invalid' ? createCtorDepsType(meta.deps) : NONE_TYPE;
    return expressionType(importExpr(Identifiers.FactoryDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount), ctorDepsType]));
}
function injectDependencies(deps, target) {
    return deps.map((dep, index) => compileInjectDependency(dep, target, index));
}
function compileInjectDependency(dep, target, index) {
    // Interpret the dependency according to its resolved type.
    if (dep.token === null) {
        return importExpr(Identifiers.invalidFactoryDep).callFn([literal(index)]);
    }
    else if (dep.attributeNameType === null) {
        // Build up the injection flags according to the metadata.
        const flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
            (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
            (dep.optional ? 8 /* Optional */ : 0) |
            (target === FactoryTarget$1.Pipe ? 16 /* ForPipe */ : 0);
        // If this dependency is optional or otherwise has non-default flags, then additional
        // parameters describing how to inject the dependency must be passed to the inject function
        // that's being used.
        let flagsParam = (flags !== 0 /* Default */ || dep.optional) ? literal(flags) : null;
        // Build up the arguments to the injectFn call.
        const injectArgs = [dep.token];
        if (flagsParam) {
            injectArgs.push(flagsParam);
        }
        const injectFn = getInjectFn(target);
        return importExpr(injectFn).callFn(injectArgs);
    }
    else {
        // The `dep.attributeTypeName` value is defined, which indicates that this is an `@Attribute()`
        // type dependency. For the generated JS we still want to use the `dep.token` value in case the
        // name given for the attribute is not a string literal. For example given `@Attribute(foo())`,
        // we want to generate `ɵɵinjectAttribute(foo())`.
        //
        // The `dep.attributeTypeName` is only actually used (in `createCtorDepType()`) to generate
        // typings.
        return importExpr(Identifiers.injectAttribute).callFn([dep.token]);
    }
}
function createCtorDepsType(deps) {
    let hasTypes = false;
    const attributeTypes = deps.map(dep => {
        const type = createCtorDepType(dep);
        if (type !== null) {
            hasTypes = true;
            return type;
        }
        else {
            return literal(null);
        }
    });
    if (hasTypes) {
        return expressionType(literalArr(attributeTypes));
    }
    else {
        return NONE_TYPE;
    }
}
function createCtorDepType(dep) {
    const entries = [];
    if (dep.attributeNameType !== null) {
        entries.push({ key: 'attribute', value: dep.attributeNameType, quoted: false });
    }
    if (dep.optional) {
        entries.push({ key: 'optional', value: literal(true), quoted: false });
    }
    if (dep.host) {
        entries.push({ key: 'host', value: literal(true), quoted: false });
    }
    if (dep.self) {
        entries.push({ key: 'self', value: literal(true), quoted: false });
    }
    if (dep.skipSelf) {
        entries.push({ key: 'skipSelf', value: literal(true), quoted: false });
    }
    return entries.length > 0 ? literalMap(entries) : null;
}
function isDelegatedFactoryMetadata(meta) {
    return meta.delegateType !== undefined;
}
function isExpressionFactoryMetadata(meta) {
    return meta.expression !== undefined;
}
function getInjectFn(target) {
    switch (target) {
        case FactoryTarget$1.Component:
        case FactoryTarget$1.Directive:
        case FactoryTarget$1.Pipe:
            return Identifiers.directiveInject;
        case FactoryTarget$1.NgModule:
        case FactoryTarget$1.Injectable:
        default:
            return Identifiers.inject;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * This is an R3 `Node`-like wrapper for a raw `html.Comment` node. We do not currently
 * require the implementation of a visitor for Comments as they are only collected at
 * the top-level of the R3 AST, and only if `Render3ParseOptions['collectCommentNodes']`
 * is true.
 */
class Comment$1 {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(_visitor) {
        throw new Error('visit() not implemented for Comment');
    }
}
class Text$3 {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor) {
        return visitor.visitText(this);
    }
}
class BoundText {
    constructor(value, sourceSpan, i18n) {
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.i18n = i18n;
    }
    visit(visitor) {
        return visitor.visitBoundText(this);
    }
}
/**
 * Represents a text attribute in the template.
 *
 * `valueSpan` may not be present in cases where there is no value `<div a></div>`.
 * `keySpan` may also not be present for synthetic attributes from ICU expansions.
 */
class TextAttribute {
    constructor(name, value, sourceSpan, keySpan, valueSpan, i18n) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
        this.i18n = i18n;
    }
    visit(visitor) {
        return visitor.visitTextAttribute(this);
    }
}
class BoundAttribute {
    constructor(name, type, securityContext, value, unit, sourceSpan, keySpan, valueSpan, i18n) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
        this.i18n = i18n;
    }
    static fromBoundElementProperty(prop, i18n) {
        if (prop.keySpan === undefined) {
            throw new Error(`Unexpected state: keySpan must be defined for bound attributes but was not for ${prop.name}: ${prop.sourceSpan}`);
        }
        return new BoundAttribute(prop.name, prop.type, prop.securityContext, prop.value, prop.unit, prop.sourceSpan, prop.keySpan, prop.valueSpan, i18n);
    }
    visit(visitor) {
        return visitor.visitBoundAttribute(this);
    }
}
class BoundEvent {
    constructor(name, type, handler, target, phase, sourceSpan, handlerSpan, keySpan) {
        this.name = name;
        this.type = type;
        this.handler = handler;
        this.target = target;
        this.phase = phase;
        this.sourceSpan = sourceSpan;
        this.handlerSpan = handlerSpan;
        this.keySpan = keySpan;
    }
    static fromParsedEvent(event) {
        const target = event.type === 0 /* Regular */ ? event.targetOrPhase : null;
        const phase = event.type === 1 /* Animation */ ? event.targetOrPhase : null;
        if (event.keySpan === undefined) {
            throw new Error(`Unexpected state: keySpan must be defined for bound event but was not for ${event.name}: ${event.sourceSpan}`);
        }
        return new BoundEvent(event.name, event.type, event.handler, target, phase, event.sourceSpan, event.handlerSpan, event.keySpan);
    }
    visit(visitor) {
        return visitor.visitBoundEvent(this);
    }
}
class Element$1 {
    constructor(name, attributes, inputs, outputs, children, references, sourceSpan, startSourceSpan, endSourceSpan, i18n) {
        this.name = name;
        this.attributes = attributes;
        this.inputs = inputs;
        this.outputs = outputs;
        this.children = children;
        this.references = references;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
        this.i18n = i18n;
    }
    visit(visitor) {
        return visitor.visitElement(this);
    }
}
class Template {
    constructor(
    // tagName is the name of the container element, if applicable.
    // `null` is a special case for when there is a structural directive on an `ng-template` so
    // the renderer can differentiate between the synthetic template and the one written in the
    // file.
    tagName, attributes, inputs, outputs, templateAttrs, children, references, variables, sourceSpan, startSourceSpan, endSourceSpan, i18n) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.inputs = inputs;
        this.outputs = outputs;
        this.templateAttrs = templateAttrs;
        this.children = children;
        this.references = references;
        this.variables = variables;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
        this.i18n = i18n;
    }
    visit(visitor) {
        return visitor.visitTemplate(this);
    }
}
class Content {
    constructor(selector, attributes, sourceSpan, i18n) {
        this.selector = selector;
        this.attributes = attributes;
        this.sourceSpan = sourceSpan;
        this.i18n = i18n;
        this.name = 'ng-content';
    }
    visit(visitor) {
        return visitor.visitContent(this);
    }
}
class Variable {
    constructor(name, value, sourceSpan, keySpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
    }
    visit(visitor) {
        return visitor.visitVariable(this);
    }
}
class Reference {
    constructor(name, value, sourceSpan, keySpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
    }
    visit(visitor) {
        return visitor.visitReference(this);
    }
}
class Icu$1 {
    constructor(vars, placeholders, sourceSpan, i18n) {
        this.vars = vars;
        this.placeholders = placeholders;
        this.sourceSpan = sourceSpan;
        this.i18n = i18n;
    }
    visit(visitor) {
        return visitor.visitIcu(this);
    }
}
class NullVisitor {
    visitElement(element) { }
    visitTemplate(template) { }
    visitContent(content) { }
    visitVariable(variable) { }
    visitReference(reference) { }
    visitTextAttribute(attribute) { }
    visitBoundAttribute(attribute) { }
    visitBoundEvent(attribute) { }
    visitText(text) { }
    visitBoundText(text) { }
    visitIcu(icu) { }
}
class RecursiveVisitor$1 {
    visitElement(element) {
        visitAll$1(this, element.attributes);
        visitAll$1(this, element.inputs);
        visitAll$1(this, element.outputs);
        visitAll$1(this, element.children);
        visitAll$1(this, element.references);
    }
    visitTemplate(template) {
        visitAll$1(this, template.attributes);
        visitAll$1(this, template.inputs);
        visitAll$1(this, template.outputs);
        visitAll$1(this, template.children);
        visitAll$1(this, template.references);
        visitAll$1(this, template.variables);
    }
    visitContent(content) { }
    visitVariable(variable) { }
    visitReference(reference) { }
    visitTextAttribute(attribute) { }
    visitBoundAttribute(attribute) { }
    visitBoundEvent(attribute) { }
    visitText(text) { }
    visitBoundText(text) { }
    visitIcu(icu) { }
}
class TransformVisitor {
    visitElement(element) {
        const newAttributes = transformAll(this, element.attributes);
        const newInputs = transformAll(this, element.inputs);
        const newOutputs = transformAll(this, element.outputs);
        const newChildren = transformAll(this, element.children);
        const newReferences = transformAll(this, element.references);
        if (newAttributes != element.attributes || newInputs != element.inputs ||
            newOutputs != element.outputs || newChildren != element.children ||
            newReferences != element.references) {
            return new Element$1(element.name, newAttributes, newInputs, newOutputs, newChildren, newReferences, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return element;
    }
    visitTemplate(template) {
        const newAttributes = transformAll(this, template.attributes);
        const newInputs = transformAll(this, template.inputs);
        const newOutputs = transformAll(this, template.outputs);
        const newTemplateAttrs = transformAll(this, template.templateAttrs);
        const newChildren = transformAll(this, template.children);
        const newReferences = transformAll(this, template.references);
        const newVariables = transformAll(this, template.variables);
        if (newAttributes != template.attributes || newInputs != template.inputs ||
            newOutputs != template.outputs || newTemplateAttrs != template.templateAttrs ||
            newChildren != template.children || newReferences != template.references ||
            newVariables != template.variables) {
            return new Template(template.tagName, newAttributes, newInputs, newOutputs, newTemplateAttrs, newChildren, newReferences, newVariables, template.sourceSpan, template.startSourceSpan, template.endSourceSpan);
        }
        return template;
    }
    visitContent(content) {
        return content;
    }
    visitVariable(variable) {
        return variable;
    }
    visitReference(reference) {
        return reference;
    }
    visitTextAttribute(attribute) {
        return attribute;
    }
    visitBoundAttribute(attribute) {
        return attribute;
    }
    visitBoundEvent(attribute) {
        return attribute;
    }
    visitText(text) {
        return text;
    }
    visitBoundText(text) {
        return text;
    }
    visitIcu(icu) {
        return icu;
    }
}
function visitAll$1(visitor, nodes) {
    const result = [];
    if (visitor.visit) {
        for (const node of nodes) {
            const newNode = visitor.visit(node) || node.visit(visitor);
        }
    }
    else {
        for (const node of nodes) {
            const newNode = node.visit(visitor);
            if (newNode) {
                result.push(newNode);
            }
        }
    }
    return result;
}
function transformAll(visitor, nodes) {
    const result = [];
    let changed = false;
    for (const node of nodes) {
        const newNode = node.visit(visitor);
        if (newNode) {
            result.push(newNode);
        }
        changed = changed || newNode != node;
    }
    return changed ? result : nodes;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class Message {
    /**
     * @param nodes message AST
     * @param placeholders maps placeholder names to static content and their source spans
     * @param placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param meaning
     * @param description
     * @param customId
     */
    constructor(nodes, placeholders, placeholderToMessage, meaning, description, customId) {
        this.nodes = nodes;
        this.placeholders = placeholders;
        this.placeholderToMessage = placeholderToMessage;
        this.meaning = meaning;
        this.description = description;
        this.customId = customId;
        this.id = this.customId;
        /** The ids to use if there are no custom id and if `i18nLegacyMessageIdFormat` is not empty */
        this.legacyIds = [];
        this.messageString = serializeMessage(this.nodes);
        if (nodes.length) {
            this.sources = [{
                    filePath: nodes[0].sourceSpan.start.file.url,
                    startLine: nodes[0].sourceSpan.start.line + 1,
                    startCol: nodes[0].sourceSpan.start.col + 1,
                    endLine: nodes[nodes.length - 1].sourceSpan.end.line + 1,
                    endCol: nodes[0].sourceSpan.start.col + 1
                }];
        }
        else {
            this.sources = [];
        }
    }
}
class Text$2 {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
// TODO(vicb): do we really need this node (vs an array) ?
class Container {
    constructor(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitContainer(this, context);
    }
}
class Icu {
    constructor(expression, type, cases, sourceSpan) {
        this.expression = expression;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitIcu(this, context);
    }
}
class TagPlaceholder {
    constructor(tag, attrs, startName, closeName, children, isVoid, 
    // TODO sourceSpan should cover all (we need a startSourceSpan and endSourceSpan)
    sourceSpan, startSourceSpan, endSourceSpan) {
        this.tag = tag;
        this.attrs = attrs;
        this.startName = startName;
        this.closeName = closeName;
        this.children = children;
        this.isVoid = isVoid;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitTagPlaceholder(this, context);
    }
}
class Placeholder {
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitPlaceholder(this, context);
    }
}
class IcuPlaceholder {
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitIcuPlaceholder(this, context);
    }
}
// Clone the AST
class CloneVisitor {
    visitText(text, context) {
        return new Text$2(text.value, text.sourceSpan);
    }
    visitContainer(container, context) {
        const children = container.children.map(n => n.visit(this, context));
        return new Container(children, container.sourceSpan);
    }
    visitIcu(icu, context) {
        const cases = {};
        Object.keys(icu.cases).forEach(key => cases[key] = icu.cases[key].visit(this, context));
        const msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
    }
    visitTagPlaceholder(ph, context) {
        const children = ph.children.map(n => n.visit(this, context));
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan, ph.startSourceSpan, ph.endSourceSpan);
    }
    visitPlaceholder(ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
    }
    visitIcuPlaceholder(ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
    }
}
// Visit all the nodes recursively
class RecurseVisitor {
    visitText(text, context) { }
    visitContainer(container, context) {
        container.children.forEach(child => child.visit(this));
    }
    visitIcu(icu, context) {
        Object.keys(icu.cases).forEach(k => {
            icu.cases[k].visit(this);
        });
    }
    visitTagPlaceholder(ph, context) {
        ph.children.forEach(child => child.visit(this));
    }
    visitPlaceholder(ph, context) { }
    visitIcuPlaceholder(ph, context) { }
}
/**
 * Serialize the message to the Localize backtick string format that would appear in compiled code.
 */
function serializeMessage(messageNodes) {
    const visitor = new LocalizeMessageStringVisitor();
    const str = messageNodes.map(n => n.visit(visitor)).join('');
    return str;
}
class LocalizeMessageStringVisitor {
    visitText(text) {
        return text.value;
    }
    visitContainer(container) {
        return container.children.map(child => child.visit(this)).join('');
    }
    visitIcu(icu) {
        const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        return `{${icu.expressionPlaceholder}, ${icu.type}, ${strCases.join(' ')}}`;
    }
    visitTagPlaceholder(ph) {
        const children = ph.children.map(child => child.visit(this)).join('');
        return `{$${ph.startName}}${children}{$${ph.closeName}}`;
    }
    visitPlaceholder(ph) {
        return `{$${ph.name}}`;
    }
    visitIcuPlaceholder(ph) {
        return `{$${ph.name}}`;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class Serializer {
    // Creates a name mapper, see `PlaceholderMapper`
    // Returning `null` means that no name mapping is used.
    createNameMapper(message) {
        return null;
    }
}
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
class SimplePlaceholderMapper extends RecurseVisitor {
    // create a mapping from the message
    constructor(message, mapName) {
        super();
        this.mapName = mapName;
        this.internalToPublic = {};
        this.publicToNextId = {};
        this.publicToInternal = {};
        message.nodes.forEach(node => node.visit(this));
    }
    toPublicName(internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ?
            this.internalToPublic[internalName] :
            null;
    }
    toInternalName(publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
            null;
    }
    visitText(text, context) {
        return null;
    }
    visitTagPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.startName);
        super.visitTagPlaceholder(ph, context);
        this.visitPlaceholderName(ph.closeName);
    }
    visitPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    visitIcuPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    // XMB placeholders could only contains A-Z, 0-9 and _
    visitPlaceholderName(internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        let publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            const nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = `${publicName}_${nextId}`;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _Visitor$2 {
    visitTag(tag) {
        const strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        const strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join('')}</${tag.name}>`;
    }
    visitText(text) {
        return text.value;
    }
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    _serializeAttributes(attrs) {
        const strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    }
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
const _visitor = new _Visitor$2();
function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join('');
}
class Declaration {
    constructor(unescapedAttrs) {
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) {
        return visitor.visitDeclaration(this);
    }
}
class Doctype {
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    visit(visitor) {
        return visitor.visitDoctype(this);
    }
}
class Tag {
    constructor(name, unescapedAttrs = {}, children = []) {
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) {
        return visitor.visitTag(this);
    }
}
class Text$1 {
    constructor(unescapedValue) {
        this.value = escapeXml(unescapedValue);
    }
    visit(visitor) {
        return visitor.visitText(this);
    }
}
class CR extends Text$1 {
    constructor(ws = 0) {
        super(`\n${new Array(ws + 1).join(' ')}`);
    }
}
const _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
// Escape `_ESCAPED_CHARS` characters in the given text with encoded entities
function escapeXml(text) {
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _MESSAGES_TAG = 'messagebundle';
const _MESSAGE_TAG = 'msg';
const _PLACEHOLDER_TAG$3 = 'ph';
const _EXAMPLE_TAG = 'ex';
const _SOURCE_TAG$2 = 'source';
const _DOCTYPE = `<!ELEMENT messagebundle (msg)*>
<!ATTLIST messagebundle class CDATA #IMPLIED>

<!ELEMENT msg (#PCDATA|ph|source)*>
<!ATTLIST msg id CDATA #IMPLIED>
<!ATTLIST msg seq CDATA #IMPLIED>
<!ATTLIST msg name CDATA #IMPLIED>
<!ATTLIST msg desc CDATA #IMPLIED>
<!ATTLIST msg meaning CDATA #IMPLIED>
<!ATTLIST msg obsolete (obsolete) #IMPLIED>
<!ATTLIST msg xml:space (default|preserve) "default">
<!ATTLIST msg is_hidden CDATA #IMPLIED>

<!ELEMENT source (#PCDATA)>

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>`;
class Xmb extends Serializer {
    write(messages, locale) {
        const exampleVisitor = new ExampleVisitor();
        const visitor = new _Visitor$1();
        let rootNode = new Tag(_MESSAGES_TAG);
        messages.forEach(message => {
            const attrs = { id: message.id };
            if (message.description) {
                attrs['desc'] = message.description;
            }
            if (message.meaning) {
                attrs['meaning'] = message.meaning;
            }
            let sourceTags = [];
            message.sources.forEach((source) => {
                sourceTags.push(new Tag(_SOURCE_TAG$2, {}, [new Text$1(`${source.filePath}:${source.startLine}${source.endLine !== source.startLine ? ',' + source.endLine : ''}`)]));
            });
            rootNode.children.push(new CR(2), new Tag(_MESSAGE_TAG, attrs, [...sourceTags, ...visitor.serialize(message.nodes)]));
        });
        rootNode.children.push(new CR());
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }),
            new CR(),
            new Doctype(_MESSAGES_TAG, _DOCTYPE),
            new CR(),
            exampleVisitor.addDefaultExamples(rootNode),
            new CR(),
        ]);
    }
    load(content, url) {
        throw new Error('Unsupported');
    }
    digest(message) {
        return digest(message);
    }
    createNameMapper(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    }
}
class _Visitor$1 {
    visitText(text, context) {
        return [new Text$1(text.value)];
    }
    visitContainer(container, context) {
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    visitIcu(icu, context) {
        const nodes = [new Text$1(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$1(`${c} {`), ...icu.cases[c].visit(this), new Text$1(`} `));
        });
        nodes.push(new Text$1(`}`));
        return nodes;
    }
    visitTagPlaceholder(ph, context) {
        const startTagAsText = new Text$1(`<${ph.tag}>`);
        const startEx = new Tag(_EXAMPLE_TAG, {}, [startTagAsText]);
        // TC requires PH to have a non empty EX, and uses the text node to show the "original" value.
        const startTagPh = new Tag(_PLACEHOLDER_TAG$3, { name: ph.startName }, [startEx, startTagAsText]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        const closeTagAsText = new Text$1(`</${ph.tag}>`);
        const closeEx = new Tag(_EXAMPLE_TAG, {}, [closeTagAsText]);
        // TC requires PH to have a non empty EX, and uses the text node to show the "original" value.
        const closeTagPh = new Tag(_PLACEHOLDER_TAG$3, { name: ph.closeName }, [closeEx, closeTagAsText]);
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    visitPlaceholder(ph, context) {
        const interpolationAsText = new Text$1(`{{${ph.value}}}`);
        // Example tag needs to be not-empty for TC.
        const exTag = new Tag(_EXAMPLE_TAG, {}, [interpolationAsText]);
        return [
            // TC requires PH to have a non empty EX, and uses the text node to show the "original" value.
            new Tag(_PLACEHOLDER_TAG$3, { name: ph.name }, [exTag, interpolationAsText])
        ];
    }
    visitIcuPlaceholder(ph, context) {
        const icuExpression = ph.value.expression;
        const icuType = ph.value.type;
        const icuCases = Object.keys(ph.value.cases).map((value) => value + ' {...}').join(' ');
        const icuAsText = new Text$1(`{${icuExpression}, ${icuType}, ${icuCases}}`);
        const exTag = new Tag(_EXAMPLE_TAG, {}, [icuAsText]);
        return [
            // TC requires PH to have a non empty EX, and uses the text node to show the "original" value.
            new Tag(_PLACEHOLDER_TAG$3, { name: ph.name }, [exTag, icuAsText])
        ];
    }
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
function digest(message) {
    return decimalDigest(message);
}
// TC requires at least one non-empty example on placeholders
class ExampleVisitor {
    addDefaultExamples(node) {
        node.visit(this);
        return node;
    }
    visitTag(tag) {
        if (tag.name === _PLACEHOLDER_TAG$3) {
            if (!tag.children || tag.children.length == 0) {
                const exText = new Text$1(tag.attrs['name'] || '...');
                tag.children = [new Tag(_EXAMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(node => node.visit(this));
        }
    }
    visitText(text) { }
    visitDeclaration(decl) { }
    visitDoctype(doctype) { }
}
// XMB/XTB placeholders can only contain A-Z, 0-9 and _
function toPublicName(internalName) {
    return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/* Closure variables holding messages must be named `MSG_[A-Z0-9]+` */
const CLOSURE_TRANSLATION_VAR_PREFIX = 'MSG_';
/**
 * Prefix for non-`goog.getMsg` i18n-related vars.
 * Note: the prefix uses lowercase characters intentionally due to a Closure behavior that
 * considers variables like `I18N_0` as constants and throws an error when their value changes.
 */
const TRANSLATION_VAR_PREFIX = 'i18n_';
/** Name of the i18n attributes **/
const I18N_ATTR = 'i18n';
const I18N_ATTR_PREFIX = 'i18n-';
/** Prefix of var expressions used in ICUs */
const I18N_ICU_VAR_PREFIX = 'VAR_';
/** Prefix of ICU expressions for post processing */
const I18N_ICU_MAPPING_PREFIX = 'I18N_EXP_';
/** Placeholder wrapper for i18n expressions **/
const I18N_PLACEHOLDER_SYMBOL = '�';
function isI18nAttribute(name) {
    return name === I18N_ATTR || name.startsWith(I18N_ATTR_PREFIX);
}
function isI18nRootNode(meta) {
    return meta instanceof Message;
}
function isSingleI18nIcu(meta) {
    return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof Icu;
}
function hasI18nMeta(node) {
    return !!node.i18n;
}
function hasI18nAttrs(element) {
    return element.attrs.some((attr) => isI18nAttribute(attr.name));
}
function icuFromI18nMessage(message) {
    return message.nodes[0];
}
function wrapI18nPlaceholder(content, contextId = 0) {
    const blockId = contextId > 0 ? `:${contextId}` : '';
    return `${I18N_PLACEHOLDER_SYMBOL}${content}${blockId}${I18N_PLACEHOLDER_SYMBOL}`;
}
function assembleI18nBoundString(strings, bindingStartIndex = 0, contextId = 0) {
    if (!strings.length)
        return '';
    let acc = '';
    const lastIdx = strings.length - 1;
    for (let i = 0; i < lastIdx; i++) {
        acc += `${strings[i]}${wrapI18nPlaceholder(bindingStartIndex + i, contextId)}`;
    }
    acc += strings[lastIdx];
    return acc;
}
function getSeqNumberGenerator(startsAt = 0) {
    let current = startsAt;
    return () => current++;
}
function placeholdersToParams(placeholders) {
    const params = {};
    placeholders.forEach((values, key) => {
        params[key] = literal(values.length > 1 ? `[${values.join('|')}]` : values[0]);
    });
    return params;
}
function updatePlaceholderMap(map, name, ...values) {
    const current = map.get(name) || [];
    current.push(...values);
    map.set(name, current);
}
function assembleBoundTextPlaceholders(meta, bindingStartIndex = 0, contextId = 0) {
    const startIdx = bindingStartIndex;
    const placeholders = new Map();
    const node = meta instanceof Message ? meta.nodes.find(node => node instanceof Container) : meta;
    if (node) {
        node
            .children
            .filter((child) => child instanceof Placeholder)
            .forEach((child, idx) => {
            const content = wrapI18nPlaceholder(startIdx + idx, contextId);
            updatePlaceholderMap(placeholders, child.name, content);
        });
    }
    return placeholders;
}
/**
 * Format the placeholder names in a map of placeholders to expressions.
 *
 * The placeholder names are converted from "internal" format (e.g. `START_TAG_DIV_1`) to "external"
 * format (e.g. `startTagDiv_1`).
 *
 * @param params A map of placeholder names to expressions.
 * @param useCamelCase whether to camelCase the placeholder name when formatting.
 * @returns A new map of formatted placeholder names to expressions.
 */
function i18nFormatPlaceholderNames(params = {}, useCamelCase) {
    const _params = {};
    if (params && Object.keys(params).length) {
        Object.keys(params).forEach(key => _params[formatI18nPlaceholderName(key, useCamelCase)] = params[key]);
    }
    return _params;
}
/**
 * Converts internal placeholder names to public-facing format
 * (for example to use in goog.getMsg call).
 * Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.
 *
 * @param name The placeholder name that should be formatted
 * @returns Formatted placeholder name
 */
function formatI18nPlaceholderName(name, useCamelCase = true) {
    const publicName = toPublicName(name);
    if (!useCamelCase) {
        return publicName;
    }
    const chunks = publicName.split('_');
    if (chunks.length === 1) {
        // if no "_" found - just lowercase the value
        return name.toLowerCase();
    }
    let postfix;
    // eject last element if it's a number
    if (/^\d+$/.test(chunks[chunks.length - 1])) {
        postfix = chunks.pop();
    }
    let raw = chunks.shift().toLowerCase();
    if (chunks.length) {
        raw += chunks.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join('');
    }
    return postfix ? `${raw}_${postfix}` : raw;
}
/**
 * Generates a prefix for translation const name.
 *
 * @param extra Additional local prefix that should be injected into translation var name
 * @returns Complete translation const prefix
 */
function getTranslationConstPrefix(extra) {
    return `${CLOSURE_TRANSLATION_VAR_PREFIX}${extra}`.toUpperCase();
}
/**
 * Generate AST to declare a variable. E.g. `var I18N_1;`.
 * @param variable the name of the variable to declare.
 */
function declareI18nVariable(variable) {
    return new DeclareVarStmt(variable.name, undefined, INFERRED_TYPE, undefined, variable.sourceSpan);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Checks whether an object key contains potentially unsafe chars, thus the key should be wrapped in
 * quotes. Note: we do not wrap all keys into quotes, as it may have impact on minification and may
 * bot work in some cases when object keys are mangled by minifier.
 *
 * TODO(FW-1136): this is a temporary solution, we need to come up with a better way of working with
 * inputs that contain potentially unsafe chars.
 */
const UNSAFE_OBJECT_KEY_NAME_REGEXP = /[-.]/;
/** Name of the temporary to use during data binding */
const TEMPORARY_NAME = '_t';
/** Name of the context parameter passed into a template function */
const CONTEXT_NAME = 'ctx';
/** Name of the RenderFlag passed into a template function */
const RENDER_FLAGS = 'rf';
/** The prefix reference variables */
const REFERENCE_PREFIX = '_r';
/** The name of the implicit context reference */
const IMPLICIT_REFERENCE = '$implicit';
/** Non bindable attribute name **/
const NON_BINDABLE_ATTR = 'ngNonBindable';
/** Name for the variable keeping track of the context returned by `ɵɵrestoreView`. */
const RESTORED_VIEW_CONTEXT_NAME = 'restoredCtx';
/**
 * Maximum length of a single instruction chain. Because our output AST uses recursion, we're
 * limited in how many expressions we can nest before we reach the call stack limit. This
 * length is set very conservatively in order to reduce the chance of problems.
 */
const MAX_CHAIN_LENGTH = 500;
/** Instructions that support chaining. */
const CHAINABLE_INSTRUCTIONS = new Set([
    Identifiers.element,
    Identifiers.elementStart,
    Identifiers.elementEnd,
    Identifiers.elementContainer,
    Identifiers.elementContainerStart,
    Identifiers.elementContainerEnd,
    Identifiers.i18nExp,
    Identifiers.listener,
    Identifiers.classProp,
    Identifiers.syntheticHostListener,
    Identifiers.hostProperty,
    Identifiers.syntheticHostProperty,
    Identifiers.property,
    Identifiers.propertyInterpolate1,
    Identifiers.propertyInterpolate2,
    Identifiers.propertyInterpolate3,
    Identifiers.propertyInterpolate4,
    Identifiers.propertyInterpolate5,
    Identifiers.propertyInterpolate6,
    Identifiers.propertyInterpolate7,
    Identifiers.propertyInterpolate8,
    Identifiers.propertyInterpolateV,
    Identifiers.attribute,
    Identifiers.attributeInterpolate1,
    Identifiers.attributeInterpolate2,
    Identifiers.attributeInterpolate3,
    Identifiers.attributeInterpolate4,
    Identifiers.attributeInterpolate5,
    Identifiers.attributeInterpolate6,
    Identifiers.attributeInterpolate7,
    Identifiers.attributeInterpolate8,
    Identifiers.attributeInterpolateV,
    Identifiers.styleProp,
    Identifiers.stylePropInterpolate1,
    Identifiers.stylePropInterpolate2,
    Identifiers.stylePropInterpolate3,
    Identifiers.stylePropInterpolate4,
    Identifiers.stylePropInterpolate5,
    Identifiers.stylePropInterpolate6,
    Identifiers.stylePropInterpolate7,
    Identifiers.stylePropInterpolate8,
    Identifiers.stylePropInterpolateV,
    Identifiers.textInterpolate,
    Identifiers.textInterpolate1,
    Identifiers.textInterpolate2,
    Identifiers.textInterpolate3,
    Identifiers.textInterpolate4,
    Identifiers.textInterpolate5,
    Identifiers.textInterpolate6,
    Identifiers.textInterpolate7,
    Identifiers.textInterpolate8,
    Identifiers.textInterpolateV,
]);
/** Generates a call to a single instruction. */
function invokeInstruction(span, reference, params) {
    return importExpr(reference, null, span).callFn(params, span);
}
/**
 * Creates an allocator for a temporary variable.
 *
 * A variable declaration is added to the statements the first time the allocator is invoked.
 */
function temporaryAllocator(statements, name) {
    let temp = null;
    return () => {
        if (!temp) {
            statements.push(new DeclareVarStmt(TEMPORARY_NAME, undefined, DYNAMIC_TYPE));
            temp = variable(name);
        }
        return temp;
    };
}
function invalid(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}
function asLiteral(value) {
    if (Array.isArray(value)) {
        return literalArr(value.map(asLiteral));
    }
    return literal(value, INFERRED_TYPE);
}
function conditionallyCreateMapObjectLiteral(keys, keepDeclared) {
    if (Object.getOwnPropertyNames(keys).length > 0) {
        return mapToExpression(keys, keepDeclared);
    }
    return null;
}
function mapToExpression(map, keepDeclared) {
    return literalMap(Object.getOwnPropertyNames(map).map(key => {
        // canonical syntax: `dirProp: publicProp`
        // if there is no `:`, use dirProp = elProp
        const value = map[key];
        let declaredName;
        let publicName;
        let minifiedName;
        let needsDeclaredName;
        if (Array.isArray(value)) {
            [publicName, declaredName] = value;
            minifiedName = key;
            needsDeclaredName = publicName !== declaredName;
        }
        else {
            [declaredName, publicName] = splitAtColon(key, [key, value]);
            minifiedName = declaredName;
            // Only include the declared name if extracted from the key, i.e. the key contains a colon.
            // Otherwise the declared name should be omitted even if it is different from the public name,
            // as it may have already been minified.
            needsDeclaredName = publicName !== declaredName && key.includes(':');
        }
        return {
            key: minifiedName,
            // put quotes around keys that contain potentially unsafe characters
            quoted: UNSAFE_OBJECT_KEY_NAME_REGEXP.test(minifiedName),
            value: (keepDeclared && needsDeclaredName) ?
                literalArr([asLiteral(publicName), asLiteral(declaredName)]) :
                asLiteral(publicName)
        };
    }));
}
/**
 *  Remove trailing null nodes as they are implied.
 */
function trimTrailingNulls(parameters) {
    while (isNull(parameters[parameters.length - 1])) {
        parameters.pop();
    }
    return parameters;
}
function getQueryPredicate(query, constantPool) {
    if (Array.isArray(query.predicate)) {
        let predicate = [];
        query.predicate.forEach((selector) => {
            // Each item in predicates array may contain strings with comma-separated refs
            // (for ex. 'ref, ref1, ..., refN'), thus we extract individual refs and store them
            // as separate array entities
            const selectors = selector.split(',').map(token => literal(token.trim()));
            predicate.push(...selectors);
        });
        return constantPool.getConstLiteral(literalArr(predicate), true);
    }
    else {
        // The original predicate may have been wrapped in a `forwardRef()` call.
        switch (query.predicate.forwardRef) {
            case 0 /* None */:
            case 2 /* Unwrapped */:
                return query.predicate.expression;
            case 1 /* Wrapped */:
                return importExpr(Identifiers.resolveForwardRef).callFn([query.predicate.expression]);
        }
    }
}
/**
 * A representation for an object literal used during codegen of definition objects. The generic
 * type `T` allows to reference a documented type of the generated structure, such that the
 * property names that are set can be resolved to their documented declaration.
 */
class DefinitionMap {
    constructor() {
        this.values = [];
    }
    set(key, value) {
        if (value) {
            this.values.push({ key: key, value, quoted: false });
        }
    }
    toLiteralMap() {
        return literalMap(this.values);
    }
}
/**
 * Extract a map of properties to values for a given element or template node, which can be used
 * by the directive matching machinery.
 *
 * @param elOrTpl the element or template in question
 * @return an object set up for directive matching. For attributes on the element/template, this
 * object maps a property name to its (static) value. For any bindings, this map simply maps the
 * property name to an empty string.
 */
function getAttrsForDirectiveMatching(elOrTpl) {
    const attributesMap = {};
    if (elOrTpl instanceof Template && elOrTpl.tagName !== 'ng-template') {
        elOrTpl.templateAttrs.forEach(a => attributesMap[a.name] = '');
    }
    else {
        elOrTpl.attributes.forEach(a => {
            if (!isI18nAttribute(a.name)) {
                attributesMap[a.name] = a.value;
            }
        });
        elOrTpl.inputs.forEach(i => {
            attributesMap[i.name] = '';
        });
        elOrTpl.outputs.forEach(o => {
            attributesMap[o.name] = '';
        });
    }
    return attributesMap;
}
/**
 * Gets the number of arguments expected to be passed to a generated instruction in the case of
 * interpolation instructions.
 * @param interpolation An interpolation ast
 */
function getInterpolationArgsLength(interpolation) {
    const { expressions, strings } = interpolation;
    if (expressions.length === 1 && strings.length === 2 && strings[0] === '' && strings[1] === '') {
        // If the interpolation has one interpolated value, but the prefix and suffix are both empty
        // strings, we only pass one argument, to a special instruction like `propertyInterpolate` or
        // `textInterpolate`.
        return 1;
    }
    else {
        return expressions.length + strings.length;
    }
}
/**
 * Generates the final instruction call statements based on the passed in configuration.
 * Will try to chain instructions as much as possible, if chaining is supported.
 */
function getInstructionStatements(instructions) {
    const statements = [];
    let pendingExpression = null;
    let pendingExpressionType = null;
    let chainLength = 0;
    for (const current of instructions) {
        const resolvedParams = (typeof current.paramsOrFn === 'function' ? current.paramsOrFn() : current.paramsOrFn) ??
            [];
        const params = Array.isArray(resolvedParams) ? resolvedParams : [resolvedParams];
        // If the current instruction is the same as the previous one
        // and it can be chained, add another call to the chain.
        if (chainLength < MAX_CHAIN_LENGTH && pendingExpressionType === current.reference &&
            CHAINABLE_INSTRUCTIONS.has(pendingExpressionType)) {
            // We'll always have a pending expression when there's a pending expression type.
            pendingExpression = pendingExpression.callFn(params, pendingExpression.sourceSpan);
            chainLength++;
        }
        else {
            if (pendingExpression !== null) {
                statements.push(pendingExpression.toStmt());
            }
            pendingExpression = invokeInstruction(current.span, current.reference, params);
            pendingExpressionType = current.reference;
            chainLength = 0;
        }
    }
    // Since the current instruction adds the previous one to the statements,
    // we may be left with the final one at the end that is still pending.
    if (pendingExpression !== null) {
        statements.push(pendingExpression.toStmt());
    }
    return statements;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function compileInjectable(meta, resolveForwardRefs) {
    let result = null;
    const factoryMeta = {
        name: meta.name,
        type: meta.type,
        internalType: meta.internalType,
        typeArgumentCount: meta.typeArgumentCount,
        deps: [],
        target: FactoryTarget$1.Injectable,
    };
    if (meta.useClass !== undefined) {
        // meta.useClass has two modes of operation. Either deps are specified, in which case `new` is
        // used to instantiate the class with dependencies injected, or deps are not specified and
        // the factory of the class is used to instantiate it.
        //
        // A special case exists for useClass: Type where Type is the injectable type itself and no
        // deps are specified, in which case 'useClass' is effectively ignored.
        const useClassOnSelf = meta.useClass.expression.isEquivalent(meta.internalType);
        let deps = undefined;
        if (meta.deps !== undefined) {
            deps = meta.deps;
        }
        if (deps !== undefined) {
            // factory: () => new meta.useClass(...deps)
            result = compileFactoryFunction({
                ...factoryMeta,
                delegate: meta.useClass.expression,
                delegateDeps: deps,
                delegateType: R3FactoryDelegateType.Class,
            });
        }
        else if (useClassOnSelf) {
            result = compileFactoryFunction(factoryMeta);
        }
        else {
            result = {
                statements: [],
                expression: delegateToFactory(meta.type.value, meta.useClass.expression, resolveForwardRefs)
            };
        }
    }
    else if (meta.useFactory !== undefined) {
        if (meta.deps !== undefined) {
            result = compileFactoryFunction({
                ...factoryMeta,
                delegate: meta.useFactory,
                delegateDeps: meta.deps || [],
                delegateType: R3FactoryDelegateType.Function,
            });
        }
        else {
            result = {
                statements: [],
                expression: fn([], [new ReturnStatement(meta.useFactory.callFn([]))])
            };
        }
    }
    else if (meta.useValue !== undefined) {
        // Note: it's safe to use `meta.useValue` instead of the `USE_VALUE in meta` check used for
        // client code because meta.useValue is an Expression which will be defined even if the actual
        // value is undefined.
        result = compileFactoryFunction({
            ...factoryMeta,
            expression: meta.useValue.expression,
        });
    }
    else if (meta.useExisting !== undefined) {
        // useExisting is an `inject` call on the existing token.
        result = compileFactoryFunction({
            ...factoryMeta,
            expression: importExpr(Identifiers.inject).callFn([meta.useExisting.expression]),
        });
    }
    else {
        result = {
            statements: [],
            expression: delegateToFactory(meta.type.value, meta.internalType, resolveForwardRefs)
        };
    }
    const token = meta.internalType;
    const injectableProps = new DefinitionMap();
    injectableProps.set('token', token);
    injectableProps.set('factory', result.expression);
    // Only generate providedIn property if it has a non-null value
    if (meta.providedIn.expression.value !== null) {
        injectableProps.set('providedIn', convertFromMaybeForwardRefExpression(meta.providedIn));
    }
    const expression = importExpr(Identifiers.ɵɵdefineInjectable)
        .callFn([injectableProps.toLiteralMap()], undefined, true);
    return {
        expression,
        type: createInjectableType(meta),
        statements: result.statements,
    };
}
function createInjectableType(meta) {
    return new ExpressionType(importExpr(Identifiers.InjectableDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount)]));
}
function delegateToFactory(type, internalType, unwrapForwardRefs) {
    if (type.node === internalType.node) {
        // The types are the same, so we can simply delegate directly to the type's factory.
        // ```
        // factory: type.ɵfac
        // ```
        return internalType.prop('ɵfac');
    }
    if (!unwrapForwardRefs) {
        // The type is not wrapped in a `forwardRef()`, so we create a simple factory function that
        // accepts a sub-type as an argument.
        // ```
        // factory: function(t) { return internalType.ɵfac(t); }
        // ```
        return createFactoryFunction(internalType);
    }
    // The internalType is actually wrapped in a `forwardRef()` so we need to resolve that before
    // calling its factory.
    // ```
    // factory: function(t) { return core.resolveForwardRef(type).ɵfac(t); }
    // ```
    const unwrappedType = importExpr(Identifiers.resolveForwardRef).callFn([internalType]);
    return createFactoryFunction(unwrappedType);
}
function createFactoryFunction(type) {
    return fn([new FnParam('t', DYNAMIC_TYPE)], [new ReturnStatement(type.prop('ɵfac').callFn([variable('t')]))]);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const UNUSABLE_INTERPOLATION_REGEXPS = [
    /^\s*$/,
    /[<>]/,
    /^[{}]$/,
    /&(#|[a-z])/i,
    /^\/\//, // comment
];
function assertInterpolationSymbols(identifier, value) {
    if (value != null && !(Array.isArray(value) && value.length == 2)) {
        throw new Error(`Expected '${identifier}' to be an array, [start, end].`);
    }
    else if (value != null) {
        const start = value[0];
        const end = value[1];
        // Check for unusable interpolation symbols
        UNUSABLE_INTERPOLATION_REGEXPS.forEach(regexp => {
            if (regexp.test(start) || regexp.test(end)) {
                throw new Error(`['${start}', '${end}'] contains unusable interpolation symbol.`);
            }
        });
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class InterpolationConfig {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    static fromArray(markers) {
        if (!markers) {
            return DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    }
}
const DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const $EOF = 0;
const $BSPACE = 8;
const $TAB = 9;
const $LF = 10;
const $VTAB = 11;
const $FF = 12;
const $CR = 13;
const $SPACE = 32;
const $BANG = 33;
const $DQ = 34;
const $HASH = 35;
const $$ = 36;
const $PERCENT = 37;
const $AMPERSAND = 38;
const $SQ = 39;
const $LPAREN = 40;
const $RPAREN = 41;
const $STAR = 42;
const $PLUS = 43;
const $COMMA = 44;
const $MINUS = 45;
const $PERIOD = 46;
const $SLASH = 47;
const $COLON = 58;
const $SEMICOLON = 59;
const $LT = 60;
const $EQ = 61;
const $GT = 62;
const $QUESTION = 63;
const $0 = 48;
const $7 = 55;
const $9 = 57;
const $A = 65;
const $E = 69;
const $F = 70;
const $X = 88;
const $Z = 90;
const $LBRACKET = 91;
const $BACKSLASH = 92;
const $RBRACKET = 93;
const $CARET = 94;
const $_ = 95;
const $a = 97;
const $b = 98;
const $e = 101;
const $f = 102;
const $n = 110;
const $r = 114;
const $t = 116;
const $u = 117;
const $v = 118;
const $x = 120;
const $z = 122;
const $LBRACE = 123;
const $BAR = 124;
const $RBRACE = 125;
const $NBSP = 160;
const $PIPE = 124;
const $TILDA = 126;
const $AT = 64;
const $BT = 96;
function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
function isDigit(code) {
    return $0 <= code && code <= $9;
}
function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
function isNewLine(code) {
    return code === $LF || code === $CR;
}
function isOctalDigit(code) {
    return $0 <= code && code <= $7;
}
function isQuote(code) {
    return code === $SQ || code === $DQ || code === $BT;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ParseLocation {
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
    }
    moveBy(delta) {
        const source = this.file.content;
        const len = source.length;
        let offset = this.offset;
        let line = this.line;
        let col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            const ch = source.charCodeAt(offset);
            if (ch == $LF) {
                line--;
                const priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            const ch = source.charCodeAt(offset);
            offset++;
            delta--;
            if (ch == $LF) {
                line++;
                col = 0;
            }
            else {
                col++;
            }
        }
        return new ParseLocation(this.file, offset, line, col);
    }
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    getContext(maxChars, maxLines) {
        const content = this.file.content;
        let startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            let endOffset = startOffset;
            let ctxChars = 0;
            let ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1),
            };
        }
        return null;
    }
}
class ParseSourceFile {
    constructor(content, url) {
        this.content = content;
        this.url = url;
    }
}
class ParseSourceSpan {
    /**
     * Create an object that holds information about spans of tokens/nodes captured during
     * lexing/parsing of text.
     *
     * @param start
     * The location of the start of the span (having skipped leading trivia).
     * Skipping leading trivia makes source-spans more "user friendly", since things like HTML
     * elements will appear to begin at the start of the opening tag, rather than at the start of any
     * leading trivia, which could include newlines.
     *
     * @param end
     * The location of the end of the span.
     *
     * @param fullStart
     * The start of the token without skipping the leading trivia.
     * This is used by tooling that splits tokens further, such as extracting Angular interpolations
     * from text tokens. Such tooling creates new source-spans relative to the original token's
     * source-span. If leading trivia characters have been skipped then the new source-spans may be
     * incorrectly offset.
     *
     * @param details
     * Additional information (such as identifier names) that should be associated with the span.
     */
    constructor(start, end, fullStart = start, details = null) {
        this.start = start;
        this.end = end;
        this.fullStart = fullStart;
        this.details = details;
    }
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
var ParseErrorLevel;
(function (ParseErrorLevel) {
    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel || (ParseErrorLevel = {}));
class ParseError {
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    contextualMessage() {
        const ctx = this.span.start.getContext(100, 3);
        return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` :
            this.msg;
    }
    toString() {
        const details = this.span.details ? `, ${this.span.details}` : '';
        return `${this.contextualMessage()}: ${this.span.start}${details}`;
    }
}
/**
 * Generates Source Span object for a given R3 Type for JIT mode.
 *
 * @param kind Component or Directive.
 * @param typeName name of the Component or Directive.
 * @param sourceUrl reference to Component or Directive source.
 * @returns instance of ParseSourceSpan that represent a given Component or Directive.
 */
function r3JitTypeSourceSpan(kind, typeName, sourceUrl) {
    const sourceFileName = `in ${kind} ${typeName} in ${sourceUrl}`;
    const sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
let _anonymousTypeIndex = 0;
function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    const ref = compileIdentifier.reference;
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    if (ref['__forward_ref__']) {
        // We do not want to try to stringify a `forwardRef()` function because that would cause the
        // inner function to be evaluated too early, defeating the whole point of the `forwardRef`.
        return '__forward_ref__';
    }
    let identifier = stringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = `anonymous_${_anonymousTypeIndex++}`;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = sanitizeIdentifier(identifier);
    }
    return identifier;
}
function sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * In TypeScript, tagged template functions expect a "template object", which is an array of
 * "cooked" strings plus a `raw` property that contains an array of "raw" strings. This is
 * typically constructed with a function called `__makeTemplateObject(cooked, raw)`, but it may not
 * be available in all environments.
 *
 * This is a JavaScript polyfill that uses __makeTemplateObject when it's available, but otherwise
 * creates an inline helper with the same functionality.
 *
 * In the inline function, if `Object.defineProperty` is available we use that to attach the `raw`
 * array.
 */
const makeTemplateObjectPolyfill = '(this&&this.__makeTemplateObject||function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e})';
class AbstractJsEmitterVisitor extends AbstractEmitterVisitor {
    constructor() {
        super(false);
    }
    visitWrappedNodeExpr(ast, ctx) {
        throw new Error('Cannot emit a WrappedNodeExpr in Javascript.');
    }
    visitDeclareVarStmt(stmt, ctx) {
        ctx.print(stmt, `var ${stmt.name}`);
        if (stmt.value) {
            ctx.print(stmt, ' = ');
            stmt.value.visitExpression(this, ctx);
        }
        ctx.println(stmt, `;`);
        return null;
    }
    visitTaggedTemplateExpr(ast, ctx) {
        // The following convoluted piece of code is effectively the downlevelled equivalent of
        // ```
        // tag`...`
        // ```
        // which is effectively like:
        // ```
        // tag(__makeTemplateObject(cooked, raw), expression1, expression2, ...);
        // ```
        const elements = ast.template.elements;
        ast.tag.visitExpression(this, ctx);
        ctx.print(ast, `(${makeTemplateObjectPolyfill}(`);
        ctx.print(ast, `[${elements.map(part => escapeIdentifier(part.text, false)).join(', ')}], `);
        ctx.print(ast, `[${elements.map(part => escapeIdentifier(part.rawText, false)).join(', ')}])`);
        ast.template.expressions.forEach(expression => {
            ctx.print(ast, ', ');
            expression.visitExpression(this, ctx);
        });
        ctx.print(ast, ')');
        return null;
    }
    visitFunctionExpr(ast, ctx) {
        ctx.print(ast, `function${ast.name ? ' ' + ast.name : ''}(`);
        this._visitParams(ast.params, ctx);
        ctx.println(ast, `) {`);
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, `}`);
        return null;
    }
    visitDeclareFunctionStmt(stmt, ctx) {
        ctx.print(stmt, `function ${stmt.name}(`);
        this._visitParams(stmt.params, ctx);
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    visitLocalizedString(ast, ctx) {
        // The following convoluted piece of code is effectively the downlevelled equivalent of
        // ```
        // $localize `...`
        // ```
        // which is effectively like:
        // ```
        // $localize(__makeTemplateObject(cooked, raw), expression1, expression2, ...);
        // ```
        ctx.print(ast, `$localize(${makeTemplateObjectPolyfill}(`);
        const parts = [ast.serializeI18nHead()];
        for (let i = 1; i < ast.messageParts.length; i++) {
            parts.push(ast.serializeI18nTemplatePart(i));
        }
        ctx.print(ast, `[${parts.map(part => escapeIdentifier(part.cooked, false)).join(', ')}], `);
        ctx.print(ast, `[${parts.map(part => escapeIdentifier(part.raw, false)).join(', ')}])`);
        ast.expressions.forEach(expression => {
            ctx.print(ast, ', ');
            expression.visitExpression(this, ctx);
        });
        ctx.print(ast, ')');
        return null;
    }
    _visitParams(params, ctx) {
        this.visitAllObjects(param => ctx.print(null, param.name), params, ctx, ',');
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The Trusted Types policy, or null if Trusted Types are not
 * enabled/supported, or undefined if the policy has not been created yet.
 */
let policy;
/**
 * Returns the Trusted Types policy, or null if Trusted Types are not
 * enabled/supported. The first call to this function will create the policy.
 */
function getPolicy() {
    if (policy === undefined) {
        policy = null;
        if (_global.trustedTypes) {
            try {
                policy =
                    _global.trustedTypes.createPolicy('angular#unsafe-jit', {
                        createScript: (s) => s,
                    });
            }
            catch {
                // trustedTypes.createPolicy throws if called with a name that is
                // already registered, even in report-only mode. Until the API changes,
                // catch the error not to break the applications functionally. In such
                // cases, the code will fall back to using strings.
            }
        }
    }
    return policy;
}
/**
 * Unsafely promote a string to a TrustedScript, falling back to strings when
 * Trusted Types are not available.
 * @security In particular, it must be assured that the provided string will
 * never cause an XSS vulnerability if used in a context that will be
 * interpreted and executed as a script by a browser, e.g. when calling eval.
 */
function trustedScriptFromString(script) {
    return getPolicy()?.createScript(script) || script;
}
/**
 * Unsafely call the Function constructor with the given string arguments.
 * @security This is a security-sensitive function; any use of this function
 * must go through security review. In particular, it must be assured that it
 * is only called from the JIT compiler, as use in other code can lead to XSS
 * vulnerabilities.
 */
function newTrustedFunctionForJIT(...args) {
    if (!_global.trustedTypes) {
        // In environments that don't support Trusted Types, fall back to the most
        // straightforward implementation:
        return new Function(...args);
    }
    // Chrome currently does not support passing TrustedScript to the Function
    // constructor. The following implements the workaround proposed on the page
    // below, where the Chromium bug is also referenced:
    // https://github.com/w3c/webappsec-trusted-types/wiki/Trusted-Types-for-function-constructor
    const fnArgs = args.slice(0, -1).join(',');
    const fnBody = args[args.length - 1];
    const body = `(function anonymous(${fnArgs}
) { ${fnBody}
})`;
    // Using eval directly confuses the compiler and prevents this module from
    // being stripped out of JS binaries even if not used. The global['eval']
    // indirection fixes that.
    const fn = _global['eval'](trustedScriptFromString(body));
    if (fn.bind === undefined) {
        // Workaround for a browser bug that only exists in Chrome 83, where passing
        // a TrustedScript to eval just returns the TrustedScript back without
        // evaluating it. In that case, fall back to the most straightforward
        // implementation:
        return new Function(...args);
    }
    // To completely mimic the behavior of calling "new Function", two more
    // things need to happen:
    // 1. Stringifying the resulting function should return its source code
    fn.toString = () => body;
    // 2. When calling the resulting function, `this` should refer to `global`
    return fn.bind(_global);
    // When Trusted Types support in Function constructors is widely available,
    // the implementation of this function can be simplified to:
    // return new Function(...args.map(a => trustedScriptFromString(a)));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A helper class to manage the evaluation of JIT generated code.
 */
class JitEvaluator {
    /**
     *
     * @param sourceUrl The URL of the generated code.
     * @param statements An array of Angular statement AST nodes to be evaluated.
     * @param refResolver Resolves `o.ExternalReference`s into values.
     * @param createSourceMaps If true then create a source-map for the generated code and include it
     * inline as a source-map comment.
     * @returns A map of all the variables in the generated code.
     */
    evaluateStatements(sourceUrl, statements, refResolver, createSourceMaps) {
        const converter = new JitEmitterVisitor(refResolver);
        const ctx = EmitterVisitorContext.createRoot();
        // Ensure generated code is in strict mode
        if (statements.length > 0 && !isUseStrictStatement(statements[0])) {
            statements = [
                literal('use strict').toStmt(),
                ...statements,
            ];
        }
        converter.visitAllStatements(statements, ctx);
        converter.createReturnStmt(ctx);
        return this.evaluateCode(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
    }
    /**
     * Evaluate a piece of JIT generated code.
     * @param sourceUrl The URL of this generated code.
     * @param ctx A context object that contains an AST of the code to be evaluated.
     * @param vars A map containing the names and values of variables that the evaluated code might
     * reference.
     * @param createSourceMap If true then create a source-map for the generated code and include it
     * inline as a source-map comment.
     * @returns The result of evaluating the code.
     */
    evaluateCode(sourceUrl, ctx, vars, createSourceMap) {
        let fnBody = `"use strict";${ctx.toSource()}\n//# sourceURL=${sourceUrl}`;
        const fnArgNames = [];
        const fnArgValues = [];
        for (const argName in vars) {
            fnArgValues.push(vars[argName]);
            fnArgNames.push(argName);
        }
        if (createSourceMap) {
            // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
            // E.g. ```
            // function anonymous(a,b,c
            // /**/) { ... }```
            // We don't want to hard code this fact, so we auto detect it via an empty function first.
            const emptyFn = newTrustedFunctionForJIT(...fnArgNames.concat('return null;')).toString();
            const headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
            fnBody += `\n${ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment()}`;
        }
        const fn = newTrustedFunctionForJIT(...fnArgNames.concat(fnBody));
        return this.executeFunction(fn, fnArgValues);
    }
    /**
     * Execute a JIT generated function by calling it.
     *
     * This method can be overridden in tests to capture the functions that are generated
     * by this `JitEvaluator` class.
     *
     * @param fn A function to execute.
     * @param args The arguments to pass to the function being executed.
     * @returns The return value of the executed function.
     */
    executeFunction(fn, args) {
        return fn(...args);
    }
}
/**
 * An Angular AST visitor that converts AST nodes into executable JavaScript code.
 */
class JitEmitterVisitor extends AbstractJsEmitterVisitor {
    constructor(refResolver) {
        super();
        this.refResolver = refResolver;
        this._evalArgNames = [];
        this._evalArgValues = [];
        this._evalExportedVars = [];
    }
    createReturnStmt(ctx) {
        const stmt = new ReturnStatement(new LiteralMapExpr(this._evalExportedVars.map(resultVar => new LiteralMapEntry(resultVar, variable(resultVar), false))));
        stmt.visitStatement(this, ctx);
    }
    getArgs() {
        const result = {};
        for (let i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    }
    visitExternalExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, this.refResolver.resolveExternalReference(ast.value), ctx);
        return null;
    }
    visitWrappedNodeExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, ast.node, ctx);
        return null;
    }
    visitDeclareVarStmt(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareVarStmt(stmt, ctx);
    }
    visitDeclareFunctionStmt(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareFunctionStmt(stmt, ctx);
    }
    _emitReferenceToExternal(ast, value, ctx) {
        let id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            const name = identifierName({ reference: value }) || 'val';
            this._evalArgNames.push(`jit_${name}_${id}`);
        }
        ctx.print(ast, this._evalArgNames[id]);
    }
}
function isUseStrictStatement(statement) {
    return statement.isEquivalent(literal('use strict').toStmt());
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function compileInjector(meta) {
    const definitionMap = new DefinitionMap();
    if (meta.providers !== null) {
        definitionMap.set('providers', meta.providers);
    }
    if (meta.imports.length > 0) {
        definitionMap.set('imports', literalArr(meta.imports));
    }
    const expression = importExpr(Identifiers.defineInjector).callFn([definitionMap.toLiteralMap()], undefined, true);
    const type = createInjectorType(meta);
    return { expression, type, statements: [] };
}
function createInjectorType(meta) {
    return new ExpressionType(importExpr(Identifiers.InjectorDeclaration, [new ExpressionType(meta.type.type)]));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Implementation of `CompileReflector` which resolves references to @angular/core
 * symbols at runtime, according to a consumer-provided mapping.
 *
 * Only supports `resolveExternalReference`, all other methods throw.
 */
class R3JitReflector {
    constructor(context) {
        this.context = context;
    }
    resolveExternalReference(ref) {
        // This reflector only handles @angular/core imports.
        if (ref.moduleName !== '@angular/core') {
            throw new Error(`Cannot resolve external reference to ${ref.moduleName}, only references to @angular/core are supported.`);
        }
        if (!this.context.hasOwnProperty(ref.name)) {
            throw new Error(`No value provided for @angular/core symbol '${ref.name}'.`);
        }
        return this.context[ref.name];
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 */
function compileNgModule(meta) {
    const { internalType, bootstrap, declarations, imports, exports, schemas, containsForwardDecls, emitInline, id } = meta;
    const statements = [];
    const definitionMap = new DefinitionMap();
    definitionMap.set('type', internalType);
    if (bootstrap.length > 0) {
        definitionMap.set('bootstrap', refsToArray(bootstrap, containsForwardDecls));
    }
    // If requested to emit scope information inline, pass the `declarations`, `imports` and `exports`
    // to the `ɵɵdefineNgModule()` call. The JIT compilation uses this.
    if (emitInline) {
        if (declarations.length > 0) {
            definitionMap.set('declarations', refsToArray(declarations, containsForwardDecls));
        }
        if (imports.length > 0) {
            definitionMap.set('imports', refsToArray(imports, containsForwardDecls));
        }
        if (exports.length > 0) {
            definitionMap.set('exports', refsToArray(exports, containsForwardDecls));
        }
    }
    // If not emitting inline, the scope information is not passed into `ɵɵdefineNgModule` as it would
    // prevent tree-shaking of the declarations, imports and exports references.
    else {
        const setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
        if (setNgModuleScopeCall !== null) {
            statements.push(setNgModuleScopeCall);
        }
    }
    if (schemas !== null && schemas.length > 0) {
        definitionMap.set('schemas', literalArr(schemas.map(ref => ref.value)));
    }
    if (id !== null) {
        definitionMap.set('id', id);
    }
    const expression = importExpr(Identifiers.defineNgModule).callFn([definitionMap.toLiteralMap()], undefined, true);
    const type = createNgModuleType(meta);
    return { expression, type, statements };
}
/**
 * This function is used in JIT mode to generate the call to `ɵɵdefineNgModule()` from a call to
 * `ɵɵngDeclareNgModule()`.
 */
function compileNgModuleDeclarationExpression(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('type', new WrappedNodeExpr(meta.type));
    if (meta.bootstrap !== undefined) {
        definitionMap.set('bootstrap', new WrappedNodeExpr(meta.bootstrap));
    }
    if (meta.declarations !== undefined) {
        definitionMap.set('declarations', new WrappedNodeExpr(meta.declarations));
    }
    if (meta.imports !== undefined) {
        definitionMap.set('imports', new WrappedNodeExpr(meta.imports));
    }
    if (meta.exports !== undefined) {
        definitionMap.set('exports', new WrappedNodeExpr(meta.exports));
    }
    if (meta.schemas !== undefined) {
        definitionMap.set('schemas', new WrappedNodeExpr(meta.schemas));
    }
    if (meta.id !== undefined) {
        definitionMap.set('id', new WrappedNodeExpr(meta.id));
    }
    return importExpr(Identifiers.defineNgModule).callFn([definitionMap.toLiteralMap()]);
}
function createNgModuleType({ type: moduleType, declarations, imports, exports }) {
    return new ExpressionType(importExpr(Identifiers.NgModuleDeclaration, [
        new ExpressionType(moduleType.type), tupleTypeOf(declarations), tupleTypeOf(imports),
        tupleTypeOf(exports)
    ]));
}
/**
 * Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
 * transitive module scope can be computed during runtime in JIT mode. This call is marked pure
 * such that the references to declarations, imports and exports may be elided causing these
 * symbols to become tree-shakeable.
 */
function generateSetNgModuleScopeCall(meta) {
    const { adjacentType: moduleType, declarations, imports, exports, containsForwardDecls } = meta;
    const scopeMap = new DefinitionMap();
    if (declarations.length > 0) {
        scopeMap.set('declarations', refsToArray(declarations, containsForwardDecls));
    }
    if (imports.length > 0) {
        scopeMap.set('imports', refsToArray(imports, containsForwardDecls));
    }
    if (exports.length > 0) {
        scopeMap.set('exports', refsToArray(exports, containsForwardDecls));
    }
    if (Object.keys(scopeMap.values).length === 0) {
        return null;
    }
    // setNgModuleScope(...)
    const fnCall = new InvokeFunctionExpr(
    /* fn */ importExpr(Identifiers.setNgModuleScope), 
    /* args */ [moduleType, scopeMap.toLiteralMap()]);
    // (ngJitMode guard) && setNgModuleScope(...)
    const guardedCall = jitOnlyGuardedExpression(fnCall);
    // function() { (ngJitMode guard) && setNgModuleScope(...); }
    const iife = new FunctionExpr(
    /* params */ [], 
    /* statements */ [guardedCall.toStmt()]);
    // (function() { (ngJitMode guard) && setNgModuleScope(...); })()
    const iifeCall = new InvokeFunctionExpr(
    /* fn */ iife, 
    /* args */ []);
    return iifeCall.toStmt();
}
function tupleTypeOf(exp) {
    const types = exp.map(ref => typeofExpr(ref.type));
    return exp.length > 0 ? expressionType(literalArr(types)) : NONE_TYPE;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function compilePipeFromMetadata(metadata) {
    const definitionMapValues = [];
    // e.g. `name: 'myPipe'`
    definitionMapValues.push({ key: 'name', value: literal(metadata.pipeName), quoted: false });
    // e.g. `type: MyPipe`
    definitionMapValues.push({ key: 'type', value: metadata.type.value, quoted: false });
    // e.g. `pure: true`
    definitionMapValues.push({ key: 'pure', value: literal(metadata.pure), quoted: false });
    const expression = importExpr(Identifiers.definePipe).callFn([literalMap(definitionMapValues)], undefined, true);
    const type = createPipeType(metadata);
    return { expression, type, statements: [] };
}
function createPipeType(metadata) {
    return new ExpressionType(importExpr(Identifiers.PipeDeclaration, [
        typeWithParameters(metadata.type.type, metadata.typeArgumentCount),
        new ExpressionType(new LiteralExpr(metadata.pipeName)),
    ]));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ParserError {
    constructor(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = `Parser Error: ${message} ${errLocation} [${input}] in ${ctxLocation}`;
    }
}
class ParseSpan {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    toAbsolute(absoluteOffset) {
        return new AbsoluteSourceSpan(absoluteOffset + this.start, absoluteOffset + this.end);
    }
}
class AST {
    constructor(span, 
    /**
     * Absolute location of the expression AST in a source code file.
     */
    sourceSpan) {
        this.span = span;
        this.sourceSpan = sourceSpan;
    }
    toString() {
        return 'AST';
    }
}
class ASTWithName extends AST {
    constructor(span, sourceSpan, nameSpan) {
        super(span, sourceSpan);
        this.nameSpan = nameSpan;
    }
}
/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.
 */
class Quote extends AST {
    constructor(span, sourceSpan, prefix, uninterpretedExpression, location) {
        super(span, sourceSpan);
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    visit(visitor, context = null) {
        return visitor.visitQuote(this, context);
    }
    toString() {
        return 'Quote';
    }
}
class EmptyExpr extends AST {
    visit(visitor, context = null) {
        // do nothing
    }
}
class ImplicitReceiver extends AST {
    visit(visitor, context = null) {
        return visitor.visitImplicitReceiver(this, context);
    }
}
/**
 * Receiver when something is accessed through `this` (e.g. `this.foo`). Note that this class
 * inherits from `ImplicitReceiver`, because accessing something through `this` is treated the
 * same as accessing it implicitly inside of an Angular template (e.g. `[attr.title]="this.title"`
 * is the same as `[attr.title]="title"`.). Inheriting allows for the `this` accesses to be treated
 * the same as implicit ones, except for a couple of exceptions like `$event` and `$any`.
 * TODO: we should find a way for this class not to extend from `ImplicitReceiver` in the future.
 */
class ThisReceiver extends ImplicitReceiver {
    visit(visitor, context = null) {
        return visitor.visitThisReceiver?.(this, context);
    }
}
/**
 * Multiple expressions separated by a semicolon.
 */
class Chain extends AST {
    constructor(span, sourceSpan, expressions) {
        super(span, sourceSpan);
        this.expressions = expressions;
    }
    visit(visitor, context = null) {
        return visitor.visitChain(this, context);
    }
}
class Conditional extends AST {
    constructor(span, sourceSpan, condition, trueExp, falseExp) {
        super(span, sourceSpan);
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    visit(visitor, context = null) {
        return visitor.visitConditional(this, context);
    }
}
class PropertyRead extends ASTWithName {
    constructor(span, sourceSpan, nameSpan, receiver, name) {
        super(span, sourceSpan, nameSpan);
        this.receiver = receiver;
        this.name = name;
    }
    visit(visitor, context = null) {
        return visitor.visitPropertyRead(this, context);
    }
}
class PropertyWrite extends ASTWithName {
    constructor(span, sourceSpan, nameSpan, receiver, name, value) {
        super(span, sourceSpan, nameSpan);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    visit(visitor, context = null) {
        return visitor.visitPropertyWrite(this, context);
    }
}
class SafePropertyRead extends ASTWithName {
    constructor(span, sourceSpan, nameSpan, receiver, name) {
        super(span, sourceSpan, nameSpan);
        this.receiver = receiver;
        this.name = name;
    }
    visit(visitor, context = null) {
        return visitor.visitSafePropertyRead(this, context);
    }
}
class KeyedRead extends AST {
    constructor(span, sourceSpan, receiver, key) {
        super(span, sourceSpan);
        this.receiver = receiver;
        this.key = key;
    }
    visit(visitor, context = null) {
        return visitor.visitKeyedRead(this, context);
    }
}
class SafeKeyedRead extends AST {
    constructor(span, sourceSpan, receiver, key) {
        super(span, sourceSpan);
        this.receiver = receiver;
        this.key = key;
    }
    visit(visitor, context = null) {
        return visitor.visitSafeKeyedRead(this, context);
    }
}
class KeyedWrite extends AST {
    constructor(span, sourceSpan, receiver, key, value) {
        super(span, sourceSpan);
        this.receiver = receiver;
        this.key = key;
        this.value = value;
    }
    visit(visitor, context = null) {
        return visitor.visitKeyedWrite(this, context);
    }
}
class BindingPipe extends ASTWithName {
    constructor(span, sourceSpan, exp, name, args, nameSpan) {
        super(span, sourceSpan, nameSpan);
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    visit(visitor, context = null) {
        return visitor.visitPipe(this, context);
    }
}
class LiteralPrimitive extends AST {
    constructor(span, sourceSpan, value) {
        super(span, sourceSpan);
        this.value = value;
    }
    visit(visitor, context = null) {
        return visitor.visitLiteralPrimitive(this, context);
    }
}
class LiteralArray extends AST {
    constructor(span, sourceSpan, expressions) {
        super(span, sourceSpan);
        this.expressions = expressions;
    }
    visit(visitor, context = null) {
        return visitor.visitLiteralArray(this, context);
    }
}
class LiteralMap extends AST {
    constructor(span, sourceSpan, keys, values) {
        super(span, sourceSpan);
        this.keys = keys;
        this.values = values;
    }
    visit(visitor, context = null) {
        return visitor.visitLiteralMap(this, context);
    }
}
class Interpolation extends AST {
    constructor(span, sourceSpan, strings, expressions) {
        super(span, sourceSpan);
        this.strings = strings;
        this.expressions = expressions;
    }
    visit(visitor, context = null) {
        return visitor.visitInterpolation(this, context);
    }
}
class Binary extends AST {
    constructor(span, sourceSpan, operation, left, right) {
        super(span, sourceSpan);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    visit(visitor, context = null) {
        return visitor.visitBinary(this, context);
    }
}
/**
 * For backwards compatibility reasons, `Unary` inherits from `Binary` and mimics the binary AST
 * node that was originally used. This inheritance relation can be deleted in some future major,
 * after consumers have been given a chance to fully support Unary.
 */
class Unary extends Binary {
    /**
     * During the deprecation period this constructor is private, to avoid consumers from creating
     * a `Unary` with the fallback properties for `Binary`.
     */
    constructor(span, sourceSpan, operator, expr, binaryOp, binaryLeft, binaryRight) {
        super(span, sourceSpan, binaryOp, binaryLeft, binaryRight);
        this.operator = operator;
        this.expr = expr;
        // Redeclare the properties that are inherited from `Binary` as `never`, as consumers should not
        // depend on these fields when operating on `Unary`.
        this.left = null;
        this.right = null;
        this.operation = null;
    }
    /**
     * Creates a unary minus expression "-x", represented as `Binary` using "0 - x".
     */
    static createMinus(span, sourceSpan, expr) {
        return new Unary(span, sourceSpan, '-', expr, '-', new LiteralPrimitive(span, sourceSpan, 0), expr);
    }
    /**
     * Creates a unary plus expression "+x", represented as `Binary` using "x - 0".
     */
    static createPlus(span, sourceSpan, expr) {
        return new Unary(span, sourceSpan, '+', expr, '-', expr, new LiteralPrimitive(span, sourceSpan, 0));
    }
    visit(visitor, context = null) {
        if (visitor.visitUnary !== undefined) {
            return visitor.visitUnary(this, context);
        }
        return visitor.visitBinary(this, context);
    }
}
class PrefixNot extends AST {
    constructor(span, sourceSpan, expression) {
        super(span, sourceSpan);
        this.expression = expression;
    }
    visit(visitor, context = null) {
        return visitor.visitPrefixNot(this, context);
    }
}
class NonNullAssert extends AST {
    constructor(span, sourceSpan, expression) {
        super(span, sourceSpan);
        this.expression = expression;
    }
    visit(visitor, context = null) {
        return visitor.visitNonNullAssert(this, context);
    }
}
class Call extends AST {
    constructor(span, sourceSpan, receiver, args, argumentSpan) {
        super(span, sourceSpan);
        this.receiver = receiver;
        this.args = args;
        this.argumentSpan = argumentSpan;
    }
    visit(visitor, context = null) {
        return visitor.visitCall(this, context);
    }
}
class SafeCall extends AST {
    constructor(span, sourceSpan, receiver, args, argumentSpan) {
        super(span, sourceSpan);
        this.receiver = receiver;
        this.args = args;
        this.argumentSpan = argumentSpan;
    }
    visit(visitor, context = null) {
        return visitor.visitSafeCall(this, context);
    }
}
/**
 * Records the absolute position of a text span in a source file, where `start` and `end` are the
 * starting and ending byte offsets, respectively, of the text span in a source file.
 */
class AbsoluteSourceSpan {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
class ASTWithSource extends AST {
    constructor(ast, source, location, absoluteOffset, errors) {
        super(new ParseSpan(0, source === null ? 0 : source.length), new AbsoluteSourceSpan(absoluteOffset, source === null ? absoluteOffset : absoluteOffset + source.length));
        this.ast = ast;
        this.source = source;
        this.location = location;
        this.errors = errors;
    }
    visit(visitor, context = null) {
        if (visitor.visitASTWithSource) {
            return visitor.visitASTWithSource(this, context);
        }
        return this.ast.visit(visitor, context);
    }
    toString() {
        return `${this.source} in ${this.location}`;
    }
}
class VariableBinding {
    /**
     * @param sourceSpan entire span of the binding.
     * @param key name of the LHS along with its span.
     * @param value optional value for the RHS along with its span.
     */
    constructor(sourceSpan, key, value) {
        this.sourceSpan = sourceSpan;
        this.key = key;
        this.value = value;
    }
}
class ExpressionBinding {
    /**
     * @param sourceSpan entire span of the binding.
     * @param key binding name, like ngForOf, ngForTrackBy, ngIf, along with its
     * span. Note that the length of the span may not be the same as
     * `key.source.length`. For example,
     * 1. key.source = ngFor, key.span is for "ngFor"
     * 2. key.source = ngForOf, key.span is for "of"
     * 3. key.source = ngForTrackBy, key.span is for "trackBy"
     * @param value optional expression for the RHS.
     */
    constructor(sourceSpan, key, value) {
        this.sourceSpan = sourceSpan;
        this.key = key;
        this.value = value;
    }
}
class RecursiveAstVisitor {
    visit(ast, context) {
        // The default implementation just visits every node.
        // Classes that extend RecursiveAstVisitor should override this function
        // to selectively visit the specified node.
        ast.visit(this, context);
    }
    visitUnary(ast, context) {
        this.visit(ast.expr, context);
    }
    visitBinary(ast, context) {
        this.visit(ast.left, context);
        this.visit(ast.right, context);
    }
    visitChain(ast, context) {
        this.visitAll(ast.expressions, context);
    }
    visitConditional(ast, context) {
        this.visit(ast.condition, context);
        this.visit(ast.trueExp, context);
        this.visit(ast.falseExp, context);
    }
    visitPipe(ast, context) {
        this.visit(ast.exp, context);
        this.visitAll(ast.args, context);
    }
    visitImplicitReceiver(ast, context) { }
    visitThisReceiver(ast, context) { }
    visitInterpolation(ast, context) {
        this.visitAll(ast.expressions, context);
    }
    visitKeyedRead(ast, context) {
        this.visit(ast.receiver, context);
        this.visit(ast.key, context);
    }
    visitKeyedWrite(ast, context) {
        this.visit(ast.receiver, context);
        this.visit(ast.key, context);
        this.visit(ast.value, context);
    }
    visitLiteralArray(ast, context) {
        this.visitAll(ast.expressions, context);
    }
    visitLiteralMap(ast, context) {
        this.visitAll(ast.values, context);
    }
    visitLiteralPrimitive(ast, context) { }
    visitPrefixNot(ast, context) {
        this.visit(ast.expression, context);
    }
    visitNonNullAssert(ast, context) {
        this.visit(ast.expression, context);
    }
    visitPropertyRead(ast, context) {
        this.visit(ast.receiver, context);
    }
    visitPropertyWrite(ast, context) {
        this.visit(ast.receiver, context);
        this.visit(ast.value, context);
    }
    visitSafePropertyRead(ast, context) {
        this.visit(ast.receiver, context);
    }
    visitSafeKeyedRead(ast, context) {
        this.visit(ast.receiver, context);
        this.visit(ast.key, context);
    }
    visitCall(ast, context) {
        this.visit(ast.receiver, context);
        this.visitAll(ast.args, context);
    }
    visitSafeCall(ast, context) {
        this.visit(ast.receiver, context);
        this.visitAll(ast.args, context);
    }
    visitQuote(ast, context) { }
    // This is not part of the AstVisitor interface, just a helper method
    visitAll(asts, context) {
        for (const ast of asts) {
            this.visit(ast, context);
        }
    }
}
class AstTransformer {
    visitImplicitReceiver(ast, context) {
        return ast;
    }
    visitThisReceiver(ast, context) {
        return ast;
    }
    visitInterpolation(ast, context) {
        return new Interpolation(ast.span, ast.sourceSpan, ast.strings, this.visitAll(ast.expressions));
    }
    visitLiteralPrimitive(ast, context) {
        return new LiteralPrimitive(ast.span, ast.sourceSpan, ast.value);
    }
    visitPropertyRead(ast, context) {
        return new PropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name);
    }
    visitPropertyWrite(ast, context) {
        return new PropertyWrite(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name, ast.value.visit(this));
    }
    visitSafePropertyRead(ast, context) {
        return new SafePropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name);
    }
    visitLiteralArray(ast, context) {
        return new LiteralArray(ast.span, ast.sourceSpan, this.visitAll(ast.expressions));
    }
    visitLiteralMap(ast, context) {
        return new LiteralMap(ast.span, ast.sourceSpan, ast.keys, this.visitAll(ast.values));
    }
    visitUnary(ast, context) {
        switch (ast.operator) {
            case '+':
                return Unary.createPlus(ast.span, ast.sourceSpan, ast.expr.visit(this));
            case '-':
                return Unary.createMinus(ast.span, ast.sourceSpan, ast.expr.visit(this));
            default:
                throw new Error(`Unknown unary operator ${ast.operator}`);
        }
    }
    visitBinary(ast, context) {
        return new Binary(ast.span, ast.sourceSpan, ast.operation, ast.left.visit(this), ast.right.visit(this));
    }
    visitPrefixNot(ast, context) {
        return new PrefixNot(ast.span, ast.sourceSpan, ast.expression.visit(this));
    }
    visitNonNullAssert(ast, context) {
        return new NonNullAssert(ast.span, ast.sourceSpan, ast.expression.visit(this));
    }
    visitConditional(ast, context) {
        return new Conditional(ast.span, ast.sourceSpan, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }
    visitPipe(ast, context) {
        return new BindingPipe(ast.span, ast.sourceSpan, ast.exp.visit(this), ast.name, this.visitAll(ast.args), ast.nameSpan);
    }
    visitKeyedRead(ast, context) {
        return new KeyedRead(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this));
    }
    visitKeyedWrite(ast, context) {
        return new KeyedWrite(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this), ast.value.visit(this));
    }
    visitCall(ast, context) {
        return new Call(ast.span, ast.sourceSpan, ast.receiver.visit(this), this.visitAll(ast.args), ast.argumentSpan);
    }
    visitSafeCall(ast, context) {
        return new SafeCall(ast.span, ast.sourceSpan, ast.receiver.visit(this), this.visitAll(ast.args), ast.argumentSpan);
    }
    visitAll(asts) {
        const res = [];
        for (let i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    visitChain(ast, context) {
        return new Chain(ast.span, ast.sourceSpan, this.visitAll(ast.expressions));
    }
    visitQuote(ast, context) {
        return new Quote(ast.span, ast.sourceSpan, ast.prefix, ast.uninterpretedExpression, ast.location);
    }
    visitSafeKeyedRead(ast, context) {
        return new SafeKeyedRead(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this));
    }
}
// A transformer that only creates new nodes if the transformer makes a change or
// a change is made a child node.
class AstMemoryEfficientTransformer {
    visitImplicitReceiver(ast, context) {
        return ast;
    }
    visitThisReceiver(ast, context) {
        return ast;
    }
    visitInterpolation(ast, context) {
        const expressions = this.visitAll(ast.expressions);
        if (expressions !== ast.expressions)
            return new Interpolation(ast.span, ast.sourceSpan, ast.strings, expressions);
        return ast;
    }
    visitLiteralPrimitive(ast, context) {
        return ast;
    }
    visitPropertyRead(ast, context) {
        const receiver = ast.receiver.visit(this);
        if (receiver !== ast.receiver) {
            return new PropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name);
        }
        return ast;
    }
    visitPropertyWrite(ast, context) {
        const receiver = ast.receiver.visit(this);
        const value = ast.value.visit(this);
        if (receiver !== ast.receiver || value !== ast.value) {
            return new PropertyWrite(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name, value);
        }
        return ast;
    }
    visitSafePropertyRead(ast, context) {
        const receiver = ast.receiver.visit(this);
        if (receiver !== ast.receiver) {
            return new SafePropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name);
        }
        return ast;
    }
    visitLiteralArray(ast, context) {
        const expressions = this.visitAll(ast.expressions);
        if (expressions !== ast.expressions) {
            return new LiteralArray(ast.span, ast.sourceSpan, expressions);
        }
        return ast;
    }
    visitLiteralMap(ast, context) {
        const values = this.visitAll(ast.values);
        if (values !== ast.values) {
            return new LiteralMap(ast.span, ast.sourceSpan, ast.keys, values);
        }
        return ast;
    }
    visitUnary(ast, context) {
        const expr = ast.expr.visit(this);
        if (expr !== ast.expr) {
            switch (ast.operator) {
                case '+':
                    return Unary.createPlus(ast.span, ast.sourceSpan, expr);
                case '-':
                    return Unary.createMinus(ast.span, ast.sourceSpan, expr);
                default:
                    throw new Error(`Unknown unary operator ${ast.operator}`);
            }
        }
        return ast;
    }
    visitBinary(ast, context) {
        const left = ast.left.visit(this);
        const right = ast.right.visit(this);
        if (left !== ast.left || right !== ast.right) {
            return new Binary(ast.span, ast.sourceSpan, ast.operation, left, right);
        }
        return ast;
    }
    visitPrefixNot(ast, context) {
        const expression = ast.expression.visit(this);
        if (expression !== ast.expression) {
            return new PrefixNot(ast.span, ast.sourceSpan, expression);
        }
        return ast;
    }
    visitNonNullAssert(ast, context) {
        const expression = ast.expression.visit(this);
        if (expression !== ast.expression) {
            return new NonNullAssert(ast.span, ast.sourceSpan, expression);
        }
        return ast;
    }
    visitConditional(ast, context) {
        const condition = ast.condition.visit(this);
        const trueExp = ast.trueExp.visit(this);
        const falseExp = ast.falseExp.visit(this);
        if (condition !== ast.condition || trueExp !== ast.trueExp || falseExp !== ast.falseExp) {
            return new Conditional(ast.span, ast.sourceSpan, condition, trueExp, falseExp);
        }
        return ast;
    }
    visitPipe(ast, context) {
        const exp = ast.exp.visit(this);
        const args = this.visitAll(ast.args);
        if (exp !== ast.exp || args !== ast.args) {
            return new BindingPipe(ast.span, ast.sourceSpan, exp, ast.name, args, ast.nameSpan);
        }
        return ast;
    }
    visitKeyedRead(ast, context) {
        const obj = ast.receiver.visit(this);
        const key = ast.key.visit(this);
        if (obj !== ast.receiver || key !== ast.key) {
            return new KeyedRead(ast.span, ast.sourceSpan, obj, key);
        }
        return ast;
    }
    visitKeyedWrite(ast, context) {
        const obj = ast.receiver.visit(this);
        const key = ast.key.visit(this);
        const value = ast.value.visit(this);
        if (obj !== ast.receiver || key !== ast.key || value !== ast.value) {
            return new KeyedWrite(ast.span, ast.sourceSpan, obj, key, value);
        }
        return ast;
    }
    visitAll(asts) {
        const res = [];
        let modified = false;
        for (let i = 0; i < asts.length; ++i) {
            const original = asts[i];
            const value = original.visit(this);
            res[i] = value;
            modified = modified || value !== original;
        }
        return modified ? res : asts;
    }
    visitChain(ast, context) {
        const expressions = this.visitAll(ast.expressions);
        if (expressions !== ast.expressions) {
            return new Chain(ast.span, ast.sourceSpan, expressions);
        }
        return ast;
    }
    visitCall(ast, context) {
        const receiver = ast.receiver.visit(this);
        const args = this.visitAll(ast.args);
        if (receiver !== ast.receiver || args !== ast.args) {
            return new Call(ast.span, ast.sourceSpan, receiver, args, ast.argumentSpan);
        }
        return ast;
    }
    visitSafeCall(ast, context) {
        const receiver = ast.receiver.visit(this);
        const args = this.visitAll(ast.args);
        if (receiver !== ast.receiver || args !== ast.args) {
            return new SafeCall(ast.span, ast.sourceSpan, receiver, args, ast.argumentSpan);
        }
        return ast;
    }
    visitQuote(ast, context) {
        return ast;
    }
    visitSafeKeyedRead(ast, context) {
        const obj = ast.receiver.visit(this);
        const key = ast.key.visit(this);
        if (obj !== ast.receiver || key !== ast.key) {
            return new SafeKeyedRead(ast.span, ast.sourceSpan, obj, key);
        }
        return ast;
    }
}
// Bindings
class ParsedProperty {
    constructor(name, expression, type, sourceSpan, keySpan, valueSpan) {
        this.name = name;
        this.expression = expression;
        this.type = type;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
        this.isLiteral = this.type === ParsedPropertyType.LITERAL_ATTR;
        this.isAnimation = this.type === ParsedPropertyType.ANIMATION;
    }
}
var ParsedPropertyType;
(function (ParsedPropertyType) {
    ParsedPropertyType[ParsedPropertyType["DEFAULT"] = 0] = "DEFAULT";
    ParsedPropertyType[ParsedPropertyType["LITERAL_ATTR"] = 1] = "LITERAL_ATTR";
    ParsedPropertyType[ParsedPropertyType["ANIMATION"] = 2] = "ANIMATION";
})(ParsedPropertyType || (ParsedPropertyType = {}));
class ParsedEvent {
    // Regular events have a target
    // Animation events have a phase
    constructor(name, targetOrPhase, type, handler, sourceSpan, handlerSpan, keySpan) {
        this.name = name;
        this.targetOrPhase = targetOrPhase;
        this.type = type;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
        this.handlerSpan = handlerSpan;
        this.keySpan = keySpan;
    }
}
/**
 * ParsedVariable represents a variable declaration in a microsyntax expression.
 */
class ParsedVariable {
    constructor(name, value, sourceSpan, keySpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
    }
}
class BoundElementProperty {
    constructor(name, type, securityContext, value, unit, sourceSpan, keySpan, valueSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class EventHandlerVars {
}
EventHandlerVars.event = variable('$event');
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 */
function convertActionBinding(localResolver, implicitReceiver, action, bindingId, baseSourceSpan, implicitReceiverAccesses, globals) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver(globals);
    }
    const actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: (argCount) => {
            // Note: no caching for literal arrays in actions.
            return (args) => literalArr(args);
        },
        createLiteralMapConverter: (keys) => {
            // Note: no caching for literal maps in actions.
            return (values) => {
                const entries = keys.map((k, i) => ({
                    key: k.key,
                    value: values[i],
                    quoted: k.quoted,
                }));
                return literalMap(entries);
            };
        },
        createPipeConverter: (name) => {
            throw new Error(`Illegal State: Actions are not allowed to contain pipes. Pipe: ${name}`);
        }
    }, action);
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, /* supportsInterpolation */ false, baseSourceSpan, implicitReceiverAccesses);
    const actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    const lastIndex = actionStmts.length - 1;
    if (lastIndex >= 0) {
        const lastStatement = actionStmts[lastIndex];
        // Ensure that the value of the last expression statement is returned
        if (lastStatement instanceof ExpressionStatement) {
            actionStmts[lastIndex] = new ReturnStatement(lastStatement.expr);
        }
    }
    return actionStmts;
}
function convertPropertyBindingBuiltins(converterFactory, ast) {
    return convertBuiltins(converterFactory, ast);
}
class ConvertPropertyBindingResult {
    constructor(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
}
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 */
function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, /* supportsInterpolation */ false);
    const outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    const stmts = getStatementsFromVisitor(visitor, bindingId);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    return new ConvertPropertyBindingResult(stmts, outputExpr);
}
/**
 * Given some expression, such as a binding or interpolation expression, and a context expression to
 * look values up on, visit each facet of the given expression resolving values from the context
 * expression such that a list of arguments can be derived from the found values that can be used as
 * arguments to an external update instruction.
 *
 * @param localResolver The resolver to use to look up expressions by name appropriately
 * @param contextVariableExpression The expression representing the context variable used to create
 * the final argument expressions
 * @param expressionWithArgumentsToExtract The expression to visit to figure out what values need to
 * be resolved and what arguments list to build.
 * @param bindingId A name prefix used to create temporary variable names if they're needed for the
 * arguments generated
 * @returns An array of expressions that can be passed as arguments to instruction expressions like
 * `o.importExpr(R3.propertyInterpolate).callFn(result)`
 */
function convertUpdateArguments(localResolver, contextVariableExpression, expressionWithArgumentsToExtract, bindingId) {
    const visitor = new _AstToIrVisitor(localResolver, contextVariableExpression, bindingId, /* supportsInterpolation */ true);
    const outputExpr = visitor.visitInterpolation(expressionWithArgumentsToExtract, _Mode.Expression);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    const stmts = getStatementsFromVisitor(visitor, bindingId);
    const args = outputExpr.args;
    return { stmts, args };
}
function getStatementsFromVisitor(visitor, bindingId) {
    const stmts = [];
    for (let i = 0; i < visitor.temporaryCount; i++) {
        stmts.push(temporaryDeclaration(bindingId, i));
    }
    return stmts;
}
function convertBuiltins(converterFactory, ast) {
    const visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
function temporaryName(bindingId, temporaryNumber) {
    return `tmp_${bindingId}_${temporaryNumber}`;
}
function temporaryDeclaration(bindingId, temporaryNumber) {
    return new DeclareVarStmt(temporaryName(bindingId, temporaryNumber));
}
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
    for (let i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
var _Mode;
(function (_Mode) {
    _Mode[_Mode["Statement"] = 0] = "Statement";
    _Mode[_Mode["Expression"] = 1] = "Expression";
})(_Mode || (_Mode = {}));
function ensureStatementMode(mode, ast) {
    if (mode !== _Mode.Statement) {
        throw new Error(`Expected a statement, but saw ${ast}`);
    }
}
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error(`Expected an expression, but saw ${ast}`);
    }
}
function convertToStatementIfNeeded(mode, expr) {
    if (mode === _Mode.Statement) {
        return expr.toStmt();
    }
    else {
        return expr;
    }
}
class _BuiltinAstConverter extends AstTransformer {
    constructor(_converterFactory) {
        super();
        this._converterFactory = _converterFactory;
    }
    visitPipe(ast, context) {
        const args = [ast.exp, ...ast.args].map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    }
    visitLiteralArray(ast, context) {
        const args = ast.expressions.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    }
    visitLiteralMap(ast, context) {
        const args = ast.values.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    }
}
class _AstToIrVisitor {
    constructor(_localResolver, _implicitReceiver, bindingId, supportsInterpolation, baseSourceSpan, implicitReceiverAccesses) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this.supportsInterpolation = supportsInterpolation;
        this.baseSourceSpan = baseSourceSpan;
        this.implicitReceiverAccesses = implicitReceiverAccesses;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
        this.usesImplicitReceiver = false;
    }
    visitUnary(ast, mode) {
        let op;
        switch (ast.operator) {
            case '+':
                op = UnaryOperator.Plus;
                break;
            case '-':
                op = UnaryOperator.Minus;
                break;
            default:
                throw new Error(`Unsupported operator ${ast.operator}`);
        }
        return convertToStatementIfNeeded(mode, new UnaryOperatorExpr(op, this._visit(ast.expr, _Mode.Expression), undefined, this.convertSourceSpan(ast.span)));
    }
    visitBinary(ast, mode) {
        let op;
        switch (ast.operation) {
            case '+':
                op = BinaryOperator.Plus;
                break;
            case '-':
                op = BinaryOperator.Minus;
                break;
            case '*':
                op = BinaryOperator.Multiply;
                break;
            case '/':
                op = BinaryOperator.Divide;
                break;
            case '%':
                op = BinaryOperator.Modulo;
                break;
            case '&&':
                op = BinaryOperator.And;
                break;
            case '||':
                op = BinaryOperator.Or;
                break;
            case '==':
                op = BinaryOperator.Equals;
                break;
            case '!=':
                op = BinaryOperator.NotEquals;
                break;
            case '===':
                op = BinaryOperator.Identical;
                break;
            case '!==':
                op = BinaryOperator.NotIdentical;
                break;
            case '<':
                op = BinaryOperator.Lower;
                break;
            case '>':
                op = BinaryOperator.Bigger;
                break;
            case '<=':
                op = BinaryOperator.LowerEquals;
                break;
            case '>=':
                op = BinaryOperator.BiggerEquals;
                break;
            case '??':
                return this.convertNullishCoalesce(ast, mode);
            default:
                throw new Error(`Unsupported operation ${ast.operation}`);
        }
        return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression), undefined, this.convertSourceSpan(ast.span)));
    }
    visitChain(ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    }
    visitConditional(ast, mode) {
        const value = this._visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression), this.convertSourceSpan(ast.span)));
    }
    visitPipe(ast, mode) {
        throw new Error(`Illegal state: Pipes should have been converted into functions. Pipe: ${ast.name}`);
    }
    visitImplicitReceiver(ast, mode) {
        ensureExpressionMode(mode, ast);
        this.usesImplicitReceiver = true;
        return this._implicitReceiver;
    }
    visitThisReceiver(ast, mode) {
        return this.visitImplicitReceiver(ast, mode);
    }
    visitInterpolation(ast, mode) {
        if (!this.supportsInterpolation) {
            throw new Error('Unexpected interpolation');
        }
        ensureExpressionMode(mode, ast);
        let args = [];
        for (let i = 0; i < ast.strings.length - 1; i++) {
            args.push(literal(ast.strings[i]));
            args.push(this._visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(literal(ast.strings[ast.strings.length - 1]));
        // If we're dealing with an interpolation of 1 value with an empty prefix and suffix, reduce the
        // args returned to just the value, because we're going to pass it to a special instruction.
        const strings = ast.strings;
        if (strings.length === 2 && strings[0] === '' && strings[1] === '') {
            // Single argument interpolate instructions.
            args = [args[1]];
        }
        else if (ast.expressions.length >= 9) {
            // 9 or more arguments must be passed to the `interpolateV`-style instructions, which accept
            // an array of arguments
            args = [literalArr(args)];
        }
        return new InterpolationExpression(args);
    }
    visitKeyedRead(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this._visit(ast.receiver, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
        }
    }
    visitKeyedWrite(ast, mode) {
        const obj = this._visit(ast.receiver, _Mode.Expression);
        const key = this._visit(ast.key, _Mode.Expression);
        const value = this._visit(ast.value, _Mode.Expression);
        if (obj === this._implicitReceiver) {
            this._localResolver.maybeRestoreView();
        }
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    }
    visitLiteralArray(ast, mode) {
        throw new Error(`Illegal State: literal arrays should have been converted into functions`);
    }
    visitLiteralMap(ast, mode) {
        throw new Error(`Illegal State: literal maps should have been converted into functions`);
    }
    visitLiteralPrimitive(ast, mode) {
        // For literal values of null, undefined, true, or false allow type interference
        // to infer the type.
        const type = ast.value === null || ast.value === undefined || ast.value === true || ast.value === true ?
            INFERRED_TYPE :
            undefined;
        return convertToStatementIfNeeded(mode, literal(ast.value, type, this.convertSourceSpan(ast.span)));
    }
    _getLocal(name, receiver) {
        if (this._localResolver.globals?.has(name) && receiver instanceof ThisReceiver) {
            return null;
        }
        return this._localResolver.getLocal(name);
    }
    visitPrefixNot(ast, mode) {
        return convertToStatementIfNeeded(mode, not(this._visit(ast.expression, _Mode.Expression)));
    }
    visitNonNullAssert(ast, mode) {
        return convertToStatementIfNeeded(mode, this._visit(ast.expression, _Mode.Expression));
    }
    visitPropertyRead(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            let result = null;
            const prevUsesImplicitReceiver = this.usesImplicitReceiver;
            const receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name, ast.receiver);
                if (result) {
                    // Restore the previous "usesImplicitReceiver" state since the implicit
                    // receiver has been replaced with a resolved local expression.
                    this.usesImplicitReceiver = prevUsesImplicitReceiver;
                    this.addImplicitReceiverAccess(ast.name);
                }
            }
            if (result == null) {
                result = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    visitPropertyWrite(ast, mode) {
        const receiver = this._visit(ast.receiver, _Mode.Expression);
        const prevUsesImplicitReceiver = this.usesImplicitReceiver;
        let varExpr = null;
        if (receiver === this._implicitReceiver) {
            const localExpr = this._getLocal(ast.name, ast.receiver);
            if (localExpr) {
                if (localExpr instanceof ReadPropExpr) {
                    // If the local variable is a property read expression, it's a reference
                    // to a 'context.property' value and will be used as the target of the
                    // write expression.
                    varExpr = localExpr;
                    // Restore the previous "usesImplicitReceiver" state since the implicit
                    // receiver has been replaced with a resolved local expression.
                    this.usesImplicitReceiver = prevUsesImplicitReceiver;
                    this.addImplicitReceiverAccess(ast.name);
                }
                else {
                    // Otherwise it's an error.
                    const receiver = ast.name;
                    const value = (ast.value instanceof PropertyRead) ? ast.value.name : undefined;
                    throw new Error(`Cannot assign value "${value}" to template variable "${receiver}". Template variables are read-only.`);
                }
            }
        }
        // If no local expression could be produced, use the original receiver's
        // property as the target.
        if (varExpr === null) {
            varExpr = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
        }
        return convertToStatementIfNeeded(mode, varExpr.set(this._visit(ast.value, _Mode.Expression)));
    }
    visitSafePropertyRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    visitSafeKeyedRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    visitAll(asts, mode) {
        return asts.map(ast => this._visit(ast, mode));
    }
    visitQuote(ast, mode) {
        throw new Error(`Quotes are not supported for evaluation!
        Statement: ${ast.uninterpretedExpression} located at ${ast.location}`);
    }
    visitCall(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        const convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        if (ast instanceof BuiltinFunctionCall) {
            return convertToStatementIfNeeded(mode, ast.converter(convertedArgs));
        }
        const receiver = ast.receiver;
        if (receiver instanceof PropertyRead &&
            receiver.receiver instanceof ImplicitReceiver &&
            !(receiver.receiver instanceof ThisReceiver) && receiver.name === '$any') {
            if (convertedArgs.length !== 1) {
                throw new Error(`Invalid call to $any, expected 1 argument but received ${convertedArgs.length || 'none'}`);
            }
            return convertToStatementIfNeeded(mode, convertedArgs[0]);
        }
        const call = this._visit(receiver, _Mode.Expression)
            .callFn(convertedArgs, this.convertSourceSpan(ast.span));
        return convertToStatementIfNeeded(mode, call);
    }
    visitSafeCall(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    _visit(ast, mode) {
        const result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    }
    convertSafeAccess(ast, leftMostSafe, mode) {
        // If the expression contains a safe access node on the left it needs to be converted to
        // an expression that guards the access to the member by checking the receiver for blank. As
        // execution proceeds from left to right, the left most part of the expression must be guarded
        // first but, because member access is left associative, the right side of the expression is at
        // the top of the AST. The desired result requires lifting a copy of the left part of the
        // expression up to test it for blank before generating the unguarded version.
        // Consider, for example the following expression: a?.b.c?.d.e
        // This results in the ast:
        //         .
        //        / \
        //       ?.   e
        //      /  \
        //     .    d
        //    / \
        //   ?.  c
        //  /  \
        // a    b
        // The following tree should be generated:
        //
        //        /---- ? ----\
        //       /      |      \
        //     a   /--- ? ---\  null
        //        /     |     \
        //       .      .     null
        //      / \    / \
        //     .  c   .   e
        //    / \    / \
        //   a   b  .   d
        //         / \
        //        .   c
        //       / \
        //      a   b
        //
        // Notice that the first guard condition is the left hand of the left most safe access node
        // which comes in as leftMostSafe to this routine.
        let guardedExpression = this._visit(leftMostSafe.receiver, _Mode.Expression);
        let temporary = undefined;
        if (this.needsTemporaryInSafeAccess(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        const condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof SafeCall) {
            this._nodeMap.set(leftMostSafe, new Call(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.args, leftMostSafe.argumentSpan));
        }
        else if (leftMostSafe instanceof SafeKeyedRead) {
            this._nodeMap.set(leftMostSafe, new KeyedRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.key));
        }
        else {
            this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.nameSpan, leftMostSafe.receiver, leftMostSafe.name));
        }
        // Recursively convert the node now without the guarded member access.
        const access = this._visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(NULL_EXPR, access));
    }
    convertNullishCoalesce(ast, mode) {
        const left = this._visit(ast.left, _Mode.Expression);
        const right = this._visit(ast.right, _Mode.Expression);
        const temporary = this.allocateTemporary();
        this.releaseTemporary(temporary);
        // Generate the following expression. It is identical to how TS
        // transpiles binary expressions with a nullish coalescing operator.
        // let temp;
        // (temp = a) !== null && temp !== undefined ? temp : b;
        return convertToStatementIfNeeded(mode, temporary.set(left)
            .notIdentical(NULL_EXPR)
            .and(temporary.notIdentical(literal(undefined)))
            .conditional(temporary, right));
    }
    // Given an expression of the form a?.b.c?.d.e then the left most safe node is
    // the (a?.b). The . and ?. are left associative thus can be rewritten as:
    // ((((a?.c).b).c)?.d).e. This returns the most deeply nested safe read or
    // safe method call as this needs to be transformed initially to:
    //   a == null ? null : a.c.b.c?.d.e
    // then to:
    //   a == null ? null : a.b.c == null ? null : a.b.c.d.e
    leftMostSafeNode(ast) {
        const visit = (visitor, ast) => {
            return (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            visitUnary(ast) {
                return null;
            },
            visitBinary(ast) {
                return null;
            },
            visitChain(ast) {
                return null;
            },
            visitConditional(ast) {
                return null;
            },
            visitCall(ast) {
                return visit(this, ast.receiver);
            },
            visitSafeCall(ast) {
                return visit(this, ast.receiver) || ast;
            },
            visitImplicitReceiver(ast) {
                return null;
            },
            visitThisReceiver(ast) {
                return null;
            },
            visitInterpolation(ast) {
                return null;
            },
            visitKeyedRead(ast) {
                return visit(this, ast.receiver);
            },
            visitKeyedWrite(ast) {
                return null;
            },
            visitLiteralArray(ast) {
                return null;
            },
            visitLiteralMap(ast) {
                return null;
            },
            visitLiteralPrimitive(ast) {
                return null;
            },
            visitPipe(ast) {
                return null;
            },
            visitPrefixNot(ast) {
                return null;
            },
            visitNonNullAssert(ast) {
                return null;
            },
            visitPropertyRead(ast) {
                return visit(this, ast.receiver);
            },
            visitPropertyWrite(ast) {
                return null;
            },
            visitQuote(ast) {
                return null;
            },
            visitSafePropertyRead(ast) {
                return visit(this, ast.receiver) || ast;
            },
            visitSafeKeyedRead(ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    }
    // Returns true of the AST includes a method or a pipe indicating that, if the
    // expression is used as the target of a safe property or method access then
    // the expression should be stored into a temporary variable.
    needsTemporaryInSafeAccess(ast) {
        const visit = (visitor, ast) => {
            return ast && (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        const visitSome = (visitor, ast) => {
            return ast.some(ast => visit(visitor, ast));
        };
        return ast.visit({
            visitUnary(ast) {
                return visit(this, ast.expr);
            },
            visitBinary(ast) {
                return visit(this, ast.left) || visit(this, ast.right);
            },
            visitChain(ast) {
                return false;
            },
            visitConditional(ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) || visit(this, ast.falseExp);
            },
            visitCall(ast) {
                return true;
            },
            visitSafeCall(ast) {
                return true;
            },
            visitImplicitReceiver(ast) {
                return false;
            },
            visitThisReceiver(ast) {
                return false;
            },
            visitInterpolation(ast) {
                return visitSome(this, ast.expressions);
            },
            visitKeyedRead(ast) {
                return false;
            },
            visitKeyedWrite(ast) {
                return false;
            },
            visitLiteralArray(ast) {
                return true;
            },
            visitLiteralMap(ast) {
                return true;
            },
            visitLiteralPrimitive(ast) {
                return false;
            },
            visitPipe(ast) {
                return true;
            },
            visitPrefixNot(ast) {
                return visit(this, ast.expression);
            },
            visitNonNullAssert(ast) {
                return visit(this, ast.expression);
            },
            visitPropertyRead(ast) {
                return false;
            },
            visitPropertyWrite(ast) {
                return false;
            },
            visitQuote(ast) {
                return false;
            },
            visitSafePropertyRead(ast) {
                return false;
            },
            visitSafeKeyedRead(ast) {
                return false;
            }
        });
    }
    allocateTemporary() {
        const tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    }
    releaseTemporary(temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error(`Temporary ${temporary.name} released out of order`);
        }
    }
    /**
     * Creates an absolute `ParseSourceSpan` from the relative `ParseSpan`.
     *
     * `ParseSpan` objects are relative to the start of the expression.
     * This method converts these to full `ParseSourceSpan` objects that
     * show where the span is within the overall source file.
     *
     * @param span the relative span to convert.
     * @returns a `ParseSourceSpan` for the given span or null if no
     * `baseSourceSpan` was provided to this class.
     */
    convertSourceSpan(span) {
        if (this.baseSourceSpan) {
            const start = this.baseSourceSpan.start.moveBy(span.start);
            const end = this.baseSourceSpan.start.moveBy(span.end);
            const fullStart = this.baseSourceSpan.fullStart.moveBy(span.start);
            return new ParseSourceSpan(start, end, fullStart);
        }
        else {
            return null;
        }
    }
    /** Adds the name of an AST to the list of implicit receiver accesses. */
    addImplicitReceiverAccess(name) {
        if (this.implicitReceiverAccesses) {
            this.implicitReceiverAccesses.add(name);
        }
    }
}
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        arg.forEach((entry) => flattenStatements(entry, output));
    }
    else {
        output.push(arg);
    }
}
function unsupported() {
    throw new Error('Unsupported operation');
}
class InterpolationExpression extends Expression {
    constructor(args) {
        super(null, null);
        this.args = args;
        this.isConstant = unsupported;
        this.isEquivalent = unsupported;
        this.visitExpression = unsupported;
    }
}
class DefaultLocalResolver {
    constructor(globals) {
        this.globals = globals;
    }
    notifyImplicitReceiverUse() { }
    maybeRestoreView() { }
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    }
}
class BuiltinFunctionCall extends Call {
    constructor(span, sourceSpan, args, converter) {
        super(span, sourceSpan, new EmptyExpr(span, sourceSpan), args, null);
        this.converter = converter;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 *
 * Please make sure to keep to edits in sync with the source file.
 *
 * Source:
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 *
 * The original file level comment is reproduced below
 */
/*
  This is a limited shim for ShadowDOM css styling.
  https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles

  The intention here is to support only the styling features which can be
  relatively simply implemented. The goal is to allow users to avoid the
  most obvious pitfalls and do so without compromising performance significantly.
  For ShadowDOM styling that's not covered here, a set of best practices
  can be provided that should allow users to accomplish more complex styling.

  The following is a list of specific ShadowDOM styling features and a brief
  discussion of the approach used to shim.

  Shimmed features:

  * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
  element using the :host rule. To shim this feature, the :host styles are
  reformatted and prefixed with a given scope name and promoted to a
  document level stylesheet.
  For example, given a scope name of .foo, a rule like this:

    :host {
        background: red;
      }
    }

  becomes:

    .foo {
      background: red;
    }

  * encapsulation: Styles defined within ShadowDOM, apply only to
  dom inside the ShadowDOM. Polymer uses one of two techniques to implement
  this feature.

  By default, rules are prefixed with the host element tag name
  as a descendant selector. This ensures styling does not leak out of the 'top'
  of the element's ShadowDOM. For example,

  div {
      font-weight: bold;
    }

  becomes:

  x-foo div {
      font-weight: bold;
    }

  becomes:


  Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
  selectors are scoped by adding an attribute selector suffix to each
  simple selector that contains the host element tag name. Each element
  in the element's ShadowDOM template is also given the scope attribute.
  Thus, these rules match only elements that have the scope attribute.
  For example, given a scope name of x-foo, a rule like this:

    div {
      font-weight: bold;
    }

  becomes:

    div[x-foo] {
      font-weight: bold;
    }

  Note that elements that are dynamically added to a scope must have the scope
  selector added to them manually.

  * upper/lower bound encapsulation: Styles which are defined outside a
  shadowRoot should not cross the ShadowDOM boundary and should not apply
  inside a shadowRoot.

  This styling behavior is not emulated. Some possible ways to do this that
  were rejected due to complexity and/or performance concerns include: (1) reset
  every possible property for every possible selector for a given scope name;
  (2) re-implement css in javascript.

  As an alternative, users should make sure to use selectors
  specific to the scope in which they are working.

  * ::distributed: This behavior is not emulated. It's often not necessary
  to style the contents of a specific insertion point and instead, descendants
  of the host element can be styled selectively. Users can also create an
  extra node around an insertion point and style that node's contents
  via descendent selectors. For example, with a shadowRoot like this:

    <style>
      ::content(div) {
        background: red;
      }
    </style>
    <content></content>

  could become:

    <style>
      / *@polyfill .content-container div * /
      ::content(div) {
        background: red;
      }
    </style>
    <div class="content-container">
      <content></content>
    </div>

  Note the use of @polyfill in the comment above a ShadowDOM specific style
  declaration. This is a directive to the styling shim to use the selector
  in comments in lieu of the next selector when running under polyfill.
*/
class ShadowCss {
    constructor() {
        this.strictStyling = true;
    }
    /*
     * Shim some cssText with the given selector. Returns cssText that can
     * be included in the document via WebComponents.ShadowCSS.addCssToDocument(css).
     *
     * When strictStyling is true:
     * - selector is the attribute added to all elements inside the host,
     * - hostSelector is the attribute added to the host itself.
     */
    shimCssText(cssText, selector, hostSelector = '') {
        const commentsWithHash = extractCommentsWithHash(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        const scopedCssText = this._scopeCssText(cssText, selector, hostSelector);
        return [scopedCssText, ...commentsWithHash].join('\n');
    }
    _insertDirectives(cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    }
    /*
     * Process styles to convert native ShadowDOM rules that will trip
     * up the css parser; we rely on decorating the stylesheet with inert rules.
     *
     * For example, we convert this rule:
     *
     * polyfill-next-selector { content: ':host menu-item'; }
     * ::content menu-item {
     *
     * to this:
     *
     * scopeName menu-item {
     *
     **/
    _insertPolyfillDirectivesInCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentNextSelectorRe, function (...m) {
            return m[2] + '{';
        });
    }
    /*
     * Process styles to add rules which will only apply under the polyfill
     *
     * For example, we convert this rule:
     *
     * polyfill-rule {
     *   content: ':host menu-item';
     * ...
     * }
     *
     * to this:
     *
     * scopeName menu-item {...}
     *
     **/
    _insertPolyfillRulesInCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentRuleRe, (...m) => {
            const rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    }
    /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
     *
     *  .foo {... }
     *
     *  and converts this to
     *
     *  scopeName .foo { ... }
     */
    _scopeCssText(cssText, scopeSelector, hostSelector) {
        const unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
            cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
    }
    /*
     * Process styles to add rules which will only apply under the polyfill
     * and do not process via CSSOM. (CSSOM is destructive to rules on rare
     * occasions, e.g. -webkit-calc on Safari.)
     * For example, we convert this rule:
     *
     * @polyfill-unscoped-rule {
     *   content: 'menu-item';
     * ... }
     *
     * to this:
     *
     * menu-item {...}
     *
     **/
    _extractUnscopedRulesFromCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        let r = '';
        let m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            const rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    }
    /*
     * convert a rule like :host(.foo) > .bar { }
     *
     * to
     *
     * .foo<scopeName> > .bar
     */
    _convertColonHost(cssText) {
        return cssText.replace(_cssColonHostRe, (_, hostSelectors, otherSelectors) => {
            if (hostSelectors) {
                const convertedSelectors = [];
                const hostSelectorArray = hostSelectors.split(',').map(p => p.trim());
                for (const hostSelector of hostSelectorArray) {
                    if (!hostSelector)
                        break;
                    const convertedSelector = _polyfillHostNoCombinator + hostSelector.replace(_polyfillHost, '') + otherSelectors;
                    convertedSelectors.push(convertedSelector);
                }
                return convertedSelectors.join(',');
            }
            else {
                return _polyfillHostNoCombinator + otherSelectors;
            }
        });
    }
    /*
     * convert a rule like :host-context(.foo) > .bar { }
     *
     * to
     *
     * .foo<scopeName> > .bar, .foo <scopeName> > .bar { }
     *
     * and
     *
     * :host-context(.foo:host) .bar { ... }
     *
     * to
     *
     * .foo<scopeName> .bar { ... }
     */
    _convertColonHostContext(cssText) {
        return cssText.replace(_cssColonHostContextReGlobal, selectorText => {
            // We have captured a selector that contains a `:host-context` rule.
            // For backward compatibility `:host-context` may contain a comma separated list of selectors.
            // Each context selector group will contain a list of host-context selectors that must match
            // an ancestor of the host.
            // (Normally `contextSelectorGroups` will only contain a single array of context selectors.)
            const contextSelectorGroups = [[]];
            // There may be more than `:host-context` in this selector so `selectorText` could look like:
            // `:host-context(.one):host-context(.two)`.
            // Execute `_cssColonHostContextRe` over and over until we have extracted all the
            // `:host-context` selectors from this selector.
            let match;
            while (match = _cssColonHostContextRe.exec(selectorText)) {
                // `match` = [':host-context(<selectors>)<rest>', <selectors>, <rest>]
                // The `<selectors>` could actually be a comma separated list: `:host-context(.one, .two)`.
                const newContextSelectors = (match[1] ?? '').trim().split(',').map(m => m.trim()).filter(m => m !== '');
                // We must duplicate the current selector group for each of these new selectors.
                // For example if the current groups are:
                // ```
                // [
                //   ['a', 'b', 'c'],
                //   ['x', 'y', 'z'],
                // ]
                // ```
                // And we have a new set of comma separated selectors: `:host-context(m,n)` then the new
                // groups are:
                // ```
                // [
                //   ['a', 'b', 'c', 'm'],
                //   ['x', 'y', 'z', 'm'],
                //   ['a', 'b', 'c', 'n'],
                //   ['x', 'y', 'z', 'n'],
                // ]
                // ```
                const contextSelectorGroupsLength = contextSelectorGroups.length;
                repeatGroups(contextSelectorGroups, newContextSelectors.length);
                for (let i = 0; i < newContextSelectors.length; i++) {
                    for (let j = 0; j < contextSelectorGroupsLength; j++) {
                        contextSelectorGroups[j + (i * contextSelectorGroupsLength)].push(newContextSelectors[i]);
                    }
                }
                // Update the `selectorText` and see repeat to see if there are more `:host-context`s.
                selectorText = match[2];
            }
            // The context selectors now must be combined with each other to capture all the possible
            // selectors that `:host-context` can match. See `combineHostContextSelectors()` for more
            // info about how this is done.
            return contextSelectorGroups
                .map(contextSelectors => combineHostContextSelectors(contextSelectors, selectorText))
                .join(', ');
        });
    }
    /*
     * Convert combinators like ::shadow and pseudo-elements like ::content
     * by replacing with space.
     */
    _convertShadowDOMSelectors(cssText) {
        return _shadowDOMSelectorsRe.reduce((result, pattern) => result.replace(pattern, ' '), cssText);
    }
    // change a selector like 'div' to 'name div'
    _scopeSelectors(cssText, scopeSelector, hostSelector) {
        return processRules(cssText, (rule) => {
            let selector = rule.selector;
            let content = rule.content;
            if (rule.selector[0] !== '@') {
                selector =
                    this._scopeSelector(rule.selector, scopeSelector, hostSelector, this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@document') || rule.selector.startsWith('@layer')) {
                content = this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            else if (rule.selector.startsWith('@font-face') || rule.selector.startsWith('@page')) {
                content = this._stripScopingSelectors(rule.content);
            }
            return new CssRule(selector, content);
        });
    }
    /**
     * Handle a css text that is within a rule that should not contain scope selectors by simply
     * removing them! An example of such a rule is `@font-face`.
     *
     * `@font-face` rules cannot contain nested selectors. Nor can they be nested under a selector.
     * Normally this would be a syntax error by the author of the styles. But in some rare cases, such
     * as importing styles from a library, and applying `:host ::ng-deep` to the imported styles, we
     * can end up with broken css if the imported styles happen to contain @font-face rules.
     *
     * For example:
     *
     * ```
     * :host ::ng-deep {
     *   import 'some/lib/containing/font-face';
     * }
     *
     * Similar logic applies to `@page` rules which can contain a particular set of properties,
     * as well as some specific at-rules. Since they can't be encapsulated, we have to strip
     * any scoping selectors from them. For more information: https://www.w3.org/TR/css-page-3
     * ```
     */
    _stripScopingSelectors(cssText) {
        return processRules(cssText, rule => {
            const selector = rule.selector.replace(_shadowDeepSelectors, ' ')
                .replace(_polyfillHostNoCombinatorRe, ' ');
            return new CssRule(selector, rule.content);
        });
    }
    _scopeSelector(selector, scopeSelector, hostSelector, strict) {
        return selector.split(',')
            .map(part => part.trim().split(_shadowDeepSelectors))
            .map((deepParts) => {
            const [shallowPart, ...otherParts] = deepParts;
            const applyScope = (shallowPart) => {
                if (this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart), ...otherParts].join(' ');
        })
            .join(', ');
    }
    _selectorNeedsScoping(selector, scopeSelector) {
        const re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    }
    _makeScopeMatcher(scopeSelector) {
        const lre = /\[/g;
        const rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    }
    _applySelectorScope(selector, scopeSelector, hostSelector) {
        // Difference from webcomponents.js: scopeSelector could not be an array
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    }
    // scope via name and [is=name]
    _applySimpleSelectorScope(selector, scopeSelector, hostSelector) {
        // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            const replaceBy = this.strictStyling ? `[${hostSelector}]` : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, (hnc, selector) => {
                return selector.replace(/([^:]*)(:*)(.*)/, (_, before, colon, after) => {
                    return before + replaceBy + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy + ' ');
        }
        return scopeSelector + ' ' + selector;
    }
    // return a selector with [name] suffix on each simple selector
    // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
    _applyStrictSelectorScope(selector, scopeSelector, hostSelector) {
        const isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, (_, ...parts) => parts[0]);
        const attrName = '[' + scopeSelector + ']';
        const _scopeSelectorPart = (p) => {
            let scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                // remove :host since it should be unnecessary
                const t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    const matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        const safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        let scopedSelector = '';
        let startIndex = 0;
        let res;
        const sep = /( |>|\+|~(?!=))\s*/g;
        // If a selector appears before :host it should not be shimmed as it
        // matches on ancestor elements and not on elements in the host's shadow
        // `:host-context(div)` is transformed to
        // `-shadowcsshost-no-combinatordiv, div -shadowcsshost-no-combinator`
        // the `div` is not part of the component in the 2nd selectors and should not be scoped.
        // Historically `component-tag:host` was matching the component so we also want to preserve
        // this behavior to avoid breaking legacy apps (it should not match).
        // The behavior should be:
        // - `tag:host` -> `tag[h]` (this is to avoid breaking legacy apps, should not match anything)
        // - `tag :host` -> `tag [h]` (`tag` is not scoped because it's considered part of a
        //   `:host-context(tag)`)
        const hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1;
        // Only scope parts after the first `-shadowcsshost-no-combinator` when it is present
        let shouldScope = !hasHost;
        while ((res = sep.exec(selector)) !== null) {
            const separator = res[1];
            const part = selector.slice(startIndex, res.index).trim();
            shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
            const scopedPart = shouldScope ? _scopeSelectorPart(part) : part;
            scopedSelector += `${scopedPart} ${separator} `;
            startIndex = sep.lastIndex;
        }
        const part = selector.substring(startIndex);
        shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
        scopedSelector += shouldScope ? _scopeSelectorPart(part) : part;
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    }
    _insertPolyfillHostInCssText(selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    }
}
class SafeSelector {
    constructor(selector) {
        this.placeholders = [];
        this.index = 0;
        // Replaces attribute selectors with placeholders.
        // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        selector = this._escapeRegexMatches(selector, /(\[[^\]]*\])/g);
        // CSS allows for certain special characters to be used in selectors if they're escaped.
        // E.g. `.foo:blue` won't match a class called `foo:blue`, because the colon denotes a
        // pseudo-class, but writing `.foo\:blue` will match, because the colon was escaped.
        // Replace all escape sequences (`\` followed by a character) with a placeholder so
        // that our handling of pseudo-selectors doesn't mess with them.
        selector = this._escapeRegexMatches(selector, /(\\.)/g);
        // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
        // WS and "+" would otherwise be interpreted as selector separators.
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, (_, pseudo, exp) => {
            const replaceBy = `__ph-${this.index}__`;
            this.placeholders.push(exp);
            this.index++;
            return pseudo + replaceBy;
        });
    }
    restore(content) {
        return content.replace(/__ph-(\d+)__/g, (_ph, index) => this.placeholders[+index]);
    }
    content() {
        return this._content;
    }
    /**
     * Replaces all of the substrings that match a regex within a
     * special string (e.g. `__ph-0__`, `__ph-1__`, etc).
     */
    _escapeRegexMatches(content, pattern) {
        return content.replace(pattern, (_, keep) => {
            const replaceBy = `__ph-${this.index}__`;
            this.placeholders.push(keep);
            this.index++;
            return replaceBy;
        });
    }
}
const _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
const _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
const _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
const _polyfillHost = '-shadowcsshost';
// note: :host-context pre-processed to -shadowcsshostcontext.
const _polyfillHostContext = '-shadowcsscontext';
const _parenSuffix = '(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
const _cssColonHostRe = new RegExp(_polyfillHost + _parenSuffix, 'gim');
const _cssColonHostContextReGlobal = new RegExp(_polyfillHostContext + _parenSuffix, 'gim');
const _cssColonHostContextRe = new RegExp(_polyfillHostContext + _parenSuffix, 'im');
const _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
const _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
const _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    // Deprecated selectors
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
// The deep combinator is deprecated in the CSS spec
// Support for `>>>`, `deep`, `::ng-deep` is then also deprecated and will be removed in the future.
// see https://github.com/angular/angular/pull/17677
const _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
const _selectorReSuffix = '([>\\s~+[.,{:][\\s\\S]*)?$';
const _polyfillHostRe = /-shadowcsshost/gim;
const _colonHostRe = /:host/gim;
const _colonHostContextRe = /:host-context/gim;
const _commentRe = /\/\*[\s\S]*?\*\//g;
function stripComments(input) {
    return input.replace(_commentRe, '');
}
const _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g;
function extractCommentsWithHash(input) {
    return input.match(_commentWithHashRe) || [];
}
const BLOCK_PLACEHOLDER = '%BLOCK%';
const QUOTE_PLACEHOLDER = '%QUOTED%';
const _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
const _quotedRe = /%QUOTED%/g;
const CONTENT_PAIRS = new Map([['{', '}']]);
const QUOTE_PAIRS = new Map([[`"`, `"`], [`'`, `'`]]);
class CssRule {
    constructor(selector, content) {
        this.selector = selector;
        this.content = content;
    }
}
function processRules(input, ruleCallback) {
    const inputWithEscapedQuotes = escapeBlocks(input, QUOTE_PAIRS, QUOTE_PLACEHOLDER);
    const inputWithEscapedBlocks = escapeBlocks(inputWithEscapedQuotes.escapedString, CONTENT_PAIRS, BLOCK_PLACEHOLDER);
    let nextBlockIndex = 0;
    let nextQuoteIndex = 0;
    return inputWithEscapedBlocks.escapedString
        .replace(_ruleRe, (...m) => {
        const selector = m[2];
        let content = '';
        let suffix = m[4];
        let contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        const rule = ruleCallback(new CssRule(selector, content));
        return `${m[1]}${rule.selector}${m[3]}${contentPrefix}${rule.content}${suffix}`;
    })
        .replace(_quotedRe, () => inputWithEscapedQuotes.blocks[nextQuoteIndex++]);
}
class StringWithEscapedBlocks {
    constructor(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
}
function escapeBlocks(input, charPairs, placeholder) {
    const resultParts = [];
    const escapedBlocks = [];
    let openCharCount = 0;
    let nonBlockStartIndex = 0;
    let blockStartIndex = -1;
    let openChar;
    let closeChar;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === '\\') {
            i++;
        }
        else if (char === closeChar) {
            openCharCount--;
            if (openCharCount === 0) {
                escapedBlocks.push(input.substring(blockStartIndex, i));
                resultParts.push(placeholder);
                nonBlockStartIndex = i;
                blockStartIndex = -1;
                openChar = closeChar = undefined;
            }
        }
        else if (char === openChar) {
            openCharCount++;
        }
        else if (openCharCount === 0 && charPairs.has(char)) {
            openChar = char;
            closeChar = charPairs.get(char);
            openCharCount = 1;
            blockStartIndex = i + 1;
            resultParts.push(input.substring(nonBlockStartIndex, blockStartIndex));
        }
    }
    if (blockStartIndex !== -1) {
        escapedBlocks.push(input.substring(blockStartIndex));
        resultParts.push(placeholder);
    }
    else {
        resultParts.push(input.substring(nonBlockStartIndex));
    }
    return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
/**
 * Combine the `contextSelectors` with the `hostMarker` and the `otherSelectors`
 * to create a selector that matches the same as `:host-context()`.
 *
 * Given a single context selector `A` we need to output selectors that match on the host and as an
 * ancestor of the host:
 *
 * ```
 * A <hostMarker>, A<hostMarker> {}
 * ```
 *
 * When there is more than one context selector we also have to create combinations of those
 * selectors with each other. For example if there are `A` and `B` selectors the output is:
 *
 * ```
 * AB<hostMarker>, AB <hostMarker>, A B<hostMarker>,
 * B A<hostMarker>, A B <hostMarker>, B A <hostMarker> {}
 * ```
 *
 * And so on...
 *
 * @param hostMarker the string that selects the host element.
 * @param contextSelectors an array of context selectors that will be combined.
 * @param otherSelectors the rest of the selectors that are not context selectors.
 */
function combineHostContextSelectors(contextSelectors, otherSelectors) {
    const hostMarker = _polyfillHostNoCombinator;
    _polyfillHostRe.lastIndex = 0; // reset the regex to ensure we get an accurate test
    const otherSelectorsHasHost = _polyfillHostRe.test(otherSelectors);
    // If there are no context selectors then just output a host marker
    if (contextSelectors.length === 0) {
        return hostMarker + otherSelectors;
    }
    const combined = [contextSelectors.pop() || ''];
    while (contextSelectors.length > 0) {
        const length = combined.length;
        const contextSelector = contextSelectors.pop();
        for (let i = 0; i < length; i++) {
            const previousSelectors = combined[i];
            // Add the new selector as a descendant of the previous selectors
            combined[length * 2 + i] = previousSelectors + ' ' + contextSelector;
            // Add the new selector as an ancestor of the previous selectors
            combined[length + i] = contextSelector + ' ' + previousSelectors;
            // Add the new selector to act on the same element as the previous selectors
            combined[i] = contextSelector + previousSelectors;
        }
    }
    // Finally connect the selector to the `hostMarker`s: either acting directly on the host
    // (A<hostMarker>) or as an ancestor (A <hostMarker>).
    return combined
        .map(s => otherSelectorsHasHost ?
        `${s}${otherSelectors}` :
        `${s}${hostMarker}${otherSelectors}, ${s} ${hostMarker}${otherSelectors}`)
        .join(',');
}
/**
 * Mutate the given `groups` array so that there are `multiples` clones of the original array
 * stored.
 *
 * For example `repeatGroups([a, b], 3)` will result in `[a, b, a, b, a, b]` - but importantly the
 * newly added groups will be clones of the original.
 *
 * @param groups An array of groups of strings that will be repeated. This array is mutated
 *     in-place.
 * @param multiples The number of times the current groups should appear.
 */
function repeatGroups(groups, multiples) {
    const length = groups.length;
    for (let i = 1; i < multiples; i++) {
        for (let j = 0; j < length; j++) {
            groups[j + (i * length)] = groups[j].slice(0);
        }
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Parses string representation of a style and converts it into object literal.
 *
 * @param value string representation of style as used in the `style` attribute in HTML.
 *   Example: `color: red; height: auto`.
 * @returns An array of style property name and value pairs, e.g. `['color', 'red', 'height',
 * 'auto']`
 */
function parse(value) {
    // we use a string array here instead of a string map
    // because a string-map is not guaranteed to retain the
    // order of the entries whereas a string array can be
    // constructed in a [key, value, key, value] format.
    const styles = [];
    let i = 0;
    let parenDepth = 0;
    let quote = 0 /* QuoteNone */;
    let valueStart = 0;
    let propStart = 0;
    let currentProp = null;
    let valueHasQuotes = false;
    while (i < value.length) {
        const token = value.charCodeAt(i++);
        switch (token) {
            case 40 /* OpenParen */:
                parenDepth++;
                break;
            case 41 /* CloseParen */:
                parenDepth--;
                break;
            case 39 /* QuoteSingle */:
                // valueStart needs to be there since prop values don't
                // have quotes in CSS
                valueHasQuotes = valueHasQuotes || valueStart > 0;
                if (quote === 0 /* QuoteNone */) {
                    quote = 39 /* QuoteSingle */;
                }
                else if (quote === 39 /* QuoteSingle */ && value.charCodeAt(i - 1) !== 92 /* BackSlash */) {
                    quote = 0 /* QuoteNone */;
                }
                break;
            case 34 /* QuoteDouble */:
                // same logic as above
                valueHasQuotes = valueHasQuotes || valueStart > 0;
                if (quote === 0 /* QuoteNone */) {
                    quote = 34 /* QuoteDouble */;
                }
                else if (quote === 34 /* QuoteDouble */ && value.charCodeAt(i - 1) !== 92 /* BackSlash */) {
                    quote = 0 /* QuoteNone */;
                }
                break;
            case 58 /* Colon */:
                if (!currentProp && parenDepth === 0 && quote === 0 /* QuoteNone */) {
                    currentProp = hyphenate(value.substring(propStart, i - 1).trim());
                    valueStart = i;
                }
                break;
            case 59 /* Semicolon */:
                if (currentProp && valueStart > 0 && parenDepth === 0 && quote === 0 /* QuoteNone */) {
                    const styleVal = value.substring(valueStart, i - 1).trim();
                    styles.push(currentProp, valueHasQuotes ? stripUnnecessaryQuotes(styleVal) : styleVal);
                    propStart = i;
                    valueStart = 0;
                    currentProp = null;
                    valueHasQuotes = false;
                }
                break;
        }
    }
    if (currentProp && valueStart) {
        const styleVal = value.substr(valueStart).trim();
        styles.push(currentProp, valueHasQuotes ? stripUnnecessaryQuotes(styleVal) : styleVal);
    }
    return styles;
}
function stripUnnecessaryQuotes(value) {
    const qS = value.charCodeAt(0);
    const qE = value.charCodeAt(value.length - 1);
    if (qS == qE && (qS == 39 /* QuoteSingle */ || qS == 34 /* QuoteDouble */)) {
        const tempValue = value.substring(1, value.length - 1);
        // special case to avoid using a multi-quoted string that was just chomped
        // (e.g. `font-family: "Verdana", "sans-serif"`)
        if (tempValue.indexOf('\'') == -1 && tempValue.indexOf('"') == -1) {
            value = tempValue;
        }
    }
    return value;
}
function hyphenate(value) {
    return value
        .replace(/[a-z][A-Z]/g, v => {
        return v.charAt(0) + '-' + v.charAt(1);
    })
        .toLowerCase();
}

const IMPORTANT_FLAG = '!important';
/**
 * Minimum amount of binding slots required in the runtime for style/class bindings.
 *
 * Styling in Angular uses up two slots in the runtime LView/TData data structures to
 * record binding data, property information and metadata.
 *
 * When a binding is registered it will place the following information in the `LView`:
 *
 * slot 1) binding value
 * slot 2) cached value (all other values collected before it in string form)
 *
 * When a binding is registered it will place the following information in the `TData`:
 *
 * slot 1) prop name
 * slot 2) binding index that points to the previous style/class binding (and some extra config
 * values)
 *
 * Let's imagine we have a binding that looks like so:
 *
 * ```
 * <div [style.width]="x" [style.height]="y">
 * ```
 *
 * Our `LView` and `TData` data-structures look like so:
 *
 * ```typescript
 * LView = [
 *   // ...
 *   x, // value of x
 *   "width: x",
 *
 *   y, // value of y
 *   "width: x; height: y",
 *   // ...
 * ];
 *
 * TData = [
 *   // ...
 *   "width", // binding slot 20
 *   0,
 *
 *   "height",
 *   20,
 *   // ...
 * ];
 * ```
 *
 * */
const MIN_STYLING_BINDING_SLOTS_REQUIRED = 2;
/**
 * Produces creation/update instructions for all styling bindings (class and style)
 *
 * It also produces the creation instruction to register all initial styling values
 * (which are all the static class="..." and style="..." attribute values that exist
 * on an element within a template).
 *
 * The builder class below handles producing instructions for the following cases:
 *
 * - Static style/class attributes (style="..." and class="...")
 * - Dynamic style/class map bindings ([style]="map" and [class]="map|string")
 * - Dynamic style/class property bindings ([style.prop]="exp" and [class.name]="exp")
 *
 * Due to the complex relationship of all of these cases, the instructions generated
 * for these attributes/properties/bindings must be done so in the correct order. The
 * order which these must be generated is as follows:
 *
 * if (createMode) {
 *   styling(...)
 * }
 * if (updateMode) {
 *   styleMap(...)
 *   classMap(...)
 *   styleProp(...)
 *   classProp(...)
 * }
 *
 * The creation/update methods within the builder class produce these instructions.
 */
class StylingBuilder {
    constructor(_directiveExpr) {
        this._directiveExpr = _directiveExpr;
        /** Whether or not there are any static styling values present */
        this._hasInitialValues = false;
        /**
         *  Whether or not there are any styling bindings present
         *  (i.e. `[style]`, `[class]`, `[style.prop]` or `[class.name]`)
         */
        this.hasBindings = false;
        this.hasBindingsWithPipes = false;
        /** the input for [class] (if it exists) */
        this._classMapInput = null;
        /** the input for [style] (if it exists) */
        this._styleMapInput = null;
        /** an array of each [style.prop] input */
        this._singleStyleInputs = null;
        /** an array of each [class.name] input */
        this._singleClassInputs = null;
        this._lastStylingInput = null;
        this._firstStylingInput = null;
        // maps are used instead of hash maps because a Map will
        // retain the ordering of the keys
        /**
         * Represents the location of each style binding in the template
         * (e.g. `<div [style.width]="w" [style.height]="h">` implies
         * that `width=0` and `height=1`)
         */
        this._stylesIndex = new Map();
        /**
         * Represents the location of each class binding in the template
         * (e.g. `<div [class.big]="b" [class.hidden]="h">` implies
         * that `big=0` and `hidden=1`)
         */
        this._classesIndex = new Map();
        this._initialStyleValues = [];
        this._initialClassValues = [];
    }
    /**
     * Registers a given input to the styling builder to be later used when producing AOT code.
     *
     * The code below will only accept the input if it is somehow tied to styling (whether it be
     * style/class bindings or static style/class attributes).
     */
    registerBoundInput(input) {
        // [attr.style] or [attr.class] are skipped in the code below,
        // they should not be treated as styling-based bindings since
        // they are intended to be written directly to the attr and
        // will therefore skip all style/class resolution that is present
        // with style="", [style]="" and [style.prop]="", class="",
        // [class.prop]="". [class]="" assignments
        let binding = null;
        let name = input.name;
        switch (input.type) {
            case 0 /* Property */:
                binding = this.registerInputBasedOnName(name, input.value, input.sourceSpan);
                break;
            case 3 /* Style */:
                binding = this.registerStyleInput(name, false, input.value, input.sourceSpan, input.unit);
                break;
            case 2 /* Class */:
                binding = this.registerClassInput(name, false, input.value, input.sourceSpan);
                break;
        }
        return binding ? true : false;
    }
    registerInputBasedOnName(name, expression, sourceSpan) {
        let binding = null;
        const prefix = name.substring(0, 6);
        const isStyle = name === 'style' || prefix === 'style.' || prefix === 'style!';
        const isClass = !isStyle && (name === 'class' || prefix === 'class.' || prefix === 'class!');
        if (isStyle || isClass) {
            const isMapBased = name.charAt(5) !== '.'; // style.prop or class.prop makes this a no
            const property = name.substr(isMapBased ? 5 : 6); // the dot explains why there's a +1
            if (isStyle) {
                binding = this.registerStyleInput(property, isMapBased, expression, sourceSpan);
            }
            else {
                binding = this.registerClassInput(property, isMapBased, expression, sourceSpan);
            }
        }
        return binding;
    }
    registerStyleInput(name, isMapBased, value, sourceSpan, suffix) {
        if (isEmptyExpression(value)) {
            return null;
        }
        // CSS custom properties are case-sensitive so we shouldn't normalize them.
        // See: https://www.w3.org/TR/css-variables-1/#defining-variables
        if (!isCssCustomProperty(name)) {
            name = hyphenate(name);
        }
        const { property, hasOverrideFlag, suffix: bindingSuffix } = parseProperty(name);
        suffix = typeof suffix === 'string' && suffix.length !== 0 ? suffix : bindingSuffix;
        const entry = { name: property, suffix: suffix, value, sourceSpan, hasOverrideFlag };
        if (isMapBased) {
            this._styleMapInput = entry;
        }
        else {
            (this._singleStyleInputs = this._singleStyleInputs || []).push(entry);
            registerIntoMap(this._stylesIndex, property);
        }
        this._lastStylingInput = entry;
        this._firstStylingInput = this._firstStylingInput || entry;
        this._checkForPipes(value);
        this.hasBindings = true;
        return entry;
    }
    registerClassInput(name, isMapBased, value, sourceSpan) {
        if (isEmptyExpression(value)) {
            return null;
        }
        const { property, hasOverrideFlag } = parseProperty(name);
        const entry = { name: property, value, sourceSpan, hasOverrideFlag, suffix: null };
        if (isMapBased) {
            this._classMapInput = entry;
        }
        else {
            (this._singleClassInputs = this._singleClassInputs || []).push(entry);
            registerIntoMap(this._classesIndex, property);
        }
        this._lastStylingInput = entry;
        this._firstStylingInput = this._firstStylingInput || entry;
        this._checkForPipes(value);
        this.hasBindings = true;
        return entry;
    }
    _checkForPipes(value) {
        if ((value instanceof ASTWithSource) && (value.ast instanceof BindingPipe)) {
            this.hasBindingsWithPipes = true;
        }
    }
    /**
     * Registers the element's static style string value to the builder.
     *
     * @param value the style string (e.g. `width:100px; height:200px;`)
     */
    registerStyleAttr(value) {
        this._initialStyleValues = parse(value);
        this._hasInitialValues = true;
    }
    /**
     * Registers the element's static class string value to the builder.
     *
     * @param value the className string (e.g. `disabled gold zoom`)
     */
    registerClassAttr(value) {
        this._initialClassValues = value.trim().split(/\s+/g);
        this._hasInitialValues = true;
    }
    /**
     * Appends all styling-related expressions to the provided attrs array.
     *
     * @param attrs an existing array where each of the styling expressions
     * will be inserted into.
     */
    populateInitialStylingAttrs(attrs) {
        // [CLASS_MARKER, 'foo', 'bar', 'baz' ...]
        if (this._initialClassValues.length) {
            attrs.push(literal(1 /* Classes */));
            for (let i = 0; i < this._initialClassValues.length; i++) {
                attrs.push(literal(this._initialClassValues[i]));
            }
        }
        // [STYLE_MARKER, 'width', '200px', 'height', '100px', ...]
        if (this._initialStyleValues.length) {
            attrs.push(literal(2 /* Styles */));
            for (let i = 0; i < this._initialStyleValues.length; i += 2) {
                attrs.push(literal(this._initialStyleValues[i]), literal(this._initialStyleValues[i + 1]));
            }
        }
    }
    /**
     * Builds an instruction with all the expressions and parameters for `elementHostAttrs`.
     *
     * The instruction generation code below is used for producing the AOT statement code which is
     * responsible for registering initial styles (within a directive hostBindings' creation block),
     * as well as any of the provided attribute values, to the directive host element.
     */
    assignHostAttrs(attrs, definitionMap) {
        if (this._directiveExpr && (attrs.length || this._hasInitialValues)) {
            this.populateInitialStylingAttrs(attrs);
            definitionMap.set('hostAttrs', literalArr(attrs));
        }
    }
    /**
     * Builds an instruction with all the expressions and parameters for `classMap`.
     *
     * The instruction data will contain all expressions for `classMap` to function
     * which includes the `[class]` expression params.
     */
    buildClassMapInstruction(valueConverter) {
        if (this._classMapInput) {
            return this._buildMapBasedInstruction(valueConverter, true, this._classMapInput);
        }
        return null;
    }
    /**
     * Builds an instruction with all the expressions and parameters for `styleMap`.
     *
     * The instruction data will contain all expressions for `styleMap` to function
     * which includes the `[style]` expression params.
     */
    buildStyleMapInstruction(valueConverter) {
        if (this._styleMapInput) {
            return this._buildMapBasedInstruction(valueConverter, false, this._styleMapInput);
        }
        return null;
    }
    _buildMapBasedInstruction(valueConverter, isClassBased, stylingInput) {
        // each styling binding value is stored in the LView
        // map-based bindings allocate two slots: one for the
        // previous binding value and another for the previous
        // className or style attribute value.
        let totalBindingSlotsRequired = MIN_STYLING_BINDING_SLOTS_REQUIRED;
        // these values must be outside of the update block so that they can
        // be evaluated (the AST visit call) during creation time so that any
        // pipes can be picked up in time before the template is built
        const mapValue = stylingInput.value.visit(valueConverter);
        let reference;
        if (mapValue instanceof Interpolation) {
            totalBindingSlotsRequired += mapValue.expressions.length;
            reference = isClassBased ? getClassMapInterpolationExpression(mapValue) :
                getStyleMapInterpolationExpression(mapValue);
        }
        else {
            reference = isClassBased ? Identifiers.classMap : Identifiers.styleMap;
        }
        return {
            reference,
            calls: [{
                    supportsInterpolation: true,
                    sourceSpan: stylingInput.sourceSpan,
                    allocateBindingSlots: totalBindingSlotsRequired,
                    params: (convertFn) => {
                        const convertResult = convertFn(mapValue);
                        const params = Array.isArray(convertResult) ? convertResult : [convertResult];
                        return params;
                    }
                }]
        };
    }
    _buildSingleInputs(reference, inputs, valueConverter, getInterpolationExpressionFn, isClassBased) {
        const instructions = [];
        inputs.forEach(input => {
            const previousInstruction = instructions[instructions.length - 1];
            const value = input.value.visit(valueConverter);
            let referenceForCall = reference;
            // each styling binding value is stored in the LView
            // but there are two values stored for each binding:
            //   1) the value itself
            //   2) an intermediate value (concatenation of style up to this point).
            //      We need to store the intermediate value so that we don't allocate
            //      the strings on each CD.
            let totalBindingSlotsRequired = MIN_STYLING_BINDING_SLOTS_REQUIRED;
            if (value instanceof Interpolation) {
                totalBindingSlotsRequired += value.expressions.length;
                if (getInterpolationExpressionFn) {
                    referenceForCall = getInterpolationExpressionFn(value);
                }
            }
            const call = {
                sourceSpan: input.sourceSpan,
                allocateBindingSlots: totalBindingSlotsRequired,
                supportsInterpolation: !!getInterpolationExpressionFn,
                params: (convertFn) => {
                    // params => stylingProp(propName, value, suffix)
                    const params = [];
                    params.push(literal(input.name));
                    const convertResult = convertFn(value);
                    if (Array.isArray(convertResult)) {
                        params.push(...convertResult);
                    }
                    else {
                        params.push(convertResult);
                    }
                    // [style.prop] bindings may use suffix values (e.g. px, em, etc...), therefore,
                    // if that is detected then we need to pass that in as an optional param.
                    if (!isClassBased && input.suffix !== null) {
                        params.push(literal(input.suffix));
                    }
                    return params;
                }
            };
            // If we ended up generating a call to the same instruction as the previous styling property
            // we can chain the calls together safely to save some bytes, otherwise we have to generate
            // a separate instruction call. This is primarily a concern with interpolation instructions
            // where we may start off with one `reference`, but end up using another based on the
            // number of interpolations.
            if (previousInstruction && previousInstruction.reference === referenceForCall) {
                previousInstruction.calls.push(call);
            }
            else {
                instructions.push({ reference: referenceForCall, calls: [call] });
            }
        });
        return instructions;
    }
    _buildClassInputs(valueConverter) {
        if (this._singleClassInputs) {
            return this._buildSingleInputs(Identifiers.classProp, this._singleClassInputs, valueConverter, null, true);
        }
        return [];
    }
    _buildStyleInputs(valueConverter) {
        if (this._singleStyleInputs) {
            return this._buildSingleInputs(Identifiers.styleProp, this._singleStyleInputs, valueConverter, getStylePropInterpolationExpression, false);
        }
        return [];
    }
    /**
     * Constructs all instructions which contain the expressions that will be placed
     * into the update block of a template function or a directive hostBindings function.
     */
    buildUpdateLevelInstructions(valueConverter) {
        const instructions = [];
        if (this.hasBindings) {
            const styleMapInstruction = this.buildStyleMapInstruction(valueConverter);
            if (styleMapInstruction) {
                instructions.push(styleMapInstruction);
            }
            const classMapInstruction = this.buildClassMapInstruction(valueConverter);
            if (classMapInstruction) {
                instructions.push(classMapInstruction);
            }
            instructions.push(...this._buildStyleInputs(valueConverter));
            instructions.push(...this._buildClassInputs(valueConverter));
        }
        return instructions;
    }
}
function registerIntoMap(map, key) {
    if (!map.has(key)) {
        map.set(key, map.size);
    }
}
function parseProperty(name) {
    let hasOverrideFlag = false;
    const overrideIndex = name.indexOf(IMPORTANT_FLAG);
    if (overrideIndex !== -1) {
        name = overrideIndex > 0 ? name.substring(0, overrideIndex) : '';
        hasOverrideFlag = true;
    }
    let suffix = null;
    let property = name;
    const unitIndex = name.lastIndexOf('.');
    if (unitIndex > 0) {
        suffix = name.substr(unitIndex + 1);
        property = name.substring(0, unitIndex);
    }
    return { property, suffix, hasOverrideFlag };
}
/**
 * Gets the instruction to generate for an interpolated class map.
 * @param interpolation An Interpolation AST
 */
function getClassMapInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 1:
            return Identifiers.classMap;
        case 3:
            return Identifiers.classMapInterpolate1;
        case 5:
            return Identifiers.classMapInterpolate2;
        case 7:
            return Identifiers.classMapInterpolate3;
        case 9:
            return Identifiers.classMapInterpolate4;
        case 11:
            return Identifiers.classMapInterpolate5;
        case 13:
            return Identifiers.classMapInterpolate6;
        case 15:
            return Identifiers.classMapInterpolate7;
        case 17:
            return Identifiers.classMapInterpolate8;
        default:
            return Identifiers.classMapInterpolateV;
    }
}
/**
 * Gets the instruction to generate for an interpolated style map.
 * @param interpolation An Interpolation AST
 */
function getStyleMapInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 1:
            return Identifiers.styleMap;
        case 3:
            return Identifiers.styleMapInterpolate1;
        case 5:
            return Identifiers.styleMapInterpolate2;
        case 7:
            return Identifiers.styleMapInterpolate3;
        case 9:
            return Identifiers.styleMapInterpolate4;
        case 11:
            return Identifiers.styleMapInterpolate5;
        case 13:
            return Identifiers.styleMapInterpolate6;
        case 15:
            return Identifiers.styleMapInterpolate7;
        case 17:
            return Identifiers.styleMapInterpolate8;
        default:
            return Identifiers.styleMapInterpolateV;
    }
}
/**
 * Gets the instruction to generate for an interpolated style prop.
 * @param interpolation An Interpolation AST
 */
function getStylePropInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 1:
            return Identifiers.styleProp;
        case 3:
            return Identifiers.stylePropInterpolate1;
        case 5:
            return Identifiers.stylePropInterpolate2;
        case 7:
            return Identifiers.stylePropInterpolate3;
        case 9:
            return Identifiers.stylePropInterpolate4;
        case 11:
            return Identifiers.stylePropInterpolate5;
        case 13:
            return Identifiers.stylePropInterpolate6;
        case 15:
            return Identifiers.stylePropInterpolate7;
        case 17:
            return Identifiers.stylePropInterpolate8;
        default:
            return Identifiers.stylePropInterpolateV;
    }
}
/**
 * Checks whether property name is a custom CSS property.
 * See: https://www.w3.org/TR/css-variables-1
 */
function isCssCustomProperty(name) {
    return name.startsWith('--');
}
function isEmptyExpression(ast) {
    if (ast instanceof ASTWithSource) {
        ast = ast.ast;
    }
    return ast instanceof EmptyExpr;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Character"] = 0] = "Character";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["PrivateIdentifier"] = 2] = "PrivateIdentifier";
    TokenType[TokenType["Keyword"] = 3] = "Keyword";
    TokenType[TokenType["String"] = 4] = "String";
    TokenType[TokenType["Operator"] = 5] = "Operator";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["Error"] = 7] = "Error";
})(TokenType || (TokenType = {}));
const KEYWORDS = ['var', 'let', 'as', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
class Lexer {
    tokenize(text) {
        const scanner = new _Scanner(text);
        const tokens = [];
        let token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    }
}
class Token {
    constructor(index, end, type, numValue, strValue) {
        this.index = index;
        this.end = end;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    isCharacter(code) {
        return this.type == TokenType.Character && this.numValue == code;
    }
    isNumber() {
        return this.type == TokenType.Number;
    }
    isString() {
        return this.type == TokenType.String;
    }
    isOperator(operator) {
        return this.type == TokenType.Operator && this.strValue == operator;
    }
    isIdentifier() {
        return this.type == TokenType.Identifier;
    }
    isPrivateIdentifier() {
        return this.type == TokenType.PrivateIdentifier;
    }
    isKeyword() {
        return this.type == TokenType.Keyword;
    }
    isKeywordLet() {
        return this.type == TokenType.Keyword && this.strValue == 'let';
    }
    isKeywordAs() {
        return this.type == TokenType.Keyword && this.strValue == 'as';
    }
    isKeywordNull() {
        return this.type == TokenType.Keyword && this.strValue == 'null';
    }
    isKeywordUndefined() {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    }
    isKeywordTrue() {
        return this.type == TokenType.Keyword && this.strValue == 'true';
    }
    isKeywordFalse() {
        return this.type == TokenType.Keyword && this.strValue == 'false';
    }
    isKeywordThis() {
        return this.type == TokenType.Keyword && this.strValue == 'this';
    }
    isError() {
        return this.type == TokenType.Error;
    }
    toNumber() {
        return this.type == TokenType.Number ? this.numValue : -1;
    }
    toString() {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.PrivateIdentifier:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    }
}
function newCharacterToken(index, end, code) {
    return new Token(index, end, TokenType.Character, code, String.fromCharCode(code));
}
function newIdentifierToken(index, end, text) {
    return new Token(index, end, TokenType.Identifier, 0, text);
}
function newPrivateIdentifierToken(index, end, text) {
    return new Token(index, end, TokenType.PrivateIdentifier, 0, text);
}
function newKeywordToken(index, end, text) {
    return new Token(index, end, TokenType.Keyword, 0, text);
}
function newOperatorToken(index, end, text) {
    return new Token(index, end, TokenType.Operator, 0, text);
}
function newStringToken(index, end, text) {
    return new Token(index, end, TokenType.String, 0, text);
}
function newNumberToken(index, end, n) {
    return new Token(index, end, TokenType.Number, n, '');
}
function newErrorToken(index, end, message) {
    return new Token(index, end, TokenType.Error, 0, message);
}
const EOF = new Token(-1, -1, TokenType.Character, 0, '');
class _Scanner {
    constructor(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    advance() {
        this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
    }
    scanToken() {
        const input = this.input, length = this.length;
        let peek = this.peek, index = this.index;
        // Skip whitespace.
        while (peek <= $SPACE) {
            if (++index >= length) {
                peek = $EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        const start = index;
        switch (peek) {
            case $PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, this.index, $PERIOD);
            case $LPAREN:
            case $RPAREN:
            case $LBRACE:
            case $RBRACE:
            case $LBRACKET:
            case $RBRACKET:
            case $COMMA:
            case $COLON:
            case $SEMICOLON:
                return this.scanCharacter(start, peek);
            case $SQ:
            case $DQ:
                return this.scanString();
            case $HASH:
                return this.scanPrivateIdentifier();
            case $PLUS:
            case $MINUS:
            case $STAR:
            case $SLASH:
            case $PERCENT:
            case $CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case $QUESTION:
                return this.scanQuestion(start);
            case $LT:
            case $GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=');
            case $BANG:
            case $EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=', $EQ, '=');
            case $AMPERSAND:
                return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
            case $BAR:
                return this.scanComplexOperator(start, '|', $BAR, '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.advance();
        return this.error(`Unexpected character [${String.fromCharCode(peek)}]`, 0);
    }
    scanCharacter(start, code) {
        this.advance();
        return newCharacterToken(start, this.index, code);
    }
    scanOperator(start, str) {
        this.advance();
        return newOperatorToken(start, this.index, str);
    }
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     */
    scanComplexOperator(start, one, twoCode, two, threeCode, three) {
        this.advance();
        let str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, this.index, str);
    }
    scanIdentifier() {
        const start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        const str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, this.index, str) :
            newIdentifierToken(start, this.index, str);
    }
    /** Scans an ECMAScript private identifier. */
    scanPrivateIdentifier() {
        const start = this.index;
        this.advance();
        if (!isIdentifierStart(this.peek)) {
            return this.error('Invalid character [#]', -1);
        }
        while (isIdentifierPart(this.peek))
            this.advance();
        const identifierName = this.input.substring(start, this.index);
        return newPrivateIdentifierToken(start, this.index, identifierName);
    }
    scanNumber(start) {
        let simple = (this.index === start);
        let hasSeparators = false;
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
                // Do nothing.
            }
            else if (this.peek === $_) {
                // Separators are only valid when they're surrounded by digits. E.g. `1_0_1` is
                // valid while `_101` and `101_` are not. The separator can't be next to the decimal
                // point or another separator either. Note that it's unlikely that we'll hit a case where
                // the underscore is at the start, because that's a valid identifier and it will be picked
                // up earlier in the parsing. We validate for it anyway just in case.
                if (!isDigit(this.input.charCodeAt(this.index - 1)) ||
                    !isDigit(this.input.charCodeAt(this.index + 1))) {
                    return this.error('Invalid numeric separator', 0);
                }
                hasSeparators = true;
            }
            else if (this.peek === $PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    return this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        let str = this.input.substring(start, this.index);
        if (hasSeparators) {
            str = str.replace(/_/g, '');
        }
        const value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, this.index, value);
    }
    scanString() {
        const start = this.index;
        const quote = this.peek;
        this.advance(); // Skip initial quote.
        let buffer = '';
        let marker = this.index;
        const input = this.input;
        while (this.peek != quote) {
            if (this.peek == $BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                let unescapedCode;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    const hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error(`Invalid unicode escape [\\u${hex}]`, 0);
                    }
                    for (let i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek == $EOF) {
                return this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        const last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, this.index, buffer + last);
    }
    scanQuestion(start) {
        this.advance();
        let str = '?';
        // Either `a ?? b` or 'a?.b'.
        if (this.peek === $QUESTION || this.peek === $PERIOD) {
            str += this.peek === $PERIOD ? '.' : '?';
            this.advance();
        }
        return newOperatorToken(start, this.index, str);
    }
    error(message, offset) {
        const position = this.index + offset;
        return newErrorToken(position, this.index, `Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
    }
}
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) ||
        (code == $_) || (code == $$);
}
function isIdentifier(input) {
    if (input.length == 0)
        return false;
    const scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== $EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
function isIdentifierPart(code) {
    return isAsciiLetter(code) || isDigit(code) || (code == $_) ||
        (code == $$);
}
function isExponentStart(code) {
    return code == $e || code == $E;
}
function isExponentSign(code) {
    return code == $MINUS || code == $PLUS;
}
function unescape(code) {
    switch (code) {
        case $n:
            return $LF;
        case $f:
            return $FF;
        case $r:
            return $CR;
        case $t:
            return $TAB;
        case $v:
            return $VTAB;
        default:
            return code;
    }
}
function parseIntAutoRadix(text) {
    const result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class SplitInterpolation {
    constructor(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
}
class TemplateBindingParseResult {
    constructor(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
}
class Parser$1 {
    constructor(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    parseAction(input, isAssignmentEvent, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        this._checkNoInterpolation(input, location, interpolationConfig);
        const sourceToLex = this._stripComments(input);
        const tokens = this._lexer.tokenize(sourceToLex);
        let flags = 1 /* Action */;
        if (isAssignmentEvent) {
            flags |= 2 /* AssignmentEvent */;
        }
        const ast = new _ParseAST(input, location, absoluteOffset, tokens, flags, this.errors, 0).parseChain();
        return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
    }
    parseBinding(input, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const ast = this._parseBindingAst(input, location, absoluteOffset, interpolationConfig);
        return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
    }
    checkSimpleExpression(ast) {
        const checker = new SimpleExpressionChecker();
        ast.visit(checker);
        return checker.errors;
    }
    parseSimpleBinding(input, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const ast = this._parseBindingAst(input, location, absoluteOffset, interpolationConfig);
        const errors = this.checkSimpleExpression(ast);
        if (errors.length > 0) {
            this._reportError(`Host binding expression cannot contain ${errors.join(' ')}`, input, location);
        }
        return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
    }
    _reportError(message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    }
    _parseBindingAst(input, location, absoluteOffset, interpolationConfig) {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        const quote = this._parseQuote(input, location, absoluteOffset);
        if (quote != null) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        const sourceToLex = this._stripComments(input);
        const tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, absoluteOffset, tokens, 0 /* None */, this.errors, 0)
            .parseChain();
    }
    _parseQuote(input, location, absoluteOffset) {
        if (input == null)
            return null;
        const prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        const prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        const uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        const span = new ParseSpan(0, input.length);
        return new Quote(span, span.toAbsolute(absoluteOffset), prefix, uninterpretedExpression, location);
    }
    /**
     * Parse microsyntax template expression and return a list of bindings or
     * parsing errors in case the given expression is invalid.
     *
     * For example,
     * ```
     *   <div *ngFor="let item of items">
     *         ^      ^ absoluteValueOffset for `templateValue`
     *         absoluteKeyOffset for `templateKey`
     * ```
     * contains three bindings:
     * 1. ngFor -> null
     * 2. item -> NgForOfContext.$implicit
     * 3. ngForOf -> items
     *
     * This is apparent from the de-sugared template:
     * ```
     *   <ng-template ngFor let-item [ngForOf]="items">
     * ```
     *
     * @param templateKey name of directive, without the * prefix. For example: ngIf, ngFor
     * @param templateValue RHS of the microsyntax attribute
     * @param templateUrl template filename if it's external, component filename if it's inline
     * @param absoluteKeyOffset start of the `templateKey`
     * @param absoluteValueOffset start of the `templateValue`
     */
    parseTemplateBindings(templateKey, templateValue, templateUrl, absoluteKeyOffset, absoluteValueOffset) {
        const tokens = this._lexer.tokenize(templateValue);
        const parser = new _ParseAST(templateValue, templateUrl, absoluteValueOffset, tokens, 0 /* None */, this.errors, 0 /* relative offset */);
        return parser.parseTemplateBindings({
            source: templateKey,
            span: new AbsoluteSourceSpan(absoluteKeyOffset, absoluteKeyOffset + templateKey.length),
        });
    }
    parseInterpolation(input, location, absoluteOffset, interpolatedTokens, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const { strings, expressions, offsets } = this.splitInterpolation(input, location, interpolatedTokens, interpolationConfig);
        if (expressions.length === 0)
            return null;
        const expressionNodes = [];
        for (let i = 0; i < expressions.length; ++i) {
            const expressionText = expressions[i].text;
            const sourceToLex = this._stripComments(expressionText);
            const tokens = this._lexer.tokenize(sourceToLex);
            const ast = new _ParseAST(input, location, absoluteOffset, tokens, 0 /* None */, this.errors, offsets[i])
                .parseChain();
            expressionNodes.push(ast);
        }
        return this.createInterpolationAst(strings.map(s => s.text), expressionNodes, input, location, absoluteOffset);
    }
    /**
     * Similar to `parseInterpolation`, but treats the provided string as a single expression
     * element that would normally appear within the interpolation prefix and suffix (`{{` and `}}`).
     * This is used for parsing the switch expression in ICUs.
     */
    parseInterpolationExpression(expression, location, absoluteOffset) {
        const sourceToLex = this._stripComments(expression);
        const tokens = this._lexer.tokenize(sourceToLex);
        const ast = new _ParseAST(expression, location, absoluteOffset, tokens, 0 /* None */, this.errors, 0)
            .parseChain();
        const strings = ['', '']; // The prefix and suffix strings are both empty
        return this.createInterpolationAst(strings, [ast], expression, location, absoluteOffset);
    }
    createInterpolationAst(strings, expressions, input, location, absoluteOffset) {
        const span = new ParseSpan(0, input.length);
        const interpolation = new Interpolation(span, span.toAbsolute(absoluteOffset), strings, expressions);
        return new ASTWithSource(interpolation, input, location, absoluteOffset, this.errors);
    }
    /**
     * Splits a string of text into "raw" text segments and expressions present in interpolations in
     * the string.
     * Returns `null` if there are no interpolations, otherwise a
     * `SplitInterpolation` with splits that look like
     *   <raw text> <expression> <raw text> ... <raw text> <expression> <raw text>
     */
    splitInterpolation(input, location, interpolatedTokens, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const strings = [];
        const expressions = [];
        const offsets = [];
        const inputToTemplateIndexMap = interpolatedTokens ? getIndexMapForOriginalTemplate(interpolatedTokens) : null;
        let i = 0;
        let atInterpolation = false;
        let extendLastString = false;
        let { start: interpStart, end: interpEnd } = interpolationConfig;
        while (i < input.length) {
            if (!atInterpolation) {
                // parse until starting {{
                const start = i;
                i = input.indexOf(interpStart, i);
                if (i === -1) {
                    i = input.length;
                }
                const text = input.substring(start, i);
                strings.push({ text, start, end: i });
                atInterpolation = true;
            }
            else {
                // parse from starting {{ to ending }} while ignoring content inside quotes.
                const fullStart = i;
                const exprStart = fullStart + interpStart.length;
                const exprEnd = this._getInterpolationEndIndex(input, interpEnd, exprStart);
                if (exprEnd === -1) {
                    // Could not find the end of the interpolation; do not parse an expression.
                    // Instead we should extend the content on the last raw string.
                    atInterpolation = false;
                    extendLastString = true;
                    break;
                }
                const fullEnd = exprEnd + interpEnd.length;
                const text = input.substring(exprStart, exprEnd);
                if (text.trim().length === 0) {
                    this._reportError('Blank expressions are not allowed in interpolated strings', input, `at column ${i} in`, location);
                }
                expressions.push({ text, start: fullStart, end: fullEnd });
                const startInOriginalTemplate = inputToTemplateIndexMap?.get(fullStart) ?? fullStart;
                const offset = startInOriginalTemplate + interpStart.length;
                offsets.push(offset);
                i = fullEnd;
                atInterpolation = false;
            }
        }
        if (!atInterpolation) {
            // If we are now at a text section, add the remaining content as a raw string.
            if (extendLastString) {
                const piece = strings[strings.length - 1];
                piece.text += input.substring(i);
                piece.end = input.length;
            }
            else {
                strings.push({ text: input.substring(i), start: i, end: input.length });
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    }
    wrapLiteralPrimitive(input, location, absoluteOffset) {
        const span = new ParseSpan(0, input == null ? 0 : input.length);
        return new ASTWithSource(new LiteralPrimitive(span, span.toAbsolute(absoluteOffset), input), input, location, absoluteOffset, this.errors);
    }
    _stripComments(input) {
        const i = this._commentStart(input);
        return i != null ? input.substring(0, i) : input;
    }
    _commentStart(input) {
        let outerQuote = null;
        for (let i = 0; i < input.length - 1; i++) {
            const char = input.charCodeAt(i);
            const nextChar = input.charCodeAt(i + 1);
            if (char === $SLASH && nextChar == $SLASH && outerQuote == null)
                return i;
            if (outerQuote === char) {
                outerQuote = null;
            }
            else if (outerQuote == null && isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    }
    _checkNoInterpolation(input, location, { start, end }) {
        let startIndex = -1;
        let endIndex = -1;
        for (const charIndex of this._forEachUnquotedChar(input, 0)) {
            if (startIndex === -1) {
                if (input.startsWith(start)) {
                    startIndex = charIndex;
                }
            }
            else {
                endIndex = this._getInterpolationEndIndex(input, end, charIndex);
                if (endIndex > -1) {
                    break;
                }
            }
        }
        if (startIndex > -1 && endIndex > -1) {
            this._reportError(`Got interpolation (${start}${end}) where expression was expected`, input, `at column ${startIndex} in`, location);
        }
    }
    /**
     * Finds the index of the end of an interpolation expression
     * while ignoring comments and quoted content.
     */
    _getInterpolationEndIndex(input, expressionEnd, start) {
        for (const charIndex of this._forEachUnquotedChar(input, start)) {
            if (input.startsWith(expressionEnd, charIndex)) {
                return charIndex;
            }
            // Nothing else in the expression matters after we've
            // hit a comment so look directly for the end token.
            if (input.startsWith('//', charIndex)) {
                return input.indexOf(expressionEnd, charIndex);
            }
        }
        return -1;
    }
    /**
     * Generator used to iterate over the character indexes of a string that are outside of quotes.
     * @param input String to loop through.
     * @param start Index within the string at which to start.
     */
    *_forEachUnquotedChar(input, start) {
        let currentQuote = null;
        let escapeCount = 0;
        for (let i = start; i < input.length; i++) {
            const char = input[i];
            // Skip the characters inside quotes. Note that we only care about the outer-most
            // quotes matching up and we need to account for escape characters.
            if (isQuote(input.charCodeAt(i)) && (currentQuote === null || currentQuote === char) &&
                escapeCount % 2 === 0) {
                currentQuote = currentQuote === null ? char : null;
            }
            else if (currentQuote === null) {
                yield i;
            }
            escapeCount = char === '\\' ? escapeCount + 1 : 0;
        }
    }
}
/** Describes a stateful context an expression parser is in. */
var ParseContextFlags;
(function (ParseContextFlags) {
    ParseContextFlags[ParseContextFlags["None"] = 0] = "None";
    /**
     * A Writable context is one in which a value may be written to an lvalue.
     * For example, after we see a property access, we may expect a write to the
     * property via the "=" operator.
     *   prop
     *        ^ possible "=" after
     */
    ParseContextFlags[ParseContextFlags["Writable"] = 1] = "Writable";
})(ParseContextFlags || (ParseContextFlags = {}));
class _ParseAST {
    constructor(input, location, absoluteOffset, tokens, parseFlags, errors, offset) {
        this.input = input;
        this.location = location;
        this.absoluteOffset = absoluteOffset;
        this.tokens = tokens;
        this.parseFlags = parseFlags;
        this.errors = errors;
        this.offset = offset;
        this.rparensExpected = 0;
        this.rbracketsExpected = 0;
        this.rbracesExpected = 0;
        this.context = ParseContextFlags.None;
        // Cache of expression start and input indeces to the absolute source span they map to, used to
        // prevent creating superfluous source spans in `sourceSpan`.
        // A serial of the expression start and input index is used for mapping because both are stateful
        // and may change for subsequent expressions visited by the parser.
        this.sourceSpanCache = new Map();
        this.index = 0;
    }
    peek(offset) {
        const i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    }
    get next() {
        return this.peek(0);
    }
    /** Whether all the parser input has been processed. */
    get atEOF() {
        return this.index >= this.tokens.length;
    }
    /**
     * Index of the next token to be processed, or the end of the last token if all have been
     * processed.
     */
    get inputIndex() {
        return this.atEOF ? this.currentEndIndex : this.next.index + this.offset;
    }
    /**
     * End index of the last processed token, or the start of the first token if none have been
     * processed.
     */
    get currentEndIndex() {
        if (this.index > 0) {
            const curToken = this.peek(-1);
            return curToken.end + this.offset;
        }
        // No tokens have been processed yet; return the next token's start or the length of the input
        // if there is no token.
        if (this.tokens.length === 0) {
            return this.input.length + this.offset;
        }
        return this.next.index + this.offset;
    }
    /**
     * Returns the absolute offset of the start of the current token.
     */
    get currentAbsoluteOffset() {
        return this.absoluteOffset + this.inputIndex;
    }
    /**
     * Retrieve a `ParseSpan` from `start` to the current position (or to `artificialEndIndex` if
     * provided).
     *
     * @param start Position from which the `ParseSpan` will start.
     * @param artificialEndIndex Optional ending index to be used if provided (and if greater than the
     *     natural ending index)
     */
    span(start, artificialEndIndex) {
        let endIndex = this.currentEndIndex;
        if (artificialEndIndex !== undefined && artificialEndIndex > this.currentEndIndex) {
            endIndex = artificialEndIndex;
        }
        // In some unusual parsing scenarios (like when certain tokens are missing and an `EmptyExpr` is
        // being created), the current token may already be advanced beyond the `currentEndIndex`. This
        // appears to be a deep-seated parser bug.
        //
        // As a workaround for now, swap the start and end indices to ensure a valid `ParseSpan`.
        // TODO(alxhub): fix the bug upstream in the parser state, and remove this workaround.
        if (start > endIndex) {
            const tmp = endIndex;
            endIndex = start;
            start = tmp;
        }
        return new ParseSpan(start, endIndex);
    }
    sourceSpan(start, artificialEndIndex) {
        const serial = `${start}@${this.inputIndex}:${artificialEndIndex}`;
        if (!this.sourceSpanCache.has(serial)) {
            this.sourceSpanCache.set(serial, this.span(start, artificialEndIndex).toAbsolute(this.absoluteOffset));
        }
        return this.sourceSpanCache.get(serial);
    }
    advance() {
        this.index++;
    }
    /**
     * Executes a callback in the provided context.
     */
    withContext(context, cb) {
        this.context |= context;
        const ret = cb();
        this.context ^= context;
        return ret;
    }
    consumeOptionalCharacter(code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    peekKeywordLet() {
        return this.next.isKeywordLet();
    }
    peekKeywordAs() {
        return this.next.isKeywordAs();
    }
    /**
     * Consumes an expected character, otherwise emits an error about the missing expected character
     * and skips over the token stream until reaching a recoverable point.
     *
     * See `this.error` and `this.skip` for more details.
     */
    expectCharacter(code) {
        if (this.consumeOptionalCharacter(code))
            return;
        this.error(`Missing expected ${String.fromCharCode(code)}`);
    }
    consumeOptionalOperator(op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    expectOperator(operator) {
        if (this.consumeOptionalOperator(operator))
            return;
        this.error(`Missing expected operator ${operator}`);
    }
    prettyPrintToken(tok) {
        return tok === EOF ? 'end of input' : `token ${tok}`;
    }
    expectIdentifierOrKeyword() {
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            if (n.isPrivateIdentifier()) {
                this._reportErrorForPrivateIdentifier(n, 'expected identifier or keyword');
            }
            else {
                this.error(`Unexpected ${this.prettyPrintToken(n)}, expected identifier or keyword`);
            }
            return null;
        }
        this.advance();
        return n.toString();
    }
    expectIdentifierOrKeywordOrString() {
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            if (n.isPrivateIdentifier()) {
                this._reportErrorForPrivateIdentifier(n, 'expected identifier, keyword or string');
            }
            else {
                this.error(`Unexpected ${this.prettyPrintToken(n)}, expected identifier, keyword, or string`);
            }
            return '';
        }
        this.advance();
        return n.toString();
    }
    parseChain() {
        const exprs = [];
        const start = this.inputIndex;
        while (this.index < this.tokens.length) {
            const expr = this.parsePipe();
            exprs.push(expr);
            if (this.consumeOptionalCharacter($SEMICOLON)) {
                if (!(this.parseFlags & 1 /* Action */)) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.consumeOptionalCharacter($SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error(`Unexpected token '${this.next}'`);
            }
        }
        if (exprs.length == 0) {
            // We have no expressions so create an empty expression that spans the entire input length
            const artificialStart = this.offset;
            const artificialEnd = this.offset + this.input.length;
            return new EmptyExpr(this.span(artificialStart, artificialEnd), this.sourceSpan(artificialStart, artificialEnd));
        }
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), this.sourceSpan(start), exprs);
    }
    parsePipe() {
        const start = this.inputIndex;
        let result = this.parseExpression();
        if (this.consumeOptionalOperator('|')) {
            if (this.parseFlags & 1 /* Action */) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                const nameStart = this.inputIndex;
                let nameId = this.expectIdentifierOrKeyword();
                let nameSpan;
                let fullSpanEnd = undefined;
                if (nameId !== null) {
                    nameSpan = this.sourceSpan(nameStart);
                }
                else {
                    // No valid identifier was found, so we'll assume an empty pipe name ('').
                    nameId = '';
                    // However, there may have been whitespace present between the pipe character and the next
                    // token in the sequence (or the end of input). We want to track this whitespace so that
                    // the `BindingPipe` we produce covers not just the pipe character, but any trailing
                    // whitespace beyond it. Another way of thinking about this is that the zero-length name
                    // is assumed to be at the end of any whitespace beyond the pipe character.
                    //
                    // Therefore, we push the end of the `ParseSpan` for this pipe all the way up to the
                    // beginning of the next token, or until the end of input if the next token is EOF.
                    fullSpanEnd = this.next.index !== -1 ? this.next.index : this.input.length + this.offset;
                    // The `nameSpan` for an empty pipe name is zero-length at the end of any whitespace
                    // beyond the pipe character.
                    nameSpan = new ParseSpan(fullSpanEnd, fullSpanEnd).toAbsolute(this.absoluteOffset);
                }
                const args = [];
                while (this.consumeOptionalCharacter($COLON)) {
                    args.push(this.parseExpression());
                    // If there are additional expressions beyond the name, then the artificial end for the
                    // name is no longer relevant.
                }
                result = new BindingPipe(this.span(start), this.sourceSpan(start, fullSpanEnd), result, nameId, args, nameSpan);
            } while (this.consumeOptionalOperator('|'));
        }
        return result;
    }
    parseExpression() {
        return this.parseConditional();
    }
    parseConditional() {
        const start = this.inputIndex;
        const result = this.parseLogicalOr();
        if (this.consumeOptionalOperator('?')) {
            const yes = this.parsePipe();
            let no;
            if (!this.consumeOptionalCharacter($COLON)) {
                const end = this.inputIndex;
                const expression = this.input.substring(start, end);
                this.error(`Conditional expression ${expression} requires all 3 expressions`);
                no = new EmptyExpr(this.span(start), this.sourceSpan(start));
            }
            else {
                no = this.parsePipe();
            }
            return new Conditional(this.span(start), this.sourceSpan(start), result, yes, no);
        }
        else {
            return result;
        }
    }
    parseLogicalOr() {
        // '||'
        const start = this.inputIndex;
        let result = this.parseLogicalAnd();
        while (this.consumeOptionalOperator('||')) {
            const right = this.parseLogicalAnd();
            result = new Binary(this.span(start), this.sourceSpan(start), '||', result, right);
        }
        return result;
    }
    parseLogicalAnd() {
        // '&&'
        const start = this.inputIndex;
        let result = this.parseNullishCoalescing();
        while (this.consumeOptionalOperator('&&')) {
            const right = this.parseNullishCoalescing();
            result = new Binary(this.span(start), this.sourceSpan(start), '&&', result, right);
        }
        return result;
    }
    parseNullishCoalescing() {
        // '??'
        const start = this.inputIndex;
        let result = this.parseEquality();
        while (this.consumeOptionalOperator('??')) {
            const right = this.parseEquality();
            result = new Binary(this.span(start), this.sourceSpan(start), '??', result, right);
        }
        return result;
    }
    parseEquality() {
        // '==','!=','===','!=='
        const start = this.inputIndex;
        let result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    const right = this.parseRelational();
                    result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    parseRelational() {
        // '<', '>', '<=', '>='
        const start = this.inputIndex;
        let result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    const right = this.parseAdditive();
                    result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    parseAdditive() {
        // '+', '-'
        const start = this.inputIndex;
        let result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    let right = this.parseMultiplicative();
                    result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    parseMultiplicative() {
        // '*', '%', '/'
        const start = this.inputIndex;
        let result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    let right = this.parsePrefix();
                    result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    parsePrefix() {
        if (this.next.type == TokenType.Operator) {
            const start = this.inputIndex;
            const operator = this.next.strValue;
            let result;
            switch (operator) {
                case '+':
                    this.advance();
                    result = this.parsePrefix();
                    return Unary.createPlus(this.span(start), this.sourceSpan(start), result);
                case '-':
                    this.advance();
                    result = this.parsePrefix();
                    return Unary.createMinus(this.span(start), this.sourceSpan(start), result);
                case '!':
                    this.advance();
                    result = this.parsePrefix();
                    return new PrefixNot(this.span(start), this.sourceSpan(start), result);
            }
        }
        return this.parseCallChain();
    }
    parseCallChain() {
        const start = this.inputIndex;
        let result = this.parsePrimary();
        while (true) {
            if (this.consumeOptionalCharacter($PERIOD)) {
                result = this.parseAccessMember(result, start, false);
            }
            else if (this.consumeOptionalOperator('?.')) {
                if (this.consumeOptionalCharacter($LPAREN)) {
                    result = this.parseCall(result, start, true);
                }
                else {
                    result = this.consumeOptionalCharacter($LBRACKET) ?
                        this.parseKeyedReadOrWrite(result, start, true) :
                        this.parseAccessMember(result, start, true);
                }
            }
            else if (this.consumeOptionalCharacter($LBRACKET)) {
                result = this.parseKeyedReadOrWrite(result, start, false);
            }
            else if (this.consumeOptionalCharacter($LPAREN)) {
                result = this.parseCall(result, start, false);
            }
            else if (this.consumeOptionalOperator('!')) {
                result = new NonNullAssert(this.span(start), this.sourceSpan(start), result);
            }
            else {
                return result;
            }
        }
    }
    parsePrimary() {
        const start = this.inputIndex;
        if (this.consumeOptionalCharacter($LPAREN)) {
            this.rparensExpected++;
            const result = this.parsePipe();
            this.rparensExpected--;
            this.expectCharacter($RPAREN);
            return result;
        }
        else if (this.next.isKeywordNull()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), null);
        }
        else if (this.next.isKeywordUndefined()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), void 0);
        }
        else if (this.next.isKeywordTrue()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), true);
        }
        else if (this.next.isKeywordFalse()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), false);
        }
        else if (this.next.isKeywordThis()) {
            this.advance();
            return new ThisReceiver(this.span(start), this.sourceSpan(start));
        }
        else if (this.consumeOptionalCharacter($LBRACKET)) {
            this.rbracketsExpected++;
            const elements = this.parseExpressionList($RBRACKET);
            this.rbracketsExpected--;
            this.expectCharacter($RBRACKET);
            return new LiteralArray(this.span(start), this.sourceSpan(start), elements);
        }
        else if (this.next.isCharacter($LBRACE)) {
            return this.parseLiteralMap();
        }
        else if (this.next.isIdentifier()) {
            return this.parseAccessMember(new ImplicitReceiver(this.span(start), this.sourceSpan(start)), start, false);
        }
        else if (this.next.isNumber()) {
            const value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), value);
        }
        else if (this.next.isString()) {
            const literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), this.sourceSpan(start), literalValue);
        }
        else if (this.next.isPrivateIdentifier()) {
            this._reportErrorForPrivateIdentifier(this.next, null);
            return new EmptyExpr(this.span(start), this.sourceSpan(start));
        }
        else if (this.index >= this.tokens.length) {
            this.error(`Unexpected end of expression: ${this.input}`);
            return new EmptyExpr(this.span(start), this.sourceSpan(start));
        }
        else {
            this.error(`Unexpected token ${this.next}`);
            return new EmptyExpr(this.span(start), this.sourceSpan(start));
        }
    }
    parseExpressionList(terminator) {
        const result = [];
        do {
            if (!this.next.isCharacter(terminator)) {
                result.push(this.parsePipe());
            }
            else {
                break;
            }
        } while (this.consumeOptionalCharacter($COMMA));
        return result;
    }
    parseLiteralMap() {
        const keys = [];
        const values = [];
        const start = this.inputIndex;
        this.expectCharacter($LBRACE);
        if (!this.consumeOptionalCharacter($RBRACE)) {
            this.rbracesExpected++;
            do {
                const keyStart = this.inputIndex;
                const quoted = this.next.isString();
                const key = this.expectIdentifierOrKeywordOrString();
                keys.push({ key, quoted });
                // Properties with quoted keys can't use the shorthand syntax.
                if (quoted) {
                    this.expectCharacter($COLON);
                    values.push(this.parsePipe());
                }
                else if (this.consumeOptionalCharacter($COLON)) {
                    values.push(this.parsePipe());
                }
                else {
                    const span = this.span(keyStart);
                    const sourceSpan = this.sourceSpan(keyStart);
                    values.push(new PropertyRead(span, sourceSpan, sourceSpan, new ImplicitReceiver(span, sourceSpan), key));
                }
            } while (this.consumeOptionalCharacter($COMMA));
            this.rbracesExpected--;
            this.expectCharacter($RBRACE);
        }
        return new LiteralMap(this.span(start), this.sourceSpan(start), keys, values);
    }
    parseAccessMember(readReceiver, start, isSafe) {
        const nameStart = this.inputIndex;
        const id = this.withContext(ParseContextFlags.Writable, () => {
            const id = this.expectIdentifierOrKeyword() ?? '';
            if (id.length === 0) {
                this.error(`Expected identifier for property access`, readReceiver.span.end);
            }
            return id;
        });
        const nameSpan = this.sourceSpan(nameStart);
        let receiver;
        if (isSafe) {
            if (this.consumeOptionalAssignment()) {
                this.error('The \'?.\' operator cannot be used in the assignment');
                receiver = new EmptyExpr(this.span(start), this.sourceSpan(start));
            }
            else {
                receiver = new SafePropertyRead(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id);
            }
        }
        else {
            if (this.consumeOptionalAssignment()) {
                if (!(this.parseFlags & 1 /* Action */)) {
                    this.error('Bindings cannot contain assignments');
                    return new EmptyExpr(this.span(start), this.sourceSpan(start));
                }
                const value = this.parseConditional();
                receiver = new PropertyWrite(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id, value);
            }
            else {
                receiver =
                    new PropertyRead(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id);
            }
        }
        return receiver;
    }
    parseCall(receiver, start, isSafe) {
        const argumentStart = this.inputIndex;
        this.rparensExpected++;
        const args = this.parseCallArguments();
        const argumentSpan = this.span(argumentStart, this.inputIndex).toAbsolute(this.absoluteOffset);
        this.expectCharacter($RPAREN);
        this.rparensExpected--;
        const span = this.span(start);
        const sourceSpan = this.sourceSpan(start);
        return isSafe ? new SafeCall(span, sourceSpan, receiver, args, argumentSpan) :
            new Call(span, sourceSpan, receiver, args, argumentSpan);
    }
    consumeOptionalAssignment() {
        // When parsing assignment events (originating from two-way-binding aka banana-in-a-box syntax),
        // it is valid for the primary expression to be terminated by the non-null operator. This
        // primary expression is substituted as LHS of the assignment operator to achieve
        // two-way-binding, such that the LHS could be the non-null operator. The grammar doesn't
        // naturally allow for this syntax, so assignment events are parsed specially.
        if ((this.parseFlags & 2 /* AssignmentEvent */) && this.next.isOperator('!') &&
            this.peek(1).isOperator('=')) {
            // First skip over the ! operator.
            this.advance();
            // Then skip over the = operator, to fully consume the optional assignment operator.
            this.advance();
            return true;
        }
        return this.consumeOptionalOperator('=');
    }
    parseCallArguments() {
        if (this.next.isCharacter($RPAREN))
            return [];
        const positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.consumeOptionalCharacter($COMMA));
        return positionals;
    }
    /**
     * Parses an identifier, a keyword, a string with an optional `-` in between,
     * and returns the string along with its absolute source span.
     */
    expectTemplateBindingKey() {
        let result = '';
        let operatorFound = false;
        const start = this.currentAbsoluteOffset;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.consumeOptionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return {
            source: result,
            span: new AbsoluteSourceSpan(start, start + result.length),
        };
    }
    /**
     * Parse microsyntax template expression and return a list of bindings or
     * parsing errors in case the given expression is invalid.
     *
     * For example,
     * ```
     *   <div *ngFor="let item of items; index as i; trackBy: func">
     * ```
     * contains five bindings:
     * 1. ngFor -> null
     * 2. item -> NgForOfContext.$implicit
     * 3. ngForOf -> items
     * 4. i -> NgForOfContext.index
     * 5. ngForTrackBy -> func
     *
     * For a full description of the microsyntax grammar, see
     * https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855
     *
     * @param templateKey name of the microsyntax directive, like ngIf, ngFor,
     * without the *, along with its absolute span.
     */
    parseTemplateBindings(templateKey) {
        const bindings = [];
        // The first binding is for the template key itself
        // In *ngFor="let item of items", key = "ngFor", value = null
        // In *ngIf="cond | pipe", key = "ngIf", value = "cond | pipe"
        bindings.push(...this.parseDirectiveKeywordBindings(templateKey));
        while (this.index < this.tokens.length) {
            // If it starts with 'let', then this must be variable declaration
            const letBinding = this.parseLetBinding();
            if (letBinding) {
                bindings.push(letBinding);
            }
            else {
                // Two possible cases here, either `value "as" key` or
                // "directive-keyword expression". We don't know which case, but both
                // "value" and "directive-keyword" are template binding key, so consume
                // the key first.
                const key = this.expectTemplateBindingKey();
                // Peek at the next token, if it is "as" then this must be variable
                // declaration.
                const binding = this.parseAsBinding(key);
                if (binding) {
                    bindings.push(binding);
                }
                else {
                    // Otherwise the key must be a directive keyword, like "of". Transform
                    // the key to actual key. Eg. of -> ngForOf, trackBy -> ngForTrackBy
                    key.source =
                        templateKey.source + key.source.charAt(0).toUpperCase() + key.source.substring(1);
                    bindings.push(...this.parseDirectiveKeywordBindings(key));
                }
            }
            this.consumeStatementTerminator();
        }
        return new TemplateBindingParseResult(bindings, [] /* warnings */, this.errors);
    }
    parseKeyedReadOrWrite(receiver, start, isSafe) {
        return this.withContext(ParseContextFlags.Writable, () => {
            this.rbracketsExpected++;
            const key = this.parsePipe();
            if (key instanceof EmptyExpr) {
                this.error(`Key access cannot be empty`);
            }
            this.rbracketsExpected--;
            this.expectCharacter($RBRACKET);
            if (this.consumeOptionalOperator('=')) {
                if (isSafe) {
                    this.error('The \'?.\' operator cannot be used in the assignment');
                }
                else {
                    const value = this.parseConditional();
                    return new KeyedWrite(this.span(start), this.sourceSpan(start), receiver, key, value);
                }
            }
            else {
                return isSafe ? new SafeKeyedRead(this.span(start), this.sourceSpan(start), receiver, key) :
                    new KeyedRead(this.span(start), this.sourceSpan(start), receiver, key);
            }
            return new EmptyExpr(this.span(start), this.sourceSpan(start));
        });
    }
    /**
     * Parse a directive keyword, followed by a mandatory expression.
     * For example, "of items", "trackBy: func".
     * The bindings are: ngForOf -> items, ngForTrackBy -> func
     * There could be an optional "as" binding that follows the expression.
     * For example,
     * ```
     *   *ngFor="let item of items | slice:0:1 as collection".
     *                    ^^ ^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^
     *               keyword    bound target   optional 'as' binding
     * ```
     *
     * @param key binding key, for example, ngFor, ngIf, ngForOf, along with its
     * absolute span.
     */
    parseDirectiveKeywordBindings(key) {
        const bindings = [];
        this.consumeOptionalCharacter($COLON); // trackBy: trackByFunction
        const value = this.getDirectiveBoundTarget();
        let spanEnd = this.currentAbsoluteOffset;
        // The binding could optionally be followed by "as". For example,
        // *ngIf="cond | pipe as x". In this case, the key in the "as" binding
        // is "x" and the value is the template key itself ("ngIf"). Note that the
        // 'key' in the current context now becomes the "value" in the next binding.
        const asBinding = this.parseAsBinding(key);
        if (!asBinding) {
            this.consumeStatementTerminator();
            spanEnd = this.currentAbsoluteOffset;
        }
        const sourceSpan = new AbsoluteSourceSpan(key.span.start, spanEnd);
        bindings.push(new ExpressionBinding(sourceSpan, key, value));
        if (asBinding) {
            bindings.push(asBinding);
        }
        return bindings;
    }
    /**
     * Return the expression AST for the bound target of a directive keyword
     * binding. For example,
     * ```
     *   *ngIf="condition | pipe"
     *          ^^^^^^^^^^^^^^^^ bound target for "ngIf"
     *   *ngFor="let item of items"
     *                       ^^^^^ bound target for "ngForOf"
     * ```
     */
    getDirectiveBoundTarget() {
        if (this.next === EOF || this.peekKeywordAs() || this.peekKeywordLet()) {
            return null;
        }
        const ast = this.parsePipe(); // example: "condition | async"
        const { start, end } = ast.span;
        const value = this.input.substring(start, end);
        return new ASTWithSource(ast, value, this.location, this.absoluteOffset + start, this.errors);
    }
    /**
     * Return the binding for a variable declared using `as`. Note that the order
     * of the key-value pair in this declaration is reversed. For example,
     * ```
     *   *ngFor="let item of items; index as i"
     *                              ^^^^^    ^
     *                              value    key
     * ```
     *
     * @param value name of the value in the declaration, "ngIf" in the example
     * above, along with its absolute span.
     */
    parseAsBinding(value) {
        if (!this.peekKeywordAs()) {
            return null;
        }
        this.advance(); // consume the 'as' keyword
        const key = this.expectTemplateBindingKey();
        this.consumeStatementTerminator();
        const sourceSpan = new AbsoluteSourceSpan(value.span.start, this.currentAbsoluteOffset);
        return new VariableBinding(sourceSpan, key, value);
    }
    /**
     * Return the binding for a variable declared using `let`. For example,
     * ```
     *   *ngFor="let item of items; let i=index;"
     *           ^^^^^^^^           ^^^^^^^^^^^
     * ```
     * In the first binding, `item` is bound to `NgForOfContext.$implicit`.
     * In the second binding, `i` is bound to `NgForOfContext.index`.
     */
    parseLetBinding() {
        if (!this.peekKeywordLet()) {
            return null;
        }
        const spanStart = this.currentAbsoluteOffset;
        this.advance(); // consume the 'let' keyword
        const key = this.expectTemplateBindingKey();
        let value = null;
        if (this.consumeOptionalOperator('=')) {
            value = this.expectTemplateBindingKey();
        }
        this.consumeStatementTerminator();
        const sourceSpan = new AbsoluteSourceSpan(spanStart, this.currentAbsoluteOffset);
        return new VariableBinding(sourceSpan, key, value);
    }
    /**
     * Consume the optional statement terminator: semicolon or comma.
     */
    consumeStatementTerminator() {
        this.consumeOptionalCharacter($SEMICOLON) || this.consumeOptionalCharacter($COMMA);
    }
    /**
     * Records an error and skips over the token stream until reaching a recoverable point. See
     * `this.skip` for more details on token skipping.
     */
    error(message, index = null) {
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    }
    locationText(index = null) {
        if (index == null)
            index = this.index;
        return (index < this.tokens.length) ? `at column ${this.tokens[index].index + 1} in` :
            `at the end of the expression`;
    }
    /**
     * Records an error for an unexpected private identifier being discovered.
     * @param token Token representing a private identifier.
     * @param extraMessage Optional additional message being appended to the error.
     */
    _reportErrorForPrivateIdentifier(token, extraMessage) {
        let errorMessage = `Private identifiers are not supported. Unexpected private identifier: ${token}`;
        if (extraMessage !== null) {
            errorMessage += `, ${extraMessage}`;
        }
        this.error(errorMessage);
    }
    /**
     * Error recovery should skip tokens until it encounters a recovery point.
     *
     * The following are treated as unconditional recovery points:
     *   - end of input
     *   - ';' (parseChain() is always the root production, and it expects a ';')
     *   - '|' (since pipes may be chained and each pipe expression may be treated independently)
     *
     * The following are conditional recovery points:
     *   - ')', '}', ']' if one of calling productions is expecting one of these symbols
     *     - This allows skip() to recover from errors such as '(a.) + 1' allowing more of the AST to
     *       be retained (it doesn't skip any tokens as the ')' is retained because of the '(' begins
     *       an '(' <expr> ')' production).
     *       The recovery points of grouping symbols must be conditional as they must be skipped if
     *       none of the calling productions are not expecting the closing token else we will never
     *       make progress in the case of an extraneous group closing symbol (such as a stray ')').
     *       That is, we skip a closing symbol if we are not in a grouping production.
     *   - '=' in a `Writable` context
     *     - In this context, we are able to recover after seeing the `=` operator, which
     *       signals the presence of an independent rvalue expression following the `=` operator.
     *
     * If a production expects one of these token it increments the corresponding nesting count,
     * and then decrements it just prior to checking if the token is in the input.
     */
    skip() {
        let n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter($SEMICOLON) &&
            !n.isOperator('|') && (this.rparensExpected <= 0 || !n.isCharacter($RPAREN)) &&
            (this.rbracesExpected <= 0 || !n.isCharacter($RBRACE)) &&
            (this.rbracketsExpected <= 0 || !n.isCharacter($RBRACKET)) &&
            (!(this.context & ParseContextFlags.Writable) || !n.isOperator('='))) {
            if (this.next.isError()) {
                this.errors.push(new ParserError(this.next.toString(), this.input, this.locationText(), this.location));
            }
            this.advance();
            n = this.next;
        }
    }
}
class SimpleExpressionChecker extends RecursiveAstVisitor {
    constructor() {
        super(...arguments);
        this.errors = [];
    }
    visitPipe() {
        this.errors.push('pipes');
    }
}
/**
 * Computes the real offset in the original template for indexes in an interpolation.
 *
 * Because templates can have encoded HTML entities and the input passed to the parser at this stage
 * of the compiler is the _decoded_ value, we need to compute the real offset using the original
 * encoded values in the interpolated tokens. Note that this is only a special case handling for
 * `MlParserTokenType.ENCODED_ENTITY` token types. All other interpolated tokens are expected to
 * have parts which exactly match the input string for parsing the interpolation.
 *
 * @param interpolatedTokens The tokens for the interpolated value.
 *
 * @returns A map of index locations in the decoded template to indexes in the original template
 */
function getIndexMapForOriginalTemplate(interpolatedTokens) {
    let offsetMap = new Map();
    let consumedInOriginalTemplate = 0;
    let consumedInInput = 0;
    let tokenIndex = 0;
    while (tokenIndex < interpolatedTokens.length) {
        const currentToken = interpolatedTokens[tokenIndex];
        if (currentToken.type === 9 /* ENCODED_ENTITY */) {
            const [decoded, encoded] = currentToken.parts;
            consumedInOriginalTemplate += encoded.length;
            consumedInInput += decoded.length;
        }
        else {
            const lengthOfParts = currentToken.parts.reduce((sum, current) => sum + current.length, 0);
            consumedInInput += lengthOfParts;
            consumedInOriginalTemplate += lengthOfParts;
        }
        offsetMap.set(consumedInInput, consumedInOriginalTemplate);
        tokenIndex++;
    }
    return offsetMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class NodeWithI18n {
    constructor(sourceSpan, i18n) {
        this.sourceSpan = sourceSpan;
        this.i18n = i18n;
    }
}
class Text extends NodeWithI18n {
    constructor(value, sourceSpan, tokens, i18n) {
        super(sourceSpan, i18n);
        this.value = value;
        this.tokens = tokens;
    }
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
class Expansion extends NodeWithI18n {
    constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan, i18n) {
        super(sourceSpan, i18n);
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitExpansion(this, context);
    }
}
class ExpansionCase {
    constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitExpansionCase(this, context);
    }
}
class Attribute extends NodeWithI18n {
    constructor(name, value, sourceSpan, keySpan, valueSpan, valueTokens, i18n) {
        super(sourceSpan, i18n);
        this.name = name;
        this.value = value;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
        this.valueTokens = valueTokens;
    }
    visit(visitor, context) {
        return visitor.visitAttribute(this, context);
    }
}
class Element extends NodeWithI18n {
    constructor(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan = null, i18n) {
        super(sourceSpan, i18n);
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitElement(this, context);
    }
}
class Comment {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitComment(this, context);
    }
}
function visitAll(visitor, nodes, context = null) {
    const result = [];
    const visit = visitor.visit ?
        (ast) => visitor.visit(ast, context) || ast.visit(visitor, context) :
        (ast) => ast.visit(visitor, context);
    nodes.forEach(ast => {
        const astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
class RecursiveVisitor {
    constructor() { }
    visitElement(ast, context) {
        this.visitChildren(context, visit => {
            visit(ast.attrs);
            visit(ast.children);
        });
    }
    visitAttribute(ast, context) { }
    visitText(ast, context) { }
    visitComment(ast, context) { }
    visitExpansion(ast, context) {
        return this.visitChildren(context, visit => {
            visit(ast.cases);
        });
    }
    visitExpansionCase(ast, context) { }
    visitChildren(context, cb) {
        let results = [];
        let t = this;
        function visit(children) {
            if (children)
                results.push(visitAll(t, children, context));
        }
        cb(visit);
        return Array.prototype.concat.apply([], results);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Mapping between all HTML entity names and their unicode representation.
// Generated from https://html.spec.whatwg.org/multipage/entities.json by stripping
// the `&` and `;` from the keys and removing the duplicates.
// see https://www.w3.org/TR/html51/syntax.html#named-character-references
const NAMED_ENTITIES = {
    'AElig': '\u00C6',
    'AMP': '\u0026',
    'amp': '\u0026',
    'Aacute': '\u00C1',
    'Abreve': '\u0102',
    'Acirc': '\u00C2',
    'Acy': '\u0410',
    'Afr': '\uD835\uDD04',
    'Agrave': '\u00C0',
    'Alpha': '\u0391',
    'Amacr': '\u0100',
    'And': '\u2A53',
    'Aogon': '\u0104',
    'Aopf': '\uD835\uDD38',
    'ApplyFunction': '\u2061',
    'af': '\u2061',
    'Aring': '\u00C5',
    'angst': '\u00C5',
    'Ascr': '\uD835\uDC9C',
    'Assign': '\u2254',
    'colone': '\u2254',
    'coloneq': '\u2254',
    'Atilde': '\u00C3',
    'Auml': '\u00C4',
    'Backslash': '\u2216',
    'setminus': '\u2216',
    'setmn': '\u2216',
    'smallsetminus': '\u2216',
    'ssetmn': '\u2216',
    'Barv': '\u2AE7',
    'Barwed': '\u2306',
    'doublebarwedge': '\u2306',
    'Bcy': '\u0411',
    'Because': '\u2235',
    'becaus': '\u2235',
    'because': '\u2235',
    'Bernoullis': '\u212C',
    'Bscr': '\u212C',
    'bernou': '\u212C',
    'Beta': '\u0392',
    'Bfr': '\uD835\uDD05',
    'Bopf': '\uD835\uDD39',
    'Breve': '\u02D8',
    'breve': '\u02D8',
    'Bumpeq': '\u224E',
    'HumpDownHump': '\u224E',
    'bump': '\u224E',
    'CHcy': '\u0427',
    'COPY': '\u00A9',
    'copy': '\u00A9',
    'Cacute': '\u0106',
    'Cap': '\u22D2',
    'CapitalDifferentialD': '\u2145',
    'DD': '\u2145',
    'Cayleys': '\u212D',
    'Cfr': '\u212D',
    'Ccaron': '\u010C',
    'Ccedil': '\u00C7',
    'Ccirc': '\u0108',
    'Cconint': '\u2230',
    'Cdot': '\u010A',
    'Cedilla': '\u00B8',
    'cedil': '\u00B8',
    'CenterDot': '\u00B7',
    'centerdot': '\u00B7',
    'middot': '\u00B7',
    'Chi': '\u03A7',
    'CircleDot': '\u2299',
    'odot': '\u2299',
    'CircleMinus': '\u2296',
    'ominus': '\u2296',
    'CirclePlus': '\u2295',
    'oplus': '\u2295',
    'CircleTimes': '\u2297',
    'otimes': '\u2297',
    'ClockwiseContourIntegral': '\u2232',
    'cwconint': '\u2232',
    'CloseCurlyDoubleQuote': '\u201D',
    'rdquo': '\u201D',
    'rdquor': '\u201D',
    'CloseCurlyQuote': '\u2019',
    'rsquo': '\u2019',
    'rsquor': '\u2019',
    'Colon': '\u2237',
    'Proportion': '\u2237',
    'Colone': '\u2A74',
    'Congruent': '\u2261',
    'equiv': '\u2261',
    'Conint': '\u222F',
    'DoubleContourIntegral': '\u222F',
    'ContourIntegral': '\u222E',
    'conint': '\u222E',
    'oint': '\u222E',
    'Copf': '\u2102',
    'complexes': '\u2102',
    'Coproduct': '\u2210',
    'coprod': '\u2210',
    'CounterClockwiseContourIntegral': '\u2233',
    'awconint': '\u2233',
    'Cross': '\u2A2F',
    'Cscr': '\uD835\uDC9E',
    'Cup': '\u22D3',
    'CupCap': '\u224D',
    'asympeq': '\u224D',
    'DDotrahd': '\u2911',
    'DJcy': '\u0402',
    'DScy': '\u0405',
    'DZcy': '\u040F',
    'Dagger': '\u2021',
    'ddagger': '\u2021',
    'Darr': '\u21A1',
    'Dashv': '\u2AE4',
    'DoubleLeftTee': '\u2AE4',
    'Dcaron': '\u010E',
    'Dcy': '\u0414',
    'Del': '\u2207',
    'nabla': '\u2207',
    'Delta': '\u0394',
    'Dfr': '\uD835\uDD07',
    'DiacriticalAcute': '\u00B4',
    'acute': '\u00B4',
    'DiacriticalDot': '\u02D9',
    'dot': '\u02D9',
    'DiacriticalDoubleAcute': '\u02DD',
    'dblac': '\u02DD',
    'DiacriticalGrave': '\u0060',
    'grave': '\u0060',
    'DiacriticalTilde': '\u02DC',
    'tilde': '\u02DC',
    'Diamond': '\u22C4',
    'diam': '\u22C4',
    'diamond': '\u22C4',
    'DifferentialD': '\u2146',
    'dd': '\u2146',
    'Dopf': '\uD835\uDD3B',
    'Dot': '\u00A8',
    'DoubleDot': '\u00A8',
    'die': '\u00A8',
    'uml': '\u00A8',
    'DotDot': '\u20DC',
    'DotEqual': '\u2250',
    'doteq': '\u2250',
    'esdot': '\u2250',
    'DoubleDownArrow': '\u21D3',
    'Downarrow': '\u21D3',
    'dArr': '\u21D3',
    'DoubleLeftArrow': '\u21D0',
    'Leftarrow': '\u21D0',
    'lArr': '\u21D0',
    'DoubleLeftRightArrow': '\u21D4',
    'Leftrightarrow': '\u21D4',
    'hArr': '\u21D4',
    'iff': '\u21D4',
    'DoubleLongLeftArrow': '\u27F8',
    'Longleftarrow': '\u27F8',
    'xlArr': '\u27F8',
    'DoubleLongLeftRightArrow': '\u27FA',
    'Longleftrightarrow': '\u27FA',
    'xhArr': '\u27FA',
    'DoubleLongRightArrow': '\u27F9',
    'Longrightarrow': '\u27F9',
    'xrArr': '\u27F9',
    'DoubleRightArrow': '\u21D2',
    'Implies': '\u21D2',
    'Rightarrow': '\u21D2',
    'rArr': '\u21D2',
    'DoubleRightTee': '\u22A8',
    'vDash': '\u22A8',
    'DoubleUpArrow': '\u21D1',
    'Uparrow': '\u21D1',
    'uArr': '\u21D1',
    'DoubleUpDownArrow': '\u21D5',
    'Updownarrow': '\u21D5',
    'vArr': '\u21D5',
    'DoubleVerticalBar': '\u2225',
    'par': '\u2225',
    'parallel': '\u2225',
    'shortparallel': '\u2225',
    'spar': '\u2225',
    'DownArrow': '\u2193',
    'ShortDownArrow': '\u2193',
    'darr': '\u2193',
    'downarrow': '\u2193',
    'DownArrowBar': '\u2913',
    'DownArrowUpArrow': '\u21F5',
    'duarr': '\u21F5',
    'DownBreve': '\u0311',
    'DownLeftRightVector': '\u2950',
    'DownLeftTeeVector': '\u295E',
    'DownLeftVector': '\u21BD',
    'leftharpoondown': '\u21BD',
    'lhard': '\u21BD',
    'DownLeftVectorBar': '\u2956',
    'DownRightTeeVector': '\u295F',
    'DownRightVector': '\u21C1',
    'rhard': '\u21C1',
    'rightharpoondown': '\u21C1',
    'DownRightVectorBar': '\u2957',
    'DownTee': '\u22A4',
    'top': '\u22A4',
    'DownTeeArrow': '\u21A7',
    'mapstodown': '\u21A7',
    'Dscr': '\uD835\uDC9F',
    'Dstrok': '\u0110',
    'ENG': '\u014A',
    'ETH': '\u00D0',
    'Eacute': '\u00C9',
    'Ecaron': '\u011A',
    'Ecirc': '\u00CA',
    'Ecy': '\u042D',
    'Edot': '\u0116',
    'Efr': '\uD835\uDD08',
    'Egrave': '\u00C8',
    'Element': '\u2208',
    'in': '\u2208',
    'isin': '\u2208',
    'isinv': '\u2208',
    'Emacr': '\u0112',
    'EmptySmallSquare': '\u25FB',
    'EmptyVerySmallSquare': '\u25AB',
    'Eogon': '\u0118',
    'Eopf': '\uD835\uDD3C',
    'Epsilon': '\u0395',
    'Equal': '\u2A75',
    'EqualTilde': '\u2242',
    'eqsim': '\u2242',
    'esim': '\u2242',
    'Equilibrium': '\u21CC',
    'rightleftharpoons': '\u21CC',
    'rlhar': '\u21CC',
    'Escr': '\u2130',
    'expectation': '\u2130',
    'Esim': '\u2A73',
    'Eta': '\u0397',
    'Euml': '\u00CB',
    'Exists': '\u2203',
    'exist': '\u2203',
    'ExponentialE': '\u2147',
    'ee': '\u2147',
    'exponentiale': '\u2147',
    'Fcy': '\u0424',
    'Ffr': '\uD835\uDD09',
    'FilledSmallSquare': '\u25FC',
    'FilledVerySmallSquare': '\u25AA',
    'blacksquare': '\u25AA',
    'squarf': '\u25AA',
    'squf': '\u25AA',
    'Fopf': '\uD835\uDD3D',
    'ForAll': '\u2200',
    'forall': '\u2200',
    'Fouriertrf': '\u2131',
    'Fscr': '\u2131',
    'GJcy': '\u0403',
    'GT': '\u003E',
    'gt': '\u003E',
    'Gamma': '\u0393',
    'Gammad': '\u03DC',
    'Gbreve': '\u011E',
    'Gcedil': '\u0122',
    'Gcirc': '\u011C',
    'Gcy': '\u0413',
    'Gdot': '\u0120',
    'Gfr': '\uD835\uDD0A',
    'Gg': '\u22D9',
    'ggg': '\u22D9',
    'Gopf': '\uD835\uDD3E',
    'GreaterEqual': '\u2265',
    'ge': '\u2265',
    'geq': '\u2265',
    'GreaterEqualLess': '\u22DB',
    'gel': '\u22DB',
    'gtreqless': '\u22DB',
    'GreaterFullEqual': '\u2267',
    'gE': '\u2267',
    'geqq': '\u2267',
    'GreaterGreater': '\u2AA2',
    'GreaterLess': '\u2277',
    'gl': '\u2277',
    'gtrless': '\u2277',
    'GreaterSlantEqual': '\u2A7E',
    'geqslant': '\u2A7E',
    'ges': '\u2A7E',
    'GreaterTilde': '\u2273',
    'gsim': '\u2273',
    'gtrsim': '\u2273',
    'Gscr': '\uD835\uDCA2',
    'Gt': '\u226B',
    'NestedGreaterGreater': '\u226B',
    'gg': '\u226B',
    'HARDcy': '\u042A',
    'Hacek': '\u02C7',
    'caron': '\u02C7',
    'Hat': '\u005E',
    'Hcirc': '\u0124',
    'Hfr': '\u210C',
    'Poincareplane': '\u210C',
    'HilbertSpace': '\u210B',
    'Hscr': '\u210B',
    'hamilt': '\u210B',
    'Hopf': '\u210D',
    'quaternions': '\u210D',
    'HorizontalLine': '\u2500',
    'boxh': '\u2500',
    'Hstrok': '\u0126',
    'HumpEqual': '\u224F',
    'bumpe': '\u224F',
    'bumpeq': '\u224F',
    'IEcy': '\u0415',
    'IJlig': '\u0132',
    'IOcy': '\u0401',
    'Iacute': '\u00CD',
    'Icirc': '\u00CE',
    'Icy': '\u0418',
    'Idot': '\u0130',
    'Ifr': '\u2111',
    'Im': '\u2111',
    'image': '\u2111',
    'imagpart': '\u2111',
    'Igrave': '\u00CC',
    'Imacr': '\u012A',
    'ImaginaryI': '\u2148',
    'ii': '\u2148',
    'Int': '\u222C',
    'Integral': '\u222B',
    'int': '\u222B',
    'Intersection': '\u22C2',
    'bigcap': '\u22C2',
    'xcap': '\u22C2',
    'InvisibleComma': '\u2063',
    'ic': '\u2063',
    'InvisibleTimes': '\u2062',
    'it': '\u2062',
    'Iogon': '\u012E',
    'Iopf': '\uD835\uDD40',
    'Iota': '\u0399',
    'Iscr': '\u2110',
    'imagline': '\u2110',
    'Itilde': '\u0128',
    'Iukcy': '\u0406',
    'Iuml': '\u00CF',
    'Jcirc': '\u0134',
    'Jcy': '\u0419',
    'Jfr': '\uD835\uDD0D',
    'Jopf': '\uD835\uDD41',
    'Jscr': '\uD835\uDCA5',
    'Jsercy': '\u0408',
    'Jukcy': '\u0404',
    'KHcy': '\u0425',
    'KJcy': '\u040C',
    'Kappa': '\u039A',
    'Kcedil': '\u0136',
    'Kcy': '\u041A',
    'Kfr': '\uD835\uDD0E',
    'Kopf': '\uD835\uDD42',
    'Kscr': '\uD835\uDCA6',
    'LJcy': '\u0409',
    'LT': '\u003C',
    'lt': '\u003C',
    'Lacute': '\u0139',
    'Lambda': '\u039B',
    'Lang': '\u27EA',
    'Laplacetrf': '\u2112',
    'Lscr': '\u2112',
    'lagran': '\u2112',
    'Larr': '\u219E',
    'twoheadleftarrow': '\u219E',
    'Lcaron': '\u013D',
    'Lcedil': '\u013B',
    'Lcy': '\u041B',
    'LeftAngleBracket': '\u27E8',
    'lang': '\u27E8',
    'langle': '\u27E8',
    'LeftArrow': '\u2190',
    'ShortLeftArrow': '\u2190',
    'larr': '\u2190',
    'leftarrow': '\u2190',
    'slarr': '\u2190',
    'LeftArrowBar': '\u21E4',
    'larrb': '\u21E4',
    'LeftArrowRightArrow': '\u21C6',
    'leftrightarrows': '\u21C6',
    'lrarr': '\u21C6',
    'LeftCeiling': '\u2308',
    'lceil': '\u2308',
    'LeftDoubleBracket': '\u27E6',
    'lobrk': '\u27E6',
    'LeftDownTeeVector': '\u2961',
    'LeftDownVector': '\u21C3',
    'dharl': '\u21C3',
    'downharpoonleft': '\u21C3',
    'LeftDownVectorBar': '\u2959',
    'LeftFloor': '\u230A',
    'lfloor': '\u230A',
    'LeftRightArrow': '\u2194',
    'harr': '\u2194',
    'leftrightarrow': '\u2194',
    'LeftRightVector': '\u294E',
    'LeftTee': '\u22A3',
    'dashv': '\u22A3',
    'LeftTeeArrow': '\u21A4',
    'mapstoleft': '\u21A4',
    'LeftTeeVector': '\u295A',
    'LeftTriangle': '\u22B2',
    'vartriangleleft': '\u22B2',
    'vltri': '\u22B2',
    'LeftTriangleBar': '\u29CF',
    'LeftTriangleEqual': '\u22B4',
    'ltrie': '\u22B4',
    'trianglelefteq': '\u22B4',
    'LeftUpDownVector': '\u2951',
    'LeftUpTeeVector': '\u2960',
    'LeftUpVector': '\u21BF',
    'uharl': '\u21BF',
    'upharpoonleft': '\u21BF',
    'LeftUpVectorBar': '\u2958',
    'LeftVector': '\u21BC',
    'leftharpoonup': '\u21BC',
    'lharu': '\u21BC',
    'LeftVectorBar': '\u2952',
    'LessEqualGreater': '\u22DA',
    'leg': '\u22DA',
    'lesseqgtr': '\u22DA',
    'LessFullEqual': '\u2266',
    'lE': '\u2266',
    'leqq': '\u2266',
    'LessGreater': '\u2276',
    'lessgtr': '\u2276',
    'lg': '\u2276',
    'LessLess': '\u2AA1',
    'LessSlantEqual': '\u2A7D',
    'leqslant': '\u2A7D',
    'les': '\u2A7D',
    'LessTilde': '\u2272',
    'lesssim': '\u2272',
    'lsim': '\u2272',
    'Lfr': '\uD835\uDD0F',
    'Ll': '\u22D8',
    'Lleftarrow': '\u21DA',
    'lAarr': '\u21DA',
    'Lmidot': '\u013F',
    'LongLeftArrow': '\u27F5',
    'longleftarrow': '\u27F5',
    'xlarr': '\u27F5',
    'LongLeftRightArrow': '\u27F7',
    'longleftrightarrow': '\u27F7',
    'xharr': '\u27F7',
    'LongRightArrow': '\u27F6',
    'longrightarrow': '\u27F6',
    'xrarr': '\u27F6',
    'Lopf': '\uD835\uDD43',
    'LowerLeftArrow': '\u2199',
    'swarr': '\u2199',
    'swarrow': '\u2199',
    'LowerRightArrow': '\u2198',
    'searr': '\u2198',
    'searrow': '\u2198',
    'Lsh': '\u21B0',
    'lsh': '\u21B0',
    'Lstrok': '\u0141',
    'Lt': '\u226A',
    'NestedLessLess': '\u226A',
    'll': '\u226A',
    'Map': '\u2905',
    'Mcy': '\u041C',
    'MediumSpace': '\u205F',
    'Mellintrf': '\u2133',
    'Mscr': '\u2133',
    'phmmat': '\u2133',
    'Mfr': '\uD835\uDD10',
    'MinusPlus': '\u2213',
    'mnplus': '\u2213',
    'mp': '\u2213',
    'Mopf': '\uD835\uDD44',
    'Mu': '\u039C',
    'NJcy': '\u040A',
    'Nacute': '\u0143',
    'Ncaron': '\u0147',
    'Ncedil': '\u0145',
    'Ncy': '\u041D',
    'NegativeMediumSpace': '\u200B',
    'NegativeThickSpace': '\u200B',
    'NegativeThinSpace': '\u200B',
    'NegativeVeryThinSpace': '\u200B',
    'ZeroWidthSpace': '\u200B',
    'NewLine': '\u000A',
    'Nfr': '\uD835\uDD11',
    'NoBreak': '\u2060',
    'NonBreakingSpace': '\u00A0',
    'nbsp': '\u00A0',
    'Nopf': '\u2115',
    'naturals': '\u2115',
    'Not': '\u2AEC',
    'NotCongruent': '\u2262',
    'nequiv': '\u2262',
    'NotCupCap': '\u226D',
    'NotDoubleVerticalBar': '\u2226',
    'npar': '\u2226',
    'nparallel': '\u2226',
    'nshortparallel': '\u2226',
    'nspar': '\u2226',
    'NotElement': '\u2209',
    'notin': '\u2209',
    'notinva': '\u2209',
    'NotEqual': '\u2260',
    'ne': '\u2260',
    'NotEqualTilde': '\u2242\u0338',
    'nesim': '\u2242\u0338',
    'NotExists': '\u2204',
    'nexist': '\u2204',
    'nexists': '\u2204',
    'NotGreater': '\u226F',
    'ngt': '\u226F',
    'ngtr': '\u226F',
    'NotGreaterEqual': '\u2271',
    'nge': '\u2271',
    'ngeq': '\u2271',
    'NotGreaterFullEqual': '\u2267\u0338',
    'ngE': '\u2267\u0338',
    'ngeqq': '\u2267\u0338',
    'NotGreaterGreater': '\u226B\u0338',
    'nGtv': '\u226B\u0338',
    'NotGreaterLess': '\u2279',
    'ntgl': '\u2279',
    'NotGreaterSlantEqual': '\u2A7E\u0338',
    'ngeqslant': '\u2A7E\u0338',
    'nges': '\u2A7E\u0338',
    'NotGreaterTilde': '\u2275',
    'ngsim': '\u2275',
    'NotHumpDownHump': '\u224E\u0338',
    'nbump': '\u224E\u0338',
    'NotHumpEqual': '\u224F\u0338',
    'nbumpe': '\u224F\u0338',
    'NotLeftTriangle': '\u22EA',
    'nltri': '\u22EA',
    'ntriangleleft': '\u22EA',
    'NotLeftTriangleBar': '\u29CF\u0338',
    'NotLeftTriangleEqual': '\u22EC',
    'nltrie': '\u22EC',
    'ntrianglelefteq': '\u22EC',
    'NotLess': '\u226E',
    'nless': '\u226E',
    'nlt': '\u226E',
    'NotLessEqual': '\u2270',
    'nle': '\u2270',
    'nleq': '\u2270',
    'NotLessGreater': '\u2278',
    'ntlg': '\u2278',
    'NotLessLess': '\u226A\u0338',
    'nLtv': '\u226A\u0338',
    'NotLessSlantEqual': '\u2A7D\u0338',
    'nleqslant': '\u2A7D\u0338',
    'nles': '\u2A7D\u0338',
    'NotLessTilde': '\u2274',
    'nlsim': '\u2274',
    'NotNestedGreaterGreater': '\u2AA2\u0338',
    'NotNestedLessLess': '\u2AA1\u0338',
    'NotPrecedes': '\u2280',
    'npr': '\u2280',
    'nprec': '\u2280',
    'NotPrecedesEqual': '\u2AAF\u0338',
    'npre': '\u2AAF\u0338',
    'npreceq': '\u2AAF\u0338',
    'NotPrecedesSlantEqual': '\u22E0',
    'nprcue': '\u22E0',
    'NotReverseElement': '\u220C',
    'notni': '\u220C',
    'notniva': '\u220C',
    'NotRightTriangle': '\u22EB',
    'nrtri': '\u22EB',
    'ntriangleright': '\u22EB',
    'NotRightTriangleBar': '\u29D0\u0338',
    'NotRightTriangleEqual': '\u22ED',
    'nrtrie': '\u22ED',
    'ntrianglerighteq': '\u22ED',
    'NotSquareSubset': '\u228F\u0338',
    'NotSquareSubsetEqual': '\u22E2',
    'nsqsube': '\u22E2',
    'NotSquareSuperset': '\u2290\u0338',
    'NotSquareSupersetEqual': '\u22E3',
    'nsqsupe': '\u22E3',
    'NotSubset': '\u2282\u20D2',
    'nsubset': '\u2282\u20D2',
    'vnsub': '\u2282\u20D2',
    'NotSubsetEqual': '\u2288',
    'nsube': '\u2288',
    'nsubseteq': '\u2288',
    'NotSucceeds': '\u2281',
    'nsc': '\u2281',
    'nsucc': '\u2281',
    'NotSucceedsEqual': '\u2AB0\u0338',
    'nsce': '\u2AB0\u0338',
    'nsucceq': '\u2AB0\u0338',
    'NotSucceedsSlantEqual': '\u22E1',
    'nsccue': '\u22E1',
    'NotSucceedsTilde': '\u227F\u0338',
    'NotSuperset': '\u2283\u20D2',
    'nsupset': '\u2283\u20D2',
    'vnsup': '\u2283\u20D2',
    'NotSupersetEqual': '\u2289',
    'nsupe': '\u2289',
    'nsupseteq': '\u2289',
    'NotTilde': '\u2241',
    'nsim': '\u2241',
    'NotTildeEqual': '\u2244',
    'nsime': '\u2244',
    'nsimeq': '\u2244',
    'NotTildeFullEqual': '\u2247',
    'ncong': '\u2247',
    'NotTildeTilde': '\u2249',
    'nap': '\u2249',
    'napprox': '\u2249',
    'NotVerticalBar': '\u2224',
    'nmid': '\u2224',
    'nshortmid': '\u2224',
    'nsmid': '\u2224',
    'Nscr': '\uD835\uDCA9',
    'Ntilde': '\u00D1',
    'Nu': '\u039D',
    'OElig': '\u0152',
    'Oacute': '\u00D3',
    'Ocirc': '\u00D4',
    'Ocy': '\u041E',
    'Odblac': '\u0150',
    'Ofr': '\uD835\uDD12',
    'Ograve': '\u00D2',
    'Omacr': '\u014C',
    'Omega': '\u03A9',
    'ohm': '\u03A9',
    'Omicron': '\u039F',
    'Oopf': '\uD835\uDD46',
    'OpenCurlyDoubleQuote': '\u201C',
    'ldquo': '\u201C',
    'OpenCurlyQuote': '\u2018',
    'lsquo': '\u2018',
    'Or': '\u2A54',
    'Oscr': '\uD835\uDCAA',
    'Oslash': '\u00D8',
    'Otilde': '\u00D5',
    'Otimes': '\u2A37',
    'Ouml': '\u00D6',
    'OverBar': '\u203E',
    'oline': '\u203E',
    'OverBrace': '\u23DE',
    'OverBracket': '\u23B4',
    'tbrk': '\u23B4',
    'OverParenthesis': '\u23DC',
    'PartialD': '\u2202',
    'part': '\u2202',
    'Pcy': '\u041F',
    'Pfr': '\uD835\uDD13',
    'Phi': '\u03A6',
    'Pi': '\u03A0',
    'PlusMinus': '\u00B1',
    'plusmn': '\u00B1',
    'pm': '\u00B1',
    'Popf': '\u2119',
    'primes': '\u2119',
    'Pr': '\u2ABB',
    'Precedes': '\u227A',
    'pr': '\u227A',
    'prec': '\u227A',
    'PrecedesEqual': '\u2AAF',
    'pre': '\u2AAF',
    'preceq': '\u2AAF',
    'PrecedesSlantEqual': '\u227C',
    'prcue': '\u227C',
    'preccurlyeq': '\u227C',
    'PrecedesTilde': '\u227E',
    'precsim': '\u227E',
    'prsim': '\u227E',
    'Prime': '\u2033',
    'Product': '\u220F',
    'prod': '\u220F',
    'Proportional': '\u221D',
    'prop': '\u221D',
    'propto': '\u221D',
    'varpropto': '\u221D',
    'vprop': '\u221D',
    'Pscr': '\uD835\uDCAB',
    'Psi': '\u03A8',
    'QUOT': '\u0022',
    'quot': '\u0022',
    'Qfr': '\uD835\uDD14',
    'Qopf': '\u211A',
    'rationals': '\u211A',
    'Qscr': '\uD835\uDCAC',
    'RBarr': '\u2910',
    'drbkarow': '\u2910',
    'REG': '\u00AE',
    'circledR': '\u00AE',
    'reg': '\u00AE',
    'Racute': '\u0154',
    'Rang': '\u27EB',
    'Rarr': '\u21A0',
    'twoheadrightarrow': '\u21A0',
    'Rarrtl': '\u2916',
    'Rcaron': '\u0158',
    'Rcedil': '\u0156',
    'Rcy': '\u0420',
    'Re': '\u211C',
    'Rfr': '\u211C',
    'real': '\u211C',
    'realpart': '\u211C',
    'ReverseElement': '\u220B',
    'SuchThat': '\u220B',
    'ni': '\u220B',
    'niv': '\u220B',
    'ReverseEquilibrium': '\u21CB',
    'leftrightharpoons': '\u21CB',
    'lrhar': '\u21CB',
    'ReverseUpEquilibrium': '\u296F',
    'duhar': '\u296F',
    'Rho': '\u03A1',
    'RightAngleBracket': '\u27E9',
    'rang': '\u27E9',
    'rangle': '\u27E9',
    'RightArrow': '\u2192',
    'ShortRightArrow': '\u2192',
    'rarr': '\u2192',
    'rightarrow': '\u2192',
    'srarr': '\u2192',
    'RightArrowBar': '\u21E5',
    'rarrb': '\u21E5',
    'RightArrowLeftArrow': '\u21C4',
    'rightleftarrows': '\u21C4',
    'rlarr': '\u21C4',
    'RightCeiling': '\u2309',
    'rceil': '\u2309',
    'RightDoubleBracket': '\u27E7',
    'robrk': '\u27E7',
    'RightDownTeeVector': '\u295D',
    'RightDownVector': '\u21C2',
    'dharr': '\u21C2',
    'downharpoonright': '\u21C2',
    'RightDownVectorBar': '\u2955',
    'RightFloor': '\u230B',
    'rfloor': '\u230B',
    'RightTee': '\u22A2',
    'vdash': '\u22A2',
    'RightTeeArrow': '\u21A6',
    'map': '\u21A6',
    'mapsto': '\u21A6',
    'RightTeeVector': '\u295B',
    'RightTriangle': '\u22B3',
    'vartriangleright': '\u22B3',
    'vrtri': '\u22B3',
    'RightTriangleBar': '\u29D0',
    'RightTriangleEqual': '\u22B5',
    'rtrie': '\u22B5',
    'trianglerighteq': '\u22B5',
    'RightUpDownVector': '\u294F',
    'RightUpTeeVector': '\u295C',
    'RightUpVector': '\u21BE',
    'uharr': '\u21BE',
    'upharpoonright': '\u21BE',
    'RightUpVectorBar': '\u2954',
    'RightVector': '\u21C0',
    'rharu': '\u21C0',
    'rightharpoonup': '\u21C0',
    'RightVectorBar': '\u2953',
    'Ropf': '\u211D',
    'reals': '\u211D',
    'RoundImplies': '\u2970',
    'Rrightarrow': '\u21DB',
    'rAarr': '\u21DB',
    'Rscr': '\u211B',
    'realine': '\u211B',
    'Rsh': '\u21B1',
    'rsh': '\u21B1',
    'RuleDelayed': '\u29F4',
    'SHCHcy': '\u0429',
    'SHcy': '\u0428',
    'SOFTcy': '\u042C',
    'Sacute': '\u015A',
    'Sc': '\u2ABC',
    'Scaron': '\u0160',
    'Scedil': '\u015E',
    'Scirc': '\u015C',
    'Scy': '\u0421',
    'Sfr': '\uD835\uDD16',
    'ShortUpArrow': '\u2191',
    'UpArrow': '\u2191',
    'uarr': '\u2191',
    'uparrow': '\u2191',
    'Sigma': '\u03A3',
    'SmallCircle': '\u2218',
    'compfn': '\u2218',
    'Sopf': '\uD835\uDD4A',
    'Sqrt': '\u221A',
    'radic': '\u221A',
    'Square': '\u25A1',
    'squ': '\u25A1',
    'square': '\u25A1',
    'SquareIntersection': '\u2293',
    'sqcap': '\u2293',
    'SquareSubset': '\u228F',
    'sqsub': '\u228F',
    'sqsubset': '\u228F',
    'SquareSubsetEqual': '\u2291',
    'sqsube': '\u2291',
    'sqsubseteq': '\u2291',
    'SquareSuperset': '\u2290',
    'sqsup': '\u2290',
    'sqsupset': '\u2290',
    'SquareSupersetEqual': '\u2292',
    'sqsupe': '\u2292',
    'sqsupseteq': '\u2292',
    'SquareUnion': '\u2294',
    'sqcup': '\u2294',
    'Sscr': '\uD835\uDCAE',
    'Star': '\u22C6',
    'sstarf': '\u22C6',
    'Sub': '\u22D0',
    'Subset': '\u22D0',
    'SubsetEqual': '\u2286',
    'sube': '\u2286',
    'subseteq': '\u2286',
    'Succeeds': '\u227B',
    'sc': '\u227B',
    'succ': '\u227B',
    'SucceedsEqual': '\u2AB0',
    'sce': '\u2AB0',
    'succeq': '\u2AB0',
    'SucceedsSlantEqual': '\u227D',
    'sccue': '\u227D',
    'succcurlyeq': '\u227D',
    'SucceedsTilde': '\u227F',
    'scsim': '\u227F',
    'succsim': '\u227F',
    'Sum': '\u2211',
    'sum': '\u2211',
    'Sup': '\u22D1',
    'Supset': '\u22D1',
    'Superset': '\u2283',
    'sup': '\u2283',
    'supset': '\u2283',
    'SupersetEqual': '\u2287',
    'supe': '\u2287',
    'supseteq': '\u2287',
    'THORN': '\u00DE',
    'TRADE': '\u2122',
    'trade': '\u2122',
    'TSHcy': '\u040B',
    'TScy': '\u0426',
    'Tab': '\u0009',
    'Tau': '\u03A4',
    'Tcaron': '\u0164',
    'Tcedil': '\u0162',
    'Tcy': '\u0422',
    'Tfr': '\uD835\uDD17',
    'Therefore': '\u2234',
    'there4': '\u2234',
    'therefore': '\u2234',
    'Theta': '\u0398',
    'ThickSpace': '\u205F\u200A',
    'ThinSpace': '\u2009',
    'thinsp': '\u2009',
    'Tilde': '\u223C',
    'sim': '\u223C',
    'thicksim': '\u223C',
    'thksim': '\u223C',
    'TildeEqual': '\u2243',
    'sime': '\u2243',
    'simeq': '\u2243',
    'TildeFullEqual': '\u2245',
    'cong': '\u2245',
    'TildeTilde': '\u2248',
    'ap': '\u2248',
    'approx': '\u2248',
    'asymp': '\u2248',
    'thickapprox': '\u2248',
    'thkap': '\u2248',
    'Topf': '\uD835\uDD4B',
    'TripleDot': '\u20DB',
    'tdot': '\u20DB',
    'Tscr': '\uD835\uDCAF',
    'Tstrok': '\u0166',
    'Uacute': '\u00DA',
    'Uarr': '\u219F',
    'Uarrocir': '\u2949',
    'Ubrcy': '\u040E',
    'Ubreve': '\u016C',
    'Ucirc': '\u00DB',
    'Ucy': '\u0423',
    'Udblac': '\u0170',
    'Ufr': '\uD835\uDD18',
    'Ugrave': '\u00D9',
    'Umacr': '\u016A',
    'UnderBar': '\u005F',
    'lowbar': '\u005F',
    'UnderBrace': '\u23DF',
    'UnderBracket': '\u23B5',
    'bbrk': '\u23B5',
    'UnderParenthesis': '\u23DD',
    'Union': '\u22C3',
    'bigcup': '\u22C3',
    'xcup': '\u22C3',
    'UnionPlus': '\u228E',
    'uplus': '\u228E',
    'Uogon': '\u0172',
    'Uopf': '\uD835\uDD4C',
    'UpArrowBar': '\u2912',
    'UpArrowDownArrow': '\u21C5',
    'udarr': '\u21C5',
    'UpDownArrow': '\u2195',
    'updownarrow': '\u2195',
    'varr': '\u2195',
    'UpEquilibrium': '\u296E',
    'udhar': '\u296E',
    'UpTee': '\u22A5',
    'bot': '\u22A5',
    'bottom': '\u22A5',
    'perp': '\u22A5',
    'UpTeeArrow': '\u21A5',
    'mapstoup': '\u21A5',
    'UpperLeftArrow': '\u2196',
    'nwarr': '\u2196',
    'nwarrow': '\u2196',
    'UpperRightArrow': '\u2197',
    'nearr': '\u2197',
    'nearrow': '\u2197',
    'Upsi': '\u03D2',
    'upsih': '\u03D2',
    'Upsilon': '\u03A5',
    'Uring': '\u016E',
    'Uscr': '\uD835\uDCB0',
    'Utilde': '\u0168',
    'Uuml': '\u00DC',
    'VDash': '\u22AB',
    'Vbar': '\u2AEB',
    'Vcy': '\u0412',
    'Vdash': '\u22A9',
    'Vdashl': '\u2AE6',
    'Vee': '\u22C1',
    'bigvee': '\u22C1',
    'xvee': '\u22C1',
    'Verbar': '\u2016',
    'Vert': '\u2016',
    'VerticalBar': '\u2223',
    'mid': '\u2223',
    'shortmid': '\u2223',
    'smid': '\u2223',
    'VerticalLine': '\u007C',
    'verbar': '\u007C',
    'vert': '\u007C',
    'VerticalSeparator': '\u2758',
    'VerticalTilde': '\u2240',
    'wr': '\u2240',
    'wreath': '\u2240',
    'VeryThinSpace': '\u200A',
    'hairsp': '\u200A',
    'Vfr': '\uD835\uDD19',
    'Vopf': '\uD835\uDD4D',
    'Vscr': '\uD835\uDCB1',
    'Vvdash': '\u22AA',
    'Wcirc': '\u0174',
    'Wedge': '\u22C0',
    'bigwedge': '\u22C0',
    'xwedge': '\u22C0',
    'Wfr': '\uD835\uDD1A',
    'Wopf': '\uD835\uDD4E',
    'Wscr': '\uD835\uDCB2',
    'Xfr': '\uD835\uDD1B',
    'Xi': '\u039E',
    'Xopf': '\uD835\uDD4F',
    'Xscr': '\uD835\uDCB3',
    'YAcy': '\u042F',
    'YIcy': '\u0407',
    'YUcy': '\u042E',
    'Yacute': '\u00DD',
    'Ycirc': '\u0176',
    'Ycy': '\u042B',
    'Yfr': '\uD835\uDD1C',
    'Yopf': '\uD835\uDD50',
    'Yscr': '\uD835\uDCB4',
    'Yuml': '\u0178',
    'ZHcy': '\u0416',
    'Zacute': '\u0179',
    'Zcaron': '\u017D',
    'Zcy': '\u0417',
    'Zdot': '\u017B',
    'Zeta': '\u0396',
    'Zfr': '\u2128',
    'zeetrf': '\u2128',
    'Zopf': '\u2124',
    'integers': '\u2124',
    'Zscr': '\uD835\uDCB5',
    'aacute': '\u00E1',
    'abreve': '\u0103',
    'ac': '\u223E',
    'mstpos': '\u223E',
    'acE': '\u223E\u0333',
    'acd': '\u223F',
    'acirc': '\u00E2',
    'acy': '\u0430',
    'aelig': '\u00E6',
    'afr': '\uD835\uDD1E',
    'agrave': '\u00E0',
    'alefsym': '\u2135',
    'aleph': '\u2135',
    'alpha': '\u03B1',
    'amacr': '\u0101',
    'amalg': '\u2A3F',
    'and': '\u2227',
    'wedge': '\u2227',
    'andand': '\u2A55',
    'andd': '\u2A5C',
    'andslope': '\u2A58',
    'andv': '\u2A5A',
    'ang': '\u2220',
    'angle': '\u2220',
    'ange': '\u29A4',
    'angmsd': '\u2221',
    'measuredangle': '\u2221',
    'angmsdaa': '\u29A8',
    'angmsdab': '\u29A9',
    'angmsdac': '\u29AA',
    'angmsdad': '\u29AB',
    'angmsdae': '\u29AC',
    'angmsdaf': '\u29AD',
    'angmsdag': '\u29AE',
    'angmsdah': '\u29AF',
    'angrt': '\u221F',
    'angrtvb': '\u22BE',
    'angrtvbd': '\u299D',
    'angsph': '\u2222',
    'angzarr': '\u237C',
    'aogon': '\u0105',
    'aopf': '\uD835\uDD52',
    'apE': '\u2A70',
    'apacir': '\u2A6F',
    'ape': '\u224A',
    'approxeq': '\u224A',
    'apid': '\u224B',
    'apos': '\u0027',
    'aring': '\u00E5',
    'ascr': '\uD835\uDCB6',
    'ast': '\u002A',
    'midast': '\u002A',
    'atilde': '\u00E3',
    'auml': '\u00E4',
    'awint': '\u2A11',
    'bNot': '\u2AED',
    'backcong': '\u224C',
    'bcong': '\u224C',
    'backepsilon': '\u03F6',
    'bepsi': '\u03F6',
    'backprime': '\u2035',
    'bprime': '\u2035',
    'backsim': '\u223D',
    'bsim': '\u223D',
    'backsimeq': '\u22CD',
    'bsime': '\u22CD',
    'barvee': '\u22BD',
    'barwed': '\u2305',
    'barwedge': '\u2305',
    'bbrktbrk': '\u23B6',
    'bcy': '\u0431',
    'bdquo': '\u201E',
    'ldquor': '\u201E',
    'bemptyv': '\u29B0',
    'beta': '\u03B2',
    'beth': '\u2136',
    'between': '\u226C',
    'twixt': '\u226C',
    'bfr': '\uD835\uDD1F',
    'bigcirc': '\u25EF',
    'xcirc': '\u25EF',
    'bigodot': '\u2A00',
    'xodot': '\u2A00',
    'bigoplus': '\u2A01',
    'xoplus': '\u2A01',
    'bigotimes': '\u2A02',
    'xotime': '\u2A02',
    'bigsqcup': '\u2A06',
    'xsqcup': '\u2A06',
    'bigstar': '\u2605',
    'starf': '\u2605',
    'bigtriangledown': '\u25BD',
    'xdtri': '\u25BD',
    'bigtriangleup': '\u25B3',
    'xutri': '\u25B3',
    'biguplus': '\u2A04',
    'xuplus': '\u2A04',
    'bkarow': '\u290D',
    'rbarr': '\u290D',
    'blacklozenge': '\u29EB',
    'lozf': '\u29EB',
    'blacktriangle': '\u25B4',
    'utrif': '\u25B4',
    'blacktriangledown': '\u25BE',
    'dtrif': '\u25BE',
    'blacktriangleleft': '\u25C2',
    'ltrif': '\u25C2',
    'blacktriangleright': '\u25B8',
    'rtrif': '\u25B8',
    'blank': '\u2423',
    'blk12': '\u2592',
    'blk14': '\u2591',
    'blk34': '\u2593',
    'block': '\u2588',
    'bne': '\u003D\u20E5',
    'bnequiv': '\u2261\u20E5',
    'bnot': '\u2310',
    'bopf': '\uD835\uDD53',
    'bowtie': '\u22C8',
    'boxDL': '\u2557',
    'boxDR': '\u2554',
    'boxDl': '\u2556',
    'boxDr': '\u2553',
    'boxH': '\u2550',
    'boxHD': '\u2566',
    'boxHU': '\u2569',
    'boxHd': '\u2564',
    'boxHu': '\u2567',
    'boxUL': '\u255D',
    'boxUR': '\u255A',
    'boxUl': '\u255C',
    'boxUr': '\u2559',
    'boxV': '\u2551',
    'boxVH': '\u256C',
    'boxVL': '\u2563',
    'boxVR': '\u2560',
    'boxVh': '\u256B',
    'boxVl': '\u2562',
    'boxVr': '\u255F',
    'boxbox': '\u29C9',
    'boxdL': '\u2555',
    'boxdR': '\u2552',
    'boxdl': '\u2510',
    'boxdr': '\u250C',
    'boxhD': '\u2565',
    'boxhU': '\u2568',
    'boxhd': '\u252C',
    'boxhu': '\u2534',
    'boxminus': '\u229F',
    'minusb': '\u229F',
    'boxplus': '\u229E',
    'plusb': '\u229E',
    'boxtimes': '\u22A0',
    'timesb': '\u22A0',
    'boxuL': '\u255B',
    'boxuR': '\u2558',
    'boxul': '\u2518',
    'boxur': '\u2514',
    'boxv': '\u2502',
    'boxvH': '\u256A',
    'boxvL': '\u2561',
    'boxvR': '\u255E',
    'boxvh': '\u253C',
    'boxvl': '\u2524',
    'boxvr': '\u251C',
    'brvbar': '\u00A6',
    'bscr': '\uD835\uDCB7',
    'bsemi': '\u204F',
    'bsol': '\u005C',
    'bsolb': '\u29C5',
    'bsolhsub': '\u27C8',
    'bull': '\u2022',
    'bullet': '\u2022',
    'bumpE': '\u2AAE',
    'cacute': '\u0107',
    'cap': '\u2229',
    'capand': '\u2A44',
    'capbrcup': '\u2A49',
    'capcap': '\u2A4B',
    'capcup': '\u2A47',
    'capdot': '\u2A40',
    'caps': '\u2229\uFE00',
    'caret': '\u2041',
    'ccaps': '\u2A4D',
    'ccaron': '\u010D',
    'ccedil': '\u00E7',
    'ccirc': '\u0109',
    'ccups': '\u2A4C',
    'ccupssm': '\u2A50',
    'cdot': '\u010B',
    'cemptyv': '\u29B2',
    'cent': '\u00A2',
    'cfr': '\uD835\uDD20',
    'chcy': '\u0447',
    'check': '\u2713',
    'checkmark': '\u2713',
    'chi': '\u03C7',
    'cir': '\u25CB',
    'cirE': '\u29C3',
    'circ': '\u02C6',
    'circeq': '\u2257',
    'cire': '\u2257',
    'circlearrowleft': '\u21BA',
    'olarr': '\u21BA',
    'circlearrowright': '\u21BB',
    'orarr': '\u21BB',
    'circledS': '\u24C8',
    'oS': '\u24C8',
    'circledast': '\u229B',
    'oast': '\u229B',
    'circledcirc': '\u229A',
    'ocir': '\u229A',
    'circleddash': '\u229D',
    'odash': '\u229D',
    'cirfnint': '\u2A10',
    'cirmid': '\u2AEF',
    'cirscir': '\u29C2',
    'clubs': '\u2663',
    'clubsuit': '\u2663',
    'colon': '\u003A',
    'comma': '\u002C',
    'commat': '\u0040',
    'comp': '\u2201',
    'complement': '\u2201',
    'congdot': '\u2A6D',
    'copf': '\uD835\uDD54',
    'copysr': '\u2117',
    'crarr': '\u21B5',
    'cross': '\u2717',
    'cscr': '\uD835\uDCB8',
    'csub': '\u2ACF',
    'csube': '\u2AD1',
    'csup': '\u2AD0',
    'csupe': '\u2AD2',
    'ctdot': '\u22EF',
    'cudarrl': '\u2938',
    'cudarrr': '\u2935',
    'cuepr': '\u22DE',
    'curlyeqprec': '\u22DE',
    'cuesc': '\u22DF',
    'curlyeqsucc': '\u22DF',
    'cularr': '\u21B6',
    'curvearrowleft': '\u21B6',
    'cularrp': '\u293D',
    'cup': '\u222A',
    'cupbrcap': '\u2A48',
    'cupcap': '\u2A46',
    'cupcup': '\u2A4A',
    'cupdot': '\u228D',
    'cupor': '\u2A45',
    'cups': '\u222A\uFE00',
    'curarr': '\u21B7',
    'curvearrowright': '\u21B7',
    'curarrm': '\u293C',
    'curlyvee': '\u22CE',
    'cuvee': '\u22CE',
    'curlywedge': '\u22CF',
    'cuwed': '\u22CF',
    'curren': '\u00A4',
    'cwint': '\u2231',
    'cylcty': '\u232D',
    'dHar': '\u2965',
    'dagger': '\u2020',
    'daleth': '\u2138',
    'dash': '\u2010',
    'hyphen': '\u2010',
    'dbkarow': '\u290F',
    'rBarr': '\u290F',
    'dcaron': '\u010F',
    'dcy': '\u0434',
    'ddarr': '\u21CA',
    'downdownarrows': '\u21CA',
    'ddotseq': '\u2A77',
    'eDDot': '\u2A77',
    'deg': '\u00B0',
    'delta': '\u03B4',
    'demptyv': '\u29B1',
    'dfisht': '\u297F',
    'dfr': '\uD835\uDD21',
    'diamondsuit': '\u2666',
    'diams': '\u2666',
    'digamma': '\u03DD',
    'gammad': '\u03DD',
    'disin': '\u22F2',
    'div': '\u00F7',
    'divide': '\u00F7',
    'divideontimes': '\u22C7',
    'divonx': '\u22C7',
    'djcy': '\u0452',
    'dlcorn': '\u231E',
    'llcorner': '\u231E',
    'dlcrop': '\u230D',
    'dollar': '\u0024',
    'dopf': '\uD835\uDD55',
    'doteqdot': '\u2251',
    'eDot': '\u2251',
    'dotminus': '\u2238',
    'minusd': '\u2238',
    'dotplus': '\u2214',
    'plusdo': '\u2214',
    'dotsquare': '\u22A1',
    'sdotb': '\u22A1',
    'drcorn': '\u231F',
    'lrcorner': '\u231F',
    'drcrop': '\u230C',
    'dscr': '\uD835\uDCB9',
    'dscy': '\u0455',
    'dsol': '\u29F6',
    'dstrok': '\u0111',
    'dtdot': '\u22F1',
    'dtri': '\u25BF',
    'triangledown': '\u25BF',
    'dwangle': '\u29A6',
    'dzcy': '\u045F',
    'dzigrarr': '\u27FF',
    'eacute': '\u00E9',
    'easter': '\u2A6E',
    'ecaron': '\u011B',
    'ecir': '\u2256',
    'eqcirc': '\u2256',
    'ecirc': '\u00EA',
    'ecolon': '\u2255',
    'eqcolon': '\u2255',
    'ecy': '\u044D',
    'edot': '\u0117',
    'efDot': '\u2252',
    'fallingdotseq': '\u2252',
    'efr': '\uD835\uDD22',
    'eg': '\u2A9A',
    'egrave': '\u00E8',
    'egs': '\u2A96',
    'eqslantgtr': '\u2A96',
    'egsdot': '\u2A98',
    'el': '\u2A99',
    'elinters': '\u23E7',
    'ell': '\u2113',
    'els': '\u2A95',
    'eqslantless': '\u2A95',
    'elsdot': '\u2A97',
    'emacr': '\u0113',
    'empty': '\u2205',
    'emptyset': '\u2205',
    'emptyv': '\u2205',
    'varnothing': '\u2205',
    'emsp13': '\u2004',
    'emsp14': '\u2005',
    'emsp': '\u2003',
    'eng': '\u014B',
    'ensp': '\u2002',
    'eogon': '\u0119',
    'eopf': '\uD835\uDD56',
    'epar': '\u22D5',
    'eparsl': '\u29E3',
    'eplus': '\u2A71',
    'epsi': '\u03B5',
    'epsilon': '\u03B5',
    'epsiv': '\u03F5',
    'straightepsilon': '\u03F5',
    'varepsilon': '\u03F5',
    'equals': '\u003D',
    'equest': '\u225F',
    'questeq': '\u225F',
    'equivDD': '\u2A78',
    'eqvparsl': '\u29E5',
    'erDot': '\u2253',
    'risingdotseq': '\u2253',
    'erarr': '\u2971',
    'escr': '\u212F',
    'eta': '\u03B7',
    'eth': '\u00F0',
    'euml': '\u00EB',
    'euro': '\u20AC',
    'excl': '\u0021',
    'fcy': '\u0444',
    'female': '\u2640',
    'ffilig': '\uFB03',
    'fflig': '\uFB00',
    'ffllig': '\uFB04',
    'ffr': '\uD835\uDD23',
    'filig': '\uFB01',
    'fjlig': '\u0066\u006A',
    'flat': '\u266D',
    'fllig': '\uFB02',
    'fltns': '\u25B1',
    'fnof': '\u0192',
    'fopf': '\uD835\uDD57',
    'fork': '\u22D4',
    'pitchfork': '\u22D4',
    'forkv': '\u2AD9',
    'fpartint': '\u2A0D',
    'frac12': '\u00BD',
    'half': '\u00BD',
    'frac13': '\u2153',
    'frac14': '\u00BC',
    'frac15': '\u2155',
    'frac16': '\u2159',
    'frac18': '\u215B',
    'frac23': '\u2154',
    'frac25': '\u2156',
    'frac34': '\u00BE',
    'frac35': '\u2157',
    'frac38': '\u215C',
    'frac45': '\u2158',
    'frac56': '\u215A',
    'frac58': '\u215D',
    'frac78': '\u215E',
    'frasl': '\u2044',
    'frown': '\u2322',
    'sfrown': '\u2322',
    'fscr': '\uD835\uDCBB',
    'gEl': '\u2A8C',
    'gtreqqless': '\u2A8C',
    'gacute': '\u01F5',
    'gamma': '\u03B3',
    'gap': '\u2A86',
    'gtrapprox': '\u2A86',
    'gbreve': '\u011F',
    'gcirc': '\u011D',
    'gcy': '\u0433',
    'gdot': '\u0121',
    'gescc': '\u2AA9',
    'gesdot': '\u2A80',
    'gesdoto': '\u2A82',
    'gesdotol': '\u2A84',
    'gesl': '\u22DB\uFE00',
    'gesles': '\u2A94',
    'gfr': '\uD835\uDD24',
    'gimel': '\u2137',
    'gjcy': '\u0453',
    'glE': '\u2A92',
    'gla': '\u2AA5',
    'glj': '\u2AA4',
    'gnE': '\u2269',
    'gneqq': '\u2269',
    'gnap': '\u2A8A',
    'gnapprox': '\u2A8A',
    'gne': '\u2A88',
    'gneq': '\u2A88',
    'gnsim': '\u22E7',
    'gopf': '\uD835\uDD58',
    'gscr': '\u210A',
    'gsime': '\u2A8E',
    'gsiml': '\u2A90',
    'gtcc': '\u2AA7',
    'gtcir': '\u2A7A',
    'gtdot': '\u22D7',
    'gtrdot': '\u22D7',
    'gtlPar': '\u2995',
    'gtquest': '\u2A7C',
    'gtrarr': '\u2978',
    'gvertneqq': '\u2269\uFE00',
    'gvnE': '\u2269\uFE00',
    'hardcy': '\u044A',
    'harrcir': '\u2948',
    'harrw': '\u21AD',
    'leftrightsquigarrow': '\u21AD',
    'hbar': '\u210F',
    'hslash': '\u210F',
    'planck': '\u210F',
    'plankv': '\u210F',
    'hcirc': '\u0125',
    'hearts': '\u2665',
    'heartsuit': '\u2665',
    'hellip': '\u2026',
    'mldr': '\u2026',
    'hercon': '\u22B9',
    'hfr': '\uD835\uDD25',
    'hksearow': '\u2925',
    'searhk': '\u2925',
    'hkswarow': '\u2926',
    'swarhk': '\u2926',
    'hoarr': '\u21FF',
    'homtht': '\u223B',
    'hookleftarrow': '\u21A9',
    'larrhk': '\u21A9',
    'hookrightarrow': '\u21AA',
    'rarrhk': '\u21AA',
    'hopf': '\uD835\uDD59',
    'horbar': '\u2015',
    'hscr': '\uD835\uDCBD',
    'hstrok': '\u0127',
    'hybull': '\u2043',
    'iacute': '\u00ED',
    'icirc': '\u00EE',
    'icy': '\u0438',
    'iecy': '\u0435',
    'iexcl': '\u00A1',
    'ifr': '\uD835\uDD26',
    'igrave': '\u00EC',
    'iiiint': '\u2A0C',
    'qint': '\u2A0C',
    'iiint': '\u222D',
    'tint': '\u222D',
    'iinfin': '\u29DC',
    'iiota': '\u2129',
    'ijlig': '\u0133',
    'imacr': '\u012B',
    'imath': '\u0131',
    'inodot': '\u0131',
    'imof': '\u22B7',
    'imped': '\u01B5',
    'incare': '\u2105',
    'infin': '\u221E',
    'infintie': '\u29DD',
    'intcal': '\u22BA',
    'intercal': '\u22BA',
    'intlarhk': '\u2A17',
    'intprod': '\u2A3C',
    'iprod': '\u2A3C',
    'iocy': '\u0451',
    'iogon': '\u012F',
    'iopf': '\uD835\uDD5A',
    'iota': '\u03B9',
    'iquest': '\u00BF',
    'iscr': '\uD835\uDCBE',
    'isinE': '\u22F9',
    'isindot': '\u22F5',
    'isins': '\u22F4',
    'isinsv': '\u22F3',
    'itilde': '\u0129',
    'iukcy': '\u0456',
    'iuml': '\u00EF',
    'jcirc': '\u0135',
    'jcy': '\u0439',
    'jfr': '\uD835\uDD27',
    'jmath': '\u0237',
    'jopf': '\uD835\uDD5B',
    'jscr': '\uD835\uDCBF',
    'jsercy': '\u0458',
    'jukcy': '\u0454',
    'kappa': '\u03BA',
    'kappav': '\u03F0',
    'varkappa': '\u03F0',
    'kcedil': '\u0137',
    'kcy': '\u043A',
    'kfr': '\uD835\uDD28',
    'kgreen': '\u0138',
    'khcy': '\u0445',
    'kjcy': '\u045C',
    'kopf': '\uD835\uDD5C',
    'kscr': '\uD835\uDCC0',
    'lAtail': '\u291B',
    'lBarr': '\u290E',
    'lEg': '\u2A8B',
    'lesseqqgtr': '\u2A8B',
    'lHar': '\u2962',
    'lacute': '\u013A',
    'laemptyv': '\u29B4',
    'lambda': '\u03BB',
    'langd': '\u2991',
    'lap': '\u2A85',
    'lessapprox': '\u2A85',
    'laquo': '\u00AB',
    'larrbfs': '\u291F',
    'larrfs': '\u291D',
    'larrlp': '\u21AB',
    'looparrowleft': '\u21AB',
    'larrpl': '\u2939',
    'larrsim': '\u2973',
    'larrtl': '\u21A2',
    'leftarrowtail': '\u21A2',
    'lat': '\u2AAB',
    'latail': '\u2919',
    'late': '\u2AAD',
    'lates': '\u2AAD\uFE00',
    'lbarr': '\u290C',
    'lbbrk': '\u2772',
    'lbrace': '\u007B',
    'lcub': '\u007B',
    'lbrack': '\u005B',
    'lsqb': '\u005B',
    'lbrke': '\u298B',
    'lbrksld': '\u298F',
    'lbrkslu': '\u298D',
    'lcaron': '\u013E',
    'lcedil': '\u013C',
    'lcy': '\u043B',
    'ldca': '\u2936',
    'ldrdhar': '\u2967',
    'ldrushar': '\u294B',
    'ldsh': '\u21B2',
    'le': '\u2264',
    'leq': '\u2264',
    'leftleftarrows': '\u21C7',
    'llarr': '\u21C7',
    'leftthreetimes': '\u22CB',
    'lthree': '\u22CB',
    'lescc': '\u2AA8',
    'lesdot': '\u2A7F',
    'lesdoto': '\u2A81',
    'lesdotor': '\u2A83',
    'lesg': '\u22DA\uFE00',
    'lesges': '\u2A93',
    'lessdot': '\u22D6',
    'ltdot': '\u22D6',
    'lfisht': '\u297C',
    'lfr': '\uD835\uDD29',
    'lgE': '\u2A91',
    'lharul': '\u296A',
    'lhblk': '\u2584',
    'ljcy': '\u0459',
    'llhard': '\u296B',
    'lltri': '\u25FA',
    'lmidot': '\u0140',
    'lmoust': '\u23B0',
    'lmoustache': '\u23B0',
    'lnE': '\u2268',
    'lneqq': '\u2268',
    'lnap': '\u2A89',
    'lnapprox': '\u2A89',
    'lne': '\u2A87',
    'lneq': '\u2A87',
    'lnsim': '\u22E6',
    'loang': '\u27EC',
    'loarr': '\u21FD',
    'longmapsto': '\u27FC',
    'xmap': '\u27FC',
    'looparrowright': '\u21AC',
    'rarrlp': '\u21AC',
    'lopar': '\u2985',
    'lopf': '\uD835\uDD5D',
    'loplus': '\u2A2D',
    'lotimes': '\u2A34',
    'lowast': '\u2217',
    'loz': '\u25CA',
    'lozenge': '\u25CA',
    'lpar': '\u0028',
    'lparlt': '\u2993',
    'lrhard': '\u296D',
    'lrm': '\u200E',
    'lrtri': '\u22BF',
    'lsaquo': '\u2039',
    'lscr': '\uD835\uDCC1',
    'lsime': '\u2A8D',
    'lsimg': '\u2A8F',
    'lsquor': '\u201A',
    'sbquo': '\u201A',
    'lstrok': '\u0142',
    'ltcc': '\u2AA6',
    'ltcir': '\u2A79',
    'ltimes': '\u22C9',
    'ltlarr': '\u2976',
    'ltquest': '\u2A7B',
    'ltrPar': '\u2996',
    'ltri': '\u25C3',
    'triangleleft': '\u25C3',
    'lurdshar': '\u294A',
    'luruhar': '\u2966',
    'lvertneqq': '\u2268\uFE00',
    'lvnE': '\u2268\uFE00',
    'mDDot': '\u223A',
    'macr': '\u00AF',
    'strns': '\u00AF',
    'male': '\u2642',
    'malt': '\u2720',
    'maltese': '\u2720',
    'marker': '\u25AE',
    'mcomma': '\u2A29',
    'mcy': '\u043C',
    'mdash': '\u2014',
    'mfr': '\uD835\uDD2A',
    'mho': '\u2127',
    'micro': '\u00B5',
    'midcir': '\u2AF0',
    'minus': '\u2212',
    'minusdu': '\u2A2A',
    'mlcp': '\u2ADB',
    'models': '\u22A7',
    'mopf': '\uD835\uDD5E',
    'mscr': '\uD835\uDCC2',
    'mu': '\u03BC',
    'multimap': '\u22B8',
    'mumap': '\u22B8',
    'nGg': '\u22D9\u0338',
    'nGt': '\u226B\u20D2',
    'nLeftarrow': '\u21CD',
    'nlArr': '\u21CD',
    'nLeftrightarrow': '\u21CE',
    'nhArr': '\u21CE',
    'nLl': '\u22D8\u0338',
    'nLt': '\u226A\u20D2',
    'nRightarrow': '\u21CF',
    'nrArr': '\u21CF',
    'nVDash': '\u22AF',
    'nVdash': '\u22AE',
    'nacute': '\u0144',
    'nang': '\u2220\u20D2',
    'napE': '\u2A70\u0338',
    'napid': '\u224B\u0338',
    'napos': '\u0149',
    'natur': '\u266E',
    'natural': '\u266E',
    'ncap': '\u2A43',
    'ncaron': '\u0148',
    'ncedil': '\u0146',
    'ncongdot': '\u2A6D\u0338',
    'ncup': '\u2A42',
    'ncy': '\u043D',
    'ndash': '\u2013',
    'neArr': '\u21D7',
    'nearhk': '\u2924',
    'nedot': '\u2250\u0338',
    'nesear': '\u2928',
    'toea': '\u2928',
    'nfr': '\uD835\uDD2B',
    'nharr': '\u21AE',
    'nleftrightarrow': '\u21AE',
    'nhpar': '\u2AF2',
    'nis': '\u22FC',
    'nisd': '\u22FA',
    'njcy': '\u045A',
    'nlE': '\u2266\u0338',
    'nleqq': '\u2266\u0338',
    'nlarr': '\u219A',
    'nleftarrow': '\u219A',
    'nldr': '\u2025',
    'nopf': '\uD835\uDD5F',
    'not': '\u00AC',
    'notinE': '\u22F9\u0338',
    'notindot': '\u22F5\u0338',
    'notinvb': '\u22F7',
    'notinvc': '\u22F6',
    'notnivb': '\u22FE',
    'notnivc': '\u22FD',
    'nparsl': '\u2AFD\u20E5',
    'npart': '\u2202\u0338',
    'npolint': '\u2A14',
    'nrarr': '\u219B',
    'nrightarrow': '\u219B',
    'nrarrc': '\u2933\u0338',
    'nrarrw': '\u219D\u0338',
    'nscr': '\uD835\uDCC3',
    'nsub': '\u2284',
    'nsubE': '\u2AC5\u0338',
    'nsubseteqq': '\u2AC5\u0338',
    'nsup': '\u2285',
    'nsupE': '\u2AC6\u0338',
    'nsupseteqq': '\u2AC6\u0338',
    'ntilde': '\u00F1',
    'nu': '\u03BD',
    'num': '\u0023',
    'numero': '\u2116',
    'numsp': '\u2007',
    'nvDash': '\u22AD',
    'nvHarr': '\u2904',
    'nvap': '\u224D\u20D2',
    'nvdash': '\u22AC',
    'nvge': '\u2265\u20D2',
    'nvgt': '\u003E\u20D2',
    'nvinfin': '\u29DE',
    'nvlArr': '\u2902',
    'nvle': '\u2264\u20D2',
    'nvlt': '\u003C\u20D2',
    'nvltrie': '\u22B4\u20D2',
    'nvrArr': '\u2903',
    'nvrtrie': '\u22B5\u20D2',
    'nvsim': '\u223C\u20D2',
    'nwArr': '\u21D6',
    'nwarhk': '\u2923',
    'nwnear': '\u2927',
    'oacute': '\u00F3',
    'ocirc': '\u00F4',
    'ocy': '\u043E',
    'odblac': '\u0151',
    'odiv': '\u2A38',
    'odsold': '\u29BC',
    'oelig': '\u0153',
    'ofcir': '\u29BF',
    'ofr': '\uD835\uDD2C',
    'ogon': '\u02DB',
    'ograve': '\u00F2',
    'ogt': '\u29C1',
    'ohbar': '\u29B5',
    'olcir': '\u29BE',
    'olcross': '\u29BB',
    'olt': '\u29C0',
    'omacr': '\u014D',
    'omega': '\u03C9',
    'omicron': '\u03BF',
    'omid': '\u29B6',
    'oopf': '\uD835\uDD60',
    'opar': '\u29B7',
    'operp': '\u29B9',
    'or': '\u2228',
    'vee': '\u2228',
    'ord': '\u2A5D',
    'order': '\u2134',
    'orderof': '\u2134',
    'oscr': '\u2134',
    'ordf': '\u00AA',
    'ordm': '\u00BA',
    'origof': '\u22B6',
    'oror': '\u2A56',
    'orslope': '\u2A57',
    'orv': '\u2A5B',
    'oslash': '\u00F8',
    'osol': '\u2298',
    'otilde': '\u00F5',
    'otimesas': '\u2A36',
    'ouml': '\u00F6',
    'ovbar': '\u233D',
    'para': '\u00B6',
    'parsim': '\u2AF3',
    'parsl': '\u2AFD',
    'pcy': '\u043F',
    'percnt': '\u0025',
    'period': '\u002E',
    'permil': '\u2030',
    'pertenk': '\u2031',
    'pfr': '\uD835\uDD2D',
    'phi': '\u03C6',
    'phiv': '\u03D5',
    'straightphi': '\u03D5',
    'varphi': '\u03D5',
    'phone': '\u260E',
    'pi': '\u03C0',
    'piv': '\u03D6',
    'varpi': '\u03D6',
    'planckh': '\u210E',
    'plus': '\u002B',
    'plusacir': '\u2A23',
    'pluscir': '\u2A22',
    'plusdu': '\u2A25',
    'pluse': '\u2A72',
    'plussim': '\u2A26',
    'plustwo': '\u2A27',
    'pointint': '\u2A15',
    'popf': '\uD835\uDD61',
    'pound': '\u00A3',
    'prE': '\u2AB3',
    'prap': '\u2AB7',
    'precapprox': '\u2AB7',
    'precnapprox': '\u2AB9',
    'prnap': '\u2AB9',
    'precneqq': '\u2AB5',
    'prnE': '\u2AB5',
    'precnsim': '\u22E8',
    'prnsim': '\u22E8',
    'prime': '\u2032',
    'profalar': '\u232E',
    'profline': '\u2312',
    'profsurf': '\u2313',
    'prurel': '\u22B0',
    'pscr': '\uD835\uDCC5',
    'psi': '\u03C8',
    'puncsp': '\u2008',
    'qfr': '\uD835\uDD2E',
    'qopf': '\uD835\uDD62',
    'qprime': '\u2057',
    'qscr': '\uD835\uDCC6',
    'quatint': '\u2A16',
    'quest': '\u003F',
    'rAtail': '\u291C',
    'rHar': '\u2964',
    'race': '\u223D\u0331',
    'racute': '\u0155',
    'raemptyv': '\u29B3',
    'rangd': '\u2992',
    'range': '\u29A5',
    'raquo': '\u00BB',
    'rarrap': '\u2975',
    'rarrbfs': '\u2920',
    'rarrc': '\u2933',
    'rarrfs': '\u291E',
    'rarrpl': '\u2945',
    'rarrsim': '\u2974',
    'rarrtl': '\u21A3',
    'rightarrowtail': '\u21A3',
    'rarrw': '\u219D',
    'rightsquigarrow': '\u219D',
    'ratail': '\u291A',
    'ratio': '\u2236',
    'rbbrk': '\u2773',
    'rbrace': '\u007D',
    'rcub': '\u007D',
    'rbrack': '\u005D',
    'rsqb': '\u005D',
    'rbrke': '\u298C',
    'rbrksld': '\u298E',
    'rbrkslu': '\u2990',
    'rcaron': '\u0159',
    'rcedil': '\u0157',
    'rcy': '\u0440',
    'rdca': '\u2937',
    'rdldhar': '\u2969',
    'rdsh': '\u21B3',
    'rect': '\u25AD',
    'rfisht': '\u297D',
    'rfr': '\uD835\uDD2F',
    'rharul': '\u296C',
    'rho': '\u03C1',
    'rhov': '\u03F1',
    'varrho': '\u03F1',
    'rightrightarrows': '\u21C9',
    'rrarr': '\u21C9',
    'rightthreetimes': '\u22CC',
    'rthree': '\u22CC',
    'ring': '\u02DA',
    'rlm': '\u200F',
    'rmoust': '\u23B1',
    'rmoustache': '\u23B1',
    'rnmid': '\u2AEE',
    'roang': '\u27ED',
    'roarr': '\u21FE',
    'ropar': '\u2986',
    'ropf': '\uD835\uDD63',
    'roplus': '\u2A2E',
    'rotimes': '\u2A35',
    'rpar': '\u0029',
    'rpargt': '\u2994',
    'rppolint': '\u2A12',
    'rsaquo': '\u203A',
    'rscr': '\uD835\uDCC7',
    'rtimes': '\u22CA',
    'rtri': '\u25B9',
    'triangleright': '\u25B9',
    'rtriltri': '\u29CE',
    'ruluhar': '\u2968',
    'rx': '\u211E',
    'sacute': '\u015B',
    'scE': '\u2AB4',
    'scap': '\u2AB8',
    'succapprox': '\u2AB8',
    'scaron': '\u0161',
    'scedil': '\u015F',
    'scirc': '\u015D',
    'scnE': '\u2AB6',
    'succneqq': '\u2AB6',
    'scnap': '\u2ABA',
    'succnapprox': '\u2ABA',
    'scnsim': '\u22E9',
    'succnsim': '\u22E9',
    'scpolint': '\u2A13',
    'scy': '\u0441',
    'sdot': '\u22C5',
    'sdote': '\u2A66',
    'seArr': '\u21D8',
    'sect': '\u00A7',
    'semi': '\u003B',
    'seswar': '\u2929',
    'tosa': '\u2929',
    'sext': '\u2736',
    'sfr': '\uD835\uDD30',
    'sharp': '\u266F',
    'shchcy': '\u0449',
    'shcy': '\u0448',
    'shy': '\u00AD',
    'sigma': '\u03C3',
    'sigmaf': '\u03C2',
    'sigmav': '\u03C2',
    'varsigma': '\u03C2',
    'simdot': '\u2A6A',
    'simg': '\u2A9E',
    'simgE': '\u2AA0',
    'siml': '\u2A9D',
    'simlE': '\u2A9F',
    'simne': '\u2246',
    'simplus': '\u2A24',
    'simrarr': '\u2972',
    'smashp': '\u2A33',
    'smeparsl': '\u29E4',
    'smile': '\u2323',
    'ssmile': '\u2323',
    'smt': '\u2AAA',
    'smte': '\u2AAC',
    'smtes': '\u2AAC\uFE00',
    'softcy': '\u044C',
    'sol': '\u002F',
    'solb': '\u29C4',
    'solbar': '\u233F',
    'sopf': '\uD835\uDD64',
    'spades': '\u2660',
    'spadesuit': '\u2660',
    'sqcaps': '\u2293\uFE00',
    'sqcups': '\u2294\uFE00',
    'sscr': '\uD835\uDCC8',
    'star': '\u2606',
    'sub': '\u2282',
    'subset': '\u2282',
    'subE': '\u2AC5',
    'subseteqq': '\u2AC5',
    'subdot': '\u2ABD',
    'subedot': '\u2AC3',
    'submult': '\u2AC1',
    'subnE': '\u2ACB',
    'subsetneqq': '\u2ACB',
    'subne': '\u228A',
    'subsetneq': '\u228A',
    'subplus': '\u2ABF',
    'subrarr': '\u2979',
    'subsim': '\u2AC7',
    'subsub': '\u2AD5',
    'subsup': '\u2AD3',
    'sung': '\u266A',
    'sup1': '\u00B9',
    'sup2': '\u00B2',
    'sup3': '\u00B3',
    'supE': '\u2AC6',
    'supseteqq': '\u2AC6',
    'supdot': '\u2ABE',
    'supdsub': '\u2AD8',
    'supedot': '\u2AC4',
    'suphsol': '\u27C9',
    'suphsub': '\u2AD7',
    'suplarr': '\u297B',
    'supmult': '\u2AC2',
    'supnE': '\u2ACC',
    'supsetneqq': '\u2ACC',
    'supne': '\u228B',
    'supsetneq': '\u228B',
    'supplus': '\u2AC0',
    'supsim': '\u2AC8',
    'supsub': '\u2AD4',
    'supsup': '\u2AD6',
    'swArr': '\u21D9',
    'swnwar': '\u292A',
    'szlig': '\u00DF',
    'target': '\u2316',
    'tau': '\u03C4',
    'tcaron': '\u0165',
    'tcedil': '\u0163',
    'tcy': '\u0442',
    'telrec': '\u2315',
    'tfr': '\uD835\uDD31',
    'theta': '\u03B8',
    'thetasym': '\u03D1',
    'thetav': '\u03D1',
    'vartheta': '\u03D1',
    'thorn': '\u00FE',
    'times': '\u00D7',
    'timesbar': '\u2A31',
    'timesd': '\u2A30',
    'topbot': '\u2336',
    'topcir': '\u2AF1',
    'topf': '\uD835\uDD65',
    'topfork': '\u2ADA',
    'tprime': '\u2034',
    'triangle': '\u25B5',
    'utri': '\u25B5',
    'triangleq': '\u225C',
    'trie': '\u225C',
    'tridot': '\u25EC',
    'triminus': '\u2A3A',
    'triplus': '\u2A39',
    'trisb': '\u29CD',
    'tritime': '\u2A3B',
    'trpezium': '\u23E2',
    'tscr': '\uD835\uDCC9',
    'tscy': '\u0446',
    'tshcy': '\u045B',
    'tstrok': '\u0167',
    'uHar': '\u2963',
    'uacute': '\u00FA',
    'ubrcy': '\u045E',
    'ubreve': '\u016D',
    'ucirc': '\u00FB',
    'ucy': '\u0443',
    'udblac': '\u0171',
    'ufisht': '\u297E',
    'ufr': '\uD835\uDD32',
    'ugrave': '\u00F9',
    'uhblk': '\u2580',
    'ulcorn': '\u231C',
    'ulcorner': '\u231C',
    'ulcrop': '\u230F',
    'ultri': '\u25F8',
    'umacr': '\u016B',
    'uogon': '\u0173',
    'uopf': '\uD835\uDD66',
    'upsi': '\u03C5',
    'upsilon': '\u03C5',
    'upuparrows': '\u21C8',
    'uuarr': '\u21C8',
    'urcorn': '\u231D',
    'urcorner': '\u231D',
    'urcrop': '\u230E',
    'uring': '\u016F',
    'urtri': '\u25F9',
    'uscr': '\uD835\uDCCA',
    'utdot': '\u22F0',
    'utilde': '\u0169',
    'uuml': '\u00FC',
    'uwangle': '\u29A7',
    'vBar': '\u2AE8',
    'vBarv': '\u2AE9',
    'vangrt': '\u299C',
    'varsubsetneq': '\u228A\uFE00',
    'vsubne': '\u228A\uFE00',
    'varsubsetneqq': '\u2ACB\uFE00',
    'vsubnE': '\u2ACB\uFE00',
    'varsupsetneq': '\u228B\uFE00',
    'vsupne': '\u228B\uFE00',
    'varsupsetneqq': '\u2ACC\uFE00',
    'vsupnE': '\u2ACC\uFE00',
    'vcy': '\u0432',
    'veebar': '\u22BB',
    'veeeq': '\u225A',
    'vellip': '\u22EE',
    'vfr': '\uD835\uDD33',
    'vopf': '\uD835\uDD67',
    'vscr': '\uD835\uDCCB',
    'vzigzag': '\u299A',
    'wcirc': '\u0175',
    'wedbar': '\u2A5F',
    'wedgeq': '\u2259',
    'weierp': '\u2118',
    'wp': '\u2118',
    'wfr': '\uD835\uDD34',
    'wopf': '\uD835\uDD68',
    'wscr': '\uD835\uDCCC',
    'xfr': '\uD835\uDD35',
    'xi': '\u03BE',
    'xnis': '\u22FB',
    'xopf': '\uD835\uDD69',
    'xscr': '\uD835\uDCCD',
    'yacute': '\u00FD',
    'yacy': '\u044F',
    'ycirc': '\u0177',
    'ycy': '\u044B',
    'yen': '\u00A5',
    'yfr': '\uD835\uDD36',
    'yicy': '\u0457',
    'yopf': '\uD835\uDD6A',
    'yscr': '\uD835\uDCCE',
    'yucy': '\u044E',
    'yuml': '\u00FF',
    'zacute': '\u017A',
    'zcaron': '\u017E',
    'zcy': '\u0437',
    'zdot': '\u017C',
    'zeta': '\u03B6',
    'zfr': '\uD835\uDD37',
    'zhcy': '\u0436',
    'zigrarr': '\u21DD',
    'zopf': '\uD835\uDD6B',
    'zscr': '\uD835\uDCCF',
    'zwj': '\u200D',
    'zwnj': '\u200C'
};
// The &ngsp; pseudo-entity is denoting a space. see:
// https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart
const NGSP_UNICODE = '\uE500';
NAMED_ENTITIES['ngsp'] = NGSP_UNICODE;

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TokenError extends ParseError {
    constructor(errorMsg, tokenType, span) {
        super(span, errorMsg);
        this.tokenType = tokenType;
    }
}
class TokenizeResult {
    constructor(tokens, errors, nonNormalizedIcuExpressions) {
        this.tokens = tokens;
        this.errors = errors;
        this.nonNormalizedIcuExpressions = nonNormalizedIcuExpressions;
    }
}
function tokenize(source, url, getTagDefinition, options = {}) {
    const tokenizer = new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, options);
    tokenizer.tokenize();
    return new TokenizeResult(mergeTextTokens(tokenizer.tokens), tokenizer.errors, tokenizer.nonNormalizedIcuExpressions);
}
const _CR_OR_CRLF_REGEXP = /\r\n?/g;
function _unexpectedCharacterErrorMsg(charCode) {
    const char = charCode === $EOF ? 'EOF' : String.fromCharCode(charCode);
    return `Unexpected character "${char}"`;
}
function _unknownEntityErrorMsg(entitySrc) {
    return `Unknown entity "${entitySrc}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
function _unparsableEntityErrorMsg(type, entityStr) {
    return `Unable to parse entity "${entityStr}" - ${type} character reference entities must end with ";"`;
}
var CharacterReferenceType;
(function (CharacterReferenceType) {
    CharacterReferenceType["HEX"] = "hexadecimal";
    CharacterReferenceType["DEC"] = "decimal";
})(CharacterReferenceType || (CharacterReferenceType = {}));
class _ControlFlowError {
    constructor(error) {
        this.error = error;
    }
}
// See https://www.w3.org/TR/html51/syntax.html#writing-html-documents
class _Tokenizer {
    /**
     * @param _file The html source file being tokenized.
     * @param _getTagDefinition A function that will retrieve a tag definition for a given tag name.
     * @param options Configuration of the tokenization.
     */
    constructor(_file, _getTagDefinition, options) {
        this._getTagDefinition = _getTagDefinition;
        this._currentTokenStart = null;
        this._currentTokenType = null;
        this._expansionCaseStack = [];
        this._inInterpolation = false;
        this.tokens = [];
        this.errors = [];
        this.nonNormalizedIcuExpressions = [];
        this._tokenizeIcu = options.tokenizeExpansionForms || false;
        this._interpolationConfig = options.interpolationConfig || DEFAULT_INTERPOLATION_CONFIG;
        this._leadingTriviaCodePoints =
            options.leadingTriviaChars && options.leadingTriviaChars.map(c => c.codePointAt(0) || 0);
        const range = options.range || { endPos: _file.content.length, startPos: 0, startLine: 0, startCol: 0 };
        this._cursor = options.escapedString ? new EscapedCharacterCursor(_file, range) :
            new PlainCharacterCursor(_file, range);
        this._preserveLineEndings = options.preserveLineEndings || false;
        this._escapedString = options.escapedString || false;
        this._i18nNormalizeLineEndingsInICUs = options.i18nNormalizeLineEndingsInICUs || false;
        try {
            this._cursor.init();
        }
        catch (e) {
            this.handleError(e);
        }
    }
    _processCarriageReturns(content) {
        if (this._preserveLineEndings) {
            return content;
        }
        // https://www.w3.org/TR/html51/syntax.html#preprocessing-the-input-stream
        // In order to keep the original position in the source, we can not
        // pre-process it.
        // Instead CRs are processed right before instantiating the tokens.
        return content.replace(_CR_OR_CRLF_REGEXP, '\n');
    }
    tokenize() {
        while (this._cursor.peek() !== $EOF) {
            const start = this._cursor.clone();
            try {
                if (this._attemptCharCode($LT)) {
                    if (this._attemptCharCode($BANG)) {
                        if (this._attemptCharCode($LBRACKET)) {
                            this._consumeCdata(start);
                        }
                        else if (this._attemptCharCode($MINUS)) {
                            this._consumeComment(start);
                        }
                        else {
                            this._consumeDocType(start);
                        }
                    }
                    else if (this._attemptCharCode($SLASH)) {
                        this._consumeTagClose(start);
                    }
                    else {
                        this._consumeTagOpen(start);
                    }
                }
                else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
                    // In (possibly interpolated) text the end of the text is given by `isTextEnd()`, while
                    // the premature end of an interpolation is given by the start of a new HTML element.
                    this._consumeWithInterpolation(5 /* TEXT */, 8 /* INTERPOLATION */, () => this._isTextEnd(), () => this._isTagStart());
                }
            }
            catch (e) {
                this.handleError(e);
            }
        }
        this._beginToken(24 /* EOF */);
        this._endToken([]);
    }
    /**
     * @returns whether an ICU token has been created
     * @internal
     */
    _tokenizeExpansionForm() {
        if (this.isExpansionFormStart()) {
            this._consumeExpansionFormStart();
            return true;
        }
        if (isExpansionCaseStart(this._cursor.peek()) && this._isInExpansionForm()) {
            this._consumeExpansionCaseStart();
            return true;
        }
        if (this._cursor.peek() === $RBRACE) {
            if (this._isInExpansionCase()) {
                this._consumeExpansionCaseEnd();
                return true;
            }
            if (this._isInExpansionForm()) {
                this._consumeExpansionFormEnd();
                return true;
            }
        }
        return false;
    }
    _beginToken(type, start = this._cursor.clone()) {
        this._currentTokenStart = start;
        this._currentTokenType = type;
    }
    _endToken(parts, end) {
        if (this._currentTokenStart === null) {
            throw new TokenError('Programming error - attempted to end a token when there was no start to the token', this._currentTokenType, this._cursor.getSpan(end));
        }
        if (this._currentTokenType === null) {
            throw new TokenError('Programming error - attempted to end a token which has no token type', null, this._cursor.getSpan(this._currentTokenStart));
        }
        const token = {
            type: this._currentTokenType,
            parts,
            sourceSpan: (end ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints),
        };
        this.tokens.push(token);
        this._currentTokenStart = null;
        this._currentTokenType = null;
        return token;
    }
    _createError(msg, span) {
        if (this._isInExpansionForm()) {
            msg += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`;
        }
        const error = new TokenError(msg, this._currentTokenType, span);
        this._currentTokenStart = null;
        this._currentTokenType = null;
        return new _ControlFlowError(error);
    }
    handleError(e) {
        if (e instanceof CursorError) {
            e = this._createError(e.msg, this._cursor.getSpan(e.cursor));
        }
        if (e instanceof _ControlFlowError) {
            this.errors.push(e.error);
        }
        else {
            throw e;
        }
    }
    _attemptCharCode(charCode) {
        if (this._cursor.peek() === charCode) {
            this._cursor.advance();
            return true;
        }
        return false;
    }
    _attemptCharCodeCaseInsensitive(charCode) {
        if (compareCharCodeCaseInsensitive(this._cursor.peek(), charCode)) {
            this._cursor.advance();
            return true;
        }
        return false;
    }
    _requireCharCode(charCode) {
        const location = this._cursor.clone();
        if (!this._attemptCharCode(charCode)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
        }
    }
    _attemptStr(chars) {
        const len = chars.length;
        if (this._cursor.charsLeft() < len) {
            return false;
        }
        const initialPosition = this._cursor.clone();
        for (let i = 0; i < len; i++) {
            if (!this._attemptCharCode(chars.charCodeAt(i))) {
                // If attempting to parse the string fails, we want to reset the parser
                // to where it was before the attempt
                this._cursor = initialPosition;
                return false;
            }
        }
        return true;
    }
    _attemptStrCaseInsensitive(chars) {
        for (let i = 0; i < chars.length; i++) {
            if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    }
    _requireStr(chars) {
        const location = this._cursor.clone();
        if (!this._attemptStr(chars)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
        }
    }
    _attemptCharCodeUntilFn(predicate) {
        while (!predicate(this._cursor.peek())) {
            this._cursor.advance();
        }
    }
    _requireCharCodeUntilFn(predicate, len) {
        const start = this._cursor.clone();
        this._attemptCharCodeUntilFn(predicate);
        if (this._cursor.diff(start) < len) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
        }
    }
    _attemptUntilChar(char) {
        while (this._cursor.peek() !== char) {
            this._cursor.advance();
        }
    }
    _readChar() {
        // Don't rely upon reading directly from `_input` as the actual char value
        // may have been generated from an escape sequence.
        const char = String.fromCodePoint(this._cursor.peek());
        this._cursor.advance();
        return char;
    }
    _consumeEntity(textTokenType) {
        this._beginToken(9 /* ENCODED_ENTITY */);
        const start = this._cursor.clone();
        this._cursor.advance();
        if (this._attemptCharCode($HASH)) {
            const isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
            const codeStart = this._cursor.clone();
            this._attemptCharCodeUntilFn(isDigitEntityEnd);
            if (this._cursor.peek() != $SEMICOLON) {
                // Advance cursor to include the peeked character in the string provided to the error
                // message.
                this._cursor.advance();
                const entityType = isHex ? CharacterReferenceType.HEX : CharacterReferenceType.DEC;
                throw this._createError(_unparsableEntityErrorMsg(entityType, this._cursor.getChars(start)), this._cursor.getSpan());
            }
            const strNum = this._cursor.getChars(codeStart);
            this._cursor.advance();
            try {
                const charCode = parseInt(strNum, isHex ? 16 : 10);
                this._endToken([String.fromCharCode(charCode), this._cursor.getChars(start)]);
            }
            catch {
                throw this._createError(_unknownEntityErrorMsg(this._cursor.getChars(start)), this._cursor.getSpan());
            }
        }
        else {
            const nameStart = this._cursor.clone();
            this._attemptCharCodeUntilFn(isNamedEntityEnd);
            if (this._cursor.peek() != $SEMICOLON) {
                // No semicolon was found so abort the encoded entity token that was in progress, and treat
                // this as a text token
                this._beginToken(textTokenType, start);
                this._cursor = nameStart;
                this._endToken(['&']);
            }
            else {
                const name = this._cursor.getChars(nameStart);
                this._cursor.advance();
                const char = NAMED_ENTITIES[name];
                if (!char) {
                    throw this._createError(_unknownEntityErrorMsg(name), this._cursor.getSpan(start));
                }
                this._endToken([char, `&${name};`]);
            }
        }
    }
    _consumeRawText(consumeEntities, endMarkerPredicate) {
        this._beginToken(consumeEntities ? 6 /* ESCAPABLE_RAW_TEXT */ : 7 /* RAW_TEXT */);
        const parts = [];
        while (true) {
            const tagCloseStart = this._cursor.clone();
            const foundEndMarker = endMarkerPredicate();
            this._cursor = tagCloseStart;
            if (foundEndMarker) {
                break;
            }
            if (consumeEntities && this._cursor.peek() === $AMPERSAND) {
                this._endToken([this._processCarriageReturns(parts.join(''))]);
                parts.length = 0;
                this._consumeEntity(6 /* ESCAPABLE_RAW_TEXT */);
                this._beginToken(6 /* ESCAPABLE_RAW_TEXT */);
            }
            else {
                parts.push(this._readChar());
            }
        }
        this._endToken([this._processCarriageReturns(parts.join(''))]);
    }
    _consumeComment(start) {
        this._beginToken(10 /* COMMENT_START */, start);
        this._requireCharCode($MINUS);
        this._endToken([]);
        this._consumeRawText(false, () => this._attemptStr('-->'));
        this._beginToken(11 /* COMMENT_END */);
        this._requireStr('-->');
        this._endToken([]);
    }
    _consumeCdata(start) {
        this._beginToken(12 /* CDATA_START */, start);
        this._requireStr('CDATA[');
        this._endToken([]);
        this._consumeRawText(false, () => this._attemptStr(']]>'));
        this._beginToken(13 /* CDATA_END */);
        this._requireStr(']]>');
        this._endToken([]);
    }
    _consumeDocType(start) {
        this._beginToken(18 /* DOC_TYPE */, start);
        const contentStart = this._cursor.clone();
        this._attemptUntilChar($GT);
        const content = this._cursor.getChars(contentStart);
        this._cursor.advance();
        this._endToken([content]);
    }
    _consumePrefixAndName() {
        const nameOrPrefixStart = this._cursor.clone();
        let prefix = '';
        while (this._cursor.peek() !== $COLON && !isPrefixEnd(this._cursor.peek())) {
            this._cursor.advance();
        }
        let nameStart;
        if (this._cursor.peek() === $COLON) {
            prefix = this._cursor.getChars(nameOrPrefixStart);
            this._cursor.advance();
            nameStart = this._cursor.clone();
        }
        else {
            nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, prefix === '' ? 0 : 1);
        const name = this._cursor.getChars(nameStart);
        return [prefix, name];
    }
    _consumeTagOpen(start) {
        let tagName;
        let prefix;
        let openTagToken;
        try {
            if (!isAsciiLetter(this._cursor.peek())) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
            }
            openTagToken = this._consumeTagOpenStart(start);
            prefix = openTagToken.parts[0];
            tagName = openTagToken.parts[1];
            this._attemptCharCodeUntilFn(isNotWhitespace);
            while (this._cursor.peek() !== $SLASH && this._cursor.peek() !== $GT &&
                this._cursor.peek() !== $LT && this._cursor.peek() !== $EOF) {
                this._consumeAttributeName();
                this._attemptCharCodeUntilFn(isNotWhitespace);
                if (this._attemptCharCode($EQ)) {
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                    this._consumeAttributeValue();
                }
                this._attemptCharCodeUntilFn(isNotWhitespace);
            }
            this._consumeTagOpenEnd();
        }
        catch (e) {
            if (e instanceof _ControlFlowError) {
                if (openTagToken) {
                    // We errored before we could close the opening tag, so it is incomplete.
                    openTagToken.type = 4 /* INCOMPLETE_TAG_OPEN */;
                }
                else {
                    // When the start tag is invalid, assume we want a "<" as text.
                    // Back to back text tokens are merged at the end.
                    this._beginToken(5 /* TEXT */, start);
                    this._endToken(['<']);
                }
                return;
            }
            throw e;
        }
        const contentTokenType = this._getTagDefinition(tagName).getContentType(prefix);
        if (contentTokenType === TagContentType.RAW_TEXT) {
            this._consumeRawTextWithTagClose(prefix, tagName, false);
        }
        else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
            this._consumeRawTextWithTagClose(prefix, tagName, true);
        }
    }
    _consumeRawTextWithTagClose(prefix, tagName, consumeEntities) {
        this._consumeRawText(consumeEntities, () => {
            if (!this._attemptCharCode($LT))
                return false;
            if (!this._attemptCharCode($SLASH))
                return false;
            this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!this._attemptStrCaseInsensitive(tagName))
                return false;
            this._attemptCharCodeUntilFn(isNotWhitespace);
            return this._attemptCharCode($GT);
        });
        this._beginToken(3 /* TAG_CLOSE */);
        this._requireCharCodeUntilFn(code => code === $GT, 3);
        this._cursor.advance(); // Consume the `>`
        this._endToken([prefix, tagName]);
    }
    _consumeTagOpenStart(start) {
        this._beginToken(0 /* TAG_OPEN_START */, start);
        const parts = this._consumePrefixAndName();
        return this._endToken(parts);
    }
    _consumeAttributeName() {
        const attrNameStart = this._cursor.peek();
        if (attrNameStart === $SQ || attrNameStart === $DQ) {
            throw this._createError(_unexpectedCharacterErrorMsg(attrNameStart), this._cursor.getSpan());
        }
        this._beginToken(14 /* ATTR_NAME */);
        const prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
    }
    _consumeAttributeValue() {
        let value;
        if (this._cursor.peek() === $SQ || this._cursor.peek() === $DQ) {
            const quoteChar = this._cursor.peek();
            this._consumeQuote(quoteChar);
            // In an attribute then end of the attribute value and the premature end to an interpolation
            // are both triggered by the `quoteChar`.
            const endPredicate = () => this._cursor.peek() === quoteChar;
            this._consumeWithInterpolation(16 /* ATTR_VALUE_TEXT */, 17 /* ATTR_VALUE_INTERPOLATION */, endPredicate, endPredicate);
            this._consumeQuote(quoteChar);
        }
        else {
            const endPredicate = () => isNameEnd(this._cursor.peek());
            this._consumeWithInterpolation(16 /* ATTR_VALUE_TEXT */, 17 /* ATTR_VALUE_INTERPOLATION */, endPredicate, endPredicate);
        }
    }
    _consumeQuote(quoteChar) {
        this._beginToken(15 /* ATTR_QUOTE */);
        this._requireCharCode(quoteChar);
        this._endToken([String.fromCodePoint(quoteChar)]);
    }
    _consumeTagOpenEnd() {
        const tokenType = this._attemptCharCode($SLASH) ? 2 /* TAG_OPEN_END_VOID */ : 1 /* TAG_OPEN_END */;
        this._beginToken(tokenType);
        this._requireCharCode($GT);
        this._endToken([]);
    }
    _consumeTagClose(start) {
        this._beginToken(3 /* TAG_CLOSE */, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        const prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode($GT);
        this._endToken(prefixAndName);
    }
    _consumeExpansionFormStart() {
        this._beginToken(19 /* EXPANSION_FORM_START */);
        this._requireCharCode($LBRACE);
        this._endToken([]);
        this._expansionCaseStack.push(19 /* EXPANSION_FORM_START */);
        this._beginToken(7 /* RAW_TEXT */);
        const condition = this._readUntil($COMMA);
        const normalizedCondition = this._processCarriageReturns(condition);
        if (this._i18nNormalizeLineEndingsInICUs) {
            // We explicitly want to normalize line endings for this text.
            this._endToken([normalizedCondition]);
        }
        else {
            // We are not normalizing line endings.
            const conditionToken = this._endToken([condition]);
            if (normalizedCondition !== condition) {
                this.nonNormalizedIcuExpressions.push(conditionToken);
            }
        }
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(7 /* RAW_TEXT */);
        const type = this._readUntil($COMMA);
        this._endToken([type]);
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
    }
    _consumeExpansionCaseStart() {
        this._beginToken(20 /* EXPANSION_CASE_VALUE */);
        const value = this._readUntil($LBRACE).trim();
        this._endToken([value]);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(21 /* EXPANSION_CASE_EXP_START */);
        this._requireCharCode($LBRACE);
        this._endToken([]);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.push(21 /* EXPANSION_CASE_EXP_START */);
    }
    _consumeExpansionCaseEnd() {
        this._beginToken(22 /* EXPANSION_CASE_EXP_END */);
        this._requireCharCode($RBRACE);
        this._endToken([]);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.pop();
    }
    _consumeExpansionFormEnd() {
        this._beginToken(23 /* EXPANSION_FORM_END */);
        this._requireCharCode($RBRACE);
        this._endToken([]);
        this._expansionCaseStack.pop();
    }
    /**
     * Consume a string that may contain interpolation expressions.
     *
     * The first token consumed will be of `tokenType` and then there will be alternating
     * `interpolationTokenType` and `tokenType` tokens until the `endPredicate()` returns true.
     *
     * If an interpolation token ends prematurely it will have no end marker in its `parts` array.
     *
     * @param textTokenType the kind of tokens to interleave around interpolation tokens.
     * @param interpolationTokenType the kind of tokens that contain interpolation.
     * @param endPredicate a function that should return true when we should stop consuming.
     * @param endInterpolation a function that should return true if there is a premature end to an
     *     interpolation expression - i.e. before we get to the normal interpolation closing marker.
     */
    _consumeWithInterpolation(textTokenType, interpolationTokenType, endPredicate, endInterpolation) {
        this._beginToken(textTokenType);
        const parts = [];
        while (!endPredicate()) {
            const current = this._cursor.clone();
            if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
                this._endToken([this._processCarriageReturns(parts.join(''))], current);
                parts.length = 0;
                this._consumeInterpolation(interpolationTokenType, current, endInterpolation);
                this._beginToken(textTokenType);
            }
            else if (this._cursor.peek() === $AMPERSAND) {
                this._endToken([this._processCarriageReturns(parts.join(''))]);
                parts.length = 0;
                this._consumeEntity(textTokenType);
                this._beginToken(textTokenType);
            }
            else {
                parts.push(this._readChar());
            }
        }
        // It is possible that an interpolation was started but not ended inside this text token.
        // Make sure that we reset the state of the lexer correctly.
        this._inInterpolation = false;
        this._endToken([this._processCarriageReturns(parts.join(''))]);
    }
    /**
     * Consume a block of text that has been interpreted as an Angular interpolation.
     *
     * @param interpolationTokenType the type of the interpolation token to generate.
     * @param interpolationStart a cursor that points to the start of this interpolation.
     * @param prematureEndPredicate a function that should return true if the next characters indicate
     *     an end to the interpolation before its normal closing marker.
     */
    _consumeInterpolation(interpolationTokenType, interpolationStart, prematureEndPredicate) {
        const parts = [];
        this._beginToken(interpolationTokenType, interpolationStart);
        parts.push(this._interpolationConfig.start);
        // Find the end of the interpolation, ignoring content inside quotes.
        const expressionStart = this._cursor.clone();
        let inQuote = null;
        let inComment = false;
        while (this._cursor.peek() !== $EOF &&
            (prematureEndPredicate === null || !prematureEndPredicate())) {
            const current = this._cursor.clone();
            if (this._isTagStart()) {
                // We are starting what looks like an HTML element in the middle of this interpolation.
                // Reset the cursor to before the `<` character and end the interpolation token.
                // (This is actually wrong but here for backward compatibility).
                this._cursor = current;
                parts.push(this._getProcessedChars(expressionStart, current));
                this._endToken(parts);
                return;
            }
            if (inQuote === null) {
                if (this._attemptStr(this._interpolationConfig.end)) {
                    // We are not in a string, and we hit the end interpolation marker
                    parts.push(this._getProcessedChars(expressionStart, current));
                    parts.push(this._interpolationConfig.end);
                    this._endToken(parts);
                    return;
                }
                else if (this._attemptStr('//')) {
                    // Once we are in a comment we ignore any quotes
                    inComment = true;
                }
            }
            const char = this._cursor.peek();
            this._cursor.advance();
            if (char === $BACKSLASH) {
                // Skip the next character because it was escaped.
                this._cursor.advance();
            }
            else if (char === inQuote) {
                // Exiting the current quoted string
                inQuote = null;
            }
            else if (!inComment && inQuote === null && isQuote(char)) {
                // Entering a new quoted string
                inQuote = char;
            }
        }
        // We hit EOF without finding a closing interpolation marker
        parts.push(this._getProcessedChars(expressionStart, this._cursor));
        this._endToken(parts);
    }
    _getProcessedChars(start, end) {
        return this._processCarriageReturns(end.getChars(start));
    }
    _isTextEnd() {
        if (this._isTagStart() || this._cursor.peek() === $EOF) {
            return true;
        }
        if (this._tokenizeIcu && !this._inInterpolation) {
            if (this.isExpansionFormStart()) {
                // start of an expansion form
                return true;
            }
            if (this._cursor.peek() === $RBRACE && this._isInExpansionCase()) {
                // end of and expansion case
                return true;
            }
        }
        return false;
    }
    /**
     * Returns true if the current cursor is pointing to the start of a tag
     * (opening/closing/comments/cdata/etc).
     */
    _isTagStart() {
        if (this._cursor.peek() === $LT) {
            // We assume that `<` followed by whitespace is not the start of an HTML element.
            const tmp = this._cursor.clone();
            tmp.advance();
            // If the next character is alphabetic, ! nor / then it is a tag start
            const code = tmp.peek();
            if (($a <= code && code <= $z) || ($A <= code && code <= $Z) ||
                code === $SLASH || code === $BANG) {
                return true;
            }
        }
        return false;
    }
    _readUntil(char) {
        const start = this._cursor.clone();
        this._attemptUntilChar(char);
        return this._cursor.getChars(start);
    }
    _isInExpansionCase() {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                21 /* EXPANSION_CASE_EXP_START */;
    }
    _isInExpansionForm() {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                19 /* EXPANSION_FORM_START */;
    }
    isExpansionFormStart() {
        if (this._cursor.peek() !== $LBRACE) {
            return false;
        }
        if (this._interpolationConfig) {
            const start = this._cursor.clone();
            const isInterpolation = this._attemptStr(this._interpolationConfig.start);
            this._cursor = start;
            return !isInterpolation;
        }
        return true;
    }
}
function isNotWhitespace(code) {
    return !isWhitespace(code) || code === $EOF;
}
function isNameEnd(code) {
    return isWhitespace(code) || code === $GT || code === $LT ||
        code === $SLASH || code === $SQ || code === $DQ || code === $EQ ||
        code === $EOF;
}
function isPrefixEnd(code) {
    return (code < $a || $z < code) && (code < $A || $Z < code) &&
        (code < $0 || code > $9);
}
function isDigitEntityEnd(code) {
    return code === $SEMICOLON || code === $EOF || !isAsciiHexDigit(code);
}
function isNamedEntityEnd(code) {
    return code === $SEMICOLON || code === $EOF || !isAsciiLetter(code);
}
function isExpansionCaseStart(peek) {
    return peek !== $RBRACE;
}
function compareCharCodeCaseInsensitive(code1, code2) {
    return toUpperCaseCharCode(code1) === toUpperCaseCharCode(code2);
}
function toUpperCaseCharCode(code) {
    return code >= $a && code <= $z ? code - $a + $A : code;
}
function mergeTextTokens(srcTokens) {
    const dstTokens = [];
    let lastDstToken = undefined;
    for (let i = 0; i < srcTokens.length; i++) {
        const token = srcTokens[i];
        if ((lastDstToken && lastDstToken.type === 5 /* TEXT */ && token.type === 5 /* TEXT */) ||
            (lastDstToken && lastDstToken.type === 16 /* ATTR_VALUE_TEXT */ &&
                token.type === 16 /* ATTR_VALUE_TEXT */)) {
            lastDstToken.parts[0] += token.parts[0];
            lastDstToken.sourceSpan.end = token.sourceSpan.end;
        }
        else {
            lastDstToken = token;
            dstTokens.push(lastDstToken);
        }
    }
    return dstTokens;
}
class PlainCharacterCursor {
    constructor(fileOrCursor, range) {
        if (fileOrCursor instanceof PlainCharacterCursor) {
            this.file = fileOrCursor.file;
            this.input = fileOrCursor.input;
            this.end = fileOrCursor.end;
            const state = fileOrCursor.state;
            // Note: avoid using `{...fileOrCursor.state}` here as that has a severe performance penalty.
            // In ES5 bundles the object spread operator is translated into the `__assign` helper, which
            // is not optimized by VMs as efficiently as a raw object literal. Since this constructor is
            // called in tight loops, this difference matters.
            this.state = {
                peek: state.peek,
                offset: state.offset,
                line: state.line,
                column: state.column,
            };
        }
        else {
            if (!range) {
                throw new Error('Programming error: the range argument must be provided with a file argument.');
            }
            this.file = fileOrCursor;
            this.input = fileOrCursor.content;
            this.end = range.endPos;
            this.state = {
                peek: -1,
                offset: range.startPos,
                line: range.startLine,
                column: range.startCol,
            };
        }
    }
    clone() {
        return new PlainCharacterCursor(this);
    }
    peek() {
        return this.state.peek;
    }
    charsLeft() {
        return this.end - this.state.offset;
    }
    diff(other) {
        return this.state.offset - other.state.offset;
    }
    advance() {
        this.advanceState(this.state);
    }
    init() {
        this.updatePeek(this.state);
    }
    getSpan(start, leadingTriviaCodePoints) {
        start = start || this;
        let fullStart = start;
        if (leadingTriviaCodePoints) {
            while (this.diff(start) > 0 && leadingTriviaCodePoints.indexOf(start.peek()) !== -1) {
                if (fullStart === start) {
                    start = start.clone();
                }
                start.advance();
            }
        }
        const startLocation = this.locationFromCursor(start);
        const endLocation = this.locationFromCursor(this);
        const fullStartLocation = fullStart !== start ? this.locationFromCursor(fullStart) : startLocation;
        return new ParseSourceSpan(startLocation, endLocation, fullStartLocation);
    }
    getChars(start) {
        return this.input.substring(start.state.offset, this.state.offset);
    }
    charAt(pos) {
        return this.input.charCodeAt(pos);
    }
    advanceState(state) {
        if (state.offset >= this.end) {
            this.state = state;
            throw new CursorError('Unexpected character "EOF"', this);
        }
        const currentChar = this.charAt(state.offset);
        if (currentChar === $LF) {
            state.line++;
            state.column = 0;
        }
        else if (!isNewLine(currentChar)) {
            state.column++;
        }
        state.offset++;
        this.updatePeek(state);
    }
    updatePeek(state) {
        state.peek = state.offset >= this.end ? $EOF : this.charAt(state.offset);
    }
    locationFromCursor(cursor) {
        return new ParseLocation(cursor.file, cursor.state.offset, cursor.state.line, cursor.state.column);
    }
}
class EscapedCharacterCursor extends PlainCharacterCursor {
    constructor(fileOrCursor, range) {
        if (fileOrCursor instanceof EscapedCharacterCursor) {
            super(fileOrCursor);
            this.internalState = { ...fileOrCursor.internalState };
        }
        else {
            super(fileOrCursor, range);
            this.internalState = this.state;
        }
    }
    advance() {
        this.state = this.internalState;
        super.advance();
        this.processEscapeSequence();
    }
    init() {
        super.init();
        this.processEscapeSequence();
    }
    clone() {
        return new EscapedCharacterCursor(this);
    }
    getChars(start) {
        const cursor = start.clone();
        let chars = '';
        while (cursor.internalState.offset < this.internalState.offset) {
            chars += String.fromCodePoint(cursor.peek());
            cursor.advance();
        }
        return chars;
    }
    /**
     * Process the escape sequence that starts at the current position in the text.
     *
     * This method is called to ensure that `peek` has the unescaped value of escape sequences.
     */
    processEscapeSequence() {
        const peek = () => this.internalState.peek;
        if (peek() === $BACKSLASH) {
            // We have hit an escape sequence so we need the internal state to become independent
            // of the external state.
            this.internalState = { ...this.state };
            // Move past the backslash
            this.advanceState(this.internalState);
            // First check for standard control char sequences
            if (peek() === $n) {
                this.state.peek = $LF;
            }
            else if (peek() === $r) {
                this.state.peek = $CR;
            }
            else if (peek() === $v) {
                this.state.peek = $VTAB;
            }
            else if (peek() === $t) {
                this.state.peek = $TAB;
            }
            else if (peek() === $b) {
                this.state.peek = $BSPACE;
            }
            else if (peek() === $f) {
                this.state.peek = $FF;
            }
            // Now consider more complex sequences
            else if (peek() === $u) {
                // Unicode code-point sequence
                this.advanceState(this.internalState); // advance past the `u` char
                if (peek() === $LBRACE) {
                    // Variable length Unicode, e.g. `\x{123}`
                    this.advanceState(this.internalState); // advance past the `{` char
                    // Advance past the variable number of hex digits until we hit a `}` char
                    const digitStart = this.clone();
                    let length = 0;
                    while (peek() !== $RBRACE) {
                        this.advanceState(this.internalState);
                        length++;
                    }
                    this.state.peek = this.decodeHexDigits(digitStart, length);
                }
                else {
                    // Fixed length Unicode, e.g. `\u1234`
                    const digitStart = this.clone();
                    this.advanceState(this.internalState);
                    this.advanceState(this.internalState);
                    this.advanceState(this.internalState);
                    this.state.peek = this.decodeHexDigits(digitStart, 4);
                }
            }
            else if (peek() === $x) {
                // Hex char code, e.g. `\x2F`
                this.advanceState(this.internalState); // advance past the `x` char
                const digitStart = this.clone();
                this.advanceState(this.internalState);
                this.state.peek = this.decodeHexDigits(digitStart, 2);
            }
            else if (isOctalDigit(peek())) {
                // Octal char code, e.g. `\012`,
                let octal = '';
                let length = 0;
                let previous = this.clone();
                while (isOctalDigit(peek()) && length < 3) {
                    previous = this.clone();
                    octal += String.fromCodePoint(peek());
                    this.advanceState(this.internalState);
                    length++;
                }
                this.state.peek = parseInt(octal, 8);
                // Backup one char
                this.internalState = previous.internalState;
            }
            else if (isNewLine(this.internalState.peek)) {
                // Line continuation `\` followed by a new line
                this.advanceState(this.internalState); // advance over the newline
                this.state = this.internalState;
            }
            else {
                // If none of the `if` blocks were executed then we just have an escaped normal character.
                // In that case we just, effectively, skip the backslash from the character.
                this.state.peek = this.internalState.peek;
            }
        }
    }
    decodeHexDigits(start, length) {
        const hex = this.input.substr(start.internalState.offset, length);
        const charCode = parseInt(hex, 16);
        if (!isNaN(charCode)) {
            return charCode;
        }
        else {
            start.state = start.internalState;
            throw new CursorError('Invalid hexadecimal escape sequence', start);
        }
    }
}
class CursorError {
    constructor(msg, cursor) {
        this.msg = msg;
        this.cursor = cursor;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TreeError extends ParseError {
    constructor(elementName, span, msg) {
        super(span, msg);
        this.elementName = elementName;
    }
    static create(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    }
}
class ParseTreeResult {
    constructor(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
}
class Parser {
    constructor(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    parse(source, url, options) {
        const tokenizeResult = tokenize(source, url, this.getTagDefinition, options);
        const parser = new _TreeBuilder(tokenizeResult.tokens, this.getTagDefinition);
        parser.build();
        return new ParseTreeResult(parser.rootNodes, tokenizeResult.errors.concat(parser.errors));
    }
}
class _TreeBuilder {
    constructor(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._elementStack = [];
        this.rootNodes = [];
        this.errors = [];
        this._advance();
    }
    build() {
        while (this._peek.type !== 24 /* EOF */) {
            if (this._peek.type === 0 /* TAG_OPEN_START */ ||
                this._peek.type === 4 /* INCOMPLETE_TAG_OPEN */) {
                this._consumeStartTag(this._advance());
            }
            else if (this._peek.type === 3 /* TAG_CLOSE */) {
                this._consumeEndTag(this._advance());
            }
            else if (this._peek.type === 12 /* CDATA_START */) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this._peek.type === 10 /* COMMENT_START */) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this._peek.type === 5 /* TEXT */ || this._peek.type === 7 /* RAW_TEXT */ ||
                this._peek.type === 6 /* ESCAPABLE_RAW_TEXT */) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this._peek.type === 19 /* EXPANSION_FORM_START */) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
    }
    _advance() {
        const prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }
    _advanceIf(type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    }
    _consumeCdata(_startToken) {
        this._consumeText(this._advance());
        this._advanceIf(13 /* CDATA_END */);
    }
    _consumeComment(token) {
        const text = this._advanceIf(7 /* RAW_TEXT */);
        this._advanceIf(11 /* COMMENT_END */);
        const value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new Comment(value, token.sourceSpan));
    }
    _consumeExpansion(token) {
        const switchValue = this._advance();
        const type = this._advance();
        const cases = [];
        // read =
        while (this._peek.type === 20 /* EXPANSION_CASE_VALUE */) {
            const expCase = this._parseExpansionCase();
            if (!expCase)
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== 23 /* EXPANSION_FORM_END */) {
            this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
            return;
        }
        const sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end, token.sourceSpan.fullStart);
        this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    }
    _parseExpansionCase() {
        const value = this._advance();
        // read {
        if (this._peek.type !== 21 /* EXPANSION_CASE_EXP_START */) {
            this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
            return null;
        }
        // read until }
        const start = this._advance();
        const exp = this._collectExpansionExpTokens(start);
        if (!exp)
            return null;
        const end = this._advance();
        exp.push({ type: 24 /* EOF */, parts: [], sourceSpan: end.sourceSpan });
        // parse everything in between { and }
        const expansionCaseParser = new _TreeBuilder(exp, this.getTagDefinition);
        expansionCaseParser.build();
        if (expansionCaseParser.errors.length > 0) {
            this.errors = this.errors.concat(expansionCaseParser.errors);
            return null;
        }
        const sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end, value.sourceSpan.fullStart);
        const expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end, start.sourceSpan.fullStart);
        return new ExpansionCase(value.parts[0], expansionCaseParser.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    }
    _collectExpansionExpTokens(start) {
        const exp = [];
        const expansionFormStack = [21 /* EXPANSION_CASE_EXP_START */];
        while (true) {
            if (this._peek.type === 19 /* EXPANSION_FORM_START */ ||
                this._peek.type === 21 /* EXPANSION_CASE_EXP_START */) {
                expansionFormStack.push(this._peek.type);
            }
            if (this._peek.type === 22 /* EXPANSION_CASE_EXP_END */) {
                if (lastOnStack(expansionFormStack, 21 /* EXPANSION_CASE_EXP_START */)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length === 0)
                        return exp;
                }
                else {
                    this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === 23 /* EXPANSION_FORM_END */) {
                if (lastOnStack(expansionFormStack, 19 /* EXPANSION_FORM_START */)) {
                    expansionFormStack.pop();
                }
                else {
                    this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === 24 /* EOF */) {
                this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                return null;
            }
            exp.push(this._advance());
        }
    }
    _consumeText(token) {
        const tokens = [token];
        const startSpan = token.sourceSpan;
        let text = token.parts[0];
        if (text.length > 0 && text[0] === '\n') {
            const parent = this._getParentElement();
            if (parent != null && parent.children.length === 0 &&
                this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
                tokens[0] = { type: token.type, sourceSpan: token.sourceSpan, parts: [text] };
            }
        }
        while (this._peek.type === 8 /* INTERPOLATION */ || this._peek.type === 5 /* TEXT */ ||
            this._peek.type === 9 /* ENCODED_ENTITY */) {
            token = this._advance();
            tokens.push(token);
            if (token.type === 8 /* INTERPOLATION */) {
                // For backward compatibility we decode HTML entities that appear in interpolation
                // expressions. This is arguably a bug, but it could be a considerable breaking change to
                // fix it. It should be addressed in a larger project to refactor the entire parser/lexer
                // chain after View Engine has been removed.
                text += token.parts.join('').replace(/&([^;]+);/g, decodeEntity);
            }
            else if (token.type === 9 /* ENCODED_ENTITY */) {
                text += token.parts[0];
            }
            else {
                text += token.parts.join('');
            }
        }
        if (text.length > 0) {
            const endSpan = token.sourceSpan;
            this._addToParent(new Text(text, new ParseSourceSpan(startSpan.start, endSpan.end, startSpan.fullStart, startSpan.details), tokens));
        }
    }
    _closeVoidElement() {
        const el = this._getParentElement();
        if (el && this.getTagDefinition(el.name).isVoid) {
            this._elementStack.pop();
        }
    }
    _consumeStartTag(startTagToken) {
        const [prefix, name] = startTagToken.parts;
        const attrs = [];
        while (this._peek.type === 14 /* ATTR_NAME */) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        const fullName = this._getElementFullName(prefix, name, this._getParentElement());
        let selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === 2 /* TAG_OPEN_END_VOID */) {
            this._advance();
            selfClosing = true;
            const tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this.errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void and foreign elements can be self closed "${startTagToken.parts[1]}"`));
            }
        }
        else if (this._peek.type === 1 /* TAG_OPEN_END */) {
            this._advance();
            selfClosing = false;
        }
        const end = this._peek.sourceSpan.fullStart;
        const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
        // Create a separate `startSpan` because `span` will be modified when there is an `end` span.
        const startSpan = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
        const el = new Element(fullName, attrs, [], span, startSpan, undefined);
        this._pushElement(el);
        if (selfClosing) {
            // Elements that are self-closed have their `endSourceSpan` set to the full span, as the
            // element start tag also represents the end tag.
            this._popElement(fullName, span);
        }
        else if (startTagToken.type === 4 /* INCOMPLETE_TAG_OPEN */) {
            // We already know the opening tag is not complete, so it is unlikely it has a corresponding
            // close tag. Let's optimistically parse it as a full element and emit an error.
            this._popElement(fullName, null);
            this.errors.push(TreeError.create(fullName, span, `Opening tag "${fullName}" not terminated.`));
        }
    }
    _pushElement(el) {
        const parentEl = this._getParentElement();
        if (parentEl && this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
            this._elementStack.pop();
        }
        this._addToParent(el);
        this._elementStack.push(el);
    }
    _consumeEndTag(endTagToken) {
        const fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this.getTagDefinition(fullName).isVoid) {
            this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
        }
        else if (!this._popElement(fullName, endTagToken.sourceSpan)) {
            const errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
            this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    }
    /**
     * Closes the nearest element with the tag name `fullName` in the parse tree.
     * `endSourceSpan` is the span of the closing tag, or null if the element does
     * not have a closing tag (for example, this happens when an incomplete
     * opening tag is recovered).
     */
    _popElement(fullName, endSourceSpan) {
        let unexpectedCloseTagDetected = false;
        for (let stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            const el = this._elementStack[stackIndex];
            if (el.name === fullName) {
                // Record the parse span with the element that is being closed. Any elements that are
                // removed from the element stack at this point are closed implicitly, so they won't get
                // an end source span (as there is no explicit closing element).
                el.endSourceSpan = endSourceSpan;
                el.sourceSpan.end = endSourceSpan !== null ? endSourceSpan.end : el.sourceSpan.end;
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return !unexpectedCloseTagDetected;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                // Note that we encountered an unexpected close tag but continue processing the element
                // stack so we can assign an `endSourceSpan` if there is a corresponding start tag for this
                // end tag in the stack.
                unexpectedCloseTagDetected = true;
            }
        }
        return false;
    }
    _consumeAttr(attrName) {
        const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        let attrEnd = attrName.sourceSpan.end;
        // Consume any quote
        if (this._peek.type === 15 /* ATTR_QUOTE */) {
            this._advance();
        }
        // Consume the attribute value
        let value = '';
        const valueTokens = [];
        let valueStartSpan = undefined;
        let valueEnd = undefined;
        // NOTE: We need to use a new variable `nextTokenType` here to hide the actual type of
        // `_peek.type` from TS. Otherwise TS will narrow the type of `_peek.type` preventing it from
        // being able to consider `ATTR_VALUE_INTERPOLATION` as an option. This is because TS is not
        // able to see that `_advance()` will actually mutate `_peek`.
        const nextTokenType = this._peek.type;
        if (nextTokenType === 16 /* ATTR_VALUE_TEXT */) {
            valueStartSpan = this._peek.sourceSpan;
            valueEnd = this._peek.sourceSpan.end;
            while (this._peek.type === 16 /* ATTR_VALUE_TEXT */ ||
                this._peek.type === 17 /* ATTR_VALUE_INTERPOLATION */ ||
                this._peek.type === 9 /* ENCODED_ENTITY */) {
                const valueToken = this._advance();
                valueTokens.push(valueToken);
                if (valueToken.type === 17 /* ATTR_VALUE_INTERPOLATION */) {
                    // For backward compatibility we decode HTML entities that appear in interpolation
                    // expressions. This is arguably a bug, but it could be a considerable breaking change to
                    // fix it. It should be addressed in a larger project to refactor the entire parser/lexer
                    // chain after View Engine has been removed.
                    value += valueToken.parts.join('').replace(/&([^;]+);/g, decodeEntity);
                }
                else if (valueToken.type === 9 /* ENCODED_ENTITY */) {
                    value += valueToken.parts[0];
                }
                else {
                    value += valueToken.parts.join('');
                }
                valueEnd = attrEnd = valueToken.sourceSpan.end;
            }
        }
        // Consume any quote
        if (this._peek.type === 15 /* ATTR_QUOTE */) {
            const quoteToken = this._advance();
            attrEnd = quoteToken.sourceSpan.end;
        }
        const valueSpan = valueStartSpan && valueEnd &&
            new ParseSourceSpan(valueStartSpan.start, valueEnd, valueStartSpan.fullStart);
        return new Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, attrEnd, attrName.sourceSpan.fullStart), attrName.sourceSpan, valueSpan, valueTokens.length > 0 ? valueTokens : undefined, undefined);
    }
    _getParentElement() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    }
    _addToParent(node) {
        const parent = this._getParentElement();
        if (parent != null) {
            parent.children.push(node);
        }
        else {
            this.rootNodes.push(node);
        }
    }
    _getElementFullName(prefix, localName, parentElement) {
        if (prefix === '') {
            prefix = this.getTagDefinition(localName).implicitNamespacePrefix || '';
            if (prefix === '' && parentElement != null) {
                const parentTagName = splitNsName(parentElement.name)[1];
                const parentTagDefinition = this.getTagDefinition(parentTagName);
                if (!parentTagDefinition.preventNamespaceInheritance) {
                    prefix = getNsPrefix(parentElement.name);
                }
            }
        }
        return mergeNsAndName(prefix, localName);
    }
}
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}
/**
 * Decode the `entity` string, which we believe is the contents of an HTML entity.
 *
 * If the string is not actually a valid/known entity then just return the original `match` string.
 */
function decodeEntity(match, entity) {
    if (NAMED_ENTITIES[entity] !== undefined) {
        return NAMED_ENTITIES[entity] || match;
    }
    if (/^#x[a-f0-9]+$/i.test(entity)) {
        return String.fromCodePoint(parseInt(entity.slice(2), 16));
    }
    if (/^#\d+$/.test(entity)) {
        return String.fromCodePoint(parseInt(entity.slice(1), 10));
    }
    return match;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class HtmlParser extends Parser {
    constructor() {
        super(getHtmlTagDefinition);
    }
    parse(source, url, options) {
        return super.parse(source, url, options);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const PRESERVE_WS_ATTR_NAME = 'ngPreserveWhitespaces';
const SKIP_WS_TRIM_TAGS = new Set(['pre', 'template', 'textarea', 'script', 'style']);
// Equivalent to \s with \u00a0 (non-breaking space) excluded.
// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
const WS_CHARS = ' \f\n\r\t\v\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff';
const NO_WS_REGEXP = new RegExp(`[^${WS_CHARS}]`);
const WS_REPLACE_REGEXP = new RegExp(`[${WS_CHARS}]{2,}`, 'g');
function hasPreserveWhitespacesAttr(attrs) {
    return attrs.some((attr) => attr.name === PRESERVE_WS_ATTR_NAME);
}
/**
 * Angular Dart introduced &ngsp; as a placeholder for non-removable space, see:
 * https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart#L25-L32
 * In Angular Dart &ngsp; is converted to the 0xE500 PUA (Private Use Areas) unicode character
 * and later on replaced by a space. We are re-implementing the same idea here.
 */
function replaceNgsp(value) {
    // lexer is replacing the &ngsp; pseudo-entity with NGSP_UNICODE
    return value.replace(new RegExp(NGSP_UNICODE, 'g'), ' ');
}
/**
 * This visitor can walk HTML parse tree and remove / trim text nodes using the following rules:
 * - consider spaces, tabs and new lines as whitespace characters;
 * - drop text nodes consisting of whitespace characters only;
 * - for all other text nodes replace consecutive whitespace characters with one space;
 * - convert &ngsp; pseudo-entity to a single space;
 *
 * Removal and trimming of whitespaces have positive performance impact (less code to generate
 * while compiling templates, faster view creation). At the same time it can be "destructive"
 * in some cases (whitespaces can influence layout). Because of the potential of breaking layout
 * this visitor is not activated by default in Angular 5 and people need to explicitly opt-in for
 * whitespace removal. The default option for whitespace removal will be revisited in Angular 6
 * and might be changed to "on" by default.
 */
class WhitespaceVisitor {
    visitElement(element, context) {
        if (SKIP_WS_TRIM_TAGS.has(element.name) || hasPreserveWhitespacesAttr(element.attrs)) {
            // don't descent into elements where we need to preserve whitespaces
            // but still visit all attributes to eliminate one used as a market to preserve WS
            return new Element(element.name, visitAll(this, element.attrs), element.children, element.sourceSpan, element.startSourceSpan, element.endSourceSpan, element.i18n);
        }
        return new Element(element.name, element.attrs, visitAllWithSiblings(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan, element.i18n);
    }
    visitAttribute(attribute, context) {
        return attribute.name !== PRESERVE_WS_ATTR_NAME ? attribute : null;
    }
    visitText(text, context) {
        const isNotBlank = text.value.match(NO_WS_REGEXP);
        const hasExpansionSibling = context &&
            (context.prev instanceof Expansion || context.next instanceof Expansion);
        if (isNotBlank || hasExpansionSibling) {
            // Process the whitespace in the tokens of this Text node
            const tokens = text.tokens.map(token => token.type === 5 /* TEXT */ ? createWhitespaceProcessedTextToken(token) : token);
            // Process the whitespace of the value of this Text node
            const value = processWhitespace(text.value);
            return new Text(value, text.sourceSpan, tokens, text.i18n);
        }
        return null;
    }
    visitComment(comment, context) {
        return comment;
    }
    visitExpansion(expansion, context) {
        return expansion;
    }
    visitExpansionCase(expansionCase, context) {
        return expansionCase;
    }
}
function createWhitespaceProcessedTextToken({ type, parts, sourceSpan }) {
    return { type, parts: [processWhitespace(parts[0])], sourceSpan };
}
function processWhitespace(text) {
    return replaceNgsp(text).replace(WS_REPLACE_REGEXP, ' ');
}
function removeWhitespaces(htmlAstWithErrors) {
    return new ParseTreeResult(visitAll(new WhitespaceVisitor(), htmlAstWithErrors.rootNodes), htmlAstWithErrors.errors);
}
function visitAllWithSiblings(visitor, nodes) {
    const result = [];
    nodes.forEach((ast, i) => {
        const context = { prev: nodes[i - 1], next: nodes[i + 1] };
        const astResult = ast.visit(visitor, context);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function mapEntry(key, value) {
    return { key, value, quoted: false };
}
function mapLiteral(obj, quoted = false) {
    return literalMap(Object.keys(obj).map(key => ({
        key,
        quoted,
        value: obj[key],
    })));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//        DO NOT EDIT THIS LIST OF SECURITY SENSITIVE PROPERTIES WITHOUT A SECURITY REVIEW!
//                               Reach out to mprobst for details.
//
// =================================================================================================
/** Map from tagName|propertyName to SecurityContext. Properties applying to all tags use '*'. */
let _SECURITY_SCHEMA;
function SECURITY_SCHEMA() {
    if (!_SECURITY_SCHEMA) {
        _SECURITY_SCHEMA = {};
        // Case is insignificant below, all element and attribute names are lower-cased for lookup.
        registerContext(SecurityContext.HTML, [
            'iframe|srcdoc',
            '*|innerHTML',
            '*|outerHTML',
        ]);
        registerContext(SecurityContext.STYLE, ['*|style']);
        // NB: no SCRIPT contexts here, they are never allowed due to the parser stripping them.
        registerContext(SecurityContext.URL, [
            '*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href',
            'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action',
            'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite',
            'source|src', 'source|srcset', 'track|src', 'video|poster', 'video|src',
        ]);
        registerContext(SecurityContext.RESOURCE_URL, [
            'applet|code',
            'applet|codebase',
            'base|href',
            'embed|src',
            'frame|src',
            'head|profile',
            'html|manifest',
            'iframe|src',
            'link|href',
            'media|src',
            'object|codebase',
            'object|data',
            'script|src',
        ]);
    }
    return _SECURITY_SCHEMA;
}
function registerContext(ctx, specs) {
    for (const spec of specs)
        _SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ElementSchemaRegistry {
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const EVENT = 'event';
const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';
const OBJECT = 'object';
/**
 * This array represents the DOM schema. It encodes inheritance, properties, and events.
 *
 * ## Overview
 *
 * Each line represents one kind of element. The `element_inheritance` and properties are joined
 * using `element_inheritance|properties` syntax.
 *
 * ## Element Inheritance
 *
 * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
 * Here the individual elements are separated by `,` (commas). Every element in the list
 * has identical properties.
 *
 * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
 * specified then `""` (blank) element is assumed.
 *
 * NOTE: The blank element inherits from root `[Element]` element, the super element of all
 * elements.
 *
 * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
 *
 * ## Properties
 *
 * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
 * by a special character designating its type:
 *
 * - (no prefix): property is a string.
 * - `*`: property represents an event.
 * - `!`: property is a boolean.
 * - `#`: property is a number.
 * - `%`: property is an object.
 *
 * ## Query
 *
 * The class creates an internal squas representation which allows to easily answer the query of
 * if a given property exist on a given element.
 *
 * NOTE: We don't yet support querying for types or events.
 * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
 *       see dom_element_schema_registry_spec.ts
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
//
// Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
// dom_security_schema.ts. Reach out to mprobst & rjamet for details.
//
// =================================================================================================
const SCHEMA = [
    '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' +
        /* added manually to avoid breaking changes */
        ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored',
    '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume',
    ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
    ':svg:graphics^:svg:|',
    ':svg:animation^:svg:|*begin,*end,*repeat',
    ':svg:geometry^:svg:|',
    ':svg:componentTransferFunction^:svg:|',
    ':svg:gradient^:svg:|',
    ':svg:textContent^:svg:graphics|',
    ':svg:textPositioning^:svg:textContent|',
    'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
    'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username',
    'audio^media|',
    'br^[HTMLElement]|clear',
    'base^[HTMLElement]|href,target',
    'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
    'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
    'canvas^[HTMLElement]|#height,#width',
    'content^[HTMLElement]|select',
    'dl^[HTMLElement]|!compact',
    'datalist^[HTMLElement]|',
    'details^[HTMLElement]|!open',
    'dialog^[HTMLElement]|!open,returnValue',
    'dir^[HTMLElement]|!compact',
    'div^[HTMLElement]|align',
    'embed^[HTMLElement]|align,height,name,src,type,width',
    'fieldset^[HTMLElement]|!disabled,name',
    'font^[HTMLElement]|color,face,size',
    'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
    'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
    'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
    'hr^[HTMLElement]|align,color,!noShade,size,width',
    'head^[HTMLElement]|',
    'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
    'html^[HTMLElement]|version',
    'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
    'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
    'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
    'li^[HTMLElement]|type,#value',
    'label^[HTMLElement]|htmlFor',
    'legend^[HTMLElement]|align',
    'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type',
    'map^[HTMLElement]|name',
    'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
    'menu^[HTMLElement]|!compact',
    'meta^[HTMLElement]|content,httpEquiv,name,scheme',
    'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
    'ins,del^[HTMLElement]|cite,dateTime',
    'ol^[HTMLElement]|!compact,!reversed,#start,type',
    'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
    'optgroup^[HTMLElement]|!disabled,label',
    'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
    'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
    'p^[HTMLElement]|align',
    'param^[HTMLElement]|name,type,value,valueType',
    'picture^[HTMLElement]|',
    'pre^[HTMLElement]|#width',
    'progress^[HTMLElement]|#max,#value',
    'q,blockquote,cite^[HTMLElement]|',
    'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
    'select^[HTMLElement]|autocomplete,!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
    'shadow^[HTMLElement]|',
    'slot^[HTMLElement]|name',
    'source^[HTMLElement]|media,sizes,src,srcset,type',
    'span^[HTMLElement]|',
    'style^[HTMLElement]|!disabled,media,type',
    'caption^[HTMLElement]|align',
    'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
    'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
    'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
    'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
    'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
    'template^[HTMLElement]|',
    'textarea^[HTMLElement]|autocapitalize,autocomplete,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
    'title^[HTMLElement]|text',
    'track^[HTMLElement]|!default,kind,label,src,srclang',
    'ul^[HTMLElement]|!compact,type',
    'unknown^[HTMLElement]|',
    'video^media|#height,poster,#width',
    ':svg:a^:svg:graphics|',
    ':svg:animate^:svg:animation|',
    ':svg:animateMotion^:svg:animation|',
    ':svg:animateTransform^:svg:animation|',
    ':svg:circle^:svg:geometry|',
    ':svg:clipPath^:svg:graphics|',
    ':svg:defs^:svg:graphics|',
    ':svg:desc^:svg:|',
    ':svg:discard^:svg:|',
    ':svg:ellipse^:svg:geometry|',
    ':svg:feBlend^:svg:|',
    ':svg:feColorMatrix^:svg:|',
    ':svg:feComponentTransfer^:svg:|',
    ':svg:feComposite^:svg:|',
    ':svg:feConvolveMatrix^:svg:|',
    ':svg:feDiffuseLighting^:svg:|',
    ':svg:feDisplacementMap^:svg:|',
    ':svg:feDistantLight^:svg:|',
    ':svg:feDropShadow^:svg:|',
    ':svg:feFlood^:svg:|',
    ':svg:feFuncA^:svg:componentTransferFunction|',
    ':svg:feFuncB^:svg:componentTransferFunction|',
    ':svg:feFuncG^:svg:componentTransferFunction|',
    ':svg:feFuncR^:svg:componentTransferFunction|',
    ':svg:feGaussianBlur^:svg:|',
    ':svg:feImage^:svg:|',
    ':svg:feMerge^:svg:|',
    ':svg:feMergeNode^:svg:|',
    ':svg:feMorphology^:svg:|',
    ':svg:feOffset^:svg:|',
    ':svg:fePointLight^:svg:|',
    ':svg:feSpecularLighting^:svg:|',
    ':svg:feSpotLight^:svg:|',
    ':svg:feTile^:svg:|',
    ':svg:feTurbulence^:svg:|',
    ':svg:filter^:svg:|',
    ':svg:foreignObject^:svg:graphics|',
    ':svg:g^:svg:graphics|',
    ':svg:image^:svg:graphics|',
    ':svg:line^:svg:geometry|',
    ':svg:linearGradient^:svg:gradient|',
    ':svg:mpath^:svg:|',
    ':svg:marker^:svg:|',
    ':svg:mask^:svg:|',
    ':svg:metadata^:svg:|',
    ':svg:path^:svg:geometry|',
    ':svg:pattern^:svg:|',
    ':svg:polygon^:svg:geometry|',
    ':svg:polyline^:svg:geometry|',
    ':svg:radialGradient^:svg:gradient|',
    ':svg:rect^:svg:geometry|',
    ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
    ':svg:script^:svg:|type',
    ':svg:set^:svg:animation|',
    ':svg:stop^:svg:|',
    ':svg:style^:svg:|!disabled,media,title,type',
    ':svg:switch^:svg:graphics|',
    ':svg:symbol^:svg:|',
    ':svg:tspan^:svg:textPositioning|',
    ':svg:text^:svg:textPositioning|',
    ':svg:textPath^:svg:textContent|',
    ':svg:title^:svg:|',
    ':svg:use^:svg:graphics|',
    ':svg:view^:svg:|#zoomAndPan',
    'data^[HTMLElement]|value',
    'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name',
    'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
    'summary^[HTMLElement]|',
    'time^[HTMLElement]|dateTime',
    ':svg:cursor^:svg:|',
];
const _ATTR_TO_PROP = {
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
// Invert _ATTR_TO_PROP.
const _PROP_TO_ATTR = Object.keys(_ATTR_TO_PROP).reduce((inverted, attr) => {
    inverted[_ATTR_TO_PROP[attr]] = attr;
    return inverted;
}, {});
class DomElementSchemaRegistry extends ElementSchemaRegistry {
    constructor() {
        super();
        this._schema = {};
        // We don't allow binding to events for security reasons. Allowing event bindings would almost
        // certainly introduce bad XSS vulnerabilities. Instead, we store events in a separate schema.
        this._eventSchema = {};
        SCHEMA.forEach(encodedType => {
            const type = {};
            const events = new Set();
            const [strType, strProperties] = encodedType.split('|');
            const properties = strProperties.split(',');
            const [typeNames, superName] = strType.split('^');
            typeNames.split(',').forEach(tag => {
                this._schema[tag.toLowerCase()] = type;
                this._eventSchema[tag.toLowerCase()] = events;
            });
            const superType = superName && this._schema[superName.toLowerCase()];
            if (superType) {
                Object.keys(superType).forEach((prop) => {
                    type[prop] = superType[prop];
                });
                for (const superEvent of this._eventSchema[superName.toLowerCase()]) {
                    events.add(superEvent);
                }
            }
            properties.forEach((property) => {
                if (property.length > 0) {
                    switch (property[0]) {
                        case '*':
                            events.add(property.substring(1));
                            break;
                        case '!':
                            type[property.substring(1)] = BOOLEAN;
                            break;
                        case '#':
                            type[property.substring(1)] = NUMBER;
                            break;
                        case '%':
                            type[property.substring(1)] = OBJECT;
                            break;
                        default:
                            type[property] = STRING;
                    }
                }
            });
        });
    }
    hasProperty(tagName, propName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return false;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
        }
        const elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        return !!elementProperties[propName];
    }
    hasElement(tagName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return true;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Allow any custom elements
                return true;
            }
        }
        return !!this._schema[tagName.toLowerCase()];
    }
    /**
     * securityContext returns the security context for the given property on the given DOM tag.
     *
     * Tag and property name are statically known and cannot change at runtime, i.e. it is not
     * possible to bind a value into a changing attribute or tag name.
     *
     * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
     * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
     * string values. Only specific well known attack vectors are assigned their appropriate context.
     */
    securityContext(tagName, propName, isAttribute) {
        if (isAttribute) {
            // NB: For security purposes, use the mapped property name, not the attribute name.
            propName = this.getMappedPropName(propName);
        }
        // Make sure comparisons are case insensitive, so that case differences between attribute and
        // property names do not have a security impact.
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        let ctx = SECURITY_SCHEMA()[tagName + '|' + propName];
        if (ctx) {
            return ctx;
        }
        ctx = SECURITY_SCHEMA()['*|' + propName];
        return ctx ? ctx : SecurityContext.NONE;
    }
    getMappedPropName(propName) {
        return _ATTR_TO_PROP[propName] || propName;
    }
    getDefaultComponentElementName() {
        return 'ng-component';
    }
    validateProperty(name) {
        if (name.toLowerCase().startsWith('on')) {
            const msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...` +
                `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
                ` current module.`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    validateAttribute(name) {
        if (name.toLowerCase().startsWith('on')) {
            const msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    allKnownElementNames() {
        return Object.keys(this._schema);
    }
    allKnownAttributesOfElement(tagName) {
        const elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        // Convert properties to attributes.
        return Object.keys(elementProperties).map(prop => _PROP_TO_ATTR[prop] ?? prop);
    }
    allKnownEventsOfElement(tagName) {
        return Array.from(this._eventSchema[tagName.toLowerCase()] ?? []);
    }
    normalizeAnimationStyleProperty(propName) {
        return dashCaseToCamelCase(propName);
    }
    normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) {
        let unit = '';
        const strVal = val.toString().trim();
        let errorMsg = null;
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
            if (typeof val === 'number') {
                unit = 'px';
            }
            else {
                const valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
                }
            }
        }
        return { error: errorMsg, value: strVal + unit };
    }
}
function _isPixelDimensionStyle(prop) {
    switch (prop) {
        case 'width':
        case 'height':
        case 'minWidth':
        case 'minHeight':
        case 'maxWidth':
        case 'maxHeight':
        case 'left':
        case 'top':
        case 'bottom':
        case 'right':
        case 'fontSize':
        case 'outlineWidth':
        case 'outlineOffset':
        case 'paddingTop':
        case 'paddingLeft':
        case 'paddingBottom':
        case 'paddingRight':
        case 'marginTop':
        case 'marginLeft':
        case 'marginBottom':
        case 'marginRight':
        case 'borderRadius':
        case 'borderWidth':
        case 'borderTopWidth':
        case 'borderLeftWidth':
        case 'borderRightWidth':
        case 'borderBottomWidth':
        case 'textIndent':
            return true;
        default:
            return false;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Set of tagName|propertyName corresponding to Trusted Types sinks. Properties applying to all
 * tags use '*'.
 *
 * Extracted from, and should be kept in sync with
 * https://w3c.github.io/webappsec-trusted-types/dist/spec/#integrations
 */
const TRUSTED_TYPES_SINKS = new Set([
    // NOTE: All strings in this set *must* be lowercase!
    // TrustedHTML
    'iframe|srcdoc',
    '*|innerhtml',
    '*|outerhtml',
    // NB: no TrustedScript here, as the corresponding tags are stripped by the compiler.
    // TrustedScriptURL
    'embed|src',
    'object|codebase',
    'object|data',
]);
/**
 * isTrustedTypesSink returns true if the given property on the given DOM tag is a Trusted Types
 * sink. In that case, use `ElementSchemaRegistry.securityContext` to determine which particular
 * Trusted Type is required for values passed to the sink:
 * - SecurityContext.HTML corresponds to TrustedHTML
 * - SecurityContext.RESOURCE_URL corresponds to TrustedScriptURL
 */
function isTrustedTypesSink(tagName, propName) {
    // Make sure comparisons are case insensitive, so that case differences between attribute and
    // property names do not have a security impact.
    tagName = tagName.toLowerCase();
    propName = propName.toLowerCase();
    return TRUSTED_TYPES_SINKS.has(tagName + '|' + propName) ||
        TRUSTED_TYPES_SINKS.has('*|' + propName);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const PROPERTY_PARTS_SEPARATOR = '.';
const ATTRIBUTE_PREFIX = 'attr';
const CLASS_PREFIX = 'class';
const STYLE_PREFIX = 'style';
const TEMPLATE_ATTR_PREFIX$1 = '*';
const ANIMATE_PROP_PREFIX = 'animate-';
/**
 * Parses bindings in templates and in the directive host area.
 */
class BindingParser {
    constructor(_exprParser, _interpolationConfig, _schemaRegistry, errors) {
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this.errors = errors;
    }
    get interpolationConfig() {
        return this._interpolationConfig;
    }
    createBoundHostProperties(properties, sourceSpan) {
        const boundProps = [];
        for (const propName of Object.keys(properties)) {
            const expression = properties[propName];
            if (typeof expression === 'string') {
                this.parsePropertyBinding(propName, expression, true, sourceSpan, sourceSpan.start.offset, undefined, [], 
                // Use the `sourceSpan` for  `keySpan`. This isn't really accurate, but neither is the
                // sourceSpan, as it represents the sourceSpan of the host itself rather than the
                // source of the host binding (which doesn't exist in the template). Regardless,
                // neither of these values are used in Ivy but are only here to satisfy the function
                // signature. This should likely be refactored in the future so that `sourceSpan`
                // isn't being used inaccurately.
                boundProps, sourceSpan);
            }
            else {
                this._reportError(`Value of the host property binding "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
            }
        }
        return boundProps;
    }
    createDirectiveHostEventAsts(hostListeners, sourceSpan) {
        const targetEvents = [];
        for (const propName of Object.keys(hostListeners)) {
            const expression = hostListeners[propName];
            if (typeof expression === 'string') {
                // Use the `sourceSpan` for  `keySpan` and `handlerSpan`. This isn't really accurate, but
                // neither is the `sourceSpan`, as it represents the `sourceSpan` of the host itself
                // rather than the source of the host binding (which doesn't exist in the template).
                // Regardless, neither of these values are used in Ivy but are only here to satisfy the
                // function signature. This should likely be refactored in the future so that `sourceSpan`
                // isn't being used inaccurately.
                this.parseEvent(propName, expression, /* isAssignmentEvent */ false, sourceSpan, sourceSpan, [], targetEvents, sourceSpan);
            }
            else {
                this._reportError(`Value of the host listener "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
            }
        }
        return targetEvents;
    }
    parseInterpolation(value, sourceSpan, interpolatedTokens) {
        const sourceInfo = sourceSpan.start.toString();
        const absoluteOffset = sourceSpan.fullStart.offset;
        try {
            const ast = this._exprParser.parseInterpolation(value, sourceInfo, absoluteOffset, interpolatedTokens, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo, absoluteOffset);
        }
    }
    /**
     * Similar to `parseInterpolation`, but treats the provided string as a single expression
     * element that would normally appear within the interpolation prefix and suffix (`{{` and `}}`).
     * This is used for parsing the switch expression in ICUs.
     */
    parseInterpolationExpression(expression, sourceSpan) {
        const sourceInfo = sourceSpan.start.toString();
        const absoluteOffset = sourceSpan.start.offset;
        try {
            const ast = this._exprParser.parseInterpolationExpression(expression, sourceInfo, absoluteOffset);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo, absoluteOffset);
        }
    }
    /**
     * Parses the bindings in a microsyntax expression, and converts them to
     * `ParsedProperty` or `ParsedVariable`.
     *
     * @param tplKey template binding name
     * @param tplValue template binding value
     * @param sourceSpan span of template binding relative to entire the template
     * @param absoluteValueOffset start of the tplValue relative to the entire template
     * @param targetMatchableAttrs potential attributes to match in the template
     * @param targetProps target property bindings in the template
     * @param targetVars target variables in the template
     */
    parseInlineTemplateBinding(tplKey, tplValue, sourceSpan, absoluteValueOffset, targetMatchableAttrs, targetProps, targetVars, isIvyAst) {
        const absoluteKeyOffset = sourceSpan.start.offset + TEMPLATE_ATTR_PREFIX$1.length;
        const bindings = this._parseTemplateBindings(tplKey, tplValue, sourceSpan, absoluteKeyOffset, absoluteValueOffset);
        for (const binding of bindings) {
            // sourceSpan is for the entire HTML attribute. bindingSpan is for a particular
            // binding within the microsyntax expression so it's more narrow than sourceSpan.
            const bindingSpan = moveParseSourceSpan(sourceSpan, binding.sourceSpan);
            const key = binding.key.source;
            const keySpan = moveParseSourceSpan(sourceSpan, binding.key.span);
            if (binding instanceof VariableBinding) {
                const value = binding.value ? binding.value.source : '$implicit';
                const valueSpan = binding.value ? moveParseSourceSpan(sourceSpan, binding.value.span) : undefined;
                targetVars.push(new ParsedVariable(key, value, bindingSpan, keySpan, valueSpan));
            }
            else if (binding.value) {
                const srcSpan = isIvyAst ? bindingSpan : sourceSpan;
                const valueSpan = moveParseSourceSpan(sourceSpan, binding.value.ast.sourceSpan);
                this._parsePropertyAst(key, binding.value, srcSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
            }
            else {
                targetMatchableAttrs.push([key, '' /* value */]);
                // Since this is a literal attribute with no RHS, source span should be
                // just the key span.
                this.parseLiteralAttr(key, null /* value */, keySpan, absoluteValueOffset, undefined /* valueSpan */, targetMatchableAttrs, targetProps, keySpan);
            }
        }
    }
    /**
     * Parses the bindings in a microsyntax expression, e.g.
     * ```
     *    <tag *tplKey="let value1 = prop; let value2 = localVar">
     * ```
     *
     * @param tplKey template binding name
     * @param tplValue template binding value
     * @param sourceSpan span of template binding relative to entire the template
     * @param absoluteKeyOffset start of the `tplKey`
     * @param absoluteValueOffset start of the `tplValue`
     */
    _parseTemplateBindings(tplKey, tplValue, sourceSpan, absoluteKeyOffset, absoluteValueOffset) {
        const sourceInfo = sourceSpan.start.toString();
        try {
            const bindingsResult = this._exprParser.parseTemplateBindings(tplKey, tplValue, sourceInfo, absoluteKeyOffset, absoluteValueOffset);
            this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
            bindingsResult.warnings.forEach((warning) => {
                this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING);
            });
            return bindingsResult.templateBindings;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return [];
        }
    }
    parseLiteralAttr(name, value, sourceSpan, absoluteOffset, valueSpan, targetMatchableAttrs, targetProps, keySpan) {
        if (isAnimationLabel(name)) {
            name = name.substring(1);
            if (keySpan !== undefined) {
                keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
            }
            if (value) {
                this._reportError(`Assigning animation triggers via @prop="exp" attributes with an expression is invalid.` +
                    ` Use property bindings (e.g. [@prop]="exp") or use an attribute without a value (e.g. @prop) instead.`, sourceSpan, ParseErrorLevel.ERROR);
            }
            this._parseAnimation(name, value, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps);
        }
        else {
            targetProps.push(new ParsedProperty(name, this._exprParser.wrapLiteralPrimitive(value, '', absoluteOffset), ParsedPropertyType.LITERAL_ATTR, sourceSpan, keySpan, valueSpan));
        }
    }
    parsePropertyBinding(name, expression, isHost, sourceSpan, absoluteOffset, valueSpan, targetMatchableAttrs, targetProps, keySpan) {
        if (name.length === 0) {
            this._reportError(`Property name is missing in binding`, sourceSpan);
        }
        let isAnimationProp = false;
        if (name.startsWith(ANIMATE_PROP_PREFIX)) {
            isAnimationProp = true;
            name = name.substring(ANIMATE_PROP_PREFIX.length);
            if (keySpan !== undefined) {
                keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + ANIMATE_PROP_PREFIX.length, keySpan.end.offset));
            }
        }
        else if (isAnimationLabel(name)) {
            isAnimationProp = true;
            name = name.substring(1);
            if (keySpan !== undefined) {
                keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
            }
        }
        if (isAnimationProp) {
            this._parseAnimation(name, expression, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps);
        }
        else {
            this._parsePropertyAst(name, this._parseBinding(expression, isHost, valueSpan || sourceSpan, absoluteOffset), sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
        }
    }
    parsePropertyInterpolation(name, value, sourceSpan, valueSpan, targetMatchableAttrs, targetProps, keySpan, interpolatedTokens) {
        const expr = this.parseInterpolation(value, valueSpan || sourceSpan, interpolatedTokens);
        if (expr) {
            this._parsePropertyAst(name, expr, sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    }
    _parsePropertyAst(name, ast, sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new ParsedProperty(name, ast, ParsedPropertyType.DEFAULT, sourceSpan, keySpan, valueSpan));
    }
    _parseAnimation(name, expression, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps) {
        if (name.length === 0) {
            this._reportError('Animation trigger is missing', sourceSpan);
        }
        // This will occur when a @trigger is not paired with an expression.
        // For animations it is valid to not have an expression since */void
        // states will be applied by angular when the element is attached/detached
        const ast = this._parseBinding(expression || 'undefined', false, valueSpan || sourceSpan, absoluteOffset);
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new ParsedProperty(name, ast, ParsedPropertyType.ANIMATION, sourceSpan, keySpan, valueSpan));
    }
    _parseBinding(value, isHostBinding, sourceSpan, absoluteOffset) {
        const sourceInfo = (sourceSpan && sourceSpan.start || '(unknown)').toString();
        try {
            const ast = isHostBinding ?
                this._exprParser.parseSimpleBinding(value, sourceInfo, absoluteOffset, this._interpolationConfig) :
                this._exprParser.parseBinding(value, sourceInfo, absoluteOffset, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo, absoluteOffset);
        }
    }
    createBoundElementProperty(elementSelector, boundProp, skipValidation = false, mapPropertyName = true) {
        if (boundProp.isAnimation) {
            return new BoundElementProperty(boundProp.name, 4 /* Animation */, SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan, boundProp.keySpan, boundProp.valueSpan);
        }
        let unit = null;
        let bindingType = undefined;
        let boundPropertyName = null;
        const parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        let securityContexts = undefined;
        // Check for special cases (prefix style, attr, class)
        if (parts.length > 1) {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts.slice(1).join(PROPERTY_PARTS_SEPARATOR);
                if (!skipValidation) {
                    this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                }
                securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                const nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    const ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    const name = boundPropertyName.substring(nsSeparatorIdx + 1);
                    boundPropertyName = mergeNsAndName(ns, name);
                }
                bindingType = 1 /* Attribute */;
            }
            else if (parts[0] == CLASS_PREFIX) {
                boundPropertyName = parts[1];
                bindingType = 2 /* Class */;
                securityContexts = [SecurityContext.NONE];
            }
            else if (parts[0] == STYLE_PREFIX) {
                unit = parts.length > 2 ? parts[2] : null;
                boundPropertyName = parts[1];
                bindingType = 3 /* Style */;
                securityContexts = [SecurityContext.STYLE];
            }
        }
        // If not a special case, use the full property name
        if (boundPropertyName === null) {
            const mappedPropName = this._schemaRegistry.getMappedPropName(boundProp.name);
            boundPropertyName = mapPropertyName ? mappedPropName : boundProp.name;
            securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, mappedPropName, false);
            bindingType = 0 /* Property */;
            if (!skipValidation) {
                this._validatePropertyOrAttributeName(mappedPropName, boundProp.sourceSpan, false);
            }
        }
        return new BoundElementProperty(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan, boundProp.keySpan, boundProp.valueSpan);
    }
    // TODO: keySpan should be required but was made optional to avoid changing VE parser.
    parseEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan) {
        if (name.length === 0) {
            this._reportError(`Event name is missing in binding`, sourceSpan);
        }
        if (isAnimationLabel(name)) {
            name = name.substr(1);
            if (keySpan !== undefined) {
                keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
            }
            this._parseAnimationEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetEvents, keySpan);
        }
        else {
            this._parseRegularEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan);
        }
    }
    calcPossibleSecurityContexts(selector, propName, isAttribute) {
        const prop = this._schemaRegistry.getMappedPropName(propName);
        return calcPossibleSecurityContexts(this._schemaRegistry, selector, prop, isAttribute);
    }
    _parseAnimationEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetEvents, keySpan) {
        const matches = splitAtPeriod(name, [name, '']);
        const eventName = matches[0];
        const phase = matches[1].toLowerCase();
        const ast = this._parseAction(expression, isAssignmentEvent, handlerSpan);
        targetEvents.push(new ParsedEvent(eventName, phase, 1 /* Animation */, ast, sourceSpan, handlerSpan, keySpan));
        if (eventName.length === 0) {
            this._reportError(`Animation event name is missing in binding`, sourceSpan);
        }
        if (phase) {
            if (phase !== 'start' && phase !== 'done') {
                this._reportError(`The provided animation output phase value "${phase}" for "@${eventName}" is not supported (use start or done)`, sourceSpan);
            }
        }
        else {
            this._reportError(`The animation trigger output event (@${eventName}) is missing its phase value name (start or done are currently supported)`, sourceSpan);
        }
    }
    _parseRegularEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan) {
        // long format: 'target: eventName'
        const [target, eventName] = splitAtColon(name, [null, name]);
        const ast = this._parseAction(expression, isAssignmentEvent, handlerSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetEvents.push(new ParsedEvent(eventName, target, 0 /* Regular */, ast, sourceSpan, handlerSpan, keySpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    }
    _parseAction(value, isAssignmentEvent, sourceSpan) {
        const sourceInfo = (sourceSpan && sourceSpan.start || '(unknown').toString();
        const absoluteOffset = (sourceSpan && sourceSpan.start) ? sourceSpan.start.offset : 0;
        try {
            const ast = this._exprParser.parseAction(value, isAssignmentEvent, sourceInfo, absoluteOffset, this._interpolationConfig);
            if (ast) {
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            }
            if (!ast || ast.ast instanceof EmptyExpr) {
                this._reportError(`Empty expressions are not allowed`, sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo, absoluteOffset);
            }
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo, absoluteOffset);
        }
    }
    _reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
        this.errors.push(new ParseError(sourceSpan, message, level));
    }
    _reportExpressionParserErrors(errors, sourceSpan) {
        for (const error of errors) {
            this._reportError(error.message, sourceSpan);
        }
    }
    /**
     * @param propName the name of the property / attribute
     * @param sourceSpan
     * @param isAttr true when binding to an attribute
     */
    _validatePropertyOrAttributeName(propName, sourceSpan, isAttr) {
        const report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
            this._schemaRegistry.validateProperty(propName);
        if (report.error) {
            this._reportError(report.msg, sourceSpan, ParseErrorLevel.ERROR);
        }
    }
}
class PipeCollector extends RecursiveAstVisitor {
    constructor() {
        super(...arguments);
        this.pipes = new Map();
    }
    visitPipe(ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
}
function isAnimationLabel(name) {
    return name[0] == '@';
}
function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
    const ctxs = [];
    CssSelector.parse(selector).forEach((selector) => {
        const elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        const notElementNames = new Set(selector.notSelectors.filter(selector => selector.isElementSelector())
            .map((selector) => selector.element));
        const possibleElementNames = elementNames.filter(elementName => !notElementNames.has(elementName));
        ctxs.push(...possibleElementNames.map(elementName => registry.securityContext(elementName, propName, isAttribute)));
    });
    return ctxs.length === 0 ? [SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
}
/**
 * Compute a new ParseSourceSpan based off an original `sourceSpan` by using
 * absolute offsets from the specified `absoluteSpan`.
 *
 * @param sourceSpan original source span
 * @param absoluteSpan absolute source span to move to
 */
function moveParseSourceSpan(sourceSpan, absoluteSpan) {
    // The difference of two absolute offsets provide the relative offset
    const startDiff = absoluteSpan.start - sourceSpan.start.offset;
    const endDiff = absoluteSpan.end - sourceSpan.end.offset;
    return new ParseSourceSpan(sourceSpan.start.moveBy(startDiff), sourceSpan.end.moveBy(endDiff), sourceSpan.fullStart.moveBy(startDiff), sourceSpan.details);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Some of the code comes from WebComponents.JS
// https://github.com/webcomponents/webcomponentsjs/blob/master/src/HTMLImports/path.js
function isStyleUrlResolvable(url) {
    if (url == null || url.length === 0 || url[0] == '/')
        return false;
    const schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
    return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
}
const URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const NG_CONTENT_SELECT_ATTR$1 = 'select';
const LINK_ELEMENT = 'link';
const LINK_STYLE_REL_ATTR = 'rel';
const LINK_STYLE_HREF_ATTR = 'href';
const LINK_STYLE_REL_VALUE = 'stylesheet';
const STYLE_ELEMENT = 'style';
const SCRIPT_ELEMENT = 'script';
const NG_NON_BINDABLE_ATTR = 'ngNonBindable';
const NG_PROJECT_AS = 'ngProjectAs';
function preparseElement(ast) {
    let selectAttr = null;
    let hrefAttr = null;
    let relAttr = null;
    let nonBindable = false;
    let projectAs = '';
    ast.attrs.forEach(attr => {
        const lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR$1) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    const nodeName = ast.name.toLowerCase();
    let type = PreparsedElementType.OTHER;
    if (isNgContent(nodeName)) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
var PreparsedElementType;
(function (PreparsedElementType) {
    PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
    PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
    PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
})(PreparsedElementType || (PreparsedElementType = {}));
class PreparsedElement {
    constructor(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
}
function normalizeNgContentSelect(selectAttr) {
    if (selectAttr === null || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const BIND_NAME_REGEXP = /^(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.*)$/;
// Group 1 = "bind-"
const KW_BIND_IDX = 1;
// Group 2 = "let-"
const KW_LET_IDX = 2;
// Group 3 = "ref-/#"
const KW_REF_IDX = 3;
// Group 4 = "on-"
const KW_ON_IDX = 4;
// Group 5 = "bindon-"
const KW_BINDON_IDX = 5;
// Group 6 = "@"
const KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
const IDENT_KW_IDX = 7;
const BINDING_DELIMS = {
    BANANA_BOX: { start: '[(', end: ')]' },
    PROPERTY: { start: '[', end: ']' },
    EVENT: { start: '(', end: ')' },
};
const TEMPLATE_ATTR_PREFIX = '*';
function htmlAstToRender3Ast(htmlNodes, bindingParser, options) {
    const transformer = new HtmlAstToIvyAst(bindingParser, options);
    const ivyNodes = visitAll(transformer, htmlNodes);
    // Errors might originate in either the binding parser or the html to ivy transformer
    const allErrors = bindingParser.errors.concat(transformer.errors);
    const result = {
        nodes: ivyNodes,
        errors: allErrors,
        styleUrls: transformer.styleUrls,
        styles: transformer.styles,
        ngContentSelectors: transformer.ngContentSelectors
    };
    if (options.collectCommentNodes) {
        result.commentNodes = transformer.commentNodes;
    }
    return result;
}
class HtmlAstToIvyAst {
    constructor(bindingParser, options) {
        this.bindingParser = bindingParser;
        this.options = options;
        this.errors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngContentSelectors = [];
        // This array will be populated if `Render3ParseOptions['collectCommentNodes']` is true
        this.commentNodes = [];
        this.inI18nBlock = false;
    }
    // HTML visitor
    visitElement(element) {
        const isI18nRootElement = isI18nRootNode(element.i18n);
        if (isI18nRootElement) {
            if (this.inI18nBlock) {
                this.reportError('Cannot mark an element as translatable inside of a translatable section. Please remove the nested i18n marker.', element.sourceSpan);
            }
            this.inI18nBlock = true;
        }
        const preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT) {
            return null;
        }
        else if (preparsedElement.type === PreparsedElementType.STYLE) {
            const contents = textContents(element);
            if (contents !== null) {
                this.styles.push(contents);
            }
            return null;
        }
        else if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
            isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            this.styleUrls.push(preparsedElement.hrefAttr);
            return null;
        }
        // Whether the element is a `<ng-template>`
        const isTemplateElement = isNgTemplate(element.name);
        const parsedProperties = [];
        const boundEvents = [];
        const variables = [];
        const references = [];
        const attributes = [];
        const i18nAttrsMeta = {};
        const templateParsedProperties = [];
        const templateVariables = [];
        // Whether the element has any *-attribute
        let elementHasInlineTemplate = false;
        for (const attribute of element.attrs) {
            let hasBinding = false;
            const normalizedName = normalizeAttributeName(attribute.name);
            // `*attr` defines template bindings
            let isTemplateBinding = false;
            if (attribute.i18n) {
                i18nAttrsMeta[attribute.name] = attribute.i18n;
            }
            if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                // *-attributes
                if (elementHasInlineTemplate) {
                    this.reportError(`Can't have multiple template bindings on one element. Use only one attribute prefixed with *`, attribute.sourceSpan);
                }
                isTemplateBinding = true;
                elementHasInlineTemplate = true;
                const templateValue = attribute.value;
                const templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
                const parsedVariables = [];
                const absoluteValueOffset = attribute.valueSpan ?
                    attribute.valueSpan.start.offset :
                    // If there is no value span the attribute does not have a value, like `attr` in
                    //`<div attr></div>`. In this case, point to one character beyond the last character of
                    // the attribute name.
                    attribute.sourceSpan.start.offset + attribute.name.length;
                this.bindingParser.parseInlineTemplateBinding(templateKey, templateValue, attribute.sourceSpan, absoluteValueOffset, [], templateParsedProperties, parsedVariables, true /* isIvyAst */);
                templateVariables.push(...parsedVariables.map(v => new Variable(v.name, v.value, v.sourceSpan, v.keySpan, v.valueSpan)));
            }
            else {
                // Check for variables, events, property bindings, interpolation
                hasBinding = this.parseAttribute(isTemplateElement, attribute, [], parsedProperties, boundEvents, variables, references);
            }
            if (!hasBinding && !isTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attributes.push(this.visitAttribute(attribute));
            }
        }
        const children = visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children);
        let parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            // `<ng-content>`
            if (element.children &&
                !element.children.every((node) => isEmptyTextNode(node) || isCommentNode(node))) {
                this.reportError(`<ng-content> element cannot have content.`, element.sourceSpan);
            }
            const selector = preparsedElement.selectAttr;
            const attrs = element.attrs.map(attr => this.visitAttribute(attr));
            parsedElement = new Content(selector, attrs, element.sourceSpan, element.i18n);
            this.ngContentSelectors.push(selector);
        }
        else if (isTemplateElement) {
            // `<ng-template>`
            const attrs = this.extractAttributes(element.name, parsedProperties, i18nAttrsMeta);
            parsedElement = new Template(element.name, attributes, attrs.bound, boundEvents, [ /* no template attributes */], children, references, variables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan, element.i18n);
        }
        else {
            const attrs = this.extractAttributes(element.name, parsedProperties, i18nAttrsMeta);
            parsedElement = new Element$1(element.name, attributes, attrs.bound, boundEvents, children, references, element.sourceSpan, element.startSourceSpan, element.endSourceSpan, element.i18n);
        }
        if (elementHasInlineTemplate) {
            // If this node is an inline-template (e.g. has *ngFor) then we need to create a template
            // node that contains this node.
            // Moreover, if the node is an element, then we need to hoist its attributes to the template
            // node for matching against content projection selectors.
            const attrs = this.extractAttributes('ng-template', templateParsedProperties, i18nAttrsMeta);
            const templateAttrs = [];
            attrs.literal.forEach(attr => templateAttrs.push(attr));
            attrs.bound.forEach(attr => templateAttrs.push(attr));
            const hoistedAttrs = parsedElement instanceof Element$1 ?
                {
                    attributes: parsedElement.attributes,
                    inputs: parsedElement.inputs,
                    outputs: parsedElement.outputs,
                } :
                { attributes: [], inputs: [], outputs: [] };
            // For <ng-template>s with structural directives on them, avoid passing i18n information to
            // the wrapping template to prevent unnecessary i18n instructions from being generated. The
            // necessary i18n meta information will be extracted from child elements.
            const i18n = isTemplateElement && isI18nRootElement ? undefined : element.i18n;
            const name = parsedElement instanceof Template ? null : parsedElement.name;
            parsedElement = new Template(name, hoistedAttrs.attributes, hoistedAttrs.inputs, hoistedAttrs.outputs, templateAttrs, [parsedElement], [ /* no references */], templateVariables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan, i18n);
        }
        if (isI18nRootElement) {
            this.inI18nBlock = false;
        }
        return parsedElement;
    }
    visitAttribute(attribute) {
        return new TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.keySpan, attribute.valueSpan, attribute.i18n);
    }
    visitText(text) {
        return this._visitTextWithInterpolation(text.value, text.sourceSpan, text.tokens, text.i18n);
    }
    visitExpansion(expansion) {
        if (!expansion.i18n) {
            // do not generate Icu in case it was created
            // outside of i18n block in a template
            return null;
        }
        if (!isI18nRootNode(expansion.i18n)) {
            throw new Error(`Invalid type "${expansion.i18n.constructor}" for "i18n" property of ${expansion.sourceSpan.toString()}. Expected a "Message"`);
        }
        const message = expansion.i18n;
        const vars = {};
        const placeholders = {};
        // extract VARs from ICUs - we process them separately while
        // assembling resulting message via goog.getMsg function, since
        // we need to pass them to top-level goog.getMsg call
        Object.keys(message.placeholders).forEach(key => {
            const value = message.placeholders[key];
            if (key.startsWith(I18N_ICU_VAR_PREFIX)) {
                // Currently when the `plural` or `select` keywords in an ICU contain trailing spaces (e.g.
                // `{count, select , ...}`), these spaces are also included into the key names in ICU vars
                // (e.g. "VAR_SELECT "). These trailing spaces are not desirable, since they will later be
                // converted into `_` symbols while normalizing placeholder names, which might lead to
                // mismatches at runtime (i.e. placeholder will not be replaced with the correct value).
                const formattedKey = key.trim();
                const ast = this.bindingParser.parseInterpolationExpression(value.text, value.sourceSpan);
                vars[formattedKey] = new BoundText(ast, value.sourceSpan);
            }
            else {
                placeholders[key] = this._visitTextWithInterpolation(value.text, value.sourceSpan, null);
            }
        });
        return new Icu$1(vars, placeholders, expansion.sourceSpan, message);
    }
    visitExpansionCase(expansionCase) {
        return null;
    }
    visitComment(comment) {
        if (this.options.collectCommentNodes) {
            this.commentNodes.push(new Comment$1(comment.value || '', comment.sourceSpan));
        }
        return null;
    }
    // convert view engine `ParsedProperty` to a format suitable for IVY
    extractAttributes(elementName, properties, i18nPropsMeta) {
        const bound = [];
        const literal = [];
        properties.forEach(prop => {
            const i18n = i18nPropsMeta[prop.name];
            if (prop.isLiteral) {
                literal.push(new TextAttribute(prop.name, prop.expression.source || '', prop.sourceSpan, prop.keySpan, prop.valueSpan, i18n));
            }
            else {
                // Note that validation is skipped and property mapping is disabled
                // due to the fact that we need to make sure a given prop is not an
                // input of a directive and directive matching happens at runtime.
                const bep = this.bindingParser.createBoundElementProperty(elementName, prop, /* skipValidation */ true, /* mapPropertyName */ false);
                bound.push(BoundAttribute.fromBoundElementProperty(bep, i18n));
            }
        });
        return { bound, literal };
    }
    parseAttribute(isTemplateElement, attribute, matchableAttributes, parsedProperties, boundEvents, variables, references) {
        const name = normalizeAttributeName(attribute.name);
        const value = attribute.value;
        const srcSpan = attribute.sourceSpan;
        const absoluteOffset = attribute.valueSpan ? attribute.valueSpan.start.offset : srcSpan.start.offset;
        function createKeySpan(srcSpan, prefix, identifier) {
            // We need to adjust the start location for the keySpan to account for the removed 'data-'
            // prefix from `normalizeAttributeName`.
            const normalizationAdjustment = attribute.name.length - name.length;
            const keySpanStart = srcSpan.start.moveBy(prefix.length + normalizationAdjustment);
            const keySpanEnd = keySpanStart.moveBy(identifier.length);
            return new ParseSourceSpan(keySpanStart, keySpanEnd, keySpanStart, identifier);
        }
        const bindParts = name.match(BIND_NAME_REGEXP);
        if (bindParts) {
            if (bindParts[KW_BIND_IDX] != null) {
                const identifier = bindParts[IDENT_KW_IDX];
                const keySpan = createKeySpan(srcSpan, bindParts[KW_BIND_IDX], identifier);
                this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    const identifier = bindParts[IDENT_KW_IDX];
                    const keySpan = createKeySpan(srcSpan, bindParts[KW_LET_IDX], identifier);
                    this.parseVariable(identifier, value, srcSpan, keySpan, attribute.valueSpan, variables);
                }
                else {
                    this.reportError(`"let-" is only supported on ng-template elements.`, srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                const identifier = bindParts[IDENT_KW_IDX];
                const keySpan = createKeySpan(srcSpan, bindParts[KW_REF_IDX], identifier);
                this.parseReference(identifier, value, srcSpan, keySpan, attribute.valueSpan, references);
            }
            else if (bindParts[KW_ON_IDX]) {
                const events = [];
                const identifier = bindParts[IDENT_KW_IDX];
                const keySpan = createKeySpan(srcSpan, bindParts[KW_ON_IDX], identifier);
                this.bindingParser.parseEvent(identifier, value, /* isAssignmentEvent */ false, srcSpan, attribute.valueSpan || srcSpan, matchableAttributes, events, keySpan);
                addEvents(events, boundEvents);
            }
            else if (bindParts[KW_BINDON_IDX]) {
                const identifier = bindParts[IDENT_KW_IDX];
                const keySpan = createKeySpan(srcSpan, bindParts[KW_BINDON_IDX], identifier);
                this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan);
                this.parseAssignmentEvent(identifier, value, srcSpan, attribute.valueSpan, matchableAttributes, boundEvents, keySpan);
            }
            else if (bindParts[KW_AT_IDX]) {
                const keySpan = createKeySpan(srcSpan, '', name);
                this.bindingParser.parseLiteralAttr(name, value, srcSpan, absoluteOffset, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan);
            }
            return true;
        }
        // We didn't see a kw-prefixed property binding, but we have not yet checked
        // for the []/()/[()] syntax.
        let delims = null;
        if (name.startsWith(BINDING_DELIMS.BANANA_BOX.start)) {
            delims = BINDING_DELIMS.BANANA_BOX;
        }
        else if (name.startsWith(BINDING_DELIMS.PROPERTY.start)) {
            delims = BINDING_DELIMS.PROPERTY;
        }
        else if (name.startsWith(BINDING_DELIMS.EVENT.start)) {
            delims = BINDING_DELIMS.EVENT;
        }
        if (delims !== null &&
            // NOTE: older versions of the parser would match a start/end delimited
            // binding iff the property name was terminated by the ending delimiter
            // and the identifier in the binding was non-empty.
            // TODO(ayazhafiz): update this to handle malformed bindings.
            name.endsWith(delims.end) && name.length > delims.start.length + delims.end.length) {
            const identifier = name.substring(delims.start.length, name.length - delims.end.length);
            const keySpan = createKeySpan(srcSpan, delims.start, identifier);
            if (delims.start === BINDING_DELIMS.BANANA_BOX.start) {
                this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan);
                this.parseAssignmentEvent(identifier, value, srcSpan, attribute.valueSpan, matchableAttributes, boundEvents, keySpan);
            }
            else if (delims.start === BINDING_DELIMS.PROPERTY.start) {
                this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan);
            }
            else {
                const events = [];
                this.bindingParser.parseEvent(identifier, value, /* isAssignmentEvent */ false, srcSpan, attribute.valueSpan || srcSpan, matchableAttributes, events, keySpan);
                addEvents(events, boundEvents);
            }
            return true;
        }
        // No explicit binding found.
        const keySpan = createKeySpan(srcSpan, '' /* prefix */, name);
        const hasBinding = this.bindingParser.parsePropertyInterpolation(name, value, srcSpan, attribute.valueSpan, matchableAttributes, parsedProperties, keySpan, attribute.valueTokens ?? null);
        return hasBinding;
    }
    _visitTextWithInterpolation(value, sourceSpan, interpolatedTokens, i18n) {
        const valueNoNgsp = replaceNgsp(value);
        const expr = this.bindingParser.parseInterpolation(valueNoNgsp, sourceSpan, interpolatedTokens);
        return expr ? new BoundText(expr, sourceSpan, i18n) : new Text$3(valueNoNgsp, sourceSpan);
    }
    parseVariable(identifier, value, sourceSpan, keySpan, valueSpan, variables) {
        if (identifier.indexOf('-') > -1) {
            this.reportError(`"-" is not allowed in variable names`, sourceSpan);
        }
        else if (identifier.length === 0) {
            this.reportError(`Variable does not have a name`, sourceSpan);
        }
        variables.push(new Variable(identifier, value, sourceSpan, keySpan, valueSpan));
    }
    parseReference(identifier, value, sourceSpan, keySpan, valueSpan, references) {
        if (identifier.indexOf('-') > -1) {
            this.reportError(`"-" is not allowed in reference names`, sourceSpan);
        }
        else if (identifier.length === 0) {
            this.reportError(`Reference does not have a name`, sourceSpan);
        }
        else if (references.some(reference => reference.name === identifier)) {
            this.reportError(`Reference "#${identifier}" is defined more than once`, sourceSpan);
        }
        references.push(new Reference(identifier, value, sourceSpan, keySpan, valueSpan));
    }
    parseAssignmentEvent(name, expression, sourceSpan, valueSpan, targetMatchableAttrs, boundEvents, keySpan) {
        const events = [];
        this.bindingParser.parseEvent(`${name}Change`, `${expression} =$event`, /* isAssignmentEvent */ true, sourceSpan, valueSpan || sourceSpan, targetMatchableAttrs, events, keySpan);
        addEvents(events, boundEvents);
    }
    reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
        this.errors.push(new ParseError(sourceSpan, message, level));
    }
}
class NonBindableVisitor {
    visitElement(ast) {
        const preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        const children = visitAll(this, ast.children, null);
        return new Element$1(ast.name, visitAll(this, ast.attrs), 
        /* inputs */ [], /* outputs */ [], children, /* references */ [], ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    }
    visitComment(comment) {
        return null;
    }
    visitAttribute(attribute) {
        return new TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.keySpan, attribute.valueSpan, attribute.i18n);
    }
    visitText(text) {
        return new Text$3(text.value, text.sourceSpan);
    }
    visitExpansion(expansion) {
        return null;
    }
    visitExpansionCase(expansionCase) {
        return null;
    }
}
const NON_BINDABLE_VISITOR = new NonBindableVisitor();
function normalizeAttributeName(attrName) {
    return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
}
function addEvents(events, boundEvents) {
    boundEvents.push(...events.map(e => BoundEvent.fromParsedEvent(e)));
}
function isEmptyTextNode(node) {
    return node instanceof Text && node.value.trim().length == 0;
}
function isCommentNode(node) {
    return node instanceof Comment;
}
function textContents(node) {
    if (node.children.length !== 1 || !(node.children[0] instanceof Text)) {
        return null;
    }
    else {
        return node.children[0].value;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TagType;
(function (TagType) {
    TagType[TagType["ELEMENT"] = 0] = "ELEMENT";
    TagType[TagType["TEMPLATE"] = 1] = "TEMPLATE";
})(TagType || (TagType = {}));
/**
 * Generates an object that is used as a shared state between parent and all child contexts.
 */
function setupRegistry() {
    return { getUniqueId: getSeqNumberGenerator(), icus: new Map() };
}
/**
 * I18nContext is a helper class which keeps track of all i18n-related aspects
 * (accumulates placeholders, bindings, etc) between i18nStart and i18nEnd instructions.
 *
 * When we enter a nested template, the top-level context is being passed down
 * to the nested component, which uses this context to generate a child instance
 * of I18nContext class (to handle nested template) and at the end, reconciles it back
 * with the parent context.
 *
 * @param index Instruction index of i18nStart, which initiates this context
 * @param ref Reference to a translation const that represents the content if thus context
 * @param level Nestng level defined for child contexts
 * @param templateIndex Instruction index of a template which this context belongs to
 * @param meta Meta information (id, meaning, description, etc) associated with this context
 */
class I18nContext {
    constructor(index, ref, level = 0, templateIndex = null, meta, registry) {
        this.index = index;
        this.ref = ref;
        this.level = level;
        this.templateIndex = templateIndex;
        this.meta = meta;
        this.registry = registry;
        this.bindings = new Set();
        this.placeholders = new Map();
        this.isEmitted = false;
        this._unresolvedCtxCount = 0;
        this._registry = registry || setupRegistry();
        this.id = this._registry.getUniqueId();
    }
    appendTag(type, node, index, closed) {
        if (node.isVoid && closed) {
            return; // ignore "close" for void tags
        }
        const ph = node.isVoid || !closed ? node.startName : node.closeName;
        const content = { type, index, ctx: this.id, isVoid: node.isVoid, closed };
        updatePlaceholderMap(this.placeholders, ph, content);
    }
    get icus() {
        return this._registry.icus;
    }
    get isRoot() {
        return this.level === 0;
    }
    get isResolved() {
        return this._unresolvedCtxCount === 0;
    }
    getSerializedPlaceholders() {
        const result = new Map();
        this.placeholders.forEach((values, key) => result.set(key, values.map(serializePlaceholderValue)));
        return result;
    }
    // public API to accumulate i18n-related content
    appendBinding(binding) {
        this.bindings.add(binding);
    }
    appendIcu(name, ref) {
        updatePlaceholderMap(this._registry.icus, name, ref);
    }
    appendBoundText(node) {
        const phs = assembleBoundTextPlaceholders(node, this.bindings.size, this.id);
        phs.forEach((values, key) => updatePlaceholderMap(this.placeholders, key, ...values));
    }
    appendTemplate(node, index) {
        // add open and close tags at the same time,
        // since we process nested templates separately
        this.appendTag(TagType.TEMPLATE, node, index, false);
        this.appendTag(TagType.TEMPLATE, node, index, true);
        this._unresolvedCtxCount++;
    }
    appendElement(node, index, closed) {
        this.appendTag(TagType.ELEMENT, node, index, closed);
    }
    appendProjection(node, index) {
        // Add open and close tags at the same time, since `<ng-content>` has no content,
        // so when we come across `<ng-content>` we can register both open and close tags.
        // Note: runtime i18n logic doesn't distinguish `<ng-content>` tag placeholders and
        // regular element tag placeholders, so we generate element placeholders for both types.
        this.appendTag(TagType.ELEMENT, node, index, false);
        this.appendTag(TagType.ELEMENT, node, index, true);
    }
    /**
     * Generates an instance of a child context based on the root one,
     * when we enter a nested template within I18n section.
     *
     * @param index Instruction index of corresponding i18nStart, which initiates this context
     * @param templateIndex Instruction index of a template which this context belongs to
     * @param meta Meta information (id, meaning, description, etc) associated with this context
     *
     * @returns I18nContext instance
     */
    forkChildContext(index, templateIndex, meta) {
        return new I18nContext(index, this.ref, this.level + 1, templateIndex, meta, this._registry);
    }
    /**
     * Reconciles child context into parent one once the end of the i18n block is reached (i18nEnd).
     *
     * @param context Child I18nContext instance to be reconciled with parent context.
     */
    reconcileChildContext(context) {
        // set the right context id for open and close
        // template tags, so we can use it as sub-block ids
        ['start', 'close'].forEach((op) => {
            const key = context.meta[`${op}Name`];
            const phs = this.placeholders.get(key) || [];
            const tag = phs.find(findTemplateFn(this.id, context.templateIndex));
            if (tag) {
                tag.ctx = context.id;
            }
        });
        // reconcile placeholders
        const childPhs = context.placeholders;
        childPhs.forEach((values, key) => {
            const phs = this.placeholders.get(key);
            if (!phs) {
                this.placeholders.set(key, values);
                return;
            }
            // try to find matching template...
            const tmplIdx = phs.findIndex(findTemplateFn(context.id, context.templateIndex));
            if (tmplIdx >= 0) {
                // ... if found - replace it with nested template content
                const isCloseTag = key.startsWith('CLOSE');
                const isTemplateTag = key.endsWith('NG-TEMPLATE');
                if (isTemplateTag) {
                    // current template's content is placed before or after
                    // parent template tag, depending on the open/close atrribute
                    phs.splice(tmplIdx + (isCloseTag ? 0 : 1), 0, ...values);
                }
                else {
                    const idx = isCloseTag ? values.length - 1 : 0;
                    values[idx].tmpl = phs[tmplIdx];
                    phs.splice(tmplIdx, 1, ...values);
                }
            }
            else {
                // ... otherwise just append content to placeholder value
                phs.push(...values);
            }
            this.placeholders.set(key, phs);
        });
        this._unresolvedCtxCount--;
    }
}
//
// Helper methods
//
function wrap(symbol, index, contextId, closed) {
    const state = closed ? '/' : '';
    return wrapI18nPlaceholder(`${state}${symbol}${index}`, contextId);
}
function wrapTag(symbol, { index, ctx, isVoid }, closed) {
    return isVoid ? wrap(symbol, index, ctx) + wrap(symbol, index, ctx, true) :
        wrap(symbol, index, ctx, closed);
}
function findTemplateFn(ctx, templateIndex) {
    return (token) => typeof token === 'object' && token.type === TagType.TEMPLATE &&
        token.index === templateIndex && token.ctx === ctx;
}
function serializePlaceholderValue(value) {
    const element = (data, closed) => wrapTag('#', data, closed);
    const template = (data, closed) => wrapTag('*', data, closed);
    const projection = (data, closed) => wrapTag('!', data, closed);
    switch (value.type) {
        case TagType.ELEMENT:
            // close element tag
            if (value.closed) {
                return element(value, true) + (value.tmpl ? template(value.tmpl, true) : '');
            }
            // open element tag that also initiates a template
            if (value.tmpl) {
                return template(value.tmpl) + element(value) +
                    (value.isVoid ? template(value.tmpl, true) : '');
            }
            return element(value);
        case TagType.TEMPLATE:
            return template(value, value.closed);
        default:
            return value;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class IcuSerializerVisitor {
    visitText(text) {
        return text.value;
    }
    visitContainer(container) {
        return container.children.map(child => child.visit(this)).join('');
    }
    visitIcu(icu) {
        const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        const result = `{${icu.expressionPlaceholder}, ${icu.type}, ${strCases.join(' ')}}`;
        return result;
    }
    visitTagPlaceholder(ph) {
        return ph.isVoid ?
            this.formatPh(ph.startName) :
            `${this.formatPh(ph.startName)}${ph.children.map(child => child.visit(this)).join('')}${this.formatPh(ph.closeName)}`;
    }
    visitPlaceholder(ph) {
        return this.formatPh(ph.name);
    }
    visitIcuPlaceholder(ph, context) {
        return this.formatPh(ph.name);
    }
    formatPh(value) {
        return `{${formatI18nPlaceholderName(value, /* useCamelCase */ false)}}`;
    }
}
const serializer = new IcuSerializerVisitor();
function serializeIcuNode(icu) {
    return icu.visit(serializer);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 */
class PlaceholderRegistry {
    constructor() {
        // Count the occurrence of the base name top generate a unique name
        this._placeHolderNameCounts = {};
        // Maps signature to placeholder names
        this._signatureToName = {};
    }
    getStartTagPlaceholderName(tag, attrs, isVoid) {
        const signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const upperTag = tag.toUpperCase();
        const baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
        const name = this._generateUniqueName(isVoid ? baseName : `START_${baseName}`);
        this._signatureToName[signature] = name;
        return name;
    }
    getCloseTagPlaceholderName(tag) {
        const signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const upperTag = tag.toUpperCase();
        const baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
        const name = this._generateUniqueName(`CLOSE_${baseName}`);
        this._signatureToName[signature] = name;
        return name;
    }
    getPlaceholderName(name, content) {
        const upperName = name.toUpperCase();
        const signature = `PH: ${upperName}=${content}`;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    }
    getUniquePlaceholder(name) {
        return this._generateUniqueName(name.toUpperCase());
    }
    // Generate a hash for a tag - does not take attribute order into account
    _hashTag(tag, attrs, isVoid) {
        const start = `<${tag}`;
        const strAttrs = Object.keys(attrs).sort().map((name) => ` ${name}=${attrs[name]}`).join('');
        const end = isVoid ? '/>' : `></${tag}>`;
        return start + strAttrs + end;
    }
    _hashClosingTag(tag) {
        return this._hashTag(`/${tag}`, {}, false);
    }
    _generateUniqueName(base) {
        const seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        const id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return `${base}_${id}`;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _expParser = new Parser$1(new Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 */
function createI18nMessageFactory(interpolationConfig) {
    const visitor = new _I18nVisitor(_expParser, interpolationConfig);
    return (nodes, meaning, description, customId, visitNodeFn) => visitor.toI18nMessage(nodes, meaning, description, customId, visitNodeFn);
}
function noopVisitNodeFn(_html, i18n) {
    return i18n;
}
class _I18nVisitor {
    constructor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
    }
    toI18nMessage(nodes, meaning = '', description = '', customId = '', visitNodeFn) {
        const context = {
            isIcu: nodes.length == 1 && nodes[0] instanceof Expansion,
            icuDepth: 0,
            placeholderRegistry: new PlaceholderRegistry(),
            placeholderToContent: {},
            placeholderToMessage: {},
            visitNodeFn: visitNodeFn || noopVisitNodeFn,
        };
        const i18nodes = visitAll(this, nodes, context);
        return new Message(i18nodes, context.placeholderToContent, context.placeholderToMessage, meaning, description, customId);
    }
    visitElement(el, context) {
        const children = visitAll(this, el.children, context);
        const attrs = {};
        el.attrs.forEach(attr => {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        const isVoid = getHtmlTagDefinition(el.name).isVoid;
        const startPhName = context.placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        context.placeholderToContent[startPhName] = {
            text: el.startSourceSpan.toString(),
            sourceSpan: el.startSourceSpan,
        };
        let closePhName = '';
        if (!isVoid) {
            closePhName = context.placeholderRegistry.getCloseTagPlaceholderName(el.name);
            context.placeholderToContent[closePhName] = {
                text: `</${el.name}>`,
                sourceSpan: el.endSourceSpan ?? el.sourceSpan,
            };
        }
        const node = new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        return context.visitNodeFn(el, node);
    }
    visitAttribute(attribute, context) {
        const node = attribute.valueTokens === undefined || attribute.valueTokens.length === 1 ?
            new Text$2(attribute.value, attribute.valueSpan || attribute.sourceSpan) :
            this._visitTextWithInterpolation(attribute.valueTokens, attribute.valueSpan || attribute.sourceSpan, context, attribute.i18n);
        return context.visitNodeFn(attribute, node);
    }
    visitText(text, context) {
        const node = text.tokens.length === 1 ?
            new Text$2(text.value, text.sourceSpan) :
            this._visitTextWithInterpolation(text.tokens, text.sourceSpan, context, text.i18n);
        return context.visitNodeFn(text, node);
    }
    visitComment(comment, context) {
        return null;
    }
    visitExpansion(icu, context) {
        context.icuDepth++;
        const i18nIcuCases = {};
        const i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach((caze) => {
            i18nIcuCases[caze.value] = new Container(caze.expression.map((node) => node.visit(this, context)), caze.expSourceSpan);
        });
        context.icuDepth--;
        if (context.isIcu || context.icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            const expPh = context.placeholderRegistry.getUniquePlaceholder(`VAR_${icu.type}`);
            i18nIcu.expressionPlaceholder = expPh;
            context.placeholderToContent[expPh] = {
                text: icu.switchValue,
                sourceSpan: icu.switchValueSourceSpan,
            };
            return context.visitNodeFn(icu, i18nIcu);
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        const phName = context.placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        context.placeholderToMessage[phName] = this.toI18nMessage([icu], '', '', '', undefined);
        const node = new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
        return context.visitNodeFn(icu, node);
    }
    visitExpansionCase(_icuCase, _context) {
        throw new Error('Unreachable code');
    }
    /**
     * Convert, text and interpolated tokens up into text and placeholder pieces.
     *
     * @param tokens The text and interpolated tokens.
     * @param sourceSpan The span of the whole of the `text` string.
     * @param context The current context of the visitor, used to compute and store placeholders.
     * @param previousI18n Any i18n metadata associated with this `text` from a previous pass.
     */
    _visitTextWithInterpolation(tokens, sourceSpan, context, previousI18n) {
        // Return a sequence of `Text` and `Placeholder` nodes grouped in a `Container`.
        const nodes = [];
        // We will only create a container if there are actually interpolations,
        // so this flag tracks that.
        let hasInterpolation = false;
        for (const token of tokens) {
            switch (token.type) {
                case 8 /* INTERPOLATION */:
                case 17 /* ATTR_VALUE_INTERPOLATION */:
                    hasInterpolation = true;
                    const expression = token.parts[1];
                    const baseName = extractPlaceholderName(expression) || 'INTERPOLATION';
                    const phName = context.placeholderRegistry.getPlaceholderName(baseName, expression);
                    context.placeholderToContent[phName] = {
                        text: token.parts.join(''),
                        sourceSpan: token.sourceSpan
                    };
                    nodes.push(new Placeholder(expression, phName, token.sourceSpan));
                    break;
                default:
                    if (token.parts[0].length > 0) {
                        // This token is text or an encoded entity.
                        // If it is following on from a previous text node then merge it into that node
                        // Otherwise, if it is following an interpolation, then add a new node.
                        const previous = nodes[nodes.length - 1];
                        if (previous instanceof Text$2) {
                            previous.value += token.parts[0];
                            previous.sourceSpan = new ParseSourceSpan(previous.sourceSpan.start, token.sourceSpan.end, previous.sourceSpan.fullStart, previous.sourceSpan.details);
                        }
                        else {
                            nodes.push(new Text$2(token.parts[0], token.sourceSpan));
                        }
                    }
                    break;
            }
        }
        if (hasInterpolation) {
            // Whitespace removal may have invalidated the interpolation source-spans.
            reusePreviousSourceSpans(nodes, previousI18n);
            return new Container(nodes, sourceSpan);
        }
        else {
            return nodes[0];
        }
    }
}
/**
 * Re-use the source-spans from `previousI18n` metadata for the `nodes`.
 *
 * Whitespace removal can invalidate the source-spans of interpolation nodes, so we
 * reuse the source-span stored from a previous pass before the whitespace was removed.
 *
 * @param nodes The `Text` and `Placeholder` nodes to be processed.
 * @param previousI18n Any i18n metadata for these `nodes` stored from a previous pass.
 */
function reusePreviousSourceSpans(nodes, previousI18n) {
    if (previousI18n instanceof Message) {
        // The `previousI18n` is an i18n `Message`, so we are processing an `Attribute` with i18n
        // metadata. The `Message` should consist only of a single `Container` that contains the
        // parts (`Text` and `Placeholder`) to process.
        assertSingleContainerMessage(previousI18n);
        previousI18n = previousI18n.nodes[0];
    }
    if (previousI18n instanceof Container) {
        // The `previousI18n` is a `Container`, which means that this is a second i18n extraction pass
        // after whitespace has been removed from the AST nodes.
        assertEquivalentNodes(previousI18n.children, nodes);
        // Reuse the source-spans from the first pass.
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].sourceSpan = previousI18n.children[i].sourceSpan;
        }
    }
}
/**
 * Asserts that the `message` contains exactly one `Container` node.
 */
function assertSingleContainerMessage(message) {
    const nodes = message.nodes;
    if (nodes.length !== 1 || !(nodes[0] instanceof Container)) {
        throw new Error('Unexpected previous i18n message - expected it to consist of only a single `Container` node.');
    }
}
/**
 * Asserts that the `previousNodes` and `node` collections have the same number of elements and
 * corresponding elements have the same node type.
 */
function assertEquivalentNodes(previousNodes, nodes) {
    if (previousNodes.length !== nodes.length) {
        throw new Error('The number of i18n message children changed between first and second pass.');
    }
    if (previousNodes.some((node, i) => nodes[i].constructor !== node.constructor)) {
        throw new Error('The types of the i18n message children changed between first and second pass.');
    }
}
const _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
function extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An i18n error.
 */
class I18nError extends ParseError {
    constructor(span, msg) {
        super(span, msg);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const setI18nRefs = (htmlNode, i18nNode) => {
    if (htmlNode instanceof NodeWithI18n) {
        if (i18nNode instanceof IcuPlaceholder && htmlNode.i18n instanceof Message) {
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
class I18nMetaVisitor {
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
        visitAll(this, element.children, message);
        return element;
    }
    visitExpansion(expansion, currentMessage) {
        let message;
        const meta = expansion.i18n;
        this.hasI18nMeta = true;
        if (meta instanceof IcuPlaceholder) {
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
            meta instanceof Message ? meta :
                {};
    }
    /**
     * Generate (or restore) message id if not specified already.
     */
    _setMessageId(message, meta) {
        if (!message.id) {
            message.id = meta instanceof Message && meta.id || decimalDigest(message);
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
            const previousMessage = meta instanceof Message ? meta :
                meta instanceof IcuPlaceholder ? meta.previousMessage :
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
function parseI18nMeta(meta = '') {
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
function i18nMetaToJSDoc(meta) {
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
    return jsDocComment(tags);
}

/** Closure uses `goog.getMsg(message)` to lookup translations */
const GOOG_GET_MSG = 'goog.getMsg';
function createGoogleGetMsgStatements(variable$1, message, closureVar, params) {
    const messageString = serializeI18nMessageForGetMsg(message);
    const args = [literal(messageString)];
    if (Object.keys(params).length) {
        args.push(mapLiteral(params, true));
    }
    // /**
    //  * @desc description of message
    //  * @meaning meaning of message
    //  */
    // const MSG_... = goog.getMsg(..);
    // I18N_X = MSG_...;
    const googGetMsgStmt = closureVar.set(variable(GOOG_GET_MSG).callFn(args)).toConstDecl();
    googGetMsgStmt.addLeadingComment(i18nMetaToJSDoc(message));
    const i18nAssignmentStmt = new ExpressionStatement(variable$1.set(closureVar));
    return [googGetMsgStmt, i18nAssignmentStmt];
}
/**
 * This visitor walks over i18n tree and generates its string representation, including ICUs and
 * placeholders in `{$placeholder}` (for plain messages) or `{PLACEHOLDER}` (inside ICUs) format.
 */
class GetMsgSerializerVisitor {
    formatPh(value) {
        return `{$${formatI18nPlaceholderName(value)}}`;
    }
    visitText(text) {
        return text.value;
    }
    visitContainer(container) {
        return container.children.map(child => child.visit(this)).join('');
    }
    visitIcu(icu) {
        return serializeIcuNode(icu);
    }
    visitTagPlaceholder(ph) {
        return ph.isVoid ?
            this.formatPh(ph.startName) :
            `${this.formatPh(ph.startName)}${ph.children.map(child => child.visit(this)).join('')}${this.formatPh(ph.closeName)}`;
    }
    visitPlaceholder(ph) {
        return this.formatPh(ph.name);
    }
    visitIcuPlaceholder(ph, context) {
        return this.formatPh(ph.name);
    }
}
const serializerVisitor = new GetMsgSerializerVisitor();
function serializeI18nMessageForGetMsg(message) {
    return message.nodes.map(node => node.visit(serializerVisitor, null)).join('');
}

function createLocalizeStatements(variable, message, params) {
    const { messageParts, placeHolders } = serializeI18nMessageForLocalize(message);
    const sourceSpan = getSourceSpan(message);
    const expressions = placeHolders.map(ph => params[ph.text]);
    const localizedString$1 = localizedString(message, messageParts, placeHolders, expressions, sourceSpan);
    const variableInitialization = variable.set(localizedString$1);
    return [new ExpressionStatement(variableInitialization)];
}
/**
 * This visitor walks over an i18n tree, capturing literal strings and placeholders.
 *
 * The result can be used for generating the `$localize` tagged template literals.
 */
class LocalizeSerializerVisitor {
    constructor(placeholderToMessage, pieces) {
        this.placeholderToMessage = placeholderToMessage;
        this.pieces = pieces;
    }
    visitText(text) {
        if (this.pieces[this.pieces.length - 1] instanceof LiteralPiece) {
            // Two literal pieces in a row means that there was some comment node in-between.
            this.pieces[this.pieces.length - 1].text += text.value;
        }
        else {
            const sourceSpan = new ParseSourceSpan(text.sourceSpan.fullStart, text.sourceSpan.end, text.sourceSpan.fullStart, text.sourceSpan.details);
            this.pieces.push(new LiteralPiece(text.value, sourceSpan));
        }
    }
    visitContainer(container) {
        container.children.forEach(child => child.visit(this));
    }
    visitIcu(icu) {
        this.pieces.push(new LiteralPiece(serializeIcuNode(icu), icu.sourceSpan));
    }
    visitTagPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.startName, ph.startSourceSpan ?? ph.sourceSpan));
        if (!ph.isVoid) {
            ph.children.forEach(child => child.visit(this));
            this.pieces.push(this.createPlaceholderPiece(ph.closeName, ph.endSourceSpan ?? ph.sourceSpan));
        }
    }
    visitPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan));
    }
    visitIcuPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan, this.placeholderToMessage[ph.name]));
    }
    createPlaceholderPiece(name, sourceSpan, associatedMessage) {
        return new PlaceholderPiece(formatI18nPlaceholderName(name, /* useCamelCase */ false), sourceSpan, associatedMessage);
    }
}
/**
 * Serialize an i18n message into two arrays: messageParts and placeholders.
 *
 * These arrays will be used to generate `$localize` tagged template literals.
 *
 * @param message The message to be serialized.
 * @returns an object containing the messageParts and placeholders.
 */
function serializeI18nMessageForLocalize(message) {
    const pieces = [];
    const serializerVisitor = new LocalizeSerializerVisitor(message.placeholderToMessage, pieces);
    message.nodes.forEach(node => node.visit(serializerVisitor));
    return processMessagePieces(pieces);
}
function getSourceSpan(message) {
    const startNode = message.nodes[0];
    const endNode = message.nodes[message.nodes.length - 1];
    return new ParseSourceSpan(startNode.sourceSpan.fullStart, endNode.sourceSpan.end, startNode.sourceSpan.fullStart, startNode.sourceSpan.details);
}
/**
 * Convert the list of serialized MessagePieces into two arrays.
 *
 * One contains the literal string pieces and the other the placeholders that will be replaced by
 * expressions when rendering `$localize` tagged template literals.
 *
 * @param pieces The pieces to process.
 * @returns an object containing the messageParts and placeholders.
 */
function processMessagePieces(pieces) {
    const messageParts = [];
    const placeHolders = [];
    if (pieces[0] instanceof PlaceholderPiece) {
        // The first piece was a placeholder so we need to add an initial empty message part.
        messageParts.push(createEmptyMessagePart(pieces[0].sourceSpan.start));
    }
    for (let i = 0; i < pieces.length; i++) {
        const part = pieces[i];
        if (part instanceof LiteralPiece) {
            messageParts.push(part);
        }
        else {
            placeHolders.push(part);
            if (pieces[i - 1] instanceof PlaceholderPiece) {
                // There were two placeholders in a row, so we need to add an empty message part.
                messageParts.push(createEmptyMessagePart(pieces[i - 1].sourceSpan.end));
            }
        }
    }
    if (pieces[pieces.length - 1] instanceof PlaceholderPiece) {
        // The last piece was a placeholder so we need to add a final empty message part.
        messageParts.push(createEmptyMessagePart(pieces[pieces.length - 1].sourceSpan.end));
    }
    return { messageParts, placeHolders };
}
function createEmptyMessagePart(location) {
    return new LiteralPiece('', new ParseSourceSpan(location, location));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Selector attribute name of `<ng-content>`
const NG_CONTENT_SELECT_ATTR = 'select';
// Attribute name of `ngProjectAs`.
const NG_PROJECT_AS_ATTR_NAME = 'ngProjectAs';
// Global symbols available only inside event bindings.
const EVENT_BINDING_SCOPE_GLOBALS = new Set(['$event']);
// List of supported global targets for event listeners
const GLOBAL_TARGET_RESOLVERS = new Map([['window', Identifiers.resolveWindow], ['document', Identifiers.resolveDocument], ['body', Identifiers.resolveBody]]);
const LEADING_TRIVIA_CHARS = [' ', '\n', '\r', '\t'];
//  if (rf & flags) { .. }
function renderFlagCheckIfStmt(flags, statements) {
    return ifStmt(variable(RENDER_FLAGS).bitwiseAnd(literal(flags), null, false), statements);
}
function prepareEventListenerParameters(eventAst, handlerName = null, scope = null) {
    const { type, name, target, phase, handler } = eventAst;
    if (target && !GLOBAL_TARGET_RESOLVERS.has(target)) {
        throw new Error(`Unexpected global target '${target}' defined for '${name}' event.
        Supported list of global targets: ${Array.from(GLOBAL_TARGET_RESOLVERS.keys())}.`);
    }
    const eventArgumentName = '$event';
    const implicitReceiverAccesses = new Set();
    const implicitReceiverExpr = (scope === null || scope.bindingLevel === 0) ?
        variable(CONTEXT_NAME) :
        scope.getOrCreateSharedContextVar(0);
    const bindingStatements = convertActionBinding(scope, implicitReceiverExpr, handler, 'b', eventAst.handlerSpan, implicitReceiverAccesses, EVENT_BINDING_SCOPE_GLOBALS);
    const statements = [];
    if (scope) {
        // `variableDeclarations` needs to run first, because
        // `restoreViewStatement` depends on the result.
        statements.push(...scope.variableDeclarations());
        statements.unshift(...scope.restoreViewStatement());
    }
    statements.push(...bindingStatements);
    const eventName = type === 1 /* Animation */ ? prepareSyntheticListenerName(name, phase) : name;
    const fnName = handlerName && sanitizeIdentifier(handlerName);
    const fnArgs = [];
    if (implicitReceiverAccesses.has(eventArgumentName)) {
        fnArgs.push(new FnParam(eventArgumentName, DYNAMIC_TYPE));
    }
    const handlerFn = fn(fnArgs, statements, INFERRED_TYPE, null, fnName);
    const params = [literal(eventName), handlerFn];
    if (target) {
        params.push(literal(false), // `useCapture` flag, defaults to `false`
        importExpr(GLOBAL_TARGET_RESOLVERS.get(target)));
    }
    return params;
}
function createComponentDefConsts() {
    return {
        prepareStatements: [],
        constExpressions: [],
        i18nVarRefsCache: new Map(),
    };
}
class TemplateDefinitionBuilder {
    constructor(constantPool, parentBindingScope, level = 0, contextName, i18nContext, templateIndex, templateName, _namespace, relativeContextFilePath, i18nUseExternalIds, _constants = createComponentDefConsts()) {
        this.constantPool = constantPool;
        this.level = level;
        this.contextName = contextName;
        this.i18nContext = i18nContext;
        this.templateIndex = templateIndex;
        this.templateName = templateName;
        this._namespace = _namespace;
        this.i18nUseExternalIds = i18nUseExternalIds;
        this._constants = _constants;
        this._dataIndex = 0;
        this._bindingContext = 0;
        this._prefixCode = [];
        /**
         * List of callbacks to generate creation mode instructions. We store them here as we process
         * the template so bindings in listeners are resolved only once all nodes have been visited.
         * This ensures all local refs and context variables are available for matching.
         */
        this._creationCodeFns = [];
        /**
         * List of callbacks to generate update mode instructions. We store them here as we process
         * the template so bindings are resolved only once all nodes have been visited. This ensures
         * all local refs and context variables are available for matching.
         */
        this._updateCodeFns = [];
        /** Index of the currently-selected node. */
        this._currentIndex = 0;
        /** Temporary variable declarations generated from visiting pipes, literals, etc. */
        this._tempVariables = [];
        /**
         * List of callbacks to build nested templates. Nested templates must not be visited until
         * after the parent template has finished visiting all of its nodes. This ensures that all
         * local ref bindings in nested templates are able to find local ref values if the refs
         * are defined after the template declaration.
         */
        this._nestedTemplateFns = [];
        // i18n context local to this template
        this.i18n = null;
        // Number of slots to reserve for pureFunctions
        this._pureFunctionSlots = 0;
        // Number of binding slots
        this._bindingSlots = 0;
        // Projection slots found in the template. Projection slots can distribute projected
        // nodes based on a selector, or can just use the wildcard selector to match
        // all nodes which aren't matching any selector.
        this._ngContentReservedSlots = [];
        // Number of non-default selectors found in all parent templates of this template. We need to
        // track it to properly adjust projection slot index in the `projection` instruction.
        this._ngContentSelectorsOffset = 0;
        // Expression that should be used as implicit receiver when converting template
        // expressions to output AST.
        this._implicitReceiverExpr = null;
        // These should be handled in the template or element directly.
        this.visitReference = invalid;
        this.visitVariable = invalid;
        this.visitTextAttribute = invalid;
        this.visitBoundAttribute = invalid;
        this.visitBoundEvent = invalid;
        this._bindingScope = parentBindingScope.nestedScope(level);
        // Turn the relative context file path into an identifier by replacing non-alphanumeric
        // characters with underscores.
        this.fileBasedI18nSuffix = relativeContextFilePath.replace(/[^A-Za-z0-9]/g, '_') + '_';
        this._valueConverter = new ValueConverter(constantPool, () => this.allocateDataSlot(), (numSlots) => this.allocatePureFunctionSlots(numSlots), (name, localName, slot, value) => {
            this._bindingScope.set(this.level, localName, value);
            this.creationInstruction(null, Identifiers.pipe, [literal(slot), literal(name)]);
        });
    }
    buildTemplateFunction(nodes, variables, ngContentSelectorsOffset = 0, i18n) {
        this._ngContentSelectorsOffset = ngContentSelectorsOffset;
        if (this._namespace !== Identifiers.namespaceHTML) {
            this.creationInstruction(null, this._namespace);
        }
        // Create variable bindings
        variables.forEach(v => this.registerContextVariables(v));
        // Initiate i18n context in case:
        // - this template has parent i18n context
        // - or the template has i18n meta associated with it,
        //   but it's not initiated by the Element (e.g. <ng-template i18n>)
        const initI18nContext = this.i18nContext ||
            (isI18nRootNode(i18n) && !isSingleI18nIcu(i18n) &&
                !(isSingleElementTemplate(nodes) && nodes[0].i18n === i18n));
        const selfClosingI18nInstruction = hasTextChildrenOnly(nodes);
        if (initI18nContext) {
            this.i18nStart(null, i18n, selfClosingI18nInstruction);
        }
        // This is the initial pass through the nodes of this template. In this pass, we
        // queue all creation mode and update mode instructions for generation in the second
        // pass. It's necessary to separate the passes to ensure local refs are defined before
        // resolving bindings. We also count bindings in this pass as we walk bound expressions.
        visitAll$1(this, nodes);
        // Add total binding count to pure function count so pure function instructions are
        // generated with the correct slot offset when update instructions are processed.
        this._pureFunctionSlots += this._bindingSlots;
        // Pipes are walked in the first pass (to enqueue `pipe()` creation instructions and
        // `pipeBind` update instructions), so we have to update the slot offsets manually
        // to account for bindings.
        this._valueConverter.updatePipeSlotOffsets(this._bindingSlots);
        // Nested templates must be processed before creation instructions so template()
        // instructions can be generated with the correct internal const count.
        this._nestedTemplateFns.forEach(buildTemplateFn => buildTemplateFn());
        // Output the `projectionDef` instruction when some `<ng-content>` tags are present.
        // The `projectionDef` instruction is only emitted for the component template and
        // is skipped for nested templates (<ng-template> tags).
        if (this.level === 0 && this._ngContentReservedSlots.length) {
            const parameters = [];
            // By default the `projectionDef` instructions creates one slot for the wildcard
            // selector if no parameters are passed. Therefore we only want to allocate a new
            // array for the projection slots if the default projection slot is not sufficient.
            if (this._ngContentReservedSlots.length > 1 || this._ngContentReservedSlots[0] !== '*') {
                const r3ReservedSlots = this._ngContentReservedSlots.map(s => s !== '*' ? parseSelectorToR3Selector(s) : s);
                parameters.push(this.constantPool.getConstLiteral(asLiteral(r3ReservedSlots), true));
            }
            // Since we accumulate ngContent selectors while processing template elements,
            // we *prepend* `projectionDef` to creation instructions block, to put it before
            // any `projection` instructions
            this.creationInstruction(null, Identifiers.projectionDef, parameters, /* prepend */ true);
        }
        if (initI18nContext) {
            this.i18nEnd(null, selfClosingI18nInstruction);
        }
        // Generate all the creation mode instructions (e.g. resolve bindings in listeners)
        const creationStatements = getInstructionStatements(this._creationCodeFns);
        // Generate all the update mode instructions (e.g. resolve property or text bindings)
        const updateStatements = getInstructionStatements(this._updateCodeFns);
        //  Variable declaration must occur after binding resolution so we can generate context
        //  instructions that build on each other.
        // e.g. const b = nextContext().$implicit(); const b = nextContext();
        const creationVariables = this._bindingScope.viewSnapshotStatements();
        const updateVariables = this._bindingScope.variableDeclarations().concat(this._tempVariables);
        const creationBlock = creationStatements.length > 0 ?
            [renderFlagCheckIfStmt(1 /* Create */, creationVariables.concat(creationStatements))] :
            [];
        const updateBlock = updateStatements.length > 0 ?
            [renderFlagCheckIfStmt(2 /* Update */, updateVariables.concat(updateStatements))] :
            [];
        return fn(
        // i.e. (rf: RenderFlags, ctx: any)
        [new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)], [
            // Temporary variable declarations for query refresh (i.e. let _t: any;)
            ...this._prefixCode,
            // Creating mode (i.e. if (rf & RenderFlags.Create) { ... })
            ...creationBlock,
            // Binding and refresh mode (i.e. if (rf & RenderFlags.Update) {...})
            ...updateBlock,
        ], INFERRED_TYPE, null, this.templateName);
    }
    // LocalResolver
    getLocal(name) {
        return this._bindingScope.get(name);
    }
    // LocalResolver
    notifyImplicitReceiverUse() {
        this._bindingScope.notifyImplicitReceiverUse();
    }
    // LocalResolver
    maybeRestoreView() {
        this._bindingScope.maybeRestoreView();
    }
    i18nTranslate(message, params = {}, ref, transformFn) {
        const _ref = ref || this.i18nGenerateMainBlockVar();
        // Closure Compiler requires const names to start with `MSG_` but disallows any other const to
        // start with `MSG_`. We define a variable starting with `MSG_` just for the `goog.getMsg` call
        const closureVar = this.i18nGenerateClosureVar(message.id);
        const statements = getTranslationDeclStmts(message, _ref, closureVar, params, transformFn);
        this._constants.prepareStatements.push(...statements);
        return _ref;
    }
    registerContextVariables(variable$1) {
        const scopedName = this._bindingScope.freshReferenceName();
        const retrievalLevel = this.level;
        const lhs = variable(variable$1.name + scopedName);
        this._bindingScope.set(retrievalLevel, variable$1.name, lhs, 1 /* CONTEXT */, (scope, relativeLevel) => {
            let rhs;
            if (scope.bindingLevel === retrievalLevel) {
                if (scope.isListenerScope() && scope.hasRestoreViewVariable()) {
                    // e.g. restoredCtx.
                    // We have to get the context from a view reference, if one is available, because
                    // the context that was passed in during creation may not be correct anymore.
                    // For more information see: https://github.com/angular/angular/pull/40360.
                    rhs = variable(RESTORED_VIEW_CONTEXT_NAME);
                    scope.notifyRestoredViewContextUse();
                }
                else {
                    // e.g. ctx
                    rhs = variable(CONTEXT_NAME);
                }
            }
            else {
                const sharedCtxVar = scope.getSharedContextName(retrievalLevel);
                // e.g. ctx_r0   OR  x(2);
                rhs = sharedCtxVar ? sharedCtxVar : generateNextContextExpr(relativeLevel);
            }
            // e.g. const $item$ = x(2).$implicit;
            return [lhs.set(rhs.prop(variable$1.value || IMPLICIT_REFERENCE)).toConstDecl()];
        });
    }
    i18nAppendBindings(expressions) {
        if (expressions.length > 0) {
            expressions.forEach(expression => this.i18n.appendBinding(expression));
        }
    }
    i18nBindProps(props) {
        const bound = {};
        Object.keys(props).forEach(key => {
            const prop = props[key];
            if (prop instanceof Text$3) {
                bound[key] = literal(prop.value);
            }
            else {
                const value = prop.value.visit(this._valueConverter);
                this.allocateBindingSlots(value);
                if (value instanceof Interpolation) {
                    const { strings, expressions } = value;
                    const { id, bindings } = this.i18n;
                    const label = assembleI18nBoundString(strings, bindings.size, id);
                    this.i18nAppendBindings(expressions);
                    bound[key] = literal(label);
                }
            }
        });
        return bound;
    }
    // Generates top level vars for i18n blocks (i.e. `i18n_N`).
    i18nGenerateMainBlockVar() {
        return variable(this.constantPool.uniqueName(TRANSLATION_VAR_PREFIX));
    }
    // Generates vars with Closure-specific names for i18n blocks (i.e. `MSG_XXX`).
    i18nGenerateClosureVar(messageId) {
        let name;
        const suffix = this.fileBasedI18nSuffix.toUpperCase();
        if (this.i18nUseExternalIds) {
            const prefix = getTranslationConstPrefix(`EXTERNAL_`);
            const uniqueSuffix = this.constantPool.uniqueName(suffix);
            name = `${prefix}${sanitizeIdentifier(messageId)}$$${uniqueSuffix}`;
        }
        else {
            const prefix = getTranslationConstPrefix(suffix);
            name = this.constantPool.uniqueName(prefix);
        }
        return variable(name);
    }
    i18nUpdateRef(context) {
        const { icus, meta, isRoot, isResolved, isEmitted } = context;
        if (isRoot && isResolved && !isEmitted && !isSingleI18nIcu(meta)) {
            context.isEmitted = true;
            const placeholders = context.getSerializedPlaceholders();
            let icuMapping = {};
            let params = placeholders.size ? placeholdersToParams(placeholders) : {};
            if (icus.size) {
                icus.forEach((refs, key) => {
                    if (refs.length === 1) {
                        // if we have one ICU defined for a given
                        // placeholder - just output its reference
                        params[key] = refs[0];
                    }
                    else {
                        // ... otherwise we need to activate post-processing
                        // to replace ICU placeholders with proper values
                        const placeholder = wrapI18nPlaceholder(`${I18N_ICU_MAPPING_PREFIX}${key}`);
                        params[key] = literal(placeholder);
                        icuMapping[key] = literalArr(refs);
                    }
                });
            }
            // translation requires post processing in 2 cases:
            // - if we have placeholders with multiple values (ex. `START_DIV`: [�#1�, �#2�, ...])
            // - if we have multiple ICUs that refer to the same placeholder name
            const needsPostprocessing = Array.from(placeholders.values()).some((value) => value.length > 1) ||
                Object.keys(icuMapping).length;
            let transformFn;
            if (needsPostprocessing) {
                transformFn = (raw) => {
                    const args = [raw];
                    if (Object.keys(icuMapping).length) {
                        args.push(mapLiteral(icuMapping, true));
                    }
                    return invokeInstruction(null, Identifiers.i18nPostprocess, args);
                };
            }
            this.i18nTranslate(meta, params, context.ref, transformFn);
        }
    }
    i18nStart(span = null, meta, selfClosing) {
        const index = this.allocateDataSlot();
        this.i18n = this.i18nContext ?
            this.i18nContext.forkChildContext(index, this.templateIndex, meta) :
            new I18nContext(index, this.i18nGenerateMainBlockVar(), 0, this.templateIndex, meta);
        // generate i18nStart instruction
        const { id, ref } = this.i18n;
        const params = [literal(index), this.addToConsts(ref)];
        if (id > 0) {
            // do not push 3rd argument (sub-block id)
            // into i18nStart call for top level i18n context
            params.push(literal(id));
        }
        this.creationInstruction(span, selfClosing ? Identifiers.i18n : Identifiers.i18nStart, params);
    }
    i18nEnd(span = null, selfClosing) {
        if (!this.i18n) {
            throw new Error('i18nEnd is executed with no i18n context present');
        }
        if (this.i18nContext) {
            this.i18nContext.reconcileChildContext(this.i18n);
            this.i18nUpdateRef(this.i18nContext);
        }
        else {
            this.i18nUpdateRef(this.i18n);
        }
        // setup accumulated bindings
        const { index, bindings } = this.i18n;
        if (bindings.size) {
            for (const binding of bindings) {
                // for i18n block, advance to the most recent element index (by taking the current number of
                // elements and subtracting one) before invoking `i18nExp` instructions, to make sure the
                // necessary lifecycle hooks of components/directives are properly flushed.
                this.updateInstructionWithAdvance(this.getConstCount() - 1, span, Identifiers.i18nExp, () => this.convertPropertyBinding(binding));
            }
            this.updateInstruction(span, Identifiers.i18nApply, [literal(index)]);
        }
        if (!selfClosing) {
            this.creationInstruction(span, Identifiers.i18nEnd);
        }
        this.i18n = null; // reset local i18n context
    }
    i18nAttributesInstruction(nodeIndex, attrs, sourceSpan) {
        let hasBindings = false;
        const i18nAttrArgs = [];
        attrs.forEach(attr => {
            const message = attr.i18n;
            const converted = attr.value.visit(this._valueConverter);
            this.allocateBindingSlots(converted);
            if (converted instanceof Interpolation) {
                const placeholders = assembleBoundTextPlaceholders(message);
                const params = placeholdersToParams(placeholders);
                i18nAttrArgs.push(literal(attr.name), this.i18nTranslate(message, params));
                converted.expressions.forEach(expression => {
                    hasBindings = true;
                    this.updateInstructionWithAdvance(nodeIndex, sourceSpan, Identifiers.i18nExp, () => this.convertPropertyBinding(expression));
                });
            }
        });
        if (i18nAttrArgs.length > 0) {
            const index = literal(this.allocateDataSlot());
            const constIndex = this.addToConsts(literalArr(i18nAttrArgs));
            this.creationInstruction(sourceSpan, Identifiers.i18nAttributes, [index, constIndex]);
            if (hasBindings) {
                this.updateInstruction(sourceSpan, Identifiers.i18nApply, [index]);
            }
        }
    }
    getNamespaceInstruction(namespaceKey) {
        switch (namespaceKey) {
            case 'math':
                return Identifiers.namespaceMathML;
            case 'svg':
                return Identifiers.namespaceSVG;
            default:
                return Identifiers.namespaceHTML;
        }
    }
    addNamespaceInstruction(nsInstruction, element) {
        this._namespace = nsInstruction;
        this.creationInstruction(element.startSourceSpan, nsInstruction);
    }
    /**
     * Adds an update instruction for an interpolated property or attribute, such as
     * `prop="{{value}}"` or `attr.title="{{value}}"`
     */
    interpolatedUpdateInstruction(instruction, elementIndex, attrName, input, value, params) {
        this.updateInstructionWithAdvance(elementIndex, input.sourceSpan, instruction, () => [literal(attrName), ...this.getUpdateInstructionArguments(value), ...params]);
    }
    visitContent(ngContent) {
        const slot = this.allocateDataSlot();
        const projectionSlotIdx = this._ngContentSelectorsOffset + this._ngContentReservedSlots.length;
        const parameters = [literal(slot)];
        this._ngContentReservedSlots.push(ngContent.selector);
        const nonContentSelectAttributes = ngContent.attributes.filter(attr => attr.name.toLowerCase() !== NG_CONTENT_SELECT_ATTR);
        const attributes = this.getAttributeExpressions(ngContent.name, nonContentSelectAttributes, [], []);
        if (attributes.length > 0) {
            parameters.push(literal(projectionSlotIdx), literalArr(attributes));
        }
        else if (projectionSlotIdx !== 0) {
            parameters.push(literal(projectionSlotIdx));
        }
        this.creationInstruction(ngContent.sourceSpan, Identifiers.projection, parameters);
        if (this.i18n) {
            this.i18n.appendProjection(ngContent.i18n, slot);
        }
    }
    visitElement(element) {
        const elementIndex = this.allocateDataSlot();
        const stylingBuilder = new StylingBuilder(null);
        let isNonBindableMode = false;
        const isI18nRootElement = isI18nRootNode(element.i18n) && !isSingleI18nIcu(element.i18n);
        const outputAttrs = [];
        const [namespaceKey, elementName] = splitNsName(element.name);
        const isNgContainer$1 = isNgContainer(element.name);
        // Handle styling, i18n, ngNonBindable attributes
        for (const attr of element.attributes) {
            const { name, value } = attr;
            if (name === NON_BINDABLE_ATTR) {
                isNonBindableMode = true;
            }
            else if (name === 'style') {
                stylingBuilder.registerStyleAttr(value);
            }
            else if (name === 'class') {
                stylingBuilder.registerClassAttr(value);
            }
            else {
                outputAttrs.push(attr);
            }
        }
        // Regular element or ng-container creation mode
        const parameters = [literal(elementIndex)];
        if (!isNgContainer$1) {
            parameters.push(literal(elementName));
        }
        // Add the attributes
        const allOtherInputs = [];
        const boundI18nAttrs = [];
        element.inputs.forEach(input => {
            const stylingInputWasSet = stylingBuilder.registerBoundInput(input);
            if (!stylingInputWasSet) {
                if (input.type === 0 /* Property */ && input.i18n) {
                    boundI18nAttrs.push(input);
                }
                else {
                    allOtherInputs.push(input);
                }
            }
        });
        // add attributes for directive and projection matching purposes
        const attributes = this.getAttributeExpressions(element.name, outputAttrs, allOtherInputs, element.outputs, stylingBuilder, [], boundI18nAttrs);
        parameters.push(this.addAttrsToConsts(attributes));
        // local refs (ex.: <div #foo #bar="baz">)
        const refs = this.prepareRefsArray(element.references);
        parameters.push(this.addToConsts(refs));
        const wasInNamespace = this._namespace;
        const currentNamespace = this.getNamespaceInstruction(namespaceKey);
        // If the namespace is changing now, include an instruction to change it
        // during element creation.
        if (currentNamespace !== wasInNamespace) {
            this.addNamespaceInstruction(currentNamespace, element);
        }
        if (this.i18n) {
            this.i18n.appendElement(element.i18n, elementIndex);
        }
        // Note that we do not append text node instructions and ICUs inside i18n section,
        // so we exclude them while calculating whether current element has children
        const hasChildren = (!isI18nRootElement && this.i18n) ? !hasTextChildrenOnly(element.children) :
            element.children.length > 0;
        const createSelfClosingInstruction = !stylingBuilder.hasBindingsWithPipes &&
            element.outputs.length === 0 && boundI18nAttrs.length === 0 && !hasChildren;
        const createSelfClosingI18nInstruction = !createSelfClosingInstruction && hasTextChildrenOnly(element.children);
        if (createSelfClosingInstruction) {
            this.creationInstruction(element.sourceSpan, isNgContainer$1 ? Identifiers.elementContainer : Identifiers.element, trimTrailingNulls(parameters));
        }
        else {
            this.creationInstruction(element.startSourceSpan, isNgContainer$1 ? Identifiers.elementContainerStart : Identifiers.elementStart, trimTrailingNulls(parameters));
            if (isNonBindableMode) {
                this.creationInstruction(element.startSourceSpan, Identifiers.disableBindings);
            }
            if (boundI18nAttrs.length > 0) {
                this.i18nAttributesInstruction(elementIndex, boundI18nAttrs, element.startSourceSpan ?? element.sourceSpan);
            }
            // Generate Listeners (outputs)
            if (element.outputs.length > 0) {
                for (const outputAst of element.outputs) {
                    this.creationInstruction(outputAst.sourceSpan, Identifiers.listener, this.prepareListenerParameter(element.name, outputAst, elementIndex));
                }
            }
            // Note: it's important to keep i18n/i18nStart instructions after i18nAttributes and
            // listeners, to make sure i18nAttributes instruction targets current element at runtime.
            if (isI18nRootElement) {
                this.i18nStart(element.startSourceSpan, element.i18n, createSelfClosingI18nInstruction);
            }
        }
        // the code here will collect all update-level styling instructions and add them to the
        // update block of the template function AOT code. Instructions like `styleProp`,
        // `styleMap`, `classMap`, `classProp`
        // are all generated and assigned in the code below.
        const stylingInstructions = stylingBuilder.buildUpdateLevelInstructions(this._valueConverter);
        const limit = stylingInstructions.length - 1;
        for (let i = 0; i <= limit; i++) {
            const instruction = stylingInstructions[i];
            this._bindingSlots += this.processStylingUpdateInstruction(elementIndex, instruction);
        }
        // the reason why `undefined` is used is because the renderer understands this as a
        // special value to symbolize that there is no RHS to this binding
        // TODO (matsko): revisit this once FW-959 is approached
        const emptyValueBindInstruction = literal(undefined);
        const propertyBindings = [];
        const attributeBindings = [];
        // Generate element input bindings
        allOtherInputs.forEach(input => {
            const inputType = input.type;
            if (inputType === 4 /* Animation */) {
                const value = input.value.visit(this._valueConverter);
                // animation bindings can be presented in the following formats:
                // 1. [@binding]="fooExp"
                // 2. [@binding]="{value:fooExp, params:{...}}"
                // 3. [@binding]
                // 4. @binding
                // All formats will be valid for when a synthetic binding is created.
                // The reasoning for this is because the renderer should get each
                // synthetic binding value in the order of the array that they are
                // defined in...
                const hasValue = value instanceof LiteralPrimitive ? !!value.value : true;
                this.allocateBindingSlots(value);
                propertyBindings.push({
                    span: input.sourceSpan,
                    paramsOrFn: getBindingFunctionParams(() => hasValue ? this.convertPropertyBinding(value) : emptyValueBindInstruction, prepareSyntheticPropertyName(input.name))
                });
            }
            else {
                // we must skip attributes with associated i18n context, since these attributes are handled
                // separately and corresponding `i18nExp` and `i18nApply` instructions will be generated
                if (input.i18n)
                    return;
                const value = input.value.visit(this._valueConverter);
                if (value !== undefined) {
                    const params = [];
                    const [attrNamespace, attrName] = splitNsName(input.name);
                    const isAttributeBinding = inputType === 1 /* Attribute */;
                    const sanitizationRef = resolveSanitizationFn(input.securityContext, isAttributeBinding);
                    if (sanitizationRef)
                        params.push(sanitizationRef);
                    if (attrNamespace) {
                        const namespaceLiteral = literal(attrNamespace);
                        if (sanitizationRef) {
                            params.push(namespaceLiteral);
                        }
                        else {
                            // If there wasn't a sanitization ref, we need to add
                            // an extra param so that we can pass in the namespace.
                            params.push(literal(null), namespaceLiteral);
                        }
                    }
                    this.allocateBindingSlots(value);
                    if (inputType === 0 /* Property */) {
                        if (value instanceof Interpolation) {
                            // prop="{{value}}" and friends
                            this.interpolatedUpdateInstruction(getPropertyInterpolationExpression(value), elementIndex, attrName, input, value, params);
                        }
                        else {
                            // [prop]="value"
                            // Collect all the properties so that we can chain into a single function at the end.
                            propertyBindings.push({
                                span: input.sourceSpan,
                                paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(value), attrName, params)
                            });
                        }
                    }
                    else if (inputType === 1 /* Attribute */) {
                        if (value instanceof Interpolation && getInterpolationArgsLength(value) > 1) {
                            // attr.name="text{{value}}" and friends
                            this.interpolatedUpdateInstruction(getAttributeInterpolationExpression(value), elementIndex, attrName, input, value, params);
                        }
                        else {
                            const boundValue = value instanceof Interpolation ? value.expressions[0] : value;
                            // [attr.name]="value" or attr.name="{{value}}"
                            // Collect the attribute bindings so that they can be chained at the end.
                            attributeBindings.push({
                                span: input.sourceSpan,
                                paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(boundValue), attrName, params)
                            });
                        }
                    }
                    else {
                        // class prop
                        this.updateInstructionWithAdvance(elementIndex, input.sourceSpan, Identifiers.classProp, () => {
                            return [
                                literal(elementIndex), literal(attrName), this.convertPropertyBinding(value),
                                ...params
                            ];
                        });
                    }
                }
            }
        });
        for (const propertyBinding of propertyBindings) {
            this.updateInstructionWithAdvance(elementIndex, propertyBinding.span, Identifiers.property, propertyBinding.paramsOrFn);
        }
        for (const attributeBinding of attributeBindings) {
            this.updateInstructionWithAdvance(elementIndex, attributeBinding.span, Identifiers.attribute, attributeBinding.paramsOrFn);
        }
        // Traverse element child nodes
        visitAll$1(this, element.children);
        if (!isI18nRootElement && this.i18n) {
            this.i18n.appendElement(element.i18n, elementIndex, true);
        }
        if (!createSelfClosingInstruction) {
            // Finish element construction mode.
            const span = element.endSourceSpan ?? element.sourceSpan;
            if (isI18nRootElement) {
                this.i18nEnd(span, createSelfClosingI18nInstruction);
            }
            if (isNonBindableMode) {
                this.creationInstruction(span, Identifiers.enableBindings);
            }
            this.creationInstruction(span, isNgContainer$1 ? Identifiers.elementContainerEnd : Identifiers.elementEnd);
        }
    }
    visitTemplate(template) {
        const NG_TEMPLATE_TAG_NAME = 'ng-template';
        const templateIndex = this.allocateDataSlot();
        if (this.i18n) {
            this.i18n.appendTemplate(template.i18n, templateIndex);
        }
        const tagNameWithoutNamespace = template.tagName ? splitNsName(template.tagName)[1] : template.tagName;
        const contextName = `${this.contextName}${template.tagName ? '_' + sanitizeIdentifier(template.tagName) : ''}_${templateIndex}`;
        const templateName = `${contextName}_Template`;
        const parameters = [
            literal(templateIndex),
            variable(templateName),
            // We don't care about the tag's namespace here, because we infer
            // it based on the parent nodes inside the template instruction.
            literal(tagNameWithoutNamespace),
        ];
        // prepare attributes parameter (including attributes used for directive matching)
        const attrsExprs = this.getAttributeExpressions(NG_TEMPLATE_TAG_NAME, template.attributes, template.inputs, template.outputs, undefined /* styles */, template.templateAttrs);
        parameters.push(this.addAttrsToConsts(attrsExprs));
        // local refs (ex.: <ng-template #foo>)
        if (template.references && template.references.length) {
            const refs = this.prepareRefsArray(template.references);
            parameters.push(this.addToConsts(refs));
            parameters.push(importExpr(Identifiers.templateRefExtractor));
        }
        // Create the template function
        const templateVisitor = new TemplateDefinitionBuilder(this.constantPool, this._bindingScope, this.level + 1, contextName, this.i18n, templateIndex, templateName, this._namespace, this.fileBasedI18nSuffix, this.i18nUseExternalIds, this._constants);
        // Nested templates must not be visited until after their parent templates have completed
        // processing, so they are queued here until after the initial pass. Otherwise, we wouldn't
        // be able to support bindings in nested templates to local refs that occur after the
        // template definition. e.g. <div *ngIf="showing">{{ foo }}</div>  <div #foo></div>
        this._nestedTemplateFns.push(() => {
            const templateFunctionExpr = templateVisitor.buildTemplateFunction(template.children, template.variables, this._ngContentReservedSlots.length + this._ngContentSelectorsOffset, template.i18n);
            this.constantPool.statements.push(templateFunctionExpr.toDeclStmt(templateName));
            if (templateVisitor._ngContentReservedSlots.length) {
                this._ngContentReservedSlots.push(...templateVisitor._ngContentReservedSlots);
            }
        });
        // e.g. template(1, MyComp_Template_1)
        this.creationInstruction(template.sourceSpan, Identifiers.templateCreate, () => {
            parameters.splice(2, 0, literal(templateVisitor.getConstCount()), literal(templateVisitor.getVarCount()));
            return trimTrailingNulls(parameters);
        });
        // handle property bindings e.g. ɵɵproperty('ngForOf', ctx.items), et al;
        this.templatePropertyBindings(templateIndex, template.templateAttrs);
        // Only add normal input/output binding instructions on explicit <ng-template> elements.
        if (tagNameWithoutNamespace === NG_TEMPLATE_TAG_NAME) {
            const [i18nInputs, inputs] = partitionArray(template.inputs, hasI18nMeta);
            // Add i18n attributes that may act as inputs to directives. If such attributes are present,
            // generate `i18nAttributes` instruction. Note: we generate it only for explicit <ng-template>
            // elements, in case of inline templates, corresponding instructions will be generated in the
            // nested template function.
            if (i18nInputs.length > 0) {
                this.i18nAttributesInstruction(templateIndex, i18nInputs, template.startSourceSpan ?? template.sourceSpan);
            }
            // Add the input bindings
            if (inputs.length > 0) {
                this.templatePropertyBindings(templateIndex, inputs);
            }
            // Generate listeners for directive output
            for (const outputAst of template.outputs) {
                this.creationInstruction(outputAst.sourceSpan, Identifiers.listener, this.prepareListenerParameter('ng_template', outputAst, templateIndex));
            }
        }
    }
    visitBoundText(text) {
        if (this.i18n) {
            const value = text.value.visit(this._valueConverter);
            this.allocateBindingSlots(value);
            if (value instanceof Interpolation) {
                this.i18n.appendBoundText(text.i18n);
                this.i18nAppendBindings(value.expressions);
            }
            return;
        }
        const nodeIndex = this.allocateDataSlot();
        this.creationInstruction(text.sourceSpan, Identifiers.text, [literal(nodeIndex)]);
        const value = text.value.visit(this._valueConverter);
        this.allocateBindingSlots(value);
        if (value instanceof Interpolation) {
            this.updateInstructionWithAdvance(nodeIndex, text.sourceSpan, getTextInterpolationExpression(value), () => this.getUpdateInstructionArguments(value));
        }
        else {
            error('Text nodes should be interpolated and never bound directly.');
        }
    }
    visitText(text) {
        // when a text element is located within a translatable
        // block, we exclude this text element from instructions set,
        // since it will be captured in i18n content and processed at runtime
        if (!this.i18n) {
            this.creationInstruction(text.sourceSpan, Identifiers.text, [literal(this.allocateDataSlot()), literal(text.value)]);
        }
    }
    visitIcu(icu) {
        let initWasInvoked = false;
        // if an ICU was created outside of i18n block, we still treat
        // it as a translatable entity and invoke i18nStart and i18nEnd
        // to generate i18n context and the necessary instructions
        if (!this.i18n) {
            initWasInvoked = true;
            this.i18nStart(null, icu.i18n, true);
        }
        const i18n = this.i18n;
        const vars = this.i18nBindProps(icu.vars);
        const placeholders = this.i18nBindProps(icu.placeholders);
        // output ICU directly and keep ICU reference in context
        const message = icu.i18n;
        // we always need post-processing function for ICUs, to make sure that:
        // - all placeholders in a form of {PLACEHOLDER} are replaced with actual values (note:
        // `goog.getMsg` does not process ICUs and uses the `{PLACEHOLDER}` format for placeholders
        // inside ICUs)
        // - all ICU vars (such as `VAR_SELECT` or `VAR_PLURAL`) are replaced with correct values
        const transformFn = (raw) => {
            const params = { ...vars, ...placeholders };
            const formatted = i18nFormatPlaceholderNames(params, /* useCamelCase */ false);
            return invokeInstruction(null, Identifiers.i18nPostprocess, [raw, mapLiteral(formatted, true)]);
        };
        // in case the whole i18n message is a single ICU - we do not need to
        // create a separate top-level translation, we can use the root ref instead
        // and make this ICU a top-level translation
        // note: ICU placeholders are replaced with actual values in `i18nPostprocess` function
        // separately, so we do not pass placeholders into `i18nTranslate` function.
        if (isSingleI18nIcu(i18n.meta)) {
            this.i18nTranslate(message, /* placeholders */ {}, i18n.ref, transformFn);
        }
        else {
            // output ICU directly and keep ICU reference in context
            const ref = this.i18nTranslate(message, /* placeholders */ {}, /* ref */ undefined, transformFn);
            i18n.appendIcu(icuFromI18nMessage(message).name, ref);
        }
        if (initWasInvoked) {
            this.i18nEnd(null, true);
        }
        return null;
    }
    allocateDataSlot() {
        return this._dataIndex++;
    }
    getConstCount() {
        return this._dataIndex;
    }
    getVarCount() {
        return this._pureFunctionSlots;
    }
    getConsts() {
        return this._constants;
    }
    getNgContentSelectors() {
        return this._ngContentReservedSlots.length ?
            this.constantPool.getConstLiteral(asLiteral(this._ngContentReservedSlots), true) :
            null;
    }
    bindingContext() {
        return `${this._bindingContext++}`;
    }
    templatePropertyBindings(templateIndex, attrs) {
        const propertyBindings = [];
        for (const input of attrs) {
            if (!(input instanceof BoundAttribute)) {
                continue;
            }
            const value = input.value.visit(this._valueConverter);
            if (value === undefined) {
                continue;
            }
            this.allocateBindingSlots(value);
            if (value instanceof Interpolation) {
                // Params typically contain attribute namespace and value sanitizer, which is applicable
                // for regular HTML elements, but not applicable for <ng-template> (since props act as
                // inputs to directives), so keep params array empty.
                const params = [];
                // prop="{{value}}" case
                this.interpolatedUpdateInstruction(getPropertyInterpolationExpression(value), templateIndex, input.name, input, value, params);
            }
            else {
                // [prop]="value" case
                propertyBindings.push({
                    span: input.sourceSpan,
                    paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(value), input.name)
                });
            }
        }
        for (const propertyBinding of propertyBindings) {
            this.updateInstructionWithAdvance(templateIndex, propertyBinding.span, Identifiers.property, propertyBinding.paramsOrFn);
        }
    }
    // Bindings must only be resolved after all local refs have been visited, so all
    // instructions are queued in callbacks that execute once the initial pass has completed.
    // Otherwise, we wouldn't be able to support local refs that are defined after their
    // bindings. e.g. {{ foo }} <div #foo></div>
    instructionFn(fns, span, reference, paramsOrFn, prepend = false) {
        fns[prepend ? 'unshift' : 'push']({ span, reference, paramsOrFn });
    }
    processStylingUpdateInstruction(elementIndex, instruction) {
        let allocateBindingSlots = 0;
        if (instruction) {
            for (const call of instruction.calls) {
                allocateBindingSlots += call.allocateBindingSlots;
                this.updateInstructionWithAdvance(elementIndex, call.sourceSpan, instruction.reference, () => call.params(value => (call.supportsInterpolation && value instanceof Interpolation) ?
                    this.getUpdateInstructionArguments(value) :
                    this.convertPropertyBinding(value)));
            }
        }
        return allocateBindingSlots;
    }
    creationInstruction(span, reference, paramsOrFn, prepend) {
        this.instructionFn(this._creationCodeFns, span, reference, paramsOrFn || [], prepend);
    }
    updateInstructionWithAdvance(nodeIndex, span, reference, paramsOrFn) {
        this.addAdvanceInstructionIfNecessary(nodeIndex, span);
        this.updateInstruction(span, reference, paramsOrFn);
    }
    updateInstruction(span, reference, paramsOrFn) {
        this.instructionFn(this._updateCodeFns, span, reference, paramsOrFn || []);
    }
    addAdvanceInstructionIfNecessary(nodeIndex, span) {
        if (nodeIndex !== this._currentIndex) {
            const delta = nodeIndex - this._currentIndex;
            if (delta < 1) {
                throw new Error('advance instruction can only go forwards');
            }
            this.instructionFn(this._updateCodeFns, span, Identifiers.advance, [literal(delta)]);
            this._currentIndex = nodeIndex;
        }
    }
    allocatePureFunctionSlots(numSlots) {
        const originalSlots = this._pureFunctionSlots;
        this._pureFunctionSlots += numSlots;
        return originalSlots;
    }
    allocateBindingSlots(value) {
        this._bindingSlots += value instanceof Interpolation ? value.expressions.length : 1;
    }
    /**
     * Gets an expression that refers to the implicit receiver. The implicit
     * receiver is always the root level context.
     */
    getImplicitReceiverExpr() {
        if (this._implicitReceiverExpr) {
            return this._implicitReceiverExpr;
        }
        return this._implicitReceiverExpr = this.level === 0 ?
            variable(CONTEXT_NAME) :
            this._bindingScope.getOrCreateSharedContextVar(0);
    }
    convertPropertyBinding(value) {
        const convertedPropertyBinding = convertPropertyBinding(this, this.getImplicitReceiverExpr(), value, this.bindingContext());
        const valExpr = convertedPropertyBinding.currValExpr;
        this._tempVariables.push(...convertedPropertyBinding.stmts);
        return valExpr;
    }
    /**
     * Gets a list of argument expressions to pass to an update instruction expression. Also updates
     * the temp variables state with temp variables that were identified as needing to be created
     * while visiting the arguments.
     * @param value The original expression we will be resolving an arguments list from.
     */
    getUpdateInstructionArguments(value) {
        const { args, stmts } = convertUpdateArguments(this, this.getImplicitReceiverExpr(), value, this.bindingContext());
        this._tempVariables.push(...stmts);
        return args;
    }
    /**
     * Prepares all attribute expression values for the `TAttributes` array.
     *
     * The purpose of this function is to properly construct an attributes array that
     * is passed into the `elementStart` (or just `element`) functions. Because there
     * are many different types of attributes, the array needs to be constructed in a
     * special way so that `elementStart` can properly evaluate them.
     *
     * The format looks like this:
     *
     * ```
     * attrs = [prop, value, prop2, value2,
     *   PROJECT_AS, selector,
     *   CLASSES, class1, class2,
     *   STYLES, style1, value1, style2, value2,
     *   BINDINGS, name1, name2, name3,
     *   TEMPLATE, name4, name5, name6,
     *   I18N, name7, name8, ...]
     * ```
     *
     * Note that this function will fully ignore all synthetic (@foo) attribute values
     * because those values are intended to always be generated as property instructions.
     */
    getAttributeExpressions(elementName, renderAttributes, inputs, outputs, styles, templateAttrs = [], boundI18nAttrs = []) {
        const alreadySeen = new Set();
        const attrExprs = [];
        let ngProjectAsAttr;
        for (const attr of renderAttributes) {
            if (attr.name === NG_PROJECT_AS_ATTR_NAME) {
                ngProjectAsAttr = attr;
            }
            // Note that static i18n attributes aren't in the i18n array,
            // because they're treated in the same way as regular attributes.
            if (attr.i18n) {
                // When i18n attributes are present on elements with structural directives
                // (e.g. `<div *ngIf title="Hello" i18n-title>`), we want to avoid generating
                // duplicate i18n translation blocks for `ɵɵtemplate` and `ɵɵelement` instruction
                // attributes. So we do a cache lookup to see if suitable i18n translation block
                // already exists.
                const { i18nVarRefsCache } = this._constants;
                let i18nVarRef;
                if (i18nVarRefsCache.has(attr.i18n)) {
                    i18nVarRef = i18nVarRefsCache.get(attr.i18n);
                }
                else {
                    i18nVarRef = this.i18nTranslate(attr.i18n);
                    i18nVarRefsCache.set(attr.i18n, i18nVarRef);
                }
                attrExprs.push(literal(attr.name), i18nVarRef);
            }
            else {
                attrExprs.push(...getAttributeNameLiterals(attr.name), trustedConstAttribute(elementName, attr));
            }
        }
        // Keep ngProjectAs next to the other name, value pairs so we can verify that we match
        // ngProjectAs marker in the attribute name slot.
        if (ngProjectAsAttr) {
            attrExprs.push(...getNgProjectAsLiteral(ngProjectAsAttr));
        }
        function addAttrExpr(key, value) {
            if (typeof key === 'string') {
                if (!alreadySeen.has(key)) {
                    attrExprs.push(...getAttributeNameLiterals(key));
                    value !== undefined && attrExprs.push(value);
                    alreadySeen.add(key);
                }
            }
            else {
                attrExprs.push(literal(key));
            }
        }
        // it's important that this occurs before BINDINGS and TEMPLATE because once `elementStart`
        // comes across the BINDINGS or TEMPLATE markers then it will continue reading each value as
        // as single property value cell by cell.
        if (styles) {
            styles.populateInitialStylingAttrs(attrExprs);
        }
        if (inputs.length || outputs.length) {
            const attrsLengthBeforeInputs = attrExprs.length;
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                // We don't want the animation and attribute bindings in the
                // attributes array since they aren't used for directive matching.
                if (input.type !== 4 /* Animation */ && input.type !== 1 /* Attribute */) {
                    addAttrExpr(input.name);
                }
            }
            for (let i = 0; i < outputs.length; i++) {
                const output = outputs[i];
                if (output.type !== 1 /* Animation */) {
                    addAttrExpr(output.name);
                }
            }
            // this is a cheap way of adding the marker only after all the input/output
            // values have been filtered (by not including the animation ones) and added
            // to the expressions. The marker is important because it tells the runtime
            // code that this is where attributes without values start...
            if (attrExprs.length !== attrsLengthBeforeInputs) {
                attrExprs.splice(attrsLengthBeforeInputs, 0, literal(3 /* Bindings */));
            }
        }
        if (templateAttrs.length) {
            attrExprs.push(literal(4 /* Template */));
            templateAttrs.forEach(attr => addAttrExpr(attr.name));
        }
        if (boundI18nAttrs.length) {
            attrExprs.push(literal(6 /* I18n */));
            boundI18nAttrs.forEach(attr => addAttrExpr(attr.name));
        }
        return attrExprs;
    }
    addToConsts(expression) {
        if (isNull(expression)) {
            return TYPED_NULL_EXPR;
        }
        const consts = this._constants.constExpressions;
        // Try to reuse a literal that's already in the array, if possible.
        for (let i = 0; i < consts.length; i++) {
            if (consts[i].isEquivalent(expression)) {
                return literal(i);
            }
        }
        return literal(consts.push(expression) - 1);
    }
    addAttrsToConsts(attrs) {
        return attrs.length > 0 ? this.addToConsts(literalArr(attrs)) : TYPED_NULL_EXPR;
    }
    prepareRefsArray(references) {
        if (!references || references.length === 0) {
            return TYPED_NULL_EXPR;
        }
        const refsParam = flatten(references.map(reference => {
            const slot = this.allocateDataSlot();
            // Generate the update temporary.
            const variableName = this._bindingScope.freshReferenceName();
            const retrievalLevel = this.level;
            const lhs = variable(variableName);
            this._bindingScope.set(retrievalLevel, reference.name, lhs, 0 /* DEFAULT */, (scope, relativeLevel) => {
                // e.g. nextContext(2);
                const nextContextStmt = relativeLevel > 0 ? [generateNextContextExpr(relativeLevel).toStmt()] : [];
                // e.g. const $foo$ = reference(1);
                const refExpr = lhs.set(importExpr(Identifiers.reference).callFn([literal(slot)]));
                return nextContextStmt.concat(refExpr.toConstDecl());
            }, true);
            return [reference.name, reference.value];
        }));
        return asLiteral(refsParam);
    }
    prepareListenerParameter(tagName, outputAst, index) {
        return () => {
            const eventName = outputAst.name;
            const bindingFnName = outputAst.type === 1 /* Animation */ ?
                // synthetic @listener.foo values are treated the exact same as are standard listeners
                prepareSyntheticListenerFunctionName(eventName, outputAst.phase) :
                sanitizeIdentifier(eventName);
            const handlerName = `${this.templateName}_${tagName}_${bindingFnName}_${index}_listener`;
            const scope = this._bindingScope.nestedScope(this._bindingScope.bindingLevel, EVENT_BINDING_SCOPE_GLOBALS);
            return prepareEventListenerParameters(outputAst, handlerName, scope);
        };
    }
}
class ValueConverter extends AstMemoryEfficientTransformer {
    constructor(constantPool, allocateSlot, allocatePureFunctionSlots, definePipe) {
        super();
        this.constantPool = constantPool;
        this.allocateSlot = allocateSlot;
        this.allocatePureFunctionSlots = allocatePureFunctionSlots;
        this.definePipe = definePipe;
        this._pipeBindExprs = [];
    }
    // AstMemoryEfficientTransformer
    visitPipe(pipe, context) {
        // Allocate a slot to create the pipe
        const slot = this.allocateSlot();
        const slotPseudoLocal = `PIPE:${slot}`;
        // Allocate one slot for the result plus one slot per pipe argument
        const pureFunctionSlot = this.allocatePureFunctionSlots(2 + pipe.args.length);
        const target = new PropertyRead(pipe.span, pipe.sourceSpan, pipe.nameSpan, new ImplicitReceiver(pipe.span, pipe.sourceSpan), slotPseudoLocal);
        const { identifier, isVarLength } = pipeBindingCallInfo(pipe.args);
        this.definePipe(pipe.name, slotPseudoLocal, slot, importExpr(identifier));
        const args = [pipe.exp, ...pipe.args];
        const convertedArgs = isVarLength ?
            this.visitAll([new LiteralArray(pipe.span, pipe.sourceSpan, args)]) :
            this.visitAll(args);
        const pipeBindExpr = new Call(pipe.span, pipe.sourceSpan, target, [
            new LiteralPrimitive(pipe.span, pipe.sourceSpan, slot),
            new LiteralPrimitive(pipe.span, pipe.sourceSpan, pureFunctionSlot),
            ...convertedArgs,
        ], null);
        this._pipeBindExprs.push(pipeBindExpr);
        return pipeBindExpr;
    }
    updatePipeSlotOffsets(bindingSlots) {
        this._pipeBindExprs.forEach((pipe) => {
            // update the slot offset arg (index 1) to account for binding slots
            const slotOffset = pipe.args[1];
            slotOffset.value += bindingSlots;
        });
    }
    visitLiteralArray(array, context) {
        return new BuiltinFunctionCall(array.span, array.sourceSpan, this.visitAll(array.expressions), values => {
            // If the literal has calculated (non-literal) elements transform it into
            // calls to literal factories that compose the literal and will cache intermediate
            // values.
            const literal = literalArr(values);
            return getLiteralFactory(this.constantPool, literal, this.allocatePureFunctionSlots);
        });
    }
    visitLiteralMap(map, context) {
        return new BuiltinFunctionCall(map.span, map.sourceSpan, this.visitAll(map.values), values => {
            // If the literal has calculated (non-literal) elements  transform it into
            // calls to literal factories that compose the literal and will cache intermediate
            // values.
            const literal = literalMap(values.map((value, index) => ({ key: map.keys[index].key, value, quoted: map.keys[index].quoted })));
            return getLiteralFactory(this.constantPool, literal, this.allocatePureFunctionSlots);
        });
    }
}
// Pipes always have at least one parameter, the value they operate on
const pipeBindingIdentifiers = [Identifiers.pipeBind1, Identifiers.pipeBind2, Identifiers.pipeBind3, Identifiers.pipeBind4];
function pipeBindingCallInfo(args) {
    const identifier = pipeBindingIdentifiers[args.length];
    return {
        identifier: identifier || Identifiers.pipeBindV,
        isVarLength: !identifier,
    };
}
const pureFunctionIdentifiers = [
    Identifiers.pureFunction0, Identifiers.pureFunction1, Identifiers.pureFunction2, Identifiers.pureFunction3, Identifiers.pureFunction4,
    Identifiers.pureFunction5, Identifiers.pureFunction6, Identifiers.pureFunction7, Identifiers.pureFunction8
];
function pureFunctionCallInfo(args) {
    const identifier = pureFunctionIdentifiers[args.length];
    return {
        identifier: identifier || Identifiers.pureFunctionV,
        isVarLength: !identifier,
    };
}
// e.g. x(2);
function generateNextContextExpr(relativeLevelDiff) {
    return importExpr(Identifiers.nextContext)
        .callFn(relativeLevelDiff > 1 ? [literal(relativeLevelDiff)] : []);
}
function getLiteralFactory(constantPool, literal$1, allocateSlots) {
    const { literalFactory, literalFactoryArguments } = constantPool.getLiteralFactory(literal$1);
    // Allocate 1 slot for the result plus 1 per argument
    const startSlot = allocateSlots(1 + literalFactoryArguments.length);
    const { identifier, isVarLength } = pureFunctionCallInfo(literalFactoryArguments);
    // Literal factories are pure functions that only need to be re-invoked when the parameters
    // change.
    const args = [literal(startSlot), literalFactory];
    if (isVarLength) {
        args.push(literalArr(literalFactoryArguments));
    }
    else {
        args.push(...literalFactoryArguments);
    }
    return importExpr(identifier).callFn(args);
}
/**
 * Gets an array of literals that can be added to an expression
 * to represent the name and namespace of an attribute. E.g.
 * `:xlink:href` turns into `[AttributeMarker.NamespaceURI, 'xlink', 'href']`.
 *
 * @param name Name of the attribute, including the namespace.
 */
function getAttributeNameLiterals(name) {
    const [attributeNamespace, attributeName] = splitNsName(name);
    const nameLiteral = literal(attributeName);
    if (attributeNamespace) {
        return [
            literal(0 /* NamespaceURI */), literal(attributeNamespace), nameLiteral
        ];
    }
    return [nameLiteral];
}
/** The prefix used to get a shared context in BindingScope's map. */
const SHARED_CONTEXT_KEY = '$$shared_ctx$$';
class BindingScope {
    constructor(bindingLevel = 0, parent = null, globals) {
        this.bindingLevel = bindingLevel;
        this.parent = parent;
        this.globals = globals;
        /** Keeps a map from local variables to their BindingData. */
        this.map = new Map();
        this.referenceNameIndex = 0;
        this.restoreViewVariable = null;
        this.usesRestoredViewContext = false;
        if (globals !== undefined) {
            for (const name of globals) {
                this.set(0, name, variable(name));
            }
        }
    }
    static createRootScope() {
        return new BindingScope();
    }
    get(name) {
        let current = this;
        while (current) {
            let value = current.map.get(name);
            if (value != null) {
                if (current !== this) {
                    // make a local copy and reset the `declare` state
                    value = {
                        retrievalLevel: value.retrievalLevel,
                        lhs: value.lhs,
                        declareLocalCallback: value.declareLocalCallback,
                        declare: false,
                        priority: value.priority
                    };
                    // Cache the value locally.
                    this.map.set(name, value);
                    // Possibly generate a shared context var
                    this.maybeGenerateSharedContextVar(value);
                    this.maybeRestoreView();
                }
                if (value.declareLocalCallback && !value.declare) {
                    value.declare = true;
                }
                return value.lhs;
            }
            current = current.parent;
        }
        // If we get to this point, we are looking for a property on the top level component
        // - If level === 0, we are on the top and don't need to re-declare `ctx`.
        // - If level > 0, we are in an embedded view. We need to retrieve the name of the
        // local var we used to store the component context, e.g. const $comp$ = x();
        return this.bindingLevel === 0 ? null : this.getComponentProperty(name);
    }
    /**
     * Create a local variable for later reference.
     *
     * @param retrievalLevel The level from which this value can be retrieved
     * @param name Name of the variable.
     * @param lhs AST representing the left hand side of the `let lhs = rhs;`.
     * @param priority The sorting priority of this var
     * @param declareLocalCallback The callback to invoke when declaring this local var
     * @param localRef Whether or not this is a local ref
     */
    set(retrievalLevel, name, lhs, priority = 0 /* DEFAULT */, declareLocalCallback, localRef) {
        if (this.map.has(name)) {
            if (localRef) {
                // Do not throw an error if it's a local ref and do not update existing value,
                // so the first defined ref is always returned.
                return this;
            }
            error(`The name ${name} is already defined in scope to be ${this.map.get(name)}`);
        }
        this.map.set(name, {
            retrievalLevel: retrievalLevel,
            lhs: lhs,
            declare: false,
            declareLocalCallback: declareLocalCallback,
            priority: priority,
        });
        return this;
    }
    // Implemented as part of LocalResolver.
    getLocal(name) {
        return this.get(name);
    }
    // Implemented as part of LocalResolver.
    notifyImplicitReceiverUse() {
        if (this.bindingLevel !== 0) {
            // Since the implicit receiver is accessed in an embedded view, we need to
            // ensure that we declare a shared context variable for the current template
            // in the update variables.
            this.map.get(SHARED_CONTEXT_KEY + 0).declare = true;
        }
    }
    nestedScope(level, globals) {
        const newScope = new BindingScope(level, this, globals);
        if (level > 0)
            newScope.generateSharedContextVar(0);
        return newScope;
    }
    /**
     * Gets or creates a shared context variable and returns its expression. Note that
     * this does not mean that the shared variable will be declared. Variables in the
     * binding scope will be only declared if they are used.
     */
    getOrCreateSharedContextVar(retrievalLevel) {
        const bindingKey = SHARED_CONTEXT_KEY + retrievalLevel;
        if (!this.map.has(bindingKey)) {
            this.generateSharedContextVar(retrievalLevel);
        }
        // Shared context variables are always generated as "ReadVarExpr".
        return this.map.get(bindingKey).lhs;
    }
    getSharedContextName(retrievalLevel) {
        const sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + retrievalLevel);
        // Shared context variables are always generated as "ReadVarExpr".
        return sharedCtxObj && sharedCtxObj.declare ? sharedCtxObj.lhs : null;
    }
    maybeGenerateSharedContextVar(value) {
        if (value.priority === 1 /* CONTEXT */ &&
            value.retrievalLevel < this.bindingLevel) {
            const sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + value.retrievalLevel);
            if (sharedCtxObj) {
                sharedCtxObj.declare = true;
            }
            else {
                this.generateSharedContextVar(value.retrievalLevel);
            }
        }
    }
    generateSharedContextVar(retrievalLevel) {
        const lhs = variable(CONTEXT_NAME + this.freshReferenceName());
        this.map.set(SHARED_CONTEXT_KEY + retrievalLevel, {
            retrievalLevel: retrievalLevel,
            lhs: lhs,
            declareLocalCallback: (scope, relativeLevel) => {
                // const ctx_r0 = nextContext(2);
                return [lhs.set(generateNextContextExpr(relativeLevel)).toConstDecl()];
            },
            declare: false,
            priority: 2 /* SHARED_CONTEXT */,
        });
    }
    getComponentProperty(name) {
        const componentValue = this.map.get(SHARED_CONTEXT_KEY + 0);
        componentValue.declare = true;
        this.maybeRestoreView();
        return componentValue.lhs.prop(name);
    }
    maybeRestoreView() {
        // View restoration is required for listener instructions inside embedded views, because
        // they only run in creation mode and they can have references to the context object.
        // If the context object changes in update mode, the reference will be incorrect, because
        // it was established during creation.
        if (this.isListenerScope()) {
            if (!this.parent.restoreViewVariable) {
                // parent saves variable to generate a shared `const $s$ = getCurrentView();` instruction
                this.parent.restoreViewVariable = variable(this.parent.freshReferenceName());
            }
            this.restoreViewVariable = this.parent.restoreViewVariable;
        }
    }
    restoreViewStatement() {
        const statements = [];
        if (this.restoreViewVariable) {
            const restoreCall = invokeInstruction(null, Identifiers.restoreView, [this.restoreViewVariable]);
            // Either `const restoredCtx = restoreView($state$);` or `restoreView($state$);`
            // depending on whether it is being used.
            statements.push(this.usesRestoredViewContext ?
                variable(RESTORED_VIEW_CONTEXT_NAME).set(restoreCall).toConstDecl() :
                restoreCall.toStmt());
        }
        return statements;
    }
    viewSnapshotStatements() {
        // const $state$ = getCurrentView();
        return this.restoreViewVariable ?
            [
                this.restoreViewVariable.set(invokeInstruction(null, Identifiers.getCurrentView, [])).toConstDecl()
            ] :
            [];
    }
    isListenerScope() {
        return this.parent && this.parent.bindingLevel === this.bindingLevel;
    }
    variableDeclarations() {
        let currentContextLevel = 0;
        return Array.from(this.map.values())
            .filter(value => value.declare)
            .sort((a, b) => b.retrievalLevel - a.retrievalLevel || b.priority - a.priority)
            .reduce((stmts, value) => {
            const levelDiff = this.bindingLevel - value.retrievalLevel;
            const currStmts = value.declareLocalCallback(this, levelDiff - currentContextLevel);
            currentContextLevel = levelDiff;
            return stmts.concat(currStmts);
        }, []);
    }
    freshReferenceName() {
        let current = this;
        // Find the top scope as it maintains the global reference count
        while (current.parent)
            current = current.parent;
        const ref = `${REFERENCE_PREFIX}${current.referenceNameIndex++}`;
        return ref;
    }
    hasRestoreViewVariable() {
        return !!this.restoreViewVariable;
    }
    notifyRestoredViewContextUse() {
        this.usesRestoredViewContext = true;
    }
}
/**
 * Creates a `CssSelector` given a tag name and a map of attributes
 */
function createCssSelector(elementName, attributes) {
    const cssSelector = new CssSelector();
    const elementNameNoNs = splitNsName(elementName)[1];
    cssSelector.setElement(elementNameNoNs);
    Object.getOwnPropertyNames(attributes).forEach((name) => {
        const nameNoNs = splitNsName(name)[1];
        const value = attributes[name];
        cssSelector.addAttribute(nameNoNs, value);
        if (name.toLowerCase() === 'class') {
            const classes = value.trim().split(/\s+/);
            classes.forEach(className => cssSelector.addClassName(className));
        }
    });
    return cssSelector;
}
/**
 * Creates an array of expressions out of an `ngProjectAs` attributes
 * which can be added to the instruction parameters.
 */
function getNgProjectAsLiteral(attribute) {
    // Parse the attribute value into a CssSelectorList. Note that we only take the
    // first selector, because we don't support multiple selectors in ngProjectAs.
    const parsedR3Selector = parseSelectorToR3Selector(attribute.value)[0];
    return [literal(5 /* ProjectAs */), asLiteral(parsedR3Selector)];
}
/**
 * Gets the instruction to generate for an interpolated property
 * @param interpolation An Interpolation AST
 */
function getPropertyInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 1:
            return Identifiers.propertyInterpolate;
        case 3:
            return Identifiers.propertyInterpolate1;
        case 5:
            return Identifiers.propertyInterpolate2;
        case 7:
            return Identifiers.propertyInterpolate3;
        case 9:
            return Identifiers.propertyInterpolate4;
        case 11:
            return Identifiers.propertyInterpolate5;
        case 13:
            return Identifiers.propertyInterpolate6;
        case 15:
            return Identifiers.propertyInterpolate7;
        case 17:
            return Identifiers.propertyInterpolate8;
        default:
            return Identifiers.propertyInterpolateV;
    }
}
/**
 * Gets the instruction to generate for an interpolated attribute
 * @param interpolation An Interpolation AST
 */
function getAttributeInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 3:
            return Identifiers.attributeInterpolate1;
        case 5:
            return Identifiers.attributeInterpolate2;
        case 7:
            return Identifiers.attributeInterpolate3;
        case 9:
            return Identifiers.attributeInterpolate4;
        case 11:
            return Identifiers.attributeInterpolate5;
        case 13:
            return Identifiers.attributeInterpolate6;
        case 15:
            return Identifiers.attributeInterpolate7;
        case 17:
            return Identifiers.attributeInterpolate8;
        default:
            return Identifiers.attributeInterpolateV;
    }
}
/**
 * Gets the instruction to generate for interpolated text.
 * @param interpolation An Interpolation AST
 */
function getTextInterpolationExpression(interpolation) {
    switch (getInterpolationArgsLength(interpolation)) {
        case 1:
            return Identifiers.textInterpolate;
        case 3:
            return Identifiers.textInterpolate1;
        case 5:
            return Identifiers.textInterpolate2;
        case 7:
            return Identifiers.textInterpolate3;
        case 9:
            return Identifiers.textInterpolate4;
        case 11:
            return Identifiers.textInterpolate5;
        case 13:
            return Identifiers.textInterpolate6;
        case 15:
            return Identifiers.textInterpolate7;
        case 17:
            return Identifiers.textInterpolate8;
        default:
            return Identifiers.textInterpolateV;
    }
}
/**
 * Parse a template into render3 `Node`s and additional metadata, with no other dependencies.
 *
 * @param template text of the template to parse
 * @param templateUrl URL to use for source mapping of the parsed template
 * @param options options to modify how the template is parsed
 */
function parseTemplate(template, templateUrl, options = {}) {
    const { interpolationConfig, preserveWhitespaces, enableI18nLegacyMessageIdFormat } = options;
    const bindingParser = makeBindingParser(interpolationConfig);
    const htmlParser = new HtmlParser();
    const parseResult = htmlParser.parse(template, templateUrl, { leadingTriviaChars: LEADING_TRIVIA_CHARS, ...options, tokenizeExpansionForms: true });
    if (!options.alwaysAttemptHtmlToR3AstConversion && parseResult.errors &&
        parseResult.errors.length > 0) {
        const parsedTemplate = {
            interpolationConfig,
            preserveWhitespaces,
            errors: parseResult.errors,
            nodes: [],
            styleUrls: [],
            styles: [],
            ngContentSelectors: []
        };
        if (options.collectCommentNodes) {
            parsedTemplate.commentNodes = [];
        }
        return parsedTemplate;
    }
    let rootNodes = parseResult.rootNodes;
    // process i18n meta information (scan attributes, generate ids)
    // before we run whitespace removal process, because existing i18n
    // extraction process (ng extract-i18n) relies on a raw content to generate
    // message ids
    const i18nMetaVisitor = new I18nMetaVisitor(interpolationConfig, /* keepI18nAttrs */ !preserveWhitespaces, enableI18nLegacyMessageIdFormat);
    const i18nMetaResult = i18nMetaVisitor.visitAllWithErrors(rootNodes);
    if (!options.alwaysAttemptHtmlToR3AstConversion && i18nMetaResult.errors &&
        i18nMetaResult.errors.length > 0) {
        const parsedTemplate = {
            interpolationConfig,
            preserveWhitespaces,
            errors: i18nMetaResult.errors,
            nodes: [],
            styleUrls: [],
            styles: [],
            ngContentSelectors: []
        };
        if (options.collectCommentNodes) {
            parsedTemplate.commentNodes = [];
        }
        return parsedTemplate;
    }
    rootNodes = i18nMetaResult.rootNodes;
    if (!preserveWhitespaces) {
        rootNodes = visitAll(new WhitespaceVisitor(), rootNodes);
        // run i18n meta visitor again in case whitespaces are removed (because that might affect
        // generated i18n message content) and first pass indicated that i18n content is present in a
        // template. During this pass i18n IDs generated at the first pass will be preserved, so we can
        // mimic existing extraction process (ng extract-i18n)
        if (i18nMetaVisitor.hasI18nMeta) {
            rootNodes = visitAll(new I18nMetaVisitor(interpolationConfig, /* keepI18nAttrs */ false), rootNodes);
        }
    }
    const { nodes, errors, styleUrls, styles, ngContentSelectors, commentNodes } = htmlAstToRender3Ast(rootNodes, bindingParser, { collectCommentNodes: !!options.collectCommentNodes });
    errors.push(...parseResult.errors, ...i18nMetaResult.errors);
    const parsedTemplate = {
        interpolationConfig,
        preserveWhitespaces,
        errors: errors.length > 0 ? errors : null,
        nodes,
        styleUrls,
        styles,
        ngContentSelectors
    };
    if (options.collectCommentNodes) {
        parsedTemplate.commentNodes = commentNodes;
    }
    return parsedTemplate;
}
const elementRegistry = new DomElementSchemaRegistry();
/**
 * Construct a `BindingParser` with a default configuration.
 */
function makeBindingParser(interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    return new BindingParser(new Parser$1(new Lexer()), interpolationConfig, elementRegistry, []);
}
function resolveSanitizationFn(context, isAttribute) {
    switch (context) {
        case SecurityContext.HTML:
            return importExpr(Identifiers.sanitizeHtml);
        case SecurityContext.SCRIPT:
            return importExpr(Identifiers.sanitizeScript);
        case SecurityContext.STYLE:
            // the compiler does not fill in an instruction for [style.prop?] binding
            // values because the style algorithm knows internally what props are subject
            // to sanitization (only [attr.style] values are explicitly sanitized)
            return isAttribute ? importExpr(Identifiers.sanitizeStyle) : null;
        case SecurityContext.URL:
            return importExpr(Identifiers.sanitizeUrl);
        case SecurityContext.RESOURCE_URL:
            return importExpr(Identifiers.sanitizeResourceUrl);
        default:
            return null;
    }
}
function trustedConstAttribute(tagName, attr) {
    const value = asLiteral(attr.value);
    if (isTrustedTypesSink(tagName, attr.name)) {
        switch (elementRegistry.securityContext(tagName, attr.name, /* isAttribute */ true)) {
            case SecurityContext.HTML:
                return taggedTemplate(importExpr(Identifiers.trustConstantHtml), new TemplateLiteral([new TemplateLiteralElement(attr.value)], []), undefined, attr.valueSpan);
            // NB: no SecurityContext.SCRIPT here, as the corresponding tags are stripped by the compiler.
            case SecurityContext.RESOURCE_URL:
                return taggedTemplate(importExpr(Identifiers.trustConstantResourceUrl), new TemplateLiteral([new TemplateLiteralElement(attr.value)], []), undefined, attr.valueSpan);
            default:
                return value;
        }
    }
    else {
        return value;
    }
}
function isSingleElementTemplate(children) {
    return children.length === 1 && children[0] instanceof Element$1;
}
function isTextNode(node) {
    return node instanceof Text$3 || node instanceof BoundText || node instanceof Icu$1;
}
function hasTextChildrenOnly(children) {
    return children.every(isTextNode);
}
function getBindingFunctionParams(deferredParams, name, eagerParams) {
    return () => {
        const value = deferredParams();
        const fnParams = Array.isArray(value) ? value : [value];
        if (eagerParams) {
            fnParams.push(...eagerParams);
        }
        if (name) {
            // We want the property name to always be the first function parameter.
            fnParams.unshift(literal(name));
        }
        return fnParams;
    };
}
/** Name of the global variable that is used to determine if we use Closure translations or not */
const NG_I18N_CLOSURE_MODE = 'ngI18nClosureMode';
/**
 * Generate statements that define a given translation message.
 *
 * ```
 * var I18N_1;
 * if (typeof ngI18nClosureMode !== undefined && ngI18nClosureMode) {
 *     var MSG_EXTERNAL_XXX = goog.getMsg(
 *          "Some message with {$interpolation}!",
 *          { "interpolation": "\uFFFD0\uFFFD" }
 *     );
 *     I18N_1 = MSG_EXTERNAL_XXX;
 * }
 * else {
 *     I18N_1 = $localize`Some message with ${'\uFFFD0\uFFFD'}!`;
 * }
 * ```
 *
 * @param message The original i18n AST message node
 * @param variable The variable that will be assigned the translation, e.g. `I18N_1`.
 * @param closureVar The variable for Closure `goog.getMsg` calls, e.g. `MSG_EXTERNAL_XXX`.
 * @param params Object mapping placeholder names to their values (e.g.
 * `{ "interpolation": "\uFFFD0\uFFFD" }`).
 * @param transformFn Optional transformation function that will be applied to the translation (e.g.
 * post-processing).
 * @returns An array of statements that defined a given translation.
 */
function getTranslationDeclStmts(message, variable, closureVar, params = {}, transformFn) {
    const statements = [
        declareI18nVariable(variable),
        ifStmt(createClosureModeGuard(), createGoogleGetMsgStatements(variable, message, closureVar, i18nFormatPlaceholderNames(params, /* useCamelCase */ true)), createLocalizeStatements(variable, message, i18nFormatPlaceholderNames(params, /* useCamelCase */ false))),
    ];
    if (transformFn) {
        statements.push(new ExpressionStatement(variable.set(transformFn(variable))));
    }
    return statements;
}
/**
 * Create the expression that will be used to guard the closure mode block
 * It is equivalent to:
 *
 * ```
 * typeof ngI18nClosureMode !== undefined && ngI18nClosureMode
 * ```
 */
function createClosureModeGuard() {
    return typeofExpr(variable(NG_I18N_CLOSURE_MODE))
        .notIdentical(literal('undefined', STRING_TYPE))
        .and(variable(NG_I18N_CLOSURE_MODE));
}
function flatten(list) {
    return list.reduce((flat, item) => {
        const flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
    }, []);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This regex matches any binding names that contain the "attr." prefix, e.g. "attr.required"
// If there is a match, the first matching group will contain the attribute name to bind.
const ATTR_REGEX = /attr\.([^\]]+)/;
const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
function baseDirectiveFields(meta, constantPool, bindingParser) {
    const definitionMap = new DefinitionMap();
    const selectors = parseSelectorToR3Selector(meta.selector);
    // e.g. `type: MyDirective`
    definitionMap.set('type', meta.internalType);
    // e.g. `selectors: [['', 'someDir', '']]`
    if (selectors.length > 0) {
        definitionMap.set('selectors', asLiteral(selectors));
    }
    if (meta.queries.length > 0) {
        // e.g. `contentQueries: (rf, ctx, dirIndex) => { ... }
        definitionMap.set('contentQueries', createContentQueriesFunction(meta.queries, constantPool, meta.name));
    }
    if (meta.viewQueries.length) {
        definitionMap.set('viewQuery', createViewQueriesFunction(meta.viewQueries, constantPool, meta.name));
    }
    // e.g. `hostBindings: (rf, ctx) => { ... }
    definitionMap.set('hostBindings', createHostBindingsFunction(meta.host, meta.typeSourceSpan, bindingParser, constantPool, meta.selector || '', meta.name, definitionMap));
    // e.g 'inputs: {a: 'a'}`
    definitionMap.set('inputs', conditionallyCreateMapObjectLiteral(meta.inputs, true));
    // e.g 'outputs: {a: 'a'}`
    definitionMap.set('outputs', conditionallyCreateMapObjectLiteral(meta.outputs));
    if (meta.exportAs !== null) {
        definitionMap.set('exportAs', literalArr(meta.exportAs.map(e => literal(e))));
    }
    return definitionMap;
}
/**
 * Add features to the definition map.
 */
function addFeatures(definitionMap, meta) {
    // e.g. `features: [NgOnChangesFeature]`
    const features = [];
    const providers = meta.providers;
    const viewProviders = meta.viewProviders;
    if (providers || viewProviders) {
        const args = [providers || new LiteralArrayExpr([])];
        if (viewProviders) {
            args.push(viewProviders);
        }
        features.push(importExpr(Identifiers.ProvidersFeature).callFn(args));
    }
    if (meta.usesInheritance) {
        features.push(importExpr(Identifiers.InheritDefinitionFeature));
    }
    if (meta.fullInheritance) {
        features.push(importExpr(Identifiers.CopyDefinitionFeature));
    }
    if (meta.lifecycle.usesOnChanges) {
        features.push(importExpr(Identifiers.NgOnChangesFeature));
    }
    if (features.length) {
        definitionMap.set('features', literalArr(features));
    }
}
/**
 * Compile a directive for the render3 runtime as defined by the `R3DirectiveMetadata`.
 */
function compileDirectiveFromMetadata(meta, constantPool, bindingParser) {
    const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    addFeatures(definitionMap, meta);
    const expression = importExpr(Identifiers.defineDirective).callFn([definitionMap.toLiteralMap()], undefined, true);
    const type = createDirectiveType(meta);
    return { expression, type, statements: [] };
}
/**
 * Compile a component for the render3 runtime as defined by the `R3ComponentMetadata`.
 */
function compileComponentFromMetadata(meta, constantPool, bindingParser) {
    const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    addFeatures(definitionMap, meta);
    const selector = meta.selector && CssSelector.parse(meta.selector);
    const firstSelector = selector && selector[0];
    // e.g. `attr: ["class", ".my.app"]`
    // This is optional an only included if the first selector of a component specifies attributes.
    if (firstSelector) {
        const selectorAttributes = firstSelector.getAttrs();
        if (selectorAttributes.length) {
            definitionMap.set('attrs', constantPool.getConstLiteral(literalArr(selectorAttributes.map(value => value != null ? literal(value) : literal(undefined))), 
            /* forceShared */ true));
        }
    }
    // e.g. `template: function MyComponent_Template(_ctx, _cm) {...}`
    const templateTypeName = meta.name;
    const templateName = templateTypeName ? `${templateTypeName}_Template` : null;
    const changeDetection = meta.changeDetection;
    const template = meta.template;
    const templateBuilder = new TemplateDefinitionBuilder(constantPool, BindingScope.createRootScope(), 0, templateTypeName, null, null, templateName, Identifiers.namespaceHTML, meta.relativeContextFilePath, meta.i18nUseExternalIds);
    const templateFunctionExpression = templateBuilder.buildTemplateFunction(template.nodes, []);
    // We need to provide this so that dynamically generated components know what
    // projected content blocks to pass through to the component when it is instantiated.
    const ngContentSelectors = templateBuilder.getNgContentSelectors();
    if (ngContentSelectors) {
        definitionMap.set('ngContentSelectors', ngContentSelectors);
    }
    // e.g. `decls: 2`
    definitionMap.set('decls', literal(templateBuilder.getConstCount()));
    // e.g. `vars: 2`
    definitionMap.set('vars', literal(templateBuilder.getVarCount()));
    // Generate `consts` section of ComponentDef:
    // - either as an array:
    //   `consts: [['one', 'two'], ['three', 'four']]`
    // - or as a factory function in case additional statements are present (to support i18n):
    //   `consts: function() { var i18n_0; if (ngI18nClosureMode) {...} else {...} return [i18n_0]; }`
    const { constExpressions, prepareStatements } = templateBuilder.getConsts();
    if (constExpressions.length > 0) {
        let constsExpr = literalArr(constExpressions);
        // Prepare statements are present - turn `consts` into a function.
        if (prepareStatements.length > 0) {
            constsExpr = fn([], [...prepareStatements, new ReturnStatement(constsExpr)]);
        }
        definitionMap.set('consts', constsExpr);
    }
    definitionMap.set('template', templateFunctionExpression);
    // e.g. `directives: [MyDirective]`
    if (meta.directives.length > 0) {
        const directivesList = literalArr(meta.directives.map(dir => dir.type));
        const directivesExpr = compileDeclarationList(directivesList, meta.declarationListEmitMode);
        definitionMap.set('directives', directivesExpr);
    }
    // e.g. `pipes: [MyPipe]`
    if (meta.pipes.size > 0) {
        const pipesList = literalArr(Array.from(meta.pipes.values()));
        const pipesExpr = compileDeclarationList(pipesList, meta.declarationListEmitMode);
        definitionMap.set('pipes', pipesExpr);
    }
    if (meta.encapsulation === null) {
        meta.encapsulation = ViewEncapsulation.Emulated;
    }
    // e.g. `styles: [str1, str2]`
    if (meta.styles && meta.styles.length) {
        const styleValues = meta.encapsulation == ViewEncapsulation.Emulated ?
            compileStyles(meta.styles, CONTENT_ATTR, HOST_ATTR) :
            meta.styles;
        const strings = styleValues.map(str => constantPool.getConstLiteral(literal(str)));
        definitionMap.set('styles', literalArr(strings));
    }
    else if (meta.encapsulation === ViewEncapsulation.Emulated) {
        // If there is no style, don't generate css selectors on elements
        meta.encapsulation = ViewEncapsulation.None;
    }
    // Only set view encapsulation if it's not the default value
    if (meta.encapsulation !== ViewEncapsulation.Emulated) {
        definitionMap.set('encapsulation', literal(meta.encapsulation));
    }
    // e.g. `animation: [trigger('123', [])]`
    if (meta.animations !== null) {
        definitionMap.set('data', literalMap([{ key: 'animation', value: meta.animations, quoted: false }]));
    }
    // Only set the change detection flag if it's defined and it's not the default.
    if (changeDetection != null && changeDetection !== ChangeDetectionStrategy.Default) {
        definitionMap.set('changeDetection', literal(changeDetection));
    }
    const expression = importExpr(Identifiers.defineComponent).callFn([definitionMap.toLiteralMap()], undefined, true);
    const type = createComponentType(meta);
    return { expression, type, statements: [] };
}
/**
 * Creates the type specification from the component meta. This type is inserted into .d.ts files
 * to be consumed by upstream compilations.
 */
function createComponentType(meta) {
    const typeParams = createDirectiveTypeParams(meta);
    typeParams.push(stringArrayAsType(meta.template.ngContentSelectors));
    return expressionType(importExpr(Identifiers.ComponentDeclaration, typeParams));
}
/**
 * Compiles the array literal of declarations into an expression according to the provided emit
 * mode.
 */
function compileDeclarationList(list, mode) {
    switch (mode) {
        case 0 /* Direct */:
            // directives: [MyDir],
            return list;
        case 1 /* Closure */:
            // directives: function () { return [MyDir]; }
            return fn([], [new ReturnStatement(list)]);
        case 2 /* ClosureResolved */:
            // directives: function () { return [MyDir].map(ng.resolveForwardRef); }
            const resolvedList = list.prop('map').callFn([importExpr(Identifiers.resolveForwardRef)]);
            return fn([], [new ReturnStatement(resolvedList)]);
    }
}
function prepareQueryParams(query, constantPool) {
    const parameters = [getQueryPredicate(query, constantPool), literal(toQueryFlags(query))];
    if (query.read) {
        parameters.push(query.read);
    }
    return parameters;
}
/**
 * Translates query flags into `TQueryFlags` type in packages/core/src/render3/interfaces/query.ts
 * @param query
 */
function toQueryFlags(query) {
    return (query.descendants ? 1 /* descendants */ : 0 /* none */) |
        (query.static ? 2 /* isStatic */ : 0 /* none */) |
        (query.emitDistinctChangesOnly ? 4 /* emitDistinctChangesOnly */ : 0 /* none */);
}
function convertAttributesToExpressions(attributes) {
    const values = [];
    for (let key of Object.getOwnPropertyNames(attributes)) {
        const value = attributes[key];
        values.push(literal(key), value);
    }
    return values;
}
// Define and update any content queries
function createContentQueriesFunction(queries, constantPool, name) {
    const createStatements = [];
    const updateStatements = [];
    const tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
    for (const query of queries) {
        // creation, e.g. r3.contentQuery(dirIndex, somePredicate, true, null);
        createStatements.push(importExpr(Identifiers.contentQuery)
            .callFn([variable('dirIndex'), ...prepareQueryParams(query, constantPool)])
            .toStmt());
        // update, e.g. (r3.queryRefresh(tmp = r3.loadQuery()) && (ctx.someDir = tmp));
        const temporary = tempAllocator();
        const getQueryList = importExpr(Identifiers.loadQuery).callFn([]);
        const refresh = importExpr(Identifiers.queryRefresh).callFn([temporary.set(getQueryList)]);
        const updateDirective = variable(CONTEXT_NAME)
            .prop(query.propertyName)
            .set(query.first ? temporary.prop('first') : temporary);
        updateStatements.push(refresh.and(updateDirective).toStmt());
    }
    const contentQueriesFnName = name ? `${name}_ContentQueries` : null;
    return fn([
        new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null),
        new FnParam('dirIndex', null)
    ], [
        renderFlagCheckIfStmt(1 /* Create */, createStatements),
        renderFlagCheckIfStmt(2 /* Update */, updateStatements)
    ], INFERRED_TYPE, null, contentQueriesFnName);
}
function stringAsType(str) {
    return expressionType(literal(str));
}
function stringMapAsType(map) {
    const mapValues = Object.keys(map).map(key => {
        const value = Array.isArray(map[key]) ? map[key][0] : map[key];
        return {
            key,
            value: literal(value),
            quoted: true,
        };
    });
    return expressionType(literalMap(mapValues));
}
function stringArrayAsType(arr) {
    return arr.length > 0 ? expressionType(literalArr(arr.map(value => literal(value)))) :
        NONE_TYPE;
}
function createDirectiveTypeParams(meta) {
    // On the type side, remove newlines from the selector as it will need to fit into a TypeScript
    // string literal, which must be on one line.
    const selectorForType = meta.selector !== null ? meta.selector.replace(/\n/g, '') : null;
    return [
        typeWithParameters(meta.type.type, meta.typeArgumentCount),
        selectorForType !== null ? stringAsType(selectorForType) : NONE_TYPE,
        meta.exportAs !== null ? stringArrayAsType(meta.exportAs) : NONE_TYPE,
        stringMapAsType(meta.inputs),
        stringMapAsType(meta.outputs),
        stringArrayAsType(meta.queries.map(q => q.propertyName)),
    ];
}
/**
 * Creates the type specification from the directive meta. This type is inserted into .d.ts files
 * to be consumed by upstream compilations.
 */
function createDirectiveType(meta) {
    const typeParams = createDirectiveTypeParams(meta);
    return expressionType(importExpr(Identifiers.DirectiveDeclaration, typeParams));
}
// Define and update any view queries
function createViewQueriesFunction(viewQueries, constantPool, name) {
    const createStatements = [];
    const updateStatements = [];
    const tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
    viewQueries.forEach((query) => {
        // creation, e.g. r3.viewQuery(somePredicate, true);
        const queryDefinition = importExpr(Identifiers.viewQuery).callFn(prepareQueryParams(query, constantPool));
        createStatements.push(queryDefinition.toStmt());
        // update, e.g. (r3.queryRefresh(tmp = r3.loadQuery()) && (ctx.someDir = tmp));
        const temporary = tempAllocator();
        const getQueryList = importExpr(Identifiers.loadQuery).callFn([]);
        const refresh = importExpr(Identifiers.queryRefresh).callFn([temporary.set(getQueryList)]);
        const updateDirective = variable(CONTEXT_NAME)
            .prop(query.propertyName)
            .set(query.first ? temporary.prop('first') : temporary);
        updateStatements.push(refresh.and(updateDirective).toStmt());
    });
    const viewQueryFnName = name ? `${name}_Query` : null;
    return fn([new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)], [
        renderFlagCheckIfStmt(1 /* Create */, createStatements),
        renderFlagCheckIfStmt(2 /* Update */, updateStatements)
    ], INFERRED_TYPE, null, viewQueryFnName);
}
// Return a host binding function or null if one is not necessary.
function createHostBindingsFunction(hostBindingsMetadata, typeSourceSpan, bindingParser, constantPool, selector, name, definitionMap) {
    const bindingContext = variable(CONTEXT_NAME);
    const styleBuilder = new StylingBuilder(bindingContext);
    const { styleAttr, classAttr } = hostBindingsMetadata.specialAttributes;
    if (styleAttr !== undefined) {
        styleBuilder.registerStyleAttr(styleAttr);
    }
    if (classAttr !== undefined) {
        styleBuilder.registerClassAttr(classAttr);
    }
    const createInstructions = [];
    const updateInstructions = [];
    const updateVariables = [];
    const hostBindingSourceSpan = typeSourceSpan;
    // Calculate host event bindings
    const eventBindings = bindingParser.createDirectiveHostEventAsts(hostBindingsMetadata.listeners, hostBindingSourceSpan);
    if (eventBindings && eventBindings.length) {
        createInstructions.push(...createHostListeners(eventBindings, name));
    }
    // Calculate the host property bindings
    const bindings = bindingParser.createBoundHostProperties(hostBindingsMetadata.properties, hostBindingSourceSpan);
    const allOtherBindings = [];
    // We need to calculate the total amount of binding slots required by
    // all the instructions together before any value conversions happen.
    // Value conversions may require additional slots for interpolation and
    // bindings with pipes. These calculates happen after this block.
    let totalHostVarsCount = 0;
    bindings && bindings.forEach((binding) => {
        const stylingInputWasSet = styleBuilder.registerInputBasedOnName(binding.name, binding.expression, hostBindingSourceSpan);
        if (stylingInputWasSet) {
            totalHostVarsCount += MIN_STYLING_BINDING_SLOTS_REQUIRED;
        }
        else {
            allOtherBindings.push(binding);
            totalHostVarsCount++;
        }
    });
    let valueConverter;
    const getValueConverter = () => {
        if (!valueConverter) {
            const hostVarsCountFn = (numSlots) => {
                const originalVarsCount = totalHostVarsCount;
                totalHostVarsCount += numSlots;
                return originalVarsCount;
            };
            valueConverter = new ValueConverter(constantPool, () => error('Unexpected node'), // new nodes are illegal here
            hostVarsCountFn, () => error('Unexpected pipe')); // pipes are illegal here
        }
        return valueConverter;
    };
    const propertyBindings = [];
    const attributeBindings = [];
    const syntheticHostBindings = [];
    for (const binding of allOtherBindings) {
        // resolve literal arrays and literal objects
        const value = binding.expression.visit(getValueConverter());
        const bindingExpr = bindingFn(bindingContext, value);
        const { bindingName, instruction, isAttribute } = getBindingNameAndInstruction(binding);
        const securityContexts = bindingParser.calcPossibleSecurityContexts(selector, bindingName, isAttribute)
            .filter(context => context !== SecurityContext.NONE);
        let sanitizerFn = null;
        if (securityContexts.length) {
            if (securityContexts.length === 2 &&
                securityContexts.indexOf(SecurityContext.URL) > -1 &&
                securityContexts.indexOf(SecurityContext.RESOURCE_URL) > -1) {
                // Special case for some URL attributes (such as "src" and "href") that may be a part
                // of different security contexts. In this case we use special sanitization function and
                // select the actual sanitizer at runtime based on a tag name that is provided while
                // invoking sanitization function.
                sanitizerFn = importExpr(Identifiers.sanitizeUrlOrResourceUrl);
            }
            else {
                sanitizerFn = resolveSanitizationFn(securityContexts[0], isAttribute);
            }
        }
        const instructionParams = [literal(bindingName), bindingExpr.currValExpr];
        if (sanitizerFn) {
            instructionParams.push(sanitizerFn);
        }
        updateVariables.push(...bindingExpr.stmts);
        if (instruction === Identifiers.hostProperty) {
            propertyBindings.push(instructionParams);
        }
        else if (instruction === Identifiers.attribute) {
            attributeBindings.push(instructionParams);
        }
        else if (instruction === Identifiers.syntheticHostProperty) {
            syntheticHostBindings.push(instructionParams);
        }
        else {
            updateInstructions.push({ reference: instruction, paramsOrFn: instructionParams, span: null });
        }
    }
    for (const bindingParams of propertyBindings) {
        updateInstructions.push({ reference: Identifiers.hostProperty, paramsOrFn: bindingParams, span: null });
    }
    for (const bindingParams of attributeBindings) {
        updateInstructions.push({ reference: Identifiers.attribute, paramsOrFn: bindingParams, span: null });
    }
    for (const bindingParams of syntheticHostBindings) {
        updateInstructions.push({ reference: Identifiers.syntheticHostProperty, paramsOrFn: bindingParams, span: null });
    }
    // since we're dealing with directives/components and both have hostBinding
    // functions, we need to generate a special hostAttrs instruction that deals
    // with both the assignment of styling as well as static attributes to the host
    // element. The instruction below will instruct all initial styling (styling
    // that is inside of a host binding within a directive/component) to be attached
    // to the host element alongside any of the provided host attributes that were
    // collected earlier.
    const hostAttrs = convertAttributesToExpressions(hostBindingsMetadata.attributes);
    styleBuilder.assignHostAttrs(hostAttrs, definitionMap);
    if (styleBuilder.hasBindings) {
        // finally each binding that was registered in the statement above will need to be added to
        // the update block of a component/directive templateFn/hostBindingsFn so that the bindings
        // are evaluated and updated for the element.
        styleBuilder.buildUpdateLevelInstructions(getValueConverter()).forEach(instruction => {
            for (const call of instruction.calls) {
                // we subtract a value of `1` here because the binding slot was already allocated
                // at the top of this method when all the input bindings were counted.
                totalHostVarsCount +=
                    Math.max(call.allocateBindingSlots - MIN_STYLING_BINDING_SLOTS_REQUIRED, 0);
                updateInstructions.push({
                    reference: instruction.reference,
                    paramsOrFn: convertStylingCall(call, bindingContext, bindingFn),
                    span: null
                });
            }
        });
    }
    if (totalHostVarsCount) {
        definitionMap.set('hostVars', literal(totalHostVarsCount));
    }
    if (createInstructions.length > 0 || updateInstructions.length > 0) {
        const hostBindingsFnName = name ? `${name}_HostBindings` : null;
        const statements = [];
        if (createInstructions.length > 0) {
            statements.push(renderFlagCheckIfStmt(1 /* Create */, getInstructionStatements(createInstructions)));
        }
        if (updateInstructions.length > 0) {
            statements.push(renderFlagCheckIfStmt(2 /* Update */, updateVariables.concat(getInstructionStatements(updateInstructions))));
        }
        return fn([new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)], statements, INFERRED_TYPE, null, hostBindingsFnName);
    }
    return null;
}
function bindingFn(implicit, value) {
    return convertPropertyBinding(null, implicit, value, 'b');
}
function convertStylingCall(call, bindingContext, bindingFn) {
    return call.params(value => bindingFn(bindingContext, value).currValExpr);
}
function getBindingNameAndInstruction(binding) {
    let bindingName = binding.name;
    let instruction;
    // Check to see if this is an attr binding or a property binding
    const attrMatches = bindingName.match(ATTR_REGEX);
    if (attrMatches) {
        bindingName = attrMatches[1];
        instruction = Identifiers.attribute;
    }
    else {
        if (binding.isAnimation) {
            bindingName = prepareSyntheticPropertyName(bindingName);
            // host bindings that have a synthetic property (e.g. @foo) should always be rendered
            // in the context of the component and not the parent. Therefore there is a special
            // compatibility instruction available for this purpose.
            instruction = Identifiers.syntheticHostProperty;
        }
        else {
            instruction = Identifiers.hostProperty;
        }
    }
    return { bindingName, instruction, isAttribute: !!attrMatches };
}
function createHostListeners(eventBindings, name) {
    const listenerParams = [];
    const syntheticListenerParams = [];
    const instructions = [];
    for (const binding of eventBindings) {
        let bindingName = binding.name && sanitizeIdentifier(binding.name);
        const bindingFnName = binding.type === 1 /* Animation */ ?
            prepareSyntheticListenerFunctionName(bindingName, binding.targetOrPhase) :
            bindingName;
        const handlerName = name && bindingName ? `${name}_${bindingFnName}_HostBindingHandler` : null;
        const params = prepareEventListenerParameters(BoundEvent.fromParsedEvent(binding), handlerName);
        if (binding.type == 1 /* Animation */) {
            syntheticListenerParams.push(params);
        }
        else {
            listenerParams.push(params);
        }
    }
    for (const params of syntheticListenerParams) {
        instructions.push({ reference: Identifiers.syntheticHostListener, paramsOrFn: params, span: null });
    }
    for (const params of listenerParams) {
        instructions.push({ reference: Identifiers.listener, paramsOrFn: params, span: null });
    }
    return instructions;
}
const HOST_REG_EXP = /^(?:\[([^\]]+)\])|(?:\(([^\)]+)\))$/;
function parseHostBindings(host) {
    const attributes = {};
    const listeners = {};
    const properties = {};
    const specialAttributes = {};
    for (const key of Object.keys(host)) {
        const value = host[key];
        const matches = key.match(HOST_REG_EXP);
        if (matches === null) {
            switch (key) {
                case 'class':
                    if (typeof value !== 'string') {
                        // TODO(alxhub): make this a diagnostic.
                        throw new Error(`Class binding must be string`);
                    }
                    specialAttributes.classAttr = value;
                    break;
                case 'style':
                    if (typeof value !== 'string') {
                        // TODO(alxhub): make this a diagnostic.
                        throw new Error(`Style binding must be string`);
                    }
                    specialAttributes.styleAttr = value;
                    break;
                default:
                    if (typeof value === 'string') {
                        attributes[key] = literal(value);
                    }
                    else {
                        attributes[key] = value;
                    }
            }
        }
        else if (matches[1 /* Binding */] != null) {
            if (typeof value !== 'string') {
                // TODO(alxhub): make this a diagnostic.
                throw new Error(`Property binding must be string`);
            }
            // synthetic properties (the ones that have a `@` as a prefix)
            // are still treated the same as regular properties. Therefore
            // there is no point in storing them in a separate map.
            properties[matches[1 /* Binding */]] = value;
        }
        else if (matches[2 /* Event */] != null) {
            if (typeof value !== 'string') {
                // TODO(alxhub): make this a diagnostic.
                throw new Error(`Event binding must be string`);
            }
            listeners[matches[2 /* Event */]] = value;
        }
    }
    return { attributes, listeners, properties, specialAttributes };
}
/**
 * Verifies host bindings and returns the list of errors (if any). Empty array indicates that a
 * given set of host bindings has no errors.
 *
 * @param bindings set of host bindings to verify.
 * @param sourceSpan source span where host bindings were defined.
 * @returns array of errors associated with a given set of host bindings.
 */
function verifyHostBindings(bindings, sourceSpan) {
    // TODO: abstract out host bindings verification logic and use it instead of
    // creating events and properties ASTs to detect errors (FW-996)
    const bindingParser = makeBindingParser();
    bindingParser.createDirectiveHostEventAsts(bindings.listeners, sourceSpan);
    bindingParser.createBoundHostProperties(bindings.properties, sourceSpan);
    return bindingParser.errors;
}
function compileStyles(styles, selector, hostSelector) {
    const shadowCss = new ShadowCss();
    return styles.map(style => {
        return shadowCss.shimCssText(style, selector, hostSelector);
    });
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An interface for retrieving documents by URL that the compiler uses to
 * load templates.
 *
 * This is an abstract class, rather than an interface, so that it can be used
 * as injection token.
 */
class ResourceLoader {
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class CompilerFacadeImpl {
    constructor(jitEvaluator = new JitEvaluator()) {
        this.jitEvaluator = jitEvaluator;
        this.FactoryTarget = FactoryTarget$1;
        this.ResourceLoader = ResourceLoader;
        this.elementSchemaRegistry = new DomElementSchemaRegistry();
    }
    compilePipe(angularCoreEnv, sourceMapUrl, facade) {
        const metadata = {
            name: facade.name,
            type: wrapReference(facade.type),
            internalType: new WrappedNodeExpr(facade.type),
            typeArgumentCount: 0,
            deps: null,
            pipeName: facade.pipeName,
            pure: facade.pure,
        };
        const res = compilePipeFromMetadata(metadata);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
    }
    compilePipeDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
        const meta = convertDeclarePipeFacadeToMetadata(declaration);
        const res = compilePipeFromMetadata(meta);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
    }
    compileInjectable(angularCoreEnv, sourceMapUrl, facade) {
        const { expression, statements } = compileInjectable({
            name: facade.name,
            type: wrapReference(facade.type),
            internalType: new WrappedNodeExpr(facade.type),
            typeArgumentCount: facade.typeArgumentCount,
            providedIn: computeProvidedIn(facade.providedIn),
            useClass: convertToProviderExpression(facade, USE_CLASS),
            useFactory: wrapExpression(facade, USE_FACTORY),
            useValue: convertToProviderExpression(facade, USE_VALUE),
            useExisting: convertToProviderExpression(facade, USE_EXISTING),
            deps: facade.deps?.map(convertR3DependencyMetadata),
        }, 
        /* resolveForwardRefs */ true);
        return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, statements);
    }
    compileInjectableDeclaration(angularCoreEnv, sourceMapUrl, facade) {
        const { expression, statements } = compileInjectable({
            name: facade.type.name,
            type: wrapReference(facade.type),
            internalType: new WrappedNodeExpr(facade.type),
            typeArgumentCount: 0,
            providedIn: computeProvidedIn(facade.providedIn),
            useClass: convertToProviderExpression(facade, USE_CLASS),
            useFactory: wrapExpression(facade, USE_FACTORY),
            useValue: convertToProviderExpression(facade, USE_VALUE),
            useExisting: convertToProviderExpression(facade, USE_EXISTING),
            deps: facade.deps?.map(convertR3DeclareDependencyMetadata),
        }, 
        /* resolveForwardRefs */ true);
        return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, statements);
    }
    compileInjector(angularCoreEnv, sourceMapUrl, facade) {
        const meta = {
            name: facade.name,
            type: wrapReference(facade.type),
            internalType: new WrappedNodeExpr(facade.type),
            providers: new WrappedNodeExpr(facade.providers),
            imports: facade.imports.map(i => new WrappedNodeExpr(i)),
        };
        const res = compileInjector(meta);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
    }
    compileInjectorDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
        const meta = convertDeclareInjectorFacadeToMetadata(declaration);
        const res = compileInjector(meta);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
    }
    compileNgModule(angularCoreEnv, sourceMapUrl, facade) {
        const meta = {
            type: wrapReference(facade.type),
            internalType: new WrappedNodeExpr(facade.type),
            adjacentType: new WrappedNodeExpr(facade.type),
            bootstrap: facade.bootstrap.map(wrapReference),
            declarations: facade.declarations.map(wrapReference),
            imports: facade.imports.map(wrapReference),
            exports: facade.exports.map(wrapReference),
            emitInline: true,
            containsForwardDecls: false,
            schemas: facade.schemas ? facade.schemas.map(wrapReference) : null,
            id: facade.id ? new WrappedNodeExpr(facade.id) : null,
        };
        const res = compileNgModule(meta);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
    }
    compileNgModuleDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
        const expression = compileNgModuleDeclarationExpression(declaration);
        return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, []);
    }
    compileDirective(angularCoreEnv, sourceMapUrl, facade) {
        const meta = convertDirectiveFacadeToMetadata(facade);
        return this.compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta);
    }
    compileDirectiveDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
        const typeSourceSpan = this.createParseSourceSpan('Directive', declaration.type.name, sourceMapUrl);
        const meta = convertDeclareDirectiveFacadeToMetadata(declaration, typeSourceSpan);
        return this.compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta);
    }
    compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta) {
        const constantPool = new ConstantPool();
        const bindingParser = makeBindingParser();
        const res = compileDirectiveFromMetadata(meta, constantPool, bindingParser);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, constantPool.statements);
    }
    compileComponent(angularCoreEnv, sourceMapUrl, facade) {
        // Parse the template and check for errors.
        const { template, interpolation } = parseJitTemplate(facade.template, facade.name, sourceMapUrl, facade.preserveWhitespaces, facade.interpolation);
        // Compile the component metadata, including template, into an expression.
        const meta = {
            ...facade,
            ...convertDirectiveFacadeToMetadata(facade),
            selector: facade.selector || this.elementSchemaRegistry.getDefaultComponentElementName(),
            template,
            declarationListEmitMode: 0 /* Direct */,
            styles: [...facade.styles, ...template.styles],
            encapsulation: facade.encapsulation,
            interpolation,
            changeDetection: facade.changeDetection,
            animations: facade.animations != null ? new WrappedNodeExpr(facade.animations) : null,
            viewProviders: facade.viewProviders != null ? new WrappedNodeExpr(facade.viewProviders) :
                null,
            relativeContextFilePath: '',
            i18nUseExternalIds: true,
        };
        const jitExpressionSourceMap = `ng:///${facade.name}.js`;
        return this.compileComponentFromMeta(angularCoreEnv, jitExpressionSourceMap, meta);
    }
    compileComponentDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
        const typeSourceSpan = this.createParseSourceSpan('Component', declaration.type.name, sourceMapUrl);
        const meta = convertDeclareComponentFacadeToMetadata(declaration, typeSourceSpan, sourceMapUrl);
        return this.compileComponentFromMeta(angularCoreEnv, sourceMapUrl, meta);
    }
    compileComponentFromMeta(angularCoreEnv, sourceMapUrl, meta) {
        const constantPool = new ConstantPool();
        const bindingParser = makeBindingParser(meta.interpolation);
        const res = compileComponentFromMetadata(meta, constantPool, bindingParser);
        return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, constantPool.statements);
    }
    compileFactory(angularCoreEnv, sourceMapUrl, meta) {
        const factoryRes = compileFactoryFunction({
            name: meta.name,
            type: wrapReference(meta.type),
            internalType: new WrappedNodeExpr(meta.type),
            typeArgumentCount: meta.typeArgumentCount,
            deps: convertR3DependencyMetadataArray(meta.deps),
            target: meta.target,
        });
        return this.jitExpression(factoryRes.expression, angularCoreEnv, sourceMapUrl, factoryRes.statements);
    }
    compileFactoryDeclaration(angularCoreEnv, sourceMapUrl, meta) {
        const factoryRes = compileFactoryFunction({
            name: meta.type.name,
            type: wrapReference(meta.type),
            internalType: new WrappedNodeExpr(meta.type),
            typeArgumentCount: 0,
            deps: Array.isArray(meta.deps) ? meta.deps.map(convertR3DeclareDependencyMetadata) :
                meta.deps,
            target: meta.target,
        });
        return this.jitExpression(factoryRes.expression, angularCoreEnv, sourceMapUrl, factoryRes.statements);
    }
    createParseSourceSpan(kind, typeName, sourceUrl) {
        return r3JitTypeSourceSpan(kind, typeName, sourceUrl);
    }
    /**
     * JIT compiles an expression and returns the result of executing that expression.
     *
     * @param def the definition which will be compiled and executed to get the value to patch
     * @param context an object map of @angular/core symbol names to symbols which will be available
     * in the context of the compiled expression
     * @param sourceUrl a URL to use for the source map of the compiled expression
     * @param preStatements a collection of statements that should be evaluated before the expression.
     */
    jitExpression(def, context, sourceUrl, preStatements) {
        // The ConstantPool may contain Statements which declare variables used in the final expression.
        // Therefore, its statements need to precede the actual JIT operation. The final statement is a
        // declaration of $def which is set to the expression being compiled.
        const statements = [
            ...preStatements,
            new DeclareVarStmt('$def', def, undefined, StmtModifier.Exported),
        ];
        const res = this.jitEvaluator.evaluateStatements(sourceUrl, statements, new R3JitReflector(context), /* enableSourceMaps */ true);
        return res['$def'];
    }
}
const USE_CLASS = Object.keys({ useClass: null })[0];
const USE_FACTORY = Object.keys({ useFactory: null })[0];
const USE_VALUE = Object.keys({ useValue: null })[0];
const USE_EXISTING = Object.keys({ useExisting: null })[0];
function convertToR3QueryMetadata(facade) {
    return {
        ...facade,
        predicate: convertQueryPredicate(facade.predicate),
        read: facade.read ? new WrappedNodeExpr(facade.read) : null,
        static: facade.static,
        emitDistinctChangesOnly: facade.emitDistinctChangesOnly,
    };
}
function convertQueryDeclarationToMetadata(declaration) {
    return {
        propertyName: declaration.propertyName,
        first: declaration.first ?? false,
        predicate: convertQueryPredicate(declaration.predicate),
        descendants: declaration.descendants ?? false,
        read: declaration.read ? new WrappedNodeExpr(declaration.read) : null,
        static: declaration.static ?? false,
        emitDistinctChangesOnly: declaration.emitDistinctChangesOnly ?? true,
    };
}
function convertQueryPredicate(predicate) {
    return Array.isArray(predicate) ?
        // The predicate is an array of strings so pass it through.
        predicate :
        // The predicate is a type - assume that we will need to unwrap any `forwardRef()` calls.
        createMayBeForwardRefExpression(new WrappedNodeExpr(predicate), 1 /* Wrapped */);
}
function convertDirectiveFacadeToMetadata(facade) {
    const inputsFromMetadata = parseInputOutputs(facade.inputs || []);
    const outputsFromMetadata = parseInputOutputs(facade.outputs || []);
    const propMetadata = facade.propMetadata;
    const inputsFromType = {};
    const outputsFromType = {};
    for (const field in propMetadata) {
        if (propMetadata.hasOwnProperty(field)) {
            propMetadata[field].forEach(ann => {
                if (isInput(ann)) {
                    inputsFromType[field] =
                        ann.bindingPropertyName ? [ann.bindingPropertyName, field] : field;
                }
                else if (isOutput(ann)) {
                    outputsFromType[field] = ann.bindingPropertyName || field;
                }
            });
        }
    }
    return {
        ...facade,
        typeArgumentCount: 0,
        typeSourceSpan: facade.typeSourceSpan,
        type: wrapReference(facade.type),
        internalType: new WrappedNodeExpr(facade.type),
        deps: null,
        host: extractHostBindings(facade.propMetadata, facade.typeSourceSpan, facade.host),
        inputs: { ...inputsFromMetadata, ...inputsFromType },
        outputs: { ...outputsFromMetadata, ...outputsFromType },
        queries: facade.queries.map(convertToR3QueryMetadata),
        providers: facade.providers != null ? new WrappedNodeExpr(facade.providers) : null,
        viewQueries: facade.viewQueries.map(convertToR3QueryMetadata),
        fullInheritance: false,
    };
}
function convertDeclareDirectiveFacadeToMetadata(declaration, typeSourceSpan) {
    return {
        name: declaration.type.name,
        type: wrapReference(declaration.type),
        typeSourceSpan,
        internalType: new WrappedNodeExpr(declaration.type),
        selector: declaration.selector ?? null,
        inputs: declaration.inputs ?? {},
        outputs: declaration.outputs ?? {},
        host: convertHostDeclarationToMetadata(declaration.host),
        queries: (declaration.queries ?? []).map(convertQueryDeclarationToMetadata),
        viewQueries: (declaration.viewQueries ?? []).map(convertQueryDeclarationToMetadata),
        providers: declaration.providers !== undefined ? new WrappedNodeExpr(declaration.providers) :
            null,
        exportAs: declaration.exportAs ?? null,
        usesInheritance: declaration.usesInheritance ?? false,
        lifecycle: { usesOnChanges: declaration.usesOnChanges ?? false },
        deps: null,
        typeArgumentCount: 0,
        fullInheritance: false,
    };
}
function convertHostDeclarationToMetadata(host = {}) {
    return {
        attributes: convertOpaqueValuesToExpressions(host.attributes ?? {}),
        listeners: host.listeners ?? {},
        properties: host.properties ?? {},
        specialAttributes: {
            classAttr: host.classAttribute,
            styleAttr: host.styleAttribute,
        },
    };
}
function convertOpaqueValuesToExpressions(obj) {
    const result = {};
    for (const key of Object.keys(obj)) {
        result[key] = new WrappedNodeExpr(obj[key]);
    }
    return result;
}
function convertDeclareComponentFacadeToMetadata(declaration, typeSourceSpan, sourceMapUrl) {
    const { template, interpolation } = parseJitTemplate(declaration.template, declaration.type.name, sourceMapUrl, declaration.preserveWhitespaces ?? false, declaration.interpolation);
    return {
        ...convertDeclareDirectiveFacadeToMetadata(declaration, typeSourceSpan),
        template,
        styles: declaration.styles ?? [],
        directives: (declaration.components ?? [])
            .concat(declaration.directives ?? [])
            .map(convertUsedDirectiveDeclarationToMetadata),
        pipes: convertUsedPipesToMetadata(declaration.pipes),
        viewProviders: declaration.viewProviders !== undefined ?
            new WrappedNodeExpr(declaration.viewProviders) :
            null,
        animations: declaration.animations !== undefined ? new WrappedNodeExpr(declaration.animations) :
            null,
        changeDetection: declaration.changeDetection ?? ChangeDetectionStrategy.Default,
        encapsulation: declaration.encapsulation ?? ViewEncapsulation.Emulated,
        interpolation,
        declarationListEmitMode: 2 /* ClosureResolved */,
        relativeContextFilePath: '',
        i18nUseExternalIds: true,
    };
}
function convertUsedDirectiveDeclarationToMetadata(declaration) {
    return {
        selector: declaration.selector,
        type: new WrappedNodeExpr(declaration.type),
        inputs: declaration.inputs ?? [],
        outputs: declaration.outputs ?? [],
        exportAs: declaration.exportAs ?? null,
    };
}
function convertUsedPipesToMetadata(declaredPipes) {
    const pipes = new Map();
    if (declaredPipes === undefined) {
        return pipes;
    }
    for (const pipeName of Object.keys(declaredPipes)) {
        const pipeType = declaredPipes[pipeName];
        pipes.set(pipeName, new WrappedNodeExpr(pipeType));
    }
    return pipes;
}
function parseJitTemplate(template, typeName, sourceMapUrl, preserveWhitespaces, interpolation) {
    const interpolationConfig = interpolation ? InterpolationConfig.fromArray(interpolation) : DEFAULT_INTERPOLATION_CONFIG;
    // Parse the template and check for errors.
    const parsed = parseTemplate(template, sourceMapUrl, { preserveWhitespaces, interpolationConfig });
    if (parsed.errors !== null) {
        const errors = parsed.errors.map(err => err.toString()).join(', ');
        throw new Error(`Errors during JIT compilation of template for ${typeName}: ${errors}`);
    }
    return { template: parsed, interpolation: interpolationConfig };
}
/**
 * Convert the expression, if present to an `R3ProviderExpression`.
 *
 * In JIT mode we do not want the compiler to wrap the expression in a `forwardRef()` call because,
 * if it is referencing a type that has not yet been defined, it will have already been wrapped in
 * a `forwardRef()` - either by the application developer or during partial-compilation. Thus we can
 * use `ForwardRefHandling.None`.
 */
function convertToProviderExpression(obj, property) {
    if (obj.hasOwnProperty(property)) {
        return createMayBeForwardRefExpression(new WrappedNodeExpr(obj[property]), 0 /* None */);
    }
    else {
        return undefined;
    }
}
function wrapExpression(obj, property) {
    if (obj.hasOwnProperty(property)) {
        return new WrappedNodeExpr(obj[property]);
    }
    else {
        return undefined;
    }
}
function computeProvidedIn(providedIn) {
    const expression = typeof providedIn === 'function' ? new WrappedNodeExpr(providedIn) :
        new LiteralExpr(providedIn ?? null);
    // See `convertToProviderExpression()` for why this uses `ForwardRefHandling.None`.
    return createMayBeForwardRefExpression(expression, 0 /* None */);
}
function convertR3DependencyMetadataArray(facades) {
    return facades == null ? null : facades.map(convertR3DependencyMetadata);
}
function convertR3DependencyMetadata(facade) {
    const isAttributeDep = facade.attribute != null; // both `null` and `undefined`
    const rawToken = facade.token === null ? null : new WrappedNodeExpr(facade.token);
    // In JIT mode, if the dep is an `@Attribute()` then we use the attribute name given in
    // `attribute` rather than the `token`.
    const token = isAttributeDep ? new WrappedNodeExpr(facade.attribute) : rawToken;
    return createR3DependencyMetadata(token, isAttributeDep, facade.host, facade.optional, facade.self, facade.skipSelf);
}
function convertR3DeclareDependencyMetadata(facade) {
    const isAttributeDep = facade.attribute ?? false;
    const token = facade.token === null ? null : new WrappedNodeExpr(facade.token);
    return createR3DependencyMetadata(token, isAttributeDep, facade.host ?? false, facade.optional ?? false, facade.self ?? false, facade.skipSelf ?? false);
}
function createR3DependencyMetadata(token, isAttributeDep, host, optional, self, skipSelf) {
    // If the dep is an `@Attribute()` the `attributeNameType` ought to be the `unknown` type.
    // But types are not available at runtime so we just use a literal `"<unknown>"` string as a dummy
    // marker.
    const attributeNameType = isAttributeDep ? literal('unknown') : null;
    return { token, attributeNameType, host, optional, self, skipSelf };
}
function extractHostBindings(propMetadata, sourceSpan, host) {
    // First parse the declarations from the metadata.
    const bindings = parseHostBindings(host || {});
    // After that check host bindings for errors
    const errors = verifyHostBindings(bindings, sourceSpan);
    if (errors.length) {
        throw new Error(errors.map((error) => error.msg).join('\n'));
    }
    // Next, loop over the properties of the object, looking for @HostBinding and @HostListener.
    for (const field in propMetadata) {
        if (propMetadata.hasOwnProperty(field)) {
            propMetadata[field].forEach(ann => {
                if (isHostBinding(ann)) {
                    // Since this is a decorator, we know that the value is a class member. Always access it
                    // through `this` so that further down the line it can't be confused for a literal value
                    // (e.g. if there's a property called `true`).
                    bindings.properties[ann.hostPropertyName || field] =
                        getSafePropertyAccessString('this', field);
                }
                else if (isHostListener(ann)) {
                    bindings.listeners[ann.eventName || field] = `${field}(${(ann.args || []).join(',')})`;
                }
            });
        }
    }
    return bindings;
}
function isHostBinding(value) {
    return value.ngMetadataName === 'HostBinding';
}
function isHostListener(value) {
    return value.ngMetadataName === 'HostListener';
}
function isInput(value) {
    return value.ngMetadataName === 'Input';
}
function isOutput(value) {
    return value.ngMetadataName === 'Output';
}
function parseInputOutputs(values) {
    return values.reduce((map, value) => {
        const [field, property] = value.split(',').map(piece => piece.trim());
        map[field] = property || field;
        return map;
    }, {});
}
function convertDeclarePipeFacadeToMetadata(declaration) {
    return {
        name: declaration.type.name,
        type: wrapReference(declaration.type),
        internalType: new WrappedNodeExpr(declaration.type),
        typeArgumentCount: 0,
        pipeName: declaration.name,
        deps: null,
        pure: declaration.pure ?? true,
    };
}
function convertDeclareInjectorFacadeToMetadata(declaration) {
    return {
        name: declaration.type.name,
        type: wrapReference(declaration.type),
        internalType: new WrappedNodeExpr(declaration.type),
        providers: declaration.providers !== undefined ? new WrappedNodeExpr(declaration.providers) :
            null,
        imports: declaration.imports !== undefined ?
            declaration.imports.map(i => new WrappedNodeExpr(i)) :
            [],
    };
}
function publishFacade(global) {
    const ng = global.ng || (global.ng = {});
    ng.ɵcompilerFacade = new CompilerFacadeImpl();
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const VERSION = new Version('13.3.10');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class CompilerConfig {
    constructor({ defaultEncapsulation = ViewEncapsulation.Emulated, useJit = true, jitDevMode = false, missingTranslation = null, preserveWhitespaces, strictInjectionParameters } = {}) {
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.jitDevMode = !!jitDevMode;
        this.missingTranslation = missingTranslation;
        this.preserveWhitespaces = preserveWhitespacesDefault(noUndefined(preserveWhitespaces));
        this.strictInjectionParameters = strictInjectionParameters === true;
    }
}
function preserveWhitespacesDefault(preserveWhitespacesOption, defaultSetting = false) {
    return preserveWhitespacesOption === null ? defaultSetting : preserveWhitespacesOption;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _I18N_ATTR = 'i18n';
const _I18N_ATTR_PREFIX = 'i18n-';
const _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
const MEANING_SEPARATOR = '|';
const ID_SEPARATOR = '@@';
let i18nCommentsWarned = false;
/**
 * Extract translatable messages from an html AST
 */
function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
    const visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.extract(nodes, interpolationConfig);
}
function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
    const visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.merge(nodes, translations, interpolationConfig);
}
class ExtractionResult {
    constructor(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
}
var _VisitorMode;
(function (_VisitorMode) {
    _VisitorMode[_VisitorMode["Extract"] = 0] = "Extract";
    _VisitorMode[_VisitorMode["Merge"] = 1] = "Merge";
})(_VisitorMode || (_VisitorMode = {}));
/**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * @internal
 */
class _Visitor {
    constructor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
    }
    /**
     * Extracts the messages from the tree
     */
    extract(nodes, interpolationConfig) {
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(node => node.visit(this, null));
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
    }
    /**
     * Returns a tree where all translatable nodes are translated
     */
    merge(nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        // Construct a single fake root element
        const wrapper = new Element('wrapper', [], nodes, undefined, undefined, undefined);
        const translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ParseTreeResult(translatedNode.children, this._errors);
    }
    visitExpansionCase(icuCase, context) {
        // Parse cases for translatable html attributes
        const expression = visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
            return new ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    }
    visitExpansion(icu, context) {
        this._mayBeAddBlockChildren(icu);
        const wasInIcu = this._inIcu;
        if (!this._inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this._isInTranslatableSection) {
                this._addMessage([icu]);
            }
            this._inIcu = true;
        }
        const cases = visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
            icu = new Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
    }
    visitComment(comment, context) {
        const isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
            this._reportError(comment, 'Could not start a block inside a translatable section');
            return;
        }
        const isClosing = _isClosingComment(comment);
        if (isClosing && !this._inI18nBlock) {
            this._reportError(comment, 'Trying to close an unopened block');
            return;
        }
        if (!this._inI18nNode && !this._inIcu) {
            if (!this._inI18nBlock) {
                if (isOpening) {
                    // deprecated from v5 you should use <ng-container i18n> instead of i18n comments
                    if (!i18nCommentsWarned && console && console.warn) {
                        i18nCommentsWarned = true;
                        const details = comment.sourceSpan.details ? `, ${comment.sourceSpan.details}` : '';
                        // TODO(ocombe): use a log service once there is a public one available
                        console.warn(`I18n comments are deprecated, use an <ng-container> element instead (${comment.sourceSpan.start}${details})`);
                    }
                    this._inI18nBlock = true;
                    this._blockStartDepth = this._depth;
                    this._blockChildren = [];
                    this._blockMeaningAndDesc =
                        comment.value.replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
                    this._openTranslatableSection(comment);
                }
            }
            else {
                if (isClosing) {
                    if (this._depth == this._blockStartDepth) {
                        this._closeTranslatableSection(comment, this._blockChildren);
                        this._inI18nBlock = false;
                        const message = this._addMessage(this._blockChildren, this._blockMeaningAndDesc);
                        // merge attributes in sections
                        const nodes = this._translateMessage(comment, message);
                        return visitAll(this, nodes);
                    }
                    else {
                        this._reportError(comment, 'I18N blocks should not cross element boundaries');
                        return;
                    }
                }
            }
        }
    }
    visitText(text, context) {
        if (this._isInTranslatableSection) {
            this._mayBeAddBlockChildren(text);
        }
        return text;
    }
    visitElement(el, context) {
        this._mayBeAddBlockChildren(el);
        this._depth++;
        const wasInI18nNode = this._inI18nNode;
        const wasInImplicitNode = this._inImplicitNode;
        let childNodes = [];
        let translatedChildNodes = undefined;
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        const i18nAttr = _getI18nAttr(el);
        const i18nMeta = i18nAttr ? i18nAttr.value : '';
        const isImplicit = this._implicitTags.some(tag => el.name === tag) && !this._inIcu &&
            !this._isInTranslatableSection;
        const isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this._inI18nNode = true;
                const message = this._addMessage(el.children, i18nMeta);
                translatedChildNodes = this._translateMessage(el, message);
            }
            if (this._mode == _VisitorMode.Extract) {
                const isTranslatable = i18nAttr || isTopLevelImplicit;
                if (isTranslatable)
                    this._openTranslatableSection(el);
                visitAll(this, el.children);
                if (isTranslatable)
                    this._closeTranslatableSection(el, el.children);
            }
        }
        else {
            if (i18nAttr || isTopLevelImplicit) {
                this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
            }
            if (this._mode == _VisitorMode.Extract) {
                // Descend into child nodes for extraction
                visitAll(this, el.children);
            }
        }
        if (this._mode === _VisitorMode.Merge) {
            const visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(child => {
                const visited = child.visit(this, context);
                if (visited && !this._isInTranslatableSection) {
                    // Do not add the children from translatable sections (= i18n blocks here)
                    // They will be added later in this loop when the block closes (i.e. on `<!-- /i18n -->`)
                    childNodes = childNodes.concat(visited);
                }
            });
        }
        this._visitAttributesOf(el);
        this._depth--;
        this._inI18nNode = wasInI18nNode;
        this._inImplicitNode = wasInImplicitNode;
        if (this._mode === _VisitorMode.Merge) {
            const translatedAttrs = this._translateAttributes(el);
            return new Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
    }
    visitAttribute(attribute, context) {
        throw new Error('unreachable code');
    }
    _init(mode, interpolationConfig) {
        this._mode = mode;
        this._inI18nBlock = false;
        this._inI18nNode = false;
        this._depth = 0;
        this._inIcu = false;
        this._msgCountAtSectionStart = undefined;
        this._errors = [];
        this._messages = [];
        this._inImplicitNode = false;
        this._createI18nMessage = createI18nMessageFactory(interpolationConfig);
    }
    // looks for translatable attributes
    _visitAttributesOf(el) {
        const explicitAttrNameToValue = {};
        const implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(attr => attr.name.startsWith(_I18N_ATTR_PREFIX))
            .forEach(attr => explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
            attr.value);
        el.attrs.forEach(attr => {
            if (attr.name in explicitAttrNameToValue) {
                this._addMessage([attr], explicitAttrNameToValue[attr.name]);
            }
            else if (implicitAttrNames.some(name => attr.name === name)) {
                this._addMessage([attr]);
            }
        });
    }
    // add a translatable message
    _addMessage(ast, msgMeta) {
        if (ast.length == 0 ||
            ast.length == 1 && ast[0] instanceof Attribute && !ast[0].value) {
            // Do not create empty messages
            return null;
        }
        const { meaning, description, id } = _parseMessageMeta(msgMeta);
        const message = this._createI18nMessage(ast, meaning, description, id);
        this._messages.push(message);
        return message;
    }
    // Translates the given message given the `TranslationBundle`
    // This is used for translating elements / blocks - see `_translateAttributes` for attributes
    // no-op when called in extraction mode (returns [])
    _translateMessage(el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
            const nodes = this._translations.get(message);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, `Translation unavailable for message id="${this._translations.digest(message)}"`);
        }
        return [];
    }
    // translate the attributes of an element and remove i18n specific attributes
    _translateAttributes(el) {
        const attributes = el.attrs;
        const i18nParsedMessageMeta = {};
        attributes.forEach(attr => {
            if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                i18nParsedMessageMeta[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                    _parseMessageMeta(attr.value);
            }
        });
        const translatedAttributes = [];
        attributes.forEach((attr) => {
            if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                // strip i18n specific attributes
                return;
            }
            if (attr.value && attr.value != '' && i18nParsedMessageMeta.hasOwnProperty(attr.name)) {
                const { meaning, description, id } = i18nParsedMessageMeta[attr.name];
                const message = this._createI18nMessage([attr], meaning, description, id);
                const nodes = this._translations.get(message);
                if (nodes) {
                    if (nodes.length == 0) {
                        translatedAttributes.push(new Attribute(attr.name, '', attr.sourceSpan, undefined /* keySpan */, undefined /* valueSpan */, undefined /* valueTokens */, undefined /* i18n */));
                    }
                    else if (nodes[0] instanceof Text) {
                        const value = nodes[0].value;
                        translatedAttributes.push(new Attribute(attr.name, value, attr.sourceSpan, undefined /* keySpan */, undefined /* valueSpan */, undefined /* valueTokens */, undefined /* i18n */));
                    }
                    else {
                        this._reportError(el, `Unexpected translation for attribute "${attr.name}" (id="${id || this._translations.digest(message)}")`);
                    }
                }
                else {
                    this._reportError(el, `Translation unavailable for attribute "${attr.name}" (id="${id || this._translations.digest(message)}")`);
                }
            }
            else {
                translatedAttributes.push(attr);
            }
        });
        return translatedAttributes;
    }
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     */
    _mayBeAddBlockChildren(node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
            this._blockChildren.push(node);
        }
    }
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     */
    _openTranslatableSection(node) {
        if (this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section start');
        }
        else {
            this._msgCountAtSectionStart = this._messages.length;
        }
    }
    /**
     * A translatable section could be:
     * - the content of translatable element,
     * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
     */
    get _isInTranslatableSection() {
        return this._msgCountAtSectionStart !== void 0;
    }
    /**
     * Terminates a section.
     *
     * If a section has only one significant children (comments not significant) then we should not
     * keep the message from this children:
     *
     * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
     * - one for the <p> content with meaning and description,
     * - another one for the ICU message.
     *
     * In this case the last message is discarded as it contains less information (the AST is
     * otherwise identical).
     *
     * Note that we should still keep messages extracted from attributes inside the section (ie in the
     * ICU message here)
     */
    _closeTranslatableSection(node, directChildren) {
        if (!this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section end');
            return;
        }
        const startIndex = this._msgCountAtSectionStart;
        const significantChildren = directChildren.reduce((count, node) => count + (node instanceof Comment ? 0 : 1), 0);
        if (significantChildren == 1) {
            for (let i = this._messages.length - 1; i >= startIndex; i--) {
                const ast = this._messages[i].nodes;
                if (!(ast.length == 1 && ast[0] instanceof Text$2)) {
                    this._messages.splice(i, 1);
                    break;
                }
            }
        }
        this._msgCountAtSectionStart = undefined;
    }
    _reportError(node, msg) {
        this._errors.push(new I18nError(node.sourceSpan, msg));
    }
}
function _isOpeningComment(n) {
    return !!(n instanceof Comment && n.value && n.value.startsWith('i18n'));
}
function _isClosingComment(n) {
    return !!(n instanceof Comment && n.value && n.value === '/i18n');
}
function _getI18nAttr(p) {
    return p.attrs.find(attr => attr.name === _I18N_ATTR) || null;
}
function _parseMessageMeta(i18n) {
    if (!i18n)
        return { meaning: '', description: '', id: '' };
    const idIndex = i18n.indexOf(ID_SEPARATOR);
    const descIndex = i18n.indexOf(MEANING_SEPARATOR);
    const [meaningAndDesc, id] = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''];
    const [meaning, description] = (descIndex > -1) ?
        [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
        ['', meaningAndDesc];
    return { meaning, description, id: id.trim() };
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class XmlTagDefinition {
    constructor() {
        this.closedByParent = false;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
        this.preventNamespaceInheritance = false;
    }
    requireExtraParent(currentParent) {
        return false;
    }
    isClosedByChild(name) {
        return false;
    }
    getContentType() {
        return TagContentType.PARSABLE_DATA;
    }
}
const _TAG_DEFINITION = new XmlTagDefinition();
function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class XmlParser extends Parser {
    constructor() {
        super(getXmlTagDefinition);
    }
    parse(source, url, options) {
        return super.parse(source, url, options);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _VERSION$1 = '1.2';
const _XMLNS$1 = 'urn:oasis:names:tc:xliff:document:1.2';
// TODO(vicb): make this a param (s/_/-/)
const _DEFAULT_SOURCE_LANG$1 = 'en';
const _PLACEHOLDER_TAG$2 = 'x';
const _MARKER_TAG$1 = 'mrk';
const _FILE_TAG = 'file';
const _SOURCE_TAG$1 = 'source';
const _SEGMENT_SOURCE_TAG = 'seg-source';
const _ALT_TRANS_TAG = 'alt-trans';
const _TARGET_TAG$1 = 'target';
const _UNIT_TAG$1 = 'trans-unit';
const _CONTEXT_GROUP_TAG = 'context-group';
const _CONTEXT_TAG = 'context';
// https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
// https://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
class Xliff extends Serializer {
    write(messages, locale) {
        const visitor = new _WriteVisitor$1();
        const transUnits = [];
        messages.forEach(message => {
            let contextTags = [];
            message.sources.forEach((source) => {
                let contextGroupTag = new Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new Text$1(source.filePath)]), new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new Text$1(`${source.startLine}`)]), new CR(8));
                contextTags.push(new CR(8), contextGroupTag);
            });
            const transUnit = new Tag(_UNIT_TAG$1, { id: message.id, datatype: 'html' });
            transUnit.children.push(new CR(8), new Tag(_SOURCE_TAG$1, {}, visitor.serialize(message.nodes)), ...contextTags);
            if (message.description) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'description' }, [new Text$1(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'meaning' }, [new Text$1(message.meaning)]));
            }
            transUnit.children.push(new CR(6));
            transUnits.push(new CR(6), transUnit);
        });
        const body = new Tag('body', {}, [...transUnits, new CR(4)]);
        const file = new Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG$1,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new CR(4), body, new CR(2)]);
        const xliff = new Tag('xliff', { version: _VERSION$1, xmlns: _XMLNS$1 }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    }
    load(content, url) {
        // xliff to xml nodes
        const xliffParser = new XliffParser();
        const { locale, msgIdToHtml, errors } = xliffParser.parse(content, url);
        // xml nodes to i18n nodes
        const i18nNodesByMsgId = {};
        const converter = new XmlToI18n$2();
        Object.keys(msgIdToHtml).forEach(msgId => {
            const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId], url);
            errors.push(...e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error(`xliff parse errors:\n${errors.join('\n')}`);
        }
        return { locale: locale, i18nNodesByMsgId };
    }
    digest(message) {
        return digest$1(message);
    }
}
class _WriteVisitor$1 {
    visitText(text, context) {
        return [new Text$1(text.value)];
    }
    visitContainer(container, context) {
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    visitIcu(icu, context) {
        const nodes = [new Text$1(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$1(`${c} {`), ...icu.cases[c].visit(this), new Text$1(`} `));
        });
        nodes.push(new Text$1(`}`));
        return nodes;
    }
    visitTagPlaceholder(ph, context) {
        const ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new Tag(_PLACEHOLDER_TAG$2, { id: ph.startName, ctype, 'equiv-text': `<${ph.tag}/>` })];
        }
        const startTagPh = new Tag(_PLACEHOLDER_TAG$2, { id: ph.startName, ctype, 'equiv-text': `<${ph.tag}>` });
        const closeTagPh = new Tag(_PLACEHOLDER_TAG$2, { id: ph.closeName, ctype, 'equiv-text': `</${ph.tag}>` });
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    visitPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$2, { id: ph.name, 'equiv-text': `{{${ph.value}}}` })];
    }
    visitIcuPlaceholder(ph, context) {
        const equivText = `{${ph.value.expression}, ${ph.value.type}, ${Object.keys(ph.value.cases).map((value) => value + ' {...}').join(' ')}}`;
        return [new Tag(_PLACEHOLDER_TAG$2, { id: ph.name, 'equiv-text': equivText })];
    }
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
// TODO(vicb): add error management (structure)
// Extract messages as xml nodes from the xliff file
class XliffParser {
    constructor() {
        this._locale = null;
    }
    parse(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const xml = new XmlParser().parse(xliff, url);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    visitElement(element, context) {
        switch (element.name) {
            case _UNIT_TAG$1:
                this._unitMlString = null;
                const idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG$1}> misses the "id" attribute`);
                }
                else {
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            // ignore those tags
            case _SOURCE_TAG$1:
            case _SEGMENT_SOURCE_TAG:
            case _ALT_TRANS_TAG:
                break;
            case _TARGET_TAG$1:
                const innerTextStart = element.startSourceSpan.end.offset;
                const innerTextEnd = element.endSourceSpan.start.offset;
                const content = element.startSourceSpan.start.file.content;
                const innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                const localeAttr = element.attrs.find((attr) => attr.name === 'target-language');
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                visitAll(this, element.children, null);
        }
    }
    visitAttribute(attribute, context) { }
    visitText(text, context) { }
    visitComment(comment, context) { }
    visitExpansion(expansion, context) { }
    visitExpansionCase(expansionCase, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
// Convert ml nodes (xliff syntax) to i18n nodes
class XmlToI18n$2 {
    convert(message, url) {
        const xmlIcu = new XmlParser().parse(message, url, { tokenizeExpansionForms: true });
        this._errors = xmlIcu.errors;
        const i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            [].concat(...visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    }
    visitText(text, context) {
        return new Text$2(text.value, text.sourceSpan);
    }
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG$2) {
            const nameAttr = el.attrs.find((attr) => attr.name === 'id');
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, `<${_PLACEHOLDER_TAG$2}> misses the "id" attribute`);
            return null;
        }
        if (el.name === _MARKER_TAG$1) {
            return [].concat(...visitAll(this, el.children));
        }
        this._addError(el, `Unexpected tag`);
        return null;
    }
    visitExpansion(icu, context) {
        const caseMap = {};
        visitAll(this, icu.cases).forEach((c) => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    }
    visitComment(comment, context) { }
    visitAttribute(attribute, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
            return 'lb';
        case 'img':
            return 'image';
        default:
            return `x-${tag}`;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _VERSION = '2.0';
const _XMLNS = 'urn:oasis:names:tc:xliff:document:2.0';
// TODO(vicb): make this a param (s/_/-/)
const _DEFAULT_SOURCE_LANG = 'en';
const _PLACEHOLDER_TAG$1 = 'ph';
const _PLACEHOLDER_SPANNING_TAG = 'pc';
const _MARKER_TAG = 'mrk';
const _XLIFF_TAG = 'xliff';
const _SOURCE_TAG = 'source';
const _TARGET_TAG = 'target';
const _UNIT_TAG = 'unit';
// https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
class Xliff2 extends Serializer {
    write(messages, locale) {
        const visitor = new _WriteVisitor();
        const units = [];
        messages.forEach(message => {
            const unit = new Tag(_UNIT_TAG, { id: message.id });
            const notes = new Tag('notes');
            if (message.description || message.meaning) {
                if (message.description) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'description' }, [new Text$1(message.description)]));
                }
                if (message.meaning) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'meaning' }, [new Text$1(message.meaning)]));
                }
            }
            message.sources.forEach((source) => {
                notes.children.push(new CR(8), new Tag('note', { category: 'location' }, [
                    new Text$1(`${source.filePath}:${source.startLine}${source.endLine !== source.startLine ? ',' + source.endLine : ''}`)
                ]));
            });
            notes.children.push(new CR(6));
            unit.children.push(new CR(6), notes);
            const segment = new Tag('segment');
            segment.children.push(new CR(8), new Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new CR(6));
            unit.children.push(new CR(6), segment, new CR(4));
            units.push(new CR(4), unit);
        });
        const file = new Tag('file', { 'original': 'ng.template', id: 'ngi18n' }, [...units, new CR(2)]);
        const xliff = new Tag(_XLIFF_TAG, { version: _VERSION, xmlns: _XMLNS, srcLang: locale || _DEFAULT_SOURCE_LANG }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    }
    load(content, url) {
        // xliff to xml nodes
        const xliff2Parser = new Xliff2Parser();
        const { locale, msgIdToHtml, errors } = xliff2Parser.parse(content, url);
        // xml nodes to i18n nodes
        const i18nNodesByMsgId = {};
        const converter = new XmlToI18n$1();
        Object.keys(msgIdToHtml).forEach(msgId => {
            const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId], url);
            errors.push(...e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error(`xliff2 parse errors:\n${errors.join('\n')}`);
        }
        return { locale: locale, i18nNodesByMsgId };
    }
    digest(message) {
        return decimalDigest(message);
    }
}
class _WriteVisitor {
    visitText(text, context) {
        return [new Text$1(text.value)];
    }
    visitContainer(container, context) {
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    visitIcu(icu, context) {
        const nodes = [new Text$1(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$1(`${c} {`), ...icu.cases[c].visit(this), new Text$1(`} `));
        });
        nodes.push(new Text$1(`}`));
        return nodes;
    }
    visitTagPlaceholder(ph, context) {
        const type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            const tagPh = new Tag(_PLACEHOLDER_TAG$1, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type: type,
                disp: `<${ph.tag}/>`,
            });
            return [tagPh];
        }
        const tagPc = new Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type: type,
            dispStart: `<${ph.tag}>`,
            dispEnd: `</${ph.tag}>`,
        });
        const nodes = [].concat(...ph.children.map(node => node.visit(this)));
        if (nodes.length) {
            nodes.forEach((node) => tagPc.children.push(node));
        }
        else {
            tagPc.children.push(new Text$1(''));
        }
        return [tagPc];
    }
    visitPlaceholder(ph, context) {
        const idStr = (this._nextPlaceholderId++).toString();
        return [new Tag(_PLACEHOLDER_TAG$1, {
                id: idStr,
                equiv: ph.name,
                disp: `{{${ph.value}}}`,
            })];
    }
    visitIcuPlaceholder(ph, context) {
        const cases = Object.keys(ph.value.cases).map((value) => value + ' {...}').join(' ');
        const idStr = (this._nextPlaceholderId++).toString();
        return [new Tag(_PLACEHOLDER_TAG$1, { id: idStr, equiv: ph.name, disp: `{${ph.value.expression}, ${ph.value.type}, ${cases}}` })];
    }
    serialize(nodes) {
        this._nextPlaceholderId = 0;
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
// Extract messages as xml nodes from the xliff file
class Xliff2Parser {
    constructor() {
        this._locale = null;
    }
    parse(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const xml = new XmlParser().parse(xliff, url);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    visitElement(element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = null;
                const idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG}> misses the "id" attribute`);
                }
                else {
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                const innerTextStart = element.startSourceSpan.end.offset;
                const innerTextEnd = element.endSourceSpan.start.offset;
                const content = element.startSourceSpan.start.file.content;
                const innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _XLIFF_TAG:
                const localeAttr = element.attrs.find((attr) => attr.name === 'trgLang');
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                const versionAttr = element.attrs.find((attr) => attr.name === 'version');
                if (versionAttr) {
                    const version = versionAttr.value;
                    if (version !== '2.0') {
                        this._addError(element, `The XLIFF file version ${version} is not compatible with XLIFF 2.0 serializer`);
                    }
                    else {
                        visitAll(this, element.children, null);
                    }
                }
                break;
            default:
                visitAll(this, element.children, null);
        }
    }
    visitAttribute(attribute, context) { }
    visitText(text, context) { }
    visitComment(comment, context) { }
    visitExpansion(expansion, context) { }
    visitExpansionCase(expansionCase, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
// Convert ml nodes (xliff syntax) to i18n nodes
class XmlToI18n$1 {
    convert(message, url) {
        const xmlIcu = new XmlParser().parse(message, url, { tokenizeExpansionForms: true });
        this._errors = xmlIcu.errors;
        const i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            [].concat(...visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes,
            errors: this._errors,
        };
    }
    visitText(text, context) {
        return new Text$2(text.value, text.sourceSpan);
    }
    visitElement(el, context) {
        switch (el.name) {
            case _PLACEHOLDER_TAG$1:
                const nameAttr = el.attrs.find((attr) => attr.name === 'equiv');
                if (nameAttr) {
                    return [new Placeholder('', nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equiv" attribute`);
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                const startAttr = el.attrs.find((attr) => attr.name === 'equivStart');
                const endAttr = el.attrs.find((attr) => attr.name === 'equivEnd');
                if (!startAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equivStart" attribute`);
                }
                else if (!endAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equivEnd" attribute`);
                }
                else {
                    const startId = startAttr.value;
                    const endId = endAttr.value;
                    const nodes = [];
                    return nodes.concat(new Placeholder('', startId, el.sourceSpan), ...el.children.map(node => node.visit(this, null)), new Placeholder('', endId, el.sourceSpan));
                }
                break;
            case _MARKER_TAG:
                return [].concat(...visitAll(this, el.children));
            default:
                this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    visitExpansion(icu, context) {
        const caseMap = {};
        visitAll(this, icu.cases).forEach((c) => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: [].concat(...visitAll(this, icuCase.expression)),
        };
    }
    visitComment(comment, context) { }
    visitAttribute(attribute, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
function getTypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
        case 'b':
        case 'i':
        case 'u':
            return 'fmt';
        case 'img':
            return 'image';
        case 'a':
            return 'link';
        default:
            return 'other';
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _TRANSLATIONS_TAG = 'translationbundle';
const _TRANSLATION_TAG = 'translation';
const _PLACEHOLDER_TAG = 'ph';
class Xtb extends Serializer {
    write(messages, locale) {
        throw new Error('Unsupported');
    }
    load(content, url) {
        // xtb to xml nodes
        const xtbParser = new XtbParser();
        const { locale, msgIdToHtml, errors } = xtbParser.parse(content, url);
        // xml nodes to i18n nodes
        const i18nNodesByMsgId = {};
        const converter = new XmlToI18n();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(msgId => {
            const valueFn = function () {
                const { i18nNodes, errors } = converter.convert(msgIdToHtml[msgId], url);
                if (errors.length) {
                    throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
        }
        return { locale: locale, i18nNodesByMsgId };
    }
    digest(message) {
        return digest(message);
    }
    createNameMapper(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    }
}
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: function () {
            const value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value });
            return value;
        },
        set: _ => {
            throw new Error('Could not overwrite an XTB translation');
        },
    });
}
// Extract messages as xml nodes from the xtb file
class XtbParser {
    constructor() {
        this._locale = null;
    }
    parse(xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        const xml = new XmlParser().parse(xtb, url);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    visitElement(element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, `<${_TRANSLATIONS_TAG}> elements can not be nested`);
                }
                const langAttr = element.attrs.find((attr) => attr.name === 'lang');
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                const idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_TRANSLATION_TAG}> misses the "id" attribute`);
                }
                else {
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        const innerTextStart = element.startSourceSpan.end.offset;
                        const innerTextEnd = element.endSourceSpan.start.offset;
                        const content = element.startSourceSpan.start.file.content;
                        const innerText = content.slice(innerTextStart, innerTextEnd);
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    }
    visitAttribute(attribute, context) { }
    visitText(text, context) { }
    visitComment(comment, context) { }
    visitExpansion(expansion, context) { }
    visitExpansionCase(expansionCase, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
// Convert ml nodes (xtb syntax) to i18n nodes
class XmlToI18n {
    convert(message, url) {
        const xmlIcu = new XmlParser().parse(message, url, { tokenizeExpansionForms: true });
        this._errors = xmlIcu.errors;
        const i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes,
            errors: this._errors,
        };
    }
    visitText(text, context) {
        return new Text$2(text.value, text.sourceSpan);
    }
    visitExpansion(icu, context) {
        const caseMap = {};
        visitAll(this, icu.cases).forEach(c => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    }
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const nameAttr = el.attrs.find((attr) => attr.name === 'name');
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "name" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    visitComment(comment, context) { }
    visitAttribute(attribute, context) { }
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A container for translated messages
 */
class TranslationBundle {
    constructor(_i18nNodesByMsgId = {}, locale, digest, mapperFactory, missingTranslationStrategy = MissingTranslationStrategy.Warning, console) {
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this._i18nToHtml = new I18nToHtmlVisitor(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console);
    }
    // Creates a `TranslationBundle` by parsing the given `content` with the `serializer`.
    static load(content, url, serializer, missingTranslationStrategy, console) {
        const { locale, i18nNodesByMsgId } = serializer.load(content, url);
        const digestFn = (m) => serializer.digest(m);
        const mapperFactory = (m) => serializer.createNameMapper(m);
        return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
    }
    // Returns the translation as HTML nodes from the given source message.
    get(srcMsg) {
        const html = this._i18nToHtml.convert(srcMsg);
        if (html.errors.length) {
            throw new Error(html.errors.join('\n'));
        }
        return html.nodes;
    }
    has(srcMsg) {
        return this.digest(srcMsg) in this._i18nNodesByMsgId;
    }
}
class I18nToHtmlVisitor {
    constructor(_i18nNodesByMsgId = {}, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this._locale = _locale;
        this._digest = _digest;
        this._mapperFactory = _mapperFactory;
        this._missingTranslationStrategy = _missingTranslationStrategy;
        this._console = _console;
        this._contextStack = [];
        this._errors = [];
    }
    convert(srcMsg) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        // i18n to text
        const text = this._convertToText(srcMsg);
        // text to html
        const url = srcMsg.nodes[0].sourceSpan.start.file.url;
        const html = new HtmlParser().parse(text, url, { tokenizeExpansionForms: true });
        return {
            nodes: html.rootNodes,
            errors: [...this._errors, ...html.errors],
        };
    }
    visitText(text, context) {
        // `convert()` uses an `HtmlParser` to return `html.Node`s
        // we should then make sure that any special characters are escaped
        return escapeXml(text.value);
    }
    visitContainer(container, context) {
        return container.children.map(n => n.visit(this)).join('');
    }
    visitIcu(icu, context) {
        const cases = Object.keys(icu.cases).map(k => `${k} {${icu.cases[k].visit(this)}}`);
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        const exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ?
            this._srcMsg.placeholders[icu.expression].text :
            icu.expression;
        return `{${exp}, ${icu.type}, ${cases.join(' ')}}`;
    }
    visitPlaceholder(ph, context) {
        const phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this._srcMsg.placeholders[phName].text;
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, `Unknown placeholder "${ph.name}"`);
        return '';
    }
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    visitTagPlaceholder(ph, context) {
        const tag = `${ph.tag}`;
        const attrs = Object.keys(ph.attrs).map(name => `${name}="${ph.attrs[name]}"`).join(' ');
        if (ph.isVoid) {
            return `<${tag} ${attrs}/>`;
        }
        const children = ph.children.map((c) => c.visit(this)).join('');
        return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    visitIcuPlaceholder(ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    }
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     */
    _convertToText(srcMsg) {
        const id = this._digest(srcMsg);
        const mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        let nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = (name) => mapper ? mapper.toInternalName(name) : name;
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                const ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._addError(srcMsg.nodes[0], `Missing translation for message "${id}"${ctx}`);
            }
            else if (this._console &&
                this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                const ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._console.warn(`Missing translation for message "${id}"${ctx}`);
            }
            nodes = srcMsg.nodes;
            this._mapper = (name) => name;
        }
        const text = nodes.map(node => node.visit(this)).join('');
        const context = this._contextStack.pop();
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    }
    _addError(el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class I18NHtmlParser {
    constructor(_htmlParser, translations, translationsFormat, missingTranslation = MissingTranslationStrategy.Warning, console) {
        this._htmlParser = _htmlParser;
        if (translations) {
            const serializer = createSerializer(translationsFormat);
            this._translationBundle =
                TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
        }
        else {
            this._translationBundle =
                new TranslationBundle({}, null, digest$1, undefined, missingTranslation, console);
        }
    }
    parse(source, url, options = {}) {
        const interpolationConfig = options.interpolationConfig || DEFAULT_INTERPOLATION_CONFIG;
        const parseResult = this._htmlParser.parse(source, url, { interpolationConfig, ...options });
        if (parseResult.errors.length) {
            return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
    }
}
function createSerializer(format) {
    format = (format || 'xlf').toLowerCase();
    switch (format) {
        case 'xmb':
            return new Xmb();
        case 'xtb':
            return new Xtb();
        case 'xliff2':
        case 'xlf2':
            return new Xliff2();
        case 'xliff':
        case 'xlf':
        default:
            return new Xliff();
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A container for message extracted from the templates.
 */
class MessageBundle {
    constructor(_htmlParser, _implicitTags, _implicitAttrs, _locale = null) {
        this._htmlParser = _htmlParser;
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
        this._locale = _locale;
        this._messages = [];
    }
    updateFromTemplate(html, url, interpolationConfig) {
        const htmlParserResult = this._htmlParser.parse(html, url, { tokenizeExpansionForms: true, interpolationConfig });
        if (htmlParserResult.errors.length) {
            return htmlParserResult.errors;
        }
        const i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
            return i18nParserResult.errors;
        }
        this._messages.push(...i18nParserResult.messages);
        return [];
    }
    // Return the message in the internal format
    // The public (serialized) format might be different, see the `write` method.
    getMessages() {
        return this._messages;
    }
    write(serializer, filterSources) {
        const messages = {};
        const mapperVisitor = new MapPlaceholderNames();
        // Deduplicate messages based on their ID
        this._messages.forEach(message => {
            const id = serializer.digest(message);
            if (!messages.hasOwnProperty(id)) {
                messages[id] = message;
            }
            else {
                messages[id].sources.push(...message.sources);
            }
        });
        // Transform placeholder names using the serializer mapping
        const msgList = Object.keys(messages).map(id => {
            const mapper = serializer.createNameMapper(messages[id]);
            const src = messages[id];
            const nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
            let transformedMessage = new Message(nodes, {}, {}, src.meaning, src.description, id);
            transformedMessage.sources = src.sources;
            if (filterSources) {
                transformedMessage.sources.forEach((source) => source.filePath = filterSources(source.filePath));
            }
            return transformedMessage;
        });
        return serializer.write(msgList, this._locale);
    }
}
// Transform an i18n AST by renaming the placeholder nodes with the given mapper
class MapPlaceholderNames extends CloneVisitor {
    convert(nodes, mapper) {
        return mapper ? nodes.map(n => n.visit(this, mapper)) : nodes;
    }
    visitTagPlaceholder(ph, mapper) {
        const startName = mapper.toPublicName(ph.startName);
        const closeName = ph.closeName ? mapper.toPublicName(ph.closeName) : ph.closeName;
        const children = ph.children.map(n => n.visit(this, mapper));
        return new TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan, ph.startSourceSpan, ph.endSourceSpan);
    }
    visitPlaceholder(ph, mapper) {
        return new Placeholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
    }
    visitIcuPlaceholder(ph, mapper) {
        return new IcuPlaceholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

var FactoryTarget;
(function (FactoryTarget) {
    FactoryTarget[FactoryTarget["Directive"] = 0] = "Directive";
    FactoryTarget[FactoryTarget["Component"] = 1] = "Component";
    FactoryTarget[FactoryTarget["Injectable"] = 2] = "Injectable";
    FactoryTarget[FactoryTarget["Pipe"] = 3] = "Pipe";
    FactoryTarget[FactoryTarget["NgModule"] = 4] = "NgModule";
})(FactoryTarget || (FactoryTarget = {}));

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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Processes `Target`s with a given set of directives and performs a binding operation, which
 * returns an object similar to TypeScript's `ts.TypeChecker` that contains knowledge about the
 * target.
 */
class R3TargetBinder {
    constructor(directiveMatcher) {
        this.directiveMatcher = directiveMatcher;
    }
    /**
     * Perform a binding operation on the given `Target` and return a `BoundTarget` which contains
     * metadata about the types referenced in the template.
     */
    bind(target) {
        if (!target.template) {
            // TODO(alxhub): handle targets which contain things like HostBindings, etc.
            throw new Error('Binding without a template not yet supported');
        }
        // First, parse the template into a `Scope` structure. This operation captures the syntactic
        // scopes in the template and makes them available for later use.
        const scope = Scope.apply(target.template);
        // Use the `Scope` to extract the entities present at every level of the template.
        const templateEntities = extractTemplateEntities(scope);
        // Next, perform directive matching on the template using the `DirectiveBinder`. This returns:
        //   - directives: Map of nodes (elements & ng-templates) to the directives on them.
        //   - bindings: Map of inputs, outputs, and attributes to the directive/element that claims
        //     them. TODO(alxhub): handle multiple directives claiming an input/output/etc.
        //   - references: Map of #references to their targets.
        const { directives, bindings, references } = DirectiveBinder.apply(target.template, this.directiveMatcher);
        // Finally, run the TemplateBinder to bind references, variables, and other entities within the
        // template. This extracts all the metadata that doesn't depend on directive matching.
        const { expressions, symbols, nestingLevel, usedPipes } = TemplateBinder.applyWithScope(target.template, scope);
        return new R3BoundTarget(target, directives, bindings, references, expressions, symbols, nestingLevel, templateEntities, usedPipes);
    }
}
/**
 * Represents a binding scope within a template.
 *
 * Any variables, references, or other named entities declared within the template will
 * be captured and available by name in `namedEntities`. Additionally, child templates will
 * be analyzed and have their child `Scope`s available in `childScopes`.
 */
class Scope {
    constructor(parentScope, template) {
        this.parentScope = parentScope;
        this.template = template;
        /**
         * Named members of the `Scope`, such as `Reference`s or `Variable`s.
         */
        this.namedEntities = new Map();
        /**
         * Child `Scope`s for immediately nested `Template`s.
         */
        this.childScopes = new Map();
    }
    static newRootScope() {
        return new Scope(null, null);
    }
    /**
     * Process a template (either as a `Template` sub-template with variables, or a plain array of
     * template `Node`s) and construct its `Scope`.
     */
    static apply(template) {
        const scope = Scope.newRootScope();
        scope.ingest(template);
        return scope;
    }
    /**
     * Internal method to process the template and populate the `Scope`.
     */
    ingest(template) {
        if (template instanceof Template) {
            // Variables on an <ng-template> are defined in the inner scope.
            template.variables.forEach(node => this.visitVariable(node));
            // Process the nodes of the template.
            template.children.forEach(node => node.visit(this));
        }
        else {
            // No overarching `Template` instance, so process the nodes directly.
            template.forEach(node => node.visit(this));
        }
    }
    visitElement(element) {
        // `Element`s in the template may have `Reference`s which are captured in the scope.
        element.references.forEach(node => this.visitReference(node));
        // Recurse into the `Element`'s children.
        element.children.forEach(node => node.visit(this));
    }
    visitTemplate(template) {
        // References on a <ng-template> are defined in the outer scope, so capture them before
        // processing the template's child scope.
        template.references.forEach(node => this.visitReference(node));
        // Next, create an inner scope and process the template within it.
        const scope = new Scope(this, template);
        scope.ingest(template);
        this.childScopes.set(template, scope);
    }
    visitVariable(variable) {
        // Declare the variable if it's not already.
        this.maybeDeclare(variable);
    }
    visitReference(reference) {
        // Declare the variable if it's not already.
        this.maybeDeclare(reference);
    }
    // Unused visitors.
    visitContent(content) { }
    visitBoundAttribute(attr) { }
    visitBoundEvent(event) { }
    visitBoundText(text) { }
    visitText(text) { }
    visitTextAttribute(attr) { }
    visitIcu(icu) { }
    maybeDeclare(thing) {
        // Declare something with a name, as long as that name isn't taken.
        if (!this.namedEntities.has(thing.name)) {
            this.namedEntities.set(thing.name, thing);
        }
    }
    /**
     * Look up a variable within this `Scope`.
     *
     * This can recurse into a parent `Scope` if it's available.
     */
    lookup(name) {
        if (this.namedEntities.has(name)) {
            // Found in the local scope.
            return this.namedEntities.get(name);
        }
        else if (this.parentScope !== null) {
            // Not in the local scope, but there's a parent scope so check there.
            return this.parentScope.lookup(name);
        }
        else {
            // At the top level and it wasn't found.
            return null;
        }
    }
    /**
     * Get the child scope for a `Template`.
     *
     * This should always be defined.
     */
    getChildScope(template) {
        const res = this.childScopes.get(template);
        if (res === undefined) {
            throw new Error(`Assertion error: child scope for ${template} not found`);
        }
        return res;
    }
}
/**
 * Processes a template and matches directives on nodes (elements and templates).
 *
 * Usually used via the static `apply()` method.
 */
class DirectiveBinder {
    constructor(matcher, directives, bindings, references) {
        this.matcher = matcher;
        this.directives = directives;
        this.bindings = bindings;
        this.references = references;
    }
    /**
     * Process a template (list of `Node`s) and perform directive matching against each node.
     *
     * @param template the list of template `Node`s to match (recursively).
     * @param selectorMatcher a `SelectorMatcher` containing the directives that are in scope for
     * this template.
     * @returns three maps which contain information about directives in the template: the
     * `directives` map which lists directives matched on each node, the `bindings` map which
     * indicates which directives claimed which bindings (inputs, outputs, etc), and the `references`
     * map which resolves #references (`Reference`s) within the template to the named directive or
     * template node.
     */
    static apply(template, selectorMatcher) {
        const directives = new Map();
        const bindings = new Map();
        const references = new Map();
        const matcher = new DirectiveBinder(selectorMatcher, directives, bindings, references);
        matcher.ingest(template);
        return { directives, bindings, references };
    }
    ingest(template) {
        template.forEach(node => node.visit(this));
    }
    visitElement(element) {
        this.visitElementOrTemplate(element.name, element);
    }
    visitTemplate(template) {
        this.visitElementOrTemplate('ng-template', template);
    }
    visitElementOrTemplate(elementName, node) {
        // First, determine the HTML shape of the node for the purpose of directive matching.
        // Do this by building up a `CssSelector` for the node.
        const cssSelector = createCssSelector(elementName, getAttrsForDirectiveMatching(node));
        // Next, use the `SelectorMatcher` to get the list of directives on the node.
        const directives = [];
        this.matcher.match(cssSelector, (_, directive) => directives.push(directive));
        if (directives.length > 0) {
            this.directives.set(node, directives);
        }
        // Resolve any references that are created on this node.
        node.references.forEach(ref => {
            let dirTarget = null;
            // If the reference expression is empty, then it matches the "primary" directive on the node
            // (if there is one). Otherwise it matches the host node itself (either an element or
            // <ng-template> node).
            if (ref.value.trim() === '') {
                // This could be a reference to a component if there is one.
                dirTarget = directives.find(dir => dir.isComponent) || null;
            }
            else {
                // This should be a reference to a directive exported via exportAs.
                dirTarget =
                    directives.find(dir => dir.exportAs !== null && dir.exportAs.some(value => value === ref.value)) ||
                        null;
                // Check if a matching directive was found.
                if (dirTarget === null) {
                    // No matching directive was found - this reference points to an unknown target. Leave it
                    // unmapped.
                    return;
                }
            }
            if (dirTarget !== null) {
                // This reference points to a directive.
                this.references.set(ref, { directive: dirTarget, node });
            }
            else {
                // This reference points to the node itself.
                this.references.set(ref, node);
            }
        });
        const setAttributeBinding = (attribute, ioType) => {
            const dir = directives.find(dir => dir[ioType].hasBindingPropertyName(attribute.name));
            const binding = dir !== undefined ? dir : node;
            this.bindings.set(attribute, binding);
        };
        // Node inputs (bound attributes) and text attributes can be bound to an
        // input on a directive.
        node.inputs.forEach(input => setAttributeBinding(input, 'inputs'));
        node.attributes.forEach(attr => setAttributeBinding(attr, 'inputs'));
        if (node instanceof Template) {
            node.templateAttrs.forEach(attr => setAttributeBinding(attr, 'inputs'));
        }
        // Node outputs (bound events) can be bound to an output on a directive.
        node.outputs.forEach(output => setAttributeBinding(output, 'outputs'));
        // Recurse into the node's children.
        node.children.forEach(child => child.visit(this));
    }
    // Unused visitors.
    visitContent(content) { }
    visitVariable(variable) { }
    visitReference(reference) { }
    visitTextAttribute(attribute) { }
    visitBoundAttribute(attribute) { }
    visitBoundEvent(attribute) { }
    visitBoundAttributeOrEvent(node) { }
    visitText(text) { }
    visitBoundText(text) { }
    visitIcu(icu) { }
}
/**
 * Processes a template and extract metadata about expressions and symbols within.
 *
 * This is a companion to the `DirectiveBinder` that doesn't require knowledge of directives matched
 * within the template in order to operate.
 *
 * Expressions are visited by the superclass `RecursiveAstVisitor`, with custom logic provided
 * by overridden methods from that visitor.
 */
class TemplateBinder extends RecursiveAstVisitor {
    constructor(bindings, symbols, usedPipes, nestingLevel, scope, template, level) {
        super();
        this.bindings = bindings;
        this.symbols = symbols;
        this.usedPipes = usedPipes;
        this.nestingLevel = nestingLevel;
        this.scope = scope;
        this.template = template;
        this.level = level;
        this.pipesUsed = [];
        // Save a bit of processing time by constructing this closure in advance.
        this.visitNode = (node) => node.visit(this);
    }
    // This method is defined to reconcile the type of TemplateBinder since both
    // RecursiveAstVisitor and Visitor define the visit() method in their
    // interfaces.
    visit(node, context) {
        if (node instanceof AST) {
            node.visit(this, context);
        }
        else {
            node.visit(this);
        }
    }
    /**
     * Process a template and extract metadata about expressions and symbols within.
     *
     * @param template the nodes of the template to process
     * @param scope the `Scope` of the template being processed.
     * @returns three maps which contain metadata about the template: `expressions` which interprets
     * special `AST` nodes in expressions as pointing to references or variables declared within the
     * template, `symbols` which maps those variables and references to the nested `Template` which
     * declares them, if any, and `nestingLevel` which associates each `Template` with a integer
     * nesting level (how many levels deep within the template structure the `Template` is), starting
     * at 1.
     */
    static applyWithScope(template, scope) {
        const expressions = new Map();
        const symbols = new Map();
        const nestingLevel = new Map();
        const usedPipes = new Set();
        // The top-level template has nesting level 0.
        const binder = new TemplateBinder(expressions, symbols, usedPipes, nestingLevel, scope, template instanceof Template ? template : null, 0);
        binder.ingest(template);
        return { expressions, symbols, nestingLevel, usedPipes };
    }
    ingest(template) {
        if (template instanceof Template) {
            // For <ng-template>s, process only variables and child nodes. Inputs, outputs, templateAttrs,
            // and references were all processed in the scope of the containing template.
            template.variables.forEach(this.visitNode);
            template.children.forEach(this.visitNode);
            // Set the nesting level.
            this.nestingLevel.set(template, this.level);
        }
        else {
            // Visit each node from the top-level template.
            template.forEach(this.visitNode);
        }
    }
    visitElement(element) {
        // Visit the inputs, outputs, and children of the element.
        element.inputs.forEach(this.visitNode);
        element.outputs.forEach(this.visitNode);
        element.children.forEach(this.visitNode);
    }
    visitTemplate(template) {
        // First, visit inputs, outputs and template attributes of the template node.
        template.inputs.forEach(this.visitNode);
        template.outputs.forEach(this.visitNode);
        template.templateAttrs.forEach(this.visitNode);
        // References are also evaluated in the outer context.
        template.references.forEach(this.visitNode);
        // Next, recurse into the template using its scope, and bumping the nesting level up by one.
        const childScope = this.scope.getChildScope(template);
        const binder = new TemplateBinder(this.bindings, this.symbols, this.usedPipes, this.nestingLevel, childScope, template, this.level + 1);
        binder.ingest(template);
    }
    visitVariable(variable) {
        // Register the `Variable` as a symbol in the current `Template`.
        if (this.template !== null) {
            this.symbols.set(variable, this.template);
        }
    }
    visitReference(reference) {
        // Register the `Reference` as a symbol in the current `Template`.
        if (this.template !== null) {
            this.symbols.set(reference, this.template);
        }
    }
    // Unused template visitors
    visitText(text) { }
    visitContent(content) { }
    visitTextAttribute(attribute) { }
    visitIcu(icu) {
        Object.keys(icu.vars).forEach(key => icu.vars[key].visit(this));
        Object.keys(icu.placeholders).forEach(key => icu.placeholders[key].visit(this));
    }
    // The remaining visitors are concerned with processing AST expressions within template bindings
    visitBoundAttribute(attribute) {
        attribute.value.visit(this);
    }
    visitBoundEvent(event) {
        event.handler.visit(this);
    }
    visitBoundText(text) {
        text.value.visit(this);
    }
    visitPipe(ast, context) {
        this.usedPipes.add(ast.name);
        return super.visitPipe(ast, context);
    }
    // These five types of AST expressions can refer to expression roots, which could be variables
    // or references in the current scope.
    visitPropertyRead(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitPropertyRead(ast, context);
    }
    visitSafePropertyRead(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitSafePropertyRead(ast, context);
    }
    visitPropertyWrite(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitPropertyWrite(ast, context);
    }
    maybeMap(scope, ast, name) {
        // If the receiver of the expression isn't the `ImplicitReceiver`, this isn't the root of an
        // `AST` expression that maps to a `Variable` or `Reference`.
        if (!(ast.receiver instanceof ImplicitReceiver)) {
            return;
        }
        // Check whether the name exists in the current scope. If so, map it. Otherwise, the name is
        // probably a property on the top-level component context.
        let target = this.scope.lookup(name);
        if (target !== null) {
            this.bindings.set(ast, target);
        }
    }
}
/**
 * Metadata container for a `Target` that allows queries for specific bits of metadata.
 *
 * See `BoundTarget` for documentation on the individual methods.
 */
class R3BoundTarget {
    constructor(target, directives, bindings, references, exprTargets, symbols, nestingLevel, templateEntities, usedPipes) {
        this.target = target;
        this.directives = directives;
        this.bindings = bindings;
        this.references = references;
        this.exprTargets = exprTargets;
        this.symbols = symbols;
        this.nestingLevel = nestingLevel;
        this.templateEntities = templateEntities;
        this.usedPipes = usedPipes;
    }
    getEntitiesInTemplateScope(template) {
        return this.templateEntities.get(template) ?? new Set();
    }
    getDirectivesOfNode(node) {
        return this.directives.get(node) || null;
    }
    getReferenceTarget(ref) {
        return this.references.get(ref) || null;
    }
    getConsumerOfBinding(binding) {
        return this.bindings.get(binding) || null;
    }
    getExpressionTarget(expr) {
        return this.exprTargets.get(expr) || null;
    }
    getTemplateOfSymbol(symbol) {
        return this.symbols.get(symbol) || null;
    }
    getNestingLevel(template) {
        return this.nestingLevel.get(template) || 0;
    }
    getUsedDirectives() {
        const set = new Set();
        this.directives.forEach(dirs => dirs.forEach(dir => set.add(dir)));
        return Array.from(set.values());
    }
    getUsedPipes() {
        return Array.from(this.usedPipes);
    }
}
function extractTemplateEntities(rootScope) {
    const entityMap = new Map();
    function extractScopeEntities(scope) {
        if (entityMap.has(scope.template)) {
            return entityMap.get(scope.template);
        }
        const currentEntities = scope.namedEntities;
        let templateEntities;
        if (scope.parentScope !== null) {
            templateEntities = new Map([...extractScopeEntities(scope.parentScope), ...currentEntities]);
        }
        else {
            templateEntities = new Map(currentEntities);
        }
        entityMap.set(scope.template, templateEntities);
        return templateEntities;
    }
    const scopesToProcess = [rootScope];
    while (scopesToProcess.length > 0) {
        const scope = scopesToProcess.pop();
        for (const childScope of scope.childScopes.values()) {
            scopesToProcess.push(childScope);
        }
        extractScopeEntities(scope);
    }
    const templateEntities = new Map();
    for (const [template, entities] of entityMap) {
        templateEntities.set(template, new Set(entities.values()));
    }
    return templateEntities;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function compileClassMetadata(metadata) {
    // Generate an ngDevMode guarded call to setClassMetadata with the class identifier and its
    // metadata.
    const fnCall = importExpr(Identifiers.setClassMetadata).callFn([
        metadata.type,
        metadata.decorators,
        metadata.ctorParameters ?? literal(null),
        metadata.propDecorators ?? literal(null),
    ]);
    const iife = fn([], [devOnlyGuardedExpression(fnCall).toStmt()]);
    return iife.callFn([]);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$6 = '12.0.0';
function compileDeclareClassMetadata(metadata) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$6));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    definitionMap.set('type', metadata.type);
    definitionMap.set('decorators', metadata.decorators);
    definitionMap.set('ctorParameters', metadata.ctorParameters);
    definitionMap.set('propDecorators', metadata.propDecorators);
    return importExpr(Identifiers.declareClassMetadata).callFn([definitionMap.toLiteralMap()]);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates an array literal expression from the given array, mapping all values to an expression
 * using the provided mapping function. If the array is empty or null, then null is returned.
 *
 * @param values The array to transfer into literal array expression.
 * @param mapper The logic to use for creating an expression for the array's values.
 * @returns An array literal expression representing `values`, or null if `values` is empty or
 * is itself null.
 */
function toOptionalLiteralArray(values, mapper) {
    if (values === null || values.length === 0) {
        return null;
    }
    return literalArr(values.map(value => mapper(value)));
}
/**
 * Creates an object literal expression from the given object, mapping all values to an expression
 * using the provided mapping function. If the object has no keys, then null is returned.
 *
 * @param object The object to transfer into an object literal expression.
 * @param mapper The logic to use for creating an expression for the object's values.
 * @returns An object literal expression representing `object`, or null if `object` does not have
 * any keys.
 */
function toOptionalLiteralMap(object, mapper) {
    const entries = Object.keys(object).map(key => {
        const value = object[key];
        return { key, value: mapper(value), quoted: true };
    });
    if (entries.length > 0) {
        return literalMap(entries);
    }
    else {
        return null;
    }
}
function compileDependencies(deps) {
    if (deps === 'invalid') {
        // The `deps` can be set to the string "invalid"  by the `unwrapConstructorDependencies()`
        // function, which tries to convert `ConstructorDeps` into `R3DependencyMetadata[]`.
        return literal('invalid');
    }
    else if (deps === null) {
        return literal(null);
    }
    else {
        return literalArr(deps.map(compileDependency));
    }
}
function compileDependency(dep) {
    const depMeta = new DefinitionMap();
    depMeta.set('token', dep.token);
    if (dep.attributeNameType !== null) {
        depMeta.set('attribute', literal(true));
    }
    if (dep.host) {
        depMeta.set('host', literal(true));
    }
    if (dep.optional) {
        depMeta.set('optional', literal(true));
    }
    if (dep.self) {
        depMeta.set('self', literal(true));
    }
    if (dep.skipSelf) {
        depMeta.set('skipSelf', literal(true));
    }
    return depMeta.toLiteralMap();
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$5 = '12.0.0';
/**
 * Compile a directive declaration defined by the `R3DirectiveMetadata`.
 */
function compileDeclareDirectiveFromMetadata(meta) {
    const definitionMap = createDirectiveDefinitionMap(meta);
    const expression = importExpr(Identifiers.declareDirective).callFn([definitionMap.toLiteralMap()]);
    const type = createDirectiveType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for a directive into a `DefinitionMap`. This allows for reusing
 * this logic for components, as they extend the directive metadata.
 */
function createDirectiveDefinitionMap(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$5));
    definitionMap.set('version', literal('13.3.10'));
    // e.g. `type: MyDirective`
    definitionMap.set('type', meta.internalType);
    // e.g. `selector: 'some-dir'`
    if (meta.selector !== null) {
        definitionMap.set('selector', literal(meta.selector));
    }
    definitionMap.set('inputs', conditionallyCreateMapObjectLiteral(meta.inputs, true));
    definitionMap.set('outputs', conditionallyCreateMapObjectLiteral(meta.outputs));
    definitionMap.set('host', compileHostMetadata(meta.host));
    definitionMap.set('providers', meta.providers);
    if (meta.queries.length > 0) {
        definitionMap.set('queries', literalArr(meta.queries.map(compileQuery)));
    }
    if (meta.viewQueries.length > 0) {
        definitionMap.set('viewQueries', literalArr(meta.viewQueries.map(compileQuery)));
    }
    if (meta.exportAs !== null) {
        definitionMap.set('exportAs', asLiteral(meta.exportAs));
    }
    if (meta.usesInheritance) {
        definitionMap.set('usesInheritance', literal(true));
    }
    if (meta.lifecycle.usesOnChanges) {
        definitionMap.set('usesOnChanges', literal(true));
    }
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    return definitionMap;
}
/**
 * Compiles the metadata of a single query into its partial declaration form as declared
 * by `R3DeclareQueryMetadata`.
 */
function compileQuery(query) {
    const meta = new DefinitionMap();
    meta.set('propertyName', literal(query.propertyName));
    if (query.first) {
        meta.set('first', literal(true));
    }
    meta.set('predicate', Array.isArray(query.predicate) ? asLiteral(query.predicate) :
        convertFromMaybeForwardRefExpression(query.predicate));
    if (!query.emitDistinctChangesOnly) {
        // `emitDistinctChangesOnly` is special because we expect it to be `true`.
        // Therefore we explicitly emit the field, and explicitly place it only when it's `false`.
        meta.set('emitDistinctChangesOnly', literal(false));
    }
    else {
        // The linker will assume that an absent `emitDistinctChangesOnly` flag is by default `true`.
    }
    if (query.descendants) {
        meta.set('descendants', literal(true));
    }
    meta.set('read', query.read);
    if (query.static) {
        meta.set('static', literal(true));
    }
    return meta.toLiteralMap();
}
/**
 * Compiles the host metadata into its partial declaration form as declared
 * in `R3DeclareDirectiveMetadata['host']`
 */
function compileHostMetadata(meta) {
    const hostMetadata = new DefinitionMap();
    hostMetadata.set('attributes', toOptionalLiteralMap(meta.attributes, expression => expression));
    hostMetadata.set('listeners', toOptionalLiteralMap(meta.listeners, literal));
    hostMetadata.set('properties', toOptionalLiteralMap(meta.properties, literal));
    if (meta.specialAttributes.styleAttr) {
        hostMetadata.set('styleAttribute', literal(meta.specialAttributes.styleAttr));
    }
    if (meta.specialAttributes.classAttr) {
        hostMetadata.set('classAttribute', literal(meta.specialAttributes.classAttr));
    }
    if (hostMetadata.values.length > 0) {
        return hostMetadata.toLiteralMap();
    }
    else {
        return null;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Compile a component declaration defined by the `R3ComponentMetadata`.
 */
function compileDeclareComponentFromMetadata(meta, template, additionalTemplateInfo) {
    const definitionMap = createComponentDefinitionMap(meta, template, additionalTemplateInfo);
    const expression = importExpr(Identifiers.declareComponent).callFn([definitionMap.toLiteralMap()]);
    const type = createComponentType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for a component into a `DefinitionMap`.
 */
function createComponentDefinitionMap(meta, template, templateInfo) {
    const definitionMap = createDirectiveDefinitionMap(meta);
    definitionMap.set('template', getTemplateExpression(template, templateInfo));
    if (templateInfo.isInline) {
        definitionMap.set('isInline', literal(true));
    }
    definitionMap.set('styles', toOptionalLiteralArray(meta.styles, literal));
    definitionMap.set('components', compileUsedDirectiveMetadata(meta, directive => directive.isComponent === true));
    definitionMap.set('directives', compileUsedDirectiveMetadata(meta, directive => directive.isComponent !== true));
    definitionMap.set('pipes', compileUsedPipeMetadata(meta));
    definitionMap.set('viewProviders', meta.viewProviders);
    definitionMap.set('animations', meta.animations);
    if (meta.changeDetection !== undefined) {
        definitionMap.set('changeDetection', importExpr(Identifiers.ChangeDetectionStrategy)
            .prop(ChangeDetectionStrategy[meta.changeDetection]));
    }
    if (meta.encapsulation !== ViewEncapsulation.Emulated) {
        definitionMap.set('encapsulation', importExpr(Identifiers.ViewEncapsulation).prop(ViewEncapsulation[meta.encapsulation]));
    }
    if (meta.interpolation !== DEFAULT_INTERPOLATION_CONFIG) {
        definitionMap.set('interpolation', literalArr([literal(meta.interpolation.start), literal(meta.interpolation.end)]));
    }
    if (template.preserveWhitespaces === true) {
        definitionMap.set('preserveWhitespaces', literal(true));
    }
    return definitionMap;
}
function getTemplateExpression(template, templateInfo) {
    // If the template has been defined using a direct literal, we use that expression directly
    // without any modifications. This is ensures proper source mapping from the partially
    // compiled code to the source file declaring the template. Note that this does not capture
    // template literals referenced indirectly through an identifier.
    if (templateInfo.inlineTemplateLiteralExpression !== null) {
        return templateInfo.inlineTemplateLiteralExpression;
    }
    // If the template is defined inline but not through a literal, the template has been resolved
    // through static interpretation. We create a literal but cannot provide any source span. Note
    // that we cannot use the expression defining the template because the linker expects the template
    // to be defined as a literal in the declaration.
    if (templateInfo.isInline) {
        return literal(templateInfo.content, null, null);
    }
    // The template is external so we must synthesize an expression node with
    // the appropriate source-span.
    const contents = templateInfo.content;
    const file = new ParseSourceFile(contents, templateInfo.sourceUrl);
    const start = new ParseLocation(file, 0, 0, 0);
    const end = computeEndLocation(file, contents);
    const span = new ParseSourceSpan(start, end);
    return literal(contents, null, span);
}
function computeEndLocation(file, contents) {
    const length = contents.length;
    let lineStart = 0;
    let lastLineStart = 0;
    let line = 0;
    do {
        lineStart = contents.indexOf('\n', lastLineStart);
        if (lineStart !== -1) {
            lastLineStart = lineStart + 1;
            line++;
        }
    } while (lineStart !== -1);
    return new ParseLocation(file, length, line, length - lastLineStart);
}
/**
 * Compiles the directives as registered in the component metadata into an array literal of the
 * individual directives. If the component does not use any directives, then null is returned.
 */
function compileUsedDirectiveMetadata(meta, predicate) {
    const wrapType = meta.declarationListEmitMode !== 0 /* Direct */ ?
        generateForwardRef :
        (expr) => expr;
    const directives = meta.directives.filter(predicate);
    return toOptionalLiteralArray(directives, directive => {
        const dirMeta = new DefinitionMap();
        dirMeta.set('type', wrapType(directive.type));
        dirMeta.set('selector', literal(directive.selector));
        dirMeta.set('inputs', toOptionalLiteralArray(directive.inputs, literal));
        dirMeta.set('outputs', toOptionalLiteralArray(directive.outputs, literal));
        dirMeta.set('exportAs', toOptionalLiteralArray(directive.exportAs, literal));
        return dirMeta.toLiteralMap();
    });
}
/**
 * Compiles the pipes as registered in the component metadata into an object literal, where the
 * pipe's name is used as key and a reference to its type as value. If the component does not use
 * any pipes, then null is returned.
 */
function compileUsedPipeMetadata(meta) {
    if (meta.pipes.size === 0) {
        return null;
    }
    const wrapType = meta.declarationListEmitMode !== 0 /* Direct */ ?
        generateForwardRef :
        (expr) => expr;
    const entries = [];
    for (const [name, pipe] of meta.pipes) {
        entries.push({ key: name, value: wrapType(pipe), quoted: true });
    }
    return literalMap(entries);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$4 = '12.0.0';
function compileDeclareFactoryFunction(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$4));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    definitionMap.set('type', meta.internalType);
    definitionMap.set('deps', compileDependencies(meta.deps));
    definitionMap.set('target', importExpr(Identifiers.FactoryTarget).prop(FactoryTarget$1[meta.target]));
    return {
        expression: importExpr(Identifiers.declareFactory).callFn([definitionMap.toLiteralMap()]),
        statements: [],
        type: createFactoryType(meta),
    };
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$3 = '12.0.0';
/**
 * Compile a Injectable declaration defined by the `R3InjectableMetadata`.
 */
function compileDeclareInjectableFromMetadata(meta) {
    const definitionMap = createInjectableDefinitionMap(meta);
    const expression = importExpr(Identifiers.declareInjectable).callFn([definitionMap.toLiteralMap()]);
    const type = createInjectableType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for a Injectable into a `DefinitionMap`.
 */
function createInjectableDefinitionMap(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$3));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    definitionMap.set('type', meta.internalType);
    // Only generate providedIn property if it has a non-null value
    if (meta.providedIn !== undefined) {
        const providedIn = convertFromMaybeForwardRefExpression(meta.providedIn);
        if (providedIn.value !== null) {
            definitionMap.set('providedIn', providedIn);
        }
    }
    if (meta.useClass !== undefined) {
        definitionMap.set('useClass', convertFromMaybeForwardRefExpression(meta.useClass));
    }
    if (meta.useExisting !== undefined) {
        definitionMap.set('useExisting', convertFromMaybeForwardRefExpression(meta.useExisting));
    }
    if (meta.useValue !== undefined) {
        definitionMap.set('useValue', convertFromMaybeForwardRefExpression(meta.useValue));
    }
    // Factories do not contain `ForwardRef`s since any types are already wrapped in a function call
    // so the types will not be eagerly evaluated. Therefore we do not need to process this expression
    // with `convertFromProviderExpression()`.
    if (meta.useFactory !== undefined) {
        definitionMap.set('useFactory', meta.useFactory);
    }
    if (meta.deps !== undefined) {
        definitionMap.set('deps', literalArr(meta.deps.map(compileDependency)));
    }
    return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$2 = '12.0.0';
function compileDeclareInjectorFromMetadata(meta) {
    const definitionMap = createInjectorDefinitionMap(meta);
    const expression = importExpr(Identifiers.declareInjector).callFn([definitionMap.toLiteralMap()]);
    const type = createInjectorType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for an Injector into a `DefinitionMap`.
 */
function createInjectorDefinitionMap(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$2));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    definitionMap.set('type', meta.internalType);
    definitionMap.set('providers', meta.providers);
    if (meta.imports.length > 0) {
        definitionMap.set('imports', literalArr(meta.imports));
    }
    return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION$1 = '12.0.0';
function compileDeclareNgModuleFromMetadata(meta) {
    const definitionMap = createNgModuleDefinitionMap(meta);
    const expression = importExpr(Identifiers.declareNgModule).callFn([definitionMap.toLiteralMap()]);
    const type = createNgModuleType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for an NgModule into a `DefinitionMap`.
 */
function createNgModuleDefinitionMap(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION$1));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    definitionMap.set('type', meta.internalType);
    // We only generate the keys in the metadata if the arrays contain values.
    // We must wrap the arrays inside a function if any of the values are a forward reference to a
    // not-yet-declared class. This is to support JIT execution of the `ɵɵngDeclareNgModule()` call.
    // In the linker these wrappers are stripped and then reapplied for the `ɵɵdefineNgModule()` call.
    if (meta.bootstrap.length > 0) {
        definitionMap.set('bootstrap', refsToArray(meta.bootstrap, meta.containsForwardDecls));
    }
    if (meta.declarations.length > 0) {
        definitionMap.set('declarations', refsToArray(meta.declarations, meta.containsForwardDecls));
    }
    if (meta.imports.length > 0) {
        definitionMap.set('imports', refsToArray(meta.imports, meta.containsForwardDecls));
    }
    if (meta.exports.length > 0) {
        definitionMap.set('exports', refsToArray(meta.exports, meta.containsForwardDecls));
    }
    if (meta.schemas !== null && meta.schemas.length > 0) {
        definitionMap.set('schemas', literalArr(meta.schemas.map(ref => ref.value)));
    }
    if (meta.id !== null) {
        definitionMap.set('id', meta.id);
    }
    return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * Do not include any prerelease in these versions as they are ignored.
 */
const MINIMUM_PARTIAL_LINKER_VERSION = '12.0.0';
/**
 * Compile a Pipe declaration defined by the `R3PipeMetadata`.
 */
function compileDeclarePipeFromMetadata(meta) {
    const definitionMap = createPipeDefinitionMap(meta);
    const expression = importExpr(Identifiers.declarePipe).callFn([definitionMap.toLiteralMap()]);
    const type = createPipeType(meta);
    return { expression, type, statements: [] };
}
/**
 * Gathers the declaration fields for a Pipe into a `DefinitionMap`.
 */
function createPipeDefinitionMap(meta) {
    const definitionMap = new DefinitionMap();
    definitionMap.set('minVersion', literal(MINIMUM_PARTIAL_LINKER_VERSION));
    definitionMap.set('version', literal('13.3.10'));
    definitionMap.set('ngImport', importExpr(Identifiers.core));
    // e.g. `type: MyPipe`
    definitionMap.set('type', meta.internalType);
    // e.g. `name: "myPipe"`
    definitionMap.set('name', literal(meta.pipeName));
    if (meta.pure === false) {
        // e.g. `pure: false`
        definitionMap.set('pure', literal(meta.pure));
    }
    return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file only reexports content of the `src` folder. Keep it that way.
// This function call has a global side effects and publishes the compiler into global namespace for
// the late binding of the Compiler to the @angular/core for jit compilation.
publishFacade(_global);

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file only reexports content of the `src` folder. Keep it that way.

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

export { AST, ASTWithName, ASTWithSource, AbsoluteSourceSpan, ArrayType, AstMemoryEfficientTransformer, AstTransformer, Attribute, Binary, BinaryOperator, BinaryOperatorExpr, BindingPipe, BoundElementProperty, BuiltinType, BuiltinTypeName, CUSTOM_ELEMENTS_SCHEMA, Call, Chain, ChangeDetectionStrategy, CommaExpr, Comment, CompilerConfig, Conditional, ConditionalExpr, ConstantPool, CssSelector, DEFAULT_INTERPOLATION_CONFIG, DYNAMIC_TYPE, DeclareFunctionStmt, DeclareVarStmt, DomElementSchemaRegistry, EOF, Element, ElementSchemaRegistry, EmitterVisitorContext, EmptyExpr, Expansion, ExpansionCase, Expression, ExpressionBinding, ExpressionStatement, ExpressionType, ExternalExpr, ExternalReference, FactoryTarget$1 as FactoryTarget, FunctionExpr, HtmlParser, HtmlTagDefinition, I18NHtmlParser, IfStmt, ImplicitReceiver, InstantiateExpr, Interpolation, InterpolationConfig, InvokeFunctionExpr, JSDocComment, JitEvaluator, KeyedRead, KeyedWrite, LeadingComment, Lexer, LiteralArray, LiteralArrayExpr, LiteralExpr, LiteralMap, LiteralMapExpr, LiteralPrimitive, LocalizedString, MapType, MessageBundle, NONE_TYPE, NO_ERRORS_SCHEMA, NodeWithI18n, NonNullAssert, NotExpr, ParseError, ParseErrorLevel, ParseLocation, ParseSourceFile, ParseSourceSpan, ParseSpan, ParseTreeResult, ParsedEvent, ParsedProperty, ParsedPropertyType, ParsedVariable, Parser$1 as Parser, ParserError, PrefixNot, PropertyRead, PropertyWrite, Quote, R3BoundTarget, Identifiers as R3Identifiers, R3TargetBinder, ReadKeyExpr, ReadPropExpr, ReadVarExpr, RecursiveAstVisitor, RecursiveVisitor, ResourceLoader, ReturnStatement, STRING_TYPE, SafeCall, SafeKeyedRead, SafePropertyRead, SelectorContext, SelectorListContext, SelectorMatcher, Serializer, SplitInterpolation, Statement, StmtModifier, TagContentType, TaggedTemplateExpr, TemplateBindingParseResult, TemplateLiteral, TemplateLiteralElement, Text, ThisReceiver, BoundAttribute as TmplAstBoundAttribute, BoundEvent as TmplAstBoundEvent, BoundText as TmplAstBoundText, Content as TmplAstContent, Element$1 as TmplAstElement, Icu$1 as TmplAstIcu, RecursiveVisitor$1 as TmplAstRecursiveVisitor, Reference as TmplAstReference, Template as TmplAstTemplate, Text$3 as TmplAstText, TextAttribute as TmplAstTextAttribute, Variable as TmplAstVariable, Token, TokenType, TreeError, Type, TypeModifier, TypeofExpr, Unary, UnaryOperator, UnaryOperatorExpr, VERSION, VariableBinding, Version, ViewEncapsulation, WrappedNodeExpr, WriteKeyExpr, WritePropExpr, WriteVarExpr, Xliff, Xliff2, Xmb, XmlParser, Xtb, _ParseAST, compileClassMetadata, compileComponentFromMetadata, compileDeclareClassMetadata, compileDeclareComponentFromMetadata, compileDeclareDirectiveFromMetadata, compileDeclareFactoryFunction, compileDeclareInjectableFromMetadata, compileDeclareInjectorFromMetadata, compileDeclareNgModuleFromMetadata, compileDeclarePipeFromMetadata, compileDirectiveFromMetadata, compileFactoryFunction, compileInjectable, compileInjector, compileNgModule, compilePipeFromMetadata, computeMsgId, core, createInjectableType, createMayBeForwardRefExpression, devOnlyGuardedExpression, emitDistinctChangesOnlyDefaultValue, getHtmlTagDefinition, getNsPrefix, getSafePropertyAccessString, identifierName, isIdentifier, isNgContainer, isNgContent, isNgTemplate, jsDocComment, leadingComment, literalMap, makeBindingParser, mergeNsAndName, output_ast as outputAst, parseHostBindings, parseTemplate, preserveWhitespacesDefault, publishFacade, r3JitTypeSourceSpan, sanitizeIdentifier, splitNsName, verifyHostBindings, visitAll };
//# sourceMappingURL=compiler.mjs.map
