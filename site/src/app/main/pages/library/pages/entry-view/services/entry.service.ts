import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Category,
  LibraryEntry,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Utils } from '@wbs/main/services';
import { MembershipState } from '@wbs/main/states';
import { Observable, forkJoin } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ProjectCreationComponent } from '../components/project-creation';
import { EntryActivityService } from './entry-activity.service';
import { EntryState } from './entry-state.service';

@Injectable()
export class EntryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly messages = inject(Messages);
  private readonly state = inject(EntryState);
  private readonly store = inject(Store);

  private get entry(): LibraryEntry {
    return this.state.entry()!;
  }

  private get version(): LibraryEntryVersion {
    return this.state.version()!;
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

  downloadTasks(): void {
    this.messages.notify.info('General.RetrievingData');

    const version = this.state.version()!;
    const customDisciplines: Category[] = [];

    for (const d of version.disciplines) {
      if (typeof d !== 'string')
        customDisciplines.push({
          id: d.id,
          label: d.label,
          description: d.description,
        });
    }
    const tasks = structuredClone(this.state.viewModels()!);

    for (const task of tasks) {
      task.subTasks = [];
      task.parent = undefined;
    }
    this.data.wbsExport
      .runAsync(version.title, 'xlsx', customDisciplines, tasks)
      .subscribe();
  }

  createProject(): void {
    const org = this.store.selectSnapshot(MembershipState.organization)!.name;
    const dialog = this.dialogService.open({
      content: ProjectCreationComponent,
    });
    (dialog.content.instance as ProjectCreationComponent).setup(
      this.state.version()!,
      this.state.tasks()!
    );
    dialog.result
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
      tap(() => this.state.setVersion(version)),
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
      tap(() => this.state.setVersion(version)),
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
