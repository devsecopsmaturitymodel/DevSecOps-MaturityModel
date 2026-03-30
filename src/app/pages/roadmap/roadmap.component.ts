import { Component, OnInit } from '@angular/core';
import { perfNow } from 'src/app/util/util';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class RoadmapComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Roadmap`);
  }
}
