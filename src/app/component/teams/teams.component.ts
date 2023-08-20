import { Component, OnInit } from '@angular/core';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import * as yaml from 'js-yaml';

@Component({
  selector: 'app-teams',
  templateUrl: './Teams.component.html',
  styleUrls: ['./Teams.component.css'],
})
export class Teams implements OnInit {
  YamlObject: any;
  teamList: string[] = [];
  teamGroups: any;

  constructor(private yaml: ymlService) {}
  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/teams.yaml');
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
}
