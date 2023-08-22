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
import { DataServiceFactory } from '@wbs/core/data-services';
import { Activity, UserLite } from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { DialogService } from '@wbs/main/services';
import { AuthState, MembershipState } from '@wbs/main/states';
import { forkJoin, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
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
  owner?: string;
  members: Map<string, UserLite>;
  projectId?: string;
  task: TimelineViewModel[];
  taskId?: string;
}

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'projectTimeline',
  defaults: {
    project: [],
    task: [],
    members: new Map<string, UserLite>(),
  },
})
export class ProjectTimelineState implements NgxsOnInit {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly dialogs: DialogService,
    private readonly service: TimelineService,
    private readonly store: Store,
    private readonly transformer: Transformers
  ) {}

  private get userId(): string {
    return this.store.selectSnapshot(AuthState.userId)!;
  }

  private get organization(): string {
    return this.store.selectSnapshot(MembershipState.id)!;
  }

  ngxsOnInit(ctx: StateContext<StateModel>): void {
    this.store
      .select(MembershipState.members)
      .pipe(untilDestroyed(this))
      .subscribe((list) => {
        const members = ctx.getState().members;

        for (const m of list ?? []) {
          if (!members.has(m.id)) members.set(m.id, m);
        }
        ctx.patchState({ members });
      });
  }

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
    { owner, projectId }: LoadProjectTimeline
  ): Observable<void> | void {
    const state = ctx.getState();
    const project = state.project ?? [];
    const members = state.members;

    if (state.projectId === projectId) return;

    return this.service.loadMore(project, members, projectId).pipe(
      map(() => {
        ctx.patchState({ members, owner, project, projectId });
      })
    );
  }

  @Action(LoadNextProjectTimelinePage)
  loadNextProjectTimelinePage(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();
    const project = state.project ?? [];
    const members = state.members;

    return this.service.loadMore(project, members, state.projectId!).pipe(
      map(() => {
        ctx.patchState({ members, project });
      })
    );
  }

  @Action(LoadTaskTimeline)
  loadTaskTimeline(
    ctx: StateContext<StateModel>,
    { taskId }: LoadTaskTimeline
  ): Observable<void> | void {
    const state = ctx.getState();
    const task = state.task ?? [];
    const members = state.members;

    if (state.taskId === taskId) return;

    return this.service.loadMore(task, members, state.projectId!).pipe(
      map(() => {
        ctx.patchState({ members, task, taskId });
      })
    );
  }

  @Action(LoadNextTaskTimelinePage)
  loadNextTaskTimelinePage(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();
    const task = state.task ?? [];
    const members = state.members;

    return this.service
      .loadMore(task, members, state.projectId!, state.taskId!)
      .pipe(
        map(() => {
          ctx.patchState({ members, task });
        })
      );
  }

  @Action(SaveTimelineAction)
  saveTimelineAction(
    ctx: StateContext<StateModel>,
    { data }: SaveTimelineAction
  ): Observable<void> {
    const state = ctx.getState();
    const saves: Observable<Activity>[] = [];
    const user = this.store.selectSnapshot(AuthState.profileLite);

    for (const x of data)
      saves.push(
        this.data.activities.putAsync(this.userId, state.projectId!, x)
      );

    return forkJoin(saves).pipe(
      tap((activities) => {
        const project = state.project;
        const task = state.task;

        for (const activity of activities) {
          const vm = this.transformer.activities.toTimelineViewModel(
            activity,
            user!
          );
          project.splice(0, 0, vm);

          if (state.taskId === activity.objectId) task.splice(0, 0, vm);
        }
        ctx.patchState({ project, task });
      }),
      switchMap((activities) => {
        const snapshots: Observable<void>[] = [];

        for (const a of activities)
          snapshots.push(
            this.data.projectSnapshots.putAsync(
              state.owner!,
              state.projectId!,
              a.id
            )
          );

        return forkJoin(snapshots).pipe(map(() => {}));
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
            .getAsync(this.organization, state.projectId!, action.activityId)
            .pipe(
              map((snapshot) => {
                //
              })
            );
        })
      );
  }
}
