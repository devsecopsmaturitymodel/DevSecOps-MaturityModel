import { Component, OnInit } from '@angular/core';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = '';
  defaultTitle = 'DSOMM beta edition';
  subtitle = '';
  menuIsOpen: boolean = true;

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
  }

  ngOnInit(): void {
    let menuState: string | null = localStorage.getItem('state.menuIsOpen');
    if (menuState === 'false') {
      setTimeout(() => {
        this.menuIsOpen = false;
      }, 600);
    }
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }
}
