import { ProjectHttpService } from './project.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { SiteHttpService } from './site.http-service';
import { WbsHttpService } from './wbs.http-service';

export const Http = {
  project: ProjectHttpService,
  metadata: MetadataHttpService,
  site: SiteHttpService,
  wbs: WbsHttpService,
};
