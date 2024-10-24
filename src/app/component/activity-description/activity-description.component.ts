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
  openCRE: string[];
  knowledge: number;
  resources: number;
  time: number;
  dependsOn: string[];
  implementation: implementation[];
  usefulness: number;
  evidence: string;
  teamsEvidence: Object;
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
    openCRE: [''],
    knowledge: -1,
    resources: -1,
    time: -1,
    dependsOn: [],
    implementation: [],
    usefulness: -1,
    assessment: '',
    evidence: '',
    teamsEvidence: {},
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
  openCREVersion: string = 'OpenCRE';
  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor(private route: ActivatedRoute, private yaml: ymlService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentActivity.uuid = params['uuid'];
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

      var allDimensionNames = Object.keys(this.YamlObject);
      for (let i = 0; i < allDimensionNames.length; i++) {
        var subdimensionsInCurrentDimension = Object.keys(
          this.YamlObject[allDimensionNames[i]]
        );

        for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
          var temp: any = {
            Dimension: allDimensionNames[i],
            SubDimension: subdimensionsInCurrentDimension[j],
          };
          var activityInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );

          for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
            var currentActivityName = activityInCurrentSubDimension[a];

            try {
              if (
                this.YamlObject[allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentActivityName].uuid == this.currentActivity.uuid
              ) {
                data =
                  this.YamlObject[allDimensionNames[i]][
                    subdimensionsInCurrentDimension[j]
                  ][currentActivityName];
                this.currentActivity = JSON.parse(JSON.stringify(data)); // Creates a deep copy of current activity to keep two seperate versions - with and without martkdown
                this.currentActivity.dimension = allDimensionNames[i];
                this.currentActivity.subDimension =
                  subdimensionsInCurrentDimension[j];
                this.currentActivity.activityName = currentActivityName;
                console.log('found');
                break;
              }
            } catch {
              console.log('Level for activity does not exist');
            }
          }
        }
      }

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
        this.currentActivity.openCRE = this.defineStringArrayValues(
          data['references']['openCRE'],
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
      const dataFromLocalStorage = localStorage.getItem('dataset');
      if (dataFromLocalStorage !== null) {
        var parsedDataFromLocalStorage = JSON.parse(dataFromLocalStorage);
        var index = -1;
        for (var i = 0; i < parsedDataFromLocalStorage.length; i++) {
          for (
            var j = 0;
            j < parsedDataFromLocalStorage[i]['Activity'].length;
            j++
          ) {
            if (
              parsedDataFromLocalStorage[i]['Activity'][j]['uuid'] ===
              data['uuid']
            ) {
              console.log('test', parsedDataFromLocalStorage[i]['Activity'][j]);

              index = i;
              this.currentActivity.teamsImplemented =
                parsedDataFromLocalStorage[i]['Activity'][j][
                  'teamsImplemented'
                ];

              break;
            }
          }
        }
        // this.currentActivity.teamsEvidence = this.defineEvidenceObject();
      } else this.currentActivity.teamsImplemented = data['teamsImplemented'];

      this.currentActivity.teamsEvidence = this.defineEvidenceObject(
        data['teamsEvidence']
      );
      // console.log("data['teamsEvidence']", data['teamsEvidence']);
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

  defineEvidenceObject(dataToCheck: { [key: string]: string }): Object {
    var dataToReturn: { [key: string]: string } = {};
    for (var key in dataToCheck) {
      dataToReturn[key] = this.defineStringValues(dataToCheck[key], '');
    }
    return dataToReturn;
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
