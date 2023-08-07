import { Resources } from './resource.service';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(resources: Resources, theme: ThemeService) {
    return () => {
      theme.apply();

      return resources.initiate();
    };
  }
}
