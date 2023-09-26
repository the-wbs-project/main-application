import { Resources } from './resource.service';

export class AppInitializerFactory {
  static run(resources: Resources) {
    return () => {
      return resources.initiate();
    };
  }
}
