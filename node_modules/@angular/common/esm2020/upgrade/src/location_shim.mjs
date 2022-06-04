/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ReplaySubject } from 'rxjs';
import { deepEqual, isAnchor, isPromise } from './utils';
const PATH_MATCH = /^([^?#]*)(\?([^#]*))?(#(.*))?$/;
const DOUBLE_SLASH_REGEX = /^\s*[\\/]{2,}/;
const IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
const DEFAULT_PORTS = {
    'http:': 80,
    'https:': 443,
    'ftp:': 21
};
/**
 * Location service that provides a drop-in replacement for the $location service
 * provided in AngularJS.
 *
 * @see [Using the Angular Unified Location Service](guide/upgrade#using-the-unified-angular-location-service)
 *
 * @publicApi
 */
export class $locationShim {
    constructor($injector, location, platformLocation, urlCodec, locationStrategy) {
        this.location = location;
        this.platformLocation = platformLocation;
        this.urlCodec = urlCodec;
        this.locationStrategy = locationStrategy;
        this.initalizing = true;
        this.updateBrowser = false;
        this.$$absUrl = '';
        this.$$url = '';
        this.$$host = '';
        this.$$replace = false;
        this.$$path = '';
        this.$$search = '';
        this.$$hash = '';
        this.$$changeListeners = [];
        this.cachedState = null;
        this.urlChanges = new ReplaySubject(1);
        this.lastBrowserUrl = '';
        // This variable should be used *only* inside the cacheState function.
        this.lastCachedState = null;
        const initialUrl = this.browserUrl();
        let parsedUrl = this.urlCodec.parse(initialUrl);
        if (typeof parsedUrl === 'string') {
            throw 'Invalid URL';
        }
        this.$$protocol = parsedUrl.protocol;
        this.$$host = parsedUrl.hostname;
        this.$$port = parseInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
        this.$$parseLinkUrl(initialUrl, initialUrl);
        this.cacheState();
        this.$$state = this.browserState();
        this.location.onUrlChange((newUrl, newState) => {
            this.urlChanges.next({ newUrl, newState });
        });
        if (isPromise($injector)) {
            $injector.then($i => this.initialize($i));
        }
        else {
            this.initialize($injector);
        }
    }
    initialize($injector) {
        const $rootScope = $injector.get('$rootScope');
        const $rootElement = $injector.get('$rootElement');
        $rootElement.on('click', (event) => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 ||
                event.button === 2) {
                return;
            }
            let elm = event.target;
            // traverse the DOM up to find first A tag
            while (elm && elm.nodeName.toLowerCase() !== 'a') {
                // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
                if (elm === $rootElement[0] || !(elm = elm.parentNode)) {
                    return;
                }
            }
            if (!isAnchor(elm)) {
                return;
            }
            const absHref = elm.href;
            const relHref = elm.getAttribute('href');
            // Ignore when url is started with javascript: or mailto:
            if (IGNORE_URI_REGEXP.test(absHref)) {
                return;
            }
            if (absHref && !elm.getAttribute('target') && !event.isDefaultPrevented()) {
                if (this.$$parseLinkUrl(absHref, relHref)) {
                    // We do a preventDefault for all urls that are part of the AngularJS application,
                    // in html5mode and also without, so that we are able to abort navigation without
                    // getting double entries in the location history.
                    event.preventDefault();
                    // update location manually
                    if (this.absUrl() !== this.browserUrl()) {
                        $rootScope.$apply();
                    }
                }
            }
        });
        this.urlChanges.subscribe(({ newUrl, newState }) => {
            const oldUrl = this.absUrl();
            const oldState = this.$$state;
            this.$$parse(newUrl);
            newUrl = this.absUrl();
            this.$$state = newState;
            const defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, newState, oldState)
                .defaultPrevented;
            // if the location was changed by a `$locationChangeStart` handler then stop
            // processing this location change
            if (this.absUrl() !== newUrl)
                return;
            // If default was prevented, set back to old state. This is the state that was locally
            // cached in the $location service.
            if (defaultPrevented) {
                this.$$parse(oldUrl);
                this.state(oldState);
                this.setBrowserUrlWithFallback(oldUrl, false, oldState);
                this.$$notifyChangeListeners(this.url(), this.$$state, oldUrl, oldState);
            }
            else {
                this.initalizing = false;
                $rootScope.$broadcast('$locationChangeSuccess', newUrl, oldUrl, newState, oldState);
                this.resetBrowserUpdate();
            }
            if (!$rootScope.$$phase) {
                $rootScope.$digest();
            }
        });
        // update browser
        $rootScope.$watch(() => {
            if (this.initalizing || this.updateBrowser) {
                this.updateBrowser = false;
                const oldUrl = this.browserUrl();
                const newUrl = this.absUrl();
                const oldState = this.browserState();
                let currentReplace = this.$$replace;
                const urlOrStateChanged = !this.urlCodec.areEqual(oldUrl, newUrl) || oldState !== this.$$state;
                // Fire location changes one time to on initialization. This must be done on the
                // next tick (thus inside $evalAsync()) in order for listeners to be registered
                // before the event fires. Mimicing behavior from $locationWatch:
                // https://github.com/angular/angular.js/blob/master/src/ng/location.js#L983
                if (this.initalizing || urlOrStateChanged) {
                    this.initalizing = false;
                    $rootScope.$evalAsync(() => {
                        // Get the new URL again since it could have changed due to async update
                        const newUrl = this.absUrl();
                        const defaultPrevented = $rootScope
                            .$broadcast('$locationChangeStart', newUrl, oldUrl, this.$$state, oldState)
                            .defaultPrevented;
                        // if the location was changed by a `$locationChangeStart` handler then stop
                        // processing this location change
                        if (this.absUrl() !== newUrl)
                            return;
                        if (defaultPrevented) {
                            this.$$parse(oldUrl);
                            this.$$state = oldState;
                        }
                        else {
                            // This block doesn't run when initalizing because it's going to perform the update to
                            // the URL which shouldn't be needed when initalizing.
                            if (urlOrStateChanged) {
                                this.setBrowserUrlWithFallback(newUrl, currentReplace, oldState === this.$$state ? null : this.$$state);
                                this.$$replace = false;
                            }
                            $rootScope.$broadcast('$locationChangeSuccess', newUrl, oldUrl, this.$$state, oldState);
                            if (urlOrStateChanged) {
                                this.$$notifyChangeListeners(this.url(), this.$$state, oldUrl, oldState);
                            }
                        }
                    });
                }
            }
            this.$$replace = false;
        });
    }
    resetBrowserUpdate() {
        this.$$replace = false;
        this.$$state = this.browserState();
        this.updateBrowser = false;
        this.lastBrowserUrl = this.browserUrl();
    }
    browserUrl(url, replace, state) {
        // In modern browsers `history.state` is `null` by default; treating it separately
        // from `undefined` would cause `$browser.url('/foo')` to change `history.state`
        // to undefined via `pushState`. Instead, let's change `undefined` to `null` here.
        if (typeof state === 'undefined') {
            state = null;
        }
        // setter
        if (url) {
            let sameState = this.lastHistoryState === state;
            // Normalize the inputted URL
            url = this.urlCodec.parse(url).href;
            // Don't change anything if previous and current URLs and states match.
            if (this.lastBrowserUrl === url && sameState) {
                return this;
            }
            this.lastBrowserUrl = url;
            this.lastHistoryState = state;
            // Remove server base from URL as the Angular APIs for updating URL require
            // it to be the path+.
            url = this.stripBaseUrl(this.getServerBase(), url) || url;
            // Set the URL
            if (replace) {
                this.locationStrategy.replaceState(state, '', url, '');
            }
            else {
                this.locationStrategy.pushState(state, '', url, '');
            }
            this.cacheState();
            return this;
            // getter
        }
        else {
            return this.platformLocation.href;
        }
    }
    cacheState() {
        // This should be the only place in $browser where `history.state` is read.
        this.cachedState = this.platformLocation.getState();
        if (typeof this.cachedState === 'undefined') {
            this.cachedState = null;
        }
        // Prevent callbacks fo fire twice if both hashchange & popstate were fired.
        if (deepEqual(this.cachedState, this.lastCachedState)) {
            this.cachedState = this.lastCachedState;
        }
        this.lastCachedState = this.cachedState;
        this.lastHistoryState = this.cachedState;
    }
    /**
     * This function emulates the $browser.state() function from AngularJS. It will cause
     * history.state to be cached unless changed with deep equality check.
     */
    browserState() {
        return this.cachedState;
    }
    stripBaseUrl(base, url) {
        if (url.startsWith(base)) {
            return url.substr(base.length);
        }
        return undefined;
    }
    getServerBase() {
        const { protocol, hostname, port } = this.platformLocation;
        const baseHref = this.locationStrategy.getBaseHref();
        let url = `${protocol}//${hostname}${port ? ':' + port : ''}${baseHref || '/'}`;
        return url.endsWith('/') ? url : url + '/';
    }
    parseAppUrl(url) {
        if (DOUBLE_SLASH_REGEX.test(url)) {
            throw new Error(`Bad Path - URL cannot start with double slashes: ${url}`);
        }
        let prefixed = (url.charAt(0) !== '/');
        if (prefixed) {
            url = '/' + url;
        }
        let match = this.urlCodec.parse(url, this.getServerBase());
        if (typeof match === 'string') {
            throw new Error(`Bad URL - Cannot parse URL: ${url}`);
        }
        let path = prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname;
        this.$$path = this.urlCodec.decodePath(path);
        this.$$search = this.urlCodec.decodeSearch(match.search);
        this.$$hash = this.urlCodec.decodeHash(match.hash);
        // make sure path starts with '/';
        if (this.$$path && this.$$path.charAt(0) !== '/') {
            this.$$path = '/' + this.$$path;
        }
    }
    /**
     * Registers listeners for URL changes. This API is used to catch updates performed by the
     * AngularJS framework. These changes are a subset of the `$locationChangeStart` and
     * `$locationChangeSuccess` events which fire when AngularJS updates its internally-referenced
     * version of the browser URL.
     *
     * It's possible for `$locationChange` events to happen, but for the browser URL
     * (window.location) to remain unchanged. This `onChange` callback will fire only when AngularJS
     * actually updates the browser URL (window.location).
     *
     * @param fn The callback function that is triggered for the listener when the URL changes.
     * @param err The callback function that is triggered when an error occurs.
     */
    onChange(fn, err = (e) => { }) {
        this.$$changeListeners.push([fn, err]);
    }
    /** @internal */
    $$notifyChangeListeners(url = '', state, oldUrl = '', oldState) {
        this.$$changeListeners.forEach(([fn, err]) => {
            try {
                fn(url, state, oldUrl, oldState);
            }
            catch (e) {
                err(e);
            }
        });
    }
    /**
     * Parses the provided URL, and sets the current URL to the parsed result.
     *
     * @param url The URL string.
     */
    $$parse(url) {
        let pathUrl;
        if (url.startsWith('/')) {
            pathUrl = url;
        }
        else {
            // Remove protocol & hostname if URL starts with it
            pathUrl = this.stripBaseUrl(this.getServerBase(), url);
        }
        if (typeof pathUrl === 'undefined') {
            throw new Error(`Invalid url "${url}", missing path prefix "${this.getServerBase()}".`);
        }
        this.parseAppUrl(pathUrl);
        if (!this.$$path) {
            this.$$path = '/';
        }
        this.composeUrls();
    }
    /**
     * Parses the provided URL and its relative URL.
     *
     * @param url The full URL string.
     * @param relHref A URL string relative to the full URL string.
     */
    $$parseLinkUrl(url, relHref) {
        // When relHref is passed, it should be a hash and is handled separately
        if (relHref && relHref[0] === '#') {
            this.hash(relHref.slice(1));
            return true;
        }
        let rewrittenUrl;
        let appUrl = this.stripBaseUrl(this.getServerBase(), url);
        if (typeof appUrl !== 'undefined') {
            rewrittenUrl = this.getServerBase() + appUrl;
        }
        else if (this.getServerBase() === url + '/') {
            rewrittenUrl = this.getServerBase();
        }
        // Set the URL
        if (rewrittenUrl) {
            this.$$parse(rewrittenUrl);
        }
        return !!rewrittenUrl;
    }
    setBrowserUrlWithFallback(url, replace, state) {
        const oldUrl = this.url();
        const oldState = this.$$state;
        try {
            this.browserUrl(url, replace, state);
            // Make sure $location.state() returns referentially identical (not just deeply equal)
            // state object; this makes possible quick checking if the state changed in the digest
            // loop. Checking deep equality would be too expensive.
            this.$$state = this.browserState();
        }
        catch (e) {
            // Restore old values if pushState fails
            this.url(oldUrl);
            this.$$state = oldState;
            throw e;
        }
    }
    composeUrls() {
        this.$$url = this.urlCodec.normalize(this.$$path, this.$$search, this.$$hash);
        this.$$absUrl = this.getServerBase() + this.$$url.substr(1); // remove '/' from front of URL
        this.updateBrowser = true;
    }
    /**
     * Retrieves the full URL representation with all segments encoded according to
     * rules specified in
     * [RFC 3986](https://tools.ietf.org/html/rfc3986).
     *
     *
     * ```js
     * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
     * let absUrl = $location.absUrl();
     * // => "http://example.com/#/some/path?foo=bar&baz=xoxo"
     * ```
     */
    absUrl() {
        return this.$$absUrl;
    }
    url(url) {
        if (typeof url === 'string') {
            if (!url.length) {
                url = '/';
            }
            const match = PATH_MATCH.exec(url);
            if (!match)
                return this;
            if (match[1] || url === '')
                this.path(this.urlCodec.decodePath(match[1]));
            if (match[2] || match[1] || url === '')
                this.search(match[3] || '');
            this.hash(match[5] || '');
            // Chainable method
            return this;
        }
        return this.$$url;
    }
    /**
     * Retrieves the protocol of the current URL.
     *
     * ```js
     * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
     * let protocol = $location.protocol();
     * // => "http"
     * ```
     */
    protocol() {
        return this.$$protocol;
    }
    /**
     * Retrieves the protocol of the current URL.
     *
     * In contrast to the non-AngularJS version `location.host` which returns `hostname:port`, this
     * returns the `hostname` portion only.
     *
     *
     * ```js
     * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
     * let host = $location.host();
     * // => "example.com"
     *
     * // given URL http://user:password@example.com:8080/#/some/path?foo=bar&baz=xoxo
     * host = $location.host();
     * // => "example.com"
     * host = location.host;
     * // => "example.com:8080"
     * ```
     */
    host() {
        return this.$$host;
    }
    /**
     * Retrieves the port of the current URL.
     *
     * ```js
     * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
     * let port = $location.port();
     * // => 80
     * ```
     */
    port() {
        return this.$$port;
    }
    path(path) {
        if (typeof path === 'undefined') {
            return this.$$path;
        }
        // null path converts to empty string. Prepend with "/" if needed.
        path = path !== null ? path.toString() : '';
        path = path.charAt(0) === '/' ? path : '/' + path;
        this.$$path = path;
        this.composeUrls();
        return this;
    }
    search(search, paramValue) {
        switch (arguments.length) {
            case 0:
                return this.$$search;
            case 1:
                if (typeof search === 'string' || typeof search === 'number') {
                    this.$$search = this.urlCodec.decodeSearch(search.toString());
                }
                else if (typeof search === 'object' && search !== null) {
                    // Copy the object so it's never mutated
                    search = { ...search };
                    // remove object undefined or null properties
                    for (const key in search) {
                        if (search[key] == null)
                            delete search[key];
                    }
                    this.$$search = search;
                }
                else {
                    throw new Error('LocationProvider.search(): First argument must be a string or an object.');
                }
                break;
            default:
                if (typeof search === 'string') {
                    const currentSearch = this.search();
                    if (typeof paramValue === 'undefined' || paramValue === null) {
                        delete currentSearch[search];
                        return this.search(currentSearch);
                    }
                    else {
                        currentSearch[search] = paramValue;
                        return this.search(currentSearch);
                    }
                }
        }
        this.composeUrls();
        return this;
    }
    hash(hash) {
        if (typeof hash === 'undefined') {
            return this.$$hash;
        }
        this.$$hash = hash !== null ? hash.toString() : '';
        this.composeUrls();
        return this;
    }
    /**
     * Changes to `$location` during the current `$digest` will replace the current
     * history record, instead of adding a new one.
     */
    replace() {
        this.$$replace = true;
        return this;
    }
    state(state) {
        if (typeof state === 'undefined') {
            return this.$$state;
        }
        this.$$state = state;
        return this;
    }
}
/**
 * The factory function used to create an instance of the `$locationShim` in Angular,
 * and provides an API-compatiable `$locationProvider` for AngularJS.
 *
 * @publicApi
 */
