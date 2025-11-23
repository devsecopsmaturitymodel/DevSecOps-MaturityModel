import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { SettingsService } from '../../service/settings/settings.service';
import { GithubService, GithubReleaseInfo } from 'src/app/service/settings/github.service';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { DataStore } from 'src/app/model/data-store';
import { ProgressDefinitions } from 'src/app/model/types';
import {
  DialogInfo,
  ModalMessageComponent,
} from 'src/app/component/modal-message/modal-message.component';
import { dateStr, deepCopy } from 'src/app/util/util';
import { MetaStore } from 'src/app/model/meta-store';
import { ProgressStore } from 'src/app/model/progress-store';

interface RemoteReleaseInfo {
  tagName: string;
  publishedAt?: Date;
  changelogUrl?: string;
  downloadUrl?: string;
}

interface RemoteReleaseCheck {
  isChecking: boolean;
  isNewerAvailable: boolean | null;
  latestRelease: RemoteReleaseInfo | null;
  latestCheckError: string | null;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  meta!: MetaStore;
  progressStore!: ProgressStore;
  dataStoreMaxLevel!: number;
  selectedMaxLevel!: number;
  selectedMaxLevelCaption: String = '';
  progressDefinitionsForm!: FormGroup;
  tempProgressDefinitions: ProgressDefinitions = {};
  editingProgressDefinitions: boolean = false;
  remoteReleaseCheck: RemoteReleaseCheck = {
    isChecking: false,
    isNewerAvailable: null,
    latestRelease: null,
    latestCheckError: null,
  };

  private BROWSER_LOCALE = 'BROWSER';
  dateFormats = [
    { label: 'Browser default', value: this.BROWSER_LOCALE },
    { value: 'en-GB' },
    { value: 'de' },
    { value: 'nl' },
    { value: 'en-US' },
    { value: 'sv' },
    { value: 'ja' },
    { value: 'hu' },
  ];
  selectedDateFormat: string = this.BROWSER_LOCALE;

  // GitHub release check state
  checkingLatest: boolean = false;
  latestReleaseInfo: GithubReleaseInfo | null = null;
  latestCheckError: string | null = null;
  isNewerAvailable: boolean | null = null;
  latestDownloadUrl: string | null = null;
  latestReleasePublishedDate: Date | null = null;

