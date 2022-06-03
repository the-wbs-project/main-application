import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { ExtractDataService } from './extract.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectDataService } from './project.data-service';
import { UserDataService } from './user.data-service';
import { ActivityService } from '../activity.service';
import { InviteDataService } from './invite.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly activities = new ActivityDataService(
    this.activityService,
    this.http,
    this.store
  );
  readonly auth = new AuthDataService(this.http);
  readonly extracts = new ExtractDataService(this.http);
  readonly invites = new InviteDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);
  readonly users = new UserDataService(this.http);

  public constructor(
    private readonly activityService: ActivityService,
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}
}
