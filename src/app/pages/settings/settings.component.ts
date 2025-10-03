import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../service/settings/settings.service';
import { MatSliderChange } from '@angular/material/slider';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { DataStore } from 'src/app/model/data-store';
import {
  DialogInfo,
  ModalMessageComponent,
} from 'src/app/component/modal-message/modal-message.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  dataStoreMaxLevel!: number;
  selectedMaxLevel!: number;
  selectedMaxLevelCaption: String = '';

  dateFormats = [
    { label: 'Browser default (¤¤¤)', value: 'BROWSER' },
    { value: 'en-GB' },
    { value: 'de' },
    { value: 'nl' },
    { value: 'en-US' },
    { value: 'sv' },
    { value: 'ja' },
    { value: 'hu' },
  ];
  selectedDateFormat: string = this.dateFormats[0].value;

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

        // Init dates
        let date: Date = new Date();
        date = new Date(date.getFullYear(), 0, 31); // 31 Jan current year
        for (let format of this.dateFormats) {
          if (format.value === 'BROWSER') {
            format.label = format.label!.replace('¤¤¤', date.toLocaleDateString());
          } else {
            if (!format.label) format.label = date.toLocaleDateString(format.value);
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
    this.settingsService.setDateFormat(this.selectedDateFormat);
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
