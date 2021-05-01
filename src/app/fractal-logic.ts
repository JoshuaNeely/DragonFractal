import { Point } from './point';

export function getStartingPoints(width: number, height: number): Point[] {
    return [
        new Point(width / 3, height / 2),
        new Point(2 * width / 3, height / 2),
    ];
}

export function iteratePoints(points: Point[], iterations: number): Point[] {
    let newPoints = points;
    for (let i = 0; i < iterations; i++) {
        newPoints = iteratePointsOnce(newPoints);
    }
    return newPoints;
}

function iteratePointsOnce(points: Point[]): Point[] {
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
