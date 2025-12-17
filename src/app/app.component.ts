import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';

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

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService, private titleService: TitleService) {
    this.themeService.initTheme();
  }

  ngOnInit(): void {
    let menuState: string | null = localStorage.getItem('state.menuIsOpen');
    if (menuState === 'false') {
      setTimeout(() => {
        this.menuIsOpen = false;
      }, 600);
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
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }
}
