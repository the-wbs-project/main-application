import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDataService } from './project.data-service';
import { WbsDataService } from './wbs.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly project: ProjectDataService;
  readonly wbs: WbsDataService;

  public constructor(http: HttpClient) {
    this.project = new ProjectDataService(http);
    this.wbs = new WbsDataService(http);
  }
}
