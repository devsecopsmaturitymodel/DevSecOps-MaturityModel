import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { Router, NavigationExtras } from '@angular/router';

export interface MatrixElement {
  Dimension: string;
  SubDimension: string;
}

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements OnInit {
  MATRIX_DATA: MatrixElement[] = [];

  Routing: string = '/task-description';

  YamlObject: any;
  levels: string[] = [];

  displayedColumns: string[] = ['Dimension', 'SubDimension'];

  lvlColumn: string[] = [];
  allRows: string[] = [];
  dataSource: any = new MatTableDataSource<MatrixElement>(this.MATRIX_DATA);
  rowsCurrentlyBeingShown: string[] = [];
  activityCurrentlyBeingShown: string[] = [];
  allDimensionNames: string[] = [];
  constructor(private yaml: ymlService, private router: Router) {
    this.filteredRows = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) =>
        row ? this.filter(row) : this.autoCompeteResults.slice()
      )
    );
    this.filteredActivities = this.rowCtrlTags.valueChanges.pipe(
      startWith(null),
      map((activity: string | null) =>
        activity
          ? this.filterActivity(activity)
          : this.autoCompleteActivityResults.slice()
      )
    );
  }
  // function to initialize if level columns exists
  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Function sets column header
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;

      // Levels header
      this.levels = this.YamlObject['strings']['en']['maturity_levels'];

      // pushes Levels in displayed column
      for (let k = 1; k <= this.levels.length; k++) {
        this.displayedColumns.push('level' + k);
        this.lvlColumn.push('level' + k);
      }
    });
    var activitySet = new Set();

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
          var temp: any = {
            Dimension: this.allDimensionNames[i],
            SubDimension: subdimensionsInCurrentDimension[j],
          };

          for (let k = 0; k < this.levels.length; k++) {
            temp = {
              ...temp,
              [this.lvlColumn[k] as keyof number]: [],
            };
          }

          var activityInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );

          for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
            var currentActivityName = activityInCurrentSubDimension[a];
            var tagsInCurrentActivity: string[] =
              this.YamlObject[this.allDimensionNames[i]][
                subdimensionsInCurrentDimension[j]
              ][currentActivityName].tags;
            if (tagsInCurrentActivity) {
              for (let curr = 0; curr < tagsInCurrentActivity.length; curr++) {
                activitySet.add(tagsInCurrentActivity[curr]);
              }
            }

            try {
              var lvlOfActivity: number =
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentActivityName]['level'];

              (
                temp[
                  this.lvlColumn[lvlOfActivity - 1] as keyof number
                ] as unknown as string[]
              ).push(currentActivityName);
            } catch {
              console.log('Level for activity does not exist');
            }
          }

          this.MATRIX_DATA.push(temp);
        }
      }
      this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
      this.createRowList();
      this.createTaskTags(activitySet);
    });

    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
    this.createRowList();
  }

  createTaskTags(activitySet: Set<any>): void {
    activitySet.forEach(tag => this.activityCurrentlyBeingShown.push(tag));
  }

  createRowList(): void {
    let i = 0;
    while (i < this.MATRIX_DATA.length) {
      if (!this.allRows.includes(this.MATRIX_DATA[i].SubDimension)) {
        this.allRows.push(this.MATRIX_DATA[i].SubDimension);
        this.rowsCurrentlyBeingShown.push(this.MATRIX_DATA[i].SubDimension);
      }
      i++;
    }
  }

  //chips

  separatorKeysCodes: number[] = [ENTER, COMMA];
  rowCtrl = new FormControl('');
  rowCtrlTags = new FormControl('');
  filteredRows: Observable<string[]>;
  filteredActivities: Observable<string[]>;

  autoCompeteResults: string[] = [];
  autoCompleteActivityResults: string[] = [];

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  updateActivitesBeingDisplayed(): void {
    // Iterate over all objects and create new MATRIX_DATA
    var updatedActivities: any = [];

    for (let i = 0; i < this.allDimensionNames.length; i++) {
      var subdimensionsInCurrentDimension = Object.keys(
        this.YamlObject[this.allDimensionNames[i]]
      );

      for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
        var temp: any = {
          Dimension: this.allDimensionNames[i],
          SubDimension: subdimensionsInCurrentDimension[j],
        };
        for (let k = 0; k < this.levels.length; k++) {
          temp = {
            ...temp,
            [this.lvlColumn[k] as keyof number]: [],
          };
        }

        var activityInCurrentSubDimension: string[] = Object.keys(
          this.YamlObject[this.allDimensionNames[i]][
            subdimensionsInCurrentDimension[j]
          ]
        );

        for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
          var currentActivityName = activityInCurrentSubDimension[a];
          var tagsInCurrentActivity: string[] =
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ][currentActivityName].tags;
          let flag = 0;
          if (tagsInCurrentActivity) {
            for (let curr = 0; curr < tagsInCurrentActivity.length; curr++) {
              if (
                this.activityCurrentlyBeingShown.includes(
                  tagsInCurrentActivity[curr]
                )
              ) {
                flag = 1;
              }
            }
          }
          if (flag === 1) {
            try {
              var lvlOfActivity: number =
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentActivityName]['level'];

              (
                temp[
                  this.lvlColumn[lvlOfActivity - 1] as keyof number
                ] as unknown as string[]
              ).push(currentActivityName);
            } catch {
              console.log('Level for Activity does not exist');
            }
          }
        }
        if (this.rowsCurrentlyBeingShown.includes(temp.SubDimension)) {
          updatedActivities.push(temp);
        }
      }
    }

    this.dataSource.data = JSON.parse(JSON.stringify(updatedActivities));
  }
  //Remove
  // Remove from SubDimension Filter
  removeSubDimension(row: string): void {
    let index = this.rowsCurrentlyBeingShown.indexOf(row);
    if (index >= 0) {
      this.rowsCurrentlyBeingShown.splice(index, 1);
    }
    this.autoCompeteResults.push(row);
    this.updateActivitesBeingDisplayed();
  }
  // Remove Task from Task Filter
  removeActivity(activity: string): void {
    let index = this.activityCurrentlyBeingShown.indexOf(activity);
    if (index >= 0) {
      this.activityCurrentlyBeingShown.splice(index, 1);
    }
    this.autoCompleteActivityResults.push(activity);
    this.updateActivitesBeingDisplayed();
  }

  //Add chips
  selected(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteResults.indexOf(event.option.viewValue);
    this.autoCompeteResults.splice(autoIndex, 1);
    this.rowsCurrentlyBeingShown.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    this.updateActivitesBeingDisplayed();
  }
  selectedActivity(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompleteActivityResults.indexOf(
      event.option.viewValue
    );
    this.autoCompleteActivityResults.splice(autoIndex, 1);
    this.activityCurrentlyBeingShown.push(event.option.viewValue);
    this.updateActivitesBeingDisplayed();
    this.tagInput.nativeElement.value = '';
    this.rowCtrlTags.setValue(null);
  }
  private filter(value: string): string[] {
    return this.autoCompeteResults.filter(
      row => row.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }
  private filterActivity(value: string): string[] {
    return this.autoCompleteActivityResults.filter(
      activity => activity.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  // task description routing + providing parameters

  navigate(dim: string, subdim: string, lvl: Number, taskName: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        dimension: dim,
        subDimension: subdim,
        level: lvl,
        taskName: taskName,
      },
    };
    this.router.navigate([this.Routing], navigationExtras);
  }
}
