import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  dateFormats = [
    { label: 'YYYY-MM-DD', value: 'yyyy-MM-dd' },
    { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
    { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
  ];
  selectedDateFormat: string = this.dateFormats[0].value;

  constructor() { }

  ngOnInit(): void {
    // In the future, load saved settings here
  }

  saveDateFormat(): void {
    // Stub: Save the selected date format (e.g., to a service or local storage)
    // For now, just log it
    console.log('Saved date format:', this.selectedDateFormat);
  }
}
