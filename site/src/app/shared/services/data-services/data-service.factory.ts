import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { WbsDataService } from './wbs.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly project: ProjectDataService;
  readonly resources: ResourcesDataService;
  readonly wbs: WbsDataService;

  public constructor(http: HttpClient) {
    this.project = new ProjectDataService(http);
    this.resources = new ResourcesDataService(http);
    this.wbs = new WbsDataService(http);
  }
}
