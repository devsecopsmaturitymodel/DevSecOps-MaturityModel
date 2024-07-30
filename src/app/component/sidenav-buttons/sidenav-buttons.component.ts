import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css'],
})
export class SidenavButtonsComponent {
  Options: string[] = [
    'Matrix',
    'Implementation Levels',
    'Mappings',
    'Usage',
    'Teams',
    'About Us',
    'DSOMM User Day 2024',
  ];
  Icons: string[] = [
    'table_chart',
    'pie_chart',
    'timeline',
    'description',
    'people',
    'info',
    'school',
  ];
  Routing: string[] = [
    '/',
    '/circular-heatmap',
    '/mapping',
    '/usage',
    '/teams',
    '/about',
    '/userday',
  ];
  constructor() {}
}
