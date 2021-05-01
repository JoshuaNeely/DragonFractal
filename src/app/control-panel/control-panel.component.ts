import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ControlPanelEvent } from './control-panel-events';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  iterations = 0;

  @Output() controlChangeOutput = new EventEmitter<ControlPanelEvent>();

  constructor() { }

  ngOnInit(): void { }

  updateIterations(eventTarget: any): void {
    if (eventTarget && eventTarget.value) {
      const newValue = eventTarget.value;
      this.iterations = newValue;
      this.controlChangeOutput.emit({iterations: newValue});
    }
  }

}
