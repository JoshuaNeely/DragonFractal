import { Pattern } from '../pattern';

export interface ControlPanelEvent {
  iterations: number;
  midpointAngle: number;
  pattern: Pattern;
  zoom: number;
  panX: number;
  panY: number;
  angle: number;
  colors: string[];
}

export interface AnimationUpdate {
  fps: number;
  start: number;
  stop: number;
  bounce: boolean;
}
