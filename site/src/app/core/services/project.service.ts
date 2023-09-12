import { Injectable } from '@angular/core';
import {
  Project,
  PROJECT_STATI,
  PROJECT_VIEW_STATI,
  ProjectNode,
} from '../models';
import { IdService } from './id.service';
import { Resources } from './resource.service';
import { Store } from '@ngxs/store';
import { RolesState } from '@wbs/main/states';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  filterByStatus(
    projects: Project[] | null | undefined,
    status: string
  ): Project[] {
    if (status === PROJECT_VIEW_STATI.ACTIVE)
      return (projects ?? []).filter((x) => x.status !== PROJECT_STATI.CLOSED);

    return (projects ?? []).filter((x) => x.status === status);
  }

  filterByName(
    projects: Project[] | null | undefined,
    text: string
  ): Project[] {
    return (projects ?? []).filter((x) =>
      (x.title ?? '').toLowerCase().includes(text.toLowerCase())
    );
  }

  getStatus(status: string | undefined): string {
    return this.resources.get(this.getStatusResource(status));
  }

  getStatusResource(status: string | undefined): string {
    if (status === PROJECT_VIEW_STATI.ACTIVE) return 'General.Active';
    if (status === PROJECT_VIEW_STATI.APPROVAL)
      return 'Projects.WaitingApproval';
    if (status === PROJECT_VIEW_STATI.CLOSED) return 'General.Closed';
    if (status === PROJECT_VIEW_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_VIEW_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_VIEW_STATI.PLANNING) return 'General.Planning';
    return '';
  }

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const definition = this.store
      .selectSnapshot(RolesState.definitions)!
      .find((x) => x.id === role)!;

    return this.resources.get(
      useAbbreviations ? definition.abbreviation : definition.description
    );
  }

  createTask(
    projectId: string,
    parentId: string,
    model: Partial<ProjectNode>,
    nodes: ProjectNode[]
  ): ProjectNode {
    const siblings = nodes?.filter((x) => x.parentId === parentId) ?? [];
    const ts = new Date();
    let order = 0;

    for (const x of siblings) {
      if (x.order > order) order = x.order;
    }
    order++;

    return <ProjectNode>{
      ...model,
      id: IdService.generate(),
      parentId,
      projectId,
      order,
      createdOn: ts,
      lastModified: ts,
    };
  }
}
