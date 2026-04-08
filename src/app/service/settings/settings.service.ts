import { Injectable } from '@angular/core';
import { MetaStrings } from 'src/app/model/meta-store';

export interface LabelParts {
  singular: string;
  plural: string;
}

export interface Labels {
  team: string;
  group: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly KEY_DATEFORMAT = 'settings.dateformat';
  private readonly KEY_MAX_LEVEL = 'settings.maxlevel';
  private readonly KEY_LABELS = 'settings.labels';

  private dateformat: string | null = null;
  private maxLevel: number | null = null;
  private _labels: Labels | null = null;

  // Server-level defaults from meta.yaml (set via initFromMeta)
  private _metaTeam: LabelParts = { singular: 'Team', plural: 'Teams' };
  private _metaGroup: LabelParts = { singular: 'Group', plural: 'Groups' };
  private _metaInitialized: boolean = false;

  constructor() {}

  // --- Meta initialization ---

  /**
   * Called by LoaderService after loading meta.yaml to set server-level defaults.
   */
  initFromMeta(metaStrings: MetaStrings): void {
    if (metaStrings.team) {
      this._metaTeam = SettingsService.parseLabelParts(metaStrings.team);
    }
    if (metaStrings.group) {
      this._metaGroup = SettingsService.parseLabelParts(metaStrings.group);
    }
    this._metaInitialized = true;
    // Reset cached labels so next get reads fresh values with new defaults
    this._labels = null;
  }

  // --- Meta defaults (for placeholder display) ---

  getMetaTeamLabel(): LabelParts {
    return this._metaTeam;
  }

  getMetaGroupLabel(): LabelParts {
    return this._metaGroup;
  }

  // --- Label parsing ---

  /**
   * Parse a |-split label string into singular and plural parts.
   * "Industry|Industries" => { singular: "Industry", plural: "Industries" }
   * "Team" => { singular: "Team", plural: "Teams" }
   */
  static parseLabelParts(value: string): LabelParts {
    if (!value || value.trim().length === 0) {
      return { singular: '', plural: '' };
    }
    const parts = value.split('|');
    const singular = parts[0].trim();
    const plural =
      parts.length > 1 && parts[1].trim().length > 0 ? parts[1].trim() : singular + 's';
    return { singular, plural };
  }

  /**
   * Encode singular + plural into a |-split string.
   * If plural === singular + 's', omit the plural part (store just singular).
   */
  static encodeLabelParts(singular: string, plural: string): string {
    if (!singular || singular.trim().length === 0) return '';
    singular = singular.trim();
    plural = plural.trim();
    if (!plural || plural === singular + 's') {
      return singular;
    }
    return `${singular}|${plural}`;
  }

  // --- Labels (consolidated) ---

  private loadLabels(): Labels {
    if (this._labels !== null) return this._labels;

    const stored = localStorage.getItem(this.KEY_LABELS);
    if (stored) {
      try {
        this._labels = JSON.parse(stored);
        return this._labels!;
      } catch {
        // Invalid JSON — ignore
      }
    }
    this._labels = { team: '', group: '' };
    return this._labels;
  }

  private saveLabels(labels: Labels): void {
    this._labels = labels;
    // Remove from storage if both are empty/default
    if (!labels.team && !labels.group) {
      localStorage.removeItem(this.KEY_LABELS);
    } else {
      localStorage.setItem(this.KEY_LABELS, JSON.stringify(labels));
    }
  }

  // --- Team label ---

  getTeamLabel(): string {
    const labels = this.loadLabels();
    if (labels.team) {
      return SettingsService.parseLabelParts(labels.team).singular;
    }
    return this._metaTeam.singular || 'Team';
  }

  getTeamLabelPlural(): string {
    const labels = this.loadLabels();
    if (labels.team) {
      return SettingsService.parseLabelParts(labels.team).plural;
    }
    return this._metaTeam.plural || 'Teams';
  }

  setTeamLabel(singular: string | null, plural?: string | null): void {
    const labels = this.loadLabels();
    const s = singular?.trim() || '';
    const p = plural?.trim() || '';

    // If the value matches the meta default, don't store it
    if (s === this._metaTeam.singular && (!p || p === this._metaTeam.plural)) {
      labels.team = '';
    } else {
      labels.team = s ? SettingsService.encodeLabelParts(s, p) : '';
    }
    this.saveLabels(labels);
  }

  // --- Group label ---

  getGroupLabel(): string {
    const labels = this.loadLabels();
    if (labels.group) {
      return SettingsService.parseLabelParts(labels.group).singular;
    }
    return this._metaGroup.singular || 'Group';
  }

  getGroupLabelPlural(): string {
    const labels = this.loadLabels();
    if (labels.group) {
      return SettingsService.parseLabelParts(labels.group).plural;
    }
    return this._metaGroup.plural || 'Groups';
  }

  setGroupLabel(singular: string | null, plural?: string | null): void {
    const labels = this.loadLabels();
    const s = singular?.trim() || '';
    const p = plural?.trim() || '';

    // If the value matches the meta default, don't store it
    if (s === this._metaGroup.singular && (!p || p === this._metaGroup.plural)) {
      labels.group = '';
    } else {
      labels.group = s ? SettingsService.encodeLabelParts(s, p) : '';
    }
    this.saveLabels(labels);
  }

  // --- Date format ---

  getDateFormat(): string | null {
    if (this.dateformat == null) {
      this.dateformat = this.getSettings(this.KEY_DATEFORMAT);
    }
    return this.dateformat;
  }

  setDateFormat(format: string | null): void {
    this.dateformat = format;
    this.saveSettings(this.KEY_DATEFORMAT, format);
  }

  // --- Max level ---

  getMaxLevel(): number | null {
    if (this.maxLevel == null) {
      this.maxLevel = this.getSettingsNumber(this.KEY_MAX_LEVEL);
    }
    return this.maxLevel;
  }

  setMaxLevel(maxLevel: number | null): void {
    this.maxLevel = maxLevel;
    this.saveSettings(this.KEY_MAX_LEVEL, maxLevel);
  }

  // --- Generic settings helpers ---

  getSettingsNumber(key: string): number | null {
    let setting: string | null = localStorage.getItem(key);
    if (setting == null) {
      return null;
    }
    return Number(setting);
  }

  getSettings(key: string): any {
    const settings = localStorage.getItem(key);
    if (settings == null) return null;
    else return settings ? JSON.parse(settings) : {};
  }

  saveSettings(key: string, settings: any): void {
    if (settings == null) {
      localStorage.removeItem(key);
    } else if (typeof settings == 'string' && settings.trim().length == 0) {
      localStorage.removeItem(key);
    } else if (settings instanceof Array && settings.length == 0) {
      localStorage.removeItem(key);
    } else if (settings instanceof Object && Object.keys(settings).length == 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(settings));
    }
  }
}
