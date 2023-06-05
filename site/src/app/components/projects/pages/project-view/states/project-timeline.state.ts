import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TimelineService } from '@wbs/components/_features/timeline';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Activity, TimelineMenuItem } from '@wbs/core/models';
import { DialogService } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { forkJoin, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  LoadNextProjectTimelinePage,
  LoadNextTaskTimelinePage,
  LoadProjectTimeline,
  LoadTaskTimeline,
  RestoreProject,
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
    private readonly dialogs: DialogService,
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
    { projectId }: LoadProjectTimeline
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.projectId === projectId) return;

    return this.service.loadMore([], projectId).pipe(
      map((project) => {
        ctx.patchState({ project, projectId });
      })
    );
  }

  @Action(LoadNextProjectTimelinePage)
  loadNextProjectTimelinePage(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    return this.service.loadMore(state.project, state.projectId!).pipe(
      map((project) => {
        ctx.patchState({ project: [...project] });
      })
    );
  }

  @Action(LoadTaskTimeline)
  loadTaskTimeline(
    ctx: StateContext<StateModel>,
    { taskId }: LoadTaskTimeline
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.taskId === taskId) return;

    return this.service.loadMore([], state.projectId!, taskId).pipe(
      map((task) => {
        ctx.patchState({ task, taskId });
      })
    );
  }

  @Action(LoadNextTaskTimelinePage)
  loadNextTaskTimelinePage(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    return this.service
      .loadMore(state.task, state.projectId!, state.taskId!)
      .pipe(
        map((task) => {
          ctx.patchState({ task });
        })
      );
  }

  @Action(SaveTimelineAction)
  saveTimelineAction(
    ctx: StateContext<StateModel>,
    { data, dataType }: SaveTimelineAction
  ): Observable<void> {
    const state = ctx.getState();
    const saves: Observable<Activity>[] = [];

    for (const x of data)
      saves.push(this.data.activities.putAsync(state.projectId!, x, dataType));

    return forkJoin(saves).pipe(
      map((activities) => {
        const project = state.project;
        const task = state.task;

        for (const activity of activities) {
          project.splice(0, 0, this.transform(activity));

          if (state.taskId === activity.objectId)
            task.splice(0, 0, this.transform(activity));
        }
        ctx.patchState({ project, task });
      })
    );
  }

  @Action(RestoreProject)
  RestoreProject(
    ctx: StateContext<StateModel>,
    action: RestoreProject
  ): Observable<void> {
    return this.dialogs
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
      timestamp: act.timestamp,
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