import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  LibraryEntryVersionBasic,
  ProjectNodeToLibraryOptions,
} from '../models';
import { Utils } from '../services';
import { LibraryVersionViewModel } from '../view-models';

declare type VersionWithTasksAndClaims = {
  versions: LibraryEntryVersionBasic[];
  version: LibraryVersionViewModel;
  tasks: LibraryEntryNode[];
  claims: string[];
};

export class LibraryEntryDataService {
  constructor(private readonly http: HttpClient) {}

  getIdAsync(owner: string, recordId: string): Observable<string> {
    return this.http.get<string>(this.url(owner, recordId) + '/id');
  }

  getRecordIdAsync(owner: string, recordId: string): Observable<string> {
    return this.http.get<string>(this.url(owner, recordId) + '/recordId');
  }

  getVersionByIdAsync(
    owner: string,
    recordId: string,
    version: number,
    nodeVisibility: string
  ): Observable<VersionWithTasksAndClaims> {
    return this.http
      .get<VersionWithTasksAndClaims>(
        this.url(owner, recordId, version, nodeVisibility)
      )
      .pipe(map((res) => this.clean(res)));
  }

  putEntryAsync(entry: LibraryEntry): Observable<LibraryEntry> {
    return this.http.put<LibraryEntry>(
      this.url(entry.ownerId, entry.id),
      entry
    );
  }

  putVersionAsync(
    owner: string,
    entryVersion: LibraryEntryVersion
  ): Observable<void> {
    return this.http.put<void>(
      this.url(owner, entryVersion.entryId, entryVersion.version),
      entryVersion
    );
  }

  publishVersionAsync(
    owner: string,
    entryVersion: LibraryEntryVersion
  ): Observable<void> {
    return this.http.put<void>(
      this.url(owner, entryVersion.entryId, entryVersion.version, 'publish'),
      entryVersion
    );
  }

  replicateVersionAsync(
    owner: string,
    entryId: string,
    version: number,
    alias: string
  ): Observable<number> {
    return this.http.put<number>(
      this.url(owner, entryId, version, 'replicate'),
      {
        alias,
      }
    );
  }

  putTasksAsync(
    owner: string,
    entryId: string,
    version: number,
    upserts: LibraryEntryNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(this.url(owner, entryId, version, 'nodes'), {
      upserts,
      removeIds,
    });
  }

  exportTasksAsync(
    owner: string,
    entryId: string,
    version: number,
    nodeId: string,
    targetOwnerId: string,
    model: ProjectNodeToLibraryOptions
  ): Observable<string> {
    return this.http.post(
      this.url(
        owner,
        entryId,
        version,
        `nodes/${nodeId}/export/${targetOwnerId}`
      ),
      model,
      { responseType: 'text' }
    );
  }

  private url(
    owner: string,
    entryId: string,
    version?: number,
    suffix?: string
  ): string {
    const parts = [`api/portfolio/${owner}/library/entries/${entryId}`];
    if (version) parts.push('versions', version.toString());
    if (suffix) parts.push(suffix);

    return parts.join('/');
  }

  private clean(obj: VersionWithTasksAndClaims): VersionWithTasksAndClaims {
    Utils.cleanDates(obj.version, 'lastModified');
    Utils.cleanDates(obj.tasks, 'lastModified');

    return obj;
  }
}
