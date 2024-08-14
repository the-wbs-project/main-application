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
  AppConfiguration,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages, Transformers, Utils } from '@wbs/core/services';
import { EntryStore, MembershipStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
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
  private readonly transformers = inject(Transformers);

  private get version(): LibraryVersionViewModel {
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

  static getEntryApiUrl(
    appConfig: AppConfiguration,
    route: ActivatedRouteSnapshot
  ): string {
    return [
      appConfig.api_domain,
      'api',
      'portfolio',
      Utils.getParam(route, 'org'),
      'library',
      'entries',
      Utils.getParam(route, 'entryId'),
      'versions',
      Utils.getParam(route, 'versionId'),
    ].join('/');
  }

  static getTaskApiUrl(
    appConfig: AppConfiguration,
    route: ActivatedRouteSnapshot
  ): string {
    return [
      appConfig.api_domain,
      'api',
      'portfolio',
      Utils.getParam(route, 'org'),
      'library',
      'entries',
      Utils.getParam(route, 'entryId'),
      'versions',
      Utils.getParam(route, 'versionId'),
      'nodes',
      Utils.getParam(route, 'taskId'),
    ].join('/');
  }

  createAsync(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[]
  ): Observable<void> {
    return this.data.libraryEntries.putAsync(entry).pipe(
      switchMap(() =>
        this.data.libraryEntryVersions.putAsync(entry.ownerId, version)
      ),
      switchMap(() =>
        this.data.libraryEntryNodes.putAsync(
          entry.ownerId,
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
    const tasks = structuredClone(this.entryStore.viewModels()!);

    for (const task of tasks) {
      task.childrenIds = [];
    }
    this.data.wbsExport
      .runAsync(
        version.title,
        'xlsx',
        version.disciplines.filter((x) => x.isCustom),
        tasks
      )
      .subscribe();
  }

  createProject(): void {
    const org = this.membership.membership()!.name;

    ProjectCreationComponent.launchAsync(
      this.dialogService,
      org,
      this.entryStore.version()!,
      this.entryStore.tasks()!
    )
      .pipe(
        filter((x) => x != undefined && !(x instanceof DialogCloseResult)),
        map((id) => <string>id),
        switchMap((id) =>
          this.store.dispatch(new Navigate(['/', org, 'projects', 'view', id]))
        )
      )
      .subscribe();
  }

  saveAsync(version: LibraryVersionViewModel): Observable<void> {
    const model = this.transformers.libraryVersions.toModel(version);

    return this.data.libraryEntryVersions
      .putAsync(version.ownerId, model)
      .pipe(map(() => this.entryStore.setVersion(version)));
  }

  versionAliasChangedAsync(alias: string): Observable<void> {
    const version = structuredClone(this.version);
    const from = version.versionAlias;

    version.versionAlias = alias;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.versionAliasChanged(
          version.entryId,
          version.version,
          from,
          alias
        )
      )
    );
  }

  titleChangedAsync(title: string): Observable<void> {
    const version = structuredClone(this.version);
    const from = version.title;

    version.title = title;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.entryTitleChanged(
          version.entryId,
          version.version,
          from,
          title
        )
      )
    );
  }

  descriptionChangedAsync(description: string): Observable<void> {
    const version = structuredClone(this.version);
    const from = version.description;

    version.description = description;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.entryTitleChanged(
          version.entryId,
          version.version,
          from,
          description
        )
      )
    );
  }

  disciplinesChangedAsync(disciplines: ProjectCategory[]): Observable<void> {
    const version = this.version;
    const from = version.disciplines;

    version.disciplines = disciplines;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.entryDisciplinesChanged(
          version.entryId,
          version.version,
          from,
          disciplines
        )
      )
    );
  }

  publish(): void {
    this.messages.confirm
      .show('General.Confirm', 'Wbs.ConfirmPublishToLibrary')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(answer);

          const version = this.version;
          version.status = 'published';

          const model = this.transformers.libraryVersions.toModel(version);

          return this.data.libraryEntryVersions
            .publishAsync(version.ownerId, model)
            .pipe(
              switchMap(() =>
                this.activity.publishedVersion(version.entryId, version.version)
              ),
              tap(() => {
                version.lastModified = new Date();

                this.messages.report.success(
                  'General.Success',
                  'Wbs.PublishedToLibraryMessage'
                );
                this.entryStore.setVersion(version);
              })
            );
        })
      )
      .subscribe();
  }

  unpublish(): void {
    /*this.messages.confirm
      .show('General.Confirm', 'Wbs.ConfirmUnPublishFromLibrary')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(answer);

          const entry = this.entry;
          const version = this.version;

          entry.publishedVersion = undefined;
          version.status = 'draft';

          return this.data.libraryEntries.putAsync(entry).pipe(
            switchMap(() =>
              this.data.libraryEntryVersions.putAsync(entry.owner, version)
            ),
            tap(() => {
              this.entryStore.setEntry(entry);
              this.entryStore.setVersion(version);

              this.messages.report.success(
                'General.Success',
                'Wbs.UnpublishedFromLibraryMessage'
              );
            })
          );
        })
      )
      .subscribe();*/
  }
}
