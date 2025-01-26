import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css'],
})
export class UsageComponent implements OnInit {
  page: string = 'USAGE';
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let page = params['page'];
      if (page.match(/^[\w.-]+$/)) {
        this.page = page;
      }
    });
  }
}
