import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { CircularHeatmapComponent } from './component/circular-heatmap/circular-heatmap.component';
import { MappingComponent } from './component/mapping/mapping.component';
import { MatrixComponent } from './component/matrix/matrix.component';
import { ActivityDescriptionComponent } from './component/activity-description/activity-description.component';
import { UsageComponent } from './component/usage/usage.component';
import { Teams } from './component/teams/teams.component';

const routes: Routes = [
  { path: '', component: MatrixComponent, title: 'DSOMM - Matrix' },
  { path: 'circular-heatmap', component: CircularHeatmapComponent, title: ' DSOMM - Circular Heatmap' },
  { path: 'activity-description', component: ActivityDescriptionComponent , title:'DSOMM - Activity-Description' },
  { path: 'mapping', component: MappingComponent , title: ' DSOMM - Mapping'},
  { path: 'usage', component: UsageComponent , title: 'DSOMM-Usage'},
  { path: 'teams', component: Teams , title: 'DSOMM - Teams'},
  { path: 'about', component: AboutUsComponent , title: 'DSOMM - About'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
