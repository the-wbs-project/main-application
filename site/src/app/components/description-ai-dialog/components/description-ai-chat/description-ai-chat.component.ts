import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { AiChatComponent } from '@wbs/components/_utils/ai-chat.component';
import { AiModel } from '@wbs/core/models';
import { AiChatService } from '@wbs/core/services';
import { AiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-chat',
  templateUrl: './description-ai-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiChatComponent,
    DropDownButtonModule,
    DropDownListModule,
    TranslateModule,
  ],
})
export class DescriptionAiChatComponent implements OnInit {
  private readonly store = inject(AiStore);
  readonly service = inject(AiChatService);
  //
  //  Inputs
  //
  readonly containerHeight = input.required<number>();
  readonly startingDialog = input.required<string | undefined>();
  //
  //  Signals
  //
  readonly model = signal<AiModel | undefined>(undefined);
  readonly models = inject(AiStore).models;
  //
  //  Outputs
  //
  readonly append = output<string>();
  readonly replace = output<string>();

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
    this.changeModel(this.store.model()!);
  }

  changeModel(model: AiModel): void {
    this.model.set(model);
    this.store.setModel(model);
    this.service.start(model, this.startingDialog());
  }

  setProposal(action: string): void {
    const message = this.service.getLastMessage();

    if (action === 'append') {
      this.append.emit(message);
    } else {
      this.replace.emit(message);
    }
  }
}
