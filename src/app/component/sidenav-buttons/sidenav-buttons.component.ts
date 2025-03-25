import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    const themePref = localStorage.getItem('theme');
    this.isNightMode = themePref === 'night';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isNightMode = !this.isNightMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isNightMode ? 'night' : 'light');
  }

  private applyTheme(): void {
    if (this.isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }
}
