import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import {
  PROJECT_NODE_VIEW,
  PROJECT_STATI,
  Project,
  ProjectNode,
  UserRole,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { PROJECT_ACTIONS } from '@wbs/pages/projects/models';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectCreateStore } from './project-create.store';

@Injectable()
export class ProjectCreateService {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore);
  private readonly metadata = inject(MetadataStore);
  private readonly pcStore = inject(ProjectCreateStore);
  private readonly userId = inject(UserStore).userId;

  createAsync(): Observable<Project> {
    const catsPhases = this.metadata.categories.phases;
    const phases = this.pcStore.phases();
    const now = new Date();

    const project: Project = {
      id: IdService.generate(),
      owner: this.membership.membership()!.name,
      createdBy: this.userId()!,
      disciplines: this.pcStore.disciplines(),
      category: this.pcStore.category()!,
      description: this.pcStore.description(),
      mainNodeView: PROJECT_NODE_VIEW.PHASE,
      roles: this.getRoles(),
      status: PROJECT_STATI.PLANNING,
      title: this.pcStore.title(),
      createdOn: now,
      lastModified: now,
      recordId: '',
    };
    const nodes: ProjectNode[] = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];

      if (phase.isCustom) {
        nodes.push({
          description: phase.description,
          disciplineIds: [],
          id: phase.id,
          order: i + 1,
          projectId: project.id,
          title: phase.label,
          absFlag: null,
          createdOn: now,
          lastModified: now,
        });
      } else {
        const cat = catsPhases.find((x) => x.id === phase.id)!;

        nodes.push({
          disciplineIds: [],
          id: IdService.generate(),
          order: i + 1,
          projectId: project.id,
          createdOn: now,
          lastModified: now,
          phaseIdAssociation: cat.id,
          title: cat.label,
          description: cat.description,
          absFlag: null,
        });
      }
    }

    return this.data.projects.putAsync(project).pipe(
      switchMap(() =>
        this.data.projectNodes.putAsync(project.owner, project.id, nodes, [])
      ),
      switchMap(() =>
        this.data.activities.saveProjectActivitiesAsync(this.userId()!, [
          {
            data: {
              action: PROJECT_ACTIONS.CREATED,
              topLevelId: project.id,
              data: {
                title: project.title,
                id: project.id,
              },
            },
            project,
            nodes,
          },
        ])
      ),
      map(() => project)
    );
  }

  private getRoles(): UserRole[] {
    const roles: UserRole[] = [];

    for (const userId of this.pcStore.pmIds()) {
      roles.push({
        role: this.metadata.roles.ids.pm,
        userId,
      });
    }

    for (const userId of this.pcStore.smeIds()) {
      roles.push({
        role: this.metadata.roles.ids.sme,
        userId,
      });
    }

    for (const userId of this.pcStore.approverIds()) {
      roles.push({
        role: this.metadata.roles.ids.approver,
        userId,
      });
    }

    return roles;
  }
}
