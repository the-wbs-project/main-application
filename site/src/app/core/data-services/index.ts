import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivityDataService } from './activity.data-service';
import { AiDataService } from './ai.data-service';
import { AiChatDataService } from './ai-chat.data-service';
import { ChatDataService } from './chat.data-service';
import { ClaimsDataService } from './claims.data-service';
import { JiraDataService } from './jira.data-service';
import { LibraryEntryDataService } from './library-entry.data-service';
import { LibraryEntryNodeDataService } from './library-entry-node.data-service';
import { ContentResourcesDataService } from './content-resources.data-service';
import { LibraryEntryVersionDataService } from './library-entry-version.data-service';
import { LibraryEntryWatcherDataService } from './library-entry-watcher.data-service';
import { MembershipDataService } from './membership.data-service';
import { MetdataDataService } from './metdata.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { StaticFileDataService } from './static-files.data-service';
import { UserDataService } from './user.data-service';
import { WbsExportDataService } from './wbs-export.data-service';
import { WbsImportDataService } from './wbs-import.data-service';
import { MiscDataService } from './misc.data-service';
import { LibraryDataService } from './library.data-service';

@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  private readonly http = inject(HttpClient);

  readonly activities = new ActivityDataService(this.http);
  readonly ai = new AiDataService(this.http);
  readonly aiChat = new AiChatDataService(this.http);
  readonly chat = new ChatDataService(this.http);
  readonly claims = new ClaimsDataService(this.http);
  readonly contentResources = new ContentResourcesDataService(this.http);
  readonly jira = new JiraDataService(this.http);
  readonly library = new LibraryDataService(this.http);
  readonly libraryEntries = new LibraryEntryDataService(this.http);
  readonly libraryEntryNodes = new LibraryEntryNodeDataService(this.http);
  readonly libraryEntryVersions = new LibraryEntryVersionDataService(this.http);
  readonly libraryEntryWatchers = new LibraryEntryWatcherDataService(this.http);
  readonly memberships = new MembershipDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly misc = new MiscDataService(this.http);
  readonly organizations = new OrganizationDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectSnapshots = new ProjectSnapshotDataService(this.http);
  readonly staticFiles = new StaticFileDataService(this.http);
  readonly users = new UserDataService(this.http);
  readonly wbsExport = new WbsExportDataService(this.http);
  readonly wbsImport = new WbsImportDataService(this.http);
}
