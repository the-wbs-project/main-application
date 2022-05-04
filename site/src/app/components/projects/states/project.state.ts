import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  AddNodeToProject,
  RemoveNodeToProject,
  SetProject,
  VerifyDeleteReasons,
  VerifyProject,
} from '../actions';
import {
  ListItem,
  Project,
  PROJECT_FILTER,
  PROJECT_STATI,
  WbsNode,
} from '@wbs/shared/models';
import {
  DataServiceFactory,
  IdService,
  StartupService,
  Transformers,
} from '@wbs/shared/services';
import { forkJoin, map, Observable, of, tap } from 'rxjs';

interface StateModel {
  list: Project[];
  watched: Project[];
  current?: Project;
  nodes?: WbsNode[];
  navType: PROJECT_FILTER | null;
  deleteReasons: ListItem[];
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
    private readonly data: DataServiceFactory,
    private readonly loader: StartupService,
    private readonly transformer: Transformers
  ) {}

  @Selector()
  static deleteReasons(state: StateModel): ListItem[] {
    return state.deleteReasons;
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
      map((data) => {
        if (data.project == null) return;

        ctx.patchState({
          current: data.project,
          nodes: data.nodes,
        });
      })
    );
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
    const nodes = state.nodes!;
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
      ...this.transformer.wbsNodePhaseReorderer.run(state.current!, nodes)
    );
    changedIds.push(
      ...this.transformer.wbsNodeDisciplineReorderer.run(state.current!, nodes)
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
}
