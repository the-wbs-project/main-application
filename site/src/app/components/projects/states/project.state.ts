import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  DownloadNodes,
  ProcessUploadedNodes,
  ProjectNodeViewChanged,
  ProjectViewChanged,
  RebuildNodeViews,
  RemoveTask,
  SetProject,
  UploadNodes,
  VerifyDeleteReasons,
  VerifyProject,
} from '../actions';
import {
  ExtractPhaseNodeView,
  ListItem,
  Project,
  PROJECT_FILTER,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_VIEW_TYPE,
  WbsDisciplineNode,
  WbsNode,
  WbsPhaseNode,
} from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  Messages,
  WbsTransformers,
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
    navType: null,
  },
})
export class ProjectState {
  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly dialog: DialogService,
    private readonly messages: Messages,
    private readonly processors: PhaseExtractProcessor,
    private readonly transformers: WbsTransformers
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
  static phaseNodes(state: StateModel): WbsPhaseNode[] | undefined {
    return state.phaseNodes;
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
        disciplineNodes: this.transformers.nodes.discipline.view.run(
          state.current,
          state.nodes
        ),
        phaseNodes: undefined,
      });
    } else {
      ctx.patchState({
        disciplineNodes: undefined,
        phaseNodes: this.transformers.nodes.phase.view.run(
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

  /*@Action(AddSubTask)
  addNodeToProject(
    ctx: StateContext<StateModel>,
    action: AddSubTask
  ): Observable<any> {
    const state = ctx.getState();
    const node = action.parent;

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
  }*/

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: StateContext<StateModel>,
    action: RemoveTask
  ): Observable<any> | void {
    const state = ctx.getState();
    const nodes: WbsNode[] = JSON.parse(JSON.stringify(state.nodes));
    let nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

    if (nodeIndex === -1) return of();

    nodes[nodeIndex].removed = true;

    let changedIds: string[] = [action.nodeId];

    changedIds.push(
      ...this.transformers.nodes.phase.reorderer.run(state.current!, nodes)
    );
    changedIds.push(
      ...this.transformers.nodes.discipline.reorderer.run(state.current!, nodes)
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
    const state = ctx.getState();
    const project = state.current!;

    const ref = this.dialog.open({
      content: ProjectNodeUploadDialogComponent,
      appendTo: this.containers.body,
    });
    const comp = <ProjectNodeUploadDialogComponent>ref.content.instance;

    comp.viewNode = state.viewNode;

    return ref.result.pipe(
      switchMap((result: DialogCloseResult | any[]) => {
        if (result instanceof DialogCloseResult) {
          return of(null);
        } else if (state.viewNode === PROJECT_NODE_VIEW.PHASE) {
          return ctx.dispatch(
            new ProcessUploadedNodes(<ExtractPhaseNodeView[]>result)
          );
          //return this.uploadPhaseFile(ctx, <ExtractPhaseNodeView[]>result);
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
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    if (state.viewNode === PROJECT_NODE_VIEW.PHASE) {
      return this.uploadPhaseFile(ctx, <ExtractPhaseNodeView[]>action.rows);
    } else {
      return of(null);
    }
  }

  private uploadPhaseFile(
    ctx: StateContext<StateModel>,
    rows: ExtractPhaseNodeView[]
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    const results = this.processors.run(
      project.categories.phase,
      project.categories.discipline,
      this.copy(state.nodes!),
      this.copy(state.phaseNodes!),
      rows,
      true
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
      console.log(results);
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
                else nodes.push(node);
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
      : forkJoin(saves).pipe(tap(() => ctx.dispatch(new RebuildNodeViews())));
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }
}
