/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { parallel } from './change-detection';
/**
 * Base class for component harnesses that all component harness authors should extend. This base
 * component harness provides the basic ability to locate element and sub-component harness. It
 * should be inherited when defining user's own harness.
 */
export class ComponentHarness {
    constructor(locatorFactory) {
        this.locatorFactory = locatorFactory;
    }
    /** Gets a `Promise` for the `TestElement` representing the host element of the component. */
    async host() {
        return this.locatorFactory.rootElement;
    }
    /**
     * Gets a `LocatorFactory` for the document root element. This factory can be used to create
     * locators for elements that a component creates outside of its own root element. (e.g. by
     * appending to document.body).
     */
    documentRootLocatorFactory() {
        return this.locatorFactory.documentRootLocatorFactory();
    }
    /**
     * Creates an asynchronous locator function that can be used to find a `ComponentHarness` instance
     * or element under the host element of this `ComponentHarness`.
     * @param queries A list of queries specifying which harnesses and elements to search for:
     *   - A `string` searches for elements matching the CSS selector specified by the string.
     *   - A `ComponentHarness` constructor searches for `ComponentHarness` instances matching the
     *     given class.
     *   - A `HarnessPredicate` searches for `ComponentHarness` instances matching the given
     *     predicate.
     * @return An asynchronous locator function that searches for and returns a `Promise` for the
     *   first element or harness matching the given search criteria. Matches are ordered first by
     *   order in the DOM, and second by order in the queries list. If no matches are found, the
     *   `Promise` rejects. The type that the `Promise` resolves to is a union of all result types for
     *   each query.
     *
     * e.g. Given the following DOM: `<div id="d1" /><div id="d2" />`, and assuming
     * `DivHarness.hostSelector === 'div'`:
     * - `await ch.locatorFor(DivHarness, 'div')()` gets a `DivHarness` instance for `#d1`
     * - `await ch.locatorFor('div', DivHarness)()` gets a `TestElement` instance for `#d1`
     * - `await ch.locatorFor('span')()` throws because the `Promise` rejects.
     */
    locatorFor(...queries) {
        return this.locatorFactory.locatorFor(...queries);
    }
    /**
     * Creates an asynchronous locator function that can be used to find a `ComponentHarness` instance
     * or element under the host element of this `ComponentHarness`.
     * @param queries A list of queries specifying which harnesses and elements to search for:
     *   - A `string` searches for elements matching the CSS selector specified by the string.
     *   - A `ComponentHarness` constructor searches for `ComponentHarness` instances matching the
     *     given class.
     *   - A `HarnessPredicate` searches for `ComponentHarness` instances matching the given
     *     predicate.
     * @return An asynchronous locator function that searches for and returns a `Promise` for the
     *   first element or harness matching the given search criteria. Matches are ordered first by
     *   order in the DOM, and second by order in the queries list. If no matches are found, the
     *   `Promise` is resolved with `null`. The type that the `Promise` resolves to is a union of all
     *   result types for each query or null.
     *
     * e.g. Given the following DOM: `<div id="d1" /><div id="d2" />`, and assuming
     * `DivHarness.hostSelector === 'div'`:
     * - `await ch.locatorForOptional(DivHarness, 'div')()` gets a `DivHarness` instance for `#d1`
     * - `await ch.locatorForOptional('div', DivHarness)()` gets a `TestElement` instance for `#d1`
     * - `await ch.locatorForOptional('span')()` gets `null`.
     */
    locatorForOptional(...queries) {
        return this.locatorFactory.locatorForOptional(...queries);
    }
    /**
     * Creates an asynchronous locator function that can be used to find `ComponentHarness` instances
     * or elements under the host element of this `ComponentHarness`.
     * @param queries A list of queries specifying which harnesses and elements to search for:
     *   - A `string` searches for elements matching the CSS selector specified by the string.
     *   - A `ComponentHarness` constructor searches for `ComponentHarness` instances matching the
     *     given class.
     *   - A `HarnessPredicate` searches for `ComponentHarness` instances matching the given
     *     predicate.
     * @return An asynchronous locator function that searches for and returns a `Promise` for all
     *   elements and harnesses matching the given search criteria. Matches are ordered first by
     *   order in the DOM, and second by order in the queries list. If an element matches more than
     *   one `ComponentHarness` class, the locator gets an instance of each for the same element. If
     *   an element matches multiple `string` selectors, only one `TestElement` instance is returned
     *   for that element. The type that the `Promise` resolves to is an array where each element is
     *   the union of all result types for each query.
     *
     * e.g. Given the following DOM: `<div id="d1" /><div id="d2" />`, and assuming
     * `DivHarness.hostSelector === 'div'` and `IdIsD1Harness.hostSelector === '#d1'`:
     * - `await ch.locatorForAll(DivHarness, 'div')()` gets `[
     *     DivHarness, // for #d1
     *     TestElement, // for #d1
     *     DivHarness, // for #d2
     *     TestElement // for #d2
     *   ]`
     * - `await ch.locatorForAll('div', '#d1')()` gets `[
     *     TestElement, // for #d1
     *     TestElement // for #d2
     *   ]`
     * - `await ch.locatorForAll(DivHarness, IdIsD1Harness)()` gets `[
     *     DivHarness, // for #d1
     *     IdIsD1Harness, // for #d1
     *     DivHarness // for #d2
     *   ]`
     * - `await ch.locatorForAll('span')()` gets `[]`.
     */
    locatorForAll(...queries) {
        return this.locatorFactory.locatorForAll(...queries);
    }
    /**
     * Flushes change detection and async tasks in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        return this.locatorFactory.forceStabilize();
    }
    /**
     * Waits for all scheduled or running async tasks to complete. This allows harness
     * authors to wait for async tasks outside of the Angular zone.
     */
    async waitForTasksOutsideAngular() {
        return this.locatorFactory.waitForTasksOutsideAngular();
    }
}
/**
 * Base class for component harnesses that authors should extend if they anticipate that consumers
 * of the harness may want to access other harnesses within the `<ng-content>` of the component.
 */
export class ContentContainerComponentHarness extends ComponentHarness {
    async getChildLoader(selector) {
        return (await this.getRootHarnessLoader()).getChildLoader(selector);
    }
    async getAllChildLoaders(selector) {
        return (await this.getRootHarnessLoader()).getAllChildLoaders(selector);
    }
    async getHarness(query) {
        return (await this.getRootHarnessLoader()).getHarness(query);
    }
    async getAllHarnesses(query) {
        return (await this.getRootHarnessLoader()).getAllHarnesses(query);
    }
    /**
     * Gets the root harness loader from which to start
     * searching for content contained by this harness.
     */
    async getRootHarnessLoader() {
        return this.locatorFactory.rootHarnessLoader();
    }
}
/**
 * A class used to associate a ComponentHarness class with predicates functions that can be used to
 * filter instances of the class.
 */
export class HarnessPredicate {
    constructor(harnessType, options) {
        this.harnessType = harnessType;
        this._predicates = [];
        this._descriptions = [];
        this._addBaseOptions(options);
    }
    /**
     * Checks if the specified nullable string value matches the given pattern.
     * @param value The nullable string value to check, or a Promise resolving to the
     *   nullable string value.
     * @param pattern The pattern the value is expected to match. If `pattern` is a string,
     *   `value` is expected to match exactly. If `pattern` is a regex, a partial match is
     *   allowed. If `pattern` is `null`, the value is expected to be `null`.
     * @return Whether the value matches the pattern.
     */
    static async stringMatches(value, pattern) {
        value = await value;
        if (pattern === null) {
            return value === null;
        }
        else if (value === null) {
            return false;
        }
        return typeof pattern === 'string' ? value === pattern : pattern.test(value);
    }
    /**
     * Adds a predicate function to be run against candidate harnesses.
     * @param description A description of this predicate that may be used in error messages.
     * @param predicate An async predicate function.
     * @return this (for method chaining).
     */
    add(description, predicate) {
        this._descriptions.push(description);
        this._predicates.push(predicate);
        return this;
    }
    /**
     * Adds a predicate function that depends on an option value to be run against candidate
     * harnesses. If the option value is undefined, the predicate will be ignored.
     * @param name The name of the option (may be used in error messages).
     * @param option The option value.
     * @param predicate The predicate function to run if the option value is not undefined.
     * @return this (for method chaining).
     */
    addOption(name, option, predicate) {
        if (option !== undefined) {
            this.add(`${name} = ${_valueAsString(option)}`, item => predicate(item, option));
        }
        return this;
    }
    /**
     * Filters a list of harnesses on this predicate.
     * @param harnesses The list of harnesses to filter.
     * @return A list of harnesses that satisfy this predicate.
     */
    async filter(harnesses) {
        if (harnesses.length === 0) {
            return [];
        }
        const results = await parallel(() => harnesses.map(h => this.evaluate(h)));
        return harnesses.filter((_, i) => results[i]);
    }
    /**
     * Evaluates whether the given harness satisfies this predicate.
     * @param harness The harness to check
     * @return A promise that resolves to true if the harness satisfies this predicate,
     *   and resolves to false otherwise.
     */
    async evaluate(harness) {
        const results = await parallel(() => this._predicates.map(p => p(harness)));
        return results.reduce((combined, current) => combined && current, true);
    }
    /** Gets a description of this predicate for use in error messages. */
    getDescription() {
        return this._descriptions.join(', ');
    }
    /** Gets the selector used to find candidate elements. */
    getSelector() {
        // We don't have to go through the extra trouble if there are no ancestors.
        if (!this._ancestor) {
            return (this.harnessType.hostSelector || '').trim();
        }
        const [ancestors, ancestorPlaceholders] = _splitAndEscapeSelector(this._ancestor);
        const [selectors, selectorPlaceholders] = _splitAndEscapeSelector(this.harnessType.hostSelector || '');
        const result = [];
        // We have to add the ancestor to each part of the host compound selector, otherwise we can get
        // incorrect results. E.g. `.ancestor .a, .ancestor .b` vs `.ancestor .a, .b`.
        ancestors.forEach(escapedAncestor => {
            const ancestor = _restoreSelector(escapedAncestor, ancestorPlaceholders);
            return selectors.forEach(escapedSelector => result.push(`${ancestor} ${_restoreSelector(escapedSelector, selectorPlaceholders)}`));
        });
        return result.join(', ');
    }
    /** Adds base options common to all harness types. */
    _addBaseOptions(options) {
        this._ancestor = options.ancestor || '';
        if (this._ancestor) {
            this._descriptions.push(`has ancestor matching selector "${this._ancestor}"`);
        }
        const selector = options.selector;
        if (selector !== undefined) {
            this.add(`host matches selector "${selector}"`, async (item) => {
                return (await item.host()).matchesSelector(selector);
            });
        }
    }
}
/** Represent a value as a string for the purpose of logging. */
function _valueAsString(value) {
    if (value === undefined) {
        return 'undefined';
    }
    try {
        // `JSON.stringify` doesn't handle RegExp properly, so we need a custom replacer.
        // Use a character that is unlikely to appear in real strings to denote the start and end of
        // the regex. This allows us to strip out the extra quotes around the value added by
        // `JSON.stringify`. Also do custom escaping on `"` characters to prevent `JSON.stringify`
        // from escaping them as if they were part of a string.
        const stringifiedValue = JSON.stringify(value, (_, v) => v instanceof RegExp
            ? `◬MAT_RE_ESCAPE◬${v.toString().replace(/"/g, '◬MAT_RE_ESCAPE◬')}◬MAT_RE_ESCAPE◬`
            : v);
        // Strip out the extra quotes around regexes and put back the manually escaped `"` characters.
        return stringifiedValue
            .replace(/"◬MAT_RE_ESCAPE◬|◬MAT_RE_ESCAPE◬"/g, '')
            .replace(/◬MAT_RE_ESCAPE◬/g, '"');
    }
    catch {
        // `JSON.stringify` will throw if the object is cyclical,
        // in this case the best we can do is report the value as `{...}`.
        return '{...}';
    }
}
/**
 * Splits up a compound selector into its parts and escapes any quoted content. The quoted content
 * has to be escaped, because it can contain commas which will throw throw us off when trying to
 * split it.
 * @param selector Selector to be split.
 * @returns The escaped string where any quoted content is replaced with a placeholder. E.g.
 * `[foo="bar"]` turns into `[foo=__cdkPlaceholder-0__]`. Use `_restoreSelector` to restore
 * the placeholders.
 */
