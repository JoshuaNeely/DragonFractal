import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';


class Point {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  iterations = 0;

  @ViewChild('fractalCanvas') canvasReference !: ElementRef;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.draw(0);
  }

  updateIterations(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.iterations = newValue;
      this.draw(newValue);
    }
  }

  getStartingPoints(width: number, height: number): Point[] {
    return [
      new Point(width / 3, height / 2),
      new Point(2 * width / 3, height / 2),
    ];
  }

  private iteratePoints(points: Point[], iterations: number): Point[] {
    let newPoints = points;
    for (let i = 0; i < iterations; i++) {
      newPoints = this.iteratePointsOnce(newPoints);
    }
    return newPoints;
  }

  private iteratePointsOnce(points: Point[]): Point[] {
    const newPoints: Point[] = [];

    let firstPoint =  points[0];
    newPoints.push(firstPoint);

    let i = 0;
    const pattern = [-1, 1];

    for (const secondPoint of points.slice(1)) {
      const xd = secondPoint.x - firstPoint.x;
      const yd = secondPoint.y - firstPoint.y;
      const angleFirstToSecond = Math.atan2(yd, xd);
      const distFirstToSecond = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));

      const patternSelection = pattern[i];
      i = (i + 1) % pattern.length;
      const angleDelta = (Math.PI / 4) * patternSelection;

      const newAngle = angleFirstToSecond + angleDelta;
      const rightAngleLegDist = Math.sqrt(Math.pow(distFirstToSecond, 2) / 2);

      const newX = firstPoint.x + (Math.cos(newAngle) * rightAngleLegDist);
      const newY = firstPoint.y + (Math.sin(newAngle) * rightAngleLegDist);

      const middlePoint = new Point(newX, newY);
      newPoints.push(middlePoint);
      newPoints.push(secondPoint);
      firstPoint = secondPoint;
    }

    return newPoints;
  }

  draw(iterations: number): void {
    const canvasElement = this.canvasReference.nativeElement;
    const renderingContext = this.getRenderingContext(canvasElement);

    renderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const startingPoints = this.getStartingPoints(canvasElement.width, canvasElement.height);
    const newPoints = this.iteratePoints(startingPoints, iterations);
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
