import { Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ImportPerson,
  ImportResultStats,
  WbsImportResult,
  UploadResults,
  ProjectCategory,
} from '@wbs/core/models';
import { Transformers, Utils } from '@wbs/core/services';
import { EntryActivityService } from '@wbs/core/services/library';
import {
  EntryStore,
  MembershipStore,
  MetadataStore,
  UserStore,
} from '@wbs/core/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  AppendOrOvewriteSelected,
  CreateJiraTicket,
  FileUploaded,
  LoadProjectFile,
  PeopleCompleted,
  PrepUploadToSave,
  ProcessFile,
  SaveUpload,
  SetAsStarted,
  SetPageTitle,
} from '../actions';

const EXTENSION_PAGES: Record<string, string> = {
  xlsx: 'excel',
  mpp: 'project',
};

interface StateModel {
  action?: 'append' | 'overwrite';
  extension?: string;
  fileType?: string;
  loadingFile: boolean;
  pageTitle?: string;
  peopleList?: ImportPerson[];
  rawFile?: FileInfo;
  saving: boolean;
  started: boolean;
  stats?: ImportResultStats;
  uploadResults?: UploadResults<WbsImportResult>;
}

@Injectable()
@State<StateModel>({
  name: 'libraryUpload',
  defaults: {
    loadingFile: false,
    saving: false,
    started: false,
  },
})
export class EntryUploadState {
  private readonly activities = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly entryStore = inject(EntryStore);
  private readonly membership = inject(MembershipStore);
  private readonly metadata = inject(MetadataStore);
  private readonly transformer = inject(Transformers);
  private readonly profile = inject(UserStore).profile;

  @Selector()
  static isOverwrite(state: StateModel): boolean {
    return state.action === 'overwrite';
  }

  @Selector()
  static errors(state: StateModel): string[] | undefined {
    return state.uploadResults?.errors;
  }

  @Selector()
  static fileType(state: StateModel): string | undefined {
    return state.fileType;
  }

  @Selector()
  static loadingFile(state: StateModel): boolean {
    return state.loadingFile;
  }

  @Selector()
  static pageTitle(state: StateModel): string | undefined {
    return state.pageTitle;
  }

  @Selector()
  static peopleList(state: StateModel): ImportPerson[] | undefined {
    return state.peopleList;
  }

  @Selector()
  static saving(state: StateModel): boolean {
    return state.saving;
  }

  @Selector()
  static started(state: StateModel): boolean {
    return state.started;
  }

  @Selector()
  static stats(state: StateModel): ImportResultStats | undefined {
    return state.stats;
  }

  @Selector()
  static uploadResults(
    state: StateModel
  ): UploadResults<WbsImportResult> | undefined {
    return state.uploadResults;
  }

