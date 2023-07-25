import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCircleInfo, faComment } from '@fortawesome/pro-solid-svg-icons';
import { TimelineMenuItem } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { ActionDescriptionPipe, ActionDescriptionTransformPipe, ActionIconPipe, ActionTitlePipe } from './pipes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateTextPipe } from '../../pipes/date-text.pipe';
import { UserNamePipe } from '@wbs/main/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  imports: [
    ActionDescriptionPipe,
    ActionDescriptionTransformPipe,
    ActionIconPipe,
    ActionTitlePipe,
    CommonModule,
    DateTextPipe,
    FontAwesomeModule,
    NgbDropdownModule,
    TranslateModule,
    UserNamePipe
  ]
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
