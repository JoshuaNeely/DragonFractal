import { Point } from './point';
import { Pattern } from './pattern';

export type Shape = 'line' | 'square';

export function getStartingPoints(width: number, height: number, selection: Shape): Point[] {
    switch (selection) {
        case 'line':
            return [
                new Point(width / 3, height / 2),
                new Point(2 * width / 3, height / 2),
            ];

        case 'square':
            return [
                new Point(width / 3, height / 3),
                new Point(2 * width / 3, height / 3),
                new Point(2 * width / 3, 2 * height / 3),
                new Point(width / 3, 2 * height / 3),
                new Point(width / 3, height / 3),
            ];

        default:
            return [
                new Point(width / 3, height / 2),
                new Point(2 * width / 3, height / 2),
            ];
    }
}

export function iteratePoints(points: Point[], iterations: number, pattern: Pattern): Point[] {
    let newPoints = points;
    for (let i = 0; i < iterations; i++) {
        newPoints = iteratePointsOnce(newPoints, pattern);
    }
    return newPoints;
}

function iteratePointsOnce(points: Point[], pattern: Pattern): Point[] {
    const newPoints: Point[] = [];

    let firstPoint =  points[0];
    newPoints.push(firstPoint);

    let i = 0;

    for (const secondPoint of points.slice(1)) {
        const patternSelection = pattern[i];
        i = (i + 1) % pattern.length;

        const middlePoint = getMiddlePoint(firstPoint, secondPoint, patternSelection);
        newPoints.push(middlePoint);
        newPoints.push(secondPoint);
        firstPoint = secondPoint;
    }

    return newPoints;
}

function getMiddlePoint(firstPoint: Point, secondPoint: Point, patternSelection: number): Point {
    const xd = secondPoint.x - firstPoint.x;
    const yd = secondPoint.y - firstPoint.y;
    const angleFirstToSecond = Math.atan2(yd, xd);
    const distFirstToSecond = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));

    const angleDelta = (Math.PI / 4) * patternSelection;

    const newAngle = angleFirstToSecond + angleDelta;
    const rightAngleLegDist = Math.sqrt(Math.pow(distFirstToSecond, 2) / 2);

    //const angleDelta = (Math.PI / 5) * patternSelection;
    // const angleDelta = Math.PI  * (patternSelection / 180);

    // const newAngle = angleFirstToSecond + angleDelta;
    // const rightAngleLegDist = distFirstToSecond / (2 * Math.cos(angleDelta));

    const newX = firstPoint.x + (Math.cos(newAngle) * rightAngleLegDist);
    const newY = firstPoint.y + (Math.sin(newAngle) * rightAngleLegDist);

    const middlePoint = new Point(newX, newY);
    return middlePoint;
}
