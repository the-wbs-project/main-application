import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ProjectCreationComponent } from '@wbs/components/project-creation-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ProjectCategory } from '@wbs/core/models';
import {
  Messages,
  NavigationService,
  Transformers,
  Utils,
} from '@wbs/core/services';
import { EntryStore, MembershipStore } from '@wbs/core/store';
import { LibraryVersionViewModel, UserViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { EntryActivityService } from '../../../services/entry-activity.service';
import { NewVersionDialogComponent } from '../components/new-version-dialog';
import { PublishVersionDialogComponent } from '../components/publish-version-dialog';

@Injectable()
export class LibraryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly membership = inject(MembershipStore);
  private readonly messages = inject(Messages);
  private readonly navigate = inject(NavigationService);
  private readonly entryStore = inject(EntryStore);
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
      Utils.getParam(route, 'recordId'),
      Utils.getParam(route, 'versionId'),
    ];
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
        map((id) => <string>id)
      )
      .subscribe((id) => this.navigate.toProject(id));
  }

  createNewVersion(): void {
    NewVersionDialogComponent.launch(
      this.dialogService,
      this.entryStore.versions()!,
      this.version,
      (version: number, alias: string) => {
        return this.saveNewVersion(version, alias);
      }
    );
  }

  saveNewVersion(version: number, alias: string): Observable<void> {
    const owner = this.version.ownerId;
    const entryId = this.version.entryId;
    const recordId = this.version.recordId;

    return this.data.libraryEntries
      .replicateVersionAsync(owner, entryId, version, alias)
      .pipe(
        map((newVersion) => {
          this.navigate.toLibraryEntry(owner, recordId, newVersion);
        })
      );
  }

  cancelVersion(): void {
    const version = this.version;

    this.messages.confirm
      .showWithFeedback(
        'Wbs.CancelVersionConfirm',
        'Wbs.CancelVersionPrompt',
        {},
        'Wbs.CancelVersion',
        'General.Nevermind'
      )
      .pipe(
        switchMap((feedback) => {
          if (!feedback.answer) return of(false);

          version.status = 'cancelled';

          return this.saveAsync(version).pipe(
            switchMap(() =>
              this.activity.cancelVersion(
                version.ownerId,
                version.entryId,
                version.version,
                version.title,
                feedback.message!
              )
            )
          );
        })
      )
      .subscribe();
  }

  saveAsync(version: LibraryVersionViewModel): Observable<void> {
    const model = this.transformers.libraryVersions.toModel(version);

    return this.data.libraryEntries
      .putVersionAsync(version.ownerId, model)
      .pipe(map(() => this.entryStore.setVersion(version)));
  }

  categoryChangedAsync(category: string): Observable<void> {
    const version = structuredClone(this.version);
    const from = version.category;

    version.category = category;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.categoryChanged(
          version.ownerId,
          version.entryId,
          version.version,
          from,
          category
        )
      )
    );
  }

  versionAliasChangedAsync(alias: string): Observable<void> {
    const version = structuredClone(this.version);
    const from = version.versionAlias;

    version.versionAlias = alias;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.versionAliasChanged(
          version.ownerId,
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
          version.ownerId,
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
          version.ownerId,
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
          version.ownerId,
          version.entryId,
          version.version,
          from,
          disciplines
        )
      )
    );
  }

  contributorsChangedAsync(contributors: UserViewModel[]): Observable<void> {
    const version = this.version;
    const from = version.editors;

    version.editors = contributors;

    return this.saveAsync(version).pipe(
      switchMap(() =>
        this.activity.contributorsChanged(
          version.ownerId,
          version.entryId,
          version.version,
          from,
          contributors
        )
      )
    );
  }

  publish(): void {
    const saveFunction = (notes: string) => {
      const version = this.version;
      version.status = 'published';
      version.releaseNotes = notes;

      const model = this.transformers.libraryVersions.toModel(version);

      return this.data.libraryEntries
        .publishVersionAsync(version.ownerId, model)
        .pipe(
          switchMap(() =>
            this.activity.publishedVersion(
              version.ownerId,
              version.entryId,
              version.version
            )
          ),
          map(() => {
            return version;
          })
        );
    };

    PublishVersionDialogComponent.launchAsync(
      this.dialogService,
      saveFunction
    ).subscribe((version) => {
      if (!version) return;

      version.lastModified = new Date();

      this.messages.report.success(
        'General.Success',
        'Wbs.PublishedToLibraryMessage'
      );
      this.entryStore.setVersion(version);
    });
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
