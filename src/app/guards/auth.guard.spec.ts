import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  const sessionUserKey = 'dsomm.auth.currentUser';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionStorage.removeItem(sessionUserKey);
  });

  afterEach(() => {
    sessionStorage.removeItem(sessionUserKey);
  });

  it('allows authenticated access to protected routes', () => {
    authService.login('developer', 'dsomm-dev');

    const result = guard.canActivate(routeSnapshot(), routerState('/matrix'));

    expect(result).toBeTrue();
  });

  it('redirects unauthenticated users to login with the requested URL', () => {
    const result = guard.canActivate(routeSnapshot(), routerState('/matrix'));

    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fmatrix');
  });

  it('allows unauthenticated users to visit login', () => {
    const result = guard.canActivate(routeSnapshot(), routerState('/login'));

    expect(result).toBeTrue();
  });

  it('redirects authenticated users away from login', () => {
    authService.login('auditor', 'dsomm-audit');

    const result = guard.canActivate(routeSnapshot(), routerState('/login'));

    expect(router.serializeUrl(result as UrlTree)).toBe(AuthGuard.DEFAULT_AUTHENTICATED_ROUTE);
  });

  it('redirects unauthenticated child route activation to login', () => {
    const result = guard.canActivateChild(routeSnapshot(), routerState('/teams'));

    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fteams');
  });
});

function routeSnapshot(): ActivatedRouteSnapshot {
  return {} as ActivatedRouteSnapshot;
}

function routerState(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}
