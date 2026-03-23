import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EvidenceEntry } from '../../model/evidence-store';
import { LoaderService } from '../../service/loader/data-loader.service';

@Component({
  selector: 'app-evidence-panel',
  templateUrl: './evidence-panel.component.html',
  styleUrls: ['./evidence-panel.component.css'],
})
export class EvidencePanelComponent implements OnChanges {
  @Input() activityUuid: string = '';
  @Input() expanded: boolean = false;

  evidenceEntries: EvidenceEntry[] = [];
  evidenceByTeam: Map<string, EvidenceEntry[]> = new Map();
  teamsWithEvidence: string[] = [];

  constructor(private loader: LoaderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityUuid'] && this.activityUuid) {
      this.updateTeamsEvidence();
    }
  }

  updateTeamsEvidence(): void {
    this.evidenceEntries = [];
    this.evidenceByTeam.clear();
    this.teamsWithEvidence = [];

    const dataStore = this.loader.datastore;
    if (!dataStore || !dataStore.evidenceStore || !this.activityUuid) {
      return;
    }

    const evidenceStore = dataStore.evidenceStore;

    if (!evidenceStore.hasEvidence(this.activityUuid)) {
      return;
    }

    this.evidenceEntries = evidenceStore.getEvidence(this.activityUuid);

    // Group evidence entries by team name
    for (const entry of this.evidenceEntries) {
      for (const teamName of entry.teams) {
        if (!this.evidenceByTeam.has(teamName)) {
          this.evidenceByTeam.set(teamName, []);
        }
        this.evidenceByTeam.get(teamName)!.push(entry);
      }
    }

    this.teamsWithEvidence = Array.from(this.evidenceByTeam.keys());
  }
}
