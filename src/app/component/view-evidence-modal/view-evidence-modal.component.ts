import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EvidencePanelComponent } from '../evidence-panel/evidence-panel.component';

export interface ViewEvidenceModalData {
  activityUuid: string;
  activityName: string;
}

@Component({
  selector: 'app-view-evidence-modal',
  templateUrl: './view-evidence-modal.component.html',
  styleUrls: ['./view-evidence-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, EvidencePanelComponent, MatButtonModule],
})
export class ViewEvidenceModalComponent {
  dialogRef = inject<MatDialogRef<ViewEvidenceModalComponent>>(MatDialogRef);
  data = inject<ViewEvidenceModalData>(MAT_DIALOG_DATA);

  activityUuid: string;
  activityName: string;

  constructor() {
    const data = this.data;

    this.activityUuid = data.activityUuid;
    this.activityName = data.activityName || 'Activity';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
