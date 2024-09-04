import { DataServiceFactory } from '@wbs/core/data-services';
import { Resources } from '@wbs/core/services';
import { MetadataStore, UiStore } from '@wbs/core/store';
import { map } from 'rxjs/operators';

export class AppInitializerFactory {
  static run(
    data: DataServiceFactory,
    metadata: MetadataStore,
    resources: Resources,
    uiStore: UiStore
  ) {
    return () => {
      return data.metdata.getStarterDataAsync().pipe(
        map((data) => {
          resources.initiate(data.resources);
          metadata.categories.initiate(
            data.projectCategories,
            data.disciplines,
            data.phases
          );
          metadata.roles.initiate(data.roles);

          uiStore.setup();
        })
      );
    };
  }
}
