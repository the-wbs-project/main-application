import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  ChatModule,
  Message,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { PROJECT_CLAIMS, ProjectApproval } from '@wbs/core/models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { TextTransformPipe } from '@wbs/pipes/text-transform.pipe';
import {
  ApprovalChanged,
  SendApprovalMessage,
  SetApproval,
} from '../../actions';
import { ProjectApprovalWindowTitlePipe } from './project-approval-window-title.component';
import { TaskNamePipe } from '../../pipes/task-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-approval-window',
  templateUrl: './project-approval-window.component.html',
  styleUrl: './project-approval-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    ChatModule,
    CheckPipe,
    DatePipe,
    FontAwesomeModule,
    NgbDropdownModule,
    NgClass,
    ProjectApprovalWindowTitlePipe,
    TaskNamePipe,
    TextTransformPipe,
    TranslateModule,
  ],
})
export class ProjectApprovalWindowComponent {
  readonly faX = faX;
  readonly claims = input.required<string[]>();
  readonly userId = input.required<string>();
  readonly owner = input.required<string>();
  readonly approval = input.required<ProjectApproval>();
  readonly isReadyOnly = input.required<boolean>();
  readonly chat = input.required<Message[]>();
  readonly hasChildren = input.required<boolean>();
  readonly canApproveClaims = PROJECT_CLAIMS.APPROVAL.CAN_APPROVE;
  readonly canCommentClaims = PROJECT_CLAIMS.APPROVAL.CAN_COMMENT;

  constructor(private readonly store: Store) {}

  closeApprovalWindow() {
    this.store.dispatch(new SetApproval());
  }

  changed(isApproved: boolean, childrenToo: boolean): void {
    this.store.dispatch(new ApprovalChanged(isApproved, childrenToo));
  }

  sendMessage(e: SendMessageEvent): void {
    this.store.dispatch(
      new SendApprovalMessage(this.userId(), e.message.text!)
    );
  }
}
