// Main container for teams/groups editing
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GroupName, TeamGroups, TeamName, TeamNames } from 'src/app/model/types';
import { perfNow, renameArrayElement } from 'src/app/util/util';

enum EditMode {
  NONE,
  TEAMS,
  GROUPS,
}

export class SelectionChangedEvent {
  selectedTeam: TeamName | null = null;
  selectedGroup: GroupName | null = null;

  constructor(selectedTeam: TeamName | null, selectedGroup: GroupName | null) {
    this.selectedTeam = selectedTeam;
    this.selectedGroup = selectedGroup;
  }
}

export class TeamsGroupsChangedEvent {
  teams: TeamNames = [];
  teamGroups: TeamGroups = {};
  teamsRenamed: Record<TeamName, TeamName> = {};
}

@Component({
  selector: 'app-teams-groups-editor',
  templateUrl: './teams-groups-editor.component.html',
  styleUrls: ['./teams-groups-editor.component.css'],
})
export class TeamsGroupsEditorComponent implements OnChanges {
  Mode = EditMode;
  @Input() teams: TeamNames = [];
  @Input() teamGroups: TeamGroups = {};
  @Input() highlightedTeams: TeamName[] = [];
  @Input() highlightedGroups: GroupName[] = [];
  @Input() canEdit: boolean = true;
  @Output() selectionChanged = new EventEmitter<SelectionChangedEvent>();
  @Output() namesChanged = new EventEmitter<TeamsGroupsChangedEvent>();

  editMode: EditMode = EditMode.NONE;
  selectedTeam: string | null = null;
  selectedGroup: string | null = null;

  // Make a local copy of parent
  localCopyTeams: TeamNames = [];
  localCopyTeamsRenamed: Record<TeamName, TeamName> = {};
  localCopyTeamGroups: TeamGroups = {};

  ngOnChanges() {
    this.makeLocalCopy();

    let groups: GroupName[] = this.getGroupNames();
    if (groups.length > 0 && !this.selectedTeam && !this.selectedGroup) {
      console.log(`${perfNow()}: Teams: No team or group selected, selecting first group`);
      this.onGroupSelected(groups[0]);
    }
  }

  // Makes a local copy to allow editing without affecting the original data
  makeLocalCopy() {
    this.localCopyTeams = this.teams.slice();
    this.localCopyTeamGroups = this.cloneTeamGroups(this.teamGroups);
  }

  saveLocalCopy() {
    this.teams = this.localCopyTeams.slice();
    this.teamGroups = this.cloneTeamGroups(this.localCopyTeamGroups);
  }

  getGroupNames(): GroupName[] {
    return Object.keys(this.teamGroups);
  }

  getRelatedGroups(team: TeamName): GroupName[] {
    return Object.keys(this.localCopyTeamGroups).filter(group =>
      this.localCopyTeamGroups[group].includes(team)
    );
  }

  getRelatedTeams(group: GroupName): TeamNames {
    return this.localCopyTeamGroups[group] || [];
  }

  getOriginalTeamName(localName: TeamName): TeamName {
    if (this.teams.includes(localName)) {
      return localName;
    } else {
      let index: number = this.localCopyTeams.indexOf(localName);
      return this.teams?.[index] || '';
    }
  }

  getOriginalGroupName(localName: GroupName): GroupName {
    if (this.teamGroups.hasOwnProperty(localName)) {
      return localName;
    } else {
      // FIXME: This logic is flawed if groups have been renamed
      // let index: number = Object.keys(this.localCopyTeamGroups).indexOf(localName);
      // return Object.keys(this.teamGroups)?.[index] || '';
      return Object.keys(this.teamGroups)?.[0] || '';
    }
  }

  cloneTeamGroups(original: TeamGroups): TeamGroups {
    let clone: TeamGroups = {};
    for (let group in original) {
      clone[group] = original[group].slice();
    }
    return clone;
  }

  onTeamsEditModeChange(editing: boolean) {
    this.editMode = editing ? EditMode.TEAMS : EditMode.NONE;
  }

  onGroupsEditModeChange(editing: boolean) {
    this.editMode = editing ? EditMode.GROUPS : EditMode.NONE;
  }

  onTeamGroupToggle(team: TeamName | null, group: GroupName | null) {
    if (!team || !group) return;
    const members = this.localCopyTeamGroups[group] || [];
    if (members.includes(team)) {
      this.localCopyTeamGroups[group] = members.filter(t => t !== team);
    } else {
      this.localCopyTeamGroups[group] = [...members, team];
    }

    if (this.editMode === EditMode.TEAMS) {
      this.highlightedGroups = this.getRelatedGroups(team);
    } else if (this.editMode === EditMode.GROUPS) {
      this.highlightedTeams = this.getRelatedTeams(group);
    } else {
      console.warn(`${perfNow()}: onTeamGroupToggle called in unexpected edit mode: ${this.editMode}`); // eslint-disable-line
    }
  }

