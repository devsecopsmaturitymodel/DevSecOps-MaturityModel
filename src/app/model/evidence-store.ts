import { YamlService } from '../service/yaml-loader/yaml-loader.service';
import { Uuid } from './types';

export interface EvidenceAttachment {
  type: string; // e.g. 'document', 'image', 'link'
  externalLink: string; // URL
}

export interface EvidenceEntry {
  id: string; // stable UUID for this entry
  teams: string[];
  title: string;
  evidenceRecorded: string; // ISO date string
  reviewer?: string;
  description: string;
  attachment?: EvidenceAttachment[];
}

export type EvidenceData = Record<Uuid, EvidenceEntry[]>;

const LOCALSTORAGE_KEY: string = 'evidence';

export class EvidenceStore {
  private yamlService: YamlService = new YamlService();
  private _evidence: EvidenceData = {};

  // ─── Lifecycle ────────────────────────────────────────────

  public initFromLocalStorage(): void {
    const stored = this.retrieveStoredEvidence();
    if (stored) {
      this.addEvidenceData(stored);
    }
  }

  // ─── Accessors ────────────────────────────────────────────

  public getEvidenceData(): EvidenceData {
    return this._evidence;
  }

  public getEvidence(activityUuid: Uuid): EvidenceEntry[] {
    return this._evidence[activityUuid] || [];
  }

  public hasEvidence(activityUuid: Uuid): boolean {
    return (this._evidence[activityUuid]?.length || 0) > 0;
  }

  public getEvidenceCount(activityUuid: Uuid): number {
    return this._evidence[activityUuid]?.length ?? 0;
  }

  public getTotalEvidenceCount(): number {
    let count = 0;
    for (const uuid in this._evidence) {
      count += this._evidence[uuid].length;
    }
    return count;
  }

  public getActivityUuidsWithEvidence(): Uuid[] {
    return Object.keys(this._evidence).filter(uuid => this._evidence[uuid].length > 0);
  }

  // ─── Mutators ────────────────────────────────────────────

  public addEvidenceData(newEvidence: EvidenceData): void {
    if (!newEvidence) return;

    for (const activityUuid in newEvidence) {
      if (!this._evidence[activityUuid]) {
        this._evidence[activityUuid] = [];
      }

      const newEntries = newEvidence[activityUuid];
      if (Array.isArray(newEntries)) {
        for (const entry of newEntries) {
          if (!this.isDuplicateEntry(activityUuid, entry)) {
            this._evidence[activityUuid].push(entry);
          }
        }
      }
    }
  }

  public replaceEvidenceData(data: EvidenceData): void {
    this._evidence = data;
    this.saveToLocalStorage();
  }

  public addEvidence(activityUuid: Uuid, entry: EvidenceEntry): void {
    if (!this._evidence[activityUuid]) {
      this._evidence[activityUuid] = [];
    }
    this._evidence[activityUuid].push(entry);
    this.saveToLocalStorage();
  }

  public updateEvidence(
    activityUuid: Uuid,
    entryId: string,
    updatedEntry: Partial<EvidenceEntry>
  ): void {
    const entries = this._evidence[activityUuid];
    if (!entries) {
      console.warn(`No evidence found for activity ${activityUuid}`);
      return;
    }
    const index = entries.findIndex(e => e.id === entryId);
    if (index === -1) {
      console.warn(`Cannot find evidence with id ${entryId} for activity ${activityUuid}`);
      return;
    }
    // Immutable update for Angular change detection
    entries[index] = { ...entries[index], ...updatedEntry };
    this.saveToLocalStorage();
  }

  public deleteEvidence(activityUuid: Uuid, entryId: string): void {
    const entries = this._evidence[activityUuid];
    if (!entries) {
      console.warn(`No evidence found for activity ${activityUuid}`);
      return;
    }
    const index = entries.findIndex(e => e.id === entryId);
    if (index === -1) {
      console.warn(`Cannot find evidence with id ${entryId} for activity ${activityUuid}`);
      return;
    }
    entries.splice(index, 1);

    if (entries.length === 0) {
      delete this._evidence[activityUuid];
    }
    this.saveToLocalStorage();
  }

  public renameTeam(oldName: string, newName: string): void {
    console.log(`Renaming team '${oldName}' to '${newName}' in evidence store`);
    for (const uuid in this._evidence) {
      this._evidence[uuid].forEach(entry => {
        entry.teams = entry.teams.map(t => (t === oldName ? newName : t));
      });
    }
    this.saveToLocalStorage();
  }

  // ─── Serialization ──────────────────────────────────────

  public asYamlString(): string {
    return this.yamlService.stringify({ evidence: this._evidence });
  }

  public saveToLocalStorage(): void {
    const yamlStr = this.asYamlString();
    localStorage.setItem(LOCALSTORAGE_KEY, yamlStr);
  }

  public deleteBrowserStoredEvidence(): void {
    console.log('Deleting evidence from browser storage');
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  public retrieveStoredEvidenceYaml(): string | null {
    return localStorage.getItem(LOCALSTORAGE_KEY);
  }

  public retrieveStoredEvidence(): EvidenceData | null {
    const yamlStr = this.retrieveStoredEvidenceYaml();
    if (!yamlStr) return null;

    const parsed = this.yamlService.parse(yamlStr);
    return parsed?.evidence ?? null;
  }

  // ─── Helpers ─────────────────────────────────────────────

  private isDuplicateEntry(activityUuid: Uuid, entry: EvidenceEntry): boolean {
    const existing = this._evidence[activityUuid];
    if (!existing) return false;
    return existing.some(e => e.id === entry.id);
  }

  public static todayDateString(): string {
    const now = new Date();
    return now.toISOString().substring(0, 10);
  }

  // to be used when creating new evidence entries to ensure they have a stable UUID
  public static generateId(): string {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
