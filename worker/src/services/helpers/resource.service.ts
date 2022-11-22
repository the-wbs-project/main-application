import { Resources } from '../../models';
import { IResourceService } from './resource.service-interface';

export class ResourceService implements IResourceService {
  constructor(private readonly resources: Resources) {}

  get(resource: string): string {
    if (resource == null) return 'EMPTY';

    const parts = resource.split('.');

    try {
      if (!this.resources) return resource;

      const part1 = this.resources[parts[0]];

      if (!part1) return resource;

      const x = part1[parts[1]];

      if (x) return x;
      //
      //  Missing territory
      //
    } catch (e) {
      console.error(`Error trying to retrieve '${resource}' value.`);
    }
    return resource;
  }
}
