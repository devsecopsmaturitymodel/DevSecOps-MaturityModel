import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
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

  // For autocomplete filters
  filteredSubDimension: Observable<string[]>;
  filteredActivities: Observable<string[]>;
  autoCompeteResults: string[] = [];
  autoCompleteActivityResults: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  rowCtrl = new FormControl('');
  rowCtrlActivity = new FormControl('');

  listTags: string[] = [];
  currentTags: string[] = [];

  listSubDimension: string[] = [];
  currentSubDimensions: string[] = [];

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

  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Set column header information
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;
      this.levels = this.YamlObject['strings']['en']['maturity_levels'];
      for (let k = 1; k <= this.levels.length; k++) {
        this.displayedColumns.push('level' + k);
        this.lvlColumn.push('level' + k);
      }
    });

    const activitySet = new Set();

    // Load generated data
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    this.yaml.getJson().subscribe(data => {
      this.YamlObject = data;
      this.allDimensionNames = Object.keys(this.YamlObject);
      for (let i = 0; i < this.allDimensionNames.length; i++) {
        const subdimensionsInCurrentDimension = Object.keys(
          this.YamlObject[this.allDimensionNames[i]]
        );
        for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
          let temp: any = {
            Dimension: this.allDimensionNames[i],
            SubDimension: subdimensionsInCurrentDimension[j],
          };

          for (let k = 0; k < this.levels.length; k++) {
            temp = { ...temp, [this.lvlColumn[k] as keyof number]: [] };
          }

          const activityInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );

          for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
            const currentActivityName = activityInCurrentSubDimension[a];
            const tagsInCurrentActivity: string[] =
              this.YamlObject[this.allDimensionNames[i]][
                subdimensionsInCurrentDimension[j]
              ][currentActivityName].tags;
            if (tagsInCurrentActivity) {
              for (let curr = 0; curr < tagsInCurrentActivity.length; curr++) {
                activitySet.add(tagsInCurrentActivity[curr]);
              }
            }

            try {
              const lvlOfActivity: number =
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

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('activityInput') activityInput!: ElementRef<HTMLInputElement>;

  // Query only the subdimension chips using the unique template reference (e.g. "chipRef")
  @ViewChildren('chipRef') subChips!: QueryList<MatChip>;

  // --- Tag Chips Methods ---
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
    } else {
      this.currentTags = this.currentTags.filter(o => o !== chip.value);
      this.activityVisible = this.currentTags;
    }
    this.updateActivitesBeingDisplayed();
  }

  // --- SubDimension Chips Methods ---

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

  // Toggle subdimension selection based on its string value
  toggleSubDimensionSelection(subDimension: string): void {
    if (this.currentSubDimensions.includes(subDimension)) {
      // Remove the subdimension from the filter
      this.currentSubDimensions = this.currentSubDimensions.filter(
        sd => sd !== subDimension
      );
      this.removeSubDimensionFromFilter(subDimension);
    } else {
      // Add the subdimension to the filter
      this.currentSubDimensions = [...this.currentSubDimensions, subDimension];
      this.selectedSubDimension(subDimension);
    }
    // Update the filter and displayed activities
    this.subDimensionVisible = this.currentSubDimensions;
    this.updateActivitesBeingDisplayed();
  }

  // Method to reset/deselect all subdimension filters
  resetSubDimensionFilters(): void {
    this.subChips.forEach((chip: MatChip) => {
      chip.selected = false;
    });
    // Also clear the filter arrays and update the table
    this.currentSubDimensions = [];
    this.subDimensionVisible = [];
    this.updateActivitesBeingDisplayed();
  }

  // When a subdimension is selected manually, update the visible filter
  selectedSubDimension(value: string): void {
    if (!this.subDimensionVisible.includes(value)) {
      this.subDimensionVisible.push(value);
    }
    this.updateActivitesBeingDisplayed();
  }

  // Method to select all subdimension filters
  selectAllSubDimensionFilters(): void {
    // Set the current filters to include all subdimensions
    this.currentSubDimensions = [...this.listSubDimension];
    // Update the visible filters
    this.subDimensionVisible = [...this.listSubDimension];
    // Loop through each chip and mark it as selected
    this.subChips.forEach((chip: MatChip) => {
      chip.selected = true;
    });
    // Refresh the activities displayed in the table
    this.updateActivitesBeingDisplayed();
  }

  removeSubDimensionFromFilter(value: string): void {
    const index = this.subDimensionVisible.indexOf(value);
    if (index >= 0) {
      this.subDimensionVisible.splice(index, 1);
    }
    this.autoCompeteResults.push(value);
    this.updateActivitesBeingDisplayed();
  }

  // --- Filtering Methods (for autocomplete) ---
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

  // --- Table Data Update ---
  updateActivitesBeingDisplayed(): void {
    const updatedActivities: any = [];

    for (let i = 0; i < this.allDimensionNames.length; i++) {
      const subdimensionsInCurrentDimension = Object.keys(
        this.YamlObject[this.allDimensionNames[i]]
      );
      for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
        let temp: any = {
          Dimension: this.allDimensionNames[i],
          SubDimension: subdimensionsInCurrentDimension[j],
        };
        for (let k = 0; k < this.levels.length; k++) {
          temp = { ...temp, [this.lvlColumn[k] as keyof number]: [] };
        }
        const activityInCurrentSubDimension: string[] = Object.keys(
          this.YamlObject[this.allDimensionNames[i]][
            subdimensionsInCurrentDimension[j]
          ]
        );
        for (let a = 0; a < activityInCurrentSubDimension.length; a++) {
          const currentActivityName = activityInCurrentSubDimension[a];
          const tagsInCurrentActivity: string[] =
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
              const lvlOfActivity: number =
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

  // --- Routing ---
  navigate(
    uuid: String,
    dim: string,
    subdim: string,
    lvl: Number,
    activityName: string
  ) {
    const navigationExtras: NavigationExtras = {
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
