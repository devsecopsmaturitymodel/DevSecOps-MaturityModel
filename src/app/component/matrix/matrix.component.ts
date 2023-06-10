import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { Router, NavigationExtras } from '@angular/router';

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

  Routing: string = '/task-description';

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
  // function to initialize if level columns exists

  ngAfterViewInit() {
    this.selectChips(this.value);
    console.log(this.chipList.chipSelectionChanges);
    this.chipList.chipSelectionChanges
      .pipe(
        untilDestroyed(this),
        map(event => event.source)
      )
      .subscribe(chip => {
        console.log('asd');
        if (chip.selected) {
          this.value = [...this.value, chip.value];
        } else {
          console.log('asd');
          this.value = this.value.filter(o => o !== chip.value);
        }

        this.propagateChange(this.value);
      });
  }
  ngOnInit(): void {
    // //
    // this.disabledControl.valueChanges
    //   .pipe(untilDestroyed(this))
    //   .subscribe(val => {
    //     if (val) this.chipsControl.disable();
    //     else this.chipsControl.enable();
    //   });
    // //

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

      this.createActivityTags(activitySet);
    });

    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
    this.createRowList();
  }
  options: string[] = [];
  createActivityTags(activitySet: Set<any>): void {
    activitySet.forEach(tag => this.activityVisible.push(tag));
    activitySet.forEach(tag => this.options.push(tag));
    console.log(this.options);
  }
  // options: string[] = this.options2;

  // asdasdas

  @ViewChild(MatChipList)
  chipList!: MatChipList;

  value: string[] = [];

  onChange!: (value: string[]) => void;
  onTouch: any;

  disabled = false;

  writeValue(value: string[]): void {
    // When form value set when chips list initialized
    if (this.chipList && value) {
      this.selectChips(value);
    } else if (value) {
      // When chips not initialized
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    console.log('asd');
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  propagateChange(value: string[]) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  selectChips(value: string[]) {
    this.chipList.chips.forEach(chip => chip.deselect());

    const chipsToSelect = this.chipList.chips.filter(c =>
      value.includes(c.value)
    );

    chipsToSelect.forEach(chip => chip.select());
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
    console.log(chip.value);
    console.log(chip.toggleSelected);
  }

  chipsControl = new FormControl([]);
  chipsControlValue$ = this.chipsControl.valueChanges;
  // asdasdas

  createRowList(): void {
    let i = 0;
    while (i < this.MATRIX_DATA.length) {
      if (!this.allRows.includes(this.MATRIX_DATA[i].SubDimension)) {
        this.allRows.push(this.MATRIX_DATA[i].SubDimension);
        this.subDimensionVisible.push(this.MATRIX_DATA[i].SubDimension);
      }
      i++;
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

  //

  // console.log(this);
  // disabledControl = new FormControl(false);

  // setChipsValue() {
  //   this.chipsControl.setValue(['Shoes', 'Electronics']);
  // }

  //
  removeSubDimensionFromFilter(row: string): void {
    let index = this.subDimensionVisible.indexOf(row);
    if (index >= 0) {
      this.subDimensionVisible.splice(index, 1);
    }
    this.autoCompeteResults.push(row);
    this.updateActivitesBeingDisplayed();
  }
  removeActivityFromFilter(activity: string): void {
    let index = this.activityVisible.indexOf(activity);
    if (index >= 0) {
      this.activityVisible.splice(index, 1);
    }
    this.autoCompleteActivityResults.push(activity);
    this.updateActivitesBeingDisplayed();
  }

  //Add chips
  selectedSubDimension(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteResults.indexOf(event.option.viewValue);
    this.autoCompeteResults.splice(autoIndex, 1);
    this.subDimensionVisible.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    this.updateActivitesBeingDisplayed();
  }
  selectedActivity(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompleteActivityResults.indexOf(
      event.option.viewValue
    );
    this.autoCompleteActivityResults.splice(autoIndex, 1);
    this.activityVisible.push(event.option.viewValue);
    this.updateActivitesBeingDisplayed();
    this.activityInput.nativeElement.value = '';
    this.rowCtrlActivity.setValue(null);
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
