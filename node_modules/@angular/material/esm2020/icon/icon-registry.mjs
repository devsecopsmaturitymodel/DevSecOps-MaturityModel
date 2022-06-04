/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Optional, SecurityContext, SkipSelf, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, of as observableOf, throwError as observableThrow } from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';
import { trustedHTMLFromString } from './trusted-types';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/platform-browser";
/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * @docs-private
 */
export function getMatIconNameNotFoundError(iconName) {
    return Error(`Unable to find icon with the name "${iconName}"`);
}
/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<mat-icon>` without including @angular/common/http.
 * @docs-private
 */
export function getMatIconNoHttpProviderError() {
    return Error('Could not find HttpClient provider for use with Angular Material icons. ' +
        'Please include the HttpClientModule from @angular/common/http in your ' +
        'app imports.');
}
/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * @param url URL that was attempted to be sanitized.
 * @docs-private
 */
export function getMatIconFailedToSanitizeUrlError(url) {
    return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL ` +
        `via Angular's DomSanitizer. Attempted URL was "${url}".`);
}
/**
 * Returns an exception to be thrown when a HTML string couldn't be sanitized.
 * @param literal HTML that was attempted to be sanitized.
 * @docs-private
 */
export function getMatIconFailedToSanitizeLiteralError(literal) {
    return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by ` +
        `Angular's DomSanitizer. Attempted literal was "${literal}".`);
}
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * @docs-private
 */
