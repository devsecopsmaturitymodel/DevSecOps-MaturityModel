import { Component } from '@angular/core';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class AboutUsComponent {
  constructor() {}
}
