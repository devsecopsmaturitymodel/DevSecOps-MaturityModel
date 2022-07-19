import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MainContentComponent } from './component/main-content/main-content.component';
import { LogoComponent } from './component/logo/logo.component';
import { MatrixComponent } from './component/matrix/matrix.component';
import { SidenavButtonsComponent } from './component/sidenav-buttons/sidenav-buttons.component';
import { TopHeaderComponent } from './component/top-header/top-header.component';
import { TaskDescriptionComponent } from './component/task-description/task-description.component';
import { ymlService } from './service/yaml-parser/yaml-parser.service';
import { HttpClientModule } from '@angular/common/http';
import { CombinerService } from './service/combiner/combiner.service';
import { CircularHeatmapComponent } from './component/circular-heatmap/circular-heatmap.component';
import { MappingComponent } from './component/mapping/mapping.component';


@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    LogoComponent,
    MatrixComponent,
    SidenavButtonsComponent,
    TopHeaderComponent,
    TaskDescriptionComponent,
    CircularHeatmapComponent,
    MappingComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  providers: [ymlService,CombinerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
