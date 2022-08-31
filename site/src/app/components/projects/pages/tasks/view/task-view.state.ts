import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { WbsNode } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { PAGE_VIEW_TYPE } from './models';
import { TaskPageChanged, VerifyTask } from './task-view.actions';

interface StateModel {
  current?: WbsNode;
  pageView?: PAGE_VIEW_TYPE;
  subTasks?: WbsNodeView[];
  viewDiscipline?: WbsNodeView;
  viewPhase?: WbsNodeView;
}

@Injectable()
@State<StateModel>({
  name: 'taskView',
  defaults: {},
})
export class TaskViewState {
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

  @Action(VerifyTask)
  verifyProject(
    ctx: StateContext<StateModel>,
    action: VerifyTask
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.current?.id === action.taskId) return;

    const disciplines = this.store.selectSnapshot(ProjectState.disciplines)!;
    const phases = this.store.selectSnapshot(ProjectState.phases)!;
    const tasks = this.store.selectSnapshot(ProjectState.nodes)!;

    ctx.patchState({
      //activity: activity.sort(this.sortActivity),
      current: tasks.find((x) => x.id === action.taskId),
      subTasks: this.getSubTasks(phases, action.taskId),
      viewDiscipline: disciplines.find((x) => x.id === action.taskId),
      viewPhase: phases.find((x) => x.id === action.taskId),
    });
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
}
