import { Component, ViewChildren,QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as md from 'markdown-it';


export interface implementation{
  name:string
  tags:string[]
  url:string
  description:string
}
export interface taskDescription {
  dimension:string
  subDimension:string
  level:string
  taskIndex:number
  description:string
  risk: string[]
  measure: string
  implementatonGuide:string
  iso:string[]
  samm:string[]
  knowledge:number
  resources:number
  time:number
  dependsOn:string[]
  implementation:implementation[]
}

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.css']
})
export class TaskDescriptionComponent implements OnInit {

  currentTask: taskDescription={dimension:'',subDimension:'',level:'',taskIndex:-1,description:'',risk:[],
                                measure:'',implementatonGuide:'',samm:[''],iso:[''],knowledge:-1,resources:-1,
                              time:-1,dependsOn:[], implementation:[]}

  YamlObject:any;

  rowIndex:number=0;
  markdown:md = md()

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor(private route: ActivatedRoute,private yaml:ymlService) { }

  ngOnInit(){
      this.route.queryParams.subscribe((params) => {
        this.currentTask.dimension=params['dimension'];
        this.currentTask.subDimension=params['subDimension'];
        this.currentTask.level="level-"+params['level'];
        this.currentTask.taskIndex=params['taskIndex'];
    });
     //gets value from generated folder 
     this.yaml.setURI('./assets/YAML/generated/sample.yaml');
     // Function sets data 
     this.yaml.getJson().subscribe((data) => {
       this.YamlObject = data;
       try{
        for(this.rowIndex=0;this.rowIndex<this.YamlObject['dimension'].length;this.rowIndex++){

              if(!this.YamlObject['dimension'][this.rowIndex]['subdimension']['name']
                .localeCompare(this.currentTask.subDimension)){
                  
                break;
              }   
        }
      }
      catch{
        console.log('Task does not exist!')
      }
      var data =this.YamlObject['dimension'][this.rowIndex]['subdimension']
      [this.currentTask.level][this.currentTask.taskIndex]


      this.currentTask.description=this.defineStringValues(data['description'],'')
      this.currentTask.risk=this.defineStringArrayValues(data['risk'],[])
      this.currentTask.measure=this.defineStringValues(data['measure'],'')
      try{
        data['meta']
        this.currentTask.implementatonGuide=this.defineStringValues(data['meta']['implementationGuide'],'')
      }
      catch{
        console.log('Meta does not exist')
      }
      try{
        data['difficultyOfImplementation']
        this.currentTask.knowledge=this.defineIntegerValues(data['difficultyOfImplementation']['knowledge'],-1)
        this.currentTask.time=this.defineIntegerValues(data['difficultyOfImplementation']['time'],-1)
        this.currentTask.resources=this.defineIntegerValues(data['difficultyOfImplementation']['resources'],-1)
      }
      catch{
        console.log('difficultyOfImplementation does not exist')
      }
      try{
        data['references']
        this.currentTask.iso=this.defineStringArrayValues(data['iso27001-2017'],[])
        this.currentTask.samm=this.defineStringArrayValues(data['samm2'],[])
      }
      catch{
        console.log('references does not exist')
      }
      
      this.currentTask.dependsOn=this.defineStringArrayValues(data['dependsOn'],[])
      
      this.currentTask.implementation=this.defineImplementationObject(data['implementation'])
      
      
    })
  }

  defineStringValues(dataToCheck:string,valueOfDataIfUndefined:string): string{
    try{
      return this.markdown.render(dataToCheck)
    }
    catch{
      return valueOfDataIfUndefined
    }
  }

  defineStringArrayValues(dataToCheck:string[],valueOfDataIfUndefined:string[]): string[]{
    try{
      return dataToCheck
    }
    catch{
      return valueOfDataIfUndefined
    }
  }

  defineIntegerValues(dataToCheck:number,valueOfDataIfUndefined:number): number{
    try{
      return dataToCheck
    }
    catch{
      return valueOfDataIfUndefined
    }
  }
  defineImplementationObject(dataToCheck:implementation[]):implementation[]{
    var dataToReturn:implementation[]=[]
    for (var data in dataToCheck){
      var temp:implementation={name:'',url:'',tags:[],description:''}
      temp["name"]=this.defineStringValues(dataToCheck[data]["name"],'')
      temp["url"]=this.defineStringValues(dataToCheck[data]["url"],'')
      temp["description"]=this.defineStringValues(dataToCheck[data]["description"],'')
      temp["tags"]=this.defineStringArrayValues(dataToCheck[data]["tags"],[])
      //console.log(temp)
      dataToReturn.push(temp)
    }
    //console.log(dataToReturn)
    return dataToReturn
  }

  // Expand all function
  openall(): void{
    this.accordion.forEach(element => {
      element.openAll();
    });
  }

  // Close all function
  closeall(): void{
    this.accordion.forEach(element => {
      element.closeAll();
    });
  }
  
}