  onTeamSelected(team: string) {
    console.log(`${perfNow()}: Selecting team: ${team}`);
    this.selectedGroup = null;
    this.highlightedTeams = [];
    this.selectedTeam = team;
    this.highlightedGroups = this.getRelatedGroups(team);

    this.selectionChanged.emit(new SelectionChangedEvent(team, null));
  }

  onGroupSelected(group: string) {
    console.log(`${perfNow()}: Selecting group: ${group}`);
    this.selectedTeam = null;
    this.highlightedGroups = [];
    this.selectedGroup = group;
    this.highlightedTeams = this.getRelatedTeams(group);

    this.selectionChanged.emit(new SelectionChangedEvent(null, group));
  }

  onAddTeam() {
    let newName: string = this.findNextName(this.localCopyTeams, 'Team');
    this.localCopyTeams.push(newName);
    this.onTeamSelected(newName);
  }

  onRenameTeam(event: { oldName: string; newName: string }) {
    console.log(`${perfNow()}: Rename team: ${event.oldName} to ${event.newName}`);

    if (this.localCopyTeams.includes(event.newName)) {
      alert('Cannot have duplicate names\n\n(todo: make this alert pretty)');
      this.onTeamSelected(event.oldName);
      return;
    } else if (this.teams.includes(event.newName)) {
      alert('Cannot have old names either. Please accept the changes one by one\n\n(todo: make this alert pretty)'); // eslint-disable-line
      this.onTeamSelected(event.oldName);
      return;
    }

    this.localCopyTeams = renameArrayElement(this.localCopyTeams, event.oldName, event.newName);
    for (let group in this.localCopyTeamGroups) {
      // eslint-disable-next-line
      this.localCopyTeamGroups[group] = renameArrayElement(this.localCopyTeamGroups[group], event.oldName, event.newName);
    }
    this.onTeamSelected(event.newName);
  }

  onDeleteTeam(team: TeamName) {
    this.localCopyTeams = this.localCopyTeams.filter(t => t !== team);
    for (let group in this.localCopyTeamGroups) {
      // eslint-disable-next-line
      this.localCopyTeamGroups[group] = this.localCopyTeamGroups[group].filter(team => team !== team);  // eslint-disable-line
    }
  }

  onAddGroup() {
    let newName: string = this.findNextName(this.keys(this.localCopyTeamGroups), 'Group');
    this.localCopyTeamGroups[newName] = [];
    this.onGroupSelected(newName);
  }

  onRenameGroup(event: { oldName: string; newName: string }) {
    console.log(`${perfNow()}: Rename team: ${event.oldName} to ${event.newName}`);
    this.localCopyTeamGroups[event.newName] = this.localCopyTeamGroups[event.oldName] || [];
    delete this.localCopyTeamGroups[event.oldName];
    this.onGroupSelected(event.newName);
  }

  onDeleteGroup(group: string) {
    delete this.localCopyTeamGroups[group];
  }

  onSave() {
    console.log(`${perfNow()}: Saving teams and groups`);

    // Identify the teams that have changed names
    let teamsRenamed: Record<TeamName, TeamName> = {};
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i] !== this.localCopyTeams[i]) {
        teamsRenamed[this.teams[i]] = this.localCopyTeams[i];
      }
    }

    this.editMode = EditMode.NONE;

    // Copy the local copy to the main data
    this.saveLocalCopy();

    this.namesChanged.emit({
      teams: this.teams,
      teamGroups: this.teamGroups,
      teamsRenamed: teamsRenamed,
    });
  }

  onCancelEdit() {
    console.log(`${perfNow()}: Cancel editing teams and groups`);
    let selectedItem: string = '';

    // Determine what is currently selected
    if (this.editMode === EditMode.TEAMS) {
      selectedItem = this.getOriginalTeamName(this.selectedTeam || '');
    } else if (this.editMode === EditMode.GROUPS) {
      selectedItem = this.getOriginalGroupName(this.selectedGroup || '');
    }

    // Recreate the local copy from original values
    this.makeLocalCopy();

    // Re-select and highlight the original values
    if (this.editMode === EditMode.TEAMS) {
      this.onTeamSelected(selectedItem as TeamName);
    } else if (this.editMode === EditMode.GROUPS) {
      this.onGroupSelected(selectedItem as GroupName);
    }
    this.editMode = EditMode.NONE;
  }

  findNextName(existingNames: string[], prefix: string): string {
    let i: number = existingNames.length + 1;
    let newName: string | null = null;
    while (newName == null || existingNames.includes(newName)) {
      newName = `${prefix} ${i}`;
      i++;
    }
    return newName;
  }

  keys(obj: any): string[] {
    return Object.keys(obj);
  }
}
