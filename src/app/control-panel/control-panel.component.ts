import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ControlPanelEvent } from './control-panel-events';
import { Pattern } from '../pattern';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {

  iterations = 12;
  drawStyle: 'lines' | 'triangles' = 'lines';
  humanFacingPattern = '1, 1';
  rawPattern: Pattern = [];

  @Output() controlChangeOutput = new EventEmitter<ControlPanelEvent>();

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.processPattern(this.humanFacingPattern);
    this.emitUpdates();
  }

  updateIterations(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.iterations = newValue;
      this.emitUpdates();
    }
  }


  updatePattern(eventTarget: any): void {
    if (eventTarget && eventTarget.value
        && eventTarget.validity.valid) {
      const rawValue = eventTarget.value;
      this.humanFacingPattern = rawValue;

      this.processPattern(rawValue);
    }
  }

  private processPattern(patternString: string): void {
    const newPattern: number[] = [];
    const onlyDigits = patternString.replace(/\D/g, '');
    const digits = onlyDigits.split('');
    for (const [index, digit] of digits.entries()) {
      const term = (index % 2) ? 1 : -1;
      for (let i = 0; i < Number(digit); i++) {
        newPattern.push(term);
      }
    }
    this.rawPattern = newPattern;
    this.emitUpdates();
  }

  updateDrawStyle(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.drawStyle = newValue;
      this.emitUpdates();
    }
  }

  private emitUpdates(): void {
      this.controlChangeOutput.emit({
          iterations: this.iterations,
          pattern: this.rawPattern,
          drawStyle: this.drawStyle,
      });
  }
}
