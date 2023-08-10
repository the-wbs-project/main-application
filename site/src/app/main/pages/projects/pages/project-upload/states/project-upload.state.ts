import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Project, ProjectImportResult, UploadResults } from '@wbs/core/models';
import { Messages, WbsTransformers } from '@wbs/core/services';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  AppendOrOvewriteSelected,
  FileUploaded,
  LoadProjectFile,
  PeopleCompleted,
  PhasesCompleted,
  PrepUploadToSave,
  ProcessFile,
  SaveUpload,
  SetAsStarted,
  SetPageTitle,
  SetProject,
} from '../actions';
import { PeopleListItem, PhaseListItem, ResultStats } from '../models';

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
  peopleList?: PeopleListItem[];
  phaseList?: PhaseListItem[];
  project?: Project;
  rawFile?: File;
  saving: boolean;
  started: boolean;
  stats?: ResultStats;
  uploadResults?: UploadResults<ProjectImportResult>;
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
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messenger: Messages,
    private readonly store: Store,
    private readonly transformer: WbsTransformers
  ) {}

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.project;
  }

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
  static peopleList(state: StateModel): PeopleListItem[] | undefined {
    return state.peopleList;
  }

  @Selector()
  static phaseList(state: StateModel): PhaseListItem[] | undefined {
    return state.phaseList;
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
  static stats(state: StateModel): ResultStats | undefined {
    return state.stats;
  }

  @Selector()
  static uploadResults(
    state: StateModel
  ): UploadResults<ProjectImportResult> | undefined {
    return state.uploadResults;
  }

  @Action(SetAsStarted)
  setAsStarted(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      started: true,
    });
  }

  @Action(SetProject)
  setProject(
    ctx: StateContext<StateModel>,
    { owner, projectId }: SetProject
  ): void | Observable<void> {
    return this.data.projects.getAsync(owner, projectId).pipe(
      map((project) => {
        ctx.patchState({ project });
      })
    );
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
    const extension = parts[parts.length - 1].toLowerCase();
    const fileType = EXTENSION_PAGES[extension];

    if (!fileType) {
      this.messenger.error('Invalid file extension.', false);
      return;
    }
    ctx.patchState({
      extension,
      fileType,
      loadingFile: true,
      rawFile: file,
    });

    return ctx.dispatch(new Navigate([...this.urlPrefix(ctx), 'results']));
  }

  @Action(LoadProjectFile)
  loadProjectFile(ctx: StateContext<StateModel>): void | Observable<any> {
    const state = ctx.getState();

    if (!state.rawFile || !state.extension) return;

    return this.getFile(state.rawFile).pipe(
      switchMap((body) =>
        this.data.projectImport.runAsync(body, state.extension!)
      ),
      tap((uploadResults) =>
        ctx.patchState({
          uploadResults,
          loadingFile: false,
        })
      ),
      switchMap((results) =>
        (results.errors ?? []).length === 0
          ? ctx.dispatch(new ProcessFile())
          : of()
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
    const peopleList: PeopleListItem[] = [];

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
              peopleList.push({ name: resource, disciplineIds: [] });
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
    const phaseList: PhaseListItem[] = [];
    const state = ctx.getState();

    if (answer === 'append')
      for (const idOrCat of state.project!.categories.phase ?? []) {
        phaseList.push({ idOrCat, isEditable: false });
      }

    if (state.uploadResults?.results)
      for (const row of state.uploadResults.results) {
        if (row.levelText.split('.').length === 1) {
          phaseList.push({ text: row.title, sameAs: [], isEditable: true });
        }
      }
    ctx.patchState({
      action: answer,
      phaseList,
    });
    return ctx.dispatch(new Navigate([...this.urlPrefix(ctx), 'phases']));
  }

  @Action(PhasesCompleted)
  phasesCompleted(
    ctx: StateContext<StateModel>,
    { results }: PhasesCompleted
  ): Observable<void> {
    const fileType = ctx.getState().fileType!;
    const urlSuffix = fileType === 'excel' ? 'saving' : 'disciplines';
    ctx.patchState({
      phaseList: results,
    });
    return ctx.dispatch(new Navigate([...this.urlPrefix(ctx), urlSuffix]));
  }

  @Action(PeopleCompleted)
  peopleCompleted(
    ctx: StateContext<StateModel>,
    { results }: PeopleCompleted
  ): Observable<void> {
    ctx.patchState({
      peopleList: results,
    });
    return ctx.dispatch(new Navigate([...this.urlPrefix(ctx), 'saving']));
  }

  @Action(PrepUploadToSave)
  prepUploadToSave(ctx: StateContext<StateModel>): Observable<void> {
    ctx.patchState({
      saving: true,
    });
    const state = ctx.getState();
    const people = new Map<string, string[]>();
    const phases = new Map<string, string[]>();
    const nodes = new Map<string, ProjectImportResult>();
    //
    //  Put people into map
    //
    for (const person of state.peopleList ?? []) {
      if (person.disciplineIds.length === 0) continue;

      people.set(person.name.toLowerCase(), person.disciplineIds);
    }
    //
    //  Put phases into map
    //
    for (const phase of state.phaseList ?? []) {
      if (phase.isEditable) {
        phases.set(phase.text, phase.sameAs);
      }
    }
    //
    //  Put nodes into map
    //
    for (const node of state.uploadResults?.results ?? []) {
      nodes.set(node.levelText, node);
    }
    const proj = state.project!;

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
          phases,
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
    const state = ctx.getState();
    const project = state.project!;

    project.categories.phase = results.phases;
    project.categories.discipline = results.disciplines;

    const saves: Observable<any>[] = [
      this.data.projects
        .putAsync(project)
        .pipe(tap(() => ctx.patchState({ project }))),
    ];

    if (results.removeIds.length > 0 || results.upserts.length > 0) {
      saves.push(
        this.data.projectNodes.batchAsync(
          project.owner,
          project.id,
          results.upserts,
          results.removeIds
        )
      );
    }

    if (saves.length === 0) return;

    return forkJoin(saves);
  }

  private getFile(file: File): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((obs) => {
      if (!file) {
        obs.complete();
        return;
      }
      const reader = new FileReader();

      reader.onload = function (ev) {
        const data = ev.target?.result;

        obs.next(<ArrayBuffer>data);
        obs.complete();
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private urlPrefix(ctx: StateContext<StateModel>): string[] {
    return ['projects', 'upload', ctx.getState().project!.id];
  }
}
