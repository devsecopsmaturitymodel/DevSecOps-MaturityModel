import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly KEY_DATEFORMAT = 'settings.dateformat';
  private readonly KEY_MAX_LEVEL = 'settings.maxlevel';

  private dateformat: string | null = null;
  private maxLevel: number | null = null;

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
