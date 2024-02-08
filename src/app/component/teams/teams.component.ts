import { Component, OnInit } from '@angular/core';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import * as yaml from 'js-yaml';

import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class Teams implements OnInit {
  YamlObject: any;
  teamList: any;
  teamGroups: Map<string, string[]> = new Map();

  constructor(private yaml: ymlService, 
    private titleService: Title)
     { titleService.setTitle('DSOMM - Teams')}
  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Function sets column header
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;

      console.log(this.YamlObject);
      this.teamList = this.YamlObject['teams'];
      this.teamGroups = this.YamlObject['teamGroups'];

      console.log('teamList', this.teamList);
      console.log('teamGroups', this.teamGroups);
    });
  }
  getTeamArray(key: string): string[] {
    return this.teamGroups.get(key) || [];
  }
}
