import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-slider',
  templateUrl: './progress-slider.component.html',
  styleUrls: ['./progress-slider.component.css'],
})
export class ProgressSliderComponent implements OnInit {
  @Input() DBG_name: string = '';
  @Input() steps: string[] = [];
  @Input() state: string = '';
  @Input() originalState: string = '';
  @Output() progressChange = new EventEmitter<string>();

  originalValue: number = 0;
  currentValue: number = 0;

  ngOnInit() {
    this.currentValue = this.steps.indexOf(this.state);
    this.originalValue = this.steps.indexOf(this.originalState);

    if (this.currentValue === -1) this.currentValue = 0;
    if (this.originalValue === -1) this.originalValue = 0;

    if (this.originalValue <= 0) this.originalValue = this.currentValue;
  }

  getCurrent() {
    return this.steps[this.currentValue];
  }

  hasChanged(): boolean {
    return this.originalValue != this.currentValue;
  }

  onSlide(event: any) {
    console.log('Slider changed:', event);
  }

  onStepChange(step: number | null) {
    if (step !== null) {
      this.currentValue = step as number;
      this.progressChange?.emit(this.getCurrent());
    }
  }
}
