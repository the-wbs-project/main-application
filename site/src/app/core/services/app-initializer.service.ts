import { Resources, StartupService } from '@app/services';
import { of } from 'rxjs';

export class AppInitializerFactory {
  static run(resources: Resources, startup: StartupService) {
    return () => {
      resources.setup(startup.resources);

      return of(null);
    };
  }
}
