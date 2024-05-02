import {
  FactoryProvider,
  Injectable,
  Signal,
  inject,
  signal,
} from '@angular/core';
import {
  Action,
  Message,
  User,
} from '@progress/kendo-angular-conversational-ui';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  AiModel,
  OpenAiMessage,
  OpenAiRequest,
  WorkerAiMessage,
  WorkerAiRequest,
} from '@wbs/core/models';
import { UserStore } from '@wbs/store';

@Injectable()
export class AiChatService {
  private readonly _feed = signal<Message[]>([]);
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;
  private model?: AiModel;
  private _started = false;

  readonly you: User = {
    id: 1,
    name: 'You',
  };
  readonly bot: User = {
    id: 0,
    name: 'Bot',
  };

  get feed(): Signal<Message[]> {
    return this._feed;
  }

  get started(): boolean {
    return this._started;
  }

  setModel(model: AiModel): void {
    this.model = model;
  }

  getLastMessage(): string {
    return this._feed().at(-1)?.text!;
  }

  verifyUserId(): void {
    if (this.you.id === 1) {
      this.you.id = this.userId()!;
    }
  }

  send(message: Message): void {
    if (!this.model) return;

    const responseMessage: Message = {
      author: this.bot,
      typing: true,
    };
    let feedArray: Message[] = [...this._feed(), message, responseMessage];

    this._feed.set(structuredClone(feedArray));

    this._started = true;

    if (this.model.type === 'worker-ai') {
      const messages: WorkerAiMessage[] = feedArray
        .filter((x) => x.text)
        .map((x) => ({
          role: x.author.id === this.bot.id ? 'assistant' : 'user',
          content: x.text!,
        }));

      const input: WorkerAiRequest = {
        messages,
      };

      this.data.ai
        .runWorkerAiAsync(this.model.model, input)
        .subscribe((response) => {
          if (response.success) {
            responseMessage.text = response.result.response;
            responseMessage.typing = false;
            responseMessage.timestamp = new Date();
            responseMessage.suggestedActions = this.getActions();

            /*this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: true,
              output: response.result.response,
              fullInput: input,
              fullOutput: response,
            });*/
          } else {
            message.status = 'Error';

            feedArray.splice(feedArray.length - 1, 1);

            /*this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: false,
              errors: response.errors,
              fullInput: input,
              fullOutput: response,
            });*/
          }
          this._feed.set(structuredClone(feedArray));
          //this.saveChat(ctx);
        });
    } else if (this.model.type === 'open-ai') {
      const messages: OpenAiMessage[] = feedArray
        .filter((x) => x.text)
        .map((x) => ({
          role: x.author.id === this.bot.id ? 'assistant' : 'user',
          content: x.text!,
        }));
      const input: OpenAiRequest = {
        model: this.model.model,
        user: this.you.id,
        messages,
      };

      this.data.ai.runOpenAiWorkerAsync(input).subscribe(
        (response) => {
          if (response.choices) {
            responseMessage.text = response.choices[0].message.content!;
            responseMessage.typing = false;
            responseMessage.timestamp = new Date();
            responseMessage.suggestedActions = this.getActions();

            /*this.saveLog({
            input: message.text!,
            model: model.model,
            timestamp: new Date(),
            user: you.id,
            success: true,
            output: response.choices[0].message.content!,
            fullInput: input,
            fullOutput: response,
          });*/
          } else {
            message.status = 'Error';

            feedArray.splice(feedArray.length - 1, 1);

            /*this.saveLog({
            input: message.text!,
            model: model.model,
            timestamp: new Date(),
            user: you.id,
            success: false,
            fullInput: input,
            fullOutput: response,
          });*/
          }
          this._feed.set(structuredClone(feedArray));

          //this.saveChat(ctx);
        },
        (err) => {
          message.status = 'Error';

          feedArray.splice(feedArray.length - 1, 1);

          this._feed.set(structuredClone(feedArray));

          /*this.saveLog({
            input: message.text!,
            model: model.model,
            timestamp: new Date(),
            user: you.id,
            success: false,
            fullInput: input,
            errors: err,
          });*/
        }
      );
    }
  }

  private getActions(): Action[] {
    return [
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
    ];
  }
}

export const AiChatServiceFactory: FactoryProvider = {
  provide: AiChatService,
  useFactory: () => new AiChatService(),
};
