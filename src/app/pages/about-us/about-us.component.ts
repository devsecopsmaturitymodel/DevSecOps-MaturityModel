import { Component } from '@angular/core';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  standalone: true,
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class AboutUsComponent {
  constructor() {}
}
