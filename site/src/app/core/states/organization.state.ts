import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadOrganization, ProjectUpdated } from '../actions';
import { DataServiceFactory } from '../data-services';
import { Project, UserLite } from '../models';
import { sorter } from '../services';

interface StateModel {
  id: string;
  loading: boolean;
  projects: Project[];
  users?: UserLite[];
  usersById: Map<string, UserLite>;
}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {
    id: 'acme_engineering',
    projects: [],
    loading: false,
    usersById: new Map<string, UserLite>(),
  },
})
export class OrganizationState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static id(state: StateModel): string {
    return state.id;
  }

  @Selector()
  static loading(state: StateModel): boolean {
    return state.loading;
  }

  @Selector()
  static projects(state: StateModel): Project[] {
    return state.projects;
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
    { selected }: LoadOrganization
  ): Observable<void> {
    ctx.patchState({ loading: true });

    return forkJoin({
      projects: this.data.projects.getMyAsync(),
      userList: this.data.users.getAllAsync(selected),
    }).pipe(
      map(({ projects, userList }) => {
        const users: UserLite[] = [];
        const usersById = new Map<string, UserLite>();

        userList = userList.sort((a, b) => sorter(a.name, b.name));

        for (const x of userList) {
          const user: UserLite = {
            email: x.email,
            id: x.id,
            name: x.name,
            roles: x.appInfo.organizations[selected],
          };
          users.push(user);
          usersById.set(x.id, user);
        }
        ctx.patchState({ projects, users, usersById, id: selected });
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
