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
    'About Us',
    'Teams',
  ];
  Icons: string[] = [
    'table_chart',
    'pie_chart',
    'timeline',
    'info',
    'people',
    'people',
  ];
  Routing: string[] = [
    '/',
    '/circular-heatmap',
    '/mapping',
    '/usage',
    '/about',
    '/teams',
  ];
  constructor() {}
}
