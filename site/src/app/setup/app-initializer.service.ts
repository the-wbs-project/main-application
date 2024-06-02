import { AiStore, UiStore } from '@wbs/core/store';

export class AppInitializerFactory {
  static run(uiStore: UiStore, aiStore: AiStore) {
    return () => {
      uiStore.setup();
      aiStore.setup();
    };
  }
}
