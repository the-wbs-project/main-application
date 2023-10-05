import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PermissionFilter, Permissions, Project } from '@wbs/core/models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthState, RolesState } from '../states';

@Injectable()
export class ProjectPermissionsService {
  private permissions?: Permissions;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  check(
    permissions: Map<string, boolean>,
    filter: string | PermissionFilter
  ): boolean {
    if (typeof filter === 'string') return permissions.get(filter) ?? false;
    if (filter.keys.length === 1)
      return permissions.get(filter.keys[0]) ?? false;

    if (filter.op === 'and')
      return filter.keys.every((key) => permissions.get(key) ?? false);

    return filter.keys.some((key) => permissions.get(key) ?? false);
  }

  getPermissionsByIdAsync(
    owner: string,
    projectId: string
  ): Observable<Map<string, boolean>> {
    return this.data.projects
      .getAsync(owner, projectId)
      .pipe(switchMap((p) => this.getPermissionsAsync(p)));
  }

  getPermissionsAsync(project: Project): Observable<Map<string, boolean>> {
    console.log('getting permissions');

    return forkJoin({
      defintions: this.getDefintions(),
      myRoles: this.store.selectOnce(RolesState.orgRoles),
      roleDefinitions: this.store.selectOnce(RolesState.definitions),
      userId: this.store.selectOnce(AuthState.userId),
    }).pipe(
      map(({ defintions, myRoles, roleDefinitions, userId }) => ({
        defintions,
        roleDefinitions,
        myRoles: myRoles ?? [],
        userId: userId!,
      })),
      map(({ defintions, myRoles, roleDefinitions, userId }) => {
        const results = new Map<string, boolean>();
        const myProjectRoles = project.roles
          .filter((x) => x.userId === userId && myRoles.includes(x.role))
          .map((pr) => roleDefinitions.find((rd) => rd.id === pr.role)!.name);

        console.log(myProjectRoles);

        for (const key of Object.keys(defintions)) {
          const roles = defintions[key];

          results.set(
            key,
            roles.some((r) => myProjectRoles.includes(r))
          );
        }

        return results;
      })
    );
  }

  private getDefintions(): Observable<Permissions> {
    return this.permissions
      ? of(this.permissions)
      : this.data.permissions
          .getAsync('projects')
          .pipe(tap((p) => (this.permissions = p)));
  }
}
