import { Injectable } from '@angular/core';
import {
  Project,
  PROJECT_STATI,
  PROJECT_VIEW_STATI,
  ProjectNode,
  ROLES,
} from '../models';
import { IdService } from './id.service';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly resources: Resources) {}

  filter(projects: Project[] | null | undefined, status: string): Project[] {
    if (status === PROJECT_VIEW_STATI.ACTIVE)
      return (projects ?? []).filter((x) => x.status !== PROJECT_STATI.CLOSED);

    return (projects ?? []).filter((x) => x.status === status);
  }

  getStatus(status: string): string {
    return this.resources.get(this.getStatusResource(status));
  }

  getStatusResource(status: string): string {
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

    const suffix = useAbbreviations ? '' : '-Full';

    if (role === ROLES.ADMIN)
      return this.resources.get('General.Admin' + suffix);
    if (role === ROLES.PM) return this.resources.get('General.PM' + suffix);
    if (role === ROLES.APPROVER) return this.resources.get('General.Approver');
    if (role === ROLES.SME) return this.resources.get('General.SME' + suffix);

    return '';
  }

  createTask(
    parentId: string,
    model: Partial<ProjectNode>,
    nodes: ProjectNode[]
  ): ProjectNode {
    const siblings = nodes?.filter((x) => x.parentId === parentId) ?? [];
    let order = 0;

    for (const x of siblings) {
      if (x.order > order) order = x.order;
    }
    order++;

    return <ProjectNode>{
      ...model,
      id: IdService.generate(),
      parentId: parentId,
      order,
    };
  }
}
