import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { RolesState } from '@wbs/main/states';
import { Project, PROJECT_STATI, ProjectNode } from '../models';
import { IdService } from './id.service';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  filterByStati(
    projects: Project[] | null | undefined,
    stati: string[]
  ): Project[] {
    if (!projects || stati.length === 0) return [];

    return projects.filter((x) => stati.includes(x.status));
  }

  filterByCategories(
    projects: Project[] | null | undefined,
    categories: string[]
  ): Project[] {
    if (!projects || categories.length === 0) return [];

    return projects.filter((x) => categories.includes(x.category));
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

  getTypeText(type: string | undefined): string {
    if (type === 'assigned') return this.resources.get('General.AssignedToMe');
    if (type === 'all') return this.resources.get('General.All');
    return '';
  }

  getStatusResource(status: string | undefined): string {
    if (status === PROJECT_STATI.APPROVAL) return 'Projects.WaitingApproval';
    if (status === PROJECT_STATI.CLOSED) return 'General.Closed';
    if (status === PROJECT_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_STATI.PLANNING) return 'General.Planning';
    if (status === PROJECT_STATI.ARCHIVED) return 'General.Archived';
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
