import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../service/settings/settings.service';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { DataStore } from 'src/app/model/data-store';
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
    public modal: ModalMessageComponent
  ) {}

  ngOnInit(): void {
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        this.dataStoreMaxLevel = dataStore.getMaxLevel();
        this.selectedMaxLevel = this.settingsService.getMaxLevel() || this.dataStoreMaxLevel;
        this.updateMaxLevelCaption();

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
}