  @Action(SetAsStarted)
  setAsStarted(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      started: true,
    });
  }

  @Action(SetPageTitle)
  setPageTitle(
    ctx: StateContext<StateModel>,
    { pageTitle }: SetPageTitle
  ): void {
    ctx.patchState({
      pageTitle,
    });
  }

  @Action(FileUploaded)
  fileUploaded(
    ctx: StateContext<StateModel>,
    { file }: FileUploaded
  ): void | Observable<void> {
    const parts = file.name.split('.');
    const extension = parts.at(-1)!.toLowerCase();
    const fileType = EXTENSION_PAGES[extension];

    ctx.patchState({
      fileType,
      extension,
      rawFile: file,
    });

    if (!fileType) {
      return this.navigate(ctx, ['ticket', 'other']);
    }
    ctx.patchState({
      loadingFile: true,
    });

    return this.navigate(ctx, ['results']);
  }

  @Action(LoadProjectFile)
  loadProjectFile(ctx: StateContext<StateModel>): void | Observable<any> {
    const state = ctx.getState();

    if (!state.rawFile || !state.extension) return;

    return Utils.getFileAsync(state.rawFile).pipe(
      switchMap((body) => this.data.wbsImport.runAsync(state.extension!, body)),
      switchMap((uploadResults) => {
        ctx.patchState({
          uploadResults,
          loadingFile: false,
        });

        return (uploadResults.errors ?? []).length === 0
          ? ctx.dispatch(new ProcessFile())
          : of();
      }),
      catchError((err, caught) => this.navigate(ctx, ['ticket', 'error']))
    );
  }

  @Action(CreateJiraTicket)
  createJiraTicket(
    ctx: StateContext<StateModel>,
    { description }: CreateJiraTicket
  ): void | Observable<any> {
    const state = ctx.getState();

    if (!state.rawFile) return;

    return forkJoin({
      body: Utils.getFileAsync(state.rawFile),
      jiraIssueId: this.data.jira.createUploadIssueAsync(
        description,
        this.membership.membership()!.display_name,
        this.profile()!
      ),
    }).pipe(
      switchMap(({ body, jiraIssueId }) =>
        this.data.jira.uploadAttachmentAsync(
          jiraIssueId,
          state.rawFile!.name,
          body
        )
      )
    );
  }

  @Action(ProcessFile)
  processFile(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();
    const fileType = state.fileType!;

    if (!state.uploadResults?.results) return;

    let phases = 0;
    const disciplines: string[] = [];
    const peopleList: ImportPerson[] = [];

    for (const row of state.uploadResults.results) {
      if (row.resources) {
        for (const resource of row.resources) {
          if (!resource) continue;

          if (fileType === 'excel') {
            if (disciplines.indexOf(resource.toLowerCase()) === -1) {
              disciplines.push(resource.toLowerCase());
            }
          } else {
            if (peopleList.findIndex((x) => x.name === resource) === -1) {
              peopleList.push({ name: resource });
            }
          }
        }
      }
      if (row.levelText.split('.').length === 1) phases++;
    }

    ctx.patchState({
      stats: {
        disciplines: disciplines.length,
        people: peopleList.length,
        phases,
        tasks: state.uploadResults.results.length,
      },
      peopleList,
    });
  }

  @Action(AppendOrOvewriteSelected)
  appendOrOvewriteSelected(
    ctx: StateContext<StateModel>,
    { answer }: AppendOrOvewriteSelected
  ): void {
    ctx.patchState({
      action: answer,
    });
  }

  @Action(PeopleCompleted)
  peopleCompleted(
    ctx: StateContext<StateModel>,
    { results }: PeopleCompleted
  ): Observable<void> {
    ctx.patchState({
      peopleList: results,
    });
    return this.navigate(ctx, ['saving']);
  }

  @Action(PrepUploadToSave)
  prepUploadToSave(ctx: StateContext<StateModel>): Observable<void> {
    ctx.patchState({
      saving: true,
    });
    const state = ctx.getState();
    const people = new Map<string, ProjectCategory>();
    const nodes = new Map<string, WbsImportResult>();
    //
    //  Put people into map
    //
    const pDisciplines = this.entryStore.version()?.disciplines ?? [];
    const cDisciplines = this.metadata.categories.disciplines;

    for (const person of state.peopleList ?? []) {
      if (person.discipline === undefined) continue;

      const p = pDisciplines.find(
        (x) => x.isCustom == true && x.id === person.discipline
      );

      if (p) {
        people.set(person.name.toLowerCase(), p);
        continue;
      }

      const d = cDisciplines.find((x) => x.id === person.discipline);

      if (d)
        people.set(person.name.toLowerCase(), { id: d.id, isCustom: false });
    }
    //
    //  Put nodes into map
    //
    for (const node of state.uploadResults?.results ?? []) {
      nodes.set(node.levelText, node);
    }
    const entry = this.entryStore.entry()!;
    const version = this.entryStore.version()!;

    return forkJoin({
      version: this.data.libraryEntryVersions.getAsync(
        entry.owner,
        entry.id,
        version.version
      ),
      existingNodes: this.data.libraryEntryNodes.getAllAsync(
        entry.owner,
        entry.id,
        version.version,
        'private'
      ),
    }).pipe(
      switchMap((data) => {
        const results = this.transformer.nodes.phase.libraryImporter.run(
          entry.type,
          data.version,
          data.existingNodes,
          state.action!,
          people,
          nodes
        );
        return ctx.dispatch(new SaveUpload(results)).pipe(
          map(() => {
            ctx.patchState({
              saving: false,
              started: false,
            });
          })
        );
      })
    );
  }

  @Action(SaveUpload)
  saveUpload(
    ctx: StateContext<StateModel>,
    { results }: SaveUpload
  ): void | Observable<any> {
    const entry = this.entryStore.entry()!;
    const version = this.entryStore.version()!;

    version.disciplines = results.disciplines;

    const saves: Observable<any>[] = [
      this.data.libraryEntryVersions
        .putAsync(entry.owner, version)
        .pipe(tap(() => this.entryStore.setVersion(version))),
    ];

    if (results.removeIds.length > 0 || results.upserts.length > 0) {
      saves.push(
        this.data.libraryEntryNodes.putAsync(
          entry.owner,
          entry.id,
          version.version,
          results.upserts,
          results.removeIds
        )
      );
    }

    if (saves.length === 0) return;

    return forkJoin(saves).pipe(
      switchMap(() =>
        this.data.libraryEntryNodes.getAllAsync(
          entry.owner,
          entry.id,
          version.version,
          'private'
        )
      ),
      tap((tasks) => this.entryStore.setTasks(tasks)),
      tap(() => this.activities.entryUpload(entry.id, version.version)),
      tap(() => ctx.patchState({ saving: false }))
    );
  }

  private navigate(
    ctx: StateContext<StateModel>,
    pages: string[]
  ): Observable<void> {
    const org = this.membership.membership()!.name;
    const entry = this.entryStore.entry()!;
    const version = this.entryStore.version()!;

    return ctx.dispatch(
      new Navigate([
        './' + org,
        'library',
        'view',
        entry.owner,
        entry.id,
        version.version.toString(),
        'upload',
        ...pages,
      ])
    );
  }
}
