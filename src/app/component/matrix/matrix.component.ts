import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  MATRIX_DATA: MatrixElement[] = [];

  Routing: string='/task-description'

  YamlObject:any;
  levels:string[]=[];
  
  displayedColumns: string[] = [
    'Dimension',
    'SubDimension'
    ];

  lvlColumn: string[]=[];
  allRows:string[]=[];
  dataSource:any= new MatTableDataSource<MatrixElement>(this.MATRIX_DATA);
  rowsCurrentlyBeingShown: string[] = [];
  
  constructor(private yaml:ymlService,private router: Router) {
    this.filteredRows = this.rowCtrl.valueChanges.pipe(
      startWith(null),
      map((row: string | null) => (row ? this._filter(row) : this.autoCompeteResults.slice())),
    );
   }

   // function to initialize if level columns exists
   ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/sample.yaml');
    // Function sets column header
    this.yaml.getJson().subscribe((data) => {
      this.YamlObject = data;

      // Levels header
      this.levels = this.YamlObject['strings']['en']['maturity_levels'];

      // pushes Levels in displayed column  
      for(let k=1; k<=this.levels.length; k++){
        this.displayedColumns.push('level'+k);
        this.lvlColumn.push('level'+k);
      }  
      //console.log(this.displayedColumns);
    });

    //gets value from generated folder 
    this.yaml.setURI('./assets/YAML/generated/sample.yaml');
    // Function sets data 
    this.yaml.getJson().subscribe((data) => {
      this.YamlObject = data;
      var len = this.YamlObject['dimension'].length;
      //console.log(this.YamlObject['dimension'][0]['subdimension']['level-1'])
      for(let i =0;i<len;i++){
        var temp = {Dimension:this.YamlObject['dimension'][i]['name'],
                                  SubDimension:this.YamlObject['dimension'][i]['subdimension']['name'],
                                  }
        //console.log(typeof(temp))
        for (let j = 0 ;j<this.levels.length; j++)
          {
            temp={
              ...temp,
              [this.lvlColumn[j] as keyof MatrixElement]: []
            }
            
            var lvlTemp='level-'+(j+1)
            
            try{
              for(let k =0;k<this.YamlObject['dimension'][i]['subdimension'][lvlTemp].length;k++){
                  temp[this.lvlColumn[j] as keyof MatrixElement].push(this.YamlObject['dimension'][i]['subdimension'][lvlTemp][k]['name'])
                  //console.log(this.YamlObject['dimension'][i]['subdimension'][lvlTemp][k]['name'])
              }
            }
            catch{
              temp[this.lvlColumn[j] as keyof MatrixElement]=[]
            }
          }
          console.log(temp)
        this.MATRIX_DATA.push(temp)
      } 
      this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA)); 
      this.createRowList();
    });
    
    this.dataSource.data = JSON.parse(JSON.stringify(this.MATRIX_DATA)); 
    this.createRowList();
    
  }

  createRowList(): void{
    let i =0;
    // creates initial row list consisting of all rows 
    while(i<this.MATRIX_DATA.length){
      if(!this.allRows.includes(this.MATRIX_DATA[i].SubDimension)){
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
    this.dataSource.data.splice(index,1);
    this.dataSource._data.next(this.dataSource.data)
  }

  //Add chips
  selected(event: MatAutocompleteSelectedEvent): void {
    let autoIndex = this.autoCompeteResults.indexOf(event.option.viewValue);
    this.autoCompeteResults.splice(autoIndex,1);
    this.rowsCurrentlyBeingShown.push(event.option.viewValue);
    this.rowInput.nativeElement.value = '';
    this.rowCtrl.setValue(null);
    //console.log(this.allRows,event.option.viewValue);
    let dataIndex=this.allRows.indexOf(event.option.viewValue);
    this.dataSource.data.push(this.MATRIX_DATA[dataIndex]);
    //console.log(dataIndex);
    //console.log(this.MATRIX_DATA)
    //console.log(this.dataSource.data);
    this.dataSource._data.next(this.dataSource.data);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompeteResults.filter(row => row.toLowerCase().includes(filterValue));
  }

  // task description routing + providing parameters

  navigate(dim:string,subdim:string,lvl:Number,ti:Number) {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            dimension:dim,
            subDimension:subdim,
            level:lvl,
            taskIndex:ti
        }
    }
    console.log(this.lvlColumn)
    console.log(this.levels)
    this.router.navigate([this.Routing], navigationExtras);
}

  
  

}
