import { Component, OnInit } from '@angular/core';
import { perfNow } from 'src/app/util/util';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  standalone: true,
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class RoadmapComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Roadmap`);
  }
}
