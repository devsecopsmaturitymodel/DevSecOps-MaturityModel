export type TeamGroups = Record<GroupName, TeamNames>;
export type TeamNames = string[];

export interface TeamProgressFile {
  progress: Progress;
}

export type ProgressDefinition = Record<ProgressTitle, number>;
export type Progress = Record<Uuid, ActivityProgress>;
export type ActivityProgress = Record<TeamName, TeamProgress>;
export type TeamProgress = Record<ProgressTitle, Date>;
export type Uuid = string;
export type TeamName = string;
export type GroupName = string;
export type ProgressTitle = string;
