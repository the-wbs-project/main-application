import { Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ImportPerson,
  ImportResultStats,
  WbsImportResult,
  UploadResults,
  ProjectCategory,
} from '@wbs/core/models';
import { CategoryService, Transformers } from '@wbs/core/services';
import { Utils } from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { ProjectViewModel } from '@wbs/core/view-models';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PROJECT_ACTIONS } from '../../../../../models';
import { SaveProject, VerifyTasks } from '../../../actions';
import { ProjectState } from '../../../states';
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
  name: 'projectUpload',
  defaults: {
    loadingFile: false,
    saving: false,
    started: false,
  },
})
export class ProjectUploadState {
  private readonly categoryService = inject(CategoryService);
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(Store);
  private readonly transformer = inject(Transformers);
  private readonly userStore = inject(UserStore);

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

  private get project(): ProjectViewModel {
    return this.store.selectSnapshot(ProjectState.current)!;
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
      return ctx.dispatch(
        new Navigate([...this.urlPrefix(), 'ticket', 'other'])
      );
    }
    ctx.patchState({
      loadingFile: true,
    });

    return ctx.dispatch(new Navigate([...this.urlPrefix(), 'results']));
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
      catchError((err, caught) =>
        ctx.dispatch(new Navigate([...this.urlPrefix(), 'ticket', 'error']))
      )
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
        this.membership.membership()!.displayName,
        this.userStore.profile()!
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
  ): Observable<void> {
    ctx.patchState({
      action: answer,
    });
    const urlSuffix =
      ctx.getState().fileType === 'excel' ? 'saving' : 'disciplines';
    return ctx.dispatch(new Navigate([...this.urlPrefix(), urlSuffix]));
  }

  @Action(PeopleCompleted)
  peopleCompleted(
    ctx: StateContext<StateModel>,
    { results }: PeopleCompleted
  ): Observable<void> {
    ctx.patchState({
      peopleList: results,
    });
    return ctx.dispatch(new Navigate([...this.urlPrefix(), 'saving']));
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
    const pDisciplines = this.project.disciplines;
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
    const proj = this.project;

    return forkJoin({
      project: this.data.projects.getAsync(proj.owner, proj.id),
      existingNodes: this.data.projectNodes.getAllAsync(proj.owner, proj.id),
    }).pipe(
      switchMap((data) => {
        const results = this.transformer.nodes.phase.projectImporter.run(
          data.project,
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
    const project = this.project;

    project.disciplines = this.categoryService.buildViewModels(
      results.disciplines
    );

    const saves: Observable<any>[] = [ctx.dispatch(new SaveProject(project))];

    if (results.removeIds.length > 0 || results.upserts.length > 0) {
      saves.push(
        this.data.projectNodes.putAsync(
          project.owner,
          project.id,
          results.upserts.map((node) => ({
            ...node,
            projectId: project.id,
            absFlag: null,
          })),
          results.removeIds
        )
      );
    }

    if (saves.length === 0) return;

    return forkJoin(saves).pipe(
      switchMap(() =>
        this.data.projectNodes.getAllAsync(project.owner, project.id)
      ),
      switchMap((nodes) =>
        this.data.activities.saveProjectActivitiesAsync(
          this.userStore.userId()!,
          [
            {
              data: {
                action: PROJECT_ACTIONS.UPLOADED,
                topLevelId: project.id,
                data: {},
              },
              project,
              nodes,
            },
          ]
        )
      ),
      switchMap(() => ctx.dispatch(new VerifyTasks(true)))
    );
  }

  private urlPrefix(): string[] {
    const p = this.project;

    return ['/', p.owner, 'projects', 'view', p.id, 'upload'];
  }
}
