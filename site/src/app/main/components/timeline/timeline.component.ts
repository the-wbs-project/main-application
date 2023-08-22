import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faComment } from '@fortawesome/pro-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineMenuItem } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { UserNamePipe } from '@wbs/main/pipes/user-name.pipe';
import { DateTextPipe } from '../../pipes/date-text.pipe';
import { ActionDescriptionTransformPipe } from './pipes';

@Component({
  standalone: true,
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  imports: [
    ActionDescriptionTransformPipe,
    CommonModule,
    DateTextPipe,
    FontAwesomeModule,
    NgbDropdownModule,
    TranslateModule,
    UserNamePipe,
  ],
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
