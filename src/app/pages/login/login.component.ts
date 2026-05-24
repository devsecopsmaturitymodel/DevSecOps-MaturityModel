import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginFailed = false;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {
    this.loginFailed = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.controls['username'].value || '';
    const password = this.loginForm.controls['password'].value || '';

    if (!this.authService.login(username, password)) {
      this.loginFailed = true;
      return;
    }

    void this.router.navigateByUrl(this.getReturnUrl());
  }

  private getReturnUrl(): string {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || AuthGuard.DEFAULT_AUTHENTICATED_ROUTE;

    if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return AuthGuard.DEFAULT_AUTHENTICATED_ROUTE;
    }

    return returnUrl;
  }
}
