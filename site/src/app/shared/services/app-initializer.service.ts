import { Resources, StartupService } from '@wbs/services';
import { of } from 'rxjs';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(
    resources: Resources,
    startup: StartupService,
    theme: ThemeService
  ) {
    return () => {
      resources.setup(startup.resources);
      theme.apply();

      return of(null);
    };
  }
}
