import { AuthClientConfig, AuthService } from '@auth0/auth0-angular';
import { Resources } from './resource.service';
import { AppConfig } from './app-config.service';

export class AppInitializerFactory {
  static run(resources: Resources, auth: AuthClientConfig, config: AppConfig) {
    return () => {
      auth.set(config.authConfig);

      return resources.initiate();
    };
  }
}
