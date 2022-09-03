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
  allDimensionNames: string[] = [];
  constructor(private yaml: ymlService, private router: Router) {
    this.filteredRows = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) =>
        row ? this._filter(row) : this.autoCompeteResults.slice()
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
      //console.log(this.displayedColumns);
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
          var temp = {
            Dimension: this.allDimensionNames[i],
            SubDimension: subdimensionsInCurrentDimension[j],
          };
          //console.log(typeof(temp))
          for (let k = 0; k < this.levels.length; k++) {
            temp = {
              ...temp,
              [this.lvlColumn[k] as keyof MatrixElement]: [],
            };
          }
          var taskInCurrentSubDimension: string[] = Object.keys(
            this.YamlObject[this.allDimensionNames[i]][
              subdimensionsInCurrentDimension[j]
            ]
          );
          for (let a = 0; a < taskInCurrentSubDimension.length; a++) {
            var currentTaskName = taskInCurrentSubDimension[a];
            try {
              var lvlOfTask: number =
                this.YamlObject[this.allDimensionNames[i]][
                  subdimensionsInCurrentDimension[j]
                ][currentTaskName]['level'];
              console.log(
                temp[this.lvlColumn[lvlOfTask - 1] as keyof MatrixElement]
              );
              (
                temp[
                  this.lvlColumn[lvlOfTask - 1] as keyof MatrixElement
                ] as unknown as string[]
              ).push(currentTaskName);
            } catch {
              console.log('Level for task does not exist');
            }

            //console.log(this.YamlObject['dimension'][i]['subdimension'][lvlTemp][k]['name'])
          }

          console.log(temp);
          this.MATRIX_DATA.push(temp);
        }
      }
      this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
      this.createRowList();
    });

    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA));
    this.createRowList();
  }

  createRowList(): void {
    let i = 0;
    // creates initial row list consisting of all rows
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
  filteredRows: Observable<string[]>;

  autoCompeteResults: string[] = [];

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;

  //Remove chips
  remove(row: string): void {
    let index = this.rowsCurrentlyBeingShown.indexOf(row);
    //console.log(this.allRows);
    if (index >= 0) {
      this.rowsCurrentlyBeingShown.splice(index, 1);
    }
    this.autoCompeteResults.push(row);
    this.dataSource.data.splice(index, 1);
    this.dataSource._data.next(this.dataSource.data);
  }

  //Add chips
  selected(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteResults.indexOf(event.option.viewValue);
    this.autoCompeteResults.splice(autoIndex, 1);
    this.rowsCurrentlyBeingShown.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    //console.log(this.allRows,event.option.viewValue);
    let dataIndex = this.allRows.indexOf(event.option.viewValue);
    this.dataSource.data.push(this.MATRIX_DATA[dataIndex]);
    //console.log(dataIndex);
    //console.log(this.MATRIX_DATA)
    //console.log(this.dataSource.data);
    this.dataSource._data.next(this.dataSource.data);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompeteResults.filter(row =>
      row.toLowerCase().includes(filterValue)
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
    console.log(this.lvlColumn);
    console.log(this.levels);
    this.router.navigate([this.Routing], navigationExtras);
  }
}
