import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppConfiguration, ProjectNode } from '@wbs/core/models';
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

  static getProjectApiUrl(
    appConfig: AppConfiguration,
    route: ActivatedRouteSnapshot
  ): string {
    return [
      appConfig.api_domain,
      'api',
      'portfolio',
      Utils.getParam(route, 'org'),
      'projects',
      Utils.getParam(route, 'projectId'),
    ].join('/');
  }

  static getTaskUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      ...ProjectService.getProjectUrl(route),
      'tasks',
      Utils.getParam(route, 'taskId'),
    ];
  }

  static getTaskApiUrl(
    appConfig: AppConfiguration,
    route: ActivatedRouteSnapshot
  ): string {
    return [
      appConfig.api_domain,
      'api',
      'portfolio',
      Utils.getParam(route, 'org'),
      'projects',
      Utils.getParam(route, 'projectId'),
      'nodes',
      Utils.getParam(route, 'taskId'),
    ].join('/');
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
    parentId: string | undefined,
    model: Partial<ProjectNode>,
    nodes: ProjectNode[]
  ): ProjectNode {
    const ts = new Date();
    const siblings = nodes?.filter((x) => x.parentId == parentId) ?? [];
    let order =
      siblings.length === 0 ? 1 : Math.max(...siblings.map((x) => x.order)) + 1;

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