function _splitAndEscapeSelector(selector) {
    const placeholders = [];
    // Note that the regex doesn't account for nested quotes so something like `"ab'cd'e"` will be
    // considered as two blocks. It's a bit of an edge case, but if we find that it's a problem,
    // we can make it a bit smarter using a loop. Use this for now since it's more readable and
    // compact. More complete implementation:
    // https://github.com/angular/angular/blob/bd34bc9e89f18a/packages/compiler/src/shadow_css.ts#L655
    const result = selector.replace(/(["'][^["']*["'])/g, (_, keep) => {
        const replaceBy = `__cdkPlaceholder-${placeholders.length}__`;
        placeholders.push(keep);
        return replaceBy;
    });
    return [result.split(',').map(part => part.trim()), placeholders];
}
/** Restores a selector whose content was escaped in `_splitAndEscapeSelector`. */
function _restoreSelector(selector, placeholders) {
    return selector.replace(/__cdkPlaceholder-(\d+)__/g, (_, index) => placeholders[+index]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3Rlc3RpbmcvY29tcG9uZW50LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBaVA1Qzs7OztHQUlHO0FBQ0gsTUFBTSxPQUFnQixnQkFBZ0I7SUFDcEMsWUFBK0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO0lBQUcsQ0FBQztJQUVqRSw2RkFBNkY7SUFDN0YsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sMEJBQTBCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDTyxVQUFVLENBQ2xCLEdBQUcsT0FBVTtRQUViLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JHO0lBQ08sa0JBQWtCLENBQzFCLEdBQUcsT0FBVTtRQUViLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQ0c7SUFDTyxhQUFhLENBQ3JCLEdBQUcsT0FBVTtRQUViLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxj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b0JBQW9CLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQztRQUM5RCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUVELGtGQUFrRjtBQUNsRixTQUFTLGdCQUFnQixDQUFDLFFBQWdCLEVBQUUsWUFBc0I7SUFDaEUsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyYWxsZWx9IGZyb20gJy4vY2hhbmdlLWRldGVjdGlvbic7XG5pbXBvcnQge1Rlc3RFbGVtZW50fSBmcm9tICcuL3Rlc3QtZWxlbWVudCc7XG5cbi8qKiBBbiBhc3luYyBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHdoZW4gY2FsbGVkLiAqL1xuZXhwb3J0IHR5cGUgQXN5bmNGYWN0b3J5Rm48VD4gPSAoKSA9PiBQcm9taXNlPFQ+O1xuXG4vKiogQW4gYXN5bmMgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBpdGVtIGFuZCByZXR1cm5zIGEgYm9vbGVhbiBwcm9taXNlICovXG5leHBvcnQgdHlwZSBBc3luY1ByZWRpY2F0ZTxUPiA9IChpdGVtOiBUKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG4vKiogQW4gYXN5bmMgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBpdGVtIGFuZCBhbiBvcHRpb24gdmFsdWUgYW5kIHJldHVybnMgYSBib29sZWFuIHByb21pc2UuICovXG5leHBvcnQgdHlwZSBBc3luY09wdGlvblByZWRpY2F0ZTxULCBPPiA9IChpdGVtOiBULCBvcHRpb246IE8pID0+IFByb21pc2U8Ym9vbGVhbj47XG5cbi8qKlxuICogQSBxdWVyeSBmb3IgYSBgQ29tcG9uZW50SGFybmVzc2AsIHdoaWNoIGlzIGV4cHJlc3NlZCBhcyBlaXRoZXIgYSBgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yYCBvclxuICogYSBgSGFybmVzc1ByZWRpY2F0ZWAuXG4gKi9cbmV4cG9ydCB0eXBlIEhhcm5lc3NRdWVyeTxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4gPVxuICB8IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPlxuICB8IEhhcm5lc3NQcmVkaWNhdGU8VD47XG5cbi8qKlxuICogVGhlIHJlc3VsdCB0eXBlIG9idGFpbmVkIHdoZW4gc2VhcmNoaW5nIHVzaW5nIGEgcGFydGljdWxhciBsaXN0IG9mIHF1ZXJpZXMuIFRoaXMgdHlwZSBkZXBlbmRzIG9uXG4gKiB0aGUgcGFydGljdWxhciBpdGVtcyBiZWluZyBxdWVyaWVkLlxuICogLSBJZiBvbmUgb2YgdGhlIHF1ZXJpZXMgaXMgZm9yIGEgYENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxDMT5gLCBpdCBtZWFucyB0aGF0IHRoZSByZXN1bHRcbiAqICAgbWlnaHQgYmUgYSBoYXJuZXNzIG9mIHR5cGUgYEMxYFxuICogLSBJZiBvbmUgb2YgdGhlIHF1ZXJpZXMgaXMgZm9yIGEgYEhhcm5lc3NQcmVkaWNhdGU8QzI+YCwgaXQgbWVhbnMgdGhhdCB0aGUgcmVzdWx0IG1pZ2h0IGJlIGFcbiAqICAgaGFybmVzcyBvZiB0eXBlIGBDMmBcbiAqIC0gSWYgb25lIG9mIHRoZSBxdWVyaWVzIGlzIGZvciBhIGBzdHJpbmdgLCBpdCBtZWFucyB0aGF0IHRoZSByZXN1bHQgbWlnaHQgYmUgYSBgVGVzdEVsZW1lbnRgLlxuICpcbiAqIFNpbmNlIHdlIGRvbid0IGtub3cgZm9yIHN1cmUgd2hpY2ggcXVlcnkgd2lsbCBtYXRjaCwgdGhlIHJlc3VsdCB0eXBlIGlmIHRoZSB1bmlvbiBvZiB0aGUgdHlwZXNcbiAqIGZvciBhbGwgcG9zc2libGUgcmVzdWx0cy5cbiAqXG4gKiBlLmcuXG4gKiBUaGUgdHlwZTpcbiAqIGBMb2NhdG9yRm5SZXN1bHQmbHQ7W1xuICogICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3ImbHQ7TXlIYXJuZXNzJmd0OyxcbiAqICAgSGFybmVzc1ByZWRpY2F0ZSZsdDtNeU90aGVySGFybmVzcyZndDssXG4gKiAgIHN0cmluZ1xuICogXSZndDtgXG4gKiBpcyBlcXVpdmFsZW50IHRvOlxuICogYE15SGFybmVzcyB8IE15T3RoZXJIYXJuZXNzIHwgVGVzdEVsZW1lbnRgLlxuICovXG5leHBvcnQgdHlwZSBMb2NhdG9yRm5SZXN1bHQ8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4gPSB7XG4gIFtJIGluIGtleW9mIFRdOiBUW0ldIGV4dGVuZHMgbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gaW5mZXIgQyAvLyBNYXAgYENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxDPmAgdG8gYENgLlxuICAgID8gQ1xuICAgIDogLy8gTWFwIGBIYXJuZXNzUHJlZGljYXRlPEM+YCB0byBgQ2AuXG4gICAgVFtJXSBleHRlbmRzIHtoYXJuZXNzVHlwZTogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gaW5mZXIgQ31cbiAgICA/IENcbiAgICA6IC8vIE1hcCBgc3RyaW5nYCB0byBgVGVzdEVsZW1lbnRgLlxuICAgIFRbSV0gZXh0ZW5kcyBzdHJpbmdcbiAgICA/IFRlc3RFbGVtZW50XG4gICAgOiAvLyBNYXAgZXZlcnl0aGluZyBlbHNlIHRvIGBuZXZlcmAgKHNob3VsZCBub3QgaGFwcGVuIGR1ZSB0byB0aGUgdHlwZSBjb25zdHJhaW50IG9uIGBUYCkuXG4gICAgICBuZXZlcjtcbn1bbnVtYmVyXTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgdXNlZCB0byBsb2FkIENvbXBvbmVudEhhcm5lc3Mgb2JqZWN0cy4gVGhpcyBpbnRlcmZhY2UgaXMgdXNlZCBieSB0ZXN0IGF1dGhvcnMgdG9cbiAqIGluc3RhbnRpYXRlIGBDb21wb25lbnRIYXJuZXNzYGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhhcm5lc3NMb2FkZXIge1xuICAvKipcbiAgICogU2VhcmNoZXMgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4gc2VsZWN0b3IgdW5kZXIgdGhlIGN1cnJlbnQgaW5zdGFuY2VzJ3Mgcm9vdCBlbGVtZW50LFxuICAgKiBhbmQgcmV0dXJucyBhIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIG1hdGNoaW5nIGVsZW1lbnQuIElmIG11bHRpcGxlIGVsZW1lbnRzIG1hdGNoIHRoZVxuICAgKiBzZWxlY3RvciwgdGhlIGZpcnN0IGlzIHVzZWQuIElmIG5vIGVsZW1lbnRzIG1hdGNoLCBhbiBlcnJvciBpcyB0aHJvd24uXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgZm9yIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIG5ldyBgSGFybmVzc0xvYWRlcmBcbiAgICogQHJldHVybiBBIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiBAdGhyb3dzIElmIGEgbWF0Y2hpbmcgZWxlbWVudCBjYW4ndCBiZSBmb3VuZC5cbiAgICovXG4gIGdldENoaWxkTG9hZGVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+O1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyBmb3IgYWxsIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIHNlbGVjdG9yIHVuZGVyIHRoZSBjdXJyZW50IGluc3RhbmNlcydzIHJvb3QgZWxlbWVudCxcbiAgICogYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgYEhhcm5lc3NMb2FkZXJgcywgb25lIGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQsIHJvb3RlZCBhdCB0aGF0XG4gICAqIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgZm9yIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIG5ldyBgSGFybmVzc0xvYWRlcmBcbiAgICogQHJldHVybiBBIGxpc3Qgb2YgYEhhcm5lc3NMb2FkZXJgcywgb25lIGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQsIHJvb3RlZCBhdCB0aGF0IGVsZW1lbnQuXG4gICAqL1xuICBnZXRBbGxDaGlsZExvYWRlcnMoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8SGFybmVzc0xvYWRlcltdPjtcblxuICAvKipcbiAgICogU2VhcmNoZXMgZm9yIGFuIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gaGFybmVzcyB0eXBlIHVuZGVyIHRoZVxuICAgKiBgSGFybmVzc0xvYWRlcmAncyByb290IGVsZW1lbnQsIGFuZCByZXR1cm5zIGEgYENvbXBvbmVudEhhcm5lc3NgIGZvciB0aGF0IGluc3RhbmNlLiBJZiBtdWx0aXBsZVxuICAgKiBtYXRjaGluZyBjb21wb25lbnRzIGFyZSBmb3VuZCwgYSBoYXJuZXNzIGZvciB0aGUgZmlyc3Qgb25lIGlzIHJldHVybmVkLiBJZiBubyBtYXRjaGluZ1xuICAgKiBjb21wb25lbnQgaXMgZm91bmQsIGFuIGVycm9yIGlzIHRocm93bi5cbiAgICogQHBhcmFtIHF1ZXJ5IEEgcXVlcnkgZm9yIGEgaGFybmVzcyB0byBjcmVhdGVcbiAgICogQHJldHVybiBBbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gaGFybmVzcyB0eXBlXG4gICAqIEB0aHJvd3MgSWYgYSBtYXRjaGluZyBjb21wb25lbnQgaW5zdGFuY2UgY2FuJ3QgYmUgZm91bmQuXG4gICAqL1xuICBnZXRIYXJuZXNzPFQgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzPihxdWVyeTogSGFybmVzc1F1ZXJ5PFQ+KTogUHJvbWlzZTxUPjtcblxuICAvKipcbiAgICogU2VhcmNoZXMgZm9yIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNvbXBvbmVudCBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBoYXJuZXNzIHR5cGUgdW5kZXIgdGhlXG4gICAqIGBIYXJuZXNzTG9hZGVyYCdzIHJvb3QgZWxlbWVudCwgYW5kIHJldHVybnMgYSBsaXN0IGBDb21wb25lbnRIYXJuZXNzYCBmb3IgZWFjaCBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHF1ZXJ5IEEgcXVlcnkgZm9yIGEgaGFybmVzcyB0byBjcmVhdGVcbiAgICogQHJldHVybiBBIGxpc3QgaW5zdGFuY2VzIG9mIHRoZSBnaXZlbiBoYXJuZXNzIHR5cGUuXG4gICAqL1xuICBnZXRBbGxIYXJuZXNzZXM8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KHF1ZXJ5OiBIYXJuZXNzUXVlcnk8VD4pOiBQcm9taXNlPFRbXT47XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHVzZWQgdG8gY3JlYXRlIGFzeW5jaHJvbm91cyBsb2NhdG9yIGZ1bmN0aW9ucyB1c2VkIGZpbmQgZWxlbWVudHMgYW5kIGNvbXBvbmVudFxuICogaGFybmVzc2VzLiBUaGlzIGludGVyZmFjZSBpcyB1c2VkIGJ5IGBDb21wb25lbnRIYXJuZXNzYCBhdXRob3JzIHRvIGNyZWF0ZSBsb2NhdG9yIGZ1bmN0aW9ucyBmb3JcbiAqIHRoZWlyIGBDb21wb25lbnRIYXJuZXNzYCBzdWJjbGFzcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhdG9yRmFjdG9yeSB7XG4gIC8qKiBHZXRzIGEgbG9jYXRvciBmYWN0b3J5IHJvb3RlZCBhdCB0aGUgZG9jdW1lbnQgcm9vdC4gKi9cbiAgZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTogTG9jYXRvckZhY3Rvcnk7XG5cbiAgLyoqIFRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBgTG9jYXRvckZhY3RvcnlgIGFzIGEgYFRlc3RFbGVtZW50YC4gKi9cbiAgcm9vdEVsZW1lbnQ6IFRlc3RFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFzeW5jaHJvbm91cyBsb2NhdG9yIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmluZCBhIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZVxuICAgKiBvciBlbGVtZW50IHVuZGVyIHRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBgTG9jYXRvckZhY3RvcnlgLlxuICAgKiBAcGFyYW0gcXVlcmllcyBBIGxpc3Qgb2YgcXVlcmllcyBzcGVjaWZ5aW5nIHdoaWNoIGhhcm5lc3NlcyBhbmQgZWxlbWVudHMgdG8gc2VhcmNoIGZvcjpcbiAgICogICAtIEEgYHN0cmluZ2Agc2VhcmNoZXMgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBDU1Mgc2VsZWN0b3Igc3BlY2lmaWVkIGJ5IHRoZSBzdHJpbmcuXG4gICAqICAgLSBBIGBDb21wb25lbnRIYXJuZXNzYCBjb25zdHJ1Y3RvciBzZWFyY2hlcyBmb3IgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlcyBtYXRjaGluZyB0aGVcbiAgICogICAgIGdpdmVuIGNsYXNzLlxuICAgKiAgIC0gQSBgSGFybmVzc1ByZWRpY2F0ZWAgc2VhcmNoZXMgZm9yIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuXG4gICAqICAgICBwcmVkaWNhdGUuXG4gICAqIEByZXR1cm4gQW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBzZWFyY2hlcyBmb3IgYW5kIHJldHVybnMgYSBgUHJvbWlzZWAgZm9yIHRoZVxuICAgKiAgIGZpcnN0IGVsZW1lbnQgb3IgaGFybmVzcyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VhcmNoIGNyaXRlcmlhLiBNYXRjaGVzIGFyZSBvcmRlcmVkIGZpcnN0IGJ5XG4gICAqICAgb3JkZXIgaW4gdGhlIERPTSwgYW5kIHNlY29uZCBieSBvcmRlciBpbiB0aGUgcXVlcmllcyBsaXN0LiBJZiBubyBtYXRjaGVzIGFyZSBmb3VuZCwgdGhlXG4gICAqICAgYFByb21pc2VgIHJlamVjdHMuIFRoZSB0eXBlIHRoYXQgdGhlIGBQcm9taXNlYCByZXNvbHZlcyB0byBpcyBhIHVuaW9uIG9mIGFsbCByZXN1bHQgdHlwZXMgZm9yXG4gICAqICAgZWFjaCBxdWVyeS5cbiAgICpcbiAgICogZS5nLiBHaXZlbiB0aGUgZm9sbG93aW5nIERPTTogYDxkaXYgaWQ9XCJkMVwiIC8+PGRpdiBpZD1cImQyXCIgLz5gLCBhbmQgYXNzdW1pbmdcbiAgICogYERpdkhhcm5lc3MuaG9zdFNlbGVjdG9yID09PSAnZGl2J2A6XG4gICAqIC0gYGF3YWl0IGxmLmxvY2F0b3JGb3IoRGl2SGFybmVzcywgJ2RpdicpKClgIGdldHMgYSBgRGl2SGFybmVzc2AgaW5zdGFuY2UgZm9yIGAjZDFgXG4gICAqIC0gYGF3YWl0IGxmLmxvY2F0b3JGb3IoJ2RpdicsIERpdkhhcm5lc3MpKClgIGdldHMgYSBgVGVzdEVsZW1lbnRgIGluc3RhbmNlIGZvciBgI2QxYFxuICAgKiAtIGBhd2FpdCBsZi5sb2NhdG9yRm9yKCdzcGFuJykoKWAgdGhyb3dzIGJlY2F1c2UgdGhlIGBQcm9taXNlYCByZWplY3RzLlxuICAgKi9cbiAgbG9jYXRvckZvcjxUIGV4dGVuZHMgKEhhcm5lc3NRdWVyeTxhbnk+IHwgc3RyaW5nKVtdPihcbiAgICAuLi5xdWVyaWVzOiBUXG4gICk6IEFzeW5jRmFjdG9yeUZuPExvY2F0b3JGblJlc3VsdDxUPj47XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaW5kIGEgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlXG4gICAqIG9yIGVsZW1lbnQgdW5kZXIgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGlzIGBMb2NhdG9yRmFjdG9yeWAuXG4gICAqIEBwYXJhbSBxdWVyaWVzIEEgbGlzdCBvZiBxdWVyaWVzIHNwZWNpZnlpbmcgd2hpY2ggaGFybmVzc2VzIGFuZCBlbGVtZW50cyB0byBzZWFyY2ggZm9yOlxuICAgKiAgIC0gQSBgc3RyaW5nYCBzZWFyY2hlcyBmb3IgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIENTUyBzZWxlY3RvciBzcGVjaWZpZWQgYnkgdGhlIHN0cmluZy5cbiAgICogICAtIEEgYENvbXBvbmVudEhhcm5lc3NgIGNvbnN0cnVjdG9yIHNlYXJjaGVzIGZvciBgQ29tcG9uZW50SGFybmVzc2AgaW5zdGFuY2VzIG1hdGNoaW5nIHRoZVxuICAgKiAgICAgZ2l2ZW4gY2xhc3MuXG4gICAqICAgLSBBIGBIYXJuZXNzUHJlZGljYXRlYCBzZWFyY2hlcyBmb3IgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlcyBtYXRjaGluZyB0aGUgZ2l2ZW5cbiAgICogICAgIHByZWRpY2F0ZS5cbiAgICogQHJldHVybiBBbiBhc3luY2hyb25vdXMgbG9jYXRvciBmdW5jdGlvbiB0aGF0IHNlYXJjaGVzIGZvciBhbmQgcmV0dXJucyBhIGBQcm9taXNlYCBmb3IgdGhlXG4gICAqICAgZmlyc3QgZWxlbWVudCBvciBoYXJuZXNzIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWFyY2ggY3JpdGVyaWEuIE1hdGNoZXMgYXJlIG9yZGVyZWQgZmlyc3QgYnlcbiAgICogICBvcmRlciBpbiB0aGUgRE9NLCBhbmQgc2Vjb25kIGJ5IG9yZGVyIGluIHRoZSBxdWVyaWVzIGxpc3QuIElmIG5vIG1hdGNoZXMgYXJlIGZvdW5kLCB0aGVcbiAgICogICBgUHJvbWlzZWAgaXMgcmVzb2x2ZWQgd2l0aCBgbnVsbGAuIFRoZSB0eXBlIHRoYXQgdGhlIGBQcm9taXNlYCByZXNvbHZlcyB0byBpcyBhIHVuaW9uIG9mIGFsbFxuICAgKiAgIHJlc3VsdCB0eXBlcyBmb3IgZWFjaCBxdWVyeSBvciBudWxsLlxuICAgKlxuICAgKiBlLmcuIEdpdmVuIHRoZSBmb2xsb3dpbmcgRE9NOiBgPGRpdiBpZD1cImQxXCIgLz48ZGl2IGlkPVwiZDJcIiAvPmAsIGFuZCBhc3N1bWluZ1xuICAgKiBgRGl2SGFybmVzcy5ob3N0U2VsZWN0b3IgPT09ICdkaXYnYDpcbiAgICogLSBgYXdhaXQgbGYubG9jYXRvckZvck9wdGlvbmFsKERpdkhhcm5lc3MsICdkaXYnKSgpYCBnZXRzIGEgYERpdkhhcm5lc3NgIGluc3RhbmNlIGZvciBgI2QxYFxuICAgKiAtIGBhd2FpdCBsZi5sb2NhdG9yRm9yT3B0aW9uYWwoJ2RpdicsIERpdkhhcm5lc3MpKClgIGdldHMgYSBgVGVzdEVsZW1lbnRgIGluc3RhbmNlIGZvciBgI2QxYFxuICAgKiAtIGBhd2FpdCBsZi5sb2NhdG9yRm9yT3B0aW9uYWwoJ3NwYW4nKSgpYCBnZXRzIGBudWxsYC5cbiAgICovXG4gIGxvY2F0b3JGb3JPcHRpb25hbDxUIGV4dGVuZHMgKEhhcm5lc3NRdWVyeTxhbnk+IHwgc3RyaW5nKVtdPihcbiAgICAuLi5xdWVyaWVzOiBUXG4gICk6IEFzeW5jRmFjdG9yeUZuPExvY2F0b3JGblJlc3VsdDxUPiB8IG51bGw+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFzeW5jaHJvbm91cyBsb2NhdG9yIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmluZCBgQ29tcG9uZW50SGFybmVzc2AgaW5zdGFuY2VzXG4gICAqIG9yIGVsZW1lbnRzIHVuZGVyIHRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBgTG9jYXRvckZhY3RvcnlgLlxuICAgKiBAcGFyYW0gcXVlcmllcyBBIGxpc3Qgb2YgcXVlcmllcyBzcGVjaWZ5aW5nIHdoaWNoIGhhcm5lc3NlcyBhbmQgZWxlbWVudHMgdG8gc2VhcmNoIGZvcjpcbiAgICogICAtIEEgYHN0cmluZ2Agc2VhcmNoZXMgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBDU1Mgc2VsZWN0b3Igc3BlY2lmaWVkIGJ5IHRoZSBzdHJpbmcuXG4gICAqICAgLSBBIGBDb21wb25lbnRIYXJuZXNzYCBjb25zdHJ1Y3RvciBzZWFyY2hlcyBmb3IgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlcyBtYXRjaGluZyB0aGVcbiAgICogICAgIGdpdmVuIGNsYXNzLlxuICAgKiAgIC0gQSBgSGFybmVzc1ByZWRpY2F0ZWAgc2VhcmNoZXMgZm9yIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuXG4gICAqICAgICBwcmVkaWNhdGUuXG4gICAqIEByZXR1cm4gQW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBzZWFyY2hlcyBmb3IgYW5kIHJldHVybnMgYSBgUHJvbWlzZWAgZm9yIGFsbFxuICAgKiAgIGVsZW1lbnRzIGFuZCBoYXJuZXNzZXMgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlYXJjaCBjcml0ZXJpYS4gTWF0Y2hlcyBhcmUgb3JkZXJlZCBmaXJzdCBieVxuICAgKiAgIG9yZGVyIGluIHRoZSBET00sIGFuZCBzZWNvbmQgYnkgb3JkZXIgaW4gdGhlIHF1ZXJpZXMgbGlzdC4gSWYgYW4gZWxlbWVudCBtYXRjaGVzIG1vcmUgdGhhblxuICAgKiAgIG9uZSBgQ29tcG9uZW50SGFybmVzc2AgY2xhc3MsIHRoZSBsb2NhdG9yIGdldHMgYW4gaW5zdGFuY2Ugb2YgZWFjaCBmb3IgdGhlIHNhbWUgZWxlbWVudC4gSWZcbiAgICogICBhbiBlbGVtZW50IG1hdGNoZXMgbXVsdGlwbGUgYHN0cmluZ2Agc2VsZWN0b3JzLCBvbmx5IG9uZSBgVGVzdEVsZW1lbnRgIGluc3RhbmNlIGlzIHJldHVybmVkXG4gICAqICAgZm9yIHRoYXQgZWxlbWVudC4gVGhlIHR5cGUgdGhhdCB0aGUgYFByb21pc2VgIHJlc29sdmVzIHRvIGlzIGFuIGFycmF5IHdoZXJlIGVhY2ggZWxlbWVudCBpc1xuICAgKiAgIHRoZSB1bmlvbiBvZiBhbGwgcmVzdWx0IHR5cGVzIGZvciBlYWNoIHF1ZXJ5LlxuICAgKlxuICAgKiBlLmcuIEdpdmVuIHRoZSBmb2xsb3dpbmcgRE9NOiBgPGRpdiBpZD1cImQxXCIgLz48ZGl2IGlkPVwiZDJcIiAvPmAsIGFuZCBhc3N1bWluZ1xuICAgKiBgRGl2SGFybmVzcy5ob3N0U2VsZWN0b3IgPT09ICdkaXYnYCBhbmQgYElkSXNEMUhhcm5lc3MuaG9zdFNlbGVjdG9yID09PSAnI2QxJ2A6XG4gICAqIC0gYGF3YWl0IGxmLmxvY2F0b3JGb3JBbGwoRGl2SGFybmVzcywgJ2RpdicpKClgIGdldHMgYFtcbiAgICogICAgIERpdkhhcm5lc3MsIC8vIGZvciAjZDFcbiAgICogICAgIFRlc3RFbGVtZW50LCAvLyBmb3IgI2QxXG4gICAqICAgICBEaXZIYXJuZXNzLCAvLyBmb3IgI2QyXG4gICAqICAgICBUZXN0RWxlbWVudCAvLyBmb3IgI2QyXG4gICAqICAgXWBcbiAgICogLSBgYXdhaXQgbGYubG9jYXRvckZvckFsbCgnZGl2JywgJyNkMScpKClgIGdldHMgYFtcbiAgICogICAgIFRlc3RFbGVtZW50LCAvLyBmb3IgI2QxXG4gICAqICAgICBUZXN0RWxlbWVudCAvLyBmb3IgI2QyXG4gICAqICAgXWBcbiAgICogLSBgYXdhaXQgbGYubG9jYXRvckZvckFsbChEaXZIYXJuZXNzLCBJZElzRDFIYXJuZXNzKSgpYCBnZXRzIGBbXG4gICAqICAgICBEaXZIYXJuZXNzLCAvLyBmb3IgI2QxXG4gICAqICAgICBJZElzRDFIYXJuZXNzLCAvLyBmb3IgI2QxXG4gICAqICAgICBEaXZIYXJuZXNzIC8vIGZvciAjZDJcbiAgICogICBdYFxuICAgKiAtIGBhd2FpdCBsZi5sb2NhdG9yRm9yQWxsKCdzcGFuJykoKWAgZ2V0cyBgW11gLlxuICAgKi9cbiAgbG9jYXRvckZvckFsbDxUIGV4dGVuZHMgKEhhcm5lc3NRdWVyeTxhbnk+IHwgc3RyaW5nKVtdPihcbiAgICAuLi5xdWVyaWVzOiBUXG4gICk6IEFzeW5jRmFjdG9yeUZuPExvY2F0b3JGblJlc3VsdDxUPltdPjtcblxuICAvKiogQHJldHVybiBBIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGlzIGBMb2NhdG9yRmFjdG9yeWAuICovXG4gIHJvb3RIYXJuZXNzTG9hZGVyKCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj47XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc0xvYWRlcmAgaW5zdGFuY2UgZm9yIGFuIGVsZW1lbnQgdW5kZXIgdGhlIHJvb3Qgb2YgdGhpcyBgTG9jYXRvckZhY3RvcnlgLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgVGhlIHNlbGVjdG9yIGZvciB0aGUgcm9vdCBlbGVtZW50LlxuICAgKiBAcmV0dXJuIEEgYEhhcm5lc3NMb2FkZXJgIHJvb3RlZCBhdCB0aGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqIEB0aHJvd3MgSWYgbm8gbWF0Y2hpbmcgZWxlbWVudCBpcyBmb3VuZCBmb3IgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKi9cbiAgaGFybmVzc0xvYWRlckZvcihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPjtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzTG9hZGVyYCBpbnN0YW5jZSBmb3IgYW4gZWxlbWVudCB1bmRlciB0aGUgcm9vdCBvZiB0aGlzIGBMb2NhdG9yRmFjdG9yeWBcbiAgICogQHBhcmFtIHNlbGVjdG9yIFRoZSBzZWxlY3RvciBmb3IgdGhlIHJvb3QgZWxlbWVudC5cbiAgICogQHJldHVybiBBIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yLCBvciBudWxsIGlmXG4gICAqICAgICBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgaGFybmVzc0xvYWRlckZvck9wdGlvbmFsKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXIgfCBudWxsPjtcblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgYEhhcm5lc3NMb2FkZXJgIGluc3RhbmNlcywgb25lIGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgZm9yIHRoZSByb290IGVsZW1lbnQuXG4gICAqIEByZXR1cm4gQSBsaXN0IG9mIGBIYXJuZXNzTG9hZGVyYCwgb25lIHJvb3RlZCBhdCBlYWNoIGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKi9cbiAgaGFybmVzc0xvYWRlckZvckFsbChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyW10+O1xuXG4gIC8qKlxuICAgKiBGbHVzaGVzIGNoYW5nZSBkZXRlY3Rpb24gYW5kIGFzeW5jIHRhc2tzIGNhcHR1cmVkIGluIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqIEluIG1vc3QgY2FzZXMgaXQgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkgdG8gY2FsbCB0aGlzIG1hbnVhbGx5LiBIb3dldmVyLCB0aGVyZSBtYXkgYmUgc29tZSBlZGdlXG4gICAqIGNhc2VzIHdoZXJlIGl0IGlzIG5lZWRlZCB0byBmdWxseSBmbHVzaCBhbmltYXRpb24gZXZlbnRzLlxuICAgKi9cbiAgZm9yY2VTdGFiaWxpemUoKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIGFsbCBzY2hlZHVsZWQgb3IgcnVubmluZyBhc3luYyB0YXNrcyB0byBjb21wbGV0ZS4gVGhpcyBhbGxvd3MgaGFybmVzc1xuICAgKiBhdXRob3JzIHRvIHdhaXQgZm9yIGFzeW5jIHRhc2tzIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICovXG4gIHdhaXRGb3JUYXNrc091dHNpZGVBbmd1bGFyKCk6IFByb21pc2U8dm9pZD47XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY29tcG9uZW50IGhhcm5lc3NlcyB0aGF0IGFsbCBjb21wb25lbnQgaGFybmVzcyBhdXRob3JzIHNob3VsZCBleHRlbmQuIFRoaXMgYmFzZVxuICogY29tcG9uZW50IGhhcm5lc3MgcHJvdmlkZXMgdGhlIGJhc2ljIGFiaWxpdHkgdG8gbG9jYXRlIGVsZW1lbnQgYW5kIHN1Yi1jb21wb25lbnQgaGFybmVzcy4gSXRcbiAqIHNob3VsZCBiZSBpbmhlcml0ZWQgd2hlbiBkZWZpbmluZyB1c2VyJ3Mgb3duIGhhcm5lc3MuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGxvY2F0b3JGYWN0b3J5OiBMb2NhdG9yRmFjdG9yeSkge31cblxuICAvKiogR2V0cyBhIGBQcm9taXNlYCBmb3IgdGhlIGBUZXN0RWxlbWVudGAgcmVwcmVzZW50aW5nIHRoZSBob3N0IGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudC4gKi9cbiAgYXN5bmMgaG9zdCgpOiBQcm9taXNlPFRlc3RFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZhY3Rvcnkucm9vdEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGBMb2NhdG9yRmFjdG9yeWAgZm9yIHRoZSBkb2N1bWVudCByb290IGVsZW1lbnQuIFRoaXMgZmFjdG9yeSBjYW4gYmUgdXNlZCB0byBjcmVhdGVcbiAgICogbG9jYXRvcnMgZm9yIGVsZW1lbnRzIHRoYXQgYSBjb21wb25lbnQgY3JlYXRlcyBvdXRzaWRlIG9mIGl0cyBvd24gcm9vdCBlbGVtZW50LiAoZS5nLiBieVxuICAgKiBhcHBlbmRpbmcgdG8gZG9jdW1lbnQuYm9keSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTogTG9jYXRvckZhY3Rvcnkge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGYWN0b3J5LmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhc3luY2hyb25vdXMgbG9jYXRvciBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYSBgQ29tcG9uZW50SGFybmVzc2AgaW5zdGFuY2VcbiAgICogb3IgZWxlbWVudCB1bmRlciB0aGUgaG9zdCBlbGVtZW50IG9mIHRoaXMgYENvbXBvbmVudEhhcm5lc3NgLlxuICAgKiBAcGFyYW0gcXVlcmllcyBBIGxpc3Qgb2YgcXVlcmllcyBzcGVjaWZ5aW5nIHdoaWNoIGhhcm5lc3NlcyBhbmQgZWxlbWVudHMgdG8gc2VhcmNoIGZvcjpcbiAgICogICAtIEEgYHN0cmluZ2Agc2VhcmNoZXMgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBDU1Mgc2VsZWN0b3Igc3BlY2lmaWVkIGJ5IHRoZSBzdHJpbmcuXG4gICAqICAgLSBBIGBDb21wb25lbnRIYXJuZXNzYCBjb25zdHJ1Y3RvciBzZWFyY2hlcyBmb3IgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlcyBtYXRjaGluZyB0aGVcbiAgICogICAgIGdpdmVuIGNsYXNzLlxuICAgKiAgIC0gQSBgSGFybmVzc1ByZWRpY2F0ZWAgc2VhcmNoZXMgZm9yIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuXG4gICAqICAgICBwcmVkaWNhdGUuXG4gICAqIEByZXR1cm4gQW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBzZWFyY2hlcyBmb3IgYW5kIHJldHVybnMgYSBgUHJvbWlzZWAgZm9yIHRoZVxuICAgKiAgIGZpcnN0IGVsZW1lbnQgb3IgaGFybmVzcyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VhcmNoIGNyaXRlcmlhLiBNYXRjaGVzIGFyZSBvcmRlcmVkIGZpcnN0IGJ5XG4gICAqICAgb3JkZXIgaW4gdGhlIERPTSwgYW5kIHNlY29uZCBieSBvcmRlciBpbiB0aGUgcXVlcmllcyBsaXN0LiBJZiBubyBtYXRjaGVzIGFyZSBmb3VuZCwgdGhlXG4gICAqICAgYFByb21pc2VgIHJlamVjdHMuIFRoZSB0eXBlIHRoYXQgdGhlIGBQcm9taXNlYCByZXNvbHZlcyB0byBpcyBhIHVuaW9uIG9mIGFsbCByZXN1bHQgdHlwZXMgZm9yXG4gICAqICAgZWFjaCBxdWVyeS5cbiAgICpcbiAgICogZS5nLiBHaXZlbiB0aGUgZm9sbG93aW5nIERPTTogYDxkaXYgaWQ9XCJkMVwiIC8+PGRpdiBpZD1cImQyXCIgLz5gLCBhbmQgYXNzdW1pbmdcbiAgICogYERpdkhhcm5lc3MuaG9zdFNlbGVjdG9yID09PSAnZGl2J2A6XG4gICAqIC0gYGF3YWl0IGNoLmxvY2F0b3JGb3IoRGl2SGFybmVzcywgJ2RpdicpKClgIGdldHMgYSBgRGl2SGFybmVzc2AgaW5zdGFuY2UgZm9yIGAjZDFgXG4gICAqIC0gYGF3YWl0IGNoLmxvY2F0b3JGb3IoJ2RpdicsIERpdkhhcm5lc3MpKClgIGdldHMgYSBgVGVzdEVsZW1lbnRgIGluc3RhbmNlIGZvciBgI2QxYFxuICAgKiAtIGBhd2FpdCBjaC5sb2NhdG9yRm9yKCdzcGFuJykoKWAgdGhyb3dzIGJlY2F1c2UgdGhlIGBQcm9taXNlYCByZWplY3RzLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvY2F0b3JGb3I8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gICAgLi4ucXVlcmllczogVFxuICApOiBBc3luY0ZhY3RvcnlGbjxMb2NhdG9yRm5SZXN1bHQ8VD4+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRmFjdG9yeS5sb2NhdG9yRm9yKC4uLnF1ZXJpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaW5kIGEgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlXG4gICAqIG9yIGVsZW1lbnQgdW5kZXIgdGhlIGhvc3QgZWxlbWVudCBvZiB0aGlzIGBDb21wb25lbnRIYXJuZXNzYC5cbiAgICogQHBhcmFtIHF1ZXJpZXMgQSBsaXN0IG9mIHF1ZXJpZXMgc3BlY2lmeWluZyB3aGljaCBoYXJuZXNzZXMgYW5kIGVsZW1lbnRzIHRvIHNlYXJjaCBmb3I6XG4gICAqICAgLSBBIGBzdHJpbmdgIHNlYXJjaGVzIGZvciBlbGVtZW50cyBtYXRjaGluZyB0aGUgQ1NTIHNlbGVjdG9yIHNwZWNpZmllZCBieSB0aGUgc3RyaW5nLlxuICAgKiAgIC0gQSBgQ29tcG9uZW50SGFybmVzc2AgY29uc3RydWN0b3Igc2VhcmNoZXMgZm9yIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlXG4gICAqICAgICBnaXZlbiBjbGFzcy5cbiAgICogICAtIEEgYEhhcm5lc3NQcmVkaWNhdGVgIHNlYXJjaGVzIGZvciBgQ29tcG9uZW50SGFybmVzc2AgaW5zdGFuY2VzIG1hdGNoaW5nIHRoZSBnaXZlblxuICAgKiAgICAgcHJlZGljYXRlLlxuICAgKiBAcmV0dXJuIEFuIGFzeW5jaHJvbm91cyBsb2NhdG9yIGZ1bmN0aW9uIHRoYXQgc2VhcmNoZXMgZm9yIGFuZCByZXR1cm5zIGEgYFByb21pc2VgIGZvciB0aGVcbiAgICogICBmaXJzdCBlbGVtZW50IG9yIGhhcm5lc3MgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlYXJjaCBjcml0ZXJpYS4gTWF0Y2hlcyBhcmUgb3JkZXJlZCBmaXJzdCBieVxuICAgKiAgIG9yZGVyIGluIHRoZSBET00sIGFuZCBzZWNvbmQgYnkgb3JkZXIgaW4gdGhlIHF1ZXJpZXMgbGlzdC4gSWYgbm8gbWF0Y2hlcyBhcmUgZm91bmQsIHRoZVxuICAgKiAgIGBQcm9taXNlYCBpcyByZXNvbHZlZCB3aXRoIGBudWxsYC4gVGhlIHR5cGUgdGhhdCB0aGUgYFByb21pc2VgIHJlc29sdmVzIHRvIGlzIGEgdW5pb24gb2YgYWxsXG4gICAqICAgcmVzdWx0IHR5cGVzIGZvciBlYWNoIHF1ZXJ5IG9yIG51bGwuXG4gICAqXG4gICAqIGUuZy4gR2l2ZW4gdGhlIGZvbGxvd2luZyBET006IGA8ZGl2IGlkPVwiZDFcIiAvPjxkaXYgaWQ9XCJkMlwiIC8+YCwgYW5kIGFzc3VtaW5nXG4gICAqIGBEaXZIYXJuZXNzLmhvc3RTZWxlY3RvciA9PT0gJ2RpdidgOlxuICAgKiAtIGBhd2FpdCBjaC5sb2NhdG9yRm9yT3B0aW9uYWwoRGl2SGFybmVzcywgJ2RpdicpKClgIGdldHMgYSBgRGl2SGFybmVzc2AgaW5zdGFuY2UgZm9yIGAjZDFgXG4gICAqIC0gYGF3YWl0IGNoLmxvY2F0b3JGb3JPcHRpb25hbCgnZGl2JywgRGl2SGFybmVzcykoKWAgZ2V0cyBhIGBUZXN0RWxlbWVudGAgaW5zdGFuY2UgZm9yIGAjZDFgXG4gICAqIC0gYGF3YWl0IGNoLmxvY2F0b3JGb3JPcHRpb25hbCgnc3BhbicpKClgIGdldHMgYG51bGxgLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvY2F0b3JGb3JPcHRpb25hbDxUIGV4dGVuZHMgKEhhcm5lc3NRdWVyeTxhbnk+IHwgc3RyaW5nKVtdPihcbiAgICAuLi5xdWVyaWVzOiBUXG4gICk6IEFzeW5jRmFjdG9yeUZuPExvY2F0b3JGblJlc3VsdDxUPiB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRmFjdG9yeS5sb2NhdG9yRm9yT3B0aW9uYWwoLi4ucXVlcmllcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhc3luY2hyb25vdXMgbG9jYXRvciBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlc1xuICAgKiBvciBlbGVtZW50cyB1bmRlciB0aGUgaG9zdCBlbGVtZW50IG9mIHRoaXMgYENvbXBvbmVudEhhcm5lc3NgLlxuICAgKiBAcGFyYW0gcXVlcmllcyBBIGxpc3Qgb2YgcXVlcmllcyBzcGVjaWZ5aW5nIHdoaWNoIGhhcm5lc3NlcyBhbmQgZWxlbWVudHMgdG8gc2VhcmNoIGZvcjpcbiAgICogICAtIEEgYHN0cmluZ2Agc2VhcmNoZXMgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBDU1Mgc2VsZWN0b3Igc3BlY2lmaWVkIGJ5IHRoZSBzdHJpbmcuXG4gICAqICAgLSBBIGBDb21wb25lbnRIYXJuZXNzYCBjb25zdHJ1Y3RvciBzZWFyY2hlcyBmb3IgYENvbXBvbmVudEhhcm5lc3NgIGluc3RhbmNlcyBtYXRjaGluZyB0aGVcbiAgICogICAgIGdpdmVuIGNsYXNzLlxuICAgKiAgIC0gQSBgSGFybmVzc1ByZWRpY2F0ZWAgc2VhcmNoZXMgZm9yIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuXG4gICAqICAgICBwcmVkaWNhdGUuXG4gICAqIEByZXR1cm4gQW4gYXN5bmNocm9ub3VzIGxvY2F0b3IgZnVuY3Rpb24gdGhhdCBzZWFyY2hlcyBmb3IgYW5kIHJldHVybnMgYSBgUHJvbWlzZWAgZm9yIGFsbFxuICAgKiAgIGVsZW1lbnRzIGFuZCBoYXJuZXNzZXMgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlYXJjaCBjcml0ZXJpYS4gTWF0Y2hlcyBhcmUgb3JkZXJlZCBmaXJzdCBieVxuICAgKiAgIG9yZGVyIGluIHRoZSBET00sIGFuZCBzZWNvbmQgYnkgb3JkZXIgaW4gdGhlIHF1ZXJpZXMgbGlzdC4gSWYgYW4gZWxlbWVudCBtYXRjaGVzIG1vcmUgdGhhblxuICAgKiAgIG9uZSBgQ29tcG9uZW50SGFybmVzc2AgY2xhc3MsIHRoZSBsb2NhdG9yIGdldHMgYW4gaW5zdGFuY2Ugb2YgZWFjaCBmb3IgdGhlIHNhbWUgZWxlbWVudC4gSWZcbiAgICogICBhbiBlbGVtZW50IG1hdGNoZXMgbXVsdGlwbGUgYHN0cmluZ2Agc2VsZWN0b3JzLCBvbmx5IG9uZSBgVGVzdEVsZW1lbnRgIGluc3RhbmNlIGlzIHJldHVybmVkXG4gICAqICAgZm9yIHRoYXQgZWxlbWVudC4gVGhlIHR5cGUgdGhhdCB0aGUgYFByb21pc2VgIHJlc29sdmVzIHRvIGlzIGFuIGFycmF5IHdoZXJlIGVhY2ggZWxlbWVudCBpc1xuICAgKiAgIHRoZSB1bmlvbiBvZiBhbGwgcmVzdWx0IHR5cGVzIGZvciBlYWNoIHF1ZXJ5LlxuICAgKlxuICAgKiBlLmcuIEdpdmVuIHRoZSBmb2xsb3dpbmcgRE9NOiBgPGRpdiBpZD1cImQxXCIgLz48ZGl2IGlkPVwiZDJcIiAvPmAsIGFuZCBhc3N1bWluZ1xuICAgKiBgRGl2SGFybmVzcy5ob3N0U2VsZWN0b3IgPT09ICdkaXYnYCBhbmQgYElkSXNEMUhhcm5lc3MuaG9zdFNlbGVjdG9yID09PSAnI2QxJ2A6XG4gICAqIC0gYGF3YWl0IGNoLmxvY2F0b3JGb3JBbGwoRGl2SGFybmVzcywgJ2RpdicpKClgIGdldHMgYFtcbiAgICogICAgIERpdkhhcm5lc3MsIC8vIGZvciAjZDFcbiAgICogICAgIFRlc3RFbGVtZW50LCAvLyBmb3IgI2QxXG4gICAqICAgICBEaXZIYXJuZXNzLCAvLyBmb3IgI2QyXG4gICAqICAgICBUZXN0RWxlbWVudCAvLyBmb3IgI2QyXG4gICAqICAgXWBcbiAgICogLSBgYXdhaXQgY2gubG9jYXRvckZvckFsbCgnZGl2JywgJyNkMScpKClgIGdldHMgYFtcbiAgICogICAgIFRlc3RFbGVtZW50LCAvLyBmb3IgI2QxXG4gICAqICAgICBUZXN0RWxlbWVudCAvLyBmb3IgI2QyXG4gICAqICAgXWBcbiAgICogLSBgYXdhaXQgY2gubG9jYXRvckZvckFsbChEaXZIYXJuZXNzLCBJZElzRDFIYXJuZXNzKSgpYCBnZXRzIGBbXG4gICAqICAgICBEaXZIYXJuZXNzLCAvLyBmb3IgI2QxXG4gICAqICAgICBJZElzRDFIYXJuZXNzLCAvLyBmb3IgI2QxXG4gICAqICAgICBEaXZIYXJuZXNzIC8vIGZvciAjZDJcbiAgICogICBdYFxuICAgKiAtIGBhd2FpdCBjaC5sb2NhdG9yRm9yQWxsKCdzcGFuJykoKWAgZ2V0cyBgW11gLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvY2F0b3JGb3JBbGw8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gICAgLi4ucXVlcmllczogVFxuICApOiBBc3luY0ZhY3RvcnlGbjxMb2NhdG9yRm5SZXN1bHQ8VD5bXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGYWN0b3J5LmxvY2F0b3JGb3JBbGwoLi4ucXVlcmllcyk7XG4gIH1cblxuICAvKipcbiAgICogRmx1c2hlcyBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBhc3luYyB0YXNrcyBpbiB0aGUgQW5ndWxhciB6b25lLlxuICAgKiBJbiBtb3N0IGNhc2VzIGl0IHNob3VsZCBub3QgYmUgbmVjZXNzYXJ5IHRvIGNhbGwgdGhpcyBtYW51YWxseS4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIHNvbWUgZWRnZVxuICAgKiBjYXNlcyB3aGVyZSBpdCBpcyBuZWVkZWQgdG8gZnVsbHkgZmx1c2ggYW5pbWF0aW9uIGV2ZW50cy5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBmb3JjZVN0YWJpbGl6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRmFjdG9yeS5mb3JjZVN0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciBhbGwgc2NoZWR1bGVkIG9yIHJ1bm5pbmcgYXN5bmMgdGFza3MgdG8gY29tcGxldGUuIFRoaXMgYWxsb3dzIGhhcm5lc3NcbiAgICogYXV0aG9ycyB0byB3YWl0IGZvciBhc3luYyB0YXNrcyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgd2FpdEZvclRhc2tzT3V0c2lkZUFuZ3VsYXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZhY3Rvcnkud2FpdEZvclRhc2tzT3V0c2lkZUFuZ3VsYXIoKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNvbXBvbmVudCBoYXJuZXNzZXMgdGhhdCBhdXRob3JzIHNob3VsZCBleHRlbmQgaWYgdGhleSBhbnRpY2lwYXRlIHRoYXQgY29uc3VtZXJzXG4gKiBvZiB0aGUgaGFybmVzcyBtYXkgd2FudCB0byBhY2Nlc3Mgb3RoZXIgaGFybmVzc2VzIHdpdGhpbiB0aGUgYDxuZy1jb250ZW50PmAgb2YgdGhlIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPFMgZXh0ZW5kcyBzdHJpbmcgPSBzdHJpbmc+XG4gIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzc1xuICBpbXBsZW1lbnRzIEhhcm5lc3NMb2FkZXJcbntcbiAgYXN5bmMgZ2V0Q2hpbGRMb2FkZXIoc2VsZWN0b3I6IFMpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKSkuZ2V0Q2hpbGRMb2FkZXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsQ2hpbGRMb2FkZXJzKHNlbGVjdG9yOiBTKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyW10+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKSkuZ2V0QWxsQ2hpbGRMb2FkZXJzKHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIGdldEhhcm5lc3M8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KHF1ZXJ5OiBIYXJuZXNzUXVlcnk8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKSkuZ2V0SGFybmVzcyhxdWVyeSk7XG4gIH1cblxuICBhc3luYyBnZXRBbGxIYXJuZXNzZXM8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KHF1ZXJ5OiBIYXJuZXNzUXVlcnk8VD4pOiBQcm9taXNlPFRbXT4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRSb290SGFybmVzc0xvYWRlcigpKS5nZXRBbGxIYXJuZXNzZXMocXVlcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvb3QgaGFybmVzcyBsb2FkZXIgZnJvbSB3aGljaCB0byBzdGFydFxuICAgKiBzZWFyY2hpbmcgZm9yIGNvbnRlbnQgY29udGFpbmVkIGJ5IHRoaXMgaGFybmVzcy5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBnZXRSb290SGFybmVzc0xvYWRlcigpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRmFjdG9yeS5yb290SGFybmVzc0xvYWRlcigpO1xuICB9XG59XG5cbi8qKiBDb25zdHJ1Y3RvciBmb3IgYSBDb21wb25lbnRIYXJuZXNzIHN1YmNsYXNzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+IHtcbiAgbmV3IChsb2NhdG9yRmFjdG9yeTogTG9jYXRvckZhY3RvcnkpOiBUO1xuXG4gIC8qKlxuICAgKiBgQ29tcG9uZW50SGFybmVzc2Agc3ViY2xhc3NlcyBtdXN0IHNwZWNpZnkgYSBzdGF0aWMgYGhvc3RTZWxlY3RvcmAgcHJvcGVydHkgdGhhdCBpcyB1c2VkIHRvXG4gICAqIGZpbmQgdGhlIGhvc3QgZWxlbWVudCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgY29tcG9uZW50LiBUaGlzIHByb3BlcnR5IHNob3VsZCBtYXRjaCB0aGUgc2VsZWN0b3JcbiAgICogZm9yIHRoZSBBbmd1bGFyIGNvbXBvbmVudC5cbiAgICovXG4gIGhvc3RTZWxlY3Rvcjogc3RyaW5nO1xufVxuXG4vKiogQSBzZXQgb2YgY3JpdGVyaWEgdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgYSBsaXN0IG9mIGBDb21wb25lbnRIYXJuZXNzYCBpbnN0YW5jZXMuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VIYXJuZXNzRmlsdGVycyB7XG4gIC8qKiBPbmx5IGZpbmQgaW5zdGFuY2VzIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci4gKi9cbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKiBPbmx5IGZpbmQgaW5zdGFuY2VzIHRoYXQgYXJlIG5lc3RlZCB1bmRlciBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIHNlbGVjdG9yLiAqL1xuICBhbmNlc3Rvcj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGNsYXNzIHVzZWQgdG8gYXNzb2NpYXRlIGEgQ29tcG9uZW50SGFybmVzcyBjbGFzcyB3aXRoIHByZWRpY2F0ZXMgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAqIGZpbHRlciBpbnN0YW5jZXMgb2YgdGhlIGNsYXNzLlxuICovXG5leHBvcnQgY2xhc3MgSGFybmVzc1ByZWRpY2F0ZTxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4ge1xuICBwcml2YXRlIF9wcmVkaWNhdGVzOiBBc3luY1ByZWRpY2F0ZTxUPltdID0gW107XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfYW5jZXN0b3I6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaGFybmVzc1R5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPiwgb3B0aW9uczogQmFzZUhhcm5lc3NGaWx0ZXJzKSB7XG4gICAgdGhpcy5fYWRkQmFzZU9wdGlvbnMob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgbnVsbGFibGUgc3RyaW5nIHZhbHVlIG1hdGNoZXMgdGhlIGdpdmVuIHBhdHRlcm4uXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbnVsbGFibGUgc3RyaW5nIHZhbHVlIHRvIGNoZWNrLCBvciBhIFByb21pc2UgcmVzb2x2aW5nIHRvIHRoZVxuICAgKiAgIG51bGxhYmxlIHN0cmluZyB2YWx1ZS5cbiAgICogQHBhcmFtIHBhdHRlcm4gVGhlIHBhdHRlcm4gdGhlIHZhbHVlIGlzIGV4cGVjdGVkIHRvIG1hdGNoLiBJZiBgcGF0dGVybmAgaXMgYSBzdHJpbmcsXG4gICAqICAgYHZhbHVlYCBpcyBleHBlY3RlZCB0byBtYXRjaCBleGFjdGx5LiBJZiBgcGF0dGVybmAgaXMgYSByZWdleCwgYSBwYXJ0aWFsIG1hdGNoIGlzXG4gICAqICAgYWxsb3dlZC4gSWYgYHBhdHRlcm5gIGlzIGBudWxsYCwgdGhlIHZhbHVlIGlzIGV4cGVjdGVkIHRvIGJlIGBudWxsYC5cbiAgICogQHJldHVybiBXaGV0aGVyIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwYXR0ZXJuLlxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHN0cmluZ01hdGNoZXMoXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bGwgfCBQcm9taXNlPHN0cmluZyB8IG51bGw+LFxuICAgIHBhdHRlcm46IHN0cmluZyB8IFJlZ0V4cCB8IG51bGwsXG4gICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHZhbHVlID0gYXdhaXQgdmFsdWU7XG4gICAgaWYgKHBhdHRlcm4gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycgPyB2YWx1ZSA9PT0gcGF0dGVybiA6IHBhdHRlcm4udGVzdCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBiZSBydW4gYWdhaW5zdCBjYW5kaWRhdGUgaGFybmVzc2VzLlxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gQSBkZXNjcmlwdGlvbiBvZiB0aGlzIHByZWRpY2F0ZSB0aGF0IG1heSBiZSB1c2VkIGluIGVycm9yIG1lc3NhZ2VzLlxuICAgKiBAcGFyYW0gcHJlZGljYXRlIEFuIGFzeW5jIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICogQHJldHVybiB0aGlzIChmb3IgbWV0aG9kIGNoYWluaW5nKS5cbiAgICovXG4gIGFkZChkZXNjcmlwdGlvbjogc3RyaW5nLCBwcmVkaWNhdGU6IEFzeW5jUHJlZGljYXRlPFQ+KSB7XG4gICAgdGhpcy5fZGVzY3JpcHRpb25zLnB1c2goZGVzY3JpcHRpb24pO1xuICAgIHRoaXMuX3ByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwcmVkaWNhdGUgZnVuY3Rpb24gdGhhdCBkZXBlbmRzIG9uIGFuIG9wdGlvbiB2YWx1ZSB0byBiZSBydW4gYWdhaW5zdCBjYW5kaWRhdGVcbiAgICogaGFybmVzc2VzLiBJZiB0aGUgb3B0aW9uIHZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZWRpY2F0ZSB3aWxsIGJlIGlnbm9yZWQuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBvcHRpb24gKG1heSBiZSB1c2VkIGluIGVycm9yIG1lc3NhZ2VzKS5cbiAgICogQHBhcmFtIG9wdGlvbiBUaGUgb3B0aW9uIHZhbHVlLlxuICAgKiBAcGFyYW0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gcnVuIGlmIHRoZSBvcHRpb24gdmFsdWUgaXMgbm90IHVuZGVmaW5lZC5cbiAgICogQHJldHVybiB0aGlzIChmb3IgbWV0aG9kIGNoYWluaW5nKS5cbiAgICovXG4gIGFkZE9wdGlvbjxPPihuYW1lOiBzdHJpbmcsIG9wdGlvbjogTyB8IHVuZGVmaW5lZCwgcHJlZGljYXRlOiBBc3luY09wdGlvblByZWRpY2F0ZTxULCBPPikge1xuICAgIGlmIChvcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5hZGQoYCR7bmFtZX0gPSAke192YWx1ZUFzU3RyaW5nKG9wdGlvbil9YCwgaXRlbSA9PiBwcmVkaWNhdGUoaXRlbSwgb3B0aW9uKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgYSBsaXN0IG9mIGhhcm5lc3NlcyBvbiB0aGlzIHByZWRpY2F0ZS5cbiAgICogQHBhcmFtIGhhcm5lc3NlcyBUaGUgbGlzdCBvZiBoYXJuZXNzZXMgdG8gZmlsdGVyLlxuICAgKiBAcmV0dXJuIEEgbGlzdCBvZiBoYXJuZXNzZXMgdGhhdCBzYXRpc2Z5IHRoaXMgcHJlZGljYXRlLlxuICAgKi9cbiAgYXN5bmMgZmlsdGVyKGhhcm5lc3NlczogVFtdKTogUHJvbWlzZTxUW10+IHtcbiAgICBpZiAoaGFybmVzc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gaGFybmVzc2VzLm1hcChoID0+IHRoaXMuZXZhbHVhdGUoaCkpKTtcbiAgICByZXR1cm4gaGFybmVzc2VzLmZpbHRlcigoXywgaSkgPT4gcmVzdWx0c1tpXSk7XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGVzIHdoZXRoZXIgdGhlIGdpdmVuIGhhcm5lc3Mgc2F0aXNmaWVzIHRoaXMgcHJlZGljYXRlLlxuICAgKiBAcGFyYW0gaGFybmVzcyBUaGUgaGFybmVzcyB0byBjaGVja1xuICAgKiBAcmV0dXJuIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgaWYgdGhlIGhhcm5lc3Mgc2F0aXNmaWVzIHRoaXMgcHJlZGljYXRlLFxuICAgKiAgIGFuZCByZXNvbHZlcyB0byBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBhc3luYyBldmFsdWF0ZShoYXJuZXNzOiBUKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IHRoaXMuX3ByZWRpY2F0ZXMubWFwKHAgPT4gcChoYXJuZXNzKSkpO1xuICAgIHJldHVybiByZXN1bHRzLnJlZHVjZSgoY29tYmluZWQsIGN1cnJlbnQpID0+IGNvbWJpbmVkICYmIGN1cnJlbnQsIHRydWUpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBkZXNjcmlwdGlvbiBvZiB0aGlzIHByZWRpY2F0ZSBmb3IgdXNlIGluIGVycm9yIG1lc3NhZ2VzLiAqL1xuICBnZXREZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb25zLmpvaW4oJywgJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0b3IgdXNlZCB0byBmaW5kIGNhbmRpZGF0ZSBlbGVtZW50cy4gKi9cbiAgZ2V0U2VsZWN0b3IoKSB7XG4gICAgLy8gV2UgZG9uJ3QgaGF2ZSB0byBnbyB0aHJvdWdoIHRoZSBleHRyYSB0cm91YmxlIGlmIHRoZXJlIGFyZSBubyBhbmNlc3RvcnMuXG4gICAgaWYgKCF0aGlzLl9hbmNlc3Rvcikge1xuICAgICAgcmV0dXJuICh0aGlzLmhhcm5lc3NUeXBlLmhvc3RTZWxlY3RvciB8fCAnJykudHJpbSgpO1xuICAgIH1cblxuICAgIGNvbnN0IFthbmNlc3RvcnMsIGFuY2VzdG9yUGxhY2Vob2xkZXJzXSA9IF9zcGxpdEFuZEVzY2FwZVNlbGVjdG9yKHRoaXMuX2FuY2VzdG9yKTtcbiAgICBjb25zdCBbc2VsZWN0b3JzLCBzZWxlY3RvclBsYWNlaG9sZGVyc10gPSBfc3BsaXRBbmRFc2NhcGVTZWxlY3RvcihcbiAgICAgIHRoaXMuaGFybmVzc1R5cGUuaG9zdFNlbGVjdG9yIHx8ICcnLFxuICAgICk7XG4gICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgLy8gV2UgaGF2ZSB0byBhZGQgdGhlIGFuY2VzdG9yIHRvIGVhY2ggcGFydCBvZiB0aGUgaG9zdCBjb21wb3VuZCBzZWxlY3Rvciwgb3RoZXJ3aXNlIHdlIGNhbiBnZXRcbiAgICAvLyBpbmNvcnJlY3QgcmVzdWx0cy4gRS5nLiBgLmFuY2VzdG9yIC5hLCAuYW5jZXN0b3IgLmJgIHZzIGAuYW5jZXN0b3IgLmEsIC5iYC5cbiAgICBhbmNlc3RvcnMuZm9yRWFjaChlc2NhcGVkQW5jZXN0b3IgPT4ge1xuICAgICAgY29uc3QgYW5jZXN0b3IgPSBfcmVzdG9yZVNlbGVjdG9yKGVzY2FwZWRBbmNlc3RvciwgYW5jZXN0b3JQbGFjZWhvbGRlcnMpO1xuICAgICAgcmV0dXJuIHNlbGVjdG9ycy5mb3JFYWNoKGVzY2FwZWRTZWxlY3RvciA9PlxuICAgICAgICByZXN1bHQucHVzaChgJHthbmNlc3Rvcn0gJHtfcmVzdG9yZVNlbGVjdG9yKGVzY2FwZWRTZWxlY3Rvciwgc2VsZWN0b3JQbGFjZWhvbGRlcnMpfWApLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQuam9pbignLCAnKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGJhc2Ugb3B0aW9ucyBjb21tb24gdG8gYWxsIGhhcm5lc3MgdHlwZXMuICovXG4gIHByaXZhdGUgX2FkZEJhc2VPcHRpb25zKG9wdGlvbnM6IEJhc2VIYXJuZXNzRmlsdGVycykge1xuICAgIHRoaXMuX2FuY2VzdG9yID0gb3B0aW9ucy5hbmNlc3RvciB8fCAnJztcbiAgICBpZiAodGhpcy5fYW5jZXN0b3IpIHtcbiAgICAgIHRoaXMuX2Rlc2NyaXB0aW9ucy5wdXNoKGBoYXMgYW5jZXN0b3IgbWF0Y2hpbmcgc2VsZWN0b3IgXCIke3RoaXMuX2FuY2VzdG9yfVwiYCk7XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvcjtcbiAgICBpZiAoc2VsZWN0b3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5hZGQoYGhvc3QgbWF0Y2hlcyBzZWxlY3RvciBcIiR7c2VsZWN0b3J9XCJgLCBhc3luYyBpdGVtID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBpdGVtLmhvc3QoKSkubWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKiogUmVwcmVzZW50IGEgdmFsdWUgYXMgYSBzdHJpbmcgZm9yIHRoZSBwdXJwb3NlIG9mIGxvZ2dpbmcuICovXG5mdW5jdGlvbiBfdmFsdWVBc1N0cmluZyh2YWx1ZTogdW5rbm93bikge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgfVxuICB0cnkge1xuICAgIC8vIGBKU09OLnN0cmluZ2lmeWAgZG9lc24ndCBoYW5kbGUgUmVnRXhwIHByb3Blcmx5LCBzbyB3ZSBuZWVkIGEgY3VzdG9tIHJlcGxhY2VyLlxuICAgIC8vIFVzZSBhIGNoYXJhY3RlciB0aGF0IGlzIHVubGlrZWx5IHRvIGFwcGVhciBpbiByZWFsIHN0cmluZ3MgdG8gZGVub3RlIHRoZSBzdGFydCBhbmQgZW5kIG9mXG4gICAgLy8gdGhlIHJlZ2V4LiBUaGlzIGFsbG93cyB1cyB0byBzdHJpcCBvdXQgdGhlIGV4dHJhIHF1b3RlcyBhcm91bmQgdGhlIHZhbHVlIGFkZGVkIGJ5XG4gICAgLy8gYEpTT04uc3RyaW5naWZ5YC4gQWxzbyBkbyBjdXN0b20gZXNjYXBpbmcgb24gYFwiYCBjaGFyYWN0ZXJzIHRvIHByZXZlbnQgYEpTT04uc3RyaW5naWZ5YFxuICAgIC8vIGZyb20gZXNjYXBpbmcgdGhlbSBhcyBpZiB0aGV5IHdlcmUgcGFydCBvZiBhIHN0cmluZy5cbiAgICBjb25zdCBzdHJpbmdpZmllZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUsIChfLCB2KSA9PlxuICAgICAgdiBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICA/IGDil6xNQVRfUkVfRVNDQVBF4pesJHt2LnRvU3RyaW5nKCkucmVwbGFjZSgvXCIvZywgJ+KXrE1BVF9SRV9FU0NBUEXil6wnKX3il6xNQVRfUkVfRVNDQVBF4pesYFxuICAgICAgICA6IHYsXG4gICAgKTtcbiAgICAvLyBTdHJpcCBvdXQgdGhlIGV4dHJhIHF1b3RlcyBhcm91bmQgcmVnZXhlcyBhbmQgcHV0IGJhY2sgdGhlIG1hbnVhbGx5IGVzY2FwZWQgYFwiYCBjaGFyYWN0ZXJzLlxuICAgIHJldHVybiBzdHJpbmdpZmllZFZhbHVlXG4gICAgICAucmVwbGFjZSgvXCLil6xNQVRfUkVfRVNDQVBF4pesfOKXrE1BVF9SRV9FU0NBUEXil6xcIi9nLCAnJylcbiAgICAgIC5yZXBsYWNlKC/il6xNQVRfUkVfRVNDQVBF4pesL2csICdcIicpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBgSlNPTi5zdHJpbmdpZnlgIHdpbGwgdGhyb3cgaWYgdGhlIG9iamVjdCBpcyBjeWNsaWNhbCxcbiAgICAvLyBpbiB0aGlzIGNhc2UgdGhlIGJlc3Qgd2UgY2FuIGRvIGlzIHJlcG9ydCB0aGUgdmFsdWUgYXMgYHsuLi59YC5cbiAgICByZXR1cm4gJ3suLi59JztcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0cyB1cCBhIGNvbXBvdW5kIHNlbGVjdG9yIGludG8gaXRzIHBhcnRzIGFuZCBlc2NhcGVzIGFueSBxdW90ZWQgY29udGVudC4gVGhlIHF1b3RlZCBjb250ZW50XG4gKiBoYXMgdG8gYmUgZXNjYXBlZCwgYmVjYXVzZSBpdCBjYW4gY29udGFpbiBjb21tYXMgd2hpY2ggd2lsbCB0aHJvdyB0aHJvdyB1cyBvZmYgd2hlbiB0cnlpbmcgdG9cbiAqIHNwbGl0IGl0LlxuICogQHBhcmFtIHNlbGVjdG9yIFNlbGVjdG9yIHRvIGJlIHNwbGl0LlxuICogQHJldHVybnMgVGhlIGVzY2FwZWQgc3RyaW5nIHdoZXJlIGFueSBxdW90ZWQgY29udGVudCBpcyByZXBsYWNlZCB3aXRoIGEgcGxhY2Vob2xkZXIuIEUuZy5cbiAqIGBbZm9vPVwiYmFyXCJdYCB0dXJucyBpbnRvIGBbZm9vPV9fY2RrUGxhY2Vob2xkZXItMF9fXWAuIFVzZSBgX3Jlc3RvcmVTZWxlY3RvcmAgdG8gcmVzdG9yZVxuICogdGhlIHBsYWNlaG9sZGVycy5cbiAqL1xuZnVuY3Rpb24gX3NwbGl0QW5kRXNjYXBlU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk6IFtwYXJ0czogc3RyaW5nW10sIHBsYWNlaG9sZGVyczogc3RyaW5nW11dIHtcbiAgY29uc3QgcGxhY2Vob2xkZXJzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8vIE5vdGUgdGhhdCB0aGUgcmVnZXggZG9lc24ndCBhY2NvdW50IGZvciBuZXN0ZWQgcXVvdGVzIHNvIHNvbWV0aGluZyBsaWtlIGBcImFiJ2NkJ2VcImAgd2lsbCBiZVxuICAvLyBjb25zaWRlcmVkIGFzIHR3byBibG9ja3MuIEl0J3MgYSBiaXQgb2YgYW4gZWRnZSBjYXNlLCBidXQgaWYgd2UgZmluZCB0aGF0IGl0J3MgYSBwcm9ibGVtLFxuICAvLyB3ZSBjYW4gbWFrZSBpdCBhIGJpdCBzbWFydGVyIHVzaW5nIGEgbG9vcC4gVXNlIHRoaXMgZm9yIG5vdyBzaW5jZSBpdCdzIG1vcmUgcmVhZGFibGUgYW5kXG4gIC8vIGNvbXBhY3QuIE1vcmUgY29tcGxldGUgaW1wbGVtZW50YXRpb246XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi9iZDM0YmM5ZTg5ZjE4YS9wYWNrYWdlcy9jb21waWxlci9zcmMvc2hhZG93X2Nzcy50cyNMNjU1XG4gIGNvbnN0IHJlc3VsdCA9IHNlbGVjdG9yLnJlcGxhY2UoLyhbXCInXVteW1wiJ10qW1wiJ10pL2csIChfLCBrZWVwKSA9PiB7XG4gICAgY29uc3QgcmVwbGFjZUJ5ID0gYF9fY2RrUGxhY2Vob2xkZXItJHtwbGFjZWhvbGRlcnMubGVuZ3RofV9fYDtcbiAgICBwbGFjZWhvbGRlcnMucHVzaChrZWVwKTtcbiAgICByZXR1cm4gcmVwbGFjZUJ5O1xuICB9KTtcblxuICByZXR1cm4gW3Jlc3VsdC5zcGxpdCgnLCcpLm1hcChwYXJ0ID0+IHBhcnQudHJpbSgpKSwgcGxhY2Vob2xkZXJzXTtcbn1cblxuLyoqIFJlc3RvcmVzIGEgc2VsZWN0b3Igd2hvc2UgY29udGVudCB3YXMgZXNjYXBlZCBpbiBgX3NwbGl0QW5kRXNjYXBlU2VsZWN0b3JgLiAqL1xuZnVuY3Rpb24gX3Jlc3RvcmVTZWxlY3RvcihzZWxlY3Rvcjogc3RyaW5nLCBwbGFjZWhvbGRlcnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNlbGVjdG9yLnJlcGxhY2UoL19fY2RrUGxhY2Vob2xkZXItKFxcZCspX18vZywgKF8sIGluZGV4KSA9PiBwbGFjZWhvbGRlcnNbK2luZGV4XSk7XG59XG4iXX0=