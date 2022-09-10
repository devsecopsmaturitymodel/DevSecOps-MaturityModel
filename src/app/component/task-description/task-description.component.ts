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
export interface taskDescription {
  dimension: string;
  subDimension: string;
  level: string;
  taskName: string;
  description: string;
  risk: string;
  measure: string;
  implementatonGuide: string;
  iso: string[];
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
}

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.css'],
})
export class TaskDescriptionComponent implements OnInit {
  currentTask: taskDescription = {
    dimension: '',
    subDimension: '',
    level: '',
    taskName: '',
    description: '',
    risk: '',
    measure: '',
    implementatonGuide: '',
    samm: [''],
    iso: [''],
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
  };

  YamlObject: any;
  GeneralLabels: string[] = [];
  KnowledgeLabels: string[] = [];
  rowIndex: number = 0;
  markdown: md = md();

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor(private route: ActivatedRoute, private yaml: ymlService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentTask.dimension = params['dimension'];
      this.currentTask.subDimension = params['subDimension'];
      this.currentTask.level = 'level-' + params['level'];
      this.currentTask.taskName = params['taskName'];
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
        this.YamlObject[this.currentTask.dimension][
          this.currentTask.subDimension
        ][this.currentTask.taskName];
      this.currentTask.description = this.defineStringValues(
        data['description'],
        ''
      );
      this.currentTask.risk = this.defineStringValues(data['risk'], '');
      this.currentTask.measure = this.defineStringValues(data['measure'], '');
      try {
        data['meta'];
        this.currentTask.implementatonGuide = this.defineStringValues(
          data['meta']['implementationGuide'],
          ''
        );
      } catch {
        console.log('Meta does not exist');
      }
      try {
        data['usefulness'];
        this.currentTask.usefulness = this.defineIntegerValues(
          data['usefulness'],
          -1
        );
      } catch {
        console.log('Meta does not exist');
      }
      try {
        data['difficultyOfImplementation'];
        this.currentTask.knowledge = this.defineIntegerValues(
          data['difficultyOfImplementation']['knowledge'],
          -1
        );
        this.currentTask.time = this.defineIntegerValues(
          data['difficultyOfImplementation']['time'],
          -1
        );
        this.currentTask.resources = this.defineIntegerValues(
          data['difficultyOfImplementation']['resources'],
          -1
        );
      } catch {
        console.log('difficultyOfImplementation does not exist');
      }
      try {
        data['references'];
        this.currentTask.iso = this.defineStringArrayValues(
          data['references']['iso27001-2017'],
          []
        );
        this.currentTask.samm = this.defineStringArrayValues(
          data['references']['samm2'],
          []
        );
      } catch {
        console.log('references does not exist');
      }

      this.currentTask.dependsOn = this.defineStringArrayValues(
        data['dependsOn'],
        []
      );

      this.currentTask.implementation = this.defineImplementationObject(
        data['implementation']
      );

      this.currentTask.evidence = this.defineStringValues(data['evidence'], '');

      this.currentTask.comments = this.defineStringValues(data['comments'], '');

      this.currentTask.assessment = this.defineStringValues(
        data['assessment'],
        ''
      );
      this.currentTask.isImplemented = this.defineBooleanValues(
        data['isImplemented'],
        false
      );
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
