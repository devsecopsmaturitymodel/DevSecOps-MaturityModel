import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { perfNow } from 'src/app/util/util';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class UsageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  readonly page = signal('USAGE');

  ngOnInit() {
    if (this.route && this.route.params) {
      this.route.params.subscribe(params => {
        let page = params['page'];
        // CWE-79 - sanitize input
        if (page && page.match(/^[\w.-]+$/)) {
          this.page.set(page);
        }
      });
    }
    console.log(`${perfNow()}: Page loaded: Usage`);
  }
}
