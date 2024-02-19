import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TasksChanged, VersionChanged } from '../actions';
import { EntryViewState } from '../states';
import { EntryTaskService } from './entry-task.service';
import { EntryActivityService } from './entry-activity.service';

@Injectable()
export class EntryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly messaging = inject(Messages);
  private readonly store = inject(Store);
  private readonly taskService = inject(EntryTaskService);

  private get entry(): LibraryEntry {
    return this.store.selectSnapshot(EntryViewState.entry)!;
  }

  private get version(): LibraryEntryVersion {
    return this.store.selectSnapshot(EntryViewState.version)!;
  }

  titleChangedAsync(title: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.title;

    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messaging.notify.success('Library.TitleChanged')),
      switchMap(() => this.store.dispatch(new VersionChanged(version))),
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
      tap(() => this.messaging.notify.success('Library.DescriptionChanged')),
      switchMap(() => this.store.dispatch(new VersionChanged(version))),
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

  setupPhaseTaskAsync(phaseTitle: string): Observable<void> {
    const id = IdService.generate();
    const entry = this.entry;
    const version = structuredClone(this.version);

    version.phases = [
      {
        id,
        label: phaseTitle,
        order: 1,
        tags: [],
        type: 'phase',
      },
    ];
    const node: LibraryEntryNode = {
      id,
      title: phaseTitle,
      entryId: entry.id,
      entryVersion: version.version,
      lastModified: new Date(),
      order: 1,
    };
    return forkJoin([
      this.taskService.saveAsync(
        entry.owner,
        entry.id,
        version.version,
        [node],
        [],
        undefined
      ),
      this.data.libraryEntryVersions.putAsync(entry.owner, version),
    ]).pipe(
      tap(() =>
        this.messaging.notify.success('Library.PhaseSetupSuccess', false)
      ),
      switchMap(() =>
        this.store.dispatch([
          new VersionChanged(version),
          new TasksChanged([node], []),
        ])
      ),
      switchMap(() =>
        this.activity.setupPhaseEntry(entry.id, version.version, phaseTitle)
      )
    );
  }

  setupTaskAsync(taskTitle: string): Observable<void> {
    const id = IdService.generate();
    const entry = this.entry;
    const version = this.version;

    const node: LibraryEntryNode = {
      id,
      title: taskTitle,
      entryId: entry.id,
      entryVersion: version.version,
      lastModified: new Date(),
      order: 1,
    };
    return forkJoin([
      this.taskService.saveAsync(
        entry.owner,
        entry.id,
        version.version,
        [node],
        [],
        undefined
      ),
    ]).pipe(
      tap(() =>
        this.messaging.notify.success('Library.TaskSetupSuccess', false)
      ),
      switchMap(() => this.store.dispatch([new TasksChanged([node], [])])),
      switchMap(() =>
        this.activity.setupTaskEntry(entry.id, version.version, taskTitle)
      )
    );
  }
}
