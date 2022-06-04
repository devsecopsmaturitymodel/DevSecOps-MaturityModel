/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, inheritedParamsDataResolve, RouterStateSnapshot } from './router_state';
import { PRIMARY_OUTLET } from './shared';
import { last } from './utils/collection';
import { getOutlet, sortByMatchingOutlets } from './utils/config';
import { isImmediateMatch, match, noLeftoversInUrl, split } from './utils/config_matching';
import { TreeNode } from './utils/tree';
class NoMatch {
}
function newObservableError(e) {
    // TODO(atscott): This pattern is used throughout the router code and can be `throwError` instead.
    return new Observable((obs) => obs.error(e));
}
export function recognize(rootComponentType, config, urlTree, url, paramsInheritanceStrategy = 'emptyOnly', relativeLinkResolution = 'legacy') {
    try {
        const result = new Recognizer(rootComponentType, config, urlTree, url, paramsInheritanceStrategy, relativeLinkResolution)
            .recognize();
        if (result === null) {
            return newObservableError(new NoMatch());
        }
        else {
            return of(result);
        }
    }
    catch (e) {
        // Catch the potential error from recognize due to duplicate outlet matches and return as an
        // `Observable` error instead.
        return newObservableError(e);
    }
}
export class Recognizer {
    constructor(rootComponentType, config, urlTree, url, paramsInheritanceStrategy, relativeLinkResolution) {
        this.rootComponentType = rootComponentType;
        this.config = config;
        this.urlTree = urlTree;
        this.url = url;
        this.paramsInheritanceStrategy = paramsInheritanceStrategy;
        this.relativeLinkResolution = relativeLinkResolution;
    }
    recognize() {
        const rootSegmentGroup = split(this.urlTree.root, [], [], this.config.filter(c => c.redirectTo === undefined), this.relativeLinkResolution)
            .segmentGroup;
        const children = this.processSegmentGroup(this.config, rootSegmentGroup, PRIMARY_OUTLET);
        if (children === null) {
            return null;
        }
        // Use Object.freeze to prevent readers of the Router state from modifying it outside of a
        // navigation, resulting in the router being out of sync with the browser.
        const root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
        const rootNode = new TreeNode(root, children);
        const routeState = new RouterStateSnapshot(this.url, rootNode);
        this.inheritParamsAndData(routeState._root);
        return routeState;
    }
    inheritParamsAndData(routeNode) {
        const route = routeNode.value;
        const i = inheritedParamsDataResolve(route, this.paramsInheritanceStrategy);
        route.params = Object.freeze(i.params);
        route.data = Object.freeze(i.data);
        routeNode.children.forEach(n => this.inheritParamsAndData(n));
    }
    processSegmentGroup(config, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return this.processChildren(config, segmentGroup);
        }
        return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
    }
    /**
     * Matches every child outlet in the `segmentGroup` to a `Route` in the config. Returns `null` if
     * we cannot find a match for _any_ of the children.
     *
     * @param config - The `Routes` to match against
     * @param segmentGroup - The `UrlSegmentGroup` whose children need to be matched against the
     *     config.
     */
    processChildren(config, segmentGroup) {
        const children = [];
        for (const childOutlet of Object.keys(segmentGroup.children)) {
            const child = segmentGroup.children[childOutlet];
            // Sort the config so that routes with outlets that match the one being activated appear
            // first, followed by routes for other outlets, which might match if they have an empty path.
            const sortedConfig = sortByMatchingOutlets(config, childOutlet);
            const outletChildren = this.processSegmentGroup(sortedConfig, child, childOutlet);
            if (outletChildren === null) {
                // Configs must match all segment children so because we did not find a match for this
                // outlet, return `null`.
                return null;
            }
            children.push(...outletChildren);
        }
        // Because we may have matched two outlets to the same empty path segment, we can have multiple
        // activated results for the same outlet. We should merge the children of these results so the
        // final return value is only one `TreeNode` per outlet.
        const mergedChildren = mergeEmptyPathMatches(children);
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            // This should really never happen - we are only taking the first match for each outlet and
            // merge the empty path matches.
            checkOutletNameUniqueness(mergedChildren);
        }
        sortActivatedRouteSnapshots(mergedChildren);
        return mergedChildren;
    }
    processSegment(config, segmentGroup, segments, outlet) {
        for (const r of config) {
            const children = this.processSegmentAgainstRoute(r, segmentGroup, segments, outlet);
            if (children !== null) {
                return children;
            }
        }
        if (noLeftoversInUrl(segmentGroup, segments, outlet)) {
            return [];
        }
        return null;
    }
    processSegmentAgainstRoute(route, rawSegment, segments, outlet) {
        if (route.redirectTo || !isImmediateMatch(route, rawSegment, segments, outlet))
            return null;
        let snapshot;
        let consumedSegments = [];
        let remainingSegments = [];
        if (route.path === '**') {
            const params = segments.length > 0 ? last(segments).parameters : {};
            snapshot = new ActivatedRouteSnapshot(segments, params, Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, getData(route), getOutlet(route), route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
        }
        else {
            const result = match(rawSegment, route, segments);
            if (!result.matched) {
                return null;
            }
            consumedSegments = result.consumedSegments;
            remainingSegments = result.remainingSegments;
            snapshot = new ActivatedRouteSnapshot(consumedSegments, result.parameters, Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, getData(route), getOutlet(route), route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
        }
        const childConfig = getChildConfig(route);
        const { segmentGroup, slicedSegments } = split(rawSegment, consumedSegments, remainingSegments, 
        // Filter out routes with redirectTo because we are trying to create activated route
        // snapshots and don't handle redirects here. That should have been done in
        // `applyRedirects`.
        childConfig.filter(c => c.redirectTo === undefined), this.relativeLinkResolution);
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
            const children = this.processChildren(childConfig, segmentGroup);
            if (children === null) {
                return null;
            }
            return [new TreeNode(snapshot, children)];
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
            return [new TreeNode(snapshot, [])];
        }
        const matchedOnOutlet = getOutlet(route) === outlet;
        // If we matched a config due to empty path match on a different outlet, we need to continue
        // passing the current outlet for the segment rather than switch to PRIMARY.
        // Note that we switch to primary when we have a match because outlet configs look like this:
        // {path: 'a', outlet: 'a', children: [
        //  {path: 'b', component: B},
        //  {path: 'c', component: C},
        // ]}
        // Notice that the children of the named outlet are configured with the primary outlet
        const children = this.processSegment(childConfig, segmentGroup, slicedSegments, matchedOnOutlet ? PRIMARY_OUTLET : outlet);
        if (children === null) {
            return null;
        }
        return [new TreeNode(snapshot, children)];
    }
}
function sortActivatedRouteSnapshots(nodes) {
    nodes.sort((a, b) => {
        if (a.value.outlet === PRIMARY_OUTLET)
            return -1;
        if (b.value.outlet === PRIMARY_OUTLET)
            return 1;
        return a.value.outlet.localeCompare(b.value.outlet);
    });
}
function getChildConfig(route) {
    if (route.children) {
        return route.children;
    }
    if (route.loadChildren) {
        return route._loadedConfig.routes;
    }
    return [];
}
function hasEmptyPathConfig(node) {
    const config = node.value.routeConfig;
    return config && config.path === '' && config.redirectTo === undefined;
}
/**
 * Finds `TreeNode`s with matching empty path route configs and merges them into `TreeNode` with the
 * children from each duplicate. This is necessary because different outlets can match a single
 * empty path route config and the results need to then be merged.
 */
