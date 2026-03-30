export type ColumnGrouping = 'byProgress' | 'byTeam';

export interface ActivityAttributes {
  showUuid: boolean;
  showDescription: boolean;
  showRisk: boolean;
  showMeasure: boolean;
  showDifficultyOfImplementation: boolean;
  showUsefulness: boolean;
  showImplementation: boolean;
  showDependsOn: boolean;
  showReferences: boolean;
  showReferencesIso27001_2017: boolean;
  showReferencesIso27001_2022: boolean;
  showReferencesSamm2: boolean;
  showReferencesOpenCRE: boolean;
  showEvidence: boolean;
  showEvidenceTitle: boolean;
  showEvidenceDescription: boolean;
  showEvidenceDate: boolean;
  showEvidenceReviewer: boolean;
  showEvidenceAttachments: boolean;
  showTags: boolean;
}

export interface ReportConfig {
  columnGrouping: ColumnGrouping;
  descriptionWordCap: number;
  selectedTeams: string[];
  excludedDimensions: string[];
  excludedSubdimensions: string[];
  excludedActivities: string[];
  activityAttributes: ActivityAttributes;
}

const STORAGE_KEY = 'ReportConfig';
const DEFAULT_DESCRIPTION_WORD_CAP = 25;
export const MAX_DESCRIPTION_WORD_CAP = 600;

export function getDefaultActivityAttributes(): ActivityAttributes {
  return {
    showUuid: false,
    showDescription: true,
    showRisk: false,
    showMeasure: false,
    showDifficultyOfImplementation: false,
    showUsefulness: false,
    showImplementation: false,
    showDependsOn: false,
    showReferences: false,
    showReferencesIso27001_2017: true,
    showReferencesIso27001_2022: true,
    showReferencesSamm2: true,
    showReferencesOpenCRE: true,
    showEvidence: false,
    showEvidenceTitle: true,
    showEvidenceDescription: false,
    showEvidenceDate: false,
    showEvidenceReviewer: false,
    showEvidenceAttachments: true,
    showTags: false,
  };
}

export function getDefaultReportConfig(): ReportConfig {
  return {
    columnGrouping: 'byProgress',
    descriptionWordCap: DEFAULT_DESCRIPTION_WORD_CAP,
    selectedTeams: [],
    excludedDimensions: [],
    excludedSubdimensions: [],
    excludedActivities: [],
    activityAttributes: getDefaultActivityAttributes(),
  };
}

export function getReportConfig(): ReportConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ReportConfig>;
      const defaults = getDefaultReportConfig();
      const defaultAttrs = getDefaultActivityAttributes();

      const parsedAttrs = (parsed.activityAttributes ??
        parsed['activityAtrributes' as keyof ReportConfig] ??
        {}) as Partial<ActivityAttributes>;

      const legacyShowDesc = (parsed as any).showDescription;

      const activityAttributes: ActivityAttributes = {
        showUuid: parsedAttrs.showUuid ?? defaultAttrs.showUuid,
        showDescription:
          parsedAttrs.showDescription ?? legacyShowDesc ?? defaultAttrs.showDescription,
        showRisk: parsedAttrs.showRisk ?? defaultAttrs.showRisk,
        showMeasure: parsedAttrs.showMeasure ?? defaultAttrs.showMeasure,
        showDifficultyOfImplementation:
          parsedAttrs.showDifficultyOfImplementation ?? defaultAttrs.showDifficultyOfImplementation,
        showUsefulness: parsedAttrs.showUsefulness ?? defaultAttrs.showUsefulness,
        showImplementation: parsedAttrs.showImplementation ?? defaultAttrs.showImplementation,
        showDependsOn: parsedAttrs.showDependsOn ?? defaultAttrs.showDependsOn,
        showReferences: parsedAttrs.showReferences ?? defaultAttrs.showReferences,
        showReferencesIso27001_2017:
          parsedAttrs.showReferencesIso27001_2017 ?? defaultAttrs.showReferencesIso27001_2017,
        showReferencesIso27001_2022:
          parsedAttrs.showReferencesIso27001_2022 ?? defaultAttrs.showReferencesIso27001_2022,
        showReferencesSamm2: parsedAttrs.showReferencesSamm2 ?? defaultAttrs.showReferencesSamm2,
        showReferencesOpenCRE:
          parsedAttrs.showReferencesOpenCRE ?? defaultAttrs.showReferencesOpenCRE,
        showEvidence: parsedAttrs.showEvidence ?? defaultAttrs.showEvidence,
        showEvidenceTitle: parsedAttrs.showEvidenceTitle ?? defaultAttrs.showEvidenceTitle,
        showEvidenceDescription:
          parsedAttrs.showEvidenceDescription ?? defaultAttrs.showEvidenceDescription,
        showEvidenceDate: parsedAttrs.showEvidenceDate ?? defaultAttrs.showEvidenceDate,
        showEvidenceReviewer: parsedAttrs.showEvidenceReviewer ?? defaultAttrs.showEvidenceReviewer,
        showEvidenceAttachments:
          parsedAttrs.showEvidenceAttachments ?? defaultAttrs.showEvidenceAttachments,
        showTags: parsedAttrs.showTags ?? defaultAttrs.showTags,
      };

      return {
        columnGrouping: parsed.columnGrouping ?? defaults.columnGrouping,
        descriptionWordCap: parsed.descriptionWordCap ?? defaults.descriptionWordCap,
        selectedTeams: parsed.selectedTeams ?? defaults.selectedTeams,
        excludedDimensions: parsed.excludedDimensions ?? defaults.excludedDimensions,
        excludedSubdimensions: parsed.excludedSubdimensions ?? defaults.excludedSubdimensions,
        excludedActivities: parsed.excludedActivities ?? defaults.excludedActivities,
        activityAttributes,
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
