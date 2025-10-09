import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { SettingsService } from '../../service/settings/settings.service';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { DataStore } from 'src/app/model/data-store';
import { MetaStore } from 'src/app/model/meta-store';
import { ProgressDefinitions } from 'src/app/model/types';
import {
  DialogInfo,
  ModalMessageComponent,
} from 'src/app/component/modal-message/modal-message.component';
import { dateStr } from 'src/app/util/util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  dataStoreMaxLevel!: number;
  selectedMaxLevel!: number;
  selectedMaxLevelCaption: String = '';
  progressDefinitionsForm!: FormGroup;
  progressDefinitions: ProgressDefinitions = {};
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
  ) {
    this.initProgressDefinitionsForm();
  }

  ngOnInit(): void {
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        this.dataStoreMaxLevel = dataStore.getMaxLevel();
        this.selectedMaxLevel = this.settingsService.getMaxLevel() || this.dataStoreMaxLevel;
        this.updateMaxLevelCaption();

        // Load progress definitions
        if (dataStore.meta) {
          this.progressDefinitions = dataStore.meta.progressDefinition;
          this.updateProgressDefinitionsForm();
        }

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
      })
      .catch(err => {
        this.modal.openDialog(new DialogInfo(err.message, 'An error occurred'));
        if (err.hasOwnProperty('stack')) {
          console.warn(err);
        }
      });
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

  updateMaxLevelCaption(): void {
    if (this.selectedMaxLevel == this.dataStoreMaxLevel) {
      this.selectedMaxLevelCaption = 'All maturity levels';
    } else {
      if (this.selectedMaxLevel == 1) this.selectedMaxLevelCaption = `Maturity level 1 only`;
      else this.selectedMaxLevelCaption = `Maturity levels 1-${this.selectedMaxLevel} only`;
    }
  }

  private initProgressDefinitionsForm(): void {
    this.progressDefinitionsForm = this.formBuilder.group({
      definitions: this.formBuilder.array([]),
    });
  }

  get definitionsFormArray() {
    return this.progressDefinitionsForm.get('definitions') as FormArray;
  }

  private updateProgressDefinitionsForm(): void {
    this.definitionsFormArray.clear();

    Object.entries(this.progressDefinitions).forEach(([key, progDef]) => {
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
    this.definitionsFormArray.push(
      this.formBuilder.group({
        key: [''],
        score: [0],
        definition: [''],
      })
    );
  }

  removeProgressDefinition(index: number): void {
    this.definitionsFormArray.removeAt(index);
    this.saveProgressDefinitions();
  }

  saveProgressDefinitions(): void {
    this.editingProgressDefinitions = false;
    // const formValue = this.definitionsFormArray.value;
    // if (formValue) {
    //   const definitions: ProgressDefinitions = {};
    //   formValue.forEach((item: { key: string; value: number; definition?: string }) => {
    //     if (item.key && !isNaN(item.value)) {
    //       definitions[item.key] = {
    //         value: item.value / 100,
    //         definition: item.definition || `Progress level ${item.value}`
    //       };
    //     }
    //   });
    //   this.progressDefinitions = definitions;
    //   this.loader.load().then((dataStore: DataStore) => {
    //     if (dataStore.meta) {
    //       dataStore.meta.saveProgressDefinition(definitions);
    //     }
    //   });
    // }
  }

  resetProgressDefinitions(): void {
    // this.loader.load().then((dataStore: DataStore) => {
    //   if (dataStore.meta) {
    //     dataStore.meta.resetProgressDefinition();
    //     this.progressDefinitions = dataStore.meta.progressDefinition;
    //     this.updateProgressDefinitionsForm();
    //   }
    // });
    this.editingProgressDefinitions = false;
  }

  toggleProgressDefinitionsEdit(): void {
    this.editingProgressDefinitions = !this.editingProgressDefinitions;
  }

  getFormGroupValue(control: AbstractControl, field: string): any {
    return (control as FormGroup).get(field)?.value;
  }
}
