import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  Action as ChatAction,
  Message,
  User,
} from '@progress/kendo-angular-conversational-ui';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  AiLog,
  AiModel,
  OpenAiMessage,
  OpenAiRequest,
  WorkerAiMessage,
  WorkerAiRequest,
} from '@wbs/core/models';
import { Storage } from '@wbs/core/services';
import { Observable, catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeAiModel, ClearAiMessages, SendAiMessage } from '../actions';

interface StateModel {
  bot: User;
  feed: Message[];
  isEnabled: boolean;
  model?: AiModel;
  models?: AiModel[];
  you: User;
}

declare type Context = StateContext<StateModel>;

@UntilDestroy()
@Injectable()
@State<StateModel>({
  name: 'ai',
  defaults: {
    bot: {
      id: 0,
      name: 'Bot',
    },
    feed: [],
    isEnabled: false,
    you: {
      id: 1,
      name: 'You',
    },
  },
})
export class AiState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly data: DataServiceFactory,
    private readonly storage: Storage
  ) {}

  @Selector()
  static bot(state: StateModel): User {
    return state.bot;
  }

  @Selector()
  static feed(state: StateModel): Message[] {
    return state.feed;
  }

  @Selector()
  static isEnabled(state: StateModel): boolean {
    return state.isEnabled;
  }

  @Selector()
  static model(state: StateModel): AiModel | undefined {
    return state.model;
  }

  @Selector()
  static models(state: StateModel): AiModel[] | undefined {
    return state.models;
  }

  @Selector()
  static you(state: StateModel): User {
    return state.you;
  }

  ngxsOnInit(ctx: Context): void {
    this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;

      const isEnabled = environment.canTestAi.includes(user.sub ?? '');

      ctx.patchState({ isEnabled });

      if (!isEnabled) return;

      const you = ctx.getState().you;

      you.id = user.sub!;

      ctx.patchState({ you });

      this.data.ai
        .getModelsAsync('text')
        .pipe(
          tap((models) => {
            ctx.patchState({ models });

            const currentModelId = this.getCurrentModel();
            const model =
              models.find((x) => x.model === currentModelId) ?? models[0];

            return ctx.dispatch(new ChangeAiModel(model));
          })
        )
        .subscribe();
    });
  }

  @Action(ChangeAiModel)
  changeModel(ctx: Context, { model }: ChangeAiModel): Observable<any> {
    ctx.patchState({ model });

    this.setCurrentModel(model.model);

    return this.data.aiChat
      .getAsync(this.getChatModelId(model.model))
      .pipe(tap((feed) => ctx.patchState({ feed })));
  }

  @Action(SendAiMessage)
  send(ctx: Context, { message }: SendAiMessage): Observable<void> | void {
    const { feed, model, bot, you } = ctx.getState();
    const responseMessage: Message = {
      author: bot,
      typing: true,
    };

    feed.push(message, responseMessage);

    ctx.patchState({ feed: [...feed] });

    if (!model) return;

    if (model.type === 'worker-ai') {
      const messages: WorkerAiMessage[] = feed
        .filter((x) => x.text)
        .map((x) => ({
          role: x.author.id === bot.id ? 'assistant' : 'user',
          content: x.text!,
        }));

      const input: WorkerAiRequest = {
        messages,
      };

      return this.data.ai.runWorkerAiAsync(model.model, input).pipe(
        map((response) => {
          if (response.success) {
            responseMessage.text = response.result.response;
            responseMessage.typing = false;
            responseMessage.timestamp = new Date();
            responseMessage.suggestedActions = this.getActions(ctx);

            this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: true,
              output: response.result.response,
              fullInput: input,
              fullOutput: response,
            });
          } else {
            message.status = 'Error';

            feed.splice(feed.length - 1, 1);

            this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: false,
              errors: response.errors,
              fullInput: input,
              fullOutput: response,
            });
          }
          ctx.patchState({ feed: [...feed] });

          this.saveChat(ctx);
        })
      );
    } else if (model.type === 'open-ai') {
      const messages: OpenAiMessage[] = feed
        .filter((x) => x.text)
        .map((x) => ({
          role: x.author.id === bot.id ? 'assistant' : 'user',
          content: x.text!,
        }));
      const input: OpenAiRequest = {
        model: model.model,
        user: you.id,
        messages,
      };

      return this.data.ai.runOpenAiWorkerAsync(input).pipe(
        map((response) => {
          if (response.choices) {
            responseMessage.text = response.choices[0].message.content!;
            responseMessage.typing = false;
            responseMessage.timestamp = new Date();
            responseMessage.suggestedActions = this.getActions(ctx);

            this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: true,
              output: response.choices[0].message.content!,
              fullInput: input,
              fullOutput: response,
            });
          } else {
            message.status = 'Error';

            feed.splice(feed.length - 1, 1);

            this.saveLog({
              input: message.text!,
              model: model.model,
              timestamp: new Date(),
              user: you.id,
              success: false,
              fullInput: input,
              fullOutput: response,
            });
          }
          ctx.patchState({ feed: [...feed] });

          this.saveChat(ctx);
        }),
        catchError((err, caught) => {
          message.status = 'Error';

          feed.splice(feed.length - 1, 1);

          ctx.patchState({ feed: [...feed] });

          this.saveLog({
            input: message.text!,
            model: model.model,
            timestamp: new Date(),
            user: you.id,
            success: false,
            fullInput: input,
            errors: err,
          });
          return caught;
        })
      );
    }
  }

  @Action(ClearAiMessages)
  clear(ctx: Context): Observable<void> {
    const model = ctx.getState().model!.model;

    return this.data.aiChat
      .deleteAsync(this.getChatModelId(model))
      .pipe(tap(() => ctx.patchState({ feed: [] })));
  }

  private saveChat(ctx: Context): void {
    const state = ctx.getState();

    this.data.aiChat
      .putAsync(this.getChatModelId(state.model!.model), state.feed)
      .subscribe();
  }

  private saveLog(log: AiLog): void {
    this.data.ai.putLogAsync(log).subscribe();
  }

  private getCurrentModel(): string | null {
    return this.storage.local.get('ai-model');
  }

  private setCurrentModel(model: string): void {
    this.storage.local.set('ai-model', model);
  }

  private getChatModelId(id: string): string {
    let id2 = id;

    while (id2.includes('/')) id2 = id2.replace('/', '-');

    return id2;
  }

  private getActions(ctx: Context): ChatAction[] {
    return [
      {
        type: 'action',
        title: 'Add As Node',
        value: 'AddAsNode',
      },
      {
        type: 'action',
        title: 'Set As Node Description',
        value: 'NodeDescription',
      },
    ];
  }
}
