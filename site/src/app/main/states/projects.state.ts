import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { LoadProjects, ProjectUpdated } from '../actions';

interface StateModel {
  all?: Project[];
  assigned?: Project[];
}

@Injectable()
@State<StateModel>({
  name: 'projects',
  defaults: {},
})
export class ProjectListState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static all(state: StateModel): Project[] | undefined {
    return state.all;
  }

  @Selector()
  static assigned(state: StateModel): Project[] | undefined {
    return state.assigned;
  }

  @Action(LoadProjects)
  LoadProjects(
    ctx: StateContext<StateModel>,
    { organization }: LoadProjects
  ): Observable<void> {
    return forkJoin({
      all: this.data.projects.getAssignedAsync(organization),
      assigned: this.data.projects.getAssignedAsync(organization),
    }).pipe(map(({ all, assigned }) => this.patch(ctx, all, assigned)));
  }

  @Action(ProjectUpdated)
  projectUpdated(
    ctx: StateContext<StateModel>,
    { project }: ProjectUpdated
  ): void {
    const state = ctx.getState();
    const all = [...(state.all ?? [])];
    const assigned = [...(state.assigned ?? [])];

    const indexAll = all.findIndex((x) => x.id === project.id);
    const indexAssigned = assigned.findIndex((x) => x.id === project.id);

    if (indexAll === -1) all.splice(0, 0, project);
    else all[indexAll] = project;

    if (indexAssigned === -1) assigned.splice(0, 0, project);
    else assigned[indexAssigned] = project;

    ctx.patchState({ all, assigned });
  }

  private patch(
    ctx: StateContext<StateModel>,
    all: Project[],
    assigned: Project[]
  ): void {
    ctx.patchState({
      all: all.sort((a, b) => sorter(a.lastModified, b.lastModified, 'desc')),
      assigned: assigned.sort((a, b) =>
        sorter(a.lastModified, b.lastModified, 'desc')
      ),
    });
  }
}
