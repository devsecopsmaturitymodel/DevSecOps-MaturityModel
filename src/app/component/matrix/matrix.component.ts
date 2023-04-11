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
  // tag_data: string[] = [];

  Routing: string = '/task-description';

  YamlObject: any;
  levels: string[] = [];

  displayedColumns: string[] = ['Dimension', 'SubDimension'];

  lvlColumn: string[] = [];
  allRows: string[] = [];
  dataSource: any = new MatTableDataSource<MatrixElement>(this.MATRIX_DATA);
  rowsCurrentlyBeingShown: string[] = [];
  tasksCurrentlyBeingShown: string[] = [];
  allDimensionNames: string[] = [];
  constructor(private yaml: ymlService, private router: Router) {
    this.filteredRows = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) =>
        row ? this._filter(row) : this.autoCompeteResults.slice()
      )
    );
    this.filteredTasks = this.rowCtrltags.valueChanges.pipe(
      startWith(null),
      map((task: string | null) =>
        task ? this._filterTask(task) : this.autoCompleteTaskResults.slice()
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
    var taskset = new Set();

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

          var taskInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );

          for (let a = 0; a < taskInCurrentSubDimension.length; a++) {
            var currentTaskName = taskInCurrentSubDimension[a];
            var tagsInCurrentTask: string[] =
              this.YamlObject[this.allDimensionNames[i]][
                subdimensionsInCurrentDimension[j]
              ][currentTaskName].tags;
            if (tagsInCurrentTask) {
              for (let curr = 0; curr < tagsInCurrentTask.length; curr++) {
                taskset.add(tagsInCurrentTask[curr]);
              }
            }

            try {
              var lvlOfTask: number =
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentTaskName]['level'];

              (
                temp[
                  this.lvlColumn[lvlOfTask - 1] as keyof number
                ] as unknown as string[]
              ).push(currentTaskName);
            } catch {
              console.log('Level for task does not exist');
            }
          }

          this.MATRIX_DATA.push(temp);
        }
      }
      this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
      this.createRowList();
      this.createTaskTags(taskset);
    });

    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
    this.createRowList();
  }

  createTaskTags(taskset: Set<any>): void {
    taskset.forEach(tag => this.tasksCurrentlyBeingShown.push(tag));
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
  rowCtrltags = new FormControl('');
  filteredRows: Observable<string[]>;
  filteredTasks: Observable<string[]>;

  autoCompeteResults: string[] = [];
  autoCompleteTaskResults: string[] = [];

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  updateTask(tags: string[]): void {
    // Iterate over all objects and create new MATRIX_DATA
    var updatedTasks: any = [];

    for (let i = 0; i < this.allDimensionNames.length; i++) {
      var subdimensionsInCurrentDimension = Object.keys(
        this.YamlObject[this.allDimensionNames[i]]
      );

      for (let j = 0; j < subdimensionsInCurrentDimension.length; j++) {
        var temp: any = {
          Dimension: this.allDimensionNames[i],
          SubDimension: subdimensionsInCurrentDimension[j],
        };

        // if(subDimension_flag === 1){

        // }
        for (let k = 0; k < this.levels.length; k++) {
          temp = {
            ...temp,
            [this.lvlColumn[k] as keyof number]: [],
          };
        }

        var taskInCurrentSubDimension: string[] = Object.keys(
          this.YamlObject[this.allDimensionNames[i]][
            subdimensionsInCurrentDimension[j]
          ]
        );

        for (let a = 0; a < taskInCurrentSubDimension.length; a++) {
          var currentTaskName = taskInCurrentSubDimension[a];
          var tagsInCurrentTask: string[] =
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ][currentTaskName].tags;
          let flag = 0;
          if (tagsInCurrentTask) {
            for (let curr = 0; curr < tagsInCurrentTask.length; curr++) {
              if (tags.includes(tagsInCurrentTask[curr])) {
                flag = 1;
              }
            }
          }
          if (flag === 1) {
            try {
              var lvlOfTask: number =
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentTaskName]['level'];

              (
                temp[
                  this.lvlColumn[lvlOfTask - 1] as keyof number
                ] as unknown as string[]
              ).push(currentTaskName);
            } catch {
              console.log('Level for task does not exist');
            }
          }
        }
        // let subDimension_flag = 0;
        if (this.rowsCurrentlyBeingShown.includes(temp.SubDimension)) {
          // subDimension_flag = 1;
          updatedTasks.push(temp);
        }
      }
    }

    this.dataSource.data = JSON.parse(JSON.stringify(updatedTasks));
  }
  //Remove
  // Remove from SubDimension Filter
  removeSubDimension(row: string): void {
    let index = this.rowsCurrentlyBeingShown.indexOf(row);
    if (index >= 0) {
      this.rowsCurrentlyBeingShown.splice(index, 1);
    }
    this.autoCompeteResults.push(row);
    this.dataSource.data.splice(index, 1);
    this.dataSource._data.next(this.dataSource.data);
  }
  // Remove Task from Task Filter
  removeTask(task: string): void {
    // WORK REQUIRED
    let index = this.tasksCurrentlyBeingShown.indexOf(task);
    if (index >= 0) {
      this.tasksCurrentlyBeingShown.splice(index, 1);
    }
    this.autoCompleteTaskResults.push(task);
    this.updateTask(this.tasksCurrentlyBeingShown);

    // remove data from matrix
  }

  //Add chips
  selected(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteResults.indexOf(event.option.viewValue);
    this.autoCompeteResults.splice(autoIndex, 1);
    this.rowsCurrentlyBeingShown.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    let dataIndex = this.allRows.indexOf(event.option.viewValue);
    this.dataSource.data.push(this.MATRIX_DATA[dataIndex]);
    this.dataSource._data.next(this.dataSource.data);
  }
  selectedTask(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompleteTaskResults.indexOf(
      event.option.viewValue
    );
    this.autoCompleteTaskResults.splice(autoIndex, 1);
    this.tasksCurrentlyBeingShown.push(event.option.viewValue);
    this.updateTask(this.tasksCurrentlyBeingShown);
    this.tagInput.nativeElement.value = '';
    this.rowCtrltags.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompeteResults.filter(row => {
      row.toLowerCase().includes(filterValue);
    });
  }
  private _filterTask(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompleteTaskResults.filter(task => {
      task.toLowerCase().includes(filterValue);
    });
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
