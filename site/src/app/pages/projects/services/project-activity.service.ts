import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_STATI_TYPE, ContentResource } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { PROJECT_ACTIONS } from '@wbs/pages/projects/models';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  createProject(
    owner: string,
    projectId: string,
    title: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.CREATED, {
      title,
      id: projectId,
    });
  }

  changeProjectTitle(
    owner: string,
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.TITLE_CHANGED, {
      from,
      to,
    });
  }

  changeProjectDescription(
    owner: string,
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.DESCRIPTION_CHANGED, {
      from,
      to,
    });
  }

  changeProjectCategory(
    owner: string,
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.CATEGORY_CHANGED, {
      from,
      to,
    });
  }

  changeProjectStatus(
    owner: string,
    projectId: string,
    from: PROJECT_STATI_TYPE,
    to: PROJECT_STATI_TYPE
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.STATUS_CHANGED, {
      from,
      to,
    });
  }

  changeProjectDisciplines(
    owner: string,
    projectId: string,
    from: string[],
    to: string[]
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.DISCIPLINES_CHANGED, {
      from,
      to,
    });
  }

  addUserToRole(
    owner: string,
    projectId: string,
    user: UserViewModel,
    roleTitle: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.ADDED_USER, {
      role: roleTitle,
      user: user.userId,
      userName: user.fullName,
    });
  }

  removeUserToRole(
    owner: string,
    projectId: string,
    user: UserViewModel,
    roleTitle: string
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.REMOVED_USER, {
      role: roleTitle,
      user: user.userId,
      userName: user.fullName,
    });
  }

  projectUploaded(owner: string, projectId: string): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.UPLOADED, {});
  }

  resourceAdded(
    owner: string,
    projectId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.RESOURCE_ADDED, {
      resource,
    });
  }

  resourceReordered(
    owner: string,
    projectId: string,
    ids: string[]
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.RESOURCE_REORDERED, {
      ids,
    });
  }

  resourceRemoved(
    owner: string,
    projectId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.RESOURCE_REMOVED, {
      resource,
    });
  }

  resourceUpdated(
    owner: string,
    projectId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(owner, projectId, PROJECT_ACTIONS.RESOURCE_UPDATED, {
      resource,
    });
  }

  private save(
    owner: string,
    projectId: string,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.saveProjectAsync(owner, projectId, [
      {
        id: IdService.generate(),
        timestamp: new Date(),
        action,
        data,
        topLevelId: projectId,
        userId: this.userId()!,
      },
    ]);
  }
}
