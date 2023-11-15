import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faComment } from '@fortawesome/pro-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineMenuItem } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { WaitNotifyDirective } from '@wbs/main/directives/wait-notify.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { TextTransformPipe } from '@wbs/main/pipes/text-transform.pipe';
import { UserNamePipe } from '@wbs/main/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DateTextPipe,
    FontAwesomeModule,
    NgbDropdownModule,
    NgClass,
    TextTransformPipe,
    TranslateModule,
    UserNamePipe,
    WaitNotifyDirective,
  ],
})
export class TimelineComponent {
  @Input({ required: true }) loading = false;
  @Input({ required: true }) loaded = false;
  @Input({ required: true }) length?: number;
  @Input({ required: true }) timeline?: TimelineViewModel[] | null;
  @Output() loadMoreClicked = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<TimelineMenuItem>();

  readonly faCircleInfo = faCircleInfo;
  readonly faComment = faComment;

  constructor(private readonly messages: Messages) {}

  soon() {
    this.messages.notify.info('Discussion Coming Soon...', false);
  }
}