  constructor(
    private loader: LoaderService,
    private settings: SettingsService,
    private formBuilder: FormBuilder,
    public modal: ModalMessageComponent,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.initProgressDefinitionsForm();
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        this.setYamlData(dataStore);
        this.updateProgressDefinitionsForm();
      })
      .catch(err => {
        this.modal.openDialog(new DialogInfo(err.message, 'An error occurred'));
        if (err.hasOwnProperty('stack')) {
          console.warn(err);
        }
      });
  }

  async checkForLatestRelease(): Promise<void> {
    this.remoteReleaseCheck.isChecking = true;
    this.remoteReleaseCheck.isNewerAvailable = null;
    this.remoteReleaseCheck.latestRelease = null;
    this.remoteReleaseCheck.latestCheckError = null;

    try {
      this.remoteReleaseCheck.latestRelease = await this.githubService.getLatestRelease();
    } catch (err: any) {
      console.warn('Error checking latest DSOMM release', err);
      this.remoteReleaseCheck.latestCheckError = err?.message || 'Failed to check latest release';
    } finally {
      this.remoteReleaseCheck.isChecking = false;
    }

    if (!this.remoteReleaseCheck.latestRelease) {
      this.remoteReleaseCheck.latestCheckError =
        'Error: No release information received from Github';
    } else {
      const remote = this.remoteReleaseCheck.latestRelease;

      const remoteTag = (remote && remote.tagName?.replace(/^v/, '')) || '';
      const localTag = this.meta?.activityMeta?.getDsommVersion()?.replace(/^v/, '') || '';

      const remoteDate =
        remote && remote.publishedAt && new Date(remote.publishedAt.toDateString());
      const localDate = this.meta?.activityMeta?.getDsommReleaseDate();

      // Prefer version tag comparison, fallback to published date comparison
      let newer = false;
      if (remoteTag && localTag && remoteDate && localDate) {
        newer = remoteTag !== localTag || remoteDate > localDate;
      } else {
        let tmp: string[] = [];
        if (!remoteTag) tmp.push('remoteTag');
        if (!localTag) tmp.push('localTag');
        if (!remoteDate) tmp.push('remoteDate');
        if (!localDate) tmp.push('localDate');
        this.remoteReleaseCheck.latestCheckError = `Could not determine ${tmp.join(
          ', '
        )} for comparison`;
        console.warn('ERROR: ' + this.remoteReleaseCheck.latestCheckError);
      }
      this.remoteReleaseCheck.isNewerAvailable = newer;
    }
  }

  initialize(): void {
    this.selectedDateFormat = this.settings.getDateFormat() || this.BROWSER_LOCALE;

    // Init dates
    let date: Date = new Date();
    date = new Date(date.getFullYear(), 0, 31); // 31 Jan current year
    for (let format of this.dateFormats) {
      if (format.value === this.BROWSER_LOCALE) {
        format.label += ` (${dateStr(date)})`;
      } else {
        if (!format.label) format.label = dateStr(date, format.value);
      }
    }
  }

  setYamlData(dataStore: DataStore): void {
    this.dataStoreMaxLevel = dataStore.getMaxLevel();
    this.selectedMaxLevel = this.settings.getMaxLevel() || this.dataStoreMaxLevel;
    this.updateMaxLevelCaption();

    if (dataStore.progressStore) {
      this.progressStore = dataStore.progressStore;
    }

    // Load progress definitions
    if (dataStore.meta) {
      this.meta = dataStore.meta;
      this.tempProgressDefinitions = deepCopy(this.meta.progressDefinition);
    }
  }

  onDateFormatChange(): void {
    let value: any = this.selectedDateFormat == 'null' ? null : this.selectedDateFormat;
    this.settings.setDateFormat(value);
  }

  onMaxLevelChange(value: number | null): void {
    if (value == null) value = this.dataStoreMaxLevel;
    if (value == this.dataStoreMaxLevel) {
      this.settings.setMaxLevel(null);
    } else {
      this.settings.setMaxLevel(value);
    }
    this.selectedMaxLevel = value;
    this.updateMaxLevelCaption();
  }

  // === Max Level ===
  updateMaxLevelCaption(): void {
    if (this.selectedMaxLevel == this.dataStoreMaxLevel) {
      this.selectedMaxLevelCaption = 'All maturity levels';
    } else {
      if (this.selectedMaxLevel == 1) this.selectedMaxLevelCaption = `Maturity level 1 only`;
      else this.selectedMaxLevelCaption = `Maturity levels 1-${this.selectedMaxLevel} only`;
    }
  }

  // === Progress Definitions ===
  private initProgressDefinitionsForm(): void {
    this.progressDefinitionsForm = this.formBuilder.group({
      definitions: this.formBuilder.array([]),
    });
  }

  get definitionsFormArray(): FormArray {
    return this.progressDefinitionsForm.get('definitions') as FormArray;
  }

  // Return the FormGroup for a specific index in the definitions FormArray.
  getDefinitionGroup(index: number): FormGroup {
    return this.definitionsFormArray.at(index) as FormGroup;
  }

  private updateProgressDefinitionsForm(): void {
    this.definitionsFormArray.clear();

    Object.entries(this.tempProgressDefinitions).forEach(([key, progDef], index) => {
      this.definitionsFormArray.push(
        this.formBuilder.group({
          pid: [index],
          key: [key],
          score: [progDef.score * 100],
          definition: [progDef.definition],
          mandatory: progDef.score == 1 || progDef.score == 0,
        })
      );
    });
  }

  addProgressDefinition(): void {
    let index: number = this.definitionsFormArray.length - 1;
    let score: number = this.getFormGroupValue(this.definitionsFormArray.at(index - 1), 'score');
    score = Math.trunc((score + 100) / 2);

    this.definitionsFormArray.insert(
      index,
      this.formBuilder.group({
        pid: [-1], // -1 indicates a new item
        key: [''],
        score: [score],
        definition: [''],
      })
    );
  }

  removeProgressDefinition(index: number): void {
    this.definitionsFormArray.removeAt(index);
  }

  saveProgressDefinitions(): void {
    // Validate form
    if (this.progressDefinitionsForm.invalid) {
      this.progressDefinitionsForm.markAllAsTouched();

      this.modal.openDialog(
        new DialogInfo(
          'All definitions must have a name, and the score must be between 0% and 100%'
        )
      );
      return;
    }

    // Get the original keys in order
    const originalKeys = Object.keys(this.tempProgressDefinitions);

    // Build new progress definitions from form data and identify changes
    const newProgressDefinitions: ProgressDefinitions = {};
    const renamedItems: Array<{ originalKey: string; newKey: string; pid: number }> = [];

    this.definitionsFormArray.controls.forEach(control => {
      const formGroup = control as FormGroup;
      const pid = formGroup.get('pid')?.value;
      const key = formGroup.get('key')?.value;
      const score = formGroup.get('score')?.value / 100; // Convert from percentage back to decimal
      const definition = formGroup.get('definition')?.value;

      if (key && key.trim()) {
        // Only add if key is not empty
        newProgressDefinitions[key] = {
          score: score,
          definition: definition,
        };

        // Check if this is a renamed item
        if (pid >= 0 && pid < originalKeys.length) {
          const originalKey = originalKeys[pid];
          if (originalKey !== key) {
            renamedItems.push({
              originalKey: originalKey,
              newKey: key,
              pid: pid,
            });
          }
        }
      }
    });

    // Log renamed items for debugging/tracking
    if (renamedItems.length > 0) {
      console.log('Renamed progress definitions:', renamedItems);
      for (const item of renamedItems) {
        console.log(`- PID ${item.pid}: "${item.originalKey}" renamed to "${item.newKey}"`);
        this.progressStore.renameProgressTitle(item.originalKey, item.newKey);
      }
    }

    // Sort the definitions by score in ascending order
    this.tempProgressDefinitions = this.sortObjectByScore(newProgressDefinitions);

    // Save the new progress definitions to MetaStore and localStorage
    this.meta.saveProgressDefinition(this.tempProgressDefinitions);

    // Reinitialize the ProgressStore with the new definitions
    this.progressStore.init(this.tempProgressDefinitions);

    // Save progress data to localStorage
    this.progressStore.saveToLocalStorage();

    this.editingProgressDefinitions = false;
    this.updateProgressDefinitionsForm();
  }

  resetProgressDefinitions(): void {
    this.tempProgressDefinitions = deepCopy(this.meta.progressDefinition);
    this.editingProgressDefinitions = false;
    this.updateProgressDefinitionsForm();
  }

  toggleProgressDefinitionsEdit(): void {
    this.editingProgressDefinitions = !this.editingProgressDefinitions;
  }

  getFormGroupValue(control: AbstractControl, field: string): any {
    return (control as FormGroup).get(field)?.value;
  }

  /**
   * Sorts an object by the 'score' attribute of its values and returns a new object with the sorted order
   * @param obj The object to sort (where values have a 'score' property)
   * @returns A new object with entries sorted by score in ascending order
   */
  sortObjectByScore<T extends { score: number }>(obj: { [key: string]: T }): { [key: string]: T } {
    const sortedEntries = Object.entries(obj).sort(([, a], [, b]) => a.score - b.score);

    // Convert back to object
    return Object.fromEntries(sortedEntries);
  }

  dateFormat(date: Date | null | undefined): string {
    return dateStr(date, this.settings?.getDateFormat());
  }
}
