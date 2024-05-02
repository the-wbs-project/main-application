import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { Action, ChatModule } from '@progress/kendo-angular-conversational-ui';
import { AiModel } from '@wbs/core/models';
import { AiChatService } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-ai-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatModule],
  providers: [AiChatService],
  template: `<kendo-chat
    class="h-100"
    [messages]="service.feed()"
    [user]="service.you"
    (sendMessage)="service.send($event.message)"
    (executeAction)="selected($event.action.value)"
  />`,
})
export class AiChatComponent {
  readonly service = inject(AiChatService);

  readonly model = input.required<AiModel>();
  readonly actions = input<Action[]>();
  readonly startingDialog = input.required<string | undefined>();
  readonly actionSelected = output<{ action: string; message: string }>();

  constructor() {
    this.service.verifyUserId();
    effect(
      () => {
        if (this.service.started) return;

        const model = this.model();
        const message = this.startingDialog();

        if (model && message) {
          this.service.setModel(model);
          this.service.send({
            author: this.service.you,
            text: this.startingDialog(),
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  selected(action: string): void {
    this.actionSelected.emit({
      action,
      message: this.service.getLastMessage(),
    });
  }
}
