import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { WbsNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable, Subscription, tap } from 'rxjs';
import { PAGE_VIEW_TYPE } from './models';
import { TaskPageChanged, VerifyTask } from './task-view.actions';

interface StateModel {
  id?: string;
  current?: WbsNode;
  pageView?: PAGE_VIEW_TYPE;
  subTasks?: WbsNodeView[];
  viewDiscipline?: WbsNodeView;
  viewPhase?: WbsNodeView;
  disciplines?: WbsNodeView[];
  phases?: WbsNodeView[];
  tasks?: WbsNode[];
}

@UntilDestroy()
@Injectable()
@State<StateModel>({
  name: 'taskView',
  defaults: {},
})
export class TaskViewState implements NgxsOnInit {
  private sub?: Subscription;

  constructor(private readonly store: Store) {}

  @Selector()
  static current(state: StateModel): WbsNode | undefined {
    return state.current;
  }

  @Selector()
  static pageView(state: StateModel): PAGE_VIEW_TYPE | undefined {
    return state.pageView;
  }

  @Selector()
  static subTasks(state: StateModel): WbsNodeView[] | undefined {
    return state.subTasks;
  }

  @Selector()
  static viewDiscipline(state: StateModel): WbsNodeView | undefined {
    return state.viewDiscipline;
  }

  @Selector()
  static viewPhase(state: StateModel): WbsNodeView | undefined {
    return state.viewPhase;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    const subs: Observable<any>[] = [];

    subs.push(
      this.store.select(ProjectState.disciplines).pipe(
        tap((x) =>
          ctx?.patchState({
            disciplines: x,
          })
        )
      )
    );
    subs.push(
      this.store.select(ProjectState.phases).pipe(
        tap((x) =>
          ctx?.patchState({
            phases: x,
          })
        )
      )
    );
    subs.push(
      this.store.select(ProjectState.nodes).pipe(
        tap((x) =>
          ctx?.patchState({
            tasks: x,
          })
        )
      )
    );

    for (const sub of subs)
      sub.pipe(untilDestroyed(this)).subscribe(() => this.setup(ctx));
  }

  @Action(VerifyTask)
  verifyProject(ctx: StateContext<StateModel>, action: VerifyTask): void {
    const state = ctx.getState();

    if (state.id === action.taskId) return;

    ctx.patchState({
      id: action.taskId,
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

    if (!state.id || !state.disciplines || !state.phases || !state.tasks) {
      ctx.patchState({
        current: undefined,
        subTasks: undefined,
        viewDiscipline: undefined,
        viewPhase: undefined,
      });
      return;
    }
    ctx.patchState({
      //activity: activity.sort(this.sortActivity),
      current: state.tasks.find((x) => x.id === state.id),
      subTasks: this.getSubTasks(state.phases, state.id),
      viewDiscipline: state.disciplines.find((x) => x.id === state.id),
      viewPhase: state.phases.find((x) => x.id === state.id),
    });
  }
}
