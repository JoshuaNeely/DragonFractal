import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ControlPanelEvent, AnimationUpdate } from '../control-panel/control-panel-events';
import { Pattern } from '../pattern';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {

  humanFacingColors = 'blue green';
  colors: string[] = [];
  iterations = 0;
  animation = '2 0 15 true';
  humanFacingPattern = '1 1';
  rawPattern: Pattern = [];
  zoom = 100;
  panX = 0;
  panY = 0;
  angle = 0;

  interactive = true;
  animationTimeout !: number;

  @Output() fractalUpdate = new EventEmitter<ControlPanelEvent>();
  @Output() transformationsUpdate = new EventEmitter<ControlPanelEvent>();
  @Output() animationUpdate = new EventEmitter<AnimationUpdate>();

  constructor() { }

  ngOnInit(): void {
    this.loadFromUrl();
  }

  ngAfterViewInit(): void {
    this.processPattern(this.humanFacingPattern);
    this.processColorInput();
    this.processAnimation();
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
    queryParams.set('colors', `${this.humanFacingColors}`);
    queryParams.set('animation', `${this.animation}`);
    location.href = '?' + queryParams.toString();
  }

  toggleInteractive(): void {
    this.interactive = !this.interactive;
  }

  resetParameters(): void {
    location.href = '';
  }

  private loadFromUrl(): void {
    this.zoom = this.getNumericQueryParam('zoom', this.zoom);
    this.panX = this.getNumericQueryParam('panx', this.panX);
    this.panY = this.getNumericQueryParam('pany', this.panY);
    this.angle = this.getNumericQueryParam('angle', this.angle);
    this.iterations = this.getNumericQueryParam('iterations', this.iterations);
    this.humanFacingPattern = this.getStringQueryParam('pattern', this.humanFacingPattern);
    this.humanFacingColors = this.getStringQueryParam('colors', this.humanFacingColors);
    this.animation = this.getStringQueryParam('animation', this.animation);
    this.interactive = this.getBooleanQueryParam('interactive', true);
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

  private getBooleanQueryParam(paramName: string, defaultVal: boolean): boolean {
    const queryParams = new URLSearchParams(location.search);
    const stringVal = queryParams.get(paramName) || defaultVal;
    return !(stringVal === 'false');
  }

  updateIterations(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.iterations = newValue;
      this.emitFractalUpdates();
    }
  }

  updateAnimation(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.animation = newValue;
      this.processAnimation();
    }
  }

  processAnimation(): void {
    const splitAnimationValues = this.animation.split(' ');
    const newFps = parseInt(splitAnimationValues[0], 10) || 0;
    const newStart = parseInt(splitAnimationValues[1], 10) || 0;
    const newStop = parseInt(splitAnimationValues[2], 10) || 10;
    const newBounce = splitAnimationValues[3] !== 'false';

    this.updateAnimationInterval({
      fps: newFps,
      start: newStart,
      stop: newStop,
      bounce: newBounce,
    });
  }

  updateAnimationInterval(update: AnimationUpdate): void {
    clearInterval(this.animationTimeout);

    let stepDirection = 1;

    if (update.fps === 0) {
      return;
    }

    this.animationTimeout = window.setInterval(() => {
      if (this.iterations + stepDirection > update.stop) {
        if (update.bounce) {
          this.iterations = update.stop;
          stepDirection *= -1;
        }
        else {
          this.iterations = update.start - 1;
        }
      }

      if (this.iterations + stepDirection < update.start) {
        if (update.bounce) {
          this.iterations = update.start;
          stepDirection *= -1;
        }
        else {
          this.iterations = update.stop + 1;
        }
      }


      this.iterations += stepDirection;

      this.emitFractalUpdates();
    }, 1000 / update.fps);
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
      this.humanFacingColors = eventTarget.value;
      this.processColorInput();
    }
  }

  private processColorInput(): void {
    const colorsString = this.humanFacingColors;
    const colors = colorsString.split(' ');
    // some validation here...?
    // Turns out canvas.strokeStyle kinda does this automatically.
    // It's not user-facing feedback, but invalid colors won't break it.
    this.colors = colors;
    this.emitFractalUpdates();
  }

  private emitFractalUpdates(): void {
    this.fractalUpdate.emit({
      iterations: this.iterations,
      pattern: this.rawPattern,
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
      angle: this.angle,
      colors: this.colors,
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
      colors: this.colors,
    });
  }
}
