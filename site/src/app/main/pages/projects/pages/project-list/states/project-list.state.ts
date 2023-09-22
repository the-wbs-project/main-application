import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoadProjects } from '../actions';
import { AuthState } from '@wbs/main/states';

interface ProjectListStateModel {
  list?: Project[];
  anyAssignedTome?: boolean;
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
  static anyAssignedTome(state: ProjectListStateModel): boolean | undefined {
    return state.anyAssignedTome;
  }

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
      tap((projects) => {
        ctx.patchState({
          list: projects.sort((a, b) =>
            sorter(a.lastModified, b.lastModified, 'desc')
          ),
        });
      }),

      tap((projects) => {
        const userId = this.store.selectSnapshot(AuthState.userId)!;

        ctx.patchState({
          anyAssignedTome: projects.some(
            (p) => p.roles?.some((r) => r.userId === userId) ?? false
          ),
          loading: false,
        });
      })
    );
  }
}
