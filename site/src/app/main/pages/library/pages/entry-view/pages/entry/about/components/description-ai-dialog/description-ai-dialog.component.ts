import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ChatModule,
  Message,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { AiModel, LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { AiChatService } from '@wbs/main/services';
import { AiState } from '@wbs/main/states';

@Component({
  standalone: true,
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    ChatModule,
    DropDownListModule,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    TextAreaModule,
  ],
  providers: [AiChatService],
})
export class DescriptionAiDialogComponent {
  private readonly store = inject(SignalStore);
  public readonly modal = inject(NgbActiveModal);
  public readonly service = inject(AiChatService);

  private version?: LibraryEntryVersion;

  readonly models = this.store.select(AiState.models);
  readonly showChat = signal<boolean>(false);
  readonly feed = signal<Message[]>([]);
  //readonly proposal = signal<string>('');
  readonly faArrowLeft = faArrowLeft;
  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;

  model?: AiModel;
  startingDialog?: string;
  proposal = '';

  setup(entry: LibraryEntry, version: LibraryEntryVersion): void {
    this.version = version;
    this.service.verifyUserId();
    this.startingDialog = `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${version.title}'?`;
    this.model = this.models()![0];
  }

  start(): void {
    this.proposal = this.version?.description ?? '';
    this.feed.set([]);
    this.service.sendAsync(this.model!, this.feed, {
      author: this.service.you,
      text: this.startingDialog,
    });
    this.showChat.set(true);
  }

  revert(): void {
    this.proposal = this.version!.description ?? '';
  }

  setProposal(append: boolean): void {
    const feed = this.feed();
    const message = feed[feed.length - 1].text!;
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
