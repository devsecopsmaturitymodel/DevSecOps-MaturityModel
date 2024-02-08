import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent {
  constructor( private titleService: Title) {
    titleService.setTitle (' DSOMM - About us')
  }
}
