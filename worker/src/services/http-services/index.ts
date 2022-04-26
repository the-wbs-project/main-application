import { MetadataHttpService } from './metdata.http-service';
import { ProjectHttpService } from './project.http-service';
import { ProjectNodeHttpService } from './project-node.http-service';
import { SiteHttpService } from './site.http-service';

export const Http = {
  project: ProjectHttpService,
  projectNodes: ProjectNodeHttpService,
  metadata: MetadataHttpService,
  site: SiteHttpService,
};
