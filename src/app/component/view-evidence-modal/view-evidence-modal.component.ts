import { Component, Inject } from '@angular/core';
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
  standalone: true,
  imports: [MatDialogModule, EvidencePanelComponent, MatButtonModule],
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
