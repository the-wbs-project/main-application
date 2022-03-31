import { ProjectHttpService } from './project.http-service';
import { ResourcesHttpService } from './resources.http-service';
import { SiteHttpService } from './site.http-service';
import { WbsHttpService } from './wbs.http-service';

export const Http = {
  project: ProjectHttpService,
  resources: ResourcesHttpService,
  site: SiteHttpService,
  wbs: WbsHttpService,
};
