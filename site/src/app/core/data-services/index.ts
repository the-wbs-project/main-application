import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { InviteDataService } from './invite.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectExportDataService } from './project-export.data-service';
import { ProjectImportDataService } from './project-import.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { StaticFileDataService } from './static-files.data-service';
import { UserDataService } from './user.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly activities = new ActivityDataService(this.http, this.store);
  readonly auth = new AuthDataService(this.http);
  readonly invites = new InviteDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly projectExport = new ProjectExportDataService(this.http);
  readonly projectImport = new ProjectImportDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectSnapshots = new ProjectSnapshotDataService(this.http);
  readonly staticFiles = new StaticFileDataService(this.http);
  readonly users = new UserDataService(this.http);

  public constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}
}
