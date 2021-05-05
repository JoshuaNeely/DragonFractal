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
  path = new Path2D();
  canvas !: HTMLCanvasElement;
  renderingContext !: CanvasRenderingContext2D;

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.canvas = this.canvasReference.nativeElement;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.renderingContext = this.getRenderingContext(this.canvas);
    this.renderingContext.lineWidth = 1.5;
    this.renderingContext.strokeStyle = this.lineColor;
  }

  updateTransformations(event: ControlPanelEvent): void {
    this.renderingContext.save();
    this.applyTransformations(event);
    this.redraw();
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
    const startingPoints = getStartingPoints(this.width, this.height);
    const newPoints = iteratePoints(startingPoints, event.iterations, event.pattern);
    this.path = this.connectPoints(newPoints);

    this.updateTransformations(event);
  }

  redraw(): void {
    this.renderingContext.clearRect(0, 0, this.width, this.height);
    this.renderingContext.stroke(this.path);
  }

  private connectPoints(points: Point[]): Path2D {
    const path = new Path2D();

    const p1 = points[0];
    path.moveTo(p1.x, p1.y);

    for (const point of points.slice(1)) {
      path.lineTo(point.x, point.y);
    }

    return path;
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
