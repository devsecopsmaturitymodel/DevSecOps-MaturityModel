/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { convertToParamMap, PRIMARY_OUTLET } from './shared';
import { equalArraysOrString, forEach, shallowEqual } from './utils/collection';
export function createEmptyUrlTree() {
    return new UrlTree(new UrlSegmentGroup([], {}), {}, null);
}
const pathCompareMap = {
    'exact': equalSegmentGroups,
    'subset': containsSegmentGroup,
};
const paramCompareMap = {
    'exact': equalParams,
    'subset': containsParams,
    'ignored': () => true,
};
export function containsTree(container, containee, options) {
    return pathCompareMap[options.paths](container.root, containee.root, options.matrixParams) &&
        paramCompareMap[options.queryParams](container.queryParams, containee.queryParams) &&
        !(options.fragment === 'exact' && container.fragment !== containee.fragment);
}
function equalParams(container, containee) {
    // TODO: This does not handle array params correctly.
    return shallowEqual(container, containee);
}
function equalSegmentGroups(container, containee, matrixParams) {
    if (!equalPath(container.segments, containee.segments))
        return false;
    if (!matrixParamsMatch(container.segments, containee.segments, matrixParams)) {
        return false;
    }
    if (container.numberOfChildren !== containee.numberOfChildren)
        return false;
    for (const c in containee.children) {
        if (!container.children[c])
            return false;
        if (!equalSegmentGroups(container.children[c], containee.children[c], matrixParams))
            return false;
    }
    return true;
}
function containsParams(container, containee) {
    return Object.keys(containee).length <= Object.keys(container).length &&
        Object.keys(containee).every(key => equalArraysOrString(container[key], containee[key]));
}
function containsSegmentGroup(container, containee, matrixParams) {
    return containsSegmentGroupHelper(container, containee, containee.segments, matrixParams);
}
function containsSegmentGroupHelper(container, containee, containeePaths, matrixParams) {
    if (container.segments.length > containeePaths.length) {
        const current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (containee.hasChildren())
            return false;
        if (!matrixParamsMatch(current, containeePaths, matrixParams))
            return false;
        return true;
    }
    else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths))
            return false;
        if (!matrixParamsMatch(container.segments, containeePaths, matrixParams))
            return false;
        for (const c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegmentGroup(container.children[c], containee.children[c], matrixParams)) {
                return false;
            }
        }
        return true;
    }
    else {
        const current = containeePaths.slice(0, container.segments.length);
        const next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current))
            return false;
        if (!matrixParamsMatch(container.segments, current, matrixParams))
            return false;
        if (!container.children[PRIMARY_OUTLET])
            return false;
        return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next, matrixParams);
    }
}
function matrixParamsMatch(containerPaths, containeePaths, options) {
    return containeePaths.every((containeeSegment, i) => {
        return paramCompareMap[options](containerPaths[i].parameters, containeeSegment.parameters);
    });
}
/**
 * @description
 *
 * Represents the parsed URL.
 *
 * Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
 * serialized tree.
 * UrlTree is a data structure that provides a lot of affordances in dealing with URLs
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree =
 *       router.parseUrl('/team/33/(user/victor//support:help)?debug=true#fragment');
 *     const f = tree.fragment; // return 'fragment'
 *     const q = tree.queryParams; // returns {debug: 'true'}
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments; // returns 2 segments 'team' and '33'
 *     g.children[PRIMARY_OUTLET].segments; // returns 2 segments 'user' and 'victor'
 *     g.children['support'].segments; // return 1 segment 'help'
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export class UrlTree {
    /** @internal */
    constructor(
    /** The root segment group of the URL tree */
    root, 
    /** The query params of the URL */
    queryParams, 
    /** The fragment of the URL */
    fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    get queryParamMap() {
        if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
        }
        return this._queryParamMap;
    }
    /** @docsNotRequired */
    toString() {
        return DEFAULT_SERIALIZER.serialize(this);
    }
}
/**
 * @description
 *
 * Represents the parsed URL segment group.
 *
 * See `UrlTree` for more information.
 *
 * @publicApi
 */
