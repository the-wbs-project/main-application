import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { AiModel } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { AiChatService } from '@wbs/main/services';
import { AiState } from '@wbs/main/states';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-dialog',
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    ChatModule,
    DropDownListModule,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    TextAreaModule,
    TranslateModule,
  ],
  providers: [AiChatService],
})
export class DescriptionAiDialogComponent implements OnInit {
  readonly descriptionChange = output<string>();

  private readonly store = inject(SignalStore);
  public readonly service = inject(AiChatService);

  readonly versionTitle = input.required<string>();
  readonly description = input.required<string | undefined>();
  readonly showChat = signal<boolean>(false);
  readonly feed = signal<Message[]>([]);
  readonly models = this.store.select(AiState.models);
  readonly faArrowLeft = faArrowLeft;
  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;

  model?: AiModel;
  startingDialog?: string;
  proposal = '';

  constructor() {
    effect(() => {
      this.startingDialog = `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${this.versionTitle()}'?`;
    });
  }

  ngOnInit(): void {
    this.model = this.models()![0];
    this.service.verifyUserId();
  }

  start(): void {
    this.proposal = this.description() ?? '';
    this.feed.set([]);
    this.service.sendAsync(this.model!, this.feed, {
      author: this.service.you,
      text: this.startingDialog,
    });
    this.showChat.set(true);
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
    this.service.sendAsync(this.model!, this.feed, e.message);
  }

  accept(): void {
    //
  }
}
