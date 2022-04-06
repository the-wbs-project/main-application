import { Resources, StartupService } from '@wbs/services';
import { of } from 'rxjs';
import { DataServiceFactory } from './data-services';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(
    data: DataServiceFactory,
    resources: Resources,
    startup: StartupService,
    theme: ThemeService
  ) {
    return () => {
      resources.setup(startup.resources);
      data.initialize();
      theme.apply();

      return of(null);
    };
  }
}
