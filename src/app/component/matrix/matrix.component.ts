import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  Dimension: string;
  SubDimension: string;
  Level1: string[];
  Level2: string[];
  Level3: string[];
  Level4: string[];
}

const MATRIX_DATA: PeriodicElement[] = [
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
  Level4:['Blue/Green Deployment']},
];

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = [
    'Dimension',
    'SubDimension',
    'Level1',
    'Level2',
    'Level3',
    'Level4'];

  dataSource = MATRIX_DATA;
}
