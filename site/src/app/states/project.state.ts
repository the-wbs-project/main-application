import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {} from '@app/actions';
import { Project, PROJECT_FILTER, PROJECT_STATI } from '@app/models';
import { StartupService } from '@app/services';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

interface Bucket {
  list: Project[];
  watched: Project[];
  navType: PROJECT_FILTER | null;
}

@Injectable()
@State<Bucket>({
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
  static list(state: Bucket): Project[] {
    return state?.list;
  }

  @Selector()
  static watched(state: Bucket): Project[] {
    return state?.watched;
  }

  @Selector()
  static count(state: Bucket): number {
    return ProjectState.list(state).length;
  }

  @Selector()
  static planningList(state: Bucket): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.PLANNING);
  }

  @Selector()
  static planningCount(state: Bucket): number {
    return ProjectState.planningList(state).length;
  }

  @Selector()
  static executionList(state: Bucket): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.EXECUTION);
  }

  @Selector()
  static executionCount(state: Bucket): number {
    return ProjectState.executionList(state).length;
  }

  @Selector()
  static followupList(state: Bucket): Project[] {
    return state?.list.filter((x) => x.status === PROJECT_STATI.FOLLOW_UP);
  }

  @Selector()
  static followupCount(state: Bucket): number {
    return ProjectState.followupList(state).length;
  }

  @Selector()
  static navType(state: Bucket): PROJECT_FILTER | null {
    return state.navType;
  }

  ngxsOnInit(ctx: StateContext<Bucket>) {
    ctx.patchState({
      list: this.loader.myProjects ?? [],
      watched: this.loader.watchedProjects ?? [],
    });
  }
}
