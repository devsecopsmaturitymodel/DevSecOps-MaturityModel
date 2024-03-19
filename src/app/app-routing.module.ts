import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { CircularHeatmapComponent } from './component/circular-heatmap/circular-heatmap.component';
import { MappingComponent } from './component/mapping/mapping.component';
import { MatrixComponent } from './component/matrix/matrix.component';
import { ActivityDescriptionComponent } from './component/activity-description/activity-description.component';
import { UsageComponent } from './component/usage/usage.component';
import { Teams } from './component/teams/teams.component';

const routes: Routes = [
  { path: '', component: MatrixComponent, data: { title: 'Matrix' } },
  { path: 'circular-heatmap', component: CircularHeatmapComponent, data: { title: 'Circular Heatmap' } },
  { path: 'activity-description', component: ActivityDescriptionComponent, data: { title: 'Activity Description' } },
  { path: 'mapping', component: MappingComponent, data: { title: 'Mapping' } },
  { path: 'usage', component: UsageComponent, data: { title: 'Usage' } },
  { path: 'teams', component: Teams, data: { title: 'Teams' } },
  { path: 'about', component: AboutUsComponent, data: { title: 'About Us' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
