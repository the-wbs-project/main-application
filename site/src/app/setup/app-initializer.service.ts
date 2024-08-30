import { DataServiceFactory } from '@wbs/core/data-services';
import { Category } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { MetadataStore, UiStore } from '@wbs/core/store';
import { forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export class AppInitializerFactory {
  static run(
    data: DataServiceFactory,
    metadata: MetadataStore,
    resources: Resources,
    uiStore: UiStore
  ) {
    return () => {
      return data.metdata.getResourceAsync().pipe(
        tap((resourceObj) => resources.initiate(resourceObj)),
        switchMap(() =>
          forkJoin({
            roles: data.metdata.getRolesAsync(),
            phases: data.metdata.getListAsync<Category>('categories_phase'),
            projectCategories:
              data.metdata.getListAsync<Category>('project_category'),
            disciplines: data.metdata.getListAsync<Category>(
              'categories_discipline'
            ),
          })
        ),
        map((data) => {
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
