import { inject, Injectable } from '@angular/core';
import { Project, PROJECT_STATI, ProjectNode } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { MetadataStore } from '@wbs/store';

@Injectable()
export class ProjectListService {
  private readonly metadata = inject(MetadataStore);

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

  getStatusResource(status: string | undefined): string {
    if (status === PROJECT_STATI.APPROVAL) return 'Projects.WaitingApproval';
    if (status === PROJECT_STATI.CLOSED) return 'General.Closed';
    if (status === PROJECT_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_STATI.PLANNING) return 'General.Planning';
    if (status === PROJECT_STATI.CANCELLED) return 'General.Cancelled';
    return '';
  }

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const definition = this.metadata.roles.definitions.find(
      (x) => x.id === role
    )!;

    return useAbbreviations ? definition.abbreviation : definition.description;
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
