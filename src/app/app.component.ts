import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LogoComponent } from './component/logo/logo.component';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavButtonsComponent } from './component/sidenav-buttons/sidenav-buttons.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    RouterLink,
    LogoComponent,
    MatSidenavContainer,
    MatSidenav,
    SidenavButtonsComponent,
    MatSidenavContent,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '';
  defaultTitle = '';
  subtitle = '';
  menuIsOpen: boolean = true;
  sidenavWidth: string = '250px';

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService, private titleService: TitleService) {
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
}
