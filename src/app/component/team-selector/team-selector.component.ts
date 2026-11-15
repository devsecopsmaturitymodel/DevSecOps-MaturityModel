import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TeamGroups } from '../../model/types';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-selector',
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatCheckboxModule],
})
export class TeamSelectorComponent {
  @Input() allTeams: string[] = [];
  @Input() selectedTeams: string[] = [];
  @Input() teamGroups: TeamGroups = {};
  @Input() type: 'report-config' | 'add-evidence-config' = 'report-config';

  @Output() selectedTeamsChange = new EventEmitter<string[]>();

  isTeamSelected(team: string): boolean {
    return this.selectedTeams.includes(team);
  }

  toggleTeam(team: string): void {
    const teams = [...this.selectedTeams];
    const index = teams.indexOf(team);
    if (index >= 0) {
      teams.splice(index, 1);
    } else {
      teams.push(team);
    }
    this.selectedTeamsChange.emit(teams);
  }

  selectAllTeams(): void {
    this.selectedTeamsChange.emit([...this.allTeams]);
  }

  deselectAllTeams(): void {
    this.selectedTeamsChange.emit([]);
  }

  get groupNames(): string[] {
    return Object.keys(this.teamGroups).filter(group => this.teamGroups[group].length > 0);
  }

  selectGroup(group: string): void {
    this.selectedTeamsChange.emit([...(this.teamGroups[group] || [])]);
  }

  get selectedGroupName(): string {
    const selected = new Set(this.selectedTeams);
    for (const group of this.groupNames) {
      const teams = this.teamGroups[group];
      if (teams.length === selected.size && teams.every(team => selected.has(team))) {
        return group;
      }
    }
    return '';
  }
}
