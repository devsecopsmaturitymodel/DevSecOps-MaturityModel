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
    if (this.route && this.route.params) {
      this.route.params.subscribe(params => {
        let page = params['page'];
        // CWE-79 - sanitize input
        if (page.match(/^[\w.-]+$/)) {
          this.page = page;
        }
      });
    }
  }
}
