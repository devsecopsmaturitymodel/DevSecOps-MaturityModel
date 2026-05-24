import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let routeStub: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };
  const sessionUserKey = 'dsomm.auth.currentUser';

  beforeEach(async () => {
    routeStub = {
      snapshot: {
        queryParamMap: convertToParamMap({}),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: ActivatedRoute, useValue: routeStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionStorage.removeItem(sessionUserKey);
  });

  afterEach(() => {
    sessionStorage.removeItem(sessionUserKey);
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('requires username and password before attempting login', () => {
    createComponent();
    const loginSpy = spyOn(authService, 'login').and.callThrough();

    component.login();

    expect(component.loginForm.invalid).toBeTrue();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('shows a generic error for invalid credentials', () => {
    createComponent();
    const navigateSpy = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.loginForm.setValue({ username: 'admin', password: 'wrong-password' });

    component.login();

    expect(component.loginFailed).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('logs in and redirects to the DSOMM default page', () => {
    createComponent();
    const navigateSpy = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.loginForm.setValue({ username: 'admin', password: 'dsomm-admin' });

    component.login();

    expect(authService.getCurrentUser()).toBe('admin');
    expect(navigateSpy).toHaveBeenCalledOnceWith('/');
  });

  it('redirects to the originally requested URL after login', () => {
    routeStub.snapshot.queryParamMap = convertToParamMap({ returnUrl: '/matrix?team=Team%20A' });
    createComponent();
    const navigateSpy = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.loginForm.setValue({ username: 'viewer', password: 'dsomm-view' });

    component.login();

    expect(navigateSpy).toHaveBeenCalledOnceWith('/matrix?team=Team%20A');
  });

  it('falls back to the default route for unsafe return URLs', () => {
    routeStub.snapshot.queryParamMap = convertToParamMap({ returnUrl: 'https://example.com' });
    createComponent();
    const navigateSpy = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.loginForm.setValue({ username: 'auditor', password: 'dsomm-audit' });

    component.login();

    expect(navigateSpy).toHaveBeenCalledOnceWith('/');
  });
});
