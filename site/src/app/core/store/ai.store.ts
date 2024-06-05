import { Injectable, Signal, inject, signal } from '@angular/core';
import { User } from '@progress/kendo-angular-conversational-ui';
import { DataServiceFactory } from '@wbs/core/data-services';
import { APP_CONFIG_TOKEN, AiModel, AppConfiguration } from '@wbs/core/models';
import { Storage } from '@wbs/core/services';

@Injectable({ providedIn: 'root' })
export class AiStore {
  private readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);
  private readonly data = inject(DataServiceFactory);
  private readonly storage = inject(Storage);

  private readonly _isEnabled = signal(false);
  private readonly _models = signal<AiModel[]>([]);
  private readonly _model = signal<AiModel | undefined>(undefined);
  readonly bot: User = {
    id: 0,
    name: 'Bot',
  };
  readonly you: User = {
    id: 1,
    name: 'You',
  };

  get isEnabled(): Signal<boolean> {
    return this._isEnabled;
  }

  get models(): Signal<AiModel[]> {
    return this._models;
  }

  get model(): Signal<AiModel | undefined> {
    return this._model;
  }

  setup(): void {
    this.data.ai.getModelsAsync('text').subscribe((models) => {
      this._models.set(models);

      const currentModelId = this.getCurrentModel();

      this.setModel(
        models.find((x) => x.model === currentModelId) ?? models[0]
      );
    });
  }

  setUserInfo(user: User): void {
    this._isEnabled.set(this.appConfig.can_test_ai.includes(user.id ?? ''));
    this.you.id = user.id!;
  }

  setModel(model: AiModel): void {
    this.setCurrentModel(model.model);
    this._model.set(model);
  }

  private getCurrentModel(): string | null {
    return this.storage.local.get('ai-model');
  }

  private setCurrentModel(model: string): void {
    this.storage.local.set('ai-model', model);
  }
}
