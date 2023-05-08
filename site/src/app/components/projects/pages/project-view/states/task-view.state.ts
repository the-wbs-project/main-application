import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import {
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { ProjectState } from '../../../states';
import { TASK_PAGE_VIEW_TYPE } from '../models';
import { TaskPageChanged, VerifyTask } from '../actions';
import { ProjectNavigationService } from '../services';
import { NavigateToTask } from '@wbs/components/projects/actions';

interface StateModel {
  current?: WbsNode;
  id?: string;
  nextTaskId?: string;
  pageView?: TASK_PAGE_VIEW_TYPE;
  parent?: WbsNodeView;
  previousTaskId?: string;
  subTasks?: WbsNodeView[];
  view?: WbsNodeView;
  viewNode?: PROJECT_NODE_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'taskView',
  defaults: {},
})
export class TaskViewState implements NgxsOnInit {
  constructor(
    private readonly nav: ProjectNavigationService,
    private readonly store: Store
  ) {}

  @Selector()
  static current(state: StateModel): WbsNode | undefined {
    return state.current;
  }

  @Selector()
  static nextTaskId(state: StateModel): string | undefined {
    return state.nextTaskId;
  }

  @Selector()
  static pageView(state: StateModel): TASK_PAGE_VIEW_TYPE | undefined {
    return state.pageView;
  }

  @Selector()
  static parent(state: StateModel): WbsNodeView | undefined {
    return state.parent;
  }

  @Selector()
  static previousTaskId(state: StateModel): string | undefined {
    return state.previousTaskId;
  }

  @Selector()
  static subTasks(state: StateModel): WbsNodeView[] | undefined {
    return state.subTasks;
  }

  @Selector()
  static view(state: StateModel): WbsNodeView | undefined {
    return state.view;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    console.log('ngxsOnInit');

    this.store
      .select(ProjectState.disciplines)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.setup(ctx));

    this.store
      .select(ProjectState.phases)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.setup(ctx));

    this.store
      .select(ProjectState.nodes)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.setup(ctx));

    this.setup(ctx);
  }

  @Action(VerifyTask)
  verifyProject(ctx: StateContext<StateModel>, action: VerifyTask): void {
    const state = ctx.getState();

    if (state.id === action.taskId && state.viewNode === action.viewNode)
      return;

    ctx.patchState({
      id: action.taskId,
      viewNode: action.viewNode,
    });

    this.setup(ctx);
  }

  @Action(TaskPageChanged)
  projectViewChanged(
    ctx: StateContext<StateModel>,
    action: TaskPageChanged
  ): void {
    ctx.patchState({
      pageView: action.view,
    });
  }

  @Action(NavigateToTask)
  navigateToTask({}: StateContext<StateModel>, action: NavigateToTask): void {
    this.nav.toTask(action.nodeId);
  }

  private getSubTasks(
    phaseViews: WbsNodeView[],
    taskId: string
  ): WbsNodeView[] {
    const list: WbsNodeView[] = [];
    const subTaskIds = this.getSubTaskIds(taskId, phaseViews);

    for (const x of phaseViews) {
      if (subTaskIds.indexOf(x.id) === -1) continue;

      const item: WbsNodeView = JSON.parse(JSON.stringify(x));

      if (item.parentId === taskId) {
        item.parentId = null;
        item.treeParentId = null;
      }
      list.push(item);
    }

    return list;
  }

  private getSubTaskIds(taskId: string, tasks: WbsNodeView[]): string[] {
    const ids: string[] = tasks
      .filter((x) => x.parentId === taskId)
      .map((x) => x.id);

    for (const id of ids) {
      ids.push(...this.getSubTaskIds(id, tasks));
    }

    return ids;
  }

  private setup(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();
    const tasks = this.store.selectSnapshot(ProjectState.nodes) ?? [];
    const nodes =
      state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE
        ? this.store.selectSnapshot(ProjectState.disciplines) ?? []
        : this.store.selectSnapshot(ProjectState.phases) ?? [];

    if (!state.id || tasks.length === 0 || nodes.length === 0) {
      ctx.patchState({
        current: undefined,
        subTasks: undefined,
        view: undefined,
      });
      return;
    }

    const nodeIndex = nodes.findIndex((x) => x.id === state.id);
    const view = nodes[nodeIndex];
    const parent = nodes.find((x) => x.id === view.parentId);

    ctx.patchState({
      view,
      parent,
      //activity: activity.sort(this.sortActivity),
      current: tasks.find((x) => x.id === state.id),
      subTasks: this.getSubTasks(nodes, state.id),
      previousTaskId: nodeIndex === 0 ? undefined : nodes[nodeIndex - 1].id,
      nextTaskId:
        nodeIndex + 1 === nodes.length ? undefined : nodes[nodeIndex + 1].id,
    });
  }
}
