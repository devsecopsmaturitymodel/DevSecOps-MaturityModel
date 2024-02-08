import { Component } from '@angular/core';


import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css'],
})
export class UsageComponent {
  constructor( private titleService: Title) {
    titleService.setTitle (' DSOMM - Usage')
  }
}
