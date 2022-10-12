import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Activity, TimelineMenuItem } from '@wbs/shared/models';
import {
  DataServiceFactory,
  Messages,
  TimelineService,
} from '@wbs/shared/services';
import { TimelineViewModel } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  LoadNextProjectTimelinePage,
  LoadProjectTimeline,
  LoadTaskTimeline,
  RestoreProject,
  SaveTimelineAction,
} from '../actions';

const pageSize = 10;

interface StateModel {
  project: TimelineViewModel[];
  projectFull: TimelineViewModel[];
  projectPage: number;
  projectId?: string;
  task: TimelineViewModel[];
  taskId?: string;
}

@Injectable()
@State<StateModel>({
  name: 'projectTimeline',
  defaults: {
    project: [],
    projectFull: [],
    projectPage: 0,
    task: [],
  },
})
export class ProjectTimelineState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messaging: Messages,
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
      switchMap((activities) => {
        const projectFull: TimelineViewModel[] = [];

        for (const act of activities.sort(this.service.sort)) {
          projectFull.push(this.transform(act));
        }
        ctx.patchState({
          projectFull,
          projectId: action.projectId,
          projectPage: 0,
        });

        return ctx.dispatch(new LoadNextProjectTimelinePage());
      })
    );
  }

  @Action(LoadNextProjectTimelinePage)
  loadNextProjectTimelinePage(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();

    state.projectPage++;

    ctx.patchState({
      project: state.projectFull.slice(0, pageSize * state.projectPage),
      projectPage: state.projectPage,
    });
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

  @Action(RestoreProject)
  RestoreProject(
    ctx: StateContext<StateModel>,
    action: RestoreProject
  ): Observable<void> {
    return this.messaging
      .confirm('Projects.RestoreConfirmTitle', 'Projects.RestoreConfirmMessage')
      .pipe(
        filter((answer) => answer),
        switchMap(() => {
          const state = ctx.getState();

          return this.data.projectSnapshots
            .getAsync(state.projectId!, action.activityId)
            .pipe(
              map((snapshot) => {
                //
              })
            );
        })
      );
  }
  private transform(act: Activity): TimelineViewModel {
    const menu: TimelineMenuItem[] = [];

    if (act.objectId) {
      menu.push({
        activityId: act.id,
        objectId: act.objectId,
        ...NAVIGATE_ITEM,
      });
    }
    menu.push({
      activityId: act.id,
      objectId: act.topLevelId,
      ...RESTORE_ITEM,
    });

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
