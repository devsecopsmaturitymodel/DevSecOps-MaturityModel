import { Component, OnInit } from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { MatTableDataSource } from '@angular/material/table';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface MappingElement {
  dimension: string;
  subDimension: string;
  taskName: string;
  samm2: string[];
  ISO:string[];
}


@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  allMappingData:MappingElement[]=[]
  plannedMappingData:MappingElement[]=[]
  performedMappingData:MappingElement[]=[]

  dataSource:any= new MatTableDataSource<MappingElement>(this.allMappingData);  
  YamlObject:any;

  displayedColumns: string[] = ['dimension', 'subDimension', 'taskName','samm2' ,'ISO'];
  allDimensionNames:string[]=[];
  temporaryMappingElement:any

  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipCtrl = new FormControl('');
  filteredChips: Observable<string[]>;
  currentChip: string[] = ['Performed Activities','Planned Activities'];
  allChips: string[] = ['Performed Activities','Planned Activities'];

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;

  constructor(private yaml:ymlService) { 
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? this._filter(x) : this.allChips.slice())),
    );
  }

  ngOnInit(): void {
    //gets value from generated folder 
    this.yaml.setURI('./assets/YAML/generated/sample.yaml');
    // Function sets data 
    this.yaml.getJson().subscribe((data) => {
      this.YamlObject = data;
      this.allDimensionNames= Object.keys(this.YamlObject)
      for(let i =0;i<this.allDimensionNames.length;i++){
        var subdimensionsInCurrentDimension = Object.keys(this.YamlObject[this.allDimensionNames[i]])
        for(let j=0;j<subdimensionsInCurrentDimension.length;j++){
          var taskInCurrentSubDimension:string[]= Object.keys(this.YamlObject[this.allDimensionNames[i]][subdimensionsInCurrentDimension[j]])
          for(let a=0;a<taskInCurrentSubDimension.length;a++){
            this.setValueandAppendToDataset(this.allDimensionNames[i],subdimensionsInCurrentDimension[j],taskInCurrentSubDimension[a])
          }
        }
      }
      // weird fix to render DOM for table viewing in angular material
      this.dataSource._data.next(this.dataSource.data);
      this.allMappingData=this.dataSource.data
    })
    
    //this.dataSource=new MatTableDataSource([...this.dataSource]);
    //console.log(this.dataSource.data)
  }

  //Sets dataSource value
  setValueandAppendToDataset(dim:string,subDim:string,task:string){
    var ISOArray:string[]=this.YamlObject[dim][subDim][task]['references']['iso27001-2017']
    var SAMMArray:string[]=this.YamlObject[dim][subDim][task]['references']['samm2']
    this.temporaryMappingElement={"dimension":dim,"subDimension":subDim,"taskName":task,"ISO":ISOArray,"samm2":SAMMArray}
    //console.log(this.temp)
    this.dataSource.data.push(this.temporaryMappingElement)
    if(this.YamlObject[dim][subDim][task]['isImplemented']){
      this.performedMappingData.push(this.temporaryMappingElement)
    }
    else{
      this.plannedMappingData.push(this.temporaryMappingElement)
    }
    
  }

  remove(chip: string): void {
    const index = this.currentChip.indexOf(chip);
    //console.log(fruit)
    if (index >= 0) {
      this.currentChip.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.currentChip.push(event.option.viewValue);
    if((this.currentChip.length>1)||(this.currentChip.length==0)){ // both planned and performed actvities are selected
      this.dataSource._data.next(this.allMappingData);
    }
    else{
      if(this.currentChip[0]=='Planned Activities'){ // planned actvities shows planned data
        this.dataSource._data.next(this.plannedMappingData);
        console.log(this.plannedMappingData)
      }
      else {
        this.dataSource._data.next(this.performedMappingData); // performed actvities shows performed data
        console.log(this.performedMappingData)
      }
    }

    this.chipInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allChips.filter(chip => chip.toLowerCase().includes(filterValue));
  }
}
