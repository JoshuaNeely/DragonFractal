import { Pattern } from '../pattern';

export interface ControlPanelEvent {
  iterations: number;
  pattern: Pattern;
  zoom: number;
  panX: number;
  panY: number;
  angle: number;
}
