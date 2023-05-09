import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadOrganization, ProjectUpdated } from '../actions';
import { DataServiceFactory } from '../data-services';
import { Project, UserLite } from '../models';

interface StateModel {
  loading: boolean;
  projects: Project[];
  users?: UserLite[];
  usersById: Map<string, UserLite>;
}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {
    projects: [],
    loading: false,
    usersById: new Map<string, UserLite>(),
  },
})
export class OrganizationState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static projects(state: StateModel): Project[] {
    return state.projects;
  }

  @Selector()
  static loading(state: StateModel): boolean {
    return state.loading;
  }

  @Selector()
  static users(state: StateModel): UserLite[] {
    return state.users ?? [];
  }

  @Selector()
  static usersById(state: StateModel): Map<string, UserLite> {
    return state.usersById;
  }

  @Action(LoadOrganization)
  loadOrganization(
    ctx: StateContext<StateModel>,
    action: LoadOrganization
  ): Observable<void> {
    ctx.patchState({ loading: true });

    return forkJoin({
      projects: this.data.projects.getMyAsync(),
      userList: this.data.users.getAllAsync(action.organization),
    }).pipe(
      map(({ projects, userList }) => {
        const users: UserLite[] = [];
        const usersById = new Map<string, UserLite>();
        const orgId = 'acme_engineering';

        userList = userList.sort((a, b) => (a.name < b.name ? -1 : 1));

        for (const x of userList) {
          const user: UserLite = {
            email: x.email,
            id: x.id,
            name: x.name,
            roles: x.appInfo.organizations[orgId],
          };
          users.push(user);
          usersById.set(x.id, user);
        }
        ctx.patchState({ projects, users, usersById });
        ctx.patchState({ loading: false });
      })
    );
  }

  @Action(ProjectUpdated)
  projectUpdated(ctx: StateContext<StateModel>, action: ProjectUpdated): void {
    const state = ctx.getState();
    const projects = [...state.projects];
    const listIndex = projects.findIndex((x) => x.id === action.project.id);

    if (listIndex === -1) projects.push(action.project);
    else projects[listIndex] = action.project;

    ctx.patchState({ projects });
  }
}
