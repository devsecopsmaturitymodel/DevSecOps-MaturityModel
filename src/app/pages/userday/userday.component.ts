import { Component, OnInit } from '@angular/core';
import { perfNow } from 'src/app/util/util';

@Component({
  selector: 'app-userday',
  templateUrl: './userday.component.html',
  styleUrls: ['./userday.component.css'],
})
export class UserdayComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Userday`);
  }
}
