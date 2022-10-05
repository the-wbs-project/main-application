import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ActionMenuItem, Activity } from '@wbs/shared/models';
import { DataServiceFactory, TimelineService } from '@wbs/shared/services';
import { TimelineViewModel } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadProjectTimeline,
  LoadTaskTimeline,
  SaveTimelineAction,
} from '../actions';

interface StateModel {
  project: TimelineViewModel[];
  projectId?: string;
  task: TimelineViewModel[];
  taskId?: string;
}

@Injectable()
@State<StateModel>({
  name: 'projectTimeline',
  defaults: {
    project: [],
    task: [],
  },
})
export class ProjectTimelineState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly service: TimelineService
  ) {}

  @Selector()
  static project(state: StateModel): TimelineViewModel[] {
    return state.project;
  }

  @Selector()
  static task(state: StateModel): TimelineViewModel[] {
    return state.task;
  }

  @Action(LoadProjectTimeline)
  loadProjectTimeline(
    ctx: StateContext<StateModel>,
    action: LoadProjectTimeline
  ): Observable<void> | void {
    if (ctx.getState().projectId === action.projectId) return;

    return this.data.activities.getAsync(action.projectId).pipe(
      map((activities) => {
        const project: TimelineViewModel[] = [];

        for (const act of activities.sort(this.service.sort)) {
          project.push(this.transform(act));
        }
        ctx.patchState({
          project,
          projectId: action.projectId,
        });
      })
    );
  }

  @Action(LoadTaskTimeline)
  loadTaskTimeline(
    ctx: StateContext<StateModel>,
    action: LoadTaskTimeline
  ): void {
    if (ctx.getState().taskId === action.taskId) return;

    ctx.patchState({
      task: ctx.getState().project.filter((x) => x.objectId === action.taskId),
      taskId: action.taskId,
    });
  }

  @Action(SaveTimelineAction)
  saveTimelineAction(
    ctx: StateContext<StateModel>,
    action: SaveTimelineAction
  ): Observable<void> {
    const state = ctx.getState();

    return this.data.activities
      .putAsync(state.projectId!, action.data, action.dataType)
      .pipe(
        map((activity) => {
          ctx.patchState({
            project: [this.transform(activity), ...state.project],
          });

          if (state.taskId === activity.objectId)
            ctx.patchState({
              task: [this.transform(activity), ...state.task],
            });
        })
      );
  }

  private transform(act: Activity): TimelineViewModel {
    const menu: ActionMenuItem[] = [];

    if (act.objectId) {
      menu.push({ id: act.objectId, ...NAVIGATE_ITEM });
    }
    menu.push({ id: act.topLevelId, ...RESTORE_ITEM });

    return {
      action: act.action,
      data: act.data,
      id: act.id,
      menu,
      objectId: act.objectId ?? act.topLevelId,
      timestamp: act._ts,
      userId: act.userId,
    };
  }
}

const NAVIGATE_ITEM = {
  action: 'navigate',
  icon: 'fa-eye',
  title: 'Projects.ViewTask',
};

const RESTORE_ITEM = {
  action: 'restore',
  icon: 'fa-window-restore',
  title: 'Projects.Restore',
};
