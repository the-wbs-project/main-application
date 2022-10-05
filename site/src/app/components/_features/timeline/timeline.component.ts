import { Component, Input } from '@angular/core';
import { Messages } from '@wbs/shared/services';
import { TimelineViewModel } from '@wbs/shared/view-models';

@Component({
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input() timeline?: TimelineViewModel[] | null;

  constructor(private readonly messages: Messages) {}

  soon() {
    this.messages.info('Discussion Coming Soon...', false);
  }
}
