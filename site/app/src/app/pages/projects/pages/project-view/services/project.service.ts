import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProjectNode } from '@wbs/core/models';
import { IdService, Utils } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { WbsNodeView } from '@wbs/core/view-models';

@Injectable()
export class ProjectService {
  private readonly metadata = inject(MetadataStore);
  protected readonly store = inject(Store);

  static getProjectUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      '/',
      Utils.getParam(route, 'org'),
      'projects',
      'view',
      Utils.getParam(route, 'projectId'),
    ];
  }

  static getTaskUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      ...ProjectService.getProjectUrl(route),
      'tasks',
      Utils.getParam(route, 'taskId'),
    ];
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

  getPhaseIds(nodes: ProjectNode[] | WbsNodeView[]): string[] {
    return nodes.filter((x) => x.parentId == null).map((x) => x.id);
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
