import { Component, Input, OnInit } from '@angular/core';
import * as md from 'markdown-it';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-readme-to-html',
  templateUrl: './readme-to-html.component.html',
  styleUrls: ['./readme-to-html.component.css'],
})
export class ReadmeToHtmlComponent implements OnInit {
  @Input() MDFile: string = '';
  markdown: md = md({
    html: true,
  });
  markdownURI: any;
  toRender: string = '';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMarkdownFiles(this.MDFile);
  }

  async loadMarkdownFiles(MDFile: string): Promise<boolean> {
    try {
      this.markdownURI = await this.http.get(MDFile, { responseType: 'text' }).toPromise();
      this.toRender = this.markdown.render(this.markdownURI);
      return true;
    } catch {
      this.toRender = 'Markdown file could not be found';
      return false;
    }
  }
}
