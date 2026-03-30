import { Component, OnInit } from '@angular/core';
import { perfNow } from 'src/app/util/util';

@Component({
    selector: 'app-roadmap',
    templateUrl: './roadmap.component.html',
    styleUrls: ['./roadmap.component.css'],
    standalone: false
})
export class RoadmapComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Roadmap`);
  }
}
