import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faComment } from '@fortawesome/pro-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WaitNotifyDirective } from '@wbs/core/directives/wait-notify.directive';
import { TimelineMenuItem } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { TextTransformPipe } from '@wbs/pipes/text-transform.pipe';
import { UserNamePipe } from '@wbs/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
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
  loadMoreClicked = output<void>();
  menuItemClicked = output<TimelineMenuItem>();

  readonly faCircleInfo = faCircleInfo;
  readonly faComment = faComment;
  readonly loading = input.required<boolean>();
  readonly loaded = input.required<boolean>();
  readonly length = input<number>();
  readonly timeline = input<TimelineViewModel[] | null>();

  constructor(private readonly messages: Messages) {}

  soon() {
    this.messages.notify.info('Discussion Coming Soon...', false);
  }
}
