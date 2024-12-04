import { Component, OnInit } from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as XLSX from 'xlsx';

export interface MappingElementSortedByActivity {
  dimension: string;
  subDimension: string;
  activityName: string;
  samm2: string[];
  ISO17: string[];
  ISO22: string[];
}

export interface MappingElementSortedBySAMM {
  samm2: string;
  dimension: string;
  subDimension: string;
  activityName: string;
  ISO17: string[];
  ISO22: string[];
}

export interface MappingElementSortedByISO17 {
  ISO17: string;
  ISO22: string[];
  dimension: string;
  subDimension: string;
  activityName: string;
  samm2: string[];
  description: string;
  risk: string;
  measure: string;
  knowledge: string;
  resources: string;
  time: string;
  usefulness: string;
  dependsOn: string[];
  comments: string;
  assessment: string;
  level: number;
  implementation: any;
  teamImplementation: {
    [key: string]: boolean;
  };
  teamsEvidence: {
    [key: string]: string;
  };
}

export interface MappingElementSortedByISO22 {
  ISO17: string[];
  ISO22: string;
  dimension: string;
  subDimension: string;
  activityName: string;
  samm2: string[];
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent implements OnInit {
  allMappingDataSortedByActivity: MappingElementSortedByActivity[] = [];
  plannedMappingDataSortedByActivity: MappingElementSortedByActivity[] = [];
  performedMappingDataSortedByActivity: MappingElementSortedByActivity[] = [];
  currentlySortingByActivity: boolean = true;

  allMappingDataSortedBySAMM: MappingElementSortedBySAMM[] = [];
  plannedMappingDataSortedBySAMM: MappingElementSortedBySAMM[] = [];
  performedMappingDataSortedBySAMM: MappingElementSortedBySAMM[] = [];
  currentlySortingBySAMM: boolean = false;

  allMappingDataSortedByISO17: MappingElementSortedByISO17[] = [];
  plannedMappingDataSortedByISO17: MappingElementSortedByISO17[] = [];
  performedMappingDataSortedByISO17: MappingElementSortedByISO17[] = [];
  currentlySortingByISO17: boolean = false;

  allMappingDataSortedByISO22: MappingElementSortedByISO22[] = [];
  plannedMappingDataSortedByISO22: MappingElementSortedByISO22[] = [];
  performedMappingDataSortedByISO22: MappingElementSortedByISO22[] = [];
  currentlySortingByISO22: boolean = false;

  dataSource: any = new MatTableDataSource<MappingElementSortedByActivity>(
    this.allMappingDataSortedByActivity
  );

  YamlObject: any;

  allTeams: string[] = [];

  displayedColumns: string[] = [
    'dimension',
    'subDimension',
    'activityName',
    'samm2',
    'ISO17',
    'ISO22',
  ];
  allDimensionNames: string[] = [];
  temporaryMappingElement: any;

  //labels
  knowledgeLabels: string[] = [];
  generalLabels: string[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  FilterCtrl = new FormControl('');
  SortCtrl = new FormControl('');
  filteredChips: Observable<string[]>;
  currentChip: string[] = [];
  allChips: string[] = ['Performed Activities', 'Planned Activities'];

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  constructor(private yaml: ymlService) {
    this.filteredChips = this.FilterCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? this._filter(x) : this.allChips.slice()))
    );
  }

  ngOnInit(): void {
    //gets value from meta folder
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Function sets label data
    this.yaml.getJson().subscribe(data => {
      //console.log(data)
      this.knowledgeLabels = data['strings']['en']['KnowledgeLabels'];
      this.generalLabels = data['strings']['en']['labels'];
    });
    //gets value from generated folder
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    // Function sets data
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;
      this.allDimensionNames = Object.keys(this.YamlObject);
      for (let i = 0; i < this.allDimensionNames.length; i++) {
        var subdimensionsInCurrentDimension = Object.keys(
          this.YamlObject[this.allDimensionNames[i]]
        );
        for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
          var activityInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );
          for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
            if (!this.allTeams || this.allTeams.length == 0) {
              if (
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][activityInCurrentSubDimension[a]]['teamsImplemented']
              ) {
                this.allTeams = Object.keys(
                  this.YamlObject[this.allDimensionNames[i]][
                    subdimensionsInCurrentDimension[j]
                  ][activityInCurrentSubDimension[a]]['teamsImplemented']
                );
              }
            }
            this.setValueandAppendToDatasetSortedbyActivity(
              this.allDimensionNames[i],
              subdimensionsInCurrentDimension[j],
              activityInCurrentSubDimension[a]
            );
            this.setValueandAppendToDatasetandSortbySAMM(
              this.allDimensionNames[i],
              subdimensionsInCurrentDimension[j],
              activityInCurrentSubDimension[a]
            );
            this.setValueandAppendToDatasetandSortbyISO17(
              this.allDimensionNames[i],
              subdimensionsInCurrentDimension[j],
              activityInCurrentSubDimension[a]
            );
            this.setValueandAppendToDatasetandSortbyISO22(
              this.allDimensionNames[i],
              subdimensionsInCurrentDimension[j],
              activityInCurrentSubDimension[a]
            );
          }
        }
      }
      // weird fix to render DOM for table viewing in angular material
      this.dataSource._data.next(this.allMappingDataSortedByActivity);
    });
    //console.log(this.allMappingDataSortedByActivity)
    //console.log(this.allMappingDataSortedBySAMM)
    //console.log(this.allMappingDataSortedByISO)
    //this.dataSource=new MatTableDataSource([...this.dataSource]);
    //console.log(this.dataSource.data)
  }

  //Sets dataSource value sorted by activity
  setValueandAppendToDatasetSortedbyActivity(
    dim: string,
    subDim: string,
    activity: string
  ) {
    var ISOArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2017'];
    var ISO22Array: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2022'];
    var SAMMArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['samm2'];
    this.temporaryMappingElement = {
      dimension: dim,
      subDimension: subDim,
      activityName: activity,
      ISO17: ISOArray,
      ISO22: ISO22Array,
      samm2: SAMMArray,
    };
    //console.log(this.temp)
    this.allMappingDataSortedByActivity.push(this.temporaryMappingElement);
    if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
      this.performedMappingDataSortedByActivity.push(
        this.temporaryMappingElement
      );
    } else {
      this.plannedMappingDataSortedByActivity.push(
        this.temporaryMappingElement
      );
    }
  }

  //Sets dataSource value sorted by SAMM
  setValueandAppendToDatasetandSortbySAMM(
    dim: string,
    subDim: string,
    activity: string
  ) {
    var ISOArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2017'];
    var ISO22Array: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2022'];
    var SAMMArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['samm2'];
    this.temporaryMappingElement = {
      dimension: dim,
      subDimension: subDim,
      activityName: activity,
      ISO17: ISOArray,
      ISO22: ISO22Array,
      samm2: '',
    };

    if (SAMMArray) {
      if (SAMMArray.length == 0) {
        this.allMappingDataSortedBySAMM.push(this.temporaryMappingElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedBySAMM.push(
            this.temporaryMappingElement
          );
        } else {
          this.plannedMappingDataSortedBySAMM.push(
            this.temporaryMappingElement
          );
        }
      }
      for (var i = 0; i < SAMMArray.length; i++) {
        const newTempElement = JSON.parse(
          JSON.stringify(this.temporaryMappingElement)
        );
        newTempElement['samm2'] = SAMMArray[i];
        this.allMappingDataSortedBySAMM.push(newTempElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedBySAMM.push(newTempElement);
        } else {
          this.plannedMappingDataSortedBySAMM.push(newTempElement);
        }
      }
    }
    //sorting by descending order
    this.allMappingDataSortedBySAMM.sort(
      (first, second) => 0 - (first['samm2'] > second['samm2'] ? 1 : -1)
    );
    this.plannedMappingDataSortedBySAMM.sort(
      (first, second) => 0 - (first['samm2'] > second['samm2'] ? 1 : -1)
    );
    this.performedMappingDataSortedBySAMM.sort(
      (first, second) => 0 - (first['samm2'] > second['samm2'] ? 1 : -1)
    );
    //console.log(this.temp)
  }

  //Sets dataSource value sorted by ISO17 27001:2017 - to also be used by download functionality
  setValueandAppendToDatasetandSortbyISO17(
    dim: string,
    subDim: string,
    activity: string
  ) {
    var ISOArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2017'];
    var ISO22Array: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2022'];
    var SAMMArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['samm2'];
    var CurrentDescription: string =
      this.YamlObject[dim][subDim][activity]['description'];
    var CurrentRisk: string = this.YamlObject[dim][subDim][activity]['risk'];
    var CurrentMeasure: string =
      this.YamlObject[dim][subDim][activity]['measure'];
    var CurrentKnowledge: string =
      this.knowledgeLabels[
        this.YamlObject[dim][subDim][activity]['difficultyOfImplementation'][
          'knowledge'
        ]
      ];
    var CurrentTime: string =
      this.generalLabels[
        this.YamlObject[dim][subDim][activity]['difficultyOfImplementation'][
          'time'
        ]
      ];
    var CurrentResources: string =
      this.generalLabels[
        this.YamlObject[dim][subDim][activity]['difficultyOfImplementation'][
          'resources'
        ]
      ];
    var CurrentUsefulness: string =
      this.generalLabels[this.YamlObject[dim][subDim][activity]['usefulness']];

    var CurrentComments: string =
      this.YamlObject[dim][subDim][activity]['comments'];

    var CurrentAssessment: string =
      this.YamlObject[dim][subDim][activity]['assessment'];

    var CurrentDependsOn: string[] =
      this.YamlObject[dim][subDim][activity]['dependsOn'];

    try {
      var CurrentImplementation: any = JSON.stringify(
        this.YamlObject[dim][subDim][activity]['implementation']
      );
      if (CurrentImplementation.length == 2) {
        CurrentImplementation = '';
      }
    } catch {
      CurrentImplementation = '';
    }

    var CurrentTeamsAndImplementation =
      this.YamlObject[dim][subDim][activity]['teamsImplemented'];

    var CurrentTeamsEvidence =
      this.YamlObject[dim][subDim][activity]['teamsEvidence'];

    var CurrentActivityLevel = this.YamlObject[dim][subDim][activity]['level'];

    this.temporaryMappingElement = {
      dimension: dim,
      subDimension: subDim,
      activityName: activity,
      ISO17: '',
      ISO22: ISO22Array,
      samm2: SAMMArray,
      description: CurrentDescription,
      risk: CurrentRisk,
      measure: CurrentMeasure,
      knowledge: CurrentKnowledge,
      time: CurrentTime,
      resources: CurrentResources,
      usefulness: CurrentUsefulness,
      dependsOn: CurrentDependsOn,
      level: CurrentActivityLevel,
      implementation: CurrentImplementation,
      comments: CurrentComments,
      assessment: CurrentAssessment,
      teamImplementation: CurrentTeamsAndImplementation,
      teamsEvidence: CurrentTeamsEvidence,
    };

    console.log(this.temporaryMappingElement);
    if (ISOArray) {
      if (ISOArray.length == 0) {
        this.allMappingDataSortedByISO17.push(this.temporaryMappingElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedByISO17.push(
            this.temporaryMappingElement
          );
        } else {
          this.plannedMappingDataSortedByISO17.push(
            this.temporaryMappingElement
          );
        }
      }
      for (var i = 0; i < ISOArray.length; i++) {
        const newTempElement = JSON.parse(
          JSON.stringify(this.temporaryMappingElement)
        );
        newTempElement['ISO17'] = ISOArray[i];
        //console.log(newTempElement);
        this.allMappingDataSortedByISO17.push(newTempElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedByISO17.push(newTempElement);
        } else {
          this.plannedMappingDataSortedByISO17.push(newTempElement);
        }
      }
    }
    //sorting by descending order
    this.allMappingDataSortedByISO17.sort(
      (first, second) => 0 - (first['ISO17'] > second['ISO17'] ? 1 : -1)
    );
    this.performedMappingDataSortedByISO17.sort(
      (first, second) => 0 - (first['ISO17'] > second['ISO17'] ? 1 : -1)
    );
    this.plannedMappingDataSortedByISO17.sort(
      (first, second) => 0 - (first['ISO17'] > second['ISO17'] ? 1 : -1)
    );
    //console.log(this.temp)
  }

  //Sets dataSource value sorted by ISO17 27001:2022
  setValueandAppendToDatasetandSortbyISO22(
    dim: string,
    subDim: string,
    activity: string
  ) {
    var ISOArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2017'];
    var ISO22Array: string[] =
      this.YamlObject[dim][subDim][activity]['references']['iso27001-2022'];
    var SAMMArray: string[] =
      this.YamlObject[dim][subDim][activity]['references']['samm2'];

    this.temporaryMappingElement = {
      dimension: dim,
      subDimension: subDim,
      activityName: activity,
      ISO17: ISOArray,
      ISO22: '',
      samm2: SAMMArray,
    };

    if (ISO22Array) {
      if (ISO22Array.length == 0) {
        this.allMappingDataSortedByISO22.push(this.temporaryMappingElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedByISO22.push(
            this.temporaryMappingElement
          );
        } else {
          this.plannedMappingDataSortedByISO22.push(
            this.temporaryMappingElement
          );
        }
      }
      for (var i = 0; i < ISO22Array.length; i++) {
        const newTempElement = JSON.parse(
          JSON.stringify(this.temporaryMappingElement)
        );
        newTempElement['ISO22'] = ISO22Array[i];
        //console.log(newTempElement);
        this.allMappingDataSortedByISO22.push(newTempElement);
        if (this.YamlObject[dim][subDim][activity]['isImplemented']) {
          this.performedMappingDataSortedByISO22.push(newTempElement);
        } else {
          this.plannedMappingDataSortedByISO22.push(newTempElement);
        }
      }
    }
    //sorting by descending order
    this.allMappingDataSortedByISO22.sort(
      (first, second) => 0 - (first['ISO22'] > second['ISO22'] ? 1 : -1)
    );
    this.performedMappingDataSortedByISO22.sort(
      (first, second) => 0 - (first['ISO22'] > second['ISO22'] ? 1 : -1)
    );
    this.plannedMappingDataSortedByISO22.sort(
      (first, second) => 0 - (first['ISO22'] > second['ISO22'] ? 1 : -1)
    );
    //console.log(this.temp)
  }

  // remove filter chip
  removeChip(chip: string): void {
    const index = this.currentChip.indexOf(chip);
    if (index >= 0) {
      this.currentChip.splice(index, 1);
    }
    this.changeTableBasedOnCurrentFilter();
  }

  //adding filter chip
  addChip(event: MatAutocompleteSelectedEvent): void {
    this.currentChip.push(event.option.viewValue);
    this.changeTableBasedOnCurrentFilter();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allChips.filter(chip =>
      chip.toLowerCase().includes(filterValue)
    );
  }

  //check sort value and change table data accordingly
  checkSortValueAndChangeTableData(
    activityData: any,
    ISOData: any,
    ISO22Data: any,
    SAMMData: any
  ): void {
    if (this.currentlySortingByActivity) {
      this.dataSource = activityData;
    } else if (this.currentlySortingByISO17) {
      this.dataSource = ISOData;
    } else if (this.currentlySortingByISO22) {
      this.dataSource = ISO22Data;
    } else {
      this.dataSource = SAMMData;
    }
  }

  changeTableBasedOnCurrentFilter() {
    if (this.currentChip.length > 1 || this.currentChip.length == 0) {
      // both planned and performed actvities are selected

      //Check current sort value
      this.checkSortValueAndChangeTableData(
        this.allMappingDataSortedByActivity,
        this.allMappingDataSortedByISO17,
        this.allMappingDataSortedByISO22,
        this.allMappingDataSortedBySAMM
      );
    } else if (this.currentChip[0] == 'Planned Activities') {
      // planned actvities shows planned data

      //Check current sort value
      this.checkSortValueAndChangeTableData(
        this.plannedMappingDataSortedByActivity,
        this.plannedMappingDataSortedByISO17,
        this.plannedMappingDataSortedByISO22,
        this.plannedMappingDataSortedBySAMM
      );
    } else {
      //Check current sort value
      this.checkSortValueAndChangeTableData(
        this.performedMappingDataSortedByActivity,
        this.performedMappingDataSortedByISO17,
        this.performedMappingDataSortedByISO22,
        this.performedMappingDataSortedBySAMM
      );
    }

    this.chipInput.nativeElement.value = '';
    this.FilterCtrl.setValue(null);
  }

  changeTableBasedOnCurrentSort() {
    if (this.SortCtrl.value == 'sortByActivity') {
      this.currentlySortingByActivity = true;
      this.currentlySortingBySAMM = false;
      this.currentlySortingByISO17 = false;
      this.currentlySortingByISO22 = false;

      //Checking filters
      if (this.currentChip.length > 1 || this.currentChip.length == 0) {
        // both planned and performed actvities are selected
        this.dataSource = this.allMappingDataSortedByActivity;
      } else {
        if (this.currentChip[0] == 'Planned Activities') {
          // planned actvities shows planned data
          this.dataSource = this.plannedMappingDataSortedByActivity;
        } else {
          // performed actvities shows performed data
          this.dataSource = this.performedMappingDataSortedByActivity;
        }
      }
    } else if (this.SortCtrl.value == 'sortBySAMM') {
      this.currentlySortingByActivity = false;
      this.currentlySortingBySAMM = true;
      this.currentlySortingByISO17 = false;
      this.currentlySortingByISO22 = false;

      //Checking filters
      if (this.currentChip.length > 1 || this.currentChip.length == 0) {
        // both planned and performed actvities are selected
        this.dataSource = this.allMappingDataSortedBySAMM;
      } else {
        if (this.currentChip[0] == 'Planned Activities') {
          // planned actvities shows planned data
          this.dataSource = this.plannedMappingDataSortedBySAMM;
        } else {
          // performed actvities shows performed data
          this.dataSource = this.performedMappingDataSortedBySAMM;
        }
      }
    } else if (this.SortCtrl.value == 'sortByISO') {
      this.currentlySortingByActivity = false;
      this.currentlySortingBySAMM = false;
      this.currentlySortingByISO17 = true;
      this.currentlySortingByISO22 = false;

      //Checking filters
      if (this.currentChip.length > 1 || this.currentChip.length == 0) {
        // both planned and performed actvities are selected
        this.dataSource = this.allMappingDataSortedByISO17;
      } else {
        if (this.currentChip[0] == 'Planned Activities') {
          // planned actvities shows planned data
          this.dataSource = this.plannedMappingDataSortedByISO17;
        } else {
          // performed actvities shows performed data
          this.dataSource = this.performedMappingDataSortedByISO17;
        }
      }
    } else {
      this.currentlySortingByActivity = false;
      this.currentlySortingBySAMM = false;
      this.currentlySortingByISO17 = false;
      this.currentlySortingByISO22 = true;

      //Checking filters
      if (this.currentChip.length > 1 || this.currentChip.length == 0) {
        // both planned and performed actvities are selected
        this.dataSource = this.allMappingDataSortedByISO22;
      } else {
        if (this.currentChip[0] == 'Planned Activities') {
          // planned actvities shows planned data
          this.dataSource = this.plannedMappingDataSortedByISO22;
        } else {
          // performed actvities shows performed data
          this.dataSource = this.performedMappingDataSortedByISO22;
        }
      }
    }
  }

  exportToExcel() {
    //passing the table id
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    //generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //save to file
    XLSX.writeFile(wb, 'Planned-Activities-Sorted-By-ISO17.xlsx');
    //console.log(this.allMappingDataSortedByISO)
  }
}
