import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const sessionUserKey = 'dsomm.auth.currentUser';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    sessionStorage.removeItem(sessionUserKey);
  });

  afterEach(() => {
    sessionStorage.removeItem(sessionUserKey);
  });

  it('logs in a static user with valid credentials', () => {
    const loggedIn = service.login('admin', 'dsomm-admin');

    expect(loggedIn).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).toBe('admin');
  });

  it('rejects invalid credentials', () => {
    const loggedIn = service.login('admin', 'wrong-password');

    expect(loggedIn).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('clears the authenticated user on logout', () => {
    service.login('viewer', 'dsomm-view');

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });
});
