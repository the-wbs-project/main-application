import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityDataService } from './activity.data-service';
import { AiDataService } from './ai.data-service';
import { AiChatDataService } from './ai-chat.data-service';
import { ChatDataService } from './chat.data-service';
import { ClaimsDataService } from './claims.data-service';
import { JiraDataService } from './jira.data-service';
import { MembershipDataService } from './membership.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectExportDataService } from './project-export.data-service';
import { ProjectImportDataService } from './project-import.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectResourcesDataService } from './project-resources.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { StaticFileDataService } from './static-files.data-service';
import { UserDataService } from './user.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly activities = new ActivityDataService(this.http);
  readonly ai = new AiDataService(this.http);
  readonly aiChat = new AiChatDataService(this.http);
  readonly chat = new ChatDataService(this.http);
  readonly claims = new ClaimsDataService(this.http);
  readonly jira = new JiraDataService(this.http);
  readonly memberships = new MembershipDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly projectExport = new ProjectExportDataService(this.http);
  readonly projectImport = new ProjectImportDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);
  readonly projectResources = new ProjectResourcesDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectSnapshots = new ProjectSnapshotDataService(this.http);
  readonly staticFiles = new StaticFileDataService(this.http);
  readonly users = new UserDataService(this.http);

  public constructor(private readonly http: HttpClient) {}
}
