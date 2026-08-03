import { Component, Input, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import md from 'markdown-it';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class MarkdownViewerComponent implements OnInit {
  private http = inject(HttpClient);

  @Input() MDFile: string = '';
  markdown: md = md({
    html: true,
  });
  markdownURI: any;
  readonly toRender = signal('');

  ngOnInit(): void {
    this.loadMarkdownFiles(this.MDFile);
  }

  async loadMarkdownFiles(MDFile: string): Promise<boolean> {
    try {
      this.markdownURI = await this.http.get(MDFile, { responseType: 'text' }).toPromise();
      this.toRender.set(this.markdown.render(this.markdownURI));
      return true;
    } catch {
      this.toRender.set('Markdown file could not be found');
      return false;
    }
  }
}
