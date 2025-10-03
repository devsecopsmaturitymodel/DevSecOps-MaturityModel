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
    'DSOMM User Day 2025',
    'Roadmap v4.0',
    'Settings',
  ];
  Icons: string[] = [
    'pie_chart',
    'table_chart',
    'timeline',
    'description',
    'people',
    'info',
    'school',
    'landscape',
    'list',
  ];
  Routing: string[] = [
    '/circular-heatmap',
    '/matrix',
    '/mapping',
    '/usage',
    '/teams',
    '/about',
    '/userday',
    '/roadmap',
    '/settings',
  ];

  isNightMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const currentTheme = this.themeService.getTheme();
    this.isNightMode = currentTheme === 'dark';
  }

  toggleTheme(): void {
    this.isNightMode = !this.isNightMode;
    const newTheme = this.isNightMode ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }
}
