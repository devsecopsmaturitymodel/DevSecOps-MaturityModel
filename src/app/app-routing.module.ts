import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircularHeatmapComponent } from './component/circular-heatmap/circular-heatmap.component';
import { MainContentComponent } from './component/main-content/main-content.component';
import { MatrixComponent } from './component/matrix/matrix.component';


const routes: Routes = [
  {path: '',component: MainContentComponent},
  {path: 'matrix', component: MatrixComponent},
  {path: 'circular-heatmap', component: CircularHeatmapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
