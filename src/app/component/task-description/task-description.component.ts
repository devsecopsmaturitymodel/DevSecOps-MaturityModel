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
}

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.css']
})
export class TaskDescriptionComponent implements OnInit {

  currentTask: taskDescription={dimension:'',subDimension:'',level:'',taskIndex:-1,description:''}

  YamlObject:any;

  rowIndex:number=0;
  markdown:md = md()
  description:any;

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
      try{
       this.currentTask.description = this.YamlObject['dimension'][this.rowIndex]['subdimension'][this.currentTask.level][this.currentTask.taskIndex]['md-description']
       this.description=this.markdown.render(this.currentTask.description);
      }
      catch{
        this.currentTask.description = this.YamlObject['dimension'][this.rowIndex]['subdimension'][this.currentTask.level][this.currentTask.taskIndex]['description']
        this.description=this.markdown.render(this.currentTask.description);
      }
       
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
