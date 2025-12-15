import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CircularHeatmapComponent } from './pages/circular-heatmap/circular-heatmap.component';
import { MatrixComponent } from './pages/matrix/matrix.component';
import { MappingComponent } from './pages/mapping/mapping.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { UsageComponent } from './pages/usage/usage.component';
import { UserdayComponent } from './pages/userday/userday.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LogoComponent } from './component/logo/logo.component';
import { SidenavButtonsComponent } from './component/sidenav-buttons/sidenav-buttons.component';
import { TopHeaderComponent } from './component/top-header/top-header.component';
import { ActivityDescriptionComponent } from './component/activity-description/activity-description.component';
import { ActivityDescriptionPageComponent } from './pages/activity-description/activity-description-page.component';
import { LoaderService } from './service/loader/data-loader.service';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownViewerComponent } from './component/markdown-viewer/markdown-viewer.component';
import { DependencyGraphComponent } from './component/dependency-graph/dependency-graph.component';
import { ToStringValuePipe } from './pipe/to-string-value.pipe';
import { ModalMessageComponent } from './component/modal-message/modal-message.component';
import { ProgressSliderComponent } from './component/progress-slider/progress-slider.component';
import { KpiComponent } from './component/kpi/kpi.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamsGroupsEditorModule } from './component/teams-groups-editor/teams-groups-editor.module';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    MatrixComponent,
    SidenavButtonsComponent,
    TopHeaderComponent,
    ActivityDescriptionComponent,
    ActivityDescriptionPageComponent,
    CircularHeatmapComponent,
    MappingComponent,
    MarkdownViewerComponent,
    UsageComponent,
    AboutUsComponent,
    DependencyGraphComponent,
    TeamsComponent,
    ToStringValuePipe,
    UserdayComponent,
    RoadmapComponent,
    ModalMessageComponent,
    ProgressSliderComponent,
    KpiComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TeamsGroupsEditorModule,
  ],
  providers: [
    LoaderService,
    ModalMessageComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: { close: (dialogResult: any) => {} } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
