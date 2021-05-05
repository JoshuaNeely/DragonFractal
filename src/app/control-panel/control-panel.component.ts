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
  humanFacingPattern = '1, 1';
  rawPattern: Pattern = [];
  zoom = 100;
  panX = 0;
  panY = 0;
  angle = 0;

  @Output() fractalUpdate = new EventEmitter<ControlPanelEvent>();
  @Output() transformationsUpdate = new EventEmitter<ControlPanelEvent>();

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
    this.emitFractalUpdates();
  }

  updateZoom(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.zoom = newValue;
      this.emitTransformationUpdates();
    }
  }

  updatePanX(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      this.panX = eventTarget.value;
      this.emitTransformationUpdates();
    }
  }

  updatePanY(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      this.panY = eventTarget.value;
      this.emitTransformationUpdates();
    }
  }

  updateAngle(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      this.angle = eventTarget.value;
      this.emitTransformationUpdates();
    }
  }

  private emitUpdates(): void {
    this.fractalUpdate.emit({
      iterations: this.iterations,
      pattern: this.rawPattern,
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
      angle: this.angle,
    });
  }

  private emitFractalUpdates(): void {
    this.fractalUpdate.emit({
      iterations: this.iterations,
      pattern: this.rawPattern,
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
      angle: this.angle,
    });
  }

  private emitTransformationUpdates(): void {
    this.transformationsUpdate.emit({
      iterations: this.iterations,
      pattern: this.rawPattern,
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
      angle: this.angle,
    });
  }
}
