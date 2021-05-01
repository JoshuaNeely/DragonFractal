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
    this.displayComponent.draw(event.iterations, event.pattern);
  }
}
