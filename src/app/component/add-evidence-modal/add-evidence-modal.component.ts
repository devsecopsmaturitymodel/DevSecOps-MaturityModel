import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EvidenceEntry, EvidenceStore } from '../../model/evidence-store';
import { TeamGroups } from '../../model/types';

export interface AddEvidenceModalData {
  activityUuid: string;
  allTeams: string[];
  teamGroups: TeamGroups;
}

@Component({
  selector: 'app-add-evidence-modal',
  templateUrl: './add-evidence-modal.component.html',
  styleUrls: ['./add-evidence-modal.component.css'],
})
export class AddEvidenceModalComponent {
  activityUuid: string;
  allTeams: string[];
  teamGroups: TeamGroups;

  // Form fields
  selectedTeams: string[] = [];
  title: string = '';
  description: string = '';
  progress: string = '';
  evidenceRecorded: string = EvidenceStore.todayDateString();
  reviewer: string = '';
  attachments: { type: string; externalLink: string }[] = [];

  // Validation
  teamsError: boolean = false;
  titleError: boolean = false;

  attachmentTypes: string[] = ['document', 'image', 'link'];

  constructor(
    public dialogRef: MatDialogRef<AddEvidenceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEvidenceModalData
  ) {
    this.activityUuid = data.activityUuid;
    this.allTeams = data.allTeams;
    this.teamGroups = data.teamGroups || {};
  }

  onSelectedTeamsChange(teams: string[]): void {
    this.selectedTeams = teams;
    this.teamsError = this.selectedTeams.length === 0;
  }

  addAttachment(): void {
    this.attachments.push({ type: 'link', externalLink: '' });
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  onSave(): void {
    this.teamsError = this.selectedTeams.length === 0;
    this.titleError = !this.title.trim();

    if (this.teamsError || this.titleError) {
      return;
    }

    // Filter out empty attachments
    const validAttachments = this.attachments.filter(a => a.externalLink.trim());

    const entry: EvidenceEntry = {
      id: EvidenceStore.generateId(),
      teams: [...this.selectedTeams],
      title: this.title.trim(),
      description: this.description.trim(),
      evidenceRecorded: this.evidenceRecorded,
      reviewer: this.reviewer.trim() || undefined,
      attachment: validAttachments.length > 0 ? validAttachments : undefined,
    };

    this.dialogRef.close({ activityUuid: this.activityUuid, entry });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
