import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list'; 

const MaterialComponents= [
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
];

@NgModule({
  imports: [MaterialComponents],
  exports:[MaterialComponents]
})
export class MaterialModule { }
