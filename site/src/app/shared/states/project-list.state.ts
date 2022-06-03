import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Project } from '@wbs/shared/models';
import { forkJoin, map, Observable } from 'rxjs';
import { DataServiceFactory } from '../services';

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
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static list(state: StateModel): Project[] {
    return state.list;
  }

  @Selector()
  static watched(state: StateModel): Project[] {
    return state.watched;
  }

  ngxsOnInit(ctx: StateContext<StateModel>): void {
    forkJoin([
      this.data.projects.getMyAsync(),
      this.data.projects.getWatchedAsync(),
    ])
      .pipe(
        map(([list, watched]) => {
          ctx.patchState({
            list,
            watched,
          });
        })
      )
      .subscribe();
  }
}
