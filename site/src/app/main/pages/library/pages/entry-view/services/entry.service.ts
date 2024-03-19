import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EntryActivityService } from './entry-activity.service';
import { EntryState } from './entry-state.service';

@Injectable()
export class EntryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly state = inject(EntryState);

  private get entry(): LibraryEntry {
    return this.state.entry()!;
  }

  private get version(): LibraryEntryVersion {
    return this.state.version()!;
  }

  generalSaveAsync(
    entry: LibraryEntry,
    version: LibraryEntryVersion
  ): Observable<void> {
    return forkJoin([
      this.data.libraryEntries.putAsync(entry),
      this.data.libraryEntryVersions.putAsync(entry.owner, version),
    ]).pipe(
      map(() => {
        this.messages.notify.success('Library.Saved');
        this.state.setEntry(entry);
        this.state.setVersion(version);
      })
    );
  }

  titleChangedAsync(title: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.title;

    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      map(() => {
        this.messages.notify.success('Library.TitleChanged');
        this.state.setVersion(version);
      }),
      switchMap(() =>
        this.activity.entryTitleChanged(entry.id, version.version, from, title)
      )
    );
  }

  descriptionChangedAsync(description: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.description;

    version.description = description;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      map(() => {
        this.messages.notify.success('Library.DescriptionChanged');
        this.state.setVersion(version);
      }),
      switchMap(() =>
        this.activity.entryTitleChanged(
          entry.id,
          version.version,
          from,
          description
        )
      )
    );
  }

  disciplinesChangedAsync(disciplines: ProjectCategory[]): Observable<void> {
    const entry = this.entry;
    const version = this.version;
    const from = version.disciplines;

    version.disciplines = disciplines;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      map(() => {
        this.messages.notify.success('Library.DisciplinesChanged');
        this.state.setVersion(version);
      }),
      switchMap(() =>
        this.activity.entryDisciplinesChanged(
          entry.id,
          version.version,
          from,
          disciplines
        )
      )
    );
  }
}
