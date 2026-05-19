import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ViewEvidenceModalData {
  activityUuid: string;
  activityName: string;
}

@Component({
  selector: 'app-view-evidence-modal',
  templateUrl: './view-evidence-modal.component.html',
  styleUrls: ['./view-evidence-modal.component.css'],
})
export class ViewEvidenceModalComponent {
  activityUuid: string;
  activityName: string;

  constructor(
    public dialogRef: MatDialogRef<ViewEvidenceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewEvidenceModalData
  ) {
    this.activityUuid = data.activityUuid;
    this.activityName = data.activityName || 'Activity';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
