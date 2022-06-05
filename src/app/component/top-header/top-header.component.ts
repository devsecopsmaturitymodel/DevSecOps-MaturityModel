import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  @Input() section: string= "Default";

  constructor() { }

  ngOnInit(): void {
  }

}
