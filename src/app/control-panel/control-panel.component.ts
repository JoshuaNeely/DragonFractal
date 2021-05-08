import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ControlPanelEvent } from './control-panel-events';
import { Pattern } from '../pattern';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {

  useColor = false;
  iterations = 12;
  humanFacingPattern = '1 1';
  rawPattern: Pattern = [];
  zoom = 100;
  panX = 0;
  panY = 0;
  angle = 0;

  @Output() fractalUpdate = new EventEmitter<ControlPanelEvent>();
  @Output() transformationsUpdate = new EventEmitter<ControlPanelEvent>();

  constructor() { }

  ngOnInit(): void {
    this.loadFromUrl();
  }

  ngAfterViewInit(): void {
    this.processPattern(this.humanFacingPattern);
    this.emitFractalUpdates();
  }

  exportToUrl(): void {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('zoom', `${this.zoom}`);
    queryParams.set('panx', `${this.panX}`);
    queryParams.set('pany', `${this.panY}`);
    queryParams.set('angle', `${this.angle}`);
    queryParams.set('iterations', `${this.iterations}`);
    queryParams.set('pattern', `${this.humanFacingPattern}`);
    location.href = '?' + queryParams.toString();
  }

  private loadFromUrl(): void {
    this.zoom = this.getNumericQueryParam('zoom', this.zoom);
    this.panX = this.getNumericQueryParam('panx', this.panX);
    this.panY = this.getNumericQueryParam('pany', this.panY);
    this.angle = this.getNumericQueryParam('angle', this.angle);
    this.iterations = this.getNumericQueryParam('iterations', this.iterations);
    this.humanFacingPattern = this.getStringQueryParam('pattern', this.humanFacingPattern);
  }

  private getNumericQueryParam(paramName: string, defaultVal: number): number {
    const queryParams = new URLSearchParams(location.search);
    const stringVal = queryParams.get(paramName) || `${defaultVal}`;
    const numericVal = parseInt(stringVal, 10);
    const returnedVal = (typeof numericVal === 'number') ? numericVal : defaultVal;
    return returnedVal;
  }

  private getStringQueryParam(paramName: string, defaultVal: string): string {
    const queryParams = new URLSearchParams(location.search);
    const stringVal = queryParams.get(paramName) || defaultVal;
    const returnedVal = (typeof stringVal === 'string') ? stringVal : defaultVal;
    return returnedVal;
  }

  updateIterations(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.iterations = newValue;
      this.emitFractalUpdates();
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

  updateColor(eventTarget: any): void {
    if (eventTarget) {
      this.useColor = eventTarget.checked;
      this.emitFractalUpdates();
    }
  }

  private emitFractalUpdates(): void {
    this.fractalUpdate.emit({
      iterations: this.iterations,
      pattern: this.rawPattern,
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
      angle: this.angle,
      color: this.useColor ? 'blue' : '',
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
      color: this.useColor ? 'blue' : '',
    });
  }
}
