import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SettingsService } from '../../service/settings/settings.service';
import { GithubService } from 'src/app/service/settings/github.service';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

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

interface ProgressDefinitionForm {
  pid: FormControl<number>;
  key: FormControl<string>;
  score: FormControl<number>;
  definition: FormControl<string>;
  mandatory?: FormControl<boolean>;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TopHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    TextFieldModule,
    MatProgressSpinnerModule,
  ],
})
export class SettingsComponent implements OnInit {
  private loader = inject(LoaderService);
  private settings = inject(SettingsService);
  private formBuilder = inject(FormBuilder);
  modal = inject(ModalMessageComponent);
  private githubService = inject(GithubService);

  meta = signal<MetaStore | null>(null);
  progressStore!: ProgressStore;
  dataStoreMaxLevel = signal(5);
  selectedMaxLevel = signal(5);
  selectedMaxLevelCaption = signal('');
  progressDefinitionsForm!: FormGroup<{
    definitions: FormArray<FormGroup<ProgressDefinitionForm>>;
  }>;
  tempProgressDefinitions: ProgressDefinitions = {};
  editingProgressDefinitions = signal(false);
  remoteReleaseCheck = signal<RemoteReleaseCheck>({
    isChecking: false,
    isNewerAvailable: null,
    latestRelease: null,
    latestCheckError: null,
  });

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
  selectedDateFormat = signal(this.BROWSER_LOCALE);

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
    this.remoteReleaseCheck.update(state => ({
      ...state,
      isChecking: true,
      isNewerAvailable: null,
      latestRelease: null,
      latestCheckError: null,
    }));

    let latestRelease: RemoteReleaseInfo | null = null;
    try {
      latestRelease = await this.githubService.getLatestRelease();
    } catch (err: any) {
      console.warn('Error checking latest DSOMM release', err);
      this.remoteReleaseCheck.update(state => ({
        ...state,
        isChecking: false,
        latestCheckError: err?.message || 'Failed to check latest release',
      }));
      return;
    }

    if (!latestRelease) {
      this.remoteReleaseCheck.update(state => ({
        ...state,
        isChecking: false,
        latestCheckError: 'Error: No release information received from Github',
      }));
    } else {
      const remote = latestRelease;
      const meta = this.meta();

      const remoteTag = (remote && remote.tagName?.replace(/^v/, '')) || '';
      const localTag = meta?.activityMeta?.getDsommVersion()?.replace(/^v/, '') || '';

      const remoteDate =
        remote && remote.publishedAt && new Date(remote.publishedAt.toDateString());
      const localDate = meta?.activityMeta?.getDsommReleaseDate();

      // Prefer version tag comparison, fallback to published date comparison
      let newer = false;
      let checkError: string | null = null;
      if (remoteTag && localTag && remoteDate && localDate) {
        newer = remoteTag !== localTag || remoteDate > localDate;
      } else {
        newer = true; // Show download link if we cannot compare

        // Build error message
        let tmp: string[] = [];
        if (!remoteTag) tmp.push('DSOMM model version');
        if (!localTag) tmp.push('local model version');
        if (!remoteDate) tmp.push('DSOMM model date');
        if (!localDate) tmp.push('local model date');
        checkError = `Could not determine ${tmp.join(', ')}`;
        console.warn('ERROR: ' + checkError);
      }
      this.remoteReleaseCheck.set({
        isChecking: false,
        isNewerAvailable: newer,
        latestRelease: remote,
        latestCheckError: checkError,
      });
    }
  }

  initialize(): void {
    this.selectedDateFormat.set(this.settings.getDateFormat() || this.BROWSER_LOCALE);

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
    this.dataStoreMaxLevel.set(dataStore.getMaxLevel());
    this.selectedMaxLevel.set(this.settings.getMaxLevel() || this.dataStoreMaxLevel());
    this.updateMaxLevelCaption();

    if (dataStore.progressStore) {
      this.progressStore = dataStore.progressStore;
    }

    // Load progress definitions
    if (dataStore.meta) {
      this.meta.set(dataStore.meta);
      this.tempProgressDefinitions = deepCopy(dataStore.meta.progressDefinition);
    }
  }

  onDateFormatChange(): void {
    const fmt = this.selectedDateFormat();
    let value: any = fmt == 'null' ? null : fmt;
    this.settings.setDateFormat(value);
  }

  onMaxLevelChange(value: number | null): void {
    const maxLevel = this.dataStoreMaxLevel();
    if (value == null) value = maxLevel;
    if (value == maxLevel) {
      this.settings.setMaxLevel(null);
    } else {
      this.settings.setMaxLevel(value);
    }
    this.selectedMaxLevel.set(value);
    this.updateMaxLevelCaption();
  }

  // === Max Level ===
  updateMaxLevelCaption(): void {
    const level = this.selectedMaxLevel();
    const maxLevel = this.dataStoreMaxLevel();
    if (level == maxLevel) {
      this.selectedMaxLevelCaption.set('All maturity levels');
    } else {
      if (level == 1) this.selectedMaxLevelCaption.set('Maturity level 1 only');
      else this.selectedMaxLevelCaption.set(`Maturity levels 1-${level} only`);
    }
  }

  // === Progress Definitions ===
  private initProgressDefinitionsForm(): void {
    this.progressDefinitionsForm = this.formBuilder.group({
      definitions: this.formBuilder.array<FormGroup<ProgressDefinitionForm>>([]),
    });
  }

  get definitionsFormArray(): FormArray<FormGroup<ProgressDefinitionForm>> {
    return this.progressDefinitionsForm.controls.definitions;
  }

  // Return the FormGroup for a specific index in the definitions FormArray.
  getDefinitionGroup(index: number): FormGroup<ProgressDefinitionForm> {
    return this.definitionsFormArray.at(index);
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
          mandatory: [progDef.score == 1 || progDef.score == 0],
        }) as unknown as FormGroup<ProgressDefinitionForm>
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
      }) as unknown as FormGroup<ProgressDefinitionForm>
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
      const formGroup = control;
      const pid = formGroup.controls.pid.value;
      const key = formGroup.controls.key.value;
      const score = formGroup.controls.score.value / 100; // Convert from percentage back to decimal
      const definition = formGroup.controls.definition.value;

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
    this.meta()!.saveProgressDefinition(this.tempProgressDefinitions);

    // Reinitialize the ProgressStore with the new definitions
    this.progressStore.init(this.tempProgressDefinitions);

    // Save progress data to localStorage
    this.progressStore.saveToLocalStorage();

    this.editingProgressDefinitions.set(false);
    this.updateProgressDefinitionsForm();
  }

  resetProgressDefinitions(): void {
    this.tempProgressDefinitions = deepCopy(this.meta()!.progressDefinition);
    this.editingProgressDefinitions.set(false);
    this.updateProgressDefinitionsForm();
  }

  toggleProgressDefinitionsEdit(): void {
    this.editingProgressDefinitions.update(v => !v);
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
