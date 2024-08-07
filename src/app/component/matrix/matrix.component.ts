import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { Router, NavigationExtras } from '@angular/router';
import { stringify } from 'qs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatChip, MatChipList } from '@angular/material/chips';

export interface MatrixElement {
  Dimension: string;
  SubDimension: string;
}
@UntilDestroy()
@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements OnInit {
  MATRIX_DATA: MatrixElement[] = [];

  Routing: string = '/activity-description';

  YamlObject: any;
  levels: string[] = [];

  displayedColumns: string[] = ['Dimension', 'SubDimension'];

  lvlColumn: string[] = [];
  allRows: string[] = [];
  dataSource: any = new MatTableDataSource<MatrixElement>(this.MATRIX_DATA);
  subDimensionVisible: string[] = [];
  activityVisible: string[] = [];
  allDimensionNames: string[] = [];

  constructor(private yaml: ymlService, private router: Router) {
    this.filteredSubDimension = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) =>
        row ? this.filterSubDimension(row) : this.autoCompeteResults.slice()
      )
    );
    this.filteredActivities = this.rowCtrlActivity.valueChanges.pipe(
      startWith(null),
      map((activity: string | null) =>
        activity
          ? this.filterActivity(activity)
          : this.autoCompleteActivityResults.slice()
      )
    );
  }
  reload() {
    window.location.reload();
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
      this.createSubDimensionList();
      this.createActivityTags(activitySet);
    });
    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
    this.createSubDimensionList();
  }

  @ViewChild(MatChipList)
  chipsControl = new FormControl(['chipsControl']);
  chipList!: MatChipList;

  // @ViewChild(MatChip)
  listTags: string[] = [];
  currentTags: string[] = [];
  createActivityTags(activitySet: Set<any>): void {
    activitySet.forEach(tag => {
      this.listTags.push(tag);
      this.activityVisible.push(tag);
      this.currentTags.push(tag);
    });
    this.updateActivitesBeingDisplayed();
  }

  toggleTagSelection(chip: MatChip) {
    chip.toggleSelected();
    if (chip.selected) {
      this.currentTags = [...this.currentTags, chip.value];
      this.activityVisible = this.currentTags;
      this.updateActivitesBeingDisplayed();
    } else {
      this.currentTags = this.currentTags.filter(o => o !== chip.value);
      this.activityVisible = this.currentTags;
      this.updateActivitesBeingDisplayed();
    }
  }

  listSubDimension: string[] = [];
  currentSubDimensions: string[] = [];
  createSubDimensionList(): void {
    let i = 0;
    while (i < this.MATRIX_DATA.length) {
      if (!this.allRows.includes(this.MATRIX_DATA[i].SubDimension)) {
        this.allRows.push(this.MATRIX_DATA[i].SubDimension);
        this.subDimensionVisible.push(this.MATRIX_DATA[i].SubDimension);
        this.listSubDimension.push(this.MATRIX_DATA[i].SubDimension);
        this.currentSubDimensions.push(this.MATRIX_DATA[i].SubDimension);
      }
      i++;
    }
  }

  toggleSubDimensionSelection(chip: MatChip) {
    chip.toggleSelected();
    if (chip.selected) {
      this.currentSubDimensions = [...this.currentSubDimensions, chip.value];
      this.subDimensionVisible = this.currentSubDimensions;
      this.selectedSubDimension(chip.value);
    } else {
      this.currentSubDimensions = this.currentSubDimensions.filter(
        o => o !== chip.value
      );
      this.subDimensionVisible = this.currentSubDimensions;
      this.removeSubDimensionFromFilter(chip.value);
    }
  }

  //chips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  rowCtrl = new FormControl('');
  rowCtrlActivity = new FormControl('');
  filteredSubDimension: Observable<string[]>;
  filteredActivities: Observable<string[]>;
  autoCompeteResults: string[] = [];
  autoCompleteActivityResults: string[] = [];

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('activityInput') activityInput!: ElementRef<HTMLInputElement>;

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
              if (this.activityVisible.includes(tagsInCurrentActivity[curr])) {
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
        if (this.subDimensionVisible.includes(temp.SubDimension)) {
          updatedActivities.push(temp);
        }
      }
    }

    this.dataSource.data = JSON.parse(JSON.stringify(updatedActivities));
  }

  removeSubDimensionFromFilter(row: string): void {
    let index = this.subDimensionVisible.indexOf(row);
    if (index >= 0) {
      this.subDimensionVisible.splice(index, 1);
    }
    this.autoCompeteResults.push(row);
    this.updateActivitesBeingDisplayed();
  }

  //Add chips
  selectedSubDimension(value: string): void {
    this.subDimensionVisible.push(value);
    this.updateActivitesBeingDisplayed();
  }

  private filterSubDimension(value: string): string[] {
    return this.autoCompeteResults.filter(
      row => row.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }
  private filterActivity(value: string): string[] {
    return this.autoCompleteActivityResults.filter(
      activity => activity.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  // activity description routing + providing parameters

  navigate(
    uuid: String,
    dim: string,
    subdim: string,
    lvl: Number,
    activityName: string
  ) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: uuid,
        dimension: dim,
        subDimension: subdim,
        level: lvl,
        activityName: activityName,
      },
    };
    return `${this.Routing}?${stringify(navigationExtras.queryParams)}`;
  }
}
