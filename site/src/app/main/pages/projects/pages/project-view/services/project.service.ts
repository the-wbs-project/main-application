import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProjectNode } from '@wbs/core/models';
import { IdService, Resources } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Utils } from '@wbs/main/services';
import { RoleState } from '@wbs/main/states';

@Injectable()
export class ProjectService {
  protected readonly resources = inject(Resources);
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

  getTypeText(type: string | undefined): string {
    if (type === 'assigned') return this.resources.get('General.AssignedToMe');
    if (type === 'all') return this.resources.get('General.All');
    return '';
  }

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const definition = this.store
      .selectSnapshot(RoleState.definitions)!
      .find((x) => x.id === role)!;

    return this.resources.get(
      useAbbreviations ? definition.abbreviation : definition.description
    );
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
