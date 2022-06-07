import { Component, OnInit } from '@angular/core';

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
];

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {
  
  iflvl1exists:boolean = false;
  iflvl2exists:boolean = false;
  iflvl3exists:boolean = false;
  iflvl4exists:boolean = false;
  
  displayedColumns: string[] = [
    'Dimension',
    'SubDimension',
    ];
  
  constructor() { }

  ngOnInit(): void {
    let i =0;
    while((i<MATRIX_DATA.length) && (this.iflvl1exists==false || this.iflvl2exists==false || this.iflvl3exists==false || this.iflvl4exists==false)){
      if((this.iflvl1exists==false) && MATRIX_DATA[i].Level1.length!=0){
        console.log(MATRIX_DATA[i].Level1);
        this.iflvl1exists=true
      }
      if((this.iflvl2exists==false) && MATRIX_DATA[i].Level2.length!=0){
        console.log(MATRIX_DATA[i].Level2);
        this.iflvl2exists=true
      }
      if((this.iflvl3exists==false) && MATRIX_DATA[i].Level3.length!=0){
        console.log(MATRIX_DATA[i].Level3);
        this.iflvl3exists=true
      }
      if((this.iflvl4exists==false) && MATRIX_DATA[i].Level4.length!=0){
        console.log(MATRIX_DATA[i].Level4);
        this.iflvl4exists=true
      }
      i++;
    };
    if(this.iflvl1exists==true){
      this.displayedColumns.push('Level1');
    };
    if(this.iflvl2exists==true){
      this.displayedColumns.push('Level2');
    };
    if(this.iflvl3exists==true){
      this.displayedColumns.push('Level3');
    };
    if(this.iflvl4exists==true){
      this.displayedColumns.push('Level4');
    };
  
  }

  
  dataSource = MATRIX_DATA;
}
