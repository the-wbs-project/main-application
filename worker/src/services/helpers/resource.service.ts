import { Resources } from '../../models';
import { IResourceService } from './resource.service-interface';

export class ResourceService implements IResourceService {
  constructor(private readonly resources: Resources) {}

  get(resource: string): string {
    if (resource == null) return 'EMPTY';

    const parts = resource.split('.');

    try {
      const x = this.resources[parts[0]][parts[1]];

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
