import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  ChatModule,
  Message,
  User,
} from '@progress/kendo-angular-conversational-ui';
import { AiChatService } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-ai-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatModule],
  providers: [AiChatService],
  template: `<kendo-chat
    [user]="you()"
    [class]="chatCss()"
    [messages]="feed()"
    (sendMessage)="send.emit($event.message)"
    (executeAction)="actionSelected.emit($event.action.value)"
  />`,
})
export class AiChatComponent {
  readonly chatCss = input<string | undefined>();
  readonly feed = input.required<Message[]>();
  readonly you = input.required<User>();
  readonly send = output<Message>();
  readonly actionSelected = output<string>();
}
