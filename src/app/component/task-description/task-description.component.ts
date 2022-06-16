import { Component, ViewChildren,QueryList, AfterViewInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

export interface taskDescription {
  name: string;
  description: string;
  risk: string[];
  assessment: string[];
  comment: string[];
  evidence: string[];
}

const implementationGuide: taskDescription[] = [
  
];

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.css']
})
export class TaskDescriptionComponent implements AfterViewInit {

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor() { }

  ngAfterViewInit(){
    
  }
  openall(): void{
    this.accordion.forEach(element => {
      element.openAll();
    });
  }
  closeall(): void{
    this.accordion.forEach(element => {
      element.closeAll();
    });
  }
  
}
