import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ymlService } from '../../service/yaml-parser.service';


export interface MatrixElement {
  Dimension: string;
  SubDimension: string;
  Level1: string[];
  Level2: string[];
  Level3: string[];
  Level4: string[];
}

const MATRIX_DATA: MatrixElement[] = [
  {Dimension: 'Build and Deployment', 
  SubDimension: 'Build', 
  Level1: ['Defined build process','ES'], 
  Level2:['Pinning of artifacts'],
  Level3:['Signing of artifacts'],
  Level4:[]},
  {Dimension: 'Build and Deployment', 
  SubDimension: 'Deployment', 
  Level1: ['Defined deployment process','EN'], 
  Level2:['Defined decommissioning process'],
  Level3:['Rolling update on deployment'],
  Level4:['Temp']},
  {Dimension: 'Build and Deployment', 
  SubDimension: 'Depl', 
  Level1: ['Defined deployment process','EN'], 
  Level2:['Defined decommissioning process'],
  Level3:['Rolling update on deployment'],
  Level4:['Temp']},
];


@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  Routing: string='/task-description'

  YamlObject:any;
  levels:string[]=[];
  
  iflvl1exists:boolean = false;
  iflvl2exists:boolean = false;
  iflvl3exists:boolean = false;
  iflvl4exists:boolean = false;
  
  displayedColumns: string[] = [
    'Dimension',
    'SubDimension'
    ];
  lvlColumn: string[]=[];
  allRows:string[]=[];
  dataSource:any= new MatTableDataSource<MatrixElement>(MATRIX_DATA);
  rows: string[] = [];
  
  constructor(private yaml:ymlService) {
    yaml.setURI('./assets/YAML/sample.yaml');
    this.yaml.getJson().subscribe((data) => {
      this.YamlObject = data;

      // Levels header
      this.levels = this.YamlObject['strings']['en']['maturity_levels'];

      // pushes Levels in displayed column  
      for(let k=1; k<=this.levels.length; k++){
        this.displayedColumns.push('Level'+k);
        this.lvlColumn.push('Level'+k);
      }  
      console.log(this.displayedColumns);
    });
    this.filteredRows = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) => (row ? this._filter(row) : this.autoCompeteRows.slice())),
    );
   }

   // function to initialize if level columns exists
   ngOnInit(): void {
    this.dataSource.data = JSON.parse(JSON.stringify(MATRIX_DATA)); ;
    let i =0;

    

    
    
    // creates initial row list consisting of all rows 
    while(i<MATRIX_DATA.length){
      if(!this.allRows.includes(MATRIX_DATA[i].SubDimension)){
        this.allRows.push(MATRIX_DATA[i].SubDimension);
        this.rows.push(MATRIX_DATA[i].SubDimension);
      }
      i++;
    }
    console.log(this.allRows)
    
  }



  //chips
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  rowCtrl = new FormControl('');
  filteredRows: Observable<string[]>;
  
  autoCompeteRows: string[] = [];

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
   
  //Remove chips 
  remove(row: string): void {
    let index = this.rows.indexOf(row);
    //console.log(this.allRows);
    if (index >= 0) {
      this.rows.splice(index, 1);
    }
    this.autoCompeteRows.push(row);
    this.dataSource.data.splice(index,1);
    this.dataSource._data.next(this.dataSource.data)
  }

  //Add chips
  selected(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteRows.indexOf(event.option.viewValue);
    this.autoCompeteRows.splice(autoIndex,1);
    this.rows.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    //console.log(this.allRows,event.option.viewValue);
    let dataIndex=this.allRows.indexOf(event.option.viewValue);
    this.dataSource.data.push(MATRIX_DATA[dataIndex]);
    //console.log(dataIndex);
    //console.log(MATRIX_DATA)
    //console.log(this.dataSource.data);
    this.dataSource._data.next(this.dataSource.data);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompeteRows.filter(row => row.toLowerCase().includes(filterValue));
  }

  
  

}
