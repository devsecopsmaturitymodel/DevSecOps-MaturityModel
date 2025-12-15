export type TeamGroups = Record<GroupName, TeamNames>;
export type TeamNames = string[];

export interface TeamProgressFile {
  progress: Progress;
}

export interface ProgressDefinition {
  score: number;
  definition: string;
}

export type ProgressDefinitions = Record<ProgressTitle, ProgressDefinition>;
export type Progress = Record<Uuid, ActivityProgress>;
export type ActivityProgress = Record<TeamName, TeamProgress>;
export type TeamProgress = Record<ProgressTitle, Date>;
export type Uuid = string;
export type TeamName = string;
export type GroupName = string;
export type ProgressTitle = string;
