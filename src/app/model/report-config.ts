export type ColumnGrouping = 'byProgress' | 'byTeam';

export interface ReportConfig {
  columnGrouping: ColumnGrouping;
  descriptionWordCap: number;
  selectedTeams: string[];
  excludedDimensions: string[];
  excludedSubdimensions: string[];
  excludedActivities: string[];
  showDescription: boolean;
}

const STORAGE_KEY = 'ReportConfig';
const DEFAULT_DESCRIPTION_WORD_CAP = 25;
export const MAX_DESCRIPTION_WORD_CAP = 600;

export function getDefaultReportConfig(): ReportConfig {
  return {
    columnGrouping: 'byProgress',
    descriptionWordCap: DEFAULT_DESCRIPTION_WORD_CAP,
    selectedTeams: [],
    excludedDimensions: [],
    excludedSubdimensions: [],
    excludedActivities: [],
    showDescription: true,
  };
}

export function getReportConfig(): ReportConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ReportConfig>;
      // Merge with defaults to ensure all keys exist
      const defaults = getDefaultReportConfig();
      return {
        columnGrouping: parsed.columnGrouping ?? defaults.columnGrouping,
        descriptionWordCap: parsed.descriptionWordCap ?? defaults.descriptionWordCap,
        selectedTeams: parsed.selectedTeams ?? defaults.selectedTeams,
        excludedDimensions: parsed.excludedDimensions ?? defaults.excludedDimensions,
        excludedSubdimensions: parsed.excludedSubdimensions ?? defaults.excludedSubdimensions,
        excludedActivities: parsed.excludedActivities ?? defaults.excludedActivities,
        showDescription: parsed.showDescription ?? defaults.showDescription,
      };
    }
  } catch (e) {
    console.error('Error reading ReportConfig from localStorage:', e);
  }
  return getDefaultReportConfig();
}

export function saveReportConfig(config: ReportConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving ReportConfig to localStorage:', e);
  }
}
