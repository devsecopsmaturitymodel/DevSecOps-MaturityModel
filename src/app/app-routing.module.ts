import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { UserdayComponent } from './component/userday/userday.component';
import { CircularHeatmapComponent } from './component/circular-heatmap/circular-heatmap.component';
import { MappingComponent } from './component/mapping/mapping.component';
import { MatrixComponent } from './component/matrix/matrix.component';
import { ActivityDescriptionComponent } from './component/activity-description/activity-description.component';
import { UsageComponent } from './component/usage/usage.component';
import { TeamsComponent } from './component/teams/teams.component';

const routes: Routes = [
  { path: '', component: CircularHeatmapComponent },
  { path: 'circular-heatmap', component: CircularHeatmapComponent },
  { path: 'matrix', component: MatrixComponent },
  { path: 'activity-description', component: ActivityDescriptionComponent },
  { path: 'mapping', component: MappingComponent },
  { path: 'usage', redirectTo: 'usage/' },
  { path: 'usage/:page', component: UsageComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'userday', component: UserdayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
