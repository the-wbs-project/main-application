import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCircleInfo, faComment } from '@fortawesome/pro-solid-svg-icons';
import { TimelineMenuItem } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';

@Component({
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input() timeline?: TimelineViewModel[] | null;
  @Output() loadMoreClicked = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<TimelineMenuItem>();

  readonly faCircleInfo = faCircleInfo;
  readonly faComment = faComment;

  constructor(private readonly messages: Messages) {}

  soon() {
    this.messages.info('Discussion Coming Soon...', false);
  }
}
