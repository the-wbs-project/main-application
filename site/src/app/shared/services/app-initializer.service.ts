import { Store } from '@ngxs/store';
import { SetupCategories } from '@wbs/actions';
import { Resources, StartupService } from '@wbs/services';
import { DataServiceFactory } from './data-services';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(
    store: Store,
    data: DataServiceFactory,
    resources: Resources,
    startup: StartupService,
    theme: ThemeService
  ) {
    return () => {
      console.log('resources setup');
      resources.setup(startup.resources);
      data.initialize();
      theme.apply();

      return store.dispatch(new SetupCategories());
    };
  }
}
