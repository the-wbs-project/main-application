import { Resources } from '../models';

export class ResourceService {
  private resources: Record<string, Record<string, string>> = {};

  constructor(list: Resources[]) {
    let resources: Record<string, Record<string, string>> = {};

    for (const item of list) {
      resources = {
        ...resources,
        ...item.values,
      };
    }
    this.resources = resources;
  }

  get(resource: string, defaultValue?: string): string {
    if (resource == null) return 'EMPTY';

    let value = this.getExact(resource);

    return value != null ? value : defaultValue != null ? defaultValue : resource;
  }

  private getExact(resource: string): string {
    if (resource == null) return 'EMPTY';
    if (resource.indexOf('.') === -1) return resource;

    const parts = resource.split('.');

    try {
      const result = this.resources[parts[0]][parts[1]];

      if (result) return result;

      console.error('No resource found for ' + resource);

      return resource;
    } catch (e) {
      console.log(e);
      console.error(`Error trying to retrieve '${resource}' value.`);
      return 'Error';
    }
  }
}
