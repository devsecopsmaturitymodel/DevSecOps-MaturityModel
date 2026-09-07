import { Injectable, signal, computed } from '@angular/core';
import { TeamGroups, TeamNames } from '../model/types';

@Injectable({ providedIn: 'root' })
export class TeamSelectionService {
  readonly allTeams = signal<string[]>([]);
  readonly teamGroups = signal<TeamGroups>({});
  readonly selectedTeams = signal<string[]>([]);
  readonly initialised = signal<boolean>(false);

  readonly selectedGroupName = computed<string>(() => {
    const selected = new Set(this.selectedTeams());
    if (selected.size === 0) return '';

    const groups = this.teamGroups();
    for (const [name, members] of Object.entries(groups)) {
      if (
        members.length > 0 &&
        members.length === selected.size &&
        members.every(t => selected.has(t))
      ) {
        return name;
      }
    }
    return '';
  });

  readonly isAllSelected = computed<boolean>(() => {
    const selected = this.selectedTeams();
    const allTeams = this.allTeams();
    return (
      selected.length === 0 ||
      (allTeams.length > 0 &&
        selected.length === allTeams.length &&
        allTeams.every(team => selected.includes(team)))
    );
  });

  readonly effectiveTeams = computed<string[]>(() => {
    const selected = this.selectedTeams();
    return selected.length === 0 ? this.allTeams() : selected;
  });

  init(teams: TeamNames, groups: TeamGroups): void {
    this.allTeams.set([...teams]);
    this.teamGroups.set({ ...groups });

    this.initialised.set(true);

    const validTeams = this.selectedTeams().filter(t => teams.includes(t));
    if (validTeams.length !== this.selectedTeams().length) {
      this.setTeams(validTeams);
    }
  }

  setTeams(teams: string[]): void {
    this.selectedTeams.set([...teams]);
  }

  toggleTeam(team: string): void {
    const current = this.selectedTeams();
    const idx = current.indexOf(team);
    const next = [...current];
    if (idx >= 0) {
      next.splice(idx, 1);
    } else {
      next.push(team);
    }
    this.selectedTeams.set(next);
  }

  selectGroup(groupName: string): void {
    const members = this.teamGroups()[groupName];
    if (members) {
      this.selectedTeams.set([...members]);
    }
  }

  selectAll(): void {
    this.selectedTeams.set([]);
  }

  deselectAll(): void {
    this.selectedTeams.set([]);
  }
}
