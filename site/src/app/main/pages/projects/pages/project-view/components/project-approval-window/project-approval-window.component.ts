import { JsonPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import {
  ChatModule,
  Message,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { ChatComment, PROJECT_CLAIMS, ProjectApproval } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import {
  ApprovalChanged,
  SendApprovalMessage,
  SetApproval,
} from '../../actions';

@Component({
  standalone: true,
  selector: 'wbs-project-approval-window',
  templateUrl: './project-approval-window.component.html',
  styleUrls: ['./project-approval-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ChatModule, CheckPipe, FontAwesomeModule, NgClass, NgIf, JsonPipe],
})
export class ProjectApprovalWindowComponent {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) approval!: ProjectApproval;
  @Input({ required: true }) chat!: Message[];

  readonly faX = faX;
  readonly canApproveClaims = PROJECT_CLAIMS.APPROVAL.CAN_APPROVE;
  readonly canCommentClaims = PROJECT_CLAIMS.APPROVAL.CAN_COMMENT;

  constructor(private readonly store: Store) {}

  closeApprovalWindow() {
    this.store.dispatch(new SetApproval());
  }

  approvalChanged(isApproved: boolean): void {
    this.store.dispatch(new ApprovalChanged(isApproved));
  }

  sendMessage(e: SendMessageEvent): void {
    this.store.dispatch(new SendApprovalMessage(this.userId, e.message.text!));
  }
}
