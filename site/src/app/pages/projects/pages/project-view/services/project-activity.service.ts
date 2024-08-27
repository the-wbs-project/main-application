import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { PROJECT_ACTIONS } from '@wbs/pages/projects/models';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  changeProjectTitle(
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.TITLE_CHANGED, {
      from,
      to,
    });
  }

  changeProjectDescription(
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.DESCRIPTION_CHANGED, {
      from,
      to,
    });
  }

  changeProjectCategory(
    projectId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.CATEGORY_CHANGED, {
      from,
      to,
    });
  }

  changeProjectStatus(
    projectId: string,
    from: PROJECT_STATI_TYPE,
    to: PROJECT_STATI_TYPE
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.STATUS_CHANGED, {
      from,
      to,
    });
  }

  changeProjectDisciplines(
    projectId: string,
    from: string[],
    to: string[]
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.DISCIPLINES_CHANGED, {
      from,
      to,
    });
  }

  addUserToRole(
    projectId: string,
    user: UserViewModel,
    roleTitle: string
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.ADDED_USER, {
      role: roleTitle,
      user: user.userId,
      userName: user.fullName,
    });
  }

  removeUserToRole(
    projectId: string,
    user: UserViewModel,
    roleTitle: string
  ): Observable<void> {
    return this.save(projectId, PROJECT_ACTIONS.REMOVED_USER, {
      role: roleTitle,
      user: user.userId,
      userName: user.fullName,
    });
  }

  private save(
    topLevelId: string,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.saveLibraryEntryAsync([
      {
        id: IdService.generate(),
        timestamp: new Date(),
        action,
        data,
        topLevelId,
        userId: this.userId()!,
      },
    ]);
  }
}
