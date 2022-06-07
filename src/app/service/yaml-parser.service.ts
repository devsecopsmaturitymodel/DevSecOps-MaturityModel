import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import {parse} from 'yamljs';


@Injectable()
export class ymlService {
  parsedYamlObject:any;

  constructor(private http: HttpClient) {
    this.getJson().subscribe(data => {

      this.parsedYamlObject = data;
      console.log(data);
    })
  }

  public getJson(): Observable<any> {
    return this.http
      .get('./assets/file.yaml', {
        observe: 'body',
        responseType: 'text', // This one here tells HttpClient to parse it as text, not as JSON
      })
      .pipe(
        // Map Yaml to JavaScript Object
        map((yamlString) => parse(yamlString))
      );
  }

}