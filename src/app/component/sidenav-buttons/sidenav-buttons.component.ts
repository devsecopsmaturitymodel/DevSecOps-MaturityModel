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
    'Teams',
    'Settings',
    'Usage',
    'Roadmap v4.0',
    'DSOMM User Day 2025',
    'About Us',
  ];
  Icons: string[] = [
    'pie_chart',
    'table_chart',
    'timeline',
    'people',
    'list',
    'description',
    'landscape',
    'school',
    'info',
  ];
  Routing: string[] = [
    '/circular-heatmap',
    '/matrix',
    '/mapping',
    '/teams',
    '/settings',
    '/usage',
    '/roadmap',
    '/userday',
    '/about',
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
