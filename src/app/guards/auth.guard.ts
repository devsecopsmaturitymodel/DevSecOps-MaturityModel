import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  static readonly DEFAULT_AUTHENTICATED_ROUTE = '/';

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  private checkAccess(url: string): boolean | UrlTree {
    if (this.isLoginUrl(url)) {
      return this.authService.isAuthenticated()
        ? this.router.parseUrl(AuthGuard.DEFAULT_AUTHENTICATED_ROUTE)
        : true;
    }

    if (this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: url } });
  }

  private isLoginUrl(url: string): boolean {
    return url.split('?')[0] === '/login';
  }
}
