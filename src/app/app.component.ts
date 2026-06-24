import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '';
  defaultTitle = '';
  subtitle = '';
  menuIsOpen: boolean = true;
  sidenavWidth: string = '250px';
  isLoginPage = false;

  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private titleService: TitleService,
    private authService: AuthService,
    private router: Router
  ) {
    this.themeService.initTheme();
  }

  ngOnInit(): void {
    let menuState: string | null = localStorage.getItem('state.menuIsOpen');
    if (menuState === 'false') {
      setTimeout(() => {
        this.menuIsOpen = false;
        this.sidenavWidth = '0px';
      }, 600);
    } else {
      this.sidenavWidth = '250px';
    }

    // Subscribe to title changes
    this.titleService.titleInfo$.pipe(takeUntil(this.destroy$)).subscribe(titleInfo => {
      this.title = titleInfo?.dimension || '';
      this.subtitle = titleInfo?.level ? 'Level ' + titleInfo?.level : '';
    });

    this.isLoginPage = this.router.url.split('?')[0] === '/login';
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        this.isLoginPage = event.urlAfterRedirects.split('?')[0] === '/login';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    this.sidenavWidth = this.menuIsOpen ? '250px' : '0px';
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser(): string | null {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
