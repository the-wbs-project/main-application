import { UiStore } from '@wbs/core/store';

export class AppInitializerFactory {
  static run(uiStore: UiStore) {
    return () => {
      uiStore.setup();
    };
  }
}
