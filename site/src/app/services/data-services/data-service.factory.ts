import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDataService } from './project.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly project: ProjectDataService;

  public constructor(http: HttpClient) {
    this.project = new ProjectDataService(http);
  }
}
