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
import { tap } from 'rxjs/operators';
import { TasksChanged, VersionChanged } from '../actions';
import { EntryViewState } from '../states';
import { EntryTaskService } from './entry-task.service';

@Injectable()
export class EntryService {
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

    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messaging.notify.success('Library.TitleChanged')),
      tap(() => this.store.dispatch(new VersionChanged(version)))
    );
  }

  descriptionChangedAsync(description: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);

    version.description = description;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messaging.notify.success('Library.DescriptionChanged')),
      tap(() => this.store.dispatch(new VersionChanged(version)))
    );
  }

  setupPhaseTaskAsync(phaseTitle: string): Observable<void | void[]> {
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
      this.taskService.saveAsync([node], [], undefined),
      this.data.libraryEntryVersions.putAsync(entry.owner, version),
    ]).pipe(
      tap(() =>
        this.messaging.notify.success('Library.PhaseSetupSuccess', false)
      ),
      tap(() =>
        this.store.dispatch([
          new VersionChanged(version),
          new TasksChanged([node], []),
        ])
      )
    );
    /*
      tap(() => this.messaging.notify.success(message, false)),
      tap(() => ctx.patchState({ version }))
    );
    this.store
      .dispatch([new PhasesChanged([phase])])
      .pipe(switchMap(() => this.taskService.saveAsync([node], [], undefined)))
      .subscribe();*/
  }
}