class SvgIconConfig {
    constructor(url, svgText, options) {
        this.url = url;
        this.svgText = svgText;
        this.options = options;
    }
}
/**
 * Service to register and display icons used by the `<mat-icon>` component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
export class MatIconRegistry {
    constructor(_httpClient, _sanitizer, document, _errorHandler) {
        this._httpClient = _httpClient;
        this._sanitizer = _sanitizer;
        this._errorHandler = _errorHandler;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /** Cache for icons loaded by direct URLs. */
        this._cachedIconsByUrl = new Map();
        /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
        this._inProgressUrlFetches = new Map();
        /** Map from font identifiers to their CSS class names. Used for icon fonts. */
        this._fontCssClassesByAlias = new Map();
        /** Registered icon resolver functions. */
        this._resolvers = [];
        /**
         * The CSS class to apply when an `<mat-icon>` component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
        this._document = document;
    }
    /**
     * Registers an icon by URL in the default namespace.
     * @param iconName Name under which the icon should be registered.
     * @param url
     */
    addSvgIcon(iconName, url, options) {
        return this.addSvgIconInNamespace('', iconName, url, options);
    }
    /**
     * Registers an icon using an HTML string in the default namespace.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    addSvgIconLiteral(iconName, literal, options) {
        return this.addSvgIconLiteralInNamespace('', iconName, literal, options);
    }
    /**
     * Registers an icon by URL in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param url
     */
    addSvgIconInNamespace(namespace, iconName, url, options) {
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, null, options));
    }
    /**
     * Registers an icon resolver function with the registry. The function will be invoked with the
     * name and namespace of an icon when the registry tries to resolve the URL from which to fetch
     * the icon. The resolver is expected to return a `SafeResourceUrl` that points to the icon,
     * an object with the icon URL and icon options, or `null` if the icon is not supported. Resolvers
     * will be invoked in the order in which they have been registered.
     * @param resolver Resolver function to be registered.
     */
    addSvgIconResolver(resolver) {
        this._resolvers.push(resolver);
        return this;
    }
    /**
     * Registers an icon using an HTML string in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    addSvgIconLiteralInNamespace(namespace, iconName, literal, options) {
        const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        // TODO: add an ngDevMode check
        if (!cleanLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        // Security: The literal is passed in as SafeHtml, and is thus trusted.
        const trustedLiteral = trustedHTMLFromString(cleanLiteral);
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig('', trustedLiteral, options));
    }
    /**
     * Registers an icon set by URL in the default namespace.
     * @param url
     */
    addSvgIconSet(url, options) {
        return this.addSvgIconSetInNamespace('', url, options);
    }
    /**
     * Registers an icon set using an HTML string in the default namespace.
     * @param literal SVG source of the icon set.
     */
    addSvgIconSetLiteral(literal, options) {
        return this.addSvgIconSetLiteralInNamespace('', literal, options);
    }
    /**
     * Registers an icon set by URL in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param url
     */
    addSvgIconSetInNamespace(namespace, url, options) {
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, null, options));
    }
    /**
     * Registers an icon set using an HTML string in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param literal SVG source of the icon set.
     */
    addSvgIconSetLiteralInNamespace(namespace, literal, options) {
        const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!cleanLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        // Security: The literal is passed in as SafeHtml, and is thus trusted.
        const trustedLiteral = trustedHTMLFromString(cleanLiteral);
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig('', trustedLiteral, options));
    }
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an matIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the `<mat-icon>` element.
     *
     * @param alias Alias for the font.
     * @param className Class name override to be used instead of the alias.
     */
    registerFontClassAlias(alias, className = alias) {
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    }
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    classNameForFontAlias(alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    }
    /**
     * Sets the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     *
     * @param className
     */
    setDefaultFontSetClass(className) {
        this._defaultFontSetClass = className;
        return this;
    }
    /**
     * Returns the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    getDefaultFontSetClass() {
        return this._defaultFontSetClass;
    }
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     *
     * @param safeUrl URL from which to fetch the SVG icon.
     */
    getSvgIconFromUrl(safeUrl) {
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        const cachedIcon = this._cachedIconsByUrl.get(url);
        if (cachedIcon) {
            return observableOf(cloneSvg(cachedIcon));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl, null)).pipe(tap(svg => this._cachedIconsByUrl.set(url, svg)), map(svg => cloneSvg(svg)));
    }
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an error.
     *
     * @param name Name of the icon to be retrieved.
     * @param namespace Namespace in which to look for the icon.
     */
    getNamedSvgIcon(name, namespace = '') {
        const key = iconKey(namespace, name);
        let config = this._svgIconConfigs.get(key);
        // Return (copy of) cached icon if possible.
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // Otherwise try to resolve the config from one of the resolver functions.
        config = this._getIconConfigFromResolvers(namespace, name);
        if (config) {
            this._svgIconConfigs.set(key, config);
            return this._getSvgFromConfig(config);
        }
        // See if we have any icon sets registered for the namespace.
        const iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return observableThrow(getMatIconNameNotFoundError(key));
    }
    ngOnDestroy() {
        this._resolvers = [];
        this._svgIconConfigs.clear();
        this._iconSetConfigs.clear();
        this._cachedIconsByUrl.clear();
    }
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    _getSvgFromConfig(config) {
        if (config.svgText) {
            // We already have the SVG element for this icon, return a copy.
            return observableOf(cloneSvg(this._svgElementFromConfig(config)));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config).pipe(map(svg => cloneSvg(svg)));
        }
    }
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new `<svg>` element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * an error if no icon with the specified name can be found.
     */
    _getSvgFromIconSetConfigs(name, iconSetConfigs) {
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return observableOf(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        const iconSetFetchRequests = iconSetConfigs
            .filter(iconSetConfig => !iconSetConfig.svgText)
            .map(iconSetConfig => {
            return this._loadSvgIconSetFromConfig(iconSetConfig).pipe(catchError((err) => {
                const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, iconSetConfig.url);
                // Swallow errors fetching individual URLs so the
                // combined Observable won't necessarily fail.
                const errorMessage = `Loading icon set URL: ${url} failed: ${err.message}`;
                this._errorHandler.handleError(new Error(errorMessage));
                return observableOf(null);
            }));
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return forkJoin(iconSetFetchRequests).pipe(map(() => {
            const foundIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            // TODO: add an ngDevMode check
            if (!foundIcon) {
                throw getMatIconNameNotFoundError(name);
            }
            return foundIcon;
        }));
    }
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    _extractIconWithNameFromAnySet(iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (let i = iconSetConfigs.length - 1; i >= 0; i--) {
            const config = iconSetConfigs[i];
            // Parsing the icon set's text into an SVG element can be expensive. We can avoid some of
            // the parsing by doing a quick check using `indexOf` to see if there's any chance for the
            // icon to be in the set. This won't be 100% accurate, but it should help us avoid at least
            // some of the parsing.
            if (config.svgText && config.svgText.toString().indexOf(iconName) > -1) {
                const svg = this._svgElementFromConfig(config);
                const foundIcon = this._extractSvgIconFromSet(svg, iconName, config.options);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    }
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    _loadSvgIconFromConfig(config) {
        return this._fetchIcon(config).pipe(tap(svgText => (config.svgText = svgText)), map(() => this._svgElementFromConfig(config)));
    }
    /**
     * Loads the content of the icon set URL specified in the
     * SvgIconConfig and attaches it to the config.
     */
    _loadSvgIconSetFromConfig(config) {
        if (config.svgText) {
            return observableOf(null);
        }
        return this._fetchIcon(config).pipe(tap(svgText => (config.svgText = svgText)));
    }
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    _extractSvgIconFromSet(iconSet, iconName, options) {
        // Use the `id="iconName"` syntax in order to escape special
        // characters in the ID (versus using the #iconName syntax).
        const iconSource = iconSet.querySelector(`[id="${iconName}"]`);
        if (!iconSource) {
            return null;
        }
        // Clone the element and remove the ID to prevent multiple elements from being added
        // to the page with the same ID.
        const iconElement = iconSource.cloneNode(true);
        iconElement.removeAttribute('id');
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconElement.nodeName.toLowerCase() === 'svg') {
            return this._setSvgAttributes(iconElement, options);
        }
        // If the node is a <symbol>, it won't be rendered so we have to convert it into <svg>. Note
        // that the same could be achieved by referring to it via <use href="#id">, however the <use>
        // tag is problematic on Firefox, because it needs to include the current page path.
        if (iconElement.nodeName.toLowerCase() === 'symbol') {
            return this._setSvgAttributes(this._toSvgElement(iconElement), options);
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        const svg = this._svgElementFromString(trustedHTMLFromString('<svg></svg>'));
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconElement);
        return this._setSvgAttributes(svg, options);
    }
    /**
     * Creates a DOM element from the given SVG string.
     */
    _svgElementFromString(str) {
        const div = this._document.createElement('DIV');
        div.innerHTML = str;
        const svg = div.querySelector('svg');
        // TODO: add an ngDevMode check
        if (!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    }
    /**
     * Converts an element into an SVG node by cloning all of its children.
     */
    _toSvgElement(element) {
        const svg = this._svgElementFromString(trustedHTMLFromString('<svg></svg>'));
        const attributes = element.attributes;
        // Copy over all the attributes from the `symbol` to the new SVG, except the id.
        for (let i = 0; i < attributes.length; i++) {
            const { name, value } = attributes[i];
            if (name !== 'id') {
                svg.setAttribute(name, value);
            }
        }
        for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === this._document.ELEMENT_NODE) {
                svg.appendChild(element.childNodes[i].cloneNode(true));
            }
        }
        return svg;
    }
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    _setSvgAttributes(svg, options) {
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        if (options && options.viewBox) {
            svg.setAttribute('viewBox', options.viewBox);
        }
        return svg;
    }
    /**
     * Returns an Observable which produces the string contents of the given icon. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    _fetchIcon(iconConfig) {
        const { url: safeUrl, options } = iconConfig;
        const withCredentials = options?.withCredentials ?? false;
        if (!this._httpClient) {
            throw getMatIconNoHttpProviderError();
        }
        // TODO: add an ngDevMode check
        if (safeUrl == null) {
            throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
        }
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        // TODO: add an ngDevMode check
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        const inProgressFetch = this._inProgressUrlFetches.get(url);
        if (inProgressFetch) {
            return inProgressFetch;
        }
        const req = this._httpClient.get(url, { responseType: 'text', withCredentials }).pipe(map(svg => {
            // Security: This SVG is fetched from a SafeResourceUrl, and is thus
            // trusted HTML.
            return trustedHTMLFromString(svg);
        }), finalize(() => this._inProgressUrlFetches.delete(url)), share());
        this._inProgressUrlFetches.set(url, req);
        return req;
    }
    /**
     * Registers an icon config by name in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param iconName Name under which to register the config.
     * @param config Config to be registered.
     */
    _addSvgIconConfig(namespace, iconName, config) {
        this._svgIconConfigs.set(iconKey(namespace, iconName), config);
        return this;
    }
    /**
     * Registers an icon set config in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param config Config to be registered.
     */
    _addSvgIconSetConfig(namespace, config) {
        const configNamespace = this._iconSetConfigs.get(namespace);
        if (configNamespace) {
            configNamespace.push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    }
    /** Parses a config's text into an SVG element. */
    _svgElementFromConfig(config) {
        if (!config.svgElement) {
            const svg = this._svgElementFromString(config.svgText);
            this._setSvgAttributes(svg, config.options);
            config.svgElement = svg;
        }
        return config.svgElement;
    }
    /** Tries to create an icon config through the registered resolver functions. */
    _getIconConfigFromResolvers(namespace, name) {
        for (let i = 0; i < this._resolvers.length; i++) {
            const result = this._resolvers[i](name, namespace);
            if (result) {
                return isSafeUrlWithOptions(result)
                    ? new SvgIconConfig(result.url, null, result.options)
                    : new SvgIconConfig(result, null);
            }
        }
        return undefined;
    }
}
MatIconRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatIconRegistry, deps: [{ token: i1.HttpClient, optional: true }, { token: i2.DomSanitizer }, { token: DOCUMENT, optional: true }, { token: i0.ErrorHandler }], target: i0.ɵɵFactoryTarget.Injectable });
MatIconRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatIconRegistry, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatIconRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ErrorHandler }]; } });
/** @docs-private */
export function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, errorHandler, document) {
    return parentRegistry || new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
}
/** @docs-private */
export const ICON_REGISTRY_PROVIDER = {
    // If there is already an MatIconRegistry available, use that. Otherwise, provide a new one.
    provide: MatIconRegistry,
    deps: [
        [new Optional(), new SkipSelf(), MatIconRegistry],
        [new Optional(), HttpClient],
        DomSanitizer,
        ErrorHandler,
        [new Optional(), DOCUMENT],
    ],
    useFactory: ICON_REGISTRY_PROVIDER_FACTORY,
};
/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg) {
    return svg.cloneNode(true);
}
/** Returns the cache key to use for an icon namespace and name. */
function iconKey(namespace, name) {
    return namespace + ':' + name;
}
function isSafeUrlWithOptions(value) {
    return !!(value.url && value.options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUVWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRSxPQUFPLEVBQWMscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUVuRTs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQixDQUFDLFFBQWdCO0lBQzFELE9BQU8sS0FBSyxDQUFDLHNDQUFzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDZCQUE2QjtJQUMzQyxPQUFPLEtBQUssQ0FDViwwRUFBMEU7UUFDeEUsd0VBQXdFO1FBQ3hFLGNBQWMsQ0FDakIsQ0FBQztBQUNKLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtDQUFrQyxDQUFDLEdBQW9CO0lBQ3JFLE9BQU8sS0FBSyxDQUNWLHdFQUF3RTtRQUN0RSxrREFBa0QsR0FBRyxJ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SUFBSSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEtBQVU7SUFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBFcnJvckhhbmRsZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNraXBTZWxmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXIsIFNhZmVSZXNvdXJjZVVybCwgU2FmZUh0bWx9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd30gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpbmFsaXplLCBtYXAsIHNoYXJlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VHJ1c3RlZEhUTUwsIHRydXN0ZWRIVE1MRnJvbVN0cmluZ30gZnJvbSAnLi90cnVzdGVkLXR5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gaW4gdGhlIGNhc2Ugd2hlbiBhdHRlbXB0aW5nIHRvXG4gKiBsb2FkIGFuIGljb24gd2l0aCBhIG5hbWUgdGhhdCBjYW5ub3QgYmUgZm91bmQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3IoaWNvbk5hbWU6IHN0cmluZyk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBVbmFibGUgdG8gZmluZCBpY29uIHdpdGggdGhlIG5hbWUgXCIke2ljb25OYW1lfVwiYCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gdGhlIGNvbnN1bWVyIGF0dGVtcHRzIHRvIHVzZVxuICogYDxtYXQtaWNvbj5gIHdpdGhvdXQgaW5jbHVkaW5nIEBhbmd1bGFyL2NvbW1vbi9odHRwLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoXG4gICAgJ0NvdWxkIG5vdCBmaW5kIEh0dHBDbGllbnQgcHJvdmlkZXIgZm9yIHVzZSB3aXRoIEFuZ3VsYXIgTWF0ZXJpYWwgaWNvbnMuICcgK1xuICAgICAgJ1BsZWFzZSBpbmNsdWRlIHRoZSBIdHRwQ2xpZW50TW9kdWxlIGZyb20gQGFuZ3VsYXIvY29tbW9uL2h0dHAgaW4geW91ciAnICtcbiAgICAgICdhcHAgaW1wb3J0cy4nLFxuICApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgVVJMIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSB1cmwgVVJMIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHVybDogU2FmZVJlc291cmNlVXJsKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoXG4gICAgYFRoZSBVUkwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBhIHJlc291cmNlIFVSTCBgICtcbiAgICAgIGB2aWEgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIFVSTCB3YXMgXCIke3VybH1cIi5gLFxuICApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgSFRNTCBzdHJpbmcgY291bGRuJ3QgYmUgc2FuaXRpemVkLlxuICogQHBhcmFtIGxpdGVyYWwgSFRNTCB0aGF0IHdhcyBhdHRlbXB0ZWQgdG8gYmUgc2FuaXRpemVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbDogU2FmZUh0bWwpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihcbiAgICBgVGhlIGxpdGVyYWwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBzYWZlIEhUTUwgYnkgYCArXG4gICAgICBgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIGxpdGVyYWwgd2FzIFwiJHtsaXRlcmFsfVwiLmAsXG4gICk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIGhvdyBhbiBpY29uIG9yIHRoZSBpY29ucyBpbiBhbiBpY29uIHNldCBhcmUgcHJlc2VudGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJY29uT3B0aW9ucyB7XG4gIC8qKiBWaWV3IGJveCB0byBzZXQgb24gdGhlIGljb24uICovXG4gIHZpZXdCb3g/OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIGZldGNoIHRoZSBpY29uIG9yIGljb24gc2V0IHVzaW5nIEhUVFAgY3JlZGVudGlhbHMuICovXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIGljb24gcmVnaXN0cnkgd2hlbiB0cnlpbmcgdG8gcmVzb2x2ZSB0aGVcbiAqIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoIGFuIGljb24uIFRoZSByZXR1cm5lZCBVUkwgd2lsbCBiZSB1c2VkIHRvIG1ha2UgYSByZXF1ZXN0IGZvciB0aGUgaWNvbi5cbiAqL1xuZXhwb3J0IHR5cGUgSWNvblJlc29sdmVyID0gKFxuICBuYW1lOiBzdHJpbmcsXG4gIG5hbWVzcGFjZTogc3RyaW5nLFxuKSA9PiBTYWZlUmVzb3VyY2VVcmwgfCBTYWZlUmVzb3VyY2VVcmxXaXRoSWNvbk9wdGlvbnMgfCBudWxsO1xuXG4vKiogT2JqZWN0IHRoYXQgc3BlY2lmaWVzIGEgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggYW4gaWNvbiBhbmQgdGhlIG9wdGlvbnMgdG8gdXNlIGZvciBpdC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVJlc291cmNlVXJsV2l0aEljb25PcHRpb25zIHtcbiAgdXJsOiBTYWZlUmVzb3VyY2VVcmw7XG4gIG9wdGlvbnM6IEljb25PcHRpb25zO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGFuIGljb24sIGluY2x1ZGluZyB0aGUgVVJMIGFuZCBwb3NzaWJseSB0aGUgY2FjaGVkIFNWRyBlbGVtZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBTdmdJY29uQ29uZmlnIHtcbiAgc3ZnRWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVybDogU2FmZVJlc291cmNlVXJsLFxuICAgIHB1YmxpYyBzdmdUZXh0OiBUcnVzdGVkSFRNTCB8IG51bGwsXG4gICAgcHVibGljIG9wdGlvbnM/OiBJY29uT3B0aW9ucyxcbiAgKSB7fVxufVxuXG4vKiogSWNvbiBjb25maWd1cmF0aW9uIHdob3NlIGNvbnRlbnQgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQuICovXG50eXBlIExvYWRlZFN2Z0ljb25Db25maWcgPSBTdmdJY29uQ29uZmlnICYge3N2Z1RleHQ6IFRydXN0ZWRIVE1MfTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHJlZ2lzdGVyIGFuZCBkaXNwbGF5IGljb25zIHVzZWQgYnkgdGhlIGA8bWF0LWljb24+YCBjb21wb25lbnQuXG4gKiAtIFJlZ2lzdGVycyBpY29uIFVSTHMgYnkgbmFtZXNwYWNlIGFuZCBuYW1lLlxuICogLSBSZWdpc3RlcnMgaWNvbiBzZXQgVVJMcyBieSBuYW1lc3BhY2UuXG4gKiAtIFJlZ2lzdGVycyBhbGlhc2VzIGZvciBDU1MgY2xhc3NlcywgZm9yIHVzZSB3aXRoIGljb24gZm9udHMuXG4gKiAtIExvYWRzIGljb25zIGZyb20gVVJMcyBhbmQgZXh0cmFjdHMgaW5kaXZpZHVhbCBpY29ucyBmcm9tIGljb24gc2V0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBVUkxzIGFuZCBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciBpbmRpdmlkdWFsIGljb25zLiBLZXlzIGFyZSBvZiB0aGUgZm9ybWF0IFwiW25hbWVzcGFjZV06W2ljb25dXCIuXG4gICAqL1xuICBwcml2YXRlIF9zdmdJY29uQ29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnPigpO1xuXG4gIC8qKlxuICAgKiBTdmdJY29uQ29uZmlnIG9iamVjdHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGljb24gc2V0cywga2V5ZWQgYnkgbmFtZXNwYWNlLlxuICAgKiBNdWx0aXBsZSBpY29uIHNldHMgY2FuIGJlIHJlZ2lzdGVyZWQgdW5kZXIgdGhlIHNhbWUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaWNvblNldENvbmZpZ3MgPSBuZXcgTWFwPHN0cmluZywgU3ZnSWNvbkNvbmZpZ1tdPigpO1xuXG4gIC8qKiBDYWNoZSBmb3IgaWNvbnMgbG9hZGVkIGJ5IGRpcmVjdCBVUkxzLiAqL1xuICBwcml2YXRlIF9jYWNoZWRJY29uc0J5VXJsID0gbmV3IE1hcDxzdHJpbmcsIFNWR0VsZW1lbnQ+KCk7XG5cbiAgLyoqIEluLXByb2dyZXNzIGljb24gZmV0Y2hlcy4gVXNlZCB0byBjb2FsZXNjZSBtdWx0aXBsZSByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwuICovXG4gIHByaXZhdGUgX2luUHJvZ3Jlc3NVcmxGZXRjaGVzID0gbmV3IE1hcDxzdHJpbmcsIE9ic2VydmFibGU8VHJ1c3RlZEhUTUw+PigpO1xuXG4gIC8qKiBNYXAgZnJvbSBmb250IGlkZW50aWZpZXJzIHRvIHRoZWlyIENTUyBjbGFzcyBuYW1lcy4gVXNlZCBmb3IgaWNvbiBmb250cy4gKi9cbiAgcHJpdmF0ZSBfZm9udENzc0NsYXNzZXNCeUFsaWFzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKiogUmVnaXN0ZXJlZCBpY29uIHJlc29sdmVyIGZ1bmN0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfcmVzb2x2ZXJzOiBJY29uUmVzb2x2ZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIHRvIGFwcGx5IHdoZW4gYW4gYDxtYXQtaWNvbj5gIGNvbXBvbmVudCBoYXMgbm8gaWNvbiBuYW1lLCB1cmwsIG9yIGZvbnQgc3BlY2lmaWVkLlxuICAgKiBUaGUgZGVmYXVsdCAnbWF0ZXJpYWwtaWNvbnMnIHZhbHVlIGFzc3VtZXMgdGhhdCB0aGUgbWF0ZXJpYWwgaWNvbiBmb250IGhhcyBiZWVuIGxvYWRlZCBhc1xuICAgKiBkZXNjcmliZWQgYXQgaHR0cDovL2dvb2dsZS5naXRodWIuaW8vbWF0ZXJpYWwtZGVzaWduLWljb25zLyNpY29uLWZvbnQtZm9yLXRoZS13ZWJcbiAgICovXG4gIHByaXZhdGUgX2RlZmF1bHRGb250U2V0Q2xhc3MgPSAnbWF0ZXJpYWwtaWNvbnMnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2h0dHBDbGllbnQ6IEh0dHBDbGllbnQsXG4gICAgcHJpdmF0ZSBfc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgKSB7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbihpY29uTmFtZTogc3RyaW5nLCB1cmw6IFNhZmVSZXNvdXJjZVVybCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvbkluTmFtZXNwYWNlKCcnLCBpY29uTmFtZSwgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWwoaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoJycsIGljb25OYW1lLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbkluTmFtZXNwYWNlKFxuICAgIG5hbWVzcGFjZTogc3RyaW5nLFxuICAgIGljb25OYW1lOiBzdHJpbmcsXG4gICAgdXJsOiBTYWZlUmVzb3VyY2VVcmwsXG4gICAgb3B0aW9ucz86IEljb25PcHRpb25zLFxuICApOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLCBuZXcgU3ZnSWNvbkNvbmZpZyh1cmwsIG51bGwsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiByZXNvbHZlciBmdW5jdGlvbiB3aXRoIHRoZSByZWdpc3RyeS4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCB3aXRoIHRoZVxuICAgKiBuYW1lIGFuZCBuYW1lc3BhY2Ugb2YgYW4gaWNvbiB3aGVuIHRoZSByZWdpc3RyeSB0cmllcyB0byByZXNvbHZlIHRoZSBVUkwgZnJvbSB3aGljaCB0byBmZXRjaFxuICAgKiB0aGUgaWNvbi4gVGhlIHJlc29sdmVyIGlzIGV4cGVjdGVkIHRvIHJldHVybiBhIGBTYWZlUmVzb3VyY2VVcmxgIHRoYXQgcG9pbnRzIHRvIHRoZSBpY29uLFxuICAgKiBhbiBvYmplY3Qgd2l0aCB0aGUgaWNvbiBVUkwgYW5kIGljb24gb3B0aW9ucywgb3IgYG51bGxgIGlmIHRoZSBpY29uIGlzIG5vdCBzdXBwb3J0ZWQuIFJlc29sdmVyc1xuICAgKiB3aWxsIGJlIGludm9rZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIHRoZXkgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSByZXNvbHZlciBSZXNvbHZlciBmdW5jdGlvbiB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgYWRkU3ZnSWNvblJlc29sdmVyKHJlc29sdmVyOiBJY29uUmVzb2x2ZXIpOiB0aGlzIHtcbiAgICB0aGlzLl9yZXNvbHZlcnMucHVzaChyZXNvbHZlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbi5cbiAgICovXG4gIGFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoXG4gICAgbmFtZXNwYWNlOiBzdHJpbmcsXG4gICAgaWNvbk5hbWU6IHN0cmluZyxcbiAgICBsaXRlcmFsOiBTYWZlSHRtbCxcbiAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMsXG4gICk6IHRoaXMge1xuICAgIGNvbnN0IGNsZWFuTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgaWYgKCFjbGVhbkxpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIC8vIFNlY3VyaXR5OiBUaGUgbGl0ZXJhbCBpcyBwYXNzZWQgaW4gYXMgU2FmZUh0bWwsIGFuZCBpcyB0aHVzIHRydXN0ZWQuXG4gICAgY29uc3QgdHJ1c3RlZExpdGVyYWwgPSB0cnVzdGVkSFRNTEZyb21TdHJpbmcoY2xlYW5MaXRlcmFsKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhcbiAgICAgIG5hbWVzcGFjZSxcbiAgICAgIGljb25OYW1lLFxuICAgICAgbmV3IFN2Z0ljb25Db25maWcoJycsIHRydXN0ZWRMaXRlcmFsLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0KHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoJycsIHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbiBzZXQuXG4gICAqL1xuICBhZGRTdmdJY29uU2V0TGl0ZXJhbChsaXRlcmFsOiBTYWZlSHRtbCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZSgnJywgbGl0ZXJhbCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgbnVsbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsSW5OYW1lc3BhY2UoXG4gICAgbmFtZXNwYWNlOiBzdHJpbmcsXG4gICAgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgb3B0aW9ucz86IEljb25PcHRpb25zLFxuICApOiB0aGlzIHtcbiAgICBjb25zdCBjbGVhbkxpdGVyYWwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIGxpdGVyYWwpO1xuXG4gICAgaWYgKCFjbGVhbkxpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIC8vIFNlY3VyaXR5OiBUaGUgbGl0ZXJhbCBpcyBwYXNzZWQgaW4gYXMgU2FmZUh0bWwsIGFuZCBpcyB0aHVzIHRydXN0ZWQuXG4gICAgY29uc3QgdHJ1c3RlZExpdGVyYWwgPSB0cnVzdGVkSFRNTEZyb21TdHJpbmcoY2xlYW5MaXRlcmFsKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKCcnLCB0cnVzdGVkTGl0ZXJhbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gYWxpYXMgZm9yIGEgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cy4gQ3JlYXRpbmcgYW4gbWF0SWNvblxuICAgKiBjb21wb25lbnQgd2l0aCB0aGUgYWxpYXMgYXMgdGhlIGZvbnRTZXQgaW5wdXQgd2lsbCBjYXVzZSB0aGUgY2xhc3MgbmFtZSB0byBiZSBhcHBsaWVkXG4gICAqIHRvIHRoZSBgPG1hdC1pY29uPmAgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGFsaWFzIEFsaWFzIGZvciB0aGUgZm9udC5cbiAgICogQHBhcmFtIGNsYXNzTmFtZSBDbGFzcyBuYW1lIG92ZXJyaWRlIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgYWxpYXMuXG4gICAqL1xuICByZWdpc3RlckZvbnRDbGFzc0FsaWFzKGFsaWFzOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nID0gYWxpYXMpOiB0aGlzIHtcbiAgICB0aGlzLl9mb250Q3NzQ2xhc3Nlc0J5QWxpYXMuc2V0KGFsaWFzLCBjbGFzc05hbWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIENTUyBjbGFzcyBuYW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWxpYXMgYnkgYSBwcmV2aW91cyBjYWxsIHRvXG4gICAqIHJlZ2lzdGVyRm9udENsYXNzQWxpYXMuIElmIG5vIENTUyBjbGFzcyBoYXMgYmVlbiBhc3NvY2lhdGVkLCByZXR1cm5zIHRoZSBhbGlhcyB1bm1vZGlmaWVkLlxuICAgKi9cbiAgY2xhc3NOYW1lRm9yRm9udEFsaWFzKGFsaWFzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9mb250Q3NzQ2xhc3Nlc0J5QWxpYXMuZ2V0KGFsaWFzKSB8fCBhbGlhcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzIHdoZW4gYW4gYDxtYXQtaWNvbj5gIGNvbXBvbmVudCBkb2VzIG5vdFxuICAgKiBoYXZlIGEgZm9udFNldCBpbnB1dCB2YWx1ZSwgYW5kIGlzIG5vdCBsb2FkaW5nIGFuIGljb24gYnkgbmFtZSBvciBVUkwuXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc05hbWVcbiAgICovXG4gIHNldERlZmF1bHRGb250U2V0Q2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiB0aGlzIHtcbiAgICB0aGlzLl9kZWZhdWx0Rm9udFNldENsYXNzID0gY2xhc3NOYW1lO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGRvZXMgbm90XG4gICAqIGhhdmUgYSBmb250U2V0IGlucHV0IHZhbHVlLCBhbmQgaXMgbm90IGxvYWRpbmcgYW4gaWNvbiBieSBuYW1lIG9yIFVSTC5cbiAgICovXG4gIGdldERlZmF1bHRGb250U2V0Q2xhc3MoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdEZvbnRTZXRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBwcm9kdWNlcyB0aGUgaWNvbiAoYXMgYW4gYDxzdmc+YCBET00gZWxlbWVudCkgZnJvbSB0aGUgZ2l2ZW4gVVJMLlxuICAgKiBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgVVJMIG1heSBiZSBjYWNoZWQgc28gdGhpcyB3aWxsIG5vdCBhbHdheXMgY2F1c2UgYW4gSFRUUCByZXF1ZXN0LCBidXRcbiAgICogdGhlIHByb2R1Y2VkIGVsZW1lbnQgd2lsbCBhbHdheXMgYmUgYSBuZXcgY29weSBvZiB0aGUgb3JpZ2luYWxseSBmZXRjaGVkIGljb24uIChUaGF0IGlzLFxuICAgKiBpdCB3aWxsIG5vdCBjb250YWluIGFueSBtb2RpZmljYXRpb25zIG1hZGUgdG8gZWxlbWVudHMgcHJldmlvdXNseSByZXR1cm5lZCkuXG4gICAqXG4gICAqIEBwYXJhbSBzYWZlVXJsIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoIHRoZSBTVkcgaWNvbi5cbiAgICovXG4gIGdldFN2Z0ljb25Gcm9tVXJsKHNhZmVVcmw6IFNhZmVSZXNvdXJjZVVybCk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBzYWZlVXJsKTtcblxuICAgIGlmICghdXJsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHNhZmVVcmwpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhY2hlZEljb24gPSB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLmdldCh1cmwpO1xuXG4gICAgaWYgKGNhY2hlZEljb24pIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoY2xvbmVTdmcoY2FjaGVkSWNvbikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvbkZyb21Db25maWcobmV3IFN2Z0ljb25Db25maWcoc2FmZVVybCwgbnVsbCkpLnBpcGUoXG4gICAgICB0YXAoc3ZnID0+IHRoaXMuX2NhY2hlZEljb25zQnlVcmwuc2V0KHVybCEsIHN2ZykpLFxuICAgICAgbWFwKHN2ZyA9PiBjbG9uZVN2ZyhzdmcpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHByb2R1Y2VzIHRoZSBpY29uIChhcyBhbiBgPHN2Zz5gIERPTSBlbGVtZW50KSB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqIGFuZCBuYW1lc3BhY2UuIFRoZSBpY29uIG11c3QgaGF2ZSBiZWVuIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIGFkZEljb24gb3IgYWRkSWNvblNldDtcbiAgICogaWYgbm90LCB0aGUgT2JzZXJ2YWJsZSB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBpY29uIHRvIGJlIHJldHJpZXZlZC5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gbG9vayBmb3IgdGhlIGljb24uXG4gICAqL1xuICBnZXROYW1lZFN2Z0ljb24obmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZyA9ICcnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgY29uc3Qga2V5ID0gaWNvbktleShuYW1lc3BhY2UsIG5hbWUpO1xuICAgIGxldCBjb25maWcgPSB0aGlzLl9zdmdJY29uQ29uZmlncy5nZXQoa2V5KTtcblxuICAgIC8vIFJldHVybiAoY29weSBvZikgY2FjaGVkIGljb24gaWYgcG9zc2libGUuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgdHJ5IHRvIHJlc29sdmUgdGhlIGNvbmZpZyBmcm9tIG9uZSBvZiB0aGUgcmVzb2x2ZXIgZnVuY3Rpb25zLlxuICAgIGNvbmZpZyA9IHRoaXMuX2dldEljb25Db25maWdGcm9tUmVzb2x2ZXJzKG5hbWVzcGFjZSwgbmFtZSk7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLl9zdmdJY29uQ29uZmlncy5zZXQoa2V5LCBjb25maWcpO1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbnkgaWNvbiBzZXRzIHJlZ2lzdGVyZWQgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAgY29uc3QgaWNvblNldENvbmZpZ3MgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChpY29uU2V0Q29uZmlncykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lLCBpY29uU2V0Q29uZmlncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUaHJvdyhnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3Ioa2V5KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXNvbHZlcnMgPSBbXTtcbiAgICB0aGlzLl9zdmdJY29uQ29uZmlncy5jbGVhcigpO1xuICAgIHRoaXMuX2ljb25TZXRDb25maWdzLmNsZWFyKCk7XG4gICAgdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNhY2hlZCBpY29uIGZvciBhIFN2Z0ljb25Db25maWcgaWYgYXZhaWxhYmxlLCBvciBmZXRjaGVzIGl0IGZyb20gaXRzIFVSTCBpZiBub3QuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIGlmIChjb25maWcuc3ZnVGV4dCkge1xuICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSBTVkcgZWxlbWVudCBmb3IgdGhpcyBpY29uLCByZXR1cm4gYSBjb3B5LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2Zyh0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmV0Y2ggdGhlIGljb24gZnJvbSB0aGUgY29uZmlnJ3MgVVJMLCBjYWNoZSBpdCwgYW5kIHJldHVybiBhIGNvcHkuXG4gICAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKGNvbmZpZykucGlwZShtYXAoc3ZnID0+IGNsb25lU3ZnKHN2ZykpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gZmluZCBhbiBpY29uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGluIGFueSBvZiB0aGUgU1ZHIGljb24gc2V0cy5cbiAgICogRmlyc3Qgc2VhcmNoZXMgdGhlIGF2YWlsYWJsZSBjYWNoZWQgaWNvbnMgZm9yIGEgbmVzdGVkIGVsZW1lbnQgd2l0aCBhIG1hdGNoaW5nIG5hbWUsIGFuZFxuICAgKiBpZiBmb3VuZCBjb3BpZXMgdGhlIGVsZW1lbnQgdG8gYSBuZXcgYDxzdmc+YCBlbGVtZW50LiBJZiBub3QgZm91bmQsIGZldGNoZXMgYWxsIGljb24gc2V0c1xuICAgKiB0aGF0IGhhdmUgbm90IGJlZW4gY2FjaGVkLCBhbmQgc2VhcmNoZXMgYWdhaW4gYWZ0ZXIgYWxsIGZldGNoZXMgYXJlIGNvbXBsZXRlZC5cbiAgICogVGhlIHJldHVybmVkIE9ic2VydmFibGUgcHJvZHVjZXMgdGhlIFNWRyBlbGVtZW50IGlmIHBvc3NpYmxlLCBhbmQgdGhyb3dzXG4gICAqIGFuIGVycm9yIGlmIG5vIGljb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgY2FuIGJlIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0U3ZnRnJvbUljb25TZXRDb25maWdzKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdLFxuICApOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICAvLyBGb3IgYWxsIHRoZSBpY29uIHNldCBTVkcgZWxlbWVudHMgd2UndmUgZmV0Y2hlZCwgc2VlIGlmIGFueSBjb250YWluIGFuIGljb24gd2l0aCB0aGVcbiAgICAvLyByZXF1ZXN0ZWQgbmFtZS5cbiAgICBjb25zdCBuYW1lZEljb24gPSB0aGlzLl9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChuYW1lLCBpY29uU2V0Q29uZmlncyk7XG5cbiAgICBpZiAobmFtZWRJY29uKSB7XG4gICAgICAvLyBXZSBjb3VsZCBjYWNoZSBuYW1lZEljb24gaW4gX3N2Z0ljb25Db25maWdzLCBidXQgc2luY2Ugd2UgaGF2ZSB0byBtYWtlIGEgY29weSBldmVyeVxuICAgICAgLy8gdGltZSBhbnl3YXksIHRoZXJlJ3MgcHJvYmFibHkgbm90IG11Y2ggYWR2YW50YWdlIGNvbXBhcmVkIHRvIGp1c3QgYWx3YXlzIGV4dHJhY3RpbmdcbiAgICAgIC8vIGl0IGZyb20gdGhlIGljb24gc2V0LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihuYW1lZEljb24pO1xuICAgIH1cblxuICAgIC8vIE5vdCBmb3VuZCBpbiBhbnkgY2FjaGVkIGljb24gc2V0cy4gSWYgdGhlcmUgYXJlIGljb24gc2V0cyB3aXRoIFVSTHMgdGhhdCB3ZSBoYXZlbid0XG4gICAgLy8gZmV0Y2hlZCwgZmV0Y2ggdGhlbSBub3cgYW5kIGxvb2sgZm9yIGljb25OYW1lIGluIHRoZSByZXN1bHRzLlxuICAgIGNvbnN0IGljb25TZXRGZXRjaFJlcXVlc3RzOiBPYnNlcnZhYmxlPFRydXN0ZWRIVE1MIHwgbnVsbD5bXSA9IGljb25TZXRDb25maWdzXG4gICAgICAuZmlsdGVyKGljb25TZXRDb25maWcgPT4gIWljb25TZXRDb25maWcuc3ZnVGV4dClcbiAgICAgIC5tYXAoaWNvblNldENvbmZpZyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoaWNvblNldENvbmZpZykucGlwZShcbiAgICAgICAgICBjYXRjaEVycm9yKChlcnI6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgaWNvblNldENvbmZpZy51cmwpO1xuXG4gICAgICAgICAgICAvLyBTd2FsbG93IGVycm9ycyBmZXRjaGluZyBpbmRpdmlkdWFsIFVSTHMgc28gdGhlXG4gICAgICAgICAgICAvLyBjb21iaW5lZCBPYnNlcnZhYmxlIHdvbid0IG5lY2Vzc2FyaWx5IGZhaWwuXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgTG9hZGluZyBpY29uIHNldCBVUkw6ICR7dXJsfSBmYWlsZWQ6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlci5oYW5kbGVFcnJvcihuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAvLyBGZXRjaCBhbGwgdGhlIGljb24gc2V0IFVSTHMuIFdoZW4gdGhlIHJlcXVlc3RzIGNvbXBsZXRlLCBldmVyeSBJY29uU2V0IHNob3VsZCBoYXZlIGFcbiAgICAvLyBjYWNoZWQgU1ZHIGVsZW1lbnQgKHVubGVzcyB0aGUgcmVxdWVzdCBmYWlsZWQpLCBhbmQgd2UgY2FuIGNoZWNrIGFnYWluIGZvciB0aGUgaWNvbi5cbiAgICByZXR1cm4gZm9ya0pvaW4oaWNvblNldEZldGNoUmVxdWVzdHMpLnBpcGUoXG4gICAgICBtYXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmb3VuZEljb24gPSB0aGlzLl9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChuYW1lLCBpY29uU2V0Q29uZmlncyk7XG5cbiAgICAgICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgICAgICBpZiAoIWZvdW5kSWNvbikge1xuICAgICAgICAgIHRocm93IGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3VuZEljb247XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHRoZSBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciB0aGUgZ2l2ZW4gaWNvbiBzZXRzIGZvciBhIG5lc3RlZCBpY29uIGVsZW1lbnQgd2hvc2UgXCJpZFwiXG4gICAqIHRhZyBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZS4gSWYgZm91bmQsIGNvcGllcyB0aGUgbmVzdGVkIGVsZW1lbnQgdG8gYSBuZXcgU1ZHIGVsZW1lbnQgYW5kXG4gICAqIHJldHVybnMgaXQuIFJldHVybnMgbnVsbCBpZiBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZXh0cmFjdEljb25XaXRoTmFtZUZyb21BbnlTZXQoXG4gICAgaWNvbk5hbWU6IHN0cmluZyxcbiAgICBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdLFxuICApOiBTVkdFbGVtZW50IHwgbnVsbCB7XG4gICAgLy8gSXRlcmF0ZSBiYWNrd2FyZHMsIHNvIGljb24gc2V0cyBhZGRlZCBsYXRlciBoYXZlIHByZWNlZGVuY2UuXG4gICAgZm9yIChsZXQgaSA9IGljb25TZXRDb25maWdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBjb25maWcgPSBpY29uU2V0Q29uZmlnc1tpXTtcblxuICAgICAgLy8gUGFyc2luZyB0aGUgaWNvbiBzZXQncyB0ZXh0IGludG8gYW4gU1ZHIGVsZW1lbnQgY2FuIGJlIGV4cGVuc2l2ZS4gV2UgY2FuIGF2b2lkIHNvbWUgb2ZcbiAgICAgIC8vIHRoZSBwYXJzaW5nIGJ5IGRvaW5nIGEgcXVpY2sgY2hlY2sgdXNpbmcgYGluZGV4T2ZgIHRvIHNlZSBpZiB0aGVyZSdzIGFueSBjaGFuY2UgZm9yIHRoZVxuICAgICAgLy8gaWNvbiB0byBiZSBpbiB0aGUgc2V0LiBUaGlzIHdvbid0IGJlIDEwMCUgYWNjdXJhdGUsIGJ1dCBpdCBzaG91bGQgaGVscCB1cyBhdm9pZCBhdCBsZWFzdFxuICAgICAgLy8gc29tZSBvZiB0aGUgcGFyc2luZy5cbiAgICAgIGlmIChjb25maWcuc3ZnVGV4dCAmJiBjb25maWcuc3ZnVGV4dC50b1N0cmluZygpLmluZGV4T2YoaWNvbk5hbWUpID4gLTEpIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnIGFzIExvYWRlZFN2Z0ljb25Db25maWcpO1xuICAgICAgICBjb25zdCBmb3VuZEljb24gPSB0aGlzLl9leHRyYWN0U3ZnSWNvbkZyb21TZXQoc3ZnLCBpY29uTmFtZSwgY29uZmlnLm9wdGlvbnMpO1xuICAgICAgICBpZiAoZm91bmRJY29uKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kSWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgY29udGVudCBvZiB0aGUgaWNvbiBVUkwgc3BlY2lmaWVkIGluIHRoZSBTdmdJY29uQ29uZmlnIGFuZCBjcmVhdGVzIGFuIFNWRyBlbGVtZW50XG4gICAqIGZyb20gaXQuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoSWNvbihjb25maWcpLnBpcGUoXG4gICAgICB0YXAoc3ZnVGV4dCA9PiAoY29uZmlnLnN2Z1RleHQgPSBzdmdUZXh0KSksXG4gICAgICBtYXAoKCkgPT4gdGhpcy5fc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnIGFzIExvYWRlZFN2Z0ljb25Db25maWcpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIHNldCBVUkwgc3BlY2lmaWVkIGluIHRoZVxuICAgKiBTdmdJY29uQ29uZmlnIGFuZCBhdHRhY2hlcyBpdCB0byB0aGUgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9hZFN2Z0ljb25TZXRGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8VHJ1c3RlZEhUTUwgfCBudWxsPiB7XG4gICAgaWYgKGNvbmZpZy5zdmdUZXh0KSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mZXRjaEljb24oY29uZmlnKS5waXBlKHRhcChzdmdUZXh0ID0+IChjb25maWcuc3ZnVGV4dCA9IHN2Z1RleHQpKSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBlbGVtZW50IG9mIHRoZSBnaXZlbiBTdmdJY29uQ29uZmlnIGZvciBhIG5lc3RlZCBpY29uIGVsZW1lbnQgd2hvc2UgXCJpZFwiXG4gICAqIHRhZyBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZS4gSWYgZm91bmQsIGNvcGllcyB0aGUgbmVzdGVkIGVsZW1lbnQgdG8gYSBuZXcgU1ZHIGVsZW1lbnQgYW5kXG4gICAqIHJldHVybnMgaXQuIFJldHVybnMgbnVsbCBpZiBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZXh0cmFjdFN2Z0ljb25Gcm9tU2V0KFxuICAgIGljb25TZXQ6IFNWR0VsZW1lbnQsXG4gICAgaWNvbk5hbWU6IHN0cmluZyxcbiAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMsXG4gICk6IFNWR0VsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBVc2UgdGhlIGBpZD1cImljb25OYW1lXCJgIHN5bnRheCBpbiBvcmRlciB0byBlc2NhcGUgc3BlY2lhbFxuICAgIC8vIGNoYXJhY3RlcnMgaW4gdGhlIElEICh2ZXJzdXMgdXNpbmcgdGhlICNpY29uTmFtZSBzeW50YXgpLlxuICAgIGNvbnN0IGljb25Tb3VyY2UgPSBpY29uU2V0LnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7aWNvbk5hbWV9XCJdYCk7XG5cbiAgICBpZiAoIWljb25Tb3VyY2UpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENsb25lIHRoZSBlbGVtZW50IGFuZCByZW1vdmUgdGhlIElEIHRvIHByZXZlbnQgbXVsdGlwbGUgZWxlbWVudHMgZnJvbSBiZWluZyBhZGRlZFxuICAgIC8vIHRvIHRoZSBwYWdlIHdpdGggdGhlIHNhbWUgSUQuXG4gICAgY29uc3QgaWNvbkVsZW1lbnQgPSBpY29uU291cmNlLmNsb25lTm9kZSh0cnVlKSBhcyBFbGVtZW50O1xuICAgIGljb25FbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblxuICAgIC8vIElmIHRoZSBpY29uIG5vZGUgaXMgaXRzZWxmIGFuIDxzdmc+IG5vZGUsIGNsb25lIGFuZCByZXR1cm4gaXQgZGlyZWN0bHkuIElmIG5vdCwgc2V0IGl0IGFzXG4gICAgLy8gdGhlIGNvbnRlbnQgb2YgYSBuZXcgPHN2Zz4gbm9kZS5cbiAgICBpZiAoaWNvbkVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKGljb25FbGVtZW50IGFzIFNWR0VsZW1lbnQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBub2RlIGlzIGEgPHN5bWJvbD4sIGl0IHdvbid0IGJlIHJlbmRlcmVkIHNvIHdlIGhhdmUgdG8gY29udmVydCBpdCBpbnRvIDxzdmc+LiBOb3RlXG4gICAgLy8gdGhhdCB0aGUgc2FtZSBjb3VsZCBiZSBhY2hpZXZlZCBieSByZWZlcnJpbmcgdG8gaXQgdmlhIDx1c2UgaHJlZj1cIiNpZFwiPiwgaG93ZXZlciB0aGUgPHVzZT5cbiAgICAvLyB0YWcgaXMgcHJvYmxlbWF0aWMgb24gRmlyZWZveCwgYmVjYXVzZSBpdCBuZWVkcyB0byBpbmNsdWRlIHRoZSBjdXJyZW50IHBhZ2UgcGF0aC5cbiAgICBpZiAoaWNvbkVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHRoaXMuX3RvU3ZnRWxlbWVudChpY29uRWxlbWVudCksIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZUVsZW1lbnQoJ1NWRycpIGRvZXNuJ3Qgd29yayBhcyBleHBlY3RlZDsgdGhlIERPTSBlbmRzIHVwIHdpdGhcbiAgICAvLyB0aGUgY29ycmVjdCBub2RlcywgYnV0IHRoZSBTVkcgY29udGVudCBkb2Vzbid0IHJlbmRlci4gSW5zdGVhZCB3ZVxuICAgIC8vIGhhdmUgdG8gY3JlYXRlIGFuIGVtcHR5IFNWRyBub2RlIHVzaW5nIGlubmVySFRNTCBhbmQgYXBwZW5kIGl0cyBjb250ZW50LlxuICAgIC8vIEVsZW1lbnRzIGNyZWF0ZWQgdXNpbmcgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZyBoYXZlIHRoZSBzYW1lIHByb2JsZW0uXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMzAwMzI3OC9zdmctaW5uZXJodG1sLWluLWZpcmVmb3gtY2FuLW5vdC1kaXNwbGF5XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcodHJ1c3RlZEhUTUxGcm9tU3RyaW5nKCc8c3ZnPjwvc3ZnPicpKTtcbiAgICAvLyBDbG9uZSB0aGUgbm9kZSBzbyB3ZSBkb24ndCByZW1vdmUgaXQgZnJvbSB0aGUgcGFyZW50IGljb24gc2V0IGVsZW1lbnQuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHN2Zywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gdGhlIGdpdmVuIFNWRyBzdHJpbmcuXG4gICAqL1xuICBwcml2YXRlIF9zdmdFbGVtZW50RnJvbVN0cmluZyhzdHI6IFRydXN0ZWRIVE1MKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3QgZGl2ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgZGl2LmlubmVySFRNTCA9IHN0ciBhcyB1bmtub3duIGFzIHN0cmluZztcbiAgICBjb25zdCBzdmcgPSBkaXYucXVlcnlTZWxlY3Rvcignc3ZnJykgYXMgU1ZHRWxlbWVudDtcblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoIXN2Zykge1xuICAgICAgdGhyb3cgRXJyb3IoJzxzdmc+IHRhZyBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGVsZW1lbnQgaW50byBhbiBTVkcgbm9kZSBieSBjbG9uaW5nIGFsbCBvZiBpdHMgY2hpbGRyZW4uXG4gICAqL1xuICBwcml2YXRlIF90b1N2Z0VsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHRydXN0ZWRIVE1MRnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKSk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcztcblxuICAgIC8vIENvcHkgb3ZlciBhbGwgdGhlIGF0dHJpYnV0ZXMgZnJvbSB0aGUgYHN5bWJvbGAgdG8gdGhlIG5ldyBTVkcsIGV4Y2VwdCB0aGUgaWQuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB7bmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcblxuICAgICAgaWYgKG5hbWUgIT09ICdpZCcpIHtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkTm9kZXNbaV0ubm9kZVR5cGUgPT09IHRoaXMuX2RvY3VtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzW2ldLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IGF0dHJpYnV0ZXMgZm9yIGFuIFNWRyBlbGVtZW50IHRvIGJlIHVzZWQgYXMgYW4gaWNvbi5cbiAgICovXG4gIHByaXZhdGUgX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnOiBTVkdFbGVtZW50LCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiBTVkdFbGVtZW50IHtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmaXQnLCAnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCBtZWV0Jyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnZm9jdXNhYmxlJywgJ2ZhbHNlJyk7IC8vIERpc2FibGUgSUUxMSBkZWZhdWx0IGJlaGF2aW9yIHRvIG1ha2UgU1ZHcyBmb2N1c2FibGUuXG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnZpZXdCb3gpIHtcbiAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBvcHRpb25zLnZpZXdCb3gpO1xuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHdoaWNoIHByb2R1Y2VzIHRoZSBzdHJpbmcgY29udGVudHMgb2YgdGhlIGdpdmVuIGljb24uIFJlc3VsdHMgbWF5IGJlXG4gICAqIGNhY2hlZCwgc28gZnV0dXJlIGNhbGxzIHdpdGggdGhlIHNhbWUgVVJMIG1heSBub3QgY2F1c2UgYW5vdGhlciBIVFRQIHJlcXVlc3QuXG4gICAqL1xuICBwcml2YXRlIF9mZXRjaEljb24oaWNvbkNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8VHJ1c3RlZEhUTUw+IHtcbiAgICBjb25zdCB7dXJsOiBzYWZlVXJsLCBvcHRpb25zfSA9IGljb25Db25maWc7XG4gICAgY29uc3Qgd2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucz8ud2l0aENyZWRlbnRpYWxzID8/IGZhbHNlO1xuXG4gICAgaWYgKCF0aGlzLl9odHRwQ2xpZW50KSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uTm9IdHRwUHJvdmlkZXJFcnJvcigpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoc2FmZVVybCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZldGNoIGljb24gZnJvbSBVUkwgXCIke3NhZmVVcmx9XCIuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgIGlmICghdXJsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHNhZmVVcmwpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluLXByb2dyZXNzIGZldGNoZXMgdG8gYXZvaWQgc2VuZGluZyBhIGR1cGxpY2F0ZSByZXF1ZXN0IGZvciBhIFVSTCB3aGVuIHRoZXJlIGlzXG4gICAgLy8gYWxyZWFkeSBhIHJlcXVlc3QgaW4gcHJvZ3Jlc3MgZm9yIHRoYXQgVVJMLiBJdCdzIG5lY2Vzc2FyeSB0byBjYWxsIHNoYXJlKCkgb24gdGhlXG4gICAgLy8gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBodHRwLmdldCgpIHNvIHRoYXQgbXVsdGlwbGUgc3Vic2NyaWJlcnMgZG9uJ3QgY2F1c2UgbXVsdGlwbGUgWEhScy5cbiAgICBjb25zdCBpblByb2dyZXNzRmV0Y2ggPSB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5nZXQodXJsKTtcblxuICAgIGlmIChpblByb2dyZXNzRmV0Y2gpIHtcbiAgICAgIHJldHVybiBpblByb2dyZXNzRmV0Y2g7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxID0gdGhpcy5faHR0cENsaWVudC5nZXQodXJsLCB7cmVzcG9uc2VUeXBlOiAndGV4dCcsIHdpdGhDcmVkZW50aWFsc30pLnBpcGUoXG4gICAgICBtYXAoc3ZnID0+IHtcbiAgICAgICAgLy8gU2VjdXJpdHk6IFRoaXMgU1ZHIGlzIGZldGNoZWQgZnJvbSBhIFNhZmVSZXNvdXJjZVVybCwgYW5kIGlzIHRodXNcbiAgICAgICAgLy8gdHJ1c3RlZCBIVE1MLlxuICAgICAgICByZXR1cm4gdHJ1c3RlZEhUTUxGcm9tU3RyaW5nKHN2Zyk7XG4gICAgICB9KSxcbiAgICAgIGZpbmFsaXplKCgpID0+IHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLmRlbGV0ZSh1cmwpKSxcbiAgICAgIHNoYXJlKCksXG4gICAgKTtcblxuICAgIHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLnNldCh1cmwsIHJlcSk7XG4gICAgcmV0dXJuIHJlcTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBjb25maWcgYnkgbmFtZSBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gY29uZmlnLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0byByZWdpc3RlciB0aGUgY29uZmlnLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgY29uZmlnOiBTdmdJY29uQ29uZmlnKTogdGhpcyB7XG4gICAgdGhpcy5fc3ZnSWNvbkNvbmZpZ3Muc2V0KGljb25LZXkobmFtZXNwYWNlLCBpY29uTmFtZSksIGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGNvbmZpZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gY29uZmlnLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2U6IHN0cmluZywgY29uZmlnOiBTdmdJY29uQ29uZmlnKTogdGhpcyB7XG4gICAgY29uc3QgY29uZmlnTmFtZXNwYWNlID0gdGhpcy5faWNvblNldENvbmZpZ3MuZ2V0KG5hbWVzcGFjZSk7XG5cbiAgICBpZiAoY29uZmlnTmFtZXNwYWNlKSB7XG4gICAgICBjb25maWdOYW1lc3BhY2UucHVzaChjb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pY29uU2V0Q29uZmlncy5zZXQobmFtZXNwYWNlLCBbY29uZmlnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUGFyc2VzIGEgY29uZmlnJ3MgdGV4dCBpbnRvIGFuIFNWRyBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWc6IExvYWRlZFN2Z0ljb25Db25maWcpOiBTVkdFbGVtZW50IHtcbiAgICBpZiAoIWNvbmZpZy5zdmdFbGVtZW50KSB7XG4gICAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyhjb25maWcuc3ZnVGV4dCk7XG4gICAgICB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHN2ZywgY29uZmlnLm9wdGlvbnMpO1xuICAgICAgY29uZmlnLnN2Z0VsZW1lbnQgPSBzdmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZy5zdmdFbGVtZW50O1xuICB9XG5cbiAgLyoqIFRyaWVzIHRvIGNyZWF0ZSBhbiBpY29uIGNvbmZpZyB0aHJvdWdoIHRoZSByZWdpc3RlcmVkIHJlc29sdmVyIGZ1bmN0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZ2V0SWNvbkNvbmZpZ0Zyb21SZXNvbHZlcnMobmFtZXNwYWNlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFN2Z0ljb25Db25maWcgfCB1bmRlZmluZWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcmVzb2x2ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9yZXNvbHZlcnNbaV0obmFtZSwgbmFtZXNwYWNlKTtcblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gaXNTYWZlVXJsV2l0aE9wdGlvbnMocmVzdWx0KVxuICAgICAgICAgID8gbmV3IFN2Z0ljb25Db25maWcocmVzdWx0LnVybCwgbnVsbCwgcmVzdWx0Lm9wdGlvbnMpXG4gICAgICAgICAgOiBuZXcgU3ZnSWNvbkNvbmZpZyhyZXN1bHQsIG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBJQ09OX1JFR0lTVFJZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIHBhcmVudFJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksXG4gIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQsXG4gIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgZG9jdW1lbnQ/OiBhbnksXG4pIHtcbiAgcmV0dXJuIHBhcmVudFJlZ2lzdHJ5IHx8IG5ldyBNYXRJY29uUmVnaXN0cnkoaHR0cENsaWVudCwgc2FuaXRpemVyLCBkb2N1bWVudCwgZXJyb3JIYW5kbGVyKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBJQ09OX1JFR0lTVFJZX1BST1ZJREVSID0ge1xuICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIE1hdEljb25SZWdpc3RyeSBhdmFpbGFibGUsIHVzZSB0aGF0LiBPdGhlcndpc2UsIHByb3ZpZGUgYSBuZXcgb25lLlxuICBwcm92aWRlOiBNYXRJY29uUmVnaXN0cnksXG4gIGRlcHM6IFtcbiAgICBbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXRJY29uUmVnaXN0cnldLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgSHR0cENsaWVudF0sXG4gICAgRG9tU2FuaXRpemVyLFxuICAgIEVycm9ySGFuZGxlcixcbiAgICBbbmV3IE9wdGlvbmFsKCksIERPQ1VNRU5UIGFzIEluamVjdGlvblRva2VuPGFueT5dLFxuICBdLFxuICB1c2VGYWN0b3J5OiBJQ09OX1JFR0lTVFJZX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuXG4vKiogQ2xvbmVzIGFuIFNWR0VsZW1lbnQgd2hpbGUgcHJlc2VydmluZyB0eXBlIGluZm9ybWF0aW9uLiAqL1xuZnVuY3Rpb24gY2xvbmVTdmcoc3ZnOiBTVkdFbGVtZW50KTogU1ZHRWxlbWVudCB7XG4gIHJldHVybiBzdmcuY2xvbmVOb2RlKHRydWUpIGFzIFNWR0VsZW1lbnQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBjYWNoZSBrZXkgdG8gdXNlIGZvciBhbiBpY29uIG5hbWVzcGFjZSBhbmQgbmFtZS4gKi9cbmZ1bmN0aW9uIGljb25LZXkobmFtZXNwYWNlOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gbmFtZXNwYWNlICsgJzonICsgbmFtZTtcbn1cblxuZnVuY3Rpb24gaXNTYWZlVXJsV2l0aE9wdGlvbnModmFsdWU6IGFueSk6IHZhbHVlIGlzIFNhZmVSZXNvdXJjZVVybFdpdGhJY29uT3B0aW9ucyB7XG4gIHJldHVybiAhISh2YWx1ZS51cmwgJiYgdmFsdWUub3B0aW9ucyk7XG59XG4iXX0=