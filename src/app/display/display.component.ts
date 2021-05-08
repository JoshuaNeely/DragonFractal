import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Point } from '../point';
import { getStartingPoints, iteratePoints } from '../fractal-logic';
import { ControlPanelEvent } from '../control-panel/control-panel-events';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  lineColor = '#aaaaaa';
  width = 0;
  height = 0;
  points: Point[] = [];
  canvas !: HTMLCanvasElement;
  renderingContext !: CanvasRenderingContext2D;

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.canvas = this.canvasReference.nativeElement;

    // division by two seems to clean up some visual artifacts... css scales up the image anyway.
    // Unknown how canvas siave might affect performance of drawing functions.
    // The underlying geometric data is the same - that is the expensive part.
    this.canvas.width = window.innerWidth/2;
    this.canvas.height = window.innerHeight/2;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.renderingContext = this.getRenderingContext(this.canvas);
    this.renderingContext.lineWidth = 1.5;
    this.renderingContext.strokeStyle = this.lineColor;
  }

  updateTransformations(event: ControlPanelEvent): void {
    this.renderingContext.save();
    this.applyTransformations(event);
    this.redraw(event);
    this.renderingContext.restore();
  }

  private applyTransformations(event: ControlPanelEvent): void {
    const zoomRatio = event.zoom / 100;
    const angleRadians = event.angle / 180 * Math.PI;
    const displayCenter = [this.canvas.width / 2, this.canvas.height / 2];

    this.renderingContext.translate(displayCenter[0], displayCenter[1]);

    this.renderingContext.lineWidth = 1.5 / zoomRatio;
    this.renderingContext.scale(zoomRatio, zoomRatio);
    this.renderingContext.rotate(angleRadians);
    this.renderingContext.translate(event.panX, event.panY);

    this.renderingContext.translate(-displayCenter[0], -displayCenter[1]);
  }

  updateFractal(event: ControlPanelEvent): void {
    const startingPoints = getStartingPoints(this.width, this.height, 'line');
    this.points = iteratePoints(startingPoints, event.iterations, event.pattern);
    this.updateTransformations(event);
  }

  redraw(event: ControlPanelEvent): void {
    this.renderingContext.clearRect(-event.panX, -event.panY, this.width, this.height);
    this.drawPoints(this.points, event);
  }

  private drawPoints(points: Point[], event: ControlPanelEvent): void {
    const p1 = points[0];

    this.renderingContext.beginPath();
    this.renderingContext.moveTo(p1.x, p1.y);
    this.renderingContext.strokeStyle = this.lineColor;

    const remainingPoints = points.slice(1);
    remainingPoints.forEach((point, index) => {
      const nextColor = this.getNextColor(event, index, remainingPoints.length);
      this.renderingContext.strokeStyle = nextColor;
      this.renderingContext.lineTo(point.x, point.y);
      this.renderingContext.stroke();
      this.renderingContext.beginPath();
      this.renderingContext.moveTo(point.x, point.y);
    });
  }

  private getNextColor(event: ControlPanelEvent, pointIndex: number, totalPoints: number): string {
    const colors = event.colors;

    const pointProgress = pointIndex / totalPoints;
    const colorIndex = Math.floor(pointProgress * colors.length);

    return colors[colorIndex];
  }

  private getRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const renderingContext = canvas.getContext('2d');
    if (renderingContext == null) {
      throw new Error('Canvas did not succesfully aquire rendering context');
    } else {
      return renderingContext;
    }
  }
}
