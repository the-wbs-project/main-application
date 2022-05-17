import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ClosedEditor } from '@wbs/components/_features';
import {
  ACTIONS,
  Activity,
  ListItem,
  Project,
  PROJECT_FILTER,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  Messages,
  WbsTransformers,
} from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  DownloadNodes,
  ProcessUploadedNodes,
  ProjectNodeViewChanged,
  ProjectViewChanged,
  RebuildNodeViews,
  RemoveTask,
  SetProject,
  TreeReordered,
  UploadNodes,
  VerifyDeleteReasons,
  VerifyProject,
} from '../actions';
import { ProjectNodeUploadDialogComponent } from '../components';
import { PhaseExtractProcessor } from '../services';

interface StateModel {
  activity?: Activity[];
  current?: Project;
  deleteReasons: ListItem[];
  nodes?: WbsNode[];
  nodeViews?: WbsNodeView[];
  navType: PROJECT_FILTER | null;
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
  static activity(state: StateModel): Activity[] | undefined {
    return state.activity;
  }

  @Selector()
  static deleteReasons(state: StateModel): ListItem[] {
    return state.deleteReasons;
  }

  @Selector()
  static nodeViews(state: StateModel): WbsNodeView[] | undefined {
    return state.nodeViews;
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
      activity: this.data.activities.getAsync(action.projectId),
    }).pipe(
      tap((data) =>
        ctx.patchState({
          activity: data.activity.sort(this.sortActivity),
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
        nodeViews: this.transformers.nodes.discipline.view.run(
          state.current,
          state.nodes
        ),
      });
    } else {
      ctx.patchState({
        nodeViews: this.transformers.nodes.phase.view.run(
          state.current,
          state.nodes
        ),
      });
    }
    return ctx.dispatch(new ClosedEditor());
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
    /*changedIds.push(
      ...this.transformers.nodes.discipline.reorderer.run(state.current!, nodes)
    );*/
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

  @Action(TreeReordered)
  treeReordered(
    ctx: StateContext<StateModel>,
    action: TreeReordered
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    const models = state.nodes!;
    const upserts: WbsNode[] = [];
    const nodeViews = state.nodeViews!;
    const originalNode = nodeViews.find((x) => x.id === action.draggedId)!;
    const newNode = action.rows.find((x) => x.id === action.draggedId)!;

    for (const vm of nodeViews) {
      const vm2 = action.rows.find((x) => x.id === vm.id);

      if (!vm2) continue;
      if (vm.order === vm2.order && vm.parentId === vm2.parentId) continue;

      const orig = models.find((x) => x.id === vm.id)!;
      const model = this.copy(orig);

      model.order = vm2.order;
      model.parentId = vm2.parentId;

      upserts.push(model);
    }

    if (upserts.length === 0) return of();

    return this.data.projectNodes.batchAsync(project.id, upserts, []).pipe(
      tap(() => {
        const nodes = ctx.getState().nodes!;

        for (const node of upserts) {
          const index = nodes.findIndex((x) => x.id === node.id);

          if (index > -1) nodes[index] = node;
          else nodes.push(node);
        }
        ctx.patchState({
          nodes,
        });
      }),
      tap(() =>
        this.data.activities.putAsync({
          action: ACTIONS.NODE_REORDERED,
          data: [originalNode.title, originalNode.levelText, newNode.levelText],
          labelTitle: 'Actions.NodeRecordered',
          objectId: action.draggedId,
          topLevelId: project.id,
        })
      ),
      tap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(DownloadNodes)
  downloadNodes(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    this.messages.info('General.RetrievingData');

    return this.data.extracts.downloadNodesAsync(
      state.current!,
      state.nodeViews!,
      state.viewNode!
    );
  }

  @Action(UploadNodes)
  uploadNodes(ctx: StateContext<StateModel>): Observable<any> {
    const state = ctx.getState();

    const ref = this.dialog.open({
      content: ProjectNodeUploadDialogComponent,
      appendTo: this.containers.body,
    });
    const comp = <ProjectNodeUploadDialogComponent>ref.content.instance;

    comp.viewNode = state.viewNode;

    return ref.result.pipe(
      switchMap((result: DialogCloseResult | WbsNodeView[]) => {
        if (result instanceof DialogCloseResult) {
          return of(null);
        } else if (state.viewNode === PROJECT_NODE_VIEW.PHASE) {
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
  ): Observable<any> {
    const state = ctx.getState();

    if (state.viewNode === PROJECT_NODE_VIEW.PHASE) {
      return this.uploadPhaseFile(ctx, action.rows);
    } else {
      return of(null);
    }
  }

  private uploadPhaseFile(
    ctx: StateContext<StateModel>,
    rows: WbsNodeView[]
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    const results = this.processors.run(
      project.categories.phase,
      this.copy(state.nodes!),
      this.copy(state.nodeViews!),
      rows,
      true
    );

    console.log(results);
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

  private sortActivity(a: Activity, b: Activity): number {
    return a.timestamp - b.timestamp;
  }
}
