import { Pattern } from '../pattern';

export interface ControlPanelEvent {
  iterations: number;
  pattern: Pattern;
  drawStyle: 'lines' | 'triangles';
  zoom: number;
  panX: number;
  panY: number;
  angle: number;
}
