import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRotateBack,
  faEraser,
  faThumbsUp,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ChatModule,
  Message,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { EditorModule } from '@progress/kendo-angular-editor';
import { AiModel } from '@wbs/core/models';
import { AiChatService } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-ai-description-chat',
  templateUrl: './ai-description-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    ChatModule,
    EditorModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
  providers: [AiChatService],
})
export class AiDescriptionChatComponent implements OnInit {
  readonly service = inject(AiChatService);

  readonly model = input.required<AiModel>();
  readonly description = input.required<string | undefined>();
  readonly startingDialog = input.required<string | undefined>();

  readonly back = output<void>();
  readonly descriptionChange = output<string>();

  readonly feed = signal<Message[]>([]);

  readonly faArrowLeft = faArrowLeft;
  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;

  proposal = '';

  ngOnInit(): void {
    this.service.verifyUserId();
    this.start();
  }

  start(): void {
    this.proposal = this.description() ?? '';
    this.feed.set([]);
    this.service.sendAsync(this.model()!, this.feed, {
      author: this.service.you,
      text: this.startingDialog(),
    });
  }

  revert(): void {
    this.proposal = this.description() ?? '';
  }

  setProposal(append: boolean): void {
    const feed = this.feed();
    const message = feed.at(-1)?.text!;
    const current = this.proposal;
    this.proposal =
      append && current.length > 0 ? `${current}<br/><br/>${message}` : message;
  }

  sendMessage(e: SendMessageEvent): void {
    this.service.sendAsync(this.model()!, this.feed, e.message);
  }
}
