import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Point } from '../point';
import { Pattern } from '../pattern';
import { getStartingPoints, iteratePoints } from '../fractal-logic';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  lineColor = '#aaaaaa';

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }
  ngAfterViewInit(): void {}

  drawLines(iterations: number, pattern: Pattern): void {
    const canvasElement = this.canvasReference.nativeElement;
    const renderingContext = this.getRenderingContext(canvasElement);

    renderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const startingPoints = getStartingPoints(canvasElement.width, canvasElement.height);
    const newPoints = iteratePoints(startingPoints, iterations, pattern);
    this.connectPoints(renderingContext, newPoints, this.lineColor);
  }

  drawTriangles(iterations: number, pattern: Pattern): void {
    const canvasElement = this.canvasReference.nativeElement;
    const renderingContext = this.getRenderingContext(canvasElement);

    renderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const startingPoints = getStartingPoints(canvasElement.width, canvasElement.height);
    const newPoints = iteratePoints(startingPoints, iterations, pattern);
    this.pointsToTriangles(renderingContext, newPoints, this.lineColor);
  }

  private connectPoints(
    renderingContext: CanvasRenderingContext2D,
    points: Point[],
    color: string
  ): void {
    const borderWidth = 1.5;

    renderingContext.lineWidth = borderWidth;
    renderingContext.strokeStyle = color;

    const p1 = points[0];
    renderingContext.beginPath();
    renderingContext.moveTo(p1.x, p1.y);

    for (const point of points.slice(1)) {
      renderingContext.lineTo(point.x, point.y);
    }
    renderingContext.stroke();
  }

  private pointsToTriangles(
    renderingContext: CanvasRenderingContext2D,
    points: Point[],
    color: string
  ): void {
    if (points.length > 2) {
      const borderWidth = 1.5;

      renderingContext.lineWidth = borderWidth;
      renderingContext.strokeStyle = color;
      renderingContext.fillStyle = color;

      const p1 = points[0];
      renderingContext.beginPath();
      renderingContext.moveTo(p1.x, p1.y);

      let count = 1;
      for (const point of points.slice(1)) {
        renderingContext.lineTo(point.x, point.y);
        if (count % 2 === 0) {
          renderingContext.closePath();
          renderingContext.fill();
          renderingContext.moveTo(point.x, point.y);
        }
        count += 1;
      }
    }
    else {
      this.connectPoints(renderingContext, points, color);
    }
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
