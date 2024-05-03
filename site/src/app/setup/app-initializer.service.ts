import { AuthClientConfig } from '@auth0/auth0-angular';
import { Resources } from '../core/services/resource.service';
import { AppConfig } from '../core/services/app-config.service';
import { AiStore, UiStore } from '@wbs/store';

export class AppInitializerFactory {
  static run(
    resources: Resources,
    auth: AuthClientConfig,
    config: AppConfig,
    uiStore: UiStore,
    aiStore: AiStore
  ) {
    return () => {
      auth.set(config.authConfig);
      uiStore.setup();
      aiStore.setup();

      return resources.initiate();
    };
  }
}
