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

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }
  ngAfterViewInit(): void {}

  drawLines(event: ControlPanelEvent): void {
    const canvasElement = this.canvasReference.nativeElement;
    const renderingContext = this.getRenderingContext(canvasElement);
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    renderingContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const startingPoints = getStartingPoints(canvasWidth, canvasHeight);
    const newPoints = iteratePoints(startingPoints, event.iterations, event.pattern);
    const path = this.connectPoints(newPoints);
    const transformedPath = this.transformPath(path, event, canvasWidth, canvasHeight);

    renderingContext.lineWidth = 1.5;
    renderingContext.strokeStyle = this.lineColor;
    renderingContext.stroke(transformedPath);
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

  private transformPath(path: Path2D, event: ControlPanelEvent, canvasWidth: number, canvasHeight: number): Path2D {
    const zoomRatio = event.zoom / 100;
    const angle = event.angle;
    const translateX = event.panX;
    const translateY = event.panY;

    const rotationMatrix = new DOMMatrix().rotate(angle);
    const translationMatrix = new DOMMatrix().translate(translateX, translateY);
    const scaleMatrix = new DOMMatrix().scale(zoomRatio);

    path = this.applyTransformOverCenterScreen(path, [
      rotationMatrix,
      scaleMatrix,
      translationMatrix
    ]);
    return path;
  }

  private applyTransform(path: Path2D, transform: DOMMatrix): Path2D {
    const newPath = new Path2D();
    newPath.addPath(path, transform);
    return newPath;
  }

  private applyIndependantTransformations(path: Path2D, transformations: DOMMatrix[]): Path2D {
    for (const transformation of transformations) {
      path = this.applyTransform(path, transformation);
    }
    return path;
  }

  private applyTransformOverCenterScreen(path: Path2D, transformations: DOMMatrix[]): Path2D {
    const canvasElement = this.canvasReference.nativeElement;
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    const drawingCenter = [canvasWidth / 2, canvasHeight /2];
    const translationToOrigin = new DOMMatrix()
      .translate(-drawingCenter[0], -drawingCenter[1]);

    const translationFromOrigin = new DOMMatrix()
      .translate(drawingCenter[0], drawingCenter[1]);

    return this.applyIndependantTransformations(path, [
      translationToOrigin,
      ...transformations,
      translationFromOrigin
    ]);
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
