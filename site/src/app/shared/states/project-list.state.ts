import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Project } from '@wbs/shared/models';
import { forkJoin, map, Observable } from 'rxjs';
import { LoadProjects, ProjectUpdated, UpdateProjectMenu } from '../actions';
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
export class ProjectListState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static list(state: StateModel): Project[] {
    return state.list;
  }

  @Selector()
  static watched(state: StateModel): Project[] {
    return state.watched;
  }

  @Action(LoadProjects)
  loadProjects(ctx: StateContext<StateModel>): void {
    forkJoin([
      this.data.projects.getMyAsync(),
      this.data.projects.getWatchedAsync(),
    ])
      .pipe(
        map(([list, watched]) => {
          ctx.patchState({
            list: this.sort(list),
            watched: this.sort(watched),
          });
        })
      )
      .subscribe();
  }

  @Action(ProjectUpdated)
  projectUpdated(
    ctx: StateContext<StateModel>,
    action: ProjectUpdated
  ): Observable<void> {
    const state = ctx.getState();
    const listIndex = state.list.findIndex((x) => x.id === action.project.id);

    if (listIndex === -1) state.list.push(action.project);
    else state.list[listIndex] = action.project;

    const list = this.sort(state.list);

    ctx.patchState({ list });

    return ctx.dispatch(new UpdateProjectMenu(list));
  }

  private sort(list: Project[]): Project[] {
    return list.sort((a, b) => (a.title > b.title ? -1 : 1));
  }
}
