import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { UserdayComponent } from './pages/userday/userday.component';
import { CircularHeatmapComponent } from './pages/circular-heatmap/circular-heatmap.component';
import { MappingComponent } from './pages/mapping/mapping.component';
import { MatrixComponent } from './pages/matrix/matrix.component';
import { ActivityDescriptionComponent } from './component/activity-description/activity-description.component';
import { UsageComponent } from './pages/usage/usage.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

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
  { path: 'roadmap', component: RoadmapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
