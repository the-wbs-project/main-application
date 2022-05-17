import { ActivityHttpService } from './activity.http-service';
import { AzureHttpService } from './azure.http-service';
import { BaseHttpService } from './base.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { ProjectNodeHttpService } from './project-node.http-service';
import { ProjectHttpService } from './project.http-service';
import { SiteHttpService } from './site.http-service';

export const Http = {
  activity: ActivityHttpService,
  azure: AzureHttpService,
  metadata: MetadataHttpService,
  project: ProjectHttpService,
  projectNodes: ProjectNodeHttpService,
  site: SiteHttpService,

  json: BaseHttpService.buildJson,
};
