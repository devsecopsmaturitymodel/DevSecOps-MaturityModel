import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';
import { SidenavButtonsComponent } from './component/sidenav-buttons/sidenav-buttons.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIf } from '@angular/common';
import { LogoComponent } from './component/logo/logo.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    LogoComponent,
    NgIf,
    MatSidenavModule,
    SidenavButtonsComponent,
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
