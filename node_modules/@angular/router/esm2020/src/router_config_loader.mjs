/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectFlags, InjectionToken, NgModuleFactory } from '@angular/core';
import { ConnectableObservable, from, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, refCount } from 'rxjs/operators';
import { LoadedRouterConfig } from './config';
import { flatten, wrapIntoObservable } from './utils/collection';
import { standardizeConfig } from './utils/config';
/**
 * The [DI token](guide/glossary/#di-token) for a router configuration.
 *
 * `ROUTES` is a low level API for router configuration via dependency injection.
 *
 * We recommend that in almost all cases to use higher level APIs such as `RouterModule.forRoot()`,
 * `RouterModule.forChild()`, `provideRoutes`, or `Router.resetConfig()`.
 *
 * @publicApi
 */
export const ROUTES = new InjectionToken('ROUTES');
export class RouterConfigLoader {
    constructor(injector, compiler, onLoadStartListener, onLoadEndListener) {
        this.injector = injector;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    load(parentInjector, route) {
        if (route._loader$) {
            return route._loader$;
        }
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        const moduleFactory$ = this.loadModuleFactory(route.loadChildren);
        const loadRunner = moduleFactory$.pipe(map((factory) => {
            if (this.onLoadEndListener) {
                this.onLoadEndListener(route);
            }
            const module = factory.create(parentInjector);
            // When loading a module that doesn't provide `RouterModule.forChild()` preloader
            // will get stuck in an infinite loop. The child module's Injector will look to
            // its parent `Injector` when it doesn't find any ROUTES so it will return routes
            // for it's parent module instead.
            return new LoadedRouterConfig(flatten(module.injector.get(ROUTES, undefined, InjectFlags.Self | InjectFlags.Optional))
                .map(standardizeConfig), module);
        }), catchError((err) => {
            route._loader$ = undefined;
            throw err;
        }));
        // Use custom ConnectableObservable as share in runners pipe increasing the bundle size too much
        route._loader$ = new ConnectableObservable(loadRunner, () => new Subject())
            .pipe(refCount());
        return route._loader$;
    }
    loadModuleFactory(loadChildren) {
        return wrapIntoObservable(loadChildren()).pipe(mergeMap((t) => {
            if (t instanceof NgModuleFactory) {
                return of(t);
            }
            else {
                return from(this.compiler.compileModuleAsync(t));
            }
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2NvbmZpZ19sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlcl9jb25maWdfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBVyxXQUFXLEVBQUUsY0FBYyxFQUFZLGVBQWUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDMUUsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBTSxNQUFNLGdCQUFnQixDQUFDO0FBRXhFLE9BQU8sRUFBZSxrQkFBa0IsRUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNqRSxPQUFPLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFakQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFZLFFBQVEsQ0FBQyxDQUFDO0FBRTlELE1BQU0sT0FBTyxrQkFBa0I7SUFDN0IsWUFDWSxRQUFrQixFQUFVLFFBQWtCLEVBQzlDLG1CQUF3QyxFQUN4QyxpQkFBc0M7UUFGdEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDOUMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXFCO0lBQUcsQ0FBQztJQUV0RCxJQUFJLENBQUMsY0FBd0IsRUFBRSxLQUFZO1FBQ3pDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUM7U0FDdkI7UUFFRCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakM7UUFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFlBQWEsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQ2xDLEdBQUcsQ0FBQyxDQUFDLE9BQTZCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5QyxpRkFBaUY7WUFDakYsK0VBQStFO1lBQy9FLGlGQUFpRjtZQUNqRixrQ0FBa0M7WUFDbEMsT0FBTyxJQUFJLGtCQUFrQixDQUN6QixPQUFPLENBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDL0UsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQzNCLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLEVBQ0YsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakIsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDM0IsTUFBTSxHQUFHLENBQUM7UUFDWixDQUFDLENBQUMsQ0FDTCxDQUFDO1FBQ0YsZ0dBQWdHO1FBQ2hHLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQXNCLENBQUM7YUFDekUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQ3hCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxZQUEwQjtRQUNsRCxPQUFPLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1lBQ2pFLElBQUksQ0FBQyxZQUFZLGVBQWUsRUFBRTtnQkFDaEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEQ7UUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZXIsIEluamVjdEZsYWdzLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE5nTW9kdWxlRmFjdG9yeX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgZnJvbSwgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXAsIG1lcmdlTWFwLCByZWZDb3VudCwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TG9hZENoaWxkcmVuLCBMb2FkZWRSb3V0ZXJDb25maWcsIFJvdXRlfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2ZsYXR0ZW4sIHdyYXBJbnRvT2JzZXJ2YWJsZX0gZnJvbSAnLi91dGlscy9jb2xsZWN0aW9uJztcbmltcG9ydCB7c3RhbmRhcmRpemVDb25maWd9IGZyb20gJy4vdXRpbHMvY29uZmlnJztcblxuLyoqXG4gKiBUaGUgW0RJIHRva2VuXShndWlkZS9nbG9zc2FyeS8jZGktdG9rZW4pIGZvciBhIHJvdXRlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIGBST1VURVNgIGlzIGEgbG93IGxldmVsIEFQSSBmb3Igcm91dGVyIGNvbmZpZ3VyYXRpb24gdmlhIGRlcGVuZGVuY3kgaW5qZWN0aW9uLlxuICpcbiAqIFdlIHJlY29tbWVuZCB0aGF0IGluIGFsbW9zdCBhbGwgY2FzZXMgdG8gdXNlIGhpZ2hlciBsZXZlbCBBUElzIHN1Y2ggYXMgYFJvdXRlck1vZHVsZS5mb3JSb290KClgLFxuICogYFJvdXRlck1vZHVsZS5mb3JDaGlsZCgpYCwgYHByb3ZpZGVSb3V0ZXNgLCBvciBgUm91dGVyLnJlc2V0Q29uZmlnKClgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSb3V0ZVtdW10+KCdST1VURVMnKTtcblxuZXhwb3J0IGNsYXNzIFJvdXRlckNvbmZpZ0xvYWRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgY29tcGlsZXI6IENvbXBpbGVyLFxuICAgICAgcHJpdmF0ZSBvbkxvYWRTdGFydExpc3RlbmVyPzogKHI6IFJvdXRlKSA9PiB2b2lkLFxuICAgICAgcHJpdmF0ZSBvbkxvYWRFbmRMaXN0ZW5lcj86IChyOiBSb3V0ZSkgPT4gdm9pZCkge31cblxuICBsb2FkKHBhcmVudEluamVjdG9yOiBJbmplY3Rvciwgcm91dGU6IFJvdXRlKTogT2JzZXJ2YWJsZTxMb2FkZWRSb3V0ZXJDb25maWc+IHtcbiAgICBpZiAocm91dGUuX2xvYWRlciQpIHtcbiAgICAgIHJldHVybiByb3V0ZS5fbG9hZGVyJDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvYWRTdGFydExpc3RlbmVyKSB7XG4gICAgICB0aGlzLm9uTG9hZFN0YXJ0TGlzdGVuZXIocm91dGUpO1xuICAgIH1cbiAgICBjb25zdCBtb2R1bGVGYWN0b3J5JCA9IHRoaXMubG9hZE1vZHVsZUZhY3Rvcnkocm91dGUubG9hZENoaWxkcmVuISk7XG4gICAgY29uc3QgbG9hZFJ1bm5lciA9IG1vZHVsZUZhY3RvcnkkLnBpcGUoXG4gICAgICAgIG1hcCgoZmFjdG9yeTogTmdNb2R1bGVGYWN0b3J5PGFueT4pID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vbkxvYWRFbmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5vbkxvYWRFbmRMaXN0ZW5lcihyb3V0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGZhY3RvcnkuY3JlYXRlKHBhcmVudEluamVjdG9yKTtcbiAgICAgICAgICAvLyBXaGVuIGxvYWRpbmcgYSBtb2R1bGUgdGhhdCBkb2Vzbid0IHByb3ZpZGUgYFJvdXRlck1vZHVsZS5mb3JDaGlsZCgpYCBwcmVsb2FkZXJcbiAgICAgICAgICAvLyB3aWxsIGdldCBzdHVjayBpbiBhbiBpbmZpbml0ZSBsb29wLiBUaGUgY2hpbGQgbW9kdWxlJ3MgSW5qZWN0b3Igd2lsbCBsb29rIHRvXG4gICAgICAgICAgLy8gaXRzIHBhcmVudCBgSW5qZWN0b3JgIHdoZW4gaXQgZG9lc24ndCBmaW5kIGFueSBST1VURVMgc28gaXQgd2lsbCByZXR1cm4gcm91dGVzXG4gICAgICAgICAgLy8gZm9yIGl0J3MgcGFyZW50IG1vZHVsZSBpbnN0ZWFkLlxuICAgICAgICAgIHJldHVybiBuZXcgTG9hZGVkUm91dGVyQ29uZmlnKFxuICAgICAgICAgICAgICBmbGF0dGVuKFxuICAgICAgICAgICAgICAgICAgbW9kdWxlLmluamVjdG9yLmdldChST1VURVMsIHVuZGVmaW5lZCwgSW5qZWN0RmxhZ3MuU2VsZiB8IEluamVjdEZsYWdzLk9wdGlvbmFsKSlcbiAgICAgICAgICAgICAgICAgIC5tYXAoc3RhbmRhcmRpemVDb25maWcpLFxuICAgICAgICAgICAgICBtb2R1bGUpO1xuICAgICAgICB9KSxcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgcm91dGUuX2xvYWRlciQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KSxcbiAgICApO1xuICAgIC8vIFVzZSBjdXN0b20gQ29ubmVjdGFibGVPYnNlcnZhYmxlIGFzIHNoYXJlIGluIHJ1bm5lcnMgcGlwZSBpbmNyZWFzaW5nIHRoZSBidW5kbGUgc2l6ZSB0b28gbXVjaFxuICAgIHJvdXRlLl9sb2FkZXIkID0gbmV3IENvbm5lY3RhYmxlT2JzZXJ2YWJsZShsb2FkUnVubmVyLCAoKSA9PiBuZXcgU3ViamVjdDxMb2FkZWRSb3V0ZXJDb25maWc+KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUocmVmQ291bnQoKSk7XG4gICAgcmV0dXJuIHJvdXRlLl9sb2FkZXIkO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkTW9kdWxlRmFjdG9yeShsb2FkQ2hpbGRyZW46IExvYWRDaGlsZHJlbik6IE9ic2VydmFibGU8TmdNb2R1bGVGYWN0b3J5PGFueT4+IHtcbiAgICByZXR1cm4gd3JhcEludG9PYnNlcnZhYmxlKGxvYWRDaGlsZHJlbigpKS5waXBlKG1lcmdlTWFwKCh0OiBhbnkpID0+IHtcbiAgICAgIGlmICh0IGluc3RhbmNlb2YgTmdNb2R1bGVGYWN0b3J5KSB7XG4gICAgICAgIHJldHVybiBvZih0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuY29tcGlsZXIuY29tcGlsZU1vZHVsZUFzeW5jKHQpKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==