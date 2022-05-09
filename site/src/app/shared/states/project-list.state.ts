import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {} from '../actions';
import { Project } from '@wbs/shared/models';
import { StartupService } from '@wbs/shared/services';

interface StateModel {
  list: Project[];
  watched: Project[];
}

@Injectable()
@State<StateModel>({
  name: 'projectList',
  defaults: {
    list: [],
    watched: [],
  },
})
export class ProjectListState implements NgxsOnInit {
  constructor(private readonly loader: StartupService) {}

  @Selector()
  static list(state: StateModel): Project[] {
    return state.list;
  }

  @Selector()
  static watched(state: StateModel): Project[] {
    return state.watched;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    ctx.patchState({
      list: this.loader.projectsMy ?? [],
      watched: this.loader.projectsWatched ?? [],
    });
  }
}
