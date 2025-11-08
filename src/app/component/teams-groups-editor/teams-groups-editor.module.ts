import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsGroupsEditorComponent } from './teams-groups-editor.component';
import { SelectableListComponent } from './selectable-list.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TeamsGroupsEditorComponent, SelectableListComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [TeamsGroupsEditorComponent],
})
export class TeamsGroupsEditorModule {}
