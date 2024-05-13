import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ProjectCreationComponent } from '@wbs/components/project-creation-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Category,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages, Utils } from '@wbs/core/services';
import { EntryStore, MembershipStore } from '@wbs/store';
import { Observable, forkJoin } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EntryActivityService } from './entry-activity.service';

@Injectable()
export class EntryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly membership = inject(MembershipStore);
  private readonly messages = inject(Messages);
  private readonly entryStore = inject(EntryStore);
  private readonly store = inject(Store);

  private get entry(): LibraryEntry {
    return this.entryStore.entry()!;
  }

  private get version(): LibraryEntryVersion {
    return this.entryStore.version()!;
  }

  static getEntryUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      '/',
      Utils.getParam(route, 'org'),
      'library',
      'view',
      Utils.getParam(route, 'ownerId'),
      Utils.getParam(route, 'entryId'),
      Utils.getParam(route, 'versionId'),
    ];
  }

  createAsync(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[]
  ): Observable<void> {
    return this.data.libraryEntries.putAsync(entry).pipe(
      switchMap(() =>
        this.data.libraryEntryVersions.putAsync(entry.owner, version)
      ),
      switchMap(() =>
        this.data.libraryEntryNodes.putAsync(
          entry.owner,
          entry.id,
          version.version,
          tasks,
          []
        )
      ),
      tap(() => this.activity.entryCreated(entry.id, entry.type, version.title))
    );
  }

  downloadTasks(): void {
    this.messages.notify.info('General.RetrievingData');

    const version = this.entryStore.version()!;
    const customDisciplines: Category[] = [];

    for (const d of version.disciplines) {
      if (typeof d !== 'string')
        customDisciplines.push({
          id: d.id,
          label: d.label,
          description: d.description,
        });
    }
    const tasks = structuredClone(this.entryStore.viewModels()!);

    for (const task of tasks) {
      task.subTasks = [];
      task.parent = undefined;
    }
    this.data.wbsExport
      .runAsync(version.title, 'xlsx', customDisciplines, tasks)
      .subscribe();
  }

  createProject(): void {
    const org = this.membership.organization()!.name;

    ProjectCreationComponent.launchAsync(
      this.dialogService,
      org,
      this.entryStore.version()!,
      this.entryStore.tasks()!
    )
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        map((id) => <string>id),
        switchMap((id) =>
          this.store.dispatch(new Navigate(['/', org, 'projects', 'view', id]))
        )
      )
      .subscribe();
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
        this.entryStore.setEntry(entry);
        this.entryStore.setVersion(version);
      })
    );
  }

  titleChangedAsync(title: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.title;

    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.entryStore.setVersion(version)),
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
      tap(() => this.entryStore.setVersion(version)),
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
      tap(() => this.entryStore.setVersion(version)),
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
