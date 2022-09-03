import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css']
})
export class SidenavButtonsComponent implements OnInit {
  Options: string[] = ['Matrix','Implementation Levels','Mappings','Usage','About Us'];
  Icons: string[] = ['table_chart','pie_chart','timeline','info','people'];
  Routing: string[]=['/','/circular-heatmap','/mapping','/usage','/about']
  constructor() { }

  ngOnInit(): void {
  }

}
