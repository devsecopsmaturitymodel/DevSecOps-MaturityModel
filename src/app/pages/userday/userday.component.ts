import { Component, OnInit } from '@angular/core';
import { perfNow } from 'src/app/util/util';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';
import { MarkdownViewerComponent } from '../../component/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-userday',
  templateUrl: './userday.component.html',
  styleUrls: ['./userday.component.css'],
  imports: [TopHeaderComponent, MarkdownViewerComponent],
})
export class UserdayComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Userday`);
  }
}
