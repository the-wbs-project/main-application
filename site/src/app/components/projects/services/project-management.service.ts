import { Injectable } from '@angular/core';
import { WbsNode } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';

@Injectable()
export class ProjectManagementService {
  createTask(
    parentId: string,
    model: Partial<WbsNode>,
    nodes: WbsNode[]
  ): WbsNode {
    const siblings = nodes?.filter((x) => x.parentId === parentId) ?? [];
    let order = 0;

    for (const x of siblings) {
      if (x.order > order) order = x.order;
    }
    order++;

    return <WbsNode>{
      ...model,
      id: IdService.generate(),
      parentId: parentId,
      order,
    };
  }
}
