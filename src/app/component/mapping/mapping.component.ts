import { Component, OnInit } from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { MatTableDataSource } from '@angular/material/table';

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
  MAPPING_DATA:MappingElement[]=[]
  dataSource:any= new MatTableDataSource<MappingElement>(this.MAPPING_DATA);  
  YamlObject:any;

  displayedColumns: string[] = ['dimension', 'subDimension', 'taskName','samm2' ,'ISO'];
  allDimensionNames:string[]=[];
  temporaryMappingElement:any
  constructor(private yaml:ymlService) { }

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
    
  }

}
