import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoadProjects } from '../actions';

interface ProjectListStateModel {
  list?: Project[];
  filter: {};
  loading: boolean;
}

declare type Context = StateContext<ProjectListStateModel>;

@Injectable()
@State<ProjectListStateModel>({
  name: 'projects',
  defaults: {
    loading: true,
    filter: {},
  },
})
export class ProjectListState {
  constructor(
    protected readonly data: DataServiceFactory,
    protected readonly store: Store
  ) {}

  @Selector()
  static list(state: ProjectListStateModel): Project[] | undefined {
    return state.list;
  }

  @Selector()
  static loading(state: ProjectListStateModel): boolean {
    return state.loading;
  }

  @Action(LoadProjects)
  loadProjects(ctx: Context, { owner }: LoadProjects): Observable<any> {
    ctx.patchState({ loading: true });

    return this.data.projects.getAllAsync(owner).pipe(
      map((projects) => {
        ctx.patchState({
          list: projects.sort((a, b) =>
            sorter(a.lastModified, b.lastModified, 'desc')
          ),
        });
      }),
      tap(() => ctx.patchState({ loading: false }))
    );
  }
}
