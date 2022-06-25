import { Component, ViewChildren,QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as md from 'markdown-it';

export interface taskDescription {
  dimension:string
  subDimension:string
  level:string
  taskIndex:number
  description:string
  risk: string
  measure: string
}

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.css']
})
export class TaskDescriptionComponent implements OnInit {

  currentTask: taskDescription={dimension:'',subDimension:'',level:'',taskIndex:-1,description:'',risk:'',measure:''}

  YamlObject:any;

  rowIndex:number=0;
  markdown:md = md()
  description:any;
  risk:any;
  measure:any;

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
      
      this.currentTask.description = this.YamlObject['dimension'][this.rowIndex]['subdimension']
      [this.currentTask.level][this.currentTask.taskIndex]['description']
      this.currentTask.risk = this.YamlObject['dimension'][this.rowIndex]['subdimension']
      [this.currentTask.level][this.currentTask.taskIndex]['risk']
      this.currentTask.measure = this.YamlObject['dimension'][this.rowIndex]['subdimension']
      [this.currentTask.level][this.currentTask.taskIndex]['measure']
      this.measure=this.markdown.render(this.currentTask.measure);
      this.description=this.markdown.render(this.currentTask.description);
      this.risk=this.markdown.render(this.currentTask.risk);
      
       
       console.log('ere')
    })
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
