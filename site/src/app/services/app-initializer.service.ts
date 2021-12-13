import { of } from 'rxjs';
import { Resources } from './resource.service';
import { StartupService } from './startup.service';

export class AppInitializerFactory {
  static run(resources: Resources, startup: StartupService) {
    return () => {
      resources.setup(startup.resources);

      return of(null);
    };
  }
}
