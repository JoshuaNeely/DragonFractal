import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ControlPanelEvent } from './control-panel-events';
import { Pattern } from '../pattern';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {

  iterations = 6;
  drawStyle: 'lines' | 'triangles' = 'lines';
  pattern: Pattern = [1, 1, -1];

  @Output() controlChangeOutput = new EventEmitter<ControlPanelEvent>();

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
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
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;

      const newPattern = [];
      for (let i = 0; i < newValue; i++) {
        newPattern.push(-1);
      }
      newPattern.push(1);
      this.pattern = newPattern;

      this.emitUpdates();
    }
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
          pattern: this.pattern,
          drawStyle: this.drawStyle,
      });
  }
}
