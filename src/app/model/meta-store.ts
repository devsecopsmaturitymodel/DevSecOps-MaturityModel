import { YamlService } from '../service/yaml-loader/yaml-loader.service';
import { ProgressDefinition, TeamNames, TeamGroups } from './types';
import { perfNow } from 'src/app/util/util';

export interface MetaStrings {
  allTeamsGroupName: string;
  labels: string[];
  maturityLevels: string[];
  knowledgeLabels: string[];
}
const fallbackMetaStrings: MetaStrings = {
  allTeamsGroupName: 'All',
  maturityLevels: ['Level 1', 'Level 2'],
  labels: ['Easy', 'Medium', 'Hard'],
  knowledgeLabels: ['Low', 'Medium', 'High'],
};

const LOCALSTORAGE_KEY: string = 'meta';

export class MetaStore {
  private yamlService: YamlService = new YamlService();

  public hasLocalStorage: boolean = false;

  checkForDsommUpdates: boolean = false;
  lang: string = 'en';
  strings: Record<string, MetaStrings> = { en: fallbackMetaStrings };
  progressDefinition: ProgressDefinition = {};
  teamGroups: TeamGroups = {};
  teams: TeamNames = [];
  activityFiles: string[] = [];
  teamProgressFile: string = '';
  allowChangeTeamNameInBrowser: boolean = false;

  public init(metaData: any): void {
    this.addMeta(metaData);
  }

  public addMeta(metaData: any): void {
    if (metaData) {
      // Only overwrite existing values if new values are provided
      this.checkForDsommUpdates =
        metaData.checkForDsommUpdates || this.checkForDsommUpdates || false;
      this.lang = metaData.lang || this.lang || 'en';
      this.strings = metaData.strings || this.strings || fallbackMetaStrings;
      this.progressDefinition = metaData.progressDefinition || this.progressDefinition || {};
      this.teamGroups = metaData.teamGroups || this.teamGroups || {};
      this.teams = metaData.teams || this.teams || [];
      this.activityFiles = metaData.activityFiles || this.activityFiles || [];
      this.teamProgressFile = metaData.teamProgressFile || this.teamProgressFile || '';
      if (metaData.allowChangeTeamNameInBrowser !== undefined)
        this.allowChangeTeamNameInBrowser = metaData.allowChangeTeamNameInBrowser;
    }
  }

  public updateTeamsAndGroups(teams: TeamNames, teamGroups: TeamGroups): void {
    this.teams = teams;
    this.teamGroups = teamGroups;
    this.saveToLocalStorage();
  }

  public asStorableYamlString(): string {
    return this.yamlService.stringify({ teams: this.teams, teamGroups: this.teamGroups });
  }

  public saveToLocalStorage() {
    let yamlStr: string = this.asStorableYamlString();
    localStorage.setItem(LOCALSTORAGE_KEY, yamlStr);
    this.hasLocalStorage = true;
  }

  public deleteLocalStorage() {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    this.hasLocalStorage = false;
  }

  public loadStoredMeta(): void {
    let storedMeta: string | null = localStorage.getItem(LOCALSTORAGE_KEY);
    if (storedMeta) {
      try {
        let metaData = this.yamlService.parse(storedMeta);
        this.addMeta(metaData);
        this.hasLocalStorage = true;
        console.log('Loaded stored meta from localStorage');
      } catch (error) {
        console.error('Failed to load stored meta from localStorage:', error);
      }
    }
  }
}
