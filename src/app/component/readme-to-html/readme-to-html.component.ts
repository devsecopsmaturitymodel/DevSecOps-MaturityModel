import { Component, Input, OnInit } from '@angular/core';
import * as md from 'markdown-it';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-readme-to-html',
  templateUrl: './readme-to-html.component.html',
  styleUrls: ['./readme-to-html.component.css']
})
export class ReadmeToHtmlComponent implements OnInit {
  @Input() MDFile: string= "";
  markdown:md = md()
  markdownURI:any
  toRender:string=""
  constructor(private http:HttpClient) { }

  async ngOnInit() {
    try{
      this.markdownURI = await this.http.get(this.MDFile, { responseType: 'text'}).toPromise();
      this.toRender=this.markdown.render(this.markdownURI)
    }
    catch{
      this.toRender= "Markdown file could not be found"
    }
    
  }

}
