import { AuthClientConfig } from '@auth0/auth0-angular';
import { Resources } from '../core/services/resource.service';
import { AppConfig } from '../core/services/app-config.service';

export class AppInitializerFactory {
  static run(resources: Resources, auth: AuthClientConfig, config: AppConfig) {
    return () => {
      auth.set(config.authConfig);

      return resources.initiate();
    };
  }
}
