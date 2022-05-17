import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { ExtractDataService } from './extract.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectDataService } from './project.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { Store } from '@ngxs/store';
import { ActivityService } from '../activity.service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly activities = new ActivityDataService(
    this.activityService,
    this.http,
    this.store
  );
  readonly auth = new AuthDataService(this.http);
  readonly extracts = new ExtractDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);

  public constructor(
    private readonly activityService: ActivityService,
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}
}
