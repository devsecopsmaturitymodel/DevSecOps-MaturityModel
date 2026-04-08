import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeamGroups } from '../../model/types';
import { SettingsService } from 'src/app/service/settings/settings.service';

@Component({
  selector: 'app-team-selector',
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.css'],
})
export class TeamSelectorComponent {
  @Input() allTeams: string[] = [];
  @Input() selectedTeams: string[] = [];
  @Input() teamGroups: TeamGroups = {};
  @Input() type: 'report-config' | 'add-evidence-config' = 'report-config';

  @Output() selectedTeamsChange = new EventEmitter<string[]>();

  selectedGroupName: string = '';

  constructor(public settings: SettingsService) {}

  isTeamSelected(team: string): boolean {
    return this.selectedTeams.includes(team);
  }

  toggleTeam(team: string): void {
    const idx = this.selectedTeams.indexOf(team);
    if (idx >= 0) {
      this.selectedTeams.splice(idx, 1);
    } else {
      this.selectedTeams.push(team);
    }
    this.selectedGroupName = '';
    this.selectedTeamsChange.emit([...this.selectedTeams]);
  }

  selectAllTeams(): void {
    this.selectedTeams = [...this.allTeams];
    this.selectedGroupName = '';
    this.selectedTeamsChange.emit([...this.selectedTeams]);
  }

  deselectAllTeams(): void {
    this.selectedTeams = [];
    this.selectedGroupName = '';
    this.selectedTeamsChange.emit([...this.selectedTeams]);
  }

  get groupNames(): string[] {
    return Object.keys(this.teamGroups);
  }

  selectGroup(group: string): void {
    this.selectedTeams = [...(this.teamGroups[group] || [])];
    this.selectedGroupName = group;
    this.selectedTeamsChange.emit([...this.selectedTeams]);
  }
}
