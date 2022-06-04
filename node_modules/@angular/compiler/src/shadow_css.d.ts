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
export declare class ShadowCss {
    strictStyling: boolean;
    shimCssText(cssText: string, selector: string, hostSelector?: string): string;
    private _insertDirectives;
    private _insertPolyfillDirectivesInCssText;
    private _insertPolyfillRulesInCssText;
    private _scopeCssText;
    private _extractUnscopedRulesFromCssText;
    private _convertColonHost;
    private _convertColonHostContext;
    private _convertShadowDOMSelectors;
    private _scopeSelectors;
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
    private _stripScopingSelectors;
    private _scopeSelector;
    private _selectorNeedsScoping;
    private _makeScopeMatcher;
    private _applySelectorScope;
    private _applySimpleSelectorScope;
    private _insertPolyfillHostInCssText;
}
export declare class CssRule {
    selector: string;
    content: string;
    constructor(selector: string, content: string);
}
export declare function processRules(input: string, ruleCallback: (rule: CssRule) => CssRule): string;
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
export declare function repeatGroups(groups: string[][], multiples: number): void;
