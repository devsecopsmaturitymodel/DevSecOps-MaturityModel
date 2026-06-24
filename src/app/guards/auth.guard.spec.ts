import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

const authUsers = [
  { username: 'auditor', password: 'dsomm-audit' },
  { username: 'developer', password: 'dsomm-dev' },
];

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  let httpMock: HttpTestingController;
  const sessionUserKey = 'dsomm.auth.currentUser';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.removeItem(sessionUserKey);

    await loadAuthConfig();
  });

  afterEach(() => {
    httpMock.verify();
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

async function loadAuthConfig(): Promise<void> {
  const authService = TestBed.inject(AuthService);
  const httpMock = TestBed.inject(HttpTestingController);
  const configLoaded = authService.loadConfig();
  const request = httpMock.expectOne('assets/auth-config.json');
  request.flush({ users: authUsers });
  await configLoaded;
}
