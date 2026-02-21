export interface ActivityAttributeVisibility {
  showDescription: boolean;
  showRisk: boolean;
  showMeasure: boolean;
  showAssessment: boolean;
  showImplementationGuide: boolean;
  showDifficulty: boolean;
  showUsefulness: boolean;
  showDependencies: boolean;
  showTools: boolean;
  showMapping: boolean;
  showImplementedBy: boolean;
  showTags: boolean;
  showComments: boolean;
}

export interface ReportConfig {
  excludedLevels: number[];
  excludedDimensions: string[];
  excludedSubdimensions: string[];
  excludedActivities: string[];
  attributes: ActivityAttributeVisibility;
}

const STORAGE_KEY = 'ReportConfig';

export function getDefaultReportConfig(): ReportConfig {
  return {
    excludedLevels: [],
    excludedDimensions: [],
    excludedSubdimensions: [],
    excludedActivities: [],
    attributes: {
      showDescription: true,
      showRisk: false,
      showMeasure: false,
      showAssessment: false,
      showImplementationGuide: false,
      showDifficulty: false,
      showUsefulness: false,
      showDependencies: false,
      showTools: false,
      showMapping: false,
      showImplementedBy: true,
      showTags: false,
      showComments: false,
    },
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
        excludedLevels: parsed.excludedLevels ?? defaults.excludedLevels,
        excludedDimensions: parsed.excludedDimensions ?? defaults.excludedDimensions,
        excludedSubdimensions: parsed.excludedSubdimensions ?? defaults.excludedSubdimensions,
        excludedActivities: parsed.excludedActivities ?? defaults.excludedActivities,
        attributes: { ...defaults.attributes, ...(parsed.attributes ?? {}) },
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
