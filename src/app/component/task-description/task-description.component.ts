import { Component, ViewChildren,QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';

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
export class TaskDescriptionComponent implements OnInit {

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(){
      this.route.queryParams.subscribe((params) => {
        console.log(params);
    });
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
