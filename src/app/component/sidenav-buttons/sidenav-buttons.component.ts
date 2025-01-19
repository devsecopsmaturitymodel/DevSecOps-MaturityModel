import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css'],
})
export class SidenavButtonsComponent {
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
  constructor() {}
}
