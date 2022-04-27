import { Injectable } from '@angular/core';
import {
  ListItem,
  Project,
  PROJECT_FILTER,
  PROJECT_STATI,
  WbsNode,
} from '@wbs/models';
import { DataServiceFactory, StartupService } from '@wbs/services';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { VerifyDeleteReasons, VerifyProject } from '@wbs/actions';
import { forkJoin, map, Observable, of } from 'rxjs';

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
    private readonly loader: StartupService
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

    if (state.current?.id === action.projectId) return of();

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
}