export class $locationShimProvider {
    constructor(ngUpgrade, location, platformLocation, urlCodec, locationStrategy) {
        this.ngUpgrade = ngUpgrade;
        this.location = location;
        this.platformLocation = platformLocation;
        this.urlCodec = urlCodec;
        this.locationStrategy = locationStrategy;
    }
    /**
     * Factory method that returns an instance of the $locationShim
     */
    $get() {
        return new $locationShim(this.ngUpgrade.$injector, this.location, this.platformLocation, this.urlCodec, this.locationStrategy);
    }
    /**
     * Stub method used to keep API compatible with AngularJS. This setting is configured through
     * the LocationUpgradeModule's `config` method in your Angular app.
     */
    hashPrefix(prefix) {
        throw new Error('Configure LocationUpgrade through LocationUpgradeModule.config method.');
    }
    /**
     * Stub method used to keep API compatible with AngularJS. This setting is configured through
     * the LocationUpgradeModule's `config` method in your Angular app.
     */
    html5Mode(mode) {
        throw new Error('Configure LocationUpgrade through LocationUpgradeModule.config method.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fc2hpbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi91cGdyYWRlL3NyYy9sb2NhdGlvbl9zaGltLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFHbkMsT0FBTyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXZELE1BQU0sVUFBVSxHQUFHLGdDQUFnQyxDQUFDO0FBQ3BELE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBQzNDLE1BQU0saUJBQWlCLEdBQUcsMkJBQTJCLENBQUM7QUFDdEQsTUFBTSxhQUFhLEdBQTRCO0lBQzdDLE9BQU8sRUFBRSxFQUFFO0lBQ1gsUUFBUSxFQUFFLEdBQUc7SUFDYixNQUFNLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFFRjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUF1QnhCLFlBQ0ksU0FBYyxFQUFVLFFBQWtCLEVBQVUsZ0JBQWtDLEVBQzlFLFFBQWtCLEVBQVUsZ0JBQWtDO1FBRDlDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzlFLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBeEJsRSxnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QixhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFFbkIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsYUFBUSxHQUFRLEVBQUUsQ0FBQztRQUNuQixX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Q0gsSUFBSTtRQUNGLE9BQU8sSUFBSSxhQUFhLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQzdFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVLENBQUMsTUFBZTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxJQUFVO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0VBQXdFLENBQUMsQ0FBQztJQUM1RixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtMb2NhdGlvbiwgTG9jYXRpb25TdHJhdGVneSwgUGxhdGZvcm1Mb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7VXBncmFkZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvdXBncmFkZS9zdGF0aWMnO1xuaW1wb3J0IHtSZXBsYXlTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtVcmxDb2RlY30gZnJvbSAnLi9wYXJhbXMnO1xuaW1wb3J0IHtkZWVwRXF1YWwsIGlzQW5jaG9yLCBpc1Byb21pc2V9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBQQVRIX01BVENIID0gL14oW14/I10qKShcXD8oW14jXSopKT8oIyguKikpPyQvO1xuY29uc3QgRE9VQkxFX1NMQVNIX1JFR0VYID0gL15cXHMqW1xcXFwvXXsyLH0vO1xuY29uc3QgSUdOT1JFX1VSSV9SRUdFWFAgPSAvXlxccyooamF2YXNjcmlwdHxtYWlsdG8pOi9pO1xuY29uc3QgREVGQVVMVF9QT1JUUzoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB7XG4gICdodHRwOic6IDgwLFxuICAnaHR0cHM6JzogNDQzLFxuICAnZnRwOic6IDIxXG59O1xuXG4vKipcbiAqIExvY2F0aW9uIHNlcnZpY2UgdGhhdCBwcm92aWRlcyBhIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIHRoZSAkbG9jYXRpb24gc2VydmljZVxuICogcHJvdmlkZWQgaW4gQW5ndWxhckpTLlxuICpcbiAqIEBzZWUgW1VzaW5nIHRoZSBBbmd1bGFyIFVuaWZpZWQgTG9jYXRpb24gU2VydmljZV0oZ3VpZGUvdXBncmFkZSN1c2luZy10aGUtdW5pZmllZC1hbmd1bGFyLWxvY2F0aW9uLXNlcnZpY2UpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgJGxvY2F0aW9uU2hpbSB7XG4gIHByaXZhdGUgaW5pdGFsaXppbmcgPSB0cnVlO1xuICBwcml2YXRlIHVwZGF0ZUJyb3dzZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSAkJGFic1VybDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgJCR1cmw6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlICQkcHJvdG9jb2w6IHN0cmluZztcbiAgcHJpdmF0ZSAkJGhvc3Q6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlICQkcG9ydDogbnVtYmVyfG51bGw7XG4gIHByaXZhdGUgJCRyZXBsYWNlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgJCRwYXRoOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSAkJHNlYXJjaDogYW55ID0gJyc7XG4gIHByaXZhdGUgJCRoYXNoOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSAkJHN0YXRlOiB1bmtub3duO1xuICBwcml2YXRlICQkY2hhbmdlTGlzdGVuZXJzOiBbXG4gICAgKCh1cmw6IHN0cmluZywgc3RhdGU6IHVua25vd24sIG9sZFVybDogc3RyaW5nLCBvbGRTdGF0ZTogdW5rbm93biwgZXJyPzogKGU6IEVycm9yKSA9PiB2b2lkKSA9PlxuICAgICAgICAgdm9pZCksXG4gICAgKGU6IEVycm9yKSA9PiB2b2lkXG4gIF1bXSA9IFtdO1xuXG4gIHByaXZhdGUgY2FjaGVkU3RhdGU6IHVua25vd24gPSBudWxsO1xuXG4gIHByaXZhdGUgdXJsQ2hhbmdlcyA9IG5ldyBSZXBsYXlTdWJqZWN0PHtuZXdVcmw6IHN0cmluZywgbmV3U3RhdGU6IHVua25vd259PigxKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgICRpbmplY3RvcjogYW55LCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBwbGF0Zm9ybUxvY2F0aW9uOiBQbGF0Zm9ybUxvY2F0aW9uLFxuICAgICAgcHJpdmF0ZSB1cmxDb2RlYzogVXJsQ29kZWMsIHByaXZhdGUgbG9jYXRpb25TdHJhdGVneTogTG9jYXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IGluaXRpYWxVcmwgPSB0aGlzLmJyb3dzZXJVcmwoKTtcblxuICAgIGxldCBwYXJzZWRVcmwgPSB0aGlzLnVybENvZGVjLnBhcnNlKGluaXRpYWxVcmwpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJzZWRVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyAnSW52YWxpZCBVUkwnO1xuICAgIH1cblxuICAgIHRoaXMuJCRwcm90b2NvbCA9IHBhcnNlZFVybC5wcm90b2NvbDtcbiAgICB0aGlzLiQkaG9zdCA9IHBhcnNlZFVybC5ob3N0bmFtZTtcbiAgICB0aGlzLiQkcG9ydCA9IHBhcnNlSW50KHBhcnNlZFVybC5wb3J0KSB8fCBERUZBVUxUX1BPUlRTW3BhcnNlZFVybC5wcm90b2NvbF0gfHwgbnVsbDtcblxuICAgIHRoaXMuJCRwYXJzZUxpbmtVcmwoaW5pdGlhbFVybCwgaW5pdGlhbFVybCk7XG4gICAgdGhpcy5jYWNoZVN0YXRlKCk7XG4gICAgdGhpcy4kJHN0YXRlID0gdGhpcy5icm93c2VyU3RhdGUoKTtcblxuICAgIHRoaXMubG9jYXRpb24ub25VcmxDaGFuZ2UoKG5ld1VybCwgbmV3U3RhdGUpID0+IHtcbiAgICAgIHRoaXMudXJsQ2hhbmdlcy5uZXh0KHtuZXdVcmwsIG5ld1N0YXRlfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoaXNQcm9taXNlKCRpbmplY3RvcikpIHtcbiAgICAgICRpbmplY3Rvci50aGVuKCRpID0+IHRoaXMuaW5pdGlhbGl6ZSgkaSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRpYWxpemUoJGluamVjdG9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemUoJGluamVjdG9yOiBhbnkpIHtcbiAgICBjb25zdCAkcm9vdFNjb3BlID0gJGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpO1xuICAgIGNvbnN0ICRyb290RWxlbWVudCA9ICRpbmplY3Rvci5nZXQoJyRyb290RWxlbWVudCcpO1xuXG4gICAgJHJvb3RFbGVtZW50Lm9uKCdjbGljaycsIChldmVudDogYW55KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5IHx8IGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LndoaWNoID09PSAyIHx8XG4gICAgICAgICAgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGVsbTogKE5vZGUmUGFyZW50Tm9kZSl8bnVsbCA9IGV2ZW50LnRhcmdldDtcblxuICAgICAgLy8gdHJhdmVyc2UgdGhlIERPTSB1cCB0byBmaW5kIGZpcnN0IEEgdGFnXG4gICAgICB3aGlsZSAoZWxtICYmIGVsbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnYScpIHtcbiAgICAgICAgLy8gaWdub3JlIHJld3JpdGluZyBpZiBubyBBIHRhZyAocmVhY2hlZCByb290IGVsZW1lbnQsIG9yIG5vIHBhcmVudCAtIHJlbW92ZWQgZnJvbSBkb2N1bWVudClcbiAgICAgICAgaWYgKGVsbSA9PT0gJHJvb3RFbGVtZW50WzBdIHx8ICEoZWxtID0gZWxtLnBhcmVudE5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNBbmNob3IoZWxtKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFic0hyZWYgPSBlbG0uaHJlZjtcbiAgICAgIGNvbnN0IHJlbEhyZWYgPSBlbG0uZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgIC8vIElnbm9yZSB3aGVuIHVybCBpcyBzdGFydGVkIHdpdGggamF2YXNjcmlwdDogb3IgbWFpbHRvOlxuICAgICAgaWYgKElHTk9SRV9VUklfUkVHRVhQLnRlc3QoYWJzSHJlZikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWJzSHJlZiAmJiAhZWxtLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgJiYgIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgIGlmICh0aGlzLiQkcGFyc2VMaW5rVXJsKGFic0hyZWYsIHJlbEhyZWYpKSB7XG4gICAgICAgICAgLy8gV2UgZG8gYSBwcmV2ZW50RGVmYXVsdCBmb3IgYWxsIHVybHMgdGhhdCBhcmUgcGFydCBvZiB0aGUgQW5ndWxhckpTIGFwcGxpY2F0aW9uLFxuICAgICAgICAgIC8vIGluIGh0bWw1bW9kZSBhbmQgYWxzbyB3aXRob3V0LCBzbyB0aGF0IHdlIGFyZSBhYmxlIHRvIGFib3J0IG5hdmlnYXRpb24gd2l0aG91dFxuICAgICAgICAgIC8vIGdldHRpbmcgZG91YmxlIGVudHJpZXMgaW4gdGhlIGxvY2F0aW9uIGhpc3RvcnkuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAvLyB1cGRhdGUgbG9jYXRpb24gbWFudWFsbHlcbiAgICAgICAgICBpZiAodGhpcy5hYnNVcmwoKSAhPT0gdGhpcy5icm93c2VyVXJsKCkpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnVybENoYW5nZXMuc3Vic2NyaWJlKCh7bmV3VXJsLCBuZXdTdGF0ZX0pID0+IHtcbiAgICAgIGNvbnN0IG9sZFVybCA9IHRoaXMuYWJzVXJsKCk7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuJCRzdGF0ZTtcbiAgICAgIHRoaXMuJCRwYXJzZShuZXdVcmwpO1xuICAgICAgbmV3VXJsID0gdGhpcy5hYnNVcmwoKTtcbiAgICAgIHRoaXMuJCRzdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgY29uc3QgZGVmYXVsdFByZXZlbnRlZCA9XG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIG5ld1VybCwgb2xkVXJsLCBuZXdTdGF0ZSwgb2xkU3RhdGUpXG4gICAgICAgICAgICAgIC5kZWZhdWx0UHJldmVudGVkO1xuXG4gICAgICAvLyBpZiB0aGUgbG9jYXRpb24gd2FzIGNoYW5nZWQgYnkgYSBgJGxvY2F0aW9uQ2hhbmdlU3RhcnRgIGhhbmRsZXIgdGhlbiBzdG9wXG4gICAgICAvLyBwcm9jZXNzaW5nIHRoaXMgbG9jYXRpb24gY2hhbmdlXG4gICAgICBpZiAodGhpcy5hYnNVcmwoKSAhPT0gbmV3VXJsKSByZXR1cm47XG5cbiAgICAgIC8vIElmIGRlZmF1bHQgd2FzIHByZXZlbnRlZCwgc2V0IGJhY2sgdG8gb2xkIHN0YXRlLiBUaGlzIGlzIHRoZSBzdGF0ZSB0aGF0IHdhcyBsb2NhbGx5XG4gICAgICAvLyBjYWNoZWQgaW4gdGhlICRsb2NhdGlvbiBzZXJ2aWNlLlxuICAgICAgaWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgdGhpcy4kJHBhcnNlKG9sZFVybCk7XG4gICAgICAgIHRoaXMuc3RhdGUob2xkU3RhdGUpO1xuICAgICAgICB0aGlzLnNldEJyb3dzZXJVcmxXaXRoRmFsbGJhY2sob2xkVXJsLCBmYWxzZSwgb2xkU3RhdGUpO1xuICAgICAgICB0aGlzLiQkbm90aWZ5Q2hhbmdlTGlzdGVuZXJzKHRoaXMudXJsKCksIHRoaXMuJCRzdGF0ZSwgb2xkVXJsLCBvbGRTdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluaXRhbGl6aW5nID0gZmFsc2U7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIG5ld1VybCwgb2xkVXJsLCBuZXdTdGF0ZSwgb2xkU3RhdGUpO1xuICAgICAgICB0aGlzLnJlc2V0QnJvd3NlclVwZGF0ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCEkcm9vdFNjb3BlLiQkcGhhc2UpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgYnJvd3NlclxuICAgICRyb290U2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmluaXRhbGl6aW5nIHx8IHRoaXMudXBkYXRlQnJvd3Nlcikge1xuICAgICAgICB0aGlzLnVwZGF0ZUJyb3dzZXIgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBvbGRVcmwgPSB0aGlzLmJyb3dzZXJVcmwoKTtcbiAgICAgICAgY29uc3QgbmV3VXJsID0gdGhpcy5hYnNVcmwoKTtcbiAgICAgICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmJyb3dzZXJTdGF0ZSgpO1xuICAgICAgICBsZXQgY3VycmVudFJlcGxhY2UgPSB0aGlzLiQkcmVwbGFjZTtcblxuICAgICAgICBjb25zdCB1cmxPclN0YXRlQ2hhbmdlZCA9XG4gICAgICAgICAgICAhdGhpcy51cmxDb2RlYy5hcmVFcXVhbChvbGRVcmwsIG5ld1VybCkgfHwgb2xkU3RhdGUgIT09IHRoaXMuJCRzdGF0ZTtcblxuICAgICAgICAvLyBGaXJlIGxvY2F0aW9uIGNoYW5nZXMgb25lIHRpbWUgdG8gb24gaW5pdGlhbGl6YXRpb24uIFRoaXMgbXVzdCBiZSBkb25lIG9uIHRoZVxuICAgICAgICAvLyBuZXh0IHRpY2sgKHRodXMgaW5zaWRlICRldmFsQXN5bmMoKSkgaW4gb3JkZXIgZm9yIGxpc3RlbmVycyB0byBiZSByZWdpc3RlcmVkXG4gICAgICAgIC8vIGJlZm9yZSB0aGUgZXZlbnQgZmlyZXMuIE1pbWljaW5nIGJlaGF2aW9yIGZyb20gJGxvY2F0aW9uV2F0Y2g6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9tYXN0ZXIvc3JjL25nL2xvY2F0aW9uLmpzI0w5ODNcbiAgICAgICAgaWYgKHRoaXMuaW5pdGFsaXppbmcgfHwgdXJsT3JTdGF0ZUNoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLmluaXRhbGl6aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmMoKCkgPT4ge1xuICAgICAgICAgICAgLy8gR2V0IHRoZSBuZXcgVVJMIGFnYWluIHNpbmNlIGl0IGNvdWxkIGhhdmUgY2hhbmdlZCBkdWUgdG8gYXN5bmMgdXBkYXRlXG4gICAgICAgICAgICBjb25zdCBuZXdVcmwgPSB0aGlzLmFic1VybCgpO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFByZXZlbnRlZCA9XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZVxuICAgICAgICAgICAgICAgICAgICAuJGJyb2FkY2FzdCgnJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBuZXdVcmwsIG9sZFVybCwgdGhpcy4kJHN0YXRlLCBvbGRTdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLmRlZmF1bHRQcmV2ZW50ZWQ7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBsb2NhdGlvbiB3YXMgY2hhbmdlZCBieSBhIGAkbG9jYXRpb25DaGFuZ2VTdGFydGAgaGFuZGxlciB0aGVuIHN0b3BcbiAgICAgICAgICAgIC8vIHByb2Nlc3NpbmcgdGhpcyBsb2NhdGlvbiBjaGFuZ2VcbiAgICAgICAgICAgIGlmICh0aGlzLmFic1VybCgpICE9PSBuZXdVcmwpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy4kJHBhcnNlKG9sZFVybCk7XG4gICAgICAgICAgICAgIHRoaXMuJCRzdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBibG9jayBkb2Vzbid0IHJ1biB3aGVuIGluaXRhbGl6aW5nIGJlY2F1c2UgaXQncyBnb2luZyB0byBwZXJmb3JtIHRoZSB1cGRhdGUgdG9cbiAgICAgICAgICAgICAgLy8gdGhlIFVSTCB3aGljaCBzaG91bGRuJ3QgYmUgbmVlZGVkIHdoZW4gaW5pdGFsaXppbmcuXG4gICAgICAgICAgICAgIGlmICh1cmxPclN0YXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QnJvd3NlclVybFdpdGhGYWxsYmFjayhcbiAgICAgICAgICAgICAgICAgICAgbmV3VXJsLCBjdXJyZW50UmVwbGFjZSwgb2xkU3RhdGUgPT09IHRoaXMuJCRzdGF0ZSA/IG51bGwgOiB0aGlzLiQkc3RhdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuJCRyZXBsYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFxuICAgICAgICAgICAgICAgICAgJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBuZXdVcmwsIG9sZFVybCwgdGhpcy4kJHN0YXRlLCBvbGRTdGF0ZSk7XG4gICAgICAgICAgICAgIGlmICh1cmxPclN0YXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRub3RpZnlDaGFuZ2VMaXN0ZW5lcnModGhpcy51cmwoKSwgdGhpcy4kJHN0YXRlLCBvbGRVcmwsIG9sZFN0YXRlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLiQkcmVwbGFjZSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldEJyb3dzZXJVcGRhdGUoKSB7XG4gICAgdGhpcy4kJHJlcGxhY2UgPSBmYWxzZTtcbiAgICB0aGlzLiQkc3RhdGUgPSB0aGlzLmJyb3dzZXJTdGF0ZSgpO1xuICAgIHRoaXMudXBkYXRlQnJvd3NlciA9IGZhbHNlO1xuICAgIHRoaXMubGFzdEJyb3dzZXJVcmwgPSB0aGlzLmJyb3dzZXJVcmwoKTtcbiAgfVxuXG4gIHByaXZhdGUgbGFzdEhpc3RvcnlTdGF0ZTogdW5rbm93bjtcbiAgcHJpdmF0ZSBsYXN0QnJvd3NlclVybDogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgYnJvd3NlclVybCgpOiBzdHJpbmc7XG4gIHByaXZhdGUgYnJvd3NlclVybCh1cmw6IHN0cmluZywgcmVwbGFjZT86IGJvb2xlYW4sIHN0YXRlPzogdW5rbm93bik6IHRoaXM7XG4gIHByaXZhdGUgYnJvd3NlclVybCh1cmw/OiBzdHJpbmcsIHJlcGxhY2U/OiBib29sZWFuLCBzdGF0ZT86IHVua25vd24pIHtcbiAgICAvLyBJbiBtb2Rlcm4gYnJvd3NlcnMgYGhpc3Rvcnkuc3RhdGVgIGlzIGBudWxsYCBieSBkZWZhdWx0OyB0cmVhdGluZyBpdCBzZXBhcmF0ZWx5XG4gICAgLy8gZnJvbSBgdW5kZWZpbmVkYCB3b3VsZCBjYXVzZSBgJGJyb3dzZXIudXJsKCcvZm9vJylgIHRvIGNoYW5nZSBgaGlzdG9yeS5zdGF0ZWBcbiAgICAvLyB0byB1bmRlZmluZWQgdmlhIGBwdXNoU3RhdGVgLiBJbnN0ZWFkLCBsZXQncyBjaGFuZ2UgYHVuZGVmaW5lZGAgdG8gYG51bGxgIGhlcmUuXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBzZXR0ZXJcbiAgICBpZiAodXJsKSB7XG4gICAgICBsZXQgc2FtZVN0YXRlID0gdGhpcy5sYXN0SGlzdG9yeVN0YXRlID09PSBzdGF0ZTtcblxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBpbnB1dHRlZCBVUkxcbiAgICAgIHVybCA9IHRoaXMudXJsQ29kZWMucGFyc2UodXJsKS5ocmVmO1xuXG4gICAgICAvLyBEb24ndCBjaGFuZ2UgYW55dGhpbmcgaWYgcHJldmlvdXMgYW5kIGN1cnJlbnQgVVJMcyBhbmQgc3RhdGVzIG1hdGNoLlxuICAgICAgaWYgKHRoaXMubGFzdEJyb3dzZXJVcmwgPT09IHVybCAmJiBzYW1lU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RCcm93c2VyVXJsID0gdXJsO1xuICAgICAgdGhpcy5sYXN0SGlzdG9yeVN0YXRlID0gc3RhdGU7XG5cbiAgICAgIC8vIFJlbW92ZSBzZXJ2ZXIgYmFzZSBmcm9tIFVSTCBhcyB0aGUgQW5ndWxhciBBUElzIGZvciB1cGRhdGluZyBVUkwgcmVxdWlyZVxuICAgICAgLy8gaXQgdG8gYmUgdGhlIHBhdGgrLlxuICAgICAgdXJsID0gdGhpcy5zdHJpcEJhc2VVcmwodGhpcy5nZXRTZXJ2ZXJCYXNlKCksIHVybCkgfHwgdXJsO1xuXG4gICAgICAvLyBTZXQgdGhlIFVSTFxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvblN0cmF0ZWd5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgJycsIHVybCwgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvblN0cmF0ZWd5LnB1c2hTdGF0ZShzdGF0ZSwgJycsIHVybCwgJycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhY2hlU3RhdGUoKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAvLyBnZXR0ZXJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucGxhdGZvcm1Mb2NhdGlvbi5ocmVmO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgdmFyaWFibGUgc2hvdWxkIGJlIHVzZWQgKm9ubHkqIGluc2lkZSB0aGUgY2FjaGVTdGF0ZSBmdW5jdGlvbi5cbiAgcHJpdmF0ZSBsYXN0Q2FjaGVkU3RhdGU6IHVua25vd24gPSBudWxsO1xuICBwcml2YXRlIGNhY2hlU3RhdGUoKSB7XG4gICAgLy8gVGhpcyBzaG91bGQgYmUgdGhlIG9ubHkgcGxhY2UgaW4gJGJyb3dzZXIgd2hlcmUgYGhpc3Rvcnkuc3RhdGVgIGlzIHJlYWQuXG4gICAgdGhpcy5jYWNoZWRTdGF0ZSA9IHRoaXMucGxhdGZvcm1Mb2NhdGlvbi5nZXRTdGF0ZSgpO1xuICAgIGlmICh0eXBlb2YgdGhpcy5jYWNoZWRTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuY2FjaGVkU3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgY2FsbGJhY2tzIGZvIGZpcmUgdHdpY2UgaWYgYm90aCBoYXNoY2hhbmdlICYgcG9wc3RhdGUgd2VyZSBmaXJlZC5cbiAgICBpZiAoZGVlcEVxdWFsKHRoaXMuY2FjaGVkU3RhdGUsIHRoaXMubGFzdENhY2hlZFN0YXRlKSkge1xuICAgICAgdGhpcy5jYWNoZWRTdGF0ZSA9IHRoaXMubGFzdENhY2hlZFN0YXRlO1xuICAgIH1cblxuICAgIHRoaXMubGFzdENhY2hlZFN0YXRlID0gdGhpcy5jYWNoZWRTdGF0ZTtcbiAgICB0aGlzLmxhc3RIaXN0b3J5U3RhdGUgPSB0aGlzLmNhY2hlZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gZW11bGF0ZXMgdGhlICRicm93c2VyLnN0YXRlKCkgZnVuY3Rpb24gZnJvbSBBbmd1bGFySlMuIEl0IHdpbGwgY2F1c2VcbiAgICogaGlzdG9yeS5zdGF0ZSB0byBiZSBjYWNoZWQgdW5sZXNzIGNoYW5nZWQgd2l0aCBkZWVwIGVxdWFsaXR5IGNoZWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBicm93c2VyU3RhdGUoKTogdW5rbm93biB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGVkU3RhdGU7XG4gIH1cblxuICBwcml2YXRlIHN0cmlwQmFzZVVybChiYXNlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XG4gICAgaWYgKHVybC5zdGFydHNXaXRoKGJhc2UpKSB7XG4gICAgICByZXR1cm4gdXJsLnN1YnN0cihiYXNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGdldFNlcnZlckJhc2UoKSB7XG4gICAgY29uc3Qge3Byb3RvY29sLCBob3N0bmFtZSwgcG9ydH0gPSB0aGlzLnBsYXRmb3JtTG9jYXRpb247XG4gICAgY29uc3QgYmFzZUhyZWYgPSB0aGlzLmxvY2F0aW9uU3RyYXRlZ3kuZ2V0QmFzZUhyZWYoKTtcbiAgICBsZXQgdXJsID0gYCR7cHJvdG9jb2x9Ly8ke2hvc3RuYW1lfSR7cG9ydCA/ICc6JyArIHBvcnQgOiAnJ30ke2Jhc2VIcmVmIHx8ICcvJ31gO1xuICAgIHJldHVybiB1cmwuZW5kc1dpdGgoJy8nKSA/IHVybCA6IHVybCArICcvJztcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VBcHBVcmwodXJsOiBzdHJpbmcpIHtcbiAgICBpZiAoRE9VQkxFX1NMQVNIX1JFR0VYLnRlc3QodXJsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgUGF0aCAtIFVSTCBjYW5ub3Qgc3RhcnQgd2l0aCBkb3VibGUgc2xhc2hlczogJHt1cmx9YCk7XG4gICAgfVxuXG4gICAgbGV0IHByZWZpeGVkID0gKHVybC5jaGFyQXQoMCkgIT09ICcvJyk7XG4gICAgaWYgKHByZWZpeGVkKSB7XG4gICAgICB1cmwgPSAnLycgKyB1cmw7XG4gICAgfVxuICAgIGxldCBtYXRjaCA9IHRoaXMudXJsQ29kZWMucGFyc2UodXJsLCB0aGlzLmdldFNlcnZlckJhc2UoKSk7XG4gICAgaWYgKHR5cGVvZiBtYXRjaCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQmFkIFVSTCAtIENhbm5vdCBwYXJzZSBVUkw6ICR7dXJsfWApO1xuICAgIH1cbiAgICBsZXQgcGF0aCA9XG4gICAgICAgIHByZWZpeGVkICYmIG1hdGNoLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gbWF0Y2gucGF0aG5hbWUuc3Vic3RyaW5nKDEpIDogbWF0Y2gucGF0aG5hbWU7XG4gICAgdGhpcy4kJHBhdGggPSB0aGlzLnVybENvZGVjLmRlY29kZVBhdGgocGF0aCk7XG4gICAgdGhpcy4kJHNlYXJjaCA9IHRoaXMudXJsQ29kZWMuZGVjb2RlU2VhcmNoKG1hdGNoLnNlYXJjaCk7XG4gICAgdGhpcy4kJGhhc2ggPSB0aGlzLnVybENvZGVjLmRlY29kZUhhc2gobWF0Y2guaGFzaCk7XG5cbiAgICAvLyBtYWtlIHN1cmUgcGF0aCBzdGFydHMgd2l0aCAnLyc7XG4gICAgaWYgKHRoaXMuJCRwYXRoICYmIHRoaXMuJCRwYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLiQkcGF0aCA9ICcvJyArIHRoaXMuJCRwYXRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgbGlzdGVuZXJzIGZvciBVUkwgY2hhbmdlcy4gVGhpcyBBUEkgaXMgdXNlZCB0byBjYXRjaCB1cGRhdGVzIHBlcmZvcm1lZCBieSB0aGVcbiAgICogQW5ndWxhckpTIGZyYW1ld29yay4gVGhlc2UgY2hhbmdlcyBhcmUgYSBzdWJzZXQgb2YgdGhlIGAkbG9jYXRpb25DaGFuZ2VTdGFydGAgYW5kXG4gICAqIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYCBldmVudHMgd2hpY2ggZmlyZSB3aGVuIEFuZ3VsYXJKUyB1cGRhdGVzIGl0cyBpbnRlcm5hbGx5LXJlZmVyZW5jZWRcbiAgICogdmVyc2lvbiBvZiB0aGUgYnJvd3NlciBVUkwuXG4gICAqXG4gICAqIEl0J3MgcG9zc2libGUgZm9yIGAkbG9jYXRpb25DaGFuZ2VgIGV2ZW50cyB0byBoYXBwZW4sIGJ1dCBmb3IgdGhlIGJyb3dzZXIgVVJMXG4gICAqICh3aW5kb3cubG9jYXRpb24pIHRvIHJlbWFpbiB1bmNoYW5nZWQuIFRoaXMgYG9uQ2hhbmdlYCBjYWxsYmFjayB3aWxsIGZpcmUgb25seSB3aGVuIEFuZ3VsYXJKU1xuICAgKiBhY3R1YWxseSB1cGRhdGVzIHRoZSBicm93c2VyIFVSTCAod2luZG93LmxvY2F0aW9uKS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBmb3IgdGhlIGxpc3RlbmVyIHdoZW4gdGhlIFVSTCBjaGFuZ2VzLlxuICAgKiBAcGFyYW0gZXJyIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCB3aGVuIGFuIGVycm9yIG9jY3Vycy5cbiAgICovXG4gIG9uQ2hhbmdlKFxuICAgICAgZm46ICh1cmw6IHN0cmluZywgc3RhdGU6IHVua25vd24sIG9sZFVybDogc3RyaW5nLCBvbGRTdGF0ZTogdW5rbm93bikgPT4gdm9pZCxcbiAgICAgIGVycjogKGU6IEVycm9yKSA9PiB2b2lkID0gKGU6IEVycm9yKSA9PiB7fSkge1xuICAgIHRoaXMuJCRjaGFuZ2VMaXN0ZW5lcnMucHVzaChbZm4sIGVycl0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAkJG5vdGlmeUNoYW5nZUxpc3RlbmVycyhcbiAgICAgIHVybDogc3RyaW5nID0gJycsIHN0YXRlOiB1bmtub3duLCBvbGRVcmw6IHN0cmluZyA9ICcnLCBvbGRTdGF0ZTogdW5rbm93bikge1xuICAgIHRoaXMuJCRjaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgoW2ZuLCBlcnJdKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBmbih1cmwsIHN0YXRlLCBvbGRVcmwsIG9sZFN0YXRlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyKGUgYXMgRXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgVVJMLCBhbmQgc2V0cyB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHBhcnNlZCByZXN1bHQuXG4gICAqXG4gICAqIEBwYXJhbSB1cmwgVGhlIFVSTCBzdHJpbmcuXG4gICAqL1xuICAkJHBhcnNlKHVybDogc3RyaW5nKSB7XG4gICAgbGV0IHBhdGhVcmw6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgaWYgKHVybC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHBhdGhVcmwgPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSBwcm90b2NvbCAmIGhvc3RuYW1lIGlmIFVSTCBzdGFydHMgd2l0aCBpdFxuICAgICAgcGF0aFVybCA9IHRoaXMuc3RyaXBCYXNlVXJsKHRoaXMuZ2V0U2VydmVyQmFzZSgpLCB1cmwpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhdGhVcmwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdXJsIFwiJHt1cmx9XCIsIG1pc3NpbmcgcGF0aCBwcmVmaXggXCIke3RoaXMuZ2V0U2VydmVyQmFzZSgpfVwiLmApO1xuICAgIH1cblxuICAgIHRoaXMucGFyc2VBcHBVcmwocGF0aFVybCk7XG5cbiAgICBpZiAoIXRoaXMuJCRwYXRoKSB7XG4gICAgICB0aGlzLiQkcGF0aCA9ICcvJztcbiAgICB9XG4gICAgdGhpcy5jb21wb3NlVXJscygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgVVJMIGFuZCBpdHMgcmVsYXRpdmUgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFRoZSBmdWxsIFVSTCBzdHJpbmcuXG4gICAqIEBwYXJhbSByZWxIcmVmIEEgVVJMIHN0cmluZyByZWxhdGl2ZSB0byB0aGUgZnVsbCBVUkwgc3RyaW5nLlxuICAgKi9cbiAgJCRwYXJzZUxpbmtVcmwodXJsOiBzdHJpbmcsIHJlbEhyZWY/OiBzdHJpbmd8bnVsbCk6IGJvb2xlYW4ge1xuICAgIC8vIFdoZW4gcmVsSHJlZiBpcyBwYXNzZWQsIGl0IHNob3VsZCBiZSBhIGhhc2ggYW5kIGlzIGhhbmRsZWQgc2VwYXJhdGVseVxuICAgIGlmIChyZWxIcmVmICYmIHJlbEhyZWZbMF0gPT09ICcjJykge1xuICAgICAgdGhpcy5oYXNoKHJlbEhyZWYuc2xpY2UoMSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCByZXdyaXR0ZW5Vcmw7XG4gICAgbGV0IGFwcFVybCA9IHRoaXMuc3RyaXBCYXNlVXJsKHRoaXMuZ2V0U2VydmVyQmFzZSgpLCB1cmwpO1xuICAgIGlmICh0eXBlb2YgYXBwVXJsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV3cml0dGVuVXJsID0gdGhpcy5nZXRTZXJ2ZXJCYXNlKCkgKyBhcHBVcmw7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFNlcnZlckJhc2UoKSA9PT0gdXJsICsgJy8nKSB7XG4gICAgICByZXdyaXR0ZW5VcmwgPSB0aGlzLmdldFNlcnZlckJhc2UoKTtcbiAgICB9XG4gICAgLy8gU2V0IHRoZSBVUkxcbiAgICBpZiAocmV3cml0dGVuVXJsKSB7XG4gICAgICB0aGlzLiQkcGFyc2UocmV3cml0dGVuVXJsKTtcbiAgICB9XG4gICAgcmV0dXJuICEhcmV3cml0dGVuVXJsO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRCcm93c2VyVXJsV2l0aEZhbGxiYWNrKHVybDogc3RyaW5nLCByZXBsYWNlOiBib29sZWFuLCBzdGF0ZTogdW5rbm93bikge1xuICAgIGNvbnN0IG9sZFVybCA9IHRoaXMudXJsKCk7XG4gICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLiQkc3RhdGU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYnJvd3NlclVybCh1cmwsIHJlcGxhY2UsIHN0YXRlKTtcblxuICAgICAgLy8gTWFrZSBzdXJlICRsb2NhdGlvbi5zdGF0ZSgpIHJldHVybnMgcmVmZXJlbnRpYWxseSBpZGVudGljYWwgKG5vdCBqdXN0IGRlZXBseSBlcXVhbClcbiAgICAgIC8vIHN0YXRlIG9iamVjdDsgdGhpcyBtYWtlcyBwb3NzaWJsZSBxdWljayBjaGVja2luZyBpZiB0aGUgc3RhdGUgY2hhbmdlZCBpbiB0aGUgZGlnZXN0XG4gICAgICAvLyBsb29wLiBDaGVja2luZyBkZWVwIGVxdWFsaXR5IHdvdWxkIGJlIHRvbyBleHBlbnNpdmUuXG4gICAgICB0aGlzLiQkc3RhdGUgPSB0aGlzLmJyb3dzZXJTdGF0ZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFJlc3RvcmUgb2xkIHZhbHVlcyBpZiBwdXNoU3RhdGUgZmFpbHNcbiAgICAgIHRoaXMudXJsKG9sZFVybCk7XG4gICAgICB0aGlzLiQkc3RhdGUgPSBvbGRTdGF0ZTtcblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXBvc2VVcmxzKCkge1xuICAgIHRoaXMuJCR1cmwgPSB0aGlzLnVybENvZGVjLm5vcm1hbGl6ZSh0aGlzLiQkcGF0aCwgdGhpcy4kJHNlYXJjaCwgdGhpcy4kJGhhc2gpO1xuICAgIHRoaXMuJCRhYnNVcmwgPSB0aGlzLmdldFNlcnZlckJhc2UoKSArIHRoaXMuJCR1cmwuc3Vic3RyKDEpOyAgLy8gcmVtb3ZlICcvJyBmcm9tIGZyb250IG9mIFVSTFxuICAgIHRoaXMudXBkYXRlQnJvd3NlciA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBmdWxsIFVSTCByZXByZXNlbnRhdGlvbiB3aXRoIGFsbCBzZWdtZW50cyBlbmNvZGVkIGFjY29yZGluZyB0b1xuICAgKiBydWxlcyBzcGVjaWZpZWQgaW5cbiAgICogW1JGQyAzOTg2XShodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NikuXG4gICAqXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGdpdmVuIFVSTCBodHRwOi8vZXhhbXBsZS5jb20vIy9zb21lL3BhdGg/Zm9vPWJhciZiYXo9eG94b1xuICAgKiBsZXQgYWJzVXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgKiAvLyA9PiBcImh0dHA6Ly9leGFtcGxlLmNvbS8jL3NvbWUvcGF0aD9mb289YmFyJmJhej14b3hvXCJcbiAgICogYGBgXG4gICAqL1xuICBhYnNVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4kJGFic1VybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgVVJMLCBvciBzZXRzIGEgbmV3IFVSTC4gV2hlbiBzZXR0aW5nIGEgVVJMLFxuICAgKiBjaGFuZ2VzIHRoZSBwYXRoLCBzZWFyY2gsIGFuZCBoYXNoLCBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byBpdHMgb3duIGluc3RhbmNlLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAvLyBnaXZlbiBVUkwgaHR0cDovL2V4YW1wbGUuY29tLyMvc29tZS9wYXRoP2Zvbz1iYXImYmF6PXhveG9cbiAgICogbGV0IHVybCA9ICRsb2NhdGlvbi51cmwoKTtcbiAgICogLy8gPT4gXCIvc29tZS9wYXRoP2Zvbz1iYXImYmF6PXhveG9cIlxuICAgKiBgYGBcbiAgICovXG4gIHVybCgpOiBzdHJpbmc7XG4gIHVybCh1cmw6IHN0cmluZyk6IHRoaXM7XG4gIHVybCh1cmw/OiBzdHJpbmcpOiBzdHJpbmd8dGhpcyB7XG4gICAgaWYgKHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXVybC5sZW5ndGgpIHtcbiAgICAgICAgdXJsID0gJy8nO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaCA9IFBBVEhfTUFUQ0guZXhlYyh1cmwpO1xuICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuIHRoaXM7XG4gICAgICBpZiAobWF0Y2hbMV0gfHwgdXJsID09PSAnJykgdGhpcy5wYXRoKHRoaXMudXJsQ29kZWMuZGVjb2RlUGF0aChtYXRjaFsxXSkpO1xuICAgICAgaWYgKG1hdGNoWzJdIHx8IG1hdGNoWzFdIHx8IHVybCA9PT0gJycpIHRoaXMuc2VhcmNoKG1hdGNoWzNdIHx8ICcnKTtcbiAgICAgIHRoaXMuaGFzaChtYXRjaFs1XSB8fCAnJyk7XG5cbiAgICAgIC8vIENoYWluYWJsZSBtZXRob2RcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiQkdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcHJvdG9jb2wgb2YgdGhlIGN1cnJlbnQgVVJMLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAvLyBnaXZlbiBVUkwgaHR0cDovL2V4YW1wbGUuY29tLyMvc29tZS9wYXRoP2Zvbz1iYXImYmF6PXhveG9cbiAgICogbGV0IHByb3RvY29sID0gJGxvY2F0aW9uLnByb3RvY29sKCk7XG4gICAqIC8vID0+IFwiaHR0cFwiXG4gICAqIGBgYFxuICAgKi9cbiAgcHJvdG9jb2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4kJHByb3RvY29sO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcHJvdG9jb2wgb2YgdGhlIGN1cnJlbnQgVVJMLlxuICAgKlxuICAgKiBJbiBjb250cmFzdCB0byB0aGUgbm9uLUFuZ3VsYXJKUyB2ZXJzaW9uIGBsb2NhdGlvbi5ob3N0YCB3aGljaCByZXR1cm5zIGBob3N0bmFtZTpwb3J0YCwgdGhpc1xuICAgKiByZXR1cm5zIHRoZSBgaG9zdG5hbWVgIHBvcnRpb24gb25seS5cbiAgICpcbiAgICpcbiAgICogYGBganNcbiAgICogLy8gZ2l2ZW4gVVJMIGh0dHA6Ly9leGFtcGxlLmNvbS8jL3NvbWUvcGF0aD9mb289YmFyJmJhej14b3hvXG4gICAqIGxldCBob3N0ID0gJGxvY2F0aW9uLmhvc3QoKTtcbiAgICogLy8gPT4gXCJleGFtcGxlLmNvbVwiXG4gICAqXG4gICAqIC8vIGdpdmVuIFVSTCBodHRwOi8vdXNlcjpwYXNzd29yZEBleGFtcGxlLmNvbTo4MDgwLyMvc29tZS9wYXRoP2Zvbz1iYXImYmF6PXhveG9cbiAgICogaG9zdCA9ICRsb2NhdGlvbi5ob3N0KCk7XG4gICAqIC8vID0+IFwiZXhhbXBsZS5jb21cIlxuICAgKiBob3N0ID0gbG9jYXRpb24uaG9zdDtcbiAgICogLy8gPT4gXCJleGFtcGxlLmNvbTo4MDgwXCJcbiAgICogYGBgXG4gICAqL1xuICBob3N0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuJCRob3N0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcG9ydCBvZiB0aGUgY3VycmVudCBVUkwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGdpdmVuIFVSTCBodHRwOi8vZXhhbXBsZS5jb20vIy9zb21lL3BhdGg/Zm9vPWJhciZiYXo9eG94b1xuICAgKiBsZXQgcG9ydCA9ICRsb2NhdGlvbi5wb3J0KCk7XG4gICAqIC8vID0+IDgwXG4gICAqIGBgYFxuICAgKi9cbiAgcG9ydCgpOiBudW1iZXJ8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuJCRwb3J0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcGF0aCBvZiB0aGUgY3VycmVudCBVUkwsIG9yIGNoYW5nZXMgdGhlIHBhdGggYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gaXRzIG93blxuICAgKiBpbnN0YW5jZS5cbiAgICpcbiAgICogUGF0aHMgc2hvdWxkIGFsd2F5cyBiZWdpbiB3aXRoIGZvcndhcmQgc2xhc2ggKC8pLiBUaGlzIG1ldGhvZCBhZGRzIHRoZSBmb3J3YXJkIHNsYXNoXG4gICAqIGlmIGl0IGlzIG1pc3NpbmcuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGdpdmVuIFVSTCBodHRwOi8vZXhhbXBsZS5jb20vIy9zb21lL3BhdGg/Zm9vPWJhciZiYXo9eG94b1xuICAgKiBsZXQgcGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAqIC8vID0+IFwiL3NvbWUvcGF0aFwiXG4gICAqIGBgYFxuICAgKi9cbiAgcGF0aCgpOiBzdHJpbmc7XG4gIHBhdGgocGF0aDogc3RyaW5nfG51bWJlcnxudWxsKTogdGhpcztcbiAgcGF0aChwYXRoPzogc3RyaW5nfG51bWJlcnxudWxsKTogc3RyaW5nfHRoaXMge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLiQkcGF0aDtcbiAgICB9XG5cbiAgICAvLyBudWxsIHBhdGggY29udmVydHMgdG8gZW1wdHkgc3RyaW5nLiBQcmVwZW5kIHdpdGggXCIvXCIgaWYgbmVlZGVkLlxuICAgIHBhdGggPSBwYXRoICE9PSBudWxsID8gcGF0aC50b1N0cmluZygpIDogJyc7XG4gICAgcGF0aCA9IHBhdGguY2hhckF0KDApID09PSAnLycgPyBwYXRoIDogJy8nICsgcGF0aDtcblxuICAgIHRoaXMuJCRwYXRoID0gcGF0aDtcblxuICAgIHRoaXMuY29tcG9zZVVybHMoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBtYXAgb2YgdGhlIHNlYXJjaCBwYXJhbWV0ZXJzIG9mIHRoZSBjdXJyZW50IFVSTCwgb3IgY2hhbmdlcyBhIHNlYXJjaFxuICAgKiBwYXJ0IGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIGl0cyBvd24gaW5zdGFuY2UuXG4gICAqXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGdpdmVuIFVSTCBodHRwOi8vZXhhbXBsZS5jb20vIy9zb21lL3BhdGg/Zm9vPWJhciZiYXo9eG94b1xuICAgKiBsZXQgc2VhcmNoT2JqZWN0ID0gJGxvY2F0aW9uLnNlYXJjaCgpO1xuICAgKiAvLyA9PiB7Zm9vOiAnYmFyJywgYmF6OiAneG94byd9XG4gICAqXG4gICAqIC8vIHNldCBmb28gdG8gJ3lpcGVlJ1xuICAgKiAkbG9jYXRpb24uc2VhcmNoKCdmb28nLCAneWlwZWUnKTtcbiAgICogLy8gJGxvY2F0aW9uLnNlYXJjaCgpID0+IHtmb286ICd5aXBlZScsIGJhejogJ3hveG8nfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0LjxzdHJpbmc+fE9iamVjdC48QXJyYXkuPHN0cmluZz4+fSBzZWFyY2ggTmV3IHNlYXJjaCBwYXJhbXMgLSBzdHJpbmcgb3JcbiAgICogaGFzaCBvYmplY3QuXG4gICAqXG4gICAqIFdoZW4gY2FsbGVkIHdpdGggYSBzaW5nbGUgYXJndW1lbnQgdGhlIG1ldGhvZCBhY3RzIGFzIGEgc2V0dGVyLCBzZXR0aW5nIHRoZSBgc2VhcmNoYCBjb21wb25lbnRcbiAgICogb2YgYCRsb2NhdGlvbmAgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogSWYgdGhlIGFyZ3VtZW50IGlzIGEgaGFzaCBvYmplY3QgY29udGFpbmluZyBhbiBhcnJheSBvZiB2YWx1ZXMsIHRoZXNlIHZhbHVlcyB3aWxsIGJlIGVuY29kZWRcbiAgICogYXMgZHVwbGljYXRlIHNlYXJjaCBwYXJhbWV0ZXJzIGluIHRoZSBVUkwuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xOdW1iZXJ8QXJyYXk8c3RyaW5nPnxib29sZWFuKT19IHBhcmFtVmFsdWUgSWYgYHNlYXJjaGAgaXMgYSBzdHJpbmcgb3IgbnVtYmVyLFxuICAgKiAgICAgdGhlbiBgcGFyYW1WYWx1ZWBcbiAgICogd2lsbCBvdmVycmlkZSBvbmx5IGEgc2luZ2xlIHNlYXJjaCBwcm9wZXJ0eS5cbiAgICpcbiAgICogSWYgYHBhcmFtVmFsdWVgIGlzIGFuIGFycmF5LCBpdCB3aWxsIG92ZXJyaWRlIHRoZSBwcm9wZXJ0eSBvZiB0aGUgYHNlYXJjaGAgY29tcG9uZW50IG9mXG4gICAqIGAkbG9jYXRpb25gIHNwZWNpZmllZCB2aWEgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICAgKlxuICAgKiBJZiBgcGFyYW1WYWx1ZWAgaXMgYG51bGxgLCB0aGUgcHJvcGVydHkgc3BlY2lmaWVkIHZpYSB0aGUgZmlyc3QgYXJndW1lbnQgd2lsbCBiZSBkZWxldGVkLlxuICAgKlxuICAgKiBJZiBgcGFyYW1WYWx1ZWAgaXMgYHRydWVgLCB0aGUgcHJvcGVydHkgc3BlY2lmaWVkIHZpYSB0aGUgZmlyc3QgYXJndW1lbnQgd2lsbCBiZSBhZGRlZCB3aXRoIG5vXG4gICAqIHZhbHVlIG5vciB0cmFpbGluZyBlcXVhbCBzaWduLlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBwYXJzZWQgYHNlYXJjaGAgb2JqZWN0IG9mIHRoZSBjdXJyZW50IFVSTCwgb3IgdGhlIGNoYW5nZWQgYHNlYXJjaGAgb2JqZWN0LlxuICAgKi9cbiAgc2VhcmNoKCk6IHtba2V5OiBzdHJpbmddOiB1bmtub3dufTtcbiAgc2VhcmNoKHNlYXJjaDogc3RyaW5nfG51bWJlcnx7W2tleTogc3RyaW5nXTogdW5rbm93bn0pOiB0aGlzO1xuICBzZWFyY2goXG4gICAgICBzZWFyY2g6IHN0cmluZ3xudW1iZXJ8e1trZXk6IHN0cmluZ106IHVua25vd259LFxuICAgICAgcGFyYW1WYWx1ZTogbnVsbHx1bmRlZmluZWR8c3RyaW5nfG51bWJlcnxib29sZWFufHN0cmluZ1tdKTogdGhpcztcbiAgc2VhcmNoKFxuICAgICAgc2VhcmNoPzogc3RyaW5nfG51bWJlcnx7W2tleTogc3RyaW5nXTogdW5rbm93bn0sXG4gICAgICBwYXJhbVZhbHVlPzogbnVsbHx1bmRlZmluZWR8c3RyaW5nfG51bWJlcnxib29sZWFufHN0cmluZ1tdKToge1trZXk6IHN0cmluZ106IHVua25vd259fHRoaXMge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gdGhpcy4kJHNlYXJjaDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzZWFyY2ggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy4kJHNlYXJjaCA9IHRoaXMudXJsQ29kZWMuZGVjb2RlU2VhcmNoKHNlYXJjaC50b1N0cmluZygpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VhcmNoID09PSAnb2JqZWN0JyAmJiBzZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBDb3B5IHRoZSBvYmplY3Qgc28gaXQncyBuZXZlciBtdXRhdGVkXG4gICAgICAgICAgc2VhcmNoID0gey4uLnNlYXJjaH07XG4gICAgICAgICAgLy8gcmVtb3ZlIG9iamVjdCB1bmRlZmluZWQgb3IgbnVsbCBwcm9wZXJ0aWVzXG4gICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2VhcmNoKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoW2tleV0gPT0gbnVsbCkgZGVsZXRlIHNlYXJjaFtrZXldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuJCRzZWFyY2ggPSBzZWFyY2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAnTG9jYXRpb25Qcm92aWRlci5zZWFyY2goKTogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyBvciBhbiBvYmplY3QuJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAodHlwZW9mIHNlYXJjaCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50U2VhcmNoID0gdGhpcy5zZWFyY2goKTtcbiAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHBhcmFtVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjdXJyZW50U2VhcmNoW3NlYXJjaF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2goY3VycmVudFNlYXJjaCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRTZWFyY2hbc2VhcmNoXSA9IHBhcmFtVmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2goY3VycmVudFNlYXJjaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29tcG9zZVVybHMoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgaGFzaCBmcmFnbWVudCwgb3IgY2hhbmdlcyB0aGUgaGFzaCBmcmFnbWVudCBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0b1xuICAgKiBpdHMgb3duIGluc3RhbmNlLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAvLyBnaXZlbiBVUkwgaHR0cDovL2V4YW1wbGUuY29tLyMvc29tZS9wYXRoP2Zvbz1iYXImYmF6PXhveG8jaGFzaFZhbHVlXG4gICAqIGxldCBoYXNoID0gJGxvY2F0aW9uLmhhc2goKTtcbiAgICogLy8gPT4gXCJoYXNoVmFsdWVcIlxuICAgKiBgYGBcbiAgICovXG4gIGhhc2goKTogc3RyaW5nO1xuICBoYXNoKGhhc2g6IHN0cmluZ3xudW1iZXJ8bnVsbCk6IHRoaXM7XG4gIGhhc2goaGFzaD86IHN0cmluZ3xudW1iZXJ8bnVsbCk6IHN0cmluZ3x0aGlzIHtcbiAgICBpZiAodHlwZW9mIGhhc2ggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gdGhpcy4kJGhhc2g7XG4gICAgfVxuXG4gICAgdGhpcy4kJGhhc2ggPSBoYXNoICE9PSBudWxsID8gaGFzaC50b1N0cmluZygpIDogJyc7XG5cbiAgICB0aGlzLmNvbXBvc2VVcmxzKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0byBgJGxvY2F0aW9uYCBkdXJpbmcgdGhlIGN1cnJlbnQgYCRkaWdlc3RgIHdpbGwgcmVwbGFjZSB0aGUgY3VycmVudFxuICAgKiBoaXN0b3J5IHJlY29yZCwgaW5zdGVhZCBvZiBhZGRpbmcgYSBuZXcgb25lLlxuICAgKi9cbiAgcmVwbGFjZSgpOiB0aGlzIHtcbiAgICB0aGlzLiQkcmVwbGFjZSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBoaXN0b3J5IHN0YXRlIG9iamVjdCB3aGVuIGNhbGxlZCB3aXRob3V0IGFueSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIENoYW5nZSB0aGUgaGlzdG9yeSBzdGF0ZSBvYmplY3Qgd2hlbiBjYWxsZWQgd2l0aCBvbmUgcGFyYW1ldGVyIGFuZCByZXR1cm4gYCRsb2NhdGlvbmAuXG4gICAqIFRoZSBzdGF0ZSBvYmplY3QgaXMgbGF0ZXIgcGFzc2VkIHRvIGBwdXNoU3RhdGVgIG9yIGByZXBsYWNlU3RhdGVgLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBzdXBwb3J0ZWQgb25seSBpbiBIVE1MNSBtb2RlIGFuZCBvbmx5IGluIGJyb3dzZXJzIHN1cHBvcnRpbmdcbiAgICogdGhlIEhUTUw1IEhpc3RvcnkgQVBJIG1ldGhvZHMgc3VjaCBhcyBgcHVzaFN0YXRlYCBhbmQgYHJlcGxhY2VTdGF0ZWAuIElmIHlvdSBuZWVkIHRvIHN1cHBvcnRcbiAgICogb2xkZXIgYnJvd3NlcnMgKGxpa2UgQW5kcm9pZCA8IDQuMCksIGRvbid0IHVzZSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICovXG4gIHN0YXRlKCk6IHVua25vd247XG4gIHN0YXRlKHN0YXRlOiB1bmtub3duKTogdGhpcztcbiAgc3RhdGUoc3RhdGU/OiB1bmtub3duKTogdW5rbm93bnx0aGlzIHtcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHRoaXMuJCRzdGF0ZTtcbiAgICB9XG5cbiAgICB0aGlzLiQkc3RhdGUgPSBzdGF0ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBmYWN0b3J5IGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBgJGxvY2F0aW9uU2hpbWAgaW4gQW5ndWxhcixcbiAqIGFuZCBwcm92aWRlcyBhbiBBUEktY29tcGF0aWFibGUgYCRsb2NhdGlvblByb3ZpZGVyYCBmb3IgQW5ndWxhckpTLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzICRsb2NhdGlvblNoaW1Qcm92aWRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBuZ1VwZ3JhZGU6IFVwZ3JhZGVNb2R1bGUsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxuICAgICAgcHJpdmF0ZSBwbGF0Zm9ybUxvY2F0aW9uOiBQbGF0Zm9ybUxvY2F0aW9uLCBwcml2YXRlIHVybENvZGVjOiBVcmxDb2RlYyxcbiAgICAgIHByaXZhdGUgbG9jYXRpb25TdHJhdGVneTogTG9jYXRpb25TdHJhdGVneSkge31cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdGhhdCByZXR1cm5zIGFuIGluc3RhbmNlIG9mIHRoZSAkbG9jYXRpb25TaGltXG4gICAqL1xuICAkZ2V0KCkge1xuICAgIHJldHVybiBuZXcgJGxvY2F0aW9uU2hpbShcbiAgICAgICAgdGhpcy5uZ1VwZ3JhZGUuJGluamVjdG9yLCB0aGlzLmxvY2F0aW9uLCB0aGlzLnBsYXRmb3JtTG9jYXRpb24sIHRoaXMudXJsQ29kZWMsXG4gICAgICAgIHRoaXMubG9jYXRpb25TdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogU3R1YiBtZXRob2QgdXNlZCB0byBrZWVwIEFQSSBjb21wYXRpYmxlIHdpdGggQW5ndWxhckpTLiBUaGlzIHNldHRpbmcgaXMgY29uZmlndXJlZCB0aHJvdWdoXG4gICAqIHRoZSBMb2NhdGlvblVwZ3JhZGVNb2R1bGUncyBgY29uZmlnYCBtZXRob2QgaW4geW91ciBBbmd1bGFyIGFwcC5cbiAgICovXG4gIGhhc2hQcmVmaXgocHJlZml4Pzogc3RyaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWd1cmUgTG9jYXRpb25VcGdyYWRlIHRocm91Z2ggTG9jYXRpb25VcGdyYWRlTW9kdWxlLmNvbmZpZyBtZXRob2QuJyk7XG4gIH1cblxuICAvKipcbiAgICogU3R1YiBtZXRob2QgdXNlZCB0byBrZWVwIEFQSSBjb21wYXRpYmxlIHdpdGggQW5ndWxhckpTLiBUaGlzIHNldHRpbmcgaXMgY29uZmlndXJlZCB0aHJvdWdoXG4gICAqIHRoZSBMb2NhdGlvblVwZ3JhZGVNb2R1bGUncyBgY29uZmlnYCBtZXRob2QgaW4geW91ciBBbmd1bGFyIGFwcC5cbiAgICovXG4gIGh0bWw1TW9kZShtb2RlPzogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWd1cmUgTG9jYXRpb25VcGdyYWRlIHRocm91Z2ggTG9jYXRpb25VcGdyYWRlTW9kdWxlLmNvbmZpZyBtZXRob2QuJyk7XG4gIH1cbn1cbiJdfQ==