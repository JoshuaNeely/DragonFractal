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

  handleControlPanelChange(event: ControlPanelEvent): void {
    if (event.drawStyle == 'lines') {
      this.displayComponent.drawLines(event.iterations, event.pattern);
    } else {
      this.displayComponent.drawTriangles(event.iterations, event.pattern);
    }
  }
}
