import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { parse } from 'yamljs';

@Injectable()
export class ymlService {
  private URI: string = './';

  constructor(private http: HttpClient) {}

  setURI(URI_used: string) {
    this.URI = URI_used;
  }

  public getJson(): Observable<any> {
    return this.http
      .get(this.URI, {
        observe: 'body',
        responseType: 'text', // This one here tells HttpClient to parse it as text, not as JSON
      })
      .pipe(
        // Map Yaml to JavaScript Object
        map(yamlString => parse(yamlString))
      );
  }
}
