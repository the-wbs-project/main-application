import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Resources } from './resource.service';
import { StartupService } from './startup.service';

export class AppInitializerFactory {
  static run(resources: Resources, startup: StartupService) {
    return () => {
      //resources.setup(startup.resources);
      resources.setup(environment.resources.en);

      return of(null);
    };
  }
}
