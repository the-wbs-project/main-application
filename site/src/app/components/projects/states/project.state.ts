import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  AddNodeToProject,
  DownloadNodes,
  ProcessUploadedNodes,
  ProjectNodeViewChanged,
  ProjectViewChanged,
  RebuildNodeViews,
  RemoveNodeToProject,
  SetProject,
  UploadNodes,
  VerifyDeleteReasons,
  VerifyProject,
} from '../actions';
import {
  ListItem,
  Project,
  PROJECT_FILTER,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_STATI,
  PROJECT_VIEW_TYPE,
  WbsDisciplineNode,
  WbsNode,
  WbsPhaseNode,
} from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  IdService,
  Messages,
  StartupService,
  Transformers,
} from '@wbs/shared/services';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ClearEditor } from '@wbs/components/_features';
import { PhaseExtractProcessor } from '../services';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ProjectNodeUploadDialogComponent } from '../components';

interface StateModel {
  current?: Project;
  deleteReasons: ListItem[];
  disciplineNodes?: WbsDisciplineNode[];
  list: Project[];
  watched: Project[];
  nodes?: WbsNode[];
  navType: PROJECT_FILTER | null;
  phaseNodes?: WbsPhaseNode[];
  viewProject?: PROJECT_VIEW_TYPE;
  viewNode?: PROJECT_NODE_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'projects',
  defaults: {
    deleteReasons: [],
    list: [],
    watched: [],
    navType: null,
  },
})
export class ProjectState implements NgxsOnInit {
  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly dialog: DialogService,
    private readonly loader: StartupService,
    private readonly messages: Messages,
    private readonly processors: PhaseExtractProcessor,
    private readonly transformers: Transformers
  ) {}

  @Selector()
  static deleteReasons(state: StateModel): ListItem[] {
    return state.deleteReasons;
  }

  @Selector()
  static disciplineNodes(state: StateModel): WbsDisciplineNode[] | undefined {
    return state.disciplineNodes;
  }

  @Selector()
  static list(state: StateModel): Project[] {
    return state.list;
  }

  @Selector()
  static watched(state: StateModel): Project[] {
    return state.watched;
  }

  @Selector()
  static count(state: StateModel): number {
    return ProjectState.list(state).length;
  }

  @Selector()
  static phaseNodes(state: StateModel): WbsPhaseNode[] | undefined {
    return state.phaseNodes;
  }

  @Selector()
  static planningList(state: StateModel): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.PLANNING);
  }

  @Selector()
  static planningCount(state: StateModel): number {
    return ProjectState.planningList(state).length;
  }

  @Selector()
  static executionList(state: StateModel): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.EXECUTION);
  }

  @Selector()
  static executionCount(state: StateModel): number {
    return ProjectState.executionList(state).length;
  }

  @Selector()
  static followupList(state: StateModel): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.FOLLOW_UP);
  }

  @Selector()
  static followupCount(state: StateModel): number {
    return ProjectState.followupList(state).length;
  }

  @Selector()
  static navType(state: StateModel): PROJECT_FILTER | null {
    return state.navType;
  }

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.current;
  }

  @Selector()
  static nodes(state: StateModel): WbsNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static viewNode(state: StateModel): PROJECT_NODE_VIEW_TYPE | undefined {
    return state.viewNode;
  }

  @Selector()
  static viewProject(state: StateModel): PROJECT_VIEW_TYPE | undefined {
    return state.viewProject;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    ctx.patchState({
      list: this.loader.projectsMy ?? [],
      watched: this.loader.projectsWatched ?? [],
    });
  }

  @Action(VerifyProject)
  verifyProject(
    ctx: StateContext<StateModel>,
    action: VerifyProject
  ): Observable<void> {
    const state = ctx.getState();

    return state.current?.id !== action.projectId
      ? ctx.dispatch(new SetProject(action.projectId))
      : of();
  }

  @Action(SetProject)
  setProject(
    ctx: StateContext<StateModel>,
    action: SetProject
  ): Observable<void> {
    return forkJoin({
      project: this.data.projects.getAsync(action.projectId),
      nodes: this.data.projectNodes.getAsync(action.projectId),
    }).pipe(
      tap((data) =>
        ctx.patchState({
          current: data.project,
          nodes: data.nodes,
          viewNode: data.project.mainNodeView,
        })
      ),
      switchMap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(ProjectViewChanged)
  projectViewChanged(
    ctx: StateContext<StateModel>,
    action: ProjectViewChanged
  ): void {
    ctx.patchState({
      viewProject: action.view,
    });
  }

  @Action(ProjectNodeViewChanged)
  projectNodeViewChanged(
    ctx: StateContext<StateModel>,
    action: ProjectNodeViewChanged
  ): Observable<void> {
    ctx.patchState({
      viewNode: action.view,
    });
    return ctx.dispatch(new RebuildNodeViews());
  }

  @Action(RebuildNodeViews)
  rebuildNodeViews(ctx: StateContext<StateModel>): Observable<void> | void {
    const state = ctx.getState();

    if (!state.viewNode || !state.current || !state.nodes) return;

    if (state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE) {
      ctx.patchState({
        disciplineNodes: this.transformers.wbsNodeDiscipline.run(
          state.current,
          state.nodes
        ),
        phaseNodes: undefined,
      });
    } else {
      ctx.patchState({
        disciplineNodes: undefined,
        phaseNodes: this.transformers.wbsNodePhase.run(
          state.current,
          state.nodes
        ),
      });
    }
    return ctx.dispatch(new ClearEditor());
  }

  @Action(VerifyDeleteReasons)
  verifyDeleteReasons(ctx: StateContext<StateModel>): Observable<any> {
    const state = ctx.getState();

    if (state.deleteReasons.length > 0) return of();

    return this.data.metdata.getListAsync('delete_reasons').pipe(
      map((list) =>
        ctx.patchState({
          deleteReasons: list,
        })
      )
    );
  }

  @Action(AddNodeToProject)
  addNodeToProject(
    ctx: StateContext<StateModel>,
    action: AddNodeToProject
  ): Observable<any> {
    const state = ctx.getState();
    const node = action.node;

    node.id = IdService.generate();

    return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
      // TO DO SEND ACTIVITY
      tap(() => {
        const nodes = [...ctx.getState().nodes!];
        nodes.push(node);

        ctx.patchState({
          nodes,
        });
      })
    );
  }

  @Action(RemoveNodeToProject)
  removeNodeToProject(
    ctx: StateContext<StateModel>,
    action: RemoveNodeToProject
  ): Observable<any> | void {
    const state = ctx.getState();
    const nodes: WbsNode[] = JSON.parse(JSON.stringify(state.nodes));
    let nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

    if (nodeIndex === -1) return of();

    nodes[nodeIndex].removed = true;

    let changedIds: string[] = [action.nodeId];

    changedIds.push(
      ...this.transformers.wbsNodePhaseReorderer.run(state.current!, nodes)
    );
    changedIds.push(
      ...this.transformers.wbsNodeDisciplineReorderer.run(state.current!, nodes)
    );
    const changed: Observable<void>[] = [];
    const parentId = state.current!.id;

    for (const node of nodes) {
      if (changedIds.indexOf(node.id) === -1) continue;

      changed.push(this.data.projectNodes.putAsync(parentId, node));
    }
    return forkJoin(changed).pipe(
      map(() =>
        ctx.patchState({
          nodes,
        })
      )
    );
    /*
    return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
      // TO DO SEND REASON
      // TO DO SEND ACTIVITY
      map(() => {
        nodes[nodeIndex] = node;
        ctx.patchState({
          nodes: [...nodes],
        });
      })
    );*/
  }

  @Action(DownloadNodes)
  downloadNodes(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();
    const rows =
      state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE
        ? state.disciplineNodes
        : state.phaseNodes;

    this.messages.info('General.RetrievingData');

    return this.data.extracts.downloadNodesAsync(
      state.current!,
      rows!,
      state.viewNode!
    );
  }

  @Action(UploadNodes)
  uploadNodes(ctx: StateContext<StateModel>): Observable<any> {
    return this.dialog
      .open({
        content: ProjectNodeUploadDialogComponent,
        appendTo: this.containers.body,
      })
      .result.pipe(
        switchMap((result: DialogCloseResult | ArrayBuffer) => {
          if (result instanceof ArrayBuffer) {
            return ctx.dispatch(new ProcessUploadedNodes(result));
          } else {
            return of(null);
          }
        })
      );
  }

  @Action(ProcessUploadedNodes)
  processUploadedNodes(
    ctx: StateContext<StateModel>,
    action: ProcessUploadedNodes
  ): Observable<any> | void {
    const state = ctx.getState();
    const project = state.current!;

    if (state.viewNode === PROJECT_NODE_VIEW.PHASE)
      return this.uploadPhaseFile(ctx, project.id, action.buffer);
  }

  private uploadPhaseFile(
    ctx: StateContext<StateModel>,
    projectId: string,
    buffer: ArrayBuffer
  ): Observable<any> {
    return this.data.extracts.updatePhaseAsync(projectId, buffer).pipe(
      switchMap((rows) => {
        const state = ctx.getState();
        const project = state.current!;

        const results = this.processors.run(
          project.categories.phase,
          this.copy(state.nodes!),
          this.copy(state.phaseNodes!),
          rows
        );

        var saves: Observable<any>[] = [];

        if (results.cats !== project.categories.phase) {
          project.categories.phase = results.cats;

          saves.push(
            this.data.projects.putAsync(project).pipe(
              tap(() =>
                ctx.patchState({
                  current: project,
                })
              )
            )
          );
        }
        if (results.removeIds.length > 0 || results.upserts.length > 0) {
          //
          saves.push(
            this.data.projectNodes
              .batchAsync(project.id, results.upserts, results.removeIds)
              .pipe(
                tap(() => {
                  const nodes = ctx.getState().nodes!;

                  for (const id of results.removeIds) {
                    const index = nodes.findIndex((x) => x.id === id);

                    if (index > -1) nodes.splice(index, 1);
                  }
                  for (const node of results.upserts) {
                    const index = nodes.findIndex((x) => x.id === node.id);

                    if (index > -1) nodes[index] = node;
                  }
                  ctx.patchState({
                    nodes,
                  });
                })
              )
          );
        }

        return saves.length === 0
          ? of()
          : forkJoin(saves).pipe(
              tap(() => ctx.dispatch(new RebuildNodeViews()))
            );
      })
    );
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }
}
