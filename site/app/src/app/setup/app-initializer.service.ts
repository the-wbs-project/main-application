import { Resources } from '../core/services/resource.service';
import { AiStore, UiStore } from '@wbs/core/store';

export class AppInitializerFactory {
  static run(resources: Resources, uiStore: UiStore, aiStore: AiStore) {
    return () => {
      uiStore.setup();
      aiStore.setup();

      return resources.initiate();
    };
  }
}
