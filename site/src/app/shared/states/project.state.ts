import { Injectable } from '@angular/core';
import { ProjectLite, PROJECT_FILTER, PROJECT_STATI } from '@wbs/models';
import { StartupService } from '@wbs/services';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

interface StateModel {
  list: ProjectLite[];
  watched: ProjectLite[];
  navType: PROJECT_FILTER | null;
}

@Injectable()
@State<StateModel>({
  name: 'projects',
  defaults: {
    list: [],
    watched: [],
    navType: null,
  },
})
export class ProjectState implements NgxsOnInit {
  constructor(private readonly loader: StartupService) {}

  @Selector()
  static list(state: StateModel): ProjectLite[] {
    return state.list;
  }

  @Selector()
  static watched(state: StateModel): ProjectLite[] {
    return state.watched;
  }

  @Selector()
  static count(state: StateModel): number {
    return ProjectState.list(state).length;
  }

  @Selector()
  static planningList(state: StateModel): ProjectLite[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.PLANNING);
  }

  @Selector()
  static planningCount(state: StateModel): number {
    return ProjectState.planningList(state).length;
  }

  @Selector()
  static executionList(state: StateModel): ProjectLite[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.EXECUTION);
  }

  @Selector()
  static executionCount(state: StateModel): number {
    return ProjectState.executionList(state).length;
  }

  @Selector()
  static followupList(state: StateModel): ProjectLite[] {
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

  ngxsOnInit(ctx: StateContext<StateModel>) {
    ctx.patchState({
      list: this.loader.projectsMy ?? [],
      watched: this.loader.projectsWatched ?? [],
    });
  }
}