function mergeEmptyPathMatches(nodes) {
    const result = [];
    // The set of nodes which contain children that were merged from two duplicate empty path nodes.
    const mergedNodes = new Set();
    for (const node of nodes) {
        if (!hasEmptyPathConfig(node)) {
            result.push(node);
            continue;
        }
        const duplicateEmptyPathNode = result.find(resultNode => node.value.routeConfig === resultNode.value.routeConfig);
        if (duplicateEmptyPathNode !== undefined) {
            duplicateEmptyPathNode.children.push(...node.children);
            mergedNodes.add(duplicateEmptyPathNode);
        }
        else {
            result.push(node);
        }
    }
    // For each node which has children from multiple sources, we need to recompute a new `TreeNode`
    // by also merging those children. This is necessary when there are multiple empty path configs in
    // a row. Put another way: whenever we combine children of two nodes, we need to also check if any
    // of those children can be combined into a single node as well.
    for (const mergedNode of mergedNodes) {
        const mergedChildren = mergeEmptyPathMatches(mergedNode.children);
        result.push(new TreeNode(mergedNode.value, mergedChildren));
    }
    return result.filter(n => !mergedNodes.has(n));
}
function checkOutletNameUniqueness(nodes) {
    const names = {};
    nodes.forEach(n => {
        const routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
            const p = routeWithSameOutletName.url.map(s => s.toString()).join('/');
            const c = n.value.url.map(s => s.toString()).join('/');
            throw new Error(`Two segments cannot have the same outlet name: '${p}' and '${c}'.`);
        }
        names[n.value.outlet] = n.value;
    });
}
function getSourceSegmentGroup(segmentGroup) {
    let s = segmentGroup;
    while (s._sourceSegment) {
        s = s._sourceSegment;
    }
    return s;
}
function getPathIndexShift(segmentGroup) {
    let s = segmentGroup;
    let res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
    while (s._sourceSegment) {
        s = s._sourceSegment;
        res += (s._segmentIndexShift ? s._segmentIndexShift : 0);
    }
    return res - 1;
}
function getData(route) {
    return route.data || {};
}
function getResolve(route) {
    return route.resolve || {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9yZWNvZ25pemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFHOUMsT0FBTyxFQUFDLHNCQUFzQixFQUFFLDBCQUEwQixFQUE2QixtQkFBbUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xJLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFeEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxTQUFTLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdEMsTUFBTSxPQUFPO0NBQUc7QUFFaEIsU0FBUyxrQkFBa0IsQ0FBQyxDQUFVO0lBQ3BDLGtHQUFrRztJQUNsRyxPQUFPLElBQUksVUFBVSxDQUFzQixDQUFDLEdBQWtDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRyxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FDckIsaUJBQWlDLEVBQUUsTUFBYyxFQUFFLE9BQWdCLEVBQUUsR0FBVyxFQUNoRiw0QkFBdUQsV0FBVyxFQUNsRSx5QkFBK0MsUUFBUTtJQUN6RCxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQ1YsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUseUJBQXlCLEVBQ2xFLHNC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QyxZQUE2QjtJQUN0RCxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUM7SUFDckIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsT0FBTyxDQUFDLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3JCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRDtJQUNELE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBWTtJQUMzQixPQUFPLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxLQUFZO0lBQzlCLE9BQU8sS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1R5cGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBPYnNlcnZlciwgb2Z9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0RhdGEsIFJlc29sdmVEYXRhLCBSb3V0ZSwgUm91dGVzfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlU25hcHNob3QsIGluaGVyaXRlZFBhcmFtc0RhdGFSZXNvbHZlLCBQYXJhbXNJbmhlcml0YW5jZVN0cmF0ZWd5LCBSb3V0ZXJTdGF0ZVNuYXBzaG90fSBmcm9tICcuL3JvdXRlcl9zdGF0ZSc7XG5pbXBvcnQge1BSSU1BUllfT1VUTEVUfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge1VybFNlZ21lbnQsIFVybFNlZ21lbnRHcm91cCwgVXJsVHJlZX0gZnJvbSAnLi91cmxfdHJlZSc7XG5pbXBvcnQge2xhc3R9IGZyb20gJy4vdXRpbHMvY29sbGVjdGlvbic7XG5pbXBvcnQge2dldE91dGxldCwgc29ydEJ5TWF0Y2hpbmdPdXRsZXRzfSBmcm9tICcuL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQge2lzSW1tZWRpYXRlTWF0Y2gsIG1hdGNoLCBub0xlZnRvdmVyc0luVXJsLCBzcGxpdH0gZnJvbSAnLi91dGlscy9jb25maWdfbWF0Y2hpbmcnO1xuaW1wb3J0IHtUcmVlTm9kZX0gZnJvbSAnLi91dGlscy90cmVlJztcblxuY2xhc3MgTm9NYXRjaCB7fVxuXG5mdW5jdGlvbiBuZXdPYnNlcnZhYmxlRXJyb3IoZTogdW5rbm93bik6IE9ic2VydmFibGU8Um91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICAvLyBUT0RPKGF0c2NvdHQpOiBUaGlzIHBhdHRlcm4gaXMgdXNlZCB0aHJvdWdob3V0IHRoZSByb3V0ZXIgY29kZSBhbmQgY2FuIGJlIGB0aHJvd0Vycm9yYCBpbnN0ZWFkLlxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8Um91dGVyU3RhdGVTbmFwc2hvdD4oKG9iczogT2JzZXJ2ZXI8Um91dGVyU3RhdGVTbmFwc2hvdD4pID0+IG9icy5lcnJvcihlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWNvZ25pemUoXG4gICAgcm9vdENvbXBvbmVudFR5cGU6IFR5cGU8YW55PnxudWxsLCBjb25maWc6IFJvdXRlcywgdXJsVHJlZTogVXJsVHJlZSwgdXJsOiBzdHJpbmcsXG4gICAgcGFyYW1zSW5oZXJpdGFuY2VTdHJhdGVneTogUGFyYW1zSW5oZXJpdGFuY2VTdHJhdGVneSA9ICdlbXB0eU9ubHknLFxuICAgIHJlbGF0aXZlTGlua1Jlc29sdXRpb246ICdsZWdhY3knfCdjb3JyZWN0ZWQnID0gJ2xlZ2FjeScpOiBPYnNlcnZhYmxlPFJvdXRlclN0YXRlU25hcHNob3Q+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUmVjb2duaXplcihcbiAgICAgICAgICAgICAgICAgICAgICAgcm9vdENvbXBvbmVudFR5cGUsIGNvbmZpZywgdXJsVHJlZSwgdXJsLCBwYXJhbXNJbmhlcml0YW5jZVN0cmF0ZWd5LFxuICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZUxpbmtSZXNvbHV0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVjb2duaXplKCk7XG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ld09ic2VydmFibGVFcnJvcihuZXcgTm9NYXRjaCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9mKHJlc3VsdCk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gQ2F0Y2ggdGhlIHBvdGVudGlhbCBlcnJvciBmcm9tIHJlY29nbml6ZSBkdWUgdG8gZHVwbGljYXRlIG91dGxldCBtYXRjaGVzIGFuZCByZXR1cm4gYXMgYW5cbiAgICAvLyBgT2JzZXJ2YWJsZWAgZXJyb3IgaW5zdGVhZC5cbiAgICByZXR1cm4gbmV3T2JzZXJ2YWJsZUVycm9yKGUpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWNvZ25pemVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJvb3RDb21wb25lbnRUeXBlOiBUeXBlPGFueT58bnVsbCwgcHJpdmF0ZSBjb25maWc6IFJvdXRlcywgcHJpdmF0ZSB1cmxUcmVlOiBVcmxUcmVlLFxuICAgICAgcHJpdmF0ZSB1cmw6IHN0cmluZywgcHJpdmF0ZSBwYXJhbXNJbmhlcml0YW5jZVN0cmF0ZWd5OiBQYXJhbXNJbmhlcml0YW5jZVN0cmF0ZWd5LFxuICAgICAgcHJpdmF0ZSByZWxhdGl2ZUxpbmtSZXNvbHV0aW9uOiAnbGVnYWN5J3wnY29ycmVjdGVkJykge31cblxuICByZWNvZ25pemUoKTogUm91dGVyU3RhdGVTbmFwc2hvdHxudWxsIHtcbiAgICBjb25zdCByb290U2VnbWVudEdyb3VwID1cbiAgICAgICAgc3BsaXQoXG4gICAgICAgICAgICB0aGlzLnVybFRyZWUucm9vdCwgW10sIFtdLCB0aGlzLmNvbmZpZy5maWx0ZXIoYyA9PiBjLnJlZGlyZWN0VG8gPT09IHVuZGVmaW5lZCksXG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlTGlua1Jlc29sdXRpb24pXG4gICAgICAgICAgICAuc2VnbWVudEdyb3VwO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnByb2Nlc3NTZWdtZW50R3JvdXAodGhpcy5jb25maWcsIHJvb3RTZWdtZW50R3JvdXAsIFBSSU1BUllfT1VUTEVUKTtcbiAgICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFVzZSBPYmplY3QuZnJlZXplIHRvIHByZXZlbnQgcmVhZGVycyBvZiB0aGUgUm91dGVyIHN0YXRlIGZyb20gbW9kaWZ5aW5nIGl0IG91dHNpZGUgb2YgYVxuICAgIC8vIG5hdmlnYXRpb24sIHJlc3VsdGluZyBpbiB0aGUgcm91dGVyIGJlaW5nIG91dCBvZiBzeW5jIHdpdGggdGhlIGJyb3dzZXIuXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KFxuICAgICAgICBbXSwgT2JqZWN0LmZyZWV6ZSh7fSksIE9iamVjdC5mcmVlemUoey4uLnRoaXMudXJsVHJlZS5xdWVyeVBhcmFtc30pLCB0aGlzLnVybFRyZWUuZnJhZ21lbnQsXG4gICAgICAgIHt9LCBQUklNQVJZX09VVExFVCwgdGhpcy5yb290Q29tcG9uZW50VHlwZSwgbnVsbCwgdGhpcy51cmxUcmVlLnJvb3QsIC0xLCB7fSk7XG5cbiAgICBjb25zdCByb290Tm9kZSA9IG5ldyBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90Pihyb290LCBjaGlsZHJlbik7XG4gICAgY29uc3Qgcm91dGVTdGF0ZSA9IG5ldyBSb3V0ZXJTdGF0ZVNuYXBzaG90KHRoaXMudXJsLCByb290Tm9kZSk7XG4gICAgdGhpcy5pbmhlcml0UGFyYW1zQW5kRGF0YShyb3V0ZVN0YXRlLl9yb290KTtcbiAgICByZXR1cm4gcm91dGVTdGF0ZTtcbiAgfVxuXG4gIGluaGVyaXRQYXJhbXNBbmREYXRhKHJvdXRlTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4pOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZSA9IHJvdXRlTm9kZS52YWx1ZTtcblxuICAgIGNvbnN0IGkgPSBpbmhlcml0ZWRQYXJhbXNEYXRhUmVzb2x2ZShyb3V0ZSwgdGhpcy5wYXJhbXNJbmhlcml0YW5jZVN0cmF0ZWd5KTtcbiAgICByb3V0ZS5wYXJhbXMgPSBPYmplY3QuZnJlZXplKGkucGFyYW1zKTtcbiAgICByb3V0ZS5kYXRhID0gT2JqZWN0LmZyZWV6ZShpLmRhdGEpO1xuXG4gICAgcm91dGVOb2RlLmNoaWxkcmVuLmZvckVhY2gobiA9PiB0aGlzLmluaGVyaXRQYXJhbXNBbmREYXRhKG4pKTtcbiAgfVxuXG4gIHByb2Nlc3NTZWdtZW50R3JvdXAoY29uZmlnOiBSb3V0ZVtdLCBzZWdtZW50R3JvdXA6IFVybFNlZ21lbnRHcm91cCwgb3V0bGV0OiBzdHJpbmcpOlxuICAgICAgVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD5bXXxudWxsIHtcbiAgICBpZiAoc2VnbWVudEdyb3VwLnNlZ21lbnRzLmxlbmd0aCA9PT0gMCAmJiBzZWdtZW50R3JvdXAuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0NoaWxkcmVuKGNvbmZpZywgc2VnbWVudEdyb3VwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzU2VnbWVudChjb25maWcsIHNlZ21lbnRHcm91cCwgc2VnbWVudEdyb3VwLnNlZ21lbnRzLCBvdXRsZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgZXZlcnkgY2hpbGQgb3V0bGV0IGluIHRoZSBgc2VnbWVudEdyb3VwYCB0byBhIGBSb3V0ZWAgaW4gdGhlIGNvbmZpZy4gUmV0dXJucyBgbnVsbGAgaWZcbiAgICogd2UgY2Fubm90IGZpbmQgYSBtYXRjaCBmb3IgX2FueV8gb2YgdGhlIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gVGhlIGBSb3V0ZXNgIHRvIG1hdGNoIGFnYWluc3RcbiAgICogQHBhcmFtIHNlZ21lbnRHcm91cCAtIFRoZSBgVXJsU2VnbWVudEdyb3VwYCB3aG9zZSBjaGlsZHJlbiBuZWVkIHRvIGJlIG1hdGNoZWQgYWdhaW5zdCB0aGVcbiAgICogICAgIGNvbmZpZy5cbiAgICovXG4gIHByb2Nlc3NDaGlsZHJlbihjb25maWc6IFJvdXRlW10sIHNlZ21lbnRHcm91cDogVXJsU2VnbWVudEdyb3VwKTpcbiAgICAgIFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+W118bnVsbCB7XG4gICAgY29uc3QgY2hpbGRyZW46IEFycmF5PFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+PiA9IFtdO1xuICAgIGZvciAoY29uc3QgY2hpbGRPdXRsZXQgb2YgT2JqZWN0LmtleXMoc2VnbWVudEdyb3VwLmNoaWxkcmVuKSkge1xuICAgICAgY29uc3QgY2hpbGQgPSBzZWdtZW50R3JvdXAuY2hpbGRyZW5bY2hpbGRPdXRsZXRdO1xuICAgICAgLy8gU29ydCB0aGUgY29uZmlnIHNvIHRoYXQgcm91dGVzIHdpdGggb3V0bGV0cyB0aGF0IG1hdGNoIHRoZSBvbmUgYmVpbmcgYWN0aXZhdGVkIGFwcGVhclxuICAgICAgLy8gZmlyc3QsIGZvbGxvd2VkIGJ5IHJvdXRlcyBmb3Igb3RoZXIgb3V0bGV0cywgd2hpY2ggbWlnaHQgbWF0Y2ggaWYgdGhleSBoYXZlIGFuIGVtcHR5IHBhdGguXG4gICAgICBjb25zdCBzb3J0ZWRDb25maWcgPSBzb3J0QnlNYXRjaGluZ091dGxldHMoY29uZmlnLCBjaGlsZE91dGxldCk7XG4gICAgICBjb25zdCBvdXRsZXRDaGlsZHJlbiA9IHRoaXMucHJvY2Vzc1NlZ21lbnRHcm91cChzb3J0ZWRDb25maWcsIGNoaWxkLCBjaGlsZE91dGxldCk7XG4gICAgICBpZiAob3V0bGV0Q2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICAgICAgLy8gQ29uZmlncyBtdXN0IG1hdGNoIGFsbCBzZWdtZW50IGNoaWxkcmVuIHNvIGJlY2F1c2Ugd2UgZGlkIG5vdCBmaW5kIGEgbWF0Y2ggZm9yIHRoaXNcbiAgICAgICAgLy8gb3V0bGV0LCByZXR1cm4gYG51bGxgLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2goLi4ub3V0bGV0Q2hpbGRyZW4pO1xuICAgIH1cbiAgICAvLyBCZWNhdXNlIHdlIG1heSBoYXZlIG1hdGNoZWQgdHdvIG91dGxldHMgdG8gdGhlIHNhbWUgZW1wdHkgcGF0aCBzZWdtZW50LCB3ZSBjYW4gaGF2ZSBtdWx0aXBsZVxuICAgIC8vIGFjdGl2YXRlZCByZXN1bHRzIGZvciB0aGUgc2FtZSBvdXRsZXQuIFdlIHNob3VsZCBtZXJnZSB0aGUgY2hpbGRyZW4gb2YgdGhlc2UgcmVzdWx0cyBzbyB0aGVcbiAgICAvLyBmaW5hbCByZXR1cm4gdmFsdWUgaXMgb25seSBvbmUgYFRyZWVOb2RlYCBwZXIgb3V0bGV0LlxuICAgIGNvbnN0IG1lcmdlZENoaWxkcmVuID0gbWVyZ2VFbXB0eVBhdGhNYXRjaGVzKGNoaWxkcmVuKTtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAvLyBUaGlzIHNob3VsZCByZWFsbHkgbmV2ZXIgaGFwcGVuIC0gd2UgYXJlIG9ubHkgdGFraW5nIHRoZSBmaXJzdCBtYXRjaCBmb3IgZWFjaCBvdXRsZXQgYW5kXG4gICAgICAvLyBtZXJnZSB0aGUgZW1wdHkgcGF0aCBtYXRjaGVzLlxuICAgICAgY2hlY2tPdXRsZXROYW1lVW5pcXVlbmVzcyhtZXJnZWRDaGlsZHJlbik7XG4gICAgfVxuICAgIHNvcnRBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90cyhtZXJnZWRDaGlsZHJlbik7XG4gICAgcmV0dXJuIG1lcmdlZENoaWxkcmVuO1xuICB9XG5cbiAgcHJvY2Vzc1NlZ21lbnQoXG4gICAgICBjb25maWc6IFJvdXRlW10sIHNlZ21lbnRHcm91cDogVXJsU2VnbWVudEdyb3VwLCBzZWdtZW50czogVXJsU2VnbWVudFtdLFxuICAgICAgb3V0bGV0OiBzdHJpbmcpOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PltdfG51bGwge1xuICAgIGZvciAoY29uc3QgciBvZiBjb25maWcpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5wcm9jZXNzU2VnbWVudEFnYWluc3RSb3V0ZShyLCBzZWdtZW50R3JvdXAsIHNlZ21lbnRzLCBvdXRsZXQpO1xuICAgICAgaWYgKGNoaWxkcmVuICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5vTGVmdG92ZXJzSW5Vcmwoc2VnbWVudEdyb3VwLCBzZWdtZW50cywgb3V0bGV0KSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJvY2Vzc1NlZ21lbnRBZ2FpbnN0Um91dGUoXG4gICAgICByb3V0ZTogUm91dGUsIHJhd1NlZ21lbnQ6IFVybFNlZ21lbnRHcm91cCwgc2VnbWVudHM6IFVybFNlZ21lbnRbXSxcbiAgICAgIG91dGxldDogc3RyaW5nKTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD5bXXxudWxsIHtcbiAgICBpZiAocm91dGUucmVkaXJlY3RUbyB8fCAhaXNJbW1lZGlhdGVNYXRjaChyb3V0ZSwgcmF3U2VnbWVudCwgc2VnbWVudHMsIG91dGxldCkpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICAgIGxldCBjb25zdW1lZFNlZ21lbnRzOiBVcmxTZWdtZW50W10gPSBbXTtcbiAgICBsZXQgcmVtYWluaW5nU2VnbWVudHM6IFVybFNlZ21lbnRbXSA9IFtdO1xuXG4gICAgaWYgKHJvdXRlLnBhdGggPT09ICcqKicpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHNlZ21lbnRzLmxlbmd0aCA+IDAgPyBsYXN0KHNlZ21lbnRzKSEucGFyYW1ldGVycyA6IHt9O1xuICAgICAgc25hcHNob3QgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChcbiAgICAgICAgICBzZWdtZW50cywgcGFyYW1zLCBPYmplY3QuZnJlZXplKHsuLi50aGlzLnVybFRyZWUucXVlcnlQYXJhbXN9KSwgdGhpcy51cmxUcmVlLmZyYWdtZW50LFxuICAgICAgICAgIGdldERhdGEocm91dGUpLCBnZXRPdXRsZXQocm91dGUpLCByb3V0ZS5jb21wb25lbnQhLCByb3V0ZSxcbiAgICAgICAgICBnZXRTb3VyY2VTZWdtZW50R3JvdXAocmF3U2VnbWVudCksIGdldFBhdGhJbmRleFNoaWZ0KHJhd1NlZ21lbnQpICsgc2VnbWVudHMubGVuZ3RoLFxuICAgICAgICAgIGdldFJlc29sdmUocm91dGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2gocmF3U2VnbWVudCwgcm91dGUsIHNlZ21lbnRzKTtcbiAgICAgIGlmICghcmVzdWx0Lm1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdW1lZFNlZ21lbnRzID0gcmVzdWx0LmNvbnN1bWVkU2VnbWVudHM7XG4gICAgICByZW1haW5pbmdTZWdtZW50cyA9IHJlc3VsdC5yZW1haW5pbmdTZWdtZW50cztcblxuICAgICAgc25hcHNob3QgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChcbiAgICAgICAgICBjb25zdW1lZFNlZ21lbnRzLCByZXN1bHQucGFyYW1ldGVycywgT2JqZWN0LmZyZWV6ZSh7Li4udGhpcy51cmxUcmVlLnF1ZXJ5UGFyYW1zfSksXG4gICAgICAgICAgdGhpcy51cmxUcmVlLmZyYWdtZW50LCBnZXREYXRhKHJvdXRlKSwgZ2V0T3V0bGV0KHJvdXRlKSwgcm91dGUuY29tcG9uZW50ISwgcm91dGUsXG4gICAgICAgICAgZ2V0U291cmNlU2VnbWVudEdyb3VwKHJhd1NlZ21lbnQpLFxuICAgICAgICAgIGdldFBhdGhJbmRleFNoaWZ0KHJhd1NlZ21lbnQpICsgY29uc3VtZWRTZWdtZW50cy5sZW5ndGgsIGdldFJlc29sdmUocm91dGUpKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZENvbmZpZzogUm91dGVbXSA9IGdldENoaWxkQ29uZmlnKHJvdXRlKTtcblxuICAgIGNvbnN0IHtzZWdtZW50R3JvdXAsIHNsaWNlZFNlZ21lbnRzfSA9IHNwbGl0KFxuICAgICAgICByYXdTZWdtZW50LCBjb25zdW1lZFNlZ21lbnRzLCByZW1haW5pbmdTZWdtZW50cyxcbiAgICAgICAgLy8gRmlsdGVyIG91dCByb3V0ZXMgd2l0aCByZWRpcmVjdFRvIGJlY2F1c2Ugd2UgYXJlIHRyeWluZyB0byBjcmVhdGUgYWN0aXZhdGVkIHJvdXRlXG4gICAgICAgIC8vIHNuYXBzaG90cyBhbmQgZG9uJ3QgaGFuZGxlIHJlZGlyZWN0cyBoZXJlLiBUaGF0IHNob3VsZCBoYXZlIGJlZW4gZG9uZSBpblxuICAgICAgICAvLyBgYXBwbHlSZWRpcmVjdHNgLlxuICAgICAgICBjaGlsZENvbmZpZy5maWx0ZXIoYyA9PiBjLnJlZGlyZWN0VG8gPT09IHVuZGVmaW5lZCksIHRoaXMucmVsYXRpdmVMaW5rUmVzb2x1dGlvbik7XG5cbiAgICBpZiAoc2xpY2VkU2VnbWVudHMubGVuZ3RoID09PSAwICYmIHNlZ21lbnRHcm91cC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucHJvY2Vzc0NoaWxkcmVuKGNoaWxkQ29uZmlnLCBzZWdtZW50R3JvdXApO1xuICAgICAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtuZXcgVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4oc25hcHNob3QsIGNoaWxkcmVuKV07XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkQ29uZmlnLmxlbmd0aCA9PT0gMCAmJiBzbGljZWRTZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbbmV3IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+KHNuYXBzaG90LCBbXSldO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoZWRPbk91dGxldCA9IGdldE91dGxldChyb3V0ZSkgPT09IG91dGxldDtcbiAgICAvLyBJZiB3ZSBtYXRjaGVkIGEgY29uZmlnIGR1ZSB0byBlbXB0eSBwYXRoIG1hdGNoIG9uIGEgZGlmZmVyZW50IG91dGxldCwgd2UgbmVlZCB0byBjb250aW51ZVxuICAgIC8vIHBhc3NpbmcgdGhlIGN1cnJlbnQgb3V0bGV0IGZvciB0aGUgc2VnbWVudCByYXRoZXIgdGhhbiBzd2l0Y2ggdG8gUFJJTUFSWS5cbiAgICAvLyBOb3RlIHRoYXQgd2Ugc3dpdGNoIHRvIHByaW1hcnkgd2hlbiB3ZSBoYXZlIGEgbWF0Y2ggYmVjYXVzZSBvdXRsZXQgY29uZmlncyBsb29rIGxpa2UgdGhpczpcbiAgICAvLyB7cGF0aDogJ2EnLCBvdXRsZXQ6ICdhJywgY2hpbGRyZW46IFtcbiAgICAvLyAge3BhdGg6ICdiJywgY29tcG9uZW50OiBCfSxcbiAgICAvLyAge3BhdGg6ICdjJywgY29tcG9uZW50OiBDfSxcbiAgICAvLyBdfVxuICAgIC8vIE5vdGljZSB0aGF0IHRoZSBjaGlsZHJlbiBvZiB0aGUgbmFtZWQgb3V0bGV0IGFyZSBjb25maWd1cmVkIHdpdGggdGhlIHByaW1hcnkgb3V0bGV0XG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnByb2Nlc3NTZWdtZW50KFxuICAgICAgICBjaGlsZENvbmZpZywgc2VnbWVudEdyb3VwLCBzbGljZWRTZWdtZW50cywgbWF0Y2hlZE9uT3V0bGV0ID8gUFJJTUFSWV9PVVRMRVQgOiBvdXRsZXQpO1xuICAgIGlmIChjaGlsZHJlbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBbbmV3IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+KHNuYXBzaG90LCBjaGlsZHJlbildO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90cyhub2RlczogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD5bXSk6IHZvaWQge1xuICBub2Rlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgaWYgKGEudmFsdWUub3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkgcmV0dXJuIC0xO1xuICAgIGlmIChiLnZhbHVlLm91dGxldCA9PT0gUFJJTUFSWV9PVVRMRVQpIHJldHVybiAxO1xuICAgIHJldHVybiBhLnZhbHVlLm91dGxldC5sb2NhbGVDb21wYXJlKGIudmFsdWUub3V0bGV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ29uZmlnKHJvdXRlOiBSb3V0ZSk6IFJvdXRlW10ge1xuICBpZiAocm91dGUuY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gcm91dGUuY2hpbGRyZW47XG4gIH1cblxuICBpZiAocm91dGUubG9hZENoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHJvdXRlLl9sb2FkZWRDb25maWchLnJvdXRlcztcbiAgfVxuXG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gaGFzRW1wdHlQYXRoQ29uZmlnKG5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+KSB7XG4gIGNvbnN0IGNvbmZpZyA9IG5vZGUudmFsdWUucm91dGVDb25maWc7XG4gIHJldHVybiBjb25maWcgJiYgY29uZmlnLnBhdGggPT09ICcnICYmIGNvbmZpZy5yZWRpcmVjdFRvID09PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRmluZHMgYFRyZWVOb2RlYHMgd2l0aCBtYXRjaGluZyBlbXB0eSBwYXRoIHJvdXRlIGNvbmZpZ3MgYW5kIG1lcmdlcyB0aGVtIGludG8gYFRyZWVOb2RlYCB3aXRoIHRoZVxuICogY2hpbGRyZW4gZnJvbSBlYWNoIGR1cGxpY2F0ZS4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBkaWZmZXJlbnQgb3V0bGV0cyBjYW4gbWF0Y2ggYSBzaW5nbGVcbiAqIGVtcHR5IHBhdGggcm91dGUgY29uZmlnIGFuZCB0aGUgcmVzdWx0cyBuZWVkIHRvIHRoZW4gYmUgbWVyZ2VkLlxuICovXG5mdW5jdGlvbiBtZXJnZUVtcHR5UGF0aE1hdGNoZXMobm9kZXM6IEFycmF5PFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+Pik6XG4gICAgQXJyYXk8VHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4+IHtcbiAgY29uc3QgcmVzdWx0OiBBcnJheTxUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90Pj4gPSBbXTtcbiAgLy8gVGhlIHNldCBvZiBub2RlcyB3aGljaCBjb250YWluIGNoaWxkcmVuIHRoYXQgd2VyZSBtZXJnZWQgZnJvbSB0d28gZHVwbGljYXRlIGVtcHR5IHBhdGggbm9kZXMuXG4gIGNvbnN0IG1lcmdlZE5vZGVzOiBTZXQ8VHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4+ID0gbmV3IFNldCgpO1xuXG4gIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgIGlmICghaGFzRW1wdHlQYXRoQ29uZmlnKG5vZGUpKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGR1cGxpY2F0ZUVtcHR5UGF0aE5vZGUgPVxuICAgICAgICByZXN1bHQuZmluZChyZXN1bHROb2RlID0+IG5vZGUudmFsdWUucm91dGVDb25maWcgPT09IHJlc3VsdE5vZGUudmFsdWUucm91dGVDb25maWcpO1xuICAgIGlmIChkdXBsaWNhdGVFbXB0eVBhdGhOb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGR1cGxpY2F0ZUVtcHR5UGF0aE5vZGUuY2hpbGRyZW4ucHVzaCguLi5ub2RlLmNoaWxkcmVuKTtcbiAgICAgIG1lcmdlZE5vZGVzLmFkZChkdXBsaWNhdGVFbXB0eVBhdGhOb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG4gIC8vIEZvciBlYWNoIG5vZGUgd2hpY2ggaGFzIGNoaWxkcmVuIGZyb20gbXVsdGlwbGUgc291cmNlcywgd2UgbmVlZCB0byByZWNvbXB1dGUgYSBuZXcgYFRyZWVOb2RlYFxuICAvLyBieSBhbHNvIG1lcmdpbmcgdGhvc2UgY2hpbGRyZW4uIFRoaXMgaXMgbmVjZXNzYXJ5IHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGVtcHR5IHBhdGggY29uZmlncyBpblxuICAvLyBhIHJvdy4gUHV0IGFub3RoZXIgd2F5OiB3aGVuZXZlciB3ZSBjb21iaW5lIGNoaWxkcmVuIG9mIHR3byBub2Rlcywgd2UgbmVlZCB0byBhbHNvIGNoZWNrIGlmIGFueVxuICAvLyBvZiB0aG9zZSBjaGlsZHJlbiBjYW4gYmUgY29tYmluZWQgaW50byBhIHNpbmdsZSBub2RlIGFzIHdlbGwuXG4gIGZvciAoY29uc3QgbWVyZ2VkTm9kZSBvZiBtZXJnZWROb2Rlcykge1xuICAgIGNvbnN0IG1lcmdlZENoaWxkcmVuID0gbWVyZ2VFbXB0eVBhdGhNYXRjaGVzKG1lcmdlZE5vZGUuY2hpbGRyZW4pO1xuICAgIHJlc3VsdC5wdXNoKG5ldyBUcmVlTm9kZShtZXJnZWROb2RlLnZhbHVlLCBtZXJnZWRDaGlsZHJlbikpO1xuICB9XG4gIHJldHVybiByZXN1bHQuZmlsdGVyKG4gPT4gIW1lcmdlZE5vZGVzLmhhcyhuKSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrT3V0bGV0TmFtZVVuaXF1ZW5lc3Mobm9kZXM6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+W10pOiB2b2lkIHtcbiAgY29uc3QgbmFtZXM6IHtbazogc3RyaW5nXTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdH0gPSB7fTtcbiAgbm9kZXMuZm9yRWFjaChuID0+IHtcbiAgICBjb25zdCByb3V0ZVdpdGhTYW1lT3V0bGV0TmFtZSA9IG5hbWVzW24udmFsdWUub3V0bGV0XTtcbiAgICBpZiAocm91dGVXaXRoU2FtZU91dGxldE5hbWUpIHtcbiAgICAgIGNvbnN0IHAgPSByb3V0ZVdpdGhTYW1lT3V0bGV0TmFtZS51cmwubWFwKHMgPT4gcy50b1N0cmluZygpKS5qb2luKCcvJyk7XG4gICAgICBjb25zdCBjID0gbi52YWx1ZS51cmwubWFwKHMgPT4gcy50b1N0cmluZygpKS5qb2luKCcvJyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBzZWdtZW50cyBjYW5ub3QgaGF2ZSB0aGUgc2FtZSBvdXRsZXQgbmFtZTogJyR7cH0nIGFuZCAnJHtjfScuYCk7XG4gICAgfVxuICAgIG5hbWVzW24udmFsdWUub3V0bGV0XSA9IG4udmFsdWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VTZWdtZW50R3JvdXAoc2VnbWVudEdyb3VwOiBVcmxTZWdtZW50R3JvdXApOiBVcmxTZWdtZW50R3JvdXAge1xuICBsZXQgcyA9IHNlZ21lbnRHcm91cDtcbiAgd2hpbGUgKHMuX3NvdXJjZVNlZ21lbnQpIHtcbiAgICBzID0gcy5fc291cmNlU2VnbWVudDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aEluZGV4U2hpZnQoc2VnbWVudEdyb3VwOiBVcmxTZWdtZW50R3JvdXApOiBudW1iZXIge1xuICBsZXQgcyA9IHNlZ21lbnRHcm91cDtcbiAgbGV0IHJlcyA9IChzLl9zZWdtZW50SW5kZXhTaGlmdCA/IHMuX3NlZ21lbnRJbmRleFNoaWZ0IDogMCk7XG4gIHdoaWxlIChzLl9zb3VyY2VTZWdtZW50KSB7XG4gICAgcyA9IHMuX3NvdXJjZVNlZ21lbnQ7XG4gICAgcmVzICs9IChzLl9zZWdtZW50SW5kZXhTaGlmdCA/IHMuX3NlZ21lbnRJbmRleFNoaWZ0IDogMCk7XG4gIH1cbiAgcmV0dXJuIHJlcyAtIDE7XG59XG5cbmZ1bmN0aW9uIGdldERhdGEocm91dGU6IFJvdXRlKTogRGF0YSB7XG4gIHJldHVybiByb3V0ZS5kYXRhIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBnZXRSZXNvbHZlKHJvdXRlOiBSb3V0ZSk6IFJlc29sdmVEYXRhIHtcbiAgcmV0dXJuIHJvdXRlLnJlc29sdmUgfHwge307XG59XG4iXX0=