import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as md from 'markdown-it';

export interface implementation {
  name: string;
  tags: string[];
  url: string;
  description: string;
}
export interface activityDescription {
  dimension: string;
  subDimension: string;
  level: string;
  tags: string[];
  activityName: string;
  uuid: string;
  description: string;
  risk: string;
  measure: string;
  implementatonGuide: string;
  iso: string[];
  iso22: string[];
  samm: string[];
  knowledge: number;
  resources: number;
  time: number;
  dependsOn: string[];
  implementation: implementation[];
  usefulness: number;
  evidence: string;
  assessment: string;
  comments: string;
  isImplemented: boolean;
  teamsImplemented: Object;
}

@Component({
  selector: 'app-activity-description',
  templateUrl: './activity-description.component.html',
  styleUrls: ['./activity-description.component.css'],
})
export class ActivityDescriptionComponent implements OnInit {
  currentActivity: activityDescription = {
    dimension: '',
    subDimension: '',
    level: '',
    tags: [''],
    activityName: '',
    uuid: '',
    description: '',
    risk: '',
    measure: '',
    implementatonGuide: '',
    samm: [''],
    iso: [''],
    iso22: [''],
    knowledge: -1,
    resources: -1,
    time: -1,
    dependsOn: [],
    implementation: [],
    usefulness: -1,
    assessment: '',
    evidence: '',
    comments: '',
    isImplemented: false,
    teamsImplemented: {},
  };

  YamlObject: any;
  GeneralLabels: string[] = [];
  KnowledgeLabels: string[] = [];
  rowIndex: number = 0;
  markdown: md = md();
  SAMMVersion: string = 'OWASP SAMM VERSION 2';
  ISOVersion: string = 'ISO 27001:2017';
  ISO22Version: string = 'ISO 27001:2022';
  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor(private route: ActivatedRoute, private yaml: ymlService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentActivity.dimension = params['dimension'];
      this.currentActivity.subDimension = params['subDimension'];
      this.currentActivity.level = 'level-' + params['level'];
      this.currentActivity.activityName = params['activityName'];
    });

    //gets value from sample file
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Function sets label data
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;
      this.GeneralLabels = this.YamlObject['strings']['en']['labels'];
      this.KnowledgeLabels =
        this.YamlObject['strings']['en']['KnowledgeLabels'];
    });
    //gets value from generated folder
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    // Function sets data
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;
      var data =
        this.YamlObject[this.currentActivity.dimension][
          this.currentActivity.subDimension
        ][this.currentActivity.activityName];
      this.currentActivity.description = this.defineStringValues(
        data['description'],
        ''
      );
      this.currentActivity.uuid = this.defineStringValues(data['uuid'], '');
      this.currentActivity.risk = this.defineStringValues(data['risk'], '');
      this.currentActivity.tags = this.defineStringArrayValues(
        data['tags'],
        []
      );
      this.currentActivity.measure = this.defineStringValues(
        data['measure'],
        ''
      );
      try {
        data['meta'];
        this.currentActivity.implementatonGuide = this.defineStringValues(
          data['meta']['implementationGuide'],
          ''
        );
      } catch {
        console.log('Meta does not exist');
      }
      try {
        data['usefulness'];
        this.currentActivity.usefulness = this.defineIntegerValues(
          data['usefulness'],
          -1
        );
      } catch {
        console.log('Meta does not exist');
      }
      try {
        data['difficultyOfImplementation'];
        this.currentActivity.knowledge = this.defineIntegerValues(
          data['difficultyOfImplementation']['knowledge'],
          -1
        );
        this.currentActivity.time = this.defineIntegerValues(
          data['difficultyOfImplementation']['time'],
          -1
        );
        this.currentActivity.resources = this.defineIntegerValues(
          data['difficultyOfImplementation']['resources'],
          -1
        );
      } catch {
        console.log('difficultyOfImplementation does not exist');
      }
      try {
        data['references'];
        this.currentActivity.iso = this.defineStringArrayValues(
          data['references']['iso27001-2017'],
          []
        );
        this.currentActivity.iso22 = this.defineStringArrayValues(
          data['references']['iso27001-2022'],
          []
        );
        this.currentActivity.samm = this.defineStringArrayValues(
          data['references']['samm2'],
          []
        );
      } catch {
        console.log('references does not exist');
      }

      this.currentActivity.dependsOn = this.defineStringArrayValues(
        data['dependsOn'],
        []
      );

      this.currentActivity.implementation = this.defineImplementationObject(
        data['implementation']
      );

      this.currentActivity.evidence = this.defineStringValues(
        data['evidence'],
        ''
      );

      this.currentActivity.comments = this.defineStringValues(
        data['comments'],
        ''
      );

      this.currentActivity.assessment = this.defineStringValues(
        data['assessment'],
        ''
      );
      this.currentActivity.isImplemented = this.defineBooleanValues(
        data['isImplemented'],
        false
      );
      this.currentActivity.teamsImplemented = data['teamsImplemented'];
      this.openall();
    });
  }

  defineStringValues(
    dataToCheck: string,
    valueOfDataIfUndefined: string
  ): string {
    try {
      return this.markdown.render(dataToCheck);
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  defineBooleanValues(
    dataToCheck: boolean,
    valueOfDataIfUndefined: boolean
  ): boolean {
    try {
      return dataToCheck;
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  defineStringArrayValues(
    dataToCheck: string[],
    valueOfDataIfUndefined: string[]
  ): string[] {
    try {
      return dataToCheck;
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  defineIntegerValues(
    dataToCheck: number,
    valueOfDataIfUndefined: number
  ): number {
    try {
      return dataToCheck;
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  defineImplementationObject(dataToCheck: implementation[]): implementation[] {
    var dataToReturn: implementation[] = [];
    for (var data in dataToCheck) {
      var temp: implementation = {
        name: '',
        url: '',
        tags: [],
        description: '',
      };
      temp['name'] = this.defineStringValues(dataToCheck[data]['name'], '');
      temp['url'] = this.defineStringValues(dataToCheck[data]['url'], '');
      temp['description'] = this.defineStringValues(
        dataToCheck[data]['description'],
        ''
      );
      temp['tags'] = this.defineStringArrayValues(
        dataToCheck[data]['tags'],
        []
      );
      //console.log(temp)
      dataToReturn.push(temp);
    }
    //console.log(dataToReturn)
    return dataToReturn;
  }

  // Expand all function
  openall(): void {
    this.accordion.forEach(element => {
      element.openAll();
    });
  }

  // Close all function
  closeall(): void {
    this.accordion.forEach(element => {
      element.closeAll();
    });
  }
}
