import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

import { ControlPanelEvent } from './control-panel/control-panel-events';
import { DisplayComponent } from './display/display.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('displayComponent') displayComponent!: DisplayComponent;

  ngOnInit(): void { }
  ngAfterViewInit(): void { }

  handleFractalUpdate(event: ControlPanelEvent): void {
      this.displayComponent.updateFractal(event);
  }

  handleTransformationsUpdate(event: ControlPanelEvent): void {
      this.displayComponent.updateTransformations(event);
  }
}
