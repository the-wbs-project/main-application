import { Injectable, WritableSignal, inject } from '@angular/core';
import { Store } from '@ngxs/store';
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
import { AuthState } from '../states';

@Injectable()
export class AiChatService {
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);

  readonly you: User = {
    id: 1,
    name: 'You',
  };
  readonly bot: User = {
    id: 0,
    name: 'Bot',
  };

  verifyUserId(): void {
    if (this.you.id === 1) {
      this.you.id = this.store.selectSnapshot(AuthState.userId)!;
    }
  }

  sendAsync(
    model: AiModel,
    feed: WritableSignal<Message[]>,
    message: Message
  ): void {
    const responseMessage: Message = {
      author: this.bot,
      typing: true,
    };
    let feedArray: Message[] = [...feed(), message, responseMessage];

    feed.set(structuredClone(feedArray));

    if (model.type === 'worker-ai') {
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
        .runWorkerAiAsync(model.model, input)
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
          feed.set(structuredClone(feedArray));
          //this.saveChat(ctx);
        });
    } else if (model.type === 'open-ai') {
      const messages: OpenAiMessage[] = feedArray
        .filter((x) => x.text)
        .map((x) => ({
          role: x.author.id === this.bot.id ? 'assistant' : 'user',
          content: x.text!,
        }));
      const input: OpenAiRequest = {
        model: model.model,
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
          feed.set(structuredClone(feedArray));

          //this.saveChat(ctx);
        },
        (err) => {
          message.status = 'Error';

          feedArray.splice(feedArray.length - 1, 1);

          feed.set(structuredClone(feedArray));

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
