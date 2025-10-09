import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { SettingsService } from '../../service/settings/settings.service';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { DataStore } from 'src/app/model/data-store';
import { ProgressDefinitions } from 'src/app/model/types';
import {
  DialogInfo,
  ModalMessageComponent,
} from 'src/app/component/modal-message/modal-message.component';
import { dateStr, deepCopy } from 'src/app/util/util';
import { MetaStore } from 'src/app/model/meta-store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  meta!: MetaStore;
  dataStoreMaxLevel!: number;
  selectedMaxLevel!: number;
  selectedMaxLevelCaption: String = '';
  progressDefinitionsForm!: FormGroup;
  tempProgressDefinitions: ProgressDefinitions = {};
  editingProgressDefinitions: boolean = false;

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

  constructor(
    private loader: LoaderService,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    public modal: ModalMessageComponent
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

  initialize(): void {
    this.selectedDateFormat = this.settingsService.getDateFormat() || this.BROWSER_LOCALE;

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
    this.selectedMaxLevel = this.settingsService.getMaxLevel() || this.dataStoreMaxLevel;
    this.updateMaxLevelCaption();

    // Load progress definitions
    if (dataStore.meta) {
      this.meta = dataStore.meta;
      this.tempProgressDefinitions = deepCopy(this.meta.progressDefinition);
    }
  }

  onDateFormatChange(): void {
    let value: any = this.selectedDateFormat == 'null' ? null : this.selectedDateFormat;
    this.settingsService.setDateFormat(value);
  }

  onMaxLevelChange(value: number | null): void {
    if (value == null) value = this.dataStoreMaxLevel;
    if (value == this.dataStoreMaxLevel) {
      this.settingsService.setMaxLevel(null);
    } else {
      this.settingsService.setMaxLevel(value);
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

    Object.entries(this.tempProgressDefinitions).forEach(([key, progDef]) => {
      this.definitionsFormArray.push(
        this.formBuilder.group({
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
    if (this.progressDefinitionsForm.invalid) {
      this.progressDefinitionsForm.markAllAsTouched();
      
      this.modal.openDialog(new DialogInfo(
        'All definitions must have a name, and the score must be between 0% and 100%'
      ));
      
      return; // Exit early if form is invalid
    }

    // Build new progress definitions from form data
    const newProgressDefinitions: ProgressDefinitions = {};
    
    this.definitionsFormArray.controls.forEach((control) => {
      const formGroup = control as FormGroup;
      const key = formGroup.get('key')?.value;
      const score = formGroup.get('score')?.value / 100; // Convert from percentage back to decimal
      const definition = formGroup.get('definition')?.value;
      
      if (key && key.trim()) { // Only add if key is not empty
        newProgressDefinitions[key] = {
          score: score,
          definition: definition
        };
      }
    });

    // Sort the definitions by score in ascending order
    this.tempProgressDefinitions = this.sortObjectByScore(newProgressDefinitions);
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
}
