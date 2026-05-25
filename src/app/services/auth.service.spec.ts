import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const sessionUserKey = 'dsomm.auth.currentUser';
  const authUsers = [
    { username: 'admin', password: 'dsomm-admin' },
    { username: 'viewer', password: 'dsomm-view' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.removeItem(sessionUserKey);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.removeItem(sessionUserKey);
  });

  it('logs in a configured user with valid credentials', async () => {
    await loadAuthConfig();

    const loggedIn = service.login('admin', 'dsomm-admin');

    expect(loggedIn).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).toBe('admin');
  });

  it('rejects invalid credentials', async () => {
    await loadAuthConfig();

    const loggedIn = service.login('admin', 'wrong-password');

    expect(loggedIn).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('clears the authenticated user on logout', async () => {
    await loadAuthConfig();

    service.login('viewer', 'dsomm-view');

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('rejects login when the auth config cannot be loaded', async () => {
    const configLoaded = service.loadConfig();
    const request = httpMock.expectOne('assets/auth-config.json');
    request.flush('Not found', { status: 404, statusText: 'Not Found' });

    await configLoaded;

    expect(service.login('admin', 'dsomm-admin')).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  async function loadAuthConfig(): Promise<void> {
    const configLoaded = service.loadConfig();
    const request = httpMock.expectOne('assets/auth-config.json');
    expect(request.request.method).toBe('GET');
    request.flush({ users: authUsers });
    await configLoaded;
  }
});
