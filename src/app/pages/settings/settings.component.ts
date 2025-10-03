import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../service/settings/settings.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  maxLevels = [1, 2, 3, 4, 5];
  selectedMaxLevel: number = 5;

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

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Load saved max level
    const savedMaxLevel = this.settingsService.getMaxLevel();
    if (savedMaxLevel !== null) {
      this.selectedMaxLevel = savedMaxLevel;
    }

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
  }

  onDateFormatChange(): void {
    this.settingsService.setDateFormat(this.selectedDateFormat);
  }

  onMaxLevelChange(value: number | null): void {
    // Enforce a minimum value of 1, even if slider shows 0
    console.log('slider:', value);
    if (value == null) value = 5;
    value = Math.min(Math.max(value, 1), 5);

    this.settingsService.setMaxLevel(value);
  }
}
