import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css'],
})
export class SidenavButtonsComponent implements OnInit {
  Options: string[] = [
    'Overview',
    'Matrix',
    'Mappings',
    'Usage',
    'Teams',
    'About Us',
    'DSOMM User Day 2024',
  ];
  Icons: string[] = [
    'pie_chart',
    'table_chart',
    'timeline',
    'description',
    'people',
    'info',
    'school',
  ];
  Routing: string[] = [
    '/circular-heatmap',
    '/matrix',
    '/mapping',
    '/usage',
    '/teams',
    '/about',
    '/userday',
  ];

  isNightMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const themePref = localStorage.getItem('theme');
    this.isNightMode = themePref === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    console.log('[toggleTheme] Triggered');

    this.isNightMode = !this.isNightMode;
    const newTheme = this.isNightMode ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }

  private applyTheme(): void {
    if (this.isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }
}
