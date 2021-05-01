import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { ControlPanelEvent } from './control-panel/control-panel-events';
import { Point } from './point';
import { Pattern } from './pattern';
import { getStartingPoints, iteratePoints } from './fractal-logic';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }
  ngAfterViewInit(): void {}

  handleControlPanelChange(event: ControlPanelEvent): void {
    this.draw(event.iterations, event.pattern);
  }

  draw(iterations: number, pattern: Pattern): void {
    const canvasElement = this.canvasReference.nativeElement;
    const renderingContext = this.getRenderingContext(canvasElement);

    renderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const startingPoints = getStartingPoints(canvasElement.width, canvasElement.height);
    const newPoints = iteratePoints(startingPoints, iterations, pattern);
    this.connectPoints(renderingContext, newPoints, '#000000');
  }

  private connectPoints(
    renderingContext: CanvasRenderingContext2D,
    points: Point[],
    color: string
  ): void {
    const borderWidth = 0.5;

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

  private getRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const renderingContext = canvas.getContext('2d');
    if (renderingContext == null) {
      throw new Error('Canvas did not succesfully aquire rendering context');
    } else {
      return renderingContext;
    }
  }
}
