import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { perfNow } from 'src/app/util/util';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css'],
  imports: [TopHeaderComponent, MarkdownViewerComponent],
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
    console.log(`${perfNow()}: Page loaded: Usage`);
  }
}