export class UrlSegmentGroup {
    constructor(
    /** The URL segments of this group. See `UrlSegment` for more information */
    segments, 
    /** The list of children of this group */
    children) {
        this.segments = segments;
        this.children = children;
        /** The parent node in the url tree */
        this.parent = null;
        forEach(children, (v, k) => v.parent = this);
    }
    /** Whether the segment has child segments */
    hasChildren() {
        return this.numberOfChildren > 0;
    }
    /** Number of child segments */
    get numberOfChildren() {
        return Object.keys(this.children).length;
    }
    /** @docsNotRequired */
    toString() {
        return serializePaths(this);
    }
}
/**
 * @description
 *
 * Represents a single URL segment.
 *
 * A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
 * parameters associated with the segment.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree = router.parseUrl('/team;id=33');
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments;
 *     s[0].path; // returns 'team'
 *     s[0].parameters; // returns {id: 33}
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export class UrlSegment {
    constructor(
    /** The path part of a URL segment */
    path, 
    /** The matrix parameters associated with a segment */
    parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    get parameterMap() {
        if (!this._parameterMap) {
            this._parameterMap = convertToParamMap(this.parameters);
        }
        return this._parameterMap;
    }
    /** @docsNotRequired */
    toString() {
        return serializePath(this);
    }
}
export function equalSegments(as, bs) {
    return equalPath(as, bs) && as.every((a, i) => shallowEqual(a.parameters, bs[i].parameters));
}
export function equalPath(as, bs) {
    if (as.length !== bs.length)
        return false;
    return as.every((a, i) => a.path === bs[i].path);
}
export function mapChildrenIntoArray(segment, fn) {
    let res = [];
    forEach(segment.children, (child, childOutlet) => {
        if (childOutlet === PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    forEach(segment.children, (child, childOutlet) => {
        if (childOutlet !== PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    return res;
}
/**
 * @description
 *
 * Serializes and deserializes a URL string into a URL tree.
 *
 * The url serialization strategy is customizable. You can
 * make all URLs case insensitive by providing a custom UrlSerializer.
 *
 * See `DefaultUrlSerializer` for an example of a URL serializer.
 *
 * @publicApi
 */
export class UrlSerializer {
}
/**
 * @description
 *
 * A default implementation of the `UrlSerializer`.
 *
 * Example URLs:
 *
 * ```
 * /inbox/33(popup:compose)
 * /inbox/33;open=true/messages/44
 * ```
 *
 * DefaultUrlSerializer uses parentheses to serialize secondary segments (e.g., popup:compose), the
 * colon syntax to specify the outlet, and the ';parameter=value' syntax (e.g., open=true) to
 * specify route specific parameters.
 *
 * @publicApi
 */
export class DefaultUrlSerializer {
    /** Parses a url into a `UrlTree` */
    parse(url) {
        const p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    }
    /** Converts a `UrlTree` into a url */
    serialize(tree) {
        const segment = `/${serializeSegment(tree.root, true)}`;
        const query = serializeQueryParams(tree.queryParams);
        const fragment = typeof tree.fragment === `string` ? `#${encodeUriFragment(tree.fragment)}` : '';
        return `${segment}${query}${fragment}`;
    }
}
const DEFAULT_SERIALIZER = new DefaultUrlSerializer();
export function serializePaths(segment) {
    return segment.segments.map(p => serializePath(p)).join('/');
}
function serializeSegment(segment, root) {
    if (!segment.hasChildren()) {
        return serializePaths(segment);
    }
    if (root) {
        const primary = segment.children[PRIMARY_OUTLET] ?
            serializeSegment(segment.children[PRIMARY_OUTLET], false) :
            '';
        const children = [];
        forEach(segment.children, (v, k) => {
            if (k !== PRIMARY_OUTLET) {
                children.push(`${k}:${serializeSegment(v, false)}`);
            }
        });
        return children.length > 0 ? `${primary}(${children.join('//')})` : primary;
    }
    else {
        const children = mapChildrenIntoArray(segment, (v, k) => {
            if (k === PRIMARY_OUTLET) {
                return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
            }
            return [`${k}:${serializeSegment(v, false)}`];
        });
        // use no parenthesis if the only child is a primary outlet route
        if (Object.keys(segment.children).length === 1 && segment.children[PRIMARY_OUTLET] != null) {
            return `${serializePaths(segment)}/${children[0]}`;
        }
        return `${serializePaths(segment)}/(${children.join('//')})`;
    }
}
/**
 * Encodes a URI string with the default encoding. This function will only ever be called from
 * `encodeUriQuery` or `encodeUriSegment` as it's the base set of encodings to be used. We need
 * a custom encoding because encodeURIComponent is too aggressive and encodes stuff that doesn't
 * have to be encoded per https://url.spec.whatwg.org.
 */
function encodeUriString(s) {
    return encodeURIComponent(s)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',');
}
/**
 * This function should be used to encode both keys and values in a query string key/value. In
 * the following URL, you need to call encodeUriQuery on "k" and "v":
 *
 * http://www.site.org/html;mk=mv?k=v#f
 */
export function encodeUriQuery(s) {
    return encodeUriString(s).replace(/%3B/gi, ';');
}
/**
 * This function should be used to encode a URL fragment. In the following URL, you need to call
 * encodeUriFragment on "f":
 *
 * http://www.site.org/html;mk=mv?k=v#f
 */
export function encodeUriFragment(s) {
    return encodeURI(s);
}
/**
 * This function should be run on any URI segment as well as the key and value in a key/value
 * pair for matrix params. In the following URL, you need to call encodeUriSegment on "html",
 * "mk", and "mv":
 *
 * http://www.site.org/html;mk=mv?k=v#f
 */
export function encodeUriSegment(s) {
    return encodeUriString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
export function decode(s) {
    return decodeURIComponent(s);
}
// Query keys/values should have the "+" replaced first, as "+" in a query string is " ".
// decodeURIComponent function will not decode "+" as a space.
export function decodeQuery(s) {
    return decode(s.replace(/\+/g, '%20'));
}
export function serializePath(path) {
    return `${encodeUriSegment(path.path)}${serializeMatrixParams(path.parameters)}`;
}
function serializeMatrixParams(params) {
    return Object.keys(params)
        .map(key => `;${encodeUriSegment(key)}=${encodeUriSegment(params[key])}`)
        .join('');
}
function serializeQueryParams(params) {
    const strParams = Object.keys(params)
        .map((name) => {
        const value = params[name];
        return Array.isArray(value) ?
            value.map(v => `${encodeUriQuery(name)}=${encodeUriQuery(v)}`).join('&') :
            `${encodeUriQuery(name)}=${encodeUriQuery(value)}`;
    })
        .filter(s => !!s);
    return strParams.length ? `?${strParams.join('&')}` : '';
}
const SEGMENT_RE = /^[^\/()?;=#]+/;
function matchSegments(str) {
    const match = str.match(SEGMENT_RE);
    return match ? match[0] : '';
}
const QUERY_PARAM_RE = /^[^=?&#]+/;
// Return the name of the query param at the start of the string or an empty string
function matchQueryParams(str) {
    const match = str.match(QUERY_PARAM_RE);
    return match ? match[0] : '';
}
const QUERY_PARAM_VALUE_RE = /^[^&#]+/;
// Return the value of the query param at the start of the string or an empty string
function matchUrlQueryParamValue(str) {
    const match = str.match(QUERY_PARAM_VALUE_RE);
    return match ? match[0] : '';
}
class UrlParser {
    constructor(url) {
        this.url = url;
        this.remaining = url;
    }
    parseRootSegment() {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
            return new UrlSegmentGroup([], {});
        }
        // The root segment group never has segments
        return new UrlSegmentGroup([], this.parseChildren());
    }
    parseQueryParams() {
        const params = {};
        if (this.consumeOptional('?')) {
            do {
                this.parseQueryParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    }
    parseFragment() {
        return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
    }
    parseChildren() {
        if (this.remaining === '') {
            return {};
        }
        this.consumeOptional('/');
        const segments = [];
        if (!this.peekStartsWith('(')) {
            segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            segments.push(this.parseSegment());
        }
        let children = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        let res = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
            res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
    }
    // parse a segment with its matrix parameters
    // ie `name;k1=v1;k2`
    parseSegment() {
        const path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error(`Empty path url segment cannot have parameters: '${this.remaining}'.`);
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
    }
    parseMatrixParams() {
        const params = {};
        while (this.consumeOptional(';')) {
            this.parseParam(params);
        }
        return params;
    }
    parseParam(params) {
        const key = matchSegments(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let value = '';
        if (this.consumeOptional('=')) {
            const valueMatch = matchSegments(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decode(key)] = decode(value);
    }
    // Parse a single query parameter `name[=value]`
    parseQueryParam(params) {
        const key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let value = '';
        if (this.consumeOptional('=')) {
            const valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        const decodedKey = decodeQuery(key);
        const decodedVal = decodeQuery(value);
        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            let currentVal = params[decodedKey];
            if (!Array.isArray(currentVal)) {
                currentVal = [currentVal];
                params[decodedKey] = currentVal;
            }
            currentVal.push(decodedVal);
        }
        else {
            // Create a new value
            params[decodedKey] = decodedVal;
        }
    }
    // parse `(a/b//outlet_name:c/d)`
    parseParens(allowPrimary) {
        const segments = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
            const path = matchSegments(this.remaining);
            const next = this.remaining[path.length];
            // if is is not one of these characters, then the segment was unescaped
            // or the group was not closed
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error(`Cannot parse url '${this.url}'`);
            }
            let outletName = undefined;
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            }
            else if (allowPrimary) {
                outletName = PRIMARY_OUTLET;
            }
            const children = this.parseChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                new UrlSegmentGroup([], children);
            this.consumeOptional('//');
        }
        return segments;
    }
    peekStartsWith(str) {
        return this.remaining.startsWith(str);
    }
    // Consumes the prefix when it is present and returns whether it has been consumed
    consumeOptional(str) {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    }
    capture(str) {
        if (!this.consumeOptional(str)) {
            throw new Error(`Expected "${str}".`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3VybF90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBb0IsY0FBYyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzdFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFOUUsTUFBTSxVQUFVLGtCQUFrQjtJQUNoQyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQXlERCxNQUFNLGNBQWMsR0FBeUQ7SUFDM0UsT0FBTyxFQUFFLGtCQUFrQjtJQUMzQixRQUFRLEVBQUUsb0JBQW9CO0NBQy9CLENBQUM7QUFDRixNQUFNLGVBQWUsR0FBOEM7SUFDakUsT0FBTyxFQUFFLFdBQVc7SUFDcEIsUUFBUSxFQUFFLGNBQWM7SUFDeEIsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7Q0FDdEIsQ0FBQztBQUVGLE1BQU0sVUFBVSxZQUFZLENBQ3hCLFNBQWtCLEVBQUUsU0FBa0IsRUFBRSxPQUE2QjtJQUN2RSxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDdEYsZUFBZSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDbEYsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFD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LElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxlQUFlLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlGLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sY0FBYyxDQUFDLEdBQVc7UUFDaEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsa0ZBQWtGO0lBQzFFLGVBQWUsQ0FBQyxHQUFXO1FBQ2pDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU8sT0FBTyxDQUFDLEdBQVc7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb252ZXJ0VG9QYXJhbU1hcCwgUGFyYW1NYXAsIFBhcmFtcywgUFJJTUFSWV9PVVRMRVR9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7ZXF1YWxBcnJheXNPclN0cmluZywgZm9yRWFjaCwgc2hhbGxvd0VxdWFsfSBmcm9tICcuL3V0aWxzL2NvbGxlY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlVcmxUcmVlKCkge1xuICByZXR1cm4gbmV3IFVybFRyZWUobmV3IFVybFNlZ21lbnRHcm91cChbXSwge30pLCB7fSwgbnVsbCk7XG59XG5cbi8qKlxuICogQSBzZXQgb2Ygb3B0aW9ucyB3aGljaCBzcGVjaWZ5IGhvdyB0byBkZXRlcm1pbmUgaWYgYSBgVXJsVHJlZWAgaXMgYWN0aXZlLCBnaXZlbiB0aGUgYFVybFRyZWVgXG4gKiBmb3IgdGhlIGN1cnJlbnQgcm91dGVyIHN0YXRlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBzZWUgUm91dGVyLmlzQWN0aXZlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSXNBY3RpdmVNYXRjaE9wdGlvbnMge1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgc3RyYXRlZ3kgZm9yIGNvbXBhcmluZyB0aGUgbWF0cml4IHBhcmFtZXRlcnMgb2YgdHdvIGBVcmxUcmVlYHMuXG4gICAqXG4gICAqIFRoZSBtYXRyaXggcGFyYW1ldGVyIG1hdGNoaW5nIGlzIGRlcGVuZGVudCBvbiB0aGUgc3RyYXRlZ3kgZm9yIG1hdGNoaW5nIHRoZVxuICAgKiBzZWdtZW50cy4gVGhhdCBpcywgaWYgdGhlIGBwYXRoc2Agb3B0aW9uIGlzIHNldCB0byBgJ3N1YnNldCdgLCBvbmx5XG4gICAqIHRoZSBtYXRyaXggcGFyYW1ldGVycyBvZiB0aGUgbWF0Y2hpbmcgc2VnbWVudHMgd2lsbCBiZSBjb21wYXJlZC5cbiAgICpcbiAgICogLSBgJ2V4YWN0J2A6IFJlcXVpcmVzIHRoYXQgbWF0Y2hpbmcgc2VnbWVudHMgYWxzbyBoYXZlIGV4YWN0IG1hdHJpeCBwYXJhbWV0ZXJcbiAgICogbWF0Y2hlcy5cbiAgICogLSBgJ3N1YnNldCdgOiBUaGUgbWF0Y2hpbmcgc2VnbWVudHMgaW4gdGhlIHJvdXRlcidzIGFjdGl2ZSBgVXJsVHJlZWAgbWF5IGNvbnRhaW5cbiAgICogZXh0cmEgbWF0cml4IHBhcmFtZXRlcnMsIGJ1dCB0aG9zZSB0aGF0IGV4aXN0IGluIHRoZSBgVXJsVHJlZWAgaW4gcXVlc3Rpb24gbXVzdCBtYXRjaC5cbiAgICogLSBgJ2lnbm9yZWQnYDogV2hlbiBjb21wYXJpbmcgYFVybFRyZWVgcywgbWF0cml4IHBhcmFtcyB3aWxsIGJlIGlnbm9yZWQuXG4gICAqL1xuICBtYXRyaXhQYXJhbXM6ICdleGFjdCd8J3N1YnNldCd8J2lnbm9yZWQnO1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgc3RyYXRlZ3kgZm9yIGNvbXBhcmluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyBvZiB0d28gYFVybFRyZWVgcy5cbiAgICpcbiAgICogLSBgJ2V4YWN0J2A6IHRoZSBxdWVyeSBwYXJhbWV0ZXJzIG11c3QgbWF0Y2ggZXhhY3RseS5cbiAgICogLSBgJ3N1YnNldCdgOiB0aGUgYWN0aXZlIGBVcmxUcmVlYCBtYXkgY29udGFpbiBleHRyYSBwYXJhbWV0ZXJzLFxuICAgKiBidXQgbXVzdCBtYXRjaCB0aGUga2V5IGFuZCB2YWx1ZSBvZiBhbnkgdGhhdCBleGlzdCBpbiB0aGUgYFVybFRyZWVgIGluIHF1ZXN0aW9uLlxuICAgKiAtIGAnaWdub3JlZCdgOiBXaGVuIGNvbXBhcmluZyBgVXJsVHJlZWBzLCBxdWVyeSBwYXJhbXMgd2lsbCBiZSBpZ25vcmVkLlxuICAgKi9cbiAgcXVlcnlQYXJhbXM6ICdleGFjdCd8J3N1YnNldCd8J2lnbm9yZWQnO1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgc3RyYXRlZ3kgZm9yIGNvbXBhcmluZyB0aGUgYFVybFNlZ21lbnRgcyBvZiB0aGUgYFVybFRyZWVgcy5cbiAgICpcbiAgICogLSBgJ2V4YWN0J2A6IGFsbCBzZWdtZW50cyBpbiBlYWNoIGBVcmxUcmVlYCBtdXN0IG1hdGNoLlxuICAgKiAtIGAnc3Vic2V0J2A6IGEgYFVybFRyZWVgIHdpbGwgYmUgZGV0ZXJtaW5lZCB0byBiZSBhY3RpdmUgaWYgaXRcbiAgICogaXMgYSBzdWJ0cmVlIG9mIHRoZSBhY3RpdmUgcm91dGUuIFRoYXQgaXMsIHRoZSBhY3RpdmUgcm91dGUgbWF5IGNvbnRhaW4gZXh0cmFcbiAgICogc2VnbWVudHMsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgYWxsIHRoZSBzZWdtZW50cyBvZiB0aGUgYFVybFRyZWVgIGluIHF1ZXN0aW9uLlxuICAgKi9cbiAgcGF0aHM6ICdleGFjdCd8J3N1YnNldCc7XG4gIC8qKlxuICAgKiAtIGAnZXhhY3QnYDogaW5kaWNhdGVzIHRoYXQgdGhlIGBVcmxUcmVlYCBmcmFnbWVudHMgbXVzdCBiZSBlcXVhbC5cbiAgICogLSBgJ2lnbm9yZWQnYDogdGhlIGZyYWdtZW50cyB3aWxsIG5vdCBiZSBjb21wYXJlZCB3aGVuIGRldGVybWluaW5nIGlmIGFcbiAgICogYFVybFRyZWVgIGlzIGFjdGl2ZS5cbiAgICovXG4gIGZyYWdtZW50OiAnZXhhY3QnfCdpZ25vcmVkJztcbn1cblxudHlwZSBQYXJhbU1hdGNoT3B0aW9ucyA9ICdleGFjdCd8J3N1YnNldCd8J2lnbm9yZWQnO1xuXG50eXBlIFBhdGhDb21wYXJlRm4gPVxuICAgIChjb250YWluZXI6IFVybFNlZ21lbnRHcm91cCwgY29udGFpbmVlOiBVcmxTZWdtZW50R3JvdXAsIG1hdHJpeFBhcmFtczogUGFyYW1NYXRjaE9wdGlvbnMpID0+XG4gICAgICAgIGJvb2xlYW47XG50eXBlIFBhcmFtQ29tcGFyZUZuID0gKGNvbnRhaW5lcjogUGFyYW1zLCBjb250YWluZWU6IFBhcmFtcykgPT4gYm9vbGVhbjtcblxuY29uc3QgcGF0aENvbXBhcmVNYXA6IFJlY29yZDxJc0FjdGl2ZU1hdGNoT3B0aW9uc1sncGF0aHMnXSwgUGF0aENvbXBhcmVGbj4gPSB7XG4gICdleGFjdCc6IGVxdWFsU2VnbWVudEdyb3VwcyxcbiAgJ3N1YnNldCc6IGNvbnRhaW5zU2VnbWVudEdyb3VwLFxufTtcbmNvbnN0IHBhcmFtQ29tcGFyZU1hcDogUmVjb3JkPFBhcmFtTWF0Y2hPcHRpb25zLCBQYXJhbUNvbXBhcmVGbj4gPSB7XG4gICdleGFjdCc6IGVxdWFsUGFyYW1zLFxuICAnc3Vic2V0JzogY29udGFpbnNQYXJhbXMsXG4gICdpZ25vcmVkJzogKCkgPT4gdHJ1ZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc1RyZWUoXG4gICAgY29udGFpbmVyOiBVcmxUcmVlLCBjb250YWluZWU6IFVybFRyZWUsIG9wdGlvbnM6IElzQWN0aXZlTWF0Y2hPcHRpb25zKTogYm9vbGVhbiB7XG4gIHJldHVybiBwYXRoQ29tcGFyZU1hcFtvcHRpb25zLnBhdGhzXShjb250YWluZXIucm9vdCwgY29udGFpbmVlLnJvb3QsIG9wdGlvbnMubWF0cml4UGFyYW1zKSAmJlxuICAgICAgcGFyYW1Db21wYXJlTWFwW29wdGlvbnMucXVlcnlQYXJhbXNdKGNvbnRhaW5lci5xdWVyeVBhcmFtcywgY29udGFpbmVlLnF1ZXJ5UGFyYW1zKSAmJlxuICAgICAgIShvcHRpb25zLmZyYWdtZW50ID09PSAnZXhhY3QnICYmIGNvbnRhaW5lci5mcmFnbWVudCAhPT0gY29udGFpbmVlLmZyYWdtZW50KTtcbn1cblxuZnVuY3Rpb24gZXF1YWxQYXJhbXMoY29udGFpbmVyOiBQYXJhbXMsIGNvbnRhaW5lZTogUGFyYW1zKTogYm9vbGVhbiB7XG4gIC8vIFRPRE86IFRoaXMgZG9lcyBub3QgaGFuZGxlIGFycmF5IHBhcmFtcyBjb3JyZWN0bHkuXG4gIHJldHVybiBzaGFsbG93RXF1YWwoY29udGFpbmVyLCBjb250YWluZWUpO1xufVxuXG5mdW5jdGlvbiBlcXVhbFNlZ21lbnRHcm91cHMoXG4gICAgY29udGFpbmVyOiBVcmxTZWdtZW50R3JvdXAsIGNvbnRhaW5lZTogVXJsU2VnbWVudEdyb3VwLFxuICAgIG1hdHJpeFBhcmFtczogUGFyYW1NYXRjaE9wdGlvbnMpOiBib29sZWFuIHtcbiAgaWYgKCFlcXVhbFBhdGgoY29udGFpbmVyLnNlZ21lbnRzLCBjb250YWluZWUuc2VnbWVudHMpKSByZXR1cm4gZmFsc2U7XG4gIGlmICghbWF0cml4UGFyYW1zTWF0Y2goY29udGFpbmVyLnNlZ21lbnRzLCBjb250YWluZWUuc2VnbWVudHMsIG1hdHJpeFBhcmFtcykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGNvbnRhaW5lci5udW1iZXJPZkNoaWxkcmVuICE9PSBjb250YWluZWUubnVtYmVyT2ZDaGlsZHJlbikgcmV0dXJuIGZhbHNlO1xuICBmb3IgKGNvbnN0IGMgaW4gY29udGFpbmVlLmNoaWxkcmVuKSB7XG4gICAgaWYgKCFjb250YWluZXIuY2hpbGRyZW5bY10pIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWVxdWFsU2VnbWVudEdyb3Vwcyhjb250YWluZXIuY2hpbGRyZW5bY10sIGNvbnRhaW5lZS5jaGlsZHJlbltjXSwgbWF0cml4UGFyYW1zKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNQYXJhbXMoY29udGFpbmVyOiBQYXJhbXMsIGNvbnRhaW5lZTogUGFyYW1zKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhjb250YWluZWUpLmxlbmd0aCA8PSBPYmplY3Qua2V5cyhjb250YWluZXIpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LmtleXMoY29udGFpbmVlKS5ldmVyeShrZXkgPT4gZXF1YWxBcnJheXNPclN0cmluZyhjb250YWluZXJba2V5XSwgY29udGFpbmVlW2tleV0pKTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNTZWdtZW50R3JvdXAoXG4gICAgY29udGFpbmVyOiBVcmxTZWdtZW50R3JvdXAsIGNvbnRhaW5lZTogVXJsU2VnbWVudEdyb3VwLFxuICAgIG1hdHJpeFBhcmFtczogUGFyYW1NYXRjaE9wdGlvbnMpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvbnRhaW5zU2VnbWVudEdyb3VwSGVscGVyKGNvbnRhaW5lciwgY29udGFpbmVlLCBjb250YWluZWUuc2VnbWVudHMsIG1hdHJpeFBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zU2VnbWVudEdyb3VwSGVscGVyKFxuICAgIGNvbnRhaW5lcjogVXJsU2VnbWVudEdyb3VwLCBjb250YWluZWU6IFVybFNlZ21lbnRHcm91cCwgY29udGFpbmVlUGF0aHM6IFVybFNlZ21lbnRbXSxcbiAgICBtYXRyaXhQYXJhbXM6IFBhcmFtTWF0Y2hPcHRpb25zKTogYm9vbGVhbiB7XG4gIGlmIChjb250YWluZXIuc2VnbWVudHMubGVuZ3RoID4gY29udGFpbmVlUGF0aHMubGVuZ3RoKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGNvbnRhaW5lci5zZWdtZW50cy5zbGljZSgwLCBjb250YWluZWVQYXRocy5sZW5ndGgpO1xuICAgIGlmICghZXF1YWxQYXRoKGN1cnJlbnQsIGNvbnRhaW5lZVBhdGhzKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChjb250YWluZWUuaGFzQ2hpbGRyZW4oKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghbWF0cml4UGFyYW1zTWF0Y2goY3VycmVudCwgY29udGFpbmVlUGF0aHMsIG1hdHJpeFBhcmFtcykpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGNvbnRhaW5lci5zZWdtZW50cy5sZW5ndGggPT09IGNvbnRhaW5lZVBhdGhzLmxlbmd0aCkge1xuICAgIGlmICghZXF1YWxQYXRoKGNvbnRhaW5lci5zZWdtZW50cywgY29udGFpbmVlUGF0aHMpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFtYXRyaXhQYXJhbXNNYXRjaChjb250YWluZXIuc2VnbWVudHMsIGNvbnRhaW5lZVBhdGhzLCBtYXRyaXhQYXJhbXMpKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChjb25zdCBjIGluIGNvbnRhaW5lZS5jaGlsZHJlbikge1xuICAgICAgaWYgKCFjb250YWluZXIuY2hpbGRyZW5bY10pIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY29udGFpbnNTZWdtZW50R3JvdXAoY29udGFpbmVyLmNoaWxkcmVuW2NdLCBjb250YWluZWUuY2hpbGRyZW5bY10sIG1hdHJpeFBhcmFtcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBjb250YWluZWVQYXRocy5zbGljZSgwLCBjb250YWluZXIuc2VnbWVudHMubGVuZ3RoKTtcbiAgICBjb25zdCBuZXh0ID0gY29udGFpbmVlUGF0aHMuc2xpY2UoY29udGFpbmVyLnNlZ21lbnRzLmxlbmd0aCk7XG4gICAgaWYgKCFlcXVhbFBhdGgoY29udGFpbmVyLnNlZ21lbnRzLCBjdXJyZW50KSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghbWF0cml4UGFyYW1zTWF0Y2goY29udGFpbmVyLnNlZ21lbnRzLCBjdXJyZW50LCBtYXRyaXhQYXJhbXMpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFjb250YWluZXIuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGNvbnRhaW5zU2VnbWVudEdyb3VwSGVscGVyKFxuICAgICAgICBjb250YWluZXIuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdLCBjb250YWluZWUsIG5leHQsIG1hdHJpeFBhcmFtcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWF0cml4UGFyYW1zTWF0Y2goXG4gICAgY29udGFpbmVyUGF0aHM6IFVybFNlZ21lbnRbXSwgY29udGFpbmVlUGF0aHM6IFVybFNlZ21lbnRbXSwgb3B0aW9uczogUGFyYW1NYXRjaE9wdGlvbnMpIHtcbiAgcmV0dXJuIGNvbnRhaW5lZVBhdGhzLmV2ZXJ5KChjb250YWluZWVTZWdtZW50LCBpKSA9PiB7XG4gICAgcmV0dXJuIHBhcmFtQ29tcGFyZU1hcFtvcHRpb25zXShjb250YWluZXJQYXRoc1tpXS5wYXJhbWV0ZXJzLCBjb250YWluZWVTZWdtZW50LnBhcmFtZXRlcnMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBSZXByZXNlbnRzIHRoZSBwYXJzZWQgVVJMLlxuICpcbiAqIFNpbmNlIGEgcm91dGVyIHN0YXRlIGlzIGEgdHJlZSwgYW5kIHRoZSBVUkwgaXMgbm90aGluZyBidXQgYSBzZXJpYWxpemVkIHN0YXRlLCB0aGUgVVJMIGlzIGFcbiAqIHNlcmlhbGl6ZWQgdHJlZS5cbiAqIFVybFRyZWUgaXMgYSBkYXRhIHN0cnVjdHVyZSB0aGF0IHByb3ZpZGVzIGEgbG90IG9mIGFmZm9yZGFuY2VzIGluIGRlYWxpbmcgd2l0aCBVUkxzXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiBAQ29tcG9uZW50KHt0ZW1wbGF0ZVVybDondGVtcGxhdGUuaHRtbCd9KVxuICogY2xhc3MgTXlDb21wb25lbnQge1xuICogICBjb25zdHJ1Y3Rvcihyb3V0ZXI6IFJvdXRlcikge1xuICogICAgIGNvbnN0IHRyZWU6IFVybFRyZWUgPVxuICogICAgICAgcm91dGVyLnBhcnNlVXJsKCcvdGVhbS8zMy8odXNlci92aWN0b3IvL3N1cHBvcnQ6aGVscCk/ZGVidWc9dHJ1ZSNmcmFnbWVudCcpO1xuICogICAgIGNvbnN0IGYgPSB0cmVlLmZyYWdtZW50OyAvLyByZXR1cm4gJ2ZyYWdtZW50J1xuICogICAgIGNvbnN0IHEgPSB0cmVlLnF1ZXJ5UGFyYW1zOyAvLyByZXR1cm5zIHtkZWJ1ZzogJ3RydWUnfVxuICogICAgIGNvbnN0IGc6IFVybFNlZ21lbnRHcm91cCA9IHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF07XG4gKiAgICAgY29uc3QgczogVXJsU2VnbWVudFtdID0gZy5zZWdtZW50czsgLy8gcmV0dXJucyAyIHNlZ21lbnRzICd0ZWFtJyBhbmQgJzMzJ1xuICogICAgIGcuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdLnNlZ21lbnRzOyAvLyByZXR1cm5zIDIgc2VnbWVudHMgJ3VzZXInIGFuZCAndmljdG9yJ1xuICogICAgIGcuY2hpbGRyZW5bJ3N1cHBvcnQnXS5zZWdtZW50czsgLy8gcmV0dXJuIDEgc2VnbWVudCAnaGVscCdcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVXJsVHJlZSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9xdWVyeVBhcmFtTWFwITogUGFyYW1NYXA7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIC8qKiBUaGUgcm9vdCBzZWdtZW50IGdyb3VwIG9mIHRoZSBVUkwgdHJlZSAqL1xuICAgICAgcHVibGljIHJvb3Q6IFVybFNlZ21lbnRHcm91cCxcbiAgICAgIC8qKiBUaGUgcXVlcnkgcGFyYW1zIG9mIHRoZSBVUkwgKi9cbiAgICAgIHB1YmxpYyBxdWVyeVBhcmFtczogUGFyYW1zLFxuICAgICAgLyoqIFRoZSBmcmFnbWVudCBvZiB0aGUgVVJMICovXG4gICAgICBwdWJsaWMgZnJhZ21lbnQ6IHN0cmluZ3xudWxsKSB7fVxuXG4gIGdldCBxdWVyeVBhcmFtTWFwKCk6IFBhcmFtTWFwIHtcbiAgICBpZiAoIXRoaXMuX3F1ZXJ5UGFyYW1NYXApIHtcbiAgICAgIHRoaXMuX3F1ZXJ5UGFyYW1NYXAgPSBjb252ZXJ0VG9QYXJhbU1hcCh0aGlzLnF1ZXJ5UGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5UGFyYW1NYXA7XG4gIH1cblxuICAvKiogQGRvY3NOb3RSZXF1aXJlZCAqL1xuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBERUZBVUxUX1NFUklBTElaRVIuc2VyaWFsaXplKHRoaXMpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogUmVwcmVzZW50cyB0aGUgcGFyc2VkIFVSTCBzZWdtZW50IGdyb3VwLlxuICpcbiAqIFNlZSBgVXJsVHJlZWAgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVXJsU2VnbWVudEdyb3VwIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc291cmNlU2VnbWVudD86IFVybFNlZ21lbnRHcm91cDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2VnbWVudEluZGV4U2hpZnQ/OiBudW1iZXI7XG4gIC8qKiBUaGUgcGFyZW50IG5vZGUgaW4gdGhlIHVybCB0cmVlICovXG4gIHBhcmVudDogVXJsU2VnbWVudEdyb3VwfG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgLyoqIFRoZSBVUkwgc2VnbWVudHMgb2YgdGhpcyBncm91cC4gU2VlIGBVcmxTZWdtZW50YCBmb3IgbW9yZSBpbmZvcm1hdGlvbiAqL1xuICAgICAgcHVibGljIHNlZ21lbnRzOiBVcmxTZWdtZW50W10sXG4gICAgICAvKiogVGhlIGxpc3Qgb2YgY2hpbGRyZW4gb2YgdGhpcyBncm91cCAqL1xuICAgICAgcHVibGljIGNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogVXJsU2VnbWVudEdyb3VwfSkge1xuICAgIGZvckVhY2goY2hpbGRyZW4sICh2OiBhbnksIGs6IGFueSkgPT4gdi5wYXJlbnQgPSB0aGlzKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWdtZW50IGhhcyBjaGlsZCBzZWdtZW50cyAqL1xuICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5udW1iZXJPZkNoaWxkcmVuID4gMDtcbiAgfVxuXG4gIC8qKiBOdW1iZXIgb2YgY2hpbGQgc2VnbWVudHMgKi9cbiAgZ2V0IG51bWJlck9mQ2hpbGRyZW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jaGlsZHJlbikubGVuZ3RoO1xuICB9XG5cbiAgLyoqIEBkb2NzTm90UmVxdWlyZWQgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc2VyaWFsaXplUGF0aHModGhpcyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFJlcHJlc2VudHMgYSBzaW5nbGUgVVJMIHNlZ21lbnQuXG4gKlxuICogQSBVcmxTZWdtZW50IGlzIGEgcGFydCBvZiBhIFVSTCBiZXR3ZWVuIHRoZSB0d28gc2xhc2hlcy4gSXQgY29udGFpbnMgYSBwYXRoIGFuZCB0aGUgbWF0cml4XG4gKiBwYXJhbWV0ZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2VnbWVudC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICrCoCMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiBAQ29tcG9uZW50KHt0ZW1wbGF0ZVVybDondGVtcGxhdGUuaHRtbCd9KVxuICogY2xhc3MgTXlDb21wb25lbnQge1xuICogICBjb25zdHJ1Y3Rvcihyb3V0ZXI6IFJvdXRlcikge1xuICogICAgIGNvbnN0IHRyZWU6IFVybFRyZWUgPSByb3V0ZXIucGFyc2VVcmwoJy90ZWFtO2lkPTMzJyk7XG4gKiAgICAgY29uc3QgZzogVXJsU2VnbWVudEdyb3VwID0gdHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXTtcbiAqICAgICBjb25zdCBzOiBVcmxTZWdtZW50W10gPSBnLnNlZ21lbnRzO1xuICogICAgIHNbMF0ucGF0aDsgLy8gcmV0dXJucyAndGVhbSdcbiAqICAgICBzWzBdLnBhcmFtZXRlcnM7IC8vIHJldHVybnMge2lkOiAzM31cbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVXJsU2VnbWVudCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9wYXJhbWV0ZXJNYXAhOiBQYXJhbU1hcDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIC8qKiBUaGUgcGF0aCBwYXJ0IG9mIGEgVVJMIHNlZ21lbnQgKi9cbiAgICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcsXG5cbiAgICAgIC8qKiBUaGUgbWF0cml4IHBhcmFtZXRlcnMgYXNzb2NpYXRlZCB3aXRoIGEgc2VnbWVudCAqL1xuICAgICAgcHVibGljIHBhcmFtZXRlcnM6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSkge31cblxuICBnZXQgcGFyYW1ldGVyTWFwKCk6IFBhcmFtTWFwIHtcbiAgICBpZiAoIXRoaXMuX3BhcmFtZXRlck1hcCkge1xuICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwID0gY29udmVydFRvUGFyYW1NYXAodGhpcy5wYXJhbWV0ZXJzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3BhcmFtZXRlck1hcDtcbiAgfVxuXG4gIC8qKiBAZG9jc05vdFJlcXVpcmVkICovXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNlcmlhbGl6ZVBhdGgodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsU2VnbWVudHMoYXM6IFVybFNlZ21lbnRbXSwgYnM6IFVybFNlZ21lbnRbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gZXF1YWxQYXRoKGFzLCBicykgJiYgYXMuZXZlcnkoKGEsIGkpID0+IHNoYWxsb3dFcXVhbChhLnBhcmFtZXRlcnMsIGJzW2ldLnBhcmFtZXRlcnMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsUGF0aChhczogVXJsU2VnbWVudFtdLCBiczogVXJsU2VnbWVudFtdKTogYm9vbGVhbiB7XG4gIGlmIChhcy5sZW5ndGggIT09IGJzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gYXMuZXZlcnkoKGEsIGkpID0+IGEucGF0aCA9PT0gYnNbaV0ucGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBDaGlsZHJlbkludG9BcnJheTxUPihcbiAgICBzZWdtZW50OiBVcmxTZWdtZW50R3JvdXAsIGZuOiAodjogVXJsU2VnbWVudEdyb3VwLCBrOiBzdHJpbmcpID0+IFRbXSk6IFRbXSB7XG4gIGxldCByZXM6IFRbXSA9IFtdO1xuICBmb3JFYWNoKHNlZ21lbnQuY2hpbGRyZW4sIChjaGlsZDogVXJsU2VnbWVudEdyb3VwLCBjaGlsZE91dGxldDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGNoaWxkT3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbihjaGlsZCwgY2hpbGRPdXRsZXQpKTtcbiAgICB9XG4gIH0pO1xuICBmb3JFYWNoKHNlZ21lbnQuY2hpbGRyZW4sIChjaGlsZDogVXJsU2VnbWVudEdyb3VwLCBjaGlsZE91dGxldDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGNoaWxkT3V0bGV0ICE9PSBQUklNQVJZX09VVExFVCkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbihjaGlsZCwgY2hpbGRPdXRsZXQpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzO1xufVxuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogU2VyaWFsaXplcyBhbmQgZGVzZXJpYWxpemVzIGEgVVJMIHN0cmluZyBpbnRvIGEgVVJMIHRyZWUuXG4gKlxuICogVGhlIHVybCBzZXJpYWxpemF0aW9uIHN0cmF0ZWd5IGlzIGN1c3RvbWl6YWJsZS4gWW91IGNhblxuICogbWFrZSBhbGwgVVJMcyBjYXNlIGluc2Vuc2l0aXZlIGJ5IHByb3ZpZGluZyBhIGN1c3RvbSBVcmxTZXJpYWxpemVyLlxuICpcbiAqIFNlZSBgRGVmYXVsdFVybFNlcmlhbGl6ZXJgIGZvciBhbiBleGFtcGxlIG9mIGEgVVJMIHNlcmlhbGl6ZXIuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXJsU2VyaWFsaXplciB7XG4gIC8qKiBQYXJzZSBhIHVybCBpbnRvIGEgYFVybFRyZWVgICovXG4gIGFic3RyYWN0IHBhcnNlKHVybDogc3RyaW5nKTogVXJsVHJlZTtcblxuICAvKiogQ29udmVydHMgYSBgVXJsVHJlZWAgaW50byBhIHVybCAqL1xuICBhYnN0cmFjdCBzZXJpYWxpemUodHJlZTogVXJsVHJlZSk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBBIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIGBVcmxTZXJpYWxpemVyYC5cbiAqXG4gKiBFeGFtcGxlIFVSTHM6XG4gKlxuICogYGBgXG4gKiAvaW5ib3gvMzMocG9wdXA6Y29tcG9zZSlcbiAqIC9pbmJveC8zMztvcGVuPXRydWUvbWVzc2FnZXMvNDRcbiAqIGBgYFxuICpcbiAqIERlZmF1bHRVcmxTZXJpYWxpemVyIHVzZXMgcGFyZW50aGVzZXMgdG8gc2VyaWFsaXplIHNlY29uZGFyeSBzZWdtZW50cyAoZS5nLiwgcG9wdXA6Y29tcG9zZSksIHRoZVxuICogY29sb24gc3ludGF4IHRvIHNwZWNpZnkgdGhlIG91dGxldCwgYW5kIHRoZSAnO3BhcmFtZXRlcj12YWx1ZScgc3ludGF4IChlLmcuLCBvcGVuPXRydWUpIHRvXG4gKiBzcGVjaWZ5IHJvdXRlIHNwZWNpZmljIHBhcmFtZXRlcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdFVybFNlcmlhbGl6ZXIgaW1wbGVtZW50cyBVcmxTZXJpYWxpemVyIHtcbiAgLyoqIFBhcnNlcyBhIHVybCBpbnRvIGEgYFVybFRyZWVgICovXG4gIHBhcnNlKHVybDogc3RyaW5nKTogVXJsVHJlZSB7XG4gICAgY29uc3QgcCA9IG5ldyBVcmxQYXJzZXIodXJsKTtcbiAgICByZXR1cm4gbmV3IFVybFRyZWUocC5wYXJzZVJvb3RTZWdtZW50KCksIHAucGFyc2VRdWVyeVBhcmFtcygpLCBwLnBhcnNlRnJhZ21lbnQoKSk7XG4gIH1cblxuICAvKiogQ29udmVydHMgYSBgVXJsVHJlZWAgaW50byBhIHVybCAqL1xuICBzZXJpYWxpemUodHJlZTogVXJsVHJlZSk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2VnbWVudCA9IGAvJHtzZXJpYWxpemVTZWdtZW50KHRyZWUucm9vdCwgdHJ1ZSl9YDtcbiAgICBjb25zdCBxdWVyeSA9IHNlcmlhbGl6ZVF1ZXJ5UGFyYW1zKHRyZWUucXVlcnlQYXJhbXMpO1xuICAgIGNvbnN0IGZyYWdtZW50ID1cbiAgICAgICAgdHlwZW9mIHRyZWUuZnJhZ21lbnQgPT09IGBzdHJpbmdgID8gYCMke2VuY29kZVVyaUZyYWdtZW50KHRyZWUuZnJhZ21lbnQpfWAgOiAnJztcblxuICAgIHJldHVybiBgJHtzZWdtZW50fSR7cXVlcnl9JHtmcmFnbWVudH1gO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfU0VSSUFMSVpFUiA9IG5ldyBEZWZhdWx0VXJsU2VyaWFsaXplcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUGF0aHMoc2VnbWVudDogVXJsU2VnbWVudEdyb3VwKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNlZ21lbnQuc2VnbWVudHMubWFwKHAgPT4gc2VyaWFsaXplUGF0aChwKSkuam9pbignLycpO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVTZWdtZW50KHNlZ21lbnQ6IFVybFNlZ21lbnRHcm91cCwgcm9vdDogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICghc2VnbWVudC5oYXNDaGlsZHJlbigpKSB7XG4gICAgcmV0dXJuIHNlcmlhbGl6ZVBhdGhzKHNlZ21lbnQpO1xuICB9XG5cbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBwcmltYXJ5ID0gc2VnbWVudC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0gP1xuICAgICAgICBzZXJpYWxpemVTZWdtZW50KHNlZ21lbnQuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdLCBmYWxzZSkgOlxuICAgICAgICAnJztcbiAgICBjb25zdCBjaGlsZHJlbjogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvckVhY2goc2VnbWVudC5jaGlsZHJlbiwgKHY6IFVybFNlZ21lbnRHcm91cCwgazogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoayAhPT0gUFJJTUFSWV9PVVRMRVQpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChgJHtrfToke3NlcmlhbGl6ZVNlZ21lbnQodiwgZmFsc2UpfWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuLmxlbmd0aCA+IDAgPyBgJHtwcmltYXJ5fSgke2NoaWxkcmVuLmpvaW4oJy8vJyl9KWAgOiBwcmltYXJ5O1xuXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBtYXBDaGlsZHJlbkludG9BcnJheShzZWdtZW50LCAodjogVXJsU2VnbWVudEdyb3VwLCBrOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChrID09PSBQUklNQVJZX09VVExFVCkge1xuICAgICAgICByZXR1cm4gW3NlcmlhbGl6ZVNlZ21lbnQoc2VnbWVudC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIGZhbHNlKV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbYCR7a306JHtzZXJpYWxpemVTZWdtZW50KHYsIGZhbHNlKX1gXTtcbiAgICB9KTtcblxuICAgIC8vIHVzZSBubyBwYXJlbnRoZXNpcyBpZiB0aGUgb25seSBjaGlsZCBpcyBhIHByaW1hcnkgb3V0bGV0IHJvdXRlXG4gICAgaWYgKE9iamVjdC5rZXlzKHNlZ21lbnQuY2hpbGRyZW4pLmxlbmd0aCA9PT0gMSAmJiBzZWdtZW50LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYCR7c2VyaWFsaXplUGF0aHMoc2VnbWVudCl9LyR7Y2hpbGRyZW5bMF19YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7c2VyaWFsaXplUGF0aHMoc2VnbWVudCl9Lygke2NoaWxkcmVuLmpvaW4oJy8vJyl9KWA7XG4gIH1cbn1cblxuLyoqXG4gKiBFbmNvZGVzIGEgVVJJIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IGVuY29kaW5nLiBUaGlzIGZ1bmN0aW9uIHdpbGwgb25seSBldmVyIGJlIGNhbGxlZCBmcm9tXG4gKiBgZW5jb2RlVXJpUXVlcnlgIG9yIGBlbmNvZGVVcmlTZWdtZW50YCBhcyBpdCdzIHRoZSBiYXNlIHNldCBvZiBlbmNvZGluZ3MgdG8gYmUgdXNlZC4gV2UgbmVlZFxuICogYSBjdXN0b20gZW5jb2RpbmcgYmVjYXVzZSBlbmNvZGVVUklDb21wb25lbnQgaXMgdG9vIGFnZ3Jlc3NpdmUgYW5kIGVuY29kZXMgc3R1ZmYgdGhhdCBkb2Vzbid0XG4gKiBoYXZlIHRvIGJlIGVuY29kZWQgcGVyIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZy5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlVXJpU3RyaW5nKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQocylcbiAgICAgIC5yZXBsYWNlKC8lNDAvZywgJ0AnKVxuICAgICAgLnJlcGxhY2UoLyUzQS9naSwgJzonKVxuICAgICAgLnJlcGxhY2UoLyUyNC9nLCAnJCcpXG4gICAgICAucmVwbGFjZSgvJTJDL2dpLCAnLCcpO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHVzZWQgdG8gZW5jb2RlIGJvdGgga2V5cyBhbmQgdmFsdWVzIGluIGEgcXVlcnkgc3RyaW5nIGtleS92YWx1ZS4gSW5cbiAqIHRoZSBmb2xsb3dpbmcgVVJMLCB5b3UgbmVlZCB0byBjYWxsIGVuY29kZVVyaVF1ZXJ5IG9uIFwia1wiIGFuZCBcInZcIjpcbiAqXG4gKiBodHRwOi8vd3d3LnNpdGUub3JnL2h0bWw7bWs9bXY/az12I2ZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVVyaVF1ZXJ5KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBlbmNvZGVVcmlTdHJpbmcocykucmVwbGFjZSgvJTNCL2dpLCAnOycpO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHVzZWQgdG8gZW5jb2RlIGEgVVJMIGZyYWdtZW50LiBJbiB0aGUgZm9sbG93aW5nIFVSTCwgeW91IG5lZWQgdG8gY2FsbFxuICogZW5jb2RlVXJpRnJhZ21lbnQgb24gXCJmXCI6XG4gKlxuICogaHR0cDovL3d3dy5zaXRlLm9yZy9odG1sO21rPW12P2s9diNmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVVcmlGcmFnbWVudChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZW5jb2RlVVJJKHMpO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHJ1biBvbiBhbnkgVVJJIHNlZ21lbnQgYXMgd2VsbCBhcyB0aGUga2V5IGFuZCB2YWx1ZSBpbiBhIGtleS92YWx1ZVxuICogcGFpciBmb3IgbWF0cml4IHBhcmFtcy4gSW4gdGhlIGZvbGxvd2luZyBVUkwsIHlvdSBuZWVkIHRvIGNhbGwgZW5jb2RlVXJpU2VnbWVudCBvbiBcImh0bWxcIixcbiAqIFwibWtcIiwgYW5kIFwibXZcIjpcbiAqXG4gKiBodHRwOi8vd3d3LnNpdGUub3JnL2h0bWw7bWs9bXY/az12I2ZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVVyaVNlZ21lbnQoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGVuY29kZVVyaVN0cmluZyhzKS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5JykucmVwbGFjZSgvJTI2L2dpLCAnJicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocyk7XG59XG5cbi8vIFF1ZXJ5IGtleXMvdmFsdWVzIHNob3VsZCBoYXZlIHRoZSBcIitcIiByZXBsYWNlZCBmaXJzdCwgYXMgXCIrXCIgaW4gYSBxdWVyeSBzdHJpbmcgaXMgXCIgXCIuXG4vLyBkZWNvZGVVUklDb21wb25lbnQgZnVuY3Rpb24gd2lsbCBub3QgZGVjb2RlIFwiK1wiIGFzIGEgc3BhY2UuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlUXVlcnkoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGRlY29kZShzLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUGF0aChwYXRoOiBVcmxTZWdtZW50KTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2VuY29kZVVyaVNlZ21lbnQocGF0aC5wYXRoKX0ke3NlcmlhbGl6ZU1hdHJpeFBhcmFtcyhwYXRoLnBhcmFtZXRlcnMpfWA7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZU1hdHJpeFBhcmFtcyhwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogc3RyaW5nIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmFtcylcbiAgICAgIC5tYXAoa2V5ID0+IGA7JHtlbmNvZGVVcmlTZWdtZW50KGtleSl9PSR7ZW5jb2RlVXJpU2VnbWVudChwYXJhbXNba2V5XSl9YClcbiAgICAgIC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlQYXJhbXMocGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHN0cmluZyB7XG4gIGNvbnN0IHN0clBhcmFtczogc3RyaW5nW10gPVxuICAgICAgT2JqZWN0LmtleXMocGFyYW1zKVxuICAgICAgICAgIC5tYXAoKG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW1zW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID9cbiAgICAgICAgICAgICAgICB2YWx1ZS5tYXAodiA9PiBgJHtlbmNvZGVVcmlRdWVyeShuYW1lKX09JHtlbmNvZGVVcmlRdWVyeSh2KX1gKS5qb2luKCcmJykgOlxuICAgICAgICAgICAgICAgIGAke2VuY29kZVVyaVF1ZXJ5KG5hbWUpfT0ke2VuY29kZVVyaVF1ZXJ5KHZhbHVlKX1gO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihzID0+ICEhcyk7XG5cbiAgcmV0dXJuIHN0clBhcmFtcy5sZW5ndGggPyBgPyR7c3RyUGFyYW1zLmpvaW4oJyYnKX1gIDogJyc7XG59XG5cbmNvbnN0IFNFR01FTlRfUkUgPSAvXlteXFwvKCk/Oz0jXSsvO1xuZnVuY3Rpb24gbWF0Y2hTZWdtZW50cyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKFNFR01FTlRfUkUpO1xuICByZXR1cm4gbWF0Y2ggPyBtYXRjaFswXSA6ICcnO1xufVxuXG5jb25zdCBRVUVSWV9QQVJBTV9SRSA9IC9eW149PyYjXSsvO1xuLy8gUmV0dXJuIHRoZSBuYW1lIG9mIHRoZSBxdWVyeSBwYXJhbSBhdCB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZyBvciBhbiBlbXB0eSBzdHJpbmdcbmZ1bmN0aW9uIG1hdGNoUXVlcnlQYXJhbXMoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaChRVUVSWV9QQVJBTV9SRSk7XG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzBdIDogJyc7XG59XG5cbmNvbnN0IFFVRVJZX1BBUkFNX1ZBTFVFX1JFID0gL15bXiYjXSsvO1xuLy8gUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgcXVlcnkgcGFyYW0gYXQgdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmcgb3IgYW4gZW1wdHkgc3RyaW5nXG5mdW5jdGlvbiBtYXRjaFVybFF1ZXJ5UGFyYW1WYWx1ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKFFVRVJZX1BBUkFNX1ZBTFVFX1JFKTtcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMF0gOiAnJztcbn1cblxuY2xhc3MgVXJsUGFyc2VyIHtcbiAgcHJpdmF0ZSByZW1haW5pbmc6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5yZW1haW5pbmcgPSB1cmw7XG4gIH1cblxuICBwYXJzZVJvb3RTZWdtZW50KCk6IFVybFNlZ21lbnRHcm91cCB7XG4gICAgdGhpcy5jb25zdW1lT3B0aW9uYWwoJy8nKTtcblxuICAgIGlmICh0aGlzLnJlbWFpbmluZyA9PT0gJycgfHwgdGhpcy5wZWVrU3RhcnRzV2l0aCgnPycpIHx8IHRoaXMucGVla1N0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgcmV0dXJuIG5ldyBVcmxTZWdtZW50R3JvdXAoW10sIHt9KTtcbiAgICB9XG5cbiAgICAvLyBUaGUgcm9vdCBzZWdtZW50IGdyb3VwIG5ldmVyIGhhcyBzZWdtZW50c1xuICAgIHJldHVybiBuZXcgVXJsU2VnbWVudEdyb3VwKFtdLCB0aGlzLnBhcnNlQ2hpbGRyZW4oKSk7XG4gIH1cblxuICBwYXJzZVF1ZXJ5UGFyYW1zKCk6IFBhcmFtcyB7XG4gICAgY29uc3QgcGFyYW1zOiBQYXJhbXMgPSB7fTtcbiAgICBpZiAodGhpcy5jb25zdW1lT3B0aW9uYWwoJz8nKSkge1xuICAgICAgZG8ge1xuICAgICAgICB0aGlzLnBhcnNlUXVlcnlQYXJhbShwYXJhbXMpO1xuICAgICAgfSB3aGlsZSAodGhpcy5jb25zdW1lT3B0aW9uYWwoJyYnKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICBwYXJzZUZyYWdtZW50KCk6IHN0cmluZ3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdW1lT3B0aW9uYWwoJyMnKSA/IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLnJlbWFpbmluZykgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUNoaWxkcmVuKCk6IHtbb3V0bGV0OiBzdHJpbmddOiBVcmxTZWdtZW50R3JvdXB9IHtcbiAgICBpZiAodGhpcy5yZW1haW5pbmcgPT09ICcnKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lT3B0aW9uYWwoJy8nKTtcblxuICAgIGNvbnN0IHNlZ21lbnRzOiBVcmxTZWdtZW50W10gPSBbXTtcbiAgICBpZiAoIXRoaXMucGVla1N0YXJ0c1dpdGgoJygnKSkge1xuICAgICAgc2VnbWVudHMucHVzaCh0aGlzLnBhcnNlU2VnbWVudCgpKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodGhpcy5wZWVrU3RhcnRzV2l0aCgnLycpICYmICF0aGlzLnBlZWtTdGFydHNXaXRoKCcvLycpICYmICF0aGlzLnBlZWtTdGFydHNXaXRoKCcvKCcpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICAgIHNlZ21lbnRzLnB1c2godGhpcy5wYXJzZVNlZ21lbnQoKSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiB7W291dGxldDogc3RyaW5nXTogVXJsU2VnbWVudEdyb3VwfSA9IHt9O1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcvKCcpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5wYXJzZVBhcmVucyh0cnVlKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzOiB7W291dGxldDogc3RyaW5nXTogVXJsU2VnbWVudEdyb3VwfSA9IHt9O1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcoJykpIHtcbiAgICAgIHJlcyA9IHRoaXMucGFyc2VQYXJlbnMoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGNoaWxkcmVuKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXNbUFJJTUFSWV9PVVRMRVRdID0gbmV3IFVybFNlZ21lbnRHcm91cChzZWdtZW50cywgY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvLyBwYXJzZSBhIHNlZ21lbnQgd2l0aCBpdHMgbWF0cml4IHBhcmFtZXRlcnNcbiAgLy8gaWUgYG5hbWU7azE9djE7azJgXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50KCk6IFVybFNlZ21lbnQge1xuICAgIGNvbnN0IHBhdGggPSBtYXRjaFNlZ21lbnRzKHRoaXMucmVtYWluaW5nKTtcbiAgICBpZiAocGF0aCA9PT0gJycgJiYgdGhpcy5wZWVrU3RhcnRzV2l0aCgnOycpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVtcHR5IHBhdGggdXJsIHNlZ21lbnQgY2Fubm90IGhhdmUgcGFyYW1ldGVyczogJyR7dGhpcy5yZW1haW5pbmd9Jy5gKTtcbiAgICB9XG5cbiAgICB0aGlzLmNhcHR1cmUocGF0aCk7XG4gICAgcmV0dXJuIG5ldyBVcmxTZWdtZW50KGRlY29kZShwYXRoKSwgdGhpcy5wYXJzZU1hdHJpeFBhcmFtcygpKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VNYXRyaXhQYXJhbXMoKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICAgIGNvbnN0IHBhcmFtczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICB3aGlsZSAodGhpcy5jb25zdW1lT3B0aW9uYWwoJzsnKSkge1xuICAgICAgdGhpcy5wYXJzZVBhcmFtKHBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlUGFyYW0ocGFyYW1zOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9IG1hdGNoU2VnbWVudHModGhpcy5yZW1haW5pbmcpO1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2FwdHVyZShrZXkpO1xuICAgIGxldCB2YWx1ZTogYW55ID0gJyc7XG4gICAgaWYgKHRoaXMuY29uc3VtZU9wdGlvbmFsKCc9JykpIHtcbiAgICAgIGNvbnN0IHZhbHVlTWF0Y2ggPSBtYXRjaFNlZ21lbnRzKHRoaXMucmVtYWluaW5nKTtcbiAgICAgIGlmICh2YWx1ZU1hdGNoKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVNYXRjaDtcbiAgICAgICAgdGhpcy5jYXB0dXJlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJhbXNbZGVjb2RlKGtleSldID0gZGVjb2RlKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgc2luZ2xlIHF1ZXJ5IHBhcmFtZXRlciBgbmFtZVs9dmFsdWVdYFxuICBwcml2YXRlIHBhcnNlUXVlcnlQYXJhbShwYXJhbXM6IFBhcmFtcyk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9IG1hdGNoUXVlcnlQYXJhbXModGhpcy5yZW1haW5pbmcpO1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2FwdHVyZShrZXkpO1xuICAgIGxldCB2YWx1ZTogYW55ID0gJyc7XG4gICAgaWYgKHRoaXMuY29uc3VtZU9wdGlvbmFsKCc9JykpIHtcbiAgICAgIGNvbnN0IHZhbHVlTWF0Y2ggPSBtYXRjaFVybFF1ZXJ5UGFyYW1WYWx1ZSh0aGlzLnJlbWFpbmluZyk7XG4gICAgICBpZiAodmFsdWVNYXRjaCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlTWF0Y2g7XG4gICAgICAgIHRoaXMuY2FwdHVyZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGVjb2RlZEtleSA9IGRlY29kZVF1ZXJ5KGtleSk7XG4gICAgY29uc3QgZGVjb2RlZFZhbCA9IGRlY29kZVF1ZXJ5KHZhbHVlKTtcblxuICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoZGVjb2RlZEtleSkpIHtcbiAgICAgIC8vIEFwcGVuZCB0byBleGlzdGluZyB2YWx1ZXNcbiAgICAgIGxldCBjdXJyZW50VmFsID0gcGFyYW1zW2RlY29kZWRLZXldO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJlbnRWYWwpKSB7XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbY3VycmVudFZhbF07XG4gICAgICAgIHBhcmFtc1tkZWNvZGVkS2V5XSA9IGN1cnJlbnRWYWw7XG4gICAgICB9XG4gICAgICBjdXJyZW50VmFsLnB1c2goZGVjb2RlZFZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyB2YWx1ZVxuICAgICAgcGFyYW1zW2RlY29kZWRLZXldID0gZGVjb2RlZFZhbDtcbiAgICB9XG4gIH1cblxuICAvLyBwYXJzZSBgKGEvYi8vb3V0bGV0X25hbWU6Yy9kKWBcbiAgcHJpdmF0ZSBwYXJzZVBhcmVucyhhbGxvd1ByaW1hcnk6IGJvb2xlYW4pOiB7W291dGxldDogc3RyaW5nXTogVXJsU2VnbWVudEdyb3VwfSB7XG4gICAgY29uc3Qgc2VnbWVudHM6IHtba2V5OiBzdHJpbmddOiBVcmxTZWdtZW50R3JvdXB9ID0ge307XG4gICAgdGhpcy5jYXB0dXJlKCcoJyk7XG5cbiAgICB3aGlsZSAoIXRoaXMuY29uc3VtZU9wdGlvbmFsKCcpJykgJiYgdGhpcy5yZW1haW5pbmcubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcGF0aCA9IG1hdGNoU2VnbWVudHModGhpcy5yZW1haW5pbmcpO1xuXG4gICAgICBjb25zdCBuZXh0ID0gdGhpcy5yZW1haW5pbmdbcGF0aC5sZW5ndGhdO1xuXG4gICAgICAvLyBpZiBpcyBpcyBub3Qgb25lIG9mIHRoZXNlIGNoYXJhY3RlcnMsIHRoZW4gdGhlIHNlZ21lbnQgd2FzIHVuZXNjYXBlZFxuICAgICAgLy8gb3IgdGhlIGdyb3VwIHdhcyBub3QgY2xvc2VkXG4gICAgICBpZiAobmV4dCAhPT0gJy8nICYmIG5leHQgIT09ICcpJyAmJiBuZXh0ICE9PSAnOycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgdXJsICcke3RoaXMudXJsfSdgKTtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dGxldE5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCE7XG4gICAgICBpZiAocGF0aC5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgICBvdXRsZXROYW1lID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5pbmRleE9mKCc6JykpO1xuICAgICAgICB0aGlzLmNhcHR1cmUob3V0bGV0TmFtZSk7XG4gICAgICAgIHRoaXMuY2FwdHVyZSgnOicpO1xuICAgICAgfSBlbHNlIGlmIChhbGxvd1ByaW1hcnkpIHtcbiAgICAgICAgb3V0bGV0TmFtZSA9IFBSSU1BUllfT1VUTEVUO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucGFyc2VDaGlsZHJlbigpO1xuICAgICAgc2VnbWVudHNbb3V0bGV0TmFtZV0gPSBPYmplY3Qua2V5cyhjaGlsZHJlbikubGVuZ3RoID09PSAxID8gY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBVcmxTZWdtZW50R3JvdXAoW10sIGNoaWxkcmVuKTtcbiAgICAgIHRoaXMuY29uc3VtZU9wdGlvbmFsKCcvLycpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgcGVla1N0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZW1haW5pbmcuc3RhcnRzV2l0aChzdHIpO1xuICB9XG5cbiAgLy8gQ29uc3VtZXMgdGhlIHByZWZpeCB3aGVuIGl0IGlzIHByZXNlbnQgYW5kIHJldHVybnMgd2hldGhlciBpdCBoYXMgYmVlbiBjb25zdW1lZFxuICBwcml2YXRlIGNvbnN1bWVPcHRpb25hbChzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKHN0cikpIHtcbiAgICAgIHRoaXMucmVtYWluaW5nID0gdGhpcy5yZW1haW5pbmcuc3Vic3RyaW5nKHN0ci5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2FwdHVyZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jb25zdW1lT3B0aW9uYWwoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBcIiR7c3RyfVwiLmApO1xuICAgIH1cbiAgfVxufVxuIl19