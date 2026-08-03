import { Component, OnInit, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';
import { SidenavButtonsComponent } from './component/sidenav-buttons/sidenav-buttons.component';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LogoComponent } from './component/logo/logo.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    LogoComponent,
    MatSidenavModule,
    SidenavButtonsComponent,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private titleService = inject(TitleService);

  defaultTitle = '';
  menuIsOpen: boolean = true;
  sidenavWidth: string = '250px';

  readonly title = computed(() => this.titleService.titleInfo()?.dimension || '');
  readonly subtitle = computed(() => {
    const info = this.titleService.titleInfo();
    return info?.level ? 'Level ' + info.level : '';
  });

  constructor() {
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
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    this.sidenavWidth = this.menuIsOpen ? '250px' : '0px';
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }
}
