import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { AiChatComponent } from '@wbs/components/_utils/ai-chat.component';
import { AiDescriptionEditorComponent } from '@wbs/components/ai-description-editor';
import { AiModel } from '@wbs/core/models';
import { AiChatService } from '@wbs/core/services';
import { AiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-ai-description-chat',
  templateUrl: './ai-description-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiChatComponent,
    AiDescriptionEditorComponent,
    DropDownListModule,
    TabStripModule,
    TranslateModule,
  ],
})
export class AiDescriptionChatComponent implements OnInit {
  private readonly store = inject(AiStore);
  readonly service = inject(AiChatService);

  readonly models = input.required<AiModel[]>();
  readonly description = input.required<string | undefined>();
  readonly startingDialog = input.required<string | undefined>();
  readonly model = model<AiModel>();
  readonly proposal = model('');
  readonly view = signal<'chat' | 'editor'>('chat');

  readonly descriptionChange = output<string>();

  constructor() {
    this.service.verifyUserId();
    this.service.setActions([
      {
        type: 'action',
        title: 'Append',
        value: 'append',
      },
      {
        type: 'action',
        title: 'Set/Replace',
        value: 'set',
      },
    ]);
  }

  ngOnInit(): void {
    this.proposal.set(this.description() ?? '');
    this.changeModel(this.store.model()!);
  }

  changeModel(model: AiModel): void {
    this.model.set(model);
    this.store.setModel(model);
    this.service.start(model, this.startingDialog());
  }

  actionSelected(action: string): void {
    if (action === 'clear') {
      this.proposal.set('');
    } else if (action === 'revert') {
      this.proposal.set(this.description() ?? '');
    } else {
      this.descriptionChange.emit(this.proposal());
    }
  }

  setProposal(action: string): void {
    const append = action === 'append';
    const current = this.proposal();
    const message = this.service.getLastMessage();
    this.proposal.set(
      append && current.length > 0 ? `${current}<br/><br/>${message}` : message
    );
    this.view.set('editor');
  }

  tabChanged(index: number): void {
    this.view.set(index === 0 ? 'chat' : 'editor');
  }
}
